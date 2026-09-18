/**
 * bridge.js — region "inserters", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel bridge.js for what the shell exports.
 */
import { bridgeState } from '../bridge/state.js';
import { INSERT_AFTER_GAP, INSERT_ATTR, INSERT_LAYER_ID, initBridge } from './outline-nav.js';
import { GLOBAL_ATTR, GLOBAL_FOCUS_ATTR } from './row-toolbar.js';
import { SID_ATTR, SID_FIELD_ATTR } from '../bridge.js';
import { GRID_ATTR, ORDERABLE_ATTR } from './grid.js';
import { MSG, SOURCE } from '../lib/protocol.js';

// ===== inserters =====
function collectSidFieldDefaults(root) {
  const out = {};

  if (!root?.querySelectorAll) {
    return out;
  }

  root.querySelectorAll('[data-sid-field][data-sid-default]').forEach((el) => {
    const field = el.getAttribute('data-sid-field');
    const value = el.getAttribute('data-sid-default');

    if (field && value != null && value !== '') {
      out[field] = value;
    }
  });

  return out;
}

export function sidTemplatePayload(el) {
  const container = el?.hasAttribute?.(INSERT_ATTR) ? el : el?.closest?.(`[${INSERT_ATTR}]`);
  const row = el?.closest?.('[data-sid-orderable]');
  const containerTemplate =
    container?.getAttribute('data-sid-template') || el?.getAttribute?.('data-sid-template') || '';
  const rowTemplate =
    row?.getAttribute('data-sid-template') ||
    container?.getAttribute('data-sid-row-template') ||
    '';
  const fieldDefaults = collectSidFieldDefaults(container || el);
  const extra = {};

  if (container?.getAttribute(INSERT_ATTR)) {
    extra.field = container.getAttribute(INSERT_ATTR);
  }

  // A click on an existing row uses that row's template (`icon|title` on the
  // <li>). The container's `3:item` is only for seeding a new list.
  extra.template = rowTemplate || containerTemplate;
  extra.rowTemplate = rowTemplate;
  extra.containerTemplate = containerTemplate;

  if (Object.keys(fieldDefaults).length) {
    extra.fieldDefaults = fieldDefaults;
  }

  return extra;
}

/**
 * Is this global section the one being edited?
 *
 * A morph can strip the focus attribute, so the id we are focused on counts too
 * — the same recovery the click handler does.
 */
function isGlobalFocused(section) {
  return (
    section.hasAttribute(GLOBAL_FOCUS_ATTR) ||
    (!!bridgeState.globalFocusId && bridgeState.globalFocusId === section.getAttribute(GLOBAL_ATTR))
  );
}

function ensureInserterLayer(win) {
  let layer = win.document.getElementById(INSERT_LAYER_ID);

  if (!layer) {
    layer = win.document.createElement('div');
    layer.id = INSERT_LAYER_ID;
    layer.style.cssText = 'position:fixed;inset:0;z-index:2147482400;pointer-events:none;';
    win.document.body.appendChild(layer);
  }

  return layer;
}

/**
 * One "+" after the last block (or in an empty container), shown while the
 * insertable container — or the "+" itself — is hovered.
 */
