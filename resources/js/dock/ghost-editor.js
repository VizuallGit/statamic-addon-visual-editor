/**
 * Grey text in the HTML pane's editor: asked for after a pause in typing,
 * drawn at the caret, taken with Tab — loaded by ghost-attach.js only once
 * grey text is on, so an editor with it off carries none of it: no listener,
 * no request, no key binding.
 *
 * One question at a time. A newer keystroke drops the one waiting and aborts
 * the one on its way; an answer that comes back after the caret has moved is
 * thrown away. Typing the characters the grey text shows keeps the rest of it
 * standing, as Copilot does.
 *
 * It keeps out of the way of the pane's own lists: nothing is asked or shown
 * while the Tailwind/Antlers list or help mode's popup is open, so Tab means
 * one thing. Tab, ⌘→ and Escape are bound at the highest precedence but answer
 * false while no grey text stands, so the pane behaves as it does without it.
 *
 * Taking it is one transaction tagged `input.toolbar`, like help mode's rows:
 * ⌘Z takes it back in one step, and the lock keeps it out of a locked element.
 * What is sent is the whole file around the caret, also when the pane shows a
 * slice (dockState.htmlScopeActive / htmlFocus) — as help-editor.js does.
 *
 * May import: code-dock.js re-exports, dock/*, lib/.
 * Never preview.js, overlay-host.js, bridge.js.
 */
import { cm } from '../code-dock.js';
import { dockState } from './state.js';
import { currentFullHtml } from './scope.js';
import { currentTemplateType } from './dock-api.js';
import { finishHtmlEdit } from './html-tools.js';
import { sectionDataRows } from './data-vars.js';
import { lockedRanges } from '../lib/locked-tags.js';
import { csrfToken } from '../lib/csrf.js';
import { t } from '../lib/i18n.js';
import { advanceGhost, fieldRows, ghostRequest, nextWord, shouldAsk } from './ghost-suggest.js';

/** How long typing has to pause before grey text is asked for. */
export const WAIT = 350;

const ENDPOINT = '/!/sve/dock-ghost';

/** Each editor's slot in its configuration, added once and filled or emptied as grey text goes on and off. */
const slots = new WeakMap();

/** The editors grey text is on in, with what each is waiting for. */
const states = new WeakMap();

/** The field, effect and look — made once CodeMirror is loaded, shared by every editor. */
let bits = null;

export function enableGhost(win, view) {
  if (!win || !view || states.has(view)) {
    return;
  }

  const state = { win, view, gen: 0, timer: 0, abort: null, fieldsFor: null, fields: null, stopped: false, told: false };

  states.set(view, state);
  view.dispatch({ effects: slotOf(view).reconfigure(ghostExtension(state)) });
}

export function disableGhost(view) {
  const state = states.get(view);

  if (!state) {
    return;
  }

  cancel(state);
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

/* ---- The grey text itself ------------------------------------------------- */

function parts() {
  if (bits) {
    return bits;
  }

  const { Decoration, EditorView, WidgetType } = cm.view;
  const { StateEffect, StateField } = cm.state;

  const setGhost = StateEffect.define();

  class GhostWidget extends WidgetType {
    constructor(text) {
      super();
      this.text = text;
    }

    eq(other) {
      return other.text === this.text;
    }

    toDOM(view) {
      const span = view.dom.ownerDocument.createElement('span');

      span.className = 'cm-sve-ghost';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = this.text;

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
        return typedThrough(value, tr);
      }

      return tr.selection && tr.state.selection.main.head !== value.at ? null : value;
    },
    provide: (self) =>
      EditorView.decorations.from(self, (value) =>
        value ? Decoration.set([Decoration.widget({ widget: new GhostWidget(value.text), side: 1 }).range(value.at)]) : Decoration.none
      ),
  });

  // Grey, in the pane's own font; the newlines of a suggestion of a few lines kept.
  const theme = EditorView.baseTheme({
    '.cm-sve-ghost': { opacity: '0.45', whiteSpace: 'pre-wrap', pointerEvents: 'none' },
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
        next = { text: rest, at: toB };
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

      // Out of the editor: nothing waits, nothing stands. The clear is its
      // own transaction, after this update.
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
        { key: 'Escape', run: () => dismiss(state) },
      ])
    ),
  ];
}

/**
 * Only the author's own writing asks: a typed character, or a word taken
 * from the pane's list (`{{ visual_` → `visual_edit`). Not the dock's writes,
 * not a toolbar button, not the grey text's own Tab.
 */
function typed(update) {
  return update.transactions.some((tr) => tr.isUserEvent('input.type') || tr.isUserEvent('input.complete'));
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

function paneOffset() {
  return dockState.htmlScopeActive && dockState.htmlFocus ? dockState.htmlFocus.from : 0;
}

/** Nothing else has the caret: the editor focused, no selection, no list open over it. */
function quiet(state) {
  const { view, win } = state;

  return (
    view.hasFocus &&
    !view.state.readOnly &&
    view.state.selection.main.empty &&
    cm.autocomplete.completionStatus(view.state) !== 'active' &&
    !win.document.querySelector('[data-sve-help-popup], [data-sve-help-loop]')
  );
}

/** The section's fields, asked for once per file — the Data button's rows. */
function fieldsFor(state) {
  const type = currentTemplateType() || '';

  if (state.fieldsFor !== type) {
    state.fieldsFor = type;
    state.fields = Promise.resolve()
      .then(() => sectionDataRows(state.win))
      .then(fieldRows, () => []);
  }

  return state.fields;
}

async function ask(state, gen) {
  const { view, win } = state;

  if (state.stopped || !quiet(state)) {
    return;
  }

  const doc = view.state.doc;
  const head = view.state.selection.main.head;
  const full = currentFullHtml();
  const pos = paneOffset() + head;

  if (!shouldAsk(full, pos, lockedRanges(full))) {
    return;
  }

  const fields = await fieldsFor(state);

  if (gen !== state.gen || view.state.doc !== doc) {
    return;
  }

  const abort = new win.AbortController();
  let res;
  let body;

  state.abort = abort;

  try {
    res = await win.fetch(ENDPOINT, {
      method: 'POST',
      credentials: 'same-origin',
      signal: abort.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrfToken(win),
        Accept: 'application/json',
      },
      body: JSON.stringify({ ...ghostRequest(full, pos), section: currentTemplateType() || '', fields }),
    });
    body = await res.json().catch(() => null);
  } catch {
    // Aborted by the next keystroke, or the network: either way, no grey text.
    return;
  } finally {
    if (state.abort === abort) {
      state.abort = null;
    }
  }

  if (!res.ok) {
    report(state, res.status, body?.message);

    return;
  }

  const text = typeof body?.text === 'string' ? body.text : '';

  if (text === '' || gen !== state.gen || view.state.doc !== doc || view.state.selection.main.head !== head || !quiet(state)) {
    return;
  }

  view.dispatch({ effects: parts().setGhost.of({ text, at: head }) });
}

/**
 * Said once per Live Preview. No key, or grey text not this user's: asking
 * again would only fail again, so this editor stops asking.
 */
function report(state, status, message) {
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
  const { view } = state;
  const ghost = view.state.field(parts().field, false);

  if (!ghost || view.state.readOnly) {
    return false;
  }

  const text = word ? nextWord(ghost.text) : ghost.text;

  view.dispatch({
    changes: { from: ghost.at, insert: text },
    selection: { anchor: ghost.at + text.length },
    userEvent: 'input.toolbar',
  });

  finishHtmlEdit();

  // Taken whole: what comes next is the next question, as in Copilot.
  if (!word) {
    schedule(state);
  }

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
