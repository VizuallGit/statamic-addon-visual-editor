<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SavedSectionsController\Rows;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SavedSectionsController\Store;
use MarioHamann\StatamicVisualEditor\LibraryAccess;
use MarioHamann\StatamicVisualEditor\SavedSectionPreview;
use MarioHamann\StatamicVisualEditor\SectionUsage;
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
 *
 * The controller keeps the endpoints; row shaping lives in
 * `SavedSectionsController\Rows` and the lookup in
 * `SavedSectionsController\Store`. Split in WP7d, code moved verbatim.
 */
class SavedSectionsController
{
    public function index(Request $request)
    {
        $user = User::current();

        abort_unless($user, 403);

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        $sections = Entry::query()
            ->where('collection', Store::collection())
            ->where('site', $site)
            ->get()
            ->map(fn ($entry) => [
                'id' => $entry->id(),
                'title' => $entry->value('title'),
                'section_type' => $entry->value('section_type'),
                'synced' => (bool) $entry->value('synced'),
                'preview_url' => optional($entry->augmentedValue('preview_image')->value())->url(),
                // Publish-form shape (not storage YAML), so a custom copy can be
                // dropped into the CP Replicator without a second round-trip.
                'section_data' => Rows::forPublishForm(Rows::sectionOf($entry), Store::collection()),
                // Whether to offer the delete control at all. Decided here rather
                // than in the browser: the client has no view of entry permissions.
                'can_delete' => $user->can('delete', $entry),
            ])
            /*
             * Narrowed to what the site already uses, when the site asks for that
             * and a super admin is not the one asking. A synced section answers
             * for itself — pages reference it by id, so the scan saw it. An
             * unsynced one is copied on insert and leaves no trace, so its own
             * section type answers instead: offered while the site uses that
             * design somewhere.
             */
            ->filter(fn ($section) => $section['synced']
                ? LibraryAccess::allowsGlobal((string) $section['id'])
                : LibraryAccess::allowsType((string) $section['section_type']))
            ->values()
            ->all();

        return response()->json([
            'sections' => $sections,
            'running' => Cache::get('sve-previews:running', false),
        ]);
    }

    public function store(Request $request)
    {
        $user = User::current();

        abort_unless($user, 403);
        abort_unless(Collection::findByHandle(Store::collection()), 404);

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
        // Stable ids on every set row — preview `scope="{{ id }}"` on blocks
        // needs them; without nested ids Antlers cascades to the section id and
        // inline edit / focus resolve the wrong path.
        $section = Rows::ensureRowIds($section);

        $entry = Entry::make()
            ->collection(Store::collection())
            ->locale($site)
            ->slug(Str::slug($data['title']).'-'.Str::lower(Str::random(6)))
            ->published(true)
            ->data([
                'title' => $data['title'],
                'section_type' => $data['section_type'],
                'synced' => (bool) ($data['synced'] ?? false),
                Rows::field() => Rows::processed([$section], Store::collection()),
            ]);

        // Its screenshot is not asked for here: saving fires EntrySaved, and the
        // RefreshPreviews listener takes it from there. One path for a section
        // created from the picker and one edited in the Control Panel afterwards,
        // so neither can be the one that works.
        $entry->save();

        return response()->json([
            'id' => $entry->id(),
            'title' => $entry->value('title'),
        ]);
    }

    /**
     * Where this saved section is in use, asked before anything is deleted.
     *
     * Only a synced one can appear here — a custom section is copied on insert,
     * so the copies are the page's own and deleting the library entry leaves them
     * standing. The list is what the confirm dialog shows.
     */
    public function usage(Request $request, string $id)
    {
        abort_unless(User::current(), 403);

        $entry = Store::findOrFail($id);

        return response()->json([
            'title' => $entry->value('title'),
            'usages' => SectionUsage::of($id),
        ]);
    }

    /**
     * Deletes the saved section.
     *
     * A synced section that pages point at is refused unless the caller says, in
     * so many words, that those references go too (`remove_usages`) — the dialog
     * asks first and lists them, and this is the same gate on the server, so a
     * stray request can't quietly empty sections off live pages.
     */
    public function destroy(Request $request, string $id)
    {
        $user = User::current();

        abort_unless($user, 403);

        $entry = Store::findOrFail($id);

        abort_unless($user->can('delete', $entry), 403);

        $usages = SectionUsage::of($id);

        if ($usages && ! $request->boolean('remove_usages')) {
            return response()->json([
                'error' => 'in_use',
                'usages' => $usages,
            ], 409);
        }

        // Every page it sits on has to be editable, or the delete would leave the
        // section gone and a dead reference behind on the page we couldn't touch.
        abort_unless(SectionUsage::allEditable($usages, $user), 403);

        $removed = $usages ? SectionUsage::strip($id) : 0;

        app(SavedSectionPreview::class)->forget($entry);

        $entry->delete();

        return response()->json(['ok' => true, 'removed_from' => $removed]);
    }

    /** Re-screenshot a saved section on demand — forced, since it was asked for. */
    public function regeneratePreview(Request $request, string $id)
    {
        abort_unless(User::current(), 403);

        $entry = Store::findOrFail($id);
        $status = app(SavedSectionPreview::class)->generate($entry, SavedSectionPreview::specFor($entry) ?? [], force: true);

        return response()->json(['ok' => $status === 'ok', 'status' => $status]);
    }

    /**
     * Turns Control Panel values into storage values, the way an ordinary entry
     * save does.
     *
     * @see Rows::processed()
     */
    public static function processed(array $sections, string $collection): array
    {
        return Rows::processed($sections, $collection);
    }
}
