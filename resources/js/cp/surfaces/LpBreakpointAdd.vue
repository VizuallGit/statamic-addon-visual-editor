<script setup>
import { computed, ref, watch } from 'vue';
import ShortcutInput from './ShortcutInput.vue';
import { conflictsWith, formatCombo, isMac, resolveShortcutLayers, shortcutsConfig, siteShortcuts } from '../../lib/shortcuts.js';
import { t } from '../../lib/i18n.js';

// The «+» popover beside Live Preview's size buttons: the sizes the site
// has, each with a way out, and one more below. cp-shell/breakpoint-add.js
// builds the props and talks to the server; this collects a row and reports
// it, or names the one to take out. Nothing here derives a media query or
// a Tailwind variant — PHP does, from the one list, on every save.
const props = defineProps({
  top: { type: Number, required: true },
  left: { type: Number, required: true },
  // Every on-screen string, already translated.
  strings: { type: Object, required: true },
  // [{ key, svg }] — the pictures a size may have, in the order to offer them.
  icons: { type: Array, required: true },
  // [{ key: 'md', px: 768 }] — Tailwind's scale as starting points.
  presets: { type: Array, required: true },
  units: { type: Array, required: true },
  // 'desktop' | 'mobile' — shown, not decided, here.
  direction: { type: String, required: true },
  // The list as it stood when the popover opened, widest first. Kept as
  // this component's own state from here: every answer from the server is
  // the whole list, and it takes the place of this one.
  rows: { type: Array, required: true },
  // Breakpoints::MAX / ::MIN. At the top count the form gives way to a note;
  // at the bottom one the remove buttons go quiet.
  max: { type: Number, required: true },
  min: { type: Number, required: true },
  onSave: { type: Function, required: true },
  // (handle) => { ok, rows?, errors? }
  onRemove: { type: Function, required: true },
  onClose: { type: Function, required: true },
});

const rows = ref([...props.rows]);
const full = computed(() => rows.value.length >= props.max);
const canRemove = computed(() => rows.value.length > props.min);
// The handle whose × has been pressed once and waits for the second press.
const confirming = ref('');
const removing = ref('');
const removeFailed = ref('');

/** A preset is spent when a size already starts at its pixel width. */
function taken(preset) {
  return rows.value.some((row) => Math.abs(Number(row.min_px) - preset.px) < 0.5);
}

function iconFor(row) {
  return props.icons.find((item) => item.key === row.icon)?.svg || '';
}

/** First press asks, second press within the same row removes. */
async function removeRow(row) {
  if (!canRemove.value || removing.value) {
    return;
  }

  if (confirming.value !== row.handle) {
    confirming.value = row.handle;
    removeFailed.value = '';

    return;
  }

  removing.value = row.handle;
  removeFailed.value = '';

  const result = await props.onRemove(row.handle);

  removing.value = '';
  confirming.value = '';

  if (result?.ok && Array.isArray(result.rows)) {
    rows.value = result.rows;

    return;
  }

  removeFailed.value = Object.values(result?.errors || {})[0] || props.strings.removeFailed;
}

const name = ref('');
const icon = ref(props.icons.find((item) => item.key === 'tablet_landscape')?.key || props.icons[0]?.key || 'desktop');
const min = ref('');
const unit = ref('em');
const width = ref('');
const saving = ref(false);
const errors = ref({});
const failed = ref('');

/** The storage key, from the name: lowercase, `_` between words, letters first. */
const handle = computed(() =>
  name.value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^[^a-z]+/, '')
    .replace(/_+$/, '')
);

const handleHint = computed(() => (handle.value ? props.strings.handle.replace(':handle', handle.value) : ''));

// The new size's keyboard shortcut: the site's own for it, written on its
// row. Its words are read here, as ShortcutInput reads its own, rather than
// handed in with `strings` by the shell's host. The site's layer is the
// setting plus the rows as they stand, so a row added or removed here counts.
const shortcut = ref('');
const keys = shortcutsConfig(window);
const mac = isMac(window.navigator);
const shortcutLabel = t(window, 'bp_add_shortcut');
const shortcutHint = t(window, 'bp_add_shortcut_hint');
const shortcuts = computed(() => resolveShortcutLayers(keys.builtIn, siteShortcuts(keys.site, rows.value, keys.locked), {}));
const sizeAction = computed(() => `size:${handle.value}`);

