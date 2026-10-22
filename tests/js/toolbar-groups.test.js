import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GROUP_NAME_MAX, DEFAULT_GROUP_ID, DEFAULT_ORDER, cleanGroups, newGroupId, groupsFromOrder, layoutGroups, groupOf, moveTool, moveToolToNewGroup, renameGroup, moveGroup, deleteGroup } from '../../resources/js/lib/toolbar-groups.js';

test('anything other than a list of groups is no groups', () => {
  assert.deepEqual(cleanGroups(null), []);
  assert.deepEqual(cleanGroups(undefined), []);
  assert.deepEqual(cleanGroups({ id: 'g-a', tools: ['pages'] }), []);
  assert.deepEqual(cleanGroups('g-a'), []);
  assert.deepEqual(cleanGroups(4), []);
});

test('a group with a bad id is dropped, and so is a later group with an id already kept', () => {
  assert.deepEqual(cleanGroups([
    { id: 'x', name: 'No', tools: ['pages'] },
    { id: 'u-abc', name: 'No', tools: ['globals'] },
    { name: 'No', tools: ['code'] },
    null,
    { id: 'g-a', name: 'Yes', tools: ['pages', 'globals', 'code'] },
    { id: 'g-a', name: 'Again', tools: ['theme'] },
  ]), [
    { id: 'g-a', name: 'Yes', tools: ['pages', 'globals', 'code'] },
  ]);
});

test('a group name is trimmed and cut to the maximum, and a non-string name is blank', () => {
  assert.deepEqual(cleanGroups([
    { id: 'g-a', name: '  Pages  ', tools: ['pages'] },
    { id: 'g-b', name: 'n'.repeat(GROUP_NAME_MAX + 10), tools: ['globals'] },
    { id: 'g-c', name: 4, tools: ['code'] },
    { id: 'g-d', name: null, tools: ['theme'] },
  ]), [
    { id: 'g-a', name: 'Pages', tools: ['pages'] },
    { id: 'g-b', name: 'n'.repeat(GROUP_NAME_MAX), tools: ['globals'] },
    { id: 'g-c', name: '', tools: ['code'] },
    { id: 'g-d', name: '', tools: ['theme'] },
  ]);
});

test('invalid tool keys are dropped, a tool stays in the first group, and a group left empty goes', () => {
  assert.deepEqual(cleanGroups([
    { id: 'g-a', name: '', tools: ['Bad', 'pages', '1x', 2, 'pages', 'globals'] },
    { id: 'g-b', name: '', tools: ['globals', 'code'] },
    { id: 'g-c', name: '', tools: ['code'] },
    { id: 'g-d', name: 'Empty', tools: [] },
    { id: 'g-e', name: 'Nope', tools: ['Bad', 1] },
  ]), [
    { id: 'g-a', name: '', tools: ['pages', 'globals'] },
    { id: 'g-b', name: '', tools: ['code'] },
  ]);
});

test('a new group id is g- plus the time in base 36, skipping ids already taken', () => {
  const now = 1000;
  const id = (n) => `g-${n.toString(36)}`;

  assert.match(newGroupId(now), /^g-/);
  assert.equal(newGroupId(now), id(now));
  assert.equal(newGroupId(now, [id(now)]), id(now + 1));
  assert.equal(newGroupId(now, [id(now), id(now + 1)]), id(now + 2));
});

test('an old flat order becomes one group of its valid keys, or nothing', () => {
  assert.deepEqual(groupsFromOrder([]), []);
  assert.deepEqual(groupsFromOrder(null), []);
  assert.deepEqual(groupsFromOrder('pages'), []);
  assert.deepEqual(groupsFromOrder(['Bad', '1x', 4]), []);
  assert.deepEqual(groupsFromOrder([], 'g-saved'), []);
  assert.deepEqual(groupsFromOrder(['pages', 'Bad', 'pages', '1x', 3, 'globals']), [
    { id: DEFAULT_GROUP_ID, name: '', tools: ['pages', 'globals'] },
  ]);
  assert.deepEqual(groupsFromOrder(['code', 'code'], 'g-saved'), [
    { id: 'g-saved', name: '', tools: ['code'] },
  ]);
});

