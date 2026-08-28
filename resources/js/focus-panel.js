/**
 * Settings toggle: `focus_panel`
 * Focus panel and open-in-first-section.
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { sve } from './cp-registry.js';
import { t } from './cp-t.js';
import { sveState } from './cp-state.js';
import { COLLAPSE_SETTLE_MS, SELECTORS } from './cp-selectors.js';
import {
  ownDescendants,
  panelIcon,
  revealSegmentsFor,
  sectionFieldLists,
  setSectionGroup,
  SECTION_ACTIVE_ATTR,
  SECTION_GROUP_ATTR,
  SECTION_SEG_ATTR,
} from './cp-section-groups.js';
import {
  HEADER_TOOLBAR_ID,
  applyHeaderTab,
  applySectionsFieldVisibility,
  collapseSet,
  collectAncestorSets,
  enhanceGrids,
  ensureHeaderToolbar,
  ensureLpBackButton,
  ensureLpPreviewChrome,
  ensureSettingsTabs,
  expandSet,
  findFieldElement,
  findSetByUid,
  fireTabClick,
  frameId,
  getUidFromSet,
  isSetCollapsed,
  nativeTabButtons,
  openFirstSectionOnce,
  openSettingsTab,
  positionLpBackButton,
  removeLpBackButton,
  restoreDockedHeaderPanels,
  topLevelSectionUid,
  watchStatamicLpClose,
} from './cp.js';
import {
  closeCodeDock,
  isCodeDockArmed,
  relayoutCodeDock,
  syncCodeDock,
  templateDockAllowed,
} from './code-dock.js';
import { ensureLpMoreButton } from './lp-more-menu.js';
import { relayoutAiPanel } from './ai-panel.js';
import { mountPane } from './cp/mount-pane.js';
import { chromeGet, chromeSet } from './chrome-prefs.js';
import SoloPills from './cp/surfaces/SoloPills.vue';

// ===== solo =====
// --- Single-section ("solo") panel ---------------------------------------------
// Clicking a section in the preview opens the editor panel showing ONLY that
// section's fields — instead of the whole page_sections list. Isolation is done
// the Vue-safe way: mark the path from the section's set up to the editor root
// with attributes, then hide everything else via an injected <style>. We never
// insert nodes into, or set inline display on, Statamic's Vue-managed field
// tree — doing so corrupts Vue's virtual-DOM diffing and tears the whole form
// down. A MutationObserver re-applies the marks whenever Vue re-renders the
// fields (e.g. when a set is expanded), so isolation survives re-renders.

export const SOLO_STYLE_ID = 'sve-solo-style';
export const SOLO_BACK_ID = 'sve-solo-back';
export const SOLO_SAVE_ID = 'sve-solo-save';
export const SOLO_HOST_ID = '__sve-solo-host';
export const SOLO_PARENT_ATTR = 'data-sve-solo-parent';
export const SOLO_KEEP_ATTR = 'data-sve-solo-keep';
/** Panel-iframe isolation: mark nodes to hide, instead of parent>child solo CSS. */
export const PANEL_AWAY_ATTR = 'data-sve-panel-away';
export const PANEL_COLUMN_ATTR = 'data-sve-panel-column'; // the sve-panel frame's scrolling column

// The set whose blocks this visit has already folded. Cleared on the way to
// another one, so stepping out of a block and back into its section folds again.