/** The shortcut a size has on this site, as the row lists it. */
function rowShortcut(row) {
  return formatCombo(shortcuts.value.map[`size:${row.handle}`] || '', mac);
}

/**
 * Another action with the shortcut. A built-in one gives it up to the new
 * size — the site's layer is over the built-in — so it may be moved here; one
 * the site gave it is changed where the site gave it, not from here.
 */
function shortcutOwner(combo) {
  const other = conflictsWith(shortcuts.value.map, combo, sizeAction.value);

  if (!other) {
    return null;
  }

  const label = other.startsWith('size:')
    ? rows.value.find((row) => `size:${row.handle}` === other)?.label
    : keys.labels[other];

  return { action: other, label: label || other, movable: shortcuts.value.level[other] === 0 };
}

const canSave = computed(() =>
  !saving.value && handle.value !== '' && min.value !== '' && Number(min.value) >= 0 && Number(width.value) >= 240
);

/** A preset fills the width and a matching preview width; everything stays editable. */
function usePreset(preset) {
  if (taken(preset)) {
    return;
  }

  min.value = unit.value === 'px' ? String(preset.px) : String(Math.round((preset.px / 16) * 100) / 100);
  width.value = String(preset.px);
}

/** Switching unit converts the number, so 48em and 768px stay the same line. */
watch(unit, (next, prev) => {
  const n = Number(min.value);

  if (min.value === '' || !Number.isFinite(n) || next === prev) {
    return;
  }

  if (prev === 'px' && next !== 'px') {
    min.value = String(Math.round((n / 16) * 100) / 100);
  } else if (prev !== 'px' && next === 'px') {
    min.value = String(Math.round(n * 16));
  }
});

async function submit() {
  if (!canSave.value) {
    return;
  }

  saving.value = true;
  errors.value = {};
  failed.value = '';

  const result = await props.onSave({
    handle: handle.value,
    label: name.value.trim(),
    icon: icon.value,
    min: Number(min.value),
    unit: unit.value,
    width: Math.round(Number(width.value)),
    shortcut: shortcut.value,
  });

  saving.value = false;

  if (result?.ok) {
    return;
  }

  errors.value = result?.errors || {};

  if (!Object.keys(errors.value).length) {
    failed.value = props.strings.failed;
  }
}
</script>

