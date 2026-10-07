<template>
  <div class="sve-fontdlg-overlay" @mousedown.self="requestClose">
    <div class="sve-theme sve-bs" role="dialog" aria-modal="true" :aria-label="t('bard_styles_title')" data-sve-bard-styles>
      <header class="sve-fontdlg__head">
        <span class="sve-fontdlg__title">{{ t('bard_styles_title') }}</span>
        <!-- data-sve-close: ours, so the hider for Statamic's own Live Preview × leaves it alone. -->
        <button type="button" class="sve-theme__ghost" data-sve-close :title="t('close')" @click="requestClose">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </header>

      <nav class="sve-theme__segments sve-bs__tabs" role="tablist">
        <button
          v-for="key in TABS"
          :key="key"
          type="button"
          role="tab"
          :class="{ 'is-on': tab === key }"
          :aria-selected="tab === key"
          :data-sve-bs-tab="key"
          @click="pickTab(key)"
        >{{ t(`bard_styles_tab_${key}`) }}<span class="sve-bs__count">{{ key === 'styles' ? styles.length : groups.length }}</span></button>
      </nav>

      <p v-if="state === 'loading'" class="sve-bs__state">{{ t('bard_styles_loading') }}</p>
      <p v-else-if="state === 'failed'" class="sve-bs__state is-bad">{{ t('bard_styles_load_failed') }}</p>

      <div v-else class="sve-bs__main">
        <aside class="sve-bs__list">
          <button v-if="canEdit" type="button" class="sve-theme__add" data-sve-bs-add @click="add">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
            {{ tab === 'styles' ? t('bard_styles_add_style') : t('bard_styles_add_group') }}
          </button>
          <p v-if="source === 'config' && !dirty" class="sve-theme__hint">{{ t('bard_styles_source_config') }}</p>

          <div class="sve-bs__rows" role="listbox" :aria-label="t(`bard_styles_tab_${tab}`)">
            <div
              v-for="(item, index) in items"
              :key="item.key"
              class="sve-bs__row"
              :class="{ 'is-on': item.key === selectedKey, 'is-bad': hasProblems(item) }"
              role="option"
              :aria-selected="item.key === selectedKey"
              :data-sve-bs-row="item.handle"
              @click="selectedKey = item.key"
            >
              <span class="sve-bs__badge" aria-hidden="true">
                <span v-if="identIsSvg(item.ident) && identOk(item.ident)" class="sve-bs__svg" v-html="item.ident" />
                <template v-else>{{ item.ident || '?' }}</template>
              </span>
              <span class="sve-bs__row-text">
                <span class="sve-bs__row-name">{{ item.name || t('bard_styles_untitled') }}</span>
                <span class="sve-bs__row-meta">{{ rowMeta(item) }}</span>
              </span>
              <span v-if="canEdit" class="sve-bs__move">
                <button type="button" :disabled="index === 0" :title="t('bard_styles_move_up')" @click.stop="move(index, -1)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>
                </button>
                <button type="button" :disabled="index === items.length - 1" :title="t('bard_styles_move_down')" @click.stop="move(index, 1)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
                </button>
              </span>
            </div>
            <p v-if="!items.length" class="sve-theme__empty">{{ tab === 'styles' ? t('bard_styles_none') : t('bard_styles_no_groups') }}</p>
          </div>
        </aside>

        <section v-if="current && tab === 'styles'" class="sve-bs__form" :data-sve-bs-form="current.handle">
          <div class="sve-theme__field">
            <label class="sve-theme__label" for="sve-bs-name">{{ t('bard_styles_name') }}</label>
            <div class="sve-theme__input" :class="{ 'is-bad': problems.name }">
              <input id="sve-bs-name" v-model="current.name" data-sve-bs-field="name" :readonly="!canEdit" @input="nameChanged(current, '_')" />
            </div>
          </div>
          <p v-if="problems.name" class="sve-theme__problem">{{ err(problems.name) }}</p>

          <div class="sve-theme__field">
            <label class="sve-theme__label" for="sve-bs-handle">{{ t('bard_styles_handle') }}</label>
            <div class="sve-theme__input" :class="{ 'is-bad': problems.handle }">
              <input id="sve-bs-handle" v-model="current.handle" data-sve-bs-field="handle" :readonly="current.saved || !canEdit" spellcheck="false" @input="current.handleTouched = true" />
            </div>
          </div>
          <p v-if="problems.handle" class="sve-theme__problem">{{ err(problems.handle) }}</p>
          <p v-else-if="current.saved" class="sve-bs__hint">{{ t('bard_styles_handle_locked') }}</p>

          <div class="sve-theme__field">
            <span class="sve-theme__label">{{ t('bard_styles_type') }}</span>
            <div class="sve-theme__segments" role="radiogroup">
              <button
                v-for="type in STYLE_TYPES"
                :key="type"
                type="button"
                role="radio"
                :class="{ 'is-on': current.type === type }"
                :aria-checked="current.type === type"
                :data-sve-bs-type="type"
                :disabled="!canEdit"
                @click="setType(current, type)"
              >{{ t(`bard_styles_type_${type}`) }}</button>
            </div>
          </div>
          <p class="sve-bs__hint">{{ t(`bard_styles_type_${current.type}_hint`) }}</p>

          <template v-if="current.type === 'span'">
            <div class="sve-theme__field">
              <label class="sve-theme__label" for="sve-bs-prop">{{ t('bard_styles_prop') }}</label>
              <div class="sve-theme__input" :class="{ 'is-bad': problems.prop }">
                <input id="sve-bs-prop" v-model="current.prop" list="sve-bs-props" data-sve-bs-field="prop" spellcheck="false" :readonly="!canEdit" :placeholder="'font-size'" />
              </div>
            </div>
            <p v-if="problems.prop" class="sve-theme__problem">{{ err(problems.prop) }}</p>

            <div class="sve-theme__field">
              <label class="sve-theme__label" for="sve-bs-value">{{ t('bard_styles_value') }}</label>
              <div class="sve-theme__input" :class="{ 'is-bad': problems.value }">
                <input id="sve-bs-value" v-model="current.value" list="sve-bs-values" data-sve-bs-field="value" spellcheck="false" :readonly="!canEdit" :placeholder="'var(--size-500)'" />
              </div>
            </div>
            <p v-if="problems.value" class="sve-theme__problem">{{ err(problems.value) }}</p>

            <div class="sve-theme__field">
              <span class="sve-theme__label">{{ t('bard_styles_target') }}</span>
              <div class="sve-theme__segments" role="radiogroup">
                <button
                  v-for="target in ['', 'block']"
                  :key="target || 'text'"
                  type="button"
                  role="radio"
                  :class="{ 'is-on': current.target === target }"
                  :aria-checked="current.target === target"
                  :data-sve-bs-target="target || 'text'"
                  :disabled="!canEdit"
                  @click="current.target = target"
                >{{ t(target ? 'bard_styles_target_block' : 'bard_styles_target_text') }}</button>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="sve-theme__field">
              <label class="sve-theme__label" for="sve-bs-class">{{ t('bard_styles_class') }}</label>
              <div class="sve-theme__input" :class="{ 'is-bad': problems.class }">
                <input id="sve-bs-class" v-model="current.class" data-sve-bs-field="class" spellcheck="false" :readonly="!canEdit" />
              </div>
            </div>
            <p v-if="problems.class" class="sve-theme__problem">{{ err(problems.class) }}</p>

            <div class="sve-theme__field">
              <label class="sve-theme__label" for="sve-bs-css">{{ t('bard_styles_cp_css') }}</label>
              <div class="sve-theme__input" :class="{ 'is-bad': problems.cp_css }">
                <input id="sve-bs-css" v-model="current.cp_css" data-sve-bs-field="cp_css" spellcheck="false" :readonly="!canEdit" :placeholder="'text-transform: uppercase; letter-spacing: 0.1em'" />
              </div>
            </div>
            <p v-if="problems.cp_css" class="sve-theme__problem">{{ err(problems.cp_css) }}</p>
            <p v-else class="sve-bs__hint">{{ t('bard_styles_class_hint') }}</p>
          </template>

          <div class="sve-theme__field">
            <label class="sve-theme__label" for="sve-bs-ident">{{ t('bard_styles_ident') }}</label>
            <div class="sve-theme__input" :class="{ 'is-bad': problems.ident }">
              <input id="sve-bs-ident" v-model="current.ident" data-sve-bs-field="ident" spellcheck="false" :readonly="!canEdit" @input="current.identTouched = true" />
            </div>
          </div>
          <p v-if="problems.ident" class="sve-theme__problem">{{ err(problems.ident) }}</p>
          <p v-else class="sve-bs__hint">{{ t('bard_styles_ident_hint') }}</p>

          <div class="sve-theme__field">
            <label class="sve-theme__label" for="sve-bs-group">{{ t('bard_styles_group') }}</label>
            <div class="sve-theme__input" :class="{ 'is-bad': problems.group }">
              <select id="sve-bs-group" v-model="current.group" data-sve-bs-field="group" :disabled="!canEdit || current.type === 'div'">
                <option value="">{{ t('bard_styles_group_none') }}</option>
                <option v-for="group in groups" :key="group.key" :value="group.handle">{{ group.name || group.handle }}</option>
              </select>
              <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
          <p v-if="problems.group" class="sve-theme__problem">{{ err(problems.group) }}</p>
          <p v-else-if="current.type === 'div'" class="sve-bs__hint">{{ t('bard_styles_group_div') }}</p>

          <div class="sve-bs__preview-wrap">
            <span class="sve-theme__label">{{ t('bard_styles_preview') }}</span>
            <div class="sve-bs__preview" data-sve-bs-preview>
              <template v-if="current.type === 'span' && current.target !== 'block'">
                <p>{{ t('bard_styles_sample_before') }} <span :style="currentCss" data-sve-bs-sample>{{ t('bard_styles_sample_marked') }}</span> {{ t('bard_styles_sample_after') }}</p>
              </template>
              <template v-else-if="current.type === 'span'">
                <p>{{ t('bard_styles_sample_paragraph') }}</p>
                <p :style="currentCss" data-sve-bs-sample>{{ t('bard_styles_sample_paragraph') }}</p>
              </template>
              <template v-else-if="current.type === 'paragraph'">
                <p :style="currentCss" data-sve-bs-sample>{{ t('bard_styles_sample_title') }}</p>
                <p>{{ t('bard_styles_sample_paragraph') }}</p>
              </template>
              <div v-else :style="currentCss" data-sve-bs-sample>
                <p>{{ t('bard_styles_sample_paragraph') }}</p>
                <p>{{ t('bard_styles_sample_paragraph') }}</p>
              </div>
            </div>
            <p v-if="current.saved" class="sve-bs__hint sve-bs__hint--flush">{{ t('bard_styles_existing_text') }}</p>
          </div>

          <button v-if="canEdit" type="button" class="sve-bs__delete" data-sve-bs-delete @click="remove">{{ t('bard_styles_delete_style') }}</button>
        </section>

        <section v-else-if="current" class="sve-bs__form" :data-sve-bs-form="current.handle">
          <div class="sve-theme__field">
            <label class="sve-theme__label" for="sve-bs-gname">{{ t('bard_styles_name') }}</label>
            <div class="sve-theme__input" :class="{ 'is-bad': problems.name }">
              <input id="sve-bs-gname" v-model="current.name" data-sve-bs-field="name" :readonly="!canEdit" @input="nameChanged(current, '-')" />
            </div>
          </div>
          <p v-if="problems.name" class="sve-theme__problem">{{ err(problems.name) }}</p>

          <div class="sve-theme__field">
            <label class="sve-theme__label" for="sve-bs-ghandle">{{ t('bard_styles_handle') }}</label>
            <div class="sve-theme__input" :class="{ 'is-bad': problems.handle }">
              <input id="sve-bs-ghandle" v-model="current.handle" data-sve-bs-field="handle" :readonly="current.saved || !canEdit" spellcheck="false" @input="current.handleTouched = true" />
            </div>
          </div>
          <p v-if="problems.handle" class="sve-theme__problem">{{ err(problems.handle) }}</p>
          <p v-else-if="current.saved" class="sve-bs__hint">{{ t('bard_styles_handle_locked') }}</p>

          <div class="sve-theme__field">
            <label class="sve-theme__label" for="sve-bs-gident">{{ t('bard_styles_ident') }}</label>
            <div class="sve-theme__input" :class="{ 'is-bad': problems.ident }">
              <input id="sve-bs-gident" v-model="current.ident" data-sve-bs-field="ident" spellcheck="false" :readonly="!canEdit" @input="current.identTouched = true" />
            </div>
          </div>
          <p v-if="problems.ident" class="sve-theme__problem">{{ err(problems.ident) }}</p>
          <p v-else class="sve-bs__hint">{{ t('bard_styles_group_hint') }}</p>

          <div class="sve-theme__field sve-bs__field--top">
            <span class="sve-theme__label">{{ t('bard_styles_group_members') }}</span>
            <div class="sve-bs__chips">
              <button v-for="style in members" :key="style.key" type="button" class="sve-bs__chip" @click="showStyle(style)">{{ style.name || style.handle }}</button>
              <span v-if="!members.length" class="sve-theme__hint">{{ t('bard_styles_group_empty') }}</span>
            </div>
          </div>

          <button v-if="canEdit" type="button" class="sve-bs__delete" data-sve-bs-delete @click="remove">{{ t('bard_styles_delete_group') }}</button>
          <p v-if="canEdit && members.length" class="sve-bs__hint sve-bs__hint--flush">{{ t('bard_styles_delete_group_hint') }}</p>
        </section>

        <section v-else class="sve-bs__form">
          <p class="sve-theme__hint">{{ t('bard_styles_pick') }}</p>
        </section>
      </div>

      <footer class="sve-bs__foot">
        <span class="sve-bs__status" :class="{ 'is-bad': statusBad }" data-sve-bs-status>{{ status }}</span>
        <button v-if="savedOnce && !dirty" type="button" class="sve-theme__add" data-sve-bs-reload @click="reload">{{ t('bard_styles_reload') }}</button>
        <button v-if="canEdit" type="button" class="sve-theme__save" data-sve-bs-save :disabled="!dirty || saving" @click="saveAll">{{ saving ? t('bard_styles_saving') : t('bard_styles_save') }}</button>
      </footer>

      <datalist id="sve-bs-props">
        <option v-for="prop in PROPS" :key="prop" :value="prop" />
      </datalist>
      <datalist id="sve-bs-values">
        <option v-for="value in suggestions" :key="value" :value="value" />
      </datalist>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import '../theme-panel/theme-panel.css';
