<script setup>
/**
 * The classes at the foot of Style: the Tailwind pane's own list, with the
 * site's classes marked (build-mode/class-target.js). A click on a Tailwind
 * class changes it; a click on one of the site's opens it, and the list then
 * shows what is in that class. `New class` turns a click into a choice: the
 * classes chosen go into a class with the name given, and it opens. None
 * chosen is a class to fill from Style.
 */
import { computed, inject, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import TwClassList from './TwClassList.vue';
import { ic } from '../../build-mode/icons.js';

const port = inject('sveBuild');
const name = ref('');
const input = ref(null);

const target = computed(() => (port.rev.value, port.classes.target()));
const picking = computed(() => (port.rev.value, port.classes.picking()));
const count = computed(() => (port.rev.value, port.classes.chosen().length));
const outside = computed(() => (port.rev.value, target.value ? port.classes.outside() : []));
const lockedTold = computed(() => {
  port.rev.value;

  const name = port.classes.lockedTold();

  return port.classes.onTag().includes(name) ? name : '';
});
const typed = computed(() => name.value.trim());
const taken = computed(() => (port.rev.value, port.classes.names().includes(typed.value)));
const problem = computed(() => (port.rev.value, !typed.value ? '' : taken.value ? 'name_used' : port.classes.problem(typed.value)));
const canCreate = computed(() => !!typed.value && !problem.value);
const createLabel = computed(() => {
  if (!count.value) {
    return port.t('class_create_empty');
  }

  return count.value === 1 ? port.t('class_create_one') : port.t('class_create_many', { n: count.value });
});

function start() {
  name.value = '';
  port.classes.startPicking();
  nextTick(() => input.value?.focus());
}

function cancel() {
  port.classes.stopPicking();
}

async function create() {
  if (canCreate.value) {
    await port.classes.create(typed.value);
  }
}

// Another element picked: what was chosen belonged to the one before.
watch(() => port.selectedPath(), cancel);
onBeforeUnmount(cancel);
</script>

<template>
  <section class="fg-sec is-open fg-classes" :class="{ 'is-class': target || picking }" data-sve-build-classes>
    <header class="fg-sec__h">
      <span class="fg-sec__name" :data-sve-build-classes-title="target || undefined">{{ target ? port.t('class_inside', { name: target }) : picking ? port.t('class_new') : port.t('classes') }}</span>
      <span v-if="!picking" class="fg-sec__acts">
        <button v-if="!target && port.classes.enabled()" type="button" class="fg-classes__new" data-sve-build-class-new @click="start">{{ port.t('class_new') }}</button>
        <button type="button" class="fg-ib" :title="port.t('classes_sort')" :aria-label="port.t('classes_sort')" data-sve-build-classes-sort @click="port.sortClasses()" v-html="ic('list')"></button>
        <button type="button" class="fg-ib" :title="port.t('classes_add')" :aria-label="port.t('classes_add')" data-sve-build-classes-add @click="port.openAddMenu($event.currentTarget)" v-html="ic('plus')"></button>
      </span>
    </header>
    <div class="fg-sec__b">
      <p v-if="picking" class="fg-hint">{{ port.t('class_pick_hint') }}</p>
      <TwClassList />

      <div v-if="picking" class="fg-classpick" data-sve-build-class-pick>
        <input ref="input" v-model="name" type="text" spellcheck="false" :placeholder="port.t('class_name_placeholder')" :aria-label="port.t('class_name_placeholder')" @keydown.enter.prevent="create" @keydown.esc.prevent.stop="cancel" />
        <p v-if="problem" class="fg-hint" data-sve-build-class-problem>{{ port.t(`class_${problem}`) }}</p>
        <div class="fg-classpick__acts">
          <button type="button" class="fg-classpick__new" :disabled="!canCreate" data-sve-build-class-create @click="create">{{ createLabel }}</button>
          <button type="button" class="fg-classpick__cancel" data-sve-build-class-cancel @click="cancel">{{ port.t('class_cancel') }}</button>
        </div>
      </div>

      <p v-else-if="target" class="fg-hint">{{ port.t('class_inside_note') }}</p>
      <p v-else-if="lockedTold" class="fg-hint" data-sve-build-class-locked-note>{{ port.t('class_locked', { name: lockedTold }) }}</p>
      <p v-else class="fg-hint">{{ port.t('classes_note') }}</p>

      <p v-if="outside.length" class="fg-hint fg-classes__outside" data-sve-build-class-outside>{{ port.t('class_outside') }} <code>{{ outside.join(' ') }}</code></p>
    </div>
  </section>
</template>
