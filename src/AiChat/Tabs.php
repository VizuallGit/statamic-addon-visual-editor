<?php

namespace MarioHamann\StatamicVisualEditor\AiChat;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

/**
 * The AI panel's chats, one per tab, kept on the server per user.
 *
 * A reload, another browser or a closed laptop never loses a conversation: the
 * server writes the question into the tab before the agent starts and the
 * answer when it ends, and the draft is saved as it is typed. Closing a tab is
 * the only thing that throws a chat away, and it throws all of it away — its
 * messages, its draft and the images pasted into it.
 *
 *   storage/app/sve-ai/{user}/index.json   tab order and the open tab
 *   storage/app/sve-ai/{user}/{tab}.json   one chat
 *   storage/app/sve-ai/{user}/{tab}/       its images
 *
 * Outside every path the editor's git sync commits: what someone asks the AI
 * is theirs, not the site's.
 *
 * A chat: {id, title, created_at, updated_at, draft, draft_images: [ids],
 * model: null|string, pending: null|{run, since, mode, model}, queue: [item],
 * messages: [row]}. A row: {role, content, at, images?: [{id, mime}],
 * kind?: reply|error|stopped|lost, mode?, applied?}. Only user rows and
 * `reply` rows go back to the agent.
 *
 * The queue is what was asked while the AI was still answering — like VS
 * Code's: each item {id, text, images: [ids], mode, model, type, at} becomes
 * the next question when the answer before it is in. The request that ran the
 * answer starts the next one itself (AiChatController), so the queue moves on
 * after a reload or with the panel closed. Stop does not move it on: what was
 * queued waits for "send now".
 */
final class Tabs
{
    public const MAX_TABS = 30;

    public const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

    /** The newest images the agent is shown again with each question. */
    public const MAX_AGENT_IMAGES = 6;

    public const IMAGE_TYPES = ['image/png' => 'png', 'image/jpeg' => 'jpg', 'image/webp' => 'webp', 'image/gif' => 'gif'];

    /** A run that has not finished by now died with its PHP process (the agent stops at 180 s). */
    public const PENDING_TIMEOUT = 300;

    /** Questions waiting behind the one being answered. */
    public const MAX_QUEUE = 10;

    /** An image nothing points at is cleared away once it is this old. */
    public const ORPHAN_AGE = 600;

    private const ID = '/^[a-z0-9]{8,40}$/';

    private string $dir;

    public function __construct(string $userId)
    {
        abort_if($userId === '', 403);

        $this->dir = static::root().'/'.substr(sha1($userId), 0, 24);
    }

    public static function root(): string
    {
        return storage_path('app/sve-ai');
    }

    /** The tabs, in order, with the open one — always at least one. */
    public function index(): array
    {
        return $this->locked(function () {
            $index = $this->readIndex();

            if ($index['tabs'] === []) {
                $index = $this->addTab($index);
            }

            if (! in_array($index['active'], $index['tabs'], true)) {
                $index['active'] = $index['tabs'][0];
                $this->writeIndex($index);
            }

            return [
                'active' => $index['active'],
                'tabs' => array_values(array_filter(array_map(fn ($id) => $this->meta($id), $index['tabs']))),
            ];
        });
    }

    /** One chat, or null when there is no such tab. */
    public function get(string $id): ?array
    {
        if (! $this->validId($id)) {
            return null;
        }

        return $this->locked(fn () => $this->readChat($id, true));
    }

    /** A new, empty tab after the others, and open. */
    public function create(): array
    {
        $this->locked(function () {
            $index = $this->readIndex();

            abort_if(count($index['tabs']) >= static::MAX_TABS, 422, 'Too many chats open. Close one first.');

            $this->addTab($index);
        });

        return $this->index();
    }