import '../bard-styles/bard-styles.css';
import {
  PROPS,
  STYLE_TYPES,
  groupForSave,
  groupProblems,
  identFrom,
  identIsSvg,
  identOk,
  previewCss,
  slug,
  styleForSave,
  styleProblems,
  valueSuggestions,
} from '../bard-styles/model.js';

const TABS = ['styles', 'groups'];

const props = defineProps({
  win: { type: Object, required: true },
  t: { type: Function, required: true },
  /** () => Promise<{ ok, status, data }> — GET {cp}/bard-style/styles */
  load: { type: Function, required: true },
  /** (payload) => Promise<{ ok, status, data }> — PUT the same */
  save: { type: Function, required: true },
  /** () => Promise<{ sizes: string[], colors: string[] }> — what the value field offers */
  tokens: { type: Function, required: true },
  /** Full load of the page, so Bard builds its toolbar from the new list. */
  reload: { type: Function, required: true },
  /** () => Promise<'save'|'discard'|'cancel'> — asked when closing with unsaved changes */
  confirmClose: { type: Function, required: true },
  onClose: { type: Function, required: true },
});

const t = (key, replacements) => props.t(key, replacements);

const state = ref('loading');
const tab = ref('styles');
const styles = ref([]);
const groups = ref([]);
const selectedKey = ref('');
const source = ref('');
const canEdit = ref(false);
const baseline = ref('');
const saving = ref(false);
const savedOnce = ref(false);
const status = ref('');
const statusBad = ref(false);
/** The server's verdict on the last save, by item key — cleared by the next edit. */
const serverProblems = ref({});
const tokenLists = ref({ sizes: [], colors: [] });

