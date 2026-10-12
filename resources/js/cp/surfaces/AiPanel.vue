<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { ask } from '../bus.js';
import { chromeGet, chromeSet } from '../../chrome-prefs.js';
import { csrfToken } from '../../lib/csrf.js';
import { t as tr } from '../../lib/i18n.js';
import { currentSectionType } from '../preview-context.js';

const MODE_KEY = 'sve-ai-panel-mode';
const TABS_URL = '/!/sve/ai-tabs';
const MODELS_URL = '/!/sve/ai-models';
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
/** Screenshots are scaled to this on the longest side before they are sent. */
const IMAGE_MAX_SIDE = 2000;
/** Above this a screenshot goes as JPEG; below, as it came. */
const IMAGE_MAX_BYTES = 3 * 1024 * 1024;
const POLL_MS = 2500;
/** As AiChat\Tabs::MAX_QUEUE — checked before the box is emptied, so a full queue keeps what was typed. */
const MAX_QUEUE = 10;
const DRAFT_SAVE_MS = 400;

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

/*
 * The chats are the server's (AiChat\Tabs): one per tab, per user. The panel
 * holds the tab list, the chats it has loaded, and the box being typed in —
 * which it saves as it goes, so a reload, a closed panel or another browser
 * finds everything where it was. Closing a tab deletes its chat.
 */
const loadState = ref('loading');
const tabs = ref([]);
const activeId = ref('');
const chats = ref({});
const chat = computed(() => chats.value[activeId.value] || null);
const messages = computed(() => chat.value?.messages || []);
/** Waiting for an answer in this tab — asked from here, or from before a reload. */
const sending = computed(() => !!chat.value?.pending);
/** Asked while it was answering: each becomes the next question, in order. */
const queue = computed(() => chat.value?.queue || []);
// The in-flight request per tab, so closing the tab can let go of it.
const inflight = {};
/** The models the site's Cursor account can use, grouped for the picker. */
const models = ref([]);
const defaultModel = ref('');
const modelsFailed = ref(false);
const modelGroups = computed(() => {
  const groups = [];

  for (const model of models.value) {
    let group = groups.find((row) => row.name === model.group);

    if (!group) {
      group = { name: model.group, models: [] };
      groups.push(group);
    }

    group.models.push(model);
  }

  return groups;
});
/** The tab's model; '' is the site's default. */
const model = computed(() => chat.value?.model || '');
// Through v-model, not :value — the list arrives after the chat, and only
// v-model puts the tab's model back once its <option> exists.
const modelChoice = computed({ get: () => model.value, set: (next) => pickModel(next) });
const defaultLabel = computed(() => {
  const name = models.value.find((row) => row.id === defaultModel.value)?.name || defaultModel.value;

  return strings('ai_panel_model_default').replace(':model', name);
});
/** A model the tab was set to that Cursor no longer lists — still shown, so the picker does not lie. */
const unlistedModel = computed(() => (model.value && models.value.length && !models.value.some((row) => row.id === model.value) ? model.value : ''));
const draft = ref('');
/** Images in the box: { id, url } once uploaded, { local } while uploading. */
const draftImages = ref([]);
const uploading = computed(() => draftImages.value.some((image) => !image.id));
const dragging = ref(false);
const fileInput = ref(null);
/** One line that is not part of the chat: no key, an image that failed. */
const notice = ref('');
const insertNote = ref({});
const copyNote = ref({});
const logEl = ref(null);
let draftTimer = null;
let draftDirty = false;
let pollTimer = null;

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

// ── The server ─────────────────────────────────────────────────────────────

function request(url, { method = 'GET', json, form, signal } = {}) {
  const headers = {
    Accept: 'application/json',
    'X-CSRF-TOKEN': csrfToken(win.value),
    'X-Requested-With': 'XMLHttpRequest',
  };

  if (json) {
    headers['Content-Type'] = 'application/json';
  }

  return win.value
    .fetch(url, { method, signal, credentials: 'same-origin', headers, body: form || (json ? JSON.stringify(json) : undefined) })
    .then(async (res) => {
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw Object.assign(new Error(data.message || strings('ai_panel_error')), { status: res.status, data });
      }

      return data;
    });
}

