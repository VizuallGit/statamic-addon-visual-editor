<template>
  <p class="sve-theme__hint">{{ ui.labels.classes_hint }}</p>

  <label class="sve-theme__search">
    <input
        type="search"
        :value="ui.classQuery"
        :placeholder="ui.labels.classes_search"
        spellcheck="false"
        autocomplete="off"
        data-sve-class-search
        @input="h.onClassQuery($event.target.value)"
    >
  </label>

  <nav class="sve-theme__filters" role="tablist">
    <button
      v-for="chip in shownChips"
      :key="chip"
      type="button"
      role="tab"
      class="sve-theme__filter"
      :class="{ 'is-on': ui.classChip === chip }"
      :aria-selected="ui.classChip === chip"
      :data-sve-class-chip="chip"
      @click="h.onClassChip(chip)"
    >
      {{ ui.labels[`classes_chip_${chip}`] }}
      <span class="sve-theme__filter-count">{{ count(chip) }}</span>
    </button>
  </nav>

  <!-- A chip with nothing in it says so and offers the first one; a search that finds nothing says that. -->
  <div v-if="!shown.length && creates" class="sve-theme__none" data-sve-class-none>
    <p class="sve-theme__empty">{{ ui.labels[`classes_none_${ui.classChip}`] }}</p>
    <button type="button" class="sve-theme__add" data-sve-class-create @click="creates">{{ ui.labels.classes_create }}</button>
  </div>
  <p v-else-if="!shown.length" class="sve-theme__empty">{{ ui.labels.classes_empty }}</p>

  <section
    v-for="row in shown"
    :key="row.key || row.name"
    class="sve-theme__card"
    :class="{ 'is-open': isOpen(row), 'is-ambient': row.ambient }"
    :data-sve-class="row.name"
  >
    <button type="button" class="sve-theme__row" :aria-expanded="isOpen(row)" @click="open(row)">
      <!-- A class wears its dot; a recipe the `&` its nested rules hang off — a body with no selector of its own. -->
      <span class="sve-theme__utility-mark" aria-hidden="true">{{ row.kind === 'snippet' ? '&' : '.' }}</span>
      <span class="sve-theme__row-text">
        <span class="sve-theme__token">{{ row.name || '…' }}<svg v-if="isLocked(row)" class="sve-theme__locked" data-sve-utility-locked viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg></span>
        <span class="sve-theme__meta">{{ row.kind === 'variable' ? (row.value || '…') : rowSummary(row, labels) }}</span>
      </span>
      <span v-if="row.ambient" class="sve-theme__badge">{{ ui.labels.classes_ambient }}</span>
      <span v-if="usage(row)" class="sve-theme__usage" :class="{ 'is-unused': row.now === 0 }">{{ usage(row) }}</span>
    </button>

    <div v-if="isOpen(row)" class="sve-theme__card-body">
      <!-- A variable is a name and a value, not a body of CSS. -->
      <template v-if="row.kind === 'variable'">
        <label class="sve-theme__field">
          <span class="sve-theme__label">{{ ui.labels.props_name }}</span>
          <span class="sve-theme__input">
            <span class="sve-theme__dashes">--</span>
            <input
              type="text"
              :value="propFor(row).name"
              :readonly="!propFor(row).fresh"
              spellcheck="false"
              autocomplete="off"
              data-sve-prop-name
              @input="h.onPropName(row.key, $event.target.value)"
            >
          </span>
        </label>
        <label class="sve-theme__field">
          <span class="sve-theme__label">{{ ui.labels.props_value }}</span>
          <span class="sve-theme__input">
            <input
              type="text"
              :value="propFor(row).value"
              spellcheck="false"
              autocomplete="off"
              data-sve-prop-value
              @input="h.onPropValue(row.key, $event.target.value)"
            >
          </span>
        </label>
        <button type="button" class="sve-theme__remove" @click="h.onRemoveProp(row.key)">{{ ui.labels.props_remove }}</button>
      </template>

      <p v-if="row.ambient" class="sve-theme__hint">{{ ui.labels.classes_ambient_why }}</p>

      <!-- A CSS snippet is a file of its own (resources/snippets/name.css):
           the body of one rule, no class name. The same editor, but its own
           Save — written at once through the snippet endpoint, not with
           site.css — and a Delete that asks first. -->
      <template v-else-if="row.kind === 'snippet'">
        <p class="sve-theme__hint">{{ ui.labels.classes_snippet_hint }}</p>

        <label class="sve-theme__field">
          <span class="sve-theme__label">{{ ui.labels.classes_snippet_name }}</span>
          <span class="sve-theme__input" :class="{ 'is-bad': snippet(row).problem && snippet(row).problem !== 'braces' }">
            <input
              type="text"
              :value="snippet(row).name"
              spellcheck="false"
              autocomplete="off"
              data-sve-snippet-name
              @input="h.onSnippetName(row.key, $event.target.value)"
            >
          </span>
        </label>

        <p v-if="/@apply\b/.test(snippet(row).body)" class="sve-theme__hint" data-sve-snippet-apply>{{ ui.labels.classes_snippet_apply }}</p>

        <ThemeUtilityEditor
          :value="snippet(row).body"
          :label="`${ui.labels.utilities_css || 'CSS'} ${row.name || ''}`"
          :on-change="(body) => h.onSnippetBody(row.key, body)"
          :on-save="() => h.onSaveSnippet(row.key)"
          :tokens="tokens"
        />

        <div class="sve-theme__snippet-actions">
          <button
            type="button"
            class="sve-theme__save"
            data-sve-snippet-save
            :disabled="!snippetDirty(snippet(row)) || !!snippet(row).problem || snippet(row).saving"
            @click="h.onSaveSnippet(row.key)"
          >{{ ui.labels.classes_snippet_save }}</button>
          <button type="button" class="sve-theme__remove" data-sve-snippet-remove @click="h.onRemoveSnippet(row.key)">
            {{ ui.labels.classes_snippet_remove }}
          </button>
        </div>
      </template>

      <!-- Both files the chip owns are written here: a new class and any
           `@utility` through the utility handlers, a rule already in the
           classes file through that file's. Same editor, same Save. -->
      <template v-else-if="edit(row)">
        <label v-if="edit(row).entry.fresh" class="sve-theme__field">
          <span class="sve-theme__label">{{ ui.labels.classes_name }}</span>
          <span class="sve-theme__input" :class="{ 'is-bad': edit(row).entry.problem }">
            <span class="sve-theme__dashes">.</span>
            <input
              type="text"
              :value="edit(row).entry.name"
              spellcheck="false"
              autocomplete="off"
              data-sve-class-name
              @input="rename(row, $event.target.value)"
            >
          </span>
        </label>

        <ThemeUtilityEditor
          :key="isLocked(row) ? 'locked' : 'open'"
          :value="edit(row).entry.body"
          :label="`${ui.labels.utilities_css || 'CSS'} .${row.name || ''}`"
          :on-change="(body) => change(row, body)"
          :on-save="h.onSave"
          :tokens="tokens"
          :read-only="isLocked(row)"
        />

        <p v-if="edit(row).kind === 'class'" class="sve-theme__hint" data-sve-class-no-variants>{{ ui.labels.classes_no_variants }}</p>
        <p v-if="isLocked(row)" class="sve-theme__hint" data-sve-utility-locked-hint>
          {{ ui.canLock ? ui.labels.utilities_locked_hint : ui.labels.utilities_locked_hint_ask }}
        </p>
        <button
          v-if="canSwitchLock(row)"
          type="button"
          class="sve-theme__remove"
          data-sve-utility-lock
          :disabled="utilityUnsaved(row)"
          :title="utilityUnsaved(row) ? ui.labels.utilities_lock_save_first : undefined"
          @click="h.onLockUtility(edit(row).entry.key)"
        >{{ isLocked(row) ? ui.labels.utilities_unlock : ui.labels.utilities_lock }}</button>
        <button v-if="!isLocked(row)" type="button" class="sve-theme__remove" @click="remove(row)">
          {{ ui.labels.classes_remove }}
        </button>
      </template>
      <template v-else>
        <pre v-for="sel in row.selectors" :key="sel" class="sve-theme__selector">{{ sel }}</pre>
        <p class="sve-theme__hint">{{ ui.labels.classes_read_only }}</p>
      </template>

      <p class="sve-theme__hint">{{ row.files.join(', ') }}</p>

      <!-- Where it is written today, and what a delete would cost. -->
      <template v-if="row.counted">
        <p v-if="row.now === 0 && row.history > 0" class="sve-theme__hint">
          {{ ui.labels.classes_history_warn }}
        </p>
        <p v-for="f in row.where" :key="f" class="sve-theme__hint sve-theme__where">{{ f }}</p>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { themePanelUi as ui } from '../theme-panel/store.js';
