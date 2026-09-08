<script setup>
defineProps({
  tools: { type: Array, required: true },
  onTool: { type: Function, required: true },
});
</script>

<template>
  <li
    v-for="tool in tools"
    :key="tool.id"
    :data-sve-css-item="tool.id"
  >
    <button
      type="button"
      :data-sve-css-tool="tool.id"
      :data-tip="tool.title"
      :aria-label="tool.title"
      v-html="tool.icon"
      @click.prevent.stop="onTool(tool.id)"
      @contextmenu.prevent="onTool(tool.id)"
    ></button>
  </li>
</template>
