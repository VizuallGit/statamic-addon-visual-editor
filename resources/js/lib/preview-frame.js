/**
 * Finding the Live Preview iframe: the one place that knows where it is.
 *
 * Statamic mounts it as `#live-preview-iframe`. The editor, though, runs in
 * more than one window. When the overlay is open the CP itself sits inside an
 * iframe, so the preview may be one level further in. Lookup order:
 *
 *   1. `#live-preview-iframe` in the given document;
 *   2. if that frame's own document holds another `#live-preview-iframe`
 *      (the CP embedded in a frame), the inner one is the preview;
 *   3. otherwise any iframe in the document whose content holds the preview.
 *
 * Every function accepts a Window or a Document. Cross-origin frames are
 * skipped silently: Live Preview is same-origin, anything else is not ours.
 *
 * `previewCopies` is the one list of the preview's copies — the breakpoint
 * overview's frames, which show the page but are not the preview. It reads the
 * overview's layer, which is in the document only while the overview is open;
 * closed, the list is empty after one lookup by id.
 *
 * May import: lib/ids.js.
 */
import { BP_OVERVIEW_ID } from './ids.js';
function documentOf(winOrDoc) {
  return winOrDoc?.document || winOrDoc || null;
}

function contentDocumentOf(frame) {
  try {
    return frame?.contentDocument || null;
  } catch {
    return null;
  }
}

/** The preview `<iframe>` element, or null when no preview is on screen. */
export function previewFrame(winOrDoc) {
  const doc = documentOf(winOrDoc);

  if (!doc) {
    return null;
  }

  const direct = doc.getElementById('live-preview-iframe');

  if (direct) {
    const nested = contentDocumentOf(direct)?.getElementById('live-preview-iframe');

    return nested || direct;
  }

  for (const frame of doc.querySelectorAll('iframe')) {
    const inner = contentDocumentOf(frame)?.getElementById('live-preview-iframe');

    if (inner) {
      return inner;
    }
  }

  return null;
}

/** The document rendered inside the preview iframe, or null. */
export function previewDocument(winOrDoc) {
  return contentDocumentOf(previewFrame(winOrDoc));
}

/**
 * The windows of the preview's copies that hold a page: the breakpoint
 * overview's frames, while it is open, minus a size switched out (blanked to
 * about:blank) and one with no page yet. Not the preview's own window.
 */
export function previewCopies(winOrDoc) {
  const frame = previewFrame(winOrDoc);
  const layer = frame?.ownerDocument.getElementById(BP_OVERVIEW_ID);

  if (!layer) {
    return [];
  }

  const out = [];

  for (const copy of layer.querySelectorAll('iframe')) {
    const src = copy.getAttribute('src') || '';

    if (src && src !== 'about:blank' && copy.contentWindow) {
      out.push(copy.contentWindow);
    }
  }

  return out;
}
