/**
 * The fields pane: what drives it, and when it is there at all.
 *
 * Only while the dock has a component open, and only with `component_props`
 * on. Everything it does goes through `dock:set-props`, which writes the file
 * — so the pane holds no state of its own that could drift from disk.
 *
 * A field is a card: what it is, what it is called, and what it says when
 * nobody fills it in. The boxes that change those three things stay folded
 * away until the card is opened, because a list of fields is read far more
 * often than it is edited.
 */

import { t } from './lib/i18n.js';
import { ask } from './cp/bus.js';
import { componentPropsOn } from './component-props.js';
import { componentPropsUi as ui } from './cp/component-props/store.js';
import { armComponentBind, componentBindHandle, disarmComponentBind } from './component-bind.js';
import { createPropValues, propValuesReady } from './prop-values.js';
import { openCpOverlay } from './cp/open-overlay.js';
import HtmlTreeMenu from './cp/surfaces/HtmlTreeMenu.vue';
import { PROP_ICONS } from './cp/component-props/icons.js';

/**
 * The kinds the plus offers, in the order it offers them, and the name a new
 * field of each kind is born with.
 *
 * Every kind here is one `ComponentProps\Schema::TYPES` knows and
 * `PropFields::config()` can draw — a kind listed on one side only is a menu
 * entry that makes a text field, with nothing on screen to say why.
 */
const TYPES = [
  { id: 'text', handle: 'text' },
  { id: 'bard', handle: 'rich_text' },
  { id: 'number', handle: 'number' },
  { id: 'boolean', handle: 'flag' },
  { id: 'select', handle: 'choice' },
  { id: 'color', handle: 'color' },
  { id: 'media', handle: 'image' },
  { id: 'link', handle: 'link' },
];

/** Which card is open. Index, because the list is rebuilt on every paint. */
let openIndex = -1;

/** The open card's default, edited as the Control Panel's own field. */
const defaultValue = createPropValues('sve-prop-default');

let menu = null;

function closeMenu() {
  menu?.dismiss();
  menu = null;
}

/**
 * A menu under the button that opened it.
 *
 * Mounted on `document.body` rather than inside the pane: the panes stack and
 * scroll, and a menu drawn as a child of one is clipped by it.
 */
function openMenuAt(win, anchor, items) {
  closeMenu();

  const rect = anchor?.getBoundingClientRect?.();

  menu = openCpOverlay(win.document, HtmlTreeMenu, {
    items,
    x: rect ? rect.left : 0,
    y: rect ? rect.bottom + 4 : 0,
    onClose: () => {
      menu = null;
    },
  });
}

function typeLabel(win, type) {
  return t(win, `component_props_type_${TYPES.some((kind) => kind.id === type) ? type : 'text'}`);
}

function rowsFrom(win, props) {
  return props.map((prop, index) => ({
    key: index,
    handle: prop.handle || '',
    type: prop.type || 'text',
    default: prop.default || '',
    // The choices as one line, which is how they are typed. The file holds a
    // list; a row edited a moment ago still holds the line it was typed as.
    options: Array.isArray(prop.options) ? prop.options.join(', ') : String(prop.options || ''),
    typeLabel: typeLabel(win, prop.type || 'text'),
    open: index === openIndex,
    binding: !!prop.handle && prop.handle === componentBindHandle(),
  }));
}

function commit(win, props) {
  ask('dock:set-props', { win, props });
  paintComponentProps(win);
}

/** The save whose landing is already going to repaint, so it is chained once. */
let awaitedSave = null;

/**
 * Is a save still carrying the declaration to disk?
 *
 * The open card's default is drawn from what the server reads back from the
 * file, and a field added a moment ago is not in the file until the save
 * lands. Asked before the save had landed, the server answered "no such
 * field", the answer was kept, and the card showed no editor until it was
 * closed and opened again. So while a save is in the air the editor is not
 * asked for at all — the paint after the save asks, and gets the field.
 */
