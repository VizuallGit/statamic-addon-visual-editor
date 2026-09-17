/**
 * bridge.js — region "row-toolbar", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel bridge.js for what the shell exports.
 */
import { bridgeState } from '../bridge/state.js';
import { SECTION_ORDERABLE_ATTR, SID_ATTR, TOOLBAR_ATTR, t } from '../bridge.js';
import { INSERT_ATTR } from './outline-nav.js';
import { ORDERABLE_ATTR, isHorizontalFlow } from './grid.js';
import { orderablePeers } from './drag.js';
import { sidTemplatePayload } from './inserters.js';
import { ICONS, applyBlockFormat, applyControlValue, applyHighlightColor, applyVizuStyle, bardCommand, clearVizuSpanProp, detectCpDark, headingIcon, letterIcon, openControlMenu, openHighlightColorMenu, openToolbarMenu, positionEditToolbar, readSelectionVizuProp, removeEditToolbar, sendEditInput, setVizuSpanProp, styleIdentHtml, toggleSpanClass, toolbarThemeFor, updateEditToolbarState } from './inline-edit.js';
import { hideMoveControl, requestRowCaps } from './row-caps-move.js';
import { finishEditing } from './editing.js';

// ===== row-toolbar =====
/**
 * The block a row sits inside: the nearest ancestor that is a set of an
 * insertable container. Null when there is none — a row directly in a page
 * section has no block above it, and a page section is never one.
 *
 * A row's own actions stop at the row, and rowContextFor only ever sees the
 * innermost one. So a link inside a links block leaves the block itself out of
 * reach: nothing on the page belongs to it that the cursor can find, because the
 * links cover it completely. This is the way back up to it.
 */
export function blockHolding(el) {
  let node = el.parentElement;

  while (node && node.nodeType === 1) {
    if (
      node.hasAttribute(SID_ATTR) &&
      !node.hasAttribute(SECTION_ORDERABLE_ATTR) &&
      node.parentElement?.hasAttribute(INSERT_ATTR)
    ) {
      return node;
    }

    node = node.parentElement;
  }

  return null;
}

/**
 * Everything the toolbar needs to speak for the block a field sits in: what to
 * call it, how to move it, and what can be done to it.
 *
 * Blocks no longer carry a hover control, so this is the only place those actions
 * appear — which is the point. They can't be pulled out from under the cursor,
 * and they can't vanish the moment you start typing.
 *
 * Mirrors showMoveControl's row branch: arrows when there are siblings to swap
 * with, then hide / duplicate / delete for a set inside an insertable container,
 * or add / remove for a plain orderable row.
 */
/**
 * A field that asked for a badge without being a row — `toolbar="true"`, or an
 * `icon=` / `icon_from=` that implies it.
 *
 * It has something to name itself with at the head of the bar, and nothing else:
 * peers, add, duplicate and remove all read the replicator around a row, and a
 * lone field has none. Being movable and wearing a badge are separate questions,
 * so a section heading can have the second without pretending to the first.
 */
function badgeOnlyContext(el) {
  return {
    row: el,
    uid: el.getAttribute('data-sid-field-uid') || el.getAttribute(SID_ATTR) || '',
    peers: [],
    horizontal: false,
    block: null,
    blockUid: null,
    blockLabel: '',
    label: el.getAttribute('data-sid-label') || '',
    icon: el.getAttribute('data-sid-icon') || '',
    iconSvg: el.getAttribute('data-sid-icon-svg') || '',
    moveActions: [],
    itemActions: [],
  };
}

/**
 * The row proper, given any orderable element inside it.
 *
 * Walks out through nested orderables while they stay inside the same replicator
 * container: whatever ends up as a direct child of that container is the row the
 * field owns, and everything below it is decoration the template added.
 */
function outermostRowWithin(row) {
  const container = row.closest(`[${INSERT_ATTR}]`);

  if (!container) {
    return row;
  }

  let out = row;

  for (let i = 0; i < 10; i++) {
    const outer = out.parentElement?.closest(`[${ORDERABLE_ATTR}]`);

    if (!outer || !container.contains(outer)) {
      return out;
    }

    out = outer;
  }

  return out;
}

