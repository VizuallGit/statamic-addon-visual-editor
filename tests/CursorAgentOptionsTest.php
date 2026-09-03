<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\CursorAgent;

/**
 * The two options the agent may be given, and — more importantly — that it is
 * given neither unless the site asked. Off has to mean the run this addon has
 * always made, or turning the feature down is not a way back.
 */
class CursorAgentOptionsTest extends TestCase
{
    public function test_the_sdk_is_looked_for_where_node_would_look()
    {
        // The addon repo has its own node_modules, so this resolves here. What
        // the test pins is the walk itself: the answer is a path under a
        // node_modules directory, not a guess at one fixed location.
        $found = CursorAgent::sdkPath();

        if ($found === null) {
            $this->markTestSkipped('@cursor/sdk is not installed in this checkout.');
        }

        $this->assertStringEndsWith('node_modules/@cursor/sdk', $found);
        $this->assertDirectoryExists($found);
    }

    public function test_no_settings_layers_unless_the_site_asks()
    {
        $this->assertSame([], CursorAgent::settingSources());
    }

    public function test_project_rules_add_the_project_layer()
    {
        config(['statamic-visual-editor.features.ai_project_rules' => true]);

        $this->assertSame(['project'], CursorAgent::settingSources());
    }

    public function test_project_rules_off_is_the_same_as_never_set()
    {
        config(['statamic-visual-editor.features.ai_project_rules' => false]);

        $this->assertSame([], CursorAgent::settingSources());
    }

    public function test_no_mcp_servers_by_default()
    {
        $this->assertSame([], CursorAgent::mcpServers());
    }

    public function test_mcp_servers_come_from_config()
    {
        config(['statamic-visual-editor.ai.mcp_servers' => [
            'statamic' => ['command' => 'php', 'args' => ['artisan', 'boost:mcp']],
            'docs' => ['url' => 'https://example.test/mcp'],
        ]]);

        $servers = CursorAgent::mcpServers();

        $this->assertSame(['statamic', 'docs'], array_keys($servers));
        $this->assertSame('php', $servers['statamic']['command']);
    }

    public function test_junk_entries_are_dropped_rather_than_passed_on()
    {
        config(['statamic-visual-editor.ai.mcp_servers' => [
            'good' => ['url' => 'https://example.test/mcp'],
            'empty' => [],
            'wrong' => 'not-an-array',
        ]]);

        $this->assertSame(['good'], array_keys(CursorAgent::mcpServers()));
    }

    public function test_a_non_array_config_is_ignored()
    {
        config(['statamic-visual-editor.ai.mcp_servers' => 'nonsense']);

        $this->assertSame([], CursorAgent::mcpServers());
    }
}
