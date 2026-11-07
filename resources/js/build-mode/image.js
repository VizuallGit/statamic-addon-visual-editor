/**
 * An image's options in Build's Content — its size, format, quality, blur and
 * loading — and its picture: a crop of its own for a screen size.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: build-mode/attrs.js, build-mode/markup.js, build-mode/place.js. Pure — no editor, no bus, no DOM.
 * Bus messages: none.
 *
 * The site does the work, not the editor: an `<img>` with `format`, `quality`
 * or `blur` is made into Glide addresses at 1x and 2x, cropped on the focus
 * point when it has both a width and a height, with the blurred placeholder
 * (the site's App\Frontend\ImageMarkup). The file keeps the short element:
 *
 *   <img src="{{ media }}" alt="…" width="1200" format="webp" quality="70" blur>
 *
 * A screen size of its own is a `<source>` in a `<picture>` around the image,
 * with the size's media query and its width and height and no address: the
 * site fills in the image's, so a new image is picked once, on the `<img>`.
 *
 *   <picture>
 *       <source media="(max-width: 767.98px)" width="768" height="768">
 *       <img src="{{ media }}" alt="…" width="1200" height="675" format="webp" quality="70" blur>
 *   </picture>
 *
 * The sizes are the site's own (breakpoints.js), written with their px media
 * query — a `>` in `(width >= …)` would end the tag for every reader that
 * looks for its `>`. The one furthest from the base comes first, as
 * `<picture>` takes the first that matches. A site that does not say it
 * makes images (site-images.js) gets none of this.
 */

import { attributeList, readAttribute, withAttribute } from './attrs.js';
import { INDENT } from './markup.js';
import { findByPath, parentOf } from './place.js';

/** The options the site's image work reads; an `<img>` with none is left as it is. */
export const IMAGE_OPTIONS = ['format', 'quality', 'blur'];

/** A new image's width, and a picture's at the widest size. */
export const IMAGE_WIDTH = 1200;

export const QUALITY = 70;

/** The shapes a width and a height are offered as; any other pair is Custom. */
export const RATIOS = [
  { key: '16:9', w: 16, h: 9 },
  { key: '3:2', w: 3, h: 2 },
  { key: '4:3', w: 4, h: 3 },
  { key: '1:1', w: 1, h: 1 },
  { key: '3:4', w: 3, h: 4 },
  { key: '2:3', w: 2, h: 3 },
  { key: '9:16', w: 9, h: 16 },
  { key: '21:9', w: 21, h: 9 },
];

const tagOf = (node) => (!node || node.kind ? '' : String(node.tag || '').toLowerCase());
const whole = (value) => (/^\s*\d+\s*$/.test(String(value ?? '')) && Number(value) > 0 ? Number(value) : null);
const named = (source, node, name) => attributeList(source, node).find((attr) => attr.name.toLowerCase() === name) || null;

/** The ratio a width and a height make: a RATIOS key, 'custom', or 'original' without both. */
export function ratioOf(width, height) {
  if (!width || !height) {
    return 'original';
  }

  return RATIOS.find((r) => Math.round((width * r.h) / r.w) === height)?.key || 'custom';
}

/** The height a width has at a ratio, or null for 'original'. */
export function heightFor(width, key) {
  const r = RATIOS.find((item) => item.key === key);

  return r && width ? Math.round((width * r.h) / r.w) : null;
}

/**
 * The image an element stands for: an `<img>`; the `<img>` in a `<picture>`;
 * or the `<img>` of the `<picture>` a `<source>` is in. `picture` is the
 * `<picture>` around it, or null.
 *
 * @returns {{ img: object, picture: object|null }|null}
 */
