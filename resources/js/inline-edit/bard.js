/**
 * inline-edit.js — Bard commands and popups.
 * Split out of inline-edit.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. inline-edit.js re-exports this file.
 */

// command → CP Bard toolbar button title matcher. Core Statamic titles are
// English even in a translated CP; addon buttons (colour) are localized.
export const BARD_CMD_TITLE = {
  link: /link|anker|anchor/i,
  color: /farve|colou?r/i,
  unorderedlist: /unordered list|bullet|punkt/i,
  orderedlist: /ordered list|number|nummer/i,
  quote: /blockquote|quote|citat/i,
  code: /^code$/i,
  codeblock: /code block|kodeblok/i,
  table: /table|tabel/i,
};

/** Builds a DOM Range spanning [from,to] character offsets within blockEl. */
export function domRangeForOffsets(blockEl, from, to) {
  const walker = blockEl.ownerDocument.createTreeWalker(blockEl, NodeFilter.SHOW_TEXT);
  let count = 0;
  let startNode = null;
  let startOff = 0;
  let endNode = null;
  let endOff = 0;
  let node;

  while ((node = walker.nextNode())) {
    const len = node.nodeValue.length;

    if (startNode === null && from <= count + len) {
      startNode = node;
      startOff = from - count;
    }

    if (to <= count + len) {
      endNode = node;
      endOff = to - count;
      break;
    }

    count += len;
  }

  if (!startNode) {
    return null;
  }

  if (!endNode) {
    endNode = startNode;
    endOff = startNode.nodeValue.length;
  }

  const range = blockEl.ownerDocument.createRange();

  range.setStart(startNode, startOff);
  range.setEnd(endNode, endOff);

  return range;
}

export function clickBardToolbarButton(bardEl, titleRe, doc) {
  const btn = findBardToolbarButton(bardEl, titleRe, doc);

  if (!btn) {
    return false;
  }

  btn.click();

  return true;
}

function findBardToolbarButton(bardEl, titleRe, doc) {
  const roots = [
    bardEl?.querySelector('.bard-fixed-toolbar'),
    bardEl?.querySelector('.bard-floating-toolbar'),
    bardEl,
    doc,
  ].filter(Boolean);

  const seen = new Set();

  for (const root of roots) {
    for (const b of root.querySelectorAll('button')) {
      if (seen.has(b)) {
        continue;
      }

      seen.add(b);

      const label = b.getAttribute('title') || b.getAttribute('aria-label') || b.textContent || '';

      if (titleRe.test(label.trim())) {
        return b;
      }
    }
  }

  return null;
}

const LINK_STACK_RE = /apply link|anvend link|update link|opdater link|indsæt link|https:\/\//i;

/**
 * Finds the Statamic popup that a bard command just opened (link dialog or
 * colour palette) by a distinctive bit of its content, then climbs to the
 * floating (positioned) container.
 */
function findBardPopupEl(command, doc) {
  if (command === 'link') {
    const stack = [...doc.querySelectorAll('.stack-content')].find((el) => {
      if (LINK_STACK_RE.test(el.textContent || '')) {
        return true;
      }

      if (el.querySelector('input[placeholder*="http" i]')) {
        return true;
      }

      const heading = el.querySelector('h1, h2, h3, [class*="stack-header"]');

      return heading && /^link$/i.test(heading.textContent.trim());
    });

    if (stack) {
      return stack;
    }
  }

  let anchorNode = null;

  if (command === 'color') {
    anchorNode = [...doc.querySelectorAll('*')].find(
      (e) => e.children.length === 0 && /ingen farve|no colou?r/i.test(e.textContent || '')
    );
  } else if (command === 'link') {
    anchorNode =
      doc.querySelector('input[placeholder="https://"], input[placeholder*="http" i]') ||
      [...doc.querySelectorAll('button, label, span, div, h1, h2, h3')].find(
        (e) =>
          e.children.length === 0 &&
          /apply link|anvend link|update link|opdater link|indsæt link/i.test(e.textContent || '')
      );
  }

  if (!anchorNode) {
    return null;
  }

  const stack = anchorNode.closest('.stack-content');

  if (stack) {
    return stack;
  }

  let el = anchorNode;

  for (let i = 0; el && i < 12; i++) {
    const cs = doc.defaultView.getComputedStyle(el);
    const w = el.getBoundingClientRect().width;

    // A popover/palette is a small positioned box; skip full-screen overlays.
    if ((cs.position === 'fixed' || cs.position === 'absolute') && w > 120 && w < 640) {
      return el;
    }

    el = el.parentElement;
  }

  return anchorNode.closest('[data-popper-placement]') || anchorNode.parentElement;
}

