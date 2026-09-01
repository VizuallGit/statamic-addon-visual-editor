<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * The Antlers partial a page-section type is rendered from.
 *
 * The dock writes this file. The handle comes from the replicator set
 * (`hero/style_2`); the path is always under the section-partials directory,
 * never anywhere else — `..` and absolute paths are refused.
 *
 * Designed types are locked in the template dock by default. `custom_section`
 * stays editable until a super admin locks it. Unlocking a designed type
 * writes `{{# sve-unlocked #}}`; locking a custom type writes `{{# sve-locked #}}`.
 */
class SectionTemplate
{
    /** Comment written at the top of a locked partial — not shown in the dock. */
    public const LOCK_MARKER = '{{# sve-locked #}}';

    /** Comment written when a default-locked type has been unlocked. */
    public const UNLOCK_MARKER = '{{# sve-unlocked #}}';

    public static function directory(): string
    {
        return (string) config(
            'statamic-visual-editor.templates.partials',
            resource_path('views/partials/page_sections')
        );
    }

    /**
     * Page sections live under `templates.partials`. Header/footer chrome
     * uses `header/style_1` → `views/partials/header/style_1.antlers.html`.
     *
     * @return array{base: string, rel: string}|null
     */
    protected static function locate(string $handle): ?array
    {
        $handle = str_replace('\\', '/', trim($handle));

        if ($handle === '' || str_contains($handle, '..') || str_starts_with($handle, '/')) {
            return null;
        }

        if (! preg_match('/^[A-Za-z0-9][A-Za-z0-9_\/.-]*$/', $handle)) {
            return null;
        }

        if (preg_match('#^(header|footer)/(.+)$#', $handle, $m)) {
            return [
                'base' => resource_path('views/partials/'.$m[1]),
                'rel' => $m[2],
            ];
        }

        return [
            'base' => static::directory(),
            'rel' => $handle,
        ];
    }

    /**
     * Real path to write the partial, creating parent folders. Null when the
     * handle is unsafe. The file itself does not have to exist yet.
     */
    public static function writablePath(string $handle): ?string
    {
        $located = static::locate($handle);

        if ($located === null) {
            return null;
        }

        $base = $located['base'];

        if (! is_dir($base) && ! @mkdir($base, 0775, true) && ! is_dir($base)) {
            return null;
        }

        $baseReal = realpath($base);

        if ($baseReal === false) {
            return null;
        }

        $candidate = $baseReal.DIRECTORY_SEPARATOR.str_replace('.', '/', $located['rel']).'.antlers.html';
        $dir = dirname($candidate);

        if (! is_dir($dir) && ! @mkdir($dir, 0775, true) && ! is_dir($dir)) {
            return null;
        }

        $dirReal = realpath($dir);

        if ($dirReal === false) {
            return null;
        }

        if ($dirReal !== $baseReal && ! str_starts_with($dirReal, $baseReal.DIRECTORY_SEPARATOR)) {
            return null;
        }

        return $candidate;
    }

    public static function path(string $handle): ?string
    {
        $located = static::locate($handle);

        if ($located === null) {
            return null;
        }

        $base = realpath($located['base']);

        if ($base === false) {
            return null;
        }

        $candidate = $base.DIRECTORY_SEPARATOR.str_replace('.', '/', $located['rel']).'.antlers.html';

        if (! is_file($candidate)) {
            return null;
        }

        $real = realpath($candidate);

        if ($real === false || ! str_starts_with($real, $base.DIRECTORY_SEPARATOR)) {
            return null;
        }

        return $real;
    }

    public static function relative(string $absolute): string
    {
        $root = realpath(base_path()) ?: base_path();

        if (str_starts_with($absolute, $root.DIRECTORY_SEPARATOR)) {
            return substr($absolute, strlen($root) + 1);
        }

        return $absolute;
    }