export function imageAt(roots, path) {
  const node = path ? findByPath(roots, path) : null;
  const tag = tagOf(node);
  const imgIn = (picture) => (picture?.children || []).find((kid) => tagOf(kid) === 'img') || null;

  if (tag === 'img') {
    const parent = parentOf(roots, node);

    return { img: node, picture: tagOf(parent) === 'picture' ? parent : null };
  }

  if (tag === 'picture') {
    const img = imgIn(node);

    return img ? { img, picture: node } : null;
  }

  if (tag === 'source') {
    const parent = parentOf(roots, node);
    const img = tagOf(parent) === 'picture' ? imgIn(parent) : null;

    return img ? { img, picture: parent } : null;
  }

  return null;
}

/**
 * The image's options as the file has them. `on` when the site works on it
 * (any of IMAGE_OPTIONS); `format` is 'off' when it does not.
 *
 * @returns {{ on: boolean, width: number|null, height: number|null, format: string, quality: number|null, blur: boolean, loading: 'lazy'|'eager'|'first' }}
 */
export function readImage(source, img) {
  const read = (name) => readAttribute(source, img, name);
  const on = IMAGE_OPTIONS.some((name) => named(source, img, name));
  const blur = named(source, img, 'blur');
  const priority = named(source, img, 'priority');
  let format = String(read('format') || '').trim().toLowerCase() || 'webp';

  if (format === 'jpeg') {
    format = 'jpg';
  }

  return {
    on,
    width: whole(read('width')),
    height: whole(read('height')),
    format: on ? format : 'off',
    quality: whole(read('quality')),
    blur: !!blur && !['false', '0', 'off'].includes(String(blur.value).trim().toLowerCase()),
    loading: priority && ['', 'true', 'high'].includes(String(priority.value).trim().toLowerCase())
      ? 'first'
      : String(read('loading') || '').toLowerCase() === 'eager'
        ? 'eager'
        : 'lazy',
  };
}

/**
 * The attributes a change of options writes on the `<img>` (for setAttrsAt):
 * null takes one out, `true` writes it bare. An image the site does not work
 * on yet is switched on by any change but Off — size, quality and blur are
 * the site's work — with WebP, unless the change is a format.
 *
 * @param {ReturnType<typeof readImage>} now
 * @param {{ width?: number|null, height?: number|null, format?: string, quality?: number|null, blur?: boolean, loading?: string }} change
 */
export function imageAttrs(now, change, quality = QUALITY) {
  const out = {};

  if ('width' in change) {
    out.width = change.width ? String(change.width) : null;
  }

  if ('height' in change) {
    out.height = change.height ? String(change.height) : null;
  }

  if ('quality' in change) {
    out.quality = change.quality ? String(change.quality) : null;
  }

  if ('blur' in change) {
    out.blur = change.blur ? true : null;
  }

  if ('loading' in change) {
    out.loading = change.loading === 'eager' ? 'eager' : null;
    out.priority = change.loading === 'first' ? 'true' : null;
  }

  if (change.format === 'off') {
    Object.assign(out, { format: null, quality: null, blur: null });
    change = {};
  }

  if ('format' in change) {
    out.format = change.format;
  }

  // Loading is the browser's own (and priority the site's head); the rest is the site's image work.
  if (!now.on && ['width', 'height', 'quality', 'blur', 'format'].some((key) => key in change)) {
    out.format ??= 'webp';

    if (!('quality' in change)) {
      out.quality = String(quality);
    }
  }

  // One order, so a new one lands where the others put it (written with `end`).
  return Object.fromEntries(ORDER.filter((key) => key in out).map((key) => [key, out[key]]));
}

const ORDER = ['width', 'height', 'format', 'quality', 'blur', 'loading', 'priority'];

/** The largest width or height a box takes: a typo must not have the server make a giant image. */
export const MAX_SIDE = 5000;

/**
 * The image's options written on the tag in one order — width, height,
 * format, quality, blur, loading, priority — at its end, wherever they stood:
 * a height added later stands beside its width, not after blur. Anything
 * else on the tag (src, alt, class …) stays where it is. `attrs` as
 * imageAttrs gives them: a value, `true` for bare, null for gone.
 *
 * @returns {string} the file
 */
