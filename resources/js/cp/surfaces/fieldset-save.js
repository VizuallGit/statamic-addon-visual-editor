/**
 * The Save inside a framed Control Panel screen — the Fieldsets screen, a
 * blueprint — noticed from outside the frame.
 *
 * The screen saves with the Vue app's own client: `this.$axios.patch(this.action,
 * …)`. Statamic 5 also hung that client on `window.Statamic.$axios`; Statamic 6
 * keeps it on the app alone, `Statamic.$app.config.globalProperties.$axios`. A
 * watch that read the window found nothing, attached nothing, and said so to
 * nobody — Save refreshed nothing, and only closing the panel did (measured
 * 30 September 2026 against the demo, VE 1.1.427). Both places are read here.
 *
 * Two moments are reported, not one. `onSaving` gets a promise the moment the
 * save leaves — settled when its response, good or bad, is back. `onSaved`
 * fires on a good response, when the YAML is on disk. The panel's Close waits
 * on the first before it refreshes: a Close a beat after Save used to ask the
 * server for the fields before the file was written, and drew the old list.
 *
 * May import: nothing. Pure; tested in tests/js/fieldset-save.test.js.
 */

/** The Fieldsets screen's update URL. A blueprint's differs; the caller says. */
export const FIELDSET_SAVE_URL = /\/fields\/fieldsets\//;

/** The framed screen's axios, wherever this Statamic keeps it; null when its Vue has not booted. */
export function frameAxios(win) {
  return (
    win?.Statamic?.$axios ||
    win?.Statamic?.$app?.config?.globalProperties?.$axios ||
    win?.axios ||
    null
  );
}

/** A PATCH/PUT to the screen's update URL — the save itself, never the `/edit` page it sits on. */
export function isSaveRequest(config, saveMatch = FIELDSET_SAVE_URL) {
  const method = String(config?.method || '').toUpperCase();
  const url = String(config?.url || '');

  return (method === 'PATCH' || method === 'PUT') && saveMatch.test(url) && !/\/edit(?:\?|$)/.test(url);
}

/** The save's own answer, and a good one. */
export function isSaveResponse(response, saveMatch = FIELDSET_SAVE_URL) {
  const status = Number(response?.status || 0);

  return status >= 200 && status < 300 && isSaveRequest(response?.config, saveMatch);
}

/**
 * Hooks the frame's axios once. Returns whether a watch is on the window —
 * this call's or an earlier one's — so a caller can ask again while the
 * frame's Vue is still booting.
 *
 * @param {Window} win  the frame's window
 * @param {{ saveMatch?: RegExp, onSaving?: (done: Promise<void>) => void, onSaved?: () => void }} handlers
 * @returns {boolean}
 */
export function watchFieldsetSaves(win, { saveMatch = FIELDSET_SAVE_URL, onSaving, onSaved } = {}) {
  if (!win) {
    return false;
  }

  if (win.__sveFsSaveWatch) {
    return true;
  }

  const axios = frameAxios(win);

  if (!axios?.interceptors?.request?.use || !axios?.interceptors?.response?.use) {
    return false;
  }

  win.__sveFsSaveWatch = true;

  // One save at a time is what the screen allows; the promise of the latest is
  // the one anybody waits on.
  let settle = null;

  const settled = () => {
    settle?.();
    settle = null;
  };

  axios.interceptors.request.use((config) => {
    if (isSaveRequest(config, saveMatch)) {
      const done = new Promise((resolve) => {
        settle = resolve;
      });

      onSaving?.(done);
    }

    return config;
  });

  axios.interceptors.response.use(
    (response) => {
      if (isSaveResponse(response, saveMatch)) {
        onSaved?.();
      }

      if (isSaveRequest(response?.config, saveMatch)) {
        settled();
      }

      return response;
    },
    (error) => {
      if (isSaveRequest(error?.config, saveMatch)) {
        settled();
      }

      return Promise.reject(error);
    }
  );

  return true;
}
