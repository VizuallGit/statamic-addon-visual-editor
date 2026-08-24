/**
 * Settings toggle: `outline`
 * Heading outline in the right dock.
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { sve } from './cp-registry.js';
import { t } from './cp-t.js';
import { sveState } from './cp-state.js';
import { SELECTORS } from './cp-selectors.js';
import { applyHeaderTab, sendToPreview, setHeaderTab } from './cp.js';
import { mountPane } from './cp/mount-pane.js';
import { RIGHT_PANEL_FILL, releaseRightShellIfEmpty, showInRightShell } from './right-dock.js';
import OutlinePane from './cp/surfaces/OutlinePane.vue';
import OutlineList from './cp/surfaces/OutlineList.vue';
import { outlineUi } from './cp/outline/store.js';

// ===== outline =====
// --- Heading outline panel ------------------------------------------------------
// The page's headings as one list, docked on the right: not the sections it is
// built from, but the structure a reader — or a screen reader, or a search engine
// — actually meets. Clicking one scrolls the preview to it and, where the heading
// sits in an annotated block, opens that block in the editor panel: the outline is
// a map and a way in at once.
//
// The list comes from the preview, because only the rendered page knows what its
// headings are: one can come from a block, another from a global, a third from the
// layout. The bridge keeps it in step while the panel is open and stops when it
// closes.

export const OUTLINE_PANEL_ID = '__sve-outline-panel';

/** The last list the preview sent. Redrawn whole; never edited in place. */
export let outlineItems = [];
export let outlineActive = -1;
// Whether the preview has answered at all. An empty list means "no headings on
// this page", which is a different thing from "no answer yet" — and saying the
// first while waiting for the second is how a panel comes to lie about a page.
export let outlineAnswered = false;
/** True only while the pane is shown and the preview is asked to report headings. */
export let outlineWatching = false;
export let outlineValuesUnhook = [];
export let outlineValuesTimer = 0;
export let outlineValuesKey = '';
export let outlineValuesTarget = null;
export let outlineRefreshTimers = [];

export function outlinePanel(doc) {
  return doc.getElementById(OUTLINE_PANEL_ID);
}

/** Ask the preview to start (or stop) reporting its headings. */
export function watchOutlineInPreview(win, on) {
  outlineWatching = !!on;
  sendToPreview({ source: 'statamic-visual-editor', type: 'outline-watch', on }, win);
}

/**
 * Top-level section ids — add, delete and reorder of Patterns drops. Heading
 * text still comes from the preview; this only notices that the page's
 * sections moved, so we can ask again after a remorph or a fresh iframe.
 */
export function outlineSectionKey(win, doc) {
  const field = sve.sectionField(win);

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);
    const rows = values?.[field];

    if (!Array.isArray(rows)) {
      continue;
    }

    return rows.map((row) => row?._visual_id || row?._id || row?.type || '').join('\n');
  }

  return '';
}

export function stopWatchOutlineValues(win) {
  outlineValuesUnhook.forEach((unhook) => {
    if (typeof unhook === 'function') {
      unhook();
    }
  });
  outlineValuesUnhook = [];
  outlineValuesTarget = null;
  outlineValuesKey = '';

  if (win) {
    win.clearTimeout(outlineValuesTimer);
    outlineRefreshTimers.forEach((id) => win.clearTimeout(id));
  }

  outlineValuesTimer = 0;
  outlineRefreshTimers = [];
}

/** Re-ask the preview after the page's sections have moved. */
export function refreshOutlineFromPreview(win) {
  if (!outlineWatching || !outlinePanel(win.document)) {
    return;
  }

  watchOutlineInPreview(win, true);
  outlineRefreshTimers.forEach((id) => win.clearTimeout(id));
  outlineRefreshTimers = [350, 900].map((ms) =>
    win.setTimeout(() => {
      if (outlineWatching && outlinePanel(win.document)) {
        watchOutlineInPreview(win, true);
      }
    }, ms)
  );
}

/**
 * Same hole as the block tree: a section dropped or deleted updates the
 * preview, and this list stayed on the headings it last heard. The preview
 * watcher catches a remorph; a full iframe reload does not. Re-attach when
 * the page's sections change.
 */
