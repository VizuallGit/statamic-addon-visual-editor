/**
 * One hover label for the whole editor.
 *
 * Drawn on the body rather than on the button, so a row that scrolls cannot
 * clip it — that is why the tool row could not scroll before. It shows at
 * once, where the browser's own tooltip waits a second or two and sometimes
 * never arrives at all.
 *
 * Reads `data-tip`, or `title` when that is all a button has. A `title` is
 * lifted off while the label is up, or the browser would draw its own on top
 * of it, and put back when the pointer leaves.
 */
const TIP_ID = '__sve-tip';

let stashed = null;

function tipElement(doc) {
  let el = doc.getElementById(TIP_ID);

  if (el) {
    return el;
  }

  el = doc.createElement('div');
  el.id = TIP_ID;
  el.hidden = true;
  el.style.cssText =
    'position:fixed;z-index:100001;pointer-events:none;padding:3px 7px;border-radius:4px;'
    + 'background:#1f1f1f;color:#d4d4d4;border:1px solid rgba(255,255,255,.14);'
    + 'box-shadow:0 4px 12px rgba(0,0,0,.35);font-family:ui-sans-serif,system-ui,sans-serif;'
    + 'font-size:11px;line-height:1.3;white-space:nowrap;';
  doc.body.appendChild(el);

  return el;
}

function putTitleBack() {
  if (stashed) {
    stashed.el.setAttribute('title', stashed.title);
    stashed.el.removeAttribute('data-tip');
    stashed = null;
  }
}

export function hideTip(doc) {
  const el = doc?.getElementById(TIP_ID);

  if (el) {
    el.hidden = true;
  }

  putTitleBack();
}

export function bindTips(win, root) {
  if (!root || root._sveTipsBound) {
    return;
  }

  root._sveTipsBound = true;

  const doc = win.document;

  root.addEventListener('mouseover', (event) => {
    const target = event.target?.closest?.('[data-tip], [title]');
    const text = target ? target.getAttribute('data-tip') || target.getAttribute('title') || '' : '';

    if (!text) {
      hideTip(doc);

      return;
    }

    if (stashed?.el !== target) {
      putTitleBack();
    }

    if (target.hasAttribute('title')) {
      // The text moves to `data-tip` as it goes: taking the title away is what
      // stops the browser drawing its own, but it also stopped this lookup
      // from finding the button again the moment the pointer moved inside it.
      stashed = { el: target, title: target.getAttribute('title') };
      target.setAttribute('data-tip', stashed.title);
      target.removeAttribute('title');
    }

    const el = tipElement(doc);

    el.textContent = text;
    el.hidden = false;

    const rect = target.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    const pad = 8;
    const below = rect.bottom + 6;
    const top = below + box.height > win.innerHeight - pad ? rect.top - box.height - 6 : below;

    el.style.top = `${Math.max(pad, top)}px`;
    el.style.left = `${Math.max(
      pad,
      Math.min(rect.left + rect.width / 2 - box.width / 2, win.innerWidth - box.width - pad)
    )}px`;
  });

  root.addEventListener('mouseleave', () => hideTip(doc));
  root.addEventListener('pointerdown', () => hideTip(doc), true);
  win.addEventListener('scroll', () => hideTip(doc), true);
}
