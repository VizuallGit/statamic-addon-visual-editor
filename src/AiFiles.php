<?php

namespace MarioHamann\StatamicVisualEditor;

use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Yaml\Yaml;

/**
 * Super-admin AI may create and edit Statamic YAML / Antlers under a short
 * allowlist. Anything else — vendor, .env, PHP, content entries — is refused.
 */
class AiFiles
{
    public const MAX_BYTES = 200000;

    /**
     * @return list<string>
     */
    public static function roots(): array
    {
        return [
            resource_path('fieldsets'),
            resource_path('blueprints'),
            resource_path('views/partials/page_sections'),
            resource_path('visual-editor'),
        ];
    }

    /**
     * Absolute path for a relative site file, or null when it is not allowed.
     *
     * `$mustExist` is for reads. Writes may point at a file that is not there
     * yet; the parent directory is created when it sits inside an allowed root.
     */
    public static function allowed(string $relative): bool
    {
        $relative = str_replace('\\', '/', trim($relative));
        $relative = ltrim($relative, '/');

        if ($relative === '' || str_contains($relative, '..')) {
            return false;
        }

        if (! preg_match('/^[A-Za-z0-9][A-Za-z0-9_\/.-]*$/', $relative)) {
            return false;
        }

        $norm = str_replace('\\', '/', $relative);

        if (str_starts_with($norm, 'resources/visual-editor/')) {
            return $norm === 'resources/visual-editor/ai-rules.md';
        }

        if (! static::extensionOk($relative)) {
            return false;
        }

        $root = realpath(base_path()) ?: base_path();
        $candidate = $root.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $relative);

        return static::underAllowedRoot($candidate, $root);
    }

    public static function resolve(string $relative, bool $mustExist = false): ?string
    {
        $relative = str_replace('\\', '/', trim($relative));
        $relative = ltrim($relative, '/');

        if ($relative === '' || str_contains($relative, '..')) {
            return null;
        }

        if (! preg_match('/^[A-Za-z0-9][A-Za-z0-9_\/.-]*$/', $relative)) {
            return null;
        }

        $norm = str_replace('\\', '/', $relative);

        if (str_starts_with($norm, 'resources/visual-editor/') && $norm !== 'resources/visual-editor/ai-rules.md') {
            return null;
        }

        if (! static::extensionOk($relative)) {
            return null;
        }

        $root = realpath(base_path()) ?: base_path();
        $candidate = $root.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $relative);

        if (! static::underAllowedRoot($candidate, $root)) {
            return null;
        }

        if ($mustExist) {
            $real = is_file($candidate) ? realpath($candidate) : false;

            return $real !== false && static::underAllowedRoot($real, $root) ? $real : null;
        }

        $dir = dirname($candidate);

        if (! is_dir($dir) && ! @mkdir($dir, 0775, true) && ! is_dir($dir)) {
            return null;
        }

        $dirReal = realpath($dir);

        if ($dirReal === false || ! static::underAllowedRoot($dirReal.DIRECTORY_SEPARATOR.'x', $root)) {
            return null;
        }

        return $candidate;
    }

    public static function read(string $relative): string
    {
        $path = static::resolve($relative, true);

        abort_unless($path, 422, 'That file is not readable from here.');

        return (string) file_get_contents($path);
    }

    public static function write(string $relative, string $contents): string
    {
        abort_unless(strlen($contents) <= static::MAX_BYTES, 422, 'File is too large.');

        $path = static::resolve($relative, false);

        abort_unless($path, 422, 'That path is not allowed. Stay under resources/fieldsets, resources/blueprints or resources/views/partials/page_sections. YAML or .antlers.html only.');

        if (static::isYaml($relative)) {
            try {
                Yaml::parse($contents);
            } catch (ParseException $e) {
                abort(422, 'Invalid YAML: '.$e->getMessage());
            }
        }

        file_put_contents($path, $contents);

        return SectionTemplate::relative($path);
    }

    /**
     * @return list<string>
     */
    public static function list(string $relativeDir): array
    {
        $relativeDir = str_replace('\\', '/', trim($relativeDir, '/'));

        if ($relativeDir === '') {
            $relativeDir = 'resources/fieldsets';
        }

        if (str_contains($relativeDir, '..') || ! preg_match('/^[A-Za-z0-9][A-Za-z0-9_\/.-]*$/', $relativeDir)) {
            abort(422, 'That folder is not allowed.');
        }

        $root = realpath(base_path()) ?: base_path();
        $dir = $root.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $relativeDir);
        $real = is_dir($dir) ? realpath($dir) : false;

        abort_unless($real && static::underAllowedRoot($real.DIRECTORY_SEPARATOR.'x', $root), 422, 'That folder is not allowed.');

        $out = [];
        $iter = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($real, \FilesystemIterator::SKIP_DOTS)
        );

        foreach ($iter as $file) {
            if (! $file->isFile()) {
                continue;
            }

            $path = $file->getPathname();

            if (! static::extensionOk(str_replace('\\', '/', $path))) {
                continue;
            }

            $out[] = SectionTemplate::relative($path);

            if (count($out) >= 200) {
                break;
            }
        }

        sort($out);

        return $out;
    }

    protected static function extensionOk(string $path): bool
    {
        $path = strtolower($path);

        return str_ends_with($path, '.yaml')
            || str_ends_with($path, '.yml')
            || str_ends_with($path, '.antlers.html')
            || str_ends_with($path, '.md');
    }

    protected static function isYaml(string $path): bool
    {
        $path = strtolower($path);

        return str_ends_with($path, '.yaml') || str_ends_with($path, '.yml');
    }

    protected static function underAllowedRoot(string $absolute, string $projectRoot): bool
    {
        $absolute = static::norm($absolute);
        $projectRoot = static::norm($projectRoot);

        foreach (static::roots() as $root) {
            $real = realpath($root) ?: $root;
            $real = static::norm($real);

            if (! str_starts_with($real, $projectRoot)) {
                continue;
            }

            if ($absolute === $real || str_starts_with($absolute, $real.'/')) {
                return true;
            }
        }

        return false;
    }

    protected static function norm(string $path): string
    {
        return rtrim(str_replace('\\', '/', $path), '/');
    }
}
