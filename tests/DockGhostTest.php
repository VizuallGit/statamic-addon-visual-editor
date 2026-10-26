<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use MarioHamann\StatamicVisualEditor\CursorAgent;
use MarioHamann\StatamicVisualEditor\DockGhost;
use MarioHamann\StatamicVisualEditor\DockGhost\Caret;
use MarioHamann\StatamicVisualEditor\DockGhost\Cases;
use MarioHamann\StatamicVisualEditor\DockGhost\Prompt;
use MarioHamann\StatamicVisualEditor\DockGhost\Reply;
use MarioHamann\StatamicVisualEditor\DockGhost\Tokens;
use MarioHamann\StatamicVisualEditor\DockGhost\Usage;
use Illuminate\Support\Facades\File;
use MarioHamann\StatamicVisualEditor\Features;
use Symfony\Component\Process\Process;

/**
 * The AI in the HTML dock: the requests the grey text and ⌘K send, the
 * answers made of the replies, the site's words it is given, what it costs,
 * the cases `sve:ghost-try` cuts from a section, and the two ways to ask —
 * Cursor (the default) or Claude.
 */
class DockGhostTest extends TestCase
{
    use FakesCursorAgent;

    protected function setUp(): void
    {
        parent::setUp();

        File::deleteDirectory(Usage::directory());
    }

