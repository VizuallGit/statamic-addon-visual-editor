/**
 * A utility from the picked tag's Tailwind classes.
 *
 * The CSS pane in Tailwind mode shows the tag's classes; Utility takes them
 * all and writes one `@utility name { @apply …; }` into site.css, down the
 * same path the Theme panel's Utilities tab writes: the file is saved, the
 * server builds the site's CSS (SiteBuild::afterSave), the new sheet is
 * swapped into the preview. Then the tag carries the utility instead of the
 * classes. That is `@apply` as it was: one name for many classes, in the one
 * file Tailwind compiles — a section's style_push never meets Tailwind, so an
 * `@apply` there would reach the browser as written and do nothing.
 *
 * What goes into the utility is what Tailwind can build. The site's own
 * compiler says which of the tag's classes it knows (compileDraft), and a
 * class it does not know — `card` from the section's own rules — stays on the
 * tag beside the new name. Before anything is written the finished utility is
 * compiled once more: a utility Tailwind cannot build is not saved, because
 * the next build of site.css would fail on it.
 *
 * Its own surface: this module and two reads of tw-classes.js. Nothing here
 * reaches preview, overlay or bridge.
 */
import NamePrompt from '../cp/surfaces/NamePrompt.vue';
import { openCpOverlay } from '../cp/open-overlay.js';
import { classTokens, paintUtilities, swapSiteCss } from '../cp/theme-panel/utility-paint.js';
import { compilerCss, utilityBodies, utilityNameProblem, writeUtilities } from '../cp/theme-panel/utilities.js';
import { featureSaidOn } from '../lib/config.js';
import { csrfToken } from '../lib/csrf.js';
import { t } from '../lib/i18n.js';
import { pageDocuments } from '../lib/preview-frame.js';
import { twPickedClasses, twReplaceClasses } from '../tw-classes.js';

/** site.css, relative to the site's CSS root — the file the Utilities tab writes. */
const ENTRY = 'site.css';

const HEADERS = { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' };

export async function readSiteCss(win) {
  const res = await win.fetch(`/!/sve/site-css/file?path=${encodeURIComponent(ENTRY)}&kind=css`, {
    credentials: 'same-origin',
    headers: HEADERS,
  });

  if (!res.ok) {
    throw new Error(String(res.status));
  }

  return String((await res.json()).css || '');
}

/** Save site.css. The answer carries `build` when the server built the site's CSS. */
export async function postSiteCss(win, css) {
  const res = await win.fetch('/!/sve/site-css?kind=css', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { ...HEADERS, 'X-CSRF-TOKEN': csrfToken(win), 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: ENTRY, css }),
  });

  if (!res.ok) {
    throw new Error(String(res.status));
  }

  return res.json();
}

export { pageDocuments };

/**
 * The classes among `raws` that Tailwind builds a rule for, against the
 * site's own theme and utilities. A class with no rule is not Tailwind's —
 * and `@apply` of it would fail the build.
 */
async function knownClasses(win, compileDraft, base, raws) {
  const css = await compileDraft(win, base, raws);
  const found = new Set(classTokens(css));

  return raws.filter((raw) => found.has(raw));
}

export function toast(win, kind, key, replacements) {
  win.Statamic?.$toast?.[kind]?.(t(win, key, replacements));
}

/** `raws` as the utility `name` in site.css, and on the tag in their place. True when it was written. */
export async function storeUtility(win, name, raws) {
  if (utilityNameProblem(name)) {
    toast(win, 'error', 'tw_utility_bad_name');

    return false;
  }

  let siteCss;

  try {
    siteCss = await readSiteCss(win);
  } catch {
    toast(win, 'error', 'tw_utility_failed');

    return false;
  }

  if (utilityBodies(siteCss).has(name) && !win.confirm(t(win, 'tw_utility_replace', { name }))) {
    return false;
  }

  const { compileDraft } = await import('../tw-compile.js');
  const known = await knownClasses(win, compileDraft, compilerCss(siteCss), raws);

  if (!known.length) {
    toast(win, 'error', 'tw_utility_no_classes');

    return false;
  }

  const left = raws.filter((raw) => !known.includes(raw));
  const next = writeUtilities(siteCss, { [name]: `@apply ${known.join(' ')};` });
  let compiled = '';

  try {
    compiled = await compileDraft(win, compilerCss(next), [name]);
  } catch (err) {
    toast(win, 'error', 'tw_utility_wont_compile', { reason: err?.message || String(err) });

    return false;
  }

  if (!compiled.trim()) {
    toast(win, 'error', 'tw_utility_wont_compile', { reason: t(win, 'tw_utility_reason_empty') });

    return false;
  }

  // The rule in the preview now; the build takes seconds.
  const docs = pageDocuments(win);

  paintUtilities(docs, [name], compiled);

  let data;

  try {
    data = await postSiteCss(win, next);
  } catch {
    paintUtilities(docs, [], '');
    toast(win, 'error', 'tw_utility_failed');

    return false;
  }

  // The dock's Tailwind forgets the theme it kept, before the tag changes: the
  // new utility is a class it knows — and leaves to site.css — from now on.
  win.dispatchEvent(new CustomEvent('sve:site-css-saved', { detail: { path: ENTRY } }));
  twReplaceClasses(win, known, name);

  const build = data?.build;

  if (build?.ok && build.css) {
    docs.forEach((doc) => swapSiteCss(doc, build.css));
  } else if (build) {
    toast(win, 'error', 'tw_utility_not_built', {
      name,
      reason: t(win, `theme_utilities_reason_${build.reason || 'error'}`),
    });
  }

  toast(
    win,
    'success',
    left.length ? 'tw_utility_saved_left' : 'tw_utility_saved',
    { name, names: left.join(' ') }
  );

  return true;
}

/** The CSS pane's Utility button, in Tailwind mode: the tag's classes, named. */
export function saveTwUtility(win) {
  if (!featureSaidOn(win, 'site_css')) {
    toast(win, 'error', 'tw_utility_no_site_css');

    return;
  }

  const picked = twPickedClasses();

  if (!picked) {
    toast(win, 'error', 'tw_utility_no_tag');

    return;
  }

  if (!picked.raws.length) {
    toast(win, 'error', 'tw_utility_no_classes');

    return;
  }

  const overlay = openCpOverlay(win.document, NamePrompt, {
    heading: t(win, 'tw_utility_new'),
    nameLabel: t(win, 'snippet_name'),
    placeholder: t(win, 'tw_utility_name_placeholder'),
    value: '',
    cancelLabel: t(win, 'cancel'),
    saveLabel: t(win, 'tw_utility_create'),
    onOk: (name) => {
      overlay.dismiss();
      void storeUtility(win, String(name || '').trim(), picked.raws);
    },
  });
}
