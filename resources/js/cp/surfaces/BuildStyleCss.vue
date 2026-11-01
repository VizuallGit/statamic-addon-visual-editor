<script setup>
/**
 * Style writing CSS: BuildStyle as it is, under a port of its own
 * (css-mode/port.js), with what is being edited above it: a class of the
 * element or its one ID, made here if it has none.
 *
 * The fields stand as they do in Tailwind. A click with nothing to write in
 * writes nothing: the name field takes the caret. Going back to Tailwind takes
 * the canvas's sheet away, and what stands is the page the server rendered.
 */
import { computed, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';
import BuildStyle from './BuildStyle.vue';
import { cssPortFor } from '../../build-mode/css-mode/port.js';
import { styleMode } from '../../build-mode/css-mode/flag.js';
import look from '../../build-mode/css-mode/look.css?inline';

defineProps({
  node: { type: Object, required: true },
});

const outer = inject('sveBuild');
const port = cssPortFor(window, outer);
const target = port.cssTarget;

provide('sveBuild', port);

const STYLE_ID = '__sve-css-mode-look';
let letGo = null;

onMounted(() => {
  letGo = port.listen();

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');

    style.id = STYLE_ID;
    style.textContent = look;
    document.head.appendChild(style);
  }
});

const isId = computed(() => target.kind.value === 'id');
const typed = ref('');
const nameField = ref(null);
const pulse = ref(false);
const id = computed(() => target.id());
const canType = computed(() => target.usable() && (!isId.value || !id.value));

function submit() {
  if ((isId.value ? target.addId(typed.value) : target.addClass(typed.value))) {
    typed.value = '';
  }
}

watch(target.asked, async () => {
  pulse.value = true;
  await nextTick();
  nameField.value?.focus();
  window.setTimeout(() => {
    pulse.value = false;
  }, 900);
});

watch(styleMode, (mode) => {
  if (mode !== 'css') {
    port.leave();
  }
});

onBeforeUnmount(() => {
  letGo?.();
  port.closeMenu();

  if (styleMode.value !== 'css') {
    port.leave();
  }
});
</script>

<template>
  <div data-sve-style-css>
    <div data-sve-css-target>
      <div class="fg-seg" role="group" :aria-label="port.t('css_mode_target')">
        <button type="button" :aria-pressed="!isId" data-sve-css-target-kind="class" @click="target.choose('class')">{{ port.t('css_mode_class') }}</button>
        <button type="button" :aria-pressed="isId" data-sve-css-target-kind="id" @click="target.choose('id')">ID</button>
      </div>

      <p v-if="!target.usable()" class="fg-hint" data-sve-css-target-unusable>{{ port.t('css_mode_not_element') }}</p>

      <div v-if="!isId && target.classes().length" data-sve-css-target-names>
        <button
          v-for="name in target.classes()"
          :key="name"
          type="button"
          :title="`.${name}`"
          :aria-pressed="name === target.open()"
          :data-sve-css-target-name="name"
          @click="target.openClass(name)"
        >.{{ name }}</button>
      </div>
      <div v-if="isId && id" data-sve-css-target-names>
        <span class="is-fixed" :title="`#${id}`" aria-pressed="true" :data-sve-css-target-name="id">#{{ id }}</span>
      </div>

      <form v-if="canType" data-sve-css-target-form :class="{ 'is-asked': pulse }" @submit.prevent="submit">
        <input
          ref="nameField"
          v-model="typed"
          type="text"
          spellcheck="false"
          autocomplete="off"
          :placeholder="port.t(isId ? 'css_mode_id_name' : 'css_mode_class_name')"
          :aria-label="port.t(isId ? 'css_mode_id_name' : 'css_mode_class_name')"
          data-sve-css-target-input
        />
        <button type="submit" :disabled="!typed.trim()" data-sve-css-target-add>{{ port.t(isId ? 'css_mode_add_id' : 'css_mode_add_class') }}</button>
      </form>

      <p v-if="target.usable() && !target.selector.value" class="fg-hint" data-sve-css-target-hint>{{ port.t(isId ? 'css_mode_need_id' : 'css_mode_need_class') }}</p>
      <p v-if="target.notice.value" class="fg-hint" data-sve-css-target-notice>{{ target.notice.value }}</p>
    </div>

    <BuildStyle :node="node" />
  </div>
</template>
