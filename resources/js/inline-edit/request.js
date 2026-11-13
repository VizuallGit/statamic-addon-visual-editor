/**
 * inline-edit.js — find the field, set the text, start editing.
 * Split out of inline-edit.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. inline-edit.js re-exports this file.
 */
import { sveState } from '../cp-state.js';
import { dataGet, deepestFieldPath, findPathByUid, unwrapRef } from '../lib/values.js';
import { activeContainers } from '../lib/publish-containers.js';
import { globalSectionEditorOpen } from '../global-section.js';
import { bardNodeText, normText, normalizeInlineBardValue, rowPathOf, writeBardFieldValue } from './bard-value.js';
import { EDITABLE_NODE_TYPES, editSession, handleEditRequest } from '../inline-edit.js';

/**
 * Find a Bard set (or other locked node) from the session original by its
 * preview `_visual_id` / attrs.id — used when whole-field edit re-serializes
 * text blocks but must keep set nodes in place.
 */
export function findPreservedBardNode(nodes, visualId) {
  if (!Array.isArray(nodes) || !visualId) {
    return null;
  }

  return (
    nodes.find((node) => {
      if (!node || node.type !== 'set') {
        return false;
      }

      const values = node.attrs?.values || {};

      return values._visual_id === visualId || node.attrs?.id === visualId;
    }) || null
  );
}

/**
 * Collects candidate edit targets for the clicked text within a field value.
 *
 * - string values match when their normalized text equals the clicked block's
 *   (or wrapper's) text.
 * - arrays are treated as Bard: heading/paragraph nodes match on flattened text.
 * - plain objects (group fields like section_heading) recurse one level so
 *   their string/Bard members are reachable.
 *
 * The caller requires EXACTLY one candidate — ambiguity means we cannot know
 * which value the user clicked, so editing is denied.
 */
export function resolveEditTargets(value, path, req, depth = 0) {
  if (typeof value === 'string') {
    const t = normText(value);

    if ((req.blockText !== null && t === req.blockText) || t === req.wrapperText) {
      return [{ mode: 'string', path }];
    }

    return [];
  }

  if (Array.isArray(value)) {
    if (req.blockText === null) {
      return [];
    }

    const out = [];

    value.forEach((node, i) => {
      if (node && EDITABLE_NODE_TYPES.includes(node.type) && normText(bardNodeText(node)) === req.blockText) {
        out.push({ mode: 'bard', path, index: i });
      }
    });

    return out;
  }

  if (value && typeof value === 'object' && depth < 2) {
    let out = [];

    for (const key of Object.keys(value)) {
      out = out.concat(resolveEditTargets(value[key], `${path}.${key}`, req, depth + 1));
    }

    return out;
  }

  return [];
}

/** HTML tag → ProseMirror mark type for inline content parsing. */
const MARK_TAGS = {
  STRONG: 'bold',
  B: 'bold',
  EM: 'italic',
  I: 'italic',
  U: 'underline',
  S: 'strike',
  STRIKE: 'strike',
  DEL: 'strike',
  CODE: 'code',
  SUB: 'subscript',
  SUP: 'superscript',
};

// bard-texstyle span-type styles that inline editing can toggle. A <span> whose
// class is one of these maps to a btsSpan ProseMirror mark; any other span is
// treated as transparent styling. Mirrors the span-type entries in
// config/statamic/bard_texstyle.php — extend here if the site adds more.
export const BTS_SPAN_CLASSES = ['uppercase'];

function sameMarks(a, b) {
  return JSON.stringify(a || []) === JSON.stringify(b || []);
}

/**
 * Parses the innerHTML of an inline-edited block back into ProseMirror inline
 * content. Semantic tags become marks; everything else (site spans, styling
 * wrappers) is transparent — only its text survives. This intentionally
 * ignores presentation-only markup the site's own JS may have injected
 * (e.g. word-reveal <span>s around headline words).
 */
