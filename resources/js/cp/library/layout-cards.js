/**
 * What each card in one of the layout's tabs is, before anything is drawn:
 *
 *   'in'       in the layout now — a badge, and the trash takes it out
 *   'blocked'  the place already holds its one header (or footer) — greyed,
 *              not draggable, saying the current one goes first
 *   'free'     can be dragged into the layout
 *
 * `slot` is one place as `/!/sve/layout-slots` describes it. For the sections
 * place the cards are the library's saved sections — only global ones can go
 * in, each once. `null` when the site has no such place.
 *
 * May import: nothing. Pure, so the rules are tested without a CP.
 */
export function layoutCardStates(slot, tab, { query = '', saved = [] } = {}) {
  if (!slot) {
    return null;
  }

  const q = String(query).trim().toLowerCase();
  const matches = (title) => !q || String(title).toLowerCase().includes(q);

  if (tab === 'sections') {
    const placed = new Map((slot.rows || []).map((row) => [row.entry, row]));

    return (saved || [])
      .filter((item) => item?.synced && matches(item.title))
      .map((item) => {
        const row = placed.get(String(item.id)) || null;

        return {
          key: String(item.id),
          title: item.title,
          imageUrl: item.preview_url || '',
          value: String(item.id),
          item,
          row,
          state: row ? 'in' : 'free',
        };
      });
  }

  const current = (slot.rows || [])[0] || null;
  const types = slot.types || [];
  const cards = types
    .filter((type) => matches(type.display))
    .map((type) => {
      const mine = !!current && current.type === type.handle;

      return {
        key: type.handle,
        title: type.display,
        imageUrl: '',
        value: type.handle,
        item: type,
        row: mine ? current : null,
        state: mine ? 'in' : current ? 'blocked' : 'free',
      };
    });

  // The row in the place is of a set the list does not offer — renamed,
  // hidden, removed. It still gets its card, in use, so its trash can empty
  // the place; otherwise every card would be greyed and nothing could go in.
  if (current && !types.some((type) => type.handle === current.type) && matches(current.type)) {
    cards.unshift({
      key: current.type,
      title: current.type,
      imageUrl: '',
      value: current.type,
      item: { handle: current.type, display: current.type },
      row: current,
      state: 'in',
    });
  }

  return cards;
}
