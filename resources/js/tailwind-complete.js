/**
 * Tailwind suggestions in the template-dock HTML pane.
 *
 * Isolated: CodeMirror completions + hover. No overlay, preview or bridge.
 * On only when `tailwind_dock` is on. Catalog comes from this site's `@theme`
 * (`/!/sve/tailwind-theme`) — the same tokens the PHP bake compiles.
 */

const VARIANTS = [
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  'max-sm',
  'max-md',
  'max-lg',
  'max-xl',
  'max-2xl',
  'dark',
  'hover',
  'focus',
  'focus-visible',
  'active',
  'disabled',
  'group-hover',
];

const VARIANT_MEDIA = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  'max-sm': '(max-width: 639px)',
  'max-md': '(max-width: 767px)',
  'max-lg': '(max-width: 1023px)',
  'max-xl': '(max-width: 1279px)',
  'max-2xl': '(max-width: 1535px)',
  dark: '(prefers-color-scheme: dark)',
};

const VARIANT_PSEUDO = {
  hover: ':hover',
  focus: ':focus',
  'focus-visible': ':focus-visible',
  active: ':active',
  disabled: ':disabled',
  'group-hover': ':is(:where(.group):hover *)',
};

const STATIC = {
  relative: 'position: relative',
  absolute: 'position: absolute',
  fixed: 'position: fixed',
  sticky: 'position: sticky',
  static: 'position: static',
  block: 'display: block',
  inline: 'display: inline',
  'inline-block': 'display: inline-block',
  flex: 'display: flex',
  'inline-flex': 'display: inline-flex',
  grid: 'display: grid',
  hidden: 'display: none',
  'flex-row': 'flex-direction: row',
  'flex-col': 'flex-direction: column',
  'flex-wrap': 'flex-wrap: wrap',
  'items-start': 'align-items: flex-start',
  'items-center': 'align-items: center',
  'items-end': 'align-items: flex-end',
  'items-stretch': 'align-items: stretch',
  'justify-start': 'justify-content: flex-start',
  'justify-center': 'justify-content: center',
  'justify-end': 'justify-content: flex-end',
  'justify-between': 'justify-content: space-between',
  'justify-around': 'justify-content: space-around',
  'text-left': 'text-align: left',
  'text-center': 'text-align: center',
  'text-right': 'text-align: right',
  'w-full': 'width: 100%',
  'h-full': 'height: 100%',
  'w-screen': 'width: 100vw',
  'h-screen': 'height: 100vh',
  'overflow-hidden': 'overflow: hidden',
  'overflow-auto': 'overflow: auto',
  'pointer-events-none': 'pointer-events: none',
  underline: 'text-decoration-line: underline',
  italic: 'font-style: italic',
  'font-bold': 'font-weight: 700',
  'font-medium': 'font-weight: 500',
  uppercase: 'text-transform: uppercase',
  truncate: 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap',
  'z-10': 'z-index: 10',
  'z-20': 'z-index: 20',
  'z-50': 'z-index: 50',
};

const BOX = {
  p: 'padding',
  px: 'padding-inline',
  py: 'padding-block',
  pt: 'padding-top',
  pr: 'padding-right',
  pb: 'padding-bottom',
  pl: 'padding-left',
  m: 'margin',
  mx: 'margin-inline',
  my: 'margin-block',
  mt: 'margin-top',
  mr: 'margin-right',
  mb: 'margin-bottom',
  ml: 'margin-left',
  gap: 'gap',
  'gap-x': 'column-gap',
  'gap-y': 'row-gap',
  w: 'width',
  h: 'height',
  'min-w': 'min-width',
  'min-h': 'min-height',
  'max-w': 'max-width',
  'max-h': 'max-height',
};

const COLOR = {
  bg: 'background-color',
  border: 'border-color',
  outline: 'outline-color',
  fill: 'fill',
  stroke: 'stroke',
};

let catalogPromise = null;

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

    return loadCatalog(win).then((catalog) => {
      const options = suggestions(typed, catalog).slice(0, 80);

      if (!options.length) {
        return null;
      }

      return {
        from: token ? token.from : context.pos,
        options,
        validFor: /^[^\s"'=]*$/,
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
      const css = cssForClass(token.text, catalog);

      if (!css) {
        return null;
      }

      return {
        pos: token.from,
        end: token.to,
        create() {
          return { dom: infoDom(css, swatchFor(token.text, catalog)) };
        },
      };
    });
  });
}

