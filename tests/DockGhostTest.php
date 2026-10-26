<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use MarioHamann\StatamicVisualEditor\DockGhost;
use MarioHamann\StatamicVisualEditor\DockGhost\Cases;
use MarioHamann\StatamicVisualEditor\DockGhost\Prompt;
use MarioHamann\StatamicVisualEditor\DockGhost\Reply;
use MarioHamann\StatamicVisualEditor\Features;

/**
 * Grey text in the HTML dock: the request it sends, the answer it makes of
 * the reply, and the cases `sve:ghost-try` cuts from a section.
 */
class DockGhostTest extends TestCase
{
    protected function tearDown(): void
    {
        Features::flush();

        parent::tearDown();
    }

    public function test_it_is_off_when_nothing_has_turned_it_on(): void
    {
        $this->assertFalse(Features::enabled('dock_ghost'));
        $this->assertFalse(DockGhost::ready());
    }

    public function test_the_key_comes_from_config_when_the_settings_have_none(): void
    {
        config(['statamic-visual-editor.ghost.api_key' => 'sk-ant-from-env']);

        $this->assertSame('sk-ant-from-env', DockGhost::apiKey());
    }

    public function test_the_request_is_a_small_fast_one_with_the_stable_part_cached(): void
    {
        $body = DockGhost::body(['before' => '<h2 {{ visual_', 'after' => '>{{ title }}</h2>', 'section' => 'hero/style_2']);

        $this->assertSame('claude-haiku-5-5', $body['model']);
        $this->assertSame(['type' => 'disabled'], $body['thinking']);
        $this->assertSame(['effort' => 'low'], $body['output_config']);
        $this->assertArrayNotHasKey('temperature', $body);
        $this->assertSame(['type' => 'ephemeral'], $body['system'][0]['cache_control']);
        $this->assertStringContainsString('visual_edit', $body['system'][0]['text']);
        $this->assertSame('user', $body['messages'][0]['role']);
    }

    public function test_the_user_turn_holds_the_caret_between_before_and_after(): void
    {
        $text = Prompt::user([
            'before' => "<h2 class=\"x\" {{ visual_",
            'after' => ">{{ title }}</h2>\n",
            'section' => 'hero/style_2',
            'fields' => [['var' => 'title', 'type' => 'text', 'label' => 'Title'], ['var' => 'items.text', 'parent' => 'items']],
        ]);

        $this->assertStringContainsString("Section: hero/style_2\n", $text);
        $this->assertStringContainsString('- title · text · Title', $text);
        $this->assertStringContainsString('  - items.text', $text);
        $this->assertStringContainsString("{{ visual_</before>\n<after>>{{ title }}</h2>", $text);
    }

    public function test_without_fields_the_model_is_told_not_to_write_field_tags(): void
    {
        $this->assertStringContainsString('Fields: none known', Prompt::user(['before' => '<div>', 'after' => '']));
    }

    public function test_long_files_are_cut_at_line_boundaries(): void
    {
        $before = str_repeat("<p>line</p>\n", 400).'<h2 ';
        $after = str_repeat("<p>after</p>\n", 200);

        $cut = Prompt::before(['before' => $before]);
        $this->assertLessThanOrEqual(Prompt::BEFORE, strlen($cut));
        $this->assertStringStartsWith('<p>line</p>', $cut);
        $this->assertStringEndsWith('<h2 ', $cut);

        $tail = Prompt::after(['after' => $after]);
        $this->assertLessThanOrEqual(Prompt::AFTER, strlen($tail));
        $this->assertStringEndsWith('</p>', $tail);
    }

    public function test_the_visual_edit_reference_is_read_without_its_frontmatter(): void
    {
        $reference = Prompt::visualEditReference();

        $this->assertStringContainsString('field="title"', $reference);
        $this->assertStringNotContainsString('name: visual-editor-antlers', $reference);
    }

    public function test_a_fenced_answer_is_unwrapped(): void
    {
        $this->assertSame('edit field="title" }}', Reply::clean("```antlers\nedit field=\"title\" }}\n```"));
    }

    public function test_an_answer_that_repeats_what_was_typed_loses_the_repeat(): void
    {
        $this->assertSame(
            'edit field="title" inline_edit="true" }}',
            Reply::clean('{{ visual_edit field="title" inline_edit="true" }}', '<h2 {{ visual_'),
        );
    }

    public function test_an_answer_ending_with_what_follows_the_caret_loses_the_tail(): void
    {
        $this->assertSame(
            'edit field="title" inline_edit="true"',
            Reply::clean('edit field="title" inline_edit="true" }}', '<h2 {{ visual_', " }}>{{ title }}</h2>\n<p>"),
        );
    }

    public function test_a_short_overlap_of_spaces_is_not_taken_for_a_repeat(): void
    {
        $this->assertSame('  <p>{{ text }}</p>', Reply::clean('  <p>{{ text }}</p>', "<div>\n  "));
    }

    public function test_an_answer_is_cut_to_a_few_lines_and_empty_stays_empty(): void
    {
        $long = implode("\n", array_fill(0, 20, '<p>x</p>'));

        $this->assertCount(Reply::MAX_LINES, explode("\n", Reply::clean($long)));
        $this->assertSame('', Reply::clean("  \n "));
    }

