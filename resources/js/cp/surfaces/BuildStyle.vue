<script setup>
/**
 * Build's Style tab in the Figma look (the element's name, duplicate and
 * delete are the panel's, above its tabs): sections with a plain bold title, a
 * `+` on the ones nothing is set in yet, small labels over the fields, two
 * fields to a row with their prefix inside (W, H, a gap or padding icon),
 * Flow as icons and Figma's nine-cell alignment box.
 *
 * The families, their order and everything a control does are the same as
 * the sketch version: every click is the Tailwind pane's own (`port.setClass`
 * → twSetClass, `port.openValueMenu` → the pane's menu with its search and
 * canvas preview, `port.run` → runTwTool, the pane's state menu, the strip's
 * twSetTag), on the same CSS_TOOLS tools. A dock tool this layout never drew
 * is drawn in its family from its shape.
 *
 * Spacing is drawn one of two ways, switched in its header and kept in this
 * browser: the box (BuildSpacingBox.vue, padding | margin as tabs — the
 * default) or the Figma fields (BuildBoxFields.vue, both at once).
 */
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import BuildAlign from './BuildAlign.vue';
import BuildAlignMatrix from './BuildAlignMatrix.vue';
import BuildBoxFields from './BuildBoxFields.vue';
import BuildSpacingBox from './BuildSpacingBox.vue';
import BuildColorField from './BuildColorField.vue';
import BuildField from './BuildField.vue';
import BuildFields from './BuildFields.vue';
import BuildValueInput from './BuildValueInput.vue';
import TwClassList from './TwClassList.vue';
import { BUILD_KIDS, STRUCTURES, STYLE_FIELDS, fieldHas, kidsById, styleGroups } from '../../build-mode/catalog.js';
import { effectiveClass, fromClass, rootOf, variantChain } from '../../build-mode/classes.js';
import { groupIcon, ic } from '../../build-mode/icons.js';

const props = defineProps({
  node: { type: Object, required: true },
});

const port = inject('sveBuild');
const root = ref(null);
const stateBtn = ref(null);
const groups = computed(() => styleGroups(port.lists.cssTools));
const tools = computed(() => new Map(groups.value.flatMap((group) => group.tools).map((item) => [item.id, item])));
const tool = (id) => tools.value.get(id);

/* ---------------- what the element has, at the size and state picked ---------------- */

const chain = computed(() => (port.rev.value, variantChain(port.sizes(), port.size(), port.state())));
const classes = computed(() => (port.rev.value, port.pickedClasses()));

function eff(property) {
  return effectiveClass(classes.value.join(' '), [property], chain.value, port.propertyOf);
}

function effGroup(names) {
  return effectiveClass(classes.value.join(' '), ['group'], chain.value, (name) => (names.includes(name) ? 'group' : ''));
}

const pressed = (hit, name) => !!hit && hit.name === name;
const inh = (hit, name) => !!hit && hit.name === name && hit.inherited;

/** Set a class unless it is already what shows here — a click that means "this one" never toggles it off. */
function ensure(property, name) {
  if (eff(property)?.name !== name) {
    port.setClass(name);
  }
}

/* ---------------- sizes and state ---------------- */

const sizes = computed(() => {
  port.rev.value;

  return [{ handle: null, label: port.t('size_all'), icon: 'all' }, ...port.sizes()];
});
const sizeNow = computed(() => (port.rev.value, port.size()));
const stateNow = computed(() => (port.rev.value, port.state()));
const deviceIcon = (name) => (name === 'all' ? ic('sidesAll') : port.lists.deviceIcons?.[name] || '');

const sizeHint = computed(() => {
  const rows = port.sizes();
  const row = rows.find((item) => item.handle === sizeNow.value);
  const where = !row
    ? port.t('size_hint_all')
    : !row.base && (row === rows[rows.length - 1] || row === rows[0])
      ? row.label
      : port.t(row.direction === 'mobile' ? 'size_hint_up' : 'size_hint_down', { size: row.label });
  const what = stateNow.value ? port.t('size_hint_state', { size: where, state: stateNow.value }) : where;

  return port.t('size_hint', { size: `<b>${what}</b>` });
});

