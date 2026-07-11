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
            // Label omitted: buildAttr already emitted data-sid-label. Bard config
            // is resolved here too so column-builder text blocks get the field's
            // own toolbar, not the default fallback.
            $attr .= ' '.$this->buildFieldAttr((string) $field, '', false, (string) $uuid, true, false, $this->resolveBardConfig((string) $field));
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

            // Collect every bard field with this handle, tagged with the set it
            // sits in, then prefer the one whose set matches the current set type
            // (context 'type'). This disambiguates identically-named fields —
            // hero vs seo_text `text`, or a column-builder `text` block — without
            // the aggressive scoping that broke deeply nested (column) lookups.
            $matches = [];
            $this->collectBardFields($blueprint->contents(), $handle, $matches);

            if (empty($matches)) {
                return null;
            }

            $config = null;

            foreach ($matches as $match) {
                if ($match['set'] === $setType) {
                    $config = $match['config'];
                    break;
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
     * Recursively collects every Bard field with the given handle in a
     * blueprint/fieldset field tree, resolving `import` references. Each match is
     * recorded as ['config' => <field config>, 'set' => <nearest enclosing set
     * handle or ''>] so the caller can prefer the one in the current set type.
     *
     * $node is any structure that may contain a `fields` array (tabs, sections,
     * sets, grids, groups).
     */
    private function collectBardFields($node, string $handle, array &$matches, string $enclosingSet = '', int $depth = 0): void
    {
        if ($depth > 14 || ! is_array($node)) {
            return;
        }

        // Tabs (assoc: name => tab).
        foreach (($node['tabs'] ?? []) as $tab) {
            $this->collectBardFields($tab, $handle, $matches, $enclosingSet, $depth + 1);
        }

        // Sections (list).
        foreach (($node['sections'] ?? []) as $section) {
            $this->collectBardFields($section, $handle, $matches, $enclosingSet, $depth + 1);
        }

        foreach ((array) ($node['fields'] ?? []) as $item) {
            // Import reference — resolve the fieldset and recurse into it.
            if (isset($item['import'])) {
                $fieldset = \Statamic\Facades\Fieldset::find($item['import']);

                if ($fieldset) {
                    $this->collectBardFields($fieldset->contents(), $handle, $matches, $enclosingSet, $depth + 1);
                }

                continue;
            }

            $field = $item['field'] ?? null;

            if (! is_array($field)) {
                continue;
            }

            if (($item['handle'] ?? null) === $handle && ($field['type'] ?? null) === 'bard') {
                $matches[] = ['config' => $field, 'set' => $enclosingSet];
            }

            // Grid/group nested fields.
            if (isset($field['fields'])) {
                $this->collectBardFields($field, $handle, $matches, $enclosingSet, $depth + 1);
            }

            // Replicator/Bard set groups: sets => [group => ['sets' => [handle => ['fields' => ...]]]].
            foreach (($field['sets'] ?? []) as $group) {
                foreach (($group['sets'] ?? []) as $setHandle => $set) {
                    // Descend into every set, tagging matches with this set handle
                    // so the caller can prefer the one matching the current type.
                    $this->collectBardFields($set, $handle, $matches, (string) $setHandle, $depth + 1);
                }
            }
        }
    }

    protected function isLivePreview(): bool
    {
        return request()->isLivePreview();
    }
}
