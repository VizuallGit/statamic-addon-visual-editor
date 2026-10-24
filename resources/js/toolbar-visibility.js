/**
 * The Live Preview topbar as this user wants it: which icons show, how they
 * are grouped and ordered, and the presets of their own.
 *
 * The row is drawn by cp-shell/header-toolbar.js, and its passes re-create
 * buttons and write their inline `display` over and over. So two things are
 * kept apart here:
 *
 *   - Which icons SHOW is one stylesheet. `!important` in a sheet outranks
 *     every inline style a pass sets, and a button a pass has just made is
 *     hidden by its `data-tab` before anything paints. "Open" below presses
 *     the real button, so a hidden tool opens the one way it always did.
 *
 *   - WHERE icons stand is the DOM: one box per group
 *     (`[data-sve-toolbar-group]`), the tools inside it in the user's order,
 *     a grip at the group's top-left corner and a small «+» at its right edge;
 *     after the last box, a square whose «+» starts a new group. A pass that
 *     makes a button hands it to placeToolbarButton; syncToolbarGroups then
 *     puts every tool where the layout says — and only moves a node that is
 *     not already there, so the observer that re-runs the passes has nothing
 *     to react to.
 *
 * Page settings is always first, always shown, and drawn in a box of its own,
 * apart from the groups. A hidden tool keeps its place in its group: a preset
 * that shows it again finds it where the user put it. A group is never empty:
 * the new-group square makes one with the tool picked for it, and a group
 * whose last tool moves out is gone.
 *
 * The Live Preview settings menu (⋮ → Top bar), the drag in the bar — of a
 * tool or a whole group (toolbar-drag.js) — and the two «+» (toolbar-add-menu.js)
 * are the writers. A tool this user has no access to never gets a button, so
 * it never reaches a list.
 *
 * May import: chrome-prefs.js and lib/ — header-toolbar.js imports this file.
 */
import { chromeGet, chromeRemove, chromeSet } from './chrome-prefs.js';
import {
  HEADER_FRAME_PREFIX,
  HEADER_ICON_HOVER,
  HEADER_SURFACE,
  HEADER_TOOLBAR_ID,
  LP_CHROME_H,
  LP_CONTROL_PAD,
  LP_ICON_IDLE_OPACITY,
  LP_TOOLBAR_GAP,
  TOOLBAR_ADD_ATTR,
  TOOLBAR_GRIP_ATTR,
  TOOLBAR_GROUP_ATTR,
  TOOLBAR_GROUPS_KEY,
  TOOLBAR_HIDDEN_KEY,
  TOOLBAR_NEW_GROUP_ATTR,
  TOOLBAR_ORDER_KEY,
  TOOLBAR_PRESET_KEY,
  TOOLBAR_PRESET_PANES_KEY,
  TOOLBAR_PRESETS_KEY,
} from './lib/ids.js';
import { t } from './lib/i18n.js';
import { cleanPaneChoices, cleanPreset } from './lib/toolbar-presets.js';
import {
  cleanGroups,
  deleteGroup,
  groupsFromOrder,
  layoutGroups,
  moveGroup,
  moveTool,
  moveToolToNewGroup,
  renameGroup,
} from './lib/toolbar-groups.js';

const STYLE_ID = '__sve-toolbar-hidden';

/** On a hidden tool's button (and frame) while it is open from the menu. */
export const PEEK_ATTR = 'data-sve-peek';

/** Page settings: the way to the page's own fields. Never hidden, never moved. */
const ALWAYS_SHOWN = ['settings'];

const TOOL_KEY = /^[a-z][a-z0-9_]*$/;

/** The gap between two icons inside a group, as header-toolbar.js draws the row. */
const ROW_GAP = 4;

const ADD_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

const GRIP_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
  '<circle cx="9" cy="6" r="2"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/>' +
  '<circle cx="15" cy="12" r="2"/><circle cx="9" cy="18" r="2"/><circle cx="15" cy="18" r="2"/></svg>';

/** The new-group square's «+»: a tool icon's size and stroke, as the groups draw them. */
const NEW_GROUP_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="2" stroke-linecap="round" aria-hidden="true" style="display:block"><path d="M12 5v14M5 12h14"/></svg>';

const bar = `#${HEADER_TOOLBAR_ID}`;
const group = `${bar}>[${TOOLBAR_GROUP_ATTR}]`;
const add = `[${TOOLBAR_ADD_ATTR}]`;
const grip = `[${TOOLBAR_GRIP_ATTR}]`;
const newGroup = `${bar}>[${TOOLBAR_NEW_GROUP_ATTR}]`;

