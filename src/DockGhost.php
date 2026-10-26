<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\Http;
use MarioHamann\StatamicVisualEditor\DockGhost\Prompt;
use MarioHamann\StatamicVisualEditor\DockGhost\Reply;

/**
 * Grey text at the caret in the dock's HTML pane: the rest of what the author
 * is writing, offered in grey and taken with Tab — Copilot's way, with this
 * site's sections, fields and house rules behind it.
 *
 * Not the AI chat's Cursor agent: an agent takes seconds to start, and grey
 * text that arrives after the author has typed on is noise. One direct call
 * to a small, fast Claude model, the stable part of the prompt cached, so a
 * request pays for the lines around the caret and little else.
 *
 * Suggests only. Nothing here writes a file; the text goes back to the
 * browser, and only a Tab puts it in the pane.
 *
 * The prompt is built by `DockGhost\Prompt`, the answer tidied by
 * `DockGhost\Reply`.
 */
class DockGhost
{
    public const ENDPOINT = 'https://api.anthropic.com/v1/messages';

    /** The API version the request is written against. */
    public const API_VERSION = '2026-10-21';

    /** Small and fast: grey text is only worth it while the author waits. */
    public const MODEL = 'claude-haiku-5-5';

    /** A line or a few — never a section. */
    public const MAX_TOKENS = 256;

    /** Seconds. A suggestion later than this is one the author has typed past. */
    public const TIMEOUT = 8;

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

    public static function model(): string
    {
        $model = trim((string) config('statamic-visual-editor.ghost.model', ''));

        return $model !== '' ? $model : static::MODEL;
    }

    public static function ready(): bool
    {
        return Features::enabled('dock_ghost') && static::apiKey() !== '';
    }

    /**
     * @param  array{before?: string, after?: string, section?: string, fields?: list<array<string, mixed>>}  $request
     * @return array{ok: bool, text: string, ms: int, usage: array<string, int>, status?: int, message?: string}
     */
    public static function complete(array $request): array
    {
        $key = static::apiKey();

        if ($key === '') {
            return static::failed(422, __('sve::messages.dock_ghost_need_key'));
        }

        $started = hrtime(true);

        try {
            $response = Http::timeout(static::TIMEOUT)
                ->withHeaders([
                    'x-api-key' => $key,
                    'anthropic-version' => static::API_VERSION,
                ])
                ->post(static::ENDPOINT, static::body($request));
        } catch (\Throwable $e) {
            return static::failed(502, $e->getMessage());
        }

        $ms = (int) round((hrtime(true) - $started) / 1e6);

        if (! $response->successful()) {
            // Anthropic's own words: a key that is wrong, credit that is spent.
            return static::failed(502, (string) ($response->json('error.message') ?? $response->status()), $ms);
        }

        $data = (array) $response->json();
        $text = '';

        // A refusal carries no suggestion; the author simply sees none.
        if (($data['stop_reason'] ?? '') !== 'refusal') {
            foreach ((array) ($data['content'] ?? []) as $block) {
                if (($block['type'] ?? '') === 'text') {
                    $text .= (string) ($block['text'] ?? '');
                }
            }
        }

        return [
            'ok' => true,
            'text' => Reply::clean($text, Prompt::before($request), Prompt::after($request)),
            'ms' => $ms,
            'usage' => Reply::usage((array) ($data['usage'] ?? [])),
        ];
    }

    /**
     * The request: the cached house knowledge, then the caret's surroundings.
     * Thinking off and effort low — a line of markup, wanted now.
     *
     * @return array<string, mixed>
     */
    public static function body(array $request): array
    {
        return [
            'model' => static::model(),
            'max_tokens' => static::MAX_TOKENS,
            'thinking' => ['type' => 'disabled'],
            'output_config' => ['effort' => 'low'],
            'system' => Prompt::system((string) ($request['section'] ?? '')),
            'messages' => [
                ['role' => 'user', 'content' => Prompt::user($request)],
            ],
        ];
    }

    /** @return array{ok: false, text: string, ms: int, usage: array<string, int>, status: int, message: string} */
    protected static function failed(int $status, string $message, int $ms = 0): array
    {
        return ['ok' => false, 'text' => '', 'ms' => $ms, 'usage' => [], 'status' => $status, 'message' => $message];
    }
}
