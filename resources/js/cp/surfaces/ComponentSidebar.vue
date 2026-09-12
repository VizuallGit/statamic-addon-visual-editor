<script setup>
/**
 * The left column while a component is in play.
 *
 * Two things can put it there. Inside a component, it says which one and
 * offers the way back out, and lists the fields the component declares.
 * Standing on a component's row in the tree, it shows the values *that place*
 * gives it — because that is a set of input fields, and every other set of
 * input fields in Live Preview is in this column.
 *
 * The section's own fields step aside while either is up, and come back when
 * neither is.
 */
import ComponentPropsPane from './ComponentPropsPane.vue';
import PropValues from './PropValues.vue';
import { componentPropsUi as ui } from '../component-props/store.js';

const MARK =
  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="m12 2.8 8 4.6v9.2l-8 4.6-8-4.6V7.4z"/><path d="m12 12 8-4.6M12 12v9.2M12 12 4 7.4"/></svg>';
</script>

<template>
  <div class="sve-csb">
    <div v-if="ui.open || ui.callOpen" class="sve-csb__head">
      <span class="sve-csb__mark" v-html="MARK"></span>
      <span class="sve-csb__name" :title="ui.open ? ui.name : ui.callTitle">
        {{ ui.open ? ui.name : ui.callTitle }}
      </span>
      <button
        v-if="ui.exitOpen"
        type="button"
        class="sve-csb__exit"
        :title="ui.exitTitle"
        @click="ui.onExit?.()"
      >{{ ui.exitLabel }}</button>
    </div>

    <div class="sve-csb__body">
      <!-- What this place gives the component wins while a row is picked: it is
           the more specific of the two, and the one just clicked. -->
      <div v-if="ui.callOpen && ui.callStore" class="sve-csb__values">
        <PropValues :store="ui.callStore" />
      </div>
      <ComponentPropsPane v-else />
    </div>
  </div>
</template>

<style scoped>
.sve-csb {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.sve-csb__head {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .75rem 0 .625rem;
  border-bottom: 1px solid rgba(128, 128, 128, .25);
}
.sve-csb__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 1.65em;
  height: 1.65em;
  border-radius: .4rem;
  background: rgba(56, 88, 233, .28);
  color: #93a6f7;
}
.sve-csb__name {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: .875rem;
  font-weight: 600;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
/* The way out is a button and not a link: it saves on the way, which is a
   thing that happens rather than a place to go. */
.sve-csb__exit {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  padding: .3em .7em;
  border-radius: .3rem;
  border: 1px solid rgba(128, 128, 128, .35);
  font-size: .75rem;
  font-family: ui-sans-serif, system-ui, sans-serif;
  line-height: 1.4;
}
.sve-csb__exit:hover {
  background: rgba(128, 128, 128, .2);
}
.sve-csb__body {
  flex: 1 1 auto;
  min-height: 0;
}
.sve-csb__values {
  padding: .625rem 0 .75rem;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
</style>
