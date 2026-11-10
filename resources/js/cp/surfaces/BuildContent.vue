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
 * Text in a section is its section's own content (BuildOwn.vue): every section
 * of a type renders the one file, so the first change made here to an
 * element's own words makes them a field of the section (port.makeOwn), kept
 * out of Edit Content, and the box writes this section's value from then on.
 * "Editable in Edit Content" shows that field to a content editor.
 *
 * Rich text and an image's, a video's or a link's address are the Control Panel's
 * field until the data icon beside its label picks a field of theirs: then a box
 * shows the tag, and emptying it brings the field back. An image or a video has
 * a button to take its file away, as the asset field's own shows only on a hover.
 * A link also has its target, rel and aria-label; an image its size, format,
 * blur and loading (BuildImage.vue); a video its shape, playing, preload and
 * poster (BuildVideo.vue).
 *
 * Every tag has its tag on top, as in Bricks: the tag menu of the HTML tree (tw-classes.js,
 * lib/tag-choices.js) — what it may become, and Custom. Rich text and a Grid's columns show theirs.
 * Every tag has its data and accessibility attributes at the bottom (BuildAttrs.vue).
 *
 * What is not the element's own says whose it is: the elements inside it, or —
 * for a div or a section — nothing, as a layout has no text of its own. A
 * Container has its width (BuildContainerWidth.vue) on top instead.
 */
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue';
import BuildContainerWidth from './BuildContainerWidth.vue';
import BuildSvgPicker from './BuildSvgPicker.vue';
import { tagFamily } from '../../lib/tag-families.js';
import { browseButton } from '../../lib/browse-button.js';
import BuildPickField from './BuildPickField.vue';
import BuildEditable from './BuildEditable.vue';
import BuildOwn from './BuildOwn.vue';
import BuildAttrs from './BuildAttrs.vue';
import BuildImage from './BuildImage.vue';
import BuildVideo from './BuildVideo.vue';
import { typed } from './build-typed.js';
import { ic } from '../../build-mode/icons.js';
import { ADDRESS, altFromAsset, readAttribute } from '../../build-mode/attrs.js';
import { imageAt } from '../../build-mode/image.js';
import { posterOnNewFile } from '../../build-mode/video.js';
import { siteImageOptions } from '../../build-mode/site-images.js';
import { findByPath } from '../../build-mode/place.js';
import { parseTemplateTree } from '../../html-tree-parse.js';
import { fieldNameFor, halfTag, isOneLine } from '../../build-mode/text.js';
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

/* ---------------- the text ---------------- */

const read = computed(() => (port.rev.value, svg ? null : port.text()));
/** The fields of this section, by name (`port.sectionFieldNames`): what makes a tag in an element its own. */
const ownFields = ref([]);
/** The section's fields kept out of Edit Content: its own content (BuildOwn.vue). */
const hiddenFields = ref([]);
/** The field of this section a value is, whole; '' when it is the element's own, or something else's. */
const ownOf = (value) => {
  const name = wholeTag(value ?? '');

  return name && ownFields.value.includes(name) ? name : '';
};
const isOwnText = (value) => !String(value ?? '').includes('{{');
/** The field of this section the text is, whole; '' for words of the file's own. */
const textField = computed(() => (read.value?.kind === 'text' ? ownOf(read.value.text) : ''));
/** The text is the section's own content, kept out of Edit Content: the box writes this section's value. */
const textHidden = computed(() => !!textField.value && hiddenFields.value.includes(textField.value));
/** Own content on its way for the first change typed here, and the words typed since: they go into it when it lands. */
let owningText = null;
let owningWords = '';
/**
 * What the element held when this round of typing began. Only words that were
 * the element's own before it become its section's own: typing words over a
 * field (`{{ title }}` → "Our team") writes them into the file for the whole
 * round, as before — else its first keystroke, written there, would be the
 * own words the second one made a field of.
 */
let textBase = '';

function textInput() {
  if (!text.typing.value) {
    textBase = read.value?.text ?? '';
  }

  text.input();
  refused.value = '';
}
const text = typed(
  computed(() => {
    if (read.value?.kind !== 'text') {
      return null;
    }

    if (textHidden.value) {
      const value = port.sectionValue(textField.value);

      return typeof value === 'string' ? value : '';
    }

    return read.value.text;
  }),
  (value) => writeText(value)
);
const oneLine = isOneLine(tag.value);
const refused = ref('');

