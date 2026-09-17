/**
 * code-dock.js — region "editor", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel code-dock.js for what the shell exports.
 */
import { SUNDAY_AUG30 } from '../sunday-aug30.js';
import { emit } from '../cp/bus.js';
import { antlersDecorations } from '../antlers-highlight.js';
import { emptySizeBlocks, idRulesForSize } from '../css-sizes.js';
import { expandHtmlTab, htmlEmmetExtensions } from '../html-emmet.js';
import { htmlTagSync } from '../html-tag-sync.js';
import { partialDecorations } from '../dock-partials.js';
import { classTokenDecorations } from '../dock-class-tokens.js';
import { tailwindClassCompletions, tailwindHoverExtension } from '../tailwind-complete.js';
import { vscTheme } from '../lib/codemirror.js';
import { dock } from '../dock/state.js';
import { Decoration, EditorState, EditorView, RangeSetBuilder, StateEffect, StateField, autocompletion, closeBrackets, closeBracketsKeymap, cm, codeFolding, completionKeymap, defaultKeymap, editableOf, editors, highlightActiveLine, highlightActiveLineGutter, history, historyKeymap, hoverTooltip, htmlLanguage, indentWithTab, keymap, lineNumbers, readOnlyOf, tags } from '../code-dock.js';
import { applyCssFolds, cssSizeRows } from './css-sizes.js';
import { flushSave, onEditorInput } from './save.js';
import { languageOf } from './layout.js';
import { flushBracketSync, flushCssToHtml } from './scope.js';
import { paintCssToolState } from './css-tools.js';
import { paintHtmlToolState } from './html-tools.js';
import { paintAlpine } from './alpine.js';
import { syncTwTarget } from './style-modes.js';

// ===== editor =====
/**
 * Draw a size block nobody has written in yet as not-yet-written.
 *
 * It is in the editor, it takes the cursor, you can type in it — but it is
 * faded, because it is not in the file and will not be unless something is
 * put in it. The moment a declaration lands, it is no longer empty, the fade
 * goes, and it saves with everything else. Nothing to confirm, nothing to
 * clean up: the rule is simply "an empty one does not count".
 */
function cssGhostExtension() {
  if (dock.cssGhostUi) {
    return dock.cssGhostUi;
  }

  const mark = Decoration.mark({ class: 'sve-css-ghost' });

  const build = (state) => {
    const builder = new RangeSetBuilder();

    if (!dock.lastWin) {
      return builder.finish();
    }

    try {
      for (const range of emptySizeBlocks(state.doc.toString(), cssSizeRows(dock.lastWin))) {
        builder.add(range.from, range.to, mark);
      }
    } catch {
      /* half-typed CSS must not take the pane down */
    }

    return builder.finish();
  };

  dock.cssGhostUi = StateField.define({
    create: (state) => build(state),
    update: (value, tr) => (tr.docChanged ? build(tr.state) : value),
    provide: (field) => EditorView.decorations.from(field),
  });

  return dock.cssGhostUi;
}

let cssIdUi = null;
let cssIdEffect = null;

/**
 * Draw the rule you are writing in while the ID is showing.
 *
 * The ID layer is one rule among the design's many, and a fold opening is a
 * quiet thing to happen in a file this long. So it is marked for as long as it
 * is on screen — a line down its left edge and a ground of its own — and "I am
 * writing in the ID now" is something you see rather than work out.
 */
function cssIdExtension() {
  if (cssIdUi) {
    return cssIdUi;
  }

  cssIdEffect = StateEffect.define();

  const line = Decoration.line({ class: 'sve-css-id' });

  const build = (state) => {
    const builder = new RangeSetBuilder();

    if (!dock.lastWin || !dock.cssValues) {
      return builder.finish();
    }

    try {
      const doc = state.doc;

      for (const node of idRulesForSize(doc.toString(), cssSizeRows(dock.lastWin), dock.cssSize)) {
        const first = doc.lineAt(Math.min(node.from, doc.length)).number;
        const last = doc.lineAt(Math.min(Math.max(node.to - 1, node.from), doc.length)).number;

        for (let n = first; n <= last; n += 1) {
          builder.add(doc.line(n).from, doc.line(n).from, line);
        }
      }
    } catch {
      /* half-typed CSS must not take the pane down */
    }

    return builder.finish();
  };

  cssIdUi = StateField.define({
    create: (state) => build(state),
    update: (value, tr) => (
      tr.docChanged || tr.effects.some((effect) => effect.is(cssIdEffect))
        ? build(tr.state)
        : value
    ),
    provide: (field) => EditorView.decorations.from(field),
  });

  return cssIdUi;
}

