<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * The inputs a component declares: `headline`, `image`, `text`.
 *
 * A component is a partial, and Antlers already hands a partial's parameters
 * to it as plain variables — `{{ partial:components/card headline="Hi" }}`
 * arrives inside as `{{ headline }}`. So the *values* need no store at all:
 * they are the call, and a card used in three places is three calls with three
 * sets of values. That is the whole point of the thing.
 *
 * What does need somewhere to live is the *declaration* — the name, the kind
 * of input, and what it falls back to. That rides in the component file, as an
 * Antlers comment at the top:
 *
 *     {{#sve_props
 *     [{"handle":"headline","type":"text","default":"Overskrift"}]
 *     #}}
 *
 * A comment, and deliberately not a tag. Antlers throws comments away while it
 * parses, and a parsed template is cached — so the declaration costs the
 * rendered page nothing at all, no class is loaded, and Live Preview never
 * touches it. A `{{ sve_props }}` tag would have been a node to visit on every
 * render of every card on the page, for a block whose only reader is the
 * Control Panel.
 *
 * It also means the feature can be switched off and the file still renders:
 * the declaration goes quiet, `{{ headline }}` keeps reading whatever the call
 * passes it, and nothing has to be undone.
 */
class ComponentProps
{
    /**
     * The kinds a prop can be.
     *
     * Every one of them ends up as a string in a partial parameter, because
     * that is all a parameter can carry. The kind is what the panel draws to
     * fill that string in: a box, an asset, a page to point at, a list to
     * choose from. `select` is the only one that needs anything more written
     * down — the choices, which travel with the declaration.
     */
    public const TYPES = ['text', 'bard', 'media', 'link', 'select'];

    /** More than this many choices is a data source, not a hand-typed list. */
    protected const MAX_OPTIONS = 50;

    private const BLOCK = '/\{\{#\s*sve_props\b(.*?)#\}\}\s*/s';

    /**
     * The fallbacks, as Antlers that actually runs.
     *
     * The declaration is a comment, and a comment is thrown away — so a default
     * written there means nothing to a rendered page. These lines are what make
     * it mean something: one assignment per field that has a fallback, above
     * the markup, where the call still wins because it arrives first.
     *
     * Wrapped in two comments so it can be found and taken off again. The
     * comments go the way of all comments; the lines between them do not.
     */
    private const OPEN = '{{# sve_defaults #}}';

    private const CLOSE = '{{# /sve_defaults #}}';

    private const DEFAULTS = '/\{\{#\s*sve_defaults\s*#\}\}.*?\{\{#\s*\/sve_defaults\s*#\}\}\s*/s';

    /**
     * Pull the declaration out of a component file.
     *
     * @return array{props: list<array<string, string>>, rest: string}
     */
    public static function peel(string $contents): array
    {
        // The fallbacks come off whether or not there is a declaration left to
        // explain them: an orphaned block would run on every render and would
        // be edited by nobody.
        $contents = (string) preg_replace(self::DEFAULTS, '', $contents, 1);

        if (! preg_match(self::BLOCK, $contents, $match)) {
            return ['props' => [], 'rest' => $contents];
        }

        return [
            'props' => static::decode($match[1]),
            'rest' => (string) preg_replace(self::BLOCK, '', $contents, 1),
        ];
    }

    /** The comment block for a declaration, or '' when there is nothing to say. */
    public static function block(array $props): string
    {
        $clean = static::normalize($props);

        if ($clean === []) {
            return '';
        }

        return "{{#sve_props\n".json_encode($clean, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)."\n#}}\n\n".static::defaults($clean);
    }

    /**
     * The lines that make a default do something.
     *
     * `{{ image = image ?? "…" }}` — the field keeps whatever the call gave it
     * and takes the fallback only when the call gave it nothing. Which is what
     * a default is, and what the panel has been promising all along.
     *
     * A value carrying both kinds of quote is skipped rather than written out
     * broken: Antlers has no escape for the quote a parameter closes on, and a
     * half-written assignment would take the whole component down.
     */
    public static function defaults(array $props): string
    {
        $lines = [];

        foreach ($props as $prop) {
            $value = (string) ($prop['default'] ?? '');
            $quote = ! str_contains($value, '"') ? '"' : (! str_contains($value, "'") ? "'" : '');

            if ($value === '' || $quote === '') {
                continue;
            }

            $lines[] = "{{ {$prop['handle']} = {$prop['handle']} ?? {$quote}{$value}{$quote} }}";
        }

        if ($lines === []) {
            return '';
        }

        return self::OPEN."\n".implode("\n", $lines)."\n".self::CLOSE."\n\n";
    }

    /**
     * What a component declares, read from its view name.
     *
     * This is what the section side asks for: it holds the call, and needs to
     * know which fields to draw next to it.
     *
     * @return list<array<string, string>>
     */
    public static function forView(string $view): array
    {
        $path = static::viewPath($view);

        return $path === null ? [] : static::peel((string) file_get_contents($path))['props'];
    }

    /**
     * @return list<array<string, string>>
     */
    protected static function decode(string $json): array
    {
        $data = json_decode(trim($json), true);

        return is_array($data) ? static::normalize($data) : [];
    }

    /**
     * Every prop is a handle, a type and a default, and nothing else gets in.
     *
     * A handle has to be a name Antlers can read as a variable, or the call it
     * ends up in would not parse — so a row that cannot make one is dropped
     * rather than written out broken.
     *
     * @return list<array<string, string>>
     */
    public static function normalize(array $props): array
    {
        $out = [];
        $seen = [];

        foreach ($props as $prop) {
            if (! is_array($prop)) {
                continue;
            }

            $handle = static::handle((string) ($prop['handle'] ?? ''));

            if ($handle === null || isset($seen[$handle])) {
                continue;
            }

            $seen[$handle] = true;

            $type = (string) ($prop['type'] ?? 'text');
            $type = in_array($type, self::TYPES, true) ? $type : 'text';

            $row = [
                'handle' => $handle,
                'type' => $type,
                'label' => static::label((string) ($prop['label'] ?? ''), $handle),
                'default' => (string) ($prop['default'] ?? ''),
            ];

            // Only a select has choices. Carrying an empty `options` on every
            // other row would put a key in the file that means nothing there.
            if ($type === 'select') {
                $row['options'] = static::options($prop['options'] ?? []);
            }

            $out[] = $row;
        }

        return $out;
    }

    /**
     * The choices a select offers.
     *
     * Written as a list, but the panel hands them over as one comma-separated
     * line — so both are read. A choice is its own label: `Small, Medium` is
     * what the editor picks from and what the template receives, which keeps
     * the declaration something you can read without a key to it.
     *
     * @return list<string>
     */
    protected static function options(mixed $raw): array
    {
        if (is_string($raw)) {
            $raw = explode(',', $raw);
        }

        if (! is_array($raw)) {
            return [];
        }

        $out = [];

        foreach ($raw as $option) {
            if (is_array($option) || is_object($option)) {
                continue;
            }

            $value = trim((string) $option);

            // A quote in a choice would close the parameter it is written into.
            $value = str_replace(['"', "'"], '', $value);

            if ($value === '' || in_array($value, $out, true)) {
                continue;
            }

            $out[] = mb_substr($value, 0, 60);

            if (count($out) >= self::MAX_OPTIONS) {
                break;
            }
        }

        return $out;
    }

    public static function handle(string $raw): ?string
    {
        $handle = strtolower(trim(str_replace([' ', '-'], '_', $raw)));
        $handle = preg_replace('/[^a-z0-9_]/', '', $handle) ?? '';

        if ($handle === '' || strlen($handle) > 40 || ! preg_match('/^[a-z_]/', $handle)) {
            return null;
        }

        return $handle;
    }

    protected static function label(string $raw, string $handle): string
    {
        $label = trim($raw);

        if ($label !== '') {
            return mb_substr($label, 0, 60);
        }

        return ucfirst(str_replace('_', ' ', $handle));
    }

    protected static function viewPath(string $view): ?string
    {
        $view = trim(str_replace('\\', '/', $view), '/');

        if ($view === '' || str_contains($view, '..') || ! preg_match('#^[A-Za-z0-9_][A-Za-z0-9_/-]*$#', $view)) {
            return null;
        }

        $base = realpath(resource_path('views'));
        $path = realpath(resource_path('views/'.$view.'.antlers.html'));

        if (! is_string($base) || ! is_string($path) || ! str_starts_with($path, $base.DIRECTORY_SEPARATOR)) {
            return null;
        }

        return is_file($path) ? $path : null;
    }
}
