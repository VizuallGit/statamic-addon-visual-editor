<?php

namespace MarioHamann\StatamicVisualEditor\SectionTypeMaker;

use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\FieldsetFields;
use MarioHamann\StatamicVisualEditor\SectionList;
use MarioHamann\StatamicVisualEditor\SectionTypeMaker;
use Statamic\Facades\Asset;
use Statamic\Facades\AssetContainer;
use Statamic\Facades\Fieldset;
use Statamic\Facades\YAML;
use Statamic\Fields\Fields;

/**
 * One field added to a section's fieldset: what makes an element's own text or
 * image editable per page ("Kan redigeres i Edit Content", Vizuall Build).
 *
 * What the element held becomes the field's default. Statamic prints a field's
 * default for a row without a value, so every page already using the section
 * keeps showing what it showed, and nothing is written to any page.
 *
 * The fieldset is read off disk: the repository's copy carries the `_visual_id`
 * this addon injects at runtime, and saving it would write that into the file.
 * Both of Statamic's shapes are kept (FieldsetFields): flat `fields`, or
 * `sections` — the field joins the last section. An existing field is never
 * touched: a name already taken gets a number.
 *
 * "Own content in each section": the same field, made `visibility: hidden`.
 * Statamic keeps a hidden field out of the publish form and still saves its
 * value, so each section on each page holds its own content without a content
 * editor seeing a field. "Editable in Edit Content" on such an element shows
 * the field ({@see setHidden()}) rather than making a second one: a second
 * field would leave every other section's content behind in the first.
 */
class AddField
{
    public const KINDS = ['text', 'textarea', 'bard', 'assets', 'link'];

    /** Names a row of a section uses for itself. */
    protected const RESERVED = ['id', 'type', 'enabled', 'collapsed', 'sve_props'];

    /**
     * @param  string  $set  the section type, `content_section/ttte`
     * @param  string  $kind  one of KINDS
     * @param  string  $name  the name asked for; made into a handle
     * @param  string  $value  what the element holds: text, HTML or a URL
     * @param  bool  $hidden  own content only: kept out of Edit Content's form
     * @return ?string the field's handle; null when nothing was made — the section has
     *                 no fieldset to add to, imports it with a prefix, or the value is
     *                 no default (an image that is no asset)
     */
    public static function run(SectionList|string $list, string $set, string $kind, string $name, string $value, bool $hidden = false): ?string
    {
        $config = static::config($kind, $value);

        // Before anything is written: a static section is given its fieldset below.
        if ($config === null) {
            return null;
        }

        $found = static::fieldsetFile(SectionTypeMaker::addFields($list, $set));

        if ($found === null) {
            return null;
        }

        [$imported, $path] = $found;
        $contents = YAML::file($path)->parse();
        $handle = static::handle($name, FieldsetFields::flatten($contents));
        $display = ['type' => $kind, 'display' => Str::title(str_replace('_', ' ', $handle))];
        $field = ['handle' => $handle, 'field' => $display + ($hidden ? ['visibility' => 'hidden'] : []) + $config];

        if (is_array($contents['sections'] ?? null) && $contents['sections'] !== []) {
            $last = array_key_last($contents['sections']);
            $contents['sections'][$last]['fields'][] = $field;
        } else {
            $contents['fields'][] = $field;
        }

        Fieldset::make($imported)->setContents($contents)->save();

        return $handle;
    }

