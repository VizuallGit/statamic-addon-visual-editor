/**
 * Facts about Statamic's Live Preview screen and the entry it shows.
 *
 * Statamic draws the editor (`.live-preview-editor`) and the header
 * (`.live-preview-header`); the addon draws its own cover over the header
 * while pages switch. The readers here know that layout so the panels do not
 * have to.
 *
 * Also the two things addon.js needs before the Live Preview cluster has
 * loaded: spotting Statamic's own "open Live Preview" control, and the
 * `notInLivePreview` / `onlyInLivePreview` field conditions.
 *
 * May import: lib/ids.js.
 */
import { LP_COVER_ID } from './ids.js';

/** Statamic's Live Preview header — the real one, not the addon's cover. */
export function lpHeader(doc) {
  return (
    [...doc.querySelectorAll('.live-preview-header')].find((el) => !el.closest(`#${LP_COVER_ID}`)) ??
    null
  );
}

/** The left editor pane. */
export function livePreviewEditorEl(doc) {
  return doc.querySelector('.live-preview-editor');
}

/** Whether a button or link reads as Statamic's "open Live Preview", in any CP language. */
export function isLivePreviewControl(el) {
  const text = `${el.textContent || ''} ${el.getAttribute('title') || ''}`;

  return /live.?preview|forhåndsvis|vorschau|voorbeeld|aperçu|vista previa/i.test(text);
}

/**
 * Statamic's own "open Live Preview" button, found in whatever language the CP is
 * speaking — matching the English label alone left every other locale waiting on
 * the failsafe, staring at a blank cover.
 */
export function livePreviewButton(doc) {
  return [...doc.querySelectorAll('button, a')].find(isLivePreviewControl);
}

// Windows whose conditions are registered: addon.js registers them at boot and
// initCp() asks again; one observer per window is enough.
const conditionWindows = new WeakSet();

/**
 * The two conditions the "where is this edited?" setting turns into.
 *
 * Registered by the editor rather than left to each site: the setting is offered
 * on every field's settings screen, and a field naming a condition nobody
 * registered is hidden everywhere instead of somewhere — the one failure worse
 * than the setting not working at all. A site that already registers these of its
 * own accord simply registers them twice, to the same effect.
 *
 * A ref, not a DOM lookup per call: conditions are evaluated inside a Vue
 * computed, so a ref is what makes them reactive. Without it a field would only
 * change places the next time some other value happened to change.
 */
export function registerPanelConditions(win) {
  const conditions = win.Statamic?.$conditions;
  const ref = win.Vue?.ref;

  if (!conditions || !ref || !win.document.body || conditionWindows.has(win)) {
    return;
  }

  conditionWindows.add(win);

  const inLivePreview = ref(false);
  const sync = () => {
    inLivePreview.value = !!win.document.querySelector('.live-preview-editor');
  };

  sync();
  new win.MutationObserver(sync).observe(win.document.body, { childList: true, subtree: true });

  conditions.add('notInLivePreview', () => !inLivePreview.value);
  conditions.add('onlyInLivePreview', () => inLivePreview.value);
}

/** The entry id in the CP URL, or null on a page that is not an entry. */
export function currentEntryId(win) {
  const match = win.location.pathname.match(/\/entries\/([^/]+)/);

  return match ? match[1] : null;
}

/** The collection handle in the CP URL, or null. */
export function currentCollection(win) {
  const match = win.location.pathname.match(/\/collections\/([^/]+)\//);

  return match ? match[1] : null;
}
