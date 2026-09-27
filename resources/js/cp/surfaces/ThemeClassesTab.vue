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
    :key="row.name"
    class="sve-theme__card"
    :class="{ 'is-open': ui.openClass === row.name, 'is-ambient': row.ambient }"
    :data-sve-class="row.name"
  >
    <button type="button" class="sve-theme__row" :aria-expanded="ui.openClass === row.name" @click="h.onOpenClass(row.name)">
      <span class="sve-theme__utility-mark" aria-hidden="true">{{ row.kind === 'utility' ? '{}' : '.' }}</span>
      <span class="sve-theme__row-text">
        <span class="sve-theme__token">{{ row.name }}</span>
        <span class="sve-theme__meta">{{ rowSummary(row, labels) }}</span>
      </span>
      <span v-if="row.ambient" class="sve-theme__badge">{{ ui.labels.classes_ambient || fallback.ambient }}</span>
      <span v-if="usage(row)" class="sve-theme__usage" :class="{ 'is-unused': row.now === 0 }">{{ usage(row) }}</span>
    </button>

    <div v-if="ui.openClass === row.name" class="sve-theme__card-body">
      <p v-if="row.ambient" class="sve-theme__hint">{{ ui.labels.classes_ambient_why || fallback.ambientWhy }}</p>

      <!-- A utility is site.css's own, so the Utilities tab's editor writes it
           here too — same body, same save. Anything else lives in a file this
           tab does not own, so it is shown as it stands, with where. -->
      <ThemeUtilityEditor
        v-if="utilityFor(row)"
        :value="utilityFor(row).body"
        :label="`${ui.labels.utilities_css || 'CSS'} .${row.name}`"
        :on-change="(body) => h.onUtilityBody(utilityFor(row).key, body)"
        :on-save="h.onSave"
      />
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
import { CLASS_CHIPS, chipKeeps, filterRows, rowSummary, usageLabel } from '../theme-panel/site-classes.js';
import ThemeUtilityEditor from './ThemeUtilityEditor.vue';

defineProps({ h: { type: Object, required: true } });

/** Until the lang file carries them — a raw key on screen reads as a bug. */
const fallback = {
  hint: 'Sitets egne klasser: utilities fra site.css og klasserne i din egen CSS-fil. En sektions regler hører til sektionen og følger med, når den eksporteres — derfor står de ikke her.',
  search: 'Søg…',
  empty: 'Ingen klasser matcher.',
  ambient: 'AFLEDT',
  ambientWhy: 'Denne regel rammer noget inde i noget andet — den kan ikke sættes på et element alene.',
  readOnly: 'Denne regel bor i en anden fil end site.css og rettes i Stylesheets-panelet.',
  historyWarn: 'Intet bruger den i dag, men dockens historik gør. Sletter du den, mister en fortrydelse sin styling.',
  chipsUnused: 'Ubrugte',
  chips: { all: 'Alle', utility: 'Utilities', class: 'Klasser', ambient: 'Afledte', unused: 'Ubrugte' },
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

const shown = computed(() => filterRows(ui.classRows, { chip: ui.classChip, query: ui.classQuery }));

/**
 * A chip with nothing behind it is noise — `Ambient 0` says only that the
 * concept exists. It comes back the day a rule earns it. The one in hand
 * stays, so the list does not move under a selection that just emptied.
 */
const shownChips = computed(() =>
  CLASS_CHIPS.filter((chip) => chip === 'all' || chip === ui.classChip || count(chip) > 0)
);

/** The `@utility` block behind a row, when site.css is what defines it. */
function utilityFor(row) {
  return row.kind === 'utility' ? (ui.utilities || []).find((u) => u.name === row.name) : null;
}

function count(chip) {
  return (ui.classRows || []).filter((row) => chipKeeps(chip, row)).length;
}
</script>
