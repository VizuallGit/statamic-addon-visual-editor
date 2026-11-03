<script setup>
/**
 * A family's fields from STYLE_FIELDS (catalog.js), two to a row with the
 * label above each, in the shape each one is: a scale, a list, a utility,
 * buttons or a colour. BuildStyle.vue hands in the ones that stand: in front,
 * or under the family's More.
 */
import BuildBgImage from './BuildBgImage.vue';
import BuildClassField from './BuildClassField.vue';
import BuildClassSeg from './BuildClassSeg.vue';
import BuildColorField from './BuildColorField.vue';
import BuildValueInput from './BuildValueInput.vue';

defineProps({
  fields: { type: Array, required: true },
  path: { type: String, default: '' },
});
</script>

<template>
  <div v-if="fields.length" class="fg-grid">
    <div v-for="field in fields" :key="field.label" class="fg-cell" :class="{ 'is-wide': field.wide }">
      <div v-if="!field.seg" class="fg-lab">{{ field.label }}</div>
      <BuildBgImage v-if="field.image" :field="field" :path="path" />
      <BuildClassSeg v-else-if="field.seg" :field="field" />
      <BuildColorField v-else-if="field.color" :tool="field" />
      <BuildClassField v-else-if="!field.css" :field="field" />
      <label v-else class="fg-field">
        <BuildValueInput :tool="field" :label="field.label" :typed="!field.named" compact />
      </label>
    </div>
  </div>
</template>
