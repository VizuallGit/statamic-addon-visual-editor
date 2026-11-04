/**
 * The site's own animation presets — My presets in Build's Animation tab.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: vue, lib/csrf.js.
 * Bus messages: none.
 *
 * The list the Control Panel was given (`sveAnimationPresets`,
 * AnimationPresets.php), in the shape of presets.json, kept as the server
 * answers each save and delete. A preset is saved before the element is
 * written onto it, so the page never names one the site does not have.
 */
import { ref } from 'vue';
import { csrfToken } from '../lib/csrf.js';

let list = null;

/** The reactive list, read from the Control Panel's config the first time it is asked for. */
export function ownPresets(win = window) {
  if (!list) {
    const given = win.Statamic?.$config?.get?.('sveAnimationPresets');

    list = ref(Array.isArray(given) ? given : []);
  }

  return list;
}

function post(win, url, body) {
  return win.fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json', 'X-CSRF-TOKEN': csrfToken(win) },
    body: JSON.stringify(body),
  });
}

/** Saves a look under a name → the new preset, or null when the server said no. */
export async function savePreset(label, vars, win = window) {
  const res = await post(win, '/!/sve/animation-presets', { label, vars }).catch(() => null);
  const data = res?.ok ? await res.json() : null;

  if (!data?.preset) {
    return null;
  }

  ownPresets(win).value = data.presets;

  return data.preset;
}

/**
 * Deletes a preset → `{ deleted: true }`, `{ used: n }` while n templates
 * still name it (asked again with `force`, it goes anyway), or null.
 */
export async function deletePreset(handle, force = false, win = window) {
  const res = await post(win, '/!/sve/animation-presets/delete', { handle, force }).catch(() => null);

  if (res?.status === 409) {
    return { used: (await res.json()).used };
  }

  const data = res?.ok ? await res.json() : null;

  if (!data) {
    return null;
  }

  ownPresets(win).value = data.presets;

  return { deleted: true };
}
