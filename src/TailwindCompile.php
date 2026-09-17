<?php

namespace MarioHamann\StatamicVisualEditor;

use RuntimeException;
use Symfony\Component\Process\Process;

/**
 * CSS for classes in a section's HTML pane, from Tailwind's own compiler.
 *
 * PHP does not invent utilities. A Node process runs `compile()` and Oxide's
 * scanner — the same engine Vite uses — against this file's HTML and the
 * site's `@theme` / `@plugin`. Written to `resources/visual-editor/tw`.
 * `npm run build` / `npm run dev` are not involved.
 */
class TailwindCompile
{
    public static function fromHtml(string $html): string
    {
        if (trim($html) === '') {
            return '';
        }

        $cwd = static::resolveCwd();
        $script = static::script();
        $node = static::node();

        if (! is_file($node) || ! is_executable($node)) {
            throw new RuntimeException(
                'Visual Editor could not find a Node binary to compile Tailwind. Set statamic-visual-editor.tailwind.node to the full path.'
            );
        }

        $payload = json_encode([
            'html' => $html,
            'theme' => TailwindTheme::css(),
            'plugins' => TailwindTheme::plugins(),
            'cwd' => $cwd,
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        if ($payload === false) {
            throw new RuntimeException('Visual Editor could not encode HTML for Tailwind.');
        }

        $home = getenv('HOME') ?: (string) ($_SERVER['HOME'] ?? '');
        $env = [
            'PATH' => dirname($node).':/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin',
            'HOME' => $home,
            'LANG' => 'en_US.UTF-8',
        ];

        $process = new Process([$node, $script], $cwd, $env, $payload, 30);
        $process->run();

        if (! $process->isSuccessful()) {
            $err = trim($process->getErrorOutput().' '.$process->getOutput());

            throw new RuntimeException(
                'Visual Editor could not compile Tailwind on the server. '.$err
            );
        }

        return trim($process->getOutput());
    }

    public static function script(): string
    {
        return dirname(__DIR__).DIRECTORY_SEPARATOR.'scripts'.DIRECTORY_SEPARATOR.'sve-compile-tailwind.mjs';
    }

    public static function node(): string
    {
        $configured = (string) config('statamic-visual-editor.tailwind.node', 'node');

        if ($configured !== '' && $configured !== 'node' && is_executable($configured)) {
            return $configured;
        }

        foreach (static::nodeCandidates() as $bin) {
            if (is_executable($bin)) {
                return $bin;
            }
        }

        return $configured !== '' ? $configured : 'node';
    }

    /**
     * @return list<string>
     */
    public static function nodeCandidates(): array
    {
        $home = getenv('HOME') ?: (string) ($_SERVER['HOME'] ?? '');
        $out = [
            '/opt/homebrew/bin/node',
            '/usr/local/bin/node',
            '/usr/bin/node',
        ];

        if ($home === '') {
            return $out;
        }

        return array_values(array_filter(array_merge(
            $out,
            glob($home.'/Library/Application Support/Herd/config/nvm/versions/node/*/bin/node') ?: [],
            glob($home.'/.nvm/versions/node/*/bin/node') ?: []
        )));
    }

    public static function resolveCwd(): string
    {
        foreach ([
            config('statamic-visual-editor.tailwind.cwd'),
            base_path(),
            dirname(__DIR__),
        ] as $dir) {
            if (is_string($dir) && $dir !== '' && static::hasEngine($dir)) {
                return $dir;
            }
        }

        throw new RuntimeException(
            'Visual Editor compiles Tailwind on the server with the tailwindcss package. Install it in the site (no npm run build).'
        );
    }

    public static function hasEngine(string $dir): bool
    {
        return is_dir($dir.DIRECTORY_SEPARATOR.'node_modules'.DIRECTORY_SEPARATOR.'tailwindcss')
            && is_dir($dir.DIRECTORY_SEPARATOR.'node_modules'.DIRECTORY_SEPARATOR.'@tailwindcss'.DIRECTORY_SEPARATOR.'oxide');
    }
}
