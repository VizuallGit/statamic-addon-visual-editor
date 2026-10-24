/**
 * bridge.js — region "focus-frame".
 *
 * The one frame around whatever is being edited as a whole: the header, the
 * footer, a global section, a component. Each of those used to draw its own
 * way out — the header a Close chip in its corner and a bar under the page,
 * a global section only the bar, a component nothing in the preview at all —
 * and the bar said "no content changes yet" over a thing that is a file and
 * never has any. One frame now says the same thing in the same place for all
 * of them: what this is, top-left; the way out, top-right. Only the colour
 * says which kind it is. Save and "not saved" show only while there is
 * something to save, so a clean header, a clean global section and a
 * component all wear the same frame.
 *
 * One kind, one frame — but a frame may have several boxes. A component is a
 * file, and the page may use it in more than one place; every place is the
 * same file, so every place wears the same label and the same way out. The
 * boxes share their state and their callbacks; only their anchors differ.
 *
 * Over the thing, not in it. The thing is the site's markup, and two morphs
 * own that markup — the preview's Alpine morph against server HTML, and the
 * dock's Instant paint against the file — and both take out what the server
 * did not send. So the frame hangs off <html> like the confirm card, is laid
 * over the element's box in document coordinates, and follows the box when it
 * changes: a dock paint, a morph, a resize, a scroll (a sticky header moves).
 * The container takes no pointer events — a click through it lands on the
 * element, as before — only its chips do, and they keep their clicks to
 * themselves: the page's click handling must not read the way out as a click
 * on the header. The `__sve` id is what tells site-inert the chips are ours.
 *
 * What the frame does not know: what opens, what saves, what closes. Those are
 * the caller's (header-footer.js, global-sections.js, component-pick.js) and
 * arrive as `onSave` / `onClose`. Nor does it translate — the caller hands in
 * its `t`, so this file imports nothing and can be run against a fake DOM.
 *
 * May import: nothing.
 */

/** On the frame's container: which kind of thing it frames. */
export const FOCUS_FRAME_ATTR = 'data-sve-focus-frame';
export const FOCUS_LABEL_ATTR = 'data-sve-focus-label';
export const FOCUS_STATUS_ATTR = 'data-sve-focus-status';
export const FOCUS_SAVE_ATTR = 'data-sve-focus-save';
export const FOCUS_CLOSE_ATTR = 'data-sve-focus-close';

/** The colours each kind already wore on its outline and label; the frame wears the same. */
export const FOCUS_COLORS = Object.freeze({
  header: '#60a5fa',
  footer: '#60a5fa',
  global: '#7c3aed',
  component: '#0f766e',
});

/** Same type as the label chips the page draws on hover (`[data-sve-chrome]::before`, `[data-sve-global-badge]`). */
const CHIP_FONT = '500 10px/1 sans-serif';

/** The id of a frame's first box; further boxes of the same kind count up from it. */
export function focusFrameId(kind, index = 0) {
  return index ? `__sve-focus-frame-${kind}-${index}` : `__sve-focus-frame-${kind}`;
}

/** One frame per kind — a component can be open inside a focused header. */
const frames = new Map();

/** Whether a click landed on a frame's chips rather than on the page. */
export function focusFrameOwns(target) {
  return !!target?.closest?.(`[${FOCUS_FRAME_ATTR}]`);
}

export function focusFrameOpen(kind) {
  return frames.has(kind);
}

/**
 * The viewport boxes of every open frame's chips (label, actions) — what the
 * row toolbar keeps clear of, so Close is never under "move up".
 */
export function focusFrameChipRects() {
  const rects = [];

  for (const frame of frames.values()) {
    for (const box of frame.boxes) {
      for (const el of [box.label, box.actions]) {
        const rect = el.getBoundingClientRect();

        if (rect.width && rect.height) {
          rects.push(rect);
        }
      }
    }
  }

  return rects;
}

function chip(doc, attr, color, { fill = true, bold = false, radius = '0' } = {}) {
  const el = doc.createElement('button');

  el.type = 'button';
  el.setAttribute(attr, '');
  el.style.cssText =
    `all:unset;box-sizing:border-box;cursor:pointer;pointer-events:auto;font:${CHIP_FONT};` +
    `letter-spacing:.02em;padding:4px 8px;border-radius:${radius};white-space:nowrap;` +
    (fill ? `background:${color};color:#fff;` : `background:#fff;color:${color};`) +
    (bold ? 'font-weight:700;' : '');

  return el;
}

function keepClick(el, run) {
  // pointerdown is what the page's click handling reads first; the click is
  // what inline editing and the toolbar read. Neither may see a chip.
  el.addEventListener('pointerdown', (event) => {
    event.stopPropagation();
  });
  el.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    run?.();
  });
}

function place(win, box) {
  const { el, root } = box;

  // A morph of the whole document can take the frame out with the markup it
  // replaces. The frame is ours, not the server's: hang it back on <html>.
  if (!root.isConnected) {
    win.document.documentElement.appendChild(root);
  }

  // The anchor was morphed away and not yet re-pointed: leave the box where
  // it stood rather than at 0,0 — the next mount for this kind moves it.
  if (!el.isConnected) {
    return;
  }

  const rect = el.getBoundingClientRect();

  root.style.top = `${rect.top + win.scrollY}px`;
  root.style.left = `${rect.left + win.scrollX}px`;
  root.style.width = `${rect.width}px`;
  root.style.height = `${rect.height}px`;
}

