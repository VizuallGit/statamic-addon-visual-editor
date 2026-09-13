// KERNEL — not Vue. Runs inside the Live Preview iframe, imported by bridge.js.
//
// AI text: a mark on every editable text on the page, and the popover behind it.
//
// This side owns what you see and touch; it owns no values. The field a mark
// belongs to, the keywords it is written against and the write-back all live in
// the Control Panel (ai-text.js), because that is where the publish form is.
// Everything here talks to it over the same postMessage channel inline editing
// uses, and every exchange carries a requestId so two open marks cannot answer
// each other's questions.

import { aiTextIcon } from './ai-text-icon.js';

const MARK_ATTR = 'data-sve-ai-mark';
const LAYER_ID = '__sve-ai-text-layer';
const POPOVER_ID = '__sve-ai-text-popover';
const STYLES_ID = '__sve-ai-text-styles';

/** Elements that hold text a person may edit. The same opt-in inline edit uses. */
const TEXT_SELECTOR = '[data-sid-inline-edit]';

/** The same glyph as the toolbar button that switched these marks on. */
const MARK_ICON = aiTextIcon();

/**
 * Suggestions per request.
 *
 * Five is the default, because a choice of five is what makes a heading worth
 * rewriting. Long body copy drops to three: five paragraphs is a wall nobody
 * reads, and three still gives a real choice. "More suggestions" adds to the
 * list either way, so the ceiling is only per request.
 */
const COUNT_SHORT = 5;
const COUNT_LONG = 3;

/** Words past which a text counts as a long paragraph rather than a line. */
const LONG_TEXT_WORDS = 50;

/** A long suggestion scrolls inside its own row instead of stretching the panel. */
const SUGGESTION_MAX_HEIGHT = '11rem';

/** Only reached if the module is initialised without the readers. */
const FALLBACK_PRIMARY = '#4530D8';

/**
 * The two tones, and what every part of the panel is painted in.
 *
 * Which one is used depends on the surface the panel sits on, not on the CP's
 * theme — the same rule the inline-edit toolbar follows (toolbar-look.js): light
 * chrome on a dark section, dark chrome on a light one. A white popover on a
 * near-black hero is unreadable no matter what the Control Panel's theme says.
 *
 * Every pair here is a foreground on the background directly behind it, chosen
 * to clear WCAG AA for body text. The keyword chips are the ones that were
 * unreadable: primary-on-primary-tint has no contrast to speak of in either
 * tone, so they are now solid primary with white on top, which holds up on both.
 */
const TONES = {
  // Chrome for a DARK surface: the panel goes light.
  light: {
    bg: '#f4f4f5',
    fg: '#18181b',
    muted: '#3f3f46',
    border: 'rgba(0,0,0,0.14)',
    shadow: '0 0.75rem 2rem rgba(0,0,0,0.35)',
    field: '#ffffff',
    row: '#ffffff',
    rowBorder: 'rgba(0,0,0,0.14)',
    chip: 'rgba(0,0,0,0.06)',
    chipFg: '#18181b',
    hover: 'rgba(0,0,0,0.06)',
    error: '#b91c1c',
    errorBg: 'rgba(220,38,38,0.10)',
  },
  // Chrome for a LIGHT surface: the panel goes dark.
  dark: {
    bg: '#27272a',
    fg: '#f4f4f5',
    muted: '#d4d4d8',
    border: 'rgba(255,255,255,0.16)',
    shadow: '0 0.75rem 2rem rgba(0,0,0,0.55)',
    field: 'rgba(0,0,0,0.30)',
    row: 'rgba(255,255,255,0.06)',
    rowBorder: 'rgba(255,255,255,0.16)',
    chip: 'rgba(255,255,255,0.12)',
    chipFg: '#f4f4f5',
    hover: 'rgba(255,255,255,0.10)',
    error: '#fca5a5',
    errorBg: 'rgba(220,38,38,0.18)',
  },
};

/**
 * The palette for a panel sitting on this element.
 *
 * `surfaceIsDark` answers about the page behind it; a dark page takes the light
 * chrome, which is why the names cross over here.
 */
function paletteFor(el) {
  const dark = el ? !!ctx.surfaceIsDark(el) : false;
  const tone = dark ? TONES.light : TONES.dark;

  return { ...tone, primary: ctx.primary() || FALLBACK_PRIMARY };
}

