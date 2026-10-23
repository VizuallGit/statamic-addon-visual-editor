<template>
  <span class="sve-theme__input sve-theme__color" :class="{ 'is-open': open }">
    <button
      ref="button"
      type="button"
      class="sve-theme__color-button"
      :data-sve-input="token"
      :data-value="value"
      :aria-label="label"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="toggle"
      @keydown.down.prevent="openList(true)"
    >
      <span class="sve-theme__forms-swatch" :class="{ 'is-clear': clear(swatch) }" :style="clear(swatch) ? null : { background: swatch }" aria-hidden="true"></span>
      <span class="sve-theme__color-name">{{ current }}</span>
      <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <div
      v-if="open"
      ref="list"
      class="sve-theme__color-list"
      role="listbox"
      :aria-label="label"
      :data-sve-options="token"
      popover="manual"
      :style="place"
      @keydown.esc.prevent="close(true)"
      @keydown.down.prevent="move(1)"
      @keydown.up.prevent="move(-1)"
    >
      <button v-if="value && !known" type="button" role="option" class="sve-theme__color-option is-on" :data-value="value" aria-selected="true" @click="pick(value)">
        <span class="sve-theme__forms-swatch" :class="{ 'is-clear': clear(swatch) }" :style="clear(swatch) ? null : { background: swatch }" aria-hidden="true"></span>
        <span class="sve-theme__color-name">{{ value }}</span>
      </button>
      <template v-for="group in groups" :key="group.key">
        <div v-if="group.label" class="sve-theme__color-group">{{ group.label }}</div>
        <button
          v-for="o in group.options"
          :key="o.value"
          type="button"
          role="option"
          class="sve-theme__color-option"
          :class="{ 'is-on': o.value === value }"
          :data-value="o.value"
          :aria-selected="o.value === value"
          @click="pick(o.value)"
        >
          <span class="sve-theme__forms-swatch" :class="{ 'is-clear': clear(o.swatch) }" :style="clear(o.swatch) ? null : { background: o.swatch }" aria-hidden="true"></span>
          <span class="sve-theme__color-name">{{ o.label }}</span>
        </button>
      </template>
    </div>
  </span>
</template>

<script setup>
/**
 * A theme color as a token, picked from a list that shows each color: white,
 * black and transparent first, then a group per color of the Colors tab — its
 * base, then each step — each with a swatch before its name, so a field points
 * at `var(--color-primary-500)` and follows the palette. A value the list does
 * not have (written by hand in site.css) is still shown, as the first option.
 *
 * The list is a popover: it opens in the browser's top layer, so the panel's
 * own scrolling and clipping do not cut it off. It sits under the button, or
 * above it when the viewport has no room below.
 */
import { computed, nextTick, onBeforeUnmount, ref } from 'vue';
import { themePanelUi as ui } from '../theme-panel/store.js';
import { sampleColor } from '../theme-panel/samples.js';

const props = defineProps({
  value: { type: String, default: '' },
  /** The token it writes, for the button's `data-sve-input`. */
  token: { type: String, default: '' },
  label: { type: String, default: '' },
  /** Only the palette's colors — no white, black or transparent (a highlight points at the palette). */
  paletteOnly: { type: Boolean, default: false },
  onChange: { type: Function, required: true },
});

const button = ref(null);
const list = ref(null);
const open = ref(false);
const place = ref(null);

const clear = (swatch) => !swatch || swatch === 'transparent';

const groups = computed(() => {
  const basics = [
    { value: 'var(--color-white)', label: 'white' },
    { value: 'var(--color-black)', label: 'black' },
    { value: 'transparent', label: ui.labels.forms_transparent || 'transparent' },
  ];
  const seen = new Set(basics.map((o) => o.value));
  const once = (o) => !seen.has(o.value) && seen.add(o.value);
  const families = ui.families
    .filter((f) => f.name && !f.problem)
    .map((f) => ({
      key: `family-${f.name}`,
      label: f.name,
      options: [
        ...(f.value ? [{ value: `var(--color-${f.name})`, label: f.name }] : []),
        ...(f.steps || []).map((s) => ({ value: `var(--color-${f.name}-${s.name})`, label: `${f.name}-${s.name}` })),
      ].filter(once),
    }))
    .filter((g) => g.options.length);
  const all = props.paletteOnly ? families : [{ key: 'basics', label: ui.labels.forms_basics || '', options: basics }, ...families];

  return all.map((g) => ({ ...g, options: g.options.map((o) => ({ ...o, swatch: sampleColor(o.value, ui.families) })) }));
});

const known = computed(() => groups.value.some((g) => g.options.some((o) => o.value === props.value)));

const current = computed(() => {
  for (const g of groups.value) {
    const o = g.options.find((x) => x.value === props.value);

    if (o) {
      return o.label;
    }
  }

  return props.value || '';
});

const swatch = computed(() => sampleColor(props.value, ui.families));

function toggle() {
  if (open.value) {
    close();
  } else {
    openList();
  }
}

async function openList(focusCurrent = false) {
  if (open.value) {
    return;
  }

  open.value = true;
  await nextTick();

  const el = list.value;

  if (!el) {
    return;
  }

  el.showPopover?.();
  position();
  document.addEventListener('pointerdown', onOutside, true);
  window.addEventListener('resize', position);
  window.addEventListener('scroll', position, true);

  if (focusCurrent) {
    (el.querySelector('.is-on') || el.querySelector('[role="option"]'))?.focus();
  }
}

/** Under the button; above it when the viewport has no room below. */
function position() {
  const anchor = button.value?.getBoundingClientRect();
  const el = list.value;

  if (!anchor || !el) {
    return;
  }

  const gap = 4;
  const below = window.innerHeight - anchor.bottom - gap;
  const above = anchor.top - gap;
  const wanted = el.scrollHeight;
  const up = below < Math.min(wanted, 240) && above > below;
  const room = Math.max(120, (up ? above : below) - 8);

  place.value = {
    left: `${Math.max(8, Math.min(anchor.left, window.innerWidth - el.offsetWidth - 8))}px`,
    minWidth: `${anchor.width}px`,
    maxHeight: `${Math.min(wanted, room)}px`,
    ...(up ? { bottom: `${window.innerHeight - anchor.top + gap}px`, top: 'auto' } : { top: `${anchor.bottom + gap}px`, bottom: 'auto' }),
  };
}

function onOutside(event) {
  if (!list.value?.contains(event.target) && !button.value?.contains(event.target)) {
    close();
  }
}

function close(refocus = false) {
  if (!open.value) {
    return;
  }

  document.removeEventListener('pointerdown', onOutside, true);
  window.removeEventListener('resize', position);
  window.removeEventListener('scroll', position, true);
  list.value?.hidePopover?.();
  open.value = false;
  place.value = null;

  if (refocus) {
    button.value?.focus();
  }
}

function move(step) {
  const options = [...(list.value?.querySelectorAll('[role="option"]') || [])];
  const at = options.indexOf(document.activeElement);
  const next = options[at < 0 ? (step > 0 ? 0 : options.length - 1) : Math.min(options.length - 1, Math.max(0, at + step))];

  next?.focus();
}

function pick(value) {
  close(true);

  if (value !== props.value) {
    props.onChange(value);
  }
}

onBeforeUnmount(() => close());
</script>
