<?php

namespace MarioHamann\StatamicVisualEditor\Tags\Resolve;

use Illuminate\Support\Facades\Log;
use MarioHamann\StatamicVisualEditor\Tags\Resolve\Icons;

/**
 * The icon a set or a field shows in the editor's badges. Needs
 * `$this->params` / `$this->context` and ResolvesScope. Moved verbatim out of
 * Tags\VisualEdit in WP7c.
 */
trait ResolvesIcons
{
    /**
     * Badge icon for this annotation: explicit `icon=` param, then the Replicator
     * set's icon, then a Grid field's icon (`icon_from="links"` or the field's
     * own handle). Grids have no sets, so their icon lives on the field config.
     */
    protected function resolveIcon(): string
    {
        if ($icon = $this->params->get('icon')) {
            return (string) $icon;
        }

        // `icon_from` before the set icon: `type` cascades in Antlers, so a
        // grid row inside a Links *set* still reads type "links" and would
        // otherwise wear the wrapping set's icon (lucide:square-stack) instead
        // of the grid field's (add-link) — the one the focus panel already shows.
        $from = $this->params->get('icon_from', $this->params->get('icon-from'));

        if ($from && ($fieldIcon = $this->resolveFieldIcon((string) $from))) {
            return $fieldIcon;
        }

        if ($setIcon = $this->resolveSetIcon($this->resolveType())) {
            return $setIcon;
        }

        return '';
    }

    /**
     * The icon a Replicator set declares in the blueprint, so the preview can put
     * it in front of the set's name. Empty when the set names none — the toolbar
     * falls back to the name's first letter, which still tells one block from
     * another at a glance.
     */
    protected function resolveSetIcon(string $setHandle): string
    {
        if ($setHandle === '') {
            return '';
        }

        try {
            $page = $this->context->get('page');
            $blueprint = ($page && method_exists($page, 'blueprint')) ? $page->blueprint() : null;

            if (! $blueprint) {
                return '';
            }

            return (string) (Icons::findSetIcon($blueprint->contents(), $setHandle) ?? '');
        } catch (\Throwable $e) {
            Log::debug('VisualEdit: failed to resolve set icon for '.$setHandle, ['exception' => $e]);

            return '';
        }
    }

    /**
     * Icon configured on a field (typically a Grid) — same picker as set icons,
     * stored as `icon:` on the field config.
     */
    protected function resolveFieldIcon(string $fieldHandle): string
    {
        if ($fieldHandle === '') {
            return '';
        }

        try {
            $page = $this->context->get('page');
            $blueprint = ($page && method_exists($page, 'blueprint')) ? $page->blueprint() : null;

            if (! $blueprint) {
                return '';
            }

            return (string) (Icons::findFieldIcon($blueprint->contents(), $fieldHandle) ?? '');
        } catch (\Throwable $e) {
            Log::debug('VisualEdit: failed to resolve field icon for '.$fieldHandle, ['exception' => $e]);

            return '';
        }
    }
}
