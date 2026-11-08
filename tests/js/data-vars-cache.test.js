/**
 * data-vars.js — the field lists Build and the Data button ask for, kept per
 * place. A list asked for before a reset and answered after it is the old one:
 * it must not be kept, or a field made a moment ago stays missing from it.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchDataVars, resetDataVars } from '../../resources/js/data-vars.js';

/** A window whose fetches answer when the test says, in the order asked. */
function slowWin() {
  const answers = [];
  const win = {
    fetch: () =>
      new Promise((resolve) => {
        answers.push((body) => resolve({ ok: true, json: () => Promise.resolve(body) }));
      }),
  };

  return { win, answers, asked: () => answers.length };
}

const query = { set: 'static_section/own_probe' };

test('a list answered after a reset goes to whoever asked, and is not kept', async () => {
  resetDataVars();

  const { win, answers, asked } = slowWin();
  const old = fetchDataVars(win, query);

  resetDataVars('static_section/own_probe');
  answers[0]({ section: [{ var: 'text' }] });

  assert.deepEqual((await old).section, [{ var: 'text' }]);

  const fresh = fetchDataVars(win, query);

  assert.equal(asked(), 2, 'asked again: the old answer was not kept');
  answers[1]({ section: [{ var: 'text' }, { var: 'heading', hidden: true }] });
  assert.deepEqual((await fresh).section.map((row) => row.var), ['text', 'heading']);
});

test('a list answered with no reset in between is kept', async () => {
  resetDataVars();

  const { win, answers, asked } = slowWin();
  const first = fetchDataVars(win, query);

  answers[0]({ section: [{ var: 'text' }] });
  await first;
  await fetchDataVars(win, query);

  assert.equal(asked(), 1);
});
