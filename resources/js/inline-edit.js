/**
 * Settings toggle: `inline_edit`
 * Click text in the preview and type into it.
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { sve } from './cp-registry.js';
import { t } from './cp-t.js';
import { sveState } from './cp-state.js';
import { ACTIVE_ATTR, COLLAPSE_SETTLE_MS, SELECTORS } from './cp-selectors.js';
import {
  BP_INHERITS,
  collectAncestorSets,
  currentBp,
  ensureLpBackButton,
  expandSet,
  findBardVueProxy,
  findFieldElement,
  findSetByUid,
  handleFieldFocus,
  rowIsLocked,
  sendToPreview,
  switchToContainingTab,
} from './cp.js';
import NamePrompt from './cp/surfaces/NamePrompt.vue';
import SaveSectionDialog from './cp/surfaces/SaveSectionDialog.vue';
import { openCpOverlay } from './cp/open-overlay.js';

// ===== inline-edit =====
// --- Inline editing: write-back ---------------------------------------------
//
// The preview iframe sends edit-request / edit-input / edit-end messages
// (see bridge.js). This side resolves the clicked field to a dotted value
// path in the publish form, verifies the rendered text actually matches the
// stored value (so modifier-transformed output can never be written back as
// the wrong value), and writes edits via the container's setFieldValue().
// Statamic's own reactivity does the rest: the deep values watcher marks the
// form dirty and triggers the live preview re-render, and the Bard fieldtype's
// value watcher updates its editor when the value changes from outside.

/** Node types the inline editor may edit as a single contenteditable block. */
export const EDITABLE_NODE_TYPES = ['heading', 'paragraph'];

// Publish containers captured from Statamic's `publish-container-created`
// event (fired by Container.vue on mount; payload includes the reactive
// `values` ref and `setFieldValue`). Registered in initCp, which runs inside
// Statamic.booting() — before any container mounts.
export const publishContainers = [];

// The active inline-edit session, keyed by the bridge's requestId.
export let editSession = null;

export function registerContainerEvents(win = window) {
  const events = win.Statamic?.$events;

  if (!events?.$on) {
    return;
  }

  events.$on('publish-container-created', (payload) => {
    if (payload?.setFieldValue && payload?.values) {
      publishContainers.push(payload);
    }
  });

  events.$on('publish-container-destroyed', (payload) => {
    const index = publishContainers.findIndex((c) => c.name === payload?.name);

    if (index !== -1) {
      publishContainers.splice(index, 1);
    }
  });
}

/** Unwraps a Vue ref (Container.vue provides `values` as a ref). */
export function unwrapRef(v) {
  return v && v.__v_isRef ? v.value : v;
}

/**
 * Entry-form values considered "clean" when Live Preview opened (or after save).
 * Statamic's $dirty is sticky / noisy on mount — especially with revisions, where
 * Save stays enabled even when nothing changed — so the back button compares
 * against this snapshot instead of trusting $dirty alone.
 */
export let entryValuesBaseline = null;
export let entryBaselineTimer = null;
// True between a successful save/publish response and the delayed re-baseline.
// Statamic writes the response into the form with trackDirtyState off for 500ms,
// so an immediate snapshot is the *pre*-response values — leave then thinks the
// hydrated form is unsaved work. Suppress the warning until we catch up.
export let entrySaveSettling = false;