function rowContextFor(win, el) {
  const inner = el.closest(`[${ORDERABLE_ATTR}]`);

  if (!inner) {
    const badged = el.closest('[data-sid-icon], [data-sid-icon-svg]');

    return badged ? badgeOnlyContext(badged) : null;
  }

  // A page section is not a row: it keeps its own hover control, with actions
  // (settings, save as template, add below) that no text edit would surface.
  if (inner.hasAttribute(SECTION_ORDERABLE_ATTR) || !inner.parentElement) {
    return null;
  }

  // Two orderable layers around one block: a template may wrap each row in an
  // orderable div of its own while the partial inside also declares orderable.
  // The OUTER one is the row — it is what sits among the siblings and what moves
  // in the DOM — so counting the inner one too made the list twice as long, and
  // a drag of one step landed two rows away.
  const row = outermostRowWithin(inner);

  const uid =
    row.getAttribute(GLOBAL_ROW_ATTR) || row.getAttribute(SID_ATTR) || row.getAttribute('data-sid-field-uid');

  if (!uid) {
    return null;
  }

  const post = (type, extra = {}) =>
    win.parent.postMessage(
      { source: 'statamic-visual-editor', type, uid, ...extra },
      win.location.origin
    );

  // The block around the row, when the row is not one itself. Only a nested row
  // has one: a block's own parent IS the insertable container.
  const block = row.parentElement.hasAttribute(INSERT_ATTR) ? null : blockHolding(row);
  const blockUid = block?.getAttribute(SID_ATTR) || null;
  const blockLabel = block?.getAttribute('data-sid-label') || '';

  const peers = orderablePeers(row);
  const horizontal = isHorizontalFlow(win, row);
  const moveActions = [];

  const peerIndex = peers.indexOf(row);

  if (peers.length > 1 && peerIndex >= 0) {
    if (peerIndex > 0) {
      moveActions.push({
        glyph: horizontal ? '←' : '↑',
        label: horizontal ? t('move_left') : t('move_up'),
        run: () => post('move', { direction: -1 }),
      });
    }

    if (peerIndex < peers.length - 1) {
      moveActions.push({
        glyph: horizontal ? '→' : '↓',
        label: horizontal ? t('move_right') : t('move_down'),
        run: () => post('move', { direction: 1 }),
      });
    }
  }

  // Insert on either side of this row. Both hand off to Statamic's own set
  // picker — the same one the "+" between blocks opens — so the choice is made
  // in one place, with its groups, search and previews, wherever it starts.
  const addAt = (position) => {
    const r = row.getBoundingClientRect();
    const edge = position === 'before' ? r.top : r.bottom;

    post('add-block-native', {
      anchorUid: uid,
      sectionUid: row.parentElement.getAttribute('data-sid-insert-scope') || null,
      position,
      // Same as the "+" inserter: inside a global section the picker belongs in
      // the panel's form, where that section's blocks actually live.
      global: !!row.closest(`[${GLOBAL_FOCUS_ATTR}]`),
      // A flat rect on the edge the new block lands at, so the picker opens
      // where it is going rather than over the middle of the block it came from.
      anchorRect: { left: r.left, right: r.left, top: edge, bottom: edge, width: 0, height: 0 },
      ...sidTemplatePayload(row.parentElement),
    });
  };

  // Written out rather than drawn: in a menu a word says what an icon only hints
  // at, and there is room for it.
  const itemActions = row.parentElement.hasAttribute(INSERT_ATTR)
    ? [
        { label: t('add_before'), dividerBefore: true, run: () => addAt('before') },
        { label: t('add_after'), run: () => addAt('after') },
        {
          label: t('duplicate_this'),
          dividerBefore: true,
          requiresAdd: true,
          run: () => post('duplicate-row'),
        },
        { label: t('hide_this'), run: () => post('hide-row') },
        {
          label: t('remove_this'),
          danger: true,
          dividerBefore: true,
          cancels: true,
          requiresRemove: true,
          run: () => post('remove-row'),
        },
      ]
    : [
        {
          label: t('add_another'),
          dividerBefore: true,
          // Hidden when the field is at max_rows / max_sets — see menu open.
          requiresAdd: true,
          run: () => post('add-row', sidTemplatePayload(row)),
        },
        {
          label: t('remove_this'),
          danger: true,
          dividerBefore: true,
          cancels: true,
          requiresRemove: true,
          // Taking the last one leaves the block holding an empty list and
          // drawing nothing, so it would sit there with nothing on the page to
          // reach it by. It goes with the row.
          run: () => post('remove-row', { emptyRemovesBlock: blockUid }),
        },
        // …and the block itself, in one go, without emptying it first. Nothing
        // else offers it: the row shadows the block for the whole of its area.
        ...(blockUid
          ? [
              {
                label: blockLabel ? t('remove_block', { name: blockLabel }) : t('remove_block_plain'),
                danger: true,
                dividerBefore: true,
                cancels: true,
                run: () =>
                  win.parent.postMessage(
                    { source: 'statamic-visual-editor', type: 'remove-row', uid: blockUid },
                    win.location.origin
                  ),
              },
            ]
          : []),
      ];

  return {
    row,
    uid,
    peers,
    horizontal,
    block,
    blockUid,
    blockLabel,
    // The visual_edit tag writes the set's display name here (Str::headline of
    // its type), which is exactly what the Control Panel calls the block.
    // Read off the inner element first: where a template wraps the block, the
    // wrapper is the row that moves, but the partial inside is the one carrying
    // the field annotation — and with it the set's name and icon.
    label: inner.getAttribute('data-sid-label') || row.getAttribute('data-sid-label') || '',
    icon: inner.getAttribute('data-sid-icon') || row.getAttribute('data-sid-icon') || '',
    iconSvg: inner.getAttribute('data-sid-icon-svg') || row.getAttribute('data-sid-icon-svg') || '',
    moveActions,
    itemActions,
  };
}

/**
 * The badge standing for the block. The icon the set names in "Edit Set" comes
 * first — it is the one the author chose, and it arrives already drawn. Then a
 * heading set's level, then an icon the toolbar knows by name, then Iconify /
 * pasted SVG from the raw name, and last the name's first letter, which still
 * tells a Headline from a Richtext at a glance.
 *
 * It is also the only thing left of the block's name out here: the bar sits on
 * top of what it names, so the word only said what was already on screen.
 */
