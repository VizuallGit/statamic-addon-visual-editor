/**
 * Help mode in the HTML pane's editor: the popup at the caret, its keys, and
 * the loop panel it opens — loaded by help-attach.js only once help is on,
 * so an editor with help off carries none of it: no listener, no fetch, no
 * key binding.
 *
 * What is offered is help-suggest.js's (pure). Its inputs come from the one
 * source each: the rows are the Data button's (sectionDataRows), the section
 * root is SectionTypeMaker's scaffold (sveSectionScaffold), the locked ranges
 * the dock's (lib/locked-tags.js). Suggestions are computed on the whole
 * file; when the pane shows a slice (dockState.htmlScopeActive / htmlFocus)
 * the slice's start is added to the caret and taken off the changes again,
 * as data-vars.js does for the Data menu.
 *
 * Taking a suggestion is one transaction tagged `input.toolbar`, like the
 * toolbar's buttons: ⌘Z takes it back in one step, and the lock keeps it out
 * of a locked element. The loop panel writes through `dock:set-html`, the
 * way the HTML tree's panel does, with loop-inspector.js's edits — the two
 * write the same tag. «Add a class» opens the pane's own class picker
 * (openAddClass, what the + does) when the user has it so (help-state.js:
 * helpOpensPicker); a click into a tag asks only when they have it so
 * (helpOnClick). Both are read when they matter, so a tick in the settings
 * holds from the next click on.
 *
 * The keys (Tab, Enter, arrows, Esc) are bound at the highest precedence but
 * answer false while no popup is open, so Tab, the Tailwind list and
 * closeBrackets behave as they do without help.
 *
 * May import: code-dock.js re-exports, dock/*, the two help surfaces,
 * cp/bus.js, lib/, loop-inspector.js, antlers-blocks.js, data-vars.js.
 * Never preview.js, overlay-host.js, bridge.js.
 */
import { createApp, h, reactive } from 'vue';
import DockHelpPopup from '../cp/surfaces/DockHelpPopup.vue';
import DockHelpLoop from '../cp/surfaces/DockHelpLoop.vue';
import { ask } from '../cp/bus.js';
import { cm } from '../code-dock.js';
import { dockState } from './state.js';
import { helpSuggestions, shiftSuggestion } from './help-suggest.js';
import { ensureHelpStyles } from './help-styles.js';
import { sectionDataRows } from './data-vars.js';
import { currentFullHtml } from './scope.js';
import { currentTemplateType } from './dock-api.js';
import { addClassButton, finishHtmlEdit, htmlElementAtCursor, openAddClass } from './html-tools.js';
import { helpOnClick, helpOpensPicker } from './help-state.js';
import { countHelpUse, helpCounts } from './help-counts.js';
import { visualEditFieldRows, visualEditPartRows } from './help-rules/visual-edit-parts.js';
import { dataVarsSet } from '../data-vars.js';
import { lockedRanges } from '../lib/locked-tags.js';
import { sectionScaffold } from '../lib/config.js';
import { t } from '../lib/i18n.js';
import { findAntlersBlocks } from '../antlers-blocks.js';
import {
  loopDepthEdit,
  loopIncludeHomeEdit,
  loopInspectModel,
  loopKindEdit,
  loopLimitEdit,
  loopNodeOf,
  loopOffsetEdit,
  loopSortDirEdit,
  loopSortFieldEdit,
  loopSourceEdit,
} from '../loop-inspector.js';

/** Each editor's slot in its configuration, added once and filled or emptied as help goes on and off. */
const slots = new WeakMap();

/** The editors help is on in, with what each has open. */
const states = new WeakMap();

/** How far from the caret the popup sits. */
const GAP = 4;
const PAD = 8;

export function enableHelp(win, view) {
  if (!win || !view || states.has(view)) {
    return;
  }

  const state = { win, view, open: null, writing: false, gen: 0, draft: '' };

  states.set(view, state);
  view.dispatch({ effects: slotOf(view).reconfigure(helpExtension(state)) });
}

export function disableHelp(view) {
  const state = states.get(view);

  if (!state) {
    return;
  }

  closePopup(state);
  states.delete(view);
  view.dispatch({ effects: slotOf(view).reconfigure([]) });
}

function slotOf(view) {
  let slot = slots.get(view);

  if (!slot) {
    slot = new cm.state.Compartment();
    slots.set(view, slot);
    view.dispatch({ effects: cm.state.StateEffect.appendConfig.of(slot.of([])) });
  }

  return slot;
}

/* ---- The editor side ------------------------------------------------------ */