export function watchOutlineValues(win) {
  const doc = win.document;
  const field = sve.sectionField(win);
  let container = null;

  for (const candidate of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(candidate.values);

    if (values && typeof values === 'object' && Array.isArray(values[field])) {
      container = candidate;
      break;
    }
  }

  if (!container) {
    if (outlinePanel(doc) && !outlineValuesUnhook.length) {
      win.setTimeout(() => {
        if (outlinePanel(doc) && !outlineValuesUnhook.length) {
          watchOutlineValues(win);
        }
      }, 250);
    }

    return;
  }

  if (outlineValuesTarget === container && outlineValuesUnhook.length) {
    return;
  }

  stopWatchOutlineValues(win);
  outlineValuesTarget = container;
  outlineValuesKey = outlineSectionKey(win, doc);

  const onStructure = () => {
    win.clearTimeout(outlineValuesTimer);
    outlineValuesTimer = win.setTimeout(() => {
      if (!outlinePanel(doc)) {
        return;
      }

      const key = outlineSectionKey(win, doc);

      if (key === outlineValuesKey) {
        return;
      }

      outlineValuesKey = key;
      refreshOutlineFromPreview(win);
    }, 0);
  };

  const onPageStructure = () => refreshOutlineFromPreview(win);

  doc.addEventListener('sve-page-structure', onPageStructure);
  outlineValuesUnhook.push(() => doc.removeEventListener('sve-page-structure', onPageStructure));

  const vueWatch = win.Vue?.watch;
  const values = container.values;

  if (typeof vueWatch === 'function' && values) {
    const stop = vueWatch(
      values.__v_isRef ? values : () => sve.unwrapRef(values)?.[field],
      onStructure,
      { deep: true }
    );

    if (typeof stop === 'function') {
      outlineValuesUnhook.push(stop);
    }
  }
}

export function closeOutlinePanel(win) {
  const panel = win.document.getElementById(OUTLINE_PANEL_ID);

  if (!panel) {
    outlineItems = [];
    outlineActive = -1;
    outlineAnswered = false;
    watchOutlineInPreview(win, false);
    stopWatchOutlineValues(win);
    sve.syncPreviewInset(win);

    return;
  }

  panel.remove();
  outlineItems = [];
  outlineActive = -1;
  outlineAnswered = false;
  watchOutlineInPreview(win, false);
  stopWatchOutlineValues(win);

  if (sveState.headerTab === 'outline') {
    setHeaderTab(win, null);
  }

  releaseRightShellIfEmpty(win);
  sve.persistDockedPanel(win);
  applyHeaderTab(win);
  sve.syncPreviewInset(win);
}

export function fillOutlinePane(win, pane) {
  if (pane.querySelector('[data-sve-outline-list]')) {
    return;
  }

  pane.id = OUTLINE_PANEL_ID;
  mountPane(pane, OutlinePane, {
    title: t(win, 'outline'),
    hint: t(win, 'outline_hint'),
    withChrome: true,
  });
  pane.querySelector('[data-sve-close]')?.addEventListener('click', () => closeOutlinePanel(win));
}

export function showOutlinePane(win) {
  renderOutline(win);
  watchOutlineInPreview(win, true);
  watchOutlineValues(win);

  [700, 2000].forEach((delay) => {
    win.setTimeout(() => {
      if (!outlineAnswered && win.document.getElementById(OUTLINE_PANEL_ID)) {
        watchOutlineInPreview(win, true);
      }
    }, delay);
  });
}