function rowBadge(doc, ctx) {
  const badge = doc.createElement('span');
  const heading = /^h([1-6])$/.exec(ctx.icon);

  badge.style.cssText = 'flex:0 0 auto;display:flex;align-items:center;justify-content:center;opacity:.75;';

  if (ctx.iconSvg) {
    badge.innerHTML = ctx.iconSvg;

    const svg = badge.querySelector('svg');

    if (svg) {
      // The icon files carry the Control Panel's own size; the bar sets its own
      // off the text, the same as every other badge here.
      // As style, not as attributes: presentation attributes lose to any rule
      // the page happens to have for `svg`, and the page is not ours.
      svg.style.setProperty('width', '1.15em', 'important');
      svg.style.setProperty('height', '1.15em', 'important');

      return badge;
    }

    badge.innerHTML = '';
  }

  if (ctx.icon && /^\s*<svg[\s>]/i.test(ctx.icon)) {
    badge.innerHTML = ctx.icon;

    const svg = badge.querySelector('svg');

    if (svg) {
      svg.style.setProperty('width', '1.15em', 'important');
      svg.style.setProperty('height', '1.15em', 'important');

      return badge;
    }

    badge.innerHTML = '';
  }

  if (ctx.icon && /^[a-z0-9-]+:[a-z0-9-]+$/i.test(ctx.icon)) {
    adoptBadgeIconify(badge, ctx.icon);

    return badge;
  }

  if (heading) {
    badge.innerHTML = headingIcon(Number(heading[1]));

    return badge;
  }

  // Statamic's icon names don't all match the toolbar's own; the few that mean
  // the same thing are bridged here, and the rest fall through to the letter.
  const known = ICONS[{ link: 'anchor', table: 'table', code: 'code' }[ctx.icon] ?? ctx.icon];

  if (known) {
    badge.innerHTML = known;

    return badge;
  }

  if (!ctx.label) {
    return null;
  }

  // Knocked into a filled tile so it reads as a mark, not as a stray capital
  // sitting in front of the word it was taken from.
  badge.textContent = ctx.label.trim().charAt(0).toUpperCase();
  badge.style.cssText =
    'flex:0 0 auto;display:flex;align-items:center;justify-content:center;' +
    'width:1.45em;height:1.45em;border-radius:0.35em;font-size:0.85em;font-weight:700;' +
    'background:rgba(128,128,128,.28);';

  return badge;
}

/** Iconify SVGs for preview badges — same cache shape as the CP panel icons. */
const badgeIconifyCache = new Map();

function adoptBadgeIconify(badge, name) {
  const apply = (markup) => {
    if (!markup || !badge.isConnected) {
      return;
    }

    badge.innerHTML = markup;

    const svg = badge.querySelector('svg');

    if (!svg) {
      return;
    }

    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.style.setProperty('width', '1.15em', 'important');
    svg.style.setProperty('height', '1.15em', 'important');
    svg.querySelectorAll('[stroke]:not([stroke="none"])').forEach((node) => {
      node.setAttribute('stroke', 'currentColor');
    });
  };

  const cached = badgeIconifyCache.get(name);

  if (typeof cached === 'string') {
    apply(cached);

    return;
  }

  const [prefix, icon] = name.split(':');
  const pending =
    cached ??
    fetch(`https://api.iconify.design/${prefix}/${icon}.svg`)
      .then((res) => (res.ok ? res.text() : ''))
      .then((markup) => {
        badgeIconifyCache.set(name, markup);

        return markup;
      })
      .catch(() => '');

  badgeIconifyCache.set(name, pending);
  pending.then(apply);
}

// --- Wrap-up belt (same shape as the edit toolbar's row chip) -------------------
//
// Nested rows (link buttons) cover their parent block completely. The old
// ↑↓/hide/dup/trash strip is the wrong language — authors already know the
// edit-toolbar belt. This one is that belt, opened on *click* of a Links
// wrap-up (or any block that holds nested orderable rows).

export let hoverBeltEl = null;
let hoverBeltTarget = null;
let hoverBeltReposition = null;

export function hideHoverBelt(win) {
  if (hoverBeltEl) {
    hoverBeltEl.ownerDocument.querySelector('[data-sve-menu]')?.remove();
    hoverBeltEl.remove();
    hoverBeltEl = null;
  }

  if (hoverBeltReposition) {
    win.removeEventListener('scroll', hoverBeltReposition, true);
    win.removeEventListener('resize', hoverBeltReposition);
    hoverBeltReposition = null;
  }

  hoverBeltTarget = null;
}

function positionHoverBelt(win) {
  if (!hoverBeltEl || !hoverBeltTarget || !hoverBeltTarget.isConnected) {
    return;
  }

  const rect = hoverBeltTarget.getBoundingClientRect();
  const barHeight = hoverBeltEl.offsetHeight || 34;
  let top = rect.top - barHeight - 10;

  if (top < 8) {
    top = rect.bottom + 10;
  }

  const maxLeft = win.innerWidth - hoverBeltEl.offsetWidth - 8;

  hoverBeltEl.style.top = `${top}px`;
  hoverBeltEl.style.left = `${Math.max(8, Math.min(rect.left, maxLeft))}px`;
}

export function pointerInHoverBeltGap(event) {
  if (!hoverBeltEl || !hoverBeltTarget) {
    return false;
  }

  if (hoverBeltEl.contains(event.target) || hoverBeltTarget.contains(event.target)) {
    return true;
  }

  const x = event.clientX;
  const y = event.clientY;
  const br = hoverBeltEl.getBoundingClientRect();
  const tr = hoverBeltTarget.getBoundingClientRect();
  const pad = 8;
  const top = Math.min(br.top, tr.top) - pad;
  const bottom = Math.max(br.bottom, tr.bottom) + pad;
  const left = Math.min(br.left, tr.left) - pad;
  const right = Math.max(br.right, tr.right) + pad;

  return x >= left && x <= right && y >= top && y <= bottom;
}

