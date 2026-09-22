/**
 * Where a class is already defined — for the dock's own `[ name ]`.
 *
 * A section names itself in the brackets, and the CSS pane shows that name's
 * rule in this file. It cannot show what tttt.css already says about `.tttt`,
 * so a taken name reads as free, and the padding the preview shows comes from
 * nowhere the pane can see. The site is asked once (`/!/sve/site-css/defined`,
 * kept for a while) and the answer is used three ways:
 *
 *   - typing in the brackets offers the site's own class names, the file
 *     beside each; picking one writes the name and brings its rules into this
 *     file's rule for it;
 *   - a name in the brackets that the site defines elsewhere is marked in the
 *     pane, with where;
 *   - the CSS pane's head says so too, and a click there brings the rules in.
 *
 * The brackets only — never Tailwind's classes, which are not the site's.
 */
import { ask } from '../cp/bus.js';
import { t } from '../lib/i18n.js';
import { bracketClassTokens, bracketRun, fillClassRule } from '../css-scope.js';
import { DOCK_ID, Decoration, EditorView, RangeSetBuilder, StateEffect, StateField, editors } from '../code-dock.js';

const TTL = 20000;
let defs = [];
let loadedAt = 0;
let promise = null;
// Made when first needed, not when the module loads: this module and the
// barrel it imports from load in a ring, and a define() at the top ran before
// the barrel's exports existed — the whole dock chunk failed to load.
let takenRefresh = null;

function refreshEffect() {
  if (!takenRefresh) {
    takenRefresh = StateEffect.define();
  }

  return takenRefresh;
}

/** True while the last answer is recent enough to go on using. */
export function classDefsFresh() {
  return !!promise && Date.now() - loadedAt < TTL;
}

export function loadClassDefs(win) {
  if (classDefsFresh()) {
    return promise;
  }

  loadedAt = Date.now();
  promise = win
    .fetch('/!/sve/site-css/defined', {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
    .then((res) => (res.ok ? res.json() : { defined: [] }))
    .then((data) => {
      defs = Array.isArray(data?.defined) ? data.defined : [];
      editors.html?.dispatch({ effects: refreshEffect().of(null) });

      return defs;
    })
    .catch(() => {
      promise = null;

      return defs;
    });

  return promise;
}

/** The file the dock holds, as its head shows it: `resources/views/…`. */
function dockFile(win) {
  return win.document.getElementById(DOCK_ID)?.querySelector('[data-sve-code-path]')?.textContent.trim() || '';
}

/** Where else the site defines this name — every file but the one in the dock. */
export function definedElsewhere(win, name) {
  const here = dockFile(win);

  return name ? defs.filter((d) => d.name === name && d.file !== here) : [];
}

const shortFiles = (list) => [...new Set(list.map((d) => String(d.file).replace(/^.*\//, '')))];

/** Bring the name's rules from the rest of the site into this file's rule. */
export function importClassCss(win, name) {
  const body = definedElsewhere(win, name).map((d) => d.css).filter(Boolean).join('\n');

  if (!body) {
    return false;
  }

  const css = ask('dock:css');

  if (typeof css !== 'string') {
    return false;
  }

  const next = fillClassRule(css, name, body);

  return next !== css && ask('dock:set-css', next) !== false;
}

/** Inside the brackets of a class attribute on this line: where the word under the caret starts. */
function bracketWordAt(state, pos) {
  const line = state.doc.lineAt(pos);
  const rel = pos - line.from;
  const re = /\bclass\s*=\s*(["'])/gi;
  let m;

  while ((m = re.exec(line.text))) {
    const quote = m[1];
    const valueFrom = m.index + m[0].length;
    const close = line.text.indexOf(quote, valueFrom);
    const valueTo = close === -1 ? line.text.length : close;

    if (rel < valueFrom || rel > valueTo) {
      continue;
    }

    const value = line.text.slice(valueFrom, valueTo);
    const run = bracketRun(value);
    const at = rel - valueFrom;

    if (!run || at < run.innerFrom || at > run.innerTo) {
      return null;
    }

    const word = (value.slice(run.innerFrom, at).match(/[\w-]*$/) || [''])[0];

    return { from: pos - word.length, typed: word };
  }

  return null;
}

/** The site's own class names, offered inside the brackets. A pick brings the rules in. */
export function bracketClassCompletions(win) {
  return (context) => {
    const at = bracketWordAt(context.state, context.pos);

    if (!at || (!at.typed && !context.explicit)) {
      return null;
    }

    return loadClassDefs(win).then((list) => {
      const here = dockFile(win);
      const typed = at.typed.toLowerCase();
      const byName = new Map();

      for (const d of list) {
        if (d.file === here || !String(d.name).toLowerCase().startsWith(typed)) {
          continue;
        }

        const cur = byName.get(d.name) || { files: [], css: [] };

        cur.files.push(d);

        if (d.css) {
          cur.css.push(d.css);
        }

        byName.set(d.name, cur);
      }

      if (!byName.size) {
        return null;
      }

      const options = [...byName].slice(0, 40).map(([name, info]) => ({
        label: name,
        type: 'class',
        detail: shortFiles(info.files).join(', '),
        info: info.css.length
          ? () => {
              const el = win.document.createElement('pre');

              el.textContent = info.css.join('\n');
              el.style.cssText = 'margin:0;padding:.3em .5em;font:11px ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap';

              return el;
            }
          : undefined,
        apply: (view, completion, from, to) => {
          view.dispatch({ changes: { from, to, insert: name }, selection: { anchor: from + name.length } });
          // The bracket sync made this file's rule on that change; fill it.
          win.setTimeout(() => importClassCss(win, name), 0);
        },
      }));

      return { from: at.from, options, validFor: /^[\w-]*$/ };
    });
  };
}

/** The pane's marks on bracket names the site defines elsewhere: red, and the file in the title. */
export function takenClassMarks(win) {
  const build = (html) => {
    if (!defs.length) {
      return Decoration.none;
    }

    const here = dockFile(win);
    const builder = new RangeSetBuilder();

    for (const token of bracketClassTokens(html)) {
      const where = defs.filter((d) => d.name === token.name && d.file !== here);

      if (!where.length) {
        continue;
      }

      builder.add(
        token.from,
        token.to,
        Decoration.mark({
          class: 'sve-cm-class-taken',
          attributes: { title: t(win, 'class_defined_in', { file: shortFiles(where).join(', ') }) },
        })
      );
    }

    return builder.finish();
  };

  return StateField.define({
    create: (state) => build(state.doc.toString()),
    update: (value, tr) =>
      tr.docChanged || tr.effects.some((effect) => effect.is(refreshEffect())) ? build(tr.state.doc.toString()) : value,
    provide: (field) => EditorView.decorations.from(field),
  });
}
