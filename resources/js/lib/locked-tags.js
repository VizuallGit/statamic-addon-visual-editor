/**
 * Antlers tags the dock shows but will not let anyone change.
 *
 * `{{ vite … }}` and the `yield_*` tags are not markup — they are how the
 * built stylesheet and the page's scripts reach the browser. Change the path
 * and the site loses its CSS or its JavaScript, with nothing on screen saying
 * why. `{{ theme_tokens }}` writes the theme's custom properties, so the whole
 * colour system hangs off it.
 *
 * They are worth seeing, because a layout without them reads as incomplete.
 * They are not worth editing by hand.
 *
 * May import: nothing.
 */
const LOCKED = /\{\{\s*(?:vite\b[^}]*|yield_[a-z_]+|theme_tokens)\s*\}\}/g;

/**
 * Every locked range in this text, flat, as CodeMirror's `changeFilter`
 * wants them: from, to, from, to.
 */
export function lockedRanges(text) {
  const out = [];

  LOCKED.lastIndex = 0;

  let match;

  while ((match = LOCKED.exec(String(text || '')))) {
    out.push(match.index, match.index + match[0].length);
  }

  return out;
}
