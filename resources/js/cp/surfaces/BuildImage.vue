<script setup>
/**
 * An image's options in Build's Content, under its file: its size and shape,
 * a crop of its own per screen size, format, quality, blur and loading.
 *
 * Everything is an attribute of the element (build-mode/image.js), and the
 * site makes the image from them — Glide at 1x and 2x, cropped on the focus
 * point, the blurred placeholder (App\Frontend\ImageMarkup). Shown only when
 * the site says it does (`sveImageOptions`), with the formats its server can
 * make. A screen size with a crop of its own is a `<source>` in a `<picture>`
 * around the image: switched on, the image is wrapped; the last one off, it
 * stands on its own again.
 *
 * Numbers are written when typing is over (Enter, or leaving the box): every
 * number on the way would be an image the server makes.
 */
import { computed, inject, onBeforeUnmount } from 'vue';
import { typed } from './build-typed.js';
import { parseTemplateTree } from '../../html-tree-parse.js';
import { withAttribute } from '../../build-mode/attrs.js';
import { findByPath } from '../../build-mode/place.js';
import {
  IMAGE_WIDTH,
  MAX_SIDE,
  RATIOS,
  heightFor,
  imageAt,
  imageAttrs,
  pathAt,
  pictureSizes,
  ratioOf,
  readImage,
  readSources,
  withImageAttrs,
  withSource,
  withoutSource,
} from '../../build-mode/image.js';
import { siteImageOptions } from '../../build-mode/site-images.js';

const props = defineProps({
  /** The element picked: the `<img>`, its `<picture>` or one of its `<source>`s. */
  path: { type: String, required: true },
});

const port = inject('sveBuild');
const site = siteImageOptions(window);
const QUALITY = site?.quality || 70;

const file = computed(() => (port.rev.value, port.html()));
const tree = computed(() => parseTemplateTree(file.value));
const found = computed(() => imageAt(tree.value, props.path));
const now = computed(() => (found.value ? readImage(file.value, found.value.img) : null));
const rows = computed(() => (port.rev.value, port.sizes?.() || []));
const sizes = computed(() => pictureSizes(rows.value));
const sources = computed(() => (found.value?.picture ? readSources(file.value, found.value.picture, sizes.value, rows.value) : {}));
const baseLabel = computed(() => rows.value.find((row) => row.base)?.label || '');

const FORMAT_NAMES = { webp: 'WebP', avif: 'AVIF', jpg: 'JPG', png: 'PNG' };
const formats = computed(() => [
  ...(site?.formats || []).map((key) => ({ key, label: FORMAT_NAMES[key] || key.toUpperCase() })),
  ...(site?.formats?.includes('avif') ? [] : [{ key: 'avif', label: port.t('content_image_avif_missing'), off: true }]),
  { key: 'original', label: port.t('content_image_format_original') },
  { key: 'off', label: port.t('content_image_format_off') },
]);
const LOADING = ['lazy', 'eager', 'first'];

/**
 * Attributes on several elements in one write — the file read again between,
 * as paths and offsets move. The image's options in their one order
 * (withImageAttrs); a source's width and height where they stand.
 */
function writeAll(changes, select = props.path) {
  let next = file.value;

  for (const [path, attrs] of changes) {
    if (path === imgPath()) {
      next = withImageAttrs(next, parseTemplateTree, path, attrs);

      continue;
    }

    for (const [name, value] of Object.entries(attrs)) {
      const node = findByPath(parseTemplateTree(next), path);

      next = node ? withAttribute(next, node, name, value, { end: true }) : next;
    }
  }

  if (next !== file.value) {
    port.write(next, { select });
  }
}

const imgPath = () => found.value?.img.path || '';

function setImage(change) {
  if (now.value) {
    writeAll([[imgPath(), imageAttrs(now.value, change, QUALITY)]]);
  }
}

/* ---------------- size: the image's, and each screen size's ---------------- */

/** What a row shows: the image (`base`) or a size's `<source>`. */
function sizeOf(handle) {
  if (handle === 'base') {
    return { width: now.value?.width ?? null, height: now.value?.height ?? null };
  }

  return sources.value[handle] || null;
}

/** A row's new width and height: a width keeps the shape picked, a shape takes the width there is. */
function resized(handle, change) {
  const was = sizeOf(handle) || {};
  const ratio = ratioOf(was.width, was.height);

  if ('ratio' in change) {
    const width = was.width || sizes.value.find((s) => s.handle === handle)?.width || IMAGE_WIDTH;

    return { width, height: heightFor(width, change.ratio) };
  }

  if ('width' in change) {
    return { width: change.width, height: ratio === 'original' || ratio === 'custom' ? was.height : heightFor(change.width, ratio) };
  }

  return { width: was.width, height: change.height };
}

function setSize(handle, change) {
  const size = resized(handle, change);

  if (handle === 'base') {
    setImage(size);

    return;
  }

  const source = sources.value[handle];

  if (!source) {
    return;
  }

  const attrs = { width: size.width ? String(size.width) : null, height: size.height ? String(size.height) : null };

  // A crop per size is the site's work: the image is switched on with it.
  writeAll(now.value.on ? [[source.path, attrs]] : [[source.path, attrs], [imgPath(), imageAttrs(now.value, { format: 'webp' }, QUALITY)]]);
}

