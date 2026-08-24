<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const PAGE_SIZE = 10;

const props = defineProps({
  emptyLabel: { type: String, required: true },
  unknownUser: { type: String, required: true },
  historyTitle: { type: String, required: true },
  closeLabel: { type: String, required: true },
  colDate: { type: String, required: true },
  colUser: { type: String, required: true },
  colType: { type: String, required: true },
  colDetails: { type: String, required: true },
  prevLabel: { type: String, required: true },
  nextLabel: { type: String, required: true },
  pageOf: { type: String, required: true },
  edits: { type: Array, default: () => [] },
});

const open = ref(false);
const page = ref(1);

const pages = computed(() => Math.max(1, Math.ceil(props.edits.length / PAGE_SIZE)));
const rows = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE;

  return props.edits.slice(start, start + PAGE_SIZE);
});
const rangeLabel = computed(() => {
  if (!props.edits.length) {
    return props.pageOf.replace(':from', '0').replace(':to', '0').replace(':total', '0');
  }

  const from = (page.value - 1) * PAGE_SIZE + 1;
  const to = Math.min(page.value * PAGE_SIZE, props.edits.length);

  return props.pageOf
    .replace(':from', String(from))
    .replace(':to', String(to))
    .replace(':total', String(props.edits.length));
});

watch(open, (value) => {
  document.dispatchEvent(new CustomEvent('sve-edits-changed', { detail: { open: value } }));

  if (value) {
    page.value = 1;
    window.addEventListener('keydown', onKey);
  } else {
    window.removeEventListener('keydown', onKey);
  }
});

onMounted(() => {
  document.addEventListener('sve-edits-toggle', onToggle);
  document.addEventListener('sve-edits-open', onOpen);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKey);
  document.removeEventListener('sve-edits-toggle', onToggle);
  document.removeEventListener('sve-edits-open', onOpen);
});

function formatWhen(iso) {
  if (!iso) {
    return '';
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function close() {
  open.value = false;
}

function onToggle() {
  open.value = !open.value;
}

function onOpen() {
  open.value = true;
}

function onKey(event) {
  if (event.key === 'Escape') {
    close();
  }
}
</script>

<template>
  <div data-sve-page-edits-root>
    <Teleport to="body">
      <Transition name="sve-page-edits">
        <div
          v-if="open"
          class="sve-page-edits"
          role="dialog"
          aria-modal="true"
          :aria-label="historyTitle"
          tabindex="-1"
          @keydown="onKey"
        >
          <button type="button" class="sve-page-edits__scrim bg-gray-800/20 dark:bg-gray-950/60" :aria-label="closeLabel" @click="close" />
          <div class="sve-page-edits__card">
          <div class="sve-page-edits__head">
            <div class="sve-page-edits__title">{{ historyTitle }}</div>
            <button type="button" class="sve-page-edits__close" :aria-label="closeLabel" @click="close">✕</button>
          </div>
          <div class="sve-page-edits__table-wrap">
            <table class="sve-page-edits__table">
              <thead>
                <tr>
                  <th>{{ colDate }}</th>
                  <th>{{ colUser }}</th>
                  <th>{{ colType }}</th>
                  <th>{{ colDetails }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!edits.length">
                  <td colspan="4" class="sve-page-edits__empty">{{ emptyLabel }}</td>
                </tr>
                <tr v-for="(edit, index) in rows" :key="index">
                  <td class="sve-page-edits__date">{{ formatWhen(edit.at) }}</td>
                  <td>
                    <span class="sve-page-edits__user">
                      <span class="sve-page-edits__avatar" aria-hidden="true">{{ edit.initials || '?' }}</span>
                      {{ edit.user || unknownUser }}
                    </span>
                  </td>
                  <td>{{ edit.type }}</td>
                  <td class="sve-page-edits__details">{{ edit.details }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="edits.length > PAGE_SIZE" class="sve-page-edits__pager">
            <span>{{ rangeLabel }}</span>
            <span class="sve-page-edits__pager-btns">
              <button type="button" :disabled="page <= 1" @click="page -= 1">{{ prevLabel }}</button>
              <button type="button" :disabled="page >= pages" @click="page += 1">{{ nextLabel }}</button>
            </span>
          </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.sve-page-edits {
  position: fixed;
  inset: 0;
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: inherit;
  color: var(--theme-color-content-text, inherit);
}
.sve-page-edits-enter-active,
.sve-page-edits-leave-active {
  transition: opacity 0.2s ease;
}
.sve-page-edits-enter-from,
.sve-page-edits-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .sve-page-edits-enter-active,
  .sve-page-edits-leave-active {
    transition: none;
  }
}
.sve-page-edits__scrim {
  position: absolute;
  inset: 0;
  border: 0;
  padding: 0;
  cursor: pointer;
  /* Same as Statamic Modal overlay: bg-gray-800/20 dark:bg-gray-950/60, no blur.
     Do not use :global(.dark) — Vue compiles that to a bare `.dark { background }`
     and paints the whole CP (html.dark), which shows up as a black bar over
     Statamic's top bar. Scoped `.dark .scrim` only hits the overlay. */
  background: color-mix(in oklab, var(--theme-color-gray-800, #262626) 20%, transparent);
}
.dark .sve-page-edits__scrim {
  background: color-mix(in oklab, var(--theme-color-gray-950, #0a0a0a) 60%, transparent);
}
.sve-page-edits__card {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: min(920px, 100%);
  max-height: min(72vh, 640px);
  background: var(--theme-color-content-bg, #fff);
  color: inherit;
  border-radius: 12px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}
.sve-page-edits__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 12%, transparent);
}
.sve-page-edits__title {
  font-size: 15px;
  font-weight: 650;
}
.sve-page-edits__close {
  all: unset;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  opacity: 0.7;
}
.sve-page-edits__close:hover {
  opacity: 1;
  background: color-mix(in srgb, currentColor 8%, transparent);
}
.sve-page-edits__table-wrap {
  overflow: auto;
  min-height: 0;
  flex: 1 1 auto;
}
.dark .sve-page-edits__table-wrap {
  background: #29292b;
}
.sve-page-edits__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.sve-page-edits__table th,
.sve-page-edits__table td {
  padding: 10px 18px;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);
}
.sve-page-edits__table th {
  position: sticky;
  top: 0;
  background: var(--theme-color-content-bg, #fff);
  font-weight: 600;
  opacity: 0.7;
  font-size: 12px;
}
.dark .sve-page-edits__table th {
  background: #29292b;
}
.sve-page-edits__date {
  white-space: nowrap;
}
.sve-page-edits__details {
  white-space: normal;
  overflow-wrap: anywhere;
}
.sve-page-edits__user {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.sve-page-edits__avatar {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 12%, transparent);
  font-size: 10px;
  font-weight: 700;
}
.sve-page-edits__empty {
  opacity: 0.6;
  text-align: center;
}
.sve-page-edits__pager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 18px;
  border-top: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  font-size: 12px;
  opacity: 0.85;
}
.sve-page-edits__pager-btns {
  display: flex;
  gap: 8px;
}
.sve-page-edits__pager-btns button {
  all: unset;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 6px;
  background: color-mix(in srgb, currentColor 8%, transparent);
}
.sve-page-edits__pager-btns button:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
