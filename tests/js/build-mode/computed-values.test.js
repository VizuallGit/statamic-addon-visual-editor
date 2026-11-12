import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  bestToken,
  hexOf,
  hoverText,
  inherits,
  isNothing,
  isReadable,
  remOf,
  wordsFor,
} from '../../../resources/js/build-mode/computed-values.js';

test("a size in px reads as rem, against the page's root", () => {
  assert.equal(remOf(16), '1rem');
  assert.equal(remOf(15.5), '0.969rem');
  assert.equal(remOf(24, 20), '1.2rem');
  assert.equal(wordsFor('font-size', '16px'), '1rem');
  assert.equal(wordsFor('padding-top', '24px'), '1.5rem');
});

test('a line height reads as its ratio to the font size', () => {
  assert.equal(wordsFor('line-height', '24px', { fontPx: 16 }), '1.5');
});

test('a font stack reads as its first family, without quotes', () => {
  assert.equal(wordsFor('font-family', '"Inter", Helvetica, Arial'), 'Inter');
});

test('a colour reads as hex; one with an alpha as it is', () => {
  assert.equal(hexOf('rgb(31, 36, 40)'), '#1f2428');
  assert.equal(wordsFor('color', 'rgb(255, 255, 255)'), '#ffffff');
  assert.equal(wordsFor('background-color', 'rgba(0, 0, 0, 0.5)'), 'rgba(0, 0, 0, 0.5)');
});

test('two values under one field cannot be said in one', () => {
  assert.equal(wordsFor('padding-block', '10px 20px'), '');
  assert.equal(wordsFor('border-radius', '8px 4px'), '');
});

test('the browser\'s "nothing here" leaves the field empty', () => {
  ['0px', 'none', 'auto', 'normal', 'rgba(0, 0, 0, 0)', 'transparent', ''].forEach((value) =>
    assert.equal(isNothing('padding-top', value), true, value)
  );
  assert.equal(isNothing('opacity', '1'), true);
  assert.equal(isNothing('opacity', '0.5'), false);
  assert.equal(isNothing('font-size', '16px'), false);
});

test('a used size is not read: it would claim a choice nobody made', () => {
  ['width', 'height', 'min-width', 'max-height', 'top', 'grid-template-columns'].forEach((property) =>
    assert.equal(isReadable(property), false, property)
  );
  [
    'font-family',
    'font-size',
    'color',
    'background-color',
    'padding-block-start',
    'padding-top',
    'margin',
    'gap',
    'border-radius',
    'border-top-width',
  ].forEach((property) => assert.equal(isReadable(property), true, property));
});

test('text properties inherit, a box does not', () => {
  assert.equal(inherits('font-size'), true);
  assert.equal(inherits('color'), true);
  assert.equal(inherits('background-color'), false);
  assert.equal(inherits('padding-top'), false);
});

test('the hover says the value, its rem and px, and where it comes from', () => {
  assert.equal(
    hoverText('font-size', '100', '15.5px', { source: 'from the theme' }),
    'font-size: 100 · 0.969rem = 15.5px · from the theme'
  );
  assert.equal(hoverText('font-size', '1rem', '16px'), 'font-size: 1rem = 16px');
  assert.equal(hoverText('padding-top', '10px', '10px'), 'padding-top: 10px · 0.625rem = 10px');
  assert.equal(
    hoverText('font-family', 'base', 'Inter, Arial', { source: 'from the theme' }),
    'font-family: base · from the theme'
  );
});

test('a number on the scale names a value before a word does', () => {
  assert.equal(bestToken(['text-base', 'text-100']), 'text-100');
  assert.equal(bestToken(['font-base']), 'font-base');
  assert.equal(bestToken([]), '');
});
