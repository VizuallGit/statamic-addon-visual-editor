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

try {
  const result = await Agent.prompt(input.prompt, {
    apiKey: input.apiKey,
    model: { id: input.model || 'composer-2.5' },
    local: { cwd: input.cwd },
  });

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
