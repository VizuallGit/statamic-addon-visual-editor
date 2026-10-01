/**
 * Publish the site as static files to Cloudflare, from Live Preview.
 *
 * The work itself belongs to another addon — `statamic-addon/static-publish`,
 * whose utility page at /cp/utilities/static-publish already generates the
 * copy, verifies it and deploys it. This is only a second door to the same
 * two routes, placed where the author already is: one icon in the top bar,
 * so publishing does not mean leaving the page you were editing.
 *
 * Nothing here knows how publishing works. It asks `state`, it posts
 * `publish`, and it reads back `running.step` and the finished run's `url`.
 * If that addon is not installed the route 404s and the button is never
 * drawn; if it is installed but the site is set to Server rather than Static,
 * the button is not drawn either — publishing a site that is served by PHP
 * is not a thing to offer.
 *
 * The run outlives the click: the command is spawned with nohup and keeps
 * going whether or not this window stays open. So the icon spins while a run
 * is in flight, and a run already in flight when Live Preview opens — started
 * from the utility page, or by the nightly schedule — is picked up and shown
 * the same way.
 *
 * May import: lib/*, pages.js (the dialog), globals-panel.js (dirty check).
 * Must not import: preview.js, overlay-host.js, bridge.js.
 */
import { t } from './lib/i18n.js';
import { cpRoot } from './lib/config.js';
import { csrfToken } from './lib/csrf.js';
import { injectStyle } from './lib/style.js';
import { lpHeader } from './lib/live-preview.js';
import { HEADER_SURFACE, LP_CHROME_H, LP_ICON_BTN_STYLE, LP_PUBLISH_ID, LP_RELOAD_ID } from './lib/ids.js';
import { confirmCloseDiscard, dialogCardStyle } from './pages.js';
import { hasUnsavedWork } from './globals-panel.js';

/**
 * Both icons sit in the button at once and `data-done` decides which shows —
 * the same shape as the reload button, and for the same reason: the ensure
 * function compares innerHTML on every pass, so a second markup would be put
 * back on the next one. Every attribute carries a value so the browser's
 * serialisation matches this string exactly.
 */
const ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-icon="publish">' +
  '<path d="M12 13v8"></path>' +
  '<path d="m8 17 4-4 4 4"></path>' +
  '<path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>' +
  '</svg>' +
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
  'stroke="#16a34a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-icon="done">' +
  '<polyline points="20 6 9 17 4 12"></polyline>' +
  '</svg>';

const STYLE_ID = '__sve-lp-static-publish-style';
const CARD_ID = '__sve-static-publish-card';

/** How long the green check stays before the cloud icon comes back. */
const DONE_MS = 4000;

/** Between two `state` calls while a run is in flight. The utility page uses the same. */
const POLL_MS = 2000;

/**
 * How long before asking again when the answer was “not a static site”. The
 * author can flip that switch on the utility page and come straight back here
 * without the Control Panel ever loading again, so a single answer kept for
 * the session would leave the button missing with no way to bring it out. A
 * 404 — the addon is not installed — is kept forever: that cannot change
 * without a deploy.
 */
const RECHECK_MS = 30000;

const state = {
  /** null = not asked yet, true/false = whether to draw the button. */
  show: null,
  /** Set once the route 404s: the addon is not installed, stop asking. */
  absent: false,
  asking: false,
  askedAt: 0,
  /** Id of the newest run we knew of when Publish was pressed. */
  lastId: null,
  /** True between the POST and the run showing up in `state`. */
  pending: false,
  running: null,
  timer: 0,
  doneTimer: 0,
};