test('no stored groups is one group, known keys in the default order and unknown keys after them', () => {
  assert.deepEqual(layoutGroups([], ['comments', 'Bad', 'pages', 'pages', 1, 'not_yet', 'globals', 'also_new']), [
    { id: DEFAULT_GROUP_ID, name: '', tools: ['pages', 'globals', 'comments', 'not_yet', 'also_new'] },
  ]);
  assert.deepEqual(layoutGroups(null, ['zzz', 'pages', 'mmm']), [
    { id: DEFAULT_GROUP_ID, name: '', tools: ['pages', 'zzz', 'mmm'] },
  ]);
  assert.deepEqual(layoutGroups([{ id: 'x', tools: ['comments'] }], ['globals', 'pages']), [
    { id: DEFAULT_GROUP_ID, name: '', tools: ['pages', 'globals'] },
  ]);
});

test('stored groups keep their order, drop keys the bar lacks, and new keys join the last group', () => {
  const groups = [
    { id: 'g-a', name: 'A', tools: ['comments', 'code', 'pages'] },
    { id: 'g-b', name: 'B', tools: ['theme', 'xray'] },
    { id: 'g-c', name: 'C', tools: ['ai'] },
  ];
  const keys = ['pages', 'comments', 'ai', 'globals', 'sections', 'not_yet'];
  const snapshot = structuredClone({ groups, keys, order: DEFAULT_ORDER });

  assert.deepEqual(layoutGroups(groups, keys), [
    { id: 'g-a', name: 'A', tools: ['comments', 'pages'] },
    { id: 'g-c', name: 'C', tools: ['ai', 'globals', 'sections', 'not_yet'] },
  ]);
  // The only stored group had nothing the bar still has, so the bar is the default group again.
  assert.deepEqual(layoutGroups([{ id: 'g-a', name: 'Gone', tools: ['code', 'theme'] }], ['globals', 'pages']), [
    { id: DEFAULT_GROUP_ID, name: '', tools: ['pages', 'globals'] },
  ]);
  assert.deepEqual({ groups, keys, order: DEFAULT_ORDER }, snapshot);
});

test("groupOf returns the group a tool is in, or null", () => {
  const groups = [
    { id: 'g-a', name: 'A', tools: ['pages'] },
    { id: 'g-b', name: 'B', tools: ['code', 'globals'] },
  ];

  assert.equal(groupOf(groups, 'globals'), groups[1]);
  assert.equal(groupOf(groups, 'pages'), groups[0]);
  assert.equal(groupOf(groups, 'theme'), null);
  assert.equal(groupOf([], 'pages'), null);
});

test('a tool moves within its group, the index clamps, and infinity means the end', () => {
  const groups = [{ id: 'g-a', name: 'A', tools: ['pages', 'globals', 'code', 'theme'] }];
  const snapshot = structuredClone(groups);

  assert.deepEqual(moveTool(groups, 'pages', 'g-a', 2), [
    { id: 'g-a', name: 'A', tools: ['globals', 'code', 'pages', 'theme'] },
  ]);
  assert.deepEqual(moveTool(groups, 'theme', 'g-a', -10), [
    { id: 'g-a', name: 'A', tools: ['theme', 'pages', 'globals', 'code'] },
  ]);
  assert.deepEqual(moveTool(groups, 'pages', 'g-a', 99), [
    { id: 'g-a', name: 'A', tools: ['globals', 'code', 'theme', 'pages'] },
  ]);
  assert.deepEqual(moveTool(groups, 'pages', 'g-a', Infinity), [
    { id: 'g-a', name: 'A', tools: ['globals', 'code', 'theme', 'pages'] },
  ]);
  assert.deepEqual(moveTool([{ id: 'g-a', name: 'A', tools: ['pages'] }], 'pages', 'g-a', 0), [
    { id: 'g-a', name: 'A', tools: ['pages'] },
  ]);
  assert.deepEqual(groups, snapshot);
});

