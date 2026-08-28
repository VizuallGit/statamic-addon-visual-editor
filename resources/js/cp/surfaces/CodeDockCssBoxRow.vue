<script setup>
defineProps({
  sides: { type: Array, required: true },
  onSide: { type: Function, required: true },
});
</script>

<template>
  <template v-for="side in sides" :key="side.id">
    <span v-if="side.sep" data-sve-css-sep aria-hidden="true"></span>
    <button
      type="button"
      :data-sve-css-box-side="side.suffix"
      :data-tip="side.title"
      :aria-label="side.title"
      v-html="side.icon"
      @click.prevent.stop="onSide(side.suffix)"
    ></button>
  </template>
</template>
