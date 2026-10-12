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
     * The layers for a run that may write. The project layer also brings the
     * MCP servers in `.cursor/mcp.json`, and an MCP server (a filesystem or
     * shell server) writes where it likes — the gate cannot see it. A run
     * that may write leaves that layer out when the site has such a file;
     * one that cannot write keeps it, since it is offered no MCP at all.
     *
     * @return list<string>
     */
    public static function settingSourcesFor(bool $writes): array
    {
        $sources = static::settingSources();

        if ($writes && in_array('project', $sources, true) && is_file(base_path('.cursor/mcp.json'))) {
            return array_values(array_diff($sources, ['project']));
        }

        return $sources;
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
     * The model a run uses: the one picked in the panel when it is a model id
     * at all, else the site's default from the settings screen, else config.
     * `default` is Cursor's Auto.
     */
    public static function model(?string $picked = null): string
    {
        foreach ([$picked, Features::setting('ai_model', ''), config('statamic-visual-editor.ai.model', 'composer-2.5')] as $id) {
            $id = trim((string) $id);

            if (static::validModel($id)) {
                return $id;
            }
        }

        return 'composer-2.5';
    }

    public static function validModel(string $id): bool
    {
        return (bool) preg_match('/^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/', $id);
    }

    /**
     * One agent run.
     *
     * The agent can read the site and nothing more, unless `$write` opens
     * something: then it writes through the gate in scripts/ai-write-gate.mjs,
     * which refuses every path outside that scope (see AiChat\WriteScope).
     * There is no shell — no git, no rm — in either case.
     *
     * `$stopped` is asked every moment while the agent works; when it says
     * yes, the agent's process is ended (it cancels its run on the way out)
     * and the result says `stopped`, with whatever had been written by then.
     *
     * @param  list<array{data: string, mimeType: string}>  $images  base64, sent with the prompt as one message
     * @param  array{files: list<string>, create: list<string>, rules: string}|null  $write
     * @param  (callable(): bool)|null  $stopped
     * @return array{status: string, reply: string, written: list<string>, register: list<array>}
     */
    public static function run(string $prompt, array $images = [], ?array $write = null, ?string $model = null, ?callable $stopped = null): array
    {
        $payload = [
            'apiKey' => AiChat::apiKey(),
            'cwd' => base_path(),
            'model' => static::model($model),
            'prompt' => $prompt,
        ];

        // Added only when there is something to add, so the runner sees the
        // same object it always saw unless the site asked for more.
        if ($sources = static::settingSourcesFor($write !== null)) {
            $payload['settingSources'] = $sources;
        }

        if ($servers = static::mcpServers()) {
            $payload['mcpServers'] = $servers;
        }

        if ($images !== []) {
            $payload['images'] = array_values($images);
        }

        if ($write !== null) {
            $payload['write'] = $write;
        }

        // The runner ends itself just after this, should PHP be gone by then.
        $payload['deadline'] = 185;

        $process = static::process($payload, 180);
        $process->start();

        $wasStopped = false;

        while ($process->isRunning()) {
            if ($stopped !== null && $stopped()) {
                $wasStopped = true;
                // SIGTERM first — the runner cancels its run and answers —
                // then SIGKILL if it has not gone within three seconds.
                $process->stop(3);

                break;
            }

            $process->checkTimeout();
            usleep(300000);
        }

        $out = static::decode($process->getOutput());

        if ($wasStopped) {
            return [
                'status' => 'stopped',
                'reply' => '',
                'written' => static::strings($out['written'] ?? []),
                'register' => [],
            ];
        }

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
            'written' => static::strings($out['written'] ?? []),
            'register' => array_values(array_filter((array) ($out['register'] ?? []), 'is_array')),
        ];
    }

    /**
     * The models this Cursor account can use, as the SDK lists them.
     *
     * @return list<array{id: string, name: string}>
     */
    public static function models(): array
    {
        $process = static::process(['action' => 'models', 'apiKey' => AiChat::apiKey()], 30);
        $process->run();

        $out = static::decode($process->getOutput());

        abort_unless(is_array($out) && is_array($out['models'] ?? null), 502, trim($process->getErrorOutput()) ?: 'Could not list the Cursor models.');

        $models = [];

        foreach ($out['models'] as $row) {
            $id = is_array($row) ? trim((string) ($row['id'] ?? '')) : '';

            if (static::validModel($id)) {
                $models[] = ['id' => $id, 'name' => trim((string) ($row['name'] ?? '')) ?: $id];
            }
        }

        return $models;
    }

    protected static function process(array $payload, int $timeout): Process
    {
        $script = static::script();

        abort_unless(is_file($script), 500, 'Cursor agent script is missing.');
        abort_unless(
            static::sdkPath(),
            500,
            'The AI needs the Cursor SDK. Run `npm install @cursor/sdk` in this site.',
        );

        $payload = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        abort_unless(is_string($payload), 500);

        return new Process(
            [static::node(), $script],
            dirname($script, 2),
            [
                'PATH' => '/opt/homebrew/bin:/usr/local/bin:'.(getenv('PATH') ?: '/usr/bin:/bin'),
                'CURSOR_API_KEY' => AiChat::apiKey(),
            ],
            $payload,
            $timeout,
        );
    }

    /** @return list<string> */
    protected static function strings(mixed $list): array
    {
        return array_values(array_filter((array) $list, fn ($item) => is_string($item) && $item !== ''));
    }
}
