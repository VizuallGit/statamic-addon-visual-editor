import AutoUuid from './components/fieldtypes/AutoUuid.vue';
import LibraryScan from './components/fieldtypes/LibraryScan.vue';
// Melder sig selv ind fra deres egen Statamic.booting()/Statamic.configuring()
// — derfor kun imports, og ingen component()-linjer nedenfor.
import './components/fieldtypes/ResponsiveFieldtype.js';
import './components/fieldtypes/ColumnSpanFieldtype.js';
import './components/fieldtypes/IconButtonGroupFieldtype.js';
import './components/fieldtypes/UniqueSetsFieldtype.js';
import './components/fieldtypes/DefaultSetsFieldtype.js';
import './components/fieldtypes/BardDefaultFieldtype.js';
import './components/LockedRows.js';
import './components/UniqueSets.js';
import './components/SectionAccordion.js';
import { enhanceIconFieldtype, enhanceIconifyFieldtype, initCp } from './cp.js';

Statamic.booting(() => {
  Statamic.component('auto_uuid-fieldtype', AutoUuid);
  Statamic.component('library_scan-fieldtype', LibraryScan);
  // Parent Control Panel window.
  initCp();
});

// Icon fieldtype is registered on the Vue app during boot — wrap it afterwards
// so Edit Set (and every other Icon field) can take Iconify / pasted SVG / custom files.
Statamic.booted(() => {
  enhanceIconFieldtype();
  enhanceIconifyFieldtype();
});