/** The entry publish container ("base"), if we've seen it. */
export function entryPublishContainer() {
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
  sve.discardChanges(win);
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

/**
 * Push a Bard value into the mounted TipTap editor in the sidebar.
 *
 * Colour/mark writes sometimes leave TipTap stale after setFieldValue alone.
 * Typing must NOT hammer setContent — Vue already updates the editor, and
 * repeated setContent/blur is what made the sidebar flicker 4–5 times.
 *
 * Coalesce: only the latest pending value is applied, once, after a short wait
 * so Vue can catch up first. If TipTap already matches, we no-op.
 */
export let bardSyncTimer = null;
export let bardSyncPending = null;

export function syncBardEditorFromValue(doc, field, scope, value) {
  if (!doc || !field || !Array.isArray(value)) {
    return;
  }

  bardSyncPending = { doc, field, scope, value: JSON.parse(JSON.stringify(value)) };
  clearTimeout(bardSyncTimer);
  // Wait for Vue's setFieldValue → Bard watcher to settle. If TipTap already
  // matches then, we skip setContent entirely (typing: no flicker). Colour
  // marks that the watcher missed still get one corrective write.
  bardSyncTimer = setTimeout(flushBardEditorSync, 100);
}

export function flushBardEditorSync(attempt = 0) {
  const job = bardSyncPending;

  if (!job) {
    return;
  }

  const { doc, field, scope, value } = job;
  const fieldEl = findFieldElement(field, doc, scope);
  const bardEl = fieldEl
    ? fieldEl.closest('.bard-fieldtype') || fieldEl.querySelector('.bard-fieldtype') || fieldEl
    : null;
  const proxy = bardEl ? findBardVueProxy(bardEl) : null;

  if (!proxy?.editor) {
    // Editor not mounted yet (replicator tab, etc.) — one short retry, not a storm.
    if (attempt < 5) {
      bardSyncTimer = setTimeout(() => flushBardEditorSync(attempt + 1), 50);
    }

    return;
  }

  let currentContent = null;

  try {
    currentContent = proxy.editor.getJSON()?.content ?? null;
  } catch {
    currentContent = null;
  }

  // Vue already applied setFieldValue — leave TipTap alone (avoids flicker).
  if (JSON.stringify(value) === JSON.stringify(currentContent)) {
    bardSyncPending = null;

    return;
  }

  try {
    if ('debounceNextUpdate' in proxy) {
      proxy.debounceNextUpdate = false;
    }

    if (proxy.editor?.commands?.setContent) {
      const content = value.length
        ? { type: 'doc', content: JSON.parse(JSON.stringify(value)) }
        : null;

      proxy.editor.commands.setContent(content, false);
    }

    if ('json' in proxy) {
      proxy.json = JSON.parse(JSON.stringify(value));
    }
  } catch {
    /* ignore */
  }

  bardSyncPending = null;
}

/** Write Bard JSON to the form AND force the sidebar TipTap view to match. */
export function writeBardFieldValue(container, path, value, doc, session) {
  const next = JSON.parse(JSON.stringify(value));

  container.setFieldValue(path, next);
  syncBardEditorFromValue(doc, session?.field, session?.scope, next);
}

/**
 * Fallback when no container was captured via events (e.g. the CP script ran
 * after the container mounted): walk the Vue component chain from a
 * [data-visual-id] input to the PublishContainer's provided context, which
 * has the same { values, setFieldValue } shape as the event payload.
 */
export function containerFromDom(doc) {
  // Synced-section forms often have no [data-visual-id] yet (stripped on save).
  // Walk from any publish-form mount point, not only AutoUuid inputs.
  const starters = [
    doc.querySelector(SELECTORS.visualIdInput),
    doc.querySelector('.publish-form'),
    doc.querySelector('.publish-fields'),
    doc.querySelector('[data-reka-tabs-root]'),
    doc.querySelector('main'),
  ].filter(Boolean);

  for (const el of starters) {
    let component = el.__vueParentComponent;

    while (component) {
      const ctx = component.provides?.['PublishContainerContext'];

      if (ctx?.setFieldValue) {
        return ctx;
      }

      component = component.parent;
    }
  }

  return null;
}

export function activeContainers(doc) {
  // Most recently created first — matches the form the user is looking at.
  const list = [...publishContainers].reverse();

  if (!list.length) {
    const ctx = containerFromDom(doc);

    if (ctx) {
      list.push(ctx);
    }
  }

  // A global section's content belongs to the entry open in the panel — another
  // window, so none of the containers above have ever heard of it. Appended last,
  // so the page's own fields always win a name clash, this stands in for it: every
  // caller (inline edit, findPathByUid, the settings panel) then treats a global
  // section exactly like one of the page's own.
  const panel = sve.sectionPanelContainer(doc);

  if (panel) {
    list.push(panel);
  }

  return list;
}

/** data_get-style dotted path lookup ("page_sections.0.text"). */
export function dataGet(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

/** The row a field path sits in ("…blocks.1.headline" → "…blocks.1"). */
export function rowPathOf(fieldPath) {
  return fieldPath.includes('.') ? fieldPath.slice(0, fieldPath.lastIndexOf('.')) : '';
}

/**
 * Current values of the sibling fields the preview toolbar asked for
 * (controls="font_tag|size"), so it can render them pre-selected.
 */
export function controlValues(values, fieldPath, handles) {
  if (!Array.isArray(handles) || !handles.length) {
    return null;
  }

  const row = rowPathOf(fieldPath);
  const out = {};

  for (const handle of handles) {
    if (typeof handle === 'string' && handle) {
      out[handle] = dataGet(values, row ? `${row}.${handle}` : handle);
    }
  }

  return out;
}

/**
 * Recursively finds the dotted path of the set whose _visual_id (or row id)
 * equals uid. Mirrors how the preview's scope uid identifies a section/row.
 *
 * Row ids match both `id` and `_id`: the front-end context exposes `id`
 * (Replicator.processRow renames _id → id), but the publish FORM values keep
 * the raw `_id` key — column builder rows are only findable through it.
 */
export function findPathByUid(value, uid, path = '') {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const found = findPathByUid(value[i], uid, path ? `${path}.${i}` : String(i));

      if (found !== null) {
        return found;
      }
    }

    return null;
  }

  if (value && typeof value === 'object') {
    if (value._visual_id === uid || value.id === uid || value._id === uid) {
      return path;
    }

    for (const key of Object.keys(value)) {
      const found = findPathByUid(value[key], uid, path ? `${path}.${key}` : key);

      if (found !== null) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Whitespace-normalizes text for comparison across the preview DOM and the CP
 * form values: nbsp → space, collapse runs, trim. Duplicated in bridge.js
 * because the two files run in separate bundles (CP window vs. preview iframe).
 */
export function normText(s) {
  return (s || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Flattens a ProseMirror node to plain text for comparison with the preview
 * DOM's textContent. hardBreak maps to '' — <br> contributes nothing to
 * textContent, so both sides must agree ("råvarer.<br>Vi" reads "råvarer.Vi").
 */
export function bardNodeText(node) {
  if (!node) {
    return '';
  }

  if (node.type === 'text') {
    return node.text || '';
  }

  if (node.type === 'hardBreak') {
    return '';
  }

  return (node.content || []).map(bardNodeText).join('');
}

/** Unwrapped inline Bard root (text/hardBreak) — form may hold this after process(). */
export function isUnwrappedInlineBard(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((node) => node && (node.type === 'text' || node.type === 'hardBreak'))
  );
}

/**
 * Inline Bard values the CP can edit as one whole-field paragraph:
 * - legacy string (pre-Bard content)
 * - unwrapped text nodes (post-process / default)
 * - already-wrapped paragraph/heading docs
 */
export function normalizeInlineBardValue(value) {
  if (typeof value === 'string') {
    return [
      {
        type: 'paragraph',
        content: value === '' ? [] : [{ type: 'text', text: value }],
      },
    ];
  }

  if (isUnwrappedInlineBard(value)) {
    return [{ type: 'paragraph', content: value }];
  }

  return value;
}

/**
 * Find a Bard set (or other locked node) from the session original by its
 * preview `_visual_id` / attrs.id — used when whole-field edit re-serializes
 * text blocks but must keep set nodes in place.
 */
export function findPreservedBardNode(nodes, visualId) {
  if (!Array.isArray(nodes) || !visualId) {
    return null;
  }

  return (
    nodes.find((node) => {
      if (!node || node.type !== 'set') {
        return false;
      }

      const values = node.attrs?.values || {};

      return values._visual_id === visualId || node.attrs?.id === visualId;
    }) || null
  );
}

/**
 * Collects candidate edit targets for the clicked text within a field value.
 *
 * - string values match when their normalized text equals the clicked block's
 *   (or wrapper's) text.
 * - arrays are treated as Bard: heading/paragraph nodes match on flattened text.
 * - plain objects (group fields like section_heading) recurse one level so
 *   their string/Bard members are reachable.
 *
 * The caller requires EXACTLY one candidate — ambiguity means we cannot know
 * which value the user clicked, so editing is denied.
 */
export function resolveEditTargets(value, path, req, depth = 0) {
  if (typeof value === 'string') {
    const t = normText(value);

    if ((req.blockText !== null && t === req.blockText) || t === req.wrapperText) {
      return [{ mode: 'string', path }];
    }

    return [];
  }

  if (Array.isArray(value)) {
    if (req.blockText === null) {
      return [];
    }

    const out = [];

    value.forEach((node, i) => {
      if (
        node &&
        EDITABLE_NODE_TYPES.includes(node.type) &&
        normText(bardNodeText(node)) === req.blockText
      ) {
        out.push({ mode: 'bard', path, index: i });
      }
    });

    return out;
  }

  if (value && typeof value === 'object' && depth < 2) {
    let out = [];

    for (const key of Object.keys(value)) {
      out = out.concat(resolveEditTargets(value[key], `${path}.${key}`, req, depth + 1));
    }

    return out;
  }

  return [];
}

/** HTML tag → ProseMirror mark type for inline content parsing. */
export const MARK_TAGS = {
  STRONG: 'bold',
  B: 'bold',
  EM: 'italic',
  I: 'italic',
  U: 'underline',
  S: 'strike',
  STRIKE: 'strike',
  DEL: 'strike',
  CODE: 'code',
  SUB: 'subscript',
  SUP: 'superscript',
};

// bard-texstyle span-type styles that inline editing can toggle. A <span> whose
// class is one of these maps to a btsSpan ProseMirror mark; any other span is
// treated as transparent styling. Mirrors the span-type entries in
// config/statamic/bard_texstyle.php — extend here if the site adds more.
export const BTS_SPAN_CLASSES = ['uppercase'];

export function sameMarks(a, b) {
  return JSON.stringify(a || []) === JSON.stringify(b || []);
}

/**
 * Parses the innerHTML of an inline-edited block back into ProseMirror inline
 * content. Semantic tags become marks; everything else (site spans, styling
 * wrappers) is transparent — only its text survives. This intentionally
 * ignores presentation-only markup the site's own JS may have injected
 * (e.g. word-reveal <span>s around headline words).
 */
export function parseInlineHtml(html, doc = document, spanClasses = BTS_SPAN_CLASSES) {
  const root = doc.createElement('div');

  root.innerHTML = html;

  const out = [];

  const pushText = (text, marks) => {
    if (!text) {
      return;
    }

    const last = out[out.length - 1];

    if (last && last.type === 'text' && sameMarks(last.marks, marks)) {
      last.text += text;

      return;
    }

    const node = { type: 'text', text };

    if (marks.length) {
      node.marks = marks.map((m) => ({ ...m }));
    }

    out.push(node);
  };

  const walk = (node, marks) => {
    for (const child of node.childNodes) {
      if (child.nodeType === 3) {
        // Collapse whitespace like HTML rendering does — pretty-printed
        // template markup must not leak literal newlines/indentation into text.
        pushText(child.nodeValue.replace(/\u00a0/g, ' ').replace(/\s+/g, ' '), marks);
      } else if (child.nodeType === 1) {
        if (child.tagName === 'BR') {
          out.push({ type: 'hardBreak' });
          continue;
        }

        let childMarks = marks;
        const markType = MARK_TAGS[child.tagName];

        if (markType) {
          childMarks = [...marks, { type: markType }];
        } else if (child.tagName === 'A') {
          const attrs = { href: child.getAttribute('href') };

          for (const attr of ['target', 'rel', 'title']) {
            if (child.getAttribute(attr)) {
              attrs[attr] = child.getAttribute(attr);
            }
          }

          childMarks = [...marks, { type: 'link', attrs }];
        } else if (child.tagName === 'SPAN') {
          // Vizuall bard-style mark (span[data-vizu] style="prop: value").
          // Also accept colour-only spans without data-vizu (inline colour from
          // the preview toolbar / browser execCommand leftovers).
          const style = child.getAttribute('style') || '';
          const hasVizu = child.hasAttribute('data-vizu');
          const colorOnly = !hasVizu && /(?:^|;)\s*color\s*:/i.test(style);

          if ((hasVizu || colorOnly) && style) {
            childMarks = [...marks, { type: 'vizuStyle', attrs: { style } }];
          } else if (/(?:^|;)\s*font-weight\s*:\s*(bold|[6-9]00)/i.test(style)) {
            childMarks = [...marks, { type: 'bold' }];
          } else if (/(?:^|;)\s*font-style\s*:\s*italic/i.test(style)) {
            childMarks = [...marks, { type: 'italic' }];
          } else {
            // bard-texstyle span marks (e.g. class="uppercase"). Only recognized
            // classes become a btsSpan mark; other spans (site-injected styling
            // wrappers like the hero word-reveal spans) stay transparent.
            const btsClass = [...child.classList].find((c) => spanClasses.includes(c));

            if (btsClass) {
              childMarks = [...marks, { type: 'btsSpan', attrs: { class: btsClass } }];
            }
          }
        }

        walk(child, childMarks);
      }
    }
  };

  walk(root, []);

  // Whitespace belongs between words, not inside a style.
  //
  // Dragging a selection across a word takes the spaces on either side of it far
  // more often than not, and colouring that selection puts them inside the mark:
  // `Indtast<span> din </span>overskrift` rather than `Indtast <span>din</span>
  // overskrift`. Both read the same on the page the moment it is made, so the
  // mistake is invisible — but the boundary is now whitespace, and every later
  // pass over it (a re-render, a font-tag change, the next inline edit) trims and
  // re-merges those edges, until the gap sits on the wrong side of the span or
  // stops existing. It shows up as words running into a coloured word, and only
  // for text somebody has styled.
  //
  // Pushed back out, the same words always produce the same nodes, and there is
  // no edge left for a later pass to move.
  const spaced = [];

  for (const node of out) {
    if (node.type !== 'text' || !node.marks?.length) {
      spaced.push(node);

      continue;
    }

    const lead = /^\s+/.exec(node.text)?.[0] || '';
    const core = node.text.slice(lead.length).replace(/\s+$/, '');
    const trail = node.text.slice(lead.length + core.length);

    // A marked run of nothing but spaces is spacing, not styling.
    if (!core) {
      spaced.push({ type: 'text', text: node.text });

      continue;
    }

    if (lead) {
      spaced.push({ type: 'text', text: lead });
    }

    spaced.push({ ...node, text: core });

    if (trail) {
      spaced.push({ type: 'text', text: trail });
    }
  }

  // The split can leave neighbours that belong together (an unmarked tail beside
  // the unmarked text that followed it) — same merge `pushText` does on the way in.
  out.length = 0;

  for (const node of spaced) {
    const last = out[out.length - 1];

    if (node.type === 'text' && last?.type === 'text' && sameMarks(last.marks, node.marks || [])) {
      last.text += node.text;

      continue;
    }

    out.push(node);
  }

  // Trim block edges and collapse duplicate spaces across node boundaries.
  for (let i = 0; i < out.length; i++) {
    const node = out[i];

    if (node.type !== 'text') {
      continue;
    }

    if (i === 0) {
      node.text = node.text.replace(/^\s+/, '');
    }

    if (i === out.length - 1) {
      node.text = node.text.replace(/\s+$/, '');
    }

    const prev = out[i - 1];

    if (prev && prev.type === 'text' && prev.text.endsWith(' ') && node.text.startsWith(' ')) {
      node.text = node.text.replace(/^ +/, '');
    }
  }

  return out.filter((n) => n.type !== 'text' || n.text !== '');
}

/** innerText → stored string: nbsp → space, strip the trailing newline(s). */
export function cleanEditedText(text) {
  return (text || '').replace(/\u00a0/g, ' ').replace(/\n+$/, '');
}

export function handleEditRequest(data, doc, win) {
  const reply = (message) =>
    sendToPreview({ source: 'statamic-visual-editor', requestId: data.requestId, ...message }, win);

  const req = {
    blockText: data.blockText != null ? normText(data.blockText) : null,
    wrapperText: normText(data.wrapperText || ''),
  };

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let basePath = '';

    if (data.scope) {
      basePath = findPathByUid(values, data.scope);

      if (basePath === null) {
        continue; // scope lives in another container
      }
    }

    let path = [basePath, data.field].filter(Boolean).join('.');
    let value = dataGet(values, path);

    // Scope cascaded to a parent row (common on synced sections whose nested
    // block ids were stripped): find the deepest row under basePath that owns
    // this field handle and use that path instead.
    if (value === undefined && data.field && basePath !== null && basePath !== '') {
      const deepPath = sve.deepestFieldPath(dataGet(values, basePath), data.field, basePath);

      if (deepPath) {
        path = deepPath;
        value = dataGet(values, path);
      }
    }

    if (value === undefined) {
      // A new row often has no key yet (`title` missing, not `title: ''`).
      // Treat that as empty so inline edit can start, instead of denying.
      if (basePath && data.field) {
        const row = dataGet(values, basePath);

        if (row && typeof row === 'object' && !Array.isArray(row)) {
          value = data.fieldtype === 'bard' ? [] : '';
        }
      }

      if (value === undefined) {
        continue;
      }
    }

    // Inline Bard (headline): upgrade legacy strings / unwrapped text nodes to
    // a single paragraph so whole-field edit + colour toolbar work like richtext.
    if (
      data.bardInline &&
      (typeof value === 'string' || isUnwrappedInlineBard(value)) &&
      normText(typeof value === 'string' ? value : bardNodeText({ type: 'doc', content: value })) ===
        req.wrapperText
    ) {
      value = normalizeInlineBardValue(value);
      container.setFieldValue(path, value);
    }

    // Empty Bard: nothing stored yet. `as="h3"` / the wrapper tag says what
    // the first block should be, so a title can start as a heading rather than
    // a paragraph — the same choice BlockStudio's RichText/InnerBlocks make.
    const emptyBard =
      data.fieldtype === 'bard' &&
      (value === '' ||
        value == null ||
        (Array.isArray(value) && value.length === 0));

    if (emptyBard) {
      editSession = {
        container,
        requestId: data.requestId,
        mode: 'bard-field',
        path,
        field: data.field,
        scope: data.scope,
        original: [],
      };
      reply({
        type: 'edit-start',
        mode: 'bard-field',
        target: 'wrapper',
        controls: controlValues(values, path, data.controls),
        nodes: [],
      });

      return;
    }

    // Empty text (or any non-Bard scalar): start a string edit even when the
    // preview has only ghost placeholder text, so wrapperText is '' and would
    // otherwise fail the "rendered text matches stored value" check.
    if (data.fieldtype !== 'bard' && (value === '' || value == null) && !Array.isArray(value)) {
      editSession = {
        container,
        requestId: data.requestId,
        mode: 'string',
        path,
        field: data.field,
        scope: data.scope,
        original: '',
      };
      reply({
        type: 'edit-start',
        mode: 'string',
        target: 'wrapper',
        hasLink: false,
        controls: controlValues(values, path, data.controls),
      });

      return;
    }

    // Whole-field Bard editing: one toolbar for the entire field, caret moves
    // freely between blocks, Enter splits blocks. Allowed when every node is
    // either an editable text block (heading/paragraph) or a Bard set — sets
    // render as locked siblings in the preview and are preserved on save.
    // Other node types (lists, images, …) still fall back to per-block editing.
    if (
      Array.isArray(value) &&
      value.length &&
      value.every(
        (node) =>
          node && (EDITABLE_NODE_TYPES.includes(node.type) || node.type === 'set')
      ) &&
      value.some((node) => EDITABLE_NODE_TYPES.includes(node.type))
    ) {
      editSession = {
        container,
        requestId: data.requestId,
        mode: 'bard-field',
        path,
        field: data.field,
        scope: data.scope,
        original: JSON.parse(JSON.stringify(value)),
      };
      reply({
        type: 'edit-start',
        mode: 'bard-field',
        target: 'wrapper',
        controls: controlValues(values, path, data.controls),
        // Only text nodes — sets map onto locked DOM siblings automatically.
        nodes: value
          .filter((node) => EDITABLE_NODE_TYPES.includes(node.type))
          .map((node) => ({
            type: node.type,
            level: node.attrs?.level ?? null,
            className: node.attrs?.class ?? null,
            text: normText(bardNodeText(node)),
          })),
      });

      return;
    }

    // Fast path: Bard field where the clicked block's index maps directly to
    // the ProseMirror node AND the rendered text matches the stored one.
    if (Array.isArray(value) && data.blockIndex != null && req.blockText !== null) {
      const node = value[data.blockIndex];

      if (
        node &&
        EDITABLE_NODE_TYPES.includes(node.type) &&
        normText(bardNodeText(node)) === req.blockText
      ) {
        editSession = {
          container,
          requestId: data.requestId,
          mode: 'bard',
          path,
          index: data.blockIndex,
          field: data.field,
          scope: data.scope,
          original: JSON.parse(JSON.stringify(value)),
        };
        reply({
          type: 'edit-start',
          mode: 'bard',
          target: 'block',
          controls: controlValues(values, path, data.controls),
        });

        return;
      }
    }

    const candidates = resolveEditTargets(value, path, req);

    if (candidates.length !== 1) {
      reply({ type: 'edit-deny', reason: candidates.length ? 'ambiguous' : 'no-match' });

      return;
    }

    const target = candidates[0];

    if (target.mode === 'string') {
      // Rows that pair a text with a link (button rows: { text, url }) get a
      // link-edit shortcut in the preview toolbar.
      const rowPath = target.path.includes('.')
        ? target.path.slice(0, target.path.lastIndexOf('.'))
        : '';
      const row = rowPath ? dataGet(values, rowPath) : null;
      const linkPath =
        row && typeof row === 'object' && typeof row.url === 'string' ? `${rowPath}.url` : null;

      editSession = {
        container,
        requestId: data.requestId,
        mode: 'string',
        path: target.path,
        linkPath,
        field: data.field,
        scope: data.scope,
        original: dataGet(values, target.path),
      };
      reply({
        type: 'edit-start',
        mode: 'string',
        target: target.path === path ? 'wrapper' : 'block',
        hasLink: !!linkPath,
        controls: controlValues(values, target.path, data.controls),
      });
    } else {
      editSession = {
        container,
        requestId: data.requestId,
        mode: 'bard',
        path: target.path,
        index: target.index,
        field: data.field,
        scope: data.scope,
        original: JSON.parse(JSON.stringify(dataGet(values, target.path))),
      };
      reply({
        type: 'edit-start',
        mode: 'bard',
        target: 'block',
        controls: controlValues(values, target.path, data.controls),
      });
    }

    return;
  }

  // Panel is open but hasn't streamed values yet — keep the preview's pending
  // edit alive and retry as soon as the form hydrates.
  if (queueEditUntilPanelReady(data, doc, win)) {
    reply({ type: 'edit-pending' });

    return;
  }

  reply({ type: 'edit-deny', reason: 'not-found' });
}

/**
 * Inline edit on a focused global section needs the side panel's values. The
 * iframe can take a beat to hydrate — hold the request and retry once it does,
 * instead of denying and making the click feel dead.
 */
export function queueEditUntilPanelReady(data, doc, win) {
  if (!sve.globalSectionEditorOpen(doc) || sveState.sectionPanelValues?.values) {
    return false;
  }

  sveState.pendingEditUntilPanel = { data, doc, win };

  return true;
}

export function flushPendingEditUntilPanel() {
  if (!sveState.pendingEditUntilPanel || !sveState.sectionPanelValues?.values) {
    return;
  }

  const { data, doc, win } = sveState.pendingEditUntilPanel;

  sveState.pendingEditUntilPanel = null;
  handleEditRequest(data, doc, win);
}

/**
 * A quick control in the preview toolbar changed (controls="font_tag|size"):
 * write the sibling field on the row being edited. The value poll streams the
 * re-render back out, so the block redraws with its new setting.
 */
export function handleEditControl(data) {
  if (!editSession || editSession.requestId !== data.requestId) {
    return;
  }

  if (typeof data.handle !== 'string' || !data.handle) {
    return;
  }

  const row = rowPathOf(editSession.path);

  editSession.container.setFieldValue(row ? `${row}.${data.handle}` : data.handle, data.value);
}

export let themeSwatchesPromise = null;

/**
 * Preview asked for theme colour swatches (highlight colour control). Fetch from
 * the colour-scheme CP route and reply — cached for the CP page lifetime.
 */
export function handleThemeSwatchesRequest(data, win) {
  const reply = (swatches) =>
    sendToPreview(
      {
        source: 'statamic-visual-editor',
        type: 'theme-swatches',
        requestId: data.requestId,
        swatches,
      },
      win
    );

  if (!themeSwatchesPromise) {
    const cpUrl =
      win.Statamic?.$config?.get?.('cpUrl') ||
      `/${win.Statamic?.$config?.get?.('cpRoute') || 'cp'}`;

    themeSwatchesPromise = win
      .fetch(`${cpUrl}/color-scheme/swatches`, {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then(async (res) => {
        if (!res.ok) {
          return [];
        }

        const json = await res.json().catch(() => []);

        return Array.isArray(json) ? json : [];
      })
      .catch(() => []);
  }

  themeSwatchesPromise.then(reply);
}

export function handleEditInput(data, doc) {
  if (!editSession || editSession.requestId !== data.requestId) {
    return;
  }

  const { container } = editSession;

  if (editSession.mode === 'string') {
    container.setFieldValue(editSession.path, cleanEditedText(data.text));

    return;
  }

  // Whole-field Bard: rebuild the node array from the serialized blocks,
  // preserving locked set nodes (kind: 'locked') at their DOM positions.
  if (editSession.mode === 'bard-field') {
    const values = unwrapRef(container.values);
    const current = dataGet(values, editSession.path);
    const original = Array.isArray(editSession.original) ? editSession.original : [];
    const spanClasses =
      Array.isArray(data.spanClasses) && data.spanClasses.length ? data.spanClasses : BTS_SPAN_CLASSES;

    let textMergeIndex = 0;
    const next = [];

    const buildTextNode = (block) => {
      const type = block.kind === 'heading' ? 'heading' : 'paragraph';
      const pool = Array.isArray(current) ? current : original;
      let orig = null;

      for (let i = textMergeIndex; i < pool.length; i++) {
        if (pool[i]?.type === type) {
          orig = pool[i];
          textMergeIndex = i + 1;
          break;
        }
      }

      const attrs = { ...(orig?.attrs || {}) };
      const node = { type };

      if (type === 'heading') {
        attrs.level = block.level || 2;
      }

      if (block.vizuClass) {
        attrs.vizuClass = block.vizuClass;
      } else {
        delete attrs.vizuClass;
      }

      if (block.vizuBlockStyle) {
        attrs.vizuBlockStyle = block.vizuBlockStyle;
      } else {
        delete attrs.vizuBlockStyle;
      }

      if (block.className && !block.vizuClass) {
        attrs.class = block.className;
      } else {
        delete attrs.class;
      }

      if (Object.keys(attrs).length) {
        node.attrs = attrs;
      }

      const content = parseInlineHtml(block.html || '', doc, spanClasses);

      if (content.length) {
        node.content = content;
      }

      return node;
    };

    for (const block of data.blocks || []) {
      if (block.kind === 'locked') {
        const orig = findPreservedBardNode(original, block.visualId);

        if (orig) {
          next.push(JSON.parse(JSON.stringify(orig)));
        }

        continue;
      }

      if (block.kind === 'vizuDiv') {
        next.push({
          type: 'vizuDiv',
          attrs: { class: block.className || null },
          content: (block.children || []).map((child) => buildTextNode(child)),
        });

        continue;
      }

      next.push(buildTextNode(block));
    }

    writeBardFieldValue(container, editSession.path, next, doc, editSession);

    return;
  }

  // Bard: swap the edited node's inline content inside a fresh copy of the
  // current field value (other nodes/sets stay untouched).
  const values = unwrapRef(container.values);
  const current = dataGet(values, editSession.path);

  if (!Array.isArray(current)) {
    return;
  }

  const next = JSON.parse(JSON.stringify(current));
  const node = next[editSession.index];

  if (!node) {
    return;
  }

  const content = parseInlineHtml(
    data.html,
    doc,
    Array.isArray(data.spanClasses) && data.spanClasses.length ? data.spanClasses : BTS_SPAN_CLASSES
  );

  if (content.length) {
    node.content = content;
  } else {
    delete node.content;
  }

  writeBardFieldValue(container, editSession.path, next, doc, editSession);
}

export function handleEditEnd(data, win = window) {
  if (!editSession || editSession.requestId !== data.requestId) {
    return;
  }

  if (data.cancelled) {
    editSession.container.setFieldValue(editSession.path, editSession.original);
  }

  editSession = null;

  // A global section's stash may have been written several times while this
  // edit was open, with the re-render held back each time so the caret survived.
  // Now that the page is nobody's text field again, let it catch up.
  sve.flushPendingSectionRefresh(win);
}

// command → CP Bard toolbar button title matcher. Core Statamic titles are
// English even in a translated CP; addon buttons (colour) are localized.
export const BARD_CMD_TITLE = {
  link: /link|anker|anchor/i,
  color: /farve|colou?r/i,
  unorderedlist: /unordered list|bullet|punkt/i,
  orderedlist: /ordered list|number|nummer/i,
  quote: /blockquote|quote|citat/i,
  code: /^code$/i,
  codeblock: /code block|kodeblok/i,
  table: /table|tabel/i,
};

/** Builds a DOM Range spanning [from,to] character offsets within blockEl. */
export function domRangeForOffsets(blockEl, from, to) {
  const walker = blockEl.ownerDocument.createTreeWalker(blockEl, NodeFilter.SHOW_TEXT);
  let count = 0;
  let startNode = null;
  let startOff = 0;
  let endNode = null;
  let endOff = 0;
  let node;

  while ((node = walker.nextNode())) {
    const len = node.nodeValue.length;

    if (startNode === null && from <= count + len) {
      startNode = node;
      startOff = from - count;
    }

    if (to <= count + len) {
      endNode = node;
      endOff = to - count;
      break;
    }

    count += len;
  }

  if (!startNode) {
    return null;
  }

  if (!endNode) {
    endNode = startNode;
    endOff = startNode.nodeValue.length;
  }

  const range = blockEl.ownerDocument.createRange();

  range.setStart(startNode, startOff);
  range.setEnd(endNode, endOff);

  return range;
}

/**
 * Link/colour/list/quote from the preview toolbar: open the editor panel,
 * select the same character range in the real CP Bard editor, and click its
 * native toolbar button — so Statamic's own popup (link dialog, colour palette)
 * appears, exactly as the user knows it from the panel. Runs after the inline
 * edit has committed; captures field/scope/index synchronously because the CP
 * edit session is torn down by the accompanying edit-end.
 */
export function handleBardCommand(data, doc, win) {
  if (!editSession || editSession.requestId !== data.requestId) {
    return;
  }

  const titleRe = BARD_CMD_TITLE[data.command];

  if (!titleRe) {
    return;
  }

  const { field, scope } = editSession;
  // Whole-field sessions carry the selection's block index in the message; the
  // per-block session stored it at edit-start.
  const index = Number.isInteger(data.blockIndex) ? data.blockIndex : editSession.index;
  // link/colour open a Statamic popup; the rest (lists, quote, …) apply in place.
  const opensPopup = data.command === 'link' || data.command === 'color';

  // Link: open Bard's own Stack (same as the sidebar). Colour still moves
  // its palette over the preview.

  let attempts = 0;

  const run = () => {
    const setEl = scope ? findSetByUid(scope, doc) : null;

    if (setEl) {
      [...collectAncestorSets(setEl), setEl].forEach(expandSet);
    }

    const fieldEl = findFieldElement(field, doc, scope);
    // The field id sits on the content wrapper; the toolbar lives on the
    // enclosing .bard-fieldtype. Search from there for both toolbar and editor.
    const bardEl =
      fieldEl?.closest('.bard-fieldtype') || fieldEl?.querySelector('.bard-fieldtype') || fieldEl;
    const ce = bardEl?.querySelector('.ProseMirror') || bardEl?.querySelector('[contenteditable="true"]');

    if (!ce) {
      if (++attempts < 12) {
        setTimeout(run, 250);
      }

      return;
    }

    const block = ce.children[index];

    if (block && data.to > data.from) {
      const range = domRangeForOffsets(block, data.from, data.to);

      if (range) {
        ce.focus();
        const sel = win.getSelection();

        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else {
      ce.focus();
    }

    // Let ProseMirror sync the DOM selection into its state before the button
    // command reads editor.state.selection.
    setTimeout(() => {
      const opened =
        data.command === 'link'
          ? openBardLinkToolbar(bardEl)
          : clickBardToolbarButton(bardEl, titleRe, doc);

      if (!opened && ++attempts < 12) {
        setTimeout(run, 250);

        return;
      }

      if (data.command === 'link') {
        revealBardLinkStack(doc, win);
      } else if (opensPopup) {
        repositionBardPopup(data.command, data.anchorRect, doc, win);
      }
    }, 70);
  };

  setTimeout(run, 120);
}

/**
 * Opens Bard's own Link Stack — the same `open-link-toolbar` event as Mod-K
 * / the sidebar button. Search stays inside this Bard field so we never
 * click some other "Link" button on the page.
 */
export function openBardLinkToolbar(bardEl) {
  if (!bardEl) {
    return false;
  }

  const bus = findBardVueProxy(bardEl)?.events;

  if (typeof bus?.emit === 'function') {
    bus.emit('open-link-toolbar');

    return true;
  }

  if (typeof bus?.$emit === 'function') {
    bus.$emit('open-link-toolbar');

    return true;
  }

  return clickBardToolbarButton(bardEl, BARD_CMD_TITLE.link, bardEl);
}

export function clickBardToolbarButton(bardEl, titleRe, doc) {
  const btn = findBardToolbarButton(bardEl, titleRe, doc);

  if (!btn) {
    return false;
  }

  btn.click();

  return true;
}

export function findBardToolbarButton(bardEl, titleRe, doc) {
  const roots = [
    bardEl?.querySelector('.bard-fixed-toolbar'),
    bardEl?.querySelector('.bard-floating-toolbar'),
    bardEl,
    doc,
  ].filter(Boolean);

  const seen = new Set();

  for (const root of roots) {
    for (const b of root.querySelectorAll('button')) {
      if (seen.has(b)) {
        continue;
      }

      seen.add(b);

      const label = b.getAttribute('title') || b.getAttribute('aria-label') || b.textContent || '';

      if (titleRe.test(label.trim())) {
        return b;
      }
    }
  }

  return null;
}

const LINK_STACK_RE = /apply link|anvend link|update link|opdater link|indsæt link|https:\/\//i;

/**
 * Finds the Statamic popup that a bard command just opened (link dialog or
 * colour palette) by a distinctive bit of its content, then climbs to the
 * floating (positioned) container.
 */
export function findBardPopupEl(command, doc) {
  if (command === 'link') {
    const stack = [...doc.querySelectorAll('.stack-content')].find((el) => {
      if (LINK_STACK_RE.test(el.textContent || '')) {
        return true;
      }

      if (el.querySelector('input[placeholder*="http" i]')) {
        return true;
      }

      const heading = el.querySelector('h1, h2, h3, [class*="stack-header"]');

      return heading && /^link$/i.test(heading.textContent.trim());
    });

    if (stack) {
      return stack;
    }
  }

  let anchorNode = null;

  if (command === 'color') {
    anchorNode = [...doc.querySelectorAll('*')].find(
      (e) => e.children.length === 0 && /ingen farve|no colou?r/i.test(e.textContent || '')
    );
  } else if (command === 'link') {
    anchorNode =
      doc.querySelector('input[placeholder="https://"], input[placeholder*="http" i]') ||
      [...doc.querySelectorAll('button, label, span, div, h1, h2, h3')].find(
        (e) =>
          e.children.length === 0 &&
          /apply link|anvend link|update link|opdater link|indsæt link/i.test(e.textContent || '')
      );
  }

  if (!anchorNode) {
    return null;
  }

  const stack = anchorNode.closest('.stack-content');

  if (stack) {
    return stack;
  }

  let el = anchorNode;

  for (let i = 0; el && i < 12; i++) {
    const cs = doc.defaultView.getComputedStyle(el);
    const w = el.getBoundingClientRect().width;

    // A popover/palette is a small positioned box; skip full-screen overlays.
    if ((cs.position === 'fixed' || cs.position === 'absolute') && w > 120 && w < 640) {
      return el;
    }

    el = el.parentElement;
  }

  return anchorNode.closest('[data-popper-placement]') || anchorNode.parentElement;
}

/**
 * Keep Statamic's Link Stack in front of the preview iframe. Do not rebuild
 * it — only raise the portal and call the Stack's own close() on Escape /
 * click outside, the same two exits the sidebar uses.
 */
export function revealBardLinkStack(doc, win) {
  let tries = 0;

  const run = () => {
    const stack = findBardPopupEl('link', doc);

    if (!stack) {
      if (++tries < 25) {
        setTimeout(run, 100);
      }

      return;
    }

    const host =
      stack.closest('[id^="portal-target-"]') || stack.closest('.vue-portal-target') || stack;
    const rect = stack.getBoundingClientRect();
    const offScreen = rect.right < 8 || rect.left > win.innerWidth - 8 || rect.width < 80;

    if (offScreen && host.parentElement !== doc.body) {
      doc.body.appendChild(host);
    }

    host.style.setProperty('z-index', '2147483000', 'important');

    const overlay = host.querySelector('.stack-overlay');

    if (overlay) {
      overlay.style.removeProperty('z-index');
    }

    const url = stack.querySelector('input[placeholder*="http" i], input[type="url"], input[type="text"]');

    url?.focus();

    bindNativeStackDismiss(doc, win, stack, host);
  };

  setTimeout(run, 60);
}

function stackCloser(from) {
  let vn = from?.__vueParentComponent;

  for (let i = 0; vn && i < 40; i++) {
    const exposed = vn.exposed || vn.proxy;

    if (typeof exposed?.close === 'function' && typeof exposed?.open === 'function') {
      return () => exposed.close();
    }

    vn = vn.parent;
  }

  return null;
}

function bindNativeStackDismiss(doc, win, stack, host) {
  const closer = stackCloser(stack) || stackCloser(host);

  if (!closer) {
    return;
  }

  const onKey = (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    event.preventDefault();
    closer();
    cleanup();
  };

  const onPointer = (event) => {
    if (stack.contains(event.target)) {
      return;
    }

    const overlay = host.querySelector('.stack-overlay');

    if (!overlay || !overlay.contains(event.target)) {
      return;
    }

    closer();
    cleanup();
  };

  const cleanup = () => {
    win.removeEventListener('keydown', onKey, true);
    doc.removeEventListener('pointerdown', onPointer, true);
  };

  win.addEventListener('keydown', onKey, true);
  doc.addEventListener('pointerdown', onPointer, true);
}

/**
 * Pins the popup over the preview at the anchor sent by the bridge, keeping the
 * editor panel hidden. Uses !important so Statamic's floating-ui inline styles
 * (written without priority) can't drag it back to the off-screen button.
 */
export function repositionBardPopup(command, anchorRect, doc, win) {
  const iframe = doc.getElementById('live-preview-iframe');

  if (!iframe || !anchorRect) {
    return;
  }

  const ir = iframe.getBoundingClientRect();
  const targetLeft = ir.left + (anchorRect.left || 0);
  const targetTop = ir.top + (anchorRect.bottom || 0) + 8;

  const place = (popup) => {
    const w = popup.offsetWidth || 320;
    const left = Math.max(8, Math.min(targetLeft, win.innerWidth - w - 8));
    const top = Math.max(8, targetTop);

    popup.style.setProperty('position', 'fixed', 'important');
    popup.style.setProperty('left', `${left}px`, 'important');
    popup.style.setProperty('top', `${top}px`, 'important');
    popup.style.setProperty('right', 'auto', 'important');
    popup.style.setProperty('bottom', 'auto', 'important');
    popup.style.setProperty('transform', 'none', 'important');
    popup.style.setProperty('margin', '0', 'important');
    popup.style.setProperty('z-index', '2147483000', 'important');
    // Statamic's link editor renders as a full-height stack card — hug its
    // content so it looks like a popover floating over the preview.
    popup.style.setProperty('height', 'auto', 'important');
    popup.style.setProperty('max-height', '85vh', 'important');
    popup.style.setProperty('overflow', 'auto', 'important');
    popup.style.setProperty('border-radius', '12px', 'important');
    popup.style.setProperty('box-shadow', '0 12px 44px rgba(0,0,0,0.28)', 'important');
  };

  let tries = 0;

  const findAndPlace = () => {
    const popup = findBardPopupEl(command, doc);

    if (!popup) {
      if (++tries < 25) {
        setTimeout(findAndPlace, 100);
      }

      return;
    }

    // Re-assert a few times to win against floating-ui's on-open positioning.
    place(popup);
    setTimeout(() => place(popup), 130);
    setTimeout(() => place(popup), 320);
  };

  setTimeout(findAndPlace, 60);
}

/**
 * Toolbar tools the preview can't perform in place (lists, quote, color) send
 * this: open the editor panel and focus the Bard field so the user finishes
 * with the field's real toolbar. Runs after the inline edit has committed.
 */
export function handleOpenPanelField(data, doc, win) {
  if (!editSession || editSession.requestId !== data.requestId || !editSession.field) {
    return;
  }

  const { field, scope } = editSession;

  sve.setLpCollapsed(win, false);
  setTimeout(() => handleFieldFocus(field, doc, { scopeUid: scope }), 100);
}

/**
 * Changes the edited Bard node's block type/attrs (heading level, or paragraph
 * with an optional bard-texstyle class). Only touches type/attrs — the node's
 * inline content is preserved and updated separately via handleEditInput.
 */
export function handleBlockFormat(data, doc = document) {
  if (!editSession || editSession.requestId !== data.requestId || editSession.mode !== 'bard') {
    return;
  }

  const { container } = editSession;
  const values = unwrapRef(container.values);
  const current = dataGet(values, editSession.path);

  if (!Array.isArray(current)) {
    return;
  }

  const next = JSON.parse(JSON.stringify(current));
  const node = next[editSession.index];

  if (!node) {
    return;
  }

  if (data.node === 'heading') {
    node.type = 'heading';
    node.attrs = { ...(node.attrs || {}), level: data.level };
    delete node.attrs.class;
  } else {
    node.type = 'paragraph';
    node.attrs = { ...(node.attrs || {}), class: data.className ?? null };
    delete node.attrs.level;
  }

  writeBardFieldValue(container, editSession.path, next, doc, editSession);
}

/**
 * Opens the asset browser for the clicked image field: locates the CP field
 * wrapper (retrying while the containing set expands — the accompanying click
 * message triggers that expansion) and clicks its Browse button. Statamic's
 * asset selector portals to the body, so it shows even while the editor panel
 * is collapsed off-screen.
 */
export function handleAssetEdit(data, doc) {
  let attempts = 0;

  const tryOpen = () => {
    const setEl = data.scope ? findSetByUid(data.scope, doc) : null;

    // Collapsed sets don't render their field wrappers — expand the scoped set
    // (and its ancestors) so the assets field mounts, then retry below.
    if (setEl) {
      [...collectAncestorSets(setEl), setEl].forEach(expandSet);
    }

    // Assets fields don't always render a field_{path} wrapper id (observed in
    // replicator sets) — fall back to the fieldtype root inside the scoped set.
    const fieldEl =
      findFieldElement(data.field, doc, data.scope) ||
      (setEl ? setEl.querySelector('.assets-fieldtype') : null) ||
      (data.scope ? null : doc.querySelector('.assets-fieldtype'));

    const browse = fieldEl
      ? [...fieldEl.querySelectorAll('button, [role="button"]')].find((b) =>
          /browse|gennemse/i.test(b.textContent)
        )
      : null;

    if (browse) {
      browse.click();

      return;
    }

    if (++attempts < 8) {
      setTimeout(tryOpen, 250);
    }
  };

  tryOpen();
}

/**
 * Opens Iconify's own Stack ("Search and select an icon") from preview
 * Change/Browse — the same panel as the sidebar. Raise it above the live
 * preview so it is not hidden behind the iframe.
 */
export function handleIconEdit(data, doc, win = window) {
  if (data.action === 'remove') {
    writeIconField(data, doc, null);

    return;
  }

  let attempts = 0;

  const tryOpen = () => {
    const setEl = data.scope ? findSetByUid(data.scope, doc) : null;

    if (setEl) {
      [...collectAncestorSets(setEl), setEl].forEach(expandSet);
    }

    const fieldEl =
      findFieldElement(data.field, doc, data.scope) ||
      (setEl ? setEl.querySelector('.iconify-fieldtype') : null) ||
      (data.scope ? null : doc.querySelector('.iconify-fieldtype'));

    if (openIconifyFromField(fieldEl, doc)) {
      return;
    }

    if (attempts === 2) {
      sve.setLpCollapsed(win, false);
      handleFieldFocus(data.field, doc, { animate: false, scopeUid: data.scope });
    }

    if (++attempts < 12) {
      setTimeout(tryOpen, 180);
    }
  };

  tryOpen();
}

export function openIconifyFromField(fieldEl, doc) {
  if (!fieldEl) {
    return false;
  }

  const root = fieldEl.querySelector('.iconify-fieldtype') || fieldEl;
  const opener = [fieldEl, root, ...root.querySelectorAll('*')].find(
    (el) => typeof el.__sveOpenIconify === 'function'
  )?.__sveOpenIconify;
  return (opener && opener()) || openIconifyStack(root) || clickBrowseIconify(root);
}

export function clickBrowseIconify(root) {
  const browse = [...root.querySelectorAll('button, [role="button"]')].find((b) =>
    /browse iconify/i.test(b.textContent || '')
  );

  if (!browse) {
    return false;
  }

  browse.click();

  return true;
}

export function openIconifyStackFromInstance(inst) {
  return openStackInTree(inst?.subTree, 0) || openStackInTree(inst?.vnode, 0);
}

/**
 * Iconify's Stack exposes open(); v-model:open also has onUpdate:open.
 * Title is never minified.
 */
export function openStackInTree(vnode, depth) {
  if (!vnode || typeof vnode !== 'object' || depth > 36) {
    return false;
  }

  const props = vnode.props || vnode.component?.props;
  const isIconStack = /search and select an icon/i.test(String(props?.title || ''));
  const exposed = vnode.component?.exposed || vnode.component?.proxy;

  if (isIconStack) {
    let called = false;

    if (typeof exposed?.open === 'function') {
      exposed.open();
      called = true;
    }

    const update = props['onUpdate:open'] || props.onUpdateOpen;
    const list = Array.isArray(update) ? update : [update];

    for (const fn of list) {
      if (typeof fn === 'function') {
        fn(true);
        called = true;
      }
    }

    if (called) {
      return true;
    }
  }

  if (vnode.component?.subTree && openStackInTree(vnode.component.subTree, depth + 1)) {
    return true;
  }

  const kids = [
    ...(Array.isArray(vnode.children) ? vnode.children : []),
    ...(Array.isArray(vnode.dynamicChildren) ? vnode.dynamicChildren : []),
  ];

  for (const child of kids) {
    if (openStackInTree(child, depth + 1)) {
      return true;
    }

    if (Array.isArray(child)) {
      for (const nested of child) {
        if (openStackInTree(nested, depth + 1)) {
          return true;
        }
      }
    }
  }

  return false;
}

export function openIconifyStack(fieldEl) {
  const root = fieldEl.querySelector('.iconify-fieldtype') || fieldEl;
  const seen = new Set();

  const fromComponent = (component) => {
    if (!component || seen.has(component)) {
      return false;
    }

    seen.add(component);

    return openStackInTree(component.subTree, 0) || openStackInTree(component.vnode, 0);
  };

  for (const el of [root, ...root.querySelectorAll('*')]) {
    if (fromComponent(el.__vueParentComponent)) {
      return true;
    }
  }

  return false;
}

export function resolveIconField(data, doc) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let basePath = '';

    if (data.scope) {
      basePath = findPathByUid(values, data.scope);

      if (basePath === null) {
        continue;
      }
    }

    let path = [basePath, data.field].filter(Boolean).join('.');
    let value = dataGet(values, path);

    if (value === undefined && data.field && basePath !== '') {
      const deepPath = sve.deepestFieldPath(dataGet(values, basePath), data.field, basePath);

      if (deepPath) {
        path = deepPath;
        value = dataGet(values, path);
      }
    }

    if (value === undefined && !basePath) {
      continue;
    }

    return { container, path, value };
  }

  return null;
}

export function writeIconField(data, doc, value) {
  const found = resolveIconField(data, doc);

  if (found) {
    found.container.setFieldValue(found.path, value);
  }
}

/**
 * Link-edit shortcut from the preview toolbar: opens the editor panel and
 * focuses the row's url/link field so the user can change the URL or pick
 * another entry with Statamic's own link fieldtype UI.
 */
export function handleLinkEdit(data, doc, win) {
  if (!editSession || editSession.requestId !== data.requestId || !editSession.linkPath) {
    return;
  }

  const { linkPath, scope } = editSession;

  sve.setLpCollapsed(win, false);

  setTimeout(() => {
    // Preferred: the url field's own wrapper (stacked grids render one).
    let target = findFieldElement(linkPath, doc);

    // Table-mode grid cells carry no field wrapper id — locate the row via its
    // _visual_id and use the link fieldtype cell (or the row itself).
    if (!target && scope) {
      const rowEl = findSetByUid(scope, doc);

      if (rowEl) {
        target = rowEl.querySelector('.link-fieldtype') || rowEl;
      }
    }

    if (!target) {
      return;
    }

    doc.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((el) => el.removeAttribute(ACTIVE_ATTR));
    target.setAttribute(ACTIVE_ATTR, '');
    switchToContainingTab(target, doc);
    collectAncestorSets(target).forEach(expandSet);

    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('sve-field-highlight');
      setTimeout(() => target.classList.remove('sve-field-highlight'), 2000);
    }, COLLAPSE_SETTLE_MS);
  }, 100);
}

/**
 * Moves the set identified by uid one position up/down within its containing
 * array (page sections, replicator rows, …). Works generically: the uid is
 * resolved to a value path like "page_sections.2", and the two array items are
 * swapped via setFieldValue — dirty state, replicator re-render and the live
 * preview update all follow from Statamic's own reactivity.
 */
/**
 * Reorders the array item carrying data.uid. Two callers: the hover arrows send
 * a relative `direction` (±1); drag & drop sends an absolute `toIndex`.
 */
export function handleMove(data, doc) {
  if (rowIsLocked(data.uid, doc)) {
    return;
  }

  const direction = data.direction < 0 ? -1 : 1;

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = sve.rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows: arr } = found;

    const to = Number.isInteger(data.toIndex)
      ? Math.max(0, Math.min(arr.length - 1, data.toIndex))
      : index + direction;

    if (to === index || to < 0 || to >= arr.length) {
      return; // no movement (or already first/last)
    }

    const next = JSON.parse(JSON.stringify(arr));
    const [item] = next.splice(index, 1);

    next.splice(to, 0, item);
    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * Visual column resize: writes the col_w_* span classes the preview's width
 * drag produced. `changes` come in pairs (both columns at a boundary), and the
 * paths are looked up per uid — width writes never shift array indexes, so one
 * values snapshot serves both lookups.
 */
export function handleColumnWidth(data, doc) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let applied = false;

    for (const change of data.changes ?? []) {
      if (typeof change?.field !== 'string' || !/^col_w_[mtd]$/.test(change.field)) {
        continue;
      }

      const path = findPathByUid(values, change.uid);

      if (path === null) {
        continue;
      }

      container.setFieldValue(`${path}.${change.field}`, change.value);
      applied = true;
    }

    if (applied) {
      return;
    }
  }
}

/**
 * A stored width, read the same way whichever of its two shapes it has.
 *
 * A plain number is a width with no opinion about where it sits — how every
 * value written before starting columns existed still looks, and how one is
 * still written when nobody has said where the block begins. An object carries
 * both. Null is "no opinion at all".
 */
export function placementOf(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const source = typeof value === 'object' ? value : { span: value };
  const span = Number(source.span ?? source.value);

  if (!Number.isFinite(span) || span < 1) {
    return null;
  }

  const start = Number(source.start);

  return { span, start: Number.isFinite(start) && start > 0 ? start : null };
}

/** Same placement, or not — both numbers have to agree, including "no start". */
export function samePlacement(a, b) {
  return a !== null && b !== null && a.span === b.span && a.start === b.start;
}

/**
 * The effective placement a breakpoint inherits, following the cascade up.
 *
 * Desktop-first, like the rest of the responsive work: a drawer that says
 * nothing says "the same as the one above". Null when nobody above said
 * anything either.
 */
export function inheritedPlacement(drawers, bp, field) {
  for (const key of BP_INHERITS[bp] ?? []) {
    const placement = placementOf(drawers?.[key]?.[field]);

    if (placement !== null) {
      return placement;
    }
  }

  return null;
}

/** The inherited width alone, for callers that only ever cared about that. */
export function inheritedSpan(drawers, bp, field) {
  return inheritedPlacement(drawers, bp, field)?.span ?? null;
}

/**
 * A width dragged in the preview, written to the row it belongs to.
 *
 * Which breakpoint it lands in is decided here and not in the preview, because
 * `currentBp` is the same answer the responsive fields give — one place to be
 * right about what "the screen size I am editing" means.
 *
 * Two shapes are accepted, told apart by what is already stored: a plain number
 * on the row, or the responsive wrapper's drawer per breakpoint (where the inner
 * field carries the same handle as the wrapper). In the second, a value equal to
 * what the breakpoint would have inherited anyway is written as empty — dragging
 * tablet back into step with laptop drops the override again, instead of
 * freezing today's laptop value into it forever.
 *
 * A change may also carry `start`: the column the block now begins in, sent only
 * by a leading-edge drag where the container allows blocks to overlap. Without
 * it the block keeps the start it had, and a block that never had one keeps
 * flowing — the width alone is written, as a plain number, exactly as before.
 */
export function handleGridSpan(data, doc, win) {
  const field = typeof data.field === 'string' && data.field ? data.field : 'span';
  const bp = currentBp(win);

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let applied = false;

    for (const change of data.changes ?? []) {
      const span = Number(change?.span);

      if (!Number.isFinite(span) || span < 1) {
        continue;
      }

      const path = findPathByUid(values, change.uid);

      if (path === null) {
        continue;
      }

      const current = dataGet(values, `${path}.${field}`);
      const responsive =
        current &&
        typeof current === 'object' &&
        !Array.isArray(current) &&
        Object.keys(BP_INHERITS).some((key) => key in current);

      const start = Number(change?.start);
      const path_ = responsive ? `${path}.${field}.${bp}.${field}` : `${path}.${field}`;

      // A drag that was only about width says nothing about where the block
      // begins, so whatever it began with stands. Only a leading-edge drag in a
      // container that allows overlap sends a start at all — and it is the one
      // gesture that is actually about moving the block.
      const stored = placementOf(dataGet(values, path_));
      const next = {
        span,
        start: Number.isFinite(start) && start > 0 ? start : (stored?.start ?? null),
      };

      // Written back the way it came in: a width with no start is a plain
      // number, which is what every value written before starting columns
      // existed still looks like.
      const value = next.start === null ? next.span : { ...next };

      if (responsive) {
        const inherited = inheritedPlacement(current, bp, field);

        // A drawer left empty means "the same as the one above", so a value that
        // matches what would have been inherited is written as empty instead —
        // dragging tablet back into step with laptop drops the override again,
        // rather than freezing today's laptop value into it forever. What would
        // be inherited includes the start, which is why it is compared here and
        // not left to the caller.
        const effective = { span: next.span, start: next.start ?? inherited?.start ?? null };

        container.setFieldValue(path_, samePlacement(inherited, effective) ? null : value);
      } else {
        container.setFieldValue(path_, value);
      }

      applied = true;
    }

    if (applied) {
      return;
    }
  }
}