import { CLASS_CHIPS, CLASS_CHIPS_ALWAYS, chipKeeps, filterRows, rowSummary, snippetRows, usageLabel, variableRows } from '../theme-panel/site-classes.js';
import { snippetDirty } from '../theme-panel/snippet-rows.js';
import { dedent } from '../theme-panel/utilities.js';
import ThemeUtilityEditor from './ThemeUtilityEditor.vue';

const { h } = defineProps({ h: { type: Object, required: true } });

const labels = computed(() => ({
  prop_one: ui.labels.classes_prop_one,
  prop_many: ui.labels.classes_prop_many,
  no_props: ui.labels.classes_no_props,
  tw_one: ui.labels.classes_tw_one,
  tw_many: ui.labels.classes_tw_many,
}));

function usage(row) {
  return usageLabel(row, {
    used: ui.labels.classes_used,
    history_only: ui.labels.classes_history_only,
    unused: ui.labels.classes_unused,
  });
}

/** Everything the theme defines, in one list: the two class files and var.css. */
const allRows = computed(() => [...ui.classRows, ...variableRows(ui.props, ui.varsFile || 'var.css'), ...snippetRows(ui.snippets)]);

const shown = computed(() => filterRows(allRows.value, { chip: ui.classChip, query: ui.classQuery }));

