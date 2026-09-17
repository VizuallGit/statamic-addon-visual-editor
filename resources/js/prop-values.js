/**
 * A component's fields, edited as a real publish form.
 *
 * The panel used to draw a text box per field, which is fine for a headline
 * and wrong for everything else: rich text needs a toolbar and room, a picture
 * needs the asset browser, a link needs the page picker. All three exist in
 * the Control Panel already, so the values are handed to a publish form and
 * the Control Panel draws what it always draws.
 *
 * A factory rather than one store, because there are two of these on screen at
 * once and they are showing different things: the values this *place* gives a
 * component, and the default the component itself falls back to. One store
 * between them would mean one overwriting the other on every paint.
 *
 * What crosses back is a string per field, because a value here *is*
 * `{{ partial:components/card headline="…" }}` — and that conversion is the
 * server's, since Bard's HTML writer and the asset lookup are its own.
 */

import { reactive } from 'vue';
import { mountStatamicSurface, statamicFieldsReady } from './cp/mount-statamic.js';
import PropValues from './cp/surfaces/PropValues.vue';
import { csrfToken } from './lib/csrf.js';

/** The fieldtypes this is no use without. */
const NEEDED = ['text', 'bard', 'assets', 'link'];

export function propValuesReady() {
  return statamicFieldsReady(NEEDED);
}

export function createPropValues(name) {
  const ui = reactive({
    ready: false,
    name,
    blueprint: null,
    fields: [],
    values: {},
    meta: {},
    readOnly: false,
    onChange: null,
    // A field can hold a value, or read one from the page. `bindings` holds the
    // Antlers expression for every field that is doing the second — the panel
    // draws a box and the data picker for those instead of the field itself.
    canBind: false,
    bindings: {},
    dataTitle: '',
    exprPlaceholder: '',
    onToggleBind: null,
    onExpr: null,
    onPickData: null,
  });

  let loadedKey = '';
  let host = null;
  let app = null;
  let timer = 0;
  let saving = false;
  let pending = false;

  /**
   * Load one form.
   *
   * Keyed, and loaded once per key: every write from this form re-renders what
   * it sits in, and reloading on each of those would take the caret out of
   * whatever is being typed in.
   */
  function load(win, { key, src, handle, display, params, bindings, readOnly }) {
    ui.readOnly = !!readOnly;
    ui.bindings = { ...(bindings || {}) };

    if (loadedKey === key) {
      return;
    }

    loadedKey = key;
    ui.ready = false;

    const query = new URLSearchParams({ src });

    if (handle) {
      query.set('handle', handle);
    }

    if (display) {
      query.set('display', display);
    }

    for (const [name, value] of Object.entries(params || {})) {
      query.append(`values[${name}]`, value ?? '');
    }

    void win
      .fetch(`/!/sve/prop-fields?${query}`, {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.blueprint || loadedKey !== key) {
          return;
        }

        ui.blueprint = data.blueprint;
        ui.fields = Array.isArray(data.fields) ? data.fields : [];
        ui.values = data.values || {};
        ui.meta = data.meta || {};
        ui.ready = true;
      })
      .catch(() => {});
  }

  function forget() {
    loadedKey = '';
    ui.ready = false;
    ui.blueprint = null;
    ui.fields = [];
    ui.values = {};
    ui.meta = {};
  }

  /**
   * What the form now holds, written back.
   *
   * Debounced, because a publish form reports every keystroke and every one of
   * those would be a write to the file.
   */
  function watch(win, { src, handle, write }) {
    ui.onChange = (values) => {
      // A publish form reports its values as it mounts, before anything has
      // been loaded into it. Writing those back would answer "" for every
      // field and take the whole call apart — merely *looking* at a
      // component's values would empty them.
      if (!ui.ready) {
        return;
      }

      ui.values = values;

      win.clearTimeout(timer);
      timer = win.setTimeout(() => flush(win, src, handle, write), 400);
    };
  }

  function flush(win, src, handle, write) {
    if (ui.readOnly || !ui.ready) {
      return;
    }

    // A save already in the air. Remember that another is due rather than
    // sending both — the second would answer with the same values anyway.
    if (saving) {
      pending = true;

      return;
    }

    saving = true;

    const body = { src, values: ui.values };

    if (handle) {
      body.handle = handle;
    }

    void win
      .fetch('/!/sve/prop-fields', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken(win),
        },
        body: JSON.stringify(body),
      })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        saving = false;

        if (data?.params) {
          write(data.params);
        }

        if (pending) {
          pending = false;
          flush(win, src, handle, write);
        }
      })
      .catch(() => {
        saving = false;
        pending = false;
      });
  }

  /** Mount into the placeholder the pane renders, once per element. */
  function mount(el) {
    if (!el) {
      unmount();

      return;
    }

    if (host === el) {
      return;
    }

    unmount();
    host = el;
    app = mountStatamicSurface(PropValues, el, { store: ui });
  }

  function unmount() {
    try {
      app?.unmount();
    } catch {
      /* already gone */
    }

    app = null;
    host = null;
  }

  return { ui, load, forget, watch, mount, unmount };
}
