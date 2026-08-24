<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Http\Controllers;

use MarioHamann\StatamicVisualEditor\Http\Controllers\ChromePrefsController;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;

class ChromePrefsControllerTest extends TestCase
{
    public function test_guest_cannot_save_chrome_prefs(): void
    {
        $this->postJson('/!/sve/chrome-prefs', [
            'prefs' => ['sve-right-dock-width' => '400'],
        ])->assertStatus(403);
    }

    public function test_guest_cannot_reset_chrome_prefs(): void
    {
        $this->deleteJson('/!/sve/chrome-prefs')->assertStatus(403);
    }

    public function test_unknown_pref_keys_are_not_in_the_allow_list(): void
    {
        $this->assertContains('sve-right-dock-pinned', ChromePrefsController::KEYS);
        $this->assertContains('sve-lp-panel-mode', ChromePrefsController::KEYS);
        $this->assertContains('sve-listview-tab', ChromePrefsController::KEYS);
        $this->assertNotContains('sve-secret', ChromePrefsController::KEYS);
    }
}
