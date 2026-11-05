/**
 * The canvas shows the Data state Style writes under (lib/data-states.js).
 *
 * With "position = right" picked, every class Style and the grid builder write
 * is `group-data-[position=right]:…`, and holds only where the section says
 * right. A section standing on left would show none of it: a drag under the
 * state moved nothing anyone could see. So while a Data state is picked, the
 * element carrying the attribute — the pick itself for `data-[…]`, the nearest
 * one around it for `group-data-[…]` — says that value on the canvas, and the
 * grid builder measures, and drags in, what the state looks like.
 *
 * The canvas only: never the file, never the real preview. The attribute goes
 * back to what it said when the state is left or another element is picked;
 * a repaint, which draws the file's value again, is answered by saying it once
 * more.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: vue, lib/data-states.js.
 * Bus messages: none.
 */
import { watch } from 'vue';
import { parseDataState } from '../lib/data-states.js';

/**
 * @param {{ frame: () => HTMLIFrameElement|null, attr: string, updated: string }} canvas
 *   the canvas frame, the attribute its elements carry their path in, the event it paints with
 * @returns {() => void} stop, the canvas back as the file says
 */
export function startDataStatePreview(win, port, { frame, attr, updated }) {
  /** The element said to hold the state, and what it said before: `{ el, name, had }`. */
  let held = null;
  let frameWin = null;

  const restore = () => {
    if (held?.el.isConnected) {
      if (held.had === null) {
        held.el.removeAttribute(held.name);
      } else {
        held.el.setAttribute(held.name, held.had);
      }
    }

    held = null;
  };

  const apply = () => {
    const state = parseDataState(port.state?.());
    const doc = frame?.()?.contentDocument || null;
    const path = port.selectedPath?.() || '';
    const picked = state && doc && path ? doc.querySelector(`[${attr}="${CSS.escape(path)}"]`) : null;
    const name = state ? `data-${state.key}` : '';
    const target = picked ? (state.own ? picked : picked.parentElement?.closest(`[${name}]`) || null) : null;

    if (held && (held.el !== target || held.name !== name)) {
      restore();
    }

    if (!target) {
      return;
    }

    held ??= { el: target, name, had: target.getAttribute(name) };

    const want = state.value ?? '';

    if (target.getAttribute(name) !== want) {
      target.setAttribute(name, want);
      // The grid builder and Style's grid measure again: the layout moved without a paint.
      frameWin?.dispatchEvent(new Event(updated));
    }
  };

  const onPaint = () => {
    if (held && !held.el.isConnected) {
      held = null;
    }

    apply();
  };

  const bind = () => {
    const next = frame?.()?.contentWindow || null;

    if (next === frameWin) {
      return;
    }

    try {
      frameWin?.removeEventListener(updated, onPaint);
    } catch {
      /* the old document is gone */
    }

    frameWin = next;
    frameWin?.addEventListener(updated, onPaint);
  };

  const stopWatch = watch(
    () => [port.state?.(), port.selectedPath?.(), port.rev?.value],
    () =>
      win.requestAnimationFrame(() => {
        bind();
        apply();
      }),
    { immediate: true }
  );

  return () => {
    stopWatch();
    restore();

    try {
      frameWin?.removeEventListener(updated, onPaint);
    } catch {
      /* gone */
    }

    frameWin = null;
  };
}
