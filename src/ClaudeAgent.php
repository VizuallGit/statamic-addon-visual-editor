<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * The AI chat and AI text on Claude: CursorAgent's run — the same payload,
 * stop, deadline and write gate — with scripts/claude-agent.mjs as the runner
 * and the site's Claude key. Cursor's project layer and MCP servers have no
 * Claude counterpart here and are not sent.
 *
 * The runner's SDK is bundled into the addon (scripts/bundled/anthropic-sdk.mjs,
 * built by scripts/build-anthropic-sdk.mjs), so a site installs nothing for it.
 */
class ClaudeAgent extends CursorAgent
{
    public const KEY_ENV = 'ANTHROPIC_API_KEY';

    public const MISSING_SDK = 'The Claude runner is missing from the Visual Editor addon (scripts/bundled/anthropic-sdk.mjs). Reinstall the addon.';

    public static function script(): string
    {
        return dirname(__DIR__).'/scripts/claude-agent.mjs';
    }

    /** The bundled SDK, or null when the addon was installed without it. */
    public static function sdkPath(): ?string
    {
        $bundle = dirname(__DIR__).'/scripts/bundled/anthropic-sdk.mjs';

        return is_file($bundle) ? $bundle : null;
    }

    public static function model(?string $picked = null): string
    {
        return AiProvider::claudeModel($picked);
    }

    public static function settingSources(): array
    {
        return [];
    }

    public static function mcpServers(): array
    {
        return [];
    }

    protected static function apiKey(): string
    {
        return AiProvider::claudeKey();
    }
}
