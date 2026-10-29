/**
 * Statamic's `{{ svg }}` as Build writes it: the tag Add's SVG tile writes,
 * the file swapped in a tag already in the file (Content), and the row the
 * Tailwind pane writes its class on (Style).
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: nothing. Pure — no editor, no bus, no DOM.
 * Bus messages: none.
 *
 * The row is the HTML tree's (html-tree-parse.js `addSvgs`): `src` the file,
 * `call` the tag's own name — `svg`, or `svg:hero` where the file is named in
 * the tag. `src` is written here, not by component-props.js `writeCallParam`:
 * on a partial `src` is the call's plumbing, which that reader steps over.
 */

/** A file Statamic's tag can be pointed at in a parameter: no quote to end it, no brace to make it Antlers. */
const FILE = /^[^"'{}]+$/;
/** The tag's `src` — the one html-tree-parse.js reads the row's file from. */
const SRC = /(^|\s)src\s*=\s*(["'])[^"']*\2/;

const clean = (src) => String(src ?? '').trim();

/** What the SVG tile writes for a file: the tag, with an empty class for Style to write into. */
export function svgMarkup(src) {
  const file = clean(src);

  return FILE.test(file) ? `{{ svg src="${file}" class="" }}` : '';
}

/**
 * The file `node` draws, swapped for `src`; nothing else in the tag moves.
 * `{{ svg:hero }}` names its file in the tag, so the name goes and `src`
 * takes its place. The tag starts where it started, so its path stays.
 * A file read from a field (`dynamic`) is the field's to choose: untouched.
 */
export function withSvgSrc(html, node, src) {
  const source = String(html || '');
  const file = clean(src);

  if (node?.kind !== 'svg' || node.dynamic || !FILE.test(file)) {
    return source;
  }

  const tag = source.slice(node.from, node.to);

  if (!tag.startsWith('{{') || !tag.endsWith('}}')) {
    return source;
  }

  const param = `src="${file}"`;
  const next = node.call && node.call !== 'svg' ? tag.replace(node.call, `svg ${param}`) : tag.replace(SRC, (whole, space) => `${space}${param}`);

  return source.slice(0, node.from) + next + source.slice(node.to);
}

/**
 * The row the Tailwind pane (tw-classes.js) picks for an `{{ svg }}`: a tag
 * call whose class parameter is `class` — the row the dock's cursor on one
 * hands it (dock/style-modes.js `tagCallAtCursor`). Null for any other row.
 */
export function svgClassRow(node) {
  return node?.kind === 'svg'
    ? { kind: 'component', tagCall: true, src: node.call, label: node.call, from: node.from, to: node.to, openTo: node.to, path: node.path }
    : null;
}
