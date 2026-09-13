/**
 * The AI text glyph — one source for every place it appears.
 *
 * It is drawn in two worlds that cannot import each other's code: the Control
 * Panel toolbar (cp.js) and the preview iframe (ai-text-bridge.js). A constant
 * with no imports of its own can be pulled into both, which is what keeps the
 * button in the top bar and the mark on the text from drifting into two
 * different icons.
 *
 * A pen with a spark on it: the AI chat already owns the plain spark, and two
 * tools sharing one glyph at 15px is one tool as far as the eye is concerned.
 */
export function aiTextIcon(size = null) {
  const dims = size ? `width="${size}" height="${size}" ` : '';

  return (
    `<svg ${dims}viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ` +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M4 20h4L19.5 8.5a2.12 2.12 0 0 0-3-3L5 17v3z"/>' +
    '<path d="M17.5 4.2 19.8 6.5"/>' +
    '<path d="M4.5 3v3"/><path d="M6 4.5H3"/>' +
    '<path d="M20.5 16v3"/><path d="M22 17.5h-3"/></svg>'
  );
}
