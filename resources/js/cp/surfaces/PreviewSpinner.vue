<script setup>
defineProps({
  spinner: { type: String, required: true },
});
</script>

<template>
  <span class="sve-spinner-chip" v-html="spinner"></span>
</template>
