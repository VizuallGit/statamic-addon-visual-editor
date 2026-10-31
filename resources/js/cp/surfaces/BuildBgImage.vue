<script setup>
/**
 * A background image: picked in Statamic's own asset browser (`port.mountField`,
 * the field Content's images use), or an address typed into the field's menu.
 * Either way the element carries one class, `bg-[url(…)]`.
 */
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue';
import BuildClassField from './BuildClassField.vue';
import { fieldHas } from '../../build-mode/catalog.js';
import { effectiveClass, variantChain } from '../../build-mode/classes.js';

const props = defineProps({
  field: { type: Object, required: true },
  path: { type: String, required: true },
});

const port = inject('sveBuild');
const statamic = !!port.fieldReady?.('img');
const host = ref(null);

const current = computed(() => {
  port.rev.value;

  const chain = variantChain(port.sizes(), port.size(), port.state());

  return effectiveClass(port.pickedClasses().join(' '), ['field'], chain, (name) => (fieldHas(props.field, name) ? 'field' : ''));
});
const own = computed(() => (current.value && !current.value.inherited ? current.value : null));
const url = computed(() => /^bg-\[url\((.*)\)\]$/.exec(own.value?.name || '')?.[1] || '');

let unmount = null;
let shown = '';

function write(next) {
  // The field sends a change on its way out too: it belongs to the element it was opened on.
  if (port.selectedPath() !== props.path) {
    return;
  }

  shown = next;

  if (next) {
    port.setFieldClass(`bg-[url(${next.replace(/\s/g, '%20')})]`, own.value?.raw || '');
  } else if (own.value) {
    port.setClass(own.value.name);
  }
}

function mount() {
  unmount?.();
  shown = url.value;
  unmount = host.value ? port.mountField(host.value, { kind: 'img', value: shown, display: '', write }) : null;
}

watch(host, mount, { flush: 'post' });
// An address typed, or the class taken off: the asset field opens on what the element has now.
watch(url, (next) => {
  if (next !== shown) {
    mount();
  }
});

onBeforeUnmount(() => unmount?.());
</script>

<template>
  <BuildClassField :field="field" />
  <div v-if="statamic" ref="host" class="bm-field-host" data-sve-build-bg-image></div>
</template>
