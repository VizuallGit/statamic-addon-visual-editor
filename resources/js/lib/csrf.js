/**
 * CSRF token for the requests the editor makes to the Control Panel
 * (`/!/sve/*`, `/cp/*`).
 *
 * One source for the whole editor. The CP page's meta tag comes first, then
 * Statamic's config under either key it has used, so it works in the CP window
 * and inside the Live Preview overlay alike. The window is passed explicitly:
 * the editor runs in more than one.
 *
 * May import: nothing.
 */
export function csrfToken(win) {
  return (
    win.document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
    win.Statamic?.$config?.get?.('csrfToken') ||
    win.Statamic?.$config?.get?.('csrf_token') ||
    ''
  );
}
