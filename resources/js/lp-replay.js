/**
 * Live Preview replay: re-render the preview without reloading it.
 *
 * Statamic re-renders the preview only when the ENTRY changes. Everything else
 * the editor changes (globals, header/footer, a section file in the dock) needs
 * the preview asked to render again with the same URL. This module owns that:
 *
 *   - watchPreviewRenders() records the tokenised URL of every render Statamic
 *     makes (it goes through XMLHttpRequest, so both fetch and XHR are watched);
 *   - replayLivePreview() posts that URL back into the iframe, which morphs the
 *     page in place. Never location.reload(): a full reload of the front end in
 *     the iframe ejects Live Preview.
 *
 * Owned by the CP shell (cp.js). Panels ask for a replay through cp.js or the
 * registry; they do not import this file.
 *
 * May import: lib/, preview-section-scope.js. Must not import panels.
 */
import { previewFrame } from './lib/preview-frame.js';
import { captureSectionPreviewScope, watchSectionPreviewScope, wrapSectionPreviewFrame } from './preview-section-scope.js';

// The URL of the most recent preview render, replayed whenever something other
// than the entry changes. Written only by watchPreviewRenders() below.
export let lastPreviewUrl = null;

/** The URL the preview iframe is actually showing, not a remembered one. */
export function frameDocumentUrl(frame) {
  try {
    const href = frame?.contentWindow?.location?.href;

    if (href && href !== 'about:blank') {
      return href;
    }
  } catch {
    /* cross-origin — Live Preview is same-origin */
  }

  return frame?.getAttribute('src') || frame?.src || '';
}


/**
 * A tokenised Live Preview document — never a screenshot route or the public site.
 *
 * Replaying those into the iframe paints the front end (with Rediger) over the
 * preview and looks exactly like Live Preview closed.
 */
export function isLivePreviewDocumentUrl(url, origin) {
  if (!url) {
    return false;
  }

  try {
    const parsed = new URL(url, origin);

    if (parsed.origin !== origin) {
      return false;
    }

    if (parsed.pathname.includes('/!/sve/collection-view-preview/')) {
      return true;
    }

    if (parsed.pathname.includes('/!/sve/')) {
      return false;
    }

    return (
      parsed.searchParams.has('token') ||
      parsed.searchParams.has('live-preview') ||
      parsed.searchParams.has('preview')
    );
  } catch {
    return false;
  }
}


/**
 * Replay the current Live Preview URL into the iframe.
 *
 * Must morph, never `location.reload()`: a full reload of the front-end in the
 * iframe ejects Live Preview (same failure Vite `refresh: true` used to cause).
 */
export function replayLivePreview(win, opts) {
  const frame = previewFrame(win.document);

  if (!frame?.contentWindow) {
    return;
  }

  const origin = win.location.origin;
  let url = frameDocumentUrl(frame);

  if (!isLivePreviewDocumentUrl(url, origin)) {
    url = lastPreviewUrl || '';
  }

  if (!isLivePreviewDocumentUrl(url, origin)) {
    return;
  }

  const sectionUids = Array.isArray(opts?.sectionUids)
    ? opts.sectionUids.filter((id) => typeof id === 'string' && id !== '')
    : opts && typeof opts.sectionUid === 'string' && opts.sectionUid !== ''
      ? [opts.sectionUid]
      : [];

  frame.contentWindow.postMessage(
    {
      name: 'statamic.preview.updated',
      url,
      ...(sectionUids.length ? { sectionUids } : {}),
    },
    '*'
  );
}


/**
 * Records the URL of each preview render. Statamic POSTs the entry's values and
 * gets back a tokenised URL; that URL is what the preview iframe loads, and what
 * we replay to re-render after a global changes.
 */
export function watchPreviewRenders(win) {
  watchSectionPreviewScope(win);

  const isPreviewCall = (url, method) => {
    if (typeof url !== 'string' || !/^POST$/i.test(method || 'GET')) {
      return false;
    }

    let path;

    try {
      path = new URL(url, win.location.origin).pathname;
    } catch {
      return false;
    }

    // Statamic's entry-preview POST. Addon routes also contain "/preview"
    // (`/!/sve/globals-preview`, screenshot URLs) and must not overwrite this.
    return path.includes('/preview') && !path.includes('/!/sve/');
  };

  const remember = (payload) => {
    try {
      const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
      const url = data?.url;

      if (typeof url === 'string' && isLivePreviewDocumentUrl(url, win.location.origin)) {
        lastPreviewUrl = url;
        wrapSectionPreviewFrame(win);
      }
    } catch {
      /* not the payload we expected */
    }
  };

  const { fetch: originalFetch } = win;

  win.fetch = function (input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url;
    const method = init.method ?? (typeof input === 'object' ? input?.method : null);

    if (isPreviewCall(url, method)) {
      captureSectionPreviewScope(win);
    }

    const request = originalFetch.call(this, input, init);

    if (!isPreviewCall(url, method)) {
      return request;
    }

    return request.then((response) => {
      response.clone().json().then(remember).catch(() => {});

      return response;
    });
  };

  // Statamic's CP talks to the server through axios, i.e. XMLHttpRequest — the
  // preview render never goes through fetch at all.
  const { open: originalOpen } = win.XMLHttpRequest.prototype;

  win.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    if (isPreviewCall(url, method)) {
      captureSectionPreviewScope(win);
      this.addEventListener('load', () => {
        if (this.status >= 200 && this.status < 300) {
          remember(this.response ?? this.responseText);
        }
      });
    }

    return originalOpen.call(this, method, url, ...rest);
  };
}

