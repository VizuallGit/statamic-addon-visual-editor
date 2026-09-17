/**
 * Where a dock lives in the Live Preview page.
 *
 * Docks (code, right sidebar) are children of Statamic's `.live-preview`
 * element so they share its stacking context; before Live Preview has mounted
 * they wait in `<body>`. `attachDock` moves a dock only when its parent is
 * wrong, so reattaching is free and never re-triggers mount effects.
 *
 * May import: nothing.
 */
export function dockParent(doc) {
  return doc.querySelector('.live-preview') || doc.body;
}

export function attachDock(doc, dock) {
  const parent = dockParent(doc);

  if (dock.parentElement !== parent) {
    parent.appendChild(dock);
  }
}
