<script setup>
/**
 * A component's category and description, from the head of the Build panel.
 *
 * Each box writes when it is left: no draft and no Save, as the props beside it.
 * The categories offered are the ones the site's components already have, and
 * typing a new one makes it.
 */
import { inject, ref } from 'vue';

const props = defineProps({
  name: { type: String, required: true },
  locked: { type: Boolean, default: false },
});

const port = inject('sveBuild');
const category = ref('');
const description = ref('');
const categories = ref([]);
const loaded = ref(false);

port.components().then(
  (items) => {
    const mine = items.find((item) => item.name === props.name);

    category.value = mine?.category || '';
    description.value = mine?.description || '';
    categories.value = [...new Set(items.map((item) => item.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    loaded.value = true;
  },
  () => {}
);

async function save() {
  const saved = await port.saveComponentMeta(props.name, { category: category.value, description: description.value });

  if (saved) {
    category.value = saved.category;
    description.value = saved.description;
  }
}
</script>

<template>
  <div class="bm-cinfo">
    <label>
      {{ port.t('component_category') }}
      <input
        v-model="category"
        type="text"
        list="sve-build-categories"
        data-sve-build-category
        :placeholder="port.t('component_category_placeholder')"
        :disabled="locked || !loaded"
        @change="save"
      />
      <datalist id="sve-build-categories">
        <option v-for="option in categories" :key="option" :value="option"></option>
      </datalist>
    </label>
    <label>
      {{ port.t('component_description') }}
      <textarea
        v-model="description"
        data-sve-build-description
        :placeholder="port.t('component_description_placeholder')"
        :disabled="locked || !loaded"
        @change="save"
      ></textarea>
    </label>
  </div>
</template>
