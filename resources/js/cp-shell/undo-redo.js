/**
 * Back and forward in the top bar, and what each goes through: in Edit Content
 * the page's form (Statamic's values), in Build the file in the dock. Two
 * histories, one in each mode, because they are two truths: a change on one side
 * is not a step on the other.
 *
 * The dock has its own undo, but it starts over when the pane shows something
 * else (dock/undo.js), and in Build that is every pick. So a step here is the
 * whole file, or the whole form, a moment after a change stopped: a word typed,
 * or a side dragged, is one step. A file has its own history, kept while another
 * is open.
 *
 * The form's meta goes with its values. A set back in a Replicator with no meta
 * of its own would throw there (lib/publish-containers.js `addContainer`).
 *
 * May import: lib/, cp/bus.js, build-mode-host.js. Nothing here touches preview,
 * overlay or bridge: a value written reaches them the way a typed one does.
 */
import { watch } from 'vue';
import { ask, emit, on } from '../cp/bus.js';
import { editorMode } from '../build-mode-host.js';
import { htmlTreeUi } from '../cp/html-tree/store.js';
import { flattenHtmlTree, parseHtmlTree } from '../html-tree-parse.js';
import { activeContainers } from '../lib/publish-containers.js';
import { unwrapRef } from '../lib/values.js';
import { createUndoStack } from './undo-stack.js';

/** Between the file and its CSS in a step, while the CSS mode demo is on (`css-mode:on`, css-mode/flag.js). Off, a step is the file, as ever. */
const CSS_SPLIT = '\u0000';

/** How long a change has to stop before it is a step. */
const SETTLE = 350;
/** Fields tidy their value as they draw. What they do this long after the form came or a step was written is not an edit. */
const QUIET = 1200;

/** The page's form. The one followed stays for as long as it stands: another form of that name can come and go beside it. */
function baseContainer(doc, followed) {
  const all = activeContainers(doc);

  if (followed && all.includes(followed)) {
    return followed;
  }

  return all.find((one) => unwrapRef(one?.name) === 'base' && typeof one.setValues === 'function' && typeof one.setMeta === 'function') || null;
}

/**
 * @param {Window} win
 * @param {() => void} changed  called when what the buttons can do may have changed
 */
export function startUndoRedo(win, changed) {
  let form = null;
  let formStack = null;
  let stopForm = null;
  let quietUntil = 0;
  let timer = 0;
  const files = new Map();
  let fileType = null;

  const inContent = () => editorMode() === 'content';

  function fileStack(type) {
    if (!files.has(type)) {
      files.set(type, createUndoStack({
        read() {
          const html = ask('dock:html');

          if (typeof html !== 'string' || html === '') {
            return null;
          }

          return ask('css-mode:on') ? `${html}${CSS_SPLIT}${ask('dock:css') ?? ''}` : html;
        },
        write(state) {
          const [html, css] = state.split(CSS_SPLIT);
          // Offsets move with the file: the tree stands on the picked element by where it starts now.
          const path = htmlTreeUi.rows.find((row) => row.current)?.path;

          if (ask('dock:set-html', html) === false) {
            return false;
          }

          if (css !== undefined) {
            ask('dock:set-css', css);
            emit('css-mode:restored');
          }

          const row = path ? flattenHtmlTree(parseHtmlTree(html), new Set()).find((one) => one.path === path) : null;

          if (row) {
            htmlTreeUi.selectFrom = { at: row.from, left: 4 };
          }

          return true;
        },
      }));
    }

    return files.get(type);
  }

  function formState(container) {
    return {
      values: JSON.stringify(unwrapRef(container.values)),
      meta: JSON.stringify(unwrapRef(container.meta)),
    };
  }

  /** The page's form, once it is there and for as long as it stands. Watched only in Edit Content. */
  function followForm() {
    const next = inContent() ? baseContainer(win.document, form) : null;

    if (next === form && (!!stopForm === !!next)) {
      return;
    }

    stopForm?.();
    stopForm = null;

    if (next && next !== form) {
      formStack = createUndoStack({
        read: () => formState(next),
        write(state) {
          // Meta first: the values draw from it.
          next.setMeta(JSON.parse(state.meta));
          next.setValues(JSON.parse(state.values));
          quietUntil = win.performance.now() + QUIET;

          return true;
        },
        same: (a, b) => a.values === b.values,
      });
      form = next;
      quietUntil = win.performance.now() + QUIET;
      formStack.capture();
    }

    if (next) {
      // What Build wrote to the form while it was away is a step, as any other.
      formStack.capture();
      stopForm = watch(() => unwrapRef(next.values), settle, { deep: true });
    }

    changed();
  }

  function capture() {
    timer = 0;

    if (inContent()) {
      if (formStack) {
        if (win.performance.now() < quietUntil) {
          formStack.rebase();
        } else {
          formStack.capture();
        }
      }
    } else {
      const type = ask('dock:current-type') || '';

      // Another file came into the dock: that is no edit.
      if (type !== fileType) {
        fileType = type;
        fileStack(type).rebase();
      } else {
        fileStack(type).capture();
      }
    }

    changed();
  }

  function settle() {
    win.clearTimeout(timer);
    timer = win.setTimeout(capture, SETTLE);
  }

  const current = () => {
    if (inContent()) {
      return formStack;
    }

    return fileType === null ? null : fileStack(fileType);
  };

  function go(direction) {
    win.clearTimeout(timer);
    timer = 0;
    capture();

    const stack = current();

    if (stack?.[direction]()) {
      changed();
    }
  }

  const stopDock = on('dock:html-changed', settle);
  const stopCss = on('css-mode:changed', settle);

  return {
    undo: () => go('undo'),
    redo: () => go('redo'),
    canUndo: () => !!current()?.canUndo(),
    canRedo: () => !!current()?.canRedo(),
    /** The mode changed, or the bar was drawn: each side looks to what it follows. */
    sync() {
      followForm();

      if (!inContent()) {
        settle();
      }
    },
    stop() {
      win.clearTimeout(timer);
      stopForm?.();
      stopDock();
      stopCss();
    },
  };
}