/** Removes all solo marks, the injected style, the observer and the back button. */
export function clearSolo(doc) {
  sveState.soloUid = null;
  sveState.soloAncestors = null;
  soloBackAction = null;
  sveState.foldedFor = null;

  const win = doc.defaultView || window;
  const lpOpen = !!doc.querySelector('.live-preview-editor');

  if (lpOpen && isCodeDockArmed(win) && templateDockAllowed(win)) {
    syncCodeDock(win, doc, null);
  } else {
    closeCodeDock(doc);
  }
  relayoutAiPanel(doc.defaultView || window);
  clearFocus(doc);

  if (sveState.soloObserver) {
    sveState.soloObserver.disconnect();
    sveState.soloObserver = null;
  }

  doc.getElementById(SOLO_STYLE_ID)?.remove();
  doc.getElementById(SOLO_HOST_ID)?.remove();
  doc.getElementById(SOLO_BACK_ID)?.remove();
  doc.getElementById(SOLO_SAVE_ID)?.remove();
  doc.querySelectorAll(`[${SOLO_PARENT_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_PARENT_ATTR));
  doc.querySelectorAll(`[${SOLO_KEEP_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_KEEP_ATTR));
  doc.querySelectorAll(`[${PANEL_AWAY_ATTR}]`).forEach((el) => el.removeAttribute(PANEL_AWAY_ATTR));
}

/**
 * How far up the isolation reaches: the panel's scrolling column, not the pane
 * around it.
 *
 * The editor pane holds two things — the column of fields and the handle that
 * drags its width. Marking up to the pane makes the handle an off-path child of a
 * marked parent, and the stylesheet below hides it: the panel could be resized
 * while showing the whole page and not while showing one section of it. Stopping
 * at the column leaves everything beside it alone.
 */
export function soloRoot(doc) {
  if (panelFrameDoc(doc)) {
    // Prefer a root that actually contains the section set. The first
    // `.publish-fields` on the page can be a nested/empty wrapper that does
    // NOT contain page_sections — markPanelIsolate then fails (set not
    // contained), soloSection still returned true, and the sidebar stayed on
    // title/Published forever.
    const section = doc.querySelector(SELECTORS.replicatorSet);
    const fromSet =
      section?.closest('.publish-form') ||
      section?.closest('main') ||
      section?.closest('.publish-fields');

    if (fromSet) {
      return fromSet;
    }

    return (
      doc.querySelector('.publish-form') ||
      doc.querySelector('main') ||
      doc.querySelector('.publish-fields')
    );
  }

  return (
    doc.querySelector('.live-preview-fields') ||
    doc.querySelector('.live-preview-editor')
  );
}

/** True when this document is the sve-panel iframe (globals / saved section). */
export function panelFrameDoc(doc) {
  try {
    return new URLSearchParams(doc.defaultView?.location?.search || '').has('sve-panel');
  } catch {
    return false;
  }
}

export function ensureSoloStyle(doc) {
  const existing = doc.getElementById(SOLO_STYLE_ID);

  // Panel iframe uses away-marks (safe under Vue re-renders). Live Preview keeps
  // the classic parent>keep path CSS.
  const css = panelFrameDoc(doc)
    ? `[${PANEL_AWAY_ATTR}] { display: none !important; }`
    : `[${SOLO_PARENT_ATTR}] > *:not([${SOLO_KEEP_ATTR}]) { display: none !important; }`;

  if (existing) {
    if (existing.textContent !== css) {
      existing.textContent = css;
    }

    return;
  }

  const style = doc.createElement('style');

  style.id = SOLO_STYLE_ID;
  style.textContent = css;
  doc.head.appendChild(style);
}

/** What the back pill does, when it is not simply leaving the solo view. */
export let soloBackAction = null;

/** Leaves the solo view: back to the whole form, in whatever mode is selected. */
export function leaveSolo(doc, win) {
  // Synced-section panel: "back" means leave the global edit, not the entry meta form.
  if (panelFrameDoc(doc) && win.location.pathname.includes('/collections/')) {
    win.parent.postMessage(
      { source: 'statamic-visual-editor', type: 'request-close-global' },
      win.location.origin
    );

    return;
  }

  // Same when the synced entry's form is mounted here: "all sections" means the
  // page's sections. Dropping the solo would instead show the library entry's own
  // form — Navn, Synkroniseret, Published — which is not a place to step back to.
  if (sve.globalSectionHost(doc)) {
    sve.handleRequestCloseGlobal(win);

    return;
  }

  // Stepping out of a widget inside the header goes back to the header, the way
  // a block steps back into the section holding it. Leaving the header itself is
  // the bar's job, not this one's.
  if (sve.chromeHost(doc) && sve.chromeInlineKind) {
    const kind = sve.chromeInlineKind;

    clearSolo(doc);
    sve.soloChromeTab(win, doc, kind);
    sve.watchChromeSolo(win, doc, kind);

    return;
  }

  // Leaving a settings view hands the panel back to whatever mode is selected;
  // leaving an ordinary solo view leaves the panel exactly as it was.
  const wasSettings = sveState.forcePanelOpen;

  sveState.forcePanelOpen = false;
  clearSolo(doc);

  if (wasSettings) {
    sve.setLpCollapsed(win, sve.lpMode(win) !== 'show');
  }
}

/**
 * Back-to-full-form control, appended to the body (outside the Vue tree). When a
 * `saveUid` is given (settings view), a "Gem sektion" button is placed beside it
 * so the section can be saved as a template right from the panel — the same
 * action as the hover control's bookmark, offered "begge steder".
 *
 * `back` re-points it: a focused block goes back to the section it sits in, named
 * after that section, rather than all the way out. The pill is built once and
 * relabelled on later passes — a step deeper is a new destination, not a new
 * button, and rebuilding it would lose its place in the header.
 */
export function addSoloBackButton(doc, win, saveUid = null, back = null) {
  soloBackAction = back?.onBack ?? null;

  // Focus panel has no page-sections list — Page Settings is the empty default.
  // The outermost back would dump onto that list. A block still goes to its
  // section; only the last step out is dropped. open_first_section is parked.
  if (!back && focusPanelOn(win)) {
    doc.getElementById(SOLO_HOST_ID)?.remove();
    doc.getElementById(SOLO_BACK_ID)?.remove();
    doc.getElementById(SOLO_SAVE_ID)?.remove();

    return;
  }

  const label = back?.label || t(win, 'all_sections');
  const header = sve.lpHeader(doc);
  const anchor =
    doc.getElementById(frameId('settings')) ||
    doc.getElementById(HEADER_TOOLBAR_ID)?.querySelector('button[data-tab="settings"]');
  let host = doc.getElementById(SOLO_HOST_ID);

  if (!host) {
    host = doc.createElement('span');
    host.id = SOLO_HOST_ID;
    host.style.cssText = 'display:inline-flex;align-items:center;gap:6px;';
  }

  mountPane(host, SoloPills, {
    backId: SOLO_BACK_ID,
    saveId: SOLO_SAVE_ID,
    label,
    saveLabel: t(win, 'save_section'),
    showSave: !!saveUid,
    onBack: () => {
      const step = soloBackAction;

      if (step) {
        step();

        return;
      }

      leaveSolo(doc, win);
    },
    onSave: () => sve.handleSaveSection({ uid: saveUid }, doc, win),
  });

  if (!host.parentNode) {
    if (anchor) {
      anchor.after(host);
    } else if (header) {
      header.insertBefore(host, header.firstChild);
    } else {
      doc.body.appendChild(host);
    }
  }
}

/**
 * Marks the path from the target set up to the editor root: each parent gets
 * SOLO_PARENT_ATTR, each child on the path gets SOLO_KEEP_ATTR. Combined with
 * the injected style, this hides every off-path element. Returns true on success.
 */
export function markSoloPath(uid, editor, doc) {
  // Synced-section panel: never use parent>keep CSS — Vue replaces wrappers and
  // leaves an empty sidebar with only the focus header. Away-marks are remade
  // from scratch on every pass and do not depend on surviving attributes.
  if (panelFrameDoc(doc)) {
    return markPanelIsolate(uid, editor, doc);
  }

  doc.querySelectorAll(`[${SOLO_PARENT_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_PARENT_ATTR));
  doc.querySelectorAll(`[${SOLO_KEEP_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_KEEP_ATTR));

  const setEl = findSetByUid(uid, doc);

  if (!setEl || !editor.contains(setEl)) {
    return false;
  }

  let node = setEl;

  while (node && node !== editor && node.parentElement) {
    node.setAttribute(SOLO_KEEP_ATTR, '');
    node.parentElement.setAttribute(SOLO_PARENT_ATTR, '');
    node = node.parentElement;
  }

  // Focus header lives outside Vue — remake must not leave it un-kept, or the
  // solo stylesheet hides it until paintFocus runs (and on a failed expand it
  // never does).
  doc.getElementById(FOCUS_HEADER_ID)?.setAttribute(SOLO_KEEP_ATTR, '');

  // Expand the set (and any ancestor sets) so its fields show.
  [...collectAncestorSets(setEl), setEl].forEach(expandSet);

  return true;
}

/**
 * Panel-iframe isolation: hide every sibling along the path to the focused set.
 * Fully cleared and rebuilt each call — safe when Vue swaps intermediate nodes.
 */
export function markPanelIsolate(uid, editor, doc) {
  doc.querySelectorAll(`[${PANEL_AWAY_ATTR}]`).forEach((el) => el.removeAttribute(PANEL_AWAY_ATTR));

  const setEl = findSetByUid(uid, doc);

  if (!setEl || !editor?.contains(setEl)) {
    return false;
  }

  [...collectAncestorSets(setEl), setEl].forEach(expandSet);

  const keep = new Set();
  const header = doc.getElementById(FOCUS_HEADER_ID);

  if (header) {
    keep.add(header);
  }

  let node = setEl;

  while (node && node !== editor) {
    keep.add(node);
    node = node.parentElement;
  }

  keep.forEach((el) => {
    const parent = el.parentElement;

    if (!parent) {
      return;
    }

    for (const child of parent.children) {
      if (keep.has(child) || child.contains(setEl)) {
        continue;
      }

      // Never hide the focus header or sticky chrome we inject.
      if (child.id === FOCUS_HEADER_ID || child.hasAttribute('data-sve-focus-header')) {
        continue;
      }

      child.setAttribute(PANEL_AWAY_ATTR, '');
    }
  });

  return true;
}

/**
 * Sidder markeringen stadig på det den blev sat på?
 *
 * At spørge om der overhovedet findes en keep-markering i dokumentet er ikke
 * nok. Focus-headeren bærer selv en, og den ligger uden for Vue's træ og
 * forsvinder aldrig. Bygger Vue feltkolonnen om — hvilket den gør når panelet
 * trækkes forbi en vis bredde — kommer rækkerne tilbage umarkerede, mens
 * headeren stadig har sin. Den gamle vagt læste det som "markeringen overlevede"
 * og lod være med at markere igen, og stilarket skjulte så hele kolonnen: kun
 * headeren stod tilbage, og panelet var tomt indtil man forlod solo-visningen.
 *
 * Spørgsmålet skal stilles til de elementer markeringen faktisk hører til. Er de
 * væk, eller er de kommet igen uden den, skal stien sættes op på ny.
 */
export function soloMarksIntact(targets) {
  return targets.length > 0 && targets.every((el) => el?.isConnected && el.hasAttribute(SOLO_KEEP_ATTR));
}

/**
 * Synced-section iframe: the focus header can paint while the set is still
 * collapsed — header paints, fields never mount → empty sidebar. Re-assert
 * expand + away-marks for a short window after each solo.
 */
export function ensurePanelSoloVisible(win, doc, uid) {
  let tries = 0;

  const tick = () => {
    if (sveState.soloUid !== uid || !panelFrameDoc(doc)) {
      return;
    }

    const setEl = findSetByUid(uid, doc);
    const editor = soloRoot(doc);

    if (!setEl || !editor) {
      if (tries++ < 25) {
        win.setTimeout(tick, 120);
      }

      return;
    }

    if (isSetCollapsed(setEl)) {
      expandSet(setEl);
    }

    markPanelIsolate(uid, editor, doc);

    const hasFields =
      setEl.querySelector('.publish-field, [class*="-fieldtype"], .bard-fieldtype, input, textarea, select') &&
      !isSetCollapsed(setEl);

    if (!hasFields && tries++ < 25) {
      win.setTimeout(tick, 120);
    }
  };

  win.setTimeout(tick, 50);
  win.setTimeout(tick, 200);
  win.setTimeout(tick, 500);
  win.setTimeout(tick, 1000);
}

/**
 * Is the full solo keep/parent chain still intact from the set up to the editor?
 *
 * Checking only the set is not enough: Vue often replaces intermediate wrappers
 * while leaving the set node alone. Solo CSS then hides everything under the
 * break, and only the focus header (kept outside Vue) remains — empty sidebar
 * with a title. Same failure mode on the synced-section sve-panel iframe.
 */
export function soloPathIntact(uid, editor, doc) {
  const setEl = findSetByUid(uid, doc);

  if (!setEl || !editor?.isConnected || !editor.contains(setEl)) {
    return false;
  }

  if (!editor.hasAttribute(SOLO_PARENT_ATTR)) {
    return false;
  }

  let node = setEl;

  while (node && node !== editor) {
    if (!node.hasAttribute(SOLO_KEEP_ATTR)) {
      return false;
    }

    const parent = node.parentElement;

    if (!parent?.hasAttribute(SOLO_PARENT_ATTR)) {
      return false;
    }

    node = parent;
  }

  return node === editor;
}

/**
 * Isolates a section's settings — and nothing else — in the editor panel.
 *
 * Reuses the solo marking, only starting deeper: instead of keeping the path down
 * to the whole set, it keeps the path down to the set's own `settings` fields, so
 * the panel shows the spacing/colour controls alone. Several fields can be kept
 * at once (settings plus its per-breakpoint siblings) — the style only hides
 * children that aren't marked, so marked siblings all survive.
 */
export function soloSectionSettings(uid, doc, win) {
  const setEl = findSetByUid(uid, doc);
  const editor = soloRoot(doc);

  if (!setEl || !editor || !editor.contains(setEl)) {
    return false;
  }

  sveState.soloUid = uid;

  // Sættet slås op forfra hver gang. Elementet fra før er kun gyldigt indtil Vue
  // bygger kolonnen om, og markeringer sat på et element der ikke længere står i
  // dokumentet, gør ingenting.
  const apply = () => {
    const current = findSetByUid(uid, doc) || setEl;
    const root = soloRoot(doc) || editor;
    const targets = sectionSettingsFields(current);

    if (!targets.length || !root) {
      return false;
    }

    ensureSoloStyle(doc);

    doc.querySelectorAll(`[${SOLO_PARENT_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_PARENT_ATTR));
    doc.querySelectorAll(`[${SOLO_KEEP_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_KEEP_ATTR));

    targets.forEach((target) => {
      for (let node = target; node && node !== root && node.parentElement; node = node.parentElement) {
        node.setAttribute(SOLO_KEEP_ATTR, '');
        node.parentElement.setAttribute(SOLO_PARENT_ATTR, '');
      }
    });

    addSoloBackButton(doc, win, uid);

    return true;
  };

  if (!apply()) {
    return false;
  }

  if (sveState.soloObserver) {
    sveState.soloObserver.disconnect();
  }

  const target = doc.querySelector('.live-preview-fields') || editor;

  sveState.soloObserver = new MutationObserver(() => {
    if (sveState.soloUid !== uid) {
      return;
    }

    const current = findSetByUid(uid, doc);

    if (!current || !soloMarksIntact(sectionSettingsFields(current))) {
      apply();
    }
  });
  sveState.soloObserver.observe(target, { childList: true, subtree: true });

  return true;
}

// A section's settings are a tabby field (the Farver / Spacing / Custom css tabs),
// sometimes alongside a breakpoint switcher for the per-device values. Targeting
// the fieldtypes, not field ids: in Statamic 6 the `field_…` ids are on the inputs
// themselves, not on any wrapper, so there is nothing to match a handle against.
export const SETTINGS_FIELDTYPES = '.tabby-fieldtype, [class*="breakpoint-fieldtype"]';

/**
 * The section's own settings fields.
 *
 * Everything nested in a section brings settings of its own — every button row,
 * every column — and they render the same fieldtypes. The section's are the least
 * deeply nested: they sit in the set's own field list, the rest one or more field
 * lists further in.
 */
export function sectionSettingsFields(setEl) {
  const depth = (el) => {
    let levels = 0;

    for (let node = el.parentElement; node && node !== setEl; node = node.parentElement) {
      if (node.classList?.contains('publish-fields')) {
        levels++;
      }
    }

    return levels;
  };

  const fields = [...setEl.querySelectorAll(SETTINGS_FIELDTYPES)];

  if (!fields.length) {
    return [];
  }

  const shallowest = Math.min(...fields.map(depth));

  return fields.filter((el) => depth(el) === shallowest);
}

/**
 * Isolates one section in the editor panel. Returns false when the set can't be
 * located at all (caller falls back to normal focus). Marks are re-applied on
 * every field re-render via a MutationObserver.
 */
/**
 * Make the sections tab the one on screen.
 *
 * Sections live in the first publish tab. If another tab (SEO, Sidebar) is
 * selected when you open a section, its fields sit in a tab panel the CP has
 * hidden — so isolating them shows nothing. Switching back first is what keeps the
 * section from opening into a blank panel.
 */
export function activateSectionsTab(win) {
  const first = nativeTabButtons(win.document)[0];

  if (first && first.getAttribute('aria-selected') !== 'true') {
    fireTabClick(win, 0);
  }

  // Native aria-selected lags a tick. Don't leave Page Settings/SEO lit.
  win.document.querySelectorAll('[data-sve-settings-tab]').forEach((btn) => {
    btn.setAttribute('aria-pressed', 'false');
  });
}


// ===== focus-panel =====
// --- Focus panel ---------------------------------------------------------------
// The panel as one thing at a time. A soloed section already shows only itself,
// but it shows itself as it sits in the list: inside its card, under its header
// bar, with every block nested in it unfolded below. What is left here is what was
// clicked — named at the top with its own icon and instructions, its fields under
// it, and the blocks it contains reached by clicking them on the page instead of
// by opening a list.
//
// Nothing new is isolated: the marking is the solo marking, and the tabs are the
// section's own segmented control, already built from its `tab` markers. This adds
// a header of its own above the fields, four attributes, and the stylesheet that
// reads them.

export const FOCUS_HEADER_ID = '__sve-focus-header';
export const FOCUS_ROOT_ATTR = 'data-sve-focus'; // on <html>: which kind is on show
export const FOCUS_SET_ATTR = 'data-sve-focus-set'; // the set the panel is showing
export const FOCUS_HIDE_ATTR = 'data-sve-focus-hide'; // a row this view leaves out
export const FOCUS_FLAT_ATTR = 'data-sve-focus-flat'; // a wrapper stripped of what it draws
export const FOCUS_FLUSH_ATTR = 'data-sve-focus-flush'; // the field list, out to the panel's own gutter
export const FOCUS_STEP_ATTR = 'data-sve-focus-step'; // the arrow into a block's own view

// Segment to open once the control exists — the gear on a section means
// "settings", which is not the segment a section opens on.
export let focusSegment = null;
export let focusRepaintPending = false;

/** Labels a settings segment goes by, in the languages the editor is used in. */
export const FOCUS_SETTINGS_SEGMENT = /style|design|settings|advance|avanc|indstil|udseende/i;

/** Is the simplified panel switched on for this site? */
export function focusPanelOn(win) {
  return sve.featureOn(win, 'focus_panel');
}

/** What a set calls itself: display name, icon and instructions. */
export function setMeta(win, handle) {
  const map = win.Statamic?.$config?.get?.('sveSetMeta');

  return (handle && map?.[handle]) || null;
}

/** What a Grid field calls its rows: display name and the icon on the field. */
export function gridMeta(win, handle) {
  const map = win.Statamic?.$config?.get?.('sveGridMeta');

  return (handle && map?.[handle]) || null;
}

/** The set handle ("hero/style_2") of the row a uid points at. */
export function setTypeForUid(uid, doc) {
  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = sve.findPathByUid(values, uid);

    if (path === null) {
      continue;
    }

    const row = sve.dataGet(values, path);

    if (row && typeof row === 'object' && typeof row.type === 'string') {
      return row.type;
    }
  }

  return null;
}

/**
 * The row one level up from a nested one — a block's section.
 *
 * A row's path names the field it sits in and its index in it
 * ("page_sections.0.blocks.1"), so its parent row is two segments shorter. A path
 * with nothing left after that is a top-level section, which has no row above it.
 */
export function parentRowUid(uid, doc) {
  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = sve.findPathByUid(values, uid);

    if (!path) {
      continue;
    }

    const parts = path.split('.');

    if (parts.length < 4) {
      return null;
    }

    const row = sve.dataGet(values, parts.slice(0, -2).join('.'));

    if (row && typeof row === 'object') {
      return row._visual_id || row._id || row.id || null;
    }
  }

  return null;
}

/** True while the soloed row is still in the form values — gone means deleted. */
export function soloUidInValues(uid, doc) {
  if (!uid) {
    return false;
  }

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (values && typeof values === 'object' && sve.findPathByUid(values, uid) !== null) {
      return true;
    }
  }

  return false;
}

