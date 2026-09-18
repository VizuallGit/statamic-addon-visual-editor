/**
 * Control Panel bundle — Visual Editor.
 *
 * Vite entry for the CP. Live Preview itself is three other entries that must
 * stay isolated (do not import them from here except overlay-host helpers):
 *   bridge.js       — injected into the preview iframe
 *   preview.js      — morph / "saved" HTML in the dock
 *   overlay-host.js — overlay iframe on the public site
 *
 * Side-effect imports wire themselves up on load; nothing is registered on a
 * global object any more (the `sve` registry went in WP6c).
 *
 * Patterns (`section-library`) and globals stay in this graph: the rest of the
 * editor calls their helpers from the first preview message, unguarded.
 * Deferring those two left the left sidebar on the native section list.
 *
 * AI chat, AI text, schema, comments, HTML tree, outline, block tree and the
 * template dock wait for their icon (or a remembered-open restore).
 *
 * initCp() only wires the toolbar once Statamic has booted; it returns early
 * when the site has Visual Editor switched off.
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
import './inline-edit.js';
import './lazy-panels.js';
// Not a panel. Patterns is only its front: the rest of the editor reaches into
// this file for row ids, set meta, the section-message handlers and a dozen
// other helpers, unguarded, from the first render onwards. Deferring it left
// those calls hitting undefined and took the toolbar down with them.
import './section-library.js';
// Warms set meta on hover; calls the library above, so it follows it here
// rather than sitting in side/index.js.
import './side/section-meta-prefetch.js';
import './lp-panel.js';
import './focus-panel.js';
// Mounts one page_sections row at a time in Live Preview; hooks into the
// focus panel above through the bus, so it follows it here.
import './side/lite-sections.js';
import './open-in-preview.js';
import './globals-panel.js';
import './pages.js';
import './global-section.js';
import './chrome.js';
import { initCp } from './cp.js';
import { initAiLauncher } from './ai-launcher.js';
import { initFileManager } from './file-manager-boot.js';

Statamic.booting(() => {
  installResponsiveConditions();
  Statamic.component('auto_uuid-fieldtype', AutoUuid);
  Statamic.component('library_scan-fieldtype', LibraryScan);
  initCp();
  initAiLauncher();
  initFileManager();
});
