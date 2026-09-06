/**
 * The standard checks, run against the rendered page.
 *
 * Pure like its neighbour in contrast.js: hand it a `document`, get back a list.
 * No imports, no Control Panel, nothing written — so the same file can run in a
 * headless browser over pages nobody has open, which is what a dashboard widget
 * will need.
 *
 * These are the faults worth a page builder's attention: the ones that make a
 * page unusable with a screen reader or a keyboard, that a person cannot see by
 * looking at it, and that are unambiguous enough to be worth interrupting
 * someone over. Anything that needs judgement — whether an alt text is a *good*
 * alt text, whether link wording makes sense out of context — is deliberately
 * left out. A checker that cries wolf is one people learn to close.
 */

/** The editor's own furniture. Injected under ids of ours, and never the page. */
const CHROME_SELECTOR = '[id^="__sve"], [id^="sve-"], [data-sve-ui]';

const INTERACTIVE =
  'a[href], button, [role="button"], input:not([type="hidden"]), select, textarea';

/** WCAG 2.2 AA asks for 24×24 CSS pixels. */
const MIN_TARGET = 24;

/** Below this, text is decoration that happens to have words in it. */
const MIN_FONT_PX = 12;

/** An alt text past this length has stopped describing and started narrating. */
const MAX_ALT = 150;

/**
 * Alt texts that describe the file rather than the picture. A screen reader
 * reading "image" out loud has told the listener nothing they did not know.
 */
const UNHELPFUL_ALT = new Set([
  'image', 'images', 'picture', 'photo', 'photograph', 'graphic', 'icon', 'logo',
  'spacer', 'placeholder', 'img', 'alt', 'untitled', 'banner',
  'billede', 'billeder', 'foto', 'grafik', 'ikon', 'logo billede', 'pynt',
]);

/**
 * Link texts that only make sense next to the sentence they sit in. Read out
 * on their own — which is how a screen reader lists the links on a page — they
 * are a row of identical entries pointing at different places.
 */
const VAGUE_LINK = new Set([
  'click here', 'here', 'read more', 'more', 'learn more', 'link', 'this page',
  'this link', 'continue', 'go', 'details', 'see more', 'view',
  'klik her', 'her', 'læs mere', 'mere', 'se mere', 'se her', 'link', 'denne side',
  'fortsæt', 'gå til', 'detaljer', 'vis mere', 'hertil',
]);

/**
 * Which pill a rule sits behind.
 *
 * Fixed order, and only the ones with something in them are offered — a filter
 * for a category that is empty is a click that leads to an empty list. The
 * grouping lives here rather than in the panel so anything else reading these
 * findings gets it too.
 */
export const CHECK_GROUPS = ['images', 'links', 'forms', 'text', 'keyboard', 'structure'];

const GROUP_OF = {
  img_alt: 'images',
  img_alt_empty: 'images',
  img_alt_filename: 'images',
  img_alt_unhelpful: 'images',
  img_alt_long: 'images',
  role_img_name: 'images',
  link_name: 'links',
  link_no_href: 'links',
  link_dead: 'links',
  link_vague: 'links',
  link_duplicate_text: 'links',
  field_label: 'forms',
  button_name: 'forms',
  target_size: 'keyboard',
  positive_tabindex: 'keyboard',
  small_text: 'text',
  table_header: 'structure',
  iframe_title: 'structure',
  html_lang: 'structure',
  page_title: 'structure',
  landmark_main: 'structure',
  landmark_main_many: 'structure',
  duplicate_id: 'structure',
};

/** On the page, and not ours. */
function rendered(el) {
  return el.getClientRects().length > 0 && !el.closest(CHROME_SELECTOR);
}

/**
 * Taken out of the accessibility tree on purpose. A decorative icon marked
 * `aria-hidden` is not missing a name — it is correctly saying it has none.
 */
function hidden(el) {
  return !!el.closest('[aria-hidden="true"]');
}

/**
 * What a screen reader would announce for this element.
 *
 * A working simplification of the accessible name computation: the parts that
 * actually decide the answer on a content page, in the order the specification
 * puts them. It errs towards finding a name — the cost of missing one is a
 * false alarm, and a false alarm is what makes a checker worthless.
 */
