<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Statamic\Facades\Entry;
use Statamic\Facades\Site;

/**
 * Renders a saved TEMPLATE — every section in it — so the preview generator can
 * screenshot the whole stack.
 *
 * The sections need a real page around them for context (layout, globals, …), so a
 * published page is borrowed as the host and its page_sections are swapped, in
 * memory only, for the template's. Nothing is written, and the route is signed and
 * short-lived, so it is never a public URL.
 *
 * Kept separate from the saved-section preview rather than sharing it: that one
 * renders a single section and doubles as the Live Preview target the global
 * section feature depends on. Teaching it a second shape would put that at risk
 * for the sake of thirty lines.
 */
class SavedTemplatePreviewController extends Controller
{
    public function show(Request $request, string $id)
    {
        $template = Entry::find($id);
        $collection = config('statamic-visual-editor.templates.collection', 'saved_templates');

        abort_unless($template && $template->collectionHandle() === $collection, 404);

        $field = config('statamic-visual-editor.previews.field', 'page_sections');
        $sections = $template->value($field);

        abort_unless(is_array($sections) && $sections !== [], 404);

        if (! $host = $this->hostPage()) {
            abort(404);
        }

        $host->set($field, $sections);

        return $host->toResponse($request);
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
