<?php

namespace MarioHamann\StatamicVisualEditor\ComponentProps;

/**
 * The declaration as it sits in the file: the `{{#sve_props … #}}` comment
 * at the top and the `sve_defaults` pair around everything else. Peel it
 * off, write it back.
 * Moved verbatim out of ComponentProps in WP7d.
 */
final class Declaration
{
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
        $clean = Schema::normalize($props);

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
        $clean = Schema::normalize($props);
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

            $params[] = Schema::param($handle).'="'.static::parameterValue((string) ($prop['default'] ?? '')).'"';
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
     * @return list<array<string, string>>
     */
    protected static function decode(string $json): array
    {
        $data = json_decode(trim($json), true);

        return is_array($data) ? Schema::normalize($data) : [];
    }
}
