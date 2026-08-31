<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Contracts\Entries\Collection as CollectionContract;
use Symfony\Component\Yaml\Yaml;

/**
 * Designed starting points for a collection — blueprint + index/show views.
 *
 * The collection handle does not matter. A "cases" pack can be applied to Work
 * or News. Packs live on the site (VS Code); this only copies them in.
 *
 * Each folder:
 *   preset.yaml              title, optional description
 *   blueprint.yaml           optional
 *   index.antlers.html       optional — use __COLLECTION__ for the handle
 *   show.antlers.html        optional
 */
class CollectionPresets
{
    public const PLACEHOLDER = '__COLLECTION__';

    public static function directory(): string
    {
        $configured = config('statamic-visual-editor.collection_templates.presets');

        if (is_string($configured) && $configured !== '') {
            return rtrim($configured, '/');
        }

        return resource_path('visual-editor/collection-presets');
    }

    /**
     * @return list<array{handle: string, title: string, description: string}>
     */
    public static function all(): array
    {
        $root = static::directory();

        if (! is_dir($root)) {
            return [];
        }

        $presets = [];

        foreach (scandir($root) ?: [] as $name) {
            if ($name === '.' || $name === '..' || ! static::validHandle($name)) {
                continue;
            }

            $dir = $root.DIRECTORY_SEPARATOR.$name;

            if (! is_dir($dir) || ! is_file($dir.DIRECTORY_SEPARATOR.'preset.yaml')) {
                continue;
            }

            $meta = static::meta($name);

            $presets[] = [
                'handle' => $name,
                'title' => $meta['title'],
                'description' => $meta['description'],
            ];
        }

        usort($presets, fn ($a, $b) => strnatcasecmp($a['title'], $b['title']));

        return $presets;
    }

    /**
     * @return array{blueprint: bool, index: ?string, show: ?string}|null
     */
    public static function apply(CollectionContract $collection, string $preset): ?array
    {
        if (! Features::enabled('collection_templates')) {
            return null;
        }

        $handle = $collection->handle();
        $dir = static::folder($preset);

        if (! $dir) {
            return null;
        }

        $copied = [
            'blueprint' => false,
            'index' => null,
            'show' => null,
        ];

        if ($blueprint = static::read($dir, 'blueprint.yaml')) {
            $destDir = resource_path('blueprints/collections/'.$handle);
            static::write($destDir.DIRECTORY_SEPARATOR.$handle.'.yaml', $blueprint, $handle);
            $copied['blueprint'] = true;
        }

        if (static::read($dir, 'index.antlers.html') !== null) {
            $view = $handle.'/index';
            static::write(
                resource_path('views/'.$view.'.antlers.html'),
                static::read($dir, 'index.antlers.html'),
                $handle
            );
            $copied['index'] = $view;
            CollectionViewTemplates::ensure($handle, 'index', $view, $collection->title());
        }

        if (static::read($dir, 'show.antlers.html') !== null) {
            $view = $handle.'/show';
            static::write(
                resource_path('views/'.$view.'.antlers.html'),
                static::read($dir, 'show.antlers.html'),
                $handle
            );
            $copied['show'] = $view;
            CollectionViewTemplates::ensure($handle, 'show', $view, $collection->title());
            $collection->template($view)->save();
        } elseif ($copied['index']) {
            $collection->template($copied['index'])->save();
        }

        return $copied;
    }

    public static function substitute(string $contents, string $handle): string
    {
        return str_replace(static::PLACEHOLDER, $handle, $contents);
    }

    public static function validHandle(string $handle): bool
    {
        return (bool) preg_match('/^[a-z0-9][a-z0-9_-]*$/', $handle);
    }

    /**
     * @return array{title: string, description: string}
     */
    protected static function meta(string $handle): array
    {
        $dir = static::folder($handle);
        $raw = $dir ? static::read($dir, 'preset.yaml') : null;
        $parsed = is_string($raw) ? Yaml::parse($raw) : [];
        $parsed = is_array($parsed) ? $parsed : [];

        return [
            'title' => is_string($parsed['title'] ?? null) && $parsed['title'] !== ''
                ? $parsed['title']
                : ucfirst(str_replace(['-', '_'], ' ', $handle)),
            'description' => is_string($parsed['description'] ?? null)
                ? $parsed['description']
                : '',
        ];
    }

    protected static function folder(string $handle): ?string
    {
        if (! static::validHandle($handle)) {
            return null;
        }

        $root = realpath(static::directory());
        $dir = $root ? realpath($root.DIRECTORY_SEPARATOR.$handle) : false;

        if (! $root || ! $dir || ! str_starts_with($dir, $root.DIRECTORY_SEPARATOR) || ! is_dir($dir)) {
            return null;
        }

        return $dir;
    }

    protected static function read(string $dir, string $name): ?string
    {
        $path = $dir.DIRECTORY_SEPARATOR.$name;

        if (! is_file($path)) {
            return null;
        }

        $contents = file_get_contents($path);

        return is_string($contents) ? $contents : null;
    }

    protected static function write(string $path, string $contents, string $handle): void
    {
        $dir = dirname($path);

        if (! is_dir($dir) && ! @mkdir($dir, 0775, true) && ! is_dir($dir)) {
            throw new \RuntimeException('Could not create '.$dir);
        }

        file_put_contents($path, static::substitute($contents, $handle));
    }
}
