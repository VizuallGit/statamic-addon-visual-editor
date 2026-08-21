<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Fieldset;

/**
 * Hvor mange af hver afkrydset set-type et nyt replicator-felt åbner med.
 *
 * Afkrydsningen er urørt: Statamics `default` (felttypen `default_sets`) gemmer
 * stadig én række pr. type. Antallet bor i et separat Statamic-grid med
 * Statamics eget `integer` — samme felt som "Max Sets". Ingen addon.js, ingen
 * CSS, ingen ændring af Display name eller andre feltindstillinger.
 *
 * Gentagelsen sker kun i hukommelsen, når et blueprint læses eller defaults
 * udregnes. YAML på disken bliver ved med at have én række pr. type.
 */
class FromTheStart
{
    public const KEY = 'sve_from_the_start_counts';

    public const MAX = 24;

    /**
     * Grid-rækker `{ set, count }` → handle => antal.
     *
     * @param  mixed  $raw
     * @return array<string, int>
     */
    public static function counts(mixed $raw): array
    {
        if (! is_array($raw)) {
            return [];
        }

        $map = [];

        foreach ($raw as $key => $row) {
            if (is_string($key) && $key !== '' && ! is_array($row)) {
                $n = (int) $row;
                if ($n >= 2) {
                    $map[$key] = min(self::MAX, $n);
                }

                continue;
            }

            if (! is_array($row)) {
                continue;
            }

            $set = $row['set'] ?? $row['type'] ?? null;
            $n = (int) ($row['count'] ?? 0);

            if (! is_string($set) || $set === '' || $n < 2) {
                continue;
            }

            $map[$set] = min(self::MAX, $n);
        }

        return $map;
    }

    /**
     * Gentager hver afkrydset type det antal gange griddet siger.
     *
     * Content uden række i griddet bliver 1. List med 3 bliver tre lists.
     * Tomt grid rører ingenting — også YAML der allerede har tre ens rækker.
     *
     * @param  array<int, mixed>  $rows
     * @return array<int, mixed>
     */
    public static function expand(array $rows, mixed $counts): array
    {
        $map = static::counts($counts);

        if ($map === []) {
            return $rows;
        }

        $templates = [];
        $order = [];

        foreach ($rows as $row) {
            if (! is_array($row) || ! is_string($row['type'] ?? null) || $row['type'] === '') {
                continue;
            }

            $type = $row['type'];

            if (isset($templates[$type])) {
                continue;
            }

            $templates[$type] = $row;
            $order[] = $type;
        }

        $out = [];

        foreach ($order as $type) {
            $n = $map[$type] ?? 1;
            $n = max(1, min(self::MAX, (int) $n));

            for ($i = 0; $i < $n; $i++) {
                $out[] = $templates[$type];
            }
        }

        return $out;
    }

    /**
     * @param  array<string, mixed>  $field
     * @return array<string, mixed>
     */
    public static function apply(array $field): array
    {
        if (($field['type'] ?? null) !== 'replicator') {
            return $field;
        }

        $default = $field['default'] ?? null;

        if (! is_array($default) || $default === []) {
            return $field;
        }

        $field['default'] = static::expand($default, $field[self::KEY] ?? []);

        return $field;
    }

    /**
     * Går blueprintet (eller et fieldset) igennem og udvider replicator-defaults.
     *
     * Samme greb som {@see ResponsiveFields}: importerede fieldsets får
     * indholdet sat om i hukommelsen. Filen på disken røres ikke.
     *
     * @param  array<string, mixed>  $node
     * @return array<string, mixed>
     */
    public static function walk(array $node, int $depth = 0): array
    {
        if ($depth > 20) {
            return $node;
        }

        foreach ($node as $key => $value) {
            if (! is_array($value)) {
                continue;
            }

            if (isset($value['import']) && is_string($value['import'])) {
                if ($fieldset = Fieldset::find($value['import'])) {
                    $contents = $fieldset->contents();
                    $contents['fields'] = static::walk($contents['fields'] ?? [], $depth + 1);
                    $fieldset->setContents($contents);
                }

                continue;
            }

            if (isset($value['handle'])) {
                if (isset($value['field']) && is_array($value['field'])) {
                    $value['field'] = static::apply($value['field']);
                } elseif (is_string($value['field'] ?? null) && ! empty($value['config'][self::KEY])) {
                    $resolved = static::resolveReference($value['field'], $value['config']);

                    if ($resolved) {
                        $value = [
                            'handle' => $value['handle'],
                            'field' => static::apply($resolved),
                        ];
                    }
                }
            }

            $node[$key] = static::walk($value, $depth);
        }

        return $node;
    }

    /**
     * @param  array<string, mixed>  $config
     * @return array<string, mixed>|null
     */
    protected static function resolveReference(string $reference, array $config): ?array
    {
        $parts = explode('.', $reference, 2);

        if (count($parts) !== 2 || ! ($fieldset = Fieldset::find($parts[0]))) {
            return null;
        }

        foreach ($fieldset->contents()['fields'] ?? [] as $field) {
            if (($field['handle'] ?? null) !== $parts[1] || ! is_array($field['field'] ?? null)) {
                continue;
            }

            return array_merge($field['field'], $config);
        }

        return null;
    }
}
