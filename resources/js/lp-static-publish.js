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
 * going whether or not this window stays open. So the icon pulses while a run
 * is in flight, and a run already in flight when Live Preview opens — started
 * from the utility page, or by the nightly schedule — is picked up and shown
 * the same way. The notice sits over the preview: the step row while it
 * runs, then "live" and the address on one line. Clicking the address opens
 * it and closes the notice.
 *
 * May import: lib/*, pages.js (the dialog), globals-panel.js (dirty check).
 * Must not import: preview.js, overlay-host.js, bridge.js.
 */
import { t } from './lib/i18n.js';
import { cpRoot } from './lib/config.js';
import { csrfToken } from './lib/csrf.js';
import { injectStyle } from './lib/style.js';
import { lpHeader } from './lib/live-preview.js';
import { previewFrame } from './lib/preview-frame.js';
import { HEADER_SURFACE, LP_CHROME_H, LP_ICON_BTN_STYLE, LP_PUBLISH_ID, LP_RELOAD_ID } from './lib/ids.js';
import { confirmCloseDiscard } from './pages.js';
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
const PROGRESS_ID = '__sve-static-publish-progress';

/** The utility page's four steps, in that order, with the short labels. */
const STEPS = [
  ['generating', 'static_publish_pill_generating'],
  ['verifying', 'static_publish_pill_verifying'],
  ['deploying', 'static_publish_pill_deploying'],
  ['done', 'static_publish_pill_done'],
];

/** How far below the top of the Live Preview the notice sits. 1.875rem is 30px at a 16px root. */
const NOTICE_OFFSET_REM = 1.875;

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
    `@keyframes sve-lp-publish-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.86)}}`
    + `#${LP_PUBLISH_ID}[data-busy] svg[data-icon="publish"]{animation:sve-lp-publish-pulse 1.1s ease-in-out infinite;transform-origin:50% 50%}`
    + `#${LP_PUBLISH_ID}[data-busy]{cursor:progress}`
    + `#${LP_PUBLISH_ID} svg[data-icon="done"]{display:none}`
    + `#${LP_PUBLISH_ID}[data-done] svg[data-icon="done"]{display:block}`
    + `#${LP_PUBLISH_ID}[data-done] svg[data-icon="publish"]{display:none}`
    + `#${PROGRESS_ID},#${CARD_ID}{position:fixed;z-index:2147483645;transform:translateX(-50%);box-sizing:border-box;width:max-content;max-width:min(52rem,calc(100vw - 2rem));background:var(--theme-color-content-bg,#1c1c1c);color:currentColor;border:1px solid color-mix(in srgb,currentColor 12%,transparent);border-radius:.65rem;padding:.4rem .7rem;box-shadow:0 1rem 2.5rem rgba(0,0,0,.35);font-family:ui-sans-serif,system-ui,sans-serif}`
    + `#${PROGRESS_ID} .sve-sp-steps{display:flex;gap:.4rem;flex-wrap:nowrap;align-items:center}`
    + `.sve-sp-step{display:inline-flex;align-items:center;gap:.35em;font-size:.75rem;padding:.2em .65em;border-radius:999px;border:1px solid color-mix(in srgb,currentColor 12%,transparent);opacity:.55;white-space:nowrap}`
    + `.sve-sp-step.is-on{opacity:1;border-color:var(--theme-color-primary,#4f46e5);background:color-mix(in srgb,var(--theme-color-primary,#4f46e5) 14%,transparent)}`
    + `.sve-sp-step.is-done{opacity:1}`
    + `.sve-sp-dot{width:.45em;height:.45em;border-radius:50%;background:currentColor;opacity:.4}`
    + `.sve-sp-step.is-on .sve-sp-dot{opacity:1;background:var(--theme-color-primary,#4f46e5);animation:sve-lp-publish-pulse 1.1s ease-in-out infinite}`
    + `.sve-sp-time{font-size:.75rem;line-height:1;margin-left:.15rem;white-space:nowrap}`
    + `#${CARD_ID}{display:flex;align-items:center;gap:.75rem}`
    + `#${CARD_ID} .sve-sp-title{flex:0 0 auto;font-size:.875rem;font-weight:600;white-space:nowrap}`
    + `#${CARD_ID} .sve-sp-body{font-size:.8125rem;line-height:1.3;opacity:.7}`
    + `#${CARD_ID} a{font-size:.8125rem;line-height:1.2;white-space:nowrap;color:#fff;text-decoration:underline;text-underline-offset:.15em}`
    + `#${CARD_ID} .sve-sp-x{all:unset;cursor:pointer;font-size:1rem;line-height:1;opacity:.5;padding:.1rem .25rem;flex-shrink:0}`);
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
  paintProgress(win);
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

