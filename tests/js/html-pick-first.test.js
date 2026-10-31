/**
 * The element a file's pick lines up on. `components/image` starts with an
 * {{ if }}, and sending that row's empty tag stamped nothing: no element of the
 * component could be pointed at.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { firstPickNode } from '../../resources/js/html-pick-first.js';

const img = { kind: undefined, tag: 'img', klass: 'max-w-full', path: '0', children: [] };

test('a file starting with a tag', () => {
  assert.equal(firstPickNode([img]), img);
});

test('a condition with nothing in it is passed by', () => {
  assert.equal(firstPickNode([{ kind: 'antlers', children: [] }, img]), img);
});

test('a condition holding the element gives that element', () => {
  assert.equal(firstPickNode([{ kind: 'antlers', children: [{ kind: 'antlers', children: [img] }] }]), img);
});

test('a component call and an svg from a field render nothing to line up on', () => {
  assert.equal(firstPickNode([{ kind: 'component', tag: 'x' }, { kind: 'svg', dynamic: true, tag: 'svg' }, img]), img);
});

test('nothing to line up on', () => {
  assert.equal(firstPickNode([{ kind: 'antlers', children: [] }]), null);
  assert.equal(firstPickNode(undefined), null);
});