/* ---------------- the element ---------------- */

/* ---------------- Layout ---------------- */

const display = computed(() => eff('display'));
const disp = computed(() => display.value?.name || 'block');
const isColumn = computed(() => /^flex-col/.test(eff('flex-direction')?.name || ''));
const FLOW_OF = { grid: 'grid', block: 'block', hidden: 'none', inline: 'inline' };
const flow = computed(() => (disp.value === 'flex' ? (isColumn.value ? 'col' : 'row') : FLOW_OF[disp.value] || 'other'));

function setFlow(next) {
  if (next === 'block') {
    const own = port.activeClass('display');

    if (own && own !== 'block') {
      port.setClass(own);
    }

    // Block is what an element is with no display class: write it only
    // when a wider size or the plain state still makes it flex or grid.
    const left = eff('display')?.name;

    if (left && left !== 'block') {
      port.setClass('block');
    }

    return;
  }

  if (next === 'grid' || next === 'none' || next === 'inline') {
    ensure('display', next === 'none' ? 'hidden' : next);

    return;
  }

  ensure('display', 'flex');

  const dir = eff('flex-direction')?.name || 'flex-row';
  const want = next === 'col' ? 'flex-col' : 'flex-row';

  if (dir !== want) {
    port.setClass(want);
  }
}

const FLOWS = [
  ['none', 'x', 'display: none'],
  ['block', 'flowBlock', 'display: block'],
  ['row', 'flowRow', 'display: flex · flex-direction: row'],
  ['col', 'flowCol', 'display: flex · flex-direction: column'],
  ['grid', 'flowGrid', 'display: grid'],
  ['inline', 'flowInline', 'display: inline'],
];

/** Every other display (inline-block, inline-flex, contents …): the pane's menu for the property. */
function openDisplay(event) {
  const now = display.value;

  port.openValueMenu(event.currentTarget, {
    property: 'display',
    title: 'display',
    own: now && !now.inherited ? { raw: now.raw, name: now.name } : null,
  });
}

const wrapOn = computed(() => eff('flex-wrap')?.name === 'flex-wrap');
const displayKids = computed(() => tool('display')?.kids || []);
const distributeKids = computed(() => [
  ...displayKids.value.filter((kid) => ['justify-between', 'justify-around'].includes(kid.id)),
  ...BUILD_KIDS.main,
]);
const crossKids = computed(() => [...displayKids.value.filter((kid) => kid.css === 'align-items'), ...BUILD_KIDS.cross]);
const gapKid = (id) => kidsById(tool('tw-gap')).get(id);
const cols = computed(() => eff('grid-template-columns'));
const atBase = computed(() => !sizeNow.value || !!port.sizes().find((row) => row.handle === sizeNow.value)?.base);
const structureRow = computed(() => props.node.kind === 'columns' && atBase.value && !stateNow.value);
const clip = computed(() => eff('overflow')?.name === 'overflow-hidden');

/* ---------------- Size ---------------- */

const DIM = { width: ['w-full', 'w-fit'], height: ['h-full', 'h-fit'] };

function sizeMode(property) {
  const name = eff(property)?.name;

  return name === DIM[property][0] ? 'fill' : name === DIM[property][1] ? 'hug' : 'fixed';
}

function setSizeMode(property, mode) {
  const [fill, hug] = DIM[property];

  if (mode === 'fill') {
    ensure(property, fill);
  } else if (mode === 'hug') {
    ensure(property, hug);
  } else {
    const own = port.activeClass(property);

    if (own === fill || own === hug) {
      port.setClass(own);
    }
  }
}

/* ---------------- the rest ---------------- */

const ALIGNS = [['text-start', 'alL', 'start'], ['text-center', 'alC', 'center'], ['text-end', 'alR', 'end'], ['text-justify', 'alJ', 'justify']];
/** Named values only: the site's scale for the property, nothing typed. */
const POSITION = { css: 'position' };
const MIN_H = { css: 'min-height' };
const MAX_H = { css: 'max-height' };
const WEIGHT = { css: 'font-weight' };
const OVERFLOW = { css: 'overflow' };