/**
 * Parent chain at the moment we step in. After a delete the row is gone from
 * values, so parentRowUid can no longer climb from it — this list is the way
 * back up.
 */
export function rememberSoloAncestors(uid, doc) {
  const chain = [];
  let current = uid;
  const seen = new Set([uid]);

  for (let i = 0; i < 10; i++) {
    const parent = parentRowUid(current, doc);

    if (!parent || seen.has(parent)) {
      break;
    }

    chain.push(parent);
    seen.add(parent);
    current = parent;
  }

  sveState.soloAncestors = chain;
}

/**
 * The soloed row was deleted. Vue rebuilt the form without it; the focus header
 * sits outside that tree and stays, while the hide-marks on the old nodes are
 * gone — so the whole page form dumps into the panel. Step back to the parent
 * (Links, then the block, then the section) or leave solo. Do not call this
 * when the uid is only missing from the DOM for a remount: values still have it.
 */
let recoverSoloTries = 0;

export function recoverMissingSolo(win, doc) {
  const chain = sveState.soloAncestors || [];

  for (const ancestor of chain) {
    if (findSetByUid(ancestor, doc)) {
      recoverSoloTries = 0;
      soloSection(ancestor, doc, win);

      return true;
    }
  }

  if (chain.some((ancestor) => soloUidInValues(ancestor, doc)) && recoverSoloTries < 20) {
    recoverSoloTries += 1;
    win.setTimeout(() => recoverMissingSolo(win, doc), 100);

    return true;
  }

  recoverSoloTries = 0;
  leaveSolo(doc, win);

  return true;
}

/** 'section' for a top-level set, 'block' for one nested inside another. */
export function focusKindOf(setEl) {
  return collectAncestorSets(setEl).length ? 'block' : 'section';
}

/** The sets nested directly in this one — a section's blocks, a block's rows. */
export function childSets(setEl) {
  return [...setEl.querySelectorAll(SELECTORS.anySet)].filter(
    (el) => el.parentElement?.closest(SELECTORS.anySet) === setEl
  );
}

/**
 * Folds the blocks a set holds, on the way into it.
 *
 * A view of a section opens on its list of blocks, and a list is only a list while
 * every row of it is the same size: one block left standing open — the one added
 * last, or the one just stepped out of — is a wall of fields where the row above
 * it is a name, and the block under it has been pushed off the screen. So the way
 * in folds them, every time, and what the editor opens from there stays open for
 * as long as that view lasts.
 *
 * Reports whether it had a list to fold: called before the panel has drawn one it
 * says so, and the pass after the fields have settled tries again.
 */
export function foldChildSets(doc, uid) {
  const setEl = findSetByUid(uid, doc);

  if (!setEl) {
    return false;
  }

  const kids = childSets(setEl);

  if (!kids.length) {
    return false;
  }

  kids.forEach((kid) => {
    try {
      collapseSet(kid);
    } catch {
      // One set that won't fold must not leave the rest of the view unpainted.
    }
  });

  return true;
}

/**
 * The arrow that opens a set on its own.
 *
 * Sits in the set's own header, beside the chevron that unfolds it in place — the
 * two are the same choice put twice: work on it here, in the run of the list, or
 * step into it and have the panel to yourself. Guarded on its own presence, so a
 * re-render puts it back rather than twice.
 */
export function addStepInto(win, doc, setEl) {
  const header = [...setEl.children].find((el) => el.tagName === 'HEADER');

  if (!header || header.querySelector(`[${FOCUS_STEP_ATTR}]`)) {
    return;
  }

  const uid = getUidFromSet(setEl);

  if (!uid) {
    return;
  }

  const btn = doc.createElement('button');

  btn.type = 'button';
  btn.setAttribute(FOCUS_STEP_ATTR, '');
  btn.title = t(win, 'focus_step_in');
  btn.innerHTML =
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
  btn.addEventListener('click', (event) => {
    // The header is the collapse toggle; this button is not.
    event.preventDefault();
    event.stopPropagation();
    // No kind given: a top-level set is a section, a nested one is a block, and
    // the set itself is what says which.
    soloSection(uid, doc, win);
  });

  header.appendChild(btn);
}

