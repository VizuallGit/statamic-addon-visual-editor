<template>
  <div class="sve-fontdlg__body">
    <label
      class="sve-fontdlg__drop"
      :class="{ 'is-over': over }"
      data-sve-font-drop
      @dragover.prevent="over = true"
      @dragleave="over = false"
      @drop.prevent="drop"
    >
      <input type="file" multiple accept=".woff2,.woff,.ttf,.otf" data-sve-font-file @change="pick">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/></svg>
      <span class="sve-fontdlg__drop-title">{{ ui.labels.fonts_drop }}</span>
      <span class="sve-fontdlg__drop-hint">{{ ui.labels.fonts_drop_hint }}</span>
    </label>

    <div v-if="needsConvert" class="sve-theme__switch-row sve-fontdlg__convert">
      <span class="sve-fontdlg__convert-text">
        <span class="sve-theme__label">{{ ui.labels.fonts_convert }}</span>
        <span class="sve-fontdlg__hint">{{ ui.labels.fonts_convert_hint }}</span>
      </span>
      <button
        type="button"
        role="switch"
        class="sve-theme__switch"
        :class="{ 'is-on': convert }"
        :aria-checked="convert"
        :aria-label="ui.labels.fonts_convert"
        data-sve-font-convert
        @click="convert = !convert"
      ><span></span></button>
    </div>

    <div v-for="item in items" :key="item.id" class="sve-fontdlg__upload" data-sve-font-upload>
      <div class="sve-fontdlg__upload-top">
        <span class="sve-fontdlg__upload-name" :style="{ fontFamily: `'sve-up-${item.id}', ui-sans-serif, system-ui, sans-serif` }">{{ item.family || item.file.name }}</span>
        <span class="sve-fontdlg__upload-size">{{ sizeText(item) }}</span>
        <button type="button" class="sve-theme__ghost" :title="ui.labels.fonts_upload_skip" @click="skip(item)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <p v-if="item.error" class="sve-fontdlg__error">{{ item.file.name }}: {{ errorText(item.error) }}</p>
      <template v-else>
        <label class="sve-theme__field">
          <span class="sve-theme__label">{{ ui.labels.fonts_family }}</span>
          <span class="sve-theme__input"><input v-model="item.family" type="text" data-sve-font-family></span>
        </label>
        <label class="sve-theme__field">
          <span class="sve-theme__label">{{ ui.labels.fonts_weight }}</span>
          <span v-if="item.axis" class="sve-theme__input"><input type="text" readonly :value="`${ui.labels.fonts_variable} ${item.axis[0]}–${item.axis[1]}`"></span>
          <span v-else class="sve-theme__input">
            <select v-model.number="item.weight" data-sve-font-weight>
              <option v-for="(name, w) in WEIGHT_NAMES" :key="w" :value="Number(w)">{{ w }} · {{ name }}</option>
            </select>
            <svg class="sve-theme__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </label>
        <div class="sve-theme__field">
          <span class="sve-theme__label">{{ ui.labels.fonts_style }}</span>
          <div class="sve-theme__segments">
            <button type="button" :class="{ 'is-on': !item.italic }" @click="item.italic = false">{{ ui.labels.fonts_style_normal }}</button>
            <button type="button" :class="{ 'is-on': item.italic }" @click="item.italic = true">{{ ui.labels.fonts_style_italic }}</button>
          </div>
        </div>
      </template>
    </div>
  </div>

  <footer class="sve-fontdlg__foot">
    <span class="sve-fontdlg__size">
      <template v-if="ready.length"><b>{{ formatBytes(totalBytes) }}</b> {{ filesText(ready.length) }}</template>
    </span>
    <span class="sve-fontdlg__error">{{ error ? errorText(error) : '' }}</span>
    <button type="button" class="sve-theme__save" :disabled="!canInstall" data-sve-font-install @click="install">
      {{ busy ? ui.labels.fonts_installing : ui.labels.fonts_install }}
    </button>
  </footer>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { themePanelUi as ui } from '../theme-panel/store.js';
