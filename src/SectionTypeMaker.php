<?php

namespace MarioHamann\StatamicVisualEditor;

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
 */
class SectionTypeMaker
{
    /** Where the page templates look for a section's markup. */
    public const VIEW_FOLDER = 'partials/page_sections';

    /**
     * A name as typed, turned into the handle segment it has to be.
     *
     * Slashes would walk the section out of its folder, so they go with
     * everything else that isn't a plain lowercase word. Returns null rather
     * than a guess when nothing usable survives: "???" is not a section name,
     * and a file called `.yaml` helps nobody.
     */
    public static function slug(string $name): ?string
    {
        $name = strtolower(trim($name));
        $name = str_replace(['æ', 'ø', 'å', 'ä', 'ö', 'ü', 'é', 'è', 'á'], ['ae', 'oe', 'aa', 'ae', 'oe', 'ue', 'e', 'e', 'a'], $name);
        $name = preg_replace('/[^a-z0-9]+/', '_', $name) ?? '';
        $name = trim($name, '_');

        if ($name === '' || strlen($name) > 60 || ! preg_match('/^[a-z]/', $name)) {
            return null;
        }

        return $name;
    }

    /**
     * The folder a group's *markup* lives in — the set handle's first segment,
     * because the page template renders `partials/page_sections/{ type }`.
     *
     * Read from the sections the group already has, not from the group's own
     * name, and only when they genuinely agree. `other_sections` is a grab-bag
     * of six unrelated sections, and the most common prefix there is whichever
     * one happens to come first; putting a new section in it would file it
     * under a stranger's name. So a prefix has to hold *more than half* the
     * group to be adopted, and everything else falls back to the group's key
     * without its plural. That fallback is usually the right answer anyway:
     * `content_sections` splits evenly between two prefixes and singularises to
     * `content_section`, exactly where a new content section belongs.
     */
    public static function viewFolderForGroup(array $groups, string $group): string
    {
        $handles = array_keys($groups[$group]['sets'] ?? []);

        $prefixes = array_values(array_filter(array_map(
            fn ($handle) => str_contains((string) $handle, '/') ? explode('/', (string) $handle)[0] : null,
            $handles
        )));

        return static::dominant($prefixes, count($handles)) ?? static::singular($group);
    }

    /**
     * The folder a group's *fields* live in — which is not always the same word.
     *
     * This site's `featured_section/style_1` imports `featured_sections.style_1`:
     * singular in the handle, plural in the fieldset. `testimonails/style_1`
     * imports `testimonials.style_1` — one of them is a typo and both are real.
     * Deriving one folder from the other writes the fieldset where nothing will
     * look for it, so the imports get read on their own terms.
     *
     * Falls back to the view folder, which is what a group with no agreement —
     * or no sections yet — should use for both.
     */
    public static function fieldsetFolderForGroup(array $groups, string $group): string
    {
        $sets = $groups[$group]['sets'] ?? [];
        $folders = [];

        foreach ($sets as $set) {
            foreach (($set['fields'] ?? []) as $field) {
                $import = is_array($field) ? ($field['import'] ?? null) : null;

                if (is_string($import) && str_contains($import, '.')) {
                    $folders[] = explode('.', $import)[0];
                }
            }
        }

        return static::dominant($folders, count($sets)) ?? static::viewFolderForGroup($groups, $group);
    }

    /**
     * The value holding more than half of `$total`, or null when the group
     * cannot be said to agree on one.
     */
    protected static function dominant(array $values, int $total): ?string
    {
        if ($values === [] || $total === 0) {
            return null;
        }

        $counts = array_count_values($values);
        arsort($counts);
        $top = (string) array_key_first($counts);

        return $counts[$top] * 2 > $total ? $top : null;
    }

    /** `galleries` → `gallery`, `custom_sections` → `custom_section`, `hero` → `hero`. */
    protected static function singular(string $word): string
    {
        if (str_ends_with($word, 'ies')) {
            return substr($word, 0, -3).'y';
        }

        if (str_ends_with($word, 's') && ! str_ends_with($word, 'ss')) {
            return substr($word, 0, -1);
        }

        return $word;
    }

    /**
     * The first handle in this folder that nothing has claimed.
     *
     * Claimed means any of the three: a set of that name, a fieldset file, or a
     * partial. All three are checked because they can disagree — a fieldset
     * left behind by a section deleted earlier is exactly the orphan the delete
     * deliberately does not clean up, and writing over it would take someone's
     * fields with it.
     */
    public static function freeName(array $groups, string $viewFolder, string $fieldsetFolder, string $slug): string
    {
        $taken = [];

        foreach ($groups as $group) {
            foreach (array_keys($group['sets'] ?? []) as $handle) {
                $taken[(string) $handle] = true;
            }
        }

        $suffix = 1;

        while (true) {
            $try = $suffix === 1 ? $slug : $slug.'_'.$suffix;

            if (! isset($taken[$viewFolder.'/'.$try])
                && ! is_file(static::fieldsetPath($fieldsetFolder, $try))
                && ! is_file(static::viewPath($viewFolder, $try))) {
                return $try;
            }

            $suffix++;

            // A folder with a hundred `testimonials_n` is not a naming clash any
            // more, it is a loop that should stop asking.
            if ($suffix > 100) {
                return $slug.'_'.uniqid();
            }
        }
    }

    public static function fieldsetPath(string $folder, string $slug): string
    {
        return Fieldset::directory().'/'.$folder.'/'.$slug.'.yaml';
    }

    public static function viewPath(string $folder, string $slug): string
    {
        return resource_path('views/'.static::VIEW_FOLDER.'/'.$folder.'/'.$slug.'.antlers.html');
    }

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
    public static function create(string $fieldsetHandle, string $group, string $display, ?string $icon = null): ?array
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

        $slug = static::slug($display);

        if ($slug === null) {
            return null;
        }

        $viewFolder = static::viewFolderForGroup($groups, $group);
        $fieldsetFolder = static::fieldsetFolderForGroup($groups, $group);
        $name = static::freeName($groups, $viewFolder, $fieldsetFolder, $slug);

        $handle = $viewFolder.'/'.$name;
        $imported = $fieldsetFolder.'.'.$name;

        // The fields the set imports. Empty to start with: the fieldset screen
        // — or the panel — is where fields get added, and a set importing a
        // fieldset that does not exist yet is a broken set.
        Fieldset::make($imported)->setContents([
            'title' => $display,
            'fields' => [],
        ])->save();

        if (! is_file(static::fieldsetPath($fieldsetFolder, $name))) {
            return null;
        }

        $view = static::viewPath($viewFolder, $name);
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

        $set['fields'] = [['import' => $imported]];

        $contents['fields'][$index]['field']['sets'][$group]['sets'][$handle] = $set;

        Fieldset::make($fieldsetHandle)->setContents($contents)->save();

        // The image map is built by walking every fieldset once per request and
        // cached; there is a set in it now that was not there before.
        SetPreviewImages::flush();

        return [
            'handle' => $handle,
            'display' => $display,
            'group' => $group,
            'view' => static::VIEW_FOLDER.'/'.$viewFolder.'/'.$name,
            'fieldset' => $imported,
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
}
