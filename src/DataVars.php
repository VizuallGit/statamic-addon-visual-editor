<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\DataVars\Builtins;
use MarioHamann\StatamicVisualEditor\DataVars\Rows;
use MarioHamann\StatamicVisualEditor\DataVars\Scope;
use MarioHamann\StatamicVisualEditor\DataVars\Sources;

/**
 * Every variable a section template can print, as a flat list to pick from.
 *
 * Three groups, because that is how you look for one: the section you are
 * editing, the page it sits on, and the site around it. The names are the
 * point — a handle you can read off a blueprint is not the same as knowing
 * it is spelled `site_settings.phone` in Antlers.
 *
 * Globals carry their real values, read here. Section and page values are
 * whatever is in the open form right now, so the client fills those in.
 *
 * This class is the entry point the controller calls; the work lives in
 * `DataVars\Builtins` (Statamic's own variables), `DataVars\Rows` (a field
 * list flattened into rows), `DataVars\Sources` (section, collection,
 * globals) and `DataVars\Scope` (where a loop chain lands). Split in WP7d,
 * code moved verbatim.
 */
class DataVars
{
    public const LOOP_TYPES = Rows::LOOP_TYPES;
    public const ASSET_TYPES = Rows::ASSET_TYPES;
    public const SKIP_TYPES = Rows::SKIP_TYPES;

    /**
     * Statamic's own page variables — not in any blueprint, always there.
     *
     * @see Builtins::pageCore()
     */
    public static function pageCore(): array
    {
        return Builtins::pageCore();
    }

    /**
     * The site itself and the request — the things that are true on every page.
     *
     * @see Builtins::systemVars()
     */
    public static function systemVars(): array
    {
        return Builtins::systemVars();
    }

    /**
     * Every global set, with the values it actually holds in this site.
     *
     * @see Sources::globals()
     */
    public static function globals(): array
    {
        return Sources::globals();
    }

    /**
     * The fields on one replicator set — the section open in the dock.
     *
     * @see Sources::sectionFields()
     */
    public static function sectionFields(string $collection, string $set): array
    {
        return Sources::sectionFields($collection, $set);
    }

    /**
     * A collection's entry fields — for a template that loops over them.
     *
     * @see Sources::collectionFields()
     */
    public static function collectionFields(string $handle): array
    {
        return Sources::collectionFields($handle);
    }

    /**
     * Where a chain of loops lands: the names that print inside the innermost one.
     *
     * @see Scope::scopeFields()
     */
    public static function scopeFields(string $collection, string $set, array $chain): ?array
    {
        return Scope::scopeFields($collection, $set, $chain);
    }

    /**
     * A value shortened to something that fits on one row of a menu.
     *
     * @see Rows::preview()
     */
    public static function preview(mixed $value): string
    {
        return Rows::preview($value);
    }
}
