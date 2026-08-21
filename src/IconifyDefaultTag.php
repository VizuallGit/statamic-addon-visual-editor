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
        return IconifyDefault::render(
            Arr::get($this->context, $fieldName),
            fn (array $icon) => $this->renderSVG($icon),
        );
    }
}
