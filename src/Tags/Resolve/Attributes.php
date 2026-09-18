<?php

namespace MarioHamann\StatamicVisualEditor\Tags\Resolve;

use MarioHamann\StatamicVisualEditor\Tags\Resolve\Icons;
use MarioHamann\StatamicVisualEditor\Tags\Resolve\Placeholders;

/**
 * The `data-sid-*` attributes `{{ visual_edit }}` writes for a set or a field:
 * ids, labels, types, icons, placeholders, template and default markers.
 * Moved verbatim out of Tags\VisualEdit in WP7c.
 */
final class Attributes
{
    use ResolvesScope, ResolvesFields, ResolvesIcons;

    public function __construct(protected $params, protected $context)
    {
    }

    public function buildAttr(string $uuid, string $label, string $type = '', bool $inside = false, bool $popup = false, bool $move = false, bool $orderable = false, string $icon = ''): string
    {
        $attr = 'data-sid="'.e($uuid).'"';

        $attr .= $this->iconAttr($icon);

        if ($popup) {
            $attr .= ' data-sid-action="popup"';
        }

        if ($label !== '') {
            $attr .= ' data-sid-label="'.e($label).'"';
        }

        if ($type !== '') {
            $attr .= ' data-sid-type="'.e($type).'"';
        }

        if ($inside) {
            $attr .= ' data-sid-inside';
        }

        // move="true": show reorder arrows on hover for this set/row.
        if ($move) {
            $attr .= ' data-sid-move';
        }

        // orderable="true": drag & drop reordering among sibling rows.
        if ($orderable) {
            $attr .= ' data-sid-orderable';
        }

        // toolbar="true" without a field: a click bar (icon, drag, delete) and
        // no typing. Same belt as a wrap-up. Distinct from inline_edit, which
        // only applies to a field annotation.
        if ($this->params->bool('toolbar', false)) {
            $attr .= ' data-sid-toolbar';
        }

        $attr .= $this->templateAttr();

        return $attr;
    }

    public function buildFieldAttr(string $fieldPath, string $label, bool $inside = false, string $scopeUid = '', bool $inlineEdit = false, bool $move = false, ?array $bardConfig = null, bool $orderable = false, array $controls = []): string
    {
        $attr = 'data-sid-field="'.e($fieldPath).'"';

        if ($scopeUid !== '') {
            $attr .= ' data-sid-field-uid="'.e($scopeUid).'"';
        }

        if ($label !== '') {
            $attr .= ' data-sid-label="'.e($label).'"';
        }

        if ($inside) {
            $attr .= ' data-sid-inside';
        }

        // Fieldtype so the preview can open the right picker (Iconify, assets, …)
        // instead of starting a text edit on a graphic. Omitted when the blueprint
        // cannot be resolved — the preview then falls back to DOM sniffing.
        $fieldMatch = $this->resolveFieldMatch($fieldPath) ?? [];
        $fieldType = is_string($fieldMatch['config']['type'] ?? null) ? (string) $fieldMatch['config']['type'] : '';

        if ($fieldType !== '') {
            $attr .= ' data-sid-fieldtype="'.e($fieldType).'"';
        }

        // A configured default means the icon cannot be cleared. Preview and
        // sidebar then offer Change only — Remove would just paint the default
        // again, or hollow out the wrapper.
        if ($fieldType === 'iconify') {
            $iconDefault = $fieldMatch['config']['default'] ?? null;

            if (is_string($iconDefault) && trim($iconDefault) !== '') {
                $attr .= ' data-sve-icon-has-default';
            }
        }

        // inline_edit="true": opt-in for in-preview editing (contenteditable).
        // Without it, clicking the element only focuses the CP field. It says
        // nothing about a toolbar — that is `toolbar=` below.
        if ($inlineEdit) {
            $attr .= ' data-sid-inline-edit';
        }

        // toolbar="true": this element gets a bar while it is edited. Emitted so
        // the preview can tell the two apart at edit time — the row wrapping the
        // text may be orderable, but being movable is not a reason to put a bar
        // over a field that did not ask for one.
        if ($this->params->bool('toolbar', false)) {
            $attr .= ' data-sid-toolbar';
        }

        // Bard toolbar config — the preview builds its toolbar from the field's
        // own `buttons` list (never hardcoded) plus a styles map for its
        // bard-texstyle buttons. When the Bard field defines sets, emit those
        // too so whole-field inline edit can offer the same "+" set picker.
        if ($bardConfig) {
            $attr .= ' data-sid-bard-buttons="'.e(implode(',', $bardConfig['buttons'])).'"';

            if (! empty($bardConfig['styles'])) {
                $attr .= ' data-sid-bard-styles="'.e(json_encode($bardConfig['styles'])).'"';
            }

            if (! empty($bardConfig['sets'])) {
                $attr .= ' data-sid-bard-sets="'.e(json_encode($bardConfig['sets'])).'"';
            }

            if (! empty($bardConfig['inline'])) {
                $attr .= ' data-sid-bard-inline';
            }
        }

        // controls="font_tag|size": sibling fields of the edited one, rendered as
        // quick controls in the inline toolbar so a block's own settings can be
        // changed without opening the panel.
        if (! empty($controls)) {
            $attr .= ' data-sid-controls="'.e(json_encode($controls)).'"';
        }

        // move="true": show reorder arrows on hover (the row is identified via
        // the field scope uid when no data-sid is present).
        if ($move) {
            $attr .= ' data-sid-move';
        }

        // orderable="true": drag & drop reordering among sibling rows. Nothing
        // else — whether a thing can be moved says nothing about how its toolbar
        // looks, and a block that is the only one of its kind still deserves a
        // badge.
        if ($orderable) {
            $attr .= ' data-sid-orderable';
        }

        $attr .= $this->templateAttr();
        $attr .= $this->defaultAttr();
        $attr .= $this->placeholderAttr();
        $attr .= $this->asAttr();

        // toolbar="true": show the set's (or field's) icon as a badge in front of
        // the name in the inline toolbar. Opt-in per annotation, because `type`
        // cascades in Antlers — a <span field="text"> inside a block reads the
        // block's set handle, and defaulting this on would give it a second badge
        // for an icon that is not its own. `icon=` / `icon_from=` imply it: naming
        // an icon is already asking for it to be drawn.
        $iconFrom = $this->params->get('icon_from', $this->params->get('icon-from'));

        if ($this->params->bool('toolbar', false) || $this->params->get('icon') || $iconFrom) {
            $attr .= $this->iconAttr($this->resolveIcon());
        }

        return $attr;
    }

