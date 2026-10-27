<script setup>
/**
 * Build's Style tab, drawn as the approved sketch draws it: the element's
 * head, This element | Class, the sizes and the state, the families' icons,
 * the element's own tag and link, then the families, then its classes.
 *
 * Every row is a tool of the dock's style row (CSS_TOOLS, or one in its shape
 * from catalog.js) and every click is the Tailwind pane's own: a class through
 * `port.setClass` (twSetClass — the same toggle, the same family replaced at
 * the same size and state), a named group through `port.setGroup`
 * (twSetGroup), a child button through `port.run` (runTwTool), the state
 * through the pane's own state menu (`port.openStateMenu`), the tag through
 * the strip's `twSetTag`. The rows the sketch lays out are laid out here by
 * hand; a tool of the dock's that the sketch never drew is drawn in its
 * family from its shape, so a tool added to the dock shows here by itself.
 */
import { computed, inject, ref, watch } from 'vue';
import BuildAlign from './BuildAlign.vue';
import BuildSpacingBox from './BuildSpacingBox.vue';
import BuildValueInput from './BuildValueInput.vue';
import { BUILD_KIDS, STRUCTURES, kidsById, styleGroups } from '../../build-mode/catalog.js';
import { effectiveClass, fromClass, rootOf, variantChain } from '../../build-mode/classes.js';
import { groupIcon, ic } from '../../build-mode/icons.js';

const props = defineProps({
  node: { type: Object, required: true },
  name: { type: String, default: '' },
});

const port = inject('sveBuild');
const root = ref(null);
const stateBtn = ref(null);
const groups = computed(() => styleGroups(port.lists.cssTools));
const tools = computed(() => new Map(groups.value.flatMap((group) => group.tools).map((tool) => [tool.id, tool])));
const tool = (id) => tools.value.get(id);
const LATER = new Set(['transform']);
const closed = ref(new Set(['position', 'size', 'background', 'border', 'effects', 'transform']));

/* ---------------- what the element has, at the size and state picked ---------------- */

const chain = computed(() => (port.rev.value, variantChain(port.sizes(), port.size(), port.state())));
const classes = computed(() => (port.rev.value, port.pickedClasses()));

/** The class that sets a property here, and whether it comes from a wider size or the plain state. */
function eff(property) {
  return effectiveClass(classes.value.join(' '), [property], chain.value, port.propertyOf);
}

/** The same for a named group (border widths, shadows), which has no one property to ask about. */
function effGroup(names) {
  return effectiveClass(classes.value.join(' '), ['group'], chain.value, (name) => (names.includes(name) ? 'group' : ''));
}

const pressed = (hit, name) => !!hit && hit.name === name;
const inh = (hit, name) => !!hit && hit.name === name && hit.inherited;

/* ---------------- sizes and state ---------------- */

const sizes = computed(() => {
  port.rev.value;

  const rows = port.sizes();
  const base = rows.find((row) => row.base) || rows[0];

  return [{ handle: null, label: port.t('size_all'), icon: base?.icon || 'desktop' }, ...rows.filter((row) => !row.base)];
});
const sizeNow = computed(() => (port.rev.value, port.size()));
const stateNow = computed(() => (port.rev.value, port.state()));
const deviceIcon = (name) => port.lists.deviceIcons?.[name] || '';

const sizeHint = computed(() => {
  const rows = port.sizes();
  const row = rows.find((item) => item.handle === sizeNow.value);
  const last = rows[rows.length - 1];
  const where = !row
    ? port.t('size_hint_all')
    : row === last || row === rows[0]
      ? row.label
      : port.t(row.direction === 'mobile' ? 'size_hint_up' : 'size_hint_down', { size: row.label });
  const what = stateNow.value ? port.t('size_hint_state', { size: where, state: stateNow.value }) : where;

  return port.t('size_hint', { size: `<b>${what}</b>` });
});

/* ---------------- the element's own rows ---------------- */

const HEADINGS = ['h1', 'h2', 'h3', 'h4'];
const TAGS = ['div', 'article', 'aside', 'nav', 'header', 'footer', 'figure', 'section'];
const holdsTag = computed(() => ['div', 'tag', 'container', 'flex', 'grid', 'section'].includes(props.node.kind));
const isLink = computed(() => props.node.kind === 'link' || props.node.kind === 'button');
const href = ref('');
let hrefTyped = false;

