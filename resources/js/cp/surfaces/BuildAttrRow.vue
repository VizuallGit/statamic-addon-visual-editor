<script setup>
/**
 * One attribute of an element in Build's Content (BuildAttrs.vue): its name
 * after a fixed prefix (`data-`, `aria-`; `role` has no name to type), its value,
 * the data icon that makes the value a field's (`{{ image_position }}`), and a bin.
 *
 * The value is written as it is typed, as Content's text is (build-typed.js). The
 * name is written when it is done — Enter or leaving the box — renamed where it
 * stands in the tag (attrs.js `renameAttribute`); a name the tag already has, or
 * one that is not a name, is said and not written.
 *
 * A draft (`draft`) has no attribute yet: its name, once done, makes one
 * (`create`), empty, and the row that reads it from the file takes over.
 */
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import BuildPickField from './BuildPickField.vue';
import { ic } from '../../build-mode/icons.js';
import { ATTR_NAME } from '../../build-mode/attrs.js';
import { halfTag } from '../../build-mode/text.js';
import { typed } from './build-typed.js';

const props = defineProps({
  path: { type: String, required: true },
  /** The whole name in the file, '' for a draft. */
  name: { type: String, default: '' },
  value: { type: String, default: '' },
  /** What stands fixed before the typed name: 'data-', 'aria-', or '' for role. */
  prefix: { type: String, default: '' },
  draft: { type: Boolean, default: false },
  /** The value box takes focus when the row comes (a name just made). */
  focusValue: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  names: { type: String, default: '' },
  values: { type: String, default: '' },
});

const emit = defineEmits(['create', 'cancel']);

/** What fits in an attribute: one value, printed as text. */
const ATTR_FIELDS = ['text', 'textarea', 'select', 'button_group', 'radio', 'toggle', 'integer', 'float', 'slug', 'color', 'range', 'date', 'hidden'];

const port = inject('sveBuild');
const role = !props.prefix && !props.draft;
const short = (full) => (props.prefix && full.toLowerCase().startsWith(props.prefix) ? full.slice(props.prefix.length) : full);
const nameBox = ref(short(props.name));
const error = ref('');
const nameInput = ref(null);
const valueInput = ref(null);

/* A tag still being typed (`{{ ima`) is not written: half a tag in the file stops the section rendering. */
const value = typed(
  computed(() => (props.draft ? null : props.value)),
  (next) => halfTag(next) || port.setAttrsAt(props.path, { [props.name]: next })
);

/** The name typed, whole, or '' when there is nothing to write. */
function fullName() {
  const typedName = nameBox.value.trim().toLowerCase().replace(new RegExp(`^${props.prefix}`), '');

  return typedName ? props.prefix + typedName : '';
}

function nameDone() {
  const full = fullName();

  if (props.draft) {
    if (!full) {
      emit('cancel');

      return;
    }

    if (!ATTR_NAME.test(full)) {
      error.value = port.t('attrs_bad_name');

      return;
    }

    emit('create', full);

    return;
  }

  if (!full || full === props.name.toLowerCase()) {
    nameBox.value = short(props.name);
    error.value = '';

    return;
  }

  if (!ATTR_NAME.test(full)) {
    error.value = port.t('attrs_bad_name');

    return;
  }

  error.value = port.renameAttrAt(props.path, props.name, full) ? '' : port.t('attrs_taken', { name: full });
}

function pick(anchor) {
  port.pickField(anchor, props.path, ATTR_FIELDS, (expression) => {
    value.done();
    value.value.value = expression;
    port.setAttrsAt(props.path, { [props.name]: expression });
  });
}

function remove() {
  value.done();
  port.setAttrsAt(props.path, { [props.name]: null });
}

onMounted(() =>
  nextTick(() => {
    if (props.draft) {
      nameInput.value?.focus();
    } else if (props.focusValue) {
      valueInput.value?.focus();
    }
  })
);

onBeforeUnmount(() => value.done());
</script>

<template>
  <div class="bm-attr" :data-sve-build-attr="name || 'draft'">
    <div class="bm-attr-row">
      <label v-if="!role" class="bm-attr-name">
        <span v-if="prefix" aria-hidden="true">{{ prefix }}</span>
        <input
          ref="nameInput"
          v-model="nameBox"
          type="text"
          spellcheck="false"
          autocomplete="off"
          :list="names || null"
          :readonly="readonly"
          :aria-label="port.t('attrs_name')"
          :placeholder="port.t('attrs_name')"
          data-sve-build-attr-name
          @input="error = ''"
          @keydown.enter.prevent="nameDone"
          @keydown.escape.prevent="draft ? emit('cancel') : (nameBox = short(name))"
          @blur="nameDone"
        />
      </label>
      <span v-else class="bm-attr-name is-fixed">role</span>
      <div class="bm-text-box bm-attr-value">
        <input
          ref="valueInput"
          v-model="value.value.value"
          class="bm-inp"
          type="text"
          spellcheck="false"
          autocomplete="off"
          :list="values || null"
          :disabled="draft"
          :readonly="readonly"
          :aria-label="port.t('attrs_value')"
          :placeholder="port.t('attrs_value')"
          data-sve-build-attr-value
          @input="value.input"
          @keydown.enter.prevent="value.done"
          @blur="value.done"
        />
        <BuildPickField v-if="!draft && !readonly" @pick="pick" />
      </div>
      <button
        v-if="!readonly"
        type="button"
        class="bm-attr-bin"
        :title="port.t('attrs_remove')"
        :aria-label="port.t('attrs_remove')"
        data-sve-build-attr-remove
        @mousedown.prevent
        @click="draft ? emit('cancel') : remove()"
        v-html="ic('trash')"
      ></button>
    </div>
    <p v-if="error" class="bm-attr-error" data-sve-build-attr-error>{{ error }}</p>
  </div>
</template>
