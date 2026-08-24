/**
 * Fieldset tab groups and accordion cards in the publish form.
 * Imports only t + selectors — never cp.js.
 */
import { t } from './cp-t.js';
import { GLOBALS_PANEL_PARAM, SELECTORS } from './cp-selectors.js';

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

export const SECTION_TOGGLE_ATTR = 'data-sve-section-toggle';
export const SECTION_GROUP_ATTR = 'data-sve-section-group';
export const SECTION_SEG_ATTR = 'data-sve-section-seg';
export const SECTION_ACTIVE_ATTR = 'data-sve-section-active';
export const SECTION_CONTENT_KEY = '__content';

// Accordion panels within a segment.
export const SECTION_PANEL_ATTR = 'data-sve-section-panel'; // a row's panel key
export const SECTION_PANEL_CARD_ATTR = 'data-sve-panel-card'; // the card we insert
export const SECTION_PANEL_HEAD_ATTR = 'data-sve-panel-head'; // its clickable header
export const SECTION_PANEL_BODY_ATTR = 'data-sve-panel-body'; // its field list
export const SECTION_PANEL_OPEN_ATTR = 'data-sve-panel-open'; // open key, on the list
export const SECTION_PANEL_OWNER_ATTR = 'data-sve-panel-owner'; // a group heading itself

// Statamic's field list: a grid with one row per field. Every form in the CP is
// built out of these, which is why it is the unit here.
export const FIELD_LIST = '.publish-fields';

/**
 * The field list an element belongs to — the scope everything here works in.
 *
 * A row we have moved into an accordion card is still the list's own: the card's
 * body is not a field list, so this walks past it to the list the card sits in.
 * A nested group or tabby renders a list of its own and its rows answer with that
 * one, which is what stops an outer control from painting keys onto fields it
 * does not own — those fields get their own control instead.
 */
export function fieldListOf(el) {
  return el?.closest?.(FIELD_LIST) || null;
}

/**
 * The set's own field lists — the grids its fields are laid out in.
 *
 * Depth is counted in .publish-fields ancestors rather than assumed: the markup
 * between a set and its fields differs by fieldtype, and only the shallowest run
 * is the set's own — anything deeper belongs to a nested set or to a tabby.
 */
export function sectionFieldLists(setEl) {
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
export function sectionFieldRows(list) {
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
export function rowFieldtype(row, name) {
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
export function ownDescendants(list, selector) {
  return [...list.querySelectorAll(selector)].filter((el) => fieldListOf(el) === list);
}

/** The list's own first match for a selector, or null. */
export function ownDescendant(list, selector) {
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
export function inPreviewPanel(win, el) {
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
export function applyToggleWidth(row, fill) {
  row.toggleAttribute('data-sve-fill', fill);
}

/**
 * What a tab marker says about itself.
 *
 * The chip carries its label, style, icon and default-open flag on data
 * attributes (see the tabs addon) because field config never reaches the
 * rendered panel any other way. Falling back to the chip's own text keeps
 * older markers working — they simply have no style and no icon, which is
 * the default anyway.
 */
export function tabMarkerConfig(el) {
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
    defaultOpen: chip?.hasAttribute('data-tab-default') || false,
    ready: !!chip,
  };
}

/** A field's own label, as Statamic renders it above the control. */
export function fieldLabel(row) {
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
export function sectionGroups(win, list) {
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
  let pending = false;

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

      // The chip carries default_open. Grouping before Vue paints it would lock
      // the first tab as active and ignore the flag on the next pass.
      if (!cfg.ready) {
        pending = true;

        return;
      }

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
        defaultOpen: cfg.defaultOpen,
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

  if (pending) {
    return null;
  }

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
export const PANEL_ICONS = {
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
export const iconifyCache = new Map();

/** Strip an Iconify SVG down to something that inherits the header's colour. */
export function adoptSvg(el, markup) {
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
export function panelIcon(doc, name) {
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

export function paintSectionToggle(list, active) {
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

export function setSectionGroup(list, key) {
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
export function revealSegmentsFor(el, doc) {
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

export function setSectionPanel(list, key) {
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
export function buildPanelCard(win, list, panel, groupKey, gridGap) {
  const doc = win.document;
  const card = doc.createElement('div');

  card.setAttribute(SECTION_PANEL_CARD_ATTR, '');
  card.setAttribute(SECTION_PANEL_ATTR, panel.key);
  card.setAttribute(SECTION_GROUP_ATTR, groupKey);
  card.setAttribute('data-sve-panel-label', panel.label);

  if (panel.icon) {
    card.setAttribute('data-sve-panel-icon', panel.icon);
  }

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
export function enhanceSectionGroups(win, list) {
  const divided = sectionGroups(win, list);

  if (!divided) {
    return;
  }

  const { groups, markers } = divided;

  const active = list.getAttribute(SECTION_ACTIVE_ATTR);
  const preferred = groups.find((group) => group.defaultOpen)?.key;
  const current = groups.some((group) => group.key === active)
    ? active
    : preferred || groups[0].key;

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
    row.setAttribute(SECTION_TOGGLE_ATTR, '');

    const track = doc.createElement('div');

    track.setAttribute('data-sve-section-track', '');

    groups.forEach((group) => {
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.setAttribute(SECTION_SEG_ATTR, group.key);

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
