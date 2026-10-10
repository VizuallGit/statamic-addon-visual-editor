/**
 * An Alpine component's boolean set in the preview.
 *
 * A dialog that opens on `open: true`, a menu on `menuOpen`: what is behind
 * them cannot be built while they are shut, and the only way to see it used
 * to be writing `true` into the file and putting `false` back before going
 * live. The tree's Alpine icon sets the boolean on the component's own data
 * instead. The state lives in the bridge, keyed by section — or by the part
 * of the page's frame the file draws: the header, the footer, the layout —
 * by which of its `[x-data]` elements and by key, so a morph — which redraws
 * the section — is followed by the state put back.
 *
 * Nothing here reaches the file; the site keeps its own defaults.
 */
import { bridgeState } from './state.js';
import { SID_ATTR } from '../lib/ids.js';
import { sidElement } from '../html-pick-align.js';

const COMPONENT = '[x-data]';
/**
 * The attribute a half of the site frame carries in the preview (`CHROME_ATTR`
 * in global-sections.js). Spelled here, not imported: mirror.js bundles its
 * own copy of everything this module imports, and global-sections.js would
 * bring half the bridge into every breakpoint frame.
 */
const CHROME_ATTR = 'data-sve-chrome';
/** The parts of the page's frame a state may name in place of a section. */
const FRAME_PARTS = ['header', 'footer', 'layout'];

/**
 * The Alpine components a state speaks of: those of the section `uid` names,
 * the section's own root included — a section may be one component. A uid
 * may be a block inside the section that holds no component itself; then the
 * nearest marked ancestor with one is taken. A state that names nothing with
 * a component in it means nothing.
 */
function componentsOf(doc, uid, uids = []) {
  let scope = sidElement(doc, uid, uids);

  while (scope && !scope.matches(COMPONENT) && !scope.querySelector(COMPONENT)) {
    scope = scope.parentElement?.closest?.(`[${SID_ATTR}]`) || null;
  }

  if (!scope) {
    return [];
  }

  const inside = [...scope.querySelectorAll(COMPONENT)];

  return scope.matches(COMPONENT) ? [scope, ...inside] : inside;
}

/**
 * The Alpine components of a part of the page's frame, in document order —
 * the order the tree counts that part's file in.
 *
 * A half is the element carrying `data-sve-chrome="header"` (or `footer`).
 * The file the dock opens for it is the partial that writes that element
 * (ScriptChrome::templates), and the tree counts that file from the element
 * too, so it comes first when it is a component itself. (A site whose marked
 * wrapper picks a styled partial through `{half}_style` opens the styled
 * partial: the wrapper's own components come first here and not in the file.)
 * A half the site does not draw has no components.
 *
 * The layout owns what is neither a page section nor a half: `<html>` and
 * `<body>` when they are components, and every component in the body that
 * stands outside both.
 */
function frameComponentsOf(doc, part) {
  if (part === 'layout') {
    return [doc.documentElement, doc.body, ...doc.body.querySelectorAll(COMPONENT)].filter(
      (el) => el.matches(COMPONENT) && !el.closest(`[${CHROME_ATTR}]`) && !el.closest(`[${SID_ATTR}]`)
    );
  }

  const scope = doc.querySelector(`[${CHROME_ATTR}="${part}"]`);

  if (!scope) {
    return [];
  }

  const inside = [...scope.querySelectorAll(COMPONENT)];

  return scope.matches(COMPONENT) ? [scope, ...inside] : inside;
}

/** The components one state speaks of. */
function targetsOf(doc, item) {
  const components = item.chrome ? frameComponentsOf(doc, item.chrome) : componentsOf(doc, item.uid, item.uids);

  // A loop draws more components than the file has tags: the nth past the
  // end means every one of them.
  return item.nth === null || item.nth >= components.length
    ? components
    : [components[item.nth]].filter(Boolean);
}

/**
 * The component's data, when it has this key. No Alpine on the page, an
 * element Alpine has not started yet, a key the component does not have: no
 * data, and nothing is set.
 */
function dataOf(win, el, key) {
  const data = win.Alpine?.$data?.(el);

  return data && key in data ? data : null;
}

/**
 * `chrome` names a part of the page's frame — the dock's file is the header,
 * the footer or the layout, none of which is a section with a uid — and is
 * then the state's scope; otherwise `uid`/`uids` name the section.
 */
export function setAlpineState(win, data) {
  const chrome = FRAME_PARTS.includes(data.chrome) ? data.chrome : '';
  const uid = !chrome && typeof data.uid === 'string' ? data.uid : '';
  const uids = !chrome && Array.isArray(data.uids) ? data.uids.filter((id) => typeof id === 'string') : [];
  const nth = Number.isInteger(data.nth) ? data.nth : null;
  const key = typeof data.key === 'string' ? data.key : '';

  if (!key || typeof data.value !== 'boolean') {
    return;
  }

  const item = { uid, uids, chrome, nth, key, value: data.value };
  const targets = targetsOf(win.document, item);
  const reached = new Set(targets);

  // The last word on a component's key wins, whatever name it came under.
  // The panel names the section it has open, and after a trip through
  // another section and back that name can differ from the one the state
  // was set with; a state left behind under the old name would put the old
  // value back on the next morph.
  bridgeState.alpineStates.forEach((other, name) => {
    if (other.key === key && targetsOf(win.document, other).some((el) => reached.has(el))) {
      bridgeState.alpineStates.delete(name);
    }
  });

  if (data.on) {
    // A part of the frame under its own prefix: no section's uid can be it.
    bridgeState.alpineStates.set(`${chrome ? `chrome:${chrome}` : uid}:${nth === null ? '*' : nth}:${key}`, item);
  }

  // `on: false` carries the file's own value: the component goes back to it.
  targets.forEach((el) => {
    const state = dataOf(win, el, key);

    if (state) {
      state[key] = item.value;
    }
  });
}

/**
 * Every state put back — after a morph. The morph keeps a component's data
 * but redraws its markup to the server's: a dialog loses the `open` attribute
 * its `x-effect` gave it, an `innerHTML` the effect copied in is gone. The
 * data still says `true`, so setting `true` again changes nothing and nothing
 * runs. A value already in place is therefore flipped and set back on the
 * next microtask — after Alpine's own flush — so every `x-effect` and `$watch`
 * built on it sees a change and builds again.
 */
export function applyAlpineStates(win) {
  for (const item of bridgeState.alpineStates.values()) {
    for (const el of targetsOf(win.document, item)) {
      const state = dataOf(win, el, item.key);

      if (!state) {
        continue;
      }

      if (state[item.key] !== item.value) {
        state[item.key] = item.value;
        continue;
      }

      state[item.key] = !item.value;
      win.queueMicrotask(() => {
        state[item.key] = item.value;
      });
    }
  }
}

/**
 * The site's Alpine and the bridge are both deferred scripts, in whichever
 * order the page has them, and the remembered states are asked for when the
 * bridge boots. States that arrived first found no component data; Alpine's
 * own `alpine:initialized` is the moment there is some.
 */
export function watchAlpineStart(win) {
  win.document.addEventListener('alpine:initialized', () => applyAlpineStates(win), { once: true });
}
