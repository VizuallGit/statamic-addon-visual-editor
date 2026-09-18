<?php

namespace MarioHamann\StatamicVisualEditor\Tags\Resolve;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Statamic\Facades\Blueprint;

/**
 * The field behind a `{{ visual_edit field="…" }}`: which blueprint field it is,
 * of which type, and what it is called. Needs `$this->params` / `$this->context`
 * and ResolvesScope. Moved verbatim out of Tags\VisualEdit in WP7c.
 */
trait ResolvesFields
{
    /**
     * The matching blueprint field for this handle, or null.
     *
     * @return  array{handle?: string, config?: array, set?: string, chain?: array}|null
     */
    protected function resolveFieldMatch(string $fieldPath): ?array
    {
        try {
            $blueprintHandle = $this->params->get('blueprint');

            if ($blueprintHandle) {
                $blueprint = Blueprint::find((string) $blueprintHandle);
            } else {
                $page = $this->context->get('page');
                $blueprint = ($page && method_exists($page, 'blueprint')) ? $page->blueprint() : null;
            }

            if (! $blueprint) {
                return null;
            }

            $handle = last(explode('.', $fieldPath));

            return $this->preferFieldMatch($this->fieldsByHandle($blueprint, $handle));
        } catch (\Throwable $e) {
            Log::debug('VisualEdit: failed to resolve field match for '.$fieldPath, ['exception' => $e]);

            return null;
        }
    }

    /**
     * The blueprint fieldtype for this handle (`iconify`, `assets`, `bard`, …).
     * Empty when the field cannot be found — the preview then has no picker hint.
     */
    protected function resolveFieldType(string $fieldPath): string
    {
        $match = $this->resolveFieldMatch($fieldPath);
        $type = $match['config']['type'] ?? null;

        return is_string($type) && $type !== '' ? $type : '';
    }

    /**
     * Picks the blueprint field that belongs to this row: the match whose set
     * chain equals the scoped row's, then section+set, then nearest set handle,
     * then the first match. Same preference order as resolveBardConfig.
     */
    protected function preferFieldMatch(array $matches): ?array
    {
        if ($matches === []) {
            return null;
        }

        $setType = (string) $this->context->get('type', '');
        $valueChain = $this->resolveSetChainByScope();

        if (! empty($valueChain)) {
            foreach ($matches as $match) {
                if (($match['chain'] ?? []) === $valueChain) {
                    return $match;
                }
            }
        }

        $sectionType = $valueChain[0] ?? $this->resolveSectionType();

        if ($sectionType !== '' && $setType !== '') {
            foreach ($matches as $match) {
                $chain = $match['chain'] ?? [];

                if (($chain[0] ?? null) === $sectionType && ($chain[count($chain) - 1] ?? null) === $setType) {
                    return $match;
                }
            }
        }

        if ($setType !== '') {
            foreach ($matches as $match) {
                if ($match['set'] === $setType) {
                    return $match;
                }
            }
        }

        return $matches[0];
    }

    protected function resolveLabel(): string
    {
        $custom = trim((string) $this->context->get('_sve_label', ''));

        if ($custom !== '') {
            return $custom;
        }

        $type = (string) $this->context->get('type', '');

        return $type ? Str::headline($type) : '';
    }

    protected function resolveFieldLabel(string $fieldPath): string
    {
        $blueprintHandle = $this->params->get('blueprint');

        if ($blueprintHandle) {
            $blueprint = Blueprint::find((string) $blueprintHandle);
        } else {
            $page = $this->context->get('page');

            if (! $page || ! method_exists($page, 'blueprint')) {
                return '';
            }

            $blueprint = $page->blueprint();
        }

        if (! $blueprint) {
            return '';
        }

        try {
            $fields = $blueprint->fields()->all();
            $segments = explode('.', $fieldPath);
            $firstHandle = array_shift($segments);

            $field = $fields->get($firstHandle);

            if (! $field) {
                return '';
            }

            if (empty($segments)) {
                return $field->display();
            }

            foreach ($field->config()['fields'] ?? [] as $subConfig) {
                if (($subConfig['handle'] ?? '') === $segments[0]) {
                    return $subConfig['field']['display'] ?? '';
                }
            }
        } catch (\InvalidArgumentException|\BadMethodCallException $e) {
            Log::debug('VisualEdit: failed to resolve field label for '.$fieldPath, ['exception' => $e]);

            return '';
        }

        return '';
    }
}
