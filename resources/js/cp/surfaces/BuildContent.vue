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
 * in Content mode. A heading or a link is one line (an input); other text gets a
 * taller box, which grows with it, and Enter writes the `<br>` it means.
 *
 * Rich text and an image's, a video's or a link's address are the Control Panel's
 * field until the data icon beside its label picks a field of theirs: then a box
 * shows the tag, and emptying it brings the field back. An image or a video has
 * a button to take its file away, as the asset field's own shows only on a hover.
 * A link also has its target, rel and aria-label.
 *
 * Text and layout have their tag on top (build-mode/tags.js), as in Bricks.
 *
 * What is not the element's own says whose it is: the elements inside it, or —
 * for a div or a section — nothing, as a layout has no text of its own.
 */
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue';
import BuildSvgPicker from './BuildSvgPicker.vue';
import { tagFamily } from '../../lib/tag-families.js';
import { statamicTranslate } from '../../lib/i18n.js';
import BuildPickField from './BuildPickField.vue';
import BuildEditable from './BuildEditable.vue';
import { ic } from '../../build-mode/icons.js';
import { ADDRESS, altFromAsset } from '../../build-mode/attrs.js';
import { halfTag, isOneLine } from '../../build-mode/text.js';
import { tagChoices } from '../../build-mode/tags.js';
import { TEXT_FIELDS, wholeTag, withoutFields } from '../../data-var-types.js';

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
 * where every keystroke on the way is half a tag). `typing` says the box is
 * being typed in: what is drawn from the file must not take the box away from
 * under the caret while the file holds only a keystroke's worth of it.
 */
function typed(fromFile, write, { live = true } = {}) {
  const value = ref(fromFile.value ?? '');
  const typing = ref(false);
  let frame = 0;
  const flush = () => {
    frame = 0;
    write(value.value);
  };

  watch(fromFile, (next) => {
    if (!typing.value && next !== null) {
      value.value = next;
    }
  });

  return {
    value,
    typing,
    input() {
      typing.value = true;

      if (live && !frame) {
        frame = window.requestAnimationFrame(flush);
      }
    },
    /** Typing over: what is still on its way is written, and the box reads the file again. */
    done() {
      if (frame) {
        window.cancelAnimationFrame(frame);
        flush();
      } else if (!live && typing.value) {
        flush();
      }

      typing.value = false;

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
function refuseWrong(value, types, clear, options) {
  port.wrongFields(path, value, types, options).then((wrong) => {
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
    port.syncFieldEdit(path, expression, { types: TEXT_FIELDS });
  });
}

function textDone() {
  text.done();

  const now = read.value?.text;

  refuseWrong(now, TEXT_FIELDS, (wrong) => port.setText(path, withoutFields(now, wrong)));
  port.syncFieldEdit(path, now, { types: TEXT_FIELDS });
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

/* An address can be a field's: a link's a link field, an image's an asset field of one file. */
const isLink = tag.value === 'a';
const addressFields = isLink ? ['link'] : ['assets'];
const addressOne = { single: !isLink };
/* The list offers those; typed by hand an address is a string, so it prints a text field too: href="{{ url }}", href="mailto:{{ email }}". */
const addressTakes = [...addressFields, ...TEXT_FIELDS];
const fieldKey = ref(0);

function pickAddress(anchor) {
  port.pickField(
    anchor,
    path,
    addressFields,
    (expression) => {
      addressBox.done();
      refused.value = '';
      writeAddress(expression);
      port.syncFieldEdit(path, expression, { types: addressFields, inline: false });
    },
    addressOne
  );
}

function addressDone() {
  addressBox.done();

  if (address) {
    const now = addressNow.value;

    refuseWrong(now, addressTakes, (wrong) => writeAddress(withoutFields(now, wrong)), addressOne);
    port.syncFieldEdit(path, now, { types: addressFields, inline: false });
  }
}

/** The image or video taken away; the field opens again, empty. */
function removeFile() {
  addressBox.done();
  writeAddress('');
  port.syncFieldEdit(path, '', { types: addressFields, inline: false });
  fieldKey.value += 1;
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
    port.syncFieldEdit(path, expression, { types: RICH_FIELDS });
  });
}

const richFieldBox = typed(richField, (value) => port.setRichField(path, value), { live: false });

function richFieldDone() {
  richFieldBox.done();

  const now = richField.value;

  refuseWrong(now, RICH_FIELDS, () => port.setRichField(path, ''));
  port.syncFieldEdit(path, now, { types: RICH_FIELDS });
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
let stopWaiting = null;

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
          pick: address ? pickAddress : pickRich,
          pickTitle: port.t('content_field_pick'),
          paint: address ? null : (markup) => port.paintRich(path, markup),
        })
      : null;
  },
  { flush: 'post' }
);