const hrefNow = computed(() => (port.rev.value, isLink.value ? port.attr('href') ?? '' : ''));

watch(
  hrefNow,
  (value) => {
    if (!hrefTyped) {
      href.value = value;
    }
  },
  { immediate: true }
);

function commitHref() {
  if (hrefTyped && href.value !== hrefNow.value) {
    port.setAttr('href', href.value);
  }

  hrefTyped = false;
}

/* ---------------- Layout ---------------- */

const display = computed(() => eff('display'));
const disp = computed(() => display.value?.name || 'block');
const isColumn = computed(() => /^flex-col/.test(eff('flex-direction')?.name || ''));
const displayKids = computed(() => tool('display')?.kids || []);
const mainKids = computed(() => [...displayKids.value.filter((kid) => kid.css === 'justify-content'), ...BUILD_KIDS.main]);
const crossKids = computed(() => [...displayKids.value.filter((kid) => kid.css === 'align-items'), ...BUILD_KIDS.cross]);
const gapKids = computed(() => {
  const kids = kidsById(tool('tw-gap'));

  return ['gap-all', 'gap-col', 'gap-row'].map((id) => kids.get(id)).filter(Boolean);
});
const DIRECTIONS = [
  ['flex-row', 'arrowR', 'row'],
  ['flex-col', 'arrowD', 'column'],
  ['flex-row-reverse', 'arrowL', 'row-reverse'],
  ['flex-col-reverse', 'arrowU', 'column-reverse'],
];
const cols = computed(() => eff('grid-template-columns'));
const structureRow = computed(() => props.node.kind === 'columns' && !sizeNow.value && !stateNow.value);

/* ---------------- the rest, as the sketch lists them ---------------- */

const POSITIONS = ['static', 'relative', 'absolute', 'sticky'];
const WEIGHTS = [['font-light', '300', 'light'], ['font-normal', '400', 'normal'], ['font-medium', '500', 'medium'], ['font-semibold', '600', 'semibold'], ['font-bold', '700', 'bold']];
const ALIGNS = [['text-start', 'alL', 'start'], ['text-center', 'alC', 'center'], ['text-end', 'alR', 'end']];
const BORDERS = [['border-0', '0'], ['border', '1'], ['border-2', '2']];
const RADII = [['rounded-none', '0'], ['rounded-sm', 'sm'], ['rounded-md', 'md'], ['rounded-lg', 'lg'], ['rounded-full', 'full']];
const SHADOWS = [['shadow-sm', 'sm'], ['shadow-md', 'md'], ['shadow-lg', 'lg']];
const OPACITIES = [25, 50, 75, 100];
const OVERFLOWS = ['visible', 'hidden', 'auto'];

const borderNames = computed(() => {
  const all = kidsById(tool('tw-border')).get('bw-all');

  return ['border-0', ...(all?.twGroup || ['border', 'border-2', 'border-4', 'border-8'])];
});

/** The tools the sketch lays out by hand; anything else in a family is drawn from its shape. */
const DRAWN = new Set(['display', 'grid-cols', 'tw-gap', 'absolute', 'tw-w', 'tw-minw', 'tw-maxw', 'tw-h', 'padding', 'margin', 'tw-text', 'tw-weight', 'tw-align', 'color', 'bg', 'tw-border', 'tw-radius', 'tw-shadow', 'tw-opacity', 'tw-overflow']);
const extra = (group) => group.tools.filter((item) => !DRAWN.has(item.id));

function shape(item) {
  if (item.kids?.length) {
    return 'kids';
  }

  if (item.menu === 'colors') {
    return 'colors';
  }

  return item.menu === 'choices' || (port.scale(item.tw || item.css).length && port.scale(item.tw || item.css).length <= 6 && !item.menu) ? 'choices' : 'value';
}

function choices(item) {
  const names = port.scale(item.tw || item.css);
  const prefix = rootOf(names);

  return names.map((name) => ({ name, label: fromClass(name, prefix) || name }));
}

const swatches = (property) => (port.rev.value, port.swatches(property));

function setOrClear(property, value) {
  const now = eff(property);

  if (value) {
    port.setClass(value);
  } else if (now && !now.inherited) {
    port.setClass(now.name);
  }
}

