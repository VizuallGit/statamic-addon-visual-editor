<?php

namespace MarioHamann\StatamicVisualEditor\Tags\Resolve;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\Tags\Resolve\BlueprintFields;
use Statamic\Facades\Blueprint;

/**
 * The `controls="…"` parameter of `{{ visual_edit }}`: which fields a block's
 * toolbar shows and how. Needs the tag's params and context; moved verbatim
 * out of Tags\VisualEdit in WP7b.
 */
final class Controls
{
    use ResolvesScope;

    public function __construct(protected $params, protected $context)
    {
    }

    /**
     * controls="font_tag|size" — sibling fields of the one being edited inline,
     * offered as quick controls in the preview toolbar. Returns them in the order
     * they were named as [['handle','display','type','options','default']];
     * unknown handles and fieldtypes the toolbar can't render are dropped.
     */
    public function resolve($spec): array
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

            $setType = (string) $this->context->get('type', '');
            $out = [];

            // The same chain the Bard toolbar narrows by, read once: it describes
            // the row this tag sits in, not the handle being looked up.
            $valueChain = $this->resolveSetChainByScope();
            $sectionType = $valueChain[0] ?? $this->resolveSectionType();

            foreach ($handles as $handle) {
                $matches = BlueprintFields::fieldsByHandle($blueprint, $handle);

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
}
