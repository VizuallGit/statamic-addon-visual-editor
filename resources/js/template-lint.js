/**
 * What is wrong with a template, in words a designer can act on.
 *
 * Not a validator. A light pass for the mistakes that make Live Preview look
 * broken without saying why: a `<div>` that never closes, a `</section>` with
 * nothing to close, an `{{ if }}` without its `{{ /if }}`, a `{{ title` that
 * never gets its `}}`. Whatever Antlers has to decide — whether a value is a
 * loop, what a partial renders — is left to the server.
 *
 * Two readers, one offset space. Antlers is scanned first, with nesting
 * understood (`{{ glide width="{{ w }}" }}` is one tag, a `{{# comment #}}`
 * may hold anything), then blanked to spaces so CodeMirror's HTML parser reads
 * the markup alone. An offset in the blanked text is the same offset in the
 * source, so every finding points at the characters that were typed.
 *
 * A finding is a key into resources/lang plus the words for its placeholders;
 * dock/problems.js puts them into sentences and lines.
 *
 * Measured before it was written: over the site's 103 templates the rules
 * flag exactly one file, and that one is broken (`{{ visual_edit … ">` with
 * no `}}`). `{{ responsive_css }}` stands alone legally, `switch(...)` is a
 * single tag, and a `<div>` opened in one `{{ if }}` branch and closed after
 * the `{{ /if }}` is a pattern the site uses — none of those are flagged.
 *
 * May import: nothing. The HTML parser (`htmlLanguage.parser` from
 * @codemirror/lang-html) is handed in, so the rules run in a node test without
 * an editor.
 */

/** Tags that have no closing tag. */
const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr',
]);

/** Tags HTML itself closes for you. Leaving them open is legal, so it is not a finding. */
const IMPLICIT = new Set([
  'p', 'li', 'dt', 'dd', 'tr', 'td', 'th', 'option', 'optgroup', 'thead',
  'tbody', 'tfoot', 'colgroup', 'caption', 'rb', 'rt', 'rtc', 'rp', 'html',
  'head', 'body',
]);

/**
 * Antlers tags that only exist as a pair. Any other name may be a value or a
 * single tag (`{{ responsive_css }}`, `{{ svg }}`, `{{ switch(...) }}`), and
 * whether it was meant as a loop is not something a reader can tell.
 */
const PAIR_ONLY = new Set([
  'if', 'unless', 'style_push', 'script_push', 'sve_defaults', 'once',
  'noparse', 'foreach', 'forelse',
]);

const CLOSE_TAGS = new Set(['CloseTag', 'MismatchedCloseTag', 'IncompleteCloseTag']);

/** The first word of a tag body: `/`, then a name with the characters Antlers allows. */
const HEAD = /^\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.:-]*)([\s\S]*)$/;

