<?php

namespace MarioHamann\StatamicVisualEditor\DockGhost;

use MarioHamann\StatamicVisualEditor\AiChat\Conversation;
use MarioHamann\StatamicVisualEditor\AiChat\HouseStyle;
use MarioHamann\StatamicVisualEditor\AiRules;

/**
 * What the grey text is written against.
 *
 * Two system blocks, each cached: what the job is with the visual_edit
 * reference and the site's house rules (the same for every request), then
 * one of the site's newest sections as the example (the same while the
 * author stays in one section). The user turn is what changes: the file
 * around the caret and the section's fields.
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

    /** The newest section's file, as the example. */
    public const EXAMPLE = 4000;

    public const MAX_FIELDS = 60;

    public const INSTRUCTIONS = <<<'TXT'
You complete code in the HTML pane of a Statamic page builder. The file is one section's Antlers partial: HTML with Antlers tags in {{ }}, styled with Tailwind v4 utilities and the site's own classes, Alpine.js for behaviour.

The user turn holds the file around the caret — everything before it in <before>, everything after it in <after> — and the fields the section has. Reply with ONLY the text to insert at the caret: no explanation, no code fence, nothing that is already in <before> or <after>.

- Finish what is being written: the Antlers tag, the attribute, the element, the line. A few lines at most, never a whole section.
- Use fields from the list only, by their exact handle. Never invent a field.
- An element that shows a field gets {{ visual_edit … }} in its opening tag, pointing at that field: field="handle", and inline_edit="true" when the field is text the author types. Lists get insertable="true" on the list and orderable="true" on the row. See the reference below.
- Follow the house rules and the site's example for how sections are written here.
- Match the file's indentation and quotes.
- If nothing useful fits at the caret, reply with nothing at all.
TXT;

    /** @return list<array{type: string, text: string, cache_control: array{type: string}}> */
    public static function system(string $section = ''): array
    {
        $parts = [static::INSTRUCTIONS];

        if (($reference = static::visualEditReference()) !== '') {
            $parts[] = "<visual_edit_reference>\n{$reference}\n</visual_edit_reference>";
        }

        if (($rules = AiRules::text()) !== '') {
            $parts[] = "<house_rules>\n{$rules}\n</house_rules>";
        }

        $blocks = [static::cached(implode("\n\n", $parts))];

        if (($example = static::example($section)) !== '') {
            $blocks[] = static::cached($example);
        }

        return $blocks;
    }

    /**
     * @param  array{before?: string, after?: string, section?: string, fields?: list<array<string, mixed>>}  $request
     */
    public static function user(array $request): string
    {
        $section = trim((string) ($request['section'] ?? ''));
        $fields = static::fieldLines((array) ($request['fields'] ?? []));

        $out = $section !== '' ? "Section: {$section}\n" : '';
        $out .= $fields !== ''
            ? "Fields (handle · type · label):\n{$fields}\n"
            : "Fields: none known — do not write field tags.\n";

        return $out
            ."<before>\n".static::before($request)."</before>\n"
            ."<after>".static::after($request)."\n</after>\n"
            .'Reply with the text that goes between <before> and <after>.';
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

    /** One line per field, nested ones indented under their parent. */
    public static function fieldLines(array $fields): string
    {
        $lines = [];

        foreach (array_slice($fields, 0, static::MAX_FIELDS) as $field) {
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
}
