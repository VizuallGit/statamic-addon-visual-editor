/**
 * lib/build-canvas-ids.js — the canvas's id, its unstyled mark and its shown
 * event, as the one script that cannot import them spells them.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BUILD_CANVAS_ID,
  BUILD_CANVAS_SHOWN_EVENT,
  BUILD_CANVAS_UNSTYLED_ATTR,
} from '../../../resources/js/lib/build-canvas-ids.js';

const JS = join(dirname(fileURLToPath(import.meta.url)), '../../../resources/js');
const instant = readFileSync(join(JS, 'dock-instant-preview.js'), 'utf8');

test('dock-instant-preview.js spells the canvas ids (it imports nothing)', () => {
  assert.ok(instant.includes(`var BUILD_CANVAS_ID = '${BUILD_CANVAS_ID}';`));
  assert.ok(instant.includes(`var BUILD_CANVAS_UNSTYLED_ATTR = '${BUILD_CANVAS_UNSTYLED_ATTR}';`));
  assert.ok(instant.includes(`var BUILD_CANVAS_SHOWN_EVENT = '${BUILD_CANVAS_SHOWN_EVENT}';`));
});

test('Instant paints nothing into the preview while the canvas stands over it, and once when it goes', () => {
  // The same reading as lib/build-canvas.js buildCanvasFrame: in the document and styled.
  assert.ok(instant.includes('return !!frame && !frame.hasAttribute(BUILD_CANVAS_UNSTYLED_ATTR);'));
  assert.match(instant, /if \(buildCanvasUp\(\)\) \{\n\s+return;\n\s+\}\n\n\s+forgetOtherFile\(\);/);
  assert.match(instant, /addEventListener\(BUILD_CANVAS_SHOWN_EVENT, function \(\) \{\n\s+if \(!buildCanvasUp\(\)\) \{\n\s+schedulePaint\(\);/);
});
