/**
 * The harness page's entry: the port on a file in memory, the real Build
 * panel, and the stand-ins around it (Harness.vue).
 *
 * Data from the build (vite.config.mjs, `virtual:build-harness`): the dock's
 * own lists and icons read out of code-dock.js, the strings from
 * resources/lang (en and da, Build's and the editor's), the site's
 * components, and the site's own <head> CSS fetched from the bench.
 */
import { createApp, reactive } from 'vue';
import data from 'virtual:build-harness';
import Harness from './Harness.vue';
import { HTML_ICONS, createHarnessPort } from './port.js';

const FILE = `<section id="id-{{ id }}" class="[ {{ _class }} ] py-800" {{ visual_edit outline_inside="true" section_orderable="true" }}>
    <div class="wrapper">
        <div class="grid grid-cols-2 gap-700 items-center max-md:grid-cols-1">
            <div class="flow-y">
                <p class="text-300 font-semibold text-secondary">Branding · Web · Kommunikation</p>
                <h2 class="text-800 font-bold text-primary">Vi bygger brands, der kan mærkes</h2>
                <p class="text-500 max-w-[45ch]">Strategi, identitet og websites samlet ét sted, så virksomheden fremstår skarp og ens overalt.</p>
                <a href="" class="btn">Se vores cases</a>
            </div>
            <div>
                <img src="" alt="" class="w-full aspect-video rounded-lg">
            </div>
        </div>
        {{ partial:components/section_heading }}
    </div>
</section>
`;

const lang = new URLSearchParams(location.search).get('lang') === 'da' ? 'da' : 'en';
const strings = reactive({ ...data.strings[lang] });
const menu = reactive({ names: null, title: '', active: '', pick: null, rect: null });
const ui = reactive({
  lang,
  theme: 'dark',
  setLang(next) {
    ui.lang = next;
    Object.keys(strings).forEach((key) => delete strings[key]);
    Object.assign(strings, data.strings[next]);
  },
});

const port = createHarnessPort({
  html: FILE,
  lists: { ...data.lists, htmlIcons: HTML_ICONS },
  strings,
  components: data.components,
  sectionTag: data.sectionTag,
  onMenu: ({ anchor, title, names, active, pick }) => {
    Object.assign(menu, { names, title, active, pick, rect: anchor?.getBoundingClientRect() || null });
  },
});

window.__sveBuildHarness = port;

createApp(Harness, { port, siteHead: data.siteHead, tailwind: data.tailwind, menu, ui }).mount('#app');
