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
     * Every class the site defines, and where.
     *
     * The rules under resources/css, the rules inside the views' own `<style>`
     * and `style_push` blocks, `@scope(.name)` blocks, and the dock's `[ name ]`
     * runs in class attributes. So a section naming itself `[ tttt ]` can be
     * told that tttt.css already styles that name — the padding it cannot see
     * in its own pane is coming from there.
     *
     * Leaf rules only: a rule with no rule nested in it. That is where the
     * declarations are, whatever layer or media block it sits in.
     *
     * @return list<array{name: string, file: string, selector: string, css: string, kind: string}>
     */
    public static function defined(?string $viewsDir = null): array
    {
        $out = [];
        $cssRoot = SiteCss::root();

        if (is_dir($cssRoot)) {
            foreach (static::files($cssRoot) as $path) {
                $file = static::relativeToBase($path, $cssRoot, \MarioHamann\StatamicVisualEditor\SiteCss\Root::relativeRoot());

                foreach (static::leafRules((string) @file_get_contents($path)) as $rule) {
                    static::pushRule($out, $file, $rule);
                }
            }
        }

        $views = $viewsDir ?? resource_path('views');

        if (is_dir($views)) {
            foreach (static::filesEndingWith($views, '.antlers.html') as $path) {
                $file = static::relativeToBase($path, $views, 'resources/views');
                $html = (string) @file_get_contents($path);

                foreach (static::bracketNames($html) as $name) {
                    $out[] = ['name' => $name, 'file' => $file, 'selector' => '[ '.$name.' ]', 'css' => '', 'kind' => 'bracket'];
                }

                foreach (static::styleBlocks($html) as $css) {
                    preg_match_all('/@scope\s*\(\s*\.([A-Za-z_][\w-]*)/', $css, $scopes);

                    foreach (array_unique($scopes[1] ?? []) as $name) {
                        $out[] = ['name' => $name, 'file' => $file, 'selector' => '@scope(.'.$name.')', 'css' => '', 'kind' => 'scope'];
                    }

                    foreach (static::leafRules($css) as $rule) {
                        static::pushRule($out, $file, $rule);
                    }
                }
            }
        }

        return $out;
    }

    /**
     * @param  array{selector: string, css: string}  $rule
     */
    protected static function pushRule(array &$out, string $file, array $rule): void
    {
        $selector = $rule['selector'];

        if (preg_match('/^@utility\s+([A-Za-z_][\w-]*)/', $selector, $m)) {
            $out[] = ['name' => $m[1], 'file' => $file, 'selector' => $selector, 'css' => $rule['css'], 'kind' => 'utility'];

            return;
        }

        if (str_starts_with($selector, '@')) {
            return;
        }

        preg_match_all('/\.([A-Za-z_][\w-]*)/', $selector, $names);

        foreach (array_unique($names[1] ?? []) as $name) {
            $out[] = ['name' => $name, 'file' => $file, 'selector' => $selector, 'css' => $rule['css'], 'kind' => 'rule'];
        }
    }

    /**
     * The innermost rules of a stylesheet: selector and declarations, with the
     * Antlers and the comments taken out first.
     *
     * @return list<array{selector: string, css: string}>
     */
    public static function leafRules(string $css): array
    {
        $clean = preg_replace('/\{\{[\s\S]*?\}\}/', ' ', $css) ?? $css;
        $clean = preg_replace('#/\*[\s\S]*?\*/#', ' ', $clean) ?? $clean;

        preg_match_all('/([^{}]+)\{([^{}]*)\}/', $clean, $matches, PREG_SET_ORDER);

        $out = [];

        foreach ($matches as $match) {
            // What stands before the brace, after the last statement closed.
            $head = $match[1];
            $semi = strrpos($head, ';');
            $selector = trim($semi === false ? $head : substr($head, $semi + 1));
            $selector = trim(preg_replace('/\s+/', ' ', $selector) ?? $selector);

            if ($selector === '') {
                continue;
            }

            $lines = array_values(array_filter(array_map('trim', preg_split('/\R/', $match[2]) ?: []), fn ($l) => $l !== ''));

            $out[] = ['selector' => $selector, 'css' => implode("\n", $lines)];
        }

        return $out;
    }

    /**
     * The dock's own `[ … ]` run in every class attribute: the names in it.
     *
     * @return list<string>
     */
    public static function bracketNames(string $html): array
    {
        $out = [];

        preg_match_all('/\sclass\s*=\s*(["\'])([^"\']*)\1/i', $html, $attrs, PREG_SET_ORDER);

        foreach ($attrs as $attr) {
            $value = preg_replace('/\{\{[\s\S]*?\}\}/', ' ', $attr[2]) ?? $attr[2];

            if (! preg_match('/(?:^|\s)\[(.*?)\](?=\s|$)/', $value, $run)) {
                continue;
            }

            foreach (preg_split('/\s+/', trim($run[1])) ?: [] as $name) {
                if (preg_match('/^[A-Za-z_][\w-]*$/', $name)) {
                    $out[] = $name;
                }
            }
        }

        return array_values(array_unique($out));
    }

    /**
     * The CSS a view carries: its `<style>` blocks and its `style_push` pairs.
     *
     * @return list<string>
     */
    protected static function styleBlocks(string $html): array
    {
        $out = [];

        preg_match_all('/<style\b[^>]*>([\s\S]*?)<\/style>/i', $html, $styles);
        preg_match_all('/\{\{\s*style_push\b[^}]*\}\}([\s\S]*?)\{\{\s*\/style_push\s*\}\}/i', $html, $pushes);

        foreach (array_merge($styles[1] ?? [], $pushes[1] ?? []) as $block) {
            // A style_push may wrap a <style> of its own; the inner one is
            // already in the list, so the wrapper is read without it.
            $out[] = preg_replace('/<style\b[^>]*>[\s\S]*?<\/style>/i', ' ', $block) ?? $block;
        }

        return $out;
    }

    /**
     * @return list<string>
     */
    protected static function filesEndingWith(string $dir, string $suffix): array
    {
        $out = [];

        foreach (@scandir($dir) ?: [] as $entry) {
            if ($entry === '.' || $entry === '..' || str_starts_with($entry, '.')) {
                continue;
            }

            $path = $dir.'/'.$entry;

            if (is_dir($path)) {
                $out = array_merge($out, static::filesEndingWith($path, $suffix));
            } elseif (str_ends_with(strtolower($entry), $suffix)) {
                $out[] = $path;
            }
        }

        return $out;
    }

    /** `resources/css/tttt.css` for a file under the root, whatever the root is. */
    protected static function relativeToBase(string $path, string $root, string $rootLabel): string
    {
        $path = str_replace('\\', '/', $path);
        $root = rtrim(str_replace('\\', '/', $root), '/');
        $base = str_replace('\\', '/', base_path());

        if (str_starts_with($path, $base.'/')) {
            return ltrim(substr($path, strlen($base)), '/');
        }

        return trim($rootLabel, '/').'/'.ltrim(substr($path, strlen($root)), '/');
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
