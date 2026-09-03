/**
 * Control Panel bundle — Visual Editor.
 *
 * Vite entry for the CP. Live Preview itself is three other entries that must
 * stay isolated (do not import them from here except overlay-host helpers):
 *   bridge.js       — injected into the preview iframe
 *   preview.js      — morph / "saved" HTML in the dock
 *   overlay-host.js — overlay iframe on the public site
 *
 * Side-effect imports register themselves on `sve` (cp-registry.js).
 * Section library, block tree, outline and comments load with the CP again —
 * lazy-loading those modules left the left sidebar on the native section list.
 *
 * initCp() only wires the toolbar once Statamic has booted; it returns early
 * when the site has Visual Editor switched off.
 */
import AutoUuid from './components/fieldtypes/AutoUuid.vue';
import LibraryScan from './components/fieldtypes/LibraryScan.vue';
import './components/fieldtypes/ResponsiveFieldtype.js';
import { installResponsiveConditions } from './responsive-conditions.js';
import './components/fieldtypes/ColumnSpanFieldtype.js';
import './components/fieldtypes/IconButtonGroupFieldtype.js';
import './components/fieldtypes/UniqueSetsFieldtype.js';
import './components/fieldtypes/GlobalsPickerFieldtype.js';
import './components/fieldtypes/ToolbarAccessFieldtype.js';
import './components/fieldtypes/DefaultSetsFieldtype.js';
import './components/fieldtypes/BardDefaultFieldtype.js';
import './components/LockedRows.js';
import './sibling-sync.js';
import './components/UniqueSets.js';
import './components/SectionAccordion.js';
import './inline-edit.js';
import './lazy-panels.js';
import './section-library.js';
import './lp-panel.js';
import './page-activity.js';
import './outline-panel.js';
import './block-tree.js';
import './focus-panel.js';
import './open-in-preview.js';
import './globals-panel.js';
import './pages.js';
import './global-section.js';
import './chrome.js';
import { initCp } from './cp.js';
import { initComments } from './comments.js';
import { initAiLauncher } from './ai-launcher.js';
import { initFileManager } from './file-manager.js';
import { sve } from './cp-registry.js';

// Standalone CP scripts (lite-sections, wrapSolo, instantFocusHeader) look
// up isolate/solo on window — the module object is not visible to them.
window.sve = sve;

Statamic.booting(() => {
  installResponsiveConditions();
  Statamic.component('auto_uuid-fieldtype', AutoUuid);
  Statamic.component('library_scan-fieldtype', LibraryScan);
  initCp();
  initComments();
  initAiLauncher();
  initFileManager();
});