    public function test_it_asks_anthropic_with_the_key_and_returns_the_tidied_text(): void
    {
        config(['statamic-visual-editor.ghost.api_key' => 'sk-ant-test']);

        Http::fake([
            DockGhost::ENDPOINT => Http::response([
                'content' => [['type' => 'text', 'text' => 'edit field="title" inline_edit="true" }}']],
                'stop_reason' => 'end_turn',
                'usage' => ['input_tokens' => 120, 'output_tokens' => 14, 'cache_read_input_tokens' => 4000, 'cache_creation_input_tokens' => 0],
            ]),
        ]);

        $out = DockGhost::complete(['before' => '<h2 {{ visual_', 'after' => ' }}>{{ title }}</h2>', 'section' => 'hero/style_2']);

        $this->assertTrue($out['ok']);
        $this->assertSame('edit field="title" inline_edit="true"', $out['text']);
        $this->assertSame(['input' => 120, 'output' => 14, 'cache_read' => 4000, 'cache_write' => 0], $out['usage']);

        Http::assertSent(fn (Request $request) => $request->hasHeader('x-api-key', 'sk-ant-test')
            && $request->hasHeader('anthropic-version', DockGhost::API_VERSION)
            && $request['model'] === 'claude-haiku-5-5');
    }

    public function test_a_refusal_is_no_suggestion(): void
    {
        config(['statamic-visual-editor.ghost.api_key' => 'sk-ant-test']);

        Http::fake([DockGhost::ENDPOINT => Http::response(['content' => [], 'stop_reason' => 'refusal', 'usage' => []])]);

        $out = DockGhost::complete(['before' => '<div>']);

        $this->assertTrue($out['ok']);
        $this->assertSame('', $out['text']);
    }

    public function test_anthropic_s_own_error_is_passed_on(): void
    {
        config(['statamic-visual-editor.ghost.api_key' => 'sk-ant-wrong']);

        Http::fake([DockGhost::ENDPOINT => Http::response(['error' => ['type' => 'authentication_error', 'message' => 'invalid x-api-key']], 401)]);

        $out = DockGhost::complete(['before' => '<div>']);

        $this->assertFalse($out['ok']);
        $this->assertSame(502, $out['status']);
        $this->assertSame('invalid x-api-key', $out['message']);
    }

    public function test_without_a_key_nothing_is_sent(): void
    {
        Http::fake();

        $out = DockGhost::complete(['before' => '<div>']);

        $this->assertFalse($out['ok']);
        $this->assertSame(422, $out['status']);
        Http::assertNothingSent();
    }

    public function test_cases_cut_a_section_where_visual_edit_is_typed(): void
    {
        $source = "<section {{ visual_edit outline_inside=\"true\" }}>\n  <h2 class=\"x\" {{ visual_edit field=\"title\" inline_edit=\"true\" }}>{{ title }}</h2>\n</section>";

        $cases = Cases::visualEdit('hero/style_2', $source);

        $this->assertCount(2, $cases);
        $this->assertStringEndsWith('<h2 class="x" {{ visual_', $cases[1]['before']);
        $this->assertStringStartsWith('>{{ title }}</h2>', $cases[1]['after']);
        $this->assertSame('edit field="title" inline_edit="true" }}', $cases[1]['expected']);
    }

    public function test_cases_cut_the_line_after_an_opening_tag(): void
    {
        $source = "<div class=\"wrap\">\n  <h2>{{ title }}</h2>\n</div>";

        $cases = Cases::nextLine('hero/style_2', $source);

        $this->assertCount(1, $cases);
        $this->assertSame("<div class=\"wrap\">\n  ", $cases[0]['before']);
        $this->assertSame("\n</div>", $cases[0]['after']);
        $this->assertSame('<h2>{{ title }}</h2>', $cases[0]['expected']);
    }

    public function test_a_short_run_takes_both_kinds_in_turn(): void
    {
        $cases = [
            ['kind' => 'visual_edit', 'n' => 1],
            ['kind' => 'visual_edit', 'n' => 2],
            ['kind' => 'next_line', 'n' => 3],
        ];

        $this->assertSame([1, 3], array_column(Cases::mixed($cases, 2), 'n'));
    }

    public function test_the_endpoint_refuses_while_the_feature_is_off(): void
    {
        $user = \Statamic\Facades\User::make()->email('ghost-off@example.com')->makeSuper();
        $user->save();
        $this->actingAs($user);

        config(['statamic-visual-editor.features.template_dock' => true]);
        Features::flush();

        $this->postJson('/!/sve/dock-ghost', ['before' => '<div>'])->assertForbidden();

        $user->delete();
    }

    public function test_the_endpoint_answers_with_the_text_when_on(): void
    {
        $user = \Statamic\Facades\User::make()->email('ghost-on@example.com')->makeSuper();
        $user->save();
        $this->actingAs($user);

        config([
            'statamic-visual-editor.features.template_dock' => true,
            'statamic-visual-editor.features.dock_ghost' => true,
            'statamic-visual-editor.ghost.api_key' => 'sk-ant-test',
        ]);
        Features::flush();

        Http::fake([DockGhost::ENDPOINT => Http::response([
            'content' => [['type' => 'text', 'text' => '<p>{{ text }}</p>']],
            'stop_reason' => 'end_turn',
            'usage' => [],
        ])]);

        $this->postJson('/!/sve/dock-ghost', ['before' => "<div>\n  ", 'after' => "\n</div>", 'section' => 'hero/style_2'])
            ->assertOk()
            ->assertJson(['ok' => true, 'text' => '<p>{{ text }}</p>']);

        $user->delete();
    }
}
