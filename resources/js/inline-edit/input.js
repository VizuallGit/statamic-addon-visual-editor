/**
 * inline-edit.js — what is typed, into the form; the theme swatches; the end.
 * Split out of inline-edit.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. inline-edit.js re-exports this file.
 */
import { dataGet, unwrapRef } from '../lib/values.js';
import { editSession } from '../inline-edit.js';
import { BTS_SPAN_CLASSES, cleanEditedText, findPreservedBardNode, parseInlineHtml } from './request.js';
import { writeBardFieldValue } from './bard-value.js';

export function handleEditInput(data, doc) {
  if (!editSession || editSession.requestId !== data.requestId) {
    return;
  }

  const { container } = editSession;

  if (editSession.mode === 'string') {
    container.setFieldValue(editSession.path, cleanEditedText(data.text));

    return;
  }

  // Whole-field Bard: rebuild the node array from the serialized blocks,
  // preserving locked set nodes (kind: 'locked') at their DOM positions.
  if (editSession.mode === 'bard-field') {
    const values = unwrapRef(container.values);
    const current = dataGet(values, editSession.path);
    const original = Array.isArray(editSession.original) ? editSession.original : [];
    const spanClasses =
      Array.isArray(data.spanClasses) && data.spanClasses.length ? data.spanClasses : BTS_SPAN_CLASSES;

    let textMergeIndex = 0;
    const next = [];

    const buildTextNode = (block) => {
      const type = block.kind === 'heading' ? 'heading' : 'paragraph';
      const pool = Array.isArray(current) ? current : original;
      let orig = null;

      for (let i = textMergeIndex; i < pool.length; i++) {
        if (pool[i]?.type === type) {
          orig = pool[i];
          textMergeIndex = i + 1;
          break;
        }
      }

      const attrs = { ...(orig?.attrs || {}) };
      const node = { type };

      if (type === 'heading') {
        attrs.level = block.level || 2;
      }

      if (block.vizuClass) {
        attrs.vizuClass = block.vizuClass;
      } else {
        delete attrs.vizuClass;
      }

      if (block.vizuBlockStyle) {
        attrs.vizuBlockStyle = block.vizuBlockStyle;
      } else {
        delete attrs.vizuBlockStyle;
      }

      if (block.className && !block.vizuClass) {
        attrs.class = block.className;
      } else {
        delete attrs.class;
      }

      if (Object.keys(attrs).length) {
        node.attrs = attrs;
      }

      const content = parseInlineHtml(block.html || '', doc, spanClasses);

      if (content.length) {
        node.content = content;
      }

      return node;
    };

    for (const block of data.blocks || []) {
      if (block.kind === 'locked') {
        const orig = findPreservedBardNode(original, block.visualId);

        if (orig) {
          next.push(JSON.parse(JSON.stringify(orig)));
        }

        continue;
      }

      if (block.kind === 'vizuDiv') {
        next.push({
          type: 'vizuDiv',
          attrs: { class: block.className || null },
          content: (block.children || []).map((child) => buildTextNode(child)),
        });

        continue;
      }

      next.push(buildTextNode(block));
    }

    writeBardFieldValue(container, editSession.path, next, doc, editSession);

    return;
  }

  // Bard: swap the edited node's inline content inside a fresh copy of the
  // current field value (other nodes/sets stay untouched).
  const values = unwrapRef(container.values);
  const current = dataGet(values, editSession.path);

  if (!Array.isArray(current)) {
    return;
  }

  const next = JSON.parse(JSON.stringify(current));
  const node = next[editSession.index];

  if (!node) {
    return;
  }

  const content = parseInlineHtml(
    data.html,
    doc,
    Array.isArray(data.spanClasses) && data.spanClasses.length ? data.spanClasses : BTS_SPAN_CLASSES
  );

  if (content.length) {
    node.content = content;
  } else {
    delete node.content;
  }

  writeBardFieldValue(container, editSession.path, next, doc, editSession);
}
