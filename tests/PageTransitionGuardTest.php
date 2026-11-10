<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Http\Controllers\ChromePrefsController;
use MarioHamann\StatamicVisualEditor\Http\Middleware\InjectBridgeScript;

class PageTransitionGuardTest extends TestCase
{
    public function test_live_preview_has_no_page_transitions_unless_the_user_turned_them_on(): void
    {
        foreach ([null, [], ['sve-anim-run' => 'on'], ['sve-page-transitions' => 'off'], 'on'] as $prefs) {
            $this->assertStringContainsString(
                '@view-transition { navigation: none; }',
                InjectBridgeScript::pageTransitionGuardFor($prefs)
            );
        }
    }

    public function test_the_user_who_turned_them_on_gets_the_sites_own(): void
    {
        $this->assertSame('', InjectBridgeScript::pageTransitionGuardFor(['sve-page-transitions' => 'on']));
    }

    public function test_the_server_keeps_the_setting_with_the_users_other_preferences(): void
    {
        $this->assertContains(InjectBridgeScript::PAGE_TRANSITIONS_KEY, ChromePrefsController::KEYS);
    }
}
