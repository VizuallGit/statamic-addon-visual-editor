<script setup>
/**
 * Build's Content tab for an element of the page's own markup: its text, and
 * an image's, a video's or a link's address.
 *
 * A heading, a paragraph, a link, a list item — whatever holds plain text
 * (build-mode/text.js) — gets a text box, and every keystroke is written into
 * the dock's file through the port, at most once a frame, so the canvas
 * paints it as it is typed. What a box shows comes from the file; while it is
 * being typed in, the box is the one that knows, and the file catches up.
 *
 * An image and a video get the asset browser, a link the page picker — the
 * Control Panel's own fields, mounted by the port (`mountAddress`,
 * build-mode/element-fields.js), the attribute written once the field
 * settles; an image its alt text too. A Control Panel that cannot lend the
 * field — or a page without one — gets a plain box for the address.
 *
 * Everything is written by the element's path, not the pick's: what is still
 * on its way when another element is clicked lands where it was typed.
 *
 * What is not the element's own says whose it is: a field (`{{ headline }}`,
 * edited in Content mode), the elements inside it, or — for a div or a
 * section — nothing, as a layout has no text of its own.
 */
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue';
import { tagFamily } from '../../lib/tag-families.js';
import { ic } from '../../build-mode/icons.js';
import { ADDRESS } from '../../build-mode/attrs.js';

const props = defineProps({
  node: { type: Object, required: true },
});

const port = inject('sveBuild');
const tag = computed(() => String(props.node.tag || '').toLowerCase());
const path = props.node.path;
const ANTLERS = /\{\{[\s\S]*?\}\}/;
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
const fromField = (expr) => port.t('content_antlers', { tag: `<code>${esc(expr.replace(/\s+/g, ' '))}</code>` });

/** A box typed into: the file's value until it is typed in, then the box's, written once a frame. */
function typed(fromFile, write) {
  const value = ref(fromFile.value ?? '');
  let typing = false;
  let frame = 0;
  const flush = () => {
    frame = 0;
    write(value.value);
  };

  watch(fromFile, (next) => {
    if (!typing && next !== null) {
      value.value = next;
    }
  });

  return {
    value,
    input() {
      typing = true;

      if (!frame) {
        frame = window.requestAnimationFrame(flush);
      }
    },
    /** Typing over: what is still on its way is written, and the box reads the file again. */
    done() {
      if (frame) {
        window.cancelAnimationFrame(frame);
        flush();
      }

      typing = false;

      if (fromFile.value !== null) {
        value.value = fromFile.value;
      }
    },
  };
}

/* ---------------- the text ---------------- */

const read = computed(() => (port.rev.value, port.text()));
const text = typed(
  computed(() => (read.value?.kind === 'text' ? read.value.text : null)),
  (value) => port.setText(path, value)
);
const rows = computed(() => (/^h[1-6]$/.test(tag.value) ? 2 : 4));

/* ---------------- the address: src, href ---------------- */

const address = ADDRESS[tag.value] || null;
const addressNow = computed(() => (port.rev.value, address ? port.attr(address.attr) ?? '' : null));
const addressExpr = computed(() => ANTLERS.exec(addressNow.value || '')?.[0] || '');
const statamic = !!address && !!port.addressFieldReady?.(tag.value);
const addressBox = typed(addressNow, (value) => port.setAttrAt(path, address.attr, value));

const host = ref(null);
let unmountField = null;

watch(
  host,
  (el) => {
    unmountField?.();
    unmountField = el
      ? port.mountAddress(el, {
          tag: tag.value,
          value: addressNow.value || '',
          display: port.t(`content_${tag.value}`),
          write: (value) => port.setAttrAt(path, address.attr, value),
        })
      : null;
  },
  { flush: 'post' }
);

/* ---------------- an image's alt text ---------------- */

const altNow = computed(() => (port.rev.value, tag.value === 'img' ? port.attr('alt') ?? '' : null));
const altExpr = computed(() => ANTLERS.exec(altNow.value || '')?.[0] || '');
const alt = typed(altNow, (value) => port.setAttrAt(path, 'alt', value));

const nothing = computed(() => !read.value && !address);
const layout = computed(() => tagFamily(tag.value) === 'layout');

onBeforeUnmount(() => {
  text.done();
  addressBox.done();
  alt.done();
  unmountField?.();
  unmountField = null;
});
</script>

<template>
  <div class="bm-content">
    <label v-if="read?.kind === 'text'" class="bm-text">
      <span class="fg-lab">{{ port.t('content_text') }}</span>
      <textarea
        v-model="text.value.value"
        :rows="rows"
        spellcheck="true"
        :placeholder="port.t('content_text_placeholder')"
        data-sve-build-text
        @input="text.input"
        @blur="text.done"
      ></textarea>
    </label>
    <p v-else-if="read?.kind === 'antlers'" class="bm-note is-top" data-sve-build-text-antlers v-html="fromField(read.tag)"></p>
    <p v-else-if="read?.kind === 'markup'" class="bm-note is-top" data-sve-build-text-markup>{{ port.t('content_markup') }}</p>

    <div v-if="address" class="bm-text" :data-sve-build-address="address.attr">
      <template v-if="addressExpr || !statamic">
        <span class="fg-lab">{{ port.t(`content_${tag}`) }}</span>
        <p v-if="addressExpr" class="bm-note is-top" v-html="fromField(addressExpr)"></p>
        <input
          v-else
          v-model="addressBox.value.value"
          class="bm-inp"
          type="text"
          :aria-label="address.attr"
          :placeholder="port.t(`content_${address.attr}_placeholder`)"
          :data-sve-build-href="address.attr === 'href' ? '' : null"
          :data-sve-build-src="address.attr === 'src' ? '' : null"
          @input="addressBox.input"
          @keydown.enter.prevent="addressBox.done"
          @blur="addressBox.done"
        />
      </template>
      <div v-else ref="host" class="bm-field-host" data-sve-build-field></div>
    </div>

    <div v-if="tag === 'img'" class="bm-text">
      <span class="fg-lab">{{ port.t('content_alt') }}</span>
      <p v-if="altExpr" class="bm-note is-top" v-html="fromField(altExpr)"></p>
      <input
        v-else
        v-model="alt.value.value"
        class="bm-inp"
        type="text"
        aria-label="alt"
        :placeholder="port.t('content_alt_placeholder')"
        data-sve-build-alt
        @input="alt.input"
        @blur="alt.done"
      />
    </div>

    <div v-if="nothing" class="bm-empty" data-sve-build-content-soon>
      <span v-html="ic('form')"></span>
      <p>{{ port.t(layout ? 'content_layout' : 'content_soon') }}</p>
    </div>
  </div>
</template>
