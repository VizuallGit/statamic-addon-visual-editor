<script setup>
import { ref, watch } from 'vue';
import { htmlTreeUi as ui } from '../html-tree/store.js';

const DATA =
  '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>';

/** The pages this site has, for a link field to point at. */
const PAGE =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>';

const propHost = ref(null);

/**
 * The publish form is mounted by an app that can see Statamic's components,
 * and it can only be mounted once this element exists. Vue renders it on its
 * own schedule, so the element says when — asking for it right after setting
 * the mode would be asking one tick too early, every time.
 */
watch(propHost, (el) => ui.onPropHost?.(el || null));

const field = ref(null);
const sortField = ref(null);

function commit(event) {
  ui.onInspectCommit?.(event.target.value);
}

/**
 * Write a picked field into a box, replacing whatever is there.
 *
 * `true` is the placeholder a new condition is born with, so picking a field
 * replaces it outright — nobody means `trueheadline`. Picking twice is
 * changing your mind, not building an expression.
 */
function replaceWith(el, name, commitFn) {
  if (!el || !name) {
    return;
  }

  el.value = name;
  el.focus();
  el.setSelectionRange(name.length, name.length);
  commitFn(name);
}

/**
 * Picking a field for a prop binds it: the value becomes an expression, so
 * `:headline="title"` rather than the literal word "title".
 */
function pickProp(event, row) {
  ui.onInspectData?.(event.currentTarget, (name) =>
    ui.onPropValue?.(row.handle, name, true)
  );
}

function pickData(event) {
  ui.onInspectData?.(event.currentTarget, (name) =>
    replaceWith(field.value, name, (v) => ui.onInspectCommit?.(v))
  );
}

function pickSortField(event) {
  ui.onInspectData?.(event.currentTarget, (name) =>
    replaceWith(sortField.value, name, (v) => ui.onLoopSortField?.(v))
  );
}
</script>

