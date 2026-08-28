/**
 * Settings toggle: `panel`
 * Page settings panel Hide/Auto/Show.
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { sve } from './cp-registry.js';
import { t } from './cp-t.js';
import { sveState } from './cp-state.js';
import { SELECTORS } from './cp-selectors.js';
import { COMMENTS_BADGE_ACTIVE_BG, COMMENTS_BADGE_FG, COMMENTS_BADGE_IDLE_TYPE, LP_BACK_ID, LP_CHROME_H, LP_CONTROL_H, LP_CONTROL_PAD, LP_PREVIEW_CHROME_ID, LP_TOOLBAR_GAP, setHeaderTab } from './cp.js';
import { persistVisibleRightPanes, visiblePaneKeys } from './right-dock.js';
import { chromeGet, chromeRemove, chromeSet } from './chrome-prefs.js';
import { LP_MORE_ID } from './lp-more-menu.js';

// ===== lp-panel =====
// --- Live Preview: collapsible editor panel ----------------------------------
//
// Inline editing makes the publish form optional for everyday text tweaks, so
// the editor pane starts collapsed — the preview gets the full width. A toggle
// button injected into the live-preview header brings it back.
//
// Collapsing moves the pane off-screen (position:absolute; left:-10000px)
// instead of display:none: the pane keeps real layout, which the column
// builder's popup-opening machinery depends on (with display:none its
// components report zero rects and the popup silently fails to open). The
// popup itself portals to document.body, so it shows fine while collapsed.

export const LP_TOGGLE_ID = '__sve-lp-toggle';
export const LP_MODE_ID = '__sve-lp-mode';
export const LP_MODE_KEY = 'sve-lp-panel-mode';
export const LP_COLLAPSED_KEY = 'sve-lp-collapsed';
export const LP_DOCKED_KEY = 'sve-lp-docked';
export const KEEP_CHROME_KEY = 'sve-keep-chrome';

export const LP_WIDTH_ID = '__sve-lp-width';
export const LP_WIDTH_GROUP_ID = '__sve-lp-width-group';

/**
 * Statamics egen nøgle, og med vilje.
 *
 * Panelets bredde trækkes også med håndtaget, og den ende gemmer her. Deler de
 * to ikke nøgle, ville et klik og et træk skrive hver sit sted, og den der blev
 * læst ved næste åbning ville være den der tilfældigvis blev læst først. Med
 * samme nøgle er der én bredde: knapperne sætter den, håndtaget sætter den, og
 * den der står, er den man sidst valgte — uanset hvordan.
 */
export const LP_WIDTH_KEY = 'statamic.live-preview.editor-width';

/** Same rem bounds on the left editor and the right dock. */
export const LP_SIDE_MIN_REM = 16;
export const LP_SIDE_MAX_REM = 50;
export const LP_SIDE_DEFAULT_REM = 22;


// The panel runs in one of three modes, chosen in the header and remembered
// across sessions:
//   hide — never opens, not even when something in the preview is clicked
//   auto — closed until something in the preview is clicked, then opens on it
//   show — always open
export const LP_MODES = ['hide', 'auto', 'show'];
export const LP_MODE_LABELS = { hide: 'Hidden', auto: 'Auto', show: 'Visible' };

/**
 * Flat Save & Publish blue — lightest stop from Statamic’s primary gradient
 * (from-primary/90), no border / shadow / gradient.
 */
export const LP_PRIMARY_FLAT =
  'color-mix(in oklab, var(--theme-color-primary, #4f46e5) 90%, transparent)';

/** Idle icon opacity — same for toolbar + device chrome. */
export const LP_ICON_IDLE_OPACITY = '0.7';

/**
 * A tool that cannot be used from where you are.
 *
 * Far enough below idle to read as off at a glance, not so far that the row
 * looks like it lost an icon — the bar keeps its shape, so nothing shifts under
 * the pointer on the way into a header and back out again.
 */
export const LP_ICON_LOCKED_OPACITY = '0.25';

/** Paint a framed control as selected (flat primary) or idle. */
export function paintLpActiveControl(btn, on) {
  const wantBg = on ? LP_PRIMARY_FLAT : 'transparent';
  const wantFg = on ? '#fff' : 'currentColor';
  const wantOpacity = on ? '1' : LP_ICON_IDLE_OPACITY;

  if (btn.style.background !== wantBg) {
    btn.style.background = wantBg;
  }

  if (btn.style.color !== wantFg) {
    btn.style.color = wantFg;
  }

  if (btn.style.opacity !== wantOpacity) {
    btn.style.opacity = wantOpacity;
  }

  if (btn.style.border && btn.style.border !== 'none' && btn.style.border !== '0px') {
    btn.style.border = 'none';
  }

  if (btn.style.boxShadow && btn.style.boxShadow !== 'none') {
    btn.style.boxShadow = 'none';
  }

  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
}

