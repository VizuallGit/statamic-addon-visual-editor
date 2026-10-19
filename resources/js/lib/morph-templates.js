/**
 * Options for every Alpine.morph the preview does.
 *
 * Alpine.morph walks an element's child nodes, and a `<template>` has none:
 * its markup lives in `.content`. A morph therefore never changed what a
 * template holds, and anything the page builds from one — a dialog Alpine
 * fills with `template.innerHTML`, an `x-for` row — kept the markup the page
 * loaded with until a reload. Cuben's company list (18 Oct 2026): a tag or a
 * class typed in the dialog's component never reached the open dialog.
 *
 * Each template takes the server's markup as it stands, and only when it
 * differs: an unchanged template is left as the same nodes.
 */
export const MORPH_OPTIONS = {
  updating(el, toEl) {
    if (el.nodeName === 'TEMPLATE' && toEl.nodeName === 'TEMPLATE' && el.innerHTML !== toEl.innerHTML) {
      el.innerHTML = toEl.innerHTML;
    }
  },
};
