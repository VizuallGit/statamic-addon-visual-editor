/**
 * «Whole site» in Build → Animation → Page transition: how every page of the
 * site changes to the next. One state for every panel that shows it, read
 * once from the server and saved there (PageTransitionSettings via
 * /!/sve/page-transitions); the site gets the CSS on its next page load.
 *
 * Owner: Build mode (BuildPageTransition.vue).
 * May import: lib/csrf.js. The panel hands in Vue's `reactive` the first time
 * it asks, so this file stays plain and its tests run without Vue.
 */
import { csrfToken } from './lib/csrf.js';

export const SITE_STYLES = ['fade', 'crossfade', 'slide', 'none'];

/** What the site does before anything is saved: the browser's own crossfade. */
export const SITE_DEFAULTS = Object.freeze({ enabled: true, style: 'crossfade', duration: 0.25, header: false });

export const DURATION = Object.freeze({ min: 0.1, max: 1.5, step: 0.05 });

/**
 * The length a style starts at when it is picked: long enough to see what it
 * does (at 0.25 s fade, crossfade and none look alike). Duration can be
 * changed after.
 */
export const STYLE_DURATION = Object.freeze({ fade: 0.6, crossfade: 0.5, slide: 0.6, none: 0.25 });

const ENDPOINT = '/!/sve/page-transitions';
const HEADERS = { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' };

let state = null;

function stateOf(wrap = (raw) => raw) {
  state ??= wrap({ status: 'idle', saved: false, settings: { ...SITE_DEFAULTS } });

  return state;
}

/** A duration as the server keeps it: seconds, inside the range, two decimals. */
export function cleanDuration(raw) {
  const n = Number(String(raw ?? '').replace(',', '.'));

  return Number.isFinite(n)
    ? Math.round(Math.min(DURATION.max, Math.max(DURATION.min, n)) * 100) / 100
    : SITE_DEFAULTS.duration;
}

async function load(win) {
  const state = stateOf();

  state.status = 'loading';

  try {
    const res = await win.fetch(ENDPOINT, { credentials: 'same-origin', headers: HEADERS });
    const body = await res.json();

    state.saved = !!body?.saved;
    state.settings = { ...SITE_DEFAULTS, ...(body?.settings || {}) };
    state.status = 'ready';
  } catch {
    state.status = 'unread';
  }
}

/** The shared state, read from the server the first time a panel asks; `wrap` is Vue's `reactive`. */
export function siteTransitions(win = window, wrap = undefined) {
  const state = stateOf(wrap);

  if (state.status === 'idle') {
    load(win);
  }

  return state;
}

/** One or more settings changed and saved; the state follows what the server kept. */
export async function saveSiteTransitions(patch, win = window) {
  const state = stateOf();
  const next = { ...state.settings, ...patch };

  next.duration = cleanDuration(next.duration);
  state.settings = next;
  state.status = 'saving';

  try {
    const res = await win.fetch(ENDPOINT, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { ...HEADERS, 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken(win) },
      body: JSON.stringify({ settings: next }),
    });
    const body = await res.json().catch(() => null);

    if (!res.ok || !body?.ok) {
      throw new Error('not saved');
    }

    state.settings = { ...SITE_DEFAULTS, ...body.settings };
    state.saved = true;
    state.status = 'ready';
  } catch {
    state.status = 'failed';
  }
}
