/**
 * Where a panel stands in Vizuall Build, as plain data: no DOM, no storage.
 *
 * Owner: panel zones (panel-zones.js reads and writes the stored list).
 * May import: nothing.
 *
 * A key is a pane of a sidebar (`html_tree`, `theme`, …), the Build panel
 * (`build`) or one of the dock's panes (`code_html`, …). `code` means the whole
 * dock when something is moved, and is never stored.
 */
const ZONES = ['left', 'right', 'bottom'];
export const CODE_PANES = ['html', 'css', 'alpine', 'js'];
export const CODE_KEYS = CODE_PANES.map((pane) => `code_${pane}`);

/** The panes that stand in a zone without being tools you open: no pin, no close. */
export function isFixedPane(key) {
  return key === 'build' || CODE_KEYS.includes(key);
}

export function parseZones(raw) {
  try {
    const list = JSON.parse(raw || 'null');

    return list && typeof list === 'object' && !Array.isArray(list) ? list : {};
  } catch {
    return {};
  }
}

/** Nothing stored is today's editor: the Build panel left, the dock below, the tools right. */
export function zoneOf(zones, key) {
  if (ZONES.includes(zones[key])) {
    return zones[key];
  }

  if (key === 'build') {
    return 'left';
  }

  return CODE_KEYS.includes(key) ? 'bottom' : 'right';
}

export function keysOf(key) {
  return key === 'code' ? CODE_KEYS : [key];
}

export function withZone(zones, key, zone) {
  const next = { ...zones };

  keysOf(key).forEach((one) => {
    next[one] = zone;
  });

  return next;
}

/** The dock stands as one piece under the preview only when all of it is below, alone. */
export function codeStaysTogether(zones, othersBelow) {
  return !othersBelow && CODE_KEYS.every((key) => zoneOf(zones, key) === 'bottom');
}

/**
 * The stored order with `keys` put before `before` among `inZone`, the panes the
 * target zone holds. The other zones' panes keep their places after them.
 */
export function orderWith(order, inZone, keys, before) {
  const here = inZone.filter((key) => !keys.includes(key));
  const at = before ? here.indexOf(before) : -1;

  here.splice(at < 0 ? here.length : at, 0, ...keys);

  return [...here, ...order.filter((key) => !here.includes(key))];
}

function inside(point, rect) {
  return !!rect && point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
}

/**
 * Which zone the pointer is over, and which pane the dropped one goes before.
 *
 * @param {{x:number,y:number}} point
 * @param {Object<string,{rect:object,row?:boolean,panes?:Array<{key:string,rect:object}>}>} areas
 * @returns {{zone:string,before:string}|null} null over the preview: nothing moves
 */
export function dropTarget(point, areas) {
  for (const zone of ZONES) {
    const area = areas[zone];

    if (!inside(point, area?.rect)) {
      continue;
    }

    const next = (area.panes || []).find(({ rect }) =>
      area.row ? point.x < rect.left + (rect.right - rect.left) / 2 : point.y < rect.top + (rect.bottom - rect.top) / 2
    );

    return { zone, before: next?.key || '' };
  }

  return null;
}
