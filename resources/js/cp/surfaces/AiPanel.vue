<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { ask } from '../bus.js';
import { chromeGet, chromeSet } from '../../chrome-prefs.js';
import { csrfToken, currentSectionType, t as tr } from '../preview-context.js';

const MODE_KEY = 'sve-ai-panel-mode';

const props = defineProps({
  win: { type: Object, required: true },
  onClose: { type: Function, default: null },
  // Outside the Live Preview dock — the floating chat in the Control Panel.
  // right-dock.css only reaches inside #__sve-right-dock, so the bar has to
  // dress itself. The host element decides the size.
  standalone: { type: Boolean, default: false },
});

const win = computed(() => props.win);
const mode = ref(chromeGet(props.win, MODE_KEY) === 'build' ? 'build' : 'write');
const messages = ref([]);
const sending = ref(false);
const draft = ref('');
const insertNote = ref({});
const copyNote = ref({});
const logEl = ref(null);

const strings = (key) => tr(win.value, key);
const ready = computed(() => win.value.Statamic?.$config?.get?.('sveAiReady') === true);
const sectionType = ref(currentSectionType(props.win));

const typeLabel = computed(() => {
  const type = sectionType.value;

  if (mode.value === 'build') {
    return type
      ? strings('ai_panel_building_for').replace(':type', type)
      : strings('ai_panel_need_section_build');
  }

  return type
    ? strings('ai_panel_writing_to').replace(':type', type)
    : strings('ai_panel_need_section');
});

function persistMode(next) {
  mode.value = next === 'build' ? 'build' : 'write';
  chromeSet(win.value, MODE_KEY, mode.value);
}

function parseFences(text) {
  const blocks = [];
  const re = /```([A-Za-z0-9_-]*)[^\n]*\n([\s\S]*?)```/g;
  let last = 0;
  let match;

  while ((match = re.exec(text))) {
    const prose = text.slice(last, match.index).trim();

    if (prose) {
      blocks.push({ kind: 'text', content: prose });
    }

    blocks.push({
      kind: 'code',
      lang: (match[1] || '').toLowerCase(),
      content: match[2].replace(/\n$/, ''),
    });
    last = match.index + match[0].length;
  }

  const rest = text.slice(last).trim();

  if (rest) {
    blocks.push({ kind: 'text', content: rest });
  }

  if (!blocks.length && text) {
    blocks.push({ kind: 'text', content: text });
  }

  return blocks;
}

function snippetParts(blocks) {
  const parts = { html: '', css: '', js: '' };

  for (const block of blocks) {
    if (block.kind !== 'code' || !block.content.trim()) {
      continue;
    }

    if (block.lang === 'css') {
      parts.css = parts.css ? `${parts.css}\n\n${block.content}` : block.content;
    } else if (block.lang === 'js' || block.lang === 'javascript') {
      parts.js = parts.js ? `${parts.js}\n\n${block.content}` : block.content;
    } else if (block.lang === 'yaml' || block.lang === 'yml') {
      continue;
    } else {
      parts.html = parts.html ? `${parts.html}\n\n${block.content}` : block.content;
    }
  }

  return parts;
}

function hasSnippet(parts) {
  return !!(parts.html || parts.css || parts.js);
}

function rowBlocks(row) {
  return parseFences(row.content);
}

function rowParts(row) {
  return snippetParts(rowBlocks(row));
}

function copyBlock(key, text) {
  const finish = () => {
    copyNote.value = { ...copyNote.value, [key]: strings('ai_panel_copied') };
    win.value.setTimeout(() => {
      const next = { ...copyNote.value };
      delete next[key];
      copyNote.value = next;
    }, 1200);
  };

  if (win.value.navigator?.clipboard?.writeText) {
    win.value.navigator.clipboard.writeText(text).then(finish).catch(() => fallbackCopy(text, finish));

    return;
  }

  fallbackCopy(text, finish);
}

function fallbackCopy(text, done) {
  const area = win.value.document.createElement('textarea');

  area.value = text;
  area.setAttribute('readonly', '');
  area.style.cssText = 'position:fixed;left:-9999px;top:0;';
  win.value.document.body.appendChild(area);
  area.select();

  try {
    win.value.document.execCommand('copy');
    done();
  } catch {
    /* ignore */
  }

  area.remove();
}