/**
 * The arrow on every set in the editor panel — the sections in the whole-page
 * list as much as the blocks inside one.
 *
 * Every set, because the list of sections is a list like any other: the way into
 * Hero style 1 from the page's own list should be the way into the Headline inside
 * it, and one arrow that always means the same thing is easier to learn than two
 * that nearly do.
 *
 * Confined to the panel beside the preview. The ordinary publish form is not a
 * place you can step into anything from — there is nothing to step into it *for*
 * — and it stays exactly as Statamic renders it.
 */
export function markStepIntoAll(win) {
  const doc = win.document;
  const editor = soloRoot(doc);

  if (!editor || !focusPanelOn(win)) {
    return;
  }

  editor.querySelectorAll(SELECTORS.anySet).forEach((setEl) => {
    try {
      addStepInto(win, doc, setEl);
    } catch {
      // One malformed set must not stop the rest of the panel from working.
    }
  });
}

/** A readable name for a set nobody described: "hero/style_2" → "Style 2". */
export function humanizeHandle(handle) {
  const name = String(handle || '').split('/').pop().replace(/[-_]+/g, ' ').trim();

  return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
}

/** Removes the header and every focus mark. The solo marking is cleared with it. */
export function clearFocus(doc) {
  focusSegment = null;

  doc.documentElement.removeAttribute(FOCUS_ROOT_ATTR);
  doc.getElementById(FOCUS_HEADER_ID)?.remove();

  // The step-in arrows stay: they belong to the panel, not to this view, and the
  // whole-page list is exactly where the next one is stepped into from.
  [FOCUS_SET_ATTR, FOCUS_HIDE_ATTR, FOCUS_FLAT_ATTR, FOCUS_FLUSH_ATTR].forEach((attr) => {
    doc.querySelectorAll(`[${attr}]`).forEach((el) => el.removeAttribute(attr));
  });
}

/**
 * Strips every wrapper between the panel and the fields of everything it draws.
 *
 * A block's fields are a dozen elements deep — the portal, the entry's tab pane,
 * the page builder's field, the list its sections are rows of, the section's card
 * and field grid, the block list, the block's card — and each of those draws
 * itself: a border, a rounding, a background, an indent, a divider. Named one by
 * one they come back the moment a fieldset nests differently, so they are found by
 * walking rather than guessed at.
 *
 * The walk goes up from the fields, never down from the panel: only that direction
 * knows which of Statamic's nested divs are on the way to *these* fields, and it
 * stops at the panel's own scrolling column, whose padding is the panel's. Bounded
 * by containment as well as by identity — a field list that isn't in the panel at
 * all (a popped-out preview, a form that hasn't been portalled in yet) marks
 * nothing, rather than walking out of the editor and stripping the page.
 *
 * What is stripped is decoration only. The boxes stay in the layout, laid out
 * exactly as Statamic lays them out — nothing here can make a field disappear.
 *
 * The list at the end of the walk is marked too, but only to give up its side
 * padding. A set's field list is rendered with `p-4` — an inset that reads as
 * "inside this card" in a list of cards, and as a step out of line the moment the
 * card is gone: the header naming what is on show sits at the panel's gutter, and
 * the fields under it sat a further 1rem in. Its top and bottom stay, so the
 * fields still breathe under the header.
 */
export function flattenWrappers(doc, setEl) {
  // The column, not the pane: its padding is the panel's own gutter, and the
  // walk that strips every wrapper on the way to the fields must not strip that
  // too. In Live Preview the two are the same element; in the sve-panel frame
  // `soloRoot` reaches up to <main> — past the column — and flattening it left
  // the panel reading edge to edge.
  const stop = focusHeaderHost(doc);
  const wanted = new Set();
  const flush = new Set();

  if (stop) {
    sectionFieldLists(setEl).forEach((list) => {
      if (!stop.contains(list)) {
        return;
      }

      flush.add(list);

      for (let node = list.parentElement; node && node !== stop; node = node.parentElement) {
        wanted.add(node);
      }
    });
  }

  doc.querySelectorAll(`[${FOCUS_FLAT_ATTR}]`).forEach((el) => {
    if (!wanted.has(el)) {
      el.removeAttribute(FOCUS_FLAT_ATTR);
    }
  });

  doc.querySelectorAll(`[${FOCUS_FLUSH_ATTR}]`).forEach((el) => {
    if (!flush.has(el)) {
      el.removeAttribute(FOCUS_FLUSH_ATTR);
    }
  });

  wanted.forEach((el) => el.setAttribute(FOCUS_FLAT_ATTR, ''));
  flush.forEach((el) => el.setAttribute(FOCUS_FLUSH_ATTR, ''));
}

/**
 * The header element, at the top of the panel's scrolling column.
 *
 * `.live-preview-fields` and not `.live-preview-editor`: the editor pane is a flex
 * row holding the field column and the drag handle that resizes it, so a child
 * added there lands beside the fields rather than above them. It also wears the
 * solo keep-mark, or the stylesheet that hides everything off the soloed path
 * would hide the header describing it.
 */
/** Does this element lay its children out one under the other? */
export function stacksChildren(style) {
  if (style.display === 'block' || style.display === 'flow-root') {
    return true;
  }

  return (
    (style.display === 'flex' || style.display === 'inline-flex') &&
    style.flexDirection.startsWith('column')
  );
}

/**
 * Where the focus header goes: the column the fields scroll in.
 *
 * In Live Preview that is `soloRoot` itself, and the header is simply its first
 * child. The sve-panel frame is a whole CP screen, where `soloRoot` reaches all
 * the way up to `<main>` because it has to — that is the isolation boundary, the
 * level at which the nav beside the form gets hidden. But `<main>` is a flex ROW
 * holding exactly that nav beside the form, so a header inserted as its first
 * child does not sit above the fields: it becomes a column standing next to
 * them, full height, with the fields squeezed into what is left.
 *
 * The two jobs are not the same one. Isolation reaches as high as the things it
 * must hide; the header belongs as deep as the column it names. So the frame is
 * asked for its scrolling column — the outermost thing above the form that
 * scrolls and stacks what it holds, found by what it does rather than by the
 * class it happens to wear.
 */
export function focusHeaderHost(doc) {
  const editor = soloRoot(doc);

  if (!editor || !panelFrameDoc(doc)) {
    return editor;
  }

  const start = doc.querySelector(SELECTORS.replicatorSet) || doc.querySelector('.publish-fields');
  const win = doc.defaultView;

  if (!start || !win) {
    return editor;
  }

  let column = null;

  for (let node = start.parentElement; node && node !== editor; node = node.parentElement) {
    const style = win.getComputedStyle(node);

    if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && stacksChildren(style)) {
      column = node;
    }
  }

  if (!column) {
    return editor;
  }

  // The gutter the panel is read in. Everything the focus view draws is stripped
  // flat and flush — that is right in Live Preview, whose own column holds the
  // margin the fields stand in, and wrong here, where the frame is a CP screen
  // laid out for the full width of a window. Marked rather than styled by class
  // so the rule follows whichever element turned out to be the column.
  column.setAttribute(PANEL_COLUMN_ATTR, '');

  return column;
}

export function ensureFocusHeader(doc) {
  const host = focusHeaderHost(doc);

  if (!host) {
    return null;
  }

  let header = doc.getElementById(FOCUS_HEADER_ID);

  if (!header) {
    header = doc.createElement('div');
    header.id = FOCUS_HEADER_ID;
    header.setAttribute('data-sve-focus-header', '');
  }

  header.setAttribute(SOLO_KEEP_ATTR, '');

  if (header.parentElement !== host || host.firstChild !== header) {
    host.insertBefore(header, host.firstChild);
  }

  return header;
}

/**
 * Draws the name of the thing on show: its icon, its display name, the way back
 * out, and whatever its instructions say.
 *
 * The way back sits here rather than in the Live Preview header, where it began.
 * It says where it goes — "Hero style 1", "All sections" — and a label naming what
 * the panel is showing belongs beside what the panel is showing, not in the row of
 * icons above it.
 *
 * Rebuilt only when one of the four changes, so the observer driving the repaint
 * can fire as often as it likes.
 */
export function paintFocusHeader(win, doc, meta, back) {
  const header = ensureFocusHeader(doc);

  if (!header) {
    return;
  }

  const closeInstead =
    !back && panelFrameDoc(doc) && win.location.pathname.includes('/collections/');
  // Focus panel has no page-sections list, so "All sections" leads nowhere.
  // A block still names its section. open_first_section is parked.
  const hideBack = !back && !closeInstead && focusPanelOn(win);
  const label = back?.label || (closeInstead ? t(win, 'close') : t(win, 'all_sections'));
  const key = `${meta.icon || ''}|${meta.display}|${meta.instructions || ''}|${hideBack ? '' : label}`;

  if (header.getAttribute('data-sve-focus-key') === key) {
    return;
  }

  header.setAttribute('data-sve-focus-key', key);
  header.textContent = '';

  const line = doc.createElement('div');

  line.setAttribute('data-sve-focus-id', '');

  const tile = doc.createElement('span');

  tile.setAttribute('data-sve-focus-tile', '');

  const icon = panelIcon(doc, meta.icon);

  if (icon) {
    tile.appendChild(icon);
  } else {
    // No icon named: the initial of the name, which at least tells one block from
    // the next at a glance.
    tile.textContent = (meta.display || '?').trim().charAt(0).toUpperCase();
  }

  const title = doc.createElement('h2');

  title.setAttribute('data-sve-focus-title', '');
  title.textContent = meta.display;

  line.append(tile, title);

  if (!hideBack) {
    const out = doc.createElement('button');

    out.type = 'button';
    out.setAttribute('data-sve-focus-back', '');
    out.innerHTML =
      '<span aria-hidden="true" data-sve-focus-back-arrow>&#8249;</span><span>' + label + '</span>';
    out.addEventListener('click', () => {
      if (back?.onBack) {
        back.onBack();

        return;
      }

      leaveSolo(doc, win);
    });

    line.append(out);
  }

  header.appendChild(line);

  if (!meta.instructions) {
    return;
  }

  const description = doc.createElement('p');

  description.setAttribute('data-sve-focus-desc', '');
  description.textContent = meta.instructions;
  header.appendChild(description);
}

