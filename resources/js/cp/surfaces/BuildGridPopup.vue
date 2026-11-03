<script setup>
/**
 * Style's "Edit grid": the grid at `path` drawn small beside the panel — its
 * columns and rows as cells, each child a block where it stands — as the
 * canvas lays it out at the size picked (the port's `gridAround`). A block
 * dragged moves its child, its corner dragged spans it, a click picks it, a +
 * in a free cell adds an empty one, and the steppers set the columns and
 * rows. Every write is the port's (`setGridAt`, `addGridCell`), so it lands at
 * the size and state picked, as the builder over the preview writes.
 *
 * On the Control Panel's body beside the panel, as Add's SVG popup is
 * (lib/beside.js); Escape or a press outside closes it.
 *
 * Mounted nowhere for now: Style's grid fields and the builder over the
 * preview (columns-overlay.js) do this. Kept for when a popup is wanted again.
 */
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import BuildGridStep from './BuildGridStep.vue';
import { besideSpot } from '../../lib/beside.js';
import { ic } from '../../build-mode/icons.js';
import { MAX_TRACKS, fewestTracks, spanTo, startAt } from '../../build-mode/grid.js';

const props = defineProps({
  /** The grid's path in the file. */
  path: { type: String, required: true },
  /** The button's box and the panel's (getBoundingClientRect) when it was pressed. */
  row: { type: Object, required: true },
  column: { type: Object, required: true },
  /** Style's line on where a change lands (its size and state). */
  hint: { type: String, default: '' },
});
const emit = defineEmits(['close']);

const port = inject('sveBuild');
const el = ref(null);
const board = ref(null);
const spot = ref({ left: 0, top: 0 });
const drag = ref(null);
let observer = null;

const grid = computed(() => port.gridAround(props.path).own);
const parts = computed(() => port.gridPartsAt(props.path));
const cols = computed(() => grid.value?.cols || 0);
const rows = computed(() => grid.value?.rows || 0);
const items = computed(() => (grid.value?.items || []).filter((item) => item.col && item.row));
const picked = computed(() => port.selectedPath());
const least = computed(() => fewestTracks(items.value));
const area = (col, row) => ({ gridColumn: `${col[0] + 1} / ${col[1] + 2}`, gridRow: `${row[0] + 1} / ${row[1] + 2}` });
const cells = computed(() => Array.from({ length: cols.value * rows.value }, (_, i) => [i % cols.value, Math.floor(i / cols.value)]));
const free = computed(() => new Set((grid.value?.empty || []).map(([c, r]) => `${c}:${r}`)));

function place() {
  if (el.value) {
    spot.value = besideSpot(
      props.row,
      props.column,
      { width: el.value.offsetWidth, height: el.value.offsetHeight },
      { width: window.innerWidth, height: window.innerHeight }
    );
  }
}

function addCell([c, r]) {
  const next = grid.value?.next;

  port.addGridCell(props.path, [c, r], !!next && next[0] === c && next[1] === r);
}

/* ---------------- dragging: the block moves, its corner spans ---------------- */

/** The board's tracks in its own px, `count` of them with the board's gap between. */
function tracks(count, size, gap) {
  const one = (size - gap * (count - 1)) / Math.max(count, 1);

  return Array.from({ length: count }, (_, i) => ({ start: i * (one + gap), end: i * (one + gap) + one }));
}

function boardAt(event) {
  const box = board.value.getBoundingClientRect();
  const cs = getComputedStyle(board.value);

  return {
    x: event.clientX - box.left,
    y: event.clientY - box.top,
    cols: tracks(cols.value, box.width, parseFloat(cs.columnGap) || 0),
    rows: tracks(rows.value, box.height, parseFloat(cs.rowGap) || 0),
  };
}

function startDrag(event, item, kind) {
  if (event.button !== 0 || !item.path) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const at = boardAt(event);

  drag.value = {
    kind,
    item,
    // Where in its first cell the block was taken: a move keeps the pointer there.
    grab: { x: at.x - at.cols[item.col[0]].start, y: at.y - at.rows[item.row[0]].start },
    down: { x: event.clientX, y: event.clientY },
    moved: false,
    target: { col: item.col, row: item.row },
  };
  window.addEventListener('pointermove', onMove, true);
  window.addEventListener('pointerup', onUp, true);
  window.addEventListener('pointercancel', endDrag, true);
}

function onMove(event) {
  const now = drag.value;

  if (!now) {
    return;
  }

  now.moved ||= Math.hypot(event.clientX - now.down.x, event.clientY - now.down.y) > 4;

  const at = boardAt(event);
  const { col, row } = now.item;

  if (now.kind === 'corner') {
    now.target = { col: [col[0], col[0] + spanTo(col[0], at.cols, at.x) - 1], row: [row[0], row[0] + spanTo(row[0], at.rows, at.y) - 1] };
  } else {
    const wide = col[1] - col[0] + 1;
    const tall = row[1] - row[0] + 1;
    const half = (track) => (track.end - track.start) / 2;
    const c = startAt(at.cols, at.x - now.grab.x + half(at.cols[0]), wide);
    const r = startAt(at.rows, at.y - now.grab.y + half(at.rows[0]), tall, Infinity);

    now.target = { col: [c, c + wide - 1], row: [r, r + tall - 1] };
  }
}