function ensureStyle(doc) {
  injectStyle(doc, STYLE_ID,
    `@keyframes sve-lp-publish-spin{to{transform:rotate(360deg)}}`
    + `#${LP_PUBLISH_ID}[data-busy] svg[data-icon="publish"]{animation:sve-lp-publish-spin 1.2s linear infinite;transform-origin:50% 50%}`
    + `#${LP_PUBLISH_ID}[data-busy]{cursor:progress}`
    + `#${LP_PUBLISH_ID} svg[data-icon="done"]{display:none}`
    + `#${LP_PUBLISH_ID}[data-done] svg[data-icon="done"]{display:block}`
    + `#${LP_PUBLISH_ID}[data-done] svg[data-icon="publish"]{display:none}`);
}

/**
 * The other addon's utility routes. Statamic mounts them under the utility's
 * own URL, which is where its own page calls them from — from here the path
 * has to be spelled out, because we are on an entry's URL, not on that page.
 */
function routeUrl(win, path) {
  return `${cpRoot(win)}/utilities/static-publish/${path}`;
}

async function call(win, path, options) {
  const res = await win.fetch(routeUrl(win, path), {
    headers: {
      'X-CSRF-TOKEN': csrfToken(win),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    ...(options || {}),
  });

  // 404: no such utility — the addon is not installed here. Said apart from
  // every other failure, because it is the one that is not an error.
  if (res.status === 404) {
    state.absent = true;

    throw new Error('absent');
  }

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.error || body.message || `${res.status}`);
  }

  return body;
}

/** Danish for the step the run reports, or nothing for a step we do not know. */
function stepLabel(win, step) {
  const key = `static_publish_step_${step}`;
  const label = t(win, key);

  return label === key ? '' : label;
}

function paintTitle(win, pill) {
  if (pill.hasAttribute('data-done')) {
    pill.title = t(win, 'static_publish_live_title');
  } else if (state.running || state.pending) {
    const step = stepLabel(win, state.running?.step);

    pill.title = step ? `${t(win, 'static_publish_busy')} · ${step}` : t(win, 'static_publish_busy');
  } else {
    pill.title = t(win, 'static_publish_title');
  }

  pill.setAttribute('aria-label', pill.title);
}

function paintBusy(win) {
  const pill = win.document.getElementById(LP_PUBLISH_ID);

  if (!pill) {
    return;
  }

  if (state.running || state.pending) {
    pill.setAttribute('data-busy', '');
    pill.removeAttribute('data-done');
  } else {
    pill.removeAttribute('data-busy');
  }

  paintTitle(win, pill);
}

function showDone(win) {
  const pill = win.document.getElementById(LP_PUBLISH_ID);

  if (!pill) {
    return;
  }

  win.clearTimeout(state.doneTimer);
  pill.setAttribute('data-done', '');
  paintTitle(win, pill);

  state.doneTimer = win.setTimeout(() => {
    pill.removeAttribute('data-done');
    paintTitle(win, pill);
  }, DONE_MS);
}

/**
 * The finished run, as a card in the corner — not a toast.
 *
 * A toast says a sentence and goes. What the author wants at the end of a
 * publish is the address, to click, and the run took long enough that they
 * are probably looking at something else by then. So it stays until it is
 * closed, and the address is a real link.
 */
function showCard(win, { tone, title, body, url }) {
  const doc = win.document;

  doc.getElementById(CARD_ID)?.remove();

  const card = doc.createElement('div');

  card.id = CARD_ID;
  card.style.cssText =
    `${dialogCardStyle(win).replace('width:400px', 'width:340px')}` +
    'position:fixed;right:18px;bottom:18px;z-index:2147483645;padding:16px 18px;' +
    'font-family:ui-sans-serif,system-ui,sans-serif;' +
    `border-left:3px solid ${tone === 'error' ? '#dc2626' : '#16a34a'};`;

  const head = doc.createElement('div');

  head.style.cssText = 'display:flex;align-items:flex-start;gap:10px;';

  const text = doc.createElement('div');

  text.style.cssText = 'flex:1;min-width:0;';
  text.innerHTML =
    `<div style="font-size:13px;font-weight:600;margin-bottom:2px;"></div>` +
    `<div style="font-size:12px;opacity:.7;line-height:1.45;"></div>`;
  text.children[0].textContent = title;
  text.children[1].textContent = body || '';

  const close = doc.createElement('button');

  close.type = 'button';
  close.textContent = '×';
  close.title = t(win, 'static_publish_close');
  close.style.cssText =
    'all:unset;cursor:pointer;font-size:16px;line-height:1;opacity:.5;padding:2px 4px;flex-shrink:0;';
  close.addEventListener('click', () => card.remove());

  head.append(text, close);
  card.appendChild(head);

  if (url) {
    const link = doc.createElement('a');

    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = url;
    link.style.cssText =
      'display:block;margin-top:10px;font-size:12px;word-break:break-all;' +
      'color:var(--theme-color-primary,#4f46e5);text-decoration:underline;';
    card.appendChild(link);
  }

  doc.body.appendChild(card);
}

