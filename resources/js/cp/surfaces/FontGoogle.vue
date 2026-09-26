<template>
  <template v-if="!font">
    <div class="sve-fontdlg__search">
      <span class="sve-theme__input">
        <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input ref="searchEl" v-model="query" type="search" :placeholder="ui.labels.fonts_search" data-sve-font-search>
      </span>
      <div class="sve-fontdlg__chips">
        <button
          v-for="key in CATEGORIES"
          :key="key"
          type="button"
          class="sve-fontdlg__chip"
          :class="{ 'is-on': category === key }"
          :data-sve-font-category="key"
          @click="category = key"
        >{{ ui.labels[`fonts_category_${key}`] }}</button>
      </div>
    </div>

    <div ref="listEl" class="sve-fontdlg__body sve-fontdlg__list">
      <p v-if="error" class="sve-fontdlg__error">{{ errorText(error) }}</p>
      <p v-else-if="!fonts" class="sve-theme__empty">{{ ui.labels.fonts_loading }}</p>
      <p v-else-if="!filtered.length" class="sve-theme__empty">{{ ui.labels.fonts_no_match }}</p>
      <button
        v-for="f in visible"
        :key="f.family"
        :ref="(el) => watchRow(el, f)"
        type="button"
        class="sve-fontdlg__family"
        :data-sve-google-font="f.family"
        @click="open(f)"
      >
        <span class="sve-fontdlg__family-name" :style="nameStyle(f)">{{ f.family }}</span>
        <span class="sve-fontdlg__family-meta">{{ ui.labels[`fonts_category_${categoryKey(f.category)}`] || f.category }} · {{ stylesText(f) }}</span>
        <span v-if="installedFamily(f.family)" class="sve-fontdlg__badge">{{ ui.labels.fonts_installed_badge }}</span>
      </button>
      <span ref="moreEl" class="sve-fontdlg__more" aria-hidden="true"></span>
    </div>
  </template>

  <template v-else>
    <div class="sve-fontdlg__body">
      <div class="sve-fontdlg__sample">
        <div class="sve-fontdlg__sample-top">
          <span>{{ font.family }}</span>
          <span>{{ ui.labels[`fonts_category_${categoryKey(font.category)}`] || font.category }}</span>
        </div>
        <p class="sve-fontdlg__sample-text" :style="variantStyle(sampleVariant)" data-sve-font-sample>{{ ui.labels.fonts_sample }}</p>
      </div>

      <div class="sve-fontdlg__group-head">
        <span>{{ ui.labels.fonts_variants }} ({{ chosenCount }}/{{ font.variants.length }})</span>
        <button type="button" data-sve-font-all-variants @click="allVariants">{{ ui.labels.fonts_select_all }}</button>
      </div>
      <p v-if="font.axis" class="sve-fontdlg__hint">{{ variableHint }}</p>
      <div class="sve-fontdlg__variants">
        <template v-for="cell in cells" :key="cell.key">
          <button
            v-if="cell.variant"
            type="button"
            class="sve-fontdlg__variant"
            :class="{ 'is-on': isOn(cell.variant), 'is-installed': isInstalled(cell.variant) }"
            :disabled="isInstalled(cell.variant)"
            :title="isInstalled(cell.variant) ? ui.labels.fonts_installed_badge : ''"
            :data-sve-font-variant="cell.variant"
            @click="toggle(cell.variant)"
          >
            <span class="sve-fontdlg__check" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>
            </span>
            <span class="sve-fontdlg__variant-name" :style="variantStyle(cell.variant)">{{ variantLabel(cell.variant) }}</span>
            <span class="sve-fontdlg__variant-num">{{ weightOf(cell.variant) }}{{ isItalic(cell.variant) ? ' I' : '' }}</span>
          </button>
          <span v-else class="sve-fontdlg__variant is-empty" aria-hidden="true"></span>
        </template>
      </div>

      <div class="sve-fontdlg__group-head">
        <span>{{ ui.labels.fonts_subsets }} ({{ subsets.size }}/{{ font.subsets.length }})</span>
        <button type="button" @click="allSubsets">{{ ui.labels.fonts_select_all }}</button>
      </div>
      <div class="sve-fontdlg__chips">
        <button
          v-for="s in font.subsets"
          :key="s"
          type="button"
          class="sve-fontdlg__chip"
          :class="{ 'is-on': subsets.has(s) }"
          :data-sve-font-subset="s"
          @click="toggleSubset(s)"
        >{{ s }}</button>
      </div>
    </div>

    <footer class="sve-fontdlg__foot">
      <span class="sve-fontdlg__size" data-sve-font-size>
        <template v-if="plan.bytes !== null"><b>{{ formatBytes(plan.bytes) }}</b> {{ filesText(plan.files) }}</template>
        <template v-else-if="plan.loading">…</template>
      </span>
      <span class="sve-fontdlg__error">{{ error ? errorText(error) : '' }}</span>
      <button type="button" class="sve-fontdlg__ghost" @click="back">{{ ui.labels.fonts_back }}</button>
      <button type="button" class="sve-theme__save" :disabled="!canInstall" data-sve-font-install @click="install">
        {{ installing ? ui.labels.fonts_installing : ui.labels.fonts_install }}
      </button>
    </footer>
  </template>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { themePanelUi as ui } from '../theme-panel/store.js';
