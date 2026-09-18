<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\AiCopy\Prompt;
use MarioHamann\StatamicVisualEditor\AiCopy\Reply;

/**
 * Copy suggestions for one field, written against the page's keywords.
 *
 * Same Cursor account as the AI chat, and a different job: the chat changes
 * files, this one changes nothing at all. It runs behind the same write guard
 * the chat's Write mode uses, so an agent that decides to be helpful and edit a
 * template on the way past is rolled back before the answer is returned.
 *
 * The request is small and the answer is a list of strings, which is why it does
 * not reuse AiChat's prompt: that one hands over the section's HTML, CSS, JS and
 * fieldset, and none of that helps write a headline.
 *
 * This class keeps the run (`suggest`) behind the write guard; the prompt is
 * built by `AiCopy\Prompt` and the answer read by `AiCopy\Reply`. Split in
 * WP7d, code moved verbatim.
 */
class AiCopy
{
    public const MAX_COUNT = Prompt::MAX_COUNT;
    public const MAX_AVOID = Prompt::MAX_AVOID;

    public static function ready(): bool
    {
        return Features::enabled('ai_text') && AiChat::apiKey() !== '';
    }

    /**
     * @param  array{
     *     kind?: string,
     *     text?: string,
     *     instruction?: string,
     *     count?: int,
     *     words?: int,
     *     avoid?: list<string>,
     *     keywords?: list<string>,
     *     page?: string,
     *     section?: string,
     *     label?: string,
     * }  $request
     * @return list<string>
     */
    public static function suggest(array $request): array
    {
        abort_unless(AiChat::apiKey() !== '', 422, __('sve::messages.ai_text_need_key'));

        set_time_limit(180);

        // Nothing here is meant to touch the disk. The guard is the second lock:
        // the prompt says output only, and this puts back anything the agent
        // wrote anyway — outside the allowlist and inside it.
        $forbidden = AiWriteGuard::snapshot();
        $dirtyBefore = AiWriteGuard::changedRelativePaths();
        $allowed = AiWriteGuard::snapshotAllowed();

        try {
            $out = CursorAgent::run(Prompt::prompt($request));
        } finally {
            AiWriteGuard::restore($forbidden);
            AiWriteGuard::restoreAllowed($allowed, $dirtyBefore);
        }

        return Reply::parse($out['reply'] ?? '', Prompt::count($request));
    }

    /**
     * @see Prompt::count()
     */
    public static function count(array $request): int
    {
        return Prompt::count($request);
    }

    /**
     * One of three shapes, because the brief differs and the length differs.
     *
     * @see Prompt::kindOf()
     */
    public static function kindOf(mixed $kind): string
    {
        return Prompt::kindOf($kind);
    }

    /**
     * The suggestions out of a reply that should be JSON and might not be.
     *
     * @see Reply::parse()
     */
    public static function parse(string $reply, int $count): array
    {
        return Reply::parse($reply, $count);
    }
}
