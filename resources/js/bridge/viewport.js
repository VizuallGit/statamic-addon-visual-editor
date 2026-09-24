/**
 * bridge.js — the part of the page that is on screen.
 *
 * Ordinarily the window's viewport: what the preview iframe shows. In the
 * breakpoint overview's row the preview is page-high and the row pans, so the
 * viewport is the whole page and what is on screen is a band of it; the
 * overview writes that band on this window as `__sveBand` (in the page's own
 * pixels) while it is open, and takes it away with itself. UI anchored to the
 * viewport — a confirm card in the middle, a bar along the bottom — goes by
 * the band when there is one, and is otherwise laid out exactly as before.
 *
 * May import: nothing.
 */

/** The band the overview says is on screen, or null when the viewport is what is seen. */
export function visibleBand(win) {
  const band = win.__sveBand;

  return band && Number.isFinite(band.top) && Number.isFinite(band.height) ? band : null;
}

/** A card meant for the middle of the viewport: in the middle of the band instead, when there is one. */
export function centreInBand(win, overlay, card) {
  const band = visibleBand(win);

  if (!band) {
    return;
  }

  overlay.style.alignItems = 'flex-start';
  overlay.style.justifyContent = 'flex-start';
  card.style.position = 'absolute';
  card.style.left = `${band.left + band.width / 2}px`;
  card.style.top = `${band.top + band.height / 2}px`;
  card.style.transform = 'translate(-50%, -50%)';
}

/** A bar meant for the bottom of the viewport (`bottom: <gap>px`, centred): along the bottom of the band instead. */
export function alongBandBottom(win, bar, gap) {
  const band = visibleBand(win);

  if (!band) {
    return;
  }

  bar.style.bottom = 'auto';
  bar.style.left = `${band.left + band.width / 2}px`;
  bar.style.top = `${band.top + band.height - gap}px`;
  bar.style.transform = 'translate(-50%, -100%)';
}
