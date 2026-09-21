/**
 * cp.js — region "grid-rows", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel cp.js for what the shell exports.
 */
import { dismissLpMoreMenu } from '../lp-more-menu.js';
import { t } from '../lib/i18n.js';
import { sveState } from '../cp-state.js';
import { closeCodeDock, relayoutCodeDock, setCodeDockArmed } from '../code-dock-lazy.js';
import { relayoutAiPanel } from '../ai-panel-lazy.js';
import { RIGHT_DOCK_ID, relayoutRightDock } from '../right-dock.js';
import { chromeSet, clearChromePrefs } from '../chrome-prefs.js';
import { bindMenuDismiss, dropMenu } from '../lp-menu-dismiss.js';
import { injectStyle } from '../lib/style.js';
import { ENTRY_EDIT_PATH, LP_BACK_ID, LP_BLUEPRINT_ID, LP_CHROME_H, LP_COLLAPSED_KEY, LP_MODE_ID, LP_MODE_KEY, LP_PREVIEW_CHROME_ID, LP_RELOAD_ID, LP_SIDE_DEFAULT_REM } from '../lib/ids.js';
import { lpHeader } from '../lib/live-preview.js';
import { remToPx } from '../lib/dom.js';
import { csrfToken } from '../lib/csrf.js';
import { previewFrame } from '../lib/preview-frame.js';
import { findLpSaveButton, syncLpRightBarGaps } from '../lp-panel.js';
import { ensureLpPanelToggle, persistLpWidth } from '../focus-panel.js';
import { closeRightPanels, syncPreviewInset } from '../section-library.js';
import { discardGlobalsChanges, hasUnsavedGlobals, hasUnsavedWork, saveGlobalsPanel } from '../globals-panel.js';
import { clearEntryBaseline, markEntryFormClean, scheduleEntryBaseline } from '../inline-edit.js';
import { clearSectionsStash, hasUnsavedGlobalSection, saveGlobalSectionPanel } from '../global-section.js';
import { disarmUnloadWarning, discardChanges, dismissDirtyWarning, forgetOrigin, hasUnsavedChanges, leaveQuietly, onEntrySave, originForCurrentEntry, publishButtonIn, saveButtonIn } from '../open-in-preview.js';
import { confirmUnsaved, saveThenNavigate } from '../pages.js';
import { isEmbeddedInSite, postToHost, sendToPreview } from './add-section.js';
import { HEADER_TOOLBAR_ID, LP_ICON_BTN_STYLE, applyHeaderTab } from './header-toolbar.js';
import { applyLpDevice, applyLpZoom, paintLpPreviewChrome } from './block-order.js';
import { LP_DEVICE_KEY, LP_ZOOM_DEFAULT, LP_ZOOM_KEY } from './preview-chrome.js';
import { MSG, SOURCE } from '../lib/protocol.js';

// ===== grid-rows =====
// --- Grid rows: collapse to a title, one open at a time ------------------------
//
// Statamic's Grid (stacked) shows every row's fields in full, which eats the
// editor panel when a grid has several rows. This turns each row into an
// accordion item — the header collapses to a one-line title (the first field's
// value), and opening one closes the others — the way the Replicator already
// behaves. Rows are Statamic's own DOM: a `.grid-stacked > <panel>` with a
// `<header>` (drag handle + duplicate/delete) and a fields body beside it. We
// only mark and toggle; Vue keeps owning the DOM.

export const GRID_ROW_ATTR = 'data-sve-grid-row';
export const GRID_COLLAPSED_ATTR = 'data-sve-grid-collapsed';
export const GRID_DONE_ATTR = 'data-sve-grid-done';
export const GRID_STYLE_ID = 'sve-grid-accordion-style';

export function ensureGridStyle(doc) {
  injectStyle(doc, GRID_STYLE_ID, `
    [${GRID_ROW_ATTR}] > header { cursor: pointer; }
    [${GRID_ROW_ATTR}][${GRID_COLLAPSED_ATTR}] > *:not(header) { display: none !important; }
    [${GRID_ROW_ATTR}][${GRID_COLLAPSED_ATTR}] > header { border-bottom-color: transparent; }
    .sve-grid-title {
      flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      font-size: 13px; font-weight: 500; opacity: .7; padding: 0 10px; pointer-events: none;
    }
    [${GRID_ROW_ATTR}]:not([${GRID_COLLAPSED_ATTR}]) .sve-grid-title { opacity: 0; }
    .sve-grid-chevron {
      flex: 0 0 auto; width: 14px; height: 14px; opacity: .5; transition: transform .15s;
      pointer-events: none; margin-left: 4px;
    }
    [${GRID_ROW_ATTR}][${GRID_COLLAPSED_ATTR}] .sve-grid-chevron { transform: rotate(-90deg); }
  `);
}

