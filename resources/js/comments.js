/**
 * Figma-style comment pins over Live Preview.
 *
 * Pins sit in the Control Panel window on top of the iframe. Threads are stored
 * per entry in this site's storage/statamic-visual-editor/comments. Super admin only.
 */
export function initComments() {
  const ROOT_ID = 'sc-cp-root';
  const HIT_ID = 'sc-cp-hit';
  const SIDEBAR_ID = 'sc-sidebar';
  const Z_HIT = '45';
  const Z_PIN = '46';
  const Z_THREAD = '47';

  let mode = false;
  let comments = [];
  let entryId = null;
  let fetchedEntryId = null;
  let started = false;
  let openId = null;
  let draft = null;
  let ticking = false;
  let sidebarFilter = 'open';
  let bootObserver = null;

  function config() {
    return window.Statamic?.$config?.get?.('sveComments') || window.StatamicConfig?.sveComments || null;
  }

  function allowed() {
    if (window.Statamic?.$config?.get?.('sveEnabled') === false) {
      return false;
    }

    if (window.Statamic?.$config?.get?.('sveFeatures')?.comments === false) {
      return false;
    }

    if (config()?.enabled === false) {
      return false;
    }

    if (window.Statamic?.$permissions?.has) {
      return window.Statamic.$permissions.has('super') === true;
    }

    return true;
  }

  function csrf() {
    return (
      document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
      window.Statamic?.$config?.get?.('csrfToken') ||
      window.Statamic?.$config?.get?.('csrf_token') ||
      ''
    );
  }

  function currentEntryId() {
    const match = window.location.pathname.match(/\/collections\/[^/]+\/entries\/([^/]+)/);

    return match ? decodeURIComponent(match[1]) : null;
  }

  function previewIframe() {
    const direct = document.getElementById('live-preview-iframe');

    if (direct) {
      return direct;
    }

    for (const frame of document.querySelectorAll('iframe')) {
      try {
        const inner = frame.contentDocument?.getElementById('live-preview-iframe');

        if (inner) {
          return inner;
        }
      } catch {
        /* cross-origin */
      }
    }

    return null;
  }

  function previewCtx() {
    const iframe = previewIframe();

    if (!iframe) {
      return null;
    }

    try {
      const win = iframe.contentWindow;
      const doc = iframe.contentDocument;

      if (!win || !doc?.documentElement) {
        return null;
      }

      return { iframe, win, doc };
    } catch {
      return null;
    }
  }

  async function request(path, options = {}) {
    const response = await fetch(path, {
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRF-TOKEN': csrf(),
        'X-Requested-With': 'XMLHttpRequest',
        ...(options.headers || {}),
      },
      ...options,
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'Kommentaren kunne ikke gemmes.');
    }

    return data;
  }

  async function loadComments() {
    const id = currentEntryId();

    entryId = id;

    if (!id) {
      comments = [];
      fetchedEntryId = null;
      paintDockBadge();

      if (mode) {
        paintUi();
      }

      return;
    }

    if (id === fetchedEntryId) {
      paintDockBadge();
      return;
    }

    fetchedEntryId = id;

    try {
      const data = await request(`/!/sve/comments/${encodeURIComponent(id)}`);

      comments = data.comments || [];
    } catch {
      comments = [];
    }

    paintDockBadge();

    if (mode) {
      paintUi();
    }
  }

  function openCount() {
    return comments.filter((comment) => !comment.resolved).length;
  }

  function commentsPaneOpen() {
    const host = commentsHost();

    if (!host) {
      return false;
    }

    const dock = host.closest('#__sve-right-dock');

    if (dock?.hasAttribute('data-sve-right-closed')) {
      return false;
    }

    const pane = host.closest('[data-sve-right-pane="comments"]');

    if (pane) {
      return !pane.hidden && pane.style.display !== 'none';
    }

    const panel = host.closest('#__sve-comments-pane');

    return !!panel && !panel.hasAttribute('data-sve-chrome-hidden') && panel.style.display !== 'none';
  }

  function commentsHost() {
    return document.querySelector('[data-sve-comments-host]');
  }

  function paintDockBadge() {
    const count = String(openCount());
    const targets = [
      document.querySelector('#__sve-toolbar button[data-tab="comments"]'),
      document.querySelector('[data-sve-right-pane-btn="comments"]'),
    ].filter(Boolean);

    targets.forEach((btn) => {
      let badge = btn.querySelector('[data-sc-badge]');

      if (count === '0') {
        badge?.remove();
        return;
      }

      const inHead = btn.hasAttribute('data-sve-right-pane-btn');
      const ring = 'var(--sve-toolbar-ring, rgba(128,128,128,.16))';
      const style = inHead
        ? 'display:inline-flex;align-items:center;justify-content:center;margin-left:8px;min-width:16px;height:16px;padding:0 5px;border-radius:999px;background:#4530D8;color:#fff;font-size:10px;font-weight:700;line-height:16px;flex:0 0 auto;'
        : `position:absolute;top:-4px;right:-4px;min-width:14px;height:14px;padding:0 4px;border-radius:999px;background:#4530D8;color:#fff;font-size:9px;font-weight:700;line-height:14px;text-align:center;pointer-events:none;box-shadow:0 0 0 2px ${ring};`;

      if (!badge) {
        badge = document.createElement('span');
        badge.dataset.scBadge = '';
        btn.appendChild(badge);
      }

      badge.style.cssText = style;

      if (badge.textContent !== count) {
        badge.textContent = count;
      }
    });
  }

  function syncModeFromDock() {
    const next = commentsPaneOpen();

    if (next === mode) {
      paintDockBadge();

      if (mode) {
        layoutGeometry();
      }

      return;
    }

    mode = next;
    openId = next ? openId : null;
    draft = next ? draft : null;
    paintDockBadge();
    paintUi();

    if (mode) {
      loadComments();
    }
  }

  function cssEscape(value) {
    if (window.CSS?.escape) {
      return window.CSS.escape(value);
    }

    return String(value).replace(/"/g, '\\"');
  }

  function findSection(el) {
    if (!el?.closest) {
      return null;
    }

    return (
      el.closest('[data-sid-section-orderable]') ||
      el.closest('section[data-sid], article[data-sid]') ||
      outermostSid(el)
    );
  }

  function outermostSid(el) {
    let node = el.closest('[data-sid]');
    let outer = node;

    while (node) {
      const next = node.parentElement?.closest('[data-sid]');

      if (!next) {
        break;
      }

      outer = next;
      node = next;
    }

    return outer;
  }

  function sectionById(doc, id) {
    if (!id || id === '__page') {
      return doc.body || doc.documentElement;
    }

    const matches = [...doc.querySelectorAll(`[data-sid="${cssEscape(id)}"]`)];

    return (
      matches.find((el) => el.hasAttribute('data-sid-section-orderable')) ||
      matches.find((el) => /^(SECTION|ARTICLE)$/.test(el.tagName)) ||
      matches[0] ||
      null
    );
  }

  function iframePoint(event) {
    const iframe = previewIframe();

    if (!iframe) {
      return null;
    }

    const ir = iframe.getBoundingClientRect();
    const win = iframe.contentWindow;
    const width = ir.width || 1;
    const height = ir.height || 1;

    return {
      x: ((event.clientX - ir.left) * (win?.innerWidth || width)) / width,
      y: ((event.clientY - ir.top) * (win?.innerHeight || height)) / height,
    };
  }

  function screenPos(section, xPct, yPct) {
    const iframe = previewIframe();
    const ctx = previewCtx();

    if (!iframe || !section) {
      return null;
    }

    const ir = iframe.getBoundingClientRect();
    const sr = section.getBoundingClientRect();
    const innerW = ctx?.win.innerWidth || ir.width;
    const innerH = ctx?.win.innerHeight || ir.height;
    const scaleX = ir.width / (innerW || 1);
    const scaleY = ir.height / (innerH || 1);

    return {
      left: ir.left + (sr.left + (sr.width * xPct) / 100) * scaleX,
      top: ir.top + (sr.top + (sr.height * yPct) / 100) * scaleY,
    };
  }

  function relativePoint(section, iframeX, iframeY) {
    const rect = section.getBoundingClientRect();
    const x = rect.width ? ((iframeX - rect.left) / rect.width) * 100 : 50;
    const y = rect.height ? ((iframeY - rect.top) / rect.height) * 100 : 50;

    return {
      x: Math.min(98, Math.max(2, x)),
      y: Math.min(98, Math.max(2, y)),
    };
  }

  function timeAgo(iso) {
    const then = Date.parse(iso);

    if (!then) {
      return '';
    }

    const mins = Math.round((Date.now() - then) / 60000);

    if (mins < 1) {
      return 'nu';
    }

    if (mins < 60) {
      return `${mins} min`;
    }

    const hours = Math.round(mins / 60);

    if (hours < 24) {
      return `${hours} t`;
    }

    return new Date(then).toLocaleDateString();
  }

  function root() {
    let el = document.getElementById(ROOT_ID);

    if (el) {
      el.style.cssText = 'position:absolute;width:0;height:0;overflow:visible;';

      return el;
    }

    el = document.createElement('div');
    el.id = ROOT_ID;
    // No covering box and no pointer-events:none parent — a full-screen
    // overlay over the live-preview iframe steals focus from the textarea
    // and swallows the Send click.
    el.style.cssText = 'position:absolute;width:0;height:0;overflow:visible;';
    document.body.appendChild(el);

    const hit = document.createElement('div');

    hit.id = HIT_ID;
    hit.style.cssText =
      'position:fixed;z-index:' +
      Z_HIT +
      ';pointer-events:auto;background:rgba(0,0,0,0);cursor:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%234530D8\' d=\'M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2z\'/%3E%3C/svg%3E") 4 20, crosshair;';
    hit.addEventListener('pointerdown', (event) => event.stopPropagation());
    hit.addEventListener('mousedown', (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    hit.addEventListener('click', onHitClick);
    hit.addEventListener(
      'wheel',
      (event) => {
        const ctx = previewCtx();

        if (!ctx) {
          return;
        }

        ctx.win.scrollBy(event.deltaX, event.deltaY);
        event.preventDefault();
        layoutGeometry();
      },
      { passive: false }
    );
    el.appendChild(hit);

    return el;
  }

  function setStyle(el, prop, value) {
    if (el.style[prop] !== value) {
      el.style[prop] = value;
    }
  }

  function layoutHit() {
    const hit = document.getElementById(HIT_ID);
    const iframe = previewIframe();

    if (!hit) {
      return;
    }

    if (!iframe) {
      setStyle(hit, 'display', 'none');
      return;
    }

    const r = iframe.getBoundingClientRect();

    setStyle(hit, 'display', 'block');
    setStyle(hit, 'zIndex', Z_HIT);
    setStyle(hit, 'left', `${r.left}px`);
    setStyle(hit, 'top', `${r.top}px`);
    setStyle(hit, 'width', `${r.width}px`);
    setStyle(hit, 'height', `${r.height}px`);
  }

  function onHitClick(event) {
    if (!mode) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const overChrome = document
      .elementsFromPoint(event.clientX, event.clientY)
      .some((el) => el.closest?.('[data-sc-thread], [data-sc-pin]'));

    if (overChrome) {
      return;
    }

    const ctx = previewCtx();
    const point = iframePoint(event);
    let section = null;
    let visualId = '__page';

    if (ctx && point) {
      const under = ctx.doc.elementFromPoint(point.x, point.y);

      section = findSection(under) || ctx.doc.body || ctx.doc.documentElement;
      visualId = section?.getAttribute?.('data-sid') || '__page';
    }

    const rel = section && point ? relativePoint(section, point.x, point.y) : { x: 50, y: 50 };

    draft = {
      visual_id: visualId,
      x: rel.x,
      y: rel.y,
      body: '',
    };
    openId = '__draft';
    paintUi();
    focusComposer();
  }

  function focusComposer() {
    const iframe = previewIframe();

    iframe?.blur();
    iframe?.contentWindow?.blur?.();

    window.requestAnimationFrame(() => {
      const input = document.querySelector('#sc-cp-root textarea');

      if (!input) {
        return;
      }

      input.focus();
      const end = input.value.length;

      input.setSelectionRange(end, end);
    });
  }

  function teardownUi() {
    ticking = false;
    document.getElementById(ROOT_ID)?.remove();
    document.getElementById(SIDEBAR_ID)?.remove();
    commentsHost()?.replaceChildren();
  }

  function paintUi() {
    if (!mode) {
      teardownUi();
      return;
    }

    const wrap = root();

    [...wrap.querySelectorAll('[data-sc-chrome]')].forEach((el) => el.remove());
    layoutHit();
    startTick();

    const ctx = previewCtx();
    const items = comments.slice();

    if (draft) {
      items.push({ id: '__draft', ...draft, resolved: false, messages: [] });
    }

    items.forEach((comment, index) => {
      const section = ctx ? sectionById(ctx.doc, comment.visual_id) : null;
      const pos = section ? screenPos(section, comment.x, comment.y) : fallbackPos(comment);
      const pin = document.createElement('button');
      const initials = comment.messages?.[0]?.author_initials || String(index + 1);

      pin.type = 'button';
      pin.dataset.scChrome = '';
      pin.dataset.scPin = comment.id;
      pin.style.cssText =
        'position:fixed;width:28px;height:28px;margin:-6px 0 0 -6px;border:0;padding:0;border-radius:50% 50% 50% 4px;transform:rotate(-45deg);background:#4530D8;color:#fff;box-shadow:0 2px 10px rgba(0,0,0,.28);pointer-events:auto;cursor:pointer;z-index:' +
        Z_PIN +
        ';display:flex;align-items:center;justify-content:center;';

      if (comment.resolved) {
        pin.style.background = '#64748b';
      }

      pin.style.left = `${pos.left}px`;
      pin.style.top = `${pos.top}px`;
      pin.innerHTML = '<span style="transform:rotate(45deg);font-size:10px;font-weight:700;"></span>';
      pin.querySelector('span').textContent = initials;
      pin.addEventListener('mousedown', (event) => event.stopPropagation());
      pin.addEventListener('click', (event) => {
        event.stopPropagation();
        openId = openId === comment.id ? null : comment.id;

        if (comment.id !== '__draft') {
          draft = null;
        }

        paintUi();

        if (openId) {
          focusComposer();
        }
      });
      wrap.appendChild(pin);

      if (openId === comment.id) {
        wrap.appendChild(threadCard(comment, pos));
      }
    });

    paintSidebar();
  }

  function snippet(comment) {
    const text = comment.messages?.[0]?.body || '';

    return text.length > 90 ? `${text.slice(0, 87)}…` : text;
  }

  function commentLabel(comment) {
    if (!comment.visual_id || comment.visual_id === '__page') {
      return 'Side';
    }

    const ctx = previewCtx();
    const el = ctx ? sectionById(ctx.doc, comment.visual_id) : null;

    return el?.getAttribute('data-sid-label') || el?.getAttribute('data-sid-type') || 'Sektion';
  }

  function paintSidebar() {
    document.getElementById(SIDEBAR_ID)?.remove();

    const panel = commentsHost();

    if (!panel) {
      return;
    }

    if (!mode) {
      panel.innerHTML = '';
      return;
    }

    const open = comments.filter((comment) => !comment.resolved);
    const shown = sidebarFilter === 'open' ? open : comments;

    panel.innerHTML = '';

    const tabs = document.createElement('div');

    tabs.style.cssText = 'display:flex;gap:4px;padding:10px 12px 0;flex:0 0 auto;';
    [
      ['open', `Åbne (${open.length})`],
      ['all', `Alle (${comments.length})`],
    ].forEach(([id, label]) => {
      const tab = document.createElement('button');

      tab.type = 'button';
      tab.textContent = label;
      tab.style.cssText =
        'all:unset;cursor:pointer;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:' +
        (sidebarFilter === id ? '600' : '500') +
        ';background:' +
        (sidebarFilter === id ? 'var(--theme-color-primary,#4530D8)' : 'rgba(128,128,128,.22)') +
        ';color:' +
        (sidebarFilter === id ? '#fff' : 'currentColor');
      tab.addEventListener('click', () => {
        sidebarFilter = id;
        paintSidebar();
      });
      tabs.appendChild(tab);
    });
    panel.appendChild(tabs);

    const list = document.createElement('div');

    list.style.cssText = 'flex:1 1 auto;min-height:0;overflow-y:auto;padding:10px 12px 16px;display:flex;flex-direction:column;gap:8px;';

    if (!shown.length) {
      const empty = document.createElement('div');

      empty.style.cssText = 'padding:24px 8px;text-align:center;opacity:.55;font-size:12px;line-height:1.45;';
      empty.textContent = sidebarFilter === 'open'
        ? 'Ingen åbne kommentarer. Klik i preview for at tilføje en.'
        : 'Ingen kommentarer på siden endnu. Klik i preview for at tilføje en.';
      list.appendChild(empty);
    }

    shown.forEach((comment) => {
      const first = comment.messages?.[0] || {};
      const row = document.createElement('button');
      const active = openId === comment.id;

      row.type = 'button';
      row.style.cssText =
        'all:unset;cursor:pointer;display:block;padding:10px;border-radius:10px;border:1px solid ' +
        (active ? 'rgba(69,48,216,.45)' : 'rgba(128,128,128,.18)') +
        ';background:' +
        (active ? 'rgba(69,48,216,.08)' : 'rgba(128,128,128,.08)') +
        (comment.resolved ? ';opacity:.62' : '');

      const meta = document.createElement('div');

      meta.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;';
      meta.innerHTML =
        `<span style="font-size:11px;font-weight:650"></span><span style="font-size:10px;opacity:.55"></span>`;
      meta.children[0].textContent = first.author_name || 'User';
      meta.children[1].textContent = timeAgo(first.created_at);

      const where = document.createElement('div');

      where.style.cssText = 'font-size:10px;opacity:.55;margin-bottom:4px;';
      where.textContent = comment.resolved ? `Løst · ${commentLabel(comment)}` : commentLabel(comment);

      const body = document.createElement('div');

      body.style.cssText = 'font-size:13px;line-height:1.4;';
      body.textContent = snippet(comment) || 'Kommentar';

      row.append(meta, where, body);
      row.addEventListener('click', () => revealComment(comment));
      list.appendChild(row);
    });

    panel.appendChild(list);
  }

  function revealComment(comment) {
    openId = comment.id;
    draft = null;

    const ctx = previewCtx();
    const section = ctx ? sectionById(ctx.doc, comment.visual_id) : null;

    section?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    paintUi();
    focusComposer();
  }

  function fallbackPos() {
    const iframe = previewIframe();
    const r = iframe?.getBoundingClientRect() || { left: 80, top: 80, width: 400, height: 400 };

    return { left: r.left + 40, top: r.top + 40 };
  }

  function layoutGeometry() {
    if (!mode) {
      return;
    }

    layoutHit();

    const ctx = previewCtx();
    const wrap = document.getElementById(ROOT_ID);

    if (!wrap) {
      return;
    }

    const items = comments.slice();

    if (draft) {
      items.push({ id: '__draft', ...draft, resolved: false, messages: [] });
    }

    items.forEach((comment) => {
      const section = ctx ? sectionById(ctx.doc, comment.visual_id) : null;
      const pos = section ? screenPos(section, comment.x, comment.y) : fallbackPos();
      const pin = wrap.querySelector(`[data-sc-pin="${comment.id}"]`);
      const thread = wrap.querySelector(`[data-sc-thread="${comment.id}"]`);

      if (pin) {
        setStyle(pin, 'left', `${pos.left}px`);
        setStyle(pin, 'top', `${pos.top}px`);
      }

      if (thread) {
        placeThread(thread, pos);
      }
    });
  }

  function placeThread(card, point) {
    const iframe = previewIframe();
    const ir = iframe?.getBoundingClientRect();
    const rightBound = ir?.right || window.innerWidth;
    const leftBound = ir?.left || 0;
    const spaceRight = rightBound - point.left;
    let left = spaceRight < 300 ? point.left - 288 : point.left + 22;

    left = Math.min(Math.max(leftBound + 8, left), Math.max(leftBound + 8, rightBound - 288));

    card.style.left = `${left}px`;
    card.style.top = `${Math.max(8, Math.min(point.top - 8, (ir?.bottom || window.innerHeight) - 120))}px`;
  }

  function startTick() {
    if (ticking) {
      return;
    }

    ticking = true;

    const tick = () => {
      if (!mode) {
        ticking = false;
        return;
      }

      layoutGeometry();
      window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  }

  function isDark() {
    const root = document.documentElement;

    return root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark';
  }

  function chromeTheme() {
    if (isDark()) {
      return {
        card: '#18181B',
        text: '#fafafa',
        line: 'rgba(255,255,255,.1)',
        input: '#2D2D2F',
        inputBorder: 'rgba(255,255,255,.12)',
        ghost: '#2D2D2F',
        primary: '#4530D8',
        scheme: 'dark',
      };
    }

    return {
      card: '#fff',
      text: '#18181b',
      line: '#eee',
      input: '#fff',
      inputBorder: '#e4e4e7',
      ghost: '#f4f4f5',
      primary: '#4530D8',
      scheme: 'light',
    };
  }

  function isolatePointer(el) {
    const stop = (event) => event.stopPropagation();

    el.addEventListener('pointerdown', stop);
    el.addEventListener('mousedown', stop);
    el.addEventListener('click', stop);
    el.addEventListener('keydown', stop);
  }

  function threadCard(comment, point) {
    const card = document.createElement('div');
    const isDraft = comment.id === '__draft';
    const theme = chromeTheme();

    card.dataset.scChrome = '';
    card.dataset.scThread = comment.id;
    card.style.cssText =
      'position:fixed;width:280px;background:' +
      theme.card +
      ';color:' +
      theme.text +
      ';color-scheme:' +
      theme.scheme +
      ';border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,.22);pointer-events:auto;z-index:' +
      Z_THREAD +
      ';overflow:hidden;font-family:ui-sans-serif,system-ui,sans-serif;';
    placeThread(card, point);
    isolatePointer(card);

    const header = document.createElement('header');

    header.style.cssText =
      'display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px 8px;border-bottom:1px solid ' +
      theme.line +
      ';';
    header.innerHTML = `<strong style="font-size:13px">${isDraft ? 'Ny kommentar' : comment.resolved ? 'Løst' : 'Kommentar'}</strong>`;

    const close = document.createElement('button');

    close.type = 'button';
    close.style.cssText =
      'all:unset;cursor:pointer;opacity:.55;font-size:16px;padding:0 4px;pointer-events:auto;';
    close.textContent = '×';
    close.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openId = null;
      draft = null;
      paintUi();
    });
    header.appendChild(close);
    card.appendChild(header);

    if (!isDraft) {
      const list = document.createElement('div');

      list.style.cssText =
        'max-height:220px;overflow:auto;padding:10px 12px;display:flex;flex-direction:column;gap:10px;';
      (comment.messages || []).forEach((message) => {
        const row = document.createElement('div');
        const who = document.createElement('div');
        const body = document.createElement('p');

        who.innerHTML = `<span style="font-size:11px;font-weight:650"></span><span style="font-size:10px;opacity:.55;margin-left:6px"></span>`;
        who.children[0].textContent = message.author_name || 'User';
        who.children[1].textContent = timeAgo(message.created_at);
        body.style.cssText = 'margin:3px 0 0;font-size:13px;line-height:1.4;white-space:pre-wrap;word-break:break-word;';
        body.textContent = message.body || '';
        row.append(who, body);
        list.appendChild(row);
      });
      card.appendChild(list);
    }

    const form = document.createElement('form');
    const input = document.createElement('textarea');
    const actions = document.createElement('div');

    form.style.cssText =
      'display:flex;flex-direction:column;gap:8px;padding:10px 12px 12px;border-top:1px solid ' +
      theme.line +
      ';';
    input.placeholder = isDraft ? 'Skriv en kommentar…' : 'Skriv et svar…';
    input.required = true;
    input.value = isDraft ? draft?.body || '' : '';
    input.style.cssText =
      'width:100%;min-height:64px;resize:vertical;border:1px solid ' +
      theme.inputBorder +
      ';border-radius:8px;padding:8px;font:inherit;font-size:13px;box-sizing:border-box;pointer-events:auto;background:' +
      theme.input +
      ';color:inherit;';
    actions.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;';

    input.addEventListener('mousedown', (event) => {
      event.stopPropagation();

      if (document.activeElement !== input) {
        event.preventDefault();
        input.focus();
      }
    });
    input.addEventListener('pointerdown', (event) => event.stopPropagation());
    input.addEventListener('keydown', (event) => event.stopPropagation());
    input.addEventListener('input', () => {
      if (isDraft && draft) {
        draft.body = input.value;
      }
    });

    const submit = document.createElement('button');

    submit.type = 'button';
    submit.textContent = isDraft ? 'Send' : 'Svar';
    submit.style.cssText =
      'cursor:pointer;font:inherit;font-size:12px;font-weight:650;padding:6px 10px;border:0;border-radius:8px;background:' +
      theme.primary +
      ';color:#fff;pointer-events:auto;';
    actions.appendChild(submit);

    if (!isDraft) {
      const resolve = document.createElement('button');

      resolve.type = 'button';
      resolve.textContent = comment.resolved ? 'Åbn igen' : 'Marker som løst';
      resolve.style.cssText =
        'cursor:pointer;font:inherit;font-size:12px;font-weight:650;padding:6px 10px;border:0;border-radius:8px;background:' +
        theme.ghost +
        ';color:inherit;pointer-events:auto;';
      resolve.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleResolved(comment);
      });
      actions.appendChild(resolve);

      const remove = document.createElement('button');

      remove.type = 'button';
      remove.textContent = 'Slet';
      remove.style.cssText =
        'cursor:pointer;font:inherit;font-size:12px;font-weight:650;padding:6px 10px;border:0;border-radius:8px;background:transparent;color:' +
        theme.primary +
        ';pointer-events:auto;';
      remove.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (window.confirm('Slet denne kommentar?')) {
          deleteComment(comment.id);
        }
      });
      actions.appendChild(remove);
    } else {
      const cancel = document.createElement('button');

      cancel.type = 'button';
      cancel.textContent = 'Annuller';
      cancel.style.cssText =
        'cursor:pointer;font:inherit;font-size:12px;font-weight:650;padding:6px 10px;border:0;border-radius:8px;background:' +
        theme.ghost +
        ';color:inherit;pointer-events:auto;';
      cancel.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        draft = null;
        openId = null;
        paintUi();
      });
      actions.appendChild(cancel);
    }

    const send = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const body = input.value.trim();

      if (!body) {
        input.focus();
        return;
      }

      if (isDraft) {
        createComment(body);
      } else {
        replyTo(comment.id, body);
      }
    };

    form.append(input, actions);
    form.addEventListener('submit', send);
    submit.addEventListener('click', send);
    card.appendChild(form);

    return card;
  }

  async function createComment(body) {
    if (!entryId) {
      entryId = currentEntryId();
    }

    if (!draft) {
      return;
    }

    if (!entryId) {
      window.alert('Kommentaren kunne ikke gemmes — entry-id mangler.');
      return;
    }

    try {
      const result = await request(`/!/sve/comments/${encodeURIComponent(entryId)}`, {
        method: 'POST',
        body: JSON.stringify({ visual_id: draft.visual_id, x: draft.x, y: draft.y, body }),
      });

      comments.push(result.comment);
      openId = result.comment.id;
      draft = null;
      fetchedEntryId = entryId;
      paintDockBadge();
      paintUi();
    } catch (error) {
      window.alert(error.message);
    }
  }

  async function replyTo(id, body) {
    try {
      const result = await request(
        `/!/sve/comments/${encodeURIComponent(entryId)}/${encodeURIComponent(id)}/replies`,
        { method: 'POST', body: JSON.stringify({ body }) }
      );

      comments = comments.map((comment) => (comment.id === id ? result.comment : comment));
      openId = id;
      paintUi();
    } catch (error) {
      window.alert(error.message);
    }
  }

  async function toggleResolved(comment) {
    try {
      const result = await request(
        `/!/sve/comments/${encodeURIComponent(entryId)}/${encodeURIComponent(comment.id)}`,
        { method: 'PATCH', body: JSON.stringify({ resolved: !comment.resolved }) }
      );

      comments = comments.map((item) => (item.id === comment.id ? result.comment : item));
      openId = comment.id;
      paintDockBadge();
      paintUi();
    } catch (error) {
      window.alert(error.message);
    }
  }

  async function deleteComment(id) {
    try {
      await request(`/!/sve/comments/${encodeURIComponent(entryId)}/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      comments = comments.filter((comment) => comment.id !== id);
      openId = null;
      paintDockBadge();
      paintUi();
    } catch (error) {
      window.alert(error.message);
    }
  }

  function deselectComments() {
    if (!mode && !commentsPaneOpen()) {
      return;
    }

    const btn = document.querySelector('#__sve-toolbar button[data-tab="comments"]');

    if (btn) {
      btn.click();
      return;
    }

    document.getElementById('__sve-comments-pane')?.remove();
    window.dispatchEvent(new CustomEvent('sve-right-dock-change', { detail: {} }));
  }

  function start() {
    if (started || !allowed()) {
      return;
    }

    started = true;
    bootObserver?.disconnect();
    loadComments();
    syncModeFromDock();

    window.addEventListener('sve-right-dock-change', syncModeFromDock);
    window.addEventListener('popstate', () => {
      fetchedEntryId = null;
      loadComments();
    });
    window.addEventListener('resize', layoutGeometry);
    let lastDark = isDark();
    new MutationObserver(() => {
      const next = isDark();

      if (next === lastDark) {
        return;
      }

      lastDark = next;

      if (mode && openId) {
        paintUi();
      }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    window.addEventListener('message', (event) => {
      const data = event.data;

      if (!data || data.source !== 'sve-comments') {
        return;
      }

      if (data.type === 'mode' && data.payload?.on === false) {
        deselectComments();
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !mode) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      deselectComments();
    });
  }

  function boot() {
    const tryStart = () => start();

    if (window.Statamic?.booted) {
      window.Statamic.booted(tryStart);
    }

    window.addEventListener('load', tryStart);

    bootObserver = new MutationObserver(() => {
      if (document.querySelector('[data-sve-right-pane="comments"]') || document.querySelector('.live-preview-header')) {
        tryStart();
      }
    });
    bootObserver.observe(document.documentElement, { childList: true, subtree: true });
  }

  boot();
}
