<script setup>
/**
 * Style's container row — the container query demo (build-mode/container-query.js).
 *
 * Under the breakpoints, on an element the canvas lays out inside a size
 * container (an ancestor with `@container`, or `container-type` from CSS). A
 * size picked here is the variant every field below writes under
 * (`@max-md:pbs-500`), in the slot a breakpoint takes: picking a breakpoint
 * gives it up, and All here gives the slot back to the breakpoints.
 */
import { computed, inject } from 'vue';
import { CONTAINER_SIZES, containerVariant } from '../../build-mode/container-query.js';

const props = defineProps({
  path: { type: String, default: '' },
});

const port = inject('sveBuild');
const around = computed(() => port.containerAround(props.path));
const now = computed(() => port.containerSize());
</script>

<template>
  <div v-if="around" data-sve-build-container>
    <div class="fg-line">
      <p class="fg-hint">{{ port.t('container_row', { tag: around.tag }) }}</p>
      <p class="fg-hint">{{ port.t('container_now', { size: `${around.rem}rem` }) }}</p>
    </div>
    <div class="fg-seg" role="group" :aria-label="port.t('container_row', { tag: around.tag })">
      <button type="button" :aria-pressed="!now" data-sve-build-container-size="all" @click="port.setContainerSize('')">{{ port.t('size_all') }}</button>
      <button
        v-for="size in CONTAINER_SIZES"
        :key="size.key"
        type="button"
        :aria-pressed="now === containerVariant(size.key)"
        :title="`${containerVariant(size.key)}:`"
        :data-sve-build-container-size="size.key"
        @click="port.setContainerSize(containerVariant(size.key))"
      >&lt; {{ size.rem }}</button>
    </div>
  </div>
</template>
