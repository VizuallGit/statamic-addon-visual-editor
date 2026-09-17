/**
 * A mouse drag that must not be swallowed by an iframe.
 *
 * Resizing a dock means dragging across the Live Preview iframe, and an iframe
 * eats the mouse events it is under. For the length of the drag every iframe is
 * made pointer-transparent and a full-screen shield takes the events instead.
 * Everything is undone on mouseup, or on window blur if the mouse is released
 * outside the window.
 *
 * May import: nothing.
 *
 * @param {Window} win
 * @param {string} cursor      CSS cursor shown while dragging (`col-resize`, …)
 * @param {(event: MouseEvent) => void} onMove
 * @param {() => void} [onEnd]
 * @param {string} [shieldAttr] data-attribute that marks this dock's shield
 */
export function beginOverlayDrag(win, cursor, onMove, onEnd, shieldAttr = 'data-sve-drag-shield') {
  const doc = win.document;
  const frames = [...doc.querySelectorAll('iframe')];

  frames.forEach((frame) => {
    frame.style.pointerEvents = 'none';
  });

  const shield = doc.createElement('div');
  shield.setAttribute(shieldAttr, '');
  shield.style.cssText =
    `position:fixed;inset:0;z-index:2147483646;cursor:${cursor};user-select:none;`;
  doc.body.appendChild(shield);

  let done = false;

  const move = (event) => {
    onMove(event);
  };

  const up = () => {
    if (done) {
      return;
    }

    done = true;
    doc.removeEventListener('mousemove', move);
    doc.removeEventListener('mouseup', up);
    win.removeEventListener('blur', up);
    frames.forEach((frame) => {
      frame.style.pointerEvents = '';
    });
    shield.remove();
    onEnd?.();
  };

  doc.addEventListener('mousemove', move);
  doc.addEventListener('mouseup', up);
  win.addEventListener('blur', up);
}
