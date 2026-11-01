<script setup>
/**
 * The classes at the top of Style, shown or hidden with the switch on its line
 * (it starts as Live Preview settings say, build-classes-pref.js): the Tailwind
 * pane's own list, with the site's classes marked (build-mode/class-target.js). A click on a Tailwind
 * class changes it; a click on one of the site's opens it, and the list then
 * shows what is in that class. `New class` turns a click into a choice: the
 * classes chosen go into a class with the name given, and it opens. None
 * chosen is a class to fill from Style. With a class open, what the element has
 * besides it can be moved in, one by one or all at once.
 */
import { computed, inject, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import TwClassList from './TwClassList.vue';
import { ic } from '../../build-mode/icons.js';

const port = inject('sveBuild');
const name = ref('');
const input = ref(null);

const shown = port.classesShown;
const total = computed(() => (port.rev.value, port.pickedClasses().length));
const target = computed(() => (port.rev.value, port.classes.target()));
const picking = computed(() => (port.rev.value, port.classes.picking()));
const count = computed(() => (port.rev.value, port.classes.chosen().length));
const outside = computed(() => (port.rev.value, target.value ? port.classes.outside() : []));
const joinable = computed(() => outside.value.filter((one) => one.joinable).map((one) => one.name));
const allChosen = computed(() => (port.rev.value, port.classes.allChosen()));
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

function toggle() {
  cancel();
  shown.value = !shown.value;
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
  <section class="fg-classes" :class="{ 'is-class': shown && (target || picking) }" data-sve-build-classes>
    <header class="fg-classes__h">
      <span class="fg-classes__name" :title="port.t('classes_note')" :data-sve-build-classes-title="target || undefined">{{ target && shown ? port.t('class_inside', { name: target }) : picking ? port.t('class_new') : port.t('classes') }}</span>
      <span class="fg-classes__count" data-sve-build-classes-count>{{ total }}</span>
      <button type="button" class="bm-switch" role="switch" :aria-checked="shown" :title="port.t('classes_switch')" :aria-label="port.t('classes_switch')" data-sve-build-classes-switch @click="toggle"></button>
      <span v-if="shown && !picking" class="fg-sec__acts">
        <button v-if="!target && port.classes.enabled()" type="button" class="fg-classes__new" data-sve-build-class-new @click="start">{{ port.t('class_new') }}</button>
        <button type="button" class="fg-ib" :title="port.t('classes_sort')" :aria-label="port.t('classes_sort')" data-sve-build-classes-sort @click="port.sortClasses()" v-html="ic('list')"></button>
        <button type="button" class="fg-ib" :title="port.t('classes_add')" :aria-label="port.t('classes_add')" data-sve-build-classes-add @click="port.openAddMenu($event.currentTarget)" v-html="ic('plus')"></button>
      </span>
    </header>

    <template v-if="shown">
      <div v-if="picking" class="fg-classes__line">
        <p class="fg-hint">{{ port.t('class_pick_hint') }}</p>
        <button v-if="port.classes.canChoose()" type="button" class="fg-classes__small" :aria-pressed="allChosen" data-sve-build-class-choose-all @click="port.classes.chooseAll()">{{ port.t('class_choose_all') }}</button>
      </div>
      <TwClassList />

      <div v-if="picking" class="fg-classpick" data-sve-build-class-pick>
        <input ref="input" v-model="name" type="text" spellcheck="false" :placeholder="port.t('class_name_placeholder')" :aria-label="port.t('class_name_placeholder')" @keydown.enter.prevent="create" @keydown.esc.prevent.stop="cancel" />
        <p v-if="problem" class="fg-hint" data-sve-build-class-problem>{{ port.t(`class_${problem}`) }}</p>
        <div class="fg-classpick__acts">
          <button type="button" class="fg-classpick__new" :disabled="!canCreate" data-sve-build-class-create @click="create">{{ createLabel }}</button>
          <button type="button" class="fg-classpick__cancel" data-sve-build-class-cancel @click="cancel">{{ port.t('class_cancel') }}</button>
        </div>
      </div>

      <p v-else-if="lockedTold" class="fg-hint" data-sve-build-class-locked-note>{{ port.t('class_locked', { name: lockedTold }) }}</p>
      <div v-if="outside.length" class="fg-classes__outside" data-sve-build-class-outside>
        <div class="fg-classes__line">
          <p class="fg-hint">{{ port.t('class_outside') }}</p>
          <button v-if="joinable.length" type="button" class="fg-classes__small" data-sve-build-class-take-all @click="port.classes.takeIn(joinable)">{{ port.t('class_take_all') }}</button>
        </div>
        <div class="fg-classes__rest">
          <template v-for="one in outside" :key="one.name">
            <button v-if="one.joinable" type="button" class="fg-classes__take" :title="port.t('class_take_one', { name: one.name, target })" :data-sve-build-class-take="one.name" @click="port.classes.takeIn([one.name])">{{ one.name }}</button>
            <code v-else :title="port.t('class_stays', { name: one.name })">{{ one.name }}</code>
          </template>
        </div>
      </div>
    </template>
  </section>
</template>