/**
 * Opens the segment the gear asked for, once the control it lives in has been
 * built. Named rather than counted where the fieldset says so — "Style", "Design",
 * "Indstillinger" — and otherwise the second segment, which is where a section
 * that separates content from design puts the design.
 */
export function applyFocusSegment(setEl) {
  if (!focusSegment) {
    return;
  }

  // The control lives in the set's own field list, which is where its segments
  // are to be found — the set element itself only holds it.
  const list = sectionFieldLists(setEl).find(
    (el) => ownDescendants(el, `[${SECTION_SEG_ATTR}]`).length
  );

  if (!list) {
    return; // the control isn't built yet — the next repaint tries again
  }

  const buttons = ownDescendants(list, `[${SECTION_SEG_ATTR}]`);

  const wanted =
    buttons.find((btn) => FOCUS_SETTINGS_SEGMENT.test(btn.textContent || '')) || buttons[1];

  focusSegment = null;

  if (wanted) {
    setSectionGroup(list, wanted.getAttribute(SECTION_SEG_ATTR));
  }
}

/** Has this segment anything left to show once the view has hidden its rows? */
export function segmentHasContent(list, key) {
  return ownDescendants(list, `[${SECTION_GROUP_ATTR}="${key}"]`).some(
    (row) => !row.hasAttribute(FOCUS_HIDE_ATTR)
  );
}

/**
 * Drops the segments this view empties.
 *
 * A section whose content tab holds nothing but its block list has nothing to put
 * under that tab once the list is gone — and a tab that opens on nothing is worse
 * than no tab. The button goes, and if it was the one on show the first segment
 * with something in it takes over.
 */
export function hideEmptySegments(setEl) {
  sectionFieldLists(setEl).forEach((list) => {
    const buttons = ownDescendants(list, `[${SECTION_SEG_ATTR}]`);

    if (buttons.length < 2) {
      return;
    }

    let fallback = null;

    buttons.forEach((btn) => {
      const key = btn.getAttribute(SECTION_SEG_ATTR);
      const filled = segmentHasContent(list, key);

      btn.toggleAttribute(FOCUS_HIDE_ATTR, !filled);

      if (filled && !fallback) {
        fallback = key;
      }
    });

    const active = list.getAttribute(SECTION_ACTIVE_ATTR);

    if (fallback && active && !segmentHasContent(list, active)) {
      setSectionGroup(list, fallback);
    }
  });
}

/**
 * Paints the focus view over an already-soloed set. Idempotent: every mark is set
 * to what it should be rather than toggled, so a repaint costs nothing and a
 * re-render is caught by the next one.
 */
/** The field handle a row sits in (`links` in `page_sections.0.blocks.2.links.0`). */
export function fieldHandleFromPath(path) {
  const parts = String(path || '').split('.');
  const last = parts[parts.length - 1];

  return /^\d+$/.test(last) && parts.length >= 2 ? parts[parts.length - 2] : null;
}

/**
 * What the focus header should say for this uid: a set's own name, or a grid
 * row's text (and the grid field's icon), so stepping into a link is not a
 * blank title.
 */
export function focusRowMeta(win, uid, doc) {
  const handle = setTypeForUid(uid, doc);
  let row = null;
  let listKey = null;
  let preview = '';

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = sve.findPathByUid(values, uid);

    if (path === null) {
      continue;
    }

    listKey = fieldHandleFromPath(path);
    row = sve.dataGet(values, path);
    break;
  }

  if (row && typeof row === 'object') {
    preview = sve.isGridRowValue(row) ? sve.gridRowPreview(row) : '';
  }

  if (handle) {
    const globalSet = sve.globalSectionSet(win);
    const sourceType =
      handle === globalSet && row && typeof row === 'object'
        ? sve.savedSectionInfo(win, sve.firstEntryId(row[globalSet]))?.section_type || ''
        : '';
    const type = sourceType || handle;
    const meta = setMeta(win, type);
    const custom = typeof row?._sve_label === 'string' ? row._sve_label.trim() : '';

    return {
      display: custom || (sourceType ? meta?.display || humanizeHandle(sourceType) : '')
        || meta?.display || humanizeHandle(handle),
      icon: meta?.icon || setMeta(win, handle)?.icon || null,
      instructions: meta?.instructions || '',
    };
  }

  const meta = gridMeta(win, listKey);

  return {
    display: preview || meta?.display || humanizeHandle(listKey) || t(win, 'listview_item'),
    icon: meta?.icon || null,
    instructions: meta?.instructions || '',
  };
}

export function paintFocus(win, doc, uid, kind) {
  const setEl = findSetByUid(uid, doc);

  if (!setEl) {
    return false;
  }

  doc.documentElement.setAttribute(FOCUS_ROOT_ATTR, kind);

  doc.querySelectorAll(`[${FOCUS_SET_ATTR}]`).forEach((el) => {
    if (el !== setEl) {
      el.removeAttribute(FOCUS_SET_ATTR);
    }
  });

  setEl.setAttribute(FOCUS_SET_ATTR, kind);

  // Marks left by the view before this one. A step into a block would otherwise
  // inherit the section's hidden block list — the very row the block is inside —
  // and open on nothing at all.
  doc.querySelectorAll(`[${FOCUS_HIDE_ATTR}]`).forEach((el) => {
    if (!setEl.contains(el)) {
      el.removeAttribute(FOCUS_HIDE_ATTR);
    }
  });


  // Everything the set holds is shown, blocks included: a section is its fields
  // *and* what is built inside it, and a list of blocks that can be unfolded where
  // they stand is how you work down a section without losing your place in it.
  // Each one keeps an arrow out to a view of its own, for when one thing at a time
  // is what's wanted.
  markStepIntoAll(win);

  paintFocusHeader(win, doc, focusRowMeta(win, uid, doc), focusBack(win, doc, uid, kind));

  applyFocusSegment(setEl);
  hideEmptySegments(setEl);
  flattenWrappers(doc, setEl);

  return true;
}

/** Repaints at most once a frame, however many mutations arrive in it. */
export function scheduleFocusRepaint(win, doc, uid, kind) {
  if (focusRepaintPending) {
    return;
  }

  focusRepaintPending = true;

  win.requestAnimationFrame(() => {
    focusRepaintPending = false;

    if (sveState.soloUid === uid) {
      paintFocus(win, doc, uid, kind);
    }
  });
}

/**
 * Where the back pill goes from here. A block steps back into the section holding
 * it, named after that section; anything else leaves the solo view altogether,
 * which is what the pill does with no action of its own.
 */
export function focusBack(win, doc, uid, kind) {
  if (kind !== 'block') {
    return null;
  }

  const parent = parentRowUid(uid, doc);

  if (!parent || !findSetByUid(parent, doc)) {
    return null;
  }

  const label = focusRowMeta(win, parent, doc).display;

  // A step back the pill can't name is a step back nobody can predict. Left
  // unnamed, it says "all sections" and does exactly that instead.
  if (!label) {
    return null;
  }

  return {
    label,
    onBack: () => soloSection(parent, doc, win),
  };
}

/**
 * Opens what was clicked in the preview.
 *
 * With the focus panel on that is the thing itself, however deep it sits — a block
 * opens as a block. Clicking a heading on the page means "let me at this", and the
 * panel answers with it and nothing else; the section around it is one back-arrow
 * away, and every block in that section is one arrow deeper.
 *
 * With the panel off the behaviour is what it always was: a field click opens the
 * section around it, a set click opens the set.
 */
export function focusFromPreview(uid, doc, win, { clampToSection = false } = {}) {
  if (focusPanelOn(win)) {
    return soloSection(uid, doc, win);
  }

  return soloSection(clampToSection ? topLevelSectionUid(uid, doc) || uid : uid, doc, win);
}

/**
 * The set a field renders in — the block that owns it, not the section around it.
 *
 * Two ways of asking, because neither works on its own. The rendered panel knows
 * exactly where a field is, but only while it is rendered: blocks are collapsed
 * until opened, and a collapsed set has no fields in the DOM at all. The form's
 * values always have them, but hold no elements. So: the DOM first, where it can
 * answer, and the values behind it.
 *
 * The DOM answer is checked against the scope it was asked for. `findFieldElement`
 * falls back to an unscoped lookup by handle, which in a form holding four blocks
 * that each have a `headline` returns whichever renders first — the right answer
 * to a different question.
 */
