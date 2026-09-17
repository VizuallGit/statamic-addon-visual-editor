/**
 * A `<style>` tag the editor owns: injected once, kept current.
 *
 * Every panel used to carry its own copy of "create the style tag if it is not
 * there yet". This is that copy. Idempotent: calling it again with the same CSS
 * costs one string comparison; with new CSS it updates the tag in place, so its
 * position in `<head>` (and therefore the cascade) does not move.
 *
 * May import: nothing.
 *
 * @returns {HTMLStyleElement} the tag, for callers that want to remove it later
 */
export function injectStyle(doc, id, css) {
  let style = doc.getElementById(id);

  if (style) {
    if (style.textContent !== css) {
      style.textContent = css;
    }

    return style;
  }

  style = doc.createElement('style');
  style.id = id;
  style.textContent = css;
  doc.head.appendChild(style);

  return style;
}
