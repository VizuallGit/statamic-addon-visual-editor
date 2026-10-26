<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\Http;
use MarioHamann\StatamicVisualEditor\DockGhost\Prompt;
use MarioHamann\StatamicVisualEditor\DockGhost\Reply;
use MarioHamann\StatamicVisualEditor\DockGhost\Usage;

/**
 * The AI in the dock's HTML pane, two ways:
 *
 * - **Grey text** at the caret (`line`, `comment`): the rest of what the
 *   author is writing, or the block a comment above the caret describes —
 *   Copilot's way, taken with Tab.
 * - **⌘K** (`edit`, `insert`): an instruction in the author's words for the
 *   selection, or for the caret when nothing is selected — Cursor's way.
 *
 * Not the AI chat's Cursor agent: it takes seconds to start (13–17 s for two
 * words, measured on the demo), and grey text that arrives after the author
 * has typed on is noise. Direct calls instead: a small, fast model for the
 * grey text, a stronger one for ⌘K, the stable part of the prompt cached so
 * a request pays for the lines around the caret and little else.
 *
 * Suggests only. Nothing here writes a file; the text goes back to the
 * browser, and the author decides whether it stays. Each answer is added to
 * the month's account (`DockGhost\Usage`).
 *
 * The prompt is built by `DockGhost\Prompt`, the answer tidied by
 * `DockGhost\Reply`.
 */
class DockGhost
{
    public const ENDPOINT = 'https://api.anthropic.com/v1/messages';

    /** The API version the requests are written against. */
    public const API_VERSION = '2026-10-21';

    /** Small and fast: grey text is only worth it while the author waits. */
    public const MODEL = 'claude-haiku-5-5';

    /** ⌘K rewrites what the author points at; that is worth the stronger model. */
    public const EDIT_MODEL = 'claude-opus-5-5';

    /** Refusals on the stronger models are answered by Anthropic's own fallback model. */
    public const FALLBACK_BETA = 'server-side-fallback-2026-07-01';

    /** Output tokens per way of asking. */
    public const MAX_TOKENS = ['line' => 256, 'comment' => 2048, 'insert' => 2048, 'edit' => 4096];

    /** Seconds per way of asking. A line later than this is one the author has typed past. */
    public const TIMEOUT = ['line' => 8, 'comment' => 30, 'insert' => 45, 'edit' => 60];

    /**
     * The settings screen's field first (`ghost_api_key`), then .env — the
     * way the Cursor key and the PageSpeed key are found.
     */
    public static function apiKey(): string
    {
        $saved = trim((string) Features::setting('ghost_api_key', ''));

        if ($saved !== '') {
            return $saved;
        }

        return trim((string) config('statamic-visual-editor.ghost.api_key', ''));
    }

    /** The model for a way of asking: the grey text's, or ⌘K's. */
    public static function model(string $mode = 'line'): string
    {
        $edit = $mode === 'edit' || $mode === 'insert';
        $model = trim((string) config('statamic-visual-editor.ghost.'.($edit ? 'edit_model' : 'model'), ''));

        return $model !== '' ? $model : ($edit ? static::EDIT_MODEL : static::MODEL);
    }

    public static function ready(): bool
    {
        return Features::enabled('dock_ghost') && static::apiKey() !== '';
    }

    /**
     * Grey text: `line` or `comment`.
     *
     * @param  array{mode?: string, before?: string, after?: string, section?: string, fields?: list<array<string, mixed>>, taken?: list<array<string, mixed>>}  $request
     * @return array{ok: bool, text: string, ms: int, usage: array<string, int>, status?: int, message?: string}
     */
    public static function complete(array $request): array
    {
        $mode = Prompt::mode($request);
        $mode = $mode === 'comment' ? 'comment' : 'line';
        $out = static::ask(['mode' => $mode] + $request);

        if ($out['ok']) {
            $out['text'] = Reply::clean($out['text'], Prompt::before($request), Prompt::after($request), $mode);
        }

        return $out;
    }