/**
 * "+" on a columns section in the preview: append a column to the section's
 * columns array — mirroring the column builder's own addColumn() defaults —
 * and open the new card's edit popup so type and fields can be picked.
 *
 * Written through setFieldValue rather than by clicking the builder's own
 * "Add column" button: programmatic clicks reach the builder's edit buttons
 * fine (the popup flow below), but its add button doesn't respond to them.
 */
export function handleAddColumn(data, doc, win) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const sectionPath = findPathByUid(values, data.uid);

    if (sectionPath === null) {
      continue;
    }

    const columns = dataGet(values, `${sectionPath}.columns`);

    if (!Array.isArray(columns)) {
      continue;
    }

    // Same id format and defaults as the builder's addColumn().
    const newId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const count = columns.length + 1;
    const newItem = {
      _id: newId,
      type: null,
      enabled: true,
      col_w_m: 'col-span-12',
      col_w_t: 'md:col-span-6',
      col_w_d: 'lg:col-span-4',
      order_m: count,
      order_t: count,
      order_d: count,
    };

    container.setFieldValue(`${sectionPath}.columns`, [...JSON.parse(JSON.stringify(columns)), newItem]);

    // The card only mounts (and the builder's picker machinery only measures
    // real rects) in an expanded set — nudge once; Vue applies it asynchronously.
    const setEl = findSetByUid(data.uid, doc) ?? sve.sortableItemForUid(data.uid, doc);

    if (setEl) {
      [...collectAncestorSets(setEl), setEl].forEach(expandSet);
    }

    openColumnTypePicker(newId, doc, win);

    return;
  }
}