<template>
  <div v-if="ui.inspect" class="sve-ht-inspect">
    <div class="sve-ht-inspect__head">{{ ui.inspect.title }}</div>

    <div v-if="ui.inspect.mode === 'note'" class="sve-ht-inspect__note">
      {{ ui.inspect.note }}
    </div>

    <!--
      The Control Panel's own publish form for this call's values. Left empty
      here on purpose: it is mounted into by an app that can see Statamic's
      components, which this one deliberately cannot.
    -->
    <div v-else-if="ui.inspect.mode === 'statamic'" ref="propHost" class="sve-ht-inspect__form"></div>

    <!--
      What this place gives the component. Typing a value writes
      `headline="…"` into the call; the data button writes `:headline="title"`
      instead, which is Antlers' own difference between a value and a binding.
      Left blank, the parameter comes out and the component's own default is
      what shows.
    -->
    <div v-else-if="ui.inspect.mode === 'props'" class="sve-ht-inspect__props">
      <label v-for="row in ui.inspect.rows" :key="row.handle" class="sve-ht-inspect__prop">
        <span class="sve-ht-inspect__proplabel">
          {{ row.label }}
          <em v-if="row.bound">:</em>
        </span>
        <span
          class="sve-ht-inspect__box"
          :class="{ 'sve-ht-inspect__box--pick': row.type === 'select' || row.type === 'link' }"
        >
          <!--
            A choice field offers what the component declared. Bound to a
            variable it cannot: the value is then an expression, not one of the
            words on the list, so the box comes back.
          -->
          <select
            v-if="row.type === 'select' && !row.bound"
            :value="row.value"
            :disabled="!ui.canEdit"
            @change="ui.onPropValue?.(row.handle, $event.target.value, false)"
          >
            <option value="">{{ row.placeholder || ui.inspect.inheritLabel }}</option>
            <option
              v-if="row.value && !row.options.includes(row.value)"
              :value="row.value"
            >{{ row.value }}</option>
            <option v-for="choice in row.options" :key="choice" :value="choice">{{ choice }}</option>
          </select>
          <input
            v-else
            type="text"
            :value="row.value"
            :placeholder="row.placeholder || ui.inspect.inheritLabel"
            @change="ui.onPropValue?.(row.handle, $event.target.value, row.bound)"
          />
          <button
            v-if="row.type === 'link'"
            type="button"
            data-sve-ht-data
            :title="ui.pageTitle"
            :disabled="!ui.canEdit"
            @click="ui.onPropPage?.($event.currentTarget, row.handle)"
            v-html="PAGE"
          ></button>
          <button
            type="button"
            data-sve-ht-data
            :title="ui.dataTitle"
            :disabled="!ui.canEdit"
            @click="pickProp($event, row)"
            v-html="DATA"
          ></button>
        </span>
      </label>
    </div>

    <template v-else>
      <div v-if="ui.inspect.mode === 'loop'" class="sve-ht-inspect__seg">
        <button
          v-for="choice in ui.inspect.kinds"
          :key="choice.id"
          type="button"
          :data-active="choice.id === ui.inspect.loopKind ? '' : undefined"
          :disabled="!ui.canEdit"
          @click="ui.onLoopKind?.(choice.id)"
        >{{ choice.label }}</button>
      </div>

      <select
        v-if="ui.inspect.mode === 'loop' && ui.inspect.loopKind === 'collection'"
        :key="ui.inspect.key + ':' + ui.inspect.value"
        :value="ui.inspect.value"
        :disabled="!ui.canEdit"
        @change="commit"
      >
        <option v-if="!ui.inspect.value" value="">{{ ui.inspect.placeholder }}</option>
        <option v-for="item in ui.inspect.collections" :key="item.handle" :value="item.handle">
          {{ item.title }}
        </option>
      </select>

      <div v-else class="sve-ht-inspect__box">
        <input
          ref="field"
          :key="ui.inspect.key"
          type="text"
          :value="ui.inspect.value"
          :placeholder="ui.inspect.placeholder"
          :disabled="!ui.canEdit"
          spellcheck="false"
          @keydown.stop
          @keydown.enter.prevent="commit"
          @blur="commit"
        >
        <button
          type="button"
          data-sve-ht-data
          :title="ui.dataTitle"
          :disabled="!ui.canEdit"
          v-html="DATA"
          @mousedown.prevent
          @click.stop.prevent="pickData"
        ></button>
      </div>

      <template v-if="ui.inspect.sort">
        <div class="sve-ht-inspect__head sve-ht-inspect__head--sub">{{ ui.inspect.sort.title }}</div>
        <select
          :key="ui.inspect.key + ':dir:' + ui.inspect.sort.dir"
          :value="ui.inspect.sort.dir"
          :disabled="!ui.canEdit"
          @change="ui.onLoopSortDir?.($event.target.value)"
        >
          <option v-for="item in ui.inspect.sort.dirs" :key="item.id" :value="item.id">
            {{ item.label }}
          </option>
        </select>

        <div v-if="ui.inspect.sort.needsField" class="sve-ht-inspect__box sve-ht-inspect__box--gap">
          <input
            ref="sortField"
            :key="ui.inspect.key + ':field'"
            type="text"
            :value="ui.inspect.sort.field"
            :placeholder="ui.inspect.sort.placeholder"
            :disabled="!ui.canEdit"
            spellcheck="false"
            @keydown.stop
            @keydown.enter.prevent="ui.onLoopSortField?.($event.target.value)"
            @blur="ui.onLoopSortField?.($event.target.value)"
          >
          <button
            v-if="ui.inspect.sort.pickable"
            type="button"
            data-sve-ht-data
            :title="ui.dataTitle"
            :disabled="!ui.canEdit"
            v-html="DATA"
            @mousedown.prevent
            @click.stop.prevent="pickSortField"
          ></button>
        </div>

        <div class="sve-ht-inspect__head sve-ht-inspect__head--sub">{{ ui.inspect.limit.title }}</div>
        <input
          :key="ui.inspect.key + ':limit'"
          type="number"
          min="1"
          :value="ui.inspect.limit.value"
          :placeholder="ui.inspect.limit.placeholder"
          :disabled="!ui.canEdit"
          @keydown.stop
          @keydown.enter.prevent="ui.onLoopLimit?.($event.target.value)"
          @blur="ui.onLoopLimit?.($event.target.value)"
        >
      </template>

      <div v-if="ui.inspect.branches?.length" class="sve-ht-inspect__add">
        <button
          v-for="branch in ui.inspect.branches"
          :key="branch.id"
          type="button"
          :disabled="!ui.canEdit"
          @click="ui.onAddBranch?.(branch.id)"
        >{{ branch.label }}</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.sve-ht-inspect {
  flex: none;
  margin-top: 0.9em;
  padding: 0.9em 0.7em 0.7em;
  border-top: 1px solid rgba(128, 128, 128, 0.25);
}
.sve-ht-inspect__head {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.6;
  margin-bottom: 0.45em;
}
.sve-ht-inspect__head--sub {
  margin-top: 0.9em;
}
input,
select {
  box-sizing: border-box;
  width: 100%;
  padding: 0.45em 0.6em;
  border-radius: 0.35rem;
  border: 1px solid rgba(128, 128, 128, 0.35);
  background: rgba(0, 0, 0, 0.22);
  color: inherit;
  font: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.6875rem;
}
input:focus,
select:focus {
  outline: 2px solid #3858e9;
  outline-offset: -1px;
}
input:disabled,
select:disabled {
  opacity: 0.55;
}
.sve-ht-inspect__box {
  position: relative;
}
.sve-ht-inspect__props {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
.sve-ht-inspect__prop {
  display: block;
}
.sve-ht-inspect__proplabel {
  display: block;
  margin-bottom: 0.2em;
  font-size: 0.75em;
  opacity: 0.6;
}
/* The colon is Antlers' own mark for "this is an expression", so a bound
   field wears the same one the call does. */
.sve-ht-inspect__proplabel em {
  font-style: normal;
  opacity: 0.9;
}
.sve-ht-inspect__box--gap {
  margin-top: 0.35em;
}
.sve-ht-inspect__box:has([data-sve-ht-data]) input {
  padding-right: 2em;
}
/*
  A choice and a link both put something next to the field rather than on top
  of it: a select draws its own arrow where the button would sit, and a link
  has two buttons, which is one more than a corner holds.
*/
.sve-ht-inspect__box--pick {
  display: flex;
  gap: 0.25em;
  align-items: center;
}
.sve-ht-inspect__box--pick input,
.sve-ht-inspect__box--pick select {
  flex: 1 1 auto;
  width: auto;
  min-width: 0;
  padding-right: 0.6em;
}
.sve-ht-inspect__box--pick [data-sve-ht-data] {
  position: static;
  transform: none;
  flex: 0 0 auto;
}
[data-sve-ht-data] {
  all: unset;
  position: absolute;
  top: 50%;
  right: 0.3em;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5em;
  height: 1.5em;
  border-radius: 0.25rem;
  cursor: pointer;
  opacity: 0.55;
}
[data-sve-ht-data]:hover:not(:disabled) {
  opacity: 1;
  background: rgba(128, 128, 128, 0.22);
}
.sve-ht-inspect__note {
  font-size: 0.6875rem;
  opacity: 0.55;
}
.sve-ht-inspect__seg {
  display: flex;
  gap: 0.2em;
  margin-bottom: 0.45em;
}
.sve-ht-inspect__seg button {
  all: unset;
  flex: 1 1 0;
  box-sizing: border-box;
  padding: 0.35em 0.5em;
  border-radius: 0.3rem;
  background: rgba(128, 128, 128, 0.16);
  cursor: pointer;
  text-align: center;
  font-size: 0.6875rem;
}
.sve-ht-inspect__seg button[data-active] {
  background: #3858e9;
  color: #fff;
}
.sve-ht-inspect__add {
  display: flex;
  gap: 0.3em;
  margin-top: 0.5em;
}
.sve-ht-inspect__add button {
  all: unset;
  box-sizing: border-box;
  padding: 0.35em 0.6em;
  border-radius: 0.3rem;
  border: 1px dashed rgba(128, 128, 128, 0.45);
  cursor: pointer;
  font-size: 0.6875rem;
  opacity: 0.8;
}
.sve-ht-inspect__add button:hover:not(:disabled) {
  opacity: 1;
  background: rgba(128, 128, 128, 0.16);
}
button:disabled {
  cursor: default;
  opacity: 0.45;
}
</style>
