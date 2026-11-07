/**
 * A video's options in Build's Content — its shape, how it plays, how much the
 * browser loads before it plays, and its poster — as the element's attributes.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: build-mode/attrs.js, data-var-types.js. Pure — no editor, no bus, no DOM.
 * Bus messages: none.
 *
 *   <video src="{{ media }}" class="aspect-video object-cover" autoplay muted playsinline loop
 *          preload="metadata" poster="{{ media | video_poster }}"></video>
 *
 * The shape is Style's own class (`aspect-video`, `aspect-[4/3]` …), written
 * with the same engine as Style → Size → Aspect ratio, so the two always agree;
 * a shape picked brings `object-cover`, so the video fills it.
 * Autoplay brings `muted` and `playsinline`: browsers start only a muted video
 * by themselves. The poster is the video's own frame, saved beside it by the
 * upload-video addon (`video_poster`), offered only where that is installed
 * (`sveVideoPoster`). It follows the file: another file, another poster.
 */

import { attributeList, readAttribute } from './attrs.js';
import { wholeTag } from '../data-var-types.js';

/** The shapes offered, as the class Style writes for each. */
export const VIDEO_RATIOS = [
  { key: '16:9', cls: 'aspect-video' },
  { key: '4:3', cls: 'aspect-[4/3]' },
  { key: '1:1', cls: 'aspect-square' },
  { key: '9:16', cls: 'aspect-[9/16]' },
  { key: '21:9', cls: 'aspect-[21/9]' },
];

/** Every class a shape may stand as: one replaces another, Auto takes them away. */
export const RATIO_CLASSES = ['aspect-auto', 'aspect-[16/9]', ...VIDEO_RATIOS.map((r) => r.cls)];

/** How the video fills its shape; one picked by hand is kept. */
export const FIT_CLASSES = ['object-contain', 'object-cover', 'object-fill', 'object-none', 'object-scale-down'];

/** `default` is no attribute: the browser's own choice. */
export const PRELOADS = ['default', 'none', 'metadata', 'auto'];

const named = (source, node, name) => attributeList(source, node).find((attr) => attr.name.toLowerCase() === name) || null;
const on = (attr) => !!attr && !['false', '0', 'off'].includes(String(attr.value ?? '').trim().toLowerCase());

/** The shape the classes give: a VIDEO_RATIOS key, or 'auto'. */
export function ratioOfClasses(classes) {
  const list = String(classes || '').split(/\s+/);

  if (list.includes('aspect-[16/9]')) {
    return '16:9';
  }

  return VIDEO_RATIOS.find((r) => list.includes(r.cls))?.key || 'auto';
}

/** The class a shape is written as; '' for Auto. */
export function ratioClass(key) {
  return VIDEO_RATIOS.find((r) => r.key === key)?.cls || '';
}

/** @returns {{ ratio: string, autoplay: boolean, loop: boolean, muted: boolean, controls: boolean, preload: string, poster: string|null, first: boolean }} */
export function readVideo(source, node) {
  const preload = String(readAttribute(source, node, 'preload') ?? '').trim().toLowerCase();
  const priority = named(source, node, 'priority');

  return {
    ratio: ratioOfClasses(readAttribute(source, node, 'class')),
    autoplay: on(named(source, node, 'autoplay')),
    loop: on(named(source, node, 'loop')),
    muted: on(named(source, node, 'muted')),
    controls: on(named(source, node, 'controls')),
    preload: !named(source, node, 'preload') ? 'default' : PRELOADS.includes(preload) && preload !== 'default' ? preload : 'auto',
    poster: readAttribute(source, node, 'poster'),
    first: !!priority && ['', 'true', 'high'].includes(String(priority.value ?? '').trim().toLowerCase()),
  };
}

/**
 * The attributes a switch writes (for setAttrsAt): `true` bare, null gone.
 * Autoplay on brings muted and playsinline; off leaves them.
 */
export function videoAttrs(change) {
  const out = {};

  if ('autoplay' in change) {
    Object.assign(out, change.autoplay ? { autoplay: true, muted: true, playsinline: true } : { autoplay: null });
  }

  for (const key of ['loop', 'muted', 'controls']) {
    if (key in change) {
      out[key] = change[key] ? true : null;
    }
  }

  if ('preload' in change) {
    out.preload = change.preload === 'default' ? null : change.preload;
  }

  if ('first' in change) {
    out.priority = change.first ? 'true' : null;
  }

  return out;
}

/** Is this poster the video's own frame — the one this switch writes? */
export function isFramePoster(poster) {
  return /\|\s*video_poster\b[^{}]*\}\}\s*$/.test(String(poster ?? ''));
}

/**
 * The poster for a video's file: its own frame, read on the server by the
 * file's field, or by its address. Null without a file, or for an address
 * that is more than one tag (nothing to read the frame off).
 */
export function posterFor(src) {
  const value = String(src ?? '').trim();

  if (!value) {
    return null;
  }

  const field = wholeTag(value);

  if (field !== null) {
    return `{{ ${field} | video_poster }}`;
  }

  return value.includes('{{') ? null : `{{ '${value.replace(/'/g, '%27')}' | video_poster }}`;
}

/**
 * The poster when the file changes: the frame follows the new file, and a
 * video's first file brings its frame with it. A poster written by hand, or
 * one switched off since, is left alone (undefined: no change).
 */
export function posterOnNewFile(nextSrc, nowSrc, nowPoster) {
  if (isFramePoster(nowPoster)) {
    return posterFor(nextSrc);
  }

  if ((nowPoster === null || nowPoster === undefined) && !String(nowSrc ?? '').trim()) {
    return posterFor(nextSrc) ?? undefined;
  }

  return undefined;
}
