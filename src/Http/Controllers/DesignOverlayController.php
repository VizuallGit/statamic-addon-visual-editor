<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\DesignOverlays;
use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Facades\Entry;
use Statamic\Facades\User;

/**
 * The design overlay's files: list a page's, upload one size's, remove it,
 * and serve it to the editor. Every answer that changes something returns the
 * page's new listing, so the bar redraws from what is on disk.
 */
class DesignOverlayController
{
    public function __construct(protected DesignOverlays $overlays) {}

    public function index(string $entry)
    {
        $this->authorize($entry);

        return response()->json(['overlays' => $this->payload($entry)]);
    }

    public function store(Request $request, string $entry, string $breakpoint)
    {
        $this->authorize($entry, $breakpoint);

        $request->validate([
            'file' => 'required|file|mimetypes:'.implode(',', DesignOverlays::TYPES).'|max:'.DesignOverlays::MAX_KB,
        ]);

        $this->overlays->store($entry, $breakpoint, $request->file('file'));

        return response()->json(['overlays' => $this->payload($entry)]);
    }

    public function destroy(string $entry, string $breakpoint)
    {
        $this->authorize($entry, $breakpoint);
        $this->overlays->delete($entry, $breakpoint);

        return response()->json(['overlays' => $this->payload($entry)]);
    }

    public function show(string $entry, string $breakpoint)
    {
        $this->authorize($entry, $breakpoint);

        $file = $this->overlays->path($entry, $breakpoint);

        abort_unless($file, 404);

        // The URL carries the file's version, so the browser may keep it.
        return response()->file($file, [
            'Cache-Control' => 'private, max-age=31536000, immutable',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    /** The listing with the URL each image is served from. */
    protected function payload(string $entry): array
    {
        $out = [];

        foreach ($this->overlays->listing($entry) as $breakpoint => $image) {
            $out[$breakpoint] = $image === null ? null : $image + [
                'url' => url("/!/sve/design-overlay/{$entry}/{$breakpoint}/image").'?v='.$image['version'],
            ];
        }

        return $out;
    }

    protected function authorize(string $entry, ?string $breakpoint = null): void
    {
        $user = User::current();

        abort_unless($user && ($user->isSuper() || $user->hasPermission('access cp')), 403);
        // The same door as comments: the site's toggle and the tool's audience.
        abort_unless(Features::editorEnabled() && Features::allows('design_overlay', $user), 403);
        abort_unless(DesignOverlays::validEntry($entry) && Entry::find($entry), 404);
        abort_unless($breakpoint === null || DesignOverlays::validBreakpoint($breakpoint), 404);
    }
}
