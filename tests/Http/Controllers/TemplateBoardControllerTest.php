<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Http\Controllers;

use MarioHamann\StatamicVisualEditor\Tests\TestCase;

class TemplateBoardControllerTest extends TestCase
{
    protected function tearDown(): void
    {
        foreach (['board/index', 'board/show'] as $view) {
            @unlink(resource_path('views/'.$view.'.antlers.html'));
        }

        @rmdir(resource_path('views/board'));

        parent::tearDown();
    }

    public function test_guest_cannot_read_the_board(): void
    {
        $this->getJson('/!/sve/template-board')->assertStatus(403);
    }

    public function test_guest_cannot_create_a_template(): void
    {
        $this->postJson('/!/sve/template-board', [
            'handle' => 'board',
            'slot' => 'index',
        ])->assertStatus(403);
    }

    /**
     * The board must not become a way to write anywhere in the views folder.
     * Only slots the board itself drew exist; everything else is a 404, not a
     * new file.
     */
    public function test_a_slot_the_board_never_drew_writes_nothing(): void
    {
        $before = glob(resource_path('views/*')) ?: [];

        $this->postJson('/!/sve/template-board', [
            'handle' => '../../config',
            'slot' => 'index',
        ]);

        $this->postJson('/!/sve/template-board', [
            'handle' => '_site',
            'slot' => 'nonsense',
        ]);

        $this->assertSame($before, glob(resource_path('views/*')) ?: []);
    }
}