/** Prefer text / textarea / Bard — skip icons, assets, empty controls, etc. */
export const GRID_TITLE_SKIP = [
  'assets-fieldtype',
  'button_group-fieldtype',
  'button-group-fieldtype',
  'toggle-fieldtype',
  'revealer-fieldtype',
  'date-fieldtype',
  'integer-fieldtype',
  'float-fieldtype',
  'range-fieldtype',
  'color-fieldtype',
  'auto_uuid-fieldtype',
  'iconamic-fieldtype',
  'iconify-fieldtype',
  'link-fieldtype',
  'section-fieldtype',
  'spacer-fieldtype',
  'hidden-fieldtype',
];

/**
 * Collapsed-row label: first non-empty text, textarea or Bard value.
 * (The previous "first input" approach hit empty icon fields and showed "—".)
 */
export function gridRowTitle(row) {
  try {
    const fields = row.querySelectorAll('.publish-fields input, .publish-fields textarea');

    for (const field of fields) {
      const type = (
        field.getAttribute('type') ||
        (field.tagName === 'TEXTAREA' ? 'textarea' : 'text')
      ).toLowerCase();

      if (!['text', 'search', 'url', 'email', 'tel', 'textarea'].includes(type)) {
        continue;
      }

      const wrapper = field.closest('[class*="-fieldtype"]');

      if (wrapper && GRID_TITLE_SKIP.some((name) => wrapper.classList.contains(name))) {
        continue;
      }

      const value = (field.value || '').replace(/\s+/g, ' ').trim();

      if (value) {
        return value.length > 80 ? `${value.slice(0, 77)}…` : value;
      }
    }

    for (const editable of row.querySelectorAll(
      '.publish-fields .ProseMirror, .publish-fields [contenteditable="true"]',
    )) {
      const value = (editable.textContent || '').replace(/\s+/g, ' ').trim();

      if (value) {
        return value.length > 80 ? `${value.slice(0, 77)}…` : value;
      }
    }
  } catch {
    // never break Live Preview over a label scrape
  }

  return '—';
}

export function setGridRowCollapsed(row, collapsed) {
  if (collapsed) {
    row.setAttribute(GRID_COLLAPSED_ATTR, '');
  } else {
    row.removeAttribute(GRID_COLLAPSED_ATTR);
  }

  const title = row.querySelector(':scope > header .sve-grid-title');

  if (!title) {
    return;
  }

  // Only write when the text actually changes — writing on every LP mutation
  // observer pass caused an infinite loop and froze Live Preview.
  const next = collapsed ? gridRowTitle(row) : '';

  if (title.textContent !== next) {
    title.textContent = next;
  }
}

/** True for a real Grid stacked row panel — it carries a header of its own. */
export function isGridRow(el) {
  return el.matches('div') && !!el.querySelector(':scope > header');
}

export function enhanceGridRow(win, row, stacked) {
  if (row.hasAttribute(GRID_ROW_ATTR)) {
    return;
  }

  const header = row.querySelector(':scope > header');

  if (!header) {
    return;
  }

  row.setAttribute(GRID_ROW_ATTR, '');

  const doc = win.document;
  const title = doc.createElement('span');

  title.className = 'sve-grid-title';

  const chevron = doc.createElement('span');

  chevron.className = 'sve-grid-chevron';
  chevron.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;">' +
    '<polyline points="6 9 12 15 18 9"></polyline></svg>';

  // Title fills the middle of the header; the chevron sits at the far end. The
  // drag handle stays first, the duplicate/delete buttons stay last.
  const firstButton = header.querySelector(':scope > button');

  if (firstButton && firstButton.nextSibling) {
    header.insertBefore(title, firstButton.nextSibling);
  } else {
    header.appendChild(title);
  }

  header.appendChild(chevron);

  header.addEventListener('click', (event) => {
    // The drag handle and the duplicate/delete buttons keep their own jobs.
    if (event.target.closest('button')) {
      return;
    }

    const opening = row.hasAttribute(GRID_COLLAPSED_ATTR);

    if (opening) {
      [...stacked.children].forEach((sibling) => {
        if (sibling !== row && sibling.hasAttribute(GRID_ROW_ATTR)) {
          setGridRowCollapsed(sibling, true);
        }
      });
    }

    setGridRowCollapsed(row, !opening);
  });

  // Rows start collapsed; the grid opens its first one below. Set once, so a
  // later re-render never fights the state the user has clicked into.
  setGridRowCollapsed(row, true);

  // Vue often fills Title a beat later. One quiet retry only if still "—",
  // and only if the text would change (avoids mutation-observer loops).
  win.setTimeout(() => {
    if (!row.isConnected || !row.hasAttribute(GRID_COLLAPSED_ATTR)) {
      return;
    }

    const label = row.querySelector(':scope > header .sve-grid-title');

    if (!label || label.textContent !== '—') {
      return;
    }

    const next = gridRowTitle(row);

    if (next !== '—' && label.textContent !== next) {
      label.textContent = next;
    }
  }, 500);
}

