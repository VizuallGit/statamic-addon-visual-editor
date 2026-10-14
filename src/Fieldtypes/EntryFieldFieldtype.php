<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use MarioHamann\StatamicVisualEditor\Stores;
use MarioHamann\StatamicVisualEditor\TemplateProps\Options;
use Statamic\Facades\Collection;
use Statamic\Fields\Fieldtype;

/**
 * "Hent fra felt" — et felt på entryen i den samling sektionen viser.
 *
 * En blok i et kort (overskrift, billede, dato …) siger hvilket af samlingens
 * felter den viser. Mulighederne er kun felter af de typer blokken tager
 * (`accepts`): et billede kan kun hente fra et assets-felt, en overskrift kun
 * fra text/textarea.
 *
 * Hvilken samling, læses i CP'et fra det felt `collection_field` navngiver
 * (standard `list_collection`), nærmeste på vejen op fra blokken — så listen
 * skifter i samme øjeblik man vælger en anden samling. Her leveres felterne
 * for alle samlinger på én gang.
 *
 * Værdien er feltets handle. `{{ sve_prop prop="card_source" }}` printer
 * entryens værdi i løkken.
 */
class EntryFieldFieldtype extends Fieldtype
{
    /** Entryens egen adresse — ikke et felt i blueprintet. */
    public const ENTRY_URL = 'entry_url';

    protected $selectable = false;

    protected static $handle = 'sve_entry_field';

    public function component(): string
    {
        return 'sve-entry-field';
    }

    /**
     * @return array{fields: array<string, list<array{handle: string, display: string, type: string}>>, collections: array<string, string>}
     */
    public function preload(): array
    {
        $accepts = array_values(array_filter((array) $this->config('accepts', []), 'is_string'));
        $kinds = array_values(array_diff($accepts, [self::ENTRY_URL]));
        $stores = Stores::all();
        $fields = [];

        foreach (Collection::all() as $collection) {
            if (in_array($collection->handle(), $stores, true)) {
                continue;
            }

            $own = $kinds === [] ? [] : Options::fieldsOf($collection, $kinds);

            if (in_array(self::ENTRY_URL, $accepts, true)) {
                array_unshift($own, [
                    'handle' => 'url',
                    'display' => __('sve::messages.entry_field_url'),
                    'type' => self::ENTRY_URL,
                ]);
            }

            $fields[$collection->handle()] = $this->distinct($own);
        }

        return [
            'fields' => $fields,
            'collections' => Options::collectionOptions(),
        ];
    }

    public function preProcess($data)
    {
        return $this->handleOf($data);
    }

    public function process($data)
    {
        return $this->handleOf($data);
    }

    /**
     * To felter med samme navn (Title og SEO-fanens Title) kan ikke skelnes i
     * en liste — de får deres handle bag på.
     *
     * @param  list<array{handle: string, display: string, type: string}>  $fields
     * @return list<array{handle: string, display: string, type: string}>
     */
    private function distinct(array $fields): array
    {
        $counts = array_count_values(array_map(fn ($field) => mb_strtolower($field['display']), $fields));

        return array_map(function ($field) use ($counts) {
            if ($counts[mb_strtolower($field['display'])] > 1) {
                $field['display'] .= ' ('.$field['handle'].')';
            }

            return $field;
        }, $fields);
    }

    private function handleOf(mixed $data): ?string
    {
        return is_string($data) && preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $data) ? $data : null;
    }
}