/**
 * The edit-toolbar belt for a row/block, without an edit session — used on hover
 * for wrap-ups (e.g. the Links block) whose children would otherwise steal every
 * pointer event.
 */
export function showHoverBelt(win, rowEl) {
  const ctx = rowContextFor(win, rowEl);

  if (!ctx) {
    hideHoverBelt(win);

    return;
  }

  // Already showing for this row — just keep it positioned.
  if (hoverBeltEl && hoverBeltTarget === ctx.row) {
    positionHoverBelt(win);

    return;
  }

  hideHoverBelt(win);

  const doc = win.document;
  const theme = toolbarThemeFor(detectCpDark(win));
  const SQUARE = 32;
  const pill =
    `display:flex;align-items:center;gap:1px;background:${theme.bg};color:${theme.fg};` +
    `border:1px solid ${theme.border};border-radius:9px;padding:4px;box-shadow:${theme.shadow};` +
    'box-sizing:content-box;margin:0;';

  const bar = doc.createElement('div');

  bar.id = '__sve-hover-belt';
  bar.style.cssText =
    'position:fixed;z-index:2147483646;display:flex;align-items:center;gap:7px;' +
    `color:${theme.fg};font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;` +
    'font-size:13px;line-height:1;user-select:none;cursor:default;';
  bar.addEventListener('mousedown', (e) => e.preventDefault());

  const group = doc.createElement('div');

  group.style.cssText = pill;

  const addButton = (label, title, opts = {}) => {
    const btn = doc.createElement('button');

    btn.type = 'button';

    if (opts.html) {
      btn.innerHTML = opts.html;
    } else {
      btn.textContent = label;
    }

    btn.title = title;
    btn.style.cssText =
      `all:unset;cursor:pointer;min-width:${SQUARE}px;height:${SQUARE}px;display:inline-flex;` +
      'align-items:center;justify-content:center;border-radius:8px;padding:0 6px;' +
      `box-sizing:border-box;text-align:center;color:${theme.fg};`;
    btn.addEventListener('mouseenter', () => {
      btn.style.background = theme.hover;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'transparent';
    });

    if (opts.onPointerDown) {
      btn.style.cursor = 'grab';
      btn.style.touchAction = 'none';
      btn.addEventListener('pointerdown', opts.onPointerDown);
    }

    if (opts.onClick) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        opts.onClick(e);
      });
    }

    group.appendChild(btn);

    return btn;
  };

  const chip = doc.createElement('span');

  chip.style.cssText =
    pill + `flex:0 0 auto;justify-content:center;width:${SQUARE}px;height:${SQUARE}px;` +
    'font-weight:600;white-space:nowrap;';

  const badge = rowBadge(doc, ctx);

  if (badge) {
    chip.appendChild(badge);
  }

  if (ctx.label) {
    chip.title = ctx.label;
  }

  if (chip.childNodes.length) {
    bar.appendChild(chip);
  }

  if (ctx.peers.length > 1) {
    addButton('⠿', t('drag_section'), {
      onPointerDown: (event) => {
        if (event.button !== 0 || bridgeState.dragState) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        const { row, uid, peers, horizontal } = ctx;

        hideHoverBelt(win);

        bridgeState.dragState = {
          el: row,
          uid,
          peers,
          horizontal,
          section: false,
          zoom: null,
          startX: event.clientX,
          startY: event.clientY,
          fromIndex: peers.indexOf(row),
          insert: null,
          active: false,
          indicator: null,
          ghost: null,
        };
      },
    });
  }

  const menuBtn = addButton('', t('more_actions'), {
    html: ICONS.more,
    onClick: () => {
      requestRowCaps(win, ctx.uid).then((caps) => {
        const actions = [...ctx.moveActions, ...ctx.itemActions].filter((action) => {
          if (action.requiresAdd && !caps.canAdd) {
            return false;
          }

          if (action.requiresRemove && !caps.canRemove) {
            return false;
          }

          return true;
        });

        openToolbarMenu(
          win,
          menuBtn,
          `hover-${ctx.uid}`,
          actions.map((action) => ({
            label: action.label,
            danger: action.danger,
            dividerBefore: action.dividerBefore,
            run: () => {
              hideHoverBelt(win);
              action.run();
            },
          }))
        );
      });
    },
  });

  if (group.children.length) {
    bar.appendChild(group);
  }

  if (!bar.children.length) {
    return;
  }

  doc.body.appendChild(bar);
  hoverBeltEl = bar;
  hoverBeltTarget = ctx.row;
  positionHoverBelt(win);

  hoverBeltReposition = () => positionHoverBelt(win);
  win.addEventListener('scroll', hoverBeltReposition, true);
  win.addEventListener('resize', hoverBeltReposition);
}

/**
 * toolbar="true" on a row/set, without inline_edit: the same belt as a wrap-up
 * (icon, drag, more → move / delete), opened on click. A field that asked to be
 * typed into keeps the edit toolbar instead.
 */
export function openRowToolbar(win, el) {
  if (!el.hasAttribute(TOOLBAR_ATTR) || el.hasAttribute('data-sid-inline-edit')) {
    return;
  }

  hideMoveControl(win);
  showHoverBelt(win, el);
}