/**
 * Opens the builder's type picker on a (typeless) column card once it has
 * mounted — the same flow the card's own plus icon runs. Cards that already
 * have a type get their edit popup instead.
 */
export function openColumnTypePicker(rowId, doc, win, attempts = 0) {
  const card = doc.querySelector(`[data-cb-item-id="${rowId}"]`);
  const trigger = card?.querySelector('.cb-col-plus') ?? card?.querySelector('.cb-edit-btn');

  if (trigger && trigger.offsetParent !== null) {
    trigger.click();
    keepPickerOnScreen(doc, win);

    return;
  }

  if (attempts < 25) {
    setTimeout(() => openColumnTypePicker(rowId, doc, win, attempts + 1), 200);
  }
}

/**
 * The builder positions its type-picker portal at the trigger's rect — with the
 * editor panel parked off-screen (Hide/Auto mode) that lands at left:-10000px.
 * Pull it back into view, centered, so picking a type happens over the preview.
 */
export function keepPickerOnScreen(doc, win, attempts = 0) {
  const panel = [...doc.body.children].find(
    (el) => el.style?.position === 'fixed' && el.style?.zIndex === '99999'
  );

  if (panel) {
    const left = parseFloat(panel.style.left);

    if (Number.isNaN(left) || left < 0 || left > win.innerWidth) {
      panel.style.left = `${Math.max(8, (win.innerWidth - (panel.offsetWidth || 224)) / 2)}px`;
      panel.style.top = '120px';
    }

    return;
  }

  if (attempts < 15) {
    setTimeout(() => keepPickerOnScreen(doc, win, attempts + 1), 150);
  }
}

