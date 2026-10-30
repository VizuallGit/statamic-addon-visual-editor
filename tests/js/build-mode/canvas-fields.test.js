/**
 * build-mode/canvas-fields.js — a field's island painted from the form's own
 * editor while it is typed in. Plain Node, with stand-ins for the few DOM
 * calls the module makes.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canvasFields, editorHtml, fieldDomId } from '../../../resources/js/build-mode/canvas-fields.js';

/** A field's element in the form, holding an editor (or not), with the listeners and observers put on it. */
function fakeField({ editor = '<p>Hello</p>', set = false, present = true } = {}) {
  const listeners = {};
  const pm = {
    querySelector: (sel) => (sel === '[data-node-view-wrapper]' && set ? {} : null),
    cloneNode: () => ({
      innerHTML: editor,
      querySelectorAll: () => [{ remove() {} }],
    }),
  };
  const el = {
    inside: new Set(),
    querySelector: (sel) => (sel === '.ProseMirror' && present ? pm : null),
    addEventListener: (name, fn) => (listeners[name] = fn),
    removeEventListener: (name) => delete listeners[name],
    contains: (node) => !!node && el.inside.has(node),
    fire: (name, event = {}) => listeners[name]?.(event),
    listeners,
    type: (html) => {
      pm.cloneNode = () => ({ innerHTML: html, querySelectorAll: () => [] });
    },
  };

  return el;
}

/** A window: elements by id, one animation frame at a time, observers that can be fed. */
function fakeWindow(byId) {
  const frames = [];
  const observers = [];
  const win = {
    document: { getElementById: (id) => byId[id] || null, activeElement: null },
    requestAnimationFrame: (fn) => frames.push(fn),
    cancelAnimationFrame: () => {},
    MutationObserver: class {
      constructor(fn) {
        this.fn = fn;
        observers.push(this);
      }
      observe(el) {
        this.el = el;
      }
      disconnect() {
        this.el = null;
      }
    },
    frame: () => frames.splice(0).forEach((fn) => fn()),
    mutate: (el) => observers.filter((o) => o.el === el).forEach((o) => o.fn()),
  };

  return win;
}

const plan = (...keys) => ({ islands: keys.map((key) => ({ key, field: key.split('\n')[1].replace(/[{} ]/g, '') })) });
const idOf = (name) => fieldDomId(`page_sections.4.${name}`);

test('fieldDomId is Statamic’s id for a field at a path', () => {
  assert.equal(fieldDomId('page_sections.4.bard_field'), 'field_page_sections_4_bard_field');
  assert.equal(fieldDomId('title'), 'field_title');
});

test('editorHtml is the editor’s inside without ProseMirror’s helpers; nothing for a set or no editor', () => {
  assert.equal(editorHtml(fakeField({ editor: '<p>Hi</p>' })), '<p>Hi</p>');
  assert.equal(editorHtml(fakeField({ set: true })), null);
  assert.equal(editorHtml(fakeField({ present: false })), null);
});

test('typed in, the editor’s HTML is the island’s the next frame, the section is painted, and a render does not read over it', () => {
  const bard = fakeField({ editor: '<p>Hello</p>' });
  const win = fakeWindow({ field_page_sections_4_bard_field: bard });
  const islands = new Map([['0:div\n{{ bard_field }}\n#1', '<p>Hello</p>']]);
  let paints = 0;
  let reads = 0;
  const fields = canvasFields(win, { islands, paint: () => (paints += 1), read: () => (reads += 1) });

  fields.follow(plan('0:div\n{{ bard_field }}\n#1'), idOf);
  assert.equal(fields.holds('0:div\n{{ bard_field }}\n#1'), false);

  // Not typed in: a change in the editor (Statamic drawing it) paints nothing.
  bard.type('<p>Hello</p>');
  win.mutate(bard);
  win.frame();
  assert.equal(paints, 0);

  bard.fire('focusin');
  assert.equal(fields.holds('0:div\n{{ bard_field }}\n#1'), true);
  bard.type('<p>Hello w</p>');
  win.mutate(bard);
  win.mutate(bard);
  assert.equal(paints, 0, 'one frame, not one paint per mutation');
  win.frame();
  assert.equal(islands.get('0:div\n{{ bard_field }}\n#1'), '<p>Hello w</p>');
  assert.equal(paints, 1);

  // The same HTML again: nothing to paint.
  win.mutate(bard);
  win.frame();
  assert.equal(paints, 1);

  // Focus moving inside the editor (its toolbar) does not let go; leaving it does, and the page is read again.
  const button = {};
  bard.inside.add(button);
  bard.fire('focusout', { relatedTarget: button });
  assert.equal(fields.holds('0:div\n{{ bard_field }}\n#1'), true);
  bard.fire('focusout', { relatedTarget: null });
  assert.equal(fields.holds('0:div\n{{ bard_field }}\n#1'), false);
  assert.equal(reads, 1);
});

test('an editor with a set in it is left to the server, and lets go of its island', () => {
  const bard = fakeField({ set: true });
  const win = fakeWindow({ field_page_sections_4_bard_field: bard });
  const islands = new Map();
  let paints = 0;
  const fields = canvasFields(win, { islands, paint: () => (paints += 1), read() {} });

  fields.follow(plan('0:div\n{{ bard_field }}\n#1'), idOf);
  bard.fire('focusin');
  win.frame();
  assert.equal(paints, 0);
  assert.equal(islands.size, 0);
  assert.equal(fields.holds('0:div\n{{ bard_field }}\n#1'), false);
});

test('follow binds what the plan has and the form shows, rebinds a field drawn anew, and lets the rest go', () => {
  const first = fakeField();
  const second = fakeField();
  const byId = { field_page_sections_4_bard_field: first };
  const win = fakeWindow(byId);
  const fields = canvasFields(win, { islands: new Map(), paint() {}, read() {} });

  fields.follow(plan('0:div\n{{ bard_field }}\n#1', '0:p\n{{ other }}\n#1', '0:ul\n{{ collection:pages }}\n#1'), idOf);
  assert.ok(first.listeners.focusin, 'the field the form shows is bound');

  // The field drawn again (another tab, the panel redrawn): the new element is bound, the old let go.
  byId.field_page_sections_4_bard_field = second;
  fields.follow(plan('0:div\n{{ bard_field }}\n#1'), idOf);
  assert.ok(!first.listeners.focusin);
  assert.ok(second.listeners.focusin);

  // Already typed in when bound: held from the start, painted the next frame.
  win.document.activeElement = {};
  second.inside.add(win.document.activeElement);
  byId.field_page_sections_4_bard_field = fakeField({ editor: '<p>Now</p>' });
  byId.field_page_sections_4_bard_field.inside.add(win.document.activeElement);
  fields.follow(plan('0:div\n{{ bard_field }}\n#1'), idOf);
  assert.equal(fields.holds('0:div\n{{ bard_field }}\n#1'), true);

  fields.follow(null, idOf);
  assert.ok(!byId.field_page_sections_4_bard_field.listeners.focusin, 'no plan, nothing bound');
  assert.equal(fields.holds('0:div\n{{ bard_field }}\n#1'), false);
});
