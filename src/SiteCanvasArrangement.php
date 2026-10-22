<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\File;
use Statamic\Facades\YAML;

/**
 * How the pages stand on the site canvas (resources/js/site-canvas.js): the
 * columns of the pages line, left to right, each a list of entry ids top to
 * bottom. An editor drags a page into another column, or out between two to
 * start one of its own; the canvas posts the columns here, and every open
 * draws them. One file per site under storage/statamic-visual-editor, as the
 * comments are: the canvas is the site's map, so every editor sees the same.
 *
 * The file is laid over the pages that exist now, never trusted alone: an id
 * no longer in the collection is dropped, one listed twice is kept once (its
 * first place), and a page the file does not know is appended as a column of
 * its own, in the collection's order — so a page added or removed in the
 * Control Panel takes its place without a hand on the file. Untouched, the
 * canvas is the collection's order, one page a column.
 */
class SiteCanvasArrangement
{
    /** The columns for `$site`, over the entries that exist now (`$ids`, in the collection's order). */
    public function columns(string $site, array $ids): array
    {
        return static::merge($this->saved($site), $ids);
    }

    /** Write `$columns` for `$site`, laid over `$ids` first so what is kept is what will be read. */
    public function save(string $site, array $columns, array $ids): array
    {
        $columns = static::merge($columns, $ids);
        $path = $this->path($site);
        $dir = dirname($path);

        if (! File::isDirectory($dir)) {
            File::makeDirectory($dir, 0755, true);
        }

        File::put($path, YAML::dump(['columns' => $columns]));

        return $columns;
    }

    /**
     * `$columns` as they can be drawn over `$ids`: ids that are not `$ids`'
     * out, a repeated id kept at its first place, empty columns gone, and
     * every id of `$ids` the columns do not name appended as a column of
     * its own in `$ids`' order.
     *
     * @param  list<string>  $ids
     * @return list<list<string>>
     */
    public static function merge(array $columns, array $ids): array
    {
        $exists = array_fill_keys(array_map('strval', $ids), true);
        $seen = [];
        $out = [];

        foreach ($columns as $column) {
            if (! is_array($column)) {
                continue;
            }

            $kept = [];

            foreach ($column as $id) {
                if ((is_string($id) || is_int($id)) && isset($exists[(string) $id]) && ! isset($seen[(string) $id])) {
                    $kept[] = (string) $id;
                    $seen[(string) $id] = true;
                }
            }

            if ($kept !== []) {
                $out[] = $kept;
            }
        }

        foreach ($ids as $id) {
            if (! isset($seen[(string) $id])) {
                $out[] = [(string) $id];
                $seen[(string) $id] = true;
            }
        }

        return $out;
    }

    /** What the file says, as it says it; nothing without a file. */
    public function saved(string $site): array
    {
        $path = $this->path($site);

        if (! File::exists($path)) {
            return [];
        }

        $parsed = YAML::file($path)->parse() ?: [];
        $columns = $parsed['columns'] ?? [];

        return is_array($columns) ? $columns : [];
    }

    public function path(string $site): string
    {
        return storage_path('statamic-visual-editor/site-canvas/'.preg_replace('/[^A-Za-z0-9_-]/', '-', $site).'.yaml');
    }
}
