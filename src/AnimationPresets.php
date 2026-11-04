<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Str;
use InvalidArgumentException;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionTemplateController\Persist;
use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Yaml\Yaml;

/**
 * The site's own animation presets, saved from the build panel's Animation
 * tab into the site's resources/visual-editor/animations.yaml:
 *
 *   presets:
 *     - handle: my-soft-rise
 *       label: Soft rise
 *       vars:
 *         --anim-opacity: '0'
 *         --anim-y: 3rem
 *
 * A preset is a look: the effects and the curve, never the timing, which stays
 * on the element. `{{ sve_animation }}` writes a rule for each beside the
 * addon's own (resources/animation/presets.json), and the panel lists them as
 * My presets. Their handles start with `my-`, so no preset the addon adds
 * later can take one.
 *
 * Every value lands in a `<style>` on the public page, so only the names and
 * the characters a length, a curve or a reveal is written with are kept.
 */
final class AnimationPresets
{
    public const PREFIX = 'my-';

    public const GROUP = 'own';

    /** The names a preset may hold: the effects, the 3D turns and the curve. */
    public const VARS = [
        '--anim-opacity',
        '--anim-y',
        '--anim-x',
        '--anim-scale',
        '--anim-rotate',
        '--anim-rx',
        '--anim-ry',
        '--anim-blur',
        '--anim-clip',
        '--anim-clip-to',
        '--anim-ease',
    ];

    public const MAX_LABEL = 40;

    private const VALUE = '/^[A-Za-z0-9.,%()\s+\-\/]{1,600}$/';

    private const HANDLE = '/^my-[a-z0-9]+(?:-[a-z0-9]+)*$/';

    public static function file(): string
    {
        $configured = config('statamic-visual-editor.animations.file');

        return is_string($configured) && $configured !== ''
            ? $configured
            : resource_path('visual-editor/animations.yaml');
    }

    /**
     * In the shape of presets.json, so the panel and the tag treat both alike.
     *
     * @return list<array{handle: string, group: string, label_da: string, label_en: string, vars: array<string, string>}>
     */
    public static function all(): array
    {
        return array_map(fn (array $preset) => [
            'handle' => $preset['handle'],
            'group' => self::GROUP,
            'label_da' => $preset['label'],
            'label_en' => $preset['label'],
            'vars' => $preset['vars'],
        ], static::stored());
    }

    /**
     * @param  array<mixed>  $vars
     * @return array{handle: string, group: string, label_da: string, label_en: string, vars: array<string, string>}
     *
     * @throws InvalidArgumentException a label or values that cannot be saved
     */
    public static function save(string $label, array $vars): array
    {
        $label = trim((string) preg_replace('/\s+/u', ' ', $label));
        $vars = static::vars($vars);

        if ($label === '' || mb_strlen($label) > self::MAX_LABEL || $vars === []) {
            throw new InvalidArgumentException('An animation preset needs a name and at least one value.');
        }

        $presets = static::stored();
        $handle = static::handleFor($label, array_column($presets, 'handle'));

        $presets[] = ['handle' => $handle, 'label' => $label, 'vars' => $vars];
        static::write($presets);

        return collect(static::all())->firstWhere('handle', $handle);
    }

    public static function delete(string $handle): bool
    {
        $presets = static::stored();
        $kept = array_values(array_filter($presets, fn (array $preset) => $preset['handle'] !== $handle));

        if (count($kept) === count($presets)) {
            return false;
        }

        static::write($kept);

        return true;
    }

    /** How many of the site's templates still name the preset: a deleted one leaves them without the look. */
    public static function usage(string $handle, ?string $views = null): int
    {
        $views ??= resource_path('views');

        if (! preg_match(self::HANDLE, $handle) || ! is_dir($views)) {
            return 0;
        }

        $needle = 'data-anim-preset="'.$handle.'"';
        $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($views, \FilesystemIterator::SKIP_DOTS));
        $count = 0;

        foreach ($files as $file) {
            if ($file->isFile() && str_ends_with($file->getFilename(), '.html') && str_contains((string) file_get_contents($file->getPathname()), $needle)) {
                $count++;
            }
        }

        return $count;
    }

    /** @return list<array{handle: string, label: string, vars: array<string, string>}> */
    private static function stored(): array
    {
        $path = static::file();

        if (! is_file($path)) {
            return [];
        }

        try {
            $data = Yaml::parse((string) file_get_contents($path));
        } catch (ParseException) {
            return [];
        }

        $presets = [];

        foreach (is_array($data['presets'] ?? null) ? $data['presets'] : [] as $row) {
            $handle = is_array($row) ? (string) ($row['handle'] ?? '') : '';
            $label = is_array($row) ? trim((string) ($row['label'] ?? '')) : '';
            $vars = is_array($row['vars'] ?? null) ? static::vars($row['vars']) : [];

            if (preg_match(self::HANDLE, $handle) && $label !== '' && $vars !== []) {
                $presets[] = ['handle' => $handle, 'label' => $label, 'vars' => $vars];
            }
        }

        return $presets;
    }

    /**
     * @param  array<mixed>  $vars
     * @return array<string, string> in the order of VARS
     */
    private static function vars(array $vars): array
    {
        $kept = [];

        foreach (self::VARS as $name) {
            $value = $vars[$name] ?? null;

            if (is_int($value) || is_float($value)) {
                $value = (string) $value;
            }

            if (is_string($value) && preg_match(self::VALUE, trim($value))) {
                $kept[$name] = trim($value);
            }
        }

        return $kept;
    }

    /** @param  list<string>  $taken */
    private static function handleFor(string $label, array $taken): string
    {
        $slug = trim(Str::limit(Str::slug($label), 32, ''), '-') ?: 'preset';
        $handle = self::PREFIX.$slug;

        for ($n = 2; in_array($handle, $taken, true); $n++) {
            $handle = self::PREFIX.$slug.'-'.$n;
        }

        return $handle;
    }

    /** @param  list<array{handle: string, label: string, vars: array<string, string>}>  $presets */
    private static function write(array $presets): void
    {
        $path = static::file();

        if (! is_dir(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        file_put_contents($path, Yaml::dump(['presets' => $presets], 4, 2));

        Persist::flushStaticCache();
        GitSync::after('animation preset');
    }
}
