/**
 * A class: a utility in site.css, on the element, and edited from Style or from
 * the dock's Tailwind pane. They are two faces of this one module, and there is
 * one of it per window (`classTargetFor`), because the pane behind them has one
 * target and one list (tw-classes.js). A click in either then writes into the
 * utility's `@apply` instead of onto the tag, so every element with that class
 * follows.
 *
 * Owner: the dock (resources/js/dock/). Build's Style reads it through its port.
 * May import: dock/tw-utility.js, tw-classes.js, tw-compile.js, cp/theme-panel/*.
 * Bus messages: reads `tw:changed` and `dock:html-changed`, says `tw:changed`.
 *
 * Two speeds, as the Utilities tab has them: the rule is drawn in the page the
 * moment it changes, compiled by the dock's Tailwind; site.css is saved when
 * the clicks stop, and the server builds the site's CSS (SiteBuild::afterSave).
 * The build takes seconds on the server, so it is not on the paint path. A
 * class Tailwind cannot build is taken back, because the next build of site.css
 * would fail on it. A utility with nothing in it cannot exist in Tailwind, so
 * a new, empty class reaches site.css with its first style.
 *
 * The file is read again before every save, and again when another tool saved
 * it: a copy kept from the first read would put back what was taken out since.
 * A locked class (`lockedUtilities`) goes on and off elements, but stays as it is.
 *
 * The list in Style and the list in the dock are the Tailwind pane's
 * (TwClassList.vue). This tells them which of its classes are the site's, and
 * takes the clicks on them (`chipHost`, tw-classes.js `twSetChipHost`).
 */

import { ref, watch } from 'vue';
import { emit, on } from '../cp/bus.js';
import {
  applyClasses,
  bodyWithClasses,
  compilerCss,
  lockedUtilities,
  utilityBodies,
  utilityNameProblem,
  writeUtilities,
} from '../cp/theme-panel/utilities.js';
import { paintUtilities, swapSiteCss, utilityCandidates } from '../cp/theme-panel/utility-paint.js';
import { watchClassesFirstUsed } from './class-first-use.js';
import { pageDocuments, postSiteCss, readSiteCss, storeUtility, toast } from './tw-utility.js';
import { featureSaidOn } from '../lib/config.js';
import { t as i18n } from '../lib/i18n.js';
import { tokenizeClassValue } from '../tw-parse.js';
import {
  twAddClass,
  twDropClass,
  twIsTailwindClass,
  twPickedClasses,
  twPickedPath,
  twRefresh,
  twSetChipHost,
  twSetClassTarget,
  twTagClasses,
} from '../tw-classes.js';

/** How long the clicks must stop before site.css is saved. */
const SAVE_AFTER = 700;

const targets = new WeakMap();

/** The one for this window. Made the first time Style or the dock asks. */
export function classTargetFor(win) {
  if (!targets.has(win)) {
    const target = createClassTarget(win);

    targets.set(win, target);
    twSetChipHost(win, target.chipHost);
    watchClassesFirstUsed(win);
  }

  return targets.get(win);
}

