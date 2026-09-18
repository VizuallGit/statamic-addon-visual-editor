<?php

namespace MarioHamann\StatamicVisualEditor\Tags;

use Statamic\Tags\Tags;
use MarioHamann\StatamicVisualEditor\Tags\Resolve\ResolvesScope;
use MarioHamann\StatamicVisualEditor\Tags\Resolve\ResolvesFields;
use MarioHamann\StatamicVisualEditor\Tags\Resolve\ResolvesIcons;
use MarioHamann\StatamicVisualEditor\Tags\Resolve\ResolvesInserts;
use MarioHamann\StatamicVisualEditor\Tags\Resolve\Controls;
use MarioHamann\StatamicVisualEditor\Tags\Resolve\BardConfig;
use MarioHamann\StatamicVisualEditor\Tags\Resolve\Attributes;
use MarioHamann\StatamicVisualEditor\Tags\Resolve\SetAttributes;

class VisualEdit extends Tags
{
    use ResolvesScope, ResolvesFields, ResolvesIcons, ResolvesInserts;

    protected static $handle = 'visual_edit';

    /**
     * {{ visual_edit }} — Dual-mode tag.
     *
     * Self-closing: returns the data-sid attribute string for inline use inside an HTML opening tag.
     * Pair tag: wraps content in a <div> with data-sid attributes.
     *
     * No-op outside Live Preview or when no UUID/field is available.
     *
     * With `field="dot.separated.path"`: targets a specific CP field by handle.
     * With no `field` param: targets the nearest Replicator/Bard/Grid set UUID.
     */
    public function index(): string
    {
        $attributes = new Attributes($this->params, $this->context);
        $setAttributes = new SetAttributes($this->params, $this->context);

        $isPair = $this->isPair;
        $content = $isPair ? (string) $this->parse() : '';

        if (! $this->isLivePreview()) {
            return $content;
        }

        $field = $this->params->get('field');
        $inside = $this->params->bool('outline_inside', $this->params->bool('outline-inside', false));
        $popup = $this->params->bool('popup', false);
        $grid = $setAttributes->gridAttr().$setAttributes->outlineAttr();

        // global_edit="site_settings.phone" — clicking opens that global set in the
        // panel beside the preview, with the field focused. Deliberately NOT inline
        // editing: what's rendered is often the value inside other text ("Tlf. …"),
        // and writing the whole rendered string back would corrupt the value.
        if ($globalAttr = $setAttributes->globalEditAttr()) {
            // Stands on its own — a global isn't part of the entry being edited, so
            // none of the entry-field annotations apply to it.
            return $isPair ? '<div '.$globalAttr.'>'.$content.'</div>' : $globalAttr;
        }

        // insertable="true" on a replicator's container: the preview shows a
        // single "+" after the last block that inserts a new set of a chosen
        // type. Emits the field to insert into and the set types it allows
        // (read from the blueprint, so a new set type just shows up).
        //
        // Inside a nested set (a list block, a content block) the same tag
        // also marks the set itself — otherwise the click has no data-sid and
        // lands on the page section. One {{ visual_edit field="list" insertable="true" }}
        // is then enough; a bare {{ visual_edit }} beside it is not needed.
        //
        // When also used with inline_edit (Bard whole-field), skip this early
        // return — insert attrs are merged into the field annotation below so
        // orderable Bard sets get the same hide/dup/delete toolbar as Style 2.
        if ($this->params->bool('insertable', false) && $field !== null && (string) $field !== '' && ! $attributes->inlineEditParam()) {
            $setAttr = $setAttributes->insertableSetAttr();
            $attr = ($setAttr !== '' ? $setAttr.' ' : '').'data-sid-insert="'.e((string) $field).'"';

            // The section this replicator belongs to — its uid. Used to seed the
            // very first block when the field is empty (no sibling to anchor to).
            if ($scope = $this->context->get('id') ?: $this->context->get('_visual_id')) {
                $attr .= ' data-sid-insert-scope="'.e((string) $scope).'"';
            }

            $sets = $this->resolveInsertSets((string) $field);

            if (! empty($sets)) {
                $attr .= ' data-sid-insert-sets="'.e(json_encode($sets)).'"';
            }

            if ($max = $this->resolveInsertMax((string) $field)) {
                $attr .= ' data-sid-insert-max="'.$max.'"';
            }

            $attr .= $attributes->templateAttr();
            $attr .= $setAttributes->rowTemplateAttr((string) $field);

            return $isPair ? '<div '.$attr.$grid.'>'.$content.'</div>' : $attr.$grid;
        }

        if ($field !== null && (string) $field !== '' && ! $popup) {
            // Prefer the row's own `id` — `_visual_id` cascades from the parent
            // section and is stripped from saved (synced) section YAML.
            $scopeUid = $this->params->get(
                'scope',
                $this->context->get('id') ?: $this->context->get('_visual_id')
            );

            $inlineEdit = $attributes->inlineEditParam();

            // `inline_edit` says the text may be typed into; `toolbar` says a bar
            // appears above it. Two questions, two parameters — a field can be
            // editable in place with no formatting offered, which is the right
            // answer for a plain text field that only ever holds one line.
            $wantsToolbar = $this->params->bool('toolbar', false);

            $attr = $attributes->buildFieldAttr(
                (string) $field,
                $this->resolveFieldLabel((string) $field),
                $inside,
                $scopeUid ? (string) $scopeUid : '',
                $inlineEdit,
                $this->params->bool('move', false),
                $inlineEdit && $wantsToolbar ? (new BardConfig($this->params, $this->context))->resolve((string) $field) : null,
                $this->params->bool('orderable', false),
                $inlineEdit && $wantsToolbar ? (new Controls($this->params, $this->context))->resolve($this->params->get('controls')) : []
            );

            // Bard whole-field + insertable: same hide/dup/delete toolbar as
            // Style 2 replicator blocks (parent marked data-sid-insert).
            if ($this->params->bool('insertable', false)) {
                $attr .= ' data-sid-insert="'.e((string) $field).'"';

                if ($scopeUid) {
                    $attr .= ' data-sid-insert-scope="'.e((string) $scopeUid).'"';
                }

                $sets = $this->resolveInsertSets((string) $field);

                if (! empty($sets)) {
                    $attr .= ' data-sid-insert-sets="'.e(json_encode($sets)).'"';
                }

                if ($max = $this->resolveInsertMax((string) $field)) {
                    $attr .= ' data-sid-insert-max="'.$max.'"';
                }
            }

            return $isPair ? '<div '.$attr.$grid.'>'.$content.'</div>' : $attr.$grid;
        }

        // popup="true": fall back to _visual_id (auto_uuid), then 'id' — Statamic's
        // Replicator.processRow() renames _id → id (via RowId::handle()), so inside
        // a replicator/column-builder loop {{ id }} is the item's unique row ID.
        if ($popup) {
            // Do NOT use _visual_id here — it cascades from the parent page section
            // and would match the wrong element. Use 'id' which Statamic stores per
            // replicator/column-builder row (processRow renames _id → id in YAML).
            $uuid = $this->params->get('id', $this->context->get('id'));
        } else {
            // Prefer the row's own `id`. `_visual_id` cascades from the parent
            // section AND is stripped from saved YAML — synced (global) sections
            // would otherwise render orderable wrappers with no attributes at all,
            // so the inline toolbar loses T / drag / more compared to a normal
            // page section whose Live Preview still carries form-time uuids.
            $uuid = $this->params->get(
                'id',
                $this->context->get('id') ?: $this->context->get('_visual_id')
            );
        }

        if (! $uuid) {
            return $content;
        }

        $attr = $attributes->buildAttr((string) $uuid, $this->resolveLabel(), $this->resolveType(), $inside, $popup, $this->params->bool('move', false), $this->params->bool('orderable', false), $this->resolveIcon());

        // section_orderable="true": drag handle in the hover control that moves
        // the whole section with a zoomed-out page overview.
        if ($this->params->bool('section_orderable', $this->params->bool('section-orderable', false))) {
            $attr .= ' data-sid-section-orderable';
        }

        // popup + field + inline-edit: dual-annotated element. Text clicks try
        // inline editing first (field scope = the popup row id — column builder
        // rows have no _visual_id); the bridge falls back to opening the popup
        // when the CP denies the edit (padding, images, unmatched text).
        if ($popup && $field !== null && (string) $field !== '' && $attributes->inlineEditParam()) {
            // Label omitted: buildAttr already emitted data-sid-label. Bard config
            // is resolved here too so column-builder text blocks get the field's
            // own toolbar, not the default fallback.
            $attr .= ' '.$attributes->buildFieldAttr((string) $field, '', false, (string) $uuid, true, false, (new BardConfig($this->params, $this->context))->resolve((string) $field), false, (new Controls($this->params, $this->context))->resolve($this->params->get('controls')));
        }

        return $isPair ? '<div '.$attr.$grid.'>'.$content.'</div>' : $attr.$grid;
    }

    protected function isLivePreview(): bool
    {
        return request()->isLivePreview();
    }
}
