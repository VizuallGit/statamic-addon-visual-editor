<script setup>
// One on/off row of the ⋮ menu: what it does on the left, a switch on the
// right. Underneath it is a native checkbox (role="switch"), so a click on the
// text flips it and the keyboard reaches it. The tab keeps the value and
// writes it; this only reports.
defineProps({
  label: { type: String, required: true },
  on: { type: Boolean, default: false },
  // A row that belongs to the one above it: indented under it.
  sub: { type: Boolean, default: false },
});

defineEmits(['change']);
</script>

<template>
  <label class="sve-lp-settings__row sve-lp-settings__switch-row" :class="{ 'is-sub': sub }">
    <span class="sve-lp-settings__switch-label">{{ label }}</span>
    <input
      type="checkbox"
      role="switch"
      class="sve-lp-settings__switch"
      :checked="on"
      @change="$emit('change', $event.target.checked)"
    />
  </label>
</template>
