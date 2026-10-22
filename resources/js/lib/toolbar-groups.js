/**
 * Top bar groups, as plain data — no storage, no DOM.
 *
 * The user's arrangement of the Live Preview top bar: groups of tool keys,
 * left to right, each tool in one group at most. A group is
 * { id: 'g-…', name: '' | 'Pages', tools: [tab key, …] }. Which icons show is
 * not here — that is the hidden list a preset writes — so a tool keeps its
 * place while a preset hides it, and is back where the user put it when the
 * preset shows it again.
 *
 * Groups are stored only once the user has arranged something. No stored
 * groups = one group, DEFAULT_GROUP_ID, in DEFAULT_ORDER. A group that has no
 * tools is never stored: moving the last tool out of a group drops it.
 *
 * May import: nothing.
 */

const TOOL_KEY = /^[a-z][a-z0-9_]*$/;
const GROUP_ID = /^g-[a-z0-9]+$/;

export const GROUP_NAME_MAX = 30;

/** The one group a bar nobody has grouped is. */
export const DEFAULT_GROUP_ID = 'g-default';

/**
 * Every icon, left to right, as the top bar draws it when nobody has moved
 * one. The same list as ToolbarPresets::TOOLS in PHP; a test holds them in
 * step. Page settings is not a tool here: always first, outside every group.
 */
export const DEFAULT_ORDER = [
  'pages',
  'globals',
  'collections',
  'forms',
  'templates',
  'blueprint',
  'bard_styles',
  'sections',
  'listview',
  'outline',
  'performance',
  'code',
  'site_css',
  'theme',
  'xray',
  'design_overlay',
  'ai',
  'aitext',
  'schema',
  'edits',
  'comments',
];

const validKey = (key) => typeof key === 'string' && TOOL_KEY.test(key);
const keysOf = (list) => (Array.isArray(list) ? [...new Set(list.filter(validKey))] : []);
const cleanName = (name) => (typeof name === 'string' ? name.trim().slice(0, GROUP_NAME_MAX) : '');

/**
 * A stored list made safe: real ids, once each; names trimmed and capped;
 * known tool keys, each in the first group that lists it; no empty groups.
 * [] when it is not a list.
 */
export function cleanGroups(raw) {
  if (!Array.isArray(raw)) {
    return [];
  }

  const seenIds = new Set();
  const seenKeys = new Set();
  const out = [];

  raw.forEach((group) => {
    if (!group || typeof group !== 'object' || typeof group.id !== 'string' || !GROUP_ID.test(group.id) || seenIds.has(group.id)) {
      return;
    }

    const tools = keysOf(group.tools).filter((key) => !seenKeys.has(key));

    if (!tools.length) {
      return;
    }

    seenIds.add(group.id);
    tools.forEach((key) => seenKeys.add(key));
    out.push({ id: group.id, name: cleanName(group.name), tools });
  });

  return out;
}

/** A new group's id: time-based, so two in the same list never meet. */
export function newGroupId(now = Date.now(), taken = []) {
  let n = now;

  while (taken.includes(`g-${n.toString(36)}`)) {
    n += 1;
  }

  return `g-${n.toString(36)}`;
}

/** The old flat order (sve-toolbar-order) as one group; [] when there was none. */
export function groupsFromOrder(order, id = DEFAULT_GROUP_ID) {
  const tools = keysOf(order);

  return tools.length ? [{ id, name: '', tools }] : [];
}

/**
 * The groups laid out for `keys` — the tools the bar has: the stored groups,
 * in order, with only the keys that are there; the keys no group knows (a tool
 * added since) after them in the last group, in `order`; a key `order` does
 * not know after those, as it came. No stored groups: one group, in `order`.
 */
export function layoutGroups(groups, keys, order = DEFAULT_ORDER) {
  const have = keysOf(keys);
  const placed = new Set();
  const out = cleanGroups(groups)
    .map((group) => ({ ...group, tools: group.tools.filter((key) => have.includes(key)) }))
    .filter((group) => group.tools.length);

  out.forEach((group) => group.tools.forEach((key) => placed.add(key)));

  const rest = have.filter((key) => !placed.has(key));
  const rank = (key) => {
    const at = order.indexOf(key);

    return at === -1 ? order.length : at;
  };

  // A stable sort: two keys the order does not know stay as they came.
  rest.sort((a, b) => rank(a) - rank(b));

  if (!rest.length) {
    return out;
  }

  if (!out.length) {
    return [{ id: DEFAULT_GROUP_ID, name: '', tools: rest }];
  }

  const last = out[out.length - 1];

  return [...out.slice(0, -1), { ...last, tools: [...last.tools, ...rest] }];
}

