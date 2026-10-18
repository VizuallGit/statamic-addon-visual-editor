<?php

namespace MarioHamann\StatamicVisualEditor\SectionTypeMaker;

use MarioHamann\StatamicVisualEditor\GitSync;
use MarioHamann\StatamicVisualEditor\SectionList;
use MarioHamann\StatamicVisualEditor\SectionTemplate\Locks;
use MarioHamann\StatamicVisualEditor\SectionTypeMaker;
use MarioHamann\StatamicVisualEditor\SetPreviewImages;
use MarioHamann\StatamicVisualEditor\TailwindStore;
use Statamic\Facades\Fieldset;

/**
 * A section type made from another one: "Duplicate as a new section".
 *
 * A section duplicated on the page shares its partial with the original, so
 * a change in the dock is a change to both. The copy made here is a type of
 * its own — its own partial, its own fieldset, its own registration — that
 * starts out as the source and goes its own way from the first keystroke.
 *
 * What is copied: the markup (CSS and JS ride in it, in `style_push` /
 * `script_push`), the Tailwind the dock baked for it (`{{ sve_tw }}` reads
 * by type), the set's own fieldset and the set's config. What is not: the
 * preview image — the set config names a file, and the copy's preview would
 * be written over the original's — and fieldsets the section only imports
 * from elsewhere (`common.settings`): those stay shared, as they were.
 *
 * Written in the order `SectionTypeMaker::create` writes: the new files
 * first, the registration — the one edit to a file the whole site reads —
 * last, right after the source in its group.
 */
final class Copy
{
    /**
     * @return array{handle: string, display: string, group: string, view: string, icon: ?string, fieldset: ?string, static: bool, hidden: bool}|string
     *         the new set, or why not: `not_found`, `bad_name`, `failed`
     */
    public static function run(SectionList $list, string $source, string $display): array|string
    {
        $contents = $list->read();
        $groups = $contents === null ? null : $list->sets($contents);

        if ($groups === null) {
            return 'failed';
        }

        $group = SectionTypeMaker::groupOf($groups, $source);
        $sourceView = resource_path('views/'.Names::VIEW_FOLDER.'/'.$source.'.antlers.html');

        if ($group === null || ! is_file($sourceView)) {
            return 'not_found';
        }

        $slug = Names::slug($display);

        if ($slug === null) {
            return 'bad_name';
        }

        $set = $groups[$group]['sets'][$source];
        $own = static::ownImport($set, $source);
        $viewFolder = str_contains($source, '/') ? dirname($source) : Names::viewFolderForGroup($groups, $group);
        $fieldsetFolder = $own !== null && str_contains($own, '.')
            ? substr($own, 0, (int) strrpos($own, '.'))
            : Names::fieldsetFolderForGroup($groups, $group);
        $name = Names::freeName($groups, $viewFolder, str_replace('.', '/', $fieldsetFolder), $slug);
        $handle = $viewFolder.'/'.$name;
        $imported = $fieldsetFolder.'.'.$name;

        if ($own !== null && ! static::copyFieldset($own, $imported, str_replace('.', '/', $fieldsetFolder), $name, $display)) {
            return 'failed';
        }

        $view = Names::viewPath($viewFolder, $name);

        if (! is_dir(dirname($view)) && ! @mkdir(dirname($view), 0755, true) && ! is_dir(dirname($view))) {
            return 'failed';
        }

        if (file_put_contents($view, static::unlocked((string) file_get_contents($sourceView), $handle)) === false) {
            return 'failed';
        }

        static::copyTailwind($source, $handle);

        $copy = $set;
        unset($copy['image']);
        $copy['display'] = $display;

        if ($own !== null) {
            $copy['fields'] = array_map(
                fn ($field) => is_array($field) && ($field['import'] ?? null) === $own ? ['import' => $imported] + $field : $field,
                $set['fields']
            );
        }

        $groups[$group]['sets'] = static::after($groups[$group]['sets'], $source, $handle, $copy);
        $list->save($list->withSets($contents, $groups));
        SetPreviewImages::flush();
        GitSync::after('section type copied: '.$source.' → '.$handle);

        // The icon too: the panels are told about the new set before the page
        // reloads, and the type map the CP holds has no icons.
        return SectionTypeMaker::describe($handle, $group, $copy) + [
            'view' => Names::VIEW_FOLDER.'/'.$viewFolder.'/'.$name,
            'icon' => is_string($copy['icon'] ?? null) ? $copy['icon'] : null,
        ];
    }

    /**
     * The fieldset that is the section's own: the import named like the
     * section (`content/tow_column_text` imports `content.tow_column_text`;
     * `featured_section/style_1` imports `featured_sections.style_1`). The
     * folders may differ; the name is what they share. Null when the set
     * imports no such fieldset — static, or fields written inline.
     */
    protected static function ownImport(array $set, string $source): ?string
    {
        $name = basename($source);

        foreach (($set['fields'] ?? []) as $field) {
            $import = is_array($field) ? ($field['import'] ?? null) : null;

            if (is_string($import) && ($import === $name || str_ends_with($import, '.'.$name))) {
                return $import;
            }
        }

        return null;
    }

    /**
     * The source's fieldset as it is on disk, under the copy's name. Read from
     * the file, not the repository: the repository's copy carries the
     * `_visual_id` this addon injects at runtime, and saving it would write
     * that field into the author's YAML.
     */
    protected static function copyFieldset(string $from, string $to, string $folder, string $name, string $display): bool
    {
        $fields = SectionList::fieldset($from)->read();

        if ($fields === null) {
            return false;
        }

        $fields['title'] = $display;
        Fieldset::make($to)->setContents($fields)->save();

        return is_file(Names::fieldsetPath($folder, $name));
    }

    /**
     * The markup, open for writing. The copy is made to be changed: whatever
     * the source's lock said, the copy starts unlocked — as a section made
     * with the plus does.
     */
    protected static function unlocked(string $markup, string $handle): string
    {
        $markup = Locks::stripMarkers($markup);
        $marker = Locks::markerFor(false, $handle);

        return $marker === null ? $markup : $marker."\n".$markup;
    }

    /** The utilities the dock baked for the source, for the copy's `{{ sve_tw }}`. */
    protected static function copyTailwind(string $source, string $handle): void
    {
        $from = TailwindStore::path($source);
        $to = TailwindStore::path($handle);

        if ($from === null || $to === null || ! is_file($from)) {
            return;
        }

        if (! is_dir(dirname($to))) {
            @mkdir(dirname($to), 0755, true);
        }

        @copy($from, $to);
    }

    /** The group's sets with the copy right after its source, so the picker shows them side by side. */
    protected static function after(array $sets, string $source, string $handle, array $copy): array
    {
        $out = [];

        foreach ($sets as $key => $set) {
            $out[$key] = $set;

            if ($key === $source) {
                $out[$handle] = $copy;
            }
        }

        return $out;
    }
}
