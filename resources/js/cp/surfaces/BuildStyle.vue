<script setup>
/**
 * Build's Style tab: the picked element's classes, by family, the way Bricks
 * draws a style panel — label left, field right, a dot where a value is set.
 *
 * Every row is a tool of the dock's style row (CSS_TOOLS, arranged by
 * catalog.js `styleGroups`) and does what that tool does in the Tailwind
 * pane: a fixed class through `port.run` (runTwTool), a scale through the
 * pane's own menu, a typed value through the pane's class functions. What
 * this file decides is only how a tool is drawn, from its shape:
 *
 *   children        → the pane's buttons for them (BuildAlign)
 *   a few classes   → a segmented row of the site's own classes for it
 *   a scale         → a field to type in, and the pane's menu beside it
 *
 * Layout and Spacing are drawn by hand from the same tools: display as
 * block | flex | grid, direction and alignment with the pane's icons (turned
 * for a column), and margin/padding as one box (BuildSpacingBox).
 */
import { computed, inject, ref } from 'vue';
import BuildAlign from './BuildAlign.vue';
import BuildSpacingBox from './BuildSpacingBox.vue';
import BuildValueInput from './BuildValueInput.vue';
import { kidsById, styleGroups } from '../../build-mode/catalog.js';
import { fromClass, rootOf } from '../../build-mode/classes.js';
import { BUILD_ICONS, groupIcon } from '../../build-mode/icons.js';

const props = defineProps({
  node: { type: Object, required: true },
  name: { type: String, default: '' },
});

const port = inject('sveBuild');
const root = ref(null);
const groups = computed(() => styleGroups(port.lists.cssTools));
const toolsById = computed(() => new Map(groups.value.flatMap((group) => group.tools).map((tool) => [tool.id, tool])));
const LATER = { transform: 'transform_later', effects: 'effects_later' };
const closed = ref(new Set(['position', 'size', 'background', 'border', 'effects', 'transform']));

/* Sizes: the Tailwind pane's own list — All, then the site's sizes. */
const sizes = computed(() => {
  port.rev.value;

  return [{ handle: null, label: port.t('size_all'), icon: 'desktop' }, ...port.sizes().filter((row) => !row.base)];
});
const sizeNow = computed(() => (port.rev.value, port.size()));
const sizeHint = computed(() => {
  const row = sizes.value.find((item) => item.handle === sizeNow.value);

  return port.t('size_hint', { size: row?.handle ? row.label : port.t('size_hint_all') });
});

/* Layout */
const display = computed(() => (port.rev.value, port.activeClass('display')));
const isFlex = computed(() => /flex/.test(display.value));
const isGrid = computed(() => /grid/.test(display.value));
const isColumn = computed(() => (port.rev.value, /^flex-col/.test(port.activeClass('flex-direction'))));
const displayKids = computed(() => kidsById(toolsById.value.get('display')));
const pick = (ids) => ids.map((id) => displayKids.value.get(id)).filter(Boolean);
const directionKids = computed(() => pick(['flex-row', 'flex-col']));
const mainKids = computed(() => (toolsById.value.get('display')?.kids || []).filter((kid) => kid.css === 'justify-content'));
const crossKids = computed(() => (toolsById.value.get('display')?.kids || []).filter((kid) => kid.css === 'align-items'));
const gapKids = computed(() => toolsById.value.get('tw-gap')?.kids || []);
const colsTool = computed(() => toolsById.value.get('grid-cols'));
const cols = computed(() => (port.rev.value, port.activeClass('grid-template-columns')));

/* Spacing */
const boxTools = computed(() => ({ padding: toolsById.value.get('padding'), margin: toolsById.value.get('margin') }));

/** How a tool is drawn, from its own shape in CSS_TOOLS. */
function shape(tool) {
  if (tool.kids?.length) {
    return 'kids';
  }

  if (tool.menu === 'choices' || tool.value) {
    return 'choices';
  }

  return 'value';
}

/** The site's own classes for a property, when they are few enough to show side by side. */
function choices(tool) {
  port.rev.value;

  const names = port.scale(tool.tw || tool.css);
  const root = rootOf(names);

  return names.map((name) => ({ name, label: fromClass(name, root) || name }));
}

/** The class the picked tag has for a property at the size picked, read again after every write. */
const activeOf = (property) => (port.rev.value, port.activeClass(property));
const isSet = (tool) => (port.rev.value, !!activeOf(tool.css || tool.tw) || (tool.kids || []).some((kid) => port.active(kid)));
const isGroupSet = (group) => group.tools.some(isSet);

function toggle(group, open) {
  const next = new Set(closed.value);

  open ? next.delete(group) : next.add(group);
  closed.value = next;
}

