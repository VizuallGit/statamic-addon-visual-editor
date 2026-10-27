/**
 * Builds the Build mode harness: a page with the real Build panel and no
 * Control Panel, so the panel can be seen and clicked before it is wired in.
 *
 *   SVE_HARNESS_OUT=<dir> SVE_SITE_DIR=<site> SVE_SITE_PAGE=<url> \
 *     npx vite build --config tests/harness/build-mode/vite.config.mjs
 *
 * Built with the addon's own Vite and Statamic's plugin (so `vue` is
 * window.Vue, as in the CP), into a folder outside the addon — never into
 * resources/dist. `virtual:build-harness` hands the page:
 *
 *   lists       the dock's HTML_TOOLS, HTML_DIVS, HTML_HEADINGS, CSS_TOOLS and
 *               its icons, read out of code-dock.js (tests/js/build-mode/dock-lists.js)
 *   strings     resources/lang/{en,da}/build.php over messages.php, through PHP
 *   components  the site's resources/views/partials/components, as Component::all() lists them
 *   siteHead    the <head> CSS of a page of the site (SVE_SITE_PAGE), inlined
 *   sectionTag  the addon's default `templates.section_tag`
 *   tailwind    the site's theme as `/!/sve/tailwind-theme` answers it
 *               (TailwindTheme::css / ::plugins), read in SVE_SITE_DIR — the
 *               preview compiles the file's classes with the editor's own
 *               compiler (tw-compile-core.js), as Instant does
 */
import { copyFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import statamic from '@statamic/cms/vite-plugin';
import { CSS_TOOLS, CSS_TOOL_ICONS, HTML_DIVS, HTML_HEADINGS, HTML_TOOLS, TW_TOOL_ICONS } from '../../js/build-mode/dock-lists.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const ADDON = resolve(HERE, '../../..');
const SITE = process.env.SVE_SITE_DIR || `${process.env.HOME}/Sites/vizuall-skabelon`;
const PAGE = process.env.SVE_SITE_PAGE || 'http://127.0.0.1:8771/test-ny';
const OUT = process.env.SVE_HARNESS_OUT || join(tmpdir(), 'sve-build-mode-harness');

const php = (code) => JSON.parse(execFileSync('php', ['-r', code], { encoding: 'utf8' }));
const lang = (locale) =>
  php(`echo json_encode(array_merge(include '${ADDON}/resources/lang/en/messages.php', include '${ADDON}/resources/lang/${locale}/messages.php', include '${ADDON}/resources/lang/en/build.php', include '${ADDON}/resources/lang/${locale}/build.php'));`);

function sectionTag() {
  const m = /'section_tag'\s*=>\s*'((?:[^'\\]|\\.)*)'/.exec(readFileSync(`${ADDON}/config/statamic-visual-editor.php`, 'utf8'));

  return m ? m[1].replace(/\\'/g, "'") : '';
}

function tailwindTheme() {
  try {
    const out = execFileSync(
      'php',
      ['artisan', 'tinker', '--execute', 'echo json_encode(["css" => \\MarioHamann\\StatamicVisualEditor\\TailwindTheme::css(), "plugins" => \\MarioHamann\\StatamicVisualEditor\\TailwindTheme::plugins()]);'],
      { cwd: SITE, encoding: 'utf8' }
    );

    return JSON.parse(out.slice(out.indexOf('{')));
  } catch (e) {
    console.warn(`[harness] no Tailwind theme from ${SITE}: ${e.message}`);

    return { css: '', plugins: [] };
  }
}

function components() {
  const dir = `${SITE}/resources/views/partials/components`;

  return readdirSync(dir)
    .filter((file) => /^[a-z0-9_-]+\.antlers\.html$/.test(file))
    .map((file) => file.replace(/\.antlers\.html$/, ''))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => ({ name, tag: `{{ partial:components/${name} }}` }));
}

/** The page's own <head> CSS: inline <style> blocks and same-origin stylesheets, inlined. */
async function siteHead() {
  try {
    const page = await (await fetch(PAGE)).text();
    const head = (/<head[^>]*>([\s\S]*?)<\/head>/i.exec(page) || [])[1] || '';
    const origin = new URL(PAGE).origin;
    const parts = [];

    for (const match of head.matchAll(/<style[^>]*>[\s\S]*?<\/style>|<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi)) {
      const tag = match[0];

      if (/^<style/i.test(tag)) {
        parts.push(tag.replace(/url\((['"]?)\//g, `url($1${origin}/`));
        continue;
      }

      const href = (/href=["']([^"']+)["']/i.exec(tag) || [])[1];

      if (!href) {
        continue;
      }

      const url = new URL(href, PAGE);

      if (url.origin !== origin) {
        parts.push(tag);
        continue;
      }

      const css = (await (await fetch(url)).text()).replace(/url\((['"]?)\//g, `url($1${origin}/`);

      parts.push(`<style>${css}</style>`);
    }

    return parts.join('\n');
  } catch (e) {
    console.warn(`[harness] no site CSS from ${PAGE}: ${e.message}`);

    return '';
  }
}

function harnessData() {
  const id = 'virtual:build-harness';

  return {
    name: 'build-harness-data',
    resolveId: (source) => (source === id ? `\0${id}` : null),
    async load(source) {
      if (source !== `\0${id}`) {
        return null;
      }

      const data = {
        lists: {
          htmlTools: HTML_TOOLS,
          divs: HTML_DIVS,
          headings: HTML_HEADINGS,
          cssTools: CSS_TOOLS,
          toolIcons: { ...CSS_TOOL_ICONS, ...TW_TOOL_ICONS },
        },
        strings: { en: lang('en'), da: lang('da') },
        components: components(),
        siteHead: await siteHead(),
        sectionTag: sectionTag(),
        tailwind: tailwindTheme(),
      };

      return `export default ${JSON.stringify(data)};`;
    },
  };
}

/** Statamic's Vue, as the CP has it: the global build from the site's node_modules. */
function vueGlobal() {
  return {
    name: 'build-harness-vue',
    writeBundle() {
      mkdirSync(OUT, { recursive: true });
      copyFileSync(join(SITE, 'node_modules/vue/dist/vue.global.prod.js'), join(OUT, 'vue.global.prod.js'));
    },
  };
}

export default defineConfig({
  root: HERE,
  base: './',
  logLevel: 'warn',
  plugins: [statamic(), harnessData(), vueGlobal()],
  build: {
    outDir: OUT,
    emptyOutDir: true,
    minify: false,
    rollupOptions: { input: join(HERE, 'index.html') },
  },
});