/** The name on an opening `{{` that never closed, for the sentence. */
const OPEN_NAME = /^\{\{\s*\/?\s*([A-Za-z_][A-Za-z0-9_.:-]*)/;

const LIMIT = 300000;

/**
 * Every outermost `{{ … }}` in the source, and every `{{` that never comes
 * back to depth zero.
 *
 * @returns {{ tags: Array<{ from: number, to: number, comment: boolean, body: string }>, unclosed: number[] }}
 */
export function scanAntlers(source) {
  const src = String(source || '');
  const tags = [];
  const unclosed = [];
  let i = 0;

  while (i < src.length) {
    const open = src.indexOf('{{', i);

    if (open === -1) {
      break;
    }

    if (src.startsWith('{{#', open)) {
      const end = src.indexOf('#}}', open + 3);

      if (end === -1) {
        unclosed.push(open);
        break;
      }

      tags.push({ from: open, to: end + 3, comment: true, body: '' });
      i = end + 3;
      continue;
    }

    let depth = 0;
    let j = open;
    let end = -1;

    while (j < src.length) {
      if (src.startsWith('{{', j)) {
        depth += 1;
        j += 2;
        continue;
      }

      if (src.startsWith('}}', j)) {
        depth -= 1;
        j += 2;

        if (depth === 0) {
          end = j;
          break;
        }

        continue;
      }

      j += 1;
    }

    if (end === -1) {
      unclosed.push(open);
      i = open + 2;
      continue;
    }

    tags.push({ from: open, to: end, comment: false, body: src.slice(open + 2, end - 2) });
    i = end;
  }

  return { tags, unclosed };
}

function blank(src, tags) {
  let out = src;

  for (const tag of tags) {
    out = out.slice(0, tag.from) + ' '.repeat(tag.to - tag.from) + out.slice(tag.to);
  }

  return out;
}

/** `{{ /collection }}` closes `{{ collection:blog }}`: the closer may drop what follows the colon. */
function closes(open, want) {
  return open === want || open.startsWith(`${want}:`);
}

function tagNameAt(text, at) {
  return (text.slice(at, at + 80).match(/^<\/?([A-Za-z][A-Za-z0-9:-]*)/)?.[1] || '').toLowerCase();
}

/**
 * The Antlers findings, and the `{{ if }}` branches the HTML pass needs.
 */
function lintAntlers(src, tags, unclosed, problems) {
  for (const at of unclosed) {
    const name = src.slice(at, at + 80).match(OPEN_NAME)?.[1] || '…';

    problems.push({ from: at, to: at + 2, key: 'code_dock_problem_antlers_unclosed', args: { name } });
  }

  const stack = [];
  const branches = [];

  for (const tag of tags) {
    if (tag.comment) {
      continue;
    }

    const head = tag.body.match(HEAD);

    if (!head) {
      continue;
    }

    const closing = !!head[1];
    const name = head[2].toLowerCase();
    const rest = head[3];

    if (!closing && (name === 'elseif' || name === 'else')) {
      let at = -1;

      for (let i = stack.length - 1; i >= 0; i -= 1) {
        if (stack[i].name === 'if' || stack[i].name === 'unless') {
          at = i;
          break;
        }
      }

      if (at === -1) {
        problems.push({ from: tag.from, to: tag.to, key: 'code_dock_problem_branch_stray', args: { name } });
        continue;
      }

      // The branch before this one is over; this tag opens the next, under the same `if`.
      branches.push({ from: stack[at].to, to: tag.from });
      stack[at] = { ...stack[at], to: tag.to };
      stack.length = at + 1;
      continue;
    }

    if (closing || name === 'endif' || name === 'endunless') {
      const want = name === 'endif' ? 'if' : name === 'endunless' ? 'unless' : name;
      let at = -1;

      for (let i = stack.length - 1; i >= 0; i -= 1) {
        if (closes(stack[i].name, want)) {
          at = i;
          break;
        }
      }

      if (at === -1) {
        problems.push({ from: tag.from, to: tag.to, key: 'code_dock_problem_pair_stray', args: { name: want } });
        continue;
      }

      // What was still open above the match never closed — a value most of
      // the time, which is nobody's mistake, but a pair-only tag is.
      for (const skipped of stack.slice(at + 1)) {
        if (PAIR_ONLY.has(skipped.name)) {
          problems.push({
            from: skipped.from,
            to: skipped.to,
            key: 'code_dock_problem_pair_unclosed',
            args: { name: skipped.name },
          });
        }
      }

      if (want === 'if' || want === 'unless') {
        branches.push({ from: stack[at].to, to: tag.from });
      }

      stack.length = at;
      continue;
    }

    // `{{ total = 1 }}` assigns; it opens nothing.
    if (rest.trim().startsWith('=')) {
      continue;
    }

    stack.push({ name, from: tag.from, to: tag.to });
  }

  for (const open of stack) {
    if (PAIR_ONLY.has(open.name)) {
      problems.push({ from: open.from, to: open.to, key: 'code_dock_problem_pair_unclosed', args: { name: open.name } });
    }
  }

  return branches;
}

/**
 * The HTML findings, read off the parser's tree of the blanked text.
 *
 * An element with an opening tag and no closing tag of any kind is unclosed —
 * unless the tag is void, HTML closes it itself, or it was opened inside one
 * `{{ if }}` branch and reaches past it: then the other branch has its own
 * opening tag and one `</div>` after the `{{ /if }}` closes whichever ran.
 */
function lintHtml(text, parser, branches, problems) {
  const tree = parser.parse(text);
  const unfinished = new Set();
  const found = [];

  tree.iterate({
    enter(ref) {
      if (ref.name === 'MismatchedCloseTag') {
        found.push({ from: ref.from, to: ref.to, key: 'code_dock_problem_tag_stray', args: { tag: tagNameAt(text, ref.from) } });
        return;
      }

      if (ref.name === 'IncompleteCloseTag') {
        found.push({ from: ref.from, to: ref.to, key: 'code_dock_problem_tag_unfinished', args: { tag: tagNameAt(text, ref.from) } });
        return;
      }

      if (ref.type.isError) {
        const parent = ref.node.parent;

        if (parent && (parent.name === 'OpenTag' || parent.name === 'CloseTag')) {
          unfinished.add(parent.from);
          found.push({
            from: parent.from,
            to: Math.max(parent.from + 1, ref.from),
            key: 'code_dock_problem_tag_unfinished',
            args: { tag: tagNameAt(text, parent.from) },
          });
        }

        return;
      }

      if (ref.name !== 'Element') {
        return;
      }

      let open = null;
      let closed = false;

      for (let child = ref.node.firstChild; child; child = child.nextSibling) {
        if (child.name === 'OpenTag') {
          open = child;
        }

        if (CLOSE_TAGS.has(child.name)) {
          closed = true;
        }
      }

      if (!open || closed) {
        return;
      }

      const tag = tagNameAt(text, open.from);

      if (!tag || VOID.has(tag) || IMPLICIT.has(tag)) {
        return;
      }

      if (branches.some((branch) => open.from >= branch.from && open.from < branch.to && ref.to > branch.to)) {
        return;
      }

      found.push({ from: open.from, to: open.to, key: 'code_dock_problem_tag_unclosed', args: { tag } });
    },
  });

  for (const problem of found) {
    // A tag that was never finished is one finding, not two.
    if (problem.key === 'code_dock_problem_tag_unclosed' && unfinished.has(problem.from)) {
      continue;
    }

    problems.push(problem);
  }
}

/**
 * @param {string} source   the template as typed
 * @param {{ parse: (text: string) => any }} parser   @codemirror/lang-html's `htmlLanguage.parser`
 * @returns {Array<{ from: number, to: number, key: string, args: Record<string, string> }>}
 *   in document order. Empty for a template with nothing to say about, and
 *   empty rather than thrown for one the readers cannot get through.
 */
export function lintTemplate(source, parser) {
  const src = String(source || '');

  if (!src.trim() || src.length > LIMIT) {
    return [];
  }

  const problems = [];

  try {
    const { tags, unclosed } = scanAntlers(src);
    const branches = lintAntlers(src, tags, unclosed, problems);

    if (parser) {
      lintHtml(blank(src, tags), parser, branches, problems);
    }
  } catch {
    return [];
  }

  const seen = new Set();

  return problems
    .sort((a, b) => a.from - b.from || a.to - b.to)
    .filter((problem) => {
      const id = `${problem.from}:${problem.key}`;

      if (seen.has(id)) {
        return false;
      }

      seen.add(id);

      return true;
    });
}

/**
 * The editor side: a field that holds the findings for the current document
 * and underlines each one. Read the findings back with
 * `state.field(field).problems`.
 *
 * @param {{ Decoration, StateField, RangeSetBuilder, EditorView }} cm
 * @param {{ parse: (text: string) => any }} parser
 */
export function templateLintDecorations(cm, parser) {
  const mark = cm.Decoration.mark({ class: 'sve-cm-problem' });

  const build = (state) => {
    const problems = lintTemplate(state.doc.toString(), parser);
    const builder = new cm.RangeSetBuilder();
    let last = 0;

    for (const problem of problems) {
      // The builder wants its ranges in order and apart; a finding inside
      // one already drawn keeps its row in the list but not a second line.
      if (problem.from < last || problem.to <= problem.from) {
        continue;
      }

      builder.add(problem.from, problem.to, mark);
      last = problem.to;
    }

    return { problems, decorations: builder.finish() };
  };

  const field = cm.StateField.define({
    create(state) {
      return build(state);
    },
    update(value, tr) {
      return tr.docChanged ? build(tr.state) : value;
    },
    provide: (self) => cm.EditorView.decorations.from(self, (value) => value.decorations),
  });

  return { field, extensions: [field] };
}
