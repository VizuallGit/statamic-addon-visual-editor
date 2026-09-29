/**
 * Control Panel bundle — Visual Editor.
 *
 * Vite entry for the CP. Live Preview itself is three other entries that must
 * stay isolated (do not import them from here):
 *   bridge.js       — injected into the preview iframe
 *   preview.js      — morph / "saved" HTML in the dock
 *   overlay-host.js — overlay iframe on the public site
 *
 * Two phases:
 *
 *   eager       what every CP screen needs from the first render: the former
 *               standalone side scripts, the fieldtypes, the field enhancements
 *               (locked rows, sibling sync, unique sets, section accordion), the
 *               file manager and template board launchers, the publish-container
 *               subscription and the "where is this edited?" conditions. None of
 *               it imports the Live Preview cluster.
 *
 *   deferred    lp-cluster.js — the CP shell (cp.js / initCp), Patterns, the
 *               focus panel, globals, header/footer, inline edit, pages,
 *               open-in-preview and the AI launcher. One chunk; see its header
 *               for why it is not split further.
 *
 * The cluster loads on whichever comes first:
 *   1. now, at evaluation, when this page is Live Preview (`?live-preview`),
 *      the panel beside it (`?sve-panel`) or was opened from it (referrer) —
 *      the same test the server uses to hand page_sections to the lite field;
 *   2. a click on Statamic's own Live Preview control, which is taken here and
 *      handed to the overlay once the cluster is in (see the click shim below);
 *   3. idle time after Statamic has booted — unless the site has Visual Editor
 *      switched off, where the cluster never loads.
 *
 * Statamic.booting / booted only collect callbacks until boot; one registered
 * later never runs. So the cluster's init is called from here: straight away
 * when it arrives after the boot phase, or from the booting callback when it
 * arrives first.
 *
 * Side-effect imports wire themselves up on load; nothing is registered on a
 * global object (the `sve` registry went in WP6c).
 */
// First: the former standalone scripts, in the order their script tags ran.
import './side/index.js';
import AutoUuid from './components/fieldtypes/AutoUuid.vue';
import LibraryScan from './components/fieldtypes/LibraryScan.vue';
import './components/fieldtypes/ResponsiveFieldtype.js';
import './components/fieldtypes/SveDefaultsFieldtype.js';
import { installResponsiveConditions } from './responsive-conditions.js';
import './components/fieldtypes/ColumnSpanFieldtype.js';
import './components/fieldtypes/IconButtonGroupFieldtype.js';
import './components/fieldtypes/UniqueSetsFieldtype.js';
import './components/fieldtypes/GlobalsPickerFieldtype.js';
import './components/fieldtypes/ToolbarAccessFieldtype.js';
// `default-sets-fieldtype` is registered by side/default-sets-count.js on
// Statamic.booted (the count version); the older DefaultSetsFieldtype.js it
// shadowed was deleted in WP6a.
import './components/fieldtypes/BardDefaultFieldtype.js';
import './components/LockedRows.js';
import './sibling-sync.js';
import './components/UniqueSets.js';
import './components/SectionAccordion.js';
import { initFileManager } from './file-manager-boot.js';
import { initTemplateBoard } from './template-board-boot.js';
import { registerContainerEvents } from './lib/publish-containers.js';
import { livePreviewButton, livePreviewEditorEl, registerPanelConditions } from './lib/live-preview.js';

// ---- the deferred Live Preview cluster --------------------------------------

let clusterPromise = null;
let clusterBooted = false;
let bootPhaseReached = false;
let pendingClusterModule = null;

function bootClusterModule(mod) {
  if (bootPhaseReached) {
    mod.bootLpCluster();
    clusterBooted = true;
  } else {
    pendingClusterModule = mod;
  }
}

