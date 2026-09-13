<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\AiCopy;
use MarioHamann\StatamicVisualEditor\Keywords;

class AiCopyTest extends TestCase
{
    public function test_it_reads_a_json_array_of_suggestions(): void
    {
        $this->assertSame(
            ['Hypnose i Holstebro', 'Slip angsten'],
            AiCopy::parse('["Hypnose i Holstebro", "Slip angsten"]', 5),
        );
    }

    public function test_it_reads_json_that_arrived_in_a_code_fence(): void
    {
        $reply = "Here you go:\n```json\n[\"One\", \"Two\"]\n```\nHope that helps.";

        $this->assertSame(['One', 'Two'], AiCopy::parse($reply, 5));
    }

    public function test_it_reads_json_with_prose_around_it(): void
    {
        $this->assertSame(
            ['One', 'Two'],
            AiCopy::parse('Sure. ["One", "Two"] — let me know.', 5),
        );
    }

    public function test_it_falls_back_to_a_numbered_list(): void
    {
        $reply = "Here are three:\n1. First one\n2. Second one\n3. Third one";

        $this->assertSame(['First one', 'Second one', 'Third one'], AiCopy::parse($reply, 5));
    }

    public function test_it_never_returns_more_than_asked_for(): void
    {
        $this->assertCount(2, AiCopy::parse('["a","b","c","d","e"]', 2));
    }

    public function test_it_strips_quotes_the_model_wrapped_the_whole_line_in(): void
    {
        $this->assertSame(['Hypnose i Holstebro'], AiCopy::parse('["\"Hypnose i Holstebro\""]', 1));
    }

    public function test_it_keeps_a_quotation_inside_a_sentence(): void
    {
        $this->assertSame(
            ['She said "yes" and meant it.'],
            AiCopy::parse('["She said \"yes\" and meant it."]', 1),
        );
    }

    public function test_it_keeps_paragraph_breaks_in_rich_text(): void
    {
        $this->assertSame(
            ["First paragraph.\n\nSecond paragraph."],
            AiCopy::parse('["First paragraph.\n\nSecond paragraph."]', 1),
        );
    }

    public function test_it_drops_duplicates_and_empty_strings(): void
    {
        $this->assertSame(['One'], AiCopy::parse('["One", "One", "", "   "]', 5));
    }

    public function test_it_reads_objects_when_the_model_wraps_each_suggestion(): void
    {
        $this->assertSame(
            ['One', 'Two'],
            AiCopy::parse('[{"text": "One"}, {"heading": "Two"}]', 5),
        );
    }

    public function test_an_empty_reply_is_no_suggestions_rather_than_a_blank_one(): void
    {
        $this->assertSame([], AiCopy::parse('', 5));
        $this->assertSame([], AiCopy::parse('   ', 5));
    }

    public function test_the_count_is_clamped_to_what_a_popover_can_show(): void
    {
        $this->assertSame(1, AiCopy::count(['count' => 0]));
        $this->assertSame(1, AiCopy::count(['count' => -3]));
        $this->assertSame(5, AiCopy::count(['count' => 99]));
        $this->assertSame(3, AiCopy::count(['count' => 3]));
    }

    public function test_only_the_three_known_shapes_are_accepted(): void
    {
        $this->assertSame('heading', AiCopy::kindOf('heading'));
        $this->assertSame('rich', AiCopy::kindOf('RICH'));
        $this->assertSame('text', AiCopy::kindOf('nonsense'));
        $this->assertSame('text', AiCopy::kindOf(null));
    }

    public function test_keywords_come_out_of_a_list_a_string_or_neither(): void
    {
        $this->assertSame(['one', 'two'], Keywords::clean(['one', ' two ', '', 'one']));
        $this->assertSame(['one', 'two'], Keywords::clean('one, two'));
        $this->assertSame([], Keywords::clean(null));
        $this->assertSame([], Keywords::clean(42));
    }

    public function test_the_keyword_list_has_a_ceiling(): void
    {
        $many = array_map(fn ($i) => "word {$i}", range(1, 40));

        $this->assertCount(Keywords::MAX, Keywords::clean($many));
    }
}