/** Opens the panel, or closes it when it is already up. */
export function toggleOutlinePanel(win) {
  const doc = win.document;

  if (!sve.featureOn(win, 'outline')) {
    return;
  }

  if (doc.getElementById(OUTLINE_PANEL_ID)) {
    closeOutlinePanel(win);

    return;
  }

  sve.closeRightPanels(win, [OUTLINE_PANEL_ID]);

  const panel = doc.createElement('div');

  panel.id = OUTLINE_PANEL_ID;
  panel.style.cssText = RIGHT_PANEL_FILL;
  mountPane(panel, OutlinePane, {
    title: t(win, 'outline'),
    hint: t(win, 'outline_hint'),
    withChrome: true,
  });

  panel.querySelector('[data-sve-close]').addEventListener('click', () => closeOutlinePanel(win));
  showInRightShell(win, panel);
  sve.persistDockedPanel(win);
  applyHeaderTab(win);
  sve.syncPreviewInset(win);

  renderOutline(win);
  watchOutlineInPreview(win, true);
  watchOutlineValues(win);

  [700, 2000].forEach((delay) => {
    win.setTimeout(() => {
      if (!outlineAnswered && doc.getElementById(OUTLINE_PANEL_ID)) {
        watchOutlineInPreview(win, true);
      }
    }, delay);
  });
}

/** A fresh list from the preview. */
export function handleOutline(data, win) {
  outlineAnswered = true;
  outlineItems = Array.isArray(data.items) ? data.items : [];

  if (outlineActive >= outlineItems.length) {
    outlineActive = -1;
  }

  renderOutline(win);
}

/**
 * What the outline says about itself.
 *
 * Three things go wrong with headings, and none of them shows on the page — the
 * text looks right whatever level it is written at. They only show here, which is
 * the argument for saying them here:
 *
 * - no H1 at all: nothing on the page says what the page is;
 * - more than one H1: several things claim to be what the page is;
 * - a level reached without passing through the one above it, and any heading
 *   standing before the page's own H1. Both are the same fault seen from two
 *   sides — the order read is not the order meant.
 *
 * The first two are `critical`, the third is a `warning`, and the difference is
 * what the reader can do with it. A skipped level is untidy — the page still says
 * what it is, just in a jumbled order. An H1 count that isn't one is an answer
 * that is wrong: the outline has no top, or several tops that disagree. Both are
 * reported the same way and told apart by colour, so a page with a few loose
 * headings doesn't shout as loudly as one with no subject.
 *
 * Nothing is stored and nothing is dismissed: the checks are run against the list
 * as it stands, and the list is rebuilt whenever the page changes. Put the
 * headings in order and the warnings are gone by the next render, because there is
 * nothing left to report.
 *
 * @returns {{
 *   page: {message: string, severity: 'critical'|'warning'}[],
 *   rows: Map<number, {messages: string[], severity: 'critical'|'warning'}>
 * }}
 */
export function outlineIssues(win, items) {
  const rows = new Map();
  const page = [];

  if (!items.length) {
    return { page, rows };
  }

  // Adds a fault to a row, keeping the worse of the two severities and both
  // messages. The rules below are independent of each other, so nothing stops two
  // of them landing on the same heading; as they stand today none of them can
  // (an H1 can neither stand before the first H1 nor skip a level), but that is a
  // property of the current rules, not something the row should depend on.
  const flag = (index, message, severity) => {
    const existing = rows.get(index);

    if (!existing) {
      rows.set(index, { messages: [message], severity });

      return;
    }

    existing.messages.push(message);

    if (severity === 'critical') {
      existing.severity = 'critical';
    }
  };

  const h1s = items.filter((item) => item.level === 1).length;

  // Critical, both ways round. "Exactly one H1" is not a matter of taste like
  // level order is: none, and nothing on the page says what it is about; several,
  // and they contradict each other. Either way the answer is wrong, not untidy —
  // so it is marked apart from the warnings rather than lost among them.
  if (!h1s) {
    page.push({ message: t(win, 'outline_issue_no_h1'), severity: 'critical' });
  } else if (h1s > 1) {
    page.push({ message: t(win, 'outline_issue_many_h1', { count: h1s }), severity: 'critical' });

    // Every one of them, not just the extras: there is no telling which was meant
    // to be THE heading, and marking the second onwards would quietly answer that
    // question on the writer's behalf.
    items.forEach((item, index) => {
      if (item.level === 1) {
        flag(index, t(win, 'outline_issue_duplicate_h1', { count: h1s }), 'critical');
      }
    });
  }

  const firstH1 = items.findIndex((item) => item.level === 1);
  let previous = 0;

  items.forEach((item, index) => {
    if (firstH1 > 0 && index < firstH1) {
      flag(index, t(win, 'outline_issue_before_h1'), 'warning');
    } else if (previous && item.level > previous + 1) {
      flag(
        index,
        t(win, 'outline_issue_skipped', {
          from: previous,
          to: item.level,
          next: previous + 1,
        }),
        'warning'
      );
    }

    previous = item.level;
  });

  return { page, rows };
}

