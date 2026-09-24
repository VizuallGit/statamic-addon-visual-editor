/**
 * KERNEL — not Vue. A copy of the preview: one of the breakpoint overview's
 * frames. Do not convert this file. Do not import it from resources/js/cp/.
 *
 * InjectBridgeScript gives a document requested with `sve_view` this entry in
 * place of bridge.js and preview.js. The copy shows the page as the preview
 * shows it and is never edited: no badges, no hover, no toolbar, no clicks
 * back to the Control Panel, and nothing sent to it. What reaches it:
 *
 *   SVE_MIRROR      from the overview — the render the preview just morphed
 *                   to (its HTML, section and chrome), morphed here the same
 *                   way by preview.js's morphRender, without a fetch of its
 *                   own. The preview's fetch is the only one per change.
 *   SVE_VIDEO_HOLD  fanned out by sendToPreview — the video hold the bridge
 *                   keeps, from the bridge's own module: a pause in the tree
 *                   stops the video in every frame. The remembered holds are
 *                   sent by the overview once this frame has loaded
 *                   (cp-shell/video-holds.js, over the bus).
 *
 * preview.js is imported for its morph and its guards. Its own listener for
 * Statamic's `statamic.preview.updated` stays idle here: Statamic posts that
 * to the preview alone, and the overview posts renders, not URLs.
 *
 * Built as one self-contained file: scripts/vite-mirror-graph.js gives this
 * entry a copy of every module it imports, so preview.js and bridge.js stay
 * the single files they are and load nothing more for the copies' sake.
 */
import { applyThemeScaleCss, morphRender, normalizeChromeKind } from './preview.js';
import { applyVideoHolds, setVideoHold, watchVideoPauses } from './bridge/video-hold.js';
import { MSG, SOURCE } from './lib/protocol.js';

/** The preview morphed to this render: do the same, from the same HTML. */
function applyMirror(render) {
  if (!render || typeof render.html !== 'string') {
    return;
  }

  const updated = new DOMParser().parseFromString(render.html, 'text/html');

  // The preview's own guard: the public site's edit button means this is not
  // Live Preview, and morphing it in would paint the front end into the frame.
  if (updated.getElementById('sve-edit-button')) {
    return;
  }

  applyThemeScaleCss(render.themeScale || '');
  morphRender(updated, normalizeChromeKind(render.chromeKind), render.sectionUids || null, !!render.scoped);
}

window.addEventListener('message', (event) => {
  const data = event.data;

  if (!data || data.source !== SOURCE) {
    return;
  }

  if (data.type === MSG.SVE_MIRROR) {
    applyMirror(data.render);

    return;
  }

  if (data.type === MSG.SVE_VIDEO_HOLD) {
    setVideoHold(window, data);
  }
});

// The rule the bridge keeps, kept here too: an autoplay video that is not
// held plays, and every hold is put back after every draw.
watchVideoPauses(window);
window.addEventListener('statamic:preview-updated', () => applyVideoHolds(window));