    /**
     * Split a section partial into the three dock panes.
     *
     * CSS is the inner contents of the last `style_push` / `sve_css` pair that
     * is not inside an Antlers comment — without the wrapping `<style>` tag.
     * JS is the same for `script_push` / `sve_js`. Everything else is HTML —
     * including commented-out style blocks.
     *
     * @return array{html: string, css: string, js: string, tw: string, html_tag: ?string, css_tag: string, js_tag: string, locked: bool}
     */
    public static function split(string $contents, string $handle = ''): array
    {
        $unlockedMarker = static::hasUnlockMarker($contents);
        $lockedMarker = static::hasLockMarker($contents);
        $contents = static::stripMarkers($contents);
        $placeholders = [];
        $masked = preg_replace_callback('/\{\{#.*?#\}\}/s', function (array $m) use (&$placeholders) {
            $key = '___SVE_CMT_'.count($placeholders).'___';
            $placeholders[$key] = $m[0];

            return $key;
        }, $contents) ?? $contents;

        $css = '';
        $js = '';
        $tw = '';
        $cssTag = 'style_push';
        $jsTag = 'script_push';
        $html = $masked;
        $suffix = '';

        $changed = true;

        while ($changed) {
            $changed = false;

            while (preg_match('/(___SVE_CMT_\d+___)(\s*)$/', $html, $m)) {
                $suffix = $m[1].$m[2].$suffix;
                $html = substr($html, 0, -strlen($m[0]));
            }

            foreach ([
                ['sve_tw', 'tw'],
                ['sve_css', 'css'],
                ['style_push', 'css'],
                ['sve_js', 'js'],
                ['script_push', 'js'],
            ] as [$tag, $bucket]) {
                $pair = static::peelTrailingPair($html, $tag);

                if ($pair === null) {
                    continue;
                }

                $html = $pair['rest'];

                if ($bucket === 'css') {
                    $css = static::joinBlocks($pair['inner'], $css);
                    $cssTag = $tag;
                } elseif ($bucket === 'tw') {
                    $tw = static::joinBlocks($pair['inner'], $tw);
                } else {
                    $js = static::joinBlocks($pair['inner'], $js);
                    $jsTag = $tag;
                }

                $changed = true;
                break;
            }
        }

        $html .= $suffix;

        $embedded = static::extractPair($html, 'sve_tw');

        if ($embedded !== null) {
            $html = $embedded['rest'];
            $tw = static::joinBlocks($embedded['inner'], $tw);
        }

        $html = preg_replace('/\{\{\s*sve_tw\s*\}\}/', '', $html) ?? $html;

        $htmlTag = null;
        $wrapped = static::unwrapPair($html, 'sve_html');

        if ($wrapped !== null) {
            $html = $wrapped;
            $htmlTag = 'sve_html';
        }

        return [
            'html' => static::unmask(static::trimBlock($html), $placeholders),
            'css' => static::unwrapTagged(static::unmask(static::trimBlock($css), $placeholders), 'style'),
            'js' => static::unwrapTagged(static::unmask(static::trimBlock($js), $placeholders), 'script'),
            'tw' => static::unwrapTagged(static::unmask(static::trimBlock($tw), $placeholders), 'style'),
            'html_tag' => $htmlTag,
            'css_tag' => $cssTag,
            'js_tag' => $jsTag,
            'locked' => static::resolveLocked($lockedMarker, $unlockedMarker, $handle),
        ];
    }

    /**
     * Write the three panes back to one Antlers file.
     *
     * Empty CSS/JS panes drop their pair tags. Wrappers come from the file that
     * was on disk (`style_push` on this site), so a first CSS edit still pushes
     * into the layout stack. `<style>` / `<script>` are added around the pane
     * text — the dock never shows those tags.
     *
     * @param  array{html: string, css: string, js: string, tw?: string, html_tag?: ?string, css_tag?: string, js_tag?: string, locked?: bool}  $parts
     */
    public static function join(array $parts, string $handle = ''): string
    {
        $html = (string) ($parts['html'] ?? '');
        $css = (string) ($parts['css'] ?? '');
        $js = (string) ($parts['js'] ?? '');
        $tw = (string) ($parts['tw'] ?? '');
        $htmlTag = $parts['html_tag'] ?? null;
        $cssTag = $parts['css_tag'] ?? 'style_push';
        $jsTag = $parts['js_tag'] ?? 'script_push';

        if (is_string($htmlTag) && $htmlTag !== '') {
            $html = '{{ '.$htmlTag." }}\n".$html."\n{{ /".$htmlTag.' }}';
        }

        $html = rtrim($html);

        if ($handle !== '' && trim($tw) !== '') {
            TailwindStore::write($handle, $tw);
        }

        $out = $html;

        // CSS lives in resources/visual-editor/tw/{handle}.css. The tag sits
        // after the section (before style_push) so authored CSS wins cascade;
        // SveTw pushes onto the head stack — not a <style> in the markup.
        if ($handle !== '' && TailwindStore::has($handle)) {
            $out .= "\n\n{{ sve_tw }}";
        }

        if (trim($css) !== '') {
            $out .= static::wrapPair($cssTag, static::wrapTagged($css, 'style'));
        }

        if (trim($js) !== '') {
            $out .= static::wrapPair($jsTag, static::wrapTagged($js, 'script'));
        }

        $out = $out === '' ? '' : $out."\n";
        $marker = static::markerFor(! empty($parts['locked']), $handle);

        if ($marker !== null) {
            $out = $marker."\n".$out;
        }

        return $out;
    }

