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
     *
     * A `group` is fields of its own, one row of them or — with `repeat` — a
     * list. Its value is still one string (`GroupValue`), and `sve_defaults`
     * hands the template the row or the rows. One level deep: a field inside a
     * group is any of the other kinds, never another group.
     */
    public const TYPES = ['text', 'bard', 'number', 'boolean', 'select', 'color', 'media', 'link', 'group'];

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
     * @return list<array<string, mixed>>
     */
    public static function normalize(array $props): array
    {
        return static::rows($props, false);
    }

    /**
     * The names Antlers gives every row of a loop. A field inside a group
     * called `count` or `first` would be overwritten by the loop's own on every
     * row (measured: `{{ count }}` in a row that has one prints the loop's).
     */
    protected const LOOP_NAMES = ['count', 'index', 'first', 'last', 'total_results'];

    /**
     * What a list's row already carries for Statamic's replicator: the set it
     * is, whether it is on, and its id. A field by one of those names would
     * overwrite them in the form.
     */
    protected const ROW_NAMES = ['type', 'enabled', '_id'];

    /**
     * @param  list<string>  $reserved  names a field here may not have
     * @return list<array<string, mixed>>
     */
    protected static function rows(array $props, bool $inGroup, array $reserved = []): array
    {
        $out = [];
        $seen = [];

        foreach ($props as $prop) {
            if (! is_array($prop)) {
                continue;
            }

            $handle = static::handle((string) ($prop['handle'] ?? ''));

            if ($handle === null || isset($seen[$handle]) || ($inGroup && in_array($handle, self::LOOP_NAMES, true)) || in_array($handle, $reserved, true)) {
                continue;
            }

            $seen[$handle] = true;

            $type = (string) ($prop['type'] ?? 'text');
            $type = in_array($type, self::TYPES, true) && ! ($inGroup && $type === 'group') ? $type : 'text';

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

            if ($type === 'group') {
                $row = static::group($row, $prop);
            }

            $out[] = $row;
        }

        return $out;
    }

    /**
     * A group's own fields, whether it repeats, and its default rewritten
     * against those fields.
     *
     * The default is always written, rows or none, because it is what tells
     * `sve_defaults` which fields a row has: a field added after a place was
     * filled in is missing from that place's rows, and a missing name inside
     * the loop reads the page's instead.
     *
     * @return array<string, mixed>
     */
    protected static function group(array $row, array $prop): array
    {
        $repeat = ($prop['repeat'] ?? false) === true;
        $sets = $repeat ? static::sets(is_array($prop['sets'] ?? null) ? $prop['sets'] : []) : [];
        $fields = $sets === [] ? static::rows(is_array($prop['fields'] ?? null) ? $prop['fields'] : [], true, $repeat ? self::ROW_NAMES : []) : [];
        $default = GroupValue::decode($row['default']);
        $renamed = [];

        foreach ($sets as $set) {
            foreach ($set['was'] ?? [] as $old) {
                $renamed[$old] = $set['handle'];
            }
        }

        $row['default'] = GroupValue::encode(
            GroupValue::names($fields, $sets),
            $default['rows'] ?? [],
            $repeat,
            $default['off'] ?? [],
            array_column($sets, 'handle'),
            $renamed
        );
        $row['repeat'] = $repeat;
        $row['fields'] = $fields;

        // Only a list has block types, and only a list that has some carries
        // the key — a group without them reads exactly as it did before.
        if ($sets !== []) {
            $row['sets'] = $sets;
        }

        return $row;
    }

    /**
     * A list's block types: a handle, a label and fields of their own. The
     * fields follow every group field's rules, and `type` is taken — it is
     * what a row says it is.
     *
     * @return list<array<string, mixed>>
     */
    protected static function sets(array $raw): array
    {
        $out = [];
        $seen = [];

        foreach ($raw as $set) {
            if (! is_array($set)) {
                continue;
            }

            $handle = static::handle((string) ($set['handle'] ?? ''));

            if ($handle === null || isset($seen[$handle])) {
                continue;
            }

            $seen[$handle] = true;
            $row = [
                'handle' => $handle,
                'label' => static::label((string) ($set['label'] ?? ''), $handle),
                'fields' => static::rows(is_array($set['fields'] ?? null) ? $set['fields'] : [], true, self::ROW_NAMES),
            ];

            // The names the type had before a rename. Rows written under one of
            // them — here and at every place that uses the component — are this
            // type, not the first.
            $was = [];

            foreach (is_array($set['was'] ?? null) ? $set['was'] : [] as $old) {
                $old = static::handle((string) $old);

                if ($old !== null && $old !== $handle && ! in_array($old, $was, true)) {
                    $was[] = $old;
                }
            }

            if ($was !== []) {
                $row['was'] = $was;
            }

            $out[] = $row;
        }

        // A name a type has now is not an old name for another.
        $now = array_column($out, 'handle');

        foreach ($out as &$set) {
            if (isset($set['was'])) {
                $set['was'] = array_values(array_diff($set['was'], $now));

                if ($set['was'] === []) {
                    unset($set['was']);
                }
            }
        }

        unset($set);

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
