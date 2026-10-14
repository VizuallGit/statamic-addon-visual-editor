<?php

namespace MarioHamann\StatamicVisualEditor\ComponentProps;

/**
 * A group's value, as the one string a partial parameter can carry.
 *
 * Every other prop is a string already. A group is rows of fields — a list
 * when it repeats, one row when it does not — and a parameter holds nothing
 * but text. Written as JSON it would not survive the trip: Antlers reads
 * `{name}` inside a parameter as a variable to fill in, and the quotes inside
 * would close the parameter they are written in. So the JSON travels as
 * base64url behind a prefix: letters, digits, `-` and `_`, nothing Antlers or
 * the call's reader can mistake for anything else. Measured in a real render
 * with `æøå`, quotes and `{{ x }}` in the text: it arrives whole.
 *
 * The payload names its fields as well as its rows, and that is not
 * decoration. Inside `{{ props_items }} … {{ /props_items }}` a name a row
 * does not have is looked up in the page around it — a row without `title`
 * printed the page's title (measured). A row that has `title` as an empty
 * string prints nothing. So every row is written with every field, and the
 * list of fields rides along for the rows that were written before a field
 * was added.
 */
final class GroupValue
{
    public const PREFIX = 'sve64:';

    /** What a row of a list with block types says it is. */
    public const TYPE = 'type';

    /**
     * `off` is the rows switched off in the panel — Statamic's own switch on a
     * replicator row, which keeps the row and leaves it out of the page. Kept
     * as positions beside the rows rather than as a key in them, because a key
     * in a row is a name the template reads, and a field may well be called
     * `enabled`. Written only when there is one, so a list without any reads
     * exactly as it did before there was a switch.
     *
     * `types` is the block types a list's rows can be, first one first — the
     * declaration's, carried in the component's own default so `sve_defaults`
     * can tell a row with no type (written before the list had types) to be
     * the first kind rather than none. Written only when there are types.
     *
     * `renamed` is the names block types had before: `{old: new}`. A row
     * written under the old name — in the component's own rows or at any place
     * that uses it — is the renamed type, not the first one.
     *
     * @param  list<string>  $fields
     * @param  list<array<string, mixed>>  $rows
     * @param  list<int>  $off
     * @param  list<string>  $types
     * @param  array<string, string>  $renamed
     */
    public static function encode(array $fields, array $rows, bool $repeat, array $off = [], array $types = [], array $renamed = []): string
    {
        $types = array_values(array_filter($types, fn ($type) => is_string($type) && $type !== ''));
        $renamed = static::renames($renamed, $types);
        $rows = static::typed(static::fill($fields, $rows), $types, $renamed);
        $off = static::positions($off, count($rows));
        $data = ['fields' => array_values($fields), 'repeat' => $repeat, 'rows' => $rows];

        if ($off !== []) {
            $data['off'] = $off;
        }

        if ($types !== []) {
            $data['types'] = $types;
        }

        if ($renamed !== []) {
            $data['renamed'] = $renamed;
        }

        $json = (string) json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);

