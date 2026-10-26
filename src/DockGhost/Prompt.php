<?php

namespace MarioHamann\StatamicVisualEditor\DockGhost;

use MarioHamann\StatamicVisualEditor\AiChat\Conversation;
use MarioHamann\StatamicVisualEditor\AiChat\HouseStyle;
use MarioHamann\StatamicVisualEditor\AiRules;
use MarioHamann\StatamicVisualEditor\Stores;
use Statamic\Facades\Collection;
use Statamic\Facades\GlobalSet;
use Statamic\Facades\Nav;
use Statamic\Facades\Taxonomy;

/**
 * What the dock's AI writes against — the grey text and ⌘K alike.
 *
 * Two system blocks, each cached: how code is written here — the visual_edit
 * reference, the site's house rules, its design tokens and class names (the
 * same for every request) — then the site's newest sections as examples
 * (the same while the author stays in one section). The user turn is
 * what changes: the task, the file around the caret, the section's fields
 * and what this author has taken lately.
 *
 * The task is in the user turn, not the system, so the four of them share
 * one cached system prompt per model.
 *
 * The examples leave out the section being edited — it is already in the
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

    /** Characters of each example section's file. */
    public const EXAMPLE = 4000;

    public const MAX_FIELDS = 60;

    /** Suggestions this author took, sent as their way of writing. */
    public const MAX_TAKEN = 6;

    public const TAKEN_CHARS = 300;

    public const CONTEXT = <<<'TXT'
You help an author write code in the HTML pane of a Statamic page builder. The file is one section's Antlers partial: HTML with Antlers tags in {{ }}, styled with Tailwind v4 utilities and the site's own classes, Alpine.js for behaviour. The user turn says what to do and how to answer.

Your reply is pasted into the file exactly as you write it: code only. Never explain, never describe the task, never mention <before>, <after> or the caret.