/**
 * The row's own surface comes off: each group draws its own, one topbar gap
 * apart, and Page settings stands in front as a full square of its own — grey
 * at rest, the whole of it blue when on. Paint only: the buttons stay what
 * the passes made them, their inline size overruled here, not rewritten.
 *
 * The new-group square stands outside the row's flow, just right of it, so
 * the header lays out as it did; its strip over the gap keeps the row hovered
 * on the way from the last group to the square.
 */
function frameCss() {
  const settings = `${bar}>button[data-tab="settings"]`;
  const idle = `${settings}:not([aria-pressed="true"])`;
  const manyGroups = `${bar}:has(>[${TOOLBAR_GROUP_ATTR}]~[${TOOLBAR_GROUP_ATTR}])`;

  return [
    `${bar}{position:relative;background:transparent!important;padding:0!important;gap:${LP_TOOLBAR_GAP}px!important}`,
    `${settings}{flex-shrink:0;width:${LP_CHROME_H}px!important;height:${LP_CHROME_H}px!important;margin:0!important;border-radius:.5rem!important;opacity:1!important}`,
    `${idle}{background:${HEADER_SURFACE}!important}`,
    `${idle}:hover{background:${HEADER_ICON_HOVER}!important}`,
    `${idle} svg{opacity:${LP_ICON_IDLE_OPACITY}}`,
    `${group}{position:relative;display:inline-flex;align-items:center;box-sizing:border-box;height:${LP_CHROME_H}px;` +
      `padding:${LP_CONTROL_PAD}px;gap:${ROW_GAP}px;border-radius:.5rem;background:${HEADER_SURFACE}}`,
    // The «+»: half out over the group's right edge, in the gap to the next.
    // Shown on hover or focus within the group, and when it has focus itself.
    `${group}>${add}{position:absolute;top:50%;right:-.5rem;transform:translateY(-50%);width:1rem;height:1rem;box-sizing:border-box;` +
      'display:inline-flex;align-items:center;justify-content:center;padding:0;border:none;border-radius:50%;cursor:pointer;' +
      `color:currentColor;background:var(--sve-toolbar-ring,${HEADER_SURFACE});box-shadow:0 0 0 1px rgba(128,128,128,.35);` +
      'opacity:0;pointer-events:none;transition:opacity .12s;z-index:1}',
    `${group}:hover>${add},${group}:focus-within>${add},${group}>${add}:focus-visible{opacity:1;pointer-events:auto}`,
    `${group}>${add}:hover,${group}>${add}:focus-visible{background:var(--theme-color-primary,#4f46e5);color:#fff;box-shadow:none}`,
    // The grip: the same small disc, on the top-left corner. Only where there
    // is another group to move past.
    `${group}>${grip}{position:absolute;top:-.375rem;left:-.375rem;width:1rem;height:1rem;box-sizing:border-box;` +
      'display:inline-flex;align-items:center;justify-content:center;padding:0;border:none;border-radius:50%;cursor:grab;' +
      `color:currentColor;background:var(--sve-toolbar-ring,${HEADER_SURFACE});box-shadow:0 0 0 1px rgba(128,128,128,.35);` +
      'opacity:0;pointer-events:none;transition:opacity .12s;z-index:1}',
    `${manyGroups}>[${TOOLBAR_GROUP_ATTR}]:hover>${grip},${manyGroups}>[${TOOLBAR_GROUP_ATTR}]>${grip}:focus-visible{opacity:1;pointer-events:auto}`,
    `${group}>${grip}:hover,${group}>${grip}:focus-visible{background:var(--theme-color-primary,#4f46e5);color:#fff;box-shadow:none}`,
    `${bar}[data-sve-dragging-group],${bar}[data-sve-dragging-group] ${grip}{cursor:grabbing}`,
    // The new-group square: a group's height and surface, 1:1, a gap's strip in front.
    `${newGroup}{position:absolute;top:0;left:100%;display:flex;box-sizing:border-box;height:${LP_CHROME_H}px;padding-left:${LP_TOOLBAR_GAP}px;` +
      'opacity:0;pointer-events:none;transition:opacity .12s}',
    `${bar}:hover>[${TOOLBAR_NEW_GROUP_ATTR}],${bar}[data-sve-dragging]>[${TOOLBAR_NEW_GROUP_ATTR}],${newGroup}:has(>button:focus-visible){opacity:1;pointer-events:auto}`,
    `${newGroup}>button{flex-shrink:0;box-sizing:border-box;width:${LP_CHROME_H}px;height:${LP_CHROME_H}px;margin:0;padding:0;border:none;` +
      `display:inline-flex;align-items:center;justify-content:center;border-radius:.5rem;cursor:pointer;color:currentColor;background:${HEADER_SURFACE}}`,
    `${newGroup}>button:hover,${newGroup}>button:focus-visible{background:${HEADER_ICON_HOVER}}`,
    `${newGroup}>button svg{opacity:${LP_ICON_IDLE_OPACITY}}`,
  ];
}