const borderNames = computed(() => ['border-0', ...(kidsById(tool('tw-border')).get('bw-all')?.twGroup || ['border', 'border-2', 'border-4', 'border-8'])]);
const radiusKid = computed(() => kidsById(tool('tw-radius')).get('rd-all') || tool('tw-radius'));
const cornerKids = computed(() => (tool('tw-radius')?.kids || []).filter((kid) => kid.id !== 'rd-all'));
const corners = ref(false);
/* A border side by side, the dock's own width and colour tools. */
const widthKids = computed(() => (tool('tw-border')?.kids || []).filter((kid) => kid.id !== 'bw-all'));
const colorKids = computed(() => (tool('tw-border-color')?.kids || []).filter((kid) => kid.id !== 'bd-all'));
const borderSides = ref(false);
const borderColor = computed(() => kidsById(tool('tw-border-color')).get('bd-all') || { css: 'border-color', tw: 'border-color' });

const shadowNames = computed(() => tool('tw-shadow')?.twGroup || []);
const borderLabel = (name) => (name === 'border' ? '1' : name.replace(/^border-/, ''));
const shadowLabel = (name) => name.replace(/^shadow-/, '');

/** A group named by hand (border width, shadow): a value field's menu over its names. */
function openGroup(event, names, title) {
  const now = effGroup(names);

  port.openValueMenu(event.currentTarget.closest('.fg-field') || event.currentTarget, {
    names,
    title,
    own: now && !now.inherited ? { raw: now.raw, name: now.name } : null,
  });
}

/** The tools this layout draws by hand; anything else in a family is drawn from its shape. */
const DRAWN = new Set(['display', 'grid-cols', 'tw-gap', 'absolute', 'tw-w', 'tw-minw', 'tw-maxw', 'tw-h', 'padding', 'margin', 'tw-text', 'tw-weight', 'tw-align', 'color', 'tw-leading', 'tw-font', 'bg', 'tw-border', 'tw-radius', 'tw-border-color', 'tw-shadow', 'tw-opacity', 'tw-overflow']);
const extra = (group) => group.tools.filter((item) => !DRAWN.has(item.id));

function choices(item) {
  const names = port.scale(item.tw || item.css);
  const prefix = rootOf(names);

  return names.map((name) => ({ name, label: fromClass(name, prefix) || name }));
}

/* ---------------- sections ---------------- */

const OPEN = new Set(['layout', 'spacing', 'typography']);
const toggled = ref({});

/** A family's STYLE_FIELDS field, at the size and state picked. */
function effField(field) {
  if (field.css) {
    return eff(field.css);
  }

  return effectiveClass(classes.value.join(' '), ['field'], chain.value, (name) => (fieldHas(field, name, port.utilityRoot) ? 'field' : ''));
}

const fieldsOf = (group) => STYLE_FIELDS[group.id] || [];
const groupSet = (group) => {
  port.rev.value;

  return fieldsOf(group).some((field) => !!effField(field)) || group.tools.some((item) => {
    if (item.twGroup) {
      return !!effGroup(item.twGroup);
    }

    return !!eff(item.css || item.tw) || (item.kids || []).some((kid) => !!eff(kid.css || kid.tw));
  });
};
const isOpen = (group) => toggled.value[group.id] ?? (OPEN.has(group.id) || groupSet(group));

function toggle(group) {
  toggled.value = { ...toggled.value, [group.id]: !isOpen(group) };
}

/**
 * The classes a family has on the element itself at the size and state
 * picked — not what reaches it from a wider size. Both names a tool answers
 * to are asked (`css` and its Tailwind twin, `padding-block-start` and
 * `padding-top`), each on its own, so the twin counts as the element's own.
 * What the blue dot in a family's header stands for, and what it takes away.
 */
function groupOwn(group) {
  port.rev.value;

  const names = new Set();
  const take = (hit) => hit && !hit.inherited && names.add(hit.name);

  for (const item of group.tools) {
    if (item.twGroup) {
      take(effGroup(item.twGroup));
      continue;
    }

    for (const one of [item, ...(item.kids || [])]) {
      [...new Set([one.css, one.tw].filter(Boolean))].forEach((property) => take(eff(property)));
    }
  }

  fieldsOf(group).forEach((field) => take(effField(field)));

  return [...names];
}

