<script setup>
// The popup logic-popup.js mounts: the HTML tree's inspector model
// (htmlTreeUi.inspect) for a loop or a condition, drawn in the help popup's
// look. Every write goes through the tree's own handlers — the ones its
// inspector in Build's Settings tab calls — looked up when they are called,
// because the tree sets them again on each paint.
import DockHelpLoop from './DockHelpLoop.vue';
import DockHelpCondition from './DockHelpCondition.vue';
import { htmlTreeUi as ui } from '../html-tree/store.js';

defineProps({
  closeLabel: { type: String, default: '' },
});

const pickData = (anchor, use) => ui.onInspectData?.(anchor, use);
const commit = (value) => ui.onInspectCommit?.(value);

const loop = {
  kind: (id) => ui.onLoopKind?.(id),
  commit,
  sortDir: (value) => ui.onLoopSortDir?.(value),
  sortField: (value) => ui.onLoopSortField?.(value),
  limit: (value) => ui.onLoopLimit?.(value),
  offset: (value) => ui.onLoopOffset?.(value),
  depth: (value) => ui.onLoopDepth?.(value),
  includeHome: (value) => ui.onLoopIncludeHome?.(value),
  pickData,
};

const condition = {
  commit,
  branch: (kind) => ui.onAddBranch?.(kind),
  pickData,
};
</script>

<template>
  <DockHelpLoop
    v-if="ui.inspect?.mode === 'loop'"
    :inspect="ui.inspect"
    :can-edit="ui.canEdit"
    :data-title="ui.dataTitle"
    :close-label="closeLabel"
    :on="loop"
  />
  <DockHelpCondition
    v-else-if="ui.inspect"
    :inspect="ui.inspect"
    :can-edit="ui.canEdit"
    :data-title="ui.dataTitle"
    :close-label="closeLabel"
    :on="condition"
  />
</template>
