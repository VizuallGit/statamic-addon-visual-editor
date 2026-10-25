<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use MarioHamann\StatamicVisualEditor\Breakpoints;
use MarioHamann\StatamicVisualEditor\Shortcuts;
use Statamic\Fields\Fieldtype;

/**
 * One keyboard shortcut: the Shortcut column on Settings → Screen sizes.
 *
 * The site's own for that size. Empty follows the built-in one (Desktop,
 * Tablet and Mobile have one; a size the site adds has none); `none` takes it
 * away. Broken or locked shortcuts are never saved.
 */
class ShortcutFieldtype extends Fieldtype
{
    protected $selectable = false;

    protected static $handle = 'sve_shortcut';

    public function component(): string
    {
        return 'sve-shortcut';
    }

    /** What the recorder needs to name a shortcut that is in use, and to refuse a locked one. */
    public function preload(): array
    {
        return [
            'builtIn' => Shortcuts::DEFAULTS,
            'locked' => Shortcuts::LOCKED,
            'labels' => Shortcuts::labels(),
            'sizes' => array_column(Breakpoints::all(), 'label', 'handle'),
        ];
    }

    public function preProcess($data)
    {
        return Shortcuts::clean($data);
    }

    public function process($data)
    {
        $combo = Shortcuts::clean($data);

        return $combo === '' ? null : $combo;
    }
}
