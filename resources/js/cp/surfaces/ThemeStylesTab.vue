<template>
  <p class="sve-theme__hint">{{ ui.labels.classes_hint || fallback.hint }}</p>

  <label class="sve-theme__search">
    <input
        type="search"
        :value="ui.classQuery"
        :placeholder="ui.labels.classes_search || fallback.search"
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
      {{ ui.labels[`classes_chip_${chip}`] || fallback.chips[chip] }}
      <span class="sve-theme__filter-count">{{ count(chip) }}</span>
    </button>
  </nav>

  <p v-if="!shown.length" class="sve-theme__empty">{{ ui.labels.classes_empty || fallback.empty }}</p>

  <section
    v-for="row in shown"
    :key="row.key || row.name"
    class="sve-theme__card"
    :class="{ 'is-open': isOpen(row), 'is-ambient': row.ambient }"
    :data-sve-class="row.name"
  >
    <button type="button" class="sve-theme__row" :aria-expanded="isOpen(row)" @click="open(row)">
      <span class="sve-theme__utility-mark" aria-hidden="true">{{ row.kind === 'utility' ? '{}' : '.' }}</span>
      <span class="sve-theme__row-text">
        <span class="sve-theme__token">{{ row.name || '…' }}</span>
        <span class="sve-theme__meta">{{ row.kind === 'variable' ? (row.value || '…') : rowSummary(row, labels) }}</span>
      </span>
      <span v-if="row.ambient" class="sve-theme__badge">{{ ui.labels.classes_ambient || fallback.ambient }}</span>
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

      <p v-if="row.ambient" class="sve-theme__hint">{{ ui.labels.classes_ambient_why || fallback.ambientWhy }}</p>

      <!-- Both files the tab owns are written here: a utility through the
           Utilities tab's own handlers, a class through the classes file's.
           Same editor, same Save. -->
      <template v-else-if="edit(row)">
        <label v-if="edit(row).entry.fresh" class="sve-theme__field">
          <span class="sve-theme__label">{{ ui.labels.classes_name || fallback.name }}</span>
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
          :value="edit(row).entry.body"
          :label="`${ui.labels.utilities_css || 'CSS'} .${row.name || ''}`"
          :on-change="(body) => change(row, body)"
          :on-save="h.onSave"
          :tokens="tokens"
        />

        <button type="button" class="sve-theme__remove" @click="remove(row)">
          {{ ui.labels.classes_remove || fallback.remove }}
        </button>
      </template>
      <template v-else>
        <pre v-for="sel in row.selectors" :key="sel" class="sve-theme__selector">{{ sel }}</pre>
        <p class="sve-theme__hint">{{ ui.labels.classes_read_only || fallback.readOnly }}</p>
      </template>

      <p class="sve-theme__hint">{{ row.files.join(', ') }}</p>

      <!-- Where it is written today, and what a delete would cost. -->
      <template v-if="row.counted">
        <p v-if="row.now === 0 && row.history > 0" class="sve-theme__hint">
          {{ ui.labels.classes_history_warn || fallback.historyWarn }}
        </p>
        <p v-for="f in row.where" :key="f" class="sve-theme__hint sve-theme__where">{{ f }}</p>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { themePanelUi as ui } from '../theme-panel/store.js';
import { CLASS_CHIPS, CLASS_CHIPS_ALWAYS, chipKeeps, filterRows, rowSummary, usageLabel, variableRows } from '../theme-panel/site-classes.js';
import ThemeUtilityEditor from './ThemeUtilityEditor.vue';

const { h } = defineProps({ h: { type: Object, required: true } });

/** Until the lang file carries them — a raw key on screen reads as a bug. */
const fallback = {
  hint: 'Sitets egne klasser: utilities fra site.css og klasserne i din egen CSS-fil. En sektions regler hører til sektionen og følger med, når den eksporteres — derfor står de ikke her.',
  search: 'Søg…',
  empty: 'Ingen klasser matcher.',
  ambient: 'AFLEDT',
  ambientWhy: 'Denne regel rammer noget inde i noget andet — den kan ikke sættes på et element alene.',
  readOnly: 'Denne regel bor i en anden fil end site.css og rettes i Stylesheets-panelet.',
  name: 'Navn',
  remove: 'Slet klasse',
  historyWarn: 'Intet bruger den i dag, men dockens historik gør. Sletter du den, mister en fortrydelse sin styling.',
  chipsUnused: 'Ubrugte',
  chips: { all: 'Alle', utility: 'Utilities', class: 'Klasser', variable: 'Variabler', ambient: 'Afledte', unused: 'Ubrugte' },
};

const labels = computed(() => ({
  prop_one: ui.labels.classes_prop_one,
  prop_many: ui.labels.classes_prop_many,
  no_props: ui.labels.classes_no_props,
}));

function usage(row) {
  return usageLabel(row, {
    used: ui.labels.classes_used,
    history_only: ui.labels.classes_history_only,
    unused: ui.labels.classes_unused,
  });
}

/** Everything the theme defines, in one list: the two class files and var.css. */
const allRows = computed(() => [...ui.classRows, ...variableRows(ui.props, ui.varsFile || 'var.css')]);

const shown = computed(() => filterRows(allRows.value, { chip: ui.classChip, query: ui.classQuery }));

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

function edit(row) {
  if (row.kind === 'variable') {
    return null;
  }

  const from = row.kind === 'utility' ? ui.utilities : ui.classes;
  const entry = (from || []).find((e) => (row.key ? e.key === row.key : e.name === row.name));

  return entry ? { kind: row.kind === 'utility' ? 'utility' : 'class', entry } : null;
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
