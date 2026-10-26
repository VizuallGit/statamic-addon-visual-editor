<?php

namespace MarioHamann\StatamicVisualEditor\DockGhost;

use MarioHamann\StatamicVisualEditor\AiChat\Conversation;
use MarioHamann\StatamicVisualEditor\AiChat\HouseStyle;
use MarioHamann\StatamicVisualEditor\AiRules;

/**
 * What the dock's AI writes against — the grey text and ⌘K alike.
 *
 * Two system blocks, each cached: how code is written here — the visual_edit
 * reference, the site's house rules, its design tokens and class names (the
 * same for every request) — then one of the site's newest sections as the
 * example (the same while the author stays in one section). The user turn is
 * what changes: the task, the file around the caret, the section's fields
 * and what this author has taken lately.
 *
 * The task is in the user turn, not the system, so the four of them share
 * one cached system prompt per model.
 *
 * The example leaves out the section being edited — it is already in the
 * request, and with autosave it is also the newest file, which would change
 * the cached block on every save.
 */
final class Prompt
{
    /** Characters of the file before the caret, cut back to a line start. */
    public const BEFORE = 3000;

    /** Characters after the caret, cut back to a line end. */
    public const AFTER = 1200;

    /** A selection longer than this is not sent; the edit is refused instead. */
    public const SELECTION = 12000;

    /** What the author typed in the ⌘K box. */
    public const INSTRUCTION = 600;

    /** The newest section's file, as the example. */
    public const EXAMPLE = 4000;

    public const MAX_FIELDS = 60;

    /** Suggestions this author took, sent as their way of writing. */
    public const MAX_TAKEN = 6;

    public const TAKEN_CHARS = 300;

    public const CONTEXT = <<<'TXT'
You help an author write code in the HTML pane of a Statamic page builder. The file is one section's Antlers partial: HTML with Antlers tags in {{ }}, styled with Tailwind v4 utilities and the site's own classes, Alpine.js for behaviour. The user turn says what to do and how to answer.

Whatever you write:
- Use fields from the user turn's list only, by their exact handle. Never invent a field.
- An element that shows a field gets {{ visual_edit … }} in its opening tag, pointing at that field: field="handle", and inline_edit="true" when the field is text the author types. Lists get insertable="true" on the list and orderable="true" on the row. See the reference below.
- Style with the site's own tokens and classes (<theme_tokens>), never with Tailwind's default colours, sizes or fonts.
- Follow the house rules and the site's example for how sections are written here.
- Match the file's indentation and quotes.
TXT;

    /** One per way of asking. `line` and `comment` are the grey text; `edit` and `insert` are ⌘K. */
    public const TASKS = [
        'line' => 'Complete the code at the caret: the Antlers tag, the attribute, the element or the line being written — a few lines at most. Reply with ONLY the text that goes between <before> and <after>: no explanation, no code fence, nothing already in <before> or <after>. If nothing useful fits, reply with nothing at all.',
        'comment' => 'The line above the caret is a comment in which the author describes what they want. Write that markup in full at the caret, as this site writes sections. Reply with ONLY the markup that goes between <before> and <after>: no explanation, no code fence, not the comment again, nothing already in <after>.',
        'edit' => 'Rewrite the code in <selection> as the instruction says, and keep what it does not ask to change. Reply with ONLY the code that replaces the selection, whole: no explanation, no code fence, nothing from <before> or <after>.',
        'insert' => 'Write the code the instruction asks for, to go in at the caret. Reply with ONLY that code: no explanation, no code fence, nothing already in <before> or <after>.',
    ];

    /** @return list<array{type: string, text: string, cache_control: array{type: string}}> */
    public static function system(string $section = ''): array
    {
        $parts = [static::CONTEXT];

        if (($reference = static::visualEditReference()) !== '') {
            $parts[] = "<visual_edit_reference>\n{$reference}\n</visual_edit_reference>";
        }

        if (($rules = AiRules::text()) !== '') {
            $parts[] = "<house_rules>\n{$rules}\n</house_rules>";
        }

        if (($tokens = Tokens::forSite()) !== '') {
            $parts[] = "<theme_tokens>\n{$tokens}\n</theme_tokens>";
        }

        $blocks = [static::cached(implode("\n\n", $parts))];

        if (($example = static::example($section)) !== '') {
            $blocks[] = static::cached($example);
        }

        return $blocks;
    }

    /** The way of asking, one of TASKS. Anything else is `line`. */
    public static function mode(array $request): string
    {
        $mode = (string) ($request['mode'] ?? 'line');

        return array_key_exists($mode, static::TASKS) ? $mode : 'line';
    }