<template>
  <div
    id="__sve-bp-add"
    class="sve-bp-add"
    tabindex="-1"
    role="dialog"
    :aria-label="strings.title"
    :style="{ top: top + 'px', left: left + 'px' }"
    @click.stop
    @keydown.escape.stop.prevent="onClose"
  >
    <div class="sve-bp-add__title">{{ strings.sizes }}</div>

    <ul class="sve-bp-add__rows" :aria-label="strings.sizes">
      <li
        v-for="row in rows"
        :key="row.handle"
        class="sve-bp-add__rowitem"
        :data-confirming="confirming === row.handle ? '' : undefined"
      >
        <span class="sve-bp-add__rowicon" aria-hidden="true" v-html="iconFor(row)"></span>
        <span class="sve-bp-add__rowlabel">{{ row.label }}</span>
        <span v-if="rowShortcut(row)" class="sve-bp-add__rowkey" data-sve-bp-shortcut>{{ rowShortcut(row) }}</span>
        <span class="sve-bp-add__rowfrom">{{ row.min }}{{ row.unit }}</span>
        <button
          v-if="confirming === row.handle"
          type="button"
          class="sve-bp-add__remove sve-bp-add__remove--confirm"
          :disabled="removing !== ''"
          @click="removeRow(row)"
        >{{ removing === row.handle ? strings.saving : strings.removeConfirm }}</button>
        <button
          v-else
          type="button"
          class="sve-bp-add__remove"
          :disabled="!canRemove || removing !== ''"
          :title="canRemove ? strings.remove.replace(':label', row.label) : strings.removeLast"
          :aria-label="canRemove ? strings.remove.replace(':label', row.label) : strings.removeLast"
          @click="removeRow(row)"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </li>
    </ul>

    <p v-if="confirming" class="sve-bp-add__hint sve-bp-add__hint--block">{{ strings.removeHint }}</p>
    <p v-if="removeFailed" class="sve-bp-add__error">{{ removeFailed }}</p>

    <div class="sve-bp-add__title sve-bp-add__title--next">{{ strings.title }}</div>

    <p v-if="full" class="sve-bp-add__note">{{ strings.full }}</p>

    <form v-else class="sve-bp-add__form" @submit.prevent="submit">
      <label class="sve-bp-add__field">
        <span class="sve-bp-add__label">{{ strings.name }}</span>
        <input
          v-model="name"
          class="sve-bp-add__input sve-bp-add__name"
          type="text"
          maxlength="40"
          autocomplete="off"
          :placeholder="strings.namePlaceholder"
        />
        <span v-if="errors.handle" class="sve-bp-add__error">{{ errors.handle }}</span>
        <span v-else-if="handleHint" class="sve-bp-add__hint">{{ handleHint }}</span>
      </label>

      <div class="sve-bp-add__field">
        <span class="sve-bp-add__label">{{ strings.icon }}</span>
        <div class="sve-bp-add__icons" role="radiogroup" :aria-label="strings.icon">
          <button
            v-for="item in icons"
            :key="item.key"
            type="button"
            class="sve-bp-add__icon"
            role="radio"
            :aria-checked="icon === item.key ? 'true' : 'false'"
            :data-active="icon === item.key ? '' : undefined"
            :title="item.key"
            @click="icon = item.key"
            v-html="item.svg"
          ></button>
        </div>
      </div>

      <div class="sve-bp-add__field">
        <span class="sve-bp-add__label">{{ strings.presets }}</span>
        <div class="sve-bp-add__presets">
          <button
            v-for="preset in presets"
            :key="preset.key"
            type="button"
            class="sve-bp-add__preset"
            :disabled="taken(preset)"
            :title="preset.px + 'px'"
            @click="usePreset(preset)"
          ><span>{{ preset.key }} <small>{{ preset.px }}</small></span></button>
        </div>
      </div>

      <div class="sve-bp-add__row">
        <label class="sve-bp-add__field sve-bp-add__field--grow">
          <span class="sve-bp-add__label">{{ strings.from }}</span>
          <span class="sve-bp-add__join">
            <input
              v-model="min"
              class="sve-bp-add__input"
              type="number"
              min="0"
              step="any"
              inputmode="decimal"
            />
            <select v-model="unit" class="sve-bp-add__input sve-bp-add__unit" :aria-label="strings.unit">
              <option v-for="option in units" :key="option" :value="option">{{ option }}</option>
            </select>
          </span>
          <span v-if="errors.min" class="sve-bp-add__error">{{ errors.min }}</span>
        </label>

        <label class="sve-bp-add__field">
          <span class="sve-bp-add__label">{{ strings.previewWidth }}</span>
          <span class="sve-bp-add__join">
            <input
              v-model="width"
              class="sve-bp-add__input sve-bp-add__width"
              type="number"
              min="240"
              max="3840"
              step="1"
              inputmode="numeric"
            />
            <span class="sve-bp-add__unit sve-bp-add__unit--static">px</span>
          </span>
          <span v-if="errors.width" class="sve-bp-add__error">{{ errors.width }}</span>
        </label>
      </div>

      <p class="sve-bp-add__hint sve-bp-add__hint--block">{{ strings.fromHint }}</p>
      <p class="sve-bp-add__hint sve-bp-add__hint--block">{{ direction === 'mobile' ? strings.directionMobile : strings.directionDesktop }}</p>

      <div class="sve-bp-add__field" data-sve-bp-add-shortcut>
        <span class="sve-bp-add__label">{{ shortcutLabel }}</span>
        <span class="sve-bp-add__shortcut">
          <ShortcutInput
            :value="shortcut"
            :inherited="keys.builtIn[sizeAction] || ''"
            :mac="mac"
            :locked="keys.locked"
            :owner="shortcutOwner"
            :label="shortcutLabel"
            @change="(value) => (shortcut = value)"
          />
        </span>
        <span v-if="errors.shortcut" class="sve-bp-add__error">{{ errors.shortcut }}</span>
        <span v-else class="sve-bp-add__hint">{{ shortcutHint }}</span>
      </div>

      <p v-if="failed" class="sve-bp-add__error">{{ failed }}</p>

      <div class="sve-bp-add__actions">
        <button type="button" class="sve-bp-add__btn" @click="onClose">{{ strings.cancel }}</button>
        <button type="submit" class="sve-bp-add__btn sve-bp-add__btn--primary" :disabled="!canSave">
          {{ saving ? strings.saving : strings.save }}
        </button>
      </div>
    </form>
  </div>
