<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Fieldset;
use Statamic\Fields\Fieldset as FieldsetObject;
use Statamic\Support\Arr;

/**
 * A fieldset's fields, whichever of the two shapes it is stored in.
 *
 * Statamic writes a fieldset one of two ways and never both: a flat `fields`
 * list, or `sections`, each with its own `fields`. Which one you get is decided
 * by the Fieldsets screen at save time — a single unnamed section stays flat,
 * and naming it, adding a second one, or making it collapsible switches the
 * whole file over (`FieldsetController::shouldStoreAsFlatFields`).
 *
 * Reading only `contents()['fields']` therefore works right up until someone
 * organises their fields, and then it silently returns nothing. In this addon
 * that failure is invisible and expensive: the field reference is never
 * inlined, so no `_visual_id` reaches the nested sets, and the arrow and
 * click-to-focus in Live Preview stop working on that section with nothing
 * anywhere to say why.
 *
 * Statamic flattens the two shapes in exactly this way itself (see
 * `Fieldset::fields()`); this is the same flattening kept as raw arrays,
 * because the callers here work on the `['handle' => …, 'field' => […]]` shape
 * rather than on a `Fields` object.
 */
class FieldsetFields
{
    /**
     * @param  FieldsetObject|string|null  $fieldset  A fieldset, its handle, or null.
     * @return array<int, array<string, mixed>> the raw field definitions, in order
     */
    public static function of($fieldset): array
    {
        if (is_string($fieldset)) {
            $fieldset = Fieldset::find($fieldset);
        }

        if (! $fieldset instanceof FieldsetObject) {
            return [];
        }

        return static::flatten($fieldset->contents());
    }

    /**
     * The same thing for contents already read off disk — the path taken where
     * the repository's copy must not be touched, because this addon injects
     * `_visual_id` into that copy at runtime.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function flatten(array $contents): array
    {
        $sections = Arr::get($contents, 'sections', []);

        if (! empty($sections) && is_array($sections)) {
            $out = [];

            foreach ($sections as $section) {
                foreach ((array) Arr::get($section, 'fields', []) as $field) {
                    $out[] = $field;
                }
            }

            return $out;
        }

        return (array) Arr::get($contents, 'fields', []);
    }
}
