/*
 * The AI chat's agent when the site runs on Claude: the Messages API in a
 * loop. Cursor's SDK brings its own agent; Claude's API is the model alone,
 * so this is the part around it — ask, run the tools Claude asks for, hand
 * their answers back, and again, until Claude has its reply.
 *
 * The tools are the ones the Cursor run gets — the gate's writes
 * (ai-write-gate.mjs) and reading the site (claude-tools.mjs) — in the shape
 * `{ description, inputSchema, execute }`. Nothing here touches the disk.
 *
 * `create` is the SDK's call, handed in, so the loop runs in a test without
 * the SDK or the network.
 */

/** Refusals on these models are answered by Anthropic's own fallback model. */
export const FALLBACK_BETA = 'server-side-fallback-2026-07-01';

/** Requests in one run at most: a section takes a handful; this is the stop for one that circles. */
export const MAX_TURNS = 40;

/** The request around the conversation, for a model id. */
export function claudeParams(model) {
  const params = {
    model,
    max_tokens: 16000,
    // Building a section is agentic coding: medium is the documented start.
    output_config: { effort: 'medium' },
    // The prompt and the files read so far are the same from one turn to the
    // next: cached, each turn pays for what is new.
    cache_control: { type: 'ephemeral' },
  };

  if (/^claude-(opus|sonnet|fable)-/.test(model)) {
    params.betas = [FALLBACK_BETA];
    params.fallbacks = 'default';
  }

  return params;
}

/** The tools in the API's shape. */
export function apiTools(tools) {
  return Object.entries(tools).map(([name, tool]) => ({ name, description: tool.description, input_schema: tool.inputSchema }));
}

/**
 * A tool's answer as a tool_result. A tool returns a string, or the gate's
 * refusal `{ content: [{ text }], isError: true }`; one that throws is an error
 * result too, so Claude reads why and can go on.
 */
export async function toolResult(tools, call) {
  const tool = tools[call.name];
  const result = (content, isError = false) => ({ type: 'tool_result', tool_use_id: call.id, content, ...(isError ? { is_error: true } : {}) });

  if (!tool) {
    return result(`There is no tool named ${call.name}.`, true);
  }

  try {
    const out = await tool.execute(call.input && typeof call.input === 'object' ? call.input : {});

    if (out && typeof out === 'object' && Array.isArray(out.content)) {
      return result(out.content.map((part) => part?.text ?? '').join('\n'), !!out.isError);
    }

    return result(String(out ?? ''));
  } catch (err) {
    return result(err?.message || String(err), true);
  }
}

/** The text of a response, its blocks joined. */
export function textOf(response) {
  return (response.content || [])
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();
}

/**
 * Asks until Claude is done. `prompt` is the user turn: a string, or content
 * blocks (text and pasted images). Resolves the reply; an API error or an
 * abort rejects.
 *
 * @returns {Promise<{reply: string, stop: string, turns: number}>}
 */
export async function runLoop({ create, params, prompt, tools, signal, maxTurns = MAX_TURNS }) {
  const messages = [{ role: 'user', content: prompt }];
  const list = apiTools(tools);

  for (let turn = 1; turn <= maxTurns; turn += 1) {
    const response = await create({ ...params, tools: list, messages }, { signal });

    // Passed back whole, thinking and fallback blocks included, as the API wants.
    messages.push({ role: 'assistant', content: response.content });

    const calls = response.content.filter((block) => block.type === 'tool_use');

    // A refusal or a cut-off answer can stop a tool call mid-input: those
    // tools never run.
    if (response.stop_reason !== 'tool_use' || calls.length === 0) {
      return { reply: textOf(response), stop: response.stop_reason, turns: turn };
    }

    // One after the other: two writes to one file land in the order asked.
    const results = [];

    for (const call of calls) {
      results.push(await toolResult(tools, call));
    }

    messages.push({ role: 'user', content: results });
  }

  return { reply: '', stop: 'max_turns', turns: maxTurns };
}
