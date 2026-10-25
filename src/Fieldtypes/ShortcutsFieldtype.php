<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use MarioHamann\StatamicVisualEditor\Breakpoints;
use MarioHamann\StatamicVisualEditor\Shortcuts;
use Statamic\Fields\Fieldtype;

/**
 * The site's keyboard shortcuts for the Live Preview top bar: Settings →
 * Keyboard shortcuts, one recorder per tool.
 *
 * The value is a map, `{ "tool:pages": "mod+p", … }`. A tool it does not name
 * keeps its built-in shortcut, which the empty recorder shows; `none` takes it
 * away. Every user can change their own in Live Preview (⋮ → Shortcuts).
 */
class ShortcutsFieldtype extends Fieldtype
{
    protected $selectable = false;

    protected static $handle = 'sve_shortcuts';

    public function component(): string
    {
        return 'sve-shortcuts';
    }

    public function preload(): array
    {
        return [
            'rows' => Shortcuts::forFieldtype(),
            'builtIn' => Shortcuts::DEFAULTS,
            'locked' => Shortcuts::LOCKED,
            // The sizes' names, for a shortcut one of them has.
            'sizes' => array_column(Breakpoints::all(), 'label', 'handle'),
        ];
    }

    public function preProcess($data)
    {
        return Shortcuts::cleanMap($data);
    }

    public function process($data)
    {
        $map = Shortcuts::cleanMap($data);

        return $map === [] ? null : $map;
    }
}