    protected function tearDown(): void
    {
        File::deleteDirectory(Usage::directory());
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

    public function test_the_caret_s_own_indentation_is_not_written_twice(): void
    {
        $this->assertSame("<p>{{ text }}</p>\n  <p>more</p>", Reply::clean("  <p>{{ text }}</p>\n  <p>more</p>", "<div>\n  "));
        $this->assertSame('  x', Reply::clean('  x', '<div class="a"'));
    }

    public function test_an_answer_is_cut_to_a_few_lines_and_empty_stays_empty(): void
    {
        $long = implode("\n", array_fill(0, 20, '<p>x</p>'));

        $this->assertCount(Reply::MAX_LINES['line'], explode("\n", Reply::clean($long)));
        $this->assertCount(20, explode("\n", Reply::clean($long, '', '', 'comment')));
        $this->assertSame('', Reply::clean("  \n "));
    }

    public function test_it_asks_anthropic_with_the_key_and_returns_the_tidied_text(): void
    {
        config(['statamic-visual-editor.ghost.provider' => 'claude', 'statamic-visual-editor.ghost.api_key' => 'sk-ant-test']);

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
        config(['statamic-visual-editor.ghost.provider' => 'claude', 'statamic-visual-editor.ghost.api_key' => 'sk-ant-test']);

        Http::fake([DockGhost::ENDPOINT => Http::response(['content' => [], 'stop_reason' => 'refusal', 'usage' => []])]);

        $out = DockGhost::complete(['before' => '<div>']);

        $this->assertTrue($out['ok']);
        $this->assertSame('', $out['text']);
    }

    public function test_anthropic_s_own_error_is_passed_on(): void
    {
        config(['statamic-visual-editor.ghost.provider' => 'claude', 'statamic-visual-editor.ghost.api_key' => 'sk-ant-wrong']);

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
            'statamic-visual-editor.ghost.provider' => 'claude',
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

    /* ---- The site's words ---------------------------------------------------- */

    public function test_the_tokens_fold_scales_and_name_how_a_class_reads_them(): void
    {
        $css = "@theme {\n --color-*: initial;\n --color-primary: #111;\n --color-primary-100: #eee;\n --color-primary-900: #000;\n --text-300: 1rem;\n --text-300--line-height: 1.2;\n --size-100: 1rem;\n}\n@utility flow-y { & > * + * { margin-top: 1em; } }";

        $words = Tokens::vocabulary($css, ['wrapper', 'flow-y']);

        $this->assertStringContainsString('Colours (bg-, text-, border-, fill-, …): primary, primary-{100,900}', $words);
        $this->assertStringContainsString('Text sizes (text-…): 300', $words);
        $this->assertStringNotContainsString('line-height', $words);
        $this->assertStringContainsString("The site's own classes (its CSS files and sections): flow-y, wrapper", $words);
        $this->assertStringContainsString('Custom properties, for var(--…): --size-100', $words);
    }

    public function test_no_theme_means_no_token_block(): void
    {
        $this->assertSame('', Tokens::vocabulary(''));
    }

    /* ---- Comment → code ------------------------------------------------------ */

    public function test_a_comment_asks_for_a_whole_block_with_room_for_it(): void
    {
        $body = DockGhost::body(['mode' => 'comment', 'before' => "{{# card: image left #}}\n", 'after' => '']);

        $this->assertSame(DockGhost::MAX_TOKENS['comment'], $body['max_tokens']);
        $this->assertStringStartsWith('Task: '.Prompt::TASKS['comment'], $body['messages'][0]['content']);
    }

    public function test_an_unknown_mode_is_a_line(): void
    {
        $this->assertSame('line', Prompt::mode(['mode' => 'nonsense']));
    }

    /* ---- The author's way of writing ------------------------------------------ */

    public function test_what_the_author_took_goes_along_newest_last_and_short(): void
    {
        $taken = [];

        for ($i = 1; $i <= 8; $i++) {
            $taken[] = ['line' => "<h2 {$i}", 'text' => "edit field=\"t{$i}\" }}"];
        }

        $text = Prompt::user(['before' => '<div>', 'taken' => $taken]);

        $this->assertStringContainsString('What this author took from you lately', $text);
        $this->assertStringNotContainsString('t2"', $text);
        $this->assertStringContainsString('- after `<h2 8`: `edit field="t8" }}`', $text);
    }

    /* ---- ⌘K ------------------------------------------------------------------ */

    public function test_cmd_k_uses_the_stronger_model_with_the_refusal_fallback(): void
    {
        config(['statamic-visual-editor.ghost.provider' => 'claude', 'statamic-visual-editor.ghost.api_key' => 'sk-ant-test']);

        Http::fake([DockGhost::ENDPOINT => Http::response([
            'content' => [['type' => 'text', 'text' => "```html\n<h3 class=\"text-secondary\">{{ title }}</h3>\n```"]],
            'stop_reason' => 'end_turn',
            'usage' => ['input_tokens' => 900, 'output_tokens' => 30],
        ])]);

        $out = DockGhost::edit([
            'instruction' => 'Make it an h3',
            'before' => "<div>\n  ",
            'selection' => "<h2>{{ title }}</h2>\n",
            'after' => '</div>',
        ]);

        $this->assertTrue($out['ok']);
        $this->assertSame("<h3 class=\"text-secondary\">{{ title }}</h3>\n", $out['text']);

        Http::assertSent(fn (Request $request) => $request['model'] === 'claude-opus-5-5'
            && ! isset($request['thinking'])
            && $request['fallbacks'] === 'default'
            && $request->hasHeader('anthropic-beta', DockGhost::FALLBACK_BETA)
            && str_contains($request['messages'][0]['content'], "Instruction: Make it an h3\n")
            && str_contains($request['messages'][0]['content'], "<selection><h2>{{ title }}</h2>\n</selection>"));
    }

    public function test_cmd_k_without_a_selection_writes_at_the_caret(): void
    {
        config(['statamic-visual-editor.ghost.provider' => 'claude', 'statamic-visual-editor.ghost.api_key' => 'sk-ant-test']);

        Http::fake([DockGhost::ENDPOINT => Http::response(['content' => [['type' => 'text', 'text' => '<p>{{ text }}</p>']], 'usage' => []])]);

        DockGhost::edit(['instruction' => 'a paragraph with the text', 'before' => '<div>', 'after' => '</div>']);

        Http::assertSent(fn (Request $request) => str_starts_with($request['messages'][0]['content'], 'Task: '.Prompt::TASKS['insert'])
            && ! str_contains($request['messages'][0]['content'], '<selection>'));
    }

    public function test_the_fallback_can_be_switched_off(): void
    {
        config(['statamic-visual-editor.ghost.fallbacks' => false]);

        $this->assertArrayNotHasKey('fallbacks', DockGhost::body(['mode' => 'edit', 'instruction' => 'x', 'selection' => 'y']));
    }

    public function test_cmd_k_needs_an_instruction_and_a_selection_of_reasonable_size(): void
    {
        config(['statamic-visual-editor.ghost.provider' => 'claude', 'statamic-visual-editor.ghost.api_key' => 'sk-ant-test']);
        Http::fake();

        $this->assertSame(422, DockGhost::edit(['instruction' => '  ', 'selection' => 'x'])['status']);
        $this->assertSame(422, DockGhost::edit(['instruction' => 'x', 'selection' => str_repeat('a', Prompt::SELECTION + 1)])['status']);
        Http::assertNothingSent();
    }

    public function test_a_replacement_ends_as_the_selection_did_and_starts_where_it_did(): void
    {
        $this->assertSame("<h3>x</h3>\n", Reply::edit('<h3>x</h3>', "<h2>x</h2>\n"));
        $this->assertSame('<h3>x</h3>', Reply::edit("<h3>x</h3>\n\n", '<h2>x</h2>'));
        $this->assertSame('<h3>x</h3>', Reply::edit('    <h3>x</h3>', '<h2>x</h2>'));
        $this->assertSame("  <h3>x</h3>\n", Reply::edit("  <h3>x</h3>\n", "  <h2>x</h2>\n"));
    }

    /* ---- What it costs ------------------------------------------------------- */

    public function test_the_cost_is_reckoned_at_list_price(): void
    {
        $this->assertEqualsWithDelta(
            (1000 * 0.10 + 100 * 0.50 + 4000 * 0.01 + 2000 * 0.125) / 1_000_000,
            Usage::cost('claude-haiku-5-5', ['input' => 1000, 'output' => 100, 'cache_read' => 4000, 'cache_write' => 2000]),
            1e-12,
        );
        $this->assertNull(Usage::cost('some-other-model', ['input' => 1]));
    }

    public function test_each_answer_is_added_to_the_month(): void
    {
        config(['statamic-visual-editor.ghost.provider' => 'claude', 'statamic-visual-editor.ghost.api_key' => 'sk-ant-test']);

        Http::fake([DockGhost::ENDPOINT => Http::response([
            'content' => [['type' => 'text', 'text' => 'x']],
            'usage' => ['input_tokens' => 1000, 'output_tokens' => 10],
        ])]);

        DockGhost::complete(['before' => '<div>']);
        DockGhost::complete(['before' => '<div>']);

        $month = Usage::month();

        $this->assertSame(2, $month['requests']);
        $this->assertSame(['line' => 2], $month['modes']);
        $this->assertEqualsWithDelta(2 * (1000 * 0.10 + 10 * 0.50) / 1_000_000, $month['cost'], 1e-9);
    }

    public function test_the_endpoints_for_cmd_k_and_the_month(): void
    {
        $user = \Statamic\Facades\User::make()->email('ghost-edit@example.com')->makeSuper();
        $user->save();
        $this->actingAs($user);

        config([
            'statamic-visual-editor.features.template_dock' => true,
            'statamic-visual-editor.features.dock_ghost' => true,
            'statamic-visual-editor.ghost.provider' => 'claude',
            'statamic-visual-editor.ghost.api_key' => 'sk-ant-test',
        ]);
        Features::flush();

        Http::fake([DockGhost::ENDPOINT => Http::response([
            'content' => [['type' => 'text', 'text' => '<h3>x</h3>']],
            'usage' => ['input_tokens' => 10, 'output_tokens' => 5],
        ])]);

        $this->postJson('/!/sve/dock-ghost/edit', ['instruction' => 'h3', 'before' => '', 'selection' => '<h2>x</h2>', 'after' => ''])
            ->assertOk()
            ->assertJson(['ok' => true, 'text' => '<h3>x</h3>']);

        $this->getJson('/!/sve/dock-ghost/usage')
            ->assertOk()
            ->assertJson(['ok' => true, 'requests' => 1, 'modes' => ['edit' => 1]]);

        $user->delete();
    }

    /* ---- Cursor or Claude ---------------------------------------------------- */

    public function test_the_cursor_key_alone_is_enough_and_cursor_is_the_default(): void
    {
        config([
            'statamic-visual-editor.features.template_dock' => true,
            'statamic-visual-editor.features.dock_ghost' => true,
            'statamic-visual-editor.ai.api_key' => 'crsr-test',
        ]);
        Features::flush();

        $this->assertSame('cursor', DockGhost::provider());
        $this->assertTrue(DockGhost::ready());
    }

    public function test_an_unknown_provider_is_cursor(): void
    {
        config(['statamic-visual-editor.ghost.provider' => 'gpt']);

        $this->assertSame('cursor', DockGhost::provider());
    }

    public function test_grey_text_on_the_cursor_key_asks_the_cursor_agent(): void
    {
        config(['statamic-visual-editor.ai.api_key' => 'crsr-test']);
        Http::fake();
        $agent = $this->fakeCursorAgent("```html\n<p>{{ text }}</p>\n```");

        $out = DockGhost::complete(['before' => "<div>\n  ", 'after' => "\n</div>", 'section' => 'hero/style_2']);

        $this->assertTrue($out['ok']);
        $this->assertSame('cursor', $out['via']);
        $this->assertSame('<p>{{ text }}</p>', $out['text']);
        $this->assertCount(1, $agent::$payloads);

        $sent = $agent::$payloads[0];

        // No write scope: no file tools, no shell.
        $this->assertArrayNotHasKey('write', $sent);
        $this->assertStringStartsWith(Prompt::CONTEXT, $sent['prompt']);
        // An empty line between elements: room for a block.
        $this->assertStringContainsString('Task: '.Prompt::TASKS['block'], $sent['prompt']);
        $this->assertStringEndsWith(DockGhost::CURSOR_REPLY, $sent['prompt']);
        Http::assertNothingSent();

        $month = Usage::month();

        $this->assertSame(1, $month['requests']);
        $this->assertSame(0.0, $month['cost']);
    }

    public function test_cmd_k_on_the_cursor_key_rewrites_the_selection(): void
    {
        config(['statamic-visual-editor.ai.api_key' => 'crsr-test']);
        $agent = $this->fakeCursorAgent('<h3 class="text-secondary">{{ title }}</h3>');

        $out = DockGhost::edit([
            'instruction' => 'Make it an h3',
            'before' => "<div>\n  ",
            'selection' => "<h2>{{ title }}</h2>\n",
            'after' => '</div>',
        ]);

        $this->assertTrue($out['ok']);
        $this->assertSame("<h3 class=\"text-secondary\">{{ title }}</h3>\n", $out['text']);
        $this->assertStringContainsString("Instruction: Make it an h3\n", $agent::$payloads[0]['prompt']);
        $this->assertStringContainsString("<selection><h2>{{ title }}</h2>\n</selection>", $agent::$payloads[0]['prompt']);
    }

    public function test_the_cursor_agent_s_failure_is_passed_on(): void
    {
        config(['statamic-visual-editor.ai.api_key' => 'crsr-wrong']);
        $this->fakeCursorAgent(['status' => 'error', 'error' => 'Invalid API key']);

        $out = DockGhost::complete(['before' => '<div>']);

        $this->assertFalse($out['ok']);
        $this->assertSame(502, $out['status']);
        $this->assertSame('Invalid API key', $out['message']);
    }

    public function test_without_a_key_the_message_names_the_cursor_field(): void
    {
        Http::fake();
        $agent = $this->fakeCursorAgent('never');

        $out = DockGhost::complete(['before' => '<div>']);

        $this->assertSame(422, $out['status']);
        $this->assertStringContainsString('Cursor API key', $out['message']);
        $this->assertStringNotContainsString('Anthropic', $out['message']);
        $this->assertSame([], $agent::$payloads);
        Http::assertNothingSent();
    }

    public function test_claude_picked_asks_claude_and_not_cursor(): void
    {
        config([
            'statamic-visual-editor.ghost.provider' => 'claude',
            'statamic-visual-editor.ghost.api_key' => 'sk-ant-test',
            'statamic-visual-editor.ai.api_key' => 'crsr-test',
        ]);
        Http::fake([DockGhost::ENDPOINT => Http::response(['content' => [['type' => 'text', 'text' => '<p>x</p>']], 'usage' => []])]);
        $agent = $this->fakeCursorAgent('never');

        $out = DockGhost::complete(['before' => "<div>\n  "]);

        $this->assertSame('claude', $out['via']);
        $this->assertSame([], $agent::$payloads);
        Http::assertSentCount(1);
    }

    public function test_cursor_picked_asks_cursor_even_with_a_claude_key(): void
    {
        config([
            'statamic-visual-editor.ghost.api_key' => 'sk-ant-test',
            'statamic-visual-editor.ai.api_key' => 'crsr-test',
        ]);
        Http::fake();
        $agent = $this->fakeCursorAgent('<p>x</p>');

        $out = DockGhost::complete(['before' => "<div>\n  "]);

        $this->assertSame('cursor', $out['via']);
        $this->assertCount(1, $agent::$payloads);
        Http::assertNothingSent();
    }

    public function test_claude_picked_without_its_key_says_so_and_never_tries_cursor(): void
    {
        config([
            'statamic-visual-editor.ghost.provider' => 'claude',
            'statamic-visual-editor.ai.api_key' => 'crsr-test',
        ]);
        Http::fake();
        $agent = $this->fakeCursorAgent('never');

        $out = DockGhost::complete(['before' => '<div>']);

        $this->assertSame(422, $out['status']);
        $this->assertStringContainsString('Claude API key', $out['message']);
        $this->assertSame('', DockGhost::key());
        $this->assertSame([], $agent::$payloads);
        Http::assertNothingSent();
    }

    public function test_a_newer_question_stops_the_older_one_on_its_way(): void
    {
        $newest = new \ReflectionMethod(DockGhost::class, 'newest');

        $first = $newest->invoke(null, ['mode' => 'line']);
        $this->assertFalse($first());

        $second = $newest->invoke(null, ['mode' => 'comment']);
        $this->assertTrue($first());
        $this->assertFalse($second());

        $edit = $newest->invoke(null, ['mode' => 'edit']);
        $this->assertFalse($second(), 'Grey text and ⌘K are counted apart.');
        $this->assertFalse($edit());
    }

    public function test_jobs_are_newest_in_the_order_they_were_started_not_the_order_their_workers_boot(): void
    {
        $newest = new \ReflectionMethod(DockGhost::class, 'newest');

        DockGhost::claim('author', 'complete', 'job-a');
        DockGhost::claim('author', 'complete', 'job-b');

        // job-a's worker boots after job-b's: it is already the older one.
        $b = $newest->invoke(null, ['mode' => 'line', 'user' => 'author', 'job' => 'job-b']);
        $a = $newest->invoke(null, ['mode' => 'line', 'user' => 'author', 'job' => 'job-a']);

        $this->assertTrue($a());
        $this->assertFalse($b());

        $other = $newest->invoke(null, ['mode' => 'line', 'user' => 'someone-else']);
        $this->assertFalse($b(), 'Another author is counted apart.');
        $this->assertFalse($other());
    }

    public function test_a_newer_question_stops_the_agent_already_on_its_way(): void
    {
        config(['statamic-visual-editor.ai.api_key' => 'crsr-test']);
        DockGhost::claim('author', 'complete', 'job-a');

        // The agent for job-a takes its time; while it does, job-b is started.
        $this->app->instance(CursorAgent::class, new class extends CursorAgent
        {
            protected static function process(array $payload, int $timeout): Process
            {
                DockGhost::claim('author', 'complete', 'job-b');

                return new Process([PHP_BINARY, '-r', 'sleep(20);']);
            }
        });

        $started = microtime(true);
        $out = DockGhost::complete(['before' => "<div>\n  ", 'user' => 'author', 'job' => 'job-a']);

        $this->assertLessThan(5, microtime(true) - $started, 'The agent is stopped, not waited for.');
        $this->assertTrue($out['ok']);
        $this->assertSame('', $out['text']);
        $this->assertSame(0, Usage::month()['requests']);
    }

    /* ---- Where the caret stands ---------------------------------------------- */

    public function test_the_caret_is_read_from_the_markup_before_it(): void
    {
        $this->assertSame(
            ['kind' => 'attribute', 'tag' => 'section', 'attribute' => 'x-data', 'quote' => '"'],
            Caret::of('<section id="id-{{ id }}" class="wrapper" x-data="{ '),
        );
        $this->assertSame('attribute', Caret::of('<div x-show="count > 0 && name === \'Jo')['kind']);
        $this->assertSame(['kind' => 'antlers', 'tag' => 'h2'], Caret::of('<h2 {{ visual_'));
        $this->assertSame(['kind' => 'tag', 'tag' => 'ul'], Caret::of('<ul class="list" '));
        $this->assertSame(['kind' => 'markup', 'fresh' => true, 'inside' => 'ul'], Caret::of("<section>\n  <ul class=\"list\">\n    "));
        $this->assertSame(['kind' => 'markup', 'fresh' => false, 'inside' => 'p'], Caret::of('<div><img src="a.png"><p>Hello'));
        $this->assertSame('section', Caret::of("<section>\n  <ul>\n    <li>x</li>\n  </ul>\n  ")['inside']);
    }

    public function test_the_model_is_told_where_the_caret_is(): void
    {
        $text = Prompt::user(['before' => '<section class="wrapper" x-data="{ ', 'after' => ' }">']);

        $this->assertStringContainsString('Caret: The caret is inside the value of x-data="…" on <section>', $text);
        $this->assertStringContainsString('Alpine state', $text);
    }

    public function test_an_answer_about_the_task_is_no_suggestion(): void
    {
        $this->assertSame('', Reply::clean('The `<after>` text already contains the ul line, and the caret sits inside the tag.', '<section x-data="{ '));
        $this->assertSame('', Reply::clean("Completing the tag: `field=\"entries\"` closes the <after> block"));
    }

    public function test_an_answer_in_an_attribute_ends_where_the_value_does(): void
    {
        $this->assertSame('open: false }', Reply::clean("open: false }\">\n  <div>more</div>", '<section x-data="{ ', '"'));
        $this->assertSame('open: false }', Reply::clean('x-data="{ open: false }"', '<section x-data="{ '));
    }

    /* ---- An empty line: a block, a loop ---------------------------------------- */

    public function test_an_empty_line_between_elements_asks_for_a_block(): void
    {
        $this->assertSame('block', DockGhost::lineOrBlock("<ul>\n  "));
        $this->assertSame('line', DockGhost::lineOrBlock('<ul><li>Hel'));
        $this->assertSame('line', DockGhost::lineOrBlock("<div\n  "));
        $this->assertSame(600, DockGhost::body(['mode' => 'block', 'before' => "<ul>\n  "])['max_tokens']);
    }

    public function test_a_list_offers_the_loop_over_the_section_s_list_field(): void
    {
        $fields = [
            ['var' => 'title', 'type' => 'text'],
            ['var' => 'entries', 'type' => 'replicator'],
            ['var' => 'text', 'type' => 'textarea', 'parent' => 'entries'],
            ['var' => 'entries.name', 'type' => 'text', 'parent' => 'entries'],
        ];

        $this->assertSame(['entries' => ['text', 'name']], Prompt::lists($fields));

        $hint = Prompt::blockHint("<section>\n  <ul class=\"list\">\n    ", $fields);

        $this->assertStringContainsString('Caret: on an empty line inside <ul>.', $hint);
        $this->assertStringContainsString('entries (text, name)', $hint);
        $this->assertStringContainsString('This is a list: loop over the list field', $hint);
    }

    public function test_inside_an_open_loop_the_item_s_fields_are_named(): void
    {
        $fields = [['var' => 'entries'], ['var' => 'text', 'parent' => 'entries'], ['var' => 'name', 'parent' => 'entries']];

        $this->assertSame('entries', Prompt::openLoop("<ul>\n  {{ entries limit=\"3\" }}\n    ", ['entries']));
        $this->assertNull(Prompt::openLoop("{{ entries }}<li></li>{{ /entries }}\n", ['entries']));
        $this->assertStringContainsString('You are inside the loop {{ entries }}: each item has text, name.', Prompt::blockHint("<ul>\n  {{ entries }}\n    ", $fields));
    }

    public function test_a_block_at_an_indented_line_is_indented_under_the_caret(): void
    {
        $this->assertSame(
            "<li>\n        <p>{{ text }}</p>\n      </li>",
            Reply::clean("<li>\n  <p>{{ text }}</p>\n</li>", "<ul>\n    {{ entries }}\n      ", '', 'block'),
        );
        $this->assertSame(
            "{{ entries }}\n      <li></li>\n    {{ /entries }}",
            Reply::clean("{{ entries }}\n      <li></li>\n    {{ /entries }}", "<ul>\n    ", '', 'block'),
        );
    }
}