export function parseInlineHtml(html, doc = document, spanClasses = BTS_SPAN_CLASSES) {
  const root = doc.createElement('div');

  root.innerHTML = html;

  const out = [];

  const pushText = (text, marks) => {
    if (!text) {
      return;
    }

    const last = out[out.length - 1];

    if (last && last.type === 'text' && sameMarks(last.marks, marks)) {
      last.text += text;

      return;
    }

    const node = { type: 'text', text };

    if (marks.length) {
      node.marks = marks.map((m) => ({ ...m }));
    }

    out.push(node);
  };

  const walk = (node, marks) => {
    for (const child of node.childNodes) {
      if (child.nodeType === 3) {
        // Collapse whitespace like HTML rendering does — pretty-printed
        // template markup must not leak literal newlines/indentation into text.
        pushText(child.nodeValue.replace(/\u00a0/g, ' ').replace(/\s+/g, ' '), marks);
      } else if (child.nodeType === 1) {
        if (child.tagName === 'BR') {
          out.push({ type: 'hardBreak' });
          continue;
        }

        let childMarks = marks;
        const markType = MARK_TAGS[child.tagName];

        if (markType) {
          childMarks = [...marks, { type: markType }];
        } else if (child.tagName === 'A') {
          const attrs = { href: child.getAttribute('href') };

          for (const attr of ['target', 'rel', 'title']) {
            if (child.getAttribute(attr)) {
              attrs[attr] = child.getAttribute(attr);
            }
          }

          childMarks = [...marks, { type: 'link', attrs }];
        } else if (child.tagName === 'SPAN') {
          // Vizuall bard-style mark (span[data-vizu] style="prop: value").
          // Also accept colour-only spans without data-vizu (inline colour from
          // the preview toolbar / browser execCommand leftovers).
          const style = child.getAttribute('style') || '';
          const hasVizu = child.hasAttribute('data-vizu');
          const colorOnly = !hasVizu && /(?:^|;)\s*color\s*:/i.test(style);

          if ((hasVizu || colorOnly) && style) {
            childMarks = [...marks, { type: 'vizuStyle', attrs: { style } }];
          } else if (/(?:^|;)\s*font-weight\s*:\s*(bold|[6-9]00)/i.test(style)) {
            childMarks = [...marks, { type: 'bold' }];
          } else if (/(?:^|;)\s*font-style\s*:\s*italic/i.test(style)) {
            childMarks = [...marks, { type: 'italic' }];
          } else {
            // bard-texstyle span marks (e.g. class="uppercase"). Only recognized
            // classes become a btsSpan mark; other spans (site-injected styling
            // wrappers like the hero word-reveal spans) stay transparent.
            const btsClass = [...child.classList].find((c) => spanClasses.includes(c));

            if (btsClass) {
              childMarks = [...marks, { type: 'btsSpan', attrs: { class: btsClass } }];
            }
          }
        }

        walk(child, childMarks);
      }
    }
  };

  walk(root, []);

  // Whitespace belongs between words, not inside a style.
  //
  // Dragging a selection across a word takes the spaces on either side of it far
  // more often than not, and colouring that selection puts them inside the mark:
  // `Indtast<span> din </span>overskrift` rather than `Indtast <span>din</span>
  // overskrift`. Both read the same on the page the moment it is made, so the
  // mistake is invisible — but the boundary is now whitespace, and every later
  // pass over it (a re-render, a font-tag change, the next inline edit) trims and
  // re-merges those edges, until the gap sits on the wrong side of the span or
  // stops existing. It shows up as words running into a coloured word, and only
  // for text somebody has styled.
  //
  // Pushed back out, the same words always produce the same nodes, and there is
  // no edge left for a later pass to move.
  const spaced = [];

  for (const node of out) {
    if (node.type !== 'text' || !node.marks?.length) {
      spaced.push(node);

      continue;
    }

    const lead = /^\s+/.exec(node.text)?.[0] || '';
    const core = node.text.slice(lead.length).replace(/\s+$/, '');
    const trail = node.text.slice(lead.length + core.length);

    // A marked run of nothing but spaces is spacing, not styling.
    if (!core) {
      spaced.push({ type: 'text', text: node.text });

      continue;
    }

    if (lead) {
      spaced.push({ type: 'text', text: lead });
    }

    spaced.push({ ...node, text: core });

    if (trail) {
      spaced.push({ type: 'text', text: trail });
    }
  }

  // The split can leave neighbours that belong together (an unmarked tail beside
  // the unmarked text that followed it) — same merge `pushText` does on the way in.
  out.length = 0;

  for (const node of spaced) {
    const last = out[out.length - 1];

    if (node.type === 'text' && last?.type === 'text' && sameMarks(last.marks, node.marks || [])) {
      last.text += node.text;

      continue;
    }

    out.push(node);
  }

  // Trim block edges and collapse duplicate spaces across node boundaries.
  for (let i = 0; i < out.length; i++) {
    const node = out[i];

    if (node.type !== 'text') {
      continue;
    }

    if (i === 0) {
      node.text = node.text.replace(/^\s+/, '');
    }

    if (i === out.length - 1) {
      node.text = node.text.replace(/\s+$/, '');
    }

    const prev = out[i - 1];

    if (prev && prev.type === 'text' && prev.text.endsWith(' ') && node.text.startsWith(' ')) {
      node.text = node.text.replace(/^ +/, '');
    }
  }

  return out.filter((n) => n.type !== 'text' || n.text !== '');
}