export function fieldOwnerUid(field, scope, doc) {
  const scoped = scope ? findSetByUid(scope, doc) : null;
  const el = findFieldElement(field, doc, scope);
  const setEl = el && (!scoped || scoped.contains(el)) ? el.closest(SELECTORS.anySet) : null;

  return setEl ? getUidFromSet(setEl) : fieldOwnerUidFromValues(field, scope, doc);
}

/** The same question asked of the form's values, for a block that isn't rendered. */
export function fieldOwnerUidFromValues(field, scope, doc) {
  const handle = String(field || '').split('.').pop();

  if (!handle || !scope) {
    return null;
  }

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = sve.findPathByUid(values, scope);

    if (path === null) {
      continue;
    }

    const row = sve.dataGet(values, path);
    const found = rowOwningField(row, handle);

    if (found) {
      return found;
    }
  }

  return null;
}

/**
 * Deepest dotted path to `handle` under `node` (children before self), so a
 * section that wraps a headline block resolves to the block field — not a
 * missing `section.headline`.
 */
export function deepestFieldPath(node, handle, path = '') {
  if (node == null || typeof handle !== 'string' || !handle) {
    return null;
  }

  const field = handle.includes('.') ? handle.split('.').pop() : handle;

  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const found = deepestFieldPath(node[i], field, path ? `${path}.${i}` : String(i));

      if (found) {
        return found;
      }
    }

    return null;
  }

  if (typeof node !== 'object') {
    return null;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key === field) {
      continue;
    }

    const found = deepestFieldPath(value, field, path ? `${path}.${key}` : key);

    if (found) {
      return found;
    }
  }

  if (Object.prototype.hasOwnProperty.call(node, field)) {
    return path ? `${path}.${field}` : field;
  }

  return null;
}

/**
 * The deepest row in a value tree carrying this field handle, by its id.
 *
 * Deepest, not first: a section holding a `headline` block has the handle twice
 * over — once on the block that owns it, once on the section that contains the
 * block — and the block is the answer. Children are searched before the node
 * itself, so the innermost owner wins.
 */
export function rowOwningField(node, handle, depth = 0) {
  if (depth > 12 || !node || typeof node !== 'object') {
    return null;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      const found = rowOwningField(item, handle, depth + 1);

      if (found) {
        return found;
      }
    }

    return null;
  }

  for (const value of Object.values(node)) {
    const found = rowOwningField(value, handle, depth + 1);

    if (found) {
      return found;
    }
  }

  const id = node._visual_id || node._id || node.id;

  return Object.prototype.hasOwnProperty.call(node, handle) && id ? id : null;
}

/**
 * Opens the set the clicked field actually belongs to.
 *
 * A block that passes no `scope` of its own reports the section's uid — the
 * section's `_visual_id` cascades down through the whole set in Antlers — so the
 * scope alone cannot tell a section's own field from one belonging to a block
 * inside it. The field can: it is stored on the block's row, and rendered inside
 * the block's set.
 *
 * When neither way finds it, the scope itself is opened — for a template that
 * passes `scope="{{ id }}"` that *is* the block — and the lookup is tried once
 * more after the panel has settled, in case the block was still being drawn.
 *
 * The synced-section panel took the same path as the page until it was made to
 * stop at the section: stepping into a block there came up as an empty
 * "Richtext"/"Headline" header. That was never the step-in — it was the panel's
 * whole field column being hidden, and the pass that draws the segments being
 * dropped. With both fixed a block in a synced section opens exactly as a block
 * on a page does, which is the only behaviour worth having.
 */
export function focusFieldOwner(field, scope, doc, win) {
  const direct = fieldOwnerUid(field, scope, doc);

  if (direct) {
    return soloSection(direct, doc, win);
  }

  const opened = soloSection(scope, doc, win);

  setTimeout(() => {
    const owner = fieldOwnerUid(field, scope, doc);

    if (owner && owner !== sveState.soloUid) {
      soloSection(owner, doc, win);
    }
  }, COLLAPSE_SETTLE_MS + 60);

  return opened;
}

export function soloSection(uid, doc, win, { kind = null, segment = null } = {}) {
  const setEl = uid && findSetByUid(uid, doc);

  if (!setEl) {
    return false;
  }

  // Page section owns the left edge — park Theme Settings / Designs so they
  // don't cover the solo editor.
  //
  // Unless the set is one of the chrome form's own: a widget in the header is
  // reached by clicking it on the page, exactly like a block in a section, and
  // stepping into it is not leaving the header — it IS editing the header.
  if (win && !sve.chromeHost(doc)?.contains(setEl)) {
    if (sve.isGlobalsOverlayOpen?.(win) && sve.hasUnsavedGlobals(win)) {
      sve.confirmLeaveGlobalsOverlay(win, () => {
        sve.dismissChromeForPageEdit?.(win);
        soloSection(uid, doc, win, { kind, segment });
      });

      return false;
    }

    sve.dismissChromeForPageEdit?.(win);
  }

  // A different set is a new visit, and a new visit folds what it holds. Asked for
  // the set already on show — a repaint, a second click on the same thing — it is
  // the same visit, and the blocks the editor opened in it stay open.
  if (sveState.soloUid !== uid) {
    sveState.foldedFor = null;
  }

  sveState.soloUid = uid;
  rememberSoloAncestors(uid, doc);
  focusSegment = segment;
  activateSectionsTab(win);

  // Read once, from the set as it stands now: a re-render replaces the element
  // but never moves the row to another depth.
  const focusKind = kind || focusKindOf(setEl);

  let isolated = false;

  const apply = (settled = false) => {
    if (!findSetByUid(uid, doc) && !soloUidInValues(uid, doc)) {
      recoverMissingSolo(win, doc);

      return false;
    }

    const editor = soloRoot(doc);

    if (!editor) {
      return false;
    }

    activateSectionsTab(win); // guarded — only clicks when it isn't already showing

    ensureSoloStyle(doc);

    if (!markSoloPath(uid, editor, doc)) {
      return false;
    }

    // A block sits in one of its section's segments — the content one, normally.
    // Leave the section on Style, step into a block, and the very row the block is
    // in is still marked `sve-off`: display:none, and !important, so the solo
    // marking cannot bring it back. The view opens on its own header and nothing
    // under it. Stepping into something is a click like the one in the preview, so
    // it answers the same way — the panel follows what was opened, up through every
    // set holding it.
    revealSegmentsFor(findSetByUid(uid, doc) || setEl, doc);

    isolated = true;

    if (win) {
      syncCodeDock(win, doc, uid);
      relayoutAiPanel(win);
    }

    if (!focusPanelOn(win)) {
      addSoloBackButton(doc, win);

      return true;
    }

    // Once per visit. `settled` closes the question for a set that turned out to
    // hold no blocks at all — otherwise every later pass would go looking again.
    if (sveState.foldedFor !== uid && (foldChildSets(doc, uid) || settled)) {
      sveState.foldedFor = uid;
    }

    // No pill in the Live Preview header: the focus header draws its own way out,
    // under the name of what it is showing.
    paintFocus(win, doc, uid, focusKind);

    // Synced-section panel: Vue/accordion often leave the focused set collapsed
    // for a beat after solo — header paints, fields never mount → empty sidebar.
    // Keep expanding + remaking the path until the set actually has field DOM.
    if (panelFrameDoc(doc)) {
      ensurePanelSoloVisible(win, doc, uid);
    }

    return true;
  };

  apply();

  // apply() may have stepped back to a parent (the soloed row was deleted).
  // That call owns the observer — do not replace it with one for the gone uid.
  if (sveState.soloUid !== uid) {
    return isolated;
  }

  setTimeout(() => {
    if (sveState.soloUid === uid) {
      apply(true);
    }
  }, 180); // once the tab switch above has re-rendered the fields

  // Re-apply whenever Vue rebuilds the field tree (expanding a set, live-preview
  // refresh, dragging the panel wider, …).
  if (sveState.soloObserver) {
    sveState.soloObserver.disconnect();
  }

  // Live Preview uses .live-preview-fields; the synced-section sve-panel iframe
  // observes body so Vue replacing wrappers still triggers a remake.
  const isPanel = panelFrameDoc(doc);
  const target = isPanel
    ? doc.body
    : doc.querySelector('.live-preview-fields') ||
      doc.querySelector('.live-preview-editor') ||
      soloRoot(doc);

  let panelRemakeQueued = false;

  if (target) {
    sveState.soloObserver = new MutationObserver(() => {
      if (sveState.soloUid !== uid) {
        return;
      }

      // Panel: remake away-marks (debounced). Always-remake without debounce
      // loops on focus-header insertBefore / field mounts.
      if (isPanel) {
        if (panelRemakeQueued) {
          return;
        }

        panelRemakeQueued = true;
        win.requestAnimationFrame(() => {
          panelRemakeQueued = false;

          if (sveState.soloUid !== uid) {
            return;
          }

          const editor = soloRoot(doc);
          const setEl = findSetByUid(uid, doc);

          if (!setEl || !editor) {
            apply();

            return;
          }

          if (isSetCollapsed(setEl)) {
            expandSet(setEl);
          }

          markPanelIsolate(uid, editor, doc);

          if (focusPanelOn(win)) {
            scheduleFocusRepaint(win, doc, uid, focusKind);
          }
        });

        return;
      }

      const editor = soloRoot(doc);

      if (!soloPathIntact(uid, editor, doc)) {
        apply();

        return;
      }

      if (win) {
        syncCodeDock(win, doc, uid);
      }

      if (focusPanelOn(win)) {
        scheduleFocusRepaint(win, doc, uid, focusKind);
      }
    });
    sveState.soloObserver.observe(target, { childList: true, subtree: true });
  }

  // Only report success when isolation actually marked a path. Returning true
  // after a failed markSoloPath made sve.bootSavedSectionSolo stop retrying while
  // the sidebar still showed entry meta (Published + title).
  return isolated;
}