/**
 * Turns every Grid (stacked) in the editor panel into an accordion. Runs on each
 * LP re-render; already-enhanced rows are skipped, so user-chosen open/closed
 * states survive. A freshly seen grid starts with only its first row open.
 */
export function enhanceGrids(win) {
  const doc = win.document;
  const editor = doc.querySelector('.live-preview-editor');

  if (!editor) {
    return;
  }

  ensureGridStyle(doc);

  editor.querySelectorAll('.grid-stacked').forEach((stacked) => {
    const rows = [...stacked.children].filter((el) => isGridRow(el));

    if (!rows.length) {
      return;
    }

    // enhanceGridRow starts each row collapsed (once). New rows added later
    // therefore arrive collapsed without disturbing the rows already on screen.
    rows.forEach((row) => enhanceGridRow(win, row, stacked));

    // A grid seen for the first time opens its first row, so it isn't a wall of
    // closed headers — but only if the user hasn't already opened one.
    if (!stacked.hasAttribute(GRID_DONE_ATTR)) {
      stacked.setAttribute(GRID_DONE_ATTR, '');

      if (!rows.some((row) => !row.hasAttribute(GRID_COLLAPSED_ATTR))) {
        setGridRowCollapsed(rows[0], false);
      }
    }
  });
}

/** How long to wait for a save to come back before giving the button up again. */
export const LP_SAVE_TIMEOUT = 15000;

/**
 * Leaving the editor publishes what you changed. Clicking Statamic's own
 * save/publish buttons rather than posting to the API ourselves, so validation,
 * revisions and everything else behave exactly as they do from the CP.
 *
 * Revisions off → one click on "Save & Publish" (unchanged).
 * Revisions on  → save the working copy, then POST publish automatically (no
 * Publish dialog), then leave.
 *
 * Pass `{ publish: false }` to only save the working copy and stay in the editor.
 *
 * Nothing changed → leave straight away (unless save-only). A save that fails
 * puts the button back and keeps you in the editor, where the error is.
 */
export function leaveEditor(win, link, leave, { publish = true } = {}) {
  if (link.dataset.busy) {
    return;
  }

  const save = saveButtonIn(win.document);
  const hasPublish = !!publishButtonIn(win.document);
  const saveOnly = hasPublish && !publish;
  const entryDirty = hasUnsavedChanges(win);
  const globalsDirty = hasUnsavedGlobals(win);
  const sectionDirty = hasUnsavedGlobalSection(win);

  if (!save && !globalsDirty && !sectionDirty) {
    if (!saveOnly) {
      leave();
    }

    return;
  }

  if (!entryDirty && !globalsDirty && !sectionDirty) {
    if (saveOnly) {
      return;
    }

    // Nothing to write — just leave. Do NOT auto-publish a clean working copy;
    // that trapped users on "Saving…" when dirty detection was sticky, and it
    // showed save/publish actions when the form had no real edits.
    leave();

    return;
  }

  runBusy(win, link, (release, setLabel) => {
    setLabel(t(win, 'saving'));

    if (!saveOnly) {
      postToHost(win, 'lp-leaving');
    }

    const finishAfterEntry = (ok) => {
      if (!ok) {
        release();

        return;
      }

      if (saveOnly) {
        release();
      } else {
        leaveQuietly(win, leave);
      }
    };

    const saveEntry = () => {
      if (!entryDirty || !save) {
        finishAfterEntry(true);

        return;
      }

      let settled = false;

      const stop = onEntrySave((ok) => {
        if (settled) {
          return;
        }

        // Revisions off, or save-only: one step.
        if (!hasPublish || saveOnly) {
          settled = true;
          stop();
          clearTimeout(timer);
          finishAfterEntry(ok);

          return;
        }

        // Revisions on + publish: working-copy save done — publish without a dialog.
        settled = true;
        stop();
        clearTimeout(timer);

        if (!ok) {
          release();

          return;
        }

        // Save just succeeded — refresh the clean baseline so leave isn't
        // blocked by sticky $dirty, and value-diff matches the saved form.
        markEntryFormClean(win);

        publishWorkingCopy(win, {
          onSuccess: () => leaveQuietly(win, leave),
          onFailure: release,
          onPublishing: () => setLabel(t(win, 'publishing')),
          afterSave: true,
        });
      });

      const timer = setTimeout(() => {
        if (settled) {
          return;
        }

        settled = true;
        stop();
        release();
      }, LP_SAVE_TIMEOUT);

      save.click();
    };

    // Theme Settings / global section first — entry save can navigate away.
    saveGlobalsPanel(win, (ok) => {
      if (!ok) {
        release();

        return;
      }

      saveGlobalSectionPanel(win, (sectionOk) => {
        if (!sectionOk) {
          release();

          return;
        }

        saveEntry();
      });
    });
  });
}

