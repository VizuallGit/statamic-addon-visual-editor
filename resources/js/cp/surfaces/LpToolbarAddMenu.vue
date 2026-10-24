<script setup>
import { computed } from 'vue';

// The «+» popover of a top-bar group: every tool as a tile, the ones already
// in the bar greyed out — or, for a new group, every one to pick. toolbar-add-menu.js
// builds the props and owns the write; this only reports the pick.
const props = defineProps({
  top: { type: Number, required: true },
  left: { type: Number, required: true },
  title: { type: String, required: true },
  shownLabel: { type: String, required: true },
  emptyLabel: { type: String, required: true },
  // [{ key, label, icon, shown, … }] from toolbarTools().
  tools: { type: Array, required: true },
  // A new group: a tool in the bar moves into it, so none is greyed out.
  pickAny: { type: Boolean, default: false },
  onPick: { type: Function, required: true },
  onClose: { type: Function, required: true },
});

const greyed = (tool) => !props.pickAny && tool.shown;
const nothingToPick = computed(() => props.tools.every(greyed));
</script>

<template>
  <div
    id="__sve-toolbar-add-menu"
    class="sve-tb-add"
    tabindex="-1"
    role="dialog"
    :aria-label="title"
    :style="{ top: top + 'px', left: left + 'px' }"
    @click.stop
    @keydown.escape.stop.prevent="onClose"
  >
    <div class="sve-tb-add__title">{{ title }}</div>

    <p v-if="nothingToPick" class="sve-tb-add__empty">{{ emptyLabel }}</p>

    <div v-else class="sve-tb-add__grid">
      <button
        v-for="tool in tools"
        :key="tool.key"
        type="button"
        class="sve-tb-add__tile"
        :data-sve-toolbar-add-tool="tool.key"
        :disabled="greyed(tool)"
        :title="greyed(tool) ? shownLabel : tool.label"
        :aria-label="tool.label"
        @click="onPick(tool.key)"
      >
        <span class="sve-tb-add__icon" aria-hidden="true" v-html="tool.icon"></span>
        <span class="sve-tb-add__name">{{ tool.label }}</span>
      </button>
    </div>
  </div>
</template>

<style>
/* Not scoped, like LpSettingsMenu: everything sits under .sve-tb-add, which
   only this popover uses — LpSettingsMenu's rules are gone while it is shut. */
.sve-tb-add {
  position: fixed;
  z-index: 2147483001;
  box-sizing: border-box;
  width: 18rem;
  padding: 0.5rem;
  border-radius: 0.625rem;
  background: #343439;
  color: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0.75rem 2.5rem rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.12);
  font: 500 0.8125rem/1.3 ui-sans-serif, system-ui, sans-serif;
  outline: none;
}

.sve-tb-add__title {
  padding: 0.25rem 0.375rem 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sve-tb-add__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.25rem;
}

.sve-tb-add__tile {
  all: unset;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  min-width: 0;
  padding: 0.5rem 0.25rem;
  border-radius: 0.5rem;
  color: inherit;
  cursor: pointer;
}

.sve-tb-add__tile:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
}

.sve-tb-add__tile:focus-visible {
  outline: 0.125rem solid var(--theme-color-primary, #4f46e5);
}

.sve-tb-add__tile:disabled {
  opacity: 0.35;
  cursor: default;
}

.sve-tb-add__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.sve-tb-add__icon svg {
  display: block;
  width: 0.9375rem;
  height: 0.9375rem;
}

.sve-tb-add__name {
  max-width: 100%;
  font-size: 0.6875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sve-tb-add__empty {
  margin: 0;
  padding: 0.5rem 0.375rem;
  color: rgba(255, 255, 255, 0.6);
}
</style>
