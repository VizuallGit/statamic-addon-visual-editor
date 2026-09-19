<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Asset;
use Statamic\Facades\AssetContainer;
use Statamic\Facades\Entry;
use Statamic\Fields\Field;
use Statamic\Fields\FieldtypeRepository;

/**
 * A component's fields, as the Control Panel's own fields.
 *
 * Rich text wants a toolbar and room to type in; a picture wants the asset
 * browser; a link wants the page picker. All three already exist, built and
 * maintained, one layer up — so a prop is turned into a real Statamic field
 * and the Control Panel draws what it always draws.
 *
 * What crosses back is still a string, because a prop value is a partial
 * parameter and a parameter holds nothing else. That is what the two halves of
 * this class are for: `toPublish` turns the string into whatever the fieldtype
 * expects, and `toParam` turns the fieldtype's answer back into a string the
 * call can carry and a template can print.
 */
class PropFields
{
    /**
     * What rich text can do unless the settings screen says otherwise.
     *
     * The link button is `anchor`. It is the one handle in this list that is
     * not named after what it does, and naming it `link` silently drops it —
     * Bard keeps the buttons it knows and says nothing about the rest.
     */
    public const BARD_BUTTONS = [
        'h2',
        'h3',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'unorderedlist',
        'orderedlist',
        'anchor',
        'removeformat',
    ];

    /**
     * The buttons a rich text field offers, as the settings screen has them.
     *
     * Read per request rather than cached: the settings are a file read the
     * settings repository already caches, and a stale toolbar after a change
     * would read as the setting not working.
     *
     * @return list<string>
     */
    public static function buttons(): array
    {
        $chosen = Features::setting('component_props_buttons');

        if (! is_array($chosen)) {
            return self::BARD_BUTTONS;
        }

        $clean = array_values(array_filter(array_map(
            fn ($button) => is_string($button) ? trim($button) : '',
            $chosen
        )));

        return $clean === [] ? self::BARD_BUTTONS : $clean;
    }

    /**
     * The Control Panel field one prop is drawn as.
     */
    public static function config(array $prop): array
    {
        $label = trim((string) ($prop['label'] ?? '')) ?: ucfirst(str_replace('_', ' ', (string) ($prop['handle'] ?? '')));
        $default = (string) ($prop['default'] ?? '');

        return match ((string) ($prop['type'] ?? 'text')) {
            'bard' => [
                'type' => 'bard',
                'display' => $label,
                // The panel draws the label itself, so the switch that turns a
                // field into an Antlers expression can sit beside it.
                'hide_display' => true,
                // HTML both ways. A prop is a string, and prosemirror JSON in a
                // partial parameter is not a thing anyone could read or fix.
                'save_html' => true,
                'buttons' => static::buttons(),
                // No fullscreen button. The panel is narrow on purpose and the
                // field is one of several — a control that takes over the
                // screen is not what this is for.
                'fullscreen' => false,
                'target_blank' => true,
                'placeholder' => $default,
            ],
            'media' => [
                'type' => 'assets',
                'display' => $label,
                'hide_display' => true,
                'max_files' => 1,
                'mode' => 'grid',
                'container' => self::container($default),
            ],
            'link' => [
                'type' => 'link',
                'display' => $label,
                'hide_display' => true,
            ],
            // A text box that only takes digits: the browser's own number
            // input, decimals included, rather than the integer field.
            'number' => [
                'type' => 'text',
                'input_type' => 'number',
                'display' => $label,
                'hide_display' => true,
                'placeholder' => $default,
            ],
            'boolean' => [
                'type' => 'toggle',
                'display' => $label,
                'hide_display' => true,
            ],
            'select' => [
                'type' => 'select',
                'display' => $label,
                'hide_display' => true,
                'options' => static::choices($prop),
                'clearable' => true,
                'placeholder' => $default,
            ],
            'color' => [
                'type' => static::colorFieldtype(),
                'display' => $label,
                'hide_display' => true,
            ],
            default => [
                'type' => 'text',
                'display' => $label,
                'hide_display' => true,
                'placeholder' => $default,
            ],
        };
    }

    /**
     * A select's choices, each its own label — the declaration holds one list,
     * and that list is what the editor picks from and what the template gets.
     *
     * @return array<string, string>
     */
    protected static function choices(array $prop): array
    {
        $raw = $prop['options'] ?? [];
        $list = is_string($raw) ? explode(',', $raw) : (is_array($raw) ? $raw : []);
        $out = [];

        foreach ($list as $option) {
            $value = is_scalar($option) ? trim((string) $option) : '';

            if ($value !== '') {
                $out[$value] = $value;
            }
        }

        return $out;
    }