let seq = 0;

function wrapStyle(style, saved) {
  return {
    key: `s${++seq}`,
    saved,
    handleTouched: saved,
    identTouched: saved,
    handle: style.handle || '',
    type: STYLE_TYPES.includes(style.type) ? style.type : 'span',
    name: style.name || '',
    ident: style.ident || '',
    prop: style.prop || '',
    value: style.value || '',
    target: style.target === 'block' ? 'block' : '',
    class: style.class || '',
    cp_css: style.cp_css || '',
    group: style.group || '',
  };
}

function wrapGroup(group, saved) {
  return {
    key: `g${++seq}`,
    saved,
    handleTouched: saved,
    identTouched: saved,
    handle: group.handle || '',
    name: group.name || '',
    ident: group.ident || '',
  };
}

const items = computed(() => (tab.value === 'styles' ? styles.value : groups.value));
const current = computed(() => items.value.find((item) => item.key === selectedKey.value) || null);
const groupHandles = computed(() => groups.value.map((group) => group.handle));

function payload() {
  return { groups: groups.value.map(groupForSave), styles: styles.value.map(styleForSave) };
}

const snapshot = computed(() => JSON.stringify(payload()));
const dirty = computed(() => state.value === 'ready' && snapshot.value !== baseline.value);

function problemsOf(item) {
  const own = item.key.startsWith('s')
    ? styleProblems(item, styles.value, groupHandles.value)
    : groupProblems(item, groups.value);

  return { ...(serverProblems.value[item.key] || {}), ...own };
}

