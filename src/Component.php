<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * A component: one Antlers partial under `resources/views/partials/components`,
 * written in the same HTML / CSS / JS shape the template dock reads.
 *
 * That shape is the whole point. A component made of markup alone would leave
 * its styling behind in the section it came from — so the file is built with
 * `SectionTemplate::join()`, exactly like a collection view file, and it gets
 * its own Tailwind key (`view/partials/components/{name}`). Once it exists the
 * dock can open it as `view:partials/components/{name}` and edit all three
 * panes, and its Tailwind compiles against its own markup.
 */
class Component
{
    public const FOLDER = 'partials/components';

    /** Lowercase, no slashes — one flat folder, so a name cannot walk out of it. */
    public static function normalizeName(string $name): ?string
    {
        $name = strtolower(trim(str_replace(['\\', ' ', '-'], ['/', '_', '_'], $name)));
        $name = preg_replace('/\.(antlers\.html|blade\.php)$/', '', $name) ?? $name;
        $name = preg_replace('/[^a-z0-9_]/', '', $name) ?? '';
        $name = trim($name, '_');

        if ($name === '' || strlen($name) > 60 || ! preg_match('/^[a-z]/', $name)) {
            return null;
        }

        return $name;
    }

    public static function view(string $name): string
    {
        return self::FOLDER.'/'.$name;
    }

    /** What the section writes in place of the markup it gave up. */
    public static function tag(string $name): string
    {
        return '{{ partial:components/'.$name.' }}';
    }

    public static function twHandle(string $name): string
    {
        return 'view/'.self::view($name);
    }

    public static function path(string $name): string
    {
        return resource_path('views/'.self::view($name).'.antlers.html');
    }

    public static function exists(string $name): bool
    {
        return is_file(static::path($name));
    }

    /**
     * Every component on this site, by name.
     *
     * @return list<array{name: string, view: string, type: string, tag: string}>
     */
    public static function all(): array
    {
        $dir = resource_path('views/'.self::FOLDER);

        if (! is_dir($dir)) {
            return [];
        }

        $out = [];

        foreach (scandir($dir) ?: [] as $file) {
            if (! str_ends_with($file, '.antlers.html')) {
                continue;
            }

            $name = substr($file, 0, -strlen('.antlers.html'));

            // The folder is the site's own, so it can hold files this addon
            // never made. A name it could not have written is still a partial
            // worth offering — it just cannot be addressed by a bad name.
            if (static::normalizeName($name) !== $name) {
                continue;
            }

            $out[] = [
                'name' => $name,
                'view' => static::view($name),
                'type' => CollectionViewFile::PREFIX.static::view($name),
                'tag' => static::tag($name),
            ];
        }

        usort($out, fn (array $a, array $b) => strnatcasecmp($a['name'], $b['name']));

        return $out;
    }

    /**
     * @return array{name: string, view: string, type: string, tag: string, path: string}|null
     */
    public static function create(string $name, string $html, string $css, string $js, string $tw): ?array
    {
        $dir = dirname(static::path($name));

        if (! is_dir($dir) && ! @mkdir($dir, 0755, true) && ! is_dir($dir)) {
            return null;
        }

        // An empty split-handle, like a view file: a component is not a designed
        // section type, so it must not start locked.
        $contents = SectionTemplate::join([
            'html' => $html,
            'css' => $css,
            'js' => $js,
            'tw' => $tw,
            'locked' => false,
        ], '', static::twHandle($name));

        if (file_put_contents(static::path($name), $contents) === false) {
            return null;
        }

        return [
            'name' => $name,
            'view' => static::view($name),
            'type' => CollectionViewFile::PREFIX.static::view($name),
            'tag' => static::tag($name),
            'path' => SectionTemplate::relative(static::path($name)),
        ];
    }
}
