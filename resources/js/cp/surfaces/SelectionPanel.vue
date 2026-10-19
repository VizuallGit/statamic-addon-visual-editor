<script setup>
/**
 * The selected row's fields, drawn with Statamic's own publish components.
 *
 * Statamic's PublishField reads everything it needs — values, meta, errors,
 * hidden fields, locks — from the publish context its form provides. This
 * panel provides the page form's own context, so the fields drawn here ARE
 * the page form's fields: a value typed here lands where the form's copy of
 * the field would put it, and the preview, the dock and the save see it the
 * same instant. FieldsProvider then names the row: its field path and its
 * meta path, exactly as Statamic's Set component names them one level down.
 *
 * Above the fields: the row's icon, its name and the way back — to the row it
 * sits in, or to the page. The look follows the focus panel's header, which is
 * what editors know; the tabs addon turns the row's `tab` markers into the
 * Content | Style control on its own, as it does in every publish form.
 *
 * Keyed on the context by the host: a new form means a fresh field tree.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';
import { log } from '../../lib/debug.js';
import { PublishFields, PublishFieldsProvider } from '@statamic/cms/ui';
import { panelStore, resolvedParent, resolvedSelection } from '../panel/store.js';

const props = defineProps({
  /** The page form's publish context — Statamic's own object, raw. */
  ctx: { type: Object, required: true },
  /** Draws an icon (svg markup, an iconify name or a built-in name) into an element. */
  drawIcon: { type: Function, required: true },
});

// The key Statamic's PublishField injects by (`createContext('PublishContainer')`).
provide('PublishContainerContext', props.ctx);

const emit = defineEmits(['painted']);

/**
 * The row's fields minus its id field. `_visual_id` is an auto_uuid: on mount
 * it claims its value in a list shared by every instance, and a value already
 * claimed is replaced with a new one. The row's id is settled long before it
 * reaches this panel, and the same row is drawn again inside its section's
 * nested sets — drawn here too, the second mount renamed the row under the
 * preview's feet.
 */
const fields = computed(() => (resolvedSelection.value?.fields || []).filter((field) => field?.type !== 'auto_uuid'));

/**
 * Which row's fields are on show. Set one tick after the selection: the old
 * fields unmount in that tick, so a row drawn in both the old tree and the new
 * (a block, then the section holding it) is never mounted twice at once. The
 * tick is a microtask — the new fields still paint in the same frame.
 */
const shownUid = ref(null);

watch(
  () => resolvedSelection.value?.uid || null,
  async (uid) => {
    shownUid.value = null;
    await nextTick();
    shownUid.value = uid;
  },
  { immediate: true }
);

let tileEl = null;

function setTile(el) {
  tileEl = el;
  paintTile();
}

function paintTile() {
  if (!tileEl) {
    return;
  }

  tileEl.textContent = '';

  const row = resolvedSelection.value;
  const icon = row?.icon ? props.drawIcon(tileEl.ownerDocument, row.icon) : null;

  if (icon) {
    tileEl.appendChild(icon);
  } else {
    tileEl.textContent = (row?.display || '?').trim().charAt(0).toUpperCase();
  }
}

function backLabel() {
  const parent = resolvedParent.value;

  return parent ? parent.display : panelStore.strings.page;
}

function goBack() {
  panelStore.onBack?.(resolvedSelection.value?.parentUid || null);
}

watch(
  () => [shownUid.value, resolvedSelection.value?.icon, resolvedSelection.value?.display],
  () => {
    paintTile();
    nextTick(() => emit('painted'));
  }
);

onMounted(() => { log('SelectionPanel mounted'); nextTick(() => emit('painted')); });
onBeforeUnmount(() => log('SelectionPanel unmount'));
</script>

<template>
  <div v-if="resolvedSelection" class="sve-sel" data-sve-selection-panel :data-sve-selection-kind="resolvedSelection.kind">
    <header class="sve-sel__head">
      <div class="sve-sel__id">
        <span class="sve-sel__tile" :ref="setTile"></span>
        <h2 class="sve-sel__title">{{ resolvedSelection.display }}</h2>
        <button type="button" class="sve-sel__back" @click="goBack">
          <span aria-hidden="true" class="sve-sel__arrow">&#8249;</span><span>{{ backLabel() }}</span>
        </button>
      </div>
      <p v-if="resolvedSelection.instructions" class="sve-sel__desc">{{ resolvedSelection.instructions }}</p>
    </header>

    <PublishFieldsProvider
      v-if="shownUid === resolvedSelection.uid"
      :key="resolvedSelection.uid"
      :fields="fields"
      :field-path-prefix="resolvedSelection.path"
      :meta-path-prefix="resolvedSelection.metaPath"
      :as-config="false"
    >
      <PublishFields class="sve-sel__fields" />
    </PublishFieldsProvider>
  </div>
</template>

<style scoped>
.sve-sel {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
.sve-sel__head {
  position: sticky;
  top: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding: 0.875rem 0 1rem;
  border-bottom: 1px solid rgba(128, 128, 128, 0.16);
  background: var(--theme-color-content-bg, var(--color-white, #fff));
}
.sve-sel__id {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.sve-sel__tile {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 0.6rem;
  background: rgba(128, 128, 128, 0.16);
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1;
}
.sve-sel__tile :deep(svg) {
  width: 1.1rem;
  height: 1.1rem;
}
.sve-sel__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
}
.sve-sel__back {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 0.55em;
  margin-left: auto;
  padding: 0.55em 0.95em;
  border-radius: 0.55rem;
  background: rgba(128, 128, 128, 0.16);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}
.sve-sel__back:hover {
  background: rgba(128, 128, 128, 0.28);
}
.sve-sel__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  line-height: 1;
  font-weight: 600;
  transform: translateY(-1.5px);
}
.sve-sel__desc {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  opacity: 0.6;
}
</style>