function imageUrl(tabId, imageId) {
  return `${TABS_URL}/${tabId}/images/${imageId}`;
}

/** The list and the open tab as the server has them, with the open chat. */
function applyIndex(data) {
  tabs.value = data.tabs || [];

  if (data.chat) {
    chats.value = { ...chats.value, [data.chat.id]: data.chat };
  }

  // Chats of tabs that are gone go too.
  const ids = new Set(tabs.value.map((tab) => tab.id));

  chats.value = Object.fromEntries(Object.entries(chats.value).filter(([id]) => ids.has(id)));
  openTab(data.active);
}

/**
 * A chat from the server: into the store, and its title and spinner into the
 * tab row. An answer that changed files — Build mode, here or from the queue
 * while this panel only polled — refreshes the dock.
 */
function applyChat(next) {
  if (!next?.id) {
    return;
  }

  const seen = chats.value[next.id]?.messages?.length;

  if (seen !== undefined && (next.messages || []).slice(seen).some((row) => row.role === 'assistant' && row.applied && row.mode === 'build')) {
    ask('dock:refresh', win.value);
  }

  chats.value = { ...chats.value, [next.id]: next };
  tabs.value = tabs.value.map((tab) => (tab.id === next.id ? { ...tab, title: next.title, pending: !!next.pending } : tab));

  if (next.id === activeId.value) {
    scrollLog();
    watchPending();
  }
}

/** Show a tab's chat and its box — the draft as it was saved. */
function openTab(id) {
  activeId.value = id;
  insertNote.value = {};
  copyNote.value = {};
  notice.value = '';

  const open = chats.value[id];

  draft.value = open?.draft || '';
  draftImages.value = (open?.draft_images || []).map((imageId) => ({ id: imageId, url: imageUrl(id, imageId) }));
  draftDirty = false;
  scrollLog();
  watchPending();
}

async function loadTabs() {
  try {
    applyIndex(await request(TABS_URL));
    loadState.value = 'ready';
  } catch {
    loadState.value = 'failed';
  }
}

async function switchTab(id) {
  if (id === activeId.value) {
    return;
  }

  flushDraft();

  if (!chats.value[id]) {
    try {
      applyChat((await request(`${TABS_URL}/${id}`)).chat);
    } catch {
      return;
    }
  }

  openTab(id);
  request(`${TABS_URL}/${id}`, { method: 'POST', json: { activate: true } }).catch(() => {});
}

async function newTab() {
  flushDraft();

  try {
    applyIndex(await request(TABS_URL, { method: 'POST' }));
  } catch (err) {
    notice.value = err.message;
  }
}

/** Close a tab: its chat is deleted. A run still going in it is let go of. */
async function closeTab(id) {
  if (id === activeId.value) {
    clearTimeout(draftTimer);
    draftDirty = false;
  }

  inflight[id]?.abort();

  try {
    applyIndex(await request(`${TABS_URL}/${id}`, { method: 'DELETE' }));
  } catch (err) {
    notice.value = err.message;
  }
}

// ── The box: saved as it is typed ─────────────────────────────────────────

function draftPayload() {
  return { draft: draft.value, draft_images: draftImages.value.filter((image) => image.id).map((image) => image.id) };
}

function saveDraftSoon() {
  draftDirty = true;
  clearTimeout(draftTimer);
  draftTimer = setTimeout(flushDraft, DRAFT_SAVE_MS);
}

function flushDraft() {
  clearTimeout(draftTimer);

  if (!draftDirty || !activeId.value) {
    return;
  }

  draftDirty = false;

  const id = activeId.value;
  const payload = draftPayload();

  if (chats.value[id]) {
    chats.value[id] = { ...chats.value[id], draft: payload.draft, draft_images: payload.draft_images };
  }

  request(`${TABS_URL}/${id}`, { method: 'POST', json: payload }).catch(() => {
    draftDirty = true;
  });
}

