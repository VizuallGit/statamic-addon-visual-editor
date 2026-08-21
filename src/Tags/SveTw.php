<?php

namespace MarioHamann\StatamicVisualEditor\Tags;

use Statamic\Tags\Tags;

/**
 * Outputs Tailwind CSS the template dock baked into the section file.
 *
 * The pair is a store: the dock writes compiled utilities here so they stay
 * out of the CSS pane. Antlers treats an unknown pair as an empty variable
 * and renders nothing — without this tag the `<style>` never reaches the page.
 */
class SveTw extends Tags
{
    protected static $handle = 'sve_tw';

    public function index(): string
    {
        return (string) $this->parse();
    }
}
