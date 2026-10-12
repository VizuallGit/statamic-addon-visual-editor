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
    public function test_the_model_is_the_one_picked_then_the_sites_then_config(): void
    {
        $this->assertSame('default', CursorAgent::model());

        config(['statamic-visual-editor.ai.model' => 'composer-2.5']);

        $this->assertSame('composer-2.5', CursorAgent::model());
        $this->assertSame('grok-4.7', CursorAgent::model('grok-4.7'));
        $this->assertSame('default', CursorAgent::model('default'));

        config(['statamic-visual-editor.features.ai_model' => 'claude-opus-5-5']);

        $this->assertSame('claude-opus-5-5', CursorAgent::model());
        $this->assertSame('claude-opus-5-5', CursorAgent::model('not a model; rm -rf'));
    }

    public function test_the_picker_offers_auto_and_the_newest_of_each_family(): void
    {
        // Cursor's list on 12 Oct 2026, in Cursor's order.
        $listed = array_map(fn ($id) => ['id' => $id, 'name' => $id], [
            'default', 'grok-4.7', 'grok-4.6', 'composer-2.5', 'claude-opus-5-5', 'claude-opus-5', 'claude-opus-4-8',
            'gpt-5.6-sol', 'gpt-5.5', 'claude-fable-5-1', 'claude-fable-5', 'grok-4.5', 'gemini-3.8-flash',
            'gemini-3.7-flash', 'muse-spark-1.3', 'gpt-5.6-terra', 'claude-sonnet-5-5', 'claude-sonnet-5',
            'claude-sonnet-4-6', 'composer-2', 'gpt-5.3-codex', 'claude-opus-4-7', 'gpt-5.4', 'claude-opus-4-6',
            'claude-opus-4-5', 'gpt-5.2', 'gpt-5.6-luna', 'gemini-3.6-flash', 'gemini-3.1-pro', 'gpt-5.4-mini',
            'gpt-5.4-nano', 'claude-haiku-5-5', 'claude-haiku-4-5', 'claude-sonnet-4-5', 'gpt-5.1', 'gemini-3-flash',
            'gemini-3.5-flash', 'claude-sonnet-4', 'gpt-5-mini', 'gemini-2.5-flash', 'kimi-k3', 'kimi-k2.7-code',
            'glm-5.2', 'glm-5p3', 'glm-5p3-flash',
        ]);

        $picked = \MarioHamann\StatamicVisualEditor\AiChat\Models::modern($listed);

        $this->assertSame([
            'default',
            'composer-2.5',
            'claude-opus-5-5', 'claude-fable-5-1', 'claude-sonnet-5-5', 'claude-haiku-5-5',
            'gpt-5.6-sol', 'gpt-5.6-terra', 'gpt-5.6-luna', 'gpt-5.3-codex',
            'grok-4.7',
            'gemini-3.8-flash', 'gemini-3.1-pro',
        ], array_column($picked, 'id'));
        $this->assertSame(['Auto', 'Cursor', 'Claude', 'Claude', 'Claude', 'Claude', 'GPT', 'GPT', 'GPT', 'GPT', 'Grok', 'Gemini', 'Gemini'], array_column($picked, 'group'));
    }

    public function test_a_new_version_takes_its_familys_place_by_itself(): void
    {
        $picked = \MarioHamann\StatamicVisualEditor\AiChat\Models::modern(array_map(fn ($id) => ['id' => $id, 'name' => $id], [
            'grok-4.7', 'grok-4.8', 'claude-opus-5-5', 'claude-opus-6', 'composer-2.5', 'composer-3', 'gpt-5.6-sol', 'gpt-5.7',
        ]));

        $this->assertSame(['composer-3', 'claude-opus-6', 'gpt-5.7', 'grok-4.8'], array_column($picked, 'id'));
    }

    public function test_a_run_that_writes_leaves_out_the_project_layer_when_it_brings_mcp_servers(): void
    {
        config(['statamic-visual-editor.features.ai_project_rules' => true]);

        $mcp = base_path('.cursor/mcp.json');
        @mkdir(dirname($mcp), 0775, true);

        $this->assertSame(['project'], CursorAgent::settingSourcesFor(true));

        file_put_contents($mcp, '{"mcpServers": {}}');

        try {
            // Its MCP servers would write where the gate cannot see.
            $this->assertSame([], CursorAgent::settingSourcesFor(true));
            // A run that cannot write is offered no MCP, so it keeps the rules.
            $this->assertSame(['project'], CursorAgent::settingSourcesFor(false));
        } finally {
            @unlink($mcp);
            @rmdir(dirname($mcp));
        }
    }
}
