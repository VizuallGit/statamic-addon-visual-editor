/**
 * The target on a media prop writes an image's src. A src holding a tag with
 * quotes of its own came out as src="{{ props_image }}"_src" … and its first
 * piece became the prop's default: components/image was broken by one click.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bindToSrc } from '../../resources/js/component-bind.js';

const bind = (tag) => bindToSrc(tag, { from: 0, openTo: tag.length }, { handle: 'pic' });

test('a plain address is the default, and the field takes its place', () => {
  assert.deepEqual(bind('<img class="a" src="/x.jpg" alt="b">'), {
    html: '<img class="a" src="{{ props_pic }}" alt="b">',
    was: '/x.jpg',
  });
});

test('no address: the field is added', () => {
  assert.deepEqual(bind('<img alt="b">'), { html: '<img src="{{ props_pic }}" alt="b">', was: '' });
});

test('already the field: nothing to write', () => {
  assert.equal(bind('<img src="{{ props_pic }}">'), null);
});

test('an address with a tag is the file\'s own work: left alone', () => {
  assert.deepEqual(bind('<img src="{{ glide :src="_src" width="10" }}" alt="b">'), { computed: true });
});

test('components/image: a src under a condition and another after a tag', () => {
  const tag = '<img\n {{ if _wait }}\n src="{{ glide :src="_src" }}"\n {{ /if }}\n {{ _pre }}src="{{ glide :src="_src" }}"\n alt="x">';

  assert.deepEqual(bind(tag), { computed: true });
});

test('src inside another attribute or tag is not the src', () => {
  assert.deepEqual(bind('<img alt="src=&quot;x&quot;" data-src="/y.jpg">'), {
    html: '<img src="{{ props_pic }}" alt="src=&quot;x&quot;" data-src="/y.jpg">',
    was: '',
  });
  assert.deepEqual(bind('<img {{ glide src="/y.jpg" }} alt="b">'), {
    html: '<img src="{{ props_pic }}" {{ glide src="/y.jpg" }} alt="b">',
    was: '',
  });
});