import { errorText, filesText, fontsRequest, installedFamily } from '../theme-panel/fonts.js';
import { loadCatalog, loadPreview } from '../theme-panel/google-fonts.js';
import { defaultVariant, formatBytes, hasVariant, isItalic, previewAlias, variantLabel, weightOf } from '../theme-panel/font-helpers.js';

const CATEGORIES = ['all', 'sans-serif', 'serif', 'display', 'handwriting', 'monospace'];
const PAGE = 60;

const props = defineProps({ win: { type: Object, required: true } });
const emit = defineEmits(['detail', 'installed']);

const fonts = ref(null);
const error = ref('');
const query = ref('');
const category = ref('all');
const limit = ref(PAGE);
const searchEl = ref(null);
const listEl = ref(null);
const moreEl = ref(null);
/** Families whose name preview has loaded. */
const ready = reactive({});

const font = ref(null);
const chosen = reactive(new Set());
const subsets = reactive(new Set());
const plan = reactive({ files: 0, bytes: null, loading: false });
const installing = ref(false);

const categoryKey = (name) => String(name).toLowerCase().replace(/\s+/g, '-');

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();

  return (fonts.value || []).filter((f) => (category.value === 'all' || categoryKey(f.category) === category.value) && (!q || f.family.toLowerCase().includes(q)));
});
const visible = computed(() => filtered.value.slice(0, limit.value));

watch([query, category], () => {
  limit.value = PAGE;
  listEl.value?.scrollTo?.({ top: 0 });
});

function stylesText(f) {
  return f.variants.length === 1 ? ui.labels.fonts_style_one : String(ui.labels.fonts_styles || ':count').replace(':count', f.variants.length);
}

function nameStyle(f) {
  const v = defaultVariant(f);

  return ready[f.family]
    ? { fontFamily: `'${previewAlias(f.family)}', ui-sans-serif, system-ui, sans-serif`, fontWeight: weightOf(v), fontStyle: isItalic(v) ? 'italic' : 'normal' }
    : {};
}

// ── Name previews: only the rows on screen, only the letters of the name ──
let rowObserver = null;
let moreObserver = null;
const rowFont = new WeakMap();

function watchRow(el, f) {
  if (el && rowObserver && !ready[f.family]) {
    rowFont.set(el, f);
    rowObserver.observe(el);
  }
}

function onRows(entries) {
  for (const entry of entries) {
    const f = rowFont.get(entry.target);

    if (entry.isIntersecting && f) {
      rowObserver.unobserve(entry.target);
      loadPreview(props.win, f, [defaultVariant(f)], f.family).then((ok) => {
        if (ok) {
          ready[f.family] = true;
        }
      });
    }
  }
}

function observeList() {
  rowObserver?.disconnect();
  moreObserver?.disconnect();
  rowObserver = new props.win.IntersectionObserver(onRows, { root: listEl.value, rootMargin: '200px 0px' });
  moreObserver = new props.win.IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting) && limit.value < filtered.value.length) {
      limit.value += PAGE;
    }
  }, { root: listEl.value, rootMargin: '400px 0px' });

  if (moreEl.value) {
    moreObserver.observe(moreEl.value);
  }

  listEl.value?.querySelectorAll('[data-sve-google-font]').forEach((el) => {
    const f = rowFont.get(el) || (fonts.value || []).find((x) => x.family === el.dataset.sveGoogleFont);

    if (f) {
      watchRow(el, f);
    }
  });
}

onMounted(async () => {
  observeList();
  searchEl.value?.focus();

  const result = await loadCatalog(props.win);

  if (result.error) {
    error.value = result.error;

    return;
  }

  fonts.value = result.fonts;
  await nextTick();
  observeList();
});

onBeforeUnmount(() => {
  rowObserver?.disconnect();
  moreObserver?.disconnect();
  clearTimeout(planTimer);
});

// ── One family ──
const installedHere = computed(() => (font.value ? installedFamily(font.value.family) : null));

