/**
 * Same glyphs as the HTML dock toolbar (H / P / div / section / list).
 * Tags without a dock button get a small bracket mark.
 */

export const HTML_TREE_ICONS = {
  div: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',
  section:
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',
  ul: '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',
  li: '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>',
  a: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6.2 8.8 4.8 10.2a2.2 2.2 0 0 0 3.1 3.1l1.8-1.8"/><path d="M9.8 7.2l1.4-1.4a2.2 2.2 0 0 0-3.1-3.1L6.3 4.5"/></svg>',
  img: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="10" rx="1.2"/><circle cx="5.5" cy="6.2" r="1.1"/><path d="M2.8 12.2 6.2 9l2.2 2.2 2-1.8 2.8 2.8"/></svg>',
  other:
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5.2 3.5 2.8 8l2.4 4.5"/><path d="M10.8 3.5 13.2 8l-2.4 4.5"/></svg>',
};

export function htmlTreeIcon(tag) {
  if (/^h[1-6]$/.test(tag)) {
    return { letter: 'H' };
  }

  if (tag === 'p') {
    return { letter: 'P' };
  }

  if (tag === 'div') {
    return { svg: HTML_TREE_ICONS.div };
  }

  if (tag === 'section' || tag === 'article' || tag === 'header' || tag === 'footer' || tag === 'main' || tag === 'nav' || tag === 'aside') {
    return { svg: HTML_TREE_ICONS.section };
  }

  if (tag === 'ul' || tag === 'ol') {
    return { svg: HTML_TREE_ICONS.ul };
  }

  if (tag === 'li') {
    return { svg: HTML_TREE_ICONS.li };
  }

  if (tag === 'a') {
    return { svg: HTML_TREE_ICONS.a };
  }

  if (tag === 'img' || tag === 'picture' || tag === 'svg') {
    return { svg: HTML_TREE_ICONS.img };
  }

  return { svg: HTML_TREE_ICONS.other };
}
