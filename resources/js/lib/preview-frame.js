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
 * Both functions accept a Window or a Document. Cross-origin frames are skipped
 * silently: Live Preview is same-origin, anything else is not ours.
 *
 * May import: nothing.
 */
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
