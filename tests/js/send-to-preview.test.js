/**
 * sendToPreview (lib/preview-frame.js): the one way the CP sends the preview a
 * message. It goes to the preview's frame; only what every frame shows
 * (MIRRORED in lib/protocol.js) goes to the breakpoint overview's copies too.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { BP_OVERVIEW_ID } from '../../resources/js/lib/ids.js';
import { sendToPreview } from '../../resources/js/lib/preview-frame.js';
import { MIRRORED, MSG, SOURCE } from '../../resources/js/lib/protocol.js';

function frame(src) {
  const got = [];

  return {
    got,
    getAttribute: (name) => (name === 'src' ? src : null),
    contentWindow: { postMessage: (message, origin) => got.push({ message, origin }) },
  };
}

/** A CP window with a preview and, while the overview is open, its copies. */
function cpWindow({ preview = frame('/page?live-preview=1'), copies = [] } = {}) {
  const byId = {
    'live-preview-iframe': preview,
    [BP_OVERVIEW_ID]: copies.length ? { querySelectorAll: () => copies } : null,
  };
  const document = { getElementById: (id) => byId[id] ?? null, querySelectorAll: () => [] };

  if (preview) {
    preview.ownerDocument = document;
    preview.contentDocument = { getElementById: () => null };
  }

  return { win: { document }, preview };
}

test('a message goes to the preview frame, to any origin', () => {
  const { win, preview } = cpWindow();
  const message = { source: SOURCE, type: MSG.CLICK };

  sendToPreview(message, win);

  assert.deepEqual(preview.got, [{ message, origin: '*' }]);
});

test('with no preview on screen nothing is sent and nothing throws', () => {
  const { win } = cpWindow({ preview: null });

  assert.doesNotThrow(() => sendToPreview({ source: SOURCE, type: MSG.CLICK }, win));
});

test('what every frame shows reaches the copies as well: each MIRRORED type', () => {
  for (const type of MIRRORED) {
    const copies = [frame('/page?bp=tablet'), frame('/page?bp=mobile')];
    const { win, preview } = cpWindow({ copies });
    const message = { source: SOURCE, type };

    sendToPreview(message, win);

    assert.equal(preview.got.length, 1, `${type}: the preview`);
    copies.forEach((copy) => assert.deepEqual(copy.got, [{ message, origin: '*' }], `${type}: a copy`));
  }
});

test("the bridge's own messages stay with the preview: no other type reaches a copy", () => {
  const others = Object.values(MSG).filter((type) => !MIRRORED.includes(type));

  assert.ok(others.length > 10, 'the protocol has more than the mirrored types');

  for (const type of others) {
    const copies = [frame('/page?bp=tablet')];
    const { win, preview } = cpWindow({ copies });

    sendToPreview({ source: SOURCE, type }, win);

    assert.equal(preview.got.length, 1, `${type}: the preview`);
    assert.deepEqual(copies[0].got, [], `${type} must not reach a copy`);
  }
});

test('a copy that holds no page (switched out, or not loaded yet) is skipped', () => {
  const blank = frame('about:blank');
  const empty = frame('');
  const live = frame('/page?bp=mobile');
  const { win } = cpWindow({ copies: [blank, empty, live] });

  sendToPreview({ source: SOURCE, type: MIRRORED[0] }, win);

  assert.equal(blank.got.length, 0);
  assert.equal(empty.got.length, 0);
  assert.equal(live.got.length, 1);
});
