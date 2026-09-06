/**
 * The accessibility tabs that read the page — the Control Panel half.
 *
 * Loaded only when one of them is first opened. Nothing here is imported by
 * cp.js, bridge.js or anything the front end serves: the checks read the
 * preview document across the frame the way the comments pins do, so a page
 * nobody has asked to measure carries not one byte of it.
 *
 * The measuring itself is in cp/a11y/contrast.js and cp/a11y/checks.js, and
 * neither knows about any of this. Everything below is only ever: find the
 * preview, run one of those, draw it, and take it all down again.
 *
 * Both tabs share this file because they differ in one thing — which function
 * reads the page — and agree on everything else: when to re-read it, how to
 * mark it, and what a click does.
 */
import { sve } from './cp-registry.js';
import { t } from './cp-t.js';
import { mountPane, unmountPane } from './cp/mount-pane.js';
import { a11yUi, paneUi, markerUi, treeUi } from './cp/a11y/store.js';
import { scanContrast, contrastCounts } from './cp/a11y/contrast.js';
import { scanChecks, checkCounts, CHECK_GROUPS } from './cp/a11y/checks.js';
import { scanTree } from './cp/a11y/tree.js';
import A11yPane from './cp/surfaces/A11yPane.vue';
import A11yMarkers from './cp/surfaces/A11yMarkers.vue';
import A11yTree from './cp/surfaces/A11yTree.vue';
import paneCss from '../css/a11y.css?inline';

const OVERLAY_ID = '__sve-a11y-overlay';
const STYLE_ID = '__sve-a11y-style';
const MARKER_Z = 46;

/** A morph is hundreds of mutations; the panel wants the settled page. */
const SETTLE_MS = 500;

/**
 * How many pills the page gets at once.
 *
 * Every fault deserves one, but a page with a thousand of them is a page nobody
 * can read — and a thousand fixed-position nodes repositioned on every scroll
 * frame is the one way this could make Live Preview slow. The list in the panel
 * stays complete either way; only the marking is capped.
 */
const MAX_MARKERS = 80;

let kind = '';
let host = null;
let groups = [];
let watched = null;
let observer = null;
let settleTimer = 0;
let frame = 0;
let follow = null;
let hovered = '';
let cycle = new Map();
/** Which category pill is picked. Empty is "all of them". */
let picked = '';
/** Tree nodes folded shut, by path. Survives a rescan; the page rarely moves. */
const shut = new Set();

function previewIframe(win) {
  const direct = win.document.getElementById('live-preview-iframe');

  if (direct) {
    return direct;
  }

  for (const el of win.document.querySelectorAll('iframe')) {
    try {
      const inner = el.contentDocument?.getElementById('live-preview-iframe');

      if (inner) {
        return inner;
      }
    } catch {
      /* cross-origin */
    }
  }

  return null;
}

function previewCtx(win) {
  const iframe = previewIframe(win);

  if (!iframe) {
    return null;
  }

  try {
    const frameWin = iframe.contentWindow;
    const doc = iframe.contentDocument;

    if (!frameWin || !doc?.body) {
      return null;
    }

    return { iframe, win: frameWin, doc };
  } catch {
    return null;
  }
}

/**
 * The panel's stylesheet, carried inside this chunk as a string.
 *
 * Vite would otherwise emit it as a file fetched from `/build/`, which is not
 * where a published addon lives — the link 404s in silence and the panel
 * renders as naked HTML. See the note at the top of css/a11y.css.
 */
function ensureStyle(win) {
  if (win.document.getElementById(STYLE_ID)) {
    return;
  }

  const style = win.document.createElement('style');

  style.id = STYLE_ID;
  style.textContent = paneCss;
  win.document.head.appendChild(style);
}

