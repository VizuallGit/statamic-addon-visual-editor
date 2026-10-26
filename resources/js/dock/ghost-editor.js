/**
 * The AI in the HTML pane's editor — loaded by ghost-attach.js only once it
 * is on, so an editor with it off carries none of it: no listener, no
 * request, no key binding.
 *
 * Grey text: asked for after a pause in typing, drawn at the caret, taken
 * with Tab. On a fresh line under a comment (`{{# card: image left #}}`) the
 * comment is the question and the answer may be a whole block; "Writing …"
 * stands at the caret while it comes. One question at a time: a newer
 * keystroke drops the one waiting and aborts the one on its way, and an
 * answer for a caret that has moved is thrown away. Typing the characters
 * the grey text shows keeps the rest standing, as Copilot does.
 *
 * ⌘K: the instruction box for the selection or the caret (ghost-edit.js,
 * loaded the first time it is pressed). Statamic's own ⌘K — the command
 * palette — is held back while this editor has the focus, through
 * `Statamic.$commandPalette.preventIf`; everywhere else it opens as always.
 *
 * It keeps out of the way of the pane's own lists: nothing is asked or shown
 * while the Tailwind/Antlers list or help mode's popup is open, so Tab means
 * one thing. Tab, ⌘→, ⌘K and Escape are bound at the highest precedence but
 * answer false when they have nothing to do, so the pane behaves as it does
 * without them.
 *
 * Taking grey text is one transaction tagged `input.toolbar`, like help
 * mode's rows: ⌘Z takes it back in one step, and the lock keeps it out of a
 * locked element. What is taken is remembered (ghost-memory.js) and sent
 * along as the author's way of writing; what is shown and taken is counted.
 *
 * May import: code-dock.js re-exports, dock/*, lib/.
 * Never preview.js, overlay-host.js, bridge.js.
 */
import { cm } from '../code-dock.js';
import { dockState } from './state.js';
import { finishHtmlEdit } from './html-tools.js';
import { lockedRanges } from '../lib/locked-tags.js';
import { t } from '../lib/i18n.js';
import { advanceGhost, ghostMode, lineBefore, nextWord, shouldAsk } from './ghost-suggest.js';
import { countGhost, rememberTaken } from './ghost-memory.js';
import { ghostPost, payload } from './ghost-request.js';

/** How long typing has to pause before grey text is asked for. */
export const WAIT = 350;

/** Each editor's slot in its configuration, added once and filled or emptied as the AI goes on and off. */
const slots = new WeakMap();

/** The editors the AI is on in, with what each is waiting for. */
const states = new WeakMap();

/** The same, iterable: what the command palette hold asks about. */
const live = new Set();

/** The windows whose command palette is already told to hold back for us. */
const held = new WeakSet();

/** The field, effect and look — made once CodeMirror is loaded, shared by every editor. */
let bits = null;

/** Grey text set so far, to count a ghost as taken once however it is taken. */
let ghostIds = 0;

export function enableGhost(win, view) {
  if (!win || !view || states.has(view)) {
    return;
  }

  const state = { win, view, gen: 0, timer: 0, abort: null, fieldsFor: null, fields: null, stopped: false, told: false, editing: false, counted: 0 };

  states.set(view, state);
  live.add(state);
  holdPalette(win);
  view.dispatch({ effects: slotOf(view).reconfigure(ghostExtension(state)) });
}