    /**
     * Designed types are locked until unlocked. `custom_section` (and anything
     * listed in `templates.unlocked`) stays editable until someone locks it.
     */
    public static function defaultsLocked(string $handle): bool
    {
        $handle = str_replace('\\', '/', trim($handle));

        if ($handle === '') {
            return false;
        }

        foreach (static::unlockedPrefixes() as $prefix) {
            if ($handle === $prefix || str_starts_with($handle, $prefix.'/')) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return list<string>
     */
    public static function unlockedPrefixes(): array
    {
        $raw = config('statamic-visual-editor.templates.unlocked', ['custom_section']);

        if (! is_array($raw)) {
            return ['custom_section'];
        }

        $out = [];

        foreach ($raw as $prefix) {
            if (! is_string($prefix)) {
                continue;
            }

            $prefix = str_replace('\\', '/', trim($prefix));

            if ($prefix !== '' && ! str_contains($prefix, '..')) {
                $out[] = $prefix;
            }
        }

        return $out !== [] ? $out : ['custom_section'];
    }

    public static function hasLockMarker(string $contents): bool
    {
        return (bool) preg_match('/\{\{#\s*sve-locked\s*#\}\}/', $contents);
    }

    public static function hasUnlockMarker(string $contents): bool
    {
        return (bool) preg_match('/\{\{#\s*sve-unlocked\s*#\}\}/', $contents);
    }

    public static function stripLockMarker(string $contents): string
    {
        return static::stripOneMarker($contents, 'sve-locked');
    }

    public static function stripUnlockMarker(string $contents): string
    {
        return static::stripOneMarker($contents, 'sve-unlocked');
    }

    public static function stripMarkers(string $contents): string
    {
        return static::stripUnlockMarker(static::stripLockMarker($contents));
    }

    public static function fileIsLocked(string $path): bool
    {
        if (! is_file($path)) {
            return false;
        }

        return static::split((string) file_get_contents($path), static::handleFromAbsolute($path) ?? '')['locked'];
    }

    /**
     * Toggle the lock without rewriting the three panes.
     *
     * Default-locked types (everything but custom sections) store an unlock
     * comment when opened; default-unlocked types store a lock comment when
     * closed. The other marker is always stripped, so the file never has both.
     */
    public static function setLocked(string $path, bool $locked): void
    {
        $contents = (string) file_get_contents($path);
        $handle = static::handleFromAbsolute($path) ?? '';

        if (static::split($contents, $handle)['locked'] === $locked) {
            return;
        }

        $contents = static::stripMarkers($contents);
        $marker = static::markerFor($locked, $handle);

        if ($marker !== null) {
            $contents = $marker."\n".$contents;
        }

        if ($contents !== '' && ! str_ends_with($contents, "\n")) {
            $contents .= "\n";
        }

        file_put_contents($path, $contents);
    }

    /**
     * @return array<string, string>  absolute path → file contents
     */
    public static function lockedSnapshots(): array
    {
        $dir = static::directory();

        if (! is_dir($dir)) {
            return [];
        }

        $out = [];
        $iter = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS)
        );

        foreach ($iter as $file) {
            if (! $file->isFile() || ! str_ends_with($file->getFilename(), '.antlers.html')) {
                continue;
            }

            $full = $file->getPathname();

            if (static::fileIsLocked($full)) {
                $out[$full] = (string) file_get_contents($full);
            }
        }

        return $out;
    }

    /**
     * @param  array<string, string>  $snapshots
     */
    public static function restoreLocked(array $snapshots): void
    {
        foreach ($snapshots as $path => $contents) {
            if (! is_string($contents) || $contents === '') {
                continue;
            }

            $current = is_file($path) ? (string) file_get_contents($path) : '';

            if ($current !== $contents) {
                file_put_contents($path, $contents);
            }
        }
    }

    /**
     * Unlock marker wins; then an explicit lock; then the type's default.
     */
    protected static function resolveLocked(bool $lockedMarker, bool $unlockedMarker, string $handle): bool
    {
        if ($unlockedMarker) {
            return false;
        }

        if ($lockedMarker) {
            return true;
        }

        return $handle !== '' && static::defaultsLocked($handle);
    }

    /**
     * The comment to write, or null when the default already says the same.
     */
    protected static function markerFor(bool $locked, string $handle): ?string
    {
        if ($handle === '') {
            return $locked ? static::LOCK_MARKER : null;
        }

        $defaultsLocked = static::defaultsLocked($handle);

        if ($locked && ! $defaultsLocked) {
            return static::LOCK_MARKER;
        }

        if (! $locked && $defaultsLocked) {
            return static::UNLOCK_MARKER;
        }

        return null;
    }

