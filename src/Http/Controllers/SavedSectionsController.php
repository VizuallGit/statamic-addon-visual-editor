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
 * Saves a configured page section as a reusable template.
 *
 * The section's data is captured as-is and stored in the configured saved-sections
 * collection. How a page later uses it is decided at insert time, from the
 * `synced` flag: unsynced templates are inserted as an independent copy (a
 * WordPress-style pattern), synced ones as a reference that stays in step with
 * the source.
 */
class SavedSectionsController
{
    /** The collection saved sections live in — configurable, never assumed. */
    protected static function collection(): string
    {
        return config('statamic-visual-editor.saved_sections.collection', 'saved_sections');
    }

    /** The page-builder field a section is stored in (shared with the previews config). */
    protected static function field(): string
    {
        return config('statamic-visual-editor.previews.field', 'page_sections');
    }

    public function index(Request $request)
    {
        abort_unless(User::current(), 403);

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        $sections = Entry::query()
            ->where('collection', static::collection())
            ->where('site', $site)
            ->get()
            ->map(fn ($entry) => [
                'id' => $entry->id(),
                'title' => $entry->value('title'),
                'section_type' => $entry->value('section_type'),
                'synced' => (bool) $entry->value('synced'),
                'preview_url' => optional($entry->augmentedValue('preview_image')->value())->url(),
                // The raw section, so an unsynced one can be inserted as a copy
                // client-side without a second round-trip.
                'section_data' => static::sectionOf($entry),
            ])
            ->values()
            ->all();

        return response()->json(['sections' => $sections]);
    }

    public function store(Request $request)
    {
        $user = User::current();

        abort_unless($user, 403);
        abort_unless(Collection::findByHandle(static::collection()), 404);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'section_type' => 'required|string|max:255',
            'section_data' => 'required|array',
            'synced' => 'boolean',
        ]);

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        // Stored in a real page_sections field (not JSON), so it renders with full
        // augmentation exactly like a page's own sections — that's what makes a
        // synced/global section show its live content wherever it's referenced.
        $section = $data['section_data'];
        $section['type'] = $data['section_type'];
        $section['enabled'] = true;
        // A stable id so the section's `#id-<id>` CSS resolves when rendered.
        $section['id'] = Str::lower(Str::random(12));

        $entry = Entry::make()
            ->collection(static::collection())
            ->locale($site)
            ->slug(Str::slug($data['title']).'-'.Str::lower(Str::random(6)))
            ->published(true)
            ->data([
                'title' => $data['title'],
                'section_type' => $data['section_type'],
                'synced' => (bool) ($data['synced'] ?? false),
                static::field() => [$section],
            ]);

        $entry->save();

        // The screenshot needs a headless browser (seconds), so it runs after the
        // response is sent — the save itself stays instant. The picker shows a
        // placeholder until the image lands.
        dispatch(function () use ($entry) {
            app(SavedSectionPreview::class)->generate($entry->fresh());
        })->afterResponse();

        return response()->json([
            'id' => $entry->id(),
            'title' => $entry->value('title'),
        ]);
    }

    /** The raw first section stored on a saved-section entry. */
    protected static function sectionOf(\Statamic\Contracts\Entries\Entry $entry): ?array
    {
        $sections = $entry->value(static::field());

        return is_array($sections) && isset($sections[0]) ? $sections[0] : null;
    }

    /** Re-screenshot a saved section on demand. */
    public function regeneratePreview(Request $request, string $id)
    {
        abort_unless(User::current(), 403);

        $entry = Entry::find($id);

        abort_unless($entry && $entry->collectionHandle() === static::collection(), 404);

        $ok = app(SavedSectionPreview::class)->generate($entry);

        return response()->json(['ok' => $ok]);
    }
}
