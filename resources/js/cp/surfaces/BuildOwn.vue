<script setup>
/**
 * "Own content in each section" under an element's content in Build's Content.
 *
 * Every section of a type renders the type's one file, so what the file holds
 * is the same in every section of it, on every page. On, the element's content
 * is its section's own instead: a field of the section kept out of Edit
 * Content's form (port.makeOwn), so each section holds its own. Off, the
 * content goes back into the file, the same everywhere, and the field leaves
 * the fieldset once the file no longer reads it (port.dropOwnField).
 *
 * On is where Build starts: the first change it writes into an element's own
 * words turns it on by itself. "Editable in Edit Content" (BuildEditable.vue)
 * is the step after: the same field, shown to a content editor.
 *
 * Owner: Build mode. The parent does the writing (`on` / `off`).
 */
import { inject } from 'vue';

defineProps({
  on: { type: Boolean, default: false },
  busy: { type: Boolean, default: false },
});
const emit = defineEmits(['on', 'off']);

const port = inject('sveBuild');
</script>

<template>
  <div class="bm-editable" data-sve-build-own>
    <div class="bm-link-row">
      <span>{{ port.t('content_own') }}</span>
      <button
        type="button"
        class="bm-switch"
        role="switch"
        :aria-checked="on"
        :aria-label="port.t('content_own')"
        :title="port.t(on ? 'content_own_on' : 'content_own_off')"
        :disabled="busy"
        data-sve-build-own-switch
        @click="emit(on ? 'off' : 'on')"
      ></button>
    </div>
  </div>
</template>
