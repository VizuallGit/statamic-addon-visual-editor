/**
 * Template dock: hover / double-click a class inside `[ … ]` to rename it.
 * Tailwind outside the brackets is ignored. Does not import overlay / preview.
 */

import { hitBracketClass } from './css-scope.js';

export const CLASS_RENAME_CHIP_ID = '__sve-css-rename-chip';

const PENCIL =
  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';

export function classTokenDecorations(cm) {
  const mark = cm.Decoration.mark({ class: 'sve-cm-css-token' });
  const setHover = cm.StateEffect.define();

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

      builder.add(range.from, range.to, mark);

      return builder.finish();
    },
    provide: (field) => cm.EditorView.decorations.from(field),
  });

  return {
    extensions: [hover],
    setHover(view, range) {
      if (!view) {
        return;
      }

      view.dispatch({ effects: setHover.of(range) });
    },
  };
}

export function closeClassTokenUi(doc) {
  doc?.getElementById(CLASS_RENAME_CHIP_ID)?.remove();
}

function placeChip(win, chip, x, y) {
  const pad = 6;

  chip.style.left = `${Math.max(pad, Math.min(x, win.innerWidth - 28))}px`;
  chip.style.top = `${Math.max(pad, y)}px`;
}

function showChip(win, view, hit, { onRename, title }) {
  const doc = win.document;
  const coords = view.coordsAtPos(hit.to);

  if (!coords) {
    return;
  }

  closeClassTokenUi(doc);

  const chip = doc.createElement('button');

  chip.id = CLASS_RENAME_CHIP_ID;
  chip.type = 'button';
  chip.innerHTML = PENCIL;
  chip.title = title;
  chip.setAttribute('aria-label', title);
  chip.addEventListener('mousedown', (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeClassTokenUi(doc);
    onRename?.(hit);
  });
  chip.addEventListener('mouseleave', () => {
    win.setTimeout(() => {
      if (view.dom.matches(':hover') || chip.matches(':hover')) {
        return;
      }

      closeClassTokenUi(doc);
    }, 120);
  });
  doc.body.appendChild(chip);
  placeChip(win, chip, coords.right + 2, coords.top - 1);
}

export function bindClassTokenNav(win, view, { onRename, isLocked, setHover, title }) {
  if (!view?.dom || view.dom._sveClassTokenBound) {
    return;
  }

  view.dom._sveClassTokenBound = true;

  let hoverTimer = null;
  let hoverKey = '';

  const locked = () => !!isLocked?.();

  const dismiss = () => {
    win.clearTimeout(hoverTimer);
    hoverTimer = null;
    hoverKey = '';
    setHover?.(view, null);
    closeClassTokenUi(win.document);
  };

  const openRename = (hit) => {
    if (locked()) {
      dismiss();

      return;
    }

    dismiss();
    onRename?.(hit);
  };

  view.dom.addEventListener('mousemove', (event) => {
    if (locked()) {
      dismiss();

      return;
    }

    if (event.target?.closest?.(`#${CLASS_RENAME_CHIP_ID}`)) {
      return;
    }

    const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });

    if (pos == null) {
      return;
    }

    const hit = hitBracketClass(view.state.doc.toString(), pos);

    if (!hit) {
      win.clearTimeout(hoverTimer);
      hoverTimer = null;
      hoverKey = '';
      setHover?.(view, null);

      return;
    }

    const key = `${hit.from}:${hit.to}:${hit.name}`;

    setHover?.(view, { from: hit.from, to: hit.to });

    if (hoverKey === key && (hoverTimer || win.document.getElementById(CLASS_RENAME_CHIP_ID))) {
      return;
    }

    win.clearTimeout(hoverTimer);
    hoverKey = key;
    hoverTimer = win.setTimeout(() => {
      hoverTimer = null;
      showChip(win, view, hit, { onRename: openRename, title: title || 'Rename class' });
    }, 160);
  });

  view.dom.addEventListener('mouseleave', (event) => {
    if (event.relatedTarget?.closest?.(`#${CLASS_RENAME_CHIP_ID}`)) {
      return;
    }

    win.setTimeout(() => {
      if (win.document.getElementById(CLASS_RENAME_CHIP_ID)?.matches(':hover')) {
        return;
      }

      dismiss();
    }, 160);
  });

  view.dom.addEventListener(
    'dblclick',
    (event) => {
      if (locked()) {
        return;
      }

      const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });

      if (pos == null) {
        return;
      }

      const hit = hitBracketClass(view.state.doc.toString(), pos);

      if (!hit) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      openRename(hit);
    },
    true,
  );

  view.scrollDOM?.addEventListener('scroll', dismiss);

  if (!win.document._sveClassTokenDismiss) {
    win.document._sveClassTokenDismiss = true;
    win.document.addEventListener('mousedown', (event) => {
      if (event.target.closest(`#${CLASS_RENAME_CHIP_ID}`)) {
        return;
      }

      closeClassTokenUi(win.document);
    });
  }
}
