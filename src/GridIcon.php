<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Fieldtypes\Grid;

/**
 * Gives Grid fields the same "Icon" setting Replicator sets already have.
 *
 * Grids have no sets, so Statamic never offers an icon picker for them. The
 * visual editor still wants a badge on orderable rows (link buttons, …), so
 * the icon lives on the grid field's own config — pickable in the fieldset
 * UI, readable from YAML as `icon: add-link`.
 */
class GridIcon
{
    public const KEY = 'icon';

    public static function register(): void
    {
        Grid::appendConfigFields([
            self::KEY => [
                'display' => __('sve::messages.grid_icon'),
                'instructions' => __('sve::messages.grid_icon_instructions'),
                'type' => 'icon',
                'width' => 50,
            ],
        ]);
    }
}
