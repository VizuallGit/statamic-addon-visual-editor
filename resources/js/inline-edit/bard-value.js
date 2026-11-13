/**
 * inline-edit.js — a Bard value into and out of the form.
 * Split out of inline-edit.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. inline-edit.js re-exports this file.
 */
import { dataGet } from '../lib/values.js';
import { syncBardEditorFromValue } from '../inline-edit.js';

/** Write Bard JSON to the form AND force the sidebar TipTap view to match. */
export function writeBardFieldValue(container, path, value, doc, session) {
  const next = JSON.parse(JSON.stringify(value));

  container.setFieldValue(path, next);
  syncBardEditorFromValue(doc, session?.field, session?.scope, next);
}

/** The row a field path sits in ("…blocks.1.headline" → "…blocks.1"). */
export function rowPathOf(fieldPath) {
  return fieldPath.includes('.') ? fieldPath.slice(0, fieldPath.lastIndexOf('.')) : '';
}

/**
 * Current values of the sibling fields the preview toolbar asked for
 * (controls="font_tag|size"), so it can render them pre-selected.
 */
export function controlValues(values, fieldPath, handles) {
  if (!Array.isArray(handles) || !handles.length) {
    return null;
  }

  const row = rowPathOf(fieldPath);
  const out = {};

  for (const handle of handles) {
    if (typeof handle === 'string' && handle) {
      out[handle] = dataGet(values, row ? `${row}.${handle}` : handle);
    }
  }

  return out;
}

/**
 * Whitespace-normalizes text for comparison across the preview DOM and the CP
 * form values: nbsp → space, collapse runs, trim. Duplicated in bridge.js
 * because the two files run in separate bundles (CP window vs. preview iframe).
 */
export function normText(s) {
  return (s || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Flattens a ProseMirror node to plain text for comparison with the preview
 * DOM's textContent. hardBreak maps to '' — <br> contributes nothing to
 * textContent, so both sides must agree ("råvarer.<br>Vi" reads "råvarer.Vi").
 */
export function bardNodeText(node) {
  if (!node) {
    return '';
  }

  if (node.type === 'text') {
    return node.text || '';
  }

  if (node.type === 'hardBreak') {
    return '';
  }

  return (node.content || []).map(bardNodeText).join('');
}

/** Unwrapped inline Bard root (text/hardBreak) — form may hold this after process(). */
export function isUnwrappedInlineBard(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((node) => node && (node.type === 'text' || node.type === 'hardBreak'))
  );
}

/**
 * Inline Bard values the CP can edit as one whole-field paragraph:
 * - legacy string (pre-Bard content)
 * - unwrapped text nodes (post-process / default)
 * - already-wrapped paragraph/heading docs
 */
export function normalizeInlineBardValue(value) {
  if (typeof value === 'string') {
    return [
      {
        type: 'paragraph',
        content: value === '' ? [] : [{ type: 'text', text: value }],
      },
    ];
  }

  if (isUnwrappedInlineBard(value)) {
    return [{ type: 'paragraph', content: value }];
  }

  return value;
}