function loadCluster() {
  if (!clusterPromise) {
    clusterPromise = import('./lp-cluster.js')
      .then((mod) => {
        bootClusterModule(mod);

        return mod;
      })
      .catch((err) => {
        clusterPromise = null;
        console.error('[sve] lp-cluster failed to load', err);

        throw err;
      });
  }

  return clusterPromise;
}

// Set at evaluation, before the cluster can possibly land: lite-sections reads
// it and leaves the registration below in place instead of swapping in its own
// component (a swap changes the vnode type and remounts every lite field).
if (window.Vue?.defineAsyncComponent) {
  window.__sveLiteFieldtypeAsync = true;
}

Statamic.booting(() => {
  bootPhaseReached = true;
  installResponsiveConditions();
  // Before the switch in initCp: a field asking for a condition that isn't there
  // is hidden in both editors, so these are registered even on a site where the
  // editor itself is switched off (and the cluster never loads).
  registerPanelConditions(window);
  Statamic.component('auto_uuid-fieldtype', AutoUuid);
  Statamic.component('library_scan-fieldtype', LibraryScan);

  // The lite sections field renders the moment Live Preview's panel form
  // mounts — sooner than the deferred cluster can land on a cold cache, and
  // Statamic checks a fieldtype's existence once, at render. So the name is
  // there from boot: an async component that pulls the cluster in and resolves
  // to the real fieldtype from lite-sections.
  if (window.__sveLiteFieldtypeAsync) {
    Statamic.$components.register(
      'sve_lite_sections-fieldtype',
      window.Vue.defineAsyncComponent(() => loadCluster().then((mod) => mod.liteFieldtypeOptionsAsync()))
    );
  }

  // Publish containers created at page mount are announced once; the panels in
  // the cluster read them whenever it arrives, so the subscription is eager.
  registerContainerEvents(window);
  initFileManager();
  initTemplateBoard();

  if (pendingClusterModule) {
    pendingClusterModule.bootLpCluster();
    clusterBooted = true;
    pendingClusterModule = null;
  }
});

/**
 * This page is Live Preview, the panel beside it, or was opened from it — the
 * test UseLiteSections::inLivePreview() makes on the server before it hands
 * page_sections to the lite field. No config read: the config is not there
 * until Statamic boots.
 */
function pageIsLivePreview() {
  const params = new URLSearchParams(window.location.search);

  return (
    params.has('live-preview') ||
    params.has('sve-panel') ||
    (document.referrer || '').includes('live-preview=')
  );
}

// 1. Live Preview: load now.
if (pageIsLivePreview()) {
  loadCluster().catch(() => {});
}

// 2. The first click on Statamic's Live Preview control, while the cluster is
//    still away. Same guards as interceptLivePreviewOpen in cp-shell/add-section.js,
//    which takes over once the cluster has booted.
document.addEventListener(
  'click',
  (event) => {
    if (clusterBooted) {
      return; // the cluster's own interceptor handles it
    }

    if (window.parent !== window.self) {
      return; // embedded in the site's overlay: the click must reach Statamic
    }

    if (window.Statamic?.$config?.get?.('sveEnabled') === false) {
      return; // Visual Editor off: Statamic's own Live Preview stays untouched
    }

    if (livePreviewEditorEl(document)) {
      return; // Live Preview is already open
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }

    const button = livePreviewButton(document);

    if (!button || !button.contains(event.target)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    // `button` is taken before the wait: the cluster arrives a tick or more later.
    loadCluster()
      .then((mod) => mod.openLivePreviewOverlay(window, button))
      .catch(() => {});
  },
  true
);

// 3. Idle time after boot. Safari has no requestIdleCallback.
Statamic.booted(() => {
  if (window.Statamic?.$config?.get?.('sveEnabled') === false) {
    return;
  }

  const idle = window.requestIdleCallback
    ? (fn) => window.requestIdleCallback(fn, { timeout: 2500 })
    : (fn) => window.setTimeout(fn, 300);

  idle(() => {
    loadCluster().catch(() => {});
  });
});