/** Hands a palette to CSS, so the stylesheet can be written once. */
function applyPalette(el, p) {
  el.style.setProperty('--sve-ai-bg', p.bg);
  el.style.setProperty('--sve-ai-fg', p.fg);
  el.style.setProperty('--sve-ai-muted', p.muted);
  el.style.setProperty('--sve-ai-border', p.border);
  el.style.setProperty('--sve-ai-shadow', p.shadow);
  el.style.setProperty('--sve-ai-field', p.field);
  el.style.setProperty('--sve-ai-row', p.row);
  el.style.setProperty('--sve-ai-row-border', p.rowBorder);
  el.style.setProperty('--sve-ai-chip', p.chip);
  el.style.setProperty('--sve-ai-chip-fg', p.chipFg);
  el.style.setProperty('--sve-ai-hover', p.hover);
  el.style.setProperty('--sve-ai-error', p.error);
  el.style.setProperty('--sve-ai-error-bg', p.errorBg);
  el.style.setProperty('--sve-ai-primary', p.primary);
}

/** Long enough that the current text belongs on the page, not in the input. */
const PREFILL_MAX = 120;

/** How still the page must be before marks are repositioned. */
const REFLOW_QUIET_MS = 150;


const CLOSE_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

let on = false;
let ctx = null; // { win, t }
let layer = null;
let observer = null;
let reflowTimer = null;
/** Our own DOM edits, which must not be mistaken for the page changing. */
let selfEdit = false;
let session = null; // the open popover
let seq = 0;

/* --------------------------------------------------------------------------
 * Marks
 * ------------------------------------------------------------------------ */

function styles(win) {
  if (win.document.getElementById(STYLES_ID)) {
    return;
  }

  const style = win.document.createElement('style');

  style.id = STYLES_ID;
  // Own stylesheet rather than inline styles on every mark: a page may carry a
  // hundred of them, and a rule that is written once also stays consistent.
  win.document.documentElement.style.setProperty(
    '--sve-ai-primary',
    ctx.primary() || FALLBACK_PRIMARY
  );

  style.textContent = `
    #${LAYER_ID} {
      position: absolute;
      inset: 0 auto auto 0;
      width: 0;
      height: 0;
      z-index: 2147483200;
      pointer-events: none;
    }
    /* The mark is always the CP's own accent with a white glyph on it — the
       colour the toolbar button that switched it on is painted in. Nothing
       about it follows the page: it is a control, and a control that changes
       colour from section to section is one you have to look for twice.
       Contrast comes from opacity instead — quiet at rest, solid on hover and
       while its popover is open. */
    #${LAYER_ID} [${MARK_ATTR}] {
      all: unset;
      position: absolute;
      box-sizing: border-box;
      width: 1.375rem;
      height: 1.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: var(--sve-ai-primary);
      color: #fff;
      box-shadow: 0 0.125rem 0.375rem rgba(0, 0, 0, 0.35);
      cursor: pointer;
      pointer-events: auto;
      opacity: 0.6;
      transition: opacity 0.12s ease, transform 0.12s ease;
    }
    #${LAYER_ID} [${MARK_ATTR}]:hover,
    #${LAYER_ID} [${MARK_ATTR}][data-sve-ai-open] {
      opacity: 1;
      transform: scale(1.12);
    }
    #${LAYER_ID} [${MARK_ATTR}] svg {
      width: 0.8125rem;
      height: 0.8125rem;
      display: block;
    }
    /* The text a mark belongs to, while the popover for it is open. */
    [data-sve-ai-target] {
      outline: 2px solid var(--sve-ai-primary);
      outline-offset: 3px;
      border-radius: 2px;
    }
    /* A suggestion being pointed at, shown in the page's own typography. */
    [data-sve-ai-preview] {
      outline: 2px dashed var(--sve-ai-primary);
      outline-offset: 3px;
      border-radius: 2px;
    }
  `;
  win.document.head.appendChild(style);
}

function ensureLayer(win) {
  if (layer && win.document.body.contains(layer)) {
    return layer;
  }

  layer = win.document.createElement('div');
  layer.id = LAYER_ID;
  // Our own DOM must not feed the observer that watches for the page changing.
  layer.setAttribute('data-sve-ai-own', '');
  layer.style.setProperty('--sve-ai-primary', ctx.primary() || FALLBACK_PRIMARY);
  win.document.body.appendChild(layer);

  return layer;
}

/**
 * Which fieldtypes are not text, however they are annotated.
 *
 * A Set rather than an array: this is asked once per candidate element on every
 * repaint, and on a long page that is a few hundred lookups.
 */
const NON_TEXT = new Set(['assets', 'iconify', 'iconamic', 'link', 'toggle', 'select']);

/** Marks are kept against their element, so a repaint reuses instead of rebuilds. */
const marksByElement = new WeakMap();

