/**
 * Grey text without a model: worked out in the editor from the section's own
 * fields and the markup around the caret — free, and there at once. The AI
 * costs a request and a second or more (on Cursor many seconds), so the
 * moves every section is made of come from here, and only what these do not
 * cover goes to the AI:
 *
 * - an empty line in a <ul>/<ol>: the loop over the section's list field, an
 *   <li> inside it with the list's fields;
 * - an empty line inside such a loop: the item, or the next of its fields;
 * - an empty line elsewhere: the next field the file does not show yet;
 * - `{{ visual_` / `{{ visual_edit `: the field the element is for — the one
 *   its own content shows (`<b {{ visual_|>{{ name }}</b>` is `name`);
 * - `class="` on an element of a kind the file already styles: the same
 *   classes (the second card like the first);
 * - `x-data="{ `: a state to start from.
 *
 * A field is written the way its type is shown: a title as a heading, text as
 * a paragraph, rich text as a div, an image as the site's image component when
 * the file already uses it — each with its visual_edit, and an image or link
 * that may be empty inside {{ if }}.
 *
 * The rows are the Data button's (`var`, `type`, `label`, `parent`, `loop`).
 * The caret is read the way DockGhost\Caret reads it on the server.
 *
 * May import: nothing.
 */

/** Characters before the caret that are looked at. */
const TAIL = 4000;

/** Elements that never close. */
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

/** Field types written as text the author types. */
const TEXT = new Set(['text', 'textarea', 'bard', 'markdown']);

/** Field handles (or labels) that are a heading. */
const HEADING = /^(title|heading|headline|overskrift|titel)$/i;

/** One step of indentation in what is written. */
const STEP = '  ';

/**
 * The grey text for the caret at `pos` in `full`, or '' when these rules have
 * nothing — then the AI may be asked.
 */
export function instantSuggestion(full, pos, rows) {
  const text = String(full || '');
  const before = text.slice(0, pos);
  const after = text.slice(pos);
  const fields = (Array.isArray(rows) ? rows : []).filter((row) => row && typeof row.var === 'string' && row.var !== '');
  const caret = caretAt(before);

  if (caret.kind === 'attribute') {
    if (caret.attribute === 'x-data') {
      return alpineState(caret.value, after);
    }

    return caret.attribute === 'class' && caret.value === '' ? sameClasses(text, pos, caret.tag) : '';
  }

  if (caret.kind === 'antlers') {
    return visualEdit(caret, after, scopeFields(text, before, after, fields), fields);
  }

  if (caret.kind === 'markup' && caret.fresh) {
    return block(text, before, after, fields, caret);
  }

  return '';
}

/* ---- Where the caret stands ---------------------------------------------- */

/**
 * @returns {{ kind: 'attribute'|'antlers'|'tag'|'markup', tag?: string, attribute?: string, quote?: string, value?: string, text?: string, fresh?: boolean, indent?: string, inside?: string|null }}
 */
