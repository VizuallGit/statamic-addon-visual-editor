/**
 * Writing directly on Build's canvas: a click on the element already picked
 * makes its words editable where they stand.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: nothing.
 * Bus: none. The file is written through the port (`inlineTarget`, `setText`).
 *
 * Words of the file's own go to the file. A field alone in its element —
 * `{{ headline }}` — goes to the field: the form is that value's one source,
 * and the tag stays in the file. What cannot be typed over here (`Hej {{ x }}`,
 * Rich text, a loop's item) keeps the panel's Content.
 *
 * No attribute is added to the file: `contenteditable` lives on the canvas's
 * element while it is typed in, and the canvas's morphs step round that element
 * (`editing()`), since each would take the attribute off and move the caret.
 */

const TYPING = /^(insertText|insertCompositionText|insertReplacementText|insertLineBreak|delete|history)/;

/** The words of an edited element as the text box has them: line breaks as `<br>`. */
export function editedText(el) {
  const out = [];
  const walk = (node) => {
    for (const kid of node.childNodes) {
      if (kid.nodeType === 3) {
        out.push(kid.data);
      } else if (String(kid.tagName).toLowerCase() === 'br') {
        out.push('<br>');
      } else if (kid.nodeType === 1) {
        walk(kid);
      }
    }
  };

  walk(el);

  // The browser keeps a last <br> to stand the caret on: it is not the text's.
  return out.join('').replace(/<br>$/, '').replace(/ /g, ' ');
}

function caretAt(doc, x, y) {
  if (doc.caretRangeFromPoint) {
    return doc.caretRangeFromPoint(x, y);
  }

  const at = doc.caretPositionFromPoint?.(x, y);
  const range = at && doc.createRange();

  if (range) {
    range.setStart(at.offsetNode, at.offset);
    range.collapse(true);
  }

  return range || null;
}

/**
 * @param {object} on
 * @param {() => object}   on.port      the canvas's port
 * @param {(name: string, value: string) => void} on.setField  a field's value in the form
 * @param {() => void}     on.paint     paints the section from the file and the form again
 * @param {(path: string) => Element|null} on.find  the element at a path, painted anew or not
 */
export function canvasEdit({ port, setField, paint, find }) {
  let session = null;
  let ticket = 0;

  const write = () => {
    const now = session;

    now.frame = 0;

    if (now.target.field) {
      setField(now.target.field, editedText(now.el));
    } else {
      port().setText(now.path, editedText(now.el));
    }
  };

  function onInput() {
    if (!session.frame) {
      session.frame = session.el.ownerDocument.defaultView.requestAnimationFrame(write);
    }
  }

  function onBeforeInput(event) {
    if (event.inputType === 'insertFromPaste' || event.inputType === 'insertFromDrop') {
      event.preventDefault();

      const words = event.dataTransfer?.getData('text/plain')?.replace(/\s*\n\s*/g, ' ');

      if (words) {
        event.target.ownerDocument.execCommand('insertText', false, words);
      }
    } else if (!TYPING.test(event.inputType)) {
      event.preventDefault();
    }
  }

  function begin(el, path, target, point) {
    const doc = el.ownerDocument;

    session = { el, path, target, frame: 0, before: editedText(el), style: el.getAttribute('style') };
    el.setAttribute('contenteditable', 'true');
    el.setAttribute('spellcheck', 'false');
    el.style.setProperty('outline', '2px solid #4f6ef7');
    el.style.setProperty('outline-offset', '2px');
    el.style.setProperty('cursor', 'text');
    el.style.setProperty('user-select', 'text');
    el.addEventListener('beforeinput', onBeforeInput);
    el.addEventListener('input', onInput);
    el.addEventListener('blur', finish);
    el.focus();

    const range = point && caretAt(doc, point.x, point.y);

    if (range && el.contains(range.startContainer)) {
      const selection = doc.getSelection();

      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  /** @returns {boolean} the click is taken: it starts writing, or will once a field is known */
  function start(el, path, event) {
    const target = port().inlineTarget?.(path);

    if (!target) {
      port().showContent?.();

      return false;
    }

    const point = { x: event.clientX, y: event.clientY };
    const mine = ++ticket;

    Promise.resolve(target).then((known) => {
      if (mine !== ticket || session || port()?.selectedPath() !== path) {
        return;
      }

      const live = find(path);

      if (known && live) {
        begin(live, path, known, point);
      } else {
        port().showContent?.();
      }
    });

    return true;
  }

  function finish({ revert = false } = {}) {
    if (!session || session.ending) {
      return;
    }

    const { el, path, target, before, style } = session;

    session.ending = true;

    if (session.frame) {
      el.ownerDocument.defaultView.cancelAnimationFrame(session.frame);
      session.frame = 0;
    }

    if (revert) {
      el.innerHTML = before.split('<br>').map((part) => part.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])).join('<br>');
    }

    if (target.field) {
      setField(target.field, editedText(el));
    } else {
      port().setText(path, editedText(el));
    }

    el.removeEventListener('beforeinput', onBeforeInput);
    el.removeEventListener('input', onInput);
    el.removeEventListener('blur', finish);
    el.removeAttribute('contenteditable');
    el.removeAttribute('spellcheck');

    if (style === null) {
      el.removeAttribute('style');
    } else {
      el.setAttribute('style', style);
    }

    session = null;
    ticket += 1;
    el.ownerDocument.getSelection()?.removeAllRanges();
    paint();
  }

  return {
    start,
    finish,
    /** The element typed in: the canvas's morphs step round it. */
    editing: () => session?.el || null,
    /** Is this event's target the element typed in? Then the caret is the press's, not a drag's. */
    holds: (node) => !!session && (node === session.el || session.el.contains(node)),
    /** A key while typing: Escape takes back, Enter is a line break or the end. @returns {boolean} taken */
    key(event) {
      if (!session) {
        return false;
      }

      // The site's and the panel's shortcuts stay out of it.
      event.stopPropagation();

      if (event.key === 'Escape') {
        event.preventDefault();
        finish({ revert: true });
      } else if (event.key === 'Enter') {
        event.preventDefault();

        if (session.target.oneLine) {
          finish();
        } else {
          event.target.ownerDocument.execCommand('insertLineBreak');
        }
      }

      return true;
    },
  };
}
