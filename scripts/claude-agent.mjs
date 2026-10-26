import Anthropic from './bundled/anthropic-sdk.mjs';
import { stdin, stdout, stderr, exit } from 'node:process';
import { createGate, gateTools } from './ai-write-gate.mjs';
import { readTools, siteReader } from './claude-tools.mjs';
import { claudeParams, runLoop } from './claude-loop.mjs';

/*
 * One AI chat run on Claude — cursor-agent.mjs's counterpart, with the same
 * contract towards PHP (ClaudeAgent): the payload as JSON on stdin, one JSON
 * line on stdout `{ status, reply, error, written, register }`.
 *
 * The agent reads the site (claude-tools.mjs) and writes only through the
 * gate, and only when PHP opened something for this run (Build mode); in
 * Write mode and for AI text it has no tool that writes. No shell.
 */

async function readStdin() {
  const chunks = [];

  for await (const chunk of stdin) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString('utf8');
}

let input;

try {
  input = JSON.parse(await readStdin());
} catch {
  stderr.write('Invalid JSON on stdin.');
  exit(2);
}

// stdout is the result channel: anything else goes to stderr meanwhile.
const stdoutWrite = stdout.write.bind(stdout);

stdout.write = (chunk, encoding, callback) => stderr.write(chunk, encoding, callback);

function answer(result, code) {
  stdout.write = stdoutWrite;
  stdout.write(JSON.stringify(result));
  exit(code);
}

if (!input?.apiKey || !input?.cwd || !input?.prompt) {
  stderr.write('apiKey, cwd and prompt are required.');
  exit(2);
}

const gate = input.write ? createGate(input.cwd, input.write) : null;
const tools = {
  ...readTools(siteReader(input.cwd)),
  ...(gate ? gateTools(gate, { rules: !!input.write.rules }) : {}),
};

const written = () => (gate ? { written: gate.written, register: gate.register } : { written: [], register: [] });

// Images pasted into the chat go with the prompt as one user turn.
const images = Array.isArray(input.images) ? input.images.filter((image) => image?.data && image?.mimeType) : [];
const prompt = images.length
  ? [...images.map(({ data, mimeType }) => ({ type: 'image', source: { type: 'base64', media_type: mimeType, data } })), { type: 'text', text: input.prompt }]
  : input.prompt;

// Stop in the panel ends this process (PHP sends SIGTERM): the request on its
// way is aborted, and the answer says what was written before the stop.
const controller = new AbortController();
let ending = false;

function end(status) {
  if (ending) {
    return;
  }

  ending = true;
  controller.abort();
  answer({ status, reply: '', error: status === 'timeout' ? 'The AI ran out of time.' : null, ...written() }, 130);
}

process.on('SIGTERM', () => end('stopped'));

// Never outlive the PHP request that started this (see cursor-agent.mjs).
const parent = process.ppid;
const deadline = Number(input.deadline) > 0 ? Number(input.deadline) * 1000 : 185000;

setInterval(() => process.ppid !== parent && end('stopped'), 1000).unref();
setTimeout(() => end('timeout'), deadline).unref();

try {
  const client = new Anthropic({ apiKey: input.apiKey });
  const out = await runLoop({
    create: (body, options) => client.beta.messages.create(body, options),
    params: claudeParams(input.model || 'claude-opus-5-5'),
    prompt,
    tools,
    signal: controller.signal,
  });

  const reply = out.stop === 'refusal' ? 'Claude declined to answer this.' : out.stop === 'max_turns' ? 'The AI stopped after too many steps.' : out.reply;

  answer({ status: 'finished', reply, error: null, ...written() }, 0);
} catch (err) {
  if (!ending) {
    // Anthropic's own words: a wrong key, credit that has run out.
    answer({ status: 'error', reply: '', error: err instanceof Anthropic.APIError ? err.message : err?.message || String(err), ...written() }, 1);
  }
}