// Tracks whether Live Preview was open, so teardown (and stash clear) runs once
// when leaving — not on every MutationObserver tick outside LP.
export let lpWasOpen = false;

// Den gemte bredde sættes én gang pr. besøg i Live Preview, ikke på hvert tjek.
// Håndtaget skriver i den samme inline-style mens der trækkes, og en regel der
// blev hævdet hvert øjeblik ville trække tilbage under fingeren.
export let lpWidthApplied = false;

/**
 * Injects the panel toggle when the Live Preview screen is (re)mounted, and
 * enforces the desired collapse state. Called from initCp's MutationObserver:
 * the editor pane mounts AFTER the header, so the state must be re-asserted on
 * subsequent mutations rather than applied once at injection time.
 */
/** rem → px, målt på dokumentets egen rodstørrelse frem for et gættet 16. */
export function remToPx(win, rem) {
  const root = parseFloat(win.getComputedStyle(win.document.documentElement).fontSize) || 16;

  return Math.round(rem * root);
}

export function clampSideWidth(win, px) {
  return Math.round(
    Math.min(remToPx(win, sve.LP_SIDE_MAX_REM), Math.max(remToPx(win, sve.LP_SIDE_MIN_REM), px))
  );
}

/** Bredden panelet står i, som den er gemt. Intet gemt: standarden. */
export function lpStoredWidth(win) {
  const stored = parseInt(chromeGet(win, sve.LP_WIDTH_KEY) ?? '', 10);
  const fallback = remToPx(win, sve.LP_SIDE_DEFAULT_REM);

  return clampSideWidth(win, Number.isFinite(stored) && stored > 0 ? stored : fallback);
}

export function persistLpWidth(win, px) {
  const next = clampSideWidth(win, px);

  chromeSet(win, sve.LP_WIDTH_KEY, String(next));

  return next;
}

export function applyLpEditorWidth(win, px) {
  const editor = win.document.querySelector('.live-preview-editor');

  if (!editor || sveState.lpCollapsed) {
    return persistLpWidth(win, px);
  }

  const next = persistLpWidth(win, px);

  editor.style.width = `${next}px`;

  return next;
}

/**
 * Own the left resizer so we can sit at 16–50 rem. Statamic's own handle
 * floors at 350px and would ignore a narrower stored width.
 */
export function bindLpEditorResize(win) {
  const doc = win.document;
  const handle = doc.querySelector('.live-preview-resizer');
  const editor = doc.querySelector('.live-preview-editor');

  if (!handle || !editor || handle._sveWidthBound) {
    return;
  }

  handle._sveWidthBound = true;

  handle.addEventListener(
    'mousedown',
    (event) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startW = editor.getBoundingClientRect().width;
      let next = startW;
      const frames = [...doc.querySelectorAll('iframe')];

      frames.forEach((frame) => {
        frame.style.pointerEvents = 'none';
      });

      sveState.lpWidthDragging = true;
      doc.body.style.cursor = 'ew-resize';
      doc.body.style.userSelect = 'none';

      const move = (e) => {
        next = applyLpEditorWidth(win, startW + (e.clientX - startX));
        placeLpWidthPicker(win);
        sve.placeGlobalsOverlay?.(win);
      };

      const up = () => {
        sveState.lpWidthDragging = false;
        doc.body.style.cursor = '';
        doc.body.style.userSelect = '';
        frames.forEach((frame) => {
          frame.style.pointerEvents = '';
        });
        doc.removeEventListener('mousemove', move, true);
        doc.removeEventListener('mouseup', up, true);
        applyLpEditorWidth(win, next);
        win.dispatchEvent(new Event('resize'));
      };

      doc.addEventListener('mousemove', move, true);
      doc.addEventListener('mouseup', up, true);
    },
    true
  );
}

/** Header, footer or a global section owns the column — Page Settings/SEO stay off. */
export function settingsBarTakeover(win) {
  const doc = win.document;
  const chrome = doc.getElementById(sve.CHROME_HOST_ID || '__sve-chrome-host');
  const global = doc.getElementById(sve.GLOBAL_SECTION_HOST_ID || '__sve-global-section-host');

  if (chrome?.dataset.sveReady === '1' || global?.dataset.sveReady === '1') {
    return true;
  }

  return !!sve.isGlobalsOverlayOpen?.(win);
}

/** Hide Page Settings/SEO and drop their reserved space in one go. */
export function hideSettingsBar(win) {
  const doc = win.document;
  const bar = doc.getElementById(sve.LP_WIDTH_ID);
  const editor = doc.querySelector('.live-preview-editor');

  if (bar) {
    bar.style.visibility = 'hidden';
    bar.style.pointerEvents = 'none';
  }

  if (editor) {
    editor.style.paddingTop = '';
  }
}

/**
 * Fanerne sidder over panelet, så de følger med når det ændrer bredde.
 * Drag-striben går i fuld højde (inkl. fanerækken) — baren stopper før den.
 */
export function placeLpWidthPicker(win) {
  const doc = win.document;
  const bar = doc.getElementById(sve.LP_WIDTH_ID);
  const editor = doc.querySelector('.live-preview-editor');

  if (settingsBarTakeover(win)) {
    hideSettingsBar(win);
    placeLpResizer(win);

    return;
  }

  if (!bar || !editor) {
    if (editor && !bar) {
      editor.style.paddingTop = '';
    }

    placeLpResizer(win);

    return;
  }

  const parent = doc.querySelector('.live-preview') || doc.body;

  if (bar.parentElement !== parent) {
    parent.appendChild(bar);
  }

  bar.style.visibility = '';
  bar.style.pointerEvents = '';
  bar.style.zIndex = '4';
  bar.style.position = 'fixed';

  const rect = editor.getBoundingClientRect();
  const handle = doc.querySelector('.live-preview-resizer');
  const grip = handle ? Math.round(handle.getBoundingClientRect().width) || 16 : 16;
  const width = Math.max(0, Math.round(rect.width) - grip);

  bar.style.left = `${Math.round(rect.left)}px`;
  bar.style.top = `${Math.round(rect.top)}px`;
  bar.style.width = `${width}px`;
  bar.style.maxWidth = `${width}px`;
  bar.style.background = win.getComputedStyle(editor).backgroundColor;

  const measured = Math.round(bar.offsetHeight);
  const pad = Number(editor.dataset.sveTabPad) || measured;

  if (pad > 0 && !editor.dataset.sveTabPad) {
    editor.dataset.sveTabPad = String(pad);
  }

  if (pad > 0) {
    editor.style.paddingTop = `${pad}px`;
  }

  placeLpResizer(win);
}

/**
 * Statamic's drag strip sits in the flex content box under our tab padding.
 * Pin it absolute so it runs from the editor top (under the header) to the bottom.
 */
export function placeLpResizer(win) {
  const handle = win.document.querySelector('.live-preview-resizer');
  const editor = win.document.querySelector('.live-preview-editor');

  if (!handle || !editor || sveState.lpCollapsed) {
    if (handle) {
      handle.style.position = '';
      handle.style.top = '';
      handle.style.right = '';
      handle.style.bottom = '';
      handle.style.height = '';
      handle.style.marginTop = '';
      handle.style.paddingTop = '';
      handle.style.zIndex = '';
      handle.style.alignSelf = '';
    }

    return;
  }

  handle.style.position = 'absolute';
  handle.style.top = '0';
  handle.style.right = '0';
  handle.style.bottom = '0';
  handle.style.height = 'auto';
  handle.style.marginTop = '0';
  handle.style.paddingTop = '0';
  handle.style.zIndex = '62';
  handle.style.alignSelf = 'stretch';
}

/**
 * Publish-fanerne (Page Settings, SEO, …) øverst i venstre panel.
 *
 * S/M/L-bredderne er væk — panelet husker det sidste træk i stedet. Fanerne
 * sidder i `.live-preview` (ikke i editoren), så solo-visningen ikke skjuler
 * dem. Header, footer og globale sektioner tager fanerne af i samme frame
 * som feltkolonnen skifter — ikke bagefter.
 */
export function ensureLpWidthPicker(win) {
  const doc = win.document;
  const editor = doc.querySelector('.live-preview-editor');
  const bar = doc.getElementById(sve.LP_WIDTH_ID);

  if (!editor || sveState.lpCollapsed) {
    bar?.remove();

    if (editor) {
      editor.style.paddingTop = '';
      delete editor.dataset.sveTabPad;
    }

    placeLpResizer(win);

    return;
  }

  bindLpEditorResize(win);

  if (settingsBarTakeover(win)) {
    hideSettingsBar(win);
    placeLpResizer(win);

    return;
  }

  ensureSettingsTabs(win);
  placeLpWidthPicker(win);
}

export let lpPanelToggleBusy = false;

export function ensureLpPanelToggle(win) {
  // Re-entry guard: our own DOM writes (toolbar, chrome, width bar) fire the
  // body MutationObserver that calls us. Without this the stack re-enters on
  // every tick and Live Preview freezes — including the open-preview button.
  if (lpPanelToggleBusy) {
    return;
  }

  lpPanelToggleBusy = true;

  try {
    ensureLpPanelToggleInner(win);
  } catch (err) {
    console.error('[sve] ensureLpPanelToggle', err);
  } finally {
    lpPanelToggleBusy = false;
  }
}

