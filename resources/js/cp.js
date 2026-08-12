// Control Panel script — handles postMessage routing from the Live Preview iframe.

export const SELECTORS = {
  visualIdInput: '[data-visual-id]',
  replicatorSet: '[data-replicator-set]',
  // Bard sets are Tiptap node views; Statamic 6 renders them with [data-node-view-wrapper].
  // There is no [data-bard-set] attribute in the actual CP DOM.
  bardSet: '[data-node-view-wrapper]',
  // Grid rows are stamped with [data-grid-row] by stampGridRows() — they have no
  // native Statamic attribute. Detection relies on the structural pattern: a
  // parent element whose direct <header> child contains a [data-drag-handle] button.
  gridRow: '[data-grid-row]',
  anySet: '[data-replicator-set], [data-node-view-wrapper], [data-grid-row]',
  // Actual toggle: a <button type="button"> that is a direct child of the <header>
  // inside the set. Neither .replicator-set-header nor .bard-set-header exist.
  headerToggle: 'header > button[type="button"]',
};

const HIGHLIGHT_CLASS = 'sve-highlight';
const ACTIVE_ATTR = 'data-sve-active';
const HIGHLIGHT_DURATION = 2000; // ms — matches the sve-highlight-pulse @keyframes animation duration
// Matches the CSS collapse/expand transition duration on Statamic's Replicator/Bard sets.
// Defer scroll/highlight until after this period so scrollIntoView uses the final layout.
// Update this if Statamic's collapse transition duration ever changes.
const COLLAPSE_SETTLE_MS = 300;

/**
 * Walks up from a [data-visual-id] input looking for a Grid row container.
 *
 * Two cases are handled:
 * 1. Replicator/Bard sets: nearest ancestor with a direct <header> child
 *    containing a [data-drag-handle] button.
 * 2. Grid table rows (Statamic v6 GridTable): the <tr> element inside a
 *    <tbody> inside a <table class="grid-table">. The Grid's drag handle is
 *    rendered as <td class="drag-handle"> with no [data-drag-handle] attribute,
 *    so we match on the table class instead.
 */
function findGridRow(input) {
  let el = input.parentElement;

  while (el) {
    // Replicator/Bard style: direct <header> child with [data-drag-handle]
    const header = el.querySelector(':scope > header');

    if (header && header.querySelector('[data-drag-handle]')) {
      return el;
    }

    // Grid table style: <tr> inside <tbody> inside <table class="grid-table">
    if (
      el.tagName === 'TR' &&
      el.parentElement?.tagName === 'TBODY' &&
      el.closest('table.grid-table')
    ) {
      return el;
    }

    el = el.parentElement;
  }

  return null;
}

/**
 * Stamps [data-grid-row] onto Grid row <tr> elements.
 *
 * WHY we cannot rely on [data-visual-id] for Grid rows:
 * The AutoUuid Vue component sets the data-visual-id attribute
 * asynchronously in onMounted(). When the MutationObserver fires for the
 * childList change (Vue adding <tr> elements), the attribute has no value
 * yet. Because the observer only watches childList (not attributes), it
 * never re-fires when the attribute is set — so the rows are never stamped.
 *
 * FIX: stamp all <tbody><tr> rows inside table.grid-table directly by DOM
 * structure. This runs as soon as Vue renders the <tr> elements, before
 * the UUID attribute is populated. By the time a user can click in the
 * preview, Vue has finished mounting and the UUID attribute is already set.
 *
 * Falls back to the drag-handle detection for non-table Grid layouts.
 *
 * Called eagerly in initCp and again via MutationObserver when the DOM
 * changes (e.g. Vue renders new Grid rows after navigation or field expansion).
 */

// --- Field groups: a fieldset's own tabs as a segmented control ---------------
//
// One pill across the top of a list of fields, one segment per group.
//
// The groups come from how the fieldset is written. A `tab` field starts one and
// the fields after it belong to it; a `tabby` is a group on its own, since it
// already gathers its fields. Whatever sits outside both is the content, the one
// group the fieldset never names — so it is named here, in the editor's language.
//
// The unit is the field list, never the thing around it. Statamic renders every
// list of fields the same way — a `.publish-fields` grid with one row per field —
// whether those fields belong to a replicator set, a Bard set, a Grid row, a
// group, a tabby, or a publish form of its own: an entry, a term, a user, a
// global set such as header and footer. Keying on the list is what lets a
// fieldset carry its tabs wherever it is imported. Keyed on the replicator set,
// as this first shipped, the very same fieldset came up divided inside a page
// section and flat everywhere else — markers showing as bare chips, which is not
// a different look but a broken one.
//
// Read from the rendered form rather than from the blueprint, for two reasons: a
// field hidden by a condition is simply not there to group, and the fieldtype
// wrapper class is the same signal the rest of this file already relies on. Add a
// `tab` called Custom Code to a fieldset and the section grows that segment, with
// no change here. `tab` stores no value, so marking up an existing section moves
// no data and leaves the fieldset flat.

const SECTION_TOGGLE_ATTR = 'data-sve-section-toggle';
const SECTION_GROUP_ATTR = 'data-sve-section-group';
const SECTION_SEG_ATTR = 'data-sve-section-seg';
const SECTION_ACTIVE_ATTR = 'data-sve-section-active';
const SECTION_CONTENT_KEY = '__content';

// Accordion panels within a segment.
const SECTION_PANEL_ATTR = 'data-sve-section-panel'; // a row's panel key
const SECTION_PANEL_CARD_ATTR = 'data-sve-panel-card'; // the card we insert
const SECTION_PANEL_HEAD_ATTR = 'data-sve-panel-head'; // its clickable header
const SECTION_PANEL_BODY_ATTR = 'data-sve-panel-body'; // its field list
const SECTION_PANEL_OPEN_ATTR = 'data-sve-panel-open'; // open key, on the list
const SECTION_PANEL_OWNER_ATTR = 'data-sve-panel-owner'; // a group heading itself

// Statamic's field list: a grid with one row per field. Every form in the CP is
// built out of these, which is why it is the unit here.
const FIELD_LIST = '.publish-fields';

/**
 * The field list an element belongs to — the scope everything here works in.
 *
 * A row we have moved into an accordion card is still the list's own: the card's
 * body is not a field list, so this walks past it to the list the card sits in.
 * A nested group or tabby renders a list of its own and its rows answer with that
 * one, which is what stops an outer control from painting keys onto fields it
 * does not own — those fields get their own control instead.
 */
function fieldListOf(el) {
  return el?.closest?.(FIELD_LIST) || null;
}

/**
 * The set's own field lists — the grids its fields are laid out in.
 *
 * Depth is counted in .publish-fields ancestors rather than assumed: the markup
 * between a set and its fields differs by fieldtype, and only the shallowest run
 * is the set's own — anything deeper belongs to a nested set or to a tabby.
 */
function sectionFieldLists(setEl) {
  const depth = (el) => {
    let levels = 0;

    for (let node = el.parentElement; node && node !== setEl; node = node.parentElement) {
      if (node.classList?.contains('publish-fields')) {
        levels++;
      }
    }

    return levels;
  };

  const lists = [...setEl.querySelectorAll(FIELD_LIST)].filter(
    (el) => el.closest(SELECTORS.anySet) === setEl
  );

  if (!lists.length) {
    return [];
  }

  const shallowest = Math.min(...lists.map(depth));

  return lists.filter((el) => depth(el) === shallowest);
}

/** The fields of one list. */
function sectionFieldRows(list) {
  return (
    [...list.children]
      // Not the control itself. It is inserted into this very list, so a second
      // pass would count it as a field, file it under the content group, and hide
      // it along with that group the moment any other segment was active.
      .filter((row) => !row.hasAttribute(SECTION_TOGGLE_ATTR))
  );
}

/**
 * The element for a fieldtype rendered directly in this row, or null.
 *
 * Statamic wraps every fieldtype in a `<handle>-fieldtype` element — the same
 * convention the Grid accordion reads. Matches are confined to the row's own
 * field list so a nested replicator carrying its own tabs can't be mistaken for
 * one of this section's.
 */
function rowFieldtype(row, name) {
  const el = row.classList?.contains(name) ? row : row.querySelector(`.${name}`);

  return el && fieldListOf(el) === row.parentElement ? el : null;
}

/**
 * Descendants of a list that belong to that list, not to one nested inside it.
 *
 * A nested list divides itself into its own groups and panels, keyed its own way.
 * Reaching into it from the outer one paints those with keys they never had —
 * which reads as a nested set's fields vanishing the moment an outer tab is used.
 */
function ownDescendants(list, selector) {
  return [...list.querySelectorAll(selector)].filter((el) => fieldListOf(el) === list);
}

/** The list's own first match for a selector, or null. */
function ownDescendant(list, selector) {
  return ownDescendants(list, selector)[0] || null;
}

/**
 * True while these fields are being edited beside the preview: the Live Preview
 * editor pane, or the stripped frame the panel loads a global / saved section
 * into.
 *
 * Both are a narrow column, where a control spanning it reads as part of the
 * panel. The ordinary publish form is as wide as the screen, where the same
 * control spanning it reads as a banner.
 */
function inPreviewPanel(win, el) {
  return (
    !!el.closest('.live-preview-editor') ||
    new URLSearchParams(win.location.search).has(GLOBALS_PANEL_PARAM)
  );
}

/**
 * Marks the segmented control as filling its row — beside the preview, where the
 * panel is a narrow column — or as sized by its segments everywhere else. The
 * stylesheet does the rest. Re-applied on every pass rather than set once at
 * build time, so a control that outlives a move between the two is never left
 * wearing the other one's sizing.
 */
function applyToggleWidth(row, fill) {
  row.toggleAttribute('data-sve-fill', fill);
}

/**
 * What a tab marker says about itself.
 *
 * The chip carries its label, style and icon on data attributes (see the tabs
 * addon) because field config never reaches the rendered panel any other way.
 * Falling back to the chip's own text keeps older markers working — they simply
 * have no style and no icon, which is the default anyway.
 */
function tabMarkerConfig(el) {
  const chip = el.matches?.('[data-tab-marker]') ? el : el.querySelector('[data-tab-marker]');
  const fallback = () => {
    const spans = [...el.querySelectorAll('span')];

    return ((spans.length ? spans[spans.length - 1] : el).textContent || '')
      .replace(/^[^\p{L}\p{N}]+/u, '')
      .trim();
  };

  return {
    label: chip?.getAttribute('data-tab-label') || fallback(),
    accordion: chip?.getAttribute('data-tab-style') === 'accordion',
    icon: chip?.getAttribute('data-tab-icon') || null,
  };
}

/** A field's own label, as Statamic renders it above the control. */
function fieldLabel(row) {
  return (row.querySelector('label')?.textContent || '').trim();
}

/**
 * Divides a list's rows into segments, each of which may hold accordion panels.
 *
 * A plain `tab` marker opens a segment. A marker with `style: accordion` opens a
 * panel inside the segment it sits in, and a `group` field is a panel too — it
 * already carries a name and its own fields, which is the whole shape. Rows
 * before a segment's first panel stay above the accordion, always visible.
 *
 * Returns null when the fieldset draws no line: one segment is not a choice, and
 * the fields are better left exactly as Statamic rendered them.
 */
function sectionGroups(win, list) {
  const rows = sectionFieldRows(list);

  if (!rows.length) {
    return null;
  }

  const groups = [];
  const loose = [];
  const markers = [];
  let open = null;
  let panel = null;
  let seq = 0;

  // Keyed by label, not by position: a card built on one pass has to be found
  // again on the next, and by then the rows it holds have moved inside it —
  // every counter would have shifted.
  const panelKey = (label) => `p-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const openPanel = (key, label, icon, rows_ = [], card = null) => {
    panel = { key, label, icon, rows: rows_, card };
    (open ? open.panels : loose.panels).push(panel);
  };

  loose.panels = [];

  rows.forEach((row) => {
    // A card from an earlier pass *is* its panel. Rows that follow it are ones
    // Vue has pulled back out of it, and belong to it again.
    if (row.hasAttribute(SECTION_PANEL_CARD_ATTR)) {
      const body = row.querySelector(`[${SECTION_PANEL_BODY_ATTR}]`);

      openPanel(
        row.getAttribute(SECTION_PANEL_ATTR),
        row.getAttribute('data-sve-panel-label') || '',
        row.getAttribute('data-sve-panel-icon') || null,
        body ? [...body.children] : [],
        row
      );

      return;
    }

    const marker = rowFieldtype(row, 'tab-fieldtype');

    if (marker) {
      const cfg = tabMarkerConfig(marker);

      markers.push(row);

      if (cfg.accordion) {
        const key = panelKey(cfg.label);

        // Its card is already in the list and will be met on its own; opening a
        // second panel here would split the same group in two.
        if (ownDescendant(list, `[${SECTION_PANEL_CARD_ATTR}][${SECTION_PANEL_ATTR}="${key}"]`)) {
          panel = null;

          return;
        }

        openPanel(key, cfg.label, cfg.icon, [], null);

        return;
      }

      panel = null;
      open = {
        key: `tab-${seq++}`,
        label: cfg.label,
        icon: cfg.icon,
        rows: [],
        panels: [],
      };
      groups.push(open);

      return;
    }

    // A group names itself and holds its own fields — a panel already, in every
    // respect but the chevron. Only when it heads its own panel, though: one
    // sitting inside an open accordion is just part of that panel's contents.
    if (!panel && rowFieldtype(row, 'group-fieldtype')) {
      const label = fieldLabel(row);

      if (label) {
        const key = panelKey(label);

        if (!ownDescendant(list, `[${SECTION_PANEL_CARD_ATTR}][${SECTION_PANEL_ATTR}="${key}"]`)) {
          openPanel(key, label, null, [row]);
        }

        row.setAttribute(SECTION_PANEL_OWNER_ATTR, '');
        panel = null; // self-contained: the rows after it are not its body

        return;
      }
    }

    if (panel) {
      panel.rows.push(row);

      return;
    }

    if (open) {
      open.rows.push(row);

      return;
    }

    // A tabby with no marker ahead of it names a segment on its own: that is how
    // sections were written before `tab` markers, and they keep working.
    if (rowFieldtype(row, 'tabby-fieldtype')) {
      groups.push({ key: `tabby-${seq++}`, label: fieldLabel(row), rows: [row], panels: [] });

      return;
    }

    loose.push(row);
  });

  const named = groups.filter((group) => group.rows.length || group.panels.length);

  // Whatever sits outside every tab is a group of its own — the one the fieldset
  // never names. Merged before the counts below, because a fieldset written as
  // accordions alone opens no segment at all: its panels are *all* loose, and
  // counting first would throw them away before they were ever looked at.
  if (loose.length || loose.panels.length) {
    named.unshift({
      key: SECTION_CONTENT_KEY,
      label: t(win, 'section_content'),
      rows: [...loose],
      panels: loose.panels,
    });
  }

  // Two or more segments are a choice worth a control. A single segment is not —
  // but if it holds accordion panels, those are the choice, and the panels are
  // drawn without one. Only a lone segment of plain rows is left exactly as
  // Statamic rendered it.
  const worthDrawing = named.length > 1 || named.some((group) => group.panels.length);

  // Markers are returned whole, not per group: once the control exists, a chip
  // saying where a group starts is noise, and one whose group came up empty
  // would otherwise be left stranded on screen.
  return worthDrawing ? { groups: named, markers } : null;
}

// A small outline set, drawn here rather than pulled from the Control Panel's
// icon component — that lives in Vue and this builds raw DOM. An unknown name
// falls through to whatever was written, so an emoji works as well.
//
// `box` is the glyph's own ink, widened by half a stroke, used as the viewBox in
// place of the 24×24 grid it was drawn on. Each glyph fills that grid by a
// different amount — `text` leaves 4 units of air a side, `settings` barely 2 —
// so rendering them all through 0 0 24 24 gives every icon a different amount of
// empty space around it. Beside a label that reads as uneven padding: the gap on
// the icon's side looks larger than the gap on the text's, and by a different
// amount per tab. Cropping to the ink makes one icon the same size as the next.
const PANEL_ICONS = {
  color: {
    box: '2.15 2.15 19.7 19.7',
    paths: '<path d="M12 3v18a6 6 0 0 0 0-12 6 6 0 0 1 0-6Z"/><circle cx="12" cy="12" r="9"/>',
  },
  spacing: {
    box: '2.15 2.15 19.7 19.7',
    paths: '<path d="M3 6h18M7 12h10M3 18h18"/>',
  },
  background: {
    box: '2.15 2.15 19.7 19.7',
    paths: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 15 5-5 4 4 3-3 6 6"/>',
  },
  text: {
    box: '3.15 3.15 17.7 17.7',
    paths: '<path d="M4 6h16M4 12h10M4 18h13"/>',
  },
  code: {
    box: '3.15 3.15 17.7 17.7',
    paths: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4"/>',
  },
  layout: {
    box: '2.15 2.15 19.7 19.7',
    paths: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  },
  image: {
    box: '2.15 2.15 19.7 19.7',
    paths: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  },
  // The stand-in for a set that declares no icon of its own. A plain slab: a row
  // with nothing in the icon's place reads as something missing, and its label
  // starts further left than every other row's, which is what makes a list of
  // mixed blocks hard to read down.
  block: {
    box: '2.15 5.15 19.7 13.7',
    paths: '<rect x="3" y="6" width="18" height="12" rx="2"/>',
  },
  settings: {
    box: '1.45 1.45 21.1 21.1',
    paths: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.6 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 11.5 4a2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9 2 2 0 1 1 0 4Z"/>',
  },
};

// Iconify SVGs already fetched, so a repaint or a second panel using the same
// icon costs nothing. Keyed by name; the value is the markup, or a promise while
// it is on its way.
const iconifyCache = new Map();

/** Strip an Iconify SVG down to something that inherits the header's colour. */
function adoptSvg(el, markup) {
  el.innerHTML = markup;

  const svg = el.querySelector('svg');

  if (!svg) {
    return;
  }

  // The holder is the one place a size is decided; the stylesheet fills it.
  svg.removeAttribute('width');
  svg.removeAttribute('height');
  // Iconify ships `fill="currentColor"` on most sets, which already follows the
  // header. The ones drawn with strokes need telling.
  svg.querySelectorAll('[stroke]:not([stroke="none"])').forEach((node) => {
    node.setAttribute('stroke', 'currentColor');
  });
}

/**
 * The icon element for a panel, or null when the marker named none.
 *
 * Four things count as a name, in the order they are recognised: SVG markup
 * pasted straight in, an Iconify name like `mdi:palette`, one of the built-in
 * outlines, and anything short enough to be an emoji. Iconify is fetched once
 * and swapped in when it lands, so a slow network delays the icon and nothing
 * else.
 */
function panelIcon(doc, name) {
  if (!name) {
    return null;
  }

  const holder = doc.createElement('span');

  // Sized and centred by [data-sve-icon] in the stylesheet — 1.3em square,
  // whatever the icon turns out to be, so an emoji, a pasted SVG and a built-in
  // outline all leave the label in the same place.
  holder.setAttribute('data-sve-icon', '');

  if (/^\s*<svg[\s>]/i.test(name)) {
    adoptSvg(holder, name);

    return holder;
  }

  if (/^[a-z0-9-]+:[a-z0-9-]+$/i.test(name)) {
    const cached = iconifyCache.get(name);

    if (typeof cached === 'string') {
      adoptSvg(holder, cached);

      return holder;
    }

    const [prefix, icon] = name.split(':');
    const pending = cached ?? fetch(`https://api.iconify.design/${prefix}/${icon}.svg`)
      .then((res) => (res.ok ? res.text() : ''))
      .then((markup) => {
        iconifyCache.set(name, markup);

        return markup;
      })
      .catch(() => '');

    iconifyCache.set(name, pending);
    pending.then((markup) => markup && adoptSvg(holder, markup));

    return holder;
  }

  const builtIn = PANEL_ICONS[name] ?? PANEL_ICONS[name.replace(/[-_ :].*$/, '')];

  if (builtIn) {
    const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');

    svg.setAttribute('viewBox', builtIn.box);
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.7');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.innerHTML = builtIn.paths;
    holder.appendChild(svg);

    return holder;
  }

  // Anything left that is short enough to be a glyph; longer strings are a name
  // nobody recognised, and printing it would be worse than showing nothing.
  holder.textContent = [...name].length <= 2 ? name : '';

  return holder;
}

/**
 * Statamic's Icon fieldtype only lists registered SVG sets. Authors also want
 * Iconify names, pasted SVG and filenames from a custom folder — so we wrap the
 * fieldtype with a free-text override that writes the same value.
 *
 * Must run after the CP app has booted (`Statamic.booted`), when
 * `$components.app` exists and `icon-fieldtype` is already registered.
 */
export function enhanceIconFieldtype() {
  const components = window.Statamic?.$components;
  const app = components?.app;
  const Vue = window.Vue;

  if (!app || !Vue?.h || !components?.register) {
    return;
  }

  const Original = app.component('icon-fieldtype');

  if (!Original || Original.__sveIconify) {
    return;
  }

  const { h, ref, watch, computed } = Vue;

  const isFreeform = (value) => {
    const v = (value || '').trim();

    if (!v) {
      return false;
    }

    if (/^\s*<svg[\s>]/i.test(v)) {
      return true;
    }

    if (/^[a-z0-9-]+:[a-z0-9-]+$/i.test(v)) {
      return true;
    }

    // Emoji / short glyph — not a Statamic icon filename.
    if ([...v].length <= 2 && !/^[a-z0-9_-]+$/i.test(v)) {
      return true;
    }

    return false;
  };

  const Enhanced = {
    name: 'IconFieldtype',
    __sveIconify: true,
    inheritAttrs: false,
    props: Original.props,
    emits: Original.emits || ['update:value', 'focus', 'blur'],
    setup(props, { emit, attrs, slots }) {
      const custom = ref(isFreeform(props.value) ? String(props.value) : '');
      const pickerValue = computed(() => (isFreeform(props.value) ? null : props.value));

      watch(
        () => props.value,
        (next) => {
          if (isFreeform(next)) {
            custom.value = String(next ?? '');
          } else if (!next) {
            custom.value = '';
          }
        }
      );

      const onPicker = (value) => {
        custom.value = '';
        emit('update:value', value || null);
      };

      const onCustom = (event) => {
        const next = (event?.target?.value ?? '').trim();

        custom.value = event?.target?.value ?? '';
        emit('update:value', next || null);
      };

      return () =>
        h('div', { class: 'sve-icon-field', style: 'display:flex;flex-direction:column;gap:0.75rem;' }, [
          h(
            Original,
            {
              ...attrs,
              ...props,
              value: pickerValue.value,
              'onUpdate:value': onPicker,
            },
            slots
          ),
          h('div', { class: 'sve-icon-field-custom' }, [
            h(
              'label',
              {
                class: 'help-block mb-1',
                style: 'display:block;font-size:0.75rem;font-weight:500;opacity:0.85;',
              },
              'Custom (Iconify / SVG)'
            ),
            h('input', {
              type: 'text',
              class: 'input-text',
              value: custom.value,
              placeholder: 'lucide:layout-template · mdi:home · paste SVG · or set-icons filename',
              onInput: onCustom,
              disabled: props.config?.disabled || props.readOnly,
            }),
            h(
              'p',
              {
                class: 'help-block',
                style: 'margin:0.35rem 0 0;font-size:0.7rem;opacity:0.7;line-height:1.35;',
              },
              'Overrides the picker when filled. Iconify name, emoji, pasted SVG, or a file from resources/svg/set-icons (without .svg).'
            ),
          ]),
        ]);
    },
  };

  components.register('icon-fieldtype', Enhanced);
}

function paintSectionToggle(list, active) {
  ownDescendants(list, `[${SECTION_SEG_ATTR}]`).forEach((btn) => {
    btn.setAttribute('aria-pressed', btn.getAttribute(SECTION_SEG_ATTR) === active ? 'true' : 'false');
  });

  const openPanel = list.getAttribute(SECTION_PANEL_OPEN_ATTR);

  // Rows that are not inside a panel: shown with their segment.
  ownDescendants(list, `[${SECTION_GROUP_ATTR}]`).forEach((row) => {
    if (row.hasAttribute(SECTION_PANEL_CARD_ATTR)) {
      return;
    }

    row.classList.toggle('sve-off', row.getAttribute(SECTION_GROUP_ATTR) !== active);
  });

  ownDescendants(list, `[${SECTION_PANEL_CARD_ATTR}]`).forEach((card) => {
    // aria-expanded is the whole state: the stylesheet hangs the body, the
    // divider and the chevron's rotation off it.
    card.classList.toggle('sve-off', card.getAttribute(SECTION_GROUP_ATTR) !== active);
    card
      .querySelector(`[${SECTION_PANEL_HEAD_ATTR}]`)
      ?.setAttribute('aria-expanded', card.getAttribute(SECTION_PANEL_ATTR) === openPanel ? 'true' : 'false');
  });
}

function setSectionGroup(list, key) {
  list.setAttribute(SECTION_ACTIVE_ATTR, key);
  paintSectionToggle(list, key);
}

/**
 * Puts whatever is holding this element on show: its segment, its accordion panel,
 * and the same again for every list it sits inside.
 *
 * The segmented control hides the rows of every segment but the one selected. A
 * field clicked in the preview while the panel happens to sit on Design is duly
 * found, marked and scrolled to — behind a tab nobody switched. The panel follows
 * the click; the click does not have to guess which tab the panel is on.
 *
 * Walked all the way up, because a field can be two levels deep: the block's own
 * Content segment holds the field, and the section's Content segment holds the
 * block.
 */
function revealSegmentsFor(el, doc) {
  let node = el;

  while (node && node !== doc.body) {
    const row = node.closest(`[${SECTION_GROUP_ATTR}], [${SECTION_PANEL_ATTR}]`);
    const list = row && fieldListOf(row);

    if (!row || !list) {
      return;
    }

    // A row inside an accordion names its panel; the card around it names the
    // segment that panel belongs to.
    const group = row.closest(`[${SECTION_GROUP_ATTR}]`)?.getAttribute(SECTION_GROUP_ATTR);
    const panel = row.getAttribute(SECTION_PANEL_ATTR);

    if (group) {
      setSectionGroup(list, group);
    }

    // setSectionPanel toggles — guarded, so revealing an open panel doesn't shut it.
    if (panel && list.getAttribute(SECTION_PANEL_OPEN_ATTR) !== panel) {
      setSectionPanel(list, panel);
    }

    node = list.parentElement;
  }
}

function setSectionPanel(list, key) {
  // Clicking the open one closes it: with everything shut you can see the whole
  // list of panels at once, which is the point of an accordion.
  const next = list.getAttribute(SECTION_PANEL_OPEN_ATTR) === key ? '' : key;

  list.setAttribute(SECTION_PANEL_OPEN_ATTR, next);
  paintSectionToggle(list, list.getAttribute(SECTION_ACTIVE_ATTR) || '');
}

/**
 * One panel: a card holding its own header and its own field list.
 *
 * Header and body live inside one grid item rather than being two, because the
 * field grid puts 32px between its children — enough to break a card in half.
 * The body repeats the grid it was lifted out of, so fields keep the widths the
 * blueprint gave them.
 */
function buildPanelCard(win, list, panel, groupKey, gridGap) {
  const doc = win.document;
  const card = doc.createElement('div');

  card.setAttribute(SECTION_PANEL_CARD_ATTR, '');
  card.setAttribute(SECTION_PANEL_ATTR, panel.key);
  card.setAttribute(SECTION_GROUP_ATTR, groupKey);
  card.setAttribute('data-sve-panel-label', panel.label);

  if (panel.icon) {
    card.setAttribute('data-sve-panel-icon', panel.icon);
  }

  // The live form's own row gap, handed to the body's grid through a variable —
  // the one measurement here that isn't the stylesheet's to know.
  card.style.setProperty('--sve-grid-gap', gridGap);

  const head = doc.createElement('button');

  head.type = 'button';
  head.setAttribute(SECTION_PANEL_HEAD_ATTR, '');

  const icon = panelIcon(doc, panel.icon);

  if (icon) {
    head.appendChild(icon);
  }

  const label = doc.createElement('span');

  label.setAttribute('data-sve-panel-title', '');
  label.textContent = panel.label;
  head.appendChild(label);

  const tile = doc.createElement('span');

  tile.setAttribute('data-sve-panel-tile', '');

  const chevron = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');

  chevron.setAttribute('data-sve-chevron', '');
  chevron.setAttribute('viewBox', '0 0 24 24');
  chevron.setAttribute('fill', 'none');
  chevron.setAttribute('stroke', 'currentColor');
  chevron.setAttribute('stroke-width', '2.2');
  chevron.setAttribute('stroke-linecap', 'round');
  chevron.setAttribute('stroke-linejoin', 'round');
  chevron.innerHTML = '<path d="m6 9 6 6 6-6"/>';
  tile.appendChild(chevron);
  head.appendChild(tile);

  head.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setSectionPanel(list, panel.key);
  });

  const body = doc.createElement('div');

  body.setAttribute(SECTION_PANEL_BODY_ATTR, '');

  card.appendChild(head);
  card.appendChild(body);

  return card;
}

/**
 * Builds the control for one field list. Re-entrant: a list already carrying the
 * toggle is only repainted, so the observer driving this can fire as often as it
 * likes — and Vue re-rendering a row is caught by the same repaint.
 */
function enhanceSectionGroups(win, list) {
  const divided = sectionGroups(win, list);

  if (!divided) {
    return;
  }

  const { groups, markers } = divided;

  const active = list.getAttribute(SECTION_ACTIVE_ATTR);
  const current = groups.some((group) => group.key === active) ? active : groups[0].key;

  groups.forEach((group) => {
    group.rows.forEach((row) => row.setAttribute(SECTION_GROUP_ATTR, group.key));

    group.panels.forEach((panel) => {
      const anchor = panel.rows[0];

      if (!anchor) {
        return;
      }

      let card = panel.card
        || ownDescendant(list, `[${SECTION_PANEL_CARD_ATTR}][${SECTION_PANEL_ATTR}="${panel.key}"]`);

      if (!card) {
        const holder = anchor.parentElement;
        const gap = win.getComputedStyle?.(holder)?.rowGap || '32px';

        card = buildPanelCard(win, list, panel, group.key, gap);
        holder.insertBefore(card, anchor);
      }

      const body = card.querySelector(`[${SECTION_PANEL_BODY_ATTR}]`);

      // Moving, not copying — and re-checked on every pass, because Vue owns
      // these rows and puts them back in its own list whenever it re-renders.
      panel.rows.forEach((row) => {
        row.setAttribute(SECTION_PANEL_ATTR, panel.key);
        row.removeAttribute(SECTION_GROUP_ATTR);

        if (row.parentElement !== body) {
          body.appendChild(row);
        }

        // A group draws its own name inside the box; the header above it now
        // says the same thing, and twice is once too many.
        if (row.hasAttribute(SECTION_PANEL_OWNER_ATTR)) {
          row.querySelector('label')?.classList.add('sve-off');
        }
      });
    });
  });

  // The markers said where each group starts; the segments and panel headers now
  // say it in a place you can click.
  markers.forEach((row) => row.classList.add('sve-off'));

  if (!list.hasAttribute(SECTION_PANEL_OPEN_ATTR)) {
    // First panel of the opening segment starts open, so a tab never comes up as
    // a stack of closed bars with nothing to read.
    const first = groups.find((group) => group.panels.length)?.panels[0];

    list.setAttribute(SECTION_PANEL_OPEN_ATTR, first ? first.key : '');
  }

  // One segment is not a choice: a fieldset written as accordions alone has a
  // single implicit group, and a pill holding one button would only take up room.
  // Its panels are the control.
  if (groups.length < 2) {
    setSectionGroup(list, current);

    return;
  }

  let row = ownDescendant(list, `[${SECTION_TOGGLE_ATTR}]`);

  if (!row) {
    const doc = win.document;

    row = doc.createElement('div');
    // Statamic lays the field list out as a 12-column grid, so a child with no
    // column of its own lands in one of them — an eighth of the width, which is
    // how this first shipped invisible. `grid-column: 1 / -1` in the stylesheet
    // is what makes it a bar across the panel.
    row.setAttribute(SECTION_TOGGLE_ATTR, '');

    const track = doc.createElement('div');

    track.setAttribute('data-sve-section-track', '');

    groups.forEach((group) => {
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.setAttribute(SECTION_SEG_ATTR, group.key);

      // Same icon vocabulary as an accordion header — a tab marker carries one
      // just as an accordion marker does, and the two read as one system.
      const segIcon = panelIcon(doc, group.icon);

      if (segIcon) {
        btn.appendChild(segIcon);
      }

      const segLabel = doc.createElement('span');

      segLabel.textContent = group.label;
      btn.appendChild(segLabel);

      btn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        setSectionGroup(list, group.key);
      });
      track.appendChild(btn);
    });

    row.appendChild(track);

    // Straight into the list it divides, above everything in it. Nothing is
    // looked up to place it: the list is the scope, so it is always there to
    // hang the control on — which is one less way for the control to end up
    // built but invisible.
    list.insertBefore(row, list.firstChild);
  }

  applyToggleWidth(row, inPreviewPanel(win, list));

  setSectionGroup(list, current);
}

/**
 * Every field list on the screen — a page section's, a widget's, a header's, an
 * entry's. Cheap for lists whose fieldset draws no line: sectionGroups() walks
 * the rows once and returns null.
 *
 * Deliberately not narrowed to the editor panel or to replicator sets. The same
 * fieldset is imported in all of those places, and it has to read the same in
 * each of them.
 */
export function enhanceSectionGroupsIn(win, root = win.document) {
  root.querySelectorAll(FIELD_LIST).forEach((list) => {
    try {
      enhanceSectionGroups(win, list);
    } catch {
      // One malformed list must not stop the rest of the form from working.
    }
  });
}

/**
 * Group a freshly mounted field list before the browser paints it.
 *
 * The ordinary pass is rate-limited — a quiet window, a settle timer — because
 * running it on every mutation of a form being typed into freezes the CP. But a
 * form being *mounted* cannot wait: for those 400-800ms the screen shows
 * Statamic's flat list with the markers still in it as chips, and then it
 * rearranges into tabs. Two layouts for one form is what reads as the panel
 * fixing itself after the fact.
 *
 * Called straight from the MutationObserver, which is a microtask: the grouping
 * lands in the same frame the fields do, so the flat layout is never painted at
 * all. It bounds itself — grouping consumes the marker chips, so a list that has
 * been grouped no longer matches and no longer costs anything.
 */
export function settleUngroupedFieldLists(win, root = win.document) {
  const chips = root.querySelectorAll('[data-tab-marker]');

  if (!chips.length) {
    return;
  }

  const lists = new Set();

  chips.forEach((chip) => {
    const list = fieldListOf(chip);

    if (list) {
      lists.add(list);
    }
  });

  lists.forEach((list) => {
    try {
      enhanceSectionGroups(win, list);
    } catch {
      // One malformed list must not stop the rest of the form from settling.
    }
  });
}

export function stampGridRows(root = document) {
  // Table-mode grids (mode: table): stamp every <tr> inside a grid table's <tbody>.
  root.querySelectorAll('table.grid-table tbody tr').forEach((tr) => {
    if (!tr.hasAttribute('data-grid-row')) {
      tr.setAttribute('data-grid-row', '');
    }
  });

  // Stacked-mode grids (mode: stacked): each row is a direct child element of
  // the .grid-stacked container (the StackedRow root div, which carries the
  // sortable item class). There is no <table>. We stamp these children directly
  // by DOM structure — independent of [data-visual-id], which is set
  // asynchronously by AutoUuid.vue and may not exist yet when this runs.
  //
  // NOTE: stacked grids are frequently nested inside a Replicator set. The old
  // fallback skipped any input whose closest(anySet) matched — which always
  // matched the surrounding Replicator set, so nested stacked grid rows were
  // never stamped. Stamping by .grid-stacked structure avoids that trap.
  root.querySelectorAll('.grid-stacked').forEach((container) => {
    Array.from(container.children).forEach((child) => {
      if (child.nodeType === 1 && !child.hasAttribute('data-grid-row')) {
        child.setAttribute('data-grid-row', '');
      }
    });
  });

  hideAutoUuidGridColumns(root);
}

/**
 * Hides the _visual_id column in Grid table fields.
 *
 * Statamic's GridTable renders a <td class="auto_uuid-fieldtype"> for the
 * auto_uuid field. The column header (<th>) uses v-show="field.type !== 'hidden'",
 * which shows the header because our type is "auto_uuid", not "hidden".
 *
 * We use td.cellIndex to find the correct column position and hide both the
 * <th> header and all <td> cells in that column across the entire table.
 */
export function hideAutoUuidGridColumns(root = document) {
  root.querySelectorAll('table.grid-table td.auto_uuid-fieldtype').forEach((td) => {
    if (td.hasAttribute('data-sve-col-hidden')) {
      return;
    }

    const colIndex = td.cellIndex;
    const table = td.closest('table.grid-table');

    if (!table) {
      return;
    }

    table.querySelectorAll(`tr > :nth-child(${colIndex + 1})`).forEach((cell) => {
      cell.setAttribute('data-sve-col-hidden', '');
      cell.style.display = 'none';
    });
  });
}

export function findSetByUid(uid, doc = document, index = 0) {
  const found = findSetByVisualIdInput(uid, doc, index);

  if (found) {
    return found;
  }

  // Nested replicator blocks often scope with the row id (`{{ id }}`) because
  // `_visual_id` cascades from the parent section in Antlers. Map that row id
  // to the set's real `_visual_id` via publish values, then retry.
  const visualId = resolveVisualIdFromValues(uid, doc);

  if (visualId && visualId !== uid) {
    const viaVisual = findSetByVisualIdInput(visualId, doc, index);

    if (viaVisual) {
      return viaVisual;
    }
  }

  // Saved (synced) sections strip `_visual_id` on save. Until AutoUuid remounts
  // a matching [data-visual-id] input, locate the set by its values path instead
  // — otherwise bootSavedSectionSolo / focus never opens and the sidebar stays
  // on empty entry meta (Published + title).
  return findSetByValuesPath(uid, doc, index);
}

/** Direct (non-nested) replicator sets under a field/set root. */
function directReplicatorSets(root) {
  if (!root) {
    return [];
  }

  return [...root.querySelectorAll(SELECTORS.replicatorSet)].filter((setEl) => {
    const ancestor = setEl.parentElement?.closest(SELECTORS.replicatorSet);

    return !(ancestor && root.contains(ancestor));
  });
}

/**
 * Walk a publish-values path (`page_sections.0.blocks.1`) into the CP DOM and
 * return the matching replicator set element.
 */
function setElFromValuesPath(doc, path) {
  const parts = String(path || '').split('.').filter(Boolean);

  if (parts.length < 2) {
    return null;
  }

  let scope =
    doc.getElementById(`field_${parts[0]}`) ||
    doc.querySelector(`[data-field-handle="${CSS.escape(parts[0])}"]`) ||
    doc.querySelector('main') ||
    doc.body;

  let setEl = null;

  for (let i = 1; i < parts.length; i += 2) {
    const idx = Number(parts[i]);

    if (!Number.isInteger(idx)) {
      return null;
    }

    setEl = directReplicatorSets(scope)[idx] || null;

    if (!setEl) {
      return null;
    }

    const nextHandle = parts[i + 1];

    if (nextHandle != null && Number.isNaN(Number(nextHandle))) {
      scope =
        setEl.querySelector(`#field_${CSS.escape(nextHandle)}`) ||
        setEl.querySelector(`[data-field-handle="${CSS.escape(nextHandle)}"]`) ||
        setEl;
    } else {
      scope = setEl;
    }
  }

  return setEl;
}

/** Locate a set by matching row id / _visual_id through publish values → DOM. */
function findSetByValuesPath(uid, doc, matchIndex = 0) {
  let seen = 0;

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, uid);

    if (path === null || path === '') {
      continue;
    }

    const setEl = setElFromValuesPath(doc, path);

    if (!setEl) {
      continue;
    }

    if (seen === matchIndex) {
      return setEl;
    }

    seen += 1;
  }

  return null;
}

function findSetByVisualIdInput(uid, doc, index = 0) {
  const inputs = doc.querySelectorAll(SELECTORS.visualIdInput);
  let count = 0;

  for (const input of inputs) {
    if (input.value === uid) {
      if (count === index) {
        return input.closest(SELECTORS.anySet);
      }
      count++;
    }
  }

  return null;
}

/**
 * Er rækken låst?
 *
 * `locked_rows` på et replicator- eller grid-felt betyder at rækkerne kan
 * redigeres og skjules, men ikke flyttes, dubleres eller slettes. Fluebenet
 * findes ikke i værdierne — det er en indstilling på feltet — så svaret læses af
 * `data-row-locked`, som projektets LockedRows.js stempler rækken i formularen
 * med. Tages låsen af en række, forsvinder attributten, og så er svaret nej.
 *
 * Spurgt her, i de tre handlinger låsen handler om, frem for i hver knap der
 * kalder dem: bloktræet, værktøjslinjen på siden og et træk-og-slip er tre veje
 * til samme sted, og en lås der kun gælder på nogle af dem er ingen lås.
 */
function rowIsLocked(uid, doc) {
  if (!uid) {
    return false;
  }

  const el = findSetByUid(uid, doc) || findSetByVisualIdInput(uid, doc);

  return !!el?.hasAttribute('data-row-locked');
}

/**
 * Resolves a preview scope uid (row `id` / `_id` or `_visual_id`) to the set's
 * `_visual_id` stored in the publish form — needed so nested blocks can be
 * found in the CP DOM the same way top-level sections are.
 */
function resolveVisualIdFromValues(uid, doc) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, uid);

    if (path === null) {
      continue;
    }

    const row = dataGet(values, path);

    if (row && typeof row === 'object' && row._visual_id) {
      return row._visual_id;
    }
  }

  return null;
}

/**
 * Walks up from a (possibly nested) set uid to the top-level section uid
 * (e.g. page_sections.2). Field clicks should solo the section, while still
 * expanding the nested block that owns the field.
 */
function topLevelSectionUid(uid, doc) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, uid);

    if (!path) {
      continue;
    }

    const match = path.match(/^([^.]+)\.(\d+)/);

    if (!match) {
      continue;
    }

    const section = dataGet(values, `${match[1]}.${match[2]}`);

    if (!section || typeof section !== 'object') {
      continue;
    }

    return section._visual_id || section._id || section.id || null;
  }

  return null;
}

export function collectAncestorSets(setEl) {
  const ancestors = [];
  let current = setEl.parentElement;

  while (current) {
    const ancestor = current.closest(SELECTORS.anySet);

    if (!ancestor) {
      break;
    }

    ancestors.unshift(ancestor);
    current = ancestor.parentElement;
  }

  return ancestors;
}

/**
 * Returns true if the set is currently in its collapsed state.
 *
 * Replicator sets expose `data-collapsed="true"` when collapsed (always
 * present; value is "true" or "false").
 *
 * Bard sets (Tiptap node views) carry no data attribute for collapsed state.
 * Instead Vue's `v-show="!collapsed"` hides the content div via an inline
 * `style="display: none;"` — detected here via `el.style.display`.
 *
 * Stacked Grid rows use our accordion (`data-sve-grid-collapsed`) — separate
 * from Statamic's collapse, which Grids don't have.
 */
export function isSetCollapsed(setEl) {
  if (setEl.hasAttribute('data-sve-grid-row') || setEl.hasAttribute('data-grid-row')) {
    // Our accordion marks collapsed stacked rows. Table-mode grid rows have no
    // accordion — treat them as always open.
    return setEl.hasAttribute('data-sve-grid-collapsed');
  }

  if (setEl.hasAttribute('data-replicator-set')) {
    // Vue may set data-collapsed="" or "true"; absent means expanded.
    return setEl.hasAttribute('data-collapsed') && setEl.getAttribute('data-collapsed') !== 'false';
  }

  // Bard: find the inner contenteditable container and check its last child
  // (the content div that v-show toggles).
  const inner = setEl.querySelector('[contenteditable="false"]');

  if (inner) {
    const contentEl = inner.lastElementChild;

    return !!contentEl && contentEl.style.display === 'none';
  }

  return false;
}

export function expandSet(setEl) {
  if (!isSetCollapsed(setEl)) {
    return;
  }

  // Stacked Grid accordion: open this row and collapse siblings (same behaviour
  // as clicking the header). Do not fake a header click — that would race with
  // our own listener and can leave the focused row closed.
  if (setEl.hasAttribute('data-sve-grid-row') || setEl.hasAttribute('data-sve-grid-collapsed')) {
    const stacked = setEl.parentElement;

    if (stacked) {
      [...stacked.children].forEach((sibling) => {
        if (sibling !== setEl && sibling.hasAttribute('data-sve-grid-row')) {
          setGridRowCollapsed(sibling, true);
        }
      });
    }

    setGridRowCollapsed(setEl, false);

    return;
  }

  // Prefer the set's own collapse toggle — never the focus "step into" arrow
  // that also sits in the header as a button[type=button].
  const toggle = ownHeaderToggle(setEl) || setEl.querySelector(SELECTORS.headerToggle);

  if (toggle) {
    // Use a non-bubbling click so Vue's @click handler on the button fires,
    // but the document-level handleClick listener (which sends a focus message
    // to the iframe) does NOT fire for this programmatic expand action.
    toggle.dispatchEvent(new MouseEvent('click', { bubbles: false, cancelable: true }));
  }
}

/**
 * The set's own collapse toggle — the button Statamic puts straight into the
 * set's `<header>`, not one belonging to a set nested inside it.
 *
 * The step-into arrow lives in that same header and is a `<button type="button">`
 * too, so it is named out rather than counted on to come second.
 */
function ownHeaderToggle(setEl) {
  const header = [...setEl.children].find((el) => el.tagName === 'HEADER');

  if (!header) {
    return null;
  }

  return (
    [...header.children].find(
      (el) => el.matches('button[type="button"]') && !el.hasAttribute(FOCUS_STEP_ATTR)
    ) || null
  );
}

/** Folds a set back up. The mirror of expandSet, and collapsed already is done. */
export function collapseSet(setEl) {
  if (isSetCollapsed(setEl)) {
    return;
  }

  if (setEl.hasAttribute('data-sve-grid-row') || setEl.hasAttribute('data-sve-grid-collapsed')) {
    setGridRowCollapsed(setEl, true);

    return;
  }

  // Non-bubbling for the same reason expandSet is: Vue's own handler runs, the
  // document listener that would read this as "the editor clicked a set" does not.
  ownHeaderToggle(setEl)?.dispatchEvent(new MouseEvent('click', { bubbles: false, cancelable: true }));
}

// Breathing room (px) left below the sticky grid header when scrolling a row
// into view, so the highlighted row isn't flush against the header.
const GRID_HEADER_GAP = 12;

/**
 * Height of the sticky <thead> in the grid table containing targetEl, or 0 when
 * targetEl is not inside a table-mode grid (e.g. stacked-mode grids have no
 * <thead>, so no offset is needed).
 */
function getGridHeaderOffset(targetEl) {
  const table = targetEl.closest('table.grid-table');

  if (!table) {
    return 0;
  }

  const thead = table.querySelector('thead');

  return thead ? thead.offsetHeight : 0;
}

/**
 * Scrolls a set into view. For grid rows in table mode, adds a temporary
 * scroll-margin-top equal to the sticky grid header height (+ a small gap) so
 * the row lands below the header instead of being hidden behind it. The margin
 * is read by the browser when the smooth scroll begins, then restored.
 */
export function scrollSetIntoView(setEl) {
  const offset = setEl.hasAttribute('data-grid-row') ? getGridHeaderOffset(setEl) : 0;

  if (offset > 0) {
    const original = setEl.style.scrollMarginTop;

    setEl.style.scrollMarginTop = `${offset + GRID_HEADER_GAP}px`;
    setEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    requestAnimationFrame(() => {
      setEl.style.scrollMarginTop = original;
    });
  } else {
    setEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function highlightSet(setEl, duration = HIGHLIGHT_DURATION) {
  setEl.classList.add(HIGHLIGHT_CLASS);
  setTimeout(() => {
    setEl.classList.remove(HIGHLIGHT_CLASS);
  }, duration);
}

/**
 * For Bard sets, programmatically focus the ProseMirror editor and mark the
 * node as selected by adding the `ProseMirror-selectednode` class — which
 * Statamic/TipTap already styles correctly. The class is removed after
 * `duration` ms so it doesn't linger after the user interacts with the editor.
 */
export function focusBardSet(setEl, duration = HIGHLIGHT_DURATION) {
  setEl.classList.add('ProseMirror-selectednode');
  setTimeout(() => {
    setEl.classList.remove('ProseMirror-selectednode');
  }, duration);
}

/**
 * If setEl lives inside an inactive tab panel, switches to the containing tab
 * by calling Statamic's PublishTabs `setActive(handle)` function, found by
 * walking the Vue component parent chain from the tab trigger element.
 *
 * reka-ui's TabsTrigger does not respond to programmatic `.click()` or
 * `dispatchEvent`, and Vue's component.setupState auto-unwraps refs so we
 * cannot set activeTab.value directly. The reliable approach is to find the
 * `setActive` function exposed in Statamic's PublishTabs.vue setupState and
 * call it with the target tab handle.
 *
 * Returns true when a tab switch was initiated, false when not needed or not
 * possible.
 */
export function switchToContainingTab(setEl, doc = document) {
  const tabPanel = setEl.closest('[role="tabpanel"]');

  if (!tabPanel) {
    return false;
  }

  // reka-ui sets data-state="inactive" on hidden panels. Statamic also adds
  // a .hidden CSS class via Vue's :class binding. Either is sufficient.
  if (tabPanel.dataset.state !== 'inactive' && !tabPanel.classList.contains('hidden')) {
    return false;
  }

  const triggerId = tabPanel.getAttribute('aria-labelledby');
  if (!triggerId) {
    return false;
  }

  const trigger = doc.getElementById(triggerId);
  if (!trigger) {
    return false;
  }

  // Extract the tab handle from the panel ID: "reka-tabs-v-N-content-{handle}"
  const match = tabPanel.id.match(/-content-(.+)$/);
  if (!match) {
    return false;
  }

  const tabHandle = match[1];

  // Walk the Vue component parent chain from the trigger element, looking for
  // Statamic's PublishTabs component which exposes a `setActive(handle)` fn.
  // Starting from the trigger traverses through reka-ui internals to the same
  // component instance that owns the reactive activeTab state.
  //
  // Note: component.setupState auto-unwraps Vue refs to plain values, so we
  // cannot set activeTab directly. Functions are not auto-unwrapped, so
  // setActive is reachable as typeof setupState.setActive === 'function'.
  let component = trigger.__vueParentComponent;

  for (let depth = 0; component && depth < 40; depth++) {
    const setActive = component.setupState?.setActive;

    if (typeof setActive === 'function') {
      setActive(tabHandle);
      return true;
    }

    component = component.parent;
  }

  return false;
}

export function handleFocus(uid, doc = document, afterSetUid = undefined, uidIndex = 0) {
  // Clear persistent active state from whichever element previously held it.
  doc.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((el) => el.removeAttribute(ACTIVE_ATTR));

  const setEl = findSetByUid(uid, doc, uidIndex);

  if (!setEl) {
    console.warn('[StatamicVisualEditor] handleFocus: no set found for uid:', uid);
    return;
  }

  // Mark as active — persists until the next focus event.
  setEl.setAttribute(ACTIVE_ATTR, '');

  const tabSwitched = switchToContainingTab(setEl, doc);

  // A block can sit under a segment of its section's just as a field can under
  // one of its block's.
  revealSegmentsFor(setEl, doc);

  // When a tab switch was initiated, Vue removes the .hidden class in a
  // microtask. Defer the expand/scroll/highlight block so it runs after the
  // panel becomes visible; otherwise scrollIntoView is a no-op on a hidden el.
  const applyFocus = () => {
    const ancestors = collectAncestorSets(setEl);

    // Check before expanding so we know whether to defer the scroll.
    const anyCollapsed = [...ancestors, setEl].some(isSetCollapsed);

    [...ancestors, setEl].forEach(expandSet);

    const doScrollAndHighlight = () => {
      // When a precise text target (afterSetUid) is provided, skip scrolling to
      // the outer set — scrollBardToTextAfterSet will scroll directly to the text,
      // eliminating the two-step "jump to top of Bard then jump to text" behaviour.
      if (afterSetUid === undefined) {
        scrollSetIntoView(setEl);
      }

      if (setEl.hasAttribute('data-node-view-wrapper')) {
        focusBardSet(setEl);
      } else {
        highlightSet(setEl);
      }

      if (afterSetUid !== undefined) {
        setTimeout(() => scrollBardToTextAfterSet(afterSetUid, setEl), COLLAPSE_SETTLE_MS);
      }
    };

    // expandSet dispatches a non-bubbling click that triggers Vue's reactive
    // collapse toggle asynchronously. If any ancestor (or the target itself)
    // needed expanding, defer the scroll until CSS transitions have completed
    // so scrollIntoView uses the final, fully-rendered layout position.
    if (anyCollapsed) {
      setTimeout(doScrollAndHighlight, COLLAPSE_SETTLE_MS);
    } else {
      doScrollAndHighlight();
    }
  };

  if (tabSwitched) {
    setTimeout(applyFocus, 0);
  } else {
    applyFocus();
  }
}

export function handleHover(uid, doc = document) {
  doc.querySelectorAll('[data-sve-hover]').forEach((el) => {
    el.removeAttribute('data-sve-hover');
  });

  const setEl = findSetByUid(uid, doc);

  // Don't apply hover outline when the element is already the active focused one.
  if (!setEl || setEl.hasAttribute(ACTIVE_ATTR)) {
    return;
  }

  setEl.setAttribute('data-sve-hover', '');
}

/**
 * Finds a field wrapper element in the CP by its dot-separated handle path.
 * Statamic renders `id="field_{path.replaceAll('.', '_')}"` on every field wrapper.
 *
 * Counterpart: bridge.js `findFieldElement()` — runs in the preview iframe and
 * resolves the preview-side `[data-sid-field]` attribute via querySelector +
 * underscore normalization. The two functions cannot share code because they run
 * in separate bundles (CP window vs. preview iframe).
 */
export function findFieldElement(fieldPath, doc = document, scopeUid = undefined) {
  const normalized = fieldPath.replaceAll('.', '_');

  // Scoped lookup: when the preview supplies the surrounding set's _visual_id,
  // restrict the search to that set element. This is what makes a bare handle
  // like "text" resolve to the correct instance instead of the first one in the
  // whole form. The set element is located via the matching [data-visual-id] input.
  if (scopeUid) {
    const setEl = findSetByUid(scopeUid, doc);

    if (setEl) {
      // Prefer the field whose id ends with the handle AND is nearest to this set.
      // querySelectorAll within the set returns only descendants, so any match is
      // already correctly scoped. Pick the shortest id (closest nesting level).
      const matches = [...setEl.querySelectorAll('[id^="field_"]')].filter(
        (el) => el.id === 'field_' + normalized || el.id.endsWith('_' + normalized)
      );

      if (matches.length) {
        matches.sort((a, b) => a.id.length - b.id.length);
        return matches[0];
      }
    }
  }

  // Unscoped: exact match only. We deliberately do NOT fall back to a global
  // suffix match — a bare handle like "text" is ambiguous across repeated
  // sections and a suffix match would wrongly grab the first one in the DOM.
  return doc.getElementById('field_' + normalized);
}

/**
 * Focus a specific CP field by its dot-separated handle path.
 * Switches to the containing tab, scrolls, and plays a highlight animation.
 * Pass `{ animate: false }` to skip the pulse (e.g. when triggered by a direct CP click).
 */
export function handleFieldFocus(fieldPath, doc = document, { animate = true, scopeUid = undefined } = {}) {
  doc.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((el) => el.removeAttribute(ACTIVE_ATTR));

  // Expand the scoped set (and ancestors) first — nested accordion rows may not
  // expose their field wrappers until open, so findFieldElement can miss them.
  if (scopeUid) {
    const scopedSet = findSetByUid(scopeUid, doc);

    if (scopedSet) {
      [...collectAncestorSets(scopedSet), scopedSet].forEach(expandSet);
    }
  }

  const focusField = () => {
    const fieldEl = findFieldElement(fieldPath, doc, scopeUid);

    if (!fieldEl) {
      console.warn('[SVE] handleFieldFocus: no field element found for path:', fieldPath);
      return false;
    }

    fieldEl.setAttribute(ACTIVE_ATTR, '');

    // Statamic's own tabs, then ours: a field is no use behind either.
    const tabSwitched = switchToContainingTab(fieldEl, doc);

    revealSegmentsFor(fieldEl, doc);

    // Expand any collapsed ancestor Replicator sets so the field is visible.
    // This handles {{ visual_edit field="text" }} used inside Replicator partials.
    const ancestorSets = [];
    let ancestor = fieldEl.parentElement;

    while (ancestor) {
      if (ancestor.hasAttribute('data-replicator-set')) {
        ancestorSets.unshift(ancestor);
      }

      ancestor = ancestor.parentElement;
    }

    const anySetsCollapsed = ancestorSets.some(isSetCollapsed);

    ancestorSets.forEach(expandSet);

    const applyFocus = () => {
      const doScroll = () => {
        fieldEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        if (animate) {
          fieldEl.classList.add('sve-field-highlight');
          setTimeout(() => fieldEl.classList.remove('sve-field-highlight'), 2000);
        }
      };

      if (anySetsCollapsed) {
        setTimeout(doScroll, COLLAPSE_SETTLE_MS);
      } else {
        doScroll();
      }
    };

    if (tabSwitched) {
      setTimeout(applyFocus, 0);
    } else {
      applyFocus();
    }

    return true;
  };

  if (!focusField() && scopeUid) {
    // Field wrappers can mount a beat after the accordion expands.
    setTimeout(focusField, COLLAPSE_SETTLE_MS);
  }
}

/**
 * Apply a hover outline to a CP field wrapper identified by its handle path.
 */
export function handleFieldHover(fieldPath, doc = document, scopeUid = undefined) {
  doc.querySelectorAll('[data-sve-hover]').forEach((el) => el.removeAttribute('data-sve-hover'));

  if (!fieldPath) {
    return;
  }

  const fieldEl = findFieldElement(fieldPath, doc, scopeUid);

  if (!fieldEl || fieldEl.hasAttribute(ACTIVE_ATTR)) {
    return;
  }

  fieldEl.setAttribute('data-sve-hover', '');
}

// --- Inline editing: write-back ---------------------------------------------
//
// The preview iframe sends edit-request / edit-input / edit-end messages
// (see bridge.js). This side resolves the clicked field to a dotted value
// path in the publish form, verifies the rendered text actually matches the
// stored value (so modifier-transformed output can never be written back as
// the wrong value), and writes edits via the container's setFieldValue().
// Statamic's own reactivity does the rest: the deep values watcher marks the
// form dirty and triggers the live preview re-render, and the Bard fieldtype's
// value watcher updates its editor when the value changes from outside.

/** Node types the inline editor may edit as a single contenteditable block. */
const EDITABLE_NODE_TYPES = ['heading', 'paragraph'];

// Publish containers captured from Statamic's `publish-container-created`
// event (fired by Container.vue on mount; payload includes the reactive
// `values` ref and `setFieldValue`). Registered in initCp, which runs inside
// Statamic.booting() — before any container mounts.
const publishContainers = [];

// The active inline-edit session, keyed by the bridge's requestId.
let editSession = null;

export function registerContainerEvents(win = window) {
  const events = win.Statamic?.$events;

  if (!events?.$on) {
    return;
  }

  events.$on('publish-container-created', (payload) => {
    if (payload?.setFieldValue && payload?.values) {
      publishContainers.push(payload);
    }
  });

  events.$on('publish-container-destroyed', (payload) => {
    const index = publishContainers.findIndex((c) => c.name === payload?.name);

    if (index !== -1) {
      publishContainers.splice(index, 1);
    }
  });
}

/** Unwraps a Vue ref (Container.vue provides `values` as a ref). */
function unwrapRef(v) {
  return v && v.__v_isRef ? v.value : v;
}

/**
 * Entry-form values considered "clean" when Live Preview opened (or after save).
 * Statamic's $dirty is sticky / noisy on mount — especially with revisions, where
 * Save stays enabled even when nothing changed — so the back button compares
 * against this snapshot instead of trusting $dirty alone.
 */
let entryValuesBaseline = null;
let entryBaselineTimer = null;

/** The entry publish container ("base"), if we've seen it. */
function entryPublishContainer() {
  const named = publishContainers.find((container) => container.name === 'base');

  if (named) {
    return named;
  }

  return publishContainers.length ? publishContainers[publishContainers.length - 1] : null;
}

/** Stable JSON of the entry form values, or null when unavailable. */
function serializeEntryValues() {
  const container = entryPublishContainer();
  const values = unwrapRef(container?.values);

  if (!values || typeof values !== 'object') {
    return null;
  }

  try {
    return JSON.stringify(values);
  } catch {
    return null;
  }
}

/**
 * Remember the current entry values as clean and clear hydration-induced dirty
 * marks. Called after Live Preview settles and again after a successful save.
 */
function markEntryFormClean(win) {
  const serialized = serializeEntryValues();

  if (serialized == null) {
    return false;
  }

  entryValuesBaseline = serialized;
  discardChanges(win);
  win.Statamic?.$dirty?.disableWarning?.();

  return true;
}

/**
 * After Live Preview opens the form still mutates briefly (Bard, replicator,
 * visual ids). Wait for that to settle before taking the clean baseline.
 */
function scheduleEntryBaseline(win) {
  clearTimeout(entryBaselineTimer);

  let attempts = 0;

  const trySnap = () => {
    attempts += 1;

    if (markEntryFormClean(win)) {
      return;
    }

    if (attempts < 20) {
      entryBaselineTimer = win.setTimeout(trySnap, 250);
    }
  };

  entryBaselineTimer = win.setTimeout(trySnap, 600);
}

function clearEntryBaseline() {
  clearTimeout(entryBaselineTimer);
  entryBaselineTimer = null;
  entryValuesBaseline = null;
}

/**
 * Push a Bard value into the mounted TipTap editor in the sidebar.
 *
 * Colour/mark writes sometimes leave TipTap stale after setFieldValue alone.
 * Typing must NOT hammer setContent — Vue already updates the editor, and
 * repeated setContent/blur is what made the sidebar flicker 4–5 times.
 *
 * Coalesce: only the latest pending value is applied, once, after a short wait
 * so Vue can catch up first. If TipTap already matches, we no-op.
 */
let bardSyncTimer = null;
let bardSyncPending = null;

function syncBardEditorFromValue(doc, field, scope, value) {
  if (!doc || !field || !Array.isArray(value)) {
    return;
  }

  bardSyncPending = { doc, field, scope, value: JSON.parse(JSON.stringify(value)) };
  clearTimeout(bardSyncTimer);
  // Wait for Vue's setFieldValue → Bard watcher to settle. If TipTap already
  // matches then, we skip setContent entirely (typing: no flicker). Colour
  // marks that the watcher missed still get one corrective write.
  bardSyncTimer = setTimeout(flushBardEditorSync, 100);
}

function flushBardEditorSync(attempt = 0) {
  const job = bardSyncPending;

  if (!job) {
    return;
  }

  const { doc, field, scope, value } = job;
  const fieldEl = findFieldElement(field, doc, scope);
  const bardEl = fieldEl
    ? fieldEl.closest('.bard-fieldtype') || fieldEl.querySelector('.bard-fieldtype') || fieldEl
    : null;
  const proxy = bardEl ? findBardVueProxy(bardEl) : null;

  if (!proxy?.editor) {
    // Editor not mounted yet (replicator tab, etc.) — one short retry, not a storm.
    if (attempt < 5) {
      bardSyncTimer = setTimeout(() => flushBardEditorSync(attempt + 1), 50);
    }

    return;
  }

  let currentContent = null;

  try {
    currentContent = proxy.editor.getJSON()?.content ?? null;
  } catch {
    currentContent = null;
  }

  // Vue already applied setFieldValue — leave TipTap alone (avoids flicker).
  if (JSON.stringify(value) === JSON.stringify(currentContent)) {
    bardSyncPending = null;

    return;
  }

  try {
    if ('debounceNextUpdate' in proxy) {
      proxy.debounceNextUpdate = false;
    }

    if (proxy.editor?.commands?.setContent) {
      const content = value.length
        ? { type: 'doc', content: JSON.parse(JSON.stringify(value)) }
        : null;

      proxy.editor.commands.setContent(content, false);
    }

    if ('json' in proxy) {
      proxy.json = JSON.parse(JSON.stringify(value));
    }
  } catch {
    /* ignore */
  }

  bardSyncPending = null;
}

/** Write Bard JSON to the form AND force the sidebar TipTap view to match. */
function writeBardFieldValue(container, path, value, doc, session) {
  const next = JSON.parse(JSON.stringify(value));

  container.setFieldValue(path, next);
  syncBardEditorFromValue(doc, session?.field, session?.scope, next);
}

/**
 * Fallback when no container was captured via events (e.g. the CP script ran
 * after the container mounted): walk the Vue component chain from a
 * [data-visual-id] input to the PublishContainer's provided context, which
 * has the same { values, setFieldValue } shape as the event payload.
 */
function containerFromDom(doc) {
  // Synced-section forms often have no [data-visual-id] yet (stripped on save).
  // Walk from any publish-form mount point, not only AutoUuid inputs.
  const starters = [
    doc.querySelector(SELECTORS.visualIdInput),
    doc.querySelector('.publish-form'),
    doc.querySelector('.publish-fields'),
    doc.querySelector('[data-reka-tabs-root]'),
    doc.querySelector('main'),
  ].filter(Boolean);

  for (const el of starters) {
    let component = el.__vueParentComponent;

    while (component) {
      const ctx = component.provides?.['PublishContainerContext'];

      if (ctx?.setFieldValue) {
        return ctx;
      }

      component = component.parent;
    }
  }

  return null;
}

function activeContainers(doc) {
  // Most recently created first — matches the form the user is looking at.
  const list = [...publishContainers].reverse();

  if (!list.length) {
    const ctx = containerFromDom(doc);

    if (ctx) {
      list.push(ctx);
    }
  }

  // A global section's content belongs to the entry open in the panel — another
  // window, so none of the containers above have ever heard of it. Appended last,
  // so the page's own fields always win a name clash, this stands in for it: every
  // caller (inline edit, findPathByUid, the settings panel) then treats a global
  // section exactly like one of the page's own.
  const panel = sectionPanelContainer(doc);

  if (panel) {
    list.push(panel);
  }

  return list;
}

/** data_get-style dotted path lookup ("page_sections.0.text"). */
function dataGet(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

/** The row a field path sits in ("…blocks.1.headline" → "…blocks.1"). */
function rowPathOf(fieldPath) {
  return fieldPath.includes('.') ? fieldPath.slice(0, fieldPath.lastIndexOf('.')) : '';
}

/**
 * Current values of the sibling fields the preview toolbar asked for
 * (controls="font_tag|size"), so it can render them pre-selected.
 */
function controlValues(values, fieldPath, handles) {
  if (!Array.isArray(handles) || !handles.length) {
    return null;
  }

  const row = rowPathOf(fieldPath);
  const out = {};

  for (const handle of handles) {
    if (typeof handle === 'string' && handle) {
      out[handle] = dataGet(values, row ? `${row}.${handle}` : handle);
    }
  }

  return out;
}

/**
 * Recursively finds the dotted path of the set whose _visual_id (or row id)
 * equals uid. Mirrors how the preview's scope uid identifies a section/row.
 *
 * Row ids match both `id` and `_id`: the front-end context exposes `id`
 * (Replicator.processRow renames _id → id), but the publish FORM values keep
 * the raw `_id` key — column builder rows are only findable through it.
 */
function findPathByUid(value, uid, path = '') {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const found = findPathByUid(value[i], uid, path ? `${path}.${i}` : String(i));

      if (found !== null) {
        return found;
      }
    }

    return null;
  }

  if (value && typeof value === 'object') {
    if (value._visual_id === uid || value.id === uid || value._id === uid) {
      return path;
    }

    for (const key of Object.keys(value)) {
      const found = findPathByUid(value[key], uid, path ? `${path}.${key}` : key);

      if (found !== null) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Whitespace-normalizes text for comparison across the preview DOM and the CP
 * form values: nbsp → space, collapse runs, trim. Duplicated in bridge.js
 * because the two files run in separate bundles (CP window vs. preview iframe).
 */
export function normText(s) {
  return (s || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Flattens a ProseMirror node to plain text for comparison with the preview
 * DOM's textContent. hardBreak maps to '' — <br> contributes nothing to
 * textContent, so both sides must agree ("råvarer.<br>Vi" reads "råvarer.Vi").
 */
function bardNodeText(node) {
  if (!node) {
    return '';
  }

  if (node.type === 'text') {
    return node.text || '';
  }

  if (node.type === 'hardBreak') {
    return '';
  }

  return (node.content || []).map(bardNodeText).join('');
}

/** Unwrapped inline Bard root (text/hardBreak) — form may hold this after process(). */
function isUnwrappedInlineBard(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((node) => node && (node.type === 'text' || node.type === 'hardBreak'))
  );
}

/**
 * Inline Bard values the CP can edit as one whole-field paragraph:
 * - legacy string (pre-Bard content)
 * - unwrapped text nodes (post-process / default)
 * - already-wrapped paragraph/heading docs
 */
function normalizeInlineBardValue(value) {
  if (typeof value === 'string') {
    return [
      {
        type: 'paragraph',
        content: value === '' ? [] : [{ type: 'text', text: value }],
      },
    ];
  }

  if (isUnwrappedInlineBard(value)) {
    return [{ type: 'paragraph', content: value }];
  }

  return value;
}

/**
 * Find a Bard set (or other locked node) from the session original by its
 * preview `_visual_id` / attrs.id — used when whole-field edit re-serializes
 * text blocks but must keep set nodes in place.
 */
function findPreservedBardNode(nodes, visualId) {
  if (!Array.isArray(nodes) || !visualId) {
    return null;
  }

  return (
    nodes.find((node) => {
      if (!node || node.type !== 'set') {
        return false;
      }

      const values = node.attrs?.values || {};

      return values._visual_id === visualId || node.attrs?.id === visualId;
    }) || null
  );
}

/**
 * Collects candidate edit targets for the clicked text within a field value.
 *
 * - string values match when their normalized text equals the clicked block's
 *   (or wrapper's) text.
 * - arrays are treated as Bard: heading/paragraph nodes match on flattened text.
 * - plain objects (group fields like section_heading) recurse one level so
 *   their string/Bard members are reachable.
 *
 * The caller requires EXACTLY one candidate — ambiguity means we cannot know
 * which value the user clicked, so editing is denied.
 */
function resolveEditTargets(value, path, req, depth = 0) {
  if (typeof value === 'string') {
    const t = normText(value);

    if ((req.blockText !== null && t === req.blockText) || t === req.wrapperText) {
      return [{ mode: 'string', path }];
    }

    return [];
  }

  if (Array.isArray(value)) {
    if (req.blockText === null) {
      return [];
    }

    const out = [];

    value.forEach((node, i) => {
      if (
        node &&
        EDITABLE_NODE_TYPES.includes(node.type) &&
        normText(bardNodeText(node)) === req.blockText
      ) {
        out.push({ mode: 'bard', path, index: i });
      }
    });

    return out;
  }

  if (value && typeof value === 'object' && depth < 2) {
    let out = [];

    for (const key of Object.keys(value)) {
      out = out.concat(resolveEditTargets(value[key], `${path}.${key}`, req, depth + 1));
    }

    return out;
  }

  return [];
}

/** HTML tag → ProseMirror mark type for inline content parsing. */
const MARK_TAGS = {
  STRONG: 'bold',
  B: 'bold',
  EM: 'italic',
  I: 'italic',
  U: 'underline',
  S: 'strike',
  STRIKE: 'strike',
  DEL: 'strike',
  CODE: 'code',
  SUB: 'subscript',
  SUP: 'superscript',
};

// bard-texstyle span-type styles that inline editing can toggle. A <span> whose
// class is one of these maps to a btsSpan ProseMirror mark; any other span is
// treated as transparent styling. Mirrors the span-type entries in
// config/statamic/bard_texstyle.php — extend here if the site adds more.
const BTS_SPAN_CLASSES = ['uppercase'];

function sameMarks(a, b) {
  return JSON.stringify(a || []) === JSON.stringify(b || []);
}

/**
 * Parses the innerHTML of an inline-edited block back into ProseMirror inline
 * content. Semantic tags become marks; everything else (site spans, styling
 * wrappers) is transparent — only its text survives. This intentionally
 * ignores presentation-only markup the site's own JS may have injected
 * (e.g. word-reveal <span>s around headline words).
 */
export function parseInlineHtml(html, doc = document, spanClasses = BTS_SPAN_CLASSES) {
  const root = doc.createElement('div');

  root.innerHTML = html;

  const out = [];

  const pushText = (text, marks) => {
    if (!text) {
      return;
    }

    const last = out[out.length - 1];

    if (last && last.type === 'text' && sameMarks(last.marks, marks)) {
      last.text += text;

      return;
    }

    const node = { type: 'text', text };

    if (marks.length) {
      node.marks = marks.map((m) => ({ ...m }));
    }

    out.push(node);
  };

  const walk = (node, marks) => {
    for (const child of node.childNodes) {
      if (child.nodeType === 3) {
        // Collapse whitespace like HTML rendering does — pretty-printed
        // template markup must not leak literal newlines/indentation into text.
        pushText(child.nodeValue.replace(/\u00a0/g, ' ').replace(/\s+/g, ' '), marks);
      } else if (child.nodeType === 1) {
        if (child.tagName === 'BR') {
          out.push({ type: 'hardBreak' });
          continue;
        }

        let childMarks = marks;
        const markType = MARK_TAGS[child.tagName];

        if (markType) {
          childMarks = [...marks, { type: markType }];
        } else if (child.tagName === 'A') {
          const attrs = { href: child.getAttribute('href') };

          for (const attr of ['target', 'rel', 'title']) {
            if (child.getAttribute(attr)) {
              attrs[attr] = child.getAttribute(attr);
            }
          }

          childMarks = [...marks, { type: 'link', attrs }];
        } else if (child.tagName === 'SPAN') {
          // Vizuall bard-style mark (span[data-vizu] style="prop: value").
          // Also accept colour-only spans without data-vizu (inline colour from
          // the preview toolbar / browser execCommand leftovers).
          const style = child.getAttribute('style') || '';
          const hasVizu = child.hasAttribute('data-vizu');
          const colorOnly = !hasVizu && /(?:^|;)\s*color\s*:/i.test(style);

          if ((hasVizu || colorOnly) && style) {
            childMarks = [...marks, { type: 'vizuStyle', attrs: { style } }];
          } else if (/(?:^|;)\s*font-weight\s*:\s*(bold|[6-9]00)/i.test(style)) {
            childMarks = [...marks, { type: 'bold' }];
          } else if (/(?:^|;)\s*font-style\s*:\s*italic/i.test(style)) {
            childMarks = [...marks, { type: 'italic' }];
          } else {
            // bard-texstyle span marks (e.g. class="uppercase"). Only recognized
            // classes become a btsSpan mark; other spans (site-injected styling
            // wrappers like the hero word-reveal spans) stay transparent.
            const btsClass = [...child.classList].find((c) => spanClasses.includes(c));

            if (btsClass) {
              childMarks = [...marks, { type: 'btsSpan', attrs: { class: btsClass } }];
            }
          }
        }

        walk(child, childMarks);
      }
    }
  };

  walk(root, []);

  // Whitespace belongs between words, not inside a style.
  //
  // Dragging a selection across a word takes the spaces on either side of it far
  // more often than not, and colouring that selection puts them inside the mark:
  // `Indtast<span> din </span>overskrift` rather than `Indtast <span>din</span>
  // overskrift`. Both read the same on the page the moment it is made, so the
  // mistake is invisible — but the boundary is now whitespace, and every later
  // pass over it (a re-render, a font-tag change, the next inline edit) trims and
  // re-merges those edges, until the gap sits on the wrong side of the span or
  // stops existing. It shows up as words running into a coloured word, and only
  // for text somebody has styled.
  //
  // Pushed back out, the same words always produce the same nodes, and there is
  // no edge left for a later pass to move.
  const spaced = [];

  for (const node of out) {
    if (node.type !== 'text' || !node.marks?.length) {
      spaced.push(node);

      continue;
    }

    const lead = /^\s+/.exec(node.text)?.[0] || '';
    const core = node.text.slice(lead.length).replace(/\s+$/, '');
    const trail = node.text.slice(lead.length + core.length);

    // A marked run of nothing but spaces is spacing, not styling.
    if (!core) {
      spaced.push({ type: 'text', text: node.text });

      continue;
    }

    if (lead) {
      spaced.push({ type: 'text', text: lead });
    }

    spaced.push({ ...node, text: core });

    if (trail) {
      spaced.push({ type: 'text', text: trail });
    }
  }

  // The split can leave neighbours that belong together (an unmarked tail beside
  // the unmarked text that followed it) — same merge `pushText` does on the way in.
  out.length = 0;

  for (const node of spaced) {
    const last = out[out.length - 1];

    if (node.type === 'text' && last?.type === 'text' && sameMarks(last.marks, node.marks || [])) {
      last.text += node.text;

      continue;
    }

    out.push(node);
  }

  // Trim block edges and collapse duplicate spaces across node boundaries.
  for (let i = 0; i < out.length; i++) {
    const node = out[i];

    if (node.type !== 'text') {
      continue;
    }

    if (i === 0) {
      node.text = node.text.replace(/^\s+/, '');
    }

    if (i === out.length - 1) {
      node.text = node.text.replace(/\s+$/, '');
    }

    const prev = out[i - 1];

    if (prev && prev.type === 'text' && prev.text.endsWith(' ') && node.text.startsWith(' ')) {
      node.text = node.text.replace(/^ +/, '');
    }
  }

  return out.filter((n) => n.type !== 'text' || n.text !== '');
}

/** innerText → stored string: nbsp → space, strip the trailing newline(s). */
function cleanEditedText(text) {
  return (text || '').replace(/\u00a0/g, ' ').replace(/\n+$/, '');
}

export function handleEditRequest(data, doc, win) {
  const reply = (message) =>
    sendToPreview({ source: 'statamic-visual-editor', requestId: data.requestId, ...message }, win);

  const req = {
    blockText: data.blockText != null ? normText(data.blockText) : null,
    wrapperText: normText(data.wrapperText || ''),
  };

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let basePath = '';

    if (data.scope) {
      basePath = findPathByUid(values, data.scope);

      if (basePath === null) {
        continue; // scope lives in another container
      }
    }

    let path = [basePath, data.field].filter(Boolean).join('.');
    let value = dataGet(values, path);

    // Scope cascaded to a parent row (common on synced sections whose nested
    // block ids were stripped): find the deepest row under basePath that owns
    // this field handle and use that path instead.
    if (value === undefined && data.field && basePath !== null && basePath !== '') {
      const deepPath = deepestFieldPath(dataGet(values, basePath), data.field, basePath);

      if (deepPath) {
        path = deepPath;
        value = dataGet(values, path);
      }
    }

    if (value === undefined) {
      continue;
    }

    // Inline Bard (headline): upgrade legacy strings / unwrapped text nodes to
    // a single paragraph so whole-field edit + colour toolbar work like richtext.
    if (
      data.bardInline &&
      (typeof value === 'string' || isUnwrappedInlineBard(value)) &&
      normText(typeof value === 'string' ? value : bardNodeText({ type: 'doc', content: value })) ===
        req.wrapperText
    ) {
      value = normalizeInlineBardValue(value);
      container.setFieldValue(path, value);
    }

    // Whole-field Bard editing: one toolbar for the entire field, caret moves
    // freely between blocks, Enter splits blocks. Allowed when every node is
    // either an editable text block (heading/paragraph) or a Bard set — sets
    // render as locked siblings in the preview and are preserved on save.
    // Other node types (lists, images, …) still fall back to per-block editing.
    if (
      Array.isArray(value) &&
      value.length &&
      value.every(
        (node) =>
          node && (EDITABLE_NODE_TYPES.includes(node.type) || node.type === 'set')
      ) &&
      value.some((node) => EDITABLE_NODE_TYPES.includes(node.type))
    ) {
      editSession = {
        container,
        requestId: data.requestId,
        mode: 'bard-field',
        path,
        field: data.field,
        scope: data.scope,
        original: JSON.parse(JSON.stringify(value)),
      };
      reply({
        type: 'edit-start',
        mode: 'bard-field',
        target: 'wrapper',
        controls: controlValues(values, path, data.controls),
        // Only text nodes — sets map onto locked DOM siblings automatically.
        nodes: value
          .filter((node) => EDITABLE_NODE_TYPES.includes(node.type))
          .map((node) => ({
            type: node.type,
            level: node.attrs?.level ?? null,
            className: node.attrs?.class ?? null,
            text: normText(bardNodeText(node)),
          })),
      });

      return;
    }

    // Fast path: Bard field where the clicked block's index maps directly to
    // the ProseMirror node AND the rendered text matches the stored one.
    if (Array.isArray(value) && data.blockIndex != null && req.blockText !== null) {
      const node = value[data.blockIndex];

      if (
        node &&
        EDITABLE_NODE_TYPES.includes(node.type) &&
        normText(bardNodeText(node)) === req.blockText
      ) {
        editSession = {
          container,
          requestId: data.requestId,
          mode: 'bard',
          path,
          index: data.blockIndex,
          field: data.field,
          scope: data.scope,
          original: JSON.parse(JSON.stringify(value)),
        };
        reply({
          type: 'edit-start',
          mode: 'bard',
          target: 'block',
          controls: controlValues(values, path, data.controls),
        });

        return;
      }
    }

    const candidates = resolveEditTargets(value, path, req);

    if (candidates.length !== 1) {
      reply({ type: 'edit-deny', reason: candidates.length ? 'ambiguous' : 'no-match' });

      return;
    }

    const target = candidates[0];

    if (target.mode === 'string') {
      // Rows that pair a text with a link (button rows: { text, url }) get a
      // link-edit shortcut in the preview toolbar.
      const rowPath = target.path.includes('.')
        ? target.path.slice(0, target.path.lastIndexOf('.'))
        : '';
      const row = rowPath ? dataGet(values, rowPath) : null;
      const linkPath =
        row && typeof row === 'object' && typeof row.url === 'string' ? `${rowPath}.url` : null;

      editSession = {
        container,
        requestId: data.requestId,
        mode: 'string',
        path: target.path,
        linkPath,
        field: data.field,
        scope: data.scope,
        original: dataGet(values, target.path),
      };
      reply({
        type: 'edit-start',
        mode: 'string',
        target: target.path === path ? 'wrapper' : 'block',
        hasLink: !!linkPath,
        controls: controlValues(values, target.path, data.controls),
      });
    } else {
      editSession = {
        container,
        requestId: data.requestId,
        mode: 'bard',
        path: target.path,
        index: target.index,
        field: data.field,
        scope: data.scope,
        original: JSON.parse(JSON.stringify(dataGet(values, target.path))),
      };
      reply({
        type: 'edit-start',
        mode: 'bard',
        target: 'block',
        controls: controlValues(values, target.path, data.controls),
      });
    }

    return;
  }

  // Panel is open but hasn't streamed values yet — keep the preview's pending
  // edit alive and retry as soon as the form hydrates.
  if (queueEditUntilPanelReady(data, doc, win)) {
    reply({ type: 'edit-pending' });

    return;
  }

  reply({ type: 'edit-deny', reason: 'not-found' });
}

/**
 * Inline edit on a focused global section needs the side panel's values. The
 * iframe can take a beat to hydrate — hold the request and retry once it does,
 * instead of denying and making the click feel dead.
 */
function queueEditUntilPanelReady(data, doc, win) {
  if (!globalSectionEditorOpen(doc) || sectionPanelValues?.values) {
    return false;
  }

  pendingEditUntilPanel = { data, doc, win };

  return true;
}

function flushPendingEditUntilPanel() {
  if (!pendingEditUntilPanel || !sectionPanelValues?.values) {
    return;
  }

  const { data, doc, win } = pendingEditUntilPanel;

  pendingEditUntilPanel = null;
  handleEditRequest(data, doc, win);
}

/**
 * A quick control in the preview toolbar changed (controls="font_tag|size"):
 * write the sibling field on the row being edited. The value poll streams the
 * re-render back out, so the block redraws with its new setting.
 */
export function handleEditControl(data) {
  if (!editSession || editSession.requestId !== data.requestId) {
    return;
  }

  if (typeof data.handle !== 'string' || !data.handle) {
    return;
  }

  const row = rowPathOf(editSession.path);

  editSession.container.setFieldValue(row ? `${row}.${data.handle}` : data.handle, data.value);
}

let themeSwatchesPromise = null;

/**
 * Preview asked for theme colour swatches (highlight colour control). Fetch from
 * the colour-scheme CP route and reply — cached for the CP page lifetime.
 */
export function handleThemeSwatchesRequest(data, win) {
  const reply = (swatches) =>
    sendToPreview(
      {
        source: 'statamic-visual-editor',
        type: 'theme-swatches',
        requestId: data.requestId,
        swatches,
      },
      win
    );

  if (!themeSwatchesPromise) {
    const cpUrl =
      win.Statamic?.$config?.get?.('cpUrl') ||
      `/${win.Statamic?.$config?.get?.('cpRoute') || 'cp'}`;

    themeSwatchesPromise = win
      .fetch(`${cpUrl}/color-scheme/swatches`, {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then(async (res) => {
        if (!res.ok) {
          return [];
        }

        const json = await res.json().catch(() => []);

        return Array.isArray(json) ? json : [];
      })
      .catch(() => []);
  }

  themeSwatchesPromise.then(reply);
}

export function handleEditInput(data, doc) {
  if (!editSession || editSession.requestId !== data.requestId) {
    return;
  }

  const { container } = editSession;

  if (editSession.mode === 'string') {
    container.setFieldValue(editSession.path, cleanEditedText(data.text));

    return;
  }

  // Whole-field Bard: rebuild the node array from the serialized blocks,
  // preserving locked set nodes (kind: 'locked') at their DOM positions.
  if (editSession.mode === 'bard-field') {
    const values = unwrapRef(container.values);
    const current = dataGet(values, editSession.path);
    const original = Array.isArray(editSession.original) ? editSession.original : [];
    const spanClasses =
      Array.isArray(data.spanClasses) && data.spanClasses.length ? data.spanClasses : BTS_SPAN_CLASSES;

    let textMergeIndex = 0;
    const next = [];

    const buildTextNode = (block) => {
      const type = block.kind === 'heading' ? 'heading' : 'paragraph';
      const pool = Array.isArray(current) ? current : original;
      let orig = null;

      for (let i = textMergeIndex; i < pool.length; i++) {
        if (pool[i]?.type === type) {
          orig = pool[i];
          textMergeIndex = i + 1;
          break;
        }
      }

      const attrs = { ...(orig?.attrs || {}) };
      const node = { type };

      if (type === 'heading') {
        attrs.level = block.level || 2;
      }

      if (block.vizuClass) {
        attrs.vizuClass = block.vizuClass;
      } else {
        delete attrs.vizuClass;
      }

      if (block.vizuBlockStyle) {
        attrs.vizuBlockStyle = block.vizuBlockStyle;
      } else {
        delete attrs.vizuBlockStyle;
      }

      if (block.className && !block.vizuClass) {
        attrs.class = block.className;
      } else {
        delete attrs.class;
      }

      if (Object.keys(attrs).length) {
        node.attrs = attrs;
      }

      const content = parseInlineHtml(block.html || '', doc, spanClasses);

      if (content.length) {
        node.content = content;
      }

      return node;
    };

    for (const block of data.blocks || []) {
      if (block.kind === 'locked') {
        const orig = findPreservedBardNode(original, block.visualId);

        if (orig) {
          next.push(JSON.parse(JSON.stringify(orig)));
        }

        continue;
      }

      if (block.kind === 'vizuDiv') {
        next.push({
          type: 'vizuDiv',
          attrs: { class: block.className || null },
          content: (block.children || []).map((child) => buildTextNode(child)),
        });

        continue;
      }

      next.push(buildTextNode(block));
    }

    writeBardFieldValue(container, editSession.path, next, doc, editSession);

    return;
  }

  // Bard: swap the edited node's inline content inside a fresh copy of the
  // current field value (other nodes/sets stay untouched).
  const values = unwrapRef(container.values);
  const current = dataGet(values, editSession.path);

  if (!Array.isArray(current)) {
    return;
  }

  const next = JSON.parse(JSON.stringify(current));
  const node = next[editSession.index];

  if (!node) {
    return;
  }

  const content = parseInlineHtml(
    data.html,
    doc,
    Array.isArray(data.spanClasses) && data.spanClasses.length ? data.spanClasses : BTS_SPAN_CLASSES
  );

  if (content.length) {
    node.content = content;
  } else {
    delete node.content;
  }

  writeBardFieldValue(container, editSession.path, next, doc, editSession);
}

export function handleEditEnd(data, win = window) {
  if (!editSession || editSession.requestId !== data.requestId) {
    return;
  }

  if (data.cancelled) {
    editSession.container.setFieldValue(editSession.path, editSession.original);
  }

  editSession = null;

  // A global section's stash may have been written several times while this
  // edit was open, with the re-render held back each time so the caret survived.
  // Now that the page is nobody's text field again, let it catch up.
  flushPendingSectionRefresh(win);
}

// command → CP Bard toolbar button title matcher. Core Statamic titles are
// English even in a translated CP; addon buttons (colour) are localized.
const BARD_CMD_TITLE = {
  link: /^link$/i,
  color: /farve|colou?r/i,
  unorderedlist: /unordered list|bullet|punkt/i,
  orderedlist: /ordered list|number|nummer/i,
  quote: /blockquote|quote|citat/i,
  code: /^code$/i,
  codeblock: /code block|kodeblok/i,
  table: /table|tabel/i,
};

/** Builds a DOM Range spanning [from,to] character offsets within blockEl. */
function domRangeForOffsets(blockEl, from, to) {
  const walker = blockEl.ownerDocument.createTreeWalker(blockEl, NodeFilter.SHOW_TEXT);
  let count = 0;
  let startNode = null;
  let startOff = 0;
  let endNode = null;
  let endOff = 0;
  let node;

  while ((node = walker.nextNode())) {
    const len = node.nodeValue.length;

    if (startNode === null && from <= count + len) {
      startNode = node;
      startOff = from - count;
    }

    if (to <= count + len) {
      endNode = node;
      endOff = to - count;
      break;
    }

    count += len;
  }

  if (!startNode) {
    return null;
  }

  if (!endNode) {
    endNode = startNode;
    endOff = startNode.nodeValue.length;
  }

  const range = blockEl.ownerDocument.createRange();

  range.setStart(startNode, startOff);
  range.setEnd(endNode, endOff);

  return range;
}

/**
 * Link/colour/list/quote from the preview toolbar: open the editor panel,
 * select the same character range in the real CP Bard editor, and click its
 * native toolbar button — so Statamic's own popup (link dialog, colour palette)
 * appears, exactly as the user knows it from the panel. Runs after the inline
 * edit has committed; captures field/scope/index synchronously because the CP
 * edit session is torn down by the accompanying edit-end.
 */
export function handleBardCommand(data, doc, win) {
  if (!editSession || editSession.requestId !== data.requestId) {
    return;
  }

  const titleRe = BARD_CMD_TITLE[data.command];

  if (!titleRe) {
    return;
  }

  const { field, scope } = editSession;
  // Whole-field sessions carry the selection's block index in the message; the
  // per-block session stored it at edit-start.
  const index = Number.isInteger(data.blockIndex) ? data.blockIndex : editSession.index;
  // link/colour open a Statamic popup; the rest (lists, quote, …) apply in place.
  const opensPopup = data.command === 'link' || data.command === 'color';

  // Keep the editor panel HIDDEN. It still has real (off-screen) layout, so the
  // set expands, the toolbar button clicks and the popup opens — we then move
  // just that popup over the preview, instead of revealing the whole sidebar.
  // (Deliberately no setLpCollapsed(false) here.)

  let attempts = 0;

  const run = () => {
    const setEl = scope ? findSetByUid(scope, doc) : null;

    if (setEl) {
      [...collectAncestorSets(setEl), setEl].forEach(expandSet);
    }

    const fieldEl = findFieldElement(field, doc, scope);
    // The field id sits on the content wrapper; the toolbar lives on the
    // enclosing .bard-fieldtype. Search from there for both toolbar and editor.
    const bardEl =
      fieldEl?.closest('.bard-fieldtype') || fieldEl?.querySelector('.bard-fieldtype') || fieldEl;
    const ce = bardEl?.querySelector('.ProseMirror') || bardEl?.querySelector('[contenteditable="true"]');
    const toolbar = bardEl?.querySelector('.bard-fixed-toolbar') || bardEl;
    const btn = toolbar
      ? [...toolbar.querySelectorAll('button')].find((b) =>
          titleRe.test(b.getAttribute('title') || b.getAttribute('aria-label') || '')
        )
      : null;

    if (!ce || !btn) {
      if (++attempts < 12) {
        setTimeout(run, 250);
      }

      return;
    }

    const block = ce.children[index];

    if (block && data.to > data.from) {
      const range = domRangeForOffsets(block, data.from, data.to);

      if (range) {
        ce.focus();
        const sel = win.getSelection();

        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else {
      ce.focus();
    }

    // Let ProseMirror sync the DOM selection into its state before the button
    // command reads editor.state.selection.
    setTimeout(() => {
      btn.click();

      if (opensPopup) {
        repositionBardPopup(data.command, data.anchorRect, doc, win);
      }
    }, 70);
  };

  setTimeout(run, 120);
}

/**
 * Finds the Statamic popup that a bard command just opened (link dialog or
 * colour palette) by a distinctive bit of its content, then climbs to the
 * floating (positioned) container.
 */
function findBardPopupEl(command, doc) {
  let anchorNode = null;

  if (command === 'color') {
    anchorNode = [...doc.querySelectorAll('*')].find(
      (e) => e.children.length === 0 && /ingen farve|no colou?r/i.test(e.textContent || '')
    );
  } else if (command === 'link') {
    anchorNode =
      doc.querySelector('input[placeholder="https://"], input[placeholder*="http" i]') ||
      [...doc.querySelectorAll('button, label, span, div, h1, h2, h3')].find(
        (e) =>
          e.children.length === 0 &&
          /apply link|anvend link|update link|opdater link|indsæt link/i.test(e.textContent || '')
      );
  }

  if (!anchorNode) {
    return null;
  }

  let el = anchorNode;

  for (let i = 0; el && i < 12; i++) {
    const cs = doc.defaultView.getComputedStyle(el);
    const w = el.getBoundingClientRect().width;

    // A popover/palette is a small positioned box; skip full-screen overlays.
    if ((cs.position === 'fixed' || cs.position === 'absolute') && w > 120 && w < 640) {
      return el;
    }

    el = el.parentElement;
  }

  return anchorNode.closest('[data-popper-placement]') || anchorNode.parentElement;
}

/**
 * Pins the popup over the preview at the anchor sent by the bridge, keeping the
 * editor panel hidden. Uses !important so Statamic's floating-ui inline styles
 * (written without priority) can't drag it back to the off-screen button.
 */
function repositionBardPopup(command, anchorRect, doc, win) {
  const iframe = doc.getElementById('live-preview-iframe');

  if (!iframe || !anchorRect) {
    return;
  }

  const ir = iframe.getBoundingClientRect();
  const targetLeft = ir.left + (anchorRect.left || 0);
  const targetTop = ir.top + (anchorRect.bottom || 0) + 8;

  const place = (popup) => {
    const w = popup.offsetWidth || 320;
    const left = Math.max(8, Math.min(targetLeft, win.innerWidth - w - 8));
    const top = Math.max(8, targetTop);

    popup.style.setProperty('position', 'fixed', 'important');
    popup.style.setProperty('left', `${left}px`, 'important');
    popup.style.setProperty('top', `${top}px`, 'important');
    popup.style.setProperty('right', 'auto', 'important');
    popup.style.setProperty('bottom', 'auto', 'important');
    popup.style.setProperty('transform', 'none', 'important');
    popup.style.setProperty('margin', '0', 'important');
    popup.style.setProperty('z-index', '2147483000', 'important');
    // Statamic's link editor renders as a full-height stack card — hug its
    // content so it looks like a popover floating over the preview.
    popup.style.setProperty('height', 'auto', 'important');
    popup.style.setProperty('max-height', '85vh', 'important');
    popup.style.setProperty('overflow', 'auto', 'important');
    popup.style.setProperty('border-radius', '12px', 'important');
    popup.style.setProperty('box-shadow', '0 12px 44px rgba(0,0,0,0.28)', 'important');
  };

  let tries = 0;

  const findAndPlace = () => {
    const popup = findBardPopupEl(command, doc);

    if (!popup) {
      if (++tries < 25) {
        setTimeout(findAndPlace, 100);
      }

      return;
    }

    // Re-assert a few times to win against floating-ui's on-open positioning.
    place(popup);
    setTimeout(() => place(popup), 130);
    setTimeout(() => place(popup), 320);
  };

  setTimeout(findAndPlace, 60);
}

/**
 * Toolbar tools the preview can't perform in place (lists, quote, color) send
 * this: open the editor panel and focus the Bard field so the user finishes
 * with the field's real toolbar. Runs after the inline edit has committed.
 */
export function handleOpenPanelField(data, doc, win) {
  if (!editSession || editSession.requestId !== data.requestId || !editSession.field) {
    return;
  }

  const { field, scope } = editSession;

  setLpCollapsed(win, false);
  setTimeout(() => handleFieldFocus(field, doc, { scopeUid: scope }), 100);
}

/**
 * Changes the edited Bard node's block type/attrs (heading level, or paragraph
 * with an optional bard-texstyle class). Only touches type/attrs — the node's
 * inline content is preserved and updated separately via handleEditInput.
 */
export function handleBlockFormat(data, doc = document) {
  if (!editSession || editSession.requestId !== data.requestId || editSession.mode !== 'bard') {
    return;
  }

  const { container } = editSession;
  const values = unwrapRef(container.values);
  const current = dataGet(values, editSession.path);

  if (!Array.isArray(current)) {
    return;
  }

  const next = JSON.parse(JSON.stringify(current));
  const node = next[editSession.index];

  if (!node) {
    return;
  }

  if (data.node === 'heading') {
    node.type = 'heading';
    node.attrs = { ...(node.attrs || {}), level: data.level };
    delete node.attrs.class;
  } else {
    node.type = 'paragraph';
    node.attrs = { ...(node.attrs || {}), class: data.className ?? null };
    delete node.attrs.level;
  }

  writeBardFieldValue(container, editSession.path, next, doc, editSession);
}

/**
 * Opens the asset browser for the clicked image field: locates the CP field
 * wrapper (retrying while the containing set expands — the accompanying click
 * message triggers that expansion) and clicks its Browse button. Statamic's
 * asset selector portals to the body, so it shows even while the editor panel
 * is collapsed off-screen.
 */
export function handleAssetEdit(data, doc) {
  let attempts = 0;

  const tryOpen = () => {
    const setEl = data.scope ? findSetByUid(data.scope, doc) : null;

    // Collapsed sets don't render their field wrappers — expand the scoped set
    // (and its ancestors) so the assets field mounts, then retry below.
    if (setEl) {
      [...collectAncestorSets(setEl), setEl].forEach(expandSet);
    }

    // Assets fields don't always render a field_{path} wrapper id (observed in
    // replicator sets) — fall back to the fieldtype root inside the scoped set.
    const fieldEl =
      findFieldElement(data.field, doc, data.scope) ||
      (setEl ? setEl.querySelector('.assets-fieldtype') : null) ||
      (data.scope ? null : doc.querySelector('.assets-fieldtype'));

    const browse = fieldEl
      ? [...fieldEl.querySelectorAll('button, [role="button"]')].find((b) =>
          /browse|gennemse/i.test(b.textContent)
        )
      : null;

    if (browse) {
      browse.click();

      return;
    }

    if (++attempts < 8) {
      setTimeout(tryOpen, 250);
    }
  };

  tryOpen();
}

/**
 * Link-edit shortcut from the preview toolbar: opens the editor panel and
 * focuses the row's url/link field so the user can change the URL or pick
 * another entry with Statamic's own link fieldtype UI.
 */
export function handleLinkEdit(data, doc, win) {
  if (!editSession || editSession.requestId !== data.requestId || !editSession.linkPath) {
    return;
  }

  const { linkPath, scope } = editSession;

  setLpCollapsed(win, false);

  setTimeout(() => {
    // Preferred: the url field's own wrapper (stacked grids render one).
    let target = findFieldElement(linkPath, doc);

    // Table-mode grid cells carry no field wrapper id — locate the row via its
    // _visual_id and use the link fieldtype cell (or the row itself).
    if (!target && scope) {
      const rowEl = findSetByUid(scope, doc);

      if (rowEl) {
        target = rowEl.querySelector('.link-fieldtype') || rowEl;
      }
    }

    if (!target) {
      return;
    }

    doc.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((el) => el.removeAttribute(ACTIVE_ATTR));
    target.setAttribute(ACTIVE_ATTR, '');
    switchToContainingTab(target, doc);
    collectAncestorSets(target).forEach(expandSet);

    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('sve-field-highlight');
      setTimeout(() => target.classList.remove('sve-field-highlight'), 2000);
    }, COLLAPSE_SETTLE_MS);
  }, 100);
}

/**
 * Moves the set identified by uid one position up/down within its containing
 * array (page sections, replicator rows, …). Works generically: the uid is
 * resolved to a value path like "page_sections.2", and the two array items are
 * swapped via setFieldValue — dirty state, replicator re-render and the live
 * preview update all follow from Statamic's own reactivity.
 */
/**
 * Reorders the array item carrying data.uid. Two callers: the hover arrows send
 * a relative `direction` (±1); drag & drop sends an absolute `toIndex`.
 */
export function handleMove(data, doc) {
  if (rowIsLocked(data.uid, doc)) {
    return;
  }

  const direction = data.direction < 0 ? -1 : 1;

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows: arr } = found;

    const to = Number.isInteger(data.toIndex)
      ? Math.max(0, Math.min(arr.length - 1, data.toIndex))
      : index + direction;

    if (to === index || to < 0 || to >= arr.length) {
      return; // no movement (or already first/last)
    }

    const next = JSON.parse(JSON.stringify(arr));
    const [item] = next.splice(index, 1);

    next.splice(to, 0, item);
    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * Visual column resize: writes the col_w_* span classes the preview's width
 * drag produced. `changes` come in pairs (both columns at a boundary), and the
 * paths are looked up per uid — width writes never shift array indexes, so one
 * values snapshot serves both lookups.
 */
export function handleColumnWidth(data, doc) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let applied = false;

    for (const change of data.changes ?? []) {
      if (typeof change?.field !== 'string' || !/^col_w_[mtd]$/.test(change.field)) {
        continue;
      }

      const path = findPathByUid(values, change.uid);

      if (path === null) {
        continue;
      }

      container.setFieldValue(`${path}.${change.field}`, change.value);
      applied = true;
    }

    if (applied) {
      return;
    }
  }
}

/**
 * The effective span a breakpoint inherits, following the cascade up.
 *
 * Desktop-first, like the rest of the responsive work: a drawer that says
 * nothing says "the same as the one above". Null when nobody above said
 * anything either.
 */
function inheritedSpan(drawers, bp, field) {
  for (const key of BP_INHERITS[bp] ?? []) {
    const value = drawers?.[key]?.[field];

    if (value !== null && value !== undefined && value !== '') {
      return Number(value);
    }
  }

  return null;
}

/**
 * A width dragged in the preview, written to the row it belongs to.
 *
 * Which breakpoint it lands in is decided here and not in the preview, because
 * `currentBp` is the same answer the responsive fields give — one place to be
 * right about what "the screen size I am editing" means.
 *
 * Two shapes are accepted, told apart by what is already stored: a plain number
 * on the row, or the responsive wrapper's drawer per breakpoint (where the inner
 * field carries the same handle as the wrapper). In the second, a value equal to
 * what the breakpoint would have inherited anyway is written as empty — dragging
 * tablet back into step with laptop drops the override again, instead of
 * freezing today's laptop value into it forever.
 */
export function handleGridSpan(data, doc, win) {
  const field = typeof data.field === 'string' && data.field ? data.field : 'span';
  const bp = currentBp(win);

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let applied = false;

    for (const change of data.changes ?? []) {
      const span = Number(change?.span);

      if (!Number.isFinite(span) || span < 1) {
        continue;
      }

      const path = findPathByUid(values, change.uid);

      if (path === null) {
        continue;
      }

      const current = dataGet(values, `${path}.${field}`);
      const responsive =
        current &&
        typeof current === 'object' &&
        !Array.isArray(current) &&
        Object.keys(BP_INHERITS).some((key) => key in current);

      if (responsive) {
        const inherited = inheritedSpan(current, bp, field);

        container.setFieldValue(`${path}.${field}.${bp}.${field}`, inherited === span ? null : span);
      } else {
        container.setFieldValue(`${path}.${field}`, span);
      }

      applied = true;
    }

    if (applied) {
      return;
    }
  }
}

/**
 * "+" on a columns section in the preview: append a column to the section's
 * columns array — mirroring the column builder's own addColumn() defaults —
 * and open the new card's edit popup so type and fields can be picked.
 *
 * Written through setFieldValue rather than by clicking the builder's own
 * "Add column" button: programmatic clicks reach the builder's edit buttons
 * fine (the popup flow below), but its add button doesn't respond to them.
 */
export function handleAddColumn(data, doc, win) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const sectionPath = findPathByUid(values, data.uid);

    if (sectionPath === null) {
      continue;
    }

    const columns = dataGet(values, `${sectionPath}.columns`);

    if (!Array.isArray(columns)) {
      continue;
    }

    // Same id format and defaults as the builder's addColumn().
    const newId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const count = columns.length + 1;
    const newItem = {
      _id: newId,
      type: null,
      enabled: true,
      col_w_m: 'col-span-12',
      col_w_t: 'md:col-span-6',
      col_w_d: 'lg:col-span-4',
      order_m: count,
      order_t: count,
      order_d: count,
    };

    container.setFieldValue(`${sectionPath}.columns`, [...JSON.parse(JSON.stringify(columns)), newItem]);

    // The card only mounts (and the builder's picker machinery only measures
    // real rects) in an expanded set — nudge once; Vue applies it asynchronously.
    const setEl = findSetByUid(data.uid, doc) ?? sortableItemForUid(data.uid, doc);

    if (setEl) {
      [...collectAncestorSets(setEl), setEl].forEach(expandSet);
    }

    openColumnTypePicker(newId, doc, win);

    return;
  }
}

/**
 * Opens the builder's type picker on a (typeless) column card once it has
 * mounted — the same flow the card's own plus icon runs. Cards that already
 * have a type get their edit popup instead.
 */
function openColumnTypePicker(rowId, doc, win, attempts = 0) {
  const card = doc.querySelector(`[data-cb-item-id="${rowId}"]`);
  const trigger = card?.querySelector('.cb-col-plus') ?? card?.querySelector('.cb-edit-btn');

  if (trigger && trigger.offsetParent !== null) {
    trigger.click();
    keepPickerOnScreen(doc, win);

    return;
  }

  if (attempts < 25) {
    setTimeout(() => openColumnTypePicker(rowId, doc, win, attempts + 1), 200);
  }
}

/**
 * The builder positions its type-picker portal at the trigger's rect — with the
 * editor panel parked off-screen (Hide/Auto mode) that lands at left:-10000px.
 * Pull it back into view, centered, so picking a type happens over the preview.
 */
function keepPickerOnScreen(doc, win, attempts = 0) {
  const panel = [...doc.body.children].find(
    (el) => el.style?.position === 'fixed' && el.style?.zIndex === '99999'
  );

  if (panel) {
    const left = parseFloat(panel.style.left);

    if (Number.isNaN(left) || left < 0 || left > win.innerWidth) {
      panel.style.left = `${Math.max(8, (win.innerWidth - (panel.offsetWidth || 224)) / 2)}px`;
      panel.style.top = '120px';
    }

    return;
  }

  if (attempts < 15) {
    setTimeout(() => keepPickerOnScreen(doc, win, attempts + 1), 150);
  }
}

/**
 * "Save as template": grab the clicked section's data from the form and store it
 * as a reusable section. A small dialog asks for a name and whether it should be
 * synced (edits propagate) or a copy (independent).
 *
 * Synced: after the library entry is created, replace THIS page's section with a
 * `global_section` reference so Live Preview shows the global badge immediately
 * (without a manual reload). Custom (unsynced): leave the page section as-is.
 */
export function handleSaveSection(data, doc, win) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, data.uid);

    if (path === null) {
      continue;
    }

    const section = dataGet(values, path);

    if (!section || typeof section !== 'object') {
      return;
    }

    saveSectionDialog(win, section, (name, synced) => {
      win
        .fetch('/!/sve/saved-sections', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken(win),
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({
            title: name,
            section_type: section.type,
            section_data: stripSavedSectionData(section),
            synced,
          }),
        })
        .then(async (res) => {
          const body = await res.json().catch(() => ({}));

          win.Statamic?.$toast?.[res.ok ? 'success' : 'error'](
            res.ok ? t(win, 'saved_toast', { name }) : t(win, 'save_failed')
          );

          if (res.ok) {
            libraryWentStale(win);
          }

          if (!res.ok || !synced || !body.id) {
            return;
          }

          // Swap the local section for a synced reference — LP morphs from setFieldValue.
          await replaceSectionWithGlobalReference(win, doc, data.uid, body.id);
        })
        .catch(() => win.Statamic?.$toast?.error(t(win, 'save_failed')));
    });

    return;
  }
}

/**
 * Replace the page section at `uid` with a `global_section` row pointing at the
 * newly saved synced entry — same shape as dropping a Global card from the library.
 */
async function replaceSectionWithGlobalReference(win, doc, uid, savedEntryId) {
  const set = globalSectionSet(win);
  const meta = await fetchSetMeta(win, set);
  const newId = newRowId();
  const row = buildSectionRow(win, 'global', { id: savedEntryId }, meta?.defaults, newId);
  const field = sectionField(win);

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows } = found;
    const next = JSON.parse(JSON.stringify(rows));

    next[index] = row;
    writeSetMeta(container, field, row, meta?.new || null);
    container.setFieldValue(parentPath, next);

    return true;
  }

  return false;
}

/**
 * "Save this page as a template": every section on the page, stored as one entry
 * you can drop onto another page.
 *
 * The page's own field is read straight off the publish container, so it captures
 * what's on screen — including edits not yet saved to the page itself.
 */
function savePageAsTemplate(win, onSaved = () => {}) {
  const doc = win.document;
  const field = sectionField(win);

  let sections = null;

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);
    const rows = values && typeof values === 'object' ? values[field] : null;

    if (Array.isArray(rows) && rows.length) {
      sections = rows;

      break;
    }
  }

  if (!sections) {
    win.Statamic?.$toast?.error(t(win, 'template_needs_sections'));

    return;
  }

  promptForName(win, t(win, 'save_page_as_template'), t(win, 'template_name'), (name) => {
    win
      .fetch('/!/sve/templates', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken(win),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          title: name,
          // Ids are per-page. A template is a stencil: it gets fresh ones every
          // time it's dropped, or two pages would claim the same section.
          sections: sections.map((section) => stripSavedSectionData(section)),
        }),
      })
      .then((res) => {
        win.Statamic?.$toast?.[res.ok ? 'success' : 'error'](
          res.ok ? t(win, 'template_saved', { name }) : t(win, 'save_failed')
        );

        if (res.ok) {
          libraryWentStale(win);
          onSaved();
        }
      })
      .catch(() => win.Statamic?.$toast?.error(t(win, 'save_failed')));
  });
}

/**
 * Prepare a section for the saved-sections library.
 *
 * Strips CP-only keys (`_visual_id`, `_id`) but KEEPS (or assigns) stable `id`
 * on every set row. Preview templates use `scope="{{ id }}"` on blocks — without
 * nested ids Antlers cascades to the section id and inline edit resolves the
 * wrong path (`page_sections.0.headline` instead of `….blocks.N.headline`).
 */
function stripSavedSectionData(section) {
  const clone = JSON.parse(JSON.stringify(section));

  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node && typeof node === 'object') {
      delete node._visual_id;
      delete node._id;

      // Replicator/grid set rows only — not Bard nodes (paragraph/text/…).
      if (
        typeof node.type === 'string' &&
        node.type &&
        !node.id &&
        ('enabled' in node || 'blocks' in node || node.type.includes('/'))
      ) {
        node.id = newRowId();
      }

      Object.values(node).forEach(walk);
    }
  };

  walk(clone);

  return clone;
}

/** Minimal "what should it be called?" prompt, themed to the CP. */
function promptForName(win, heading, placeholder, onOk) {
  const doc = win.document;
  const overlay = doc.createElement('div');

  overlay.style.cssText =
    'position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;' +
    'background:rgba(0,0,0,.45);';

  const card = doc.createElement('div');

  card.style.cssText =
    'width:380px;max-width:92vw;background:var(--theme-color-content-bg,#fff);color:currentColor;' +
    'border-radius:12px;padding:20px;box-shadow:0 24px 64px rgba(0,0,0,.35);' +
    'font-family:ui-sans-serif,system-ui,sans-serif;';
  card.innerHTML = `
    <div style="font-size:15px;font-weight:600;margin-bottom:14px;">${heading}</div>
    <label style="display:block;font-size:12px;font-weight:500;margin-bottom:5px;">${t(win, 'name')}</label>
    <input type="text" data-sve-name placeholder="${placeholder}"
      style="width:100%;box-sizing:border-box;height:36px;padding:0 10px;border-radius:8px;
      border:1px solid rgba(128,128,128,.4);background:transparent;color:currentColor;font-size:14px;margin-bottom:18px;">
    <div style="display:flex;justify-content:flex-end;gap:8px;">
      <button type="button" data-sve-cancel style="all:unset;cursor:pointer;padding:7px 14px;border-radius:8px;font-size:13px;color:currentColor;opacity:.75;">${t(win, 'cancel')}</button>
      <button type="button" data-sve-ok style="all:unset;cursor:pointer;padding:7px 16px;border-radius:8px;font-size:13px;font-weight:600;background:var(--theme-color-primary,#4f46e5);color:#fff;">${t(win, 'save')}</button>
    </div>
  `;

  overlay.appendChild(card);
  doc.body.appendChild(overlay);

  const name = card.querySelector('[data-sve-name]');
  const close = () => overlay.remove();

  name.focus();

  const submit = () => {
    const value = name.value.trim();

    if (!value) {
      name.focus();

      return;
    }

    close();
    onOk(value);
  };

  card.querySelector('[data-sve-cancel]').addEventListener('click', close);
  card.querySelector('[data-sve-ok]').addEventListener('click', submit);
  overlay.addEventListener('click', (event) => event.target === overlay && close());
  name.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      submit();
    } else if (event.key === 'Escape') {
      close();
    }
  });
}

/** Minimal name + synced prompt, themed to the CP, appended to the body. */
function saveSectionDialog(win, section, onSave) {
  const doc = win.document;
  const overlay = doc.createElement('div');

  overlay.style.cssText =
    'position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;' +
    'background:rgba(0,0,0,.45);';

  const card = doc.createElement('div');

  card.style.cssText =
    'width:380px;max-width:92vw;background:var(--theme-color-content-bg,#fff);color:currentColor;' +
    'border-radius:12px;padding:20px;box-shadow:0 24px 64px rgba(0,0,0,.35);' +
    'font-family:ui-sans-serif,system-ui,sans-serif;';
  card.innerHTML = `
    <div style="font-size:15px;font-weight:600;margin-bottom:14px;">${t(win, 'save_section_heading')}</div>
    <label style="display:block;font-size:12px;font-weight:500;margin-bottom:5px;">${t(win, 'name')}</label>
    <input type="text" data-sve-name placeholder="${t(win, 'name_placeholder')}"
      style="width:100%;box-sizing:border-box;height:36px;padding:0 10px;border-radius:8px;
      border:1px solid rgba(128,128,128,.4);background:transparent;color:currentColor;font-size:14px;margin-bottom:14px;">
    <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;margin-bottom:18px;">
      <input type="checkbox" data-sve-synced style="width:16px;height:16px;">
      <span>${t(win, 'synced_hint')}</span>
    </label>
    <div style="display:flex;justify-content:flex-end;gap:8px;">
      <button type="button" data-sve-cancel style="all:unset;cursor:pointer;padding:7px 14px;border-radius:8px;font-size:13px;color:currentColor;opacity:.75;">${t(win, 'cancel')}</button>
      <button type="button" data-sve-save style="all:unset;cursor:pointer;padding:7px 16px;border-radius:8px;font-size:13px;font-weight:600;background:var(--theme-color-primary,#4f46e5);color:#fff;">${t(win, 'save')}</button>
    </div>
  `;

  overlay.appendChild(card);
  doc.body.appendChild(overlay);

  const name = card.querySelector('[data-sve-name]');
  const synced = card.querySelector('[data-sve-synced]');
  const close = () => overlay.remove();

  name.focus();

  const submit = () => {
    const value = name.value.trim();

    if (!value) {
      name.focus();

      return;
    }

    close();
    onSave(value, synced.checked);
  };

  card.querySelector('[data-sve-cancel]').addEventListener('click', close);
  card.querySelector('[data-sve-save]').addEventListener('click', submit);
  overlay.addEventListener('click', (event) => event.target === overlay && close());
  name.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      submit();
    } else if (event.key === 'Escape') {
      close();
    }
  });
}

// --- Section picker (visual "Add section") ---------------------------------------
//
// The "+" on a section opens this instead of Statamic's native Add Set picker, so
// we can offer three tabs: the built-in section types, and the saved templates
// split into Custom (insert a copy) and Global (insert a reference). Each is shown
// with its preview image. Insertion writes straight into the page_sections array,
// after the section the "+" was clicked on.

/**
 * A translated string, in the language the CP user picked (resolved server-side,
 * see ServiceProvider::strings()). Falls back to the key, so a missing string is
 * visible rather than blank.
 */
function t(win, key, replacements = {}) {
  const strings = win.Statamic?.$config?.get?.('sveStrings') || {};
  let out = strings[key] ?? key;

  for (const [name, value] of Object.entries(replacements)) {
    out = out.replaceAll(`:${name}`, value);
  }

  return out;
}

const SECTION_PICKER_ID = '__sve-section-picker';
const CHROME_DESIGNS_ID = '__sve-chrome-designs';

// The type list is handed over at page render. Deleting one replaces it here for
// the rest of the session — the config is a snapshot, and reloading the CP just
// to drop a card from the picker isn't worth asking for.
let sectionTypesOverride = null;

function sectionTypes(win) {
  if (sectionTypesOverride) {
    return sectionTypesOverride;
  }

  const list = win.Statamic?.$config?.get?.('sveSectionTypes');

  return Array.isArray(list) ? list : [];
}

/**
 * Fetches the section types with their preview images as they are on disk, and
 * keeps fetching while previews are being regenerated.
 *
 * The list handed over at page render is a snapshot. Editing a section's Antlers
 * partial changes what the section looks like without any save the Control Panel
 * could hear about, so the card in the picker would go on promising the old
 * design until the whole Control Panel was reloaded. Asking when the tab opens —
 * and again while a run is under way — is what makes "change the code, look at
 * the picker" show the change.
 */
function refreshSectionTypes(win, onUpdated) {
  let tries = 0;
  let sawRun = false;

  const ask = () => {
    win
      .fetch('/!/sve/section-types', {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.types) && data.types.length) {
          sectionTypesOverride = data.types;
          onUpdated();
        }

        if (data.running) {
          sawRun = true;
        } else if (!sawRun) {
          return; // nothing was being regenerated; one look was enough
        } else {
          // One more after it finishes: the last section it photographs is
          // written just after it stops announcing itself.
          sawRun = false;
        }

        if (tries++ < 25) {
          win.setTimeout(ask, 1500);
        }
      })
      .catch(() => {});
  };

  ask();
}

/**
 * Tells an open section library that what it is showing is out of date.
 *
 * Saving a section from the editor happens outside the library's own code, so it
 * has no way of knowing. Without this the designer saves "hero with the red
 * background", switches to the Custom tab, and it isn't there — because the tab
 * still holds the list it fetched before the save.
 */
function libraryWentStale(win) {
  win.document
    .getElementById(SECTION_PICKER_ID)
    ?.dispatchEvent(new win.CustomEvent('sve-library-stale'));
}

/**
 * Loads a library list, and keeps loading while its pictures are still being
 * taken.
 *
 * A section saved from the editor is on screen before its screenshot exists —
 * photographing it takes a few seconds in a real browser, which is deliberately
 * not done while the save is waiting. Without this the card would sit there
 * blank until the whole Control Panel was reloaded, and the designer who just
 * changed a background to red would have no way of knowing the picker had caught
 * up. So a card without a picture, or a run that is under way, is a reason to
 * ask again shortly.
 */
function pollLibrary(win, url, take, onItems, onFailed) {
  let tries = 0;

  const ask = () => {
    win
      .fetch(url, { credentials: 'same-origin', headers: { 'X-Requested-With': 'XMLHttpRequest' } })
      .then((res) => res.json())
      .then((data) => {
        const items = take(data);

        onItems(items);

        const waiting = data.running || items.some((item) => !item.preview_url);

        if (waiting && tries++ < 25) {
          win.setTimeout(ask, 1500);
        }
      })
      .catch(() => onFailed());
  };

  ask();
}

/** A new uuid for a re-id'd copy. */
function newUuid(win) {
  return win.crypto?.randomUUID ? win.crypto.randomUUID() : `${newRowId()}-${newRowId()}`;
}

/** Gives a section (and everything in it) fresh ids, so a copy is independent. */
function reidSection(win, section) {
  const clone = JSON.parse(JSON.stringify(section));

  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node && typeof node === 'object') {
      if ('id' in node || '_id' in node) {
        if ('_id' in node) {
          node._id = newRowId();
        } else {
          node.id = newRowId();
        }
      }

      if ('_visual_id' in node) {
        node._visual_id = newUuid(win);
      }

      Object.values(node).forEach(walk);
    }
  };

  walk(clone);

  return clone;
}

/**
 * Inserts a section into page_sections. `afterUid` = the section to drop after;
 * null drops at the very top. `rowMeta` is the set's fresh meta (from the
 * section-meta endpoint): without it the Replicator has no way to render the new
 * row, so it would show in the preview but never in the CP's own section list.
 * Returns false when the field can't be located (e.g. nothing has focus yet).
 */
function insertSectionAfter(win, doc, afterUid, section, rowMeta = null) {
  const field = sectionField(win);

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    // No uid → drop at the top of the page_sections array.
    if (afterUid == null) {
      const rows = dataGet(values, field);

      if (!Array.isArray(rows)) {
        continue;
      }

      writeSetMeta(container, field, section, rowMeta);
      container.setFieldValue(field, [section, ...JSON.parse(JSON.stringify(rows))]);

      return true;
    }

    const found = rowLocation(values, afterUid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows } = found;
    const next = JSON.parse(JSON.stringify(rows));

    next.splice(index + 1, 0, section);
    // Sections live at the top level, so the meta always belongs to `field`.
    writeSetMeta(container, field, section, rowMeta);
    container.setFieldValue(parentPath, next);

    return true;
  }

  return false;
}

/**
 * Registers a new row's meta on the container so the Replicator can render it.
 * The Replicator reads each row's fields from `meta.<field>.existing[<_id>]`;
 * merging the fresh meta under the row's id is what makes the row appear in the
 * CP list (not just the preview).
 */
function writeSetMeta(container, field, section, rowMeta) {
  if (!rowMeta || !section._id || typeof container.setFieldMeta !== 'function') {
    return;
  }

  const allMeta = unwrapRef(container.meta) || {};
  const fieldMeta = allMeta[field] || { existing: {}, new: null, defaults: null, collapsed: [] };

  container.setFieldMeta(field, {
    ...fieldMeta,
    existing: { ...(fieldMeta.existing || {}), [section._id]: rowMeta },
  });
}

// Site-specific handles all come from the server config (provideToScript), never
// from a literal here — the addon has to work as installed on any site.

/** The Replicator field the page builder lives in. */
function sectionField(win) {
  return win.Statamic?.$config?.get?.('sveSectionField') || 'page_sections';
}

/**
 * Is a tool switched on for this site? (Addons > Statamic Visual Editor.)
 *
 * Unknown keys — and a config that hasn't arrived yet — read as on: the editor
 * showing a tool it could have hidden is a smaller failure than it hiding one
 * the site depends on.
 */
function featureOn(win, key) {
  return win.Statamic?.$config?.get?.('sveFeatures')?.[key] !== false;
}

/** The Replicator set a page uses to reference a synced ("global") saved section. */
function globalSectionSet(win) {
  return win.Statamic?.$config?.get?.('sveGlobalSectionSet') || 'global_section';
}

/** The collection saved sections live in. */
function savedSectionsCollection(win) {
  return win.Statamic?.$config?.get?.('sveSavedSectionsCollection') || 'saved_sections';
}

/** The Replicator set handle a library card of the given kind inserts. */
function setHandleFor(win, kind, item) {
  if (kind === 'global') {
    return globalSectionSet(win);
  }

  if (kind === 'custom') {
    return item.section_type;
  }

  return item.handle;
}

// Fresh set meta + defaults, per set handle, cached for the session (the
// blueprint doesn't change while the form is open).
const sectionMetaCache = new Map();

/** The collection being edited, read from the CP URL. */
function currentCollection(win) {
  const match = win.location.pathname.match(/\/collections\/([^/]+)\//);

  return match ? match[1] : null;
}

/** Fetches (and caches) a set's fresh meta + default values from the addon. */
/**
 * Meta + defaults for a set in a NESTED replicator field (a section's own
 * `blocks`), for the in-preview block inserter. Same endpoint as sections, with a
 * `field` so it resolves the nested replicator instead of the top-level one.
 */
async function fetchNestedSetMeta(win, field, setHandle) {
  const key = `${field}::${setHandle}`;

  if (sectionMetaCache.has(key)) {
    return sectionMetaCache.get(key);
  }

  const collection = currentCollection(win);

  if (!collection) {
    return null;
  }

  const url =
    `/!/sve/section-meta?collection=${encodeURIComponent(collection)}` +
    `&field=${encodeURIComponent(field)}&set=${encodeURIComponent(setHandle)}`;

  const res = await win.fetch(url, {
    credentials: 'same-origin',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  });

  const data = res.ok ? await res.json() : null;

  sectionMetaCache.set(key, data);

  return data;
}

/**
 * Registers a new row's meta in a NESTED replicator/grid field, so the row
 * renders in the Control Panel form (the sidebar), not only the preview.
 *
 * The meta for a top-level field is set with `setFieldMeta(field, …)`, but a
 * nested field's meta lives deep inside the top field's — so we clone the top
 * field's meta, walk into the nested field within the clone, add the row there,
 * and write the whole top field back. `parentPath` is like `page_sections.2.blocks`.
 */
function writeNestedRowMeta(container, values, parentPath, rowId, rowMeta) {
  if (!rowMeta || !rowId || typeof container.setFieldMeta !== 'function') {
    return;
  }

  const fullMeta = unwrapRef(container.meta) || {};
  const segments = parentPath.split('.');
  const topField = segments[0];

  if (!fullMeta[topField]) {
    return;
  }

  const clone = JSON.parse(JSON.stringify(fullMeta[topField]));
  // metaForPath walks meta keyed by row _id — pass the top field's own meta and
  // values, and the path below it (e.g. "2.blocks").
  const nested = metaForPath(clone, dataGet(values, topField), segments.slice(1).join('.'));

  if (!nested || typeof nested !== 'object') {
    return;
  }

  nested.existing = { ...(nested.existing || {}), [rowId]: rowMeta };
  container.setFieldMeta(topField, clone);
}

/**
 * Drops a row's meta from a nested replicator/grid field after the row itself
 * was removed from values — keeps `existing` from accumulating orphans.
 */
function removeNestedRowMeta(container, values, parentPath, rowId) {
  if (!rowId || typeof container.setFieldMeta !== 'function') {
    return;
  }

  const fullMeta = unwrapRef(container.meta) || {};
  const segments = parentPath.split('.');
  const topField = segments[0];

  if (!fullMeta[topField]) {
    return;
  }

  const clone = JSON.parse(JSON.stringify(fullMeta[topField]));
  const nested = metaForPath(clone, dataGet(values, topField), segments.slice(1).join('.'));

  if (!nested?.existing || !(rowId in nested.existing)) {
    return;
  }

  delete nested.existing[rowId];
  container.setFieldMeta(topField, clone);
}

/**
 * Fresh row meta for a grid/replicator row: prefer the field's blank `new`
 * template (what Statamic's own "Add row" uses), else clone a sibling's.
 */
function rowMetaTemplate(container, values, parentPath, sampleRow) {
  const fullMeta = unwrapRef(container.meta);
  const fieldMeta = fullMeta ? metaForPath(fullMeta, values, parentPath) : null;

  if (!fieldMeta || typeof fieldMeta !== 'object') {
    return null;
  }

  if (fieldMeta.new && typeof fieldMeta.new === 'object') {
    return JSON.parse(JSON.stringify(fieldMeta.new));
  }

  const sampleId = sampleRow?._id;

  if (sampleId && fieldMeta.existing?.[sampleId]) {
    return JSON.parse(JSON.stringify(fieldMeta.existing[sampleId]));
  }

  return null;
}

/**
 * "+" between a replicator's blocks: insert a new set of the chosen type, next to
 * the block the "+" sits by (or as the first block when the field is empty). The
 * row is written into the nested array with its meta, so it shows in both the
 * preview and the CP form.
 */
async function handleInsertBlock(data, doc, win) {
  const { field, set, anchorUid, position, scope } = data;

  if (!field || !set) {
    return;
  }

  const meta = await fetchNestedSetMeta(win, field, set);
  const rowId = newRowId();
  const row = {
    ...(meta?.defaults ? JSON.parse(JSON.stringify(meta.defaults)) : {}),
    _id: rowId,
    _visual_id: newUuid(win),
    type: set,
  };

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    // Anchored to a sibling block: splice in beside it.
    if (anchorUid) {
      const loc = rowLocation(values, anchorUid);

      if (!loc) {
        continue;
      }

      const next = JSON.parse(JSON.stringify(loc.rows));

      next.splice(position === 'before' ? loc.index : loc.index + 1, 0, row);
      writeNestedRowMeta(container, values, loc.parentPath, rowId, meta?.new);
      container.setFieldValue(loc.parentPath, next);

      return;
    }

    // Empty field: no sibling to anchor to — seed the section's own field array.
    if (scope) {
      const sectionPath = findPathByUid(values, scope);

      if (sectionPath === null) {
        continue;
      }

      const fieldPath = `${sectionPath}.${field}`;
      const existing = dataGet(values, fieldPath);
      const next = Array.isArray(existing) ? JSON.parse(JSON.stringify(existing)) : [];

      next.push(row);
      writeNestedRowMeta(container, values, fieldPath, rowId, meta?.new);
      container.setFieldValue(fieldPath, next);

      return;
    }
  }
}

/**
 * Insert a Bard set node into a Bard field's value array (ProseMirror JSON).
 * Used by the whole-field inline editor's "+" on an empty paragraph.
 *
 * `index` is the text-block index in the serialized preview (locked sets also
 * count in the final array — the bridge sends the absolute splice index).
 */
async function handleInsertBardSet(data, doc, win) {
  const { field, set, scope, index } = data;

  if (!field || !set) {
    return;
  }

  const meta = await fetchNestedSetMeta(win, field, set);
  const setId = newRowId();
  const visualId = newUuid(win);
  const valuesPayload = {
    ...(meta?.defaults ? JSON.parse(JSON.stringify(meta.defaults)) : {}),
    type: set,
    _visual_id: visualId,
  };

  const setNode = {
    type: 'set',
    attrs: {
      id: setId,
      enabled: true,
      values: valuesPayload,
    },
  };

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let fieldPath = field;

    if (scope) {
      const sectionPath = findPathByUid(values, scope);

      if (sectionPath === null) {
        continue;
      }

      fieldPath = `${sectionPath}.${field}`;
    }

    const existing = dataGet(values, fieldPath);

    if (!Array.isArray(existing)) {
      continue;
    }

    const next = JSON.parse(JSON.stringify(existing));
    const at = Number.isInteger(index) ? Math.max(0, Math.min(index, next.length)) : next.length;

    next.splice(at, 0, setNode);
    writeNestedRowMeta(container, values, fieldPath, setId, meta?.new);
    container.setFieldValue(fieldPath, next);

    return;
  }
}

async function fetchSetMeta(win, setHandle) {
  if (sectionMetaCache.has(setHandle)) {
    return sectionMetaCache.get(setHandle);
  }

  const collection = currentCollection(win);

  if (!collection) {
    return null;
  }

  const url =
    `/!/sve/section-meta?collection=${encodeURIComponent(collection)}&set=${encodeURIComponent(setHandle)}`;

  const res = await win.fetch(url, {
    credentials: 'same-origin',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  sectionMetaCache.set(setHandle, data);

  return data;
}

/** The section object to insert for a library card of the given kind. */
function buildSectionRow(win, kind, item, defaults, newId) {
  const base = {
    ...JSON.parse(JSON.stringify(defaults || {})),
    _id: newId,
    _visual_id: newUuid(win),
    enabled: true,
  };

  if (kind === 'page') {
    return { ...base, type: item.handle };
  }

  if (kind === 'global') {
    // A reference — the template renders the source's current sections. The set
    // and its entries field share one handle, so the row is built from it.
    const set = globalSectionSet(win);

    return { ...base, type: set, [set]: [item.id] };
  }

  // custom: an independent copy with fresh ids, laid over the type's defaults so
  // any fields added since it was saved still get sensible values.
  return {
    ...base,
    ...reidSection(win, item.section_data || {}),
    _id: newId,
    _visual_id: newUuid(win),
    enabled: true,
    type: item.section_type,
  };
}

/**
 * Inserts a library card's section: fetches the set's fresh meta, builds the
 * row from it, and drops it in at `afterUid` (null = top). Async because the
 * meta round-trip is what lets the row render in the CP list, not only the
 * preview.
 */
async function insertSection(win, doc, afterUid, kind, item) {
  if (kind === 'template') {
    return insertTemplate(win, doc, afterUid, item);
  }

  const meta = await fetchSetMeta(win, setHandleFor(win, kind, item));
  const newId = newRowId();
  const row = buildSectionRow(win, kind, item, meta?.defaults, newId);

  insertSectionAfter(win, doc, afterUid, row, meta?.new || null);
}

/**
 * Drops a whole template onto the page.
 *
 * Every section in it is copied — a template is a stencil, never a reference —
 * and each one is laid over its type's current defaults, so a template saved
 * before a field existed still gets a sensible value for it.
 *
 * Meta is fetched per section *type*, not per row: the Replicator renders each row
 * from `meta.<field>.existing[<_id>]`, so without it the sections would appear in
 * the preview and be missing from the CP list.
 */
async function insertTemplate(win, doc, afterUid, item) {
  const sections = (item.sections || []).filter((section) => section && section.type);

  if (!sections.length) {
    win.Statamic?.$toast?.error(t(win, 'template_empty'));

    return;
  }

  const mode = await askTemplateMode(win, item);

  if (!mode) {
    return; // cancelled
  }

  const rows = [];
  const metas = [];

  for (const section of sections) {
    const meta = await fetchSetMeta(win, section.type);
    const newId = newRowId();

    rows.push(
      buildSectionRow(win, 'custom', { section_data: section, section_type: section.type }, meta?.defaults, newId)
    );
    metas.push(meta?.new || null);
  }

  insertSectionsAfter(win, doc, afterUid, rows, metas, mode === 'replace');
}

/**
 * The multi-row sibling of `insertSectionAfter`: all of a template's sections in
 * one write.
 *
 * One `setFieldValue` for the lot, not one per section — each call re-renders the
 * Replicator, so inserting fifteen sections one at a time would be fifteen
 * re-renders and fifteen preview reloads.
 */
function insertSectionsAfter(win, doc, afterUid, rows, rowMetas, replace) {
  const field = sectionField(win);

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const existing = dataGet(values, field);

    if (!Array.isArray(existing)) {
      continue;
    }

    rows.forEach((row, index) => writeSetMeta(container, field, row, rowMetas[index]));

    if (replace) {
      container.setFieldValue(field, rows);

      return true;
    }

    if (afterUid == null) {
      container.setFieldValue(field, [...rows, ...JSON.parse(JSON.stringify(existing))]);

      return true;
    }

    const found = rowLocation(values, afterUid);

    if (!found) {
      continue;
    }

    const next = JSON.parse(JSON.stringify(found.rows));

    next.splice(found.index + 1, 0, ...rows);
    container.setFieldValue(found.parentPath, next);

    return true;
  }

  return false;
}

/**
 * Replace what's on the page, or add to it?
 *
 * Asked every time rather than remembered: dropping a template on an empty page
 * and dropping one onto a page you've already built are different intentions, and
 * replacing is not undoable from here.
 */
function askTemplateMode(win, item) {
  return new Promise((resolve) => {
    const doc = win.document;
    const overlay = doc.createElement('div');

    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;' +
      'background:rgba(0,0,0,.45);font-family:ui-sans-serif,system-ui,sans-serif;';

    const card = doc.createElement('div');

    card.style.cssText =
      'width:420px;max-width:92vw;background:var(--theme-color-content-bg,#fff);color:currentColor;' +
      'border-radius:12px;padding:22px;box-shadow:0 24px 64px rgba(0,0,0,.35);';
    card.innerHTML =
      `<div style="font-size:15px;font-weight:600;margin-bottom:6px;">${item.title}</div>` +
      `<div style="font-size:13px;opacity:.7;line-height:1.45;margin-bottom:18px;">${t(win, 'template_mode_body', {
        count: (item.sections || []).length,
      })}</div>` +
      '<div data-sve-actions style="display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;"></div>';

    const actions = card.querySelector('[data-sve-actions]');
    const close = (value) => {
      overlay.remove();
      resolve(value);
    };

    const button = (label, style, value) => {
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.textContent = label;
      btn.style.cssText = `all:unset;cursor:pointer;padding:8px 14px;border-radius:8px;font-size:13px;${style}`;
      btn.addEventListener('click', () => close(value));
      actions.appendChild(btn);
    };

    button(t(win, 'cancel'), 'opacity:.7;color:currentColor;', null);
    button(t(win, 'template_replace'), 'color:currentColor;background:rgba(128,128,128,.16);font-weight:500;', 'replace');
    button(t(win, 'template_append'), 'background:var(--theme-color-primary,#4f46e5);color:#fff;font-weight:600;', 'append');

    overlay.addEventListener('click', (event) => event.target === overlay && close(null));
    overlay.appendChild(card);
    doc.body.appendChild(overlay);
  });
}

function closeSectionPicker(win) {
  win.document.getElementById(SECTION_PICKER_ID)?.remove();
  syncPreviewInset(win);
}

/** True while editing header/footer chrome or a global section. */
function isSectionLibraryLocked(win) {
  return !!activeChromeKind || globalSectionEditorOpen(win.document);
}

/**
 * The top-bar tools that belong to the page rather than to what is being edited
 * inside it.
 *
 * Stepping into a header, a footer or a global section locks the page around it:
 * the other sections fade, and a click out there does nothing. These four reach
 * straight past that lock — another page, another global set, the section
 * library, the block tree — so while you are inside, they have nothing to act on.
 *
 * The panel tool is deliberately not among them. Hidden/Auto/Visible is how you
 * get at the fields you stepped in for, and taking it away would lock the way in
 * along with the way out.
 */
const FOCUS_LOCKED_TABS = ['pages', 'globals', 'sections', 'listview'];

/**
 * Dim and disable those tools while chrome or a global section owns the editor.
 *
 * Painted from applyHeaderTab, which runs on the header loop — so the state
 * survives Vue rebuilding the bar underneath it, the same way the icons' own
 * colours do.
 */
function paintFocusLockedTabs(win, btn, tab, on) {
  const off = isSectionLibraryLocked(win) && FOCUS_LOCKED_TABS.includes(tab);

  btn.disabled = off;
  btn.style.pointerEvents = off ? 'none' : '';
  btn.style.cursor = off ? 'default' : '';
  // A merged tool wears its surface on the frame around the glyph, and it is the
  // frame that goes out — see applyHeaderTab. Fading the glyph here as well would
  // fade it twice over, leaving it far darker than the standalone icons it stands
  // in a row with.
  btn.style.opacity = off
    ? (MERGED_TABS.includes(tab) ? '1' : LP_ICON_LOCKED_OPACITY)
    : on
      ? '1'
      : LP_ICON_IDLE_OPACITY;

  if (off) {
    btn.setAttribute('aria-disabled', 'true');
  } else {
    btn.removeAttribute('aria-disabled');
  }

  return off;
}

/**
 * Hide/disable the Sections header button (and close what those tools have open)
 * while chrome or a global section owns the editor — dragging sections there is
 * a no-op, and a panel left standing would sit over the fields you came for.
 */
function syncSectionLibraryAvailability(win) {
  const doc = win.document;
  const locked = isSectionLibraryLocked(win);
  const btn = doc.getElementById(LIBRARY_BUTTON_ID);

  if (locked) {
    closeSectionPicker(win);
    closeListViewPanel(win);
    closeOutlinePanel(win);

    if (btn) {
      btn.style.display = 'none';
      btn.setAttribute('aria-disabled', 'true');
      btn.disabled = true;
    }

    // An unfolded Pages or Globals control is the same tool, one state further
    // out — folded away with the rest so the bar reads as one locked row.
    if (FOCUS_LOCKED_TABS.includes(headerTab)) {
      setHeaderTab(win, null);
    }

    applyHeaderTab(win);

    return;
  }

  if (btn) {
    btn.style.display = '';
    btn.removeAttribute('aria-disabled');
    btn.disabled = false;
  }

  applyHeaderTab(win);
}

/** Hide Theme Settings without destroying it (stash + form stay alive). */
function hideGlobalsPanel(win) {
  const panel = win.document.getElementById(GLOBALS_PANEL_ID);

  if (!panel) {
    return;
  }

  panel.style.cssText =
    'position:fixed;left:-10000px;top:0;width:440px;height:100vh;z-index:-1;' +
    'display:flex;flex-direction:column;visibility:hidden;pointer-events:none;' +
    'background:var(--theme-color-content-bg,#fff);';
  panel.setAttribute('data-sve-chrome-hidden', '1');
  syncPreviewInset(win);
}

/** Show Theme Settings again (right dock). Does not touch the left section editor. */
function showGlobalsPanel(win) {
  const panel = win.document.getElementById(GLOBALS_PANEL_ID);

  if (!panel) {
    return;
  }

  // Must clear hidden BEFORE pin — place() no-ops while data-sve-chrome-hidden is set.
  panel.removeAttribute('data-sve-chrome-hidden');
  // Never reparent the iframe — moving it in the DOM reloads it and refreshes
  // the Live Preview. Keep it on document.body and dock to the right.
  pinGlobalsPanelRight(win, panel);

  const designs = win.document.getElementById(CHROME_DESIGNS_ID);

  if (designs) {
    designs.style.cssText =
      'position:fixed;left:-10000px;top:0;width:440px;height:100vh;z-index:-1;display:none;';
    designs.setAttribute('data-sve-chrome-hidden', '1');
  }

  syncPreviewInset(win);
}

/**
 * Docked panels on the RIGHT: sections library, Theme Settings, global sections.
 * `keep` is id(s) to leave open. Called with nothing to close them all (leaving Live Preview).
 */
function closeRightPanels(win, keep = null) {
  const keepIds = keep == null ? [] : Array.isArray(keep) ? keep : [keep];

  if (!keepIds.includes(SECTION_PICKER_ID)) {
    closeSectionPicker(win);
  }

  if (!keepIds.includes(OUTLINE_PANEL_ID)) {
    closeOutlinePanel(win);
  }

  if (!keepIds.includes(LISTVIEW_PANEL_ID)) {
    closeListViewPanel(win);
  }

  if (!keepIds.includes(GLOBALS_PANEL_ID)) {
    // Park (don't destroy) — tearing the iframe down is what made chrome feel
    // slow compared to page sections that already live in the editor DOM.
    parkGlobalsPanel(win);
  }

  if (!keepIds.includes(GLOBAL_SECTION_PANEL_ID) && !keepIds.includes(GLOBAL_SECTION_HOST_ID)) {
    closeGlobalSectionPanel(win);
  }

  if (!keepIds.includes(CHROME_DESIGNS_ID)) {
    closeChromeDesignsPanel(win);
  }
}

/**
 * Push the preview away from RIGHT-docked panels (Theme Settings, sections library, …).
 */
function syncPreviewInset(win) {
  const doc = win.document;
  const el = doc.querySelector('.live-preview-contents');

  if (!el) {
    return;
  }

  const right = dockedPanelWidth(doc, [
    SECTION_PICKER_ID,
    OUTLINE_PANEL_ID,
    LISTVIEW_PANEL_ID,
    GLOBALS_PANEL_ID,
  ]);

  el.style.transition = 'padding-right .2s ease';
  el.style.paddingRight = right ? `${right}px` : '';
  el.style.paddingLeft = '';

  positionLpBackButton(win);
}

function livePreviewEditorEl(doc) {
  return doc.querySelector('.live-preview-editor');
}

/**
 * Dock Theme Settings on the RIGHT (same slot as the sections library).
 * Stays on document.body — reparenting an iframe reloads it (preview flicker).
 */
function pinGlobalsPanelRight(win, panel) {
  const doc = win.document;

  if (panel.parentElement !== doc.body) {
    doc.body.appendChild(panel);
  }

  if (!panel.querySelector('[data-sve-globals-resizer]')) {
    const handle = globalsResizer(win, panel);

    handle.setAttribute('data-sve-globals-resizer', '');
    panel.insertBefore(handle, panel.firstChild);
  }

  const place = () => {
    if (panel.hasAttribute('data-sve-chrome-hidden')) {
      return;
    }

    const header = lpHeader(doc);
    const top = header ? Math.round(header.getBoundingClientRect().bottom) : 0;
    const width = globalsPanelWidth(win);

    panel.style.cssText =
      `position:fixed;top:${top}px;right:0;bottom:0;width:${width}px;z-index:40;` +
      'display:flex;flex-direction:column;visibility:visible;pointer-events:auto;' +
      'background:var(--theme-color-content-bg,#fff);color:currentColor;' +
      'border-left:1px solid rgba(128,128,128,.28);box-shadow:-8px 0 24px rgba(0,0,0,.18);' +
      'font-family:ui-sans-serif,system-ui,sans-serif;';
  };

  place();

  if (!panel._svePinBound) {
    panel._svePinBound = true;
    win.addEventListener('resize', place);
  }
}

/** @deprecated alias — Theme Settings docks right now. */
function pinGlobalsPanelToEditor(win, panel) {
  pinGlobalsPanelRight(win, panel);
}

/** Absolute fill CSS — only for designs cards that are not an iframe form. */
function editorOverlayCss() {
  return (
    'position:absolute;inset:0;width:auto;height:auto;z-index:50;overflow:hidden;' +
    'display:flex;flex-direction:column;background:var(--theme-color-content-bg,#fff);' +
    'color:currentColor;border:0;box-shadow:none;font-family:ui-sans-serif,system-ui,sans-serif;'
  );
}

/**
 * Open Statamic's left Live Preview editor and keep it open. Chrome UI mounts
 * inside it so switching footer ↔ hero never changes sidebar width.
 */
function claimLivePreviewEditor(win) {
  clearSolo(win.document);

  if (headerTab === 'settings') {
    setHeaderTab(win, null);
  }

  forcePanelOpen = true;
  setLpCollapsed(win, false);
  applyHeaderTab(win);

  const editor = livePreviewEditorEl(win.document);

  if (editor && win.getComputedStyle(editor).position === 'static') {
    editor.style.position = 'relative';
  }
}

/** @deprecated name — now claims the shared LP editor instead of collapsing it. */
function borrowLeftEdge(win) {
  claimLivePreviewEditor(win);
}

/** Designs panel (no iframe) can still mount inside the editor. */
function mountInLivePreviewEditor(win, panel) {
  claimLivePreviewEditor(win);

  const doc = win.document;
  const editor = livePreviewEditorEl(doc);
  const visible = panel.style.display !== 'none' && !panel.hasAttribute('data-sve-chrome-hidden');

  panel.style.cssText = editorOverlayCss();
  panel.style.display = visible ? 'flex' : 'none';

  if (!editor) {
    doc.body.appendChild(panel);

    return;
  }

  if (win.getComputedStyle(editor).position === 'static') {
    editor.style.position = 'relative';
  }

  if (panel.parentElement !== editor) {
    editor.appendChild(panel);
  }
}

/** After chrome overlays close, follow LP mode — unless a solo section needs the pane. */
function releaseLeftEdgeIfFree(win) {
  const doc = win.document;

  if (dockedPanelWidth(doc, [GLOBALS_PANEL_ID, CHROME_DESIGNS_ID]) > 0) {
    return;
  }

  forcePanelOpen = false;

  if (!lpHeader(doc)) {
    return;
  }

  if (soloUid) {
    setLpCollapsed(win, false);

    return;
  }

  setLpCollapsed(win, lpMode(win) !== 'show');
}

/**
 * Leave header/footer chrome focus so a page section can use the left editor.
 * Theme Settings stays on the right (form + stash intact) — only chrome designs
 * and tab-lock are cleared.
 */
function dismissChromeForPageEdit(win) {
  win.document.getElementById(CHROME_DESIGNS_ID)?.remove();
  removeChromeModeToggles(win);
  setActiveChromeKind(null);
  // In this window the chrome form IS the left editor, so a page section can only
  // have it once that form is out of the way. Its stash stays until the section
  // click that got us here has been answered — the preview is still rendering the
  // header as it is being typed.
  closeChromeInline(win, { refresh: false });
  unlockChromeGlobalsTabs(win);
  forcePanelOpen = false;
  syncPreviewInset(win);
  syncSectionLibraryAvailability(win);
}

/** Visible width of the widest panel in `ids` (0 if none). */
function dockedPanelWidth(doc, ids) {
  let px = 0;

  for (const id of ids) {
    const panel = doc.getElementById(id);

    if (!panel || panel.style.display === 'none' || panel.hasAttribute('data-sve-chrome-hidden')) {
      continue;
    }

    px = Math.max(px, Math.round(panel.getBoundingClientRect().width));
  }

  return px;
}

/** @deprecated use dockedPanelWidth — kept for call sites that mean "right edge" */
function rightPanelWidth(doc) {
  return dockedPanelWidth(doc, [
    SECTION_PICKER_ID,
    GLOBAL_SECTION_PANEL_ID,
    GLOBALS_PANEL_ID,
  ]);
}

// The section library is a docked panel, not a popup: it stays open while you
// work, and you drag a card straight into the preview to place it (or click to
// drop it at the end). The pending drag lives here so the ext-drop reply from
// the bridge knows what to insert.
let libraryDrag = null;

/** Handle prefix before `/` — `hero/style_1` → `hero`. Bare handles → `other`. */
function libraryGroupKey(handle) {
  if (!handle || typeof handle !== 'string' || !handle.includes('/')) {
    return 'other';
  }

  return handle.split('/')[0].toLowerCase();
}

/** Human label for a group key (`hero` → `Hero`, `media_textbox` → `Media textbox`). */
function libraryGroupLabel(win, key) {
  if (key === 'other') {
    return t(win, 'library_group_other');
  }

  const spaced = key.replace(/[_-]+/g, ' ');

  return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Case-insensitive match against display/title and handle. */
function libraryMatchesQuery(item, query) {
  const q = (query || '').trim().toLowerCase();

  if (!q) {
    return true;
  }

  const haystack = [item.display, item.title, item.handle]
    .filter((v) => typeof v === 'string' && v.length)
    .join(' ')
    .toLowerCase();

  return haystack.includes(q);
}

/** Opens/creates the docked section library. Toggles closed if already open. */
function openSectionPicker(win, options = {}) {
  const doc = win.document;
  const initialTab = options.tab || null;

  // Switched off for this site. Checked here rather than only where the toolbar
  // icon is built, because the "add a section below" control in the preview opens
  // the library too — one gate covers every way in.
  if (!featureOn(win, 'sections')) {
    return;
  }

  // Header/footer chrome and global-section edit own the page — no section drops.
  if (isSectionLibraryLocked(win)) {
    closeSectionPicker(win);
    syncSectionLibraryAvailability(win);

    return;
  }

  if (doc.getElementById(SECTION_PICKER_ID)) {
    if (initialTab) {
      doc.getElementById(SECTION_PICKER_ID).dispatchEvent(
        new CustomEvent('sve-set-tab', { detail: { tab: initialTab } })
      );

      return;
    }

    closeSectionPicker(win);

    return;
  }

  // Theme Settings owns the same right slot — close it first (warn if dirty).
  const globalsPanel = doc.getElementById(GLOBALS_PANEL_ID);
  const globalsVisible = globalsPanel && !globalsPanel.hasAttribute('data-sve-chrome-hidden');

  if (globalsVisible && hasUnsavedGlobals(win)) {
    confirmCloseDiscard(
      win,
      { titleKey: 'globals_close_title', bodyKey: 'globals_close_body' },
      () => {
        discardGlobalsChanges(win, { refresh: true, reloadForm: false }).then(() =>
          mountSectionPicker(win, options)
        );
      },
      () => {},
      () => {
        saveGlobalsPanel(win, (ok) => {
          if (ok) {
            mountSectionPicker(win, options);
          }
        });
      }
    );

    return;
  }

  mountSectionPicker(win, options);
}

/** Build the sections library panel (right dock). Caller has already handled globals. */
function mountSectionPicker(win, options = {}) {
  const doc = win.document;
  const initialTab = options.tab || null;

  if (doc.getElementById(SECTION_PICKER_ID)) {
    return;
  }

  // Same right slot as Theme Settings — park globals (stash kept unless discarded above).
  closeRightPanels(win, [SECTION_PICKER_ID, CHROME_DESIGNS_ID]);

  const header = lpHeader(doc);
  const top = header ? Math.round(header.getBoundingClientRect().bottom) : 0;
  const width = globalsPanelWidth(win);

  const panel = doc.createElement('div');

  panel.id = SECTION_PICKER_ID;
  panel.style.cssText =
    `position:fixed;top:${top}px;right:0;bottom:0;width:${width}px;z-index:41;display:flex;flex-direction:column;` +
    'background:var(--theme-color-content-bg,#fff);color:currentColor;' +
    'border-left:1px solid rgba(128,128,128,.28);box-shadow:-8px 0 24px rgba(0,0,0,.18);' +
    'font-family:ui-sans-serif,system-ui,sans-serif;overflow:hidden;';

  panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid rgba(128,128,128,.2);flex:0 0 auto;">
      <div style="font-size:14px;font-weight:600;">${t(win, 'sections')}</div>
      <button type="button" data-sve-close style="all:unset;cursor:pointer;width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;border-radius:6px;opacity:.7;">✕</button>
    </div>
    <div data-sve-hint style="padding:6px 10px;font-size:11px;opacity:.6;flex:0 0 auto;">${t(win, 'library_hint')}</div>
    <div data-sve-tabs style="display:flex;gap:3px;padding:2px 12px 0;flex:0 0 auto;"></div>
    <div data-sve-search-wrap style="padding:8px 12px 0;flex:0 0 auto;">
      <input data-sve-search type="search" autocomplete="off" placeholder="${t(win, 'library_search_placeholder')}"
        style="width:100%;box-sizing:border-box;padding:8px 10px;border-radius:8px;border:1px solid rgba(128,128,128,.3);
        background:rgba(128,128,128,.06);color:currentColor;font:inherit;font-size:12px;outline:none;">
    </div>
    <div data-sve-groups style="display:none;flex-wrap:nowrap;gap:4px;padding:8px 0 0 12px;margin-right:12px;flex:0 0 auto;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;"></div>
    <style>[data-sve-groups]::-webkit-scrollbar{display:none}</style>
    <div data-sve-scroll style="flex:1 1 auto;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:12px;">
      <div data-sve-grid style="column-gap:12px;"></div>
    </div>
  `;

  // The group chips scroll sideways when they do not fit. A soft right edge says
  // there is more to come; it lifts once the last chip is in view, so a row that
  // fits keeps its chips at full strength.
  const syncGroupsFade = () => {
    const groups = panel.querySelector('[data-sve-groups]');

    if (!groups) {
      return;
    }

    const more = groups.scrollWidth - groups.clientWidth - groups.scrollLeft > 1;
    const mask = more ? 'linear-gradient(to right,#000 calc(100% - 36px),transparent 100%)' : '';

    groups.style.webkitMaskImage = mask;
    groups.style.maskImage = mask;
  };

  const applyLibraryLayout = () => {
    const w = panel.getBoundingClientRect().width || width;
    const cols = w >= 720 ? 3 : w >= 480 ? 2 : 1;
    const grid = panel.querySelector('[data-sve-grid]');

    syncGroupsFade();

    if (!grid) {
      return;
    }

    // Masonry lives on an unconstrained inner box; the outer [data-sve-scroll]
    // scrolls. Putting column-count on the scroll box itself overflows sideways.
    grid.style.columnCount = String(cols);
  };

  panel.appendChild(panelResizer(win, panel, { side: 'right', onResize: applyLibraryLayout }));
  doc.body.appendChild(panel);
  applyLibraryLayout();
  syncPreviewInset(win);

  const tabsEl = panel.querySelector('[data-sve-tabs]');
  const searchEl = panel.querySelector('[data-sve-search]');
  const groupsEl = panel.querySelector('[data-sve-groups]');
  const gridEl = panel.querySelector('[data-sve-grid]');

  panel.querySelector('[data-sve-close]').addEventListener('click', () => closeSectionPicker(win));
  groupsEl.addEventListener('scroll', syncGroupsFade);

  const tabs = [
    { key: 'page', feature: 'library_page', label: t(win, 'tab_page') },
    { key: 'custom', feature: 'library_custom', label: t(win, 'tab_custom') },
    { key: 'global', feature: 'library_global', label: t(win, 'tab_global') },
    { key: 'template', feature: 'library_templates', label: t(win, 'tab_templates') },
  ].filter((tab) => featureOn(win, tab.feature));

  // 'page' is the natural landing tab, but a site can switch it off — then the
  // first tab that survived is what opens.
  const fallbackTab = tabs.some((tab) => tab.key === 'page') ? 'page' : tabs[0]?.key;
  let active = initialTab && tabs.some((tab) => tab.key === initialTab) ? initialTab : fallbackTab;
  let saved = null;
  let templates = null;
  let query = '';
  let group = null; // null = all groups
  // When the pictures were last asked for. Not a plain "already asked" flag: the
  // library stays open while its owner edits a section's template in an editor,
  // and coming back to the Page tab afterwards should show what that edit did.
  // A timestamp asks again then, while ignoring the re-render every keystroke in
  // the search field causes.
  let typesAskedAt = 0;


  // Natural-height preview cards in a CSS-columns masonry grid. The image sets
  // the card height (no fixed crop); break-inside keeps a card in one column.
  const card = (title, imageUrl, kind, item) => {
    const el = doc.createElement('div');

    el.style.cssText =
      'cursor:grab;display:inline-block;width:100%;break-inside:avoid;margin:0 0 12px;border:1px solid rgba(128,128,128,.25);' +
      'border-radius:10px;overflow:hidden;background:rgba(128,128,128,.05);transition:border-color .12s;' +
      'user-select:none;touch-action:none;vertical-align:top;';
    el.addEventListener('mouseenter', () => (el.style.borderColor = 'var(--theme-color-primary,#4f46e5)'));
    el.addEventListener('mouseleave', () => (el.style.borderColor = 'rgba(128,128,128,.25)'));
    el.innerHTML = `
      <div style="width:100%;background:rgba(128,128,128,.12);pointer-events:none;">
        ${
          imageUrl
            ? `<img src="${imageUrl}" alt="" style="width:100%;height:auto;display:block;">`
            : `<div style="width:100%;aspect-ratio:3/1;min-height:56px;display:flex;align-items:center;justify-content:center;opacity:.4;font-size:12px;">${t(win, 'no_preview')}</div>`
        }
      </div>
      <div style="display:flex;align-items:center;gap:6px;padding:8px 10px;">
        <div data-sve-card-title style="flex:1 1 auto;min-width:0;font-size:12px;font-weight:500;pointer-events:none;
          overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></div>
      </div>
    `;

    el.querySelector('[data-sve-card-title]').textContent = title;

    // Whether the trash appears at all is the server's call, per item: content
    // needs delete rights on the entry, a section type needs `configure fields`.
    if (item?.can_delete) {
      el.querySelector('[data-sve-card-title]').after(
        libraryDeleteButton(win, kind, item, () => {
          // Whichever list it came from is now stale — drop both so the tab
          // refetches, and re-render what's on screen. (A section type needs no
          // refetch: the delete handed back the fresh list.)
          saved = null;
          templates = null;
          renderActive();
        })
      );
    }

    beginCardDrag(win, el, kind, item);

    return el;
  };

  const empty = (text) => {
    const el = doc.createElement('div');

    el.style.cssText =
      'padding:30px 6px;text-align:center;opacity:.55;font-size:12px;column-span:all;break-inside:avoid;';
    el.textContent = text;

    return el;
  };

  const styleChip = (btn, on) => {
    btn.style.background = on ? 'var(--theme-color-primary,#4f46e5)' : 'rgba(128,128,128,.22)';
    btn.style.color = on ? '#fff' : 'currentColor';
    btn.style.fontWeight = on ? '600' : '500';
    btn.style.opacity = '1';
  };

  const renderGroups = () => {
    groupsEl.innerHTML = '';

    if (active !== 'page') {
      groupsEl.style.display = 'none';

      return;
    }

    const keys = [...new Set(sectionTypes(win).map((type) => libraryGroupKey(type.handle)))];
    const ordered = keys
      .filter((k) => k !== 'other')
      .sort((a, b) => a.localeCompare(b))
      .concat(keys.includes('other') ? ['other'] : []);

    if (ordered.length < 2) {
      groupsEl.style.display = 'none';
      group = null;

      return;
    }

    groupsEl.style.display = 'flex';

    const chipStyle =
      'all:unset;cursor:pointer;flex:0 0 auto;white-space:nowrap;padding:4px 10px;border-radius:999px;font-size:11px;color:currentColor;';

    const allBtn = doc.createElement('button');

    allBtn.type = 'button';
    allBtn.textContent = t(win, 'library_group_all');
    allBtn.style.cssText = chipStyle;
    styleChip(allBtn, group === null);
    allBtn.addEventListener('click', () => {
      group = null;
      renderActive();
    });
    groupsEl.appendChild(allBtn);

    ordered.forEach((key) => {
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.textContent = libraryGroupLabel(win, key);
      btn.style.cssText = chipStyle;
      styleChip(btn, group === key);
      btn.addEventListener('click', () => {
        group = key;
        renderActive();
      });
      groupsEl.appendChild(btn);
    });

    syncGroupsFade();
  };

  const renderPage = () => {
    gridEl.innerHTML = '';

    const types = sectionTypes(win);

    if (!types.length) {
      gridEl.appendChild(empty(t(win, 'no_section_types')));

      return;
    }

    const filtered = types.filter((type) => {
      if (group && libraryGroupKey(type.handle) !== group) {
        return false;
      }

      return libraryMatchesQuery(type, query);
    });

    if (!filtered.length) {
      gridEl.appendChild(empty(t(win, 'library_no_matches')));

      return;
    }

    filtered.forEach((type) => gridEl.appendChild(card(type.display, type.image_url, 'page', type)));
  };

  const renderSaved = (synced) => {
    gridEl.innerHTML = '';

    const items = (saved || []).filter((s) => !!s.synced === synced);

    if (!items.length) {
      gridEl.appendChild(
        empty(
          synced
            ? t(win, 'no_global_sections')
            : t(win, 'no_saved_sections')
        )
      );

      return;
    }

    const filtered = items.filter((item) => libraryMatchesQuery(item, query));

    if (!filtered.length) {
      gridEl.appendChild(empty(t(win, 'library_no_matches')));

      return;
    }

    filtered.forEach((item) =>
      gridEl.appendChild(card(item.title, item.preview_url, synced ? 'global' : 'custom', item))
    );
  };

  // A template's card carries the whole page, so it says how many sections that
  // is — the picture alone can't tell you whether you're about to drop three
  // sections or fifteen.
  const renderTemplates = () => {
    gridEl.innerHTML = '';

    const save = doc.createElement('button');

    save.type = 'button';
    save.textContent = t(win, 'save_page_as_template');
    save.style.cssText =
      'all:unset;cursor:pointer;display:block;width:100%;box-sizing:border-box;column-span:all;break-inside:avoid;' +
      'text-align:center;padding:10px;margin:0 0 12px;border-radius:8px;font-size:12px;' +
      'font-weight:600;background:var(--theme-color-primary,#4f46e5);color:#fff;';
    save.addEventListener('click', () => savePageAsTemplate(win, () => {
      templates = null;
      renderActive();
    }));
    gridEl.appendChild(save);

    if (!(templates || []).length) {
      gridEl.appendChild(empty(t(win, 'no_templates')));

      return;
    }

    const filtered = templates.filter((item) => libraryMatchesQuery(item, query));

    if (!filtered.length) {
      gridEl.appendChild(empty(t(win, 'library_no_matches')));

      return;
    }

    filtered.forEach((item) =>
      gridEl.appendChild(
        card(`${item.title} · ${t(win, 'template_count', { count: item.count })}`, item.preview_url, 'template', item)
      )
    );
  };

  // Design cards for header/footer live in the LEFT chrome-designs panel now —
  // not in this sections library.

  const renderActive = () => {
    tabsEl.querySelectorAll('button').forEach((b) => {
      const on = b.dataset.tab === active;

      b.style.background = on ? 'rgba(128,128,128,.2)' : 'transparent';
      b.style.fontWeight = on ? '600' : '500';
      b.style.opacity = on ? '1' : '.7';
    });

    const hintEl = panel.querySelector('[data-sve-hint]');

    if (hintEl) {
      hintEl.textContent = t(win, 'library_hint');
    }

    if (searchEl) {
      searchEl.placeholder = t(win, 'library_search_placeholder');
    }

    renderGroups();

    if (active === 'page') {
      // Ask the server what the sections look like now, and keep asking while it
      // is busy retaking the pictures.
      if (Date.now() - typesAskedAt > 10000) {
        typesAskedAt = Date.now();
        refreshSectionTypes(win, () => {
          if (active === 'page') {
            renderPage();
          }
        });
      }

      renderPage();

      return;
    }

    if (active === 'template') {
      if (templates === null) {
        gridEl.innerHTML = '';
        gridEl.appendChild(empty(t(win, 'loading')));

        pollLibrary(
          win,
          '/!/sve/templates',
          (data) => data.templates || [],
          (items) => {
            templates = items;

            if (active === 'template') {
              renderTemplates();
            }
          },
          () => {
            templates = [];
            gridEl.innerHTML = '';
            gridEl.appendChild(empty(t(win, 'templates_failed')));
          }
        );

        return;
      }

      renderTemplates();

      return;
    }

    if (saved === null) {
      gridEl.innerHTML = '';
      gridEl.appendChild(empty(t(win, 'loading')));

      pollLibrary(
        win,
        '/!/sve/saved-sections',
        (data) => data.sections || [],
        (items) => {
          saved = items;

          if (active === 'custom' || active === 'global') {
            renderSaved(active === 'global');
          }
        },
        () => {
          saved = [];
          gridEl.innerHTML = '';
          gridEl.appendChild(empty(t(win, 'saved_sections_failed')));
        }
      );

      return;
    }

    renderSaved(active === 'global');
  };

  searchEl.addEventListener('input', () => {
    query = searchEl.value;
    renderActive();
  });

  tabs.forEach((tab) => {
    const b = doc.createElement('button');

    b.type = 'button';
    b.dataset.tab = tab.key;
    b.textContent = tab.label;
    b.style.cssText = 'all:unset;cursor:pointer;padding:6px 12px;border-radius:8px;font-size:12px;color:currentColor;';
    b.addEventListener('click', () => {
      active = tab.key;
      if (active !== 'page') {
        group = null;
      }
      renderActive();
    });
    tabsEl.appendChild(b);
  });

  // Something was added to a library while this panel was open — a section just
  // saved from the editor, most often. The lists it has are from before that, so
  // it drops them and asks again; the new card arrives without its picture and
  // pollLibrary fills that in a few seconds later, when the screenshot lands.
  panel.addEventListener('sve-library-stale', () => {
    saved = null;
    templates = null;

    // The Page tab too, when the reason was a change to the design itself:
    // Theme Settings are in every preview's fingerprint, so the section types
    // are just as wrong as the saved sections. Their list lives in its own
    // cache, filled by its own poller, so dropping `saved` alone left the Page
    // tab showing the old colours while Custom had caught up.
    sectionTypesOverride = null;
    refreshSectionTypes(win, () => renderActive());

    renderActive();
  });

  panel.addEventListener('sve-set-tab', (event) => {
    const next = event.detail?.tab;

    if (!next || !tabs.some((tab) => tab.key === next)) {
      return;
    }

    active = next;
    group = null;
    renderActive();

    const activeBtn = tabsEl.querySelector(`[data-tab="${next}"]`);

    activeBtn?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  });

  renderActive();
  searchEl.focus();
}

const LIBRARY_DELETE_ID = '__sve-library-delete';

const TRASH_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
  'style="display:block;pointer-events:none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>' +
  '<path d="M10 11v6M14 11v6"/></svg>';

/**
 * The trash on a library card.
 *
 * Its pointerdown is swallowed so the card's drag handler never starts: without
 * that, aiming for the trash would pick the card up and — under the drag
 * threshold — drop the section onto the page instead of deleting it.
 */
function libraryDeleteButton(win, kind, item, onDeleted) {
  const btn = win.document.createElement('button');

  btn.type = 'button';
  btn.title = t(win, 'delete_item');
  btn.setAttribute('aria-label', t(win, 'delete_item'));
  btn.innerHTML = TRASH_ICON;
  btn.style.cssText =
    'all:unset;cursor:pointer;flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;' +
    'width:24px;height:24px;border-radius:6px;color:currentColor;opacity:.45;transition:opacity .12s,color .12s;';
  btn.addEventListener('mouseenter', () => {
    btn.style.opacity = '1';
    btn.style.color = '#dc2626';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.opacity = '.45';
    btn.style.color = 'currentColor';
  });
  btn.addEventListener('pointerdown', (event) => event.stopPropagation());
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    confirmDeleteLibraryItem(win, kind, item, onDeleted);
  });

  return btn;
}

/**
 * "Are you sure?" for deleting something out of the library.
 *
 * Three different things, three different costs. A template and a custom section
 * are only ever *copied* onto a page, so the pages built from one keep what they
 * have and the question is simple. A global section is a live reference: the
 * dialog looks first, and if pages point at it they're named, because confirming
 * takes the section off all of them. A section *type* is heavier still — the set
 * leaves the fieldset, so no page can ever add one again, and the pages that
 * have one lose it along with its content.
 */
function confirmDeleteLibraryItem(win, kind, item, onDeleted) {
  const doc = win.document;
  const isTemplate = kind === 'template';
  const isType = kind === 'page';
  const name = item.display || item.title;

  doc.getElementById(LIBRARY_DELETE_ID)?.remove();

  const overlay = createPreviewCenteredOverlay(doc, LIBRARY_DELETE_ID);
  const card = doc.createElement('div');

  card.style.cssText = dialogCardStyle(win);
  card.innerHTML =
    '<div data-sve-title style="font-size:15px;font-weight:600;margin-bottom:6px;"></div>' +
    '<div data-sve-body style="font-size:13px;opacity:.75;line-height:1.45;margin-bottom:18px;"></div>' +
    '<div data-sve-actions style="display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;"></div>';

  const titleEl = card.querySelector('[data-sve-title]');
  const bodyEl = card.querySelector('[data-sve-body]');
  const actions = card.querySelector('[data-sve-actions]');
  const close = () => overlay.remove();

  const titleKey = isTemplate
    ? 'delete_template_title'
    : isType
      ? 'delete_section_type_title'
      : 'delete_saved_section_title';

  titleEl.textContent = t(win, titleKey, { name });
  bodyEl.textContent = t(win, isTemplate ? 'delete_template_body' : 'delete_checking');

  const button = (label, style, onClick) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = label;
    btn.style.cssText = style;
    btn.addEventListener('click', () => {
      close();
      onClick();
    });
    actions.appendChild(btn);
  };

  const cancelOnly = () => {
    actions.textContent = '';
    button(t(win, 'cancel'), dialogCancelButtonStyle(win), () => {});
  };

  const withConfirm = (confirmKey, removeUsages) => {
    cancelOnly();
    button(t(win, confirmKey), dialogDangerButtonStyle(), () =>
      deleteLibraryItem(win, kind, item, removeUsages, onDeleted)
    );
  };

  overlay.addEventListener('click', (event) => event.target === overlay && close());
  overlay.appendChild(card);
  doc.body.appendChild(overlay);

  if (isTemplate) {
    withConfirm('delete_confirm', false);

    return;
  }

  // Cancel only until we know what it costs — the delete button arrives with the
  // answer, so nothing can be confirmed before the question is complete.
  cancelOnly();

  const usageUrl = isType
    ? `/!/sve/section-types/usage?handle=${encodeURIComponent(item.handle)}`
    : `/!/sve/saved-sections/${encodeURIComponent(item.id)}/usage`;

  win
    .fetch(usageUrl, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((data) => {
      const usages = data.usages || [];

      if (!usages.length) {
        // A custom section's copies live on regardless; a synced one that nobody
        // points at simply goes; a type leaves the fieldset either way. Three
        // different reasons for "nothing else changes", so three sentences.
        bodyEl.textContent = t(
          win,
          isType
            ? 'delete_section_type_body'
            : item.synced
              ? 'delete_global_section_unused_body'
              : 'delete_saved_section_body'
        );
        withConfirm('delete_confirm', false);

        return;
      }

      bodyEl.textContent = '';
      bodyEl.appendChild(
        usageList(win, usages, isType ? ['delete_section_type_body', 'delete_section_type_used'] : ['delete_global_section_body'])
      );
      withConfirm('delete_confirm_everywhere', true);
    })
    .catch(() => {
      bodyEl.textContent = t(win, 'delete_usage_failed');
    });
}

/** The pages something sits on, listed under whatever the warning is. */
function usageList(win, usages, leadKeys) {
  const doc = win.document;
  const wrap = doc.createElement('div');

  leadKeys.forEach((key) => {
    const warning = doc.createElement('div');

    warning.textContent = t(win, key);
    warning.style.cssText = 'margin-bottom:10px;';
    wrap.appendChild(warning);
  });

  const heading = doc.createElement('div');

  heading.textContent =
    usages.length === 1
      ? t(win, 'delete_usage_heading_one')
      : t(win, 'delete_usage_heading', { count: usages.length });
  heading.style.cssText = 'font-weight:600;opacity:.9;margin-bottom:4px;';
  wrap.appendChild(heading);

  const list = doc.createElement('ul');

  list.style.cssText = 'margin:0;padding:0;list-style:none;max-height:180px;overflow-y:auto;';

  usages.forEach((usage) => {
    const li = doc.createElement('li');

    li.style.cssText =
      'display:flex;gap:6px;align-items:baseline;padding:3px 0;border-top:1px solid rgba(128,128,128,.18);';

    const name = doc.createElement('span');

    name.textContent = usage.title;
    name.style.cssText = 'flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';

    const where = doc.createElement('span');

    // The collection, so two pages with the same name are still tellable apart —
    // and so a template holding the section doesn't read as a page.
    where.textContent =
      usage.count > 1
        ? `${usage.collection_title} · ${t(win, 'delete_usage_count', { count: usage.count })}`
        : usage.collection_title;
    where.style.cssText = 'flex:0 0 auto;opacity:.6;font-size:12px;';

    li.append(name, where);
    list.appendChild(li);
  });

  wrap.appendChild(list);

  return wrap;
}

/** Sends the delete, then tells the picker to reload the list it came from. */
function deleteLibraryItem(win, kind, item, removeUsages, onDeleted) {
  const name = item.display || item.title;
  const suffix = removeUsages ? 'remove_usages=1' : '';

  const url =
    kind === 'template'
      ? `/!/sve/templates/${encodeURIComponent(item.id)}`
      : kind === 'page'
        ? `/!/sve/section-types?handle=${encodeURIComponent(item.handle)}${suffix ? `&${suffix}` : ''}`
        : `/!/sve/saved-sections/${encodeURIComponent(item.id)}${suffix ? `?${suffix}` : ''}`;

  win
    .fetch(url, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'X-CSRF-TOKEN': csrfToken(win),
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    .then(async (res) => {
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        win.Statamic?.$toast?.error(t(win, 'delete_failed'));

        return;
      }

      // The page open in the editor holds its own copy of the form. The server
      // took the rows out of the entry on disk, but not out of this — and saving
      // the page would write them straight back.
      if (kind === 'global') {
        stripSectionsFromForm(win, sectionReferenceMatcher(win, item.id));
      } else if (kind === 'page') {
        stripSectionsFromForm(win, (row) => row?.type === item.handle);
        // The picker's type list came from the page render, and one of them no
        // longer exists. The server sent the fresh list back with the delete.
        if (Array.isArray(body.section_types)) {
          sectionTypesOverride = body.section_types;
        }
      }

      win.Statamic?.$toast?.success(
        body.removed_from
          ? t(win, 'deleted_toast_everywhere', { name, count: body.removed_from })
          : t(win, 'deleted_toast', { name })
      );

      onDeleted();
    })
    .catch(() => win.Statamic?.$toast?.error(t(win, 'delete_failed')));
}

/** Matches a `global_section` row pointing at a given saved-section entry. */
function sectionReferenceMatcher(win, savedEntryId) {
  const set = globalSectionSet(win);
  const id = String(savedEntryId);

  return (row) =>
    row !== null &&
    typeof row === 'object' &&
    row.type === set &&
    [].concat(row[set] ?? []).map(String).includes(id);
}

/** Takes every matching section row out of the form open in the editor. */
function stripSectionsFromForm(win, matches) {
  const doc = win.document;
  const field = sectionField(win);

  const strip = (node) => {
    if (Array.isArray(node)) {
      return node.filter((entry) => !matches(entry)).map(strip);
    }

    if (node !== null && typeof node === 'object') {
      return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, strip(value)]));
    }

    return node;
  };

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);
    const rows = values && typeof values === 'object' ? values[field] : null;

    if (!Array.isArray(rows)) {
      continue;
    }

    const before = JSON.parse(JSON.stringify(rows));
    const next = strip(before);

    if (JSON.stringify(next) !== JSON.stringify(before)) {
      container.setFieldValue(field, next);
    }
  }
}

/**
 * Pointer drag on a library card. Below the threshold it's a click (drop at the
 * end); beyond it, the preview zooms out and shows a drop line, and releasing
 * drops the section where the line is. The preview owns the zoom + line + target
 * detection; this side just forwards the pointer and inserts on the reply.
 */
function beginCardDrag(win, cardEl, kind, item) {
  cardEl.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || libraryDrag) {
      return;
    }

    event.preventDefault();
    cardEl.setPointerCapture(event.pointerId);

    const doc = win.document;
    const frame = previewFrame(doc);
    const startX = event.clientX;
    const startY = event.clientY;
    let active = false;
    let ghost = null;

    const toPreview = (e) => {
      const r = frame.getBoundingClientRect();

      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const start = () => {
      active = true;
      // The iframe would swallow the pointer once we're over it — let this window
      // keep the events, and map the coordinates ourselves.
      frame.style.pointerEvents = 'none';
      frame.contentWindow.postMessage({ source: 'statamic-visual-editor', type: 'ext-drag-start' }, win.location.origin);

      ghost = cardEl.cloneNode(true);
      ghost.style.cssText +=
        ';position:fixed;z-index:2147483647;pointer-events:none;width:220px;opacity:.9;transform:rotate(1.5deg);box-shadow:0 12px 32px rgba(0,0,0,.3);';
      doc.body.appendChild(ghost);
    };

    const onMove = (e) => {
      if (!active) {
        if (Math.hypot(e.clientX - startX, e.clientY - startY) < 6) {
          return;
        }

        start();
      }

      const p = toPreview(e);

      frame.contentWindow.postMessage(
        { source: 'statamic-visual-editor', type: 'ext-drag-move', x: p.x, y: p.y },
        win.location.origin
      );

      if (ghost) {
        ghost.style.left = `${e.clientX - 110}px`;
        ghost.style.top = `${e.clientY - 16}px`;
      }
    };

    const onUp = (e) => {
      win.removeEventListener('pointermove', onMove);
      win.removeEventListener('pointerup', onUp);
      win.removeEventListener('pointercancel', onUp);
      ghost?.remove();

      if (!active) {
        // A click: drop at the end of the page.
        insertSection(win, doc, lastSectionUid(doc), kind, item);

        return;
      }

      // The bridge replies with ext-drop → the message listener inserts.
      libraryDrag = { kind, item };
      frame.style.pointerEvents = '';
      frame.contentWindow.postMessage(
        { source: 'statamic-visual-editor', type: 'ext-drag-end', cancelled: e.type === 'pointercancel' },
        win.location.origin
      );
    };

    win.addEventListener('pointermove', onMove);
    win.addEventListener('pointerup', onUp);
    win.addEventListener('pointercancel', onUp);
  });
}

/** The uid of the last top-level page section in the preview (for click-append). */
function lastSectionUid(doc) {
  const frame = previewFrame(doc);
  const inner = frame?.contentDocument;
  const sections = inner ? [...inner.querySelectorAll('section[data-sid], article[data-sid]')] : [];

  return sections.length ? sections[sections.length - 1].getAttribute('data-sid') : null;
}

/** A fresh row id in the same shape Statamic uses for replicator/grid rows. */
function newRowId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/**
 * A blank row modelled on an existing one.
 *
 * Copying the row's shape rather than building one from the blueprint: the
 * blueprint isn't reachable from here, and a row that's missing keys renders
 * wrong. Text is cleared, ids are regenerated, and everything else is kept —
 * so a new button arrives with the same styling and an empty label, ready to
 * fill in, rather than as something the template can't render.
 */
function blankRowFrom(row) {
  const next = {};

  for (const [key, value] of Object.entries(row)) {
    if (key === 'id' || key === '_id') {
      next[key] = newRowId();
    } else if (key === '_visual_id') {
      next[key] = crypto?.randomUUID ? crypto.randomUUID() : `${newRowId()}-${newRowId()}`;
    } else if (key === 'type' || key === 'enabled') {
      // Replicator sets need their type intact — clearing it yields
      // "Undefined array key type" when the preview augments the field.
      next[key] = value;
    } else if (typeof value === 'string') {
      next[key] = '';
    } else {
      next[key] = JSON.parse(JSON.stringify(value ?? null));
    }
  }

  return next;
}

/**
 * Walks the container meta alongside the values to the field meta at `path`.
 * Meta mirrors the values tree but keys array rows by their `_id`
 * (`existing[<_id>]`) rather than by index, so numeric path segments are
 * resolved through the value at that index. Returns null if the path can't be
 * followed.
 */
function metaForPath(fullMeta, values, path) {
  let meta = fullMeta;
  let val = values;

  for (const seg of path.split('.')) {
    if (meta == null) {
      return null;
    }

    if (/^\d+$/.test(seg)) {
      const row = Array.isArray(val) ? val[Number(seg)] : null;

      if (!row || !meta.existing) {
        return null;
      }

      meta = meta.existing[row._id];
      val = row;
    } else {
      meta = meta[seg];
      val = val ? val[seg] : null;
    }
  }

  return meta;
}

/**
 * A new row for an orderable field, pre-filled with the field's DEFAULT values
 * (from the grid meta) so the CP inputs show them and inline editing works right
 * away — matching what Statamic's own "Add row" does. Text-only defaults live in
 * `meta.<field>.defaults`; replicators (per-set defaults) have none, so those
 * fall back to a blank clone of the neighbouring row.
 */
function newRowFor(win, container, values, parentPath, sampleRow) {
  const fullMeta = unwrapRef(container.meta);
  const fieldMeta = fullMeta ? metaForPath(fullMeta, values, parentPath) : null;
  const defaults = fieldMeta && typeof fieldMeta === 'object' ? fieldMeta.defaults : null;

  let row;

  if (!defaults || typeof defaults !== 'object' || Array.isArray(defaults)) {
    row = blankRowFrom(sampleRow);
  } else {
    row = JSON.parse(JSON.stringify(defaults));
    row._id = newRowId();
  }

  // Grid rows (and anything else we inject auto_uuid onto) need a stable
  // _visual_id in the preview — without it Antlers cascades the parent block's
  // id onto the button, and "Add another" would duplicate the whole block.
  if (!row._id) {
    row._id = newRowId();
  }

  row._visual_id = newUuid(win);

  return row;
}

/** The array a row lives in, plus its index. */
function rowLocation(values, uid) {
  const path = findPathByUid(values, uid);

  if (path === null || path === '') {
    return null;
  }

  const parts = path.split('.');

  // Bard set: uid lives on attrs.values (_visual_id) or attrs (id). Climb to the
  // content-array index so hide/dup/delete/move operate on the set node itself.
  if (parts.length >= 3 && parts[parts.length - 1] === 'values' && parts[parts.length - 2] === 'attrs') {
    const index = Number(parts[parts.length - 3]);
    const parentPath = parts.slice(0, -3).join('.');
    const rows = dataGet(values, parentPath);

    if (Array.isArray(rows) && Number.isInteger(index) && rows[index]?.type === 'set') {
      return { parentPath, index, rows, kind: 'bard-set' };
    }
  }

  if (parts.length >= 2 && parts[parts.length - 1] === 'attrs') {
    const index = Number(parts[parts.length - 2]);
    const parentPath = parts.slice(0, -2).join('.');
    const rows = dataGet(values, parentPath);

    if (Array.isArray(rows) && Number.isInteger(index) && rows[index]?.type === 'set') {
      return { parentPath, index, rows, kind: 'bard-set' };
    }
  }

  const dot = path.lastIndexOf('.');

  if (dot === -1) {
    return null;
  }

  const parentPath = path.slice(0, dot);
  const index = Number(path.slice(dot + 1));
  const rows = dataGet(values, parentPath);

  if (!Array.isArray(rows) || !Number.isInteger(index)) {
    return null;
  }

  return {
    parentPath,
    index,
    rows,
    kind: rows[index]?.type === 'set' ? 'bard-set' : 'row',
  };
}

/**
 * What the blueprint allows for the field this row lives in (max_rows/min_rows,
 * or max_sets/min_sets on a replicator). Looked up by the containing set's type
 * first, since the same handle appears in several sets with different limits.
 */
function rowLimits(values, parentPath, win) {
  const all = win.Statamic?.$config?.get?.('sveRowLimits') ?? {};
  const handle = parentPath.slice(parentPath.lastIndexOf('.') + 1);
  const dot = parentPath.lastIndexOf('.');
  const set = dot === -1 ? null : dataGet(values, parentPath.slice(0, dot));
  const type = set && typeof set === 'object' ? set.type : null;

  return (type ? all[`${type}.${handle}`] : null) ?? all[handle] ?? {};
}

/** "+" on an orderable row: add another one just after it, within the field's max. */
export function handleAddRow(data, doc, win) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows } = found;
    const { max } = rowLimits(values, parentPath, win);

    if (max && rows.length >= max) {
      return; // the field is full — the CP wouldn't allow it either
    }

    const row = newRowFor(win, container, values, parentPath, rows[index]);
    const next = JSON.parse(JSON.stringify(rows));

    next.splice(index + 1, 0, row);

    // Without meta.existing[row._id] the Grid/Replicator Vue UI ignores the row:
    // Live Preview (values) shows it, the sidebar does not. Same requirement as
    // handleInsertBlock / insertSectionAfter.
    writeNestedRowMeta(container, values, parentPath, row._id, rowMetaTemplate(container, values, parentPath, rows[index]));
    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * The last row of a block's field was just taken away, so the block goes too —
 * a links block with no links draws nothing, and an empty block that draws
 * nothing can't be hovered, so it could never be reached again from the page.
 *
 * `uid` is the block the preview found around the row (see blockHolding() in
 * bridge.js — always a set of an insertable container, never a page section).
 * Returns true when the block was removed, and then the caller has nothing left
 * to do: the row went with it.
 */
function removeEmptiedBlock(container, values, uid, rows, win) {
  const block = rowLocation(values, uid);

  if (!block || block.rows === rows) {
    return false;
  }

  const { min } = rowLimits(values, block.parentPath, win);

  if (min && block.rows.length <= min) {
    return false; // the section needs this block — leave it, empty
  }

  const next = JSON.parse(JSON.stringify(block.rows));

  next.splice(block.index, 1);
  container.setFieldValue(block.parentPath, next);

  return true;
}

/** "−" on an orderable row: take it out, unless the field's min needs it. */
export function handleRemoveRow(data, doc, win) {
  if (rowIsLocked(data.uid, doc)) {
    return false;
  }

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows } = found;
    const { min } = rowLimits(values, parentPath, win);

    if (min && rows.length <= min) {
      return; // removing it would take the field below its minimum
    }

    const removedId = rows[index]?._id;
    const next = JSON.parse(JSON.stringify(rows));

    next.splice(index, 1);

    if (!next.length && data.emptyRemovesBlock) {
      // Drop the emptied row's meta first; removeEmptiedBlock then takes the
      // whole parent set out of values (its own meta cleanup is a separate path).
      removeNestedRowMeta(container, values, parentPath, removedId);

      if (removeEmptiedBlock(container, values, data.emptyRemovesBlock, rows, win)) {
        return;
      }
    }

    removeNestedRowMeta(container, values, parentPath, removedId);
    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * Duplicate an orderable row (replicator set, Bard set, or grid row), keeping
 * its content but giving every id a fresh value — same idea as Statamic's
 * "Duplicate Set".
 */
export async function handleDuplicateRow(data, doc, win) {
  if (rowIsLocked(data.uid, doc)) {
    return false;
  }

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows, kind } = found;
    const { max } = rowLimits(values, parentPath, win);

    if (max && rows.length >= max) {
      return;
    }

    const copy = reidSection(win, rows[index]);

    if (copy && typeof copy === 'object' && 'enabled' in copy) {
      copy.enabled = true;
    }

    if (kind === 'bard-set' && copy?.type === 'set' && copy.attrs) {
      copy.attrs = { ...copy.attrs, enabled: true };

      const setHandle = copy.attrs.values?.type;
      const rowId = copy.attrs.id;

      if (setHandle && rowId) {
        const field = parentPath.slice(parentPath.lastIndexOf('.') + 1);
        const meta = await fetchNestedSetMeta(win, field, setHandle);

        writeNestedRowMeta(container, values, parentPath, rowId, meta?.new);
      }
    } else if (copy?._id) {
      // Grid / replicator rows: same meta registration as handleAddRow — otherwise
      // the duplicate appears in the preview and nowhere in the sidebar.
      writeNestedRowMeta(
        container,
        values,
        parentPath,
        copy._id,
        rowMetaTemplate(container, values, parentPath, rows[index])
      );
    }

    const next = JSON.parse(JSON.stringify(rows));

    next.splice(index + 1, 0, copy);
    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * Hide a replicator/Bard set (`enabled: false`) — same as the CP's blue toggle.
 * The set disappears from the preview; re-enable it from the sidebar.
 * No-ops on grid rows that have no `type` (they're not toggleable sets).
 */
export function handleHideRow(data, doc, win) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows, kind } = found;
    const row = rows[index];

    if (!row || typeof row !== 'object') {
      return;
    }

    const next = JSON.parse(JSON.stringify(rows));

    if (kind === 'bard-set' && row.type === 'set') {
      next[index] = {
        ...next[index],
        attrs: { ...(next[index].attrs || {}), enabled: false },
      };
    } else if ('type' in row) {
      next[index] = { ...next[index], enabled: false };
    } else {
      return;
    }

    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * Answers the preview's row-caps request: whether the row's field can take
 * another row / lose this one, given its min/max. Lets the preview grey out the
 * +/− that would break the limit (the limit is still enforced here too).
 */
export function handleRowCaps(data, doc, win) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, rows } = found;
    const { min, max } = rowLimits(values, parentPath, win);
    const count = rows.length;

    sendToPreview(
      {
        source: 'statamic-visual-editor',
        type: 'row-caps-result',
        uid: data.uid,
        canAdd: !max || count < max,
        canRemove: !min || count > min,
      },
      win
    );

    return;
  }
}

/**
 * "Rediger global sektion": content belongs to the synced entry. Open its form
 * in the LEFT Live Preview editor (same place as a normal section) — not a
 * right-hand drawer. Values stream up so inline edit in the preview works.
 */
export function handleOpenGlobalSection(data, win) {
  if (!data.id) {
    return;
  }

  openGlobalSectionPanel(win, data.id);
  syncSectionLibraryAvailability(win);
}

/**
 * The gear on a section in the preview: open that section's own settings popup
 * (spacing, colours, …) — the very one the panel's "Show settings" button opens,
 * so every fieldtype and condition inside it behaves exactly as it always has.
 *
 * The set has to be expanded first: a collapsed set keeps its fields behind
 * v-show, and the popup measures layout as it opens — clicked while hidden it
 * does nothing at all.
 */
export function handleSectionSettings(data, doc, win) {
  const setEl = findSetByUid(data.uid, doc) ?? sortableItemForUid(data.uid, doc);

  if (!setEl) {
    return;
  }

  dismissChromeForPageEdit(win);

  // Expand ONCE. Expanding is a toggle and Vue applies it asynchronously, so a
  // second nudge while the first is still pending closes the set right back up.
  [...collectAncestorSets(setEl), setEl].forEach(expandSet);

  let attempts = 0;
  let revealed = false;

  const open = () => {
    // Some sections hide their settings behind a revealer — open it first. It's a
    // toggle, so it gets exactly one click.
    if (!revealed) {
      const revealer = settingsRevealer(setEl);

      if (revealer && /^(show|vis)/i.test((revealer.textContent || '').trim())) {
        revealer.click();
        revealed = true;
      }
    }

    // A collapsed set renders no fields, and revealing takes a beat — just wait.
    if (!sectionSettingsFields(setEl).length) {
      if (++attempts < 30) {
        setTimeout(open, 200);
      }

      return;
    }

    // Let Vue settle before isolating; fall back to showing the whole section if
    // the settings can't be pinned down.
    setTimeout(() => {
      // With the focus panel on, the section already comes up under its own name
      // with its tabs across the top — the gear means "open it on the settings
      // tab", not "show me the settings fields and nothing around them".
      const opened = focusPanelOn(win)
        ? soloSection(data.uid, doc, win, { kind: 'section', segment: 'settings' })
        : soloSectionSettings(data.uid, doc, win);

      if (!opened) {
        soloSection(data.uid, doc, win);
      }

      forcePanelOpen = true;
      setLpCollapsed(win, false);
    }, 250);
  };

  open();
}

/**
 * The section's own "Show settings" revealer.
 *
 * Settings aren't a popup — `show_settings` is a `revealer` fieldtype that
 * unhides the section's `settings` fields in place. Sections are full of buttons
 * that say much the same thing (every button row and column has its own), so the
 * section's is picked by nesting: its fields sit in the set's own field list,
 * everything else's are one or more field lists further in.
 */
function settingsRevealer(setEl) {
  const depth = (el) => {
    let levels = 0;

    for (let node = el.parentElement; node && node !== setEl; node = node.parentElement) {
      if (node.classList?.contains('publish-fields')) {
        levels++;
      }
    }

    return levels;
  };

  // Found by fieldtype, not by label: the field is *called* "Show settings", but
  // the button Statamic renders inside it reads "Show Fields".
  return [...setEl.querySelectorAll('.revealer-fieldtype button')].sort(
    (a, b) => depth(a) - depth(b)
  )[0];
}

/**
 * The panel row for a top-level array item, located via the form values: the
 * uid's path ("page_sections.3") gives the field handle and index, and the
 * sortable rows render in values order.
 */
function sortableItemForUid(uid, doc) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, uid);
    const match = path?.match(/^([^.]+)\.(\d+)$/);

    if (!match) {
      continue;
    }

    return doc.querySelectorAll(`.field_${match[1]}-sortable-item`)[Number(match[2])] ?? null;
  }

  return null;
}

// --- Live Preview: collapsible editor panel ----------------------------------
//
// Inline editing makes the publish form optional for everyday text tweaks, so
// the editor pane starts collapsed — the preview gets the full width. A toggle
// button injected into the live-preview header brings it back.
//
// Collapsing moves the pane off-screen (position:absolute; left:-10000px)
// instead of display:none: the pane keeps real layout, which the column
// builder's popup-opening machinery depends on (with display:none its
// components report zero rects and the popup silently fails to open). The
// popup itself portals to document.body, so it shows fine while collapsed.

const LP_TOGGLE_ID = '__sve-lp-toggle';
const LP_MODE_ID = '__sve-lp-mode';
const LP_MODE_KEY = 'sve-lp-panel-mode';

const LP_WIDTH_ID = '__sve-lp-width';
const LP_WIDTH_GROUP_ID = '__sve-lp-width-group';

/**
 * Statamics egen nøgle, og med vilje.
 *
 * Panelets bredde trækkes også med håndtaget, og den ende gemmer her. Deler de
 * to ikke nøgle, ville et klik og et træk skrive hver sit sted, og den der blev
 * læst ved næste åbning ville være den der tilfældigvis blev læst først. Med
 * samme nøgle er der én bredde: knapperne sætter den, håndtaget sætter den, og
 * den der står, er den man sidst valgte — uanset hvordan.
 */
const LP_WIDTH_KEY = 'statamic.live-preview.editor-width';

/**
 * De tre bredder, smallest først. `rem` og ikke pixels, fordi det er sådan
 * feltopstillingen i panelet er sat op — grænsen for hvornår felterne falder ned
 * i én kolonne står i `cp.css` som en container query i rem, og de to tal skal
 * kunne sammenlignes med det blotte øje.
 */
const LP_WIDTHS = [
  { rem: 22, label: 'S' },
  { rem: 26, label: 'M' },
  { rem: 32, label: 'L' },
];

const LP_WIDTH_DEFAULT = 26;

// The panel runs in one of three modes, chosen in the header and remembered
// across sessions:
//   hide — never opens, not even when something in the preview is clicked
//   auto — closed until something in the preview is clicked, then opens on it
//   show — always open
const LP_MODES = ['hide', 'auto', 'show'];
const LP_MODE_LABELS = { hide: 'Hidden', auto: 'Auto', show: 'Visible' };

/**
 * Flat Save & Publish blue — lightest stop from Statamic’s primary gradient
 * (from-primary/90), no border / shadow / gradient.
 */
const LP_PRIMARY_FLAT =
  'color-mix(in oklab, var(--theme-color-primary, #4f46e5) 90%, transparent)';

/** Idle icon opacity — same for toolbar + device chrome. */
const LP_ICON_IDLE_OPACITY = '0.7';

/**
 * A tool that cannot be used from where you are.
 *
 * Far enough below idle to read as off at a glance, not so far that the row
 * looks like it lost an icon — the bar keeps its shape, so nothing shifts under
 * the pointer on the way into a header and back out again.
 */
const LP_ICON_LOCKED_OPACITY = '0.25';

/** Paint a framed control as selected (flat primary) or idle. */
function paintLpActiveControl(btn, on) {
  const wantBg = on ? LP_PRIMARY_FLAT : 'transparent';
  const wantFg = on ? '#fff' : 'currentColor';
  const wantOpacity = on ? '1' : LP_ICON_IDLE_OPACITY;

  if (btn.style.background !== wantBg) {
    btn.style.background = wantBg;
  }

  if (btn.style.color !== wantFg) {
    btn.style.color = wantFg;
  }

  if (btn.style.opacity !== wantOpacity) {
    btn.style.opacity = wantOpacity;
  }

  if (btn.style.border && btn.style.border !== 'none' && btn.style.border !== '0px') {
    btn.style.border = 'none';
  }

  if (btn.style.boxShadow && btn.style.boxShadow !== 'none') {
    btn.style.boxShadow = 'none';
  }

  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
}

/**
 * Flat primary fill matching our chrome pills — kills Statamic’s gradient + border
 * on the Live Preview “Save & Publish” (and plain “Save”) header button.
 */
function isLpSaveLabel(text) {
  const t = (text || '').replace(/\s+/g, ' ').trim();

  return (
    /save\s*&\s*publish|gem\s*&\s*public|save\s*and\s*publish|gem og public/i.test(t) ||
    /^(save|gem)(\s+changes|\s+ændringer)?$/i.test(t)
  );
}

function isLpPublishLabel(text) {
  const t = (text || '').replace(/\s+/g, ' ').trim();

  return /^(publish|publicér|publicer)(\.\.\.|…)?$/i.test(t);
}

function findLpSaveButton(header) {
  if (!header) {
    return null;
  }

  let save = null;

  header.querySelectorAll('button').forEach((btn) => {
    if (btn.id === LP_BACK_ID || btn.hasAttribute('data-sve-statamic-lp-close')) {
      return;
    }

    if (isLpSaveLabel(btn.textContent || '')) {
      save = btn;
    }
  });

  return save;
}

/** Save, or Publish when Save & Publish is split (revisions). */
function findLpRightActionTail(header) {
  if (!header) {
    return null;
  }

  let tail = findLpSaveButton(header);

  header.querySelectorAll('button').forEach((btn) => {
    if (btn.id === LP_BACK_ID || btn.hasAttribute('data-sve-statamic-lp-close')) {
      return;
    }

    if (isLpPublishLabel(btn.textContent || '')) {
      tail = btn;
    }
  });

  return tail;
}

/**
 * Ét flex-gap mellem devices | zoom | Save | close.
 * Statamics egen × havde `ml-auto` der skubbede højre-gruppen ud —
 * den er skjult, så vi sætter `ml-auto` på chrome (eller Save) i stedet.
 * Ellers lander Save/Publish/Close til venstre med et hul foran vores ×.
 */
function syncLpRightBarGaps(win) {
  const doc = win.document;
  const header = lpHeader(doc);
  const chrome = doc.getElementById(LP_PREVIEW_CHROME_ID);
  const back = doc.getElementById(LP_BACK_ID);
  const save = findLpSaveButton(header);

  if (!header || !save) {
    return;
  }

  const parent = save.parentElement || header;
  const gap = `${LP_TOOLBAR_GAP}px`;
  const rightLead = chrome && parent.contains(chrome) ? chrome : save;

  if (parent.style.display !== 'inline-flex' && parent.style.display !== 'flex') {
    parent.style.display = 'inline-flex';
  }

  parent.style.alignItems = 'center';
  parent.style.gap = gap;

  // Skub hele højre-klyngen ud — også når Save er direkte barn af headeren.
  if (parent === header) {
    rightLead.style.setProperty('margin-left', 'auto', 'important');
  } else if (parent.style.marginLeft !== 'auto') {
    parent.style.marginLeft = 'auto';
  }

  // Rækkefølge: chrome → save → [publish] → back.
  if (chrome) {
    if (chrome.parentElement !== parent || chrome.nextElementSibling !== save) {
      parent.insertBefore(chrome, save);
    }

    chrome.style.marginRight = '0';
    chrome.style.gap = gap;

    if (rightLead !== chrome) {
      chrome.style.marginLeft = '0';
    }
  }

  const actionTail = findLpRightActionTail(header) || save;

  if (back) {
    if (back.parentElement !== parent || back.previousElementSibling !== actionTail) {
      actionTail.after(back);
    }

    back.style.marginLeft = '0';
    back.style.marginRight = '0';
  }

  // Save må ikke selv have ml-auto (det ville skubbe Publish væk fra Save).
  if (rightLead !== save) {
    save.style.setProperty('margin-left', '0', 'important');
  }

  save.style.setProperty('margin-right', '0', 'important');
}

function paintLpSaveButton(win) {
  const header = lpHeader(win.document);

  if (!header) {
    return;
  }

  header.querySelectorAll('button').forEach((btn) => {
    const text = (btn.textContent || '').replace(/\s+/g, ' ').trim();

    if (!isLpSaveLabel(text) && !isLpPublishLabel(text)) {
      return;
    }

    if (btn.style.getPropertyValue('background') !== LP_PRIMARY_FLAT) {
      btn.style.setProperty('background', LP_PRIMARY_FLAT, 'important');
    }

    if (btn.style.getPropertyValue('background-image') !== 'none') {
      btn.style.setProperty('background-image', 'none', 'important');
    }

    if (btn.style.getPropertyValue('color') !== 'rgb(255, 255, 255)' && btn.style.color !== '#fff') {
      btn.style.setProperty('color', '#fff', 'important');
    }

    if (btn.style.getPropertyValue('border') !== 'none' && btn.style.getPropertyValue('border-width') !== '0px') {
      btn.style.setProperty('border', 'none', 'important');
    }

    if (btn.style.getPropertyValue('box-shadow') !== 'none') {
      btn.style.setProperty('box-shadow', 'none', 'important');
    }

    // Same soft corner + height as devices / zoom / left icon pills.
    if (btn.style.getPropertyValue('border-radius') !== '0.5rem') {
      btn.style.setProperty('border-radius', '0.5rem', 'important');
    }

    if (btn.style.getPropertyValue('height') !== `${LP_CHROME_H}px`) {
      btn.style.setProperty('height', `${LP_CHROME_H}px`, 'important');
    }

    if (btn.style.getPropertyValue('box-sizing') !== 'border-box') {
      btn.style.setProperty('box-sizing', 'border-box', 'important');
    }

    // Ingen egen margin — syncLpRightBarGaps styrer afstanden via parent gap /
    // ml-auto på højre-klyngen. Rør ikke margin-left her (kan være ml-auto).
    btn.style.setProperty('margin-right', '0', 'important');
  });
}

/** Så svag som en streg kan være og stadig dele to ord. */
const LP_SEP_OPACITY = '.15';

/** Gruppeboksens luft ud til kontrollerne i den. */
const LP_CONTROL_PAD = 5;

/**
 * Ydre højde for alle topbar-grupper og selvstændige ikonknapper (devices,
 * zoom, Hidden/Auto/Visible, pages/globals, go-back). Pad + kontrol = 32.
 */
const LP_CHROME_H = 32;

/** Indre kontrolhøjde inde i en gruppe (32 − 2×5). */
const LP_CONTROL_H = LP_CHROME_H - LP_CONTROL_PAD * 2;

let lpHeaderBgCache = null;

/**
 * Topbarens egen baggrundsfarve, aflæst frem for gættet.
 *
 * Den valgte tilstand og sømmen efter ikonet er ikke grå oven på baren — de er
 * baren, der kommer til syne gennem kontrollen. Så farven skal være nøjagtig
 * dens, og den skifter med CP'ets tema. Derfor aflæses den, og der ledes opad
 * indtil noget er helt uigennemsigtigt: headeren selv er ofte gennemsigtig og
 * låner farven fra modalen bagved.
 */
function lpHeaderBg(win) {
  const header = lpHeader(win.document);

  if (!header) {
    return null;
  }

  if (lpHeaderBgCache?.el === header) {
    return lpHeaderBgCache.value;
  }

  let el = header;
  let value = null;

  while (el && !value) {
    const bg = win.getComputedStyle(el).backgroundColor;
    const alpha = bg?.startsWith('rgba') ? Number(bg.split(',')[3]?.replace(')', '')) : bg ? 1 : 0;

    if (alpha >= 0.99) {
      value = bg;
    }

    el = el.parentElement;
  }

  lpHeaderBgCache = { el: header, value };

  return value;
}

/**
 * Den tynde streg mellem to kontroller i samme gruppe.
 *
 * `data-sep-before` er navnet på det der står til højre for stregen; det til
 * venstre findes ud fra rækkefølgen. Det er nok til at afgøre om stregen støder
 * op til noget der har sin egen flade og derfor skal gemmes — se
 * ensureLpPanelToggle. Uden navn er den bare en streg og bliver stående.
 */
function lpModeSeparator(doc, before) {
  const sep = doc.createElement('span');

  if (before) {
    sep.dataset.sepBefore = before;
  }

  // Ingen egne marginer: knappernes luft er allerede der, og stregen står midt
  // i den. Lægger man mere til, falder ordene fra hinanden.
  sep.style.cssText =
    'display:block;flex:0 0 auto;width:1px;height:.625rem;' +
    `background:currentColor;opacity:${LP_SEP_OPACITY};transition:opacity .12s ease;`;

  return sep;
}

// Collapse state for the current Live Preview session (auto mode moves it at
// runtime). null = not initialized (live preview closed); derived from the
// stored mode on next mount.
let lpCollapsed = null;

// Set while a section's settings are on show — see ensureLpPanelToggle.
let forcePanelOpen = false;

function lpMode(win) {
  try {
    const stored = win.localStorage.getItem(LP_MODE_KEY);

    return LP_MODES.includes(stored) ? stored : 'hide';
  } catch {
    return 'hide';
  }
}

function setLpMode(win, mode) {
  try {
    win.localStorage.setItem(LP_MODE_KEY, mode);
  } catch {
    /* private mode */
  }

  // Switching to Show reveals the FULL form, like the old open-toggle did.
  if (mode === 'show') {
    clearSolo(win.document);
  }

  setLpCollapsed(win, mode !== 'show');
}

/**
 * A preview interaction (clicking a section, an inline field, …) wants the
 * panel open. Whether it gets it depends on the mode — in `hide` it never does.
 * Returns whether the panel is (now) available.
 */
function autoOpenPanel(win) {
  if (lpMode(win) === 'hide') {
    return false;
  }

  setLpCollapsed(win, false);

  return true;
}

function setLpCollapsed(win, collapsed) {
  lpCollapsed = collapsed;

  ensureLpPanelToggle(win);
}

// --- Heading outline panel ------------------------------------------------------
// The page's headings as one list, docked on the right: not the sections it is
// built from, but the structure a reader — or a screen reader, or a search engine
// — actually meets. Clicking one scrolls the preview to it and, where the heading
// sits in an annotated block, opens that block in the editor panel: the outline is
// a map and a way in at once.
//
// The list comes from the preview, because only the rendered page knows what its
// headings are: one can come from a block, another from a global, a third from the
// layout. The bridge keeps it in step while the panel is open and stops when it
// closes.

const OUTLINE_PANEL_ID = '__sve-outline-panel';

/** The last list the preview sent. Redrawn whole; never edited in place. */
let outlineItems = [];
let outlineActive = -1;
// Whether the preview has answered at all. An empty list means "no headings on
// this page", which is a different thing from "no answer yet" — and saying the
// first while waiting for the second is how a panel comes to lie about a page.
let outlineAnswered = false;

function outlinePanel(doc) {
  // The headings live in the block tree's panel now, as its second tab. The
  // standalone panel is still built by `toggleOutlinePanel` and still works; it
  // simply has nothing in the header opening it any more.
  return doc.getElementById(OUTLINE_PANEL_ID) || doc.getElementById(LISTVIEW_PANEL_ID);
}

/** Ask the preview to start (or stop) reporting its headings. */
function watchOutlineInPreview(win, on) {
  sendToPreview({ source: 'statamic-visual-editor', type: 'outline-watch', on }, win);
}

export function closeOutlinePanel(win) {
  if (!outlinePanel(win.document)) {
    return;
  }

  outlinePanel(win.document).remove();
  outlineItems = [];
  outlineActive = -1;
  outlineAnswered = false;
  watchOutlineInPreview(win, false);
  syncPreviewInset(win);
}

/** Opens the panel, or closes it when it is already up. */
function toggleOutlinePanel(win) {
  const doc = win.document;

  if (!featureOn(win, 'outline')) {
    return;
  }

  if (outlinePanel(doc)) {
    closeOutlinePanel(win);

    return;
  }

  closeRightPanels(win, [OUTLINE_PANEL_ID]);

  const header = lpHeader(doc);
  const top = header ? Math.round(header.getBoundingClientRect().bottom) : 0;
  const panel = doc.createElement('div');

  panel.id = OUTLINE_PANEL_ID;
  panel.style.cssText =
    `position:fixed;top:${top}px;right:0;bottom:0;width:${globalsPanelWidth(win)}px;z-index:41;` +
    'display:flex;flex-direction:column;background:var(--theme-color-content-bg,#fff);color:currentColor;' +
    'border-left:1px solid rgba(128,128,128,.28);box-shadow:-8px 0 24px rgba(0,0,0,.18);' +
    'font-family:ui-sans-serif,system-ui,sans-serif;overflow:hidden;';

  panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid rgba(128,128,128,.2);flex:0 0 auto;">
      <div style="font-size:14px;font-weight:600;">${t(win, 'outline')}</div>
      <button type="button" data-sve-close style="all:unset;cursor:pointer;width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;border-radius:6px;opacity:.7;">✕</button>
    </div>
    <div style="padding:6px 14px 0;font-size:11px;opacity:.6;flex:0 0 auto;">${t(win, 'outline_hint')}</div>
    <div data-sve-outline-notice style="flex:0 0 auto;"></div>
    <div data-sve-outline-list style="flex:1 1 auto;min-height:0;overflow-y:auto;padding:10px 12px 16px;"></div>
  `;

  panel.querySelector('[data-sve-close]').addEventListener('click', () => closeOutlinePanel(win));
  panel.appendChild(panelResizer(win, panel, { side: 'right' }));
  doc.body.appendChild(panel);
  syncPreviewInset(win);

  renderOutline(win); // "Loading…", until the preview answers
  watchOutlineInPreview(win, true);

  // A preview that is still booting has no listener yet, and a message posted
  // into it is simply gone. Two more asks, then we take the silence for an
  // answer — the panel is one click to close and reopen, and a request repeated
  // forever is worse than a list that can be asked for again.
  [700, 2000].forEach((delay) => {
    win.setTimeout(() => {
      if (!outlineAnswered && outlinePanel(win.document)) {
        watchOutlineInPreview(win, true);
      }
    }, delay);
  });
}

/** A fresh list from the preview. */
export function handleOutline(data, win) {
  outlineAnswered = true;
  outlineItems = Array.isArray(data.items) ? data.items : [];

  if (outlineActive >= outlineItems.length) {
    outlineActive = -1;
  }

  renderOutline(win);
}

/**
 * What the outline says about itself.
 *
 * Three things go wrong with headings, and none of them shows on the page — the
 * text looks right whatever level it is written at. They only show here, which is
 * the argument for saying them here:
 *
 * - no H1 at all: nothing on the page says what the page is;
 * - more than one H1: several things claim to be what the page is;
 * - a level reached without passing through the one above it, and any heading
 *   standing before the page's own H1. Both are the same fault seen from two
 *   sides — the order read is not the order meant.
 *
 * The first two are `critical`, the third is a `warning`, and the difference is
 * what the reader can do with it. A skipped level is untidy — the page still says
 * what it is, just in a jumbled order. An H1 count that isn't one is an answer
 * that is wrong: the outline has no top, or several tops that disagree. Both are
 * reported the same way and told apart by colour, so a page with a few loose
 * headings doesn't shout as loudly as one with no subject.
 *
 * Nothing is stored and nothing is dismissed: the checks are run against the list
 * as it stands, and the list is rebuilt whenever the page changes. Put the
 * headings in order and the warnings are gone by the next render, because there is
 * nothing left to report.
 *
 * @returns {{
 *   page: {message: string, severity: 'critical'|'warning'}[],
 *   rows: Map<number, {messages: string[], severity: 'critical'|'warning'}>
 * }}
 */
function outlineIssues(win, items) {
  const rows = new Map();
  const page = [];

  if (!items.length) {
    return { page, rows };
  }

  // Adds a fault to a row, keeping the worse of the two severities and both
  // messages. The rules below are independent of each other, so nothing stops two
  // of them landing on the same heading; as they stand today none of them can
  // (an H1 can neither stand before the first H1 nor skip a level), but that is a
  // property of the current rules, not something the row should depend on.
  const flag = (index, message, severity) => {
    const existing = rows.get(index);

    if (!existing) {
      rows.set(index, { messages: [message], severity });

      return;
    }

    existing.messages.push(message);

    if (severity === 'critical') {
      existing.severity = 'critical';
    }
  };

  const h1s = items.filter((item) => item.level === 1).length;

  // Critical, both ways round. "Exactly one H1" is not a matter of taste like
  // level order is: none, and nothing on the page says what it is about; several,
  // and they contradict each other. Either way the answer is wrong, not untidy —
  // so it is marked apart from the warnings rather than lost among them.
  if (!h1s) {
    page.push({ message: t(win, 'outline_issue_no_h1'), severity: 'critical' });
  } else if (h1s > 1) {
    page.push({ message: t(win, 'outline_issue_many_h1', { count: h1s }), severity: 'critical' });

    // Every one of them, not just the extras: there is no telling which was meant
    // to be THE heading, and marking the second onwards would quietly answer that
    // question on the writer's behalf.
    items.forEach((item, index) => {
      if (item.level === 1) {
        flag(index, t(win, 'outline_issue_duplicate_h1', { count: h1s }), 'critical');
      }
    });
  }

  const firstH1 = items.findIndex((item) => item.level === 1);
  let previous = 0;

  items.forEach((item, index) => {
    if (firstH1 > 0 && index < firstH1) {
      flag(index, t(win, 'outline_issue_before_h1'), 'warning');
    } else if (previous && item.level > previous + 1) {
      flag(
        index,
        t(win, 'outline_issue_skipped', {
          from: previous,
          to: item.level,
          next: previous + 1,
        }),
        'warning'
      );
    }

    previous = item.level;
  });

  return { page, rows };
}

/** The page-level notices, above the list. Empty when there is nothing to say. */
function renderOutlineNotice(win, notices) {
  const doc = win.document;
  const box = outlinePanel(doc)?.querySelector('[data-sve-outline-notice]');

  if (!box) {
    return;
  }

  box.textContent = '';

  notices.forEach((notice) => {
    const note = doc.createElement('p');

    note.setAttribute('data-sve-outline-note', notice.severity);
    note.textContent = notice.message;
    box.appendChild(note);
  });
}

function renderOutline(win) {
  const doc = win.document;
  const list = outlinePanel(doc)?.querySelector('[data-sve-outline-list]');

  if (!list) {
    return;
  }

  const issues = outlineIssues(win, outlineItems);

  renderOutlineNotice(win, issues.page);
  list.textContent = '';

  if (!outlineItems.length) {
    const empty = doc.createElement('div');

    empty.style.cssText = 'padding:30px 6px;text-align:center;opacity:.55;font-size:12px;';
    empty.textContent = t(win, outlineAnswered ? 'outline_empty' : 'loading');
    list.appendChild(empty);

    return;
  }

  // Indented against the shallowest heading on the page, not against H1: a page
  // whose top heading is an H2 is drawn flush, the way it reads, rather than
  // pushed in under a level that isn't there.
  const base = Math.min(...outlineItems.map((item) => item.level));

  outlineItems.forEach((item, index) => {
    const depth = Math.max(0, Math.min(item.level - base, 5));
    const row = doc.createElement('button');

    row.type = 'button';
    row.setAttribute('data-sve-outline-item', '');
    row.setAttribute('aria-current', index === outlineActive ? 'true' : 'false');

    // One rail per level above this one, then the branch: the tree draws itself
    // out of the depth, with no line to compute and nothing to keep in sync.
    for (let i = 0; i < depth; i++) {
      const rail = doc.createElement('span');

      rail.setAttribute('data-sve-outline-rail', '');
      row.appendChild(rail);
    }

    const branch = doc.createElement('span');

    branch.setAttribute('data-sve-outline-branch', '');
    row.appendChild(branch);

    const label = doc.createElement('span');

    label.setAttribute('data-sve-outline-level', '');
    label.textContent = `H${item.level}`;

    const text = doc.createElement('span');

    text.setAttribute('data-sve-outline-text', '');
    text.textContent = item.text || t(win, 'outline_blank');

    if (!item.text) {
      text.setAttribute('data-sve-outline-blank', '');
    }

    row.append(label, text);

    // A heading in the wrong place says so where it stands, and explains itself on
    // hover — the row is the one spot where both the fault and the thing at fault
    // are in front of you.
    const issue = issues.rows.get(index);

    if (issue) {
      const flag = doc.createElement('span');

      flag.setAttribute('data-sve-outline-flag', '');
      flag.textContent = '!';
      row.appendChild(flag);
      // The severity rides on the attribute's value, so the existing
      // presence-selectors keep matching and the red layers on top of them.
      row.setAttribute('data-sve-outline-warn', issue.severity);
      // Every fault the row has, not just the worst one — the colour reports the
      // severity, the tooltip reports what actually happened. Colour alone would
      // leave anyone who can't see it with nothing.
      row.title = issue.messages.join('\n');
    }

    row.addEventListener('click', () => jumpToOutlineEntry(win, index, item));
    list.appendChild(row);
  });
}

/**
 * Clicking an entry: the preview scrolls to the heading and marks it, and the
 * editor panel opens whatever owns it.
 *
 * The panel only follows where the mode allows it (`autoOpenPanel`) — someone who
 * has put the editor panel away is reading the page, and yanking it back open on
 * a click meant "take me there" would be the opposite of what was asked.
 */
function jumpToOutlineEntry(win, index, item) {
  sendToPreview({ source: 'statamic-visual-editor', type: 'outline-focus', index }, win);

  outlineActive = index;
  outlinePanel(win.document)
    ?.querySelectorAll('[data-sve-outline-item]')
    .forEach((row, i) => row.setAttribute('aria-current', i === index ? 'true' : 'false'));

  if (!autoOpenPanel(win)) {
    return;
  }

  // The same two routes a click in the preview takes: the field's own block where
  // the template annotated one, the surrounding set otherwise.
  if (item.field && item.scope && focusPanelOn(win)) {
    focusFieldOwner(item.field, item.scope, win.document, win);

    return;
  }

  if (item.uid) {
    focusFromPreview(item.uid, win.document, win, { clampToSection: true });
  }
}

// --- Block tree panel ("List View") ---------------------------------------------
// The page as its blocks, docked on the right: the section, and everything nested
// inside it, as one list you can click.
//
// The editor panel already shows one thing at a time and steps down into a block
// by clicking it on the page. That is a good way to work and a poor way to get an
// overview — you can only see where you are, never the shape of the whole page.
// This is the other half: the shape, with every row a way in.
//
// Read from the publish form's own values rather than from the rendered DOM. The
// values are the page; the DOM is one drawing of it, and a block scrolled out of
// view, collapsed, or hidden behind a condition is missing from the drawing while
// still being part of the page.
//
// Nothing here writes. A click hands the uid to the same `focusFromPreview` the
// outline uses, and the panel is redrawn from scratch each time it opens.

const LISTVIEW_PANEL_ID = '__sve-listview-panel';

// Its own remembered width, and its own default. The tree is a column of short
// labels, so it wants far less room than Theme Settings — sharing that panel's
// 440px opened it twice as wide as it has anything to put there.
const LISTVIEW_WIDTH_KEY = 'sve-listview-panel-width';
const LISTVIEW_DEFAULT_WIDTH = 320; // 20rem
const LISTVIEW_MIN_WIDTH = 220;

function listViewPanelWidth(win) {
  let stored = 0;

  try {
    stored = Number(win.localStorage.getItem(LISTVIEW_WIDTH_KEY)) || 0;
  } catch {
    /* private mode */
  }

  const max = Math.max(LISTVIEW_MIN_WIDTH, win.innerWidth - 360);

  return Math.min(Math.max(stored || LISTVIEW_DEFAULT_WIDTH, LISTVIEW_MIN_WIDTH), max);
}

/** The tree as last built, nested. */
let listViewRoots = [];

/** Uids folded shut. Kept across redraws so a move doesn't reopen the page. */
const listViewCollapsed = new Set();

/** The row drawn as current — the last one clicked here. */
let listViewActiveUid = null;

/** The row being dragged, while a drag is in progress. */
let listViewDragUid = null;

/** Whether the opening state has been decided for this session of the panel. */
let listViewStarted = false;

/** Holder øje med om låsen skifter andetsteds — se watchListViewLocks. */
let listViewLockObserver = null;

/** Which of the panel's two views is showing — 'tree' or 'outline'. */
let listViewTab = 'tree';

/**
 * Folds every top-level section but one.
 *
 * The sections are an accordion: a page has enough of them that all open at once
 * is a wall of rows to scroll, and the one you are working in is the one worth
 * seeing whole. Blocks *within* a section are not — several open there is how you
 * compare two items — so this reaches only the roots.
 */
/**
 * Opens a row and folds everything inside it.
 *
 * What a section shows when you go into it: its own blocks, and none of theirs.
 * Unfolding the whole subtree put twenty rows on screen for a section with two
 * blocks in it, and the list you came to read became the thing you had to read
 * past. Each block opens on its own when you click it.
 */
function listViewOpenShallow(node) {
  listViewCollapsed.delete(node.uid);

  const shut = (child) => {
    listViewCollapsed.add(child.uid);
    child.children.forEach(shut);
  };

  node.children.forEach(shut);
}

function listViewSoloSection(uid) {
  listViewRoots.forEach((root) => {
    if (root.uid === uid) {
      listViewCollapsed.delete(root.uid);
    } else {
      listViewCollapsed.add(root.uid);
    }
  });
}

function listViewPanel(doc) {
  return doc.getElementById(LISTVIEW_PANEL_ID);
}

export function closeListViewPanel(win) {
  if (!listViewPanel(win.document)) {
    return;
  }

  listViewPanel(win.document).remove();
  listViewRoots = [];
  listViewDragUid = null;
  listViewStarted = false;
  listViewCollapsed.clear();
  // Nothing left to draw them into, so stop the preview reporting its headings.
  watchOutlineInPreview(win, false);
  syncPreviewInset(win);
}

/**
 * Is this one row of a Replicator field — a block — rather than something else
 * that happens to carry a `type`?
 *
 * `type` alone is not enough, and that is the whole difficulty. A Bard field
 * stores its text as ProseMirror nodes, and those are objects with a `type` too:
 * a headline holds a `paragraph`, which holds a `text`. Drawn as blocks they fill
 * the tree with rows for the letters inside the block you were looking for.
 *
 * What separates them is what Statamic and this addon add to a *set*, and only to
 * a set: `enabled`, the switch on the row, and `_visual_id`, injected into every
 * set's blueprint so the preview can point at it. A ProseMirror node has neither,
 * because nothing in the editor treats it as a thing you can turn off or click.
 */
function isBlockRow(value) {
  return (
    !!value
    && typeof value === 'object'
    && !Array.isArray(value)
    && typeof value.type === 'string'
    && ('enabled' in value || '_visual_id' in value)
  );
}

/** The id a row is known by, in the order the rest of this file prefers them. */
function blockRowUid(row) {
  return row._visual_id || row.id || row._id || '';
}

/**
 * Every id a row answers to.
 *
 * A block is annotated in the preview with whichever one its template happened to
 * pass — `data-sid` carries `_visual_id`, `data-sid-field-uid` carries whatever
 * went into `scope`, which is conventionally `id` but need not be, and some rows
 * have no `id` at all. Picking one and hoping is what made this fail twice: the
 * tree held `_visual_id`, the click reported `id`, and neither side was wrong.
 *
 * So all of them are carried, and a match on any is a match. Nothing distinguishes
 * two rows by these ids, so a wider net cannot catch the wrong fish.
 */
function blockRowIds(row) {
  return [row._visual_id, row.id, row._id].filter((id) => typeof id === 'string' && id !== '');
}

/**
 * The page's blocks, flattened into rows with their depth.
 *
 * Walks every array under the page-builder field, at any depth, because nesting
 * is the thing being shown: a section holds blocks, a block holds rows, and how
 * deep that goes is the fieldset's business, not this panel's.
 *
 * Keys beginning with `_` are skipped. They hold the editor's own bookkeeping —
 * `_visual_id`, `_bp_order` — which is not part of the page and would otherwise
 * be walked into looking for blocks that cannot be there.
 */
function listViewTree(win, doc) {
  const field = sectionField(win);
  const roots = [];

  // `listKey` and `index` are what a drag needs: two rows may sit side by side in
  // the tree and still belong to different arrays — a section with both a
  // `blocks` field and a `content_boxes` field draws all of them as its children.
  // Reordering only means something within one array, so both are carried.
  const collect = (node, depth, parentUid, out, listKey) => {
    if (depth > 12 || !node || typeof node !== 'object') {
      return;
    }

    if (Array.isArray(node)) {
      node.forEach((item, index) => {
        if (!isBlockRow(item)) {
          collect(item, depth, parentUid, out, listKey);

          return;
        }

        const uid = blockRowUid(item);
        const children = [];

        collect(item, depth + 1, uid, children, listKey);

        // Låst? Aflæst fra rækkens element i formularen — låsen er en indstilling
        // på feltet, ikke en værdi på rækken, så værdierne alene kan ikke sige
        // det. `data-row-locked` stemples af projektets LockedRows.js.
        const el = uid ? findSetByVisualIdInput(uid, doc) : null;

        out.push({
          locked: !!el?.hasAttribute('data-row-locked'),
          // Låst op ved et klik — her eller på hængelåsen i venstre panel. De to
          // steder skriver i de samme attributter, så tilstanden er én.
          unlocked: !!el?.hasAttribute('data-row-unlocked'),
          uid,
          // Every id this row answers to — see blockRowIds. Which one a given
          // block is annotated with in the preview is the template's choice, not
          // something a tree of values can know.
          ids: blockRowIds(item),
          type: item.type,
          depth,
          index,
          listKey,
          parentUid,
          enabled: item.enabled !== false,
          children,
        });
      });

      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      if (key.startsWith('_') || key === 'type' || key === 'id') {
        return;
      }

      collect(value, depth, parentUid, out, key);
    });
  };

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object' || !Array.isArray(values[field])) {
      continue;
    }

    collect(values[field], 0, null, roots, field);

    // Låsen sidder på FELTET, ikke på rækken: `locked_rows` gør alle rækker i et
    // felt låste. Aflæsningen ovenfor finder kun de rækker der tilfældigvis er
    // tegnet i formularen netop nu, så én fundet lås smittes ud til resten af
    // samme felt. Ellers var det tilfældigt hvilke rækker træet troede var låst.
    const groups = new Map();
    const key = (node) => `${node.parentUid || ''}::${node.listKey}`;

    listViewFlat(roots).forEach((node) => {
      const seen = groups.get(key(node)) || { locked: false, unlocked: false };

      groups.set(key(node), {
        locked: seen.locked || node.locked,
        unlocked: seen.unlocked || node.unlocked,
      });
    });

    listViewFlat(roots).forEach((node) => {
      const seen = groups.get(key(node)) || { locked: false, unlocked: false };

      node.locked = seen.locked;
      node.unlocked = seen.unlocked;
    });

    // The first container holding the page builder is the page. A second one
    // would be another form open beside it — a global section being edited, say —
    // and its blocks belong to that panel, not to this tree.
    break;
  }

  return roots;
}

const LISTVIEW_STYLE_ID = '__sve-listview-style';

/**
 * The tree's own stylesheet, added once.
 *
 * Inline styles cannot express hover, focus or the drop line, and the panel is
 * built as raw DOM rather than through Vue, so there is no component stylesheet
 * to put them in. Everything is stated in terms of `currentColor` and the
 * Control Panel's own background variable, which is what makes one set of rules
 * serve both the light and the dark theme: the panel inherits the text colour of
 * whichever it is in, and every tint is mixed from that.
 */
function ensureListViewStyles(doc) {
  if (doc.getElementById(LISTVIEW_STYLE_ID)) {
    return;
  }

  const style = doc.createElement('style');

  style.id = LISTVIEW_STYLE_ID;
  style.textContent = `
    [data-sve-lv-row] {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 7px;
      /* No width: the row is block-level, so it fills what is left after its own
         left margin. That margin is the indent — set on the card rather than as
         padding inside it, so a nested block steps in as a whole instead of
         growing a wide empty shoulder. */
      padding: 8px;
      /* Tall enough for the controls whether they are showing or not. They are
         20px and the label is about 17, so without this the row grew the moment
         the pointer arrived — and every row below it stepped down. Height is
         reserved; the horizontal space is not, since five buttons' worth of it
         would be taken from the label on every row at once. */
      min-height: 36px;
      margin-bottom: 3px;
      background: rgba(128,128,128,.16);
      border-radius: 6px;
      font-size: 13px;
      line-height: 1.3;
      /* An open hand: the row can be picked up and moved. The controls inside it
         take it back — they are pressed, not dragged. */
      cursor: grab;
      position: relative;
      /* WebKit starts no drag on a plain element from the draggable attribute
         alone — it has to be told the element itself is the thing being dragged. */
      -webkit-user-drag: element;
      /* Without it the pointer selects the label instead of taking hold, and the
         drag never begins. */
      user-select: none;
    }
    [data-sve-lv-row]:hover { background: rgba(128,128,128,.26); }
    [data-sve-lv-row]:active,
    [data-sve-lv-row][data-sve-lv-dragging] { cursor: grabbing; }
    /* The dots and the buttons share one slot and swap: at rest the row shows
       what it can do (be moved), under the pointer it shows what you can do to
       it. Neither ever takes space from the other, so nothing shifts. */
    [data-sve-lv-handle] { flex: none; display: inline-flex; align-items: center; opacity: .55; pointer-events: none; }
    /* Låst: en hængelås i stedet for prikkerne, og den bliver stående når
       markøren er over rækken — den siger hvorfor der ikke er knapper. */
    [data-sve-lv-handle][data-sve-lv-locked] svg { display: none; }
    [data-sve-lv-handle][data-sve-lv-locked]::before {
      content: "";
      width: 12px;
      height: 12px;
      background: currentColor;
      opacity: .9;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2a5 5 0 0 0-5 5v3H6.5A2.5 2.5 0 0 0 4 12.5v7A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5v-7a2.5 2.5 0 0 0-2.5-2.5H17V7a5 5 0 0 0-5-5zm0 2a3 3 0 0 1 3 3v3H9V7a3 3 0 0 1 3-3z'/%3E%3C/svg%3E") center / contain no-repeat;
    }
    /* Kan låsen tages af, er hængelåsen en knap og skal kunne rammes — resten af
       håndtaget siger bare hvad rækken kan og tager ingen klik. */
    [data-sve-lv-handle][data-sve-lv-unlockable] { pointer-events: auto; cursor: pointer; }
    [data-sve-lv-handle][data-sve-lv-unlockable]:hover { opacity: 1; }
    [data-sve-lv-row]:hover [data-sve-lv-handle][data-sve-lv-locked] { display: inline-flex; }
    [data-sve-lv-row]:hover [data-sve-lv-handle] { display: none; }
    [data-sve-lv-row]:focus-visible { outline: 2px solid #3858e9; outline-offset: -2px; }
    /* One colour, two weights. Filled is the row you have selected; the box is
       the section standing open. The same blue in both, deliberately: they are
       two facts about the same place, and a second colour would make them look
       like two unrelated things. */
    [data-sve-lv-row][data-sve-lv-current] { background: #3858e9; color: #fff; }
    [data-sve-lv-row][data-sve-lv-current]:hover { background: #4a68ee; }
    /* The open section, drawn as one thing: the box holds the section's own row
       and every row under it, so what is open reads as a place you are inside of
       rather than a row that happens to be marked.
       Quiet on purpose — it says where you are, and the blue is kept for what you
       have actually chosen.
       A border rather than a box-shadow — the box needs a real bottom edge to
       stop the last row's margin collapsing out through it. */
    [data-sve-lv-branch] {
      border: 1px solid rgba(255,255,255,.15);
      border-radius: 9px;
      /* Nothing at the bottom: the last row's own 3px stands in for it. */
      padding: 3px 3px 0;
      margin-bottom: 3px;
    }
    /* Until the selection is one of the rows inside it — then the box is the
       place you are working in, and it says so in the row's blue, held back a
       little: the filled row is what you chose, the box only says where it is. */
    [data-sve-lv-branch][data-sve-lv-here] { border-color: rgba(56,88,233,.6); }
    [data-sve-lv-row][data-sve-lv-off] { opacity: .45; }
    [data-sve-lv-row][data-sve-lv-dragging] { opacity: .4; }
    /* The drop line sits inside the row, so it needs no space of its own and
       cannot push the rows below it while a drag is under way. Which edge it
       lands on is which half of the row the pointer is in — the line is where the
       block will be, not merely which row it is near. */
    [data-sve-lv-row][data-sve-lv-drop="above"] { box-shadow: inset 0 2px 0 0 #3858e9; }
    [data-sve-lv-row][data-sve-lv-drop="below"] { box-shadow: inset 0 -2px 0 0 #3858e9; }
    /* Shown on hover only: the whole row drags, and a handle that is always
       visible reads as the only place that does. */
    /* Out of the way until the row is under the pointer or is the current one.
       Five controls on every row at once would read as the loudest thing in the
       panel, and the panel is for finding your way around. */
    [data-sve-lv-actions] { flex: none; display: none; align-items: center; gap: 1px; margin-left: 2px; }
    [data-sve-lv-row]:hover [data-sve-lv-actions],
    [data-sve-lv-row][data-sve-lv-current] [data-sve-lv-actions] { display: inline-flex; }
    [data-sve-lv-act] {
      all: unset;
      flex: none;
      width: 20px;
      height: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      cursor: pointer;
      opacity: .7;
    }
    [data-sve-lv-act]:hover { opacity: 1; background: rgba(128,128,128,.28); }
    [data-sve-lv-act][data-sve-lv-danger]:hover { background: rgba(229,72,77,.22); color: #e5484d; }
    [data-sve-lv-twist] {
      all: unset;
      flex: none;
      width: 16px;
      height: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      cursor: pointer;
      opacity: .65;
      transition: transform .12s ease;
    }
    [data-sve-lv-twist]:hover { opacity: 1; background: rgba(128,128,128,.28); }
    [data-sve-lv-twist][data-sve-lv-shut] { transform: rotate(-90deg); }
    [data-sve-lv-text] { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  `;

  doc.head.appendChild(style);
}

/** Every node in the tree, folded or not. */
function listViewFlat(nodes, out = []) {
  nodes.forEach((node) => {
    out.push(node);
    listViewFlat(node.children, out);
  });

  return out;
}

/**
 * Marks in the tree what was just clicked on the page.
 *
 * The other half of selection. Clicking a row already selects the block on the
 * page; without this the reverse was silent, and the tree quietly went on
 * pointing at whatever was last chosen *in it* — which is worse than pointing at
 * nothing, because it looks like an answer.
 *
 * Either id will do. The preview reports whichever the template annotated with,
 * and a tree built from stored values holds both.
 *
 * Ancestors are unfolded on the way, since a row inside a folded parent cannot
 * be shown as current while it is not shown at all.
 */
function listViewSyncTo(win, ...candidates) {
  const doc = win.document;
  const wanted = candidates.filter((id) => typeof id === 'string' && id !== '');

  if (!wanted.length || !listViewPanel(doc)) {
    return;
  }

  let flat = listViewFlat(listViewRoots);

  // Deepest first. A click on a block reports the block's own id *and* the
  // section's, and the block is the more specific answer — matching in tree order
  // would take the section every time and the tree would never point at anything
  // but the outermost thing you touched.
  const match = (node) => node.ids.some((id) => wanted.includes(id));
  const byDepth = (a, b) => b.depth - a.depth;
  let node = [...flat].sort(byDepth).find(match);

  // Nothing by that id: the tree was built before the block existed. Rebuild once
  // — the panel does not redraw on its own, and a block added since it opened is
  // exactly the one somebody is most likely to have just clicked.
  if (!node) {
    listViewRoots = listViewTree(win, doc);
    flat = listViewFlat(listViewRoots);
    node = [...flat].sort(byDepth).find(match);

    if (!node) {
      return;
    }
  }

  const byUid = new Map(flat.map((item) => [item.uid, item]));
  let opened = false;
  let root = node;

  for (let parent = node.parentUid; parent; parent = byUid.get(parent)?.parentUid) {
    opened = listViewCollapsed.delete(parent) || opened;
    root = byUid.get(parent) || root;
  }

  // Clicking into a section on the page is opening it, so the accordion follows —
  // otherwise the tree would unfold the clicked block while leaving whichever
  // section was open before open too, and the rule would hold for the twist but
  // not for the page.
  if (root !== node || node.depth === 0) {
    const shut = listViewCollapsed.has(root.uid) || listViewRoots.some((r) => r.uid !== root.uid && !listViewCollapsed.has(r.uid));

    if (shut) {
      listViewSoloSection(root.uid);
      opened = true;
    }
  }

  if (listViewActiveUid !== node.uid || opened) {
    listViewActiveUid = node.uid;
    renderListView(win);
  }

  // Into view, but never scrolling the page — `nearest` moves the list only as
  // far as it has to, and not at all when the row is already on screen.
  listViewPanel(doc)?.querySelector('[data-sve-lv-current]')?.scrollIntoView({ block: 'nearest' });
}

/** Flattens the tree to the rows currently visible — folded ones stop the walk. */
function listViewVisible(nodes, out = []) {
  nodes.forEach((node) => {
    out.push(node);

    if (node.children.length && !listViewCollapsed.has(node.uid)) {
      listViewVisible(node.children, out);
    }
  });

  return out;
}

const LISTVIEW_MENU_ID = '__sve-listview-menu';

/**
 * The row's own menu — the same four things a Replicator set offers, reached
 * from the tree instead of from the form.
 *
 * Appended to `document.body` rather than to the row. The panel clips its
 * contents and the list scrolls inside it, so a menu built where it is anchored
 * would be cut off at the row's own edge. Statamic's CP has the same problem and
 * solves it the same way.
 */
function openListViewMenu(win, anchor, item) {
  const doc = win.document;

  doc.getElementById(LISTVIEW_MENU_ID)?.remove();

  const menu = doc.createElement('div');
  const box = anchor.getBoundingClientRect();

  menu.id = LISTVIEW_MENU_ID;
  menu.style.cssText =
    `position:fixed;top:${Math.round(box.bottom + 4)}px;left:${Math.round(box.right - 180)}px;width:180px;z-index:99999;`
    + 'padding:4px;border-radius:8px;background:var(--theme-color-content-bg,#fff);color:currentColor;'
    + 'border:1px solid rgba(128,128,128,.3);box-shadow:0 8px 24px rgba(0,0,0,.28);'
    + 'font-family:ui-sans-serif,system-ui,sans-serif;font-size:13px;';

  const close = () => {
    menu.remove();
    win.removeEventListener('scroll', close, true);
    win.removeEventListener('resize', close);
    doc.removeEventListener('pointerdown', onOutside, true);
  };

  function onOutside(event) {
    if (!menu.contains(event.target) && event.target !== anchor) {
      close();
    }
  }

  const add = (label, run, danger = false) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = label;
    btn.style.cssText =
      'all:unset;display:block;box-sizing:border-box;width:100%;padding:7px 10px;border-radius:5px;cursor:pointer;'
      + (danger ? 'color:#e5484d;' : '');
    btn.addEventListener('mouseenter', () => {
      btn.style.background = 'rgba(128,128,128,.16)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = '';
    });
    btn.addEventListener('click', () => {
      close();
      run();
      // Redrawn after Vue has taken the write — the tree this row came from
      // describes the page as it was before it.
      win.setTimeout(() => renderListView(win), 0);
    });

    menu.appendChild(btn);
  };

  if (!item.locked) {
    add(t(win, 'listview_move_up'), () => handleMove({ uid: item.uid, direction: -1 }, doc));
    add(t(win, 'listview_move_down'), () => handleMove({ uid: item.uid, direction: 1 }, doc));
    add(t(win, 'listview_duplicate'), () => handleDuplicateRow({ uid: item.uid }, doc, win));
  }
  add(t(win, item.enabled ? 'listview_hide' : 'listview_show'), () =>
    handleHideRow({ uid: item.uid }, doc, win)
  );
  if (!item.locked) {
    add(t(win, 'listview_delete'), () => handleRemoveRow({ uid: item.uid }, doc, win), true);
  }

  doc.body.appendChild(menu);

  // Keep it on screen when the row sits near the bottom.
  const menuBox = menu.getBoundingClientRect();

  if (menuBox.bottom > win.innerHeight - 8) {
    menu.style.top = `${Math.max(8, Math.round(box.top - menuBox.height - 4))}px`;
  }

  win.addEventListener('scroll', close, true);
  win.addEventListener('resize', close);
  doc.addEventListener('pointerdown', onOutside, true);
}

/** Draws the tree. Redrawn whole; never edited in place. */
/**
 * Må den her bruger tage låsen af?
 *
 * Samme svar som i formularen, hvor hængelåsen på rækken er en knap for super
 * admins og en kendsgerning for alle andre. Låsen er et værn mod uheld.
 */
function mayUnlockRows(win) {
  return !!win.Statamic?.$permissions?.has?.('super');
}

/**
 * Sætter låsen på — eller tager den af — for hele den liste rækken hører til.
 *
 * Ikke kun den ene række, og det er med vilje: `locked_rows` er en indstilling på
 * FELTET, så alle rækker i listen er låst af samme grund. Træet kan i forvejen
 * bare aflæse de rækker der tilfældigvis er tegnet i formularen netop nu og
 * smitter fundet ud til resten af listen (se listViewTree) — låste man én række
 * op, ville dens søskende låse den igen i næste optegning.
 *
 * Skrives på formularens rækker, hvor projektets LockedRows.js læser dem. Det er
 * det ene sted tilstanden bor, så hængelåsen her og hængelåsen i venstre panel er
 * to visninger af samme kendsgerning — hvad man end klikker på, følger det andet
 * med. Intet gemmes: låsen er på igen næste gang siden åbnes.
 */
function setListViewListLock(doc, item, locked) {
  listViewFlat(listViewRoots)
    .filter((node) => node.parentUid === item.parentUid && node.listKey === item.listKey)
    .forEach((node) => {
      const el = node.uid ? findSetByVisualIdInput(node.uid, doc) : null;

      if (!el) {
        return;
      }

      el.toggleAttribute('data-row-locked', locked);
      el.toggleAttribute('data-row-unlocked', !locked);
    });
}

/**
 * Tegner træet om når låsen skifter et andet sted.
 *
 * Hængelåsen i venstre panel skriver i de samme attributter, og træet er råt DOM
 * uden reaktivitet — uden dette stod det med den lås der var da det sidst blev
 * tegnet. Kun de to attributter aflyttes, og kun mens panelet er åbent.
 */
function watchListViewLocks(win) {
  if (listViewLockObserver) {
    return;
  }

  const doc = win.document;
  let queued = false;

  listViewLockObserver = new MutationObserver(() => {
    if (queued || !listViewPanel(doc)) {
      return;
    }

    queued = true;
    win.requestAnimationFrame(() => {
      queued = false;

      if (listViewPanel(doc)) {
        renderListView(win);
      }
    });
  });

  listViewLockObserver.observe(doc.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ['data-row-locked', 'data-row-unlocked'],
  });
}

function renderListView(win) {
  const doc = win.document;
  const list = listViewPanel(doc)?.querySelector('[data-sve-listview-list]');

  if (!list) {
    return;
  }

  ensureListViewStyles(doc);
  watchListViewLocks(win);

  listViewRoots = listViewTree(win, doc);

  // How the panel opens: the first section unfolded, the rest shut. Decided once
  // per opening rather than on every draw, so a section you fold by hand stays
  // folded through a move, a click on the page, or anything else that redraws.
  if (!listViewStarted && listViewRoots.length) {
    listViewSoloSection(listViewRoots[0].uid);
    listViewOpenShallow(listViewRoots[0]);

    // And marked, not merely unfolded. The panel opens showing the first
    // section's blocks, so that is where you are — a tree with nothing blue in
    // it reads as though nothing has been chosen yet.
    //
    // Only the mark. Nothing is opened on the page from here: this runs while
    // the editor is still settling, and reaching into it at that moment is what
    // left the panel and the preview blank once already.
    listViewActiveUid ??= listViewRoots[0].uid;

    listViewStarted = true;
  }

  list.textContent = '';

  const visible = listViewVisible(listViewRoots);

  // The box the open section is drawn in. Only one section can be open — they
  // are an accordion — but this is built per root anyway, so nothing here
  // depends on that staying true.
  //
  // Keyed by the node itself rather than by its uid: some rows have no uid at
  // all, and those still have to land inside the box with their siblings, or
  // the order breaks around them.
  const branchBoxes = new Map();

  listViewRoots.forEach((root) => {
    if (listViewCollapsed.has(root.uid)) {
      return;
    }

    const box = doc.createElement('div');
    const inside = listViewVisible([root]);

    box.setAttribute('data-sve-lv-branch', '');

    // Blue only when what is selected is in *this* box. A section can stand open
    // while the selection sits in a folded one — then the box is still where you
    // are looking, but not where you are, and the blue would say otherwise.
    if (inside.some((node) => node.uid && node.uid === listViewActiveUid)) {
      box.setAttribute('data-sve-lv-here', '');
    }

    inside.forEach((node) => branchBoxes.set(node, box));
  });

  // Where a row goes: into its section's box, or straight into the list when the
  // section is folded. The box is put in place by the first row that asks for it
  // — the section's own — which is what keeps the sections in their order
  // without a second pass over the tree.
  const parentFor = (item) => {
    const box = branchBoxes.get(item);

    if (!box) {
      return list;
    }

    if (!box.parentNode) {
      list.appendChild(box);
    }

    return box;
  };

  if (!visible.length) {
    const empty = doc.createElement('div');

    empty.style.cssText = 'padding:30px 6px;text-align:center;opacity:.55;font-size:12px;';
    empty.textContent = t(win, 'listview_empty');
    list.appendChild(empty);

    return;
  }

  visible.forEach((item) => {
    const meta = setMeta(win, item.type);
    const row = doc.createElement('div');

    row.setAttribute('data-sve-lv-row', '');
    row.setAttribute('role', 'button');
    row.tabIndex = 0;
    row.style.marginLeft = `${item.depth * 14}px`;

    if (item.uid === listViewActiveUid) {
      row.setAttribute('data-sve-lv-current', '');
    }

    if (!item.enabled) {
      row.setAttribute('data-sve-lv-off', '');
      row.title = t(win, 'listview_hidden');
    }

    // The arrow opens and shuts; the row selects. Two jobs, two targets — so
    // looking at a block and unfolding it are separate acts, and neither is a
    // side effect of the other.
    //
    // Nothing in its place when there are no children: the indent already says
    // which level the row is on, so a reserved gap for an absent control just
    // makes the row look like it is missing one.
    if (item.children.length) {
      const twist = doc.createElement('button');

      twist.type = 'button';
      twist.setAttribute('data-sve-lv-twist', '');
      twist.title = t(win, 'listview_toggle');
      twist.innerHTML =
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
        + 'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

      if (listViewCollapsed.has(item.uid)) {
        twist.setAttribute('data-sve-lv-shut', '');
      }

      twist.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation(); // unfolds; does not select

        if (!listViewCollapsed.has(item.uid)) {
          listViewCollapsed.add(item.uid);
        } else if (item.depth === 0) {
          // A section opens onto its own blocks, with theirs folded, and the
          // other sections shut — the accordion.
          listViewSoloSection(item.uid);
          listViewOpenShallow(item);
        } else {
          listViewCollapsed.delete(item.uid);
        }

        renderListView(win);
      });

      row.appendChild(twist);
    }

    // `block` is the stand-in, and it has to be a name `panelIcon` knows: it
    // passes anything unrecognised straight through, which is what lets an emoji
    // work — and what would otherwise have drawn the literal word here.
    const icon = panelIcon(doc, meta?.icon || 'block');

    if (icon) {
      icon.style.flex = 'none';
      row.appendChild(icon);
    }

    const text = doc.createElement('span');

    text.setAttribute('data-sve-lv-text', '');
    text.textContent = meta?.display || item.type;
    row.appendChild(text);

    // The section toolbar's own controls, on the row. The same four things the
    // bar in the preview offers, calling the same functions — so a block can be
    // moved, copied or thrown away from whichever of the two you happen to be
    // looking at. The rest stays in the menu beside them.
    const actions = doc.createElement('span');

    actions.setAttribute('data-sve-lv-actions', '');

    const action = (title, svg, run, danger = false) => {
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.setAttribute('data-sve-lv-act', '');
      btn.title = title;

      if (danger) {
        btn.setAttribute('data-sve-lv-danger', '');
      }

      btn.innerHTML =
        `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" `
        + `stroke-linecap="round" stroke-linejoin="round">${svg}</svg>`;
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation(); // the action runs; the row is not selected

        run();
        win.setTimeout(() => renderListView(win), 0);
      });

      actions.appendChild(btn);
    };

    // En låst række kan hverken flyttes, dubleres eller slettes — så den får
    // ingen af knapperne. Kun menuen, hvorfra den stadig kan skjules og vises.
    if (item.uid && item.locked) {
      const dots = doc.createElement('button');

      dots.type = 'button';
      dots.setAttribute('data-sve-lv-act', '');
      dots.title = t(win, 'listview_actions');
      dots.innerHTML =
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.7"/>'
        + '<circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg>';
      dots.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        openListViewMenu(win, dots, item);
      });

      actions.appendChild(dots);
    } else if (item.uid) {
      // Åben hængelås: listen er låst op ved et klik, her eller i venstre panel.
      // Den vej tilbage hører hjemme samme sted som vejen ud — ellers kunne låsen
      // kun sættes på igen ved at hente siden.
      if (item.unlocked && mayUnlockRows(win)) {
        action(
          t(win, 'listview_relock'),
          '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
          () => setListViewListLock(doc, item, true)
        );
      }

      action(t(win, 'listview_move_up'), '<path d="M12 19V5M5 12l7-7 7 7"/>', () =>
        handleMove({ uid: item.uid, direction: -1 }, doc)
      );
      action(t(win, 'listview_move_down'), '<path d="M12 5v14M19 12l-7 7-7-7"/>', () =>
        handleMove({ uid: item.uid, direction: 1 }, doc)
      );
      action(
        t(win, 'listview_duplicate'),
        '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
        () => handleDuplicateRow({ uid: item.uid }, doc, win)
      );
      action(
        t(win, 'listview_delete'),
        '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
        () => handleRemoveRow({ uid: item.uid }, doc, win),
        true
      );

      const dots = doc.createElement('button');

      dots.type = 'button';
      dots.setAttribute('data-sve-lv-act', '');
      dots.title = t(win, 'listview_actions');
      dots.innerHTML =
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.7"/>'
        + '<circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg>';
      dots.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        openListViewMenu(win, dots, item);
      });

      actions.appendChild(dots);
    }

    row.appendChild(actions);

    // The six dots, in the slot the action buttons take over on hover. It says
    // the row can be moved; the row itself is what you take hold of, so this
    // never needs to be hit — hence no pointer events on it.
    if (item.uid) {
      const handle = doc.createElement('span');

      handle.setAttribute('data-sve-lv-handle', '');

      if (item.locked) {
        handle.setAttribute('data-sve-lv-locked', '');
        handle.title = t(win, mayUnlockRows(win) ? 'listview_unlock' : 'listview_locked');

        // Hængelåsen er en knap for den der satte låsen. Låsen er et værn mod
        // uheld, ikke mod udvikleren: et klik tager den af listen, og rækkerne
        // kan flyttes og slettes som alle andre — indtil siden hentes igen.
        if (mayUnlockRows(win)) {
          handle.setAttribute('data-sve-lv-unlockable', '');
          handle.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation(); // låser op; vælger ikke rækken

            setListViewListLock(doc, item, false);
            renderListView(win);
          });
        }
      }
      handle.innerHTML =
        '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.7"/>'
        + '<circle cx="15" cy="6" r="1.7"/><circle cx="9" cy="12" r="1.7"/><circle cx="15" cy="12" r="1.7"/>'
        + '<circle cx="9" cy="18" r="1.7"/><circle cx="15" cy="18" r="1.7"/></svg>';
      row.appendChild(handle);
    }

    if (!item.uid) {
      // No id to point at. Statamic gives every replicator row one, so this is a
      // shape we don't expect — drawn, because leaving a hole in the tree would
      // misrepresent the page, but neither clickable nor draggable.
      row.style.opacity = '.4';
      row.style.cursor = 'default';
      parentFor(item).appendChild(row);

      return;
    }

    const select = () => {
      listViewActiveUid = item.uid;

      // Selecting only selects. Folding is the arrow's job.
      list.querySelectorAll('[data-sve-lv-current]').forEach((el) => el.removeAttribute('data-sve-lv-current'));
      row.setAttribute('data-sve-lv-current', '');

      // And the box the row is in follows the selection with it. Done here as
      // well as in the draw, because a click on a row does not redraw the tree —
      // it moves the mark — so the box would otherwise keep the colour it was
      // given when the panel was last built.
      list.querySelectorAll('[data-sve-lv-here]').forEach((el) => el.removeAttribute('data-sve-lv-here'));
      row.closest('[data-sve-lv-branch]')?.setAttribute('data-sve-lv-here', '');

      // Two halves of one click. This one opens the block in the editor panel,
      // which is what the outline panel has always done.
      focusFromPreview(item.uid, doc, win, { clampToSection: true });

      // And this one does it on the page: the outline around the block, and its
      // toolbar, exactly as clicking it there would. Without it the tree could
      // only ever half-select — the panel knew, the page did not.
      sendToPreview(
        { source: 'statamic-visual-editor', type: 'sve-activate', ids: item.ids },
        win
      );
    };

    row.addEventListener('click', select);
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        select();
      }
    });

    // --- Reordering ---------------------------------------------------------
    // Only among true siblings: same parent row AND same field on it. Two rows
    // can sit at the same depth under the same parent and still live in
    // different arrays, and moving between those is not a reorder — it is a move
    // to somewhere else, which this panel does not offer.
    // The whole row is the handle. No separate chip to aim at — the open hand
    // over the row says it can be picked up, which is the affordance a dedicated
    // control was standing in for.
    row.draggable = !item.locked;

    row.addEventListener('dragstart', (event) => {
      listViewDragUid = item.uid;
      row.setAttribute('data-sve-lv-dragging', '');
      event.dataTransfer.effectAllowed = 'move';
      // Firefox starts no drag at all without something on the transfer.
      event.dataTransfer.setData('text/plain', item.uid);
    });

    row.addEventListener('dragend', () => {
      listViewDragUid = null;
      row.removeAttribute('data-sve-lv-dragging');
      list.querySelectorAll('[data-sve-lv-drop]').forEach((el) => el.removeAttribute('data-sve-lv-drop'));
    });

    const sameList = () => {
      const dragged = listViewVisible(listViewRoots).find((node) => node.uid === listViewDragUid);

      return (
        dragged
        && dragged.uid !== item.uid
        && dragged.parentUid === item.parentUid
        && dragged.listKey === item.listKey
      );
    };

    /** Which half of the row the pointer is in — the edge the block would land on. */
    const dropSide = (event) => {
      const box = row.getBoundingClientRect();

      return event.clientY < box.top + box.height / 2 ? 'above' : 'below';
    };

    row.addEventListener('dragover', (event) => {
      if (!sameList()) {
        return;
      }

      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      row.setAttribute('data-sve-lv-drop', dropSide(event));
    });

    row.addEventListener('dragleave', () => row.removeAttribute('data-sve-lv-drop'));

    row.addEventListener('drop', (event) => {
      const side = row.getAttribute('data-sve-lv-drop') || dropSide(event);

      row.removeAttribute('data-sve-lv-drop');

      if (!sameList()) {
        return;
      }

      event.preventDefault();

      const moved = listViewDragUid;
      const from = listViewVisible(listViewRoots).find((node) => node.uid === moved).index;

      // `handleMove` takes the row out first and then puts it back, so the index
      // it wants is one in the array as it will be *after* the removal. Everything
      // below the old position has shifted up by one by then, which is the whole
      // of the arithmetic here — and the reason dragging down by one used to look
      // like nothing happening.
      const target = item.index - (from < item.index ? 1 : 0);

      handleMove({ uid: moved, toIndex: side === 'above' ? target : target + 1 }, doc);

      listViewDragUid = null;
      listViewActiveUid = moved;

      // Redrawn from the values after Vue has taken the write, not from the tree
      // this row was built from — that one describes the old order.
      win.setTimeout(() => renderListView(win), 0);
    });

    parentFor(item).appendChild(row);
  });
}

function toggleListViewPanel(win) {
  const doc = win.document;

  if (listViewPanel(doc)) {
    closeListViewPanel(win);

    return;
  }

  closeRightPanels(win, [LISTVIEW_PANEL_ID]);

  const header = lpHeader(doc);
  const top = header ? Math.round(header.getBoundingClientRect().bottom) : 0;
  const panel = doc.createElement('div');

  panel.id = LISTVIEW_PANEL_ID;
  panel.style.cssText =
    `position:fixed;top:${top}px;right:0;bottom:0;width:${listViewPanelWidth(win)}px;z-index:41;` +
    'display:flex;flex-direction:column;background:var(--theme-color-content-bg,#fff);color:currentColor;' +
    'border-left:1px solid rgba(128,128,128,.28);box-shadow:-8px 0 24px rgba(0,0,0,.18);' +
    'font-family:ui-sans-serif,system-ui,sans-serif;overflow:hidden;';

  panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px 0;flex:0 0 auto;">
      <div data-sve-lv-tabs style="display:flex;gap:14px;"></div>
      <button type="button" data-sve-close style="all:unset;cursor:pointer;width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;border-radius:6px;opacity:.7;">✕</button>
    </div>
    <div style="border-bottom:1px solid rgba(128,128,128,.2);flex:0 0 auto;"></div>
    <div data-sve-lv-body style="flex:1 1 auto;min-height:0;display:flex;flex-direction:column;"></div>
  `;

  // Two views of the same page, so one panel with two tabs rather than two
  // panels fighting for the same edge: the blocks it is built from, and the
  // headings a reader actually meets.
  const tabsEl = panel.querySelector('[data-sve-lv-tabs]');

  [
    { key: 'tree', label: t(win, 'listview') },
    { key: 'outline', label: t(win, 'outline') },
  ].forEach((tab) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.dataset.lvTab = tab.key;
    btn.textContent = tab.label;
    btn.style.cssText =
      'all:unset;cursor:pointer;padding:6px 0 8px;font-size:13px;font-weight:600;opacity:.55;'
      + 'border-bottom:2px solid transparent;margin-bottom:-1px;';
    btn.addEventListener('click', () => setListViewTab(win, tab.key));
    tabsEl.appendChild(btn);
  });

  panel.querySelector('[data-sve-close]').addEventListener('click', () => closeListViewPanel(win));
  panel.appendChild(
    panelResizer(win, panel, {
      side: 'right',
      storageKey: LISTVIEW_WIDTH_KEY,
      // Keep the preview beside the panel while the edge is being dragged, not
      // just once it is let go — otherwise the page slides under the panel for
      // the length of the drag.
      onResize: () => syncPreviewInset(win),
    })
  );
  doc.body.appendChild(panel);
  syncPreviewInset(win);

  setListViewTab(win, listViewTab);
}

/**
 * Shows one of the panel's two views.
 *
 * Each tab owns its own body markup, and the outline's is exactly what its
 * standalone panel builds — the same containers, so `renderOutline` fills them
 * without knowing it has moved house.
 *
 * The preview is only asked to report its headings while that tab is showing.
 * Watching costs a message per change, and a panel showing blocks has no use
 * for them.
 */
function setListViewTab(win, tab) {
  const doc = win.document;
  const panel = listViewPanel(doc);

  if (!panel) {
    return;
  }

  listViewTab = tab;

  panel.querySelectorAll('[data-lv-tab]').forEach((btn) => {
    const active = btn.dataset.lvTab === tab;

    btn.style.opacity = active ? '1' : '.55';
    btn.style.borderBottomColor = active ? '#3858e9' : 'transparent';
  });

  const body = panel.querySelector('[data-sve-lv-body]');

  if (tab === 'outline') {
    body.innerHTML = `
      <div style="padding:8px 14px 0;font-size:11px;opacity:.6;flex:0 0 auto;">${t(win, 'outline_hint')}</div>
      <div data-sve-outline-notice style="flex:0 0 auto;"></div>
      <div data-sve-outline-list style="flex:1 1 auto;min-height:0;overflow-y:auto;padding:10px 12px 16px;"></div>
    `;

    renderOutline(win); // "Loading…", until the preview answers
    watchOutlineInPreview(win, true);

    // A preview still booting has no listener yet, and a message posted into it
    // is simply gone. Two more asks, then the silence is taken for an answer.
    [700, 2000].forEach((delay) => {
      win.setTimeout(() => {
        if (!outlineAnswered && listViewPanel(win.document) && listViewTab === 'outline') {
          watchOutlineInPreview(win, true);
        }
      }, delay);
    });

    return;
  }

  watchOutlineInPreview(win, false);

  body.innerHTML = `
    <div style="padding:8px 14px 0;font-size:11px;opacity:.6;flex:0 0 auto;">${t(win, 'listview_hint')}</div>
    <div data-sve-listview-list style="flex:1 1 auto;min-height:0;overflow-y:auto;padding:10px 12px 16px;"></div>
  `;

  renderListView(win);
}

// --- Single-section ("solo") panel ---------------------------------------------
// Clicking a section in the preview opens the editor panel showing ONLY that
// section's fields — instead of the whole page_sections list. Isolation is done
// the Vue-safe way: mark the path from the section's set up to the editor root
// with attributes, then hide everything else via an injected <style>. We never
// insert nodes into, or set inline display on, Statamic's Vue-managed field
// tree — doing so corrupts Vue's virtual-DOM diffing and tears the whole form
// down. A MutationObserver re-applies the marks whenever Vue re-renders the
// fields (e.g. when a set is expanded), so isolation survives re-renders.

const SOLO_STYLE_ID = 'sve-solo-style';
const SOLO_BACK_ID = 'sve-solo-back';
const SOLO_SAVE_ID = 'sve-solo-save';
const SOLO_PARENT_ATTR = 'data-sve-solo-parent';
const SOLO_KEEP_ATTR = 'data-sve-solo-keep';
/** Panel-iframe isolation: mark nodes to hide, instead of parent>child solo CSS. */
const PANEL_AWAY_ATTR = 'data-sve-panel-away';
const PANEL_COLUMN_ATTR = 'data-sve-panel-column'; // the sve-panel frame's scrolling column

let soloUid = null;
let soloObserver = null;
// The set whose blocks this visit has already folded. Cleared on the way to
// another one, so stepping out of a block and back into its section folds again.
let foldedFor = null;

/** Removes all solo marks, the injected style, the observer and the back button. */
export function clearSolo(doc) {
  soloUid = null;
  soloBackAction = null;
  foldedFor = null;

  clearFocus(doc);

  if (soloObserver) {
    soloObserver.disconnect();
    soloObserver = null;
  }

  doc.getElementById(SOLO_STYLE_ID)?.remove();
  doc.getElementById(SOLO_BACK_ID)?.remove();
  doc.getElementById(SOLO_SAVE_ID)?.remove();
  doc.querySelectorAll(`[${SOLO_PARENT_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_PARENT_ATTR));
  doc.querySelectorAll(`[${SOLO_KEEP_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_KEEP_ATTR));
  doc.querySelectorAll(`[${PANEL_AWAY_ATTR}]`).forEach((el) => el.removeAttribute(PANEL_AWAY_ATTR));
}

/**
 * How far up the isolation reaches: the panel's scrolling column, not the pane
 * around it.
 *
 * The editor pane holds two things — the column of fields and the handle that
 * drags its width. Marking up to the pane makes the handle an off-path child of a
 * marked parent, and the stylesheet below hides it: the panel could be resized
 * while showing the whole page and not while showing one section of it. Stopping
 * at the column leaves everything beside it alone.
 */
function soloRoot(doc) {
  if (panelFrameDoc(doc)) {
    // Prefer a root that actually contains the section set. The first
    // `.publish-fields` on the page can be a nested/empty wrapper that does
    // NOT contain page_sections — markPanelIsolate then fails (set not
    // contained), soloSection still returned true, and the sidebar stayed on
    // title/Published forever.
    const section = doc.querySelector(SELECTORS.replicatorSet);
    const fromSet =
      section?.closest('.publish-form') ||
      section?.closest('main') ||
      section?.closest('.publish-fields');

    if (fromSet) {
      return fromSet;
    }

    return (
      doc.querySelector('.publish-form') ||
      doc.querySelector('main') ||
      doc.querySelector('.publish-fields')
    );
  }

  return (
    doc.querySelector('.live-preview-fields') ||
    doc.querySelector('.live-preview-editor')
  );
}

/** True when this document is the sve-panel iframe (globals / saved section). */
function panelFrameDoc(doc) {
  try {
    return new URLSearchParams(doc.defaultView?.location?.search || '').has('sve-panel');
  } catch {
    return false;
  }
}

function ensureSoloStyle(doc) {
  const existing = doc.getElementById(SOLO_STYLE_ID);

  // Panel iframe uses away-marks (safe under Vue re-renders). Live Preview keeps
  // the classic parent>keep path CSS.
  const css = panelFrameDoc(doc)
    ? `[${PANEL_AWAY_ATTR}] { display: none !important; }`
    : `[${SOLO_PARENT_ATTR}] > *:not([${SOLO_KEEP_ATTR}]) { display: none !important; }`;

  if (existing) {
    if (existing.textContent !== css) {
      existing.textContent = css;
    }

    return;
  }

  const style = doc.createElement('style');

  style.id = SOLO_STYLE_ID;
  style.textContent = css;
  doc.head.appendChild(style);
}

/** What the back pill does, when it is not simply leaving the solo view. */
let soloBackAction = null;

/** Leaves the solo view: back to the whole form, in whatever mode is selected. */
function leaveSolo(doc, win) {
  // Synced-section panel: "back" means leave the global edit, not the entry meta form.
  if (panelFrameDoc(doc) && win.location.pathname.includes('/collections/')) {
    win.parent.postMessage(
      { source: 'statamic-visual-editor', type: 'request-close-global' },
      win.location.origin
    );

    return;
  }

  // Same when the synced entry's form is mounted here: "all sections" means the
  // page's sections. Dropping the solo would instead show the library entry's own
  // form — Navn, Synkroniseret, Published — which is not a place to step back to.
  if (globalSectionHost(doc)) {
    handleRequestCloseGlobal(win);

    return;
  }

  // Stepping out of a widget inside the header goes back to the header, the way
  // a block steps back into the section holding it. Leaving the header itself is
  // the bar's job, not this one's.
  if (chromeHost(doc) && chromeInlineKind) {
    const kind = chromeInlineKind;

    clearSolo(doc);
    soloChromeTab(win, doc, kind);
    watchChromeSolo(win, doc, kind);

    return;
  }

  // Leaving a settings view hands the panel back to whatever mode is selected;
  // leaving an ordinary solo view leaves the panel exactly as it was.
  const wasSettings = forcePanelOpen;

  forcePanelOpen = false;
  clearSolo(doc);

  if (wasSettings) {
    setLpCollapsed(win, lpMode(win) !== 'show');
  }
}

/**
 * Back-to-full-form control, appended to the body (outside the Vue tree). When a
 * `saveUid` is given (settings view), a "Gem sektion" button is placed beside it
 * so the section can be saved as a template right from the panel — the same
 * action as the hover control's bookmark, offered "begge steder".
 *
 * `back` re-points it: a focused block goes back to the section it sits in, named
 * after that section, rather than all the way out. The pill is built once and
 * relabelled on later passes — a step deeper is a new destination, not a new
 * button, and rebuilding it would lose its place in the header.
 */
function addSoloBackButton(doc, win, saveUid = null, back = null) {
  soloBackAction = back?.onBack ?? null;

  // No way back to a list that isn't there. With "Open in the first section" on,
  // the page-sections field is not in the panel, so the outermost back button
  // would lead to an empty view. A block inside a section still has somewhere to
  // go — its section — and keeps its button; only the last step out is dropped.
  if (!back && featureOn(win, 'open_first_section')) {
    doc.getElementById(SOLO_BACK_ID)?.remove();

    return;
  }

  const label = back?.label || t(win, 'all_sections');
  const existing = doc.getElementById(SOLO_BACK_ID);

  if (existing) {
    const text = existing.querySelector('[data-sve-back-label]');

    if (text && text.textContent !== label) {
      text.textContent = label;
    }

    return;
  }

  const header = lpHeader(doc);
  // A header pill, styled like the others — grey, not a floating white button.
  const pill =
    'display:inline-flex;align-items:center;gap:0.55em;height:28px;padding:0 12px;border:none;' +
    'border-radius:8px;background:rgba(128,128,128,.16);color:currentColor;cursor:pointer;' +
    'font-size:12px;font-weight:500;font-family:inherit;';
  // Drop it into the header right after the panel's own frame, so "back to all
  // sections" reads as part of the same row of controls. Ikke fanerne som anker
  // længere — de bor nede i panelets bundlinje nu.
  const anchor =
    doc.getElementById(frameId('settings')) ||
    doc.getElementById(HEADER_TOOLBAR_ID)?.querySelector('button[data-tab="settings"]');

  const btn = doc.createElement('button');

  btn.id = SOLO_BACK_ID;
  btn.type = 'button';
  btn.innerHTML =
    '<span style="display:inline-flex;align-items:center;justify-content:center;font-size:1.2rem;line-height:1;font-weight:600;transform:translateY(-1.5px);">&#8249;</span>' +
    `<span data-sve-back-label>${label}</span>`;
  btn.style.cssText = pill;
  btn.addEventListener('mouseenter', () => (btn.style.background = 'rgba(128,128,128,.28)'));
  btn.addEventListener('mouseleave', () => (btn.style.background = 'rgba(128,128,128,.16)'));
  btn.addEventListener('click', () => {
    // Read at click time, not at build time: the pill outlives the view it was
    // built in, and by then it points somewhere else.
    const step = soloBackAction;

    if (step) {
      step();

      return;
    }

    leaveSolo(doc, win);
  });

  if (anchor) {
    anchor.after(btn);
  } else if (header) {
    header.insertBefore(btn, header.firstChild);
  } else {
    doc.body.appendChild(btn);
  }

  if (!saveUid) {
    return;
  }

  const save = doc.createElement('button');

  save.id = SOLO_SAVE_ID;
  save.type = 'button';
  save.innerHTML =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    `<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg><span>${t(win, 'save_section')}</span>`;
  save.style.cssText = pill;
  save.addEventListener('mouseenter', () => (save.style.background = 'rgba(128,128,128,.28)'));
  save.addEventListener('mouseleave', () => (save.style.background = 'rgba(128,128,128,.16)'));
  save.addEventListener('click', () => handleSaveSection({ uid: saveUid }, doc, win));

  btn.after(save);
}

/**
 * Marks the path from the target set up to the editor root: each parent gets
 * SOLO_PARENT_ATTR, each child on the path gets SOLO_KEEP_ATTR. Combined with
 * the injected style, this hides every off-path element. Returns true on success.
 */
function markSoloPath(uid, editor, doc) {
  // Synced-section panel: never use parent>keep CSS — Vue replaces wrappers and
  // leaves an empty sidebar with only the focus header. Away-marks are remade
  // from scratch on every pass and do not depend on surviving attributes.
  if (panelFrameDoc(doc)) {
    return markPanelIsolate(uid, editor, doc);
  }

  doc.querySelectorAll(`[${SOLO_PARENT_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_PARENT_ATTR));
  doc.querySelectorAll(`[${SOLO_KEEP_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_KEEP_ATTR));

  const setEl = findSetByUid(uid, doc);

  if (!setEl || !editor.contains(setEl)) {
    return false;
  }

  let node = setEl;

  while (node && node !== editor && node.parentElement) {
    node.setAttribute(SOLO_KEEP_ATTR, '');
    node.parentElement.setAttribute(SOLO_PARENT_ATTR, '');
    node = node.parentElement;
  }

  // Focus header lives outside Vue — remake must not leave it un-kept, or the
  // solo stylesheet hides it until paintFocus runs (and on a failed expand it
  // never does).
  doc.getElementById(FOCUS_HEADER_ID)?.setAttribute(SOLO_KEEP_ATTR, '');

  // Expand the set (and any ancestor sets) so its fields show.
  [...collectAncestorSets(setEl), setEl].forEach(expandSet);

  return true;
}

/**
 * Panel-iframe isolation: hide every sibling along the path to the focused set.
 * Fully cleared and rebuilt each call — safe when Vue swaps intermediate nodes.
 */
function markPanelIsolate(uid, editor, doc) {
  doc.querySelectorAll(`[${PANEL_AWAY_ATTR}]`).forEach((el) => el.removeAttribute(PANEL_AWAY_ATTR));

  const setEl = findSetByUid(uid, doc);

  if (!setEl || !editor?.contains(setEl)) {
    return false;
  }

  [...collectAncestorSets(setEl), setEl].forEach(expandSet);

  const keep = new Set();
  const header = doc.getElementById(FOCUS_HEADER_ID);

  if (header) {
    keep.add(header);
  }

  let node = setEl;

  while (node && node !== editor) {
    keep.add(node);
    node = node.parentElement;
  }

  keep.forEach((el) => {
    const parent = el.parentElement;

    if (!parent) {
      return;
    }

    for (const child of parent.children) {
      if (keep.has(child) || child.contains(setEl)) {
        continue;
      }

      // Never hide the focus header or sticky chrome we inject.
      if (child.id === FOCUS_HEADER_ID || child.hasAttribute('data-sve-focus-header')) {
        continue;
      }

      child.setAttribute(PANEL_AWAY_ATTR, '');
    }
  });

  return true;
}

/**
 * Sidder markeringen stadig på det den blev sat på?
 *
 * At spørge om der overhovedet findes en keep-markering i dokumentet er ikke
 * nok. Focus-headeren bærer selv en, og den ligger uden for Vue's træ og
 * forsvinder aldrig. Bygger Vue feltkolonnen om — hvilket den gør når panelet
 * trækkes forbi en vis bredde — kommer rækkerne tilbage umarkerede, mens
 * headeren stadig har sin. Den gamle vagt læste det som "markeringen overlevede"
 * og lod være med at markere igen, og stilarket skjulte så hele kolonnen: kun
 * headeren stod tilbage, og panelet var tomt indtil man forlod solo-visningen.
 *
 * Spørgsmålet skal stilles til de elementer markeringen faktisk hører til. Er de
 * væk, eller er de kommet igen uden den, skal stien sættes op på ny.
 */
function soloMarksIntact(targets) {
  return targets.length > 0 && targets.every((el) => el?.isConnected && el.hasAttribute(SOLO_KEEP_ATTR));
}

/**
 * Synced-section iframe: the focus header can paint while the set is still
 * collapsed — header paints, fields never mount → empty sidebar. Re-assert
 * expand + away-marks for a short window after each solo.
 */
function ensurePanelSoloVisible(win, doc, uid) {
  let tries = 0;

  const tick = () => {
    if (soloUid !== uid || !panelFrameDoc(doc)) {
      return;
    }

    const setEl = findSetByUid(uid, doc);
    const editor = soloRoot(doc);

    if (!setEl || !editor) {
      if (tries++ < 25) {
        win.setTimeout(tick, 120);
      }

      return;
    }

    if (isSetCollapsed(setEl)) {
      expandSet(setEl);
    }

    markPanelIsolate(uid, editor, doc);

    const hasFields =
      setEl.querySelector('.publish-field, [class*="-fieldtype"], .bard-fieldtype, input, textarea, select') &&
      !isSetCollapsed(setEl);

    if (!hasFields && tries++ < 25) {
      win.setTimeout(tick, 120);
    }
  };

  win.setTimeout(tick, 50);
  win.setTimeout(tick, 200);
  win.setTimeout(tick, 500);
  win.setTimeout(tick, 1000);
}

/**
 * Is the full solo keep/parent chain still intact from the set up to the editor?
 *
 * Checking only the set is not enough: Vue often replaces intermediate wrappers
 * while leaving the set node alone. Solo CSS then hides everything under the
 * break, and only the focus header (kept outside Vue) remains — empty sidebar
 * with a title. Same failure mode on the synced-section sve-panel iframe.
 */
function soloPathIntact(uid, editor, doc) {
  const setEl = findSetByUid(uid, doc);

  if (!setEl || !editor?.isConnected || !editor.contains(setEl)) {
    return false;
  }

  if (!editor.hasAttribute(SOLO_PARENT_ATTR)) {
    return false;
  }

  let node = setEl;

  while (node && node !== editor) {
    if (!node.hasAttribute(SOLO_KEEP_ATTR)) {
      return false;
    }

    const parent = node.parentElement;

    if (!parent?.hasAttribute(SOLO_PARENT_ATTR)) {
      return false;
    }

    node = parent;
  }

  return node === editor;
}

/**
 * Isolates a section's settings — and nothing else — in the editor panel.
 *
 * Reuses the solo marking, only starting deeper: instead of keeping the path down
 * to the whole set, it keeps the path down to the set's own `settings` fields, so
 * the panel shows the spacing/colour controls alone. Several fields can be kept
 * at once (settings plus its per-breakpoint siblings) — the style only hides
 * children that aren't marked, so marked siblings all survive.
 */
export function soloSectionSettings(uid, doc, win) {
  const setEl = findSetByUid(uid, doc);
  const editor = soloRoot(doc);

  if (!setEl || !editor || !editor.contains(setEl)) {
    return false;
  }

  soloUid = uid;

  // Sættet slås op forfra hver gang. Elementet fra før er kun gyldigt indtil Vue
  // bygger kolonnen om, og markeringer sat på et element der ikke længere står i
  // dokumentet, gør ingenting.
  const apply = () => {
    const current = findSetByUid(uid, doc) || setEl;
    const root = soloRoot(doc) || editor;
    const targets = sectionSettingsFields(current);

    if (!targets.length || !root) {
      return false;
    }

    ensureSoloStyle(doc);

    doc.querySelectorAll(`[${SOLO_PARENT_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_PARENT_ATTR));
    doc.querySelectorAll(`[${SOLO_KEEP_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_KEEP_ATTR));

    targets.forEach((target) => {
      for (let node = target; node && node !== root && node.parentElement; node = node.parentElement) {
        node.setAttribute(SOLO_KEEP_ATTR, '');
        node.parentElement.setAttribute(SOLO_PARENT_ATTR, '');
      }
    });

    addSoloBackButton(doc, win, uid);

    return true;
  };

  if (!apply()) {
    return false;
  }

  if (soloObserver) {
    soloObserver.disconnect();
  }

  const target = doc.querySelector('.live-preview-fields') || editor;

  soloObserver = new MutationObserver(() => {
    if (soloUid !== uid) {
      return;
    }

    const current = findSetByUid(uid, doc);

    if (!current || !soloMarksIntact(sectionSettingsFields(current))) {
      apply();
    }
  });
  soloObserver.observe(target, { childList: true, subtree: true });

  return true;
}

// A section's settings are a tabby field (the Farver / Spacing / Custom css tabs),
// sometimes alongside a breakpoint switcher for the per-device values. Targeting
// the fieldtypes, not field ids: in Statamic 6 the `field_…` ids are on the inputs
// themselves, not on any wrapper, so there is nothing to match a handle against.
const SETTINGS_FIELDTYPES = '.tabby-fieldtype, [class*="breakpoint-fieldtype"]';

/**
 * The section's own settings fields.
 *
 * Everything nested in a section brings settings of its own — every button row,
 * every column — and they render the same fieldtypes. The section's are the least
 * deeply nested: they sit in the set's own field list, the rest one or more field
 * lists further in.
 */
function sectionSettingsFields(setEl) {
  const depth = (el) => {
    let levels = 0;

    for (let node = el.parentElement; node && node !== setEl; node = node.parentElement) {
      if (node.classList?.contains('publish-fields')) {
        levels++;
      }
    }

    return levels;
  };

  const fields = [...setEl.querySelectorAll(SETTINGS_FIELDTYPES)];

  if (!fields.length) {
    return [];
  }

  const shallowest = Math.min(...fields.map(depth));

  return fields.filter((el) => depth(el) === shallowest);
}

/**
 * Isolates one section in the editor panel. Returns false when the set can't be
 * located at all (caller falls back to normal focus). Marks are re-applied on
 * every field re-render via a MutationObserver.
 */
/**
 * Make the sections tab the one on screen.
 *
 * Sections live in the first publish tab. If another tab (SEO, Sidebar) is
 * selected when you open a section, its fields sit in a tab panel the CP has
 * hidden — so isolating them shows nothing. Switching back first is what keeps the
 * section from opening into a blank panel.
 */
function activateSectionsTab(win) {
  const first = nativeTabButtons(win.document)[0];

  if (first && first.getAttribute('aria-selected') !== 'true') {
    fireTabClick(win, 0);
  }
}

// --- Focus panel ---------------------------------------------------------------
// The panel as one thing at a time. A soloed section already shows only itself,
// but it shows itself as it sits in the list: inside its card, under its header
// bar, with every block nested in it unfolded below. What is left here is what was
// clicked — named at the top with its own icon and instructions, its fields under
// it, and the blocks it contains reached by clicking them on the page instead of
// by opening a list.
//
// Nothing new is isolated: the marking is the solo marking, and the tabs are the
// section's own segmented control, already built from its `tab` markers. This adds
// a header of its own above the fields, four attributes, and the stylesheet that
// reads them.

const FOCUS_HEADER_ID = '__sve-focus-header';
const FOCUS_ROOT_ATTR = 'data-sve-focus'; // on <html>: which kind is on show
const FOCUS_SET_ATTR = 'data-sve-focus-set'; // the set the panel is showing
const FOCUS_HIDE_ATTR = 'data-sve-focus-hide'; // a row this view leaves out
const FOCUS_FLAT_ATTR = 'data-sve-focus-flat'; // a wrapper stripped of what it draws
const FOCUS_FLUSH_ATTR = 'data-sve-focus-flush'; // the field list, out to the panel's own gutter
const FOCUS_STEP_ATTR = 'data-sve-focus-step'; // the arrow into a block's own view

// Segment to open once the control exists — the gear on a section means
// "settings", which is not the segment a section opens on.
let focusSegment = null;
let focusRepaintPending = false;

/** Labels a settings segment goes by, in the languages the editor is used in. */
const FOCUS_SETTINGS_SEGMENT = /style|design|settings|advance|avanc|indstil|udseende/i;

/** Is the simplified panel switched on for this site? */
function focusPanelOn(win) {
  return featureOn(win, 'focus_panel');
}

/** What a set calls itself: display name, icon and instructions. */
function setMeta(win, handle) {
  const map = win.Statamic?.$config?.get?.('sveSetMeta');

  return (handle && map?.[handle]) || null;
}

/** The set handle ("hero/style_2") of the row a uid points at. */
function setTypeForUid(uid, doc) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, uid);

    if (path === null) {
      continue;
    }

    const row = dataGet(values, path);

    if (row && typeof row === 'object' && typeof row.type === 'string') {
      return row.type;
    }
  }

  return null;
}

/**
 * The row one level up from a nested one — a block's section.
 *
 * A row's path names the field it sits in and its index in it
 * ("page_sections.0.blocks.1"), so its parent row is two segments shorter. A path
 * with nothing left after that is a top-level section, which has no row above it.
 */
function parentRowUid(uid, doc) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, uid);

    if (!path) {
      continue;
    }

    const parts = path.split('.');

    if (parts.length < 4) {
      return null;
    }

    const row = dataGet(values, parts.slice(0, -2).join('.'));

    if (row && typeof row === 'object') {
      return row._visual_id || row._id || row.id || null;
    }
  }

  return null;
}

/** 'section' for a top-level set, 'block' for one nested inside another. */
function focusKindOf(setEl) {
  return collectAncestorSets(setEl).length ? 'block' : 'section';
}

/** The sets nested directly in this one — a section's blocks, a block's rows. */
function childSets(setEl) {
  return [...setEl.querySelectorAll(SELECTORS.anySet)].filter(
    (el) => el.parentElement?.closest(SELECTORS.anySet) === setEl
  );
}

/**
 * Folds the blocks a set holds, on the way into it.
 *
 * A view of a section opens on its list of blocks, and a list is only a list while
 * every row of it is the same size: one block left standing open — the one added
 * last, or the one just stepped out of — is a wall of fields where the row above
 * it is a name, and the block under it has been pushed off the screen. So the way
 * in folds them, every time, and what the editor opens from there stays open for
 * as long as that view lasts.
 *
 * Reports whether it had a list to fold: called before the panel has drawn one it
 * says so, and the pass after the fields have settled tries again.
 */
function foldChildSets(doc, uid) {
  const setEl = findSetByUid(uid, doc);

  if (!setEl) {
    return false;
  }

  const kids = childSets(setEl);

  if (!kids.length) {
    return false;
  }

  kids.forEach((kid) => {
    try {
      collapseSet(kid);
    } catch {
      // One set that won't fold must not leave the rest of the view unpainted.
    }
  });

  return true;
}

/**
 * The arrow that opens a set on its own.
 *
 * Sits in the set's own header, beside the chevron that unfolds it in place — the
 * two are the same choice put twice: work on it here, in the run of the list, or
 * step into it and have the panel to yourself. Guarded on its own presence, so a
 * re-render puts it back rather than twice.
 */
function addStepInto(win, doc, setEl) {
  const header = [...setEl.children].find((el) => el.tagName === 'HEADER');

  if (!header || header.querySelector(`[${FOCUS_STEP_ATTR}]`)) {
    return;
  }

  const uid = getUidFromSet(setEl);

  if (!uid) {
    return;
  }

  const btn = doc.createElement('button');

  btn.type = 'button';
  btn.setAttribute(FOCUS_STEP_ATTR, '');
  btn.title = t(win, 'focus_step_in');
  btn.innerHTML =
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
  btn.addEventListener('click', (event) => {
    // The header is the collapse toggle; this button is not.
    event.preventDefault();
    event.stopPropagation();
    // No kind given: a top-level set is a section, a nested one is a block, and
    // the set itself is what says which.
    soloSection(uid, doc, win);
  });

  header.appendChild(btn);
}

/**
 * The arrow on every set in the editor panel — the sections in the whole-page
 * list as much as the blocks inside one.
 *
 * Every set, because the list of sections is a list like any other: the way into
 * Hero style 1 from the page's own list should be the way into the Headline inside
 * it, and one arrow that always means the same thing is easier to learn than two
 * that nearly do.
 *
 * Confined to the panel beside the preview. The ordinary publish form is not a
 * place you can step into anything from — there is nothing to step into it *for*
 * — and it stays exactly as Statamic renders it.
 */
function markStepIntoAll(win) {
  const doc = win.document;
  const editor = soloRoot(doc);

  if (!editor || !focusPanelOn(win)) {
    return;
  }

  editor.querySelectorAll(SELECTORS.anySet).forEach((setEl) => {
    try {
      addStepInto(win, doc, setEl);
    } catch {
      // One malformed set must not stop the rest of the panel from working.
    }
  });
}

/** A readable name for a set nobody described: "hero/style_2" → "Style 2". */
function humanizeHandle(handle) {
  const name = String(handle || '').split('/').pop().replace(/[-_]+/g, ' ').trim();

  return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
}

/** Removes the header and every focus mark. The solo marking is cleared with it. */
function clearFocus(doc) {
  focusSegment = null;

  doc.documentElement.removeAttribute(FOCUS_ROOT_ATTR);
  doc.getElementById(FOCUS_HEADER_ID)?.remove();

  // The step-in arrows stay: they belong to the panel, not to this view, and the
  // whole-page list is exactly where the next one is stepped into from.
  [FOCUS_SET_ATTR, FOCUS_HIDE_ATTR, FOCUS_FLAT_ATTR, FOCUS_FLUSH_ATTR].forEach((attr) => {
    doc.querySelectorAll(`[${attr}]`).forEach((el) => el.removeAttribute(attr));
  });
}

/**
 * Strips every wrapper between the panel and the fields of everything it draws.
 *
 * A block's fields are a dozen elements deep — the portal, the entry's tab pane,
 * the page builder's field, the list its sections are rows of, the section's card
 * and field grid, the block list, the block's card — and each of those draws
 * itself: a border, a rounding, a background, an indent, a divider. Named one by
 * one they come back the moment a fieldset nests differently, so they are found by
 * walking rather than guessed at.
 *
 * The walk goes up from the fields, never down from the panel: only that direction
 * knows which of Statamic's nested divs are on the way to *these* fields, and it
 * stops at the panel's own scrolling column, whose padding is the panel's. Bounded
 * by containment as well as by identity — a field list that isn't in the panel at
 * all (a popped-out preview, a form that hasn't been portalled in yet) marks
 * nothing, rather than walking out of the editor and stripping the page.
 *
 * What is stripped is decoration only. The boxes stay in the layout, laid out
 * exactly as Statamic lays them out — nothing here can make a field disappear.
 *
 * The list at the end of the walk is marked too, but only to give up its side
 * padding. A set's field list is rendered with `p-4` — an inset that reads as
 * "inside this card" in a list of cards, and as a step out of line the moment the
 * card is gone: the header naming what is on show sits at the panel's gutter, and
 * the fields under it sat a further 1rem in. Its top and bottom stay, so the
 * fields still breathe under the header.
 */
function flattenWrappers(doc, setEl) {
  // The column, not the pane: its padding is the panel's own gutter, and the
  // walk that strips every wrapper on the way to the fields must not strip that
  // too. In Live Preview the two are the same element; in the sve-panel frame
  // `soloRoot` reaches up to <main> — past the column — and flattening it left
  // the panel reading edge to edge.
  const stop = focusHeaderHost(doc);
  const wanted = new Set();
  const flush = new Set();

  if (stop) {
    sectionFieldLists(setEl).forEach((list) => {
      if (!stop.contains(list)) {
        return;
      }

      flush.add(list);

      for (let node = list.parentElement; node && node !== stop; node = node.parentElement) {
        wanted.add(node);
      }
    });
  }

  doc.querySelectorAll(`[${FOCUS_FLAT_ATTR}]`).forEach((el) => {
    if (!wanted.has(el)) {
      el.removeAttribute(FOCUS_FLAT_ATTR);
    }
  });

  doc.querySelectorAll(`[${FOCUS_FLUSH_ATTR}]`).forEach((el) => {
    if (!flush.has(el)) {
      el.removeAttribute(FOCUS_FLUSH_ATTR);
    }
  });

  wanted.forEach((el) => el.setAttribute(FOCUS_FLAT_ATTR, ''));
  flush.forEach((el) => el.setAttribute(FOCUS_FLUSH_ATTR, ''));
}

/**
 * The header element, at the top of the panel's scrolling column.
 *
 * `.live-preview-fields` and not `.live-preview-editor`: the editor pane is a flex
 * row holding the field column and the drag handle that resizes it, so a child
 * added there lands beside the fields rather than above them. It also wears the
 * solo keep-mark, or the stylesheet that hides everything off the soloed path
 * would hide the header describing it.
 */
/** Does this element lay its children out one under the other? */
function stacksChildren(style) {
  if (style.display === 'block' || style.display === 'flow-root') {
    return true;
  }

  return (
    (style.display === 'flex' || style.display === 'inline-flex') &&
    style.flexDirection.startsWith('column')
  );
}

/**
 * Where the focus header goes: the column the fields scroll in.
 *
 * In Live Preview that is `soloRoot` itself, and the header is simply its first
 * child. The sve-panel frame is a whole CP screen, where `soloRoot` reaches all
 * the way up to `<main>` because it has to — that is the isolation boundary, the
 * level at which the nav beside the form gets hidden. But `<main>` is a flex ROW
 * holding exactly that nav beside the form, so a header inserted as its first
 * child does not sit above the fields: it becomes a column standing next to
 * them, full height, with the fields squeezed into what is left.
 *
 * The two jobs are not the same one. Isolation reaches as high as the things it
 * must hide; the header belongs as deep as the column it names. So the frame is
 * asked for its scrolling column — the outermost thing above the form that
 * scrolls and stacks what it holds, found by what it does rather than by the
 * class it happens to wear.
 */
function focusHeaderHost(doc) {
  const editor = soloRoot(doc);

  if (!editor || !panelFrameDoc(doc)) {
    return editor;
  }

  const start = doc.querySelector(SELECTORS.replicatorSet) || doc.querySelector('.publish-fields');
  const win = doc.defaultView;

  if (!start || !win) {
    return editor;
  }

  let column = null;

  for (let node = start.parentElement; node && node !== editor; node = node.parentElement) {
    const style = win.getComputedStyle(node);

    if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && stacksChildren(style)) {
      column = node;
    }
  }

  if (!column) {
    return editor;
  }

  // The gutter the panel is read in. Everything the focus view draws is stripped
  // flat and flush — that is right in Live Preview, whose own column holds the
  // margin the fields stand in, and wrong here, where the frame is a CP screen
  // laid out for the full width of a window. Marked rather than styled by class
  // so the rule follows whichever element turned out to be the column.
  column.setAttribute(PANEL_COLUMN_ATTR, '');

  return column;
}

function ensureFocusHeader(doc) {
  const host = focusHeaderHost(doc);

  if (!host) {
    return null;
  }

  let header = doc.getElementById(FOCUS_HEADER_ID);

  if (!header) {
    header = doc.createElement('div');
    header.id = FOCUS_HEADER_ID;
    header.setAttribute('data-sve-focus-header', '');
  }

  header.setAttribute(SOLO_KEEP_ATTR, '');

  if (header.parentElement !== host || host.firstChild !== header) {
    host.insertBefore(header, host.firstChild);
  }

  return header;
}

/**
 * Draws the name of the thing on show: its icon, its display name, the way back
 * out, and whatever its instructions say.
 *
 * The way back sits here rather than in the Live Preview header, where it began.
 * It says where it goes — "Hero style 1", "All sections" — and a label naming what
 * the panel is showing belongs beside what the panel is showing, not in the row of
 * icons above it.
 *
 * Rebuilt only when one of the four changes, so the observer driving the repaint
 * can fire as often as it likes.
 */
function paintFocusHeader(win, doc, meta, back) {
  const header = ensureFocusHeader(doc);

  if (!header) {
    return;
  }

  const label =
    back?.label ||
    (panelFrameDoc(doc) && win.location.pathname.includes('/collections/')
      ? t(win, 'close')
      : t(win, 'all_sections'));
  const key = `${meta.icon || ''}|${meta.display}|${meta.instructions || ''}|${label}`;

  if (header.getAttribute('data-sve-focus-key') === key) {
    return;
  }

  header.setAttribute('data-sve-focus-key', key);
  header.textContent = '';

  const line = doc.createElement('div');

  line.setAttribute('data-sve-focus-id', '');

  const tile = doc.createElement('span');

  tile.setAttribute('data-sve-focus-tile', '');

  const icon = panelIcon(doc, meta.icon);

  if (icon) {
    tile.appendChild(icon);
  } else {
    // No icon named: the initial of the name, which at least tells one block from
    // the next at a glance.
    tile.textContent = (meta.display || '?').trim().charAt(0).toUpperCase();
  }

  const title = doc.createElement('h2');

  title.setAttribute('data-sve-focus-title', '');
  title.textContent = meta.display;

  const out = doc.createElement('button');

  out.type = 'button';
  out.setAttribute('data-sve-focus-back', '');
  out.innerHTML =
    '<span aria-hidden="true" data-sve-focus-back-arrow>&#8249;</span><span>' + label + '</span>';
  out.addEventListener('click', () => {
    if (back?.onBack) {
      back.onBack();

      return;
    }

    leaveSolo(doc, win);
  });

  line.append(tile, title, out);
  header.appendChild(line);

  if (!meta.instructions) {
    return;
  }

  const description = doc.createElement('p');

  description.setAttribute('data-sve-focus-desc', '');
  description.textContent = meta.instructions;
  header.appendChild(description);
}

/**
 * Opens the segment the gear asked for, once the control it lives in has been
 * built. Named rather than counted where the fieldset says so — "Style", "Design",
 * "Indstillinger" — and otherwise the second segment, which is where a section
 * that separates content from design puts the design.
 */
function applyFocusSegment(setEl) {
  if (!focusSegment) {
    return;
  }

  // The control lives in the set's own field list, which is where its segments
  // are to be found — the set element itself only holds it.
  const list = sectionFieldLists(setEl).find(
    (el) => ownDescendants(el, `[${SECTION_SEG_ATTR}]`).length
  );

  if (!list) {
    return; // the control isn't built yet — the next repaint tries again
  }

  const buttons = ownDescendants(list, `[${SECTION_SEG_ATTR}]`);

  const wanted =
    buttons.find((btn) => FOCUS_SETTINGS_SEGMENT.test(btn.textContent || '')) || buttons[1];

  focusSegment = null;

  if (wanted) {
    setSectionGroup(list, wanted.getAttribute(SECTION_SEG_ATTR));
  }
}

/** Has this segment anything left to show once the view has hidden its rows? */
function segmentHasContent(list, key) {
  return ownDescendants(list, `[${SECTION_GROUP_ATTR}="${key}"]`).some(
    (row) => !row.hasAttribute(FOCUS_HIDE_ATTR)
  );
}

/**
 * Drops the segments this view empties.
 *
 * A section whose content tab holds nothing but its block list has nothing to put
 * under that tab once the list is gone — and a tab that opens on nothing is worse
 * than no tab. The button goes, and if it was the one on show the first segment
 * with something in it takes over.
 */
function hideEmptySegments(setEl) {
  sectionFieldLists(setEl).forEach((list) => {
    const buttons = ownDescendants(list, `[${SECTION_SEG_ATTR}]`);

    if (buttons.length < 2) {
      return;
    }

    let fallback = null;

    buttons.forEach((btn) => {
      const key = btn.getAttribute(SECTION_SEG_ATTR);
      const filled = segmentHasContent(list, key);

      btn.toggleAttribute(FOCUS_HIDE_ATTR, !filled);

      if (filled && !fallback) {
        fallback = key;
      }
    });

    const active = list.getAttribute(SECTION_ACTIVE_ATTR);

    if (fallback && active && !segmentHasContent(list, active)) {
      setSectionGroup(list, fallback);
    }
  });
}

/**
 * Paints the focus view over an already-soloed set. Idempotent: every mark is set
 * to what it should be rather than toggled, so a repaint costs nothing and a
 * re-render is caught by the next one.
 */
function paintFocus(win, doc, uid, kind) {
  const setEl = findSetByUid(uid, doc);

  if (!setEl) {
    return false;
  }

  doc.documentElement.setAttribute(FOCUS_ROOT_ATTR, kind);

  doc.querySelectorAll(`[${FOCUS_SET_ATTR}]`).forEach((el) => {
    if (el !== setEl) {
      el.removeAttribute(FOCUS_SET_ATTR);
    }
  });

  setEl.setAttribute(FOCUS_SET_ATTR, kind);

  // Marks left by the view before this one. A step into a block would otherwise
  // inherit the section's hidden block list — the very row the block is inside —
  // and open on nothing at all.
  doc.querySelectorAll(`[${FOCUS_HIDE_ATTR}]`).forEach((el) => {
    if (!setEl.contains(el)) {
      el.removeAttribute(FOCUS_HIDE_ATTR);
    }
  });


  // Everything the set holds is shown, blocks included: a section is its fields
  // *and* what is built inside it, and a list of blocks that can be unfolded where
  // they stand is how you work down a section without losing your place in it.
  // Each one keeps an arrow out to a view of its own, for when one thing at a time
  // is what's wanted.
  markStepIntoAll(win);

  const handle = setTypeForUid(uid, doc);
  const meta = setMeta(win, handle);

  paintFocusHeader(
    win,
    doc,
    {
      display: meta?.display || humanizeHandle(handle),
      icon: meta?.icon || null,
      instructions: meta?.instructions || '',
    },
    focusBack(win, doc, uid, kind)
  );

  applyFocusSegment(setEl);
  hideEmptySegments(setEl);
  flattenWrappers(doc, setEl);

  return true;
}

/** Repaints at most once a frame, however many mutations arrive in it. */
function scheduleFocusRepaint(win, doc, uid, kind) {
  if (focusRepaintPending) {
    return;
  }

  focusRepaintPending = true;

  win.requestAnimationFrame(() => {
    focusRepaintPending = false;

    if (soloUid === uid) {
      paintFocus(win, doc, uid, kind);
    }
  });
}

/**
 * Where the back pill goes from here. A block steps back into the section holding
 * it, named after that section; anything else leaves the solo view altogether,
 * which is what the pill does with no action of its own.
 */
function focusBack(win, doc, uid, kind) {
  if (kind !== 'block') {
    return null;
  }

  const parent = parentRowUid(uid, doc);

  if (!parent || !findSetByUid(parent, doc)) {
    return null;
  }

  const handle = setTypeForUid(parent, doc);
  const label = setMeta(win, handle)?.display || humanizeHandle(handle);

  // A step back the pill can't name is a step back nobody can predict. Left
  // unnamed, it says "all sections" and does exactly that instead.
  if (!label) {
    return null;
  }

  return {
    label,
    onBack: () => soloSection(parent, doc, win),
  };
}

/**
 * Opens what was clicked in the preview.
 *
 * With the focus panel on that is the thing itself, however deep it sits — a block
 * opens as a block. Clicking a heading on the page means "let me at this", and the
 * panel answers with it and nothing else; the section around it is one back-arrow
 * away, and every block in that section is one arrow deeper.
 *
 * With the panel off the behaviour is what it always was: a field click opens the
 * section around it, a set click opens the set.
 */
function focusFromPreview(uid, doc, win, { clampToSection = false } = {}) {
  if (focusPanelOn(win)) {
    return soloSection(uid, doc, win);
  }

  return soloSection(clampToSection ? topLevelSectionUid(uid, doc) || uid : uid, doc, win);
}

/**
 * The set a field renders in — the block that owns it, not the section around it.
 *
 * Two ways of asking, because neither works on its own. The rendered panel knows
 * exactly where a field is, but only while it is rendered: blocks are collapsed
 * until opened, and a collapsed set has no fields in the DOM at all. The form's
 * values always have them, but hold no elements. So: the DOM first, where it can
 * answer, and the values behind it.
 *
 * The DOM answer is checked against the scope it was asked for. `findFieldElement`
 * falls back to an unscoped lookup by handle, which in a form holding four blocks
 * that each have a `headline` returns whichever renders first — the right answer
 * to a different question.
 */
function fieldOwnerUid(field, scope, doc) {
  const scoped = scope ? findSetByUid(scope, doc) : null;
  const el = findFieldElement(field, doc, scope);
  const setEl = el && (!scoped || scoped.contains(el)) ? el.closest(SELECTORS.anySet) : null;

  return setEl ? getUidFromSet(setEl) : fieldOwnerUidFromValues(field, scope, doc);
}

/** The same question asked of the form's values, for a block that isn't rendered. */
function fieldOwnerUidFromValues(field, scope, doc) {
  const handle = String(field || '').split('.').pop();

  if (!handle || !scope) {
    return null;
  }

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, scope);

    if (path === null) {
      continue;
    }

    const row = dataGet(values, path);
    const found = rowOwningField(row, handle);

    if (found) {
      return found;
    }
  }

  return null;
}

/**
 * Deepest dotted path to `handle` under `node` (children before self), so a
 * section that wraps a headline block resolves to the block field — not a
 * missing `section.headline`.
 */
function deepestFieldPath(node, handle, path = '') {
  if (node == null || typeof handle !== 'string' || !handle) {
    return null;
  }

  const field = handle.includes('.') ? handle.split('.').pop() : handle;

  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const found = deepestFieldPath(node[i], field, path ? `${path}.${i}` : String(i));

      if (found) {
        return found;
      }
    }

    return null;
  }

  if (typeof node !== 'object') {
    return null;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key === field) {
      continue;
    }

    const found = deepestFieldPath(value, field, path ? `${path}.${key}` : key);

    if (found) {
      return found;
    }
  }

  if (Object.prototype.hasOwnProperty.call(node, field)) {
    return path ? `${path}.${field}` : field;
  }

  return null;
}

/**
 * The deepest row in a value tree carrying this field handle, by its id.
 *
 * Deepest, not first: a section holding a `headline` block has the handle twice
 * over — once on the block that owns it, once on the section that contains the
 * block — and the block is the answer. Children are searched before the node
 * itself, so the innermost owner wins.
 */
function rowOwningField(node, handle, depth = 0) {
  if (depth > 12 || !node || typeof node !== 'object') {
    return null;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      const found = rowOwningField(item, handle, depth + 1);

      if (found) {
        return found;
      }
    }

    return null;
  }

  for (const value of Object.values(node)) {
    const found = rowOwningField(value, handle, depth + 1);

    if (found) {
      return found;
    }
  }

  const id = node._visual_id || node._id || node.id;

  return Object.prototype.hasOwnProperty.call(node, handle) && id ? id : null;
}

/**
 * Opens the set the clicked field actually belongs to.
 *
 * A block that passes no `scope` of its own reports the section's uid — the
 * section's `_visual_id` cascades down through the whole set in Antlers — so the
 * scope alone cannot tell a section's own field from one belonging to a block
 * inside it. The field can: it is stored on the block's row, and rendered inside
 * the block's set.
 *
 * When neither way finds it, the scope itself is opened — for a template that
 * passes `scope="{{ id }}"` that *is* the block — and the lookup is tried once
 * more after the panel has settled, in case the block was still being drawn.
 *
 * The synced-section panel took the same path as the page until it was made to
 * stop at the section: stepping into a block there came up as an empty
 * "Richtext"/"Headline" header. That was never the step-in — it was the panel's
 * whole field column being hidden, and the pass that draws the segments being
 * dropped. With both fixed a block in a synced section opens exactly as a block
 * on a page does, which is the only behaviour worth having.
 */
function focusFieldOwner(field, scope, doc, win) {
  const direct = fieldOwnerUid(field, scope, doc);

  if (direct) {
    return soloSection(direct, doc, win);
  }

  const opened = soloSection(scope, doc, win);

  setTimeout(() => {
    const owner = fieldOwnerUid(field, scope, doc);

    if (owner && owner !== soloUid) {
      soloSection(owner, doc, win);
    }
  }, COLLAPSE_SETTLE_MS + 60);

  return opened;
}

export function soloSection(uid, doc, win, { kind = null, segment = null } = {}) {
  const setEl = uid && findSetByUid(uid, doc);

  if (!setEl) {
    return false;
  }

  // Page section owns the left edge — hide Theme Settings / Designs so they
  // don't stack beside (or pad) the solo editor.
  //
  // Unless the set is one of the chrome form's own: a widget in the header is
  // reached by clicking it on the page, exactly like a block in a section, and
  // stepping into it is not leaving the header — it IS editing the header.
  if (win && !chromeHost(doc)?.contains(setEl)) {
    dismissChromeForPageEdit(win);
  }

  // A different set is a new visit, and a new visit folds what it holds. Asked for
  // the set already on show — a repaint, a second click on the same thing — it is
  // the same visit, and the blocks the editor opened in it stay open.
  if (soloUid !== uid) {
    foldedFor = null;
  }

  soloUid = uid;
  focusSegment = segment;

  // Read once, from the set as it stands now: a re-render replaces the element
  // but never moves the row to another depth.
  const focusKind = kind || focusKindOf(setEl);

  let isolated = false;

  const apply = (settled = false) => {
    const editor = soloRoot(doc);

    if (!editor) {
      return false;
    }

    activateSectionsTab(win); // guarded — only clicks when it isn't already showing

    ensureSoloStyle(doc);

    if (!markSoloPath(uid, editor, doc)) {
      return false;
    }

    // A block sits in one of its section's segments — the content one, normally.
    // Leave the section on Style, step into a block, and the very row the block is
    // in is still marked `sve-off`: display:none, and !important, so the solo
    // marking cannot bring it back. The view opens on its own header and nothing
    // under it. Stepping into something is a click like the one in the preview, so
    // it answers the same way — the panel follows what was opened, up through every
    // set holding it.
    revealSegmentsFor(findSetByUid(uid, doc) || setEl, doc);

    isolated = true;

    if (!focusPanelOn(win)) {
      addSoloBackButton(doc, win);

      return true;
    }

    // Once per visit. `settled` closes the question for a set that turned out to
    // hold no blocks at all — otherwise every later pass would go looking again.
    if (foldedFor !== uid && (foldChildSets(doc, uid) || settled)) {
      foldedFor = uid;
    }

    // No pill in the Live Preview header: the focus header draws its own way out,
    // under the name of what it is showing.
    paintFocus(win, doc, uid, focusKind);

    // Synced-section panel: Vue/accordion often leave the focused set collapsed
    // for a beat after solo — header paints, fields never mount → empty sidebar.
    // Keep expanding + remaking the path until the set actually has field DOM.
    if (panelFrameDoc(doc)) {
      ensurePanelSoloVisible(win, doc, uid);
    }

    return true;
  };

  apply();
  setTimeout(() => apply(true), 180); // once the tab switch above has re-rendered the fields

  // Re-apply whenever Vue rebuilds the field tree (expanding a set, live-preview
  // refresh, dragging the panel wider, …).
  if (soloObserver) {
    soloObserver.disconnect();
  }

  // Live Preview uses .live-preview-fields; the synced-section sve-panel iframe
  // observes body so Vue replacing wrappers still triggers a remake.
  const isPanel = panelFrameDoc(doc);
  const target = isPanel
    ? doc.body
    : doc.querySelector('.live-preview-fields') ||
      doc.querySelector('.live-preview-editor') ||
      soloRoot(doc);

  let panelRemakeQueued = false;

  if (target) {
    soloObserver = new MutationObserver(() => {
      if (soloUid !== uid) {
        return;
      }

      // Panel: remake away-marks (debounced). Always-remake without debounce
      // loops on focus-header insertBefore / field mounts.
      if (isPanel) {
        if (panelRemakeQueued) {
          return;
        }

        panelRemakeQueued = true;
        win.requestAnimationFrame(() => {
          panelRemakeQueued = false;

          if (soloUid !== uid) {
            return;
          }

          const editor = soloRoot(doc);
          const setEl = findSetByUid(uid, doc);

          if (!setEl || !editor) {
            apply();

            return;
          }

          if (isSetCollapsed(setEl)) {
            expandSet(setEl);
          }

          markPanelIsolate(uid, editor, doc);

          if (focusPanelOn(win)) {
            scheduleFocusRepaint(win, doc, uid, focusKind);
          }
        });

        return;
      }

      const editor = soloRoot(doc);

      if (!soloPathIntact(uid, editor, doc)) {
        apply();

        return;
      }

      if (focusPanelOn(win)) {
        scheduleFocusRepaint(win, doc, uid, focusKind);
      }
    });
    soloObserver.observe(target, { childList: true, subtree: true });
  }

  // Only report success when isolation actually marked a path. Returning true
  // after a failed markSoloPath made bootSavedSectionSolo stop retrying while
  // the sidebar still showed entry meta (Published + title).
  return isolated;
}

// Tracks whether Live Preview was open, so teardown (and stash clear) runs once
// when leaving — not on every MutationObserver tick outside LP.
let lpWasOpen = false;

// Den gemte bredde sættes én gang pr. besøg i Live Preview, ikke på hvert tjek.
// Håndtaget skriver i den samme inline-style mens der trækkes, og en regel der
// blev hævdet hvert øjeblik ville trække tilbage under fingeren.
let lpWidthApplied = false;

/**
 * Injects the panel toggle when the Live Preview screen is (re)mounted, and
 * enforces the desired collapse state. Called from initCp's MutationObserver:
 * the editor pane mounts AFTER the header, so the state must be re-asserted on
 * subsequent mutations rather than applied once at injection time.
 */
/** rem → px, målt på dokumentets egen rodstørrelse frem for et gættet 16. */
function remToPx(win, rem) {
  const root = parseFloat(win.getComputedStyle(win.document.documentElement).fontSize) || 16;

  return Math.round(rem * root);
}

/** Bredden panelet står i, som den er gemt. Intet gemt: standarden. */
function lpStoredWidth(win) {
  let stored = null;

  try {
    stored = parseInt(win.localStorage.getItem(LP_WIDTH_KEY) ?? '', 10);
  } catch {
    /* localStorage kan være lukket i et privat vindue */
  }

  return Number.isFinite(stored) && stored > 0 ? stored : remToPx(win, LP_WIDTH_DEFAULT);
}

function setLpWidth(win, rem) {
  const px = remToPx(win, rem);

  try {
    win.localStorage.setItem(LP_WIDTH_KEY, String(px));
  } catch {
    /* som ovenfor — valget gælder så kun denne gang */
  }

  const editor = win.document.querySelector('.live-preview-editor');

  if (editor) {
    editor.style.width = `${px}px`;
  }

  ensureLpWidthPicker(win);
}

/** Linjen sidder over panelet, så den følger med når vinduet ændrer sig. */
function placeLpWidthPicker(win) {
  const doc = win.document;
  const bar = doc.getElementById(LP_WIDTH_ID);
  const editor = doc.querySelector('.live-preview-editor');

  if (!bar || !editor) {
    return;
  }

  const rect = editor.getBoundingClientRect();

  bar.style.left = `${Math.round(rect.left + 12)}px`;
  // Panelets bredde er den grænse grupperne ombryder ved. Et smalt panel eller en
  // blueprint med mange faner skal lægge dem ned under hinanden, ikke ud over
  // kanten hvor de ikke kan nås.
  bar.style.maxWidth = `${Math.max(0, Math.round(rect.width - 24))}px`;
  // Målt efter ombrydningen frem for regnet ud på forhånd: linjen kan være én
  // eller flere rækker høj, og den skal ligge lige over panelets underkant uanset
  // hvad. `offsetHeight` læses derfor efter at bredden er sat.
  bar.style.top = `${Math.round(rect.bottom - 12 - bar.offsetHeight)}px`;
}

/**
 * Tre bredder at vælge panelet i, nederst i det.
 *
 * Den ligger på `document.body` og ikke i panelet. To grunde: panelets kolonne
 * ruller, og en linje man skal rulle ned til for at finde er ikke en linje man
 * bruger — og solo-visningen skjuler alt i kolonnen der ikke er markeret, så en
 * knap derinde ville forsvinde i samme øjeblik man klikkede sig ind i en sektion.
 */
function ensureLpWidthPicker(win) {
  const doc = win.document;
  const editor = doc.querySelector('.live-preview-editor');
  let bar = doc.getElementById(LP_WIDTH_ID);

  // Væk når panelet er væk. Et sæt knapper svævende over preview'et ville ikke
  // høre til noget.
  if (!editor || lpCollapsed) {
    bar?.remove();

    return;
  }

  if (!bar) {
    bar = doc.createElement('div');
    bar.id = LP_WIDTH_ID;
    // Selve linjen har hverken flade eller hjørner — den holder bare grupperne.
    // `wrap` er det der gør at et smalt panel lægger dem under hinanden i stedet
    // for at skubbe dem ud over kanten.
    bar.style.cssText =
      'position:fixed;z-index:60;display:flex;flex-wrap:wrap;align-items:center;gap:6px;' +
      'color:currentColor;font-family:inherit;';

    const widths = doc.createElement('div');

    widths.id = LP_WIDTH_GROUP_ID;
    widths.style.cssText = FLOATING_GROUP_STYLE;

    LP_WIDTHS.forEach(({ rem, label }) => {
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.dataset.rem = String(rem);
      btn.textContent = label;
      btn.title = `${rem}rem`;
      btn.style.cssText = `${FRAMED_CONTROL_STYLE}padding:0 10px;`;
      btn.addEventListener('click', () => setLpWidth(win, rem));
      widths.appendChild(btn);
    });

    bar.appendChild(widths);
    doc.body.appendChild(bar);
    win.addEventListener('resize', () => placeLpWidthPicker(win));
  }

  // Publish-fanerne bor her og ikke i topbaren: de hører til panelet, og det er
  // her panelet ender. Linjen ligger på document.body, så solo-visningen — der
  // skjuler alt i panelkolonnen på nær den klikkede sektion — ikke kan tage dem.
  // Deres egen boks, ikke en afdeling i breddernes: bredde og faner har intet med
  // hinanden at gøre, og en fælles flade med en streg i ville påstå det modsatte.
  ensureSettingsTabs(win);

  // Efter fanerne, så en eventuel ombrydning er med i højden linjen placeres på.
  placeLpWidthPicker(win);

  // Den valgte er den hvis bredde panelet rent faktisk står i. Er der trukket i
  // håndtaget til noget derimellem, er ingen af dem valgt — og det er rigtigt:
  // så er bredden ikke en af de tre.
  const current = lpStoredWidth(win);

  doc.getElementById(LP_WIDTH_GROUP_ID)?.querySelectorAll('button').forEach((btn) => {
    paintLpActiveControl(btn, remToPx(win, Number(btn.dataset.rem)) === current);
  });
}

let lpPanelToggleBusy = false;

export function ensureLpPanelToggle(win) {
  // Re-entry guard: our own DOM writes (toolbar, chrome, width bar) fire the
  // body MutationObserver that calls us. Without this the stack re-enters on
  // every tick and Live Preview freezes — including the open-preview button.
  if (lpPanelToggleBusy) {
    return;
  }

  lpPanelToggleBusy = true;

  try {
    ensureLpPanelToggleInner(win);
  } catch (err) {
    console.error('[sve] ensureLpPanelToggle', err);
  } finally {
    lpPanelToggleBusy = false;
  }
}

function ensureLpPanelToggleInner(win) {
  const doc = win.document;
  const header = lpHeader(doc);

  if (!header) {
    if (lpWasOpen) {
      lpWasOpen = false;
      lpWidthApplied = false;
      lpCollapsed = null;
      lpHeaderBgCache = null; // næste åbning kan være i et andet CP-tema
      doc.getElementById(LP_WIDTH_ID)?.remove();
      chromePrefetchArmed = false;
      clearSolo(doc);
      closeRightPanels(win); // parks Theme Settings iframe so it stays warm
      removeLpBackButton(doc);
      lpCloseHideObserver?.disconnect();
      lpCloseHideObserver = null;
    }

    // Outside LP: still keep Theme Settings warming in the background.
    if (!doc.getElementById(GLOBALS_PANEL_ID)) {
      scheduleChromeGlobalsPrefetch(win);
    }

    return;
  }

  // Fresh Live Preview session → always start on desktop Fit (laptop icon),
  // never whatever Mobile/Tablet was left from last time.
  if (!lpWasOpen) {
    try {
      win.localStorage.setItem(LP_DEVICE_KEY, 'Responsive');
    } catch {
      /* private mode */
    }
  }

  lpWasOpen = true;

  if (lpCollapsed === null) {
    lpCollapsed = lpMode(win) !== 'show';
  }

  // Opening a section's settings holds the panel open for as long as they're
  // shown, whatever the mode says — otherwise the observer that re-applies the
  // mode on every Vue re-render slams it shut again a moment later.
  if (forcePanelOpen) {
    lpCollapsed = false;
  }

  // Ensure Theme Settings is warming (may already be from CP boot).
  if (!chromePrefetchArmed) {
    chromePrefetchArmed = true;
    scheduleChromeGlobalsPrefetch(win);
  }

  let icon = doc.getElementById(LP_TOGGLE_ID);

  if (!icon) {
    // The panel glyph is purely an indicator — the mode buttons next to it do
    // the switching. Drawn with borders so it follows the CP theme color.
    icon = doc.createElement('span');
    icon.id = LP_TOGGLE_ID;
    icon.innerHTML =
      '<span style="display:inline-block;width:16px;height:12px;border:1.5px solid currentColor;' +
      'border-radius:3px;position:relative;"><span style="position:absolute;left:4px;top:0;bottom:0;' +
      'width:1.5px;background:currentColor;"></span></span>';
    icon.style.cssText =
      'display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;color:currentColor;';
    header.insertBefore(icon, header.firstChild);
  }

  icon.style.opacity = lpCollapsed ? '0.6' : '1';

  let group = doc.getElementById(LP_MODE_ID);

  if (!group) {
    group = doc.createElement('div');
    group.id = LP_MODE_ID;
    group.style.cssText = HEADER_GROUP_STYLE;

    LP_MODES.forEach((mode, i) => {
      const btn = doc.createElement('button');

      // Ingen streg foran den første — der er gruppens egen kant.
      if (i) {
        group.appendChild(lpModeSeparator(doc, mode));
      }

      btn.type = 'button';
      btn.dataset.mode = mode;
      btn.textContent = LP_MODE_LABELS[mode];
      btn.style.cssText = `${FRAMED_CONTROL_STYLE}padding:0 10px;`;
      btn.addEventListener('click', () => setLpMode(win, mode));
      group.appendChild(btn);
    });

    icon.after(group);
  }

  const active = lpMode(win);

  group.querySelectorAll('button').forEach((btn) => {
    const mode = btn.dataset.mode;
    const label = LP_MODE_LABELS[mode];

    // Keep labels in sync if the chrome already existed before a rename.
    if (label && btn.textContent !== label) {
      btn.textContent = label;
    }

  // Valgt = samme flade primary som Save & Publish.
    paintLpActiveControl(btn, mode === active);
  });

  // Stregen står mellem to ting der ikke rører hinanden. Den valgte tilstand har
  // sin egen pille, og en streg klods op ad en pillekant er to kanter det samme
  // sted — så den nabo-streg falder væk.
  group.querySelectorAll('[data-sep-before]').forEach((sep) => {
    const after = sep.dataset.sepBefore;
    const before = LP_MODES[LP_MODES.indexOf(after) - 1];

    sep.style.opacity = active === after || active === before ? '0' : LP_SEP_OPACITY;
  });

  ensureGlobalsPicker(win);
  ensureSectionLibraryButton(win);
  ensureCollectionPicker(win);
  enhanceGrids(win);

  // Collapse all of the above into the icon toolbar — one control at a time.
  ensureHeaderToolbar(win);
  applyHeaderTab(win);
  openFirstSectionOnce(win);
  openSettingsTab(win);
  applySectionsFieldVisibility(win);

  const editor = doc.querySelector('.live-preview-editor');

  if (editor) {
    const want = lpCollapsed ? '-10000px' : '';

    if (editor.style.left !== want) {
      editor.style.position = lpCollapsed ? 'absolute' : '';
      editor.style.left = want;
      editor.style.top = lpCollapsed ? '0' : '';
    }

    // Den bredde man sidst valgte, hentet frem én gang når panelet er der.
    // Derefter er det håndtagets og knappernes bord.
    if (!lpWidthApplied) {
      lpWidthApplied = true;
      editor.style.width = `${lpStoredWidth(win)}px`;
    }
  }

  ensureLpWidthPicker(win);
  ensureLpBackButton(win);
  positionLpBackButton(win);
  watchStatamicLpClose(win);
  ensureLpPreviewChrome(win);
}

// --- Preview chrome: devices + zoom, no Pop out --------------------------------
//
// Statamic's own header shows a "Pop out" button and a text device <Select…>.
// Editors need icons for Mobile / Tablet / Laptop / Fit, plus zoom — same bar
// we shipped around midday 5 Aug. We hide Statamic's controls and drive the
// iframe size / scale ourselves so Vue re-renders can't put Pop out back
// without us putting it away again on the next observer pass.

const LP_PREVIEW_CHROME_ID = '__sve-preview-chrome';
const LP_DEVICE_KEY = 'sve-lp-device';
const LP_ZOOM_KEY = 'sve-lp-zoom';
const LP_ZOOM_STEPS = [50, 75, 90, 100, 110, 125, 150];
const LP_ZOOM_DEFAULT = 100;

const LP_DEVICE_ICONS = {
  Mobile:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
  Tablet:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
  // Fit / Responsive uses the laptop glyph — no separate Laptop control.
  Responsive:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 18h20M8 22h8"/></svg>',
  Laptop:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 18h20M8 22h8"/></svg>',
};

function lpConfiguredDevices(win) {
  const raw = win.Statamic?.$config?.get?.('livePreview.devices');

  return raw && typeof raw === 'object' ? raw : {};
}

/**
 * Fit (laptop icon) → Tablet → Mobile. Laptop/Desktop presets are dropped:
 * Fit fills the pane, and Tablet/Mobile light up automatically when the Fit
 * width crosses their breakpoints.
 */
function lpDeviceKeys(win) {
  const configured = lpConfiguredDevices(win);
  const keys = ['Responsive'];

  if (configured.Tablet) {
    keys.push('Tablet');
  }

  if (configured.Mobile) {
    keys.push('Mobile');
  }

  return keys;
}

function lpStoredDevice(win) {
  try {
    let stored = win.localStorage.getItem(LP_DEVICE_KEY);

    // Old builds had a separate Laptop — treat it as Fit.
    if (stored === 'Laptop' || stored === 'Desktop') {
      stored = 'Responsive';

      try {
        win.localStorage.setItem(LP_DEVICE_KEY, stored);
      } catch {
        /* private mode */
      }
    }

    if (stored && (stored === 'Responsive' || lpConfiguredDevices(win)[stored])) {
      return stored;
    }
  } catch {
    /* private mode */
  }

  return 'Responsive';
}

/**
 * Which device icon should look active. In Fit mode the highlight follows the
 * preview width (tablet/mobile), so resizing the pane updates the chrome.
 */
function lpChromeActiveDevice(win) {
  const device = lpStoredDevice(win);

  if (device === 'Tablet' || device === 'Mobile') {
    return device;
  }

  const iframe = previewFrame(win.document);
  const w = iframe?.clientWidth || iframe?.offsetWidth || 0;

  // Before the iframe has a real size (or while LP is still mounting), don't
  // treat a tiny/zero width as Mobile — keep the desktop Fit icon lit.
  if (w < 200) {
    return 'Responsive';
  }

  const bp = lpWidthToBp(w);

  if (bp === 'tablet') {
    return 'Tablet';
  }

  if (bp === 'mobile') {
    return 'Mobile';
  }

  return 'Responsive';
}

// --- Per-breakpoint block order ---------------------------------------------
//
// A block field is one array, and one array is one order for every screen size.
// A section that wants its own order per size declares a `block_order` field
// beside the block field; this fills it in with the row ids in the order they
// are on screen, one entry per breakpoint.
//
// Two rules learned the hard way, both about writing into a form somebody else
// owns:
//
//  - The order lives in ONE field on the section, never in a field added to each
//    block. A field on a set has to be answered for whenever Statamic builds a
//    new one of that set, and that is the path an editor uses constantly.
//  - It is written when the device changes and at no other time. A timer writing
//    into the form re-renders the page builder underneath whatever the editor is
//    doing — and a re-render landing mid-request leaves Statamic's own promises
//    unsettled, which is a spinner that never stops.
//
// So: drag as you always have. On the way out of a breakpoint the order you left
// behind is written down, and the array is sorted into the one you are going to.

// One field per breakpoint, not one field holding a map of them. Statamic's
// `array` fieldtype reshapes what it is given into key/value pairs, so a map of
// lists comes back out the other side as an error; `list` is the fieldtype that
// stores exactly a list of strings and hands it back unchanged.
const BLOCK_ORDER_PREFIX = 'block_order_';
const BLOCK_ORDER_FIELD = 'blocks';

const orderField = (bp) => BLOCK_ORDER_PREFIX + bp;

/** Desktop-first, like the rest of the responsive work: no order = inherit up. */
const BP_INHERITS = { laptop: [], tablet: ['laptop'], mobile: ['tablet', 'laptop'] };

/**
 * The breakpoint being edited — the same answer the responsive fields give.
 *
 * Fit is not a synonym for laptop: it fills the pane, and at a narrow pane that
 * is tablet or mobile. Reading only the device button would file a drag made at
 * mobile width under laptop, which is most of the way to "it works sometimes".
 */
function currentBp(win) {
  let device = 'Responsive';

  try {
    device = win.localStorage.getItem(LP_DEVICE_KEY) || 'Responsive';
  } catch {
    /* private mode */
  }

  if (device === 'Tablet') {
    return 'tablet';
  }

  if (device === 'Mobile') {
    return 'mobile';
  }

  const iframe = previewFrame(win.document);

  return lpWidthToBp(iframe?.clientWidth || iframe?.offsetWidth || 1200);
}

/** Does this list name exactly the blocks that exist right now? */
function describesBlocks(list, ids) {
  return (
    Array.isArray(list) &&
    list.length === ids.length &&
    [...list].sort().join(' ') === [...ids].sort().join(' ')
  );
}

/**
 * The order in force at `bp`, following the cascade up. Null when there is none.
 *
 * A list that no longer names the blocks that exist counts as none. It is only
 * written on the way out of a breakpoint, so adding or deleting a block leaves
 * it talking about a set that is gone — and applying it anyway would reorder the
 * panel by a rule the editor cannot see, moving a block they just added away
 * from where they put it. Ignored instead, the field's own order stands until
 * the next drag writes a list that fits.
 */
function orderFor(row, bp) {
  if (!row || typeof row !== 'object') {
    return null;
  }

  const ids = blockIds(row);

  for (const key of [bp, ...BP_INHERITS[bp]]) {
    const list = row[orderField(key)];

    if (Array.isArray(list) && list.length && describesBlocks(list, ids)) {
      return list;
    }
  }

  return null;
}

/**
 * Every section row that opted in, as `{container, path, row}`.
 *
 * Opting in is declaring the field: a section with no `block_order` is left
 * exactly as it was, which is what keeps this off every other section on the
 * site — and off every site that has never asked for it.
 */
function orderableSections(doc) {
  const found = [];

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      return found;
    }

    const walk = (node, path, depth) => {
      if (depth > 12 || !node || typeof node !== 'object') {
        return;
      }

      if (Array.isArray(node)) {
        node.forEach((item, i) => walk(item, `${path}.${i}`, depth + 1));

        return;
      }

      if (
        Object.prototype.hasOwnProperty.call(node, orderField('laptop')) &&
        Array.isArray(node[BLOCK_ORDER_FIELD])
      ) {
        found.push({ container, path, row: node });
      }

      for (const [key, value] of Object.entries(node)) {
        if (value && typeof value === 'object') {
          walk(value, path ? `${path}.${key}` : key, depth + 1);
        }
      }
    };

    walk(values, '', 0);

    return found;
  }

  return found;
}

/** Row ids in their current on-screen order. */
function blockIds(row) {
  return (row[BLOCK_ORDER_FIELD] || []).map((block) => block?._id).filter(Boolean);
}

function sameOrder(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((id, i) => id === b[i]);
}

/**
 * Writes the order now on screen down for `bp`.
 *
 * Only where it differs from the order inherited from the bigger screen — so
 * merely looking at mobile never gives mobile an order of its own, and dragging
 * it back into step drops the override again and resumes inheriting.
 */
function recordBlockOrder(doc, bp) {
  orderableSections(doc).forEach(({ container, path, row }) => {
    const ids = blockIds(row);

    if (ids.length < 2) {
      return;
    }

    const stored = row[orderField(bp)];

    if (sameOrder(stored, ids)) {
      return;
    }

    // Only ever written, never cleared.
    //
    // It used to drop the override when the order matched the bigger screen
    // again — tidy, and wrong: arriving at a breakpoint sorts the array into its
    // order, and a tick landing in the moment before that write settles sees the
    // order it is about to leave behind. "In step, so forget it" then threw away
    // the very order it was on its way to restoring. An override that outlives
    // its usefulness renders identically to none at all; one deleted by a race
    // is somebody's work gone.
    container.setFieldValue(`${path}.${orderField(bp)}`, ids);
  });
}

/** Sorts each section's blocks into `bp`'s order, so the panel shows it too. */
function sortBlockOrder(doc, bp) {
  orderableSections(doc).forEach(({ container, path, row }) => {
    const rows = row[BLOCK_ORDER_FIELD];

    if (!Array.isArray(rows) || rows.length < 2) {
      return;
    }

    const wanted = orderFor(row, bp);

    if (!wanted) {
      return;
    }

    const byId = new Map(rows.map((block) => [block?._id, block]));
    const next = wanted.map((id) => byId.get(id)).filter(Boolean);

    // Anything the stored order doesn't mention — a block added since — keeps
    // its place at the end rather than disappearing from the panel.
    rows.forEach((block) => {
      if (!next.includes(block)) {
        next.push(block);
      }
    });

    if (next.length !== rows.length || next.every((block, i) => block === rows[i])) {
      return;
    }

    container.setFieldValue(`${path}.${BLOCK_ORDER_FIELD}`, next);
  });
}

/**
 * Writes a drag down as it happens, so the page reorders while you watch rather
 * than on the next device switch.
 *
 * Silent on laptop, and that is the whole safety of it. Laptop is where blocks
 * are added and fields are edited, and a write there re-renders the page builder
 * underneath that work — which is what once left Statamic's set picker spinning
 * forever. Laptop's own order is written once, on the way out, by `setLpDevice`.
 * Everywhere else this only writes when the order actually changed.
 */
function watchBlockOrder(win) {
  if (win.__sveBlockOrderWatch) {
    return;
  }

  win.__sveBlockOrderWatch = setInterval(() => {
    const bp = currentBp(win);

    if (bp === 'laptop') {
      return;
    }

    // Arriving at a breakpoint sorts the array into its order, and that write
    // takes a moment to settle. Recording in that moment would file the order
    // being left behind as this breakpoint's own — overwriting the one it is on
    // its way to restoring. Nothing is dragged in the first half second of a
    // switch anyway, so there is nothing to lose by waiting.
    if (Date.now() < blockOrderSettleUntil) {
      return;
    }

    try {
      recordBlockOrder(win.document, bp);
    } catch {
      /* a form mid-render is not worth a thrown interval */
    }
  }, 400);
}

/** Set on a device switch; the watcher holds off until the sort has landed. */
let blockOrderSettleUntil = 0;

function setLpDevice(win, key) {
  // Read while nothing has moved yet: this is the breakpoint whose order the
  // array currently is, and the only moment it can still be identified.
  const from = currentBp(win);

  recordBlockOrder(win.document, from);

  // Nothing may record between here and the sort below. Both breakpoints are in
  // play across those lines, and a tick landing in the middle would file one
  // order under the other's name — which is how laptop and tablet ended up
  // holding the same thing.
  blockOrderSettleUntil = Date.now() + 1200;

  try {
    win.localStorage.setItem(LP_DEVICE_KEY, String(key));
  } catch {
    /* private mode */
  }

  // Before the sort, not after. In Fit the breakpoint is read off the preview's
  // width, and until this has run that width is still the one being left — so a
  // sort placed above it would quietly sort into the order it came from.
  applyLpDevice(win, key);
  paintLpPreviewChrome(win);

  const to = key === 'Tablet' ? 'tablet' : key === 'Mobile' ? 'mobile' : currentBp(win);

  sortBlockOrder(win.document, to);

  // Fit has no width of its own — it takes the pane's, and the class that gives
  // it that may still be settling. One more pass inside the quiet window, which
  // costs nothing when the first one already got it right.
  if (to !== 'tablet' && to !== 'mobile') {
    setTimeout(() => sortBlockOrder(win.document, currentBp(win)), 350);
  }

  watchBlockOrder(win);

  dispatchLpBreakpoint(win, key);
  watchLpResponsiveWidth(win);
}

/** Map a preview width to the responsive field drawer (desktop-first). */
function lpWidthToBp(width) {
  if (width >= 1024) {
    return 'laptop';
  }

  if (width >= 768) {
    return 'tablet';
  }

  return 'mobile';
}

function dispatchLpBreakpoint(win, deviceKey = lpStoredDevice(win)) {
  let bp = 'laptop';

  if (deviceKey === 'Mobile') {
    bp = 'mobile';
  } else if (deviceKey === 'Tablet') {
    bp = 'tablet';
  } else if (deviceKey === 'Responsive') {
    const iframe = previewFrame(win.document);
    const w = iframe?.clientWidth || iframe?.offsetWidth || 0;

    bp = lpWidthToBp(w || 1200);
  }

  try {
    win.dispatchEvent(
      new CustomEvent('sve:breakpoint', { detail: { bp, device: deviceKey } })
    );
  } catch {
    /* ignore */
  }
}

function applyLpDevice(win, key = lpStoredDevice(win)) {
  const doc = win.document;
  const iframe = previewFrame(doc);

  if (!iframe) {
    return;
  }

  const devices = lpConfiguredDevices(win);
  const preset = key && key !== 'Responsive' ? devices[key] : null;
  const contents = doc.querySelector('.live-preview-contents');
  const isDark = doc.documentElement.classList.contains('dark');
  const canvasBg = isDark ? '#0a0a0a' : '#ffffff';

  // Canvas behind the iframe: white in light mode, near-black in dark — never
  // Statamic's default mid-grey gutter when a device frame is narrower than the pane.
  if (contents) {
    if (contents.style.getPropertyValue('background-color') !== canvasBg) {
      contents.style.setProperty('background-color', canvasBg, 'important');
    }

    // Column flex: align-items = horizontal, justify-content = vertical.
    // Center the device frame in the pane; keep it flush to the top (no gap).
    if (contents.style.getPropertyValue('align-items') !== 'center') {
      contents.style.setProperty('align-items', 'center', 'important');
    }

    if (contents.style.getPropertyValue('justify-content') !== 'flex-start') {
      contents.style.setProperty('justify-content', 'flex-start', 'important');
    }
  }

  // Idempotent writes only — unconditional style/class changes retrigger
  // watchLpIframeChrome and freeze Live Preview in an attribute loop.
  if (!preset) {
    if (iframe.classList.contains('device')) {
      iframe.classList.remove('device');
    }

    if (!iframe.classList.contains('responsive')) {
      iframe.classList.add('responsive');
    }

    if (iframe.style.getPropertyValue('width')) {
      iframe.style.removeProperty('width');
    }

    if (iframe.style.getPropertyValue('height') !== '100%') {
      iframe.style.setProperty('height', '100%', 'important');
    }

    // Clear device-only chrome Statamic adds (margin-top gap, shadow, radius).
    ['margin-top', 'border-radius', 'box-shadow', 'max-height'].forEach((prop) => {
      if (iframe.style.getPropertyValue(prop)) {
        iframe.style.removeProperty(prop);
      }
    });

    return;
  }

  if (iframe.classList.contains('responsive')) {
    iframe.classList.remove('responsive');
  }

  if (!iframe.classList.contains('device')) {
    iframe.classList.add('device');
  }

  const wantW = `${preset.width}px`;

  // !important: Statamic's Live Preview Vue resets inline width/height on refresh
  // to the preset's fixed px. We only want width from the preset — height always
  // fills the pane, flush to the top (no margin-top black bar).
  if (iframe.style.getPropertyValue('width') !== wantW) {
    iframe.style.setProperty('width', wantW, 'important');
  }

  if (iframe.style.getPropertyValue('height') !== '100%') {
    iframe.style.setProperty('height', '100%', 'important');
  }

  if (iframe.style.getPropertyValue('margin-top') !== '0px') {
    iframe.style.setProperty('margin-top', '0', 'important');
  }

  if (iframe.style.getPropertyValue('max-height') !== 'none') {
    iframe.style.setProperty('max-height', 'none', 'important');
  }

  // Drop the floating “device card” look — same flush frame as Fit mode.
  if (iframe.style.getPropertyValue('border-radius') !== '0px') {
    iframe.style.setProperty('border-radius', '0', 'important');
  }

  if (iframe.style.getPropertyValue('box-shadow') !== 'none') {
    iframe.style.setProperty('box-shadow', 'none', 'important');
  }
}

/** When Fit/Responsive is active, re-broadcast breakpoint as the pane resizes. */
let lpResponsiveWidthObserver = null;
let lpResponsiveWidthTarget = null;
let lpResponsiveWidthLastBp = null;

function watchLpResponsiveWidth(win) {
  const iframe = previewFrame(win.document);

  if (!iframe) {
    return;
  }

  const device = lpStoredDevice(win);

  if (device !== 'Responsive') {
    lpResponsiveWidthObserver?.disconnect();
    lpResponsiveWidthObserver = null;
    lpResponsiveWidthTarget = null;
    lpResponsiveWidthLastBp = null;

    return;
  }

  if (lpResponsiveWidthTarget === iframe && lpResponsiveWidthObserver) {
    return;
  }

  lpResponsiveWidthObserver?.disconnect();
  lpResponsiveWidthTarget = iframe;
  lpResponsiveWidthLastBp = null;

  const tick = () => {
    if (lpStoredDevice(win) !== 'Responsive') {
      return;
    }

    const w = iframe.clientWidth || iframe.offsetWidth || 0;
    const bp = lpWidthToBp(w || 1200);

    if (bp === lpResponsiveWidthLastBp) {
      return;
    }

    lpResponsiveWidthLastBp = bp;
    dispatchLpBreakpoint(win, 'Responsive');
    paintLpPreviewChrome(win);
  };

  lpResponsiveWidthObserver = new win.ResizeObserver(tick);
  lpResponsiveWidthObserver.observe(iframe);
  tick();
}

function lpStoredZoom(win) {
  try {
    const n = parseInt(win.localStorage.getItem(LP_ZOOM_KEY) ?? '', 10);

    if (Number.isFinite(n) && n >= 25 && n <= 300) {
      return n;
    }
  } catch {
    /* private mode */
  }

  return LP_ZOOM_DEFAULT;
}

function setLpZoom(win, percent) {
  const clamped = Math.max(25, Math.min(300, Math.round(percent)));

  try {
    win.localStorage.setItem(LP_ZOOM_KEY, String(clamped));
  } catch {
    /* private mode */
  }

  applyLpZoom(win, clamped);
  paintLpPreviewChrome(win);
}

function applyLpZoom(win, percent = lpStoredZoom(win)) {
  const iframe = previewFrame(win.document);

  if (!iframe) {
    return;
  }

  const scale = percent / 100;
  const wantOrigin = 'top center';
  const wantTransform = scale === 1 ? '' : `scale(${scale})`;

  // Scale the iframe itself. transform-origin top center keeps the page under
  // the header; width/height compensation stops the layout from leaving a
  // huge empty gutter around a shrunk frame. Skip no-op writes — see applyLpDevice.
  if (iframe.style.transformOrigin !== wantOrigin) {
    iframe.style.transformOrigin = wantOrigin;
  }

  if (iframe.style.transform !== wantTransform) {
    iframe.style.transform = wantTransform;
  }

  if (scale === 1) {
    if (iframe.style.marginBottom) {
      iframe.style.marginBottom = '';
    }

    return;
  }

  // When scaled down, reclaim the leftover vertical space so the contents
  // pane doesn't scroll through empty padding under the frame.
  const h = iframe.offsetHeight || iframe.getBoundingClientRect().height / scale;
  const wantMargin = `${h * (scale - 1)}px`;

  if (iframe.style.marginBottom !== wantMargin) {
    iframe.style.marginBottom = wantMargin;
  }
}

/** Hide Statamic's Pop out / device <Select…> — our chrome replaces them. */
function hideStatamicLpChrome(header) {
  const ours = (el) =>
    el?.closest?.(`#${LP_PREVIEW_CHROME_ID}`) || el?.closest?.(`#${HEADER_TOOLBAR_ID}`);

  const hide = (el) => {
    if (!el || ours(el) || el.classList.contains('sve-off')) {
      return;
    }

    el.classList.add('sve-off');
    el.style.setProperty('display', 'none', 'important');
  };

  // Our icons replace the device picker entirely — hide every combobox /
  // listbox in the Live Preview header that isn't ours (covers "Select…",
  // translated labels, and empty placeholders).
  header.querySelectorAll('[role="combobox"], [role="listbox"], [data-ui-combobox-trigger]').forEach((el) => {
    if (ours(el)) {
      return;
    }

    hide(el);
    // Also hide a wrapping control if the trigger is nested in one.
    const wrap = el.closest?.('[data-ui-combobox], .ui-combobox, [data-reka-combobox-trigger]') || el.parentElement;

    if (wrap && wrap !== header && !ours(wrap)) {
      hide(wrap);
    }
  });

  header.querySelectorAll('button, [role="combobox"], [role="listbox"]').forEach((el) => {
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim();

    // Pop out / Pop in — label may sit in a child span beside an icon.
    if (/pop\s*out|pop\s*in|pop\s*ud|pop\s*ind/i.test(text)) {
      hide(el);

      return;
    }

    // Device select: Responsive / Laptop / … or placeholder "Select…" / "Vælg…".
    if (
      /^(responsive|laptop|tablet|mobile|desktop|select…|select\.\.\.|select\.{3}|vælg…|vælg\.\.\.)$/i.test(text) ||
      (/^(responsive|laptop|tablet|mobile|desktop|select|vælg)/i.test(text) && text.length < 24)
    ) {
      if (/save|publish|gem|public/i.test(text)) {
        return;
      }

      hide(el);
    }
  });
}

function ensureLpPreviewChrome(win) {
  const doc = win.document;
  const header = lpHeader(doc);

  if (!header) {
    doc.getElementById(LP_PREVIEW_CHROME_ID)?.remove();

    return;
  }

  hideStatamicLpChrome(header);
  hideStatamicLpClose(header);

  let chrome = doc.getElementById(LP_PREVIEW_CHROME_ID);

  // Vue may wipe the header — recreate if our chrome left the tree.
  if (chrome && !header.contains(chrome)) {
    chrome.remove();
    chrome = null;
  }

  if (!chrome) {
    chrome = doc.createElement('div');
    chrome.id = LP_PREVIEW_CHROME_ID;
    chrome.style.cssText =
      `display:inline-flex;align-items:center;gap:${LP_TOOLBAR_GAP}px;flex-shrink:0;`;

    const devices = doc.createElement('div');

    devices.dataset.sveDevices = '';
    // Lidt tættere inde i device-gruppen (samme cluster), ikke mellem clusters.
    devices.style.cssText = `${HEADER_GROUP_STYLE}gap:4px;`;
    chrome.appendChild(devices);

    const zoom = doc.createElement('div');

    zoom.dataset.sveZoom = '';
    zoom.style.cssText = HEADER_GROUP_STYLE;

    const zoomOut = doc.createElement('button');

    zoomOut.type = 'button';
    zoomOut.dataset.zoom = 'out';
    zoomOut.title = t(win, 'zoom_out');
    zoomOut.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
    zoomOut.style.cssText =
      `${FRAMED_CONTROL_STYLE}width:${LP_CONTROL_H}px;padding:0;display:inline-flex;align-items:center;justify-content:center;`;
    zoomOut.addEventListener('click', () => {
      const cur = lpStoredZoom(win);
      const next = [...LP_ZOOM_STEPS].reverse().find((step) => step < cur) ?? Math.max(25, cur - 10);

      setLpZoom(win, next);
    });

    const zoomLabel = doc.createElement('button');

    zoomLabel.type = 'button';
    zoomLabel.dataset.zoom = 'label';
    zoomLabel.style.cssText = `${FRAMED_CONTROL_STYLE}padding:0 8px;min-width:3.25rem;`;
    zoomLabel.addEventListener('click', () => {
      const cur = lpStoredZoom(win);
      const idx = LP_ZOOM_STEPS.indexOf(cur);
      const next = LP_ZOOM_STEPS[(idx + 1) % LP_ZOOM_STEPS.length] ?? LP_ZOOM_DEFAULT;

      setLpZoom(win, next);
    });

    const zoomIn = doc.createElement('button');

    zoomIn.type = 'button';
    zoomIn.dataset.zoom = 'in';
    zoomIn.title = t(win, 'zoom_in');
    zoomIn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
    zoomIn.style.cssText =
      `${FRAMED_CONTROL_STYLE}width:${LP_CONTROL_H}px;padding:0;display:inline-flex;align-items:center;justify-content:center;`;
    zoomIn.addEventListener('click', () => {
      const cur = lpStoredZoom(win);
      const next = LP_ZOOM_STEPS.find((step) => step > cur) ?? Math.min(300, cur + 10);

      setLpZoom(win, next);
    });

    zoom.appendChild(zoomOut);
    zoom.appendChild(lpModeSeparator(doc));
    zoom.appendChild(zoomLabel);
    zoom.appendChild(lpModeSeparator(doc));
    zoom.appendChild(zoomIn);

    chrome.appendChild(zoom);
  }

  // Rebuild device icons when the set changes (e.g. Laptop removed → Fit only).
  const devicesEl = chrome.querySelector('[data-sve-devices]');
  const deviceKeys = lpDeviceKeys(win);
  const deviceSig = deviceKeys.join('|');

  if (devicesEl && devicesEl.dataset.sig !== deviceSig) {
    devicesEl.dataset.sig = deviceSig;
    devicesEl.textContent = '';

    deviceKeys.forEach((key) => {
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.dataset.device = key;
      btn.title = key === 'Responsive' ? t(win, 'device_fit') : key;
      btn.innerHTML = LP_DEVICE_ICONS[key] || LP_DEVICE_ICONS.Laptop;
      btn.style.cssText =
        `${FRAMED_CONTROL_STYLE}width:28px;padding:0;display:inline-flex;align-items:center;justify-content:center;`;
      btn.addEventListener('click', () => setLpDevice(win, key));
      devicesEl.appendChild(btn);
    });
  }

  // Place devices+zoom on the RIGHT — where Statamic's device <Select…> sat —
  // immediately before Save & Publish. Never move the node when it's already
  // there (Node.after on every observer pass freezes Live Preview).
  const wantParent = header;
  let anchor = null;

  wantParent.querySelectorAll('button').forEach((btn) => {
    const text = (btn.textContent || '').replace(/\s+/g, ' ').trim();

    if (/save\s*&\s*publish|gem\s*&\s*public|save\s*and\s*publish|gem og public/i.test(text)) {
      anchor = btn;
    }
  });

  // Prefer anchoring next to the save button's cluster so chrome sits left of it.
  const cluster = anchor?.parentElement;

  if (cluster && cluster !== header) {
    if (chrome.parentElement !== cluster || chrome.nextElementSibling !== anchor) {
      cluster.insertBefore(chrome, anchor);
    }
  } else if (anchor && chrome.nextElementSibling !== anchor) {
    header.insertBefore(chrome, anchor);
  } else if (chrome.parentElement !== header) {
    header.appendChild(chrome);
  }

  // Ét gap devices↔zoom↔Save↔go-back (ingen stablede margins).
  syncLpRightBarGaps(win);

  applyLpDevice(win);
  applyLpZoom(win);
  paintLpPreviewChrome(win);
  watchLpIframeChrome(win);
  watchLpResponsiveWidth(win);
  // Started here as well as on a device switch: the editor can open straight
  // into tablet or mobile from the last session, and a drag there has to be
  // written down without waiting for the device to be clicked first.
  watchBlockOrder(win);
  dispatchLpBreakpoint(win);
}

function paintLpPreviewChrome(win) {
  const doc = win.document;
  const chrome = doc.getElementById(LP_PREVIEW_CHROME_ID);

  if (!chrome) {
    return;
  }

  const device = lpChromeActiveDevice(win);
  const zoom = lpStoredZoom(win);

  chrome.querySelectorAll('[data-device]').forEach((btn) => {
    paintLpActiveControl(btn, btn.dataset.device === device);
  });

  // Zoom controls: same idle opacity as other chrome icons (label stays readable).
  chrome.querySelectorAll('[data-zoom]').forEach((btn) => {
    if (btn.dataset.zoom === 'label') {
      if (btn.style.opacity !== '1') {
        btn.style.opacity = '1';
      }

      return;
    }

    if (btn.style.opacity !== LP_ICON_IDLE_OPACITY) {
      btn.style.opacity = LP_ICON_IDLE_OPACITY;
    }
  });

  paintLpSaveButton(win);
  syncLpRightBarGaps(win);

  const label = chrome.querySelector('[data-zoom="label"]');

  if (label) {
    const text = `${zoom}%`;

    if (label.textContent !== text) {
      label.textContent = text;
    }

    const title = t(win, 'zoom_level', { percent: zoom });

    if (label.title !== title) {
      label.title = title;
    }
  }
}

/** Re-apply device size / zoom when Statamic Vue resets the iframe attributes. */
let lpIframeChromeObserver = null;
let lpIframeChromeTarget = null;

function watchLpIframeChrome(win) {
  const iframe = previewFrame(win.document);

  if (!iframe) {
    return;
  }

  if (lpIframeChromeTarget === iframe && lpIframeChromeObserver) {
    return;
  }

  lpIframeChromeObserver?.disconnect();
  lpIframeChromeTarget = iframe;
  let reapplying = false;

  lpIframeChromeObserver = new win.MutationObserver(() => {
    if (reapplying) {
      return;
    }

    reapplying = true;

    try {
      applyLpDevice(win);
      applyLpZoom(win);
    } finally {
      // Let our own style writes settle before listening again.
      win.requestAnimationFrame(() => {
        reapplying = false;
      });
    }
  });

  lpIframeChromeObserver.observe(iframe, {
    attributes: true,
    attributeFilter: ['style', 'class', 'width', 'height'],
  });
}

// --- Header toolbar: one control at a time -------------------------------------
//
// The header used to show every control at once — the panel mode, the collection
// picker, the globals dropdown, the sections button. For an editor a customer
// uses, that's noise. This collapses them to a row of icons; clicking one reveals
// only its control and hides the rest. The settings icon is the important one: it
// opens the editor panel and mirrors its tabs (Main/SEO/Sidebar, read live so a
// renamed tab just follows) into the header, plus a Save — so "edit the SEO" is
// one obvious click, not a hunt.

const HEADER_TOOLBAR_ID = '__sve-toolbar';

const SETTINGS_TABS_ID = '__sve-settings-tabs';

/**
 * Ikoner der folder en kontrol ud ved siden af sig. De øvrige (sektioner,
 * disposition) åbner et panel i siden og står helt frit.
 */
const FRAMED_TABS = ['settings', 'pages', 'globals'];

/**
 * De to der samler ikon og kontrol i ét felt, delt op af gennemgående streger.
 *
 * Panelknappen gør det ikke: dér er kontrollen en tilstand knappen selv står i,
 * og de to skal kunne skelnes. Her er kontrollen et sted man navigerer hen — ét
 * sammenhængende værktøj, hvor stregerne siger hvor det ene stopper og det
 * næste begynder.
 */
const MERGED_TABS = ['pages', 'globals'];

const frameId = (key) => `__sve-frame-${key}`;
const seamId = (key) => `__sve-seam-${key}`;

/** Fladen bag både ikonknappen og kontrolgruppen — samme, så de hører sammen. */
const HEADER_SURFACE = 'rgba(128,128,128,.16)';

/**
 * Kvadratisk ikonknap i topbaren — samme flade/højde som device/zoom-grupperne.
 */
const LP_ICON_BTN_STYLE =
  `box-sizing:border-box;width:${LP_CHROME_H}px;height:${LP_CHROME_H}px;` +
  'display:inline-flex;align-items:center;justify-content:center;padding:0;' +
  `border:none;border-radius:.5rem;cursor:pointer;background:${HEADER_SURFACE};color:currentColor;`;

/**
 * Fladen bag et felt man vælger i, oven på gruppens.
 *
 * Lysere end gruppen, ikke mørkere: den mørke er taget af knappen, og de to må
 * ikke kunne forveksles. Et felt man vælger i og en knap man trykker på gør ikke
 * det samme, så de skal heller ikke se ens ud.
 */
const HEADER_FIELD_SURFACE = 'rgba(128,128,128,.3)';

/** Luften mellem ikonknappen og dens kontrolgruppe, når de er to bokse. */
const LP_ICON_GAP = 8;

/**
 * Ens mellemrum mellem topbar-items (ikoner, device/zoom, Save, go-back).
 * Ikke ekstra margin på udvidede felter — det gav skæve huller omkring Globals.
 */
const LP_TOOLBAR_GAP = 8;

/** Luften på hver side af en gennemgående streg. */
const LP_SEAM_GAP = 6;

/** Pilen i vores egne selects. Native-pilen står klods op ad kanten. */
const SELECT_CHEVRON =
  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' ' +
  "viewBox='0 0 24 24' fill='none' stroke='%23a3a3a3' stroke-width='2.2' stroke-linecap='round' " +
  'stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")';

/** Selve gruppen om et sæt kontroller: fladen, hjørnerne og luften ud til dem. */
const HEADER_GROUP_STYLE =
  `display:inline-flex;align-items:center;box-sizing:border-box;height:${LP_CHROME_H}px;` +
  `padding:${LP_CONTROL_PAD}px;border-radius:.5rem;` +
  `background:${HEADER_SURFACE};font-family:inherit;`;

/**
 * En kontrol inde i en gruppe. Lavere end gruppens indre mål, så den valgte
 * flade ikke går helt ud til kanten — den skal ligge i gruppen, ikke fylde den.
 */
const FRAMED_CONTROL_STYLE =
  `box-sizing:border-box;height:${LP_CONTROL_H}px;border:none;border-radius:.375rem;` +
  'background:transparent;cursor:pointer;color:currentColor;' +
  'font-size:12px;font-weight:500;font-family:inherit;line-height:1;';

/**
 * En select i et felt med streger: ingen flade om sig selv — stregerne er det
 * der skiller den fra naboen, og en flade oveni ville sige det samme igen.
 *
 * Pilen sidder .375rem fra kanten, og teksten stopper før den. Designet tegnede
 * den ikke, men uden den ligner en select et stykke tekst — man skal kunne se at
 * der er noget at folde ud. Den luft passer med stregens egen, så afstanden ind
 * til stregen bliver den samme fra begge sider.
 */
const FRAMED_SELECT_STYLE =
  `${FRAMED_CONTROL_STYLE}padding:0 1.375rem 0 .375rem;appearance:none;-webkit-appearance:none;` +
  `background-image:${SELECT_CHEVRON};background-repeat:no-repeat;` +
  'background-position:right .375rem center;background-size:12px;';

/**
 * Sømmen mellem to dele af samme felt.
 *
 * Ikke en streg lagt oven på gruppen, men en revne hele vejen ned gennem den, i
 * topbarens farve. `align-self:stretch` med negativ margin op og ned strækker
 * den ud over gruppens luft, så den går kant til kant. Farven sættes i
 * applyHeaderTab, så et CP-temaskift rammer alle søm samtidig.
 */
function headerSeam(doc) {
  const seam = doc.createElement('span');

  seam.dataset.sveSeam = '';
  seam.style.cssText =
    `flex:0 0 auto;align-self:stretch;width:1px;margin:${-LP_CONTROL_PAD}px ${LP_SEAM_GAP}px;`;

  return seam;
}

/**
 * Samme gruppe, men svævende over panelet i stedet for at ligge på topbaren.
 *
 * Gruppens flade er halvgennemsigtig, og panelet ruller under den — så den skal
 * have en tæt bund at ligge på, ellers læser man indholdet gennem knapperne. Et
 * fladt gradient-lag oven på panelfarven giver præcis samme nuance som oppe i
 * topbaren, bare uigennemsigtig.
 */
const FLOATING_GROUP_STYLE =
  `${HEADER_GROUP_STYLE}background:linear-gradient(${HEADER_SURFACE},${HEADER_SURFACE}),` +
  'var(--theme-color-content-bg,#fff);box-shadow:0 1px 4px rgba(0,0,0,.18);color:currentColor;';

// null = nothing expanded (the simplest header). Persisted so it survives the
// header being rebuilt on every preview update.
let headerTab = undefined;

/** The feature toggle behind each header tab — see ensureHeaderToolbar. */
const HEADER_TAB_FEATURE = {
  settings: 'panel',
  pages: 'pages',
  globals: 'globals',
  sections: 'sections',
  outline: 'outline',
};

function headerTabAvailable(win, tab) {
  return !tab || featureOn(win, HEADER_TAB_FEATURE[tab] ?? tab);
}

function loadHeaderTab(win) {
  if (headerTab !== undefined) {
    return;
  }

  // Nothing unfolded on arrival. The panel button used to open expanded, which
  // meant the bar changed width a moment after the editor appeared — every icon
  // beside it moved, and the alignment with the sidebar was measured against a
  // layout that was about to change. A row of closed icons is also simply what
  // the rest of the bar looks like.
  //
  // Deliberately not restored from localStorage: "when I open Live Preview" is
  // the moment being described, and it should look the same every time.
  headerTab = null;

  // A tab remembered from before the site switched that tool off would open a
  // control with no icon to close it again. Fall back to nothing expanded.
  if (!headerTabAvailable(win, headerTab)) {
    setHeaderTab(win, null);
  }
}

function setHeaderTab(win, tab) {
  headerTab = tab;

  try {
    tab ? win.localStorage.setItem('sve-header-tab', tab) : win.localStorage.removeItem('sve-header-tab');
  } catch {
    /* private mode */
  }
}

const TOOLBAR_ICONS = {
  // Soft panel-left — same stroke language as pages/globe/grid (not the old heavy box).
  settings:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="3" y="3" width="18" height="18" rx="2"/>' +
    '<path d="M9 3v18"/></svg>',
  pages:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="4" y="3" width="16" height="18" rx="2"/>' +
    '<line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/></svg>',
  globals:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><circle cx="12" cy="12" r="9"/>' +
    '<line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/></svg>',
  sections:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="3" y="3" width="7" height="7" rx="1"/>' +
    '<rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>' +
    '<rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  // A trunk with branches off it — nesting, which is what the tree shows and the
  // outline's stepped lines deliberately do not.
  listview:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><path d="M5 4v13a2 2 0 0 0 2 2h3"/>' +
    '<path d="M7 11h3"/><line x1="13" y1="5" x2="20" y2="5"/><line x1="13" y1="11" x2="20" y2="11"/>' +
    '<line x1="13" y1="19" x2="20" y2="19"/></svg>',
  // Lines stepping in, the shape the panel itself draws.
  outline:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><line x1="4" y1="6" x2="20" y2="6"/>' +
    '<line x1="9" y1="12" x2="20" y2="12"/><line x1="14" y1="18" x2="20" y2="18"/></svg>',
};

/** Keep toolbar glyphs in sync after icon redesigns (toolbar mounts once). */
function syncToolbarIcons(doc) {
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return;
  }

  bar.querySelectorAll('button[data-tab]').forEach((btn) => {
    const key = btn.dataset.tab;
    const html = TOOLBAR_ICONS[key];

    if (!html || btn.dataset.iconVer === 'stroke-15') {
      return;
    }

    btn.innerHTML = html;
    btn.dataset.iconVer = 'stroke-15';
  });
}

/** The icon row at the far left of the Live Preview header. */
function ensureHeaderToolbar(win) {
  const doc = win.document;
  const header = lpHeader(doc);

  if (!header || doc.getElementById(HEADER_TOOLBAR_ID)) {
    return;
  }

  const bar = doc.createElement('div');

  bar.id = HEADER_TOOLBAR_ID;
  bar.style.cssText =
    `display:inline-flex;align-items:center;gap:${LP_TOOLBAR_GAP}px;margin-right:${LP_TOOLBAR_GAP}px;`;

  // `feature` names the toggle on the settings screen; `key` is what the rest of
  // the header calls the tab. They differ for the panel because the toggle reads
  // as what it opens ("Page settings panel") while the tab is the icon's slot.
  [
    { key: 'settings', feature: 'panel', title: t(win, 'panel') },
    { key: 'pages', feature: 'pages', title: t(win, 'pages') },
    { key: 'globals', feature: 'globals', title: t(win, 'globals') },
    { key: 'sections', feature: 'sections', title: t(win, 'sections') },
    // One icon for both lists: the headings are the block tree's second tab now,
    // so a button of their own would open the same panel twice.
    { key: 'listview', feature: 'listview', title: t(win, 'listview') },
  ].forEach((tab) => {
    if (!featureOn(win, tab.feature)) {
      return;
    }

    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.dataset.tab = tab.key;
    btn.title = tab.title;
    btn.innerHTML = TOOLBAR_ICONS[tab.key];
    // Same outer size as devices / zoom / go-back — one height across the bar.
    btn.style.cssText = LP_ICON_BTN_STYLE;
    btn.querySelector('svg')?.setAttribute('width', '15');
    btn.querySelector('svg')?.setAttribute('height', '15');
    btn.addEventListener('click', () => toggleHeaderTab(win, tab.key));

    if (FRAMED_TABS.includes(tab.key)) {
      const wrap = doc.createElement('div');

      wrap.id = frameId(tab.key);

      if (MERGED_TABS.includes(tab.key)) {
        // Ét felt: ikon, søm, kontrol. Wrapperen er selve gruppeboksen — fladen
        // sættes i applyHeaderTab, så den kun tegnes når feltet er foldet ud.
        wrap.style.cssText =
          `display:inline-flex;align-items:center;box-sizing:border-box;height:${LP_CHROME_H}px;` +
          `padding:${LP_CONTROL_PAD}px;border-radius:.5rem;`;
        btn.style.width = `${LP_CONTROL_H}px`;
        btn.style.height = `${LP_CONTROL_H}px`;
        btn.style.borderRadius = '.375rem';
        btn.style.background = 'transparent';
        wrap.appendChild(btn);

        const seam = headerSeam(doc);

        seam.id = seamId(tab.key);
        seam.style.display = 'none';
        wrap.appendChild(seam);
      } else {
        // To bokse med luft imellem: knappen er det man trykker på, kontrollen er
        // det der kommer frem, og de skal kunne skelnes — samme højde begge.
        wrap.style.cssText = `display:inline-flex;align-items:center;gap:${LP_ICON_GAP}px;`;
        wrap.appendChild(btn);
      }

      bar.appendChild(wrap);

      return;
    }

    bar.appendChild(btn);
  });

  header.insertBefore(bar, header.firstChild);
}

function toggleHeaderTab(win, key) {
  const active = headerTab === key;

  if (key === 'outline') {
    // A docked panel, like the section library — the icon is the whole control,
    // there is nothing to unfold into the header beside it.
    setHeaderTab(win, active ? null : 'outline');
    toggleOutlinePanel(win);
    applyHeaderTab(win);

    return;
  }

  if (key === 'listview') {
    // Same shape as the outline: one icon, one docked panel, nothing to unfold.
    setHeaderTab(win, active ? null : 'listview');
    toggleListViewPanel(win);
    applyHeaderTab(win);

    return;
  }

  if (key === 'sections') {
    // Clicking the icon is an explicit request for the library, so it always
    // opens. The lock only means something still owns the editor — leave it
    // first (chrome, a global section, or both) instead of going dead on the
    // click, which left the icon looking alive but doing nothing.
    if (isSectionLibraryLocked(win)) {
      dismissChromeForPageEdit(win);
      closeGlobalSectionPanel(win);
      sendToPreview({ source: 'statamic-visual-editor', type: 'sve-force-exit-chrome' }, win);
      sendToPreview({ source: 'statamic-visual-editor', type: 'sve-force-exit-global' }, win);
      syncSectionLibraryAvailability(win);
    }

    // Its "expanded" form is the docked panel, not a header control.
    setHeaderTab(win, active ? null : 'sections');
    openSectionPicker(win); // toggles

    if (!active) {
      setLpCollapsed(win, true); // give the preview its width back
    }

    applyHeaderTab(win);

    return;
  }

  // Switching to an inline control closes any docked right panel — one thing out
  // at a time.
  closeRightPanels(win);
  setHeaderTab(win, active ? null : key);

  // The settings tab is the editor panel. Move the MODE with it, not just the
  // panel — an open panel while Hide stays lit is a contradiction. Opening → Show,
  // closing → Hide, so Hide/Auto/Show always tells the truth about what's on
  // screen.
  if (key === 'settings') {
    setLpMode(win, active ? 'hide' : 'show');
  }

  applyHeaderTab(win);
}

/**
 * The publish tabs (Main / SEO / Sidebar…), mirrored into the header, plus Save.
 *
 * Read from the panel every time rather than remembered: the labels are the
 * blueprint's own, so a renamed tab follows for free, and different collections
 * have different tabs. The panel must be open for the native tabs to exist, which
 * is why this only shows under the settings tab.
 */
function ensureSettingsTabs(win) {
  const doc = win.document;
  const bar = doc.getElementById(LP_WIDTH_ID);

  if (!bar) {
    return null;
  }

  let group = doc.getElementById(SETTINGS_TABS_ID);

  if (!group) {
    group = doc.createElement('div');
    group.id = SETTINGS_TABS_ID;
    group.style.cssText = FLOATING_GROUP_STYLE;
    bar.appendChild(group);
  }

  const nativeTabs = nativeTabButtons(doc);

  // Rebuild if the set of tabs changed (count or labels) — cheap, and keeps a
  // renamed or blueprint-specific tab in step.
  const signature = nativeTabs.map((tabEl) => tabEl.textContent.trim()).join('|');

  // Kun når der er faner at læse navnene af. Solo-visningen sætter display:none
  // på hele panelkolonnen på nær den markerede sektion — også fanelisten — og en
  // tom liste ville her betyde "byg boksen om til ingenting". Fanerne er der
  // stadig, de er bare ikke fremme, så navnene bliver stående.
  if (nativeTabs.length && group.dataset.sig !== signature) {
    group.dataset.sig = signature;
    group.innerHTML = '';

    // Skip the first tab (Main): its content is the sections, which you edit in
    // the preview itself — so it has no place in the settings row.
    nativeTabs.forEach((tabEl, index) => {
      if (index === 0) {
        return;
      }

      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.dataset.tabIndex = String(index);
      btn.textContent = tabEl.textContent.trim();
      btn.style.cssText = `${FRAMED_CONTROL_STYLE}padding:0 10px;`;
      btn.addEventListener('click', () => clickNativeTab(win, index));
      group.appendChild(btn);
    });
  }

  // Highlight the selected tab only when its content is actually on screen. With
  // the panel closed nothing is shown, so nothing should look active — a lit-up
  // SEO with no SEO in sight is just a lie.
  const panelOpen = !lpCollapsed;

  // Samme markering som Hidden/Auto/Visible oppe i topbaren: primær blå.
  group.querySelectorAll('[data-tab-index]').forEach((btn) => {
    const selected = nativeTabs[Number(btn.dataset.tabIndex)]?.getAttribute('aria-selected') === 'true';

    paintLpActiveControl(btn, panelOpen && selected);
  });

  return group;
}

/**
 * The publish tabs actually on screen. reka-ui renders a hidden measurement copy
 * of the tab list alongside the live one, so filtering to what's visible is what
 * keeps a click landing on the real tab rather than its ghost.
 */
function nativeTabButtons(doc) {
  return [...(doc.querySelector('.live-preview-editor')?.querySelectorAll('button[role="tab"]') ?? [])].filter(
    (el) => el.offsetParent !== null
  );
}

/**
 * Press the index'th publish tab, and nothing else.
 *
 * reka-ui's tabs switch on the full pointer sequence, not a bare .click(), and
 * they want real PointerEvents. Returns whether there was a tab to press.
 */
function fireTabClick(win, index) {
  const el = nativeTabButtons(win.document)[index];

  if (!el) {
    return false;
  }

  ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
    el.dispatchEvent(new win.PointerEvent(type, { bubbles: true, cancelable: true }));
  });

  return true;
}

/** Switch the editor panel to a publish tab by clicking its real tab button. */
function clickNativeTab(win, index) {
  const fire = () => {
    if (!fireTabClick(win, index)) {
      return;
    }

    setTimeout(() => ensureSettingsTabs(win), 60); // re-highlight the new selection
  };

  // At bede om SEO mens man står inde i en overskrift er også at bede om at komme
  // ud af den: felterne hører til siden, ikke til blokken. Og solo-visningen
  // skjuler fanelisten, så der ville ikke være nogen fane at ramme.
  const leavingSolo = soloUid !== null;

  if (leavingSolo) {
    leaveSolo(win.document, win);
  }

  // Asking for a tab means asking to see it — so an open panel is implied. On
  // Hide the panel is closed and its tabs aren't even rendered yet, so switch to
  // Show first and let them mount before clicking. Leaving the mode on Hide while
  // showing a tab would just be a contradiction.
  if (lpMode(win) === 'hide' || lpCollapsed) {
    setLpMode(win, 'show');
    setTimeout(fire, 140);
  } else if (leavingSolo) {
    setTimeout(fire, 60); // lad panelet folde sig ud igen, før der klikkes
  } else {
    fire();
  }
}

/** Show the control for the active tab, hide the rest, light up the active icon. */
/** Hide Statamic's "Live Preview" header label — it names the obvious. */
function hideLpLabel(doc) {
  const header = lpHeader(doc);

  if (!header) {
    return;
  }

  const label = [...header.querySelectorAll('*')].find(
    (el) => !el.firstElementChild && /^(live preview|forhåndsvisning)$/i.test((el.textContent || '').trim())
  );

  if (label && label.style.display !== 'none') {
    label.style.display = 'none';
  }
}

function applyHeaderTab(win) {
  const doc = win.document;

  loadHeaderTab(win);
  hideLpLabel(doc);

  // The standalone panel glyph and the old Hide/Auto/Show group are replaced by
  // the toolbar — keep them out of the way.
  const glyph = doc.getElementById(LP_TOGGLE_ID);

  if (glyph) {
    glyph.style.display = 'none';
  }

  // The sections icon in the toolbar replaces the old "Sektioner" text button.
  const lib = doc.getElementById(LIBRARY_BUTTON_ID);

  if (lib) {
    lib.style.display = 'none';
  }

  // Publish-fanerne er ikke med her: de er flyttet ned i panelets bundlinje, ved
  // siden af breddevælgeren — se ensureLpWidthPicker.
  const controls = {
    pages: doc.getElementById(COLLECTION_PICKER_ID)?.parentElement,
    globals: doc.getElementById(GLOBALS_PICKER_ID)?.parentElement,
  };

  // Hide/Auto/Show lives under the settings tab — the same tab that owns the
  // panel it controls.
  const modeGroup = doc.getElementById(LP_MODE_ID);
  const headerBg = lpHeaderBg(win) || 'rgba(0,0,0,.35)';

  if (modeGroup) {
    modeGroup.style.display = headerTab === 'settings' ? 'inline-flex' : 'none';
  }

  // A control whose tool is off stays hidden whatever the active tab is — its
  // icon is gone, so there would be no way back out of it.
  Object.entries(controls).forEach(([key, el]) => {
    if (el) {
      el.style.display = headerTab === key && headerTabAvailable(win, key) ? 'inline-flex' : 'none';
    }
  });

  // MERGED frames (Pages / Globals): one group surface for icon + controls.
  // Icon itself stays transparent so it doesn’t stack a second pill on top.
  FRAMED_TABS.forEach((key) => {
    const frame = doc.getElementById(frameId(key));
    const seam = doc.getElementById(seamId(key));
    const expanded = headerTab === key && headerTabAvailable(win, key);

    if (frame) {
      // Kun toolbar-gap mellem items — ingen ekstra margin når feltet er foldet ud.
      frame.style.margin = '0';

      if (MERGED_TABS.includes(key)) {
        frame.style.background = HEADER_SURFACE;
      }

      // Låsen sidder på feltet, ikke på glyffen inde i det. Sider og Globals bærer
      // deres flade på rammen, så da kun glyffen blev dæmpet, stod de to tilbage
      // som oplyste piller ved siden af et sektionsikon der var gået helt ud:
      // halvdelen af rækken så ud til stadig at kunne klikkes. Værktøjet er feltet,
      // så det er feltet der går ud.
      const locked = isSectionLibraryLocked(win) && FOCUS_LOCKED_TABS.includes(key);

      frame.style.opacity = locked ? LP_ICON_LOCKED_OPACITY : '';
      frame.style.pointerEvents = locked ? 'none' : '';
    }

    if (seam) {
      seam.style.display = expanded ? 'block' : 'none';
    }
  });

  // Det man trykker på, det der er valgt, og hver søm har topbarens farve. Sat her
  // og ikke der hvor de bygges, så et CP-temaskift rammer dem alle samtidig.
  // New-page bruger flat primary (ikke inset) — spring den over.
  doc.querySelectorAll('[data-sve-inset],[data-sve-seam]').forEach((el) => {
    if (el.id === NEW_ENTRY_ID) {
      return;
    }

    el.style.backgroundColor = headerBg;
  });

  const newEntry = doc.getElementById(NEW_ENTRY_ID);

  if (newEntry) {
    newEntry.style.background = LP_PRIMARY_FLAT;
    newEntry.style.color = '#fff';
    newEntry.style.border = 'none';
    newEntry.style.boxShadow = 'none';
    newEntry.style.opacity = '1';
  }

  // Each control sits directly after the icon it belongs to, so it reads as
  // connected to it. Guarded — moving a node on every call would trip the
  // observer that re-runs this into a loop.
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);
  const iconOf = (tab) => bar?.querySelector(`button[data-tab="${tab}"]`);
  const place = (anchor, el) => {
    if (anchor && el && anchor.nextElementSibling !== el) {
      anchor.after(el);
    }
  };

  // I de sammensatte felter sættes kontrollen efter sømmen, ikke efter ikonet —
  // ellers ville den lande foran stregen der skiller dem.
  const anchorFor = (key) => doc.getElementById(seamId(key)) || iconOf(key);

  place(anchorFor('settings'), modeGroup);
  place(anchorFor('pages'), controls.pages);
  place(anchorFor('globals'), controls.globals);

  // A tab whose "open" state is a panel on screen is lit by that panel, not by
  // the remembered tab. The tab outlives the panel — it is stored, so it survives
  // a reload, and a closed panel under a lit icon is the icon telling a lie about
  // what is in front of you.
  const docked = {
    sections: !!doc.getElementById(SECTION_PICKER_ID),
    outline: !!outlinePanel(doc),
  };

  // Only the icon buttons — the control groups now live inside the toolbar too,
  // and a bare querySelectorAll('button') would reach in and wipe the highlight
  // off Hide/Auto/Show and the tabs. `[data-tab]` er nok til at skelne, og
  // panelikonet ligger et niveau nede i sin egen ramme.
  syncToolbarIcons(doc);

  doc.getElementById(HEADER_TOOLBAR_ID)?.querySelectorAll('button[data-tab]').forEach((btn) => {
    const tab = btn.dataset.tab;
    const on = tab in docked ? docked[tab] : tab === headerTab;

    // One grey pill language everywhere. MERGED icons sit on the frame surface
    // (transparent). Standalone icons get HEADER_SURFACE. Idle = slight opacity.
    if (MERGED_TABS.includes(tab)) {
      btn.style.background = 'transparent';
    } else {
      btn.style.background = HEADER_SURFACE;
    }

    btn.style.color = 'currentColor';
    btn.style.border = 'none';
    btn.style.boxShadow = 'none';

    // Sets the opacity itself — a locked tool is dimmer than an idle one, and
    // brighter than nothing.
    paintFocusLockedTabs(win, btn, tab, on);
  });

  alignHeaderToolbarWithSidebar(win);
}

/**
 * Line the left top-bar icons up with the sidebar content (H tile, section rows,
 * tabs). Measure the content’s left edge and set header padding — more reliable
 * than shifting only the toolbar, which drifted when the mode group expanded.
 */
/** Whether this opening of the editor has already been sent into a section. */
let firstSectionOpened = false;

/**
 * The page-sections field's own wrapper in the editor panel.
 *
 * Found by walking up from any section to the last element before
 * `.publish-fields` — that container holds every field on the tab, so its child
 * is the outermost thing that is still only this field. Measured rather than
 * guessed at a class name: `replicator-fieldtype` is on the nested replicators
 * too, and hiding one of those would take a section's own blocks with it.
 */
function sectionsFieldWrapper(doc) {
  const editor = doc.querySelector('.live-preview-editor');
  const set = editor?.querySelector(SELECTORS.replicatorSet);

  if (!set) {
    return null;
  }

  let node = set;

  while (node.parentElement && !node.parentElement.classList?.contains('publish-fields')) {
    node = node.parentElement;

    if (node === editor) {
      return null; // no publish-fields on the way up — not the shape we expect
    }
  }

  return node.parentElement ? node : null;
}

/**
 * Takes the list of every section out of the sidebar.
 *
 * Only while nothing is open: a section's fields render inside this same
 * wrapper, so hiding it whenever the flag is on would hide the section you are
 * editing along with the list of the ones you are not.
 */
function applySectionsFieldVisibility(win) {
  const doc = win.document;
  const wrapper = sectionsFieldWrapper(doc);

  if (!wrapper) {
    return;
  }

  const hide =
    featureOn(win, 'open_first_section')
    && focusPanelOn(win)
    && !doc.querySelector(`[${SOLO_KEEP_ATTR}], [${SOLO_PARENT_ATTR}]`);

  wrapper.style.display = hide ? 'none' : '';
}

/**
 * Opens the entry in its first section rather than on the list of all of them.
 *
 * Off unless the site asks for it (Addons → Visual Editor). Where the work
 * begins is a matter of how a team uses the editor: a page of three sections is
 * quicker from the list, a page of twenty is not.
 *
 * Once per opening, and never over a choice already made — a click that arrives
 * before this runs is the editor's answer to where you want to be, and it wins.
 */
function openFirstSectionOnce(win) {
  const doc = win.document;
  const editor = doc.querySelector('.live-preview-editor');

  // The editor is gone, so this is between openings: arm it for the next one.
  if (!editor) {
    firstSectionOpened = false;

    return;
  }

  if (firstSectionOpened || !featureOn(win, 'open_first_section') || !focusPanelOn(win)) {
    return;
  }

  // Something is already soloed — a click got here first, and it says more about
  // where the author wants to be than a default does.
  if (doc.querySelector(`[${SOLO_KEEP_ATTR}], [${SOLO_PARENT_ATTR}]`)) {
    firstSectionOpened = true;

    return;
  }

  const field = sectionField(win);

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);
    const rows = values && typeof values === 'object' ? values[field] : null;

    if (!Array.isArray(rows)) {
      continue;
    }

    // A page with no sections has nothing to open onto, and an empty panel is
    // worse than none — so it starts closed and the preview has the window to
    // itself until there is something to edit.
    if (!rows.length) {
      firstSectionOpened = true;
      setLpMode(win, 'hide');

      return;
    }

    // The values arrive before the form that draws them. Soloing then hides a
    // list of sets that do not exist yet and leaves the panel blank — which is
    // exactly what it did. This runs again on every pass of the header loop, so
    // declining now costs a frame and nothing else.
    if (!editor.querySelector(SELECTORS.replicatorSet)) {
      return;
    }

    const uid = blockRowUid(rows[0]);

    if (!uid) {
      return;
    }

    firstSectionOpened = true;
    focusFromPreview(uid, doc, win);

    return;
  }
}

/** When the panel was last moved off the sections tab — see openSettingsTab. */
let settingsTabPressedAt = 0;

/** Presses in a row that didn't take. Cleared the moment one does. */
let settingsTabTries = 0;

/**
 * With nothing open in the panel, keeps it off the sections tab.
 *
 * The first publish tab holds the page sections, and those are edited on the page
 * itself — where the site opens straight into its first section, the list is even
 * taken out of the panel, which is what leaves the tab empty. So with nothing
 * selected in the preview, that tab is a blank column where the page's own
 * settings should be. Moving on one tab is what stops the panel from being empty.
 *
 * Not once per opening but on every pass of the header loop: "nothing is
 * selected" is a state the editor returns to — closing a section, stepping out of
 * the header, arriving on another page — and the panel should be useful every
 * time it does, not only the first.
 */
function openSettingsTab(win) {
  const doc = win.document;

  if (!doc.querySelector('.live-preview-editor')) {
    settingsTabTries = 0;

    return;
  }

  // The one thing that counts as "something is selected": a section or a block
  // isolated in the panel. Its fields are on the first tab, so this must never
  // pull the panel off it while one is open.
  //
  // Nothing else is asked about. An earlier version also stood down for the
  // header, the footer and the globals panel, and that was simply wrong: the
  // globals panel is built and parked off screen the moment Live Preview opens,
  // so its element is always in the document and the rule never ran once.
  if (soloUid !== null || doc.querySelector(`[${SOLO_KEEP_ATTR}], [${SOLO_PARENT_ATTR}]`)) {
    settingsTabTries = 0; // closing this again is a fresh question, not a retry

    return;
  }

  const tabs = nativeTabButtons(doc);

  // The form hasn't drawn its tabs yet, or the blueprint has only the one and
  // there is nowhere to move on to.
  if (tabs.length < 2) {
    return;
  }

  // Off the sections tab already — which is the whole point, so there is nothing
  // to do and nothing to keep counting.
  if (tabs[0].getAttribute('aria-selected') !== 'true') {
    settingsTabTries = 0;

    return;
  }

  // This runs on every pass of the header loop, so a press that doesn't take
  // would have us pressing again on every mutation. Slowed to one attempt per
  // half second, and given up on after three: if the tab won't move, something
  // else is holding it and a click every half second forever is worse than
  // leaving it where it is.
  const now = Date.now();

  if (settingsTabTries >= 3 || now - settingsTabPressedAt < 500) {
    return;
  }

  settingsTabPressedAt = now;
  settingsTabTries += 1;

  fireTabClick(win, 1);
  setTimeout(() => ensureSettingsTabs(win), 60); // light the tab we just moved to
}

/**
 * Hand the field column back to the page, and let it land somewhere real.
 *
 * Stepping out of a header, a footer or a global section leaves the page's own
 * form with nothing isolated — and where the site opens straight into its first
 * section, the list of all of them is hidden while nothing is, so what is left is
 * a blank column. Arming the flag again is the whole fix: the next pass of the
 * header loop treats leaving exactly like an opening, which means the first
 * section, or a closed panel on a page that has none.
 *
 * Deliberately not a focus call of its own. Leaving and opening are the same
 * question — "where does the editor start?" — and answering it twice is how the
 * two drift apart.
 */
function rearmFirstSection() {
  firstSectionOpened = false;
}


/**
 * Writes the starting values a template declared for a block, where the block
 * has none.
 *
 * `controls="tag:h2|font_size:text-600"` says what this *place* on the page
 * starts a block on. The toolbar has always drawn itself from that; the side
 * panel could not, because it renders the Statamic form and the form has never
 * seen the template. So the value is made real instead of pretended: written
 * once, and from then on it is simply the block's value, which is why all three
 * — form, toolbar and page — agree about it afterwards.
 *
 * Only ever into an empty field. A block that already says something keeps
 * saying it; nothing that exists is replaced. That is also what makes this safe
 * to run on every click rather than only on the first.
 *
 * It marks the entry dirty, which is honest: the block now holds a value it did
 * not hold before, and it should be saved.
 */
function applyDeclaredDefaults(data, doc) {
  const declared = Array.isArray(data.controlDefaults) ? data.controlDefaults : [];
  const uid = data.scope || data.uid;

  if (!declared.length || !uid) {
    return;
  }

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows } = found;
    const row = rows[index];

    if (!row) {
      return;
    }

    const blank = (v) => v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length);
    const missing = declared.filter((c) => blank(row[c.handle]));

    if (!missing.length) {
      return;
    }

    const next = JSON.parse(JSON.stringify(rows));

    // The declaration is text — `controls="uppercase:true"` cannot say what type
    // it means. A toggle wants a real boolean, and would store the string
    // "false" as a truthy value, which is the one wrong answer that looks right.
    const typed = (v) => (v === 'true' ? true : v === 'false' ? false : v);

    missing.forEach((c) => {
      next[index][c.handle] = typed(c.default);
    });

    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * Luften fra vinduets venstrekant ind til det første ikon i topbaren.
 *
 * Et fast mål, og det er hele pointen: den gamle vej målte sig frem til
 * panelets øverste indhold, og det indhold er ikke det samme fra gang til gang.
 * Med en sektion valgt er det blokkens kort — som ligger inde i sit eget kort og
 * derfor længere inde — og uden er det sektionslisten. Luften ud til vinduets
 * kant sprang derfor, alt efter hvad man lige havde klikket på.
 *
 * `1.75rem` er Statamics egen `padding-inline-start` på live-preview-headeren,
 * altså den plads etiketten "Live Preview" stod på, før den blev skjult.
 *
 * `null` = den gamle opførsel: mål panelets indhold og læg ikonerne på linje med
 * det. Koden nedenfor står urørt, så den vej er ét ord væk.
 */
const LP_TOOLBAR_LEFT = '1.75rem';

function alignHeaderToolbarWithSidebar(win) {
  const doc = win.document;
  const header = lpHeader(doc);
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);
  const editor = doc.querySelector('.live-preview-editor');

  if (!header || !bar || !editor) {
    return;
  }

  // Et fast mål frem for en måling — se LP_TOOLBAR_LEFT. Sat før alle guards
  // nedenfor, så luften også står når panelet er væk eller kørt ud af skærmen.
  if (LP_TOOLBAR_LEFT !== null) {
    if (header.style.paddingLeft !== LP_TOOLBAR_LEFT) {
      header.style.paddingLeft = LP_TOOLBAR_LEFT;
    }

    return;
  }

  // Panel off-screen (Hide) — don’t chase a bogus left edge.
  const editorRect = editor.getBoundingClientRect();

  if (editorRect.width < 40 || editorRect.left < -500) {
    return;
  }

  const candidates = [
    doc.querySelector('[data-sve-focus-tile]'),
    doc.querySelector('[data-sve-section-track]'),
    editor.querySelector('.replicator-set'),
    editor.querySelector('[data-sve-solo-back], [data-sve-focus-head]'),
  ].filter((el) => el && el.getClientRects().length);

  let targetLeft = null;

  if (candidates.length) {
    targetLeft = Math.min(...candidates.map((el) => el.getBoundingClientRect().left));
  } else {
    const pad = parseFloat(win.getComputedStyle(editor).paddingLeft) || 0;

    targetLeft = editorRect.left + pad;
  }

  if (targetLeft == null) {
    return;
  }

  // Drop the old margin approach so we don’t double-offset.
  if (bar.style.marginLeft) {
    bar.style.marginLeft = '';
  }

  const barLeft = bar.getBoundingClientRect().left;
  const delta = targetLeft - barLeft;

  if (Math.abs(delta) < 0.5) {
    return;
  }

  const computed = parseFloat(win.getComputedStyle(header).paddingLeft) || 0;
  const current = header.style.paddingLeft ? parseFloat(header.style.paddingLeft) || 0 : computed;
  const next = Math.max(0, Math.round(current + delta));

  if (Math.abs(next - current) >= 0.5) {
    header.style.paddingLeft = `${next}px`;
  }
}

// --- Grid rows: collapse to a title, one open at a time ------------------------
//
// Statamic's Grid (stacked) shows every row's fields in full, which eats the
// editor panel when a grid has several rows. This turns each row into an
// accordion item — the header collapses to a one-line title (the first field's
// value), and opening one closes the others — the way the Replicator already
// behaves. Rows are Statamic's own DOM: a `.grid-stacked > <panel>` with a
// `<header>` (drag handle + duplicate/delete) and a fields body beside it. We
// only mark and toggle; Vue keeps owning the DOM.

const GRID_ROW_ATTR = 'data-sve-grid-row';
const GRID_COLLAPSED_ATTR = 'data-sve-grid-collapsed';
const GRID_DONE_ATTR = 'data-sve-grid-done';
const GRID_STYLE_ID = 'sve-grid-accordion-style';

function ensureGridStyle(doc) {
  if (doc.getElementById(GRID_STYLE_ID)) {
    return;
  }

  const style = doc.createElement('style');

  style.id = GRID_STYLE_ID;
  style.textContent = `
    [${GRID_ROW_ATTR}] > header { cursor: pointer; }
    [${GRID_ROW_ATTR}][${GRID_COLLAPSED_ATTR}] > *:not(header) { display: none !important; }
    [${GRID_ROW_ATTR}][${GRID_COLLAPSED_ATTR}] > header { border-bottom-color: transparent; }
    .sve-grid-title {
      flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      font-size: 13px; font-weight: 500; opacity: .7; padding: 0 10px; pointer-events: none;
    }
    [${GRID_ROW_ATTR}]:not([${GRID_COLLAPSED_ATTR}]) .sve-grid-title { opacity: 0; }
    .sve-grid-chevron {
      flex: 0 0 auto; width: 14px; height: 14px; opacity: .5; transition: transform .15s;
      pointer-events: none; margin-left: 4px;
    }
    [${GRID_ROW_ATTR}][${GRID_COLLAPSED_ATTR}] .sve-grid-chevron { transform: rotate(-90deg); }
  `;
  doc.head.appendChild(style);
}

/** Prefer text / textarea / Bard — skip icons, assets, empty controls, etc. */
const GRID_TITLE_SKIP = [
  'assets-fieldtype',
  'button_group-fieldtype',
  'button-group-fieldtype',
  'toggle-fieldtype',
  'revealer-fieldtype',
  'date-fieldtype',
  'integer-fieldtype',
  'float-fieldtype',
  'range-fieldtype',
  'color-fieldtype',
  'auto_uuid-fieldtype',
  'iconamic-fieldtype',
  'iconify-fieldtype',
  'link-fieldtype',
  'section-fieldtype',
  'spacer-fieldtype',
  'hidden-fieldtype',
];

/**
 * Collapsed-row label: first non-empty text, textarea or Bard value.
 * (The previous "first input" approach hit empty icon fields and showed "—".)
 */
function gridRowTitle(row) {
  try {
    const fields = row.querySelectorAll('.publish-fields input, .publish-fields textarea');

    for (const field of fields) {
      const type = (
        field.getAttribute('type') ||
        (field.tagName === 'TEXTAREA' ? 'textarea' : 'text')
      ).toLowerCase();

      if (!['text', 'search', 'url', 'email', 'tel', 'textarea'].includes(type)) {
        continue;
      }

      const wrapper = field.closest('[class*="-fieldtype"]');

      if (wrapper && GRID_TITLE_SKIP.some((name) => wrapper.classList.contains(name))) {
        continue;
      }

      const value = (field.value || '').replace(/\s+/g, ' ').trim();

      if (value) {
        return value.length > 80 ? `${value.slice(0, 77)}…` : value;
      }
    }

    for (const editable of row.querySelectorAll(
      '.publish-fields .ProseMirror, .publish-fields [contenteditable="true"]',
    )) {
      const value = (editable.textContent || '').replace(/\s+/g, ' ').trim();

      if (value) {
        return value.length > 80 ? `${value.slice(0, 77)}…` : value;
      }
    }
  } catch {
    // never break Live Preview over a label scrape
  }

  return '—';
}

function setGridRowCollapsed(row, collapsed) {
  if (collapsed) {
    row.setAttribute(GRID_COLLAPSED_ATTR, '');
  } else {
    row.removeAttribute(GRID_COLLAPSED_ATTR);
  }

  const title = row.querySelector(':scope > header .sve-grid-title');

  if (!title) {
    return;
  }

  // Only write when the text actually changes — writing on every LP mutation
  // observer pass caused an infinite loop and froze Live Preview.
  const next = collapsed ? gridRowTitle(row) : '';

  if (title.textContent !== next) {
    title.textContent = next;
  }
}

/** True for a real Grid stacked row panel — it carries a header of its own. */
function isGridRow(el) {
  return el.matches('div') && !!el.querySelector(':scope > header');
}

function enhanceGridRow(win, row, stacked) {
  if (row.hasAttribute(GRID_ROW_ATTR)) {
    return;
  }

  const header = row.querySelector(':scope > header');

  if (!header) {
    return;
  }

  row.setAttribute(GRID_ROW_ATTR, '');

  const doc = win.document;
  const title = doc.createElement('span');

  title.className = 'sve-grid-title';

  const chevron = doc.createElement('span');

  chevron.className = 'sve-grid-chevron';
  chevron.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;">' +
    '<polyline points="6 9 12 15 18 9"></polyline></svg>';

  // Title fills the middle of the header; the chevron sits at the far end. The
  // drag handle stays first, the duplicate/delete buttons stay last.
  const firstButton = header.querySelector(':scope > button');

  if (firstButton && firstButton.nextSibling) {
    header.insertBefore(title, firstButton.nextSibling);
  } else {
    header.appendChild(title);
  }

  header.appendChild(chevron);

  header.addEventListener('click', (event) => {
    // The drag handle and the duplicate/delete buttons keep their own jobs.
    if (event.target.closest('button')) {
      return;
    }

    const opening = row.hasAttribute(GRID_COLLAPSED_ATTR);

    if (opening) {
      [...stacked.children].forEach((sibling) => {
        if (sibling !== row && sibling.hasAttribute(GRID_ROW_ATTR)) {
          setGridRowCollapsed(sibling, true);
        }
      });
    }

    setGridRowCollapsed(row, !opening);
  });

  // Rows start collapsed; the grid opens its first one below. Set once, so a
  // later re-render never fights the state the user has clicked into.
  setGridRowCollapsed(row, true);

  // Vue often fills Title a beat later. One quiet retry only if still "—",
  // and only if the text would change (avoids mutation-observer loops).
  win.setTimeout(() => {
    if (!row.isConnected || !row.hasAttribute(GRID_COLLAPSED_ATTR)) {
      return;
    }

    const label = row.querySelector(':scope > header .sve-grid-title');

    if (!label || label.textContent !== '—') {
      return;
    }

    const next = gridRowTitle(row);

    if (next !== '—' && label.textContent !== next) {
      label.textContent = next;
    }
  }, 500);
}

/**
 * Turns every Grid (stacked) in the editor panel into an accordion. Runs on each
 * LP re-render; already-enhanced rows are skipped, so user-chosen open/closed
 * states survive. A freshly seen grid starts with only its first row open.
 */
function enhanceGrids(win) {
  const doc = win.document;
  const editor = doc.querySelector('.live-preview-editor');

  if (!editor) {
    return;
  }

  ensureGridStyle(doc);

  editor.querySelectorAll('.grid-stacked').forEach((stacked) => {
    const rows = [...stacked.children].filter((el) => isGridRow(el));

    if (!rows.length) {
      return;
    }

    // enhanceGridRow starts each row collapsed (once). New rows added later
    // therefore arrive collapsed without disturbing the rows already on screen.
    rows.forEach((row) => enhanceGridRow(win, row, stacked));

    // A grid seen for the first time opens its first row, so it isn't a wall of
    // closed headers — but only if the user hasn't already opened one.
    if (!stacked.hasAttribute(GRID_DONE_ATTR)) {
      stacked.setAttribute(GRID_DONE_ATTR, '');

      if (!rows.some((row) => !row.hasAttribute(GRID_COLLAPSED_ATTR))) {
        setGridRowCollapsed(rows[0], false);
      }
    }
  });
}

const LP_BACK_ID = '__sve-lp-back';

/** How long to wait for a save to come back before giving the button up again. */
const LP_SAVE_TIMEOUT = 15000;

/**
 * Leaving the editor publishes what you changed. Clicking Statamic's own
 * save/publish buttons rather than posting to the API ourselves, so validation,
 * revisions and everything else behave exactly as they do from the CP.
 *
 * Revisions off → one click on "Save & Publish" (unchanged).
 * Revisions on  → save the working copy, then POST publish automatically (no
 * Publish dialog), then leave.
 *
 * Pass `{ publish: false }` to only save the working copy and stay in the editor.
 *
 * Nothing changed → leave straight away (unless save-only). A save that fails
 * puts the button back and keeps you in the editor, where the error is.
 */
function leaveEditor(win, link, leave, { publish = true } = {}) {
  if (link.dataset.busy) {
    return;
  }

  const save = saveButtonIn(win.document);
  const hasPublish = !!publishButtonIn(win.document);
  const saveOnly = hasPublish && !publish;
  const entryDirty = hasUnsavedChanges(win);
  const globalsDirty = hasUnsavedGlobals(win);
  const sectionDirty = hasUnsavedGlobalSection(win);

  if (!save && !globalsDirty && !sectionDirty) {
    if (!saveOnly) {
      leave();
    }

    return;
  }

  if (!entryDirty && !globalsDirty && !sectionDirty) {
    if (saveOnly) {
      return;
    }

    // Nothing to write — just leave. Do NOT auto-publish a clean working copy;
    // that trapped users on "Saving…" when dirty detection was sticky, and it
    // showed save/publish actions when the form had no real edits.
    leave();

    return;
  }

  runBusy(win, link, (release, setLabel) => {
    setLabel(t(win, 'saving'));

    if (!saveOnly) {
      postToHost(win, 'lp-leaving');
    }

    const finishAfterEntry = (ok) => {
      if (!ok) {
        release();

        return;
      }

      if (saveOnly) {
        release();
      } else {
        leaveQuietly(win, leave);
      }
    };

    const saveEntry = () => {
      if (!entryDirty || !save) {
        finishAfterEntry(true);

        return;
      }

      let settled = false;

      const stop = onEntrySave((ok) => {
        if (settled) {
          return;
        }

        // Revisions off, or save-only: one step.
        if (!hasPublish || saveOnly) {
          settled = true;
          stop();
          clearTimeout(timer);
          finishAfterEntry(ok);

          return;
        }

        // Revisions on + publish: working-copy save done — publish without a dialog.
        settled = true;
        stop();
        clearTimeout(timer);

        if (!ok) {
          release();

          return;
        }

        // Save just succeeded — refresh the clean baseline so leave isn't
        // blocked by sticky $dirty, and value-diff matches the saved form.
        markEntryFormClean(win);

        publishWorkingCopy(win, {
          onSuccess: () => leaveQuietly(win, leave),
          onFailure: release,
          onPublishing: () => setLabel(t(win, 'publishing')),
          afterSave: true,
        });
      });

      const timer = setTimeout(() => {
        if (settled) {
          return;
        }

        settled = true;
        stop();
        release();
      }, LP_SAVE_TIMEOUT);

      save.click();
    };

    // Theme Settings / global section first — entry save can navigate away.
    saveGlobalsPanel(win, (ok) => {
      if (!ok) {
        release();

        return;
      }

      saveGlobalSectionPanel(win, (sectionOk) => {
        if (!sectionOk) {
          release();

          return;
        }

        saveEntry();
      });
    });
  });
}

/** Marks the back-pill busy, runs `work`, and gives it release/setLabel helpers. */
function runBusy(win, link, work) {
  const label = link.querySelector('span');
  const original = label?.textContent;

  link.dataset.busy = '1';
  link.style.pointerEvents = 'none';
  link.style.opacity = '.5';

  const setLabel = (text) => {
    if (label) {
      label.textContent = text;
    }
  };

  const release = () => {
    delete link.dataset.busy;
    link.style.pointerEvents = '';
    link.style.opacity = '.8';

    if (label && original) {
      label.textContent = original;
    }

    link.sveCollapse?.();
  };

  work(release, setLabel);
}

/**
 * Statamic's publish endpoint for the open entry — same URL the Publish dialog
 * posts to (`…/entries/{id}/publish`).
 */
function entryPublishUrl(win) {
  return `${win.location.pathname.replace(/\/$/, '')}/publish`;
}

/**
 * Publish the working copy with no dialog — the same POST Statamic's "Publish
 * Now" makes, minus the notes field.
 *
 * Waits until the Publish button is enabled so we never race the preceding
 * Save Changes. Pass `afterSave: true` when the working copy was just written
 * — then skip the dirty-form wait (sticky $dirty used to block leave forever).
 */
function publishWorkingCopy(win, { onSuccess, onFailure, onPublishing, afterSave = false } = {}) {
  let settled = false;
  let enableTimer = null;
  let attempts = 0;

  const finish = (ok) => {
    if (settled) {
      return;
    }

    settled = true;
    clearTimeout(enableTimer);
    clearTimeout(timer);
    (ok ? onSuccess : onFailure)?.();
  };

  const tryPublish = () => {
    if (settled) {
      return;
    }

    const button = publishButtonIn(win.document);
    // After an explicit save we already cleared dirty marks — only wait for the
    // Publish button to enable (Statamic may still be finishing its UI update).
    const blocked = afterSave
      ? button?.disabled === true
      : hasUnsavedChanges(win) || button?.disabled === true;

    if (blocked) {
      if (++attempts > 50) {
        // Don't trap the user on "Saving…": after a successful save, leave even
        // if Publish never lit up; otherwise report failure.
        finish(!!afterSave);

        return;
      }

      enableTimer = win.setTimeout(tryPublish, 100);

      return;
    }

    onPublishing?.();

    const rearm = disarmUnloadWarning(win);

    win
      .fetch(entryPublishUrl(win), {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-CSRF-TOKEN': csrfToken(win),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ message: null }),
      })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        const ok = response.ok && data.saved !== false;

        if (!ok) {
          rearm();
        }

        finish(ok);
      })
      .catch(() => {
        rearm();
        finish(false);
      });
  };

  const timer = win.setTimeout(() => finish(false), LP_SAVE_TIMEOUT);

  tryPublish();
}

/**
 * Close Live Preview — replaces Statamic’s ×. Same leave flow as before
 * (save/publish menu when dirty). Styled like the left icon pills so the whole
 * bar shares one height and surface.
 */
const LP_BACK_MENU_ID = '__sve-lp-back-menu';

const LP_BACK_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';

let lpCloseHideObserver = null;

function isOurLpChromeButton(button) {
  return (
    !button ||
    button.id === LP_BACK_ID ||
    !!button.closest?.(`#${LP_BACK_ID}`) ||
    !!button.closest?.(`#${HEADER_TOOLBAR_ID}`) ||
    !!button.closest?.(`#${LP_PREVIEW_CHROME_ID}`) ||
    !!button.closest?.(`#${LP_MODE_ID}`)
  );
}

/** True for Statamic’s Live Preview exit (×) — not Save / devices / our close. */
function isStatamicLpCloseButton(button) {
  if (isOurLpChromeButton(button)) {
    return false;
  }

  const label = `${button.getAttribute('aria-label') || ''} ${button.title || ''} ${button.textContent || ''}`.trim();

  if (/\b(save|gem|publish|publicér|visit|besøg|pop\s*out|pop\s*ud)\b/i.test(label)) {
    return false;
  }

  if (/\b(close|luk|exit|afslut)\b/i.test(label)) {
    return true;
  }

  const text = (button.textContent || '').replace(/\s+/g, '').trim();
  const html = button.innerHTML || '';

  // Lucide / Heroicons “X” paths, or a bare × glyph.
  if (
    button.querySelector('svg') &&
    (text === '' || text === '×' || text === '✕' || text === 'x' || text === 'X') &&
    (/M18\s*6|m6\s*6\s*12\s*12|M6\s*6\s*L18|line\s+x1=["']18["']/i.test(html) ||
      text === '×' ||
      text === '✕' ||
      text === 'x' ||
      text === 'X')
  ) {
    return true;
  }

  return text === '×' || text === '✕';
}

/** Statamic’s header close (×) — kept in the DOM so leaveLivePreview can click it. */
function findLpCloseButton(header) {
  if (!header) {
    return null;
  }

  const marked = header.querySelector('[data-sve-statamic-lp-close]');

  if (marked) {
    return marked;
  }

  const candidates = collectStatamicLpCloseButtons(header);

  return candidates[candidates.length - 1] || null;
}

function collectStatamicLpCloseButtons(header) {
  if (!header) {
    return [];
  }

  const save = findLpSaveButton(header);
  const scope =
    header.closest('.live-preview, [data-live-preview], .live-preview-ui') || header;
  const buttons = [...scope.querySelectorAll('button')].filter((button) => !isOurLpChromeButton(button));

  return buttons.filter((button) => {
    // Prefer buttons after Save & Publish — that is where Statamic puts ×.
    if (save && header.contains(button)) {
      const afterSave = !!(save.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING);

      if (!afterSave && !isStatamicLpCloseButton(button)) {
        return false;
      }
    }

    return isStatamicLpCloseButton(button);
  });
}

function markStatamicLpCloseHidden(close) {
  if (!close || close.id === LP_BACK_ID) {
    return;
  }

  close.setAttribute('data-sve-statamic-lp-close', '');
  close.classList.add('sve-off');
  close.style.setProperty('display', 'none', 'important');
  close.style.setProperty('visibility', 'hidden', 'important');
  close.style.setProperty('pointer-events', 'none', 'important');
  close.style.setProperty('width', '0', 'important');
  close.style.setProperty('min-width', '0', 'important');
  close.style.setProperty('height', '0', 'important');
  close.style.setProperty('padding', '0', 'important');
  close.style.setProperty('margin', '0', 'important');
  close.style.setProperty('margin-left', '0', 'important');
  close.style.setProperty('margin-right', '0', 'important');
  close.style.setProperty('flex', '0 0 0', 'important');
  close.style.setProperty('overflow', 'hidden', 'important');
  close.setAttribute('aria-hidden', 'true');
  close.tabIndex = -1;
}

function hideStatamicLpClose(header) {
  if (!header) {
    return;
  }

  // Hide every match — Vue sometimes leaves a duplicate, and a single miss
  // is exactly the “× only goes away after I click a section” bug.
  collectStatamicLpCloseButtons(header).forEach(markStatamicLpCloseHidden);

  // Fallback: last icon button in the header after Save (even without a label).
  const save = findLpSaveButton(header);

  if (!save) {
    return;
  }

  [...header.querySelectorAll('button')]
    .filter((button) => !isOurLpChromeButton(button))
    .filter((button) => !!(save.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING))
    .filter((button) => {
      const text = (button.textContent || '').replace(/\s+/g, '').trim();

      return (text === '' || text === '×' || text === '✕') && button.querySelector('svg');
    })
    .forEach(markStatamicLpCloseHidden);
}

/** Keep Statamic’s × gone across Vue re-renders of the Live Preview header. */
function watchStatamicLpClose(win) {
  const header = lpHeader(win.document);

  if (!header) {
    lpCloseHideObserver?.disconnect();
    lpCloseHideObserver = null;

    return;
  }

  hideStatamicLpClose(header);

  if (lpCloseHideObserver) {
    return;
  }

  let scheduled = false;

  lpCloseHideObserver = new win.MutationObserver(() => {
    if (scheduled) {
      return;
    }

    scheduled = true;
    win.requestAnimationFrame(() => {
      scheduled = false;
      const live = lpHeader(win.document);

      if (!live) {
        lpCloseHideObserver?.disconnect();
        lpCloseHideObserver = null;

        return;
      }

      hideStatamicLpClose(live);
    });
  });

  lpCloseHideObserver.observe(header, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'hidden'],
  });
}

/**
 * Keep the back control after Save & Publish (where × sat). No floating geometry —
 * the preview no longer needs to dodge a pill over the canvas.
 */
function positionLpBackButton(win) {
  const doc = win.document;
  const pill = doc.getElementById(LP_BACK_ID);
  const header = lpHeader(doc);

  if (!pill || !header) {
    return;
  }

  hideStatamicLpClose(header);

  const save = findLpSaveButton(header);

  if (save && pill.previousElementSibling !== save) {
    save.after(pill);
  } else if (!save && pill.parentElement !== header) {
    header.appendChild(pill);
  }

  // Clear any leftover floating styles from older builds.
  ['position', 'top', 'right', 'bottom', 'left', 'box-shadow', 'padding'].forEach((prop) => {
    if (pill.style.getPropertyValue(prop)) {
      pill.style.removeProperty(prop);
    }
  });

  syncLpRightBarGaps(win);
  tellPreviewWherePillIs(win, pill);
}

/**
 * Hands the preview the pill's box. When the control lives in the header it does
 * not overlap the iframe — send an empty box so hover chrome stops dodging.
 */
function tellPreviewWherePillIs(win, pill) {
  const frame = previewFrame(win.document);

  if (!frame) {
    return;
  }

  if (!pill) {
    sendToPreview(
      { source: 'statamic-visual-editor', type: 'sve-pill-box', bottom: 0, left: 99999 },
      win
    );

    return;
  }

  const f = frame.getBoundingClientRect();
  const r = pill.getBoundingClientRect();
  const overlaps =
    r.bottom > f.top && r.top < f.bottom && r.right > f.left && r.left < f.right;

  if (!overlaps) {
    sendToPreview(
      { source: 'statamic-visual-editor', type: 'sve-pill-box', bottom: 0, left: 99999 },
      win
    );

    return;
  }

  sendToPreview(
    {
      source: 'statamic-visual-editor',
      type: 'sve-pill-box',
      bottom: Math.round(r.bottom - f.top),
      left: Math.round(r.left - f.left),
    },
    win
  );
}

/** Tear down the back control (and its menu) when Live Preview closes. */
function removeLpBackButton(doc) {
  doc.getElementById(LP_BACK_MENU_ID)?.remove();
  doc.getElementById(LP_BACK_ID)?.remove();
  clearEntryBaseline();
}

/**
 * Close control — return to the live site when embedded, or close Live Preview
 * when opened from the dashboard. Icon sits in the top bar after Save & Publish.
 */
function ensureLpBackButton(win) {
  const doc = win.document;
  const header = lpHeader(doc);

  if (!header) {
    return;
  }

  hideStatamicLpClose(header);

  const embedded = isEmbeddedInSite(win);
  const visit = [...doc.querySelectorAll('a')].find((a) => /visit url|besøg url/i.test(a.textContent || ''));
  const href = visit?.getAttribute('href');
  let pill = doc.getElementById(LP_BACK_ID);

  if (!pill) {
    pill = doc.createElement('button');
    pill.id = LP_BACK_ID;
    pill.type = 'button';
    pill.style.cssText = `${LP_ICON_BTN_STYLE}flex-shrink:0;`;

    const leave = () => leaveLivePreview(win, href || null);

    pill.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (doc.getElementById(LP_BACK_MENU_ID)) {
        doc.getElementById(LP_BACK_MENU_ID).remove();

        return;
      }

      // Nothing changed → leave immediately. No save/publish menu.
      if (!hasUnsavedWork(win)) {
        leave();

        return;
      }

      // Dirty, but nowhere to save it from (no entry Save, no globals/section) → leave.
      if (!saveButtonIn(doc) && !hasUnsavedGlobals(win) && !hasUnsavedGlobalSection(win)) {
        leave();

        return;
      }

      openLpBackMenu(win, pill, leave);
    });

    header.appendChild(pill);
  }

  // Keep icon current across builds (curved arrow → ×).
  if (pill.innerHTML !== LP_BACK_ICON_SVG) {
    pill.innerHTML = LP_BACK_ICON_SVG;
  }

  pill.title = t(win, embedded ? 'back_to_site_title' : 'close_live_preview_title');
  pill.setAttribute('aria-label', pill.title);
  pill.style.opacity = LP_ICON_IDLE_OPACITY;
  pill.style.background = HEADER_SURFACE;
  pill.style.width = `${LP_CHROME_H}px`;
  pill.style.height = `${LP_CHROME_H}px`;
  pill.style.borderRadius = '.5rem';
  pill.style.marginLeft = '0';
  pill.style.marginRight = '0';

  positionLpBackButton(win);
  scheduleEntryBaseline(win);
}

/**
 * Leave Live Preview the way you entered it:
 * - Embedded → close overlay onto the entry's front-end URL.
 * - Opened from a listing → back to that listing.
 * - Otherwise → close Live Preview and stay in admin.
 */
function leaveLivePreview(win, fallbackUrl = null) {
  if (isEmbeddedInSite(win)) {
    const visitNow = [...win.document.querySelectorAll('a')].find((a) =>
      /visit url|besøg url/i.test(a.textContent || '')
    );
    const url = visitNow?.getAttribute('href') || fallbackUrl || null;

    postToHost(win, 'lp-close', url ? { url } : {});

    return;
  }

  // Never reached the publish form on the way in, so it is not somewhere to be
  // put down on the way out: the way back is the list the entry was clicked in.
  const origin = originForCurrentEntry(win);

  if (origin) {
    forgetOrigin(win);
    leaveToOrigin(win, origin);

    return;
  }

  closeLivePreviewUi(win);
}

/**
 * Back to the screen the entry was opened from.
 *
 * By the time this runs the unsaved question has been put and answered — every
 * path into `leave()` does that first — so the only thing left in the way is
 * Statamic's own guard, which is still holding the marks it was answered about.
 */
function leaveToOrigin(win, url) {
  const router = win.__STATAMIC__?.inertia?.router;

  dismissDirtyWarning(win);

  if (!router?.visit) {
    win.location.href = url;

    return;
  }

  router.visit(url);
}

/** Click Statamic's Live Preview × so we stay on the admin entry form. */
function closeLivePreviewUi(win) {
  const header = lpHeader(win.document);
  const close = findLpCloseButton(header);

  // Settling on the form is an answer to "where does this end", so a later × on
  // a preview reopened by hand should not still be pointing at a listing.
  forgetOrigin(win);

  // Temporarily reveal so .click() works even while we keep × hidden in the UI.
  if (close) {
    const wasHidden = close.style.getPropertyValue('display') === 'none';

    if (wasHidden) {
      close.style.removeProperty('display');
    }

    close.click();

    if (wasHidden) {
      close.style.setProperty('display', 'none', 'important');
    }
  }
}

/** Ways out when there are unsaved changes (revisions → three choices). */
function openLpBackMenu(win, pill, leave) {
  const doc = win.document;
  const menu = doc.createElement('div');
  const rect = pill.getBoundingClientRect();
  const revisions = !!publishButtonIn(doc);
  const embedded = isEmbeddedInSite(win);

  menu.id = LP_BACK_MENU_ID;
  menu.style.cssText =
    `position:fixed;z-index:2147483001;top:${Math.round(rect.bottom + 8)}px;` +
    `right:${Math.round(win.innerWidth - rect.right)}px;min-width:220px;` +
    'display:flex;flex-direction:column;padding:5px;border-radius:10px;background:#18181b;' +
    'box-shadow:0 12px 32px rgba(0,0,0,.4);font:500 13px/1.2 ui-sans-serif,system-ui,sans-serif;';

  const item = (label, onClick, primary) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = label;
    btn.style.cssText =
      'all:unset;cursor:pointer;padding:9px 12px;border-radius:7px;white-space:nowrap;' +
      (primary ? 'color:#fff;' : 'color:rgba(255,255,255,.65);');
    btn.addEventListener('mouseenter', () => (btn.style.background = 'rgba(255,255,255,.12)'));
    btn.addEventListener('mouseleave', () => (btn.style.background = 'transparent'));
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      menu.remove();
      onClick();
    });
    menu.appendChild(btn);

    return btn;
  };

  const savePublishLabel = revisions
    ? t(win, embedded ? 'back_save_publish_and_leave' : 'back_save_publish_and_close')
    : t(win, embedded ? 'back_save_and_leave' : 'back_save_and_close');

  item(savePublishLabel, () => {
    pill.sveExpand?.();
    leaveEditor(win, pill, leave, { publish: true });
  }, true);

  if (revisions) {
    item(t(win, 'back_save_only'), () => {
      pill.sveExpand?.();
      leaveEditor(win, pill, leave, { publish: false });
    }, false);
  }

  item(t(win, embedded ? 'back_leave_only' : 'back_close_only'), () => {
    discardGlobalsChanges(win);
    clearSectionsStash(win, { refresh: false });
    leave();
  }, false);

  // Keep form edits; just leave Live Preview (admin form / host overlay).
  item(t(win, 'close_live_preview'), () => {
    leave();
  }, false);

  doc.body.appendChild(menu);

  const away = (event) => {
    if (menu.contains(event.target) || pill.contains(event.target)) {
      return;
    }

    menu.remove();
    pill.sveCollapse?.();
    doc.removeEventListener('click', away, true);
  };

  setTimeout(() => doc.addEventListener('click', away, true), 0);
}

// --- Add section ("+" in the preview) -------------------------------------------
// Each Replicator row carries an "insert a set before me" button (a popover
// trigger) at its top. Clicking the row AFTER the clicked section therefore opens
// Statamic's own Add Set picker at exactly the right position — no re-implemented
// picker. The last section falls back to the Replicator's own "Add Set" button.

/**
 * The "insert set here" trigger at the top of a sortable row. It's a popover
 * trigger (reka-ui) rendered as a centred wrapper around a single button.
 * Tried by id first, then by class, then by structure — the row also contains
 * many other buttons, so we must not just grab the first one.
 */
function insertButtonOf(item) {
  const holder =
    item.querySelector(':scope > [id^="reka-popover-trigger"]') ??
    [...item.children].find((c) => c.classList?.contains('justify-center')) ??
    null;

  return holder?.querySelector('button') ?? null;
}

/**
 * Preview-originated Add Set session. When the picker is opened from the live
 * preview "+", we keep its anchorRect for the whole time the picker is open —
 * including list↔grid toggles, which remount the popover onto the CP trigger.
 * Admin-panel Add Set never sets this, so it stays in the sidebar.
 */
let previewPickerSession = null; // { doc, win, anchorRect, observer, goneTimer }

/**
 * Only the Add Set picker — never "Search sections..." or other CP search
 * fields (those live in docked sidebars we must not reposition).
 */
function findSetPickerSearchInput(doc) {
  const nodes = doc.querySelectorAll(
    '[data-set-picker-search-input], input[placeholder*="Search Sets" i]'
  );

  for (const node of nodes) {
    const input = node.tagName === 'INPUT' ? node : node.querySelector?.('input') || node;

    if (
      input instanceof (doc.defaultView?.HTMLElement || HTMLElement) &&
      input.getClientRects().length > 0
    ) {
      return input;
    }
  }

  return nodes[0] || null;
}

function findSetPickerEl(doc, win) {
  const input = findSetPickerSearchInput(doc);

  if (!input) {
    return null;
  }

  // List popover (and its float wrapper) — prefer these so we never grab the
  // wide grid modal shell when both could match a climb.
  const list = input.closest('[data-set-picker-popover], .set-picker');

  if (list) {
    const parent = list.parentElement;

    if (parent && parent !== doc.body) {
      const cs = win.getComputedStyle(parent);
      const pw = parent.getBoundingClientRect().width;
      const floating =
        cs.position === 'fixed' ||
        cs.position === 'absolute' ||
        (cs.transform && cs.transform !== 'none');

      if (floating && pw > 180 && pw < 400) {
        return parent;
      }
    }

    return list;
  }

  // Grid modal: Search Sets inside a dialog, without .set-picker.
  const dialog = input.closest('[role="dialog"]');

  if (dialog) {
    return dialog;
  }

  let el = input;

  for (let i = 0; el && i < 12; i++) {
    const cs = win.getComputedStyle(el);

    if (cs.position === 'fixed' || cs.position === 'absolute') {
      return el;
    }

    el = el.parentElement;
  }

  return input.closest('[data-popper-placement]') || input.parentElement;
}

function placeSetPicker(el, doc, win, anchorRect) {
  if (anchorRect) {
    const iframe = doc.getElementById('live-preview-iframe');

    if (iframe && el) {
      const measured = el.getBoundingClientRect().width || el.offsetWidth || 0;

      // Grid = wide ui-modal. Moving it under the "+" cuts it off on the left.
      // Leave Statamic's centre alone. List is ~w-72.
      if (measured >= 400) {
        return;
      }

      const ir = iframe.getBoundingClientRect();
      const w = measured || 288;
      const h = el.getBoundingClientRect().height || el.offsetHeight || 420;
      // Centre horizontally on the +, sit just below it.
      const preferredLeft = ir.left + (anchorRect.left || 0) + (anchorRect.width || 0) / 2 - w / 2;
      const left = Math.max(8, Math.min(preferredLeft, win.innerWidth - w - 8));
      let top = ir.top + (anchorRect.bottom || 0) + 8;

      if (top + h > win.innerHeight - 8) {
        top = Math.max(8, ir.top + (anchorRect.top || 0) - h - 8);
      }

      el.style.setProperty('position', 'fixed', 'important');
      el.style.setProperty('left', `${left}px`, 'important');
      el.style.setProperty('top', `${top}px`, 'important');
      el.style.setProperty('right', 'auto', 'important');
      el.style.setProperty('bottom', 'auto', 'important');
      el.style.setProperty('transform', 'none', 'important');
      el.style.setProperty('margin', '0', 'important');
      el.style.setProperty('z-index', '2147483000', 'important');
      el.style.setProperty('max-height', '85vh', 'important');
      el.style.setProperty('overflow', 'auto', 'important');

      return;
    }
  }

  const rect = el.getBoundingClientRect();

  if (rect.left >= 0 && rect.right <= win.innerWidth && rect.width > 0) {
    return; // already on screen — admin-panel / grid modal
  }

  const w = el.offsetWidth || 480;
  const h = el.offsetHeight || 420;

  el.style.setProperty('position', 'fixed', 'important');
  el.style.setProperty('left', `${Math.max(8, (win.innerWidth - w) / 2)}px`, 'important');
  el.style.setProperty('top', `${Math.max(8, (win.innerHeight - h) / 2)}px`, 'important');
  el.style.setProperty('right', 'auto', 'important');
  el.style.setProperty('bottom', 'auto', 'important');
  el.style.setProperty('transform', 'none', 'important');
  el.style.setProperty('z-index', '2147483000', 'important');
}

function stopPreviewPickerSession() {
  if (!previewPickerSession) {
    return;
  }

  previewPickerSession.observer?.disconnect();
  clearTimeout(previewPickerSession.goneTimer);
  previewPickerSession.doc?.removeEventListener?.(
    'pointerdown',
    previewPickerSession.onDocPointer,
    true
  );

  try {
    previewPickerSession.iframeDoc?.removeEventListener?.(
      'pointerdown',
      previewPickerSession.onIframePointer,
      true
    );
  } catch {
    // iframe may already be gone / cross-origin
  }

  previewPickerSession.iframe?.removeEventListener?.(
    'load',
    previewPickerSession.onIframeLoad
  );
  previewPickerSession = null;
}

/** Close the open list Set picker (Escape, then toggle its trigger if needed). */
function dismissOpenSetPicker(doc) {
  doc.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      which: 27,
      bubbles: true,
      cancelable: true,
    })
  );

  setTimeout(() => {
    if (!findSetPickerSearchInput(doc)) {
      return;
    }

    const trigger = [...doc.querySelectorAll('[aria-expanded="true"]')].find(
      (el) =>
        el.closest?.('.replicator-fieldtype-container') ||
        (el.id || '').includes('reka-popover')
    );

    trigger?.click();
  }, 0);
}

/**
 * Keep pinning the picker under the preview "+" for as long as it stays open.
 * List↔grid remounts a new popover on the CP trigger — the observer catches
 * that and re-applies. Cleared when the Search Sets UI disappears.
 *
 * Clicks in the live-preview iframe never reach Statamic's popover
 * click-outside — so we dismiss list view ourselves on outside pointerdown.
 */
function startPreviewPickerSession(doc, win, anchorRect) {
  stopPreviewPickerSession();

  const ignoreUntil = Date.now() + 350;

  const isListPicker = (el) => {
    if (!el) {
      return false;
    }

    const w = el.getBoundingClientRect().width || el.offsetWidth || 0;

    return w > 0 && w < 400;
  };

  const onDocPointer = (event) => {
    if (!previewPickerSession || Date.now() < ignoreUntil) {
      return;
    }

    const el = findSetPickerEl(doc, win);

    if (!isListPicker(el)) {
      return;
    }

    if (el.contains(event.target)) {
      return;
    }

    dismissOpenSetPicker(doc);
  };

  const onIframePointer = () => {
    if (!previewPickerSession || Date.now() < ignoreUntil) {
      return;
    }

    const el = findSetPickerEl(doc, win);

    if (!isListPicker(el)) {
      return;
    }

    dismissOpenSetPicker(doc);
  };

  const bindIframe = () => {
    const iframe = doc.getElementById('live-preview-iframe');

    if (!iframe || !previewPickerSession) {
      return;
    }

    try {
      previewPickerSession.iframeDoc?.removeEventListener?.(
        'pointerdown',
        onIframePointer,
        true
      );
    } catch {
      // ignore
    }

    previewPickerSession.iframe = iframe;

    try {
      const iframeDoc = iframe.contentDocument;

      if (iframeDoc) {
        iframeDoc.addEventListener('pointerdown', onIframePointer, true);
        previewPickerSession.iframeDoc = iframeDoc;
      }
    } catch {
      // cross-origin
    }
  };

  const onIframeLoad = () => bindIframe();

  const tick = () => {
    if (!previewPickerSession) {
      return;
    }

    const el = findSetPickerEl(doc, win);

    if (el) {
      clearTimeout(previewPickerSession.goneTimer);
      previewPickerSession.goneTimer = null;
      placeSetPicker(el, doc, win, anchorRect);
      bindIframe();

      return;
    }

    // Picker briefly unmounts while switching list↔grid — wait before ending.
    if (!previewPickerSession.goneTimer) {
      previewPickerSession.goneTimer = setTimeout(() => {
        stopPreviewPickerSession();
      }, 600);
    }
  };

  const observer = new MutationObserver(() => tick());

  observer.observe(doc.body, { childList: true, subtree: true, attributes: true });
  doc.addEventListener('pointerdown', onDocPointer, true);

  const iframe = doc.getElementById('live-preview-iframe');

  iframe?.addEventListener('load', onIframeLoad);

  previewPickerSession = {
    doc,
    win,
    anchorRect,
    observer,
    goneTimer: null,
    onDocPointer,
    onIframePointer,
    onIframeLoad,
    iframe,
    iframeDoc: null,
  };
  bindIframe();
  tick();
}

/**
 * The picker is a popover anchored to its CP trigger. When opened from the
 * preview "+" we pin it under that button for the whole picker session
 * (list↔grid included). Without an anchorRect we only rescue off-screen
 * popovers — admin-panel Add Set is left alone.
 */
function ensurePickerVisible(doc, win, anchorRect = null) {
  if (anchorRect) {
    startPreviewPickerSession(doc, win, anchorRect);

    // Also nudge a few times up front — floating-ui writes after open.
    let attempts = 0;

    const run = () => {
      const el = findSetPickerEl(doc, win);

      if (!el) {
        if (++attempts < 25) {
          setTimeout(run, 100);
        }

        return;
      }

      placeSetPicker(el, doc, win, anchorRect);
      setTimeout(() => placeSetPicker(el, doc, win, anchorRect), 130);
      setTimeout(() => placeSetPicker(el, doc, win, anchorRect), 320);
    };

    setTimeout(run, 80);

    return;
  }

  let attempts = 0;

  const run = () => {
    const el = findSetPickerEl(doc, win);

    if (!el) {
      if (++attempts < 25) {
        setTimeout(run, 100);
      }

      return;
    }

    placeSetPicker(el, doc, win, null);
  };

  setTimeout(run, 80);
}

function repositionAfterAdd(uid, doc) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, uid);

    if (path === null) {
      continue;
    }

    const dot = path.lastIndexOf('.');

    if (dot === -1) {
      return;
    }

    const parentPath = path.slice(0, dot);
    const index = Number(path.slice(dot + 1));
    const initial = dataGet(values, parentPath);

    if (!Array.isArray(initial) || !Number.isInteger(index)) {
      return;
    }

    const startLength = initial.length;
    let attempts = 0;

    const poll = () => {
      const current = dataGet(unwrapRef(container.values), parentPath);

      if (!Array.isArray(current)) {
        return;
      }

      if (current.length > startLength) {
        const next = [...current];
        const [added] = next.splice(next.length - 1, 1); // the appended set
        next.splice(index + 1, 0, added); // right after the clicked section

        container.setFieldValue(parentPath, next);

        return;
      }

      // Give the user time to browse the picker; stop if they never pick one.
      if (++attempts < 240) {
        setTimeout(poll, 150);
      }
    };

    setTimeout(poll, 150);

    return;
  }
}

/** Opens Statamic's Add Set picker to insert a section after the given one. */
export function handleAddSet(data, doc, win) {
  // The "+" on a section opens the section library (docked panel). You place a
  // section by dragging a card into the preview, so no insert position is passed.
  openSectionPicker(win);
}

function nativeAddSetAt(setEl, uid, doc, win, anchorRect = null, position = 'after') {
  const item = setEl.closest('[class*="sortable-item"]');

  if (!item?.parentElement) {
    return false;
  }

  // Walk the real row list (not nextElementSibling — a stray node between rows
  // must not throw the position off).
  const rows = [...item.parentElement.children].filter((c) =>
    /sortable-item/.test((c.className || '').toString())
  );

  // Every row carries an "insert before me" trigger, so both sides are the same
  // question asked of a different row: this one to land above it, the next one
  // to land below. `next` is also what says whether the fallback has to move the
  // set afterwards — at the end of the list, appending already puts it right.
  const next = rows[rows.indexOf(item) + 1] ?? null;
  const target = position === 'before' ? item : next;

  // Preferred: click that trigger — Statamic then inserts exactly where we want
  // and nothing else is needed.
  if (target) {
    const trigger = insertButtonOf(target);

    if (trigger) {
      trigger.click();
      ensurePickerVisible(doc, win, anchorRect);

      return true;
    }
  }

  // Otherwise the Replicator's own "Add Set" button, which appends at the end —
  // so unless this really is the last row, move the picked set into place after.
  //
  // The label belongs to whoever wrote the blueprint (button_label, add_row), so
  // matching on words alone took whichever add button came first in the DOM. A
  // links block holds a grid labelled "Tilføj link", and once that block was
  // expanded its button stood above the replicator's own — so the "+" after the
  // last block quietly added a link instead of opening the set picker.
  //
  // Depth settles it: the set list's own button belongs to the replicator, not
  // to anything inside one of its sets. Rows above the replicator don't count —
  // this field may well sit inside a page section, which is a row itself.
  const replicator = item.closest('.replicator-fieldtype-container') ?? doc;
  const insideOwnSet = (b) => {
    const owner = b.closest('[class*="sortable-item"]');

    return !!owner && replicator.contains(owner);
  };

  const candidates = [...replicator.querySelectorAll('button')].filter((b) =>
    /add set|add block|tilføj/i.test(b.textContent || '')
  );

  // Last resort is the old first-match: a picker in the wrong place still beats
  // a "+" that does nothing at all if the markup ever moves the button.
  const addButton = candidates.find((b) => !insideOwnSet(b)) ?? candidates[0];

  if (!addButton) {
    return false;
  }

  if (next) {
    repositionAfterAdd(uid, doc);
  }

  addButton.click();
  ensurePickerVisible(doc, win, anchorRect);

  return true;
}

/**
 * Choose a set in the picker on the preview's behalf.
 *
 * The preview already asked which block to add — its own list, right at the "+"
 * — because Statamic's picker can only open where the fields are, and a global
 * section's are in here. So the picker is opened as usual and the answer is
 * given to it, which keeps the insert itself entirely native.
 */
function autoPickSet(doc, win, label) {
  const wanted = String(label || '').trim().toLowerCase();

  if (!wanted) {
    return;
  }

  let attempts = 0;

  const run = () => {
    const picker = findSetPickerEl(doc, win);
    const item = picker
      ? [...picker.querySelectorAll('button, [role="option"], [role="menuitem"], li, a')].find(
          (el) => el.textContent.trim().toLowerCase() === wanted
        )
      : null;

    if (item) {
      item.click();

      return;
    }

    if (++attempts < 40) {
      setTimeout(run, 100);
    }
  };

  setTimeout(run, 150);
}

/**
 * Off while the global section still lives in its own panel: a picker mounted
 * out here cannot reach the fields in there reliably. Kept, and switched on
 * again, once the section is edited in this window like any other.
 */
const PICKER_OVER_PREVIEW = false;

/**
 * Statamic's own Add Set picker, opened over the preview.
 *
 * A global section's fields live in the panel, so the picker Statamic would open
 * for them appears in there — not where the "+" was clicked. `set-picker` is a
 * registered component though, so it can be mounted here instead, in the same
 * document as the preview, and pinned exactly like the picker of a page's own
 * section. The chosen set is then handed to the panel, which does the insert.
 *
 * Returns false if it could not be mounted, so the caller can fall back.
 */
function openSetPickerOverPreview(doc, win, sets, anchorRect, onChoose) {
  const Vue = win.Vue;
  const app = win.Statamic?.$app;

  if (!Vue?.createApp || !app || !Array.isArray(sets) || !sets.length) {
    return false;
  }

  const host = doc.createElement('div');

  host.dataset.sveSetPickerHost = '';
  host.style.cssText = 'position:fixed;z-index:2147483000;left:0;top:0;';
  doc.body.appendChild(host);

  let mounted = null;
  // The picker opens itself from a trigger; there is none here, so its own
  // `isOpen` is set instead — the same flag its trigger would flip.
  const instance = Vue.ref(null);

  const close = () => {
    try {
      mounted?.unmount();
    } catch {
      /* ignore */
    }

    host.remove();
  };

  try {
    const picker = Vue.defineComponent({
      setup() {
        return () =>
          Vue.h(
            'set-picker',
            {
              ref: instance,
              sets: [{ handle: 'all', display: '', sets }],
              enabled: true,
              align: 'start',
              onAdded: (set) => {
                onChoose(set);
                setTimeout(close, 0);
              },
              onClickedAway: () => setTimeout(close, 0),
            },
            { trigger: () => Vue.h('span', { style: 'display:block;width:0;height:0;' }) }
          );
      },
    });

    mounted = Vue.createApp(picker);

    // Borrow Statamic's own registry: the picker resolves other components,
    // directives (tooltip) and $config/$translate off the app it lives in.
    Object.assign(mounted._context.components, app._context.components);
    Object.assign(mounted._context.directives, app._context.directives);
    Object.assign(mounted._context.provides, app._context.provides);
    Object.assign(mounted.config.globalProperties, app.config.globalProperties);

    mounted.mount(host);

    // Open it, and close everything down again when it closes.
    setTimeout(() => {
      const vm = instance.value;

      if (!vm) {
        close();

        return;
      }

      vm.isOpen = true;

      const watch = setInterval(() => {
        if (!vm.isOpen) {
          clearInterval(watch);
          close();
        }
      }, 200);

      // Never leave a picker hanging over the preview.
      setTimeout(() => clearInterval(watch), 120000);
    }, 0);
  } catch {
    close();

    return false;
  }

  // Pin it where the "+" is, the same way a page section's picker is pinned.
  if (anchorRect) {
    let attempts = 0;

    const place = () => {
      const el = findSetPickerEl(doc, win);

      if (el) {
        placeSetPicker(el, doc, win, anchorRect);
        setTimeout(() => placeSetPicker(el, doc, win, anchorRect), 140);

        return;
      }

      if (++attempts < 25) {
        setTimeout(place, 80);
      }
    };

    setTimeout(place, 60);
  }

  return true;
}

function handleAddBlockNative(data, doc, win) {
  const { anchorUid, sectionUid, anchorRect = null, position = 'after' } = data;

  // A global section's fields are not in this form. They belong to the synced
  // source entry, whose own form is the panel docked beside the preview — so the
  // set lives in that document, and the picker has to open in there. Without
  // this the lookup below finds nothing, retries, and the "+" does nothing.
  //
  // Edited in this window there is no other document: the section's sets are
  // right here, so the lookup below finds them, the "+" takes the same path a
  // page section's does, and Statamic's own picker opens over the preview,
  // pinned under the button. That is what the missing panel means here.
  if (data.global) {
    const frame = doc.getElementById(GLOBAL_SECTION_PANEL_ID)?.querySelector('iframe');

    if (frame?.contentWindow) {
      const forward = (extra = {}) =>
        frame.contentWindow.postMessage(
          { ...data, ...extra, source: 'statamic-visual-editor', type: 'sve-section-add-block' },
          win.location.origin
        );

      // The picker belongs over the preview, so it is opened here and the answer
      // is sent on. Only if that cannot be mounted does the panel open its own.
      const opened =
        PICKER_OVER_PREVIEW &&
        openSetPickerOverPreview(doc, win, data.sets, data.anchorRect, (set) =>
          forward({ setHandle: set?.handle, setLabel: set?.display || set?.handle })
        );

      if (!opened) {
        forward();
      }

      return;
    }
  }
  const section = sectionUid ? findSetByUid(sectionUid, doc) : null;

  if (section) {
    collectAncestorSets(section).forEach(expandSet);
    expandSet(section);
  }

  let attempts = 0;

  const run = () => {
    if (anchorUid) {
      const block = findSetByUid(anchorUid, doc);

      if (block) {
        collectAncestorSets(block).forEach(expandSet);
        nativeAddSetAt(block, anchorUid, doc, win, anchorRect, position);

        return;
      }
    } else if (section) {
      const addButton = [...section.querySelectorAll('button')].find((b) => /add set|add block|tilføj/i.test(b.textContent || ''));

      if (addButton) {
        addButton.click();
        ensurePickerVisible(doc, win, anchorRect);

        return;
      }
    }

    if (++attempts < 25) {
      setTimeout(run, 100); // the row mounts a beat after the section expands
    }
  };

  setTimeout(run, 60);
}

/**
 * Walk the Vue parent chain from el looking for Bard's fieldtype proxy
 * (openSetPicker / editor / showAddSetButton).
 */
function findBardVueProxy(el) {
  let vn = el?.__vueParentComponent;

  if (!vn && el?.querySelector) {
    const pm = el.querySelector('.ProseMirror') || el.querySelector('[contenteditable="true"]');

    vn = pm?.__vueParentComponent;
  }

  for (let i = 0; vn && i < 40; i++) {
    const proxy = vn.proxy;

    if (
      proxy &&
      (typeof proxy.openSetPicker === 'function' ||
        (proxy.editor && 'showAddSetButton' in proxy))
    ) {
      return proxy;
    }

    vn = vn.parent;
  }

  // Fallback: climb DOM and check each node's Vue parent.
  let cur = el;

  for (let i = 0; cur && i < 30; i++) {
    const proxy = cur.__vueParentComponent?.proxy;

    if (
      proxy &&
      (typeof proxy.openSetPicker === 'function' ||
        (proxy.editor && 'showAddSetButton' in proxy))
    ) {
      return proxy;
    }

    cur = cur.parentElement;
  }

  return null;
}

/**
 * Place TipTap's selection inside the top-level child at index (required for
 * Bard's floating SetPicker to mount — DOM Selection alone is not enough).
 */
function placeBardTipTapAtIndex(editor, index) {
  if (!editor?.state?.doc) {
    return false;
  }

  let targetPos = null;
  let lastTextPos = null;
  let i = 0;

  editor.state.doc.forEach((node, pos) => {
    if (node.isTextblock) {
      lastTextPos = pos + 1;
    }

    if (Number.isInteger(index) && i === index) {
      targetPos = pos + (node.isTextblock ? 1 : 0);
    }

    i++;
  });

  if (targetPos == null) {
    targetPos = lastTextPos;
  }

  if (targetPos == null) {
    editor.chain().focus().run();

    return false;
  }

  try {
    editor.chain().focus().setTextSelection(targetPos).run();

    return true;
  } catch {
    try {
      editor.chain().focus().run();
    } catch {
      /* ignore */
    }

    return false;
  }
}

/**
 * Place the caret in the Bard ProseMirror at a top-level child index (matching
 * the preview wrapper's children, including set node-views).
 */
function placeBardCaretAtIndex(pm, index, win) {
  if (!pm) {
    return false;
  }

  const kids = [...pm.children];
  const target = Number.isInteger(index) ? kids[index] : kids[kids.length - 1];

  if (!target) {
    pm.focus();

    return false;
  }

  pm.focus();

  try {
    const range = win.document.createRange();

    range.selectNodeContents(target);
    range.collapse(true);

    const sel = win.getSelection();

    sel.removeAllRanges();
    sel.addRange(range);
  } catch {
    /* selection APIs can throw on detached nodes */
  }

  return true;
}

/**
 * CP-side fallback when Bard's SetPicker isn't mounted yet: same Search Sets
 * UX (search + list), pinned under the preview "+", inserting via insert-bard-set.
 */
function openBardSetPickerFallback(doc, win, data) {
  const sets = Array.isArray(data.sets) ? data.sets : [];

  if (!sets.length) {
    return;
  }

  doc.getElementById('sve-bard-set-fallback')?.remove();

  const panel = doc.createElement('div');

  panel.id = 'sve-bard-set-fallback';
  panel.setAttribute('data-set-picker-popover', '');
  panel.style.cssText =
    'position:fixed;z-index:999999;width:260px;max-height:320px;overflow:auto;' +
    'background:#fff;color:#18181b;border:1px solid #e4e4e7;border-radius:8px;' +
    'box-shadow:0 10px 40px rgba(0,0,0,.18);padding:8px;font-size:13px;';

  if (doc.documentElement.classList.contains('dark')) {
    panel.style.background = '#18181b';
    panel.style.color = '#fafafa';
    panel.style.borderColor = '#3f3f46';
  }

  const search = doc.createElement('input');

  search.type = 'search';
  search.setAttribute('data-set-picker-search-input', '');
  search.placeholder = 'Search Sets...';
  search.style.cssText =
    'width:100%;box-sizing:border-box;margin-bottom:6px;padding:6px 8px;' +
    'border:1px solid #d4d4d8;border-radius:6px;background:transparent;color:inherit;';

  const list = doc.createElement('div');

  const render = (q = '') => {
    list.innerHTML = '';
    const needle = q.trim().toLowerCase();

    sets
      .filter((s) => {
        const label = `${s.display || ''} ${s.handle || ''}`.toLowerCase();

        return !needle || label.includes(needle);
      })
      .forEach((s) => {
        const btn = doc.createElement('button');

        btn.type = 'button';
        btn.textContent = s.display || s.handle;
        btn.style.cssText =
          'display:block;width:100%;text-align:left;padding:8px 10px;border:none;' +
          'border-radius:6px;background:transparent;color:inherit;cursor:pointer;';
        btn.addEventListener('mouseenter', () => {
          btn.style.background = doc.documentElement.classList.contains('dark')
            ? 'rgba(255,255,255,.08)'
            : 'rgba(0,0,0,.05)';
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.background = 'transparent';
        });
        btn.addEventListener('click', () => {
          panel.remove();
          stopPreviewPickerSession();
          handleInsertBardSet(
            {
              field: data.field,
              set: s.handle,
              scope: data.scope,
              index: data.index,
            },
            doc,
            win
          );
        });
        list.appendChild(btn);
      });
  };

  search.addEventListener('input', () => render(search.value));
  render();

  panel.appendChild(search);
  panel.appendChild(list);
  doc.body.appendChild(panel);

  ensurePickerVisible(doc, win, data.anchorRect || null);
  setTimeout(() => search.focus(), 50);

  const onOutside = (e) => {
    if (panel.contains(e.target)) {
      return;
    }

    panel.remove();
    doc.removeEventListener('pointerdown', onOutside, true);
    stopPreviewPickerSession();
  };

  setTimeout(() => doc.addEventListener('pointerdown', onOutside, true), 100);
}

/**
 * Preview "+" on a Bard field: open Statamic's real SetPicker (Search Sets),
 * pinned under the plus — same component the replicator inserter uses.
 *
 * Bard only mounts SetPicker while showAddSetButton is true (empty focused
 * textblock via TipTap). We drive TipTap selection, then open; if the native
 * picker never mounts we fall back to a Search Sets list with the field's sets.
 */
function handleAddBardSetNative(data, doc, win) {
  const { field, scope, index = null, anchorRect = null, sets = [] } = data;

  if (!field) {
    return;
  }

  if (scope && autoOpenPanel(win)) {
    soloSection(topLevelSectionUid(scope, doc) || scope, doc, win);
  }

  handleFieldFocus(field, doc, { scopeUid: scope || undefined });

  let attempts = 0;

  const run = () => {
    const fieldEl = findFieldElement(field, doc, scope || undefined);
    const bardEl =
      fieldEl?.closest('.bard-fieldtype') || fieldEl?.querySelector('.bard-fieldtype') || fieldEl;
    const pm = bardEl?.querySelector('.ProseMirror') || bardEl?.querySelector('[contenteditable="true"]');

    if (!bardEl || !pm) {
      if (++attempts < 30) {
        setTimeout(run, 100);
      } else {
        openBardSetPickerFallback(doc, win, data);
      }

      return;
    }

    const proxy = findBardVueProxy(bardEl);

    if (proxy?.editor) {
      placeBardTipTapAtIndex(proxy.editor, index);
    } else {
      placeBardCaretAtIndex(pm, index, win);
    }

    // Temporarily allow the floating set button so SetPicker can mount even
    // if TipTap's "empty paragraph" heuristic lags a frame behind focus.
    const prevAlways = proxy?.config?.always_show_set_button;
    let restored = false;

    const restoreAlways = () => {
      if (!proxy?.config || restored) {
        return;
      }

      restored = true;
      proxy.config.always_show_set_button = prevAlways;
    };

    if (proxy?.config) {
      proxy.config.always_show_set_button = true;
    }

    if (proxy) {
      proxy.showAddSetButton = true;
    }

    let openAttempts = 0;

    const tryOpen = () => {
      if (proxy) {
        try {
          if (proxy.$refs?.setPicker && typeof proxy.$refs.setPicker.open === 'function') {
            proxy.$refs.setPicker.open();
            ensurePickerVisible(doc, win, anchorRect);
            setTimeout(restoreAlways, 1500);

            return;
          }

          if (typeof proxy.openSetPicker === 'function' && proxy.$refs?.setPicker) {
            proxy.openSetPicker();
            ensurePickerVisible(doc, win, anchorRect);
            setTimeout(restoreAlways, 1500);

            return;
          }
        } catch {
          /* fall through */
        }
      }

      const trigger =
        bardEl.querySelector('.bard-set-selector button') ||
        bardEl.querySelector('.bard-set-selector [aria-expanded]') ||
        doc.querySelector('.bard-set-selector button');

      if (trigger) {
        trigger.click();
        ensurePickerVisible(doc, win, anchorRect);
        setTimeout(restoreAlways, 1500);

        return;
      }

      if (++openAttempts < 25) {
        setTimeout(tryOpen, 80);

        return;
      }

      restoreAlways();
      openBardSetPickerFallback(doc, win, { ...data, sets });
    };

    setTimeout(tryOpen, 60);
  };

  setTimeout(run, 120);
}

/**
 * When a synced section panel is open, field DOM (focus, assets, link UI) lives
 * in that iframe — not the page publish form. Value writes still go through
 * sectionPanelContainer on the parent.
 */
function globalSectionEditorDoc(doc) {
  // Edited in this window there is no panel, so this is null and every caller
  // works in `doc` — exactly as it does for one of the page's own sections.
  const frame = doc.getElementById(GLOBAL_SECTION_PANEL_ID)?.querySelector('iframe');

  try {
    return frame?.contentDocument || null;
  } catch {
    return null;
  }
}

function globalSectionEditorWin(win) {
  const frame = win.document.getElementById(GLOBAL_SECTION_PANEL_ID)?.querySelector('iframe');

  try {
    return frame?.contentWindow || null;
  } catch {
    return null;
  }
}

export function createMessageListener(doc = document, win = window) {
  return function handleMessage(event) {
    // Guard: only accept messages from the live-preview iframe.
    // This prevents cross-site message spoofing from third-party windows.
    const previewIframe = doc.getElementById('live-preview-iframe');

    if (!previewIframe || event.source !== previewIframe.contentWindow) {
      return;
    }

    const { data } = event;

    if (!data || data.source !== 'statamic-visual-editor') {
      return;
    }

    if (data.type === 'click') {
      // Synced section: focus/solo runs inside the left iframe (source entry),
      // not the page form — those uids are not on this page.
      if (forwardGlobalSectionFocus(data, doc, win)) {
        return;
      }

      // Normal page click while the synced-section editor is still up: put the
      // page form back so the sidebar matches the section being edited.
      if (globalSectionEditorOpen(doc) && !data.global) {
        closeGlobalSectionPanel(win);
        previewFrame(doc)?.contentWindow?.postMessage(
          { source: 'statamic-visual-editor', type: 'sve-force-exit-global' },
          win.location.origin
        );
      }

      // Whatever the click turns out to mean below, the tree should show where it
      // landed. Placed here, before the branching, because the branches lead to
      // different functions — a field click with the focus panel on never reaches
      // `focusFromPreview` — and "the preview reported a click" is true of all of
      // them exactly once.
      listViewSyncTo(win, data.scope, data.uid);
      applyDeclaredDefaults(data, doc);

      if (data.field) {
        // Open what the field belongs to. With the focus panel on that is the
        // block holding it; without it, the top-level section — a nested block
        // passes its row id as scope, which still expands below via
        // handleFieldFocus.
        if (data.scope && autoOpenPanel(win)) {
          if (focusPanelOn(win)) {
            focusFieldOwner(data.field, data.scope, doc, win);
          } else {
            focusFromPreview(data.scope, doc, win, { clampToSection: true });
          }
        }

        handleFieldFocus(data.field, doc, { scopeUid: data.scope });

        // Solo/accordion re-render can leave the nested set collapsed — re-assert
        // after the expand transition so the edited block's fields stay open.
        if (data.scope) {
          setTimeout(
            () => handleFieldFocus(data.field, doc, { animate: false, scopeUid: data.scope }),
            COLLAPSE_SETTLE_MS
          );
        }
      } else if (autoOpenPanel(win)) {
        // Clicking a section opens the panel showing ONLY that section. Falls
        // back to plain focus (e.g. nested rows without a resolvable set).
        if (!focusFromPreview(data.uid, doc, win)) {
          handleFocus(data.uid, doc, data.afterSetUid, data.uidIndex ?? 0);
        }
      }
    } else if (data.type === 'edit-request') {
      handleEditRequest(data, doc, win);
    } else if (data.type === 'edit-input') {
      handleEditInput(data, doc);
    } else if (data.type === 'edit-control') {
      handleEditControl(data);
    } else if (data.type === 'theme-swatches-request') {
      handleThemeSwatchesRequest(data, win);
    } else if (data.type === 'edit-end') {
      handleEditEnd(data, win);
    } else if (data.type === 'block-format') {
      handleBlockFormat(data, doc);
    } else if (data.type === 'outline') {
      handleOutline(data, win);
    } else if (data.type === 'open-panel-field') {
      // Pencil / "finish in panel": focus the field in the synced-section iframe
      // when that is the active editor — same path as a preview click.
      const iwin = globalSectionEditorWin(win);

      if (iwin && editSession?.container?.name === 'sve-global-section' && editSession.field) {
        setLpCollapsed(win, false);
        iwin.postMessage(
          {
            source: 'statamic-visual-editor',
            type: 'sve-section-focus',
            uid: editSession.scope || null,
            field: editSession.field,
          },
          win.location.origin
        );

        return;
      }

      handleOpenPanelField(data, doc, win);
    } else if (data.type === 'bard-command') {
      const idoc = globalSectionEditorDoc(doc);

      if (idoc && editSession?.container?.name === 'sve-global-section') {
        handleBardCommand(data, idoc, globalSectionEditorWin(win) || win);
      } else {
        handleBardCommand(data, doc, win);
      }
    } else if (data.type === 'asset-edit') {
      const idoc = globalSectionEditorDoc(doc);

      handleAssetEdit(data, idoc || doc);
    } else if (data.type === 'link-edit') {
      const idoc = globalSectionEditorDoc(doc);
      const iwin = globalSectionEditorWin(win);

      if (idoc && iwin && editSession?.container?.name === 'sve-global-section') {
        handleLinkEdit(data, idoc, iwin);
      } else {
        handleLinkEdit(data, doc, win);
      }
    } else if (data.type === 'move') {
      handleMove(data, doc);
    } else if (data.type === 'add-set') {
      handleAddSet(data, doc, win);
    } else if (data.type === 'cb-col-width') {
      handleColumnWidth(data, doc);
    } else if (data.type === 'sve-grid-span') {
      handleGridSpan(data, doc, win);
    } else if (data.type === 'open-global') {
      handleOpenGlobal(data, doc, win);
    } else if (data.type === 'open-chrome') {
      handleOpenChrome(data, doc, win);
    } else if (data.type === 'open-chrome-designs') {
      setChromeSidebarMode(win, 'design');
    } else if (data.type === 'open-chrome-settings') {
      setChromeSidebarMode(win, 'settings');
    } else if (data.type === 'close-chrome') {
      // Stepping out of header/footer (e.g. clicking a page section): free the
      // left edge so the section editor isn't stacked under Theme Settings.
      dismissChromeForPageEdit(win);
    } else if (data.type === 'request-close-chrome') {
      handleRequestCloseChrome(win);
    } else if (data.type === 'sve-chrome-dirty-query') {
      notifyChromeDirty(win);
    } else if (data.type === 'save-chrome') {
      // The bar's Save, driving whichever form is actually holding the edits.
      // Sent straight to the panel iframe, it went to Theme Settings as the
      // background prefetch had loaded it — a form that had never seen the edit
      // — and saved that instead.
      saveGlobalsPanel(win, () => {});
    } else if (data.type === 'add-row') {
      handleAddRow(data, doc, win);
    } else if (data.type === 'add-block-native') {
      // Preview "+": open Statamic's real SetPicker, pin list under the plus.
      handleAddBlockNative(data, doc, win);
    } else if (data.type === 'add-bard-set-native') {
      handleAddBardSetNative(data, doc, win);
    } else if (data.type === 'insert-bard-set') {
      handleInsertBardSet(data, doc, win);
    } else if (data.type === 'remove-row') {
      // A section is asked about first. It takes one click to remove and holds
      // everything inside it, and the page it leaves behind looks like a page
      // that was always that way — there is nothing on screen to tell you what
      // is gone. A row is small and sits in view of its siblings, so it goes
      // straight away, as it always has.
      if (data.confirm) {
        confirmCloseDiscard(
          win,
          {
            titleKey: 'remove_section_title',
            bodyKey: 'remove_section_body',
            confirmKey: 'remove_section_confirm',
          },
          () => handleRemoveRow(data, doc, win)
        );
      } else {
        handleRemoveRow(data, doc, win);
      }
    } else if (data.type === 'duplicate-row') {
      handleDuplicateRow(data, doc, win);
    } else if (data.type === 'hide-row') {
      handleHideRow(data, doc, win);
    } else if (data.type === 'row-caps') {
      handleRowCaps(data, doc, win);
    } else if (data.type === 'open-global-section') {
      handleOpenGlobalSection(data, win);
    } else if (data.type === 'sve-pill-box-request') {
      const pill = doc.getElementById(LP_BACK_ID);

      if (pill) {
        tellPreviewWherePillIs(win, pill);
      }
        } else if (data.type === 'close-global-section') {
      closeGlobalSectionPanel(win);
    } else if (data.type === 'request-close-global') {
      handleRequestCloseGlobal(win);
    } else if (data.type === 'sve-global-dirty-query') {
      notifyGlobalSectionDirty(win);
    } else if (data.type === 'save-global-section') {
      // The bar's Save, driving the entry form's real one — wherever it lives.
      saveGlobalSectionPanel(win, () => {});
    } else if (data.type === 'section-settings') {
      handleSectionSettings(data, doc, win);
    } else if (data.type === 'save-section') {
      handleSaveSection(data, doc, win);
    } else if (data.type === 'ext-drop') {
      // A section dragged in from the library was released — insert it where the
      // preview's drop line ended up (data.afterUid, null = at the top).
      if (libraryDrag) {
        insertSection(win, doc, data.afterUid ?? null, libraryDrag.kind, libraryDrag.item);
        libraryDrag = null;
      }
    } else if (data.type === 'cb-add-column') {
      handleAddColumn(data, doc, win);
    } else if (data.type === 'popup') {
      // A column popup is opening (the column-builder addon handles that) —
      // expand and scroll the publish form to the containing section, so the
      // form behind the popup shows where you are when it closes again.
      if (data.sectionUid) {
        handleFocus(data.sectionUid, doc);
      }
    } else if (data.type === 'hover') {
      if (data.field || ('field' in data && !data.uid)) {
        handleFieldHover(data.field || null, doc, data.scope);
      } else {
        handleHover(data.uid, doc);
      }
    }
  };
}

const CP_STYLES = `
/* Docked right panels (sections library / Theme Settings) sit at z-index 40–60.
   Publish closes those panels (see watchPublishClosesRightPanels) — no z-index
   war needed for Statamic's Publish sheet. */
/* The page's own fields, while the field column belongs to a global section.
   The solo view hides them too once it has a set to isolate; this covers the
   moment before that, when the synced entry's form is still mounting. */
[data-sve-global-away] {
  display: none !important;
}
/* --- Section groups: the segmented control and its accordion panels ---------
   Keyed on the data attributes the DOM already carries, so not one of these
   elements needs an inline style. Sizes are relative throughout; px is left to
   hairlines. */
[data-sve-section-toggle] {
  grid-column: 1 / -1;
  display: flex;
}
/* One row, always. A narrow panel used to drop the third segment onto a second
   line, which reads as two controls rather than one and moves every field below
   it down; it scrolls sideways instead. The scrollbar is hidden — the control is
   a row of tabs, not a scroller, and the segments run to the edge to say so. */
[data-sve-section-track] {
  display: flex;
  flex: 0 1 auto;
  flex-wrap: nowrap;
  max-width: 100%;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  /* Match Live Preview top-bar mode group (Hidden / Auto / Visible). */
  gap: 0;
  padding: 5px;
  border-radius: 0.5rem;
  background: rgba(128, 128, 128, .16);
}
[data-sve-section-track]::-webkit-scrollbar {
  display: none;
}
/* Beside the preview the panel is a narrow column and the control fills it; in
   the publish form it is sized by its segments. */
[data-sve-fill] [data-sve-section-track],
[data-sve-fill] [data-sve-section-seg] {
  flex: 1 1 auto;
}
[data-sve-section-seg] {
  /* One line. It only became a wall of declarations when it sat in the style
     attribute, where the browser has to write every property out; in a rule it
     is just this. */
  all: unset;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65em;

  flex: 0 0 auto;
  box-sizing: border-box;
  min-width: 0;
  height: 28px;
  padding: 0 12px;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  font-size: 12px;
  font-weight: 500;
  /* What puts the label and the icon on one centre. Any more and the label
     carries half a line of leading above and below the letters: the box is
     centred, the letters ride high. */
  line-height: 1;
  opacity: .75;
}
[data-sve-section-seg][aria-pressed="true"] {
  /* Flat Save & Publish blue — lightest gradient stop, no border/shadow. */
  background: color-mix(in oklab, var(--theme-color-primary, #4f46e5) 90%, transparent);
  color: #fff;
  border-color: transparent;
  box-shadow: none;
  opacity: 1;
}
[data-sve-panel-card] {
  grid-column: 1 / -1;
  overflow: hidden;
  border: 1px solid rgba(128, 128, 128, .16);
  border-radius: 0.75rem;
  background: rgba(128, 128, 128, .08);
}
[data-sve-panel-head] {
  all: unset;
  cursor: pointer;
  border-bottom: 1px solid transparent;

  /* !important: Statamic's own button styling sets display on this one. */
  display: flex !important;
  align-items: center;
  gap: 0.85em;

  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: 1.05em;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1;
  text-align: left;
}
[data-sve-panel-head][aria-expanded="true"] {
  /* The divider only belongs there while something sits below it. */
  border-bottom-color: rgba(128, 128, 128, .20);
}
[data-sve-panel-title] {
  flex: 1 1 auto;
}
/* The chevron sits in its own tile, which gives the row a second anchor and
   makes the whole header read as one control. */
[data-sve-panel-tile] {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.15em;
  height: 2.15em;
  border-radius: 0.6em;
  background: rgba(128, 128, 128, .16);
}
[data-sve-chevron] {
  display: block;
  width: 1em;
  height: 1em;
  transition: transform .18s;
}
[data-sve-panel-head][aria-expanded="true"] [data-sve-chevron] {
  transform: rotate(180deg);
}
/* Repeats the grid the fields were lifted out of, so they keep the widths the
   blueprint gave them. The gap is the live form's own, passed in as a variable. */
[data-sve-panel-body] {
  display: none;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--sve-grid-gap, 2rem);
  padding: 1.125rem 0.875rem;
}
[data-sve-panel-head][aria-expanded="true"] + [data-sve-panel-body] {
  display: grid;
}
/* A square sized off the label beside it, so the icon tracks the type rather
   than a number. Every kind of icon ends up in the same box. */
[data-sve-icon] {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.1em;
  height: 1.1em;
  font-size: 1em;
  line-height: 1;
  opacity: .85;
}
[data-sve-icon] svg {
  display: block;
  width: 100%;
  height: 100%;
}
/* A row or card whose segment is not the one on show. */
.sve-off {
  display: none !important;
}
/* The sve-panel frame's scrolling column. Live Preview's field column brings its
   own margin, which is what the focus view strips its cards flat against; this
   frame has none, so the panel was read edge to edge on both sides. */
[data-sve-panel-column] {
  padding-inline: 1rem !important;
}
/* Statamic Live Preview × — always gone; our header close replaces it. */
.live-preview-header button[data-sve-statamic-lp-close],
[data-sve-statamic-lp-close] {
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
  width: 0 !important;
  min-width: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden !important;
}
/* --- Focus panel -----------------------------------------------------------
   The panel showing one thing: its name at the top, its fields under it, and
   none of the frame it wears as a row in a list. Everything here is scoped to
   [data-sve-focus-set] or the header — with the feature off not one rule of it
   can match, and the ordinary publish form never carries the attribute at all. */
/* Sticky, because it is the answer to "what am I editing?" and the answer is
   worth having at the bottom of a long section too. The column it sits in scrolls
   and carries its own horizontal padding, so this adds none. */
[data-sve-focus-header] {
  position: sticky;
  top: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding: 0.875rem 0 1rem;
  border-bottom: 1px solid rgba(128, 128, 128, .16);
  background: var(--color-white, #fff);
}
.dark [data-sve-focus-header] {
  background: var(--theme-color-gray-850, #1f2937);
}
[data-sve-focus-id] {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
/* The initial of the name when nothing named an icon — enough to tell one block
   from the next, and the same square either way. */
[data-sve-focus-tile] {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 0.6rem;
  background: rgba(128, 128, 128, .16);
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1;
}
[data-sve-focus-tile] [data-sve-icon] {
  width: 1.15rem;
  height: 1.15rem;
  font-size: 1.15rem;
  opacity: 1;
}
[data-sve-focus-title] {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
}
/* The way back, at the end of the line that names where you are. */
[data-sve-focus-back] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 0.55em;
  margin-left: auto;
  padding: 0.55em 0.95em;
  border-radius: 0.55rem;
  background: rgba(128, 128, 128, .16);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  transition: background-color .12s;
}
[data-sve-focus-back]:hover {
  background: rgba(128, 128, 128, .28);
}
[data-sve-focus-back-arrow] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  line-height: 1;
  font-weight: 600;
  /* Optical align with lowercase text — glyph sits a hair low otherwise. */
  transform: translateY(-1.5px);
}
[data-sve-focus-desc] {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  opacity: .6;
}
/* A row this view leaves out: a section's block list, opened from the page, and
   any segment left with nothing to show once it is gone. */
[data-sve-focus] [data-sve-focus-hide] {
  display: none !important;
}
/* The set IS the panel now. Its header bar names it a second time, its card
   draws a box around a box, and both belong to the list it was lifted out of.
   Under [data-sve-focus], which only the focused Live Preview document ever
   carries: a mark left behind can't reach an ordinary publish form from here. */
[data-sve-focus] [data-sve-focus-set] > header {
  display: none !important;
}
/* The arrow out of a block, in its own header beside the collapse chevron. Quiet
   until the header is under the pointer — the chevron is the common move, and two
   equally loud controls on one row is a decision nobody asked for. */
[data-sve-focus-step] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  margin-left: 0.25rem;
  border-radius: 0.4rem;
  opacity: .45;
  transition: opacity .12s, background-color .12s;
}
header:hover > [data-sve-focus-step] {
  opacity: .9;
}
[data-sve-focus-step]:hover {
  opacity: 1;
  background: rgba(128, 128, 128, .2);
}
/* Every wrapper between the panel and the fields — the tab pane, the page
   builder's list, the section's card and grid, the block's card. Everything they
   draw goes; the boxes themselves stay in the layout, so a wrapper that is a grid
   still lays its fields out in one. Decoration only: nothing here can hide a
   field, whatever the markup between the panel and it turns out to be. */
[data-sve-focus] [data-sve-focus-flat] {
  border: 0 !important;
  border-radius: 0 !important;
  background: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin: 0 !important;
}
/* Dividers drawn as a child rather than as a border — a set list separates its
   rows with one, and in a panel showing a single row it is a line under nothing. */
[data-sve-focus] [data-sve-focus-flat] > hr {
  display: none !important;
}
/* The field list itself, out to the same gutter as the header above it. Sides
   only: the padding it was given is the inset of a card, and the card is gone —
   what it puts above and below the fields is spacing, and that stays. */
[data-sve-focus] [data-sve-focus-flush] {
  padding-inline: 0 !important;
}
/* --- Heading outline -------------------------------------------------------
   A row draws its own share of the tree: one rail per level above it, then the
   branch it hangs from. Nothing measures anything, and a list of any depth comes
   out aligned. */
[data-sve-outline-item] {
  all: unset;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  width: 100%;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  line-height: 1.45;
}
[data-sve-outline-item]:hover {
  background: rgba(128, 128, 128, .12);
}
[data-sve-outline-item][aria-current="true"] {
  background: rgba(128, 128, 128, .16);
}
/* Stretched to the row's full height, so consecutive rows draw one unbroken line
   down the level they share. Which is also why the rows are not spaced apart: the
   air between entries is padding *inside* them, so the tree stays drawn while the
   list breathes. */
[data-sve-outline-rail] {
  flex: 0 0 1.25rem;
  align-self: stretch;
  border-left: 1px solid rgba(128, 128, 128, .55);
}
[data-sve-outline-branch] {
  flex: 0 0 1rem;
  height: 0;
  /* Half a line below the row's own top padding — level with the text it points
     at, at any zoom. */
  margin-top: 1.1em;
  border-top: 1px solid rgba(128, 128, 128, .55);
}
[data-sve-outline-level] {
  flex: 0 0 auto;
  padding: 0.45em 0 0.45em 0.5em;
  font-weight: 700;
  white-space: nowrap;
}
[data-sve-outline-level]::after {
  content: ":";
  font-weight: 400;
  opacity: .5;
}
[data-sve-outline-text] {
  padding: 0.45em 0.6em 0.45em 0.4em;
  opacity: .75;
  overflow-wrap: anywhere;
}
[data-sve-outline-item]:hover [data-sve-outline-text],
[data-sve-outline-item][aria-current="true"] [data-sve-outline-text] {
  opacity: 1;
}
/* A heading with no words in it yet: still a heading, still in the outline, and
   said so rather than drawn as a gap. */
[data-sve-outline-blank] {
  font-style: italic;
  opacity: .45;
}
/* Two severities, two colours.

   Amber is the default and covers most of it: a level reached without passing
   through the one above, a heading standing before the page's H1. None of that is
   broken — the page renders, it just doesn't read the way its levels claim.

   Red is kept for the one rule that isn't a matter of taste: exactly one H1. No
   H1 and the page never says what it is about; several and they contradict each
   other. Sparing with the red is what lets it mean something — if the skipped
   levels were red too, a page with a few loose headings would look like a fire
   and the real fault would be lost in it. */
[data-sve-outline-note] {
  margin: 0.5rem 0.75rem 0;
  padding: 0.6rem 0.7rem;
  border: 1px solid rgba(217, 119, 6, .35);
  border-radius: 0.5rem;
  background: rgba(217, 119, 6, .1);
  color: #b45309;
  font-size: 0.75rem;
  line-height: 1.45;
}
[data-sve-outline-warn] [data-sve-outline-level],
[data-sve-outline-warn] [data-sve-outline-text],
[data-sve-outline-flag] {
  color: #b45309;
}
.dark [data-sve-outline-note] {
  color: #fcd34d;
}
.dark [data-sve-outline-warn] [data-sve-outline-level],
.dark [data-sve-outline-warn] [data-sve-outline-text],
.dark [data-sve-outline-flag] {
  color: #fbbf24;
}
[data-sve-outline-warn] [data-sve-outline-text] {
  opacity: 1;
}
/* Critical — after the amber rules, so it wins on order rather than on a
   specificity trick that the next edit would have to keep track of. */
[data-sve-outline-note="critical"] {
  border-color: rgba(220, 38, 38, .4);
  background: rgba(220, 38, 38, .1);
  color: #b91c1c;
}
[data-sve-outline-warn="critical"] [data-sve-outline-level],
[data-sve-outline-warn="critical"] [data-sve-outline-text],
[data-sve-outline-warn="critical"] [data-sve-outline-flag] {
  color: #b91c1c;
}
.dark [data-sve-outline-note="critical"] {
  color: #fca5a5;
}
.dark [data-sve-outline-warn="critical"] [data-sve-outline-level],
.dark [data-sve-outline-warn="critical"] [data-sve-outline-text],
.dark [data-sve-outline-warn="critical"] [data-sve-outline-flag] {
  color: #f87171;
}
/* Sized off the row's text, so it sits on the same line whatever the zoom. */
[data-sve-outline-flag] {
  flex: 0 0 auto;
  align-self: center;
  width: 1.15em;
  height: 1.15em;
  margin-right: 0.5em;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.05em;
  text-align: center;
}
/* Live Preview header: cluster icon, mode group and the "Live Preview" title on
   the left with an even gap; the actions keep the right edge. Statamic lays the
   header out with space-between, which strands the title mid-header. */
.live-preview-header {
  justify-content: flex-start !important;
  align-items: center !important;
  gap: 1.25rem;
}
.live-preview-header > :last-child {
  margin-left: auto;
}
/* Our devices/zoom cluster sits mid-header; keep Statamic's action group right. */
#__sve-preview-chrome {
  flex: 0 0 auto;
}
/* Preview → panel pointer used to draw a blue outline on the active CP field.
   Editors found it noisy around the sidebar when drilling into a block — drop it.
   Scroll/open-on-click still uses [data-sve-active]; it just isn't drawn. */
[data-sve-active]:not([contenteditable="false"]), [data-sve-active][contenteditable="false"] > * {
  outline: none !important;
}
/* Hovering the page draws nothing over here. The pointer is already on the thing
   it means, and the panel answering every pass of the mouse with a dashed box
   around a whole section is movement without information. [data-sve-hover] is
   still set — the panel scrolls and opens by it — it just isn't drawn. */
/* One ring, never two. A marked row holding a field that has taken focus leaves
   the marking to that field — it is already saying the same thing, in the CP's own
   colour — and a marked element that contains another marked one is the outer of a
   pair, which is the one nobody needed. */
[data-sve-active]:has(:focus),
[data-sve-active]:has([data-sve-active]) {
  outline: none !important;
}
/* Grid rows: draw the outline INSIDE the row so it isn't clipped by the
   surrounding grid table border or overlapped by adjacent rows. */
[data-grid-row][data-sve-active] {
  outline: none !important;
}
.sve-highlight {
  animation: sve-highlight-pulse 0.4s ease-out;
}
@keyframes sve-highlight-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
  100% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
}
.sve-field-highlight {
  animation: sve-field-highlight-pulse 0.5s ease-out;
}
@keyframes sve-field-highlight-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.6); }
  60%  { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.2); }
  100% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
}
/* Subtle "pop" for the set preview thumbnail: fade in + slight scale up. */
.sve-thumb-inner {
  animation: sve-thumb-in 0.14s ease-out both;
}
@keyframes sve-thumb-in {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}
`;

export function sendToPreview(message, win) {
  const iframe = win.document.getElementById('live-preview-iframe');

  if (iframe && iframe.contentWindow) {
    // Use '*' as targetOrigin because the preview iframe may be served from a
    // different origin (e.g. a custom preview domain). Restricting to a specific
    // origin would silently drop messages. This is admin-only functionality so
    // the cross-origin exposure is acceptable.
    iframe.contentWindow.postMessage(message, '*');
  }
}

function getUidFromSet(setEl) {
  const inputs = setEl.querySelectorAll(SELECTORS.visualIdInput);

  for (const input of inputs) {
    if (input.closest(SELECTORS.anySet) === setEl) {
      return input.value;
    }
  }

  return null;
}

/**
 * When hovering/clicking text inside a Bard contenteditable, returns the
 * nearest preceding [data-node-view-wrapper] sibling — i.e. the last Bard
 * set node before the text. Returns null for text before any set.
 */
function findPrecedingBardSetNode(el, contentEditable) {
  if (el === contentEditable) {
    return null;
  }

  let node = el;

  while (node.parentElement && node.parentElement !== contentEditable) {
    node = node.parentElement;
  }

  if (node.parentElement !== contentEditable) {
    return null;
  }

  let prev = node.previousElementSibling;

  while (prev) {
    if (prev.hasAttribute('data-node-view-wrapper')) {
      return prev;
    }

    prev = prev.previousElementSibling;
  }

  return null;
}

/**
 * Returns the height of the nearest .bard-fixed-toolbar that sits above
 * targetEl, by walking up from targetEl to the closest .bard-fieldtype and
 * then finding its direct .bard-fixed-toolbar child.
 *
 * Using targetEl (not an outer container) ensures we find the toolbar that
 * actually overlaps the element we're about to scroll into view.
 */
function getToolbarOffset(targetEl) {
  const bardFieldtype = targetEl.closest('.bard-fieldtype');

  if (!bardFieldtype) {
    return 0;
  }

  const toolbar = bardFieldtype.querySelector('.bard-fixed-toolbar');

  if (!toolbar) {
    return 0;
  }

  const marginBlockEnd = parseFloat(getComputedStyle(toolbar).marginBlockEnd) || 0;

  return toolbar.offsetHeight + marginBlockEnd;
}

/**
 * Scrolls targetEl into view, adding a top margin equal to the nearest Bard
 * fixed toolbar height so the element is not hidden behind the sticky toolbar.
 */
function scrollToWithBardOffset(targetEl) {
  const offset = getToolbarOffset(targetEl);

  if (offset > 0) {
    const original = targetEl.style.scrollMarginTop;

    targetEl.style.scrollMarginTop = `${offset + 4}px`;
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    requestAnimationFrame(() => {
      targetEl.style.scrollMarginTop = original;
    });
  } else {
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Scrolls the Bard contenteditable inside containerEl to the text that
 * follows the set identified by afterSetUid (or to the top when null).
 */
function scrollBardToTextAfterSet(afterSetUid, containerEl) {
  const editor = containerEl.querySelector('[contenteditable="true"]');

  if (!editor) {
    return;
  }

  if (afterSetUid === null) {
    scrollToWithBardOffset(editor);

    return;
  }

  const input = editor.querySelector(`[data-visual-id="${afterSetUid}"]`);

  if (!input) {
    return;
  }

  const nodeWrapper = input.closest('[data-node-view-wrapper]');

  if (!nodeWrapper) {
    return;
  }

  scrollToWithBardOffset(nodeWrapper.nextElementSibling ?? nodeWrapper);
}

/**
 * True when the CP is running inside the front end's edit overlay (a full-screen
 * iframe on the site) rather than as a page of its own.
 */
function isEmbeddedInSite(win) {
  return win.parent !== win.self;
}

/** Tell the hosting site something happened. No-op when we aren't embedded. */
function postToHost(win, type, data = {}) {
  if (!isEmbeddedInSite(win)) {
    return;
  }

  try {
    win.parent.postMessage(
      { source: 'statamic-visual-editor', type, ...data },
      win.location.origin
    );
  } catch {
    /* the host went away */
  }
}

/**
 * Live Preview has genuinely rendered — not just "the iframe element exists".
 * Revealing on the element alone can crossfade to an empty frame.
 */
function previewPainted(doc) {
  const frame = doc.getElementById('live-preview-iframe');

  if (!frame) {
    return false;
  }

  try {
    const inner = frame.contentDocument;

    return !!(inner && inner.readyState === 'complete' && inner.body?.childElementCount);
  } catch {
    return false; // never throw out of a poll
  }
}

/**
 * The front-end "Rediger" button opens this with ?live-preview=1 — open Live
 * Preview straight away by clicking the CP's own button, then drop the param so
 * a refresh doesn't reopen it.
 *
 * Two ways in:
 *  - Embedded in the site's edit overlay: the site keeps us invisible and
 *    crossfades us in, so we just report when the preview has painted.
 *  - Navigated to directly: we cover ourselves in the colour of the page we came
 *    from, so the admin never flashes up behind Live Preview.
 */
/**
 * Statamic's own "open Live Preview" button, found in whatever language the CP is
 * speaking — matching the English label alone left every other locale waiting on
 * the failsafe, staring at a blank cover.
 */
function livePreviewButton(doc) {
  return [...doc.querySelectorAll('button, a')].find((el) => {
    const text = `${el.textContent || ''} ${el.getAttribute('title') || ''}`;

    return /live.?preview|forhåndsvis|vorschau|voorbeeld|aperçu|vista previa/i.test(text);
  });
}

/**
 * The screen that stands in while Live Preview opens.
 *
 * Flat colour alone reads as "nothing is happening" — which is exactly what the
 * old cover looked like for the second or two it was up. The spinner says the
 * wait is deliberate, and the colour is the page you were just looking at, so it
 * feels like the page staying rather than the CMS loading.
 */
/**
 * The preview exactly as it stands, kept on screen while the next one is fetched.
 *
 * The preview is same-origin, so its document can simply be copied into a second,
 * inert iframe. Not a screenshot — another rendering of the same page — which is
 * why it holds up at whatever size it is dropped into. Scripts are stripped: a
 * still that keeps running is a page, and two live copies of one page is exactly
 * what this exists to avoid.
 *
 * Null when there is nothing to copy — no preview open, or a document the browser
 * won't let us read. The cover then falls back to flat colour, as it always did.
 */
function buildPreviewStill(win) {
  try {
    const frame = previewFrame(win.document);
    const inner = frame?.contentDocument;
    const root = inner?.documentElement;

    if (!root) {
      return null;
    }

    const rect = frame.getBoundingClientRect();

    if (rect.width < 1 || rect.height < 1) {
      return null;
    }

    const clone = root.cloneNode(true);

    clone.querySelectorAll('script').forEach((script) => script.remove());

    // Relative URLs in the copy resolve against the Control Panel unless the page
    // says otherwise, and every image and stylesheet on the page is relative.
    const head = clone.querySelector('head');

    if (head && !head.querySelector('base')) {
      const base = inner.createElement('base');

      base.setAttribute('href', inner.baseURI);
      head.prepend(base);
    }

    const scrollTop = root.scrollTop || inner.body?.scrollTop || 0;
    const still = win.document.createElement('iframe');

    still.setAttribute('aria-hidden', 'true');
    still.setAttribute('tabindex', '-1');
    // Pixels here are a measurement, not a choice: the still stands exactly where
    // the preview it copies stood.
    still.style.cssText =
      `position:absolute;left:${Math.round(rect.left)}px;top:${Math.round(rect.top)}px;` +
      `width:${Math.round(rect.width)}px;height:${Math.round(rect.height)}px;border:0;`;
    still.addEventListener('load', () => {
      try {
        still.contentWindow.scrollTo(0, scrollTop);
      } catch {
        /* close enough without it */
      }
    });
    still.srcdoc = `<!doctype html>${clone.outerHTML}`;

    return still;
  } catch {
    return null; // never let a nicety stop the move
  }
}

function buildLpCover(doc, background, { blocking = false, still = null, label = null } = {}) {
  const cover = doc.createElement('div');

  cover.id = LP_COVER_ID;
  cover.style.cssText =
    'position:fixed;inset:0;z-index:2147483647;opacity:1;' +
    // On a page load there's nothing behind this worth hitting, so clicks pass
    // through. On a move that stays in the document the old page's controls are
    // still under here, live and invisible — poking those is worse than being
    // unable to poke anything.
    `pointer-events:${blocking ? 'auto' : 'none'};` +
    'display:flex;align-items:center;justify-content:center;' +
    // Mid grey rather than currentColor: the cover wears the page's colour, which
    // could be anything — grey is the one ink that reads on both a white page and
    // a near-black one.
    `background:${background};color:#9ca3af;transition:opacity .45s ease;`;

  const style = doc.createElement('style');

  style.textContent = '@keyframes sve-lp-spin{to{transform:rotate(360deg)}}';
  cover.appendChild(style);

  // The page you were looking at, still there. Added first so the rest sits on it.
  if (still) {
    cover.appendChild(still);

    // Dimmed, over exactly the area the preview occupied. It says the page is on
    // its way out without taking it off the screen — and it is what stops the
    // spinner from looking like part of whatever it happens to be sitting over.
    const scrim = doc.createElement('div');

    scrim.style.cssText =
      `position:absolute;left:${still.style.left};top:${still.style.top};` +
      `width:${still.style.width};height:${still.style.height};background:rgba(0,0,0,.5);`;

    cover.appendChild(scrim);
  }

  // Without a still there is nothing to stand on and the spinner is the whole
  // message, so it stays bare and centred. With one, the page is the picture and
  // the spinner is a note laid on top of it — a card, or it reads as part of the
  // page it is sitting on.
  const card = doc.createElement('div');

  card.style.cssText = still
    ? 'position:relative;display:flex;align-items:center;gap:.5em;padding:.6875em 1em;' +
      'border-radius:.625em;background:rgba(24,24,27,.92);color:#fff;' +
      'font:500 .8125rem/1 ui-sans-serif,system-ui,sans-serif;' +
      'box-shadow:0 .75em 2em rgba(0,0,0,.35);'
    : 'position:relative;display:flex;align-items:center;justify-content:center;line-height:1;';

  card.innerHTML =
    '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
    `stroke-linecap="round" style="${still ? '' : 'font-size:1.5rem;'}display:block;opacity:.85;` +
    'animation:sve-lp-spin 1s linear infinite;">' +
    '<path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>';

  if (still && label) {
    const text = doc.createElement('span');

    text.textContent = label;
    card.appendChild(text);
  }

  cover.appendChild(card);

  return cover;
}


/**
 * Covers the screen *before* leaving, in the colour of the preview you're looking
 * at, and hands that colour to the next page so its own cover matches. Without
 * this the CP is bare for the moment between the click and the next page booting
 * — which is the whole reason switching pages felt like a trip through the
 * dashboard rather than a step sideways.
 */
function previewBackground(win) {
  let background = '#fff';

  try {
    const frame = previewFrame(win.document);
    const body = frame?.contentDocument?.body;
    const colour = body ? win.getComputedStyle(body).backgroundColor : null;

    // A transparent body tells us nothing — better a plain white than a flash of
    // the CP showing through.
    if (colour && !/rgba\(0,\s*0,\s*0,\s*0\)|transparent/.test(colour)) {
      background = colour;
    }
  } catch {
    /* cross-origin preview — white it is */
  }

  try {
    // Handed to the next page so its own cover starts in the same colour.
    win.localStorage.setItem('sve-lp-bg', background);
  } catch {
    /* private mode */
  }

  return background;
}

/**
 * The colour of the Control Panel screen being left, for the same reason the
 * preview's is taken above: a cover in the wrong colour is a flash, and coming
 * from a listing there is no preview to take a colour from. Stashed under the
 * same key, so a page that boots fresh finds it waiting.
 */
function cpBackground(win) {
  let background = '#fff';

  try {
    const colour = win.getComputedStyle(win.document.body).backgroundColor;

    if (colour && !/rgba\(0,\s*0,\s*0,\s*0\)|transparent/.test(colour)) {
      background = colour;
    }

    win.localStorage.setItem('sve-lp-bg', background);
  } catch {
    /* private mode */
  }

  return background;
}

/**
 * Puts the cover up, and calls `then` once it is actually on screen.
 *
 * The move waits for that call. A copy of the page needs a moment to parse and
 * paint, and putting the cover up before it has is the flicker: for a frame or
 * two there is flat colour where the page was. So the cover goes up invisible —
 * in the document, because that is the only way the copy loads at all — and is
 * only shown once the copy is painted. Nothing moves on screen during the wait:
 * the real page is still there, live, underneath.
 */
function coverForNavigation(win, { blocking = false, background = null, then = null } = {}) {
  const doc = win.document;

  // Copied before anything else: the moment the router starts a visit, the page
  // this is a copy of is on its way out.
  const still = buildPreviewStill(win);

  // With a still, the only thing left showing is the frame around the preview —
  // header and editor panel — so the cover wears the Control Panel's colour and
  // the whole thing reads as the chrome staying put. Without one it stands in for
  // the page itself, and the page's own colour is the closest thing to not moving.
  const colour = background ?? (still ? cpBackground(win) : previewBackground(win));
  const cover = buildLpCover(doc, colour, { blocking, still, label: t(win, 'loading') });

  doc.getElementById(LP_COVER_ID)?.remove();

  cover.style.transition = 'none';
  cover.style.opacity = still ? '0' : '1';
  (doc.body ?? doc.documentElement).appendChild(cover);

  let shown = false;

  const show = () => {
    if (shown) {
      return;
    }

    shown = true;

    if (cover.isConnected) {
      cover.style.opacity = '1';

      // Put back for the way out: the reveal fades this cover away, and it needs
      // something to fade with. A frame later, so it can't catch the line above.
      win.requestAnimationFrame(() => {
        cover.style.transition = 'opacity .45s ease';
      });
    }

    then?.();
  };

  if (still) {
    /**
     * Is there a page in the copy yet?
     *
     * Watched rather than waited for. An iframe's `load` is the wrong signal
     * twice over: it fires once for the empty document the frame starts life
     * with — before the copy has been parsed at all — and then not again until
     * every image on the page has arrived, which on a page of photographs is far
     * later than the moment it is worth looking at. Laid out is what matters
     * here; the images are already in the browser's cache from the preview this
     * is a copy of, and arrive a frame or two behind.
     */
    const painted = () => {
      try {
        const inner = still.contentDocument;

        return (
          !!inner &&
          inner.readyState !== 'loading' &&
          (inner.body?.children.length ?? 0) > 0 &&
          (inner.body?.scrollHeight ?? 0) > 0
        );
      } catch {
        return false;
      }
    };

    // Two frames after it lays out: the first is the layout, the second the paint.
    // Shown on the first, the page is measured but not yet drawn — which is the
    // flicker in its smallest form.
    const poll = (frames = 0) => {
      if (painted()) {
        win.requestAnimationFrame(() => win.requestAnimationFrame(show));

        return;
      }

      if (frames < 90) {
        win.requestAnimationFrame(() => poll(frames + 1));
      }
    };

    poll();

    // A copy that never lays out must not hold the move up, and neither must a
    // tab the browser has stopped animating. The flat colour it falls back to is
    // the old behaviour, which was at least never stuck.
    win.setTimeout(show, 1500);
  } else {
    show();
  }

  if (!blocking) {
    return; // a page load is about to take this whole document with it anyway
  }

  // A cover that swallows clicks must never depend on a later step running to
  // come down. If the move is cancelled, the visit fails, or the preview never
  // opens, this is what still lifts it — long enough after the ordinary reveal
  // (and its own 12s failsafe) to never race them.
  win.setTimeout(() => {
    if (doc.getElementById(LP_COVER_ID) === cover) {
      cover.remove();
    }
  }, 15000);
}

function autoOpenLivePreview(win) {
  const params = new URLSearchParams(win.location.search);

  if (params.get('live-preview') !== '1') {
    return;
  }

  // The full-load way in — a browser without the router, or the front-end edit
  // button, which leaves no note and so claims nothing.
  claimOrigin(win);
  openLivePreviewCovered(win);
}

/**
 * Opens Live Preview behind a cover, and reveals once it has painted.
 *
 * Split out from the page-load path so an in-app navigation can reuse it: the
 * entry picker swaps pages without a reload, so there's no boot to hook into,
 * but the same "hide the CP, open the preview, fade in" is exactly what's wanted.
 */
function openLivePreviewCovered(win, { closePanels = false } = {}) {
  const doc = win.document;
  const embedded = isEmbeddedInSite(win);

  // Kick Theme Settings load as early as possible (cover is up — free bandwidth).
  scheduleChromeGlobalsPrefetch(win);

  let cover = null;

  // An in-app move has already put a cover up — one holding a still of the page it
  // left. Looked for whether or not we're embedded: when the editor is running in
  // the site's overlay, this is the only code that ever takes that cover down, and
  // it blocks clicks while it's up. Missing it here strands the whole editor
  // behind a photograph.
  cover = doc.getElementById(LP_COVER_ID);

  if (!cover && !embedded) {
    // The front-end button stashes the colour it was sitting on. (It uses
    // localStorage rather than a query param so the link's URL stays identical
    // and the browser's prerender of this page can actually be reused.)
    let background = '#fff';

    try {
      background = win.localStorage.getItem('sve-lp-bg') || background;
    } catch {
      /* private mode */
    }

    cover = buildLpCover(doc, background);
    (doc.body ?? doc.documentElement).appendChild(cover);
  }

  const stripParams = () => {
    const url = new URL(win.location.href);

    url.searchParams.delete('live-preview');
    win.history.replaceState({}, '', url);
  };

  const reveal = () => {
    stripParams(); // Statamic rewrites the URL as it opens — clean it once more.
    hideNavSpinner(win);

    if (embedded) {
      postToHost(win, 'lp-ready'); // the site fades its own overlay in
    }

    if (!cover) {
      return;
    }

    cover.style.opacity = '0';
    setTimeout(() => cover.remove(), 500);
  };

  if (closePanels) {
    // Arriving on another page means arriving at the page, not at a form. Every
    // panel standing open belongs to the entry you just left — the fields in the
    // editor pane, the globals or section panel on the right — so they all go,
    // whatever the remembered mode says. The mode itself is left alone: it's a
    // preference about this page, not a verdict on the next one.
    closeRightPanels(win);
    setLpCollapsed(win, true);
  } else {
    // Live Preview opens with the editor panel following the remembered mode —
    // hide/auto arrive closed (looking like the site, not a CMS); an explicitly
    // chosen `show` is respected.
    setLpCollapsed(win, lpMode(win) !== 'show');
  }

  // Never leave anyone stranded behind an opaque cover (or an overlay that never
  // appears).
  const failsafe = setTimeout(reveal, 12000);

  let attempts = 0;
  let clicked = false;

  const open = () => {
    if (previewPainted(doc)) {
      clearTimeout(failsafe);
      // One paint tick, so the preview is on screen before anyone fades to it.
      setTimeout(reveal, 150);

      return;
    }

    if (!clicked) {
      const button = livePreviewButton(doc);

      if (button) {
        button.click();
        clicked = true;
        stripParams();
      }
    }

    if (++attempts < 150) {
      setTimeout(open, 100);
    } else {
      clearTimeout(failsafe);
      reveal();
    }
  };

  open();
}

// --- Opening an entry straight into the preview -------------------------------
//
// For the collections named on the settings screen, clicking an entry lands in
// Live Preview instead of the publish form behind it. The form is untouched —
// closing the preview puts you in it, on the same entry — and every collection
// left off the list opens exactly as Statamic ships it.
//
// The one thing every route in shares is the entry's own edit URL: the listing,
// the page tree, search, the dashboard. So that URL is what's watched, in two
// places, because a click is not always what makes the move. Both end in the
// same `?live-preview=1` the front-end edit button already uses.

/** `/cp/collections/{handle}/entries/{id}` — the screen this feature is about. */
const ENTRY_EDIT_PATH = /\/collections\/([^/]+)\/entries\/(?!create(?:\/|$))[^/?#]+/;

function openInPreviewCollections(win) {
  const list = win.Statamic?.$config?.get?.('sveOpenInPreview');

  return Array.isArray(list) ? list : [];
}

/**
 * The URL to open instead, or null to leave the move alone.
 *
 * Already inside Live Preview, the answer is always null: moving between entries
 * in there is the picker's job, and it knows things this doesn't — whether there
 * is unsaved work, and what to do about it.
 */
function previewUrlFor(win, href, collections) {
  if (livePreviewEditorEl(win.document)) {
    return null;
  }

  let url;

  try {
    url = new URL(href, win.location.origin);
  } catch {
    return null;
  }

  if (url.origin !== win.location.origin || url.searchParams.get('live-preview') === '1') {
    return null;
  }

  const match = url.pathname.match(ENTRY_EDIT_PATH);

  if (!match || !collections.includes(match[1])) {
    return null;
  }

  url.searchParams.set('live-preview', '1');

  return url.toString();
}

// Where the entry was opened from, so the way out leads back there.
//
// Written to sessionStorage by the page making the move and claimed by the page
// arriving: the fallback path is a full page load, which takes any variable with
// it, so the note has to survive one document boundary — but no more than one.
const OPEN_IN_PREVIEW_ORIGIN = 'sve-open-in-preview-origin';

// The note, once claimed: this document's preview and where it came from.
let openedFrom = null;

function rememberOrigin(win, entryPath, from) {
  try {
    win.sessionStorage.setItem(OPEN_IN_PREVIEW_ORIGIN, JSON.stringify({ entry: entryPath, from }));
  } catch {
    /* private mode — the way out is then the ordinary one */
  }
}

/**
 * Take the note left by the page that made the move, if this is the arrival it
 * was left for.
 *
 * Read once and deleted whether or not it matched. A note that outlived its own
 * arrival is worse than no note: open the same entry by hand a while later, press
 * ×, and you would be sent to a list you never came from.
 */
function claimOrigin(win) {
  let note = null;

  try {
    note = JSON.parse(win.sessionStorage.getItem(OPEN_IN_PREVIEW_ORIGIN) ?? 'null');
    win.sessionStorage.removeItem(OPEN_IN_PREVIEW_ORIGIN);
  } catch {
    return;
  }

  if (note?.from && note.entry === win.location.pathname) {
    openedFrom = note;
  }
}

/**
 * The screen this entry was opened from, or null if it wasn't opened that way.
 *
 * Checked against the entry on screen, not just the session: the picker moves to
 * another entry without leaving the preview, and that one was not clicked in any
 * list.
 */
function originForCurrentEntry(win) {
  return openedFrom?.entry === win.location.pathname ? openedFrom.from : null;
}

function forgetOrigin(win) {
  openedFrom = null;

  try {
    win.sessionStorage.removeItem(OPEN_IN_PREVIEW_ORIGIN);
  } catch {
    /* nothing was stored either */
  }
}

/**
 * Makes the move, covered.
 *
 * Inertia fetches the next screen while this one is still up, so the cover only
 * has to hide the moment between the swap and the preview painting — the same
 * trip the entry picker makes. Without a router it's a plain load, and the param
 * is picked up on the way in by autoOpenLivePreview.
 *
 * The panels are deliberately NOT closed on the way in. Moving between entries
 * inside the preview does close them, because everything standing open belongs
 * to the entry being left; arriving from the Control Panel there is nothing open
 * to belong to anything, and forcing it shut would override the editor panel's
 * own remembered Hidden/Auto/Visible.
 */
function goToPreview(win, url) {
  const router = win.__STATAMIC__?.inertia?.router;
  const background = cpBackground(win);

  rememberOrigin(win, new URL(url, win.location.origin).pathname, win.location.href);

  if (!router?.visit) {
    win.location.href = url;

    return;
  }

  coverForNavigation(win, {
    blocking: true,
    background,
    then: () =>
      router.visit(url, {
        onSuccess: () => {
          claimOrigin(win);
          openLivePreviewCovered(win);
        },
        onError: () => win.document.getElementById(LP_COVER_ID)?.remove(),
      }),
  });
}

function initOpenInPreview(win) {
  const collections = openInPreviewCollections(win);

  if (!collections.length) {
    return;
  }

  // The link, caught on the way down so it never reaches Inertia's own handler.
  win.document.addEventListener(
    'click',
    (event) => {
      // Anything but a plain left click belongs to the browser: a middle click or
      // ⌘-click is asking for a tab, and a tab should open what the link says.
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = event.target?.closest?.('a[href]');

      if (!anchor || (anchor.target && anchor.target !== '_self')) {
        return;
      }

      const url = previewUrlFor(win, anchor.href, collections);

      if (!url) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      goToPreview(win, url);
    },
    true
  );

  // And the move that no link made: a row that navigates from JavaScript never
  // produces a click on an `<a>`, so it would otherwise slip past. Cancelled and
  // re-issued from the next tick, so the router isn't asked to start a visit
  // while it is still calling one off.
  //
  // Waited for rather than read once: this runs as the CP boots, and the router
  // is put on `__STATAMIC__` by Inertia's own start-up. Asking too early and
  // giving up would lose the net for the whole session.
  const hookRouter = (attempts = 0) => {
    const router = win.__STATAMIC__?.inertia?.router;

    if (typeof router?.on !== 'function') {
      if (attempts < 50) {
        win.setTimeout(() => hookRouter(attempts + 1), 100);
      }

      return;
    }

    router.on('before', (event) => {
      const visit = event.detail?.visit;

      if (!visit || (visit.method && String(visit.method).toLowerCase() !== 'get')) {
        return;
      }

      const url = previewUrlFor(win, String(visit.url), collections);

      if (!url) {
        return;
      }

      win.setTimeout(() => goToPreview(win, url), 0);

      return false;
    });
  };

  hookRouter();
}

// Notified with `true`/`false` whenever the entry is written back (or fails to
// be). Watching the network rather than a Statamic event: `saved` is emitted on
// the publish component, not on a global bus, so there is nothing to listen to
// from out here.
const saveListeners = [];

function onEntrySave(callback) {
  saveListeners.push(callback);

  return () => {
    const index = saveListeners.indexOf(callback);

    if (index !== -1) {
      saveListeners.splice(index, 1);
    }
  };
}

/**
 * Watch for the entry being written back.
 *
 * Statamic saves an entry to the very URL its edit screen lives at, and publishes
 * to a path just below it. Anchoring on that path is what keeps the CP's other
 * chatter — Live Preview's own render POST, preference writes — from reading as a
 * save.
 */
function watchEntrySaves(win) {
  const entryPath = win.location.pathname;

  const isSave = (url, method) => {
    if (!url || !/^(POST|PUT|PATCH)$/i.test(method || 'GET')) {
      return false;
    }

    let path;

    try {
      path = new URL(url, win.location.origin).pathname;
    } catch {
      return false;
    }

    return path.startsWith(entryPath) && !path.includes('/preview');
  };

  const announce = (ok, rearm) => {
    if (ok) {
      // The site under the editor overlay is now showing stale content.
      postToHost(win, 'lp-saved');
      markEntryFormClean(win);
    } else {
      rearm();
    }

    [...saveListeners].forEach((listener) => listener(ok));
  };

  const { fetch: originalFetch } = win;

  win.fetch = function (input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url;
    const method = init.method ?? (typeof input === 'object' ? input?.method : null);

    if (!isSave(url, method)) {
      return originalFetch.call(this, input, init);
    }

    const rearm = disarmUnloadWarning(win);

    return originalFetch.call(this, input, init).then(
      (response) => {
        announce(response.ok, rearm);

        return response;
      },
      (error) => {
        announce(false, rearm);

        throw error;
      }
    );
  };

  const { open: originalOpen } = win.XMLHttpRequest.prototype;

  win.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    if (isSave(url, method)) {
      const rearm = disarmUnloadWarning(win);

      this.addEventListener('load', () => announce(this.status >= 200 && this.status < 300, rearm));
      this.addEventListener('error', () => announce(false, rearm));
    }

    return originalOpen.call(this, method, url, ...rest);
  };
}

/**
 * Statamic guards against losing unsaved edits with beforeunload handlers. From
 * the moment a save request is in flight, that guard can only misfire: the
 * content is already written server-side by the time anything reacts to it — and
 * things do react. In dev, Vite's full-reload sees the content file change and
 * reloads the site (this page's host) before the save response is even back,
 * which put up a "changes you made may not be saved" prompt about changes that
 * were being saved.
 *
 * So: stand the guard down when a save starts. Returns a re-arm function for
 * when the save fails and the edits genuinely are unsaved again.
 */
function disarmUnloadWarning(win) {
  const dirty = win.Statamic?.$dirty;

  if (!dirty) {
    return () => {};
  }

  let names = [];

  try {
    const raw = typeof dirty.names === 'function' ? dirty.names() : dirty.names;
    const list = unwrapRef(raw);

    names = Array.isArray(list) ? [...list] : [];
    dirty.disableWarning?.();
    names.forEach((name) => dirty.remove(name));
  } catch {
    /* best effort — worst case the browser asks */
  }

  return () => {
    try {
      names.forEach((name) => dirty.add(name));
    } catch {
      /* same */
    }
  };
}

/**
 * True when the open entry has edits that haven't been written back.
 *
 * Prefer a value snapshot taken when Live Preview settled (see
 * scheduleEntryBaseline). Statamic's $dirty alone is unreliable here:
 * with revisions enabled, Save stays clickable even when clean (canSave ≠
 * isDirty), and mount/hydration often leaves a sticky dirty.has('base').
 */
function hasUnsavedChanges(win) {
  // Value-diff against the clean baseline — the authoritative signal for the
  // back button. Falls through only before the baseline exists.
  if (entryValuesBaseline != null) {
    const now = serializeEntryValues();

    if (now != null) {
      return now !== entryValuesBaseline;
    }
  }

  const dirty = win.Statamic?.$dirty;

  if (typeof dirty?.has !== 'function') {
    // No dirty API and no baseline yet — assume clean so Back doesn't trap.
    return false;
  }

  try {
    if (typeof dirty.count === 'function' && dirty.count() === 0) {
      return false;
    }

    const raw = typeof dirty.names === 'function' ? dirty.names() : dirty.names;
    const list = unwrapRef(raw);

    if (Array.isArray(list)) {
      if (!list.length) {
        return false;
      }

      const tracked = new Set(
        publishContainers.map((container) => container.name).filter(Boolean)
      );

      tracked.add('base');

      return list.some((name) => tracked.has(name) && dirty.has(name));
    }
  } catch {
    /* fall through */
  }

  const tracked = new Set(
    publishContainers.map((container) => container.name).filter(Boolean)
  );

  tracked.add('base');

  return [...tracked].some((name) => dirty.has(name));
}

/**
 * Drops the dirty marks — what discarding means. Left up, they'd re-arm the
 * warning on the *next* navigation, long after the edits they stood for are gone.
 */
function discardChanges(win) {
  const dirty = win.Statamic?.$dirty;

  if (typeof dirty?.remove !== 'function') {
    return;
  }

  const names = new Set(publishContainers.map((container) => container.name).filter(Boolean));

  names.add('base');

  // Statamic's own list — it knows about containers we never saw.
  if (typeof dirty.names === 'function') {
    (dirty.names() ?? []).forEach((name) => names.add(name));
  }

  names.forEach((name) => dirty.remove(name));
}

/**
 * Calls off Statamic's own unsaved-changes confirm for the navigation we're about
 * to make. We've already asked — in our own dialog, in the middle of the screen —
 * and a second, native "Are you sure?" on top of that is just the same question
 * twice.
 *
 * Clearing the dirty marks is not enough on its own: the guard is a router
 * listener that fires its confirm unconditionally, and it's only unhooked by a
 * Vue watcher on the dirty list — which flushes on the next tick, after our visit
 * has already been cancelled. This is Statamic's own synchronous escape hatch,
 * the one its actions use for `bypassesDirtyWarning`.
 */
function dismissDirtyWarning(win) {
  win.Statamic?.$dirty?.disableWarning?.();
}

function saveButtonIn(doc) {
  const header = lpHeader(doc);

  return [...(header?.querySelectorAll('button') ?? [])].find((button) => {
    const text = (button.textContent || '').trim();

    if (isPublishButtonLabel(text)) {
      return false;
    }

    return /^(save|gem)\b/i.test(text);
  });
}

/**
 * "Publish…" / "Publicér…" — present only when revisions are enabled.
 */
function publishButtonIn(doc) {
  const header = lpHeader(doc);

  return [...(header?.querySelectorAll('button') ?? [])].find((button) =>
    isPublishButtonLabel((button.textContent || '').trim())
  );
}

function isPublishButtonLabel(text) {
  return /^(publish|udgiv|public[eé]r)\b/i.test(text);
}

/**
 * Leaving right when the save response lands races Statamic's own handling of
 * it: the dirty flag is still up for a beat, and unloading in that window makes
 * the browser ask "changes you made may not be saved" — about changes that WERE
 * just saved. So wait for the flag to drop, and disarm Statamic's unload warning
 * (its own switch for exactly this) as a backstop before leaving.
 */
function leaveQuietly(win, leave, attempts = 0) {
  if (hasUnsavedChanges(win) && attempts < 30) {
    setTimeout(() => leaveQuietly(win, leave, attempts + 1), 100);

    return;
  }

  try {
    // Force-clear leftover dirty marks so the browser / Statamic don't block leave.
    if (hasUnsavedChanges(win)) {
      discardChanges(win);
    }

    win.Statamic?.$dirty?.disableWarning?.();
  } catch {
    /* best effort — worst case the browser asks */
  }

  leave();
}

// --- Globals beside Live Preview -------------------------------------------------
//
// A picker in the Live Preview header lists the global sets. Choosing one opens
// it in a panel on the right — as an iframe of Statamic's own globals screen, so
// every fieldtype, replicator and validation works exactly as it does in the CP.
// (The left editor pane belongs to Statamic's Vue tree; putting a second publish
// form in there tears the entry form down.)
//
// Typing in that form re-renders the preview immediately: the values are posted
// to the addon, which stashes them for the session, and the preview is asked to
// render again with `sve_globals=1` — the middleware then swaps the saved globals
// for these unsaved ones. Statamic itself only re-renders when the ENTRY changes,
// so the re-render is triggered by replaying the last preview URL.

const GLOBALS_PANEL_ID = '__sve-globals-panel';
const GLOBALS_PICKER_ID = '__sve-globals-picker';
const GLOBALS_PANEL_PARAM = 'sve-panel';
const GLOBALS_DEBOUNCE = 200;

// The URL of the most recent preview render, replayed whenever a global changes.
let lastPreviewUrl = null;
let globalsSaveTimer = null;

function globalSets(win) {
  const sets = win.Statamic?.$config?.get?.('sveGlobalSets');

  return Array.isArray(sets) ? sets : [];
}

function csrfToken(win) {
  return (
    win.document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
    win.Statamic?.$config?.get?.('csrfToken') ||
    win.Statamic?.$config?.get?.('csrf_token') ||
    ''
  );
}

/**
 * The live Live Preview header — never the frozen copy of it.
 *
 * While a move is in flight there are two on the page: the real bar, and the
 * still on the cover that keeps it from blinking out. They match selector for
 * selector, so anything reaching for the header by class alone stands a good
 * chance of finding the photograph — and our own pollers would then build the
 * pickers into a bar that's about to be thrown away.
 */
function lpHeader(doc) {
  return (
    [...doc.querySelectorAll('.live-preview-header')].find((el) => !el.closest(`#${LP_COVER_ID}`)) ??
    null
  );
}

function previewFrame(doc) {
  return doc.getElementById('live-preview-iframe');
}

/**
 * Clicking the page closes what the sidebar has open.
 *
 * Every popover in the CP — the colour picker, the select and dropdown menus —
 * closes on a pointerdown somewhere else in the CP document. A click inside the
 * preview is a pointerdown in the *iframe's* document, which that check never
 * sees, so a picker opened in the sidebar stayed on screen over the panel while
 * you carried on working on the page. The iframe is same-origin, so the fix is
 * to let the CP have the event too: forward it as a bare pointerdown on the CP
 * body, which every one of those popovers reads as "outside" and dismisses.
 *
 * pointerdown only, never click. The CP's own click handler treats a click that
 * lands on no set as "nothing is selected any more" and clears the outline —
 * which is the outline the preview click just put there.
 */
function ensurePreviewOutsideDismiss(win) {
  const frame = previewFrame(win.document);

  if (!frame) {
    return;
  }

  const forward = () => {
    try {
      win.document.body?.dispatchEvent(
        new win.PointerEvent('pointerdown', { bubbles: true, cancelable: true })
      );
    } catch {
      /* nothing to dismiss with */
    }
  };

  // Re-armed per document: the preview reloads on every render, and the new
  // document carries none of the old one's listeners.
  const arm = () => {
    let doc;

    try {
      doc = frame.contentDocument;
    } catch {
      return; // cross-origin — nothing we can read
    }

    if (!doc || doc.__sveOutsideDismiss) {
      return;
    }

    doc.__sveOutsideDismiss = true;
    doc.addEventListener('pointerdown', forward, true);
  };

  arm();

  if (!frame.__sveOutsideDismiss) {
    frame.__sveOutsideDismiss = true;
    frame.addEventListener('load', arm);
  }
}

/** Ask the preview to render again, with or without the unsaved globals. */
function refreshPreview(win, active) {
  const frame = previewFrame(win.document);

  if (!frame?.contentWindow || !lastPreviewUrl) {
    return;
  }

  frame.contentWindow.postMessage(
    {
      name: 'sve.globals',
      active,
      url: lastPreviewUrl,
      // Authoritative for surgical morph — don't rely on html class races alone.
      chromeKind: active ? activeChromeKind : null,
    },
    win.location.origin
  );
}

/** Header/footer currently stepped into from Live Preview (null when not). */
let activeChromeKind = null;

function setActiveChromeKind(kind) {
  activeChromeKind = kind === 'footer' || kind === 'header' ? kind : null;
}

/** Tell the preview iframe to keep header/footer chrome focus (soft rebind). */
function assertChromeFocusInPreview(win) {
  if (!activeChromeKind) {
    return;
  }

  const kind = activeChromeKind;

  // One quiet ping after morph settles — not a burst (that caused flicker).
  clearTimeout(assertChromeFocusInPreview._timer);
  assertChromeFocusInPreview._timer = setTimeout(() => {
    sendToPreview({ source: 'statamic-visual-editor', type: 'sve-restore-chrome', kind }, win);
  }, 120);
}

/**
 * Records the URL of each preview render. Statamic POSTs the entry's values and
 * gets back a tokenised URL; that URL is what the preview iframe loads, and what
 * we replay to re-render after a global changes.
 */
function watchPreviewRenders(win) {
  const isPreviewCall = (url, method) =>
    typeof url === 'string' && url.includes('/preview') && /^POST$/i.test(method || 'GET');

  const remember = (payload) => {
    try {
      const data = typeof payload === 'string' ? JSON.parse(payload) : payload;

      if (data?.url) {
        lastPreviewUrl = data.url;
      }
    } catch {
      /* not the payload we expected */
    }
  };

  const { fetch: originalFetch } = win;

  win.fetch = function (input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url;
    const method = init.method ?? (typeof input === 'object' ? input?.method : null);
    const request = originalFetch.call(this, input, init);

    if (!isPreviewCall(url, method)) {
      return request;
    }

    return request.then((response) => {
      response.clone().json().then(remember).catch(() => {});

      return response;
    });
  };

  // Statamic's CP talks to the server through axios, i.e. XMLHttpRequest — the
  // preview render never goes through fetch at all.
  const { open: originalOpen } = win.XMLHttpRequest.prototype;

  win.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    if (isPreviewCall(url, method)) {
      this.addEventListener('load', () => {
        if (this.status >= 200 && this.status < 300) {
          remember(this.response ?? this.responseText);
        }
      });
    }

    return originalOpen.call(this, method, url, ...rest);
  };
}

function postGlobals(win, handle, values) {
  clearTimeout(globalsSaveTimer);

  const epoch = globalsStashEpoch;

  globalsSaveTimer = setTimeout(() => {
    if (epoch !== globalsStashEpoch || !globalsAcceptValues) {
      return;
    }

    globalsStashActive = true;
    notifyChromeDirty(win);
    win
      .fetch('/!/sve/globals-preview', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken(win),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ handle, values }),
      })
      .then(() => {
        refreshPreview(win, true);
        // The render that just went out replaces nodes in the preview. Chrome
        // focus is the fade, the outline and the bar that says what you are
        // editing and whether it is saved — all of it lives on those nodes, and
        // a render that lands without this leaves you editing the header with
        // nothing on screen saying so. Entering chrome asserts it once; typing
        // is what renders after that, so it has to assert it too.
        assertChromeFocusInPreview(win);
      })
      .catch(() => {
        /* the preview simply keeps the last render */
      });
  }, GLOBALS_DEBOUNCE);
}

/** True after we've pushed unsaved globals into the preview stash. */
let globalsStashActive = false;

/** Bumped on discard/save-clear so late polls can't resurrect "unsaved". */
let globalsStashEpoch = 0;

/** False while discarding/reloading so in-flight value polls are ignored. */
let globalsAcceptValues = true;

/** Serialized form snapshot considered "saved" while chrome focus is active. */
let chromeValuesBaseline = null;

/** Ignore value polls until this timestamp (tab-lock settle after chrome open). */
let chromeIgnoreValuePostsUntil = 0;

/** Cancel pending stash POSTs and ignore value polls until re-enabled. */
function invalidateGlobalsPreviewStash() {
  clearTimeout(globalsSaveTimer);
  globalsSaveTimer = null;
  globalsStashEpoch += 1;
  globalsStashActive = false;
  globalsAcceptValues = false;
  chromeValuesBaseline = null;
}

/** Mark chrome form clean after open/save/discard settle. */
function markChromeFormClean(win) {
  globalsStashActive = false;
  clearGlobalsDirtyMarks(win);

  // Edited in this window the form is right here, and what it holds a moment
  // after a save is the saved thing: Statamic replaces its values with what the
  // server sent back, and that lands a beat after the request resolves. Read as
  // an edit, it put the bar back to "unsaved changes" a quarter of a second
  // after saving — and then Close asked whether to discard work that was already
  // on disk. The window covers the echo; the poll adopts it as the new baseline.
  const container = chromeHost(win.document) ? chromeContainer() : null;

  if (container) {
    const values = unwrapRef(container.values);

    if (values && typeof values === 'object') {
      chromeValuesBaseline = JSON.stringify(values);
      chromeValuesSeen = chromeValuesBaseline;
    }

    chromeIgnoreValuePostsUntil = Date.now() + 2000;
    notifyChromeDirty(win);

    return;
  }

  try {
    const iwin = globalsPanelFrame(win)?.contentWindow;
    const doc = iwin?.document;

    if (doc) {
      for (const container of activeContainers(doc)) {
        const values = unwrapRef(container.values);

        if (values && typeof values === 'object') {
          chromeValuesBaseline = JSON.stringify(values);
        }

        break;
      }
    }
  } catch {
    /* ignore */
  }

  notifyChromeDirty(win);
}

/** Tell the preview whether the chrome Save button should show. */
function notifyChromeDirty(win) {
  const dirty = hasUnsavedGlobals(win);
  const saveBtn = win.document.querySelector('[data-sve-globals-save-btn]');

  if (saveBtn) {
    saveBtn.style.display = dirty ? '' : 'none';
  }

  sendToPreview(
    {
      source: 'statamic-visual-editor',
      type: 'sve-chrome-dirty',
      dirty,
    },
    win
  );
}

/**
 * What the open global section calls itself, for the bar in the preview.
 *
 * Read off the values the panel streams up rather than the entry's own title:
 * the bar names the same thing the panel's header does — "Hero style 5" — and
 * that is the set's display name, not what the section was filed under in the
 * library.
 */
function globalSectionLabel(win) {
  const rows = sectionPanelValues?.values?.[sectionField(win)];
  const type = Array.isArray(rows) && rows.length ? rows[0]?.type : null;

  if (typeof type !== 'string' || !type) {
    return null;
  }

  return setMeta(win, type)?.display || humanizeHandle(type);
}

/** Tell the preview whether the global-section Save button should show. */
function notifyGlobalSectionDirty(win) {
  sendToPreview(
    {
      source: 'statamic-visual-editor',
      type: 'sve-global-dirty',
      dirty: hasUnsavedGlobalSection(win),
      label: globalSectionLabel(win),
    },
    win
  );
}

/** Listeners for Theme Settings / globals-panel save results (iframe). */
const globalsSaveListeners = [];

function onGlobalsSave(callback) {
  globalsSaveListeners.push(callback);

  return () => {
    const index = globalsSaveListeners.indexOf(callback);

    if (index !== -1) {
      globalsSaveListeners.splice(index, 1);
    }
  };
}

function globalsPanelFrame(win) {
  return win.document.getElementById(GLOBALS_PANEL_ID)?.querySelector('iframe') || null;
}

/**
 * Theme Settings (and other globals panels) live in a separate iframe, so the
 * entry form's Statamic.$dirty never sees them. The preview stash is the other
 * signal: any keystroke that refreshed the preview left unsaved globals in cache.
 */
function hasUnsavedGlobals(win) {
  // Edited in this window there is no second $dirty to ask — the form shares the
  // page's — so the value poll's stash is the whole answer, exactly as it is for
  // the docked panel while chrome focus is on.
  if (chromeHost(win.document)) {
    return globalsStashActive;
  }

  const panel = win.document.getElementById(GLOBALS_PANEL_ID);
  const hidden =
    !panel ||
    panel.hasAttribute('data-sve-chrome-hidden') ||
    panel.style.visibility === 'hidden';

  // Prefetch loads Theme Settings off-screen; its hydrate must not count as edits.
  if (hidden) {
    return false;
  }

  if (globalsStashActive) {
    return true;
  }

  // Header/footer chrome: Statamic $dirty stays sticky after tab-lock / remount
  // and falsely shows Save. Only our value-poll stash counts as real edits.
  if (activeChromeKind) {
    return false;
  }

  const iwin = globalsPanelFrame(win)?.contentWindow;

  if (!iwin) {
    return false;
  }

  try {
    const dirty = iwin.Statamic?.$dirty;

    if (typeof dirty?.has !== 'function') {
      return false;
    }

    const raw = typeof dirty.names === 'function' ? dirty.names() : dirty.names;
    const list = unwrapRef(raw);

    // Empty names ⇒ clean. Don't fall through to a bare `has('base')` which
    // can stay true after discard and falsely keep the chrome Save bar on.
    if (Array.isArray(list)) {
      return list.some((name) => dirty.has(name));
    }

    return dirty.has('base');
  } catch {
    return false;
  }
}

/** Entry form and/or Theme Settings / globals panel have edits not on disk. */
function hasUnsavedWork(win) {
  return hasUnsavedChanges(win) || hasUnsavedGlobals(win) || hasUnsavedGlobalSection(win);
}

/** Clear Statamic.$dirty marks inside the Theme Settings iframe. */
function clearGlobalsDirtyMarks(win) {
  const iwin = globalsPanelFrame(win)?.contentWindow;

  if (!iwin) {
    return;
  }

  try {
    const dirty = iwin.Statamic?.$dirty;

    if (typeof dirty?.remove === 'function') {
      const names = new Set(['base']);
      const raw = typeof dirty.names === 'function' ? dirty.names() : dirty.names;
      const list = unwrapRef(raw);

      if (Array.isArray(list)) {
        list.forEach((name) => names.add(name));
      }

      names.forEach((name) => dirty.remove(name));
    }

    dirty?.disableWarning?.();
  } catch {
    /* best effort */
  }

  // Re-baseline the iframe value poll so the post-save form snapshot
  // doesn't immediately re-mark chrome as dirty.
  try {
    iwin.postMessage(
      { source: 'statamic-visual-editor', type: 'sve-globals-saved' },
      win.location.origin
    );
  } catch {
    /* ignore */
  }
}

/** Drop Theme Settings dirty marks + preview stash (discard path). */
function discardGlobalsChanges(win, { refresh = false, reloadForm = false } = {}) {
  // Stop late value polls / debounced stash POSTs from re-marking dirty.
  invalidateGlobalsPreviewStash();

  if (reloadForm) {
    // In this window the form is rebuilt from the CP's own answer next time, so
    // taking it down IS the reload — and it takes every dirty mark with it.
    if (closeChromeInline(win, { refresh })) {
      globalsAcceptValues = true;

      return clearGlobalsStash(win, { refresh, force: true }).then(() => notifyChromeDirty(win));
    }

    // Destroy the dirty iframe entirely. In-place reload left Statamic.$dirty
    // (and stale polls) sticky, so re-entering chrome still showed Save.
    const panel = win.document.getElementById(GLOBALS_PANEL_ID);

    panel?._svePinRo?.disconnect?.();
    panel?.remove();
    globalsAcceptValues = true;
    releaseLeftEdgeIfFree(win);
    syncPreviewInset(win);

    return clearGlobalsStash(win, { refresh, force: true }).then(() => {
      notifyChromeDirty(win);
      scheduleChromeGlobalsPrefetch(win);
    });
  }

  clearGlobalsDirtyMarks(win);
  globalsAcceptValues = true;

  return clearGlobalsStash(win, { refresh, force: true }).then(() => {
    notifyChromeDirty(win);
  });
}

/**
 * Click Theme Settings' Save (via the panel iframe) and wait for the network
 * result. Resolves true on success / nothing to save, false on failure/timeout.
 */
function saveGlobalsPanel(win, done) {
  if (!hasUnsavedGlobals(win)) {
    done(true);

    return;
  }

  const host = chromeHost(win.document);
  const iwin = globalsPanelFrame(win)?.contentWindow;

  // Nothing open to save into: whatever the stash still holds is not backed by a
  // form any more, so it goes.
  if (!host && !iwin) {
    clearGlobalsStash(win, { refresh: false }).finally(() => done(true));

    return;
  }

  let settled = false;

  const finish = (ok) => {
    if (settled) {
      return;
    }

    settled = true;
    stop();
    clearTimeout(timer);
    done(ok);
  };

  const stop = onGlobalsSave(finish);
  const timer = win.setTimeout(() => finish(false), LP_SAVE_TIMEOUT);

  if (host) {
    pressChromeSave(win);

    return;
  }

  iwin.postMessage(
    { source: 'statamic-visual-editor', type: 'sve-globals-save' },
    win.location.origin
  );
}

/**
 * Watch POSTs to the globals edit URL inside the Theme Settings iframe so we
 * know when Save actually landed (and can clear the preview stash).
 * Must be installed from the parent CP window (stash + listeners live there).
 * Statamic saves via axios → XMLHttpRequest; also wrap fetch for completeness.
 */
function watchGlobalsPanelSaves(iwin, parentWin, entryPath = null) {
  if (!iwin || !parentWin || iwin.__sveGlobalsSaveWatch) {
    return;
  }

  iwin.__sveGlobalsSaveWatch = true;

  // A function, not a string, because the window being watched can be this one:
  // the CP is not reloaded between one global and the next, so which path counts
  // as "the save" changes while the same patched fetch stays in place.
  const globalsPath = entryPath ?? (() => iwin.location.pathname);

  const isSave = (url, method) => {
    if (!url || !/^(POST|PUT|PATCH)$/i.test(method || 'GET')) {
      return false;
    }

    const base = globalsPath();

    if (!base) {
      return false;
    }

    let path;

    try {
      path = new URL(url, iwin.location.origin).pathname;
    } catch {
      return false;
    }

    return path.startsWith(base) && !path.includes('/preview');
  };

  const announce = (ok) => {
    if (ok) {
      // What the form holds is now what is on disk, so every read taken on the
      // way here is stale — including the debounced stash POST that may still be
      // waiting to go out. Dropped by bumping the epoch, and the reads that
      // arrive while the save settles are covered by the window below; without
      // both, the bar went back to "unsaved changes" moments after saving and
      // Close then offered to discard work that was already saved.
      globalsStashEpoch += 1;
      clearTimeout(globalsSaveTimer);
      chromeIgnoreValuePostsUntil = Date.now() + 2500;

      // Keep flag true so clearGlobalsStash still hits the server endpoint.
      globalsStashActive = true;
      globalsAcceptValues = true;
      clearGlobalsDirtyMarks(parentWin);
      clearGlobalsStash(parentWin, { refresh: false }).then(() => {
        markChromeFormClean(parentWin);
      });

      // Theme Settings are part of every preview's fingerprint, so saving them
      // makes every picture in the library wrong at once — and the server starts
      // retaking them within the second. The library has no way to hear that on
      // its own: it stopped polling when the last run finished, so an open panel
      // would sit on the old colours until the whole Control Panel was reloaded.
      // That is the shape the bug took — the page went blue, the thumbnails
      // stayed orange, and nothing was actually wrong on disk.
      libraryWentStale(parentWin);
    }

    [...globalsSaveListeners].forEach((listener) => listener(ok));
  };

  const { fetch: originalFetch } = iwin;

  iwin.fetch = function (input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url;
    const method = init.method ?? (typeof input === 'object' ? input?.method : null);

    if (!isSave(url, method)) {
      return originalFetch.call(this, input, init);
    }

    return originalFetch.call(this, input, init).then(
      (response) => {
        announce(response.ok);

        return response;
      },
      (error) => {
        announce(false);

        throw error;
      }
    );
  };

  // Axios uses XHR — without this, chrome Save never clears dirty UI.
  const { open: originalOpen, send: originalSend } = iwin.XMLHttpRequest.prototype;

  iwin.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.__sveGlobalsMethod = method;
    this.__sveGlobalsUrl = url;

    return originalOpen.call(this, method, url, ...rest);
  };

  iwin.XMLHttpRequest.prototype.send = function (...args) {
    if (isSave(this.__sveGlobalsUrl, this.__sveGlobalsMethod)) {
      this.addEventListener('load', () => {
        announce(this.status >= 200 && this.status < 300);
      });
      this.addEventListener('error', () => announce(false));
    }

    return originalSend.apply(this, args);
  };
}

function ensureGlobalsPanelSaveWatch(win) {
  const frame = globalsPanelFrame(win);

  if (!frame) {
    return;
  }

  const arm = () => {
    try {
      if (frame.contentWindow) {
        globalsAcceptValues = true;
        watchGlobalsPanelSaves(frame.contentWindow, win);
      }
    } catch {
      /* iframe not ready */
    }
  };

  arm();
  frame.addEventListener('load', arm);
}

function clearGlobalsStash(win, { refresh = true, force = false } = {}) {
  if (!globalsStashActive && !force) {
    if (refresh) {
      // Nothing stashed — don't bounce the preview.
    }

    notifyChromeDirty(win);

    return Promise.resolve();
  }

  globalsStashActive = false;

  return win
    .fetch('/!/sve/globals-preview/clear', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'X-CSRF-TOKEN': csrfToken(win), 'X-Requested-With': 'XMLHttpRequest' },
    })
    .catch(() => {})
    .then(() => {
      notifyChromeDirty(win);

      if (refresh) {
        refreshPreview(win, false);
      }
    });
}

function closeGlobalsPanel(win) {
  // Whichever one is open. Only one ever is.
  if (closeChromeInline(win)) {
    return;
  }

  const panel = win.document.getElementById(GLOBALS_PANEL_ID);

  if (!panel) {
    return;
  }

  panel._svePinRo?.disconnect?.();
  panel.remove();
  releaseLeftEdgeIfFree(win);
  syncPreviewInset(win);
  clearGlobalsStash(win, { refresh: true });

  // Warm the next open so footer/header clicks stay instant after close.
  scheduleChromeGlobalsPrefetch(win);
}

/**
 * Keep the Theme Settings iframe mounted (off-screen) so the next open is
 * instant. Does NOT clear the preview stash — that only happens on explicit
 * discard / close / save-clear.
 */
function parkGlobalsPanel(win) {
  const doc = win.document;

  // Nothing to park in this window: the form is built from the Control Panel's
  // own answer in a few hundred milliseconds, so stepping back in is quick
  // without keeping a copy of it alive behind the page.
  if (closeChromeInline(win)) {
    return;
  }

  const panel = doc.getElementById(GLOBALS_PANEL_ID);

  if (!panel) {
    return;
  }

  panel.style.cssText =
    'position:fixed;left:-10000px;top:0;width:440px;height:100vh;z-index:-1;' +
    'display:flex;flex-direction:column;visibility:hidden;pointer-events:none;' +
    'background:var(--theme-color-content-bg,#fff);';
  panel.setAttribute('data-sve-chrome-hidden', '1');
  forcePanelOpen = false;
  syncPreviewInset(win);
}

const GLOBALS_WIDTH_KEY = 'sve-globals-panel-width';
const GLOBALS_MIN_WIDTH = 320;

function globalsPanelWidth(win) {
  let stored = 0;

  try {
    stored = Number(win.localStorage.getItem(GLOBALS_WIDTH_KEY)) || 0;
  } catch {
    /* private mode */
  }

  const max = Math.max(GLOBALS_MIN_WIDTH, win.innerWidth - 360);

  return Math.min(Math.max(stored || 440, GLOBALS_MIN_WIDTH), max);
}

/**
 * Drag handle on a docked panel's inner edge; the width is remembered.
 * `side: 'right'` = panel on the right (handle on its left). `side: 'left'` =
 * panel on the left (handle on its right).
 */
function panelResizer(win, panel, { side = 'right', storageKey = GLOBALS_WIDTH_KEY, onResize } = {}) {
  const handle = win.document.createElement('div');

  handle.style.cssText =
    side === 'left'
      ? 'position:absolute;right:0;top:0;bottom:0;width:6px;cursor:col-resize;z-index:1;touch-action:none;'
      : 'position:absolute;left:0;top:0;bottom:0;width:6px;cursor:col-resize;z-index:1;touch-action:none;';
  handle.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    handle.setPointerCapture(event.pointerId);

    const frame = panel.querySelector('iframe');

    if (frame) {
      frame.style.pointerEvents = 'none';
    }

    const onMove = (move) => {
      const max = Math.max(GLOBALS_MIN_WIDTH, win.innerWidth - 360);
      const width =
        side === 'left'
          ? Math.min(Math.max(move.clientX, GLOBALS_MIN_WIDTH), max)
          : Math.min(Math.max(win.innerWidth - move.clientX, GLOBALS_MIN_WIDTH), max);

      panel.style.width = `${width}px`;
      syncPreviewInset(win);
      onResize?.(width);
    };

    const onUp = () => {
      win.removeEventListener('pointermove', onMove);
      win.removeEventListener('pointerup', onUp);

      if (frame) {
        frame.style.pointerEvents = '';
      }

      try {
        win.localStorage.setItem(storageKey, String(parseInt(panel.style.width, 10)));
      } catch {
        /* private mode */
      }
    };

    win.addEventListener('pointermove', onMove);
    win.addEventListener('pointerup', onUp);
  });

  return handle;
}

/** @deprecated alias — right-docked panels */
function globalsResizer(win, panel, onResize) {
  return panelResizer(win, panel, { side: 'right', onResize });
}

function globalsPanelUrl(win, set) {
  const url = new URL(set.url, win.location.origin);

  url.searchParams.set(GLOBALS_PANEL_PARAM, '1');

  return url.toString();
}

/** Prefetch Theme Settings as early as possible (even before Live Preview). */
let chromePrefetchArmed = false;

function scheduleChromeGlobalsPrefetch(win) {
  win.setTimeout(() => prefetchChromeGlobals(win), 0);
}

/**
 * Background-load theme_settings into a hidden iframe. Page sections feel instant
 * because their form is already mounted; chrome needs the same head start —
 * ideally before the user opens Live Preview at all.
 */
function prefetchChromeGlobals(win) {
  const doc = win.document;

  // Don't run inside the panel iframe itself.
  if (new URLSearchParams(win.location.search).has(GLOBALS_PANEL_PARAM)) {
    return;
  }

  // What a click actually opens is the in-window form, and until now this warmed
  // the docked iframe instead — the fallback, the one path a click almost never
  // takes. So the head start went to the wrong door and the panel was a second
  // or two behind the click, every time.
  if (CHROME_INLINE) {
    warmChromeInlinePages(win);

    return;
  }

  if (doc.getElementById(GLOBALS_PANEL_ID)) {
    return;
  }

  const handle = chromeGlobalHandle(win);
  const sets = globalSets(win);
  const set = sets.find((candidate) => candidate.handle === handle);

  if (!set) {
    return;
  }

  openGlobalsPanel(win, set, { prefetch: true });
}

function openGlobalsPanel(win, set, options = {}) {
  const doc = win.document;
  const existing = doc.getElementById(GLOBALS_PANEL_ID);
  const keepLibrary = options.keepLibrary === true;
  const prefetch = options.prefetch === true;
  const chromeLock = options.chromeLock === 'footer' || options.chromeLock === 'header' ? options.chromeLock : null;

  // Switching sets reuses the panel rather than replacing it. Tearing an iframe
  // out of the page discards its session-history entries, and the browser then
  // traverses the joint history to recover — which fires `popstate` on the top
  // window. In the front-end edit overlay that reads as "the user pressed Back",
  // and the whole editor closes a few seconds after you pick a second global set.
  if (existing) {
    if (prefetch) {
      return;
    }

    const frame = existing.querySelector('iframe');
    const title = existing.querySelector('[data-sve-globals-title]');

    if (frame && title) {
      title.textContent = chromeLock === 'footer' ? 'Footer' : chromeLock === 'header' ? 'Header' : set.title;
      frame.title = set.title;
      showGlobalsPanel(win);
      ensureGlobalsPanelSaveWatch(win);

      // Same set already loaded: do NOT location.replace — a dirty form inside
      // the iframe triggers Chrome's "Leave site?" dialog and blocks the editor.
      if (existing.getAttribute('data-sve-globals-handle') === set.handle) {
        if (chromeLock) {
          lockChromeGlobalsTab(win, chromeLock);
        } else {
          setActiveChromeKind(null);
          unlockChromeGlobalsTabs(win);
        }

        return;
      }

      existing.setAttribute('data-sve-globals-handle', set.handle);
      // New document → need a fresh save watch on the next load.
      try {
        delete frame.contentWindow.__sveGlobalsSaveWatch;
      } catch {
        /* ignore */
      }
      frame.contentWindow.location.replace(globalsPanelUrl(win, set));

      if (chromeLock) {
        lockChromeGlobalsTab(win, chromeLock);
      } else {
        setActiveChromeKind(null);
        unlockChromeGlobalsTabs(win);
      }

      return;
    }

    existing.remove();
  }

  // Theme Settings docks on the right. Close the sections library unless a
  // chrome style write explicitly wants it kept (keepLibrary).
  if (!prefetch) {
    if (chromeLock) {
      closeRightPanels(win, [GLOBALS_PANEL_ID, CHROME_DESIGNS_ID]);
    } else {
      closeRightPanels(
        win,
        keepLibrary
          ? [GLOBALS_PANEL_ID, SECTION_PICKER_ID, CHROME_DESIGNS_ID]
          : [GLOBALS_PANEL_ID]
      );
    }
  }

  const panel = doc.createElement('div');

  panel.id = GLOBALS_PANEL_ID;
  panel.setAttribute('data-sve-globals-handle', set.handle);
  panel.setAttribute('data-sve-chrome-hidden', '1');

  const bar = doc.createElement('div');

  bar.style.cssText =
    'display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px 8px 14px;' +
    'border-bottom:1px solid rgba(128,128,128,.24);font:600 13px/1 ui-sans-serif,system-ui,sans-serif;' +
    'color:currentColor;flex:0 0 auto;';
  const title = doc.createElement('span');

  title.setAttribute('data-sve-globals-title', '');
  title.textContent = chromeLock === 'footer' ? 'Footer' : chromeLock === 'header' ? 'Header' : set.title;
  bar.appendChild(title);

  // The CP's own Save sits in the page header, which the panel strips away — so
  // the panel carries its own, wired to the real button inside the frame.
  const actions = doc.createElement('div');

  actions.style.cssText = 'display:flex;align-items:center;gap:6px;';

  const save = doc.createElement('button');

  save.type = 'button';
  save.setAttribute('data-sve-globals-save-btn', '');
  save.textContent = t(win, 'save');
  save.title = t(win, 'save_globals');
  save.style.cssText =
    'all:unset;cursor:pointer;padding:5px 12px;border-radius:6px;background:var(--theme-color-primary,#4f46e5);' +
    'color:#fff;font-size:12px;font-weight:600;line-height:1;';
  // Same rule as the chrome bottom bar — only when Theme Settings is dirty.
  save.style.display = hasUnsavedGlobals(win) ? '' : 'none';
  save.addEventListener('click', () => {
    const frame = doc.getElementById(GLOBALS_PANEL_ID)?.querySelector('iframe');

    frame?.contentWindow?.postMessage(
      { source: 'statamic-visual-editor', type: 'sve-globals-save' },
      win.location.origin
    );
  });
  actions.appendChild(save);

  const close = doc.createElement('button');

  close.type = 'button';
  close.textContent = '✕';
  close.title = t(win, 'close');
  close.style.cssText =
    'all:unset;cursor:pointer;width:26px;height:26px;display:inline-flex;align-items:center;' +
    'justify-content:center;border-radius:6px;color:currentColor;opacity:.7;';
  close.addEventListener('mouseenter', () => (close.style.background = 'rgba(128,128,128,.18)'));
  close.addEventListener('mouseleave', () => (close.style.background = 'transparent'));
  close.addEventListener('click', () => {
    // Same close rules as the preview chrome bar (warn if dirty).
    if (activeChromeKind) {
      handleRequestCloseChrome(win);

      return;
    }

    if (hasUnsavedGlobals(win)) {
      confirmCloseDiscard(
        win,
        { titleKey: 'chrome_close_title', bodyKey: 'chrome_close_body' },
        () => {
          discardGlobalsChanges(win, { refresh: true, reloadForm: false }).then(() => {
            const picker = doc.getElementById(GLOBALS_PICKER_ID);

            if (picker) {
              picker.value = '';
            }

            closeGlobalsPanel(win);
          });
        }
      );

      return;
    }

    const picker = doc.getElementById(GLOBALS_PICKER_ID);

    if (picker) {
      picker.value = '';
    }

    closeGlobalsPanel(win);
  });
  actions.appendChild(close);
  bar.appendChild(actions);

  const frame = doc.createElement('iframe');

  frame.src = globalsPanelUrl(win, set);
  frame.title = set.title;
  frame.style.cssText = 'flex:1 1 auto;width:100%;border:0;background:transparent;';

  panel.appendChild(bar);
  panel.appendChild(frame);
  ensureGlobalsPanelSaveWatch(win);

  // Always keep the panel on document.body. Reparenting the iframe reloads it
  // and refreshes the Live Preview — that was the visible "loading" flicker.
  doc.body.appendChild(panel);

  if (prefetch) {
    panel.style.cssText =
      'position:fixed;left:-10000px;top:0;width:440px;height:100vh;z-index:-1;' +
      'display:flex;flex-direction:column;visibility:hidden;pointer-events:none;' +
      'background:var(--theme-color-content-bg,#fff);';
    panel.setAttribute('data-sve-chrome-hidden', '1');
  } else {
    panel.removeAttribute('data-sve-chrome-hidden');
    pinGlobalsPanelRight(win, panel);
    syncPreviewInset(win);

    if (chromeLock) {
      lockChromeGlobalsTab(win, chromeLock);
    }
  }
}

/** The global-set picker, sat beside the panel-mode buttons in the LP header. */
function ensureGlobalsPicker(win) {
  const doc = win.document;
  const group = doc.getElementById(LP_MODE_ID);
  const sets = globalSets(win);

  if (!group || !sets.length || doc.getElementById(GLOBALS_PICKER_ID)) {
    return;
  }

  const select = doc.createElement('select');

  select.id = GLOBALS_PICKER_ID;
  select.title = 'Rediger globale indstillinger ved siden af previewet';
  select.style.cssText = FRAMED_SELECT_STYLE;

  const placeholder = doc.createElement('option');

  placeholder.value = '';
  placeholder.textContent = t(win, 'globals');
  select.appendChild(placeholder);

  sets.forEach((set) => {
    const option = doc.createElement('option');

    option.value = set.handle;
    option.textContent = set.title;
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    const set = sets.find((candidate) => candidate.handle === select.value);

    if (set) {
      openGlobalsPanel(win, set);
    } else {
      closeGlobalsPanel(win);
    }
  });

  // Same option already selected does not fire `change` — click re-shows a
  // parked Theme Settings panel without reloading the iframe.
  select.addEventListener('click', () => {
    const set = sets.find((candidate) => candidate.handle === select.value);

    if (!set) {
      return;
    }

    const panel = doc.getElementById(GLOBALS_PANEL_ID);

    if (!panel || panel.hasAttribute('data-sve-chrome-hidden')) {
      openGlobalsPanel(win, set);
    }
  });

  // Wrapperen bliver stående selv om der kun er én kontrol i den: applyHeaderTab
  // viser og skjuler kontrollerne på `parentElement`, og uden den ville selecten
  // selv være det der blev slået til og fra.
  const wrap = doc.createElement('div');

  wrap.style.cssText = 'display:inline-flex;align-items:center;font-family:inherit;';
  wrap.appendChild(select);
  group.after(wrap);
}

const LIBRARY_BUTTON_ID = '__sve-library-btn';

/** A "Sektioner" toggle in the LP header that opens/closes the section library. */
function ensureSectionLibraryButton(win) {
  const doc = win.document;
  const group = doc.getElementById(LP_MODE_ID);

  if (!group || doc.getElementById(LIBRARY_BUTTON_ID)) {
    return;
  }

  const btn = doc.createElement('button');

  btn.id = LIBRARY_BUTTON_ID;
  btn.type = 'button';
  btn.title = t(win, 'sections');
  btn.innerHTML =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="3" y="3" width="7" height="7" rx="1"/>' +
    '<rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>' +
    '<rect x="14" y="14" width="7" height="7" rx="1"/></svg>';
  btn.style.cssText =
    'height:28px;display:inline-flex;align-items:center;gap:6px;padding:0 10px;border-radius:8px;cursor:pointer;' +
    'color:currentColor;background:rgba(128,128,128,.16);border:none;font-size:12px;font-weight:500;font-family:inherit;';
  btn.append(t(win, 'sections'));
  btn.addEventListener('click', () => openSectionPicker(win));

  // After the globals picker if it exists, otherwise right after the mode group.
  (doc.getElementById(GLOBALS_PICKER_ID) || group).after(btn);
  syncSectionLibraryAvailability(win);
}

/**
 * Runs inside the globals panel's iframe: strips the CP chrome down to the form,
 * and streams the form's values up to the Live Preview window as they're typed.
 */
function initGlobalsPanelFrame(win) {
  const doc = win.document;

  if (!new URLSearchParams(win.location.search).has(GLOBALS_PANEL_PARAM)) {
    return false;
  }

  const style = doc.createElement('style');

  style.textContent = `
    html, body {
      background: transparent !important;
      margin: 0 !important;
      padding: 0 !important;
      height: 100% !important;
    }
    [data-sve-panel-hide] {
      display: none !important;
      height: 0 !important;
      max-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      border: 0 !important;
      min-height: 0 !important;
    }
    /* Synced-section entry: always hide library meta + Published, even before
       JS finds the exact wrappers (Statamic 6 markup varies / may omit field_*). */
    html[data-sve-entry-panel] #field_title,
    html[data-sve-entry-panel] #field_synced,
    html[data-sve-entry-panel] #field_section_type,
    html[data-sve-entry-panel] #field_preview_image,
    html[data-sve-entry-panel] [name="published"],
    html[data-sve-entry-panel] input[name="published"] {
      display: none !important;
    }
    /* Top-level title (library name) — not titles inside the section set. */
    html[data-sve-entry-panel] .publish-fields > [class*="title-fieldtype"],
    html[data-sve-entry-panel] .publish-form > * > [class*="title-fieldtype"] {
      display: none !important;
    }
    /* Tabs tight under the outer SVE bar — no large empty band above fields. */
    main {
      margin: 0 !important;
      padding-block: 0 !important;
      padding-inline: 0 !important;
    }
    main > *:first-child {
      margin-block-start: 0 !important;
      padding-block-start: 0 !important;
    }
    [role="tablist"],
    nav[role="tablist"],
    .tabs {
      margin-block: 0 !important;
      padding-block: 0 !important;
    }
    /* Chrome lock: kill every spacer above the fields — toggle sits outside the iframe. */
    html[data-sve-chrome-locked] [role="tablist"],
    html[data-sve-chrome-locked] [data-sve-chrome-tablist-lock],
    html[data-sve-chrome-locked] [data-sve-chrome-spacer] {
      display: none !important;
      height: 0 !important;
      max-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      border: 0 !important;
      min-height: 0 !important;
    }
    html[data-sve-chrome-locked],
    html[data-sve-chrome-locked] body {
      margin: 0 !important;
      padding: 0 !important;
    }
    html[data-sve-chrome-locked] main,
    html[data-sve-chrome-locked] main > *,
    html[data-sve-chrome-locked] .publish-form,
    html[data-sve-chrome-locked] .publish-sections,
    html[data-sve-chrome-locked] .tabs-container,
    html[data-sve-chrome-locked] [data-reka-tabs-root],
    html[data-sve-chrome-locked] [data-orientation] {
      margin-top: 0 !important;
      margin-block-start: 0 !important;
      padding-top: 0 !important;
      padding-block-start: 0 !important;
      gap: 0 !important;
      row-gap: 0 !important;
    }
    html[data-sve-chrome-locked] .publish-sections > .card,
    html[data-sve-chrome-locked] main .card {
      margin: 0 !important;
      margin-top: 0 !important;
      padding-top: 10px !important;
      border-top-left-radius: 0 !important;
      border-top-right-radius: 0 !important;
    }
    html[data-sve-chrome-locked] .publish-fields {
      padding-top: 0 !important;
      margin-top: 0 !important;
    }
    html[data-sve-chrome-locked] .publish-section-header,
    html[data-sve-chrome-locked] .section-header,
    html[data-sve-chrome-locked] [data-section-header],
    html[data-sve-chrome-locked] .publish-fields > h2,
    html[data-sve-chrome-locked] .publish-fields > h3,
    html[data-sve-chrome-locked] .card > header,
    html[data-sve-chrome-locked] .card > .flex.items-center:first-child:has(h1),
    html[data-sve-chrome-locked] .card > .flex.items-center:first-child:has(h2),
    html[data-sve-chrome-locked] .card > .flex.items-center:first-child:has(h3) {
      display: none !important;
      margin: 0 !important;
      padding: 0 !important;
      height: 0 !important;
      overflow: hidden !important;
    }
  `;
  doc.head.appendChild(style);

  // The same panel serves a global SET (/cp/globals/<handle>) and a global
  // SECTION (/cp/collections/<c>/entries/<id>) — both are just a publish form in
  // an iframe. The path says which; each stashes through its own channel, and
  // only an entry brings its own Save button along.
  const isEntry = win.location.pathname.includes('/collections/');

  if (isEntry) {
    doc.documentElement.setAttribute('data-sve-entry-panel', '');
  }

  // Strip the CP's own chrome (top bar, main nav) but nothing else: the publish
  // form lives inside <main>, and it has plenty of its own <header>s (every
  // replicator set) and <nav>s (the tab bar) that must survive.
  const hideChrome = () => {
    const main = doc.querySelector('main');

    doc.querySelectorAll('nav, header').forEach((el) => {
      if (main && (main.contains(el) || el.contains(main))) {
        return;
      }

      el.setAttribute('data-sve-panel-hide', '');
    });

    // Inside <main>: hide the publish page toolbar (globe + title + Save) — the
    // outer SVE panel already has title/Save/✕. Leave replicator/Bard set headers
    // alone (they carry [data-drag-handle]).
    if (main) {
      main.querySelectorAll('header').forEach((el) => {
        if (el.querySelector('[data-drag-handle]')) {
          return;
        }

        const hasSave = [...el.querySelectorAll('button')].some((button) =>
          /^(save|gem)\b/i.test((button.textContent || '').trim())
        );

        if (hasSave) {
          el.setAttribute('data-sve-panel-hide', '');
        }
      });
    }

    // Always hide Save in the iframe — globals and entries. The panel's Save
    // still clicks the real (hidden) button via postMessage. Also climb to the
    // title row (Statamic 6 often uses a div, not <header>) and hide that too.
    doc.querySelectorAll('button').forEach((button) => {
      if (!/^(save|gem)\b/i.test((button.textContent || '').trim())) {
        return;
      }

      button.setAttribute('data-sve-panel-hide', '');
      button.nextElementSibling?.setAttribute('data-sve-panel-hide', '');

      let node = button.parentElement;

      for (let depth = 0; node && node !== main && depth < 6; depth += 1, node = node.parentElement) {
        if (node.querySelector('[data-drag-handle]')) {
          break;
        }

        const hasTitle = node.querySelector('h1, h2');

        if (hasTitle) {
          node.setAttribute('data-sve-panel-hide', '');
          break;
        }
      }
    });

    // Synced-section entry: hide library meta + publish chrome so the panel
    // matches a normal section focus view (not Navn/Synced/Published/SEO).
    if (isEntry) {
      hideSavedSectionEntryChrome(doc);
    }
  };

  // When set (e.g. "header"), chrome focus hides every other publish tab so you
  // can't jump to Colors / Typography while editing the site header/footer.
  let lockedTabNeedle = null;

  // Tabs this global set never shows in the docked panel (see the addon's
  // `chrome.hidden_tabs`). Header and footer are edited by clicking them on the
  // page; the tab is a second way in that shows you nothing while you type.
  //
  // Hidden here only — the ordinary Control Panel globals screen is untouched,
  // so nothing becomes unreachable. And chrome focus still LOCKS to these tabs,
  // which is why they're only hidden while unlocked: a `display:none` tab has no
  // offsetParent, and the lock finds its tab among the visible ones.
  // Read per call, not once at boot: `Statamic.$config` is populated while the
  // CP boots, and this runs early enough that caching it could catch an empty
  // one and then never look again. A config get and an array lookup are cheap.
  const hiddenTabNeedles = () => {
    if (isEntry) {
      return [];
    }

    const map = win.Statamic?.$config?.get?.('sveHiddenGlobalsTabs') || {};
    const handle = win.location.pathname.split('/').filter(Boolean).pop();

    return Array.isArray(map[handle]) ? map[handle] : [];
  };

  const isHiddenTab = (tab, needles = hiddenTabNeedles()) => {
    const text = (tab.textContent || '').trim().toLowerCase();

    return needles.some((needle) => text === needle || text.startsWith(needle));
  };

  const activatePublishTab = (needle) => {
    if (!needle) {
      return false;
    }

    const tabs = [...doc.querySelectorAll('button[role="tab"]')].filter(
      (el) => el.offsetParent !== null
    );
    const tab = tabs.find((el) => {
      const text = (el.textContent || '').trim().toLowerCase();

      return text === needle || text.startsWith(needle);
    });

    if (!tab) {
      return false;
    }

    if (tab.getAttribute('aria-selected') !== 'true') {
      ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
        tab.dispatchEvent(new win.PointerEvent(type, { bubbles: true, cancelable: true }));
      });
    }

    return tab.getAttribute('aria-selected') === 'true';
  };

  const applyTabLock = () => {
    const tabs = [...doc.querySelectorAll('button[role="tab"]')];

    if (!lockedTabNeedle) {
      const needles = hiddenTabNeedles();

      doc.documentElement.removeAttribute('data-sve-chrome-locked');

      // Decided before anything is hidden, and from the tabs actually on screen:
      // reka-ui keeps a hidden measurement copy of every tab, and a tab we hide
      // ourselves stops being findable the same way.
      const visible = tabs.filter((tab) => tab.offsetParent !== null);
      const selected = visible.find((tab) => tab.getAttribute('aria-selected') === 'true');
      const fallback = visible.find((tab) => !isHiddenTab(tab, needles));
      const moveOff = selected && isHiddenTab(selected, needles) && fallback;

      tabs.forEach((tab) => {
        if (tab.hasAttribute('data-sve-chrome-tab-lock')) {
          tab.removeAttribute('data-sve-panel-hide');
          tab.removeAttribute('data-sve-chrome-tab-lock');
        }

        if (isHiddenTab(tab, needles)) {
          tab.setAttribute('data-sve-panel-hide', '');
          tab.setAttribute('data-sve-globals-tab-hide', '');
        }
      });

      // Statamic opens on the first tab — which is one of the ones just hidden.
      // Without this the panel shows the header's fields under no visible tab.
      if (moveOff) {
        ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
          fallback.dispatchEvent(new win.PointerEvent(type, { bubbles: true, cancelable: true }));
        });
      }
      doc.querySelectorAll('[data-sve-chrome-tablist-lock]').forEach((el) => {
        el.removeAttribute('data-sve-panel-hide');
        el.removeAttribute('data-sve-chrome-tablist-lock');
      });
      doc.querySelectorAll('[data-sve-chrome-section-title]').forEach((el) => {
        el.removeAttribute('data-sve-panel-hide');
        el.removeAttribute('data-sve-chrome-section-title');
      });
      doc.querySelectorAll('[data-sve-chrome-spacer]').forEach((el) => {
        el.removeAttribute('data-sve-panel-hide');
        el.removeAttribute('data-sve-chrome-spacer');
      });

      return;
    }

    const matchesLock = (tab) => {
      const text = (tab.textContent || '').trim().toLowerCase();

      return text === lockedTabNeedle || text.startsWith(lockedTabNeedle);
    };

    // Is the tab we lock to already the open one? Asked first, and this is the
    // ordinary case: the observer runs on every mutation, and typing in the form
    // is a stream of them. Only a pass that has somewhere to go may disturb the
    // lock — undoing and redoing it on each keystroke drops the panel out of
    // chrome focus between renders, which reads as a flicker.
    const selected = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true');

    if (!selected || !matchesLock(selected)) {
      // Everything that hides a tab comes off before the tab is looked for, and
      // the lock's own marker last of all — `html[data-sve-chrome-locked]` hides
      // every `[role="tablist"]` by stylesheet, so with it set there is no
      // visible tab left to find. That matters because `activatePublishTab`
      // searches the tabs actually on screen: reka-ui keeps a hidden measurement
      // twin of each one, and off-screen the real tab can't be told from its twin.
      doc.documentElement.removeAttribute('data-sve-chrome-locked');

      doc.querySelectorAll('[data-sve-globals-tab-hide]').forEach((tab) => {
        tab.removeAttribute('data-sve-panel-hide');
        tab.removeAttribute('data-sve-globals-tab-hide');
      });

      doc.querySelectorAll('[data-sve-chrome-tablist-lock]').forEach((el) => {
        el.removeAttribute('data-sve-panel-hide');
        el.removeAttribute('data-sve-chrome-tablist-lock');
      });

      // Not mounted yet, or renamed away — or reka-ui hasn't settled the
      // selection this tick. Leave the panel as Statamic renders it, tabs and
      // all, and try again on the next mutation: a visible tab row the reader
      // can steer with beats a hidden one over the wrong fields.
      if (!activatePublishTab(lockedTabNeedle)) {
        return;
      }
    }

    doc.documentElement.setAttribute('data-sve-chrome-locked', '1');

    tabs.forEach((tab) => {
      if (matchesLock(tab)) {
        tab.removeAttribute('data-sve-panel-hide');
        tab.removeAttribute('data-sve-chrome-tab-lock');

        return;
      }

      tab.setAttribute('data-sve-panel-hide', '');
      tab.setAttribute('data-sve-chrome-tab-lock', '');
    });

    // Hide the whole tab row (incl. overflow "…" / lone "Design") so fields sit tight.
    doc.querySelectorAll('[role="tablist"]').forEach((list) => {
      const wrap = list.closest('nav') || list.parentElement || list;

      wrap.setAttribute('data-sve-panel-hide', '');
      wrap.setAttribute('data-sve-chrome-tablist-lock', '');
    });

    // Blueprint section titles like "Design" — redundant under chrome Design|Settings toggle.
    doc.querySelectorAll('h1, h2, h3').forEach((heading) => {
      const text = (heading.textContent || '').trim().toLowerCase();

      if (text !== 'design') {
        return;
      }

      const wrap = heading.closest('.publish-section-header, .section-header, header, .flex') || heading;

      wrap.setAttribute('data-sve-panel-hide', '');
      wrap.setAttribute('data-sve-chrome-section-title', '');
    });

    // Collapse every sibling above the first publish card — that empty band was the gap
    // under Design|Settings.
    const main = doc.querySelector('main');
    const card = main?.querySelector('.card, .publish-fields, .publish-sections');

    if (card) {
      let node = card;

      while (node && node !== main) {
        let sib = node.previousElementSibling;

        while (sib) {
          const prev = sib.previousElementSibling;

          if (!sib.hasAttribute('data-sve-chrome-spacer')) {
            sib.setAttribute('data-sve-panel-hide', '');
            sib.setAttribute('data-sve-chrome-spacer', '');
          }

          sib = prev;
        }

        node = node.parentElement;
      }
    }
  };

  hideChrome();
  applyTabLock();
  new win.MutationObserver(() => {
    hideChrome();
    applyTabLock();
  }).observe(doc.documentElement, { childList: true, subtree: true });

  // Style picks / tab jumps must not trip "Leave site?" from Statamic's dirty check.
  try {
    win.Statamic?.$dirty?.disableWarning?.();
  } catch {
    /* ignore */
  }

  // Statamic's own Save button lives in the page header the panel strips away.
  // It still works — it just can't be seen — so the panel's Save clicks it, and
  // the normal save (validation, revisions, toast) runs untouched.
  win.addEventListener('message', (event) => {
    if (event.origin !== win.location.origin) {
      return;
    }

    if (event.data?.source !== 'statamic-visual-editor') {
      return;
    }

    // An inline edit in the page, on content this form owns: apply it to the real
    // container here. The value poll below streams it straight back out, so the
    // page re-renders with it — the edit never has to know it crossed a window.
    if (event.data.type === 'sve-section-set-value') {
      for (const container of activeContainers(doc)) {
        container.setFieldValue(event.data.path, event.data.value);

        return;
      }

      return;
    }

    // The preview's "+" inside this global section. The blocks belong to this
    // form, so Statamic's own Add Set picker is opened here — the same call the
    // CP makes for a page's own sections, just in the document that has them.
    if (event.data.type === 'sve-section-add-block') {
      handleAddBlockNative(event.data, doc, win);
      autoPickSet(doc, win, event.data.setLabel);

      return;
    }

    // Header/footer design picker: write flattened `header_style` / `footer_style`.
    if (event.data.type === 'sve-chrome-set-style') {
      const kind = event.data.kind === 'footer' ? 'footer' : 'header';
      const style = event.data.style;

      for (const container of activeContainers(doc)) {
        container.setFieldValue(`${kind}_style`, style);

        return;
      }

      return;
    }

    // Open the matching publish tab (Header / Footer / …). reka-ui ignores a
    // bare click() and keeps a hidden twin of each tab — only the visible one.
    if (event.data.type === 'sve-activate-tab') {
      activatePublishTab(
        String(event.data.label || event.data.kind || '')
          .trim()
          .toLowerCase()
      );

      return;
    }

    // Live Preview header/footer: only that tab's fields — hide Colors, etc.
    if (event.data.type === 'sve-lock-tab') {
      lockedTabNeedle = String(event.data.label || event.data.kind || '')
        .trim()
        .toLowerCase();

      if (lockedTabNeedle) {
        activatePublishTab(lockedTabNeedle);
        applyTabLock();
      }

      return;
    }

    if (event.data.type === 'sve-unlock-tabs') {
      lockedTabNeedle = null;
      applyTabLock();

      return;
    }

    // Parent confirmed a successful Save — treat current values as clean baseline.
    if (event.data.type === 'sve-globals-saved') {
      for (const container of activeContainers(doc)) {
        const values = unwrapRef(container.values);

        if (values && typeof values === 'object') {
          previous = JSON.stringify(values);
          seeded = true;
        }

        break;
      }

      return;
    }

    if (event.data.type !== 'sve-globals-save') {
      return;
    }

    // A global set's button reads "Save"; an entry's reads "Save & Publish" — so
    // match the start, not the whole label, or the panel's Save silently does
    // nothing for a global section. Clicking works even though it's hidden.
    [...doc.querySelectorAll('button')]
      .find((button) => /^(save|gem)\b/i.test((button.textContent || '').trim()))
      ?.click();
  });

  const handle = win.location.pathname.split('/').filter(Boolean).pop();
  let previous = null;
  let seeded = false;

  // Polled rather than watched: the container's `values` is a Vue ref, and a
  // 200ms compare is both cheaper and far more robust than reaching into Vue's
  // reactivity from outside its bundle.
  win.setInterval(() => {
    for (const container of activeContainers(doc)) {
      const values = unwrapRef(container.values);

      if (!values || typeof values !== 'object') {
        continue;
      }

      const serialized = JSON.stringify(values);

      if (serialized === previous) {
        return;
      }

      const changed = previous !== null;
      previous = serialized;

      // First snapshot: still push for entries so the parent can resolve inline
      // edit (sectionPanelContainer). Parent treats the first poll as baseline
      // and does not mark dirty / stash. Globals keep the old "seed silent" path
      // — pushing them refreshed the Live Preview on every panel open.
      if (!seeded) {
        seeded = true;

        if (!isEntry) {
          return;
        }
      } else if (!changed) {
        return;
      }

      try {
        win.parent.postMessage(
          isEntry
            ? { source: 'statamic-visual-editor', type: 'sve-section-values', id: handle, values: JSON.parse(serialized) }
            : { source: 'statamic-visual-editor', type: 'sve-globals-values', handle, values: JSON.parse(serialized) },
          win.location.origin
        );
      } catch {
        /* the panel was closed */
      }

      return;
    }
  }, 250);

  // Preview asked to focus a field/block inside this synced section — same as
  // clicking it on a normal page (solo + field focus in THIS form).
  win.addEventListener('message', (event) => {
    if (event.origin !== win.location.origin || event.data?.source !== 'statamic-visual-editor') {
      return;
    }

    if (event.data.type === 'sve-section-focus') {
      const applyFocus = (attempt = 0) => {
        hideSavedSectionEntryChrome(doc);

        // Same path as a normal page click: open the block that owns the field,
        // not just the section scope (which may be a parent when block ids were
        // missing from saved YAML).
        if (event.data.field) {
          let opened = false;

          if (event.data.uid) {
            if (focusPanelOn(win)) {
              opened = focusFieldOwner(event.data.field, event.data.uid, doc, win);
            } else {
              opened = soloSection(event.data.uid, doc, win);
            }
          }

          handleFieldFocus(event.data.field, doc, { scopeUid: event.data.uid });

          if (event.data.uid) {
            win.setTimeout(
              () => handleFieldFocus(event.data.field, doc, { animate: false, scopeUid: event.data.uid }),
              COLLAPSE_SETTLE_MS
            );
          }

          // Form still mounting / set collapsed — expand and retry a few times
          // so the sidebar does not stick on an empty Headline header.
          if (!opened && event.data.uid && attempt < 12) {
            expandTopLevelSectionSets(doc, sectionField(win));
            win.setTimeout(() => applyFocus(attempt + 1), 120);
          }
        } else if (event.data.uid) {
          const opened = soloSection(event.data.uid, doc, win);

          if (!opened && attempt < 12) {
            expandTopLevelSectionSets(doc, sectionField(win));
            win.setTimeout(() => applyFocus(attempt + 1), 120);
          }
        }
      };

      applyFocus();
    }
  });

  // Entry form for a saved section: jump straight into the first page section so
  // the left panel matches a normal Hero/… focus view (not Navn/Synced meta).
  if (isEntry) {
    injectPanelFocusStyles(doc);
    bootSavedSectionSolo(win, doc);
    // Parent may have queued a click before this frame's listener existed.
    try {
      win.parent.postMessage(
        { source: 'statamic-visual-editor', type: 'sve-section-panel-ready' },
        win.location.origin
      );
    } catch {
      /* panel closed */
    }
  }

  return true;
}

/** Focus-panel CSS lives on the parent CP; the sve-panel iframe needs its own copy. */
function injectPanelFocusStyles(doc) {
  if (doc.getElementById('__sve-panel-focus-styles')) {
    return;
  }

  const style = doc.createElement('style');

  style.id = '__sve-panel-focus-styles';
  style.textContent = `
    [data-sve-focus-header] {
      position: sticky; top: 0; z-index: 3; display: flex; flex-direction: column;
      gap: 0.5rem; margin-bottom: 0.75rem; padding: 0.875rem 0 1rem;
      border-bottom: 1px solid rgba(128,128,128,.16);
      background: var(--theme-color-content-bg, var(--color-white, #fff));
    }
    [data-sve-focus-id] { display: flex; align-items: center; gap: 0.7rem; }
    [data-sve-focus-tile] {
      flex: 0 0 auto; display: flex; align-items: center; justify-content: center;
      width: 2.1rem; height: 2.1rem; border-radius: 0.6rem;
      background: rgba(128,128,128,.16); font-size: 0.9rem; font-weight: 600; line-height: 1;
    }
    [data-sve-focus-title] { margin: 0; font-size: 1rem; font-weight: 600; line-height: 1.25; }
    [data-sve-focus-back] {
      all: unset; cursor: pointer; flex: 0 0 auto; display: inline-flex; align-items: center;
      gap: 0.55em; margin-left: auto; padding: 0.55em 0.95em; border-radius: 0.55rem;
      background: rgba(128,128,128,.16); font-size: 0.75rem; font-weight: 500; line-height: 1;
      white-space: nowrap;
    }
    [data-sve-focus-back]:hover { background: rgba(128,128,128,.28); }
    [data-sve-focus-back-arrow] {
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 1.2rem; line-height: 1; font-weight: 600;
      transform: translateY(-1.5px);
    }
    [data-sve-focus-desc] { margin: 0; font-size: 0.8125rem; line-height: 1.5; opacity: .6; }
    [data-sve-focus] [data-sve-focus-hide] { display: none !important; }
    [data-sve-focus] [data-sve-focus-set] > header { display: none !important; }
    [data-sve-focus-step] {
      all: unset; cursor: pointer; flex: 0 0 auto; display: inline-flex; align-items: center;
      justify-content: center; width: 1.6rem; height: 1.6rem; margin-left: 0.25rem;
      border-radius: 0.4rem; opacity: .45;
    }
    header:hover > [data-sve-focus-step] { opacity: .9; }
    [data-sve-focus] [data-sve-focus-flat] {
      border: 0 !important; border-radius: 0 !important; background: none !important;
      box-shadow: none !important; padding: 0 !important; margin: 0 !important;
    }
    [data-sve-focus] [data-sve-focus-flat] > hr { display: none !important; }
    [data-sve-focus] [data-sve-focus-flush] { padding-inline: 0 !important; }
    /* Entry Main/Sidebar tabs — redundant once we're inside the section. */
    [data-sve-focus] [role="tablist"] { display: none !important; }
  `;
  doc.head.appendChild(style);
}

/** Library-only fields on a saved_sections entry — not part of a normal section edit. */
const SAVED_SECTION_META_HANDLES = ['title', 'synced', 'section_type', 'preview_image'];

/**
 * Hide entry chrome that a normal Live Preview section never shows: library
 * meta (Navn/Synced/…), Published, and SEO/Sidebar/Page settings tabs.
 */
function hideSavedSectionEntryChrome(doc) {
  const hideRow = (el) => {
    if (!el) {
      return;
    }

    // Never hide fields that live inside the section being edited.
    if (el.closest?.(SELECTORS.replicatorSet)) {
      return;
    }

    // `[class*="publish-field"]` is deliberately not in this list. Statamic 6
    // renders no singular `.publish-field` at all — a field is a `*-fieldtype`
    // wrapper — so the substring match only ever found `.publish-fields`, the
    // whole field column, and hiding one meta field took the entire panel with
    // it: header showing, nothing under it.
    const row =
      el.closest('.publish-field') ||
      el.closest('[class*="-fieldtype"]') ||
      el.closest('label') ||
      (el.parentElement?.children.length === 1 ? el.parentElement : el);

    // A row holding the section itself is not a row — it is the column around
    // it. Asked in terms of what must survive rather than what to climb past,
    // so the next markup change cannot bring the blank panel back.
    if (!row || row.querySelector?.(SELECTORS.replicatorSet)) {
      return;
    }

    row.setAttribute('data-sve-panel-hide', '');
  };

  for (const handle of SAVED_SECTION_META_HANDLES) {
    const el =
      doc.getElementById(`field_${handle}`) ||
      doc.querySelector(`.publish-field-${handle}`) ||
      doc.querySelector(`[data-field="${handle}"]`) ||
      doc.querySelector(`[data-handle="${handle}"]`);

    if (el) {
      el.setAttribute('data-sve-panel-hide', '');
      hideRow(el);
    }

    // Statamic 6 often omits field_* ids — match bare name attributes outside sets.
    doc.querySelectorAll(`[name="${handle}"]`).forEach((input) => hideRow(input));
  }

  // Published toggle — Statamic 6 may render it outside field_* ids (switch /
  // reka). Match by label text, name, or aria.
  doc.querySelectorAll('label, .toggle-fieldtype, [class*="toggle-fieldtype"], [role="switch"]').forEach((el) => {
    if (el.closest?.(SELECTORS.replicatorSet)) {
      return;
    }

    const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    const name = el.getAttribute('name') || el.querySelector?.('input')?.getAttribute('name') || '';

    if (
      /^(published|udgivet)\b/i.test(text) ||
      name === 'published' ||
      el.querySelector?.('input[name="published"]')
    ) {
      hideRow(el);
    }
  });

  doc.querySelectorAll('input[name="published"], [name="published"]').forEach(hideRow);

  // Extra publish tabs (Sidebar / SEO / Page settings) — keep Main only.
  // Section Content/Style use data-sve-section-seg, not role=tab.
  const tabs = [...doc.querySelectorAll('button[role="tab"]')];

  if (tabs.length > 1) {
    const first = tabs[0];

    if (first.getAttribute('aria-selected') !== 'true') {
      ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
        first.dispatchEvent(
          new (doc.defaultView?.PointerEvent || PointerEvent)(type, {
            bubbles: true,
            cancelable: true,
          })
        );
      });
    }

    tabs.forEach((tab, index) => {
      if (index > 0) {
        tab.setAttribute('data-sve-panel-hide', '');
      }
    });

    const tablist = first.closest('[role="tablist"]');

    if (tablist) {
      tablist.setAttribute('data-sve-panel-hide', '');
    }
  }
}

/**
 * Expand top-level page_sections sets so their _visual_id inputs exist in the DOM.
 * Collapsed replicator sets render no fields — findSetByUid would otherwise fail.
 */
function expandTopLevelSectionSets(doc, field) {
  const fieldEl = doc.getElementById(`field_${field}`);
  const root = fieldEl || doc.querySelector('main') || doc;
  let expanded = false;

  root.querySelectorAll(SELECTORS.replicatorSet).forEach((setEl) => {
    const ancestor = setEl.parentElement?.closest(SELECTORS.replicatorSet);

    if (ancestor && root.contains(ancestor)) {
      return; // nested block — leave for focusFieldOwner / solo later
    }

    if (isSetCollapsed(setEl)) {
      expandSet(setEl);
      expanded = true;
    }
  });

  return expanded;
}

/** Solo the first page_sections row so the panel matches a normal section edit. */
function bootSavedSectionSolo(win, doc) {
  const field = sectionField(win);
  let attempts = 0;

  hideSavedSectionEntryChrome(doc);

  const tryBoot = () => {
    hideSavedSectionEntryChrome(doc);

    // Prefer event-captured containers; fall back to walking the Vue tree from
    // any mounted visual-id input (form may have mounted before we listened).
    const containers = activeContainers(doc);

    for (const container of containers) {
      const values = unwrapRef(container.values);
      const rows = values && typeof values === 'object' ? values[field] : null;

      if (!Array.isArray(rows) || !rows.length) {
        continue;
      }

      // Legacy synced entries stripped nested ids — assign them once so preview
      // scope="{{ id }}" and focusFieldOwner can target Headline blocks.
      const next = JSON.parse(JSON.stringify(rows));

      if (ensureNestedRowIds(next)) {
        container.setFieldValue(field, next);

        // Wait for the write + value poll before soloing.
        win.setTimeout(tryBoot, 150);

        return;
      }

      const row = next[0];
      const uid = row?._visual_id || row?.id || row?._id;

      if (!uid) {
        // Section row with no id yet — mint one and retry.
        row.id = newRowId();
        container.setFieldValue(field, next);
        win.setTimeout(tryBoot, 150);

        return;
      }

      // Collapsed sets have no visual-id inputs — expand first, then retry.
      if (!findSetByUid(uid, doc)) {
        expandTopLevelSectionSets(doc, field);
        // Also expand every replicator set we can see (ids may live on nested inputs).
        doc.querySelectorAll(SELECTORS.replicatorSet).forEach((setEl) => {
          if (isSetCollapsed(setEl)) {
            expandSet(setEl);
          }
        });

        if (attempts++ < 60) {
          win.setTimeout(tryBoot, COLLAPSE_SETTLE_MS);

          return;
        }

        continue;
      }

      const opened = soloSection(uid, doc, win, { kind: 'section' });

      if (opened) {
        doc.documentElement.setAttribute('data-sve-boot', 'ok');

        return;
      }
    }

    // Form still mounting — keep expanding anything that appeared and retry.
    expandTopLevelSectionSets(doc, field);

    if (attempts++ < 60) {
      win.setTimeout(tryBoot, 120);
    } else {
      doc.documentElement.setAttribute('data-sve-boot', 'fail');
    }
  };

  tryBoot();
}

/**
 * Assign stable `id` on every set row that lacks one (synced sections saved
 * before nested ids were preserved). Returns true when anything changed.
 *
 * Only replicator/grid rows (`enabled` and/or section handles like `hero/style_1`)
 * — never Bard/ProseMirror nodes (`paragraph`, `text`, …).
 */
function ensureNestedRowIds(node) {
  let changed = false;

  const isSetRow = (n) =>
    n &&
    typeof n === 'object' &&
    typeof n.type === 'string' &&
    n.type &&
    ('enabled' in n || 'blocks' in n || n.type.includes('/'));

  const walk = (n) => {
    if (Array.isArray(n)) {
      n.forEach(walk);
    } else if (n && typeof n === 'object') {
      if (isSetRow(n) && !n.id && !n._id) {
        n.id = newRowId();
        changed = true;
      }

      Object.values(n).forEach(walk);
    }
  };

  walk(node);

  return changed;
}

/**
 * Clicking content that comes from a global (global_edit="site_settings.phone"):
 * open that set in the panel and jump to the field. Editing it there updates the
 * preview as you type — the same live path the panel already uses.
 */
export function handleOpenGlobal(data, doc, win) {
  const sets = globalSets(win);

  if (!sets.length) {
    return;
  }

  const [handle, field] = String(data.target || '').split('.');
  const set = sets.find((candidate) => candidate.handle === handle) ?? sets[0];
  const picker = doc.getElementById(GLOBALS_PICKER_ID);

  if (picker) {
    picker.value = set.handle;
  }

  openGlobalsPanel(win, set);

  if (field) {
    focusGlobalField(win, field);
  }
}

/**
 * The global set holding one half of the site frame.
 *
 * The two halves may share one set (`global`) or have one each
 * (`header.global` / `footer.global`). Every caller asks per half, and a shared
 * set simply answers with the same handle twice — so which layout the site uses
 * stops being something the rest of the file has to know.
 */
function chromeGlobalHandle(win, kind = null) {
  const cfg = chromeConfig(win);
  const own = kind === 'footer' || kind === 'header' ? cfg[kind]?.global : null;

  // Asked without a half — a warm-up, not an open. A site that only names the two
  // separately still gets a real handle rather than the theme's.
  return own || cfg.global || cfg.header?.global || cfg.footer?.global || 'theme_settings';
}

function chromeConfig(win) {
  const cfg = win.Statamic?.$config?.get?.('sveChrome');

  return cfg && typeof cfg === 'object' ? cfg : {};
}

/** Configured layout cards for header/footer (`sveChrome.header.styles` etc.). */
function chromeStyles(win, kind) {
  const list = chromeConfig(win)[kind]?.styles;

  return Array.isArray(list) ? list : [];
}

function closeChromeDesignsPanel(win) {
  win.document.getElementById(CHROME_DESIGNS_ID)?.remove();
  releaseLeftEdgeIfFree(win);
  syncPreviewInset(win);
}

const CHROME_MODE_TOGGLE_ATTR = 'data-sve-chrome-mode-toggle';

/** Which chrome sidebar view is visible: design picker vs Theme Settings. */
function currentChromeSidebarMode(win) {
  const designs = win.document.getElementById(CHROME_DESIGNS_ID);

  if (designs && !designs.hasAttribute('data-sve-chrome-hidden') && designs.style.display !== 'none') {
    return 'design';
  }

  return 'settings';
}

function paintChromeModeToggle(row, mode) {
  if (!row) {
    return;
  }

  row.querySelectorAll('[data-sve-chrome-mode]').forEach((btn) => {
    const on = btn.getAttribute('data-sve-chrome-mode') === mode;

    btn.style.background = on ? 'rgba(128,128,128,.22)' : 'transparent';
    btn.style.fontWeight = on ? '600' : '500';
    btn.style.opacity = on ? '1' : '.72';
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function paintAllChromeModeToggles(win, mode) {
  win.document.querySelectorAll(`[${CHROME_MODE_TOGGLE_ATTR}]`).forEach((row) => {
    paintChromeModeToggle(row, mode);
  });
}

function removeChromeModeToggles(win) {
  win.document.querySelectorAll(`[${CHROME_MODE_TOGGLE_ATTR}]`).forEach((el) => el.remove());
}

/**
 * Segmented Design | Settings control for the chrome sidebar.
 * Replaces the old Designs/Settings buttons on the preview bottom bar.
 */
function buildChromeModeToggle(win, mode) {
  const doc = win.document;
  const row = doc.createElement('div');

  row.setAttribute(CHROME_MODE_TOGGLE_ATTR, '');
  row.style.cssText =
    'display:flex;gap:4px;padding:2px 10px 0;flex:0 0 auto;';

  const track = doc.createElement('div');

  track.style.cssText =
    'display:flex;flex:1 1 auto;gap:2px;padding:3px;border-radius:10px;' +
    'background:rgba(128,128,128,.12);';

  const makeBtn = (key, label) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = label;
    btn.setAttribute('data-sve-chrome-mode', key);
    btn.style.cssText =
      'all:unset;cursor:pointer;flex:1 1 0;text-align:center;padding:7px 10px;' +
      'border-radius:8px;font-size:12px;line-height:1.2;color:currentColor;';
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      setChromeSidebarMode(win, key);
    });
    track.appendChild(btn);
  };

  makeBtn('design', t(win, 'chrome_designs'));
  // Key stays 'settings' — it names the sidebar mode, which is the global set's
  // own form. The label says what that form is for: the header's content.
  makeBtn('settings', t(win, 'chrome_content'));
  row.appendChild(track);
  paintChromeModeToggle(row, mode);

  return row;
}

/** Insert (or refresh) the Design/Settings toggle under a panel header. */
function ensureChromeModeToggle(win, panel, mode) {
  if (!panel) {
    return;
  }

  let row = panel.querySelector(`[${CHROME_MODE_TOGGLE_ATTR}]`);

  if (!row) {
    row = buildChromeModeToggle(win, mode);
    const header = panel.firstElementChild;

    if (header?.nextSibling) {
      panel.insertBefore(row, header.nextSibling);
    } else {
      panel.appendChild(row);
    }
  } else {
    paintChromeModeToggle(row, mode);
  }
}

/** Switch chrome sidebar between design picker and Theme Settings. */
function setChromeSidebarMode(win, mode) {
  const kind =
    activeChromeKind ||
    win.document.getElementById(GLOBALS_PANEL_ID)?.getAttribute('data-sve-chrome-kind') ||
    win.document.getElementById(CHROME_DESIGNS_ID)?.getAttribute('data-sve-chrome-kind') ||
    'header';
  const chromeKind = kind === 'footer' ? 'footer' : 'header';

  if (mode === 'design') {
    openChromeDesignsPanel(win, chromeKind);
    paintAllChromeModeToggles(win, 'design');

    return;
  }

  // Keep designs mounted (hidden) so toggling back is instant.
  const designs = win.document.getElementById(CHROME_DESIGNS_ID);

  if (designs) {
    designs.style.cssText =
      'position:fixed;left:-10000px;top:0;width:440px;height:100vh;z-index:-1;display:none;';
    designs.setAttribute('data-sve-chrome-hidden', '1');
  }

  // Edited in this window "settings" is simply the chrome's own tab again — the
  // fields never left, the design drawer was only sitting over them.
  if (chromeHost(win.document)) {
    soloUid = null;
    soloChromeTab(win, win.document, chromeKind);
    watchChromeSolo(win, win.document, chromeKind);
    paintAllChromeModeToggles(win, 'settings');

    return;
  }

  showGlobalsPanel(win);
  lockChromeGlobalsTab(win, chromeKind);
  ensureChromeModeToggle(win, win.document.getElementById(GLOBALS_PANEL_ID), 'settings');
  paintAllChromeModeToggles(win, 'settings');
}

/**
 * Design picker for header/footer — same shared LP editor as Theme Settings /
 * page sections. Hides Theme Settings while open; form stays mounted for writes.
 */
function openChromeDesignsPanel(win, kind) {
  const doc = win.document;
  const chromeKind = kind === 'footer' ? 'footer' : 'header';
  const existing = doc.getElementById(CHROME_DESIGNS_ID);

  if (existing) {
    existing.setAttribute('data-sve-chrome-kind', chromeKind);
    existing.dispatchEvent(new CustomEvent('sve-chrome-render'));
    hideGlobalsPanel(win);
    existing.style.display = 'flex';
    existing.removeAttribute('data-sve-chrome-hidden');
    mountInLivePreviewEditor(win, existing);
    ensureChromeModeToggle(win, existing, 'design');
    paintAllChromeModeToggles(win, 'design');
    syncPreviewInset(win);

    return;
  }

  // Keep Theme Settings mounted (hidden) + sections library if open on the right.
  closeRightPanels(win, [CHROME_DESIGNS_ID, GLOBALS_PANEL_ID, SECTION_PICKER_ID]);
  hideGlobalsPanel(win);

  const panel = doc.createElement('div');

  panel.id = CHROME_DESIGNS_ID;
  panel.setAttribute('data-sve-chrome-kind', chromeKind);
  panel.style.cssText = editorOverlayCss();

  panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid rgba(128,128,128,.2);flex:0 0 auto;">
      <div style="font-size:14px;font-weight:600;" data-sve-title></div>
    </div>
    <div data-sve-hint style="padding:6px 14px;font-size:11px;opacity:.6;flex:0 0 auto;"></div>
    <div data-sve-search-wrap style="padding:8px 12px 0;flex:0 0 auto;">
      <input data-sve-search type="search" autocomplete="off"
        style="width:100%;box-sizing:border-box;padding:8px 10px;border-radius:8px;border:1px solid rgba(128,128,128,.3);
        background:rgba(128,128,128,.06);color:currentColor;font:inherit;font-size:12px;outline:none;">
    </div>
    <div data-sve-scroll style="flex:1 1 auto;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:12px;">
      <div data-sve-grid style="column-gap:12px;"></div>
    </div>
  `;

  const applyLayout = () => {
    const w = panel.getBoundingClientRect().width || 400;
    const cols = w >= 720 ? 3 : w >= 480 ? 2 : 1;
    const grid = panel.querySelector('[data-sve-grid]');

    if (grid) {
      grid.style.columnCount = String(cols);
    }
  };

  mountInLivePreviewEditor(win, panel);
  ensureChromeModeToggle(win, panel, 'design');
  applyLayout();
  syncPreviewInset(win);

  // Recalc columns when the shared editor is resized.
  try {
    const ro = new win.ResizeObserver(() => applyLayout());

    ro.observe(panel);
  } catch {
    /* older browsers */
  }

  const titleEl = panel.querySelector('[data-sve-title]');
  const hintEl = panel.querySelector('[data-sve-hint]');
  const searchEl = panel.querySelector('[data-sve-search]');
  const gridEl = panel.querySelector('[data-sve-grid]');
  let query = '';

  const empty = (msg) => {
    const el = doc.createElement('div');

    el.style.cssText =
      'padding:24px 8px;text-align:center;opacity:.55;font-size:13px;column-span:all;break-inside:avoid;';
    el.textContent = msg;

    return el;
  };

  const markSelected = (style) => {
    gridEl.querySelectorAll('[data-sve-chrome-style]').forEach((el) => {
      const on = el.getAttribute('data-sve-chrome-style') === style;

      el.style.borderColor = on ? 'var(--theme-color-primary,#4f46e5)' : 'rgba(128,128,128,.25)';
      el.style.boxShadow = on ? '0 0 0 1px var(--theme-color-primary,#4f46e5)' : 'none';
    });
  };

  const render = () => {
    const activeKind = panel.getAttribute('data-sve-chrome-kind') === 'footer' ? 'footer' : 'header';

    titleEl.textContent =
      activeKind === 'footer' ? t(win, 'tab_footer') : t(win, 'tab_header');
    hintEl.textContent = t(win, 'chrome_library_hint');
    searchEl.placeholder = t(win, 'chrome_search_placeholder');
    gridEl.innerHTML = '';

    const styles = chromeStyles(win, activeKind);

    if (!styles.length) {
      gridEl.appendChild(empty(t(win, 'chrome_no_styles')));

      return;
    }

    const filtered = styles.filter((item) =>
      libraryMatchesQuery({ ...item, title: item.label || item.title }, query)
    );

    if (!filtered.length) {
      gridEl.appendChild(empty(t(win, 'library_no_matches')));

      return;
    }

    filtered.forEach((item) => {
      const el = doc.createElement('div');
      const title = item.label || item.handle;
      const imageUrl = item.preview_url || item.image || '';

      el.setAttribute('data-sve-chrome-style', item.handle);
      el.style.cssText =
        'cursor:pointer;display:inline-block;width:100%;break-inside:avoid;margin:0 0 12px;border:1px solid rgba(128,128,128,.25);' +
        'border-radius:10px;overflow:hidden;background:rgba(128,128,128,.05);transition:border-color .12s;' +
        'user-select:none;vertical-align:top;';
      el.addEventListener('mouseenter', () => (el.style.borderColor = 'var(--theme-color-primary,#4f46e5)'));
      el.addEventListener('mouseleave', () => {
        const selected = el.style.boxShadow && el.style.boxShadow !== 'none';

        el.style.borderColor = selected ? 'var(--theme-color-primary,#4f46e5)' : 'rgba(128,128,128,.25)';
      });
      el.innerHTML = `
        <div style="width:100%;background:rgba(128,128,128,.12);pointer-events:none;">
          ${
            imageUrl
              ? `<img src="${imageUrl}" alt="" style="width:100%;height:auto;display:block;">`
              : `<div style="width:100%;aspect-ratio:16/5;min-height:56px;display:flex;align-items:center;justify-content:center;opacity:.45;font-size:12px;">${title}</div>`
          }
        </div>
        <div style="padding:8px 10px;font-size:12px;font-weight:500;pointer-events:none;">${title}</div>
      `;
      el.addEventListener('click', () => {
        markSelected(item.handle);
        setChromeStyle(win, activeKind, item.handle);
      });
      gridEl.appendChild(el);
    });
  };

  searchEl.addEventListener('input', () => {
    query = searchEl.value || '';
    render();
  });

  panel.addEventListener('sve-chrome-render', render);
  render();
  searchEl.focus();
}

/**
 * Clicking the site header/footer in Live Preview: open Theme Settings locked
 * to that chrome tab only (no Colors / Typography while you're in the header).
 */
export function handleOpenChrome(data, doc, win) {
  const kind = data.kind === 'footer' ? 'footer' : 'header';
  const handle = chromeGlobalHandle(win, kind);
  const sets = globalSets(win);
  const set = sets.find((candidate) => candidate.handle === handle);

  if (!set) {
    return;
  }

  const picker = doc.getElementById(GLOBALS_PICKER_ID);

  if (picker) {
    picker.value = set.handle;
  }

  closeChromeDesignsPanel(win);

  if (CHROME_INLINE) {
    openChromeInline(win, kind);
  } else {
    openGlobalsPanel(win, set, { chromeLock: kind });
    showGlobalsPanel(win);
    lockChromeGlobalsTab(win, kind);
  }

  assertChromeFocusInPreview(win);

  // Entering chrome always starts clean — tab-lock must not look like user edits.
  globalsStashActive = false;
  chromeIgnoreValuePostsUntil = Date.now() + 900;
  chromeValuesBaseline = null;
  clearGlobalsDirtyMarks(win);
  notifyChromeDirty(win);
  syncSectionLibraryAvailability(win);

  win.setTimeout(() => markChromeFormClean(win), 500);
  win.setTimeout(() => markChromeFormClean(win), 1000);
}

/** Writes header.style / footer.style into the open globals panel form. */
function setChromeStyle(win, kind, style, attempt = 0) {
  const handle = chromeGlobalHandle(win, kind);
  const sets = globalSets(win);
  const set = sets.find((candidate) => candidate.handle === handle);

  // Edited in this window the field is right here — the same write the panel is
  // asked to make over postMessage, made directly.
  const container = chromeHost(win.document) ? chromeContainer() : null;

  if (container) {
    container.setFieldValue(`${kind === 'footer' ? 'footer' : 'header'}_style`, style);

    win.document.getElementById(CHROME_DESIGNS_ID)?.querySelectorAll('[data-sve-chrome-style]').forEach((el) => {
      const on = el.getAttribute('data-sve-chrome-style') === style;

      el.style.borderColor = on ? 'var(--theme-color-primary,#4f46e5)' : 'rgba(128,128,128,.25)';
      el.style.boxShadow = on ? '0 0 0 1px var(--theme-color-primary,#4f46e5)' : 'none';
    });

    return;
  }

  const frame = win.document.getElementById(GLOBALS_PANEL_ID)?.querySelector('iframe');

  // Designs panel alone isn't enough — style changes must hit the theme_settings
  // form so the globals stash + preview refresh run. Keep the form mounted (hidden).
  if (!frame?.contentWindow) {
    if (set) {
      openGlobalsPanel(win, set, { keepLibrary: true, chromeLock: kind === 'footer' ? 'footer' : 'header' });
      hideGlobalsPanel(win);
    }

    if (attempt < 25) {
      setTimeout(() => setChromeStyle(win, kind, style, attempt + 1), 200);
    }

    return;
  }

  frame.contentWindow.postMessage(
    { source: 'statamic-visual-editor', type: 'sve-chrome-set-style', kind, style },
    win.location.origin
  );

  // Form may still be mounting — retry a few times.
  if (attempt < 15) {
    setTimeout(() => {
      const again = win.document.getElementById(GLOBALS_PANEL_ID)?.querySelector('iframe');

      again?.contentWindow?.postMessage(
        { source: 'statamic-visual-editor', type: 'sve-chrome-set-style', kind, style },
        win.location.origin
      );
    }, 250 * (attempt + 1));
  }

  // Mark the chosen card in the open designs panel.
  const panel = win.document.getElementById(CHROME_DESIGNS_ID);

  panel?.querySelectorAll('[data-sve-chrome-style]').forEach((el) => {
    const on = el.getAttribute('data-sve-chrome-style') === style;

    el.style.borderColor = on ? 'var(--theme-color-primary,#4f46e5)' : 'rgba(128,128,128,.25)';
    el.style.boxShadow = on ? '0 0 0 1px var(--theme-color-primary,#4f46e5)' : 'none';
  });
}

/**
 * Lock Theme Settings to Header or Footer only (chrome focus from Live Preview).
 * reka-ui keeps a hidden measurement copy of each tab — only the visible one
 * switches — and it needs the full pointer sequence, not a bare `.click()`.
 */
function lockChromeGlobalsTab(win, kind, attempts = 0) {
  const chromeKind = kind === 'footer' ? 'footer' : 'header';
  const label = chromeKind === 'footer' ? 'Footer' : 'Header';
  const panel = win.document.getElementById(GLOBALS_PANEL_ID);
  const frame = panel?.querySelector('iframe');
  const iwin = frame?.contentWindow;
  const inner = frame?.contentDocument;
  const title = panel?.querySelector('[data-sve-globals-title]');

  if (panel) {
    panel.setAttribute('data-sve-chrome-kind', chromeKind);
    panel.setAttribute('data-sve-chrome-locked', '1');
    ensureChromeModeToggle(win, panel, currentChromeSidebarMode(win));
  }

  setActiveChromeKind(chromeKind);

  if (title) {
    title.textContent = label;
  }

  if (!iwin || !inner) {
    if (attempts < 40) {
      setTimeout(() => lockChromeGlobalsTab(win, chromeKind, attempts + 1), 150);
    }

    return;
  }

  iwin.postMessage(
    { source: 'statamic-visual-editor', type: 'sve-lock-tab', label, kind: chromeKind },
    win.location.origin
  );

  const tabs = [...inner.querySelectorAll('button[role="tab"]')].filter((el) => el.offsetParent !== null);
  const tab = tabs.find((el) => {
    const text = (el.textContent || '').trim().toLowerCase();
    const needle = label.toLowerCase();

    return text === needle || text.startsWith(needle);
  });

  if (tab?.getAttribute('aria-selected') === 'true') {
    // Tablist should already be hidden by the iframe lock — done.
    return;
  }

  if (tab) {
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
      tab.dispatchEvent(new iwin.PointerEvent(type, { bubbles: true, cancelable: true }));
    });
  }

  if (attempts < 40) {
    setTimeout(() => lockChromeGlobalsTab(win, chromeKind, attempts + 1), 150);
  }
}

/** Full Theme Settings again — all publish tabs visible. */
function unlockChromeGlobalsTabs(win) {
  const panel = win.document.getElementById(GLOBALS_PANEL_ID);
  const frame = panel?.querySelector('iframe');
  const title = panel?.querySelector('[data-sve-globals-title]');
  const handle = panel?.getAttribute('data-sve-globals-handle');
  const set = globalSets(win).find((candidate) => candidate.handle === handle);

  panel?.removeAttribute('data-sve-chrome-locked');
  panel?.removeAttribute('data-sve-chrome-kind');
  removeChromeModeToggles(win);

  if (title && set) {
    title.textContent = set.title;
  }

  frame?.contentWindow?.postMessage(
    { source: 'statamic-visual-editor', type: 'sve-unlock-tabs' },
    win.location.origin
  );
}

/** @deprecated — use lockChromeGlobalsTab */
function activateGlobalsTab(win, label, attempts = 0) {
  lockChromeGlobalsTab(win, String(label || '').toLowerCase() === 'footer' ? 'footer' : 'header', attempts);
}

/** Waits for the panel's form to mount, then scrolls the field into view. */
function focusGlobalField(win, field, attempts = 0) {
  const frame = win.document.getElementById(GLOBALS_PANEL_ID)?.querySelector('iframe');
  const inner = frame?.contentDocument;

  const input = inner?.querySelector(`[name="${field}"], #${CSS.escape(field)}`);

  if (input) {
    input.scrollIntoView({ block: 'center' });
    input.focus?.();

    return;
  }

  if (attempts < 30) {
    setTimeout(() => focusGlobalField(win, field, attempts + 1), 200);
  }
}

/** In the Live Preview window: take the values streamed up by the panel. */

// --- Collection picker: move between entries without leaving the preview -------
//
// Live Preview is bound to one entry, so "staying in it" is really: navigate, and
// land back in it. `?live-preview=1` (autoOpenLivePreview) reopens it on arrival,
// so the seam doesn't show. Collections without a route have no page to render —
// they still appear, because jumping to "new blog post" is worth having, but they
// open the ordinary editor and say so.

const COLLECTION_PICKER_ID = '__sve-collection-picker';
const ENTRY_PICKER_ID = '__sve-entry-picker';
const NEW_ENTRY_ID = '__sve-new-entry';

const LP_COVER_ID = 'sve-lp-cover';

function pickerCollections(win) {
  const list = win.Statamic?.$config?.get?.('sveCollections');

  return Array.isArray(list) ? list : [];
}

/** The entry currently open, from the CP URL. */
function currentEntryId(win) {
  const match = win.location.pathname.match(/\/entries\/([^/]+)/);

  return match ? match[1] : null;
}

/**
 * Overlay that covers only the Live Preview iframe (falls back to full viewport).
 * Keeps confirms visually centered in the preview pane, not the whole CP.
 */
function createPreviewCenteredOverlay(doc, id) {
  const overlay = doc.createElement('div');

  if (id) {
    overlay.id = id;
  }

  const iframe = doc.getElementById('live-preview-iframe');
  const rect = iframe?.getBoundingClientRect?.();

  if (rect && rect.width > 0 && rect.height > 0) {
    overlay.style.cssText =
      `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;` +
      'z-index:2147483646;display:flex;align-items:center;justify-content:center;' +
      'background:rgba(0,0,0,.45);font-family:ui-sans-serif,system-ui,sans-serif;';
  } else {
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;' +
      'background:rgba(0,0,0,.45);font-family:ui-sans-serif,system-ui,sans-serif;';
  }

  return overlay;
}

function dialogCardStyle(win) {
  return (
    'width:400px;max-width:92vw;background:var(--theme-color-content-bg,#fff);color:currentColor;' +
    'border-radius:12px;padding:22px;box-shadow:0 24px 64px rgba(0,0,0,.35);'
  );
}

/** Subtle Cancel chip — 10% white on dark CP, 10% black on light. */
function dialogCancelButtonStyle(win) {
  const dark = win.document.documentElement.classList.contains('dark');

  return (
    `all:unset;cursor:pointer;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;` +
    `color:currentColor;background:${dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)'};`
  );
}

/** Statamic primary — same as CP “Save & Publish”. */
function dialogPrimaryButtonStyle() {
  return (
    'all:unset;cursor:pointer;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;' +
    'background:var(--theme-color-primary,#4f46e5);color:#fff;'
  );
}

/** Destructive discard. */
function dialogDangerButtonStyle() {
  return (
    'all:unset;cursor:pointer;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;' +
    'background:#dc2626;color:#fff;'
  );
}

/**
 * Asks about unsaved work before leaving — a dialog, not a dropdown hanging off
 * whatever you happened to click. Losing edits is the kind of thing that deserves
 * the middle of the screen.
 */
function confirmUnsaved(win, onSave, onDiscard, onCancel = () => {}) {
  const doc = win.document;
  const overlay = createPreviewCenteredOverlay(doc);

  const card = doc.createElement('div');

  card.style.cssText = dialogCardStyle(win);
  card.innerHTML =
    `<div style="font-size:15px;font-weight:600;margin-bottom:6px;">${t(win, 'unsaved_title')}</div>` +
    `<div style="font-size:13px;opacity:.7;line-height:1.45;margin-bottom:18px;">${t(win, 'unsaved_body')}</div>` +
    '<div data-sve-actions style="display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;"></div>';

  const actions = card.querySelector('[data-sve-actions]');
  const close = () => overlay.remove();

  const button = (label, style, onClick) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = label;
    btn.style.cssText = style;
    btn.addEventListener('click', () => {
      close();
      onClick();
    });
    actions.appendChild(btn);
  };

  button(t(win, 'cancel'), dialogCancelButtonStyle(win), onCancel);
  button(
    t(win, 'unsaved_discard'),
    'all:unset;cursor:pointer;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;color:currentColor;background:rgba(128,128,128,.16);',
    onDiscard
  );
  button(t(win, 'unsaved_save'), dialogPrimaryButtonStyle(), onSave);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      close();
      onCancel();
    }
  });

  overlay.appendChild(card);
  doc.body.appendChild(overlay);
}

/**
 * Close chrome / global focus with unsaved edits.
 * Cancel · Save (optional) · Close without saving.
 */
function confirmCloseDiscard(
  win,
  { titleKey, bodyKey, confirmKey = 'discard_close' },
  onDiscard,
  onCancel = () => {},
  onSave = null
) {
  const doc = win.document;

  doc.getElementById('__sve-close-discard')?.remove();

  const overlay = createPreviewCenteredOverlay(doc, '__sve-close-discard');

  const card = doc.createElement('div');

  card.style.cssText = dialogCardStyle(win);
  card.innerHTML =
    `<div style="font-size:15px;font-weight:600;margin-bottom:6px;">${t(win, titleKey)}</div>` +
    `<div style="font-size:13px;opacity:.7;line-height:1.45;margin-bottom:18px;">${t(win, bodyKey)}</div>` +
    '<div data-sve-actions style="display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;"></div>';

  const actions = card.querySelector('[data-sve-actions]');
  const close = () => overlay.remove();

  const button = (label, style, onClick) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = label;
    btn.style.cssText = style;
    btn.addEventListener('click', () => {
      close();
      onClick();
    });
    actions.appendChild(btn);
  };

  button(t(win, 'cancel'), dialogCancelButtonStyle(win), onCancel);

  if (typeof onSave === 'function') {
    button(t(win, 'save'), dialogPrimaryButtonStyle(), onSave);
  }

  button(t(win, confirmKey), dialogDangerButtonStyle(), onDiscard);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      close();
      onCancel();
    }
  });

  overlay.appendChild(card);
  doc.body.appendChild(overlay);
}

/**
 * Preview asked to leave header/footer focus. Warn if Theme Settings is dirty.
 */
function handleRequestCloseChrome(win) {
  const finish = () => {
    dismissChromeForPageEdit(win);
    // Closing the header/footer closes the drawer describing it. Parked, not
    // destroyed — form and stash survive, so stepping back in is instant. Only
    // on this deliberate exit: stepping sideways into a page section goes
    // through dismissChromeForPageEdit alone and leaves the drawer alone.
    parkGlobalsPanel(win);
    sendToPreview({ source: 'statamic-visual-editor', type: 'sve-force-exit-chrome' }, win);
  };

  if (!hasUnsavedGlobals(win)) {
    finish();

    return;
  }

  confirmCloseDiscard(
    win,
    { titleKey: 'chrome_close_title', bodyKey: 'chrome_close_body' },
    () => {
      discardGlobalsChanges(win, { refresh: true, reloadForm: true }).then(finish);
    },
    () => {},
    () => {
      saveGlobalsPanel(win, (ok) => {
        if (ok) {
          finish();
        }
      });
    }
  );
}

/**
 * Preview asked to leave a global section. Warn if that section is dirty.
 */
function handleRequestCloseGlobal(win) {
  const finish = () => {
    closeGlobalSectionPanel(win);
    sendToPreview({ source: 'statamic-visual-editor', type: 'sve-force-exit-global' }, win);
  };

  if (!hasUnsavedGlobalSection(win)) {
    finish();

    return;
  }

  confirmCloseDiscard(
    win,
    { titleKey: 'global_close_title', bodyKey: 'global_close_body' },
    () => finish()
  );
}

const LP_NAV_SPINNER_ID = '__sve-nav-spinner';

/** A quiet "working on it", so the page you're still looking at isn't a lie. */
function showNavSpinner(win) {
  const doc = win.document;

  if (doc.getElementById(LP_NAV_SPINNER_ID)) {
    return;
  }

  const header = lpHeader(doc);
  const top = header ? Math.round(header.getBoundingClientRect().bottom) : 0;
  const pip = doc.createElement('div');

  pip.id = LP_NAV_SPINNER_ID;
  pip.style.cssText =
    `position:fixed;top:${top + 16}px;left:50%;transform:translateX(-50%);z-index:2147483000;` +
    'display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:999px;' +
    'background:#18181b;color:#fff;box-shadow:0 4px 14px rgba(0,0,0,.28);pointer-events:none;';
  pip.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
    'stroke-linecap="round" style="opacity:.9;animation:sve-lp-spin 1s linear infinite;">' +
    '<path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>' +
    '<style>@keyframes sve-lp-spin{to{transform:rotate(360deg)}}</style>';
  doc.body.appendChild(pip);
}

function hideNavSpinner(win) {
  win.document.getElementById(LP_NAV_SPINNER_ID)?.remove();
}

/**
 * Saves, then goes where the user actually asked to go.
 *
 * Statamic answers a save with a redirect of its own — out to the collection
 * listing — and it lands after ours, so simply moving first loses the race and
 * dumps you in the admin: the one place this whole picker exists to keep you out
 * of. So we swallow that one redirect and make the move ourselves.
 *
 * If the save fails we stay put, because the error is in here.
 */
function saveThenNavigate(win, go) {
  const router = win.__STATAMIC__?.inertia?.router;
  const save = saveButtonIn(win.document);

  if (!save) {
    go();

    return;
  }

  if (typeof router?.on !== 'function') {
    leaveQuietly(win, go); // no router to head off; a full load outruns the redirect

    return;
  }

  showNavSpinner(win);

  let settled = false;

  // The save's own redirect, intercepted. Ours goes out from the next tick so
  // the router isn't asked to start a visit while it's still cancelling one.
  const offBefore = router.on('before', () => {
    offBefore();
    win.setTimeout(go, 0);

    return false;
  });

  const stop = onEntrySave((ok) => {
    if (settled) {
      return;
    }

    settled = true;
    stop();
    clearTimeout(timer);

    if (!ok) {
      offBefore();
      hideNavSpinner(win);
    }
  });

  const timer = win.setTimeout(() => {
    if (settled) {
      return;
    }

    settled = true;
    stop();
    offBefore();
    hideNavSpinner(win);
  }, LP_SAVE_TIMEOUT);

  save.click();
}

/**
 * Moves to another entry without the page going out from under you.
 *
 * A full page load tears the current document down — that's the blank. Inertia
 * fetches the next page while this one stays on screen, and only swaps once it
 * has it; the cover then only has to hide the brief moment between the swap and
 * the preview painting, rather than the whole trip. Falls back to a plain load
 * where the router isn't reachable.
 */
function navigateFromLp(win, anchor, url, onCancel = () => {}) {
  const router = win.__STATAMIC__?.inertia?.router;

  const go = () => {
    // By the time anything calls this, the unsaved question has been put to the
    // user and answered — on every path into it.
    dismissDirtyWarning(win);

    // Running in the site's editor overlay, the move belongs to the host: it boots
    // the next page hidden and only swaps once that page has painted, so the page
    // you're looking at stays — really stays, not a picture of it — for the whole
    // wait. That's the front-end edit button's own route, and nothing done inside
    // this document can match it: an Inertia swap takes the live preview down with
    // it, and anything put over that gap is a second page change.
    //
    // A spinner, because the wait is now spent looking at a page that is doing
    // nothing.
    if (isEmbeddedInSite(win)) {
      showNavSpinner(win);

      // If the host can't produce the page, don't leave a spinner turning at
      // someone: take the ordinary route instead.
      const onFail = (event) => {
        if (event.origin !== win.location.origin) {
          return;
        }

        if (event.data?.source !== 'statamic-visual-editor' || event.data.type !== 'lp-goto-failed') {
          return;
        }

        win.removeEventListener('message', onFail);
        hideNavSpinner(win);
        coverForNavigation(win, { blocking: true, then: () => (win.location.href = url) });
      };

      win.addEventListener('message', onFail);
      postToHost(win, 'lp-goto', { url });

      return;
    }

    if (!router?.visit) {
      coverForNavigation(win, { then: () => (win.location.href = url) });

      return;
    }

    // Standing alone in the Control Panel there's no host holding the page, so the
    // gap has to be covered: the page you were looking at held on screen, a spinner
    // on it, and the next page fades in once its preview has painted.
    coverForNavigation(win, {
      blocking: true,
      then: () =>
        router.visit(url, {
          onSuccess: () => {
            // The cover stays up until the new preview has painted — that reveal
            // is the whole point, so it's `reveal` that takes it down.
            if (/[?&]live-preview=1/.test(url)) {
              openLivePreviewCovered(win, { closePanels: true });

              return;
            }

            win.document.getElementById(LP_COVER_ID)?.remove();
          },
          onError: () => {
            win.document.getElementById(LP_COVER_ID)?.remove();
          },
        }),
    });
  };

  if (!hasUnsavedWork(win) || (!saveButtonIn(win.document) && !hasUnsavedGlobals(win) && !hasUnsavedGlobalSection(win))) {
    go();

    return;
  }

  confirmUnsaved(
    win,
    () => {
      // Globals / synced sections first, then the entry.
      saveGlobalsPanel(win, (ok) => {
        if (!ok) {
          onCancel();

          return;
        }

        saveGlobalSectionPanel(win, (sectionOk) => {
          if (!sectionOk) {
            onCancel();

            return;
          }

          if (!hasUnsavedChanges(win) || !saveButtonIn(win.document)) {
            go();

            return;
          }

          saveThenNavigate(win, go);
        });
      });
    },
    () => {
      discardChanges(win);
      discardGlobalsChanges(win);
      clearSectionsStash(win, { refresh: false });
      go();
    },
    onCancel
  );
}

/**
 * "New page": a title and a slug, and you're in it.
 *
 * The Control Panel's create screen would do this too, but it's a whole form on a
 * whole other page — and there is nothing to fill in yet. This asks the two things
 * that can't be guessed and creates the entry bare, so the next thing you see is
 * the page itself, ready to build.
 */
function newEntryDialog(win, collection, onCreated) {
  const doc = win.document;
  const overlay = doc.createElement('div');

  overlay.style.cssText =
    'position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;' +
    'background:rgba(0,0,0,.45);font-family:ui-sans-serif,system-ui,sans-serif;';

  const card = doc.createElement('div');
  const input =
    'width:100%;box-sizing:border-box;height:36px;padding:0 10px;border-radius:8px;' +
    'border:1px solid rgba(128,128,128,.4);background:transparent;color:currentColor;font-size:14px;';

  card.style.cssText =
    'width:420px;max-width:92vw;background:var(--theme-color-content-bg,#fff);color:currentColor;' +
    'border-radius:12px;padding:22px;box-shadow:0 24px 64px rgba(0,0,0,.35);';
  card.innerHTML = `
    <div style="font-size:15px;font-weight:600;margin-bottom:16px;">${t(win, 'new_in', { collection: collection.title })}</div>
    <label style="display:block;font-size:12px;font-weight:500;margin-bottom:5px;">${t(win, 'title')}</label>
    <input type="text" data-sve-title style="${input}margin-bottom:12px;">
    <label style="display:block;font-size:12px;font-weight:500;margin-bottom:5px;">${t(win, 'slug')}</label>
    <input type="text" data-sve-slug style="${input}">
    <div data-sve-error style="display:none;font-size:12px;color:#dc2626;margin-top:8px;"></div>
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:20px;">
      <button type="button" data-sve-cancel style="all:unset;cursor:pointer;padding:8px 14px;border-radius:8px;font-size:13px;color:currentColor;opacity:.75;">${t(win, 'cancel')}</button>
      <button type="button" data-sve-create style="all:unset;cursor:pointer;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;background:var(--theme-color-primary,#4f46e5);color:#fff;">${t(win, 'create')}</button>
    </div>
  `;

  overlay.appendChild(card);
  doc.body.appendChild(overlay);

  const title = card.querySelector('[data-sve-title]');
  const slug = card.querySelector('[data-sve-slug]');
  const error = card.querySelector('[data-sve-error]');
  const create = card.querySelector('[data-sve-create]');
  const close = () => overlay.remove();

  title.focus();

  // The slug follows the title until it's touched, and then it's yours — retyping
  // the title shouldn't quietly undo a slug you chose on purpose.
  let slugOwned = false;

  slug.addEventListener('input', () => (slugOwned = true));
  title.addEventListener('input', () => {
    if (!slugOwned) {
      slug.value = slugify(title.value);
    }
  });

  const submit = () => {
    const name = title.value.trim();

    if (!name) {
      title.focus();

      return;
    }

    create.style.opacity = '.6';
    create.style.pointerEvents = 'none';
    error.style.display = 'none';

    win
      .fetch(`/!/sve/collections/${encodeURIComponent(collection.handle)}/entries`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken(win),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ title: name, slug: slug.value.trim() }),
      })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
          // A taken slug is the one failure worth answering in place.
          error.textContent = body.message || t(win, 'create_failed');
          error.style.display = 'block';
          create.style.opacity = '1';
          create.style.pointerEvents = '';

          return;
        }

        close();
        onCreated(body.id);
      })
      .catch(() => {
        error.textContent = t(win, 'create_failed');
        error.style.display = 'block';
        create.style.opacity = '1';
        create.style.pointerEvents = '';
      });
  };

  card.querySelector('[data-sve-cancel]').addEventListener('click', close);
  create.addEventListener('click', submit);
  overlay.addEventListener('click', (event) => event.target === overlay && close());
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      submit();
    } else if (event.key === 'Escape') {
      close();
    }
  });
}

/** The slug Statamic would make: lowercase, ascii-ish, hyphenated. */
function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[æ]/g, 'ae')
    .replace(/[ø]/g, 'oe')
    .replace(/[å]/g, 'aa')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function ensureCollectionPicker(win) {
  const doc = win.document;
  const group = doc.getElementById(LP_MODE_ID);
  const collections = pickerCollections(win);

  if (!group || !collections.length || doc.getElementById(COLLECTION_PICKER_ID)) {
    return;
  }

  const wrap = doc.createElement('div');

  // Ingen egen flade: den ligger i panelets sammensatte felt, og felterne her
  // skilles ad af søm — se ensureHeaderToolbar.
  wrap.style.cssText = 'display:inline-flex;align-items:center;font-family:inherit;';

  const collectionSelect = doc.createElement('select');

  collectionSelect.id = COLLECTION_PICKER_ID;
  collectionSelect.style.cssText = FRAMED_SELECT_STYLE;

  collections.forEach((collection) => {
    const option = doc.createElement('option');

    option.value = collection.handle;
    // Say it in the option rather than only on hover: you shouldn't have to
    // discover that a collection can't be previewed by picking it.
    option.textContent = collection.previewable
      ? collection.title
      : `${collection.title} · ${t(win, 'no_preview_collection')}`;
    collectionSelect.appendChild(option);
  });

  const entrySelect = doc.createElement('select');

  entrySelect.id = ENTRY_PICKER_ID;
  entrySelect.style.cssText = `${FRAMED_SELECT_STYLE}max-width:220px;`;

  const newBtn = doc.createElement('button');

  newBtn.type = 'button';
  newBtn.id = NEW_ENTRY_ID;
  newBtn.textContent = `+ ${t(win, 'new_entry')}`;
  // Same flat primary as Visible / active device pills.
  newBtn.style.cssText =
    `${FRAMED_CONTROL_STYLE}padding:0 .75rem;margin-left:${LP_SEAM_GAP}px;font-weight:600;` +
    `background:${LP_PRIMARY_FLAT};color:#fff;opacity:1;border:none;box-shadow:none;`;

  const selected = () => collections.find((c) => c.handle === collectionSelect.value);

  const fillEntries = async (keepCurrent) => {
    const collection = selected();

    entrySelect.innerHTML = '';
    newBtn.title = t(win, 'new_in', { collection: collection?.title ?? '' });
    collectionSelect.title = collection?.previewable
      ? ''
      : t(win, 'no_preview_hint', { collection: collection?.title ?? '' });

    const placeholder = doc.createElement('option');

    placeholder.value = '';
    placeholder.textContent = t(win, 'choose_entry');
    entrySelect.appendChild(placeholder);

    let entries = [];

    try {
      const res = await win.fetch(`/!/sve/collections/${encodeURIComponent(collectionSelect.value)}/entries`, {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      });

      entries = res.ok ? (await res.json()).entries ?? [] : [];
    } catch {
      entries = [];
    }

    entries.forEach((entry) => {
      const option = doc.createElement('option');

      option.value = entry.id;
      option.textContent = entry.published ? entry.title : `${entry.title} ·`;
      entrySelect.appendChild(option);
    });

    if (keepCurrent) {
      entrySelect.value = currentEntryId(win) ?? '';
    }
  };

  collectionSelect.addEventListener('change', () => fillEntries(false));

  entrySelect.addEventListener('change', () => {
    if (!entrySelect.value || entrySelect.value === currentEntryId(win)) {
      return;
    }

    const collection = selected();
    const url =
      `${win.location.origin}/cp/collections/${encodeURIComponent(collection.handle)}` +
      `/entries/${encodeURIComponent(entrySelect.value)}${collection.previewable ? '?live-preview=1' : ''}`;

    // Stay-put has to look like staying put: if the trip is called off, the
    // picker goes back to naming the entry that's actually open.
    navigateFromLp(win, entrySelect, url, () => {
      entrySelect.value = currentEntryId(win) ?? '';
    });
  });

  newBtn.addEventListener('click', () => {
    const collection = selected();

    newEntryDialog(win, collection, (id) => {
      const url =
        `${win.location.origin}/cp/collections/${encodeURIComponent(collection.handle)}` +
        `/entries/${encodeURIComponent(id)}${collection.previewable ? '?live-preview=1' : ''}`;

      // The entry already exists by now, so there is nothing unsaved to ask about
      // — but this is the route that knows how to land in a preview.
      navigateFromLp(win, newBtn, url);
    });
  });

  wrap.appendChild(collectionSelect);
  // Søm mellem de to der vælger noget. Ikke foran "+ New" — den har sin egen
  // mørke flade, og en streg klods op ad dens kant er to kanter samme sted.
  wrap.appendChild(headerSeam(doc));
  wrap.appendChild(entrySelect);
  wrap.appendChild(newBtn);
  group.after(wrap);

  // Open on whatever you're already editing, so the picker reads as "you are
  // here" rather than an empty control.
  collectionSelect.value = currentCollection(win) ?? collections[0].handle;
  fillEntries(true);
}

// --- Global section panel -------------------------------------------------------
//
// A synced section's content lives in another entry, so the page's form has
// nothing to edit — only a reference. This opens that entry's own editor in the
// left Live Preview panel and stashes what's being typed, so the page around it
// re-renders live: editing in context, without the section ever needing a URL of
// its own.

/**
 * Where the synced entry's form is built — the one switch between the two ways
 * of editing a global section.
 *
 * true (default) — in THIS window. Statamic renders the entry screen from a
 *   single component, `EntryPublishForm`, and registers it on the CP's Vue app,
 *   so the same form can be mounted straight into the Live Preview field column
 *   from the props the CP would have handed it. Its sets then sit in the very
 *   document the preview talks to, which is the whole point: `findSetByUid`
 *   finds them, Statamic's own Add Set picker opens over the "+" in the preview,
 *   the sidebar shows the section like any other, and Save is the entry form's
 *   own Save. A global section runs on the page's code, not a copy of it.
 *
 * false — the older way: the same form in an iframe covering the left panel,
 *   reached only over postMessage. Every piece of that route is still here
 *   (openGlobalSectionPanel, forwardGlobalSectionFocus, the sve-section-* message
 *   handlers, openSetPickerOverPreview, autoPickSet), so flipping this back
 *   restores it whole.
 */
const GLOBAL_SECTION_INLINE = true;

/**
 * The same question asked of the site's header and footer — one switch, same
 * shape as the one above.
 *
 * true (default) — Theme Settings' own publish form is mounted in the Live
 *   Preview field column, isolated to the Header (or Footer) tab. Its widgets are
 *   then sets in this document like any section's blocks: clicking one opens it
 *   in the panel, inline edit writes to a real publish container, and Save is the
 *   globals form's own Save.
 *
 * false — the docked Theme Settings iframe, driven over postMessage. That whole
 *   route is still here (openGlobalsPanel, lockChromeGlobalsTab, the sve-lock-tab
 *   and sve-chrome-set-style messages), and it is also what the in-window route
 *   falls back to when the globals page cannot be mounted — so flipping this back
 *   restores it whole.
 *
 * Goes on together with CHROME_LOCKS_PAGE in bridge.js: the page lock is part of
 * editing the header in the left panel, and one without the other is half a
 * behaviour.
 */
const CHROME_INLINE = true;

const GLOBAL_SECTION_PANEL_ID = '__sve-global-section-panel';

/** The div the synced entry's form is mounted into, in this document. */
const GLOBAL_SECTION_HOST_ID = '__sve-global-section-host';

/** Publish-container name for that form — never "base", which is the page's. */
const GLOBAL_SECTION_CONTAINER = 'sve-global-section';

/** Marks the page's own fields while the field column belongs to a global section. */
const GLOBAL_SECTION_AWAY_ATTR = 'data-sve-global-away';

// The panel's latest values, as it streams them up: { id, values }. This is what
// lets a global section be edited inline like any other — see activeContainers.
let sectionPanelValues = null;

/** First hydrate of the panel form — not a real edit. Same idea as chrome baseline. */
let sectionValuesBaseline = null;

/** True while the form holds exactly what it was opened with — nothing to save. */
let sectionValuesMatchBaseline = true;

/** True after we've pushed unsaved global-section values into the preview stash. */
let sectionsStashActive = false;

/** Edit-request that arrived before the panel streamed values — retry once ready. */
let pendingEditUntilPanel = null;

/** Preview click/focus that arrived before the panel iframe could receive it. */
let pendingFocusUntilPanel = null;

/**
 * How long after a save the next values still count as the save's own echo.
 *
 * Statamic replaces the form's values with what the server sent back, and that
 * lands a beat after the request resolves — so the first thing read after a save
 * is the saved entry, not an edit of it. Without this window the bar goes back to
 * "unsaved changes" a quarter of a second after saving, and the section is stashed
 * over a page that already has it.
 */
let sectionBaselineUntil = 0;

function globalSectionPanelFrame(win) {
  return win.document.getElementById(GLOBAL_SECTION_PANEL_ID)?.querySelector('iframe') || null;
}

/**
 * Forward a preview click into the synced-section iframe. Returns true when the
 * click was handled (or queued) as a global-section focus — caller must not run
 * the page-form path.
 *
 * Only clicks *inside* a focused global section are forwarded. A click on a
 * normal page section while the panel is still open must hit the page form —
 * otherwise the sidebar shows an empty Headline header from the wrong document
 * while inline edit (correctly) updates the page.
 */
function forwardGlobalSectionFocus(data, doc, win) {
  // No panel means the form is in this window, and there is nowhere to forward
  // to: the section's fields are in this document, so the click takes the same
  // path a page section's does.
  const panel = doc.getElementById(GLOBAL_SECTION_PANEL_ID);

  if (!panel || !(data.field || data.uid) || !data.global) {
    return false;
  }

  const frame = panel.querySelector('iframe');

  if (frame?.contentWindow) {
    pendingFocusUntilPanel = null;
    frame.contentWindow.postMessage(
      {
        source: 'statamic-visual-editor',
        type: 'sve-section-focus',
        uid: data.scope || data.uid,
        field: data.field || null,
      },
      win.location.origin
    );

    return true;
  }

  // Panel shell is up but the entry form has not mounted yet — hold the click.
  pendingFocusUntilPanel = { field: data.field || null, uid: data.scope || data.uid || null };

  return true;
}

function flushPendingFocusUntilPanel(win) {
  if (!pendingFocusUntilPanel) {
    return;
  }

  const frame = globalSectionPanelFrame(win);

  if (!frame?.contentWindow) {
    return;
  }

  const { field, uid } = pendingFocusUntilPanel;

  pendingFocusUntilPanel = null;
  frame.contentWindow.postMessage(
    {
      source: 'statamic-visual-editor',
      type: 'sve-section-focus',
      uid,
      field,
    },
    win.location.origin
  );
}

/**
 * Synced section panel lives in its own iframe — entry $dirty never sees it.
 * Stash activity is the other signal (same idea as Theme Settings).
 */
function hasUnsavedGlobalSection(win) {
  // A stash is only how the page is kept showing what the form holds, so its
  // existence is not the question — whether what it holds differs from what was
  // opened is. Undoing an edit by hand leaves the stash in place and the section
  // with nothing to save.
  if (sectionsStashActive && !sectionValuesMatchBaseline) {
    return true;
  }

  // Edited in this window there is no second $dirty to ask — the form shares the
  // page's, and the baseline compare above is the whole answer.
  const iwin = globalSectionPanelFrame(win)?.contentWindow;

  if (!iwin) {
    return false;
  }

  try {
    const dirty = iwin.Statamic?.$dirty;

    if (typeof dirty?.has !== 'function') {
      return false;
    }

    const raw = typeof dirty.names === 'function' ? dirty.names() : dirty.names;
    const list = unwrapRef(raw);

    if (Array.isArray(list) && list.length) {
      return list.some((name) => dirty.has(name));
    }

    return dirty.has('base');
  } catch {
    return false;
  }
}

/**
 * The open panel, dressed up as a publish container.
 *
 * Reads resolve against the copy of its values it streams us; writes are posted
 * into the panel, where the real container applies them — and its next poll
 * streams the change back, stashes it, and re-renders the page. So an inline edit
 * on a global section takes the same path as one on the page's own fields, and
 * nothing downstream needs to know the difference.
 */
function sectionPanelContainer(doc) {
  // Only ever a stand-in for a panel. Edited in this window the form registers a
  // real publish container of its own (see registerContainerEvents), and the
  // lookup below finds no panel and returns null — as it should.
  const panel = doc.getElementById(GLOBAL_SECTION_PANEL_ID);
  const frame = panel?.querySelector('iframe');

  if (!panel || !frame?.contentWindow || !sectionPanelValues?.values) {
    return null;
  }

  const win = doc.defaultView;

  return {
    name: 'sve-global-section',
    values: sectionPanelValues.values,
    setFieldValue: (path, value) => {
      frame.contentWindow.postMessage(
        { source: 'statamic-visual-editor', type: 'sve-section-set-value', path, value },
        win.location.origin
      );
    },
  };
}

/** Tells the preview to re-render asking for (or forgetting) the stashed section. */
function refreshSections(win, active) {
  const frame = previewFrame(win.document);

  if (!frame?.contentWindow || !lastPreviewUrl) {
    return;
  }

  frame.contentWindow.postMessage({ name: 'sve.sections', active, url: lastPreviewUrl }, win.location.origin);
}

/** A stash landed while someone was typing — the page owes itself a re-render. */
let sectionRefreshPending = false;

/**
 * Re-render the page from the stash, unless someone is typing into it.
 *
 * The panel streams its values four times a second, and every one of them used
 * to force the preview to re-render. That is harmless while the panel is what
 * you are typing in, and destructive while the page is: an inline edit puts the
 * caret inside the very element this replaces, so the node goes, the selection
 * goes with it, and what was half-typed lands nowhere. It reads as flicker, as
 * spaces going missing around a styled span, and then as editing simply
 * stopping — and only sometimes, because it is a race against one's own typing.
 *
 * Nothing is lost by waiting. During an inline edit the page is already showing
 * the text as it is typed — that is what inline editing is — so the render being
 * withheld is the one it is already displaying. The debt is settled on the way
 * out of the edit.
 */
function refreshSectionsUnlessEditing(win) {
  if (editSession) {
    sectionRefreshPending = true;

    return;
  }

  sectionRefreshPending = false;
  refreshSections(win, true);
}

/** An inline edit has ended — pay off a render that was deferred during it. */
function flushPendingSectionRefresh(win) {
  if (!sectionRefreshPending) {
    return;
  }

  sectionRefreshPending = false;
  refreshSections(win, true);
}

function postSectionValues(win, id, values) {
  sectionsStashActive = true;
  notifyGlobalSectionDirty(win);
  win
    .fetch('/!/sve/global-section-stash', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken(win),
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ id, values }),
    })
    .then(() => refreshSectionsUnlessEditing(win))
    .catch(() => {});
}

function clearSectionsStash(win, { refresh = true } = {}) {
  if (!sectionsStashActive) {
    notifyGlobalSectionDirty(win);

    return Promise.resolve();
  }

  sectionsStashActive = false;

  return win
    .fetch('/!/sve/global-section-stash/clear', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'X-CSRF-TOKEN': csrfToken(win), 'X-Requested-With': 'XMLHttpRequest' },
    })
    .catch(() => {})
    .then(() => {
      notifyGlobalSectionDirty(win);

      if (refresh) {
        refreshSections(win, false);
      }
    });
}

/** Listeners for global-section panel save results. */
const sectionSaveListeners = [];

function onSectionSave(callback) {
  sectionSaveListeners.push(callback);

  return () => {
    const index = sectionSaveListeners.indexOf(callback);

    if (index !== -1) {
      sectionSaveListeners.splice(index, 1);
    }
  };
}

function saveGlobalSectionPanel(win, done) {
  if (!hasUnsavedGlobalSection(win)) {
    done(true);

    return;
  }

  const host = globalSectionHost(win.document);
  const iwin = globalSectionPanelFrame(win)?.contentWindow;

  // Nothing open to save into: whatever the stash still holds is not backed by a
  // form any more, so it goes.
  if (!host && !iwin) {
    clearSectionsStash(win, { refresh: false }).finally(() => done(true));

    return;
  }

  let settled = false;

  const finish = (ok) => {
    if (settled) {
      return;
    }

    settled = true;
    stop();
    clearTimeout(timer);
    done(ok);
  };

  const stop = onSectionSave(finish);
  const timer = win.setTimeout(() => finish(false), LP_SAVE_TIMEOUT);

  if (host) {
    pressGlobalSectionSave(win);

    return;
  }

  iwin.postMessage(
    { source: 'statamic-visual-editor', type: 'sve-globals-save' },
    win.location.origin
  );
}

/**
 * Announce the result of a synced-section save.
 *
 * `frame` is the window holding the form when that is somewhere else; edited in
 * this window there is none, and the baseline it would be asked to move is the
 * one right here.
 */
function announceSectionSave(parentWin, ok, frame = null) {
  if (ok) {
    sectionsStashActive = true;
    // Saved = new clean baseline (don't treat the next poll as a fresh edit).
    if (sectionPanelValues?.values) {
      sectionValuesBaseline = JSON.stringify(sectionPanelValues.values);
    }
    sectionValuesMatchBaseline = true;
    sectionBaselineUntil = Date.now() + 2000;
    clearSectionsStash(parentWin, { refresh: false });

    // The panel form keeps its own "what was it when we last agreed" copy —
    // without this it re-reports the very next poll as an edit and the bar
    // goes back to "unsaved changes" a quarter of a second after saving.
    if (frame) {
      try {
        frame.postMessage(
          { source: 'statamic-visual-editor', type: 'sve-globals-saved' },
          parentWin.location.origin
        );
      } catch {
        /* panel closed while saving */
      }
    }
  }

  [...sectionSaveListeners].forEach((listener) => listener(ok));
}

/**
 * Watch a window for the entry save the synced section's form sends.
 *
 * `entryPath` is a function rather than a string because the window being
 * watched can be this one: the CP is not reloaded between global sections, so
 * which entry counts as "the save" changes while the same patched fetch stays in
 * place.
 */
function watchGlobalSectionPanelSaves(iwin, parentWin, entryPath = null) {
  if (!iwin || !parentWin || iwin.__sveSectionSaveWatch) {
    return;
  }

  iwin.__sveSectionSaveWatch = true;

  const savePath = entryPath ?? (() => iwin.location.pathname);
  const frame = iwin === parentWin ? null : iwin;

  const isSave = (url, method) => {
    if (!url || !/^(POST|PUT|PATCH)$/i.test(method || 'GET')) {
      return false;
    }

    const base = savePath();

    if (!base) {
      return false;
    }

    let path;

    try {
      path = new URL(url, iwin.location.origin).pathname;
    } catch {
      return false;
    }

    return path.startsWith(base) && !path.includes('/preview');
  };

  const announce = (ok) => announceSectionSave(parentWin, ok, frame);

  const { fetch: originalFetch } = iwin;

  iwin.fetch = function (input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url;
    const method = init.method ?? (typeof input === 'object' ? input?.method : null);

    if (!isSave(url, method)) {
      return originalFetch.call(this, input, init);
    }

    return originalFetch.call(this, input, init).then(
      (response) => {
        announce(response.ok);

        return response;
      },
      (error) => {
        announce(false);

        throw error;
      }
    );
  };

  // The entry update is a PATCH sent by axios, i.e. XMLHttpRequest — it never
  // goes through fetch at all. Watching only fetch is why saving a synced
  // section left the bar reading "unsaved changes" for the rest of the session:
  // the save happened, nothing ever heard about it, and the baseline that says
  // what "saved" looks like was never moved.
  const { open: originalOpen, send: originalSend } = iwin.XMLHttpRequest.prototype;

  iwin.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.__sveSectionMethod = method;
    this.__sveSectionUrl = url;

    return originalOpen.call(this, method, url, ...rest);
  };

  iwin.XMLHttpRequest.prototype.send = function (...args) {
    if (isSave(this.__sveSectionUrl, this.__sveSectionMethod)) {
      this.addEventListener('load', () => {
        announce(this.status >= 200 && this.status < 300);
      });
      this.addEventListener('error', () => announce(false));
    }

    return originalSend.apply(this, args);
  };
}

function ensureGlobalSectionPanelSaveWatch(win) {
  const frame = globalSectionPanelFrame(win);

  if (!frame) {
    return;
  }

  const arm = () => {
    try {
      if (frame.contentWindow) {
        watchGlobalSectionPanelSaves(frame.contentWindow, win);
      }
    } catch {
      /* iframe not ready */
    }
  };

  arm();
  frame.addEventListener('load', arm);
}

// How long the section panel may stay hidden waiting for its form to rebuild.
// Long enough for a slow boot, short enough that a silent failure is a pause
// rather than an empty panel.
const SECTION_PANEL_REVEAL_MS = 2500;

/**
 * Show the section panel's frame. Called both by the ready handshake and by a
 * fallback timer, so it has to be safe to run twice — setting an opacity that
 * is already 1 costs nothing.
 */
function revealSectionPanelFrame(win) {
  const frame = win.document.getElementById(GLOBAL_SECTION_PANEL_ID)?.querySelector('iframe');

  if (frame) {
    frame.style.opacity = '1';
  }
}

export function closeGlobalSectionPanel(win) {
  // Whichever one is open. Only one ever is.
  if (closeGlobalSectionInline(win)) {
    return;
  }

  const panel = win.document.getElementById(GLOBAL_SECTION_PANEL_ID);

  if (!panel) {
    return;
  }

  panel.remove();
  sectionPanelValues = null;
  sectionValuesBaseline = null;
  sectionValuesMatchBaseline = true;
  pendingEditUntilPanel = null;
  pendingFocusUntilPanel = null;
  // Left editor was covered — restore normal section editing surface.
  const editor = win.document.querySelector('.live-preview-editor');

  if (editor) {
    editor.querySelectorAll('[data-sve-global-cover]').forEach((el) => el.remove());
  }

  syncPreviewInset(win);

  clearSectionsStash(win, { refresh: true });
  syncSectionLibraryAvailability(win);
}

/**
 * Mount the synced section's publish form in the LEFT Live Preview editor —
 * same slot a normal section uses. Keeps an iframe so values can stream for
 * inline edit; does NOT open a right-hand drawer.
 */
export function openGlobalSectionPanel(win, id) {
  if (GLOBAL_SECTION_INLINE) {
    openGlobalSectionInline(win, id);

    return;
  }

  openGlobalSectionPanelFrame(win, id);
}

/**
 * The docked-panel route: the same form, in an iframe covering the left editor,
 * reached only over postMessage. Kept whole — GLOBAL_SECTION_INLINE picks
 * between this and the in-window form, and this is also where the in-window one
 * falls back to when there is no Live Preview editor to mount into.
 */
function openGlobalSectionPanelFrame(win, id) {
  const doc = win.document;
  const existing = doc.getElementById(GLOBAL_SECTION_PANEL_ID);

  // Already showing this section — leave it be. Rebuilding would reload the form
  // and throw away whatever is half-typed in it.
  if (existing?.dataset.sveSectionId === id) {
    setLpMode(win, 'show');

    return;
  }

  // Close other right drawers; keep left editor free for this form.
  closeRightPanels(win, []);

  sectionValuesBaseline = null;
  sectionValuesMatchBaseline = true;
  pendingEditUntilPanel = null;
  pendingFocusUntilPanel = null;

  setLpMode(win, 'show');

  const editor = doc.querySelector('.live-preview-editor');
  const collection = encodeURIComponent(savedSectionsCollection(win));
  const url = new URL(`/cp/collections/${collection}/entries/${encodeURIComponent(id)}`, win.location.origin);

  url.searchParams.set(GLOBALS_PANEL_PARAM, '1');

  const panel = doc.createElement('div');

  panel.id = GLOBAL_SECTION_PANEL_ID;
  panel.dataset.sveSectionId = id;
  panel.setAttribute('data-sve-global-cover', '');
  panel.style.cssText =
    'position:absolute;inset:0;z-index:50;display:flex;flex-direction:column;' +
    'background:var(--theme-color-content-bg,#fff);';

  // Docked in Live Preview the preview draws its own bar over the page — the one
  // naming the section, saying whether it has unsaved work, and holding Save and
  // Close. A second Save above the panel is the same button twice, and the strip
  // it sits in is a band of nothing between the top of the panel and the section
  // it is showing. Off the Live Preview screen there is no such bar, so the
  // fallback keeps it: that is the only way to save from there.
  const bar = editor ? null : doc.createElement('div');

  if (bar) {
    bar.style.cssText =
      'display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:6px 10px;' +
      'border-bottom:1px solid rgba(128,128,128,.24);flex:0 0 auto;';

    const save = doc.createElement('button');

    save.type = 'button';
    save.textContent = t(win, 'save');
    save.title = t(win, 'save_global_section');
    save.style.cssText =
      'all:unset;cursor:pointer;padding:5px 12px;border-radius:6px;background:var(--theme-color-primary,#4f46e5);' +
      'color:#fff;font-size:12px;font-weight:600;line-height:1;';
    save.addEventListener('click', () => {
      doc
        .getElementById(GLOBAL_SECTION_PANEL_ID)
        ?.querySelector('iframe')
        ?.contentWindow?.postMessage({ source: 'statamic-visual-editor', type: 'sve-globals-save' }, win.location.origin);
    });
    bar.appendChild(save);
  }

  const frame = doc.createElement('iframe');

  frame.src = url.toString();
  frame.title = t(win, 'global_panel_title');
  // The form arrives as the CP's raw publish view and is rebuilt in place —
  // tabs become a segmented control, blocks become cards. Watching that rebuild
  // is the flicker, so the frame stays invisible until the panel reports ready.
  // The timer is the safety net: a boot that never reports still reveals
  // itself, so a failure can never leave a permanently blank panel.
  frame.style.cssText =
    'flex:1 1 auto;width:100%;border:0;background:transparent;' +
    'opacity:0;transition:opacity .12s ease;';
  frame.addEventListener('load', () => flushPendingFocusUntilPanel(win));
  win.setTimeout(() => revealSectionPanelFrame(win), SECTION_PANEL_REVEAL_MS);

  if (bar) {
    panel.appendChild(bar);
  }

  panel.appendChild(frame);

  if (editor) {
    const cs = win.getComputedStyle(editor);

    if (cs.position === 'static') {
      editor.style.position = 'relative';
    }

    editor.appendChild(panel);
  } else {
    // Fallback if LP editor isn't mounted yet — left-docked fixed panel.
    const header = lpHeader(doc);
    const top = header ? Math.round(header.getBoundingClientRect().bottom) : 0;

    panel.style.cssText =
      `position:fixed;top:${top}px;left:0;bottom:0;width:${lpStoredWidth(win)}px;z-index:40;` +
      'display:flex;flex-direction:column;background:var(--theme-color-content-bg,#fff);' +
      'border-right:1px solid rgba(128,128,128,.28);box-shadow:8px 0 24px rgba(0,0,0,.12);';
    doc.body.appendChild(panel);
  }

  ensureGlobalSectionPanelSaveWatch(win);
  notifyGlobalSectionDirty(win);
}

// --- Global section, edited in this window ---------------------------------------
//
// Everything below builds the synced entry's form where the page's own form
// already is: inside the Live Preview field column. That is the whole difference.
// Once its sets are in this document, a global section is not a special case any
// more — the "+" opens Statamic's picker over the preview, the sidebar solos the
// section, the arrows move it, and inline edit writes to a real publish container.
// Nothing here re-implements any of that; it only puts the fields within reach of
// the code that already does it.

/** The mounted form: its Vue app, the entry it shows, and how to save it. */
let globalSectionApp = null;
let globalSectionEntryPath = null;
let globalSectionValuesTimer = null;
let globalSectionValuesSeen = null;

function globalSectionHost(doc) {
  return doc.getElementById(GLOBAL_SECTION_HOST_ID);
}

/** True while a global section owns the editor, whichever way it was opened. */
function globalSectionEditorOpen(doc) {
  return !!(doc.getElementById(GLOBAL_SECTION_PANEL_ID) || globalSectionHost(doc));
}

/** The synced entry's own publish container, once its form has mounted. */
function globalSectionContainer() {
  return publishContainers.find((container) => container.name === GLOBAL_SECTION_CONTAINER) || null;
}

/**
 * Ask the Control Panel for a screen the way the Control Panel asks itself.
 *
 * Inertia answers an edit route with exactly the props its page component
 * expects — blueprint, values, meta, localizations and all — so a form can be
 * built here from the same answer, and none of it has to be kept in step by hand
 * with what Statamic's forms want next.
 */
async function fetchInertiaPage(win, path) {
  const version = win.Statamic?.$app?.config?.globalProperties?.$page?.version || '';

  const response = await win.fetch(path, {
    credentials: 'same-origin',
    headers: {
      'X-Inertia': 'true',
      'X-Inertia-Version': version,
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'text/html, application/xhtml+xml',
    },
  });

  if (!response.ok) {
    return null;
  }

  const page = await response.json();

  return page?.props ? { component: page.component, props: page.props, path } : null;
}

/** The synced entry's screen, as Inertia would have delivered it. */
function fetchGlobalSectionProps(win, id) {
  const collection = encodeURIComponent(savedSectionsCollection(win));

  return fetchInertiaPage(win, `/cp/collections/${collection}/entries/${encodeURIComponent(id)}`);
}

/** Inertia props → the prop names EntryPublishForm declares. */
function globalSectionFormProps(props) {
  return {
    publishContainer: GLOBAL_SECTION_CONTAINER,
    method: 'patch',
    // Statamic's own word for "this form is not the screen you are on". Without
    // it a save obeys the after-save preference, which defaults to `listing` —
    // so saving a global section navigated the whole Control Panel to the Global
    // sections index and took Live Preview, the page and the preview with it.
    // It also drops the after-save dropdown and the remembered tab, both of which
    // belong to a form that owns its page.
    isInline: true,
    collectionHandle: props.collection,
    initialActions: props.actions,
    initialTitle: props.title,
    initialReference: props.reference,
    initialFieldset: props.blueprint,
    initialValues: props.values,
    initialExtraValues: props.extraValues,
    initialLocalizedFields: props.localizedFields,
    initialMeta: props.meta,
    initialPermalink: props.permalink,
    originBehavior: props.originBehavior,
    initialLocalizations: props.localizations,
    initialHasOrigin: props.hasOrigin,
    initialOriginValues: props.originValues,
    initialOriginMeta: props.originMeta,
    initialSite: props.locale,
    initialIsWorkingCopy: props.hasWorkingCopy,
    revisionsEnabled: props.revisionsEnabled,
    initialReadOnly: props.readOnly,
    canEditBlueprint: props.canEditBlueprint,
    canManagePublishState: props.canManagePublishState,
    createAnotherUrl: props.createAnotherUrl,
    initialListingUrl: props.initialListingUrl,
    previewTargets: props.previewTargets,
    autosaveInterval: props.autosaveInterval,
    initialItemActions: props.itemActions,
    itemActionUrl: props.itemActionUrl,
  };
}

/**
 * Mount a Statamic form into a host of ours, in this window.
 *
 * A second Vue app rather than a node in the CP's own tree, because there is no
 * seam in the entry screen to hang one off. It borrows the CP app's registry so
 * every fieldtype, directive and injected service resolves exactly as it does on
 * the real screen — the form cannot tell the difference, which is the only way
 * this stays true as Statamic changes.
 */
function mountBorrowedForm(win, host, renderRoot, label) {
  const Vue = win.Vue;
  const app = win.Statamic?.$app;

  if (!Vue?.createApp || !app) {
    return null;
  }

  try {
    const sub = Vue.createApp(Vue.defineComponent({ setup: () => renderRoot(Vue) }));

    Object.assign(sub._context.components, app._context.components);
    Object.assign(sub._context.directives, app._context.directives);
    Object.assign(sub._context.provides, app._context.provides);
    Object.assign(sub.config.globalProperties, app.config.globalProperties);

    sub.mount(host);

    return sub;
  } catch (err) {
    console.error(`[sve] ${label}`, err);

    return null;
  }
}

function mountGlobalSectionForm(win, host, props) {
  globalSectionApp = mountBorrowedForm(
    win,
    host,
    (Vue) => {
      // Resolved here, not by name in h(): a string type is an ELEMENT to Vue's
      // runtime, so h('EntryPublishForm') renders a literal <entrypublishform>
      // tag and nothing inside it ever mounts.
      const Form = Vue.resolveComponent('EntryPublishForm');

      return () => Vue.h(Form, globalSectionFormProps(props));
    },
    'global section form'
  );

  return !!globalSectionApp;
}

/**
 * Hide the page's own fields while the column belongs to a global section.
 *
 * The solo view does this too, once it has a set to isolate — but the form takes
 * a moment to mount, and without this the page's fields sit under the section's
 * for that moment. Marked rather than detached: the page's form keeps its state,
 * and stepping back out is one attribute removal away.
 */
function hidePageFieldsForGlobalSection(host) {
  const column = host.parentElement;

  if (!column) {
    return;
  }

  [...column.children].forEach((child) => {
    if (child !== host) {
      child.setAttribute(GLOBAL_SECTION_AWAY_ATTR, '');
    }
  });
}

function showPageFieldsAgain(doc) {
  doc.querySelectorAll(`[${GLOBAL_SECTION_AWAY_ATTR}]`).forEach((el) =>
    el.removeAttribute(GLOBAL_SECTION_AWAY_ATTR)
  );
}

/**
 * Open the synced entry's form in the left Live Preview editor, in this window.
 */
async function openGlobalSectionInline(win, id) {
  const doc = win.document;
  const existing = globalSectionHost(doc);

  // Already showing this section — leave it be. Rebuilding would reload the form
  // and throw away whatever is half-typed in it.
  if (existing?.dataset.sveSectionId === id) {
    setLpMode(win, 'show');

    return;
  }

  closeGlobalSectionInline(win, { refresh: false });

  // Close other drawers; the field column is this section's now.
  closeRightPanels(win, []);
  setLpMode(win, 'show');

  const column = doc.querySelector('.live-preview-fields') || doc.querySelector('.live-preview-editor');

  if (!column) {
    // No Live Preview editor to mount into — fall back to the docked panel, which
    // builds its own surface and does not need one.
    openGlobalSectionPanelFrame(win, id);

    return;
  }

  const host = doc.createElement('div');

  host.id = GLOBAL_SECTION_HOST_ID;
  host.dataset.sveSectionId = id;
  // Invisible until the section has been soloed: the form mounts as a whole entry
  // screen — title, Published, tabs — and watching that be pared down to one
  // section is the flicker. Same reveal the docked panel used.
  host.style.cssText = 'opacity:0;transition:opacity .12s ease;';
  column.appendChild(host);
  hidePageFieldsForGlobalSection(host);

  const loaded = await fetchGlobalSectionProps(win, id).catch(() => null);

  // Closed (or moved on) while the props were in flight.
  if (globalSectionHost(doc) !== host) {
    return;
  }

  if (!loaded?.props || !mountGlobalSectionForm(win, host, loaded.props)) {
    closeGlobalSectionInline(win);

    return;
  }

  globalSectionEntryPath = new URL(loaded.path, win.location.origin).pathname;
  watchGlobalSectionInlineSaves(win);
  watchGlobalSectionInlineValues(win, id);
  bootGlobalSectionSolo(win, doc, host);
  notifyGlobalSectionDirty(win);
  syncSectionLibraryAvailability(win);
}

/** Solo the section the way a click on a page section would. */
function bootGlobalSectionSolo(win, doc, host) {
  const field = sectionField(win);
  let attempts = 0;

  const reveal = () => {
    if (globalSectionHost(doc) === host) {
      host.style.opacity = '1';
    }
  };

  // Safety net: a boot that never settles still shows its form rather than
  // leaving a blank column behind.
  win.setTimeout(reveal, SECTION_PANEL_REVEAL_MS);

  const tryBoot = () => {
    if (globalSectionHost(doc) !== host) {
      return;
    }

    const container = globalSectionContainer();
    const values = container ? unwrapRef(container.values) : null;
    const rows = values && typeof values === 'object' ? values[field] : null;

    if (Array.isArray(rows) && rows.length) {
      // Legacy synced entries stripped nested ids — assign them once so preview
      // scope="{{ id }}" and focusFieldOwner can target the blocks inside.
      const next = JSON.parse(JSON.stringify(rows));

      if (ensureNestedRowIds(next)) {
        container.setFieldValue(field, next);
        win.setTimeout(tryBoot, 150);

        return;
      }

      const uid = next[0]?._visual_id || next[0]?.id || next[0]?._id;

      if (uid && findSetByUid(uid, doc) && soloSection(uid, doc, win, { kind: 'section' })) {
        reveal();

        return;
      }

      if (uid) {
        expandTopLevelSectionSets(doc, field);
      }
    }

    if (attempts++ < 80) {
      win.setTimeout(tryBoot, 120);

      return;
    }

    reveal();
  };

  tryBoot();
}

/**
 * Read what the form holds, four times a second.
 *
 * Polled rather than watched for the same reason the docked panel polled: the
 * container's `values` is a Vue ref, and a JSON compare is both cheaper and far
 * more robust than reaching into Vue's reactivity from outside its own bundle.
 */
function watchGlobalSectionInlineValues(win, id) {
  stopGlobalSectionInlineValues(win);
  globalSectionValuesSeen = null;

  globalSectionValuesTimer = win.setInterval(() => {
    const container = globalSectionContainer();
    const values = container ? unwrapRef(container.values) : null;

    if (!values || typeof values !== 'object') {
      return;
    }

    const serialized = JSON.stringify(values);

    if (serialized === globalSectionValuesSeen) {
      return;
    }

    globalSectionValuesSeen = serialized;
    applySectionValues(win, id, JSON.parse(serialized));
  }, 250);
}

function stopGlobalSectionInlineValues(win) {
  if (globalSectionValuesTimer) {
    win.clearInterval(globalSectionValuesTimer);
    globalSectionValuesTimer = null;
  }
}

/**
 * The entry's own Save, pressed for it.
 *
 * The button is in the form's own header, which the solo view hides — hidden is
 * not disabled, so clicking it runs Statamic's real save: validation, revisions,
 * toast and all. An entry's button reads "Save & Publish" and a global set's
 * reads "Save", so the match is on the start of the label.
 */
function pressGlobalSectionSave(win) {
  const host = globalSectionHost(win.document);

  if (!host) {
    return false;
  }

  const button = [...host.querySelectorAll('button')].find((el) =>
    /^(save|gem)\b/i.test((el.textContent || '').trim())
  );

  if (!button) {
    return false;
  }

  button.click();

  return true;
}

/**
 * Hear the save go out.
 *
 * The form is in this window now, so the request it sends is this window's —
 * matched on the synced entry's own path, which is read live because the CP is
 * never reloaded between one global section and the next.
 */
function watchGlobalSectionInlineSaves(win) {
  watchGlobalSectionPanelSaves(win, win, () => globalSectionEntryPath);
}

/**
 * Take the form back down and hand the column back to the page. Returns whether
 * there was one — that is how the caller knows which of the two routes was open.
 */
function closeGlobalSectionInline(win, { refresh = true } = {}) {
  const doc = win.document;
  const host = globalSectionHost(doc);

  stopGlobalSectionInlineValues(win);

  if (!host) {
    return false;
  }

  if (globalSectionApp) {
    try {
      globalSectionApp.unmount();
    } catch {
      /* already gone */
    }

    globalSectionApp = null;
  }

  host.remove();
  showPageFieldsAgain(doc);

  // The solo marks point at a set that has just left the document. Cleared, or
  // the page's own form comes back with every row hidden but one that no longer
  // exists — an empty sidebar.
  clearSolo(doc);

  globalSectionEntryPath = null;
  globalSectionValuesSeen = null;
  sectionBaselineUntil = 0;
  sectionPanelValues = null;
  sectionValuesBaseline = null;
  sectionValuesMatchBaseline = true;
  pendingEditUntilPanel = null;
  pendingFocusUntilPanel = null;

  rearmFirstSection();
  syncPreviewInset(win);
  clearSectionsStash(win, { refresh });
  syncSectionLibraryAvailability(win);

  return true;
}

// --- Header / footer, edited in this window --------------------------------------
//
// The site's header and footer are fields on a global set (Theme Settings), not
// on the page — so, like a synced section, the page's own form has nothing to
// edit. Everything below does for that global what the block above does for a
// synced entry: mounts Statamic's own globals form in the Live Preview field
// column and isolates it to the one tab the chrome belongs to. From there the
// header's widgets are sets in this document, and every piece of the editor that
// works on a page section works on them — because it is the same code.

/** The div Theme Settings' form is mounted into, in this document. */
const CHROME_HOST_ID = '__sve-chrome-host';

/** Publish-container name for that form — never "base", which is the page's. */
const CHROME_CONTAINER = 'sve-chrome';

let chromeApp = null;
let chromeInlineKind = null;
let chromeInlineHandle = null;
let chromeValuesTimer = null;
let chromeValuesSeen = null;

function chromeHost(doc) {
  return doc.getElementById(CHROME_HOST_ID);
}

/** True while header/footer owns the editor, whichever way it was opened. */
function chromeEditorOpen(doc) {
  return !!(doc.getElementById(GLOBALS_PANEL_ID) || chromeHost(doc));
}

/** Theme Settings' own publish container, once its form has mounted. */
function chromeContainer() {
  return publishContainers.find((container) => container.name === CHROME_CONTAINER) || null;
}

/**
 * Statamic's own page-component resolver, borrowed off the running app.
 *
 * The globals screen is an Inertia page, not one of the components registered on
 * the CP's Vue app, so there is no name to resolve it by. Inertia holds the
 * resolver that knows how to load it — asking that rather than reaching for a
 * hashed asset path means this keeps working across Statamic builds.
 */
function inertiaPageResolver(win) {
  const start = win.document.querySelector('main') || win.document.body;
  let component = start?.__vueParentComponent;

  while (component) {
    if (typeof component.props?.resolveComponent === 'function') {
      return component.props.resolveComponent;
    }

    component = component.parent;
  }

  return null;
}

/**
 * Mount Theme Settings' form, under a container name of our own.
 *
 * The globals page hardcodes `publish-container="base"` — the page entry's name —
 * and two containers answering to one name is a form writing into another form's
 * values. The page's render is therefore taken as it is built and the one prop
 * rewritten before Vue ever sees it. The same pass drops the page's <Head>
 * sibling: it wants Inertia's head manager, which a borrowed app has no business
 * providing, and the form is the only part of that screen we came for.
 */
function mountChromeForm(win, host, Page, props) {
  let form = null;

  const findForm = (vnode) => {
    if (!vnode || typeof vnode !== 'object' || form) {
      return;
    }

    if (Array.isArray(vnode)) {
      vnode.forEach(findForm);

      return;
    }

    if (vnode.props && ('publish-container' in vnode.props || 'publishContainer' in vnode.props)) {
      if ('publish-container' in vnode.props) {
        vnode.props['publish-container'] = CHROME_CONTAINER;
      }

      if ('publishContainer' in vnode.props) {
        vnode.props.publishContainer = CHROME_CONTAINER;
      }

      form = vnode;

      return;
    }

    if (Array.isArray(vnode.children)) {
      vnode.children.forEach(findForm);
    }
  };

  const Patched = {
    ...Page,
    render(...args) {
      form = null;

      const tree = Page.render.apply(this, args);

      findForm(tree);

      return form || tree;
    },
  };

  // A build that no longer renders the form this way would leave us mounting the
  // whole globals screen under the page's own container name. Better to say so
  // and let the docked panel take it.
  if (typeof Page.render !== 'function') {
    console.error('[sve] globals page has no render — chrome falls back to the panel');

    return false;
  }

  chromeApp = mountBorrowedForm(win, host, (Vue) => () => Vue.h(Patched, props), 'chrome form');

  return !!chromeApp;
}

/** The tab button in the mounted form whose label names this chrome. */
function chromeTabButton(host, kind) {
  const needle = kind === 'footer' ? 'footer' : 'header';

  return [...host.querySelectorAll('button[role="tab"]')].find((tab) =>
    (tab.textContent || '').trim().toLowerCase().startsWith(needle)
  );
}

function activeChromeTabPanel(host) {
  return (
    host.querySelector('[role="tabpanel"][data-state="active"]') ||
    [...host.querySelectorAll('[role="tabpanel"]')].find((panel) => panel.offsetParent !== null) ||
    null
  );
}

/**
 * Show one tab and nothing else.
 *
 * The isolation is the section view's isolation — the same keep/parent marking
 * `markSoloPath` does, started at the tab's own panel instead of at a set. So the
 * globals form arrives stripped of everything a section's card is stripped of:
 * its title bar, its Save, the row of other tabs, and the page's own fields
 * behind it. What is left is the header's fields under a header naming them.
 */
/**
 * The form's own fields, for a set whose blueprint draws no tab bar.
 *
 * A set holding a single half has a single tab, and Statamic renders no tab
 * strip for one tab — so there is no tabpanel to isolate and no button to press.
 * The whole form is the half, which is the answer, not a failure.
 *
 * Saying "not yet" here is expensive in a way that is easy to miss: the boot
 * retries every 120ms and the host stays at opacity 0 until either the solo
 * lands or the blind reveal timer fires, and that timer is 2.5 seconds. A form
 * that could never be isolated therefore always cost the full 2.5s before it
 * appeared — the whole of the wait between clicking the header and seeing it.
 */
function soleChromePanel(host) {
  // A tab strip means the tabs are still rendering; that is genuinely "not yet",
  // and answering with the whole form would isolate every half at once.
  if (host.querySelector('[role="tabpanel"]') || host.querySelector('button[role="tab"]')) {
    return null;
  }

  return host.querySelector('.publish-fields') || null;
}

function soloChromeTab(win, doc, kind) {
  const host = chromeHost(doc);
  const editor = soloRoot(doc);

  if (!host || !editor || !editor.contains(host)) {
    return false;
  }

  const tab = chromeTabButton(host, kind);
  const tabs = host.querySelectorAll('button[role="tab"]');

  // No tab by that name, and more than one to choose from: this is the other
  // half's form, still mounted. Saying "not yet" keeps the caller's host at
  // opacity 0 — isolating the active panel here is what used to leave the
  // previous half on screen until the right form arrived.
  if (!tab && tabs.length > 1) {
    return false;
  }

  if (tab && tab.getAttribute('aria-selected') !== 'true') {
    // reka-ui switches on the full pointer sequence, never a bare click().
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
      tab.dispatchEvent(new win.PointerEvent(type, { bubbles: true, cancelable: true }));
    });
  }

  const panel = activeChromeTabPanel(host) || soleChromePanel(host);

  if (!panel) {
    return false;
  }

  ensureSoloStyle(doc);

  doc.querySelectorAll(`[${SOLO_PARENT_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_PARENT_ATTR));
  doc.querySelectorAll(`[${SOLO_KEEP_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_KEEP_ATTR));

  for (let node = panel; node && node !== editor && node.parentElement; node = node.parentElement) {
    node.setAttribute(SOLO_KEEP_ATTR, '');
    node.parentElement.setAttribute(SOLO_PARENT_ATTR, '');
  }

  // Lives outside Vue's tree; without this the stylesheet hides it.
  doc.getElementById(FOCUS_HEADER_ID)?.setAttribute(SOLO_KEEP_ATTR, '');

  // The word is written for the middle of a sentence ("you are editing the
  // header"); at the top of the panel it is a name, so it starts like one.
  const word = t(win, kind === 'footer' ? 'chrome_footer' : 'chrome_header');

  paintFocusHeader(
    win,
    doc,
    {
      display: word.charAt(0).toUpperCase() + word.slice(1),
      icon: null,
      instructions: '',
    },
    null
  );

  return true;
}

/**
 * Keep that view on screen while Vue rebuilds the form under it.
 *
 * Stored in `soloObserver` on purpose: it is the same slot a section's solo uses,
 * so stepping from the header into one of its widgets replaces this watch with
 * that one, and `clearSolo` takes down whichever is running.
 */
function watchChromeSolo(win, doc, kind) {
  if (soloObserver) {
    soloObserver.disconnect();
  }

  const target = doc.querySelector('.live-preview-fields') || doc.body;
  let queued = false;

  soloObserver = new MutationObserver(() => {
    if (chromeInlineKind !== kind || soloUid || queued) {
      return;
    }

    queued = true;
    win.requestAnimationFrame(() => {
      queued = false;

      if (chromeInlineKind === kind && !soloUid && chromeHost(doc)) {
        soloChromeTab(win, doc, kind);
      }
    });
  });
  soloObserver.observe(target, { childList: true, subtree: true });
}

/**
 * The half that isn't open, fetched ahead of being asked for.
 *
 * Only for the case where the two halves have a global set each: stepping across
 * then means unmounting one form and building another, and a round trip in the
 * middle is a field column standing empty. Entries are taken, not read — one
 * mount consumes the page and warms the next one — so nothing here outlives a
 * save of the set it came from.
 */
const chromeInlinePages = new Map();

async function takeChromeInlinePage(win, handle) {
  const pending = chromeInlinePages.get(handle);

  chromeInlinePages.delete(handle);

  // A warmed page that came back empty must never be handed on. It is
  // indistinguishable from a real miss by the time the mount sees it, and the
  // editor answers a failed mount by falling back to the docked panel — which
  // opens the header on the RIGHT, in the panel meant for globals, instead of in
  // the field column on the left. A warm miss is thrown away and the click pays
  // for one honest fetch: slower than warm, still the right side of the screen.
  const warmed = pending ? await pending : null;

  return warmed ?? fetchInertiaPage(win, `/cp/globals/${encodeURIComponent(handle)}`).catch(() => null);
}

function prefetchOtherChromeHalf(win, kind) {
  const handle = chromeGlobalHandle(win, kind === 'footer' ? 'header' : 'footer');

  // One shared set: the other half is a tab of the form already mounted.
  if (handle === chromeGlobalHandle(win, kind) || chromeInlinePages.has(handle)) {
    return;
  }

  chromeInlinePages.set(
    handle,
    fetchInertiaPage(win, `/cp/globals/${encodeURIComponent(handle)}`).catch(() => null)
  );
}

/**
 * Both halves' screens, fetched before either one is clicked.
 *
 * The click costs an Inertia page fetch, a component resolve and a mount, and
 * only the last two are unavoidable — so the fetch is done up front, while the
 * preview is still rendering and nothing is waiting on it. That is the whole
 * difference between a panel that opens and a panel that arrives.
 */
function warmChromeInlinePages(win) {
  ['header', 'footer'].forEach((kind) => {
    const handle = chromeGlobalHandle(win, kind);

    if (chromeInlinePages.has(handle)) {
      return;
    }

    const pending = fetchInertiaPage(win, `/cp/globals/${encodeURIComponent(handle)}`).catch(() => null);

    chromeInlinePages.set(handle, pending);

    // Warming runs early — early enough that Inertia may not have a version to
    // send yet and the server answers with a conflict rather than a page. An
    // empty answer is forgotten rather than kept, so the next warm-up can try
    // again and a click never inherits it.
    pending.then((page) => {
      if (!page && chromeInlinePages.get(handle) === pending) {
        chromeInlinePages.delete(handle);
      }
    });
  });
}

/**
 * Forget the warmed screens.
 *
 * A saved set makes every page fetched before it wrong, and a warm page is
 * indistinguishable from a fresh one once it is mounted — the form would open on
 * the values as they were before the save. Cheaper to fetch again than to be
 * subtly wrong, so a save simply throws them away and warms them anew.
 */
function resetChromeInlinePages(win) {
  chromeInlinePages.clear();
  warmChromeInlinePages(win);
}

/** Open header/footer in the left editor, in this window. */
async function openChromeInline(win, kind) {
  const doc = win.document;
  const chromeKind = kind === 'footer' ? 'footer' : 'header';
  const handle = chromeGlobalHandle(win, chromeKind);
  const existing = chromeHost(doc);

  setActiveChromeKind(chromeKind);
  chromeInlineKind = chromeKind;
  setLpMode(win, 'show');

  // Both halves in one set: they are two tabs of one form, and stepping across is
  // a tab switch rather than a remount — nothing half-typed is lost.
  if (existing && chromeInlineHandle === handle) {
    soloUid = null;
    soloChromeTab(win, doc, chromeKind);
    watchChromeSolo(win, doc, chromeKind);
    syncSectionLibraryAvailability(win);

    return;
  }

  // A set each: the form standing there holds the other half's fields, and no tab
  // of it is the one being asked for. It has to go before the right one is built
  // — the page for that one is normally already in hand (see the prefetch at the
  // end of this function), so the swap is one frame, not a fetch.
  if (existing) {
    closeChromeInline(win, { refresh: false });
    setActiveChromeKind(chromeKind);
    chromeInlineKind = chromeKind;
  }

  closeRightPanels(win, []);

  const column = doc.querySelector('.live-preview-fields') || doc.querySelector('.live-preview-editor');
  const resolver = inertiaPageResolver(win);

  if (!column || !resolver) {
    openGlobalsPanelFrameForChrome(win, chromeKind);

    return;
  }

  const host = doc.createElement('div');

  host.id = CHROME_HOST_ID;
  host.dataset.sveChromeKind = chromeKind;
  // Invisible until the tab has been isolated: the form mounts as the whole Theme
  // Settings screen — title, Save, ten tabs — and watching that be pared back to
  // one of them is the flicker.
  host.style.cssText = 'opacity:0;transition:opacity .12s ease;';
  column.appendChild(host);
  hidePageFieldsForGlobalSection(host);

  const loaded = await takeChromeInlinePage(win, handle);

  if (chromeHost(doc) !== host) {
    return;
  }

  let Page = null;

  if (loaded?.component) {
    try {
      const mod = await resolver(loaded.component);

      Page = mod?.default ?? mod;
    } catch {
      Page = null;
    }
  }

  if (chromeHost(doc) !== host) {
    return;
  }

  if (!Page || !mountChromeForm(win, host, Page, loaded.props)) {
    closeChromeInline(win);
    openGlobalsPanelFrameForChrome(win, chromeKind);

    return;
  }

  chromeInlineHandle = handle;
  watchChromeInlineSaves(win);
  watchChromeInlineValues(win, handle);
  bootChromeSolo(win, doc, host, chromeKind);
  syncSectionLibraryAvailability(win);
  // Both, not just the other one: this half was consumed on the way in, and
  // re-opening it later should cost no more than stepping across does.
  warmChromeInlinePages(win);
}

/** The docked Theme Settings route, for when the in-window one cannot be built. */
function openGlobalsPanelFrameForChrome(win, kind) {
  const set = globalSets(win).find((candidate) => candidate.handle === chromeGlobalHandle(win, kind));

  if (!set) {
    return;
  }

  openGlobalsPanel(win, set, { chromeLock: kind });
  showGlobalsPanel(win);
  lockChromeGlobalsTab(win, kind);
}

/** Isolate the tab once the form has rendered enough of itself to be isolated. */
function bootChromeSolo(win, doc, host, kind) {
  let attempts = 0;

  const reveal = () => {
    if (chromeHost(doc) === host) {
      host.style.opacity = '1';
    }
  };

  win.setTimeout(reveal, SECTION_PANEL_REVEAL_MS);

  const tryBoot = () => {
    if (chromeHost(doc) !== host || chromeInlineKind !== kind) {
      return;
    }

    if (soloChromeTab(win, doc, kind)) {
      watchChromeSolo(win, doc, kind);
      reveal();

      return;
    }

    if (attempts++ < 80) {
      win.setTimeout(tryBoot, 120);

      return;
    }

    reveal();
  };

  tryBoot();
}

/**
 * Read what the form holds, four times a second, and stash it for the preview.
 *
 * Same channel the docked panel used — `postGlobals` and its debounce — so the
 * render, the chrome bar and the discard path all behave exactly as they did.
 */
function watchChromeInlineValues(win, handle) {
  stopChromeInlineValues(win);
  chromeValuesSeen = null;

  chromeValuesTimer = win.setInterval(() => {
    if (!chromeHost(win.document)) {
      return;
    }

    const container = chromeContainer();
    const values = container ? unwrapRef(container.values) : null;

    if (!values || typeof values !== 'object') {
      return;
    }

    const serialized = JSON.stringify(values);

    if (serialized === chromeValuesSeen) {
      return;
    }

    const first = chromeValuesSeen === null;

    chromeValuesSeen = serialized;

    // First read is what the form opened with — the baseline, not an edit.
    if (first) {
      chromeValuesBaseline = serialized;

      return;
    }

    // Inside the settle window after an open or a save, what arrives is the form
    // agreeing with what is on disk — that is the clean state, not an edit.
    if (Date.now() < chromeIgnoreValuePostsUntil) {
      chromeValuesBaseline = serialized;

      return;
    }

    if (serialized === chromeValuesBaseline) {
      return;
    }

    if (!globalsAcceptValues) {
      return;
    }

    globalsStashActive = true;
    notifyChromeDirty(win);
    postGlobals(win, handle, JSON.parse(serialized));
  }, 250);
}

function stopChromeInlineValues(win) {
  if (chromeValuesTimer) {
    win.clearInterval(chromeValuesTimer);
    chromeValuesTimer = null;
  }
}

/**
 * The globals form's own Save, pressed for it. Hidden by the solo view, which is
 * not the same as disabled — the click runs Statamic's real save, and that form
 * never navigates afterwards, so there is nothing to hold back.
 */
function pressChromeSave(win) {
  const host = chromeHost(win.document);

  if (!host) {
    return false;
  }

  const button = [...host.querySelectorAll('button')].find((el) =>
    /^(save|gem)\b/i.test((el.textContent || '').trim())
  );

  if (!button) {
    return false;
  }

  button.click();

  return true;
}

/** Hear the globals save go out — it is this window's request now. */
function watchChromeInlineSaves(win) {
  watchGlobalsPanelSaves(win, win, () => (chromeInlineHandle ? `/cp/globals/${chromeInlineHandle}` : null));
}

/** Take the form down and hand the column back to the page. */
function closeChromeInline(win, { refresh = true } = {}) {
  const doc = win.document;
  const host = chromeHost(doc);

  // Nothing of ours is open — and nothing of ours may be forgotten either. This
  // is called on the way IN as well (closeRightPanels clears the field column
  // before the form is built), and clearing the kind there left the boot with
  // nothing to isolate: the whole Theme Settings screen, ten tabs and all.
  if (!host) {
    return false;
  }

  stopChromeInlineValues(win);
  chromeInlineKind = null;

  // Leaving for real — as opposed to the internal swap that steps from one half
  // to the other, which needs the half it is about to mount still warm. Whatever
  // was saved in here has made the warmed screens wrong, so they go and are
  // fetched again now, while nothing is waiting on them.
  if (refresh) {
    resetChromeInlinePages(win);
  }

  if (chromeApp) {
    try {
      chromeApp.unmount();
    } catch {
      /* already gone */
    }

    chromeApp = null;
  }

  host.remove();
  showPageFieldsAgain(doc);

  // The marks point into a form that has just left the document.
  clearSolo(doc);

  chromeInlineHandle = null;
  chromeValuesSeen = null;
  chromeValuesBaseline = null;

  rearmFirstSection();
  syncPreviewInset(win);
  clearGlobalsStash(win, { refresh });
  syncSectionLibraryAvailability(win);

  return true;
}

/** The panel frame reports what's being typed → stash it → re-render the page. */
function listenForSectionValues(win) {
  win.addEventListener('message', (event) => {
    if (event.origin !== win.location.origin) {
      return;
    }

    const { data } = event;

    if (data?.source !== 'statamic-visual-editor') {
      return;
    }

    // Entry form finished booting — flush any preview click held while it loaded.
    if (data.type === 'sve-section-panel-ready') {
      const panel = win.document.getElementById(GLOBAL_SECTION_PANEL_ID);

      if (panel && event.source === panel.querySelector('iframe')?.contentWindow) {
        flushPendingFocusUntilPanel(win);
        // The rebuild is done — this is the first moment the form is worth
        // looking at, so it is the moment it becomes visible.
        revealSectionPanelFrame(win);
      }

      return;
    }

    if (data.type !== 'sve-section-values') {
      return;
    }

    const panel = win.document.getElementById(GLOBAL_SECTION_PANEL_ID);

    if (!panel || event.source !== panel.querySelector('iframe')?.contentWindow) {
      return;
    }

    applySectionValues(win, data.id, data.values);
  });
}

/**
 * What the synced section's form now holds — however it was read.
 *
 * The docked panel posts it up; edited in this window it is read straight off the
 * form's own publish container. Both arrive here, so the baseline, the Save
 * button and the preview stash are decided in one place.
 */
function applySectionValues(win, id, values) {
  // Kept so the panel can stand in as a container — that's what lets a global
  // section's text be edited inline in the page (see sectionPanelContainer).
  sectionPanelValues = { id, values };

  // Inline edit / focus clicked before hydrate finished — try again now.
  flushPendingEditUntilPanel();
  flushPendingFocusUntilPanel(win);

  const serialized = JSON.stringify(values ?? {});

  // First poll after open = baseline, not dirty. Otherwise Save (primary)
  // lights up the moment you enter a global section with no real edits. The
  // same is true of the first values to arrive after a save — see
  // sectionBaselineUntil — and the window is closed as soon as it is used, so
  // one echo is all it ever covers.
  if (sectionValuesBaseline === null || Date.now() < sectionBaselineUntil) {
    sectionBaselineUntil = 0;
    sectionValuesBaseline = serialized;
    sectionValuesMatchBaseline = true;
    notifyGlobalSectionDirty(win);

    return;
  }

  // Whether this is a change is a question about the Save button. Whether the
  // page should be re-rendered is not — the preview shows what the form holds,
  // and putting a value back to what it was when the section was opened is as
  // much a thing to show as any other edit.
  //
  // It used to return here, and that is the "sometimes it doesn't update":
  // a heading flipped H1 → H2 → H1 stayed on H2, because the last step matched
  // the baseline and never reached the stash. The panel and the page then
  // disagreed, and every later click was aimed at a page the form had moved on
  // from — which is what made editing seem to break at random.
  sectionValuesMatchBaseline = serialized === sectionValuesBaseline;

  notifyGlobalSectionDirty(win);
  postSectionValues(win, id, values);
}

function listenForGlobalsValues(win) {
  win.addEventListener('message', (event) => {
    if (event.origin !== win.location.origin) {
      return;
    }

    const { data } = event;

    // Theme Settings (iframe) → sektionens Theme Color Picker-swatches.
    // Color-scheme dispatches også direkte på top; dette fanger postMessage.
    if (data?.source === 'statamic-visual-editor' && data.type === 'sve-theme-scale-values' && data.values) {
      win.dispatchEvent(new CustomEvent('sve-theme-colors', { detail: data.values }));

      return;
    }

    if (data?.source !== 'statamic-visual-editor' || data.type !== 'sve-globals-values') {
      return;
    }

    const panel = win.document.getElementById(GLOBALS_PANEL_ID);

    if (!panel || event.source !== panel.querySelector('iframe')?.contentWindow) {
      return;
    }

    // Live palette i sektioner mens Theme Settings er åben (også prefetch/hidden).
    if (data.values && data.handle === 'theme_settings') {
      win.dispatchEvent(new CustomEvent('sve-theme-colors', { detail: data.values }));
    }

    // Hidden prefetch panel: Theme Settings hydrates in the background. Those
    // value polls must NOT mark the editor dirty or the back button always
    // offers "Save, publish and go back" with no real edits.
    if (panel.hasAttribute('data-sve-chrome-hidden') || panel.style.visibility === 'hidden') {
      return;
    }

    // Discard/reload in progress — ignore stale polls from the old form.
    if (!globalsAcceptValues) {
      return;
    }

    const serialized = JSON.stringify(data.values ?? {});

    // Tab-lock / remount after entering chrome mutates the form once — treat as baseline, not dirty.
    if (activeChromeKind && Date.now() < chromeIgnoreValuePostsUntil) {
      chromeValuesBaseline = serialized;

      return;
    }

    if (activeChromeKind && chromeValuesBaseline !== null && serialized === chromeValuesBaseline) {
      return;
    }

    // Show Save on the chrome bar immediately (stash POST is still debounced).
    globalsStashActive = true;
    notifyChromeDirty(win);

    postGlobals(win, data.handle, data.values);
  });
}

// --- Asset browser: hard-enforce the field's file limit --------------------------
//
// A field with max_files: 1 can still end up holding several assets: the browser
// only clamps the selection on its own checkbox path, so the other ways a row can
// become selected (clicking the filename, which opens the asset editor) slip past
// it. Rather than guess at Statamic's internals, enforce the limit the browser
// itself advertises: its footer reads "N/M selected". Whenever N exceeds M, the
// extra rows are deselected — keeping the row that was clicked last, which is the
// one the user meant.

const ASSET_COUNT_RE = /^(\d+)\s*\/\s*(\d+)\s+selected$/i;

/** The browser's "N/M selected" footer, if it's on screen. */
function assetCounter(doc) {
  for (const el of doc.querySelectorAll('span, div, p, td')) {
    if (el.childElementCount !== 0) {
      continue;
    }

    const match = ASSET_COUNT_RE.exec((el.textContent || '').trim());

    if (match) {
      return { selected: Number(match[1]), max: Number(match[2]) };
    }
  }

  return null;
}

function checkedAssetToggles(doc) {
  return [...doc.querySelectorAll('[role="checkbox"], input[type="checkbox"]')].filter(
    (el) =>
      el.checked === true ||
      el.getAttribute('aria-checked') === 'true' ||
      el.dataset?.state === 'checked'
  );
}

// The row the user touched most recently — the selection we keep when trimming.
let lastAssetRow = null;

function enforceAssetLimit(doc) {
  const counter = assetCounter(doc);

  if (!counter || !counter.max || counter.selected <= counter.max) {
    return;
  }

  const toggles = checkedAssetToggles(doc);

  if (toggles.length <= counter.max) {
    return; // can't see the selection — leave it alone rather than guess
  }

  const keep = new Set();
  const clicked = lastAssetRow ? toggles.find((el) => lastAssetRow.contains(el)) : null;

  if (clicked) {
    keep.add(clicked);
  }

  // Fill the remaining slots from the bottom: newest selections win.
  for (const toggle of [...toggles].reverse()) {
    if (keep.size >= counter.max) {
      break;
    }

    keep.add(toggle);
  }

  toggles.filter((toggle) => !keep.has(toggle)).forEach((toggle) => toggle.click());
}

function guardAssetLimit(win) {
  const doc = win.document;

  const check = () => {
    setTimeout(() => enforceAssetLimit(doc), 60);
    setTimeout(() => enforceAssetLimit(doc), 450);
  };

  doc.addEventListener(
    'click',
    (event) => {
      lastAssetRow = event.target.closest?.('tr, li, [data-asset-id]') ?? null;
      check();
    },
    true
  );

  // Closing the asset editor with the keyboard is not a click.
  doc.addEventListener('keyup', (event) => {
    if (event.key === 'Escape' || event.key === 'Enter') {
      check();
    }
  }, true);
}

/**
 * The two conditions the "where is this edited?" setting turns into.
 *
 * Registered by the editor rather than left to each site: the setting is offered
 * on every field's settings screen, and a field naming a condition nobody
 * registered is hidden everywhere instead of somewhere — the one failure worse
 * than the setting not working at all. A site that already registers these of its
 * own accord simply registers them twice, to the same effect.
 *
 * A ref, not a DOM lookup per call: conditions are evaluated inside a Vue
 * computed, so a ref is what makes them reactive. Without it a field would only
 * change places the next time some other value happened to change.
 */
function registerPanelConditions(win) {
  const conditions = win.Statamic?.$conditions;
  const ref = win.Vue?.ref;

  if (!conditions || !ref || !win.document.body) {
    return;
  }

  const inLivePreview = ref(false);
  const sync = () => {
    inLivePreview.value = !!win.document.querySelector('.live-preview-editor');
  };

  sync();
  new win.MutationObserver(sync).observe(win.document.body, { childList: true, subtree: true });

  conditions.add('notInLivePreview', () => !inLivePreview.value);
  conditions.add('onlyInLivePreview', () => inLivePreview.value);
}

/**
 * Publish opens Statamic's own right-side panel. Our Sections / Theme Settings
 * drawers sit in the same place — close them on Publish so they never cover it.
 */
function watchPublishClosesRightPanels(win) {
  const shouldClose = (el) => {
    if (!el || el.closest?.('[id^="__sve"]')) {
      return false;
    }

    const text = `${el.textContent || ''} ${el.getAttribute?.('aria-label') || ''}`.trim();

    return isPublishButtonLabel(text);
  };

  win.document.addEventListener(
    'click',
    (event) => {
      const el = event.target?.closest?.('button, [role="menuitem"], a');

      if (!shouldClose(el)) {
        return;
      }

      closeRightPanels(win);
      // Header "sections" tab stays lit otherwise — clear it with the drawer.
      if (headerTab === 'sections') {
        setHeaderTab(win, null);
        applyHeaderTab(win);
      }
    },
    true
  );
}

export function initCp(win = window) {
  // Before anything else, and before the switch below: a field asking for a
  // condition that isn't there is hidden in both editors, so these are registered
  // even on a site where the editor itself is switched off.
  registerPanelConditions(win);

  // Boot marker — proves this build is loaded (DevTools: window.__SVE_BUILD__).
  win.__SVE_BUILD__ = 'global-fix-2026-08-06f';

  try {
    win.document.getElementById('sve-lp-cover')?.remove();
  } catch {
    /* ignore */
  }

  // Switched off for this site: leave Statamic's own Live Preview exactly as it
  // ships. The bridge is already withheld server-side, and without this the CP
  // would still build the toolbar and open panels onto a preview that can no
  // longer be clicked — worse than either state on its own.
  if (win.Statamic?.$config?.get?.('sveEnabled') === false) {
    return;
  }

  const style = win.document.createElement('style');
  style.id = '__sve-cp-styles';
  style.textContent = CP_STYLES;
  win.document.head.appendChild(style);

  watchPublishClosesRightPanels(win);

  autoOpenLivePreview(win);
  initOpenInPreview(win);
  watchEntrySaves(win);
  watchPreviewRenders(win);
  guardAssetLimit(win);
  listenForGlobalsValues(win);
  listenForSectionValues(win);

  // Capture publish containers BEFORE the sve-panel frame boots. The panel's
  // bootSavedSectionSolo / value poll need activeContainers(); if we register
  // listeners after the panel starts, the container-created event is missed and
  // the sidebar stays on empty entry meta (Published + title) forever.
  registerContainerEvents(win);

  // Running as the globals panel inside Live Preview: strip to the form and
  // stream its values up. None of the Live Preview machinery below applies.
  // The same frame serves a global section's editor — see initGlobalsPanelFrame.
  if (!initGlobalsPanelFrame(win)) {
    // Parent CP window — start warming Theme Settings immediately on entry edit,
    // so it's ready before the user even opens Live Preview.
    scheduleChromeGlobalsPrefetch(win);
  }

  // Stamp Grid rows immediately and re-stamp whenever the DOM changes
  // (Vue renders Grid rows asynchronously after page load / field expansion).
  // The same observer injects the Live Preview panel toggle when that screen
  // mounts (it lives in a portal that appears/disappears dynamically).
  //
  // CRITICAL: never run the enhance pass synchronously inside the observer, and
  // ignore mutations we (or Vue's immediate follow-up patch) produce — otherwise
  // insert → observer → insert becomes an infinite loop that freezes the CP.
  let sveDomScheduled = false;
  let sveDomQuietUntil = 0;

  const runSveDomPass = () => {
    sveDomScheduled = false;
    sveDomQuietUntil = Date.now() + 800;

    try {
      stampGridRows(win.document);
      ensureLpPanelToggle(win);
      // Live Preview mounts (and remounts) its iframe from here — bind the
      // click-outside forward to whichever one is on screen now.
      ensurePreviewOutsideDismiss(win);
      // Segmented tabs + accordion cards (yesterday's Look). Quiet window above
      // stops Vue↔DOM move loops from freezing the CP.
      enhanceSectionGroupsIn(win);
      markStepIntoAll(win);
    } catch (err) {
      console.error('[sve] dom pass', err);
    }

    // Extend the quiet window after our own writes so Vue's reactive patch that
    // often follows does not immediately re-enter the loop.
    sveDomQuietUntil = Date.now() + 800;
  };

  const scheduleSveDomPass = () => {
    if (Date.now() < sveDomQuietUntil) {
      return;
    }

    if (sveDomScheduled) {
      return;
    }

    sveDomScheduled = true;
    win.requestAnimationFrame(runSveDomPass);
  };

  /**
   * The pass that runs once the DOM stops moving.
   *
   * The quiet window above drops every call that lands inside it, which is right
   * for a stream that keeps coming — but a form mounts as one burst, and a burst
   * fits inside a single window. The last mutation of it was therefore the one
   * that never got a pass, and the panel settled half-built: fields rendered,
   * but no segmented control and no accordion cards, because the pass that draws
   * them had been dropped and nothing was left to ask for it again.
   *
   * So the mutation stream gets a trailing edge. Re-armed on every mutation and
   * never fired before the quiet window is up, it leaves the loop guard exactly
   * as it was and only adds the one thing missing: after the DOM goes still,
   * something still runs. It settles because the pass is idempotent — a second
   * one over a finished panel moves no nodes, so the observer never fires and
   * nothing re-arms.
   */
  let sveDomSettleTimer = null;

  const scheduleSveDomSettlePass = () => {
    if (sveDomSettleTimer) {
      win.clearTimeout(sveDomSettleTimer);
    }

    sveDomSettleTimer = win.setTimeout(
      () => {
        sveDomSettleTimer = null;
        scheduleSveDomPass();
      },
      Math.max(400, sveDomQuietUntil - Date.now() + 16)
    );
  };

  const onSveDomMutation = () => {
    // Before anything scheduled: an observer callback runs as a microtask, so a
    // list grouped here is grouped in the frame its fields arrived in. Anything
    // deferred is a frame of the flat layout on screen — which is the jump.
    try {
      settleUngroupedFieldLists(win);
    } catch {
      // Never let this stop the passes below from running.
    }

    scheduleSveDomPass();
    scheduleSveDomSettlePass();
  };

  onSveDomMutation();
  const gridObserver = new win.MutationObserver(onSveDomMutation);
  gridObserver.observe(win.document.body, { childList: true, subtree: true });

  const listener = createMessageListener(win.document, win);

  win.addEventListener('message', listener);

  // CP → iframe: hovering a set highlights the corresponding element in the preview.
  let lastCpHoverUid = null;

  const handleMouseover = (event) => {
    const set = event.target.closest(SELECTORS.anySet);

    if (!set) {
      // Check if hovering over a field wrapper (id="field_{handle}").
      // Walk up the DOM from the event target looking for a matching element.
      let fieldWrapper = null;
      let el = event.target;

      while (el && el !== win.document.body) {
        if (el.id && /^field_/.test(el.id)) {
          fieldWrapper = el;
          break;
        }

        el = el.parentElement;
      }

      // Always clear CP-side hover outlines. They may have been set by an
      // incoming preview-originated hover message, which is independent of
      // lastCpHoverUid and would otherwise linger permanently if the mouse
      // moves from the preview into a non-set area of the CP.
      win.document.querySelectorAll('[data-sve-hover]').forEach((el) => el.removeAttribute('data-sve-hover'));

      if (fieldWrapper) {
        const fieldKey = fieldWrapper.id.slice('field_'.length);

        if (fieldKey === lastCpHoverUid) {
          return;
        }

        lastCpHoverUid = fieldKey;

        // Don't apply hover to a field that is already focused/active — mirrors
        // the guard on the set branch below.
        if (!fieldWrapper.hasAttribute(ACTIVE_ATTR)) {
          fieldWrapper.setAttribute('data-sve-hover', '');

          const ownerSet = fieldWrapper.closest(SELECTORS.anySet);
          const scope = ownerSet ? getUidFromSet(ownerSet) : undefined;

          sendToPreview({ source: 'statamic-visual-editor', type: 'hover', field: fieldKey, scope: scope || undefined }, win);
        }

        return;
      }

      if (lastCpHoverUid !== null) {
        lastCpHoverUid = null;
        sendToPreview({ source: 'statamic-visual-editor', type: 'hover', uid: null }, win);
      }

      return;
    }

    const uid = getUidFromSet(set);

    if (!uid) {
      return;
    }

    // Don't send hover for the element that is currently focused/active in the CP.
    if (set.hasAttribute(ACTIVE_ATTR)) {
      return;
    }

    // When hovering plain text inside a Bard contenteditable, determine which
    // text group it belongs to via the preceding set node.
    const contentEditable = event.target.closest('[contenteditable="true"]');

    if (contentEditable && !event.target.closest('[data-node-view-wrapper]')) {
      const prevBardSet = findPrecedingBardSetNode(event.target, contentEditable);
      const afterSetUid =
        prevBardSet?.querySelector('[data-visual-id]')?.getAttribute('data-visual-id') ?? null;
      const hoverKey = `${uid}::${afterSetUid}`;

      if (hoverKey === lastCpHoverUid) {
        return;
      }

      lastCpHoverUid = hoverKey;
      sendToPreview({ source: 'statamic-visual-editor', type: 'hover', uid, afterSetUid }, win);

      return;
    }

    if (uid === lastCpHoverUid) {
      return;
    }

    lastCpHoverUid = uid;
    sendToPreview({ source: 'statamic-visual-editor', type: 'hover', uid }, win);
  };

  // CP → iframe: clicking anywhere inside a set focuses the corresponding element in the preview.
  // Uses closest() to get the innermost set, so nested replicators resolve correctly.
  const handleClick = (event) => {
    const set = event.target.closest(SELECTORS.anySet);

    if (!set) {
      // Check if the click landed inside a field wrapper (id="field_{handle}").
      // If so, send a focus message to the preview so the corresponding
      // [data-sid-field] element gets highlighted — mirrors the mouseover logic.
      let el = event.target;

      while (el && el !== win.document.body) {
        if (el.id && /^field_/.test(el.id)) {
          const fieldKey = el.id.slice('field_'.length);

          // Scope = the _visual_id of the surrounding set, so the preview can
          // disambiguate a bare data-sid-field handle that repeats across sections.
          const ownerSet = el.closest(SELECTORS.anySet);
          const scope = ownerSet ? getUidFromSet(ownerSet) : undefined;

          // Mark the field as active in the CP (clears any hover, sets solid
          // outline) and notify the preview to highlight the matching element.
          // No pulse here — the pulse is a cross-boundary signal, not a local one.
          handleFieldFocus(fieldKey, win.document, { animate: false });
          sendToPreview({ source: 'statamic-visual-editor', type: 'focus', field: fieldKey, scope: scope || undefined }, win);

          return;
        }

        el = el.parentElement;
      }

      // Clicked on a generic CP area — dismiss any stale SVE active state.
      win.document.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((active) => active.removeAttribute(ACTIVE_ATTR));

      return;
    }

    const uid = getUidFromSet(set);

    if (!uid) {
      return;
    }

    const message = { source: 'statamic-visual-editor', type: 'focus', uid };

    // When clicking plain text inside a Bard contenteditable, include afterSetUid
    // so the preview can highlight the correct text group.
    const contentEditable = event.target.closest('[contenteditable="true"]');

    if (contentEditable && !event.target.closest('[data-node-view-wrapper]')) {
      const prevBardSet = findPrecedingBardSetNode(event.target, contentEditable);

      message.afterSetUid =
        prevBardSet?.querySelector('[data-visual-id]')?.getAttribute('data-visual-id') ?? null;
    }

    // Sync the CP active state immediately so the clicked set is outlined
    // without waiting for a round-trip message from the preview to trigger handleFocus.
    win.document.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((active) => active.removeAttribute(ACTIVE_ATTR));
    set.setAttribute(ACTIVE_ATTR, '');

    sendToPreview(message, win);
  };

  // --- Set preview thumbnail on hover (CP-only) ---------------------------
  // When hovering a collapsed Replicator set row that has a `image` configured
  // in its blueprint set definition, show that image as a floating thumbnail
  // above the row — a visual hint of how the section looks.
  //
  // The image URL is read from the set row's Vue component (props.config.image),
  // which is the exact same value Statamic's SetPicker renders as <img :src>.
  //
  // Per the CP portal rule: the popup MUST be appended to document.body, because
  // Replicator/page_sections rows create stacking contexts that trap a
  // position:fixed child. We also reposition on scroll (capture phase) and tear
  // everything down on cleanup.
  let thumbPortal = null;
  let thumbForSet = null;

  // Set preview images are resolved server-side (Vue component instances are not
  // reachable from the DOM in a production build) and provided to the CP script
  // as a { setHandle => thumbnailUrl } map via Statamic::provideToScript. The set
  // row exposes its handle through the [data-type] attribute.
  const getSetImageUrl = (setEl) => {
    const handle = setEl.getAttribute('data-type');

    if (!handle) {
      return null;
    }

    const map = win.Statamic?.$config?.get?.('svePreviewImages') || {};

    return map[handle] || null;
  };

  const positionThumb = () => {
    if (!thumbPortal || !thumbForSet) {
      return;
    }

    const anchor = thumbForSet.querySelector(':scope > header') || thumbForSet;
    const rect = anchor.getBoundingClientRect();
    const gap = 8;
    const inner = thumbPortal.firstElementChild;

    thumbPortal.style.left = `${rect.left}px`;

    // Prefer placing the thumbnail above the row; flip below if there isn't room.
    // The outer element handles positioning (translateY); the inner element owns
    // the pop-in scale animation, so its transform-origin points at the row edge
    // the thumbnail emerges from.
    const estHeight = thumbPortal.offsetHeight || 160;

    if (rect.top - gap - estHeight < 0) {
      thumbPortal.style.top = `${rect.bottom + gap}px`;
      thumbPortal.style.transform = 'none';

      if (inner) {
        inner.style.transformOrigin = 'top left';
      }
    } else {
      thumbPortal.style.top = `${rect.top - gap}px`;
      thumbPortal.style.transform = 'translateY(-100%)';

      if (inner) {
        inner.style.transformOrigin = 'bottom left';
      }
    }
  };

  const removeThumb = () => {
    if (thumbPortal) {
      thumbPortal.remove();
      thumbPortal = null;
    }

    thumbForSet = null;
    win.removeEventListener('scroll', positionThumb, true);
  };

  const showThumb = (setEl, url) => {
    removeThumb();
    thumbForSet = setEl;

    // Outer element: positioning only (fixed + flip translate). pointer-events
    // off so it never intercepts the hover that drives it.
    const outer = win.document.createElement('div');

    outer.style.cssText = 'position:fixed;z-index:99999;pointer-events:none;';

    // Inner element: the visible card. Gray background that adapts to the CP's
    // light/dark theme. Carries the pop-in animation (.sve-thumb-inner).
    const isDark = win.document.documentElement.classList.contains('dark');

    const inner = win.document.createElement('div');

    inner.className = 'sve-thumb-inner';
    inner.style.cssText =
      'max-width:300px;padding:6px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.28);' +
      (isDark
        ? 'background:var(--theme-color-gray-800,#1f2937);border:1px solid rgba(255,255,255,0.10);'
        : 'background:var(--theme-color-gray-200,#e5e7eb);border:1px solid rgba(0,0,0,0.08);');

    const img = win.document.createElement('img');

    img.src = url;
    img.style.cssText = 'display:block;width:100%;height:auto;border-radius:6px;';
    // Reposition once the image has real dimensions (affects the above/below flip).
    img.addEventListener('load', positionThumb);

    inner.appendChild(img);
    outer.appendChild(inner);
    win.document.body.appendChild(outer);

    thumbPortal = outer;
    positionThumb();
    win.addEventListener('scroll', positionThumb, true);
  };

  const handleThumbHover = (event) => {
    const setEl = event.target.closest('[data-replicator-set]');

    if (!setEl) {
      removeThumb();
      return;
    }

    if (setEl === thumbForSet) {
      return;
    }

    // Only in the collapsed accordion listing — not while a set is expanded for editing.
    if (!isSetCollapsed(setEl)) {
      removeThumb();
      return;
    }

    const url = getSetImageUrl(setEl);

    if (!url) {
      removeThumb();
      return;
    }

    showThumb(setEl, url);
  };

  win.document.addEventListener('mouseover', handleMouseover);
  win.document.addEventListener('mouseover', handleThumbHover);
  win.document.addEventListener('click', handleClick);
  // Dismiss the thumbnail on any click — notably when expanding a set panel,
  // where the mouse stays put and no new mouseover fires to clear it.
  win.document.addEventListener('click', removeThumb);

  return () => {
    win.document.removeEventListener('mouseover', handleMouseover);
    win.document.removeEventListener('mouseover', handleThumbHover);
    win.document.removeEventListener('click', handleClick);
    win.document.removeEventListener('click', removeThumb);
    removeThumb();
  };
}
