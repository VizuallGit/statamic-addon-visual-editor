/**
 * Settings toggle: `inline_edit`
 * Click text in the preview and type into it.
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { ACTIVE_ATTR, COLLAPSE_SETTLE_MS, SELECTORS } from './cp-selectors.js';
import {
  BP_INHERITS,
  collectAncestorSets,
  currentBp,
  ensureLpBackButton,
  expandSet,
  findBardVueProxy,
  findFieldElement,
  findSetByUid,
  handleFieldFocus,
  rowIsLocked,
  sendToPreview,
  switchToContainingTab,
} from './cp.js';
import { dataGet, deepestFieldPath, findPathByUid, unwrapRef } from './lib/values.js';
import { activeContainers } from './lib/publish-containers.js';
import { setLpCollapsed } from './lp-panel.js';
import { rowLocation, sortableItemForUid } from './section-library.js';
import { flushPendingSectionRefresh } from './global-section.js';
import { MSG, SOURCE } from './lib/protocol.js';
import { scrollBehavior } from './scroll-pref.js';
import {
  bardNodeText,
  controlValues,
  isUnwrappedInlineBard,
  normText,
  normalizeInlineBardValue,
} from './inline-edit/bard-value.js';
import { queueEditUntilPanelReady, resolveEditTargets } from './inline-edit/request.js';
import {
  BARD_CMD_TITLE,
  clickBardToolbarButton,
  domRangeForOffsets,
  repositionBardPopup,
  revealBardLinkStack,
} from './inline-edit/bard.js';
import { openIconifyFromField, writeIconField } from './inline-edit/fields.js';
import { openColumnTypePicker, placementOf, samePlacement } from './inline-edit/layout.js';

export * from './inline-edit/baseline.js';
export * from './inline-edit/bard-value.js';
export * from './inline-edit/request.js';
export * from './inline-edit/input.js';
export * from './inline-edit/bard.js';
export * from './inline-edit/fields.js';
export * from './inline-edit/layout.js';
export * from './library/save-section.js';

// ===== inline-edit =====
// --- Inline editing: write-back ---------------------------------------------
//
// The preview iframe sends edit-request / edit-input / edit-end messages
// (see bridge.js). This side resolves the clicked field to a dotted value
// path in the publish form, verifies the rendered text actually matches the
// stored value (so modifier-transformed output can never be written back as
// the wrong value), and writes edits via the container's setFieldValue().
// Statamic's own reactivity does the rest: the deep values watcher marks the
// form dirty and triggers the live preview re-render, and the Bard fieldtype's
// value watcher updates its editor when the value changes from outside.

/** Node types the inline editor may edit as a single contenteditable block. */
export const EDITABLE_NODE_TYPES = ['heading', 'paragraph'];

// The active inline-edit session, keyed by the bridge's requestId.
export let editSession = null;

/**
 * Push a Bard value into the mounted TipTap editor in the sidebar.
 *
 * Colour/mark writes sometimes leave TipTap stale after setFieldValue alone.
 * Typing must NOT hammer setContent — Vue already updates the editor, and
 * repeated setContent/blur is what made the sidebar flicker 4–5 times.
 *
 * Coalesce: only the latest pending value is applied, once, after a short wait
 * so Vue can catch up first. If TipTap already matches, we no-op.
 */
let bardSyncTimer = null;
let bardSyncPending = null;

export function syncBardEditorFromValue(doc, field, scope, value) {
  if (!doc || !field || !Array.isArray(value)) {
    return;
  }

  bardSyncPending = { doc, field, scope, value: JSON.parse(JSON.stringify(value)) };
  clearTimeout(bardSyncTimer);
  // Wait for Vue's setFieldValue → Bard watcher to settle. If TipTap already
  // matches then, we skip setContent entirely (typing: no flicker). Colour
  // marks that the watcher missed still get one corrective write.
  bardSyncTimer = setTimeout(flushBardEditorSync, 100);
}

