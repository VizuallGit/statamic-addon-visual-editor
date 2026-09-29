<?php

namespace MarioHamann\StatamicVisualEditor\Exceptions;

use RuntimeException;

/**
 * A collection preset that cannot be applied as it is written.
 *
 * Raised before anything is copied: a blueprint that Statamic cannot parse
 * would take the whole control panel down on the next request, so the pack
 * is refused whole rather than half-installed.
 *
 * `presetFile`, not `file`: the base Exception already owns `$file` (where
 * it was thrown), and a readonly redeclaration of it is a fatal error.
 */
class InvalidPresetException extends RuntimeException
{
    public function __construct(
        public readonly string $preset,
        public readonly string $presetFile,
        public readonly string $reason,
    ) {
        parent::__construct("Preset '{$preset}': {$presetFile} — {$reason}");
    }
}
