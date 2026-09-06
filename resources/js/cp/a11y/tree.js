/**
 * The page as assistive technology meets it: roles and names, nested.
 *
 * Not Chrome's own tree. The real one lives behind the DevTools protocol
 * (`Accessibility.getFullAXTree`), which no page script can reach — so this
 * computes the same two things from the same rules: the role each element
 * carries, and the name it would be announced by. Close enough to answer the
 * question people actually have ("what is this called, and what does it say it
 * is?"), and honest enough to say where it stops: no ignored nodes, no
 * StaticText, no live state.
 *
 * Pure like the rest of cp/a11y: hand it a `document`, get back a list.
 */

const CHROME_SELECTOR = '[id^="__sve"], [id^="sve-"], [data-sve-ui]';

/**
 * Roles whose name comes from what is inside them.
 *
 * The distinction the whole tree hangs on. A button is named by its words; a
 * navigation landmark is not — it is named by its aria-label, and taking its
 * text instead would name the site menu after every link in it.
 */
const NAME_FROM_CONTENT = new Set([
  'button', 'cell', 'checkbox', 'columnheader', 'gridcell', 'heading', 'link',
  'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'row',
  'rowheader', 'switch', 'tab', 'tooltip', 'treeitem',
]);

/** header and footer are landmarks only at the top level of the document. */
const SCOPING = 'article, aside, main, nav, section, [role="article"], [role="complementary"], [role="main"], [role="navigation"], [role="region"]';

const INPUT_ROLES = {
  button: 'button',
  submit: 'button',
  reset: 'button',
  image: 'button',
  checkbox: 'checkbox',
  radio: 'radio',
  range: 'slider',
  number: 'spinbutton',
  search: 'searchbox',
  email: 'textbox',
  tel: 'textbox',
  text: 'textbox',
  url: 'textbox',
  password: 'textbox',
  hidden: '',
};

/** The roles worth a row without being asked. Everything else needs the toggle. */
const INTERESTING = new Set([
  'banner', 'navigation', 'main', 'contentinfo', 'complementary', 'region',
  'search', 'form', 'article', 'dialog', 'heading', 'link', 'button', 'textbox',
  'searchbox', 'checkbox', 'radio', 'combobox', 'listbox', 'slider',
  'spinbutton', 'img', 'figure', 'list', 'listitem', 'table', 'row', 'cell',
  'columnheader', 'rowheader', 'tablist', 'tab', 'tabpanel', 'menu', 'menuitem',
  'menubar', 'alert', 'status', 'progressbar', 'separator', 'group', 'switch',
  'tree', 'treeitem', 'grid', 'gridcell', 'summary', 'term', 'definition',
]);

/** A page this big has stopped being a tree and started being a haystack. */
const MAX_NODES = 800;

/**
 * The role this element carries — the one it was given, or the one its tag
 * implies. Returns '' for anything with no role at all.
 */
export function roleOf(el) {
  const explicit = (el.getAttribute('role') || '').trim().split(/\s+/)[0];

  if (explicit) {
    return explicit.toLowerCase();
  }

  const tag = el.tagName.toLowerCase();

  if (/^h[1-6]$/.test(tag)) {
    return 'heading';
  }

  switch (tag) {
    case 'a':
    case 'area':
      return el.hasAttribute('href') ? 'link' : 'generic';
    case 'article':
      return 'article';
    case 'aside':
      return 'complementary';
    case 'button':
      return 'button';
    case 'datalist':
      return 'listbox';
    case 'dd':
      return 'definition';
    case 'details':
      return 'group';
    case 'dfn':
    case 'dt':
      return 'term';
    case 'dialog':
      return 'dialog';
    case 'fieldset':
      return 'group';
    case 'figure':
      return 'figure';
    case 'footer':
      return el.closest(SCOPING) ? 'generic' : 'contentinfo';
    case 'form':
      return 'form';
    case 'header':
      return el.closest(SCOPING) ? 'generic' : 'banner';
    case 'hr':
      return 'separator';
    // alt="" is a picture saying it is decoration, and the tree honours that.
    case 'img':
      return el.getAttribute('alt') === '' ? 'presentation' : 'img';
    case 'input':
      return INPUT_ROLES[(el.type || 'text').toLowerCase()] ?? 'textbox';
    case 'li':
      return el.parentElement && /^(ul|ol|menu)$/i.test(el.parentElement.tagName) ? 'listitem' : 'generic';
    case 'main':
      return 'main';
    case 'menu':
    case 'ol':
    case 'ul':
      return 'list';
    case 'nav':
      return 'navigation';
    case 'optgroup':
      return 'group';
    case 'option':
      return 'option';
    case 'output':
      return 'status';
    case 'p':
      return 'paragraph';
    case 'progress':
      return 'progressbar';
    case 'search':
      return 'search';
    case 'section':
      return hasAuthorName(el) ? 'region' : 'generic';
    case 'select':
      return el.multiple || el.size > 1 ? 'listbox' : 'combobox';
    case 'summary':
      return 'summary';
    case 'table':
      return 'table';
    case 'tbody':
    case 'tfoot':
    case 'thead':
      return 'rowgroup';
    case 'td':
      return 'cell';
    case 'textarea':
      return 'textbox';
    case 'th':
      return el.getAttribute('scope') === 'row' ? 'rowheader' : 'columnheader';
    case 'tr':
      return 'row';
    default:
      return 'generic';
  }
}

/** aria-label, aria-labelledby or title: a name the author wrote deliberately. */
function hasAuthorName(el) {
  return !!(
    el.getAttribute('aria-label')?.trim() ||
    el.getAttribute('aria-labelledby')?.trim() ||
    el.getAttribute('title')?.trim()
  );
}