test('a tool moves into another group, which stays put, and a group left empty is dropped', () => {
  const groups = [
    { id: 'g-a', name: 'A', tools: ['pages', 'globals'] },
    { id: 'g-b', name: 'B', tools: ['code'] },
    { id: 'g-c', name: 'C', tools: ['theme', 'ai'] },
  ];

  assert.deepEqual(moveTool(groups, 'globals', 'g-c', 1), [
    { id: 'g-a', name: 'A', tools: ['pages'] },
    { id: 'g-b', name: 'B', tools: ['code'] },
    { id: 'g-c', name: 'C', tools: ['theme', 'globals', 'ai'] },
  ]);
  assert.deepEqual(moveTool(groups, 'code', 'g-a', 1), [
    { id: 'g-a', name: 'A', tools: ['pages', 'code', 'globals'] },
    { id: 'g-c', name: 'C', tools: ['theme', 'ai'] },
  ]);
});

test('a tool no group has yet is inserted at the index', () => {
  const groups = [
    { id: 'g-a', name: 'A', tools: ['pages', 'globals'] },
    { id: 'g-b', name: 'B', tools: ['code'] },
  ];

  assert.deepEqual(moveTool(groups, 'sections', 'g-a', 1), [
    { id: 'g-a', name: 'A', tools: ['pages', 'sections', 'globals'] },
    { id: 'g-b', name: 'B', tools: ['code'] },
  ]);
  assert.deepEqual(moveTool(groups, 'sections', 'g-b', 99), [
    { id: 'g-a', name: 'A', tools: ['pages', 'globals'] },
    { id: 'g-b', name: 'B', tools: ['code', 'sections'] },
  ]);
});

test('an unknown group or a bad key is a copy, and a move to the same place stays put', () => {
  const groups = [
    { id: 'g-a', name: 'A', tools: ['pages', 'globals', 'code'] },
    { id: 'g-b', name: 'B', tools: ['theme'] },
  ];
  const missing = moveTool(groups, 'pages', 'g-missing', 0);

  assert.deepEqual(missing, groups);
  assert.notEqual(missing, groups);

  for (const key of ['Bad', '1x', 1]) {
    const out = moveTool(groups, key, 'g-a', 0);

    assert.deepEqual(out, groups, String(key));
    assert.notEqual(out, groups, String(key));
  }

  assert.deepEqual(moveTool(groups, 'globals', 'g-a', 1), [
    { id: 'g-a', name: 'A', tools: ['pages', 'globals', 'code'] },
    { id: 'g-b', name: 'B', tools: ['theme'] },
  ]);
});

test('a tool moved into a new group lands at the group index, clamped into range', () => {
  const groups = [
    { id: 'g-a', name: 'A', tools: ['pages', 'globals'] },
    { id: 'g-b', name: 'B', tools: ['code', 'theme'] },
    { id: 'g-c', name: 'C', tools: ['ai'] },
  ];
  const neu = { id: 'g-new', name: 'New', tools: ['theme'] };
  const rest = [
    { id: 'g-a', name: 'A', tools: ['pages', 'globals'] },
    { id: 'g-b', name: 'B', tools: ['code'] },
    { id: 'g-c', name: 'C', tools: ['ai'] },
  ];
  const made = (index) => moveToolToNewGroup(groups, 'theme', index, { id: 'g-new', name: 'New' }).groups;

  assert.deepEqual(made(0), [neu, rest[0], rest[1], rest[2]]);
  assert.deepEqual(made(1), [rest[0], neu, rest[1], rest[2]]);
  assert.deepEqual(made(groups.length), [rest[0], rest[1], rest[2], neu]);
  assert.deepEqual(made(99), [rest[0], rest[1], rest[2], neu]);
  assert.deepEqual(made(-4), [neu, rest[0], rest[1], rest[2]]);
});

