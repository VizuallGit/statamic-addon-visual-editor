/**
 * Options for every Alpine.morph the preview does. Two things the server's
 * markup cannot know about the live page, and the morph must not undo.
 *
 * Templates. Alpine.morph walks an element's child nodes, and a `<template>`
 * has none: its markup lives in `.content`. A morph therefore never changed
 * what a template holds, and anything the page builds from one — a dialog
 * Alpine fills with `template.innerHTML`, an `x-for` row — kept the markup the
 * page loaded with until a reload. Cuben's company list (18 Oct 2026): a tag
 * or a class typed in the dialog's component never reached the open dialog.
 * Each template takes the server's markup as it stands, and only when it
 * differs: an unchanged template is left as the same nodes.
 *
 * The bridge's component marks. `data-sve-component-*` is written by the
 * bridge onto the live page — which places the open component renders, and
 * what fades around them. The server never renders those, so the morph took
 * them off every node. The fade is a 0.2 s transition; the page stood at full
 * opacity for the style pass a dialog's `showModal()` forces, and faded back
 * down on every save (19 Oct 2026). A mark the live node carries stays on it;
 * the bridge, not the morph, decides when a mark goes.
 *
 * An x-show that comes or goes. Before Alpine.morph compares two nodes'
 * attributes it runs the server node's own directives (Alpine.cloneNode), so
 * an `x-show` there is evaluated, and `_x_isShown` is left on the node. The
 * comparison then opens with a guard for an element mid-toggle: if one side
 * is shown and the other is not, it leaves every attribute as it is. A node
 * that has no x-show has no `_x_isShown` at all, and the guard reads that as
 * hidden. So an element that gains `x-show` in a render, with a value that
 * is true, gets none of its new attributes; one whose x-show evaluates false
 * gets them all. Build's Tabs (4 Nov 2026): panel 1 came through Live
 * Preview as the bare `<p>` it had been, panel 2 with `x-show`, `role` and
 * `x-cloak` — and Alpine, never having seen panel 1's directive, could not
 * hide it. The other way round is the same guard: an element that is shown
 * and loses its x-show keeps every stale attribute, and Alpine leaves
 * `_x_isShown` behind when a directive goes, so the node stays frozen for
 * every later morph as well.
 *
 * The shown-state the guard compares is made equal on both sides before the
 * comparison, and the real change is made to the live node after it. An
 * x-show the element gains is held off the server node while the attributes
 * go across, and set on the live node in `updated`; the page's own Alpine
 * initialises it as it does any directive that appears on a live element.
 * An x-show the element loses: the server node takes the live node's
 * shown-state for the comparison, so the attribute comes off with the rest,
 * and the state is cleared from the live node once the attribute is gone.
 * The morph's own attribute diff runs in every case; nothing is diffed here.
 *
 * The order Alpine meets the morph's changes in (`morph`, below). Alpine
 * learns of an attribute a live element gains from its MutationObserver,
 * and runs the directive then: an `x-data` makes the element's scope, an
 * `x-show` or `:aria-selected` below it binds to the nearest scope as it
 * stands — and keeps that binding; one bound before its scope exists throws
 * on every read and never binds again. The observer hands Alpine the
 * changes in the order they were made, so a morph that writes the parent's
 * `x-data` before the children's bindings would be fine — except that it
 * also runs the server nodes' own directives (Alpine.cloneNode), and each
 * `x-bind` there flushes the observer (Alpine.mutateDom): the changes made
 * so far are taken out of the observer and queued for later, and the
 * changes made after the last such flush stay in the observer, whose own
 * delivery runs first. So the end of the morph was handled before its
 * start: a tabs panel's `x-show` and its tab's `@click` before the
 * `x-data` above them (Build's Tabs, 4 Nov 2026 — the second tab never
 * switched, and the panels stayed hidden). A flush of our own, once the
 * morph is done, takes the rest of its changes into the same queue, behind
 * the earlier ones; Alpine then meets the whole morph in document order.
 * An empty `mutateDom` is that flush, and nothing else.
 */
const BRIDGE_MARK = 'data-sve-component-';
const SHOW_DIRECTIVE = /^x-show(\.|$)/;

/** Server node → the x-show attributes held off it while its attributes go across. */
const heldShow = new WeakMap();

function showAttributes(el) {
  return [...el.attributes].filter(({ name }) => SHOW_DIRECTIVE.test(name));
}

export const MORPH_OPTIONS = {
  updating(el, toEl) {
    // Text and comment nodes come through here too; they have nothing of either.
    if (el.nodeType !== 1 || toEl.nodeType !== 1) {
      return;
    }

    if (el.nodeName === 'TEMPLATE' && toEl.nodeName === 'TEMPLATE' && el.innerHTML !== toEl.innerHTML) {
      el.innerHTML = toEl.innerHTML;
    }

    for (const { name, value } of el.attributes) {
      if (name.startsWith(BRIDGE_MARK) && !toEl.hasAttribute(name)) {
        toEl.setAttribute(name, value);
      }
    }

    const toShow = showAttributes(toEl);

    if (toShow.length) {
      if (!showAttributes(el).length) {
        heldShow.set(toEl, toShow.map(({ name, value }) => ({ name, value })));
        toShow.forEach(({ name }) => toEl.removeAttribute(name));
      }
    } else if (el._x_isShown !== undefined) {
      toEl._x_isShown = el._x_isShown;
    }
  },

  updated(el, toEl) {
    if (el.nodeType !== 1 || toEl.nodeType !== 1) {
      return;
    }

    const held = heldShow.get(toEl);

    if (held) {
      heldShow.delete(toEl);
      held.forEach(({ name, value }) => el.setAttribute(name, value));
    } else if (el._x_isShown !== undefined && !showAttributes(el).length) {
      delete el._x_isShown;
    }
  },
};

/**
 * Alpine.morph with these options, and the rest of the morph's changes handed
 * to Alpine in order (see above). `to` is a string or a same-document element.
 */
export function morph(alpine, from, to) {
  alpine.morph(from, to, MORPH_OPTIONS);
  alpine.mutateDom(() => {});
}
