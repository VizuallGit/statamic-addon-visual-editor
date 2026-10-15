/**
 * The cards in one of the layout's tabs, before anything is drawn.
 *
 * `data` is `/!/sve/layout-patterns`' answer. Every header and footer can be
 * dragged — a drop onto a header that is already there asks to replace it.
 * A section goes in once: after that its card says it is in the layout.
 *
 * May import: nothing. Pure, so the rules are tested without a CP.
 */
export const LAYOUT_KIND = { header: 'header', footer: 'footer', sections: 'section' };

export function layoutCardStates(data, tab, { query = '' } = {}) {
  const kind = LAYOUT_KIND[tab];
  const place = kind ? data?.[kind] : null;

  if (!place) {
    return null;
  }

  const q = String(query).trim().toLowerCase();

  return (place.patterns || [])
    .filter((pattern) => !q || String(pattern.title).toLowerCase().includes(q))
    .map((pattern) => ({
      key: pattern.handle,
      title: pattern.title,
      imageUrl: '',
      value: pattern.handle,
      item: pattern,
      kind,
      state: pattern.placed ? 'in' : 'free',
      // Over a header or footer already there, the drop asks first.
      replaces: kind !== 'section' && place.empty === false,
    }));
}
