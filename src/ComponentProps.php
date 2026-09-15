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

    /**
     * What every prop is called once it reaches Antlers.
     *
     * A component declares `headline`; the page around it very often has a
     * field called `headline` too, and a partial is handed the whole scope it
     * was called from. Without a prefix the two are the same name, and the
     * outer one wins — a card's heading quietly became the section's heading,
     * with nothing on screen to say why.
     *
     * The prefix is only worn on the Antlers side: the declaration, the panel
     * and everything the author types keep the short handle. `param()` is the
     * one place the two spellings meet.
     */
    public const PREFIX = 'props_';

    /** The parameter name a prop is written as, in the call and in the pair. */
    public static function param(string $handle): string
    {
        return self::PREFIX.$handle;
    }

    /** More than this many choices is a data source, not a hand-typed list. */
    protected const MAX_OPTIONS = 50;

    private const BLOCK = '/\{\{#\s*sve_props\b(.*?)#\}\}\s*/s';

    /**
     * The fallbacks, as Antlers that actually runs.
     *
     * The declaration is a comment, and a comment is thrown away — so a default
     * written there means nothing to a rendered page. The `sve_defaults` pair
     * is what makes it mean something: it wraps the component and hands the
     * contents one `props` array, carrying the call's value where there is one
     * and the declared fallback where there is not.
     *
     * It used to be a line of Antlers per prop, above the markup:
     *
     *     {{ headline = headline ?? "Overskrift" }}
     *
     * That looked local and was not. An Antlers assignment leaves the partial
     * it is written in and stays in the page's scope for the rest of the
     * render, so one card's headline became every later section's headline.
     * A tag pair keeps to itself, nested pairs included — which is the whole
     * reason for the shape.
     */
    private const PAIR_CLOSE = '{{ /sve_defaults }}';

    private const WRAP = '/\{\{\s*sve_defaults\b[^}]*\}\}\r?\n?(.*?)\r?\n?\{\{\s*\/\s*sve_defaults\s*\}\}\s*/s';

    /**
     * The shape this replaced, so a file written before it still opens clean.
     *
     * `peel()` takes it off and nothing writes it back, so a component moves
     * to the pair the first time it is saved.
     */
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
        //
        // Two shapes, because a file written before the pair is still a file:
        // the old assignments go away entirely, the pair gives its contents
        // back. Order matters only in that neither can match the other.
        $contents = (string) preg_replace(self::DEFAULTS, '', $contents, 1);
        $contents = (string) preg_replace(self::WRAP, '$1', $contents, 1);

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

        return "{{#sve_props\n".json_encode($clean, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)."\n#}}\n\n";
    }

    /**
     * A finished component file: what it declares, around what it renders.
     *
     * The pair goes around everything, not just the markup — a component's CSS
     * and Tailwind panes are written in the same file and read the same props,
     * and a fallback that stopped applying halfway down the file would be a
     * worse rule than no fallback at all.
     */
    public static function wrap(array $props, string $body): string
    {
        $clean = static::normalize($props);
        $open = static::open($clean);

        if ($open !== '') {
            $body = $open."\n".rtrim($body)."\n".self::PAIR_CLOSE."\n";
        }

        return static::block($clean).$body;
    }

    /**
     * The opening tag: one parameter per prop, the default as its value.
     *
     * Every declared prop is written, fallback or not. A prop that appeared in
     * `props` only when it happened to have a default would make
     * `{{ props.link }}` something you have to test for before you use it, and
     * the panel would be declaring a name the template cannot count on.
     *
     * A default Antlers cannot carry in a parameter is written as empty rather
     * than written out broken — both kinds of quote, or a brace pair that would
     * close the tag early, would take the whole component down. The prop still
     * exists; it just starts empty, which is what the file already says for
     * every prop with no default at all.
     */
    public static function open(array $props): string
    {
        $params = [];

        foreach ($props as $prop) {
            $handle = (string) ($prop['handle'] ?? '');

            if ($handle === '') {
                continue;
            }

            $params[] = static::param($handle).'="'.static::parameterValue((string) ($prop['default'] ?? '')).'"';
        }

        return $params === [] ? '' : '{{ sve_defaults '.implode(' ', $params).' }}';
    }

    /** What survives being written between double quotes in an Antlers tag. */
    protected static function parameterValue(string $value): string
    {
        // A brace of either kind is left out whole: `}` ends the tag for the
        // reader that takes the parameters back off again, and `{{` starts
        // something Antlers would try to evaluate.
        if ($value === '' || str_contains($value, '"') || str_contains($value, '{') || str_contains($value, '}')) {
            return '';
        }

        // A newline inside a parameter ends the tag on some parsers and not on
        // others. One line, always.
        return trim((string) preg_replace('/\s+/', ' ', $value));
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

    /**
     * `scope` and `as` are Antlers' own parameters on a tag pair — a prop by
     * either name would be read as an instruction to the pair instead of a
     * value inside it, and the prop would go missing with nothing to say why.
     */
    protected const RESERVED = ['scope', 'as'];

    public static function handle(string $raw): ?string
    {
        $handle = strtolower(trim(str_replace([' ', '-'], '_', $raw)));
        $handle = preg_replace('/[^a-z0-9_]/', '', $handle) ?? '';

        // The prefix is added on the way out, so a name typed with it already
        // on would come back as `props_props_headline`. Typing it is a fair
        // mistake to make — the panel shows the prefixed spelling underneath.
        while (str_starts_with($handle, self::PREFIX)) {
            $handle = substr($handle, strlen(self::PREFIX));
        }

        if ($handle === '' || strlen($handle) > 40 || ! preg_match('/^[a-z_]/', $handle)) {
            return null;
        }

        return in_array($handle, self::RESERVED, true) ? null : $handle;
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