Whatever you write:
- Use fields from the user turn's list only, by their exact handle. Never invent a field.
- An element that shows a field gets {{ visual_edit … }} in its opening tag, pointing at that field: field="handle", and inline_edit="true" when the field is text the author types. Lists get insertable="true" on the list and orderable="true" on the row. See the reference below.
- Style with the site's own tokens and classes (<theme_tokens>), never with Tailwind's default colours, sizes or fonts.
- Follow the house rules and the site's example for how sections are written here.
- Match the file's indentation and quotes.
TXT;

    /**
     * One per way of asking. `line`, `block` and `comment` are the grey text
     * (`block`: the caret on an empty line, where a whole element or loop may
     * come next); `edit` and `insert` are ⌘K.
     */
    public const TASKS = [
        'line' => 'Complete the code at the caret: the Antlers tag, the attribute, the element or the line being written — a few lines at most. Reply with ONLY the text that goes between <before> and <after>: no explanation, no code fence, nothing already in <before> or <after>. If nothing useful fits, reply with nothing at all.',
        'block' => 'The caret is on an empty line. Write what most likely comes next there: the next element, or a whole block of several lines — a loop over a list field with its items, a card, a row of buttons — as this site writes sections. Reply with ONLY that markup: no explanation, no code fence, nothing already in <before> or <after>. If nothing useful fits, reply with nothing at all.',
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

        if (($data = static::siteData()) !== '') {
            $parts[] = "<site_data>\n{$data}\n</site_data>";
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

    /**
     * The site's collections, navigations, taxonomies and globals by handle,
     * with how each is looped or read — so a loop names one that exists
     * instead of a guess (`collection="contacts"` on a site with none).
     */
    public static function siteData(): string
    {
        $named = fn ($items) => $items->map(fn ($item) => $item->handle().($item->title() && $item->title() !== $item->handle() ? ' ('.$item->title().')' : ''))->values()->implode(', ');
        $lines = [];

        try {
            $collections = Collection::all()->reject(fn ($collection) => in_array($collection->handle(), Stores::all(), true));

            if ($collections->isNotEmpty()) {
                $lines[] = 'Collections — loop with {{ collection from="handle" }} … {{ /collection }}: '.$named($collections);
            }

            if (($navs = Nav::all())->isNotEmpty()) {
                $lines[] = 'Navigations — {{ nav:handle }} … {{ /nav:handle }}: '.$named($navs);
            }

            if (($taxonomies = Taxonomy::all())->isNotEmpty()) {
                $lines[] = 'Taxonomies — {{ taxonomy:handle }} … {{ /taxonomy:handle }}: '.$named($taxonomies);
            }

            if (($globals = GlobalSet::all())->isNotEmpty()) {
                $lines[] = 'Globals — {{ handle:field }}: '.$named($globals);
            }
        } catch (\Throwable) {
            return '';
        }

        return $lines === [] ? '' : implode("\n", $lines)."\nUse only these handles; never invent one.";
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

        // Where the caret stands: in x-data="{ | the answer is Alpine state, not markup.
        if ($mode === 'line' && ($hint = Caret::hint(Caret::of(static::before($request)))) !== '') {
            $out .= "Caret: {$hint}\n";
        }

        if ($mode === 'block') {
            $out .= static::blockHint(static::before($request), (array) ($request['fields'] ?? []));
        }

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

    /**
     * A fresh line: the element it stands in, the loop it stands in, and the
     * section's lists — so a new line in a <ul> is offered the loop over
     * `entries` with its <li>, its fields and their visual_edit.
     */
    public static function blockHint(string $before, array $fields): string
    {
        $caret = Caret::of($before);
        $lists = static::lists($fields);
        $loop = static::openLoop($before, array_keys($lists));
        $out = ! empty($caret['inside']) ? "Caret: on an empty line inside <{$caret['inside']}>.\n" : '';

        if ($loop !== null) {
            $names = implode(', ', $lists[$loop]);

            return $out."You are inside the loop {{ {$loop} }}: each item has {$names}. Write the item's markup with those fields, each element pointing at its field with {{ visual_edit … }}, and {{ if field }} … {{ /if }} around an image, a link or another field that may be empty.\n";
        }

        if ($lists !== []) {
            $rows = implode('; ', array_map(fn ($handle, $subs) => $handle.' ('.implode(', ', $subs).')', array_keys($lists), $lists));
            $where = in_array($caret['inside'] ?? null, ['ul', 'ol'], true)
                ? 'This is a list: loop over the list field that fits'
                : 'Where items repeat — a list, a grid, cards — loop over the list field that fits';

            return $out."List fields in this section, with their fields: {$rows}.\n{$where}: {{ handle }} … {{ /handle }} around one item (in a <ul> or <ol>, an <li>), the item showing its fields, each element pointing at its field with {{ visual_edit … }}, and {{ if field }} … {{ /if }} around an image, a link or another field that may be empty.\n";
        }

        return $out;
    }

    /**
     * The section's lists — fields that others name as their parent — each with
     * its own fields' handles.
     *
     * @return array<string, list<string>>
     */
    public static function lists(array $fields): array
    {
        $lists = [];

        foreach (array_slice($fields, 0, static::MAX_FIELDS) as $field) {
            $parent = is_array($field) ? static::oneLine($field['parent'] ?? '') : '';
            $handle = is_array($field) ? static::oneLine($field['var'] ?? '') : '';

            if ($parent !== '' && $handle !== '') {
                $lists[$parent][] = str_starts_with($handle, $parent.'.') ? substr($handle, strlen($parent) + 1) : $handle;
            }
        }

        return $lists;
    }

    /**
     * The innermost of `$handles` opened as an Antlers loop before the caret
     * ({{ entries }} or {{ entries limit="3" }}) and not yet closed.
     *
     * @param  list<string>  $handles
     */
    public static function openLoop(string $before, array $handles): ?string
    {
        if ($handles === []) {
            return null;
        }

        $open = [];

        preg_match_all('/\{\{\s*(\/?)([A-Za-z_][\w.:]*)/', substr($before, -Caret::TAIL), $tags, PREG_SET_ORDER);

        foreach ($tags as [, $closing, $handle]) {
            if (! in_array($handle, $handles, true)) {
                continue;
            }

            if ($closing === '') {
                $open[] = $handle;
            } elseif (($at = array_search($handle, array_reverse($open, true), true)) !== false) {
                $open = array_slice($open, 0, $at);
            }
        }

        return $open === [] ? null : end($open);
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

    /**
     * The site's newest sections (HouseStyle::COUNT), the one being edited
     * left out: how this author writes now — their classes, components, loops
     * and visual_edit — so the suggestions read like their own code.
     */
    public static function example(string $section = ''): string
    {
        $examples = [];

        foreach (HouseStyle::newest($section) as $newest) {
            $file = Conversation::clip((string) @file_get_contents(base_path($newest['partial'])), static::EXAMPLE);

            if (trim($file) !== '') {
                $examples[] = "<example section=\"{$newest['handle']}\">\n{$file}\n</example>";
            }
        }

        return $examples === [] ? '' : "How this site writes sections now — write the way these do:\n".implode("\n", $examples);
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
