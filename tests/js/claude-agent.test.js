/**
 * The AI chat's agent on Claude: the loop over the Messages API
 * (claude-loop.mjs) with a fake API, and reading the site (claude-tools.mjs),
 * which never reaches a secret or leaves the site.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { apiTools, claudeParams, runLoop, toolResult } from '../../scripts/claude-loop.mjs';
import { readTools, siteReader } from '../../scripts/claude-tools.mjs';

/** A fake Messages API answering with `turns` in order, keeping what it was sent. */
function fakeApi(turns) {
  const sent = [];

  return {
    sent,
    create: async (body, options) => {
      sent.push({ body: structuredClone(body), options });

      return turns[sent.length - 1];
    },
  };
}

const TOOLS = {
  read_file: { description: 'Read', inputSchema: { type: 'object' }, execute: ({ path }) => `contents of ${path}` },
  write_file: { description: 'Write', inputSchema: { type: 'object' }, execute: () => ({ content: [{ type: 'text', text: 'LOCKED: not in scope' }], isError: true }) },
};

test('the loop runs the tools Claude asks for and returns its last text', async () => {
  const api = fakeApi([
    { stop_reason: 'tool_use', content: [{ type: 'text', text: 'Reading.' }, { type: 'tool_use', id: 't1', name: 'read_file', input: { path: 'a.html' } }] },
    { stop_reason: 'end_turn', content: [{ type: 'text', text: 'Done: the heading is an h3 now.' }] },
  ]);

  const out = await runLoop({ create: api.create, params: claudeParams('claude-opus-5-5'), prompt: 'Make it an h3', tools: TOOLS });

  assert.deepEqual(out, { reply: 'Done: the heading is an h3 now.', stop: 'end_turn', turns: 2 });
  assert.deepEqual(api.sent[1].body.messages[2], { role: 'user', content: [{ type: 'tool_result', tool_use_id: 't1', content: 'contents of a.html' }] });
  assert.equal(api.sent[1].body.messages[1].content[1].type, 'tool_use', 'the assistant turn goes back whole');
  assert.deepEqual(api.sent[0].body.tools.map((tool) => tool.name), ['read_file', 'write_file']);
});

test('a refused write comes back to Claude as an error result', async () => {
  const result = await toolResult(TOOLS, { id: 't2', name: 'write_file', input: { path: '.env' } });

  assert.deepEqual(result, { type: 'tool_result', tool_use_id: 't2', content: 'LOCKED: not in scope', is_error: true });
  assert.equal((await toolResult(TOOLS, { id: 't3', name: 'rm', input: {} })).is_error, true);
});

test('a refusal or a cut-off answer runs no tools', async () => {
  const api = fakeApi([{ stop_reason: 'max_tokens', content: [{ type: 'tool_use', id: 't1', name: 'write_file', input: { path: 'x' } }] }]);
  let ran = false;
  const out = await runLoop({ create: api.create, params: {}, prompt: 'x', tools: { write_file: { ...TOOLS.write_file, execute: () => { ran = true; } } } });

  assert.equal(out.stop, 'max_tokens');
  assert.equal(ran, false);
});

test('a loop that circles stops at the limit', async () => {
  const turn = { stop_reason: 'tool_use', content: [{ type: 'tool_use', id: 't', name: 'read_file', input: { path: 'a' } }] };
  const out = await runLoop({ create: async () => turn, params: {}, prompt: 'x', tools: TOOLS, maxTurns: 3 });

  assert.deepEqual(out, { reply: '', stop: 'max_turns', turns: 3 });
});

test('the request: medium effort, cached, the refusal fallback on Opus and Sonnet only', () => {
  assert.deepEqual(claudeParams('claude-opus-5-5').fallbacks, 'default');
  assert.deepEqual(claudeParams('claude-sonnet-5-5').betas, ['server-side-fallback-2026-07-01']);
  assert.equal(claudeParams('claude-haiku-5-5').fallbacks, undefined);
  assert.deepEqual(claudeParams('claude-opus-5-5').output_config, { effort: 'medium' });
  assert.deepEqual(apiTools(TOOLS)[0], { name: 'read_file', description: 'Read', input_schema: { type: 'object' } });
});

test('the site is read, its secrets and everything outside it are not', () => {
  const site = mkdtempSync(join(tmpdir(), 'sve-site-'));

  try {
    mkdirSync(join(site, 'resources/views'), { recursive: true });
    mkdirSync(join(site, 'resources/addons'), { recursive: true });
    mkdirSync(join(site, 'users'), { recursive: true });
    writeFileSync(join(site, 'resources/views/hero.antlers.html'), '<h2>{{ title }}</h2>\n<p>{{ text }}</p>');
    writeFileSync(join(site, 'resources/addons/visual-editor.yaml'), 'ghost_api_key: sk-ant-secret');
    writeFileSync(join(site, '.env'), 'APP_KEY=secret');
    writeFileSync(join(site, 'users/a.yaml'), 'password: hash');

    const tools = readTools(siteReader(site));
    const read = (path) => tools.read_file.execute({ path });

    assert.equal(read('resources/views/hero.antlers.html'), '<h2>{{ title }}</h2>\n<p>{{ text }}</p>');
    assert.equal(read('resources/views/hero.antlers.html', 2), '<h2>{{ title }}</h2>\n<p>{{ text }}</p>');
    assert.equal(tools.read_file.execute({ path: 'resources/views/hero.antlers.html', offset: 2, limit: 1 }), '<p>{{ text }}</p>');

    for (const secret of ['.env', 'resources/addons/visual-editor.yaml', 'users/a.yaml', '../etc/passwd', '/etc/passwd']) {
      assert.equal(read(secret).isError, true, secret);
    }

    assert.equal(tools.list_files.execute({ path: '' }), 'resources/');
    assert.equal(tools.list_files.execute({ path: 'resources' }), 'views/');
    assert.equal(tools.search_files.execute({ pattern: 'title' }), 'resources/views/hero.antlers.html:1: <h2>{{ title }}</h2>');
    assert.equal(tools.search_files.execute({ pattern: 'sk-ant' }), 'No matches.');
  } finally {
    rmSync(site, { recursive: true, force: true });
  }
});