function authorName(el) {
  const label = el.getAttribute('aria-label');

  if (label?.trim()) {
    return label.trim();
  }

  const labelledby = el.getAttribute('aria-labelledby');

  if (labelledby) {
    const doc = el.ownerDocument;
    const named = labelledby
      .split(/\s+/)
      .map((id) => doc.getElementById(id)?.textContent || '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (named) {
      return named;
    }
  }

  return el.getAttribute('title')?.trim() || '';
}

/**
 * What this element would be announced as.
 *
 * The author's name always wins. After that it depends on the role: the ones in
 * NAME_FROM_CONTENT take their words, and everything else stays unnamed rather
 * than borrowing the text of its children — which is the difference between
 * `navigation "Main menu"` and a navigation landmark named after the whole site.
 */
export function nameOf(el, role) {
  const author = authorName(el);

  if (author) {
    return author;
  }

  const tag = el.tagName.toLowerCase();

  if (tag === 'img' || (tag === 'input' && el.type === 'image')) {
    return (el.getAttribute('alt') || '').trim();
  }

  if (tag === 'input' || tag === 'select' || tag === 'textarea') {
    if (el.id) {
      const escaped = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(el.id) : el.id;
      const label = el.ownerDocument.querySelector(`label[for="${escaped}"]`);

      if (label?.textContent.trim()) {
        return label.textContent.replace(/\s+/g, ' ').trim();
      }
    }

    const wrapping = el.closest('label');

    if (wrapping?.textContent.trim()) {
      return wrapping.textContent.replace(/\s+/g, ' ').trim();
    }

    if (/^(submit|button|reset)$/i.test(el.type) && el.value?.trim()) {
      return el.value.trim();
    }

    return '';
  }

  if (!NAME_FROM_CONTENT.has(role)) {
    return '';
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

  return el.querySelector('svg title')?.textContent.trim() || '';
}

/**
 * Roles that must have a name to be any use. A link announced as just "link"
 * is a door with no sign on it.
 */
const NEEDS_NAME = new Set([
  'link', 'button', 'textbox', 'searchbox', 'checkbox', 'radio', 'combobox',
  'listbox', 'slider', 'spinbutton', 'img', 'switch',
]);

/** Landmarks: the parts of a page a reader jumps between. */
const LANDMARKS = new Set([
  'banner', 'navigation', 'main', 'contentinfo', 'complementary', 'region',
  'form', 'search',
]);

/**
 * What is worth saying about each node, once the whole tree is known.
 *
 * An error is a node that cannot do its job: a link, a button or a field with
 * nothing to announce. A warning is a node that works but is ambiguous — two
 * navigations on a page, neither of them named, so "navigation" is not an
 * answer to which one. Both are things you can only see from up here, which is
 * the argument for saying them here rather than in the flat checks.
 */
function mark(rows) {
  const landmarks = new Map();

  rows.forEach((row) => {
    if (LANDMARKS.has(row.role)) {
      landmarks.set(row.role, (landmarks.get(row.role) || 0) + 1);
    }
  });

  rows.forEach((row) => {
    if (row.unnamed) {
      row.issue = 'error';
      row.why = 'unnamed';

      return;
    }

    if (LANDMARKS.has(row.role) && !row.name && landmarks.get(row.role) > 1) {
      row.issue = 'warning';
      row.why = 'landmark';

      return;
    }

    if (row.role === 'heading' && !row.name) {
      row.issue = 'warning';
      row.why = 'heading';
    }
  });
}

/**
 * The tree, flattened, each node carrying how deep it sits.
 *
 * Flattened because the panel draws a list and the nesting is drawn as indent —
 * and because a flat array survives the page being rebuilt under it, which
 * happens on every keystroke in Live Preview.
 *
 * @param {Document} doc
 * @param {{generic?: boolean}} options `generic` also lists the containers and
 *   paragraphs that carry no role of their own.
 * @returns {{depth: number, role: string, name: string, tag: string,
 *   unnamed: boolean, el: Element}[]}
 */
export function scanTree(doc, { generic = false } = {}) {
  const view = doc.defaultView || window;
  const rows = [];
  let truncated = false;

  const walk = (el, depth, parentPath) => {
    let index = 0;

    for (const child of el.children) {
      if (rows.length >= MAX_NODES) {
        truncated = true;

        return;
      }

      const tag = child.tagName.toLowerCase();

      if (tag === 'script' || tag === 'style' || tag === 'template' || tag === 'noscript') {
        continue;
      }

      if (child.closest(CHROME_SELECTOR)) {
        continue;
      }

      // Taken out of the tree by the author, or by not being rendered at all.
      // Both are the page saying "this is not here", and the tree agrees.
      const style = view.getComputedStyle(child);
      const gone =
        child.getAttribute('aria-hidden') === 'true' ||
        style.display === 'none' ||
        style.visibility === 'hidden';

      if (gone) {
        continue;
      }

      const role = roleOf(child);
      const ignored = role === 'presentation' || role === 'none' || role === '';
      const listed =
        !ignored && (INTERESTING.has(role) || (generic && role !== 'generic') || (generic && role === 'generic'));

      const path = `${parentPath}/${index}`;

      index += 1;

      if (listed) {
        const name = nameOf(child, role);

        rows.push({
          path,
          depth,
          role,
          name,
          tag,
          unnamed: !name && NEEDS_NAME.has(role),
          issue: '',
          why: '',
          el: child,
        });
        walk(child, depth + 1, path);

        continue;
      }

      // Not listed itself, but whatever is inside it still belongs where it is.
      walk(child, depth, path);
    }
  };

  if (doc.body) {
    walk(doc.body, 0, '');
  }

  mark(rows);

  if (truncated) {
    rows.truncated = true;
  }

  return rows;
}
