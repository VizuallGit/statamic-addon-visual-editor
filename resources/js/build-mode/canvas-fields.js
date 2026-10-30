/**
 * The form's editors on Build's canvas: an island that is one field's —
 * `{{ bard_field }}` alone in its element — painted from the editor that
 * field is typed in, before the server has rendered it.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: nothing.
 *
 * A Bard field's value is a document, which the server renders: to the canvas
 * it is an island, read out of the real preview each time that has rendered
 * (canvas.js `learn`). But the editor the field is typed in holds a rendering
 * of the same document — ProseMirror's — so from the moment it is typed in
 * until it is left, the island is the editor's: its HTML goes into the
 * islands' store the frame it changes and the section is painted again, and
 * what the server renders meanwhile is not read over it (`holds` — a render
 * is always a keystroke or more behind, and would pull the text back). When
 * the editor is left, the page is read again and the server's rendering takes
 * over.
 *
 * A set in Bard is a Vue component in the editor, nothing the server would
 * send: an editor holding one is not painted, and does not hold its island.
 *
 * Statamic ids a field `field_<path with underscores>` (selection-panel.js
 * `revealField` reads the same id).
 */

/** ProseMirror's own nodes in the editor, not the document's. */
const HELPERS = '.ProseMirror-trailingBreak, .ProseMirror-separator';
/** A node drawn by a Vue component — a set. */
const VIEW = '[data-node-view-wrapper]';

/** Statamic's id for the field at a path: `page_sections.4.bard_field` → `field_page_sections_4_bard_field`. */
export function fieldDomId(path) {
  return `field_${String(path).replaceAll('.', '_')}`;
}

/** The editor's HTML as the canvas paints it, or null when the element holds no editor, or one with a set in it. */
export function editorHtml(el) {
  const editor = el.querySelector('.ProseMirror');

  if (!editor || editor.querySelector(VIEW)) {
    return null;
  }

  const copy = editor.cloneNode(true);

  copy.querySelectorAll(HELPERS).forEach((node) => node.remove());

  return copy.innerHTML;
}

/**
 * @param {Window} win                 the Control Panel's window
 * @param {object} options
 * @param {Map}      options.islands   the canvas's islands by key (canvas.js `known.islands`)
 * @param {Function} options.paint     paints the section again from the islands
 * @param {Function} options.read      reads the page again from the real preview
 */
export function canvasFields(win, { islands, paint, read }) {
  const doc = win.document;
  /** island key → { el, stop } */
  const bound = new Map();
  /** island keys whose editor is being typed in */
  const held = new Set();

  function bind(key, el) {
    let frame = 0;

    const flush = () => {
      frame = 0;

      const html = editorHtml(el);

      if (html === null) {
        held.delete(key);

        return;
      }

      if (islands.get(key) !== html) {
        islands.set(key, html);
        paint();
      }
    };
    const soon = () => {
      if (held.has(key) && !frame) {
        frame = win.requestAnimationFrame(flush);
      }
    };
    const observer = new win.MutationObserver(soon);
    const onFocusIn = () => {
      held.add(key);
      soon();
    };
    const onFocusOut = (event) => {
      if (el.contains(event.relatedTarget)) {
        return;
      }

      if (held.delete(key)) {
        read();
      }
    };

    el.addEventListener('focusin', onFocusIn);
    el.addEventListener('focusout', onFocusOut);
    observer.observe(el, { subtree: true, childList: true, characterData: true });

    // Bound while already typed in (the editor was there before the plan): the editor's from now.
    if (el.contains(doc.activeElement)) {
      onFocusIn();
    }

    return () => {
      observer.disconnect();
      el.removeEventListener('focusin', onFocusIn);
      el.removeEventListener('focusout', onFocusOut);
      win.cancelAnimationFrame(frame);
      held.delete(key);
    };
  }

  return {
    /**
     * The plan's field islands, each bound to its editor as the form has it
     * now; an island the plan no longer has, or whose editor is another
     * element, is let go.
     *
     * @param {object|null} plan     canvas-paint.js `planTemplate`
     * @param {Function}    idOf     a field's name → the id of its element
     */
    follow(plan, idOf) {
      const keep = new Set();

      for (const run of plan?.islands || []) {
        const el = run.field ? doc.getElementById(idOf(run.field)) : null;

        if (!el) {
          continue;
        }

        keep.add(run.key);

        if (bound.get(run.key)?.el === el) {
          continue;
        }

        bound.get(run.key)?.stop();
        bound.set(run.key, { el, stop: bind(run.key, el) });
      }

      for (const [key, binding] of bound) {
        if (!keep.has(key)) {
          binding.stop();
          bound.delete(key);
        }
      }
    },
    /** True while the island's editor is typed in: its HTML is the editor's, not a render's. */
    holds(key) {
      return held.has(key);
    },
    stop() {
      bound.forEach((binding) => binding.stop());
      bound.clear();
      held.clear();
    },
  };
}
