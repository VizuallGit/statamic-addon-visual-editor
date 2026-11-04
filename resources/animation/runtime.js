(() => {
  const COPY = 'data-anim-copy';
  const WATCH = 'data-anim-watch';
  const IN_VIEW = 'data-in-view';
  const WORD = 'data-anim-word';
  const MOUSE = 'data-anim-mouse';

  const canSheet = typeof CSSStyleSheet.prototype.replaceSync === 'function';

  // A sheet of this script's own, beside the page's: what it writes is the page's, never the
  // file's, and a copy of the document (Build's canvas) does not carry it.
  const adopt = () => {
    const sheet = new CSSStyleSheet();

    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

    return sheet;
  };

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

  // A heading's words one after another: each word in a <span> of the page's, with its place in
  // the heading as data-anim-word, which the index sheet turns into --anim-i for runtime.css.
  // The spans are hidden from assistive technology and the heading says its text once, as
  // aria-label. Inline markup stays where it is; only the text nodes are cut. An element that
  // has its spans was wrapped on an earlier pass and is left as it is: a morph that brings the
  // file's text takes the spans with it, and the next pass wraps the new text.
  let indexSheet = null;
  let indexed = 0;

  const indexWords = (count) => {
    if (count <= indexed) {
      return;
    }

    indexed = count;
    indexSheet ||= adopt();
    indexSheet.replaceSync(Array.from({ length: count - 1 }, (_, n) => `[${WORD}="${n + 1}"] { --anim-i: ${n + 1}; }`).join('\n'));
  };

  const wrapWords = (el) => {
    if (el.querySelector(`[${WORD}]`)) {
      return;
    }

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const texts = [];
    let text;

    while ((text = walker.nextNode())) {
      texts.push(text);
    }

    let count = 0;

    for (const node of texts) {
      if (!node.data.trim()) {
        continue;
      }

      const words = document.createDocumentFragment();

      for (const part of node.data.split(/(\s+)/)) {
        if (!part) {
          continue;
        }

        if (!part.trim()) {
          words.append(part);

          continue;
        }

        const word = document.createElement('span');

        word.setAttribute(WORD, String(count++));
        word.setAttribute('aria-hidden', 'true');
        word.textContent = part;
        words.append(word);
      }

      node.replaceWith(words);
    }

    if (count) {
      el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
      indexWords(count);
    }
  };

  // An element that moves toward the pointer. Where the pointer is, -1…1 from each element's
  // middle across the screen, goes into one sheet as --anim-mx / --anim-my, one rule per element,
  // keyed by data-anim-mouse; runtime.css turns it into a translate. Only for a fine pointer that
  // can hover, and never for a visitor who asked for less motion: on a touch screen or with less
  // motion nothing is written, and the element stands where the file put it. A pass gives each
  // element without a key the next one and writes the sheet over for the elements the page has now.
  const canFollow = canSheet
    && matchMedia('(hover: hover) and (pointer: fine)').matches
    && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let follow = null;

  const place = () => {
    follow.frame = 0;

    const { pointer } = follow;

    for (const [el, rule] of follow.rules) {
      let x = 0;
      let y = 0;

      if (pointer && el.isConnected) {
        const box = el.getBoundingClientRect();

        x = Math.max(-1, Math.min(1, (pointer.x - (box.left + box.width / 2)) / (innerWidth / 2)));
        y = Math.max(-1, Math.min(1, (pointer.y - (box.top + box.height / 2)) / (innerHeight / 2)));
      }

      rule.style.setProperty('--anim-mx', x.toFixed(3));
      rule.style.setProperty('--anim-my', y.toFixed(3));
    }
  };

  const moved = (pointer) => {
    follow.pointer = pointer;
    follow.frame ||= requestAnimationFrame(place);
  };

  const startFollowing = () => {
    follow = { sheet: adopt(), rules: new Map(), pointer: null, frame: 0, keys: 0 };
    window.addEventListener('pointermove', (event) => moved({ x: event.clientX, y: event.clientY }), { passive: true });
    document.documentElement.addEventListener('pointerleave', () => moved(null));
  };

  const followMouse = (els) => {
    if (!follow) {
      startFollowing();
    }

    for (const el of els) {
      if (!el.hasAttribute(MOUSE)) {
        el.setAttribute(MOUSE, String(++follow.keys));
      }
    }

    follow.sheet.replaceSync([...els].map((el) => `[${MOUSE}="${el.getAttribute(MOUSE)}"] { --anim-mx: 0; --anim-my: 0; }`).join('\n'));
    follow.rules = new Map([...els].map((el, i) => [el, follow.sheet.cssRules[i]]));

    if (follow.pointer) {
      moved(follow.pointer);
    }
  };

  const canHold = 'IntersectionObserver' in window && canSheet;
  let seen = null;

  // The hold is a sheet of this script's own, not a rule in runtime.css: a copy of the
  // document without its scripts (Build's canvas) keeps data-anim-watch and must not keep the hold.
  const startWatching = () => {
    adopt().replaceSync(`[data-anim="self"][${WATCH}]:not([${IN_VIEW}]), [data-anim="children"][${WATCH}]:not([${IN_VIEW}]) > *, [data-anim="words"][${WATCH}]:not([${IN_VIEW}]) [${WORD}] { animation-play-state: paused; }`);

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
  // attributes and children, so a ticker's copies go, a heading's word spans go, a mouse key goes,
  // and so do the marks the view observer put on the elements it holds — an element not yet seen
  // would then play at once. An element that keeps its mark was not in the morph, and is left as
  // it is, still held or already played; one without it is held and observed as at load —
  // observed afresh, since an observer says nothing more about a target it already has. The
  // event is the preview's; the public page never sends it.
  const prepare = () => {
    document.querySelectorAll('[data-anim="ticker"]').forEach(copyTicker);
    document.querySelectorAll('[data-anim="words"]').forEach(wrapWords);

    const mice = document.querySelectorAll('[data-anim="mouse"]');

    if (canFollow && (mice.length || follow)) {
      followMouse(mice);
    }

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
