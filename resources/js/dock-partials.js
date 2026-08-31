/**
 * Template dock: open a `{{ partial src }}` from the HTML or CSS pane.
 *
 * Finds partial tags in the dock text, marks them, and shows a list of
 * matching view files. Does not import overlay / preview / bridge.
 */

export const PARTIAL_MENU_ID = '__sve-partial-menu';

const COMMENT = /\{\{#([\s\S]*?)#\}\}/g;
const PARTIAL = /\{\{\s*partial(?::([^\s}]+)|(?=[\s}]))([\s\S]*?)\}\}/gi;

const cache = new Map();

export function findPartials(html) {
  const masked = String(html || '').replace(COMMENT, (chunk) => ' '.repeat(chunk.length));
  const out = [];

  PARTIAL.lastIndex = 0;

  let match;

  while ((match = PARTIAL.exec(masked))) {
    const colon = (match[1] || '').trim();
    const body = match[2] || '';
    const attr = body.match(/\bsrc\s*=\s*(["'])([^"']+)\1/i);
    const src = colon || (attr ? attr[2].trim() : '');

    if (!src || src.includes('..')) {
      continue;
    }

    out.push({
      from: match.index,
      to: match.index + match[0].length,
      src,
    });
  }

  return out;
}

export function hitPartial(html, pos) {
  return findPartials(html).find((item) => pos >= item.from && pos <= item.to) || null;
}

const LOOP_SKIP = new Set([
  'if',
  'elseif',
  'else',
  'unless',
  'foreach',
  'forelse',
  'noparse',
  'once',
  'cache',
  'nocache',
  'section',
  'yield',
  'partial',
  'slot',
  'switch',
  'case',
  'vite',
  'sve_html',
  'sve_css',
  'sve_js',
  'sve_tw',
  'style_push',
  'script_push',
]);

/**
 * Innermost Antlers pair around `pos` that is a field loop
 * (`{{ content_block }}` … `{{ /content_block }}`), not `if` / `partial`.
 */
export function enclosingLoopField(html, pos) {
  const pairs = [];
  const re = /\{\{\s*(\/?)([A-Za-z_][A-Za-z0-9_]*)\b[\s\S]*?\}\}/g;
  let match;

  while ((match = re.exec(String(html || '')))) {
    const name = match[2];

    if (LOOP_SKIP.has(name.toLowerCase())) {
      continue;
    }

    if (!match[1]) {
      pairs.push({ name, from: match.index, to: null });
      continue;
    }

    for (let i = pairs.length - 1; i >= 0; i -= 1) {
      if (pairs[i].name === name && pairs[i].to == null) {
        pairs[i].to = match.index + match[0].length;
        break;
      }
    }
  }

  let best = null;

  for (const pair of pairs) {
    if (pair.to == null || pos < pair.from || pos > pair.to) {
      continue;
    }

    if (!best || pair.to - pair.from < best.to - best.from) {
      best = pair;
    }
  }

  return best?.name || null;
}

export function usedTypesIn(values, field) {
  const types = new Set();

  const walk = (node) => {
    if (Array.isArray(node)) {
      if (!field) {
        for (const item of node) {
          if (item && typeof item === 'object' && typeof item.type === 'string' && item.type) {
            types.add(item.type);
          }

          walk(item);
        }

        return;
      }

      node.forEach(walk);

      return;
    }

    if (!node || typeof node !== 'object') {
      return;
    }

    if (field && Array.isArray(node[field])) {
      for (const item of node[field]) {
        if (item && typeof item === 'object' && typeof item.type === 'string' && item.type) {
          types.add(item.type);
        }
      }
    }

    Object.values(node).forEach(walk);
  };

  walk(values);

  return types;
}

export function itemsForPartial(hit, items, html, section) {
  if (!hit.src.includes('{')) {
    return items;
  }

  if (!section) {
    return items;
  }

  const field = enclosingLoopField(html, hit.from);
  const used = usedTypesIn(section, field);

  if (field) {
    return items.filter((item) => used.has(item.label));
  }

  if (used.size === 0) {
    return items;
  }

  return items.filter((item) => used.has(item.label));
}

export function fetchPartialItems(win, src) {
  if (cache.has(src)) {
    return cache.get(src);
  }

  const pending = win
    .fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(src)}`, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
    .then((res) => (res.ok ? res.json() : { items: [] }))
    .then((data) => (Array.isArray(data.items) ? data.items : []))
    .catch(() => []);

  cache.set(src, pending);

  return pending;
}

let leaveTimer = null;

function cancelMenuLeave(win) {
  win.clearTimeout(leaveTimer);
  leaveTimer = null;
}

function scheduleMenuLeave(win, onLeave) {
  if (leaveTimer) {
    return;
  }

  leaveTimer = win.setTimeout(() => {
    leaveTimer = null;
    onLeave?.();
  }, 180);
}

export function closePartialMenu(doc) {
  doc?.getElementById(PARTIAL_MENU_ID)?.remove();
}

export function showPartialMenu(win, items, x, y, { onOpen, emptyLabel, onStay, onLeave }) {
  const doc = win.document;

  closePartialMenu(doc);

  const menu = doc.createElement('div');

  menu.id = PARTIAL_MENU_ID;
  menu.style.left = `${Math.max(8, Math.round(x))}px`;
  menu.style.top = `${Math.max(8, Math.round(y))}px`;

  if (!items.length) {
    const empty = doc.createElement('div');

    empty.setAttribute('data-sve-partial-empty', '');
    empty.textContent = emptyLabel || '';
    menu.appendChild(empty);
  } else {
    items.forEach((item) => {
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.setAttribute('data-sve-partial-choice', '');
      btn.textContent = item.label;
      btn.title = item.path || item.type;
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        closePartialMenu(doc);
        onOpen?.(item.type);
      });
      menu.appendChild(btn);
    });
  }

  doc.body.appendChild(menu);

  const rect = menu.getBoundingClientRect();
  const pad = 8;
  let left = rect.left;
  let top = rect.top;

  if (rect.right > win.innerWidth - pad) {
    left = Math.max(pad, win.innerWidth - rect.width - pad);
  }

  if (rect.bottom > win.innerHeight - pad) {
    top = Math.max(pad, win.innerHeight - rect.height - pad);
  }

  menu.style.left = `${Math.round(left)}px`;
  menu.style.top = `${Math.round(top)}px`;

  menu.addEventListener('mouseenter', () => onStay?.());
  menu.addEventListener('mouseleave', () => onLeave?.());
}

export function partialDecorations(cm) {
  const mark = cm.Decoration.mark({ class: 'sve-cm-partial' });
  const lineDeco = cm.Decoration.line({ class: 'sve-cm-partial-line' });
  const setHover = cm.StateEffect.define();

  const marks = cm.StateField.define({
    create(state) {
      return buildMarks(state, cm, mark);
    },
    update(value, tr) {
      return tr.docChanged ? buildMarks(tr.state, cm, mark) : value;
    },
    provide: (field) => cm.EditorView.decorations.from(field),
  });

  const hover = cm.StateField.define({
    create() {
      return cm.Decoration.none;
    },
    update(value, tr) {
      let range;

      for (const effect of tr.effects) {
        if (effect.is(setHover)) {
          range = effect.value;
        }
      }

      if (range === undefined) {
        return tr.docChanged ? cm.Decoration.none : value;
      }

      if (!range) {
        return cm.Decoration.none;
      }

      const builder = new cm.RangeSetBuilder();
      const fromLine = tr.state.doc.lineAt(range.from);
      const toLine = tr.state.doc.lineAt(range.to);

      for (let n = fromLine.number; n <= toLine.number; n += 1) {
        const line = tr.state.doc.line(n);

        builder.add(line.from, line.from, lineDeco);
      }

      return builder.finish();
    },
    provide: (field) => cm.EditorView.decorations.from(field),
  });

  return {
    extensions: [marks, hover],
    setHover(view, range) {
      if (!view) {
        return;
      }

      view.dispatch({ effects: setHover.of(range) });
    },
  };
}

function buildMarks(state, cm, mark) {
  const builder = new cm.RangeSetBuilder();

  for (const item of findPartials(state.doc.toString())) {
    builder.add(item.from, item.to, mark);
  }

  return builder.finish();
}

export function bindPartialNav(win, view, { onOpen, emptyLabel, sectionValues, isLocked, setHover }) {
  if (!view?.dom || view.dom._svePartialBound) {
    return;
  }

  view.dom._svePartialBound = true;

  let hoverTimer = null;
  let lastSrc = '';
  let hoverSrc = '';

  const dismiss = () => {
    cancelMenuLeave(win);
    win.clearTimeout(hoverTimer);
    hoverTimer = null;
    hoverSrc = '';
    lastSrc = '';
    setHover?.(view, null);
    closePartialMenu(win.document);
  };

  const linger = {
    stay: () => cancelMenuLeave(win),
    leave: () => scheduleMenuLeave(win, dismiss),
  };

  const clearHover = () => {
    win.clearTimeout(hoverTimer);
    hoverTimer = null;
    hoverSrc = '';
    setHover?.(view, null);
  };

  const locked = () => !!isLocked?.();

  const openAt = (hit, x, y, { click } = {}) => {
    if (locked()) {
      closePartialMenu(win.document);
      setHover?.(view, null);

      return;
    }
    lastSrc = hit.src;
    fetchPartialItems(win, hit.src).then((items) => {
      if (lastSrc !== hit.src) {
        return;
      }

      const html = view.state.doc.toString();
      const next = itemsForPartial(hit, items, html, sectionValues?.() || null);

      if (next.length === 1) {
        if (click) {
          closePartialMenu(win.document);
          onOpen?.(next[0].type);
        }

        return;
      }

      if (!next.length && !click) {
        return;
      }

      showPartialMenu(win, next, x, y, {
        onOpen,
        emptyLabel,
        onStay: linger.stay,
        onLeave: linger.leave,
      });
    });
  };

  view.dom.addEventListener('mousemove', (event) => {
    if (locked()) {
      dismiss();

      return;
    }

    const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });

    if (pos == null) {
      return;
    }

    const hit = hitPartial(view.state.doc.toString(), pos);

    if (!hit) {
      win.clearTimeout(hoverTimer);
      hoverTimer = null;
      hoverSrc = '';
      linger.leave();

      return;
    }

    linger.stay();
    setHover?.(view, { from: hit.from, to: hit.to });

    if (hoverSrc === hit.src && hoverTimer) {
      return;
    }

    clearHover();
    hoverSrc = hit.src;
    hoverTimer = win.setTimeout(() => {
      const coords = view.coordsAtPos(hit.from);

      openAt(hit, coords?.left ?? event.clientX, (coords?.bottom ?? event.clientY) + 6);
    }, 280);
  });

  view.dom.addEventListener('mouseleave', (event) => {
    if (event.relatedTarget?.closest?.(`#${PARTIAL_MENU_ID}`)) {
      linger.stay();

      return;
    }

    linger.leave();
  });

  view.dom.addEventListener('click', (event) => {
    if (locked()) {
      closePartialMenu(win.document);

      return;
    }

    const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });

    if (pos == null) {
      return;
    }

    const hit = hitPartial(view.state.doc.toString(), pos);

    if (!hit) {
      return;
    }

    clearHover();
    openAt(hit, event.clientX, event.clientY + 8, { click: true });
  });

  if (!docHasPartialDismiss(win.document)) {
    win.document.addEventListener('mousedown', (event) => {
      if (event.target.closest(`#${PARTIAL_MENU_ID}, .sve-cm-partial`)) {
        return;
      }

      closePartialMenu(win.document);
    });
    win.document._svePartialDismiss = true;
  }
}

function docHasPartialDismiss(doc) {
  return !!doc._svePartialDismiss;
}
