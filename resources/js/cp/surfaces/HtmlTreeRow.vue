<script setup>
import { canEditFields } from '../../section-fields.js';

// Drawn to the same recipe as the eye, the duplicate and the bin below: same
// box, same stroke. A row of icons where one is heavier reads as a different
// kind of thing, and it is not one.
const FIELDS =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>';

const canFields = canEditFields(window);

/**
 * One row in the HTML tree — a tag, or a section that has not been opened yet.
 *
 * Both, deliberately, and this is the whole point of the component: a section
 * used to be drawn by its own markup in HtmlTreeList, so the same section wore
 * one name, one mark and one highlight while shut and different ones once it
 * was open. Renaming it showed on one and not the other. There is one row, and
 * shut is a state of it.
 *
 * What a shut section cannot offer, it does not draw: there is no file loaded,
 * so nothing to rename or lock yet. Hide, duplicate and delete act on the page,
 * so they are there either way. That is the state differing — not the row.
 *
 * A row wears few icons: what is special about it (a video, an Alpine state, a
 * lock that holds), then hide, duplicate and delete. Everything else is behind
 * the three dots (html-tree.js `openHtmlTreeRowMore`).
 */
import { figmaLook, htmlTreeUi as ui, rowCanHold, rowShowsRoom, rowShut } from '../html-tree/store.js';

defineProps({
  row: { type: Object, required: true },
  // The Figma look's boxes around this row (cp/html-tree/boxes.js); none in the other looks.
  box: { type: Object, default: null },
  // During a search: the row is here only because something under it
  // matched. Drawn, so the path to the match reads, but held back.
  dim: { type: Boolean, default: false },
});

const TWIST =
  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

const EYE =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';

const EYE_OFF =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>';

const DUP =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>';

const VIDEO =
  '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>';
const VIDEO_OFF =
  '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>';
// A switch, in the eye's box and stroke: a state of the component, not of the
// file. Off: an empty track, the knob solid on the left. On: the track filled,
// the knob cut out of it on the right — it reads as on from the drawing alone,
// on any row background, as the video icon reads play or pause.
const ALPINE_OFF =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="5.5"/><circle cx="7.5" cy="12" r="3" fill="currentColor" stroke="none"/></svg>';
const ALPINE_ON =
  '<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5h9a6.5 6.5 0 0 1 0 13h-9a6.5 6.5 0 0 1 0-13ZM16.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z"/></svg>';
// A lock, drawn in the same band as the bin and the copy (4–20 of 24) so the
// icons read as one size.
const LOCK_ON =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

const MORE =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';

const DEL =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>';

function rowTitle(row) {
  if (row.synthetic) {
    return row.frame === 'main' ? ui.frameMainTitle : row.frame === 'template' ? ui.frameTemplateTitle : ui.frameOpenTitle;
  }

  if (row.kind === 'component') {
    return row.src ? `partial:${row.src}` : row.tag;
  }

  return row.name ? `${row.tag} ${row.name}` : row.tag;
}

/** A section nobody has opened yet: the same row, without a file behind it. */
function isShutSection(row) {
  return !!row.section;
}

/**
 * Header, main or footer — the page's frame (html-tree.js builds them). A place
 * to go to and to step into; never a thing to move, copy, rename or delete.
 * `synthetic` is the stand-in row drawn around a section's list; on the
 * header's, the footer's or the layout's own file the real root row wears the
 * frame instead, and that one is picked and folded like any row.
 */
function isFrame(row) {
  return !!row.frame;
}

/**
 * `{{ template_content }}` / `{{ yield:… }}` — where the page's own markup
 * lands. Shown so `<main>` does not read as empty, but there is no tag behind
 * it: it cannot be moved, renamed, wrapped or deleted.
 */
function isSlot(row) {
  return row.kind === 'slot';
}

/**
 * Press and drag. A section — shut, or the open one by its root row — moves
 * on the page, between the other sections; any other row moves in the file.
 */
