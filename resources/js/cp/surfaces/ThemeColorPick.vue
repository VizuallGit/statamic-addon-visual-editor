<template>
  <span class="sve-theme__colorpick" :class="{ 'is-compact': compact }">
    <button
      ref="trigger"
      type="button"
      class="sve-theme__input sve-theme__colorpick-trigger"
      :class="{ 'is-inherited': !value && compact, 'is-own': compact && !!value, 'is-open': open }"
      :aria-label="label"
      :aria-expanded="open"
      :title="title"
      @click="toggle"
    >
      <i class="sve-theme__dot" :class="{ 'is-empty': !shownColor }" :style="{ background: shownColor }" aria-hidden="true"></i>
      <span v-if="!compact" class="sve-theme__colorpick-name">{{ shownName }}</span>
      <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
    </button>

    <div
      v-if="open"
      ref="pop"
      class="sve-theme__colorpop"
      role="dialog"
      :aria-label="label"
      :style="popStyle"
      @keydown.esc.stop="close()"
    >
      <button type="button" class="sve-theme__colorpop-none" :class="{ 'is-picked': !value }" @click="pick('')">
        <i class="sve-theme__dot is-empty" :style="{ background: inheritColor || '' }" aria-hidden="true"></i>
        <span>{{ emptyLabel }}</span>
      </button>
      <div v-for="f in families" :key="f.name" class="sve-theme__colorpop-family">
        <span class="sve-theme__colorpop-title">--{{ f.name }}</span>
        <div class="sve-theme__swatches">
          <button
            v-for="o in f.options"
            :key="o.value"
            type="button"
            class="sve-theme__swatch is-nudgeable"
            :class="{ 'is-picked': o.value === value }"
            :title="`${o.short}  ${o.swatch}`"
            @click="pick(o.value)"
          >
            <span class="sve-theme__swatch-color" :style="{ background: o.swatch }"></span>
            <span class="sve-theme__swatch-name">{{ o.step }}</span>
          </button>
        </div>
      </div>
      <div v-if="custom" class="sve-theme__colorpop-family">
        <span class="sve-theme__colorpop-title">{{ customLabel }}</span>
        <div class="sve-theme__swatches">
          <button type="button" class="sve-theme__swatch is-nudgeable is-picked" :title="value" @click="pick(value)">
            <span class="sve-theme__swatch-color" :style="{ background: value }"></span>
            <span class="sve-theme__swatch-name">{{ value }}</span>
          </button>
        </div>
      </div>
    </div>
  </span>
</template>

<script setup>
/**
 * A text color chosen from the theme's colors the way the Colors tab shows
 * them: one row of swatches per color, its steps under it. The trigger shows
 * the chosen color as a dot (and its name, unless compact — a level's cell);
 * an empty value follows something else (`inheritColor`, dimmed).
 *
 * The popover is `position: fixed` and placed from the trigger's box, so the
 * narrow panel and its scrolling never clip it. It closes on a pick, Escape,
 * a click outside, or when the panel scrolls.
 */
import { computed, nextTick, onBeforeUnmount, ref } from 'vue';

const props = defineProps({
  /** `var(--color-…)`, a hand-written color, or '' for none. */
  value: { type: String, default: '' },
  /** `{ value, short, swatch, family, step }` — the theme's colors, in palette order. */
  options: { type: Array, required: true },
  /** The first choice: what '' means ("None — as the page", "primary-800 · as the headings"). */
  emptyLabel: { type: String, default: '' },
  /** The color '' follows, for the dimmed dot; '' when it follows nothing. */
  inheritColor: { type: String, default: '' },
  customLabel: { type: String, default: 'Custom' },
  compact: { type: Boolean, default: false },
  label: { type: String, default: '' },
  onChange: { type: Function, required: true },
});

const open = ref(false);
const trigger = ref(null);
const pop = ref(null);
const popStyle = ref({});

const current = computed(() => props.options.find((o) => o.value === props.value) || null);
/** A value no theme color matches (written by hand in site.css) stays a choice. */
const custom = computed(() => !!props.value && !current.value);
const shownColor = computed(() => (props.value ? current.value?.swatch || props.value : props.inheritColor));
const shownName = computed(() => (props.value ? current.value?.short || props.value : props.emptyLabel));
const title = computed(() => (props.value ? `${shownName.value}` : props.emptyLabel));

const families = computed(() => {
  const out = [];

  for (const o of props.options) {
    let f = out.find((x) => x.name === o.family);

    if (!f) {
      f = { name: o.family, options: [] };
      out.push(f);
    }

    f.options.push(o);
  }

  return out;
});

const WIDTH = 288;

function place() {
  const box = trigger.value?.getBoundingClientRect();
  const win = trigger.value?.ownerDocument?.defaultView;

  if (!box || !win) {
    return;
  }

  const left = Math.max(8, Math.min(box.right - WIDTH, win.innerWidth - WIDTH - 8));
  const below = win.innerHeight - box.bottom - 8;
  const maxHeight = Math.max(180, Math.max(below, box.top - 8));
  const top = below >= 240 || below >= box.top ? box.bottom + 4 : Math.max(8, box.top - 4 - Math.min(maxHeight, 420));

  popStyle.value = { left: `${left}px`, top: `${top}px`, width: `${WIDTH}px`, maxHeight: `${Math.min(maxHeight, 420)}px` };
}

function onOutside(e) {
  if (!pop.value?.contains(e.target) && !trigger.value?.contains(e.target)) {
    close(false);
  }
}

function onScroll(e) {
  if (!pop.value?.contains(e.target)) {
    close(false);
  }
}

function listen(on) {
  const doc = trigger.value?.ownerDocument;

  if (!doc) {
    return;
  }

  const method = on ? 'addEventListener' : 'removeEventListener';

  doc[method]('mousedown', onOutside, true);
  doc[method]('scroll', onScroll, true);
  doc.defaultView?.[method]('resize', onResize);
}

async function toggle() {
  if (open.value) {
    close();

    return;
  }

  place();
  open.value = true;
  listen(true);
  await nextTick();
  pop.value?.querySelector('.is-picked')?.focus();
}

function onResize() {
  close(false);
}

/** Closes; back to the trigger when it closed on purpose (a pick, Escape), not on a click elsewhere. */
function close(refocus = true) {
  if (!open.value) {
    return;
  }

  open.value = false;
  listen(false);

  if (refocus) {
    trigger.value?.focus();
  }
}

function pick(v) {
  props.onChange(v);
  close();
}

onBeforeUnmount(() => listen(false));
</script>
