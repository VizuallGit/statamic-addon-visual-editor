/**
 * A template's elements made editable from Build's Content: a field of the
 * entries the file draws (TemplateFields.php) — a cases template's, an own
 * page's — the way a section's is a field of its fieldset.
 *
 * Only "Editable in Edit Content" makes one, never a first change as in a
 * section (the owner's decision of 9 Nov 2026): a cases template's text is the
 * template's for every case, and an own page's file belongs to that page. So
 * there is no hidden "own content" here — the field is a normal one.
 *
 * Which blueprints the file stands for is the server's answer for the file
 * the dock holds and the entry open in Live Preview, asked once per pair and
 * kept in a ref, so a panel that asked before it landed draws again when it
 * does.
 *
 * May import: lib/, the bus, Vue.
 */
import { ref } from 'vue';
import { ask } from '../cp/bus.js';
import { currentEntryId } from '../lib/live-preview.js';
import { csrfToken } from '../lib/csrf.js';

const API = '/!/sve/template-fields';

/** `${view}|${entry}` → { can, fields: [{ handle, type }] } once the answer is in. */
const known = ref({});
/** The pairs being asked: kept out of the ref, which a computed may be reading. */
const asking = new Set();

/**
 * The view the dock holds when it is a template's file — `cases/show`, an own
 * page's — else ''. A section, a component, the header, the footer and the
 * layout are not: their content is a fieldset's, a component's props, a global's
 * or every page's.
 */
export function templateView() {
  const type = String(ask('dock:current-type') || '');
  const chrome = String(ask('dock:chrome-kind') || '');

  if (!type.startsWith('view:') || (chrome && chrome !== 'template') || ask('dock:component-src')) {
    return '';
  }

  return type.slice('view:'.length).replace(/^\/+|\/+$/g, '');
}

function keyFor(win, view) {
  return `${view}|${currentEntryId(win) || ''}`;
}

function load(win, view) {
  const key = keyFor(win, view);
  const query = new URLSearchParams({ view, id: currentEntryId(win) || '' });

  asking.add(key);

  win
    .fetch(`${API}?${query}`, { headers: { Accept: 'application/json' }, credentials: 'same-origin' })
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null)
    .then((json) => {
      asking.delete(key);
      known.value = {
        ...known.value,
        [key]: { can: json?.can === true, fields: Array.isArray(json?.fields) ? json.fields : [] },
      };
    });
}

/**
 * What the template's entries hold for the file in the dock: `{ can, fields }`
 * — every field by `handle` and `type` — or null while it is asked (and when the
 * dock holds no template's file). Read inside a computed, it draws again when
 * the answer lands. The server's answer, not the Data button's lists: those
 * read a template's collection off the form, where it is not always a name.
 */
export function templateFields(win) {
  const view = templateView();

  if (!view) {
    return null;
  }

  const key = keyFor(win, view);

  if (!(key in known.value) && !asking.has(key)) {
    load(win, view);
  }

  return known.value[key] ?? null;
}

/** The template's fields by name: what makes a tag in an element its own. */
export function templateFieldNames(win) {
  return (templateFields(win)?.fields || []).map((field) => field.handle);
}

/** A field of the template's entries of a fitting type: one an element's `visual_edit` may point at. */
export function isTemplateField(win, name, types) {
  return (
    !!name && (templateFields(win)?.fields || []).some((field) => field.handle === name && types.includes(field.type))
  );
}

/**
 * A field more for the template's entries, the element's content as its
 * default. The data lists are read again, so the field is known as the
 * template's at once; when the open form is edited with one of the blueprints
 * written (an own page), Live Preview is loaded again once the dock's write of
 * the tag has landed — only a real load puts the field in the form.
 *
 * @returns {Promise<string|null>} the field's handle; null when none was made,
 *   or the dock holds another file by now
 */
export async function makeTemplateField(win, { kind, name, value }) {
  const view = templateView();

  if (!view) {
    return null;
  }

  const res = await win
    .fetch(API, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrfToken(win),
      },
      body: JSON.stringify({ view, id: currentEntryId(win) || '', kind, name, value }),
    })
    .catch(() => null);
  const made = res?.ok ? await res.json().catch(() => null) : null;

  if (!made?.handle) {
    return null;
  }

  const key = keyFor(win, view);
  const was = known.value[key];

  known.value = {
    ...known.value,
    [key]: { can: true, fields: [...(was?.fields || []), { handle: made.handle, type: String(made.type || kind) }] },
  };
  ask('dock:reset-data-vars');

  if (made.reload) {
    reloadAfterWrite(win, made.handle);
  }

  return templateView() === view ? made.handle : null;
}

/**
 * Live Preview loaded again once the tag is in the file and saved: the caller
 * writes `{{ field }}` after this returns, its `visual_edit` follows once the
 * data lists are read again, and the dock saves on its own timer — so the
 * file is watched for both (4 s at most), saved now, and the save waited for.
 */
function reloadAfterWrite(win, handle) {
  const started = Date.now();
  const written = () => {
    const html = String(ask('dock:html') || '');

    return html.includes(`{{ ${handle} }}`) && html.includes(`field="${handle}"`);
  };

  const tick = async () => {
    if (!written() && Date.now() - started < 4000) {
      win.setTimeout(tick, 100);

      return;
    }

    ask('dock:save-now');
    await Promise.resolve(ask('dock:save-settled')).catch(() => null);

    const { reloadEverything } = await import('../lp-reload.js');

    reloadEverything(win);
  };

  win.setTimeout(tick, 100);
}