export function ensureLpPanelToggleInner(win) {
  const doc = win.document;
  const header = sve.lpHeader(doc);

  if (!header) {
    if (lpWasOpen) {
      lpWasOpen = false;
      lpWidthApplied = false;
      sveState.lpCollapsed = null;
      sveState.lpHeaderBgCache = null; // næste åbning kan være i et andet CP-tema
      doc.getElementById(sve.LP_WIDTH_ID)?.remove();
      sveState.chromePrefetchArmed = false;
      sve.persistDockedPanel(win);
      clearSolo(doc);
      sve.closeRightPanels(win);
      sve.parkGlobalsPanel(win);
      sveState.dockedHeaderRestored = false;
      sveState.headerTab = undefined;
      sveState.lpEnterSidebarClosed = null;
      removeLpBackButton(doc);
      sveState.lpCloseHideObserver?.disconnect();
      sveState.lpCloseHideObserver = null;
    }

    // Outside LP: still keep Theme Settings warming in the background.
    if (!doc.getElementById(sve.GLOBALS_PANEL_ID)) {
      sve.scheduleChromeGlobalsPrefetch(win);
    }

    return;
  }

  // Fresh Live Preview session — keep this user's device, collapse choice, pins.
  if (!lpWasOpen) {
    sveState.lpEnterSidebarClosed = sve.storedLpCollapsed(win);
  }

  lpWasOpen = true;

  if (sveState.lpCollapsed === null) {
    sveState.lpCollapsed = sve.storedLpCollapsed(win);
  }

  // Opening a section's settings holds the panel open for as long as they're
  // shown, whatever the mode says — otherwise the observer that re-applies the
  // mode on every Vue re-render slams it shut again a moment later.
  if (sveState.forcePanelOpen) {
    sveState.lpCollapsed = false;
  }

  // Ensure Theme Settings is warming (may already be from CP boot).
  if (!sveState.chromePrefetchArmed) {
    sveState.chromePrefetchArmed = true;
    sve.scheduleChromeGlobalsPrefetch(win);
  }

  doc.getElementById(sve.LP_TOGGLE_ID)?.remove();
  doc.getElementById(sve.LP_MODE_ID)?.remove();

  sve.ensureGlobalsPicker(win);
  sve.ensureSectionLibraryButton(win);
  sve.ensureCollectionPicker(win);
  enhanceGrids(win);

  // Collapse all of the above into the icon toolbar — one control at a time.
  ensureHeaderToolbar(win);
  applyHeaderTab(win);
  if (!sve.shouldKeepChrome(win)) {
    openFirstSectionOnce(win);
  }

  // First-section auto-open must not override "they started with it closed".
  // sveState.forcePanelOpen (chrome / global) and sve.setLpMode (the toolbar icon) win.
  if (!sveState.forcePanelOpen && sveState.lpEnterSidebarClosed && sveState.lpCollapsed === false) {
    sveState.lpCollapsed = true;
    chromeSet(win, sve.LP_COLLAPSED_KEY, '1');
  }

  restoreDockedHeaderPanels(win);
  sve.pinDockedPanelsUnderHeader(win);
  applyHeaderTab(win);
  openSettingsTab(win);
  applySectionsFieldVisibility(win);

  const editor = doc.querySelector('.live-preview-editor');

  if (editor) {
    const want = sveState.lpCollapsed ? '-10000px' : '';

    editor.style.position = sveState.lpCollapsed ? 'absolute' : '';
    editor.style.left = want;
    editor.style.top = sveState.lpCollapsed ? '0' : '';

    // Den sidst trukne bredde, klemmet til 16–50 rem. Under træk lader vi
    // håndtaget styre, ellers ville loopet trække tilbage under fingeren.
    if (!sveState.lpWidthDragging) {
      editor.style.width = `${lpStoredWidth(win)}px`;
    }
  }

  ensureLpWidthPicker(win);
  sve.placeGlobalsOverlay?.(win);
  ensureLpBackButton(win);
  ensureLpMoreButton(win);
  positionLpBackButton(win);
  watchStatamicLpClose(win);
  ensureLpPreviewChrome(win);
  // Closing parks the editor off-screen, so the dock goes full-width. Opening
  // it again has to re-measure — otherwise the dock stays at left:0 and the
  // sidebar footer sits on top of HTML/CSS/JS.
  relayoutCodeDock(win);
}



sve.SOLO_STYLE_ID = SOLO_STYLE_ID;
sve.SOLO_BACK_ID = SOLO_BACK_ID;
sve.SOLO_SAVE_ID = SOLO_SAVE_ID;
sve.SOLO_HOST_ID = SOLO_HOST_ID;
sve.SOLO_PARENT_ATTR = SOLO_PARENT_ATTR;
sve.SOLO_KEEP_ATTR = SOLO_KEEP_ATTR;
sve.PANEL_AWAY_ATTR = PANEL_AWAY_ATTR;
sve.PANEL_COLUMN_ATTR = PANEL_COLUMN_ATTR;
sve.clearSolo = clearSolo;
sve.soloRoot = soloRoot;
sve.panelFrameDoc = panelFrameDoc;
sve.ensureSoloStyle = ensureSoloStyle;
Object.defineProperty(sve, 'soloBackAction', { get() { return soloBackAction; }, set(v) { soloBackAction = v; } });
sve.leaveSolo = leaveSolo;
sve.addSoloBackButton = addSoloBackButton;
sve.markSoloPath = markSoloPath;
sve.markPanelIsolate = markPanelIsolate;
sve.soloMarksIntact = soloMarksIntact;
sve.ensurePanelSoloVisible = ensurePanelSoloVisible;
sve.soloPathIntact = soloPathIntact;
sve.soloSectionSettings = soloSectionSettings;
sve.SETTINGS_FIELDTYPES = SETTINGS_FIELDTYPES;
sve.sectionSettingsFields = sectionSettingsFields;
sve.activateSectionsTab = activateSectionsTab;
sve.FOCUS_HEADER_ID = FOCUS_HEADER_ID;
sve.FOCUS_ROOT_ATTR = FOCUS_ROOT_ATTR;
sve.FOCUS_SET_ATTR = FOCUS_SET_ATTR;
sve.FOCUS_HIDE_ATTR = FOCUS_HIDE_ATTR;
sve.FOCUS_FLAT_ATTR = FOCUS_FLAT_ATTR;
sve.FOCUS_FLUSH_ATTR = FOCUS_FLUSH_ATTR;
sve.FOCUS_STEP_ATTR = FOCUS_STEP_ATTR;
Object.defineProperty(sve, 'focusSegment', { get() { return focusSegment; }, set(v) { focusSegment = v; } });
Object.defineProperty(sve, 'focusRepaintPending', { get() { return focusRepaintPending; }, set(v) { focusRepaintPending = v; } });
sve.FOCUS_SETTINGS_SEGMENT = FOCUS_SETTINGS_SEGMENT;
sve.focusPanelOn = focusPanelOn;
sve.setMeta = setMeta;
sve.gridMeta = gridMeta;
sve.setTypeForUid = setTypeForUid;
sve.parentRowUid = parentRowUid;
sve.focusKindOf = focusKindOf;
sve.childSets = childSets;
sve.foldChildSets = foldChildSets;
sve.addStepInto = addStepInto;
sve.markStepIntoAll = markStepIntoAll;
sve.humanizeHandle = humanizeHandle;
sve.clearFocus = clearFocus;
sve.flattenWrappers = flattenWrappers;
sve.stacksChildren = stacksChildren;
sve.focusHeaderHost = focusHeaderHost;
sve.ensureFocusHeader = ensureFocusHeader;
sve.paintFocusHeader = paintFocusHeader;
sve.applyFocusSegment = applyFocusSegment;
sve.segmentHasContent = segmentHasContent;
sve.hideEmptySegments = hideEmptySegments;
sve.fieldHandleFromPath = fieldHandleFromPath;
sve.focusRowMeta = focusRowMeta;
sve.paintFocus = paintFocus;
sve.scheduleFocusRepaint = scheduleFocusRepaint;
sve.focusBack = focusBack;
sve.focusFromPreview = focusFromPreview;
sve.fieldOwnerUid = fieldOwnerUid;
sve.fieldOwnerUidFromValues = fieldOwnerUidFromValues;
sve.deepestFieldPath = deepestFieldPath;
sve.rowOwningField = rowOwningField;
sve.focusFieldOwner = focusFieldOwner;
sve.soloSection = soloSection;
Object.defineProperty(sve, 'lpWasOpen', { get() { return lpWasOpen; }, set(v) { lpWasOpen = v; } });
Object.defineProperty(sve, 'lpWidthApplied', { get() { return lpWidthApplied; }, set(v) { lpWidthApplied = v; } });
sve.remToPx = remToPx;
sve.clampSideWidth = clampSideWidth;
sve.lpStoredWidth = lpStoredWidth;
sve.persistLpWidth = persistLpWidth;
sve.applyLpEditorWidth = applyLpEditorWidth;
sve.bindLpEditorResize = bindLpEditorResize;
sve.settingsBarTakeover = settingsBarTakeover;
sve.hideSettingsBar = hideSettingsBar;
sve.placeLpWidthPicker = placeLpWidthPicker;
sve.placeLpResizer = placeLpResizer;
sve.ensureLpWidthPicker = ensureLpWidthPicker;
Object.defineProperty(sve, 'lpPanelToggleBusy', { get() { return lpPanelToggleBusy; }, set(v) { lpPanelToggleBusy = v; } });
sve.ensureLpPanelToggle = ensureLpPanelToggle;
sve.ensureLpPanelToggleInner = ensureLpPanelToggleInner;
