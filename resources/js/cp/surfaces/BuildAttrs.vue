<script setup>
/**
 * An element's own attributes at the bottom of Build's Content, in three lists:
 * Data (`data-*`), Aria (`aria-*`) and Role (one `role`). As many data and aria
 * as the element needs; each a row (BuildAttrRow.vue) with its name, its value —
 * typed, or a field's through the data icon (`data-position="{{ image_position }}"`)
 * — and a bin. Read from the tag in the file and written into it by the
 * element's path (port `attrsAt`, `setAttrsAt`, `renameAttrAt`; attrs.js).
 *
 * Above them, Auto contrast: a switch that writes `data-auto-contrast` bare on
 * the tag, or takes it off — the site's script then gives the text the colour
 * its background needs. It is not a row of Data. Written inside an Antlers
 * condition of the tag, the page decides, and the switch only says so. It is
 * offered on boxes (attrs.js `contrastFits`: a div, a section …), not on a
 * heading or an image; one that has it already keeps the switch to take it off.
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
import { AUTO_CONTRAST, contrastFits } from '../../build-mode/attrs.js';

const props = defineProps({
  path: { type: String, required: true },
  /** The element's tag: auto contrast is offered on boxes. */
  tag: { type: String, default: '' },
});

const port = inject('sveBuild');
const now = computed(() => port.attrsAt?.(props.path) ?? null);
const aria = computed(() => (now.value?.aria || []).filter((row) => row.name.toLowerCase() !== 'role'));
const role = computed(() => (now.value?.aria || []).find((row) => row.name.toLowerCase() === 'role') || null);
const locked = computed(() => !!now.value?.unreadable);
const contrast = computed(() => now.value?.contrast || { on: false, conditional: false });
const contrastShown = computed(() => contrast.value.on || contrastFits(props.tag));
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
  draft.value = '';

  // Typed as a Data row, auto contrast is the switch above: it goes on, bare.
  if (name === AUTO_CONTRAST) {
    if (!contrast.value.on) {
      port.setAttrsAt(props.path, { [AUTO_CONTRAST]: true }, { end: true });
    }

    return;
  }

  const taken = [...(now.value?.data || []), ...(now.value?.aria || [])].some((row) => row.name.toLowerCase() === name);

  fresh.value = name;

  if (!taken) {
    port.setAttrsAt(props.path, { [name]: '' }, { end: true });
  }
}

function toggleContrast() {
  port.setAttrsAt(props.path, { [AUTO_CONTRAST]: contrast.value.on ? null : true }, { end: true });
}
</script>

<template>
  <div v-if="now" class="bm-attrs" data-sve-build-attrs>
    <p v-if="locked" class="bm-note is-top" data-sve-build-attrs-locked>{{ port.t('attrs_unquoted') }}</p>

    <section v-if="contrastShown" class="bm-attrs-group" data-sve-build-contrast>
      <header class="bm-attrs-head">
        <span class="fg-lab">{{ port.t('attrs_contrast') }}</span>
        <button
          type="button"
          class="bm-switch"
          role="switch"
          :aria-checked="contrast.on"
          :aria-label="port.t('attrs_contrast')"
          :disabled="locked || contrast.conditional"
          data-sve-build-contrast-switch
          @click="toggleContrast"
        ></button>
      </header>
      <p class="fg-hint">{{ port.t(contrast.conditional ? 'attrs_contrast_condition' : 'attrs_contrast_hint') }}</p>
    </section>

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
        <span class="fg-lab">{{ port.t('attrs_aria') }}</span>
        <button v-if="!locked" type="button" class="bm-attrs-add" :title="port.t('attrs_add_aria')" data-sve-build-attrs-add="aria" @mousedown.prevent @click="add('aria')">
          <span v-html="ic('plus')"></span>aria
        </button>
      </header>
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

    <section class="bm-attrs-group" data-sve-build-attrs-role>
      <header class="bm-attrs-head">
        <span class="fg-lab">{{ port.t('attrs_role') }}</span>
        <button v-if="!locked && !role" type="button" class="bm-attrs-add" :title="port.t('attrs_add_role')" data-sve-build-attrs-add="role" @mousedown.prevent @click="add('role')">
          <span v-html="ic('plus')"></span>role
        </button>
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
    </section>

    <datalist :id="ids.aria">
      <option v-for="name in ARIA_NAMES" :key="name" :value="name"></option>
    </datalist>
    <datalist :id="ids.role">
      <option v-for="name in ROLES" :key="name" :value="name"></option>
    </datalist>
  </div>
</template>
