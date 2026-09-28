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
 *
 * "Holds the page builder" is {@see SectionField}'s answer: the Replicator the
 * blueprint marks as its sections, or the one with the default name. Given a
 * `$field`, a blueprint with a field of that handle is looked for instead.
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

        $holds = $field === null
            ? fn ($blueprint) => SectionField::in($blueprint)
            : fn ($blueprint) => $blueprint->hasField($field);
        $default = $collection->entryBlueprint();

        if ($default && $holds($default)) {
            return $default;
        }

        foreach ($collection->entryBlueprints() as $blueprint) {
            if ($holds($blueprint)) {
                return $blueprint;
            }
        }

        return $default;
    }
}
