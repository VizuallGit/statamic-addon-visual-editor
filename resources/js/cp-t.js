/**
 * CP strings. No other Visual Editor file imported from here.
 */
export function t(win, key, replacements = {}) {
  const strings = win.Statamic?.$config?.get?.('sveStrings') || {};
  let out = strings[key] ?? key;

  for (const [name, value] of Object.entries(replacements)) {
    out = out.replaceAll(`:${name}`, value);
  }

  return out;
}
