/**
 * The asset field's own Browse button, as Statamic draws it: the one thing to
 * press when a click on an empty image or video means "choose a file" — on
 * Vizuall Build's canvas (cp/surfaces/BuildContent.vue) and in Live Preview
 * (selection-panel.js) alike.
 *
 * Statamic prints the button's words through its translator, and draws two
 * buttons of which one shows at the field's width; the visible one is the
 * answer. Null when the field has not drawn it (or is not an asset field) —
 * the caller does nothing then. The words are a contract with Statamic:
 * `Browse Assets` in the site's scripts/statamic-update-check.py.
 *
 * May import: ./i18n.js.
 */
import { statamicTranslate } from './i18n.js';

export function browseButton(el) {
  if (!el?.querySelectorAll) {
    return null;
  }

  const words = [statamicTranslate('Browse Assets'), statamicTranslate('Browse')];

  return (
    [...el.querySelectorAll('button')].find(
      (button) => button.offsetParent && words.includes(button.textContent.trim())
    ) || null
  );
}