const problems = computed(() => (current.value ? problemsOf(current.value) : {}));

function hasProblems(item) {
  return Object.keys(problemsOf(item)).length > 0;
}

function err(code) {
  return t(`bard_styles_err_${code}`);
}

const currentCss = computed(() => (current.value && tab.value === 'styles' ? previewCss(current.value) : ''));
const suggestions = computed(() => valueSuggestions(String(current.value?.prop || '').trim(), tokenLists.value));
const members = computed(() => (current.value && tab.value === 'groups'
  ? styles.value.filter((style) => style.group && style.group === current.value.handle)
  : []));

function rowMeta(item) {
  if (item.key.startsWith('g')) {
    const count = styles.value.filter((style) => style.group === item.handle).length;

    return t('bard_styles_group_count', { count: String(count) });
  }

  const what = item.type === 'span'
    ? [item.prop, item.value].filter(Boolean).join(': ')
    : (item.class ? `.${item.class.trim().replace(/\s+/g, '.')}` : '');
  const group = groups.value.find((g) => g.handle === item.group);

  return [t(`bard_styles_type_${item.type}`), what, group ? `↳ ${group.name || group.handle}` : ''].filter(Boolean).join(' · ');
}

function apply(data, keepTab = tab.value, keepHandle = current.value?.handle) {
  groups.value = (data.groups || []).map((group) => wrapGroup(group, true));
  styles.value = (data.styles || []).map((style) => wrapStyle(style, true));
  source.value = data.source || '';
  canEdit.value = !!data.can_edit;
  baseline.value = snapshot.value;
  serverProblems.value = {};
  tab.value = keepTab;

  const list = keepTab === 'styles' ? styles.value : groups.value;

  selectedKey.value = (list.find((item) => item.handle === keepHandle) || list[0])?.key || '';
}