/**
 * The last keystrokes before a reload or a closed window. A fetch may be cut
 * off as the page goes; a beacon is not.
 */
function beaconDraft() {
  clearTimeout(draftTimer);

  if (!draftDirty || !activeId.value) {
    return;
  }

  const payload = draftPayload();
  const form = new win.value.FormData();

  form.append('_token', csrfToken(win.value));
  form.append('draft', payload.draft);
  payload.draft_images.forEach((imageId) => form.append('draft_images[]', imageId));

  if (win.value.navigator.sendBeacon?.(`${TABS_URL}/${activeId.value}`, form)) {
    draftDirty = false;
  }
}

watch(draft, (value, before) => {
  if (value !== before && value !== (chat.value?.draft || '')) {
    saveDraftSoon();
  }
});

// ── Images ────────────────────────────────────────────────────────────────

/** A big screenshot is scaled down (and made a JPEG if it is still heavy) before it goes. */
async function prepareImage(file) {
  if (file.type === 'image/gif' || typeof win.value.createImageBitmap !== 'function') {
    return file;
  }

  const bitmap = await win.value.createImageBitmap(file).catch(() => null);

  if (!bitmap) {
    return file;
  }

  const scale = Math.min(1, IMAGE_MAX_SIDE / Math.max(bitmap.width, bitmap.height));

  if (scale === 1 && file.size <= IMAGE_MAX_BYTES) {
    return file;
  }

  const canvas = win.value.document.createElement('canvas');

  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const type = file.type === 'image/png' && file.size <= IMAGE_MAX_BYTES ? 'image/png' : 'image/jpeg';
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, 0.9));

  return blob ? new win.value.File([blob], `image.${type === 'image/png' ? 'png' : 'jpg'}`, { type }) : file;
}

async function addImages(files) {
  const tabId = activeId.value;
  const images = [...files].filter((file) => IMAGE_TYPES.includes(file.type));

  if (!images.length || !tabId) {
    return;
  }

  notice.value = '';

  await Promise.all(images.map(async (file) => {
    const slot = { local: win.value.URL.createObjectURL(file) };

    draftImages.value = [...draftImages.value, slot];

    try {
      const form = new win.value.FormData();

      form.append('image', await prepareImage(file));

      const stored = await request(`${TABS_URL}/${tabId}/images`, { method: 'POST', form });

      // Matched by its blob URL: the list hands back reactive proxies, never the object put in.
      if (activeId.value === tabId) {
        draftImages.value = draftImages.value.map((image) => (image.local === slot.local ? { id: stored.id, url: imageUrl(tabId, stored.id) } : image));
        saveDraftSoon();
      }
    } catch (err) {
      draftImages.value = draftImages.value.filter((image) => image.local !== slot.local);
      notice.value = err?.data?.message || strings('ai_panel_image_failed');
    } finally {
      win.value.URL.revokeObjectURL(slot.local);
    }
  }));
}

function removeImage(index) {
  draftImages.value = draftImages.value.filter((_, i) => i !== index);
  saveDraftSoon();
}

/** A screenshot pasted with ⌘V lands in the box; pasted text is left to the textarea. */
function onPaste(event) {
  const files = [...(event.clipboardData?.items || [])]
    .filter((item) => item.kind === 'file' && IMAGE_TYPES.includes(item.type))
    .map((item) => item.getAsFile())
    .filter(Boolean);

  if (files.length) {
    event.preventDefault();
    addImages(files);
  }
}

function onDragOver(event) {
  if ([...(event.dataTransfer?.types || [])].includes('Files')) {
    event.preventDefault();
    dragging.value = true;
  }
}

function onDrop(event) {
  dragging.value = false;

  if (event.dataTransfer?.files?.length) {
    event.preventDefault();
    addImages(event.dataTransfer.files);
  }
}

