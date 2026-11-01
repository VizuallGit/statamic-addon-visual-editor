/**
 * A class from the picked tag's Tailwind classes (dock/class-target.js).
 *
 * The classes chosen are written as one `@utility name { @apply …; }` into
 * site.css, down the same path Theme → Styles writes: the file is saved, the
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
import { ask } from '../cp/bus.js';
import { classTokens, paintUtilities, swapSiteCss } from '../cp/theme-panel/utility-paint.js';
import { compilerCss, lockedUtilities, utilityBodies, utilityNameProblem, writeUtilities } from '../cp/theme-panel/utilities.js';
import { csrfToken } from '../lib/csrf.js';
import { t } from '../lib/i18n.js';
import { pageDocuments } from '../lib/preview-frame.js';
import { twRestoreTag, twReplaceClasses, twTagClasses } from '../tw-classes.js';

/** site.css, relative to the site's CSS root — the file the Utilities tab writes. */
const ENTRY = 'site.css';

let posting = 0;

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

/**
 * Save site.css. The answer carries `build` when the server built the site's CSS.
 *
 * The dock's file goes first. Tailwind writes a utility only when a file it scans
 * uses it, so a build that runs before the tag has reached the disk leaves a new
 * class out of the site's CSS, on the public site too.
 */
export async function postSiteCss(win, css) {
  posting += 1;

  try {
    ask('dock:save-now');
    await ask('dock:save-settled');

    return await sendSiteCss(win, css);
  } finally {
    posting -= 1;
  }
}

/** A save on its way: the build it ends in may already see the file. */
export const siteCssPosting = () => posting > 0;

async function sendSiteCss(win, css) {
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

/**
 * `raws` as the utility `name` in site.css, and on the tag in their place. True
 * when it was written. `quiet`: the caller shows it was done, so no toast says
 * so, unless a class was left behind.
 */
export async function storeUtility(win, name, raws, { quiet = false } = {}) {
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

  if (lockedUtilities(siteCss).has(name)) {
    toast(win, 'error', 'tw_utility_locked', { name });

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

  // On the tag before the save: postSiteCss sends the file first, for the build.
  const before = twTagClasses();

  twReplaceClasses(win, known, name);

  let data;

  try {
    data = await postSiteCss(win, next);
  } catch {
    paintUtilities(docs, [], '');
    twRestoreTag(win, before);
    toast(win, 'error', 'tw_utility_failed');

    return false;
  }

  // The dock's Tailwind forgets the theme it kept: the new utility is a class it
  // knows — and leaves to site.css — from now on.
  win.dispatchEvent(new CustomEvent('sve:site-css-saved', { detail: { path: ENTRY } }));

  const build = data?.build;

  if (build?.ok && build.css) {
    docs.forEach((doc) => swapSiteCss(doc, build.css));
  } else if (build) {
    toast(win, 'error', 'tw_utility_not_built', {
      name,
      reason: t(win, `theme_utilities_reason_${build.reason || 'error'}`),
    });
  }

  if (!quiet || left.length) {
    toast(
      win,
      'success',
      left.length ? 'tw_utility_saved_left' : 'tw_utility_saved',
      { name, names: left.join(' ') }
    );
  }

  return true;
}
