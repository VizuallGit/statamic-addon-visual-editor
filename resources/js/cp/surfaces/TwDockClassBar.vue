<script setup>
/**
 * Over the dock's Tailwind list: the class open, so what the row's tools write
 * goes into it until Done, and the line that goes with New class. Style has the
 * same in BuildClassTarget.vue and its list.
 */
import { computed } from 'vue';
import TwClassPick from './TwClassPick.vue';

const { classes, t } = defineProps({
  classes: { type: Object, required: true },
  t: { type: Function, required: true },
});

const target = computed(() => (classes.rev.value, classes.target()));
const note = computed(() => {
  classes.rev.value;

  if (!target.value) {
    return '';
  }

  const name = target.value;

  return classes.empty() && !classes.ownCss() ? t('class_empty', { name }) : t('class_editing', { name });
});
const ownCss = computed(() => (classes.rev.value, !!target.value && classes.ownCss()));
</script>

<template>
  <TwClassPick part="line" :classes="classes" :t="t" />

  <div v-if="target" class="sve-tw-open" data-sve-tw-class-open>
    <!-- One line: the pane is low, and the classes under it are what it is for. The note reads in full on hover. -->
    <div class="sve-tw-open__row">
      <span class="sve-tw-open__name" data-sve-tw-class-name>{{ t('class_inside', { name: target }) }}</span>
      <span class="sve-tw-open__note" :title="note" data-sve-tw-class-note>{{ note }}</span>
      <button type="button" class="sve-tw-open__done" data-sve-tw-class-done @click="classes.edit('')">{{
        t('class_done')
      }}</button>
    </div>
    <p v-if="ownCss" class="sve-tw-open__own">{{ t('class_own_css', { name: target }) }}</p>
  </div>
</template>

<style scoped>
.sve-tw-open {
  display: grid;
  gap: 0.25rem;
  margin: 0.4rem 0.5rem 0;
  padding: 0.25rem 0.25rem 0.25rem 0.5rem;
  border-radius: 0.3rem;
  box-shadow: inset 0 0 0 1px #3858e9;
  font-size: 0.6875rem;
}
.sve-tw-open__row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}
.sve-tw-open__name {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-weight: 600;
  color: #b4c1ff;
}
.sve-tw-open__done {
  all: unset;
  flex: none;
  box-sizing: border-box;
  padding: 0.15rem 0.5rem;
  border-radius: 0.25rem;
  background: #3858e9;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
}
.sve-tw-open__done:focus-visible {
  outline: 2px solid #b4c1ff;
  outline-offset: 1px;
}
.sve-tw-open__note {
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #9d9d9e;
}
.sve-tw-open__own {
  margin: 0;
  line-height: 1.45;
  color: #b4c1ff;
}
</style>