/**
 * Flat primary fill matching our chrome pills — kills Statamic’s gradient + border
 * on the Live Preview “Save & Publish” (and plain “Save”) header button.
 */
export function isLpSaveLabel(text) {
  const t = (text || '').replace(/\s+/g, ' ').trim();

  return (
    /save\s*&\s*publish|gem\s*&\s*public|save\s*and\s*publish|gem og public/i.test(t) ||
    /^(save|gem)(\s+changes|\s+ændringer)?$/i.test(t)
  );
}

export function isLpPublishLabel(text) {
  const t = (text || '').replace(/\s+/g, ' ').trim();

  return /^(publish|publicér|publicer)(\.\.\.|…)?$/i.test(t);
}

export function findLpSaveButton(header) {
  if (!header) {
    return null;
  }

  let save = null;

  header.querySelectorAll('button').forEach((btn) => {
    if (btn.id === LP_BACK_ID || btn.id === LP_MORE_ID || btn.hasAttribute('data-sve-statamic-lp-close')) {
      return;
    }

    if (isLpSaveLabel(btn.textContent || '')) {
      save = btn;
    }
  });

  return save;
}

/** Save, or Publish when Save & Publish is split (revisions). */
export function findLpRightActionTail(header) {
  if (!header) {
    return null;
  }

  let tail = findLpSaveButton(header);

  header.querySelectorAll('button').forEach((btn) => {
    if (btn.id === LP_BACK_ID || btn.id === LP_MORE_ID || btn.hasAttribute('data-sve-statamic-lp-close')) {
      return;
    }

    if (isLpPublishLabel(btn.textContent || '')) {
      tail = btn;
    }
  });

  return tail;
}

/**
 * Ét flex-gap mellem devices | zoom | Save | close.
 * Statamics egen × havde `ml-auto` der skubbede højre-gruppen ud —
 * den er skjult, så vi sætter `ml-auto` på chrome (eller Save) i stedet.
 * Ellers lander Save/Publish/Close til venstre med et hul foran vores ×.
 */
export function syncLpRightBarGaps(win) {
  const doc = win.document;
  const header = sve.lpHeader(doc);
  const chrome = doc.getElementById(LP_PREVIEW_CHROME_ID);
  const back = doc.getElementById(LP_BACK_ID);
  const save = findLpSaveButton(header);

  if (!header || !save) {
    return;
  }

  const parent = save.parentElement || header;
  const gap = `${LP_TOOLBAR_GAP}px`;
  const rightLead = chrome && parent.contains(chrome) ? chrome : save;

  if (parent.style.display !== 'inline-flex' && parent.style.display !== 'flex') {
    parent.style.display = 'inline-flex';
  }

  parent.style.alignItems = 'center';
  parent.style.gap = gap;

  // Skub hele højre-klyngen ud — også når Save er direkte barn af headeren.
  if (parent === header) {
    rightLead.style.setProperty('margin-left', 'auto', 'important');
  } else if (parent.style.marginLeft !== 'auto') {
    parent.style.marginLeft = 'auto';
  }

  // Rækkefølge: chrome → save → [publish] → back.
  if (chrome) {
    if (chrome.parentElement !== parent || chrome.nextElementSibling !== save) {
      parent.insertBefore(chrome, save);
    }

    chrome.style.marginRight = '0';
    chrome.style.gap = gap;

    if (rightLead !== chrome) {
      chrome.style.marginLeft = '0';
    }
  }

  const actionTail = findLpRightActionTail(header) || save;

  if (back) {
    if (back.parentElement !== parent || back.previousElementSibling !== actionTail) {
      actionTail.after(back);
    }

    back.style.marginLeft = '0';
    back.style.marginRight = '0';
  }

  const more = doc.getElementById(LP_MORE_ID);

  if (more && back) {
    if (more.parentElement !== parent || more.previousElementSibling !== back) {
      back.after(more);
    }

    more.style.marginLeft = '0';
    more.style.marginRight = '0';
  }

  // Save må ikke selv have ml-auto (det ville skubbe Publish væk fra Save).
  if (rightLead !== save) {
    save.style.setProperty('margin-left', '0', 'important');
  }

  save.style.setProperty('margin-right', '0', 'important');
}