/**
 * The box's words where they belong: this section's own field, the file — or,
 * for the file's own words in a section that can hold them, a field made for
 * them on this first change (port.makeOwn). Nothing is written while it is on
 * its way; when it lands, what the box holds by then is this section's value.
 */
function writeText(value) {
  if (textHidden.value) {
    port.setSectionValue(textField.value, value);

    return;
  }

  // Kept here, not read off the box: the box reads the file again when it
  // loses focus (typed.js `done`), and the field may land after that.
  // The canvas shows the words meanwhile: nothing it paints from is written yet.
  if (owningText) {
    owningWords = value;
    port.paintWords(path, value);

    return;
  }

  if (!canOwnHere || !isOwnText(textBase) || !isOwnText(read.value?.text) || value === read.value?.text) {
    port.setText(path, value);

    return;
  }

  owningWords = value;
  port.paintWords(path, value);
  owningText = port.makeOwn(path, { value: () => owningWords }).then((handle) => {
    owningText = null;

    if (handle) {
      ownLanded(handle);
      port.setSectionValue(handle, owningWords);
    } else {
      port.setText(path, owningWords);
    }
  });
}

/**
 * A field made for own content: known at once as the section's and as hidden,
 * so the box reads its value and the next keystroke goes into it. Until the
 * lists are read again it would be neither: the box would show the tag, and a
 * keystroke would write the words over it in the file — and the one after that
 * would make a second field of them.
 */
function ownLanded(handle) {
  if (!hiddenFields.value.includes(handle)) {
    hiddenFields.value = [...hiddenFields.value, handle];
  }

  fieldKnown(handle);
}

/**
 * A field made a moment ago, known as the section's at once: until the lists
 * are read again the element's tag would be no field of its own, and the
 * switches under it would step away for that while.
 */
function fieldKnown(handle) {
  if (!ownFields.value.includes(handle)) {
    ownFields.value = [...ownFields.value, handle];
  }

  loadOwn();
}

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
  textInput();
}

/* ---------------- the address: src, href ---------------- */

/*
 * A `<picture>` or one of its `<source>`s is its image's: Content shows the
 * `<img>` inside — its file, and its options (BuildImage.vue) — and writes there.
 */
const imageNode = ['picture', 'source'].includes(tag.value) ? imageAt(parseTemplateTree(port.html()), path)?.img || null : null;
const addressTag = imageNode ? 'img' : tag.value;
const addressPath = imageNode?.path || path;
const imageOptions = addressTag === 'img' && !!siteImageOptions(window);
const address = ADDRESS[addressTag] || null;
const addressNow = computed(() => {
  port.rev.value;

  if (!address) {
    return null;
  }

  const value = addressPath === path ? port.attr(address.attr) : readAttribute(port.html(), findByPath(parseTemplateTree(port.html()), addressPath), address.attr);

  return value ?? '';
});
const addressExpr = computed(() => ANTLERS.exec(addressNow.value || '')?.[0] || '');
/** The field of this section the address is, whole; '' for an address of the file's own. */
const addressField = computed(() => (address ? ownOf(addressNow.value) : ''));
/** The address is the section's own content, kept out of Edit Content: the field edits this section's value. */
const addressHidden = computed(() => !!addressField.value && hiddenFields.value.includes(addressField.value));

/** A video's poster with its file (video.js): the frame follows the file, a first file brings it. */
const videoPosters = addressTag === 'video' && !!window.Statamic?.$config?.get?.('sveVideoPoster');

/** The address written — an image's alt with it, read off the asset it now points at; a video's poster with it. */
function writeAddress(value) {
  if (halfTag(value)) {
    return;
  }

  const attrs = address.alt ? { [address.attr]: value, alt: altFromAsset(value) } : { [address.attr]: value };

  if (videoPosters) {
    const poster = posterOnNewFile(value, addressNow.value, port.attr('poster'));

    if (poster !== undefined) {
      attrs.poster = poster;
    }
  }

  port.setAttrsAt(addressPath, attrs);
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
    addressPath,
    addressFields,
    (expression) => {
      addressBox.done();
      refused.value = '';
      writeAddress(expression);
      port.syncFieldEdit(addressPath, expression, { types: addressFields, inline: false });
    },
    addressOne
  );
}