function loadAfterSave(win) {
  const saving = ask('dock:save-settled');

  if (!saving?.finally) {
    return false;
  }

  if (awaitedSave !== saving) {
    awaitedSave = saving;
    saving.finally(() => {
      if (awaitedSave === saving) {
        awaitedSave = null;
      }

      paintComponentProps(win);
    });
  }

  return true;
}

/** A name no other field on this component has taken. */
function freeHandle(props, base) {
  const taken = new Set(props.map((prop) => prop.handle));
  let handle = base;
  let n = 1;

  while (taken.has(handle)) {
    handle = `${base}_${++n}`;
  }

  return handle;
}

/**
 * Is someone typing in this panel right now?
 *
 * The panel is repainted by anything that repaints the HTML tree, and that
 * happens while you are in the middle of a word: the rows are replaced, the
 * `:value` bindings are written back from the file, and the caret is gone. You
 * click the field again, type two letters, and it throws you out again.
 *
 * The HTML tree already refuses to redraw while a row is being renamed
 * (`htmlTreeUi.editingId`). This is the same rule for the same reason — a
 * panel must not pull its own controls out from under the person using them.
 * The repaint is not lost, only deferred: the next one after the field is left
 * brings whatever changed with it.
 */
function typingInPanel(win) {
  const el = win.document.activeElement;
  const root = el?.closest?.('.sve-cprops, .sve-csb');

  if (!root) {
    return false;
  }

  // Not a select: choosing a type is finished the moment it is chosen, and the
  // row has to redraw for it — a `media` row shows different controls than a
  // `text` one. Typing is the only thing that is still in progress.
  if (el.tagName === 'SELECT') {
    return false;
  }

  return (
    /^(INPUT|TEXTAREA)$/.test(el.tagName)
    || el.isContentEditable
    || !!el.closest?.('[contenteditable="true"], .bard-fieldtype, .assets-fieldtype')
  );
}


/**
 * The handle as the file will actually hold it.
 *
 * `ComponentProps::handle()` lowercases the name and folds spaces and dashes
 * into underscores before writing it, and everything downstream matches on the
 * written form: the server looks the field up by handle to draw the default's
 * editor, and the template says `{{ props_<handle> }}`. Leaving the typed
 * spelling in the panel makes all three disagree — a field typed `Teaser` is
 * saved as `teaser`, the lookup for `Teaser` finds nothing, and the default's
 * editor renders as an empty gap with no error anywhere.
 *
 * A name that normalizes to nothing is left as typed, so a half-finished one
 * is not wiped out from under the cursor.
 */
function normalizeHandle(raw) {
  const handle = String(raw ?? '')
    .trim()
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .replace(/^(?:props_)+/, '')
    .slice(0, 40);

  return /^[a-z_]/.test(handle) ? handle : String(raw ?? '');
}

