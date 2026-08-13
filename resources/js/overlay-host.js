/**
 * The editor overlay — one way in, whether the host is the live site or the CP.
 *
 * The page underneath never goes away. Control Panel Live Preview boots in a
 * full-screen iframe, and page changes boot the next editor hidden and swap
 * once it has painted. Close just lifts the overlay.
 */

const SOURCE = 'statamic-visual-editor';
const STYLE_ID = 'sve-overlay-host-styles';
const LOADING_ID = 'sve-overlay-loading';

function isCpHost(win) {
  return /\/cp(\/|$)/.test(win.location.pathname);
}

function isEmbedded(win) {
  return win.parent !== win.self;
}

function ensureStyles(win) {
  const doc = win.document;

  if (doc.getElementById(STYLE_ID)) {
    return;
  }

  const style = doc.createElement('style');

  style.id = STYLE_ID;
  style.textContent = `
    .sve-edit-overlay {
      position: fixed; inset: 0; width: 100%; height: 100%;
      border: 0; margin: 0; z-index: 2147483200;
      opacity: 0; pointer-events: none;
    }
    .sve-edit-overlay[data-open] { opacity: 1; pointer-events: auto; }
    html.sve-editing { overflow: hidden; }
    html.sve-editing #sve-edit-button { display: none; }
    html.sve-morphing::view-transition-old(root),
    html.sve-morphing::view-transition-new(root) {
      animation-duration: 380ms;
      animation-timing-function: cubic-bezier(.4, 0, .2, 1);
    }
    #${LOADING_ID} {
      position: fixed; top: 16px; right: 16px; z-index: 2147483300;
      display: flex; align-items: center; justify-content: center;
      width: 34px; height: 34px; border-radius: 999px;
      background: #18181b; color: #fff; box-shadow: 0 4px 14px rgba(0,0,0,.28);
      pointer-events: none;
    }
    #${LOADING_ID} svg { animation: sve-overlay-spin 1s linear infinite; }
    @keyframes sve-overlay-spin { to { transform: rotate(360deg); } }
    @media print { #sve-edit-button, .sve-edit-overlay, #${LOADING_ID} { display: none; } }
  `;
  doc.head.appendChild(style);
}