function setStatus(text, bad = false) {
  status.value = text;
  statusBad.value = bad;
}

function pickTab(key) {
  tab.value = key;
  selectedKey.value = items.value[0]?.key || '';
}

/** A new item's handle and button text follow its name until they are typed in themselves. */
function nameChanged(item, sep) {
  if (!item.saved && !item.handleTouched) {
    const before = item.handle;

    item.handle = slug(item.name, sep);

    if (item.key.startsWith('g')) {
      renameGroupRefs(before, item.handle);
    }
  }

  if (!item.identTouched) {
    item.ident = identFrom(item.name);
  }
}

function renameGroupRefs(from, to) {
  if (!from || from === to) {
    return;
  }

  styles.value.forEach((style) => {
    if (style.group === from) {
      style.group = to;
    }
  });
}

function setType(style, type) {
  style.type = type;

  if (type === 'div') {
    style.group = '';
  }
}

function add() {
  const item = tab.value === 'styles'
    ? wrapStyle({ type: 'span' }, false)
    : wrapGroup({}, false);

  (tab.value === 'styles' ? styles : groups).value.push(item);
  selectedKey.value = item.key;
  setStatus('');

  props.win.requestAnimationFrame(() => {
    props.win.document.getElementById(tab.value === 'styles' ? 'sve-bs-name' : 'sve-bs-gname')?.focus();
  });
}

