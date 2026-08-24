<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Fieldtypes\Grid;

/**
 * Extra toggle on Grid: keep the table, even when the panel is narrow.
 *
 * Statamic itself switches a table-grid to stacked when the container is
 * under 550px and the grid has more than one field. Hidden editor fields
 * count, so a one-column grid in the sidebar becomes stacked. This flag
 * does not replace Grid — it is one more setting, same as {@see GridIcon}.
 */
class GridKeepTable
{
    public const KEY = 'sve_keep_table';

    public const COLLAPSE_KEY = 'sve_grid_collapse';

    public static function register(): void
    {
        Grid::appendConfigFields([
            self::KEY => [
                'display' => __('sve::messages.grid_keep_table'),
                'instructions' => __('sve::messages.grid_keep_table_instructions'),
                'type' => 'toggle',
                'default' => false,
                'width' => 50,
            ],
            self::COLLAPSE_KEY => [
                'display' => __('sve::messages.grid_collapse'),
                'instructions' => __('sve::messages.grid_collapse_instructions'),
                'type' => 'toggle',
                'default' => false,
                'width' => 50,
            ],
        ]);
    }
}
