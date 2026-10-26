/**
 * The HTML pane's list inside `{{ … }}`: what can go there, from the site
 * itself — offered while the name is typed, taken with Enter.
 *
 * - `{{ coll…`: the site's collections. Taking one writes the loop,
 *   `{{ collection from="employees" }} … {{ /collection }}`, the caret inside.
 * - inside a loop: the fields its rows have — a collection's blueprint, a
 *   list's own fields, an entry's basics — `{{ na…` offers `name`, `{{ ima…`
 *   offers `profile_image` ("Profile image").
 * - elsewhere: the section's own fields.
 * - in an image or picture component's `:imagePath="…`: only the assets
 *   fields in scope — `profile_image` in a loop over employees.
 *
 * The fields are the Data button's (`/!/sve/data-vars`, its Scope and Section
 * tabs, same cache); the collections the Control Panel's own list
 * (`sveCollections`). Nothing is guessed: what the site does not have is not
 * offered.
 *
 * May import: dock/*, lib/.
 */
import { antlersWord, closingAfter, collectionLoop, collectionOptions, fieldOptions, imagePathWord } from './antlers-options.js';
import { scopeDataRows, sectionDataRows } from './data-vars.js';
import { dockState } from './state.js';

export function antlersCompletions(win) {
  return async (context) => {
    const line = context.state.doc.lineAt(context.pos);
    const image = imagePathWord(context.state.sliceDoc(line.from, context.pos), context.pos);

    if (image) {
      return image.word === '' && !context.explicit ? null : imageFields(win, context, image);
    }

    const at = antlersWord(context.state.sliceDoc(line.from, context.pos), context.pos);

    if (!at || (at.word === '' && !context.explicit)) {
      return null;
    }

    const collections = collectionOptions(win.Statamic?.$config?.get?.('sveCollections') || [], at.word).map((row) => ({
      label: `collection from="${row.handle}"`,
      detail: row.title || row.handle,
      type: 'class',
      boost: 1,
      apply: (view, completion, from, to) => writeLoop(view, row.handle, from, to),
    }));

    const rows = await rowsAt(win, context.pos);

    if (context.aborted) {
      return null;
    }

    const fields = fieldOptions(rows, at.word).map((row) => ({
      label: row.var,
      detail: row.label && row.label !== row.var ? row.label : '',
      type: 'variable',
      apply: (view, completion, from, to) => writeName(view, row.var, from, to),
    }));

    const options = [...collections, ...fields];

    // Our own filtering and order (the site's), not CodeMirror's fuzzy match:
    // `collection:em` is matched by handle, `ima` by the label's words. Asked
    // again on each keystroke; the rows come from the Data button's cache.
    return options.length ? { from: at.from, options, filter: false } : null;
  };
}

/** The fields at the caret: a loop's rows inside one, the section's top level elsewhere. */
async function rowsAt(win, pos) {
  // Offsets into the whole template: the pane may show a slice of it.
  const offset = dockState.htmlScopeActive && dockState.htmlFocus ? dockState.htmlFocus.from : 0;
  const inLoop = await scopeDataRows(win, offset + pos).catch(() => []);

  return inLoop.length ? inLoop : (await sectionDataRows(win).catch(() => [])).filter((row) => !row.parent);
}

/** `:imagePath="…`: the assets fields in scope; taking one closes the quote unless it is closed. */
async function imageFields(win, context, at) {
  const rows = (await rowsAt(win, context.pos)).filter((row) => row.type === 'assets');

  if (context.aborted) {
    return null;
  }

  const options = fieldOptions(rows, at.word).map((row) => ({
    label: row.var,
    detail: row.label && row.label !== row.var ? row.label : '',
    type: 'variable',
    apply: (view, completion, from, to) => {
      const text = view.state.sliceDoc(to, to + 1) === '"' ? row.var : `${row.var}"`;

      view.dispatch({ changes: { from, to, insert: text }, selection: { anchor: from + text.length }, userEvent: 'input.complete' });
    },
  }));

  return options.length ? { from: at.from, options, filter: false } : null;
}

/** A field's name, and the tag's `}}` unless it is already there. */
function writeName(view, name, from, to) {
  const rest = view.state.sliceDoc(to, view.state.doc.lineAt(to).to);
  const text = closingAfter(rest) ? name : `${name} }}`;

  view.dispatch({ changes: { from, to, insert: text }, selection: { anchor: from + text.length }, userEvent: 'input.complete' });
}

/** The collection's loop in place of the word typed; a `}}` already after the caret is replaced, not doubled. */
function writeLoop(view, handle, from, to) {
  const line = view.state.doc.lineAt(from);
  const indent = (line.text.match(/^[ \t]*/) || [''])[0];
  const loop = collectionLoop(handle, indent);
  const closing = closingAfter(view.state.sliceDoc(to, line.to));

  view.dispatch({ changes: { from, to: to + closing, insert: loop.text }, selection: { anchor: from + loop.cursor }, userEvent: 'input.complete' });
}
