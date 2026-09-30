/**
 * Markup from somewhere else, turned into a section of ours.
 *
 * Paste a Tailwind UI block, a snippet from a pen, a page a designer sent, and
 * what comes out is a static section like any other: a row on the page, drawn
 * in the tree, draggable, saveable to the library, open in the dock for the
 * next edit. Fields can be added to it afterwards the usual way — the import
 * does not decide that.
 *
 * Two things have to be true of the result and neither is true of what was
 * pasted:
 *
 *   - The outermost element is the section's root, so it carries `id-{{ id }}`,
 *     `_class` and `visual_edit`. Without them the section is invisible to the
 *     editor — no outline row, nothing to drag, nothing to click.
 *   - Class names the site styles itself sit inside the brackets
 *     (`class="[ card ] flex"`), because the brackets are how the dock's CSS
 *     pane tells our names from Tailwind's utilities. Utilities stay outside.
 *
 * Which of the two a class is cannot be read off the markup — `card` could be
 * either — so the dialog asks. `tailwind` leaves the classes where they are;
 * `css` moves them into the brackets and scopes the stylesheet to the section,
 * so a rule named `.card` cannot reach the rest of the site.
 *
 * Everything here is text in, text out: no DOM, no fetch. What it produces is
 * handed to the same POST the dock saves with.
 */
import { bracketRun } from './css-scope.js';
import { parseHtmlTree } from './html-tree-parse.js';

/** What every section's root wears. The one copy, mirrored from SectionTypeMaker. */
export const VISUAL_EDIT = '{{ visual_edit outline_inside="true" section_orderable="true" }}';

/** A valid CSS class name — the same shape the dock accepts inside brackets. */
const PLAIN_CLASS = /^[a-zA-Z_][\w-]*$/;

/**
 * JSX attribute names that are spelled differently in HTML.
 *
 * Only the ones that change. SVG keeps `viewBox`, `preserveAspectRatio` and
 * `gradientTransform` camel-cased in HTML too, so a blanket camelCase-to-dash
 * rule would break every icon that was pasted in — which is most of them.
 */
const JSX_ATTRS = {
  acceptCharset: 'accept-charset',
  allowFullScreen: 'allowfullscreen',
  autoComplete: 'autocomplete',
  autoFocus: 'autofocus',
  autoPlay: 'autoplay',
  cellPadding: 'cellpadding',
  cellSpacing: 'cellspacing',
  className: 'class',
  clipPath: 'clip-path',
  clipRule: 'clip-rule',
  colSpan: 'colspan',
  crossOrigin: 'crossorigin',
  dateTime: 'datetime',
  encType: 'enctype',
  fillOpacity: 'fill-opacity',
  fillRule: 'fill-rule',
  formAction: 'formaction',
  frameBorder: 'frameborder',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
  maxLength: 'maxlength',
  minLength: 'minlength',
  noValidate: 'novalidate',
  playsInline: 'playsinline',
  readOnly: 'readonly',
  rowSpan: 'rowspan',
  spellCheck: 'spellcheck',
  srcSet: 'srcset',
  stopColor: 'stop-color',
  stopOpacity: 'stop-opacity',
  strokeDasharray: 'stroke-dasharray',
  strokeDashoffset: 'stroke-dashoffset',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
  strokeMiterlimit: 'stroke-miterlimit',
  strokeOpacity: 'stroke-opacity',
  strokeWidth: 'stroke-width',
  tabIndex: 'tabindex',
};

/**
 * Inline `<style>` and `<script>` out of the markup and into the panes that
 * own them.
 *
 * A section's CSS belongs in `style_push` and its JS in `script_push` — that
 * is where the dock reads them from, and a `<style>` left sitting in the
 * middle of the markup is one the CSS pane cannot see. `<script src="…">` has
 * no body to move, so it stays where it was put.
 */
export function peelAssets(source) {
  let html = String(source || '');
  const css = [];
  const js = [];

  html = html.replace(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi, (_all, inner) => {
    css.push(String(inner).trim());

    return '';
  });

  html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi, (all, attrs, inner) => {
    if (/\ssrc\s*=/i.test(attrs)) {
      return all;
    }

    js.push(String(inner).trim());

    return '';
  });

  return {
    html,
    css: css.filter(Boolean).join('\n\n'),
    js: js.filter(Boolean).join('\n\n'),
  };
}

/**
 * The JSX spellings, put back into HTML.
 *
 * Tailwind UI ships React, so what gets pasted is full of `className` and
 * `strokeWidth`, and `{' '}` where the markup needed a space. None of it is
 * wrong in a browser — it is simply ignored, which is worse, because the
 * design arrives unstyled with nothing to say why.
 *
 * `style={{ … }}` is not translated. It is an object, not a string, and a
 * guess at what it meant would be wrong often enough to matter — it is
 * reported instead, so the author can move it into the CSS pane.
 */
