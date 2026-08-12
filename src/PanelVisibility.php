<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Fields\Fieldtype;

/**
 * Where a field is edited: in both editors, only beside the preview, or anywhere
 * but there.
 *
 * A field whose value is set on the page itself — a heading's size, its tag, set
 * from the inline toolbar — has no business also sitting in the panel beside it,
 * where it says the same thing twice. Saying so used to mean opening the fieldset
 * YAML and writing a custom condition by hand, which is a thing only whoever wrote
 * the site can do. It is a question about one field, so it is asked on that
 * field's own settings screen, in the Control Panel, like every other question
 * about it.
 *
 * The setting does not hide anything itself: it is turned into the condition the
 * editor already understands, at the moment the blueprint is read. Everything
 * downstream — the publish form, the conditions in the browser, `always_save` —
 * behaves exactly as it does for a condition written by hand, because it *is* one.
 */
class PanelVisibility
{
    /** The config key, as it is saved on the field. */
    public const KEY = 'sve_panel';

    public const BOTH = 'both';
    public const PANEL = 'panel';
    public const FORM = 'form';

    /**
     * The custom condition each answer becomes. Registered in the browser by the
     * editor's own script (see `initCp`), so a site that has this addon has them
     * whether or not it wrote any of its own.
     */
    protected const CONDITIONS = [
        self::PANEL => 'custom onlyInLivePreview',
        self::FORM => 'custom notInLivePreview',
    ];

    /** Adds the question to every fieldtype's settings screen. */
    public static function register(): void
    {
        Fieldtype::appendConfigFields([
            self::KEY => [
                'display' => __('sve::messages.field_where'),
                'instructions' => __('sve::messages.field_where_instructions'),
                'type' => 'select',
                'default' => self::BOTH,
                'options' => [
                    self::BOTH => __('sve::messages.field_where_both'),
                    self::PANEL => __('sve::messages.field_where_panel'),
                    self::FORM => __('sve::messages.field_where_form'),
                ],
                'width' => 50,
            ],
        ]);
    }

    /**
     * Turns the setting into the condition that does the hiding.
     *
     * Three rules, and the order matters:
     *
     * 1. A field that was never asked the question is left completely alone. Sites
     *    that wrote `custom notInLivePreview` by hand — this is how it was done
     *    before the setting existed — keep working exactly as they did.
     * 2. A condition the site wrote itself is never overruled. It says something
     *    this dropdown cannot, and two conditions on one field is one too many.
     * 3. A condition this class wrote *is* replaced, including with nothing at all.
     *    The injection happens as the blueprint is read, but a blueprint saved from
     *    the Control Panel can persist what it was given — and a setting that
     *    stopped working the day someone pressed Save would be worse than no
     *    setting. Ours is ours to rewrite.
     *
     * `always_save` travels with the condition: Statamic drops the value of a
     * conditionally hidden field when the form is saved, and without it a save from
     * the preview would blank whatever was just set on the page.
     *
     * @param  array<string, mixed>  $field
     * @return array<string, mixed>
     */
    public static function apply(array $field): array
    {
        if (! array_key_exists(static::KEY, $field)) {
            return $field;
        }

        $existing = $field['if'] ?? null;
        $ours = is_string($existing) && in_array($existing, static::CONDITIONS, true);

        if (($existing !== null && ! $ours) || isset($field['if_any']) || isset($field['unless'])) {
            return $field;
        }

        $condition = static::CONDITIONS[$field[static::KEY]] ?? null;

        if (! $condition) {
            unset($field['if'], $field['always_save']);

            return $field;
        }

        $field['if'] = $condition;
        $field['always_save'] = true;

        return $field;
    }
}
