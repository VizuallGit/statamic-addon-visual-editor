<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\PreviewRefresher;
use MarioHamann\StatamicVisualEditor\SectionTypes;
use MarioHamann\StatamicVisualEditor\SectionUsage;
use MarioHamann\StatamicVisualEditor\SetPreviewImages;
use Statamic\Facades\Fieldset;
use Statamic\Facades\User;
use Statamic\Facades\YAML;

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
 * What it deliberately does NOT touch: the imported fieldset the set pulls its
 * fields from (`resources/fieldsets/hero/style_1.yaml`), the Antlers partial that
 * renders it, and the set's preview image. Any of the three can be shared, and
 * an orphan file is a harmless thing to clean up by hand — an over-eager delete
 * is not.
 */
class SectionTypesController
{
    /** The page-builder fieldset whose sets are the site's section types. */
    protected static function fieldsetHandle(): string
    {
        return config('statamic-visual-editor.previews.field', 'page_sections');
    }

    /** A fieldset's contents as they are on disk, or null when it has no file. */
    protected static function readFieldset(string $handle): ?array
    {
        $path = Fieldset::directory().'/'.str_replace('.', '/', $handle).'.yaml';

        return is_file($path) ? (YAML::file($path)->parse() ?: []) : null;
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
     * It also asks for a refresh while it's here. Editing an Antlers partial fires
     * no event anybody can listen for — the file simply changes — so opening the
     * library is the moment to notice, and `running` tells the panel to keep
     * asking until the new pictures have landed.
     */
    public function index(Request $request)
    {
        abort_unless(User::current(), 403);

        $kicked = PreviewRefresher::kickThrottled();

        // The map is memoised per request and was resolved before the YAML the
        // generator may have just rewritten.
        SetPreviewImages::flush();

        return response()->json([
            'types' => SectionTypes::map(),
            'running' => $kicked || Cache::get('sve-previews:running', false),
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

        // The set leaves the fieldset first. If that fails there is nothing to
        // clean up after, and the pages still render what they have.
        abort_unless(static::removeSet($handle), 404);

        $removed = $usages ? SectionUsage::stripType($handle) : 0;

        return response()->json([
            'ok' => true,
            'removed_from' => $removed,
            // The picker's list came from the page render and is now a type out
            // of date. Hand back the fresh one rather than making it reload.
            'section_types' => SectionTypes::map(),
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
     * Takes the set out of the page-builder fieldset and saves it.
     *
     * The sets are grouped, and which group a set sits in is the site's business,
     * so every group is checked rather than assuming one. Returns false when the
     * handle isn't there — the caller turns that into a 404 instead of writing an
     * unchanged file.
     */
    protected static function removeSet(string $handle): bool
    {
        $fieldsetHandle = static::fieldsetHandle();

        // From the file, not from the repository's copy. That copy is the one this
        // addon injects `_visual_id` into at runtime — in memory on purpose, so
        // imported fieldsets are not expanded onto disk — and saving it writes
        // those injected fields into the author's YAML for good.
        $contents = static::readFieldset($fieldsetHandle);

        if ($contents === null) {
            return false;
        }

        $index = static::fieldIndex($contents, $fieldsetHandle);

        if ($index === null) {
            return false;
        }

        $groups = $contents['fields'][$index]['field']['sets'] ?? [];
        $found = false;

        foreach (array_keys($groups) as $group) {
            if (! isset($groups[$group]['sets'][$handle])) {
                continue;
            }

            unset($contents['fields'][$index]['field']['sets'][$group]['sets'][$handle]);
            $found = true;
        }

        if (! $found) {
            return false;
        }

        Fieldset::make($fieldsetHandle)->setContents($contents)->save();

        // The image map is built by walking every fieldset once per request and
        // cached; the set it just described is gone.
        SetPreviewImages::flush();

        return true;
    }

    /** The index of the page-builder field within the fieldset's own fields. */
    protected static function fieldIndex(array $contents, string $handle): ?int
    {
        foreach (($contents['fields'] ?? []) as $index => $field) {
            if (($field['handle'] ?? null) === $handle && isset($field['field']['sets'])) {
                return $index;
            }
        }

        // A fieldset holding one Replicator whose handle differs from its own.
        foreach (($contents['fields'] ?? []) as $index => $field) {
            if (isset($field['field']['sets'])) {
                return $index;
            }
        }

        return null;
    }
}
