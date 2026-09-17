/**
 * CodeMirror 6, loaded once for every editor the addon draws: the template
 * dock, the site CSS pane and the file manager.
 *
 * Each of them used to import its own subset of the packages and carry its own
 * copy of the VS Code-like theme. Now there is one loader and one theme.
 *
 *   loadCodeMirror()          Promise of the package namespaces, cached. The
 *                             packages stay dynamic imports, so none of this
 *                             lands in the main bundle; Vite splits them into
 *                             chunks the editors share.
 *   vscTheme(cm, options)     The two extensions every editor adds last: the
 *                             dark editor theme and the syntax colours. Options
 *                             are the few things the editors differ on.
 *
 * May import: npm packages only.
 */
let ready = null;

export function loadCodeMirror() {
  if (ready) {
    return ready;
  }

  ready = Promise.all([
    import('@codemirror/view'),
    import('@codemirror/state'),
    import('@codemirror/commands'),
    import('@codemirror/autocomplete'),
    import('@codemirror/lang-html'),
    import('@codemirror/lang-css'),
    import('@codemirror/lang-javascript'),
    import('@codemirror/language'),
    import('@lezer/highlight'),
  ])
    .then(([view, state, commands, autocomplete, langHtml, langCss, langJs, language, highlight]) => ({
      view,
      state,
      commands,
      autocomplete,
      langHtml,
      langCss,
      langJs,
      language,
      highlight,
    }))
    .catch((err) => {
      // Let the next call try again rather than caching the failure.
      ready = null;
      throw err;
    });

  return ready;
}

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

/**
 * @param {Awaited<ReturnType<typeof loadCodeMirror>>} cm
 * @param {object} [options]
 * @param {string} [options.height]      editor height: '100%' in a pane, 'auto' in the dock
 * @param {string} [options.background]  editor and gutter background
 * @param {object} [options.scroller]    `.cm-scroller` rules
 * @param {(tags: object) => Array} [options.extraTags]  syntax colours this editor adds
 */
export function vscTheme(cm, options = {}) {
  const {
    height = '100%',
    background = '#1E1E21',
    scroller = { overflow: 'auto', height: '100%', minHeight: 0 },
    extraTags = () => [],
  } = options;
  const { EditorView } = cm.view;
  const { HighlightStyle, syntaxHighlighting } = cm.language;
  const { tags } = cm.highlight;

  return [
    EditorView.theme(
      {
        '&': { height, backgroundColor: background, color: '#d4d4d4' },
        '.cm-content': {
          caretColor: '#aeafad',
          padding: '12px 0',
          fontFamily: MONO,
          fontSize: '13px',
          lineHeight: '1.55',
        },
        '.cm-cursor': { borderLeftColor: '#aeafad' },
        '.cm-activeLine': { backgroundColor: '#ffffff0d' },
        '.cm-activeLineGutter': { backgroundColor: '#ffffff0d' },
        '.cm-gutters': {
          backgroundColor: background,
          color: '#858585',
          border: 'none',
          borderRight: '1px solid #3c3c3c',
          fontFamily: MONO,
          fontSize: '13px',
          lineHeight: '1.55',
        },
        '.cm-lineNumbers .cm-gutterElement': { paddingLeft: '8px', paddingRight: '12px' },
        '.cm-scroller': scroller,
        '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
          backgroundColor: '#264f78 !important',
        },
      },
      { dark: true }
    ),
    syntaxHighlighting(
      HighlightStyle.define([
        { tag: tags.keyword, color: '#569cd6' },
        { tag: tags.string, color: '#ce9178' },
        { tag: tags.comment, color: '#6a9955', fontStyle: 'italic' },
        { tag: tags.number, color: '#b5cea8' },
        { tag: tags.className, color: '#d7ba7d' },
        { tag: tags.propertyName, color: '#9cdcfe' },
        { tag: tags.variableName, color: '#9cdcfe' },
        { tag: tags.unit, color: '#b5cea8' },
        { tag: tags.color, color: '#ce9178' },
        { tag: tags.bracket, color: '#ffd700' },
        { tag: tags.punctuation, color: '#d4d4d4' },
        { tag: tags.operator, color: '#d4d4d4' },
        { tag: tags.definition(tags.propertyName), color: '#9cdcfe' },
        ...extraTags(tags),
      ])
    ),
  ];
}
