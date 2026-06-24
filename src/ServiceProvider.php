<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\View;
use MarioHamann\StatamicVisualEditor\Fieldtypes\AutoUuidFieldtype;
use MarioHamann\StatamicVisualEditor\Http\Middleware\InjectBridgeScript;
use MarioHamann\StatamicVisualEditor\Listeners\InjectVisualIdIntoBlueprint;
use MarioHamann\StatamicVisualEditor\Listeners\StripVisualIds;
use MarioHamann\StatamicVisualEditor\Tags\VisualEdit;
use Statamic\Events\EntryBlueprintFound;
use Statamic\Events\EntrySaving;
use Statamic\Events\GlobalVariablesBlueprintFound;
use Statamic\Events\GlobalVariablesSaving;
use Statamic\Providers\AddonServiceProvider;
use Statamic\Statamic;

class ServiceProvider extends AddonServiceProvider
{
    protected $fieldtypes = [
        AutoUuidFieldtype::class,
    ];

    protected $tags = [
        VisualEdit::class,
    ];

    protected $listen = [
        EntryBlueprintFound::class => [
            InjectVisualIdIntoBlueprint::class,
        ],
        GlobalVariablesBlueprintFound::class => [
            InjectVisualIdIntoBlueprint::class,
        ],
        EntrySaving::class => [
            StripVisualIds::class,
        ],
        GlobalVariablesSaving::class => [
            StripVisualIds::class,
        ],
    ];

    protected $middlewareGroups = [
        'web' => [
            InjectBridgeScript::class,
        ],
    ];

    public function bootAddon()
    {
        // Provide the set preview-image map to the CP script. Bound to the CP
        // scripts partial so it only runs on Control Panel page renders (not the
        // front-end), and after routing so the blueprints are resolvable.
        View::composer('statamic::partials.scripts', function () {
            Statamic::provideToScript(['svePreviewImages' => SetPreviewImages::map()]);
        });
    }

    protected $vite = [
        'input' => [
            'resources/js/addon.js',
        ],
        'publicDirectory' => 'resources/dist',
    ];
}