function makeMark(doc, el) {
  const mark = doc.createElement('button');

  mark.type = 'button';
  mark.setAttribute(MARK_ATTR, '');
  mark.innerHTML = MARK_ICON;
  mark.title = ctx.t('ai_text_mark');
  mark.setAttribute('aria-label', ctx.t('ai_text_mark'));
  // The preview reads clicks on the page as "select this block". A mark is not
  // part of the page, so its click must not reach that listener.
  ['mousedown', 'pointerdown', 'click'].forEach((type) => {
    mark.addEventListener(type, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });
  mark.addEventListener('click', () => openPopover(el, mark));

  return mark;
}

/**
 * Put a mark on every editable text, and take away the ones whose text is gone.
 *
 * Written in two passes on purpose. Reading a rect forces the browser to settle
 * layout; writing a style invalidates it again. Interleaving the two — read,
 * write, read, write — makes the browser redo that work once per element, which
 * on a page with sixty texts is sixty forced reflows in one frame, every time
 * the preview re-renders. So every rect is read first, and only then is anything
 * written.
 *
 * Marks are positioned in page coordinates, which is what lets scrolling be free:
 * the mark is inside the document and moves with the text it belongs to, so a
 * scroll needs no work from us at all.
 */
function paintMarks() {
  if (!on || !ctx) {
    return;
  }

  const { win } = ctx;
  const doc = win.document;
  const host = ensureLayer(win);

  // Re-read here rather than watching for it: this already runs when the page
  // changes, and one custom property costs nothing next to the repaint.
  doc.documentElement.style.setProperty('--sve-ai-primary', ctx.primary() || FALLBACK_PRIMARY);

  const scrollX = win.scrollX;
  const scrollY = win.scrollY;

  // --- pass 1: read ---
  const placements = [];
  const live = new Set();

  doc.querySelectorAll(TEXT_SELECTOR).forEach((el) => {
    if (!el.getAttribute('data-sid-field')) {
      return;
    }

    if (NON_TEXT.has((el.getAttribute('data-sid-fieldtype') || '').toLowerCase())) {
      return;
    }

    const rect = el.getBoundingClientRect();

    // Nothing to point at: a closed accordion, a hidden tab, an empty inline
    // element. A mark there belongs to text the user cannot see or check.
    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    placements.push({ el, left: rect.left + scrollX - 8, top: rect.top + scrollY - 8 });
    live.add(el);
  });

  // --- pass 2: write ---
  for (const { el, left, top } of placements) {
    let mark = marksByElement.get(el);

    if (!mark || !mark.isConnected) {
      mark = makeMark(doc, el);
      marksByElement.set(el, mark);
      host.appendChild(mark);
    }

    mark.__sveAiTarget = el;

    // Only touch the style when it actually moved. A preview re-render usually
    // leaves most of the page where it was, and an unchanged write still costs
    // a style recalculation.
    const x = `${left}px`;
    const y = `${top}px`;

    if (mark.style.left !== x) {
      mark.style.left = x;
    }

    if (mark.style.top !== y) {
      mark.style.top = y;
    }
  }

  // Marks whose text was replaced by a re-render, or scrolled out of existence.
  host.querySelectorAll(`[${MARK_ATTR}]`).forEach((mark) => {
    if (!live.has(mark.__sveAiTarget)) {
      mark.remove();
    }
  });

  // The open popover belonged to one of those. Its text has been replaced by a
  // re-render, so the element it would write a suggestion into is detached and
  // the mark it is anchored to is gone. Leaving it up would show a panel acting
  // on nothing — close it instead.
  if (session && (!session.target.isConnected || !session.mark.isConnected)) {
    // The original markup belongs to a node that is no longer in the page;
    // restoring it would do nothing and could throw.
    session.original = null;
    closePopover();
  }
}

/**
 * Repaint after the page settles, not while it is moving.
 *
 * Live Preview re-renders on every keystroke in the form, and one render is
 * hundreds of mutations in a row. A repaint per mutation — even one per frame —
 * would read layout in the middle of the browser building it, which is the most
 * expensive moment there is. So mutations only push the repaint further out, and
 * it happens once the page has been still for a moment.
 */
function scheduleReflow({ now = false } = {}) {
  if (!on || !ctx) {
    return;
  }

  const { win } = ctx;

  if (reflowTimer) {
    win.clearTimeout(reflowTimer);
  }

  reflowTimer = win.setTimeout(
    () => {
      reflowTimer = null;
      win.requestAnimationFrame(() => {
        paintMarks();
        positionPopover();
      });
    },
    now ? 0 : REFLOW_QUIET_MS
  );
}

/* --------------------------------------------------------------------------
 * Popover
 * ------------------------------------------------------------------------ */

function closePopover() {
  if (!session) {
    return;
  }

  restorePreview();
  session.target?.removeAttribute('data-sve-ai-target');
  session.mark?.removeAttribute('data-sve-ai-open');
  session.el?.remove();
  session = null;
}

function openPopover(target, mark) {
  const { win } = ctx;

  if (session?.target === target) {
    closePopover();

    return;
  }

  closePopover();

  const doc = win.document;
  const el = doc.createElement('div');
  const fieldtype = (target.getAttribute('data-sid-fieldtype') || '').toLowerCase();
  const kind = kindOf(target, fieldtype);
  const current = normalize(target.textContent || '');

  el.id = POPOVER_ID;
  el.style.cssText =
    'position:fixed;z-index:2147483400;width:min(22rem,calc(100vw - 1.5rem));' +
    'max-height:min(28rem,calc(100vh - 2rem));display:flex;flex-direction:column;' +
    'background:var(--sve-ai-bg);color:var(--sve-ai-fg);' +
    'border:1px solid var(--sve-ai-border);border-radius:0.75rem;' +
    'box-shadow:var(--sve-ai-shadow);overflow:hidden;' +
    'font:400 0.8125rem/1.45 ui-sans-serif,system-ui,-apple-system,sans-serif;';

  // After cssText, never before: assigning cssText replaces the whole inline
  // style, custom properties included. Set first, they were wiped, every
  // var(--sve-ai-*) fell back to nothing, and the keyword chips lost their
  // background — white text on no background, measured at 1.1:1.
  //
  // Tone comes from the section the text sits on, the same way the edit toolbar
  // above it decides.
  applyPalette(el, paletteFor(target));

  // Clicks inside the popover are the popover's, never the page's.
  ['mousedown', 'pointerdown', 'click'].forEach((type) =>
    el.addEventListener(type, (e) => e.stopPropagation())
  );

  session = {
    target,
    mark,
    el,
    kind,
    current,
    fieldtype,
    requestId: `sve-ai-text-${++seq}`,
    suggestions: [],
    busy: false,
    error: '',
    keywords: { page: [], site: [] },
    resolved: false,
    original: null, // the target's markup, while a suggestion is previewed
  };

  target.setAttribute('data-sve-ai-target', '');
  mark.setAttribute('data-sve-ai-open', '');
  doc.body.appendChild(el);
  render();
  positionPopover();

  // Ask the CP which field this is and what keywords it is written against.
  post({
    type: 'ai-text-open',
    requestId: session.requestId,
    field: target.getAttribute('data-sid-field'),
    scope: target.getAttribute('data-sid-field-uid') || undefined,
    fieldtype,
    as: target.getAttribute('data-sid-as') || '',
    kind,
    text: current,
  });
}

function kindOf(el, fieldtype) {
  if (/^H[1-6]$/.test(el.tagName) || (el.getAttribute('data-sid-as') || '').startsWith('h')) {
    return 'heading';
  }

  return fieldtype === 'bard' || fieldtype === 'markdown' || fieldtype === 'textarea' ? 'rich' : 'text';
}

/**
 * How many to ask for, from how much text is actually there.
 *
 * The fieldtype alone is the wrong question: a Bard field holding six words is a
 * headline in everything but name, and it deserves the same five as a heading.
 * What makes three the right number is the length of what comes back.
 */
function countFor(session) {
  const words = session.current ? session.current.trim().split(/\s+/).length : 0;

  return words >= LONG_TEXT_WORDS ? COUNT_LONG : COUNT_SHORT;
}

function normalize(text) {
  return text.replace(/\u00a0/g, ' ').replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim();
}

function positionPopover() {
  if (!session) {
    return;
  }

  const { win } = ctx;
  const rect = session.mark.getBoundingClientRect();
  const box = session.el.getBoundingClientRect();
  const gap = 8;
  const margin = 12;

  let left = rect.left;
  let top = rect.bottom + gap;

  if (left + box.width > win.innerWidth - margin) {
    left = win.innerWidth - box.width - margin;
  }

  if (top + box.height > win.innerHeight - margin) {
    // Above the mark when there is no room below, and pinned to the top of the
    // viewport when there is room in neither direction.
    top = Math.max(margin, rect.top - box.height - gap);
  }

  session.el.style.left = `${Math.max(margin, left)}px`;
  session.el.style.top = `${top}px`;
}

/* --------------------------------------------------------------------------
 * Rendering — plain DOM, built once per state change
 * ------------------------------------------------------------------------ */

function render() {
  const { win } = ctx;
  const doc = win.document;
  const t = ctx.t;
  const el = session.el;

  el.textContent = '';

  // --- head ---
  const head = doc.createElement('div');

  head.style.cssText =
    'flex:0 0 auto;display:flex;align-items:center;gap:0.5rem;padding:0.625rem 0.75rem;' +
    'border-bottom:1px solid var(--sve-ai-border);';

  const title = doc.createElement('div');

  title.textContent = t('ai_text_title');
  title.style.cssText = 'flex:1 1 auto;font-weight:600;font-size:0.8125rem;';

  const close = doc.createElement('button');

  close.type = 'button';
  close.innerHTML = CLOSE_ICON;
  close.title = t('ai_text_close');
  close.setAttribute('aria-label', t('ai_text_close'));
  close.style.cssText =
    'all:unset;cursor:pointer;width:1.5rem;height:1.5rem;display:flex;align-items:center;' +
    'justify-content:center;border-radius:0.375rem;color:var(--sve-ai-muted);';
  close.querySelector('svg').style.cssText = 'width:0.875rem;height:0.875rem;display:block;';
  close.addEventListener('click', closePopover);

  head.append(title, close);

  // --- body ---
  const body = doc.createElement('div');

  body.style.cssText = 'flex:1 1 auto;overflow:auto;padding:0.75rem;display:flex;flex-direction:column;gap:0.625rem;';

  body.appendChild(keywordRow(doc));

  const form = doc.createElement('form');

  form.style.cssText = 'display:flex;flex-direction:column;gap:0.5rem;';
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    generate({ fresh: true });
  });

  const input = doc.createElement('input');

  input.type = 'text';
  input.placeholder = t('ai_text_placeholder');
  // The text as it stands, so short fields can be nudged rather than retyped.
  // A long paragraph is left out: it is on the page next to the popover, and
  // filling the box with it hides what the box is for.
  input.value =
    session.instruction ?? (session.current.length <= PREFILL_MAX ? session.current : '');
  input.style.cssText =
    'box-sizing:border-box;width:100%;padding:0.4375rem 0.5rem;border:1px solid var(--sve-ai-border);' +
    'border-radius:0.375rem;font:inherit;color:var(--sve-ai-fg);background:var(--sve-ai-field);';
  input.addEventListener('input', () => {
    session.instruction = input.value;
  });

  session.input = input;
  form.appendChild(input);
  form.appendChild(toneRow(doc));
  form.appendChild(submitRow(doc));
  body.appendChild(form);

  if (session.error) {
    const error = doc.createElement('div');

    error.textContent = session.error;
    error.style.cssText =
      'padding:0.4375rem 0.5rem;border-radius:0.375rem;background:var(--sve-ai-error-bg);color:var(--sve-ai-error);';
    body.appendChild(error);
  }

  if (session.suggestions.length) {
    body.appendChild(suggestionList(doc));
  }

  el.append(head, body);

  if (!session.suggestions.length && !session.busy) {
    requestAnimationFrame(() => input.focus());
  }
}

