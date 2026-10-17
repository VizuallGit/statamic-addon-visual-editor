<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Statamic\Facades\Blueprint;
use Statamic\Facades\Fieldset;

/**
 * Patterns for the layout: headers, footers and sections, each a starting
 * point copied into the site's own files when dragged onto the layout.
 *
 * A pattern is a file in `resources/views/patterns/{headers|footers|sections}/`
 * and, for a header or a footer, a fieldset of the same name in
 * `resources/fieldsets/{headers|footers}/`. Placing a header copies its HTML
 * into the header's own file (`partials/site_head`) and its fields into the
 * header's global set — the header stays an ordinary file, edited in the dock
 * as before. A section's HTML is copied into the layout, inside `<main>`
 * under `{{ template_content }}`.
 *
 * `custom` is the header (and footer) every site starts with. The pattern in
 * use is the one whose file the header's file still is, character for
 * character; once the header is edited, none is. A drop onto a header asks
 * first (`replace`); what is replaced is kept under storage/sve-layout-backups/.
 */
final class LayoutPatterns
{
    public const KINDS = ['header' => 'headers', 'footer' => 'footers', 'section' => 'sections'];

    /** The header and footer every site starts with. Listed first. */
    public const DEFAULT = 'custom';

    /** @return list<array{handle: string, title: string}> */
    public static function patterns(string $kind): array
    {
        $dir = resource_path('views/patterns/'.(self::KINDS[$kind] ?? '_'));
        $out = [];

        foreach (File::exists($dir) ? File::files($dir) : [] as $file) {
            if (! str_ends_with($file->getFilename(), '.antlers.html')) {
                continue;
            }

            $name = Str::before($file->getFilename(), '.antlers.html');
            $fieldset = Fieldset::find(self::KINDS[$kind].'.'.$name);
            $out[] = ['handle' => $name, 'title' => $fieldset?->title() ?? Str::headline($name)];
        }

        usort($out, fn ($a, $b) => [$a['handle'] !== self::DEFAULT, $a['handle']] <=> [$b['handle'] !== self::DEFAULT, $b['handle']]);

        return $out;
    }

    /** What the panel shows: the patterns of each kind, and which is in use. */
    public static function describe(): array
    {
        $out = [];

        foreach (['header', 'footer'] as $half) {
            $current = static::normalise(File::exists(static::halfPath($half)) ? File::get(static::halfPath($half)) : '');

            $out[$half] = [
                'has' => static::stripComments($current) !== '',
                'patterns' => array_map(fn ($p) => $p + [
                    'current' => $current !== '' && $current === static::normalise(File::get(static::patternPath($half, $p['handle']))),
                ], static::patterns($half)),
            ];
        }

        $layout = File::exists(static::layoutPath()) ? File::get(static::layoutPath()) : '';
        $out['section'] = [
            'patterns' => array_map(fn ($p) => $p + ['placed' => str_contains($layout, static::marker($p['handle']))], static::patterns('section')),
        ];

        return $out;
    }

    /** Copy a header or footer pattern in. Null when it landed, else why not. */
    public static function place(string $half, string $handle, bool $replace = false): ?string
    {
        if (! static::exists($half, $handle)) {
            return 'unknown';
        }

        $path = static::halfPath($half);
        $current = File::exists($path) ? static::normalise(File::get($path)) : '';

        if ($current === static::normalise(File::get(static::patternPath($half, $handle)))) {
            return null;
        }

        if (static::stripComments($current) !== '') {
            if (! $replace) {
                return 'taken';
            }

            static::backup($half);
        }

        File::put($path, File::get(static::patternPath($half, $handle)));

        $dir = self::KINDS[$half];
        $fields = Fieldset::find("{$dir}.{$handle}")?->contents()['fields'] ?? [];
        $set = static::globalHandle($half);
        $blueprint = Blueprint::find("globals.{$set}") ?? Blueprint::make($set)->setNamespace('globals');
        $display = $half === 'header' ? 'Header' : 'Footer';

        // The tab keeps its name: Live Preview finds the half's tab by it.
        $blueprint->setContents([
            'title' => $display,
            'tabs' => [$half => ['display' => $display, 'sections' => [['fields' => array_values($fields)]]]],
        ])->save();

        GitSync::after('layout '.$half);

        return null;
    }

    /** Copy a section pattern into the layout, under the page's content. */
    public static function addSection(string $handle): ?string
    {
        $layoutPath = static::layoutPath();

        if (! static::exists('section', $handle) || ! File::exists($layoutPath)) {
            return 'unknown';
        }

        $layout = File::get($layoutPath);

        if (str_contains($layout, static::marker($handle))) {
            return 'twice';
        }

        if (! preg_match('/^([ \t]*)\{\{\s*template_content\s*\}\}[^\n]*\n/m', $layout, $m, PREG_OFFSET_CAPTURE)) {
            return 'no_content';
        }

        $indent = $m[1][0];
        $at = $m[0][1] + strlen($m[0][0]);
        $block = static::marker($handle)."\n".rtrim(File::get(static::patternPath('section', $handle)));
        $block = implode("\n", array_map(fn ($line) => $line === '' ? '' : $indent.$line, explode("\n", $block)))."\n";

        File::put($layoutPath, substr($layout, 0, $at).$block.substr($layout, $at));
        GitSync::after('layout section');

        return null;
    }

    /** The view a pattern renders as, for its preview: `patterns/headers/custom`. */
    public static function view(string $kind, string $handle): ?string
    {
        return static::exists($kind, $handle) ? 'patterns/'.self::KINDS[$kind].'/'.$handle : null;
    }

    /** Keep the half's file and blueprint as they are now, under storage/. */
    private static function backup(string $half): void
    {
        $dir = storage_path('sve-layout-backups/'.date('Ymd-His').'-'.$half);
        $blueprint = resource_path('blueprints/globals/'.static::globalHandle($half).'.yaml');

        File::ensureDirectoryExists($dir);

        foreach ([static::halfPath($half), $blueprint] as $file) {
            if (File::exists($file)) {
                File::copy($file, $dir.'/'.basename($file));
            }
        }
    }

    private static function exists(string $kind, string $handle): bool
    {
        return isset(self::KINDS[$kind])
            && preg_match('/^[a-z0-9_-]+$/', $handle)
            && File::exists(static::patternPath($kind, $handle));
    }

    private static function patternPath(string $kind, string $handle): string
    {
        return resource_path('views/patterns/'.self::KINDS[$kind].'/'.$handle.'.antlers.html');
    }

    /** Line endings and trailing blanks don't make two files different headers. */
    private static function normalise(string $source): string
    {
        return trim(implode("\n", array_map('rtrim', preg_split('/\R/', $source))));
    }

    private static function stripComments(string $source): string
    {
        return trim(preg_replace('/\{\{#.*?#\}\}/s', '', $source));
    }

    /** The marker a placed section starts with — how the panel knows it is there. */
    private static function marker(string $handle): string
    {
        return '{{# pattern: '.$handle.' #}}';
    }

    private static function globalHandle(string $half): string
    {
        return (string) (config("statamic-visual-editor.chrome.{$half}.global") ?: ($half === 'header' ? 'site_head' : 'site_foot'));
    }

    private static function halfPath(string $half): string
    {
        return resource_path('views/partials/'.($half === 'header' ? 'site_head' : 'site_foot').'.antlers.html');
    }

    private static function layoutPath(): string
    {
        return resource_path('views/'.config('statamic.system.layout', 'layout').'.antlers.html');
    }
}