/** The width or height box of a row, written when typing is over. Made once, here, not while drawing. */
function sizeBox(handle, side) {
  return typed(
    computed(() => String(sizeOf(handle)?.[side] ?? '')),
    (value) => {
      const n = /^\s*\d+\s*$/.test(value) && Number(value) > 0 ? Math.min(MAX_SIDE, Number(value)) : null;

      if (n !== (sizeOf(handle)?.[side] ?? null)) {
        setSize(handle, { [side]: n });
      }
    },
    { live: false }
  );
}

const boxes = Object.fromEntries(
  ['base', ...sizes.value.map((size) => size.handle)].flatMap((handle) => ['width', 'height'].map((side) => [`${handle}:${side}`, sizeBox(handle, side)]))
);
const box = (handle, side) => boxes[`${handle}:${side}`];

/** A screen size given a crop of its own, in the shape the image has — or taken away again. */
function toggleSize(size) {
  const at = found.value;

  if (!at) {
    return;
  }

  const source = sources.value[size.handle];

  if (source) {
    const out = withoutSource(file.value, tree.value, at, source.path);

    port.write(out.html, { select: pathAt(parseTemplateTree(out.html), out.imgAt) });

    return;
  }

  const ratio = ratioOf(now.value.width, now.value.height);
  const height = ratio === 'original' || ratio === 'custom' ? null : heightFor(size.width, ratio);
  const put = withSource(file.value, at, size, sizes.value, { width: size.width, height });
  let next = put.html;
  let img = pathAt(parseTemplateTree(next), put.imgAt);

  if (!now.value.on) {
    next = withImageAttrs(next, parseTemplateTree, img, imageAttrs(now.value, { format: 'webp' }, QUALITY));
    img = pathAt(parseTemplateTree(next), put.imgAt);
  }

  port.write(next, { select: img });
}

/* ---------------- format, quality, blur, loading ---------------- */

const quality = typed(
  computed(() => (now.value?.on ? String(now.value.quality ?? '') : '')),
  (value) => {
    const n = Math.min(100, Math.max(1, Math.round(Number(value) || 0)));

    setImage({ quality: value.trim() === '' ? null : n });
  },
  { live: false }
);

onBeforeUnmount(() => {
  for (const item of Object.values(boxes)) {
    item.done();
  }

  quality.done();
});
</script>

