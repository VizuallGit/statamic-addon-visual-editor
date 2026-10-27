<script setup>
/**
 * The left column in Build mode: Add, and Style for the picked element —
 * Fields when it is a component, Settings when it is a loop or a condition.
 *
 * Everything the panel knows and does goes through one object, the port
 * (`provide('sveBuild')`), which build-mode/boot.js builds from the editor:
 * the dock's file and lists, the HTML tree's pick, and the Tailwind pane's
 * class functions. The panel itself holds only what it shows: which tab.
 * A write bumps `port.rev`, and everything drawn from the file reads it.
 *
 * Fields and Settings are not drawn here. A component's fields are the
 * component props panel's, a loop's or condition's settings the HTML tree
 * inspector's; the port mounts those into the host this panel gives them
 * (`port.mountFields` / `port.mountSettings`), so they behave exactly as they
 * do today. Without one, the panel says where they are.
 */
import { computed, onBeforeUnmount, provide, ref, watch } from 'vue';
import BuildAdd from './BuildAdd.vue';
import BuildStyle from './BuildStyle.vue';
import { describeAt } from '../../build-mode/place.js';
import { BUILD_ICONS } from '../../build-mode/icons.js';

const props = defineProps({
  port: { type: Object, required: true },
});

provide('sveBuild', props.port);

const port = props.port;
const tab = ref('add');
const here = computed(() => {
  port.rev.value;

  return describeAt(port.html(), port.plusPath() || port.selectedPath());
});
const picked = computed(() => {
  port.rev.value;

  return port.plusPath() ? describeAt(port.html(), port.selectedPath()).node : here.value.node;
});
const second = computed(() => {
  const kind = picked.value?.kind;

  return kind === 'component' ? 'fields' : kind === 'loop' || kind === 'if' ? 'settings' : 'style';
});

/** A row's name in the panel: what it is, a column's number, a component's file. */
function nameOf(row) {
  if (!row) {
    return '';
  }

  if (row.kind === 'component') {
    return row.label || row.src || port.t('el_component');
  }

  if (row.kind === 'column') {
    return port.t('el_column', { n: row.index });
  }

  if (row.kind === 'tag') {
    return row.tag;
  }

  const key = `el_${row.kind}`;
  const word = port.t(key);

  return word === key ? row.tag : word;
}

/* A + in the tree or the preview opens Add at its target; a pick opens Style. */
watch(
  () => [port.plusPath(), port.selectedPath()],
  ([plus, sel], [plusBefore, selBefore] = []) => {
    if (plus && plus !== plusBefore) {
      tab.value = 'add';
    } else if (sel && sel !== selBefore && !port.justWrote?.(sel)) {
      tab.value = 'style';
    }
  }
);

/* Fields / Settings: the editor's own panels, mounted into our host. */
const host = ref(null);
let unmountHost = null;

function remount() {
  unmountHost?.();
  unmountHost = null;

  if (!host.value || !picked.value) {
    return;
  }

  const mount = tab.value === 'fields' ? port.mountFields : tab.value === 'settings' ? port.mountSettings : null;

  unmountHost = mount ? mount(host.value, picked.value) || null : null;
}

watch([host, tab, () => picked.value?.path], remount);
onBeforeUnmount(() => unmountHost?.());
</script>

<template>
  <div class="sve-build" data-sve-build-root>
    <div class="sve-build__tabs" role="tablist">
      <button type="button" role="tab" :aria-selected="tab === 'add'" @click="tab = 'add'">
        <i v-html="BUILD_ICONS.plus"></i>{{ port.t('tab_add') }}
      </button>
      <button type="button" role="tab" :aria-selected="tab !== 'add'" @click="tab = second">
        <i v-html="BUILD_ICONS.cursor"></i>{{ port.t(`tab_${second}`) }}
      </button>
    </div>

    <div class="sve-build__scroll">
      <BuildAdd v-if="tab === 'add'" :here="here" :name-of="nameOf" />

      <template v-else-if="!picked">
        <div class="sve-build__empty">
          <i v-html="BUILD_ICONS.cursor"></i>
          <p>{{ port.t('style_empty') }}</p>
        </div>
      </template>

      <BuildStyle v-else-if="second === 'style'" :key="picked.path" :node="picked" :name="nameOf(picked)" />

      <template v-else>
        <div class="sve-build-head">
          <span class="sve-build-chip" :data-kind="picked.kind">{{ picked.kind === 'component' ? 'component' : picked.tag }}</span>
          <b>{{ nameOf(picked) }}</b>
        </div>
        <div ref="host" class="sve-build__host"></div>
        <p v-if="second === 'fields' && !port.mountFields" class="sve-build-note">
          {{ port.t('fields_note', { path: `partials/components/${picked.label}.antlers.html` }) }}
        </p>
        <p v-if="second === 'settings' && !port.mountSettings" class="sve-build-note">{{ port.t('settings_note') }}</p>
      </template>
    </div>
  </div>
</template>