export function paintComponentProps(win) {
  if (typingInPanel(win)) {
    return;
  }

  const src = componentPropsOn(win) ? ask('dock:component-src') : '';

  if (!src) {
    closeMenu();
    disarmComponentBind(win);
    defaultValue.forget();
    openIndex = -1;
    ui.open = false;
    ui.rows = [];
    ui.exitOpen = false;

    return;
  }

  const props = ask('dock:props') || [];
  const exit = ask('dock:component-exit-state') || {};

  if (openIndex >= props.length) {
    openIndex = -1;
  }

  ui.open = true;
  ui.locked = ask('dock:is-locked') === true;
  ui.title = t(win, 'component_props');
  ui.name = src.split('/').pop() || src;
  ui.addLabel = t(win, 'component_props_add');
  ui.removeLabel = t(win, 'component_props_remove');
  ui.handleLabel = t(win, 'component_props_handle');
  ui.defaultLabel = t(win, 'component_props_default');
  ui.optionsLabel = t(win, 'component_props_options');
  ui.bindLabel = t(win, 'component_props_bind');
  ui.statamicFields = propValuesReady();
  ui.defaultStore = defaultValue.ui;
  ui.bindHint = t(win, 'component_props_bind_hint');
  ui.moveLabel = t(win, 'component_props_move');
  ui.emptyText = t(win, 'component_props_none');
  ui.types = TYPES.map((kind) => ({ id: kind.id, label: t(win, `component_props_type_${kind.id}`) }));
  ui.bindingHandle = componentBindHandle();
  ui.rows = rowsFrom(win, props);

  ui.exitOpen = !!exit.open;
  ui.exitName = exit.name || '';
  ui.exitLabel = t(win, 'component_exit');
  ui.exitTitle = t(win, exit.back ? 'component_exit_back' : 'component_exit_close');
  ui.onExit = () => {
    disarmComponentBind(win);
    ask('dock:exit-component');
  };

  /**
   * The plus asks what kind first, and makes the field second.
   *
   * The kind is the one thing that decides what the field is for, so it is the
   * one thing worth choosing before the field exists — a row that arrives as
   * text and has to be corrected is two steps where this is one.
   */
  ui.onAdd = (anchor) => {
    if (ui.locked) {
      return;
    }

    openMenuAt(
      win,
      anchor,
      TYPES.map((kind) => ({
        label: t(win, `component_props_type_${kind.id}`),
        icon: PROP_ICONS[kind.id] || '',
        onPick: () => {
          closeMenu();
          openIndex = props.length;
          commit(win, [...props, { handle: freeHandle(props, kind.handle), type: kind.id, label: '', default: '' }]);
        },
      }))
    );
  };

  /** Opening a card is opening one card: two sets of boxes is the clutter. */
  ui.onOpen = (index) => {
    openIndex = openIndex === index ? -1 : index;
    defaultValue.forget();
    paintComponentProps(win);
  };

  ui.onRemove = (index) => {
    const next = props.slice();

    next.splice(index, 1);

    if (openIndex === index) {
      openIndex = -1;
    }

    commit(win, next);
  };

  ui.onEdit = (index, key, value) => {
    const clean = key === 'handle' ? normalizeHandle(value) : value;
    const next = props.map((prop, at) => (at === index ? { ...prop, [key]: clean } : prop));

    // A renamed field is a different field: the label the server derives from
    // the handle has to follow it, or the panel keeps showing the old name.
    if (key === 'handle') {
      next[index].label = '';
    }

    commit(win, next);
  };

  /**
   * A field moved to another place in the list.
   *
   * The order is the order the panel draws them in at every place the component
   * is used, so it is worth setting — and nothing else about the declaration
   * changes, which is why this is a plain splice and not an edit.
   */
  ui.onReorder = (from, to) => {
    if (ui.locked || from === to) {
      return;
    }

    const next = props.slice();

    if (from < 0 || to < 0 || from >= next.length || to >= next.length) {
      return;
    }

    const [moved] = next.splice(from, 1);

    next.splice(to, 0, moved);
    openIndex = -1;
    commit(win, next);
  };

  /**
   * The open card's default, as a one-field publish form.
   *
   * Keyed on the field it belongs to, so opening another card loads that one
   * and editing this one does not reload it underneath the cursor.
   */
  if (ui.statamicFields && openIndex > -1 && props[openIndex] && !loadAfterSave(win)) {
    const prop = props[openIndex];
    const at = openIndex;

    defaultValue.load(win, {
      key: `${src}::${prop.handle}::${prop.type}`,
      src,
      handle: prop.handle,
      display: ui.defaultLabel,
      params: { [prop.handle]: prop.default || '' },
      readOnly: ui.locked,
    });
    defaultValue.watch(win, {
      src,
      handle: prop.handle,
      write: (params) => ui.onEdit?.(at, 'default', params[prop.handle] ?? ''),
    });
  } else if (openIndex < 0 || !props[openIndex]) {
    // No card open. While a save is in the air the store is left as it is —
    // an editor someone is typing a default into must not be thrown away by
    // the save that typing caused.
    defaultValue.forget();
  }

  /** Point at the element in the preview this field should stand for. */
  ui.onBind = (index) => {
    if (ui.locked) {
      return;
    }

    armComponentBind(win, props[index], () => paintComponentProps(win));
    paintComponentProps(win);
  };
}