function keywordRow(doc) {
  const t = ctx.t;
  const row = doc.createElement('div');

  row.style.cssText = 'display:flex;flex-wrap:wrap;gap:0.25rem;align-items:center;';

  const { page, site } = session.keywords;

  if (!session.resolved) {
    return row;
  }

  if (!page.length && !site.length) {
    const note = doc.createElement('div');

    note.textContent = t('ai_text_keywords_none');
    note.style.cssText = 'color:var(--sve-ai-muted);font-size:0.75rem;line-height:1.35;';
    row.appendChild(note);

    return row;
  }

  const chip = (text, own) => {
    const span = doc.createElement('span');

    span.textContent = text;
    span.style.cssText =
      'padding:0.125rem 0.4375rem;border-radius:999px;font-size:0.6875rem;line-height:1.5;' +
      (own
        ? 'background:var(--sve-ai-primary);color:#fff;font-weight:600;'
        : 'background:var(--sve-ai-chip);color:var(--sve-ai-chip-fg);');
    span.title = own ? t('ai_text_keywords_page') : t('ai_text_keywords_site');

    return span;
  };

  page.forEach((word) => row.appendChild(chip(word, true)));
  site.slice(0, Math.max(0, 6 - page.length)).forEach((word) => row.appendChild(chip(word, false)));

  return row;
}

