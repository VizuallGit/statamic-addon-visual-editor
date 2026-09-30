import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bracketClasses,
  escapeAntlers,
  fromJsx,
  importedTemplate,
  peelAssets,
  rootSection,
  scopeCss,
} from '../../resources/js/section-import.js';

test('one pasted element becomes the section root, keeping its own tag', () => {
  const out = rootSection('<section class="bg-white py-24">\n  <h2>Hi</h2>\n</section>', 'tailwind');

  assert.match(out, /^<section id="id-\{\{ id \}\}" class="\[ \{\{ _class \}\} \] bg-white py-24" \{\{ visual_edit outline_inside="true" section_orderable="true" \}\}>/);
  assert.match(out, /<h2>Hi<\/h2>/);
  assert.equal(out.match(/<section/g).length, 1);
});

test('two elements side by side get a section wrapped around them', () => {
  const out = rootSection('<div>a</div>\n<div>b</div>', 'tailwind');

  assert.match(out, /^<section id="id-\{\{ id \}\}" class="\[ \{\{ _class \}\} \]" \{\{ visual_edit/);
  assert.match(out, /\n {4}<div>a<\/div>\n {4}<div>b<\/div>\n<\/section>$/);
});

test('an element with text beside it is wrapped, not promoted', () => {
  const out = rootSection('Intro\n<div>a</div>', 'tailwind');

  assert.match(out, /^<section id="id-\{\{ id \}\}"/);
  assert.match(out, /Intro/);
});

test('the root keeps the id we give it, not the one that was pasted', () => {
  const out = rootSection('<section id="hero" class="x">y</section>', 'tailwind');

  assert.match(out, /id="id-\{\{ id \}\}"/);
  assert.doesNotMatch(out, /id="hero"/);
});

test('plain CSS mode puts the class names in the brackets, Tailwind mode leaves them', () => {
  const html = '<div class="card card--wide">x</div>';

  assert.match(bracketClasses(html), /class="\[ card card--wide \]"/);
  assert.equal(bracketClasses('<div class="flex gap-4">x</div>'), '<div class="[ flex gap-4 ]">x</div>');
});

test('a name the brackets cannot hold stays outside them', () => {
  const out = bracketClasses('<div class="card md:flex w-1/2">x</div>');

  assert.equal(out, '<div class="[ card ] md:flex w-1/2">x</div>');
});

test('brackets that are already there are left alone', () => {
  const html = '<div class="[ card ] flex">x</div>';

  assert.equal(bracketClasses(html), html);
});

test('the plain-CSS root holds _class and the element\'s own names together', () => {
  const out = rootSection('<section class="hero hero--dark">x</section>', 'css');

  assert.match(out, /class="\[ \{\{ _class \}\} hero hero--dark \]"/);
});

test('the Tailwind root keeps utilities outside the brackets', () => {
  const out = rootSection('<section class="bg-white py-24">x</section>', 'tailwind');

  assert.match(out, /class="\[ \{\{ _class \}\} \] bg-white py-24"/);
});

test('inline style and script move to the panes that own them', () => {
  const out = peelAssets('<div>x</div>\n<style>.a { color: red }</style>\n<script>go()</script>');

  assert.equal(out.css, '.a { color: red }');
  assert.equal(out.js, 'go()');
  assert.match(out.html, /^<div>x<\/div>/);
  assert.doesNotMatch(out.html, /<style|<script/);
});

test('a script with a src has no body to move and stays put', () => {
  const html = '<div>x</div><script src="https://cdn/x.js"></script>';

  assert.equal(peelAssets(html).js, '');
  assert.match(peelAssets(html).html, /<script src/);
});

test('JSX spellings come back as HTML', () => {
  const out = fromJsx('<svg className="h-6" strokeWidth={1.5} strokeLinecap="round"><path clipRule="evenodd"/></svg>');

  assert.match(out, /class="h-6"/);
  assert.match(out, /stroke-width=/);
  assert.match(out, /stroke-linecap="round"/);
  assert.match(out, /clip-rule="evenodd"/);
});

test('viewBox is not dashed — SVG wants it camel-cased', () => {
  assert.match(fromJsx('<svg viewBox="0 0 24 24" preserveAspectRatio="none"/>'), /viewBox="0 0 24 24"/);
  assert.match(fromJsx('<svg viewBox="0 0 24 24" preserveAspectRatio="none"/>'), /preserveAspectRatio/);
});

test("JSX's spacer and comments do not end up as text on the page", () => {
  assert.equal(fromJsx("<span>a{' '}b</span>"), '<span>a b</span>');
  assert.equal(fromJsx('<div>{/* note */}<p>x</p></div>'), '<div><p>x</p></div>');
});

test('pasted braces are escaped so Antlers renders them instead of running them', () => {
  assert.equal(escapeAntlers('<div style={{ color: red }}>'), '<div style=@{{ color: red }}>');
  assert.equal(escapeAntlers('@{{ already }}'), '@{{ already }}');
});

test('pasted CSS is scoped to the section in plain-CSS mode only', () => {
  assert.match(scopeCss('.card { color: red }', 'css'), /^@scope\(\.\{\{ _class \}\}\) \{\n {2}\.card \{ color: red \}\n\}$/);
  assert.equal(scopeCss('.card { color: red }', 'tailwind'), '.card { color: red }');
  assert.equal(scopeCss('', 'css'), '');
});

test('CSS that is already scoped is not scoped twice', () => {
  const css = '@scope(.{{ _class }}) {\n  .a { color: red }\n}';

  assert.equal(scopeCss(css, 'css'), css);
});

test('a Tailwind UI paste comes out as a section with its utilities intact', () => {
  const pasted = '<div className="bg-white py-24 sm:py-32">\n  <h2 className="text-3xl">Deploy faster</h2>\n</div>';
  const out = importedTemplate(pasted, { mode: 'tailwind' });

  assert.match(out.html, /^<div id="id-\{\{ id \}\}" class="\[ \{\{ _class \}\} \] bg-white py-24 sm:py-32" \{\{ visual_edit/);
  assert.match(out.html, /<h2 class="text-3xl">Deploy faster<\/h2>/);
  assert.equal(out.css, '');
});

test('a plain-CSS paste comes out bracketed, with its stylesheet scoped', () => {
  const pasted = '<section class="hero">\n  <p class="lead">x</p>\n</section>';
  const out = importedTemplate(pasted, { mode: 'css', css: '.hero { padding: 4rem }\n.lead { font-size: 1.25rem }' });

  assert.match(out.html, /class="\[ \{\{ _class \}\} hero \]"/);
  assert.match(out.html, /<p class="\[ lead \]">/);
  assert.match(out.css, /^@scope\(\.\{\{ _class \}\}\) \{/);
  assert.match(out.css, /\.lead \{ font-size: 1\.25rem \}/);
});

test('the notes name what a browser would have dropped in silence', () => {
  const out = importedTemplate('<div style={{ color: "red" }}>x</div>', { mode: 'tailwind' });

  assert.deepEqual(out.notes, ['jsx_style', 'escaped_antlers']);
});

test('what comes out of the import is always one root with visual_edit on it', () => {
  for (const pasted of [
    '<div>a</div><div>b</div>',
    '<section class="x">a</section>',
    'bare text',
    '<img src="x.png" alt="">',
    '<style>.a{}</style><div>a</div>',
  ]) {
    const { html } = importedTemplate(pasted, { mode: 'tailwind' });

    assert.equal(html.match(/visual_edit/g).length, 1, pasted);
    assert.match(html, /id="id-\{\{ id \}\}"/, pasted);
    assert.match(html, /\{\{ _class \}\}/, pasted);
  }
});

test('a JSX value in braces becomes the attribute value it meant', () => {
  const out = fromJsx('<svg strokeWidth={1.5} tabIndex={-1} aria-label={"Close"} hidden={true} disabled={false}/>');

  assert.match(out, /stroke-width="1\.5"/);
  assert.match(out, /tabindex="-1"/);
  assert.match(out, /aria-label="Close"/);
  assert.match(out, /\shidden(\s|\/)/);
  assert.doesNotMatch(out, /disabled/);
  assert.doesNotMatch(out, /=\{/);
});

test('an object value is left alone rather than guessed at', () => {
  const out = fromJsx('<div style={{ color: "red" }}>x</div>');

  assert.match(out, /style=\{\{ color: "red" \}\}/);
});
