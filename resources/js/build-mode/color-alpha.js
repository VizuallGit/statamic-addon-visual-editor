/**
 * A colour's alpha, the way Tailwind writes it: `bg-primary-300/50`.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: tw-parse.js. Pure. Bus messages: none.
 */

import { splitClass, splitUtility } from '../tw-parse.js';

/** The alpha a class says, 0-100; null when it says none (`/50`, `/[0.5]`, `/[50%]`). */
export function alphaOf(raw) {
  const said = splitUtility(splitClass(raw).base).modifier.slice(1);
  const bare = /^\d+(\.\d+)?$/.exec(said);

  if (bare) {
    return Number(said);
  }

  const typed = /^\[(\d*\.?\d+)(%?)\]$/.exec(said);

  if (!typed) {
    return null;
  }

  return Math.round(Number(typed[1]) * (typed[2] ? 1 : 100) * 100) / 100;
}

/** The class with that alpha. Nothing typed, or all of it, is no alpha at all: the class as it is. */
export function withAlpha(name, text) {
  const n = Number(
    String(text ?? '')
      .replace('%', '')
      .trim()
  );

  if (String(text ?? '').trim() === '' || Number.isNaN(n) || n >= 100) {
    return name;
  }

  return `${name}/${Math.max(0, Math.round(n))}`;
}
