<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use MarioHamann\StatamicVisualEditor\GitSync;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use MarioHamann\StatamicVisualEditor\SectionField;
use MarioHamann\StatamicVisualEditor\SectionList;
use MarioHamann\StatamicVisualEditor\SectionTypeMaker;
use MarioHamann\StatamicVisualEditor\SectionTypes;
use MarioHamann\StatamicVisualEditor\SectionUsage;
use MarioHamann\StatamicVisualEditor\SetPreviewImages;
use Statamic\Facades\User;
use Statamic\Fields\Blueprint;

/**
 * Deleting a section *type* — the set itself, out of the page-builder fieldset.
 *
 * This is a different animal from deleting a saved section or a template. Those
 * are content: an entry goes, and the site carries on. A section type is part of
 * how the site is built. Removing it edits the fieldset YAML that lives in the
 * repository, so it is a change a developer would otherwise make in the Fieldsets
 * screen and commit — which is exactly why it is gated on `configure fields`,
 * the same permission Statamic puts on that screen. An editor never sees the
 * control.
 *
 * What it deliberately does NOT touch by default: the imported fieldset the set
 * pulls its fields from (`resources/fieldsets/hero/style_1.yaml`), the Antlers
 * partial that renders it, and the set's preview image. Any of the three can be
 * shared, and an orphan file is a harmless thing to clean up by hand — an
 * over-eager delete is not. `delete_files=1` is the explicit ask for that
 * cleanup ({@see destroy()}): the partial goes, the fieldset goes when nothing
 * else imports it, and the preview image stays.
 *
 * Every request may say which page it comes from — `blueprint` (its fully
 * qualified handle), `collection` and `sections_field` ({@see
 * SectionField::blueprintFor()}): the section types are that blueprint's
 * sections field's, written in that field's own file. Without them, the pages
 * collection's page builder — the site's `page_sections` list.
 */
class SectionTypesController
{
    /** The blueprint of the page the request comes from. */
    protected static function blueprint(Request $request): ?Blueprint
    {
        return SectionField::blueprintFor(
            (string) $request->input('blueprint', ''),
            (string) $request->input('collection', ''),
            (string) $request->input('sections_field', ''),
        );
    }

    /** Where that page's section types are written. */
    protected static function list(Request $request): SectionList
    {
        $blueprint = static::blueprint($request);

        return $blueprint ? SectionField::listOf($blueprint) : SectionList::fallback();
    }

    /**
     * The site's section types, with preview images as they are on disk right now.
     *
     * The library reads the types from the map handed to the page at load, which
     * is a snapshot: regenerate a preview and the panel keeps showing the picture
     * the page was opened with, however current the file on disk is. Opening the
     * Page tab asks here instead, so what you see is what a screenshot of the
     * section would look like today.
     *
     * `running` is only true if a screenshot job is already going — started by a
     * save (theme, fieldset, saved section) or by `sve:previews --watch`. Opening
     * this list must not start a job: that rebuilt the picker and the Theme
     * Settings iframe every 1.5s.
     */
    public function index(Request $request)
    {
        abort_unless(User::current(), 403);

        // The map is memoised per request and was resolved before the YAML the
        // generator may have just rewritten.
        SetPreviewImages::flush();

        $blueprint = static::blueprint($request);

        return response()->json([
            'types' => SectionTypes::map($blueprint),
            // Every group, empty ones too — the map only names the groups its sets sit in.
            'groups' => SectionTypes::groups($blueprint),
            // The page's sections field, so the client can tell whose list this is.
            'field' => $blueprint ? SectionField::of($blueprint) : SectionField::fallback(),
            'running' => Cache::get('sve-previews:running', false),
        ]);
    }

    /**
     * Makes a new, empty group in the page builder. Same gate as making a
     * section: it edits the fieldset in the repository. Answers with the group
     * and the full list, so the dialog can select it and the library can show
     * its chip.
     */
    public function storeGroup(Request $request)
    {
        abort_unless(User::current()?->can('configure fields'), 403);

        $display = mb_substr(trim((string) $request->input('display', '')), 0, 60);

        abort_if($display === '', 400);

        if (SectionTypeMaker::slug($display) === null) {
            return response()->json(['error' => 'bad_name'], 422);
        }

        $made = SectionTypeMaker::createGroup(static::list($request), $display);

        if ($made === null) {
            return response()->json(['error' => 'failed'], 422);
        }

        return response()->json([
            'ok' => true,
            'group' => $made,
            'groups' => SectionTypes::groups(static::blueprint($request)),
        ]);
    }

