/**
 * Build's `Class`: a utility in site.css, on the element, and edited from the
 * panel. A click in Style then writes into the utility's `@apply` instead of
 * onto the tag, so every element with that class follows. The dock's Utility
 * button is the same thing made once; this is it kept open.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: dock/tw-utility.js, tw-classes.js, tw-compile.js, cp/theme-panel/*.
 * Bus messages: none of its own.
 *
 * Two speeds, as the Utilities tab has them: the rule is drawn in the page the
 * moment it changes, compiled by the dock's Tailwind; site.css is saved when
 * the clicks stop, and the server builds the site's CSS (SiteBuild::afterSave).
 * The build takes seconds on the server, so it is not on the paint path. A
 * class Tailwind cannot build is taken back, because the next build of site.css
 * would fail on it. A utility with nothing in it cannot exist in Tailwind, so
 * a new, empty class reaches site.css with its first style.
 */

import { ref } from 'vue';
import { applyClasses, bodyWithClasses, compilerCss, utilityBodies, utilityNameProblem, writeUtilities } from '../cp/theme-panel/utilities.js';
import { paintUtilities, swapSiteCss, utilityCandidates } from '../cp/theme-panel/utility-paint.js';
import { pageDocuments, postSiteCss, readSiteCss, storeUtility, toast } from '../dock/tw-utility.js';
import { featureSaidOn } from '../lib/config.js';
import { t as i18n } from '../lib/i18n.js';
import { tokenizeClassValue } from '../tw-parse.js';
import { twAddClass, twPickedClasses, twSetClassTarget } from '../tw-classes.js';

/** How long the clicks must stop before site.css is saved. */
const SAVE_AFTER = 700;

export function createClassTarget(win, { tagClasses, changed, isTailwind }) {
  const bodies = ref(new Map());
  const target = ref('');
  const empty = ref(false);
  const ownCss = ref(false);
  let siteCss = null;
  let loading = null;
  let timer = 0;
  let good = '';
  let saved = '';
  let queue = Promise.resolve();
  let drawn = 0;

  const enabled = () => featureSaidOn(win, 'site_css');

  function load() {
    if (loading || !enabled()) {
      return loading;
    }

    loading = readSiteCss(win)
      .then((css) => {
        siteCss = css;
        bodies.value = utilityBodies(css);
        changed();
      })
      .catch(() => {
        loading = null;
      });

    return loading;
  }

  const tagTokens = () => tokenizeClassValue(tagClasses()).filter((tok) => !tok.dynamic).map((tok) => tok.text);

  /** The utilities in site.css, plain names: `tab-*` is a family of classes, not one to put on an element. */
  function names() {
    load();

    return [...bodies.value.keys()].filter((name) => !name.endsWith('-*')).sort();
  }

  /** The site's utilities this element carries, and the one just made that has no body yet. */
  function onTag() {
    const have = new Set(names());

    return tagTokens().filter((token) => have.has(token) || token === target.value);
  }

  /** The draft in the page: `value` as the rules of `name`, compiled against the rest of site.css. */
  async function draw(name, value) {
    const turn = ++drawn;
    const docs = pageDocuments(win);

    if (!value) {
      paintUtilities(docs, [name], '');

      return true;
    }

    const { compileDraft } = await import('../tw-compile.js');
    const next = writeUtilities(siteCss, { [name]: bodyWithClasses(bodies.value.get(name), value) });
    const css = await compileDraft(win, compilerCss(next), utilityCandidates(docs, [name]));

    if (turn === drawn) {
      paintUtilities(docs, [name], css);
    }

    return !!css.trim();
  }

  /** site.css with the utility as it stands now. Queued: two saves never pass each other. */
  function save(name, value) {
    queue = queue.then(async () => {
      if (!value || value === saved) {
        return;
      }

      const body = bodyWithClasses(bodies.value.get(name), value);
      const next = writeUtilities(siteCss, { [name]: body });

      try {
        const data = await postSiteCss(win, next);

        siteCss = next;
        saved = value;
        bodies.value = new Map(bodies.value).set(name, body);
        win.dispatchEvent(new CustomEvent('sve:site-css-saved', { detail: { path: 'site.css' } }));

        const build = data?.build;

        if (build?.ok && build.css) {
          // The new sheet replaces what was painted; clicks made since are drawn on it again.
          pageDocuments(win).forEach((doc) => swapSiteCss(doc, build.css, () => {
            if (target.value === name && good !== value) {
              void draw(name, good).catch(() => {});
            }
          }));
        } else if (build) {
          toast(win, 'error', 'tw_utility_not_built', { name, reason: i18n(win, `theme_utilities_reason_${build.reason || 'error'}`) });
        }
      } catch {
        toast(win, 'error', 'tw_utility_failed');
      }
    });

    return queue;
  }

  function flush() {
    if (timer) {
      win.clearTimeout(timer);
      timer = 0;

      return save(target.value, good);
    }

    return queue;
  }

  /** Work on `name`; '' is the tag again. What was still waiting to be saved is saved first. */
  function edit(name) {
    if (name === target.value) {
      return;
    }

    flush();
    target.value = name;

    if (!name) {
      twSetClassTarget(win, null);
      changed();

      return;
    }

    const body = bodies.value.get(name) || '';

    good = applyClasses(body);
    saved = good;
    empty.value = !good;
    ownCss.value = !!body.replace(/@apply[^;]*;/g, '').trim();

    const pane = {
      value: good,
      write(value) {
        const asked = value;

        empty.value = !value.trim();
        draw(name, value)
          .then((built) => {
            if (!built && value) {
              throw new Error('it compiles to nothing');
            }

            good = asked;
            win.clearTimeout(timer);
            timer = win.setTimeout(() => {
              timer = 0;
              save(name, good);
            }, SAVE_AFTER);
          })
          .catch((err) => {
            toast(win, 'error', 'tw_utility_wont_compile', { reason: err?.message || String(err) });
            pane.value = good;
            twSetClassTarget(win, pane);
            void draw(name, good).catch(() => {});
          });
      },
      /** What the element would look like: the tag's own classes, with this class's in its place. */
      preview: (value) => tagTokens().map((token) => (token === name ? value : token)).join(' '),
    };

    twSetClassTarget(win, pane);
    changed();
  }

  /** An existing utility onto the element, and on to edit it. */
  function add(name) {
    if (!tagTokens().includes(name)) {
      twAddClass(win, name);
    }

    edit(name);
  }

  /**
   * A new class. An element with classes hands them over, as the dock's Utility
   * does: they go into the utility, and the tag carries the name instead. One
   * with none gets the name now, and the utility comes with its first style.
   */
  async function create(name) {
    edit('');

    const raws = twPickedClasses()?.raws || [];

    if (!raws.length) {
      twAddClass(win, name);
      bodies.value = new Map(bodies.value).set(name, '');
      edit(name);

      return true;
    }

    if (!(await storeUtility(win, name, raws))) {
      return false;
    }

    loading = null;
    await load();
    edit(name);

    return true;
  }

  return {
    enabled,
    names,
    onTag,
    target: () => target.value,
    empty: () => empty.value,
    ownCss: () => ownCss.value,
    edit,
    add,
    create,
    /** Why `name` cannot be a new class: `bad_name`, `taken`, or '' when it can. */
    problem(name) {
      return utilityNameProblem(name) ? 'bad_name' : isTailwind(name) ? 'taken' : '';
    },
    picked: () => twPickedClasses()?.raws.length || 0,
  };
}
