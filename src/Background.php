<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\Process;
use Symfony\Component\Process\PhpExecutableFinder;

/**
 * Work that takes longer than a web request may live: started as its own
 * `artisan` process, detached, so it outlives the request and no web server
 * can end it — the demo's nginx and PHP-FPM both stop a request at 30 s,
 * server-wide, and an AI answer can take longer. The browser asks for the
 * result afterwards.
 *
 * No queue: the site has none and is not to get one. `nohup … &` is the whole
 * mechanism, as PreviewRefresher starts `sve:previews`.
 */
final class Background
{
    /** Starts `artisan {command} {argument}` and returns at once. */
    public static function artisan(string $command, string $argument): void
    {
        // The shell puts the process in the background and returns at once;
        // nohup and the redirects let it outlive this request. The PHP that
        // runs it is the CLI one — under PHP-FPM, PHP_BINARY is php-fpm.
        Process::path(base_path())
            ->env(['PATH' => '/opt/homebrew/bin:/usr/local/bin:'.(getenv('PATH') ?: '/usr/bin:/bin')])
            ->run(sprintf(
                'nohup %s %s %s %s > /dev/null 2>&1 &',
                escapeshellarg((new PhpExecutableFinder)->find(false) ?: 'php'),
                escapeshellarg(base_path('artisan')),
                $command,
                escapeshellarg($argument),
            ));
    }
}
