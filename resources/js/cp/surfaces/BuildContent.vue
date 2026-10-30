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
 * An image and a video get the asset browser, a link the page picker, a
 * block of rich text (build-mode/rich.js) Bard — the Control Panel's own
 * fields, mounted by the port (`mountField`, build-mode/element-fields.js),
 * written once the field settles. An image's alt text is the asset's own ("Set Alt" on it): its
 * `alt` reads it on the server (attrs.js `altFromAsset`), written with the
 * `src`, so there is one alt text and it follows wherever it changes. A
 * Control Panel that cannot lend the field — or a page without one — gets a
 * plain box for the address.
 *
 * An `{{ svg }}` gets the site's SVGs as pictures (BuildSvgPicker.vue): the
 * one picked swaps the file the tag draws (`port.setSvgAt`, build-mode/svg.js).
 * One whose file is a field's (`dynamic`) says which field: chosen in Content mode.
 *
 * Everything is written by the element's path, not the pick's: what is still
 * on its way when another element is clicked lands where it was typed.
 *
 * The text box takes words and fields alike: the data icon offers the fields
 * that fit (data-var-types.js) and writes `{{ headline }}` in place of what the
 * box held; words around it are typed as any others. A field's value is edited
 * in Content mode. A heading or a link is one line (an input); other text grows
 * from one, and Enter writes the `<br>` it means.
 *
 * Rich text and a link's address are the Control Panel's field until the data
 * icon beside its label picks a field of theirs: then a box shows the tag, and
 * emptying it brings the field back. A link also has its target, rel and
 * aria-label.
 *
 * What is not the element's own says whose it is: the elements inside it, or —
 * for a div or a section — nothing, as a layout has no text of its own.
 */
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue';
import BuildSvgPicker from './BuildSvgPicker.vue';
import { tagFamily } from '../../lib/tag-families.js';
import BuildPickField from './BuildPickField.vue';
import { ic } from '../../build-mode/icons.js';
import { ADDRESS, altFromAsset } from '../../build-mode/attrs.js';
import { halfTag, isOneLine } from '../../build-mode/text.js';
import { TEXT_FIELDS, withoutFields } from '../../data-var-types.js';

const props = defineProps({
  node: { type: Object, required: true },
});

const port = inject('sveBuild');
const tag = computed(() => String(props.node.tag || '').toLowerCase());
const path = props.node.path;
const svg = props.node.kind === 'svg';
const ANTLERS = /\{\{[\s\S]*?\}\}/;
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
const fromField = (expr) => port.t('content_antlers', { tag: `<code>${esc(expr.replace(/\s+/g, ' '))}</code>` });

/**
 * A box typed into: the file's value until it is typed in, then the box's,
 * written once a frame — or, `live: false`, once typing is over (raw HTML,
 * where every keystroke on the way is half a tag).
 */