/*
 * The canvas asked for this element's file (port.askBrowse): the field's own
 * Browse button, once the field has drawn it. Statamic prints the words through
 * its translator, and two buttons of which one shows at the field's width.
 */
function browseButton(el) {
  const words = [statamicTranslate('Browse Assets'), statamicTranslate('Browse')];

  return [...el.querySelectorAll('button')].find((button) => button.offsetParent && words.includes(button.textContent.trim()));
}

watch(
  [host, () => port.browse?.value],
  ([el, wanted]) => {
    stopWaiting?.();
    stopWaiting = null;

    if (!el || !wanted || wanted !== path) {
      return;
    }

    const open = () => {
      const button = browseButton(el);

      if (!button) {
        return false;
      }

      port.askBrowse('');
      button.click();

      return true;
    };

    if (!open()) {
      const observer = new MutationObserver(open);

      observer.observe(el, { childList: true, subtree: true });
      stopWaiting = () => observer.disconnect();
    }
  },
  { flush: 'post' }
);

/* ---------------- editable in Edit Content ---------------- */

const canMake = !!port.canMakeField?.(path);
const ownFields = ref([]);
const loadOwn = () => {
  if (canMake) {
    port.sectionFieldNames(path).then((names) => {
      ownFields.value = names;
    });
  }
};

loadOwn();

/** The field of this section a value is, whole; '' when it is the element's own, or something else's. */
const ownOf = (value) => {
  const name = wholeTag(value ?? '');

  return name && ownFields.value.includes(name) ? name : '';
};
const isOwnText = (value) => !String(value ?? '').includes('{{');
const SUGGEST = { img: 'image', video: 'video', a: 'link' };
const textSuggest = computed(() => (/^h[1-6]$/.test(tag.value) ? 'heading' : tag.value === 'a' ? 'link_text' : 'text'));

function textMade(handle) {
  const tagText = `{{ ${handle} }}`;

  loadOwn();
  text.done();
  port.setText(path, tagText);
  port.syncFieldEdit(path, tagText, { types: TEXT_FIELDS });
}

/*
 * Off writes what the canvas shows back as the element's own. Nothing shown
 * yet (null: the canvas has not got it, or an island inside still waits for
 * the real preview) writes nothing, and the switch stays on.
 */
function textOff() {
  const words = port.shownAt(path);

  if (words === null) {
    return;
  }

  text.done();
  port.setText(path, words);
  port.syncFieldEdit(path, words, { types: TEXT_FIELDS });
}

function addressMade(handle) {
  const tagText = `{{ ${handle} }}`;

  loadOwn();
  addressBox.done();
  writeAddress(tagText);
  port.syncFieldEdit(path, tagText, { types: addressFields, inline: false });
}

function addressOff() {
  const url = port.shownAt(path, address.attr);

  if (url === null) {
    return;
  }

  addressBox.done();
  writeAddress(url);
  port.syncFieldEdit(path, url, { types: addressFields, inline: false });
  fieldKey.value += 1;
}

function richMade(handle) {
  const tagText = `{{ ${handle} }}`;

  loadOwn();
  richBox.done();
  port.setRichField(path, tagText);
  port.syncFieldEdit(path, tagText, { types: RICH_FIELDS });
}

function richOff() {
  const markup = port.shownAt(path, 'html');

  if (markup === null) {
    return;
  }

  richFieldBox.done();
  port.setRichField(path, '');
  port.setRichAt(path, markup);
  port.syncFieldEdit(path, '', { types: RICH_FIELDS });
}

const nothing = computed(() => !svg && !read.value && !address && !rich.value && richField.value === null);
/* Rich text is a div by what it is, and a Grid's columns are divs for the Grid to stay one. */
const tags = computed(() =>
  rich.value || richField.value !== null || ['column', 'columns'].includes(props.node.kind) ? [] : tagChoices(tag.value)
);
const layout = computed(() => tagFamily(tag.value) === 'layout');

