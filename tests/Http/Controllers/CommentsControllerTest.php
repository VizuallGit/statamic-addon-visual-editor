<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Http\Controllers;

use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Illuminate\Support\Facades\File;
use Statamic\Facades\User;

/**
 * A comment is made for a screen size: the one the fields edit, or every
 * size. The API keeps it, defaults it, and lets it be changed — comments from
 * before this field count as made for every size.
 */
class CommentsControllerTest extends TestCase
{
    protected string $entryId;

    protected function setUp(): void
    {
        parent::setUp();

        Collection::make('pages')->save();
        $entry = Entry::make()->collection('pages')->slug('home')->data(['title' => 'Home']);
        $entry->save();
        $this->entryId = $entry->id();

        $user = User::make()->email('editor@example.com')->makeSuper();
        $user->save();
        $this->actingAs($user);
    }

    protected function tearDown(): void
    {
        File::deleteDirectory(storage_path('statamic-visual-editor/comments'));
        Entry::find($this->entryId)?->delete();
        Collection::find('pages')?->delete();

        parent::tearDown();
    }

    public function test_a_comment_keeps_the_size_it_was_made_for(): void
    {
        $response = $this->postJson("/!/sve/comments/{$this->entryId}", [
            'visual_id' => 'abc-123',
            'x' => 40,
            'y' => 60,
            'body' => 'Kun på tablet',
            'breakpoint' => 'tablet',
        ])->assertOk();

        $this->assertSame('tablet', $response->json('comment.breakpoint'));
        $this->assertSame('tablet', $this->getJson("/!/sve/comments/{$this->entryId}")->json('comments.0.breakpoint'));
    }

    public function test_a_comment_without_a_size_is_for_every_size(): void
    {
        $response = $this->postJson("/!/sve/comments/{$this->entryId}", [
            'visual_id' => '__page',
            'x' => 50,
            'y' => 50,
            'body' => 'Overalt',
        ])->assertOk();

        $this->assertSame('all', $response->json('comment.breakpoint'));
    }

    public function test_the_size_can_be_changed_afterwards(): void
    {
        $id = $this->postJson("/!/sve/comments/{$this->entryId}", [
            'visual_id' => 'abc-123',
            'x' => 10,
            'y' => 10,
            'body' => 'Flyttes',
            'breakpoint' => 'mobile',
        ])->json('comment.id');

        $this->patchJson("/!/sve/comments/{$this->entryId}/{$id}", ['breakpoint' => 'all'])
            ->assertOk()
            ->assertJsonPath('comment.breakpoint', 'all');

        $this->assertSame('all', $this->getJson("/!/sve/comments/{$this->entryId}")->json('comments.0.breakpoint'));
    }
}
