<?php

namespace MarioHamann\StatamicVisualEditor\AiChat;

use MarioHamann\StatamicVisualEditor\SectionTemplate;
use MarioHamann\StatamicVisualEditor\SectionTypes;
use MarioHamann\StatamicVisualEditor\SetPreviewImages;

/**
 * A new section type the agent made, added to the page builder after the run.
 *
 * The agent never writes page_sections.yaml: every page depends on that list,
 * and a model writing "the full YAML back" is how sets disappear. It calls
 * register_section instead, the gate records the request, and this adds the
 * one set to the list through the same code the editor's own "new section"
 * uses — with nothing else in the file touched.
 *
 * A request is only honoured for a partial that exists, in a group that
 * exists, under a handle not already taken.
 */
final class Registration
{
    /**
     * @param  list<array{group?: mixed, handle?: mixed, display?: mixed, fieldset?: mixed}>  $requests
     * @return list<string>  the handles added
     */
    public static function apply(array $requests): array
    {
        if ($requests === []) {
            return [];
        }

        $list = SectionTypes::list();
        $contents = $list->read();
        $groups = $contents === null ? null : $list->sets($contents);

        if ($groups === null) {
            return [];
        }

        $taken = [];

        foreach ($groups as $group) {
            foreach (array_keys(is_array($group['sets'] ?? null) ? $group['sets'] : []) as $handle) {
                $taken[$handle] = true;
            }
        }

        $added = [];

        foreach ($requests as $request) {
            $set = static::set($request, $groups, $taken);

            if ($set === null) {
                continue;
            }

            [$group, $handle, $definition] = $set;
            $groups[$group]['sets'][$handle] = $definition;
            $taken[$handle] = true;
            $added[] = $handle;
        }

        if ($added !== []) {
            $list->save($list->withSets($contents, $groups));
            SetPreviewImages::flush();
        }

        return $added;
    }

    /**
     * @return array{0: string, 1: string, 2: array}|null
     */
    private static function set(array $request, array $groups, array $taken): ?array
    {
        $group = is_string($request['group'] ?? null) ? $request['group'] : '';
        $handle = is_string($request['handle'] ?? null) ? $request['handle'] : '';
        $display = is_string($request['display'] ?? null) ? trim($request['display']) : '';
        $fieldset = is_string($request['fieldset'] ?? null) ? $request['fieldset'] : null;

        if (! isset($groups[$group]) || ! is_array($groups[$group]) || $display === '' || isset($taken[$handle])) {
            return null;
        }

        if (! preg_match('/^[a-z0-9_]+\/[a-z0-9_]+$/', $handle) || SectionTemplate::path($handle) === null) {
            return null;
        }

        // A set with no fields is a placeholder the picker leaves out; the
        // agent's sections always come with a fieldset of their own.
        if ($fieldset === null || ! preg_match('/^[a-z0-9_]+(\.[a-z0-9_]+)+$/', $fieldset) || ! is_file(resource_path('fieldsets/'.str_replace('.', '/', $fieldset).'.yaml'))) {
            return null;
        }

        return [$group, $handle, ['display' => $display, 'fields' => [['import' => $fieldset]]]];
    }
}
