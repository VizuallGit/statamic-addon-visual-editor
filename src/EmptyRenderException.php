<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * The page rendered, but the section drew nothing — there was no element to
 * photograph.
 *
 * Normal for a section type whose template is guarded on content it has no
 * default for: a column section with no columns, a code block with no code. Worth
 * its own type so the generator can respond by trying its next subject instead of
 * filing "error" against a template that is behaving exactly as written.
 */
class EmptyRenderException extends \RuntimeException
{
    public function __construct(public readonly string $url)
    {
        parent::__construct('The section rendered no markup.');
    }
}