function createHost(win) {
  const doc = win.document;
  const root = doc.documentElement;
  const button = () => doc.getElementById('sve-edit-button');

  let frame = null;
  let next = null;
  let nextTimer = null;
  let ready = false;
  let open = false;
  let wanted = false;
  let saved = false;
  let ignorePopUntil = 0;
  let failTimer = null;

  ensureStyles(win);

  function editor(src) {
    const el = doc.createElement('iframe');

    el.className = 'sve-edit-overlay';
    el.title = 'Live Preview';
    el.src = src;
    doc.body.appendChild(el);

    return el;
  }

  function setLoading(on) {
    const btn = button();

    if (btn) {
      if (on) {
        btn.setAttribute('data-loading', '');
      } else {
        btn.removeAttribute('data-loading');
      }
    }

    const pip = doc.getElementById(LOADING_ID);

    if (on && !btn && !pip) {
      const el = doc.createElement('div');

      el.id = LOADING_ID;
      el.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">' +
        '<path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>';
      doc.body.appendChild(el);
    } else if (!on) {
      pip?.remove();
    }
  }

  function tell(el, type) {
    try {
      el.contentWindow.postMessage({ source: SOURCE, type }, win.location.origin);
    } catch {
      /* frame went away */
    }
  }

  function morph(update) {
    if (!doc.startViewTransition) {
      update();

      return;
    }

    root.classList.add('sve-morphing');
    doc.startViewTransition(update)
      .finished.catch(() => {})
      .then(() => root.classList.remove('sve-morphing'));
  }

  function boot(url) {
    if (frame) {
      try {
        if (new URL(frame.src, win.location.origin).href === new URL(url, win.location.origin).href) {
          return;
        }
      } catch {
        /* replace it */
      }

      frame.remove();
      frame = null;
      ready = false;
    }

    frame = editor(url);
  }

  function show() {
    if (open || !frame) {
      return;
    }

    open = true;

    try {
      win.history.pushState({ sveEditing: true }, '', win.location.href);
    } catch {
      /* ignore */
    }

    morph(() => {
      frame.setAttribute('data-open', '');
      root.classList.add('sve-editing');
    });
  }

  function goto(url) {
    if (!frame || !open) {
      openEditor(url);

      return;
    }

    if (next) {
      next.remove();
    }

    win.clearTimeout(nextTimer);
    next = editor(url);
    nextTimer = win.setTimeout(() => {
      if (!next) {
        return;
      }

      next.remove();
      next = null;
      tell(frame, 'lp-goto-failed');
    }, 20000);
  }

  function openEditor(url) {
    wanted = true;
    setLoading(true);
    boot(url);

    if (ready) {
      wanted = false;
      setLoading(false);
      show();
    }

    win.clearTimeout(failTimer);
    failTimer = win.setTimeout(() => {
      if (wanted && !ready) {
        wanted = false;
        setLoading(false);
        win.location.href = url;
      }
    }, 20000);
  }

  function detachFrames() {
    frame?.remove();
    next?.remove();
    frame = null;
    next = null;
    ready = false;
    win.clearTimeout(nextTimer);
    next = null;
  }

  function close(fromHistory, target) {
    if (!open) {
      return;
    }

    open = false;
    wanted = false;
    setLoading(false);

    if (isCpHost(win)) {
      detachFrames();
      saved = false;

      if (!fromHistory) {
        try {
          win.history.back();
        } catch {
          /* ignore */
        }
      }

      morph(() => root.classList.remove('sve-editing'));

      return;
    }

    let dest = null;

    if (target) {
      try {
        const parsed = new URL(String(target), win.location.origin);

        if (parsed.origin === win.location.origin) {
          dest = parsed;
        }
      } catch {
        /* ignore */
      }
    }

    const elsewhere = dest && dest.pathname !== win.location.pathname;

    if (saved || elsewhere) {
      detachFrames();

      if (elsewhere) {
        win.location.href = dest.href;
      } else {
        try {
          win.sessionStorage.setItem('sve-noanim', '1');
        } catch {
          /* ignore */
        }

        win.location.reload();
      }

      return;
    }

    if (!fromHistory) {
      try {
        win.history.back();
      } catch {
        /* ignore */
      }
    }

    morph(() => {
      frame?.removeAttribute('data-open');
      root.classList.remove('sve-editing');
    });
  }

  win.addEventListener('message', (event) => {
    if (event.origin !== win.location.origin) {
      return;
    }

    const from =
      frame && event.source === frame.contentWindow
        ? 'frame'
        : next && event.source === next.contentWindow
          ? 'next'
          : null;

    if (!from) {
      return;
    }

    const data = event.data;

    if (!data || data.source !== SOURCE) {
      return;
    }

    if (data.type !== 'lp-close') {
      ignorePopUntil = Date.now() + 1500;
    }

    if (data.type === 'lp-goto') {
      let url;

      try {
        url = new URL(String(data.url), win.location.origin);
      } catch {
        return;
      }

      if (from === 'frame' && url.origin === win.location.origin) {
        goto(url.href);
      }

      return;
    }

    if (data.type === 'lp-ready') {
      if (from === 'next') {
        win.clearTimeout(nextTimer);

        const old = frame;

        frame = next;
        next = null;
        morph(() => {
          frame.setAttribute('data-open', '');
          old?.remove();
        });

        return;
      }

      ready = true;
      setLoading(false);

      if (wanted) {
        wanted = false;
        show();
      }

      return;
    }

    if (data.type === 'lp-saved') {
      saved = true;
    } else if (data.type === 'lp-leaving') {
      try {
        win.sessionStorage.setItem('sve-noanim', '1');
      } catch {
        /* ignore */
      }
    } else if (data.type === 'lp-close') {
      close(false, data.url);
    }
  });

  win.addEventListener('popstate', (event) => {
    if (!open) {
      return;
    }

    if (event.state?.sveEditing) {
      return;
    }

    if (Date.now() < ignorePopUntil) {
      try {
        win.history.pushState({ sveEditing: true }, '', win.location.href);
      } catch {
        /* ignore */
      }

      return;
    }

    close(true);
  });

  return { boot, open: openEditor, goto, close };
}

export function installOverlayHost(win = window) {
  if (!win.__sveOverlayHost) {
    win.__sveOverlayHost = createHost(win);
  }

  return win.__sveOverlayHost;
}

export function openOverlay(win, url) {
  if (isEmbedded(win)) {
    gotoOverlay(win, url);

    return;
  }

  installOverlayHost(win).open(url);
}

export function gotoOverlay(win, url) {
  if (isEmbedded(win)) {
    try {
      win.parent.postMessage({ source: SOURCE, type: 'lp-goto', url }, win.location.origin);
    } catch {
      /* host went away */
    }

    return;
  }

  installOverlayHost(win).goto(url);
}

function bindEditButton(win) {
  const btn = win.document.getElementById('sve-edit-button');

  if (!btn) {
    return;
  }

  const host = installOverlayHost(win);
  const url = btn.getAttribute('href');

  btn.addEventListener('pointerenter', () => host.boot(url));
  btn.addEventListener('focus', () => host.boot(url));
  btn.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }

    event.preventDefault();
    host.open(url);
  });

  if (win.__sveWantEditor) {
    host.open(url);
  }
}

bindEditButton(window);
