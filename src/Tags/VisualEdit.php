<?php

namespace MarioHamann\StatamicVisualEditor\Tags;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
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
        $inside = $this->params->bool('outline-inside', false);
        $popup = $this->params->bool('popup', false);

        if ($field !== null && (string) $field !== '' && ! $popup) {
            // Scope UID: the _visual_id of the set this tag sits inside. Lets the CP
            // disambiguate a bare handle like "text" — which is otherwise identical
            // across every repeated section/row — by locating the matching set first
            // and then the field within it. Without this, "text" matches the first
            // field of that handle anywhere in the form.
            //
            // scope= overrides the cascaded _visual_id — needed inside column
            // builder rows, where _visual_id cascades from the parent page section
            // but the field lives on the row (use :scope="id", the row ID).
            $scopeUid = $this->params->get('scope', $this->context->get('_visual_id'));

            $inlineEdit = $this->inlineEditParam();

            $attr = $this->buildFieldAttr(
                (string) $field,
                $this->resolveFieldLabel((string) $field),
                $inside,
                $scopeUid ? (string) $scopeUid : '',
                $inlineEdit,
                $this->params->bool('move', false),
                $inlineEdit ? $this->resolveBardConfig((string) $field) : null
            );

            return $isPair ? '<div '.$attr.'>'.$content.'</div>' : $attr;
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
            $uuid = $this->params->get('id', $this->context->get('_visual_id'));
        }

        if (! $uuid) {
            return $content;
        }

        $attr = $this->buildAttr((string) $uuid, $this->resolveLabel(), $this->resolveType(), $inside, $popup, $this->params->bool('move', false));

        // popup + field + inline-edit: dual-annotated element. Text clicks try
        // inline editing first (field scope = the popup row id — column builder
        // rows have no _visual_id); the bridge falls back to opening the popup
        // when the CP denies the edit (padding, images, unmatched text).
        if ($popup && $field !== null && (string) $field !== '' && $this->inlineEditParam()) {
            // Label omitted: buildAttr already emitted data-sid-label.
            $attr .= ' '.$this->buildFieldAttr((string) $field, '', false, (string) $uuid, true);
        }

        return $isPair ? '<div '.$attr.'>'.$content.'</div>' : $attr;
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

    private function buildFieldAttr(string $fieldPath, string $label, bool $inside = false, string $scopeUid = '', bool $inlineEdit = false, bool $move = false, ?array $bardConfig = null): string
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

        // inline_edit="true": opt-in for in-preview editing (contenteditable +
        // toolbar). Without it, clicking the element only focuses the CP field.
        if ($inlineEdit) {
            $attr .= ' data-sid-inline-edit';
        }

        // Bard toolbar config — the preview builds its toolbar from the field's
        // own `buttons` list (never hardcoded) plus a styles map for its
        // bard-texstyle buttons.
        if ($bardConfig) {
            $attr .= ' data-sid-bard-buttons="'.e(implode(',', $bardConfig['buttons'])).'"';

            if (! empty($bardConfig['styles'])) {
                $attr .= ' data-sid-bard-styles="'.e(json_encode($bardConfig['styles'])).'"';
            }
        }

        // move="true": show reorder arrows on hover (the row is identified via
        // the field scope uid when no data-sid is present).
        if ($move) {
            $attr .= ' data-sid-move';
        }

        return $attr;
    }

    private function buildAttr(string $uuid, string $label, string $type = '', bool $inside = false, bool $popup = false, bool $move = false): string
    {
        $attr = 'data-sid="'.e($uuid).'"';

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

            $config = $this->findBardFieldConfig($blueprint->contents(), $handle, $setType);

            if (! $config || ($config['type'] ?? null) !== 'bard') {
                return null;
            }

            $buttons = array_values(array_filter((array) ($config['buttons'] ?? []), 'is_string'));

            if (empty($buttons)) {
                return null;
            }

            $texstyle = (array) config('statamic.bard_texstyle.styles', []);
            $styles = [];

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
                }
            }

            return ['buttons' => $buttons, 'styles' => $styles];
        } catch (\Throwable $e) {
            Log::debug('VisualEdit: failed to resolve bard config for '.$fieldPath, ['exception' => $e]);

            return null;
        }
    }

    /**
     * Recursively searches a blueprint/fieldset field tree for a Bard field with
     * the given handle, resolving `import` references and preferring the branch
     * of a replicator set whose handle matches $setType (so identically-named
     * fields in different sets — e.g. hero vs seo_text `text` — don't collide).
     *
     * $node is any structure that may contain a `fields` array (tabs, sections,
     * sets, grids, groups). Returns the matched field's config array, or null.
     */
    private function findBardFieldConfig($node, string $handle, string $setType, int $depth = 0): ?array
    {
        if ($depth > 12 || ! is_array($node)) {
            return null;
        }

        // Tabs (assoc: name => tab) — recurse each tab's structure.
        if (isset($node['tabs']) && is_array($node['tabs'])) {
            foreach ($node['tabs'] as $tab) {
                $found = $this->findBardFieldConfig($tab, $handle, $setType, $depth + 1);
                if ($found) {
                    return $found;
                }
            }
        }

        // Sections (list) — recurse each.
        if (isset($node['sections']) && is_array($node['sections'])) {
            foreach ($node['sections'] as $section) {
                $found = $this->findBardFieldConfig($section, $handle, $setType, $depth + 1);
                if ($found) {
                    return $found;
                }
            }
        }

        foreach ((array) ($node['fields'] ?? []) as $item) {
            // Import reference — resolve the fieldset and recurse into it.
            if (isset($item['import'])) {
                $fieldset = \Statamic\Facades\Fieldset::find($item['import']);

                if ($fieldset) {
                    $found = $this->findBardFieldConfig($fieldset->contents(), $handle, $setType, $depth + 1);
                    if ($found) {
                        return $found;
                    }
                }

                continue;
            }

            $field = $item['field'] ?? null;

            if (! is_array($field)) {
                continue;
            }

            if (($item['handle'] ?? null) === $handle && ($field['type'] ?? null) === 'bard') {
                return $field;
            }

            // Grid/group nested fields.
            if (isset($field['fields'])) {
                $found = $this->findBardFieldConfig($field, $handle, $setType, $depth + 1);
                if ($found) {
                    return $found;
                }
            }

            // Replicator/Bard set groups: sets => [group => ['sets' => [handle => ['fields' => ...]]]].
            foreach (($field['sets'] ?? []) as $group) {
                foreach (($group['sets'] ?? []) as $setHandle => $set) {
                    // Scope: when we know the set type, only descend into that set.
                    if ($setType !== '' && $setHandle !== $setType) {
                        continue;
                    }

                    $found = $this->findBardFieldConfig($set, $handle, $setType, $depth + 1);
                    if ($found) {
                        return $found;
                    }
                }
            }
        }

        return null;
    }

    protected function isLivePreview(): bool
    {
        return request()->isLivePreview();
    }
}