function createClassTarget(win) {
  const bodies = ref(new Map());
  const lockedNames = ref(new Set());
  const target = ref('');
  const empty = ref(false);
  const ownCss = ref(false);
  // `New class`: a click on a class in the list chooses it for the new one.
  const picking = ref(false);
  const chosen = ref([]);
  // The name being typed, and who asked: both faces show the one form, and that one takes the caret.
  const draft = ref('');
  const askedBy = ref('');
  // Moves with the file and the pane, which Vue cannot see into.
  const rev = ref(0);
  // The locked class last clicked, so the panel can say why it does not open.
  const lockedTold = ref('');
  let siteCss = null;
  let loading = null;
  let timer = 0;
  let good = '';
  let saved = '';
  let queue = Promise.resolve();
  let drawn = 0;
  let savingHere = false;
  let openPane = null;
  // The pane's last write, drawn or refused.
  let written = Promise.resolve(true);

  const enabled = () => featureSaidOn(win, 'site_css');
  const changed = () => emit('tw:changed');

  function remember(css) {
    siteCss = css;
    bodies.value = utilityBodies(css);
    lockedNames.value = lockedUtilities(css);
  }

  function load() {
    if (loading || !enabled()) {
      return loading;
    }

    loading = readSiteCss(win)
      .then((css) => {
        remember(css);
        // The list marks the site's classes, and this is the first it knows them.
        twRefresh(win);
      })
      .catch(() => {
        loading = null;
      });

    return loading;
  }

  const tagTokens = () =>
    tokenizeClassValue(twTagClasses())
      .filter((tok) => !tok.dynamic)
      .map((tok) => tok.text);

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
    const body = bodyWithClasses(bodies.value.get(name), value);

    // Nothing left in it. A class with CSS of its own keeps that, below.
    if (!body) {
      paintUtilities(docs, [name], '');

      return true;
    }

    const { compileDraft } = await import('../tw-compile.js');
    const next = writeUtilities(siteCss, { [name]: body });
    const css = await compileDraft(win, compilerCss(next), utilityCandidates(docs, [name]));

    if (turn === drawn) {
      paintUtilities(docs, [name], css);
    }

    return !!css.trim();
  }

  /** site.css with the utility as it stands now. Queued: two saves never pass each other. */
  function save(name, value) {
    queue = queue.then(async () => {
      if (value === saved) {
        return;
      }

      try {
        const css = await readSiteCss(win);

        if (lockedUtilities(css).has(name)) {
          remember(css);
          toast(win, 'error', 'tw_utility_locked', { name });
          edit('');

          return;
        }

        const body = bodyWithClasses(utilityBodies(css).get(name), value);
        // Nothing left in it: Tailwind has no empty utility, so the block goes.
        const next = writeUtilities(css, { [name]: body || null });

        if (next === css) {
          saved = value;

          return;
        }

        const data = await postSiteCss(win, next);

        remember(next);
        saved = value;
        bodies.value = new Map(bodies.value).set(name, body);
        savingHere = true;
        win.dispatchEvent(new CustomEvent('sve:site-css-saved', { detail: { path: 'site.css' } }));
        savingHere = false;

        const build = data?.build;

        if (build?.ok && build.css) {
          // The new sheet replaces what was painted; clicks made since are drawn on it again.
          pageDocuments(win).forEach((doc) =>
            swapSiteCss(doc, build.css, () => {
              if (target.value === name && good !== value) {
                void draw(name, good).catch(() => {});
              }
            })
          );
        } else if (build) {
          toast(win, 'error', 'tw_utility_not_built', {
            name,
            reason: i18n(win, `theme_utilities_reason_${build.reason || 'error'}`),
          });
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

  /** Work on `name`; '' is the tag again. What was still waiting to be saved is saved first. A locked class stays closed. */
  function edit(name) {
    if (name === target.value || (name && lockedNames.value.has(name))) {
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
        written = draw(name, value)
          .then((built) => {
            if (!built && value) {
              throw new Error('it compiles to nothing');
            }

            changed();
            good = asked;
            win.clearTimeout(timer);
            timer = win.setTimeout(() => {
              timer = 0;
              save(name, good);
            }, SAVE_AFTER);

            return true;
          })
          .catch((err) => {
            toast(win, 'error', 'tw_utility_wont_compile', { reason: err?.message || String(err) });
            pane.value = good;
            twSetClassTarget(win, pane);
            void draw(name, good).catch(() => {});

            return false;
          });
      },
      /** What the element would look like: the tag's own classes, with this class's in its place. */
      preview: (value) =>
        tagTokens()
          .map((token) => (token === name ? value : token))
          .join(' '),
    };

    openPane = pane;
    twSetClassTarget(win, pane);
    changed();
  }

  function startPicking(who = '') {
    edit('');
    lockedTold.value = '';
    chosen.value = [];
    draft.value = '';
    askedBy.value = who;
    picking.value = true;
    twRefresh(win);
  }

  function stopPicking() {
    if (picking.value) {
      picking.value = false;
      chosen.value = [];
      twRefresh(win);
    }
  }

  const isSite = (raw) => bodies.value.has(raw) && !raw.endsWith('-*');
  // What can go in a class: a class Tailwind builds. The site's own stay, and `@apply` of an unknown name would fail the build.
  const canJoin = (raw) => !isSite(raw) && raw !== '[' && raw !== ']' && twIsTailwindClass(win, raw);

  /**
   * Classes on the element into the open class: in its `@apply` first, the way a
   * click in Style writes there, so the element never stands without them. One
   * Tailwind would not build stays on the element.
   */
  async function takeIn(raws) {
    const name = target.value;
    const moved = [];

    if (!name) {
      return;
    }

    for (const raw of raws.filter(canJoin)) {
      twAddClass(win, raw);

      if (await written) {
        moved.push(raw);
      }
    }

    // Off the tag with the class still open: what it is saving stays as it is.
    twSetClassTarget(win, null);
    moved.forEach((raw) => twDropClass(win, raw));
    twSetClassTarget(win, openPane);
  }

  function chooseAll() {
    const all = tagTokens().filter(canJoin);

    chosen.value = all.every((raw) => chosen.value.includes(raw)) ? [] : all;
    twRefresh(win);
  }

  /** What the two lists ask about a class, and the click on one. The list drawing is what first needs site.css. */
  const chipHost = {
    picking: () => picking.value,
    mark(raw) {
      load();

      return { site: isSite(raw), closed: lockedNames.value.has(raw), chosen: chosen.value.includes(raw) };
    },
    take(raw) {
      if (picking.value) {
        if (!isSite(raw)) {
          chosen.value = chosen.value.includes(raw)
            ? chosen.value.filter((one) => one !== raw)
            : [...chosen.value, raw];
          twRefresh(win);
        }

        return true;
      }

      if (target.value || !isSite(raw)) {
        return false;
      }

      lockedTold.value = lockedNames.value.has(raw) ? raw : '';
      edit(raw);
      changed();

      return true;
    },
  };

  // Another tool saved site.css: what is open here follows the file.
  win.addEventListener('sve:site-css-saved', async () => {
    if (savingHere || !siteCss) {
      return;
    }

    const name = target.value;

    edit('');
    await flush();

    try {
      remember(await readSiteCss(win));
    } catch {
      toast(win, 'error', 'tw_utility_failed');
    }

    edit(name);
    twRefresh(win);
  });

  const bump = () => {
    rev.value += 1;
  };

  on('tw:changed', bump);
  on('dock:html-changed', bump);

  // The class came off the element: back to the element.
  watch(
    () => (rev.value, !!target.value && !tagTokens().includes(target.value)),
    (off) => {
      if (off) {
        edit('');
      }
    }
  );

  // Another element picked: what was chosen belonged to the one before.
  watch(() => (rev.value, twPickedPath()), stopPicking);

  /**
   * A new class. The classes chosen in the list go into the utility, and the tag
   * carries the name in their place. With none chosen the tag gets the name now,
   * and the utility comes with its first style.
   */
  async function create(name) {
    edit('');

    const raws = (twPickedClasses()?.raws || []).filter((raw) => chosen.value.includes(raw));

    stopPicking();

    if (!raws.length) {
      twAddClass(win, name);
      bodies.value = new Map(bodies.value).set(name, '');
      edit(name);

      return true;
    }

    // The class opens: that says it was made, and a toast would stand over the list.
    if (!(await storeUtility(win, name, raws, { quiet: true }))) {
      return false;
    }

    loading = null;
    await load();
    edit(name);

    return true;
  }

  return {
    rev,
    draft,
    askedBy: () => askedBy.value,
    enabled,
    names,
    onTag,
    target: () => target.value,
    empty: () => empty.value,
    ownCss: () => ownCss.value,
    locked: (name) => lockedNames.value.has(name),
    edit,
    create,
    picking: () => picking.value,
    chosen: () => chosen.value,
    lockedTold: () => lockedTold.value,
    startPicking,
    stopPicking,
    chipHost,
    /** What the element carries besides the open class: `joinable` can go in it. */
    outside: () =>
      tagTokens()
        .filter((token) => token !== target.value && token !== '[' && token !== ']')
        .map((name) => ({ name, joinable: canJoin(name) })),
    takeIn,
    chooseAll,
    allChosen: () => {
      const all = tagTokens().filter(canJoin);

      return !!all.length && all.every((raw) => chosen.value.includes(raw));
    },
    canChoose: () => tagTokens().some(canJoin),
    /** The first class on the element whose `@apply` holds what `has(applyClasses)` looks for. */
    sourceOf(has) {
      return (
        tagTokens().find(
          (token) => isSite(token) && token !== target.value && has(applyClasses(bodies.value.get(token) || ''))
        ) || ''
      );
    },
    /** Why `name` cannot be a new class: `bad_name`, `taken`, or '' when it can. */
    problem(name) {
      return utilityNameProblem(name) ? 'bad_name' : twIsTailwindClass(win, name) ? 'taken' : '';
    },
  };
}