export function caretAt(before) {
  const tail = String(before).slice(-TAIL);
  const open = openTag(tail);

  if (open) {
    const [tag, inside] = open;

    if (inAntlers(inside)) {
      return { kind: 'antlers', tag, text: inside.slice(inside.lastIndexOf('{{')), opening: inside };
    }

    const match = inside.match(/([^\s=<>"'{}/]+)\s*=\s*(["'])((?:(?!\2)[\s\S])*)$/);

    if (match) {
      return { kind: 'attribute', tag, attribute: match[1], quote: match[2], value: match[3] };
    }

    return { kind: 'tag', tag };
  }

  if (inAntlers(tail)) {
    return { kind: 'antlers', text: tail.slice(tail.lastIndexOf('{{')) };
  }

  const line = String(before).match(/(?:^|\n)([ \t]*)$/);

  return { kind: 'markup', fresh: !!line, indent: line ? line[1] : '', inside: insideElement(tail) };
}

/** The opening tag the caret stands in, as [name, its text so far]; null when there is none. */
function openTag(tail) {
  const lt = tail.lastIndexOf('<');
  const name = lt === -1 ? null : tail.slice(lt).match(/^<([a-zA-Z][\w:.-]*)/);

  if (!name) {
    return null;
  }

  const inside = tail.slice(lt);
  const bare = inside
    .replace(/\{\{[\s\S]*?\}\}/g, '')
    .replace(/\{\{[\s\S]*$/, '')
    .replace(/"[^"]*"/g, '')
    .replace(/'[^']*'/g, '')
    .replace(/["'][\s\S]*$/, '');

  return bare.includes('>') ? null : [name[1], inside];
}

function inAntlers(text) {
  const open = text.lastIndexOf('{{');

  return open !== -1 && text.indexOf('}}', open) === -1;
}

/** The innermost element still open before the caret, or null. */
export function insideElement(tail) {
  const text = String(tail).replace(/\{\{[\s\S]*?\}\}/g, '');
  const stack = [];

  for (const [, closing, rawName, self] of text.matchAll(/<(\/?)([a-zA-Z][\w:.-]*)(?:"[^"]*"|'[^']*'|[^'">])*?(\/?)>/g)) {
    const name = rawName.toLowerCase();

    if (!closing) {
      if (!self && !VOID.has(name)) {
        stack.push(name);
      }

      continue;
    }

    const at = stack.lastIndexOf(name);

    if (at !== -1) {
      stack.length = at;
    }
  }

  return stack.length ? stack[stack.length - 1] : null;
}

/* ---- The section's fields ------------------------------------------------- */

/** A field's handle as it is written where it is used — a loop's fields bare. */
function handleOf(row) {
  const name = row.var.trim();

  return row.parent && name.startsWith(`${row.parent}.`) ? name.slice(row.parent.length + 1) : name;
}

/** The section's lists — fields looped over — each with its own fields. */
export function listsOf(fields) {
  const lists = new Map();

  for (const row of fields) {
    if (row.loop && !row.parent) {
      lists.set(row.var, lists.get(row.var) || []);
    }
  }

  for (const row of fields) {
    if (row.parent) {
      lists.set(row.parent, [...(lists.get(row.parent) || []), row]);
    }
  }

  return lists;
}

/** The innermost of `handles` opened as a loop before the caret and not closed. */
export function openLoop(before, handles) {
  const open = [];

  for (const [, closing, name] of String(before).slice(-TAIL).matchAll(/\{\{\s*(\/?)([A-Za-z_][\w.:]*)/g)) {
    if (!handles.has(name)) {
      continue;
    }

    if (!closing) {
      open.push(name);
    } else if (open.lastIndexOf(name) !== -1) {
      open.length = open.lastIndexOf(name);
    }
  }

  return open.length ? open[open.length - 1] : null;
}

/** Whether `text` already shows the field `name`. */
function shows(text, name) {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return new RegExp(`\\{\\{\\s*${esc}(?![\\w])|field="${esc}"|imagePath="${esc}"`).test(text);
}

/** The text of the loop `name` the caret stands in: from its opening tag to its closing one. */
function loopText(before, after, name) {
  const from = before.lastIndexOf(`{{ ${name}`) !== -1 ? before.lastIndexOf(`{{ ${name}`) : before.lastIndexOf(`{{${name}`);
  const close = after.search(new RegExp(`\\{\\{\\s*/${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\}\\}`));

  return before.slice(Math.max(0, from)) + (close === -1 ? after : after.slice(0, close));
}

/** The fields that count where the caret stands: a loop's own inside it, the section's top level outside. */
function scopeFields(text, before, after, fields) {
  const lists = listsOf(fields);
  const loop = openLoop(before, new Set(lists.keys()));

  if (loop) {
    return { rows: lists.get(loop), shown: loopText(before, after, loop) };
  }

  return { rows: fields.filter((row) => !row.parent && !lists.has(row.var)), shown: text };
}

/* ---- What is written ------------------------------------------------------ */

/** `x-data="{ |`: a state to start from. */
function alpineState(value, after) {
  const typed = value.trim();
  const closes = /^\s*\}/.test(after);

  if (typed === '') {
    return '{ open: false }';
  }

  if (typed === '{') {
    return `${value.endsWith(' ') ? '' : ' '}open: false${closes ? '' : ' }'}`;
  }

  return '';
}

/**
 * `{{ visual_` or `{{ visual_edit `: the rest of the tag, pointing at the
 * field the element shows — its content first, then its own attributes — or
 * else at the first field the scope has no visual_edit for yet.
 */
function visualEdit(caret, after, scope, fields) {
  const typed = caret.text.match(/^\{\{\s*(visual_(?:e(?:d(?:i(?:t)?)?)?)?)(\s*)$/);

  if (!typed) {
    return '';
  }

  const row = elementField(caret, after, [...scope.rows, ...fields])
    || scope.rows.find((candidate) => shown(candidate) && !new RegExp(`field="${handleOf(candidate)}"`).test(scope.shown));

  if (!row) {
    return '';
  }

  const word = typed[1];
  const rest = word === 'visual_edit' ? (typed[2] ? '' : ' ') : `${'visual_edit'.slice(word.length)} `;
  const close = /^\s*\}\}/.test(after) ? '' : ' }}';

  return `${rest}field="${handleOf(row)}"${TEXT.has(row.type) ? ' inline_edit="true"' : ''}${close}`;
}

/** The field the element the caret stands in shows: in its content (up to the next tag), else in its attributes. */
function elementField(caret, after, rows) {
  if (!caret.opening) {
    return null;
  }

  const end = after.indexOf('>');
  const content = end === -1 ? '' : after.slice(end + 1).split('<')[0];
  const attributes = caret.opening.slice(0, caret.opening.lastIndexOf('{{')) + (end === -1 ? '' : after.slice(0, end));

  for (const part of [content, attributes]) {
    for (const [, tag, image] of part.matchAll(/\{\{\s*([A-Za-z_]\w*)|imagePath="([A-Za-z_]\w*)"/g)) {
      const row = rows.find((candidate) => shown(candidate) && handleOf(candidate) === (tag || image));

      if (row) {
        return row;
      }
    }
  }

  return null;
}

/**
 * `class="` just opened: the classes the nearest element of the same kind
 * already has — before the caret if one does, else after. None with Antlers
 * in them; those are the author's own logic.
 */
function sameClasses(text, pos, tag) {
  const esc = String(tag).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let before = '';
  let after = '';

  for (const match of text.matchAll(new RegExp(`<${esc}\\b[^>]*?\\sclass="([^"{}]+)"`, 'gi'))) {
    if (match.index < pos) {
      before = match[1];
    } else if (!after) {
      after = match[1];
    }
  }

  return (before || after).trim();
}

/** Whether a field is shown on the page at all, as opposed to a setting. */
function shown(row) {
  return TEXT.has(row.type) || row.type === 'assets' || row.type === 'link';
}

/** A field as markup, line by line (indent relative), or null for one that is not shown. */
export function fieldLines(row, { heading = 'h2', image = false } = {}) {
  const name = handleOf(row);
  const edit = (extra = '') => `{{ visual_edit field="${name}"${extra} }}`;

  if (row.type === 'assets') {
    return image
      ? [`{{ if ${name} }}`, `${STEP}{{ partial:components/image :imagePath="${name}" }}`, '{{ /if }}']
      : [`{{ if ${name} }}`, `${STEP}<img src="{{ ${name}:url }}" alt="" ${edit()}>`, '{{ /if }}'];
  }

  if (row.type === 'link') {
    return [`{{ if ${name} }}`, `${STEP}<a href="{{ ${name} }}" ${edit()}>{{ ${name} }}</a>`, '{{ /if }}'];
  }

  if (row.type === 'bard' || row.type === 'markdown') {
    return [`<div ${edit(' inline_edit="true"')}>{{ ${name} }}</div>`];
  }

  if (row.type === 'text' || row.type === 'textarea') {
    const tag = HEADING.test(name) || HEADING.test(String(row.label || '').trim()) ? heading : 'p';

    return [`<${tag} ${edit(' inline_edit="true"')}>{{ ${name} }}</${tag}>`];
  }

  return null;
}

/** An empty line: a loop, an item, or the next field — or ''. */
function block(text, before, after, fields, caret) {
  const lists = listsOf(fields);
  const image = text.includes('partial:components/image');
  const loop = openLoop(before, new Set(lists.keys()));
  const list = caret.inside === 'ul' || caret.inside === 'ol';

  if (loop) {
    const rows = lists.get(loop).filter((row) => fieldLines(row) && !shows(loopText(before, after, loop), handleOf(row)));

    if (!rows.length) {
      return '';
    }

    // Inside an element the loop opened (the item): its next field. In the
    // loop itself: the item, with all of them.
    const start = before.lastIndexOf(`{{ ${loop}`);

    if (insideElement(before.slice(Math.max(0, start))) !== null) {
      return indent(fieldLines(rows[0], { heading: 'h3', image }), caret.indent);
    }

    return indent(item(list ? 'li' : 'div', rows.flatMap((row) => fieldLines(row, { heading: 'h3', image }))), caret.indent);
  }

  if (list) {
    // A list the file does not loop over yet; never a second loop over one it does.
    const [name, rows] = [...lists].find(([handle]) => !shows(text, handle)) || [];

    if (!name) {
      return '';
    }

    const lines = rows.flatMap((row) => fieldLines(row, { heading: 'h3', image }) || []);

    return indent([`{{ ${name} }}`, ...item('li', lines).map((line) => STEP + line), `{{ /${name} }}`], caret.indent);
  }

  // Elsewhere: the next of the section's own fields the file does not show.
  const next = fields.find((row) => !row.parent && !lists.has(row.var) && fieldLines(row) && !shows(text, handleOf(row)));

  return next ? indent(fieldLines(next, { image }), caret.indent) : '';
}

/** An item element around its fields: orderable, as a list's row is. */
function item(tag, lines) {
  return [`<${tag} {{ visual_edit orderable="true" }}>`, ...lines.map((line) => STEP + line), `</${tag}>`];
}

/** Lines joined, the second and later ones under the caret. */
function indent(lines, at) {
  return (lines || []).map((line, i) => (i === 0 ? line : at + line)).join('\n');
}
