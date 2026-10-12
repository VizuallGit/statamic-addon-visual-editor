<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Collection as IlluminateCollection;
use Statamic\Contracts\Assets\Asset;
use Statamic\Contracts\Entries\Entry;
use Statamic\Contracts\Query\Builder;
use Statamic\Facades\Blink;
use Statamic\Facades\Collection;
use Statamic\Fields\Blueprint;
use Statamic\Fieldtypes\Assets\Assets;
use Statamic\Fieldtypes\Bard;
use Statamic\Fieldtypes\ButtonGroup;
use Statamic\Fieldtypes\Date;
use Statamic\Fieldtypes\Link;
use Statamic\Fieldtypes\Markdown;
use Statamic\Fieldtypes\Radio;
use Statamic\Fieldtypes\Select;
use Statamic\Fieldtypes\Text;
use Statamic\Fieldtypes\Textarea;

/**
 * `card` på hver entry: titel, billede, tekst, etiket og link i samme form,
 * uanset hvad collectionens felter hedder.
 *
 * Et kort i en løkke læser `{{ card:title }}`, `{{ card:image }}` … og virker
 * dermed med Cases, Services og Employees uden at kende deres felter. Hvilket
 * felt der er kortets billede eller tekst, siger collectionens eget blueprint:
 * hvert felt har indstillingen "Vises på kort som". Den der bygger collectionen
 * kender felterne — kortet og redaktøren skal ikke.
 *
 * Titel og link findes altid (entryens `title` og `url`). Har blueprintet ingen
 * roller overhovedet, bliver det første billedfelt kortets billede — ellers
 * gættes der ikke.
 *
 * Statamics egne computed values, så `card` findes overalt hvor en entry gør:
 * `{{ collection }}`, et entries-felt, relaterede entries.
 */
class EntryCard
{
    /** Indstillingen på feltet, som den gemmes i blueprintet. */
    public const KEY = 'sve_card';

    /** Navnet entryen får værdien under. */
    public const FIELD = 'card';

    public const ROLES = ['title', 'image', 'text', 'label', 'url'];

    /**
     * Hvilke roller en felttype kan have. Et tekstfelt kan ikke være et
     * billede; derfor ingen indstilling på Fieldtype::class for alle.
     */
    private const ROLES_BY_FIELDTYPE = [
        Assets::class => ['image'],
        Text::class => ['title', 'text', 'label', 'url'],
        Textarea::class => ['text', 'label'],
        Bard::class => ['text'],
        Markdown::class => ['text'],
        Link::class => ['url'],
        Select::class => ['label'],
        ButtonGroup::class => ['label'],
        Radio::class => ['label'],
        Date::class => ['label'],
    ];

    /**
     * Indstillingen på feltet. Kaldes pr. CP-request fra
     * {@see Http\Middleware\RegisterPanelVisibility}, så teksterne er på
     * brugerens sprog.
     */
    public static function registerSettings(): void
    {
        foreach (self::ROLES_BY_FIELDTYPE as $fieldtype => $roles) {
            $fieldtype::appendConfigFields([
                self::KEY => [
                    'display' => __('sve::messages.card_role'),
                    'instructions' => __('sve::messages.card_role_instructions'),
                    'type' => 'select',
                    'options' => collect($roles)
                        ->mapWithKeys(fn ($role) => [$role => __('sve::messages.card_role_'.$role)])
                        ->all(),
                    'clearable' => true,
                    'width' => 50,
                ],
            ]);
        }
    }

    /** `card` på entries i alle collections. Kaldes én gang ved boot. */
    public static function registerComputed(): void
    {
        self::computeFor(Collection::handles()->all());
    }

    /** @param  array<int, string>  $handles */
    public static function computeFor(array $handles): void
    {
        if ($handles === []) {
            return;
        }

        Collection::computed($handles, self::FIELD, fn (Entry $entry, $value) => self::of($entry, $value));
    }

    /**
     * Har blueprintet sit eget `card`-felt, er det entryens egen værdi.
     *
     * @return array{title: mixed, image: Asset|null, text: mixed, label: mixed, url: mixed}|mixed
     */
    public static function of(Entry $entry, $value = null)
    {
        $blueprint = $entry->blueprint();

        if ($blueprint->hasField(self::FIELD)) {
            return $value;
        }

        $roles = self::roles($blueprint);

        return [
            'title' => isset($roles['title']) ? self::value($entry, $roles['title']) : $entry->get('title'),
            'image' => self::image($entry, $roles['image'] ?? ($roles === [] ? self::firstAssetsField($blueprint) : null)),
            'text' => isset($roles['text']) ? self::value($entry, $roles['text']) : null,
            'label' => isset($roles['label']) ? self::value($entry, $roles['label']) : null,
            'url' => isset($roles['url']) ? self::value($entry, $roles['url']) : $entry->url(),
        ];
    }

    /**
     * Rolle → felt-handle. Første felt med en rolle vinder.
     *
     * @return array<string, string>
     */
    public static function roles(Blueprint $blueprint): array
    {
        return Blink::once('sve-entry-card-roles::'.$blueprint->namespace().'.'.$blueprint->handle(), function () use ($blueprint) {
            $roles = [];

            foreach ($blueprint->fields()->all() as $handle => $field) {
                $role = $field->get(self::KEY);

                if (in_array($role, self::ROLES, true) && ! isset($roles[$role])) {
                    $roles[$role] = $handle;
                }
            }

            return $roles;
        });
    }

    private static function value(Entry $entry, string $handle)
    {
        return blank($entry->get($handle)) ? null : $entry->augmentedValue($handle);
    }

    /** Ét billede, også fra et assets-felt der tillader flere. */
    private static function image(Entry $entry, ?string $handle): ?Asset
    {
        if ($handle === null || blank($entry->get($handle))) {
            return null;
        }

        // max_files: 1 giver et Asset, ellers en query over billederne.
        $value = $entry->augmentedValue($handle)->value();

        if ($value instanceof Builder) {
            $value = $value->first();
        } elseif ($value instanceof IlluminateCollection || is_array($value)) {
            $value = collect($value)->first();
        }

        return $value instanceof Asset ? $value : null;
    }

    private static function firstAssetsField(Blueprint $blueprint): ?string
    {
        return $blueprint->fields()->all()
            ->first(fn ($field) => $field->type() === 'assets')
            ?->handle();
    }
}