function jump(group) {
  toggle(group, true);
  requestAnimationFrame(() => root.value?.querySelector(`[data-group="${group}"]`)?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
}

const classes = computed(() => (port.rev.value, port.pickedClasses()));
</script>

<template>
  <div ref="root" class="sve-build-style">
    <div class="sve-build-head">
      <span class="sve-build-chip" :data-kind="node.kind">{{ node.kind === 'component' ? 'component' : node.tag }}</span>
      <b class="sve-build-head__name">{{ name }}</b>
      <span class="sve-build-head__acts">
        <button type="button" class="sve-build-icon" :title="port.t('duplicate')" :aria-label="port.t('duplicate')" @click="port.duplicate()" v-html="BUILD_ICONS.copy"></button>
        <button type="button" class="sve-build-icon" :title="port.t('delete')" :aria-label="port.t('delete')" @click="port.remove()" v-html="BUILD_ICONS.trash"></button>
      </span>
    </div>

    <div class="sve-build-target-kind">
      <span class="sve-build-pill is-on"><i v-html="BUILD_ICONS.cursor"></i>{{ port.t('this_element') }}</span>
      <span class="sve-build-pill is-ghost"><i v-html="BUILD_ICONS.plus"></i>{{ port.t('own_class') }} <em class="sve-build-soon">{{ port.t('later') }}</em></span>
    </div>

    <div class="sve-build-seg sve-build-sizes">
      <button
        v-for="row in sizes"
        :key="row.handle || 'all'"
        type="button"
        :data-active="sizeNow === row.handle ? '' : null"
        :aria-pressed="sizeNow === row.handle"
        @click="port.setSize(row.handle)"
      >{{ row.label }}</button>
    </div>
    <p class="sve-build-hint">{{ sizeHint }}</p>

    <div class="sve-build-seg sve-build-jump">
      <button
        v-for="group in groups"
        :key="group.id"
        type="button"
        :title="port.t(`group_${group.id}`)"
        :aria-label="port.t(`group_${group.id}`)"
        :data-set="isGroupSet(group) ? '' : null"
        @click="jump(group.id)"
        v-html="groupIcon(group, port.lists.toolIcons)"
      ></button>
    </div>

    <details
      v-for="group in groups"
      :key="group.id"
      class="sve-build-group"
      :data-group="group.id"
      :open="!closed.has(group.id)"
      @toggle="toggle(group.id, $event.target.open)"
    >
      <summary>
        <i class="sve-build-group__chev" v-html="BUILD_ICONS.chevron"></i>
        <i class="sve-build-group__icon" v-html="groupIcon(group, port.lists.toolIcons)"></i>
        <span>{{ port.t(`group_${group.id}`) }}</span>
        <i v-if="isGroupSet(group)" class="sve-build-dot"></i>
      </summary>

      <template v-if="group.id === 'layout'">
        <div class="sve-build-row">
          <span class="sve-build-label" title="Display"><i v-if="display" class="sve-build-dot"></i>display</span>
          <div class="sve-build-seg">
            <button
              v-for="value in ['block', 'flex', 'grid']"
              :key="value"
              type="button"
              :data-active="display === value || (!display && value === 'block') ? '' : null"
              :class="{ 'is-inherited': !display && value === 'block' }"
              :title="`display: ${value}`"
              @click="port.setClass(value)"
            >{{ value }}</button>
          </div>
        </div>
        <template v-if="isFlex">
          <div class="sve-build-row">
            <span class="sve-build-label">flex-direction</span>
            <BuildAlign :kids="directionKids" />
          </div>
          <div class="sve-build-row is-wide">
            <span class="sve-build-label">{{ port.t('align_main') }} <code>justify-content</code></span>
            <BuildAlign :kids="mainKids" :rotate="isColumn" />
          </div>
        </template>
        <template v-if="isGrid && colsTool">
          <div class="sve-build-row is-wide">
            <span class="sve-build-label"><i v-if="cols" class="sve-build-dot"></i>grid-template-columns</span>
            <div class="sve-build-seg sve-build-cols">
              <button
                v-for="n in 6"
                :key="n"
                type="button"
                :data-active="cols === `grid-cols-${n}` ? '' : null"
                :title="`repeat(${n}, minmax(0, 1fr))`"
                @click="port.setClass(`grid-cols-${n}`)"
              ><span class="sve-build-cols__bars"><i v-for="m in n" :key="m"></i></span>{{ n }}</button>
            </div>
          </div>
        </template>
        <template v-if="isFlex || isGrid">
          <div class="sve-build-row is-wide">
            <span class="sve-build-label">{{ port.t('align_cross') }} <code>align-items</code></span>
            <BuildAlign :kids="crossKids" :rotate="isColumn" />
          </div>
          <div v-for="kid in gapKids" :key="kid.id" class="sve-build-row">
            <span class="sve-build-label" :title="kid.title">{{ kid.css }}</span>
            <BuildValueInput :tool="kid" :fallbacks="kid.css === 'gap' ? [] : ['gap']" />
          </div>
        </template>
      </template>

      <BuildSpacingBox v-else-if="group.id === 'spacing'" :tools="boxTools" />

      <template v-else>
        <div
          v-for="tool in group.tools"
          :key="tool.id"
          class="sve-build-row"
          :class="{ 'is-wide': shape(tool) !== 'value' }"
        >
          <span class="sve-build-label" :title="tool.title"><i v-if="isSet(tool)" class="sve-build-dot"></i>{{ tool.css }}</span>
          <BuildAlign v-if="shape(tool) === 'kids'" :kids="tool.kids" />
          <template v-else-if="shape(tool) === 'choices'">
            <div v-if="choices(tool).length && choices(tool).length <= 6" class="sve-build-seg">
              <button
                v-for="item in choices(tool)"
                :key="item.name"
                type="button"
                :data-active="activeOf(tool.css || tool.tw) === item.name ? '' : null"
                :title="`${tool.css}: ${item.label}`"
                @click="port.setClass(item.name)"
              >{{ item.label }}</button>
            </div>
            <select
              v-else
              class="sve-build-select"
              :value="activeOf(tool.css || tool.tw)"
              :aria-label="tool.css"
              @change="$event.target.value ? port.setClass($event.target.value) : activeOf(tool.css || tool.tw) && port.setClass(activeOf(tool.css || tool.tw))"
            >
              <option value="">—</option>
              <option v-for="item in choices(tool)" :key="item.name" :value="item.name">{{ item.label }}</option>
            </select>
          </template>
          <BuildValueInput v-else :tool="tool" />
        </div>
        <p v-if="LATER[group.id]" class="sve-build-hint">{{ port.t(LATER[group.id]) }}</p>
      </template>
    </details>

    <div class="sve-build-classes">
      <span class="sve-build-label">{{ port.t('classes') }}</span>
      <div class="sve-build-classes__list">
        <code v-for="raw in classes" :key="raw">{{ raw }}</code>
        <span v-if="!classes.length" class="sve-build-hint">{{ port.t('classes_none') }}</span>
      </div>
      <p class="sve-build-hint">{{ port.t('classes_note') }}</p>
    </div>
  </div>
</template>

<style scoped>
.sve-build-head {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 0.6em;
}
.sve-build-head__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 600;
}
.sve-build-head__acts {
  display: flex;
  gap: 0.15em;
}
.sve-build-target-kind {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35em;
  padding: 0.35em;
  margin-bottom: 0.6em;
  border-radius: 0.45rem;
  background: rgba(128, 128, 128, 0.1);
}
.sve-build-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.2em 0.5em;
  border-radius: 0.3rem;
  font-size: 0.6875rem;
  font-weight: 600;
}
.sve-build-pill i {
  display: inline-flex;
}
.sve-build-pill.is-on {
  background: var(--sve-build-accent);
  color: #fff;
}
.sve-build-pill.is-ghost {
  opacity: 0.6;
  border: 1px dashed rgba(128, 128, 128, 0.45);
}
.sve-build-sizes {
  margin-bottom: 0.1em;
}
.sve-build-jump {
  margin: 0.5em 0 0.2em;
}
.sve-build-jump button {
  position: relative;
}
.sve-build-jump button[data-set]::after {
  content: '';
  position: absolute;
  top: 0.2em;
  right: 0.25em;
  width: 0.3em;
  height: 0.3em;
  border-radius: 50%;
  background: var(--sve-build-accent-text);
}
.sve-build-group {
  border-top: 1px solid rgba(128, 128, 128, 0.25);
  margin-top: 0.6em;
}
.sve-build-group summary {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.65em 0 0.25em;
  cursor: pointer;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.sve-build-group summary::-webkit-details-marker {
  display: none;
}
.sve-build-group summary > span {
  opacity: 0.7;
}
.sve-build-group__chev,
.sve-build-group__icon {
  display: inline-flex;
  opacity: 0.6;
}
.sve-build-group:not([open]) .sve-build-group__chev {
  transform: rotate(-90deg);
}
.sve-build-cols button {
  flex-direction: column;
  gap: 0.2em;
}
.sve-build-cols__bars {
  display: flex;
  gap: 0.1em;
  width: 1.2rem;
  height: 0.55rem;
}
.sve-build-cols__bars i {
  flex: 1;
  border-radius: 0.1rem;
  background: currentColor;
  opacity: 0.45;
}
.sve-build-classes {
  margin-top: 0.8em;
  padding-top: 0.7em;
  border-top: 1px solid rgba(128, 128, 128, 0.25);
}
.sve-build-classes__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3em;
  margin-top: 0.45em;
}
.sve-build-classes__list code {
  padding: 0.12em 0.4em;
  border-radius: 0.25rem;
  background: rgba(128, 128, 128, 0.16);
  font-size: 0.6875rem;
}
</style>
