import { Agent } from '@cursor/sdk';
import { stdin, stdout, stderr, exit } from 'node:process';

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

const options = {
  apiKey: input.apiKey,
  model: { id: input.model || 'composer-2.5' },
  local,
};

if (input.mcpServers && Object.keys(input.mcpServers).length) {
  options.mcpServers = input.mcpServers;
}

try {
  const result = await Agent.prompt(input.prompt, options);

  stdout.write(
    JSON.stringify({
      status: result.status,
      reply: result.result ?? '',
      error: result.error?.message ?? null,
    }),
  );

  exit(result.status === 'finished' ? 0 : 1);
} catch (err) {
  stderr.write(err?.message || String(err));
  exit(1);
}
