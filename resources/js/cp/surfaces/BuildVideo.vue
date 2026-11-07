<script setup>
/**
 * A video's options in Build's Content, under its file: its shape, autoplay,
 * loop, muted, controls, how much the browser loads before it plays
 * (preload), its poster and whether it loads first.
 *
 * Every switch is an attribute of the element (build-mode/video.js); the
 * shape is Style's own class, written with Style's engine (`setOneOf`), so
 * Style → Size → Aspect ratio shows the same. The poster switch is there
 * only where the site has the video's frame to give (`sveVideoPoster`).
 */
import { computed, inject } from 'vue';
import { parseTemplateTree } from '../../html-tree-parse.js';
import { findByPath } from '../../build-mode/place.js';
import { FIT_CLASSES, PRELOADS, RATIO_CLASSES, VIDEO_RATIOS, isFramePoster, posterFor, ratioClass, readVideo, videoAttrs } from '../../build-mode/video.js';

const props = defineProps({
  path: { type: String, required: true },
});

const port = inject('sveBuild');
const posters = !!window.Statamic?.$config?.get?.('sveVideoPoster');

const file = computed(() => (port.rev.value, port.html()));
const node = computed(() => findByPath(parseTemplateTree(file.value), props.path));
const now = computed(() => (node.value ? readVideo(file.value, node.value) : null));
const src = computed(() => (port.rev.value, port.attr('src') ?? ''));
const framePoster = computed(() => isFramePoster(now.value?.poster));
const ownPoster = computed(() => !!now.value?.poster && !framePoster.value);

const SWITCHES = ['autoplay', 'loop', 'muted', 'controls'];

function set(change) {
  port.setAttrsAt(props.path, videoAttrs(change), { end: true });
}

/** A shape: Style's class for it, and the video filling it unless a fit was picked by hand. */
function setRatio(key) {
  const cls = ratioClass(key);

  port.setOneOf(RATIO_CLASSES, cls);

  const classes = String(port.tagClasses?.() || '').split(/\s+/);

  if (cls && !FIT_CLASSES.some((fit) => classes.includes(fit))) {
    port.setOneOf(FIT_CLASSES, 'object-cover');
  }
}

function togglePoster() {
  port.setAttrsAt(props.path, { poster: framePoster.value ? null : posterFor(src.value) }, { end: true });
}
</script>

<template>
  <div v-if="now" class="bm-img" data-sve-build-video>
    <div class="bm-img-block">
      <div class="fg-row">
        <span class="fg-rlab">{{ port.t('content_video_ratio') }}</span>
        <label class="fg-field">
          <select class="fg-select" :aria-label="port.t('content_video_ratio')" :value="now.ratio" data-sve-build-video-ratio @change="setRatio($event.target.value)">
            <option value="auto">{{ port.t('content_video_ratio_auto') }}</option>
            <option v-for="r in VIDEO_RATIOS" :key="r.key" :value="r.key">{{ r.key }}</option>
          </select>
        </label>
      </div>
    </div>

    <div class="bm-img-block">
      <div v-for="key in SWITCHES" :key="key" class="bm-link-row">
        <span>{{ port.t(`content_video_${key}`) }}</span>
        <button
          type="button"
          class="bm-switch"
          role="switch"
          :aria-checked="now[key]"
          :aria-label="port.t(`content_video_${key}`)"
          :data-sve-build-video-switch="key"
          @click="set({ [key]: !now[key] })"
        ></button>
      </div>
      <p v-if="now.autoplay && !now.muted" class="bm-img-hint is-warn" data-sve-build-video-hint="muted">{{ port.t('content_video_autoplay_muted') }}</p>
      <p v-else-if="!now.autoplay && !now.controls" class="bm-img-hint is-warn" data-sve-build-video-hint="start">{{ port.t('content_video_no_start') }}</p>
      <p v-else-if="now.autoplay" class="bm-img-hint">{{ port.t('content_video_autoplay_note') }}</p>
    </div>

    <div class="bm-img-block">
      <div class="fg-row">
        <span class="fg-rlab">{{ port.t('content_video_preload') }}</span>
        <label class="fg-field">
          <select class="fg-select" :aria-label="port.t('content_video_preload')" :value="now.preload" data-sve-build-video-preload @change="set({ preload: $event.target.value })">
            <option v-for="key in PRELOADS" :key="key" :value="key">{{ port.t(`content_video_preload_${key}`) }}</option>
          </select>
        </label>
      </div>
      <p class="bm-img-hint">{{ port.t(`content_video_preload_${now.preload}_hint`) }}</p>
    </div>

    <div class="bm-img-block">
      <template v-if="posters">
        <div class="bm-link-row">
          <span>{{ port.t('content_video_poster') }}</span>
          <button
            type="button"
            class="bm-switch"
            role="switch"
            :aria-checked="framePoster"
            :aria-label="port.t('content_video_poster')"
            :disabled="!framePoster && !posterFor(src)"
            data-sve-build-video-poster
            @click="togglePoster"
          ></button>
        </div>
        <p v-if="ownPoster" class="bm-img-hint" data-sve-build-video-own-poster>{{ port.t('content_video_poster_own', { src: now.poster }) }}</p>
        <p v-else class="bm-img-hint">{{ port.t('content_video_poster_note') }}</p>
      </template>
      <div class="bm-link-row">
        <span>{{ port.t('content_video_first') }}</span>
        <button type="button" class="bm-switch" role="switch" :aria-checked="now.first" :aria-label="port.t('content_video_first')" data-sve-build-video-first @click="set({ first: !now.first })"></button>
      </div>
      <p v-if="now.first" class="bm-img-hint">{{ port.t('content_video_first_note') }}</p>
    </div>
  </div>
</template>

<style>
/* The video's options share the image's frame (BuildImage.vue's `bm-img-` parts); a warning stands out. */
.sve-build .bm-img-hint.is-warn { color: color-mix(in srgb, #f59e0b 80%, var(--bm-ink)); }
</style>
