<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Http\Middleware\InjectBridgeScript;
use MarioHamann\StatamicVisualEditor\Tags\SvePageTransition;

class SvePageTransitionTest extends TestCase
{
    public function test_the_tag_is_registered(): void
    {
        $this->assertContains('sve_page_transition', collect(app('statamic.tags'))->keys()->all());
    }

    public function test_it_asks_for_page_transitions_with_the_three_motions_and_respects_reduced_motion(): void
    {
        $css = SvePageTransition::css();

        $this->assertMatchesRegularExpression('/@view-transition\s*\{\s*navigation:\s*auto;/', $css);

        foreach (['smooth', 'spring', 'snappy'] as $motion) {
            $this->assertStringContainsString("::view-transition-group(*.{$motion})", $css);
        }

        $this->assertStringContainsString('@media (prefers-reduced-motion)', $css);
        $this->assertStringNotContainsString('{{', $css);
    }

    public function test_live_preview_still_turns_them_off_after_it(): void
    {
        $this->assertStringContainsString('navigation: none', InjectBridgeScript::pageTransitionGuardFor(null));
    }
}