        return self::PREFIX.rtrim(strtr(base64_encode($json), '+/', '-_'), '=');
    }

    /**
     * The fields, rows and shape a written value holds, or null when the value
     * is not one of ours — a plain string, a page field handed over with `:`.
     *
     * @return array{fields: list<string>, repeat: bool, rows: list<array<string, string>>, off: list<int>, types: list<string>, renamed: array<string, string>}|null
     */
    public static function decode(mixed $value): ?array
    {
        if (! is_string($value) || ! str_starts_with($value, self::PREFIX)) {
            return null;
        }

        $body = strtr(substr($value, strlen(self::PREFIX)), '-_', '+/');
        $json = base64_decode($body.str_repeat('=', (4 - strlen($body) % 4) % 4), true);
        $data = is_string($json) ? json_decode($json, true) : null;

        if (! is_array($data)) {
            return null;
        }

        $fields = array_values(array_unique(array_filter(
            is_array($data['fields'] ?? null) ? $data['fields'] : [],
            fn ($field) => is_string($field) && $field !== ''
        )));

        $types = array_values(array_filter(
            is_array($data['types'] ?? null) ? $data['types'] : [],
            fn ($type) => is_string($type) && $type !== ''
        ));
        $renamed = static::renames(is_array($data['renamed'] ?? null) ? $data['renamed'] : [], $types);
        $rows = static::typed(static::fill($fields, is_array($data['rows'] ?? null) ? $data['rows'] : []), $types, $renamed);

        return [
            'fields' => $fields,
            'repeat' => ($data['repeat'] ?? true) === true,
            'rows' => $rows,
            'off' => static::positions(is_array($data['off'] ?? null) ? $data['off'] : [], count($rows)),
            'types' => $types,
            'renamed' => $renamed,
        ];
    }

    /**
     * The names every row has: the fields — and, in a list with block types,
     * `type` and every type's fields, so a headline row has the image row's
     * fields too, empty. Inside the loop a name a row does not have is read
     * from the page, and a branch for one type sits in the same loop as the
     * others.
     *
     * @param  list<array<string, mixed>>  $fields
     * @param  list<array<string, mixed>>  $sets
     * @return list<string>
     */
    public static function names(array $fields, array $sets = []): array
    {
        if ($sets === []) {
            return array_values(array_column($fields, 'handle'));
        }

        $names = [self::TYPE];

        foreach ($sets as $set) {
            foreach (is_array($set['fields'] ?? null) ? $set['fields'] : [] as $field) {
                $names[] = (string) ($field['handle'] ?? '');
            }
        }

        return array_values(array_unique(array_filter($names, fn ($name) => $name !== '')));
    }

    /**
     * Every row a type the list has: one it does not know, or none at all,
     * is the first.
     *
     * @param  list<array<string, string>>  $rows
     * @param  list<string>  $types
     * @return list<array<string, string>>
     */
    public static function typed(array $rows, array $types, array $renamed = []): array
    {
        if ($types === []) {
            return $rows;
        }

        return array_map(function (array $row) use ($types, $renamed) {
            $type = $row[self::TYPE] ?? null;

            if (is_string($type) && isset($renamed[$type])) {
                $type = $renamed[$type];
            }

            $row[self::TYPE] = in_array($type, $types, true) ? $type : $types[0];

            return $row;
        }, $rows);
    }

    /**
     * Old names that point at a type the list still has, and are not a type's
     * name now themselves.
     *
     * @return array<string, string>
     */
    private static function renames(array $renamed, array $types): array
    {
        $out = [];

        foreach ($renamed as $old => $new) {
            if (is_string($old) && $old !== '' && is_string($new) && in_array($new, $types, true) && ! in_array($old, $types, true)) {
                $out[$old] = $new;
            }
        }

        return $out;
    }

    /**
     * The rows the page shows: every row but the ones switched off.
     *
     * @return list<array<string, string>>
     */
    public static function shown(array $value): array
    {
        $off = array_flip($value['off'] ?? []);

        return array_values(array_filter($value['rows'], fn ($row, $at) => ! isset($off[$at]), ARRAY_FILTER_USE_BOTH));
    }

    /**
     * Positions of real rows, each once, in order.
     *
     * @return list<int>
     */
    private static function positions(array $off, int $count): array
    {
        $out = array_values(array_unique(array_filter(
            array_map(fn ($at) => is_int($at) ? $at : (is_string($at) && ctype_digit($at) ? (int) $at : -1), $off),
            fn (int $at) => $at >= 0 && $at < $count
        )));

        sort($out);

        return $out;
    }

    /**
     * Every row with exactly these fields: a missing one written as empty, one
     * that is no longer declared left out.
     *
     * @param  list<string>  $fields
     * @return list<array<string, string>>
     */
    public static function fill(array $fields, array $rows): array
    {
        $out = [];

        foreach ($rows as $row) {
            if (! is_array($row)) {
                continue;
            }

            $clean = [];

            foreach ($fields as $field) {
                $clean[$field] = static::scalar($row[$field] ?? '');
            }

            $out[] = $clean;
        }

        return $out;
    }

    /** Do two written values hold the same rows? */
    public static function same(string $a, string $b): bool
    {
        $left = static::decode($a);
        $right = static::decode($b);

        return $left !== null && $right !== null && $left['rows'] === $right['rows'] && $left['off'] === $right['off'];
    }

    /**
     * A value as the string every other prop already is. A switch is the word
     * the pair reads back as a boolean; anything that is not text is nothing.
     */
    private static function scalar(mixed $value): string
    {
        return match (true) {
            is_bool($value) => $value ? 'true' : 'false',
            is_int($value), is_float($value) => (string) $value,
            is_string($value) => $value,
            default => '',
        };
    }
}
