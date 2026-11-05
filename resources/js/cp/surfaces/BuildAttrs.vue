<script setup>
/**
 * An element's own attributes at the bottom of Build's Content, in two lists:
 * Data (`data-*`) and Accessibility (`aria-*` and `role`). As many of each as
 * the element needs; each a row (BuildAttrRow.vue) with its name, its value —
 * typed, or a field's through the data icon (`data-position="{{ image_position }}"`)
 * — and a bin. Read from the tag in the file and written into it by the
 * element's path (port `attrsAt`, `setAttrsAt`, `renameAttrAt`; attrs.js).
 *
 * Alpine's attributes are Action's, a link's aria-label is the link's own box
 * above, and the editor's `data-sve-*` are never shown. A tag with a value
 * written without quotes is shown and not written: changed in the HTML pane.
 *
 * Nothing here reaches the public page but what is typed: no marks of the
 * editor's own are written.
 */
import { computed, inject, ref } from 'vue';
import BuildAttrRow from './BuildAttrRow.vue';
import { ic } from '../../build-mode/icons.js';

const props = defineProps({
  path: { type: String, required: true },
});

const port = inject('sveBuild');
const now = computed(() => port.attrsAt?.(props.path) ?? null);
const aria = computed(() => (now.value?.aria || []).filter((row) => row.name.toLowerCase() !== 'role'));
const role = computed(() => (now.value?.aria || []).find((row) => row.name.toLowerCase() === 'role') || null);
const locked = computed(() => !!now.value?.unreadable);
/** 'data' or 'aria' while a new row is being named. */
const draft = ref('');
/** The attribute whose value takes the caret when its row comes: one just made. */
const fresh = ref('');

const ARIA_NAMES = ['label', 'labelledby', 'describedby', 'hidden', 'expanded', 'controls', 'current', 'live', 'pressed', 'selected', 'haspopup', 'level'];
const ROLES = ['button', 'link', 'navigation', 'region', 'img', 'presentation', 'none', 'list', 'listitem', 'group', 'dialog', 'tablist', 'tab', 'tabpanel', 'banner', 'contentinfo', 'complementary', 'main', 'note', 'status', 'alert'];
const ids = { aria: `sve-build-aria-${props.path}`, role: `sve-build-role-${props.path}` };

function add(group) {
  fresh.value = '';

  if (group === 'role') {
    draft.value = '';
    fresh.value = 'role';
    port.setAttrsAt(props.path, { role: '' }, { end: true });

    return;
  }

  draft.value = group;
}

function create(name) {
  const taken = [...(now.value?.data || []), ...(now.value?.aria || [])].some((row) => row.name.toLowerCase() === name);

  draft.value = '';
  fresh.value = name;

  if (!taken) {
    port.setAttrsAt(props.path, { [name]: '' }, { end: true });
  }
}
</script>

<template>
  <div v-if="now" class="bm-attrs" data-sve-build-attrs>
    <p v-if="locked" class="bm-note is-top" data-sve-build-attrs-locked>{{ port.t('attrs_unquoted') }}</p>

    <section class="bm-attrs-group" data-sve-build-attrs-data>
      <header class="bm-attrs-head">
        <span class="fg-lab">{{ port.t('attrs_data') }}</span>
        <button v-if="!locked" type="button" class="bm-attrs-add" :title="port.t('attrs_add_data')" data-sve-build-attrs-add="data" @mousedown.prevent @click="add('data')">
          <span v-html="ic('plus')"></span>data
        </button>
      </header>
      <BuildAttrRow
        v-for="row in now.data"
        :key="row.name"
        :path="path"
        :name="row.name"
        :value="row.value"
        prefix="data-"
        :focus-value="fresh === row.name.toLowerCase()"
        :readonly="locked"
      />
      <BuildAttrRow v-if="draft === 'data'" key="draft-data" :path="path" prefix="data-" draft @create="create" @cancel="draft = ''" />
    </section>

    <section class="bm-attrs-group" data-sve-build-attrs-aria>
      <header class="bm-attrs-head">
        <span class="fg-lab">{{ port.t('attrs_access') }}</span>
        <span v-if="!locked" class="bm-attrs-adds">
          <button type="button" class="bm-attrs-add" :title="port.t('attrs_add_aria')" data-sve-build-attrs-add="aria" @mousedown.prevent @click="add('aria')">
            <span v-html="ic('plus')"></span>aria
          </button>
          <button v-if="!role" type="button" class="bm-attrs-add" :title="port.t('attrs_add_role')" data-sve-build-attrs-add="role" @mousedown.prevent @click="add('role')">
            <span v-html="ic('plus')"></span>role
          </button>
        </span>
      </header>
      <BuildAttrRow
        v-if="role"
        key="role"
        :path="path"
        name="role"
        :value="role.value"
        :values="ids.role"
        :focus-value="fresh === 'role'"
        :readonly="locked"
      />
      <BuildAttrRow
        v-for="row in aria"
        :key="row.name"
        :path="path"
        :name="row.name"
        :value="row.value"
        prefix="aria-"
        :names="ids.aria"
        :focus-value="fresh === row.name.toLowerCase()"
        :readonly="locked"
      />
      <BuildAttrRow v-if="draft === 'aria'" key="draft-aria" :path="path" prefix="aria-" :names="ids.aria" draft @create="create" @cancel="draft = ''" />
    </section>

    <datalist :id="ids.aria">
      <option v-for="name in ARIA_NAMES" :key="name" :value="name"></option>
    </datalist>
    <datalist :id="ids.role">
      <option v-for="name in ROLES" :key="name" :value="name"></option>
    </datalist>
  </div>
</template>