    /**
     * @param  array{mode?: string, instruction?: string, before?: string, selection?: string, after?: string, section?: string, fields?: list<array<string, mixed>>, taken?: list<array<string, mixed>>}  $request
     */
    public static function user(array $request): string
    {
        $mode = static::mode($request);
        $section = trim((string) ($request['section'] ?? ''));
        $fields = static::fieldLines((array) ($request['fields'] ?? []));
        $taken = static::takenLines((array) ($request['taken'] ?? []));

        $out = 'Task: '.static::TASKS[$mode]."\n";

        if ($mode === 'edit' || $mode === 'insert') {
            $out .= 'Instruction: '.static::instruction($request)."\n";
        }

        $out .= $section !== '' ? "Section: {$section}\n" : '';
        $out .= $fields !== ''
            ? "Fields (handle · type · label):\n{$fields}\n"
            : "Fields: none known — do not write field tags.\n";

        if ($taken !== '') {
            $out .= "What this author took from you lately — write the way they do:\n{$taken}\n";
        }

        $out .= "<before>\n".static::before($request).'</before>';

        if ($mode === 'edit') {
            $out .= "\n<selection>".static::selection($request).'</selection>';
        }

        return $out."\n<after>".static::after($request)."\n</after>";
    }

    /** The file before the caret: its last part, from the start of a line. */
    public static function before(array $request): string
    {
        $text = (string) ($request['before'] ?? '');

        if (strlen($text) <= static::BEFORE) {
            return $text;
        }

        $text = substr($text, -static::BEFORE);
        $line = strpos($text, "\n");

        return $line === false ? $text : substr($text, $line + 1);
    }

    /** The file after the caret: its first part, to the end of a line. */
    public static function after(array $request): string
    {
        $text = (string) ($request['after'] ?? '');

        if (strlen($text) <= static::AFTER) {
            return $text;
        }

        $text = substr($text, 0, static::AFTER);
        $line = strrpos($text, "\n");

        return $line === false ? $text : substr($text, 0, $line);
    }

    public static function selection(array $request): string
    {
        return substr((string) ($request['selection'] ?? ''), 0, static::SELECTION);
    }

    public static function instruction(array $request): string
    {
        return static::oneLine(mb_substr((string) ($request['instruction'] ?? ''), 0, static::INSTRUCTION));
    }

    /** One line per field, nested ones indented under their parent. */
    public static function fieldLines(array $fields): string
    {
        $lines = [];

        foreach (array_slice($fields, 0, static::MAX_FIELDS) as $field) {
            if (! is_array($field)) {
                continue;
            }

            $handle = static::oneLine($field['var'] ?? '');

            if ($handle === '') {
                continue;
            }

            $type = static::oneLine($field['type'] ?? '');
            $label = static::oneLine($field['label'] ?? '');
            $indent = static::oneLine($field['parent'] ?? '') !== '' ? '  ' : '';

            $lines[] = "{$indent}- {$handle}".($type !== '' ? " · {$type}" : '').($label !== '' ? " · {$label}" : '');
        }

        return implode("\n", $lines);
    }

    /**
     * The author's latest taken suggestions, each as the line it followed and
     * what they took — newest last, a newline shown as ⏎.
     */
    public static function takenLines(array $taken): string
    {
        $lines = [];

        foreach (array_slice($taken, -static::MAX_TAKEN) as $row) {
            if (! is_array($row)) {
                continue;
            }

            $text = static::shown(mb_substr((string) ($row['text'] ?? ''), 0, static::TAKEN_CHARS));
            $line = static::shown(mb_substr(trim((string) ($row['line'] ?? '')), -120));

            if ($text !== '') {
                $lines[] = "- after `{$line}`: `{$text}`";
            }
        }

        return implode("\n", $lines);
    }

    /** The addon's own visual_edit guide for Antlers — the same text Laravel Boost hands an agent. */
    public static function visualEditReference(): string
    {
        $path = dirname(__DIR__, 2).'/resources/boost/skills/visual-editor-antlers/SKILL.md';
        $text = is_file($path) ? (string) file_get_contents($path) : '';

        // The frontmatter is for Boost, not for the model.
        return trim((string) preg_replace('/\A---\R.*?\R---\R/s', '', $text));
    }

    /** One of the site's newest sections, the one being edited left out. */
    public static function example(string $section = ''): string
    {
        $newest = HouseStyle::newest($section)[0] ?? null;

        if ($newest === null) {
            return '';
        }

        $file = Conversation::clip((string) @file_get_contents(base_path($newest['partial'])), static::EXAMPLE);

        if (trim($file) === '') {
            return '';
        }

        return "<example section=\"{$newest['handle']}\">\nHow this site writes a section now:\n{$file}\n</example>";
    }

    /** @return array{type: string, text: string, cache_control: array{type: string}} */
    protected static function cached(string $text): array
    {
        return ['type' => 'text', 'text' => $text, 'cache_control' => ['type' => 'ephemeral']];
    }

    protected static function oneLine(mixed $value): string
    {
        return is_scalar($value) ? trim((string) preg_replace('/\s+/', ' ', (string) $value)) : '';
    }

    /** Text on one line, its newlines kept visible. */
    protected static function shown(string $value): string
    {
        return str_replace(["\r\n", "\n", '`'], ['⏎', '⏎', "'"], $value);
    }
}
