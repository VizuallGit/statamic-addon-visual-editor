/**
 * Live Preview: hot reload via Alpine.morph
 *
 * Injected on live preview responses via InjectBridgeScript (same mechanism
 * as bridge.js), so sites get hot reload automatically — no partial needed.
 *
 * On every `statamic.preview.updated` message from the CP, the updated HTML
 * is fetched and morphed into the live document instead of reloading the
 * iframe: scroll position survives, and <head> styles (e.g. style_push
 * output) are re-synced so section CSS live-updates too.
 *
 * While an inline edit is active (window.__sveInlineEdit.active, owned by
 * bridge.js), morphs are deferred: replacing the DOM under the caret would
 * kill the edit session and revert in-flight keystrokes to a stale server
 * render. The latest update URL is stashed and applied when the edit ends
 * (`sve:inline-edit-end` event).
 *
 * Requires Alpine with the morph plugin on the site (falls back to a plain
 * body swap without it). The addon disables Statamic's built-in
 * `live_preview.hot_reload_contents` at boot so the two never morph the
 * same document concurrently.
 *
 * After each update a `statamic:preview-updated` event is dispatched on
 * window — a hook for site JS that needs to re-run after DOM changes.
 */

const STYLE_ID = '__sve-preview-styles';

function injectPreviewStyles(doc) {
  if (doc.getElementById(STYLE_ID)) {
    return;
  }

  const style = doc.createElement('style');

  style.id = STYLE_ID;
  style.textContent = `
    /* Smooth scroll breaks scroll restoration when the preview morphs/refreshes */
    html { scroll-behavior: auto !important; }
  `;
  doc.head.appendChild(style);
}

injectPreviewStyles(document);

let updateSeq = 0;
let pendingUrl = null;

// True while a global set is open beside the preview. Renders then have to ask
// for the unsaved globals — otherwise the server uses what's on disk and the
// change you just typed vanishes on the next refresh. Deliberately opt-in per
// render: a stale override must never silently alter an ordinary preview.
let globalsActive = false;

// True while a global (synced) section is open in the side panel — same story:
// the page's own form holds only a reference, so without asking for the unsaved
// section the render falls back to what's on disk.
let sectionsActive = false;

function withFlags(url) {
  let out = url;

  if (globalsActive) {
    out += (out.includes('?') ? '&' : '?') + 'sve_globals=1';
  }

  if (sectionsActive) {
    out += (out.includes('?') ? '&' : '?') + 'sve_sections=1';
  }

  return out;
}

function editingActive() {
  return !!window.__sveInlineEdit?.active;
}

async function applyUpdate(url) {
  // Drop stale responses when rapid edits overtake each other.
  const seq = ++updateSeq;
  const text = await fetch(withFlags(url)).then((res) => res.text());

  if (seq !== updateSeq) {
    return;
  }

  // An inline edit may have started while the fetch was in flight — defer.
  if (editingActive()) {
    pendingUrl = url;

    return;
  }

  const updated = new DOMParser().parseFromString(text, 'text/html');
  const savedScrollY = window.scrollY;

  try {
    if (window.Alpine?.morph) {
      window.Alpine.morph(document.body, updated.body);
    } else {
      document.body.innerHTML = updated.body.innerHTML;
    }
  } catch (e) {
    document.body.innerHTML = updated.body.innerHTML;
  }

  // Re-sync <head> styles so pushed section CSS (style_push) live-updates.
  // Our own style is kept; the bridge re-injects its styles via its observer.
  document.head.querySelectorAll('style').forEach((s) => {
    if (s.id !== STYLE_ID) {
      s.remove();
    }
  });
  updated.head.querySelectorAll('style').forEach((s) => {
    document.head.appendChild(s.cloneNode(true));
  });

  window.dispatchEvent(new CustomEvent('statamic:preview-updated'));

  const restoreScroll = () => window.scrollTo({ top: savedScrollY, behavior: 'instant' });

  restoreScroll();
  requestAnimationFrame(restoreScroll);
}

window.addEventListener('message', (event) => {
  // The CP tells us whether a global set is being edited, and re-renders the
  // preview on every keystroke in it (there's no entry change to make Statamic
  // do it for us) by replaying the last preview URL.
  if (event.data?.name === 'sve.globals') {
    globalsActive = !!event.data.active;

    if (event.data.url) {
      applyUpdate(event.data.url);
    }

    return;
  }

  // Same, for a global section being edited in the side panel.
  if (event.data?.name === 'sve.sections') {
    sectionsActive = !!event.data.active;

    if (event.data.url) {
      applyUpdate(event.data.url);
    }

    return;
  }

  if (event.data?.name !== 'statamic.preview.updated') {
    return;
  }

  if (editingActive()) {
    pendingUrl = event.data.url;

    return;
  }

  applyUpdate(event.data.url);
});

window.addEventListener('sve:inline-edit-end', () => {
  if (pendingUrl) {
    const url = pendingUrl;

    pendingUrl = null;
    applyUpdate(url);
  }
});
