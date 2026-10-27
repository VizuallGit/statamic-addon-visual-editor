/**
 * The icons Build draws, and the few it has to draw itself.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: nothing. Pure.
 * Bus messages: none.
 *
 * An Add tile wears the HTML toolbar's icon for its element (HTML_ICONS in
 * html-tree-icons.js) and a Style row the style row's icon for its tool
 * (CSS_TOOL_ICONS / TW_TOOL_ICONS in code-dock.js). Both maps are handed in
 * by whoever mounts the panel, so the icon a tool has in the dock is the icon
 * it has here. Only the elements and families the dock has no button for
 * yet (Columns, Grid, Button, Divider, the extra HTML tags, Transform) and the
 * panel's own controls are drawn below — in the dock's style: 16-unit box,
 * `currentColor`, 1.3–1.4 strokes.
 */

const svg = (body, attrs = 'fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"') =>
  `<svg width="14" height="14" viewBox="0 0 16 16" ${attrs} aria-hidden="true">${body}</svg>`;

export const BUILD_ICONS = {
  container: svg('<rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><rect x="4.5" y="5" width="7" height="6" rx=".6" stroke-dasharray="1.6 1.4"/>'),
  columns: svg('<rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M8 2.5v11"/>'),
  grid: svg('<rect x="2" y="2" width="5" height="5" rx=".8"/><rect x="9" y="2" width="5" height="5" rx=".8"/><rect x="2" y="9" width="5" height="5" rx=".8"/><rect x="9" y="9" width="5" height="5" rx=".8"/>'),
  button: svg('<rect x="1.5" y="4.5" width="13" height="7" rx="2"/><path d="M5.5 8h5"/>'),
  divider: svg('<path d="M2 8h12"/><path d="M2 4.5h6M2 11.5h9" opacity=".45"/>'),
  tag: svg('<path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5"/>'),
  transform: svg('<path d="M2.5 8h7M7 5l3 3-3 3"/><path d="M13.5 3.5v9"/>'),
  plus: svg('<path d="M8 3v10M3 8h10"/>'),
  search: svg('<circle cx="7" cy="7" r="4.2"/><path d="M13.5 13.5 10.2 10.2"/>'),
  chevron: svg('<path d="m4 6 4 4 4-4"/>'),
  close: svg('<path d="m4 4 8 8M12 4l-8 8"/>'),
  link: svg('<path d="M6.8 9.2a2.6 2.6 0 0 0 3.7 0l2-2a2.6 2.6 0 0 0-3.7-3.7l-.6.6"/><path d="M9.2 6.8a2.6 2.6 0 0 0-3.7 0l-2 2a2.6 2.6 0 0 0 3.7 3.7l.6-.6"/>'),
  menu: svg('<path d="M4 6.5 8 10l4-3.5"/>'),
  copy: svg('<rect x="5.5" y="5.5" width="8" height="8" rx="1.2"/><path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2"/>'),
  trash: svg('<path d="M2.5 4.5h11M6.5 7v5M9.5 7v5M3.8 4.5l.7 9h7l.7-9M6 4.5V2.5h4v2"/>'),
  cursor: svg('<path d="M3 2.5 13 7.5l-4.3 1.2L7.5 13z"/>'),
  arrowDown: svg('<path d="M8 2.5v11M3.5 9 8 13.5 12.5 9"/>'),
  lock: svg('<rect x="3.5" y="7" width="9" height="7" rx="1.2"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/>'),
};

/** Add tile → its icon: the dock's for the element it writes, else Build's own. */
export function tileIcon(entry, htmlIcons = {}, toolIcons = {}) {
  if (!entry) {
    return '';
  }

  if (entry.source === 'tool') {
    return htmlIcons[entry.def?.id] || htmlIcons[entry.def?.tag] || htmlIcons.other || BUILD_ICONS.tag;
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

    return BUILD_ICONS[id] || BUILD_ICONS.container;
  }

  if (entry.source === 'columns') {
    return BUILD_ICONS.columns;
  }

  return BUILD_ICONS[entry.id] || htmlIcons[entry.def?.tag] || BUILD_ICONS.tag;
}

/** Style family → its icon: its first tool's icon in the dock's row, else Build's own. */
export function groupIcon(group, toolIcons = {}) {
  const first = group?.tools?.[0];

  return (first && toolIcons[first.id]) || BUILD_ICONS[group?.id] || BUILD_ICONS.transform;
}