const isInstalled = (v) => hasVariant(installedHere.value, weightOf(v), isItalic(v));
const isOn = (v) => chosen.has(v) || isInstalled(v);
const hasItalic = computed(() => !!font.value?.variants.some(isItalic));

/** The grid: Regular left and Italic right on the same row; one flowing list when there is no italic. */
const cells = computed(() => {
  if (!font.value) {
    return [];
  }

  if (!hasItalic.value) {
    return font.value.variants.map((v) => ({ key: v, variant: v }));
  }

  const weights = [...new Set(font.value.variants.map(weightOf))].sort((a, b) => a - b);

  return weights.flatMap((w) => [
    { key: `${w}`, variant: font.value.variants.includes(`${w}`) ? `${w}` : null },
    { key: `${w}i`, variant: font.value.variants.includes(`${w}i`) ? `${w}i` : null },
  ]);
});

const chosenCount = computed(() => (font.value ? font.value.variants.filter(isOn).length : 0));
const sampleVariant = computed(() => font.value?.variants.find((v) => chosen.has(v)) || (font.value ? defaultVariant(font.value) : '400'));
const variableHint = computed(() => String(ui.labels.fonts_variable_hint || '')
  .replace(':min', font.value?.axis?.[0] ?? '')
  .replace(':max', font.value?.axis?.[1] ?? ''));
const canInstall = computed(() => !installing.value && chosen.size > 0 && subsets.size > 0 && ui.fontsWritable);

function variantStyle(v) {
  return {
    fontFamily: `'${previewAlias(font.value.family)}', ui-sans-serif, system-ui, sans-serif`,
    fontWeight: weightOf(v),
    fontStyle: isItalic(v) ? 'italic' : 'normal',
  };
}

function open(f) {
  font.value = f;
  chosen.clear();
  subsets.clear();
  error.value = '';

  const first = defaultVariant(f);

  if (!hasVariant(installedFamily(f.family), weightOf(first), isItalic(first))) {
    chooseWithStyle(first, true);
  }

  subsets.add(f.subsets.includes('latin') ? 'latin' : f.subsets[0]);
  emit('detail', f.family);

  const letters = [ui.labels.fonts_sample, f.family, ...f.variants.map(variantLabel)].join('');

  loadPreview(props.win, f, f.variants, letters);
}

function back() {
  font.value = null;
  error.value = '';
  emit('detail', '');
  nextTick(observeList);
}

/**
 * A variable family is one file per style whatever weights are ticked, so a
 * tick takes the whole style with it — the grid shows what will arrive.
 */
function chooseWithStyle(v, on) {
  const same = font.value.axis ? font.value.variants.filter((x) => isItalic(x) === isItalic(v)) : [v];

  same.filter((x) => !isInstalled(x)).forEach((x) => (on ? chosen.add(x) : chosen.delete(x)));
}

function toggle(v) {
  if (!isInstalled(v)) {
    chooseWithStyle(v, !chosen.has(v));
  }
}

function allVariants() {
  font.value.variants.filter((v) => !isInstalled(v)).forEach((v) => chosen.add(v));
}

function toggleSubset(s) {
  subsets.has(s) ? subsets.delete(s) : subsets.add(s);
}

function allSubsets() {
  font.value.subsets.forEach((s) => subsets.add(s));
}

// ── Size of what would be installed, asked of the server (same code as the install) ──
let planTimer = null;
let planSeq = 0;

function choice() {
  return [
    ['family', font.value.family],
    ...[...chosen].map((v) => ['variants[]', v]),
    ...[...subsets].map((s) => ['subsets[]', s]),
  ];
}

watch([font, () => [...chosen].join(), () => [...subsets].join()], () => {
  clearTimeout(planTimer);
  plan.bytes = null;

  if (!font.value || !chosen.size || !subsets.size) {
    plan.loading = false;

    return;
  }

  plan.loading = true;
  planTimer = setTimeout(async () => {
    const mine = ++planSeq;
    const { ok, data } = await fontsRequest(props.win, '/google/plan', { query: choice() });

    if (mine !== planSeq) {
      return;
    }

    plan.loading = false;

    if (ok) {
      plan.files = data.files;
      plan.bytes = data.bytes;
    }
  }, 250);
});

async function install() {
  if (!canInstall.value) {
    return;
  }

  installing.value = true;
  error.value = '';

  const { ok, data } = await fontsRequest(props.win, '/google', {
    method: 'POST',
    json: { family: font.value.family, variants: [...chosen], subsets: [...subsets] },
  });

  installing.value = false;

  if (!ok) {
    error.value = data.error || 'install_failed';

    return;
  }

  emit('installed', data, String(ui.labels.fonts_installed_message || '').replace(':name', data.family || font.value.family));
}

</script>
