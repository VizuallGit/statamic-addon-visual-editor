<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
  heading: { type: String, required: true },
  subtitle: { type: String, default: '' },
  src: { type: String, required: true },
  closeLabel: { type: String, required: true },
  onClose: { type: Function, required: true },
});

const loading = ref(true);
const frame = ref(null);

/**
 * The Fieldsets screen is a whole Control Panel page, navigation and all, and
 * inside a panel that is noise with a trapdoor in it — a click on "Collections"
 * would sail the frame off to another screen behind our own close button.
 *
 * Same origin, so the chrome is simply hidden from the inside. The hooks are
 * structural rather than visual: `main`'s own sidebar, and the header that sits
 * immediately before `main`. If a Statamic release moves either, the rule stops
 * matching and the panel shows the full page again — which is what it did
 * before this existed. It degrades to working, never to broken.
 */
function trimChrome() {
  loading.value = false;

  try {
    const doc = frame.value?.contentDocument;

    if (!doc || doc.getElementById('sve-fs-trim')) {
      return;
    }

    const style = doc.createElement('style');

    style.id = 'sve-fs-trim';
    style.textContent = `
      nav.nav-main { display: none !important; }
      header:has(+ main) { display: none !important; }
      main { top: 0 !important; min-height: 100vh !important; }
    `;

    doc.head.appendChild(style);
  } catch {
    // A cross-origin frame cannot happen here — the Control Panel is this same
    // site — but a reach into a document mid-navigation can throw, and the
    // panel is perfectly usable untrimmed.
  }
}

function onKey(event) {
  if (event.key === 'Escape') {
    props.onClose();
  }
}

// On the overlay's own document: the Fieldsets screen inside the frame has its
// own key handling, and Escape there belongs to whatever it has open.
onMounted(() => document.addEventListener('keydown', onKey));
onUnmounted(() => document.removeEventListener('keydown', onKey));

function onOverlay(event) {
  if (event.target === event.currentTarget) {
    props.onClose();
  }
}
</script>

<template>
  <div class="sve-fs-overlay" @click="onOverlay">
    <div class="sve-fs" @click.stop>
      <div class="sve-fs__bar">
        <div class="sve-fs__title">
          {{ heading }}
          <span v-if="subtitle" class="sve-fs__sub">{{ subtitle }}</span>
        </div>
        <button type="button" :aria-label="closeLabel" :title="closeLabel" @click="onClose">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <div class="sve-fs__body">
        <div v-if="loading" class="sve-fs__loading">…</div>
        <iframe ref="frame" :src="src" :title="heading" @load="trimChrome"></iframe>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sve-fs-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5vh 2vw;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.55);
}
.sve-fs {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 78em;
  height: 100%;
  min-height: 0;
  border-radius: 0.75em;
  overflow: hidden;
  background: var(--theme-color-content-bg, #fff);
  color: currentColor;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
.sve-fs__bar {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  padding: 0.7em 0.9em;
  border-bottom: 1px solid rgba(128, 128, 128, 0.25);
}
.sve-fs__title {
  font-size: 0.95em;
  font-weight: 600;
  display: flex;
  align-items: baseline;
  gap: 0.6em;
  min-width: 0;
}
.sve-fs__sub {
  font-weight: 400;
  font-size: 0.85em;
  opacity: 0.55;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sve-fs__bar button {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.9em;
  height: 1.9em;
  border-radius: 0.4em;
  line-height: 1;
  opacity: 0.62;
}
.sve-fs__bar button:hover {
  opacity: 1;
  background: rgba(128, 128, 128, 0.18);
}
.sve-fs__body {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
}
.sve-fs__loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6em;
  opacity: 0.4;
}
iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
</style>
