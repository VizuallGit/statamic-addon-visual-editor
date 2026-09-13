<?php

namespace MarioHamann\StatamicVisualEditor;

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
 */
class AiCopy
{
    /** Suggestions per request. One is the norm for long text; five for a heading. */
    public const MAX_COUNT = 5;

    /** Previously-shown suggestions to write around. */
    public const MAX_AVOID = 12;

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
            $out = CursorAgent::run(static::prompt($request));
        } finally {
            AiWriteGuard::restore($forbidden);
            AiWriteGuard::restoreAllowed($allowed, $dirtyBefore);
        }

        return static::parse($out['reply'] ?? '', static::count($request));
    }

    public static function count(array $request): int
    {
        $count = (int) ($request['count'] ?? 1);

        return max(1, min(static::MAX_COUNT, $count));
    }

    /**
     * One of three shapes, because the brief differs and the length differs.
     *
     * `rich` is a Bard field — it may answer in several paragraphs. `heading` is
     * one line and has to stay one line. `text` is everything else: a lead, a
     * button label, a short intro, where the field's own length is the only
     * guide there is.
     */
    public static function kindOf(mixed $kind): string
    {
        $kind = is_string($kind) ? strtolower(trim($kind)) : '';

        return in_array($kind, ['heading', 'rich', 'text'], true) ? $kind : 'text';
    }

    protected static function brief(string $kind, string $current): string
    {
        $words = $current === '' ? 0 : count(preg_split('/\s+/', $current) ?: []);
        $length = $words > 0
            ? "The text there now is about {$words} words. Stay close to that — this has to fit a layout that is already built."
            : 'The field is empty, so there is no length to match. Keep it tight.';

        return match ($kind) {
            'heading' => <<<TXT
This is a HEADING. One line, no trailing full stop, no quotation marks around it.
Short enough not to wrap into three lines on a phone. {$length}
TXT,
            'rich' => <<<TXT
This is RICH TEXT — body copy. Several paragraphs are allowed: separate them with one blank line.
Plain text only. No markdown, no HTML, no bullet characters, no headings inside it. {$length}
TXT,
            default => <<<TXT
This is a SHORT TEXT field — a lead, an intro, a label. One or two sentences at most, and often less.
Plain text, no markdown. {$length}
TXT,
        };
    }

    protected static function prompt(array $request): string
    {
        $kind = static::kindOf($request['kind'] ?? '');
        $count = static::count($request);
        $current = static::clip(trim((string) ($request['text'] ?? '')), 4000);
        $instruction = static::clip(trim((string) ($request['instruction'] ?? '')), 2000);
        // The page's own keywords if it has any; the site's if it has none.
        // A fallback, not a blend: mixing the two writes copy aimed at whatever
        // the site says about itself rather than at what this page is for.
        $pageKeywords = Keywords::clean($request['keywords'] ?? []);
        $fromSite = $pageKeywords === [];
        $keywords = $fromSite ? Keywords::site() : $pageKeywords;
        $page = static::clip(trim((string) ($request['page'] ?? '')), 200);
        $section = static::clip(trim((string) ($request['section'] ?? '')), 120);
        $label = static::clip(trim((string) ($request['label'] ?? '')), 120);
        $locale = static::language();
        $brief = static::brief($kind, $current);

        if ($keywords === []) {
            $keywordBlock = 'THERE ARE NO KEYWORDS. Write from the current text and the page title, and do not invent a subject.';
        } elseif ($fromSite) {
            $keywordBlock = "KEYWORDS — this page has none of its own, so these are the site's. They are broader than one page, so lean on the current text for what THIS page is about:\n- "
                .implode("\n- ", $keywords);
        } else {
            $keywordBlock = "KEYWORDS FOR THIS PAGE — what the text is to be about:\n- "
                .implode("\n- ", $keywords);
        }

        $avoid = array_slice(array_filter(array_map(
            fn ($row) => static::clip(trim((string) $row), 1000),
            is_array($request['avoid'] ?? null) ? $request['avoid'] : []
        )), 0, static::MAX_AVOID);

        $avoidBlock = $avoid === []
            ? ''
            : "\nALREADY SUGGESTED — the user has seen these and asked for more. Do not repeat them, and do not "
                ."rephrase them either. Take a different angle:\n- ".implode("\n- ", $avoid)."\n";

        $context = array_filter([
            $page !== '' ? "Page: {$page}" : null,
            $section !== '' ? "Section type: {$section}" : null,
            $label !== '' ? "Field: {$label}" : null,
        ]);
        $contextBlock = $context === [] ? '' : "\nWHERE IT SITS:\n".implode("\n", $context)."\n";

        $currentBlock = $current === ''
            ? "\nTHE FIELD IS EMPTY.\n"
            : "\nWHAT IT SAYS NOW — the thing you are replacing. Keep its subject and its role on the page:\n{$current}\n";

        $wish = $instruction === ''
            ? "The user asked for suggestions without saying more. Improve it on its own terms: clearer, and aimed at the keywords."
            : "WHAT THE USER ASKED FOR — this outranks everything except the shape and the length:\n{$instruction}";

        $plural = $count === 1 ? 'ONE suggestion' : "{$count} suggestions, each a different angle";

        return <<<TXT
You write website copy. You are not editing files and you have no reason to read any: everything you need is below.

Write {$plural} for one field on a page, in {$locale}.

{$brief}

{$keywordBlock}
{$contextBlock}{$currentBlock}{$avoidBlock}
{$wish}

HOW TO USE THE KEYWORDS
Write for a person, not for a crawler. A keyword belongs in the text when it is what the sentence is about.
Bend it to fit the grammar — inflect it, split it, turn it into the natural phrase a Danish or English sentence
would actually use. Repeating a keyword in its raw form is worse than not using it. One or two per suggestion
is plenty for a heading; body copy may carry a few more and their variants.
Never write a keyword list. Never write copy that reads as though it was written to contain words.

ANSWER FORMAT — this matters, the answer is read by a program.
Reply with a JSON array of strings and nothing else. No prose before it, no explanation after it, no code fence.
Each string is one complete suggestion. In rich text, separate paragraphs with \\n\\n inside the string.
Exactly {$count} item(s).

Example of the shape (not the content):
["First suggestion.", "Second suggestion."]
TXT;
    }

    /**
     * The Control Panel user's language, named so the model can act on it.
     *
     * The copy goes on the site, so the site's language would be the more
     * obvious source — but a Danish site is edited by Danish editors, and the
     * editor's own CP language is the one setting that is actually maintained.
     */
    protected static function language(): string
    {
        $locale = \Statamic\Facades\User::current()?->preferredLocale()
            ?? \Statamic\Facades\Site::current()->lang()
            ?? config('app.locale', 'en');

        $short = strtolower(substr((string) $locale, 0, 2));

        $names = [
            'da' => 'Danish',
            'de' => 'German',
            'en' => 'English',
            'es' => 'Spanish',
            'fi' => 'Finnish',
            'fr' => 'French',
            'it' => 'Italian',
            'nb' => 'Norwegian',
            'nl' => 'Dutch',
            'nn' => 'Norwegian',
            'no' => 'Norwegian',
            'pt' => 'Portuguese',
            'sv' => 'Swedish',
        ];

        return $names[$short] ?? "the language of the text below (locale {$locale})";
    }

    /**
     * The suggestions out of a reply that should be JSON and might not be.
     *
     * Three readings, narrowing: the whole reply as JSON, the first array in it,
     * and failing both, a numbered or blank-line-separated list. The last one is
     * there because a model that ignores the format still wrote usable copy, and
     * throwing it away would show the user an error over a formatting slip.
     *
     * @return list<string>
     */
    public static function parse(string $reply, int $count): array
    {
        $reply = trim($reply);

        if ($reply === '') {
            return [];
        }

        foreach (static::candidates($reply) as $candidate) {
            $rows = json_decode($candidate, true);

            if (is_array($rows) && $rows !== []) {
                $out = static::strings($rows);

                if ($out !== []) {
                    return array_slice($out, 0, $count);
                }
            }
        }

        return array_slice(static::fromList($reply), 0, $count);
    }

    /**
     * @return list<string>
     */
    protected static function candidates(string $reply): array
    {
        $out = [$reply];

        // ```json … ``` — asked not to, does it anyway often enough to handle.
        if (preg_match('/```[A-Za-z0-9_-]*\s*\n([\s\S]*?)```/', $reply, $m)) {
            $out[] = trim($m[1]);
        }

        $start = strpos($reply, '[');
        $end = strrpos($reply, ']');

        if ($start !== false && $end !== false && $end > $start) {
            $out[] = substr($reply, $start, $end - $start + 1);
        }

        return $out;
    }

    /**
     * @param  array<mixed>  $rows
     * @return list<string>
     */
    protected static function strings(array $rows): array
    {
        $out = [];

        foreach ($rows as $row) {
            // A model that wraps each suggestion in an object: {"text": "…"}.
            if (is_array($row)) {
                $row = $row['text'] ?? $row['suggestion'] ?? $row['heading'] ?? null;
            }

            if (! is_string($row)) {
                continue;
            }

            $text = static::tidy($row);

            if ($text !== '' && ! in_array($text, $out, true)) {
                $out[] = $text;
            }
        }

        return $out;
    }

    /**
     * A numbered or blank-line-separated list, when JSON never arrived.
     *
     * @return list<string>
     */
    protected static function fromList(string $reply): array
    {
        $numbered = preg_split('/^\s*(?:\d+[.)]|[-*•])\s+/m', $reply) ?: [];
        $rows = count($numbered) > 1 ? $numbered : (preg_split('/\n{2,}/', $reply) ?: []);
        $out = [];

        foreach ($rows as $row) {
            $text = static::tidy($row);

            // A leading sentence like "Here are five suggestions:" is not one.
            if ($text === '' || str_ends_with($text, ':') || in_array($text, $out, true)) {
                continue;
            }

            $out[] = $text;
        }

        return $out;
    }

    /**
     * One suggestion, as it should go into the field.
     *
     * Quotation marks around the whole thing are the model quoting itself, not
     * copy — a heading that arrives as "Hypnose i Holstebro" must not be written
     * into the page with the quotes still on.
     */
    protected static function tidy(string $text): string
    {
        $text = trim(str_replace(["\r\n", "\r"], "\n", $text));
        $text = preg_replace('/\n{3,}/', "\n\n", $text) ?? $text;
        $text = trim($text);

        foreach ([['"', '"'], ['“', '”'], ['«', '»'], ["'", "'"]] as [$open, $close]) {
            if ($text !== '' && str_starts_with($text, $open) && str_ends_with($text, $close) && mb_strlen($text) > 1) {
                $inner = mb_substr($text, mb_strlen($open), -mb_strlen($close));

                // Only when the quotes wrap everything — copy may legitimately
                // quote someone in the middle.
                if (! str_contains($inner, $open) && ! str_contains($inner, $close)) {
                    $text = trim($inner);
                }
            }
        }

        return static::clip($text, 8000);
    }

    protected static function clip(string $text, int $max): string
    {
        return strlen($text) <= $max ? $text : substr($text, 0, $max);
    }
}