    /**
     * Shows or hides a field of the section's own fieldset: "Editable in Edit
     * Content" on an element whose content is already its section's own.
     *
     * Only a field written in the fieldset itself — one this class made, or one
     * like it. An imported or referenced field belongs to a fieldset other
     * sections share, and is left alone. Nothing is created: a section without
     * a fieldset has no field to show.
     *
     * @param  string  $display  the name a content editor sees, when one is given on showing it
     * @return bool whether the field was found and written
     */
    public static function setHidden(SectionList|string $list, string $set, string $handle, bool $hidden, string $display = ''): bool
    {
        $found = static::fieldsetFile(static::existingType($list, $set));

        if ($found === null) {
            return false;
        }

        [$imported, $path] = $found;
        $contents = YAML::file($path)->parse();
        $written = false;

        $edit = function (array $fields) use ($handle, $hidden, $display, &$written): array {
            foreach ($fields as $index => $field) {
                if (! is_array($field) || ($field['handle'] ?? null) !== $handle || ! is_array($field['field'] ?? null)) {
                    continue;
                }

                if ($hidden) {
                    $field['field']['visibility'] = 'hidden';
                } else {
                    unset($field['field']['visibility']);

                    // A name left as offered (`heading`) reads as a field's
                    // display does when this class makes one: "Heading".
                    if ($display !== '') {
                        $field['field']['display'] = preg_match('/^[a-z][a-z0-9_]*$/', $display)
                            ? Str::title(str_replace('_', ' ', $display))
                            : $display;
                    }
                }

                $fields[$index] = $field;
                $written = true;
            }

            return $fields;
        };

        if (is_array($contents['sections'] ?? null)) {
            foreach ($contents['sections'] as $key => $section) {
                if (is_array($section['fields'] ?? null)) {
                    $contents['sections'][$key]['fields'] = $edit($section['fields']);
                }
            }
        }

        if (is_array($contents['fields'] ?? null)) {
            $contents['fields'] = $edit($contents['fields']);
        }

        if (! $written) {
            return false;
        }

        Fieldset::make($imported)->setContents($contents)->save();

        return true;
    }

    /**
     * The section's type as the list describes it, without writing anything —
     * {@see SectionTypeMaker::addFields()} gives a static section a fieldset first.
     */
    protected static function existingType(SectionList|string $list, string $set): ?array
    {
        $list = $list instanceof SectionList ? $list : SectionList::fieldset($list);
        $contents = $list->read();
        $groups = $contents === null ? null : $list->sets($contents);
        $group = $groups === null ? null : SectionTypeMaker::groupOf($groups, $set);

        return $group === null ? null : SectionTypeMaker::describe($set, $group, $groups[$group]['sets'][$set]);
    }

    /**
     * The fieldset a type imports and its file on disk; null when there is none
     * a field can join. A set importing with a prefix reads the fieldset's
     * `heading` as `hero_heading`: `{{ heading }}` in the file would print
     * nothing on every page.
     *
     * @return ?array{0: string, 1: string}
     */
    protected static function fieldsetFile(?array $type): ?array
    {
        $imported = $type['fieldset'] ?? null;
        $folderAndName = is_string($imported) ? explode('.', $imported, 2) : [];

        if (count($folderAndName) !== 2 || ($type['prefix'] ?? '') !== '') {
            return null;
        }

        $path = Names::fieldsetPath($folderAndName[0], $folderAndName[1]);

        return is_file($path) ? [$imported, $path] : null;
    }

    /**
     * The name as a handle, numbered when it is taken.
     *
     * Taken is every handle the section's form will have — Statamic's own
     * reading of the fields, so an `import` and a `field:` reference count
     * with their handles. Statamic keys a section's fields by handle and the
     * later wins (`Fields::setItems`): a new field named after an imported one
     * would stand in for it, and every page's value in it would be read
     * through the new type.
     */
    protected static function handle(string $name, array $fields): string
    {
        $base = Str::snake(preg_replace('/[^\pL\pN]+/u', ' ', Str::ascii($name)) ?: 'field');
        $base = preg_match('/^[a-z]/', $base) ? $base : 'field_'.$base;
        $taken = array_merge(self::RESERVED, (new Fields($fields))->all()->keys()->all());
        $handle = $base;

        for ($number = 2; in_array($handle, $taken, true); $number++) {
            $handle = $base.'_'.$number;
        }

        return $handle;
    }

    /**
     * The field's settings after type and display, the value as its default.
     * Null when the value cannot be one: an image whose address is no asset's
     * (a file under `public/`, a Glide URL) has nothing a field could hold, and
     * `{{ image }}` would print nothing on every page.
     */
    protected static function config(string $kind, string $value): ?array
    {
        $config = [];

        if ($kind === 'assets') {
            $asset = $value === '' ? null : Asset::findByUrl($value);

            if ($value !== '' && $asset === null) {
                return null;
            }

            $config['container'] = $asset?->container()->handle() ?? AssetContainer::all()->first()?->handle();
            $config['max_files'] = 1;
            $value = (string) $asset?->path();
        }

        // As HTML, the way the element held it: no document to convert to and back.
        if ($kind === 'bard') {
            $config['save_html'] = true;
        }

        return $value === '' ? $config : $config + ['default' => $value];
    }
}