    /** Close a tab: the chat, its draft and its images are gone. */
    public function close(string $id): array
    {
        if ($this->validId($id)) {
            $this->locked(function () use ($id) {
                $index = $this->readIndex();
                $at = array_search($id, $index['tabs'], true);

                File::delete($this->chatPath($id));
                File::deleteDirectory($this->imageDir($id));

                if ($at === false) {
                    return;
                }

                array_splice($index['tabs'], $at, 1);

                if ($index['active'] === $id) {
                    $index['active'] = $index['tabs'][min($at, count($index['tabs']) - 1)] ?? '';
                }

                $this->writeIndex($index);
            });
        }

        return $this->index();
    }

    public function activate(string $id): void
    {
        $this->locked(function () use ($id) {
            $index = $this->readIndex();

            if (in_array($id, $index['tabs'], true) && $index['active'] !== $id) {
                $index['active'] = $id;
                $this->writeIndex($index);
            }
        });
    }

    /**
     * The model this tab asks; null is the site's default. It is also what a
     * new tab starts with, the way VS Code keeps the last model picked.
     */
    public function setModel(string $id, ?string $model): ?array
    {
        $chat = $this->change($id, function (array $chat) use ($model) {
            $chat['model'] = $model;

            return $chat;
        }, false);

        if ($chat !== null) {
            $this->locked(function () use ($model) {
                $index = $this->readIndex();
                $index['model'] = $model;
                $this->writeIndex($index);
            });
        }

        return $chat;
    }

    /** What is in the box: the text and the images pasted but not yet sent. */
    public function saveDraft(string $id, string $draft, array $imageIds): ?array
    {
        return $this->change($id, function (array $chat) use ($id, $draft, $imageIds) {
            $chat['draft'] = mb_substr($draft, 0, 100000);
            $chat['draft_images'] = $this->existingImages($id, $imageIds);

            return $chat;
        }, false);
    }

    /** @return array{id: string, mime: string} */
    public function storeImage(string $id, UploadedFile $file): array
    {
        abort_unless($this->validId($id) && is_file($this->chatPath($id)), 404);
        abort_unless($file->isValid(), 422, 'The image did not arrive.');
        abort_if($file->getSize() > static::MAX_IMAGE_BYTES, 422, 'The image is larger than 8 MB.');

        $mime = (string) $file->getMimeType();

        abort_unless(isset(static::IMAGE_TYPES[$mime]), 422, 'Only PNG, JPEG, WebP and GIF images.');

        $imageId = strtolower(Str::random(20));

        File::ensureDirectoryExists($this->imageDir($id));
        $file->move($this->imageDir($id), $imageId.'.'.static::IMAGE_TYPES[$mime]);

        return ['id' => $imageId, 'mime' => $mime];
    }

    public function imagePath(string $id, string $imageId): ?string
    {
        if (! $this->validId($id) || ! $this->validId($imageId)) {
            return null;
        }

        foreach (static::IMAGE_TYPES as $ext) {
            $path = $this->imageDir($id).'/'.$imageId.'.'.$ext;

            if (is_file($path)) {
                return $path;
            }
        }

        return null;
    }

    /**
     * A question from the box: asked now when the tab is free, queued behind
     * the answer when it is not. Decided under the lock, so two windows
     * asking at once never start two runs.
     *
     * @param  array{mode: string, model?: ?string, type?: string}  $how
     * @return array{run: string, chat: array, item: array}|array{queued: array, chat: array}
     */
    public function ask(string $id, string $text, array $imageIds, array $how): array
    {
        $out = null;

        $chat = $this->change($id, function (array $chat) use ($id, $text, $imageIds, $how, &$out) {
            $item = [
                'id' => strtolower(Str::random(10)),
                'text' => $text,
                'images' => $this->existingImages($id, $imageIds),
                'mode' => (string) $how['mode'],
                'model' => $how['model'] ?? null,
                'type' => (string) ($how['type'] ?? ''),
                'at' => time(),
            ];

            $chat['draft'] = '';
            $chat['draft_images'] = [];

            if ($chat['pending'] !== null) {
                abort_if(count($chat['queue']) >= static::MAX_QUEUE, 422, 'The queue is full. Wait for an answer, or remove something from it.');

                $chat['queue'][] = $item;
                $out = ['queued' => $item];

                return $chat;
            }

            $out = ['item' => $item, 'run' => $this->begin($chat, $item)];

            return $chat;
        });

        abort_if($chat === null, 404);

        return $out + ['chat' => $chat];
    }

