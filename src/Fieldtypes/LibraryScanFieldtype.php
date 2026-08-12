<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use Statamic\Fields\Fieldtype;

/**
 * The "Scan the site" button, for the settings screen.
 *
 * Holds no value — the field exists to put the action next to the toggle it
 * belongs to. Switching the narrowing on without a scan does nothing (see
 * LibraryAccess), so sending whoever switched it on to hunt for the button
 * somewhere else would be a good way to end up with a setting that quietly
 * means nothing.
 */
class LibraryScanFieldtype extends Fieldtype
{
    protected static $handle = 'library_scan';

    protected $selectable = false;

    public function preProcess(mixed $data): ?string
    {
        return null;
    }

    public function process(mixed $data): ?string
    {
        return null;
    }
}
