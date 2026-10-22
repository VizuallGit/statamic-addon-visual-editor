/**
 * The small «+» at a top-bar group's right edge: a popover with every tool,
 * one click puts it in that group (and shows it if it was hidden).
 *
 * One delegated `click` on the bar; toolbar-visibility.js owns the groups and
 * does the write.
 *
 * May import: ./toolbar-visibility.js, ./lib/*, ./lp-menu-dismiss.js,
 * ./cp/mount.js. Does not import the kernel.
 */
import { t } from './lib/i18n.js';
import { remToPx } from './lib/dom.js';
import { HEADER_TOOLBAR_ID, TOOLBAR_ADD_ATTR } from './lib/ids.js';
import { bindMenuDismiss } from './lp-menu-dismiss.js';
import { mountSurface } from './cp/mount.js';
import LpToolbarAddMenu from './cp/surfaces/LpToolbarAddMenu.vue';
import { addToolbarToolToGroup, toolbarGroups, toolbarTools } from './toolbar-visibility.js';

const HOST_ID = '__sve-toolbar-add-menu-host';
// LpToolbarAddMenu's width; the popover is pulled left so it stays on screen.
const MENU_WIDTH_REM = 18;
const VIEWPORT_PAD = 8;

let menu = null;

export function dismissToolbarAddMenu() {
  if (!menu) {
    return;
  }

  const { unbind, app, host } = menu;

  menu = null;
  unbind();
  app.unmount();
  host.remove();
}

function menuProps(win, plus, groupId) {
  const rect = plus.getBoundingClientRect();
  const group = toolbarGroups(win).find((item) => item.id === groupId);

  return {
    top: Math.round(rect.bottom + 8),
    left: Math.round(Math.min(rect.left, win.innerWidth - remToPx(win, MENU_WIDTH_REM) - VIEWPORT_PAD)),
    title: group?.name ? t(win, 'toolbar_add_title', { name: group.name }) : t(win, 'toolbar_add_title_unnamed'),
    shownLabel: t(win, 'toolbar_add_shown'),
    emptyLabel: t(win, 'toolbar_add_empty'),
    // Every tool: the popover greys out the ones already in the bar.
    tools: toolbarTools(win),
    onPick: (key) => {
      addToolbarToolToGroup(win, key, groupId);
      dismissToolbarAddMenu();
    },
    onClose: dismissToolbarAddMenu,
  };
}

function openMenu(win, plus, groupId) {
  const doc = win.document;
  const host = doc.createElement('div');

  host.id = HOST_ID;
  doc.body.appendChild(host);

  const app = mountSurface(LpToolbarAddMenu, host, menuProps(win, plus, groupId));
  const unbind = bindMenuDismiss(
    win,
    (target) => host.contains(target) || plus.contains(target),
    dismissToolbarAddMenu
  );

  menu = { groupId, host, app, unbind };
  win.requestAnimationFrame(() => host.querySelector('.sve-tb-add')?.focus());
}

function onClick(win, bar, event) {
  const plus = event.target instanceof win.Element ? event.target.closest(`[${TOOLBAR_ADD_ATTR}]`) : null;

  if (!plus || !bar.contains(plus)) {
    return;
  }

  event.stopPropagation();

  const groupId = plus.getAttribute(TOOLBAR_ADD_ATTR);
  const same = menu?.groupId === groupId;

  dismissToolbarAddMenu();

  if (!same) {
    openMenu(win, plus, groupId);
  }
}

/** Called on every Live Preview pass: binds once per bar element. */
export function bindToolbarAddMenu(win) {
  const bar = win.document.getElementById(HEADER_TOOLBAR_ID);

  if (!bar || bar.dataset.sveAddBound === '1') {
    return;
  }

  bar.dataset.sveAddBound = '1';
  bar.addEventListener('click', (event) => onClick(win, bar, event));
}
