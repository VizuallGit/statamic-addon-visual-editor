<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers\EntryActivityController;

/**
 * What differs between two revisions of an entry, named the way the Edits
 * popup shows it: fields, sections added/removed/updated/reordered, and
 * the parts of a section that changed.
 * Moved verbatim out of EntryActivityController in WP7d.
 */
final class Changes
{
    /**
     * What actually moved between two snapshots: page fields, and which section
     * (and which block inside it) when the builder changed.
     *
     * @return list<array{action: string, handle?: string, section?: string, parts?: list<string>}>
     */
    public static function changedFields(array $previous, array $current): array
    {
        $changes = [];
        $builder = config('statamic-visual-editor.previews.field', 'page_sections');

        if (($previous['slug'] ?? null) !== ($current['slug'] ?? null)) {
            $changes[] = ['action' => 'updated', 'handle' => 'slug'];
        }

        if (($previous['published'] ?? null) !== ($current['published'] ?? null)) {
            $changes[] = ['action' => 'updated', 'handle' => 'published'];
        }

        $prevData = is_array($previous['data'] ?? null) ? $previous['data'] : [];
        $currData = is_array($current['data'] ?? null) ? $current['data'] : [];
        $skip = ['updated_at', 'updated_by'];

        foreach (array_unique([...array_keys($prevData), ...array_keys($currData)]) as $handle) {
            if (in_array($handle, $skip, true)) {
                continue;
            }

            if ($handle === $builder) {
                array_push($changes, ...static::sectionChanges(
                    is_array($prevData[$handle] ?? null) ? $prevData[$handle] : [],
                    is_array($currData[$handle] ?? null) ? $currData[$handle] : []
                ));

                continue;
            }

            if (static::encode($prevData[$handle] ?? null) !== static::encode($currData[$handle] ?? null)) {
                $changes[] = ['action' => 'updated', 'handle' => $handle];
            }
        }

        return $changes;
    }

    /**
     * @param  list<mixed>  $previous
     * @param  list<mixed>  $current
     * @return list<array{action: string, section: string, parts?: list<string>}>
     */
    protected static function sectionChanges(array $previous, array $current): array
    {
        $prev = static::indexRows($previous);
        $curr = static::indexRows($current);
        $changes = [];

        foreach (array_diff_key($curr, $prev) as $row) {
            $changes[] = ['action' => 'added', 'section' => static::sectionName($row)];
        }

        foreach (array_diff_key($prev, $curr) as $row) {
            $changes[] = ['action' => 'removed', 'section' => static::sectionName($row)];
        }

        foreach (array_intersect_key($curr, $prev) as $key => $row) {
            $parts = static::changedParts($prev[$key], $row);

            if ($parts) {
                $changes[] = [
                    'action' => 'updated',
                    'section' => static::sectionName($row),
                    'parts' => $parts,
                ];
            }
        }

        if (! $changes && static::rowKeys($previous) !== static::rowKeys($current)) {
            $changes[] = ['action' => 'reordered', 'handle' => 'page_sections'];
        }

        return $changes;
    }

    /**
     * @param  list<mixed>  $rows
     * @return array<string, array>
     */
    protected static function indexRows(array $rows): array
    {
        $map = [];

        foreach ($rows as $i => $row) {
            if (! is_array($row)) {
                continue;
            }

            $key = (string) ($row['id'] ?? $row['_visual_id'] ?? '#'.$i);
            $map[$key] = $row;
        }

        return $map;
    }

    /** @param  list<mixed>  $rows */
    protected static function rowKeys(array $rows): array
    {
        return array_keys(static::indexRows($rows));
    }

    protected static function sectionName(array $section): string
    {
        $custom = trim((string) ($section['_sve_label'] ?? ''));

        if ($custom !== '') {
            return $custom;
        }

        $type = (string) ($section['type'] ?? 'section');

        return ucwords(str_replace(['/', '_', '-'], ' ', $type));
    }

    /**
     * @return list<string>
     */
    protected static function changedParts(array $previous, array $current): array
    {
        $parts = [];
        $skip = ['id', '_id', '_visual_id', 'enabled', 'type', '_sve_label', '_sve_sync'];
        $nested = ['blocks', 'content_block', 'list', 'items', 'sets'];

        foreach (array_unique([...array_keys($previous), ...array_keys($current)]) as $handle) {
            if (in_array($handle, $skip, true)) {
                continue;
            }

            $was = $previous[$handle] ?? null;
            $now = $current[$handle] ?? null;

            if (in_array($handle, $nested, true) && (is_array($was) || is_array($now))) {
                $parts = array_merge($parts, static::changedBlocks((array) $was, (array) $now));

                continue;
            }

            if (static::encode($was) !== static::encode($now)) {
                $parts[] = $handle;
            }
        }

        return array_values(array_unique($parts));
    }

    /**
     * @return list<string>
     */
    protected static function changedBlocks(array $previous, array $current): array
    {
        $prev = static::indexRows($previous);
        $curr = static::indexRows($current);
        $parts = [];

        foreach (array_diff_key($curr, $prev) as $row) {
            $parts[] = static::blockName($row);
        }

        foreach (array_diff_key($prev, $curr) as $row) {
            $parts[] = static::blockName($row);
        }

        foreach (array_intersect_key($curr, $prev) as $key => $row) {
            if (static::encode($prev[$key]) !== static::encode($row)) {
                $inner = static::changedParts($prev[$key], $row);

                if ($inner) {
                    array_push($parts, ...$inner);
                } else {
                    $parts[] = static::blockName($row);
                }
            }
        }

        return array_values(array_filter(array_unique($parts)));
    }

    protected static function blockName(array $block): string
    {
        $type = (string) ($block['type'] ?? '');

        return $type !== '' ? $type : 'block';
    }

    protected static function encode(mixed $value): string
    {
        return json_encode(static::stripNoise($value)) ?: '';
    }

    protected static function stripNoise(mixed $value): mixed
    {
        if (! is_array($value)) {
            return $value;
        }

        foreach (['updated_at', 'updated_by', '_visual_id'] as $key) {
            unset($value[$key]);
        }

        return array_map(fn ($item) => static::stripNoise($item), $value);
    }
}
