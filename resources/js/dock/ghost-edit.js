/**
 * ⌘K in the HTML pane: say in your own words what should change, and the
 * selection is rewritten — or, with nothing selected, written at the caret.
 * Cursor's inline edit, for the section's own markup.
 *
 * The box sits on the Control Panel's body (the dock's panes clip and stack
 * what is inside them), under the selection's first line, and follows it on
 * scroll. Three moments:
 *
 *   ask     — the instruction. Enter sends, Shift+Enter is a new line, Esc
 *             closes.
 *   writing — "Writing …". Esc stops it.
 *   review  — the answer already stands in the pane, selected, and Live
 *             Preview paints it as any edit. Enter (Keep) keeps it; Esc
 *             (Undo) puts back what stood there. A click elsewhere keeps it.
 *
 * Written and put back as `input.toolbar` transactions, like help's rows, so
 * the lock keeps them out of a locked element and ⌘Z works on them as on any
 * edit. If the pane changed while the answer was on its way, nothing is
 * written: the place it was asked for is gone.
 *
 * Loaded by ghost-editor.js the first time ⌘K is pressed.
 * May import: dock/*, lib/.
 */
import { finishHtmlEdit } from './html-tools.js';
import { t } from '../lib/i18n.js';
import { countGhost, rememberTaken } from './ghost-memory.js';
import { ghostPost, payload } from './ghost-request.js';

const STYLE_ID = '__sve-ghost-edit-styles';

/** Pixels between the box and the line, and the window's edge. */
const GAP = 6;
const PAD = 8;

/*
 * The dock's own menus' palette (help-styles.js): #252526 on #d4d4d4,
 * white-alpha lines. The one coloured thing is Keep, the default answer.
 */
export const GHOST_EDIT_CSS = `
[data-sve-ghost-edit] {
  position: fixed;
  z-index: 99999;
  width: min(30em, calc(100vw - 1em));
  box-sizing: border-box;
  padding: 0.55em 0.7em 0.6em;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.6rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.4);
  font: 500 0.75rem/1.4 system-ui, -apple-system, "Segoe UI", sans-serif;
}
[data-sve-ghost-edit-head] {
  display: flex;
  justify-content: space-between;
  gap: 1em;
  margin-bottom: 0.35em;
  font-size: 0.625rem;
  opacity: 0.6;
}
[data-sve-ghost-edit] textarea {
  display: block;
  width: 100%;
  box-sizing: border-box;
  max-height: 8em;
  margin: 0;
  padding: 0.2em 0;
  border: 0;
  outline: 0;
  resize: none;
  background: transparent;
  color: inherit;
  font: inherit;
}
[data-sve-ghost-edit] textarea::placeholder {
  color: inherit;
  opacity: 0.45;
}
[data-sve-ghost-edit-status] {
  padding: 0.2em 0;
  font-style: italic;
  opacity: 0.6;
}
[data-sve-ghost-edit-actions] {
  display: flex;
  gap: 0.4em;
  margin-top: 0.45em;
}
[data-sve-ghost-edit-actions] button {
  padding: 0.3em 0.8em;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 0.4rem;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
[data-sve-ghost-edit-actions] button:hover,
[data-sve-ghost-edit-actions] button:focus-visible {
  background: rgba(255, 255, 255, 0.1);
  outline: 0;
}
[data-sve-ghost-edit-actions] [data-keep] {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}
[data-sve-ghost-edit] [hidden] {
  display: none;
}
`;

/** The box that is open, if one is. */
let current = null;

function ensureStyles(doc) {
  if (doc.getElementById(STYLE_ID)) {
    return;
  }

  const style = doc.createElement('style');

  style.id = STYLE_ID;
  style.textContent = GHOST_EDIT_CSS;
  doc.head.appendChild(style);
}

function element(doc, tag, attr, text) {
  const node = doc.createElement(tag);

  if (attr) {
    node.setAttribute(attr, '');
  }

  if (text != null) {
    node.textContent = text;
  }

  return node;
}

/**
 * Opens the box for `state`'s editor and its selection. `done` is called
 * once, when it closes, whichever way.
 */