/** The page-level notices, above the list. Empty when there is nothing to say. */
export function renderOutlineNotice(win, notices) {
  outlineUi.notices = notices;
}

export function renderOutline(win) {
  const doc = win.document;
  const list = outlinePanel(doc)?.querySelector('[data-sve-outline-list]');

  if (!list) {
    return;
  }

  const issues = outlineIssues(win, outlineItems);

  renderOutlineNotice(win, issues.page);

  outlineUi.emptyText = t(win, outlineAnswered ? 'outline_empty' : 'loading');
  outlineUi.onJump = (index) => jumpToOutlineEntry(win, index, outlineItems[index]);

  if (!outlineItems.length) {
    outlineUi.rows = [];
    mountPane(list, OutlineList);

    return;
  }

  const base = Math.min(...outlineItems.map((item) => item.level));

  outlineUi.rows = outlineItems.map((item, index) => {
    const issue = issues.rows.get(index);

    return {
      index,
      depth: Math.max(0, Math.min(item.level - base, 5)),
      current: index === outlineActive,
      level: `H${item.level}`,
      text: item.text || t(win, 'outline_blank'),
      blank: !item.text,
      warn: issue?.severity || '',
      title: issue ? issue.messages.join('\n') : '',
    };
  });

  mountPane(list, OutlineList);
}

/**
 * Clicking an entry: the preview scrolls to the heading and marks it, and the
 * editor panel opens whatever owns it.
 *
 * The panel only follows where the mode allows it (`sve.autoOpenPanel`) — someone who
 * has put the editor panel away is reading the page, and yanking it back open on
 * a click meant "take me there" would be the opposite of what was asked.
 */
export function jumpToOutlineEntry(win, index, item) {
  sendToPreview({ source: 'statamic-visual-editor', type: 'outline-focus', index }, win);

  outlineActive = index;
  outlineUi.rows.forEach((row) => {
    row.current = row.index === index;
  });

  if (!sve.autoOpenPanel(win)) {
    return;
  }

  if (item.field && item.scope && sve.focusPanelOn(win)) {
    sve.focusFieldOwner(item.field, item.scope, win.document, win);

    return;
  }

  if (item.uid) {
    sve.focusFromPreview(item.uid, win.document, win, { clampToSection: true });
  }
}



sve.OUTLINE_PANEL_ID = OUTLINE_PANEL_ID;
Object.defineProperty(sve, 'outlineItems', { get() { return outlineItems; }, set(v) { outlineItems = v; } });
Object.defineProperty(sve, 'outlineActive', { get() { return outlineActive; }, set(v) { outlineActive = v; } });
Object.defineProperty(sve, 'outlineAnswered', { get() { return outlineAnswered; }, set(v) { outlineAnswered = v; } });
sve.outlinePanel = outlinePanel;
sve.watchOutlineInPreview = watchOutlineInPreview;
Object.defineProperty(sve, 'outlineWatching', { get() { return outlineWatching; }, set(v) { outlineWatching = v; } });
sve.outlineSectionKey = outlineSectionKey;
sve.stopWatchOutlineValues = stopWatchOutlineValues;
sve.refreshOutlineFromPreview = refreshOutlineFromPreview;
sve.watchOutlineValues = watchOutlineValues;
sve.closeOutlinePanel = closeOutlinePanel;
sve.fillOutlinePane = fillOutlinePane;
sve.showOutlinePane = showOutlinePane;
sve.toggleOutlinePanel = toggleOutlinePanel;
sve.handleOutline = handleOutline;
sve.outlineIssues = outlineIssues;
sve.renderOutlineNotice = renderOutlineNotice;
sve.renderOutline = renderOutline;
sve.jumpToOutlineEntry = jumpToOutlineEntry;
