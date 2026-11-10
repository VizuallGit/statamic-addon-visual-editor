<?php

namespace MarioHamann\StatamicVisualEditor\Tags;

use MarioHamann\StatamicVisualEditor\StylePushStack;
use Statamic\Tags\Tags;

/**
 * `{{ sve_page_transition }}` — page transitions for a page with an element
 * that flies to the next page (Build → Animation → Page transition, written
 * by resources/js/build-mode/page-transition.js).
 *
 * Pushes resources/animation/page-transition.css onto `style_push` and prints
 * nothing: the page asks for cross-document view transitions and gets the
 * three motions (smooth, spring, snappy). The stack drops a block it already
 * holds, so a page gets it once however many sections ask. CSS only; no
 * script reaches the public site.
 */
class SvePageTransition extends Tags
{
    protected static $handle = 'sve_page_transition';

    public function index(): string
    {
        StylePushStack::push('<style>'.static::css().'</style>');

        return '';
    }

    public static function css(): string
    {
        return trim((string) file_get_contents(__DIR__.'/../../resources/animation/page-transition.css'));
    }
}