function helpExtension(state) {
  const { EditorView, keymap } = cm.view;
  const { Prec } = cm.state;

  return [
    EditorView.updateListener.of((update) => {
      // The dock swapping the pane's text is not the author writing.
      if (dockState.applying) {
        if (state.open) {
          closePopup(state);
        }

        return;
      }

      if (openTagTyped(update)) {
        schedule(state);

        return;
      }

      if (state.open && !state.writing && (update.docChanged || update.selectionSet)) {
        closePopup(state);

        return;
      }

      // The list rides on the editor's focus; the loop panel has inputs of its own.
      if (update.focusChanged && !update.view.hasFocus && state.open?.kind === 'list') {
        closePopup(state);
      }
    }),
    EditorView.domEventHandlers({
      // A click into a tag asks too — unless the user has the help wait for a typed `>`.
      click: () => {
        if (helpOnClick(state.win)) {
          schedule(state);
        }

        return false;
      },
    }),
    Prec.highest(
      keymap.of([
        { key: 'Tab', run: () => acceptActive(state) },
        { key: 'Enter', run: () => acceptActive(state) },
        { key: 'ArrowDown', run: () => moveActive(state, 1) },
        { key: 'ArrowUp', run: () => moveActive(state, -1) },
        { key: 'Escape', run: () => dismiss(state) },
      ])
    ),
  ];
}

/**
 * Whether this update is the author typing the `>` of an opening tag. Only
 * typed text counts (`input.type`): a suggestion taken (`input.toolbar`) or
 * the dock's own writes end in `>` too and must not reopen the popup.
 */
function openTagTyped(update) {
  if (!update.docChanged) {
    return false;
  }

  let typedClose = false;

  for (const tr of update.transactions) {
    if (!tr.isUserEvent('input.type')) {
      continue;
    }

    tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
      if (inserted.toString().endsWith('>')) {
        typedClose = true;
      }
    });
  }

  if (!typedClose) {
    return false;
  }

  const head = update.state.selection.main.head;
  const before = update.state.sliceDoc(Math.max(0, head - 400), head);

  return /<[a-zA-Z][^<>]*>$/.test(before);
}

/** After the gesture settles: a click moves the caret and may re-scope the pane first. */
function schedule(state) {
  const gen = ++state.gen;

  state.win.setTimeout(() => {
    if (gen === state.gen) {
      void openAtCaret(state);
    }
  }, 0);
}

function paneOffset() {
  return dockState.htmlScopeActive && dockState.htmlFocus ? dockState.htmlFocus.from : 0;
}

/** Whether the dock's file is a page section's partial — the only file that wants a section root. */
function sectionPartial() {
  const type = currentTemplateType();

  return !!dataVarsSet(type) && !type.startsWith('view:') && !ask('dock:chrome-kind');
}

async function openAtCaret(state) {
  const { view, win } = state;
  const gen = state.gen;

  if (!view.hasFocus || view.state.readOnly || !view.state.selection.main.empty) {
    return;
  }

  // The Tailwind list has the spot.
  if (cm.autocomplete.completionStatus(view.state) === 'active') {
    return;
  }

  const doc = view.state.doc;
  const fields = await sectionDataRows(win);

  // Typed on, clicked elsewhere, or the pane swapped while the rows were on their way.
  if (gen !== state.gen || view.state.doc !== doc || !view.hasFocus || !view.state.selection.main.empty) {
    return;
  }

  const offset = paneOffset();
  const full = currentFullHtml();
  const head = view.state.selection.main.head;
  const items = helpSuggestions(full, offset + head, {
    fields,
    sectionPartial: sectionPartial(),
    shellRoot: sectionScaffold(win),
    locked: lockedRanges(full),
    counts: helpCounts(win),
  })
    .map((item) => shiftSuggestion(item, offset))
    // The pane holds a slice; a change reaching outside it cannot be made here.
    .filter((item) => item.changes.every((change) => change.from >= 0 && change.to <= view.state.doc.length));

  if (!items.length) {
    closePopup(state);

    return;
  }

  openList(state, items);
}

/* ---- The suggestion list -------------------------------------------------- */

function openList(state, items, title = 'code_dock_help_title') {
  const { win } = state;

  closePopup(state);

  const model = reactive({ active: 0 });
  const el = mountPopup(state, 'list', {
    render: () =>
      h(DockHelpPopup, {
        title: t(win, title),
        closeLabel: t(win, 'code_dock_help_close'),
        items: items.map((item) => ({ id: item.id, label: t(win, item.key, item.args), meta: item.meta })),
        active: model.active,
        onAccept: (index) => accept(state, index),
        onHover: (index) => {
          model.active = index;
        },
      }),
  });

  state.open.items = items;
  state.open.model = model;
  place(state, el);
}

