<script setup>
defineProps({
  pins: { type: Array, required: true },
  zIndex: { type: [Number, String], default: 46 },
  onToggle: { type: Function, required: true },
});
</script>

<template>
  <button
    v-for="pin in pins"
    :key="pin.id"
    type="button"
    data-sc-chrome
    :data-sc-pin="pin.id"
    class="sve-comment-pin"
    :class="{ 'is-resolved': pin.resolved }"
    :style="{ left: pin.left + 'px', top: pin.top + 'px', zIndex }"
    @mousedown.stop
    @click.stop="onToggle(pin.id)"
  >
    <span>{{ pin.initials }}</span>
  </button>
</template>

<style scoped>
.sve-comment-pin {
  position: fixed;
  width: 28px;
  height: 28px;
  margin: -6px 0 0 -6px;
  border: 0;
  padding: 0;
  border-radius: 50% 50% 50% 4px;
  transform: rotate(-45deg);
  background: #4530d8;
  color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.28);
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sve-comment-pin.is-resolved {
  background: #64748b;
}
span {
  transform: rotate(45deg);
  font-size: 10px;
  font-weight: 700;
}
</style>
