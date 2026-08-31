/**
 * Display names for the HTML tree only. Never written into the template.
 * Keyed by dock template type + structural path (tag + sibling index).
 */

const STORAGE_KEY = 'sve-html-tree-labels';

function readAll() {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);

    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(all) {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* quota / private mode */
  }
}

function typeKey(type) {
  return String(type || '_');
}

export function readHtmlTreeLabels(type) {
  const bucket = readAll()[typeKey(type)];

  return bucket && typeof bucket === 'object' ? { ...bucket } : {};
}

export function htmlTreeDisplayName(klass, path, aliases) {
  const custom = aliases?.[path];

  if (typeof custom === 'string' && custom.trim()) {
    return custom.replace(/\s+/g, ' ').trim();
  }

  return String(klass || '').trim();
}

export function writeHtmlTreeLabel(type, path, value, fallback) {
  if (!path) {
    return;
  }

  const key = typeKey(type);
  const all = readAll();
  const map = { ...(all[key] || {}) };
  const next = String(value || '').replace(/\s+/g, ' ').trim();
  const base = String(fallback || '').trim();

  if (!next || next === base) {
    delete map[path];
  } else {
    map[path] = next;
  }

  if (Object.keys(map).length) {
    all[key] = map;
  } else {
    delete all[key];
  }

  writeAll(all);
}
