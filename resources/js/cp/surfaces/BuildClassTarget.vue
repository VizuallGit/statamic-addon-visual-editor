<script setup>
/**
 * The class open in Style, in the panel's sticky top: while it stands here,
 * Style writes in that class (build-mode/class-target.js), so a change reaches
 * every element with it, until Done. Nothing is open: nothing stands here.
 * Classes are made, opened and taken off in the list under it
 * (BuildClassList.vue).
 */
import { computed, inject, watch } from 'vue';

const port = inject('sveBuild');

const classes = computed(() => (port.rev.value, port.classes.onTag()));
const target = computed(() => (port.rev.value, port.classes.target()));

function done() {
  port.classes.edit('');
}

// The class came off the element: back to the element.
watch(classes, (now) => {
  if (target.value && !now.includes(target.value)) {
    port.classes.edit('');
  }
});
</script>

<template>
  <div v-if="target" class="fg-seg fg-target" data-sve-build-target>
    <button type="button" class="fg-target__class" aria-pressed="true" :title="target" :data-sve-build-target-class="target" @click="done"><span>{{ target }}</span></button>
    <button type="button" class="fg-target__done" data-sve-build-class-done @click="done">{{ port.t('class_done') }}</button>
  </div>

  <p v-if="target" class="fg-hint fg-target__note" data-sve-build-class-note>
    {{ port.classes.empty() && !port.classes.ownCss() ? port.t('class_empty', { name: target }) : port.t('class_editing', { name: target }) }}
    <template v-if="port.classes.ownCss()"><br />{{ port.t('class_own_css', { name: target }) }}</template>
  </p>
</template>
