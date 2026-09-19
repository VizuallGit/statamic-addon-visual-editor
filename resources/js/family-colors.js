/**
 * A user's own colours for the tag families.
 *
 * The tree and the HTML pane read their colours through the same variables
 * (--sve-fam-*, lib/tag-families.js), each surface's stylesheet setting the
 * defaults on its own root. A user's choice is written as inline properties
 * on those same two roots — the tree's list (through its store, so a repaint
 * keeps them) and the dock element — where it wins over the stylesheet and
 * costs one style recalculation for the subtree. Stored per user with the
 * rest of the editor's chrome (FAMILY_COLORS_KEY).
 *
 * May import: chrome-prefs.js, lib/, the tree store. Not the dock.
 */
import { chromeGet, chromeRemove, chromeSet } from './chrome-prefs.js';
import { CODE_DOCK_ID, FAMILY_COLORS_KEY } from './lib/ids.js';
import { FAMILIES, FAMILY_COLORS, familyColorStyle, parseFamilyOverrides, withFamilyColor } from './lib/tag-families.js';
import { htmlTreeUi } from './cp/html-tree/store.js';

export function readFamilyOverrides(win) {
  return parseFamilyOverrides(chromeGet(win, FAMILY_COLORS_KEY));
}

/** The overrides onto an element: set where chosen, removed where not. */
export function paintFamilyColors(el, overrides) {
  if (!el) {
    return;
  }

  for (const family of FAMILIES) {
    if (overrides?.[family]) {
      el.style.setProperty(`--sve-fam-${family}`, overrides[family]);
    } else {
      el.style.removeProperty(`--sve-fam-${family}`);
    }
  }
}

/** Both surfaces, from what is stored. The dock may not be open yet; dock-api paints a new one itself. */
export function applyFamilyColors(win) {
  const overrides = readFamilyOverrides(win);

  htmlTreeUi.familyStyle = familyColorStyle(overrides);
  paintFamilyColors(win.document.getElementById(CODE_DOCK_ID), overrides);

  return overrides;
}

function write(win, overrides) {
  if (Object.keys(overrides).length) {
    chromeSet(win, FAMILY_COLORS_KEY, JSON.stringify(overrides));
  } else {
    chromeRemove(win, FAMILY_COLORS_KEY);
  }

  applyFamilyColors(win);
}

export function setFamilyColor(win, family, hex) {
  write(win, withFamilyColor(readFamilyOverrides(win), family, hex));
}

export function resetFamilyColors(win) {
  write(win, {});
}

/** Every family with the colour it wears now and the one it would go back to. */
export function familyColorRows(win, label) {
  const overrides = readFamilyOverrides(win);

  return FAMILIES.map((family) => ({
    id: family,
    label: label(family),
    value: overrides[family] || FAMILY_COLORS.dark[family],
    def: FAMILY_COLORS.dark[family],
  }));
}
