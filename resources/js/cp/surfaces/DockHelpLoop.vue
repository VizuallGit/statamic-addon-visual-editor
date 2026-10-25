<script setup>
// Help mode's answer to "what should this loop repeat?" — the loop panel the
// HTML tree shows under the tree, at the caret instead. The model and every
// write are loop-inspector.js's, shared with the tree, so the two write the
// same tag; this file only draws them. `on` holds the handlers, so the caller
// can rebuild the model after a write without remounting.
import { ref } from 'vue';

defineProps({
  inspect: { type: Object, required: true },
  canEdit: { type: Boolean, default: true },
  dataTitle: { type: String, default: '' },
  closeLabel: { type: String, default: '' },
  // { kind, commit, sortDir, sortField, limit, offset, depth, includeHome, pickData }
  on: { type: Object, required: true },
});

const DATA =
  '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>';

const field = ref(null);
const sortField = ref(null);

/** A picked field replaces what the box holds — picking twice is changing your mind. */
function replaceWith(el, name, commit) {
  if (!el || !name) {
    return;
  }

  el.value = name;
  el.focus();
  el.setSelectionRange(name.length, name.length);
  commit(name);
}
</script>

<template>
  <div data-sve-help-loop role="dialog" :aria-label="inspect.title">
    <div data-sve-help-head>
      <span>{{ inspect.title }}</span>
      <span>{{ closeLabel }}</span>
    </div>

    <div data-sve-help-body>
      <div data-sve-help-seg>
        <button
          v-for="choice in inspect.kinds"
          :key="choice.id"
          type="button"
          :data-active="choice.id === inspect.loopKind ? '' : undefined"
          :disabled="!canEdit"
          @click="on.kind(choice.id)"
        >{{ choice.label }}</button>
      </div>

      <select
        v-if="inspect.loopKind === 'collection'"
        :key="inspect.key + ':' + inspect.value"
        :value="inspect.value"
        :disabled="!canEdit"
        @change="on.commit($event.target.value)"
      >
        <option v-if="!inspect.value" value="">{{ inspect.placeholder }}</option>
        <option v-for="item in inspect.collections" :key="item.handle" :value="item.handle">
          {{ item.title }}
        </option>
      </select>

      <select
        v-else-if="inspect.loopKind === 'nav'"
        :key="inspect.key + ':nav:' + inspect.value"
        :value="inspect.value"
        :disabled="!canEdit"
        @change="on.commit($event.target.value)"
      >
        <option v-for="item in inspect.navs" :key="item.handle" :value="item.handle">
          {{ item.title }}
        </option>
      </select>

      <div v-else data-sve-help-box>
        <input
          ref="field"
          :key="inspect.key"
          type="text"
          :value="inspect.value"
          :placeholder="inspect.placeholder"
          :disabled="!canEdit"
          spellcheck="false"
          @keydown.stop
          @keydown.enter.prevent="on.commit($event.target.value)"
          @blur="on.commit($event.target.value)"
        >
        <button
          type="button"
          data-sve-help-data
          :title="dataTitle"
          :disabled="!canEdit"
          v-html="DATA"
          @mousedown.prevent
          @click.stop.prevent="on.pickData($event.currentTarget, (name) => replaceWith(field, name, on.commit))"
        ></button>
      </div>

      <template v-if="inspect.nav">
        <div data-sve-help-sub>{{ inspect.nav.depthTitle }}</div>
        <select
          :key="inspect.key + ':depth:' + inspect.nav.depth"
          :value="inspect.nav.depth"
          :disabled="!canEdit"
          @change="on.depth($event.target.value)"
        >
          <option v-for="item in inspect.nav.depths" :key="item.id" :value="item.id">
            {{ item.label }}
          </option>
        </select>

        <label v-if="inspect.nav.homeAsked" data-sve-help-tick>
          <input
            type="checkbox"
            :checked="inspect.nav.includeHome"
            :disabled="!canEdit"
            @change="on.includeHome($event.target.checked)"
          >
          <span>{{ inspect.nav.homeLabel }}</span>
        </label>
      </template>

      <template v-if="inspect.sort">
        <div data-sve-help-sub>{{ inspect.sort.title }}</div>
        <select
          :key="inspect.key + ':dir:' + inspect.sort.dir"
          :value="inspect.sort.dir"
          :disabled="!canEdit"
          @change="on.sortDir($event.target.value)"
        >
          <option v-for="item in inspect.sort.dirs" :key="item.id" :value="item.id">
            {{ item.label }}
          </option>
        </select>

        <div v-if="inspect.sort.needsField" data-sve-help-box data-sve-help-gap>
          <input
            ref="sortField"
            :key="inspect.key + ':field'"
            type="text"
            :value="inspect.sort.field"
            :placeholder="inspect.sort.placeholder"
            :disabled="!canEdit"
            spellcheck="false"
            @keydown.stop
            @keydown.enter.prevent="on.sortField($event.target.value)"
            @blur="on.sortField($event.target.value)"
          >
          <button
            v-if="inspect.sort.pickable"
            type="button"
            data-sve-help-data
            :title="dataTitle"
            :disabled="!canEdit"
            v-html="DATA"
            @mousedown.prevent
            @click.stop.prevent="on.pickData($event.currentTarget, (name) => replaceWith(sortField, name, on.sortField))"
          ></button>
        </div>

        <div data-sve-help-sub>{{ inspect.limit.title }}</div>
        <input
          :key="inspect.key + ':limit'"
          type="number"
          min="1"
          :value="inspect.limit.value"
          :placeholder="inspect.limit.placeholder"
          :disabled="!canEdit"
          @keydown.stop
          @keydown.enter.prevent="on.limit($event.target.value)"
          @blur="on.limit($event.target.value)"
        >

        <div data-sve-help-sub>{{ inspect.offset.title }}</div>
        <input
          :key="inspect.key + ':offset'"
          type="number"
          min="0"
          :value="inspect.offset.value"
          :placeholder="inspect.offset.placeholder"
          :disabled="!canEdit"
          @keydown.stop
          @keydown.enter.prevent="on.offset($event.target.value)"
          @blur="on.offset($event.target.value)"
        >
      </template>
    </div>
  </div>
</template>
