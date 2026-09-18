<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\AiChat\ChangedFiles;
use MarioHamann\StatamicVisualEditor\AiChat\Conversation;
use MarioHamann\StatamicVisualEditor\AiChat\Prompt;

/**
 * Super-admin Cursor chat from Live Preview.
 *
 * Uses the same Cursor account — not a second Claude/Anthropic bill.
 * Build mode may change YAML / Antlers under fieldsets, blueprints and
 * page_sections partials. Write mode asks for markup in the reply and
 * reverts any file writes. Anything outside the allowlist is reverted.
 *
 * This class keeps the key, the mode and the run itself (`talk`); the prompt
 * is built by `AiChat\Prompt`, the messages cleaned by `AiChat\Conversation`
 * and the write check done by `AiChat\ChangedFiles`. Split in WP7d, code
 * moved verbatim.
 */
class AiChat
{
    public static function apiKey(): string
    {
        $saved = trim((string) Features::setting('ai_api_key', ''));

        if ($saved !== '') {
            return $saved;
        }

        return trim((string) config('statamic-visual-editor.ai.api_key', ''));
    }

    public static function ready(): bool
    {
        return Features::enabled('ai_panel') && static::apiKey() !== '';
    }

    /**
     * @param  list<array{role: string, content: string}>  $messages
     * @return array{reply: string, applied: bool, path: ?string, mode: string}
     */
    public static function talk(string $handle, array $messages, string $mode = 'write'): array
    {
        abort_unless(static::apiKey() !== '', 422, 'Missing Cursor API key. Get one at cursor.com/dashboard/api — same Cursor account, not Claude.');

        set_time_limit(180);

        $mode = Prompt::modeOf($mode);
        $messages = Conversation::sanitize($messages);
        $before = ChangedFiles::allowedSnapshot();
        $forbidden = AiWriteGuard::snapshot();
        $locked = SectionTemplate::lockedSnapshots();
        $allowed = [];
        $dirtyBefore = [];

        if ($mode === 'write') {
            $dirtyBefore = AiWriteGuard::changedRelativePaths();
            $allowed = AiWriteGuard::snapshotAllowed();
        }

        $out = CursorAgent::run(Prompt::prompt($handle, $messages, $mode));

        AiWriteGuard::restore($forbidden);

        if ($mode === 'write') {
            AiWriteGuard::restoreAllowed($allowed, $dirtyBefore);
        }

        SectionTemplate::restoreLocked($locked);

        $changed = $mode === 'write' ? [] : ChangedFiles::changedPaths($before, ChangedFiles::allowedSnapshot());

        return [
            'reply' => $out['reply'] !== '' ? $out['reply'] : 'Done.',
            'applied' => $changed !== [],
            'path' => $changed[0] ?? null,
            'mode' => $mode,
        ];
    }

    /**
     * @see Prompt::modeOf()
     */
    public static function modeOf(mixed $mode): string
    {
        return Prompt::modeOf($mode);
    }

    /**
     * @see Prompt::modeInstructions()
     */
    public static function modeInstructions(string $mode): string
    {
        return Prompt::modeInstructions($mode);
    }

    /**
     * @see Prompt::targetFiles()
     */
    public static function targetFiles(string $handle): array
    {
        return Prompt::targetFiles($handle);
    }
}
