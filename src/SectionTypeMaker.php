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
 * A *static* section is the same set with one file fewer: markup and a
 * registration, no fieldset. It is a row on the page like any other — placed,
 * dragged, deleted, saved to the library — with nothing for an editor to fill
 * in. It lives in a group of its own (`static_sections`), made the first time
 * one is. Fields can be added later (`addFields`): the fieldset is written
 * then, and the set imports it — the handle, the rows on every page and the
 * markup stay as they were.
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

    /** The group static sections are registered in; made when the first one is. */
    public const STATIC_GROUP = 'static_sections';

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
     * The markup a static section starts as: the same root every section has,
     * unlocked from the first line — a file made to be written in, with no
     * fields to open instead.
     */
    public static function staticScaffold(): string
    {
        return <<<'ANTLERS'
        {{# sve-unlocked #}}
        <section id="id-{{ id }}" class="[ {{ _class }} ]" data-auto-contrast {{ visual_edit outline_inside="true" section_orderable="true" }}>

        </section>

        ANTLERS;
    }

    /**
     * Writes the files. Returns the new set, or null if any part of it could
     * not be written.
     *
     * Order matters. The fieldset and the partial come first because they are
     * new files that harm nothing if the run stops halfway — the section simply
     * is not registered and nobody sees it. Registration is last because it is
     * the one step that edits a file the whole site already depends on.
     *
     * Static: no fieldset, `static: true` on the set, and its group is made
     * if it is not there yet. `hidden` writes Statamic's own `hide` — the set
     * is kept out of the picker, so an editor cannot insert it; a super admin
     * still can, from the library.
     *
     * @return array{handle: string, display: string, group: string, view: string, fieldset: ?string, static: bool, hidden: bool}|null
     */
    public static function create(
        string $fieldsetHandle,
        string $group,
        string $display,
        ?string $icon = null,
        bool $static = false,
        bool $hidden = false
    ): ?array {
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
            if (! $static) {
                return null;
            }

            $groups[$group] = [
                'display' => __('sve::messages.static_sections_group'),
                'sets' => [],
            ];
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

        if (! $static) {
            // The fields the set imports. Empty to start with: the fieldset
            // screen — or the panel — is where fields get added, and a set
            // importing a fieldset that does not exist yet is a broken set.
            if (! static::writeFieldset($imported, $fieldsetFolder, $name, $display)) {
                return null;
            }
        }

        $view = Names::viewPath($viewFolder, $name);
        $dir = dirname($view);

        if (! is_dir($dir) && ! @mkdir($dir, 0755, true) && ! is_dir($dir)) {
            return null;
        }

        if (file_put_contents($view, $static ? static::staticScaffold() : static::scaffold()) === false) {
            return null;
        }

        GitSync::after('new section type');

        $set = ['display' => $display];

        if (is_string($icon) && $icon !== '') {
            $set['icon'] = $icon;
        }

        if ($static) {
            $set['static'] = true;

            if ($hidden) {
                $set['hide'] = true;
            }

            $set['fields'] = [];
        } else {
            $set['fields'] = [['import' => $imported]];
        }

        $groups[$group]['sets'][$handle] = $set;
        $contents['fields'][$index]['field']['sets'] = $groups;

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
            'hidden' => $static && $hidden,
        ];
    }

    /**
     * Keeps a set out of the picker, or lets it back in — Statamic's own
     * `hide`, so the native picker and the library agree. Returns the set as
     * it is now, or null when there is no such set.
     *
     * @return array{handle: string, display: string, group: string, fieldset: ?string, static: bool, hidden: bool}|null
     */
    public static function setHidden(string $fieldsetHandle, string $handle, bool $hidden): ?array
    {
        return static::editSet($fieldsetHandle, $handle, function (array $set) use ($hidden) {
            if ($hidden) {
                $set['hide'] = true;
            } else {
                unset($set['hide']);
            }

            return $set;
        }, 'section type '.($hidden ? 'hidden ' : 'shown ').$handle);
    }

    /**
     * Gives a static section fields: a fieldset of its own, imported by the
     * set from now on. Nothing else moves — the handle, the markup and every
     * row already on a page stay as they are, which is the whole point of a
     * static section being an ordinary set.
     *
     * A set that already has fields is returned as it is. A fieldset file
     * already on disk under that name is imported, not written over: it is
     * somebody's fields.
     *
     * @return array{handle: string, display: string, group: string, fieldset: ?string, static: bool, hidden: bool}|null
     */
    public static function addFields(string $fieldsetHandle, string $handle): ?array
    {
        $contents = static::readFieldset($fieldsetHandle);
        $index = $contents === null ? null : static::fieldIndex($contents, $fieldsetHandle);

        if ($index === null) {
            return null;
        }

        $groups = $contents['fields'][$index]['field']['sets'] ?? [];
        $group = static::groupOf($groups, $handle);

        if ($group === null) {
            return null;
        }

        $set = $groups[$group]['sets'][$handle];

        if (! empty($set['fields'] ?? [])) {
            return static::describe($handle, $group, $set);
        }

        $name = basename($handle);
        $fieldsetFolder = str_contains($handle, '/')
            ? Names::fieldsetFolderForGroup($groups, $group)
            : $group;
        $imported = $fieldsetFolder.'.'.$name;

        if (! is_file(Names::fieldsetPath($fieldsetFolder, $name))
            && ! static::writeFieldset($imported, $fieldsetFolder, $name, (string) ($set['display'] ?? $name))) {
            return null;
        }

        return static::editSet($fieldsetHandle, $handle, function (array $set) use ($imported) {
            unset($set['static']);
            $set['fields'] = [['import' => $imported]];

            return $set;
        }, 'section type fields '.$handle);
    }

    /** Writes an empty fieldset and checks it landed. */
    protected static function writeFieldset(string $imported, string $folder, string $name, string $display): bool
    {
        Fieldset::make($imported)->setContents([
            'title' => $display,
            'fields' => [],
        ])->save();

        return is_file(Names::fieldsetPath($folder, $name));
    }

    /**
     * One set in the page-builder fieldset, rewritten by `$edit` and saved.
     *
     * @param  callable(array): array  $edit
     * @return array{handle: string, display: string, group: string, fieldset: ?string, static: bool, hidden: bool}|null
     */
    protected static function editSet(string $fieldsetHandle, string $handle, callable $edit, string $commit): ?array
    {
        $contents = static::readFieldset($fieldsetHandle);
        $index = $contents === null ? null : static::fieldIndex($contents, $fieldsetHandle);

        if ($index === null) {
            return null;
        }

        $groups = $contents['fields'][$index]['field']['sets'] ?? [];
        $group = static::groupOf($groups, $handle);

        if ($group === null) {
            return null;
        }

        $set = $edit($groups[$group]['sets'][$handle]);
        $contents['fields'][$index]['field']['sets'][$group]['sets'][$handle] = $set;

        Fieldset::make($fieldsetHandle)->setContents($contents)->save();
        SetPreviewImages::flush();
        GitSync::after($commit);

        return static::describe($handle, $group, $set);
    }

    /** The group a set handle sits in, or null. Every group is checked: which one is the site's business. */
    protected static function groupOf(array $groups, string $handle): ?string
    {
        foreach ($groups as $key => $group) {
            if (isset($group['sets'][$handle]) && is_array($group['sets'][$handle])) {
                return (string) $key;
            }
        }

        return null;
    }

    /**
     * @return array{handle: string, display: string, group: string, fieldset: ?string, static: bool, hidden: bool}
     */
    protected static function describe(string $handle, string $group, array $set): array
    {
        $fieldset = null;

        foreach (($set['fields'] ?? []) as $field) {
            if (is_array($field) && is_string($field['import'] ?? null) && $field['import'] !== '') {
                $fieldset = $field['import'];

                break;
            }
        }

        return [
            'handle' => $handle,
            'display' => (string) ($set['display'] ?? $handle),
            'group' => $group,
            'fieldset' => $fieldset,
            'static' => ($set['static'] ?? false) === true,
            'hidden' => ($set['hide'] ?? false) === true,
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
