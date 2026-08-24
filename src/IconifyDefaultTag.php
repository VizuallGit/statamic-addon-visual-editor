<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Arr;
use StatamicIconify\Tags\IconifyTag;

/**
 * Same handle as Iconify's tag. Lives outside `Tags/` so Statamic does not
 * autoload it on sites (or in tests) that do not have the Iconify addon.
 *
 * Vue, fieldtype class and addon.js are untouched. Only `{{ iconify:icon }}`
 * changes: a name or an empty field with a default becomes SVG.
 */
class IconifyDefaultTag extends IconifyTag
{
    protected static $handle = 'iconify';

    public function wildcard($fieldName)
    {
        $fieldValue = Arr::get($this->context, $fieldName);
        $fallback = IconifyDefault::storedValueIsEmpty($fieldValue)
            ? IconifyDefault::fallbackName($this->context, $fieldName)
            : null;
        $html = IconifyDefault::render(
            $fieldValue,
            fn (array $icon) => $this->renderSVG($icon),
            $fallback,
        );

        // So the preview menu can hide Remove while the default is showing,
        // even if a morph left the wrapper's own attribute stale.
        if (is_string($html) && IconifyDefault::storedValueIsEmpty($fieldValue) && $fallback) {
            $html = preg_replace('/<svg\b/i', '<svg data-sve-icon-default', $html, 1) ?? $html;
        }

        return $html;
    }
}
