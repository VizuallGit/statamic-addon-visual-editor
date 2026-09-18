<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\SiteCss\Files;
use MarioHamann\StatamicVisualEditor\SiteCss\Imports;
use MarioHamann\StatamicVisualEditor\SiteCss\Root;

/**
 * The site's own stylesheets under `resources/css`.
 *
 * Live Preview's style manager reads and writes these files. `site.css` is
 * the Vite entry; other files only reach the page if that file imports them.
 * `cp.css` is Control Panel CSS and stays out of the tree.
 *
 * This class is the entry point the controller calls; the work lives in
 * `SiteCss\Root` (paths and what is accepted), `SiteCss\Imports` (the
 * `@import` lines in the entry) and `SiteCss\Files` (the operations). Split
 * in WP7d, code moved verbatim.
 */
class SiteCss
{
    public const ENTRY = Root::ENTRY;

    /**
     * @see Files::listing()
     */
    public static function listing(): array
    {
        return Files::listing();
    }

    /**
     * @see Files::read()
     */
    public static function read(string $relative): ?array
    {
        return Files::read($relative);
    }

    /**
     * @see Files::write()
     */
    public static function write(string $relative, string $css): ?array
    {
        return Files::write($relative, $css);
    }

    /**
     * Create an empty stylesheet and, unless it is `site.css` itself,
     * append an `@import` to the entry so Vite actually loads it.
     *
     * @see Files::create()
     */
    public static function create(string $relative): ?array
    {
        return Files::create($relative);
    }

    /**
     * Delete a stylesheet, and take its `@import` out of the entry with it.
     *
     * @see Files::delete()
     */
    public static function delete(string $relative): bool
    {
        return Files::delete($relative);
    }

    /**
     * Rename a stylesheet, and rewrite the `@import` that names it.
     *
     * @see Files::rename()
     */
    public static function rename(string $from, string $to): ?array
    {
        return Files::rename($from, $to);
    }

    /**
     * @see Imports::ensureImport()
     */
    public static function ensureImport(string $relative): bool
    {
        return Imports::ensureImport($relative);
    }

    /**
     * @see Imports::isImported()
     */
    public static function isImported(string $relative): bool
    {
        return Imports::isImported($relative);
    }

    /**
     * @see Root::root()
     */
    public static function root(): string
    {
        return Root::root();
    }

    /**
     * @see Root::existingPath()
     */
    public static function existingPath(string $relative): ?string
    {
        return Root::existingPath($relative);
    }

    /**
     * @see Root::normalize()
     */
    public static function normalize(string $relative, bool $creating = false): ?string
    {
        return Root::normalize($relative, $creating);
    }
}
