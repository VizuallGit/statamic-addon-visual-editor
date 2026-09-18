<?php

namespace MarioHamann\StatamicVisualEditor\LibraryAccess;

use MarioHamann\StatamicVisualEditor\GitSync;
use MarioHamann\StatamicVisualEditor\Stores;
use Statamic\Facades\YAML;

/**
 * The sweep: walking an entry's data tree for section types and global
 * section ids, and writing the snapshot file the limit is enforced from.
 * Moved verbatim out of LibraryAccess in WP7d.
 */
final class Scan
{
    /**
     * Collects section types and global-section ids out of an entry's data tree.
     *
     * `$eligible` says whether the list being walked is one sections live in, set
     * from the key holding it — so a `blocks` list inside a section contributes
     * nothing, however much its rows look like sections. A matched row is still
     * descended into: a section can hold a nested page-builder field of its own.
     *
     * @param  array<string, true>  $types
     * @param  array<string, true>  $globals
     */
    public static function walk(mixed $node, string $scope, string $set, array &$types, array &$globals, bool $eligible = false): void
    {
        if (! is_array($node)) {
            return;
        }

        if (array_is_list($node)) {
            foreach ($node as $item) {
                if ($eligible && is_array($item) && isset($item['type'])) {
                    $type = (string) $item['type'];

                    if ($type === $set) {
                        foreach (array_map('strval', (array) ($item[$set] ?? [])) as $id) {
                            $globals[$id] = true;
                        }
                    } else {
                        $types[$type] = true;
                    }
                }

                static::walk($item, $scope, $set, $types, $globals, $eligible);
            }

            return;
        }

        foreach ($node as $key => $value) {
            static::walk($value, $scope, $set, $types, $globals, $key === $scope);
        }
    }

    /** Writes the snapshot, making its folder if this is the first scan. */
    public static function write(array $snapshot): void
    {
        $path = static::path();
        $dir = dirname($path);

        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        file_put_contents($path, static::header().YAML::dump($snapshot));
        GitSync::after('library access');
    }

    /** A note at the top of the file, for whoever finds it in a diff. */
    protected static function header(): string
    {
        return <<<'YAML'
        # Written by the Visual Editor's "Scan the site" button.
        #
        # The section types and global sections this site was using when the scan
        # was taken. While the matching setting is on, everyone but a super admin
        # sees only these in the section library. Editing it by hand works, but
        # the next scan overwrites it.

        YAML;
    }

    /** The field sections live in — the only list a section can be found in. */
    public static function scope(): string
    {
        return config('statamic-visual-editor.previews.field', 'page_sections');
    }

    /** The Replicator set a page uses to reference a synced section. */
    public static function globalSet(): string
    {
        return config('statamic-visual-editor.saved_sections.set', 'global_section');
    }

    /** The editor's own collections — libraries, not pages. */
    public static function stores(): array
    {
        return Stores::all();
    }

    /** Where the snapshot lives. Under resources/, so it deploys with the site. */
    public static function path(): string
    {
        return config('statamic-visual-editor.library.snapshot')
            ?: base_path('resources/visual-editor/library-snapshot.yaml');
    }

    /** @param  array<string, true>  $found */
    public static function sorted(array $found): array
    {
        $keys = array_keys($found);

        sort($keys, SORT_NATURAL | SORT_FLAG_CASE);

        return $keys;
    }

    public static function strings(mixed $value): array
    {
        return array_values(array_unique(array_map('strval', (array) $value)));
    }
}
