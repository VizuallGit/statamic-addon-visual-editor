<?php

namespace MarioHamann\StatamicVisualEditor\AiChat;

use MarioHamann\StatamicVisualEditor\AiFiles;
use MarioHamann\StatamicVisualEditor\SectionTemplate;

/**
 * Which allowed files an agent run touched — a stamp of every file before
 * and after, compared.
 * Moved verbatim out of AiChat in WP7d.
 */
final class ChangedFiles
{
    /**
     * @return array<string, string>
     */
    public static function allowedSnapshot(): array
    {
        $out = [];

        foreach (AiFiles::roots() as $root) {
            if (! is_dir($root)) {
                continue;
            }

            $iter = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($root, \FilesystemIterator::SKIP_DOTS)
            );

            foreach ($iter as $file) {
                if (! $file->isFile()) {
                    continue;
                }

                $path = $file->getPathname();
                $out[$path] = $file->getMTime().':'.$file->getSize();
            }
        }

        ksort($out);

        return $out;
    }

    /**
     * @param  array<string, string>  $before
     * @param  array<string, string>  $after
     * @return list<string>
     */
    public static function changedPaths(array $before, array $after): array
    {
        $changed = [];

        foreach ($after as $path => $stamp) {
            if (($before[$path] ?? null) !== $stamp) {
                $changed[] = SectionTemplate::relative($path);
            }
        }

        return $changed;
    }
}
