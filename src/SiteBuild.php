<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;

/**
 * The site's own CSS build, run on the server from Live Preview: what a
 * deploy's `npm run build` does — Vite with the site's vite.config, into
 * public/build.
 *
 * The Theme panel's Utilities tab saves `@utility` blocks into site.css. A
 * utility is a rule Tailwind sorts into the built stylesheet, not a value the
 * site's `{{ theme_tokens }}` tag can override on `:root`, so the page shows a
 * changed one only once public/build is built again. This does that a second
 * or two after the save instead of at the next deploy.
 *
 * It needs Node and the site's node_modules (Vite) — the deploy's `npm ci`
 * puts them there. Without them nothing runs and the answer says so; site.css
 * is saved either way, and the next deploy builds it.
 */
class SiteBuild
{
    /**
     * @return array{ok: bool, css?: string, ms?: int, reason?: string}
     */
    public static function run(): array
    {
        $cwd = base_path();
        $vite = $cwd.DIRECTORY_SEPARATOR.'node_modules'.DIRECTORY_SEPARATOR.'vite'.DIRECTORY_SEPARATOR.'bin'.DIRECTORY_SEPARATOR.'vite.js';
        $node = TailwindCompile::node();

        if (! is_file($vite)) {
            return ['ok' => false, 'reason' => 'no-vite'];
        }

        if (! is_file($node) || ! is_executable($node)) {
            return ['ok' => false, 'reason' => 'no-node'];
        }

        // One build at a time. A save that comes while another builds waits,
        // then builds again — with the newer site.css.
        $lock = fopen(storage_path('framework/sve-site-build.lock'), 'c');

        if ($lock === false || ! flock($lock, LOCK_EX)) {
            return ['ok' => false, 'reason' => 'locked'];
        }

        try {
            @set_time_limit(180);

            $started = hrtime(true);
            $process = new Process([$node, $vite, 'build'], $cwd, [
                'PATH' => dirname($node).':/usr/local/bin:/usr/bin:/bin',
                'HOME' => getenv('HOME') ?: (string) ($_SERVER['HOME'] ?? $cwd),
                'LANG' => 'en_US.UTF-8',
            ], null, 150);
            $process->run();
            $ms = (int) ((hrtime(true) - $started) / 1_000_000);
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }

        if (! $process->isSuccessful()) {
            Log::warning('[sve] site build failed', [
                'exit' => $process->getExitCode(),
                'output' => mb_substr(trim($process->getErrorOutput().' '.$process->getOutput()), -2000),
            ]);

            return ['ok' => false, 'reason' => 'failed'];
        }

        $css = static::entryCss();

        return $css ? ['ok' => true, 'css' => $css, 'ms' => $ms] : ['ok' => false, 'reason' => 'no-manifest'];
    }

    /**
     * The built file the site's stylesheet entry points at now,
     * `/build/assets/site-XXXX.css`, from public/build/manifest.json.
     */
    public static function entryCss(): ?string
    {
        $source = TailwindTheme::path();
        $manifest = json_decode((string) @file_get_contents(public_path('build/manifest.json')), true);

        if ($source === null || ! is_array($manifest)) {
            return null;
        }

        $entry = ltrim(str_replace('\\', '/', substr($source, strlen(base_path()))), '/');
        $file = $manifest[$entry]['file'] ?? null;

        return is_string($file) && str_ends_with($file, '.css') ? '/build/'.$file : null;
    }
}
