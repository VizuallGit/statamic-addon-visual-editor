<template>
  <div class="sve-fontdlg__body">
    <p class="sve-fontdlg__hint">{{ ui.labels.fonts_adobe_hint }}</p>
    <label class="sve-theme__field">
      <span class="sve-theme__label">{{ ui.labels.fonts_adobe_kit }}</span>
      <span class="sve-theme__input">
        <input v-model="kit" type="text" placeholder="https://use.typekit.net/abc1234.css" data-sve-font-kit @keydown.enter.prevent="add">
      </span>
    </label>

    <template v-if="ui.kits.length">
      <div class="sve-fontdlg__group-head"><span>{{ ui.labels.fonts_kits }}</span></div>
      <div v-for="k in ui.kits" :key="k.url" class="sve-fontdlg__upload">
        <span class="sve-fontdlg__upload-size">{{ k.url }}</span>
        <span class="sve-fontdlg__kit-families">{{ k.families.join(', ') || ui.labels.fonts_kit_unreadable }}</span>
      </div>
    </template>
  </div>

  <footer class="sve-fontdlg__foot">
    <span class="sve-fontdlg__size"></span>
    <span class="sve-fontdlg__error">{{ error ? errorText(error) : '' }}</span>
    <button type="button" class="sve-theme__save" :disabled="!kit.trim() || busy || !ui.fontsWritable" data-sve-font-install @click="add">
      {{ busy ? ui.labels.fonts_installing : ui.labels.fonts_adobe_add }}
    </button>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
import { themePanelUi as ui } from '../theme-panel/store.js';
import { errorText, fontsRequest } from '../theme-panel/fonts.js';

const props = defineProps({ win: { type: Object, required: true } });
const emit = defineEmits(['installed']);

const kit = ref('');
const busy = ref(false);
const error = ref('');

async function add() {
  if (!kit.value.trim() || busy.value) {
    return;
  }

  busy.value = true;
  error.value = '';

  const { ok, data } = await fontsRequest(props.win, '/adobe', { method: 'POST', json: { kit: kit.value.trim() } });

  busy.value = false;

  if (!ok) {
    error.value = data.error || 'install_failed';

    return;
  }

  const families = data.kits?.find((k) => k.url === data.kit)?.families || [];

  emit('installed', data, String(ui.labels.fonts_installed_message || '').replace(':name', families.join(', ') || 'Adobe Fonts'));
}
</script>
