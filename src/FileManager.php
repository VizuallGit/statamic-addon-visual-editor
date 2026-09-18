<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\FileManager\Files;
use MarioHamann\StatamicVisualEditor\FileManager\Folders;
use MarioHamann\StatamicVisualEditor\FileManager\Root;
use MarioHamann\StatamicVisualEditor\FileManager\Tree;

/**
 * The site's own code files, browsable from the Control Panel.
 *
 * The template dock and the style manager each open one folder — a section's
 * Antlers file, a stylesheet. This is the same idea widened to everything under
 * `resources`: views, css, js, lang. Saving writes the file on this server.
 *
 * Deliberately *not* the whole project. `app/`, `routes/`, `config/`, `.env`,
 * `composer.json` and `vendor/` are the server's own wiring, and editing them
 * from a browser is remote code execution with extra steps — one compromised
 * super-admin session and the site is someone else's. `content/` is left out
 * too: Statamic has its own screens for it, and writing the raw YAML behind the
 * Stache's back puts the cache out of step with the disk.
 *
 * Three separate walls, because any one of them can be got round on its own:
 *   - the extension whitelist decides what a file may be called;
 *   - `realpath()` decides where it may actually sit, after symlinks;
 *   - the excluded folders never appear in the tree at all.
 *
 * This class is the entry point the controller calls; the work lives in
 * `FileManager\Root` (the three walls: extension, realpath, exclusions),
 * `FileManager\Tree` (the listing), `FileManager\Files` and
 * `FileManager\Folders`. Split in WP7d, code moved verbatim.
 */
class FileManager
{
    public const MAX_BYTES = Root::MAX_BYTES;
    public const EXTENSIONS = Root::EXTENSIONS;
    public const DEFAULT_EXCLUDE = Root::DEFAULT_EXCLUDE;

    /**
     * @see Tree::listing()
     */
    public static function listing(): array
    {
        return Tree::listing();
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
    public static function write(string $relative, string $contents): ?array
    {
        return Files::write($relative, $contents);
    }

    /**
     * Make an empty file. The folder above it is created if it is missing —
     * "views/partials/new/thing.antlers.html" is one step, not three.
     *
     * @see Files::create()
     */
    public static function create(string $relative): ?array
    {
        return Files::create($relative);
    }

    /**
     * Make an empty folder. It has no files yet, so it will not show in the
     * tree until something is put in it — the caller is told the path back so
     * it can offer "new file here" straight away.
     *
     * @see Folders::createFolder()
     */
    public static function createFolder(string $relative): ?array
    {
        return Folders::createFolder($relative);
    }

    /**
     * Rename or move a file. The target folder is created if it is missing, so
     * this doubles as "move into a new folder".
     *
     * @see Files::rename()
     */
    public static function rename(string $from, string $to): ?array
    {
        return Files::rename($from, $to);
    }

    /**
     * Rename or move a folder, with everything under it.
     *
     * @see Folders::renameFolder()
     */
    public static function renameFolder(string $from, string $to): ?array
    {
        return Folders::renameFolder($from, $to);
    }

    /**
     * @see Files::delete()
     */
    public static function delete(string $relative): bool
    {
        return Files::delete($relative);
    }

    /**
     * What a folder holds, so the browser can say "12 files" before asking.
     *
     * @see Folders::folderStats()
     */
    public static function folderStats(string $relative): ?array
    {
        return Folders::folderStats($relative);
    }

    /**
     * Remove a folder and everything under it.
     *
     * @see Folders::deleteFolder()
     */
    public static function deleteFolder(string $relative): bool
    {
        return Folders::deleteFolder($relative);
    }

    /**
     * Absolute path of an existing, editable file — or null.
     *
     * @see Root::existingPath()
     */
    public static function existingPath(string $relative): ?string
    {
        return Root::existingPath($relative);
    }

    /**
     * Absolute path of an existing folder inside the root — or null.
     *
     * @see Root::existingFolder()
     */
    public static function existingFolder(string $relative): ?string
    {
        return Root::existingFolder($relative);
    }

    /**
     * A relative file path this tool accepts, or null.
     *
     * @see Root::normalize()
     */
    public static function normalize(string $relative): ?string
    {
        return Root::normalize($relative);
    }

    /**
     * Which CodeMirror mode opens this file.
     *
     * @see Tree::language()
     */
    public static function language(string $relative): string
    {
        return Tree::language($relative);
    }
}
