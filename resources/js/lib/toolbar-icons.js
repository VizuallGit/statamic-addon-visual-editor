/**
 * The Live Preview toolbar's icons, by tool key: one drawing per tool, for the
 * toolbar itself (cp-shell/header-toolbar.js) and for anything outside the
 * shell that shows the same tool (the AI launcher's spark).
 *
 * Moved verbatim out of cp-shell/header-toolbar.js in the quality pass (4.3 C).
 *
 * May import: ai-text-icon.js and theme-panel-lazy.js, for the two icons that
 * are drawn elsewhere as well.
 */
import { aiTextIcon } from '../ai-text-icon.js';
import { THEME_PANEL_ICON } from '../theme-panel-lazy.js';

export const TOOLBAR_ICONS = {
  // Soft panel-left — same stroke language as pages/globe/grid (not the old heavy box).
  settings:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="3" y="3" width="18" height="18" rx="2"/>' +
    '<path d="M9 3v18"/></svg>',
  rightdock:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="3" y="3" width="18" height="18" rx="2"/>' +
    '<path d="M15 3v18"/></svg>',
  pages:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="4" y="3" width="16" height="18" rx="2"/>' +
    '<line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/></svg>',
  globals:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><circle cx="12" cy="12" r="9"/>' +
    '<line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/></svg>',
  // Building blocks: the patterns you place on a page.
  sections:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="14" y="3" width="7" height="7" rx="1"/>' +
    '<path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"/></svg>',
  // The bars you sent — nesting, no page frame around them.
  listview:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<line x1="3" y1="6" x2="13" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/>' +
    '<line x1="11" y1="18" x2="21" y2="18"/></svg>',
  // The accessibility mark. The panel behind it started as the heading outline
  // and still opens on it, but the tool is the wider one now — and an icon that
  // says "table of contents" would send people looking for a different thing.
  // Key stays `outline`: the toggle, the stored panel and the dock all know it
  // by that name, and renaming it would only mean a migration nobody asked for.
  outline:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<circle cx="12" cy="12" r="9.2"/>' +
    '<circle cx="12" cy="7.1" r="1.15" fill="currentColor" stroke="none"/>' +
    '<path d="M6.9 10.3 12 11.6l5.1-1.3"/>' +
    '<path d="M12 11.6v3.1"/>' +
    '<path d="m9.3 19.2 2.7-4.5 2.7 4.5"/></svg>',
  // A gauge: the tool answers "how heavy is this page", and a needle on a dial
  // is the one picture everybody already reads as that. Deliberately unlike the
  // accessibility mark beside it — two circles in a row would be one icon twice.
  // A full dial rather than the half arc it was: the arc only filled the
  // middle band, so it sat visibly shorter than every icon beside it.
  performance:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<circle cx="12" cy="12" r="9"/>' +
    '<path d="M12 12 16.2 7.8"/>' +
    '<circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none"/></svg>',
  html_tree:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="4" y="3" width="16" height="7" rx="1.5"/>' +
    '<rect x="8" y="14" width="12" height="7" rx="1.5"/></svg>',
  code:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="display:block" aria-hidden="true">' +
    '<path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75-.232-2.718h10.059l.23-2.622H5.412l.698 8.01h9.02l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>',
  comments:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M7 4h10a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H9.5L5 21.5V18H7a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z"/></svg>',
  edits:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>' +
    '<path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>',
  ai:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>' +
    '<path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>',
  // AI text. The chat's spark says "AI"; this says "AI on the words". Shared
  // with the marks in the preview — same tool, same glyph everywhere.
  aitext: aiTextIcon(15),
  // Structured data: a document with braces on it. It is data *about* the page,
  // which is why it is a page carrying a code mark rather than a plain file.
  schema:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/>' +
    '<path d="M14 3v5h5"/>' +
    '<path d="M10.5 12.5 9 14l1.5 1.5"/><path d="m13.5 12.5 1.5 1.5-1.5 1.5"/></svg>',
  site_css:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M8 4c-3 1-4 3-4 6v1c0 1.2-1 2-2 2 1 0 2 .8 2 2v1c0 3 1 5 4 6"/>' +
    '<path d="M16 4c3 1 4 3 4 6v1c0 1.2 1 2 2 2-1 0-2 .8-2 2v1c0 3-1 5-4 6"/></svg>',
  // The site's theme (colors, sizes, type, button): a palette.
  theme: THEME_PANEL_ICON,
  // The site's collections: books on a shelf, a collection rather than a page.
  collections:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>',
  // The site's templates: a page layout — header band, sidebar, body.
  templates:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
  // The site's forms: a clipboard with filled-in lines.
  forms:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1z"/>' +
    '<path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/>' +
    '<path d="M8 11h8"/><path d="M8 15h5"/></svg>',
  // X-ray: a scan frame with grid lines in it — "show me the grid".
  xray:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>' +
    '<path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>' +
    '<path d="M10 7.5v9"/><path d="M14 7.5v9"/><path d="M7.5 12h9"/></svg>',
  // Design overlay: a picture laid over another frame — the design on the page.
  design_overlay:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M3 15V5a2 2 0 0 1 2-2h10"/><rect x="7" y="7" width="14" height="14" rx="2"/>' +
    '<circle cx="11.5" cy="11.5" r="1.25"/><path d="m21 17-3.5-3.5L10 21"/></svg>',
  // The site canvas: the site's pages as a tree — one above, two below. Not a
  // grid (patterns, the breakpoint row) and not a frame over a frame (design).
  site_canvas:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/>' +
    '<rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M6 16v-4h12v4"/></svg>',
  // The page's blueprint: two stacked field rows.
  blueprint:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',
  // Bard's text styles: a letter with a brush stroke under it.
  bard_styles:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M5 16 10 4l5 12"/><path d="M6.8 12h6.4"/><path d="M4 20h16"/><path d="M17 4h3M18.5 4v6"/></svg>',
};