function acceptActive(state) {
  if (state.open?.kind !== 'list') {
    return false;
  }

  accept(state, state.open.model.active);

  return true;
}

function moveActive(state, step) {
  if (state.open?.kind !== 'list') {
    return false;
  }

  const { model, items } = state.open;

  model.active = (model.active + step + items.length) % items.length;

  return true;
}

function dismiss(state) {
  if (!state.open) {
    return false;
  }

  closePopup(state);

  return true;
}

function accept(state, index) {
  const item = state.open?.items?.[index];
  const { view } = state;

  if (!item) {
    return;
  }

  closePopup(state);

  // Taken once more on this kind of tag: next time it stands higher.
  if (item.tag) {
    countHelpUse(state.win, item.tag, item.id);
  }

  // What follows a row is the rule's `after` (help-rules/context.js), never
  // its id — a new rule says what it wants without a line here.
  if (item.after === 'loop') {
    openLoop(state, item.loop.from);

    return;
  }

  // «Point at a field»: the same popup, now with the section's fields.
  if (item.after === 'visual-edit-field') {
    void openVisualEditFields(state);

    return;
  }

  if (view.state.readOnly || !item.changes.length) {
    return;
  }

  // «Add a class» as the pane's + : the dock's picker for the tag under the
  // caret — Tailwind's list or the site's class names, whichever the style
  // pane is in — with nothing written until a class is picked. Only while
  // the + is on screen to open it by; the CSS pane shut, the class is
  // written here as when the setting is off.
  if (item.after === 'class' && helpOpensPicker(state.win)) {
    const btn = addClassButton(state.win);

    if (btn) {
      openAddClass(state.win, btn);

      return;
    }
  }

  state.writing = true;

  try {
    view.dispatch({
      changes: item.changes,
      ...(item.selection == null ? {} : { selection: { anchor: item.selection } }),
      userEvent: 'input.toolbar',
    });
  } finally {
    state.writing = false;
  }

  finishHtmlEdit();

  // Between the quotes of the class just written, the site's classes are the next question.
  if (item.after === 'class') {
    cm.autocomplete.startCompletion(view);
  }

  // The visual_edit just written (or a part just added): what else it can
  // take, until Escape or nothing is left.
  if (item.after === 'visual-edit') {
    openVisualEditParts(state);
  }
}

/* ---- The visual_edit parts ------------------------------------------------ */

/**
 * The element under the caret in the pane — the one the toolbar's own
 * visual_edit button targets — as help-rules/visual-edit-parts.js wants it:
 * its opening tag's range in the pane's text. The rows come back in pane
 * coordinates, so nothing is shifted.
 */
function visualEditTarget() {
  const el = htmlElementAtCursor();

  return el?.open ? { name: el.name, from: el.open.from, to: el.open.to } : null;
}

function openVisualEditParts(state) {
  const target = visualEditTarget();
  const items = target ? visualEditPartRows(state.view.state.doc.toString(), target) : [];

  if (!items.length) {
    return;
  }

  openList(state, items, 'code_dock_help_ve_title');
}

async function openVisualEditFields(state) {
  const { view, win } = state;
  const gen = ++state.gen;
  const doc = view.state.doc;
  const fields = await sectionDataRows(win);

  if (gen !== state.gen || view.state.doc !== doc) {
    return;
  }

  const target = visualEditTarget();
  const rows = Array.isArray(fields) ? fields.filter((row) => row && typeof row.var === 'string') : [];
  const items = target ? visualEditFieldRows(doc.toString(), target, rows) : [];

  if (!items.length) {
    return;
  }

  openList(state, items, 'code_dock_help_ve_field_title');
}

/* ---- The loop panel ------------------------------------------------------- */

/** The loop block that opens at `from` in the file as it stands now, as the tree's row. */
function loopNodeAt(from) {
  return loopNodeOf(findAntlersBlocks(currentFullHtml()).find((block) => block.kind === 'loop' && block.from === from));
}

