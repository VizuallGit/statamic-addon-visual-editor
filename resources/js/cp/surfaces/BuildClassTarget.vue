<script setup>
/**
 * What Style writes on: this element, or a class it carries. A class is a
 * Tailwind utility in site.css (build-mode/class-target.js), the same as the
 * dock's Utility button makes, so a change reaches every element with it.
 * `+ Class` finds one of the site's, or names a new one.
 */
import { computed, inject, nextTick, ref, watch } from 'vue';
import { ic } from '../../build-mode/icons.js';

const port = inject('sveBuild');
const open = ref(false);
const typed = ref('');
const input = ref(null);

const classes = computed(() => (port.rev.value, port.classes.onTag()));
const target = computed(() => (port.rev.value, port.classes.target()));
const query = computed(() => typed.value.trim());

const rows = computed(() => {
  port.rev.value;

  const have = new Set(classes.value);
  const q = query.value.toLowerCase();

  return port.classes.names().filter((name) => !have.has(name) && name.toLowerCase().includes(q));
});

const taken = computed(() => port.classes.names().includes(query.value));
const problem = computed(() => (port.rev.value, query.value && !taken.value ? port.classes.problem(query.value) : ''));
const canCreate = computed(() => !!query.value && !taken.value && !problem.value);
const handing = computed(() => (port.rev.value, target.value ? 0 : port.classes.picked()));

function toggle() {
  open.value = !open.value;
  typed.value = '';

  if (open.value) {
    nextTick(() => input.value?.focus());
  }
}

function pick(name) {
  port.classes.add(name);
  open.value = false;
}

async function create() {
  if (canCreate.value) {
    const name = query.value;

    open.value = false;
    await port.classes.create(name);
  }
}

function enter() {
  if (rows.value.length && !canCreate.value) {
    pick(rows.value[0]);
  } else {
    create();
  }
}

// The class came off the element: back to the element.
watch(classes, (now) => {
  if (target.value && !now.includes(target.value)) {
    port.classes.edit('');
  }
});
</script>

<template>
  <div class="fg-seg fg-target" data-sve-build-target>
    <button type="button" :aria-pressed="!target" data-sve-build-target-element @click="port.classes.edit('')"><span v-html="ic('cursor')"></span>{{ port.t('this_element') }}</button>
    <button
      v-for="name in classes"
      :key="name"
      type="button"
      class="fg-target__class"
      :aria-pressed="target === name"
      :title="name"
      :data-sve-build-target-class="name"
      @click="port.classes.edit(target === name ? '' : name)"
    ><span>{{ name }}</span></button>
    <button type="button" :aria-expanded="open" :disabled="!port.classes.enabled()" :title="port.classes.enabled() ? port.t('own_class') : port.t('tw_utility_no_site_css')" data-sve-build-class-add @click="toggle"><span v-html="ic('plus')"></span>{{ port.t('own_class') }}</button>
  </div>

  <div v-if="open" class="fg-classpick" data-sve-build-class-pick>
    <input ref="input" v-model="typed" type="text" spellcheck="false" :placeholder="port.t('class_placeholder')" :aria-label="port.t('class_placeholder')" @keydown.enter.prevent="enter" @keydown.esc.prevent.stop="open = false" />
    <button v-if="canCreate" type="button" class="fg-classpick__new" data-sve-build-class-create @click="create">
      <span v-html="ic('plus')"></span>{{ handing ? port.t('class_create_from', { name: query, n: handing }) : port.t('class_create', { name: query }) }}
    </button>
    <p v-if="problem" class="fg-hint">{{ port.t(`class_${problem}`) }}</p>
    <div v-if="rows.length" class="fg-classpick__rows">
      <button v-for="name in rows" :key="name" type="button" :data-sve-build-class-row="name" @click="pick(name)">{{ name }}</button>
    </div>
    <p v-else-if="!query" class="fg-hint">{{ port.t('class_none') }}</p>
  </div>

  <p v-if="target" class="fg-hint fg-target__note" data-sve-build-class-note>
    {{ port.classes.empty() ? port.t('class_empty', { name: target }) : port.t('class_editing', { name: target }) }}
    <template v-if="port.classes.ownCss()"><br />{{ port.t('class_own_css', { name: target }) }}</template>
  </p>
</template>