/**
 * The four asks that do not need typing.
 *
 * A tone button is a whole request, not a filter on the last one: it fills the
 * instruction and sends. That is why they are here and not next to the list —
 * "shorter" means "suggest a shorter one", and it is worth nothing without a
 * suggestion coming back.
 */
function toneRow(doc) {
  const t = ctx.t;
  const row = doc.createElement('div');

  row.style.cssText = 'display:flex;flex-wrap:wrap;gap:0.25rem;';

  const tones = [
    ['ai_text_tone_shorter', 'Make it shorter than it is now.'],
    ['ai_text_tone_longer', 'Make it a little longer and fuller than it is now.'],
    ['ai_text_tone_sharper', 'Make it more concrete — say the actual thing, drop the filler.'],
    ['ai_text_tone_keywords', 'Work the page keywords in harder, still as natural sentences.'],
  ];

  tones.forEach(([key, instruction]) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = t(key);
    btn.disabled = session.busy;
    btn.style.cssText =
      'all:unset;cursor:pointer;padding:0.1875rem 0.5rem;border-radius:999px;font-size:0.6875rem;' +
      'border:1px solid var(--sve-ai-border);color:var(--sve-ai-fg);' +
      'background:var(--sve-ai-chip);' +
      (session.busy ? 'opacity:0.5;cursor:default;' : '');
    btn.addEventListener('click', () => {
      if (session.busy) {
        return;
      }

      session.instruction = instruction;
      generate({ fresh: true });
    });
    row.appendChild(btn);
  });

  return row;
}

