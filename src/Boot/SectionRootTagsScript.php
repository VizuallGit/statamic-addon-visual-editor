<?php

namespace MarioHamann\StatamicVisualEditor\Boot;

use Illuminate\Support\Facades\View;
use MarioHamann\StatamicVisualEditor\SectionRootTags;
use Statamic\Statamic;

/**
 * `sveSectionRootTags`: each section type's first tag, for the HTML tree's
 * shut rows (see SectionRootTags).
 *
 * Bound to the CP scripts partial like ControlPanelScript, so it only runs on
 * Control Panel page renders.
 */
final class SectionRootTagsScript
{
    public static function register(): void
    {
        View::composer('statamic::partials.scripts', function () {
            Statamic::provideToScript([
                'sveSectionRootTags' => SectionRootTags::map(),
            ]);
        });
    }
}
