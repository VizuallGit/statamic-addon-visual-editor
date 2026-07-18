<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\SavedSectionPreview;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\Site;
use Statamic\Facades\User;

/**
 * Saves every section on a page as one reusable template.
 *
 * The saved-sections store's sibling, in its own collection: the two are separate
 * lists with their own place in the Control Panel nav, and they behave differently.
 * A saved section can be *synced*, so a page referencing it stays in step with the
 * source. A template is only ever copied — drop one and you own the sections
 * outright, and editing the template afterwards touches nothing already built
 * from it.
 */
class SavedTemplatesController
{
    /** The collection templates live in — configurable, never assumed. */
    protected static function collection(): string
    {
        return config('statamic-visual-editor.templates.collection', 'saved_templates');
    }

    /** The page-builder field the sections are stored in (shared with the previews config). */
    protected static function field(): string
    {
        return config('statamic-visual-editor.previews.field', 'page_sections');
    }

    public function index(Request $request)
    {
        abort_unless(User::current(), 403);

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        $templates = Entry::query()
            ->where('collection', static::collection())
            ->where('site', $site)
            ->get()
            ->map(fn ($entry) => [
                'id' => $entry->id(),
                'title' => $entry->value('title'),
                'preview_url' => optional($entry->augmentedValue('preview_image')->value())->url(),
                // The raw sections, so the client can insert copies without a
                // second round-trip. Always sent: a template is always a copy.
                'sections' => static::sectionsOf($entry),
            ])
            ->map(fn ($template) => $template + ['count' => count($template['sections'])])
            ->sortBy('title', SORT_NATURAL | SORT_FLAG_CASE)
            ->values()
            ->all();

        return response()->json(['templates' => $templates]);
    }

    public function store(Request $request)
    {
        $user = User::current();

        abort_unless($user, 403);
        abort_unless(Collection::findByHandle(static::collection()), 404);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'sections' => 'required|array|min:1',
        ]);

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        // Stored in a real page_sections field (not JSON), so the template renders
        // with full augmentation exactly like a page's own sections — that's what
        // makes the preview screenshot show the real thing.
        $sections = array_map(function ($section) {
            // A stable id so each section's `#id-<id>` CSS resolves when rendered.
            $section['id'] = Str::lower(Str::random(12));
            $section['enabled'] = true;

            return $section;
        }, array_values($data['sections']));

        $entry = Entry::make()
            ->collection(static::collection())
            ->locale($site)
            ->slug(Str::slug($data['title']).'-'.Str::lower(Str::random(6)))
            ->published(true)
            ->data([
                'title' => $data['title'],
                static::field() => $sections,
            ]);

        $entry->save();

        // The screenshot needs a headless browser (seconds), so it runs after the
        // response is sent — saving stays instant. The picker shows a placeholder
        // until the image lands.
        dispatch(function () use ($entry) {
            app(SavedSectionPreview::class)->generate($entry->fresh(), [
                'folder' => 'saved-templates',
                'route' => 'sve.saved-template-preview',
                // The whole stack, not one section: that's what a template is.
                'selector' => 'main',
            ]);
        })->afterResponse();

        return response()->json([
            'id' => $entry->id(),
            'title' => $entry->value('title'),
            'count' => count($sections),
        ]);
    }

    /** The raw sections stored on a template entry. */
    protected static function sectionsOf(\Statamic\Contracts\Entries\Entry $entry): array
    {
        $sections = $entry->value(static::field());

        return is_array($sections) ? array_values($sections) : [];
    }
}
