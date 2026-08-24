<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Facades\Entry;
use Statamic\Facades\User;

/**
 * The page's revision list for the Edits popup in Live Preview.
 *
 * Statamic already stores this in revision files when the collection has
 * revisions on. Without revisions the popup is empty. It is not the Logger addon.
 */
class EntryActivityController
{
    public function __invoke(string $entry)
    {
        abort_unless(Features::editorEnabled() && Features::enabled('page_activity'), 403);

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
                'changes' => $previous === null ? [['action' => 'created']] : $this->changedFields($previous, $attrs),
                'message' => $revision->message() ?: null,
                'user' => $this->userPayload($revision->user()),
            ];
            $previous = $attrs;
        }

        return array_reverse($rows);
    }

    /**
     * What actually moved between two snapshots: page fields, and which section
     * (and which block inside it) when the builder changed.
     *
     * @return list<array{action: string, handle?: string, section?: string, parts?: list<string>}>
     */
    protected function changedFields(array $previous, array $current): array
    {
        $changes = [];
        $builder = config('statamic-visual-editor.previews.field', 'page_sections');

        if (($previous['slug'] ?? null) !== ($current['slug'] ?? null)) {
            $changes[] = ['action' => 'updated', 'handle' => 'slug'];
        }

        if (($previous['published'] ?? null) !== ($current['published'] ?? null)) {
            $changes[] = ['action' => 'updated', 'handle' => 'published'];
        }

        $prevData = is_array($previous['data'] ?? null) ? $previous['data'] : [];
        $currData = is_array($current['data'] ?? null) ? $current['data'] : [];
        $skip = ['updated_at', 'updated_by'];

        foreach (array_unique([...array_keys($prevData), ...array_keys($currData)]) as $handle) {
            if (in_array($handle, $skip, true)) {
                continue;
            }

            if ($handle === $builder) {
                array_push($changes, ...$this->sectionChanges(
                    is_array($prevData[$handle] ?? null) ? $prevData[$handle] : [],
                    is_array($currData[$handle] ?? null) ? $currData[$handle] : []
                ));

                continue;
            }

            if ($this->encode($prevData[$handle] ?? null) !== $this->encode($currData[$handle] ?? null)) {
                $changes[] = ['action' => 'updated', 'handle' => $handle];
            }
        }

        return $changes;
    }

    /**
     * @param  list<mixed>  $previous
     * @param  list<mixed>  $current
     * @return list<array{action: string, section: string, parts?: list<string>}>
     */
    protected function sectionChanges(array $previous, array $current): array
    {
        $prev = $this->indexRows($previous);
        $curr = $this->indexRows($current);
        $changes = [];

        foreach (array_diff_key($curr, $prev) as $row) {
            $changes[] = ['action' => 'added', 'section' => $this->sectionName($row)];
        }

        foreach (array_diff_key($prev, $curr) as $row) {
            $changes[] = ['action' => 'removed', 'section' => $this->sectionName($row)];
        }

        foreach (array_intersect_key($curr, $prev) as $key => $row) {
            $parts = $this->changedParts($prev[$key], $row);

            if ($parts) {
                $changes[] = [
                    'action' => 'updated',
                    'section' => $this->sectionName($row),
                    'parts' => $parts,
                ];
            }
        }

        if (! $changes && $this->rowKeys($previous) !== $this->rowKeys($current)) {
            $changes[] = ['action' => 'reordered', 'handle' => 'page_sections'];
        }

        return $changes;
    }

    /**
     * @param  list<mixed>  $rows
     * @return array<string, array>
     */
    protected function indexRows(array $rows): array
    {
        $map = [];

        foreach ($rows as $i => $row) {
            if (! is_array($row)) {
                continue;
            }

            $key = (string) ($row['id'] ?? $row['_visual_id'] ?? '#'.$i);
            $map[$key] = $row;
        }

        return $map;
    }

    /** @param  list<mixed>  $rows */
    protected function rowKeys(array $rows): array
    {
        return array_keys($this->indexRows($rows));
    }

    protected function sectionName(array $section): string
    {
        $custom = trim((string) ($section['_sve_label'] ?? ''));

        if ($custom !== '') {
            return $custom;
        }

        $type = (string) ($section['type'] ?? 'section');

        return ucwords(str_replace(['/', '_', '-'], ' ', $type));
    }

    /**
     * @return list<string>
     */
    protected function changedParts(array $previous, array $current): array
    {
        $parts = [];
        $skip = ['id', '_id', '_visual_id', 'enabled', 'type', '_sve_label', '_sve_sync'];
        $nested = ['blocks', 'content_block', 'list', 'items', 'sets'];

        foreach (array_unique([...array_keys($previous), ...array_keys($current)]) as $handle) {
            if (in_array($handle, $skip, true)) {
                continue;
            }

            $was = $previous[$handle] ?? null;
            $now = $current[$handle] ?? null;

            if (in_array($handle, $nested, true) && (is_array($was) || is_array($now))) {
                $parts = array_merge($parts, $this->changedBlocks((array) $was, (array) $now));

                continue;
            }

            if ($this->encode($was) !== $this->encode($now)) {
                $parts[] = $handle;
            }
        }

        return array_values(array_unique($parts));
    }

    /**
     * @return list<string>
     */
    protected function changedBlocks(array $previous, array $current): array
    {
        $prev = $this->indexRows($previous);
        $curr = $this->indexRows($current);
        $parts = [];

        foreach (array_diff_key($curr, $prev) as $row) {
            $parts[] = $this->blockName($row);
        }

        foreach (array_diff_key($prev, $curr) as $row) {
            $parts[] = $this->blockName($row);
        }

        foreach (array_intersect_key($curr, $prev) as $key => $row) {
            if ($this->encode($prev[$key]) !== $this->encode($row)) {
                $inner = $this->changedParts($prev[$key], $row);

                if ($inner) {
                    array_push($parts, ...$inner);
                } else {
                    $parts[] = $this->blockName($row);
                }
            }
        }

        return array_values(array_filter(array_unique($parts)));
    }

    protected function blockName(array $block): string
    {
        $type = (string) ($block['type'] ?? '');

        return $type !== '' ? $type : 'block';
    }

    protected function encode(mixed $value): string
    {
        return json_encode($this->stripNoise($value)) ?: '';
    }

    protected function stripNoise(mixed $value): mixed
    {
        if (! is_array($value)) {
            return $value;
        }

        foreach (['updated_at', 'updated_by', '_visual_id'] as $key) {
            unset($value[$key]);
        }

        return array_map(fn ($item) => $this->stripNoise($item), $value);
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