/* ---------------- groups ---------------- */

function toggle(group, open) {
  const next = new Set(closed.value);

  open ? next.delete(group) : next.add(group);
  closed.value = next;
}

function jump(group) {
  toggle(group, true);
  requestAnimationFrame(() => root.value?.querySelector(`[data-sve-build-group="${group}"]`)?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
}

const chips = computed(() =>
  classes.value.map((raw) => {
    const at = raw.lastIndexOf(':', raw.includes('[') ? raw.indexOf('[') : raw.length);

    return at > 0 ? { variant: raw.slice(0, at + 1), name: raw.slice(at + 1), raw } : { variant: '', name: raw, raw };
  })
);
</script>

<template>
  <div ref="root">
    <div class="bm-st-head">
      <span class="bm-chip-tag">{{ node.tag }}</span>
      <b>{{ name }}</b>
      <span class="bm-st-acts">
        <button type="button" class="bm-ib sm" :title="port.t('duplicate')" :aria-label="port.t('duplicate')" @click="port.duplicate()" v-html="ic('copy')"></button>
        <button type="button" class="bm-ib sm" :title="port.t('delete')" :aria-label="port.t('delete')" @click="port.remove()" v-html="ic('trash')"></button>
      </span>
    </div>

    <div class="bm-st-sel">
      <span class="bm-selchip is-on"><span v-html="ic('cursor')"></span>{{ port.t('this_element') }}</span>
      <span class="bm-selchip is-ghost"><span v-html="ic('plus')"></span>{{ port.t('own_class') }} <i class="bm-soon">{{ port.t('later') }}</i></span>
    </div>

    <div class="bm-st-bp">
      <div class="bm-seg" data-sve-build-sizes>
        <button
          v-for="row in sizes"
          :key="row.handle || 'all'"
          type="button"
          :aria-pressed="sizeNow === row.handle"
          :data-sve-build-size="row.handle || 'all'"
          @click="port.setSize(row.handle)"
        ><span v-html="deviceIcon(row.icon)"></span><span>{{ row.label }}</span></button>
      </div>
      <div class="bm-seg">
        <button
          ref="stateBtn"
          type="button"
          class="bm-state"
          :class="{ 'is-set': !!stateNow }"
          :aria-pressed="!!stateNow"
          :title="port.t('state_title')"
          data-sve-build-state
          @click="port.openStateMenu(stateBtn)"
        ><span>{{ stateNow || port.t('state_normal') }}</span><span v-html="ic('chev')"></span></button>
      </div>
    </div>
    <p class="bm-st-hint" v-html="sizeHint"></p>

    <div class="bm-seg bm-st-jump">
      <button
        v-for="group in groups"
        :key="group.id"
        type="button"
        :title="port.t(`group_${group.id}`)"
        :aria-label="port.t(`group_${group.id}`)"
        @click="jump(group.id)"
        v-html="groupIcon(group, port.lists.toolIcons)"
      ></button>
    </div>

    <div v-if="node.kind === 'heading' || isLink || holdsTag" class="bm-st-el">
      <div v-if="node.kind === 'heading'" class="bm-st-row">
        <span class="bm-st-l">tag</span>
        <div class="bm-seg">
          <button v-for="tag in HEADINGS" :key="tag" type="button" :aria-pressed="node.tag === tag" @click="port.setTag(tag)"><span>{{ tag }}</span></button>
        </div>
      </div>
      <div v-if="isLink" class="bm-st-row">
        <span class="bm-st-l">href</span>
        <input
          v-model="href"
          class="bm-inp"
          type="text"
          aria-label="href"
          data-sve-build-href
          @input="hrefTyped = true"
          @keydown.enter.prevent="commitHref"
          @blur="commitHref"
        />
      </div>
      <div v-if="holdsTag" class="bm-st-row">
        <span class="bm-st-l">tag</span>
        <select class="bm-sel" aria-label="tag" :value="node.tag" @change="port.setTag($event.target.value)">
          <option v-for="tag in TAGS" :key="tag" :value="tag">{{ tag }}</option>
        </select>
      </div>
    </div>

    <details
      v-for="group in groups"
      :key="group.id"
      class="bm-st-g"
      :data-sve-build-group="group.id"
      :open="!closed.has(group.id)"
      @toggle="toggle(group.id, $event.target.open)"
    >
      <summary>
        <span v-html="ic('chev', 'bm-st-chev')"></span>
        <span v-html="groupIcon(group, port.lists.toolIcons)"></span>
        <span>{{ port.t(`group_${group.id}`) }}</span>
        <i v-if="LATER.has(group.id)" class="bm-soon">{{ port.t('later') }}</i>
      </summary>

      <!-- Layout -->
      <template v-if="group.id === 'layout'">
        <div class="bm-st-row">
          <span class="bm-st-l">display</span>
          <div class="bm-seg">
            <button
              v-for="value in ['block', 'flex', 'grid']"
              :key="value"
              type="button"
              :aria-pressed="disp === value"
              :class="{ inh: disp === value && (!display || display.inherited) }"
              :title="`display: ${value}`"
              :data-sve-build-display="value"
              @click="port.setClass(value)"
            ><span>{{ value }}</span></button>
          </div>
        </div>

        <template v-if="disp === 'grid'">
          <div v-if="structureRow" class="bm-st-row is-wide">
            <span class="bm-st-l">grid-template-columns <i class="bm-soon">{{ port.t('switching_later') }}</i></span>
            <div class="bm-sp">
              <button
                v-for="s in STRUCTURES"
                :key="s.key"
                type="button"
                class="bm-sp-o"
                :aria-pressed="pressed(cols, s.cls)"
                :title="s.label"
                @click="port.setClass(s.cls)"
              >
                <span class="bm-bars"><i v-for="(part, n) in s.parts" :key="n" :style="{ flex: part }"></i></span>
                <span class="bm-sp-l">{{ s.label }}</span>
              </button>
            </div>
          </div>
          <div v-else class="bm-st-row is-wide">
            <span class="bm-st-l">grid-template-columns</span>
            <div class="bm-seg bm-seg-cols">
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
          </div>
          <div v-for="kid in gapKids" :key="kid.id" class="bm-st-row">
            <span class="bm-st-l" :title="kid.title">{{ kid.css }}</span>
            <BuildValueInput :tool="kid" :fallbacks="kid.css === 'gap' ? [] : ['gap']" />
          </div>
          <div class="bm-st-row is-wide">
            <span class="bm-st-l bm-al-l">{{ port.t('align_items') }}<code>align-items</code></span>
            <BuildAlign :kids="crossKids" />
          </div>
        </template>

        <template v-if="disp === 'flex'">
          <div class="bm-st-row">
            <span class="bm-st-l">flex-direction</span>
            <div class="bm-seg">
              <button
                v-for="[cls, glyph, title] in DIRECTIONS"
                :key="cls"
                type="button"
                :aria-pressed="pressed(eff('flex-direction'), cls)"
                :class="{ inh: inh(eff('flex-direction'), cls) }"
                :title="title"
                :aria-label="title"
                @click="port.setClass(cls)"
                v-html="ic(glyph)"
              ></button>
            </div>
          </div>
          <div class="bm-st-row is-wide">
            <span class="bm-st-l bm-al-l">{{ port.t('align_main') }}<code>justify-content</code></span>
            <BuildAlign :kids="mainKids" :rotate="isColumn" />
          </div>
          <div class="bm-st-row is-wide">
            <span class="bm-st-l bm-al-l">{{ port.t('align_cross') }}<code>align-items</code></span>
            <BuildAlign :kids="crossKids" :rotate="isColumn" />
          </div>
          <div v-for="kid in gapKids" :key="kid.id" class="bm-st-row">
            <span class="bm-st-l" :title="kid.title">{{ kid.css }}</span>
            <BuildValueInput :tool="kid" :fallbacks="kid.css === 'gap' ? [] : ['gap']" />
          </div>
        </template>
      </template>

      <!-- Position -->
      <template v-else-if="group.id === 'position'">
        <div class="bm-st-row is-wide">
          <span class="bm-st-l">position</span>
          <div class="bm-seg" data-sve-build-position>
            <button
              v-for="value in POSITIONS"
              :key="value"
              type="button"
              :aria-pressed="pressed(eff('position'), value)"
              :class="{ inh: inh(eff('position'), value) }"
              @click="port.setClass(value)"
            ><span>{{ value }}</span></button>
          </div>
        </div>
        <p class="bm-st-hint">{{ port.t('position_hint') }}</p>
      </template>

      <!-- Size -->
      <template v-else-if="group.id === 'size'">
        <div v-for="item in group.tools" :key="item.id" class="bm-st-row">
          <span class="bm-st-l" :title="item.title">{{ item.css }}</span>
          <BuildValueInput :tool="item" />
        </div>
        <p class="bm-st-hint">{{ port.t('size_more') }}</p>
      </template>

      <!-- Spacing -->
      <BuildSpacingBox v-else-if="group.id === 'spacing'" :tools="{ padding: tool('padding'), margin: tool('margin') }" />

      <!-- Typography -->
      <template v-else-if="group.id === 'typography'">
        <div v-if="tool('tw-text')" class="bm-st-row">
          <span class="bm-st-l">font-size</span>
          <BuildValueInput :tool="tool('tw-text')" />
        </div>
        <div class="bm-st-row">
          <span class="bm-st-l">font-weight</span>
          <select
            class="bm-sel"
            :class="{ inh: eff('font-weight')?.inherited }"
            aria-label="font-weight"
            :value="eff('font-weight')?.name || ''"
            @change="setOrClear('font-weight', $event.target.value)"
          >
            <option value="">—</option>
            <option v-for="[cls, num, word] in WEIGHTS" :key="cls" :value="cls">{{ num }} · {{ word }}</option>
          </select>
        </div>
        <div class="bm-st-row">
          <span class="bm-st-l">text-align</span>
          <div class="bm-seg">
            <button
              v-for="[cls, glyph, title] in ALIGNS"
              :key="cls"
              type="button"
              :aria-pressed="pressed(eff('text-align'), cls)"
              :class="{ inh: inh(eff('text-align'), cls) }"
              :title="title"
              :aria-label="title"
              @click="port.setClass(cls)"
              v-html="ic(glyph)"
            ></button>
          </div>
        </div>
        <div v-if="tool('color')" class="bm-st-row is-wide">
          <span class="bm-st-l">color</span>
          <div>
            <div class="bm-sws">
              <button
                v-for="sw in swatches('color')"
                :key="sw.name"
                type="button"
                class="bm-sw"
                :class="{ inh: inh(eff('color'), sw.name) }"
                :style="{ background: sw.color }"
                :aria-pressed="pressed(eff('color'), sw.name)"
                :title="sw.name"
                :aria-label="sw.name"
                @click="port.setClass(sw.name)"
              ></button>
            </div>
            <BuildValueInput class="bm-vin-after" :tool="tool('color')" />
          </div>
        </div>
        <template v-for="item in extra(group)" :key="item.id">
          <div class="bm-st-row" :class="{ 'is-wide': shape(item) !== 'value' }">
            <span class="bm-st-l" :title="item.title">{{ item.css }}</span>
            <BuildAlign v-if="shape(item) === 'kids'" :kids="item.kids" :align="false" />
            <div v-else-if="shape(item) === 'choices' && choices(item).length <= 6" class="bm-seg">
              <button v-for="c in choices(item)" :key="c.name" type="button" :aria-pressed="pressed(eff(item.css), c.name)" @click="port.setClass(c.name)"><span>{{ c.label }}</span></button>
            </div>
            <BuildValueInput v-else :tool="item" />
          </div>
        </template>
      </template>

      <!-- Background -->
      <template v-else-if="group.id === 'background'">
        <div v-if="tool('bg')" class="bm-st-row is-wide">
          <span class="bm-st-l">background-color</span>
          <div>
            <div class="bm-sws">
              <button
                v-for="sw in swatches('background-color')"
                :key="sw.name"
                type="button"
                class="bm-sw"
                :class="{ inh: inh(eff('background-color'), sw.name) }"
                :style="{ background: sw.color }"
                :aria-pressed="pressed(eff('background-color'), sw.name)"
                :title="sw.name"
                :aria-label="sw.name"
                @click="port.setClass(sw.name)"
              ></button>
            </div>
            <BuildValueInput class="bm-vin-after" :tool="tool('bg')" />
          </div>
        </div>
        <p class="bm-st-hint">{{ port.t('bg_hint') }}</p>
      </template>

      <!-- Border -->
      <template v-else-if="group.id === 'border'">
        <div class="bm-st-row">
          <span class="bm-st-l">border-width</span>
          <div class="bm-seg">
            <button
              v-for="[cls, label] in BORDERS"
              :key="cls"
              type="button"
              :aria-pressed="pressed(effGroup(borderNames), cls)"
              :class="{ inh: inh(effGroup(borderNames), cls) }"
              @click="port.setGroup(borderNames, cls)"
            ><span>{{ label }}</span></button>
          </div>
        </div>
        <div class="bm-st-row">
          <span class="bm-st-l">border-radius</span>
          <div class="bm-seg">
            <button
              v-for="[cls, label] in RADII"
              :key="cls"
              type="button"
              :aria-pressed="pressed(eff('border-radius'), cls)"
              :class="{ inh: inh(eff('border-radius'), cls) }"
              @click="port.setClass(cls)"
            ><span>{{ label }}</span></button>
          </div>
        </div>
        <div v-for="item in extra(group)" :key="item.id" class="bm-st-row is-wide">
          <span class="bm-st-l" :title="item.title">{{ item.css }}</span>
          <BuildAlign v-if="shape(item) === 'kids'" :kids="item.kids" :align="false" />
          <BuildValueInput v-else :tool="item" />
        </div>
      </template>

      <!-- Effects -->
      <template v-else-if="group.id === 'effects'">
        <div v-if="tool('tw-shadow')" class="bm-st-row">
          <span class="bm-st-l">box-shadow</span>
          <div class="bm-seg">
            <button
              v-for="[cls, label] in SHADOWS"
              :key="cls"
              type="button"
              :aria-pressed="pressed(effGroup(tool('tw-shadow').twGroup), cls)"
              :class="{ inh: inh(effGroup(tool('tw-shadow').twGroup), cls) }"
              @click="port.setGroup(tool('tw-shadow').twGroup, cls)"
            ><span>{{ label }}</span></button>
          </div>
        </div>
        <div class="bm-st-row">
          <span class="bm-st-l">opacity</span>
          <select
            class="bm-sel"
            :class="{ inh: eff('opacity')?.inherited }"
            aria-label="opacity"
            :value="eff('opacity')?.name || ''"
            @change="setOrClear('opacity', $event.target.value)"
          >
            <option value="">—</option>
            <option v-for="n in OPACITIES" :key="n" :value="`opacity-${n}`">{{ n }} · {{ n }}%</option>
          </select>
        </div>
        <div class="bm-st-row">
          <span class="bm-st-l">overflow</span>
          <div class="bm-seg">
            <button
              v-for="value in OVERFLOWS"
              :key="value"
              type="button"
              :aria-pressed="pressed(eff('overflow'), `overflow-${value}`)"
              :class="{ inh: inh(eff('overflow'), `overflow-${value}`) }"
              @click="port.setClass(`overflow-${value}`)"
            ><span>{{ value }}</span></button>
          </div>
        </div>
      </template>

      <!-- Transform & transition -->
      <p v-else-if="group.id === 'transform'" class="bm-st-hint">{{ port.t('transform_hint') }}</p>

      <!-- A family the sketch does not have: every tool from its shape -->
      <template v-else>
        <div v-for="item in group.tools" :key="item.id" class="bm-st-row" :class="{ 'is-wide': shape(item) === 'kids' }">
          <span class="bm-st-l" :title="item.title">{{ item.css }}</span>
          <BuildAlign v-if="shape(item) === 'kids'" :kids="item.kids" :align="false" />
          <BuildValueInput v-else :tool="item" />
        </div>
      </template>
    </details>

    <div class="bm-st-cls">
      <span class="bm-st-l">{{ port.t('classes') }}</span>
      <div class="bm-cls-list">
        <code v-for="chip in chips" :key="chip.raw" class="bm-cls"><em v-if="chip.variant">{{ chip.variant }}</em>{{ chip.name }}</code>
        <span v-if="!chips.length" class="bm-muted">{{ port.t('classes_none') }}</span>
      </div>
      <p class="bm-st-hint">{{ port.t('classes_note') }}</p>
    </div>
    <p class="bm-legend"><i class="bm-soon">{{ port.t('later') }}</i> {{ port.t('legend') }}</p>
  </div>
</template>
