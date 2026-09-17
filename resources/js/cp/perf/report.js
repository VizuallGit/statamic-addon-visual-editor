/**
 * The reading, turned into something a person can act on.
 *
 * Kept apart from measure.js on purpose: that file must stay free of opinions
 * and wording, so what it returns can be trusted as a record of the page. This
 * is where the opinions live — the budgets, the score and the sentences.
 *
 * The budgets are the published ones where published ones exist (CLS, LCP) and
 * ordinary page-weight practice where they do not. They are constants in one
 * place so that arguing with them is a one-line argument.
 */
import { t } from '../../lib/i18n.js';
import { fileName } from './measure.js';

const KB = 1024;

/** [good, poor] — at or under the first is 100, at or over the second is 0. */
export const BUDGETS = {
  weight: [1000 * KB, 3000 * KB],
  js: [200 * KB, 700 * KB],
  image: [800 * KB, 2500 * KB],
  requests: [40, 100],
  lcp: [2500, 4000],
  cls: [0.1, 0.25],
};

/** How much each budget counts. Weight is the thing you can actually change. */
const SCORE_WEIGHTS = {
  weight: 3,
  js: 2,
  image: 2,
  requests: 1,
  lcp: 1,
  cls: 1,
};

export const KINDS = ['js', 'css', 'image', 'font', 'media', 'data', 'other'];

export function formatBytes(value) {
  if (!value) {
    return '0';
  }

  if (value < 1000 * KB) {
    return `${Math.round(value / KB).toLocaleString()} kB`;
  }

  return `${(value / KB / KB).toLocaleString(undefined, { maximumFractionDigits: 1 })} MB`;
}

export function formatMs(value) {
  if (!value) {
    return '–';
  }

  if (value < 1000) {
    return `${Math.round(value)} ms`;
  }

  return `${(value / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} s`;
}

/** 100 at the good end, 0 at the poor end, a straight line between them. */
function budgetScore(value, [good, poor]) {
  if (value <= good) {
    return 100;
  }

  if (value >= poor) {
    return 0;
  }

  return Math.round(((poor - value) / (poor - good)) * 100);
}

export function budgetLevel(value, key) {
  const [good, poor] = BUDGETS[key];

  if (value <= good) {
    return 'pass';
  }

  return value >= poor ? 'fail' : 'warn';
}

/** Weight per kind, plus the document itself — which is a request like any other. */
export function weighKinds(raw) {
  const totals = { doc: raw.nav.bytes || 0 };

  KINDS.forEach((kind) => {
    totals[kind] = 0;
  });

  raw.resources.forEach((row) => {
    totals[row.kind] = (totals[row.kind] || 0) + row.bytes;
  });

  return totals;
}

export function totalWeight(totals) {
  return Object.values(totals).reduce((sum, n) => sum + n, 0);
}

/**
 * The one number at the top.
 *
 * A weighted budget check, not a Lighthouse score — the panel says so in as
 * many words, because a number out of 100 next to the word "performance" is
 * read as Google's number whether or not it is, and this one is measured on a
 * developer's machine with no throttling of any kind.
 */
export function scoreOf(raw, totals) {
  const total = totalWeight(totals);
  const values = {
    weight: total,
    js: totals.js,
    image: totals.image,
    requests: raw.resources.length + 1,
    lcp: raw.vitals.lcp,
    cls: raw.vitals.cls,
  };

  let sum = 0;
  let weight = 0;

  Object.entries(SCORE_WEIGHTS).forEach(([key, factor]) => {
    // A vital the browser never reported is not a zero — it is a question this
    // browser cannot answer, and scoring it as a failure would punish the page
    // for the measuring instrument.
    if ((key === 'lcp' || key === 'cls') && !raw.vitals.lcp) {
      return;
    }

    sum += budgetScore(values[key], BUDGETS[key]) * factor;
    weight += factor;
  });

  return weight ? Math.round(sum / weight) : 0;
}

export function gradeOf(score) {
  if (score >= 80) {
    return 'good';
  }

  return score >= 50 ? 'ok' : 'poor';
}