export function withImageAttrs(source, roots, path, attrs) {
  let text = String(source || '');
  const node = () => findByPath(roots(text), path);
  const kept = {};

  for (const key of ORDER) {
    const hit = node() && named(text, node(), key);

    if (key in attrs) {
      kept[key] = attrs[key];
    } else if (hit) {
      kept[key] = hit.bare ? true : hit.value;
    }
  }

  for (const key of ORDER) {
    if (node() && named(text, node(), key)) {
      text = withAttribute(text, node(), key, null);
    }
  }

  for (const key of ORDER) {
    if (kept[key] !== undefined && kept[key] !== null && node()) {
      text = withAttribute(text, node(), key, kept[key], { end: true });
    }
  }

  return text;
}

/**
 * The screen sizes a picture can have a crop for: every size but the base,
 * the one furthest from the base first (the order `<source>` stands in), each
 * with the width that covers it — up to where the next wider size begins.
 *
 * @param {Array<object>} rows  breakpoints(), widest first
 * @returns {Array<{ handle: string, label: string, media: string, width: number, order: number }>}
 */
export function pictureSizes(rows) {
  const list = rows || [];
  const base = Math.max(0, list.findIndex((row) => row.base));

  return list
    .map((row, at) => ({
      handle: row.handle,
      label: row.label || row.handle,
      media: String(row.media_px || row.media || ''),
      width: at === 0 ? IMAGE_WIDTH : Math.max(1, Math.ceil(Number(list[at - 1].min_px) || IMAGE_WIDTH)),
      order: Math.abs(at - base),
      base: at === base,
    }))
    .filter((size) => !size.base && size.media)
    .sort((a, b) => b.order - a.order);
}

const sameMedia = (a, b) => String(a || '').replace(/\s+/g, '').toLowerCase() === String(b || '').replace(/\s+/g, '').toLowerCase();

/**
 * The picture's `<source>`s by size: `{ [handle]: { path, width, height } }`.
 * A `<source>` of another media query, or with an address of its own, is the
 * author's and is not a size here.
 */
export function readSources(source, picture, sizes, rows = []) {
  const out = {};

  for (const kid of picture?.children || []) {
    if (tagOf(kid) !== 'source') {
      continue;
    }

    const media = readAttribute(source, kid, 'media');
    const size = sizes.find((s) => sameMedia(s.media, media) || sameMedia(rows.find((row) => row.handle === s.handle)?.media, media));

    if (size && !out[size.handle]) {
      out[size.handle] = {
        path: kid.path,
        width: whole(readAttribute(source, kid, 'width')),
        height: whole(readAttribute(source, kid, 'height')),
      };
    }
  }

  return out;
}

/** The whitespace in front of `at` on its line, or null when something else stands there. */
function indentAt(text, at) {
  const start = text.lastIndexOf('\n', at - 1) + 1;
  const before = text.slice(start, at);

  return /^[ \t]*$/.test(before) ? before : null;
}

function sourceTag(size, width, height) {
  return `<source media="${size.media}"${width ? ` width="${width}"` : ''}${height ? ` height="${height}"` : ''}>`;
}

/** A new image the site works on: a width of its own shape, WebP at the site's quality, blurred while it loads. */
export function imageMarkup(quality = QUALITY) {
  return `<img src="" alt="" width="${IMAGE_WIDTH}" format="webp" quality="${quality}" blur>`;
}

/**
 * A new picture: the image, and a crop for every other screen size — the
 * narrower, the squarer (1:1 to 800 px, 4:3 to 1100 px, else 16:9).
 */