/** The dot pressed: the family's own classes taken off, each as the Tailwind pane takes one off (a second set toggles it). */
function resetGroup(group) {
  groupOwn(group).forEach((name) => port.setClass(name));
}

/* Spacing: the box or the fields, this browser's choice */
const SPACING_VIEW_KEY = 'sve-build-spacing-view';

function readSpacingView() {
  try {
    return window.localStorage.getItem(SPACING_VIEW_KEY) === 'fields' ? 'fields' : 'box';
  } catch {
    return 'box';
  }
}

const spacingView = ref(readSpacingView());

function flipSpacingView() {
  spacingView.value = spacingView.value === 'box' ? 'fields' : 'box';

  try {
    window.localStorage.setItem(SPACING_VIEW_KEY, spacingView.value);
  } catch {
    /* the choice lasts this visit */
  }
}

/*
 * The sizes and the family icons stay on top of the panel's scroll (`.fg-top`).
 * What scrolls into view — a family jumped to, a field tabbed to — stops under
 * them, however high they are (the hint can wrap in a narrow panel).
 */
const bar = ref(null);
let barSize = null;

onMounted(() => {
  const scroller = root.value.parentElement;

  barSize = new ResizeObserver(() => {
    scroller.style.scrollPaddingTop = `${bar.value.offsetHeight}px`;
  });
  barSize.observe(bar.value);
});

onBeforeUnmount(() => {
  barSize.disconnect();
  root.value.parentElement.style.scrollPaddingTop = '';
});

function jump(group) {
  toggled.value = { ...toggled.value, [group.id]: true };
  // The panel's own scroll, by hand: scrollIntoView also moves the boxes around it when a family near the end cannot rise far enough, and the panel's top slides away.
  requestAnimationFrame(() => {
    const section = root.value?.querySelector(`[data-sve-build-group="${group.id}"]`);
    const scroller = root.value?.parentElement;

    if (section && scroller) {
      const top = section.getBoundingClientRect().top - scroller.getBoundingClientRect().top - scroller.clientTop + scroller.scrollTop - bar.value.offsetHeight;

      scroller.scrollTo({ top, behavior: 'smooth' });
    }
  });
}
</script>