export function fromJsx(source) {
  let html = String(source || '');

  for (const [jsx, plain] of Object.entries(JSX_ATTRS)) {
    html = html.replace(new RegExp(`(\\s)${jsx}(\\s*=)`, 'g'), `$1${plain}$2`);
  }

  // JSX's spacer and its comments render as nothing in a browser but read as
  // text in Antlers, so they would show up on the page as `{' '}`.
  html = html.replace(/\{\s*['"]\s*['"]\s*\}/g, ' ');
  html = html.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');

  // A value in braces: `stroke-width={1.5}`, which a browser reads as the
  // seven characters `{1.5}` and draws at the wrong weight. Numbers and
  // quoted strings become the attribute value they meant; `={true}` becomes
  // the bare attribute. An object (`{{ … }}`) is not guessed at — it has no
  // inner braces to match here, and importNotes reports it instead.
  html = html.replace(/(\s[\w:-]+)=\{\s*(-?\d+(?:\.\d+)?|'[^'{}]*'|"[^"{}]*")\s*\}/g, (_all, attr, value) =>
    `${attr}="${value.replace(/^['"]|['"]$/g, '')}"`);
  html = html.replace(/(\s[\w:-]+)=\{\s*true\s*\}/g, '$1');
  html = html.replace(/\s[\w:-]+=\{\s*false\s*\}/g, '');

  return html;
}

/**
 * `{{` that was pasted, left as text rather than run as Antlers.
 *
 * Antlers reads the whole file, including whatever was imported, so a stray
 * `{{` from a JSX object or another template engine is a parse error that
 * takes the page down — not a visible mistake in one section. `@{{` is
 * Antlers' own escape: it renders the braces and runs nothing.
 *
 * Applied to the pasted text only, before our own tags are written in.
 */
export function escapeAntlers(source) {
  return String(source || '').replace(/(?<!@)\{\{/g, '@{{');
}

/** The class attribute's value, wherever one appears, rewritten in place. */
function rewriteClassValues(html, rewrite) {
  return String(html || '').replace(
    /(\sclass\s*=\s*)(["'])([^"']*)\2/gi,
    (_all, head, quote, value) => `${head}${quote}${rewrite(value)}${quote}`
  );
}

/** `[ … ]` already around part of the value: the dock's own mark, left alone. */
function hasBrackets(value) {
  return /(^|\s)\[(\s|$)/.test(String(value || ''));
}

/**
 * Class names moved inside the brackets — the plain-CSS half of the choice.
 *
 * `class="card card--wide"` becomes `class="[ card card--wide ]"`, which is
 * what makes the pasted stylesheet reachable: the dock's CSS pane lists the
 * bracketed names, offers them for editing and scopes their rules to this
 * section. Left outside, the same names are read as Tailwind utilities that
 * do not exist, and the section renders unstyled.
 *
 * A name the brackets cannot hold — `md:flex`, `w-1/2`, anything with a
 * character a CSS identifier may not start with — stays outside them, where
 * it still works.
 */
export function bracketClasses(html) {
  return rewriteClassValues(html, (value) => {
    if (hasBrackets(value)) {
      return value;
    }

    const names = value.trim().split(/\s+/).filter(Boolean);
    const ours = names.filter((name) => PLAIN_CLASS.test(name));
    const rest = names.filter((name) => !PLAIN_CLASS.test(name));

    if (!ours.length) {
      return value;
    }

    return `[ ${ours.join(' ')} ]${rest.length ? ` ${rest.join(' ')}` : ''}`;
  });
}

/** The attribute's value in an open tag, or '' when it has none. */
function attrValue(openTag, name) {
  const match = String(openTag || '').match(new RegExp(`\\s${name}\\s*=\\s*(["'])([^"']*)\\1`, 'i'));

  return match ? match[2] : '';
}

/** That attribute taken off the open tag, so ours can replace it. */
function withoutAttr(openTag, name) {
  return String(openTag || '').replace(new RegExp(`\\s${name}\\s*=\\s*(["'])[^"']*\\1`, 'i'), '');
}

/**
 * A class attribute read as two lists: the names that are ours and the ones
 * that are not.
 *
 * Brackets decide it when the value has them — by the time the root is made,
 * plain-CSS mode has already been through the markup, so the root's own names
 * are sitting inside a pair. Without brackets the shape of the name decides,
 * which is all there is to go on in Tailwind mode.
 */
function splitClasses(existing) {
  const value = String(existing || '').trim();
  const run = bracketRun(value);
  const names = (text) => text.trim().split(/\s+/).filter(Boolean);

  if (run) {
    return {
      ours: names(value.slice(run.innerFrom, run.innerTo)),
      rest: names(value.slice(0, run.from) + ' ' + value.slice(run.to)),
    };
  }

  const all = names(value);

  return {
    ours: all.filter((name) => PLAIN_CLASS.test(name)),
    rest: all.filter((name) => !PLAIN_CLASS.test(name)),
  };
}

/**
 * What the section's root class attribute reads, given what the element
 * already had.
 *
 * `_class` is the page loop's class for this section and is always first —
 * it is what `@scope(.{{ _class }})` in the CSS pane hangs on, so a rule
 * written later has something to attach to. In plain-CSS mode the element's
 * own names join it inside the brackets; in Tailwind mode they stay outside,
 * as utilities do.
 */
function rootClass(existing, mode) {
  const { ours, rest } = splitClasses(existing);

  if (mode !== 'css') {
    const all = [...ours, ...rest];

    return `[ {{ _class }} ]${all.length ? ` ${all.join(' ')}` : ''}`;
  }

  return `[ {{ _class }}${ours.length ? ` ${ours.join(' ')}` : ''} ]${rest.length ? ` ${rest.join(' ')}` : ''}`;
}

/** Elements at the top of the markup — what decides whether it needs wrapping. */
function roots(html) {
  return parseHtmlTree(html).filter((node) => node.tag);
}

/** Text outside the top-level elements, which a single root would swallow. */
function looseText(html, root) {
  if (!root) {
    return String(html || '').trim();
  }

  return (html.slice(0, root.from) + html.slice(root.to)).replace(/\{\{#[\s\S]*?#\}\}/g, '').trim();
}

/**
 * The section's root: the pasted element made into one, or a `<section>`
 * wrapped around markup that has no single element to promote.
 *
 * Promoting beats wrapping when there is one element to promote — a wrapper
 * around a `<section>` that was already a section is a second box with its own
 * margins, and the author has to go and delete it. Two elements side by side,
 * or an element with text beside it, have nothing to promote: one of them
 * would carry the section and the others would fall outside it.
 */
export function rootSection(html, mode) {
  const source = String(html || '');
  const top = roots(source);
  const only = top.length === 1 ? top[0] : null;

  if (only && !looseText(source, only)) {
    const open = source.slice(only.from, only.openTo);
    const klass = rootClass(attrValue(open, 'class'), mode);
    const tail = /\/>$/.test(open) ? ' />' : '>';
    const head = withoutAttr(withoutAttr(open, 'class'), 'id')
      .replace(/\s*\/?>$/, '')
      .replace(/^<\s*([a-zA-Z][\w-]*)/, '<$1');

    return (
      source.slice(0, only.from)
      + `${head} id="id-{{ id }}" class="${klass}" ${VISUAL_EDIT}${tail}`
      + source.slice(only.openTo)
    );
  }

  const body = source
    .split('\n')
    .map((line) => (line.trim() ? `    ${line}` : line))
    .join('\n')
    .replace(/^\n+|\n+$/g, '');

  return `<section id="id-{{ id }}" class="${rootClass('', mode)}" ${VISUAL_EDIT}>\n${body}\n</section>`;
}

/**
 * The pasted stylesheet, kept inside the section.
 *
 * `@scope(.{{ _class }})` is the site's own pattern (see any section partial):
 * the rules only apply within this section, so a `.card` or a `.button` from
 * a downloaded template cannot reach the rest of the page. Rules that are
 * already scoped, and at-rules that cannot be nested, are left as they were.
 */
export function scopeCss(css, mode) {
  const text = String(css || '').trim();

  if (!text || mode !== 'css' || /@scope\s*\(/.test(text)) {
    return text;
  }

  const body = text
    .split('\n')
    .map((line) => (line.trim() ? `  ${line}` : line))
    .join('\n');

  return `@scope(.{{ _class }}) {\n${body}\n}`;
}

/**
 * What the author is told after the paste, when the markup held something
 * this cannot carry across on its own.
 *
 * Not errors — the section is written either way. They are the two things a
 * browser would drop silently, and silence is what makes them expensive.
 */
export function importNotes(source) {
  const html = String(source || '');
  const notes = [];

  if (/\sstyle\s*=\s*@?\{/.test(html)) {
    notes.push('jsx_style');
  }

  if (/@\{\{/.test(html)) {
    notes.push('escaped_antlers');
  }

  return notes;
}

/**
 * Everything above, in the order the parts depend on each other.
 *
 * Assets come out first, because a `<style>` still in the markup would have
 * its selectors bracketed as if they were a class attribute. Antlers is
 * escaped before our own tags go in, so the escape cannot reach them. The
 * root is made last, once the classes are in their final shape.
 *
 * `mode` is 'tailwind' or 'css'. `css` and `js` are what the author typed in
 * the dialog's other two fields, joined with whatever was peeled out.
 *
 * `root` is false on a template, which is not a section: it has no `id`, no
 * `_class` and nothing to put on the page's outline, so the paste goes in as
 * the markup it is. The class and asset handling is the same either way.
 */
export function importedTemplate(source, { mode = 'tailwind', css = '', js = '', root = true } = {}) {
  const peeled = peelAssets(source);
  const plain = escapeAntlers(fromJsx(peeled.html));
  const classed = mode === 'css' ? bracketClasses(plain) : plain;

  const styles = [escapeAntlers(String(css || '').trim()), escapeAntlers(peeled.css)]
    .filter(Boolean)
    .join('\n\n');
  const scripts = [escapeAntlers(String(js || '').trim()), escapeAntlers(peeled.js)]
    .filter(Boolean)
    .join('\n\n');

  return {
    html: root ? rootSection(classed.trim(), mode) : classed.trim(),
    css: scopeCss(styles, mode),
    js: scripts,
    notes: importNotes(plain),
  };
}
