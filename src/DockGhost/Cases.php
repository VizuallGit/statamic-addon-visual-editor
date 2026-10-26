<?php

namespace MarioHamann\StatamicVisualEditor\DockGhost;

/**
 * Real moments from this site's own sections, for `sve:ghost-try`: the file
 * cut where an author would be typing, with what they actually wrote there
 * as the answer to compare with.
 *
 * Two kinds, the two the grey text is for:
 *
 * - `visual_edit` — `{{ visual_` typed in an opening tag, the rest of the
 *   element after it. The answer is the rest of the tag as written.
 * - `next_line` — Enter after an opening tag, the line that follows not yet
 *   written. The answer is that line.
 *
 * Same input, same cases, in the same order: a run can be compared with the
 * one before it.
 */
final class Cases
{
    public const VISUAL_EDIT = '/\{\{\s*visual_edit\b[^}]*\}\}/';

    /**
     * @return list<array{section: string, kind: string, before: string, after: string, expected: string}>
     */
    public static function fromFile(string $section, string $source): array
    {
        return array_merge(static::visualEdit($section, $source), static::nextLine($section, $source));
    }

    /**
     * The cases taken from each section and kind in turn, so a short run
     * still sees both kinds in more than one section.
     *
     * @param  list<array{kind: string, section?: string}>  $cases
     * @return list<array>
     */
    public static function mixed(array $cases, int $count): array
    {
        $byKind = [];

        foreach ($cases as $case) {
            $byKind[($case['section'] ?? '').'|'.$case['kind']][] = $case;
        }

        $out = [];

        while (count($out) < $count && $byKind !== []) {
            foreach (array_keys($byKind) as $kind) {
                $next = array_shift($byKind[$kind]);

                if ($next === null) {
                    unset($byKind[$kind]);

                    continue;
                }

                $out[] = $next;

                if (count($out) >= $count) {
                    break;
                }
            }
        }

        return $out;
    }

    /** @return list<array{section: string, kind: string, before: string, after: string, expected: string}> */
    public static function visualEdit(string $section, string $source): array
    {
        preg_match_all(static::VISUAL_EDIT, $source, $matches, PREG_OFFSET_CAPTURE);

        $out = [];

        foreach ($matches[0] as [$tag, $at]) {
            $caret = $at + strpos($tag, 'visual_') + strlen('visual_');

            $out[] = [
                'section' => $section,
                'kind' => 'visual_edit',
                'before' => substr($source, 0, $caret),
                'after' => substr($source, $at + strlen($tag)),
                'expected' => substr($tag, $caret - $at),
            ];
        }

        return $out;
    }

    /** @return list<array{section: string, kind: string, before: string, after: string, expected: string}> */
    public static function nextLine(string $section, string $source): array
    {
        $lines = explode("\n", $source);
        $out = [];
        $offset = 0;

        foreach ($lines as $i => $line) {
            $next = $lines[$i + 1] ?? null;
            $lineEnd = $offset + strlen($line);

            if ($next !== null && preg_match('/<[a-zA-Z][^<>]*>\s*$/', $line) && trim($next) !== '' && ! str_starts_with(trim($next), '</')) {
                $indent = (string) preg_replace('/\S.*$/s', '', $next);

                $out[] = [
                    'section' => $section,
                    'kind' => 'next_line',
                    'before' => substr($source, 0, $lineEnd)."\n".$indent,
                    'after' => substr($source, $lineEnd + 1 + strlen($next)),
                    'expected' => trim($next),
                ];
            }

            $offset = $lineEnd + 1;
        }

        return $out;
    }
}