function validKey(key) {
  return typeof key === 'string' && TOOL_KEY.test(key) && !ALWAYS_SHOWN.includes(key);
}

function readKeys(win, storageKey) {
  let list;

  try {
    list = JSON.parse(chromeGet(win, storageKey) || '[]');
  } catch {
    list = [];
  }

  return Array.isArray(list) ? [...new Set(list.filter(validKey))] : [];
}

function writeKeys(win, storageKey, keys) {
  if (keys.length) {
    chromeSet(win, storageKey, JSON.stringify(keys));
  } else {
    chromeRemove(win, storageKey);
  }
}

/** The tab keys this user left out, as stored. */
export function readHiddenTools(win) {
  return readKeys(win, TOOLBAR_HIDDEN_KEY);
}

/**
 * This user's groups, as stored and cleaned; [] = one group, drawn order.
 * The flat order from before groups is carried over once, as one group.
 */
export function readToolbarGroups(win) {
  const raw = chromeGet(win, TOOLBAR_GROUPS_KEY);

  if (raw != null) {
    try {
      return cleanGroups(JSON.parse(raw));
    } catch {
      return [];
    }
  }

  const carried = groupsFromOrder(readKeys(win, TOOLBAR_ORDER_KEY));

  if (carried.length) {
    writeToolbarGroups(win, carried);
    chromeRemove(win, TOOLBAR_ORDER_KEY);
  }

  return carried;
}

export function writeToolbarGroups(win, groups) {
  const clean = cleanGroups(groups);

  if (clean.length) {
    chromeSet(win, TOOLBAR_GROUPS_KEY, JSON.stringify(clean));
  } else {
    chromeRemove(win, TOOLBAR_GROUPS_KEY);
  }
}

/** Has this user arranged the bar — is there something for Reset groups to undo? */
export function toolbarGrouped(win) {
  return readToolbarGroups(win).length > 0;
}

/**
 * The sheet: the frame (groups, Page settings' box, the «+»), always; then
 * the hidden icons — a framed tool (pages, globals) goes as a whole, as its
 * control sits in the frame and a control without its icon is a stray; then
 * a group with nothing left to see goes too — every tool in it hidden here,
 * or by the pass that has nothing for it on this page (Patterns without a
 * page builder) — unless one is peeking.
 */
export function toolbarCss({ hidden = [] } = {}) {
  const rules = frameCss();
  const keys = hidden.filter(validKey);

  keys
    .map(
      (key) =>
        `${bar} button[data-tab="${key}"]:not([${PEEK_ATTR}]),` +
        `#${HEADER_FRAME_PREFIX}${key}:not([${PEEK_ATTR}]){display:none!important}`
    )
    .forEach((rule) => rules.push(rule));

  const notHiddenButton = keys.map((key) => `:not([data-tab="${key}"])`).join('');
  const notHiddenFrame = keys.map((key) => `:not(#${HEADER_FRAME_PREFIX}${key})`).join('');

  rules.push(
    `${group}:not(:has(` +
      `>button[data-tab][${PEEK_ATTR}],>[id^="${HEADER_FRAME_PREFIX}"][${PEEK_ATTR}],` +
      `>button[data-tab]:not([style*="display: none"])${notHiddenButton},` +
      `>[id^="${HEADER_FRAME_PREFIX}"]${notHiddenFrame}` +
      ')){display:none!important}'
  );

  return rules.join('\n');
}

/** Write the sheet for what is stored. */
function syncToolbarSheet(win) {
  const doc = win.document;
  const css = toolbarCss({ hidden: readHiddenTools(win) });
  let style = doc.getElementById(STYLE_ID);

  if (!style) {
    style = doc.createElement('style');
    style.id = STYLE_ID;
    doc.head.appendChild(style);
  }

  if (style.textContent !== css) {
    style.textContent = css;
  }
}

function barEl(win) {
  return win.document.getElementById(HEADER_TOOLBAR_ID);
}

