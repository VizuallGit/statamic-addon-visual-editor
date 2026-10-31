<script setup>
/**
 * The site's classes on the element, on one line. A class is a Tailwind utility
 * in site.css (build-mode/class-target.js), the same as the dock's Utility
 * button makes. Style writes Tailwind classes on the element, unless a class is
 * open here: then it writes in that class, so a change reaches every element
 * with it, until Done. `+` finds one of the site's, or names a new one. A locked
 * class goes on and off the element, and never opens. What the line has no room
 * for is under its ⋯.
 */
import { computed, inject, nextTick, ref, watch } from 'vue';
import { ic } from '../../build-mode/icons.js';
import { useFitRow } from './fit-row.js';

const port = inject('sveBuild');
const open = ref(false);
const typed = ref('');
const input = ref(null);
// The locked class last clicked, so the panel can say why it does not open.
const lockedTold = ref('');
const row = ref(null);
const moreBtn = ref(null);
const morePanel = ref(null);
const fit = useFitRow(row, moreBtn, morePanel);

const classes = computed(() => (port.rev.value, port.classes.onTag()));
const target = computed(() => (port.rev.value, port.classes.target()));
const query = computed(() => typed.value.trim());
const classesOut = computed(() => (fit.hidden.value ? classes.value.slice(-fit.hidden.value) : []));

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
  lockedTold.value = port.classes.locked(name) ? name : '';
  open.value = false;
}

function choose(name) {
  fit.open.value = false;

  if (port.classes.locked(name)) {
    lockedTold.value = name;

    return;
  }

  lockedTold.value = '';
  port.classes.edit(name);
}

function takeOff(name) {
  lockedTold.value = '';
  port.classes.remove(name);
}

function done() {
  port.classes.edit('');
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
  <div v-if="target" class="fg-seg fg-target" data-sve-build-target>
    <button type="button" class="fg-target__class" aria-pressed="true" :title="target" :data-sve-build-target-class="target" @click="done"><span>{{ target }}</span></button>
    <button type="button" class="fg-target__done" data-sve-build-class-done @click="done">{{ port.t('class_done') }}</button>
  </div>

  <div v-else class="fg-seg fg-target" data-sve-build-target>
    <span class="fg-target__label">{{ port.t('class_row') }}</span>
    <div ref="row" class="fg-fit">
      <span v-for="name in classes" :key="name" class="fg-target__item">
        <button
          type="button"
          class="fg-target__class"
          :title="port.classes.locked(name) ? port.t('class_locked_title', { name }) : name"
          :data-sve-build-target-class="name"
          :data-sve-build-class-locked="port.classes.locked(name) ? '' : undefined"
          @click="choose(name)"
        ><span v-if="port.classes.locked(name)" class="fg-target__lock" v-html="ic('lock')"></span><span>{{ name }}</span></button>
        <button type="button" class="fg-target__off" :title="port.t('class_take_off', { name })" :aria-label="port.t('class_take_off', { name })" :data-sve-build-class-off="name" @click="takeOff(name)">−</button>
      </span>
    </div>
    <button
      ref="moreBtn"
      type="button"
      class="fg-more"
      style="display: none"
      :aria-expanded="fit.open.value"
      :aria-label="port.t('class_more')"
      :title="port.t('class_more')"
      data-sve-build-class-more
      @click="fit.toggle"
    >⋯ {{ fit.hidden.value }}</button>
    <button type="button" class="fg-target__add" :aria-expanded="open" :disabled="!port.classes.enabled()" :title="port.classes.enabled() ? port.t('class_add') : port.t('tw_utility_no_site_css')" :aria-label="port.t('class_add')" data-sve-build-class-add @click="toggle"><span v-html="ic('plus')"></span></button>
  </div>

  <div v-if="fit.open.value && !target" ref="morePanel" class="fg-classpick" data-sve-build-class-more-list>
    <div class="fg-classpick__rows">
      <span v-for="name in classesOut" :key="name" class="fg-classpick__item">
        <button type="button" :title="port.classes.locked(name) ? port.t('class_locked_title', { name }) : name" :data-sve-build-more-class="name" @click="choose(name)"><span v-if="port.classes.locked(name)" class="fg-target__lock" v-html="ic('lock')"></span>{{ name }}</button>
        <button type="button" class="fg-target__off" :title="port.t('class_take_off', { name })" :aria-label="port.t('class_take_off', { name })" :data-sve-build-more-off="name" @click="takeOff(name)">−</button>
      </span>
    </div>
  </div>

  <div v-if="open" class="fg-classpick" data-sve-build-class-pick>
    <input ref="input" v-model="typed" type="text" spellcheck="false" :placeholder="port.t('class_placeholder')" :aria-label="port.t('class_placeholder')" @keydown.enter.prevent="enter" @keydown.esc.prevent.stop="open = false" />
    <button v-if="canCreate" type="button" class="fg-classpick__new" data-sve-build-class-create @click="create">
      <span v-html="ic('plus')"></span>{{ handing ? port.t('class_create_from', { name: query, n: handing }) : port.t('class_create', { name: query }) }}
    </button>
    <p v-if="problem" class="fg-hint">{{ port.t(`class_${problem}`) }}</p>
    <div v-if="rows.length" class="fg-classpick__rows">
      <button v-for="name in rows" :key="name" type="button" :data-sve-build-class-row="name" @click="pick(name)"><span v-if="port.classes.locked(name)" class="fg-target__lock" v-html="ic('lock')"></span>{{ name }}</button>
    </div>
    <p v-else-if="!query" class="fg-hint">{{ port.t('class_none') }}</p>
  </div>

  <p v-if="target" class="fg-hint fg-target__note" data-sve-build-class-note>
    {{ port.classes.empty() && !port.classes.ownCss() ? port.t('class_empty', { name: target }) : port.t('class_editing', { name: target }) }}
    <template v-if="port.classes.ownCss()"><br />{{ port.t('class_own_css', { name: target }) }}</template>
  </p>
  <p v-else-if="lockedTold && classes.includes(lockedTold)" class="fg-hint" data-sve-build-class-locked-note>
    {{ port.t('class_locked', { name: lockedTold }) }}
  </p>
</template>