function submitRow(doc) {
  const t = ctx.t;
  const row = doc.createElement('div');

  row.style.cssText = 'display:flex;align-items:center;gap:0.5rem;';

  const submit = doc.createElement('button');

  submit.type = 'submit';
  submit.textContent = session.busy ? t('ai_text_working') : t('ai_text_generate');
  submit.disabled = session.busy;
  submit.style.cssText =
    'all:unset;cursor:pointer;padding:0.375rem 0.75rem;border-radius:0.375rem;font-weight:600;' +
    'font-size:0.75rem;background:var(--sve-ai-primary);color:#fff;text-align:center;' +
    (session.busy ? 'opacity:0.6;cursor:default;' : '');

  row.appendChild(submit);

  if (session.busy) {
    const spinner = doc.createElement('span');

    spinner.textContent = t('ai_text_working');
    spinner.style.cssText = 'color:var(--sve-ai-muted);font-size:0.75rem;';
    row.appendChild(spinner);
  }

  return row;
}

/**
 * The suggestions, newest first.
 *
 * Newest first because that is where the user is looking: the "more" button is
 * an answer to "not this one", and the answer should not arrive below the fold
 * of a list of five. The numbers count from the top, so #1 is always the newest.
 */
function suggestionList(doc) {
  const t = ctx.t;
  const wrap = doc.createElement('div');

  wrap.style.cssText = 'display:flex;flex-direction:column;gap:0.375rem;';

  const hint = doc.createElement('div');

  hint.textContent = t('ai_text_hint_hover');
  hint.style.cssText = 'color:var(--sve-ai-muted);font-size:0.6875rem;line-height:1.35;';
  wrap.appendChild(hint);

  [...session.suggestions].reverse().forEach((text, i) => {
    const row = doc.createElement('button');

    row.type = 'button';
    row.style.cssText =
      'all:unset;cursor:pointer;box-sizing:border-box;display:flex;gap:0.5rem;width:100%;' +
      'padding:0.5rem;border-radius:0.5rem;border:1px solid var(--sve-ai-row-border);' +
      'background:var(--sve-ai-row);color:var(--sve-ai-fg);text-align:left;';

    const number = doc.createElement('span');

    number.textContent = String(i + 1);
    number.style.cssText =
      'flex:0 0 auto;width:1.125rem;height:1.125rem;display:flex;align-items:center;' +
      'justify-content:center;border-radius:999px;' +
      'background:var(--sve-ai-primary);color:#fff;font-size:0.6875rem;font-weight:600;';

    const body = doc.createElement('span');

    body.textContent = text;
    // A long suggestion scrolls inside its own row. Letting it set the panel's
    // height instead would push "More suggestions" — and the rest of the list —
    // off the bottom of the screen the moment one answer runs long.
    body.style.cssText =
      'flex:1 1 auto;white-space:pre-wrap;overflow-wrap:anywhere;' +
      `max-height:${SUGGESTION_MAX_HEIGHT};overflow-y:auto;overscroll-behavior:contain;`;

    row.append(number, body);
    body.style.userSelect = 'text';
    row.addEventListener('mouseenter', () => showPreview(text));
    row.addEventListener('mouseleave', restorePreview);
    row.addEventListener('focus', () => showPreview(text));
    row.addEventListener('blur', restorePreview);
    row.addEventListener('click', () => apply(text));
    wrap.appendChild(row);
  });

  const more = doc.createElement('button');

  more.type = 'button';
  more.textContent = session.busy ? t('ai_text_working') : t('ai_text_more');
  more.disabled = session.busy;
  more.style.cssText =
    'all:unset;cursor:pointer;padding:0.375rem 0.5rem;border-radius:0.375rem;font-size:0.75rem;' +
    'border:1px dashed var(--sve-ai-border);color:var(--sve-ai-muted);text-align:center;' +
    (session.busy ? 'opacity:0.5;cursor:default;' : '');
  more.addEventListener('click', () => {
    if (!session.busy) {
      generate({ fresh: false });
    }
  });
  wrap.appendChild(more);

  return wrap;
}

