<?php

namespace MarioHamann\StatamicVisualEditor\AiChat;

use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\Background;

/**
 * A chat question answered in the background. An answer — on Cursor or on
 * Claude, and a whole section in Build mode — can take longer than the web
 * server lets a request live, so the request only puts the question in its
 * tab (Tabs::ask) and starts `artisan sve:ai-chat-run`; the panel already
 * polls a waiting tab, and each answer shows as it lands.
 *
 * What the run needs is one small JSON file, read and removed by the run.
 */
final class Run
{
    public static function directory(): string
    {
        return storage_path('statamic-visual-editor/ai-runs');
    }

    /**
     * @param  array{run: string, chat: array, item: array}  $started  Tabs::ask() / sendNow()
     */
    public static function start(string $user, string $tab, array $started): string
    {
        $id = (string) Str::uuid();
        $dir = static::directory();

        if (! is_dir($dir)) {
            @mkdir($dir, 0775, true);
        }

        file_put_contents("{$dir}/{$id}.json", json_encode(['user' => $user, 'tab' => $tab, 'started' => $started], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

        Background::artisan('sve:ai-chat-run', $id);

        return $id;
    }

    /**
     * The run's question, once: the file is removed as it is read.
     *
     * @return array{user: string, tab: string, started: array}|null
     */
    public static function take(string $id): ?array
    {
        $path = static::directory()."/{$id}.json";

        if (! preg_match('/^[0-9a-f-]{36}$/', $id) || ! is_file($path)) {
            return null;
        }

        $run = json_decode((string) file_get_contents($path), true);

        @unlink($path);

        return is_array($run) && isset($run['user'], $run['tab'], $run['started']) ? $run : null;
    }
}
