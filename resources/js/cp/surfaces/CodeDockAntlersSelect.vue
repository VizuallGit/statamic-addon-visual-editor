<script setup>
const props = defineProps({
  label: { type: String, required: true },
  groups: { type: Array, required: true },
  onPick: { type: Function, required: true },
});

function pick(event) {
  const id = event.target.value;

  event.target.value = '';

  if (id) {
    props.onPick(id);
  }
}
</script>

<template>
  <select data-sve-antlers-select :aria-label="label" @change="pick">
    <option value="">{{ label }}</option>
    <optgroup v-for="group in groups" :key="group.id" :label="group.label">
      <option v-for="item in group.items" :key="item.id" :value="item.id">{{ item.label }}</option>
    </optgroup>
  </select>
</template>