/**
 * "Save as template": grab the clicked section's data from the form and store it
 * as a reusable section. A small dialog asks for a name and whether it should be
 * synced (edits propagate) or a copy (independent).
 *
 * Synced: after the library entry is created, replace THIS page's section with a
 * `global_section` reference so Live Preview shows the global badge immediately
 * (without a manual reload). Custom (unsynced): leave the page section as-is.
 */
export function handleSaveSection(data, doc, win) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, data.uid);

    if (path === null) {
      continue;
    }

    const section = dataGet(values, path);

    if (!section || typeof section !== 'object') {
      return;
    }

    saveSectionDialog(win, section, (name, synced) => {
      win
        .fetch('/!/sve/saved-sections', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': sve.csrfToken(win),
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({
            title: name,
            section_type: section.type,
            section_data: stripSavedSectionData(section),
            synced,
          }),
        })
        .then(async (res) => {
          const body = await res.json().catch(() => ({}));

          win.Statamic?.$toast?.[res.ok ? 'success' : 'error'](
            res.ok ? t(win, 'saved_toast', { name }) : t(win, 'save_failed')
          );

          if (res.ok) {
            sve.libraryWentStale(win);
          }

          if (!res.ok || !synced || !body.id) {
            return;
          }

          sve.rememberSavedSection(body.id, { title: name, section_type: section.type });

          // Swap the local section for a synced reference — LP morphs from setFieldValue.
          await replaceSectionWithGlobalReference(win, doc, data.uid, body.id);
        })
        .catch(() => win.Statamic?.$toast?.error(t(win, 'save_failed')));
    });

    return;
  }
}

