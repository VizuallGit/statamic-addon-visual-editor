<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * How often the site actually writes each of its own class names.
 *
 * Two numbers, and the second is the one that keeps the dock's undo safe:
 *
 *   `now`     — in `resources/views` and `content`, the files the site renders
 *               from today. This is what "unused" means.
 *   `history` — only in the dock's own version history. A class nothing uses
 *               today but an older version of a template still has. Tailwind
 *               reads that folder too, so the rule is still in the built CSS
 *               and rolling back keeps its styling. Deleting such a class is
 *               what breaks a rollback, so the panel says so instead of
 *               quietly calling it unused.
 *
 * Counting is by whole word: `card` is not a hit inside `card-header`.
 */
class ClassUsage
{
    /** Files bigger than this are skipped — a stylesheet or a dump, not markup. */
    protected const MAX_BYTES = 2_000_000;

    /**
     * `{ name: { now, history, files } }` for the names asked about. `files`
     * are the live files that write it, at most a handful, for "where".
     *
     * @param  list<string>  $names
     * @return array<string, array{now: int, history: int, files: list<string>}>
     */
    public static function count(array $names, ?string $base = null): array
    {
        $root = rtrim($base ?? base_path(), '/');
        $wanted = array_flip(array_filter(array_map('strval', $names)));
        $out = [];

        foreach ($wanted as $name => $_) {
            $out[$name] = ['now' => 0, 'history' => 0, 'files' => []];
        }

        foreach (['now' => static::liveDirs($root), 'history' => [$root.'/storage/statamic-visual-editor/history']] as $kind => $dirs) {
            foreach ($dirs as $dir) {
                if (! is_dir($dir)) {
                    continue;
                }

                foreach (static::walk($dir) as $path) {
                    $text = @file_get_contents($path);

                    if ($text === false || strlen($text) > static::MAX_BYTES) {
                        continue;
                    }

                    $relative = ltrim(str_replace($root, '', $path), '/');

                    foreach (static::tokens($text) as $token => $hits) {
                        if (! isset($wanted[$token])) {
                            continue;
                        }

                        $out[$token][$kind] += $hits;

                        if ($kind === 'now' && count($out[$token]['files']) < 8 && ! in_array($relative, $out[$token]['files'], true)) {
                            $out[$token]['files'][] = $relative;
                        }
                    }
                }
            }
        }

        return $out;
    }

    /** Where the site renders from — the same ground Tailwind's @source covers. */
    protected static function liveDirs(string $root): array
    {
        return [$root.'/resources/views', $root.'/content', $root.'/resources/fieldsets'];
    }

    /**
     * Every class-shaped word in a file, with how often it occurs.
     *
     * @return array<string, int>
     */
    protected static function tokens(string $text): array
    {
        preg_match_all('/[A-Za-z_][A-Za-z0-9_-]*/', $text, $m);

        return array_count_values($m[0] ?? []);
    }

    /** Every readable file under a folder, dot-folders left out. */
    protected static function walk(string $dir): array
    {
        $out = [];

        foreach (@scandir($dir) ?: [] as $entry) {
            if ($entry === '.' || $entry === '..' || str_starts_with($entry, '.')) {
                continue;
            }

            $path = $dir.'/'.$entry;

            if (is_dir($path)) {
                $out = array_merge($out, static::walk($path));
            } elseif (is_file($path)) {
                $out[] = $path;
            }
        }

        return $out;
    }
}