function endDrag() {
  drag.value = null;
  window.removeEventListener('pointermove', onMove, true);
  window.removeEventListener('pointerup', onUp, true);
  window.removeEventListener('pointercancel', endDrag, true);
}

function onUp() {
  const done = drag.value;

  endDrag();

  if (!done) {
    return;
  }

  const { item, target } = done;
  const changes = {};

  if (!done.moved) {
    port.select(item.path);

    return;
  }

  if (done.kind === 'corner') {
    if (target.col[1] !== item.col[1]) {
      changes.colSpan = target.col[1] - target.col[0] + 1;
    }

    if (target.row[1] !== item.row[1]) {
      changes.rowSpan = target.row[1] - target.row[0] + 1;
    }
  } else if (target.col[0] !== item.col[0] || target.row[0] !== item.row[0]) {
    // Both lines: a cell is two numbers, and one alone lets the browser move the other.
    changes.colStart = target.col[0] + 1;
    changes.rowStart = target.row[0] + 1;
  }

  if (Object.keys(changes).length) {
    port.setGridAt(item.path, changes, { select: item.path });
  }
}

/* ---------------- open and close ---------------- */

const onDown = (event) => {
  if (!el.value?.contains(event.target)) {
    emit('close');
  }
};
// Ahead of Build's own Escape, which would let go of the pick; a drag goes first.
const onKey = (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();

    if (drag.value) {
      endDrag();
    } else {
      emit('close');
    }
  }
};

onMounted(() => {
  observer = new ResizeObserver(place);
  observer.observe(el.value);
  place();
  document.addEventListener('pointerdown', onDown, true);
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('resize', place);
});

onBeforeUnmount(() => {
  endDrag();
  observer?.disconnect();
  document.removeEventListener('pointerdown', onDown, true);
  window.removeEventListener('keydown', onKey, true);
  window.removeEventListener('resize', place);
});
</script>

<template>
  <Teleport to="body">
    <div
      ref="el"
      class="sve-build bm-pop bm-gb"
      role="dialog"
      :aria-label="port.t('grid_edit')"
      data-sve-build-grid-pop
      :style="{ left: `${spot.left}px`, top: `${spot.top}px` }"
    >
      <h3 class="bm-pop-head">
        <span>{{ port.t('grid_edit') }}</span>
        <button type="button" class="bm-ib sm" :title="port.t('close')" :aria-label="port.t('close')" @click="emit('close')" v-html="ic('x')"></button>
      </h3>
      <div class="bm-pop-body">
        <p v-if="hint" class="fg-hint" v-html="hint"></p>
        <div class="fg-grid">
          <BuildGridStep :path="path" part="cols" letter="C" :label="port.t('grid_columns')" :hit="parts.cols" :seen="cols || null" :min="least.cols" :max="MAX_TRACKS" />
          <BuildGridStep :path="path" part="rows" letter="R" :label="port.t('grid_rows')" :hit="parts.rows" :seen="rows || null" :min="least.rows" />
        </div>
        <p v-if="!grid" class="fg-hint">{{ port.t('grid_not_shown') }}</p>
        <div v-else class="bm-gb-wrap">
          <div class="bm-gb-nums is-cols" :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }">
            <span v-for="n in cols" :key="n">{{ n }}</span>
          </div>
          <div class="bm-gb-nums is-rows" :style="{ gridTemplateRows: `repeat(${rows}, 2.25rem)` }">
            <span v-for="n in rows" :key="n">{{ n }}</span>
          </div>
          <div
            ref="board"
            class="bm-gb-board"
            :class="{ 'is-dragging': !!drag }"
            :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, 2.25rem)` }"
            data-sve-build-grid-board
          >
            <div v-for="[c, r] in cells" :key="`${c}:${r}`" class="bm-gb-cell" :style="area([c, c], [r, r])">
              <button
                v-if="free.has(`${c}:${r}`) && !drag"
                type="button"
                class="bm-gb-add"
                :title="port.t('grid_add_cell')"
                :aria-label="port.t('grid_add_cell')"
                :data-sve-build-grid-pop-add="`${c}:${r}`"
                @click="addCell([c, r])"
                v-html="ic('plus')"
              ></button>
            </div>
            <div
              v-for="(item, n) in items"
              :key="item.path || `loop-${n}`"
              class="bm-gb-item"
              :class="{ 'is-picked': item.path && item.path === picked, 'is-loop': !item.path, 'is-taken': drag?.item === item }"
              :style="area(item.col, item.row)"
              :title="item.path ? port.t('grid_move') : ''"
              :data-sve-build-grid-item="item.path"
              @pointerdown="startDrag($event, item, 'move')"
            >
              <span class="bm-gb-label">{{ item.label }}</span>
              <span v-if="item.path" class="bm-gb-corner" :title="port.t('grid_span')" @pointerdown="startDrag($event, item, 'corner')"></span>
            </div>
            <div v-if="drag?.moved" class="bm-gb-ghost" :style="area(drag.target.col, drag.target.row)"></div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