function overlay(win) {
  let el = win.document.getElementById(OVERLAY_ID);

  if (el) {
    return el;
  }

  el = win.document.createElement('div');
  el.id = OVERLAY_ID;
  // A zero-size anchor, not a covering sheet: a full-screen layer over the
  // preview swallows every click meant for the page underneath it.
  el.style.cssText = 'position:absolute;width:0;height:0;overflow:visible;';
  win.document.body.appendChild(el);

  return el;
}

// --- The two readings ------------------------------------------------------
// Each turns its scanner's output into the one row shape the pane draws, and
// says what to write on the pill over each element it found.

const READINGS = {
  contrast: {
    scan: (doc) => scanContrast(doc),
    counts: (found, win) =>
      Object.entries(contrastCounts(found)).map(([level, n]) => ({
        level,
        n,
        label: t(win, `contrast_count_${level}`),
      })),
    /** Failures and near-misses by default; the passes on request. */
    visible: (found) => (paneUi.toggleOn ? found : found.filter((g) => g.level !== 'pass')),
    bad: (found) => found.filter((g) => g.level === 'fail').length,
    marker: (group) => (group.unknown ? '?' : group.ratio.toFixed(1)),
    row: (group, win) => ({
      key: group.key,
      level: group.level,
      tag: group.unknown ? '?' : group.ratio.toFixed(1),
      title: group.text || t(win, 'contrast_blank'),
      help: t(win, group.large ? 'contrast_meta_large' : 'contrast_meta_normal'),
      fg: group.fg,
      bg: group.bg,
      n: group.count > 1 ? group.count : 0,
      tip: contrastTip(win, group),
    }),
    empty: (found, win) =>
      t(win, found.length ? 'contrast_all_good' : 'contrast_empty'),
  },
  tree: {
    scan: (doc) => scanTree(doc, { generic: treeUi.showAll }),
    /**
     * The tree draws no pills over the page. Every node is a node — marking
     * them all would trace the whole document, and the tree already is that
     * tracing, in a place where it can be read.
     */
    marks: false,
    component: A11yTree,
    render: (win) => renderTree(win),
    bad: (rows) => rows.filter((row) => row.issue === 'error').length,
  },
  checks: {
    scan: (doc) => scanChecks(doc),
    counts: (found, win) =>
      Object.entries(checkCounts(found)).map(([level, n]) => ({
        level,
        n,
        label: t(win, `check_count_${level}`),
      })),
    visible: (found) => found,
    /**
     * One pill per category that actually has something in it, in a fixed
     * order — a filter leading to an empty list is a click nobody wanted, and
     * pills that reorder themselves as the page changes cannot be aimed at.
     */
    groups: (found, win) => {
      const present = CHECK_GROUPS.filter((key) => found.some((f) => f.group === key));

      if (present.length < 2) {
        return [];
      }

      return [
        { key: '', label: t(win, 'check_group_all'), on: picked === '' },
        ...present.map((key) => ({
          key,
          label: t(win, `check_group_${key}`),
          on: picked === key,
        })),
      ];
    },
    bad: (found) => found.filter((f) => f.level === 'error').length,
    marker: () => '!',
    row: (finding, win) => ({
      key: finding.rule,
      level: finding.level,
      tag: finding.page ? '!' : String(finding.count),
      title: t(win, `check_${finding.rule}`),
      help: t(win, `check_${finding.rule}_help`),
      fg: '',
      bg: '',
      n: 0,
      tip: t(win, `check_${finding.rule}_help`),
    }),
    empty: (found, win) => t(win, found.length ? 'check_all_good' : 'check_all_good'),
  },
};

function contrastTip(win, group) {
  if (group.unknown) {
    return t(win, 'contrast_title_unknown');
  }

  const base = t(win, group.large ? 'contrast_title_large' : 'contrast_title_normal', {
    ratio: group.ratio.toFixed(2),
  });

  // Text on a two-tone gradient has a range, not a number. The row shows the
  // worst end, because that is the end that decides — the tooltip says both.
  if (!group.spread) {
    return base;
  }

  return `${base}\n${t(win, 'contrast_title_spread', {
    low: group.ratio.toFixed(1),
    high: group.spread.toFixed(1),
  })}`;
}

