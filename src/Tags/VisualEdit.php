<?php

namespace MarioHamann\StatamicVisualEditor\Tags;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\IconResolver;
use Statamic\Facades\Blueprint;
use Statamic\Tags\Tags;

class VisualEdit extends Tags
{
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
        $isPair = $this->isPair;
        $content = $isPair ? (string) $this->parse() : '';

        if (! $this->isLivePreview()) {
            return $content;
        }

        $field = $this->params->get('field');
        $inside = $this->params->bool('outline_inside', $this->params->bool('outline-inside', false));
        $popup = $this->params->bool('popup', false);
        $grid = $this->gridAttr().$this->outlineAttr();

        // global_edit="site_settings.phone" — clicking opens that global set in the
        // panel beside the preview, with the field focused. Deliberately NOT inline
        // editing: what's rendered is often the value inside other text ("Tlf. …"),
        // and writing the whole rendered string back would corrupt the value.
        if ($globalAttr = $this->globalEditAttr()) {
            // Stands on its own — a global isn't part of the entry being edited, so
            // none of the entry-field annotations apply to it.
            return $isPair ? '<div '.$globalAttr.'>'.$content.'</div>' : $globalAttr;
        }

        // insertable="true" on a replicator's container: the preview shows a
        // single "+" after the last block that inserts a new set of a chosen
        // type. Emits the field to insert into and the set types it allows
        // (read from the blueprint, so a new set type just shows up).
        //
        // When also used with inline_edit (Bard whole-field), skip this early
        // return — insert attrs are merged into the field annotation below so
        // orderable Bard sets get the same hide/dup/delete toolbar as Style 2.
        if ($this->params->bool('insertable', false) && $field !== null && (string) $field !== '' && ! $this->inlineEditParam()) {
            $attr = 'data-sid-insert="'.e((string) $field).'"';

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

            return $isPair ? '<div '.$attr.$grid.'>'.$content.'</div>' : $attr.$grid;
        }

        if ($field !== null && (string) $field !== '' && ! $popup) {
            // Prefer the row's own `id` — `_visual_id` cascades from the parent
            // section and is stripped from saved (synced) section YAML.
            $scopeUid = $this->params->get(
                'scope',
                $this->context->get('id') ?: $this->context->get('_visual_id')
            );

            $inlineEdit = $this->inlineEditParam();

            // `inline_edit` says the text may be typed into; `toolbar` says a bar
            // appears above it. Two questions, two parameters — a field can be
            // editable in place with no formatting offered, which is the right
            // answer for a plain text field that only ever holds one line.
            $wantsToolbar = $this->params->bool('toolbar', false);

            $attr = $this->buildFieldAttr(
                (string) $field,
                $this->resolveFieldLabel((string) $field),
                $inside,
                $scopeUid ? (string) $scopeUid : '',
                $inlineEdit,
                $this->params->bool('move', false),
                $inlineEdit && $wantsToolbar ? $this->resolveBardConfig((string) $field) : null,
                $this->params->bool('orderable', false),
                $inlineEdit && $wantsToolbar ? $this->resolveControls($this->params->get('controls')) : []
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

        $attr = $this->buildAttr((string) $uuid, $this->resolveLabel(), $this->resolveType(), $inside, $popup, $this->params->bool('move', false), $this->params->bool('orderable', false), $this->resolveIcon());

        // section_orderable="true": drag handle in the hover control that moves
        // the whole section with a zoomed-out page overview.
        if ($this->params->bool('section_orderable', $this->params->bool('section-orderable', false))) {
            $attr .= ' data-sid-section-orderable';
        }

        // popup + field + inline-edit: dual-annotated element. Text clicks try
        // inline editing first (field scope = the popup row id — column builder
        // rows have no _visual_id); the bridge falls back to opening the popup
        // when the CP denies the edit (padding, images, unmatched text).
        if ($popup && $field !== null && (string) $field !== '' && $this->inlineEditParam()) {
            // Label omitted: buildAttr already emitted data-sid-label. Bard config
            // is resolved here too so column-builder text blocks get the field's
            // own toolbar, not the default fallback.
            $attr .= ' '.$this->buildFieldAttr((string) $field, '', false, (string) $uuid, true, false, $this->resolveBardConfig((string) $field), false, $this->resolveControls($this->params->get('controls')));
        }

        return $isPair ? '<div '.$attr.$grid.'>'.$content.'</div>' : $attr.$grid;
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
    private function outlineAttr(): string
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
     */
    private function gridAttr(): string
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

        return $attr;
    }

    /**
     * `global_edit` names the global to open, as "set" or "set.field" — e.g.
     * global_edit="site_settings.phone". `global_edit="true"` just opens the panel
     * on the first set, since it says nothing about which global is meant.
     */
    private function globalEditAttr(): string
    {
        $target = $this->params->get('global_edit', $this->params->get('global-edit'));

        if ($target === null || $target === false || $target === '') {
            return '';
        }

        $target = ($target === true || $target === 'true') ? '' : (string) $target;

        return 'data-sid-global="'.e($target).'"';
    }

    private function resolveLabel(): string
    {
        $type = (string) $this->context->get('type', '');

        return $type ? Str::headline($type) : '';
    }

    private function resolveFieldLabel(string $fieldPath): string
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

    private function resolveType(): string
    {
        return (string) $this->context->get('type', '');
    }

    private function buildFieldAttr(string $fieldPath, string $label, bool $inside = false, string $scopeUid = '', bool $inlineEdit = false, bool $move = false, ?array $bardConfig = null, bool $orderable = false, array $controls = []): string
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
        if (($markup = $this->resolveIconMarkup($icon)) !== '') {
            $attr .= ' data-sid-icon-svg="'.e($markup).'"';
        }

        return $attr;
    }

