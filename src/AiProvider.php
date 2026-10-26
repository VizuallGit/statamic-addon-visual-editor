<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * Which AI the editor runs on — one choice for all of it: the AI chat, AI
 * text and the AI in the HTML dock. Cursor runs on the site's Cursor key
 * through Cursor's agent; Claude on a Claude API key, paid per use.
 *
 * The choice is the settings screen's `ghost_provider` (the handle the dock's
 * own choice had, so a site that picked Claude there keeps it), else config
 * `ghost.provider`, else Cursor. Only the key of the way picked is used; the
 * other is never tried instead.
 */
final class AiProvider
{
    public const PROVIDERS = ['cursor', 'claude'];

    /** The Claude models the AI chat and AI text offer, strongest first. */
    public const CLAUDE_MODELS = [
        'claude-opus-5-5' => 'Claude Opus 5.5',
        'claude-sonnet-5-5' => 'Claude Sonnet 5.5',
        'claude-haiku-5-5' => 'Claude Haiku 5.5',
    ];

    public const CLAUDE_DEFAULT = 'claude-opus-5-5';

    public static function current(): string
    {
        $chosen = trim((string) Features::setting('ghost_provider', ''));
        $chosen = $chosen !== '' ? $chosen : trim((string) config('statamic-visual-editor.ghost.provider', ''));

        return in_array($chosen, static::PROVIDERS, true) ? $chosen : 'cursor';
    }

    public static function claude(): bool
    {
        return static::current() === 'claude';
    }

    /** The Cursor key: the settings field, then CURSOR_API_KEY. */
    public static function cursorKey(): string
    {
        return AiChat::apiKey();
    }

    /** The Claude key: the settings field (`ghost_api_key`), then ANTHROPIC_API_KEY. */
    public static function claudeKey(): string
    {
        $saved = trim((string) Features::setting('ghost_api_key', ''));

        return $saved !== '' ? $saved : trim((string) config('statamic-visual-editor.ghost.api_key', ''));
    }

    /** The key of the way picked; '' when the site has none for it. */
    public static function key(): string
    {
        return static::claude() ? static::claudeKey() : static::cursorKey();
    }

    /** What the author is told when the way picked has no key: which key, and where it goes. */
    public static function needKey(): string
    {
        return __(static::claude() ? 'sve::messages.ai_need_claude_key' : 'sve::messages.ai_need_cursor_key');
    }

    /** The agent the AI chat and AI text run: Cursor's, or the Claude runner with the same contract. */
    public static function agent(): string
    {
        return static::claude() ? ClaudeAgent::class : CursorAgent::class;
    }

    /** The model a chat or AI text uses: the one picked in the panel when it fits the way picked, else the site's default. */
    public static function model(?string $picked = null): string
    {
        return static::claude() ? static::claudeModel($picked) : CursorAgent::model($picked);
    }

    /** A Claude model: the one picked, else the settings' default, when it is one of CLAUDE_MODELS; else Opus. */
    public static function claudeModel(?string $picked = null): string
    {
        foreach ([$picked, Features::setting('ai_model', '')] as $id) {
            $id = trim((string) $id);

            if (array_key_exists($id, static::CLAUDE_MODELS)) {
                return $id;
            }
        }

        return static::CLAUDE_DEFAULT;
    }

    /**
     * The picker's rows on Claude.
     *
     * @return list<array{id: string, name: string, group: string}>
     */
    public static function claudeModels(): array
    {
        return array_map(
            fn (string $id, string $name) => ['id' => $id, 'name' => $name, 'group' => 'Claude'],
            array_keys(static::CLAUDE_MODELS),
            static::CLAUDE_MODELS,
        );
    }
}
