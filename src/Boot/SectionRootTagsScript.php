<?php

namespace MarioHamann\StatamicVisualEditor\Boot;

use Illuminate\Support\Facades\View;
use MarioHamann\StatamicVisualEditor\SectionRootTags;
use MarioHamann\StatamicVisualEditor\SectionTypeMaker;
use Statamic\Statamic;

/**
 * `sveSectionRootTags`: each section type's first tag, for the HTML tree's
 * shut rows (see SectionRootTags). `sveSectionScaffold`: the markup a new
 * section starts as (SectionTypeMaker::scaffold), so the dock's help writes
 * a section root the same way the maker does — one source, not a copy in JS.
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
                'sveSectionScaffold' => SectionTypeMaker::scaffold(),
            ]);
        });
    }
}
