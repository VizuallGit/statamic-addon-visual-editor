<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use MarioHamann\StatamicVisualEditor\TemplateProps;
use Statamic\Fields\Fieldtype;

/**
 * Every `:name ?? …` in the section template, as selects.
 *
 * The template owns the names. Rename `text_field` to `headline_field`
 * in the file, and this field shows that name — not a fixed list.
 */
class TemplatePropsFieldtype extends Fieldtype
{
    protected static $handle = 'sve_template_props';

    protected $selectable = false;

    public function component(): string
    {
        return 'sve-template-props';
    }

    public function preload(): array
    {
        $type = (string) $this->config('section_type', '');

        return TemplateProps::payloadForType($type);
    }

    public function preProcess($data)
    {
        if (! is_array($data)) {
            return [];
        }

        $out = [];

        foreach ($data as $handle => $value) {
            if (is_string($handle) && is_string($value) && $value !== '') {
                $out[$handle] = $value;
            }
        }

        return $out;
    }

    public function process($data)
    {
        if (! is_array($data) || $data === []) {
            return null;
        }

        return $this->preProcess($data);
    }
}
