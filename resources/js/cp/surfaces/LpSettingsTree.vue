<script setup>
import { onMounted, ref } from 'vue';
import LpSettingsSwitch from './LpSettingsSwitch.vue';

// HTML tree tab: the HTML pane's help and grey text, the tree's face
// (coloured tags or the classic cards), and one colour per tag family — the
// tree and the HTML pane both read them. Whether the dock is open is Build's:
// it is only there.
const props = defineProps({
  codeDockHelp: { type: Object, default: () => ({ show: false }) },
  codeDockGhost: { type: Object, default: () => ({ show: false }) },
  htmlTree: { type: Object, required: true },
  familyColors: { type: Object, required: true },
  on: { type: Object, required: true },
});

const htmlTreeOn = ref(props.htmlTree.on);
const codeDockHelpOn = ref(!!props.codeDockHelp.on);
const codeDockHelpClick = ref(props.codeDockHelp.click ? !!props.codeDockHelp.click.on : true);
const codeDockHelpPicker = ref(props.codeDockHelp.picker ? !!props.codeDockHelp.picker.on : true);
const codeDockGhostOn = ref(!!props.codeDockGhost.on);
// What the dock's AI cost the site this month: asked when the tab opens.
const codeDockGhostCost = ref('');

onMounted(() => {
  if (props.codeDockGhost.show && props.on.ghostCost) {
    props.on.ghostCost().then((line) => {
      codeDockGhostCost.value = line;
    });
  }
});
const familyRows = ref(props.familyColors.rows.map((row) => ({ ...row })));

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

function setCodeDockGhost(value) {
  codeDockGhostOn.value = value;
  props.on.codeDockGhost(value);
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
  <div v-if="codeDockHelp.show || codeDockGhost.show || htmlTree.show" class="sve-lp-settings__section is-list">
    <LpSettingsSwitch v-if="codeDockHelp.show" :label="codeDockHelp.label" :on="codeDockHelpOn" @change="setCodeDockHelp" />
    <!-- How the help behaves once on — whichever way it was turned on. -->
    <LpSettingsSwitch
      v-if="codeDockHelp.show && codeDockHelp.click"
      sub
      :label="codeDockHelp.click.label"
      :on="codeDockHelpClick"
      @change="setCodeDockHelpClick"
    />
    <LpSettingsSwitch
      v-if="codeDockHelp.show && codeDockHelp.picker"
      sub
      :label="codeDockHelp.picker.label"
      :on="codeDockHelpPicker"
      @change="setCodeDockHelpPicker"
    />
    <LpSettingsSwitch v-if="codeDockGhost.show" :label="codeDockGhost.label" :on="codeDockGhostOn" @change="setCodeDockGhost" />
    <p v-if="codeDockGhost.show && codeDockGhost.stats" class="sve-lp-settings__hint">{{ codeDockGhost.stats }}</p>
    <p v-if="codeDockGhost.show && codeDockGhostCost" class="sve-lp-settings__hint">{{ codeDockGhostCost }}</p>
    <LpSettingsSwitch v-if="htmlTree.show" :label="htmlTree.label" :on="htmlTreeOn" @change="setHtmlTree" />
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