export function catalogFromTheme(css) {
  const tokens = { color: [], spacing: [], text: [], leading: [], font: [], radius: [] };
  const re = /--(color|spacing|text|leading|font|radius)-([a-zA-Z0-9][a-zA-Z0-9._-]*)\s*:\s*([^;]+);/g;
  let m;

  while ((m = re.exec(String(css || '')))) {
    if (m[2] === '*') {
      continue;
    }

        tokens[m[1]].push({ name: m[2], value: m[3].trim() });
  }

  const items = [];

  Object.entries(STATIC).forEach(([label, cssText]) => {
    items.push({ label, css: cssText, color: null });
  });

  tokens.color.forEach(({ name, value }) => {
    const color = hexColor(value);
    Object.entries(COLOR).forEach(([prefix, prop]) => {
      items.push({
        label: `${prefix}-${name}`,
        css: `${prop}: var(--color-${name})`,
        color,
      });
    });
    items.push({
      label: `text-${name}`,
      css: `color: var(--color-${name})`,
      color,
    });
  });

  tokens.spacing.forEach(({ name }) => {
    Object.entries(BOX).forEach(([prefix, prop]) => {
      items.push({
        label: `${prefix}-${name}`,
        css: `${prop}: var(--spacing-${name})`,
        color: null,
      });
    });
  });

  tokens.text.forEach(({ name }) => {
    items.push({
      label: `text-${name}`,
      css: `font-size: var(--text-${name})`,
      color: null,
    });
  });

  tokens.leading.forEach(({ name }) => {
    items.push({
      label: `leading-${name}`,
      css: `line-height: var(--leading-${name})`,
      color: null,
    });
  });

  tokens.font.forEach(({ name }) => {
    items.push({
      label: `font-${name}`,
      css: `font-family: var(--font-${name})`,
      color: null,
    });
  });

  tokens.radius.forEach(({ name }) => {
    items.push({
      label: name === 'DEFAULT' ? 'rounded' : `rounded-${name}`,
      css: `border-radius: var(--radius-${name})`,
      color: null,
    });
  });

  const byUtility = new Map();

  items.forEach((item) => {
    if (!byUtility.has(item.label)) {
      byUtility.set(item.label, item);
    }
  });

  return { items: [...byUtility.values()], byUtility };
}

function loadCatalog(win) {
  if (!catalogPromise) {
    catalogPromise = win
      .fetch('/!/sve/tailwind-theme', {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((res) => (res.ok ? res.json() : { css: '' }))
      .then((data) => catalogFromTheme(typeof data.css === 'string' ? data.css : ''))
      .catch(() => catalogFromTheme(''));
  }

  return catalogPromise;
}

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

function peel(typed) {
  const names = [...VARIANTS].sort((a, b) => b.length - a.length);
  const variants = [];
  let rest = String(typed || '');
  let changed = true;

  while (changed) {
    changed = false;

    for (const name of names) {
      const needle = `${name}:`;

      if (rest.startsWith(needle)) {
        variants.push(name);
        rest = rest.slice(needle.length);
        changed = true;
        break;
      }
    }
  }

  let important = false;

  if (rest.startsWith('!')) {
    important = true;
    rest = rest.slice(1);
  } else if (rest.endsWith('!')) {
    important = true;
    rest = rest.slice(0, -1);
  }

  return { variants, utility: rest, important };
}

function suggestions(typed, catalog) {
  const { variants, utility } = peel(typed);
  const prefix = variants.length ? `${variants.join(':')}:` : '';
  const query = utility.toLowerCase();
  const options = [];

  if (!query && !prefix) {
    VARIANTS.forEach((name) => {
      options.push({
        label: `${name}:`,
        type: 'keyword',
        detail: 'variant',
        boost: 2,
      });
    });
  }

  catalog.items.forEach((item) => {
    if (query && !item.label.startsWith(query) && !item.label.includes(query)) {
      return;
    }

    const label = `${prefix}${item.label}`;

    options.push({
      label,
      type: 'property',
      detail: item.css,
      boost: item.label.startsWith(query) ? 1 : 0,
    });
  });

  return options.sort((a, b) => (b.boost || 0) - (a.boost || 0) || a.label.localeCompare(b.label));
}

export function cssForClass(className, catalog) {
  const { variants, utility, important } = peel(className);
  const item = catalog.byUtility.get(utility);

  if (!item) {
    return '';
  }

  let decl = item.css;

  if (important) {
    decl += ' !important';
  }

  const escaped = className.replace(/[^a-zA-Z0-9_-]/g, (ch) => `\\${ch}`);
  let pseudos = '';
  const media = [];

  variants.forEach((name) => {
    if (VARIANT_MEDIA[name]) {
      media.push(VARIANT_MEDIA[name]);
    } else if (VARIANT_PSEUDO[name]) {
      pseudos += VARIANT_PSEUDO[name];
    }
  });

  let rule = `.${escaped}${pseudos} { ${decl} }`;

  media.slice().reverse().forEach((query) => {
    rule = `@media ${query} {\n  ${rule}\n}`;
  });

  return rule;
}

function swatchFor(className, catalog) {
  const { utility } = peel(className);

  return catalog.byUtility.get(utility)?.color || null;
}

function hexColor(value) {
  const v = String(value || '').trim();

  return /^#([0-9a-fA-F]{3,8})$/.test(v) ? v : null;
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
