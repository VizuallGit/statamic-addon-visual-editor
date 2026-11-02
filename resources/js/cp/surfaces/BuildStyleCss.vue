<script setup>
/**
 * Style writing CSS: BuildStyle as it is, under a port of its own
 * (css-mode/port.js), with what is being edited above it: a class of the
 * element or its one ID, made here if it has none.
 *
 * The fields stand as they do in Tailwind. A click with nothing to write in
 * writes nothing: the name field takes the caret. A new ID is unique per section
 * unless asked to be the author's own, and it can be renamed; the section's own
 * `id-{{ id }}` cannot, as `{{ responsive_css }}` and the dock's ID button read it. Going back to Tailwind takes
 * the canvas's sheet away, and what stands is the page the server rendered.
 */
import { computed, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';
import BuildStyle from './BuildStyle.vue';
import BuildStyleSwitch from './BuildStyleSwitch.vue';
import { cssPortFor } from '../../build-mode/css-mode/port.js';
import { styleMode } from '../../build-mode/css-mode/flag.js';

defineProps({
  node: { type: Object, required: true },
});

const outer = inject('sveBuild');
const port = cssPortFor(window, outer);
const target = port.cssTarget;

provide('sveBuild', port);

let letGo = null;

onMounted(() => {
  letGo = port.listen();
});

const isId = computed(() => target.kind.value === 'id');
const typed = ref('');
const nameField = ref(null);
const pulse = ref(false);
const id = computed(() => target.id());
const info = computed(() => target.idInfo());
const renaming = ref(false);
const canType = computed(() => target.usable() && (!isId.value || (!id.value && !target.isRoot())));

function submit() {
  if ((isId.value ? target.addId(typed.value) : target.addClass(typed.value))) {
    typed.value = '';
  }
}

async function startRename() {
  typed.value = info.value?.name || '';
  renaming.value = true;
  await nextTick();
  nameField.value?.focus();
  nameField.value?.select();
}

function submitRename() {
  if (target.renameId(typed.value)) {
    typed.value = '';
    renaming.value = false;
  }
}

function cancelRename() {
  typed.value = '';
  renaming.value = false;
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
    <!-- One line when there is room for both; Class | ID goes under when there is not. -->
    <div data-sve-style-bar>
      <BuildStyleSwitch />
      <div class="fg-seg" data-sve-css-target-kinds role="group" :aria-label="port.t('css_mode_target')">
        <button type="button" :aria-pressed="!isId" data-sve-css-target-kind="class" @click="target.choose('class')">{{ port.t('css_mode_class') }}</button>
        <button type="button" :aria-pressed="isId" data-sve-css-target-kind="id" @click="target.choose('id')">ID</button>
      </div>
    </div>

    <div data-sve-css-target>
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
      <div v-if="isId && id && !renaming" data-sve-css-target-names>
        <span class="is-fixed" :title="`#${id}`" aria-pressed="true" :data-sve-css-target-name="id">#{{ info?.label }}</span>
        <span v-if="info?.kind === 'dynamic'" class="fg-hint" data-sve-css-id-kind :title="port.t('css_mode_id_dynamic_note')">{{ port.t('css_mode_id_dynamic') }}</span>
        <span v-else-if="info?.kind === 'section'" class="fg-hint" data-sve-css-id-kind :title="port.t('css_mode_id_section_note')">{{ port.t('css_mode_id_section') }}</span>
        <button v-if="info?.kind === 'dynamic' || info?.kind === 'own'" type="button" class="sve-css-rename" data-sve-css-id-rename :title="port.t('css_mode_id_rename')" :aria-label="port.t('css_mode_id_rename')" @click="startRename">{{ port.t('css_mode_id_rename') }}</button>
      </div>

      <form v-if="isId && renaming" data-sve-css-target-form @submit.prevent="submitRename" @keydown.escape.stop.prevent="cancelRename">
        <input ref="nameField" v-model="typed" type="text" spellcheck="false" autocomplete="off" :aria-label="port.t('css_mode_id_rename')" data-sve-css-rename-input />
        <button type="submit" :disabled="!typed.trim()" data-sve-css-rename-save>{{ port.t('css_mode_id_save') }}</button>
      </form>

      <button v-if="isId && !id && target.isRoot()" type="button" class="sve-css-rename" data-sve-css-section-id @click="target.addSectionId()">{{ port.t('css_mode_add_section_id') }}</button>

      <div v-if="isId && !id && !target.isRoot() && target.canBeDynamic() && target.usable()" class="fg-seg" role="group" :aria-label="port.t('css_mode_id_how')">
        <button type="button" :aria-pressed="target.idMode.value === 'dynamic'" :title="port.t('css_mode_id_dynamic_note')" data-sve-css-id-mode="dynamic" @click="target.idMode.value = 'dynamic'">{{ port.t('css_mode_id_dynamic') }}</button>
        <button type="button" :aria-pressed="target.idMode.value === 'own'" :title="port.t('css_mode_id_own_note')" data-sve-css-id-mode="own" @click="target.idMode.value = 'own'">{{ port.t('css_mode_id_own') }}</button>
      </div>

      <form v-if="canType && !renaming" data-sve-css-target-form :class="{ 'is-asked': pulse }" @submit.prevent="submit">
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
