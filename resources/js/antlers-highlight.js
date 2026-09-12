/**
 * Antlers in the HTML pane, coloured.
 *
 * CodeMirror's HTML language knows nothing of `{{ }}` — to it a template is one
 * long run of text between tags, so the logic that decides what the page is
 * made of reads as the least important thing in the file.
 *
 * A scan, not a parser. There is nothing here to keep in step with Antlers'
 * grammar, nothing to get wrong on an expression it has not seen, and the work
 * is a single pass over the document when the document changes. It runs in the
 * Control Panel only: the preview never loads this file, so nothing about the
 * rendered page gets slower for it.
 */

/** `{{# comment #}}` first, so it is not read as an ordinary tag. */
const ANTLERS = /\{\{#[\s\S]*?#\}\}|\{\{[\s\S]*?\}\}/g;

function build(state, cm, marks) {
  const builder = new cm.RangeSetBuilder();
  const text = state.doc.toString();

  ANTLERS.lastIndex = 0;

  let match = ANTLERS.exec(text);

  while (match) {
    const from = match.index;
    const to = from + match[0].length;
    const body = match[0];

    // One mark per tag, never nested: the builder wants its ranges in order,
    // and a name inside a tag it has already been handed is not in order.
    builder.add(
      from,
      to,
      body.startsWith('{{#') ? marks.comment : /^\{\{\s*\//.test(body) ? marks.close : marks.tag
    );

    match = ANTLERS.exec(text);
  }

  return builder.finish();
}

export function antlersDecorations(cm) {
  const marks = {
    tag: cm.Decoration.mark({ class: 'sve-cm-antlers' }),
    close: cm.Decoration.mark({ class: 'sve-cm-antlers sve-cm-antlers-close' }),
    comment: cm.Decoration.mark({ class: 'sve-cm-antlers-comment' }),
  };

  const field = cm.StateField.define({
    create(state) {
      return build(state, cm, marks);
    },
    update(value, tr) {
      return tr.docChanged ? build(tr.state, cm, marks) : value;
    },
    provide: (self) => cm.EditorView.decorations.from(self),
  });

  return { extensions: [field] };
}
