<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\SectionTemplate\Locks;
use MarioHamann\StatamicVisualEditor\SectionTemplate\Panes;
use MarioHamann\StatamicVisualEditor\SectionTemplate\Paths;

/**
 * The Antlers partial a page-section type is rendered from.
 *
 * The dock writes this file. The handle comes from the replicator set
 * (`hero/style_2`); the path is always under the section-partials directory,
 * never anywhere else — `..` and absolute paths are refused.
 *
 * Designed types are locked in the template dock by default. `custom_section`
 * stays editable until a super admin locks it. Unlocking a designed type
 * writes `{{# sve-unlocked #}}`; locking a custom type writes `{{# sve-locked #}}`.
 *
 * This class is the entry point other code calls; the work lives in
 * `SectionTemplate\Paths` (where the file is), `SectionTemplate\Locks` (the
 * dock lock and its markers) and `SectionTemplate\Panes` (split/join of the
 * HTML, CSS, JS and Tailwind panes). Split in WP7d, code moved verbatim.
 */
class SectionTemplate
{
    public const LOCK_MARKER = Locks::LOCK_MARKER;
    public const UNLOCK_MARKER = Locks::UNLOCK_MARKER;

    /**
     * Real path to write the partial, creating parent folders. Null when the
     * handle is unsafe. The file itself does not have to exist yet.
     *
     * @see Paths::writablePath()
     */
    public static function writablePath(string $handle): ?string
    {
        return Paths::writablePath($handle);
    }

    /**
     * @see Paths::path()
     */
    public static function path(string $handle): ?string
    {
        return Paths::path($handle);
    }

    /**
     * @see Paths::relative()
     */
    public static function relative(string $absolute): string
    {
        return Paths::relative($absolute);
    }

    /**
     * Split a section partial into the three dock panes.
     *
     * @see Panes::split()
     */
    public static function split(string $contents, string $handle = ''): array
    {
        return Panes::split($contents, $handle);
    }

    /**
     * Write the three panes back to one Antlers file.
     *
     * @see Panes::join()
     */
    public static function join(array $parts, string $handle = '', ?string $twHandle = null): string
    {
        return Panes::join($parts, $handle, $twHandle);
    }

    /**
     * Designed types are locked until unlocked. `custom_section` (and anything
     * listed in `templates.unlocked`) stays editable until someone locks it.
     *
     * @see Locks::defaultsLocked()
     */
    public static function defaultsLocked(string $handle): bool
    {
        return Locks::defaultsLocked($handle);
    }

    /**
     * @see Locks::fileIsLocked()
     */
    public static function fileIsLocked(string $path): bool
    {
        return Locks::fileIsLocked($path);
    }

    /**
     * Toggle the lock without rewriting the three panes.
     *
     * @see Locks::setLocked()
     */
    public static function setLocked(string $path, bool $locked): void
    {
        Locks::setLocked($path, $locked);
    }

    /**
     * @see Locks::lockedSnapshots()
     */
    public static function lockedSnapshots(): array
    {
        return Locks::lockedSnapshots();
    }

    /**
     * @see Locks::restoreLocked()
     */
    public static function restoreLocked(array $snapshots): void
    {
        Locks::restoreLocked($snapshots);
    }
}