/** innerText → stored string: nbsp → space, strip the trailing newline(s). */
export function cleanEditedText(text) {
  return (text || '').replace(/\u00a0/g, ' ').replace(/\n+$/, '');
}

/** Fieldtypes whose template-drawn placeholder can become their value. */
const STARTING_TEXT_TYPES = ['bard', 'text', 'textarea'];

/**
 * Where a preview field lives in one container's values: the scope's row plus
 * the handle, or the deepest row under it that owns the handle (synced
 * sections whose nested block ids were stripped). Null when the scope belongs
 * to another container.
 */
function fieldPathIn(values, data) {
  let basePath = '';

  if (data.scope) {
    basePath = findPathByUid(values, data.scope);

    if (basePath === null) {
      return null;
    }
  }

  let path = [basePath, data.field].filter(Boolean).join('.');
  let value = dataGet(values, path);

  if (value === undefined && data.field && basePath !== '') {
    const deepPath = deepestFieldPath(dataGet(values, basePath), data.field, basePath);

    if (deepPath) {
      path = deepPath;
      value = dataGet(values, path);
    }
  }

  return { basePath, path, value };
}

/**
 * Makes the copy a template drew in an empty field that field's value, on click.
 *
 * Each place draws its own starting text (`placeholder=` plus the template's
 * `{{ if empty }}` branch) instead of the fieldset holding one `default:`. The
 * form never saw that text: the side panel stood empty, and an inline edit
 * started on nothing. Same answer as applyDeclaredDefaults — make the value
 * real. Only ever into an empty field, in the field's own shape; from then on
 * it is ordinary text, in the panel, to be kept or deleted.
 */
export function applyStartingText(data, doc) {
  const start = data.startingText;
  const text = typeof start?.text === 'string' ? start.text : '';

  if (!text || !data.field || !STARTING_TEXT_TYPES.includes(start.fieldtype)) {
    return;
  }

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const at = fieldPathIn(values, data);

    if (!at) {
      continue;
    }

    // A new row often has no key yet (`headline` missing, not `headline: []`).
    if (at.value === undefined) {
      const row = at.basePath ? dataGet(values, at.basePath) : null;

      if (!row || typeof row !== 'object' || Array.isArray(row)) {
        continue;
      }
    }

    const empty =
      at.value == null ||
      at.value === '' ||
      (Array.isArray(at.value) &&
        at.value.every(
          (node) => node && EDITABLE_NODE_TYPES.includes(node.type) && normText(bardNodeText(node)) === ''
        ));

    if (!empty) {
      return;
    }

    if (start.fieldtype !== 'bard') {
      container.setFieldValue(at.path, text);

      return;
    }

    const value = start.bardInline
      ? normalizeInlineBardValue(text)
      : [{ type: 'paragraph', content: [{ type: 'text', text }] }];

    writeBardFieldValue(container, at.path, value, doc, { field: data.field, scope: data.scope });

    return;
  }
}

/**
 * Inline edit on a focused global section needs the side panel's values. The
 * iframe can take a beat to hydrate — hold the request and retry once it does,
 * instead of denying and making the click feel dead.
 */
export function queueEditUntilPanelReady(data, doc, win) {
  if (!globalSectionEditorOpen(doc) || sveState.sectionPanelValues?.values) {
    return false;
  }

  sveState.pendingEditUntilPanel = { data, doc, win };

  return true;
}

export function flushPendingEditUntilPanel() {
  if (!sveState.pendingEditUntilPanel || !sveState.sectionPanelValues?.values) {
    return;
  }

  const { data, doc, win } = sveState.pendingEditUntilPanel;

  sveState.pendingEditUntilPanel = null;
  handleEditRequest(data, doc, win);
}

/**
 * A quick control in the preview toolbar changed (controls="font_tag|size"):
 * write the sibling field on the row being edited. The value poll streams the
 * re-render back out, so the block redraws with its new setting.
 */
export function handleEditControl(data) {
  if (!editSession || editSession.requestId !== data.requestId) {
    return;
  }

  if (typeof data.handle !== 'string' || !data.handle) {
    return;
  }

  const row = rowPathOf(editSession.path);

  editSession.container.setFieldValue(row ? `${row}.${data.handle}` : data.handle, data.value);
}
