<?php

namespace MarioHamann\StatamicVisualEditor\Tags\Resolve;

use Illuminate\Support\Facades\Log;
use MarioHamann\StatamicVisualEditor\Tags\Resolve\BlueprintFields;

/**
 * Where on the page the tag stands: the section type, the chain of sets down
 * to the row, the field type. Shared by the tag and its resolvers — each has
 * `$this->params` and `$this->context` (the tag from Statamic, the resolvers
 * from their constructor). Moved verbatim out of Tags\VisualEdit in WP7b.
 */
trait ResolvesScope
{
    /**
     * The page section this tag renders inside, by set handle
     * ("featured_section/style_2"), or '' when it cannot be told.
     *
     * `_visual_id` cascades from the section into everything drawn inside it, so
     * a tag several loops deep can still say which section it belongs to. Read
     * off the raw value rather than the augmented one: augmentation turns the
     * sets into objects, and all that is wanted here is `type`.
     */
    protected function resolveSectionType(): string
    {
        $uid = (string) ($this->context->get('_visual_id') ?? '');

        if ($uid === '') {
            return '';
        }

        try {
            $page = $this->context->get('page');

            if (! $page || ! method_exists($page, 'value')) {
                return '';
            }

            $field = (string) config('statamic-visual-editor.previews.field', 'page_sections');

            foreach ((array) $page->value($field) as $section) {
                if (is_array($section) && ($section['_visual_id'] ?? null) === $uid) {
                    return (string) ($section['type'] ?? '');
                }
            }
        } catch (\Throwable $e) {
            Log::debug('VisualEdit: failed to resolve section type', ['exception' => $e]);
        }

        return '';
    }

    /**
     * The chain of set types down to the row this tag is scoped to, read off the
     * entry's own values — ['featured_section/style_2', 'item'].
     *
     * The same chain the blueprint walk records, arrived at from the other end:
     * a uid identifies exactly one row, and the `type` of every set it sits in
     * says which set handle the blueprint calls it. Two sections that both name a
     * set `item` are told apart by what stands above it.
     */
    protected function resolveSetChainByScope(): array
    {
        $uid = (string) ($this->params->get('scope') ?: $this->context->get('id') ?: '');

        if ($uid === '') {
            return [];
        }

        try {
            $page = $this->context->get('page');

            if (! $page || ! method_exists($page, 'value')) {
                return [];
            }

            $field = (string) config('statamic-visual-editor.previews.field', 'page_sections');

            return BlueprintFields::typeChainTo((array) $page->value($field), $uid) ?? [];
        } catch (\Throwable $e) {
            Log::debug('VisualEdit: failed to resolve set chain', ['exception' => $e]);

            return [];
        }
    }

    protected function resolveType(): string
    {
        return (string) $this->context->get('type', '');
    }

    /** @see BlueprintFields::fieldsByHandle */
    protected function fieldsByHandle($blueprint, string $handle, ?string $fieldType = null): array
    {
        return BlueprintFields::fieldsByHandle($blueprint, $handle, $fieldType);
    }

    /** @see BlueprintFields::flattenReplicatorSets */
    protected function flattenReplicatorSets($sets): array
    {
        return BlueprintFields::flattenReplicatorSets($sets);
    }
}