test('emptying a group to start a new one drops it, and the new group stays where it was asked among the rest', () => {
  const groups = [
    { id: 'g-a', name: 'A', tools: ['pages'] },
    { id: 'g-b', name: 'B', tools: ['globals'] },
    { id: 'g-c', name: 'C', tools: ['code'] },
  ];
  const neu = { id: 'g-new', name: '', tools: ['pages'] };

  // Index 2 points just before C. A sits before that point and is emptied, so the new group is still just before C.
  assert.deepEqual(moveToolToNewGroup(groups, 'pages', 2, { id: 'g-new' }).groups, [
    { id: 'g-b', name: 'B', tools: ['globals'] },
    neu,
    { id: 'g-c', name: 'C', tools: ['code'] },
  ]);
  assert.deepEqual(moveToolToNewGroup(groups, 'pages', 0, { id: 'g-new' }).groups, [
    neu,
    { id: 'g-b', name: 'B', tools: ['globals'] },
    { id: 'g-c', name: 'C', tools: ['code'] },
  ]);
  assert.deepEqual(moveToolToNewGroup(groups, 'globals', groups.length, { id: 'g-new', name: '' }).groups, [
    { id: 'g-a', name: 'A', tools: ['pages'] },
    { id: 'g-c', name: 'C', tools: ['code'] },
    { id: 'g-new', name: '', tools: ['globals'] },
  ]);
});

test('a new group gets a fresh g- id, or a free id that was given, and its name is trimmed and cut', () => {
  const groups = [
    { id: 'g-a', name: 'A', tools: ['pages', 'globals'] },
    { id: 'g-b', name: 'B', tools: ['code'] },
  ];
  const fresh = moveToolToNewGroup(groups, 'globals', 1);
  const given = moveToolToNewGroup(groups, 'globals', 0, { id: 'g-fresh', name: `  ${'n'.repeat(GROUP_NAME_MAX + 4)}  ` });
  const taken = moveToolToNewGroup(groups, 'globals', 1, { id: 'g-a', name: '  Hello  ' });

  assert.match(fresh.id, /^g-[a-z0-9]+$/);
  assert.equal(groups.some((group) => group.id === fresh.id), false);
  assert.equal(fresh.groups.filter((group) => group.id === fresh.id).length, 1);

  assert.equal(given.id, 'g-fresh');
  assert.equal(given.groups[0].name, 'n'.repeat(GROUP_NAME_MAX));
  assert.deepEqual(given.groups[0].tools, ['globals']);

  assert.notEqual(taken.id, 'g-a');
  assert.match(taken.id, /^g-[a-z0-9]+$/);
  assert.equal(groups.some((group) => group.id === taken.id), false);
  assert.equal(taken.groups.find((group) => group.id === taken.id).name, 'Hello');
  assert.deepEqual(taken.groups.find((group) => group.id === 'g-a').tools, ['pages']);
});

test('an invalid key does not make a group', () => {
  const groups = [{ id: 'g-a', name: 'A', tools: ['pages', 'globals'] }];

  for (const key of ['Bad', '1x', 1]) {
    const out = moveToolToNewGroup(groups, key, 0, { id: 'g-fresh', name: 'X' });

    assert.equal(out.id, '', String(key));
    assert.deepEqual(out.groups, groups, String(key));
    assert.notEqual(out.groups, groups, String(key));
  }
});

