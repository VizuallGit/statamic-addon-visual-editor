<?php

namespace MarioHamann\StatamicVisualEditor\AiChat;

use MarioHamann\StatamicVisualEditor\SectionTemplate\Paths;
use MarioHamann\StatamicVisualEditor\SectionTypes;

/**
 * How this site builds its sections now — the newest ones, by when their
 * partial was last saved.
 *
 * The agent is shown them so a new section is built the way the designer
 * builds today: Tailwind classes in the markup when that is what the newest
 * sections do, CSS in style_push when it is that, the same wrapper names, the
 * same block partials, the same fieldset tabs. The written rules describe a
 * way of building; the newest sections are the way actually in use.
 *
 * Old, explained and archived copies and the AI's own demo are left out.
 */
final class HouseStyle
{
    public const COUNT = 3;

    /** How much of the newest section's file goes into the prompt. */
    public const CLIP = 6000;

    private const SKIP = '~(^|/)(_archive|ai_demo)/|\.(old|explained|bak)\.|\.(old|bak)$~';

    /**
     * @return list<array{handle: string, partial: string, fieldset: ?string, mtime: int}>
     */
    public static function newest(string $exclude = ''): array
    {
        $dir = Paths::directory();

        if (! is_dir($dir)) {
            return [];
        }

        $root = rtrim(str_replace('\\', '/', realpath(base_path()) ?: base_path()), '/').'/';
        $base = rtrim(str_replace('\\', '/', realpath($dir) ?: $dir), '/').'/';
        $found = [];
        $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS));

        foreach ($files as $file) {
            $path = str_replace('\\', '/', $file->getPathname());

            if (! $file->isFile() || ! str_ends_with($path, '.antlers.html')) {
                continue;
            }

            $real = str_replace('\\', '/', realpath($path) ?: $path);
            $handle = substr($real, strlen($base), -strlen('.antlers.html'));

            // Only sections — folder/name — not loose partials in the root.
            if (! str_starts_with($real, $base) || substr_count($handle, '/') !== 1 || $handle === $exclude || preg_match(self::SKIP, $handle.'.antlers.html')) {
                continue;
            }

            $found[] = ['handle' => $handle, 'path' => $real, 'mtime' => (int) $file->getMTime()];
        }

        usort($found, fn ($a, $b) => [$b['mtime'], $a['handle']] <=> [$a['mtime'], $b['handle']]);

        $out = [];

        foreach (array_slice($found, 0, static::COUNT) as $row) {
            $import = SectionTypes::fieldsetOf($row['handle']);

            $out[] = [
                'handle' => $row['handle'],
                'partial' => str_starts_with($row['path'], $root) ? substr($row['path'], strlen($root)) : $row['path'],
                'fieldset' => $import !== null ? 'resources/fieldsets/'.str_replace('.', '/', $import).'.yaml' : null,
                'mtime' => $row['mtime'],
            ];
        }

        return $out;
    }

    /** The block for the prompt, or '' when the site has no sections yet. */
    public static function prompt(string $exclude = ''): string
    {
        $newest = static::newest($exclude);

        if ($newest === []) {
            return '';
        }

        $list = '';

        foreach ($newest as $row) {
            $list .= "- {$row['handle']}: {$row['partial']}".($row['fieldset'] ? " (fieldset {$row['fieldset']})" : '')."\n";
        }

        $first = Conversation::clip((string) @file_get_contents(base_path($newest[0]['partial'])), static::CLIP);

        return <<<TXT
HOUSE STYLE — the site's newest sections. This is how the designer builds now.
{$list}
Before you write a new section or new markup, read these files and build the same way: Tailwind utility classes in the HTML if that is what they use, CSS in the style_push block if that is what they use; the same wrapper and inner-block names; the same block partials; the same fieldset tabs and fieldtypes. Where these sections and the written CSS rules in this prompt disagree about HOW to style, follow these sections. The section frame — id="id-{{ id }}", [ {{ _class }} ], {{ visual_edit … }}, style_push / script_push — always stays.

The newest one ({$newest[0]['handle']}), as it is now:
{$first}
TXT;
    }
}