/* --------------------------------------------------------------------------
 * Preview on hover, and applying
 * ------------------------------------------------------------------------ */

/**
 * The suggestion in the page's own type, at the page's own width.
 *
 * A heading that reads well in a 22rem popover and breaks over three lines in
 * the design is not a good heading, and this is the only place that can be seen
 * before committing to it. Nothing is written: the DOM is changed, the value is
 * not, and the next preview render would undo it anyway.
 */
function showPreview(text) {
  if (!session) {
    return;
  }

  restorePreview();

  const target = session.target;

  // Swapping the text is our edit, not the page's. Without this the observer
  // treats it as a re-render and schedules a repaint for every hover.
  selfEdit = true;

  try {
    session.original = target.innerHTML;
    target.setAttribute('data-sve-ai-preview', '');

    if (session.kind === 'rich' && text.includes('\n')) {
      target.textContent = '';

      text
        .split(/\n{2,}/)
        .map((part) => part.trim())
        .filter(Boolean)
        .forEach((part) => {
          const p = ctx.win.document.createElement('p');

          p.textContent = part;
          target.appendChild(p);
        });
    } else {
      target.textContent = text;
    }
  } finally {
    selfEdit = false;
  }

  // The mark sits on the text's top-left corner, and the text just changed
  // height. Straight away rather than after the quiet period: the user is
  // looking at it, and this is one known element moving, not a page re-render.
  scheduleReflow({ now: true });
}

function restorePreview() {
  if (!session || session.original === null) {
    return;
  }

  selfEdit = true;

  try {
    session.target.innerHTML = session.original;
    session.target.removeAttribute('data-sve-ai-preview');
  } finally {
    selfEdit = false;
  }

  session.original = null;
  scheduleReflow({ now: true });
}

function apply(text) {
  // Drop the hover preview first: the value written to the form is what the
  // preview will re-render from, and a restore landing after that would put the
  // old text back on screen over the new value.
  restorePreview();

  post({
    type: 'ai-text-apply',
    requestId: session.requestId,
    field: session.target.getAttribute('data-sid-field'),
    scope: session.target.getAttribute('data-sid-field-uid') || undefined,
    fieldtype: session.fieldtype,
    kind: session.kind,
    text,
  });

  closePopover();
}

function generate({ fresh }) {
  if (!session || session.busy) {
    return;
  }

  if (fresh) {
    session.suggestions = [];
  }

  session.busy = true;
  session.error = '';
  render();

  post({
    type: 'ai-text-generate',
    requestId: session.requestId,
    field: session.target.getAttribute('data-sid-field'),
    scope: session.target.getAttribute('data-sid-field-uid') || undefined,
    fieldtype: session.fieldtype,
    kind: session.kind,
    text: session.current,
    instruction: (session.instruction ?? session.input?.value ?? '').trim(),
    count: countFor(session),
    avoid: session.suggestions,
  });
}

/* --------------------------------------------------------------------------
 * Channel
 * ------------------------------------------------------------------------ */

function post(message) {
  ctx.win.parent.postMessage({ source: 'statamic-visual-editor', ...message }, '*');
}

