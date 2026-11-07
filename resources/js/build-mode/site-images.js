/**
 * Whether the site makes images from an element's options, and with what.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: nothing. Reads the Control Panel's config only.
 * Bus messages: none.
 *
 * The site says so with `sveImageOptions` (its App\Frontend\ImageMarkup):
 * `{ formats: ['webp', 'avif', 'jpg', 'png'], quality: 70 }` — the formats its
 * server can make, AVIF only where it can. A site that does not say it gets
 * no image options and no Picture tile (image.js, catalog.js).
 */
export function siteImageOptions(win = globalThis) {
  const options = win?.Statamic?.$config?.get?.('sveImageOptions');

  return options && Array.isArray(options.formats) ? options : null;
}