function onPick(event) {
  addImages(event.target.files || []);
  event.target.value = '';
}

function openImage(url) {
  win.value.open(url, '_blank', 'noopener');
}

// ── Asking ────────────────────────────────────────────────────────────────

/**
 * The box, sent. While the AI is answering, the question goes into the queue
 * instead — the server decides which, so two windows never start two runs —
 * and is asked when the answer before it is in.
 */
function send() {
  const tabId = activeId.value;
  const open = chat.value;
  const text = draft.value.trim();
  const images = draftImages.value.filter((image) => image.id);
  const sendMode = mode.value;

  if (!open || uploading.value || (!text && !images.length)) {
    if (uploading.value) {
      notice.value = strings('ai_panel_image_uploading');
    }

    return;
  }

  if (!ready.value) {
    notice.value = strings('ai_panel_need_key');
    scrollLog();

    return;
  }

  if (open.pending && (open.queue || []).length >= MAX_QUEUE) {
    notice.value = strings('ai_panel_queue_full');

    return;
  }

  const imageIds = images.map((image) => image.id);

  // As the server is about to write it: the box empty, and the question
  // either in the queue or in the chat with the tab waiting.
  clearTimeout(draftTimer);
  draftDirty = false;
  notice.value = '';
  applyChat(open.pending
    ? { ...open, draft: '', draft_images: [], queue: [...(open.queue || []), { id: `local-${Date.now()}`, text, images: imageIds, mode: sendMode, local: true }] }
    : {
      ...open,
      draft: '',
      draft_images: [],
      pending: { run: 'local', since: Math.floor(Date.now() / 1000), mode: sendMode },
      messages: [...open.messages, { role: 'user', content: text, images: imageIds.map((id) => ({ id })) }],
    });
  draft.value = '';
  draftImages.value = [];

  post({ tab: tabId, type: currentSectionType(win.value), mode: sendMode, model: model.value, text, images: imageIds });
}

/** "Send now": what is being answered stops, and this queued question is asked in its place. */
function sendNow(item) {
  const tabId = activeId.value;
  const open = chat.value;

  if (!open || item.local) {
    return;
  }

  const messages = [...open.messages];

  if (open.pending) {
    messages.push({ role: 'assistant', kind: 'stopped', mode: open.pending.mode, content: '' });
  }

  messages.push({ role: 'user', content: item.text, images: (item.images || []).map((id) => ({ id })) });
  applyChat({
    ...open,
    queue: open.queue.filter((row) => row.id !== item.id),
    pending: { run: 'local', since: Math.floor(Date.now() / 1000), mode: item.mode },
    messages,
  });

  post({ tab: tabId, queued: item.id });
}

/**
 * One request to the chat endpoint. It returns when the question is queued,
 * or when the answer — and whatever was queued behind it — is in; the panel
 * polls meanwhile, so each answer shows as it lands.
 */
function post(json) {
  const tabId = json.tab;
  const controller = new AbortController();

  inflight[tabId] = controller;
  watchPending();

  request('/!/sve/ai-chat', { method: 'POST', signal: controller.signal, json })
    .then((data) => applyChat(data.chat))
    .catch((err) => {
      if (err?.name === 'AbortError') {
        return;
      }

      // The server wrote what happened into the tab — show that, or ask for it.
      if (err?.data?.chat) {
        applyChat(err.data.chat);
      } else {
        refreshChat(tabId);
      }
    })
    .finally(() => {
      if (inflight[tabId] === controller) {
        delete inflight[tabId];
      }
    });
}

/** A queued question taken out of the queue. */
function removeQueued(item) {
  const tabId = activeId.value;
  const open = chat.value;

  if (!open || item.local) {
    return;
  }

  applyChat({ ...open, queue: open.queue.filter((row) => row.id !== item.id) });
  request(`${TABS_URL}/${tabId}/queue/${item.id}`, { method: 'DELETE' })
    .then((data) => applyChat(data.chat))
    .catch(() => refreshChat(tabId));
}

