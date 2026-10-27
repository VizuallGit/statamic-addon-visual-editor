/**
 * The icons Build draws, and the few it has to draw itself.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: nothing. Pure.
 * Bus messages: none.
 *
 * An Add tile wears the HTML toolbar's icon for its element (HTML_ICONS in
 * html-tree-icons.js), a Style family the style row's icon for its first tool
 * (CSS_TOOL_ICONS / TW_TOOL_ICONS in code-dock.js), and a size the top bar's
 * own device icon (LP_DEVICE_ICONS, handed in by the host — the panel may not
 * import the CP shell). Only what none of those has is drawn here: the
 * panel's own controls, and the elements and alignments the dock has no
 * button for yet. They are the approved sketch's glyphs (24-unit box, 1.75
 * stroke, round ends), drawn with `.bm-ic`.
 */

const P = {
  plus: '<path d="M12 5v14M5 12h14"/>',
  container: '<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7.5" y="7.5" width="9" height="9" rx="1"/>',
  columns: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  button: '<rect x="3" y="7" width="18" height="10" rx="3"/><path d="M8 12h8"/>',
  divider: '<path d="M3 12h18"/>',
  tag: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4"/>',
  cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  chev: '<path d="M6 9l6 6 6-6"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  arrowD: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  arrowU: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  linkic: '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  cursor: '<path d="M5 3l14 7-6 2-2 6z"/>',
  form: '<rect x="3" y="4" width="18" height="5" rx="1.5"/><rect x="3" y="11" width="18" height="5" rx="1.5"/><path d="M3 20h8"/>',
  code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
  alL: '<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>',
  alC: '<path d="M4 6h16M7 10h10M4 14h16M7 18h10"/>',
  alR: '<path d="M4 6h16M10 10h10M4 14h16M10 18h10"/>',
  fMotion: '<path d="M4 12h10M10 6l6 6-6 6M18 6v12"/>',
  fEffects: '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/>',
  jEvenly: '<path d="M3.5 4v16M20.5 4v16" opacity=".5"/><rect x="7.5" y="7" width="3.5" height="10" rx="1"/><rect x="13" y="7" width="3.5" height="10" rx="1"/>',
  aBaseline: '<path d="M3 13h18" stroke-dasharray="2 2"/><rect x="6" y="7" width="5" height="6" rx="1"/><rect x="13" y="5" width="5" height="8" rx="1"/>',
  /* The Figma look's own: flow, the fields' prefixes, the sections' actions */
  flowBlock: '<rect x="5" y="4" width="14" height="6" rx="1.5"/><rect x="5" y="14" width="14" height="6" rx="1.5"/>',
  flowRow: '<rect x="3" y="7" width="6" height="10" rx="1.5"/><rect x="11" y="7" width="6" height="10" rx="1.5"/><path d="M19 12h3M20.5 10.5 22 12l-1.5 1.5"/>',
  flowCol: '<rect x="7" y="2.5" width="10" height="6" rx="1.5"/><rect x="7" y="10.5" width="10" height="6" rx="1.5"/><path d="M12 18.5v3M10.5 20 12 21.5 13.5 20"/>',
  flowGrid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  wrap: '<path d="M4 7h12a4 4 0 0 1 0 8H8"/><path d="M11 12l-3 3 3 3"/>',
  padX: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8.5 9v6M15.5 9v6"/>',
  padY: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M9 9.5h6M9 14.5h6"/>',
  padT: '<rect x="4" y="5" width="16" height="14" rx="2" opacity=".45"/><path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2"/>',
  padB: '<rect x="4" y="5" width="16" height="14" rx="2" opacity=".45"/><path d="M4 17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/>',
  padL: '<rect x="4" y="5" width="16" height="14" rx="2" opacity=".45"/><path d="M6 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2"/>',
  padR: '<rect x="4" y="5" width="16" height="14" rx="2" opacity=".45"/><path d="M18 5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2"/>',
  sides: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/>',
  gapY: '<path d="M4 5h16M4 19h16"/><path d="M9 12h6"/>',
  gapX: '<path d="M5 4v16M19 4v16"/><path d="M12 9v6"/>',
  radius: '<path d="M4 20V10a6 6 0 0 1 6-6h10"/>',
  opacity: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h5v5H4zM9 4h5v5H9zM14 9h6v5h-6zM9 14h5v6H9z" fill="currentColor" stroke="none" opacity=".55"/>',
  minus: '<path d="M5 12h14"/>',
  lineHeight: '<path d="M4 5h16M4 19h16"/><path d="M9 15l3-7 3 7M10 13h4"/>',
  weight: '<path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z"/>',
  border: '<rect x="4" y="4" width="16" height="16" rx="2" stroke-width="2.5"/>',
  shadow: '<rect x="4" y="4" width="13" height="13" rx="2"/><path d="M20 8v10a2 2 0 0 1-2 2H8" opacity=".55"/>',
};

/** One of the sketch's glyphs, as the panel draws it. */
export function ic(name, extra = '') {
  return `<svg class="bm-ic${extra ? ` ${extra}` : ''}" viewBox="0 0 24 24" aria-hidden="true">${P[name] || ''}</svg>`;
}

/** Add tile → its icon: the dock's for the element it writes, else the sketch's. */
export function tileIcon(entry, htmlIcons = {}, toolIcons = {}) {
  if (!entry) {
    return '';
  }

  if (entry.source === 'tool') {
    return htmlIcons[entry.def?.id] || htmlIcons[entry.def?.tag] || ic('tag');
  }

  if (entry.source === 'div') {
    const id = entry.def?.id;

    if (id === 'div') {
      return htmlIcons.div || '';
    }

    if (id === 'flex' || id === 'flex-row') {
      return toolIcons['display-flex'] || toolIcons['flex-row'] || '';
    }

    if (id === 'flex-col') {
      return toolIcons['flex-col'] || '';
    }

    return ic(P[id] ? id : 'container');
  }

  if (entry.source === 'columns') {
    return ic('columns');
  }

  return P[entry.id] ? ic(entry.id) : htmlIcons[entry.def?.tag] || ic('tag');
}

/** Style family → its icon: its first tool's icon in the dock's row, else the sketch's. */
export function groupIcon(group, toolIcons = {}) {
  const first = group?.tools?.[0];

  if (first && toolIcons[first.id]) {
    return toolIcons[first.id];
  }

  return ic(group?.id === 'effects' ? 'fEffects' : 'fMotion');
}