onBeforeUnmount(() => {
  text.done();
  addressBox.done();
  richBox.done();
  richFieldBox.done();
  relBox.done();
  ariaBox.done();
  stopWaiting?.();
  unmountField?.();
  unmountField = null;
});
</script>

<template>
  <div class="bm-content">
    <div v-if="tags.length" class="fg-row" data-sve-build-tag>
      <span class="fg-rlab">tag</span>
      <label class="fg-field">
        <select class="fg-select" aria-label="tag" :value="tag" @change="port.setTag($event.target.value)">
          <option v-for="name in tags" :key="name" :value="name">{{ name }}</option>
        </select>
      </label>
    </div>
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
          rows="4"
          spellcheck="true"
          :placeholder="port.t('content_text_placeholder')"
          data-sve-build-text
          @input="text.input(); refused = ''"
          @keydown.enter.prevent="lineBreak"
          @blur="textDone"
        ></textarea>
        <BuildPickField @pick="pickText" />
      </div>
      <BuildEditable
        v-if="canMake && (isOwnText(read.text) || ownOf(read.text))"
        :path="path"
        :kind="oneLine ? 'text' : 'textarea'"
        :suggest="textSuggest"
        :value="read.text"
        :own="ownOf(read.text)"
        @made="textMade"
        @off="textOff"
      />
    </div>
    <p v-else-if="read?.kind === 'markup'" class="bm-note is-top" data-sve-build-text-markup>{{ port.t('content_markup') }}</p>

    <div v-if="address" class="bm-text" :data-sve-build-address="address.attr">
      <!-- The box stays while it is typed in: a tag's first `{` is in the file before the tag is. -->
      <template v-if="addressExpr || !statamic || addressBox.typing.value">
        <span class="fg-lab">{{ port.t(`content_${tag}`) }}</span>
        <div class="bm-text-box">
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
          <BuildPickField @pick="pickAddress" />
        </div>
      </template>
      <div v-else :key="fieldKey" ref="host" class="bm-field-host" data-sve-build-field></div>
      <button v-if="address.attr === 'src' && addressNow && !addressExpr && !addressBox.typing.value" type="button" class="bm-remove-file" data-sve-build-remove-file @click="removeFile">
        <span v-html="ic('trash')"></span>{{ port.t(`content_remove_${tag}`) }}
      </button>
      <p v-if="address.alt" class="bm-note is-top" data-sve-build-alt-note>{{ port.t('content_alt_note') }}</p>
      <BuildEditable
        v-if="canMake && (isOwnText(addressNow) || ownOf(addressNow))"
        :path="path"
        :kind="isLink ? 'link' : 'assets'"
        :suggest="SUGGEST[tag]"
        :value="addressNow || ''"
        :own="ownOf(addressNow)"
        @made="addressMade"
        @off="addressOff"
      />
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
      <BuildEditable
        v-if="canMake && ownOf(richField)"
        :path="path"
        kind="bard"
        suggest="rich_text"
        :own="ownOf(richField)"
        @off="richOff"
      />
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
      <BuildEditable v-if="canMake" :path="path" kind="bard" suggest="rich_text" :value="richNow || ''" @made="richMade" />
    </div>

    <div v-if="svg" class="bm-text" data-sve-build-svg-content>
      <span class="fg-lab">{{ port.t('content_svg') }}</span>
      <p v-if="node.dynamic" class="bm-note is-top" data-sve-build-svg-field v-html="port.t('content_svg_field', { src: `<code>${esc(node.src)}</code>` })"></p>
      <template v-else>
        <p class="bm-note is-top" v-html="port.t('content_svg_now', { src: `<code>${esc(node.src)}</code>` })"></p>
        <BuildSvgPicker :current="node.src" @pick="(src) => port.setSvgAt(path, src)" />
      </template>
    </div>

    <p v-if="refused" class="bm-note is-top" data-sve-build-field-refused>{{ refused }}</p>

    <div v-if="nothing" class="bm-empty" data-sve-build-content-soon>
      <span v-html="ic('form')"></span>
      <p>{{ port.t(layout ? 'content_layout' : 'content_soon') }}</p>
    </div>
  </div>
</template>
