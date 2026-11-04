(() => {
  const COPY = 'data-anim-copy';
  const WATCH = 'data-anim-watch';
  const IN_VIEW = 'data-in-view';

  // A ticker runs its row twice over, so a round ends where the next begins. The copies are the
  // page's, never the file's: hidden from assistive technology, out of the tab order, without ids,
  // and marked. A pass over a row drops the copies it has before it copies the children it has
  // now, so a row goes through any number of passes and holds each child exactly twice.
  const copyTicker = (row) => {
    for (const copy of row.querySelectorAll(`:scope > [${COPY}]`)) {
      copy.remove();
    }

    const copies = [...row.children].map((child) => {
      const copy = child.cloneNode(true);

      for (const el of [copy, ...copy.querySelectorAll('[id]')]) {
        el.removeAttribute('id');
      }

      copy.setAttribute(COPY, '');
      copy.setAttribute('aria-hidden', 'true');
      copy.inert = true;

      return copy;
    });

    row.append(...copies);
  };

  const canHold = 'IntersectionObserver' in window && typeof CSSStyleSheet.prototype.replaceSync === 'function';
  let seen = null;

  // The hold is a sheet of this script's own, not a rule in runtime.css: a copy of the
  // document without its scripts (Build's canvas) keeps data-anim-watch and must not keep the hold.
  const startWatching = () => {
    const hold = new CSSStyleSheet();
    hold.replaceSync(`[data-anim="self"][${WATCH}]:not([${IN_VIEW}]), [data-anim="children"][${WATCH}]:not([${IN_VIEW}]) > * { animation-play-state: paused; }`);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, hold];

    seen = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target;
        const again = el.hasAttribute('data-anim-repeat') && !el.hasAttribute('data-anim-off');

        if (entry.isIntersecting) {
          el.setAttribute(IN_VIEW, '');

          if (!again) {
            seen.unobserve(el);
          }
        } else if (again && el.hasAttribute(IN_VIEW)) {
          // Out of sight again: back to its first frame, held until it is seen once more.
          el.removeAttribute(IN_VIEW);
          el.setAttribute('data-anim-off', '');
          void el.offsetWidth;
          el.removeAttribute('data-anim-off');
        }
      }
    });
  };

  // Everything the page needs beyond its markup, for the markup it has now. At load, and again
  // after Live Preview morphs the page to a new render: the morph gives every element the file's
  // attributes and children, so a ticker's copies go, and so do the marks the view observer put on
  // the elements it holds — an element not yet seen would then play at once. An element that keeps
  // its mark was not in the morph, and is left as it is, still held or already played; one without
  // it is held and observed as at load — observed afresh, since an observer says nothing more
  // about a target it already has. The event is the preview's; the public page never sends it.
  const prepare = () => {
    document.querySelectorAll('[data-anim="ticker"]').forEach(copyTicker);

    if (!canHold) {
      return;
    }

    const watched = document.querySelectorAll(`[data-anim-on="view"]:not([${WATCH}])`);

    if (!watched.length) {
      return;
    }

    if (!seen) {
      startWatching();
    }

    for (const el of watched) {
      el.setAttribute(WATCH, '');
      seen.unobserve(el);
      seen.observe(el);
    }
  };

  prepare();
  window.addEventListener('statamic:preview-updated', prepare);
})();
