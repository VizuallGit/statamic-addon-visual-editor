<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Http\Controllers\EntryActivityController\Changes;
use Statamic\Facades\Entry;
use Statamic\Facades\User;

/**
 * The page's revision list for the Edits popup in Live Preview.
 *
 * Statamic already stores this in revision files when the collection has
 * revisions on. Without revisions the popup is empty. It is not the Logger addon.
 *
 * The controller keeps the endpoint and the revision list; the diff lives
 * in `EntryActivityController\Changes`. Split in WP7d, code moved verbatim.
 */
class EntryActivityController
{
    public function __invoke(string $entry)
    {
        abort_unless(Features::editorEnabled() && Features::allows('page_activity'), 403);

        $user = User::current();

        abort_unless($user, 403);

        $item = Entry::find($entry);

        abort_unless($item, 404);
        abort_unless($user->can('view', $item) || $user->can('edit', $item), 403);

        $lastUser = $item->lastModifiedBy();
        $lastAt = $item->lastModified();
        $hasRevisions = method_exists($item, 'revisionsEnabled') && $item->revisionsEnabled();

        return response()->json([
            'id' => $item->id(),
            'title' => $item->value('title') ?: $item->slug(),
            'status' => $this->status($item),
            'last_edit' => $lastAt?->toIso8601String(),
            'last_user' => $this->userPayload($lastUser),
            'revisions' => $hasRevisions,
            'edits' => $hasRevisions ? $this->edits($item) : [],
        ]);
    }

    protected function status($entry): string
    {
        if (method_exists($entry, 'status')) {
            $status = (string) $entry->status();

            if (in_array($status, ['published', 'draft', 'scheduled', 'expired'], true)) {
                return $status;
            }
        }

        return $entry->published() ? 'published' : 'draft';
    }

    /**
     * Newest first. Every revision, not a cap — the panel paginates.
     *
     * @return list<array{at: string, action: string, fields: list<string>, message: ?string, user: ?array}>
     */
    protected function edits($entry): array
    {
        $revisions = $entry->revisions()
            ->reject(fn ($revision) => $revision->isWorkingCopy())
            ->sortBy(fn ($revision) => $revision->date()->timestamp)
            ->values();

        $previous = null;
        $rows = [];

        foreach ($revisions as $revision) {
            $attrs = $revision->attributes() ?? [];
            $rows[] = [
                'at' => $revision->date()->toIso8601String(),
                'action' => (string) ($revision->action() ?: 'revision'),
                'fields' => $previous === null ? ['created'] : [],
                'changes' => $previous === null ? [['action' => 'created']] : Changes::changedFields($previous, $attrs),
                'message' => $revision->message() ?: null,
                'user' => $this->userPayload($revision->user()),
            ];
            $previous = $attrs;
        }

        return array_reverse($rows);
    }

    protected function userPayload($user): ?array
    {
        if (! $user) {
            return null;
        }

        $name = trim((string) ($user->name() ?: $user->email() ?: ''));

        if ($name === '') {
            return null;
        }

        return [
            'id' => $user->id(),
            'name' => $name,
            'initials' => $user->initials() ?: mb_strtoupper(mb_substr($name, 0, 1)),
        ];
    }
}