    /**
     * ⌘K: `edit` when a selection is sent, `insert` at the caret when not.
     *
     * @param  array{instruction?: string, before?: string, selection?: string, after?: string, section?: string, fields?: list<array<string, mixed>>, taken?: list<array<string, mixed>>}  $request
     * @return array{ok: bool, text: string, ms: int, usage: array<string, int>, status?: int, message?: string}
     */
    public static function edit(array $request): array
    {
        if (Prompt::instruction($request) === '') {
            return static::failed(422, __('sve::messages.dock_ghost_edit_empty'));
        }

        if (strlen((string) ($request['selection'] ?? '')) > Prompt::SELECTION) {
            return static::failed(422, __('sve::messages.dock_ghost_edit_too_long'));
        }

        $mode = trim((string) ($request['selection'] ?? '')) === '' ? 'insert' : 'edit';
        $out = static::ask(['mode' => $mode] + $request);

        if ($out['ok']) {
            $out['text'] = $mode === 'edit'
                ? Reply::edit($out['text'], (string) $request['selection'])
                : Reply::clean($out['text'], Prompt::before($request), Prompt::after($request), 'insert');
        }

        return $out;
    }

    /**
     * The request: the cached house knowledge, then the task and the caret's
     * surroundings. The grey text's small model runs without thinking; the
     * stronger ones think as little as they need (effort low) and carry the
     * refusal fallback.
     *
     * @return array<string, mixed>
     */
    public static function body(array $request): array
    {
        $mode = Prompt::mode($request);
        $model = static::model($mode);
        $body = [
            'model' => $model,
            'max_tokens' => static::MAX_TOKENS[$mode],
        ];

        if (str_contains($model, 'haiku')) {
            $body['thinking'] = ['type' => 'disabled'];
        } elseif (static::fallbacks()) {
            $body['fallbacks'] = 'default';
        }

        return $body + [
            'output_config' => ['effort' => 'low'],
            'system' => Prompt::system((string) ($request['section'] ?? '')),
            'messages' => [
                ['role' => 'user', 'content' => Prompt::user($request)],
            ],
        ];
    }

    /** Whether ⌘K's model asks for Anthropic's refusal fallback (config `ghost.fallbacks`). */
    public static function fallbacks(): bool
    {
        return (bool) config('statamic-visual-editor.ghost.fallbacks', true);
    }

    /** @return array{ok: bool, text: string, ms: int, usage: array<string, int>, status?: int, message?: string} */
    protected static function ask(array $request): array
    {
        $key = static::apiKey();

        if ($key === '') {
            return static::failed(422, __('sve::messages.dock_ghost_need_key'));
        }

        $mode = Prompt::mode($request);
        $body = static::body($request);
        $headers = ['x-api-key' => $key, 'anthropic-version' => static::API_VERSION];

        if (isset($body['fallbacks'])) {
            $headers['anthropic-beta'] = static::FALLBACK_BETA;
        }

        $started = hrtime(true);

        try {
            $response = Http::timeout(static::TIMEOUT[$mode])->withHeaders($headers)->post(static::ENDPOINT, $body);
        } catch (\Throwable $e) {
            return static::failed(502, $e->getMessage());
        }

        $ms = (int) round((hrtime(true) - $started) / 1e6);

        if (! $response->successful()) {
            // Anthropic's own words: a key that is wrong, credit that is spent.
            return static::failed(502, (string) ($response->json('error.message') ?? $response->status()), $ms);
        }

        $data = (array) $response->json();
        $usage = Reply::usage((array) ($data['usage'] ?? []));
        $text = '';

        Usage::record($body['model'], $mode, $usage);

        // A refusal carries no suggestion; the author simply sees none.
        if (($data['stop_reason'] ?? '') !== 'refusal') {
            foreach ((array) ($data['content'] ?? []) as $block) {
                if (($block['type'] ?? '') === 'text') {
                    $text .= (string) ($block['text'] ?? '');
                }
            }
        }

        return ['ok' => true, 'text' => $text, 'ms' => $ms, 'usage' => $usage];
    }

    /** @return array{ok: false, text: string, ms: int, usage: array<string, int>, status: int, message: string} */
    protected static function failed(int $status, string $message, int $ms = 0): array
    {
        return ['ok' => false, 'text' => '', 'ms' => $ms, 'usage' => [], 'status' => $status, 'message' => $message];
    }
}
