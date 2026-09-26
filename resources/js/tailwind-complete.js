/**
 * Tailwind suggestions in the template-dock HTML pane.
 *
 * The catalog is Tailwind's own design system — `getClassList()`,
 * `candidatesToCss()` and `getVariants()`, the three calls the official
 * Tailwind IntelliSense is built on — loaded with this site's `@theme` and
 * `@utility` blocks. So the list holds every utility Tailwind ships *and*
 * this site's scale: `grid-cols-5` and `py-1200` in the same breath, and the
 * CSS shown next to a name is the CSS the save would write.
 *
 * Isolated: CodeMirror completions + hover. No overlay, preview or bridge.
 * On only when `tailwind_dock` is on.
 *
 * ## Why nothing here is eager
 *
 * The engine is a lazy chunk shared with the save-time compile, and the class
 * list is ~15,000 names. Building it is fast; compiling all of it is not
 * (~250ms). So names are strings until something asks to *see* one, and then
 * only the rows on screen are compiled — in one batched call, memoised. The
 * dock stays instant and Live Preview never loads a byte of this.
 */

/** Variants nobody types: the `*` and `**` child selectors. */
const HIDDEN_VARIANTS = new Set(['*', '**']);

/**
 * The two classes Tailwind compiles nothing for.
 *
 * `group` and `peer` are markers: they carry no declaration of their own, they
 * are what `group-hover:` and `peer-checked:` look for on an ancestor or a
 * sibling. So `getClassList()` never names them — and without them here, the
 * one class you must put on the parent to make a hover state work is the one
 * class the dock cannot find.
 */
const MARKER_CLASSES = ['group', 'peer'];

/** How many variants to offer before anything is typed. */
const VARIANT_PREVIEW = 24;

let catalogPromise = null;

// site.css was saved: the catalog was built from the old theme. Built again on
// the next suggestion, from the new one (see forgetTailwindTheme in tw-compile).
if (typeof window !== 'undefined') {
  window.addEventListener('sve:site-css-saved', () => {
    catalogPromise = null;
  });
}

export function tailwindDockOn(win) {
  return win?.Statamic?.$config?.get?.('sveFeatures')?.tailwind_dock === true;
}

