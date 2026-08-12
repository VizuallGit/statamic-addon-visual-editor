<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\LibraryAccess;
use MarioHamann\StatamicVisualEditor\PreviewRefresher;
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
        $user = User::current();

        abort_unless($user, 403);

        // See the same call in SavedSectionsController::index — opening the library
        // is where a design change that no save announced gets noticed.
        $kicked = PreviewRefresher::kickThrottled();

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
                // Whether to offer the delete control at all — the client has no
                // view of entry permissions.
                'can_delete' => $user->can('delete', $entry),
            ])
            /*
             * A template is copied on insert, so nothing left in a page says it
             * came from here — there is nothing to scan for. What it is made of
             * answers instead: it is offered while every section in it is a design
             * the site already uses. Only when the site asks for a narrowed
             * library, and never to a super admin.
             */
            ->filter(fn ($template) => LibraryAccess::allowsSections($template['sections']))
            ->map(fn ($template) => $template + ['count' => count($template['sections'])])
            ->sortBy('title', SORT_NATURAL | SORT_FLAG_CASE)
            ->values()
            ->all();

        return response()->json([
            'templates' => $templates,
            // See SavedSectionsController::index — the panel asks again while
            // pictures are still being taken.
            'running' => $kicked || Cache::get('sve-previews:running', false),
        ]);
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
                // Control Panel values turned into storage values — see the
                // method's docblock for why a template saved without this renders
                // with empty picture frames.
                static::field() => SavedSectionsController::processed($sections, static::collection()),
            ]);

        // Its screenshot is not asked for here: saving fires EntrySaved, and the
        // RefreshPreviews listener takes it from there — the same path a template
        // edited later in the Control Panel goes through.
        $entry->save();

        return response()->json([
            'id' => $entry->id(),
            'title' => $entry->value('title'),
            'count' => count($sections),
        ]);
    }

    /**
     * Deletes a template.
     *
     * No usage list to warn about: a template is copied onto a page, never
     * referenced, so the pages built from one keep their sections and never learn
     * that the stencil is gone.
     */
    public function destroy(Request $request, string $id)
    {
        $user = User::current();

        abort_unless($user, 403);

        $entry = Entry::find($id);

        abort_unless($entry && $entry->collectionHandle() === static::collection(), 404);
        abort_unless($user->can('delete', $entry), 403);

        app(SavedSectionPreview::class)->forget($entry);

        $entry->delete();

        return response()->json(['ok' => true]);
    }

    /** The raw sections stored on a template entry. */
    protected static function sectionsOf(\Statamic\Contracts\Entries\Entry $entry): array
    {
        $sections = $entry->value(static::field());

        return is_array($sections) ? array_values($sections) : [];
    }
}
