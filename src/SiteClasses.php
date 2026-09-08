<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * The class names this site writes itself.
 *
 * Compositions and utilities are the ones nobody can remember and Tailwind has
 * never heard of — `cluster`, `flow-y`, `full-bleed` — so they belong in a list
 * you can pick from rather than in your head.
 *
 * Read from the source files, not from the built CSS, so a file that is written
 * but not yet imported still shows. It is marked instead: picking a class that
 * has no way onto the page should be a visible choice, not a silent one.
 */
class SiteClasses
{
    /**
     * @return list<array{group: string, items: list<array{name: string, loaded: bool, file: string}>}>
     */
    public static function grouped(): array
    {
        $root = SiteCss::root();

        if (! is_dir($root)) {
            return [];
        }

        $found = [];

        foreach (static::files($root) as $path) {
            $relative = ltrim(str_replace(str_replace('\\', '/', $root), '', str_replace('\\', '/', $path)), '/');
            $group = dirname($relative) === '.' ? '' : dirname($relative);
            $loaded = $relative === SiteCss::ENTRY || static::imported($relative);

            // A file in a folder is there to be reused — that is what the
            // folders are for. A file at the root is page styling, and only
            // the utilities it declares by name belong in a list to pick from.
            $css = (string) @file_get_contents($path);
            $names = $group === ''
                ? static::utilityNames($css)
                : static::names($css);

            foreach ($names as $name) {
                // A name written in two places counts as loaded if either is.
                if (isset($found[$name]) && $found[$name]['loaded']) {
                    continue;
                }

                $found[$name] = [
                    'name' => $name,
                    'loaded' => $loaded,
                    'file' => $relative,
                    'group' => $group,
                ];
            }
        }

        $groups = [];

        foreach ($found as $item) {
            $groups[$item['group']][] = [
                'name' => $item['name'],
                'loaded' => $item['loaded'],
                'file' => $item['file'],
            ];
        }

        ksort($groups);

        $out = [];

        foreach ($groups as $group => $items) {
            usort($items, fn ($a, $b) => strcmp($a['name'], $b['name']));

            $out[] = ['group' => $group, 'items' => $items];
        }

        return $out;
    }

    /**
     * `@utility name` and every class selector the file writes.
     *
     * @return list<string>
     */
    public static function names(string $css): array
    {
        return array_values(array_unique(array_merge(
            static::utilityNames($css),
            static::classNames($css)
        )));
    }

    /**
     * @return list<string>
     */
    public static function utilityNames(string $css): array
    {
        preg_match_all('/@utility\s+([A-Za-z][\w-]*)/', $css, $matches);

        return array_values(array_unique($matches[1] ?? []));
    }

    /**
     * @return list<string>
     */
    protected static function classNames(string $css): array
    {
        preg_match_all('/^\s*\.([A-Za-z][\w-]*)[\s,{:]/m', $css, $matches);

        return array_values(array_unique($matches[1] ?? []));
    }

    /**
     * @return list<string>
     */
    protected static function files(string $dir): array
    {
        $out = [];

        foreach (@scandir($dir) ?: [] as $entry) {
            if ($entry === '.' || $entry === '..' || str_starts_with($entry, '.')) {
                continue;
            }

            $path = $dir.'/'.$entry;

            if (is_dir($path)) {
                $out = array_merge($out, static::files($path));

                continue;
            }

            if (str_ends_with(strtolower($entry), '.css')) {
                $out[] = $path;
            }
        }

        return $out;
    }

    protected static function imported(string $relative): bool
    {
        try {
            return ! empty(SiteCss::read($relative)['imported']);
        } catch (\Throwable) {
            return false;
        }
    }
}