    /**
     * Makes a new section type: fields, markup and registration in one go.
     *
     * Gated on `configure fields` for the same reason deleting is — this writes
     * files into the repository that a developer would otherwise add by hand
     * and commit. What comes back is the new handle, so the editor can open the
     * section's template straight away, and a fresh type map, because the
     * picker's list came from the page render and is now one type out of date.
     *
     * The new set cannot be *inserted* until the page reloads: a Replicator's
     * sets come from the blueprint the publish form was built with, and that
     * blueprint is a snapshot from page load. Saying so is the caller's job.
     */
    public function store(Request $request)
    {
        abort_unless(User::current()?->can('configure fields'), 403);

        $display = trim((string) $request->input('display', ''));
        $static = $request->boolean('static');

        // A static section has no group to choose: they share one, made the
        // first time one is.
        $group = $static ? SectionTypeMaker::STATIC_GROUP : trim((string) $request->input('group', ''));

        abort_if($display === '' || $group === '', 400);

        // A name that survives slugging is the one real precondition, and it is
        // worth its own answer: "Ny sektion" is a fine name, "???" is not, and
        // a 400 tells the author nothing about which of the two they typed.
        if (SectionTypeMaker::slug($display) === null) {
            return response()->json(['error' => 'bad_name'], 422);
        }

        $made = SectionTypeMaker::create(
            static::list($request),
            $group,
            mb_substr($display, 0, 60),
            trim((string) $request->input('icon', '')) ?: null,
            $static,
            $static && $request->boolean('hidden'),
        );

        if ($made === null) {
            return response()->json(['error' => 'failed'], 422);
        }

        return response()->json([
            'ok' => true,
            'section' => $made,
            'section_types' => SectionTypes::map(static::blueprint($request)),
        ]);
    }

    /**
     * Changes one set: kept out of the picker or let back in (`hidden`), or
     * given fields (`fields`) — the fieldset a static section was made
     * without. Same gate as making one: both edit the fieldset in the
     * repository.
     */
    public function update(Request $request)
    {
        abort_unless(User::current()?->can('configure fields'), 403);

        $handle = trim((string) $request->input('handle', ''));

        abort_if($handle === '', 400);

        $section = null;

        if ($request->has('hidden')) {
            $section = SectionTypeMaker::setHidden(static::list($request), $handle, $request->boolean('hidden'));

            if ($section === null) {
                return response()->json(['error' => 'not_found'], 404);
            }
        }

        if ($request->boolean('fields')) {
            $section = SectionTypeMaker::addFields(static::list($request), $handle);

            if ($section === null) {
                return response()->json(['error' => 'failed'], 422);
            }
        }

        abort_if($section === null, 400);

        return response()->json([
            'ok' => true,
            'section' => $section,
            'section_types' => SectionTypes::map(static::blueprint($request)),
        ]);
    }

    /** Where a section type is in use, asked before anything is deleted. */
    public function usage(Request $request)
    {
        abort_unless(User::current()?->can('configure fields'), 403);

        $handle = static::handleOrFail($request);

        return response()->json([
            'handle' => $handle,
            'usages' => SectionUsage::ofType($handle),
        ]);
    }

    /**
     * Deletes the section type.
     *
     * Pages holding one are refused unless the caller says, in so many words,
     * that those sections go too (`remove_usages`) — the dialog asks first and
     * lists them, and this is the same gate on the server, so a stray request
     * can't quietly strip sections off live pages.
     *
     * `delete_files` is the second explicit ask: the set's Antlers partial and
     * its imported fieldset leave the disk with it. The partial is the set's
     * alone — the page loop renders `partials/page_sections/{handle}` and
     * nothing else points there — but a fieldset can be imported from more
     * than one place, so it only goes when nothing left on the site imports
     * it. Without the flag both files stay, as they always have.
     */
    public function destroy(Request $request)
    {
        $user = User::current();

        abort_unless($user?->can('configure fields'), 403);

        $handle = static::handleOrFail($request);
        $usages = SectionUsage::ofType($handle);

        if ($usages && ! $request->boolean('remove_usages')) {
            return response()->json([
                'error' => 'in_use',
                'usages' => $usages,
            ], 409);
        }

        // Every page it sits on has to be editable, or the type would go and the
        // pages we couldn't touch would be left with rows of a set that no longer
        // exists — which the Replicator cannot render.
        abort_unless(SectionUsage::allEditable($usages, $user), 403);

        // What the set imports is read before the set leaves the registry —
        // afterwards there is no row left to read it from.
        $deleteFiles = $request->boolean('delete_files');
        $imports = $deleteFiles ? static::setImports(static::list($request), $handle) : [];

        // The set leaves the fieldset first. If that fails there is nothing to
        // clean up after, and the pages still render what they have.
        abort_unless(static::removeSet(static::list($request), $handle), 404);

        $deletedFiles = $deleteFiles ? static::deleteTypeFiles($handle, $imports) : [];

        GitSync::after('section type removed '.$handle.($deletedFiles ? ' with its files' : ''));

        $removed = $usages ? SectionUsage::stripType($handle) : 0;

        return response()->json([
            'ok' => true,
            'removed_from' => $removed,
            'deleted_files' => $deletedFiles,
            // The picker's list came from the page render and is now a type out
            // of date. Hand back the fresh one rather than making it reload.
            'section_types' => SectionTypes::map(static::blueprint($request)),
        ]);
    }