/** The tab keys the row has buttons for, as drawn — Page settings left out. */
function drawnKeys(barNode) {
  return [...new Set([...barNode.querySelectorAll('button[data-tab]')].map((btn) => btn.dataset.tab).filter(validKey))];
}

/** The node that stands for a tool in the row: its frame where it has one, else its button. */
function toolNode(barNode, key) {
  const frame = barNode.querySelector(`#${HEADER_FRAME_PREFIX}${key}`);

  return frame || barNode.querySelector(`button[data-tab="${key}"]`) || null;
}

/** The groups, laid out for the tools the row has: [{ id, name, tools: [key, …] }]. */
export function toolbarLayout(win) {
  const barNode = barEl(win);

  return barNode ? layoutGroups(readToolbarGroups(win), drawnKeys(barNode)) : [];
}

/** The «+» at a group's edge. What it does on click is toolbar-add-menu.js's, bound on the bar. */
function addButton(win, id) {
  const btn = win.document.createElement('button');
  const label = t(win, 'toolbar_add_tip');

  btn.type = 'button';
  btn.setAttribute(TOOLBAR_ADD_ATTR, id);
  btn.title = label;
  btn.setAttribute('aria-label', label);
  btn.innerHTML = ADD_ICON_SVG;

  return btn;
}

/** The grip at a group's corner. The drag and its arrow keys are toolbar-drag.js's, bound on the bar. */
function gripButton(win) {
  const btn = win.document.createElement('button');
  const label = t(win, 'lp_settings_toolbar_group_move');

  btn.type = 'button';
  btn.setAttribute(TOOLBAR_GRIP_ATTR, '');
  btn.title = label;
  btn.setAttribute('aria-label', label);
  btn.innerHTML = GRIP_ICON_SVG;

  return btn;
}

/** The square right of the last group. What its «+» does on click is toolbar-add-menu.js's. */
function newGroupSquare(win) {
  const doc = win.document;
  const square = doc.createElement('div');
  const btn = doc.createElement('button');
  const label = t(win, 'toolbar_drag_new_group');

  square.setAttribute(TOOLBAR_NEW_GROUP_ATTR, '');
  btn.type = 'button';
  btn.title = label;
  btn.setAttribute('aria-label', label);
  btn.innerHTML = NEW_GROUP_ICON_SVG;
  square.appendChild(btn);

  return square;
}

/**
 * Put every tool where the layout says — Page settings first, then one box
 * per group with its tools in order, the grip and the «+» last, then the
 * new-group square — moving only what is not already there. A box whose
 * group is gone is taken out once its tools have been placed elsewhere.
 */
export function syncToolbarGroups(win) {
  const doc = win.document;
  const barNode = barEl(win);

  if (!barNode) {
    return;
  }

  const layout = toolbarLayout(win);
  const settings = barNode.querySelector('button[data-tab="settings"]');

  if (settings && barNode.firstElementChild !== settings) {
    barNode.prepend(settings);
  }

  let cursor = settings && settings.parentElement === barNode ? settings : null;

  layout.forEach((item) => {
    let box = barNode.querySelector(`:scope>[${TOOLBAR_GROUP_ATTR}="${item.id}"]`);

    if (!box) {
      box = doc.createElement('div');
      box.setAttribute(TOOLBAR_GROUP_ATTR, item.id);
      box.appendChild(gripButton(win));
      box.appendChild(addButton(win, item.id));
    }

    // No group name as a tooltip on the box: it showed beside the tool's own
    // tip and read as a second label. The name lives in the rename menu.
    box.removeAttribute('title');

    if (box.parentElement !== barNode || box.previousElementSibling !== cursor) {
      if (cursor) {
        cursor.after(box);
      } else {
        barNode.prepend(box);
      }
    }

    cursor = box;

    let prev = null;

    item.tools.forEach((key) => {
      const node = toolNode(barNode, key);

      if (!node) {
        return;
      }

      if (node.parentElement !== box || node.previousElementSibling !== prev) {
        box.insertBefore(node, prev ? prev.nextElementSibling : box.firstChild);
      }

      prev = node;
    });

    const plus = box.querySelector(`:scope>${add}`);
    const handle = box.querySelector(`:scope>${grip}`);

    if (plus && box.lastElementChild !== plus) {
      box.appendChild(plus);
    }

    if (handle && plus && handle.nextElementSibling !== plus) {
      box.insertBefore(handle, plus);
    }
  });

  const ids = new Set(layout.map((item) => item.id));

  [...barNode.querySelectorAll(`:scope>[${TOOLBAR_GROUP_ATTR}]`)]
    .filter((box) => !ids.has(box.getAttribute(TOOLBAR_GROUP_ATTR)))
    .forEach((box) => box.remove());

  let square = barNode.querySelector(`:scope>[${TOOLBAR_NEW_GROUP_ATTR}]`);

  // No group, nothing to start one from: no square either.
  if (!layout.length) {
    square?.remove();

    return;
  }

  if (!square) {
    square = newGroupSquare(win);
  }

  if (square.parentElement !== barNode || square.previousElementSibling !== cursor) {
    cursor.after(square);
  }
}

