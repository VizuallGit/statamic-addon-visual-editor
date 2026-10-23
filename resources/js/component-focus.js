/**
 * Two things the preview needs to know about components.
 *
 * 1. Which component the dock has open, so the page around it can fade —
 *    "you are inside this one" (see `syncComponentFocus`).
 * 2. Where every component on the open template renders, so right-clicking one
 *    in the preview can open it (see `syncComponentMap`).
 *
 * Both rest on the same fact: in Live Preview the server marks the first
 * element of every component's render with `data-sve-component="<src>"`
 * (`componentSelector`). Nothing is fetched and nothing is read off a file —
 * the preview is asked for the mark, the way a section is asked for by its
 * `data-sid`.
 */
import { on, ask } from './cp/bus.js';
import { sendToPreview } from './cp.js';
import { findPartials } from './dock-partials.js';
import { componentSelector, componentSrcFromType } from './component-signature.js';
import { MSG, SOURCE } from './lib/protocol.js';

let mapWin = null;
let mapTimer = 0;
let mapBound = false;

export function syncComponentFocus(win) {
  const src = componentSrcFromType(ask('dock:current-type'));
  const selector = componentSelector(src);

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
export function syncComponentMap(win) {
  const html = ask('dock:html');
  const sources = [...new Set((typeof html === 'string' ? findPartials(html) : []).map((item) => item.src))];

  sendToPreview(
    {
      source: SOURCE,
      type: MSG.SVE_COMPONENT_MAP,
      items: sources
        .map((src) => ({ src, name: String(src).split('/').pop(), selector: componentSelector(src) }))
        .filter((item) => item.selector),
    },
    win
  );
}

/**
 * Keep the map current while the dock is edited — adding a component should
 * make it right-clickable without a reload. Debounced: the dock changes on
 * every keystroke.
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

    mapWin.clearTimeout(mapTimer);
    mapTimer = mapWin.setTimeout(() => syncComponentMap(mapWin), 400);
  });
}