function flushBardEditorSync(attempt = 0) {
  const job = bardSyncPending;

  if (!job) {
    return;
  }

  const { doc, field, scope, value } = job;
  const fieldEl = findFieldElement(field, doc, scope);
  const bardEl = fieldEl
    ? fieldEl.closest('.bard-fieldtype') || fieldEl.querySelector('.bard-fieldtype') || fieldEl
    : null;
  const proxy = bardEl ? findBardVueProxy(bardEl) : null;

  if (!proxy?.editor) {
    // Editor not mounted yet (replicator tab, etc.) — one short retry, not a storm.
    if (attempt < 5) {
      bardSyncTimer = setTimeout(() => flushBardEditorSync(attempt + 1), 50);
    }

    return;
  }

  let currentContent = null;

  try {
    currentContent = proxy.editor.getJSON()?.content ?? null;
  } catch {
    currentContent = null;
  }

  // Vue already applied setFieldValue — leave TipTap alone (avoids flicker).
  if (JSON.stringify(value) === JSON.stringify(currentContent)) {
    bardSyncPending = null;

    return;
  }

  try {
    if ('debounceNextUpdate' in proxy) {
      proxy.debounceNextUpdate = false;
    }

    if (proxy.editor?.commands?.setContent) {
      const content = value.length ? { type: 'doc', content: JSON.parse(JSON.stringify(value)) } : null;

      proxy.editor.commands.setContent(content, false);
    }

    if ('json' in proxy) {
      proxy.json = JSON.parse(JSON.stringify(value));
    }
  } catch {
    /* ignore */
  }

  bardSyncPending = null;
}