    /** The set handle from the query — never a path segment: handles hold slashes. */
    protected static function handleOrFail(Request $request): string
    {
        $handle = (string) $request->query('handle');

        abort_if($handle === '', 400);

        return $handle;
    }

    /**
     * Takes the set out of the page builder's list and saves it.
     *
     * The sets are grouped, and which group a set sits in is the site's business,
     * so every group is checked rather than assuming one. Returns false when the
     * handle isn't there — the caller turns that into a 404 instead of writing an
     * unchanged file. Read from the file, not the repository's copy
     * ({@see SectionList}).
     */
    protected static function removeSet(SectionList $list, string $handle): bool
    {
        $contents = $list->read();
        $groups = $contents === null ? null : $list->sets($contents);

        if ($groups === null) {
            return false;
        }

        $found = false;

        foreach (array_keys($groups) as $group) {
            if (! isset($groups[$group]['sets'][$handle])) {
                continue;
            }

            unset($groups[$group]['sets'][$handle]);
            $found = true;
        }

        if (! $found) {
            return false;
        }

        $list->save($list->withSets($contents, $groups));

        // The image map is built by walking every fieldset once per request and
        // cached; the set it just described is gone.
        SetPreviewImages::flush();

        return true;
    }

    /** The fieldset handles the set's rows import, read off the registry. */
    protected static function setImports(SectionList $list, string $handle): array
    {
        $contents = $list->read();
        $groups = $contents === null ? null : $list->sets($contents);
        $imports = [];

        foreach ($groups ?? [] as $group) {
            foreach ($group['sets'][$handle]['fields'] ?? [] as $row) {
                if (is_array($row) && is_string($row['import'] ?? null)) {
                    $imports[] = $row['import'];
                }
            }
        }

        return array_values(array_unique($imports));
    }

    /**
     * The set's own files, off the disk — only on the explicit ask.
     *
     * The partial goes as it stands: `partials/page_sections/{handle}` is the
     * page loop's convention, and the handle is the only thing that renders
     * there. Each imported fieldset goes only when no fieldset or blueprint
     * left on the site imports it — the registry row naming it is already
     * gone, so what remains is the truth. Both paths are pinned inside their
     * own directory: the handle is request input, and `..` in it must not
     * reach past the folder the convention names. A file already missing is
     * not an error — the ask was "make it gone".
     */
    protected static function deleteTypeFiles(string $handle, array $imports): array
    {
        $deleted = [];

        if (static::deleteInside('views/partials/page_sections', $handle.'.antlers.html')) {
            $deleted[] = 'resources/views/partials/page_sections/'.$handle.'.antlers.html';
        }

        foreach ($imports as $import) {
            if (static::fieldsetStillImported($import)) {
                continue;
            }

            $file = str_replace('.', '/', $import).'.yaml';

            if (static::deleteInside('fieldsets', $file)) {
                $deleted[] = 'resources/fieldsets/'.$file;
            }
        }

        return $deleted;
    }

    /** Unlinks a file inside the given resources folder, refusing anything that resolves outside it. */
    protected static function deleteInside(string $dir, string $relative): bool
    {
        $real = realpath(resource_path($dir.'/'.$relative));
        $base = realpath(resource_path($dir));

        if ($real === false || $base === false || ! str_starts_with($real, $base.DIRECTORY_SEPARATOR)) {
            return false;
        }

        return @unlink($real);
    }

    /** Whether any fieldset or blueprint on the site still imports the handle. */
    protected static function fieldsetStillImported(string $import): bool
    {
        $pattern = '/^\s*(?:-\s+)?import:\s*[\'"]?'.preg_quote($import, '/').'[\'"]?\s*$/m';

        foreach ([resource_path('fieldsets'), resource_path('blueprints')] as $dir) {
            if (! is_dir($dir)) {
                continue;
            }

            foreach (File::allFiles($dir) as $file) {
                if ($file->getExtension() === 'yaml' && preg_match($pattern, $file->getContents())) {
                    return true;
                }
            }
        }

        return false;
    }
}