/** A run that has just come to an end: say how it went. */
function reportFinished(win, run) {
  if (!run) {
    return;
  }

  if (run.status === 'live') {
    const report = run.report;

    showCard(win, {
      tone: 'ok',
      title: t(win, 'static_publish_live_title'),
      body: report
        ? t(win, 'static_publish_live_body', {
          pages: report.pages,
          files: report.files,
          seconds: Math.round(run.duration || 0),
        })
        : '',
      url: run.url,
    });
    showDone(win);

    return;
  }

  if (run.status === 'verified') {
    showCard(win, { tone: 'ok', title: t(win, 'static_publish_verified'), body: '' });
    showDone(win);

    return;
  }

  showCard(win, {
    tone: 'error',
    title: t(win, 'static_publish_failed'),
    body: run.error || '',
  });
}

function stopPolling(win) {
  win.clearInterval(state.timer);
  state.timer = 0;
}

function startPolling(win) {
  if (state.timer) {
    return;
  }

  state.timer = win.setInterval(() => {
    // The editor has gone (navigated away inside the CP). Nothing left to
    // paint, and the run carries on server-side either way.
    if (!win.document.getElementById(LP_PUBLISH_ID)) {
      stopPolling(win);

      return;
    }

    void poll(win);
  }, POLL_MS);
}

/**
 * Read `state` and fold it into ours.
 *
 * `pending` is the gap the utility page also has to cover: a run that has
 * just been asked for has no file on disk until its process has booted, so
 * for a second or two `state` answers with nothing running and the run we
 * knew of before still newest. Clearing `pending` only once a run is in
 * flight — or once a run newer than the one we knew appears — is what keeps
 * the icon spinning across that gap instead of flickering.
 */
async function poll(win) {
  let answer;

  try {
    answer = await call(win, 'state');
  } catch {
    // A failed poll is not a failed publish. Keep the icon as it is and ask
    // again on the next tick; a run that really ended will be read then.
    return;
  }

  const wasWaiting = !!(state.running || state.pending);
  const runs = answer.runs || [];
  const newest = runs[0] || null;
  const isNew = !!newest && newest.id !== state.lastId;

  state.running = answer.running || null;

  if (state.pending && (state.running || isNew)) {
    state.pending = false;
  }

  if (state.running || state.pending) {
    startPolling(win);
    paintBusy(win);

    return;
  }

  stopPolling(win);
  paintBusy(win);

  if (!newest) {
    return;
  }

  // A run came to an end since the last poll. `wasWaiting` alone is not the
  // test: a short run can finish inside one poll's two seconds, so it is
  // never once seen in flight — it arrives already done, as a run newer than
  // the one we knew. Either shape is a run to report; a poll that only
  // repeats what we already knew is not.
  const finished = wasWaiting && isNew;

  state.lastId = newest.id;

  if (finished) {
    reportFinished(win, newest);
  }
}