/** The group `key` is in, or null. */
export function groupOf(groups, key) {
  return groups.find((group) => group.tools.includes(key)) || null;
}

/** `groups` without `key`; a group left empty is dropped. */
function withoutTool(groups, key) {
  return groups
    .map((group) => (group.tools.includes(key) ? { ...group, tools: group.tools.filter((item) => item !== key) } : group))
    .filter((group) => group.tools.length);
}

/**
 * Move `key` into group `groupId` at `index` (clamped) — also a key no group
 * has yet. Unchanged when there is no such group. The group it leaves is
 * dropped when that empties it. A new array.
 */
export function moveTool(groups, key, groupId, index) {
  if (!validKey(key) || !groups.some((group) => group.id === groupId)) {
    return groups.map((group) => ({ ...group, tools: [...group.tools] }));
  }

  // Out of wherever it was; the target stays even while it is empty.
  const out = groups
    .map((group) => ({ ...group, tools: group.tools.filter((item) => item !== key) }))
    .filter((group) => group.tools.length || group.id === groupId);
  const target = out.find((group) => group.id === groupId);
  const to = Math.max(0, Math.min(target.tools.length, Number.isFinite(index) ? index : target.tools.length));

  target.tools.splice(to, 0, key);

  return out;
}

/**
 * Move `key` into a new group of its own, put in at `groupIndex` among the
 * groups as they are now (clamped; `groups.length` = after the last). Returns
 * the new list and the new group's id. Unchanged, id '' when `key` is not one.
 */
export function moveToolToNewGroup(groups, key, groupIndex, { id = '', name = '' } = {}) {
  if (!validKey(key)) {
    return { groups: groups.map((group) => ({ ...group, tools: [...group.tools] })), id: '' };
  }

  const at = Math.max(0, Math.min(groups.length, Number.isFinite(groupIndex) ? groupIndex : groups.length));
  const before = groups.slice(0, at);
  const after = groups.slice(at);
  const newId = id && GROUP_ID.test(id) && !groups.some((group) => group.id === id) ? id : newGroupId(Date.now(), groups.map((group) => group.id));
  const made = { id: newId, name: cleanName(name), tools: [key] };

  return { groups: [...withoutTool(before, key), made, ...withoutTool(after, key)], id: newId };
}

/** Group `id` under `name` (trimmed, capped). A new array. */
export function renameGroup(groups, id, name) {
  return groups.map((group) => (group.id === id ? { ...group, name: cleanName(name) } : { ...group }));
}

/** Group `id` moved to `index` among the groups (clamped). A new array. */
export function moveGroup(groups, id, index) {
  const from = groups.findIndex((group) => group.id === id);

  if (from === -1) {
    return [...groups];
  }

  const out = groups.filter((group) => group.id !== id);
  const to = Math.max(0, Math.min(out.length, Number.isFinite(index) ? index : out.length));

  out.splice(to, 0, groups[from]);

  return out;
}

/**
 * Group `id` taken out, its tools put after the tools of the group before it
 * — or before the tools of the one after, for the first. Nothing is lost. The
 * only group cannot go: unchanged.
 */
export function deleteGroup(groups, id) {
  const at = groups.findIndex((group) => group.id === id);

  if (at === -1 || groups.length < 2) {
    return groups.map((group) => ({ ...group, tools: [...group.tools] }));
  }

  const gone = groups[at];
  const into = at > 0 ? at - 1 : at + 1;

  return groups
    .filter((group) => group.id !== id)
    .map((group) => {
      if (group.id !== groups[into].id) {
        return { ...group, tools: [...group.tools] };
      }

      return { ...group, tools: at > 0 ? [...group.tools, ...gone.tools] : [...gone.tools, ...group.tools] };
    });
}