    private function buildAttr(string $uuid, string $label, string $type = '', bool $inside = false, bool $popup = false, bool $move = false, bool $orderable = false, string $icon = ''): string
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

        return $attr;
    }

    /**
     * inline_edit="true" — opt-in for in-preview editing. The hyphenated
     * inline-edit spelling is accepted as a legacy alias.
     */
    private function inlineEditParam(): bool
    {
        return $this->params->bool('inline_edit', $this->params->bool('inline-edit', false));
    }

    /**
     * Resolves the Bard field's own toolbar config so the preview builds an
     * identical toolbar instead of a hardcoded one. Returns
     * ['buttons' => [...], 'styles' => [name => [type, class, level, ident, name]]]
     * where `styles` covers the bard-texstyle buttons among the field's buttons.
     * Returns null when the field isn't a Bard field (e.g. a plain string).
     */
    private function resolveBardConfig(string $fieldPath): ?array
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
            $setType = (string) $this->context->get('type', '');

            // Collect every bard field with this handle, tagged with the set it
            // sits in, then prefer the one whose set matches the current set type
            // (context 'type'). This disambiguates identically-named fields —
            // hero vs seo_text `text`, or a column-builder `text` block — without
            // the aggressive scoping that broke deeply nested (column) lookups.
            $matches = [];
            $this->collectFieldsByHandle($blueprint->contents(), $handle, $matches, 'bard');

            if (empty($matches)) {
                return null;
            }

            $config = null;

            // The set handle alone is ambiguous: half a dozen sections name a set
            // `item`, and each has its own `text`. The section narrows it — a
            // match whose chain starts in THIS section and ends in THIS set is
            // the field actually being edited, not a namesake elsewhere.
            // Read off the values, not the context: the row's own uid leads to the
            // exact set it sits in, and the types on the way down spell the same
            // chain the blueprint walk recorded.
            $valueChain = $this->resolveSetChainByScope();

            if (! empty($valueChain)) {
                foreach ($matches as $match) {
                    if (($match['chain'] ?? []) === $valueChain) {
                        $config = $match['config'];
                        break;
                    }
                }
            }

            $sectionType = $valueChain[0] ?? $this->resolveSectionType();

            if ($config === null && $sectionType !== '' && $setType !== '') {
                foreach ($matches as $match) {
                    $chain = $match['chain'] ?? [];

                    if (($chain[0] ?? null) === $sectionType && ($chain[count($chain) - 1] ?? null) === $setType) {
                        $config = $match['config'];
                        break;
                    }
                }
            }

            if ($config === null) {
                foreach ($matches as $match) {
                    if ($match['set'] === $setType) {
                        $config = $match['config'];
                        break;
                    }
                }
            }

            // No bard field in this set answers to the handle. Before borrowing
            // another set's — which is what makes one toolbar available to a
            // block that named its field the same thing — ask what THIS set calls
            // the handle. A `text` field lent a Bard's config is edited as Bard
            // and written back as ProseMirror nodes, and a string field holding
            // an array of nodes reads "[object Object]" in the Control Panel.
            if ($config === null && $setType !== '') {
                $own = [];
                $this->collectFieldsByHandle($blueprint->contents(), $handle, $own);

                foreach ($own as $match) {
                    if ($match['set'] === $setType && ($match['config']['type'] ?? null) !== 'bard') {
                        return null;
                    }
                }
            }

            $config = $config ?? $matches[0]['config'];

            if (($config['type'] ?? null) !== 'bard') {
                return null;
            }

            $buttons = array_values(array_filter((array) ($config['buttons'] ?? []), 'is_string'));

            if (empty($buttons)) {
                return null;
            }

            $texstyle = (array) config('statamic.bard_texstyle.styles', []);
            $bardStyleList = (array) config('statamic.bard_styles.styles', []);
            $bardGroups = (array) config('statamic.bard_styles.groups', []);
            $styles = [];
            $bardByHandle = [];

            foreach ($bardStyleList as $bardStyle) {
                if (is_array($bardStyle) && ! empty($bardStyle['handle'])) {
                    $bardByHandle[$bardStyle['handle']] = $bardStyle;
                }
            }

            foreach ($buttons as $button) {
                if (isset($texstyle[$button]) && is_array($texstyle[$button])) {
                    $style = $texstyle[$button];
                    $styles[$button] = array_filter([
                        'type' => $style['type'] ?? 'span',
                        'class' => $style['class'] ?? null,
                        'level' => $style['level'] ?? null,
                        'ident' => $style['ident'] ?? null,
                        'name' => $style['name'] ?? null,
                    ], fn ($v) => $v !== null);

                    continue;
                }

                // Vizuall bard-style addon: groups + individual styles from
                // config/statamic/bard_styles.php (button names bard-group-* / bard-*).
                if (str_starts_with($button, 'bard-group-')) {
                    $groupKey = substr($button, strlen('bard-group-'));
                    $meta = is_array($bardGroups[$groupKey] ?? null) ? $bardGroups[$groupKey] : [];
                    $items = [];

                    foreach ($bardStyleList as $bardStyle) {
                        if (! is_array($bardStyle) || ($bardStyle['group'] ?? null) !== $groupKey) {
                            continue;
                        }

                        $items[] = $this->normalizeBardStyle($bardStyle);
                    }

                    $styles[$button] = array_filter([
                        'kind' => 'group',
                        'name' => $meta['name'] ?? $groupKey,
                        'ident' => $meta['ident'] ?? null,
                        'items' => $items,
                    ], fn ($v) => $v !== null);

                    continue;
                }

                if (str_starts_with($button, 'bard-')) {
                    $handle = str_replace('-', '_', substr($button, strlen('bard-')));

                    if (isset($bardByHandle[$handle])) {
                        $styles[$button] = array_merge(
                            ['kind' => 'vizu'],
                            $this->normalizeBardStyle($bardByHandle[$handle])
                        );
                    }
                }
            }

            $sets = [];

            foreach ($this->flattenReplicatorSets($config['sets'] ?? []) as $setHandle => $set) {
                $sets[] = [
                    'handle' => $setHandle,
                    'display' => $set['display'] ?? $setHandle,
                ];
            }

            return [
                'buttons' => $buttons,
                'styles' => $styles,
                'sets' => $sets,
                'inline' => (bool) ($config['inline'] ?? false),
            ];
        } catch (\Throwable $e) {
            Log::debug('VisualEdit: failed to resolve bard config for '.$fieldPath, ['exception' => $e]);

            return null;
        }
    }

    /**
     * Normalizes a single entry from config/statamic/bard_styles.php for the
     * preview toolbar (span/paragraph/div + optional block-target props).
     */
    private function normalizeBardStyle(array $style): array
    {
        return array_filter([
            'handle' => $style['handle'] ?? null,
            'type' => $style['type'] ?? 'span',
            'name' => $style['name'] ?? null,
            'ident' => $style['ident'] ?? null,
            'prop' => $style['prop'] ?? null,
            'value' => $style['value'] ?? null,
            'class' => $style['class'] ?? null,
            'target' => $style['target'] ?? null,
            'cp_css' => $style['cp_css'] ?? null,
        ], fn ($v) => $v !== null);
    }

    /**
     * Recursively collects every field with the given handle in a
     * blueprint/fieldset field tree, resolving `import` references. Each match is
     * recorded as ['config' => <field config>, 'set' => <nearest enclosing set
     * handle or ''>] so the caller can prefer the one in the current set type.
     *
     * $fieldType narrows the search to one fieldtype (e.g. 'bard'); null keeps
     * every match, which is what the sibling-control lookup needs.
     *
     * $node is any structure that may contain a `fields` array (tabs, sections,
     * sets, grids, groups).
     */
    private function collectFieldsByHandle($node, string $handle, array &$matches, ?string $fieldType = null, string $enclosingSet = '', int $depth = 0, array $setChain = []): void
    {
        if ($depth > 14 || ! is_array($node)) {
            return;
        }

        // Tabs (assoc: name => tab).
        foreach (($node['tabs'] ?? []) as $tab) {
            $this->collectFieldsByHandle($tab, $handle, $matches, $fieldType, $enclosingSet, $depth + 1, $setChain);
        }

        // Sections (list).
        foreach (($node['sections'] ?? []) as $section) {
            $this->collectFieldsByHandle($section, $handle, $matches, $fieldType, $enclosingSet, $depth + 1, $setChain);
        }

        foreach ((array) ($node['fields'] ?? []) as $item) {
            // Import reference — resolve the fieldset and recurse into it.
            if (isset($item['import'])) {
                $fieldset = \Statamic\Facades\Fieldset::find($item['import']);

                if ($fieldset) {
                    $this->collectFieldsByHandle($fieldset->contents(), $handle, $matches, $fieldType, $enclosingSet, $depth + 1, $setChain);
                }

                continue;
            }

            $field = $item['field'] ?? null;

            // A field can also reference a fieldset field ("basic_blocks.blocks")
            // and override parts of it in `config`. Resolve it into the config it
            // stands for, so both the match below and the descent into its sets
            // work exactly as they do for an inline field — the overridden sets
            // are where a referenced replicator's own fields actually live.
            if (is_string($field)) {
                $referenced = $this->resolveFieldReference($field);

                $field = $referenced ? array_merge($referenced, (array) ($item['config'] ?? [])) : null;
            }

            if (! is_array($field)) {
                continue;
            }

            // Case-insensitive: a handle is typed twice — once when the field is
            // created in the Control Panel, once in the template that names it —
            // and `Font_size` against `font_size` is a mismatch no one can see.
            // Nothing legitimate distinguishes two fields by capitals alone, so
            // the looser comparison costs nothing and answers the likelier intent.
            if (strcasecmp((string) ($item['handle'] ?? ''), $handle) === 0 && ($fieldType === null || ($field['type'] ?? null) === $fieldType)) {
                // `chain` is every set handle on the way down, outermost first —
                // ['featured_section/style_2', 'item']. The nearest set alone is
                // not enough to tell two fields apart: half a dozen sections name
                // a set `item`, and each of them has its own `text`.
                $matches[] = [
                    // The handle as the blueprint spells it, which is not always
                    // how the template spelled it — the comparison above ignores
                    // case, and a value is written back under this name, not the
                    // one that was typed. `font_size` writing to `Font_size` is
                    // the difference between a control that works and one that
                    // silently saves into a field nobody reads.
                    'handle' => (string) ($item['handle'] ?? ''),
                    'config' => $field,
                    'set' => $enclosingSet,
                    'chain' => $setChain,
                ];
            }

            // Grid/group nested fields.
            if (isset($field['fields'])) {
                $this->collectFieldsByHandle($field, $handle, $matches, $fieldType, $enclosingSet, $depth + 1, $setChain);
            }

            // Replicator/Bard set groups: sets => [group => ['sets' => [handle => ['fields' => ...]]]].
            foreach (($field['sets'] ?? []) as $group) {
                foreach (($group['sets'] ?? []) as $setHandle => $set) {
                    // Descend into every set, tagging matches with this set handle
                    // so the caller can prefer the one matching the current type.
                    $this->collectFieldsByHandle($set, $handle, $matches, $fieldType, (string) $setHandle, $depth + 1, [...$setChain, (string) $setHandle]);
                }
            }
        }
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
    private function resolveSetChainByScope(): array
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

            return $this->typeChainTo((array) $page->value($field), $uid) ?? [];
        } catch (\Throwable $e) {
            Log::debug('VisualEdit: failed to resolve set chain', ['exception' => $e]);

            return [];
        }
    }

    /** Depth-first walk collecting each row's `type` on the way to $uid. */
    private function typeChainTo(array $node, string $uid, array $chain = [], int $depth = 0): ?array
    {
        if ($depth > 14) {
            return null;
        }

        foreach ($node as $value) {
            if (! is_array($value)) {
                continue;
            }

            $isRow = isset($value['type']) || isset($value['id']) || isset($value['_id']);
            $next = $isRow && isset($value['type']) ? [...$chain, (string) $value['type']] : $chain;

            if ($isRow && in_array($uid, [
                $value['id'] ?? null,
                $value['_id'] ?? null,
                $value['_visual_id'] ?? null,
            ], true)) {
                return $next;
            }

            if ($found = $this->typeChainTo($value, $uid, $next, $depth + 1)) {
                return $found;
            }
        }

        return null;
    }

    /**
     * The page section this tag renders inside, by set handle
     * ("featured_section/style_2"), or '' when it cannot be told.
     *
     * `_visual_id` cascades from the section into everything drawn inside it, so
     * a tag several loops deep can still say which section it belongs to. Read
     * off the raw value rather than the augmented one: augmentation turns the
     * sets into objects, and all that is wanted here is `type`.
     */
    private function resolveSectionType(): string
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

    /** The field config behind a "fieldset.field" reference, or null. */
    private function resolveFieldReference(string $reference): ?array
    {
        $segments = explode('.', $reference);
        $fieldHandle = array_pop($segments);
        $fieldset = \Statamic\Facades\Fieldset::find(implode('.', $segments));

        if (! $fieldset) {
            return null;
        }

        foreach ((array) ($fieldset->contents()['fields'] ?? []) as $item) {
            if (($item['handle'] ?? null) === $fieldHandle && is_array($item['field'] ?? null)) {
                return $item['field'];
            }
        }

        return null;
    }

    /**
     * controls="font_tag|size" — sibling fields of the one being edited inline,
     * offered as quick controls in the preview toolbar. Returns them in the order
     * they were named as [['handle','display','type','options','default']];
     * unknown handles and fieldtypes the toolbar can't render are dropped.
     */
    private function resolveControls($spec): array
    {
        if ($spec === null || $spec === false || $spec === true || $spec === '') {
            return [];
        }

        // `controls="tag:h1|font_size:text-700"` — the option each control starts
        // on, declared where the block is used rather than in the fieldset it is
        // shared from. One headline block can then lead with an H1 in the hero
        // and an H3 in a content box, without a fieldset per section.
        //
        // Nothing after the colon means nothing declared, so an interpolated
        // parameter that was never passed (`tag:{tag_default}`) falls through to
        // the field's own default instead of blanking the control.
        $defaults = [];
        $handles = [];

        foreach (preg_split('/[|,]/', (string) $spec) as $part) {
            [$handle, $default] = array_pad(explode(':', trim($part), 2), 2, null);

            $handle = trim((string) $handle);

            if ($handle === '') {
                continue;
            }

            $handles[] = $handle;

            if (is_string($default) && trim($default) !== '') {
                $defaults[$handle] = trim($default);
            }
        }

        if (empty($handles)) {
            return [];
        }

        try {
            $blueprintHandle = $this->params->get('blueprint');

            if ($blueprintHandle) {
                $blueprint = Blueprint::find((string) $blueprintHandle);
            } else {
                $page = $this->context->get('page');
                $blueprint = ($page && method_exists($page, 'blueprint')) ? $page->blueprint() : null;
            }

            if (! $blueprint) {
                return [];
            }

            $contents = $blueprint->contents();
            $setType = (string) $this->context->get('type', '');
            $out = [];

            // The same chain the Bard toolbar narrows by, read once: it describes
            // the row this tag sits in, not the handle being looked up.
            $valueChain = $this->resolveSetChainByScope();
            $sectionType = $valueChain[0] ?? $this->resolveSectionType();

            foreach ($handles as $handle) {
                $matches = [];
                $this->collectFieldsByHandle($contents, $handle, $matches);

                if (empty($matches)) {
                    Log::debug("VisualEdit: controls=\"{$handle}\" skipped — no field by that handle in the blueprint.");

                    continue;
                }

                // Same disambiguation as the Bard toolbar, and for the same
                // reason: the set handle alone is ambiguous, because half a dozen
                // sections name a set `item` and each has its own fields. Narrow
                // by the whole chain first, then by section + set, then by the
                // set alone.
                $found = null;

                foreach ($matches as $match) {
                    if (($match['chain'] ?? []) === $valueChain) {
                        $found = $match;
                        break;
                    }
                }

                if ($found === null && $sectionType !== '' && $setType !== '') {
                    foreach ($matches as $match) {
                        $chain = $match['chain'] ?? [];

                        if (($chain[0] ?? null) === $sectionType && ($chain[count($chain) - 1] ?? null) === $setType) {
                            $found = $match;
                            break;
                        }
                    }
                }

                // Only when there is nothing to place the tag by. Knowing which
                // row this is and still not finding the handle in it means the
                // field is not there — and a namesake elsewhere is no substitute.
                // Several fieldsets name a set `headline`, so matching on the set
                // handle alone answers with whichever the walk reached first:
                // `basic_blocks`, whose Small/Large belong to another block.
                if ($found === null && empty($valueChain) && $sectionType === '') {
                    foreach ($matches as $match) {
                        if ($match['set'] === $setType) {
                            $found = $match;
                            break;
                        }
                    }
                }

                // Deliberately no fallback to the first match found anywhere.
                // Borrowing a namesake from another set is how a headline came to
                // offer Small/Large — options belonging to a different section's
                // field entirely. A control that does not appear is a bug you can
                // see; one offering another field's values is a bug you act on.
                if ($found === null) {
                    Log::debug("VisualEdit: controls=\"{$handle}\" skipped — no such field in set '{$setType}'.");

                    continue;
                }

                $config = $found['config'];
                $type = $config['type'] ?? null;

                // The toolbar draws raw DOM inside the preview iframe, so it can
                // only offer fieldtypes it knows how to draw. Anything else is
                // skipped — logged, because a control that silently never appears
                // is the hardest kind of nothing to debug.
                $supported = ['select', 'button_group', 'radio', 'toggle', 'theme_color_picker', 'color'];

                if (! in_array($type, $supported, true)) {
                    Log::debug("VisualEdit: controls=\"{$handle}\" skipped — the toolbar cannot render a '{$type}' field.");

                    continue;
                }

                $control = [
                    // The blueprint's spelling, not the template's — this is the
                    // name the value is read and written under.
                    'handle' => $found['handle'] !== '' ? $found['handle'] : $handle,
                    'display' => $config['display'] ?? Str::headline($handle),
                    'type' => $type,
                    // The template's declaration wins: it is the more local of the
                    // two, and the only one that can differ per place used.
                    'default' => $defaults[$handle] ?? $config['default'] ?? null,
                ];

                // Colour pickers: no options list — the bridge opens a swatch
                // menu (fetched from the CP) and wraps the current text
                // selection in {…} so a plain text field can carry a highlight.
                if (in_array($type, ['theme_color_picker', 'color'], true)) {
                    $out[] = array_filter($control, fn ($v) => $v !== null);

                    continue;
                }

                if ($type !== 'toggle') {
                    $options = $this->normalizeControlOptions((array) ($config['options'] ?? []));

                    if (empty($options)) {
                        continue;
                    }

                    $control['options'] = $options;
                }

                $out[] = array_filter($control, fn ($v) => $v !== null);
            }

            return $out;
        } catch (\Throwable $e) {
            Log::debug('VisualEdit: failed to resolve controls for '.(string) $spec, ['exception' => $e]);

            return [];
        }
    }

    /**
     * Statamic writes select/button_group options in three shapes depending on how
     * they were authored — a keyed map, a plain list, or the array fieldtype's
     * [['key' => …, 'value' => …]]. All three become [['key','label']].
     */
    private function normalizeControlOptions(array $options): array
    {
        $out = [];

        foreach ($options as $key => $option) {
            if (is_array($option) && array_key_exists('key', $option)) {
                $optionKey = (string) $option['key'];

                $out[] = ['key' => $optionKey, 'label' => (string) ($option['value'] ?? $optionKey)];

                continue;
            }

            if (is_string($key)) {
                $out[] = ['key' => $key, 'label' => is_string($option) ? $option : $key];

                continue;
            }

            if (is_string($option) || is_numeric($option)) {
                $out[] = ['key' => (string) $option, 'label' => (string) $option];
            }
        }

        return $out;
    }

    /**
     * The replicator this tag is on, found inside the section being rendered.
     *
     * A field handle is only unique within its set. Half the page-builder
     * sections call their block field `blocks`, so searching the blueprint for
     * the bare handle returns whichever one comes first in the file — another
     * section's field, with another section's set types and another section's
     * limits. The set being rendered is in the context as `type`, so the search
     * starts there and only falls back to the whole tree when that fails.
     */
    private function replicatorConfig(string $fieldHandle): ?array
    {
        $page = $this->context->get('page');
        $blueprint = ($page && method_exists($page, 'blueprint')) ? $page->blueprint() : null;

        if (! $blueprint) {
            return null;
        }

        $contents = $blueprint->contents();
        $setType = (string) ($this->context->get('type') ?? '');

        if ($setType !== '' && $set = $this->findSetConfig($contents, $setType)) {
            if ($found = $this->findReplicatorConfig($set, $fieldHandle)) {
                return $found;
            }
        }

        return $this->findReplicatorConfig($contents, $fieldHandle);
    }

    /** A replicator set's own config, by set handle, anywhere in the tree. */
    private function findSetConfig($node, string $setHandle, int $depth = 0): ?array
    {
        if ($depth > 14 || ! is_array($node)) {
            return null;
        }

        foreach (($node['tabs'] ?? []) as $tab) {
            if ($found = $this->findSetConfig($tab, $setHandle, $depth + 1)) {
                return $found;
            }
        }

        foreach (($node['sections'] ?? []) as $section) {
            if ($found = $this->findSetConfig($section, $setHandle, $depth + 1)) {
                return $found;
            }
        }

        foreach ((array) ($node['fields'] ?? []) as $item) {
            if (isset($item['import'])) {
                $fieldset = \Statamic\Facades\Fieldset::find($item['import']);

                if ($fieldset && $found = $this->findSetConfig($fieldset->contents(), $setHandle, $depth + 1)) {
                    return $found;
                }

                continue;
            }

            $field = $item['field'] ?? null;

            if (! is_array($field)) {
                continue;
            }

            foreach (($field['sets'] ?? []) as $group) {
                foreach (($group['sets'] ?? []) as $handle => $set) {
                    if ((string) $handle === $setHandle) {
                        return $set;
                    }

                    if ($found = $this->findSetConfig($set, $setHandle, $depth + 1)) {
                        return $found;
                    }
                }
            }

            if (isset($field['fields']) && $found = $this->findSetConfig($field, $setHandle, $depth + 1)) {
                return $found;
            }
        }

        return null;
    }

    /**
     * The replicator's `max_sets`, when it has one.
     *
     * The preview's "+" is the addon's own control, not Statamic's Add Set
     * button, so nothing stopped it offering a third block to a field capped at
     * two — the cap was only ever consulted by the row toolbar's Add another.
     * Emitted alongside the set types, from the same config lookup, so the "+"
     * can simply not be drawn once the field is full.
     */
    private function resolveInsertMax(string $fieldHandle): ?int
    {
        try {
            $max = $this->replicatorConfig($fieldHandle)['max_sets'] ?? null;

            return ($max === null || $max === '') ? null : (int) $max;
        } catch (\Throwable $e) {
            Log::debug('VisualEdit: failed to resolve insert max for '.$fieldHandle, ['exception' => $e]);

            return null;
        }
    }

    /**
     * The set types a replicator field allows, as [{handle, display}], read from
     * the blueprint — so the block inserter offers exactly what the field permits,
     * nothing hardcoded.
     */
    private function resolveInsertSets(string $fieldHandle): array
    {
        try {
            $config = $this->replicatorConfig($fieldHandle);

            if (! $config) {
                return [];
            }

            $out = [];

            foreach ($this->flattenReplicatorSets($config['sets'] ?? []) as $handle => $set) {
                $out[] = [
                    'handle' => $handle,
                    'display' => $set['display'] ?? Str::headline($handle),
                ];
            }

            return $out;
        } catch (\Throwable $e) {
            Log::debug('VisualEdit: failed to resolve insert sets for '.$fieldHandle, ['exception' => $e]);

            return [];
        }
    }

    /** The config of the replicator with this handle, found anywhere in the tree. */
    private function findReplicatorConfig($node, string $handle, int $depth = 0): ?array
    {
        if ($depth > 14 || ! is_array($node)) {
            return null;
        }

        foreach (($node['tabs'] ?? []) as $tab) {
            if ($found = $this->findReplicatorConfig($tab, $handle, $depth + 1)) {
                return $found;
            }
        }

        foreach (($node['sections'] ?? []) as $section) {
            if ($found = $this->findReplicatorConfig($section, $handle, $depth + 1)) {
                return $found;
            }
        }

        foreach ((array) ($node['fields'] ?? []) as $item) {
            if (isset($item['import'])) {
                $fieldset = \Statamic\Facades\Fieldset::find($item['import']);

                if ($fieldset && $found = $this->findReplicatorConfig($fieldset->contents(), $handle, $depth + 1)) {
                    return $found;
                }

                continue;
            }

            $field = $item['field'] ?? null;

            if (! is_array($field)) {
                continue;
            }

            if (($item['handle'] ?? null) === $handle && isset($field['sets'])) {
                return $field;
            }

            foreach (($field['sets'] ?? []) as $group) {
                foreach (($group['sets'] ?? []) as $set) {
                    if ($found = $this->findReplicatorConfig($set, $handle, $depth + 1)) {
                        return $found;
                    }
                }
            }

            if (isset($field['fields']) && $found = $this->findReplicatorConfig($field, $handle, $depth + 1)) {
                return $found;
            }
        }

        return null;
    }

    /**
     * Badge icon for this annotation: explicit `icon=` param, then the Replicator
     * set's icon, then a Grid field's icon (`icon_from="links"` or the field's
     * own handle). Grids have no sets, so their icon lives on the field config.
     */
    private function resolveIcon(): string
    {
        if ($icon = $this->params->get('icon')) {
            return (string) $icon;
        }

        if ($setIcon = $this->resolveSetIcon($this->resolveType())) {
            return $setIcon;
        }

        $from = $this->params->get('icon_from', $this->params->get('icon-from'));

        return $from ? $this->resolveFieldIcon((string) $from) : '';
    }

    /**
     * The icon a Replicator set declares in the blueprint, so the preview can put
     * it in front of the set's name. Empty when the set names none — the toolbar
     * falls back to the name's first letter, which still tells one block from
     * another at a glance.
     */
    private function resolveSetIcon(string $setHandle): string
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

            return (string) ($this->findSetIcon($blueprint->contents(), $setHandle) ?? '');
        } catch (\Throwable $e) {
            Log::debug('VisualEdit: failed to resolve set icon for '.$setHandle, ['exception' => $e]);

            return '';
        }
    }

    /**
     * Icon configured on a field (typically a Grid) — same picker as set icons,
     * stored as `icon:` on the field config.
     */
    private function resolveFieldIcon(string $fieldHandle): string
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

            return (string) ($this->findFieldIcon($blueprint->contents(), $fieldHandle) ?? '');
        } catch (\Throwable $e) {
            Log::debug('VisualEdit: failed to resolve field icon for '.$fieldHandle, ['exception' => $e]);

            return '';
        }
    }

    /**
     * The SVG behind an icon name, or empty when there is none to find.
     *
     * Filenames from Statamic's set or a registered custom Icon::set are looked
     * up on disk. Anything else — Iconify, emoji — is left for the preview under
     * `data-sid-icon`.
     */
    private function resolveIconMarkup(string $icon): string
    {
        try {
            return IconResolver::markup($icon) ?? '';
        } catch (\Throwable $e) {
            Log::debug('VisualEdit: failed to read icon '.$icon, ['exception' => $e]);

            return '';
        }
    }

    /** Walks the blueprint for a field with this handle and returns its `icon`. */
    private function findFieldIcon($node, string $fieldHandle, int $depth = 0): ?string
    {
        if ($depth > 14 || ! is_array($node)) {
            return null;
        }

        foreach (($node['tabs'] ?? []) as $tab) {
            if ($found = $this->findFieldIcon($tab, $fieldHandle, $depth + 1)) {
                return $found;
            }
        }

        foreach (($node['sections'] ?? []) as $section) {
            if ($found = $this->findFieldIcon($section, $fieldHandle, $depth + 1)) {
                return $found;
            }
        }

        foreach ((array) ($node['fields'] ?? []) as $item) {
            if (isset($item['import'])) {
                $fieldset = \Statamic\Facades\Fieldset::find($item['import']);

                if ($fieldset && $found = $this->findFieldIcon($fieldset->contents(), $fieldHandle, $depth + 1)) {
                    return $found;
                }

                continue;
            }

            $handle = (string) ($item['handle'] ?? '');
            $field = $item['field'] ?? null;

            if (is_string($field)) {
                $referenced = $this->resolveFieldReference($field);
                $field = $referenced ? array_merge($referenced, (array) ($item['config'] ?? [])) : null;
            }

            if (! is_array($field)) {
                continue;
            }

            if ($handle === $fieldHandle && ! empty($field['icon'])) {
                return (string) $field['icon'];
            }

            foreach ($this->flattenReplicatorSets($field['sets'] ?? []) as $set) {
                if ($found = $this->findFieldIcon($set, $fieldHandle, $depth + 1)) {
                    return $found;
                }
            }

            if (isset($field['fields']) && $found = $this->findFieldIcon($field, $fieldHandle, $depth + 1)) {
                return $found;
            }
        }

        return null;
    }

    /** Walks the blueprint for a set with this handle and returns its `icon`. */
    private function findSetIcon($node, string $setHandle, int $depth = 0): ?string
    {
        if ($depth > 14 || ! is_array($node)) {
            return null;
        }

        foreach (($node['tabs'] ?? []) as $tab) {
            if ($found = $this->findSetIcon($tab, $setHandle, $depth + 1)) {
                return $found;
            }
        }

        foreach (($node['sections'] ?? []) as $section) {
            if ($found = $this->findSetIcon($section, $setHandle, $depth + 1)) {
                return $found;
            }
        }

        foreach ((array) ($node['fields'] ?? []) as $item) {
            if (isset($item['import'])) {
                $fieldset = \Statamic\Facades\Fieldset::find($item['import']);

                if ($fieldset && $found = $this->findSetIcon($fieldset->contents(), $setHandle, $depth + 1)) {
                    return $found;
                }

                continue;
            }

            $field = $item['field'] ?? null;

            // Same as collectFieldsByHandle: a referenced field keeps its sets in
            // the `config` override, so it has to be resolved before descending.
            if (is_string($field)) {
                $referenced = $this->resolveFieldReference($field);

                $field = $referenced ? array_merge($referenced, (array) ($item['config'] ?? [])) : null;
            }

            if (! is_array($field)) {
                continue;
            }

            foreach ($this->flattenReplicatorSets($field['sets'] ?? []) as $handle => $set) {
                if ((string) $handle === $setHandle && ! empty($set['icon'])) {
                    return (string) $set['icon'];
                }

                if ($found = $this->findSetIcon($set, $setHandle, $depth + 1)) {
                    return $found;
                }
            }

            if (isset($field['fields']) && $found = $this->findSetIcon($field, $setHandle, $depth + 1)) {
                return $found;
            }
        }

        return null;
    }

    /** Flattens grouped set config (`sets: { group: { sets: {...} } }`) to handle => set. */
    private function flattenReplicatorSets(array $sets): array
    {
        $first = reset($sets);

        if (is_array($first) && isset($first['sets'])) {
            $out = [];

            foreach ($sets as $group) {
                foreach (($group['sets'] ?? []) as $handle => $set) {
                    $out[$handle] = $set;
                }
            }

            return $out;
        }

        return $sets;
    }

    protected function isLivePreview(): bool
    {
        return request()->isLivePreview();
    }
}