/** A queued question back in the box, to be changed and sent again. */
function editQueued(item) {
  if (item.local) {
    return;
  }

  removeQueued(item);
  draft.value = draft.value.trim() ? `${draft.value.trim()}\n\n${item.text}` : item.text;
  draftImages.value = [...draftImages.value, ...(item.images || []).map((id) => ({ id, url: imageUrl(activeId.value, id) }))];
  saveDraftSoon();
}

/**
 * Stop: the server ends the agent of the run being answered — the request
 * running it notices and stops it — and the tab stops waiting. In Build mode
 * a file written before the stop stays, which is what the stopped note says.
 * What is queued waits for "send now".
 */
function stop() {
  const tabId = activeId.value;

  request(`${TABS_URL}/${tabId}/stop`, { method: 'POST' })
    .then((data) => applyChat(data.chat))
    .catch(() => refreshChat(tabId));
}

function refreshChat(tabId) {
  return request(`${TABS_URL}/${tabId}`).then((data) => applyChat(data.chat)).catch(() => {});
}

/**
 * While the open tab is waiting, look every few seconds — also while this
 * panel's own request is open: that request may be answering a whole queue,
 * and each answer should show as it lands, not all at the end.
 */
function watchPending() {
  clearInterval(pollTimer);
  pollTimer = null;

  const tabId = activeId.value;

  if (!chats.value[tabId]?.pending) {
    return;
  }

  pollTimer = setInterval(() => {
    if (activeId.value !== tabId || !chats.value[tabId]?.pending) {
      clearInterval(pollTimer);
      pollTimer = null;

      return;
    }

    refreshChat(tabId);
  }, POLL_MS);
}

// ── The model ─────────────────────────────────────────────────────────────

async function loadModels() {
  try {
    const data = await request(MODELS_URL);

    models.value = data.models || [];
    defaultModel.value = data.default || '';
    modelsFailed.value = false;
  } catch {
    modelsFailed.value = true;
  }
}

/** The tab asks this model from its next question on; a new tab starts with it too. */
function pickModel(next) {
  const tabId = activeId.value;
  const open = chat.value;

  if (!open) {
    return;
  }

  applyChat({ ...open, model: next || null });
  request(`${TABS_URL}/${tabId}`, { method: 'POST', json: { model: next } }).catch(() => refreshChat(tabId));
}

function onKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    send();
  }
}

function tabTitle(tab) {
  return tab.title || strings('ai_panel_tab_new');
}

function rowNote(row) {
  if (row.kind === 'stopped') {
    return strings(row.mode === 'build' ? 'ai_panel_stopped_build' : 'ai_panel_stopped');
  }

  if (row.kind === 'lost') {
    return strings('ai_panel_lost');
  }

  return '';
}

function refreshType() {
  sectionType.value = currentSectionType(win.value);
}

defineExpose({ refreshType });

onMounted(() => {
  refreshType();
  loadTabs();

  if (ready.value) {
    loadModels();
  }

  win.value.addEventListener('pagehide', beaconDraft);
  win.value.addEventListener('beforeunload', beaconDraft);
});