/**
 * Replace the page section at `uid` with a `global_section` row pointing at the
 * newly saved synced entry — same shape as dropping a Global card from the library.
 */
export async function replaceSectionWithGlobalReference(win, doc, uid, savedEntryId) {
  const set = sve.globalSectionSet(win);
  const meta = await sve.fetchSetMeta(win, set);
  const newId = sve.newRowId();
  const row = sve.buildSectionRow(win, 'global', { id: savedEntryId }, meta?.defaults, newId);
  const field = sve.sectionField(win);

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = sve.rowLocation(values, uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows } = found;
    const next = JSON.parse(JSON.stringify(rows));

    next[index] = row;
    sve.writeSetMeta(container, field, row, meta?.new || null);
    container.setFieldValue(parentPath, next);

    return true;
  }

  return false;
}

/**
 * "Save this page as a template": every section on the page, stored as one entry
 * you can drop onto another page.
 *
 * The page's own field is read straight off the publish container, so it captures
 * what's on screen — including edits not yet saved to the page itself.
 */
export function savePageAsTemplate(win, onSaved = () => {}) {
  const doc = win.document;
  const field = sve.sectionField(win);

  let sections = null;

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);
    const rows = values && typeof values === 'object' ? values[field] : null;

    if (Array.isArray(rows) && rows.length) {
      sections = rows;

      break;
    }
  }

  if (!sections) {
    win.Statamic?.$toast?.error(t(win, 'template_needs_sections'));

    return;
  }

  promptForName(win, t(win, 'save_page_as_template'), t(win, 'template_name'), (name) => {
    win
      .fetch('/!/sve/templates', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': sve.csrfToken(win),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          title: name,
          // Ids are per-page. A template is a stencil: it gets fresh ones every
          // time it's dropped, or two pages would claim the same section.
          sections: sections.map((section) => stripSavedSectionData(section)),
        }),
      })
      .then((res) => {
        win.Statamic?.$toast?.[res.ok ? 'success' : 'error'](
          res.ok ? t(win, 'template_saved', { name }) : t(win, 'save_failed')
        );

        if (res.ok) {
          sve.libraryWentStale(win);
          onSaved();
        }
      })
      .catch(() => win.Statamic?.$toast?.error(t(win, 'save_failed')));
  });
}