/** Marks the back-pill busy, runs `work`, and gives it release/setLabel helpers. */
export function runBusy(win, link, work) {
  const label = link.querySelector('span');
  const original = label?.textContent;

  link.dataset.busy = '1';
  link.style.pointerEvents = 'none';
  link.style.opacity = '.5';

  const setLabel = (text) => {
    if (label) {
      label.textContent = text;
    }
  };

  const release = () => {
    delete link.dataset.busy;
    link.style.pointerEvents = '';
    link.style.opacity = '.8';

    if (label && original) {
      label.textContent = original;
    }

    link.sveCollapse?.();
  };

  work(release, setLabel);
}

/**
 * Statamic's publish endpoint for the open entry — same URL the Publish dialog
 * posts to (`…/entries/{id}/publish`).
 */
export function entryPublishUrl(win) {
  return `${win.location.pathname.replace(/\/$/, '')}/publish`;
}

/**
 * Publish the working copy with no dialog — the same POST Statamic's "Publish
 * Now" makes, minus the notes field.
 *
 * Waits until the Publish button is enabled so we never race the preceding
 * Save Changes. Pass `afterSave: true` when the working copy was just written
 * — then skip the dirty-form wait (sticky $dirty used to block leave forever).
 */
export function publishWorkingCopy(win, { onSuccess, onFailure, onPublishing, afterSave = false } = {}) {
  let settled = false;
  let enableTimer = null;
  let attempts = 0;

  const finish = (ok) => {
    if (settled) {
      return;
    }

    settled = true;
    clearTimeout(enableTimer);
    clearTimeout(timer);
    (ok ? onSuccess : onFailure)?.();
  };

  const tryPublish = () => {
    if (settled) {
      return;
    }

    const button = publishButtonIn(win.document);
    // After an explicit save we already cleared dirty marks — only wait for the
    // Publish button to enable (Statamic may still be finishing its UI update).
    const blocked = afterSave
      ? button?.disabled === true
      : hasUnsavedChanges(win) || button?.disabled === true;

    if (blocked) {
      if (++attempts > 50) {
        // Don't trap the user on "Saving…": after a successful save, leave even
        // if Publish never lit up; otherwise report failure.
        finish(!!afterSave);

        return;
      }

      enableTimer = win.setTimeout(tryPublish, 100);

      return;
    }

    onPublishing?.();

    const rearm = disarmUnloadWarning(win);

    win
      .fetch(entryPublishUrl(win), {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-CSRF-TOKEN': csrfToken(win),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ message: null }),
      })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        const ok = response.ok && data.saved !== false;

        if (!ok) {
          rearm();
        }

        finish(ok);
      })
      .catch(() => {
        rearm();
        finish(false);
      });
  };

  const timer = win.setTimeout(() => finish(false), LP_SAVE_TIMEOUT);

  tryPublish();
}

/**
 * Close Live Preview — replaces Statamic’s ×. Same leave flow as before
 * (save/publish menu when dirty). Styled like the left icon pills so the whole
 * bar shares one height and surface.
 */
export const LP_BACK_MENU_ID = '__sve-lp-back-menu';

export const LP_BACK_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';

const LP_MENU_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';

const LP_BACK_ADMIN_ICON_SVG =
  LP_MENU_ICON +
  '<rect width="20" height="14" x="2" y="3" rx="2"></rect>' +
  '<path d="M8 21h8"></path>' +
  '<path d="M12 17v4"></path></svg>';

const LP_BACK_SITE_ICON_SVG =
  LP_MENU_ICON +
  '<rect x="3" y="3" width="18" height="18" rx="2"></rect>' +
  '<path d="M3 8h18"></path>' +
  '<path d="M7 14h7"></path>' +
  '<path d="m11 11 3 3-3 3"></path></svg>';


export function isOurLpChromeButton(button) {
  return (
    !button ||
    button.id === LP_BACK_ID ||
    button.id === '__sve-lp-more' ||
    button.id === LP_RELOAD_ID ||
    button.id === LP_BLUEPRINT_ID ||
    !!button.closest?.(`#${LP_BACK_ID}`) ||
    !!button.closest?.('#__sve-lp-more') ||
    !!button.closest?.(`#${LP_RELOAD_ID}`) ||
    !!button.closest?.(`#${LP_BLUEPRINT_ID}`) ||
    !!button.closest?.(`#${HEADER_TOOLBAR_ID}`) ||
    !!button.closest?.(`#${LP_PREVIEW_CHROME_ID}`) ||
    !!button.closest?.(`#${LP_MODE_ID}`) ||
    !!button.closest?.(`#${RIGHT_DOCK_ID}`) ||
    button.hasAttribute?.('data-sve-close')
  );
}

