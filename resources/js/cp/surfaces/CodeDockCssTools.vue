<script setup>
/**
 * The icon row, and under the open icon its own children.
 *
 * One loop, one kind of button. Padding's sides, Flex's alignment, Border's
 * edges and Radius's corners are the same markup with different entries —
 * there is no second row and no second component. A child sits inside its
 * parent's `<li>`, so it opens beside the icon it belongs to rather than
 * somewhere else on the row.
 */
import { cssToolsUi as ui } from '../css/tools.js';
</script>

<template>
  <li
    v-for="tool in ui.tools"
    :key="tool.id"
    :data-sve-css-item="tool.id"
    v-bind="tool.open ? { 'data-sve-css-open': '' } : {}"
  >
    <button
      type="button"
      :data-sve-css-tool="tool.id"
      :data-tip="tool.title"
      :aria-label="tool.title"
      v-bind="{
        ...(tool.active ? { 'data-active': '' } : {}),
        ...(tool.open ? { 'data-open': '' } : {}),
      }"
      v-html="tool.icon"
      @click.prevent.stop="ui.onTool?.(tool.id)"
      @contextmenu.prevent="ui.onTool?.(tool.id)"
    ></button>
    <div v-if="tool.open && tool.kids.length" data-sve-css-kids>
      <template v-for="kid in tool.kids" :key="kid.id">
        <span v-if="kid.sep" data-sve-css-sep aria-hidden="true"></span>
        <button
          type="button"
          :data-sve-css-kid="kid.id"
          :data-sve-css-box-side="kid.id"
          :data-tip="kid.title"
          :aria-label="kid.title"
          v-bind="kid.active ? { 'data-active': '' } : {}"
          v-html="kid.icon"
          @click.prevent.stop="ui.onKid?.(tool.id, kid.id)"
          @contextmenu.prevent="ui.onKid?.(tool.id, kid.id)"
        ></button>
      </template>
    </div>
  </li>
</template>