export function handleEditRequest(data, doc, win) {
  const reply = (message) => sendToPreview({ source: SOURCE, requestId: data.requestId, ...message }, win);

  const req = {
    blockText: data.blockText != null ? normText(data.blockText) : null,
    wrapperText: normText(data.wrapperText || ''),
  };

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let basePath = '';

    if (data.scope) {
      basePath = findPathByUid(values, data.scope);

      if (basePath === null) {
        continue; // scope lives in another container
      }
    }

    let path = [basePath, data.field].filter(Boolean).join('.');
    let value = dataGet(values, path);

    // Scope cascaded to a parent row (common on synced sections whose nested
    // block ids were stripped): find the deepest row under basePath that owns
    // this field handle and use that path instead.
    if (value === undefined && data.field && basePath !== null && basePath !== '') {
      const deepPath = deepestFieldPath(dataGet(values, basePath), data.field, basePath);

      if (deepPath) {
        path = deepPath;
        value = dataGet(values, path);
      }
    }

    if (value === undefined) {
      // A new row often has no key yet (`title` missing, not `title: ''`).
      // Treat that as empty so inline edit can start, instead of denying.
      if (basePath && data.field) {
        const row = dataGet(values, basePath);

        if (row && typeof row === 'object' && !Array.isArray(row)) {
          value = data.fieldtype === 'bard' ? [] : '';
        }
      }

      if (value === undefined) {
        continue;
      }
    }

    // Inline Bard (headline): upgrade legacy strings / unwrapped text nodes to
    // a single paragraph so whole-field edit + colour toolbar work like richtext.
    if (
      data.bardInline &&
      (typeof value === 'string' || isUnwrappedInlineBard(value)) &&
      normText(typeof value === 'string' ? value : bardNodeText({ type: 'doc', content: value })) === req.wrapperText
    ) {
      value = normalizeInlineBardValue(value);
      container.setFieldValue(path, value);
    }

    // Empty Bard: nothing stored yet. `as="h3"` / the wrapper tag says what
    // the first block should be, so a title can start as a heading rather than
    // a paragraph — the same choice BlockStudio's RichText/InnerBlocks make.
    //
    // Bard rarely stores a truly empty array: clearing a field usually leaves
    // one empty paragraph behind. There is still nothing to edit, but a length
    // check lets it through to whole-field editing, which sends the node's text
    // ('') for the preview to match against its children. With placeholder text
    // rendered in the wrapper nothing lines up, startEditing aborts, and the
    // click does nothing at all — no toolbar, no caret.
    const emptyBard =
      data.fieldtype === 'bard' &&
      (value === '' ||
        value == null ||
        (Array.isArray(value) &&
          (value.length === 0 ||
            value.every(
              (node) => node && EDITABLE_NODE_TYPES.includes(node.type) && normText(bardNodeText(node)) === ''
            ))));

    if (emptyBard) {
      editSession = {
        container,
        requestId: data.requestId,
        mode: 'bard-field',
        path,
        field: data.field,
        scope: data.scope,
        original: [],
      };
      reply({
        type: 'edit-start',
        mode: 'bard-field',
        target: 'wrapper',
        controls: controlValues(values, path, data.controls),
        nodes: [],
      });

      return;
    }

    // Empty text (or any non-Bard scalar): start a string edit even when the
    // preview has only ghost placeholder text, so wrapperText is '' and would
    // otherwise fail the "rendered text matches stored value" check.
    if (data.fieldtype !== 'bard' && (value === '' || value == null) && !Array.isArray(value)) {
      editSession = {
        container,
        requestId: data.requestId,
        mode: 'string',
        path,
        field: data.field,
        scope: data.scope,
        original: '',
      };
      reply({
        type: 'edit-start',
        mode: 'string',
        target: 'wrapper',
        hasLink: false,
        controls: controlValues(values, path, data.controls),
      });

      return;
    }

    // Whole-field Bard editing: one toolbar for the entire field, caret moves
    // freely between blocks, Enter splits blocks. Allowed when every node is
    // either an editable text block (heading/paragraph) or a Bard set — sets
    // render as locked siblings in the preview and are preserved on save.
    // Other node types (lists, images, …) still fall back to per-block editing.
    if (
      Array.isArray(value) &&
      value.length &&
      value.every((node) => node && (EDITABLE_NODE_TYPES.includes(node.type) || node.type === 'set')) &&
      value.some((node) => EDITABLE_NODE_TYPES.includes(node.type))
    ) {
      editSession = {
        container,
        requestId: data.requestId,
        mode: 'bard-field',
        path,
        field: data.field,
        scope: data.scope,
        original: JSON.parse(JSON.stringify(value)),
      };
      reply({
        type: 'edit-start',
        mode: 'bard-field',
        target: 'wrapper',
        controls: controlValues(values, path, data.controls),
        // Only text nodes — sets map onto locked DOM siblings automatically.
        nodes: value
          .filter((node) => EDITABLE_NODE_TYPES.includes(node.type))
          .map((node) => ({
            type: node.type,
            level: node.attrs?.level ?? null,
            className: node.attrs?.class ?? null,
            text: normText(bardNodeText(node)),
          })),
      });

      return;
    }

    // Fast path: Bard field where the clicked block's index maps directly to
    // the ProseMirror node AND the rendered text matches the stored one.
    if (Array.isArray(value) && data.blockIndex != null && req.blockText !== null) {
      const node = value[data.blockIndex];

      if (node && EDITABLE_NODE_TYPES.includes(node.type) && normText(bardNodeText(node)) === req.blockText) {
        editSession = {
          container,
          requestId: data.requestId,
          mode: 'bard',
          path,
          index: data.blockIndex,
          field: data.field,
          scope: data.scope,
          original: JSON.parse(JSON.stringify(value)),
        };
        reply({
          type: 'edit-start',
          mode: 'bard',
          target: 'block',
          controls: controlValues(values, path, data.controls),
        });

        return;
      }
    }

    const candidates = resolveEditTargets(value, path, req);

    if (candidates.length !== 1) {
      reply({ type: 'edit-deny', reason: candidates.length ? 'ambiguous' : 'no-match' });

      return;
    }

    const target = candidates[0];

    if (target.mode === 'string') {
      // Rows that pair a text with a link (button rows: { text, url }) get a
      // link-edit shortcut in the preview toolbar.
      const rowPath = target.path.includes('.') ? target.path.slice(0, target.path.lastIndexOf('.')) : '';
      const row = rowPath ? dataGet(values, rowPath) : null;
      const linkPath = row && typeof row === 'object' && typeof row.url === 'string' ? `${rowPath}.url` : null;

      editSession = {
        container,
        requestId: data.requestId,
        mode: 'string',
        path: target.path,
        linkPath,
        field: data.field,
        scope: data.scope,
        original: dataGet(values, target.path),
      };
      reply({
        type: 'edit-start',
        mode: 'string',
        target: target.path === path ? 'wrapper' : 'block',
        hasLink: !!linkPath,
        controls: controlValues(values, target.path, data.controls),
      });
    } else {
      editSession = {
        container,
        requestId: data.requestId,
        mode: 'bard',
        path: target.path,
        index: target.index,
        field: data.field,
        scope: data.scope,
        original: JSON.parse(JSON.stringify(dataGet(values, target.path))),
      };
      reply({
        type: 'edit-start',
        mode: 'bard',
        target: 'block',
        controls: controlValues(values, target.path, data.controls),
      });
    }

    return;
  }

  // Panel is open but hasn't streamed values yet — keep the preview's pending
  // edit alive and retry as soon as the form hydrates.
  if (queueEditUntilPanelReady(data, doc, win)) {
    reply({ type: 'edit-pending' });

    return;
  }

  reply({ type: 'edit-deny', reason: 'not-found' });
}