/** Centred on the Live Preview, a short way below its top edge. */
function placeOverPreview(win, card) {
  const frame = previewFrame(win);
  const rect = frame?.getBoundingClientRect();
  const root = parseFloat(win.getComputedStyle(win.document.documentElement).fontSize) || 16;
  const offset = NOTICE_OFFSET_REM * root;

  if (!rect || rect.width < 1) {
    card.style.top = `${offset}px`;
    card.style.left = '50%';

    return;
  }

  card.style.top = `${rect.top + offset}px`;
  card.style.left = `${rect.left + rect.width / 2}px`;
}

function formatElapsed(seconds) {
  const n = Math.max(0, Math.round(Number(seconds) || 0));

  if (n < 60) {
    return `${n} s`;
  }

  return `${Math.floor(n / 60)} min ${n % 60} s`;
}

function elapsedSeconds(run) {
  const start = Date.parse(run?.started_at || '');

  if (Number.isNaN(start)) {
    return 0;
  }

  return Math.max(0, Math.round((Date.now() - start) / 1000));
}

/**
 * The step row, over the preview, for as long as a run is in flight.
 * Replaced by the result card when the run ends.
 */
function paintProgress(win) {
  const doc = win.document;

  if (!(state.running || state.pending)) {
    doc.getElementById(PROGRESS_ID)?.remove();

    return;
  }

  ensureStyle(doc);

  let card = doc.getElementById(PROGRESS_ID);

  if (!card) {
    card = doc.createElement('div');
    card.id = PROGRESS_ID;
    card.setAttribute('role', 'status');
    doc.body.appendChild(card);
  }

  card.replaceChildren();

  const steps = doc.createElement('div');

  steps.className = 'sve-sp-steps';

  const current = STEPS.findIndex(([key]) => key === state.running?.step);

  STEPS.forEach(([, labelKey], index) => {
    const pill = doc.createElement('span');

    pill.className = 'sve-sp-step';

    if (current >= 0 && index < current) {
      pill.classList.add('is-done');
    }

    if (index === current) {
      pill.classList.add('is-on');
    }

    const dot = doc.createElement('span');

    dot.className = 'sve-sp-dot';
    pill.append(dot, doc.createTextNode(t(win, labelKey)));
    steps.appendChild(pill);
  });

  const time = doc.createElement('span');

  time.className = 'sve-sp-time';
  time.textContent = formatElapsed(elapsedSeconds(state.running));
  steps.appendChild(time);

  card.appendChild(steps);
  placeOverPreview(win, card);
}

/**
 * The finished run, on one line in the same place as the step row.
 *
 * The address opens in a new tab and the notice closes with that click.
 * × dismisses it without leaving.
 */
function showCard(win, { title, body, url }) {
  const doc = win.document;

  doc.getElementById(PROGRESS_ID)?.remove();
  doc.getElementById(CARD_ID)?.remove();
  ensureStyle(doc);

  const card = doc.createElement('div');

  card.id = CARD_ID;
  card.setAttribute('role', 'status');

  const text = doc.createElement('div');

  text.className = 'sve-sp-title';
  text.textContent = title;
  card.appendChild(text);

  if (url) {
    const link = doc.createElement('a');

    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = url;
    link.addEventListener('click', () => {
      win.setTimeout(() => card.remove(), 0);
    });
    card.appendChild(link);
  } else if (body) {
    const note = doc.createElement('div');

    note.className = 'sve-sp-body';
    note.textContent = body;
    card.appendChild(note);
  }

  const close = doc.createElement('button');

  close.type = 'button';
  close.className = 'sve-sp-x';
  close.textContent = '×';
  close.title = t(win, 'static_publish_close');
  close.setAttribute('aria-label', close.title);
  close.addEventListener('click', () => card.remove());
  card.appendChild(close);

  doc.body.appendChild(card);
  placeOverPreview(win, card);
}

/** A run that has just come to an end: say how it went. */
function reportFinished(win, run) {
  if (!run) {
    return;
  }

  if (run.status === 'live') {
    showCard(win, {
      title: t(win, 'static_publish_live_title'),
      url: run.url,
    });
    showDone(win);

    return;
  }

  if (run.status === 'verified') {
    showCard(win, { title: t(win, 'static_publish_verified'), body: '' });
    showDone(win);

    return;
  }

  showCard(win, {
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
 * the icon pulsing across that gap instead of flickering.
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
    // missing, a run is already going. Its wording, in the same notice.
    showCard(win, {
      title: t(win, 'static_publish_failed'),
      body: error.message && error.message !== 'absent' ? error.message : '',
    });

    return;
  }

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
    doc.getElementById(PROGRESS_ID)?.remove();

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

  for (const id of [PROGRESS_ID, CARD_ID]) {
    const notice = doc.getElementById(id);

    if (notice) {
      placeOverPreview(win, notice);
    }
  }
}
