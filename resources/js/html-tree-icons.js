/**
 * The glyphs for the HTML dock toolbar and the HTML tree.
 *
 * One map, imported by both. They each kept their own copies once, and the
 * copies drifted: the same tag wore one mark in the toolbar and another in the
 * tree, so nothing in the panel taught you what the button in the row meant.
 *
 * Tags without a glyph get a small bracket mark; a component gets the cube, so
 * a row that lives in its own file reads as one at a glance.
 */

export const HTML_ICONS = {
  div: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2" stroke-dasharray="2.6 2"/></svg>',
  /*
   * Section, text and link are the set the reader picked, at our size: the
   * glyphs carry their own 16 and 24 viewBoxes, and only the drawn size is
   * ours, so they line up with the marks beside them in the row.
   */
  section:
    '<svg width="14" height="14" viewBox="-1.2 -1.2 18.4 18.4" fill="none" stroke="currentColor">'
    + '<path d="M15 14.8457V15H1V14.8457H15ZM2.80762 3.30762H13.1924C14.1907 3.30766 14.9999 4.11697 15 5.11523V10.8848C14.9999 11.883 14.1907 12.6923 13.1924 12.6924H2.80762C1.80934 12.6923 1.00008 11.883 1 10.8848V5.11523C1.00008 4.11697 1.80934 3.30766 2.80762 3.30762ZM15 1V1.1543H1V1H15Z"/></svg>',
  ul: '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',
  li: '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>',
  a:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M10 13.229C10.1416 13.4609 10.3097 13.6804 10.5042 13.8828C11.7117 15.1395 13.5522 15.336 14.9576 14.4722C15.218 14.3121 15.4634 14.1157 15.6872 13.8828L18.9266 10.5114C20.3578 9.02184 20.3578 6.60676 18.9266 5.11718C17.4953 3.6276 15.1748 3.62761 13.7435 5.11718L13.03 5.85978"/>'
    + '<path d="M10.9703 18.14L10.2565 18.8828C8.82526 20.3724 6.50471 20.3724 5.07345 18.8828C3.64218 17.3932 3.64218 14.9782 5.07345 13.4886L8.31287 10.1172C9.74413 8.62761 12.0647 8.6276 13.4959 10.1172C13.6904 10.3195 13.8584 10.539 14 10.7708"/></svg>',
  img: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="10" rx="1.2"/><circle cx="5.5" cy="6.2" r="1.1"/><path d="M2.8 12.2 6.2 9l2.2 2.2 2-1.8 2.8 2.8"/></svg>',
  svg: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M8 2.2l1.7 3.6 3.9.5-2.9 2.7.8 3.9L8 11l-3.5 1.9.8-3.9L2.4 6.3l3.9-.5Z"/></svg>',
  text:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M14 19L9 5H7L2 19M4 14H12"/>'
    + '<path d="M16.5 11.5L16.6298 11.3053C17.1735 10.4898 18.0887 10 19.0688 10C20.6876 10 22 11.3124 22 12.9312V18.5M22 14H18.561C17.1466 14 16 15.1466 16 16.561C16 17.908 17.092 19 18.439 19H18.7408C19.2376 19 19.725 18.865 20.151 18.6094L20.3033 18.518C21.3559 17.8864 22 16.7489 22 15.5213V14Z"/></svg>',
  /*
   * Heading: an H drawn at the same weight as the letters beside it. It was
   * type before — a bold capital sitting among 1.5px strokes, which read as a
   * heavier button rather than as another tag.
   */
  heading:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M6 5v14M18 5v14M6 12h12"/></svg>',
  component:
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M8 1.6 13.4 4.8v6.4L8 14.4 2.6 11.2V4.8Z"/><path d="M2.6 4.8 8 8l5.4-3.2M8 8v6.4"/></svg>',
  loop: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M8 8s-1.3-2.4-3-2.4a2.4 2.4 0 0 0 0 4.8C6.7 10.4 8 8 8 8Z"/><path d="M8 8s1.3 2.4 3 2.4a2.4 2.4 0 0 0 0-4.8C9.3 5.6 8 8 8 8Z"/></svg>',
  if: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.6 2.8v10.4"/><path d="M2.4 11l2.2 2.2L6.8 11"/><path d="M11.4 13.2V2.8"/><path d="M9.2 5 11.4 2.8 13.6 5"/></svg>',
  /** Lines stepping in: the file lined up again. */
  tidy:
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M2.5 3.2h11"/><path d="M6.5 6.7h7"/><path d="M6.5 9.8h7"/><path d="M2.5 13.2h11"/>'
    + '<path d="M2.6 6.6 4.4 8.25 2.6 9.9"/></svg>',
  other:
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5.2 3.5 2.8 8l2.4 4.5"/><path d="M10.8 3.5 13.2 8l-2.4 4.5"/></svg>',
};

import { SECTION_TAGS, TEXT_TAGS } from './lib/tag-families.js';

/** Every tag the text glyph stands for; the toolbar's Text button writes these. */
export { TEXT_TAGS };

export function htmlTreeIcon(tag, kind, antlers) {
  if (kind === 'component') {
    return { svg: HTML_ICONS.component };
  }

  if (kind === 'antlers') {
    return { svg: antlers === 'loop' ? HTML_ICONS.loop : HTML_ICONS.if };
  }

  if (/^h[1-6]$/.test(tag)) {
    return { svg: HTML_ICONS.heading };
  }

  // Every tag the Text button can write, plus the two it cannot: `b` and `i`
  // are the same thing in an older spelling, and a row wearing a different
  // mark for them would read as a different kind of thing.
  if (TEXT_TAGS.includes(tag) || tag === 'b' || tag === 'i' || tag === 'small') {
    return { svg: HTML_ICONS.text };
  }

  if (tag === 'div') {
    return { svg: HTML_ICONS.div };
  }

  if (SECTION_TAGS.includes(tag)) {
    return { svg: HTML_ICONS.section };
  }

  if (tag === 'ul' || tag === 'ol') {
    return { svg: HTML_ICONS.ul };
  }

  if (tag === 'li') {
    return { svg: HTML_ICONS.li };
  }

  if (tag === 'a') {
    return { svg: HTML_ICONS.a };
  }

  if (tag === 'img' || tag === 'picture' || tag === 'svg') {
    return { svg: HTML_ICONS.img };
  }

  return { svg: HTML_ICONS.other };
}
