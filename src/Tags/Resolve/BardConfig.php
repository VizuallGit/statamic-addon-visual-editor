<?php

namespace MarioHamann\StatamicVisualEditor\Tags\Resolve;

use Illuminate\Support\Facades\Log;
use MarioHamann\StatamicVisualEditor\Tags\Resolve\BlueprintFields;
use Statamic\Facades\Blueprint;

/**
 * The Bard field behind an inline-editable text: its buttons, marks and
 * styles as the editor should offer them. Needs the tag's params and context;
 * moved verbatim out of Tags\VisualEdit in WP7b.
 */
final class BardConfig
{
    use ResolvesScope;

    public function __construct(protected $params, protected $context)
    {
    }

    /**
     * Resolves the Bard field's own toolbar config so the preview builds an
     * identical toolbar instead of a hardcoded one. Returns
     * ['buttons' => [...], 'styles' => [name => [type, class, level, ident, name]]]
     * where `styles` covers the bard-texstyle buttons among the field's buttons.
     * Returns null when the field isn't a Bard field (e.g. a plain string).
     */
    public function resolve(string $fieldPath): ?array
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
            $matches = BlueprintFields::fieldsByHandle($blueprint, $handle, 'bard');

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
                $own = BlueprintFields::fieldsByHandle($blueprint, $handle);

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

            foreach (BlueprintFields::flattenReplicatorSets($config['sets'] ?? []) as $setHandle => $set) {
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
}
