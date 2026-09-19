<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
  items: { type: Array, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  onClose: { type: Function, required: true },
});

const menu = ref(null);
const pos = ref({ left: `${props.x}px`, top: `${props.y}px` });

function onDown(event) {
  if (!menu.value?.contains(event.target)) {
    props.onClose();
  }
}

function onKey(event) {
  if (event.key === 'Escape') {
    props.onClose();
  }
}

/**
 * The page under the menu moving closes it. The menu's own list moving does
 * not — a long list is meant to be scrolled through, not chased away.
 */
function onScroll(event) {
  if (!menu.value?.contains(event.target)) {
    props.onClose();
  }
}

onMounted(() => {
  const rect = menu.value?.getBoundingClientRect();

  if (rect) {
    const left = Math.min(props.x, window.innerWidth - rect.width - 8);
    const top = Math.min(props.y, window.innerHeight - rect.height - 8);

    pos.value = { left: `${Math.max(8, left)}px`, top: `${Math.max(8, top)}px` };
  }

  document.addEventListener('pointerdown', onDown, true);
  document.addEventListener('keydown', onKey, true);
  window.addEventListener('scroll', onScroll, true);
});

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDown, true);
  document.removeEventListener('keydown', onKey, true);
  window.removeEventListener('scroll', onScroll, true);
});
</script>

<template>
  <div ref="menu" class="sve-ht-menu" :style="pos">
    <button
      v-for="item in items"
      :key="item.label"
      type="button"
      :disabled="!item.onPick"
      @click="item.onPick?.()"
    >
      <!-- A glyph in front of the word, when the item brings one. -->
      <span v-if="item.icon" class="sve-ht-menu__icon" aria-hidden="true" v-html="item.icon"></span>
      <span>{{ item.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.sve-ht-menu {
  position: fixed;
  z-index: 2147483600;
  min-width: 12rem;
  /* A page list is as long as the site is; the row menus never reach this. */
  max-height: min(60vh, 20rem);
  overflow-y: auto;
  padding: 0.25rem;
  border-radius: 0.5rem;
  background: #262626;
  color: #e5e5e5;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.45);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
button {
  all: unset;
  display: flex;
  align-items: center;
  gap: 0.55em;
  box-sizing: border-box;
  width: 100%;
  padding: 0.4em 0.6em;
  border-radius: 0.3rem;
  cursor: pointer;
  font-size: 0.8125rem;
  line-height: 1.3;
}
.sve-ht-menu__icon {
  display: inline-flex;
  flex: 0 0 auto;
  width: 1.1em;
  height: 1.1em;
  opacity: 0.7;
}
.sve-ht-menu__icon :deep(svg) {
  width: 100%;
  height: 100%;
}
button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}
button:disabled {
  cursor: default;
  opacity: 0.5;
}
</style>