/** True for Statamic’s Live Preview exit (×) — not Save / devices / our close. */
export function isStatamicLpCloseButton(button) {
  if (isOurLpChromeButton(button)) {
    return false;
  }

  const label = `${button.getAttribute('aria-label') || ''} ${button.title || ''} ${button.textContent || ''}`.trim();

  if (/\b(save|gem|publish|publicér|visit|besøg|pop\s*out|pop\s*ud)\b/i.test(label)) {
    return false;
  }

  if (/\b(close|luk|exit|afslut)\b/i.test(label)) {
    return true;
  }

  const text = (button.textContent || '').replace(/\s+/g, '').trim();
  const html = button.innerHTML || '';

  // Lucide / Heroicons “X” paths, or a bare × glyph.
  if (
    button.querySelector('svg') &&
    (text === '' || text === '×' || text === '✕' || text === 'x' || text === 'X') &&
    (/M18\s*6|m6\s*6\s*12\s*12|M6\s*6\s*L18|line\s+x1=["']18["']/i.test(html) ||
      text === '×' ||
      text === '✕' ||
      text === 'x' ||
      text === 'X')
  ) {
    return true;
  }

  return text === '×' || text === '✕';
}

/** Statamic’s header close (×) — kept in the DOM so leaveLivePreview can click it. */
export function findLpCloseButton(header) {
  if (!header) {
    return null;
  }

  const marked = header.querySelector('[data-sve-statamic-lp-close]');

  if (marked) {
    return marked;
  }

  const candidates = collectStatamicLpCloseButtons(header);

  return candidates[candidates.length - 1] || null;
}

export function collectStatamicLpCloseButtons(header) {
  if (!header) {
    return [];
  }

  const save = findLpSaveButton(header);
  const scope =
    header.closest('.live-preview, [data-live-preview], .live-preview-ui') || header;
  const buttons = [...scope.querySelectorAll('button')].filter((button) => !isOurLpChromeButton(button));

  return buttons.filter((button) => {
    // Prefer buttons after Save & Publish — that is where Statamic puts ×.
    if (save && header.contains(button)) {
      const afterSave = !!(save.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING);

      if (!afterSave && !isStatamicLpCloseButton(button)) {
        return false;
      }
    }

    return isStatamicLpCloseButton(button);
  });
}

export function markStatamicLpCloseHidden(close) {
  if (!close || close.id === LP_BACK_ID || isOurLpChromeButton(close)) {
    return;
  }

  close.setAttribute('data-sve-statamic-lp-close', '');
  close.classList.add('sve-off');
  close.style.setProperty('display', 'none', 'important');
  close.style.setProperty('visibility', 'hidden', 'important');
  close.style.setProperty('pointer-events', 'none', 'important');
  close.style.setProperty('width', '0', 'important');
  close.style.setProperty('min-width', '0', 'important');
  close.style.setProperty('height', '0', 'important');
  close.style.setProperty('padding', '0', 'important');
  close.style.setProperty('margin', '0', 'important');
  close.style.setProperty('margin-left', '0', 'important');
  close.style.setProperty('margin-right', '0', 'important');
  close.style.setProperty('flex', '0 0 0', 'important');
  close.style.setProperty('overflow', 'hidden', 'important');
  close.setAttribute('aria-hidden', 'true');
  close.tabIndex = -1;
}

export function hideStatamicLpClose(header) {
  if (!header) {
    return;
  }

  // Hide every match — Vue sometimes leaves a duplicate, and a single miss
  // is exactly the “× only goes away after I click a section” bug.
  collectStatamicLpCloseButtons(header).forEach(markStatamicLpCloseHidden);

  // Fallback: last icon button in the header after Save (even without a label).
  const save = findLpSaveButton(header);

  if (!save) {
    return;
  }

  [...header.querySelectorAll('button')]
    .filter((button) => !isOurLpChromeButton(button))
    .filter((button) => !!(save.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING))
    .filter((button) => {
      const text = (button.textContent || '').replace(/\s+/g, '').trim();

      return (text === '' || text === '×' || text === '✕') && button.querySelector('svg');
    })
    .forEach(markStatamicLpCloseHidden);
}

/** Keep Statamic’s × gone across Vue re-renders of the Live Preview header. */
export function watchStatamicLpClose(win) {
  const header = lpHeader(win.document);

  if (!header) {
    sveState.lpCloseHideObserver?.disconnect();
    sveState.lpCloseHideObserver = null;

    return;
  }

  hideStatamicLpClose(header);

  if (sveState.lpCloseHideObserver) {
    return;
  }

  let scheduled = false;

  sveState.lpCloseHideObserver = new win.MutationObserver(() => {
    if (scheduled) {
      return;
    }

    scheduled = true;
    win.requestAnimationFrame(() => {
      scheduled = false;
      const live = lpHeader(win.document);

      if (!live) {
        sveState.lpCloseHideObserver?.disconnect();
        sveState.lpCloseHideObserver = null;

        return;
      }

      hideStatamicLpClose(live);
    });
  });

  sveState.lpCloseHideObserver.observe(header, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'hidden'],
  });
}

