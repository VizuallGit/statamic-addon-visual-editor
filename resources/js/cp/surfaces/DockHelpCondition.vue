<script setup>
// A condition's panel in the help popup's look — DockHelpLoop.vue's sibling.
// The model is the HTML tree's (html-tree.js `paintHtmlTreeInspector`): the
// expression with Else if / Else under it, or `{{ else }}`'s note. `on` holds
// the writes, so the caller decides where they go. No <style>: the look is
// help-styles.js's, injected by whoever mounts the popup.
import { ref } from 'vue';

defineProps({
  inspect: { type: Object, required: true },
  canEdit: { type: Boolean, default: true },
  dataTitle: { type: String, default: '' },
  closeLabel: { type: String, default: '' },
  // { commit, branch, pickData }
  on: { type: Object, required: true },
});

const DATA =
  '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>';

const field = ref(null);

/**
 * A picked field replaces what the box holds. `true` is what a new condition
 * is born with, so nobody means `trueheadline`; picking twice is changing
 * your mind, not building an expression.
 */
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
  <div data-sve-help-condition role="dialog" :aria-label="inspect.title">
    <div data-sve-help-head>
      <span>{{ inspect.title }}</span>
      <span>{{ closeLabel }}</span>
    </div>

    <div data-sve-help-body>
      <p v-if="inspect.mode === 'note'" data-sve-help-note>{{ inspect.note }}</p>

      <template v-else>
        <div data-sve-help-box>
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

        <div v-if="inspect.branches?.length" data-sve-help-branches>
          <button
            v-for="branch in inspect.branches"
            :key="branch.id"
            type="button"
            :disabled="!canEdit"
            @click="on.branch(branch.id)"
          >{{ branch.label }}</button>
        </div>
      </template>
    </div>
  </div>
</template>
