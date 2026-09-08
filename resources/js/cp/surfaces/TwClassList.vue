<script setup>
import { twUi as ui } from '../tailwind/store.js';

function chipBind(chip) {
  const bind = { 'data-sve-tw-chip': chip.id };

  if (chip.locked) {
    bind['data-sve-tw-locked'] = '';
  }

  if (chip.open) {
    bind['data-open'] = '';
  }

  return bind;
}
</script>

<template>
  <div class="sve-tw">
    <div v-if="ui.tag" class="sve-tw-head">
      <span class="sve-tw-tag">&lt;{{ ui.tag }}&gt;</span>
      <span v-if="ui.scope" class="sve-tw-scope" :title="ui.scopeTitle">{{ ui.scope }}</span>
      <span class="sve-tw-gap"></span>
      <button
        v-for="item in ui.breakpoints"
        :key="item.index"
        type="button"
        data-sve-tw-bp
        :title="item.title"
        :data-active="item.active ? '' : undefined"
        :disabled="!ui.canEdit"
        @click.prevent.stop="ui.onBreakpoint?.(item.index)"
      >{{ item.label }}</button>
      <button
        type="button"
        data-sve-tw-state
        :data-active="ui.state ? '' : undefined"
        :disabled="!ui.canEdit"
        @click.prevent.stop="ui.onState?.($event)"
      >
        {{ ui.stateLabel }}
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
    </div>
    <div v-if="!ui.groups.length" class="sve-tw-empty">{{ ui.emptyText }}</div>
    <div v-for="group in ui.groups" :key="group.key" class="sve-tw-group">
      <span
        class="sve-tw-variant"
        :data-sve-tw-base="group.key === '' ? '' : undefined"
        :data-current="group.current ? '' : undefined"
      >
        {{ group.key === '' ? ui.baseLabel : group.key }}
      </span>
      <div class="sve-tw-chips">
        <button
          v-for="chip in group.chips"
          :key="chip.id"
          type="button"
          v-bind="chipBind(chip)"
          :title="chip.title"
          @click.prevent.stop="ui.onChip?.($event, chip.id)"
        >
          <span v-if="chip.color" class="sve-tw-dot" :style="{ background: chip.color }"></span>
          {{ chip.raw }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sve-tw {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.6875rem;
}
.sve-tw-empty {
  opacity: .6;
  padding: 0.25em 0.15em;
}
.sve-tw-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.3rem;
  min-width: 0;
}
.sve-tw-gap { flex: 1 1 auto; min-width: 0; }
.sve-tw-tag {
  flex: none;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: 600;
  opacity: .8;
}
.sve-tw-scope {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  opacity: .55;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
[data-sve-tw-bp],
[data-sve-tw-state] {
  all: unset;
  box-sizing: border-box;
  cursor: pointer;
  padding: 0.2em 0.5em;
  border-radius: 0.36em;
  border: 1px solid rgba(128, 128, 128, .35);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.625rem;
  line-height: 1.4;
  opacity: .7;
}
[data-sve-tw-bp]:hover,
[data-sve-tw-state]:hover { opacity: 1; background: rgba(128, 128, 128, .18); }
[data-sve-tw-bp]:focus-visible,
[data-sve-tw-state]:focus-visible { outline: 2px solid #3858e9; outline-offset: -2px; }
[data-sve-tw-bp][data-active],
[data-sve-tw-state][data-active] {
  opacity: 1;
  color: #fff;
  background: #3858e9;
  border-color: transparent;
}
[data-sve-tw-bp][disabled],
[data-sve-tw-state][disabled] { cursor: default; opacity: .35; }
[data-sve-tw-state] {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
}
[data-sve-tw-state] svg { opacity: .7; }
.sve-tw-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.sve-tw-variant {
  align-self: flex-start;
  padding: 0.18em 0.55em;
  border-radius: 0.36em;
  background: rgba(56, 88, 233, .28);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.625rem;
  line-height: 1.4;
}
.sve-tw-variant[data-current] {
  background: #3858e9;
  color: #fff;
}
.sve-tw-variant[data-sve-tw-base] {
  background: transparent;
  opacity: .5;
  padding-left: 0;
  text-transform: uppercase;
  letter-spacing: .04em;
}
.sve-tw-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  padding-left: 0.5rem;
}
[data-sve-tw-chip] {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  max-width: 100%;
  padding: 0.27em 0.64em;
  border-radius: 0.45em;
  background: rgba(128, 128, 128, .16);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  line-height: 1.4;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
[data-sve-tw-chip]:hover { background: rgba(128, 128, 128, .28); }
[data-sve-tw-chip]:focus-visible { outline: 2px solid #3858e9; outline-offset: -2px; }
[data-sve-tw-chip][data-open] { background: #3858e9; color: #fff; }
[data-sve-tw-chip][data-sve-tw-locked] { cursor: default; opacity: .55; }
[data-sve-tw-chip][data-sve-tw-locked]:hover { background: rgba(128, 128, 128, .16); }
.sve-tw-dot {
  flex: none;
  width: 0.82em;
  height: 0.82em;
  border-radius: 0.18em;
  border: 1px solid rgba(128, 128, 128, .5);
}
</style>
