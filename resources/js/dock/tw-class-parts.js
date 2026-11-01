/**
 * The dock's face of a class (dock/class-target.js): what Style has around its
 * list, around the Tailwind pane's. New class on the row's button, the class
 * open and how to close it over the list, the form and the moving-in under it.
 *
 * Its own surface: this module and TwDockClassBar.vue. Nothing here reaches
 * preview, overlay or bridge.
 */
import TwClassPick from '../cp/surfaces/TwClassPick.vue';
import TwDockClassBar from '../cp/surfaces/TwDockClassBar.vue';
import { mountSurface } from '../cp/mount.js';
import { featureSaidOn } from '../lib/config.js';
import { t } from '../lib/i18n.js';
import { twPickedPath } from '../tw-classes.js';
import { classTargetFor } from './class-target.js';

/** The row's button: the form opens, or closes if it stands open. */
export function toggleNewClass(win) {
  const toast = (key) => win.Statamic?.$toast?.error?.(t(win, key));

  if (!featureSaidOn(win, 'site_css')) {
    toast('tw_utility_no_site_css');

    return;
  }

  if (!twPickedPath()) {
    toast('tw_utility_no_tag');

    return;
  }

  const classes = classTargetFor(win);

  if (classes.picking()) {
    classes.stopPicking();
  } else {
    classes.startPicking('dock');
  }
}

export function bindTwClassParts(win, dock) {
  const bar = dock.querySelector('[data-sve-tw-class-bar]');
  const foot = dock.querySelector('[data-sve-tw-class-foot]');

  if (!bar || !foot || bar._sveBound) {
    return;
  }

  bar._sveBound = true;

  const classes = classTargetFor(win);
  const say = (key, replace) => t(win, key, replace);

  mountSurface(TwDockClassBar, bar, { classes, t: say });
  mountSurface(TwClassPick, foot, { part: 'foot', who: 'dock', classes, t: say });
}
