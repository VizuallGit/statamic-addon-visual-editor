/**
 * The small «+» at the left edge of Live Preview's size buttons: one more
 * screen size for this site, without a trip to the settings screen.
 *
 * Drawn the way the top bar's group «+» is drawn (toolbar-visibility.js):
 * half out over the group's edge, in the gap, shown while the group is
 * hovered or has focus. This file only puts the button there; what a click
 * opens is ./breakpoint-add.js, imported on that click and not before —
 * nothing of the popover exists until someone wants it.
 *
 * Only for a user who may edit the addon's settings (`sveBreakpointsEditable`
 * from ControlPanelScript): the size is written into those settings, and a
 * button that would be refused on save is a button that lies.
 */
import { t } from '../lib/i18n.js';
import { HEADER_SURFACE, LP_PREVIEW_CHROME_ID } from '../lib/ids.js';

/** On the «+»: nothing else carries it. */
export const BP_ADD_ATTR = 'data-sve-bp-add';

const STYLE_ID = '__sve-bp-add-style';

const ADD_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

/**
 * Same place and same look as the top bar's group «+» (toolbar-visibility.js),
 * mirrored to the left edge. Idle it is the group's own grey
 * (`--sve-toolbar-ring`: the group surface mixed over the header, set on the
 * header by header-toolbar.js) with the same thin ring; hovered, focused or
 * open it is primary without the ring.
 */
function css() {
  const group = `#${LP_PREVIEW_CHROME_ID} [data-sve-devices]`;
  const add = `[${BP_ADD_ATTR}]`;

  return [
    `${group}{position:relative}`,
    `${group}>${add}{position:absolute;top:50%;left:-.5rem;transform:translateY(-50%);width:1rem;height:1rem;box-sizing:border-box;` +
      'display:inline-flex;align-items:center;justify-content:center;padding:0;border:none;border-radius:50%;cursor:pointer;' +
      `color:currentColor;background:var(--sve-toolbar-ring,${HEADER_SURFACE});box-shadow:0 0 0 1px rgba(128,128,128,.35);` +
      'opacity:0;pointer-events:none;transition:opacity .12s;z-index:1}',
    `${group}:hover>${add},${group}:focus-within>${add},${group}>${add}:focus-visible,${group}>${add}[aria-expanded="true"]{opacity:1;pointer-events:auto}`,
    `${group}>${add}:hover,${group}>${add}:focus-visible,${group}>${add}[aria-expanded="true"]{background:var(--theme-color-primary,#4f46e5);color:#fff;box-shadow:none}`,
  ].join('\n');
}

function ensureStyle(doc) {
  if (doc.getElementById(STYLE_ID)) {
    return;
  }

  const style = doc.createElement('style');

  style.id = STYLE_ID;
  style.textContent = css();
  doc.head.appendChild(style);
}

export function breakpointsEditable(win) {
  try {
    return !!win.Statamic?.$config?.get?.('sveBreakpointsEditable');
  } catch {
    return false;
  }
}

/**
 * Put the «+» in the devices group, once. Called on every chrome pass — the
 * group is emptied and redrawn whenever the list of sizes changes, and the
 * button has to come back with the buttons.
 */
export function ensureBreakpointAddButton(win, devicesEl) {
  if (!devicesEl || !breakpointsEditable(win) || devicesEl.querySelector(`[${BP_ADD_ATTR}]`)) {
    return;
  }

  const doc = win.document;

  ensureStyle(doc);

  const btn = doc.createElement('button');
  const label = t(win, 'bp_add_tip');

  btn.type = 'button';
  btn.setAttribute(BP_ADD_ATTR, '');
  btn.title = label;
  btn.setAttribute('aria-label', label);
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = ADD_ICON_SVG;
  btn.addEventListener('click', (event) => {
    event.stopPropagation();
    import('./breakpoint-add.js').then((m) => m.toggleBreakpointAdd(win, btn));
  });

  devicesEl.appendChild(btn);
}
