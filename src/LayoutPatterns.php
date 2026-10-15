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
 * One header, one footer: a drop onto a header that is not the empty default
 * is refused unless it says `replace` — the editor asks first. What is
 * replaced is kept under storage/sve-layout-backups/.
 */
final class LayoutPatterns
{
    public const KINDS = ['header' => 'headers', 'footer' => 'footers', 'section' => 'sections'];

    /** The pattern every header or footer starts as and goes back to. */
    public const EMPTY = 'empty';

    /** @return list<array{handle: string, title: string}> */
    public static function patterns(string $kind): array
    {
        $dir = resource_path('views/patterns/'.(self::KINDS[$kind] ?? '_'));
        $out = [];

        foreach (File::exists($dir) ? File::files($dir) : [] as $file) {
            $name = Str::before($file->getFilename(), '.antlers.html');

            if (! str_ends_with($file->getFilename(), '.antlers.html')) {
                continue;
            }

            $fieldset = Fieldset::find(self::KINDS[$kind].'.'.$name);
            $out[] = ['handle' => $name, 'title' => $fieldset?->title() ?? Str::headline($name)];
        }

        // The empty one first: it is where every header starts, and how to start over.
        usort($out, fn ($a, $b) => [$a['handle'] !== self::EMPTY, $a['handle']] <=> [$b['handle'] !== self::EMPTY, $b['handle']]);

        return $out;
    }

    /** What the panel shows: the patterns of each kind, and what is placed now. */
    public static function describe(): array
    {
        $out = [];

        foreach (['header', 'footer'] as $half) {
            $out[$half] = [
                'patterns' => static::patterns($half),
                'empty' => static::isEmpty($half),
            ];
        }

        $layout = File::exists(static::layoutPath()) ? File::get(static::layoutPath()) : '';
        $out['section'] = [
            'patterns' => array_map(fn ($p) => $p + ['placed' => str_contains($layout, static::marker($p['handle']))], static::patterns('section')),
        ];

        return $out;
    }

    /**
     * Whether a half is still the empty default: its file draws only an empty
     * root element, and its global set has no fields. Anything built in it —
     * markup or a field — makes it the site's own header, which a drop never
     * overwrites.
     */
    public static function isEmpty(string $half): bool
    {
        $path = static::halfPath($half);
        $source = File::exists($path) ? File::get($path) : '';
        $source = preg_replace('/\{\{#.*?#\}\}/s', '', $source);
        $source = preg_replace('/\{\{\s*sve_tw[^}]*\}\}/', '', $source);
        $tag = $half === 'header' ? 'header' : 'footer';

        $emptyMarkup = trim($source) === '' || (bool) preg_match('#^\s*<'.$tag.'\b[^>]*>\s*</'.$tag.'>\s*$#s', $source);

        return $emptyMarkup && static::blueprintFields($half) === [];
    }

    /** Copy a header or footer pattern in. Null when it landed, else why not. */
    public static function place(string $half, string $handle, bool $replace = false): ?string
    {
        if (! static::exists($half, $handle)) {
            return 'unknown';
        }

        if (! static::isEmpty($half)) {
            if (! $replace) {
                return 'taken';
            }

            static::backup($half);
        }

        static::write($half, $handle);

        return null;
    }

    /** Put the empty default back. The file it had is kept under storage/. */
    public static function clear(string $half): void
    {
        static::backup($half);
        static::write($half, self::EMPTY);
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

    /** Copy a section pattern into the layout, under the page's content. */
    public static function addSection(string $handle): ?string
    {
        $pattern = resource_path('views/patterns/sections/'.$handle.'.antlers.html');
        $layoutPath = static::layoutPath();

        if (! preg_match('/^[a-z0-9_-]+$/', $handle) || ! File::exists($pattern) || ! File::exists($layoutPath)) {
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
        $block = static::marker($handle)."\n".rtrim(File::get($pattern))."\n";
        $block = implode("\n", array_map(fn ($line) => $line === '' ? '' : $indent.$line, explode("\n", rtrim($block))))."\n";

        File::put($layoutPath, substr($layout, 0, $at).$block.substr($layout, $at));
        GitSync::after('layout section');

        return null;
    }

    private static function write(string $half, string $handle): void
    {
        $dir = self::KINDS[$half];
        File::put(static::halfPath($half), File::get(resource_path("views/patterns/{$dir}/{$handle}.antlers.html")));

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
    }

    private static function exists(string $half, string $handle): bool
    {
        return preg_match('/^[a-z0-9_-]+$/', $handle)
            && File::exists(resource_path('views/patterns/'.self::KINDS[$half].'/'.$handle.'.antlers.html'));
    }

    private static function blueprintFields(string $half): array
    {
        $contents = Blueprint::find('globals.'.static::globalHandle($half))?->contents() ?? [];
        $fields = [];

        foreach ($contents['tabs'] ?? [] as $tab) {
            foreach ($tab['sections'] ?? [] as $section) {
                $fields = array_merge($fields, $section['fields'] ?? []);
            }
        }

        return $fields;
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
