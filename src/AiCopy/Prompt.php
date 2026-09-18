<?php

namespace MarioHamann\StatamicVisualEditor\AiCopy;

use MarioHamann\StatamicVisualEditor\Keywords;

/**
 * The brief for one field: its kind and length, the page's keywords, what
 * it says now, what the user asked for, and the language to write in.
 * Moved verbatim out of AiCopy in WP7d.
 */
final class Prompt
{
    /** Suggestions per request. One is the norm for long text; five for a heading. */
    public const MAX_COUNT = 5;

    /** Previously-shown suggestions to write around. */
    public const MAX_AVOID = 12;

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

    protected static function brief(string $kind, string $current, int $words = 0): string
    {
        // The asked-for length wins. It starts at the current length in the
        // panel, so leaving it alone still means "about this long" — but a
        // person who types 60 has said something the current text cannot.
        if ($words < 1) {
            $words = $current === '' ? 0 : count(preg_split('/\s+/', $current) ?: []);
        }

        $length = $words > 0
            ? "AIM FOR ABOUT {$words} WORDS. Roughly — a handful either way is fine, but not half and not double. This has to fit a layout that is already built."
            : 'Keep it tight.';

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

    public static function prompt(array $request): string
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
        $brief = static::brief($kind, $current, max(0, (int) ($request['words'] ?? 0)));

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

    public static function clip(string $text, int $max): string
    {
        return strlen($text) <= $max ? $text : substr($text, 0, $max);
    }
}
