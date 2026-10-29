<script setup>
/**
 * One value a designer sets: a token (`500`), a value (`10px`, `4rem`,
 * `calc(…)`) or a custom property (`--gutter`, `var(--gutter)`).
 *
 * `tool` is a CSS_TOOLS tool or child (`css` the property it sets, `tw` the
 * property Tailwind's classic scale is built on). What it reads is the
 * picked tag's class for that property at the size and state picked, through
 * the site's own Tailwind catalog (`port.propertyOf`).
 *
 * A click opens the Tailwind pane's menu under the field
 * (`port.openValueMenu`, tw-classes.js): the site's scale, its search, and the
 * row under the pointer or the arrows shown on the canvas before it is
 * picked — the background field's menu, for every value. Text typed into the
 * search that is not a row is written as the value it reads as (`typedClass`),
 * unless `typed` is off: a list of named values (position, font-weight) takes
 * its rows only.
 *
 * Light text is a value that comes from a wider size, the plain state, or a
 * broader property (all four sides, the axis): a pick writes the field's own
 * class. A physical class the file already had for this side (`pt-800` under
 * padding-block-start) is the field's own, and a pick takes its place.
 *
 * `scrub` (a unit: px, rem, em, %) lets the field be dragged as well as
 * clicked — Spacing's box (BuildSpacingBox.vue). Up is more, down is less,
 * one step per few pixels, ten with Shift; the value is written as the pick of
 * a typed value would write it (`pt-[5rem]`), through the pane's own set, at
 * most once a frame and only when it changed, so the canvas follows the drag
 * and the dock saves once after it. A press that does not move is the click
 * it always was: the menu, with the scale, the custom properties and typing.
 */
import { computed, inject, ref, watch } from 'vue';
import { effectiveClass, fromClass, kindOf, rootFor, rootOf, typedClass, variantChain } from '../../build-mode/classes.js';

const props = defineProps({
  tool: { type: Object, required: true },
  /** Broader properties that show through when this one is not set, nearest first. */
  fallbacks: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  /** In a narrow field: the custom property without `var()`. */
  compact: { type: Boolean, default: false },
  /** A token from the site's scale reads as a chip (`primary`, `500`). */
  chip: { type: Boolean, default: false },
  /** What an empty field says. */
  empty: { type: String, default: '—' },
  /** Text typed into the menu's search is written as a value; off for a list of named values. */
  typed: { type: Boolean, default: true },
  /** A unit (`px`, `rem`, `em`, `%`): the field is dragged up and down as well as clicked. '' = click only. */
  scrub: { type: String, default: '' },
  /** A dragged value may go below zero (margin). */
  negative: { type: Boolean, default: false },
});

defineOptions({ inheritAttrs: false });

const port = inject('sveBuild');

const property = computed(() => props.tool.css || props.tool.tw || '');
/** The physical twin Tailwind's classic scale uses (`padding-top` for `padding-block-start`). */
const twin = computed(() => (props.tool.tw && props.tool.tw !== property.value ? props.tool.tw : ''));

/**
 * The property the scale is offered for: the twin's whenever it has one —
 * Tailwind's classic `pt` `pr` `pb` `pl`, never the logical `pbs` `pe` that
 * Tailwind 4.2 added — and the field's own only where there is no twin.
 */
const scaleProperty = computed(() => {
  port.rev.value;

  return twin.value && port.scale(twin.value).length ? twin.value : property.value;
});
const scale = computed(() => (port.rev.value, port.scale(scaleProperty.value)));
const prefix = computed(() => rootOf(scale.value));

const current = computed(() => {
  port.rev.value;

  const chain = variantChain(port.sizes(), port.size(), port.state());
  const classes = port.pickedClasses().join(' ');
  const properties = [property.value, twin.value, ...props.fallbacks].filter(Boolean);
  const hit = effectiveClass(classes, properties, chain, port.propertyOf);

  // The twin is this side in physical words: its class is the field's own, as the
  // comment above says — inherited only when it comes from a wider size or state.
  if (hit?.inherited && twin.value && hit.property === twin.value) {
    const mine = effectiveClass(classes, [twin.value], chain, port.propertyOf);

    if (mine && !mine.inherited) {
      return mine;
    }
  }

  return hit;
});
const own = computed(() => (current.value && !current.value.inherited ? current.value : null));
const shown = computed(() => (current.value ? fromClass(current.value.name, rootFor(current.value.name, scale.value)) : ''));

