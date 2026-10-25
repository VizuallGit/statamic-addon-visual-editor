import { test } from 'node:test';
import assert from 'node:assert/strict';
import { barEdge, onScreen } from '../../resources/js/lib/under-bar.js';
import { LP_COVER_ID } from '../../resources/js/lib/ids.js';

const drawn = { getClientRects: () => [{}] };
const hiddenWithFrame = { getClientRects: () => [] };

test('an icon on the bar is on screen; one hidden with its frame, or missing, is not', () => {
  assert.equal(onScreen(drawn), true);
  assert.equal(onScreen(hiddenWithFrame), false);
  assert.equal(onScreen(null), false);
});

test('the bar’s edge is the Live Preview header’s own, not the addon’s cover over it', () => {
  const header = (rect, cover = false) => ({
    getBoundingClientRect: () => rect,
    closest: (selector) => (cover && selector === `#${LP_COVER_ID}` ? {} : null),
  });
  const win = {
    document: {
      querySelectorAll: () => [header({ left: 10, bottom: 50 }, true), header({ left: 240, bottom: 48 })],
    },
  };

  assert.deepEqual(barEdge(win), { left: 240, bottom: 48 });
});

test('no bar on this screen: nothing to hang under', () => {
  assert.equal(barEdge({ document: { querySelectorAll: () => [] } }), null);
});
