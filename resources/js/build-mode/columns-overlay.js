/**
 * Columns in the preview while Build is on: each column of the picked Columns
 * — or of the Columns around a picked column — outlined dashed, with a + in
 * every empty one that makes it the place Add puts the next element.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: vue, lib/preview-frame.js, lib/style.js, build-mode/place.js. Drawn from the Control Panel over the frame, the way
 *   tw-overlay.js draws the class strip: the frame is same origin, so the
 *   boxes are read straight out of it by the paths html-pick-align.js stamps
 *   (`data-sve-ht-path`). Nothing in the kernel is touched, no message sent.
 * Bus: none.
 *
 * Only for the picked element, and never a loop: a ResizeObserver on the
 * Columns and the frame's own scroll move the boxes; a new file (the port's
 * `rev`) or a preview that swapped its document finds the element again.
 */
import { watch } from 'vue';
import { previewFrame } from '../lib/preview-frame.js';
import { injectStyle } from '../lib/style.js';
import { columnsFor } from './place.js';

const LAYER_ID = '__sve-build-columns';
const STYLE_ID = '__sve-build-columns-css';
const PLUS =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';

function ensureStyles(doc) {
  injectStyle(
    doc,
    STYLE_ID,
    `#${LAYER_ID}{position:fixed;inset:0;pointer-events:none;z-index:99990}
#${LAYER_ID} [data-col]{position:fixed;box-sizing:border-box;border:1px dashed rgba(56,88,233,.85);border-radius:2px;display:flex;align-items:center;justify-content:center}
#${LAYER_ID} [data-col][data-target]{background:rgba(56,88,233,.08);border-style:solid}
#${LAYER_ID} button{all:unset;pointer-events:auto;box-sizing:border-box;width:1.5rem;height:1.5rem;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;background:#3858e9;color:#fff;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.3)}
#${LAYER_ID} button:hover{background:#4a68ee}`
  );
}

/**
 * Start drawing for the port's pick. Returns a stop function.
 *
 * @param {Window} win   the Control Panel window
 * @param {object} port  html(), selectedPath(), plusPath(), setPlus(path), rev
 */
export function startColumnsOverlay(win, port) {
  const doc = win.document;
  let target = null;
  let els = [];
  let observer = null;
  let frameWin = null;
  let queued = false;

  const layer = () => doc.getElementById(LAYER_ID);

  const clear = () => {
    layer()?.remove();
    observer?.disconnect();
    observer = null;
    els = [];
  };

  const place = () => {
    const frame = previewFrame(win);
    const box = layer();

    if (!frame || !box || !els.length) {
      return;
    }

    const frameBox = frame.getBoundingClientRect();
    const scale = frame.clientWidth ? frameBox.width / frame.clientWidth : 1;

    els.forEach(({ el, cell }) => {
      const r = el.getBoundingClientRect();
      const top = frameBox.top + r.top * scale;
      const left = frameBox.left + r.left * scale;
      const width = r.width * scale;
      const height = Math.max(r.height * scale, 32);

      cell.style.left = `${left}px`;
      cell.style.top = `${top}px`;
      cell.style.width = `${width}px`;
      cell.style.height = `${height}px`;
      cell.hidden = top + height < frameBox.top || top > frameBox.bottom;
    });
  };

  const schedule = () => {
    if (queued) {
      return;
    }

    queued = true;
    win.requestAnimationFrame(() => {
      queued = false;
      place();
    });
  };

  const bindFrame = () => {
    const next = previewFrame(win)?.contentWindow || null;

    if (next === frameWin) {
      return;
    }

    try {
      frameWin?.removeEventListener('scroll', schedule, true);
      frameWin?.removeEventListener('statamic:preview-updated', find);
    } catch {
      /* the old document is gone */
    }

    frameWin = next;

    try {
      frameWin?.addEventListener('scroll', schedule, true);
      frameWin?.addEventListener('statamic:preview-updated', find);
    } catch {
      frameWin = null;
    }
  };

  function find() {
    clear();
    target = columnsFor(port.html(), port.selectedPath());

    if (!target) {
      return;
    }

    bindFrame();

    const inner = previewFrame(win)?.contentDocument;
    const grid = inner?.querySelector(`[data-sve-ht-path="${target.path}"]`);

    if (!grid) {
      return;
    }

    ensureStyles(doc);

    const wrap = doc.createElement('div');

    wrap.id = LAYER_ID;
    doc.body.appendChild(wrap);

    const plus = port.plusPath();

    els = target.columns
      .map((column) => {
        const el = inner.querySelector(`[data-sve-ht-path="${column.path}"]`);

        if (!el) {
          return null;
        }

        const cell = doc.createElement('div');

        cell.dataset.col = column.path;

        if (plus === column.path) {
          cell.dataset.target = '';
        }

        if (column.empty) {
          const btn = doc.createElement('button');

          btn.type = 'button';
          btn.dataset.sveBuildColumnPlus = column.path;
          btn.innerHTML = PLUS;
          btn.addEventListener('click', () => port.setPlus(column.path));
          cell.appendChild(btn);
        }

        wrap.appendChild(cell);

        return { el, cell };
      })
      .filter(Boolean);

    observer = new win.ResizeObserver(schedule);
    observer.observe(grid);
    place();
  }

  const stopWatch = watch(() => [port.rev.value, port.selectedPath(), port.plusPath()], () => win.requestAnimationFrame(find));

  win.addEventListener('resize', schedule);
  win.addEventListener('scroll', schedule, true);
  find();

  return () => {
    stopWatch();
    win.removeEventListener('resize', schedule);
    win.removeEventListener('scroll', schedule, true);

    try {
      frameWin?.removeEventListener('scroll', schedule, true);
      frameWin?.removeEventListener('statamic:preview-updated', find);
    } catch {
      /* gone with its document */
    }

    clear();
  };
}