function watch(win, box) {
  box.unwatch?.();

  const run = () => place(win, box);
  const sizes = typeof win.ResizeObserver === 'function' ? new win.ResizeObserver(run) : null;

  sizes?.observe(box.el);
  win.addEventListener('resize', run);
  win.addEventListener('scroll', run, { capture: true, passive: true });

  box.unwatch = () => {
    sizes?.disconnect();
    win.removeEventListener('resize', run);
    win.removeEventListener('scroll', run, { capture: true });
  };
}

function paintDirty(frame) {
  const show = frame.dirtyable && frame.dirty ? '' : 'none';

  for (const box of frame.boxes) {
    box.status.style.display = show;
    box.save.style.display = show;
  }
}

function dropBox(box) {
  box.unwatch?.();
  box.root.remove();
}

/** One box of a frame: the outline laid over `el`, its label top-left, its actions top-right. */
function buildBox(win, frame, el, index) {
  const doc = win.document;
  const { kind, t } = frame;
  const color = FOCUS_COLORS[kind] || FOCUS_COLORS.global;

  doc.getElementById(focusFrameId(kind, index))?.remove();

  const root = doc.createElement('div');

  root.id = focusFrameId(kind, index);
  root.setAttribute(FOCUS_FRAME_ATTR, kind);
  root.setAttribute('data-sve-ui', '');
  root.style.cssText =
    'position:absolute;z-index:9998;margin:0;padding:0;pointer-events:none;box-sizing:border-box;';

  const label = doc.createElement('span');

  label.setAttribute(FOCUS_LABEL_ATTR, '');
  label.textContent = frame.label || '';
  label.style.cssText =
    `position:absolute;top:0;left:0;box-sizing:border-box;font:${CHIP_FONT};letter-spacing:.02em;` +
    `padding:4px 8px;border-radius:0 0 4px 0;background:${color};color:#fff;white-space:nowrap;pointer-events:none;`;

  const actions = doc.createElement('div');

  actions.style.cssText =
    'position:absolute;top:0;right:0;display:flex;align-items:stretch;pointer-events:none;';

  const status = doc.createElement('span');

  status.setAttribute(FOCUS_STATUS_ATTR, '');
  status.textContent = t('focus_dirty');
  status.style.cssText =
    `box-sizing:border-box;font:${CHIP_FONT};letter-spacing:.02em;padding:4px 8px;` +
    `background:#fff;color:${color};white-space:nowrap;pointer-events:auto;`;

  const save = chip(doc, FOCUS_SAVE_ATTR, color, { bold: true });

  save.textContent = t('save');
  keepClick(save, () => frame.onSave?.());

  const close = chip(doc, FOCUS_CLOSE_ATTR, color, { radius: '0 0 0 4px' });

  close.textContent = `${t('close')} ✕`;
  close.setAttribute('aria-label', t('close'));
  // A hairline between Save and Close, so two chips of one colour read as two.
  close.style.boxShadow = 'inset 1px 0 rgba(255,255,255,.35)';
  keepClick(close, () => frame.onClose?.());

  actions.append(status, save, close);
  root.append(label, actions);
  doc.documentElement.appendChild(root);

  const box = { el, root, label, actions, status, save, close, unwatch: null };

  watch(win, box);

  return box;
}

/**
 * Put the frame of `kind` around `el` — or around each of `els` — or move the
 * frame already up to them.
 *
 * Idempotent on purpose: the rebind after a morph and the first entry are the
 * same call, so a frame is never built twice and never missing after a redraw.
 * `label` names the thing; `dirtyable` says whether it can ever hold unsaved
 * work (a half's global set, a global section's entry — not a component's
 * file); `dirty` is the state as the caller knows it right now.
 */
export function mountFocusFrame(win, { kind, el = null, els = null, label, t, dirtyable = false, dirty = false, onSave = null, onClose }) {
  const targets = (els || [el]).filter((node) => node);

  if (!targets.length || !kind) {
    return null;
  }

  let frame = frames.get(kind);

  if (!frame) {
    frame = { kind, t, label: label || '', boxes: [], dirtyable, dirty, onSave, onClose };
    frames.set(kind, frame);
  }

  frame.onSave = onSave;
  frame.onClose = onClose;
  frame.dirtyable = dirtyable;
  frame.dirty = dirty;

  if (label != null) {
    frame.label = label;
  }

  // One box per anchor, in order: re-point the ones there, build the missing, drop the surplus.
  frame.boxes.splice(targets.length).forEach(dropBox);

  targets.forEach((target, index) => {
    const box = frame.boxes[index];

    if (!box) {
      frame.boxes[index] = buildBox(win, frame, target, index);
    } else if (box.el !== target) {
      box.el = target;
      watch(win, box);
    }

    frame.boxes[index].label.textContent = frame.label;
  });

  paintDirty(frame);
  frame.boxes.forEach((box) => place(win, box));

  return frame;
}

/** The dirty state as the Control Panel now reports it. Nothing to do while no frame is up. */
export function setFocusFrameDirty(kind, dirty) {
  const frame = frames.get(kind);

  if (!frame) {
    return;
  }

  frame.dirty = !!dirty;
  paintDirty(frame);
}

/** The name arrives late for a global section (with the first values the panel streams). */
export function setFocusFrameLabel(kind, label) {
  const frame = frames.get(kind);

  if (frame && label != null) {
    frame.label = label;
    frame.boxes.forEach((box) => {
      box.label.textContent = label;
    });
  }
}

export function unmountFocusFrame(kind) {
  const frame = frames.get(kind);

  if (!frame) {
    return false;
  }

  frame.boxes.forEach(dropBox);
  frames.delete(kind);

  return true;
}
