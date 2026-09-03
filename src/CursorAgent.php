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
     * The runner's JSON result, from output that may not be only JSON.
     *
     * The script keeps stdout clean, and this is the second lock on the same
     * door: an SDK release that finds another way to print would otherwise turn
     * every answer into "the Cursor agent failed". The result is one line, so
     * the last line that parses is it.
     */
    protected static function decode(string $output): ?array
    {
        $whole = json_decode($output, true);

        // `status` is what makes it the runner's answer rather than some other
        // object that happens to be JSON.
        if (is_array($whole) && array_key_exists('status', $whole)) {
            return $whole;
        }

        $lines = array_reverse(array_filter(array_map('trim', explode("\n", $output))));

        foreach ($lines as $line) {
            $row = json_decode($line, true);

            if (is_array($row) && array_key_exists('status', $row)) {
                return $row;
            }
        }

        return null;
    }

    /**
     * Where the SDK the runner imports actually is, or null.
     *
     * Node resolves a bare import by walking up from the importing file
     * through every `node_modules` on the way. This looks in the same places,
     * in the same order, so the guard below answers the question Node will
     * actually be asked rather than a narrower one.
     *
     * That distinction matters here: `node_modules` is gitignored, so the
     * Composer package never carries it. Installed from a path repo the addon
     * has its own; installed from Packagist it has none, and the SDK has to
     * come from the site's own `node_modules` — which Node finds by walking up,
     * but the old check did not.
     */
    public static function sdkPath(): ?string
    {
        $dir = dirname(static::script());
        $root = realpath(base_path()) ?: base_path();

        for ($i = 0; $i < 12; $i++) {
            $candidate = $dir.'/node_modules/@cursor/sdk';

            if (is_dir($candidate)) {
                return $candidate;
            }

            $parent = dirname($dir);

            if ($parent === $dir) {
                break;
            }

            $dir = $parent;
        }

        // The site root need not be an ancestor of the script (a path repo puts
        // the addon outside the project), so it is asked separately.
        return is_dir($root.'/node_modules/@cursor/sdk')
            ? $root.'/node_modules/@cursor/sdk'
            : null;
    }

    /**
     * @return array{status: string, reply: string}
     */
    public static function run(string $prompt): array
    {
        $script = static::script();

        abort_unless(is_file($script), 500, 'Cursor agent script is missing.');
        abort_unless(
            static::sdkPath(),
            500,
            'The AI needs the Cursor SDK. Run `npm install @cursor/sdk` in this site.',
        );

        $addonRoot = dirname($script, 2);

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

        $out = static::decode($process->getOutput());

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
