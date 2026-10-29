<script setup>
/**
 * Build's Content tab for an element of the page's own markup: its text.
 *
 * A heading, a paragraph, a link, a list item — whatever holds plain text
 * (build-mode/text.js) — gets a text box, and every keystroke is written into
 * the dock's file through the port, at most once a frame, so the canvas
 * paints it as it is typed. What the box shows comes from the file; while it
 * is being typed in, the box is the one that knows, and the file catches up.
 *
 * An element whose text is not its own says whose it is: a field
 * (`{{ headline }}`, edited in Content mode), the elements inside it, or —
 * for a div or a section — nothing, as a layout has no text of its own.
 * Images, video and links' addresses come next.
 */
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue';
import { tagFamily } from '../../lib/tag-families.js';
import { ic } from '../../build-mode/icons.js';

const props = defineProps({
  node: { type: Object, required: true },
});

const port = inject('sveBuild');
const read = computed(() => (port.rev.value, port.text()));
const fromFile = computed(() => (read.value?.kind === 'text' ? read.value.text : null));
const layout = computed(() => tagFamily(String(props.node.tag || '').toLowerCase()) === 'layout');
const rows = computed(() => (/^h[1-6]$/i.test(props.node.tag || '') ? 2 : 4));

const value = ref(fromFile.value ?? '');
let typing = false;
let frame = 0;

watch(fromFile, (text) => {
  if (!typing && text !== null) {
    value.value = text;
  }
});

function write() {
  frame = 0;
  port.setText(props.node.path, value.value);
}

function input() {
  typing = true;

  if (!frame) {
    frame = window.requestAnimationFrame(write);
  }
}

/** Typing over: what is still on its way is written, and the box reads the file again. */
function done() {
  if (frame) {
    window.cancelAnimationFrame(frame);
    write();
  }

  typing = false;

  if (fromFile.value !== null) {
    value.value = fromFile.value;
  }
}

onBeforeUnmount(done);
</script>

<template>
  <div class="bm-content">
    <label v-if="read?.kind === 'text'" class="bm-text">
      <span class="fg-lab">{{ port.t('content_text') }}</span>
      <textarea
        v-model="value"
        :rows="rows"
        spellcheck="true"
        :placeholder="port.t('content_text_placeholder')"
        data-sve-build-text
        @input="input"
        @blur="done"
      ></textarea>
    </label>

    <p v-else-if="read?.kind === 'antlers'" class="bm-note is-top" data-sve-build-text-antlers v-html="port.t('content_antlers', { tag: `<code>${read.tag.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])}</code>` })"></p>

    <p v-else-if="read?.kind === 'markup'" class="bm-note is-top" data-sve-build-text-markup>{{ port.t('content_markup') }}</p>

    <div v-else class="bm-empty" data-sve-build-content-soon>
      <span v-html="ic('form')"></span>
      <p>{{ port.t(layout ? 'content_layout' : 'content_soon') }}</p>
    </div>
  </div>
</template>
