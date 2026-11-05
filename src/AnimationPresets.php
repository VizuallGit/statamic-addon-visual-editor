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
 *       kind: children
 *       vars:
 *         --anim-opacity: '0'
 *         --anim-y: 3rem
 *       timing:
 *         duration: 600
 *         step: 80
 *
 * A preset is for one kind of animation (the element's `data-anim`), and the
 * panel lists it under «Mine» in that kind's gallery; one saved before kinds
 * existed is an element's (`self`). It holds a look — the effects and the
 * curve, a stack's top and offset — and, for children, words and a ticker,
 * their timing. A preset of a kind that plays in time is linked:
 * `{{ sve_animation }}` writes a rule for each beside the addon's own
 * (resources/animation/presets.json). A recipe's is written onto the element.
 * Their handles start with `my-`, so no preset the addon adds later can take
 * one.
 *
 * Every value lands in a `<style>` on the public page, so only the names and
 * the characters a length, a curve or a reveal is written with are kept.
 */
final class AnimationPresets
{
    public const PREFIX = 'my-';

    /** The kinds, as resources/animation/presets.json and the panel's KINDS name them. */
    public const KINDS = ['self', 'children', 'words', 'parallax', 'ticker', 'stack', 'mouse'];

    /** The kinds that play in time and link their preset by `data-anim-preset`. */
    public const TIMED = ['self', 'children', 'words'];

    /** A preset's timing, in ms. */
    public const TIMING = ['duration', 'delay', 'step'];

    public const MAX_MS = 60000;

    /** The names a preset may hold: the effects, the 3D turns, the curve and a stack's top and offset. */
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
        '--anim-stack-top',
        '--anim-stack-gap',
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
     * @return list<array{handle: string, kind: string, label_da: string, label_en: string, vars: array<string, string>, timing?: array<string, int>}>
     */
    public static function all(): array
    {
        return array_map(fn (array $preset) => [
            'handle' => $preset['handle'],
            'kind' => $preset['kind'],
            'label_da' => $preset['label'],
            'label_en' => $preset['label'],
            'vars' => $preset['vars'],
            ...($preset['timing'] === [] ? [] : ['timing' => $preset['timing']]),
        ], static::stored());
    }

    /**
     * @param  array<mixed>  $vars
     * @param  array<mixed>  $timing
     * @return array{handle: string, kind: string, label_da: string, label_en: string, vars: array<string, string>, timing?: array<string, int>}
     *
     * @throws InvalidArgumentException a label or values that cannot be saved
     */
    public static function save(string $label, array $vars, mixed $kind = 'self', array $timing = []): array
    {
        $label = trim((string) preg_replace('/\s+/u', ' ', $label));
        $kind = static::kind($kind);
        $vars = static::vars($vars);
        $timing = static::timing($timing);

        if ($label === '' || mb_strlen($label) > self::MAX_LABEL || ($vars === [] && $timing === [])) {
            throw new InvalidArgumentException('An animation preset needs a name and at least one value.');
        }

        $presets = static::stored();
        $handle = static::handleFor($label, array_column($presets, 'handle'));

        $presets[] = ['handle' => $handle, 'label' => $label, 'kind' => $kind, 'vars' => $vars, 'timing' => $timing];
        static::write($presets);

        return collect(static::all())->firstWhere('handle', $handle);
    }

    /**
     * «Update preset»: one of the site's own presets takes a new look and
     * timing; its name and kind stay, and every element that links it
     * follows. The addon's presets are not the site's to change: null.
     *
     * @param  array<mixed>  $vars
     * @param  array<mixed>  $timing
     * @return array{handle: string, kind: string, label_da: string, label_en: string, vars: array<string, string>, timing?: array<string, int>}|null
     *
     * @throws InvalidArgumentException values that cannot be saved
     */
    public static function update(string $handle, array $vars, array $timing = []): ?array
    {
        $presets = static::stored();
        $at = array_search($handle, array_column($presets, 'handle'), true);

        if ($at === false) {
            return null;
        }

        $vars = static::vars($vars);
        $timing = static::timing($timing);

        if ($vars === [] && $timing === []) {
            throw new InvalidArgumentException('An animation preset needs at least one value.');
        }

        $presets[$at] = [...$presets[$at], 'vars' => $vars, 'timing' => $timing];
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

    /** @return list<array{handle: string, label: string, kind: string, vars: array<string, string>, timing: array<string, int>}> */
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
            $timing = is_array($row['timing'] ?? null) ? static::timing($row['timing']) : [];

            if (preg_match(self::HANDLE, $handle) && $label !== '' && ($vars !== [] || $timing !== [])) {
                $presets[] = ['handle' => $handle, 'label' => $label, 'kind' => static::kind($row['kind'] ?? null), 'vars' => $vars, 'timing' => $timing];
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

    /** One of KINDS; anything else — a preset saved before kinds, a stray value — is an element's. */
    private static function kind(mixed $kind): string
    {
        return is_string($kind) && in_array($kind, self::KINDS, true) ? $kind : 'self';
    }

    /**
     * @param  array<mixed>  $timing
     * @return array<string, int> in the order of TIMING, whole ms from 0 to MAX_MS
     */
    private static function timing(array $timing): array
    {
        $kept = [];

        foreach (self::TIMING as $key) {
            $value = $timing[$key] ?? null;

            if (is_string($value) && preg_match('/^\d+$/', trim($value))) {
                $value = (int) trim($value);
            }

            if (is_int($value) && $value >= 0 && $value <= self::MAX_MS) {
                $kept[$key] = $value;
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

    /** @param  list<array{handle: string, label: string, kind: string, vars: array<string, string>, timing: array<string, int>}>  $presets */
    private static function write(array $presets): void
    {
        $path = static::file();

        if (! is_dir(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        $rows = array_map(fn (array $preset) => array_filter($preset, fn ($value) => $value !== []), $presets);

        file_put_contents($path, Yaml::dump(['presets' => $rows], 4, 2));

        Persist::flushStaticCache();
        GitSync::after('animation preset');
    }
}
