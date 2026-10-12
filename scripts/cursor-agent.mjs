import { Agent, Cursor } from '@cursor/sdk';
import { stdin, stdout, stderr, exit } from 'node:process';
import { createGate, gateTools } from './ai-write-gate.mjs';

async function readStdin() {
  const chunks = [];

  for await (const chunk of stdin) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString('utf8');
}

const raw = await readStdin();
let input;

try {
  input = JSON.parse(raw);
} catch {
  stderr.write('Invalid JSON on stdin.');
  exit(2);
}

// stdout is this script's result channel: PHP parses the whole of it as JSON.
// The SDK logs to stdout too — loading settings layers prints "LocalCursorRulesService
// load completed …" — which turns a working run into an unparseable one. Library
// output goes to stderr for the duration; stdout is handed back for the result.
const stdoutWrite = stdout.write.bind(stdout);

stdout.write = (chunk, encoding, callback) => stderr.write(chunk, encoding, callback);

function answer(result, code) {
  stdout.write = stdoutWrite;
  stdout.write(JSON.stringify(result));
  exit(code);
}

// The models this Cursor account can use, for the panel's picker.
if (input?.action === 'models') {
  if (!input.apiKey) {
    stderr.write('apiKey is required.');
    exit(2);
  }

  try {
    const models = await Cursor.models.list({ apiKey: input.apiKey });

    answer({ status: 'finished', models: models.map(({ id, displayName }) => ({ id, name: displayName || id })) }, 0);
  } catch (err) {
    stdout.write = stdoutWrite;
    stderr.write(err?.message || String(err));
    exit(1);
  }
}

if (!input?.apiKey || !input?.cwd || !input?.prompt) {
  stderr.write('apiKey, cwd and prompt are required.');
  exit(2);
}

// Ambient settings and MCP servers are only added when PHP sent them. The SDK
// loads no settings layers of its own, so an absent key means exactly the
// behaviour this script had before either was an option.
//
// They sit at different levels on purpose: `settingSources` is on
// LocalAgentOptions (it reads the local filesystem), `mcpServers` is on
// AgentOptions. Putting either in the other's place is accepted quietly and
// does nothing.
const local = { cwd: input.cwd };

if (Array.isArray(input.settingSources) && input.settingSources.length) {
  local.settingSources = input.settingSources;
}

// The agent reads and searches; it has no shell (so no git, no rm) and none of
// Cursor's own edit or delete tools. Writing goes through the gate, and only
// when PHP opened something for this run — Write mode and AI text open
// nothing, so there the agent cannot change a file at all.
const gate = input.write ? createGate(input.cwd, input.write) : null;
const hasMcp = !!(input.mcpServers && Object.keys(input.mcpServers).length);
const tools = ['read', 'grep', 'glob', 'ls'];

if (gate || hasMcp) {
  tools.push('mcp');
}

if (gate) {
  local.customTools = gateTools(gate, { rules: !!input.write.rules });
}

const options = {
  apiKey: input.apiKey,
  model: { id: input.model || 'composer-2.5' },
  local,
  tools,
};

if (hasMcp) {
  options.mcpServers = input.mcpServers;
}

// Images pasted into the chat go with the prompt as one message — the SDK's
// SDKUserMessage. Without images the message is the prompt string, as it was.
// This is what Agent.prompt() does inside (create, send, wait, dispose); it
// takes only a string, so the steps are spelled out here.
const images = Array.isArray(input.images)
  ? input.images.filter((image) => image?.data && image?.mimeType).map(({ data, mimeType }) => ({ data, mimeType }))
  : [];
const message = images.length ? { text: input.prompt, images } : input.prompt;

const written = () => (gate ? { written: gate.written, register: gate.register } : { written: [], register: [] });

// Stop in the panel ends this process (PHP sends SIGTERM). The run is
// cancelled so nothing more is asked of the model, and the answer says what
// had been written before the stop — a write is one rename, never half a file.
let run = null;
let ending = false;

async function end(status) {
  if (ending) {
    return;
  }

  ending = true;

  const cancelled = run ? run.cancel().catch(() => {}) : Promise.resolve();

  await Promise.race([cancelled, new Promise((resolve) => setTimeout(resolve, 1500))]);
  answer({ status, reply: '', error: null, ...written() }, 130);
}

process.on('SIGTERM', () => end('stopped'));

// Never outlive the PHP request that started this. A PHP worker killed by the
// server (a timeout, a reload) runs no shutdown and cannot stop its child; an
// agent left running would write into files the editor has since saved. So:
// the parent gone, or past PHP's own limit for the run, and this ends itself.
const parent = process.ppid;
const deadline = Number(input.deadline) > 0 ? Number(input.deadline) * 1000 : 185000;

setInterval(() => process.ppid !== parent && end('stopped'), 1000).unref();
setTimeout(() => end('timeout'), deadline).unref();

try {
  const agent = await Agent.create(options);
  let result;

  try {
    run = await agent.send(message);
    result = await run.wait();
  } finally {
    await agent[Symbol.asyncDispose]();
  }

  answer(
    {
      status: result.status,
      reply: result.result ?? '',
      error: result.error?.message ?? null,
      ...written(),
    },
    result.status === 'finished' ? 0 : 1,
  );
} catch (err) {
  stdout.write = stdoutWrite;
  stderr.write(err?.message || String(err));
  exit(1);
}
