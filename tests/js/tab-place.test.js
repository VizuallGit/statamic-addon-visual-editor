import assert from 'node:assert/strict';
import { test } from 'node:test';
import { roomStep, tabCentre } from '../../resources/js/cp-shell/tab-place.js';

test('the tab stands over the middle of the window when it fits there', () => {
  assert.equal(tabCentre({ whole: 800, left: 350, right: 1280, width: 360, gap: 8 }), 800);
});

test('it moves to the middle of the preview when it would reach over the right sidebar', () => {
  assert.equal(tabCentre({ whole: 800, left: 600, right: 1000, width: 360, gap: 8 }), 800);
  assert.equal(tabCentre({ whole: 800, left: 600, right: 900, width: 360, gap: 8 }), 750);
});

test('and over the left one', () => {
  assert.equal(tabCentre({ whole: 800, left: 700, right: 1500, width: 360, gap: 8 }), 1100);
});

test('room enough: nothing happens', () => {
  assert.equal(roomStep({ room: 900, min: 480, rightOpen: true, leftOpen: true }), '');
});

test('too little: the right sidebar goes first, then the left', () => {
  assert.equal(roomStep({ room: 400, min: 480, rightOpen: true, leftOpen: true }), 'close-right');
  assert.equal(roomStep({ room: 400, min: 480, rightOpen: false, leftOpen: true }), 'close-left');
  assert.equal(roomStep({ room: 400, min: 480, rightOpen: false, leftOpen: false }), '');
});

test('room again: the left comes back first, then the right, only what was closed for room', () => {
  const base = { min: 480, slack: 16, rightOpen: false, leftOpen: false, rightWidth: 320, leftWidth: 350 };

  assert.equal(roomStep({ ...base, room: 900, autoLeft: true, autoRight: true }), 'open-left');
  assert.equal(roomStep({ ...base, leftOpen: true, room: 900, autoLeft: false, autoRight: true }), 'open-right');
  assert.equal(roomStep({ ...base, room: 900, autoLeft: false, autoRight: false }), '');
});

test('not until both fit, with room to spare', () => {
  const base = { min: 480, slack: 16, rightOpen: false, leftOpen: true, rightWidth: 320, leftWidth: 350, autoRight: true, autoLeft: false };

  assert.equal(roomStep({ ...base, room: 800 }), '');
  assert.equal(roomStep({ ...base, room: 816 }), 'open-right');
});
