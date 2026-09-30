import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const SOURCE = readFileSync(new URL('../../resources/js/save-errors.js', import.meta.url), 'utf8');

/**
 * Just enough document for the script under test. It builds its box with
 * createElement and textContent only — no innerHTML — so a node with children
 * and text is the whole surface.
 */
function stubDoc() {
  const make = (tag) => ({
    tag,
    children: [],
    text: '',
    className: '',
    id: '',
    listeners: {},
    set textContent(value) {
      this.text = value;
      this.children = [];
    },
    get textContent() {
      return this.text;
    },
    setAttribute() {},
    addEventListener(type, fn) {
      this.listeners[type] = fn;
    },
    appendChild(child) {
      this.children.push(child);
      child.parentNode = this;

      return child;
    },
    removeChild(child) {
      this.children = this.children.filter((one) => one !== child);
    },
  });

  return {
    head: make('head'),
    body: make('body'),
    createElement: make,
    createTextNode: (text) => ({ tag: '#text', text, children: [] }),
    getElementById: () => null,
  };
}

/** Every string in the box, however deep, joined the way a reader sees it. */
function words(node) {
  return [node.text || '', ...(node.children || []).flatMap(words)]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cpWindow() {
  const doc = stubDoc();
  const win = {
    document: doc,
    location: { origin: 'https://site.test' },
    navigator: { clipboard: { writeText() {} } },
    XMLHttpRequest: function () {},
    fetch: null,
  };

  win.XMLHttpRequest.prototype.open = function () {};
  win.XMLHttpRequest.prototype.send = function () {};

  const served = [];

  win.fetch = (url, init) => {
    const next = served.shift();

    return Promise.resolve(
      new Response(next.body, { status: next.status, headers: { 'Content-Type': 'application/json' } })
    );
  };

  new Function('window', 'Response', 'URL', 'console', SOURCE)(win, Response, URL, console);

  return { win, doc, serve: (status, body) => served.push({ status, body: JSON.stringify(body) }) };
}

const REJECTED = {
  message: 'The given data was invalid.',
  errors: { source_collection: ['The Collection field is required.'] },
};

test('a rejected save names the field, in Danish, instead of "the given data was invalid"', async () => {
  const { win, doc, serve } = cpWindow();

  serve(422, REJECTED);
  await win.fetch('/cp/collections/templates/entries/37a53203', { method: 'PATCH' });
  await new Promise((r) => setTimeout(r, 0));

  const box = doc.body.children.at(-1);

  assert.ok(box, 'der kom ingen boks');
  assert.match(words(box), /Collection skal udfyldes/);
  assert.match(words(box), /Det kunne ikke gemmes/);
  assert.doesNotMatch(words(box), /given data was invalid/);
});

test('the caller gets its response back untouched — the save chain must not notice us', async () => {
  const { win, serve } = cpWindow();

  serve(422, REJECTED);

  const response = await win.fetch('/cp/globals/site_head', { method: 'POST' });

  assert.equal(response.status, 422);
  assert.equal(response.bodyUsed, false, 'body var brugt op — kalderen kan ikke læse den');
  assert.deepEqual(await response.json(), REJECTED);
});

test('a failed GET says nothing: a person cannot act on a poll that went away', async () => {
  const { win, doc, serve } = cpWindow();

  serve(500, { message: 'Server Error' });
  await win.fetch('/cp/something', { method: 'GET' });
  await new Promise((r) => setTimeout(r, 0));

  assert.equal(doc.body.children.length, 0);
});

test('an expired session says nothing either — that is Statamic\'s own screen', async () => {
  const { win, doc, serve } = cpWindow();

  serve(419, { message: 'Page Expired' });
  await win.fetch('/cp/globals/site_head', { method: 'POST' });
  await new Promise((r) => setTimeout(r, 0));

  assert.equal(doc.body.children.length, 0);
});

test('a field buried in a replicator is given as a path a person can follow', async () => {
  const { win, doc, serve } = cpWindow();

  serve(422, {
    message: 'The given data was invalid.',
    errors: { 'blocks.0.widgets.1.logo': ['The Logo field is required.'] },
  });
  await win.fetch('/cp/globals/site_head', { method: 'POST' });
  await new Promise((r) => setTimeout(r, 0));

  assert.match(words(doc.body.children.at(-1)), /blocks › række 1 › widgets › række 2 › logo/);
});

test('a rejection with no field at all still says so, rather than showing an empty box', async () => {
  const { win, doc, serve } = cpWindow();

  serve(422, { message: 'The given data was invalid.' });
  await win.fetch('/cp/globals/site_head', { method: 'POST' });
  await new Promise((r) => setTimeout(r, 0));

  assert.match(words(doc.body.children.at(-1)), /fortalte ikke hvilket felt/);
});
