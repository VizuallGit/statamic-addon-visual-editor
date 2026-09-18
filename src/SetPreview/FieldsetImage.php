<?php

namespace MarioHamann\StatamicVisualEditor\SetPreview;

use Statamic\Facades\Fieldset;
use Statamic\Facades\YAML;

/**
 * Writes a set's `image:` back into whichever fieldset YAML defines it —
 * read from disk right before writing, never from a copy held in memory.
 * Moved verbatim out of SetPreviewGenerator in WP7d.
 */
final class FieldsetImage
{
    /**
     * Updates the set's `image:` value in whichever fieldset defines it.
     *
     * Read from the file, every time, right before writing — never from the copy
     * this process has been holding. Two things make that essential, and both of
     * them corrupt a fieldset if ignored:
     *
     * A run takes a browser-second per section, so minutes can pass between the
     * moment the sets were read and the moment one is written back. A set added in
     * the Control Panel during that window is not in the copy we hold, and writing
     * it back deletes their work — the page keeps its section, the fieldset no
     * longer has the type, and the whole page-builder field renders empty.
     *
     * And the fieldset repository hands out one cached instance per handle, which
     * this addon mutates at runtime to inject `_visual_id` into imported sets
     * (deliberately in memory only — see InjectVisualIdIntoBlueprint). Saving that
     * instance writes those injected fields into the author's YAML.
     */
    public static function updateImage(string $handle, string $newFilename): void
    {
        $field = config('statamic-visual-editor.previews.field', 'page_sections');
        $handles = collect([$field])
            ->merge(Fieldset::all()->map->handle())
            ->unique()
            ->all();

        foreach ($handles as $fieldsetHandle) {
            $contents = static::readFieldset($fieldsetHandle);

            if ($contents === null || ! static::replaceImage($contents, $handle, $newFilename)) {
                continue;
            }

            Fieldset::make($fieldsetHandle)->setContents($contents)->saveQuietly();

            return;
        }
    }

    /**
     * A fieldset's contents as they are on disk this second, or null if it has no
     * file (a namespaced or addon-provided fieldset, which is not ours to edit).
     */
    protected static function readFieldset(string $handle): ?array
    {
        $path = Fieldset::directory().'/'.str_replace('.', '/', $handle).'.yaml';

        if (! is_file($path)) {
            return null;
        }

        return YAML::file($path)->parse() ?: [];
    }

    /** Recursively finds the set (keyed by $handle) and sets its image. */
    public static function replaceImage(array &$node, string $handle, string $newFilename): bool
    {
        foreach ($node as $key => &$value) {
            if (! is_array($value)) {
                continue;
            }

            if ($key === $handle && (isset($value['fields']) || isset($value['display']))) {
                $value['image'] = $newFilename;

                return true;
            }

            if (static::replaceImage($value, $handle, $newFilename)) {
                return true;
            }
        }

        return false;
    }
}
