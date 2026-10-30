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
     * @return ?string the field's handle; null when the section has no fieldset to add to
     */
    public static function run(SectionList|string $list, string $set, string $kind, string $name, string $value): ?string
    {
        $imported = SectionTypeMaker::addFields($list, $set)['fieldset'] ?? null;
        $folderAndName = is_string($imported) ? explode('.', $imported, 2) : [];

        if (count($folderAndName) !== 2) {
            return null;
        }

        $path = Names::fieldsetPath($folderAndName[0], $folderAndName[1]);

        if (! is_file($path)) {
            return null;
        }

        $contents = YAML::file($path)->parse();
        $handle = static::handle($name, FieldsetFields::flatten($contents));
        $field = ['handle' => $handle, 'field' => static::config($kind, $handle, $value)];

        if (is_array($contents['sections'] ?? null) && $contents['sections'] !== []) {
            $last = array_key_last($contents['sections']);
            $contents['sections'][$last]['fields'][] = $field;
        } else {
            $contents['fields'][] = $field;
        }

        Fieldset::make($imported)->setContents($contents)->save();

        return $handle;
    }

    /** The name as a handle, numbered when it is taken. */
    protected static function handle(string $name, array $fields): string
    {
        $base = Str::snake(preg_replace('/[^\pL\pN]+/u', ' ', Str::ascii($name)) ?: 'field');
        $base = preg_match('/^[a-z]/', $base) ? $base : 'field_'.$base;
        $taken = array_merge(self::RESERVED, array_column($fields, 'handle'));
        $handle = $base;

        for ($number = 2; in_array($handle, $taken, true); $number++) {
            $handle = $base.'_'.$number;
        }

        return $handle;
    }

    protected static function config(string $kind, string $handle, string $value): array
    {
        $config = ['type' => $kind, 'display' => Str::title(str_replace('_', ' ', $handle))];

        if ($kind === 'assets') {
            $asset = $value === '' ? null : Asset::findByUrl($value);

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