/**
 * Prepare a section for the saved-sections library.
 *
 * Strips CP-only keys (`_visual_id`, `_id`) but KEEPS (or assigns) stable `id`
 * on every set row. Preview templates use `scope="{{ id }}"` on blocks — without
 * nested ids Antlers cascades to the section id and inline edit resolves the
 * wrong path (`page_sections.0.headline` instead of `….blocks.N.headline`).
 */
export function stripSavedSectionData(section) {
  const clone = JSON.parse(JSON.stringify(section));

  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node && typeof node === 'object') {
      delete node._visual_id;
      delete node._id;

      // Replicator/grid set rows only — not Bard nodes (paragraph/text/…).
      if (
        typeof node.type === 'string' &&
        node.type &&
        !node.id &&
        ('enabled' in node || 'blocks' in node || node.type.includes('/'))
      ) {
        node.id = sve.newRowId();
      }

      Object.values(node).forEach(walk);
    }
  };

  walk(clone);

  return clone;
}

/** Minimal "what should it be called?" prompt, themed to the CP. */
export function promptForName(win, heading, placeholder, onOk) {
  const overlay = openCpOverlay(win.document, NamePrompt, {
    heading,
    nameLabel: t(win, 'name'),
    placeholder,
    cancelLabel: t(win, 'cancel'),
    saveLabel: t(win, 'save'),
    onOk: (value) => {
      overlay.dismiss();
      onOk(value);
    },
  });
}

