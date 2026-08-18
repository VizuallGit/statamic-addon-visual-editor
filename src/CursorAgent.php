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

        $payload = json_encode([
            'apiKey' => AiChat::apiKey(),
            'cwd' => base_path(),
            'model' => (string) config('statamic-visual-editor.ai.model', 'composer-2.5'),
            'prompt' => $prompt,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

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