function addressDone() {
  addressBox.done();

  if (address) {
    const now = addressNow.value;

    refuseWrong(now, addressTakes, (wrong) => writeAddress(withoutFields(now, wrong)), addressOne);
    port.syncFieldEdit(addressPath, now, { types: addressFields, inline: false });
  }
}

/** The image or video taken away; the field opens again, empty. Own content: this section's alone. */
function removeFile() {
  if (addressHidden.value) {
    port.setSectionValue(addressField.value, []);
    fieldKey.value += 1;

    return;
  }

  addressBox.done();
  writeAddress('');
  port.syncFieldEdit(addressPath, '', { types: addressFields, inline: false });
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
/** The field of this section the rich text is, whole; '' when it is HTML of the file's own. */
const richName = computed(() => (richField.value !== null ? ownOf(richField.value) : ''));
/** The rich text is the section's own content, kept out of Edit Content: Bard edits this section's value. */
const richHidden = computed(() => !!richName.value && hiddenFields.value.includes(richName.value));

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

const kind = address ? addressTag : 'rich';
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
          // Own content opens on this section's value, as the fieldtype holds it.
          ...(ownHandle() ? { native: port.sectionValue(ownHandle()) ?? null } : {}),
          writeRaw: writeOwnRaw,
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
 * Browse button (lib/browse-button.js), once the field has drawn it.
 */
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

/*
 * Two questions. Own content (a section's hidden field, made on the first
 * change) is a section's alone. "Editable in Edit Content" is a section's and a
 * template's too — a cases template, an own page — and a template's answer is
 * the server's, so it is a computed that answers again when that lands.
 */
const canOwnHere = !!port.canOwnContent?.(path);
const canOwnAddress = addressPath === path ? canOwnHere : !!port.canOwnContent?.(addressPath);
const canMake = computed(() => !!port.canMakeField?.(path));
const canMakeAddress = computed(() => (addressPath === path ? canMake.value : !!port.canMakeField?.(addressPath)));
/** Which read of the lists is the latest: one sent before a field was made must not take it away again. */
let ownRead = 0;

function loadOwn() {
  if (!canMake.value) {
    return;
  }

  const mine = ++ownRead;

  port.sectionFieldLists(path).then(({ names, hidden }) => {
    if (mine === ownRead) {
      ownFields.value = names;
      hiddenFields.value = hidden;
    }
  });
}

loadOwn();
// A template's answer lands after the panel is drawn: its fields are read then.
watch(canMake, (now) => {
  if (now) {
    loadOwn();
  }
});

// A field this list has not heard of: one made a moment ago somewhere else —
// typing on the canvas makes the section's own field (canvas-edit.js), and
// the dock's undo can put back a tag. The lists are read again, so the box
// shows the field's value and the switches stand as they are.
watch(
  () => wholeTag(read.value?.text ?? ''),
  (name) => {
    if (name && !ownFields.value.includes(name)) {
      loadOwn();
    }
  }
);

const SUGGEST = { img: 'image', video: 'video', a: 'link' };
const textSuggest = computed(() => fieldNameFor(tag.value));
const owningSwitch = ref(false);

/** "Own content in each section" on: the words become the section's own, as they stand. */
function ownOn() {
  owningSwitch.value = true;
  text.done();
  port.makeOwn(path).then((handle) => {
    owningSwitch.value = false;

    if (handle) {
      ownLanded(handle);
    }
  });
}

/** "Editable in Edit Content" on own content: the field is shown, and the element gets its `visual_edit`. */
function textShown(handle) {
  hiddenFields.value = hiddenFields.value.filter((name) => name !== handle);
  loadOwn();
  text.done();
  port.syncFieldEdit(path, `{{ ${handle} }}`, { types: TEXT_FIELDS });
}

/**
 * "Editable in Edit Content" off: the field is kept out of Edit Content again
 * and the content stays this section's own. A field the section's own
 * fieldset does not hold (one picked from the data icon, an imported one)
 * cannot be hidden: its words go back into the file, as before.
 */
function textEditableOff() {
  const handle = textField.value;

  port.setFieldHidden(handle, true).then((hidden) => {
    if (!hidden) {
      textOff();

      return;
    }

    ownLanded(handle);
    text.done();
    port.syncFieldEdit(path, `{{ ${handle} }}`, { types: TEXT_FIELDS });
  });
}

function textMade(handle) {
  const tagText = `{{ ${handle} }}`;

  fieldKnown(handle);
  text.done();
  port.setText(path, tagText);
  port.syncFieldEdit(path, tagText, { types: TEXT_FIELDS });
}

/*
 * Off writes what the canvas shows back as the element's own. Nothing shown
 * yet (null: the canvas has not got it, or an island inside still waits for
 * the real preview) writes nothing, and the switch stays on. Own content's
 * hidden field then leaves the fieldset (dropOwn).
 */
function textOff() {
  const words = port.shownAt(path);

  if (words === null) {
    return;
  }

  const own = textHidden.value ? textField.value : '';

  text.done();
  port.setText(path, words);
  port.syncFieldEdit(path, words, { types: TEXT_FIELDS });
  dropOwn(own);
}

/**
 * "Own content in each section" off: the hidden field it was is taken out of
 * the section's fieldset once the file no longer reads it (port.dropOwnField).
 * A field shown in Edit Content is not own content, and stays.
 */
function dropOwn(field) {
  if (field) {
    port.dropOwnField(field).then((gone) => {
      if (gone) {
        loadOwn();
      }
    });
  }
}

/* ---------------- own content: an address, rich text ---------------- */

/** The hidden field the address or rich text is now — this section's own content — or ''. */
function ownHandle() {
  if (address) {
    return addressHidden.value ? addressField.value : '';
  }

  return richHidden.value ? richName.value : '';
}

/** A field on its way for the first change, the field's value meanwhile, and whether one could not be made here. */
let owningField = null;
let owningRaw = null;
let ownRefused = false;

/** Whether the element's address or rich text is the file's own, in a section that can hold it as its own. */
function canOwn() {
  if (ownRefused) {
    return false;
  }

  return address ? canOwnAddress && isOwnText(addressNow.value) : canOwnHere && rich.value !== null;
}

/**
 * A field of the section for the address or rich text, hidden, what the file
 * holds now its default — so every other section of the type goes on showing
 * it. Known at once (ownLanded); the tag is the caller's to write.
 */
function makeOwnField() {
  return port
    .makeField(address ? addressPath : path, {
      kind: address ? (isLink ? 'link' : 'assets') : 'bard',
      name: address ? SUGGEST[addressTag] : 'rich_text',
      value: (address ? addressNow.value : richNow.value) || '',
      hidden: true,
    })
    .then((handle) => {
      if (handle) {
        ownLanded(handle);
      }

      return handle;
    });
}

/** The tag in the file where the address or rich text was: `src="{{ image }}"` with its alt, a block of `{{ rich_text }}`. */
function writeOwnTag(handle) {
  const tagText = `{{ ${handle} }}`;

  if (address) {
    addressBox.done();
    writeAddress(tagText);
  } else {
    richBox.done();
    port.setRichField(path, tagText);
  }
}

/**
 * The mounted field's own value (element-fields.js `writeRaw`) — an asset's
 * id, `entry::…`, Bard's nodes. Own content takes it as this section's value.
 * The first change to an address or rich text of the file's own makes its
 * field first: the value goes in when it lands, the tag after it. A section
 * that cannot hold it (an image that is no asset has no default to keep)
 * answers false, and the change goes into the file as before.
 *
 * @returns {boolean|Promise<boolean>} taken
 */
function writeOwnRaw(raw) {
  const handle = ownHandle();

  if (handle) {
    port.setSectionValue(handle, raw);

    return true;
  }

  if (owningField) {
    owningRaw = raw;

    return owningField;
  }

  if (!canOwn()) {
    return false;
  }

  owningRaw = raw;
  owningField = makeOwnField().then((made) => {
    owningField = null;

    if (!made) {
      ownRefused = true;

      return false;
    }

    port.setSectionValue(made, owningRaw);
    writeOwnTag(made);

    return true;
  });

  return owningField;
}

/** "Own content in each section" on, for the address or rich text: as it stands, the section's own. */
function fieldOwnOn() {
  owningSwitch.value = true;
  makeOwnField().then((handle) => {
    owningSwitch.value = false;

    if (handle) {
      writeOwnTag(handle);
      fieldKey.value += 1;
    }
  });
}

/**
 * "Own content in each section" off: this section's value goes back into the
 * file as the element's own — the asset's URL, the link's address, Bard's
 * HTML, converted as the field writes them — the same in every section again.
 * Own content's hidden field then leaves the fieldset (dropOwn).
 */
function fieldOwnOff() {
  const handle = address ? addressField.value : richName.value;
  const own = (address ? addressHidden.value : richHidden.value) ? handle : '';

  port.fieldParam(address ? addressTag : 'rich', port.sectionValue(handle) ?? null).then((value) => {
    if (value === null) {
      return;
    }

    if (address) {
      addressBox.done();
      writeAddress(value);
      port.syncFieldEdit(addressPath, value, { types: addressFields, inline: false });
    } else {
      richFieldBox.done();
      port.setRichField(path, '');
      port.setRichAt(path, value.replace(/&#39;/g, "'"));
      port.syncFieldEdit(path, '', { types: RICH_FIELDS });
    }

    fieldKey.value += 1;
    dropOwn(own);
  });
}

/** "Editable in Edit Content" on own content: the field is shown, and the element gets its `visual_edit`. */
function fieldShown(handle) {
  hiddenFields.value = hiddenFields.value.filter((name) => name !== handle);
  loadOwn();

  if (address) {
    port.syncFieldEdit(addressPath, `{{ ${handle} }}`, { types: addressFields, inline: false });
  } else {
    port.syncFieldEdit(path, `{{ ${handle} }}`, { types: RICH_FIELDS });
  }

  fieldKey.value += 1;
}

/** "Editable in Edit Content" off: hidden again, the content still the section's own; a field it cannot hide goes back into the file. */
function fieldEditableOff() {
  const handle = address ? addressField.value : richName.value;

  port.setFieldHidden(handle, true).then((hidden) => {
    if (!hidden) {
      if (address) {
        addressOff();
      } else {
        richOff();
      }

      return;
    }

    ownLanded(handle);

    if (address) {
      port.syncFieldEdit(addressPath, `{{ ${handle} }}`, { types: addressFields, inline: false });
    } else {
      port.syncFieldEdit(path, `{{ ${handle} }}`, { types: RICH_FIELDS });
    }

    fieldKey.value += 1;
  });
}

function addressMade(handle) {
  const tagText = `{{ ${handle} }}`;

  fieldKnown(handle);
  addressBox.done();
  writeAddress(tagText);
  port.syncFieldEdit(addressPath, tagText, { types: addressFields, inline: false });
}

function addressOff() {
  const url = port.shownAt(addressPath, address.attr);

  if (url === null) {
    return;
  }

  addressBox.done();
  writeAddress(url);
  port.syncFieldEdit(addressPath, url, { types: addressFields, inline: false });
  fieldKey.value += 1;
}

function richMade(handle) {
  const tagText = `{{ ${handle} }}`;

  fieldKnown(handle);
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

const container = props.node.kind === 'container';
const nothing = computed(() => !svg && !container && !read.value && !address && !rich.value && richField.value === null);
/* Rich text is a div by what it is, and a Grid's columns are divs for the Grid to stay one: their tag is shown, not changed. */
const tagLocked = computed(() => !!rich.value || richField.value !== null || ['column', 'columns'].includes(props.node.kind));
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
    <BuildContainerWidth v-if="container" />
    <div v-if="!svg && tag" class="fg-row" data-sve-build-tag>
      <span class="fg-rlab">tag</span>
      <div class="fg-field">
        <span v-if="tagLocked" class="bm-tag-now is-locked" data-sve-build-tag-locked>{{ tag }}</span>
        <button v-else type="button" class="fg-select bm-tag-now" aria-label="tag" aria-haspopup="listbox" data-sve-build-tag-open @click="port.openTagMenu($event.currentTarget)">{{ tag }}</button>
      </div>
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
          @input="textInput"
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
          @input="textInput"
          @keydown.enter.prevent="lineBreak"
          @blur="textDone"
        ></textarea>
        <BuildPickField @pick="pickText" />
      </div>
      <BuildOwn
        v-if="canOwnHere && (isOwnText(read.text) || textField)"
        :on="!!textField"
        :busy="owningSwitch"
        @on="ownOn"
        @off="textOff"
      />
      <BuildEditable
        v-if="canMake && (isOwnText(read.text) || textField)"
        :path="path"
        :kind="oneLine ? 'text' : 'textarea'"
        :suggest="textSuggest"
        :value="read.text"
        :own="textHidden ? '' : textField"
        :hidden="textHidden ? textField : ''"
        @made="textMade"
        @shown="textShown"
        @off="textEditableOff"
      />
    </div>
    <p v-else-if="read?.kind === 'markup'" class="bm-note is-top" data-sve-build-text-markup>{{ port.t('content_markup') }}</p>

    <div v-if="address" class="bm-text" :data-sve-build-address="address.attr">
      <!-- The box stays while it is typed in: a tag's first `{` is in the file before the tag is. -->
      <!-- Own content (a hidden field) is edited in the field, on this section's value. -->
      <template v-if="(addressExpr && !addressHidden) || !statamic || addressBox.typing.value">
        <span class="fg-lab">{{ port.t(`content_${addressTag}`) }}</span>
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
      <button v-if="address.attr === 'src' && ((addressNow && !addressExpr) || addressHidden) && !addressBox.typing.value" type="button" class="bm-remove-file" data-sve-build-remove-file @click="removeFile">
        <span v-html="ic('trash')"></span>{{ port.t(`content_remove_${addressTag}`) }}
      </button>
      <p v-if="address.alt" class="bm-note is-top" data-sve-build-alt-note>{{ port.t('content_alt_note') }}</p>
      <BuildOwn
        v-if="canOwnAddress && (isOwnText(addressNow) || addressField)"
        :on="!!addressField"
        :busy="owningSwitch"
        @on="fieldOwnOn"
        @off="fieldOwnOff"
      />
      <BuildEditable
        v-if="canMakeAddress && (isOwnText(addressNow) || addressField)"
        :path="addressPath"
        :kind="isLink ? 'link' : 'assets'"
        :suggest="SUGGEST[addressTag]"
        :value="addressNow || ''"
        :own="addressHidden ? '' : addressField"
        :hidden="addressHidden ? addressField : ''"
        @made="addressMade"
        @shown="fieldShown"
        @off="fieldEditableOff"
      />
      <BuildImage v-if="imageOptions" :path="path" />
      <BuildVideo v-if="addressTag === 'video'" :path="path" />
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

    <div v-if="richField !== null && !richHidden" class="bm-text" data-sve-build-rich-field>
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
      <BuildOwn v-if="canOwnHere && richName" :on="true" :busy="owningSwitch" @off="fieldOwnOff" />
      <BuildEditable
        v-if="canMake && richName"
        :path="path"
        kind="bard"
        suggest="rich_text"
        :own="richName"
        @off="fieldEditableOff"
      />
    </div>

    <!-- Rich text of the file's own, or the section's own (a hidden field): one Bard, kept as the one becomes the other. -->
    <div v-if="rich || richHidden" class="bm-text" data-sve-build-rich>
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
      <div v-else :id="richHidden ? port.fieldElementId(richName) || null : null" :key="fieldKey" ref="host" class="bm-field-host" data-sve-build-field></div>
      <BuildOwn v-if="canOwnHere" :on="richHidden" :busy="owningSwitch" @on="fieldOwnOn" @off="fieldOwnOff" />
      <BuildEditable
        v-if="canMake"
        :path="path"
        kind="bard"
        suggest="rich_text"
        :value="richNow || ''"
        :hidden="richHidden ? richName : ''"
        @made="richMade"
        @shown="fieldShown"
      />
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

    <div v-if="nothing" class="bm-empty is-compact" data-sve-build-content-soon>
      <span v-html="ic('form')"></span>
      <p>{{ port.t(layout ? 'content_layout' : 'content_soon') }}</p>
    </div>

    <BuildAttrs v-if="!svg" :path="path" :tag="tag" />
  </div>
</template>
