/**
 * Shared mutable state of code-dock, one object so every region can read and
 * write it. Hoisted by scripts/hoist-state.mjs; the initialisers are the original ones.
 *
 * May import: nothing.
 */
export const dockState = {
  cssColorsPromise: null,
  lastUid: null,
  lastType: null,
  typeStack: [],
  lastParts: { html: '', css: '', js: '' },
  lastProps: [],
  propsDirty: false,
  lastLocked: false,
  lockReady: false,
  lastWin: null,
  loadGen: 0,
  saveTimer: null,
  lastBracketNames: null,
  lastCssSelectorNames: null,
  saveInFlight: null,
  // The fetch of the file the dock was just asked to open; null once it has landed.
  loadInFlight: null,
  dragging: false,
  applying: false,
  htmlScopePref: true,
  htmlScopeActive: false,
  styleMode: 'css',
  cssToolRow: null,
  cssOpenTool: '',
  cssOpenMenu: '',
  cssValues: false,
  twCss: null,
  twKey: '',
  twBusy: false,
  twDirty: false,
  htmlFocus: null,
  // Which element the CSS pane is showing, when that is not the same as the
  // HTML pane's range. `htmlFocus` cannot answer this: it is the slice the
  // HTML pane renders AND the interval its text is spliced back into, so
  // moving it moves the code under the reader and writes to the wrong place.
  cssFocus: null,
  htmlFull: '',
  cssFull: '',
  cssPane: 'full',
  cssScopeSnapshot: '',
  layoutObserver: null,
  layoutWin: null,
  observedEditor: null,
  observedRight: null,
  layoutWatchBound: false,
  cssSize: '',
  cssState: '',
  cssOwnFolds: new Set(),
  cssFoldSig: '',
  htmlPartialUi: null,
  htmlAntlersUi: null,
  htmlClassTokenUi: null,
  htmlLintUi: null,
  cssGhostUi: null,
};