export function createEditToolbar(win, session) {
  removeEditToolbar();
  hideHoverBelt(win);

  const doc = win.document;
  const bar = doc.createElement('div');

  // Follow the CP's colour scheme so the toolbar matches Statamic's own Bard
  // fixed toolbar in both light and dark mode.
  const theme = toolbarThemeFor(detectCpDark(win));

  bridgeState.toolbarTheme = theme;

  // Two boxes with the page showing between them: the icon naming the block,
  // and the controls acting on it. The bar itself draws nothing and only lines
  // them up, so the gap is the section's own background — which is what says the
  // icon is a different kind of thing rather than the first button on a row.
  //
  // Both boxes are built from the same square: a button is one, and so is the
  // icon. That is what keeps the two the same height and the icon's box a true
  // 1:1 — the sizes were written out twice before, and drifted apart.
  const SQUARE = 32;

  // `box-sizing` and `margin` are spelled out because this is drawn inside the
  // customer's own page: a theme with `* { box-sizing: border-box }` — which is
  // most of them — would otherwise have the icon's fixed square measure its own
  // padding and border from the inside, and come out short of the controls.
  const pill =
    `display:flex;align-items:center;gap:1px;background:${theme.bg};color:${theme.fg};` +
    `border:1px solid ${theme.border};border-radius:9px;padding:4px;box-shadow:${theme.shadow};` +
    'box-sizing:content-box;margin:0;';

  bar.id = '__sve-edit-toolbar';
  bar.style.cssText =
    'position:fixed;z-index:2147483647;display:flex;align-items:center;gap:7px;' +
    `color:${theme.fg};font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;` +
    'font-size:13px;line-height:1;user-select:none;cursor:default;';

  // Everything that is not the icon. Filled first and hung on the bar last, so
  // the icon comes first however much ends up in here.
  const group = doc.createElement('div');

  group.style.cssText = pill;

  // Never steal focus from the editable — otherwise every button click would
  // blur it and commit the edit before the action runs.
  bar.addEventListener('mousedown', (e) => e.preventDefault());

  const addButton = (label, title, action, opts = {}) => {
    const btn = doc.createElement('button');

    btn.type = 'button';

    if (opts.html) {
      btn.innerHTML = opts.html;
    } else {
      btn.textContent = label;
    }

    btn.title = title;

    if (opts.cmd) {
      btn.dataset.sveCmd = opts.cmd;
    }

    if (opts.spanClass) {
      btn.dataset.sveSpanClass = opts.spanClass;
    }

    btn.style.cssText =
      `all:unset;cursor:pointer;min-width:${SQUARE}px;height:${SQUARE}px;display:inline-flex;` +
      'align-items:center;justify-content:center;border-radius:8px;padding:0 6px;' +
      `box-sizing:border-box;text-align:center;color:${theme.fg};` +
      (opts.style || '');

    btn.addEventListener('mouseenter', () => {
      if (!btn.dataset.sveOn) {
        btn.style.background = theme.hover;
      }
    });
    btn.addEventListener('mouseleave', () => {
      if (!btn.dataset.sveOn) {
        btn.style.background = 'transparent';
      }
    });
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      action();
    });

    // A grab handle starts its work on pointerdown, not on click — but it is the
    // same button otherwise, and gets its look from the same place.
    if (opts.onPointerDown) {
      btn.style.cursor = opts.cursor || 'grab';
      btn.style.touchAction = 'none';
      btn.addEventListener('pointerdown', opts.onPointerDown);
    }

    group.appendChild(btn);

    return btn;
  };

  // The bar is built in sections, and each one asks for a rule in front of
  // itself without knowing whether the section before it put anything on the
  // bar. So the rule is refused when there is nothing to divide, or when the
  // last thing added was already one: two rules in a row read as a gap where a
  // section went missing.
  const addSeparator = () => {
    const last = group.lastElementChild;

    if (!last || last.dataset.sveSep) {
      return;
    }

    const sep = doc.createElement('span');

    sep.dataset.sveSep = '1';
    sep.style.cssText = `width:1px;height:18px;background:${theme.sep};margin:0 4px;`;
    group.appendChild(sep);
  };

  // The block this text belongs to, named and handled at the head of the bar —
  // the same shape Gutenberg uses, and the reason the hover control could go.
  // Only where the template asked for a bar. The row around the text may well be
  // orderable — that is what lets the boxes be rearranged — but being movable is
  // not a reason to hang a bar over a field that did not ask for one. The badge,
  // the drag handle and the actions menu all belong to the same answer.
  const rowCtx = session.el.hasAttribute(TOOLBAR_ATTR)
    ? rowContextFor(win, session.el)
    : null;

  if (rowCtx) {
    const chip = doc.createElement('span');

    // The same 26px box the buttons occupy, so the bar keeps its rhythm — but
    // with no hover and nothing to press. That, and the rule set after it, is
    // what says this one is naming the block rather than acting on it.
    // The same square, in the same box: one square plus the pill's own padding
    // and border on each side is the controls' height, and the icon's box comes
    // out 1:1 without either measurement being repeated.
    chip.style.cssText =
      pill + `flex:0 0 auto;justify-content:center;width:${SQUARE}px;height:${SQUARE}px;` +
      'font-weight:600;white-space:nowrap;';

    const badge = rowBadge(doc, rowCtx);

    if (badge) {
      chip.appendChild(badge);
    }

    // The name is the badge's tooltip rather than a word on the bar. The bar
    // stands on the block it names, so the word repeated what was already there
    // — and the room it took is the room the field's own controls wanted.
    if (rowCtx.label) {
      chip.title = rowCtx.label;
    }

    if (chip.childNodes.length) {
      bar.appendChild(chip);
    }

    // Drag handle. The drag machinery refuses to start while a caret is in the
    // page — and the row is about to move out from under it anyway — so the edit
    // is committed first and the existing pointermove/pointerup take it from here.
    if (rowCtx.peers.length > 1) {
      addButton('⠿', t('drag_section'), () => {}, {
        onPointerDown: (event) => {
          if (event.button !== 0 || bridgeState.dragState) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();

          const { row, uid, peers, horizontal } = rowCtx;

          finishEditing(win, false);

          bridgeState.dragState = {
            el: row,
            uid,
            peers,
            horizontal,
            section: false,
            zoom: null,
            startX: event.clientX,
            startY: event.clientY,
            fromIndex: peers.indexOf(row),
            insert: null,
            active: false,
            indicator: null,
            ghost: null,
          };
        },
      });
    }

    // Moving lives in the ⋮ menu alone. As arrows it was the same two commands a
    // second time, next to the menu that already spelled them out, on a bar the
    // field's own controls have to share.
    //
    // Only a divider once there is something to divide: with the arrows gone, a
    // block with no icon, no name and no siblings puts nothing here at all.
    if (group.children.length) {
      addSeparator();
    }
  }

  const markActive = (btn) => {
    btn.dataset.sveOn = '1';
    btn.style.background = theme.active;
  };

  /**
   * One sibling-field control. The fieldtype decides the shape, and nothing
   * else: button_group and radio render as a segmented row, select as a
   * dropdown — the same two shapes they have in the Control Panel.
   *
   * The count used to decide it too (buttons up to three options, a dropdown
   * beyond), which meant a four-option button_group silently became a dropdown
   * and the toolbar disagreed with the panel beside it about what the field is.
   * A bar that grows a little is the smaller price.
   */
  const addControl = (control) => {
    const current = control.value == null ? '' : String(control.value);

    if (control.type === 'theme_color_picker' || control.type === 'color') {
      const btn = addButton('', control.display || 'Farve', () => {}, { html: ICONS.color });

      if (current) {
        btn.style.boxShadow = `inset 0 -3px 0 ${current}`;
      }

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openHighlightColorMenu(win, btn, control, session, (value) => {
          applyHighlightColor(win, session, control, value);
        });
      });

      return;
    }

    if (control.type === 'toggle') {
      const on = control.value === true || current === '1' || current === 'true';
      const btn = addButton(control.display, control.display, () => applyControlValue(win, session, control, !on), {
        style: 'padding:0 10px;font-size:12px;font-weight:600;',
      });

      if (on) {
        markActive(btn);
      }

      return;
    }

    const options = control.options || [];

    if (control.type !== 'select' && options.length) {
      options.forEach((option) => {
        const btn = addButton(
          option.label,
          `${control.display}: ${option.label}`,
          () => applyControlValue(win, session, control, option.key),
          { style: 'padding:0 8px;font-size:12px;font-weight:600;' }
        );

        if (option.key === current) {
          markActive(btn);
        }
      });

      return;
    }

    // Closed button shows the field title ("Size") while the value is empty or
    // still the blueprint default — not "Small" just because that is the default.
    // After the author picks a non-default option, show that option's label.
    const defaultKey = control.default != null && control.default !== '' ? String(control.default) : '';
    const isChosen = current !== '' && current !== defaultKey;
    const selected = isChosen ? options.find((option) => option.key === current) : null;
    const btn = addButton(
      `${selected ? selected.label : control.display} ▾`,
      selected ? `${control.display}: ${selected.label}` : control.display,
      () => {},
      { style: 'padding:0 10px;font-size:12px;gap:4px;' }
    );

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openControlMenu(win, btn, control, (value) => applyControlValue(win, session, control, value));
    });
  };

  // Sibling-field controls (controls="font_tag|size") before Bard tools like
  // colour — tag/size are the block’s own settings and should lead the bar.
  if (session.controls?.length) {
    if (group.children.length) {
      addSeparator();
    }

    session.controls.forEach(addControl);
  }

  const exec = (command, value = null) => {
    win.document.execCommand(command, false, value);
    session.dirty = true;
    clearTimeout(session.inputTimer);
    session.inputTimer = null;
    sendEditInput(win, session);
    updateEditToolbarState(win);
  };

  const addBlockButton = (label, title, spec, opts = {}) => {
    const btn = addButton(label, title, () => applyBlockFormat(win, session, spec), opts);

    btn.dataset.sveBlockTag = spec.tag;
    btn.dataset.sveBlockClass = spec.className || '';

    return btn;
  };

  if (session.mode === 'bard' || session.mode === 'bard-field') {
    // Build the toolbar from the field's own `buttons` config (passed through
    // as session.bardButtons) — never a hardcoded set. Each button name is
    // rendered by its handler below; unknown names are skipped. Buttons that
    // inline editing can't perform in place (lists, quote, color) fall back to
    // opening the CP panel focused on this field.
    const buttons = session.bardButtons?.length
      ? session.bardButtons
      : ['bold', 'italic', 'anchor', 'removeformat'];
    const styles = session.bardStyles || {};

    // Rendered in the field's own `buttons` order, no separators — mirroring
    // Statamic's own toolbar exactly. Each name maps to the real Bard icon.
    for (const name of buttons) {
      if (/^h[1-6]$/.test(name)) {
        const level = Number(name.slice(1));

        addBlockButton('', `Heading ${level}`, { tag: name, node: 'heading', level }, {
          html: headingIcon(level),
        });
        continue;
      }

      const style = styles[name];

      if (style?.kind === 'group' && Array.isArray(style.items)) {
        // Dropdown group from bard_styles.php (sizes, flow spacing, …).
        const groupBtn = addButton('', style.name || name, () => {}, {
          html: styleIdentHtml(style.ident, (style.name || name)[0]),
        });

        groupBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          const existing = doc.querySelector('[data-sve-bard-style-menu]');

          if (existing) {
            existing.remove();

            if (existing.dataset.for === name) {
              return;
            }
          }

          const menu = doc.createElement('div');

          menu.dataset.sveBardStyleMenu = '';
          menu.dataset.for = name;
          menu.style.cssText =
            'position:fixed;z-index:2147483647;min-width:160px;padding:4px;' +
            'background:#1a1f2e;border:1px solid rgba(255,255,255,.12);border-radius:8px;' +
            'box-shadow:0 8px 24px rgba(0,0,0,.5);';

          style.items.forEach((item) => {
            const row = doc.createElement('button');

            row.type = 'button';
            row.style.cssText =
              'display:flex;align-items:center;gap:8px;width:100%;padding:5px 10px;border:none;' +
              'cursor:pointer;text-align:left;background:transparent;border-radius:4px;color:#e2e8f0;';
            row.innerHTML =
              `<span style="min-width:22px;font-size:11px;opacity:.8">${item.ident && !String(item.ident).startsWith('<') ? item.ident : '·'}</span>` +
              `<span style="font-size:12px;flex:1">${item.name || item.handle || ''}</span>`;
            row.addEventListener('mouseenter', () => {
              row.style.background = 'rgba(255,255,255,.07)';
            });
            row.addEventListener('mouseleave', () => {
              row.style.background = 'transparent';
            });
            row.addEventListener('mousedown', (ev) => ev.preventDefault());
            row.addEventListener('click', (ev) => {
              ev.preventDefault();
              applyVizuStyle(win, session, item);
              menu.remove();
            });
            menu.appendChild(row);
          });

          const r = groupBtn.getBoundingClientRect();

          menu.style.left = `${Math.max(4, Math.min(r.left, win.innerWidth - 180))}px`;
          menu.style.top = `${r.bottom + 4}px`;
          doc.body.appendChild(menu);

          const close = (ev) => {
            if (menu.contains(ev.target) || groupBtn.contains(ev.target)) {
              return;
            }

            menu.remove();
            doc.removeEventListener('mousedown', close, true);
          };

          setTimeout(() => doc.addEventListener('mousedown', close, true), 0);
        });

        continue;
      }

      if (style?.kind === 'vizu') {
        addButton('', style.name || name, () => applyVizuStyle(win, session, style), {
          html: styleIdentHtml(style.ident, (style.name || name)[0]),
        });
        continue;
      }

      if (style) {
        // bard-texstyle: the icon is the style's letter (matching bts-icon-letter).
        if (style.type === 'span') {
          addButton('', style.name || name, () => toggleSpanClass(win, session, style.class), {
            spanClass: style.class,
            html: letterIcon(style.ident || (style.name || name)),
          });
        } else {
          const tag = style.type === 'heading' ? `h${style.level || 2}` : 'p';

          addBlockButton('', style.name || name, {
            tag,
            node: style.type === 'heading' ? 'heading' : 'paragraph',
            level: style.level,
            className: style.class,
          }, { html: letterIcon(style.ident || (style.name || name)) });
        }

        continue;
      }

      switch (name) {
        case 'bold':
          addButton('', 'Bold (⌘B)', () => exec('bold'), { cmd: 'bold', html: ICONS.bold });
          break;
        case 'italic':
          addButton('', 'Italic (⌘I)', () => exec('italic'), { cmd: 'italic', html: ICONS.italic });
          break;
        case 'underline':
          addButton('', 'Underline (⌘U)', () => exec('underline'), { cmd: 'underline', html: ICONS.underline });
          break;
        case 'strikethrough':
          addButton('', 'Strikethrough', () => exec('strikethrough'), {
            cmd: 'strikethrough',
            html: ICONS.strikethrough,
          });
          break;
        case 'anchor':
          // Uses Statamic's own link dialog (opened for the selection).
          addButton('', 'Link', () => bardCommand(win, session, 'link'), { html: ICONS.anchor });
          break;
        case 'removeformat':
          addButton('', 'Remove Formatting', () => {
            exec('removeFormat');
            exec('unlink');
          }, { html: ICONS.removeformat });
          break;
        case 'color': {
          // In-preview theme swatches — keep the edit session open. The old
          // bardCommand path finished editing and tried to click the CP Bard
          // colour button, which fails with floating toolbars (nothing opens).
          const colorBtn = addButton('', 'Tekstfarve', () => {}, { html: ICONS.color });
          const activeColor = readSelectionVizuProp(win, session, 'color');

          if (activeColor) {
            colorBtn.style.boxShadow = `inset 0 -3px 0 ${activeColor}`;
          }

          colorBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openHighlightColorMenu(
              win,
              colorBtn,
              { handle: '__bard_color__', value: readSelectionVizuProp(win, session, 'color') },
              session,
              (value) => {
                if (value == null || value === '') {
                  clearVizuSpanProp(win, session, 'color');
                } else {
                  setVizuSpanProp(win, session, 'color', value);
                }
              }
            );
          });
          break;
        }
        case 'quote':
        case 'unorderedlist':
        case 'orderedlist':
        case 'code':
        case 'codeblock':
        case 'table': {
          // Block-structure tools performed via Statamic's own editor command.
          const titles = {
            quote: 'Blockquote',
            unorderedlist: 'Unordered List',
            orderedlist: 'Ordered List',
            code: 'Code',
            codeblock: 'Code Block',
            table: 'Table',
          };

          addButton('', titles[name], () => bardCommand(win, session, name), { html: ICONS[name] });
          break;
        }
        default:
          // Unknown button name — skip silently.
          break;
      }
    }
  }

  // String fields belonging to a row that also has a link/url value (e.g.
  // button rows): shortcut to edit the link in the CP panel. The link-edit
  // message must be posted BEFORE finishEditing so the CP still has the edit
  // session (and its resolved link path) when the message arrives.
  if (session.hasLink) {
    addButton('', 'Skift link', () => {
      win.parent.postMessage(
        { source: 'statamic-visual-editor', type: 'link-edit', requestId: session.requestId },
        win.location.origin
      );
      finishEditing(win, false);
    }, { html: ICONS.anchor });
  }

  // Everything that can be done to the block, behind one button at the far end —
  // away from the drag handle, so nothing destructive sits under a pointer that
  // was reaching for a move. Written out in words, moving included: a menu has
  // room to say what an arrow could only hint at.
  if (rowCtx && (rowCtx.moveActions.length || rowCtx.itemActions.length)) {
    addSeparator();

    const menuBtn = addButton('', t('more_actions'), () => {}, { html: ICONS.more });

    menuBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      // Honour max_rows / min_rows before the menu appears — otherwise
      // "Add another" stays clickable on a field that's already full.
      requestRowCaps(win, rowCtx.uid).then((caps) => {
        const actions = [...rowCtx.moveActions, ...rowCtx.itemActions].filter((action) => {
          if (action.requiresAdd && !caps.canAdd) {
            return false;
          }

          if (action.requiresRemove && !caps.canRemove) {
            return false;
          }

          return true;
        });

        const items = actions.map((action) => ({
          label: action.label,
          danger: action.danger,
          dividerBefore: action.dividerBefore,
          run: () => {
            // The session ends before the row changes: the paths shift with it, and
            // a deferred edit-input landing afterwards would write into whatever
            // took its place. Removing cancels — there is nothing left to commit to.
            finishEditing(win, !!action.cancels);
            action.run();
          },
        }));

        openToolbarMenu(win, menuBtn, `row-${rowCtx.uid}`, items);
      });
    });
  }

  // Commit/cancel live on Enter (inline Bard), Esc, and click-outside — the
  // green ✓ / red ✕ only cluttered the bar and nobody used them.
  if (group.children.length) {
    bar.appendChild(group);
  }

  // Nothing to show — an empty toolbar is just a box hovering over the text.
  if (!bar.children.length) {
    return;
  }

  doc.body.appendChild(bar);
  bridgeState.toolbarEl = bar;
  positionEditToolbar(win, session);
  updateEditToolbarState(win);
}

