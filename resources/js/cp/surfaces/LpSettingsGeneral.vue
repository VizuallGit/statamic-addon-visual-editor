<script setup>
import { ref } from 'vue';
import LpSettingsSwitch from './LpSettingsSwitch.vue';

// General tab: the on/off settings that are not a sidebar's, the tree's or the
// top bar's own. What Live Preview does (the toolbar on each section,
// animations, smooth scrolling) and how Build starts (the mode switch's tab,
// the Style tab, Style's class list). lp-more-menu.js owns every write (`on.*`); this keeps
// the switches in step.
const props = defineProps({
  previewLabel: { type: String, required: true },
  buildLabel: { type: String, required: true },
  // { on, label }: the toolbar on each page section (section-toolbar-pref.js).
  sectionToolbar: { type: Object, default: () => ({ on: false, label: '' }) },
  // { on, label }: animations running in Live Preview (animation-mode.js).
  animations: { type: Object, default: () => ({ on: false, label: '' }) },
  // { on, label }: glide to a section instead of jumping (scroll-pref.js).
  smoothScroll: { type: Object, default: () => ({ on: false, label: '' }) },
  // { show, on, label }: the mode switch on a tab of the bar (build-switch-tab.js).
  switchTab: { type: Object, default: () => ({ show: false, on: true, label: '' }) },
  // { show, on, label }: Build's Style tab in the element panel (build-style-pref.js).
  styleTab: { type: Object, default: () => ({ show: false, on: true, label: '' }) },
  // { on, label }: Style's class list, shown when a Build starts (build-classes-pref.js).
  classesDefault: { type: Object, default: () => ({ on: false, label: '' }) },
  on: { type: Object, required: true },
});

const sectionToolbarOn = ref(props.sectionToolbar.on);

function setSectionToolbar(value) {
  sectionToolbarOn.value = value;
  props.on.sectionToolbar(value);
}

const animationsOn = ref(props.animations.on);

function setAnimations(value) {
  animationsOn.value = value;
  props.on.animations(value);
}

const smoothScrollOn = ref(props.smoothScroll.on);

function setSmoothScroll(value) {
  smoothScrollOn.value = value;
  props.on.smoothScroll(value);
}

const switchTabOn = ref(props.switchTab.on);

function setSwitchTab(value) {
  switchTabOn.value = value;
  props.on.switchTab(value);
}

const styleTabOn = ref(props.styleTab.on);

function setStyleTab(value) {
  styleTabOn.value = value;
  props.on.styleTab(value);
}

const classesDefaultOn = ref(props.classesDefault.on);

function setClassesDefault(value) {
  classesDefaultOn.value = value;
  props.on.classesDefault(value);
}
</script>

<template>
  <div class="sve-lp-settings__section is-list">
    <div class="sve-lp-settings__label">{{ previewLabel }}</div>
    <LpSettingsSwitch
      :label="sectionToolbar.label"
      :on="sectionToolbarOn"
      data-sve-section-toolbar-setting
      @change="setSectionToolbar"
    />
    <LpSettingsSwitch
      :label="animations.label"
      :on="animationsOn"
      data-sve-animations-setting
      @change="setAnimations"
    />
    <LpSettingsSwitch
      :label="smoothScroll.label"
      :on="smoothScrollOn"
      data-sve-smooth-scroll-setting
      @change="setSmoothScroll"
    />
  </div>

  <div class="sve-lp-settings__section is-list">
    <div class="sve-lp-settings__label">{{ buildLabel }}</div>
    <LpSettingsSwitch
      v-if="switchTab.show"
      :label="switchTab.label"
      :on="switchTabOn"
      data-sve-switch-tab-setting
      @change="setSwitchTab"
    />
    <LpSettingsSwitch
      v-if="styleTab.show"
      :label="styleTab.label"
      :on="styleTabOn"
      data-sve-style-tab-setting
      @change="setStyleTab"
    />
    <LpSettingsSwitch
      :label="classesDefault.label"
      :on="classesDefaultOn"
      data-sve-classes-default-setting
      @change="setClassesDefault"
    />
  </div>
</template>
