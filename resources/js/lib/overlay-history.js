/**
 * The URL the overlay host's own history entry carries while the editor is
 * open: the page being edited, so the address bar names it and a refresh
 * comes back to it.
 *
 * Two readers, one rule each, both pure so the overlay host (kernel, not Vue)
 * can be held in tests without a document:
 *
 *   overlayHistoryUrl   what the `sveEditing` entry should say for the page
 *                       the editor reports with `lp-ready` — or null when the
 *                       host's own URL is to stay.
 *   withoutEditorMark   the same entry once the editor has closed: the page's
 *                       URL with the Live Preview ask taken off, so a refresh
 *                       or a Back lands on the page and not in the editor.
 *
 * On a Control Panel host the entry keeps the host's own URL — the CP screen
 * Live Preview was opened from (the Pages listing, an entry's publish form, …).
 * A refresh lands there, plain, and the editor is not reopened: the behaviour
 * of v1.1.652, which the owner asked for back on 5 Nov 2026. Writing the
 * entry's screen with `?live-preview=1` here made a refresh show that screen
 * for ~3 s before `autoOpenLivePreview` brought the editor back.
 *
 * On a site host it is the entry's public URL, as the server names it
 * (`permalink`, Statamic's `$entry->absoluteUrl()`); a page with none — a
 * template, a saved section — leaves the host's URL alone. A URL on another
 * origin cannot be written into this history at all.
 *
 * May import: nothing.
 */

/** The query that asks the Control Panel to open Live Preview on arrival. */
const LIVE_PREVIEW_PARAM = 'live-preview';

function sameOriginUrl(href, origin) {
  if (typeof href !== 'string' || !href) {
    return null;
  }

  let url;

  try {
    url = new URL(href, origin);
  } catch {
    return null;
  }

  return url.origin === origin ? url : null;
}

/**
 * @param {object} args
 * @param {string} args.origin   the host document's origin
 * @param {boolean} args.cpHost  whether the host is a Control Panel page
 * @param {{url?: string, permalink?: string|null}|null} args.page  what the
 *   editor sent with `lp-ready`: its own URL (the entry's edit screen) and the
 *   entry's public URL, or null when it has none
 * @param {string} [args.here]   the host document's own URL right now
 * @returns {string|null}
 */
export function overlayHistoryUrl({ origin, cpHost, page, here = '' }) {
  // A Control Panel host keeps its own URL (see above).
  // Always without the Live Preview ask. Landed on with `?live-preview=1` (the top bar's button,
  // a link, an older refresh), `autoOpenLivePreview` takes the ask off, but
  // Statamic's router writes the page's URL back with it a moment later:
  // carried into the entry, a refresh reopened the editor. Measured on the
  // demo, 5 Nov 2026.
  if (cpHost) {
    return here ? withoutEditorMark(here, origin) : null;
  }

  const edit = sameOriginUrl(page?.url, origin);

  if (!edit) {
    return null;
  }

  const link = sameOriginUrl(page?.permalink, origin);

  return link ? link.href : null;
}

/** `href` without the Live Preview ask — what the entry says once the editor is closed. */
export function withoutEditorMark(href, origin) {
  const url = sameOriginUrl(href, origin);

  if (!url) {
    return href;
  }

  url.searchParams.delete(LIVE_PREVIEW_PARAM);

  return url.href;
}