    /**
     * The first queued question, asked — when the tab is free. Null when it is
     * not, or nothing is queued.
     *
     * @return array{run: string, chat: array, item: array}|null
     */
    public function startNext(string $id): ?array
    {
        $out = null;

        $chat = $this->change($id, function (array $chat) use (&$out) {
            if ($chat['pending'] !== null || $chat['queue'] === []) {
                return null;
            }

            $item = array_shift($chat['queue']);
            $out = ['item' => $item, 'run' => $this->begin($chat, $item)];

            return $chat;
        });

        return $chat === null ? null : $out + ['chat' => $chat];
    }

    /**
     * "Send now": the answer being written is stopped, and this queued
     * question is asked in its place. Null when it is no longer queued.
     *
     * @return array{run: string, chat: array, item: array}|null
     */
    public function sendNow(string $id, string $itemId): ?array
    {
        $out = null;

        $chat = $this->change($id, function (array $chat) use ($itemId, &$out) {
            $at = array_search($itemId, array_column($chat['queue'], 'id'), true);

            if ($at === false) {
                return null;
            }

            [$item] = array_splice($chat['queue'], $at, 1);

            if ($chat['pending'] !== null) {
                $chat = $this->stopped($chat);
            }

            $out = ['item' => $item, 'run' => $this->begin($chat, $item)];

            return $chat;
        });

        return $chat === null ? null : $out + ['chat' => $chat];
    }

    /** A queued question taken out — removed, or back in the box to be edited. */
    public function unqueue(string $id, string $itemId): ?array
    {
        return $this->change($id, function (array $chat) use ($itemId) {
            $before = count($chat['queue']);
            $chat['queue'] = array_values(array_filter($chat['queue'], fn ($item) => $item['id'] !== $itemId));

            return count($chat['queue']) === $before ? null : $chat;
        }, false);
    }

    /** Is this run still the one the tab is waiting for? False once it is stopped, replaced or closed. */
    public function waitingFor(string $id, string $run): bool
    {
        if (! $this->validId($id)) {
            return false;
        }

        return $this->locked(fn () => ($this->readChat($id, false)['pending']['run'] ?? null) === $run);
    }

    /**
     * The answer goes in when the run that asked is still the one waiting. A
     * stopped run (or a closed tab) has nowhere to put it, and it is dropped.
     */
    public function finishRun(string $id, string $run, array $row): ?array
    {
        return $this->change($id, function (array $chat) use ($run, $row) {
            if (($chat['pending']['run'] ?? null) !== $run) {
                return null;
            }

            $chat['messages'][] = $row + ['at' => time()];
            $chat['pending'] = null;

            return $chat;
        });
    }

    /**
     * Stop: the tab stops waiting and says so. The run that was waited for
     * sees it and ends its agent (AiChatController). What is queued stays.
     */
    public function stop(string $id): ?array
    {
        return $this->change($id, fn (array $chat) => $chat['pending'] === null ? null : $this->stopped($chat));
    }

    private function stopped(array $chat): array
    {
        $chat['messages'][] = ['role' => 'assistant', 'kind' => 'stopped', 'mode' => $chat['pending']['mode'] ?? 'write', 'content' => '', 'at' => time()];
        $chat['pending'] = null;

        return $chat;
    }