<style>
/*
 * The panel's shared parts — segmented rows, label/field rows, hints, chips —
 * in the look of the HTML tree's inspector (cp/surfaces/HtmlTreeInspector.vue):
 * text inherits the column's colour, surfaces are the editor's translucent
 * greys, the accent is the editor's blue. Scoped to the panel's own root.
 */
.sve-build {
  --sve-build-accent: #3858e9;
  --sve-build-accent-text: #8ea2ff;
  --sve-build-accent-soft: rgba(56, 88, 233, 0.16);
  --sve-build-accent-hover: rgba(56, 88, 233, 0.28);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: inherit;
}
.sve-build__tabs {
  display: flex;
  flex: none;
  padding: 0 0.5em;
  border-bottom: 1px solid rgba(128, 128, 128, 0.25);
}
.sve-build__tabs button {
  all: unset;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4em;
  padding: 0.75em 0 0.65em;
  border-bottom: 2px solid transparent;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.6;
  cursor: pointer;
}
.sve-build__tabs button i {
  display: inline-flex;
}
.sve-build__tabs button[aria-selected='true'] {
  opacity: 1;
  border-bottom-color: var(--sve-build-accent);
}
.sve-build__scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0.75em;
}
.sve-build__empty {
  display: grid;
  justify-items: center;
  gap: 0.5em;
  padding: 3em 1em;
  text-align: center;
  opacity: 0.6;
}
.sve-build__empty svg {
  width: 1.5rem;
  height: 1.5rem;
}
.sve-build .sve-build-seg {
  display: flex;
  gap: 0.2em;
  min-width: 0;
}
.sve-build .sve-build-seg button {
  all: unset;
  flex: 1 1 0;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3em;
  padding: 0.35em 0.4em;
  border-radius: 0.3rem;
  background: rgba(128, 128, 128, 0.16);
  font-size: 0.6875rem;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
.sve-build .sve-build-seg button:hover {
  background: rgba(128, 128, 128, 0.26);
}
.sve-build .sve-build-seg button[data-active] {
  background: var(--sve-build-accent);
  color: #fff;
}
.sve-build .sve-build-seg button.is-inherited[data-active] {
  background: transparent;
  color: var(--sve-build-accent-text);
  box-shadow: inset 0 0 0 1px var(--sve-build-accent);
  font-style: italic;
}
.sve-build .sve-build-row {
  display: grid;
  grid-template-columns: 6.25rem minmax(0, 1fr);
  align-items: center;
  gap: 0.5em;
  margin: 0.45em 0;
}
.sve-build .sve-build-row.is-wide {
  grid-template-columns: 1fr;
  gap: 0.35em;
}
.sve-build .sve-build-label {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35em;
  min-width: 0;
  overflow-wrap: anywhere;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.6875rem;
  opacity: 0.75;
}
.sve-build .sve-build-label code {
  opacity: 0.7;
}
.sve-build .sve-build-dot {
  display: inline-block;
  width: 0.35em;
  height: 0.35em;
  border-radius: 50%;
  background: var(--sve-build-accent-text);
}
.sve-build .sve-build-hint {
  margin: 0.4em 0 0.2em;
  font-size: 0.6875rem;
  opacity: 0.55;
}
.sve-build .sve-build-note {
  margin: 1em 0 0;
  padding-top: 0.75em;
  border-top: 1px solid rgba(128, 128, 128, 0.25);
  font-size: 0.6875rem;
  line-height: 1.55;
  opacity: 0.55;
}
.sve-build .sve-build-soon {
  display: inline-block;
  padding: 0 0.35em;
  border: 1px solid rgba(232, 196, 104, 0.5);
  border-radius: 999px;
  color: #e8c468;
  font-size: 0.5625rem;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.5;
  text-transform: uppercase;
  vertical-align: middle;
}
.sve-build .sve-build-icon {
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 0.3rem;
  cursor: pointer;
  opacity: 0.6;
}
.sve-build .sve-build-icon:hover,
.sve-build .sve-build-icon[data-active] {
  opacity: 1;
  background: rgba(128, 128, 128, 0.22);
}
.sve-build .sve-build-icon[data-active] {
  color: var(--sve-build-accent-text);
}
.sve-build .sve-build-chip {
  flex: none;
  padding: 0.1em 0.45em;
  border-radius: 0.25rem;
  background: rgba(96, 165, 250, 0.16);
  color: var(--sve-fam-layout, #60a5fa);
  font: 600 0.6875rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
.sve-build .sve-build-chip[data-kind='component'] {
  background: rgba(94, 234, 212, 0.14);
  color: var(--sve-fam-component, #5eead4);
}
.sve-build .sve-build-chip[data-kind='loop'] {
  color: var(--sve-fam-loop, #a5b4fc);
}
.sve-build .sve-build-chip[data-kind='if'] {
  color: var(--sve-fam-if, #e8c468);
}
.sve-build .sve-build-select {
  box-sizing: border-box;
  width: 100%;
  height: 1.875rem;
  padding: 0 0.5em;
  border-radius: 0.35rem;
  border: 1px solid rgba(128, 128, 128, 0.35);
  background: rgba(128, 128, 128, 0.1);
  color: inherit;
  font: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.6875rem;
}
.sve-build-head {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 0.6em;
}
</style>
