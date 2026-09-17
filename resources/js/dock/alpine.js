/**
 * code-dock.js — region "alpine", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel code-dock.js for what the shell exports.
 */
import { mountPane } from '../cp/mount-pane.js';
import { alpineUi } from '../cp/alpine/store.js';
import AlpinePanel from '../cp/surfaces/AlpinePanel.vue';
import { ALPINE_BEHAVIOURS, ALPINE_GROUPS, behaviourHint, fillName, stateNames, tagAttrs } from '../alpine-behaviours.js';
import CodeDockMenu from '../cp/surfaces/CodeDockMenu.vue';
import CodeDockAddClass from '../cp/surfaces/CodeDockAddClass.vue';
import { flattenHtmlTree, parseHtmlTree } from '../html-tree-parse.js';
import { mountSurface } from '../cp/mount.js';
import { t } from '../lib/i18n.js';
import { dockState } from '../dock/state.js';
import { CSS_MENU_ID, DOCK_ID, editors, html } from '../code-dock.js';
import { htmlTargetFromCursor } from './style-modes.js';
import { dispatchHtmlChanges } from './html-tools.js';
import { closeCssMenu, placeCssMenu } from './css-tools.js';

// ===== alpine =====
/**
 * Write one attribute onto the tag the HTML cursor is in.
 *
 * Replaces it if the tag already has it, otherwise adds it right after the tag
 * name — where a person would put it, and where it reads first. An empty value
 * is written bare (`x-cloak`, `x-transition`), because that is how Alpine's own
 * documentation writes them and a `=""` looks like something went wrong.
 */
function setAlpineAttr(win, name, value) {
  const view = editors.html;
  const target = htmlTargetFromCursor(win);

  if (!view || view.state.readOnly || !target) {
    return;
  }

  const scoped = dockState.htmlScopeActive && !!dockState.htmlFocus;
  const offset = scoped ? dockState.htmlFocus.from : 0;
  const html = scoped ? dockState.htmlFull : view.state.doc.toString();
  const open = html.slice(target.from, target.openTo);
  const written = value === '' ? name : `${name}="${value}"`;
  const found = tagAttrs(open).find((attr) => attr.name === name);

  let next;

  if (found) {
    next = open.slice(0, found.from) + written + open.slice(found.to);
  } else {
    // After the tag name: `<div |x-data="…" class="…">`.
    const at = open.search(/\s|\/?>$/);

    next = at === -1 ? open : `${open.slice(0, at)} ${written}${open.slice(at)}`;
  }

  if (next === open) {
    return;
  }

  dispatchHtmlChanges(
    view,
    [{ from: target.from - offset, to: target.openTo - offset, insert: next }],
    null
  );
  paintAlpine(win);
}

function removeAlpineAttr(win, name) {
  const view = editors.html;
  const target = htmlTargetFromCursor(win);

  if (!view || view.state.readOnly || !target) {
    return;
  }

  const scoped = dockState.htmlScopeActive && !!dockState.htmlFocus;
  const offset = scoped ? dockState.htmlFocus.from : 0;
  const html = scoped ? dockState.htmlFull : view.state.doc.toString();
  const open = html.slice(target.from, target.openTo);
  const found = tagAttrs(open).find((attr) => attr.name === name);

  if (!found) {
    return;
  }

  let from = found.from;

  // Take the space in front with it, or the tag keeps widening.
  while (from > 0 && /\s/.test(open[from - 1])) {
    from -= 1;
  }

  const next = open.slice(0, from) + open.slice(found.to);

  dispatchHtmlChanges(
    view,
    [{ from: target.from - offset, to: target.openTo - offset, insert: next }],
    null
  );
  paintAlpine(win);
}

/** The `x-data` names in scope: this tag's, then whatever wraps it. */
function alpineStatesInScope(win) {
  const view = editors.html;

  if (!view) {
    return [];
  }

  const scoped = dockState.htmlScopeActive && !!dockState.htmlFocus;
  const html = scoped ? dockState.htmlFull : view.state.doc.toString();
  const target = htmlTargetFromCursor(win);
  const out = [];
  const rows = flattenHtmlTree(parseHtmlTree(html), new Set());

  for (const row of rows) {
    // An ancestor of the picked tag, or the tag itself: its state is readable
    // from here. A sibling's is not, and offering it would write a name that
    // resolves to nothing.
    if (!target || row.from > target.from || row.to < target.to) {
      continue;
    }

    const data = tagAttrs(html.slice(row.from, row.openTo)).find((attr) => attr.name === 'x-data');

    if (data) {
      out.push(...stateNames(data.value));
    }
  }

  return [...new Set(out)];
}

/**
 * The switches this tag declares itself, as opposed to the ones it inherits.
 *
 * The difference decides whether writing another `x-data` here would help. On
 * the tag that already holds one it adds a name to the same scope. On a tag
 * below it, it starts a *new* scope that hides the one above — so `@click`
 * written next to it would flip a different `open` than the one `x-show` is
 * watching, and nothing would ever line up.
 */
function alpineOwnStates(win) {
  const view = editors.html;
  const target = htmlTargetFromCursor(win);

  if (!view || !target) {
    return [];
  }

  const scoped = dockState.htmlScopeActive && !!dockState.htmlFocus;
  const html = scoped ? dockState.htmlFull : view.state.doc.toString();
  const data = tagAttrs(html.slice(target.from, target.openTo))
    .find((attr) => attr.name === 'x-data');

  return data ? stateNames(data.value) : [];
}

