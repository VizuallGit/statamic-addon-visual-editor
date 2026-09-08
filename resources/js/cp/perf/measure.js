/**
 * What the front end weighs, measured on the front end.
 *
 * Live Preview is the wrong instrument for this and always will be: it carries
 * the bridge, the editor's own stylesheet, an Alpine morph and a page rendered
 * from unsaved values. So nothing here reads that iframe. The page is loaded
 * once more, on its public address, into a frame of our own that is thrown away
 * the moment the numbers are out of it.
 *
 * Same origin as the Control Panel, which is the whole reason this can be done
 * in the browser at all: resource timing, the vitals observers and every <img>
 * on the page are readable across the frame without a server, a key or a round
 * trip to anyone.
 *
 * Honest about what it is: an unthrottled load on the machine you are sitting
 * at. It answers "what does this page weigh and where is the weight", which is
 * the question you can act on. It does not answer "what does this feel like on
 * a phone on 4G" — nothing running locally can.
 */

const VIEWPORT_W = 1440;
const VIEWPORT_H = 900;

/** Give up rather than leave a frame loading behind a panel forever. */
const LOAD_TIMEOUT = 25000;

/** After load: webfonts, deferred scripts and the last of the images. */
const SETTLE_MS = 700;

/** The scroll-through that wakes lazy images. Capped — a long page is still one page. */
const MAX_SCROLL_STEPS = 24;
const SCROLL_WAIT = 140;

