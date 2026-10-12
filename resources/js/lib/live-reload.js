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
 * - `changed`: with `refresh`, the files the server names behind the change
 *   (path relative to the site root, contents when small enough) — what can
 *   be painted before the page is rendered again. Null when the server
 *   could not say.
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
    return { have: next, refresh: false, css: null, changed: null };
  }

  const markupChanged = markup !== have.markup;
  const buildChanged = build !== have.build;
  const css = buildChanged && typeof answer.css === 'string' && answer.css ? answer.css : null;

  const refresh = markupChanged && answer.own !== true;

  return {
    have: next,
    refresh,
    css,
    changed: refresh && Array.isArray(answer.changed) ? answer.changed : null,
  };
}

/**
 * The panes a changed file gives the dock that has `open` (its type), or
 * null when the file is not the dock's to take.
 *
 * The server names a file the dock opens as the dock names it (`type`) and
 * splits it as the dock's own load does (`panes`: html, css, js, props,
 * locked). The file whole is never what the HTML pane holds — its lock
 * marker, CSS block and Tailwind tag went into the markup, and the dock's
 * autosave wrote them back around it, one more per save (v1.1.508–509). So
 * a file without panes — from a PHP older than this bundle — is not taken
 * either; the page is rendered instead.
 *
 * An empty markup pane is not taken: to the dock '' means "detach", and an
 * empty file is more likely a save caught halfway.
 */
export function panesFor(file, open) {
  const panes = file?.panes;

  if (!open || file?.type !== open || !panes || typeof panes !== 'object') {
    return null;
  }

  if (typeof panes.html !== 'string' || typeof panes.css !== 'string' || typeof panes.js !== 'string' || panes.html === '') {
    return null;
  }

  return panes;
}
