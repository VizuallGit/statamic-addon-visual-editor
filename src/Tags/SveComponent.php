<?php

namespace MarioHamann\StatamicVisualEditor\Tags;

use MarioHamann\StatamicVisualEditor\ComponentMark;
use Statamic\Tags\Tags;

/**
 * The pair `ComponentMark::preparse` puts around a partial's text in Live
 * Preview. It renders its content as the partial would have rendered on its
 * own — same scope, nothing added — and writes `data-sve-component="<src>"`
 * onto the first content element of the result (`ComponentMark::stamp`).
 *
 * Never written in a file by hand; the preparser is the only author.
 */
class SveComponent extends Tags
{
    protected static $handle = 'sve_component';

    public function index(): string
    {
        $html = (string) $this->parse();
        $src = trim((string) $this->params->get('src', ''));

        return $src === '' ? $html : ComponentMark::stamp($html, $src);
    }
}