function onPointerDown(event, row) {
  if (isFrame(row) || isSlot(row)) {
    return;
  }

  if (isShutSection(row)) {
    ui.onSectionPointerDown?.(event, row.section);
  } else if (row.sectionRoot) {
    ui.onSectionPointerDown?.(event, row.sectionRoot);
  } else {
    ui.onPointerDown?.(event, row.id);
  }
}

/** `el` is the row's own element: a loop's or a condition's settings open beside it (logic-popup.js). */
function onRowClick(row, el) {
  if (row.synthetic) {
    ui.onFrame?.(row.frame);

    return;
  }

  if (isShutSection(row)) {
    ui.onSection?.(row.section);

    return;
  }

  ui.onSelect?.(row.id, el);
}

function rowBind(row, dim) {
  const bind = { 'data-sve-ht-id': row.id };

  if (row.locked) {
    bind['data-sve-ht-locked'] = '';
  }

  if (row.current) {
    bind['data-sve-ht-current'] = '';
  }

  if (row.hidden || row.sectionOff) {
    bind['data-sve-ht-hidden'] = '';
  }

  // A video or an Alpine state shows without the pointer on the row.
  if (row.videoNth >= 0 || row.alpineNth >= 0) {
    bind['data-sve-ht-special'] = '';
  }

  // The family the row belongs to (html-tree-icons.js decides) and how deep it
  // sits. Both are for the stylesheet only: the tags look colours the icon and
  // the chip by the family, and weights a root row's name by the depth.
  bind['data-sve-ht-cat'] = row.cat || 'other';
  bind['data-sve-ht-depth'] = String(row.depth);

  if (dim) {
    bind['data-sve-ht-dim'] = '';
  }

  // Kept so the old stylesheet rules and the verify scripts still find a
  // section by name; it marks which state the row is in, nothing more.
  if (isShutSection(row)) {
    bind['data-sve-ht-sec'] = '';
  }

  if (isFrame(row)) {
    bind['data-sve-ht-frame'] = row.frame;
  }

  if (!isShutSection(row) && ui.dropId === row.id && ui.dropPlace) {
    bind['data-sve-ht-drop'] = ui.dropPlace;
  }

  return bind;
}

/**
 * A row that stays (`fixed`, html-tree.js): the layout's header and footer
 * calls, and the <body>. No eye, no copy, no bin — hidden or taken out, that
 * half is off every page, or the page is.
 */
function isFixed(row) {
  return !!row.fixed;
}

/**
 * A template's loop over the page's sections: moved and deleted as a whole,
 * never copied — a second loop draws every section twice — and not hidden.
 */
function isSections(row) {
  return row.kind === 'sections';
}

/** Held by the padlock: locked itself, or inside something locked. */
function isHeld(row) {
  return !!(row.locked || row.lockedIn);
}

/** The three dots: there is nothing behind them inside a lock or on a fixed row of the frame. */
function canMore(row) {
  return !row.lockedIn && !isFixed(row);
}

function canHide(row) {
  return pageLevel(row) || (!isFixed(row) && !isSections(row) && !isHeld(row) && (!row.hidden || row.wrapFrom != null));
}

/** A section's eye hides it on this page. A tag's comments it out in the file, for every page. */
function eyeTitle(row) {
  if (!canAct(row)) {
    return ui.lockedTitle;
  }

  const off = row.hidden || row.sectionOff;

  return pageLevel(row) ? (off ? ui.sectionShowTitle : ui.sectionHideTitle) : off ? ui.showTitle : ui.hideTitle;
}

/** The pointer passing over the dots on its way down the column opens nothing. */
const MORE_HOVER_MS = 120;
let moreTimer = null;

function hoverMore(button, row) {
  window.clearTimeout(moreTimer);
  moreTimer = window.setTimeout(() => ui.onMore?.(button, row.id), MORE_HOVER_MS);
}

function leaveMore() {
  window.clearTimeout(moreTimer);
}

/**
 * The open section's root row acts on the PAGE — move, duplicate, remove the
 * section — not on the file. The file's lock guards the code panes, so it has
 * no say here: a locked template is still a section you may take off a page.
 */
function pageLevel(row) {
  return !!row.sectionRoot || !!row.section;
}

