<script setup>
/**
 * "Editable in Edit Content" under an element's text, image or address in
 * Build's Content. On, what the element holds becomes a field of its section,
 * with its value per page and a content editor's way to it (`port.makeField`);
 * the parent writes the tag. Off, the parent writes the value back as the
 * element's own, and the field stays: pages may hold values in it.
 *
 * An element whose content is already its section's own (`hidden`: a field
 * kept out of Edit Content, BuildOwn.vue) has its field: on shows that one,
 * under the name typed here, rather than making a second — a second would
 * leave every other section's content behind in the first. The parent hears
 * `shown`.
 */
import { inject, nextTick, ref } from 'vue';

const props = defineProps({
  path: { type: String, required: true },
  kind: { type: String, required: true }, // SectionTypeMaker\AddField::KINDS
  suggest: { type: String, required: true },
  value: { type: String, default: '' },
  own: { type: String, default: '' }, // the field it holds now, shown in Edit Content
  hidden: { type: String, default: '' }, // the field it holds now, kept out of Edit Content
});
const emit = defineEmits(['made', 'shown', 'off']);

const port = inject('sveBuild');
const naming = ref(false);
const name = ref(props.suggest);
const failed = ref(false);
const busy = ref(false);
const input = ref(null);

function flip() {
  failed.value = false;

  if (props.own) {
    emit('off');

    return;
  }

  naming.value = !naming.value;

  if (naming.value) {
    nextTick(() => input.value?.select());
  }
}

async function make() {
  if (busy.value) {
    return;
  }

  busy.value = true;

  if (props.hidden) {
    const shown = await port.setFieldHidden(props.hidden, false, name.value.trim());

    busy.value = false;
    failed.value = !shown;

    if (shown) {
      naming.value = false;
      emit('shown', props.hidden);
    }

    return;
  }

  const handle = await port.makeField(props.path, { kind: props.kind, name: name.value, value: props.value });

  busy.value = false;
  failed.value = !handle;

  if (handle) {
    naming.value = false;
    emit('made', handle);
  }
}
</script>

<template>
  <div class="bm-editable" data-sve-build-editable>
    <div class="bm-link-row">
      <span>{{ port.t('content_editable') }}</span>
      <button
        type="button"
        class="bm-switch"
        role="switch"
        :aria-checked="!!own || naming"
        :aria-label="port.t('content_editable')"
        data-sve-build-editable-switch
        @click="flip"
      ></button>
    </div>
    <div v-if="naming" class="bm-editable-name">
      <input
        ref="input"
        v-model="name"
        class="bm-inp"
        type="text"
        spellcheck="false"
        :aria-label="port.t('content_editable_name')"
        data-sve-build-editable-name
        @keydown.enter.prevent="make"
      />
      <button type="button" class="bm-remove-file" :disabled="busy" data-sve-build-editable-make @click="make">{{
        port.t('content_editable_make')
      }}</button>
    </div>
    <p v-if="failed" class="bm-note" data-sve-build-editable-failed>{{ port.t('content_editable_failed') }}</p>
  </div>
</template>
