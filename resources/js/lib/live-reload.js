/**
 * The rules of live reload in Live Preview, with nothing attached: what the
 * poll asks and what an answer means. `lp-live-reload.js` runs the loop; this
 * file decides, so the decision can be tested without a window.
 *
 * The server (`LiveReload.php`) answers two signatures — `markup` for every
 * template file, `build` for public/build/manifest.json — and `own`: whether
 * the markup as it stands came from this browser's own editor write (the
 * dock's autosave, Site Files, a component saved). A change the editor made
 * is one the preview already shows; only a change from outside — a file saved
 * from Cursor over SSH, a deploy — is a reason to render the page again.
 *
 * May import: nothing.
 */

/** The poll URL with what we hold, so the server holds the request until it differs. */
export function statusUrl(base, have) {
  if (!have || typeof have.markup !== 'string' || typeof have.build !== 'string') {
    return base;
  }

  return `${base}?markup=${encodeURIComponent(have.markup)}&build=${encodeURIComponent(have.build)}`;
}

/**
 * What an answer asks for, against what we hold.
 *
 * - `have`: the signatures to hold from now on. The first answer sets them;
 *   after that every answer's signatures are adopted, whether or not anything
 *   is done about them — a change is acted on once.
 * - `refresh`: the markup changed and the editor did not write it — render
 *   the page again from the values as they stand.
 * - `css`: the build changed and the server names the built stylesheet —
 *   swap it into the page documents. Null otherwise.
 *
 * Before the first answer there is nothing to compare against: the page was
 * rendered with whatever was on disk when Live Preview opened, and that is
 * what the first answer describes. Nothing is refreshed on it.
 */
export function nextStep(have, answer) {
  const markup = String(answer?.markup ?? '');
  const build = String(answer?.build ?? '');
  const next = { markup, build };

  if (!have) {
    return { have: next, refresh: false, css: null };
  }

  const markupChanged = markup !== have.markup;
  const buildChanged = build !== have.build;
  const css = buildChanged && typeof answer.css === 'string' && answer.css ? answer.css : null;

  return {
    have: next,
    refresh: markupChanged && answer.own !== true,
    css,
  };
}
