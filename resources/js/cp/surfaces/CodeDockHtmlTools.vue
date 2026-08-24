<script setup>
defineProps({
  tools: { type: Array, required: true },
  onTool: { type: Function, required: true },
});
</script>

<template>
  <button
    v-for="tool in tools"
    :key="tool.id"
    type="button"
    :data-sve-html-tool="tool.id"
    :data-tip="tool.title"
    :aria-label="tool.title"
    :data-letter="tool.letter ? '' : undefined"
    @click.prevent.stop="onTool(tool.id)"
    @contextmenu.prevent="onTool(tool.id)"
  >
    <template v-if="tool.letter">{{ tool.letter }}</template>
    <span v-else v-html="tool.icon"></span>
  </button>
</template>