export function setupInserters(win) {
  const layer = ensureInserterLayer(win);

  layer.innerHTML = '';
  bridgeState.inserterInstances = [];

  win.document.querySelectorAll(`[${INSERT_ATTR}]`).forEach((container) => {
    if (!container.getAttribute('data-sid-row-template')) {
      const row = [...container.querySelectorAll('[data-sid-orderable][data-sid-template]')].find(
        (el) => el !== container
      );

      if (row?.getAttribute('data-sid-template')) {
        container.setAttribute('data-sid-row-template', row.getAttribute('data-sid-template'));
      }
    }

    // Bard whole-field (inline_edit): uses its own empty-paragraph "+" / SetPicker,
    // not the Style 2 replicator inserter strip.
    if (
      container.hasAttribute('data-sid-inline-edit') ||
      container.hasAttribute('data-sid-bard-sets')
    ) {
      return;
    }

    // Inside a global section you have not stepped into: its blocks belong to
    // the synced source, not to this page, and the "+" would offer to add one
    // to a field the page cannot edit. Worse, the inserter draws in an overlay
    // layer outside the section, so clicking it reads as a click outside the
    // global section and asks you to leave it. Entering the section calls this
    // again, and the "+" appears then.
    const globalSection = container.closest(`[${GLOBAL_ATTR}]`);

    if (globalSection && !isGlobalFocused(globalSection)) {
      return;
    }

    let sets = [];

    try {
      sets = JSON.parse(container.getAttribute('data-sid-insert-sets') || '[]');
    } catch {
      sets = [];
    }

    if (!sets.length) {
      return;
    }

    const field = container.getAttribute(INSERT_ATTR);
    const scope = container.getAttribute('data-sid-insert-scope');

    // A block is a direct child of the insertable container, annotated three
    // ways: as a set (data-sid), as an orderable row, or as the field it edits
    // (data-sid-field). Headline/richtext put orderable on themselves so a
    // wrapper is not needed (a wrapper breaks the parent's `> * + *` / flow-y).
    // A links wrapper is only data-sid-field — the buttons inside are the
    // orderable rows. Counting SID/orderable alone skipped that last block, so
    // the "+" sat on the richtext. Only direct children, never nested fields.
    const blocks = [...container.children].filter(
      (child) =>
        child.hasAttribute(SID_ATTR) ||
        child.hasAttribute(ORDERABLE_ATTR) ||
        child.hasAttribute(SID_FIELD_ATTR)
    );

    // A field that is full has nothing to offer. The Control Panel greys out its
    // Add Set button at `max_sets`; this "+" is the addon's own control, so it
    // has to be told — otherwise the preview invites an insert the form refuses.
    const max = Number(container.getAttribute('data-sid-insert-max'));

    if (Number.isFinite(max) && max > 0 && blocks.length >= max) {
      return;
    }

    if (!blocks.length) {
      const inst = buildInserter(win, { field, sets, scope, container, empty: true });

      inst.el.style.opacity = '1';
      layer.appendChild(inst.el);
      bridgeState.inserterInstances.push(inst);

      return;
    }

    // Orientation from the blocks themselves: two blocks that differ more in x
    // than in y sit side by side (→ a vertical divider), else stacked.
    let horizontal = false;

    if (blocks.length >= 2) {
      const a = blocks[0].getBoundingClientRect();
      const b2 = blocks[1].getBoundingClientRect();

      horizontal = Math.abs(b2.left - a.left) > Math.abs(b2.top - a.top);
    } else {
      // One block left and nothing to measure against — ask the container how it
      // lays its children out. It matters: a two-column section down to its last
      // block would otherwise offer a full-width bar under the text, which reads
      // as the inserter of whatever replicator is *inside* that block rather than
      // as the way to put the second column back.
      const style = win.getComputedStyle(container);
      const display = style.display;

      if (display === 'flex' || display === 'inline-flex') {
        horizontal = style.flexDirection.startsWith('row');
      } else if (display === 'grid' || display === 'inline-grid') {
        horizontal =
          style.gridAutoFlow.startsWith('column') ||
          style.gridTemplateColumns.split(' ').filter(Boolean).length > 1;
      }
    }

    const lastBlock = blocks[blocks.length - 1];
    const inst = buildInserter(win, {
      field,
      sets,
      block: lastBlock,
      position: 'after',
      horizontal,
      scope,
      container,
    });

    layer.appendChild(inst.el);
    bridgeState.inserterInstances.push(inst);

    let hideTimer = null;
    const show = () => {
      clearTimeout(hideTimer);
      inst.el.style.opacity = '1';
    };
    const hide = () => {
      hideTimer = win.setTimeout(() => {
        inst.el.style.opacity = '0';
      }, 120);
    };

    // Hover the whole insertable area (not each block) so one "+" appears
    // after the last block whenever the section content is hovered.
    container.addEventListener('pointerenter', show);
    container.addEventListener('pointerleave', hide);
    inst.el.addEventListener('pointerenter', show);
    inst.el.addEventListener('pointerleave', hide);
  });

  repositionInserters(win);
}

export function repositionInserters(win) {
  bridgeState.inserterInstances.forEach((inst) => positionInserter(win, inst));
}

function contentColumnRect(inst) {
  const kids = [...(inst.container?.children || [])].filter(
    (child) =>
      child.hasAttribute(SID_ATTR) ||
      child.hasAttribute(ORDERABLE_ATTR) ||
      child.hasAttribute(SID_FIELD_ATTR)
  );
  const fallback = inst.block.getBoundingClientRect();

  if (!kids.length) {
    return { left: fallback.left, width: fallback.width };
  }

  let left = Infinity;
  let right = -Infinity;

  kids.forEach((child) => {
    const box = child.getBoundingClientRect();

    left = Math.min(left, box.left);
    right = Math.max(right, box.right);
  });

  return { left, width: right - left };
}

