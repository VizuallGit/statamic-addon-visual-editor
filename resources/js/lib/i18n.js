/**
 * Editor strings in the CP user's language.
 *
 * The addon renders its strings server-side (resources/lang) and hands them to
 * the CP as `sveStrings`, so JS and PHP never drift apart. `:name` placeholders
 * are filled from `replacements`, Laravel-style. A key that has no string comes
 * back unchanged, which is what makes a missing translation visible.
 *
 * `statamicTranslate` is for Statamic's own strings (set names, field labels)
 * through the translator the CP exposes as `window.__`.
 *
 * May import: nothing. Was `cp-t.js`.
 */
export function t(win, key, replacements = {}) {
  let out = win.Statamic?.$config?.get?.('sveStrings')?.[key] ?? key;

  for (const [name, value] of Object.entries(replacements)) {
    out = String(out).replaceAll(`:${name}`, value);
  }

  return out;
}

export function statamicTranslate(key) {
  return typeof window.__ === 'function' ? window.__(key) : key;
}