function openLoop(state, from) {
  const { win } = state;
  const node = loopNodeAt(from);

  if (!node) {
    return;
  }

  state.draft = '';

  const model = reactive({
    inspect: loopInspectModel(win, node),
    canEdit: !state.view.state.readOnly && ask('dock:is-locked') !== true,
  });

  const refresh = () => {
    const now = loopNodeAt(from);

    if (!now) {
      closePopup(state);

      return;
    }

    model.inspect = loopInspectModel(win, now, { draft: state.draft });
  };

  const write = (edit) => {
    if (!edit || state.open?.kind !== 'loop') {
      return;
    }

    const full = currentFullHtml();
    const now = loopNodeAt(from);
    const next = now ? edit(full, now) : full;

    if (next !== full) {
      state.writing = true;

      try {
        ask('dock:set-html', next);
      } finally {
        state.writing = false;
      }
    }

    refresh();
  };

  const on = {
    kind: (id) => write(loopKindEdit(win, loopNodeAt(from), id)),
    commit: (value) => write(loopSourceEdit(loopNodeAt(from), value)),
    sortDir: (value) => {
      const next = loopSortDirEdit(loopNodeAt(from), value);

      if (next.draft) {
        state.draft = next.draft;
        refresh();

        return;
      }

      state.draft = '';
      write(next.edit);
    },
    sortField: (value) => {
      const draft = state.draft;

      state.draft = '';
      write(loopSortFieldEdit(loopNodeAt(from), value, draft));
    },
    limit: (value) => write(loopLimitEdit(value)),
    offset: (value) => write(loopOffsetEdit(value)),
    depth: (value) => write(loopDepthEdit(value)),
    includeHome: (value) => write(loopIncludeHomeEdit(value)),
    // The loop's handle is written in the scope around it, so the picker is
    // asked from the row's own start — the same as the tree's loop panel.
    pickData: (anchor, use) =>
      ask('dock:data-menu', {
        anchor,
        at: from,
        onPick: (row) => use(String(row?.var || '').trim()),
      }),
  };

  const el = mountPopup(state, 'loop', {
    render: () =>
      h(DockHelpLoop, {
        inspect: model.inspect,
        canEdit: model.canEdit,
        dataTitle: t(win, 'data_vars_title'),
        closeLabel: t(win, 'code_dock_help_close'),
        on,
      }),
  });

  place(state, el);
}

/* ---- The popup element ---------------------------------------------------- */

/**
 * The popup on the document's body (`position: fixed`, so a Replicator's
 * stacking context cannot clip it), following the caret on scroll and
 * resize, closed by a pointer down outside it or Escape.
 */
function mountPopup(state, kind, component) {
  const { win } = state;
  const doc = win.document;

  ensureHelpStyles(doc);

  const host = doc.createElement('div');

  doc.body.appendChild(host);

  const app = createApp(component);

  app.mount(host);

  // The component's root is the fixed element the styles place; the host is
  // only where Vue was told to render.
  const el = host.firstElementChild || host;
  const reposition = () => place(state, el);
  const onDown = (event) => {
    if (el.contains(event.target) || event.target.closest?.('[data-sve-data-menu]')) {
      return;
    }

    // What was typed in a box is committed on blur, as in the tree's panel;
    // the element goes away with the popup, so the blur is made to happen.
    if (el.contains(doc.activeElement)) {
      doc.activeElement.blur();
    }

    closePopup(state);
  };
  const onKey = (event) => {
    if (event.key === 'Escape' && el.contains(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      closePopup(state);
      state.view.focus();
    }
  };

  doc.addEventListener('pointerdown', onDown, true);
  doc.addEventListener('keydown', onKey, true);
  win.addEventListener('scroll', reposition, true);
  win.addEventListener('resize', reposition);

  state.open = {
    kind,
    el,
    host,
    app,
    unhook: () => {
      doc.removeEventListener('pointerdown', onDown, true);
      doc.removeEventListener('keydown', onKey, true);
      win.removeEventListener('scroll', reposition, true);
      win.removeEventListener('resize', reposition);
    },
  };

  return el;
}

/** Under the caret's line; above it when there is no room below. */
function place(state, el) {
  const { view, win } = state;
  const coords = view.coordsAtPos(view.state.selection.main.head);

  if (!coords) {
    return;
  }

  const width = el.offsetWidth;
  const height = el.offsetHeight;
  const left = Math.max(PAD, Math.min(coords.left, win.innerWidth - width - PAD));
  let top = coords.bottom + GAP;

  if (top + height > win.innerHeight - PAD && coords.top - height - GAP >= PAD) {
    top = coords.top - height - GAP;
  }

  el.style.left = `${left}px`;
  el.style.top = `${Math.max(PAD, top)}px`;
}

function closePopup(state) {
  const open = state.open;

  if (!open) {
    return;
  }

  state.open = null;
  open.unhook();
  open.app.unmount();
  open.host.remove();
}
