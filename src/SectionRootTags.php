<?php

namespace MarioHamann\StatamicVisualEditor;

use FilesystemIterator;
use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\SectionTemplate\Paths;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

/**
 * The first tag of every section type's file, by handle.
 *
 * The HTML tree names a shut section by the tag it unfolds into. The tree only
 * holds a section's file once it has fetched it, and until then the row said
 * `section` — so a divider written as a `<div>` read `section` and turned into
 * `div` a moment later. Handed to the Control Panel with the rest of the
 * settings, the row is right on its first paint.
 *
 * Read the way the tree reads it (html-tree-parse.js `parseRange`): the dock's
 * HTML pane, Antlers blanked as lib/antlers-tags.js blanks it, tags inside an
 * HTML comment counted, `<!…>` and `<?…>` skipped, and the first opening tag is
 * the answer. Two readers of one file have to agree, or the row changes its
 * mind when the file lands.
 */
final class SectionRootTags
{
    protected const CACHE_KEY = 'sve.section-root-tags';

    /**
     * Every section partial under `templates.partials`, by handle
     * (`static_section/divider` → `div`). A file with no tag in it is left out.
     *
     * Every Control Panel page asks, and splitting forty files into panes took
     * ~15 ms each time. So the answer is kept, stamped with each file's mtime
     * and size: a save in the dock, an edit in Cursor, a git pull — any change
     * to a file reads them again, and nothing else does.
     *
     * @return array<string, string>
     */
    public static function map(): array
    {
        $files = static::files();
        $stamp = md5(implode('|', array_map(
            fn (string $path, string $handle) => $handle.':'.filemtime($path).':'.filesize($path),
            $files,
            array_keys($files)
        )));

        $cached = Cache::get(static::CACHE_KEY);

        if (is_array($cached) && ($cached['stamp'] ?? null) === $stamp && is_array($cached['tags'] ?? null)) {
            return $cached['tags'];
        }

        $tags = [];

        foreach ($files as $handle => $path) {
            $parts = SectionTemplate::split((string) file_get_contents($path), $handle);
            $tag = static::of((string) ($parts['html'] ?? ''));

            if ($tag !== '') {
                $tags[$handle] = $tag;
            }
        }

        Cache::forever(static::CACHE_KEY, ['stamp' => $stamp, 'tags' => $tags]);

        return $tags;
    }

    /**
     * Each section partial's path, by handle, sorted.
     *
     * @return array<string, string>
     */
    protected static function files(): array
    {
        $dir = realpath(Paths::directory());

        if ($dir === false || ! is_dir($dir)) {
            return [];
        }

        $suffix = '.antlers.html';
        $out = [];

        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS)
        );

        foreach ($files as $file) {
            $path = $file->getPathname();

            if ($file->isFile() && str_ends_with($path, $suffix)) {
                $out[str_replace(DIRECTORY_SEPARATOR, '/', substr($path, strlen($dir) + 1, -strlen($suffix)))] = $path;
            }
        }

        ksort($out);

        return $out;
    }

    /**
     * What the file's first row is: its first opening tag, lowercased — or
     * `component`, when a partial call comes before any tag. '' when there is
     * neither.
     *
     * A section written as one component call (`{{ partial:components/intro_style
     * … }}` and nothing else) has no tag of its own; the tree's first row for
     * it is the component. Shut, the row said `section` — the fallback — and
     * turned into `component` the moment it was opened. The call is read the
     * way the tree reads it (dock-partials.js `findPartials`): `partial:src`
     * or `partial src="…"`, Antlers comments blanked, a src with `..` skipped.
     */
    public static function of(string $html): string
    {
        $tag = static::firstTag(static::mask($html));
        $call = static::firstPartialCall($html);

        if ($call !== null && ($tag === null || $call < $tag['at'])) {
            return 'component';
        }

        return $tag['name'] ?? '';
    }

    /**
     * Where the first partial call opens; null when the file has none.
     */
    protected static function firstPartialCall(string $text): ?int
    {
        $masked = preg_replace_callback('/\{\{#[\s\S]*?#\}\}/', fn (array $m) => str_repeat(' ', strlen($m[0])), $text) ?? $text;

        if (! preg_match_all('/\{\{\s*partial(?::([^\s}]+)|(?=[\s}]))([\s\S]*?)\}\}/i', $masked, $matches, PREG_SET_ORDER | PREG_OFFSET_CAPTURE)) {
            return null;
        }

        foreach ($matches as $match) {
            $colon = trim($match[1][0] ?? '');
            $src = $colon;

            if ($src === '' && preg_match('/\bsrc\s*=\s*(["\'])([^"\']+)\1/i', $match[2][0] ?? '', $attr)) {
                $src = trim($attr[2]);
            }

            if ($src === '' || str_contains($src, '..')) {
                continue;
            }

            return $match[0][1];
        }

        return null;
    }

    /**
     * The first opening tag in the Antlers-blanked text: its offset and its
     * lowercased name; null when there is none.
     *
     * @return array{at: int, name: string}|null
     */
    protected static function firstTag(string $masked): ?array
    {
        $i = 0;

        while (($i = strpos($masked, '<', $i)) !== false) {
            // A comment's tags are rows too — dimmed, but rows.
            if (substr_compare($masked, '<!--', $i, 4) === 0) {
                $i += 4;

                continue;
            }

            if (str_starts_with(substr($masked, $i, 2), '<!') || str_starts_with(substr($masked, $i, 2), '<?')) {
                $gt = strpos($masked, '>', $i + 2);

                if ($gt === false) {
                    return null;
                }

                $i = $gt + 1;

                continue;
            }

            if (! preg_match('/\G<(\/?)([a-zA-Z][a-zA-Z0-9:-]*)/', $masked, $match, 0, $i)) {
                $i++;

                continue;
            }

            $gt = strpos($masked, '>', $i);

            if ($gt === false) {
                return null;
            }

            if ($match[1] === '/') {
                $i = $gt + 1;

                continue;
            }

            return ['at' => $i, 'name' => strtolower($match[2])];
        }

        return null;
    }

    /**
     * Antlers blanked to spaces, as lib/antlers-tags.js `maskAntlers` does it:
     * a tag ends at the `}}` answering its own `{{` (a tag inside another's
     * parameter is part of it), a comment at `#}}`, and a tag with no `}}` to
     * come runs to the end.
     */
    protected static function mask(string $text): string
    {
        $length = strlen($text);
        $out = '';
        $i = 0;

        while (($start = strpos($text, '{{', $i)) !== false) {
            if (($text[$start + 2] ?? '') === '#') {
                $end = strpos($text, '#}}', $start + 3);
                $j = $end === false ? $length : $end + 3;
            } else {
                $depth = 0;
                $j = $start;

                while ($j < $length) {
                    if ($text[$j] === '{' && ($text[$j + 1] ?? '') === '{') {
                        $depth++;
                        $j += 2;
                    } elseif ($text[$j] === '}' && ($text[$j + 1] ?? '') === '}') {
                        $depth--;
                        $j += 2;

                        if (! $depth) {
                            break;
                        }
                    } else {
                        $j++;
                    }
                }
            }

            $out .= substr($text, $i, $start - $i).str_repeat(' ', $j - $start);
            $i = $j;
        }

        return $out.substr($text, $i);
    }
}
