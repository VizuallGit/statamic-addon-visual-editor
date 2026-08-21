<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Statamic\Facades\YAML;

class CommentStore
{
    public function all(string $entryId): array
    {
        $path = $this->path($entryId);
        $legacy = storage_path('statamic-comments/'.$this->safeId($entryId).'.yaml');

        if (! File::exists($path) && File::exists($legacy)) {
            $dir = dirname($path);

            if (! File::isDirectory($dir)) {
                File::makeDirectory($dir, 0755, true);
            }

            File::move($legacy, $path);
        }

        if (! File::exists($path)) {
            return [];
        }

        $parsed = YAML::file($path)->parse() ?: [];
        $comments = $parsed['comments'] ?? [];

        return array_values(is_array($comments) ? $comments : []);
    }

    public function save(string $entryId, array $comments): void
    {
        $dir = dirname($this->path($entryId));

        if (! File::isDirectory($dir)) {
            File::makeDirectory($dir, 0755, true);
        }

        File::put($this->path($entryId), YAML::dump(['comments' => array_values($comments)]));
    }

    public function find(string $entryId, string $commentId): ?array
    {
        foreach ($this->all($entryId) as $comment) {
            if (($comment['id'] ?? '') === $commentId) {
                return $comment;
            }
        }

        return null;
    }

    public function put(string $entryId, array $comment): array
    {
        $comments = $this->all($entryId);
        $replaced = false;

        foreach ($comments as $i => $existing) {
            if (($existing['id'] ?? '') === $comment['id']) {
                $comments[$i] = $comment;
                $replaced = true;
                break;
            }
        }

        if (! $replaced) {
            $comments[] = $comment;
        }

        $this->save($entryId, $comments);

        return $comment;
    }

    public function delete(string $entryId, string $commentId): bool
    {
        $comments = $this->all($entryId);
        $next = array_values(array_filter(
            $comments,
            fn ($comment) => ($comment['id'] ?? '') !== $commentId
        ));

        if (count($next) === count($comments)) {
            return false;
        }

        $this->save($entryId, $next);

        return true;
    }

    public function deleteByVisualIds(string $entryId, array $visualIds): int
    {
        $ids = array_values(array_filter(
            $visualIds,
            fn ($id) => is_string($id) && $id !== '' && $id !== '__page'
        ));

        if ($ids === []) {
            return 0;
        }

        $comments = $this->all($entryId);
        $next = array_values(array_filter(
            $comments,
            fn ($comment) => ! in_array($comment['visual_id'] ?? '', $ids, true)
        ));
        $removed = count($comments) - count($next);

        if ($removed > 0) {
            $this->save($entryId, $next);
        }

        return $removed;
    }

    public function safeId(string $entryId): string
    {
        $id = preg_replace('/[^a-zA-Z0-9._-]/', '', $entryId) ?? '';

        abort_if($id === '', 404);

        return $id;
    }

    /**
     * This site's comment threads — Visual Editor code lives in the addon,
     * the YAML lives here with the rest of the site's data.
     */
    protected function path(string $entryId): string
    {
        return storage_path('statamic-visual-editor/comments/'.$this->safeId($entryId).'.yaml');
    }

    public static function newId(): string
    {
        return (string) Str::uuid();
    }
}