onBeforeUnmount(() => {
  flushDraft();
  clearInterval(pollTimer);
  win.value.removeEventListener('pagehide', beaconDraft);
  win.value.removeEventListener('beforeunload', beaconDraft);
});

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
    <div class="sve-ai__tabs" role="tablist" data-sve-ai-tabs>
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="sve-ai__tab"
        :class="{ 'is-active': tab.id === activeId }"
        role="tab"
        :aria-selected="tab.id === activeId ? 'true' : 'false'"
        :title="tabTitle(tab)"
        :data-sve-ai-tab="tab.id"
        @click="switchTab(tab.id)"
      >
        <span v-if="tab.pending" class="sve-ai__tab-dot" aria-hidden="true" />
        <span class="sve-ai__tab-title">{{ tabTitle(tab) }}</span>
        <button type="button" class="sve-ai__tab-close" :title="strings('ai_panel_tab_close')" :aria-label="strings('ai_panel_tab_close')" data-sve-ai-tab-close @click.stop="closeTab(tab.id)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      <button type="button" class="sve-ai__tab-add" :title="strings('ai_panel_tab_add')" :aria-label="strings('ai_panel_tab_add')" data-sve-ai-tab-add @click="newTab">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    </div>
    <div class="sve-ai__hint">
      {{ strings(mode === 'build' ? 'ai_panel_hint_build' : 'ai_panel_hint') }}
    </div>
    <div ref="logEl" class="sve-ai__log" data-sve-ai-log>
      <div v-if="!ready" class="sve-ai__need-key">{{ strings('ai_panel_need_key') }}</div>
      <div v-if="loadState === 'failed'" class="sve-ai__need-key">{{ strings('ai_panel_tabs_failed') }}</div>
      <div
        v-for="(row, index) in messages"
        :key="index"
        class="sve-ai__row"
        :class="[row.role === 'user' ? 'is-user' : 'is-assistant', row.kind && row.kind !== 'reply' ? `is-${row.kind}` : '']"
        :data-sve-ai-row="row.role"
      >
        <template v-if="row.role === 'user'">
          <div v-if="row.images?.length" class="sve-ai__images">
            <button v-for="image in row.images" :key="image.id" type="button" class="sve-ai__image" @click="openImage(imageUrl(activeId, image.id))">
              <img :src="imageUrl(activeId, image.id)" alt="" data-sve-ai-sent-image />
            </button>
          </div>
          <div v-if="row.content">{{ row.content }}</div>
        </template>
        <div v-else-if="rowNote(row)" class="sve-ai__prose">{{ rowNote(row) }}</div>
        <div v-else-if="row.kind === 'error'" class="sve-ai__prose">{{ row.content || strings('ai_panel_error') }}</div>
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
      <div v-if="sending" class="sve-ai__wait" data-sve-ai-wait>{{ strings('ai_panel_thinking') }}</div>
      <div v-if="notice" class="sve-ai__notice">{{ notice }}</div>
    </div>
    <form
      class="sve-ai__form"
      :class="{ 'is-dragging': dragging }"
      @submit.prevent="send"
      @dragover="onDragOver"
      @dragleave="dragging = false"
      @drop="onDrop"
    >
      <div v-if="queue.length" class="sve-ai__queue" data-sve-ai-queue>
        <div class="sve-ai__queue-head">
          {{ strings('ai_panel_queue_title') }}<template v-if="!sending"> — {{ strings('ai_panel_queue_waiting') }}</template>
        </div>
        <div v-for="item in queue" :key="item.id" class="sve-ai__queued" :class="{ 'is-local': item.local }" data-sve-ai-queued>
          <button type="button" class="sve-ai__queued-text" :title="strings('ai_panel_queue_edit')" data-sve-ai-queued-edit @click="editQueued(item)">
            <span>{{ item.text }}</span>
            <span v-if="item.images?.length" class="sve-ai__queued-images">+{{ item.images.length }}</span>
          </button>
          <button type="button" class="sve-ai__queued-now" :disabled="item.local" data-sve-ai-send-now @click="sendNow(item)">{{ strings('ai_panel_send_now') }}</button>
          <button type="button" class="sve-ai__queued-remove" :title="strings('ai_panel_queue_remove')" :aria-label="strings('ai_panel_queue_remove')" :disabled="item.local" data-sve-ai-queued-remove @click="removeQueued(item)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </div>
      <div v-if="draftImages.length" class="sve-ai__images" data-sve-ai-draft-images>
        <span v-for="(image, i) in draftImages" :key="image.id || image.local" class="sve-ai__image" :class="{ 'is-uploading': !image.id }">
          <img :src="image.url || image.local" alt="" />
          <button v-if="image.id" type="button" class="sve-ai__image-remove" :title="strings('ai_panel_image_remove')" :aria-label="strings('ai_panel_image_remove')" @click="removeImage(i)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </span>
      </div>
      <textarea
        v-model="draft"
        rows="4"
        data-sve-ai-draft
        :placeholder="strings(mode === 'build' ? 'ai_panel_placeholder_build' : 'ai_panel_placeholder')"
        @keydown="onKeydown"
        @paste="onPaste"
      />
      <div class="sve-ai__form-meta">
        <select
          v-model="modelChoice"
          class="sve-ai__model"
          :title="strings('ai_panel_model')"
          :aria-label="strings('ai_panel_model')"
          data-sve-ai-model
        >
          <option value="">{{ defaultLabel }}</option>
          <option v-if="unlistedModel" :value="unlistedModel">{{ unlistedModel }}</option>
          <optgroup v-for="group in modelGroups" :key="group.name" :label="group.name">
            <option v-for="row in group.models" :key="row.id" :value="row.id">{{ row.name }}</option>
          </optgroup>
        </select>
        <span v-if="modelsFailed" class="sve-ai__model-note">{{ strings('ai_panel_models_failed') }}</span>
      </div>
      <div class="sve-ai__form-row">
        <button type="button" class="sve-ai__attach" :title="strings('ai_panel_attach')" :aria-label="strings('ai_panel_attach')" data-sve-ai-attach @click="fileInput?.click()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/></svg>
        </button>
        <input ref="fileInput" type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple hidden data-sve-ai-file @change="onPick" />
        <button v-if="sending" type="button" class="is-stop" data-sve-ai-stop @click="stop">{{ strings('ai_panel_stop') }}</button>
        <button type="submit" :disabled="uploading" data-sve-ai-send>{{ strings(sending ? 'ai_panel_queue' : 'ai_panel_send') }}</button>
      </div>
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
.sve-ai__form button.is-stop {
  all: unset;
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  text-align: center;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(128, 128, 128, 0.4);
  background: transparent;
  color: inherit;
  font-size: 13px;
  font-weight: 600;
}
.sve-ai__form button.is-stop:hover {
  background: rgba(128, 128, 128, 0.14);
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

/* Tabs: one chat each, kept on the server. × deletes the chat. */
.sve-ai__tabs {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 0 0 auto;
  padding: 0.5rem 0 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.sve-ai__tabs::-webkit-scrollbar {
  display: none;
}
.sve-ai__tab {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  flex: 0 1 auto;
  min-width: 0;
  max-width: 11rem;
  height: 1.75rem;
  padding: 0 0.25rem 0 0.625rem;
  border-radius: 0.375rem;
  background: rgba(128, 128, 128, 0.1);
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.7;
  cursor: pointer;
}
.sve-ai__tab:hover {
  opacity: 1;
}
.sve-ai__tab.is-active {
  background: rgba(128, 128, 128, 0.24);
  opacity: 1;
}
.sve-ai__tab-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sve-ai__tab-dot {
  flex: none;
  width: 0.4375rem;
  height: 0.4375rem;
  border-radius: 50%;
  background: var(--theme-color-primary, #4f46e5);
  animation: sve-ai-pulse 1.2s ease-in-out infinite;
}
@keyframes sve-ai-pulse {
  50% {
    opacity: 0.35;
  }
}
@media (prefers-reduced-motion: reduce) {
  .sve-ai__tab-dot {
    animation: none;
  }
}
.sve-ai__tab-close,
.sve-ai__tab-add {
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.25rem;
  opacity: 0.6;
}
.sve-ai__tab-add {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.375rem;
}
.sve-ai__tab-close svg {
  width: 0.75em;
  height: 0.75em;
}
.sve-ai__tab-add svg {
  width: 0.875rem;
  height: 0.875rem;
}
.sve-ai__tab-close:hover,
.sve-ai__tab-add:hover {
  opacity: 1;
  background: rgba(128, 128, 128, 0.2);
}

/* Images: in the box before sending, in the question after. */
.sve-ai__images {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}
.sve-ai__row.is-user .sve-ai__images {
  margin-bottom: 0.375rem;
}
.sve-ai__image {
  all: unset;
  position: relative;
  display: block;
  width: 4rem;
  height: 4rem;
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 0.375rem;
  overflow: hidden;
  background: rgba(128, 128, 128, 0.12);
  cursor: pointer;
}
.sve-ai__image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.sve-ai__image.is-uploading img {
  opacity: 0.45;
}
.sve-ai__image-remove {
  all: unset;
  position: absolute;
  top: 0.1875rem;
  right: 0.1875rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  cursor: pointer;
}
.sve-ai__image-remove svg {
  width: 0.625rem;
  height: 0.625rem;
}
.sve-ai__row.is-error,
.sve-ai__notice {
  color: #e5484d;
}
.sve-ai__notice {
  font-size: 0.75rem;
  line-height: 1.4;
}
.sve-ai__row.is-stopped,
.sve-ai__row.is-lost {
  opacity: 0.7;
}
.sve-ai__form.is-dragging {
  outline: 1px dashed var(--theme-color-primary, #4f46e5);
  outline-offset: 0.25rem;
  border-radius: 0.5rem;
}
.sve-ai__form-row {
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
}
.sve-ai__attach {
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 2.25rem;
  border: 1px solid rgba(128, 128, 128, 0.4);
  border-radius: 0.5rem;
}
.sve-ai__attach svg {
  width: 1rem;
  height: 1rem;
}
.sve-ai__attach:hover {
  background: rgba(128, 128, 128, 0.14);
}
.sve-ai__form-row button[type='submit'],
.sve-ai__form-row button.is-stop {
  flex: 1 1 auto;
  width: auto;
}
.sve-ai__form-row button[type='submit']:disabled {
  opacity: 0.5;
  cursor: default;
}

/* The queue: asked while it was answering, each the next question in turn. */
.sve-ai__queue {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.sve-ai__queue-head {
  font-size: 0.6875rem;
  font-weight: 600;
  opacity: 0.6;
}
.sve-ai__queued {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.25rem 0.25rem 0.5rem;
  border: 1px dashed rgba(128, 128, 128, 0.4);
  border-radius: 0.5rem;
  font-size: 0.75rem;
}
.sve-ai__queued.is-local {
  opacity: 0.6;
}
.sve-ai__queued-text {
  all: unset;
  cursor: pointer;
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}
.sve-ai__queued-text span:first-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sve-ai__queued-images {
  flex: none;
  padding: 0 0.3125rem;
  border-radius: 0.25rem;
  background: rgba(128, 128, 128, 0.18);
  font-size: 0.6875rem;
}
.sve-ai__queued-now {
  all: unset;
  cursor: pointer;
  flex: none;
  padding: 0.1875rem 0.5rem;
  border-radius: 0.375rem;
  background: var(--theme-color-primary, #4f46e5);
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 600;
}
.sve-ai__queued-remove {
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 1.375rem;
  height: 1.375rem;
  border-radius: 0.25rem;
  opacity: 0.6;
}
.sve-ai__queued-remove svg {
  width: 0.75rem;
  height: 0.75rem;
}
.sve-ai__queued-remove:hover {
  opacity: 1;
  background: rgba(128, 128, 128, 0.2);
}
.sve-ai__queued-now:disabled,
.sve-ai__queued-remove:disabled {
  opacity: 0.4;
  cursor: default;
}

/* The model: per chat, picked from what the site's Cursor account can use. */
.sve-ai__form-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}
.sve-ai__model {
  max-width: 100%;
  min-width: 0;
  padding: 0.25rem 0.5rem;
  border: 1px solid rgba(128, 128, 128, 0.32);
  border-radius: 0.375rem;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 0.75rem;
  cursor: pointer;
}
.sve-ai__model-note {
  font-size: 0.6875rem;
  opacity: 0.6;
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