async function startPublish(win) {
  const pill = win.document.getElementById(LP_PUBLISH_ID);

  state.pending = true;
  paintBusy(win);

  try {
    await call(win, 'publish', { method: 'POST', body: '{}' });
  } catch (error) {
    state.pending = false;
    paintBusy(win);

    // Whatever the other addon said — the site is on Server, credentials are
    // missing, a run is already going. Its wording, not a second copy here.
    win.Statamic?.$toast?.error(error.message || t(win, 'static_publish_failed'));

    return;
  }

  win.Statamic?.$toast?.success(t(win, 'static_publish_started'));

  if (pill) {
    paintTitle(win, pill);
  }

  startPolling(win);
  void poll(win);
}

/**
 * Unsaved work does not reach the copy: the generator reads what is on disk.
 * So it is said before the run starts, with no Save button on the card —
 * saving is the author's own move, with their own Save, and a publish that
 * quietly saved the page first would be a surprise in the wrong direction.
 */
function onPublishClick(win, event) {
  event.preventDefault();
  event.stopPropagation();

  if (state.running || state.pending) {
    return;
  }

  if (hasUnsavedWork(win)) {
    confirmCloseDiscard(
      win,
      {
        titleKey: 'static_publish_dirty_title',
        bodyKey: 'static_publish_dirty_body',
        confirmKey: 'static_publish_dirty_confirm',
      },
      () => void startPublish(win)
    );

    return;
  }

  void startPublish(win);
}

/**
 * Ask the other addon whether there is anything to draw — once, then again
 * every RECHECK_MS for as long as the answer is no.
 */
function probe(win) {
  if (state.absent || state.asking) {
    return;
  }

  if (state.show && state.askedAt) {
    return;
  }

  if (state.askedAt && win.Date.now() - state.askedAt < RECHECK_MS) {
    return;
  }

  state.asking = true;
  state.askedAt = win.Date.now();

  void call(win, 'state')
    .then((answer) => {
      state.show = answer?.settings?.mode === 'static';
      state.running = answer?.running || null;
      state.lastId = answer?.runs?.[0]?.id ?? null;

      // Started elsewhere — the utility page, or the nightly run — and still
      // going when the editor opened. Show it the same way as our own.
      if (state.running) {
        startPolling(win);
      }
    })
    .catch(() => {
      state.show = false;
    })
    .finally(() => {
      state.asking = false;
    });
}

/**
 * Called from syncLpRightBarGaps on every pass, like the reload button: it is
 * the one place that runs in every state the editor can open in. Idempotent —
 * it does not move anything that already stands right.
 */
export function ensureLpStaticPublishButton(win) {
  const doc = win.document;
  const header = lpHeader(doc);
  const anchor = doc.getElementById(LP_RELOAD_ID);

  if (!header || !anchor) {
    return;
  }

  probe(win);

  if (!state.show) {
    doc.getElementById(LP_PUBLISH_ID)?.remove();

    return;
  }

  ensureStyle(doc);

  let pill = doc.getElementById(LP_PUBLISH_ID);

  if (!pill) {
    pill = doc.createElement('button');
    pill.id = LP_PUBLISH_ID;
    pill.type = 'button';
    pill.style.cssText = `${LP_ICON_BTN_STYLE}flex-shrink:0;`;
    pill.addEventListener('click', (event) => onPublishClick(win, event));
  }

  if (pill.innerHTML !== ICON_SVG) {
    pill.innerHTML = ICON_SVG;
  }

  paintBusy(win);
  pill.style.opacity = '1';
  pill.style.background = HEADER_SURFACE;
  pill.style.padding = '0';
  pill.style.width = `${LP_CHROME_H - 4}px`;
  pill.style.height = `${LP_CHROME_H}px`;
  pill.style.borderRadius = '.5rem';
  pill.style.marginLeft = '0';
  pill.style.marginRight = '0';

  // Right of reload. Never moved when it is already there: a Node.after on
  // every observer pass freezes Live Preview.
  if (pill.parentElement !== anchor.parentElement || pill.previousElementSibling !== anchor) {
    anchor.after(pill);
  }
}
