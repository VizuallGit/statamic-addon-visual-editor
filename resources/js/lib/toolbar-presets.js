/**
 * Top bar presets and order, as plain data — no storage, no DOM.
 *
 * A preset is { id, tools: [tab key, …], dock: bool | null }: the icons it
 * shows and whether the HTML dock opens — null leaves the dock as it is (All).
 * The site's two (Developer, Content editor) come from PHP (ToolbarPresets); a
 * user's own carry a `name` and an id that starts with `u-`. The order is not
 * part of a preset: it is the user's own, whichever preset is on.
 *
 * May import: nothing.
 */

const TOOL_KEY = /^[a-z][a-z0-9_]*$/;
const USER_ID = /^u-[a-z0-9]+$/;
export const PRESET_NAME_MAX = 40;

const keysOf = (list) => (Array.isArray(list) ? [...new Set(list.filter((key) => typeof key === 'string' && TOOL_KEY.test(key)))] : []);

/** A stored or provided preset made safe; null when it is not one. */
export function cleanPreset(raw, { user = false } = {}) {
  if (!raw || typeof raw !== 'object' || typeof raw.id !== 'string') {
    return null;
  }

  if (user) {
    const name = typeof raw.name === 'string' ? raw.name.trim().slice(0, PRESET_NAME_MAX) : '';

    if (!USER_ID.test(raw.id) || !name) {
      return null;
    }

    return { id: raw.id, name, tools: keysOf(raw.tools), dock: raw.dock === true };
  }

  return TOOL_KEY.test(raw.id) ? { id: raw.id, tools: keysOf(raw.tools), dock: raw.dock === true } : null;
}

/** The icons a preset hides, of those this user has. */
export function presetHidden(preset, available) {
  return available.filter((key) => !preset.tools.includes(key));
}

/**
 * Is the bar this preset right now? Only icons the user has count, and the
 * dock only where the user has the dock.
 */
export function presetMatches(preset, { available, shown, dock = false, dockAllowed = false }) {
  const want = available.filter((key) => preset.tools.includes(key));

  if (want.length !== shown.length || want.some((key) => !shown.includes(key))) {
    return false;
  }

  return !dockAllowed || preset.dock === null || preset.dock === dock;
}

/**
 * The preset to mark. Two presets can be the same bar (a user's own copy of
 * Developer): then the one the user picked is the one that is on, and only
 * when it no longer matches does the first that does take over.
 */
export function activePreset(presets, state, picked = '') {
  const chosen = presets.find((preset) => preset.id === picked);

  if (chosen && presetMatches(chosen, state)) {
    return chosen;
  }

  return presets.find((preset) => presetMatches(preset, state)) || null;
}

/** A new user preset's id: time-based, so two in the same list never meet. */
export function newPresetId(now = Date.now(), taken = []) {
  let n = now;

  while (taken.includes(`u-${n.toString(36)}`)) {
    n += 1;
  }

  return `u-${n.toString(36)}`;
}

/**
 * `keys` in the user's order: the ordered ones first, as ordered; any the
 * order does not know (a tool added since) after them, as they came.
 */
export function inOrder(keys, order) {
  const known = keysOf(order).filter((key) => keys.includes(key));

  return [...known, ...keys.filter((key) => !known.includes(key))];
}

/** Move `key` to `index` in `keys` (clamped). A new array. */
export function moveKey(keys, key, index) {
  const from = keys.indexOf(key);

  if (from === -1) {
    return [...keys];
  }

  const out = keys.filter((item) => item !== key);
  const to = Math.max(0, Math.min(out.length, index));

  out.splice(to, 0, key);

  return out;
}
