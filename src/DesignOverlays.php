<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;

/**
 * Design screenshots laid over Live Preview: one per page and screen size.
 *
 * A designer's export of the page (JPG, PNG or WebP) is kept beside the
 * comments, under storage/statamic-visual-editor/design-overlays/{entry}/
 * {breakpoint}.{ext}. Storage, not public/: it is a working file for the
 * people building the page, served only through the editor's own route to a
 * signed-in Control Panel user, and never part of the site or of git.
 *
 * One file per size. A size without one shows nothing — a phone design is not
 * the desktop design scaled down, so no size borrows another's.
 */
class DesignOverlays
{
    /** Extension => the MIME type it must have. */
    public const TYPES = [
        'jpg' => 'image/jpeg',
        'png' => 'image/png',
        'webp' => 'image/webp',
    ];

    /** Upload limit in KB — a full-page PNG at 2× is a few MB; the browser scales anything wider than 3000 px first. */
    public const MAX_KB = 20480;

    public function root(): string
    {
        return storage_path('statamic-visual-editor/design-overlays');
    }

    /** Entry ids are uuids; anything else never reaches the filesystem. */
    public static function validEntry(string $entry): bool
    {
        return (bool) preg_match('/^[A-Za-z0-9_-]{1,80}$/', $entry);
    }

    public static function validBreakpoint(string $breakpoint): bool
    {
        return in_array($breakpoint, Breakpoints::handles(), true);
    }

    /** The stored file for one size, or null. */
    public function path(string $entry, string $breakpoint): ?string
    {
        foreach (array_keys(self::TYPES) as $ext) {
            $file = $this->dir($entry)."/{$breakpoint}.{$ext}";

            if (File::exists($file)) {
                return $file;
            }
        }

        return null;
    }

    /**
     * Every configured size, with its image or null.
     *
     * @return array<string, array{width: int, height: int, version: int}|null>
     */
    public function listing(string $entry): array
    {
        $out = [];

        foreach (Breakpoints::handles() as $breakpoint) {
            $file = $this->path($entry, $breakpoint);

            if (! $file) {
                $out[$breakpoint] = null;

                continue;
            }

            $size = @getimagesize($file) ?: [0, 0];

            $out[$breakpoint] = [
                'width' => (int) $size[0],
                'height' => (int) $size[1],
                'version' => File::lastModified($file),
            ];
        }

        return $out;
    }

    /** Replace one size's image. The caller has validated the upload. */
    public function store(string $entry, string $breakpoint, UploadedFile $file): void
    {
        $ext = array_search($file->getMimeType(), self::TYPES, true);

        if ($ext === false) {
            throw new \InvalidArgumentException('Not a JPG, PNG or WebP image.');
        }

        $this->delete($entry, $breakpoint);
        File::ensureDirectoryExists($this->dir($entry));
        $file->move($this->dir($entry), "{$breakpoint}.{$ext}");
    }

    public function delete(string $entry, string $breakpoint): void
    {
        foreach (array_keys(self::TYPES) as $ext) {
            File::delete($this->dir($entry)."/{$breakpoint}.{$ext}");
        }

        if (File::isDirectory($this->dir($entry)) && ! File::files($this->dir($entry))) {
            File::deleteDirectory($this->dir($entry));
        }
    }

    protected function dir(string $entry): string
    {
        return $this->root().'/'.$entry;
    }
}