// --- Move arrows -----------------------------------------------------------------
// Hovering a page section (or any element annotated with move="true") shows a
// small arrow control. Clicking sends a move message; the CP swaps the two
// items in the containing array (page_sections, grid/repeater rows, …) and
// Statamic's reactivity re-renders both the publish form and the preview.
// Rows laid out horizontally (flex-row parents) get ←/→ instead of ↑/↓.

// --- Global (synced) sections ---------------------------------------------------
//
// A global section renders the SOURCE entry's markup, so its content isn't part of
// this page's form and can't be edited here — it belongs to another entry. The
// template leaves a hidden marker in front of it; we tag the section itself so it
// can be badged, focused (the rest of the page fades back, so you always know you
// are inside a synced section) and handed off to its own editor.

export const GLOBAL_ATTR = 'data-sve-global';
// The page's own page_sections row id for a global section (see the partial).
export const GLOBAL_ROW_ATTR = 'data-sve-global-row';

/** The display:contents wrapper a global section's rendered sections live in. */
export const GLOBAL_ROOT_ATTR = 'data-sve-global-root';

/**
 * A peer's box, even when it has none of its own.
 *
 * A global section is wrapped in display:contents so it adds no layout box —
 * measuring it gives zeros, and a drop beside it landed in the wrong place.
 * What it renders does have a box, so measure that instead.
 */
export function peerRect(el) {
  const rect = el.getBoundingClientRect();

  if (rect.width || rect.height) {
    return rect;
  }

  const first = el.firstElementChild;

  if (!first) {
    return rect;
  }

  const a = first.getBoundingClientRect();
  const b = (el.lastElementChild ?? first).getBoundingClientRect();
  const left = Math.min(a.left, b.left);
  const top = Math.min(a.top, b.top);

  return new DOMRect(left, top, Math.max(a.right, b.right) - left, Math.max(a.bottom, b.bottom) - top);
}
export const GLOBAL_FOCUS_ATTR = 'data-sve-global-focused';
export const GLOBAL_BAR_ID = '__sve-global-bar';
