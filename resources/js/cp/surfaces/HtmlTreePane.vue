<script setup>
import { ref } from 'vue';
import ComponentPropsPane from './ComponentPropsPane.vue';
import { componentPropsUi } from '../component-props/store.js';
import HtmlTreeInspector from './HtmlTreeInspector.vue';
import { htmlTreeUi as ui } from '../html-tree/store.js';
import { ask } from '../bus.js';
import { canCreateSections, openNewSectionDialog } from '../../section-create.js';
import {
  canEditFields,
  currentSetHandle,
  openFieldsetOverlay,
  refreshFieldsForType,
} from '../../section-fields.js';
import { t } from '../../cp-t.js';

defineProps({
  title: { type: String, default: '' },
});

// Making a section writes files into the repository, so it is the developer
// permission that decides — the same gate as deleting one. An editor never
// sees the button at all.
const canCreate = canCreateSections(window);
const canFields = canEditFields(window);
const newSectionLabel = t(window, 'section_new');
const fieldsLabel = t(window, 'section_fields');
const creating = ref(false);
const refreshing = ref(false);
const refreshLabel = t(window, 'section_fields_refresh');

function onFields() {
  const handle = currentSetHandle();

  // Only a section has a fieldset. Inside a component the dock is showing a
  // view file, and there is nothing of its own to open.
  if (!handle) {
    window.Statamic?.$toast?.error(t(window, 'section_fields_none'));

    return;
  }

  openFieldsetOverlay(window, handle);
}

/**
 * Pick the section's fields up again without opening anything.
 *
 * For the fieldset edited somewhere else — the Fieldsets screen in another tab,
 * a colleague's change, a hand-edited YAML — where nothing here knows to ask.
 */
function onRefreshFields() {
  const handle = currentSetHandle();

  if (!handle || refreshing.value) {
    return;
  }

  refreshing.value = true;

  void (async () => {
    try {
      await refreshFieldsForType(window, handle);
      ask('dock:refresh-preview');
      window.Statamic?.$toast?.success(t(window, 'section_fields_refreshed'));
    } catch {
      window.Statamic?.$toast?.error(t(window, 'section_fields_failed'));
    } finally {
      refreshing.value = false;
    }
  })();
}

function onNewSection() {
  if (creating.value) {
    return;
  }

  creating.value = true;

  openNewSectionDialog(window, {
    onDone: () => {
      creating.value = false;
    },
    onError: () => {
      creating.value = false;
    },
  });
}
</script>

<template>
  <div class="sve-html-tree">
    <div class="sve-pane-bar" data-sve-pane-bar>
      <div data-sve-right-title>{{ title }}</div>
      <div data-sve-right-actions>
        <button
          v-if="canCreate"
          type="button"
          class="sve-tree-new"
          :title="newSectionLabel"
          :aria-label="newSectionLabel"
          @click="onNewSection"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
        </button>
        <button
          v-if="canFields"
          type="button"
          class="sve-tree-new"
          :title="fieldsLabel"
          :aria-label="fieldsLabel"
          @click="onFields"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>
        </button>
        <button
          v-if="canFields"
          type="button"
          class="sve-tree-new"
          :title="refreshLabel"
          :aria-label="refreshLabel"
          :disabled="refreshing"
          @click="onRefreshFields"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>
        </button>
        <button type="button" data-sve-right-pin aria-pressed="false"></button>
        <button type="button" data-sve-close aria-label="Close">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
    <!--
      Only when there is no Live Preview column to draw them in. Inside a
      component the fields belong on the left, where the section's own fields
      would otherwise be sitting in the way.
    -->
    <ComponentPropsPane v-if="!componentPropsUi.inSidebar" />
    <div data-sve-html-tree-list></div>
    <HtmlTreeInspector />

    <!-- Only while a component is open: on a section there is nothing to leave.
         The left column carries it instead whenever it has taken the fields. -->
    <div v-if="ui.exitOpen && !componentPropsUi.inSidebar" class="sve-tree-exit">
      <span class="sve-tree-exit__name" :title="ui.exitName">{{ ui.exitName }}</span>
      <button
        type="button"
        class="sve-tree-exit__go"
        :title="ui.exitTitle"
        @click="ui.onExit?.()"
      >{{ ui.exitLabel }}</button>
    </div>
  </div>
</template>

<style scoped>
/* Sits with the pin and the close button, which the pane bar styles from
   outside; this one is ours, so it carries its own. */
.sve-tree-new {
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.7em;
  height: 1.7em;
  border-radius: 0.4em;
  line-height: 1;
  opacity: 0.62;
}
.sve-tree-new:hover {
  opacity: 1;
  background: rgba(128, 128, 128, 0.18);
}
.sve-html-tree {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}
[data-sve-html-tree-list] {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
.sve-tree-exit {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px var(--sve-right-gutter, 12px);
  border-top: 1px solid rgba(128, 128, 128, 0.28);
}
.sve-tree-exit__name {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  opacity: 0.65;
}
.sve-tree-exit__go {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  padding: 7px 13px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  background: var(--theme-color-primary, #4f46e5);
  color: #fff;
}
</style>
