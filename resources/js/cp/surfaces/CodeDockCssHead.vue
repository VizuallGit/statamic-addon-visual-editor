<script setup>
import { cssUi as ui } from '../css/store.js';
</script>

<template>
  <div class="sve-css-head">
    <!-- Double-click, same as the tree: one click here was too easy to hit. -->
    <button
      v-if="ui.tag"
      type="button"
      class="sve-css-tag"
      :disabled="!ui.canEdit"
      @click.prevent.stop
      @dblclick.prevent.stop="ui.onTag?.($event)"
    >&lt;{{ ui.tag }}&gt;</button>
    <span v-if="ui.scope" class="sve-css-scope">{{ ui.scope }}</span>
    <button
      v-for="size in ui.sizes"
      :key="size.key"
      type="button"
      data-sve-css-size
      :title="size.title"
      :data-active="size.active ? '' : undefined"
      :disabled="!ui.canEdit"
      @click.prevent.stop="ui.onSize?.(size.key)"
    >{{ size.label }}</button>
    <button
      type="button"
      data-sve-css-state
      :data-active="ui.state ? '' : undefined"
      :disabled="!ui.canEdit"
      @click.prevent.stop="ui.onState?.($event)"
    >
      {{ ui.stateLabel }}
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <span class="sve-css-gap"></span>
    <span v-if="ui.note" class="sve-css-note">{{ ui.note }}</span>
  </div>
</template>

<style scoped>
/* Deliberately the same shape as the Tailwind row's head — same place on
   screen, same three questions, so switching language does not move things. */
.sve-css-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.3rem;
  min-width: 0;
  padding: 0.4rem 0.5rem;
  font-size: 0.6875rem;
  border-bottom: 1px solid rgba(128, 128, 128, 0.22);
}
.sve-css-gap { flex: 1 1 auto; min-width: 0; }
.sve-css-tag {
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
.sve-css-tag:hover { opacity: 1; background: rgba(128, 128, 128, .2); }
.sve-css-tag:focus-visible { outline: 2px solid #3858e9; outline-offset: -2px; }
.sve-css-tag[disabled] { cursor: default; }
.sve-css-scope {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  opacity: .55;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 0.2rem;
}
.sve-css-note {
  opacity: .5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
[data-sve-css-size],
[data-sve-css-state] {
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
[data-sve-css-size]:hover,
[data-sve-css-state]:hover { opacity: 1; background: rgba(128, 128, 128, .18); }
[data-sve-css-size]:focus-visible,
[data-sve-css-state]:focus-visible { outline: 2px solid #3858e9; outline-offset: -2px; }
[data-sve-css-size][data-active],
[data-sve-css-state][data-active] {
  opacity: 1;
  color: #fff;
  background: #3858e9;
  border-color: transparent;
}
[data-sve-css-size][disabled],
[data-sve-css-state][disabled] { cursor: default; opacity: .35; }
[data-sve-css-state] {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
}
[data-sve-css-state] svg { opacity: .7; }
</style>
