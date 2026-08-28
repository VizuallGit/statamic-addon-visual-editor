/**
 * Field-list helpers the editor still needs, and a thin bridge to the tabs addon.
 *
 * Segmented tabs, accordion cards and their icons live in `statamic-addon/tabs`
 * (`section-groups.js`). This file must not draw them. Overlay / preview / bridge
 * are not imported from here.
 */
import { SELECTORS } from './cp-selectors.js';

export const SECTION_TOGGLE_ATTR = 'data-sve-section-toggle';
export const SECTION_GROUP_ATTR = 'data-sve-section-group';
export const SECTION_SEG_ATTR = 'data-sve-section-seg';
export const SECTION_ACTIVE_ATTR = 'data-sve-section-active';
export const SECTION_CONTENT_KEY = '__content';

export const SECTION_PANEL_ATTR = 'data-sve-section-panel';
export const SECTION_PANEL_CARD_ATTR = 'data-sve-panel-card';
export const SECTION_PANEL_HEAD_ATTR = 'data-sve-panel-head';
export const SECTION_PANEL_BODY_ATTR = 'data-sve-panel-body';
export const SECTION_PANEL_OPEN_ATTR = 'data-sve-panel-open';
export const SECTION_PANEL_OWNER_ATTR = 'data-sve-panel-owner';

export const FIELD_LIST = '.publish-fields';

export function fieldListOf(el) {
  return el?.closest?.(FIELD_LIST) || null;
}

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

export function sectionFieldRows(list) {
  return [...list.children].filter((row) => !row.hasAttribute(SECTION_TOGGLE_ATTR));
}

export function rowFieldtype(row, name) {
  const el = row.classList?.contains(name) ? row : row.querySelector(`.${name}`);

  return el && fieldListOf(el) === row.parentElement ? el : null;
}

export function ownDescendants(list, selector) {
  return [...list.querySelectorAll(selector)].filter((el) => fieldListOf(el) === list);
}

export function ownDescendant(list, selector) {
  return ownDescendants(list, selector)[0] || null;
}

export function fieldLabel(row) {
  return (row.querySelector('label')?.textContent || '').trim();
}

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
  block: {
    box: '2.15 5.15 19.7 13.7',
    paths: '<rect x="3" y="6" width="18" height="12" rx="2"/>',
  },
  settings: {
    box: '1.45 1.45 21.1 21.1',
    paths: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.6 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 11.5 4a2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9 2 2 0 1 1 0 4Z"/>',
  },
};

export const iconifyCache = new Map();

export function adoptSvg(el, markup) {
  el.innerHTML = markup;

  const svg = el.querySelector('svg');

  if (!svg) {
    return;
  }

  svg.removeAttribute('width');
  svg.removeAttribute('height');
  svg.querySelectorAll('[stroke]:not([stroke="none"])').forEach((node) => {
    node.setAttribute('stroke', 'currentColor');
  });
}

export function panelIcon(doc, name) {
  const fromTabs = doc.defaultView?.VizuallTabs?.panelIcon;

  if (typeof fromTabs === 'function') {
    const icon = fromTabs(doc, name);

    if (icon) {
      icon.setAttribute('data-sve-icon', '');
    }

    return icon;
  }

  if (!name) {
    return null;
  }

  const holder = doc.createElement('span');

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

  holder.textContent = [...name].length <= 2 ? name : '';

  return holder;
}

export function setSectionGroup(list, key) {
  list?.ownerDocument?.defaultView?.VizuallTabs?.setGroup?.(list, key);
}

export function revealSegmentsFor(el, doc) {
  const win = doc?.defaultView || (el && el.ownerDocument?.defaultView);

  win?.VizuallTabs?.revealFor?.(el, doc);
}

export function enhanceSectionGroupsIn(win, root = win.document) {
  win.VizuallTabs?.enhanceIn?.(win, root);
}

export function settleUngroupedFieldLists(win, root = win.document) {
  win.VizuallTabs?.settle?.(win, root);
}

export function stampGridRows(root = document) {
  root.querySelectorAll('table.grid-table tbody tr').forEach((tr) => {
    if (!tr.hasAttribute('data-grid-row')) {
      tr.setAttribute('data-grid-row', '');
    }
  });

  root.querySelectorAll('.grid-stacked').forEach((container) => {
    Array.from(container.children).forEach((child) => {
      if (child.nodeType === 1 && !child.hasAttribute('data-grid-row')) {
        child.setAttribute('data-grid-row', '');
      }
    });
  });

  hideAutoUuidGridColumns(root);
}

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
