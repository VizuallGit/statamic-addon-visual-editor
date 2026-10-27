/**
 * The dock's own lists, read out of code-dock.js for the Build tests.
 *
 * Build arranges the dock's tools; it never defines them. So its tests run
 * against the dock's real HTML_TOOLS, HTML_DIVS, HTML_HEADINGS and
 * CSS_TOOLS — the day the dock gains a tool, these tests see it. code-dock.js
 * cannot be imported in node (its barrel pulls in the dock's Vue files), so
 * the literal blocks are cut out of its source and evaluated on their own.
 * They are plain data; a block that stops being plain data fails here first.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SOURCE = readFileSync(fileURLToPath(new URL('../../../resources/js/code-dock.js', import.meta.url)), 'utf8');

function slice(from, to, after = 0) {
  const start = SOURCE.indexOf(from);
  const end = SOURCE.indexOf(to, Math.max(start + 1, after));

  if (start === -1 || end === -1) {
    throw new Error(`code-dock.js no longer has ${from} … ${to}`);
  }

  return SOURCE.slice(start, end).replace(/^export /gm, '');
}

function evaluate(body, names) {
  // eslint-disable-next-line no-new-func
  return new Function(`${body}\nreturn { ${names.join(', ')} };`)();
}

const html = evaluate(slice('export const HTML_HEADINGS', 'export const CSS_SPACING'), ['HTML_HEADINGS', 'HTML_DIVS', 'HTML_TOOLS']);
const tools = evaluate(slice('const boxKids', 'export const CSS_LENGTHS'), ['CSS_TOOLS']);
const twIcons = evaluate(slice('export const TW_TOOL_ICONS', 'export const STRIP_ICON'), ['TW_TOOL_ICONS']);
const cssIcons = evaluate(slice('export const CSS_TOOL_ICONS', '\nexport ', SOURCE.indexOf('export const CSS_TOOL_ICONS') + 1), ['CSS_TOOL_ICONS']);

export const HTML_HEADINGS = html.HTML_HEADINGS;
export const HTML_DIVS = html.HTML_DIVS;
export const HTML_TOOLS = html.HTML_TOOLS;
export const CSS_TOOLS = tools.CSS_TOOLS;
export const TW_TOOL_ICONS = twIcons.TW_TOOL_ICONS;
export const CSS_TOOL_ICONS = cssIcons.CSS_TOOL_ICONS;
