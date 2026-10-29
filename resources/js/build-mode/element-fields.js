/**
 * An element's address as the Control Panel's own field: an image's or a
 * video's `src` picked in the asset browser, a link's `href` in the page
 * picker — Visual Build's Content (BuildContent.vue).
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: cp/mount-statamic.js, cp/surfaces/PropValues.vue, lib/csrf.js, attrs.js.
 * Bus messages: none.
 *
 * Reached through the port (boot.js `mountAddress`), never imported by the
 * panel: the form needs the Control Panel's `@statamic/cms/ui`, which a page
 * without the CP — the harness — does not have.
 *
 * Nothing here draws a field or converts a value. The form is a component's
 * fields' own (PropValues.vue, mounted as its own app with the CP's registry —
 * mount-statamic.js), and the conversions are the server's
 * (`/!/sve/element-fields`, on PropFields): the asset browser answers with a
 * path and the attribute wants a URL, the page picker answers `entry::…` and
 * the attribute wants the page's address.
 */

import { reactive } from 'vue';
import { mountStatamicSurface, statamicFieldsReady } from '../cp/mount-statamic.js';
import PropValues from '../cp/surfaces/PropValues.vue';
import { csrfToken } from '../lib/csrf.js';
import { ADDRESS } from './attrs.js';

/** Whether the Control Panel can lend this tag's field — an older one gets a plain box instead. */
export function elementFieldReady(tag) {
  const field = ADDRESS[tag];

  return !!field && statamicFieldsReady([field.fieldtype]);
}

/**
 * The field, mounted into `el`, opened on the element's address `value`.
 * `write(value)` gets the attribute's new value, once the field settles.
 *
 * @returns {() => void} unmount — a change still on its way is sent first
 */
export function mountElementField(win, el, { tag, value, display, write }) {
  const ui = reactive({
    ready: false,
    name: `sve-build-${tag}`,
    blueprint: null,
    fields: [],
    values: {},
    meta: {},
    readOnly: false,
    onChange: null,
    canBind: false,
    bindings: {},
  });
  const post = (url, body) =>
    win
      .fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken(win),
        },
        body: JSON.stringify(body),
      })
      .then((res) => (res.ok ? res.json() : null));

  let loaded = '';
  let timer = 0;
  let saving = false;
  let pending = false;
  let gone = false;

  post('/!/sve/element-fields/form', { tag, value, display })
    .then((data) => {
      if (gone || !data?.blueprint) {
        return;
      }

      ui.blueprint = data.blueprint;
      ui.fields = Array.isArray(data.fields) ? data.fields : [];
      ui.values = data.values || {};
      ui.meta = data.meta || {};
      loaded = JSON.stringify(ui.values);
      ui.ready = true;
    })
    .catch(() => {});

  // The form reports its values as it mounts, and again with what it was
  // given: only a value that differs from the one loaded is a change.
  ui.onChange = (values) => {
    if (!ui.ready || JSON.stringify(values) === loaded) {
      return;
    }

    ui.values = values;
    win.clearTimeout(timer);
    timer = win.setTimeout(flush, 250);
  };

  /** What the field holds, as the attribute's value — one request in the air at a time. */
  function flush() {
    timer = 0;

    if (saving) {
      pending = true;

      return;
    }

    saving = true;
    loaded = JSON.stringify(ui.values);

    // Written even when the panel has moved on: `write` is bound to the
    // element the field was opened for, not to whatever is picked now.
    post('/!/sve/element-fields', { tag, value, values: ui.values })
      .then((data) => {
        saving = false;

        if (typeof data?.value === 'string') {
          write(data.value);
        }

        if (pending) {
          pending = false;
          flush();
        }
      })
      .catch(() => {
        saving = false;
        pending = false;
      });
  }

  const app = mountStatamicSurface(PropValues, el, { store: ui });

  return () => {
    gone = true;

    if (timer) {
      win.clearTimeout(timer);
      flush();
    }

    try {
      app.unmount();
    } catch {
      /* already gone with its host */
    }
  };
}