/**
 * Keep Statamic's Link Stack in front of the preview iframe. Do not rebuild
 * it — only raise the portal and call the Stack's own close() on Escape /
 * click outside, the same two exits the sidebar uses.
 */
export function revealBardLinkStack(doc, win) {
  let tries = 0;

  const run = () => {
    const stack = findBardPopupEl('link', doc);

    if (!stack) {
      if (++tries < 25) {
        setTimeout(run, 100);
      }

      return;
    }

    const host = stack.closest('[id^="portal-target-"]') || stack.closest('.vue-portal-target') || stack;
    const rect = stack.getBoundingClientRect();
    const offScreen = rect.right < 8 || rect.left > win.innerWidth - 8 || rect.width < 80;

    if (offScreen && host.parentElement !== doc.body) {
      doc.body.appendChild(host);
    }

    host.style.setProperty('z-index', '2147483000', 'important');

    const overlay = host.querySelector('.stack-overlay');

    if (overlay) {
      overlay.style.removeProperty('z-index');
    }

    const url = stack.querySelector('input[placeholder*="http" i], input[type="url"], input[type="text"]');

    url?.focus();

    bindNativeStackDismiss(doc, win, stack, host);
  };

  setTimeout(run, 60);
}

function stackCloser(from) {
  let vn = from?.__vueParentComponent;

  for (let i = 0; vn && i < 40; i++) {
    const exposed = vn.exposed || vn.proxy;

    if (typeof exposed?.close === 'function' && typeof exposed?.open === 'function') {
      return () => exposed.close();
    }

    vn = vn.parent;
  }

  return null;
}

function bindNativeStackDismiss(doc, win, stack, host) {
  const closer = stackCloser(stack) || stackCloser(host);

  if (!closer) {
    return;
  }

  const onKey = (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    event.preventDefault();
    closer();
    cleanup();
  };

  const onPointer = (event) => {
    if (stack.contains(event.target)) {
      return;
    }

    const overlay = host.querySelector('.stack-overlay');

    if (!overlay || !overlay.contains(event.target)) {
      return;
    }

    closer();
    cleanup();
  };

  const cleanup = () => {
    win.removeEventListener('keydown', onKey, true);
    doc.removeEventListener('pointerdown', onPointer, true);
  };

  win.addEventListener('keydown', onKey, true);
  doc.addEventListener('pointerdown', onPointer, true);
}

/**
 * Pins the popup over the preview at the anchor sent by the bridge, keeping the
 * editor panel hidden. Uses !important so Statamic's floating-ui inline styles
 * (written without priority) can't drag it back to the off-screen button.
 */
export function repositionBardPopup(command, anchorRect, doc, win) {
  const iframe = doc.getElementById('live-preview-iframe');

  if (!iframe || !anchorRect) {
    return;
  }

  const ir = iframe.getBoundingClientRect();
  const targetLeft = ir.left + (anchorRect.left || 0);
  const targetTop = ir.top + (anchorRect.bottom || 0) + 8;

  const place = (popup) => {
    const w = popup.offsetWidth || 320;
    const left = Math.max(8, Math.min(targetLeft, win.innerWidth - w - 8));
    const top = Math.max(8, targetTop);

    popup.style.setProperty('position', 'fixed', 'important');
    popup.style.setProperty('left', `${left}px`, 'important');
    popup.style.setProperty('top', `${top}px`, 'important');
    popup.style.setProperty('right', 'auto', 'important');
    popup.style.setProperty('bottom', 'auto', 'important');
    popup.style.setProperty('transform', 'none', 'important');
    popup.style.setProperty('margin', '0', 'important');
    popup.style.setProperty('z-index', '2147483000', 'important');
    // Statamic's link editor renders as a full-height stack card — hug its
    // content so it looks like a popover floating over the preview.
    popup.style.setProperty('height', 'auto', 'important');
    popup.style.setProperty('max-height', '85vh', 'important');
    popup.style.setProperty('overflow', 'auto', 'important');
    popup.style.setProperty('border-radius', '12px', 'important');
    popup.style.setProperty('box-shadow', '0 12px 44px rgba(0,0,0,0.28)', 'important');
  };

  let tries = 0;

  const findAndPlace = () => {
    const popup = findBardPopupEl(command, doc);

    if (!popup) {
      if (++tries < 25) {
        setTimeout(findAndPlace, 100);
      }

      return;
    }

    // Re-assert a few times to win against floating-ui's on-open positioning.
    place(popup);
    setTimeout(() => place(popup), 130);
    setTimeout(() => place(popup), 320);
  };

  setTimeout(findAndPlace, 60);
}
