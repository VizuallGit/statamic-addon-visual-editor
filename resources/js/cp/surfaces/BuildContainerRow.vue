<script setup>
/**
 * Style's container query group (build-mode/container-query.js).
 *
 * Under the breakpoints, on an element the canvas lays out inside a size
 * container (an ancestor with container queries, or `container-type` from
 * CSS). A size picked here is the variant every field writes under
 * (`@max-md:pbs-500`), in the slot a breakpoint takes: picking a breakpoint
 * gives it up, and so does clicking the picked size again. All is the
 * breakpoint row's.
 */
import { computed, inject, nextTick, ref } from 'vue';
import { ic } from '../../build-mode/icons.js';
import {
  CONTAINER_SIZES,
  containerLength,
  containerRem,
  containerVariant,
  customContainerVariant,
  customSizesIn,
} from '../../build-mode/container-query.js';

const props = defineProps({
  path: { type: String, default: '' },
});

const port = inject('sveBuild');
const around = computed(() => port.containerAround(props.path));
const now = computed(() => port.containerSize());
const escapeHtml = (text) => String(text).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const heading = computed(() => (around.value.name
  ? port.t('container_active_on', { name: `<b>${escapeHtml(around.value.name)}</b>` })
  : port.t('container_active_on_parent', { parent: `<b>${port.t('container_parent')}</b>` })));

/** The arbitrary sizes to offer: the element's own `@max-[…]` classes, and the one picked. */
const customs = computed(() => {
  const found = customSizesIn(port.pickedClasses());

  return now.value.startsWith('@max-[') && !found.includes(now.value) ? [...found, now.value] : found;
});
const shown = computed(() => [...CONTAINER_SIZES.map((size) => containerVariant(size.key)), ...customs.value]);
/** The narrowest size whose query holds at the container's width now. */
const nowAt = computed(() => {
  const width = around.value?.rem ?? Infinity;

  return shown.value.filter((variant) => containerRem(variant) > width).sort((a, b) => containerRem(a) - containerRem(b))[0] || '';
});

const pick = (variant) => port.setContainerSize(now.value === variant ? '' : variant);
const titleOf = (variant) => (now.value === variant ? port.t('container_release') : `${variant}:`);

/* ---------------- a size of its own ---------------- */

const typing = ref(false);
const typed = ref('');
const refused = ref(false);
const input = ref(null);

async function toggleCustom() {
  typing.value = !typing.value;
  typed.value = '';
  refused.value = false;

  if (typing.value) {
    await nextTick();
    input.value?.focus();
  }
}

function submit() {
  const variant = customContainerVariant(typed.value);

  refused.value = !variant;

  if (variant) {
    typing.value = false;
    typed.value = '';
    port.setContainerSize(variant);
  }
}
</script>

<template>
  <div v-if="around" class="fg-cq-group" data-sve-build-container>
    <div class="fg-cq-group__head">
      <span class="fg-cq-group__icon" v-html="ic('containerQueries')"></span>
      <span class="fg-cq-group__title" v-html="heading"></span>
      <span class="fg-cq-group__now">{{ port.t('container_now', { size: `${around.rem}rem` }) }}</span>
    </div>
    <div class="fg-seg" role="group" :aria-label="port.t('container_queries')">
      <button
        v-for="size in CONTAINER_SIZES"
        :key="size.key"
        type="button"
        :aria-pressed="now === containerVariant(size.key)"
        :title="titleOf(containerVariant(size.key))"
        :data-now="nowAt === containerVariant(size.key) || undefined"
        :data-sve-build-container-size="size.key"
        @click="pick(containerVariant(size.key))"
      >&lt; {{ size.rem }}</button>
      <button
        v-for="variant in customs"
        :key="variant"
        type="button"
        :aria-pressed="now === variant"
        :title="titleOf(variant)"
        :data-now="nowAt === variant || undefined"
        :data-sve-build-container-size="variant"
        @click="pick(variant)"
      >&lt; {{ containerLength(variant) }}</button>
      <button
        type="button"
        class="fg-more"
        :aria-expanded="typing"
        :aria-label="port.t('container_custom')"
        :title="port.t('container_custom')"
        data-sve-build-container-more
        @click="toggleCustom"
      >⋯</button>
    </div>
    <div v-if="typing" class="fg-classpick" data-sve-build-container-custom>
      <input
        ref="input"
        v-model="typed"
        type="text"
        placeholder="30rem"
        :aria-label="port.t('container_custom')"
        :aria-invalid="refused || undefined"
        @input="refused = false"
        @keydown.enter.prevent="submit"
        @keydown.esc="typing = false"
      >
      <p v-if="refused" class="fg-hint" role="alert">{{ port.t('container_custom_unit') }}</p>
    </div>
  </div>
</template>
