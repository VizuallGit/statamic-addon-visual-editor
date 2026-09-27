/**
 * What to suggest in the Styles tab's editor.
 *
 * The editor holds a rule's *body* — what goes between `{` and `}` — with no
 * selector around it. CodeMirror's own CSS completion reads the syntax tree,
 * and a bare `background` at the top level parses as a selector, not as a
 * declaration, so it offers nothing where it is needed most. This source
 * decides from the line instead: before a colon a property is wanted, after
 * one a value, and inside `var(` one of the theme's own tokens.
 *
 * Pure: it is handed the tokens rather than reaching for the store, so it can
 * be tested without a panel.
 */

/** The properties worth offering — the ones a theme's own classes use. */
const PROPERTIES = [
  'align-content', 'align-items', 'align-self', 'animation', 'aspect-ratio', 'backdrop-filter',
  'background', 'background-attachment', 'background-blend-mode', 'background-clip', 'background-color',
  'background-image', 'background-position', 'background-repeat', 'background-size', 'block-size',
  'border', 'border-block', 'border-bottom', 'border-color', 'border-inline', 'border-left',
  'border-radius', 'border-right', 'border-style', 'border-top', 'border-width', 'bottom',
  'box-shadow', 'box-sizing', 'clip-path', 'color', 'column-gap', 'columns', 'container-type',
  'content', 'cursor', 'display', 'filter', 'flex', 'flex-basis', 'flex-direction', 'flex-grow',
  'flex-shrink', 'flex-wrap', 'float', 'font', 'font-family', 'font-feature-settings', 'font-size',
  'font-style', 'font-variation-settings', 'font-weight', 'gap', 'grid-area', 'grid-auto-columns',
  'grid-auto-flow', 'grid-auto-rows', 'grid-column', 'grid-row', 'grid-template-areas',
  'grid-template-columns', 'grid-template-rows', 'height', 'inline-size', 'inset', 'isolation',
  'justify-content', 'justify-items', 'justify-self', 'left', 'letter-spacing', 'line-height',
  'list-style', 'margin', 'margin-block', 'margin-bottom', 'margin-inline', 'margin-left',
  'margin-right', 'margin-top', 'mask', 'max-block-size', 'max-height', 'max-inline-size',
  'max-width', 'min-block-size', 'min-height', 'min-inline-size', 'min-width', 'mix-blend-mode',
  'object-fit', 'object-position', 'opacity', 'order', 'outline', 'outline-offset', 'overflow',
  'overflow-x', 'overflow-y', 'padding', 'padding-block', 'padding-bottom', 'padding-inline',
  'padding-left', 'padding-right', 'padding-top', 'place-content', 'place-items', 'place-self',
  'pointer-events', 'position', 'right', 'rotate', 'row-gap', 'scale', 'scroll-behavior',
  'scroll-snap-align', 'scroll-snap-type', 'text-align', 'text-decoration', 'text-transform',
  'text-wrap', 'top', 'transform', 'transition', 'translate', 'user-select', 'vertical-align',
  'visibility', 'white-space', 'width', 'word-break', 'writing-mode', 'z-index',
];

/** A few values where guessing the spelling is the annoying part. */
const VALUES = {
  'align-items': ['center', 'flex-start', 'flex-end', 'stretch', 'baseline'],
  'background-repeat': ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'],
  'background-size': ['cover', 'contain', 'auto'],
  'border-style': ['solid', 'dashed', 'dotted', 'none'],
  'box-sizing': ['border-box', 'content-box'],
  'container-type': ['inline-size', 'size', 'normal'],
  cursor: ['pointer', 'default', 'not-allowed', 'grab', 'text'],
  display: ['block', 'flex', 'grid', 'inline', 'inline-block', 'inline-flex', 'contents', 'none'],
  'flex-direction': ['row', 'column', 'row-reverse', 'column-reverse'],
  'flex-wrap': ['wrap', 'nowrap', 'wrap-reverse'],
  'font-style': ['normal', 'italic'],
  'font-weight': ['400', '500', '600', '700', '800', '900', 'bold', 'normal'],
  'justify-content': ['center', 'space-between', 'space-around', 'space-evenly', 'flex-start', 'flex-end'],
  'mix-blend-mode': ['multiply', 'screen', 'overlay', 'color', 'difference', 'normal'],
  'object-fit': ['cover', 'contain', 'fill', 'none', 'scale-down'],
  overflow: ['hidden', 'auto', 'scroll', 'visible', 'clip'],
  'pointer-events': ['none', 'auto'],
  position: ['relative', 'absolute', 'fixed', 'sticky', 'static'],
  'text-align': ['left', 'center', 'right', 'justify'],
  'text-decoration': ['none', 'underline', 'line-through'],
  'text-transform': ['uppercase', 'lowercase', 'capitalize', 'none'],
  'text-wrap': ['balance', 'pretty', 'nowrap', 'wrap'],
  'white-space': ['nowrap', 'pre', 'pre-wrap', 'normal'],
};

/** The line up to the cursor, and the declaration it belongs to. */
export function contextAt(text, pos) {
  const from = Math.max(text.lastIndexOf('\n', pos - 1) + 1, text.lastIndexOf(';', pos - 1) + 1, text.lastIndexOf('{', pos - 1) + 1);
  const head = text.slice(from, pos);
  const open = head.lastIndexOf('var(');
  const close = head.lastIndexOf(')');

  if (open !== -1 && open > close) {
    return { kind: 'token', word: head.slice(open + 4).trim(), from: from + open + 4 };
  }

  const colon = head.indexOf(':');
  const before = colon === -1 ? '' : head.slice(0, colon).trim();

  // `&:hover` and `.card:first-child` carry a colon too, and neither is a
  // declaration. Only a name CSS would read as a property opens a value.
  if (colon === -1 || !/^-{0,2}[a-z][a-z0-9-]*$/i.test(before)) {
    const word = head.trim();

    return { kind: 'property', word, from: pos - word.length };
  }

  const value = head.slice(colon + 1);
  const word = /[\w-]*$/.exec(value)?.[0] || '';

  return { kind: 'value', property: before, word, from: pos - word.length };
}

/**
 * A CodeMirror completion source. `tokens()` gives the theme's own custom
 * property names, with or without the leading dashes.
 */
export function cssCompletions(tokens = () => []) {
  return (context) => {
    const text = context.state.doc.toString();
    const at = contextAt(text, context.pos);

    if (at.kind === 'token') {
      const options = tokens().map((name) => {
        const n = String(name).replace(/^--/, '');

        return { label: `--${n}`, type: 'variable' };
      });

      return options.length ? { from: at.from, options, validFor: /^-*[\w-]*$/ } : null;
    }

    if (at.kind === 'value') {
      const known = VALUES[at.property] || [];
      const options = [
        ...known.map((label) => ({ label, type: 'keyword' })),
        { label: 'var(', type: 'function', apply: 'var(--' },
      ];

      if (!at.word && !known.length) {
        return null;
      }

      return { from: at.from, options, validFor: /^[\w-]*$/ };
    }

    // A property is only wanted where one could stand: not mid-word in a
    // selector the designer typed on purpose, and not on an explicit ask
    // with nothing typed at all.
    if (!at.word && !context.explicit) {
      return null;
    }

    if (!/^[a-z-]*$/i.test(at.word)) {
      return null;
    }

    return {
      from: at.from,
      options: PROPERTIES.map((label) => ({ label, type: 'property', apply: `${label}: ` })),
      validFor: /^[\w-]*$/,
    };
  };
}

export const CSS_PROPERTIES = PROPERTIES;