/** What the chip in hand makes, when the list is empty because it has none — not because a search left none. */
const creates = computed(() =>
  ui.classQuery || count(ui.classChip)
    ? null
    : { class: h.onAddUtilityFromClasses, variable: h.onAddProp, snippet: h.onAddSnippet }[ui.classChip] || null
);

/**
 * A chip that only filters is noise when empty — `Ambient 0` says no more than
 * that the concept exists. A chip you can create in always shows: it is the
 * way to its New button, and an empty Classes chip would mean the first class
 * could never be made. The one in hand stays either way, so the list does not
 * move under a selection that just emptied.
 */
const shownChips = computed(() =>
  CLASS_CHIPS.filter((chip) => CLASS_CHIPS_ALWAYS.includes(chip) || chip === ui.classChip || count(chip) > 0)
);

/**
 * The editable rule behind a row, and which of the two files it is in — or
 * null for a rule the tab does not own and only shows.
 */
/**
 * The custom properties `var(` should offer: the site's own from var.css, and
 * the theme's colours and sizes, which are what a rule reaches for most.
 */
const tokens = computed(() => [
  ...(ui.props || []).map((p) => `--${p.name}`),
  ...(ui.families || []).flatMap((f) => [`--color-${f.name}`, ...(f.steps || []).map((s) => `--color-${f.name}-${s.name || s}`)]),
  ...(ui.sizes || []).map((s) => `--size-${s.name}`),
].filter((n) => n && !n.endsWith('-')));

function propFor(row) {
  return (ui.props || []).find((p) => p.key === row.key) || { name: '', value: '', fresh: true };
}

/** The live snippet behind a row — the row itself is a projection, the edits live in `ui.snippets`. */
function snippet(row) {
  return (ui.snippets || []).find((s) => s.key === row.key) || { name: '', savedName: '', body: '', savedBody: '', problem: null, saving: false };
}

function edit(row) {
  if (row.kind === 'variable' || row.kind === 'snippet') {
    return null;
  }

  const from = row.kind === 'utility' ? ui.utilities : ui.classes;
  const entry = (from || []).find((e) => (row.key ? e.key === row.key : e.name === row.name));

  return entry ? { kind: row.kind === 'utility' ? 'utility' : 'class', entry } : null;
}

function isLocked(row) {
  return row.kind === 'utility' && !!edit(row)?.entry.locked;
}

function canSwitchLock(row) {
  return ui.canLock && row.kind === 'utility' && !!edit(row) && !edit(row).entry.fresh;
}

function utilityUnsaved(row) {
  return ui.savedUtilities?.[row.name] !== dedent(edit(row).entry.body);
}

/** A fresh row has no name yet, so it is held open by its key. */
function isOpen(row) {
  if (row.kind === 'variable') {
    return ui.openProp === row.key;
  }

  return row.key ? ui.openClassKey === row.key : ui.openClass === row.name;
}

function open(row) {
  if (row.kind === 'variable') {
    return h.onOpenProp(row.key);
  }

  return row.key ? h.onOpenClassKey(row.key) : h.onOpenClass(row.name);
}

function rename(row, name) {
  const e = edit(row);

  return e.kind === 'utility' ? h.onUtilityName(e.entry.key, name) : h.onClassName(e.entry.key, name);
}

function change(row, body) {
  const e = edit(row);

  return e.kind === 'utility' ? h.onUtilityBody(e.entry.key, body) : h.onClassBody(e.entry.key, body);
}

function remove(row) {
  const e = edit(row);

  return e.kind === 'utility' ? h.onRemoveUtility(e.entry.key) : h.onRemoveClass(e.entry.key);
}

function count(chip) {
  return allRows.value.filter((row) => chipKeeps(chip, row)).length;
}
</script>
