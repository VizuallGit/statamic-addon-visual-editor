<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\DockGhost\Prompt;
use MarioHamann\StatamicVisualEditor\DockGhost\Reply;
use MarioHamann\StatamicVisualEditor\DockGhost\Usage;
use Statamic\Facades\User;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * The AI in the dock's HTML pane, two ways:
 *
 * - **Grey text** at the caret (`line`, `comment`): the rest of what the
 *   author is writing, or the block a comment above the caret describes —
 *   Copilot's way, taken with Tab.
 * - **⌘K** (`edit`, `insert`): an instruction in the author's words for the
 *   selection, or for the caret when nothing is selected — Cursor's way.
 *
 * Two ways to ask, the site picks one on the settings screen (`provider()`):
 *
 * - **Cursor** (the default): the key the AI chat and AI text already run on,
 *   nothing more to fill in. The question goes to the same Cursor agent,
 *   which takes 10–20 s (13–17 s for two words, measured on the demo).
 * - **Claude**: its own Anthropic key, the fast way — direct calls, a small
 *   model for the grey text and a stronger one for ⌘K, the stable part of
 *   the prompt cached so a request pays for the lines around the caret and
 *   little else.
 *
 * The one picked is the one asked. Without its key the author is told which
 * key is missing; the other way is never tried instead.
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

    /**
     * Output tokens per way of asking. A line is a few lines at most, and
     * every token is time the author waits for it (measured: 29 tokens 0.9 s,
     * 175 tokens 1.8 s on Haiku).
     */
    public const MAX_TOKENS = ['line' => 120, 'comment' => 2048, 'insert' => 2048, 'edit' => 4096];

    /** Seconds per way of asking. A line later than this is one the author has typed past. */
    public const TIMEOUT = ['line' => 8, 'comment' => 30, 'insert' => 45, 'edit' => 60];

    /**
     * The end of a prompt to the Cursor agent. The task already says how to
     * answer; an agent otherwise explains itself, or goes looking in files.
     */
    public const CURSOR_REPLY = 'Answer now, as the task says: only the code itself — no explanation, no code fence, no words before or after it. Everything you need is above; do not open any files.';

    /** The ways to ask, as the settings screen offers them. */
    public const PROVIDERS = ['cursor', 'claude'];

    /**
     * The Claude (Anthropic) key: the settings screen's field first
     * (`ghost_api_key`), then .env — the way the Cursor key and the PageSpeed
     * key are found.
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

    /**
     * The way the dock's AI asks: the settings screen's choice
     * (`ghost_provider`), else config, else `cursor`.
     */
    public static function provider(): string
    {
        $chosen = trim((string) Features::setting('ghost_provider', ''));
        $chosen = $chosen !== '' ? $chosen : trim((string) config('statamic-visual-editor.ghost.provider', ''));

        return in_array($chosen, static::PROVIDERS, true) ? $chosen : 'cursor';
    }

    /** The key of the way picked; '' when the site has none for it. */
    public static function key(): string
    {
        return static::provider() === 'claude' ? static::apiKey() : AiChat::apiKey();
    }

    /** What the author is told when the way picked has no key: which key, and where it goes. */
    public static function needKey(): string
    {
        return __(static::provider() === 'claude' ? 'sve::messages.dock_ghost_need_claude_key' : 'sve::messages.dock_ghost_need_key');
    }

    public static function ready(): bool
    {
        return Features::enabled('dock_ghost') && static::key() !== '';
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
        if ($problem = static::editProblem($request)) {
            return $problem;
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
     * What is wrong with a ⌘K request before anything is asked: no
     * instruction, or a selection too long to send. Null when nothing is.
     * The controller asks first too, so a job is never started for one.
     *
     * @return array{ok: false, text: string, ms: int, usage: array<string, int>, status: int, message: string}|null
     */
    public static function editProblem(array $request): ?array
    {
        if (Prompt::instruction($request) === '') {
            return static::failed(422, __('sve::messages.dock_ghost_edit_empty'));
        }

        if (strlen((string) ($request['selection'] ?? '')) > Prompt::SELECTION) {
            return static::failed(422, __('sve::messages.dock_ghost_edit_too_long'));
        }

        return null;
    }

    /**
     * A background job (`DockGhost\Job`) is now this author's newest question
     * of its kind (`complete` or `edit`); an older one on its way stops (see
     * newest()). Said in the web request that started it, so two workers that
     * boot in the wrong order cannot swap which one is newest.
     */
    public static function claim(string $user, string $kind, string $job): void
    {
        Cache::put(static::askingKey($user, $kind), $job, 300);
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

    /** @return array{ok: bool, text: string, ms: int, usage: array<string, int>, via?: string, status?: int, message?: string} */
    protected static function ask(array $request): array
    {
        if (static::provider() === 'cursor') {
            return static::askCursor($request);
        }

        $key = static::apiKey();

        if ($key === '') {
            return static::failed(422, static::needKey());
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

        $ms = static::since($started);

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

        return ['ok' => true, 'text' => $text, 'ms' => $ms, 'usage' => $usage, 'via' => 'claude'];
    }

    /**
     * The same question to the Cursor agent, on the site's Cursor key: the
     * system blocks' text and the user turn as one prompt, run with no write
     * scope (no file tools, no shell) on the site's default model. Its own
     * 180 s limit applies, not TIMEOUT — a line takes 10–20 s this way.
     * Cursor bills the Cursor account and shows no tokens here, so the month
     * counts the request at $0.
     *
     * @return array{ok: bool, text: string, ms: int, usage: array<string, int>, via?: string, status?: int, message?: string}
     */
    protected static function askCursor(array $request): array
    {
        if (AiChat::apiKey() === '') {
            return static::failed(422, static::needKey());
        }

        set_time_limit(190);

        $mode = Prompt::mode($request);
        $model = CursorAgent::model();
        $system = array_column(Prompt::system((string) ($request['section'] ?? '')), 'text');
        $prompt = implode("\n\n", $system)."\n\n".Prompt::user($request)."\n\n".static::CURSOR_REPLY;
        $started = hrtime(true);

        try {
            $out = app(CursorAgent::class)::run($prompt, model: $model, stopped: static::newest($request));
        } catch (HttpException $e) {
            return static::failed($e->getStatusCode(), $e->getMessage(), static::since($started));
        } catch (\Throwable $e) {
            return static::failed(502, $e->getMessage(), static::since($started));
        }

        $ms = static::since($started);
        $usage = ['input' => 0, 'output' => 0];

        // A newer question from the same author took over: no suggestion.
        if ($out['status'] !== 'finished') {
            return ['ok' => true, 'text' => '', 'ms' => $ms, 'usage' => $usage, 'via' => 'cursor'];
        }

        Usage::record('cursor:'.$model, $mode, $usage);

        return ['ok' => true, 'text' => $out['reply'], 'ms' => $ms, 'usage' => $usage, 'via' => 'cursor'];
    }

    /**
     * Asked every moment while the agent works: has this author asked a newer
     * question of the same kind? The browser drops the older one on the next
     * keystroke, but the agent would run on — for the 10–20 s it takes, with
     * a Node process. Grey text and ⌘K are counted apart.
     *
     * In a background job the author is the request's (`user`, from the job
     * file — the job runs as console) and the job was claimed when it was
     * started (`job`); asked directly (`sve:ghost-try`), the question claims
     * itself here.
     *
     * @return callable(): bool
     */
    protected static function newest(array $request): callable
    {
        $mode = Prompt::mode($request);
        $user = (string) ($request['user'] ?? User::current()?->id() ?? 'console');
        $key = static::askingKey($user, $mode === 'edit' || $mode === 'insert' ? 'edit' : 'complete');
        $mine = (string) ($request['job'] ?? '');

        if ($mine === '') {
            $mine = (string) Str::uuid();
            Cache::put($key, $mine, 300);
        }

        return fn (): bool => Cache::get($key) !== $mine;
    }

    protected static function askingKey(string $user, string $kind): string
    {
        return 'sve-dock-ghost:asking:'.$user.':'.$kind;
    }

    protected static function since(int $started): int
    {
        return (int) round((hrtime(true) - $started) / 1e6);
    }

    /** @return array{ok: false, text: string, ms: int, usage: array<string, int>, status: int, message: string} */
    protected static function failed(int $status, string $message, int $ms = 0): array
    {
        return ['ok' => false, 'text' => '', 'ms' => $ms, 'usage' => [], 'status' => $status, 'message' => $message];
    }
}
