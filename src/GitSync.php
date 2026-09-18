<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Git;

/**
 * Editing on the server meets deploying from git.
 *
 * Most section work happens on the live server, in Live Preview. The site is
 * deployed by pulling from git (Ploi), so everything the editor writes on the
 * server has to be committed and pushed from the server — or the next deploy
 * fails on the local changes, or wipes them.
 *
 * Statamic's git automation (config/statamic/git.php, STATAMIC_GIT_*) already
 * commits the content it knows about. It does not know the files this addon
 * writes: section templates, the baked Tailwind CSS, site CSS, component
 * partials, the dock's history and comments. This class adds those paths and,
 * after each write, does what a Control Panel save does — asks Statamic to
 * commit — when the site runs with automatic commits. With automatic commits
 * off, `php please git:commit` on a schedule (the site's routes/console.php)
 * picks everything up in one go, which is the model for a dock that saves
 * every few seconds.
 */
class GitSync
{
    /** What the editor writes that Statamic's own path list does not cover. */
    public static function paths(): array
    {
        return [
            resource_path('views'),
            resource_path('visual-editor'),
            resource_path('css'),
            storage_path('statamic-visual-editor'),
        ];
    }

    /** At boot: make Statamic's commit include the editor's files. */
    public static function register(): void
    {
        $paths = (array) config('statamic.git.paths', []);

        config(['statamic.git.paths' => array_values(array_unique(array_merge($paths, static::paths())))]);
    }

    /**
     * After a successful write: a commit, the way a CP save gets one — only
     * when the site has git automation on and wants a commit per save.
     */
    public static function after(string $what): void
    {
        if (! config('statamic.git.enabled') || ! config('statamic.git.automatic')) {
            return;
        }

        try {
            Git::dispatchCommit('Visual Editor: '.$what);
        } catch (\Throwable $e) {
            report($e);
        }
    }
}
