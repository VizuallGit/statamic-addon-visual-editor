<script setup>
defineProps({
  items: { type: Array, required: true },
  extras: { type: Array, default: () => [] },
  onTool: { type: Function, required: true },
});
</script>

<template>
  <template v-for="item in items" :key="item.id">
    <span v-if="item.sep" data-sve-css-sep aria-hidden="true"></span>
    <button
      type="button"
      :data-sve-css-tool="item.id"
      :data-tip="item.title"
      :aria-label="item.title"
      v-html="item.icon"
      @click.prevent.stop="onTool(item.id)"
      @contextmenu.prevent="onTool(item.id)"
    ></button>
  </template>
  <div data-sve-css-flex-extras>
    <template v-for="extra in extras" :key="extra.id">
      <span v-if="extra.sep" data-sve-css-sep aria-hidden="true"></span>
      <button
        type="button"
        :data-sve-css-tool="extra.id"
        :data-tip="extra.title"
        :aria-label="extra.title"
        v-html="extra.icon"
        @click.prevent.stop="onTool(extra.id)"
        @contextmenu.prevent="onTool(extra.id)"
      ></button>
    </template>
  </div>
</template>