    /**
     * The question into the chat and the tab waiting for its answer.
     *
     * @param  array{text: string, images: list<string>, mode: string, model?: ?string}  $item
     */
    private function begin(array &$chat, array $item): string
    {
        $run = strtolower(Str::random(16));
        $images = array_map(fn ($imageId) => ['id' => $imageId, 'mime' => $this->mimeOf($chat['id'], $imageId)], $this->existingImages($chat['id'], $item['images']));
        $row = ['role' => 'user', 'content' => $item['text'], 'at' => time()];

        if ($images !== []) {
            $row['images'] = $images;
        }

        $chat['messages'][] = $row;
        $chat['pending'] = ['run' => $run, 'since' => time(), 'mode' => $item['mode'], 'model' => $item['model'] ?? null];

        if ($chat['title'] === '' && $item['text'] !== '') {
            $chat['title'] = static::titleOf($item['text']);
        }

        return $run;
    }

    /**
     * The conversation as the agent is given it: the user's turns and the
     * answers (not errors or stops), each image noted where it was attached,
     * and the newest images themselves.
     *
     * @return array{messages: list<array{role: string, content: string}>, images: list<array{data: string, mimeType: string}>}
     */
    public function forAgent(array $chat): array
    {
        $messages = [];
        $attached = [];

        foreach ($chat['messages'] as $row) {
            if ($row['role'] === 'assistant' && ($row['kind'] ?? 'reply') !== 'reply') {
                continue;
            }

            $content = (string) ($row['content'] ?? '');
            $count = count($row['images'] ?? []);

            if ($row['role'] === 'user' && $count) {
                $content = trim($content."\n\n[".$count.' image'.($count === 1 ? '' : 's').' attached]');

                foreach ($row['images'] as $image) {
                    $attached[] = $image['id'];
                }
            }

            $messages[] = ['role' => $row['role'], 'content' => $content];
        }

        $images = [];

        foreach (array_slice($attached, -static::MAX_AGENT_IMAGES) as $imageId) {
            $path = $this->imagePath($chat['id'], $imageId);

            if ($path) {
                $images[] = ['data' => base64_encode((string) file_get_contents($path)), 'mimeType' => (string) File::mimeType($path)];
            }
        }

        return ['messages' => $messages, 'images' => $images];
    }

    public static function titleOf(string $text): string
    {
        $line = trim((string) preg_replace('/\s+/', ' ', $text));

        return mb_strlen($line) > 48 ? rtrim(mb_substr($line, 0, 47)).'…' : $line;
    }

    // ── Storage ─────────────────────────────────────────────────────────────

    /** Read, change and write one chat under the lock; `$fn` returns the chat to write, or null to leave it. */
    private function change(string $id, callable $fn, bool $touch = true): ?array
    {
        if (! $this->validId($id)) {
            return null;
        }

        return $this->locked(function () use ($id, $fn, $touch) {
            $chat = $this->readChat($id, true);

            if ($chat === null) {
                return null;
            }

            $next = $fn($chat);

            if ($next === null) {
                return null;
            }

            if ($touch) {
                $next['updated_at'] = time();
            }

            $this->writeChat($next);
            $this->collectImages($next);

            return $next;
        });
    }

    private function locked(callable $fn): mixed
    {
        File::ensureDirectoryExists($this->dir);

        $handle = fopen($this->dir.'/.lock', 'c');

        try {
            flock($handle, LOCK_EX);

            return $fn();
        } finally {
            flock($handle, LOCK_UN);
            fclose($handle);
        }
    }

    private function addTab(array $index): array
    {
        $id = strtolower(Str::random(12));
        $now = time();

        $this->writeChat([
            'id' => $id,
            'title' => '',
            'created_at' => $now,
            'updated_at' => $now,
            'draft' => '',
            'draft_images' => [],
            'model' => $index['model'] ?? null,
            'pending' => null,
            'queue' => [],
            'messages' => [],
        ]);

        $index['tabs'][] = $id;
        $index['active'] = $id;
        $this->writeIndex($index);

        return $index;
    }

