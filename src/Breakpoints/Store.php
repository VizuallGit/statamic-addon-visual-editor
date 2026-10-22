<?php

namespace MarioHamann\StatamicVisualEditor\Breakpoints;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use MarioHamann\StatamicVisualEditor\Breakpoints;
use Statamic\Facades\Addon;
use Statamic\Facades\User;

/**
 * A screen size added from Live Preview's «+», written where the settings
 * screen writes: the addon's own settings file (`resources/addons/…yaml`,
 * through Statamic's `Settings::save()`), under the same `breakpoints` key
 * the screen's grid edits. One list, one file — the screen shows the new
 * row next time it opens, and nothing reads a second store.
 *
 * Add only. Renaming or removing a size orphans every value content has
 * saved under its handle; that stays a deliberate act on the settings
 * screen, with its warning in view.
 */
final class Store
{
    public const ADDON_ID = 'statamic-addon/visual-editor';

    /** The Control Panel user may change the addon's settings. */
    public static function editable(): bool
    {
        $addon = Addon::get(static::ADDON_ID);
        $user = User::current();

        return (bool) ($addon && $user && $user->can('editSettings', $addon));
    }

    /**
     * Validate `$input` as one more row and save the whole list.
     *
     * The rows that are saved are the rows as they are read now — the
     * settings screen's, or config's, or the three defaults — so a site that
     * never opened the screen gets its defaults written down beside the new
     * one, exactly as the screen would have saved them.
     *
     * @return array<int, array<string, mixed>> the list as the browser reads it
     *
     * @throws ValidationException
     */
    public static function add(array $input): array
    {
        $existing = Rows::rows();

        $row = static::validate($input, $existing);

        $rows = array_merge($existing, [$row]);

        Addon::get(static::ADDON_ID)->settings()->set('breakpoints', array_values($rows))->save();

        // AddonSettingsSaved forgets the cached list; this is the fresh one.
        return Breakpoints::forScript();
    }

    /**
     * @param  array<int, array<string, mixed>>  $existing
     * @return array<string, mixed>
     */
    protected static function validate(array $input, array $existing): array
    {
        $handles = array_column($existing, 'handle');
        $edges = array_map(fn ($row) => Rows::toPx((float) $row['min'], $row['unit']), $existing);

        $validator = Validator::make($input, [
            'handle' => ['required', 'string', 'max:32', 'regex:/^[a-z][a-z0-9_]*$/'],
            'label' => ['nullable', 'string', 'max:40'],
            'icon' => ['required', 'string', 'in:'.implode(',', Breakpoints::ICONS)],
            'min' => ['required', 'numeric', 'min:0', 'max:10000'],
            'unit' => ['required', 'string', 'in:'.implode(',', Rows::UNITS)],
            'width' => ['required', 'integer', 'min:240', 'max:3840'],
            'height' => ['nullable', 'integer', 'min:320', 'max:4320'],
        ]);

        $validator->after(function ($v) use ($input, $existing, $handles, $edges) {
            if (count($existing) >= Rows::MAX) {
                $v->errors()->add('handle', __('sve::messages.bp_add_error_max', ['max' => Rows::MAX]));
            }

            $handle = (string) ($input['handle'] ?? '');

            if ($handle !== '' && in_array($handle, $handles, true)) {
                $v->errors()->add('handle', __('sve::messages.bp_add_error_handle_taken'));
            }

            $unit = (string) ($input['unit'] ?? 'em');
            $min = $input['min'] ?? null;

            if (is_numeric($min) && in_array($unit, Rows::UNITS, true)) {
                $px = Rows::toPx((float) $min, $unit);

                foreach ($edges as $edge) {
                    if (abs($edge - $px) < 0.5) {
                        $v->errors()->add('min', __('sve::messages.bp_add_error_min_taken'));

                        break;
                    }
                }
            }
        });

        $data = $validator->validate();

        $label = trim((string) ($data['label'] ?? ''));

        return [
            'handle' => $data['handle'],
            'label' => $label !== '' ? $label : ucfirst($data['handle']),
            // Live Preview's device key — unique because the handle is.
            'device' => ucfirst($data['handle']),
            'icon' => $data['icon'],
            'min' => (float) $data['min'],
            'unit' => $data['unit'],
            'width' => (int) $data['width'],
            'height' => (int) ($data['height'] ?? 900),
        ];
    }
}
