/**
 * Put the indentation back, without touching anything else.
 *
 * Re-indents only: every line keeps its content and its place in the file, and
 * only the whitespace in front of it is rewritten. Nothing is joined, nothing is
 * split, no attribute is reordered, no text is reflowed — so a file that was
 * readable before is readable after, and one that drifted while blocks were
 * dragged around lines up again.
 *
 * The depth comes from the same parse the HTML tree is drawn from, so `{{ if }}`
 * and `{{ collection }}` count as nesting exactly as they do in the panel, and
 * `{{ partial }}` does not (it is one line, wherever it sits).
 */
import { parseTemplateTree } from './html-tree-parse.js';

/** Whitespace inside these is content. Their lines are returned untouched. */
const VERBATIM = new Set(['pre', 'textarea', 'script', 'style']);

/** A line that closes something sits with what it closes, not with its body. */
const CLOSES = /^(<\/|\{\{\s*\/)/;

/** The file's own indent, so tidying does not convert anybody's four to two. */
function detectIndent(html) {
  let best = 0;

  for (const line of html.split('\n')) {
    if (!line.trim()) {
      continue;
    }

    const width = line.length - line.trimStart().length;

    if (width > 0 && (best === 0 || width < best)) {
      best = width;
    }
  }

  return ' '.repeat(best === 2 || best === 3 ? best : 4);
}

export function tidyHtml(source) {
  const html = String(source || '');

  if (!html.trim()) {
    return html;
  }

  const nodes = [];
  const walk = (list) => {
    for (const node of list || []) {
      nodes.push(node);
      walk(node.children);
    }
  };

  walk(parseTemplateTree(html));

  const unit = detectIndent(html);
  const out = [];
  let offset = 0;

  for (const line of html.split('\n')) {
    const start = offset;
    const trimmed = line.trim();

    offset += line.length + 1;

    if (!trimmed) {
      out.push('');

      continue;
    }

    const first = start + (line.length - line.trimStart().length);
    const inside = nodes.filter((node) => node.from < first && first < node.to);

    if (inside.some((node) => VERBATIM.has(node.tag))) {
      out.push(line);

      continue;
    }

    // A line that starts a node is not inside it, so it lands at the depth of
    // whatever holds it. A line that closes one is inside it, and comes back
    // out. `{{ else }}` needs neither: the parse makes each branch its own.
    const depth = inside.length - (CLOSES.test(trimmed) ? 1 : 0);

    out.push(unit.repeat(Math.max(depth, 0)) + trimmed);
  }

  return out.join('\n');
}
