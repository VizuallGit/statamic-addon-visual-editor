<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\AiChat;

/**
 * The parts of the AI chat that need no Cursor account: the mode switch and
 * the instructions each mode is given. Pinned before the WP7d split.
 */
class AiChatTest extends TestCase
{
    public function test_build_is_the_only_other_mode(): void
    {
        $this->assertSame('build', AiChat::modeOf('build'));
        $this->assertSame('build', AiChat::modeOf(' Build '));
        $this->assertSame('write', AiChat::modeOf('write'));
        $this->assertSame('write', AiChat::modeOf('anything'));
        $this->assertSame('write', AiChat::modeOf(null));
    }

    public function test_write_mode_forbids_files_and_build_mode_edits_them(): void
    {
        $write = AiChat::modeInstructions('write');
        $build = AiChat::modeInstructions('build');

        $this->assertStringStartsWith('WRITE MODE', $write);
        $this->assertStringContainsString('Do not write, create, edit or delete any files', $write);
        $this->assertStringStartsWith('BUILD MODE', $build);
        $this->assertStringNotContainsString('Do not write', $build);
    }

    public function test_target_files_refuse_an_unsafe_handle(): void
    {
        $this->assertSame(
            ['handle' => '../etc', 'antlers' => null, 'fieldset' => null],
            AiChat::targetFiles('../etc')
        );
        $this->assertSame(['handle' => '', 'antlers' => null, 'fieldset' => null], AiChat::targetFiles(''));
    }
}