    private function meta(string $id): ?array
    {
        $chat = $this->readChat($id, false);

        return $chat === null ? null : [
            'id' => $id,
            'title' => $chat['title'],
            'updated_at' => $chat['updated_at'],
            'pending' => $chat['pending'] !== null,
            'queued' => count($chat['queue']),
        ];
    }

    /** @return array{active: string, tabs: list<string>, model: ?string} */
    private function readIndex(): array
    {
        $data = json_decode((string) @file_get_contents($this->dir.'/index.json'), true);
        $tabs = array_values(array_filter((array) ($data['tabs'] ?? []), fn ($id) => is_string($id) && $this->validId($id) && is_file($this->chatPath($id))));
        $model = $data['model'] ?? null;

        return ['active' => (string) ($data['active'] ?? ''), 'tabs' => $tabs, 'model' => is_string($model) ? $model : null];
    }

    private function writeIndex(array $index): void
    {
        $this->put($this->dir.'/index.json', ['active' => $index['active'], 'tabs' => array_values($index['tabs']), 'model' => $index['model'] ?? null]);
    }

    /** A run older than the agent can live is over: it is closed with a note, never left spinning. */
    private function readChat(string $id, bool $settle): ?array
    {
        $chat = json_decode((string) @file_get_contents($this->chatPath($id)), true);

        if (! is_array($chat)) {
            return null;
        }

        $chat += ['title' => '', 'draft' => '', 'draft_images' => [], 'model' => null, 'pending' => null, 'queue' => [], 'messages' => [], 'updated_at' => 0];
        $chat['id'] = $id;

        if ($settle && $chat['pending'] !== null && (int) ($chat['pending']['since'] ?? 0) < time() - static::PENDING_TIMEOUT) {
            $chat['messages'][] = ['role' => 'assistant', 'kind' => 'lost', 'content' => '', 'at' => time()];
            $chat['pending'] = null;
            $this->writeChat($chat);
        }

        return $chat;
    }

    private function writeChat(array $chat): void
    {
        $this->put($this->chatPath($chat['id']), $chat);
    }

    /** Written whole and then moved into place: a reader never sees half a chat. */
    private function put(string $path, array $data): void
    {
        $tmp = $path.'.'.Str::random(6).'.tmp';

        File::put($tmp, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
        rename($tmp, $path);
    }

    /**
     * Images no message and no draft points at any more (removed from the box
     * before sending). Only old ones: a fresh upload is in no saved draft yet —
     * the box saves it a moment later — and must not be taken in between.
     */
    private function collectImages(array $chat): void
    {
        $dir = $this->imageDir($chat['id']);

        if (! is_dir($dir)) {
            return;
        }

        $keep = array_flip($chat['draft_images']);

        foreach ($chat['messages'] as $row) {
            foreach ($row['images'] ?? [] as $image) {
                $keep[$image['id']] = true;
            }
        }

        foreach ($chat['queue'] as $item) {
            foreach ($item['images'] as $imageId) {
                $keep[$imageId] = true;
            }
        }

        foreach (File::files($dir) as $file) {
            if (! isset($keep[$file->getFilenameWithoutExtension()]) && $file->getMTime() < time() - static::ORPHAN_AGE) {
                File::delete($file->getPathname());
            }
        }
    }

    private function existingImages(string $id, array $imageIds): array
    {
        return array_values(array_unique(array_filter($imageIds, fn ($imageId) => is_string($imageId) && $this->imagePath($id, $imageId) !== null)));
    }

    private function mimeOf(string $id, string $imageId): string
    {
        $ext = pathinfo((string) $this->imagePath($id, $imageId), PATHINFO_EXTENSION);

        return (string) (array_search($ext, static::IMAGE_TYPES, true) ?: 'image/png');
    }

    private function chatPath(string $id): string
    {
        return $this->dir.'/'.$id.'.json';
    }

    private function imageDir(string $id): string
    {
        return $this->dir.'/'.$id;
    }

    private function validId(string $id): bool
    {
        return (bool) preg_match(self::ID, $id);
    }
}