function positionInserter(win, inst) {
  const el = inst.el;
  const line = el.__line;

  if (inst.empty) {
    const r = inst.container.getBoundingClientRect();

    el.style.left = `${r.left}px`;
    el.style.top = `${r.top + 6}px`;
    el.style.width = `${r.width}px`;
    el.style.height = '30px';
    el.style.flexDirection = 'row';
    line.style.cssText = 'height:2px;flex:1;background:rgba(99,102,241,.45);';

    return;
  }

  const r = inst.block.getBoundingClientRect();

  if (inst.horizontal) {
    el.style.left = `${r.right - 15}px`;
    el.style.top = `${r.top}px`;
    el.style.width = '30px';
    el.style.height = `${r.height}px`;
    el.style.flexDirection = 'column';
    line.style.cssText = 'width:2px;flex:1;background:rgba(99,102,241,.55);';

    // In a grid_view section the resize handle sits on this very edge, centred.
    // Two controls in one spot means one of them cannot be used, so the "+"
    // moves to the foot of the strip — the far end of the same line, still
    // plainly "add one after this".
    if (el.__btn) {
      const shared = inst.container.hasAttribute(GRID_ATTR);

      el.__btn.style.top = shared ? 'auto' : '';
      el.__btn.style.bottom = shared ? '0' : '';
    }
  } else {
    // Width of the blocks in the column (headline, text, links) — not the
    // insertable container. That box is often the whole section: a hero image
    // is `absolute`, so the container still stretches under it to the viewport.
    const col = contentColumnRect(inst);

    el.style.left = `${col.left}px`;
    el.style.top = `${r.bottom + INSERT_AFTER_GAP}px`;
    el.style.width = `${col.width}px`;
    el.style.height = '30px';
    el.style.flexDirection = 'row';
    line.style.cssText = 'height:2px;flex:1;background:rgba(99,102,241,.55);';

    if (el.__btn) {
      el.__btn.style.top = '';
      el.__btn.style.bottom = '';
    }
  }
}

function buildInserter(win, opts) {
  const doc = win.document;
  const wrap = doc.createElement('div');

  wrap.style.cssText =
    'position:fixed;pointer-events:none;display:flex;align-items:center;justify-content:center;' +
    'opacity:0;transition:opacity .1s;';

  const line = doc.createElement('div');
  const btn = doc.createElement('button');

  btn.type = 'button';
  btn.textContent = '+';
  btn.style.cssText =
    'pointer-events:auto;position:absolute;width:26px;height:26px;border:none;border-radius:7px;cursor:pointer;' +
    'background:#18181b;color:#fff;font-size:17px;line-height:1;display:flex;align-items:center;justify-content:center;' +
    'box-shadow:0 2px 8px rgba(0,0,0,.3);';
  btn.addEventListener('mouseenter', () => (btn.style.background = 'var(--theme-color-primary,#4f46e5)'));
  btn.addEventListener('mouseleave', () => (btn.style.background = '#18181b'));
  btn.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    // Hand off to Statamic's own Add Set picker (opened in the CP), rather than a
    // little popover of our own — native search, groups, previews, and insert.
    // Pass the + button's rect so the CP can pin the picker under it in the
    // preview (instead of leaving it in the sidebar).
    const r = btn.getBoundingClientRect();
    const inGlobal = !!opts.container?.closest?.(`[${GLOBAL_FOCUS_ATTR}]`);

    const send = (extra = {}) =>
      win.parent.postMessage(
        {
          source: SOURCE,
          type: MSG.ADD_BLOCK_NATIVE,
          anchorUid: opts.block
            ? opts.block.getAttribute(SID_ATTR) || opts.block.getAttribute('data-sid-field-uid')
            : null,
          sectionUid: opts.scope || null,
          // A global section's fields are not in the page's form — they live in
          // the panel docked beside the preview. The CP needs to know which form
          // to work in, and only we can see where the "+" is sitting.
          global: inGlobal,
          position: opts.position || null,
          anchorRect: {
            left: r.left,
            top: r.top,
            bottom: r.bottom,
            right: r.right,
            width: r.width,
            height: r.height,
          },
          ...extra,
          ...sidTemplatePayload(opts.container),
        },
        win.location.origin
      );

    // In a global section the CP opens Statamic's picker itself, over the
    // preview, because the section's own form is in the panel and its picker
    // would appear over there. It needs the list to do that.
    send({ sets: opts.sets || [] });
  });

  wrap.appendChild(line);
  wrap.appendChild(btn);
  wrap.__line = line;
  wrap.__btn = btn;

  return { el: wrap, ...opts };
}
