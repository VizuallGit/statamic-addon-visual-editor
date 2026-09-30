<script setup>
/**
 * The Alpine attributes on the picked tag, and a way to add more.
 *
 * Built like the Tailwind chip list next door: the tag, then what it has, then
 * one plus. A designer who has never heard of Alpine can open a dropdown by
 * picking Toggle on the button and Show on the panel, giving both the same
 * name — which is the whole of Alpine they need to know.
 */
import { alpineUi as ui } from '../alpine/store.js';
</script>

<template>
  <div class="sve-al">
    <div class="sve-al-head">
      <span v-if="ui.tag" class="sve-al-tag">&lt;{{ ui.tag }}&gt;</span>
      <span v-for="name in ui.states" :key="name" class="sve-al-state">{{ name }}</span>
      <span class="sve-al-gap"></span>
      <button
        type="button"
        data-sve-al-add
        :title="ui.addLabel"
        :disabled="!ui.canEdit"
        @click.prevent.stop="ui.onAdd?.($event)"
      >+</button>
    </div>

    <div v-if="!ui.chips.length" class="sve-al-empty">{{ ui.emptyText }}</div>

    <div class="sve-al-chips">
      <span v-for="chip in ui.chips" :key="chip.id" class="sve-al-chip-wrap">
        <button
          type="button"
          :data-sve-al-chip="chip.id"
          :title="chip.title"
          :disabled="!ui.canEdit"
          @click.prevent.stop="ui.onChip?.($event, chip.id)"
        >
          <span class="sve-al-name">{{ chip.name }}</span>
          <span v-if="chip.value" class="sve-al-value">{{ chip.value }}</span>
        </button>
        <button
          v-if="ui.canEdit"
          type="button"
          class="sve-al-drop"
          :title="ui.dropTitle"
          @click.prevent.stop="ui.onDrop?.(chip.id)"
        >−</button>
      </span>
    </div>
  </div>
</template>

<style scoped>
.sve-al {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.6875rem;
}
.sve-al-empty { opacity: .6; padding: 0.25em 0.15em; }
.sve-al-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.3rem;
  min-width: 0;
  padding-bottom: 0.55em;
  border-bottom: 1px solid rgba(128, 128, 128, 0.22);
}
.sve-al-gap { flex: 1 1 auto; min-width: 0; }
.sve-al-tag {
  flex: none;
  padding: 0.2em 0.45em;
  border-radius: 0.36em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: 600;
  opacity: .8;
}
/* The names this tag declares. They are what every behaviour points at, so
   they sit at the top where you can read them before you pick one. */
.sve-al-state {
  padding: 0.18em 0.5em;
  border-radius: 0.36em;
  background: rgba(56, 88, 233, .28);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.625rem;
  line-height: 1.4;
}
[data-sve-al-add] {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6em;
  height: 1.6em;
  border-radius: 0.36em;
  border: 1px solid rgba(128, 128, 128, .35);
  cursor: pointer;
  font-size: 0.875rem;
  line-height: 1;
  opacity: .75;
}
[data-sve-al-add]:hover { opacity: 1; background: rgba(128, 128, 128, .2); }
[data-sve-al-add]:focus-visible { outline: 2px solid #3858e9; outline-offset: -2px; }
[data-sve-al-add][disabled] { cursor: default; opacity: .35; }
.sve-al-chips {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.2rem 0.5rem 0 0;
}
.sve-al-chip-wrap { position: relative; display: flex; max-width: 100%; }
[data-sve-al-chip] {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: baseline;
  gap: 0.5em;
  flex: 1 1 auto;
  min-width: 0;
  padding: 0.3em 0.6em;
  border-radius: 0.45em;
  background: rgba(128, 128, 128, .16);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  line-height: 1.45;
  cursor: pointer;
}
[data-sve-al-chip]:hover { background: rgba(128, 128, 128, .28); }
[data-sve-al-chip]:focus-visible { outline: 2px solid #3858e9; outline-offset: -2px; }
[data-sve-al-chip][disabled] { cursor: default; opacity: .55; }
.sve-al-name { flex: none; color: #7dd3fc; }
.sve-al-value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: .8;
}
.sve-al-drop {
  all: unset;
  position: absolute;
  top: -0.5em;
  right: -0.5em;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  border: 2px solid #1E1E21;
  background: #e11d48;
  color: #fff;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 0.85em;
  line-height: 1;
  opacity: 0;
  cursor: pointer;
}
.sve-al-chip-wrap:hover .sve-al-drop,
.sve-al-chip-wrap:focus-within .sve-al-drop { opacity: 1; }
.sve-al-drop:hover { background: #f43f5e; }
</style>
