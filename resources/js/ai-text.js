/**
 * Settings toggle: `ai_text`
 *
 * The Control Panel half of AI text. The preview draws the marks and the
 * popover (ai-text-bridge.js); this side answers the three questions only the
 * publish form can answer:
 *
 *   1. which field is that text, and what keywords is this page about
 *   2. what did the AI come back with
 *   3. write the chosen suggestion into the form
 *
 * Nothing here is saved. A suggestion lands in the form the same way typing in
 * the preview does — dirty, visible, and the user's to save or discard.
 */
import { t } from './lib/i18n.js';
import { chromeGet, chromeRemove, chromeSet } from './chrome-prefs.js';
import { syncBardEditorFromValue } from './inline-edit.js';
import { sendToPreview } from './cp.js';
import { currentSectionType } from './cp/preview-context.js';
import { csrfToken } from './lib/csrf.js';
import { dataGet, findPathByUid, unwrapRef } from './lib/values.js';
import { activeContainers } from './lib/publish-containers.js';
import { paintLpActiveControl } from './lp-panel.js';
import { deepestFieldPath } from './focus-panel.js';
import { MSG, SOURCE } from './lib/protocol.js';

const ON_KEY = 'sve-ai-text-on';

/**
 * The site-wide keywords, fetched once per Live Preview session.
 *
 * A global does not change while a page is being edited, and every popover on
 * the page wants the same list — so it is asked for once and handed out from
 * here afterwards.
 */
let siteKeywords = [];
let siteKeywordsLoaded = false;

/** Handles a page's keywords may live under. First one with a value wins. */
const KEYWORD_HANDLES = ['meta_keywords', 'keywords', 'seo_keywords'];

export function aiTextAllowed(win) {
  if (win.Statamic?.$config?.get?.('sveEnabled') === false) {
    return false;
  }

  return win.Statamic?.$config?.get?.('sveFeatures')?.ai_text === true;
}

export function aiTextReady(win) {
  return win.Statamic?.$config?.get?.('sveAiTextReady') === true;
}

/**
 * The switch, in memory.
 *
 * Stored state is the backup, not the source. `chromeGet` namespaces its key by
 * user id, and that id comes from `Statamic.$config` — which is not there in
 * every window this is called from. The lookup then misses and answers "off"
 * for a switch that is on, and the toolbar paints itself off half a second
 * after you turned it on. Reading it once, and only when nothing is known yet,
 * keeps every later caller on the same answer whatever window it holds.
 */
let aiTextOn = null;

export function isAiTextOn(win) {
  if (aiTextOn !== null) {
    return aiTextOn;
  }

  // The stored key is namespaced by user id, and that id comes from
  // Statamic.$config — which is not present in every window this runs in. Live
  // Preview is two of them: the Control Panel and the overlay that hosts it,
  // each with its own copy of this module. Asked from the wrong one, the
  // namespaced lookup misses and answers "off" for a switch that is on.
  //
  // So look for the value rather than for one exact key: whichever window wrote
  // it, this finds it.
  aiTextOn = false;

  try {
    const store = win.localStorage;

    for (let i = 0; i < store.length; i++) {
      const key = store.key(i);

      if ((key === ON_KEY || key?.endsWith(`:${ON_KEY}`)) && store.getItem(key) === '1') {
        aiTextOn = true;
        break;
      }
    }
  } catch {
    /* private mode — the switch starts off */
  }

  return aiTextOn;
}

/**
 * Turn the marks on or off, and remember it.
 *
 * Remembered because it is a way of working, not a one-off action: an editor
 * going through a page rewriting copy wants the marks on for the whole page, and
 * a preview re-render must not put them away.
 */
export function toggleAiText(win) {
  setAiText(win, !isAiTextOn(win));
}

export function setAiText(win, next) {
  const on = !!next;

  aiTextOn = on;

  if (on) {
    chromeSet(win, ON_KEY, '1');
  } else {
    chromeRemove(win, ON_KEY);
  }

  sendToPreview({ source: SOURCE, type: MSG.AI_TEXT_MODE, on }, win);
  paintToolbarButton(win);
}

/**
 * Tell the preview which mode it is in.
 *
 * Called when the preview says hello (it has just loaded) and when the toolbar
 * button is (re)built. Sends the state either way rather than only when on: a
 * preview that reloads mid-session has to be told to put the marks away too.
 */
export function syncAiTextToPreview(win) {
  if (!aiTextAllowed(win)) {
    return;
  }

  sendToPreview({ source: SOURCE, type: MSG.AI_TEXT_MODE, on: isAiTextOn(win) }, win);
}

function paintToolbarButton(win) {
  const btn = win.document.querySelector('#__sve-toolbar button[data-tab="aitext"]');

  if (!btn) {
    return;
  }

  const on = isAiTextOn(win);

  // The bar's own painter — the one the device buttons, the code dock and the
  // panel icon all go through. Nothing is styled here: an icon that paints
  // itself is an icon that stops matching its neighbours.
  paintLpActiveControl(btn, on);
  btn.title = t(win, on ? 'ai_text_on' : 'ai_text_off');
}

