/**
 * Being inside something on Build's canvas — the header, the footer, a global
 * section, a component — exactly as in Content, because it is the bridge that
 * does it there too.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: cp/open-overlay.js, cp/surfaces/ChoiceDialog.vue.
 * Bus: none.
 *
 * The real preview keeps running under the canvas, hidden, and its bridge
 * keeps the focus: the classes on <html> (`sve-chrome-focus-header`,
 * `sve-global-focus`, `sve-component-focus`), the marks on the elements, the
 * frame with its label, Save and Close, and the "Global header — edit it?"
 * question. Nothing of that is decided here; it is shown here:
 *
 *   The fade    the classes copied onto the canvas's <html>, and the bridge's
 *               own focus rules (its stylesheet, read off the real preview's
 *               CSSOM) in a sheet of the canvas's — the marks on the elements
 *               come with the body the canvas copies (`onState` asks for it).
 *   The frame   each of the bridge's frame boxes cloned as it is drawn and laid
 *               over the canvas's own element (the half, the focused global
 *               sections, the component's places); Save and Close click the
 *               bridge's own buttons.
 *   The ask     the bridge's confirm (`#__sve-preview-confirm`), shown in the
 *               Control Panel with its words and buttons; the answer clicks
 *               the bridge's button.
 *   Clicks      what the bridge decides on a click in Content: a click on the
 *               header, the footer or a global section is handed to the same
 *               element in the real preview (the bridge asks, then steps in);
 *               inside the header, the footer or a global section, a click on
 *               the faded page is handed to its body (the bridge's way out —
 *               the Control Panel asks about unsaved edits first). Escape too.
 *
 * Everything else on the canvas — picks, the +, drags, the section's toolbar
 * — stays the canvas's.
 */

import { openCpOverlay } from '../cp/open-overlay.js';
import ChoiceDialog from '../cp/surfaces/ChoiceDialog.vue';

const BRIDGE_STYLES_ID = '__sve-bridge-styles';
const CONFIRM_ID = '__sve-preview-confirm';
const FRAME_ATTR = 'data-sve-focus-frame';
const SAVE_ATTR = 'data-sve-focus-save';
const CLOSE_ATTR = 'data-sve-focus-close';
const LAYER_ID = '__sve-build-focus';
const CSS_ID = '__sve-build-focus-css';

/** The focus classes the bridge puts on <html>. */
const FOCUS_CLASS = /^sve-(chrome-focus-(header|footer)|chrome-focus|global-focus|component-focus)$/;
/** The bridge's rules for being inside something — not its hover affordances. */
const FOCUS_RULE = /html\.sve-(chrome-focus-(header|footer)|global-focus|component-focus)\b|^\[data-sve-global-focused\]/;
/** The marks the bridge puts on elements while inside — the body the canvas copies carries them. */
const STATE_ATTRS = ['data-sve-chrome-focused', 'data-sve-global-focused', 'data-sve-component-focused', 'data-sve-component-dim'];

const elementOf = (node) => (node?.nodeType === 1 ? node : node?.parentElement || null);

/**
 * @param {Window} win  the Control Panel window
 * @param {{ page: () => Document|null, onState: () => void }} canvas
 *   `onState` when the marks on the real page's elements changed: read the page again
 */
