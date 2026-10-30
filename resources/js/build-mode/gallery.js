/**
 * A gallery: a Tailwind grid of images, chosen by hand or read from an assets
 * field in a loop. Read from the file, so one written by hand is one too.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: html-tree-parse.js, attrs.js, markup.js. Pure.
 * Bus messages: none.
 *
 *   <div class="grid grid-cols-3 gap-4">
 *       <img src="/a.jpg" alt="…" class="w-full">
 *   </div>
 *
 *   <div class="grid grid-cols-3 gap-4">
 *       {{ galleri }}
 *           <img src="{{ url }}" alt="{{ alt | entities }}" class="w-full">
 *       {{ /galleri }}
 *   </div>
 */

import { altFromAsset, readAttribute } from './attrs.js';
import { INDENT } from './markup.js';

const isImg = (node) => !node.kind && String(node.tag).toLowerCase() === 'img';

function loopOf(node) {
  const kids = node?.children || [];
  const loop = kids.length === 1 && kids[0].kind === 'antlers' && kids[0].antlers === 'loop' ? kids[0] : null;

  return loop && loop.children?.length === 1 && isImg(loop.children[0]) ? loop : null;
}

/** Is this element a gallery: a grid holding images and nothing else, or one loop of an image? */
export function isGallery(source, node) {
  if (!node || node.kind || String(node.tag).toLowerCase() !== 'div') {
    return false;
  }

  if (!/(^|\s)grid(\s|$)/.test(readAttribute(source, node, 'class') || '')) {
    return false;
  }

  const kids = node.children || [];

  return kids.length > 0 && (kids.every(isImg) || !!loopOf(node));
}

/** @returns {{ field: string|null, urls: string[] }} the field it loops over, or the addresses of its images */
export function readGallery(source, node) {
  const html = String(source || '');
  const loop = loopOf(node);

  if (loop) {
    return { field: /^\{\{\s*([^\s}|]+)/.exec(html.slice(loop.from, loop.openTo))?.[1] || null, urls: [] };
  }

  return { field: null, urls: (node?.children || []).map((img) => readAttribute(html, img, 'src') || '').filter(Boolean) };
}

function classesOf(html, node) {
  const first = loopOf(node)?.children[0] || (node.children || [])[0];
  const classes = first ? readAttribute(html, first, 'class') : '';

  return classes ? ` class="${classes}"` : '';
}

function withBody(html, node, lines) {
  const close = html.lastIndexOf('</', node.to);
  const lineStart = html.lastIndexOf('\n', node.from) + 1;
  const indent = /^\s*/.exec(html.slice(lineStart, node.from))?.[0] || '';
  const body = lines.map((line) => `${indent}${INDENT}${line}`).join('\n');

  return `${html.slice(0, node.openTo)}\n${body}\n${indent}${html.slice(close)}`;
}

/** The gallery holding these images, its classes kept; with none, one empty image keeps it a gallery. */
export function withGalleryImages(source, node, urls) {
  const html = String(source || '');
  const classes = classesOf(html, node);
  const image = (url) => `<img src="${url}" alt="${url ? altFromAsset(url) : ''}"${classes}>`;

  return withBody(html, node, (urls.length ? urls : ['']).map(image));
}

/** The gallery reading a field (`{{ galleri }}`) in a loop, its classes kept. */
export function withGalleryField(source, node, field) {
  const html = String(source || '');
  const name = /^\{\{\s*([^\s}|]+)/.exec(String(field || ''))?.[1];

  if (!name) {
    return withGalleryImages(html, node, []);
  }

  return withBody(html, node, [
    `{{ ${name} }}`,
    `${INDENT}<img src="{{ url }}" alt="{{ alt | entities }}"${classesOf(html, node)}>`,
    `{{ /${name} }}`,
  ]);
}