function openAlpineMenu(win, anchor) {
  const doc = win.document;

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const states = alpineStatesInScope(win);
  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  // Grouped, with the heading above each group and the attribute beside each
  // row. Flat, the list read as sixteen ways to say the same thing: nothing in
  // it said which row put state on the section, which one went on the button,
  // and which one went on the box that reacts.
  //
  // And until there is a switch to point at, the list is only the first group.
  // A trigger or a reaction written against a name nothing declares is the
  // worst failure Alpine has: no error, no warning, the thing simply never
  // happens — and the person who picked it has no way to find out why. Offering
  // it at all is the mistake, so step two appears when step one is done.
  const staged = !states.length;
  // Inherited: the switch lives on a tag above this one. Offering `x-data`
  // here offers the one thing that would break it — see `alpineOwnStates`.
  const inherited = !staged && !alpineOwnStates(win).length;
  const groups = ALPINE_GROUPS.filter((group) => (
    group.id === 'state' ? !inherited : !staged
  ));
  const choices = groups.flatMap((group) => {
    const rows = ALPINE_BEHAVIOURS.filter((item) => item.group === group.id);

    if (!rows.length) {
      return [];
    }

    return [
      {
        value: `\u0000${group.id}`,
        label: t(win, staged && group.id === 'state' ? 'alpine_group_state_first' : group.lang),
        heading: true,
      },
      ...rows.map((item) => ({
        value: item.id,
        label: t(win, item.label),
        hint: behaviourHint(item),
      })),
    ];
  });

  if (staged) {
    // Why the list is short, in the list. Without it the menu looks broken.
    choices.push({ value: '\u0000note', label: t(win, 'alpine_needs_state'), note: true });
  }

  menu._sveApp = mountSurface(CodeDockMenu, menu, {
    kind: 'choices',
    choices,
    onPick: (id) => {
      const behaviour = ALPINE_BEHAVIOURS.find((item) => item.id === id);

      closeCssMenu(doc);

      if (!behaviour) {
        return;
      }

      if (!behaviour.needsName) {
        for (const attr of behaviour.attrs) {
          setAlpineAttr(win, attr.name, attr.value);
        }

        return;
      }

      askAlpineName(win, anchor, behaviour, states);
    },
  });
}

/**
 * Which state this behaviour is about.
 *
 * The names already in scope are offered first, because picking the same name
 * twice is how two tags end up talking to each other — and typing it a second
 * time is where the typo goes.
 */
function askAlpineName(win, anchor, behaviour, states) {
  const doc = win.document;
  const apply = (name) => {
    const clean = String(name || '').trim().replace(/[^\w$]/g, '');

    closeCssMenu(doc);

    if (!clean) {
      return;
    }

    for (const attr of fillName(behaviour.attrs, clean)) {
      setAlpineAttr(win, attr.name, attr.value.replace('|', ''));
    }
  };

  if (!states.length) {
    openAlpineNameInput(win, anchor, apply);

    return;
  }

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockMenu, menu, {
    kind: 'choices',
    choices: [
      // Which switch, said out loud. Two menus in a row that look alike is how
      // you end up picking a name for a question you thought was about events.
      { value: '\u0000head', label: t(win, 'alpine_name'), heading: true },
      ...states.map((name) => ({ value: name, label: name })),
      { value: '\u0000new', label: t(win, 'alpine_new_name') },
    ],
    onPick: (value) => {
      if (value === '\u0000new') {
        openAlpineNameInput(win, anchor, apply);

        return;
      }

      apply(value);
    },
  });
}

function openAlpineNameInput(win, anchor, onDone) {
  const doc = win.document;

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockAddClass, menu, {
    label: t(win, 'alpine_name'),
    placeholder: t(win, 'alpine_name_placeholder'),
    onAdd: (value) => onDone(value),
  });
}

/** Draw the pane for whatever tag the HTML cursor is in. */
export function paintAlpine(win) {
  const dock = win?.document.getElementById(DOCK_ID);
  const host = dock?.querySelector('[data-sve-alpine-host]');

  if (!host) {
    return;
  }

  const target = htmlTargetFromCursor(win);
  const view = editors.html;
  const scoped = dockState.htmlScopeActive && !!dockState.htmlFocus;
  const html = view ? (scoped ? dockState.htmlFull : view.state.doc.toString()) : '';
  const attrs = target ? tagAttrs(html.slice(target.from, target.openTo)) : [];

  alpineUi.tag = target?.tag || '';
  alpineUi.canEdit = !dockState.lastLocked && !!target;
  // "Start with a switch on the section" is the wrong thing to read with the
  // switch's own name sitting in the chip beside it.
  alpineUi.emptyText = t(
    win,
    target ? (alpineStatesInScope(win).length ? 'alpine_none_ready' : 'alpine_none') : 'alpine_pick'
  );
  alpineUi.addLabel = t(win, 'alpine_add');
  alpineUi.dropTitle = t(win, 'alpine_remove');
  alpineUi.states = alpineStatesInScope(win);
  alpineUi.chips = attrs
    .filter((attr) => attr.alpine)
    .map((attr) => ({
      id: attr.name,
      name: attr.name,
      value: attr.value,
      title: attr.value ? `${attr.name}="${attr.value}"` : attr.name,
    }));
  alpineUi.onAdd = (event) => openAlpineMenu(win, event.currentTarget);
  alpineUi.onDrop = (id) => removeAlpineAttr(win, id);
  alpineUi.onChip = (event, id) => {
    const chip = alpineUi.chips.find((item) => item.id === id);

    if (chip) {
      openAlpineNameInput(win, event.currentTarget, (value) => setAlpineAttr(win, id, value));
    }
  };

  if (!host._sveMounted) {
    host._sveMounted = true;
    mountPane(host, AlpinePanel);
  }
}