export function tailwindClassCompletions(win) {
  return (context) => {
    if (!tailwindDockOn(win) || !insideClassAttr(context)) {
      return null;
    }

    const token = context.matchBefore(/[^\s"']*$/);
    const typed = token?.text ?? '';

    if (typed.includes('{') || typed.includes('}')) {
      return null;
    }

    // Queried again on every keystroke, on purpose. With `validFor` the list
    // computed for `b` was kept and only filtered while `bg-pr` was typed —
    // and that list is capped at 80 of the hundreds of `b…` names, so
    // `bg-primary` was in it or not depending on how far the catalog had
    // loaded when the first letter landed. Slower to load (a server), more
    // often missing. The walk over the names costs a pass and nothing else.
    return loadCatalog(win).then((catalog) => {
      const options = suggestions(typed, catalog);

      if (!options.length) {
        return null;
      }

      return {
        from: token ? token.from : context.pos,
        options,
      };
    });
  };
}

export function tailwindHoverExtension(hoverTooltip, win) {
  return hoverTooltip((view, pos) => {
    if (!tailwindDockOn(win)) {
      return null;
    }

    const token = classTokenAt(view.state, pos);

    if (!token) {
      return null;
    }

    return loadCatalog(win).then((catalog) => {
      const css = catalog.rule(token.text);

      if (!css) {
        return null;
      }

      return {
        pos: token.from,
        end: token.to,
        create() {
          return { dom: infoDom(css, catalog.color(token.text)) };
        },
      };
    });
  });
}

/**
 * The catalog, built once per session.
 *
 * The engine arrives as a dynamic import so that importing `tailwindDockOn`
 * from this file — which the dock does at module level — never drags 100KB of
 * compiler in with it.
 */
export function loadCatalog(win) {
  if (!catalogPromise) {
    catalogPromise = import('./tw-compile.js')
      .then((mod) => mod.loadTailwindDesign(win))
      .then(makeCatalog)
      .catch((error) => {
        // Not remembered: a theme fetch that failed once must not leave the
        // dock without the site's classes for the rest of the session. The
        // next keystroke asks again.
        catalogPromise = null;
        console.warn('[sve] Tailwind suggestions unavailable, will retry:', error?.message || error);

        return emptyCatalog();
      });
  }

  return catalogPromise;
}

/* ------------------------------------------------------------------ *
 * The catalog
 * ------------------------------------------------------------------ */

function makeCatalog(design) {
  const names = [...MARKER_CLASSES, ...design.getClassList().map(([name]) => name)];
  const lower = names.map((name) => name.toLowerCase());
  const known = new Set(names);

  const statics = new Set(design.utilities.keys('static'));
  const functional = new Set(design.utilities.keys('functional'));

  const rules = new Map();
  const colors = new Map();

  /**
   * The utility a class belongs to — `grid-cols-5` -> `grid-cols`, `-mt-400`
   * -> `-mt`. Tailwind's own registry answers this, so a name with three
   * dashes lands on the right one instead of on whichever prefix a
   * hand-written table happened to list first.
   */
  function root(name) {
    if (statics.has(name)) {
      return name;
    }

    const parts = String(name).split('-');

    for (let i = parts.length; i > 0; i--) {
      const candidate = parts.slice(0, i).join('-');

      if (functional.has(candidate)) {
        return candidate;
      }
    }

    return '';
  }

  const byRoot = new Map();

  names.forEach((name) => {
    const key = root(name);

    if (!key) {
      return;
    }

    if (!byRoot.has(key)) {
      byRoot.set(key, []);
    }

    byRoot.get(key).push(name);
  });

  /**
   * Compile a batch and remember it.
   *
   * One call for forty names is a fraction of forty calls, and every list in
   * the dock is drawn a page at a time — so the batch is the unit, not the
   * name.
   */
  function fill(list) {
    const missing = list.filter((name) => !rules.has(name));

    if (!missing.length) {
      return;
    }

    let compiled = [];

    try {
      compiled = design.candidatesToCss(missing);
    } catch {
      compiled = [];
    }

    missing.forEach((name, index) => {
      rules.set(name, typeof compiled[index] === 'string' ? compiled[index] : '');
    });
  }

  /** The full rule, media queries and pseudo-elements and all. */
  function rule(name) {
    if (!name) {
      return '';
    }

    fill([name]);

    return rules.get(name) || '';
  }

  /** Just the declarations, for a tooltip or a menu row. */
  function css(name) {
    return declarationsOf(rule(name));
  }

  function color(name) {
    if (colors.has(name)) {
      return colors.get(name);
    }

    const value = swatchOf(css(name), design);

    colors.set(name, value);

    return value;
  }

  const items = new Map();

  function item(name) {
    if (!items.has(name)) {
      items.set(name, {
        label: name,
        get css() {
          return css(name);
        },
        get color() {
          return color(name);
        },
      });
    }

    return items.get(name);
  }

  return {
    design,
    names,
    lower,
    byRoot,
    variants: variantLabels(design),
    root,
    has: (name) => known.has(name),
    /** A utility with one fixed value — `flex`, `w-fit` — not a scale. */
    isStatic: (name) => statics.has(name),
    fill,
    rule,
    css,
    color,
    /** Rows for a list of names, compiled in one go. */
    rows(list) {
      fill(list);

      return list.map(item);
    },
    byUtility: {
      get: (name) => (known.has(name) ? item(name) : undefined),
    },
    /**
     * A class the list does not hold but Tailwind still compiles — an
     * arbitrary value, an opacity modifier, a variant chain. `null` means
     * Tailwind has no rule for it either, and then it really is a typo.
     */
    resolve(name) {
      if (known.has(name)) {
        return item(name);
      }

      const compiled = rule(name);

      return compiled ? item(name) : null;
    },
  };
}

function emptyCatalog() {
  const nothing = () => '';

  return {
    design: null,
    names: [],
    lower: [],
    byRoot: new Map(),
    variants: [],
    root: nothing,
    has: () => false,
    isStatic: () => false,
    fill: () => {},
    rule: nothing,
    css: nothing,
    color: nothing,
    rows: () => [],
    byUtility: { get: () => undefined },
    resolve: () => null,
  };
}

/**
 * `hover:`, `md:`, `max-lg:`, `group-focus:`, `prose-p:` — from the engine,
 * so a plugin's variants are in the list the moment the plugin is.
 */
function variantLabels(design) {
  const out = [];

  let all = [];

  try {
    all = design.getVariants();
  } catch {
    all = [];
  }

  all.forEach((variant) => {
    const name = variant?.name || '';

    if (!name || HIDDEN_VARIANTS.has(name)) {
      return;
    }

    if (variant.values?.length) {
      const joiner = variant.hasDash === false ? '' : '-';

      variant.values.forEach((value) => out.push(`${name}${joiner}${value}`));

      return;
    }

    // `data`, `nth`, `supports` — nothing to offer until the brackets are
    // typed, and a bare `data:` does not compile.
    if (!variant.isArbitrary) {
      out.push(name);
    }
  });

  return out;
}

/**
 * The declarations inside a compiled rule, flattened.
 *
 * `candidatesToCss` prints one declaration per line, so the lines carry the
 * structure: anything ending in `;` is a declaration, whatever it is nested
 * in. `@property` blocks trail the rule and describe a variable rather than
 * the class, so they are cut first. A `--tw-*` line is plumbing and only
 * shows when it is all there is.
 */
function declarationsOf(rule) {
  const body = String(rule || '').split(/^@property/m)[0];
  const own = [];
  const plumbing = [];

  body.split('\n').forEach((line) => {
    const text = line.trim();

    if (!text.endsWith(';') || text.startsWith('@') || !text.includes(':')) {
      return;
    }

    const decl = text.slice(0, -1).trim();

    (decl.startsWith('--tw-') ? plumbing : own).push(decl);
  });

  const lines = own.length ? own : plumbing;

  return lines.join('; ');
}

/** A colour a swatch can paint, or '' when the value is not one. */
function swatchOf(css, design) {
  const text = String(css || '');
  const literal = /(#[0-9a-fA-F]{3,8}\b|(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|color)\([^)]*\))/.exec(text);

  if (literal) {
    return literal[1];
  }

  const variable = /var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(text)?.[1];

  if (!variable) {
    return '';
  }

  let value = '';

  try {
    value = design?.resolveThemeValue?.(variable) || '';
  } catch {
    value = '';
  }

  return hexColor(value);
}

/* ------------------------------------------------------------------ *
 * Suggestions
 * ------------------------------------------------------------------ */

/**
 * The variant chain in front of a class, split off.
 *
 * Only the prefix is peeled — the rest goes to Tailwind as it stands, because
 * `bg-primary-500/50`, `w-[37px]` and `grid-cols-5!` are its grammar, not
 * ours.
 */
function peelVariants(typed) {
  const text = String(typed || '');
  const cut = text.lastIndexOf(':');

  // A colon inside brackets belongs to an arbitrary value, not to a variant.
  if (cut === -1 || text.slice(cut).includes(']')) {
    return { prefix: '', rest: text };
  }

  return { prefix: text.slice(0, cut + 1), rest: text.slice(cut + 1) };
}

function suggestions(typed, catalog) {
  const { prefix, rest } = peelVariants(typed);
  const query = rest.toLowerCase();
  const options = [];

  if (!prefix) {
    variantOptions(query, catalog).forEach((option) => options.push(option));
  }

  // A name that starts with what was typed comes first, and only then the
  // ones that merely contain it. Both lists are capped, so the walk over
  // 15,000 strings costs a pass and nothing else.
  const starts = [];
  const contains = [];

  for (let i = 0; i < catalog.names.length; i++) {
    if (!query) {
      if (starts.length >= 80) {
        break;
      }

      starts.push(catalog.names[i]);

      continue;
    }

    const name = catalog.lower[i];

    if (name.startsWith(query)) {
      if (starts.length < 80) {
        starts.push(catalog.names[i]);
      }
    } else if (contains.length < 80 && name.includes(query)) {
      contains.push(catalog.names[i]);
    }
  }

  const ordered = [...starts, ...contains].slice(0, 80);

  catalog.fill(ordered);

  ordered.forEach((name, index) => {
    options.push({
      label: `${prefix}${name}`,
      type: 'property',
      detail: catalog.css(name),
      boost: index < starts.length ? 1 : 0,
    });
  });

  return options;
}

function variantOptions(query, catalog) {
  const matches = query
    ? catalog.variants.filter((name) => name.toLowerCase().startsWith(query))
    : catalog.variants.slice(0, VARIANT_PREVIEW);

  return matches.slice(0, 40).map((name) => ({
    label: `${name}:`,
    type: 'keyword',
    detail: 'variant',
    boost: 2,
  }));
}

/* ------------------------------------------------------------------ *
 * Reading the class attribute under the cursor
 * ------------------------------------------------------------------ */

function insideClassAttr(context) {
  return !!(
    context.matchBefore(/class\s*=\s*"[^"]*$/i) ||
    context.matchBefore(/class\s*=\s*'[^']*$/i)
  );
}

function classTokenAt(state, pos) {
  const line = state.doc.lineAt(pos);
  const rel = pos - line.from;
  const attr = classAttrOnLine(line.text, rel);

  if (!attr) {
    return null;
  }

  const inner = line.text.slice(attr.valueFrom, attr.valueTo);
  const offset = rel - attr.valueFrom;
  const before = inner.slice(0, offset);
  const after = inner.slice(offset);
  const start = (before.match(/[^\s]*$/) || [''])[0];
  const end = (after.match(/^[^\s]*/) || [''])[0];
  const text = start + end;

  if (!text || text.includes('{')) {
    return null;
  }

  const from = line.from + attr.valueFrom + (before.length - start.length);

  return { from, to: from + text.length, text };
}

function classAttrOnLine(line, rel) {
  const re = /\bclass\s*=\s*(["'])/gi;
  let m;

  while ((m = re.exec(line))) {
    const quote = m[1];
    const valueFrom = m.index + m[0].length;
    const close = line.indexOf(quote, valueFrom);
    const valueTo = close === -1 ? line.length : close;

    if (rel >= valueFrom && rel <= valueTo) {
      return { valueFrom, valueTo };
    }
  }

  return null;
}

function hexColor(value) {
  const v = String(value || '').trim();

  return /^#([0-9a-fA-F]{3,8})$/.test(v) ? v : '';
}

function infoDom(css, color) {
  const wrap = document.createElement('div');
  wrap.className = 'sve-tw-info';

  if (color) {
    const swatch = document.createElement('span');
    swatch.className = 'sve-tw-swatch';
    swatch.style.background = color;
    wrap.appendChild(swatch);
  }

  const pre = document.createElement('pre');
  pre.textContent = css;
  wrap.appendChild(pre);

  return wrap;
}
