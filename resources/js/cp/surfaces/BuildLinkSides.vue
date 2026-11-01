<script setup>
/**
 * Which sides move together: each alone, top and bottom, left and right, all
 * four, and round again (`nextLink`). The icon is the four sides, the ones moving
 * together lit. The box and the fields of Spacing draw the same button.
 */
import { computed, inject } from 'vue';
import { nextLink } from '../../build-mode/classes.js';

const props = defineProps({
  link: { type: String, default: '' },
  /** `padding` or `margin`, for the fields, which show both at once. */
  box: { type: String, default: '' },
});

defineEmits(['update:link']);

const port = inject('sveBuild');
const TITLE = { '': 'link_title_off', block: 'link_title_block', inline: 'link_title_inline', all: 'link_title_all' };
const title = computed(() => port.t(TITLE[props.link]));
</script>

<template>
  <div class="bm-seg bm-sp-sides">
    <button
      type="button"
      :title="title"
      :aria-label="title"
      :data-sve-build-link="link || 'off'"
      :data-sve-build-link-box="box || undefined"
      @click="$emit('update:link', nextLink(link))"
    >
      <svg class="bm-ic" viewBox="0 0 24 24" aria-hidden="true">
        <path :class="{ 'is-lit': link === 'block' || link === 'all' }" d="M8 4h8M8 20h8" />
        <path :class="{ 'is-lit': link === 'inline' || link === 'all' }" d="M4 8v8M20 8v8" />
      </svg>
    </button>
  </div>
</template>
