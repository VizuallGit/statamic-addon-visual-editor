<?php

namespace MarioHamann\StatamicVisualEditor\SectionTypeMaker;

use Statamic\Facades\Fieldset;

/**
 * What a new section type is called and where its two files go: the slug,
 * the view and fieldset folders a group implies, and a name that is free.
 * Moved verbatim out of SectionTypeMaker in WP7d.
 */
final class Names
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
}