export function openEditBox(state, done) {
  close(current, false);

  const { win, view } = state;
  const doc = win.document;
  const { from, to } = view.state.selection.main;
  const editing = to > from;

  ensureStyles(doc);

  const box = element(doc, 'div', 'data-sve-ghost-edit');
  const head = element(doc, 'div', 'data-sve-ghost-edit-head');
  const hint = element(doc, 'span', null, t(win, 'code_dock_ghost_edit_send'));
  const input = doc.createElement('textarea');
  const status = element(doc, 'div', 'data-sve-ghost-edit-status', t(win, 'code_dock_ghost_writing'));
  const actions = element(doc, 'div', 'data-sve-ghost-edit-actions');
  const keep = element(doc, 'button', 'data-keep', t(win, 'code_dock_ghost_edit_keep'));
  const undo = element(doc, 'button', 'data-undo', t(win, 'code_dock_ghost_edit_undo'));

  head.append(element(doc, 'span', null, `✦ ${t(win, editing ? 'code_dock_ghost_edit_title' : 'code_dock_ghost_insert_title')}`), hint);
  input.rows = 1;
  input.placeholder = t(win, editing ? 'code_dock_ghost_edit_placeholder' : 'code_dock_ghost_insert_placeholder');
  keep.type = 'button';
  undo.type = 'button';
  status.hidden = true;
  actions.hidden = true;
  actions.append(keep, undo);
  box.append(head, input, status, actions);
  doc.body.appendChild(box);

  const self = {
    state,
    done,
    box,
    input,
    hint,
    status,
    actions,
    keep,
    from,
    to,
    original: view.state.sliceDoc(from, to),
    phase: 'ask',
    instruction: '',
    written: null,
    abort: null,
  };

  const place = () => {
    const coords = view.coordsAtPos(from);

    if (!coords) {
      return;
    }

    const left = Math.max(PAD, Math.min(coords.left, win.innerWidth - box.offsetWidth - PAD));
    let top = coords.bottom + GAP;

    if (top + box.offsetHeight > win.innerHeight - PAD && coords.top - box.offsetHeight - GAP >= PAD) {
      top = coords.top - box.offsetHeight - GAP;
    }

    box.style.left = `${left}px`;
    box.style.top = `${Math.max(PAD, top)}px`;
  };

  // The selection's line moves with the pane's scroll, and with the page's.
  const onDown = (event) => {
    if (!box.contains(event.target)) {
      if (self.phase === 'review') {
        keepIt(self, false);
      } else {
        close(self, false);
      }
    }
  };

  win.addEventListener('scroll', place, true);
  win.addEventListener('resize', place);
  doc.addEventListener('mousedown', onDown, true);
  self.unhook = () => {
    win.removeEventListener('scroll', place, true);
    win.removeEventListener('resize', place);
    doc.removeEventListener('mousedown', onDown, true);
  };

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${input.scrollHeight}px`;
    place();
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      void send(self);
    }
  });
  box.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (self.phase === 'review') {
      undoIt(self);
    } else {
      close(self, true);
    }
  });
  keep.addEventListener('click', () => keepIt(self, true));
  undo.addEventListener('click', () => undoIt(self));

  current = self;
  place();
  input.focus();
}

async function send(self) {
  const instruction = self.input.value.trim();
  const { state } = self;
  const { view, win } = state;

  if (instruction === '' || self.phase !== 'ask') {
    return;
  }

  const doc = view.state.doc;

  self.instruction = instruction;
  setPhase(self, 'writing');
  countGhost(win, 'edits');

  const abort = new win.AbortController();
  let answer;

  self.abort = abort;

  try {
    const { body } = await payload(state, self.from, self.to);

    answer = await ghostPost(win, '/edit', { ...body, instruction }, abort.signal);
  } catch {
    // Stopped with Esc: the box is already gone. The network: ask again.
    if (current === self && !abort.signal.aborted) {
      win.Statamic?.$toast?.error(t(win, 'dock_ghost_error'));
      setPhase(self, 'ask');
    }

    return;
  }

  if (current !== self) {
    return;
  }

  self.abort = null;

  if (!answer.ok) {
    win.Statamic?.$toast?.error(answer.body?.message || t(win, 'dock_ghost_error'));
    setPhase(self, 'ask');

    return;
  }

  if (view.state.doc !== doc) {
    win.Statamic?.$toast?.error(t(win, 'code_dock_ghost_edit_moved'));
    close(self, true);

    return;
  }

  const text = typeof answer.body?.text === 'string' ? answer.body.text : '';

  if (text === '') {
    win.Statamic?.$toast?.error(t(win, 'code_dock_ghost_edit_nothing'));
    setPhase(self, 'ask');

    return;
  }

  view.dispatch({
    changes: { from: self.from, to: self.to, insert: text },
    selection: { anchor: self.from, head: self.from + text.length },
    userEvent: 'input.toolbar',
    scrollIntoView: true,
  });

  // The dock hears the edit (Instant paints it, autosave saves it); the
  // focus comes back to the box, where Enter and Esc decide.
  finishHtmlEdit();
  self.written = text;
  setPhase(self, 'review');
}

function setPhase(self, phase) {
  const { win } = self.state;

  self.phase = phase;
  self.input.hidden = phase !== 'ask';
  self.input.disabled = phase !== 'ask';
  self.status.hidden = phase !== 'writing';
  self.actions.hidden = phase !== 'review';
  self.hint.textContent = t(win, phase === 'review' ? 'code_dock_ghost_edit_review' : 'code_dock_ghost_edit_send');

  if (phase === 'ask') {
    self.input.focus();
  } else if (phase === 'review') {
    self.keep.focus();
  }
}

/** Kept: counted, remembered as this author's way of writing, the box gone. */
function keepIt(self, refocus) {
  const { win } = self.state;

  countGhost(win, 'kept');
  rememberTaken(win, `⌘K ${self.instruction}`, self.written);
  close(self, refocus);
}

/**
 * What stood there, back. Only while the answer still stands as it was
 * written; after the author has typed into it, it is theirs.
 */
function undoIt(self) {
  const { view } = self.state;
  const { from, written, original } = self;

  if (written != null && view.state.sliceDoc(from, from + written.length) === written) {
    view.dispatch({
      changes: { from, to: from + written.length, insert: original },
      selection: { anchor: from, head: from + original.length },
      userEvent: 'input.toolbar',
    });
    finishHtmlEdit();
  }

  close(self, true);
}

function close(self, refocus) {
  if (!self || current !== self) {
    return;
  }

  current = null;
  self.abort?.abort();
  self.unhook();
  self.box.remove();
  self.done();

  if (refocus) {
    self.state.view.focus();
  }
}