function move(index, step) {
  const list = items.value;
  const to = index + step;

  if (to < 0 || to >= list.length) {
    return;
  }

  const [item] = list.splice(index, 1);

  list.splice(to, 0, item);
}

function remove() {
  const list = items.value;
  const index = list.findIndex((item) => item.key === selectedKey.value);

  if (index < 0) {
    return;
  }

  const [item] = list.splice(index, 1);

  if (item.key.startsWith('g')) {
    styles.value.forEach((style) => {
      if (style.group === item.handle) {
        style.group = '';
      }
    });
  }

  selectedKey.value = (list[index] || list[index - 1])?.key || '';
}

function showStyle(style) {
  tab.value = 'styles';
  selectedKey.value = style.key;
}

/** Point at the first item with a problem, on whichever tab it is. */
function showFirstProblem() {
  const group = groups.value.find(hasProblems);
  const style = styles.value.find(hasProblems);

  if (current.value && hasProblems(current.value)) {
    return;
  }

  if (style) {
    tab.value = 'styles';
    selectedKey.value = style.key;
  } else if (group) {
    tab.value = 'groups';
    selectedKey.value = group.key;
  }
}

async function saveAll() {
  if (saving.value) {
    return false;
  }

  if (groups.value.some(hasProblems) || styles.value.some(hasProblems)) {
    showFirstProblem();
    setStatus(t('bard_styles_fix_first'), true);

    return false;
  }

  const sentStyles = styles.value.slice();
  const sentGroups = groups.value.slice();

  saving.value = true;
  setStatus('');

  let res;

  try {
    res = await props.save(payload());
  } catch {
    res = { ok: false, status: 0, data: null };
  } finally {
    saving.value = false;
  }

  if (res.ok && res.data) {
    apply(res.data);
    savedOnce.value = true;
    setStatus(t('bard_styles_saved'));

    return true;
  }

  if (res.status === 422 && res.data?.errors) {
    const found = {};

    Object.entries(res.data.errors).forEach(([path, codes]) => {
      const [list, index, field] = path.split('.');
      const item = (list === 'styles' ? sentStyles : sentGroups)[Number(index)];

      if (item && field) {
        found[item.key] = { ...(found[item.key] || {}), [field]: [].concat(codes)[0] };
      }
    });

    serverProblems.value = found;
    showFirstProblem();
    setStatus(t('bard_styles_fix_first'), true);

    return false;
  }

  setStatus(res.status === 403 ? t('bard_styles_forbidden') : t('bard_styles_save_failed'), true);

  return false;
}

async function requestClose() {
  if (dirty.value && canEdit.value) {
    const choice = await props.confirmClose();

    if (choice === 'save') {
      if (!(await saveAll())) {
        return;
      }
    } else if (choice !== 'discard') {
      return;
    }
  }

  props.onClose();
}

function reload() {
  props.reload();
}

/** An edit after a failed save: the server's verdict was about the old values. */
watch(snapshot, () => {
  if (Object.keys(serverProblems.value).length) {
    serverProblems.value = {};
  }

  if (dirty.value && status.value && !statusBad.value) {
    setStatus('');
  }
});

/** Escape closes the popup, not Live Preview behind it. */
function onKey(event) {
  if (event.key === 'Escape') {
    event.stopPropagation();
    event.preventDefault();
    requestClose();
  }
}

onMounted(async () => {
  props.win.document.addEventListener('keydown', onKey, true);
  props.tokens().then((lists) => {
    tokenLists.value = lists;
  }).catch(() => {});

  try {
    const res = await props.load();

    if (!res.ok || !res.data) {
      throw new Error(String(res.status));
    }

    apply(res.data, 'styles', '');
    state.value = 'ready';
  } catch {
    state.value = 'failed';
  }
});

onBeforeUnmount(() => props.win.document.removeEventListener('keydown', onKey, true));
</script>
