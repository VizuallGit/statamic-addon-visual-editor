<?php

namespace MarioHamann\StatamicVisualEditor;

use Symfony\Component\Process\Process;

/**
 * Runs a local Cursor agent against the site's files.
 *
 * Same Cursor account the super admin already pays for — not Anthropic.
 */
class CursorAgent
{
    public static function script(): string
    {
        return dirname(__DIR__).'/scripts/cursor-agent.mjs';
    }

    public static function node(): string
    {
        $configured = trim((string) config('statamic-visual-editor.ai.node', ''));

        foreach (array_filter([$configured, '/opt/homebrew/bin/node', '/usr/local/bin/node']) as $bin) {
            if (is_executable($bin)) {
                return $bin;
            }
        }

        return 'node';
    }

    /**
     * Ambient Cursor settings the agent may load from disk.
     *
     * The SDK loads none unless asked, which is why the site's own
     * `.cursor/rules` and `AGENTS.md` have never reached this chat. Turning
     * "Project rules" on hands it the `project` layer — the rules, skills and
     * MCP servers the repository already carries for the editor its developer
     * uses.
     *
     * Off by default, and off means the payload is byte for byte what it was
     * before this setting existed: a site that liked the old behaviour keeps it
     * without having to say so.
     *
     * @return list<string>
     */
    public static function settingSources(): array
    {
        return Features::setting('ai_project_rules', false) ? ['project'] : [];
    }

    /**
     * MCP servers to attach to the run, by name.
     *
     * Config only — a server is a command this server executes, or a URL it
     * hands credentials to, and neither belongs behind a text field on a
     * settings screen. Empty means the key is not sent at all.
     *
     * @return array<string, array<string, mixed>>
     */
    public static function mcpServers(): array
    {
        $servers = config('statamic-visual-editor.ai.mcp_servers', []);

        if (! is_array($servers)) {
            return [];
        }

        return array_filter($servers, fn ($server) => is_array($server) && $server !== []);
    }

    /**
     * @return array{status: string, reply: string}
     */
    public static function run(string $prompt): array
    {
        $script = static::script();
        $addonRoot = dirname($script, 2);

        abort_unless(is_file($script), 500, 'Cursor agent script is missing.');
        abort_unless(
            is_dir($addonRoot.'/node_modules/@cursor/sdk'),
            500,
            'Run npm install in the Visual Editor addon so @cursor/sdk is available.',
        );

        $payload = [
            'apiKey' => AiChat::apiKey(),
            'cwd' => base_path(),
            'model' => (string) config('statamic-visual-editor.ai.model', 'composer-2.5'),
            'prompt' => $prompt,
        ];

        // Added only when there is something to add, so the runner sees the
        // same object it always saw unless the site asked for more.
        if ($sources = static::settingSources()) {
            $payload['settingSources'] = $sources;
        }

        if ($servers = static::mcpServers()) {
            $payload['mcpServers'] = $servers;
        }

        $payload = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        abort_unless(is_string($payload), 500);

        $process = new Process(
            [static::node(), $script],
            $addonRoot,
            [
                'PATH' => '/opt/homebrew/bin:/usr/local/bin:'.(getenv('PATH') ?: '/usr/bin:/bin'),
                'CURSOR_API_KEY' => AiChat::apiKey(),
            ],
            $payload,
            180,
        );

        $process->run();

        $out = json_decode($process->getOutput(), true);

        if (! is_array($out)) {
            $err = trim($process->getErrorOutput()) ?: 'The Cursor agent failed.';

            abort(502, $err);
        }

        if (($out['status'] ?? '') !== 'finished') {
            abort(502, (string) ($out['error'] ?: $out['reply'] ?: 'The Cursor agent failed.'));
        }

        return [
            'status' => 'finished',
            'reply' => trim((string) ($out['reply'] ?? '')),
        ];
    }
}
