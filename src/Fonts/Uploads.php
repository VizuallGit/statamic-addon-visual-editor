<?php

namespace MarioHamann\StatamicVisualEditor\Fonts;

use Illuminate\Http\UploadedFile;

/**
 * A font file from the editor's own computer, into `{family}/` in the fonts
 * folder. The browser has already read its family, weight and style from the
 * file and — when asked to — converted it to WOFF2; here the bytes are
 * checked to be the font they say they are.
 */
final class Uploads
{
    public const MAX_BYTES = 20 * 1024 * 1024;

    /** First bytes of each format. */
    private const SIGNATURES = [
        'woff2' => ['wOF2'],
        'woff' => ['wOFF'],
        'ttf' => ["\x00\x01\x00\x00", 'true'],
        'otf' => ['OTTO'],
    ];

    /**
     * The face to add to fonts.css; null when the file is not a font, the
     * weight makes no sense, or the file cannot be written.
     *
     * @return array{file: string, format: string, weight: string, style: string, unicodeRange: null}|null
     */
    public static function store(UploadedFile $upload, string $family, string $weight, string $style): ?array
    {
        $bytes = (string) file_get_contents($upload->getRealPath());
        $extension = static::extension($bytes);
        $weight = static::weight($weight);

        if ($extension === null || $weight === null || strlen($bytes) > self::MAX_BYTES) {
            return null;
        }

        $stem = Folder::slug(pathinfo($upload->getClientOriginalName(), PATHINFO_FILENAME));
        $file = Folder::store(Folder::slug($family)."/{$stem}.{$extension}", $bytes);

        if ($file === null) {
            return null;
        }

        return [
            'file' => $file,
            'format' => Stylesheet::format($extension),
            'weight' => $weight,
            'style' => $style === 'italic' ? 'italic' : 'normal',
            'unicodeRange' => null,
        ];
    }

    /** The file's real format from its first bytes, whatever its name says. */
    public static function extension(string $bytes): ?string
    {
        $head = substr($bytes, 0, 4);

        foreach (self::SIGNATURES as $extension => $signatures) {
            if (in_array($head, $signatures, true)) {
                return $extension;
            }
        }

        return null;
    }

    /** `400`, or `100 900` for a variable font; null for anything else. */
    public static function weight(string $weight): ?string
    {
        if (! preg_match('/^\s*(\d{1,4})(?:\s+(\d{1,4}))?\s*$/', $weight, $m)) {
            return null;
        }

        $values = array_map('intval', array_filter([$m[1], $m[2] ?? null], fn ($v) => $v !== null && $v !== ''));

        foreach ($values as $value) {
            if ($value < 1 || $value > 1000) {
                return null;
            }
        }

        return count($values) === 2 && $values[0] !== $values[1]
            ? min($values).' '.max($values)
            : (string) $values[0];
    }
}