export function canvasFocus(win, { page, onState }) {
  let real = null;
  let observer = null;
  let asked = null;
  /** Each clone's markup as last copied, by the bridge's frame id. */
  const copied = new Map();

  const realView = () => real?.defaultView || null;

  /** What the real preview is inside now: 'header' | 'footer' | 'global' | 'component' | null. */
  function inside() {
    const c = real?.documentElement?.classList;

    if (!c) {
      return null;
    }

    if (c.contains('sve-chrome-focus-header')) {
      return 'header';
    }

    if (c.contains('sve-chrome-focus-footer')) {
      return 'footer';
    }

    if (c.contains('sve-global-focus')) {
      return 'global';
    }

    return c.contains('sve-component-focus') ? 'component' : null;
  }

  function classes() {
    const doc = page();
    const from = real?.documentElement;

    if (!doc || !from) {
      return;
    }

    const want = [...from.classList].filter((name) => FOCUS_CLASS.test(name));
    const root = doc.documentElement;

    [...root.classList].filter((name) => FOCUS_CLASS.test(name) && !want.includes(name)).forEach((name) => root.classList.remove(name));
    want.forEach((name) => root.classList.add(name));
  }

  /** The bridge's focus rules, in the canvas's own sheet on <html> (the head is the page's, morphed). */
  function css() {
    const doc = page();

    if (!doc || !real) {
      return;
    }

    let text = '';

    try {
      const sheet = real.getElementById(BRIDGE_STYLES_ID)?.sheet;

      text = [...(sheet?.cssRules || [])]
        .filter((rule) => rule.selectorText && FOCUS_RULE.test(rule.selectorText))
        .map((rule) => rule.cssText)
        .join('\n');
    } catch {
      text = '';
    }

    let style = doc.getElementById(CSS_ID);

    if (!style) {
      style = doc.createElement('style');
      style.id = CSS_ID;
      doc.documentElement.append(style);
    }

    if (style.textContent !== text) {
      style.textContent = text;
    }
  }

  function layerIn(doc) {
    let layer = doc.getElementById(LAYER_ID);

    if (!layer) {
      layer = doc.createElement('div');
      layer.id = LAYER_ID;
      layer.setAttribute('data-sve-ui', '');
      doc.documentElement.append(layer);
    }

    return layer;
  }

  /** The canvas's own element a frame box of `kind` stands over — the `index`th of its kind. */
  function counterpart(doc, kind, index) {
    if (kind === 'header' || kind === 'footer') {
      return doc.querySelector(`[data-sve-chrome="${kind}"]`);
    }

    const attr = kind === 'component' ? 'data-sve-component-focused' : 'data-sve-global-focused';

    return doc.querySelectorAll(`[${attr}]`)[index] || null;
  }

  /** The bridge's frame boxes, cloned onto the canvas as they are drawn. */
  function frames() {
    const doc = page();

    if (!doc) {
      return;
    }

    const layer = layerIn(doc);
    const boxes = real ? [...real.querySelectorAll(`[${FRAME_ATTR}]`)] : [];
    const ids = new Set(boxes.map((box) => box.id));

    [...layer.children].forEach((clone) => {
      if (!ids.has(clone.dataset.of)) {
        copied.delete(clone.dataset.of);
        clone.remove();
      }
    });

    const seen = {};

    boxes.forEach((box) => {
      const kind = box.getAttribute(FRAME_ATTR);
      let clone = [...layer.children].find((el) => el.dataset.of === box.id);

      if (!clone) {
        clone = doc.createElement('div');
        clone.dataset.of = box.id;
        layer.append(clone);
      }

      if (copied.get(box.id) !== box.innerHTML) {
        copied.set(box.id, box.innerHTML);
        clone.innerHTML = box.innerHTML;
      }

      clone.style.cssText = box.style.cssText;
      clone.setAttribute(FRAME_ATTR, kind);
      clone.dataset.index = String((seen[kind] = (seen[kind] ?? -1) + 1));
    });

    place();
  }

  /** Each clone over its element on the canvas, in the canvas's document coordinates. */
  function place() {
    const doc = page();
    const layer = doc?.getElementById(LAYER_ID);

    if (!layer) {
      return;
    }

    const view = doc.defaultView;

    [...layer.children].forEach((clone) => {
      const el = counterpart(doc, clone.getAttribute(FRAME_ATTR), Number(clone.dataset.index) || 0);
      const r = el?.getBoundingClientRect();

      clone.hidden = !r || (!r.width && !r.height);

      if (!clone.hidden) {
        clone.style.top = `${r.top + view.scrollY}px`;
        clone.style.left = `${r.left + view.scrollX}px`;
        clone.style.width = `${r.width}px`;
        clone.style.height = `${r.height}px`;
      }
    });
  }

  /** The bridge's question, in the Control Panel: its words, its buttons; the answer is its button's click. */
  function ask() {
    const overlay = real?.getElementById(CONFIRM_ID) || null;

    if (asked && asked.of !== overlay) {
      asked.drop();
    }

    if (!overlay || asked) {
      return;
    }

    const card = overlay.firstElementChild;
    const [title, body] = card ? [...card.children] : [];
    const buttons = card ? [...card.querySelectorAll('[data-sve-actions] button')] : [];
    let done = false;

    const finish = (index) => {
      if (done) {
        return;
      }

      done = true;
      asked = null;
      dialog.dismiss();
      buttons[index]?.click();
      // The keys go back to the page, as they are in the preview after its own card in Content: Escape leaves.
      page()?.defaultView?.focus();
    };

    const dialog = openCpOverlay(win.document, ChoiceDialog, {
      title: title?.textContent || '',
      body: body?.textContent || '',
      buttons: buttons.map((btn, i) => ({ value: String(i), label: btn.textContent, variant: i === buttons.length - 1 ? 'primary' : 'ghost' })),
      onPick: (value) => finish(Number(value)),
      // Escape or the backdrop: the bridge's first button, its Cancel.
      onClose: () => finish(0),
    });

    asked = {
      of: overlay,
      drop() {
        if (!done) {
          done = true;
          dialog.dismiss();
        }

        asked = null;
      },
    };
  }

  function sync() {
    classes();
    frames();
    ask();
  }

  /** A click on `el` in the real preview: the bridge's handlers take it as one in Content. */
  function hand(el) {
    const view = realView();

    if (el && view) {
      el.dispatchEvent(new view.MouseEvent('click', { bubbles: true, cancelable: true, view }));
    }
  }

  /**
   * A click on the canvas the bridge would decide in Content. True when it
   * was one — the canvas does nothing more with it.
   */
  function click(event) {
    const target = elementOf(event.target);

    if (!target || !real) {
      return false;
    }

    // Save / Close on a frame: the bridge's own.
    const chip = target.closest(`#${LAYER_ID} [${SAVE_ATTR}], #${LAYER_ID} [${CLOSE_ATTR}]`);

    if (chip) {
      const box = real.getElementById(chip.closest(`#${LAYER_ID} > *`)?.dataset.of || '');

      box?.querySelector(chip.hasAttribute(SAVE_ATTR) ? `[${SAVE_ATTR}]` : `[${CLOSE_ATTR}]`)?.click();

      return true;
    }

    // The canvas's own controls (the +, the section's toolbar, the frame's label) are not the page.
    if (target.closest('[data-sve-ui]')) {
      return false;
    }

    const now = inside();

    if (now === 'header' || now === 'footer') {
      if (target.closest(`[data-sve-chrome="${now}"]`)) {
        return false;
      }

      hand(real.body);

      return true;
    }

    if (now === 'global') {
      if (target.closest('[data-sve-global-focused]')) {
        return false;
      }

      hand(real.body);

      return true;
    }

    // Stepping in: the header or the footer (where the site lets it be edited), a global section.
    const half = target.closest('[data-sve-chrome]');
    const kind = half?.getAttribute('data-sve-chrome');

    if (half && !real.documentElement.classList.contains(`sve-chrome-off-${kind}`)) {
      const el = real.querySelector(`[data-sve-chrome="${CSS.escape(kind)}"]`);

      if (el) {
        hand(el);

        return true;
      }
    }

    const global = target.closest('[data-sve-global]');

    if (global) {
      const el = real.querySelector(`[data-sve-global="${CSS.escape(global.getAttribute('data-sve-global'))}"]`);

      if (el) {
        hand(el);

        return true;
      }
    }

    return false;
  }

  /** Escape while inside something: the bridge's way out. */
  function key(event) {
    if (event.key !== 'Escape' || !real || (!inside() && !real.querySelector(`[${FRAME_ATTR}]`))) {
      return;
    }

    const view = realView();

    event.preventDefault();
    event.stopPropagation();
    real.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true }));
  }

  /** The real preview's document, as the canvas binds it (canvas.js bindReal). */
  function bind(doc) {
    unbind();
    real = doc;

    if (!real?.documentElement) {
      return;
    }

    observer = new win.MutationObserver((records) => {
      let state = false;
      let frame = false;

      for (const record of records) {
        const target = elementOf(record.target);

        if (record.type === 'attributes' && STATE_ATTRS.includes(record.attributeName)) {
          state = true;
        } else if (target === real.documentElement || target?.closest?.(`[${FRAME_ATTR}], #${CONFIRM_ID}`)) {
          frame = true;
        }
      }

      if (frame || state) {
        sync();
      }

      if (state) {
        onState();
      }
    });
    observer.observe(real.documentElement, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class', 'style', ...STATE_ATTRS],
    });
    css();
    sync();
  }

  function unbind() {
    observer?.disconnect();
    observer = null;
    asked?.drop();
    real = null;
  }

  return {
    bind,
    unbind,
    click,
    key,
    /** After the canvas painted or read the page: its marks, the sheet and the frames in place again. */
    refresh() {
      css();
      sync();
    },
    place,
    stop() {
      unbind();
      page()?.getElementById(LAYER_ID)?.remove();
      copied.clear();
    },
  };
}