/** The sheet and the groups, for what is stored. Cheap enough for every toolbar pass. */
export function syncToolbarLayout(win) {
  syncToolbarSheet(win);
  syncToolbarGroups(win);
}

/**
 * A button (or frame) a pass has just made: into the row, then into its
 * place. The one way header-toolbar.js puts a tool in the bar.
 */
export function placeToolbarButton(win, el) {
  const barNode = barEl(win);

  if (!barNode) {
    return;
  }

  if (!barNode.contains(el)) {
    barNode.appendChild(el);
  }

  syncToolbarGroups(win);
}

/** Replace the hidden list (a preset, Show all). */
export function setHiddenTools(win, keys) {
  writeKeys(win, TOOLBAR_HIDDEN_KEY, [...new Set(keys.filter(validKey))]);
  syncToolbarLayout(win);
}

export function setToolbarToolShown(win, key, shown) {
  const next = readHiddenTools(win).filter((item) => item !== key);

  if (!shown && validKey(key)) {
    next.push(key);
  }

  setHiddenTools(win, next);
}

export function showAllToolbarTools(win) {
  setHiddenTools(win, []);
}

/** Store an arrangement and draw it. */
export function setToolbarGroups(win, groups) {
  writeToolbarGroups(win, groups);
  syncToolbarLayout(win);
}

/** Move a tool into a group at `index` among its tools (hidden ones counted). */
export function moveToolbarTool(win, key, groupId, index) {
  setToolbarGroups(win, moveTool(toolbarLayout(win), key, groupId, index));
}

/** Move a tool into a group, right before `beforeKey`; null = at the end. */
export function moveToolbarToolBefore(win, key, groupId, beforeKey) {
  const layout = toolbarLayout(win);
  const target = layout.find((item) => item.id === groupId);

  if (!target) {
    return;
  }

  const rest = target.tools.filter((item) => item !== key);
  const at = beforeKey ? rest.indexOf(beforeKey) : -1;

  setToolbarGroups(win, moveTool(layout, key, groupId, at === -1 ? rest.length : at));
}

/** Move a tool into a new group of its own at `groupIndex`; returns the group's id. */
export function moveToolbarToolToNewGroup(win, key, groupIndex, name = '') {
  const { groups, id } = moveToolToNewGroup(toolbarLayout(win), key, groupIndex, { name });

  if (id) {
    setToolbarGroups(win, groups);
  }

  return id;
}

/** The «+»: a tool at the end of the group, and shown. */
export function addToolbarToolToGroup(win, key, groupId) {
  moveToolbarTool(win, key, groupId, Infinity);
  setToolbarToolShown(win, key, true);
}

/** The new-group square: a tool in a group of its own after the last, and shown. Returns the group's id. */
export function addToolbarToolToNewGroup(win, key) {
  const id = moveToolbarToolToNewGroup(win, key, toolbarLayout(win).length);

  if (id) {
    setToolbarToolShown(win, key, true);
  }

  return id;
}

export function renameToolbarGroup(win, id, name) {
  setToolbarGroups(win, renameGroup(toolbarLayout(win), id, name));
}

export function moveToolbarGroup(win, id, index) {
  setToolbarGroups(win, moveGroup(toolbarLayout(win), id, index));
}

/** A group taken out; its tools join the group beside it. The only group stays. */
export function deleteToolbarGroup(win, id) {
  setToolbarGroups(win, deleteGroup(toolbarLayout(win), id));
}

/** Back to one group, in the order the bar draws. */
export function resetToolbarGroups(win) {
  chromeRemove(win, TOOLBAR_GROUPS_KEY);
  syncToolbarLayout(win);
}