/**
 * Keep the back control after Save & Publish (where × sat). No floating geometry —
 * the preview no longer needs to dodge a pill over the canvas.
 */
export function positionLpBackButton(win) {
  const doc = win.document;
  const pill = doc.getElementById(LP_BACK_ID);
  const header = lpHeader(doc);

  if (!pill || !header) {
    return;
  }

  hideStatamicLpClose(header);

  const save = findLpSaveButton(header);

  if (save && pill.previousElementSibling !== save) {
    save.after(pill);
  } else if (!save && pill.parentElement !== header) {
    header.appendChild(pill);
  }

  // Clear any leftover floating styles from older builds.
  ['position', 'top', 'right', 'bottom', 'left', 'box-shadow', 'padding'].forEach((prop) => {
    if (pill.style.getPropertyValue(prop)) {
      pill.style.removeProperty(prop);
    }
  });

  syncLpRightBarGaps(win);
  tellPreviewWherePillIs(win, pill);
}

/**
 * Hands the preview the pill's box. When the control lives in the header it does
 * not overlap the iframe — send an empty box so hover chrome stops dodging.
 */
export function tellPreviewWherePillIs(win, pill) {
  const frame = previewFrame(win.document);

  if (!frame) {
    return;
  }

  if (!pill) {
    sendToPreview(
      { source: SOURCE, type: MSG.SVE_PILL_BOX, bottom: 0, left: 99999 },
      win
    );

    return;
  }

  const f = frame.getBoundingClientRect();
  const r = pill.getBoundingClientRect();
  const overlaps =
    r.bottom > f.top && r.top < f.bottom && r.right > f.left && r.left < f.right;

  if (!overlaps) {
    sendToPreview(
      { source: SOURCE, type: MSG.SVE_PILL_BOX, bottom: 0, left: 99999 },
      win
    );

    return;
  }

  sendToPreview(
    {
      source: SOURCE,
      type: MSG.SVE_PILL_BOX,
      bottom: Math.round(r.bottom - f.top),
      left: Math.round(r.left - f.left),
    },
    win
  );
}

/** Tear down the back control (and its menu) when Live Preview closes. */
export function removeLpBackButton(doc) {
  doc.getElementById(LP_BACK_MENU_ID)?.remove();
  doc.getElementById(LP_BACK_ID)?.remove();
  doc.getElementById('__sve-lp-more-menu')?.remove();
  doc.getElementById('__sve-lp-more')?.remove();
  clearEntryBaseline();
}

/**
 * Close control in the top bar after Save & Publish. Opens a short menu:
 * back to admin, or back to the live site. Unsaved work is asked about after.
 */
export function ensureLpBackButton(win) {
  const doc = win.document;
  const header = lpHeader(doc);

  if (!header) {
    return;
  }

  hideStatamicLpClose(header);

  let pill = doc.getElementById(LP_BACK_ID);

  if (!pill) {
    pill = doc.createElement('button');
    pill.id = LP_BACK_ID;
    pill.type = 'button';
    pill.style.cssText = `${LP_ICON_BTN_STYLE}flex-shrink:0;`;

    pill.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      dismissLpMoreMenu();

      if (doc.getElementById(LP_BACK_MENU_ID)) {
        dropMenu(doc.getElementById(LP_BACK_MENU_ID));

        return;
      }

      openLpBackMenu(win, pill);
    });

    header.appendChild(pill);
  }

  // Keep icon current across builds (curved arrow → ×).
  if (pill.innerHTML !== LP_BACK_ICON_SVG) {
    pill.innerHTML = LP_BACK_ICON_SVG;
  }

  pill.title = t(win, 'close_live_preview_title');
  pill.setAttribute('aria-label', pill.title);
  pill.style.opacity = '1';
  // Last in the row. Its colour is the CP's primary (the one Publish wears),
  // set in the shell stylesheet (add-section.js, #__sve-lp-back) where the
  // idle and hover surfaces of the pills live. The header is a flex row, so
  // `order` places it without moving it in the DOM (the other pills anchor
  // to it there).
  pill.style.order = '100';
  pill.style.width = `${LP_CHROME_H}px`;
  pill.style.height = `${LP_CHROME_H}px`;
  pill.style.borderRadius = '.5rem';
  pill.style.marginLeft = '0';
  pill.style.marginRight = '0';

  positionLpBackButton(win);
  // Idempotent: no-ops once the session already has a clean snapshot.
  scheduleEntryBaseline(win);
}

/**
 * Leave Live Preview the way you entered it:
 * - Embedded → close overlay onto the entry's front-end URL.
 * - Opened from a listing → back to that listing.
 * - Otherwise → close Live Preview and stay in admin.
 */
