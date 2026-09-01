<?php

namespace MarioHamann\StatamicVisualEditor\Tags;

use MarioHamann\StatamicVisualEditor\StylePushStack;
use MarioHamann\StatamicVisualEditor\TailwindStore;
use Statamic\Tags\Tags;

/**
 * Pushes the section's baked Tailwind CSS onto `style_push` — never a
 * `<style>` in the markup. Live Preview already diffs `<head>` the same way
 * as the CSS pane (`syncHeadStyles`).
 *
 * Compiled utilities live in `resources/visual-editor/tw/{type}.css`. A pair
 * with inner HTML is the old in-file store and still pushes so existing
 * partials keep working until the next dock save.
 */
class SveTw extends Tags
{
    protected static $handle = 'sve_tw';

    public function index(): string
    {
        $css = $this->css();

        if ($css !== '') {
            StylePushStack::push('<style>'.$css.'</style>');
        }

        return '';
    }

    protected function css(): string
    {
        if ($this->isPair) {
            $inner = $this->unwrapStyle((string) $this->parse());

            if ($inner !== '') {
                return $inner;
            }
        }

        $handle = (string) ($this->params->get('handle') ?? $this->context->get('type') ?? '');

        return TailwindStore::read($handle);
    }

    protected function unwrapStyle(string $inner): string
    {
        $inner = trim($inner);

        if (preg_match('/^\s*<style\b[^>]*>\s*(.*?)\s*<\/style>\s*$/is', $inner, $m)) {
            return trim($m[1]);
        }

        return $inner;
    }
}