/** This user's own presets, as stored and cleaned. */
export function readUserPresets(win) {
  let list;

  try {
    list = JSON.parse(chromeGet(win, TOOLBAR_PRESETS_KEY) || '[]');
  } catch {
    list = [];
  }

  return Array.isArray(list) ? list.map((raw) => cleanPreset(raw, { user: true })).filter(Boolean) : [];
}

export function writeUserPresets(win, presets) {
  const clean = presets.map((raw) => cleanPreset(raw, { user: true })).filter(Boolean);

  if (clean.length) {
    chromeSet(win, TOOLBAR_PRESETS_KEY, JSON.stringify(clean));
  } else {
    chromeRemove(win, TOOLBAR_PRESETS_KEY);
  }
}

/** This user's own right-sidebar panes per preset: { preset id: [pane key, …] }. */
export function readPaneChoices(win) {
  try {
    return cleanPaneChoices(JSON.parse(chromeGet(win, TOOLBAR_PRESET_PANES_KEY) || '{}'));
  } catch {
    return {};
  }
}

export function writePaneChoices(win, choices) {
  const clean = cleanPaneChoices(choices);

  if (Object.keys(clean).length) {
    chromeSet(win, TOOLBAR_PRESET_PANES_KEY, JSON.stringify(clean));
  } else {
    chromeRemove(win, TOOLBAR_PRESET_PANES_KEY);
  }
}

/** The preset this user last picked ('' = none). */
export function readPickedPreset(win) {
  const id = chromeGet(win, TOOLBAR_PRESET_KEY) || '';

  return /^[a-z0-9_-]+$/.test(id) ? id : '';
}

export function writePickedPreset(win, id) {
  if (id) {
    chromeSet(win, TOOLBAR_PRESET_KEY, id);
  } else {
    chromeRemove(win, TOOLBAR_PRESET_KEY);
  }
}

function toolbarButton(win, key) {
  return barEl(win)?.querySelector(`button[data-tab="${key}"]`) || null;
}

function toolInfo(btn, hidden) {
  const key = btn.dataset.tab;

  return {
    key,
    label: btn.title || btn.getAttribute('data-tip') || btn.getAttribute('aria-label') || key,
    icon: btn.querySelector('svg')?.outerHTML || '',
    shown: !hidden.includes(key),
    open: btn.getAttribute('aria-pressed') === 'true',
    // The toolbar's own `display:none` (Patterns on a page without a page
    // builder): the tool exists for this user but has nothing to do here.
    here: btn.style.display !== 'none',
  };
}

/** The groups with their icons, in this user's order, the way the menu lists them. */
export function toolbarGroups(win) {
  const barNode = barEl(win);

  if (!barNode) {
    return [];
  }

  const hidden = readHiddenTools(win);
  const byKey = new Map([...barNode.querySelectorAll('button[data-tab]')].filter((btn) => validKey(btn.dataset.tab)).map((btn) => [btn.dataset.tab, btn]));

  return toolbarLayout(win).map((item) => ({
    id: item.id,
    name: item.name,
    tools: item.tools.filter((key) => byKey.has(key)).map((key) => toolInfo(byKey.get(key), hidden)),
  }));
}

/** The icons in the row, in this user's order, group after group. */
export function toolbarTools(win) {
  return toolbarGroups(win).flatMap((item) => item.tools);
}

/**
 * Press a tool's icon — also one the user hid.
 *
 * A hidden one is shown while it is open: pages and globals open their control
 * inside the icon's frame, and a panel or popover may be placed under its
 * icon. `aria-pressed` (painted by applyHeaderTab) says when it closes again;
 * a close before it was ever seen open is the pass that ran before the tool did.
 */
export function openToolbarTool(win, key) {
  const btn = toolbarButton(win, key);

  if (!btn) {
    return false;
  }

  if (readHiddenTools(win).includes(key) && btn.getAttribute('aria-pressed') !== 'true') {
    peek(win, btn, key);
  }

  btn.click();

  return true;
}

function peek(win, btn, key) {
  const frame = win.document.getElementById(`${HEADER_FRAME_PREFIX}${key}`);
  const els = frame ? [btn, frame] : [btn];
  let seenOpen = false;

  els.forEach((el) => el.setAttribute(PEEK_ATTR, ''));

  const observer = new win.MutationObserver(() => {
    if (btn.getAttribute('aria-pressed') === 'true') {
      seenOpen = true;

      return;
    }

    if (seenOpen) {
      els.forEach((el) => el.removeAttribute(PEEK_ATTR));
      observer.disconnect();
    }
  });

  observer.observe(btn, { attributes: true, attributeFilter: ['aria-pressed'] });
}
