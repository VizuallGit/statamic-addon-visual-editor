/**
 * A callback for every element a selector names that the page gains while the
 * watch stands.
 *
 * Alpine draws some of the page after the bridge has looked at it: a dialog's
 * body is copied in from a `<template>` on the microtask after `open` turns
 * true, an `x-for` row on the flush after its list changes. Whatever marked
 * the page a moment earlier never saw those nodes. The observer reports them
 * as they land — no timer guesses at when Alpine is done.
 *
 * Only element nodes count, and only those that are the match or hold one;
 * text nodes and markup elsewhere on the page are not reported. The return
 * value ends the watch.
 */
export function watchAddedMatches(win, selector, onHit) {
  const observer = new win.MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType === 1 && holdsMatch(node, selector)) {
          onHit();

          return;
        }
      }
    }
  });

  observer.observe(win.document.body, { childList: true, subtree: true });

  return () => observer.disconnect();
}

function holdsMatch(el, selector) {
  try {
    return el.matches(selector) || !!el.querySelector(selector);
  } catch {
    // A selector the browser will not take names nothing.
    return false;
  }
}