<template>
  <div v-if="site && now" class="bm-img" data-sve-build-image>
    <!-- The image's own size: on a picture, the base size's. -->
    <div class="bm-img-block">
      <span class="fg-lab">{{ port.t('content_image_size') }}<template v-if="sizes.length && found.picture"> · {{ baseLabel }}</template></span>
      <div class="bm-img-size" data-sve-build-image-size="base">
        <input
          v-model="box('base', 'width').value.value"
          class="bm-inp"
          inputmode="numeric"
          :aria-label="port.t('content_image_width')"
          :placeholder="port.t('content_image_width')"
          data-sve-build-image-width
          @input="box('base', 'width').input()"
          @keydown.enter.prevent="box('base', 'width').done()"
          @blur="box('base', 'width').done()"
        />
        <span class="bm-img-x" aria-hidden="true">×</span>
        <input
          v-model="box('base', 'height').value.value"
          class="bm-inp"
          inputmode="numeric"
          :aria-label="port.t('content_image_height')"
          :placeholder="port.t('content_image_auto')"
          data-sve-build-image-height
          @input="box('base', 'height').input()"
          @keydown.enter.prevent="box('base', 'height').done()"
          @blur="box('base', 'height').done()"
        />
        <select class="fg-select bm-img-ratio" :aria-label="port.t('content_image_ratio')" :value="ratioOf(now.width, now.height)" data-sve-build-image-ratio @change="setSize('base', { ratio: $event.target.value })">
          <option value="original">{{ port.t('content_image_ratio_original') }}</option>
          <option v-for="r in RATIOS" :key="r.key" :value="r.key">{{ r.key }}</option>
          <option value="custom" disabled>{{ port.t('content_image_ratio_custom') }}</option>
        </select>
      </div>
      <p v-if="now.on && now.width && now.height" class="bm-img-hint">{{ port.t('content_image_crop_note') }}</p>
    </div>

    <!-- A crop of its own per screen size: a <source> in a <picture>. -->
    <div v-if="sizes.length" class="bm-img-block" data-sve-build-image-sizes>
      <span class="fg-lab">{{ port.t('content_image_sizes') }}</span>
      <div v-for="size in sizes" :key="size.handle" class="bm-img-screen" :data-sve-build-image-screen="size.handle">
        <div class="bm-link-row">
          <span>{{ size.label }}</span>
          <button
            type="button"
            class="bm-switch"
            role="switch"
            :aria-checked="!!sources[size.handle]"
            :aria-label="size.label"
            :data-sve-build-image-screen-switch="size.handle"
            @click="toggleSize(size)"
          ></button>
        </div>
        <div v-if="sources[size.handle]" class="bm-img-size">
          <input
            v-model="box(size.handle, 'width').value.value"
            class="bm-inp"
            inputmode="numeric"
            :aria-label="`${size.label} ${port.t('content_image_width')}`"
            @input="box(size.handle, 'width').input()"
            @keydown.enter.prevent="box(size.handle, 'width').done()"
            @blur="box(size.handle, 'width').done()"
          />
          <span class="bm-img-x" aria-hidden="true">×</span>
          <input
            v-model="box(size.handle, 'height').value.value"
            class="bm-inp"
            inputmode="numeric"
            :aria-label="`${size.label} ${port.t('content_image_height')}`"
            :placeholder="port.t('content_image_auto')"
            @input="box(size.handle, 'height').input()"
            @keydown.enter.prevent="box(size.handle, 'height').done()"
            @blur="box(size.handle, 'height').done()"
          />
          <select
            class="fg-select bm-img-ratio"
            :aria-label="`${size.label} ${port.t('content_image_ratio')}`"
            :value="ratioOf(sources[size.handle].width, sources[size.handle].height)"
            @change="setSize(size.handle, { ratio: $event.target.value })"
          >
            <option value="original">{{ port.t('content_image_ratio_original') }}</option>
            <option v-for="r in RATIOS" :key="r.key" :value="r.key">{{ r.key }}</option>
            <option value="custom" disabled>{{ port.t('content_image_ratio_custom') }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="bm-img-block">
      <div class="fg-row">
        <span class="fg-rlab">{{ port.t('content_image_format') }}</span>
        <label class="fg-field">
          <select class="fg-select" :aria-label="port.t('content_image_format')" :value="now.format" data-sve-build-image-format @change="setImage({ format: $event.target.value })">
            <option v-for="f in formats" :key="f.key" :value="f.key" :disabled="f.off">{{ f.label }}</option>
          </select>
        </label>
      </div>
      <div class="fg-row">
        <span class="fg-rlab">{{ port.t('content_image_quality') }}</span>
        <input
          v-model="quality.value.value"
          class="bm-inp"
          inputmode="numeric"
          :aria-label="port.t('content_image_quality')"
          :placeholder="String(QUALITY)"
          :disabled="!now.on"
          data-sve-build-image-quality
          @input="quality.input()"
          @keydown.enter.prevent="quality.done()"
          @blur="quality.done()"
        />
      </div>
      <div class="bm-link-row">
        <span>{{ port.t('content_image_blur') }}</span>
        <button type="button" class="bm-switch" role="switch" :aria-checked="now.on && now.blur" :aria-label="port.t('content_image_blur')" :disabled="now.loading === 'first'" data-sve-build-image-blur @click="setImage({ blur: !(now.on && now.blur) })"></button>
      </div>
      <p class="bm-img-hint">{{ port.t(now.loading === 'first' ? 'content_image_blur_first' : 'content_image_blur_hint') }}</p>
      <div class="fg-row">
        <span class="fg-rlab">{{ port.t('content_image_loading') }}</span>
        <div class="bm-seg" role="group" :aria-label="port.t('content_image_loading')" data-sve-build-image-loading>
          <button
            v-for="key in LOADING"
            :key="key"
            type="button"
            :aria-pressed="now.loading === key"
            :data-sve-build-image-loading-option="key"
            @click="setImage({ loading: key })"
          >{{ port.t(`content_image_${key}`) }}</button>
        </div>
      </div>
      <p v-if="now.loading === 'first'" class="bm-img-hint">{{ port.t('content_image_first_hint') }}</p>
    </div>
  </div>
</template>

<style>
/*
 * The image's options (BuildImage.vue) in the panel's own parts: its labels,
 * boxes, selects, switches and segments. `bm-img-` only, under the panel's root.
 */
.sve-build .bm-img { display: grid; gap: 0.875rem; margin-top: 0.875rem; padding-top: 0.875rem; border-top: 1px solid var(--bm-line); }
.sve-build .bm-img-block { display: grid; gap: 0.5rem; }
.sve-build .bm-img-block .fg-lab { margin: 0; }
.sve-build .bm-img-size { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) minmax(0, 1.15fr); align-items: center; gap: 0.375rem; }
.sve-build .bm-img-size .bm-inp { min-width: 0; text-align: center; }
.sve-build .bm-img-x { color: var(--bm-faint); font-size: 0.75rem; }
.sve-build .bm-img-ratio { min-width: 0; }
.sve-build .bm-img-screen { display: grid; gap: 0.4rem; }
.sve-build .bm-img-screen + .bm-img-screen { padding-top: 0.4rem; border-top: 1px solid var(--bm-line); }
.sve-build .bm-img-hint { margin: -0.15rem 0 0; font-size: 0.625rem; line-height: 1.45; color: var(--bm-faint); }
.sve-build .bm-img .bm-inp:disabled { opacity: 0.5; }
</style>
