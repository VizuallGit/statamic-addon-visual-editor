/**
 * A class on a tag for the first time. Tailwind writes a `@utility` into the
 * site's CSS only when a file it scans uses it, so a class made in Theme → Styles
 * and put on a tag later has no rule anywhere: not in the preview, not on the
 * public site, and the section's baked CSS leaves `@utility` names to site.css.
 * After each save of the dock's file, a site class the built sheet lacks is drawn
 * in the page at once, and the site's CSS is built once for it.
 *
 * Its own surface: this module and one bus message from dock/save.js. Nothing
 * here reaches preview, overlay or bridge.
 */
import { on } from '../cp/bus.js';
import { builtClasses, firstUsedClasses, paintUtilities, swapSiteCss } from '../cp/theme-panel/utility-paint.js';
import { compilerCss } from '../cp/theme-panel/utilities.js';
import { featureSaidOn } from '../lib/config.js';
import { t } from '../lib/i18n.js';
import { pageDocuments, postSiteCss, readSiteCss, siteCssPosting, toast } from './tw-utility.js';
import { twCandidates, twSiteUtilities } from '../tw-candidates.js';

export function watchClassesFirstUsed(win) {
  // Asked once a class: one that builds to nothing must not build on every save.
  const tried = new Set();

  on('dock:saved', async ({ html }) => {
    if (!featureSaidOn(win, 'site_css') || siteCssPosting()) {
      return;
    }

    const docs = pageDocuments(win);
    const built = builtClasses(docs);
    const candidates = twCandidates(html).filter((name) => !tried.has(name));

    // No built sheet to compare with, or nothing in the file it lacks.
    if (!built || candidates.every((name) => built.has(name))) {
      return;
    }

    try {
      // Read each time: Theme → Styles writes this file too, and a kept copy would not know its new class.
      const css = await readSiteCss(win);
      const missing = firstUsedClasses(candidates, twSiteUtilities(css), built);

      if (!missing.length) {
        return;
      }

      missing.forEach((name) => tried.add(name));

      const { compileDraft } = await import('../tw-compile.js');

      paintUtilities(docs, missing, await compileDraft(win, compilerCss(css), missing));

      const build = (await postSiteCss(win, css))?.build;

      if (build?.ok && build.css) {
        docs.forEach((doc) => swapSiteCss(doc, build.css));
      } else if (build?.reason === 'locked') {
        // Another build was running, and it may not have seen this file: the next save asks again.
        missing.forEach((name) => tried.delete(name));
      } else if (build) {
        toast(win, 'error', 'tw_utility_not_built', { name: missing.join(' '), reason: t(win, `theme_utilities_reason_${build.reason || 'error'}`) });
      }
    } catch {
      toast(win, 'error', 'tw_utility_failed');
    }
  });
}
