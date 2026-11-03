<script setup>
/**
 * Which gap a grid's gap field sets: both, between rows (the block axis), or
 * between columns (the inline axis), and round again (`GAP_AXIS_NEXT`) — the
 * button Spacing's sides go round with (BuildLinkSides.vue), its icon four
 * cells with the gaps it sets lit.
 */
import { computed, inject } from 'vue';
import { GAP_AXIS_NEXT } from '../../build-mode/grid.js';

const props = defineProps({
  axis: { type: String, default: 'all' },
});

defineEmits(['update:axis']);

const port = inject('sveBuild');
const TITLE = { all: 'gap_axis_all', block: 'gap_axis_block', inline: 'gap_axis_inline' };
const title = computed(() => port.t(TITLE[props.axis]));
</script>

<template>
  <div class="bm-seg bm-sp-sides">
    <button
      type="button"
      :title="title"
      :aria-label="title"
      :data-sve-build-gap-axis="axis"
      @click="$emit('update:axis', GAP_AXIS_NEXT[axis])"
    >
      <svg class="bm-ic" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="5" height="5" rx="1" />
        <rect x="15" y="4" width="5" height="5" rx="1" />
        <rect x="4" y="15" width="5" height="5" rx="1" />
        <rect x="15" y="15" width="5" height="5" rx="1" />
        <path :class="{ 'is-lit': axis !== 'inline' }" d="M4 12h16" />
        <path :class="{ 'is-lit': axis !== 'block' }" d="M12 4v16" />
      </svg>
    </button>
  </div>
</template>
