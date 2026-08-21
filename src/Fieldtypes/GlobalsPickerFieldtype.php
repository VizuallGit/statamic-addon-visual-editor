<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Facades\GlobalSet;
use Statamic\Fields\Fieldtype;

/**
 * Which global sets the Live Preview globe menu lists.
 *
 * The options are this site's own global sets — a new set appears here without
 * anyone editing YAML. Header and footer start off (they are opened by clicking
 * them on the page); everything else starts on. An empty saved list is "show
 * none", which is different from never having chosen.
 */
class GlobalsPickerFieldtype extends Fieldtype
{
    protected $selectable = false;

    protected static $handle = 'globals_picker';

    public function component(): string
    {
        return 'globals-picker';
    }

    public function preload(): array
    {
        return [
            'sets' => GlobalSet::all()
                ->map(fn ($set) => [
                    'handle' => $set->handle(),
                    'title' => $set->title(),
                ])
                ->values()
                ->all(),
            'off' => Features::globalsPickerOffByDefault(),
        ];
    }

    public function preProcess($data)
    {
        return is_array($data) ? $this->normalize($data) : null;
    }

    public function process($data)
    {
        if ($data === null) {
            return null;
        }

        return $this->normalize($data);
    }

    /** @return list<string> */
    protected function normalize($data): array
    {
        return collect($data)
            ->filter(fn ($handle) => is_string($handle) && $handle !== '')
            ->unique()
            ->values()
            ->all();
    }
}
