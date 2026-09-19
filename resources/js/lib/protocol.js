/**
 * The messages the preview, the overlay host and the Control Panel send each
 * other with `postMessage`, by name — one place, so a misspelt type is a
 * lint failure rather than a click that quietly does nothing.
 *
 * `SOURCE` marks every message as ours; a receiver checks it before reading
 * the rest. `MSG` holds every type the editor sends or handles (measured from
 * the code in WP6c-2; a new message adds a line here first). `CHANNEL` is the
 * two named channels the CP posts publish values on.
 *
 * Names stay the wire strings they always were: nothing in the protocol
 * changed, only where it is written down. The standalone paint script
 * (dock-instant-preview.js) cannot import and keeps its literals.
 *
 * May import: nothing.
 */
export const SOURCE = 'statamic-visual-editor';

export const MSG = Object.freeze({
  ADD_BARD_SET_NATIVE: 'add-bard-set-native',
  ADD_BLOCK_NATIVE: 'add-block-native',
  ADD_ROW: 'add-row',
  ADD_SET: 'add-set',
  AI_TEXT_APPLY: 'ai-text-apply',
  AI_TEXT_DENY: 'ai-text-deny',
  AI_TEXT_GENERATE: 'ai-text-generate',
  AI_TEXT_HELLO: 'ai-text-hello',
  AI_TEXT_MODE: 'ai-text-mode',
  AI_TEXT_OPEN: 'ai-text-open',
  AI_TEXT_READY: 'ai-text-ready',
  AI_TEXT_RESULT: 'ai-text-result',
  AI_TEXT_SET_KEYWORDS: 'ai-text-set-keywords',
  ASSET_EDIT: 'asset-edit',
  BARD_COMMAND: 'bard-command',
  BLOCK_FORMAT: 'block-format',
  CB_ADD_COLUMN: 'cb-add-column',
  CB_COL_WIDTH: 'cb-col-width',
  CLICK: 'click',
  CLOSE_CHROME: 'close-chrome',
  CLOSE_GLOBAL_SECTION: 'close-global-section',
  DUPLICATE_ROW: 'duplicate-row',
  EDIT_CONTROL: 'edit-control',
  EDIT_DENY: 'edit-deny',
  EDIT_END: 'edit-end',
  EDIT_INPUT: 'edit-input',
  EDIT_PENDING: 'edit-pending',
  EDIT_REQUEST: 'edit-request',
  EDIT_START: 'edit-start',
  EXT_DRAG_END: 'ext-drag-end',
  EXT_DRAG_MOVE: 'ext-drag-move',
  EXT_DRAG_START: 'ext-drag-start',
  EXT_DROP: 'ext-drop',
  FOCUS: 'focus',
  FULL_RELOAD: 'full-reload',
  HIDE_ROW: 'hide-row',
  HOVER: 'hover',
  ICON_EDIT: 'icon-edit',
  INSERT_BARD_SET: 'insert-bard-set',
  LINK_EDIT: 'link-edit',
  LP_CLOSE: 'lp-close',
  LP_GOTO: 'lp-goto',
  LP_GOTO_FAILED: 'lp-goto-failed',
  LP_LEAVING: 'lp-leaving',
  LP_READY: 'lp-ready',
  LP_SAVED: 'lp-saved',
  MODE: 'mode',
  MOVE: 'move',
  OPEN_CHROME: 'open-chrome',
  OPEN_CHROME_DESIGNS: 'open-chrome-designs',
  OPEN_CHROME_SETTINGS: 'open-chrome-settings',
  OPEN_COMPONENT: 'open-component',
  OPEN_GLOBAL: 'open-global',
  OPEN_GLOBAL_SECTION: 'open-global-section',
  OPEN_PANEL_FIELD: 'open-panel-field',
  OUTLINE: 'outline',
  OUTLINE_FOCUS: 'outline-focus',
  OUTLINE_WATCH: 'outline-watch',
  POPUP: 'popup',
  REMOVE_ROW: 'remove-row',
  REQUEST_CLOSE_CHROME: 'request-close-chrome',
  REQUEST_CLOSE_GLOBAL: 'request-close-global',
  ROW_CAPS: 'row-caps',
  ROW_CAPS_RESULT: 'row-caps-result',
  SAVE_CHROME: 'save-chrome',
  SAVE_GLOBAL_SECTION: 'save-global-section',
  SAVE_SECTION: 'save-section',
  SECTION_SETTINGS: 'section-settings',
  SVE_ACTIVATE: 'sve-activate',
  SVE_ACTIVATE_TAB: 'sve-activate-tab',
  SVE_CHROME_DIRTY: 'sve-chrome-dirty',
  SVE_CHROME_DIRTY_QUERY: 'sve-chrome-dirty-query',
  SVE_CHROME_SET_STYLE: 'sve-chrome-set-style',
  SVE_COMPONENT_FOCUS: 'sve-component-focus',
  SVE_COMPONENT_MAP: 'sve-component-map',
  SVE_FORCE_EXIT_CHROME: 'sve-force-exit-chrome',
  SVE_FORCE_EXIT_GLOBAL: 'sve-force-exit-global',
  SVE_GLOBAL_DIRTY: 'sve-global-dirty',
  SVE_GLOBAL_DIRTY_QUERY: 'sve-global-dirty-query',
  SVE_GLOBALS_SAVE: 'sve-globals-save',
  SVE_GLOBALS_SAVED: 'sve-globals-saved',
  SVE_GLOBALS_VALUES: 'sve-globals-values',
  SVE_GRID_SPAN: 'sve-grid-span',
  SVE_HTML_PICK: 'sve-html-pick',
  SVE_HTML_PICK_FOCUS: 'sve-html-pick-focus',
  SVE_LOCK_TAB: 'sve-lock-tab',
  SVE_PILL_BOX: 'sve-pill-box',
  SVE_PILL_BOX_REQUEST: 'sve-pill-box-request',
  SVE_RESTORE_CHROME: 'sve-restore-chrome',
  SVE_ROW_LABEL: 'sve-row-label',
  SVE_SECTION_ADD_BLOCK: 'sve-section-add-block',
  SVE_SECTION_FOCUS: 'sve-section-focus',
  SVE_SECTION_PANEL_READY: 'sve-section-panel-ready',
  SVE_SECTION_SET_VALUE: 'sve-section-set-value',
  SVE_SECTION_VALUES: 'sve-section-values',
  SVE_THEME_SCALE: 'sve-theme-scale',
  SVE_THEME_SCALE_VALUES: 'sve-theme-scale-values',
  SVE_UNLOCK_TABS: 'sve-unlock-tabs',
  THEME_SWATCHES: 'theme-swatches',
  THEME_SWATCHES_REQUEST: 'theme-swatches-request',
});

export const CHANNEL = Object.freeze({
  GLOBALS: 'sve.globals',
  SECTIONS: 'sve.sections',
});

/**
 * DOM events the Control Panel bundle sends the standalone paint script,
 * which cannot import. The bundle dispatches these on `document`; the script
 * spells the literal, and tests/js/protocol.test.js keeps the two the same.
 */
export const EVENT = Object.freeze({
  TW_PREVIEW: 'sve:tw-preview',
});
