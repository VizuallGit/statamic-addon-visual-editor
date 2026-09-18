/**
 * Two things the preview needs to know about components.
 *
 * 1. Which component the dock has open, so the page around it can fade —
 *    "you are inside this one" (see `syncComponentFocus`).
 * 2. Where every component on the open template renders, so right-clicking one
 *    in the preview can open it (see `syncComponentMap`).
 *
 * Both rest on the same fact: a partial leaves no mark of its own in the
 * rendered page, so a component is found by its root signature. That is read
 * from the component's own file, which means the file has to be fetched —
 * cached here, because a template names the same few components over and over.
 */
import { on, ask } from './cp/bus.js';
import { sendToPreview } from './cp.js';
import { findPartials } from './dock-partials.js';
import { componentSrcFromType, rootSelector } from './component-signature.js';
import { MSG, SOURCE } from './lib/protocol.js';

const selectors = new Map();

let mapWin = null;
let mapTimer = 0;
let mapGen = 0;
let mapBound = false;

/** The component's own HTML, as the dock would load it. Null when it is gone. */
async function componentHtml(win, src) {
  if (selectors.has(src)) {
    return selectors.get(src);
  }

  const type = `view:partials/${src}`;
  let selector = null;

  try {
    const res = await win.fetch(`/!/sve/section-template?type=${encodeURIComponent(type)}`, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });

    if (res.ok) {
      const data = await res.json();

      selector = typeof data.html === 'string' ? rootSelector(data.html) : null;
    }
  } catch {
    // A partial the site renders some other way is simply not pointed at.
  }

  selectors.set(src, selector);

  return selector;
}

/** A component's file changed, so its root may have. */
export function forgetComponent(src) {
  if (src) {
    selectors.delete(src);
  } else {
    selectors.clear();
  }
}

export function syncComponentFocus(win) {
  const src = componentSrcFromType(ask('dock:current-type'));
  const html = src ? ask('dock:html') : '';
  const selector = src && typeof html === 'string' ? rootSelector(html) : null;

  sendToPreview(
    {
      source: SOURCE,
      type: MSG.SVE_COMPONENT_FOCUS,
      on: !!selector,
      name: src ? String(src).split('/').pop() : '',
      selector: selector || '',
    },
    win
  );
}

/**
 * Tell the preview where each component on the open template renders.
 *
 * Sent even when empty: a template that lost its last component has to stop
 * offering "open component" on what is left.
 */
export async function syncComponentMap(win) {
  const gen = ++mapGen;
  const html = ask('dock:html');
  const sources = [
    ...new Set(
      (typeof html === 'string' ? findPartials(html) : []).map((item) => item.src).filter(Boolean)
    ),
  ];

  const found = await Promise.all(sources.map((src) => componentHtml(win, src)));

  // A newer sync started while these were in flight; its answer is the current one.
  if (gen !== mapGen) {
    return;
  }

  sendToPreview(
    {
      source: SOURCE,
      type: MSG.SVE_COMPONENT_MAP,
      items: sources
        .map((src, i) => ({ src, name: src.split('/').pop(), selector: found[i] }))
        .filter((item) => item.selector),
    },
    win
  );
}

/**
 * Keep the map current while the dock is edited — adding a component should
 * make it right-clickable without a reload. Debounced: the dock changes on
 * every keystroke, and this reads files.
 */
export function watchComponentMap(win) {
  mapWin = win;

  if (mapBound) {
    return;
  }

  mapBound = true;

  on('dock:html-changed', () => {
    if (!mapWin) {
      return;
    }

    // Editing a component can change the root it is recognised by, so the
    // cached signature for the open one is dropped before the map is rebuilt.
    forgetComponent(componentSrcFromType(ask('dock:current-type')));

    mapWin.clearTimeout(mapTimer);
    mapTimer = mapWin.setTimeout(() => void syncComponentMap(mapWin), 400);
  });
}