    protected static function stripOneMarker(string $contents, string $name): string
    {
        $out = preg_replace('/\s*\{\{#\s*'.preg_quote($name, '/').'\s*#\}\}\s*/', "\n", $contents) ?? $contents;

        return ltrim($out, "\n\r");
    }

    public static function handleFromAbsolute(string $absolute): ?string
    {
        $real = realpath($absolute);

        if ($real === false || ! str_ends_with($real, '.antlers.html')) {
            return null;
        }

        foreach (['header', 'footer'] as $chrome) {
            $chromeBase = realpath(resource_path('views/partials/'.$chrome));

            if ($chromeBase && str_starts_with($real, $chromeBase.DIRECTORY_SEPARATOR)) {
                $rel = substr($real, strlen($chromeBase) + 1);
                $rel = preg_replace('/\.antlers\.html$/', '', str_replace('\\', '/', $rel)) ?? '';

                return $rel !== '' ? $chrome.'/'.$rel : null;
            }
        }

        $base = realpath(static::directory());

        if ($base === false || $real === $base || ! str_starts_with($real, $base.DIRECTORY_SEPARATOR)) {
            return null;
        }

        $rel = substr($real, strlen($base) + 1);
        $rel = preg_replace('/\.antlers\.html$/', '', str_replace('\\', '/', $rel)) ?? '';

        return $rel !== '' ? $rel : null;
    }

    /**
     * @return array{rest: string, inner: string}|null
     */
    protected static function extractPair(string $html, string $tag): ?array
    {
        $open = '\{\{\s*'.preg_quote($tag, '~').'\s*\}\}';
        $close = '\{\{\s*/'.preg_quote($tag, '~').'\s*\}\}';

        if (! preg_match('~^(.*)('.$open.')(.*?)('.$close.')(.*)$~s', $html, $m)) {
            return null;
        }

        $rest = rtrim($m[1]).ltrim($m[5]);

        return [
            'rest' => preg_replace('/\n{3,}/', "\n\n", $rest) ?? $rest,
            'inner' => $m[3],
        ];
    }

    /**
     * @return array{rest: string, inner: string}|null
     */
    protected static function peelTrailingPair(string $html, string $tag): ?array
    {
        $open = '\{\{\s*'.preg_quote($tag, '~').'\s*\}\}';
        $close = '\{\{\s*/'.preg_quote($tag, '~').'\s*\}\}';

        if (! preg_match('~^(.*)('.$open.')(.*?)('.$close.')\s*$~s', rtrim($html), $m)) {
            return null;
        }

        return [
            'rest' => $m[1],
            'inner' => $m[3],
        ];
    }

    protected static function unwrapPair(string $html, string $tag): ?string
    {
        $open = '\{\{\s*'.preg_quote($tag, '~').'\s*\}\}';
        $close = '\{\{\s*/'.preg_quote($tag, '~').'\s*\}\}';

        if (! preg_match('~^\s*'.$open.'(.*?)'.$close.'\s*$~s', $html, $m)) {
            return null;
        }

        return $m[1];
    }

    protected static function wrapPair(string $tag, string $inner): string
    {
        return "\n\n{{ {$tag} }}\n{$inner}\n{{ /{$tag} }}";
    }

    /**
     * Drop a wrapping `<style>` / `<script>` so the dock pane is just the code.
     * Leaves the inner alone when it is not a single pair of those tags.
     */
    protected static function unwrapTagged(string $inner, string $tag): string
    {
        $name = preg_quote($tag, '/');

        if (! preg_match('/^\s*<'.$name.'\b[^>]*>\s*(.*?)\s*<\/'.$name.'>\s*$/is', $inner, $m)) {
            return $inner;
        }

        return static::trimBlock($m[1]);
    }

    /**
     * Put `<style>` / `<script>` back for the file on disk. The layout stack
     * outputs this as HTML; without the tag the browser never runs it.
     */
    protected static function wrapTagged(string $inner, string $tag): string
    {
        $name = preg_quote($tag, '/');

        if (preg_match('/^\s*<'.$name.'\b/i', $inner) && preg_match('/<\/'.$name.'>\s*$/i', $inner)) {
            return $inner;
        }

        return "<{$tag}>\n{$inner}\n</{$tag}>";
    }

    protected static function joinBlocks(string $inner, string $existing): string
    {
        $inner = static::trimBlock($inner);

        if ($existing === '') {
            return $inner;
        }

        if ($inner === '') {
            return $existing;
        }

        return $inner."\n\n".$existing;
    }

    protected static function trimBlock(string $value): string
    {
        return preg_replace('/^\n+|\n+$/', '', $value) ?? $value;
    }

    /**
     * @param  array<string, string>  $placeholders
     */
    protected static function unmask(string $value, array $placeholders): string
    {
        return strtr($value, $placeholders);
    }
}