export function accessibleName(el) {
  const doc = el.ownerDocument;
  const aria = el.getAttribute('aria-label');

  if (aria?.trim()) {
    return aria.trim();
  }

  const labelledby = el.getAttribute('aria-labelledby');

  if (labelledby) {
    const named = labelledby
      .split(/\s+/)
      .map((id) => doc.getElementById(id)?.textContent || '')
      .join(' ')
      .trim();

    if (named) {
      return named;
    }
  }

  const text = (el.textContent || '').replace(/\s+/g, ' ').trim();

  if (text) {
    return text;
  }

  for (const img of el.querySelectorAll('img[alt]')) {
    if (img.getAttribute('alt').trim()) {
      return img.getAttribute('alt').trim();
    }
  }

  const svgTitle = el.querySelector('svg title');

  if (svgTitle?.textContent.trim()) {
    return svgTitle.textContent.trim();
  }

  if (el.getAttribute('title')?.trim()) {
    return el.getAttribute('title').trim();
  }

  if (el.tagName === 'INPUT') {
    if (/^(submit|button|reset)$/i.test(el.type) && el.value?.trim()) {
      return el.value.trim();
    }

    if (/^image$/i.test(el.type)) {
      return (el.getAttribute('alt') || '').trim();
    }
  }

  return '';
}

/** A form control's label, by any of the four ways one can be attached. */
function labelled(el) {
  if (accessibleName(el)) {
    return true;
  }

  if (el.id) {
    const escaped = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(el.id) : el.id;

    if (el.ownerDocument.querySelector(`label[for="${escaped}"]`)) {
      return true;
    }
  }

  return !!el.closest('label');
}

/** Trimmed, folded and stripped of the punctuation people end links with. */
function normalise(text) {
  return text.toLowerCase().replace(/[\s\u00a0]+/g, ' ').replace(/[.,:;!?»«…\-–—>]+$/g, '').trim();
}

/** alt="hero-image-2024.jpg" is an alt text nobody wrote. */
function altIsFilename(alt) {
  return /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(alt.trim()) || /^(dsc|img)[-_ ]?\d+$/i.test(alt.trim());
}

/**
 * Every check, as a list of findings.
 *
 * A finding is a rule plus the elements that broke it — never one entry per
 * element. Twelve images missing alt text is one job, and a list that says so is
 * one a person can work through; twelve identical rows is a list they scroll
 * past.
 *
 * @param {Document} doc
 * @returns {{rule: string, level: 'error'|'warning', count: number,
 *   els: Element[], page: boolean, detail: string}[]}
 */
