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
      <button
        type="button"
        class="sve-tw-tag"
        :disabled="!ui.canEdit"
        @click.prevent.stop="ui.onTag?.($event)"
      >&lt;{{ ui.tag }}&gt;</button>
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
      <button
        type="button"
        data-sve-tw-sort
        :title="ui.sortTitle"
        :disabled="!ui.canEdit"
        @click.prevent.stop="ui.onSort?.()"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2.5 4h9M2.5 8h6M2.5 12h3"/><path d="M13 5v7M11.4 10.4 13 12l1.6-1.6"/>
        </svg>
      </button>
      <span class="sve-tw-gap"></span>
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
        <span v-for="chip in group.chips" :key="chip.id" class="sve-tw-chip-wrap">
          <button
            type="button"
            v-bind="chipBind(chip)"
            :title="chip.title"
            @click.prevent.stop="ui.onChip?.($event, chip.id)"
          >
            <span v-if="chip.color" class="sve-tw-dot" :style="{ background: chip.color }"></span>
            {{ chip.raw }}
          </button>
          <button
            v-if="!chip.locked"
            type="button"
            class="sve-tw-drop"
            :title="ui.dropTitle"
            @click.prevent.stop="ui.onDrop?.(chip.id)"
          >−</button>
        </span>
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
  /* Which tag, which size, which state — settings, not classes. The rule says
     where the answers stop and the classes they apply to begin. */
  padding-bottom: 0.55em;
  margin-bottom: 0.15em;
  border-bottom: 1px solid rgba(128, 128, 128, 0.22);
}
.sve-tw-gap { flex: 1 1 auto; min-width: 0; }
.sve-tw-tag {
  all: unset;
  flex: none;
  box-sizing: border-box;
  padding: 0.2em 0.45em;
  margin-right: 0.35rem;
  border-radius: 0.36em;
  cursor: pointer;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: 600;
  opacity: .8;
}
.sve-tw-tag:hover { opacity: 1; background: rgba(128, 128, 128, .2); }
.sve-tw-tag:focus-visible { outline: 2px solid #3858e9; outline-offset: -2px; }
.sve-tw-tag[disabled] { cursor: default; }
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
[data-sve-tw-sort] {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding: 0.25em 0.4em;
  border-radius: 0.36em;
  opacity: .6;
}
[data-sve-tw-sort]:hover { opacity: 1; background: rgba(128, 128, 128, .18); }
[data-sve-tw-sort]:focus-visible { outline: 2px solid #3858e9; outline-offset: -2px; }
[data-sve-tw-sort][disabled] { cursor: default; opacity: .3; }
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
  /* Room for the badge on the corner of a chip. */
  gap: 0.5rem;
  padding: 0.3rem 0.5rem 0 0.5rem;
}
[data-sve-tw-chip] {
  all: unset;
  position: relative;
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
/* The wrap is what the badge is positioned against — the chip keeps its own
   box, and the badge sits on the corner without pushing the text around. */
.sve-tw-chip-wrap {
  position: relative;
  display: inline-flex;
  max-width: 100%;
}
.sve-tw-drop {
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
.sve-tw-chip-wrap:hover .sve-tw-drop,
.sve-tw-chip-wrap:focus-within .sve-tw-drop { opacity: 1; }
.sve-tw-drop:hover { background: #f43f5e; }
.sve-tw-dot {
  flex: none;
  width: 0.82em;
  height: 0.82em;
  border-radius: 0.18em;
  border: 1px solid rgba(128, 128, 128, .5);
}
</style>
