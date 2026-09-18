<?php

namespace MarioHamann\StatamicVisualEditor\BuiltAssets;

/**
 * The site's `public/vendor/visual-editor` is a symlink to this folder,
 * never a copy.
 * Moved verbatim out of BuiltAssets in WP7d.
 */
final class Link
{
    /**
     * Control Panel still asks Statamic for `vendor/visual-editor/build`.
     * That path must be this addon's dist, not a second copy.
     */
    public static function linkForControlPanel(?string $packageName = 'visual-editor'): void
    {
        if (! function_exists('public_path')) {
            return;
        }

        $source = Manifest::root();
        $target = public_path('vendor/'.$packageName.'/build');

        if (! is_dir($source)) {
            return;
        }

        static::replaceWithLink($target, $source);
    }

    protected static function replaceWithLink(string $target, string $source): void
    {
        $parent = dirname($target);

        if (! is_dir($parent)) {
            @mkdir($parent, 0755, true);
        }

        if (is_link($target)) {
            $current = realpath($target) ?: readlink($target);

            if ($current === realpath($source)) {
                return;
            }

            @unlink($target);
        } elseif (is_dir($target)) {
            // A published copy — that is the window that went stale.
            $gone = $target.'.replaced-'.date('YmdHis');
            @rename($target, $gone);
        } elseif (is_file($target)) {
            @unlink($target);
        }

        if (! file_exists($target)) {
            @symlink($source, $target);
        }
    }
}