export function scanChecks(doc) {
  const findings = [];
  const body = doc.body;

  const add = (rule, level, els, detail = '') => {
    if (!els.length) {
      return;
    }

    findings.push({
      rule,
      level,
      group: GROUP_OF[rule] || 'structure',
      count: els.length,
      els,
      page: false,
      detail,
    });
  };

  const page = (rule, level, detail = '') => {
    findings.push({
      rule,
      level,
      group: GROUP_OF[rule] || 'structure',
      count: 1,
      els: [],
      page: true,
      detail,
    });
  };

  const each = (selector, test) =>
    [...body.querySelectorAll(selector)].filter(
      (el) => rendered(el) && !hidden(el) && test(el)
    );

  // --- Images -------------------------------------------------------------
  // No alt attribute at all: a screen reader falls back to reading the file
  // name. An empty alt is a different thing entirely — it is the correct way
  // to say "decorative" — so it is listed to be looked over, never as a fault.
  // Marking it wrong is how people learn to stop using it, and then every
  // spacer on the site starts announcing itself.
  add('img_alt', 'error', each('img:not([alt])', () => true));
  add(
    'img_alt_empty',
    'info',
    each('img[alt=""]', () => true)
  );
  add(
    'img_alt_filename',
    'warning',
    each('img[alt]', (el) => altIsFilename(el.getAttribute('alt')))
  );
  add(
    'img_alt_unhelpful',
    'warning',
    each('img[alt]', (el) => UNHELPFUL_ALT.has(normalise(el.getAttribute('alt'))))
  );
  add(
    'img_alt_long',
    'warning',
    each('img[alt]', (el) => el.getAttribute('alt').trim().length > MAX_ALT)
  );
  add(
    'role_img_name',
    'error',
    each('[role="img"]', (el) => !accessibleName(el))
  );

  // --- Links ---------------------------------------------------------------
  add('link_name', 'error', each('a[href]', (el) => !accessibleName(el)));

  // An anchor with no href is not a link: the keyboard never reaches it, no
  // matter what is bound to its click.
  add('link_no_href', 'warning', each('a:not([href])', (el) => !el.getAttribute('role')));

  add(
    'link_dead',
    'warning',
    each('a[href]', (el) => {
      const href = el.getAttribute('href').trim();

      return href === '' || href === '#';
    })
  );

  add(
    'link_vague',
    'warning',
    each('a[href]', (el) => VAGUE_LINK.has(normalise(accessibleName(el))))
  );

  // The same words pointing at different places. Listed on their own — which is
  // how a screen reader offers the links on a page — they are indistinguishable.
  const byText = new Map();

  for (const el of each('a[href]', (link) => !!accessibleName(link))) {
    const name = normalise(accessibleName(el));

    byText.set(name, [...(byText.get(name) || []), el]);
  }

  const ambiguous = [...byText.values()]
    .filter((els) => new Set(els.map((el) => el.getAttribute('href'))).size > 1)
    .flat();

  add('link_duplicate_text', 'warning', ambiguous);

  // --- Things you can operate ---------------------------------------------
  add(
    'button_name',
    'error',
    each('button, [role="button"], input[type="submit"], input[type="button"], input[type="image"]',
      (el) => !accessibleName(el))
  );
  add(
    'field_label',
    'error',
    each('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea',
      (el) => !labelled(el))
  );

  // Only icon-sized controls with no words in them. An inline link inside a
  // paragraph is under the size too, and WCAG excepts it — flagging those
  // would bury the real fault: a social icon in the footer nobody can hit.
  add(
    'target_size',
    'warning',
    each(INTERACTIVE, (el) => {
      if ((el.textContent || '').trim()) {
        return false;
      }

      const rect = el.getBoundingClientRect();

      return rect.width < MIN_TARGET || rect.height < MIN_TARGET;
    })
  );

  // --- Keyboard ------------------------------------------------------------
  // A positive tabindex takes an element out of the page's own order and puts
  // it first, ahead of everything the reader has not reached yet.
  add(
    'positive_tabindex',
    'warning',
    each('[tabindex]', (el) => Number(el.getAttribute('tabindex')) > 0)
  );

  // --- Embedded content ----------------------------------------------------
  add(
    'iframe_title',
    'warning',
    each('iframe', (el) => !el.getAttribute('title')?.trim() && !accessibleName(el))
  );

  // --- Text and tables -----------------------------------------------------
  const view = doc.defaultView;

  if (view) {
    const small = [...body.querySelectorAll('*')].filter((el) => {
      if (!rendered(el) || hidden(el)) {
        return false;
      }

      let own = false;

      for (const node of el.childNodes) {
        if (node.nodeType === 3 && node.nodeValue.trim()) {
          own = true;
          break;
        }
      }

      return own && parseFloat(view.getComputedStyle(el).fontSize) < MIN_FONT_PX;
    });

    add('small_text', 'warning', small);
  }

  // A table without header cells is a grid of values with nothing saying what
  // any column means — unreadable in one pass, which is all a screen reader gets.
  add(
    'table_header',
    'warning',
    each('table', (el) =>
      el.getAttribute('role') !== 'presentation' &&
      el.rows.length > 1 &&
      !el.querySelector('th, [role="columnheader"], [role="rowheader"]'))
  );

  // --- The page itself -----------------------------------------------------
  if (!doc.documentElement.getAttribute('lang')?.trim()) {
    page('html_lang', 'error');
  }

  if (!doc.title?.trim()) {
    page('page_title', 'error');
  }

  const mains = [...doc.querySelectorAll('main, [role="main"]')].filter(
    (el) => !el.closest(CHROME_SELECTOR)
  );

  if (!mains.length) {
    page('landmark_main', 'warning');
  } else if (mains.length > 1) {
    add('landmark_main_many', 'warning', mains);
  }

  const seen = new Map();

  for (const el of doc.querySelectorAll('[id]')) {
    if (el.closest(CHROME_SELECTOR)) {
      continue;
    }

    const id = el.getAttribute('id');

    seen.set(id, [...(seen.get(id) || []), el]);
  }

  const duplicated = [...seen.values()].filter((els) => els.length > 1).flat();

  add('duplicate_id', 'warning', duplicated);

  const rank = { error: 0, warning: 1, info: 2 };

  return findings.sort((a, b) => rank[a.level] - rank[b.level] || b.count - a.count);
}

/** The tally above the list. */
export function checkCounts(findings) {
  const counts = { error: 0, warning: 0, info: 0 };

  findings.forEach((finding) => {
    counts[finding.level] += finding.count;
  });

  return counts;
}