function reading() {
  return READINGS[kind] || READINGS.contrast;
}

function visibleGroups() {
  const list = reading().visible(groups);

  return picked ? list.filter((group) => group.group === picked) : list;
}

/**
 * Place the pills over the preview.
 *
 * Recomputed whole on every scroll rather than remembered, for the same reason
 * the heading outline is: the page re-renders under us constantly, and a
 * remembered position is a position for a page that has moved on.
 */
function layout(win) {
  const ctx = previewCtx(win);

  if (!ctx || !kind || reading().marks === false) {
    markerUi.markers = [];

    return;
  }

  const ir = ctx.iframe.getBoundingClientRect();
  const scaleX = ir.width / (ctx.win.innerWidth || ir.width || 1);
  const scaleY = ir.height / (ctx.win.innerHeight || ir.height || 1);
  const label = reading().marker;
  const markers = [];

  for (const group of visibleGroups()) {
    for (const el of group.els) {
      if (markers.length >= MAX_MARKERS) {
        break;
      }

      if (!el.isConnected) {
        continue;
      }

      const rect = el.getBoundingClientRect();
      const left = ir.left + rect.left * scaleX;
      const top = ir.top + rect.top * scaleY;

      // Off the visible strip of the iframe: not scrolled to, so not drawn.
      if (top < ir.top - 8 || top > ir.bottom + 8 || left < ir.left - 40 || left > ir.right) {
        continue;
      }

      markers.push({
        id: `${group.key || group.rule}#${markers.length}`,
        key: group.key || group.rule,
        level: group.level,
        label: label(group),
        title: group.text || '',
        dim: !!hovered && hovered !== (group.key || group.rule),
        left: Math.max(ir.left, left),
        top: Math.max(ir.top + 6, top + 6),
        z: MARKER_Z,
      });
    }
  }

  markerUi.markers = markers;
}

/**
 * Show the fade only while there is something past the right edge — otherwise
 * it reads as a shadow on a row that has nothing more to give.
 */
function syncGroupsFade(win) {
  win.requestAnimationFrame(() => {
    const el = host?.querySelector('[data-sve-a11y-groups]');
    const fade = host?.querySelector('[data-sve-a11y-groups-fade]');

    if (!el || !fade) {
      return;
    }

    const more = el.scrollWidth - el.clientWidth - el.scrollLeft > 1;

    fade.style.display = more ? 'block' : 'none';
  });
}

function scheduleLayout(win) {
  if (frame) {
    return;
  }

  frame = win.requestAnimationFrame(() => {
    frame = 0;
    layout(win);
  });
}

/** Read the page and redraw both halves. */
function scan(win) {
  const ctx = previewCtx(win);

  if (!ctx) {
    paneUi.ready = false;
    paneUi.emptyText = t(win, 'loading');

    return;
  }

  const mode = reading();

  groups = mode.scan(ctx.doc);
  cycle = new Map();

  a11yUi.scanned[kind] = true;
  a11yUi.found[kind] = mode.bad(groups);

  if (mode.render) {
    mode.render(win);
    watch(win, ctx);
    layout(win);

    return;
  }

  const chips = mode.groups ? mode.groups(groups, win) : [];

  // A category can empty out while its pill is picked — the page was fixed, or
  // it was never on this page. Fall back to all rather than show nothing.
  if (picked && !chips.some((chip) => chip.key === picked)) {
    picked = '';
  }

  paneUi.ready = true;
  paneUi.counts = mode.counts(groups, win);
  paneUi.emptyText = mode.empty(groups, win);
  paneUi.groups = chips.map((chip) => ({ ...chip, on: chip.key === picked }));
  paneUi.showGroups = chips.length > 0;
  paneUi.rows = visibleGroups().map((group) => mode.row(group, win));
  syncGroupsFade(win);

  watch(win, ctx);
  layout(win);
}

