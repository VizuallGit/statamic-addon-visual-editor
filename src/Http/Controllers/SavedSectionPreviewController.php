<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Statamic\Facades\Entry;
use Statamic\Facades\Site;
use Statamic\Facades\User;

/**
 * Renders a SAVED section (from the saved_sections store) on its own, so the
 * preview generator can screenshot it.
 *
 * A section template needs a real page around it for context (layout, is_homepage,
 * globals, …), so a published page is borrowed as the host and its page_sections
 * are swapped — in memory only — for the single saved section. Nothing is written,
 * and the route is signed and short-lived, so it's never a public URL.
 */
class SavedSectionPreviewController extends Controller
{
    public function show(Request $request, string $id)
    {
        $saved = Entry::find($id);
        $collection = config('statamic-visual-editor.saved_sections.collection', 'saved_sections');

        abort_unless($saved && $saved->collectionHandle() === $collection, 404);

        $field = config('statamic-visual-editor.previews.field', 'page_sections');
        $sections = $saved->value($field);

        abort_unless(is_array($sections) && isset($sections[0]), 404);

        if (! $host = $this->hostPage()) {
            abort(404);
        }

        $host->set($field, [$sections[0]]);

        return $host->toResponse($request);
    }

    /**
     * Live Preview target for a Global section, so editing one in the CP is as
     * visual as editing a page.
     *
     * Nothing special is needed to show unsaved edits: this route runs in the
     * `statamic.web` group, whose token middleware has already substituted the
     * in-progress entry into the repository by the time `show()` looks it up.
     * Separate from the signed `show()` route (the screenshot generator's),
     * because Live Preview appends its own query string and would break a
     * signature — so this one is gated on a Control Panel user instead.
     */
    public function livePreview(Request $request, string $id)
    {
        abort_unless(User::current(), 403);

        return $this->show($request, $id);
    }

    /** Any published page, used purely as the rendering shell. */
    protected function hostPage()
    {
        $collection = config('statamic-visual-editor.previews.collection', 'pages');
        $site = Site::default()->handle();

        return Entry::query()
            ->where('collection', $collection)
            ->where('site', $site)
            ->where('published', true)
            ->first();
    }
}