function insertSnippet(index, parts) {
  if (!ask('dock:is-open', win.value.document)) {
    insertNote.value = { ...insertNote.value, [index]: strings('ai_panel_insert_need_dock') };
    win.value.setTimeout(() => {
      const next = { ...insertNote.value };
      delete next[index];
      insertNote.value = next;
    }, 1600);

    return;
  }

  if (ask('dock:is-locked')) {
    insertNote.value = { ...insertNote.value, [index]: strings('ai_panel_insert_locked') };
    win.value.setTimeout(() => {
      const next = { ...insertNote.value };
      delete next[index];
      insertNote.value = next;
    }, 1600);

    return;
  }

  if (ask('dock:insert-snippet', { win: win.value, parts })) {
    insertNote.value = { ...insertNote.value, [index]: strings('ai_panel_inserted') };
    win.value.setTimeout(() => {
      const next = { ...insertNote.value };
      delete next[index];
      insertNote.value = next;
    }, 1200);
  }
}

function scrollLog() {
  nextTick(() => {
    if (logEl.value) {
      logEl.value.scrollTop = logEl.value.scrollHeight;
    }
  });
}

function send() {
  if (sending.value) {
    return;
  }

  const text = draft.value.trim();
  const type = currentSectionType(win.value);
  const sendMode = mode.value;

  if (!text) {
    return;
  }

  if (!ready.value) {
    messages.value = [...messages.value, { role: 'assistant', content: strings('ai_panel_need_key') }];
    scrollLog();

    return;
  }

  messages.value = [...messages.value, { role: 'user', content: text }];
  draft.value = '';
  sending.value = true;
  scrollLog();

  win.value
    .fetch('/!/sve/ai-chat', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken(win.value),
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ type, messages: messages.value, mode: sendMode }),
    })
    .then(async (res) => {
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || data.error || strings('ai_panel_error'));
      }

      const reply = typeof data.reply === 'string' && data.reply.trim() ? data.reply.trim() : '';

      messages.value = [
        ...messages.value,
        {
          role: 'assistant',
          mode: data.mode === 'build' ? 'build' : 'write',
          content: reply || (data.applied ? strings('ai_panel_applied') : strings('ai_panel_error')),
        },
      ];

      if (data.applied && data.mode === 'build') {
        ask('dock:refresh', win.value);
      }
    })
    .catch((err) => {
      messages.value = [
        ...messages.value,
        { role: 'assistant', content: err?.message || strings('ai_panel_error') },
      ];
    })
    .finally(() => {
      sending.value = false;
      scrollLog();
    });
}

function onKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    send();
  }
}

function refreshType() {
  sectionType.value = currentSectionType(win.value);
}

defineExpose({ refreshType });

onMounted(refreshType);
watch(mode, refreshType);
</script>

<template>
  <div class="sve-ai" :class="{ 'sve-ai--standalone': standalone }">
    <div data-sve-pane-bar>
      <div data-sve-right-title>
        <span data-sve-ai-name>{{ strings('ai_panel_title') }}</span>
        <span data-sve-ai-type>{{ typeLabel }}</span>
      </div>
      <div data-sve-ai-modes>
        <button
          v-for="id in ['write', 'build']"
          :key="id"
          type="button"
          data-sve-ai-mode
          :class="{ 'is-active': mode === id }"
          :aria-pressed="mode === id ? 'true' : 'false'"
          @click="persistMode(id)"
        >
          {{ strings(id === 'build' ? 'ai_panel_mode_build' : 'ai_panel_mode_write') }}
        </button>
      </div>
      <div v-if="props.onClose" data-sve-right-actions>
        <button type="button" data-sve-right-pin aria-pressed="false"></button>
        <button type="button" data-sve-close aria-label="Close" @click="props.onClose?.()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
    <div class="sve-ai__hint">
      {{ strings(mode === 'build' ? 'ai_panel_hint_build' : 'ai_panel_hint') }}
    </div>
    <div ref="logEl" class="sve-ai__log">
      <div v-if="!ready" class="sve-ai__need-key">{{ strings('ai_panel_need_key') }}</div>
      <div
        v-for="(row, index) in messages"
        :key="index"
        class="sve-ai__row"
        :class="row.role === 'user' ? 'is-user' : 'is-assistant'"
      >
        <template v-if="row.role === 'user'">{{ row.content }}</template>
        <template v-else>
          <template v-for="(block, b) in rowBlocks(row)" :key="b">
            <div v-if="block.kind === 'text'" class="sve-ai__prose">{{ block.content }}</div>
            <div v-else class="sve-ai__code">
              <div class="sve-ai__code-bar">
                <span>{{ block.lang || 'code' }}</span>
                <button type="button" @click="copyBlock(`${index}-${b}`, block.content)">
                  {{ copyNote[`${index}-${b}`] || strings('ai_panel_copy') }}
                </button>
              </div>
              <pre>{{ block.content }}</pre>
            </div>
          </template>
          <div v-if="row.mode === 'write' && hasSnippet(rowParts(row))" class="sve-ai__actions">
            <button type="button" @click="insertSnippet(index, rowParts(row))">
              {{ insertNote[index] || strings('ai_panel_insert') }}
            </button>
          </div>
        </template>
      </div>
      <div v-if="sending" class="sve-ai__wait">{{ strings('ai_panel_thinking') }}</div>
    </div>
    <form class="sve-ai__form" @submit.prevent="send">
      <textarea
        v-model="draft"
        rows="4"
        :placeholder="strings(mode === 'build' ? 'ai_panel_placeholder_build' : 'ai_panel_placeholder')"
        @keydown="onKeydown"
      />
      <button type="submit">{{ strings('ai_panel_send') }}</button>
    </form>
  </div>
