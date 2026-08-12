<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Contracts\Entries\Entry as EntryContract;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;

/**
 * What is using a section — and taking those uses away again.
 *
 * Two things get deleted from the library, and they are used in different ways.
 * A *synced (global) section* is referenced: a page holds a `global_section` row
 * carrying the source's id, and deleting the source has to take those rows with
 * it. A *section type* is a set in the page-builder fieldset: a page holds a row
 * of that `type` with its own content in it, and deleting the type has to take
 * those rows too. Custom sections and templates are copied on insert, so they
 * leave no trail and this class finds nothing for them — the honest answer, not
 * a gap.
 *
 * Both scans walk an entry's whole data tree rather than one named field. A row
 * can sit in a nested Replicator (inside a column, inside a reusable section)
 * just as easily as at the top, and the site — not the addon — decides what
 * those fields are called.
 */
class SectionUsage
{
    /** The Replicator set handle a page uses to reference a synced section. */
    protected static function set(): string
    {
        return config('statamic-visual-editor.saved_sections.set', 'global_section');
    }

    /**
     * The field sections live in. Used to scope a match by set handle: a row's
     * `type` alone doesn't say what kind of thing it is, and a *block* set inside
     * a section could perfectly well be called `code_block` too. Only rows in a
     * list under this key are sections.
     */
    protected static function scope(): string
    {
        return config('statamic-visual-editor.previews.field', 'page_sections');
    }

    /**
     * Every entry referencing the saved (synced) section.
     *
     * @return array<int, array{id: string, title: string, collection: string, collection_title: string, edit_url: ?string, count: int}>
     */
    public static function of(string $id): array
    {
        // Unscoped: the match is on a set handle *and* an entry id, which can't
        // collide with anything else, so a reference is found wherever it sits.
        return static::collect(static::referenceMatcher($id), null);
    }

    /** Every entry holding a section of this type. */
    public static function ofType(string $type): array
    {
        return static::collect(static::typeMatcher($type), static::scope());
    }

    /** Removes every reference to the saved section. Returns entries touched. */
    public static function strip(string $id): int
    {
        return static::remove(static::referenceMatcher($id), null);
    }

    /** Removes every section of this type. Returns entries touched. */
    public static function stripType(string $type): int
    {
        return static::remove(static::typeMatcher($type), static::scope());
    }

    /**
     * A `global_section` row pointing at this id. The entries field shares the
     * set's handle, and Statamic stores a max-one entries value as either a bare
     * id or a one-item array depending on how it was written — both count.
     */
    protected static function referenceMatcher(string $id): callable
    {
        $set = static::set();

        return function ($row) use ($set, $id) {
            if (! is_array($row) || ($row['type'] ?? null) !== $set) {
                return false;
            }

            return in_array($id, array_map('strval', (array) ($row[$set] ?? null)), true);
        };
    }

    /** Any Replicator row of this set type. */
    protected static function typeMatcher(string $type): callable
    {
        return fn ($row) => is_array($row) && ($row['type'] ?? null) === $type;
    }

    /** The entries whose data matches, with how many rows each one holds. */
    protected static function collect(callable $matches, ?string $scope): array
    {
        $usages = [];

        foreach (Collection::handles() as $handle) {
            foreach (Entry::query()->where('collection', $handle)->get() as $entry) {
                $count = static::countIn($entry->data()->all(), $matches, $scope);

                if ($count === 0) {
                    continue;
                }

                $usages[] = [
                    'id' => $entry->id(),
                    'title' => (string) ($entry->value('title') ?: $entry->slug()),
                    'collection' => $handle,
                    'collection_title' => (string) (Collection::findByHandle($handle)?->title() ?: $handle),
                    'edit_url' => $entry->editUrl(),
                    'count' => $count,
                ];
            }
        }

        return $usages;
    }

    /**
     * Strips matching rows out of every entry that has them, and saves it.
     *
     * A full save, not a quiet one: those pages just lost a section, and the
     * events are what invalidate the static cache and record the change — skip
     * them and a cached page keeps serving a section that no longer exists.
     */
    protected static function remove(callable $matches, ?string $scope): int
    {
        $touched = 0;

        foreach (Collection::handles() as $handle) {
            foreach (Entry::query()->where('collection', $handle)->get() as $entry) {
                $data = $entry->data()->all();

                if (static::countIn($data, $matches, $scope) === 0) {
                    continue;
                }

                $entry->data(static::stripFrom($data, $matches, $scope))->save();
                $touched++;
            }
        }

        return $touched;
    }

    /**
     * How many rows in the tree match.
     *
     * `$eligible` says whether the list currently being walked is one the match
     * is allowed in — set from the key that holds it, so a `blocks` list inside a
     * section is skipped when the scope is the section field. A matched row is
     * not descended into: it goes whole, so counting what's nested inside would
     * report rows the strip never removes separately.
     */
    protected static function countIn(mixed $node, callable $matches, ?string $scope, bool $eligible = true): int
    {
        if (! is_array($node)) {
            return 0;
        }

        $count = 0;

        if (array_is_list($node)) {
            foreach ($node as $item) {
                if ($eligible && $matches($item)) {
                    $count++;

                    continue;
                }

                $count += static::countIn($item, $matches, $scope, $eligible);
            }

            return $count;
        }

        foreach ($node as $key => $value) {
            $count += static::countIn($value, $matches, $scope, $scope === null || $key === $scope);
        }

        return $count;
    }

    /** The same tree with every matching row taken out. */
    protected static function stripFrom(mixed $node, callable $matches, ?string $scope, bool $eligible = true): mixed
    {
        if (! is_array($node)) {
            return $node;
        }

        if (array_is_list($node)) {
            $kept = [];

            foreach ($node as $item) {
                if ($eligible && $matches($item)) {
                    continue;
                }

                $kept[] = static::stripFrom($item, $matches, $scope, $eligible);
            }

            return $kept;
        }

        foreach ($node as $key => $value) {
            $node[$key] = static::stripFrom($value, $matches, $scope, $scope === null || $key === $scope);
        }

        return $node;
    }

    /** Whether the current user may edit every entry that uses it. */
    public static function allEditable(array $usages, ?\Statamic\Contracts\Auth\User $user): bool
    {
        if (! $user) {
            return false;
        }

        foreach ($usages as $usage) {
            $entry = Entry::find($usage['id']);

            if (! $entry instanceof EntryContract || ! $user->can('edit', $entry)) {
                return false;
            }
        }

        return true;
    }
}
