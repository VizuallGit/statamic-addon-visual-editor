/**
 * Figma-style comment pins over Live Preview.
 *
 * Pins sit in the Control Panel window on top of the iframe. The list in the
 * right dock is Vue (`CommentsSidebar`). Pin geometry over the iframe is not.
 */
import CommentsSidebar from './cp/surfaces/CommentsSidebar.vue';
import CommentThread from './cp/surfaces/CommentThread.vue';
import CommentPins from './cp/surfaces/CommentPins.vue';
import { commentsSidebar } from './cp/comments/store.js';
import { mountSurface } from './cp/mount.js';
import { mountPane } from './cp/mount-pane.js';

export function initComments() {
  // Settings toggle `comments` (and who may see it) — do not start the
  // document-wide MutationObserver when the tool is off. Reload CP after
  // turning it on; the feature is still in the bundle.
  if (window.Statamic?.$config?.get?.('sveEnabled') === false) {
    return;
  }

  if (window.Statamic?.$config?.get?.('sveFeatures')?.comments === false) {
    return;
  }

  const ROOT_ID = 'sc-cp-root';
  const HIT_ID = 'sc-cp-hit';
  const SIDEBAR_ID = 'sc-sidebar';
  const Z_HIT = '45';
  const Z_PIN = '46';
  const Z_THREAD = '47';
  /** Same as the rest of the editor chrome — not a pill, not 12px. */
  const CHROME_RADIUS = '8px';

  let mode = false;
  let comments = [];
  let entryId = null;
  let fetchedEntryId = null;
  let started = false;
  let openId = null;
  let draft = null;
  let pinFollow = null;
  let sidebarFilter = 'open';
  let bootObserver = null;
  let lastSectionFingerprint = '';
  let orphanTimer = null;
  let orphanWatch = null;
  let pruning = false;
  let sidebarApp = null;
  let threadApp = null;
  let pinsApp = null;

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

      if (commentsPaneOpen()) {
        paintUi();
      }

      return;
    }

    if (id === fetchedEntryId) {
      paintDockBadge();
      syncOrphanComments({ force: true });
      return;
    }

    resetSectionWatch();
    fetchedEntryId = id;

    try {
      const data = await request(`/!/sve/comments/${encodeURIComponent(id)}`);

      comments = data.comments || [];
    } catch {
      comments = [];
    }

    paintDockBadge();

    if (commentsPaneOpen()) {
      paintUi();
    }

    syncOrphanComments({ force: true });
  }

  function openCount() {
    return comments.filter((comment) => !comment.resolved && commentIsOnPage(comment)).length;
  }

  function surfaceIsShown(el) {
    if (!el) {
      return false;
    }

    if (
      el.hidden ||
      el.hasAttribute('data-sve-chrome-hidden') ||
      el.hasAttribute('data-sve-right-folded') ||
      el.hasAttribute('data-sve-right-closed')
    ) {
      return false;
    }

    if (el.style.display === 'none' || el.style.visibility === 'hidden') {
      return false;
    }

    return true;
  }

  function commentsPaneOpen() {
    const host = commentsHost();

    if (!host || !surfaceIsShown(host)) {
      return false;
    }

    const dock = host.closest('#__sve-right-dock');

    if (dock?.hasAttribute('data-sve-right-closed')) {
      return false;
    }

    const pane =
      host.closest('[data-sve-right-pane="comments"]') || host.closest('#__sve-comments-pane');

    return !!pane && surfaceIsShown(pane);
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
      const primary = 'var(--theme-color-primary, #4530D8)';
      const fill = inHead
        ? `color-mix(in oklab, ${primary} 74%, white)`
        : 'currentColor';
      const style = inHead
        ? `display:inline-flex;align-items:center;justify-content:center;margin-left:8px;min-width:16px;height:16px;padding:0 5px;border-radius:999px;background:${fill};color:#fff;font-size:10px;font-weight:700;line-height:1;flex:0 0 auto;box-sizing:border-box;`
        : `position:absolute;top:-2px;right:-2px;display:inline-flex;align-items:center;justify-content:center;min-width:13px;height:13px;padding:0 2px;border-radius:999px;background:${fill};color:inherit;font-size:8px;font-weight:700;line-height:1;text-align:center;pointer-events:none;box-sizing:border-box;box-shadow:0 0 0 2px ${ring};`;

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

  function t(key) {
    return window.Statamic?.$config?.get?.('sveStrings')?.[key] ?? key;
  }

  function setPlaceMode(on) {
    if (!commentsPaneOpen()) {
      mode = false;
      paintPlaceButton();

      return;
    }

    mode = !!on;

    if (!mode) {
      draft = null;

      if (openId === '__draft') {
        openId = null;
      }
    }

    paintUi();
    paintPlaceButton();
  }

  function paintPlaceButton() {
    const btn = document.querySelector('[data-sve-comments-place]');

    if (!btn) {
      return;
    }

    btn.setAttribute('aria-pressed', mode ? 'true' : 'false');
    btn.title = t(mode ? 'comments_place_off' : 'comments_place');
  }

  function syncModeFromDock() {
    const open = commentsPaneOpen();

    paintDockBadge();

    if (!open) {
      mode = false;
      openId = null;
      draft = null;
      stopOrphanWatch();
      teardownUi();
      paintPlaceButton();

      return;
    }

    startOrphanWatch();
    loadComments();
    paintUi();
    paintPlaceButton();
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
      el.closest('[data-sve-chrome]') ||
      el.closest('[data-sve-global]') ||
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

  function chromeVisualId(kind) {
    if (kind === 'header') {
      return '__chrome_header';
    }

    if (kind === 'footer') {
      return '__chrome_footer';
    }

    return null;
  }

  function sectionVisualId(el) {
    if (!el) {
      return '__page';
    }

    const chrome = el.getAttribute?.('data-sve-chrome');
    const chromeId = chromeVisualId(chrome);

    if (chromeId) {
      return chromeId;
    }

    const global = el.hasAttribute?.('data-sve-global')
      ? el
      : el.closest?.('[data-sve-global]');
    const row = global?.getAttribute?.('data-sve-global-row');

    if (row) {
      return row;
    }

    return el.getAttribute?.('data-sid') || '__page';
  }

  function sectionById(doc, id) {
    if (!id || id === '__page') {
      return doc.body || doc.documentElement;
    }

    if (id === '__chrome_header') {
      return doc.querySelector('[data-sve-chrome="header"]');
    }

    if (id === '__chrome_footer') {
      return doc.querySelector('[data-sve-chrome="footer"]');
    }

    const global = doc.querySelector(`[data-sve-global][data-sve-global-row="${cssEscape(id)}"]`);

    if (global) {
      return global;
    }

    const rowMarker = doc.querySelector(`[data-sve-global-row="${cssEscape(id)}"]`);

    if (rowMarker) {
      const root = rowMarker.nextElementSibling?.hasAttribute?.('data-sve-global-root')
        ? rowMarker.nextElementSibling
        : rowMarker.parentElement?.querySelector(':scope > [data-sve-global-root]');

      return (
        root?.querySelector('[data-sid-section-orderable], section[data-sid], article[data-sid]') ||
        root ||
        rowMarker
      );
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
      ';pointer-events:auto;background:rgba(0,0,0,0);cursor:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%234530D8\' d=\'M7 4h10a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H9.5L5 21.5V18H7a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z\'/%3E%3C/svg%3E") 4 20, crosshair;';
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
      visualId = sectionVisualId(section);
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
    unbindPinFollow();
    threadApp?.unmount();
    threadApp = null;
    pinsApp?.unmount();
    pinsApp = null;
    document.getElementById(ROOT_ID)?.remove();
    document.getElementById(SIDEBAR_ID)?.remove();
    sidebarApp?.unmount();
    sidebarApp = null;
    commentsHost()?.replaceChildren();
  }

  function paintUi() {
    if (!commentsPaneOpen()) {
      teardownUi();
      return;
    }

    const wrap = root();

    pinsApp?.unmount();
    pinsApp = null;
    threadApp?.unmount();
    threadApp = null;
    [...wrap.querySelectorAll('[data-sc-chrome]')].forEach((el) => el.remove());

    if (mode) {
      layoutHit();
    } else {
      const hit = document.getElementById(HIT_ID);

      if (hit) {
        setStyle(hit, 'display', 'none');
      }
    }

    const ctx = previewCtx();
    const items = comments.slice();

    if (draft) {
      items.push({ id: '__draft', ...draft, resolved: false, messages: [] });
    }

    const pins = [];
    let openComment = null;
    let openPos = null;

    items.forEach((comment, index) => {
      const section = ctx ? sectionById(ctx.doc, comment.visual_id) : null;

      if (!section && comment.visual_id && comment.visual_id !== '__page' && comment.id !== '__draft') {
        return;
      }

      const pos = section ? screenPos(section, comment.x, comment.y) : fallbackPos(comment);

      pins.push({
        id: comment.id,
        left: pos.left,
        top: pos.top,
        initials: comment.messages?.[0]?.author_initials || String(index + 1),
        resolved: !!comment.resolved,
      });

      if (openId === comment.id) {
        openComment = comment;
        openPos = pos;
      }
    });

    let pinHost = wrap.querySelector('[data-sc-pins]');

    if (!pinHost) {
      pinHost = document.createElement('div');
      pinHost.dataset.scPins = '';
      wrap.appendChild(pinHost);
    }

    pinsApp = mountPane(pinHost, CommentPins, {
      pins,
      zIndex: Z_PIN,
      onToggle: (id) => {
        openId = openId === id ? null : id;

        if (id !== '__draft') {
          draft = null;
        }

        paintUi();

        if (openId) {
          focusComposer();
        }
      },
    });

    if (openComment) {
      const card = threadCard(openComment, openPos);

      wrap.appendChild(card);
      placeThread(card, openPos);
    }

    paintSidebar();

    if (mode || pins.length || openComment) {
      bindPinFollow();
    } else {
      unbindPinFollow();
    }
  }

  function snippet(comment) {
    const text = comment.messages?.[0]?.body || '';

    return text.length > 90 ? `${text.slice(0, 87)}…` : text;
  }

  function headline(value) {
    return String(value || '')
      .replace(/[/_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function elementLabel(el) {
    if (!el) {
      return 'Sektion';
    }

    const chrome = el.getAttribute('data-sve-chrome');

    if (chrome === 'header') {
      return el.getAttribute('data-sve-chrome-label') || 'Header';
    }

    if (chrome === 'footer') {
      return el.getAttribute('data-sve-chrome-label') || 'Footer';
    }

    const global = el.hasAttribute('data-sve-global')
      ? el
      : el.closest?.('[data-sve-global]');

    if (global) {
      const sourceId = global.getAttribute('data-sve-global');
      const saved = window.Statamic?.$config?.get?.('sveSavedSectionLabels')?.[sourceId];
      const title = (saved?.title || '').trim();

      if (title) {
        return `Global: ${title}`;
      }

      const type = (global.getAttribute('data-sid-type') || saved?.section_type || '').trim();

      return `Global: ${headline(type) || 'sektion'}`;
    }

    const label = (el.getAttribute('data-sid-label') || '').trim();
    const type = (el.getAttribute('data-sid-type') || '').trim();

    if (label && !label.includes('/')) {
      return label;
    }

    return headline(type || label) || 'Sektion';
  }

  function commentLabel(comment) {
    if (!comment.visual_id || comment.visual_id === '__page') {
      return 'Hele siden';
    }

    const ctx = previewCtx();
    const el = ctx ? sectionById(ctx.doc, comment.visual_id) : null;

    return elementLabel(el);
  }

  function commentIsOnPage(comment) {
    if (!comment?.visual_id || comment.visual_id === '__page' || comment.id === '__draft') {
      return true;
    }

    const ctx = previewCtx();

    if (!ctx || !collectPageSections(ctx.doc).length) {
      return true;
    }

    return !!sectionById(ctx.doc, comment.visual_id);
  }

  function collectPageSections(doc) {
    if (!doc) {
      return [];
    }

    const seen = new Set();
    const items = [];

    doc.querySelectorAll('[data-sve-chrome], [data-sve-global], [data-sid-section-orderable]').forEach((el) => {
      const id = sectionVisualId(el);

      if (!id || id === '__page' || seen.has(id)) {
        return;
      }

      if (el.hasAttribute('data-sid-section-orderable') && el.closest('[data-sve-chrome]')) {
        return;
      }

      // One picker row per synced global — not each inner source section.
      if (
        el.hasAttribute('data-sid-section-orderable') &&
        !el.hasAttribute('data-sve-global') &&
        el.closest('[data-sve-global]')
      ) {
        return;
      }

      seen.add(id);
      items.push({ id, label: elementLabel(el), el });
    });

    // Before the bridge tags [data-sve-global], template markers are enough.
    doc.querySelectorAll('[data-sve-global-root]').forEach((root) => {
      const row =
        root.previousElementSibling?.getAttribute('data-sve-global-row') ||
        root.parentElement?.querySelector(':scope > [data-sve-global-row]')?.getAttribute('data-sve-global-row');

      if (!row || seen.has(row)) {
        return;
      }

      const el =
        root.querySelector('[data-sid-section-orderable], section[data-sid], article[data-sid]') || root;
      const sourceId = root.getAttribute('data-sve-global-root');
      const saved = window.Statamic?.$config?.get?.('sveSavedSectionLabels')?.[sourceId];
      const title = (saved?.title || '').trim();
      const type = (el.getAttribute?.('data-sid-type') || saved?.section_type || '').trim();
      const label = title ? `Global: ${title}` : `Global: ${headline(type) || 'sektion'}`;

      seen.add(row);
      items.push({ id: row, label, el });
    });

    const counts = {};

    items.forEach((item) => {
      counts[item.label] = (counts[item.label] || 0) + 1;
    });

    const seenLabel = {};

    return items.map((item) => {
      if (counts[item.label] < 2) {
        return item;
      }

      seenLabel[item.label] = (seenLabel[item.label] || 0) + 1;

      return { ...item, label: `${item.label} (${seenLabel[item.label]})` };
    });
  }

  function pickerOptions(currentId) {
    const ctx = previewCtx();
    const sections = ctx ? collectPageSections(ctx.doc) : [];
    const options = sections.map((section) => ({ id: section.id, label: section.label }));

    if (!options.some((option) => option.id === '__page')) {
      options.push({ id: '__page', label: 'Hele siden' });
    }

    if (currentId && !options.some((option) => option.id === currentId)) {
      const el = ctx ? sectionById(ctx.doc, currentId) : null;

      options.unshift({
        id: currentId,
        label: el ? elementLabel(el) : 'Sektion (fjernet)',
      });
    }

    return options;
  }

  function resetSectionWatch() {
    lastSectionFingerprint = '';
    clearTimeout(orphanTimer);
    orphanTimer = null;
  }

  function sectionFingerprint(doc) {
    return collectPageSections(doc)
      .map((section) => section.id)
      .join('|');
  }

  function syncOrphanComments({ force = false } = {}) {
    const ctx = previewCtx();

    if (!ctx || !entryId) {
      return;
    }

    const sections = collectPageSections(ctx.doc);

    if (!sections.length) {
      return;
    }

    const fingerprint = sectionFingerprint(ctx.doc);

    if (!force && fingerprint === lastSectionFingerprint) {
      return;
    }

    const first = lastSectionFingerprint === '';

    lastSectionFingerprint = fingerprint;
    clearTimeout(orphanTimer);
    orphanTimer = setTimeout(
      () => pruneMissingSections(),
      first && !force ? 700 : 80
    );
  }

  function startOrphanWatch() {
    if (orphanWatch) {
      return;
    }

    orphanWatch = window.setInterval(() => {
      if (!commentsPaneOpen()) {
        stopOrphanWatch();
        return;
      }

      syncOrphanComments();
    }, 600);
  }

  function stopOrphanWatch() {
    if (!orphanWatch) {
      return;
    }

    window.clearInterval(orphanWatch);
    orphanWatch = null;
  }

  function missingVisualIds(doc) {
    return [
      ...new Set(
        comments
          .filter((comment) => {
            const id = comment.visual_id;

            if (!id || id === '__page') {
              return false;
            }

            return !sectionById(doc, id);
          })
          .map((comment) => comment.visual_id)
      ),
    ];
  }

  async function pruneMissingSections() {
    const ctx = previewCtx();

    if (!ctx || !entryId || pruning) {
      return;
    }

    if (!collectPageSections(ctx.doc).length) {
      return;
    }

    const gone = missingVisualIds(ctx.doc);

    if (!gone.length) {
      return;
    }

    pruning = true;

    try {
      const result = await request(`/!/sve/comments/${encodeURIComponent(entryId)}/prune`, {
        method: 'POST',
        body: JSON.stringify({ visual_ids: gone }),
      });

      comments = result.comments || comments.filter((comment) => !gone.includes(comment.visual_id));

      if (openId && openId !== '__draft' && !comments.some((comment) => comment.id === openId)) {
        openId = null;
      }

      paintDockBadge();

      if (commentsPaneOpen()) {
        paintUi();
      }
    } catch {
      /* preview may still be loading */
    } finally {
      pruning = false;
    }
  }

  async function assignSection(comment, visualId) {
    if (!visualId || visualId === comment.visual_id) {
      return;
    }

    if (comment.id === '__draft' && draft) {
      draft.visual_id = visualId;
      paintUi();
      focusComposer();
      return;
    }

    try {
      const result = await request(
        `/!/sve/comments/${encodeURIComponent(entryId)}/${encodeURIComponent(comment.id)}`,
        { method: 'PATCH', body: JSON.stringify({ visual_id: visualId }) }
      );

      comments = comments.map((item) => (item.id === comment.id ? result.comment : item));
      openId = comment.id;
      paintUi();
      focusComposer();
    } catch (error) {
      window.alert(error.message);
    }
  }

  function sectionPicker(comment, theme) {
    const wrap = document.createElement('div');
    const label = document.createElement('label');
    const select = document.createElement('select');
    const options = pickerOptions(comment.visual_id);

    wrap.style.cssText = 'padding:8px 12px;display:flex;flex-direction:column;gap:4px;';
    label.textContent = 'Sektion';
    label.htmlFor = 'sc-section-' + comment.id;
    label.style.cssText =
      'font-size:10px;font-weight:650;opacity:.55;letter-spacing:.02em;text-transform:uppercase;';
    select.id = label.htmlFor;
    select.style.cssText =
      'box-sizing:border-box;display:block;width:100%;font:inherit;font-size:12px;padding:6px 8px;border-radius:' +
      CHROME_RADIUS +
      ';border:1px solid ' +
      theme.inputBorder +
      ';background:' +
      theme.input +
      ';color:inherit;color-scheme:' +
      theme.scheme +
      ';cursor:pointer;';

    options.forEach((option) => {
      const node = document.createElement('option');

      node.value = option.id;
      node.textContent = option.label;
      node.selected = option.id === comment.visual_id;
      select.appendChild(node);
    });

    select.value = comment.visual_id || '__page';
    select.addEventListener('mousedown', (event) => event.stopPropagation());
    select.addEventListener('pointerdown', (event) => event.stopPropagation());
    select.addEventListener('change', () => assignSection(comment, select.value));
    wrap.append(label, select);

    return wrap;
  }

  function paintSidebar() {
    const panel = commentsHost();

    if (!panel) {
      return;
    }

    if (!commentsPaneOpen()) {
      sidebarApp?.unmount();
      sidebarApp = null;
      panel.replaceChildren();
      return;
    }

    const alive = comments.filter((comment) => commentIsOnPage(comment));
    const open = alive.filter((comment) => !comment.resolved);
    const shown = sidebarFilter === 'open' ? open : alive;

    commentsSidebar.filter = sidebarFilter;
    commentsSidebar.mode = mode;
    commentsSidebar.openCount = open.length;
    commentsSidebar.allCount = alive.length;
    commentsSidebar.rows = shown.map((comment) => {
      const first = comment.messages?.[0] || {};

      return {
        id: comment.id,
        author: first.author_name || 'User',
        time: timeAgo(first.created_at),
        where: comment.resolved ? `Løst · ${commentLabel(comment)}` : commentLabel(comment),
        snippet: snippet(comment) || 'Kommentar',
        resolved: !!comment.resolved,
        active: openId === comment.id,
      };
    });
    commentsSidebar.onFilter = (id) => {
      sidebarFilter = id;
      paintSidebar();
    };
    commentsSidebar.onReveal = (id) => {
      const comment = comments.find((item) => item.id === id);

      if (comment) {
        revealComment(comment);
      }
    };

    if (!sidebarApp) {
      panel.replaceChildren();
      sidebarApp = mountSurface(CommentsSidebar, panel);
    }
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
    if (!commentsPaneOpen()) {
      return;
    }

    if (mode) {
      layoutHit();
    }

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

      if (!section && comment.visual_id && comment.visual_id !== '__page' && comment.id !== '__draft') {
        return;
      }

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
    const pad = 8;
    const cardW = 280;
    const gap = 22;
    const rightBound = ir?.right || window.innerWidth;
    const leftBound = ir?.left || 0;
    const topBound = (ir?.top ?? 0) + pad;
    const bottomBound = (ir?.bottom || window.innerHeight) - pad;
    const frameH = Math.max(160, bottomBound - topBound);

    card.style.maxHeight = `${frameH}px`;
    card.style.overflowY = 'auto';

    const spaceRight = rightBound - point.left;
    let left = spaceRight < cardW + gap ? point.left - cardW - pad : point.left + gap;

    left = Math.min(Math.max(leftBound + pad, left), Math.max(leftBound + pad, rightBound - cardW - pad));

    const height = Math.min(card.offsetHeight || 280, frameH);
    const preferBelow = point.top - pad;
    const fitsBelow = preferBelow + height <= bottomBound;
    let top;

    if (fitsBelow) {
      top = preferBelow;
    } else {
      top = point.top - height + pad;

      if (top < topBound) {
        top = topBound;
      }
    }

    if (top + height > bottomBound) {
      top = Math.max(topBound, bottomBound - height);
    }

    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
  }

  function unbindPinFollow() {
    if (!pinFollow) {
      return;
    }

    pinFollow.win?.removeEventListener('scroll', pinFollow.onMove);
    window.removeEventListener('scroll', pinFollow.onMove);
    pinFollow = null;
  }

  function bindPinFollow() {
    unbindPinFollow();

    if (!commentsPaneOpen()) {
      return;
    }

    const ctx = previewCtx();
    const onMove = () => {
      if (!commentsPaneOpen()) {
        unbindPinFollow();
        return;
      }

      layoutGeometry();
    };

    pinFollow = { win: ctx?.win || null, onMove };
    pinFollow.win?.addEventListener('scroll', onMove, { passive: true });
    window.addEventListener('scroll', onMove, { passive: true });
    layoutGeometry();
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
    const host = document.createElement('div');
    const isDraft = comment.id === '__draft';
    const theme = { ...chromeTheme(), radius: CHROME_RADIUS };
    const options = pickerOptions(comment.visual_id);

    host.dataset.scChrome = '';
    host.dataset.scThread = String(comment.id);
    host.style.cssText =
      'position:fixed;width:280px;z-index:' +
      Z_THREAD +
      ';pointer-events:auto;';

    threadApp?.unmount();
    threadApp = mountSurface(CommentThread, host, {
      theme,
      threadId: String(comment.id),
      zIndex: Number(Z_THREAD),
      title: isDraft ? 'Ny kommentar' : comment.resolved ? 'Løst' : 'Kommentar',
      isDraft,
      resolved: !!comment.resolved,
      sectionLabel: 'Sektion',
      sectionOptions: options,
      sectionValue: comment.visual_id || '__page',
      messages: (comment.messages || []).map((message) => ({
        author: message.author_name || 'User',
        time: timeAgo(message.created_at),
        body: message.body || '',
      })),
      placeholder: isDraft ? 'Skriv en kommentar…' : 'Skriv et svar…',
      draftBody: isDraft ? draft?.body || '' : '',
      submitLabel: isDraft ? 'Send' : 'Svar',
      resolveLabel: comment.resolved ? 'Åbn igen' : 'Marker som løst',
      deleteLabel: 'Slet',
      cancelLabel: 'Annuller',
      onClose: () => {
        openId = null;
        draft = null;
        paintUi();
      },
      onAssign: (value) => assignSection(comment, value),
      onSend: (body) => {
        const text = String(body || '').trim();

        if (!text) {
          return;
        }

        if (isDraft) {
          createComment(text);
        } else {
          replyTo(comment.id, text);
        }
      },
      onResolve: () => toggleResolved(comment),
      onDelete: () => {
        if (window.confirm('Slet denne kommentar?')) {
          deleteComment(comment.id);
        }
      },
      onCancel: () => {
        draft = null;
        openId = null;
        paintUi();
      },
      onDraftInput: (value) => {
        if (isDraft && draft) {
          draft.body = value;
        }
      },
    });

    isolatePointer(host);

    return host;
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
    if (mode) {
      setPlaceMode(false);
    }
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
    window.addEventListener('sve-comments-place', () => setPlaceMode(!mode));
    document.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-sve-comments-place]');

      if (!btn) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setPlaceMode(!mode);
    });
    window.addEventListener('popstate', () => {
      fetchedEntryId = null;
      resetSectionWatch();
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

      if (commentsPaneOpen() && openId) {
        paintUi();
      }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    window.addEventListener('message', (event) => {
      const data = event.data;

      if (data?.name === 'statamic.preview.updated') {
        if (commentsPaneOpen()) {
          syncOrphanComments({ force: true });
          bindPinFollow();
        }

        return;
      }

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
