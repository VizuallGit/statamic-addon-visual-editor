<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use MarioHamann\StatamicVisualEditor\PreviewHost;
use Statamic\Facades\Entry;

/**
 * Renders an entry's page with ONLY one of its sections, so the preview
 * generator can screenshot that section in isolation.
 *
 * WHY: previews must not depend on markup we don't own. Rather than requiring an
 * id/data-attribute on every section template (which would end up in the public
 * frontend), we re-render the real page with a single section in it — the
 * generator then simply captures the first child of <main>. Nothing is added to
 * the production HTML, and no section template needs changing.
 *
 * The route is signed and short-lived, so this stripped-down render is never
 * reachable as a public URL.
 */
class SectionPreviewController extends Controller
{
    public function show(Request $request, string $entry, string $section)
    {
        $model = Entry::find($entry);

        abort_unless($model, 404);

        $field = config('statamic-visual-editor.previews.field', 'page_sections');
        $sections = $model->value($field);

        abort_unless(is_array($sections), 404);

        $target = collect($sections)->first(
            fn ($item) => ($item['id'] ?? $item['_id'] ?? null) === $section
        );

        abort_unless($target, 404);

        // This entry as the shell — the section may read from the page around it —
        // but rendered through the collection's template rather than its own: an
        // entry that overrides its template (a home page listing something above
        // its sections) would otherwise put that markup first inside <main>, and
        // the generator photographs the first child.
        return PreviewHost::respond($request, [$target], $model);
    }
}