test('renaming a group trims and cuts the name, and an unknown group is left as a copy', () => {
  const groups = [
    { id: 'g-a', name: 'Old', tools: ['pages'] },
    { id: 'g-b', name: 'B', tools: ['code'] },
  ];
  const unknown = renameGroup(groups, 'g-nope', '  New  ');

  assert.deepEqual(renameGroup(groups, 'g-a', '  Hello  '), [
    { id: 'g-a', name: 'Hello', tools: ['pages'] },
    { id: 'g-b', name: 'B', tools: ['code'] },
  ]);
  assert.deepEqual(renameGroup(groups, 'g-a', `  ${'z'.repeat(GROUP_NAME_MAX + 8)}`), [
    { id: 'g-a', name: 'z'.repeat(GROUP_NAME_MAX), tools: ['pages'] },
    { id: 'g-b', name: 'B', tools: ['code'] },
  ]);
  assert.deepEqual(renameGroup(groups, 'g-b', null), [
    { id: 'g-a', name: 'Old', tools: ['pages'] },
    { id: 'g-b', name: '', tools: ['code'] },
  ]);
  assert.deepEqual(unknown, groups);
  assert.notEqual(unknown, groups);
});

test('a group moves to an index, clamped, and an unknown group is left as a copy', () => {
  const groups = [
    { id: 'g-a', name: 'A', tools: ['pages'] },
    { id: 'g-b', name: 'B', tools: ['globals', 'code'] },
    { id: 'g-c', name: 'C', tools: ['theme'] },
  ];
  const unknown = moveGroup(groups, 'g-nope', 0);

  assert.deepEqual(moveGroup(groups, 'g-c', 0), [groups[2], groups[0], groups[1]]);
  assert.deepEqual(moveGroup(groups, 'g-a', 1), [groups[1], groups[0], groups[2]]);
  assert.deepEqual(moveGroup(groups, 'g-a', 99), [groups[1], groups[2], groups[0]]);
  assert.deepEqual(moveGroup(groups, 'g-b', -3), [groups[1], groups[0], groups[2]]);
  assert.deepEqual(unknown, groups);
  assert.notEqual(unknown, groups);
});

test('deleting a group gives its tools to the neighbour, and the only group cannot go', () => {
  const groups = [
    { id: 'g-a', name: 'A', tools: ['pages', 'globals'] },
    { id: 'g-b', name: 'B', tools: ['code'] },
    { id: 'g-c', name: 'C', tools: ['theme', 'ai'] },
  ];
  const only = [{ id: 'g-a', name: 'A', tools: ['pages', 'globals'] }];
  const kept = deleteGroup(only, 'g-a');
  const unknown = deleteGroup(groups, 'g-nope');

  assert.deepEqual(deleteGroup(groups, 'g-b'), [
    { id: 'g-a', name: 'A', tools: ['pages', 'globals', 'code'] },
    { id: 'g-c', name: 'C', tools: ['theme', 'ai'] },
  ]);
  assert.deepEqual(deleteGroup(groups, 'g-c'), [
    { id: 'g-a', name: 'A', tools: ['pages', 'globals'] },
    { id: 'g-b', name: 'B', tools: ['code', 'theme', 'ai'] },
  ]);
  assert.deepEqual(deleteGroup(groups, 'g-a'), [
    { id: 'g-b', name: 'B', tools: ['pages', 'globals', 'code'] },
    { id: 'g-c', name: 'C', tools: ['theme', 'ai'] },
  ]);
  assert.deepEqual(kept, only);
  assert.notEqual(kept, only);
  assert.deepEqual(unknown, groups);
  assert.notEqual(unknown, groups);
});

test('the default tool order is the same list as ToolbarPresets::TOOLS', () => {
  const php = readFileSync(new URL('../../src/ToolbarPresets.php', import.meta.url), 'utf8');
  const block = php.match(/public const TOOLS = \[([\s\S]*?)\];/);

  assert.ok(block);
  assert.deepEqual([...block[1].matchAll(/'([^']*)'/g)].map((match) => match[1]), DEFAULT_ORDER);
});