/** A name from the site's scale, not a typed value or a custom property. */
const isToken = computed(() => !!current.value && !/[[(]/.test(current.value.name));

const display = (value) => (props.compact ? value.replace(/^var\((--[\w-]+)\)$/, '$1') : value);
const text = computed(() => (current.value ? display(shown.value) : props.empty));
/** While dragged: the value the drag is on, shown instead of `text`. */
const live = ref(null);
const showing = computed(() => (live.value !== null ? live.value : text.value));

const trigger = ref(null);

/* ---------------- dragged (scrub) ---------------- */

/** One step of each unit, and the pixels of pointer travel it takes. */
const STEP = { px: 1, rem: 0.25, em: 0.25, '%': 1 };
const PIXELS_PER_STEP = 3;
/** Moved this far, a press is a drag and not a click. */
const SLOP = 3;
let dragged = false;

/** The number the field shows in `unit` (`5rem` → 5), or 0 for a token, a custom property or another unit. */
function startValue(unit) {
  const m = /^(-?\d*\.?\d+)([a-z%]*)$/i.exec(String(own.value ? shown.value : '').trim());

  if (!m) {
    return 0;
  }

  return m[2] === unit || (m[2] === '' && Number(m[1]) === 0) ? Number(m[1]) : 0;
}

function press(event) {
  const unit = props.scrub;

  if (!unit || event.button !== 0) {
    return;
  }

  const el = event.currentTarget;
  const pointer = event.pointerId;
  const y0 = event.clientY;
  const from = startValue(unit);
  const step = STEP[unit] || 1;
  // Asked again each move: the scale (and with it the prefix) may still be on its way the first time.
  const root = () => prefix.value || (own.value ? rootFor(own.value.name) : '');
  const kind = kindOf(property.value);
  let moving = false;
  let wrote = own.value?.name || '';
  let frame = 0;
  let want = '';

  dragged = false;

  const valueAt = (y, shift) => {
    const steps = Math.round((y0 - y) / PIXELS_PER_STEP) * (shift ? 10 : 1);
    const n = Math.round((from + steps * step) * 1000) / 1000;

    return props.negative ? n : Math.max(0, n);
  };

  const write = () => {
    frame = 0;

    // In the field's place, as its menu writes: an old `pbs-…` under the top's field goes as `pt-…` comes.
    if (want && want !== wrote) {
      port.setFieldClass(want, own.value?.raw || '');
      wrote = want;
    }
  };

  const onMove = (e) => {
    if (e.pointerId !== pointer) {
      return;
    }

    if (!moving) {
      if (Math.abs(e.clientY - y0) < SLOP) {
        return;
      }

      moving = true;
      dragged = true;

      try {
        el.setPointerCapture(pointer);
      } catch {
        /* the document listeners follow it anyway */
      }
    }

    e.preventDefault();

    const n = valueAt(e.clientY, e.shiftKey);
    const value = n === 0 ? '0' : `${n}${unit}`;

    live.value = value;
    want = root() ? typedClass(value, scale.value, root(), kind) || '' : '';

    if (!frame) {
      frame = window.requestAnimationFrame(write);
    }
  };

  const onUp = (e) => {
    if (e.pointerId !== pointer) {
      return;
    }

    document.removeEventListener('pointermove', onMove, true);
    document.removeEventListener('pointerup', onUp, true);
    document.removeEventListener('pointercancel', onUp, true);

    if (frame) {
      window.cancelAnimationFrame(frame);
      write();
    }

    // Let go before the site's scale arrived: the value is written the moment it does.
    const last = live.value;

    if (moving && last !== null && !root()) {
      const stop = watch(prefix, (p) => {
        if (p) {
          stop();

          const name = typedClass(last, scale.value, p, kind);

          if (name && name !== own.value?.name) {
            port.setFieldClass(name, own.value?.raw || '');
          }
        }
      });
    }

    live.value = null;
  };

  document.addEventListener('pointermove', onMove, true);
  document.addEventListener('pointerup', onUp, true);
  document.addEventListener('pointercancel', onUp, true);
}

/** A click — unless it ends a drag. */
function clicked() {
  if (dragged) {
    dragged = false;

    return;
  }

  open();
}

/** The field's menu, under the field — or under `anchor` (a colour field's swatch). */
function open(anchor) {
  const at = anchor || trigger.value?.closest('.fg-field') || trigger.value;

  if (!at) {
    return;
  }

  const root = prefix.value || (own.value ? rootFor(own.value.name) : '');

  port.openValueMenu(at, {
    property: scaleProperty.value,
    title: property.value,
    own: own.value ? { raw: own.value.raw, name: own.value.name } : null,
    free: props.typed ? (value) => typedClass(value, scale.value, root, kindOf(property.value)) || '' : null,
  });
}

defineExpose({ open });
</script>

<template>
  <span
    v-if="chip && isToken"
    class="fg-chip"
    :class="{ inh: current.inherited }"
    @click.prevent="open()"
  >{{ display(shown) }}</span>
  <button
    v-bind="$attrs"
    ref="trigger"
    type="button"
    class="bm-vin"
    :class="{ inh: live === null && current && current.inherited, 'is-empty': live === null && !current, 'has-chip': chip && isToken, 'is-scrub': !!scrub, 'is-live': live !== null }"
    :title="label || property"
    :aria-label="label || property"
    aria-haspopup="listbox"
    :data-sve-build-value="label || property"
    @pointerdown="press"
    @click="clicked"
    @keydown.down.prevent="open()"
  >{{ showing }}</button>
</template>
