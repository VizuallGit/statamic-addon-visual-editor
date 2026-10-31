/**
 * What an <img> or a <video> with no file looks like in the editor: a box that
 * says what it is, where the page would otherwise have nothing to see or click.
 *
 * Only CSS, and only in the editor's own documents: nothing is added to the
 * element, the file or the public page, so there is nothing for a morph to
 * meet. The element's own classes decide its size. `base` goes in a layer of its
 * own, above Tailwind's reset and below its utilities, so `w-20` or `h-64` win
 * and the reset's `height: auto` does not; `own` is the look, on top. A sheet with
 * `base` must come ahead of the page's, for that order to be the one that counts.
 *
 * May import: nothing.
 */
const EMPTY_IMAGE = 'img[src=""],img:not([src])';
const EMPTY_VIDEO = 'video[src=""],video:not([src],:has(source))';
const EMPTY = `${EMPTY_IMAGE},${EMPTY_VIDEO}`;

const ACCENT = '#3858e9';
/** In place of the browser's own broken-image icon, which would draw over the box. */
const NOTHING = 'url("data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==")';
const ICONS = {
  image: '<rect x="93" y="5" width="22" height="22" rx="3"/><circle cx="100" cy="12" r="2"/><path d="m93 23 6-6 5 5 3-3 8 7"/>',
  video: '<rect x="93" y="5" width="22" height="22" rx="3"/><path d="m101 11 7 5-7 5Z"/>',
};

function escaped(words) {
  return String(words).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function picture(icon, word, hint) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 208 72"><g fill="none" stroke="${ACCENT}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${icon}</g><g fill="${ACCENT}" font-family="ui-sans-serif,system-ui,-apple-system,sans-serif" text-anchor="middle"><text x="104" y="47" font-size="14" font-weight="600">${escaped(word)}</text><text x="104" y="65" font-size="12" opacity=".75">${escaped(hint)}</text></g></svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** Is this element one that shows the box? The one test for the CSS and for a click. */
export function isEmptyMedia(el) {
  return !!el?.matches?.(EMPTY);
}

/** The two sheets, in the editor's language: `{ image, video, hint }`. */
export function mediaPlaceholderCss({ image, video, hint }) {
  const look = (selector, bg) =>
    `:is(${selector}){background:rgba(56,88,233,.08) ${bg} center/min(100%,13rem) auto no-repeat;outline:1px dashed rgba(56,88,233,.6);outline-offset:-1px;color:transparent}`;

  return {
    base: `@layer theme,base,sve-media-base,components,utilities;@layer sve-media-base{:is(${EMPTY}){display:block;width:100%}:is(${EMPTY}):not([class*="aspect-"]){height:10rem}}`,
    own: `${look(EMPTY_IMAGE, picture(ICONS.image, image, hint))}
:is(${EMPTY_IMAGE}){content:${NOTHING}}
${look(EMPTY_VIDEO, picture(ICONS.video, video, hint))}
:is(${EMPTY_VIDEO})::-webkit-media-controls{display:none!important}`,
  };
}