function typed(fromFile, write, { live = true } = {}) {
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

      if (live && !frame) {
        frame = window.requestAnimationFrame(flush);
      }
    },
    /** Typing over: what is still on its way is written, and the box reads the file again. */
    done() {
      if (frame) {
        window.cancelAnimationFrame(frame);
        flush();
      } else if (!live && typing) {
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

const read = computed(() => (port.rev.value, svg ? null : port.text()));
const text = typed(
  computed(() => (read.value?.kind === 'text' ? read.value.text : null)),
  (value) => port.setText(path, value)
);
const oneLine = isOneLine(tag.value);
const refused = ref('');

/** A field of the wrong type typed by hand comes out again (`clear`), and the panel says why. */
function refuseWrong(value, types, clear) {
  port.wrongFields(path, value, types).then((wrong) => {
    refused.value = wrong.length ? port.t('content_field_refused', { field: wrong[0] }) : '';

    if (wrong.length) {
      clear(wrong);
    }
  });
}

/** Picked from the list: the field stands in the box's place. */
function pickText(anchor) {
  port.pickField(anchor, path, TEXT_FIELDS, (expression) => {
    text.done();
    refused.value = '';
    port.setText(path, expression);
  });
}

function textDone() {
  text.done();

  const now = read.value?.text;

  refuseWrong(now, TEXT_FIELDS, (wrong) => port.setText(path, withoutFields(now, wrong)));
}

/** Enter in a text of several lines: the line break, as the element it is. */
function lineBreak(event) {
  const box = event.target;

  box.setRangeText('<br>', box.selectionStart, box.selectionEnd, 'end');
  text.value.value = box.value;
  text.input();
}

/* ---------------- the address: src, href ---------------- */

const address = ADDRESS[tag.value] || null;
const addressNow = computed(() => (port.rev.value, address ? port.attr(address.attr) ?? '' : null));
const addressExpr = computed(() => ANTLERS.exec(addressNow.value || '')?.[0] || '');

/** The address written — an image's alt with it, read off the asset it now points at. */
function writeAddress(value) {
  if (!halfTag(value)) {
    port.setAttrsAt(path, address.alt ? { [address.attr]: value, alt: altFromAsset(value) } : { [address.attr]: value });
  }
}

const addressBox = typed(addressNow, writeAddress);

/* A link's address can be a link field's, and it has more to say than where it goes. */
const LINK_FIELDS = ['link'];
const isLink = tag.value === 'a';

function pickLink(anchor) {
  port.pickField(anchor, path, LINK_FIELDS, (expression) => {
    addressBox.done();
    refused.value = '';
    writeAddress(expression);
  });
}

function addressDone() {
  addressBox.done();

  if (isLink) {
    const now = addressNow.value;

    refuseWrong(now, LINK_FIELDS, (wrong) => writeAddress(withoutFields(now, wrong)));
  }
}

/** An attribute of a link, gone when it is empty. */
const linkAttr = (name) =>
  typed(
    computed(() => (port.rev.value, isLink ? port.attr(name) ?? '' : null)),
    (value) => port.setAttrsAt(path, { [name]: value.trim() === '' ? null : value })
  );
const relBox = linkAttr('rel');
const ariaBox = linkAttr('aria-label');
const newTab = computed(() => (port.rev.value, isLink && port.attr('target') === '_blank'));

function toggleNewTab() {
  port.setAttrsAt(path, { target: newTab.value ? null : '_blank' });
}

/* ---------------- rich text: a block of prose, in Bard ---------------- */

const rich = computed(() => (port.rev.value, svg || address || read.value ? null : port.rich()));
const richNow = computed(() => rich.value?.html ?? null);
const RICH_FIELDS = ['bard'];
const richField = computed(() => (port.rev.value, svg || address || read.value ? null : port.richField()));

function pickRich(anchor) {
  port.pickField(anchor, path, RICH_FIELDS, (expression) => {
    richBox.done();
    refused.value = '';
    port.setRichField(path, expression);
  });
}

const richFieldBox = typed(richField, (value) => port.setRichField(path, value), { live: false });

function richFieldDone() {
  richFieldBox.done();

  const now = richField.value;

  refuseWrong(now, RICH_FIELDS, () => port.setRichField(path, ''));
}

/** Bard's HTML, with the apostrophes it escapes for a partial's parameter back as they are typed. */
function writeRich(value) {
  port.setRichAt(path, String(value || '').replace(/&#39;/g, "'"));
}

const richBox = typed(richNow, writeRich, { live: false });

/* ---------------- the Control Panel's own field, for either ---------------- */

const kind = address ? tag.value : 'rich';
const statamic = !!port.fieldReady?.(kind);
const host = ref(null);
let unmountField = null;

watch(
  host,
  (el) => {
    unmountField?.();
    unmountField = el
      ? port.mountField(el, {
          kind,
          value: (address ? addressNow.value : richNow.value) || '',
          display: port.t(`content_${kind}`),
          write: address ? writeAddress : writeRich,
          pick: isLink ? pickLink : address ? null : pickRich,
          pickTitle: port.t('content_field_pick'),
        })
      : null;
  },
  { flush: 'post' }
);

const nothing = computed(() => !svg && !read.value && !address && !rich.value && richField.value === null);
const layout = computed(() => tagFamily(tag.value) === 'layout');

onBeforeUnmount(() => {
  text.done();
  addressBox.done();
  richBox.done();
  richFieldBox.done();
  relBox.done();
  ariaBox.done();
  unmountField?.();
  unmountField = null;
});
</script>

<template>
  <div class="bm-content">
    <div v-if="read?.kind === 'text'" class="bm-text">
      <label class="fg-lab" :for="`sve-build-text-${path}`">{{ port.t('content_text') }}</label>
      <div class="bm-text-box">
        <input
          v-if="oneLine"
          :id="`sve-build-text-${path}`"
          v-model="text.value.value"
          class="bm-inp"
          type="text"
          spellcheck="true"
          :placeholder="port.t('content_text_placeholder')"
          data-sve-build-text
          @input="text.input(); refused = ''"
          @keydown.enter.prevent
          @blur="textDone"
        />
        <textarea
          v-else
          :id="`sve-build-text-${path}`"
          v-model="text.value.value"
          rows="1"
          spellcheck="true"
          :placeholder="port.t('content_text_placeholder')"
          data-sve-build-text
          @input="text.input(); refused = ''"
          @keydown.enter.prevent="lineBreak"
          @blur="textDone"
        ></textarea>
        <BuildPickField @pick="pickText" />
      </div>
      <p v-if="refused" class="bm-note is-top" data-sve-build-field-refused>{{ refused }}</p>
    </div>
    <p v-else-if="read?.kind === 'markup'" class="bm-note is-top" data-sve-build-text-markup>{{ port.t('content_markup') }}</p>

    <div v-if="address" class="bm-text" :data-sve-build-address="address.attr">
      <template v-if="addressExpr || !statamic">
        <span class="fg-lab">{{ port.t(`content_${tag}`) }}</span>
        <p v-if="addressExpr && !isLink" class="bm-note is-top" v-html="fromField(addressExpr)"></p>
        <div v-else class="bm-text-box">
          <input
            v-model="addressBox.value.value"
            class="bm-inp"
            type="text"
            :aria-label="address.attr"
            :placeholder="port.t(`content_${address.attr}_placeholder`)"
            :data-sve-build-href="address.attr === 'href' ? '' : null"
            :data-sve-build-src="address.attr === 'src' ? '' : null"
            @input="addressBox.input"
            @keydown.enter.prevent="addressDone"
            @blur="addressDone"
          />
          <BuildPickField v-if="isLink" @pick="pickLink" />
        </div>
      </template>
      <div v-else ref="host" class="bm-field-host" data-sve-build-field></div>
      <p v-if="address.alt" class="bm-note is-top" data-sve-build-alt-note>{{ port.t('content_alt_note') }}</p>
      <div v-if="isLink" class="bm-link-more" data-sve-build-link-more>
        <div class="bm-link-row">
          <span>{{ port.t('content_new_tab') }}</span>
          <button type="button" class="bm-switch" role="switch" :aria-checked="newTab" :aria-label="port.t('content_new_tab')" data-sve-build-new-tab @click="toggleNewTab"></button>
        </div>
        <label class="bm-text">
          <span class="fg-lab">rel</span>
          <input v-model="relBox.value.value" class="bm-inp" type="text" spellcheck="false" placeholder="noopener noreferrer" data-sve-build-rel @input="relBox.input" @keydown.enter.prevent="relBox.done" @blur="relBox.done" />
        </label>
        <label class="bm-text">
          <span class="fg-lab">aria-label</span>
          <input v-model="ariaBox.value.value" class="bm-inp" type="text" data-sve-build-aria @input="ariaBox.input" @keydown.enter.prevent="ariaBox.done" @blur="ariaBox.done" />
        </label>
      </div>
    </div>

    <div v-if="richField !== null" class="bm-text" data-sve-build-rich-field>
      <span class="fg-lab">{{ port.t('content_rich') }}</span>
      <div class="bm-text-box">
        <input
          v-model="richFieldBox.value.value"
          class="bm-inp"
          type="text"
          spellcheck="false"
          :aria-label="port.t('content_rich')"
          @input="richFieldBox.input"
          @keydown.enter.prevent="richFieldDone"
          @blur="richFieldDone"
        />
        <BuildPickField @pick="pickRich" />
      </div>
    </div>

    <div v-if="rich" class="bm-text" data-sve-build-rich>
      <template v-if="!statamic">
        <span class="fg-lab">{{ port.t('content_rich') }}</span>
        <div class="bm-text-box">
          <textarea
            v-model="richBox.value.value"
            rows="6"
            spellcheck="false"
            data-sve-build-rich-html
            @input="richBox.input"
            @blur="richBox.done"
          ></textarea>
          <BuildPickField @pick="pickRich" />
        </div>
      </template>
      <div v-else ref="host" class="bm-field-host" data-sve-build-field></div>
    </div>

    <div v-if="svg" class="bm-text" data-sve-build-svg-content>
      <span class="fg-lab">{{ port.t('content_svg') }}</span>
      <p v-if="node.dynamic" class="bm-note is-top" data-sve-build-svg-field v-html="port.t('content_svg_field', { src: `<code>${esc(node.src)}</code>` })"></p>
      <template v-else>
        <p class="bm-note is-top" v-html="port.t('content_svg_now', { src: `<code>${esc(node.src)}</code>` })"></p>
        <BuildSvgPicker :current="node.src" @pick="(src) => port.setSvgAt(path, src)" />
      </template>
    </div>

    <div v-if="nothing" class="bm-empty" data-sve-build-content-soon>
      <span v-html="ic('form')"></span>
      <p>{{ port.t(layout ? 'content_layout' : 'content_soon') }}</p>
    </div>
  </div>
</template>