export function disableGhost(view) {
  const state = states.get(view);

  if (!state) {
    return;
  }

  cancel(state);
  states.delete(view);
  live.delete(state);
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

/**
 * Statamic opens its command palette on ⌘K anywhere; in this editor ⌘K is
 * ours. Its palette asks every `preventIf` before it opens — told once per
 * window, answering for whichever of our editors has the focus or its box.
 */
function holdPalette(win) {
  if (held.has(win) || typeof win.Statamic?.$commandPalette?.preventIf !== 'function') {
    return;
  }

  held.add(win);
  win.Statamic.$commandPalette.preventIf(() => [...live].some((state) => state.win === win && (state.view.hasFocus || state.editing)));
}

/* ---- The grey text itself ------------------------------------------------- */

export function parts() {
  if (bits) {
    return bits;
  }

  const { Decoration, EditorView, WidgetType } = cm.view;
  const { StateEffect, StateField } = cm.state;

  const setGhost = StateEffect.define();

  class GhostWidget extends WidgetType {
    constructor(value) {
      super();
      this.text = value.text;
      this.pending = value.pending || '';
    }

    eq(other) {
      return other.text === this.text && other.pending === this.pending;
    }

    toDOM(view) {
      const span = view.dom.ownerDocument.createElement('span');

      span.className = this.pending ? 'cm-sve-ghost cm-sve-ghost--pending' : 'cm-sve-ghost';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = this.pending || this.text;

      return span;
    }

    ignoreEvent() {
      return true;
    }
  }

  const field = StateField.define({
    create: () => null,
    update(value, tr) {
      for (const effect of tr.effects) {
        if (effect.is(setGhost)) {
          return effect.value;
        }
      }

      if (!value) {
        return null;
      }

      if (tr.docChanged) {
        return value.pending ? null : typedThrough(value, tr);
      }

      return tr.selection && tr.state.selection.main.head !== value.at ? null : value;
    },
    provide: (self) =>
      EditorView.decorations.from(self, (value) =>
        value ? Decoration.set([Decoration.widget({ widget: new GhostWidget(value), side: 1 }).range(value.at)]) : Decoration.none
      ),
  });

  // Grey, in the pane's own font; the newlines of a suggestion of a few lines
  // kept. "Writing …" a shade fainter and slanted: it is not text to take.
  const theme = EditorView.baseTheme({
    '.cm-sve-ghost': { opacity: '0.45', whiteSpace: 'pre-wrap', pointerEvents: 'none' },
    '.cm-sve-ghost--pending': { opacity: '0.35', fontStyle: 'italic' },
  });

  bits = { setGhost, field, theme };

  return bits;
}

/**
 * The document changed under grey text: one insertion at its place that is
 * the start of it leaves the rest standing; anything else takes it away.
 */
function typedThrough(value, tr) {
  let next = null;
  let changes = 0;

  tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
    changes += 1;

    if (fromA === value.at && toA === fromA) {
      const rest = advanceGhost(value.text, inserted.toString());

      if (rest) {
        next = { ...value, text: rest, at: toB };
      }
    }
  });

  return changes === 1 ? next : null;
}

/* ---- The editor side ------------------------------------------------------ */

function ghostExtension(state) {
  const { EditorView, keymap } = cm.view;
  const { Prec } = cm.state;
  const { field, theme } = parts();

  return [
    field,
    theme,
    EditorView.updateListener.of((update) => {
      // The dock swapping the pane's text is not the author writing.
      if (dockState.applying) {
        cancel(state);

        return;
      }

      // Out of the editor: nothing waits, nothing stands — unless the focus
      // went to ⌘K's box, which has its own way out. The clear is its own
      // transaction, after this update.
      if (update.focusChanged && !update.view.hasFocus) {
        cancel(state);
        state.win.setTimeout(() => clear(update.view), 0);

        return;
      }

      if (!update.docChanged && !update.selectionSet) {
        return;
      }

      // Whatever moved, the question on its way is about a place that is gone.
      cancel(state);

      if (update.docChanged && typed(update) && !update.state.field(field, false)) {
        schedule(state);
      }
    }),
    Prec.highest(
      keymap.of([
        { key: 'Tab', run: () => accept(state, false) },
        { key: 'Mod-ArrowRight', run: () => accept(state, true) },
        { key: 'Mod-k', run: () => openEdit(state) },
        { key: 'Escape', run: () => dismiss(state) },
      ])
    ),
  ];
}

/**
 * Only the author's own writing asks: a typed character, a new line, or a
 * word taken from the pane's list (`{{ visual_` → `visual_edit`). Not the
 * dock's writes, not a toolbar button, not the grey text's own Tab.
 */
function typed(update) {
  const { Transaction } = cm.state;

  // Enter is plain `input` (insertNewlineAndIndent); `input.toolbar` — the
  // dock's buttons and our own Tab — is not counted.
  return update.transactions.some(
    (tr) => tr.isUserEvent('input.type') || tr.isUserEvent('input.complete') || tr.annotation(Transaction.userEvent) === 'input'
  );
}

function schedule(state) {
  const gen = ++state.gen;

  state.win.clearTimeout(state.timer);
  state.timer = state.win.setTimeout(() => {
    if (gen === state.gen) {
      void ask(state, gen);
    }
  }, WAIT);
}

function cancel(state) {
  state.gen += 1;
  state.win.clearTimeout(state.timer);
  state.abort?.abort();
  state.abort = null;
}

