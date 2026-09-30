<script setup>
defineProps({
  items: { type: Array, required: true },
  top: { type: Number, required: true },
  left: { type: Number, required: true },
  onPick: { type: Function, required: true },
});
</script>

<template>
  <div class="sve-lv-menu" :style="{ top: top + 'px', left: left + 'px' }">
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      :class="{ 'is-danger': item.danger }"
      @click="onPick(item.id)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<style scoped>
.sve-lv-menu {
  position: fixed;
  width: 180px;
  z-index: 99999;
  padding: 4px;
  border-radius: 8px;
  background: var(--theme-color-content-bg, #fff);
  color: currentColor;
  border: 1px solid rgba(128, 128, 128, 0.3);
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 13px;
}
button {
  all: unset;
  display: block;
  box-sizing: border-box;
  width: 100%;
  padding: 7px 10px;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background: rgba(128, 128, 128, 0.16);
}
button.is-danger {
  color: #e5484d;
}
</style>
