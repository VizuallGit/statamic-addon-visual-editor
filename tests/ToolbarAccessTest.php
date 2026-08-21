<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\ToolbarAccess;
use Statamic\Contracts\Auth\User;

class ToolbarAccessTest extends TestCase
{
    public function test_custom_html_defaults_to_super_admins(): void
    {
        $this->assertSame(ToolbarAccess::AUDIENCE_SUPER, ToolbarAccess::rule('template_dock')['audience']);
    }

    public function test_other_icons_default_to_everyone(): void
    {
        foreach (['pages', 'globals', 'sections', 'listview', 'ai_panel', 'comments'] as $key) {
            $this->assertSame(ToolbarAccess::AUDIENCE_EVERYONE, ToolbarAccess::rule($key)['audience'], $key);
        }
    }

    public function test_nobody_is_allowed_without_a_user(): void
    {
        $this->assertFalse(ToolbarAccess::allows('pages', null));
        $this->assertFalse(ToolbarAccess::allows('template_dock', null));
    }

    public function test_everyone_allows_any_logged_in_user(): void
    {
        $this->assertTrue(ToolbarAccess::allows('pages', $this->user(super: false)));
        $this->assertTrue(ToolbarAccess::allows('comments', $this->user(super: false)));
    }

    public function test_super_audience_rejects_a_regular_user(): void
    {
        config(['statamic-visual-editor.features.template_dock' => true]);
        Features::flush();

        $this->assertFalse(ToolbarAccess::allows('template_dock', $this->user(super: false)));
        $this->assertTrue(ToolbarAccess::allows('template_dock', $this->user(super: true)));
    }

    public function test_named_people_match_user_id_or_group(): void
    {
        config([
            'statamic-visual-editor.features.template_dock' => true,
            'statamic-visual-editor.features.template_dock_access' => [
                'audience' => 'people',
                'users' => ['me'],
                'groups' => ['coders'],
            ],
        ]);
        Features::flush();

        $this->assertTrue(ToolbarAccess::allows('template_dock', $this->user(super: false, id: 'me')));
        $this->assertTrue(ToolbarAccess::allows('template_dock', $this->user(super: false, id: 'other', groups: ['coders'])));
        $this->assertFalse(ToolbarAccess::allows('template_dock', $this->user(super: true, id: 'customer')));
    }

    public function test_per_tool_access_wins_over_the_legacy_blob(): void
    {
        config([
            'statamic-visual-editor.features.template_dock' => true,
            'statamic-visual-editor.features.toolbar_access' => [
                'template_dock' => ['audience' => 'super'],
            ],
            'statamic-visual-editor.features.template_dock_access' => [
                'audience' => 'everyone',
            ],
        ]);
        Features::flush();

        $this->assertTrue(ToolbarAccess::allows('template_dock', $this->user(super: false)));
    }

    public function test_legacy_blob_is_used_when_the_per_tool_key_is_missing(): void
    {
        config([
            'statamic-visual-editor.features.pages_access' => null,
            'statamic-visual-editor.features.toolbar_access' => [
                'pages' => ['audience' => 'super'],
            ],
        ]);
        Features::flush();

        $this->assertFalse(ToolbarAccess::allows('pages', $this->user(super: false)));
        $this->assertTrue(ToolbarAccess::allows('pages', $this->user(super: true)));
    }

    public function test_site_toggle_still_hides_the_tool(): void
    {
        config(['statamic-visual-editor.features.template_dock' => false]);
        Features::flush();

        $this->assertFalse(Features::allows('template_dock', $this->user(super: true)));
    }

    public function test_normalize_fills_defaults_for_missing_keys(): void
    {
        $rules = ToolbarAccess::normalize(['pages' => ['audience' => 'super']]);

        $this->assertSame('super', $rules['pages']['audience']);
        $this->assertSame('everyone', $rules['globals']['audience']);
        $this->assertSame('super', $rules['template_dock']['audience']);
        $this->assertSame([], $rules['pages']['users']);
    }

    /** @param  list<string>  $groups */
    protected function user(bool $super, string $id = 'u1', array $groups = []): User
    {
        $user = $this->createMock(User::class);
        $user->method('isSuper')->willReturn($super);
        $user->method('getAuthIdentifier')->willReturn($id);
        $user->method('isInGroup')->willReturnCallback(
            fn ($group) => in_array((string) $group, $groups, true)
        );

        return $user;
    }
}