export function leaveLivePreview(win, fallbackUrl = null) {
  if (isEmbeddedInSite(win)) {
    const visitNow = [...win.document.querySelectorAll('a')].find((a) =>
      /visit url|besøg url/i.test(a.textContent || '')
    );
    const url = visitNow?.getAttribute('href') || fallbackUrl || null;

    postToHost(win, 'lp-close', url ? { url } : {});

    return;
  }

  // Never reached the publish form on the way in, so it is not somewhere to be
  // put down on the way out: the way back is the list the entry was clicked in.
  const origin = originForCurrentEntry(win);

  if (origin) {
    forgetOrigin(win);
    leaveToOrigin(win, origin);

    return;
  }

  closeLivePreviewUi(win);
}

/**
 * Back to the screen the entry was opened from.
 *
 * By the time this runs the unsaved question has been put and answered — every
 * path into `leave()` does that first — so the only thing left in the way is
 * Statamic's own guard, which is still holding the marks it was answered about.
 */
export function leaveToOrigin(win, url) {
  const router = win.__STATAMIC__?.inertia?.router;

  dismissDirtyWarning(win);

  if (!router?.visit) {
    win.location.href = url;

    return;
  }

  router.visit(url);
}

/** Click Statamic's Live Preview × so we stay on the admin entry form. */
export function closeLivePreviewUi(win) {
  const header = lpHeader(win.document);
  const close = findLpCloseButton(header);

  // Settling on the form is an answer to "where does this end", so a later × on
  // a preview reopened by hand should not still be pointing at a listing.
  forgetOrigin(win);

  // Temporarily reveal so .click() works even while we keep × hidden in the UI.
  if (close) {
    const wasHidden = close.style.getPropertyValue('display') === 'none';

    if (wasHidden) {
      close.style.removeProperty('display');
    }

    close.click();

    if (wasHidden) {
      close.style.setProperty('display', 'none', 'important');
    }
  }
}

/** Public URL of the open entry, from Visit URL or the preview iframe. */
export function visitUrlOf(win) {
  const visit = [...win.document.querySelectorAll('a')].find((a) =>
    /visit url|besøg url/i.test(a.textContent || '')
  );
  const href = visit?.getAttribute('href');

  if (href) {
    return href;
  }

  try {
    const src = win.document.getElementById('live-preview-iframe')?.getAttribute('src');

    if (!src) {
      return null;
    }

    const url = new URL(src, win.location.origin);

    url.searchParams.delete('live-preview');
    url.searchParams.delete('preview');

    return url.pathname === '/' && !url.search ? null : url.href;
  } catch {
    return null;
  }
}

/** Overlay host is the Control Panel listing/form, not the live site. */
export function hostIsControlPanel(win) {
  try {
    return /\/cp(\/|$)/.test(win.top.location.pathname);
  } catch {
    return !isEmbeddedInSite(win);
  }
}

export function goTop(win, url) {
  try {
    win.top.location.href = url;
  } catch {
    win.location.href = url;
  }
}

/**
 * Collection listing for the open entry — never the entry publish form.
 *
 * With open-in-preview, the form is not a place anyone came from. The way
 * back to admin is the collection (or the listing that opened the overlay).
 */
