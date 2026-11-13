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
 * `pageDocuments` is the preview's document, the copies' documents and Build's
 * canvas: every document that shows the page, the list a paint or a stylesheet
 * swap runs over.
 *
 * `previewCopies` is the one list of the preview's copies — the breakpoint
 * overview's frames, which show the page but are not the preview. It reads the
 * overview's layer, which is in the document only while the overview is open;
 * closed, the list is empty after one lookup by id.
 *
 * `sendToPreview` is how the CP sends the preview a message from the protocol.
 * A panel imports it from here, never from the CP shell.
 *
 * May import: lib/ids.js, lib/build-canvas-ids.js, lib/protocol.js.
 */
import { BP_OVERVIEW_ID } from './ids.js';
import { BUILD_CANVAS_ID } from './build-canvas-ids.js';
import { MIRRORED } from './protocol.js';

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

/** Send the preview a message; what every frame shows goes to the preview's copies too. */
export function sendToPreview(message, win) {
  const iframe = win.document.getElementById('live-preview-iframe');

  if (iframe && iframe.contentWindow) {
    // Use '*' as targetOrigin because the preview iframe may be served from a
    // different origin (e.g. a custom preview domain). Restricting to a specific
    // origin would silently drop messages. This is admin-only functionality so
    // the cross-origin exposure is acceptable.
    iframe.contentWindow.postMessage(message, '*');

    // What every frame shows — a video held or let go, an Alpine state set —
    // reaches the preview's copies too: the breakpoint overview's frames,
    // while it is open. Closed, there are none (lib/preview-frame.js). The
    // bridge's own messages — editing, hover, focus — stay with the preview.
    if (MIRRORED.includes(message?.type)) {
      for (const copy of previewCopies(win.document)) {
        copy.postMessage(message, '*');
      }
    }
  }
}

/**
 * Every document that shows the page: the preview's, the breakpoint overview's
 * copies while it is open, and Build's canvas, which stands over the preview
 * and is the one on screen in Build. What a theme value is painted on and a
 * change to the site's stylesheet is swapped into.
 */
export function pageDocuments(winOrDoc) {
  const doc = winOrDoc?.document || winOrDoc;
  const canvas = doc?.getElementById?.(BUILD_CANVAS_ID)?.contentDocument;

  return [previewDocument(winOrDoc), ...previewCopies(winOrDoc).map((w) => w.document), canvas].filter(Boolean);
}
