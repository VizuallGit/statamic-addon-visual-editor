/**
 * inline-edit.js — has the entry changed? (the saved values to compare with).
 * Split out of inline-edit.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. inline-edit.js re-exports this file.
 */
import { unwrapRef } from '../lib/values.js';
import { publishContainers } from '../lib/publish-containers.js';
import { discardChanges } from '../open-in-preview.js';

/**
 * Entry-form values considered "clean" when Live Preview opened (or after save).
 * Statamic's $dirty is sticky / noisy on mount — especially with revisions, where
 * Save stays enabled even when nothing changed — so the back button compares
 * against this snapshot instead of trusting $dirty alone.
 */
export let entryValuesBaseline = null;
let entryBaselineTimer = null;
// True between a successful save/publish response and the delayed re-baseline.
// Statamic writes the response into the form with trackDirtyState off for 500ms,
// so an immediate snapshot is the *pre*-response values — leave then thinks the
// hydrated form is unsaved work. Suppress the warning until we catch up.
export let entrySaveSettling = false;

/** The entry publish container ("base"), if we've seen it. */
function entryPublishContainer() {
  const named = publishContainers.find((container) => container.name === 'base');

  if (named) {
    return named;
  }

  return publishContainers.length ? publishContainers[publishContainers.length - 1] : null;
}

/** Stable JSON of the entry form values, or null when unavailable. */
export function serializeEntryValues() {
  const container = entryPublishContainer();
  const values = unwrapRef(container?.values);

  if (!values || typeof values !== 'object') {
    return null;
  }

  try {
    return JSON.stringify(values);
  } catch {
    return null;
  }
}

/**
 * Remember the current entry values as clean and clear hydration-induced dirty
 * marks. Called after Live Preview settles and again after a successful save.
 */
export function markEntryFormClean(win) {
  const serialized = serializeEntryValues();

  if (serialized == null) {
    return false;
  }

  entryValuesBaseline = serialized;
  discardChanges(win);
  win.Statamic?.$dirty?.disableWarning?.();

  return true;
}

/**
 * After Live Preview opens the form still mutates briefly (Bard, replicator,
 * visual ids). Wait for that to settle before taking the clean baseline.
 *
 * Take that snapshot once per session. ensureLpBackButton runs again on every
 * DOM settle (preview refresh, chrome, Vue patches), and rewriting the baseline
 * then treats the user's edits as "clean" — which is why × sometimes left
 * without the unsaved menu even though the page had changed. Saves call
 * scheduleEntryBaselineAfterSave; closing Live Preview clears the snapshot.
 */
export function scheduleEntryBaseline(win) {
  if (entryValuesBaseline != null) {
    return;
  }

  clearTimeout(entryBaselineTimer);

  let attempts = 0;

  const trySnap = () => {
    attempts += 1;

    if (markEntryFormClean(win)) {
      entryBaselineTimer = null;

      return;
    }

    if (attempts < 20) {
      entryBaselineTimer = win.setTimeout(trySnap, 250);
    } else {
      entryBaselineTimer = null;
    }
  };

  entryBaselineTimer = win.setTimeout(trySnap, 600);
}

/**
 * After save/publish: wait for Statamic to apply resetValuesFromResponse (it
 * keeps trackDirtyState off for 500ms) and for Bard/visual ids to catch up,
 * then treat the hydrated form as clean.
 */
export function scheduleEntryBaselineAfterSave(win) {
  entrySaveSettling = true;
  clearTimeout(entryBaselineTimer);

  const delays = [600, 500];
  let step = 0;

  const run = () => {
    markEntryFormClean(win);
    step += 1;

    if (step < delays.length) {
      entryBaselineTimer = win.setTimeout(run, delays[step]);

      return;
    }

    entrySaveSettling = false;
    entryBaselineTimer = null;
  };

  entryBaselineTimer = win.setTimeout(run, delays[0]);
}

export function clearEntryBaseline() {
  clearTimeout(entryBaselineTimer);
  entryBaselineTimer = null;
  entryValuesBaseline = null;
  entrySaveSettling = false;
}
