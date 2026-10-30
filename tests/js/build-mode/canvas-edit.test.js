/**
 * canvas-edit.js — the words of an element typed in on the canvas.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { editedText } from '../../../resources/js/build-mode/canvas-edit.js';

const text = (data) => ({ nodeType: 3, data });
const br = { nodeType: 1, tagName: 'BR', childNodes: [] };
const el = (...childNodes) => ({ nodeType: 1, tagName: 'P', childNodes });

test('words and line breaks, as the text box has them', () => {
  assert.equal(editedText(el(text('One'), br, text('Two'))), 'One<br>Two');
  assert.equal(editedText(el()), '');
});

test('the <br> the browser keeps for the caret is not the text', () => {
  assert.equal(editedText(el(text('One'), br)), 'One');
  assert.equal(editedText(el(text('One'), br, br)), 'One<br>');
});

test('a space the browser wrote hard is a space', () => {
  assert.equal(editedText(el(text('Hej du'))), 'Hej du');
});
