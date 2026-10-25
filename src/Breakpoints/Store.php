<?php

namespace MarioHamann\StatamicVisualEditor\Breakpoints;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use MarioHamann\StatamicVisualEditor\Breakpoints;
use MarioHamann\StatamicVisualEditor\Shortcuts;
use Statamic\Facades\Addon;
use Statamic\Facades\User;

/**
 * A screen size added from Live Preview's «+», written where the settings
 * screen writes: the addon's own settings file (`resources/addons/…yaml`,
 * through Statamic's `Settings::save()`), under the same `breakpoints` key
 * the screen's grid edits. One list, one file — the screen shows the new
 * row next time it opens, and nothing reads a second store.
 *
 * Add and remove. Removing a size orphans every value content has saved
 * under its handle — they stay in the entries, unread, until the handle
 * comes back. The popover says so beside the button; renaming stays on
 * the settings screen. Never below {@see Rows::MIN} rows: the last one is
 * the base every field and tab writes in.
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

        return static::write(array_merge($existing, [$row]));
    }

    /**
     * Take the row with `$handle` out and save the rest.
     *
     * Refused when the handle is not in the list, and when the list would
     * go below {@see Rows::MIN}. The remaining rows are written as they are
     * read now, as {@see add()} writes them — so removing one of the three
     * defaults on a site that never opened the settings screen writes the
     * other two down, instead of leaving nothing and getting all three back.
     *
     * @return array<int, array<string, mixed>> the list as the browser reads it
     *
     * @throws ValidationException
     */
    public static function remove(string $handle): array
    {
        $existing = Rows::rows();
        $handles = array_column($existing, 'handle');

        $validator = Validator::make(['handle' => $handle], [
            'handle' => ['required', 'string', 'in:'.implode(',', $handles)],
        ], [
            'handle.in' => __('sve::messages.bp_remove_error_unknown'),
        ]);

        $validator->after(function ($v) use ($existing) {
            if (count($existing) <= Rows::MIN) {
                $v->errors()->add('handle', __('sve::messages.bp_remove_error_min', ['min' => Rows::MIN]));
            }
        });

        $validator->validate();

        return static::write(array_values(array_filter($existing, fn ($row) => $row['handle'] !== $handle)));
    }

    /**
     * The one write: the whole list, where the settings screen writes it.
     *
     * @param  array<int, array<string, mixed>>  $rows
     * @return array<int, array<string, mixed>>
     */
    protected static function write(array $rows): array
    {
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
            'shortcut' => ['nullable', 'string', 'max:64'],
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

            $shortcut = $input['shortcut'] ?? null;

            if (is_string($shortcut) && trim($shortcut) !== '') {
                if (Shortcuts::normalize($shortcut) === '') {
                    $v->errors()->add('shortcut', __('sve::messages.bp_add_error_shortcut'));
                } elseif (Shortcuts::isLocked($shortcut)) {
                    $v->errors()->add('shortcut', __('sve::messages.bp_add_error_shortcut_locked'));
                }
            }
        });

        $data = $validator->validate();

        $label = trim((string) ($data['label'] ?? ''));
        $shortcut = Shortcuts::clean($data['shortcut'] ?? null);

        return array_filter([
            'handle' => $data['handle'],
            'label' => $label !== '' ? $label : ucfirst($data['handle']),
            // Live Preview's device key — unique because the handle is.
            'device' => ucfirst($data['handle']),
            'icon' => $data['icon'],
            'min' => (float) $data['min'],
            'unit' => $data['unit'],
            'width' => (int) $data['width'],
            'height' => (int) ($data['height'] ?? 900),
            // The site's own shortcut for the new size — written only when it has one.
            'shortcut' => $shortcut !== '' ? $shortcut : null,
        ], fn ($value) => $value !== null);
    }
}
