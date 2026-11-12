import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { measureContrast } from '../../resources/js/build-mode/canvas-contrast.js';

const page = (marked) => ({ querySelector: () => (marked ? {} : null) });

test("the real preview's script measures the canvas's document", () => {
  const asked = [];
  const doc = page(true);

  measureContrast({ applyAutoContrast: (root) => asked.push(root) }, doc);
  assert.deepEqual(asked, [doc]);
});

test('nothing to measure, or no script on the page: nothing is asked', () => {
  const asked = [];
  const site = { applyAutoContrast: (root) => asked.push(root) };

  measureContrast(site, page(false));
  measureContrast({}, page(true));
  measureContrast(null, page(true));
  measureContrast(site, null);
  assert.deepEqual(asked, []);
});

test("each paint asks: the canvas's report is where every paint ends", () => {
  const canvas = readFileSync(new URL('../../resources/js/build-mode/canvas.js', import.meta.url), 'utf8');
  const report = /function report\(\) \{[\s\S]*?\n {2}\}/.exec(canvas)[0];

  assert.ok(report.includes('measureContrast(realWin, cdoc())'), report);
});