</template>

<style>
/* Not scoped, like LpToolbarAddMenu: everything sits under .sve-bp-add,
   which only this popover uses. Same surface, radius and shadow as the top
   bar's «+» popover, so the two read as one family. */
.sve-bp-add {
  position: fixed;
  z-index: 2147483001;
  box-sizing: border-box;
  width: 21rem;
  padding: 0.625rem;
  border-radius: 0.625rem;
  background: #343439;
  color: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0.75rem 2.5rem rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.12);
  font: 500 0.8125rem/1.3 ui-sans-serif, system-ui, sans-serif;
  outline: none;
}

.sve-bp-add__title {
  padding: 0.125rem 0.25rem 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
}

/* The second heading, over the form: a hairline above, as a new section. */
.sve-bp-add__title--next {
  margin-top: 0.5rem;
  padding-top: 0.625rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* The sizes the site has. One line each: picture, name, where it starts,
   and the way out at the right edge. */
.sve-bp-add__rows {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sve-bp-add__rowitem {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 1.75rem;
  padding: 0 0.25rem 0 0.375rem;
  border-radius: 0.375rem;
}

.sve-bp-add__rowitem:hover,
.sve-bp-add__rowitem[data-confirming] {
  background: rgba(255, 255, 255, 0.06);
}

.sve-bp-add__rowicon {
  display: inline-flex;
  flex: 0 0 auto;
  color: rgba(255, 255, 255, 0.8);
}

.sve-bp-add__rowicon svg {
  display: block;
  width: 0.9375rem;
  height: 0.9375rem;
}

.sve-bp-add__rowlabel {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sve-bp-add__rowfrom {
  flex: 0 0 auto;
  font-size: 0.6875rem;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.55);
}

/* The size's keyboard shortcut, before where it starts. */
.sve-bp-add__rowkey {
  flex: 0 0 auto;
  font-size: 0.6875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

/* The recorder sits at the field's start, its note under it, left-aligned. */
.sve-bp-add__shortcut {
  display: flex;
}

.sve-bp-add__shortcut .sve-shortcut {
  justify-content: flex-start;
}

.sve-bp-add__shortcut .sve-shortcut__note {
  text-align: left;
}

/* The × — quiet until the row is hovered; red once asked; disabled when the
   list is at its minimum, with the reason in its title. */
.sve-bp-add__remove {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  height: 1.375rem;
  min-width: 1.375rem;
  padding: 0;
  border-radius: 0.3125rem;
  color: rgba(255, 255, 255, 0.55);
  font: inherit;
  font-size: 0.6875rem;
  cursor: pointer;
}

.sve-bp-add__remove:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.sve-bp-add__remove:focus-visible {
  outline: 0.125rem solid var(--theme-color-primary, #4f46e5);
}

.sve-bp-add__remove:disabled {
  opacity: 0.3;
  cursor: default;
}

.sve-bp-add__remove--confirm {
  padding: 0 0.5rem;
  background: #b91c1c;
  color: #fff;
  font-weight: 600;
}

.sve-bp-add__remove--confirm:hover:not(:disabled) {
  background: #dc2626;
}

.sve-bp-add__form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sve-bp-add__row {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.sve-bp-add__field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  padding: 0 0.25rem;
}

.sve-bp-add__field--grow {
  flex: 1 1 auto;
}

.sve-bp-add__label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.7);
}

.sve-bp-add__input {
  box-sizing: border-box;
  height: 1.75rem;
  padding: 0 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 0.375rem;
  background: rgba(255, 255, 255, 0.06);
  color: inherit;
  font: inherit;
  min-width: 0;
}

.sve-bp-add__input:focus-visible {
  outline: 0.125rem solid var(--theme-color-primary, #4f46e5);
  outline-offset: 0;
}

.sve-bp-add__input::placeholder {
  color: rgba(255, 255, 255, 0.38);
}

.sve-bp-add__input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.sve-bp-add__input[type='number']::-webkit-inner-spin-button,
.sve-bp-add__input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.sve-bp-add__join {
  display: inline-flex;
  align-items: stretch;
}

.sve-bp-add__join > .sve-bp-add__input {
  flex: 1 1 auto;
  width: 5rem;
  border-start-end-radius: 0;
  border-end-end-radius: 0;
}

/* The unit after the number. The select carries __input too for the shared
   frame, so this stands below the join rule above and takes it back: its own
   width, square where it meets the number, round at the outer end. */
.sve-bp-add__unit,
.sve-bp-add__join > .sve-bp-add__unit {
  flex: 0 0 auto;
  box-sizing: border-box;
  width: auto;
  height: 1.75rem;
  padding: 0 0.625rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-inline-start: none;
  border-radius: 0 0.375rem 0.375rem 0;
  background: rgba(255, 255, 255, 0.1);
  color: inherit;
  font: inherit;
  font-size: 0.75rem;
}

/* The browser's own select keeps square corners and its own arrow whatever
   the radius says. Drawn here instead: our padding, our chevron, our corners.
   Heavier than the unit rule above, not only later — that one's `background`
   shorthand would otherwise wipe the chevron and its padding the room for it. */
.sve-bp-add__join > select.sve-bp-add__unit {
  appearance: none;
  -webkit-appearance: none;
  padding-inline-end: 1.625rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.75)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 0.75rem;
  cursor: pointer;
}

select.sve-bp-add__unit:focus-visible {
  outline: 0.125rem solid var(--theme-color-primary, #4f46e5);
  outline-offset: 0;
}

select.sve-bp-add__unit option {
  background: #343439;
  color: rgba(255, 255, 255, 0.92);
}

.sve-bp-add__unit--static {
  display: inline-flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
}

.sve-bp-add__width {
  width: 4.5rem;
}

.sve-bp-add__icons,
.sve-bp-add__presets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.sve-bp-add__icon {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.375rem;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
}

.sve-bp-add__icon svg {
  display: block;
  width: 0.9375rem;
  height: 0.9375rem;
}

.sve-bp-add__icon:hover {
  background: rgba(255, 255, 255, 0.08);
}

.sve-bp-add__icon[data-active] {
  background: var(--theme-color-primary, #4f46e5);
  color: #fff;
}

.sve-bp-add__icon:focus-visible {
  outline: 0.125rem solid var(--theme-color-primary, #4f46e5);
}

/* One span inside, so key and px share a baseline while the pair sits in the
   middle of the pill. Two flex items on `baseline` lined up with each other
   but hung from the top of the fixed height. */
.sve-bp-add__preset {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.5rem;
  padding: 0 0.5rem;
  border-radius: 0.375rem;
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  font-size: 0.75rem;
  cursor: pointer;
}

.sve-bp-add__preset small {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.55);
}

.sve-bp-add__preset:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.14);
}

.sve-bp-add__preset:focus-visible {
  outline: 0.125rem solid var(--theme-color-primary, #4f46e5);
}

.sve-bp-add__preset:disabled {
  opacity: 0.35;
  cursor: default;
}

.sve-bp-add__hint {
  margin: 0;
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.55);
}

.sve-bp-add__hint--block {
  padding: 0 0.25rem;
}

.sve-bp-add__note {
  margin: 0;
  padding: 0.25rem 0.25rem 0.5rem;
  color: rgba(255, 255, 255, 0.7);
}

.sve-bp-add__error {
  margin: 0;
  padding: 0 0.25rem;
  font-size: 0.6875rem;
  color: #fca5a5;
}

.sve-bp-add__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.375rem;
  padding: 0.25rem 0.25rem 0;
}

.sve-bp-add__btn {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  height: 1.75rem;
  padding: 0 0.75rem;
  border-radius: 0.375rem;
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.sve-bp-add__btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.14);
}

.sve-bp-add__btn--primary {
  background: var(--theme-color-primary, #4f46e5);
  color: #fff;
}

.sve-bp-add__btn--primary:hover:not(:disabled) {
  background: var(--theme-color-primary, #4f46e5);
  filter: brightness(1.1);
}

.sve-bp-add__btn:disabled {
  opacity: 0.45;
  cursor: default;
}

.sve-bp-add__btn:focus-visible {
  outline: 0.125rem solid #fff;
  outline-offset: 0.0625rem;
}
</style>
