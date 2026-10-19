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
 */
const BRIDGE_MARK = 'data-sve-component-';

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
  },
};
