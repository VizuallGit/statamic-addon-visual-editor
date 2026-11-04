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
 * Spacing is drawn one of two ways, switched beside its note and kept in this
 * browser: the box (BuildSpacingBox.vue, padding | margin as tabs — the
 * default) or the Figma fields (BuildBoxFields.vue, both at once).
 */
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import BuildAlign from './BuildAlign.vue';
import BuildAlignMatrix from './BuildAlignMatrix.vue';
import BuildBoxFields from './BuildBoxFields.vue';
import BuildClassField from './BuildClassField.vue';
import BuildClassList from './BuildClassList.vue';
import BuildClassTarget from './BuildClassTarget.vue';
import { useFitRow } from './fit-row.js';
import BuildSpacingBox from './BuildSpacingBox.vue';
import BuildSpacingView from './BuildSpacingView.vue';
import BuildColorField from './BuildColorField.vue';
import BuildContainerRow from './BuildContainerRow.vue';
import BuildField from './BuildField.vue';
import BuildFieldReset from './BuildFieldReset.vue';
import BuildFields from './BuildFields.vue';
import BuildGapAxis from './BuildGapAxis.vue';
import BuildGridStep from './BuildGridStep.vue';
import BuildValueInput from './BuildValueInput.vue';
import { BUILD_KIDS, GRID_GAP, GRID_PRESETS, STYLE_FIELDS, STYLE_FRONT, fieldHas, inMore, kidsById, styleGroups } from '../../build-mode/catalog.js';
import { CONTAINER_SIZES, containerVariant } from '../../build-mode/container-query.js';
import { effectiveClass, fromClass, rootOf, variantChain } from '../../build-mode/classes.js';
import { MAX_TRACKS, fewestTracks, gapAxisOf, gridShape, presetOf, presetTooSmall } from '../../build-mode/grid.js';
import { groupIcon, ic } from '../../build-mode/icons.js';
import { chromeGet, chromeRemove, chromeSet } from '../../chrome-prefs.js';

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
// The row is one line: the sizes it has no room for are under its ⋯.
const sizeRow = ref(null);
const sizeMoreBtn = ref(null);
const sizeMorePanel = ref(null);
const sizeFit = useFitRow(sizeRow, sizeMoreBtn, sizeMorePanel);
const sizesOut = computed(() => (sizeFit.hidden.value ? sizes.value.slice(-sizeFit.hidden.value) : []));
const stateNow = computed(() => (port.rev.value, port.state()));
const deviceIcon = (name) => (name === 'all' ? ic('sidesAll') : port.lists.deviceIcons?.[name] || '');