    /**
     * The set's own icon, for the badge in front of its name in the inline
     * toolbar. The preview draws what it recognises and falls back to the name's
     * first letter, so an unknown name costs nothing.
     *
     * Shared by both attribute builders: a block annotated with `field=` is still
     * a block, and had no badge for as long as this lived only in buildAttr.
     */
    private function iconAttr(string $icon): string
    {
        if ($icon === '') {
            return '';
        }

        // Pasted SVG is too large for data-sid-icon and is already the drawing;
        // put it only on data-sid-icon-svg. Iconify/emoji stay on data-sid-icon.
        if (preg_match('/^\s*<svg[\s>]/i', $icon)) {
            return ' data-sid-icon-svg="'.e(trim($icon)).'"';
        }

        $attr = ' data-sid-icon="'.e($icon).'"';

        // …and the drawing itself, because the name alone is no use out there.
        // "Edit Set" picks from Statamic's (or a custom) icon set, whose SVGs live
        // on the server — the preview is a separate document with no way to look
        // one up. Resolved here, where the files are, so the badge shows the icon
        // the author chose.
        if (($markup = Icons::resolveIconMarkup($icon)) !== '') {
            $attr .= ' data-sid-icon-svg="'.e($markup).'"';
        }

        return $attr;
    }

    /**
     * `template="icon|title:Enter a title"` — starting inner sets for a new row,
     * declared where the replicator is used rather than on the shared fieldset.
     *
     * On an insertable container, `template="3:item"` is how many rows of that
     * set to create when the list itself is new. The row's own template
     * (`template="icon|title"` on the `<li>`) says what each of those rows
     * contains. Copied onto the container as `data-sid-row-template` so an
     * empty list still knows — the `<li>` is not in the DOM yet.
     *
     * An interpolated parameter that was never passed (`template="{foo}"`) is
     * empty and omitted, so nothing declared falls through to the fieldset.
     */
    public function templateAttr(): string
    {
        return $this->sidParamAttr('template', 'data-sid-template');
    }

    /**
     * `default="Enter a title"` — starting value for this field, at this place.
     *
     * For Bard: `default="heading:1:Book Title|paragraph:Summary"`. A plain
     * string becomes a paragraph. Applied when the parent row is created, not
     * written over content the editor has already typed.
     */
    private function defaultAttr(): string
    {
        return $this->sidParamAttr('default', 'data-sid-default');
    }

    /**
     * `placeholder="Enter a title"` — ghost text in the preview while the field
     * is empty. Never stored. Gutenberg / BlockStudio RichText: the hint lives
     * where the field is rendered, so a shared title field can say different
     * things in a hero and in a card, without a YAML default that then has to
     * be dimmed with `is_default`.
     *
     * Prefix the hint with the Bard node it should be (`h3:Enter a title`,
     * `paragraph:Summary`) — same idea as InnerBlocks listing `core/heading`
     * vs `core/paragraph`. Bare text is just the hint; use `as=` for the node
     * on its own.
     */
    private function placeholderAttr(): string
    {
        $parsed = Placeholders::parsePlaceholderSpec($this->params->get('placeholder'));

        if ($parsed['text'] === '') {
            return '';
        }

        return ' data-sid-placeholder="'.e($parsed['text']).'"';
    }

    /**
     * `as="h3"` — what an empty Bard field is: a heading or a paragraph.
     * Taken from the param, or from a `placeholder="h3:…"` prefix.
     */
    private function asAttr(): string
    {
        $as = Placeholders::normalizeAs($this->params->get('as'));

        if ($as === null) {
            $as = Placeholders::parsePlaceholderSpec($this->params->get('placeholder'))['as'];
        }

        if ($as === null) {
            return '';
        }

        return ' data-sid-as="'.e($as).'"';
    }

    private function sidParamAttr(string $param, string $attribute): string
    {
        $spec = $this->params->get($param);

        if ($spec === null || $spec === false || $spec === true) {
            return '';
        }

        if (is_array($spec)) {
            $spec = json_encode($spec);
        }

        $spec = trim((string) $spec);

        if ($spec === '') {
            return '';
        }

        return ' '.$attribute.'="'.e($spec).'"';
    }

    /**
     * inline_edit="true" — opt-in for in-preview editing. The hyphenated
     * inline-edit spelling is accepted as a legacy alias.
     */
    public function inlineEditParam(): bool
    {
        return $this->params->bool('inline_edit', $this->params->bool('inline-edit', false));
    }
}