export function pictureMarkup(sizes, quality = QUALITY) {
  const shape = (width) => (width <= 800 ? '1:1' : width <= 1100 ? '4:3' : '16:9');
  const lines = (sizes || []).map((size) => sourceTag(size, size.width, heightFor(size.width, shape(size.width))));
  const img = `<img src="" alt="" width="${IMAGE_WIDTH}" height="${heightFor(IMAGE_WIDTH, '16:9')}" format="webp" quality="${quality}" blur>`;

  return `<picture>\n${[...lines, img].map((line) => INDENT + line).join('\n')}\n</picture>`;
}

/**
 * A size given its own crop: a `<source>` put in the picture in its place, or
 * — an image on its own — the image wrapped in a `<picture>` with it.
 *
 * @returns {{ html: string, imgAt: number }} the file, and where the image now starts
 */
export function withSource(source, found, size, sizes, { width, height } = {}) {
  const text = String(source || '');
  const { img, picture } = found;
  const tag = sourceTag(size, width ?? size.width, height);

  if (!picture) {
    const indent = indentAt(text, img.from);
    const imgTag = text.slice(img.from, img.openTo);

    if (indent === null) {
      return { html: `${text.slice(0, img.from)}<picture>${tag}${imgTag}</picture>${text.slice(img.openTo)}`, imgAt: img.from + `<picture>${tag}`.length };
    }

    const inner = `${indent}    `;
    const head = `<picture>\n${inner}${tag}\n${inner}`;

    return { html: `${text.slice(0, img.from)}${head}${imgTag}\n${indent}</picture>${text.slice(img.openTo)}`, imgAt: img.from + head.length };
  }

  // Before the first that comes after it, else before the image.
  const kids = (picture.children || []).filter((kid) => tagOf(kid) === 'source');
  const rank = (node) => sizes.find((s) => sameMedia(s.media, readAttribute(text, node, 'media')));
  const next = kids.find((kid) => {
    const other = rank(kid);

    return other && other.order < size.order;
  }) || img;
  const indent = indentAt(text, next.from);
  const put = `${tag}${indent === null ? '' : `\n${indent}`}`;

  return { html: text.slice(0, next.from) + put + text.slice(next.from), imgAt: img.from + put.length };
}

/**
 * A size's crop taken out. The last one out takes the `<picture>` with it, so
 * the image stands on its own again — unless the `<picture>` has attributes
 * or other `<source>`s of its own, which are the author's.
 *
 * @returns {{ html: string, imgAt: number }} the file, and where the image now starts
 */
export function withoutSource(source, roots, found, sourcePath) {
  const text = String(source || '');
  const { img, picture } = found;
  const node = findByPath(roots, sourcePath);

  if (!node || !picture) {
    return { html: text, imgAt: img.from };
  }

  const kids = (picture.children || []).filter((kid) => kid !== img);
  const bare = !/\S/.test(text.slice(picture.from + '<picture'.length, picture.openTo - 1));

  if (kids.length === 1 && kids[0] === node && bare) {
    return { html: text.slice(0, picture.from) + text.slice(img.from, img.openTo) + text.slice(picture.to), imgAt: picture.from };
  }

  // The line it stands on, when it stands on one alone.
  const indent = indentAt(text, node.from);
  const lineEnd = text.indexOf('\n', node.openTo);
  const alone = indent !== null && (lineEnd === -1 ? !/\S/.test(text.slice(node.openTo)) : !/\S/.test(text.slice(node.openTo, lineEnd)));
  const from = alone ? node.from - indent.length : node.from;
  const to = alone && lineEnd !== -1 ? lineEnd + 1 : node.openTo;

  return { html: text.slice(0, from) + text.slice(to), imgAt: from < img.from ? img.from - (to - from) : img.from };
}

/**
 * The path of the element that starts at `at` — the image again, after the
 * file around it changed — or ''.
 */
export function pathAt(roots, at) {
  for (const node of roots || []) {
    if (!node.kind && node.from === at) {
      return node.path;
    }

    const hit = pathAt(node.children, at);

    if (hit) {
      return hit;
    }
  }

  return '';
}