const sizeHint = computed(() => {
  const container = CONTAINER_SIZES.find((size) => containerVariant(size.key) === sizeNow.value);

  if (container) {
    const under = port.t('container_under', { size: `${container.rem}rem` });
    const what = stateNow.value ? port.t('size_hint_state', { size: under, state: stateNow.value }) : under;

    return port.t('size_hint_container', { size: `<b>${what}</b>` });
  }

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

/* ---------------- Container queries — the demo (container-query.js) ---------------- */

const containerDemo = computed(() => !!port.containerDemo && !port.cssTarget);
const isContainer = computed(() => classes.value.includes('@container'));
// `@container` goes on bare: no breakpoint, container size or state in front of it.
const containerBare = computed(() => chain.value[0] === '');

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

  // A grid starts as Add's Grid does: one column and the site's gutter, where it has neither yet.
  if (next === 'grid' && flow.value !== 'grid') {
    const cols = !eff('grid-template-columns');
    const gap = !eff('gap') && !eff('column-gap') && !eff('row-gap');

    ensure('display', 'grid');

    if (cols) {
      port.setClass('grid-cols-1');
    }

    if (gap) {
      port.setClass(GRID_GAP);
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

/* A grid's one gap field: the axis it sets, picked with BuildGapAxis for this element, else the gap it already has */
const GAP_FIELD = {
  all: { id: 'gap-all', css: 'gap', icon: 'gapAll', fallbacks: [] },
  block: { id: 'gap-row', css: 'row-gap', icon: 'gapY', fallbacks: ['gap'] },
  inline: { id: 'gap-col', css: 'column-gap', icon: 'gapX', fallbacks: ['gap'] },
};
const gapPick = ref({ path: null, axis: '' });
const gapAxis = computed({
  get: () => (gapPick.value.path === props.node.path && gapPick.value.axis)
    || gapAxisOf({ gap: !!eff('gap'), row: !!eff('row-gap'), col: !!eff('column-gap') }),
  set: (axis) => {
    gapPick.value = { path: props.node.path, axis };
  },
});
const gapField = computed(() => GAP_FIELD[gapAxis.value]);

/* Grid: the classes at the size picked (grid.js), the counts and cells as the canvas lays them out (the port's `gridAround`) */
const gridParts = computed(() => port.gridPartsAt(props.node.path));
const around = computed(() => port.gridAround?.(props.node.path) || { own: null, parent: null, item: null });
const ownGrid = computed(() => around.value.own);
const parentGrid = computed(() => around.value.parent);
const gridItem = computed(() => (around.value.item?.col && around.value.item?.row ? around.value.item : null));
const gridLeast = computed(() => fewestTracks(ownGrid.value?.items || []));
const spanOf = (range) => range[1] - range[0] + 1;
/* Style's grid tiles on one line: the grid's own first — its preset, or its own shape when it is none of them — the other presets behind it in their order */
const gridPreset = computed(() => presetOf(gridParts.value, GRID_PRESETS));
const shape = computed(() => gridShape(gridParts.value, ownGrid.value || {}, GRID_PRESETS));
const presetInherited = computed(() => (gridParts.value.cols?.inherited ?? true) && (gridParts.value.rows?.inherited ?? true));
const tiles = computed(() => (gridPreset.value ? [gridPreset.value, ...GRID_PRESETS.filter((preset) => preset !== gridPreset.value)] : GRID_PRESETS));
const tooSmall = (preset) => presetTooSmall(preset, gridLeast.value);
const tileTracks = (parts, rows) => ({
  gridTemplateColumns: parts.slice(0, MAX_TRACKS).map((part) => `${part}fr`).join(' '),
  gridTemplateRows: `repeat(${Math.min(rows, MAX_TRACKS)}, minmax(0, 1fr))`,
});
const pickPreset = (preset) => {
  if (!tooSmall(preset)) {
    port.setGridPresetAt(props.node.path, preset);
  }
};
/** One by one already, and no child spanning columns: nothing for the reset to do. */
const oneByOneNow = computed(() => (gridParts.value.cols?.n ?? 1) === 1 && (gridParts.value.rows?.n ?? 1) <= 1 && gridLeast.value.cols <= 1);
const resetGrid = () => port.resetGridAt(props.node.path);

/* The line of tiles: faded at an edge with more beyond it, turned along by a mouse's wheel, back at its start when the grid's own changes */
const tileRow = ref(null);
const tileEdges = ref({ start: false, end: false });
// A function ref: the grid's fields stand inside the groups' v-for, where a named ref is a list.
const setTileRow = (el) => {
  tileRow.value = el;
};

function readTileEdges() {
  const row = tileRow.value;

  tileEdges.value = row ? { start: row.scrollLeft > 1, end: row.scrollLeft + row.clientWidth < row.scrollWidth - 1 } : { start: false, end: false };
}

function tilesAcross(event) {
  const row = tileRow.value;

  if (!row || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
    return;
  }

  const next = Math.max(0, Math.min(row.scrollWidth - row.clientWidth, row.scrollLeft + event.deltaY));

  // At its end the wheel scrolls the panel on.
  if (next !== row.scrollLeft) {
    row.scrollLeft = next;
    event.preventDefault();
  }
}

watch([tileRow, () => tiles.value.length, () => !!shape.value], () => nextTick(readTileEdges));
watch(
  () => (shape.value ? 'own' : gridPreset.value?.key || ''),
  () => nextTick(() => tileRow.value?.scrollTo({ left: 0, behavior: 'smooth' }))
);

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

const ownHit = (hit) => (hit && !hit.inherited ? hit : null);

/**
 * The classes these tools have on the element itself at the size and state
 * picked — not what reaches it from a wider size. Both names a tool answers
 * to are asked (`css` and its Tailwind twin, `padding-block-start` and
 * `padding-top`), each on its own, so the twin counts as the element's own.
 * What a row's dot stands for, and what it takes away.
 */
function ownOf(items) {
  port.rev.value;

  const names = new Set();
  const take = (hit) => ownHit(hit) && names.add(hit.name);

  for (const item of items) {
    if (item.twGroup) {
      take(effGroup(item.twGroup));
      continue;
    }

    for (const one of [item, ...(item.kids || [])]) {
      [...new Set([one.css, one.tw].filter(Boolean))].forEach((property) => take(eff(property)));
    }
  }

  return [...names];
}

/** The same for a family, with its fields: what the blue dot in its header stands for. */
function groupOwn(group) {
  return [...new Set([...ownOf(group.tools), ...fieldsOf(group).map((field) => ownHit(effField(field))?.name).filter(Boolean)])];
}

/* Flow, Alignment and Distribute write the same few properties; each row's dot takes off what that row wrote. */
const FLOW_PROPS = [{ css: 'display' }, { css: 'flex-direction' }, { css: 'flex-wrap' }];
const flowOwn = computed(() => ownOf(FLOW_PROPS));
const distributeOwn = computed(() => ownOf(distributeKids.value).filter((name) => distributeKids.value.some((kid) => kid.twClass === name)));
const alignmentOwn = computed(() => ownOf([{ css: 'justify-content' }, { css: 'align-items' }]).filter((name) => !distributeOwn.value.includes(name)));

/** The dot pressed: the family's own classes taken off, each as the Tailwind pane takes one off (a second set toggles it). */
function resetGroup(group) {
  groupOwn(group).forEach((name) => port.setClass(name));
}

/* ---------------- More: what a family keeps folded (catalog.js STYLE_FRONT) ---------------- */

/** The fields this layout draws by hand that wait under More, by family and property. */
const DRAWN_MORE = { size: ['min-width', 'min-height', 'max-height'], typography: ['font-family'], effects: ['overflow'] };
/* The families whose More is open, kept per user like the rest of the editor's chrome. */
const MORE_KEY = 'sve-build-style-more';
const moreOpen = ref(String(chromeGet(window, MORE_KEY) || '').split(',').filter(Boolean));
const moreIsOpen = (group) => moreOpen.value.includes(group.id);

function toggleMore(group) {
  moreOpen.value = moreIsOpen(group) ? moreOpen.value.filter((id) => id !== group.id) : [...moreOpen.value, group.id];

  if (moreOpen.value.length) {
    chromeSet(window, MORE_KEY, moreOpen.value.join(','));
  } else {
    chromeRemove(window, MORE_KEY);
  }
}

/** Whether a field stands: in front always, from under More when it is open or the field has a value. */
const stands = (group, name, hit) => !inMore(group.id, name) || moreIsOpen(group) || !!hit;
const frontFields = (group) => fieldsOf(group).filter((field) => !inMore(group.id, field.label));
const moreFields = (group) => fieldsOf(group).filter((field) => inMore(group.id, field.label) && stands(group, field.label, effField(field)));
const drawnStands = (group) => (DRAWN_MORE[group.id] || []).some((name) => stands(group, name, eff(name)));
const moreStands = (group) => drawnStands(group) || moreFields(group).length > 0;

/** How many of a family's fields More keeps out of sight: those under it with no value. */
function folded(group) {
  port.rev.value;

  return (DRAWN_MORE[group.id] || []).filter((name) => !eff(name)).length
    + fieldsOf(group).filter((field) => inMore(group.id, field.label) && !effField(field)).length;
}

/* ---------------- Flow space: the room a flow puts above the element, or between its children (build-mode/flow.js) ---------------- */

const flowPlace = computed(() => port.flow());
const flowField = computed(() => {
  const names = (port.rev.value, port.flowSpaces());

  // Tailwind's side only: a class is what it writes.
  if (port.cssTarget || !names.length) {
    return null;
  }

  const set = !!effectiveClass(classes.value.join(' '), ['field'], chain.value, (name) => (names.includes(name) ? 'field' : ''));

  return flowPlace.value?.inside || flowPlace.value?.holds || set ? { label: 'flow-space', names } : null;
});
const flowHint = computed(() => {
  const at = flowPlace.value || {};

  if (at.inside && at.holds) {
    return 'flow_space_both';
  }

  if (at.holds) {
    return 'flow_space_between';
  }

  if (at.inside) {
    return at.first ? 'flow_space_first' : 'flow_space_above';
  }

  return 'flow_space_idle';
});

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
  port.classes.edit('');
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
      <BuildClassTarget />
      <BuildClassList />

      <div class="fg-seg fg-sizes" data-sve-build-sizes>
        <div ref="sizeRow" class="fg-fit">
          <button
            v-for="row in sizes"
            :key="row.handle || 'all'"
            type="button"
            :aria-pressed="sizeNow === row.handle"
            :title="row.label"
            :data-sve-build-size="row.handle || 'all'"
            @click="port.setSize(row.handle)"
          ><span v-if="row.handle" v-html="deviceIcon(row.icon)"></span><span>{{ row.label }}</span></button>
        </div>
        <button
          ref="sizeMoreBtn"
          type="button"
          class="fg-more"
          style="display: none"
          :aria-expanded="sizeFit.open.value"
          :aria-pressed="sizesOut.some((row) => row.handle === sizeNow)"
          :aria-label="port.t('sizes_more')"
          :title="port.t('sizes_more')"
          data-sve-build-sizes-more
          @click="sizeFit.toggle"
        >⋯</button>
      </div>
      <div v-if="sizeFit.open.value" ref="sizeMorePanel" class="fg-classpick" data-sve-build-sizes-list>
        <div class="fg-classpick__rows">
          <button
            v-for="row in sizesOut"
            :key="row.handle"
            type="button"
            :aria-pressed="sizeNow === row.handle"
            :data-sve-build-size="row.handle"
            @click="port.setSize(row.handle); sizeFit.toggle()"
          ><span class="fg-more__icon" v-html="deviceIcon(row.icon)"></span>{{ row.label }}</button>
        </div>
      </div>
      <BuildContainerRow v-if="containerDemo" :path="node.path" />
      <div class="fg-line">
        <p class="fg-hint" v-html="sizeHint"></p>
        <button
          v-if="containerDemo"
          type="button"
          class="fg-state"
          :class="{ 'is-set': isContainer }"
          :aria-pressed="isContainer"
          :disabled="!containerBare"
          :title="port.t(containerBare ? 'container_title' : 'container_title_bare')"
          data-sve-build-container-toggle
          @click="port.setClass('@container')"
        ><span>{{ port.t('container') }}</span></button>
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
          <div class="fg-lab">{{ port.t('flow') }}<BuildFieldReset :names="flowOwn" :label="port.t('flow')" /></div>
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
              class="fg-ib fg-flow-more"
              :aria-pressed="flow === 'other'"
              :title="flow === 'other' ? `display: ${disp}` : port.t('display_more')"
              :aria-label="port.t('display_more')"
              data-sve-build-display-more
              @click="openDisplay"
              v-html="ic('more')"
            ></button>
            <button
              type="button"
              class="fg-ib fg-flow-more"
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
                <div class="fg-lab">{{ port.t('alignment') }}<BuildFieldReset :names="alignmentOwn" :label="port.t('alignment')" /></div>
                <BuildAlignMatrix :column="flow === 'col'" />
              </div>
              <div>
                <div class="fg-lab">{{ port.t('gap') }}</div>
                <BuildField v-if="gapKid('gap-all')" :icon="flow === 'col' ? 'gapY' : 'gapX'" title="gap">
                  <BuildValueInput :tool="gapKid('gap-all')" label="gap" compact />
                </BuildField>
                <div class="fg-lab">{{ port.t('distribute') }}<BuildFieldReset :names="distributeOwn" :label="port.t('distribute')" /></div>
                <BuildAlign :kids="distributeKids" :rotate="flow === 'col'" />
              </div>
            </div>
          </template>

          <template v-if="flow === 'grid'">
            <div class="fg-lab bm-sp-lab">
              grid-template-columns<BuildFieldReset :hit="ownHit(cols)" label="grid-template-columns" />
              <button v-if="!oneByOneNow" type="button" class="bm-sp-reset" :title="port.t('grid_reset_title')" data-sve-build-grid-reset @click="resetGrid">
                <span v-html="ic('reset')"></span>{{ port.t('grid_reset') }}
              </button>
            </div>
            <div
              :ref="setTileRow"
              class="bm-sp"
              :data-more-start="tileEdges.start || undefined"
              :data-more-end="tileEdges.end || undefined"
              data-sve-build-structures
              @scroll.passive="readTileEdges"
              @wheel="tilesAcross"
            >
              <TransitionGroup name="bm-sp-mv">
                <span v-if="shape" key="own" class="bm-sp-o is-on" :class="{ inh: shape.inherited }" :title="port.t('grid_shape_title')" data-sve-build-grid-shape>
                  <span class="bm-shape" :style="tileTracks(shape.fr, shape.rows)"><i v-for="n in Math.min(shape.cols, MAX_TRACKS) * Math.min(shape.rows, MAX_TRACKS)" :key="n"></i></span>
                  <span class="bm-sp-l">{{ shape.cols }} × {{ shape.rows }}</span>
                </span>
                <button
                  v-for="p in tiles"
                  :key="p.key"
                  type="button"
                  class="bm-sp-o"
                  :class="{ 'is-on': p === gridPreset, inh: p === gridPreset && presetInherited }"
                  :aria-pressed="p === gridPreset"
                  :aria-disabled="tooSmall(p) || undefined"
                  :title="tooSmall(p) ? port.t('grid_preset_small') : p.label"
                  :data-sve-build-preset="p.key"
                  :data-sve-build-structure="p.rows === 1 ? p.cls : undefined"
                  @click="pickPreset(p)"
                >
                  <span class="bm-shape" :style="tileTracks(p.parts, p.rows)"><i v-for="n in p.parts.length * p.rows" :key="n"></i></span>
                  <span class="bm-sp-l">{{ p.label }}</span>
                </button>
              </TransitionGroup>
            </div>
            <div class="fg-grid">
              <BuildGridStep :path="node.path" part="cols" letter="C" :label="port.t('grid_columns')" :hit="gridParts.cols" :seen="ownGrid?.cols || null" :min="gridLeast.cols" :max="MAX_TRACKS" />
              <BuildGridStep :path="node.path" part="rows" letter="R" :label="port.t('grid_rows')" :hit="gridParts.rows" :seen="ownGrid?.rows || null" :min="gridLeast.rows" />
            </div>
            <div v-if="gapKid(gapField.id)" class="fg-box" data-sve-build-gap>
              <BuildField :icon="gapField.icon" :title="gapField.css">
                <BuildValueInput :key="gapField.id" :tool="gapKid(gapField.id)" :fallbacks="gapField.fallbacks" :label="gapField.css" compact />
              </BuildField>
              <BuildGapAxis v-model:axis="gapAxis" />
            </div>
            <div class="fg-lab">{{ port.t('align_items') }}<BuildFieldReset :names="ownOf(crossKids)" :label="port.t('align_items')" /></div>
            <BuildAlign :kids="crossKids" />
          </template>

          <template v-if="gridItem">
            <div class="fg-lab">{{ port.t('grid_item') }}</div>
            <div class="fg-grid" data-sve-build-grid-item-fields>
              <BuildGridStep :path="node.path" part="colSpan" letter="↔" :label="port.t('grid_col_span')" :hit="gridParts.colSpan" :seen="spanOf(gridItem.col)" :max="parentGrid.cols" />
              <BuildGridStep :path="node.path" part="rowSpan" letter="↕" :label="port.t('grid_row_span')" :hit="gridParts.rowSpan" :seen="spanOf(gridItem.row)" />
              <BuildGridStep :path="node.path" part="colStart" letter="C" :label="port.t('grid_col_start')" :hit="gridParts.colStart" :seen="gridItem.col[0] + 1" :max="parentGrid.cols" auto />
              <BuildGridStep :path="node.path" part="rowStart" letter="R" :label="port.t('grid_row_start')" :hit="gridParts.rowStart" :seen="gridItem.row[0] + 1" auto />
            </div>
          </template>

          <label class="fg-check">
            <input type="checkbox" :checked="clip" data-sve-build-clip @change="port.setClass('overflow-hidden')" />
            <span>{{ port.t('clip_content') }}</span>
            <BuildFieldReset :hit="clip ? ownHit(eff('overflow')) : null" :label="port.t('clip_content')" />
          </label>
        </template>

        <!-- Position -->
        <template v-else-if="group.id === 'position'">
          <label class="fg-field">
            <span class="fg-pre" v-html="groupIcon(group, port.lists.toolIcons)"></span>
            <BuildValueInput :tool="POSITION" label="position" :typed="false" />
          </label>
          <BuildFields :fields="frontFields(group)" />
          <div v-if="moreStands(group)" class="fg-sec__more" :class="{ 'is-open': moreIsOpen(group) }">
            <BuildFields :fields="moreFields(group)" />
          </div>
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
            <BuildField v-if="tool('tw-maxw')" letter="Max W" title="max-width">
              <BuildValueInput :tool="tool('tw-maxw')" label="max-width" compact />
            </BuildField>
          </div>
          <p class="fg-hint">{{ port.t('size_more') }}</p>
          <BuildFields :fields="frontFields(group)" />
          <div v-if="moreStands(group)" class="fg-sec__more" :class="{ 'is-open': moreIsOpen(group) }">
            <div v-if="drawnStands(group)" class="fg-grid">
              <BuildField v-if="tool('tw-minw') && stands(group, 'min-width', eff('min-width'))" letter="Min W" title="min-width">
                <BuildValueInput :tool="tool('tw-minw')" label="min-width" compact />
              </BuildField>
              <BuildField v-if="stands(group, 'min-height', eff('min-height'))" letter="Min H" title="min-height">
                <BuildValueInput :tool="MIN_H" label="min-height" compact />
              </BuildField>
              <BuildField v-if="stands(group, 'max-height', eff('max-height'))" letter="Max H" title="max-height">
                <BuildValueInput :tool="MAX_H" label="max-height" compact />
              </BuildField>
            </div>
            <BuildFields :fields="moreFields(group)" />
          </div>
        </template>

        <!-- Spacing -->
        <template v-else-if="group.id === 'spacing'">
          <template v-if="flowField">
            <div class="fg-lab">{{ port.t('flow_space') }}</div>
            <BuildClassField :field="flowField" />
            <p class="fg-hint" data-sve-build-flow-hint>{{ port.t(flowHint) }}</p>
          </template>
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
          <div class="bm-sp-foot">
            <BuildSpacingView :view="spacingView" @flip="flipSpacingView" />
            <p class="fg-hint" v-html="port.t('value_hint')"></p>
          </div>
        </template>

        <!-- Typography -->
        <template v-else-if="group.id === 'typography'">
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
            <div class="fg-line">
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
              <BuildFieldReset :hit="ownHit(eff('text-align'))" label="text-align" />
            </div>
          </div>
          <template v-if="tool('color')">
            <div class="fg-lab">color</div>
            <BuildColorField :tool="tool('color')" />
          </template>
          <template v-for="item in extra(group)" :key="item.id">
            <div class="fg-lab">{{ item.css }}<BuildFieldReset v-if="item.kids?.length" :names="ownOf([item])" :label="item.css" /></div>
            <BuildAlign v-if="item.kids?.length" :kids="item.kids" :align="false" />
            <BuildField v-else :title="item.css"><BuildValueInput :tool="item" compact /></BuildField>
          </template>
          <BuildFields :fields="frontFields(group)" />
          <div v-if="moreStands(group)" class="fg-sec__more" :class="{ 'is-open': moreIsOpen(group) }">
            <BuildField v-if="tool('tw-font') && stands(group, 'font-family', eff('font-family'))" title="font-family">
              <BuildValueInput :tool="tool('tw-font')" label="font-family" empty="font-family" compact chip />
            </BuildField>
            <BuildFields :fields="moreFields(group)" />
          </div>
        </template>

        <!-- Background -->
        <template v-else-if="group.id === 'background'">
          <BuildColorField v-if="tool('bg')" :tool="tool('bg')" />
          <BuildFields :fields="frontFields(group)" :path="node.path" />
          <div v-if="moreStands(group)" class="fg-sec__more" :class="{ 'is-open': moreIsOpen(group) }">
            <BuildFields :fields="moreFields(group)" :path="node.path" />
          </div>
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
              <BuildFieldReset :hit="ownHit(effGroup(borderNames))" label="border-width" />
            </label>
            <div class="fg-line">
              <BuildField icon="radius" title="border-radius">
                <BuildValueInput :tool="radiusKid" label="border-radius" compact chip />
              </BuildField>
              <button type="button" class="fg-ib" :aria-pressed="corners" :title="port.t('link_each')" @click="corners = !corners" v-html="ic('sides')"></button>
            </div>
          </div>
          <template v-if="corners">
            <div class="fg-lab">border-radius<BuildFieldReset :names="ownOf(cornerKids)" label="border-radius" /></div>
            <BuildAlign :kids="cornerKids" :align="false" />
          </template>
          <div class="fg-lab">border-color</div>
          <BuildColorField :tool="borderColor" />
          <button type="button" class="fg-more" :aria-pressed="borderSides" data-sve-build-border-sides @click="borderSides = !borderSides">
            <span v-html="ic('sides')"></span>{{ port.t('border_sides') }}
          </button>
          <template v-if="borderSides">
            <div class="fg-lab">border-width<BuildFieldReset :names="ownOf(widthKids)" label="border-width" /></div>
            <BuildAlign :kids="widthKids" :align="false" />
            <div class="fg-lab">border-color<BuildFieldReset :names="ownOf(colorKids)" label="border-color" /></div>
            <BuildAlign :kids="colorKids" :align="false" />
          </template>
          <BuildFields :fields="frontFields(group)" />
          <div v-if="moreStands(group)" class="fg-sec__more" :class="{ 'is-open': moreIsOpen(group) }">
            <BuildFields :fields="moreFields(group)" />
          </div>
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
              <BuildFieldReset :hit="ownHit(effGroup(shadowNames))" label="box-shadow" />
            </label>
          </div>
          <BuildFields :fields="frontFields(group)" />
          <div v-if="moreStands(group)" class="fg-sec__more" :class="{ 'is-open': moreIsOpen(group) }">
            <template v-if="stands(group, 'overflow', eff('overflow'))">
              <div class="fg-lab">overflow</div>
              <label class="fg-field">
                <span class="fg-pre" v-html="ic('sides')"></span>
                <BuildValueInput :tool="OVERFLOW" label="overflow" :typed="false" />
              </label>
            </template>
            <BuildFields :fields="moreFields(group)" />
          </div>
        </template>

        <!-- Transform & transition -->
        <template v-else-if="group.id === 'transform'">
          <BuildFields :fields="frontFields(group)" />
          <div v-if="moreStands(group)" class="fg-sec__more" :class="{ 'is-open': moreIsOpen(group) }">
            <BuildFields :fields="moreFields(group)" />
          </div>
        </template>

        <!-- A family this layout does not have: every tool from its shape -->
        <template v-else>
          <template v-for="item in group.tools" :key="item.id">
            <div class="fg-lab">{{ item.css }}<BuildFieldReset v-if="item.kids?.length || (item.menu === 'choices' && choices(item).length <= 6)" :names="ownOf([item])" :label="item.css" /></div>
            <BuildAlign v-if="item.kids?.length" :kids="item.kids" :align="false" />
            <div v-else-if="item.menu === 'choices' && choices(item).length <= 6" class="fg-seg">
              <button v-for="c in choices(item)" :key="c.name" type="button" :aria-pressed="pressed(eff(item.css), c.name)" @click="port.setClass(c.name)">{{ c.label }}</button>
            </div>
            <BuildField v-else :title="item.css"><BuildValueInput :tool="item" compact /></BuildField>
          </template>
        </template>

        <!-- Under what is in front; on, above what it unfolded (the order is the stylesheet's). The class list's switch, a size down -->
        <label v-if="STYLE_FRONT[group.id] && (moreIsOpen(group) || folded(group))" class="fg-sec__more-row">
          <span>{{ port.t('style_more') }}</span>
          <span class="fg-classes__count">{{ folded(group) }}</span>
          <button
            type="button"
            class="bm-switch"
            role="switch"
            :aria-checked="moreIsOpen(group)"
            :aria-label="port.t('style_more')"
            :data-sve-build-more="group.id"
            @click="toggleMore(group)"
          ></button>
        </label>
      </div>
    </section>
  </div>
</template>
