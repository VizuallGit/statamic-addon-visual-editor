<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
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

    /**
     * Turns Control Panel values into storage values, the way an ordinary entry
     * save does.
     *
     * The section arrives as the publish form holds it, and the two shapes are not
     * the same: an assets field carries `assets::photo.jpg` in the form and
     * `photo.jpg` on disk. Writing the form's shape straight into an entry — which
     * `Entry::data()` does, since it never sees a fieldtype — leaves a value
     * nothing can resolve afterwards. The section then renders with no image at
     * all, which is what a preview of it shows: an empty frame.
     *
     * Running it through the page-builder field is the same pass Statamic makes on
     * every save, and it recurses through the sets, so every fieldtype gets its
     * own say rather than this having to know about assets in particular.
     */
    public static function processed(array $sections, string $collection): array
    {
        $field = Collection::findByHandle($collection)
            ?->entryBlueprint()
            ?->field(static::field());

        if (! $field) {
            return $sections;
        }

        try {
            $value = $field->setValue($sections)->process()->value();
        } catch (\Throwable $e) {
            // A missing asset makes Statamic throw here. Keeping the raw values is
            // better than refusing the save: the section is still saved, and the
            // worst of it is a preview drawn without the picture that has gone.
            return $sections;
        }

        return is_array($value) ? $value : $sections;
    }

    /**
     * Storage values → Control Panel values, so a custom insert can be dropped
     * into the publish form. The inverse of processed().
     *
     * Saved YAML has `id` (not `_id`) and asset paths as stored on disk. The
     * Replicator keys field meta by `_id`; without this pass the sidebar has
     * values it cannot render.
     */
    public static function forPublishForm(?array $section, string $collection): ?array
    {
        if (! $section) {
            return $section;
        }

        $field = Collection::findByHandle($collection)
            ?->entryBlueprint()
            ?->field(static::field());

        if (! $field) {
            return $section;
        }

        try {
            $value = $field->fieldtype()->preProcess([$section]);
        } catch (\Throwable $e) {
            return $section;
        }

        return is_array($value) && isset($value[0]) && is_array($value[0])
            ? $value[0]
            : $section;
    }

    public function index(Request $request)
    {
        $user = User::current();

        abort_unless($user, 403);

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
                // Publish-form shape (not storage YAML), so a custom copy can be
                // dropped into the CP Replicator without a second round-trip.
                'section_data' => static::forPublishForm(static::sectionOf($entry), static::collection()),
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
        // Stable ids on every set row — preview `scope="{{ id }}"` on blocks
        // needs them; without nested ids Antlers cascades to the section id and
        // inline edit / focus resolve the wrong path.
        $section = static::ensureRowIds($section);

        $entry = Entry::make()
            ->collection(static::collection())
            ->locale($site)
            ->slug(Str::slug($data['title']).'-'.Str::lower(Str::random(6)))
            ->published(true)
            ->data([
                'title' => $data['title'],
                'section_type' => $data['section_type'],
                'synced' => (bool) ($data['synced'] ?? false),
                static::field() => static::processed([$section], static::collection()),
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

    /** The raw first section stored on a saved-section entry. */
    protected static function sectionOf(\Statamic\Contracts\Entries\Entry $entry): ?array
    {
        $sections = $entry->value(static::field());

        return is_array($sections) && isset($sections[0]) ? $sections[0] : null;
    }

    /**
     * Every replicator/grid row needs a stable `id` for preview scope attributes.
     */
    protected static function ensureRowIds(mixed $node): mixed
    {
        if (is_array($node)) {
            $isList = array_is_list($node);

            foreach ($node as $key => $value) {
                $node[$key] = static::ensureRowIds($value);
            }

            if (! $isList
                && isset($node['type'])
                && is_string($node['type'])
                && $node['type'] !== ''
                && empty($node['id'])
                && empty($node['_id'])
                && (array_key_exists('enabled', $node) || array_key_exists('blocks', $node) || str_contains($node['type'], '/'))
            ) {
                $node['id'] = Str::lower(Str::random(12));
            }
        }

        return $node;
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

        $entry = static::findOrFail($id);

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

        $entry = static::findOrFail($id);

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

    /** The saved section, or a 404 — never another collection's entry. */
    protected static function findOrFail(string $id): \Statamic\Contracts\Entries\Entry
    {
        $entry = Entry::find($id);

        abort_unless($entry && $entry->collectionHandle() === static::collection(), 404);

        return $entry;
    }

    /** Re-screenshot a saved section on demand — forced, since it was asked for. */
    public function regeneratePreview(Request $request, string $id)
    {
        abort_unless(User::current(), 403);

        $entry = static::findOrFail($id);
        $status = app(SavedSectionPreview::class)->generate($entry, SavedSectionPreview::specFor($entry) ?? [], force: true);

        return response()->json(['ok' => $status === 'ok', 'status' => $status]);
    }
}
