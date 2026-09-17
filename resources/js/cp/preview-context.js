/**
 * DOM facts the CP chrome needs. Not the preview kernel — no morph, overlay or bridge.
 */
import { ask } from './bus.js';
import { previewDocument } from '../lib/preview-frame.js';

function outermostSectionType(el) {
  if (!el) {
    return '';
  }

  let type = el.getAttribute('data-type') || '';

  while (el) {
    const parent = el.parentElement?.closest('[data-replicator-set]');

    if (!parent) {
      break;
    }

    el = parent;
    type = el.getAttribute('data-type') || type;
  }

  return type;
}

function typeInDocument(doc) {
  if (!doc) {
    return '';
  }

  const marked =
    doc.querySelector('[data-sve-solo-parent][data-type], [data-replicator-set][data-sve-solo-parent]') ||
    doc.querySelector('[data-replicator-set][data-sve-active], [data-sve-active][data-type]');

  return outermostSectionType(marked);
}

export function currentSectionType(win) {
  return (
    typeInDocument(win.document) ||
    typeInDocument(previewDocument(win)) ||
    ask('dock:current-type') ||
    ''
  );
}