export function paintLpSaveButton(win) {
  const header = sve.lpHeader(win.document);

  if (!header) {
    return;
  }

  const buttons = [...header.querySelectorAll('button')];
  const hasPublish = buttons.some((btn) => isLpPublishLabel(btn.textContent || ''));

  buttons.forEach((btn) => {
    const text = (btn.textContent || '').replace(/\s+/g, ' ').trim();
    const isSave = isLpSaveLabel(text);
    const isPublish = isLpPublishLabel(text);

    if (!isSave && !isPublish) {
      return;
    }

    // Split Save + Publish: Publish is the action. Save Changes is a quiet write.
    // Combined "Save & Publish" stays the primary button.
    const highlight = isPublish || (isSave && !hasPublish);
    const idleSurface = 'rgba(128,128,128,.16)';

    btn.style.setProperty(
      'background',
      highlight ? LP_PRIMARY_FLAT : idleSurface,
      'important'
    );
    btn.style.setProperty('background-image', 'none', 'important');
    btn.style.setProperty('color', highlight ? '#fff' : 'currentColor', 'important');
    btn.style.setProperty('opacity', highlight ? '1' : LP_ICON_IDLE_OPACITY, 'important');
    btn.style.setProperty('border', 'none', 'important');
    btn.style.setProperty('box-shadow', 'none', 'important');
    btn.style.setProperty('border-radius', '0.5rem', 'important');
    btn.style.setProperty('height', `${LP_CHROME_H}px`, 'important');
    btn.style.setProperty('box-sizing', 'border-box', 'important');
    btn.style.setProperty('margin-right', '0', 'important');
  });
}

/** Så svag som en streg kan være og stadig dele to ord. */
export const LP_SEP_OPACITY = '.15';

/**
 * Topbarens egen baggrundsfarve, aflæst frem for gættet.
 *
 * Den valgte tilstand og sømmen efter ikonet er ikke grå oven på baren — de er
 * baren, der kommer til syne gennem kontrollen. Så farven skal være nøjagtig
 * dens, og den skifter med CP'ets tema. Derfor aflæses den, og der ledes opad
 * indtil noget er helt uigennemsigtigt: headeren selv er ofte gennemsigtig og
 * låner farven fra modalen bagved.
 */
export function lpHeaderBg(win) {
  const header = sve.lpHeader(win.document);

  if (!header) {
    return null;
  }

  if (sveState.lpHeaderBgCache?.el === header) {
    return sveState.lpHeaderBgCache.value;
  }

  let el = header;
  let value = null;

  while (el && !value) {
    const bg = win.getComputedStyle(el).backgroundColor;
    const alpha = bg?.startsWith('rgba') ? Number(bg.split(',')[3]?.replace(')', '')) : bg ? 1 : 0;

    if (alpha >= 0.99) {
      value = bg;
    }

    el = el.parentElement;
  }

  sveState.lpHeaderBgCache = { el: header, value };

  return value;
}

/**
 * Den tynde streg mellem to kontroller i samme gruppe.
 *
 * `data-sep-before` er navnet på det der står til højre for stregen; det til
 * venstre findes ud fra rækkefølgen. Det er nok til at afgøre om stregen støder
 * op til noget der har sin egen flade og derfor skal gemmes — se
 * sve.ensureLpPanelToggle. Uden navn er den bare en streg og bliver stående.
 */
export function lpModeSeparator(doc, before) {
  const sep = doc.createElement('span');

  if (before) {
    sep.dataset.sepBefore = before;
  }

  // Ingen egne marginer: knappernes luft er allerede der, og stregen står midt
  // i den. Lægger man mere til, falder ordene fra hinanden.
  sep.style.cssText =
    'display:block;flex:0 0 auto;width:1px;height:.625rem;' +
    `background:currentColor;opacity:${LP_SEP_OPACITY};transition:opacity .12s ease;`;

  return sep;
}

// Collapse state for the current Live Preview session (auto mode moves it at
// runtime). null = not initialized (live preview closed); derived from the
// stored mode on next mount.

/** Snapshot: they had the editor sidebar closed when this Live Preview opened. */

// Set while a section's settings are on show — see sve.ensureLpPanelToggle.

export function lpMode(win) {
  const stored = chromeGet(win, LP_MODE_KEY);

  if (stored === 'auto' || !LP_MODES.includes(stored)) {
    return 'hide';
  }

  return stored;
}

/** True while a page change is in flight — the next editor should keep the bar as it was. */
export function shouldKeepChrome(win) {
  try {
    return win.sessionStorage.getItem(KEEP_CHROME_KEY) === '1';
  } catch {
    return false;
  }
}

export function storedLpCollapsed(win) {
  const stored = chromeGet(win, LP_COLLAPSED_KEY);

  if (stored === '1' || stored === '0') {
    return stored === '1';
  }

  return lpMode(win) !== 'show';
}