/** The headline readings, in the order they answer "and then what". */
export function metricsOf(win, raw, totals) {
  const total = totalWeight(totals);
  const requests = raw.resources.length + 1;
  const vitals = raw.vitals;
  const out = [
    {
      key: 'weight',
      label: t(win, 'perf_metric_weight'),
      value: formatBytes(total),
      level: budgetLevel(total, 'weight'),
    },
    {
      key: 'requests',
      label: t(win, 'perf_metric_requests'),
      value: String(requests),
      level: budgetLevel(requests, 'requests'),
    },
    {
      key: 'js',
      label: t(win, 'perf_metric_js'),
      value: formatBytes(totals.js),
      level: budgetLevel(totals.js, 'js'),
    },
    {
      key: 'image',
      label: t(win, 'perf_metric_images'),
      value: formatBytes(totals.image),
      level: budgetLevel(totals.image, 'image'),
    },
    {
      key: 'ttfb',
      label: t(win, 'perf_metric_ttfb'),
      value: formatMs(raw.nav.ttfb),
      level: 'info',
    },
  ];

  if (vitals.lcp) {
    out.push({
      key: 'lcp',
      label: t(win, 'perf_metric_lcp'),
      value: formatMs(vitals.lcp),
      level: budgetLevel(vitals.lcp, 'lcp'),
      note: vitals.lcpEl,
    });
    out.push({
      key: 'cls',
      label: t(win, 'perf_metric_cls'),
      value: vitals.cls.toLocaleString(undefined, { maximumFractionDigits: 3 }),
      level: budgetLevel(vitals.cls, 'cls'),
    });
  }

  if (vitals.longTasks) {
    out.push({
      key: 'blocking',
      label: t(win, 'perf_metric_blocking'),
      value: formatMs(vitals.longTaskMs),
      level: 'info',
      note: t(win, 'perf_long_tasks', { n: vitals.longTasks }),
    });
  }

  return out;
}

export function barsOf(win, totals) {
  const total = totalWeight(totals) || 1;

  return ['doc', ...KINDS]
    .map((kind) => ({
      key: kind,
      label: t(win, `perf_kind_${kind}`),
      bytes: totals[kind] || 0,
      text: formatBytes(totals[kind] || 0),
      share: Math.round(((totals[kind] || 0) / total) * 100),
    }))
    .filter((bar) => bar.bytes > 0)
    .sort((a, b) => b.bytes - a.bytes);
}

/** Anything that changes how the numbers should be read. Never silently. */
export function notesOf(win, raw) {
  const notes = [t(win, 'perf_note_local')];

  if (raw.devServer) {
    notes.unshift(t(win, 'perf_note_dev'));
  }

  if (raw.cached) {
    notes.push(t(win, 'perf_note_cached'));
  }

  if (raw.unknownCount) {
    notes.push(t(win, 'perf_note_thirdparty', { n: raw.unknownCount }));
  }

  if (!raw.vitals.lcp) {
    notes.push(t(win, 'perf_note_no_vitals'));
  }

  return notes;
}

/**
 * How wrong one image is, and by how much.
 *
 * Two faults, told apart because they have different fixes: a file that is
 * simply heavy wants a better format or more compression, while a file that is
 * heavy *because it is far larger than the box it sits in* wants a resize, and
 * saying "compress this" about the second one sends people the wrong way.
 */
export function imageRow(win, img, i) {
  const parts = [];
  let level = 'pass';

  if (img.natural.w) {
    parts.push(`${img.natural.w}×${img.natural.h}`);
  }

  if (img.shown.w) {
    parts.push(t(win, 'perf_img_shown', { w: img.shown.w, h: img.shown.h }));
  }

  if (img.factor >= 1.3) {
    parts.push(t(win, 'perf_img_oversized', {
      factor: img.factor.toLocaleString(undefined, { maximumFractionDigits: 1 }),
    }));
    level = img.factor >= 2 ? 'fail' : 'warn';
  }

  if (img.bytes >= 800 * KB) {
    parts.push(t(win, 'perf_img_heavy'));
    level = 'fail';
  } else if (img.bytes >= 300 * KB && level === 'pass') {
    level = 'warn';
  }

  if (['jpg', 'jpeg', 'png'].includes(img.format) && img.bytes >= 150 * KB) {
    parts.push(t(win, 'perf_img_format', { format: img.format.toUpperCase() }));

    if (level === 'pass') {
      level = 'warn';
    }
  }

  if (!img.sized) {
    parts.push(t(win, 'perf_img_nodims'));
  }

  if (img.unknown) {
    parts.push(t(win, 'perf_img_unknown'));
  }

  return {
    key: `img-${i}`,
    url: img.url,
    level,
    tag: img.unknown ? '?' : formatBytes(img.bytes),
    title: img.name,
    help: parts.join(' · '),
    tip: img.url,
  };
}

export function fileRow(win, res, i) {
  const parts = [t(win, `perf_kind_${res.kind}`)];

  if (res.thirdParty) {
    try {
      parts.push(new URL(res.url).hostname);
    } catch {
      /* not a parseable host */
    }
  }

  if (res.ms) {
    parts.push(formatMs(res.ms));
  }

  return {
    key: `res-${i}`,
    url: res.url,
    kind: res.kind,
    level: res.bytes >= 500 * KB ? 'fail' : res.bytes >= 150 * KB ? 'warn' : 'info',
    tag: res.unknown ? '?' : formatBytes(res.bytes),
    title: res.name || fileName(res.url),
    help: parts.join(' · '),
    tip: res.url,
  };
}
