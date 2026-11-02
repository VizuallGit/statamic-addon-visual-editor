/**
 * `data-auto-contrast` on Build's canvas. The site's own script (color-scheme's
 * auto-contrast.js) sets an element's text colour from its background, and it
 * runs in the real preview: the canvas carries no scripts, and each paint from
 * the file takes the colour it copied along off again. So after each paint the
 * real preview's script is asked to measure the canvas's elements: the site's
 * rule, the theme it reads and what the canvas shows now, and no copy of any.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: nothing. Bus messages: none.
 */

const MARK = '[data-auto-contrast], [data-auto-contrast-hover]';

/**
 * @param {?Window} site  the real preview's window; a page with no marked element does not load the script
 * @param {?Document} page  the canvas's document
 */
export function measureContrast(site, page) {
  if (page?.querySelector(MARK) && typeof site?.applyAutoContrast === 'function') {
    site.applyAutoContrast(page);
  }
}