import { errorText, filesText, fontsRequest } from '../theme-panel/fonts.js';
import { readFontFile, toWoff2 } from '../theme-panel/font-files.js';
import { WEIGHT_NAMES, formatBytes } from '../theme-panel/font-helpers.js';

const props = defineProps({ win: { type: Object, required: true } });
const emit = defineEmits(['installed']);

const items = reactive([]);
const over = ref(false);
/** WOFF2 is a third to half the size of TTF/OTF, and every browser reads it. */
const convert = ref(true);
const busy = ref(false);
const error = ref('');
let seq = 0;

const ready = computed(() => items.filter((item) => !item.error));
const needsConvert = computed(() => ready.value.some((item) => item.kind !== 'woff2'));
const shipped = (item) => (convert.value && item.kind !== 'woff2' && item.woff2 ? item.woff2 : item.bytes);
const totalBytes = computed(() => ready.value.reduce((sum, item) => sum + shipped(item).length, 0));
const canInstall = computed(() => !busy.value && ready.value.length > 0 && ready.value.every((item) => item.family.trim()) && ui.fontsWritable);

function sizeText(item) {
  if (item.error) {
    return '';
  }

  return convert.value && item.kind !== 'woff2'
    ? `${item.kind.toUpperCase()} ${formatBytes(item.bytes.length)} → WOFF2 ${item.woff2 ? formatBytes(item.woff2.length) : '…'}`
    : `${item.kind.toUpperCase()} ${formatBytes(item.bytes.length)}`;
}

async function add(files) {
  error.value = '';

  for (const file of files) {
    const read = await readFontFile(file);
    const item = reactive({ id: ++seq, woff2: null, ...read, error: read.error || '', family: read.family || '', weight: read.weight || 400, italic: !!read.italic });

    items.push(item);

    if (!item.error) {
      // The file itself, drawn in its row: what you see is what gets installed.
      try {
        props.win.document.fonts.add(new props.win.FontFace(`sve-up-${item.id}`, item.bytes.slice().buffer));
      } catch {
        // A font the browser will not draw still installs; the row keeps the CP's font.
      }
    }
  }

  convertPending();
}

function pick(event) {
  add([...(event.target.files || [])]);
  event.target.value = '';
}

function drop(event) {
  over.value = false;
  add([...(event.dataTransfer?.files || [])]);
}

/** Takes a file off this list — nothing on the server is touched. */
function skip(item) {
  items.splice(items.indexOf(item), 1);
}

async function convertPending() {
  if (!convert.value) {
    return;
  }

  for (const item of ready.value) {
    if (item.kind !== 'woff2' && !item.woff2 && !item.converting) {
      item.converting = true;

      try {
        item.woff2 = await toWoff2(item.bytes, item.kind);
      } catch {
        item.error = 'not_a_font';
      } finally {
        item.converting = false;
      }
    }
  }
}

watch(convert, convertPending);

async function install() {
  if (!canInstall.value) {
    return;
  }

  busy.value = true;
  error.value = '';

  let listing = null;
  const families = new Set();

  try {
    for (const item of [...ready.value]) {
      const woff2 = convert.value && item.kind !== 'woff2';
      const bytes = woff2 ? item.woff2 || (await toWoff2(item.bytes, item.kind)) : item.bytes;
      const stem = item.file.name.replace(/\.[^.]+$/, '');
      const form = new props.win.FormData();

      form.append('file', new props.win.Blob([bytes]), `${stem}.${woff2 ? 'woff2' : item.kind}`);
      form.append('family', item.family.trim());
      form.append('weight', item.axis ? `${item.axis[0]} ${item.axis[1]}` : String(item.weight));
      form.append('style', item.italic ? 'italic' : 'normal');

      const { ok, data } = await fontsRequest(props.win, '/upload', { method: 'POST', form });

      if (!ok) {
        error.value = data.error || 'install_failed';

        return;
      }

      listing = data;
      families.add(data.family || item.family.trim());
      skip(item);
    }
  } finally {
    busy.value = false;
  }

  if (listing) {
    emit('installed', listing, String(ui.labels.fonts_installed_message || '').replace(':name', [...families].join(', ')));
  }
}
</script>