    /**
     * The colour field: the site's theme picker when the site has one, so a
     * colour prop is `var(--primary-500)` like every other colour on the site
     * and follows the theme; the Control Panel's plain colour field otherwise.
     * The picker is another add-on's, so it is asked for rather than assumed.
     */
    protected static function colorFieldtype(): string
    {
        // The repository, not a facade: Statamic 6 has none for fieldtypes,
        // and a facade that does not exist is caught below as "not installed".
        try {
            app(FieldtypeRepository::class)->find('theme_color_picker');

            return 'theme_color_picker';
        } catch (\Throwable) {
            return 'color';
        }
    }

    /**
     * The component's fields as one blueprint.
     *
     * A blueprint rather than a loose list of fields, because that is what a
     * publish form is handed everywhere else in the Control Panel — and it is
     * what builds the publish array in the shape the form already reads.
     */
    public static function blueprint(array $props): \Statamic\Fields\Blueprint
    {
        $fields = [];

        foreach ($props as $prop) {
            $handle = (string) ($prop['handle'] ?? '');

            if ($handle !== '') {
                $fields[$handle] = static::config($prop);
            }
        }

        return \Statamic\Facades\Blueprint::makeFromFields($fields);
    }

    /** The stored string, as the fieldtype wants to receive it. */
    public static function toPublish(array $prop, string $raw): mixed
    {
        $value = trim($raw);

        if ($value === '') {
            return null;
        }

        return match ((string) ($prop['type'] ?? 'text')) {
            // An asset is stored as its URL, because that is what an `src` needs.
            // The fieldtype works in container-relative paths, so it is looked up.
            'media' => ($asset = Asset::findByUrl($value)) ? [$asset->path()] : null,
            // The one word the pair reads as on. Anything else in the call is
            // a hand-written value the switch has no position for.
            'boolean' => $value === 'true',
            default => $value,
        };
    }

    /**
     * The fieldtype's answer, as the string the call will carry.
     *
     * Everything ends up as something a template can print straight into an
     * attribute — a URL, or HTML. Nothing here hands back a reference the
     * template would have to resolve, because a partial parameter is handed to
     * the partial as a plain variable and nothing augments it on the way.
     */
    public static function toParam(array $prop, mixed $value): string
    {
        $type = (string) ($prop['type'] ?? 'text');

        if ($type === 'media') {
            $path = is_array($value) ? ($value[0] ?? null) : $value;

            return $path ? (string) (static::asset((string) $path, $prop)?->url() ?? '') : '';
        }

        // Off is written, not left out. An absent parameter means "the
        // component's own default", and a switch turned off at one place
        // must stay off there even where the default is on. `sve_defaults`
        // turns the two words back into the booleans a template tests.
        if ($type === 'boolean') {
            return $value === true || $value === 1 || $value === '1' || $value === 'true' ? 'true' : 'false';
        }

        if ($value === null || $value === '' || $value === []) {
            return '';
        }

        $processed = (new Field((string) ($prop['handle'] ?? 'value'), static::config($prop)))
            ->setValue($value)
            ->process()
            ->value();

        if ($type === 'link') {
            return static::url((string) $processed);
        }

        if ($type === 'bard') {
            // The call is `handle="…"` or `handle='…'`, and Antlers has no
            // escape for the quote it closes on. HTML brings double quotes in
            // its own attributes, so the parameter has to use single ones — and
            // then an apostrophe in the text would end it early. As HTML,
            // `&#39;` is the same character and cannot close anything.
            return str_replace("'", '&#39;', (string) $processed);
        }

        // A number box may answer with a number rather than a string of one.
        if ($type === 'number') {
            return is_numeric($processed) ? (string) $processed : '';
        }

        return is_string($processed) ? $processed : '';
    }

    /**
     * `entry::abc` is a reference the rendered page never sees, so it is
     * resolved here — the call carries the address itself.
     */
    protected static function url(string $value): string
    {
        if (! str_starts_with($value, 'entry::')) {
            return $value;
        }

        return (string) (Entry::find(substr($value, 7))?->url() ?? '');
    }

    protected static function asset(string $path, array $prop): ?\Statamic\Contracts\Assets\Asset
    {
        if (str_contains($path, '::')) {
            return Asset::find($path);
        }

        $container = static::container((string) ($prop['default'] ?? ''));

        return $container ? Asset::find($container.'::'.$path) : null;
    }

    /** The container a stored URL lives in, or the site's first one. */
    protected static function container(string $url): ?string
    {
        if ($url !== '' && ($asset = Asset::findByUrl($url))) {
            return $asset->container()->handle();
        }

        return AssetContainer::all()->first()?->handle();
    }
}