function settle(win) {
  win.clearTimeout(settleTimer);
  settleTimer = win.setTimeout(() => scan(win), SETTLE_MS);
}

/**
 * Keep up with the page while a tab is open — and only while it is open.
 * Watching costs little; watching for a panel nobody opened should cost nothing.
 */
function watch(win, ctx) {
  if (watched === ctx.doc && observer) {
    return;
  }

  observer?.disconnect();
  watched = ctx.doc;
  observer = new win.MutationObserver(() => settle(win));
  observer.observe(ctx.doc.body, { childList: true, subtree: true, characterData: true });

  bindFollow(win, ctx);
}

function unbindFollow(win) {
  if (!follow) {
    return;
  }

  follow.previewWin?.removeEventListener('scroll', follow.onMove);
  follow.iframe?.removeEventListener('load', follow.onStructure);
  win.removeEventListener('scroll', follow.onMove);
  win.removeEventListener('resize', follow.onMove);
  win.document.removeEventListener('sve-page-structure', follow.onStructure);
  follow = null;
}

function bindFollow(win, ctx) {
  unbindFollow(win);

  const onMove = () => scheduleLayout(win);
  const onStructure = () => settle(win);

  follow = { previewWin: ctx.win, iframe: ctx.iframe, onMove, onStructure };
  ctx.win.addEventListener('scroll', onMove, { passive: true });
  win.addEventListener('scroll', onMove, { passive: true });
  win.addEventListener('resize', onMove, { passive: true });
  win.document.addEventListener('sve-page-structure', onStructure);
  // The iframe element outlives the documents inside it. When one is replaced
  // the observer on the old document dies with it, and without this the panel
  // would keep showing findings for a page that is no longer on screen.
  ctx.iframe.addEventListener('load', onStructure);
}

/**
 * The tree as rows to draw: folded subtrees dropped, and each node told whether
 * it has anything under it.
 *
 * Folding is applied here rather than in the scanner, so opening and shutting a
 * branch never costs a re-read of the page — the scan is the expensive half and
 * nothing about the page changed by clicking a triangle.
 */
function renderTree(win) {
  const rows = [];
  let hideBelow = null;

  groups.forEach((node, i) => {
    if (hideBelow !== null) {
      if (node.depth > hideBelow) {
        return;
      }

      hideBelow = null;
    }

    const next = groups[i + 1];
    const hasChildren = !!next && next.depth > node.depth;
    const folded = hasChildren && shut.has(node.path);

    rows.push({
      path: node.path,
      depth: node.depth,
      role: node.role,
      name: node.name,
      tag: `<${node.tag}>`,
      issue: node.issue,
      hasChildren,
      shut: folded,
      missingLabel: t(win, 'tree_no_name'),
      tip: node.why ? t(win, `tree_issue_${node.why}`) : `${node.role} <${node.tag}>`,
    });

    if (folded) {
      hideBelow = node.depth;
    }
  });

  treeUi.rows = rows;
  treeUi.emptyText = t(win, 'tree_empty');
  treeUi.note = groups.truncated ? t(win, 'tree_truncated') : '';
}

/** Scroll the preview to an element and open whatever owns it in the panel. */
function focusElement(win, el) {
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  scheduleLayout(win);

  if (!sve.autoOpenPanel?.(win)) {
    return;
  }

  const field = el.closest('[data-sid-field]');
  const scope = field?.getAttribute('data-sid-field-uid');

  if (field && scope && sve.focusPanelOn?.(win)) {
    sve.focusFieldOwner(field.getAttribute('data-sid-field'), scope, win.document, win);

    return;
  }

  const uid = el.closest('[data-sid]')?.getAttribute('data-sid');

  if (uid) {
    sve.focusFromPreview(uid, win.document, win, { clampToSection: true });
  }
}