function canAct(row) {
  return (ui.canEdit && !isHeld(row)) || pageLevel(row);
}

/*
 * The Figma look (store.js `figmaLook`) draws the tree as Etch does: each
 * element a box with its children inside it. The rows are flat, so a row
 * paints its share of every box it sits in — one `<i>` per level in its
 * spacer, reaching left to that level's edge and up across the gap above
 * it — and the last row inside a box rounds the box off below (`box`, from
 * HtmlTreeList: how many boxes close after the row). The layers and classic
 * looks get none of these attributes; their rows are what they were.
 */
function rowStyle(row, box) {
  if (!figmaLook()) {
    return { '--sve-ht-depth': row.depth };
  }

  return { '--sve-ht-depth': row.depth, '--sve-ht-ends': box?.ends || 0, '--sve-ht-after': box?.after || 0 };
}

/** One box the row sits in: `up` levels out from the row, and whether it closes after it. */
function levelBind(depth, ends, i) {
  if (!figmaLook()) {
    return {};
  }

  return {
    style: { '--sve-ht-up': depth - i },
    'data-sve-ht-end': i >= depth - ends ? '' : null,
  };
}
</script>

<template>
  <div
    data-sve-ht-row
    v-bind="rowBind(row, dim)"
    role="button"
    tabindex="0"
    :title="rowTitle(row)"
    :style="rowStyle(row, box)"
    @click="onRowClick(row, $event.currentTarget)"
    @dblclick.prevent="row.synthetic ? ui.onFrameEnter?.(row.frame) : isFrame(row) || isSlot(row) || isShutSection(row) ? null : ui.onRename?.(row.id)"
    @keydown.enter.prevent="onRowClick(row, $event.currentTarget)"
    @keydown.space.prevent="onRowClick(row, $event.currentTarget)"
    @pointerdown="onPointerDown($event, row)"
    @pointerenter="isShutSection(row) ? ui.onSectionHover?.(row.section) : null"
    @contextmenu.prevent.stop="isFrame(row) || isSlot(row) || isShutSection(row) ? null : ui.onContext?.($event, row.id)"
  >
    <!--
      The tags look indents with a spacer that draws one guide per level, each
      in the colour of the row it descends from (html-tree.js works out the
      chain), so a row's place in the tree can be followed down the column
      and the column says what it belongs to. The classic look indents the
      row itself (margin from the same variable) and hides both this and the
      gap below. Neither carries text, so nothing that reads a row's
      textContent sees them.
    -->
    <span data-sve-ht-indent aria-hidden="true"><i v-for="(cat, i) in row.guides || []" :key="i" :data-sve-ht-cat="cat" v-bind="levelBind(row.depth, box?.ends || 0, i)"></i></span>
    <button
      v-if="row.hasChildren || rowCanHold(row)"
      type="button"
      data-sve-ht-twist
      v-bind="(row.synthetic ? ui.mainShut : rowShut(row)) ? { 'data-sve-ht-shut': '' } : {}"
      v-html="TWIST"
      @click.stop.prevent="row.synthetic ? ui.onFrameTwist?.() : isShutSection(row) ? ui.onSection?.(row.section) : ui.onTwist?.(row.id)"
      @pointerdown.stop
      @dblclick.stop
    ></button>
    <span v-else data-sve-ht-twist-gap aria-hidden="true"></span>
    <span v-if="row.letter" data-sve-ht-letter>{{ row.letter }}</span>
    <span v-else data-sve-ht-icon v-html="row.svg"></span>
    <span data-sve-ht-text :title="ui.renameTitle">
      <!--
        Only a real tag can be changed into another one. A loop, a condition and
        a component are not tags at all: offering `<div>` for `{{ collection }}`
        is offering to write something that cannot be written.
      -->
      <!--
        Double-click, not single. The tag sits in the middle of a row you click
        to select — a single click there kept opening a menu nobody asked for.
      -->
      <button
        v-if="!row.kind && !isShutSection(row) && !isFrame(row)"
        type="button"
        data-sve-ht-tag
        :title="ui.tagTitle"
        @click.stop.prevent
        @pointerdown.stop
        @dblclick.stop.prevent="ui.onTagChange?.($event, row.id)"
      >{{ row.tag }}</button>
      <!--
        Shut, the tag is not a button: there is no file open to rename it in.
        Same chip, same place, same words — only the door is closed.
      -->
      <span v-else data-sve-ht-kind>{{ row.tag }}</span>

      <input
        v-if="ui.editingId === row.id && !isShutSection(row)"
        data-sve-ht-rename
        v-model="ui.draft"
        @mousedown.stop
        @pointerdown.stop
        @click.stop
        @dblclick.stop
        @keydown.stop
        @keydown.enter.prevent="ui.onRenameCommit?.()"
        @keydown.escape.prevent="ui.onRenameCancel?.()"
        @blur="ui.onRenameCommit?.()"
      >
      <!-- The Figma look: `<div> Div · flow-y` — the classes after the name, the first to give way. -->
      <span v-else data-sve-ht-name :data-sve-ht-classes="figmaLook() && row.classes ? row.classes : null">{{ figmaLook() && row.display ? row.display : row.name }}</span>
    </span>
    <!--
      The row's icons do not come and go with the lock. A locked file is a
      reason for a button not to work, not a reason for it to be missing: half
      the rows wearing icons and half not reads as two kinds of row, and the
      lock answer arrives half a second after the row is drawn, so they used to
      appear and then vanish while you looked at them.
    -->
    <!--
      The frame's rows: one door, on the header and the footer — their fields,
      which is stepping into that half. Main has nothing to open. And, on the
      half's own file, the Alpine toggle: there the root row is the frame's,
      and a `<header x-data="{ mobilMenu: false }">` is a component like any
      section's — its menu has to be opened to be built.
    -->
    <span v-if="isFrame(row)" data-sve-ht-actions>
      <button
        v-if="row.alpineNth >= 0"
        type="button"
        data-sve-ht-alpine
        :data-on="row.alpineSet ? '' : null"
        :title="ui.alpineTitle"
        v-html="row.alpineSet ? ALPINE_ON : ALPINE_OFF"
        @click.stop.prevent="ui.onAlpineState?.($event, row.id)"
        @pointerdown.stop
        @dblclick.stop
      ></button>
      <button
        v-if="row.frame !== 'main' && canFields"
        type="button"
        data-sve-ht-fields
        :title="ui.frameFieldsTitle"
        v-html="FIELDS"
        @click.stop.prevent="ui.onFrameFields?.(row.frame)"
        @pointerdown.stop
        @dblclick.stop
      ></button>
    </span>
    <span v-else-if="!isSlot(row)" data-sve-ht-actions>
      <!--
        A <video> row: hold the video paused in the preview, or let it play.
        Not behind the lock — the file is not touched, only what the editor
        watches. Lit while held, so a still video reads as held, not broken.
      -->
      <button
        v-if="row.videoNth >= 0"
        type="button"
        data-sve-ht-video
        :data-on="row.videoHeld ? '' : null"
        :title="row.videoHeld ? ui.videoPlayTitle : ui.videoHoldTitle"
        v-html="row.videoHeld ? VIDEO_OFF : VIDEO"
        @click.stop.prevent="ui.onVideoHold?.(row.id)"
        @pointerdown.stop
        @dblclick.stop
      ></button>
      <!--
        An Alpine component whose x-data has booleans — a dialog's `open`, a
        menu's `menuOpen`: set one in the preview, so what is behind it can be
        built. One boolean, one press; several, a menu of them. Not behind the
        lock, like the video: the file is not touched. Lit while the preview
        shows something the file does not.
      -->
      <button
        v-if="row.alpineNth >= 0"
        type="button"
        data-sve-ht-alpine
        :data-on="row.alpineSet ? '' : null"
        :title="ui.alpineTitle"
        v-html="row.alpineSet ? ALPINE_ON : ALPINE_OFF"
        @click.stop.prevent="ui.onAlpineState?.($event, row.id)"
        @pointerdown.stop
        @dblclick.stop
      ></button>

      <!-- The padlock while it holds: only a developer (configure fields) unlocks, and is asked first. Taking a lock is in the three dots. -->
      <button
        v-if="row.locked"
        type="button"
        data-sve-ht-lock
        data-on=""
        :disabled="!ui.canEdit || !ui.canUnlock"
        :title="ui.canUnlock ? ui.unlockTitle : ui.lockedByTitle"
        aria-pressed="true"
        v-html="LOCK_ON"
        @click.stop.prevent="ui.onLock?.(row.id)"
        @pointerdown.stop
        @dblclick.stop
      ></button>
      <button
        v-if="canHide(row)"
        type="button"
        data-sve-ht-eye
        :disabled="!canAct(row)"
        :title="eyeTitle(row)"
        v-html="row.hidden || row.sectionOff ? EYE_OFF : EYE"
        @click.stop.prevent="ui.onHide?.(row.id)"
        @pointerdown.stop
        @dblclick.stop
      ></button>
      <!--
        Not on a fixed row (isFixed): a second header or a second <body> is not
        a copy anyone means, and without either every page loses it.
      -->
      <button
        v-if="!isFixed(row) && !isSections(row)"
        type="button"
        data-sve-ht-dup
        :disabled="!canAct(row)"
        :title="canAct(row) ? ui.duplicateTitle : ui.lockedTitle"
        v-html="DUP"
        @click.stop.prevent="ui.onDuplicate?.(row.id)"
        @pointerdown.stop
        @dblclick.stop
      ></button>
      <button
        v-if="!isFixed(row)"
        type="button"
        data-sve-ht-del
        :disabled="!canAct(row)"
        :title="canAct(row) ? ui.deleteTitle : ui.lockedTitle"
        v-html="DEL"
        @click.stop.prevent="ui.onDelete?.(row.id)"
        @pointerdown.stop
        @dblclick.stop
      ></button>
      <button
        v-if="canMore(row)"
        type="button"
        data-sve-ht-more
        :aria-label="ui.moreTitle"
        aria-haspopup="menu"
        v-html="MORE"
        @pointerenter="hoverMore($event.currentTarget, row)"
        @pointerleave="leaveMore"
        @click.stop.prevent="leaveMore(); ui.onMore?.($event.currentTarget, row.id)"
        @pointerdown.stop
        @dblclick.stop
      ></button>
    </span>
  </div>
  <div
    v-if="rowShowsRoom(row)"
    data-sve-ht-slot
    :data-sve-ht-id="row.id"
    v-bind="ui.dropId === row.id && ui.dropPlace === 'inside' ? { 'data-sve-ht-over': '' } : {}"
    :style="figmaLook() ? { '--sve-ht-depth': row.depth + 1, '--sve-ht-ends': box?.roomEnds || 0 } : { '--sve-ht-depth': row.depth + 1 }"
  ><!--
      Inside its row's box in the Figma look, one level in: it paints its share
      of that box and of every box around it, as a row does.
    --><span v-if="figmaLook()" data-sve-ht-indent aria-hidden="true"><i
      v-for="(cat, i) in [...(row.guides || []), row.cat]"
      :key="i"
      :data-sve-ht-cat="cat"
      v-bind="levelBind(row.depth + 1, box?.roomEnds || 0, i)"
    ></i></span>{{ ui.slotText }}</div>
</template>

<style scoped>
/* Moved here with the markup: a scoped rule only reaches the component that
   draws the element, and the slot is drawn here now. */
[data-sve-ht-slot] {
  box-sizing: border-box;
  /* One level in from the row it belongs to — the row sets the variable. */
  margin-left: calc(var(--sve-ht-depth, 0) * 12px);
  min-height: 2em;
  margin-bottom: 0.2em;
  padding: 0.45em 0.6em;
  border: 1px dashed rgba(128, 128, 128, 0.45);
  border-radius: 0.375rem;
  font-size: 0.6875rem;
  line-height: 1.3;
  opacity: 0.5;
}
[data-sve-ht-slot][data-sve-ht-over] {
  border-color: #93c5fd;
  border-style: solid;
  opacity: 1;
}
</style>
