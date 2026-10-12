/**
 * Alpine's morph for the live-reload button on the public site
 * (InjectLiveReload\Widget). The button imports this file when a template
 * changed and morphs the page's new HTML into the standing page instead of
 * reloading it. Only the people the button is shown to (super admins by
 * default) ever load it; a visitor gets no Visual Editor JS.
 *
 * Imported by its built path, not the package name: preview.js imports
 * `@alpinejs/morph`, and two entries importing the same module make Rollup
 * split it into a chunk that preview.js would then load too (see
 * scripts/vite-mirror-graph.js). The minified build is a module of its own,
 * so this entry is one file and preview.js stays as it was.
 *
 * Registered as preview.js's ensureAlpineMorph does: once, on the page's own
 * Alpine. An Alpine that has not started yet gets it on `alpine:init`.
 */
import morph from '@alpinejs/morph/dist/module.esm.min.js';

function register() {
  const Alpine = window.Alpine;

  if (Alpine && typeof Alpine.morph !== 'function') {
    Alpine.plugin(morph);
  }
}

if (window.Alpine) {
  register();
} else {
  document.addEventListener('alpine:init', register);
}
