/**
 * Turn a row of the HTML tree into a component.
 *
 * The markup leaves the section, and everything that describes it leaves with
 * it: the CSS rules that only ever matched that markup, and the Tailwind
 * compiled from its own classes. What lands on disk is a normal template-dock
 * file — HTML, CSS and its own Tailwind key — so the component can be opened
 * and edited exactly like the section it came from.
 *
 * What does not travel: the JS pane. Nothing in a script says which part of the
 * page it belongs to, and a guess that runs the same code twice is worse than
 * leaving it where its author put it.
 */
import { t } from './cp-t.js';
import { ask } from './cp/bus.js';
import { openCpOverlay } from './cp/open-overlay.js';
import NamePrompt from './cp/surfaces/NamePrompt.vue';
import { blockRange } from './html-tree-edit.js';
import { splitCssForBlock } from './component-css.js';
import { tailwindDockOn } from './tailwind-complete.js';

const API = '/!/sve/component';

function csrfToken(win) {
  return (
    win.document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
    win.Statamic?.$config?.get?.('csrfToken') ||
    win.Statamic?.$config?.get?.('csrf_token') ||
    ''
  );
}

/**
 * Drop the indentation the markup only had because of where it sat. A
 * component file starts at the left margin like any other template.
 */
export function dedent(text) {
  const lines = String(text || '').replace(/^\n+/, '').replace(/\s+$/, '').split('\n');
  let least = null;

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    const width = line.match(/^[ \t]*/)[0].length;

    least = least === null ? width : Math.min(least, width);
  }

  return least ? lines.map((line) => line.slice(least)).join('\n') : lines.join('\n');
}

/** Whatever sat in front of the block is what the partial tag inherits. */
function leadOf(block) {
  return String(block || '').match(/^\n?[ \t]*/)[0];
}

async function compileTw(win, html) {
  if (!tailwindDockOn(win)) {
    return '';
  }

  try {
    const mod = await import('./tw-compile.js');

    return (await mod.compileTailwind(win, html)) || '';
  } catch (err) {
    // The server bakes a subset when nothing arrives, so a failed compile
    // costs polish, not the component.
    console.error('[sve] component tailwind compile', err);

    return '';
  }
}

async function post(win, body) {
  const res = await win.fetch(API, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': csrfToken(win),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = new Error(String(res.status));

    err.status = res.status;

    throw err;
  }

  return res.json();
}

/**
 * @returns {{ html: string, css: string, keepCss: string, lead: string, from: number, to: number }|null}
 */
export function componentPartsFor(html, node) {
  const { from, to } = blockRange(html, node);
  const block = html.slice(from, to);

  if (!block.trim()) {
    return null;
  }

  const rest = html.slice(0, from) + html.slice(to);
  const css = ask('dock:css');
  const split = splitCssForBlock(typeof css === 'string' ? css : '', block, rest);

  return {
    html: dedent(block),
    css: split.move,
    keepCss: split.keep,
    lead: leadOf(block),
    from,
    to,
  };
}

export function extractComponent(win, node, { onDone, onError } = {}) {
  if (ask('dock:is-locked') === true) {
    return;
  }

  const html = ask('dock:html');

  if (typeof html !== 'string' || !node) {
    return;
  }

  const parts = componentPartsFor(html, node);

  if (!parts) {
    return;
  }

  const overlay = openCpOverlay(win.document, NamePrompt, {
    heading: t(win, 'component_new'),
    nameLabel: t(win, 'component_name'),
    placeholder: t(win, 'component_name_placeholder'),
    value: node.klass || node.tag || '',
    cancelLabel: t(win, 'cancel'),
    saveLabel: t(win, 'component_create'),
    onOk: (name) => {
      overlay.dismiss();

      void (async () => {
        try {
          const tw = await compileTw(win, parts.html);

          // Read again: the compile is a moment long, and the dock is live.
          const now = ask('dock:html');
          const fresh = typeof now === 'string' && now === html ? parts : componentPartsFor(now, node);

          if (!fresh) {
            return;
          }

          const made = await post(win, {
            name,
            html: fresh.html,
            css: fresh.css,
            js: '',
            tw,
          });

          const source = ask('dock:html');
          const next =
            source.slice(0, fresh.from) + fresh.lead + made.tag + source.slice(fresh.to);

          ask('dock:set-html', next);

          if (fresh.css.trim()) {
            ask('dock:set-css', fresh.keepCss);
          }

          onDone?.(made);
        } catch (err) {
          onError?.(err);
        }
      })();
    },
  });
}
