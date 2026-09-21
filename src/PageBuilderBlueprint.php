<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Fields\Blueprint;

/**
 * The entry blueprint that holds the page builder.
 *
 * A collection's default blueprint is simply its first one, and that is not
 * always the page: on a site with a landing-page blueprint sorted before
 * `page`, every set lookup was answered from a blueprint without sections. A
 * section made from the HTML tree got a 404 from section-meta and never
 * reached the form (the next one replaced it), and the tree could not name
 * the sections already on the page. Hidden blueprints count too — the home
 * page's usually is.
 */
final class PageBuilderBlueprint
{
    /**
     * @param  object|null  $collection  a Statamic collection (untyped: tests hand in a mock)
     */
    public static function for($collection, ?string $field = null): ?Blueprint
    {
        if (! $collection) {
            return null;
        }

        $field ??= (string) config('statamic-visual-editor.previews.field', 'page_sections');
        $default = $collection->entryBlueprint();

        if ($default && $default->hasField($field)) {
            return $default;
        }

        foreach ($collection->entryBlueprints() as $blueprint) {
            if ($blueprint->hasField($field)) {
                return $blueprint;
            }
        }

        return $default;
    }
}
