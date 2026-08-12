<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use MarioHamann\StatamicVisualEditor\LibraryAccess;
use Statamic\Facades\User;

/**
 * Takes — and reports on — the snapshot a narrowed section library reads from.
 *
 * Gated on super admin, the same line the narrowing itself draws. Deciding what
 * everyone else may build with is not an editing job, and scanning every entry
 * on the site is not something to leave open to whoever can reach the endpoint.
 */
class LibraryScanController
{
    /** What the settings screen shows before anything is run. */
    public function show()
    {
        abort_unless(User::current()?->isSuper(), 403);

        return response()->json(static::payload(LibraryAccess::snapshot()));
    }

    /** Sweeps the site now and writes down what it found. */
    public function store()
    {
        abort_unless(User::current()?->isSuper(), 403);

        return response()->json(static::payload(LibraryAccess::scan()));
    }

    /**
     * The counts are what the button reports back; the lists themselves are on
     * disk for anyone who wants to read them, and are far too long to be useful
     * on a settings screen.
     */
    protected static function payload(array $snapshot): array
    {
        return [
            'scanned_at' => $snapshot['scanned_at'],
            'scanned_by' => $snapshot['scanned_by'],
            'types' => count($snapshot['types']),
            'globals' => count($snapshot['globals']),
            'path' => str_replace(base_path().'/', '', LibraryAccess::path()),
        ];
    }
}
