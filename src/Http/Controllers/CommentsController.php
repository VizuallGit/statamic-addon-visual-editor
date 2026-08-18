<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\CommentStore;
use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Facades\Entry;
use Statamic\Facades\User;

class CommentsController
{
    public function __construct(protected CommentStore $store) {}

    public function index(string $entry)
    {
        $this->authorize($entry);

        return response()->json([
            'comments' => $this->store->all($entry),
            'user' => $this->userPayload(),
        ]);
    }

    public function store(Request $request, string $entry)
    {
        $this->authorize($entry);

        $data = $request->validate([
            'visual_id' => 'required|string|max:80',
            'x' => 'required|numeric|min:0|max:100',
            'y' => 'required|numeric|min:0|max:100',
            'body' => 'required|string|max:5000',
        ]);

        $user = $this->userPayload();
        $now = now()->toIso8601String();

        $comment = [
            'id' => CommentStore::newId(),
            'visual_id' => $data['visual_id'],
            'x' => round((float) $data['x'], 2),
            'y' => round((float) $data['y'], 2),
            'resolved' => false,
            'created_at' => $now,
            'messages' => [
                $this->message($user, $data['body'], $now),
            ],
        ];

        $this->store->put($entry, $comment);

        return response()->json(['comment' => $comment]);
    }

    public function reply(Request $request, string $entry, string $comment)
    {
        $this->authorize($entry);

        $data = $request->validate([
            'body' => 'required|string|max:5000',
        ]);

        $thread = $this->store->find($entry, $comment);

        abort_unless($thread, 404);

        $thread['messages'] = array_values($thread['messages'] ?? []);
        $thread['messages'][] = $this->message($this->userPayload(), $data['body'], now()->toIso8601String());

        $this->store->put($entry, $thread);

        return response()->json(['comment' => $thread]);
    }

    public function update(Request $request, string $entry, string $comment)
    {
        $this->authorize($entry);

        $data = $request->validate([
            'resolved' => 'required|boolean',
        ]);

        $thread = $this->store->find($entry, $comment);

        abort_unless($thread, 404);

        $thread['resolved'] = (bool) $data['resolved'];

        $this->store->put($entry, $thread);

        return response()->json(['comment' => $thread]);
    }

    public function destroy(string $entry, string $comment)
    {
        $this->authorize($entry);

        abort_unless($this->store->delete($entry, $comment), 404);

        return response()->json(['ok' => true]);
    }

    protected function authorize(string $entry): void
    {
        abort_unless(Features::editorEnabled() && Features::enabled('comments'), 403);
        abort_unless(User::current()?->isSuper(), 403);
        abort_unless(Entry::find($entry), 404);
    }

    protected function userPayload(): array
    {
        $user = User::current();
        $name = trim((string) ($user?->name() ?: $user?->email() ?: 'User'));

        return [
            'id' => $user?->id(),
            'name' => $name,
            'initials' => $user?->initials() ?: strtoupper(mb_substr($name, 0, 1)),
        ];
    }

    protected function message(array $user, string $body, string $at): array
    {
        return [
            'id' => CommentStore::newId(),
            'author_id' => $user['id'],
            'author_name' => $user['name'],
            'author_initials' => $user['initials'],
            'body' => trim($body),
            'created_at' => $at,
        ];
    }
}
