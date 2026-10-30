<script setup>
/**
 * Build's Content tab for a gallery (build-mode/gallery.js): its images in the
 * Control Panel's own asset field, many at a time, ordered and removed there.
 * The data icon beside the label reads an assets field instead: the file then
 * has a loop, the box says which field, and the button brings own images back.
 */
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue';
import { ic } from '../../build-mode/icons.js';

const props = defineProps({
  node: { type: Object, required: true },
});

const port = inject('sveBuild');
const path = props.node.path;
const FIELDS = ['assets'];
const read = computed(() => (port.rev.value, port.readGallery(path)));
const statamic = !!port.fieldReady?.('gallery');
const host = ref(null);
let unmountField = null;

function pick(anchor) {
  port.pickField(anchor, path, FIELDS, (expression) => port.setGalleryField(path, expression));
}

const lines = (text) => String(text).split('\n').map((line) => line.trim()).filter(Boolean);

watch(
  host,
  (el) => {
    unmountField?.();
    unmountField = el
      ? port.mountField(el, {
          kind: 'gallery',
          value: read.value.urls.join('\n'),
          display: port.t('content_gallery'),
          write: (value) => port.setGalleryImages(path, lines(value)),
          pick,
          pickTitle: port.t('content_field_pick'),
        })
      : null;
  },
  { flush: 'post' }
);

onBeforeUnmount(() => {
  unmountField?.();
  unmountField = null;
});
</script>

<template>
  <div class="bm-content" data-sve-build-gallery>
    <div v-if="read.field" class="bm-text">
      <span class="fg-lab">{{ port.t('content_gallery') }}</span>
      <div class="bm-text-box">
        <input class="bm-inp" type="text" readonly :value="`{{ ${read.field} }}`" data-sve-build-gallery-field />
      </div>
      <button type="button" class="bm-remove-file" data-sve-build-gallery-own @click="port.setGalleryField(path, '')">
        <span v-html="ic('sidesApart')"></span>{{ port.t('content_gallery_own') }}
      </button>
    </div>
    <div v-else-if="statamic" ref="host" class="bm-host"></div>
    <div v-else class="bm-text">
      <label class="fg-lab" :for="`sve-build-gallery-${path}`">{{ port.t('content_gallery') }}</label>
      <textarea
        :id="`sve-build-gallery-${path}`"
        rows="4"
        :value="read.urls.join('\n')"
        data-sve-build-gallery-urls
        @change="port.setGalleryImages(path, lines($event.target.value))"
      ></textarea>
    </div>
  </div>
</template>
