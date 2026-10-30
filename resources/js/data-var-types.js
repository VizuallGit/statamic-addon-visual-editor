/**
 * Which fields fit where: the Data button's catalogue (data-vars.js) narrowed
 * to the fieldtypes a place can print, and the `{{ … }}` tags in what was typed.
 *
 * A heading prints a text field, an image an asset. Picking from the list can
 * only give what fits; a name typed by hand is looked up here.
 *
 * Owner: the Data catalogue (resources/js/data-vars.js).
 * May import: nothing. Pure.
 * Bus messages: none.
 */

/** What a text box prints: text and textarea, nothing that needs a loop or a tag of its own. */
export const TEXT_FIELDS = ['text', 'textarea'];

const FITS = {
  text: TEXT_FIELDS,
  textarea: TEXT_FIELDS,
  bard: ['bard'],
  assets: ['assets'],
  link: ['link'],
};

/** The fieldtypes a field of this type can read from, or null when any can. */
export function fieldTypesFor(type) {
  return FITS[type] || null;
}

function fits(row, types, single) {
  return types.includes(row.type) && (!single || row.type !== 'assets' || row.single);
}

function fitting(rows, types, inLoop, single) {
  return (rows || [])
    .filter((row) => fits(row, types, single) && (inLoop || !row.parent))
    // The list's LOOP mark says a pair is coming. Nothing here writes a pair.
    .map((row) => (row.loop ? { ...row, loop: false } : row));
}

function fittingGroups(groups, types, inLoop, single) {
  return (groups || [])
    // A collection's fields print only inside its loop, which one tag cannot open.
    .filter((group) => inLoop || !group.loop)
    .map((group) => ({ ...group, items: fitting(group.items, types, inLoop, single) }))
    .filter((group) => group.items.length);
}

/**
 * The catalogue with only what fits. A row inside a grid or a replicator prints
 * only in its loop, so it stays only on the tab of the loop being stood in.
 * `single`: an asset field of one file only — an image shows one, a gallery's
 * many print only in a loop.
 */
export function onlyTypes(model, types, { single = false } = {}) {
  return {
    scope: fittingGroups(model?.scope, types, true, single),
    section: fitting(model?.section, types, false, single),
    page: fittingGroups(model?.page, types, false, single),
    site: fittingGroups(model?.site, types, false, single),
  };
}

/** The expression when the text is one tag and nothing else: `{{ title }}` → `title`; otherwise null. */
export function wholeTag(text) {
  return /^\s*\{\{\s*((?:(?!\{\{|\}\})[\s\S])+?)\s*\}\}\s*$/.exec(String(text ?? ''))?.[1] ?? null;
}

const TAG = /\{\{\s*([^\s|{}]+)[^{}]*\}\}/g;

function everyRow(model) {
  const inGroups = (groups) => (groups || []).flatMap((group) => group.items || []);

  return [...(model?.section || []), ...inGroups(model?.scope), ...inGroups(model?.page), ...inGroups(model?.site)];
}

/**
 * The names in `text` that are known fields, none of them of a fitting type. A
 * name the catalogue does not know is left to the author: it may be a modifier's
 * expression or a variable only the page has.
 */
export function wrongFields(text, model, types, { single = false } = {}) {
  const rows = everyRow(model);
  const names = [...String(text ?? '').matchAll(TAG)].map((match) => match[1]);

  return [...new Set(names)].filter((name) => {
    const known = rows.filter((row) => row.var === name);

    return known.length > 0 && !known.some((row) => fits(row, types, single));
  });
}

/** The text without the tags that name these fields. */
export function withoutFields(text, names) {
  return String(text ?? '').replace(TAG, (tag, name) => (names.includes(name) ? '' : tag));
}
