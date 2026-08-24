<script setup>
defineProps({
  tools: { type: Array, required: true },
  extras: { type: Array, default: () => [] },
  onTool: { type: Function, required: true },
});
</script>

<template>
  <template v-for="(tool, i) in tools" :key="tool.id">
    <button
      type="button"
      :data-sve-css-tool="tool.id"
      :data-tip="tool.title"
      :aria-label="tool.title"
      v-html="tool.icon"
      @click.prevent.stop="onTool(tool.id)"
      @contextmenu.prevent="onTool(tool.id)"
    ></button>
    <div v-if="tool.id === 'flex-col'" data-sve-css-flex-extras>
      <span data-sve-css-sep aria-hidden="true"></span>
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
      <span data-sve-css-sep aria-hidden="true"></span>
    </div>
  </template>
</template>
