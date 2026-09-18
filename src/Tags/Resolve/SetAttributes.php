<?php

namespace MarioHamann\StatamicVisualEditor\Tags\Resolve;

use MarioHamann\StatamicVisualEditor\VisualEditAntlers;

/**
 * The attributes a section or a set row carries: the insert control, the
 * outline, the grid, the global-edit marker, the row's template. Builds on
 * Attributes for the shared `data-sid` core. Moved verbatim out of
 * Tags\VisualEdit in WP7c.
 */
final class SetAttributes
{
    use ResolvesScope, ResolvesFields, ResolvesIcons;

    private Attributes $attributes;

    public function __construct(protected $params, protected $context)
    {
        $this->attributes = new Attributes($params, $context);
    }

    /**
     * data-sid for the nested set an insertable container sits on.
     *
     * A section-level {{ visual_edit field="blocks" insertable="true" }} must
     * stay insert-only: the <section> already has data-sid, and a second copy
     * on the inner wrapper would shrink the outline. A set one loop down
     * (type "list" inside hero/style_2) has no other annotation, so the
     * insertable tag is the one that has to carry it.
     */
    public function insertableSetAttr(): string
    {
        $uid = (string) ($this->params->get('id') ?: $this->context->get('id') ?: '');

        if ($uid === '') {
            return '';
        }

        $setType = (string) $this->context->get('type', '');
        $sectionType = $this->resolveSectionType();

        if ($sectionType !== '' && ($setType === '' || $setType === $sectionType)) {
            return '';
        }

        // No page in context (tests, or the section uid is missing): treat a
        // slashless type as a nested set (`list`, `content`) and a slashed
        // one as the page section (`hero/style_2`).
        if ($sectionType === '' && ($setType === '' || str_contains($setType, '/'))) {
            return '';
        }

        return $this->attributes->buildAttr(
            $uid,
            $this->resolveLabel(),
            $setType,
            $this->params->bool('outline_inside', $this->params->bool('outline-inside', false)),
            false,
            $this->params->bool('move', false),
            $this->params->bool('orderable', false),
            $this->resolveIcon()
        );
    }

    /**
     * `outline="always"` on a container: while the pointer is anywhere inside
     * it, every one of its children keeps a faint dashed edge — not just the one
     * being hovered.
     *
     * For blocks that draw their own box (a picture, a coloured card) the extent
     * is already visible. For a block that is only text on the section's own
     * background it is not, and a width you cannot see is a width you cannot
     * judge. Left off, the hover behaviour is exactly as before.
     */
    public function outlineAttr(): string
    {
        return (string) $this->params->get('outline') === 'always' ? ' data-sid-outline="always"' : '';
    }

    /**
     * `grid_view="true"` on a container: its children can be resized in the
     * preview by dragging.
     *
     * How many columns there are is NOT stated here. The preview counts the
     * resolved `grid-template-columns` of the container itself, so the ruler is
     * the layout and cannot drift from it — and the CSS stays the one place the
     * number is written, which it has to be, since this tag renders in Live
     * Preview only and the page has to lay itself out without it.
     *
     * `grid="8"` is therefore an optional *cap*: fewer columns may be written
     * than the CSS actually has. Leave it out unless you want that.
     *
     * `grid_field` names the field on each row that holds the span (default
     * `span`); `grid_min` is the fewest columns a row may be dragged down to.
     *
     * `grid_handles` says how many edges are offered:
     *   both  (default) — one on each edge, and only where dragging can still
     *                     change something: none on an edge already flush with
     *                     the grid, where a handle would do nothing.
     *   right           — one on the trailing edge, always.
     *
     * `grid_preview` says what follows the pointer while dragging:
     *   live    (default) — the block itself, row breaks and all.
     *   outline           — an outline only; the layout is left alone until the
     *                       drag ends. Steadier to aim with; you see what the
     *                       row does on release rather than during.
     *
     * `grid_resize` picks between the two ways of dragging:
     *   free  (default) — each block owns its width; drag it wide and the next
     *                     one wraps underneath, to be set on its own.
     *   split           — the boundary between two blocks moves; what one gains
     *                     the other gives up and the row stays full.
     *
     * `grid_overlap="true"` says the blocks may lie on top of each other, which
     * changes what the leading edge means. Without it, dragging a block's left
     * edge only makes the block wider or narrower, and the row re-flows around
     * it — the only thing a flowing block can do. With it, the left edge moves
     * the block's starting column and leaves its trailing edge where it is, so
     * a block can be pulled in over its neighbour.
     *
     * It is opt-in per container because it is not free: a block that has been
     * given a starting column stops flowing, and a section whose layout depends
     * on blocks flowing should not be able to acquire one by accident.
     */
    public function gridAttr(): string
    {
        $enabled = $this->params->bool('grid_view', $this->params->bool('grid-view', false));
        $columns = $this->params->get('grid');

        if (! $enabled && ($columns === null || $columns === '')) {
            return '';
        }

        // No number = no opinion: the preview counts the container's own tracks.
        $attr = $columns === null || $columns === '' || (int) $columns < 1
            ? ' data-sid-grid'
            : ' data-sid-grid="'.(int) $columns.'"';

        $field = $this->params->get('grid_field', $this->params->get('grid-field'));

        if ($field !== null && (string) $field !== '') {
            $attr .= ' data-sid-grid-field="'.e((string) $field).'"';
        }

        if ($min = (int) $this->params->get('grid_min', $this->params->get('grid-min'))) {
            $attr .= ' data-sid-grid-min="'.max(1, $min).'"';
        }

        $resize = $this->params->get('grid_resize', $this->params->get('grid-resize'));

        if ((string) $resize === 'split') {
            $attr .= ' data-sid-grid-resize="split"';
        }

        $handles = $this->params->get('grid_handles', $this->params->get('grid-handles'));

        if ((string) $handles === 'right') {
            $attr .= ' data-sid-grid-handles="right"';
        }

        $preview = $this->params->get('grid_preview', $this->params->get('grid-preview'));

        if ((string) $preview === 'outline') {
            $attr .= ' data-sid-grid-preview="outline"';
        }

        if ($this->params->bool('grid_overlap', $this->params->bool('grid-overlap', false))) {
            $attr .= ' data-sid-grid-overlap';
        }

        return $attr;
    }

    /**
     * `global_edit` names the global to open, as "set" or "set.field" — e.g.
     * global_edit="site_settings.phone". `global_edit="true"` just opens the panel
     * on the first set, since it says nothing about which global is meant.
     */
    public function globalEditAttr(): string
    {
        $target = $this->params->get('global_edit', $this->params->get('global-edit'));

        if ($target === null || $target === false || $target === '') {
            return '';
        }

        $target = ($target === true || $target === 'true') ? '' : (string) $target;

        return 'data-sid-global="'.e($target).'"';
    }

    /**
     * Inner-row template from the orderable sibling in this section's Antlers.
     */
    public function rowTemplateAttr(string $field): string
    {
        $found = VisualEditAntlers::fromSection($this->resolveSectionType(), $field);
        $rowTemplate = $found['rowTemplate'] ?? '';

        if ($rowTemplate === '') {
            return '';
        }

        return ' data-sid-row-template="'.e($rowTemplate).'"';
    }
}