/** Answers from the Control Panel. Returns true when the message was ours. */
export function handleAiTextMessage(data) {
  if (!data?.type?.startsWith?.('ai-text-')) {
    return false;
  }

  if (data.type === 'ai-text-mode') {
    setAiTextMode(!!data.on);

    return true;
  }

  // Everything below belongs to one open popover.
  if (!session || data.requestId !== session.requestId) {
    return true;
  }

  if (data.type === 'ai-text-ready') {
    session.resolved = true;
    session.keywords = {
      page: Array.isArray(data.keywords?.page) ? data.keywords.page : [],
      site: Array.isArray(data.keywords?.site) ? data.keywords.site : [],
    };

    if (typeof data.text === 'string' && data.text.trim() !== '') {
      // The stored value beats the rendered text: modifiers may have changed
      // what is on screen, and the value is what the suggestion replaces.
      session.current = normalize(data.text);
    }

    if (data.kind) {
      session.kind = data.kind;
    }

    render();

    return true;
  }

  if (data.type === 'ai-text-deny') {
    session.resolved = true;
    session.busy = false;
    session.error = data.message || ctx.t('ai_text_denied');
    render();

    return true;
  }

  if (data.type === 'ai-text-result') {
    session.busy = false;

    const rows = Array.isArray(data.suggestions) ? data.suggestions.filter((row) => typeof row === 'string') : [];

    if (!rows.length) {
      session.error = data.message || ctx.t('ai_text_empty');
    } else {
      session.error = data.message || '';
      // Appended, never replaced: "more" is how a long field gets a choice, and
      // a list you can look back through is the whole point of appending.
      rows.forEach((row) => {
        if (!session.suggestions.includes(row)) {
          session.suggestions.push(row);
        }
      });
    }

    render();
    positionPopover();

    return true;
  }

  return true;
}

/* --------------------------------------------------------------------------
 * On / off
 * ------------------------------------------------------------------------ */

export function setAiTextMode(next) {
  if (!ctx) {
    return;
  }

  const { win } = ctx;

  if (on === !!next) {
    return;
  }

  on = !!next;

  if (!on) {
    closePopover();
    layer?.remove();
    layer = null;
    observer?.disconnect();
    observer = null;

    if (reflowTimer) {
      win.clearTimeout(reflowTimer);
      reflowTimer = null;
    }

    unbindListeners(win);

    return;
  }

  styles(win);
  bindListeners(win);
  paintMarks();

  if (!observer) {
    // The preview re-renders on every keystroke in the form, replacing elements
    // wholesale — so marks are repainted from the DOM rather than tracked.
    //
    // childList only. `characterData` would fire on every character typed into
    // the page through inline editing, and text changing inside an element that
    // is still there is not a reason to move a mark that is already on it.
    observer = new win.MutationObserver((records) => {
      if (selfEdit) {
        return;
      }

      // Our own layer mutates whenever a mark is added or removed. Reacting to
      // that would schedule the next repaint from inside this one.
      for (const record of records) {
        if (!record.target?.closest?.('[data-sve-ai-own]')) {
          scheduleReflow();

          return;
        }
      }
    });
    observer.observe(win.document.body, { childList: true, subtree: true });
  }
}

export function isAiTextOn() {
  return on;
}

/**
 * Scroll moves the popover, never the marks.
 *
 * The marks live in the document in page coordinates, so the browser scrolls
 * them for free. The popover is fixed to the viewport and is the only thing that
 * has to be told — and there is at most one of it, so this stays one rect read
 * per scroll frame instead of one per text on the page.
 */
function onScroll() {
  if (session) {
    positionPopover();
  }
}

function onResize() {
  // A resize really can move every mark: the layout reflows underneath them.
  scheduleReflow();
}

function onKeydown(e) {
  if (e.key === 'Escape' && session) {
    e.stopPropagation();
    closePopover();
  }
}

/**
 * Listeners come and go with the switch.
 *
 * AI text is off by default and stays off on most sessions. Nothing it owns
 * should be attached to the preview while it is off — not a scroll handler that
 * returns early, not an observer that disconnects on the first record.
 */
function bindListeners(win) {
  win.addEventListener('resize', onResize);
  // Capture: the page's own scrollers move the popover's anchor without the
  // window scrolling.
  win.addEventListener('scroll', onScroll, true);
  win.addEventListener('keydown', onKeydown);
}

function unbindListeners(win) {
  win.removeEventListener('resize', onResize);
  win.removeEventListener('scroll', onScroll, true);
  win.removeEventListener('keydown', onKeydown);
}

export function initAiText(win, t, helpers = {}) {
  ctx = {
    win,
    t,
    primary: helpers.primary || (() => FALLBACK_PRIMARY),
    surfaceIsDark: helpers.surfaceIsDark || (() => false),
  };

  // A fresh preview document knows nothing about the toolbar switch, and there
  // is no general "preview loaded" event on the other side to hang this on. So
  // the side that was just born asks: the Control Panel answers with the mode,
  // whichever way the reload happened. Until that answer arrives this module has
  // nothing attached to the page at all.
  post({ type: 'ai-text-hello' });
}