export function persistDockedPanel(win) {
  if (!sve.lpHeader(win.document)) {
    return;
  }

  const keys = visiblePaneKeys(win);

  persistVisibleRightPanes(win, keys);

  let value = '';

  if (keys.includes('listview')) {
    value = 'listview';
  } else if (keys.includes('sections')) {
    value = 'sections';
  } else if (keys.includes('comments')) {
    value = 'comments';
  } else if (keys.includes('ai')) {
    value = 'ai';
  }

  if (value) {
    chromeSet(win, LP_DOCKED_KEY, value);
  } else {
    chromeRemove(win, LP_DOCKED_KEY);
  }
}

export function setLpMode(win, mode) {
  chromeSet(win, LP_MODE_KEY, mode);

  // An explicit Show/Hide click is the user's choice — do not keep slamming
  // the sidebar shut because it happened to be closed when Live Preview opened.
  sveState.lpEnterSidebarClosed = false;

  // Switching to Show reveals the FULL form, like the old open-toggle did.
  if (mode === 'show') {
    sve.clearSolo(win.document);
    setHeaderTab(win, 'settings');
  } else if (sveState.headerTab === 'settings') {
    setHeaderTab(win, null);
  }

  setLpCollapsed(win, mode !== 'show');
}

/**
 * A preview interaction (clicking a section, an inline field, …) wants the
 * panel open. Whether it gets it depends on the mode — in `hide` it never does.
 * Returns whether the panel is (now) available.
 */
export function autoOpenPanel(win) {
  return sveState.lpCollapsed === false;
}

export function setLpCollapsed(win, collapsed) {
  sveState.lpCollapsed = collapsed;
  chromeSet(win, LP_COLLAPSED_KEY, collapsed ? '1' : '0');

  if (collapsed && sve.isGlobalsOverlayOpen?.(win)) {
    sve.hideGlobalsPanel(win, { release: false });
  }

  sve.ensureLpPanelToggle(win);
}



sve.LP_TOGGLE_ID = LP_TOGGLE_ID;
sve.LP_MODE_ID = LP_MODE_ID;
sve.LP_MODE_KEY = LP_MODE_KEY;
sve.LP_COLLAPSED_KEY = LP_COLLAPSED_KEY;
sve.LP_DOCKED_KEY = LP_DOCKED_KEY;
sve.KEEP_CHROME_KEY = KEEP_CHROME_KEY;
sve.LP_WIDTH_ID = LP_WIDTH_ID;
sve.LP_WIDTH_GROUP_ID = LP_WIDTH_GROUP_ID;
sve.LP_WIDTH_KEY = LP_WIDTH_KEY;
sve.LP_SIDE_MIN_REM = LP_SIDE_MIN_REM;
sve.LP_SIDE_MAX_REM = LP_SIDE_MAX_REM;
sve.LP_SIDE_DEFAULT_REM = LP_SIDE_DEFAULT_REM;
sve.LP_MODES = LP_MODES;
sve.LP_MODE_LABELS = LP_MODE_LABELS;
sve.LP_PRIMARY_FLAT = LP_PRIMARY_FLAT;
sve.COMMENTS_BADGE_FG = COMMENTS_BADGE_FG;
sve.COMMENTS_BADGE_IDLE_TYPE = COMMENTS_BADGE_IDLE_TYPE;
sve.COMMENTS_BADGE_ACTIVE_BG = COMMENTS_BADGE_ACTIVE_BG;
sve.LP_ICON_IDLE_OPACITY = LP_ICON_IDLE_OPACITY;
sve.LP_ICON_LOCKED_OPACITY = LP_ICON_LOCKED_OPACITY;
sve.paintLpActiveControl = paintLpActiveControl;
sve.isLpSaveLabel = isLpSaveLabel;
sve.isLpPublishLabel = isLpPublishLabel;
sve.findLpSaveButton = findLpSaveButton;
sve.findLpRightActionTail = findLpRightActionTail;
sve.syncLpRightBarGaps = syncLpRightBarGaps;
sve.paintLpSaveButton = paintLpSaveButton;
sve.LP_SEP_OPACITY = LP_SEP_OPACITY;
sve.LP_CONTROL_PAD = LP_CONTROL_PAD;
sve.LP_CHROME_H = LP_CHROME_H;
sve.LP_CONTROL_H = LP_CONTROL_H;
sve.lpHeaderBg = lpHeaderBg;
sve.lpModeSeparator = lpModeSeparator;
sve.lpMode = lpMode;
sve.shouldKeepChrome = shouldKeepChrome;
sve.storedLpCollapsed = storedLpCollapsed;
sve.persistDockedPanel = persistDockedPanel;
sve.setLpMode = setLpMode;
sve.autoOpenPanel = autoOpenPanel;
sve.setLpCollapsed = setLpCollapsed;
