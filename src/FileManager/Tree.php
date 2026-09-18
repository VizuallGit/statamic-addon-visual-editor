<?php

namespace MarioHamann\StatamicVisualEditor\FileManager;

/**
 * The editable tree the browser shows, and which editor mode opens a file.
 * Moved verbatim out of FileManager in WP7d.
 */
final class Tree
{
    /**
     * @return array{root: string, tree: list<array<string, mixed>>}
     */
    public static function listing(): array
    {
        $root = Root::root();

        return [
            'root' => Root::relativeRoot(),
            'tree' => is_dir($root) ? static::scan($root, '') : [],
        ];
    }

    /**
     * The editable tree. Folders whose whole contents are invisible are left
     * out — an empty branch is noise, not information.
     *
     * @return list<array<string, mixed>>
     */
    protected static function scan(string $dir, string $prefix): array
    {
        $items = [];

        foreach (@scandir($dir) ?: [] as $name) {
            if (! Root::visible($name) || in_array($name, Root::excluded(), true)) {
                continue;
            }

            $rel = $prefix === '' ? $name : $prefix.'/'.$name;
            $full = $dir.'/'.$name;

            if (is_link($full)) {
                continue;
            }

            if (is_dir($full)) {
                $children = static::scan($full, $rel);

                if ($children === []) {
                    continue;
                }

                $items[] = [
                    'type' => 'dir',
                    'path' => $rel,
                    'name' => $name,
                    'children' => $children,
                ];

                continue;
            }

            if (! Root::extensionOk($name)) {
                continue;
            }

            $items[] = [
                'type' => 'file',
                'path' => $rel,
                'name' => $name,
                'language' => static::language($rel),
            ];
        }

        usort($items, function (array $a, array $b) {
            if ($a['type'] !== $b['type']) {
                return $a['type'] === 'dir' ? -1 : 1;
            }

            return strnatcasecmp($a['name'] ?? '', $b['name'] ?? '');
        });

        return array_values($items);
    }

    /**
     * Which CodeMirror mode opens this file.
     *
     * Antlers is HTML with braces in it, so it gets the HTML mode — the same
     * choice the template dock already makes.
     */
    public static function language(string $relative): string
    {
        $name = strtolower(basename($relative));
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));

        if (str_ends_with($name, '.antlers.html') || $ext === 'html' || $ext === 'svg' || $ext === 'vue') {
            return 'html';
        }

        return match ($ext) {
            'css' => 'css',
            'js', 'mjs', 'json' => 'javascript',
            'yaml', 'yml' => 'yaml',
            default => 'text',
        };
    }
}
