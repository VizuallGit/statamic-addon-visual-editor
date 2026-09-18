/**
 * Side scripts — CP tweaks that used to be standalone `$scripts` (WP6a).
 *
 * Each file is the former standalone script, verbatim: an IIFE with its own
 * `window.__sve*` run-once guard, observing the DOM or waiting for
 * `Statamic.booted`. Importing it runs it. Order is the order Statamic loaded
 * the script tags in.
 *
 * Only scripts that watch the DOM belong here. A script that must patch a
 * global before Statamic's own bundle reads it (`dedupe-cp-fetch`,
 * `disable-publish-stack-pin`) stays in `ServiceProvider::$scripts`: a classic
 * script runs while the page is parsed, a module only after Statamic's core
 * module has already run. `section-meta-prefetch.js` and `lite-sections.js`
 * are real modules with imports of their own and are imported by addon.js
 * right after the library / focus panel they call.
 *
 * May import: nothing — these files still carry their own helper copies
 * until WP6b replaces them with `lib/`.
 */
import './default-sets-count.js';
import './iconify-hide-remove.js';
import './icon-button-group-iconify.js';
import './responsive-hide-label.js';
import './grid-keep-table.js';
import './grid-collapse.js';
import './inserter-reveal.js';
import './toolbar-look.js';
import './library-drop-focus.js';
import './collection-template-picker.js';
import './collection-preset-scaffold.js';
import './field-prop.js';
