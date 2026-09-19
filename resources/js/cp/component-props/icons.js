/**
 * One glyph per kind of field, drawn wherever a kind is named: the plus menu
 * and the card in the fields panel. Kept in one place so the two never show a
 * different picture for the same kind.
 *
 * Stroke icons on a 24-box in `currentColor`, so each takes the colour of the
 * row it sits in. Sized by whoever draws it.
 */
const A = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"';

export const PROP_ICONS = {
  text: `<svg ${A}><path d="M5 6h14M12 6v13"/></svg>`,
  bard: `<svg ${A}><path d="M4 6h16M4 12h16M4 18h10"/></svg>`,
  number: `<svg ${A}><path d="M9 4 7 20M17 4l-2 16M4 9h16M4 15h16"/></svg>`,
  boolean: `<svg ${A}><rect x="2.5" y="7" width="19" height="10" rx="5"/><circle cx="15.5" cy="12" r="2.6" fill="currentColor" stroke="none"/></svg>`,
  select: `<svg ${A}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m9 11 3 3 3-3"/></svg>`,
  color: `<svg ${A}><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 0 0 17z" fill="currentColor" stroke="none"/></svg>`,
  media: `<svg ${A}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="m3 16 4.5-4.5L13 17"/><path d="m14 14 2.5-2.5L21 16"/></svg>`,
  link: `<svg ${A}><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>`,
};