/* --------------------------------------------------------------------------
 * Which field is that text?
 * ------------------------------------------------------------------------ */

/**
 * The clicked text's dotted path in the publish form, and the container it is in.
 *
 * The same three steps inline editing takes — scope uid to a base path, base
 * path plus handle, and a cascade for rows whose ids were stripped — using the
 * same helpers, so the two cannot disagree about where a field is. What it does
 * not do is verify the rendered text against the value: inline editing has to,
 * because it writes keystrokes back into a string it must not corrupt. Here the
 * whole value is replaced, so a modifier-transformed rendering is no danger.
 */
function resolveField(data, doc) {
  if (!data.field) {
    return null;
  }

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let basePath = '';

    if (data.scope) {
      basePath = findPathByUid(values, data.scope);

      if (basePath === null) {
        continue; // that uid belongs to another form
      }
    }

    let path = [basePath, data.field].filter(Boolean).join('.');
    let value = dataGet(values, path);

    if (value === undefined && basePath !== '') {
      const deep = deepestFieldPath(dataGet(values, basePath), data.field, basePath);

      if (deep) {
        path = deep;
        value = dataGet(values, path);
      }
    }

    if (value === undefined) {
      // A row that has never been typed into has no key yet. It is still the
      // right field, and an empty one is exactly what this tool is for.
      const row = basePath ? dataGet(values, basePath) : values;

      if (!row || typeof row !== 'object' || Array.isArray(row)) {
        continue;
      }

      value = data.fieldtype === 'bard' ? [] : '';
    }

    return { container, values, path, value };
  }

  return null;
}

/** The page's own keywords, as they stand in the open form. */
function pageKeywords(doc) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    for (const handle of KEYWORD_HANDLES) {
      const found = cleanKeywords(dataGet(values, handle));

      if (found.length) {
        return found;
      }
    }

    // Nested under a group or a tab (`seo.keywords`) rather than at the top.
    const nested = findKeywordsDeep(values, 0);

    if (nested.length) {
      return nested;
    }
  }

  return [];
}

/**
 * A `keywords` handle anywhere shallow in the values.
 *
 * Shallow on purpose: a keyword list inside a replicator row belongs to that
 * row, not to the page, and picking one up would aim every suggestion on the
 * page at whatever a single block happens to say.
 */
function findKeywordsDeep(node, depth) {
  if (depth > 2 || !node || typeof node !== 'object' || Array.isArray(node)) {
    return [];
  }

  for (const [key, value] of Object.entries(node)) {
    if (/(^|_)keywords$/.test(key)) {
      const found = cleanKeywords(value);

      if (found.length) {
        return found;
      }
    }
  }

  for (const value of Object.values(node)) {
    const found = findKeywordsDeep(value, depth + 1);

    if (found.length) {
      return found;
    }
  }

  return [];
}

function cleanKeywords(value) {
  if (typeof value === 'string') {
    value = value.split(/\s*[,;\n]\s*/);
  }

  if (!Array.isArray(value)) {
    return [];
  }

  const out = [];

  for (const row of value) {
    const word = typeof row === 'string' ? row.trim() : typeof row?.value === 'string' ? row.value.trim() : '';

    if (word && !out.includes(word)) {
      out.push(word);
    }
  }

  return out.slice(0, 12);
}

/** The stored text, as plain text, whatever fieldtype holds it. */
function plainText(value) {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    // Bard: paragraphs and headings, separated the way the popover will send
    // them back.
    return value
      .map((node) => bardText(node))
      .filter((text) => text.trim() !== '')
      .join('\n\n');
  }

  return '';
}

function bardText(node) {
  if (!node || typeof node !== 'object') {
    return '';
  }

  if (typeof node.text === 'string') {
    return node.text;
  }

  return Array.isArray(node.content) ? node.content.map(bardText).join('') : '';
}

/* --------------------------------------------------------------------------
 * The three messages
 * ------------------------------------------------------------------------ */

function reply(win, message) {
  sendToPreview({ source: SOURCE, ...message }, win);
}

export function handleAiTextOpen(data, doc, win) {
  const found = resolveField(data, doc);

  if (!found) {
    reply(win, { type: 'ai-text-deny', requestId: data.requestId, message: t(win, 'ai_text_denied') });

    return;
  }

  if (!aiTextReady(win)) {
    reply(win, { type: 'ai-text-deny', requestId: data.requestId, message: t(win, 'ai_text_need_key') });

    return;
  }

  const page = pageKeywords(doc);

  reply(win, {
    type: 'ai-text-ready',
    requestId: data.requestId,
    text: plainText(found.value),
    keywords: { page, site: siteKeywords },
  });

  // The site's list is a global — fetched once per Live Preview session, then
  // handed to every popover from memory.
  if (siteKeywords.length === 0 && !siteKeywordsLoaded) {
    loadSiteKeywords(win).then(() => {
      reply(win, {
        type: 'ai-text-ready',
        requestId: data.requestId,
        text: plainText(found.value),
        keywords: { page, site: siteKeywords },
      });
    });
  }
}

