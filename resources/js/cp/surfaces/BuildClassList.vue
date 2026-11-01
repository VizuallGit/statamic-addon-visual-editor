<script setup>
/**
 * The classes at the top of Style, shown or hidden with the switch on its line
 * (it starts as Live Preview settings say, build-classes-pref.js): the Tailwind
 * pane's own list, with the site's classes marked (dock/class-target.js). A click on a Tailwind
 * class changes it; a click on one of the site's opens it, and the list then
 * shows what is in that class. `New class` turns a click into a choice: the
 * classes chosen go into a class with the name given, and it opens. None
 * chosen is a class to fill from Style. With a class open, what the element has
 * besides it can be moved in, one by one or all at once. The form and the
 * moving-in are TwClassPick.vue, the same as the dock's.
 */
import { computed, inject, onBeforeUnmount } from 'vue';
import TwClassList from './TwClassList.vue';
import TwClassPick from './TwClassPick.vue';
import { ic } from '../../build-mode/icons.js';

const port = inject('sveBuild');

const shown = port.classesShown;
const total = computed(() => (port.rev.value, port.pickedClasses().length));
const target = computed(() => (port.rev.value, port.classes.target()));
const picking = computed(() => (port.rev.value, port.classes.picking()));

function start() {
  port.classes.startPicking('style');
}

function cancel() {
  port.classes.stopPicking();
}

function toggle() {
  cancel();
  shown.value = !shown.value;
}

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
      <TwClassPick part="line" :classes="port.classes" :t="port.t" />
      <TwClassList />
      <TwClassPick part="foot" who="style" :classes="port.classes" :t="port.t" />
    </template>
  </section>
</template>