/** The pane's own lists hold the caret: the Tailwind/Antlers list or help mode's popup is open, and Tab is theirs. */
function listOpen(state) {
  return cm.autocomplete.completionStatus(state.view.state) === 'active' || !!state.win.document.querySelector('[data-sve-help-popup], [data-sve-help-loop]');
}

/** Nothing else has the caret: the editor focused, no selection, no list or box open over it. */
function quiet(state) {
  const { view } = state;

  return view.hasFocus && !state.editing && !view.state.readOnly && view.state.selection.main.empty && !listOpen(state);
}

async function ask(state, gen) {
  const { view, win } = state;

  if (state.stopped || !quiet(state)) {
    return;
  }

  const doc = view.state.doc;
  const head = view.state.selection.main.head;
  const { full, pos, body } = await payload(state, head);

  if (gen !== state.gen || view.state.doc !== doc || !shouldAsk(full, pos, lockedRanges(full))) {
    return;
  }

  const mode = ghostMode(full, pos);

  // A described block takes seconds: say so where it will stand.
  if (mode === 'comment') {
    view.dispatch({ effects: parts().setGhost.of({ text: '', at: head, pending: t(win, 'code_dock_ghost_writing') }) });
  }

  const abort = new win.AbortController();
  let answer;

  state.abort = abort;

  try {
    answer = await ghostPost(win, '', { ...body, mode }, abort.signal);
  } catch {
    // Aborted by the next keystroke, or the network: either way, no grey text.
    return;
  } finally {
    if (state.abort === abort) {
      state.abort = null;
    }
  }

  const fresh = gen === state.gen && view.state.doc === doc && view.state.selection.main.head === head;

  if (!answer.ok) {
    if (fresh) {
      clear(view);
    }

    report(state, answer.status, answer.body?.message);

    return;
  }

  const text = typeof answer.body?.text === 'string' ? answer.body.text : '';

  if (!fresh) {
    return;
  }

  if (text === '' || !quiet(state)) {
    clear(view);

    return;
  }

  ghostIds += 1;
  view.dispatch({ effects: parts().setGhost.of({ text, at: head, id: ghostIds, line: lineBefore(full, pos) }) });
  countGhost(win, 'shown');
}

/**
 * Said once per Live Preview. No key, or the AI not this user's: asking
 * again would only fail again, so this editor stops asking.
 */
export function report(state, status, message) {
  if (status === 403 || status === 422) {
    state.stopped = true;
  }

  if (state.told) {
    return;
  }

  state.told = true;
  state.win.Statamic?.$toast?.error(message || t(state.win, 'dock_ghost_error'));
}

/** Tab: all of it. ⌘→: the next word, the rest left standing. */
function accept(state, word) {
  const { view, win } = state;
  const ghost = view.state.field(parts().field, false);

  // A list opened over standing grey text (typed through): Tab is the list's.
  if (!ghost || view.state.readOnly || listOpen(state)) {
    return false;
  }

  // "Writing …": the block is on its way. Tab waits for it rather than
  // indenting the line and throwing it away; Esc is the way to stop it.
  if (ghost.pending) {
    return true;
  }

  const text = word ? nextWord(ghost.text) : ghost.text;

  view.dispatch({
    changes: { from: ghost.at, insert: text },
    selection: { anchor: ghost.at + text.length },
    userEvent: 'input.toolbar',
  });

  finishHtmlEdit();

  if (state.counted !== ghost.id) {
    state.counted = ghost.id;
    countGhost(win, 'taken');
  }

  // Taken whole: remembered as this author's way of writing, and what comes
  // next is the next question, as in Copilot.
  if (!word) {
    rememberTaken(win, ghost.line, ghost.text);
    schedule(state);
  }

  return true;
}

/** ⌘K: the box, loaded the first time. Only while nothing else holds the caret. */
function openEdit(state) {
  if (state.editing || state.view.state.readOnly || cm.autocomplete.completionStatus(state.view.state) === 'active') {
    return state.editing;
  }

  cancel(state);
  clear(state.view);
  state.editing = true;

  import('./ghost-edit.js')
    .then((edit) => edit.openEditBox(state, () => {
      state.editing = false;
    }))
    .catch(() => {
      state.editing = false;
    });

  return true;
}

function dismiss(state) {
  const had = !!state.view.state.field(parts().field, false);

  cancel(state);

  if (!had) {
    return false;
  }

  clear(state.view);

  return true;
}

function clear(view) {
  if (bits && view.state.field(bits.field, false)) {
    view.dispatch({ effects: bits.setGhost.of(null) });
  }
}
