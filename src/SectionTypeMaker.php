<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\SectionTypeMaker\Names;
use Statamic\Facades\Fieldset;
use Statamic\Fields\FieldtypeRepository;

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
    public static function scaffold(bool $styled = false): string
    {
        $section = <<<'ANTLERS'
        <section id="id-{{ id }}" class="{{ _class }}" {{ visual_edit outline_inside="true" section_orderable="true" }}>

        </section>

        ANTLERS;

        if (! $styled) {
            return $section;
        }

        // The fieldset came with the site's Style tab, so the markup reads
        // it from the first render: the colour lands on the section, and
        // `responsive_css` writes the padding for every screen size. Without
        // this block the fields would sit in the panel and change nothing.
        return $section.<<<'ANTLERS'

        {{ style_push }}
        <style>
        {{ responsive_css }}
            background-color: {{ bg_color }};
        {{ /responsive_css }}
        </style>
        {{ /style_push }}

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
     * `$list` is where the page builder's sets are written: a {@see SectionList},
     * or a fieldset handle for the site's own list.
     *
     * @return array{handle: string, display: string, group: string, view: string, fieldset: ?string, static: bool, hidden: bool}|null
     */
    public static function create(
        SectionList|string $list,
        string $group,
        string $display,
        ?string $icon = null,
        bool $static = false,
        bool $hidden = false
    ): ?array {
        $list = static::list($list);
        $contents = $list->read();
        $groups = $contents === null ? null : $list->sets($contents);

        if ($groups === null) {
            return null;
        }

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

        $styled = false;

        if (! $static) {
            // The fields the set imports — the site's standard tabs when it
            // has them, otherwise empty. The fieldset screen, or the panel, is
            // where the content fields get added; a set importing a fieldset
            // that does not exist yet is a broken set.
            if (! static::writeFieldset($imported, $fieldsetFolder, $name, $display)) {
                return null;
            }

            $styled = static::startingFields() !== [];
        }

        $view = Names::viewPath($viewFolder, $name);
        $dir = dirname($view);

        if (! is_dir($dir) && ! @mkdir($dir, 0755, true) && ! is_dir($dir)) {
            return null;
        }

        if (file_put_contents($view, $static ? static::staticScaffold() : static::scaffold($styled)) === false) {
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

        $list->save($list->withSets($contents, $groups));

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
     * Makes a new, empty group in the page builder — a tab in the fieldset,
     * with no sections yet — and returns it as `{handle, display}`. Null when
     * the name slugs to nothing. A name already in use gets a numbered
     * handle, the display name stays what was typed.
     */
    public static function createGroup(SectionList|string $list, string $display): ?array
    {
        $list = static::list($list);
        $contents = $list->read();
        $groups = $contents === null ? null : $list->sets($contents);

        if ($groups === null) {
            return null;
        }

        $slug = Names::slug($display);

        if ($slug === null) {
            return null;
        }

        $handle = $slug;

        for ($n = 2; isset($groups[$handle]); $n++) {
            $handle = $slug.'_'.$n;
        }

        $groups[$handle] = [
            'display' => $display,
            'sets' => [],
        ];

        $list->save($list->withSets($contents, $groups));
        SetPreviewImages::flush();

        return ['handle' => $handle, 'display' => $display];
    }

    /**
     * Keeps a set out of the picker, or lets it back in — Statamic's own
     * `hide`, so the native picker and the library agree. Returns the set as
     * it is now, or null when there is no such set.
     *
     * @return array{handle: string, display: string, group: string, fieldset: ?string, static: bool, hidden: bool}|null
     */
    public static function setHidden(SectionList|string $list, string $handle, bool $hidden): ?array
    {
        return static::editSet($list, $handle, function (array $set) use ($hidden) {
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
    public static function addFields(SectionList|string $list, string $handle): ?array
    {
        $list = static::list($list);
        $contents = $list->read();
        $groups = $contents === null ? null : $list->sets($contents);

        if ($groups === null) {
            return null;
        }

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

        return static::editSet($list, $handle, function (array $set) use ($imported) {
            unset($set['static']);
            $set['fields'] = [['import' => $imported]];

            return $set;
        }, 'section type fields '.$handle);
    }

    /** Writes the fieldset — the site's starting tabs, or empty — and checks it landed. */
    protected static function writeFieldset(string $imported, string $folder, string $name, string $display): bool
    {
        Fieldset::make($imported)->setContents([
            'title' => $display,
            'fields' => static::startingFields(),
        ])->save();

        return is_file(Names::fieldsetPath($folder, $name));
    }

    /**
     * The fields a new section starts with: the site's own Content | Style
     * tabs, so a section made in the editor opens in the panel like every
     * section the kit ships with — Content first, then Style with Colors and
     * Spacing as accordions. Each one is an import from the site's `common`
     * fieldset, the same reference the kit's own sections use, so a change
     * to the shared tab reaches new sections too.
     *
     * Read from what the site has, never assumed: a site whose `common`
     * fieldset lacks the two tabs gets an empty fieldset as before, and
     * Colors is only offered where the theme colour picker is installed.
     *
     * @param  array<int, array<string, mixed>>|null  $common  the `common` fieldset's fields; read from the site when null
     * @return array<int, array<string, mixed>>
     */
    public static function startingFields(?array $common = null, ?bool $colorPicker = null): array
    {
        $common ??= Fieldset::find('common')?->contents()['fields'] ?? [];
        $colorPicker ??= static::hasFieldtype('theme_color_picker');

        $has = [];

        foreach ($common as $field) {
            if (is_array($field) && isset($field['handle'])) {
                $has[(string) $field['handle']] = true;
            }
        }

        if (! isset($has['content_tab'], $has['style_tab'])) {
            return [];
        }

        $fields = [
            ['handle' => 'content_tab', 'field' => 'common.content_tab', 'config' => ['display' => 'Content']],
            ['handle' => 'style_tab', 'field' => 'common.style_tab', 'config' => ['display' => 'Style']],
        ];

        if (isset($has['colors_tab']) && $colorPicker) {
            $fields[] = ['handle' => 'colors_tab', 'field' => 'common.colors_tab', 'config' => ['display' => 'Colors']];
            $fields[] = ['handle' => 'bg_color', 'field' => [
                'type' => 'theme_color_picker',
                'display' => 'Bg color',
                'default' => 'var(--gray-600)',
            ]];
        }

        if (isset($has['spacing_tab'], $has['section_spacing'])) {
            $fields[] = ['handle' => 'spacing_tab', 'field' => 'common.spacing_tab', 'config' => ['display' => 'Spacing']];
            $fields[] = ['handle' => 'padding', 'field' => 'common.section_spacing', 'config' => [
                'display' => 'Padding',
                'sve_responsive' => true,
            ]];
        }

        return $fields;
    }

    /** Whether a fieldtype is registered on this site — an addon's, so never assumed. */
    protected static function hasFieldtype(string $handle): bool
    {
        try {
            return app(FieldtypeRepository::class)->find($handle) !== null;
        } catch (\Throwable) {
            return false;
        }
    }

    /**
     * One set in the page-builder fieldset, rewritten by `$edit` and saved.
     *
     * @param  callable(array): array  $edit
     * @return array{handle: string, display: string, group: string, fieldset: ?string, static: bool, hidden: bool}|null
     */
    protected static function editSet(SectionList|string $list, string $handle, callable $edit, string $commit): ?array
    {
        $list = static::list($list);
        $contents = $list->read();
        $groups = $contents === null ? null : $list->sets($contents);

        if ($groups === null) {
            return null;
        }

        $group = static::groupOf($groups, $handle);

        if ($group === null) {
            return null;
        }

        $set = $edit($groups[$group]['sets'][$handle]);
        $groups[$group]['sets'][$handle] = $set;

        $list->save($list->withSets($contents, $groups));
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
        return SectionList::fieldset($handle)->read();
    }

    /** A list as given: a fieldset handle is the site's own kind of list. */
    protected static function list(SectionList|string $list): SectionList
    {
        return $list instanceof SectionList ? $list : SectionList::fieldset($list);
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