/**
 * Redraw the marking after something other than the text moved it.
 *
 * The field follows the document on its own. The button and the size row move
 * which rule is meant without touching a character, and that is what this is
 * for.
 */
export function paintCssIdMark() {
  if (cssIdEffect && editors.css) {
    editors.css.dispatch({ effects: cssIdEffect.of(null) });
  }
}

function partialUi() {
  if (!dock.htmlPartialUi) {
    dock.htmlPartialUi = partialDecorations({
      Decoration,
      StateField,
      StateEffect,
      RangeSetBuilder,
      EditorView,
    });
  }

  return dock.htmlPartialUi;
}

function antlersUi() {
  if (!dock.htmlAntlersUi) {
    dock.htmlAntlersUi = antlersDecorations({
      Decoration,
      StateField,
      RangeSetBuilder,
      EditorView,
    });
  }

  return dock.htmlAntlersUi;
}

function classTokenUi() {
  if (!dock.htmlClassTokenUi) {
    dock.htmlClassTokenUi = classTokenDecorations({
      Decoration,
      StateField,
      StateEffect,
      RangeSetBuilder,
      EditorView,
    });
  }

  return dock.htmlClassTokenUi;
}

export function mountEditor(win, handle, parent) {
  editors[handle]?.destroy();

  const saveKey = keymap.of([
    {
      key: 'Mod-s',
      run: () => {
        flushSave(win.document);

        return true;
      },
    },
  ]);

  editors[handle] = new EditorView({
    state: EditorState.create({
      doc: '',
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        languageOf(handle),
        closeBrackets(),
        autocompletion({ tooltipClass: () => 'sve-tw-complete' }),
        ...(handle === 'html'
          ? [
              htmlLanguage.data.of({
                autocomplete: tailwindClassCompletions(win),
              }),
              tailwindHoverExtension(hoverTooltip, win),
            ]
          : []),
        ...(handle === 'html' ? [...htmlEmmetExtensions(), htmlTagSync()] : []),
        // Only the CSS pane folds, and only this code folds it: the size row
        // puts the other sizes away rather than cutting them out of the text.
        // Folding is reversible and lossless, which rewriting the pane is not.
        ...(handle === 'css' ? [codeFolding(), cssGhostExtension(), cssIdExtension()] : []),
        keymap.of([
          ...defaultKeymap,
          ...(handle === 'html' ? [{ key: 'Tab', run: expandHtmlTab }] : []),
          indentWithTab,
          ...historyKeymap,
          ...completionKeymap,
          ...closeBracketsKeymap,
        ]),
        saveKey,
        EditorView.lineWrapping,
        ...(handle === 'html' || handle === 'css'
          ? partialUi().extensions
          : []),
        ...(handle === 'html' ? antlersUi().extensions : []),
        ...(SUNDAY_AUG30 && handle === 'html' ? classTokenUi().extensions : []),
        readOnlyOf[handle].of(EditorState.readOnly.of(!!dock.lastLocked)),
        editableOf[handle].of(EditorView.editable.of(!dock.lastLocked)),
        EditorView.updateListener.of((update) => {
          if (SUNDAY_AUG30 && handle === 'html' && update.docChanged && !dock.applying) {
            flushBracketSync(win);
            emit('dock:html-changed');
          }

          if (SUNDAY_AUG30 && handle === 'css' && update.docChanged && !dock.applying) {
            flushCssToHtml();
          }

          if (update.docChanged) {
            onEditorInput(win);
          }

          if (handle === 'css' && (update.docChanged || update.selectionSet)) {
            paintCssToolState(win);
          }

          // A size block that was just written has to be put away like the
          // ones that were already there — including one an undo brought back.
          if (handle === 'css' && update.docChanged && !dock.applying) {
            applyCssFolds(win);
          }

          if (handle === 'html' && (update.docChanged || update.selectionSet)) {
            paintHtmlToolState(win);
            paintAlpine(win);

            if (!dock.applying) {
              syncTwTarget(win);
            }
          }
        }),
        ...vscTheme(cm, {
          height: 'auto',
          background: '#1E1E21',
          scroller: { overflow: 'visible', height: 'auto', minHeight: 0 },
          extraTags: (tags) => [
            { tag: tags.tagName, color: '#4ec9b0' },
            { tag: tags.attributeName, color: '#9cdcfe' },
            { tag: tags.attributeValue, color: '#ce9178' },
            { tag: tags.angleBracket, color: '#808080' },
          ],
        }),
      ],
    }),
    parent,
  });
}

export function paintHostWait(host) {
  if (!host || host.querySelector('.cm-editor')) {
    return;
  }

  host.replaceChildren();

  const spin = host.ownerDocument.createElement('span');

  spin.style.cssText =
    'width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite';
  host.appendChild(spin);
}
