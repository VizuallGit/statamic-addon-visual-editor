<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\SectionTypeMaker\Names;
use Statamic\Facades\Fieldset;
use Statamic\Facades\YAML;

/**
 * Making a section *type* — the mirror image of deleting one.
 *
 * A section is three files that have to agree with each other, and the set
 * handle is what ties them together. `custom_section/testimonials` means the
 * fields come from `resources/fieldsets/custom_section/testimonials.yaml` and
 * the markup from `views/partials/page_sections/custom_section/testimonials`,
 * because the page template renders `partials/page_sections/{ type }`. Get the
 * handle right and the other two follow; get it wrong and the section renders
 * nothing with no error to say why.
 *
 * Which is the whole reason this exists. Doing it by hand means three files in
 * three places, and the one anybody forgets is the registration — the set never
 * appears in the picker and the work looks lost. Here the handle is derived
 * once and everything is written from it, or nothing is.
 *
 * Like deleting, this edits YAML that lives in the repository, so it is gated
 * on `configure fields` at the controller — the same permission Statamic puts
 * on the Fieldsets screen. An editor never sees the button.
 *
 * This class keeps the creation itself; naming and paths live in
 * `SectionTypeMaker\Names`. Split in WP7d, code moved verbatim.
 */
class SectionTypeMaker
{
    public const VIEW_FOLDER = Names::VIEW_FOLDER;

    /**
     * The markup a new section starts as.
     *
     * Empty on purpose — an author opens the HTML panel and writes it — but not
     * bare: the wrapper is what makes the section findable in Live Preview.
     * `id-{{ id }}` is the hook the CSS panel scopes its rules to, `_class`
     * carries the classes set per place, and `visual_edit` is what puts the
     * section on the page's outline and lets it be dragged. A section written
     * without them looks broken in the editor for reasons that are nowhere in
     * the file.
     */
    public static function scaffold(): string
    {
        return <<<'ANTLERS'
        <section id="id-{{ id }}" class="{{ _class }}" {{ visual_edit outline_inside="true" section_orderable="true" }}>

        </section>

        ANTLERS;
    }

    /**
     * Writes the three files. Returns the new set handle, or null if any part
     * of it could not be written.
     *
     * Order matters. The fieldset and the partial come first because they are
     * new files that harm nothing if the run stops halfway — the section simply
     * is not registered and nobody sees it. Registration is last because it is
     * the one step that edits a file the whole site already depends on.
     *
     * @return array{handle: string, display: string, group: string, view: string, fieldset: string}|null
     */
    public static function create(string $fieldsetHandle, string $group, string $display, ?string $icon = null, bool $static = false): ?array
    {
        $contents = static::readFieldset($fieldsetHandle);

        if ($contents === null) {
            return null;
        }

        $index = static::fieldIndex($contents, $fieldsetHandle);

        if ($index === null) {
            return null;
        }

        $groups = $contents['fields'][$index]['field']['sets'] ?? [];

        if (! isset($groups[$group])) {
            return null;
        }

        $slug = Names::slug($display);

        if ($slug === null) {
            return null;
        }

        $viewFolder = Names::viewFolderForGroup($groups, $group);
        $fieldsetFolder = Names::fieldsetFolderForGroup($groups, $group);
        $name = Names::freeName($groups, $viewFolder, $fieldsetFolder, $slug);

        $handle = $viewFolder.'/'.$name;
        $imported = $fieldsetFolder.'.'.$name;

        // The fields the set imports. Empty to start with: the fieldset screen
        // — or the panel — is where fields get added, and a set importing a
        // fieldset that does not exist yet is a broken set.
        //
        // A static section has no fields and imports nothing: it is markup the
        // author writes, placed and moved like any other section, with nothing
        // for an editor to fill in. No fieldset file, then — one with no fields
        // would only invite someone to add some.
        if (! $static) {
            Fieldset::make($imported)->setContents([
                'title' => $display,
                'fields' => [],
            ])->save();

            if (! is_file(Names::fieldsetPath($fieldsetFolder, $name))) {
                return null;
            }
        }

        $view = Names::viewPath($viewFolder, $name);
        $dir = dirname($view);

        if (! is_dir($dir) && ! @mkdir($dir, 0755, true) && ! is_dir($dir)) {
            return null;
        }

        if (file_put_contents($view, static::scaffold()) === false) {
            return null;
        }

        GitSync::after('new section type');

        $set = ['display' => $display];

        if (is_string($icon) && $icon !== '') {
            $set['icon'] = $icon;
        }

        // `static: true` is what tells the type map to list a set with no
        // fields — every other empty set is a placeholder nobody finished.
        if ($static) {
            $set['static'] = true;
            $set['fields'] = [];
        } else {
            $set['fields'] = [['import' => $imported]];
        }

        $contents['fields'][$index]['field']['sets'][$group]['sets'][$handle] = $set;

        Fieldset::make($fieldsetHandle)->setContents($contents)->save();

        // The image map is built by walking every fieldset once per request and
        // cached; there is a set in it now that was not there before.
        SetPreviewImages::flush();

        return [
            'handle' => $handle,
            'display' => $display,
            'group' => $group,
            'view' => Names::VIEW_FOLDER.'/'.$viewFolder.'/'.$name,
            'fieldset' => $static ? null : $imported,
            'static' => $static,
        ];
    }

    /**
     * A fieldset's contents as they are on disk, not as the repository holds
     * them. The repository's copy is the one this addon injects `_visual_id`
     * into at runtime — in memory on purpose — and saving that copy writes the
     * injected fields into the author's YAML for good.
     */
    public static function readFieldset(string $handle): ?array
    {
        $path = Fieldset::directory().'/'.str_replace('.', '/', $handle).'.yaml';

        return is_file($path) ? (YAML::file($path)->parse() ?: []) : null;
    }

    /** The index of the page-builder field within the fieldset's own fields. */
    public static function fieldIndex(array $contents, string $handle): ?int
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

    /**
     * A name as typed, turned into the handle segment it has to be.
     *
     * @see Names::slug()
     */
    public static function slug(string $name): ?string
    {
        return Names::slug($name);
    }

    /**
     * The folder a group's *markup* lives in — the set handle's first segment,
     * because the page template renders `partials/page_sections/{ type }`.
     *
     * @see Names::viewFolderForGroup()
     */
    public static function viewFolderForGroup(array $groups, string $group): string
    {
        return Names::viewFolderForGroup($groups, $group);
    }

    /**
     * The folder a group's *fields* live in — which is not always the same word.
     *
     * @see Names::fieldsetFolderForGroup()
     */
    public static function fieldsetFolderForGroup(array $groups, string $group): string
    {
        return Names::fieldsetFolderForGroup($groups, $group);
    }

    /**
     * The first handle in this folder that nothing has claimed.
     *
     * @see Names::freeName()
     */
    public static function freeName(array $groups, string $viewFolder, string $fieldsetFolder, string $slug): string
    {
        return Names::freeName($groups, $viewFolder, $fieldsetFolder, $slug);
    }
}