const FONT_RE = /\.(woff2?|ttf|otf|eot)(\?|#|$)/i;
const IMAGE_RE = /\.(png|jpe?g|gif|webp|avif|svg|ico|bmp)(\?|#|$)/i;
const MEDIA_RE = /\.(mp4|webm|mov|m4v|ogg|oga|mp3|wav)(\?|#|$)/i;
const SCRIPT_RE = /\.(m?js|jsx)(\?|#|$)/i;
const STYLE_RE = /\.css(\?|#|$)/i;

/**
 * Which bucket a request belongs in.
 *
 * `initiatorType` is asked first but not trusted alone: a webfont pulled by a
 * stylesheet reports as `css`, and lumping fonts in with CSS is how a page with
 * six font files comes to look like it has a big stylesheet problem.
 */
export function resourceKind(entry) {
  const url = entry.name || '';

  if (FONT_RE.test(url)) {
    return 'font';
  }

  if (IMAGE_RE.test(url)) {
    return 'image';
  }

  if (MEDIA_RE.test(url)) {
    return 'media';
  }

  switch (entry.initiatorType) {
    case 'script':
      return 'js';
    case 'css':
    case 'link':
      return STYLE_RE.test(url) ? 'css' : 'other';
    case 'img':
    case 'image':
    case 'imageset':
    case 'input':
      return 'image';
    case 'video':
    case 'audio':
      return 'media';
    case 'fetch':
    case 'xmlhttprequest':
    case 'beacon':
    case 'ping':
      return 'data';
    default:
      break;
  }

  if (SCRIPT_RE.test(url)) {
    return 'js';
  }

  if (STYLE_RE.test(url)) {
    return 'css';
  }

  return 'other';
}

function sleep(win, ms) {
  return new Promise((resolve) => win.setTimeout(resolve, ms));
}

/**
 * The frame is transparent, not hidden and not off-screen.
 *
 * `display:none`, `visibility:hidden` and a position outside the viewport all
 * stop native lazy loading from ever firing, and a measurement that misses
 * every lazy image is a measurement of a page nobody visits. So it sits in the
 * top corner at zero opacity, behind everything, unclickable — and gone within
 * a few seconds.
 */
function createFrame(win, url) {
  const el = win.document.createElement('iframe');

  el.setAttribute('aria-hidden', 'true');
  el.setAttribute('tabindex', '-1');
  el.setAttribute('title', 'performance measurement');
  el.style.cssText =
    'position:fixed;top:0;left:0;border:0;opacity:0;pointer-events:none;z-index:-1;' +
    `width:${VIEWPORT_W}px;height:${VIEWPORT_H}px;`;
  el.src = url;
  win.document.body.appendChild(el);

  return el;
}

function frameLoaded(win, frame) {
  return new Promise((resolve, reject) => {
    let done = false;

    const timer = win.setTimeout(() => {
      if (!done) {
        done = true;
        reject(new Error('timeout'));
      }
    }, LOAD_TIMEOUT);

    frame.addEventListener(
      'load',
      () => {
        if (done) {
          return;
        }

        done = true;
        win.clearTimeout(timer);
        resolve();
      },
      { once: true }
    );
  });
}

/**
 * The vitals, collected from the parent side.
 *
 * `buffered: true` is what makes this possible after the fact: the observer is
 * created once the frame has loaded and still receives everything the browser
 * recorded before it existed. Each type is subscribed separately because a
 * browser that does not know one of them throws, and one unsupported entry type
 * must not cost the other three.
 */
function observeVitals(frameWin) {
  const state = { lcp: 0, lcpEl: null, cls: 0, fcp: 0, longTasks: 0, longTaskMs: 0 };
  const observers = [];

  const on = (type, handle) => {
    try {
      const observer = new frameWin.PerformanceObserver((list) => list.getEntries().forEach(handle));

      observer.observe({ type, buffered: true });
      observers.push(observer);
    } catch {
      /* not supported here */
    }
  };

  on('largest-contentful-paint', (entry) => {
    state.lcp = entry.startTime;
    state.lcpEl = entry.element || null;
  });

  on('layout-shift', (entry) => {
    if (!entry.hadRecentInput) {
      state.cls += entry.value;
    }
  });

  on('paint', (entry) => {
    if (entry.name === 'first-contentful-paint') {
      state.fcp = entry.startTime;
    }
  });

  on('longtask', (entry) => {
    state.longTasks += 1;
    state.longTaskMs += entry.duration;
  });

  return { state, stop: () => observers.forEach((observer) => observer.disconnect()) };
}

/**
 * Walk the page top to bottom so lazy images load, then come back.
 *
 * The trip down is the only way to see what a visitor who reads the page would
 * download; the trip back is so the last thing measured is the top of the page,
 * where the layout numbers were taken.
 */
async function scrollThrough(win, frameWin, doc) {
  const height = Math.max(
    doc.body?.scrollHeight || 0,
    doc.documentElement?.scrollHeight || 0
  );
  const steps = Math.min(MAX_SCROLL_STEPS, Math.ceil(height / VIEWPORT_H));

  for (let step = 1; step <= steps; step += 1) {
    try {
      frameWin.scrollTo({ top: step * VIEWPORT_H, behavior: 'instant' });
    } catch {
      frameWin.scrollTo(0, step * VIEWPORT_H);
    }

    await sleep(win, SCROLL_WAIT);
  }

  try {
    frameWin.scrollTo({ top: 0, behavior: 'instant' });
  } catch {
    frameWin.scrollTo(0, 0);
  }

  await sleep(win, SCROLL_WAIT);
}

function describe(el) {
  if (!el) {
    return '';
  }

  const tag = el.tagName ? el.tagName.toLowerCase() : '';

  if (tag === 'img') {
    return fileName(el.currentSrc || el.src || '') || tag;
  }

  const text = (el.textContent || '').trim().replace(/\s+/g, ' ');

  return text ? text.slice(0, 60) : `<${tag}>`;
}

export function fileName(url) {
  try {
    const path = new URL(url, 'http://x').pathname;

    return decodeURIComponent(path.split('/').pop() || '') || url;
  } catch {
    return url;
  }
}

/**
 * One request, as a plain row.
 *
 * `decoded` is the headline size rather than `transfer`, because it is the one
 * that survives a warm cache: a second measurement transfers almost nothing and
 * would otherwise report a page that weighs zero. Transfer is kept beside it,
 * for the compression question, and a cross-origin server that does not send
 * `Timing-Allow-Origin` gives neither — which is reported as unknown rather
 * than as nought.
 */
function resourceRow(entry, origin) {
  const decoded = entry.decodedBodySize || 0;
  const transfer = entry.transferSize || 0;
  let thirdParty = false;

  try {
    thirdParty = new URL(entry.name).origin !== origin;
  } catch {
    /* data: and blob: are nobody's third party */
  }

  return {
    url: entry.name,
    name: fileName(entry.name),
    kind: resourceKind(entry),
    bytes: decoded,
    transfer,
    ms: Math.round(entry.duration || 0),
    unknown: decoded === 0 && transfer === 0,
    thirdParty,
  };
}

/**
 * Every <img> the page ended up with, measured against the box it was put in.
 *
 * The comparison is against twice the layout size, not the layout size: a
 * retina screen genuinely wants those pixels, and calling every image on a
 * modern site "too big" would be a panel nobody believes twice.
 */
function collectImages(doc, byUrl) {
  const rows = [];

  for (const img of doc.querySelectorAll('img')) {
    const url = img.currentSrc || img.src || '';

    if (!url || url.startsWith('data:')) {
      continue;
    }

    const rect = img.getBoundingClientRect();
    const shown = { w: Math.round(rect.width), h: Math.round(rect.height) };
    const natural = { w: img.naturalWidth || 0, h: img.naturalHeight || 0 };
    const res = byUrl.get(url);
    const need = shown.w * 2;
    const factor = need > 0 && natural.w > 0 ? natural.w / need : 0;

    rows.push({
      url,
      name: fileName(url),
      bytes: res?.bytes || 0,
      unknown: !res || res.unknown,
      natural,
      shown,
      factor,
      lazy: (img.getAttribute('loading') || '') === 'lazy',
      sized: !!(img.getAttribute('width') && img.getAttribute('height')),
      format: (fileName(url).split('.').pop() || '').toLowerCase(),
      hidden: shown.w === 0 && shown.h === 0,
    });
  }

  return rows;
}

/**
 * Load the page and take everything off it. Always tears the frame down.
 *
 * @returns {Promise<object>} the raw reading — no wording, no verdicts.
 */
export async function measurePage(win, url) {
  const frame = createFrame(win, url);

  try {
    await frameLoaded(win, frame);

    const frameWin = frame.contentWindow;
    const doc = frame.contentDocument;

    if (!frameWin || !doc?.body) {
      throw new Error('unreadable');
    }

    const vitals = observeVitals(frameWin);

    await sleep(win, SETTLE_MS);

    try {
      await doc.fonts?.ready;
    } catch {
      /* no font manager here */
    }

    await scrollThrough(win, frameWin, doc);
    await sleep(win, SETTLE_MS);

    const perf = frameWin.performance;
    const nav = perf.getEntriesByType('navigation')[0] || null;
    const origin = frameWin.location.origin;
    const resources = perf
      .getEntriesByType('resource')
      .map((entry) => resourceRow(entry, origin))
      .filter((row) => !row.url.startsWith('data:') && !row.url.startsWith('blob:'));

    const byUrl = new Map();

    resources.forEach((row) => {
      const seen = byUrl.get(row.url);

      // The same file asked for twice is one file's worth of weight to a
      // visitor with a cache, but two rows here. Keep the heavier reading.
      if (!seen || row.bytes > seen.bytes) {
        byUrl.set(row.url, row);
      }
    });

    const images = collectImages(doc, byUrl);
    const state = vitals.state;
    const lcpEl = describe(state.lcpEl);

    vitals.stop();

    return {
      ok: true,
      url,
      status: nav?.responseStatus || 0,
      nav: {
        ttfb: Math.round(nav?.responseStart || 0),
        dcl: Math.round(nav?.domContentLoadedEventEnd || 0),
        load: Math.round(nav?.loadEventEnd || 0),
        bytes: nav?.decodedBodySize || 0,
        transfer: nav?.transferSize || 0,
      },
      vitals: {
        lcp: Math.round(state.lcp),
        lcpEl,
        cls: Math.round(state.cls * 1000) / 1000,
        fcp: Math.round(state.fcp),
        longTasks: state.longTasks,
        longTaskMs: Math.round(state.longTaskMs),
      },
      resources,
      images,
      devServer: resources.some((row) => /\/@vite\/|:5173\//.test(row.url)),
      cached: resources.some((row) => !row.thirdParty && row.transfer === 0 && row.bytes > 0),
      unknownCount: resources.filter((row) => row.unknown).length,
    };
  } finally {
    // Whatever happened, the frame does not get to stay: a page left loaded in
    // the Control Panel keeps its timers, its video and its animation running
    // behind a panel that has already been closed.
    frame.remove();
  }
}
