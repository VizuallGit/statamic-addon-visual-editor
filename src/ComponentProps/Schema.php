<?php

namespace MarioHamann\StatamicVisualEditor\ComponentProps;

/**
 * What a prop may be: its handle (a name Antlers can read), its type, its
 * label, and the choices a select offers.
 * Moved verbatim out of ComponentProps in WP7d.
 */
final class Schema
{
    /**
     * The kinds a prop can be.
     *
     * Every one of them ends up as a string in a partial parameter, because
     * that is all a parameter can carry. The kind is what the panel draws to
     * fill that string in: a box, a number box, a switch, a list to choose
     * from, the theme's colour picker, an asset, a page to point at. `select`
     * is the only one that needs anything more written down — the choices,
     * which travel with the declaration. A `boolean` is carried as the word
     * `true` or nothing, and `sve_defaults` hands it to the template as the
     * boolean it names.
     */
    public const TYPES = ['text', 'bard', 'number', 'boolean', 'select', 'color', 'media', 'link'];

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

            // A switch is on or it is not. Written as the one word the pair
            // reads as true, or as nothing — never as "false", "0" or "off",
            // which are all strings and all true to Antlers.
            if ($type === 'boolean') {
                $row['default'] = in_array(strtolower(trim($row['default'])), ['true', '1', 'on', 'yes'], true) ? 'true' : '';
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
}