/** Minimal name + synced prompt, themed to the CP, appended to the body. */
export function saveSectionDialog(win, section, onSave) {
  const overlay = openCpOverlay(win.document, SaveSectionDialog, {
    heading: t(win, 'save_section_heading'),
    nameLabel: t(win, 'name'),
    placeholder: t(win, 'name_placeholder'),
    syncedHint: t(win, 'synced_hint'),
    cancelLabel: t(win, 'cancel'),
    saveLabel: t(win, 'save'),
    onSave: (value, synced) => {
      overlay.dismiss();
      onSave(value, synced);
    },
  });
}



sve.EDITABLE_NODE_TYPES = EDITABLE_NODE_TYPES;
sve.publishContainers = publishContainers;
Object.defineProperty(sve, 'editSession', { get() { return editSession; }, set(v) { editSession = v; } });
sve.registerContainerEvents = registerContainerEvents;
sve.unwrapRef = unwrapRef;
Object.defineProperty(sve, 'entryValuesBaseline', { get() { return entryValuesBaseline; }, set(v) { entryValuesBaseline = v; } });
Object.defineProperty(sve, 'entryBaselineTimer', { get() { return entryBaselineTimer; }, set(v) { entryBaselineTimer = v; } });
Object.defineProperty(sve, 'entrySaveSettling', { get() { return entrySaveSettling; }, set(v) { entrySaveSettling = v; } });
sve.entryPublishContainer = entryPublishContainer;
sve.serializeEntryValues = serializeEntryValues;
sve.markEntryFormClean = markEntryFormClean;
sve.scheduleEntryBaseline = scheduleEntryBaseline;
sve.scheduleEntryBaselineAfterSave = scheduleEntryBaselineAfterSave;
sve.clearEntryBaseline = clearEntryBaseline;
Object.defineProperty(sve, 'bardSyncTimer', { get() { return bardSyncTimer; }, set(v) { bardSyncTimer = v; } });
Object.defineProperty(sve, 'bardSyncPending', { get() { return bardSyncPending; }, set(v) { bardSyncPending = v; } });
sve.syncBardEditorFromValue = syncBardEditorFromValue;
sve.flushBardEditorSync = flushBardEditorSync;
sve.writeBardFieldValue = writeBardFieldValue;
sve.containerFromDom = containerFromDom;
sve.activeContainers = activeContainers;
sve.dataGet = dataGet;
sve.rowPathOf = rowPathOf;
sve.controlValues = controlValues;
sve.findPathByUid = findPathByUid;
sve.normText = normText;
sve.bardNodeText = bardNodeText;
sve.isUnwrappedInlineBard = isUnwrappedInlineBard;
sve.normalizeInlineBardValue = normalizeInlineBardValue;
sve.findPreservedBardNode = findPreservedBardNode;
sve.resolveEditTargets = resolveEditTargets;
sve.MARK_TAGS = MARK_TAGS;
sve.BTS_SPAN_CLASSES = BTS_SPAN_CLASSES;
sve.sameMarks = sameMarks;
sve.parseInlineHtml = parseInlineHtml;
sve.cleanEditedText = cleanEditedText;
sve.handleEditRequest = handleEditRequest;
sve.queueEditUntilPanelReady = queueEditUntilPanelReady;
sve.flushPendingEditUntilPanel = flushPendingEditUntilPanel;
sve.handleEditControl = handleEditControl;
Object.defineProperty(sve, 'themeSwatchesPromise', { get() { return themeSwatchesPromise; }, set(v) { themeSwatchesPromise = v; } });
sve.handleThemeSwatchesRequest = handleThemeSwatchesRequest;
sve.handleEditInput = handleEditInput;
sve.handleEditEnd = handleEditEnd;
sve.BARD_CMD_TITLE = BARD_CMD_TITLE;
sve.domRangeForOffsets = domRangeForOffsets;
sve.handleBardCommand = handleBardCommand;
sve.findBardPopupEl = findBardPopupEl;
sve.revealBardLinkStack = revealBardLinkStack;
sve.repositionBardPopup = repositionBardPopup;
sve.handleOpenPanelField = handleOpenPanelField;
sve.handleBlockFormat = handleBlockFormat;
sve.handleAssetEdit = handleAssetEdit;
sve.handleIconEdit = handleIconEdit;
sve.openIconifyFromField = openIconifyFromField;
sve.clickBrowseIconify = clickBrowseIconify;
sve.openIconifyStackFromInstance = openIconifyStackFromInstance;
sve.openStackInTree = openStackInTree;
sve.openIconifyStack = openIconifyStack;
sve.resolveIconField = resolveIconField;
sve.writeIconField = writeIconField;
sve.handleLinkEdit = handleLinkEdit;
sve.handleMove = handleMove;
sve.handleColumnWidth = handleColumnWidth;
sve.inheritedSpan = inheritedSpan;
sve.inheritedPlacement = inheritedPlacement;
sve.placementOf = placementOf;
sve.samePlacement = samePlacement;
sve.handleGridSpan = handleGridSpan;
sve.handleAddColumn = handleAddColumn;
sve.openColumnTypePicker = openColumnTypePicker;
sve.keepPickerOnScreen = keepPickerOnScreen;
sve.handleSaveSection = handleSaveSection;
sve.replaceSectionWithGlobalReference = replaceSectionWithGlobalReference;
sve.savePageAsTemplate = savePageAsTemplate;
sve.stripSavedSectionData = stripSavedSectionData;
sve.promptForName = promptForName;
sve.saveSectionDialog = saveSectionDialog;