let themeSwatchesPromise = null;

/**
 * Preview asked for theme colour swatches (highlight colour control). Fetch from
 * the colour-scheme CP route and reply — cached for the CP page lifetime.
 */
export function handleThemeSwatchesRequest(data, win) {
  const reply = (swatches) =>
    sendToPreview(
      {
        source: SOURCE,
        type: MSG.THEME_SWATCHES,
        requestId: data.requestId,
        swatches,
      },
      win
    );

  if (!themeSwatchesPromise) {
    const cpUrl = win.Statamic?.$config?.get?.('cpUrl') || `/${win.Statamic?.$config?.get?.('cpRoute') || 'cp'}`;

    themeSwatchesPromise = win
      .fetch(`${cpUrl}/color-scheme/swatches`, {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then(async (res) => {
        if (!res.ok) {
          return [];
        }

        const json = await res.json().catch(() => []);

        return Array.isArray(json) ? json : [];
      })
      .catch(() => []);
  }

  themeSwatchesPromise.then(reply);
}

export function handleEditEnd(data, win = window) {
  if (!editSession || editSession.requestId !== data.requestId) {
    return;
  }

  if (data.cancelled) {
    editSession.container.setFieldValue(editSession.path, editSession.original);
  }

  editSession = null;

  // A global section's stash may have been written several times while this
  // edit was open, with the re-render held back each time so the caret survived.
  // Now that the page is nobody's text field again, let it catch up.
  flushPendingSectionRefresh(win);
}

/**
 * Link/colour/list/quote from the preview toolbar: open the editor panel,
 * select the same character range in the real CP Bard editor, and click its
 * native toolbar button — so Statamic's own popup (link dialog, colour palette)
 * appears, exactly as the user knows it from the panel. Runs after the inline
 * edit has committed; captures field/scope/index synchronously because the CP
 * edit session is torn down by the accompanying edit-end.
 */
export function handleBardCommand(data, doc, win) {
  if (!editSession || editSession.requestId !== data.requestId) {
    return;
  }

  const titleRe = BARD_CMD_TITLE[data.command];

  if (!titleRe) {
    return;
  }

  const { field, scope } = editSession;
  // Whole-field sessions carry the selection's block index in the message; the
  // per-block session stored it at edit-start.
  const index = Number.isInteger(data.blockIndex) ? data.blockIndex : editSession.index;
  // link/colour open a Statamic popup; the rest (lists, quote, …) apply in place.
  const opensPopup = data.command === 'link' || data.command === 'color';

  // Link: open Bard's own Stack (same as the sidebar). Colour still moves
  // its palette over the preview.

  let attempts = 0;

  const run = () => {
    const setEl = scope ? findSetByUid(scope, doc) : null;

    if (setEl) {
      [...collectAncestorSets(setEl), setEl].forEach(expandSet);
    }

    const fieldEl = findFieldElement(field, doc, scope);
    // The field id sits on the content wrapper; the toolbar lives on the
    // enclosing .bard-fieldtype. Search from there for both toolbar and editor.
    const bardEl = fieldEl?.closest('.bard-fieldtype') || fieldEl?.querySelector('.bard-fieldtype') || fieldEl;
    const ce = bardEl?.querySelector('.ProseMirror') || bardEl?.querySelector('[contenteditable="true"]');

    if (!ce) {
      if (++attempts < 12) {
        setTimeout(run, 250);
      }

      return;
    }

    const block = ce.children[index];

    if (block && data.to > data.from) {
      const range = domRangeForOffsets(block, data.from, data.to);

      if (range) {
        ce.focus();
        const sel = win.getSelection();

        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else {
      ce.focus();
    }

    // Let ProseMirror sync the DOM selection into its state before the button
    // command reads editor.state.selection.
    setTimeout(() => {
      const opened =
        data.command === 'link' ? openBardLinkToolbar(bardEl) : clickBardToolbarButton(bardEl, titleRe, doc);

      if (!opened && ++attempts < 12) {
        setTimeout(run, 250);

        return;
      }

      if (data.command === 'link') {
        revealBardLinkStack(doc, win);
      } else if (opensPopup) {
        repositionBardPopup(data.command, data.anchorRect, doc, win);
      }
    }, 70);
  };

  setTimeout(run, 120);
}

/**
 * Opens Bard's own Link Stack — the same `open-link-toolbar` event as Mod-K
 * / the sidebar button. Search stays inside this Bard field so we never
 * click some other "Link" button on the page.
 */
function openBardLinkToolbar(bardEl) {
  if (!bardEl) {
    return false;
  }

  const bus = findBardVueProxy(bardEl)?.events;

  if (typeof bus?.emit === 'function') {
    bus.emit('open-link-toolbar');

    return true;
  }

  if (typeof bus?.$emit === 'function') {
    bus.$emit('open-link-toolbar');

    return true;
  }

  return clickBardToolbarButton(bardEl, BARD_CMD_TITLE.link, bardEl);
}

/**
 * Toolbar tools the preview can't perform in place (lists, quote, color) send
 * this: open the editor panel and focus the Bard field so the user finishes
 * with the field's real toolbar. Runs after the inline edit has committed.
 */
export function handleOpenPanelField(data, doc, win) {
  if (!editSession || editSession.requestId !== data.requestId || !editSession.field) {
    return;
  }

  const { field, scope } = editSession;

  setLpCollapsed(win, false);
  setTimeout(() => handleFieldFocus(field, doc, { scopeUid: scope }), 100);
}

/**
 * Opens the asset browser for the clicked image field: locates the CP field
 * wrapper (retrying while the containing set expands — the accompanying click
 * message triggers that expansion) and clicks its Browse button. Statamic's
 * asset selector portals to the body, so it shows even while the editor panel
 * is collapsed off-screen.
 */
export function handleAssetEdit(data, doc) {
  let attempts = 0;

  const tryOpen = () => {
    const setEl = data.scope ? findSetByUid(data.scope, doc) : null;

    // Collapsed sets don't render their field wrappers — expand the scoped set
    // (and its ancestors) so the assets field mounts, then retry below.
    if (setEl) {
      [...collectAncestorSets(setEl), setEl].forEach(expandSet);
    }

    // Assets fields don't always render a field_{path} wrapper id (observed in
    // replicator sets) — fall back to the fieldtype root inside the scoped set.
    const fieldEl =
      findFieldElement(data.field, doc, data.scope) ||
      (setEl ? setEl.querySelector('.assets-fieldtype') : null) ||
      (data.scope ? null : doc.querySelector('.assets-fieldtype'));

    const browse = fieldEl
      ? [...fieldEl.querySelectorAll('button, [role="button"]')].find((b) => /browse|gennemse/i.test(b.textContent))
      : null;

    if (browse) {
      browse.click();

      return;
    }

    if (++attempts < 8) {
      setTimeout(tryOpen, 250);
    }
  };

  tryOpen();
}

/**
 * Opens Iconify's own Stack ("Search and select an icon") from preview
 * Change/Browse — the same panel as the sidebar. Raise it above the live
 * preview so it is not hidden behind the iframe.
 */
export function handleIconEdit(data, doc, win = window) {
  if (data.action === 'remove') {
    writeIconField(data, doc, null);

    return;
  }

  let attempts = 0;

  const tryOpen = () => {
    const setEl = data.scope ? findSetByUid(data.scope, doc) : null;

    if (setEl) {
      [...collectAncestorSets(setEl), setEl].forEach(expandSet);
    }

    const fieldEl =
      findFieldElement(data.field, doc, data.scope) ||
      (setEl ? setEl.querySelector('.iconify-fieldtype') : null) ||
      (data.scope ? null : doc.querySelector('.iconify-fieldtype'));

    if (openIconifyFromField(fieldEl, doc)) {
      return;
    }

    if (attempts === 2) {
      setLpCollapsed(win, false);
      handleFieldFocus(data.field, doc, { animate: false, scopeUid: data.scope });
    }

    if (++attempts < 12) {
      setTimeout(tryOpen, 180);
    }
  };

  tryOpen();
}

/**
 * Link-edit shortcut from the preview toolbar: opens the editor panel and
 * focuses the row's url/link field so the user can change the URL or pick
 * another entry with Statamic's own link fieldtype UI.
 */
export function handleLinkEdit(data, doc, win) {
  if (!editSession || editSession.requestId !== data.requestId || !editSession.linkPath) {
    return;
  }

  const { linkPath, scope } = editSession;

  setLpCollapsed(win, false);

  setTimeout(() => {
    // Preferred: the url field's own wrapper (stacked grids render one).
    let target = findFieldElement(linkPath, doc);

    // Table-mode grid cells carry no field wrapper id — locate the row via its
    // _visual_id and use the link fieldtype cell (or the row itself).
    if (!target && scope) {
      const rowEl = findSetByUid(scope, doc);

      if (rowEl) {
        target = rowEl.querySelector('.link-fieldtype') || rowEl;
      }
    }

    if (!target) {
      return;
    }

    doc.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((el) => el.removeAttribute(ACTIVE_ATTR));
    target.setAttribute(ACTIVE_ATTR, '');
    switchToContainingTab(target, doc);
    collectAncestorSets(target).forEach(expandSet);

    setTimeout(() => {
      target.scrollIntoView({ behavior: scrollBehavior(), block: 'center' });
      target.classList.add('sve-field-highlight');
      setTimeout(() => target.classList.remove('sve-field-highlight'), 2000);
    }, COLLAPSE_SETTLE_MS);
  }, 100);
}

/**
 * Moves the set identified by uid one position up/down within its containing
 * array (page sections, replicator rows, …). Works generically: the uid is
 * resolved to a value path like "page_sections.2", and the two array items are
 * swapped via setFieldValue — dirty state, replicator re-render and the live
 * preview update all follow from Statamic's own reactivity.
 */
/**
 * Reorders the array item carrying data.uid. Two callers: the hover arrows send
 * a relative `direction` (±1); drag & drop sends an absolute `toIndex`.
 */
export function handleMove(data, doc) {
  if (rowIsLocked(data.uid, doc)) {
    return;
  }

  const direction = data.direction < 0 ? -1 : 1;

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows: arr } = found;

    const to = Number.isInteger(data.toIndex) ? Math.max(0, Math.min(arr.length - 1, data.toIndex)) : index + direction;

    if (to === index || to < 0 || to >= arr.length) {
      return; // no movement (or already first/last)
    }

    const next = JSON.parse(JSON.stringify(arr));
    const [item] = next.splice(index, 1);

    next.splice(to, 0, item);
    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * The effective placement a breakpoint inherits, following the cascade up.
 *
 * Desktop-first, like the rest of the responsive work: a drawer that says
 * nothing says "the same as the one above". Null when nobody above said
 * anything either.
 */
function inheritedPlacement(drawers, bp, field) {
  for (const key of BP_INHERITS[bp] ?? []) {
    const placement = placementOf(drawers?.[key]?.[field]);

    if (placement !== null) {
      return placement;
    }
  }

  return null;
}

/**
 * A width dragged in the preview, written to the row it belongs to.
 *
 * Which breakpoint it lands in is decided here and not in the preview, because
 * `currentBp` is the same answer the responsive fields give — one place to be
 * right about what "the screen size I am editing" means.
 *
 * Two shapes are accepted, told apart by what is already stored: a plain number
 * on the row, or the responsive wrapper's drawer per breakpoint (where the inner
 * field carries the same handle as the wrapper). In the second, a value equal to
 * what the breakpoint would have inherited anyway is written as empty — dragging
 * tablet back into step with laptop drops the override again, instead of
 * freezing today's laptop value into it forever.
 *
 * A change may also carry `start`: the column the block now begins in, sent only
 * by a leading-edge drag where the container allows blocks to overlap. Without
 * it the block keeps the start it had, and a block that never had one keeps
 * flowing — the width alone is written, as a plain number, exactly as before.
 */
export function handleGridSpan(data, doc, win) {
  const field = typeof data.field === 'string' && data.field ? data.field : 'span';
  const bp = currentBp(win);

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let applied = false;

    for (const change of data.changes ?? []) {
      const span = Number(change?.span);

      if (!Number.isFinite(span) || span < 1) {
        continue;
      }

      const path = findPathByUid(values, change.uid);

      if (path === null) {
        continue;
      }

      const current = dataGet(values, `${path}.${field}`);
      const responsive =
        current &&
        typeof current === 'object' &&
        !Array.isArray(current) &&
        Object.keys(BP_INHERITS).some((key) => key in current);

      const start = Number(change?.start);
      const path_ = responsive ? `${path}.${field}.${bp}.${field}` : `${path}.${field}`;

      // A drag that was only about width says nothing about where the block
      // begins, so whatever it began with stands. Only a leading-edge drag in a
      // container that allows overlap sends a start at all — and it is the one
      // gesture that is actually about moving the block.
      const stored = placementOf(dataGet(values, path_));
      const next = {
        span,
        start: Number.isFinite(start) && start > 0 ? start : (stored?.start ?? null),
      };

      // Written back the way it came in: a width with no start is a plain
      // number, which is what every value written before starting columns
      // existed still looks like.
      const value = next.start === null ? next.span : { ...next };

      if (responsive) {
        const inherited = inheritedPlacement(current, bp, field);

        // A drawer left empty means "the same as the one above", so a value that
        // matches what would have been inherited is written as empty instead —
        // dragging tablet back into step with laptop drops the override again,
        // rather than freezing today's laptop value into it forever. What would
        // be inherited includes the start, which is why it is compared here and
        // not left to the caller.
        const effective = { span: next.span, start: next.start ?? inherited?.start ?? null };

        container.setFieldValue(path_, samePlacement(inherited, effective) ? null : value);
      } else {
        container.setFieldValue(path_, value);
      }

      applied = true;
    }

    if (applied) {
      return;
    }
  }
}

/**
 * "+" on a columns section in the preview: append a column to the section's
 * columns array — mirroring the column builder's own addColumn() defaults —
 * and open the new card's edit popup so type and fields can be picked.
 *
 * Written through setFieldValue rather than by clicking the builder's own
 * "Add column" button: programmatic clicks reach the builder's edit buttons
 * fine (the popup flow below), but its add button doesn't respond to them.
 */
export function handleAddColumn(data, doc, win) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const sectionPath = findPathByUid(values, data.uid);

    if (sectionPath === null) {
      continue;
    }

    const columns = dataGet(values, `${sectionPath}.columns`);

    if (!Array.isArray(columns)) {
      continue;
    }

    // Same id format and defaults as the builder's addColumn().
    const newId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const count = columns.length + 1;
    const newItem = {
      _id: newId,
      type: null,
      enabled: true,
      col_w_m: 'col-span-12',
      col_w_t: 'md:col-span-6',
      col_w_d: 'lg:col-span-4',
      order_m: count,
      order_t: count,
      order_d: count,
    };

    container.setFieldValue(`${sectionPath}.columns`, [...JSON.parse(JSON.stringify(columns)), newItem]);

    // The card only mounts (and the builder's picker machinery only measures
    // real rects) in an expanded set — nudge once; Vue applies it asynchronously.
    const setEl = findSetByUid(data.uid, doc) ?? sortableItemForUid(data.uid, doc);

    if (setEl) {
      [...collectAncestorSets(setEl), setEl].forEach(expandSet);
    }

    openColumnTypePicker(newId, doc, win);

    return;
  }
}