export function collectionListingUrl(win) {
  const origin = originForCurrentEntry(win);

  if (origin) {
    try {
      const path = new URL(origin, win.location.origin).pathname;

      if (/\/cp(\/|$)/.test(path) && !ENTRY_EDIT_PATH.test(path)) {
        return origin;
      }
    } catch {
      /* ignore */
    }
  }

  const match = win.location.pathname.match(/\/collections\/([^/]+)\/entries\//);

  if (match) {
    return `${win.location.origin}/cp/collections/${match[1]}`;
  }

  return `${win.location.origin}/cp`;
}

/** Leave the visual editor and land on the collection listing. */
export function leaveToAdmin(win) {
  dismissDirtyWarning(win);

  // Overlay sits on the CP listing (or dashboard): just lift it.
  if (isEmbeddedInSite(win) && hostIsControlPanel(win)) {
    postToHost(win, 'lp-close');

    return;
  }

  const listing = collectionListingUrl(win);

  forgetOrigin(win);

  if (isEmbeddedInSite(win)) {
    postToHost(win, 'lp-close', listing ? { url: listing } : {});

    return;
  }

  leaveToOrigin(win, listing);
}

/** Leave the visual editor and land on the public page. */
export function leaveToFrontend(win) {
  dismissDirtyWarning(win);
  const url = visitUrlOf(win);

  if (isEmbeddedInSite(win) && !hostIsControlPanel(win)) {
    postToHost(win, 'lp-close', url ? { url } : {});

    return;
  }

  if (url) {
    goTop(win, url);

    return;
  }

  leaveToAdmin(win);
}

/** Save or discard first when the form is dirty, then run `leave`. */
export function confirmLeaveIfDirty(win, leave) {
  if (!hasUnsavedWork(win)) {
    leave();

    return;
  }

  confirmUnsaved(
    win,
    () => {
      saveGlobalsPanel(win, (ok) => {
        if (!ok) {
          return;
        }

        saveGlobalSectionPanel(win, (sectionOk) => {
          if (!sectionOk) {
            return;
          }

          if (!hasUnsavedChanges(win) || !saveButtonIn(win.document)) {
            leaveQuietly(win, leave);

            return;
          }

          saveThenNavigate(win, leave);
        });
      });
    },
    () => {
      discardChanges(win);
      discardGlobalsChanges(win);
      clearSectionsStash(win, { refresh: false });
      leave();
    }
  );
}

/**
 * Widths, pins and docks only — not the page. Does not reload, so unsaved
 * work in the form stays put.
 */
export function resetEditorLayout(win) {
  closeCodeDock(win.document);
  setCodeDockArmed(win, false);
  closeRightPanels(win);

  sveState.listViewTab = 'tree';
  sveState.headerTab = null;
  sveState.lpEnterSidebarClosed = true;
  sveState.lpCollapsed = true;
  sveState.dockedHeaderRestored = true;

  const editor = win.document.querySelector('.live-preview-editor');

  if (editor) {
    editor.style.position = 'absolute';
    editor.style.left = '-10000px';
    editor.style.top = '0';
    editor.style.width = `${remToPx(win, LP_SIDE_DEFAULT_REM)}px`;
  }

  applyLpDevice(win, 'Responsive');
  applyLpZoom(win, LP_ZOOM_DEFAULT);
  clearChromePrefs(win);
  persistLpWidth(win, remToPx(win, LP_SIDE_DEFAULT_REM));
  chromeSet(win, LP_MODE_KEY, 'hide');
  chromeSet(win, LP_COLLAPSED_KEY, '1');
  chromeSet(win, LP_DEVICE_KEY, 'Responsive');
  chromeSet(win, LP_ZOOM_KEY, String(LP_ZOOM_DEFAULT));
  chromeSet(win, 'sve-listview-tab', 'tree');

  relayoutRightDock(win);
  relayoutCodeDock(win);
  relayoutAiPanel(win);
  syncPreviewInset(win);
  applyHeaderTab(win);
  paintLpPreviewChrome(win);
  ensureLpPanelToggle(win);
}

/** Close menu: admin or the live site — Save/Publish stay on the header buttons. */
export function openLpBackMenu(win, pill) {
  const doc = win.document;

  dismissLpMoreMenu();
  dropMenu(doc.getElementById(LP_BACK_MENU_ID));
  const menu = doc.createElement('div');
  const rect = pill.getBoundingClientRect();

  menu.id = LP_BACK_MENU_ID;
  menu.style.cssText =
    `position:fixed;z-index:2147483001;top:${Math.round(rect.bottom + 8)}px;` +
    `right:${Math.round(win.innerWidth - rect.right)}px;width:max-content;` +
    'display:flex;flex-direction:column;padding:5px;border-radius:10px;' +
    'background:#343439;box-shadow:0 12px 40px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.12);' +
    'font:500 13px/1.2 ui-sans-serif,system-ui,sans-serif;';

  const item = (label, title, iconSvg, onClick) => {
    const btn = doc.createElement('button');
    const icon = doc.createElement('span');
    const text = doc.createElement('span');

    btn.type = 'button';
    btn.title = title;
    btn.style.cssText =
      'all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;gap:8px;' +
      'padding:9px 12px;border-radius:7px;white-space:nowrap;color:rgba(255,255,255,.88);';
    icon.setAttribute('aria-hidden', 'true');
    icon.style.cssText = 'display:inline-flex;flex-shrink:0;opacity:.85;';
    icon.innerHTML = iconSvg;
    text.textContent = label;
    btn.append(icon, text);
    btn.addEventListener('mouseenter', () => (btn.style.background = '#2c2c31'));
    btn.addEventListener('mouseleave', () => (btn.style.background = 'transparent'));
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      dropMenu(menu);
      onClick();
    });
    menu.appendChild(btn);
  };

  item(t(win, 'back_to_admin'), t(win, 'back_to_admin_title'), LP_BACK_ADMIN_ICON_SVG, () => {
    confirmLeaveIfDirty(win, () => leaveToAdmin(win));
  });
  item(t(win, 'back_to_site'), t(win, 'back_to_site_title'), LP_BACK_SITE_ICON_SVG, () => {
    confirmLeaveIfDirty(win, () => leaveToFrontend(win));
  });

  doc.body.appendChild(menu);
  menu.tabIndex = -1;
  menu.style.outline = 'none';

  const dismiss = () => dropMenu(menu);

  menu._sveUnbind = bindMenuDismiss(
    win,
    (target) => menu.contains(target) || pill.contains(target),
    dismiss
  );

  menu.focus();
}