</template>

<style scoped>
.sve-ai {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}
.sve-ai__hint {
  padding: var(--sve-right-body-pad-block, 8px) 0 0;
  font-size: 12px;
  opacity: 0.65;
  flex: 0 0 auto;
  line-height: 1.4;
}
.sve-ai__log {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: var(--sve-right-body-pad-block, 8px) 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sve-ai__need-key,
.sve-ai__wait {
  font-size: 13px;
  opacity: 0.7;
  line-height: 1.45;
}
.sve-ai__wait {
  font-size: 12px;
  opacity: 0.55;
}
.sve-ai__row {
  font-size: 13px;
  line-height: 1.45;
  padding: 8px 10px;
  border-radius: 10px;
  word-break: break-word;
}
.sve-ai__row.is-user {
  align-self: flex-end;
  background: rgba(128, 128, 128, 0.16);
  max-width: 92%;
  white-space: pre-wrap;
}
.sve-ai__row.is-assistant {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sve-ai__prose {
  white-space: pre-wrap;
}
.sve-ai__code {
  border: 1px solid rgba(128, 128, 128, 0.22);
  border-radius: 8px;
  overflow: hidden;
}
.sve-ai__code-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 8px;
  background: rgba(128, 128, 128, 0.1);
  font-size: 11px;
  opacity: 0.75;
}
.sve-ai__code-bar button,
.sve-ai__actions button {
  all: unset;
  cursor: pointer;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(128, 128, 128, 0.18);
}
.sve-ai__code pre {
  margin: 0;
  padding: 8px 10px;
  max-height: 240px;
  overflow: auto;
  font: 12px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace;
  white-space: pre;
}
.sve-ai__actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.sve-ai__form {
  flex: 0 0 auto;
  border-top: 1px solid rgba(128, 128, 128, 0.2);
  padding: var(--sve-right-body-pad-block, 8px) 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sve-ai__form textarea {
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  min-height: 88px;
  max-height: 200px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(128, 128, 128, 0.28);
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 13px;
}
.sve-ai__form button[type='submit'] {
  all: unset;
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  text-align: center;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--theme-color-primary, #4f46e5);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

/*
 * Outside the Live Preview dock. The docked version borrows its bar from
 * right-dock.css, which is scoped to #__sve-right-dock and never loaded here,
 * so the bar is dressed from scratch — same shape, Control Panel colours.
 *
 * Height comes from the host element, not from here: the floating chat sizes
 * itself against the viewport, and this component should not have an opinion
 * about where it has been put.
 */
.sve-ai--standalone {
  height: 100%;
  padding: 0 0.875rem 0.875rem;
  box-sizing: border-box;
}
.sve-ai--standalone [data-sve-pane-bar] {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex: 0 0 auto;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--theme-color-content-border, rgba(128, 128, 128, 0.24));
}
.sve-ai--standalone [data-sve-right-title] {
  display: flex;
  flex-direction: column;
  gap: 0.0625rem;
  min-width: 0;
}
.sve-ai--standalone [data-sve-ai-name] {
  font-weight: 600;
  font-size: 0.8125rem;
}
.sve-ai--standalone [data-sve-ai-type] {
  font-size: 0.6875rem;
  opacity: 0.6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sve-ai--standalone [data-sve-ai-modes] {
  margin-left: auto;
  display: flex;
  gap: 0.125rem;
  padding: 0.125rem;
  border-radius: 0.5rem;
  background: rgba(128, 128, 128, 0.16);
  flex: 0 0 auto;
}
.sve-ai--standalone [data-sve-ai-mode] {
  all: unset;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 600;
  opacity: 0.7;
}
.sve-ai--standalone [data-sve-ai-mode].is-active {
  background: var(--theme-color-content-bg, #fff);
  opacity: 1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
}
.sve-ai--standalone [data-sve-right-actions] {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}
/* The dock has a pin; a floating window that follows you everywhere does not. */
.sve-ai--standalone [data-sve-right-pin] {
  display: none;
}
.sve-ai--standalone [data-sve-close] {
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.375rem;
  opacity: 0.6;
}
.sve-ai--standalone [data-sve-close]:hover {
  opacity: 1;
  background: rgba(128, 128, 128, 0.16);
}
</style>