/**
 * Clicking a row (or a pill): scroll the preview to it, and open the block that
 * owns it in the editor panel — the same two things the heading outline does,
 * for the same reason. A repeated click walks to the next place the same fault
 * appears, because a group is one decision made in several places at once.
 */
function jump(win, key) {
  const group = groups.find((item) => (item.key || item.rule) === key);

  if (!group) {
    return;
  }

  paneUi.active = key;

  const live = group.els.filter((el) => el.isConnected);

  if (!live.length) {
    return;
  }

  const at = (cycle.get(key) || 0) % live.length;
  const el = live[at];

  cycle.set(key, at + 1);
  focusElement(win, el);
}

/** Mount one of the reading tabs into the pane it was given, and start it. */
export function openA11yTab(win, el, which) {
  // Switching between two reading tabs: the one being left keeps its Vue app
  // bound to the same store, so it would go on re-rendering the other tab's
  // findings behind a hidden panel.
  if (host && host !== el) {
    unmountPane(host);
  }

  kind = READINGS[which] ? which : 'contrast';
  host = el;
  picked = '';

  ensureStyle(win);

  paneUi.hint = t(win, `${kind}_hint`);
  paneUi.emptyText = t(win, 'loading');
  paneUi.ready = false;
  paneUi.active = '';
  paneUi.showToggle = kind === 'contrast';
  paneUi.toggleLabel = t(win, 'contrast_show_pass');
  paneUi.onJump = (key) => jump(win, key);
  paneUi.onHover = (key) => {
    hovered = key;
    scheduleLayout(win);
  };
  paneUi.onToggle = () => {
    paneUi.toggleOn = !paneUi.toggleOn;
    scan(win);
  };
  paneUi.showGroups = false;
  paneUi.groups = [];
  paneUi.onGroup = (key) => {
    picked = key || '';
    scan(win);
  };

  markerUi.onPick = (key) => jump(win, key);

  treeUi.hint = t(win, 'tree_hint');
  treeUi.emptyText = t(win, 'loading');
  treeUi.showAllLabel = t(win, 'tree_show_all');
  treeUi.active = '';
  treeUi.onPick = (path) => {
    const node = groups.find((row) => row.path === path);

    treeUi.active = path;

    if (node?.el?.isConnected) {
      focusElement(win, node.el);
    }
  };
  treeUi.onTwist = (path) => {
    if (shut.has(path)) {
      shut.delete(path);
    } else {
      shut.add(path);
    }

    renderTree(win);
  };
  treeUi.onToggleAll = () => {
    treeUi.showAll = !treeUi.showAll;
    scan(win);
  };

  mountPane(el, reading().component || A11yPane);
  mountPane(overlay(win), A11yMarkers);
  el.querySelector('[data-sve-a11y-groups]')?.addEventListener('scroll', () => syncGroupsFade(win));
  scan(win);
}

/** Take everything down: no observers, no listeners, no pills, no findings. */
export function closeA11yTab(win) {
  kind = '';
  hovered = '';
  paneUi.active = '';
  paneUi.rows = [];
  paneUi.counts = [];
  paneUi.groups = [];
  paneUi.showGroups = false;
  paneUi.ready = false;
  picked = '';
  observer?.disconnect();
  observer = null;
  watched = null;
  win.clearTimeout(settleTimer);
  win.cancelAnimationFrame(frame);
  frame = 0;
  unbindFollow(win);

  const el = win.document.getElementById(OVERLAY_ID);

  if (el) {
    unmountPane(el);
    el.remove();
  }

  markerUi.markers = [];
  treeUi.rows = [];
  treeUi.active = '';
  groups = [];
  cycle = new Map();

  if (host) {
    unmountPane(host);
    host = null;
  }
}

sve.openA11yTab = openA11yTab;
sve.closeA11yTab = closeA11yTab;
