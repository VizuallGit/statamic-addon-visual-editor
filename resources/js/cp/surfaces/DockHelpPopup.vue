<script setup>
// Help mode's popup at the caret: at most three suggestions, the marked one
// taken with Tab or Enter. The keys belong to the editor — the popup only
// shows which row is marked and takes a click. A mousedown never moves focus
// out of the editor, so the caret stays where the suggestion goes.
defineProps({
  title: { type: String, default: '' },
  closeLabel: { type: String, default: '' },
  // [{ id, label, meta }]
  items: { type: Array, default: () => [] },
  active: { type: Number, default: 0 },
  onAccept: { type: Function, required: true },
  onHover: { type: Function, default: null },
});
</script>

<template>
  <div data-sve-help-popup role="listbox" :aria-label="title">
    <div data-sve-help-head>
      <span>{{ title }}</span>
      <span>{{ closeLabel }}</span>
    </div>
    <button
      v-for="(item, index) in items"
      :key="item.id"
      type="button"
      role="option"
      data-sve-help-option
      :aria-selected="index === active ? 'true' : 'false'"
      :data-active="index === active ? '' : undefined"
      @mousedown.prevent
      @mouseenter="onHover && onHover(index)"
      @click.prevent.stop="onAccept(index)"
    >
      <span data-sve-help-label>{{ item.label }}</span>
      <span v-if="item.meta" data-sve-help-meta>{{ item.meta }}</span>
      <kbd v-if="index === active" data-sve-help-key>Tab</kbd>
    </button>
  </div>
</template>