async function loadSiteKeywords(win) {
  if (siteKeywordsLoaded) {
    return;
  }

  siteKeywordsLoaded = true;

  try {
    const res = await win.fetch('/!/sve/ai-copy/keywords', {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
    });

    if (res.ok) {
      const body = await res.json();

      siteKeywords = Array.isArray(body?.site) ? body.site : [];
    }
  } catch {
    /* the popover works without them */
  }
}

export async function handleAiTextGenerate(data, doc, win) {
  const found = resolveField(data, doc);

  if (!found) {
    reply(win, { type: 'ai-text-deny', requestId: data.requestId, message: t(win, 'ai_text_denied') });

    return;
  }

  const stored = plainText(found.value);

  try {
    const res = await win.fetch('/!/sve/ai-copy', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrfToken(win),
        Accept: 'application/json',
      },
      body: JSON.stringify({
        kind: data.kind || 'text',
        // The stored value, not the rendered text: modifiers may have changed
        // what the page shows, and the suggestion replaces the value.
        text: stored || data.text || '',
        instruction: data.instruction || '',
        count: data.count || 1,
        // Hvor langt forslaget skal være. Feltet i panelet starter på længden af
        // det der står nu, så "lad den stå" betyder "cirka lige så langt".
        words: data.words || 0,
        avoid: Array.isArray(data.avoid) ? data.avoid : [],
        keywords: pageKeywords(doc),
        page: entryTitle(doc, win),
        section: currentSectionType(win) || '',
        label: fieldLabel(data, doc),
      }),
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      reply(win, {
        type: 'ai-text-result',
        requestId: data.requestId,
        suggestions: [],
        message: body?.message || t(win, 'ai_text_error'),
      });

      return;
    }

    reply(win, {
      type: 'ai-text-result',
      requestId: data.requestId,
      suggestions: Array.isArray(body?.suggestions) ? body.suggestions : [],
    });
  } catch (e) {
    reply(win, {
      type: 'ai-text-result',
      requestId: data.requestId,
      suggestions: [],
      message: e?.message || t(win, 'ai_text_error'),
    });
  }
}

/**
 * Write the chosen suggestion into the form.
 *
 * Bard gets nodes, everything else gets the string. Statamic's own reactivity
 * does the rest: the values watcher marks the form dirty and re-renders the
 * preview, and the Bard fieldtype picks up a value changed from outside.
 */
/**
 * A keyword typed in the panel, written into the page's own field.
 *
 * Goes into the form like any other edit — dirty, visible in the SEO tab, and
 * the user's to save or discard. If the blueprint has no keywords field there
 * is nothing to write to, and the panel keeps the word for this session only.
 */
export function handleAiTextSetKeywords(data, doc, win) {
  if (!Array.isArray(data.keywords)) {
    return;
  }

  const words = data.keywords.filter((w) => typeof w === 'string' && w.trim() !== '');

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    for (const handle of KEYWORD_HANDLES) {
      if (handle in values) {
        container.setFieldValue(handle, words);

        return;
      }
    }
  }
}

export function handleAiTextApply(data, doc, win) {
  const found = resolveField(data, doc);

  if (!found || typeof data.text !== 'string') {
    return;
  }

  const text = data.text;
  const isBard = data.fieldtype === 'bard' || Array.isArray(found.value);

  if (isBard) {
    const nodes = bardNodes(text, found.value);

    found.container.setFieldValue(found.path, nodes);
    syncBardEditorFromValue(doc, data.field, data.scope, nodes);
  } else {
    found.container.setFieldValue(found.path, text);
  }
}

/**
 * Plain text as Bard nodes.
 *
 * The first node keeps the type it had — a headline field stored as a single
 * `heading` must not come back as a paragraph, or the page loses its h2. Marks
 * and attrs are not carried over: the text is new, and a colour span that fit
 * the old words has no claim on the new ones.
 */
function bardNodes(text, current) {
  const first = Array.isArray(current) ? current.find((node) => node?.type) : null;
  const paragraphs = text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (!paragraphs.length) {
    return [];
  }

  return paragraphs.map((part, i) => {
    const type = i === 0 && first?.type === 'heading' ? 'heading' : 'paragraph';
    const node = { type, content: [{ type: 'text', text: part }] };

    if (type === 'heading' && first?.attrs?.level) {
      node.attrs = { level: first.attrs.level };
    }

    return node;
  });
}

function entryTitle(doc, win) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);
    const title = values?.title;

    if (typeof title === 'string' && title.trim() !== '') {
      return title.trim();
    }
  }

  return win.document.title || '';
}

/** The field's display name, for the prompt's "where it sits" note. */
function fieldLabel(data, doc) {
  if (!data.field) {
    return '';
  }

  const el = doc.querySelector(`[data-handle="${cssEscape(data.field)}"] label, [data-handle="${cssEscape(data.field)}"] .field-label`);

  return (el?.textContent || data.field).trim().slice(0, 120);
}

function cssEscape(value) {
  return typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(value) : String(value).replace(/["\\]/g, '\\$&');
}