<template>
  <div ref="root" class="fg-style">
    <div ref="bar" class="fg-top">
      <div class="fg-seg fg-target">
        <button type="button" aria-pressed="true"><span v-html="ic('cursor')"></span>{{ port.t('this_element') }}</button>
        <button type="button" disabled><span v-html="ic('plus')"></span>{{ port.t('own_class') }} <i class="bm-soon">{{ port.t('later') }}</i></button>
      </div>

      <div class="fg-seg fg-sizes" data-sve-build-sizes>
        <button
          v-for="row in sizes"
          :key="row.handle || 'all'"
          type="button"
          :aria-pressed="sizeNow === row.handle"
          :title="row.label"
          :data-sve-build-size="row.handle || 'all'"
          @click="port.setSize(row.handle)"
        ><span v-html="deviceIcon(row.icon)"></span><span>{{ row.label }}</span></button>
      </div>
      <div class="fg-line">
        <p class="fg-hint" v-html="sizeHint"></p>
        <button
          ref="stateBtn"
          type="button"
          class="fg-state"
          :class="{ 'is-set': !!stateNow }"
          :title="port.t('state_title')"
          data-sve-build-state
          @click="port.openStateMenu(stateBtn)"
        ><span>{{ stateNow || port.t('state_normal') }}</span><span v-html="ic('chev')"></span></button>
      </div>

      <div class="fg-jump">
        <button
          v-for="group in groups"
          :key="group.id"
          type="button"
          class="fg-ib"
          :title="port.t(`group_${group.id}`)"
          :aria-label="port.t(`group_${group.id}`)"
          @click="jump(group)"
          v-html="groupIcon(group, port.lists.toolIcons)"
        ></button>
      </div>
    </div>

    <section
      v-for="group in groups"
      :key="group.id"
      class="fg-sec"
      :class="{ 'is-open': isOpen(group) }"
      :data-sve-build-group="group.id"
    >
      <header class="fg-sec__h">
        <!-- The icon and the name open and close the family, as the + / − does; the room between them and it does nothing -->
        <button type="button" class="fg-sec__name" :aria-expanded="isOpen(group)" :data-sve-build-name="group.id" @click="toggle(group)">
          <span class="fg-sec__icon" v-html="groupIcon(group, port.lists.toolIcons)"></span>
          <span>{{ port.t(`group_${group.id}`) }}</span>
        </button>
        <!-- Set on the element itself: the dot; pressed, the family's own classes come off -->
        <button
          v-if="groupOwn(group).length"
          type="button"
          class="fg-set"
          :title="port.t('group_reset', { group: port.t(`group_${group.id}`) })"
          :aria-label="port.t('group_reset', { group: port.t(`group_${group.id}`) })"
          :data-sve-build-reset="group.id"
          @click="resetGroup(group)"
        ><i></i><span v-html="ic('reset')"></span></button>
        <span class="fg-sec__acts">
          <button
            v-if="group.id === 'spacing' && isOpen(group)"
            type="button"
            class="fg-ib"
            :aria-pressed="spacingView === 'box'"
            :title="port.t(spacingView === 'box' ? 'spacing_fields' : 'spacing_box')"
            :aria-label="port.t(spacingView === 'box' ? 'spacing_fields' : 'spacing_box')"
            data-sve-build-spacing-view
            @click="flipSpacingView"
            v-html="ic('container')"
          ></button>
          <!-- Labelled "collapse", never "close": the shell takes a Live Preview button called close for Statamic's × and hides it (cp-shell/grid-rows.js) -->
          <button
            type="button"
            class="fg-ib fg-sec__tog"
            :aria-expanded="isOpen(group)"
            :title="port.t(isOpen(group) ? 'group_close' : 'group_open', { group: port.t(`group_${group.id}`) })"
            :aria-label="port.t(isOpen(group) ? 'group_close' : 'group_open', { group: port.t(`group_${group.id}`) })"
            :data-sve-build-toggle="group.id"
            @click="toggle(group)"
            v-html="ic(isOpen(group) ? 'minus' : 'plus')"
          ></button>
        </span>
      </header>

      <div v-if="isOpen(group)" class="fg-sec__b">
        <!-- Layout -->
        <template v-if="group.id === 'layout'">
          <div class="fg-lab">{{ port.t('flow') }}</div>
          <div class="fg-line">
            <div class="fg-seg fg-flow">
              <button
                v-for="[id, glyph, title] in FLOWS"
                :key="id"
                type="button"
                :aria-pressed="flow === id"
                :class="{ inh: flow === id && (!display || display.inherited) }"
                :title="title"
                :aria-label="title"
                :data-sve-build-flow="id"
                @click="setFlow(id)"
                v-html="ic(glyph)"
              ></button>
            </div>
            <button
              type="button"
              class="fg-ib"
              :aria-pressed="flow === 'other'"
              :title="flow === 'other' ? `display: ${disp}` : port.t('display_more')"
              :aria-label="port.t('display_more')"
              data-sve-build-display-more
              @click="openDisplay"
              v-html="ic('more')"
            ></button>
            <button
              type="button"
              class="fg-ib"
              :aria-pressed="wrapOn"
              title="flex-wrap: wrap"
              aria-label="flex-wrap: wrap"
              :disabled="flow !== 'row' && flow !== 'col'"
              @click="port.setClass('flex-wrap')"
              v-html="ic('wrap')"
            ></button>
          </div>

          <template v-if="flow === 'row' || flow === 'col'">
            <div class="fg-cols">
              <div>
                <div class="fg-lab">{{ port.t('alignment') }}</div>
                <BuildAlignMatrix :column="flow === 'col'" />
              </div>
              <div>
                <div class="fg-lab">{{ port.t('gap') }}</div>
                <BuildField v-if="gapKid('gap-all')" :icon="flow === 'col' ? 'gapY' : 'gapX'" title="gap">
                  <BuildValueInput :tool="gapKid('gap-all')" label="gap" compact />
                </BuildField>
                <div class="fg-lab">{{ port.t('distribute') }}</div>
                <BuildAlign :kids="distributeKids" :rotate="flow === 'col'" />
              </div>
            </div>
          </template>

          <template v-if="flow === 'grid'">
            <template v-if="structureRow">
              <div class="fg-lab">grid-template-columns <i class="bm-soon">{{ port.t('switching_later') }}</i></div>
              <div class="bm-sp">
                <button v-for="s in STRUCTURES" :key="s.key" type="button" class="bm-sp-o" :aria-pressed="pressed(cols, s.cls)" :title="s.label" @click="port.setClass(s.cls)">
                  <span class="bm-bars"><i v-for="(part, n) in s.parts" :key="n" :style="{ flex: part }"></i></span>
                  <span class="bm-sp-l">{{ s.label }}</span>
                </button>
              </div>
            </template>
            <template v-else>
              <div class="fg-lab">grid-template-columns</div>
              <div class="fg-seg fg-colsn">
                <button
                  v-for="n in 6"
                  :key="n"
                  type="button"
                  :aria-pressed="pressed(cols, `grid-cols-${n}`)"
                  :class="{ inh: inh(cols, `grid-cols-${n}`) }"
                  :title="`repeat(${n}, 1fr)`"
                  @click="port.setClass(`grid-cols-${n}`)"
                ><span class="bm-mini"><i v-for="m in n" :key="m"></i></span><span>{{ n }}</span></button>
              </div>
            </template>
            <div class="fg-grid">
              <BuildField v-if="gapKid('gap-col')" icon="gapX" title="column-gap">
                <BuildValueInput :tool="gapKid('gap-col')" :fallbacks="['gap']" label="column-gap" compact />
              </BuildField>
              <BuildField v-if="gapKid('gap-row')" icon="gapY" title="row-gap">
                <BuildValueInput :tool="gapKid('gap-row')" :fallbacks="['gap']" label="row-gap" compact />
              </BuildField>
            </div>
            <div class="fg-lab">{{ port.t('align_items') }}</div>
            <BuildAlign :kids="crossKids" />
          </template>

          <label class="fg-check">
            <input type="checkbox" :checked="clip" data-sve-build-clip @change="port.setClass('overflow-hidden')" />
            <span>{{ port.t('clip_content') }}</span>
          </label>
        </template>

        <!-- Position -->
        <template v-else-if="group.id === 'position'">
          <label class="fg-field">
            <span class="fg-pre" v-html="groupIcon(group, port.lists.toolIcons)"></span>
            <BuildValueInput :tool="POSITION" label="position" :typed="false" />
          </label>
          <BuildFields family="position" />
        </template>

        <!-- Size -->
        <template v-else-if="group.id === 'size'">
          <div class="fg-grid">
            <BuildField v-if="tool('tw-w')" letter="W" title="width">
              <BuildValueInput :tool="tool('tw-w')" label="width" compact />
              <template #suffix>
                <select class="fg-mode" aria-label="width mode" :value="sizeMode('width')" @change="setSizeMode('width', $event.target.value)">
                  <option value="fixed">{{ port.t('size_fixed') }}</option>
                  <option value="fill">{{ port.t('size_fill') }}</option>
                  <option value="hug">{{ port.t('size_hug') }}</option>
                </select>
              </template>
            </BuildField>
            <BuildField v-if="tool('tw-h')" letter="H" title="height">
              <BuildValueInput :tool="tool('tw-h')" label="height" compact />
              <template #suffix>
                <select class="fg-mode" aria-label="height mode" :value="sizeMode('height')" @change="setSizeMode('height', $event.target.value)">
                  <option value="fixed">{{ port.t('size_fixed') }}</option>
                  <option value="fill">{{ port.t('size_fill') }}</option>
                  <option value="hug">{{ port.t('size_hug') }}</option>
                </select>
              </template>
            </BuildField>
            <BuildField v-if="tool('tw-minw')" letter="Min W" title="min-width">
              <BuildValueInput :tool="tool('tw-minw')" label="min-width" compact />
            </BuildField>
            <BuildField v-if="tool('tw-maxw')" letter="Max W" title="max-width">
              <BuildValueInput :tool="tool('tw-maxw')" label="max-width" compact />
            </BuildField>
            <BuildField letter="Min H" title="min-height">
              <BuildValueInput :tool="MIN_H" label="min-height" compact />
            </BuildField>
            <BuildField letter="Max H" title="max-height">
              <BuildValueInput :tool="MAX_H" label="max-height" compact />
            </BuildField>
          </div>
          <p class="fg-hint">{{ port.t('size_more') }}</p>
          <BuildFields family="size" />
        </template>

        <!-- Spacing -->
        <template v-else-if="group.id === 'spacing'">
          <BuildSpacingBox
            v-if="spacingView === 'box' && tool('padding') && tool('margin')"
            :tools="{ padding: tool('padding'), margin: tool('margin') }"
          />
          <template v-else>
            <div class="fg-lab">padding</div>
            <BuildBoxFields v-if="tool('padding')" :tool="tool('padding')" />
            <div class="fg-lab">margin</div>
            <BuildBoxFields v-if="tool('margin')" :tool="tool('margin')" />
          </template>
          <p class="fg-hint" v-html="port.t('value_hint')"></p>
        </template>

        <!-- Typography -->
        <template v-else-if="group.id === 'typography'">
          <BuildField v-if="tool('tw-font')" title="font-family">
            <BuildValueInput :tool="tool('tw-font')" label="font-family" empty="font-family" compact chip />
          </BuildField>
          <div class="fg-grid">
            <label class="fg-field" title="font-weight">
              <span class="fg-pre" v-html="ic('weight')"></span>
              <BuildValueInput :tool="WEIGHT" label="font-weight" :typed="false" />
            </label>
            <BuildField v-if="tool('tw-text')" letter="Aa" title="font-size">
              <BuildValueInput :tool="tool('tw-text')" label="font-size" compact chip />
            </BuildField>
            <BuildField v-if="tool('tw-leading')" icon="lineHeight" title="line-height">
              <BuildValueInput :tool="tool('tw-leading')" label="line-height" compact />
            </BuildField>
            <div class="fg-seg">
              <button
                v-for="[cls, glyph, title] in ALIGNS"
                :key="cls"
                type="button"
                :aria-pressed="pressed(eff('text-align'), cls)"
                :class="{ inh: inh(eff('text-align'), cls) }"
                :title="`text-align: ${title}`"
                :aria-label="`text-align: ${title}`"
                @click="port.setClass(cls)"
                v-html="ic(glyph)"
              ></button>
            </div>
          </div>
          <template v-if="tool('color')">
            <div class="fg-lab">color</div>
            <BuildColorField :tool="tool('color')" />
          </template>
          <template v-for="item in extra(group)" :key="item.id">
            <div class="fg-lab">{{ item.css }}</div>
            <BuildAlign v-if="item.kids?.length" :kids="item.kids" :align="false" />
            <BuildField v-else :title="item.css"><BuildValueInput :tool="item" compact /></BuildField>
          </template>
          <BuildFields family="typography" />
        </template>

        <!-- Background -->
        <template v-else-if="group.id === 'background'">
          <BuildColorField v-if="tool('bg')" :tool="tool('bg')" />
          <BuildFields family="background" :path="node.path" />
        </template>

        <!-- Border -->
        <template v-else-if="group.id === 'border'">
          <div class="fg-grid">
            <label class="fg-field" title="border-width">
              <span class="fg-pre" v-html="ic('border')"></span>
              <button
                type="button"
                class="bm-vin"
                :class="{ inh: effGroup(borderNames)?.inherited, 'is-empty': !effGroup(borderNames) }"
                aria-label="border-width"
                aria-haspopup="listbox"
                data-sve-build-value="border-width"
                @click="openGroup($event, borderNames, 'border-width')"
                @keydown.down.prevent="openGroup($event, borderNames, 'border-width')"
              >{{ effGroup(borderNames) ? borderLabel(effGroup(borderNames).name) : '—' }}</button>
            </label>
            <div class="fg-line">
              <BuildField icon="radius" title="border-radius">
                <BuildValueInput :tool="radiusKid" label="border-radius" compact chip />
              </BuildField>
              <button type="button" class="fg-ib" :aria-pressed="corners" :title="port.t('link_each')" @click="corners = !corners" v-html="ic('sides')"></button>
            </div>
          </div>
          <BuildAlign v-if="corners" :kids="cornerKids" :align="false" />
          <div class="fg-lab">border-color</div>
          <BuildColorField :tool="borderColor" />
          <button type="button" class="fg-more" :aria-pressed="borderSides" data-sve-build-border-sides @click="borderSides = !borderSides">
            <span v-html="ic('sides')"></span>{{ port.t('border_sides') }}
          </button>
          <template v-if="borderSides">
            <div class="fg-lab">border-width</div>
            <BuildAlign :kids="widthKids" :align="false" />
            <div class="fg-lab">border-color</div>
            <BuildAlign :kids="colorKids" :align="false" />
          </template>
          <BuildFields family="border" />
        </template>

        <!-- Effects -->
        <template v-else-if="group.id === 'effects'">
          <div class="fg-grid">
            <BuildField v-if="tool('tw-opacity')" icon="opacity" title="opacity">
              <BuildValueInput :tool="tool('tw-opacity')" label="opacity" compact />
            </BuildField>
            <label v-if="tool('tw-shadow')" class="fg-field" title="box-shadow">
              <span class="fg-pre" v-html="ic('shadow')"></span>
              <button
                type="button"
                class="bm-vin"
                :class="{ inh: effGroup(shadowNames)?.inherited, 'is-empty': !effGroup(shadowNames) }"
                aria-label="box-shadow"
                aria-haspopup="listbox"
                data-sve-build-value="box-shadow"
                @click="openGroup($event, shadowNames, 'box-shadow')"
                @keydown.down.prevent="openGroup($event, shadowNames, 'box-shadow')"
              >{{ effGroup(shadowNames) ? shadowLabel(effGroup(shadowNames).name) : '—' }}</button>
            </label>
          </div>
          <div class="fg-lab">overflow</div>
          <label class="fg-field">
            <span class="fg-pre" v-html="ic('sides')"></span>
            <BuildValueInput :tool="OVERFLOW" label="overflow" :typed="false" />
          </label>
          <BuildFields family="effects" />
        </template>

        <!-- Transform & transition -->
        <BuildFields v-else-if="group.id === 'transform'" family="transform" />

        <!-- A family this layout does not have: every tool from its shape -->
        <template v-else>
          <template v-for="item in group.tools" :key="item.id">
            <div class="fg-lab">{{ item.css }}</div>
            <BuildAlign v-if="item.kids?.length" :kids="item.kids" :align="false" />
            <div v-else-if="item.menu === 'choices' && choices(item).length <= 6" class="fg-seg">
              <button v-for="c in choices(item)" :key="c.name" type="button" :aria-pressed="pressed(eff(item.css), c.name)" @click="port.setClass(c.name)">{{ c.label }}</button>
            </div>
            <BuildField v-else :title="item.css"><BuildValueInput :tool="item" compact /></BuildField>
          </template>
        </template>
      </div>
    </section>

    <section class="fg-sec is-open fg-classes" data-sve-build-classes>
      <header class="fg-sec__h">
        <span class="fg-sec__name">{{ port.t('classes') }}</span>
        <span class="fg-sec__acts">
          <button type="button" class="fg-ib" :title="port.t('classes_sort')" :aria-label="port.t('classes_sort')" data-sve-build-classes-sort @click="port.sortClasses()" v-html="ic('list')"></button>
          <button type="button" class="fg-ib" :title="port.t('classes_add')" :aria-label="port.t('classes_add')" data-sve-build-classes-add @click="port.openAddMenu($event.currentTarget)" v-html="ic('plus')"></button>
        </span>
      </header>
      <div class="fg-sec__b">
        <TwClassList />
        <p class="fg-hint">{{ port.t('classes_note') }}</p>
        <p class="bm-legend"><i class="bm-soon">{{ port.t('later') }}</i> {{ port.t('legend') }}</p>
      </div>
    </section>
  </div>
</template>
