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
    public function test_the_result_is_found_even_when_the_sdk_prints_first()
    {
        // What loading settings layers actually looked like: two INFO lines on
        // stdout, then the result. Before this, a working run read as a failure.
        $noisy = "16:20:26.807 INFO  LocalCursorRulesService load completed meta={ruleCount: 14}\n"
            ."16:20:26.813 INFO  AgentSkillsCursorRulesService load completed meta={skillCount: 21}\n"
            .'{"status":"finished","reply":"OK","error":null}';

        $out = $this->decode($noisy);

        $this->assertSame('finished', $out['status']);
        $this->assertSame('OK', $out['reply']);
    }

    public function test_clean_output_still_decodes()
    {
        $out = $this->decode('{"status":"finished","reply":"Hi","error":null}');

        $this->assertSame('Hi', $out['reply']);
    }

    public function test_output_with_no_result_in_it_is_a_failure()
    {
        $this->assertNull($this->decode("INFO something\nINFO something else"));
        $this->assertNull($this->decode(''));
        // JSON, but not the runner's answer.
        $this->assertNull($this->decode('{"ruleCount": 14}'));
    }

    protected function decode(string $output): ?array
    {
        $method = new \ReflectionMethod(CursorAgent::class, 'decode');
        $method->setAccessible(true);

        return $method->invoke(null, $output);
    }

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
