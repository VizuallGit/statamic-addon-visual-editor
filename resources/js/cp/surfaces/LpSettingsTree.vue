<script setup>
import { ref } from 'vue';

// HTML tree tab: whether the template dock opens with Live Preview, the tree's
// face (coloured tags or the classic cards), and one colour per tag family —
// the tree and the HTML pane both read them.
const props = defineProps({
  codeDock: { type: Object, required: true },
  codeDockHelp: { type: Object, default: () => ({ show: false }) },
  htmlTree: { type: Object, required: true },
  familyColors: { type: Object, required: true },
  on: { type: Object, required: true },
});

// Read now, not from the props: a preset in the Top bar tab may have opened
// or closed the dock since the menu was built.
const codeDockOn = ref(props.on.dockOn ? props.on.dockOn() : props.codeDock.on);
const htmlTreeOn = ref(props.htmlTree.on);
const codeDockHelpOn = ref(!!props.codeDockHelp.on);
const codeDockHelpClick = ref(props.codeDockHelp.click ? !!props.codeDockHelp.click.on : true);
const codeDockHelpPicker = ref(props.codeDockHelp.picker ? !!props.codeDockHelp.picker.on : true);
const familyRows = ref(props.familyColors.rows.map((row) => ({ ...row })));

function setCodeDock(value) {
  codeDockOn.value = value;
  props.on.codeDock(value);
}

function setCodeDockHelp(value) {
  codeDockHelpOn.value = value;
  props.on.codeDockHelp(value);
}

function setCodeDockHelpClick(value) {
  codeDockHelpClick.value = value;
  props.on.codeDockHelpClick(value);
}

function setCodeDockHelpPicker(value) {
  codeDockHelpPicker.value = value;
  props.on.codeDockHelpPicker(value);
}

function setHtmlTree(value) {
  htmlTreeOn.value = value;
  props.on.htmlTree(value);
}

function setFamilyColor(id, hex) {
  const row = familyRows.value.find((item) => item.id === id);

  if (row) {
    row.value = hex;
  }

  props.on.familyColor(id, hex);
}

function resetFamilyColors() {
  familyRows.value.forEach((row) => {
    row.value = row.def;
  });
  props.on.familyReset();
}
</script>

<template>
  <div v-if="codeDock.show || codeDockHelp.show || htmlTree.show" class="sve-lp-settings__section">
    <label v-if="codeDock.show" class="sve-lp-settings__row">
      <input type="checkbox" :checked="codeDockOn" @change="setCodeDock($event.target.checked)">
      <span :title="codeDock.label">{{ codeDock.label }}</span>
    </label>
    <label v-if="codeDockHelp.show" class="sve-lp-settings__row">
      <input type="checkbox" :checked="codeDockHelpOn" @change="setCodeDockHelp($event.target.checked)">
      <span :title="codeDockHelp.label">{{ codeDockHelp.label }}</span>
    </label>
    <!-- How the help behaves once on — whichever way it was turned on. -->
    <label v-if="codeDockHelp.show && codeDockHelp.click" class="sve-lp-settings__row sve-lp-settings__row--sub">
      <input type="checkbox" :checked="codeDockHelpClick" @change="setCodeDockHelpClick($event.target.checked)">
      <span :title="codeDockHelp.click.label">{{ codeDockHelp.click.label }}</span>
    </label>
    <label v-if="codeDockHelp.show && codeDockHelp.picker" class="sve-lp-settings__row sve-lp-settings__row--sub">
      <input type="checkbox" :checked="codeDockHelpPicker" @change="setCodeDockHelpPicker($event.target.checked)">
      <span :title="codeDockHelp.picker.label">{{ codeDockHelp.picker.label }}</span>
    </label>
    <label v-if="htmlTree.show" class="sve-lp-settings__row">
      <input type="checkbox" :checked="htmlTreeOn" @change="setHtmlTree($event.target.checked)">
      <span :title="htmlTree.label">{{ htmlTree.label }}</span>
    </label>
  </div>

  <div v-if="familyColors.show" class="sve-lp-settings__section">
    <div class="sve-lp-settings__label">{{ familyColors.label }}</div>
    <label v-for="row in familyRows" :key="row.id" class="sve-lp-settings__row" :title="row.label">
      <input
        type="color"
        class="sve-lp-settings__swatch"
        :value="row.value"
        @input="setFamilyColor(row.id, $event.target.value)"
      >
      <span>{{ row.label }}</span>
    </label>
    <button type="button" class="sve-lp-settings__small" @click="resetFamilyColors">
      {{ familyColors.resetLabel }}
    </button>
  </div>
</template>
