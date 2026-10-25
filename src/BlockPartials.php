<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * The site's shared block partials — `partials/blocks/headline`,
 * `partials/blocks/richtext`, … — read from the folder `templates.blocks`
 * names, the same way the dock lists a `{{ partial src="blocks/{type}" }}`.
 * The dock's help gets them as `sveBlockPartials`, so a replicator set with
 * one of these names is offered as the partial the house renders it with,
 * never as markup guessed in the dock. With them the image partial
 * (`templates.image_partial`), '' when the site has no such file.
 */
final class BlockPartials
{
    /** The `src` with its `{type}` token, as the config has it; '' when off. */
    public static function src(): string
    {
        $src = trim((string) config('statamic-visual-editor.templates.blocks', ''));

        return $src !== '' && DockPartial::hasToken($src) ? $src : '';
    }

    /** The image partial's `src` when the file is on disk; '' otherwise. */
    public static function image(): string
    {
        $src = trim((string) config('statamic-visual-editor.templates.image_partial', ''));

        return $src !== '' && ! DockPartial::hasToken($src) && DockPartial::resolve($src) !== [] ? $src : '';
    }

    /** @return array{src: string, handles: list<string>, image: string} */
    public static function toScript(): array
    {
        $src = static::src();

        return [
            'src' => $src,
            'handles' => $src === '' ? [] : array_values(array_map(fn (array $item) => $item['label'], DockPartial::resolve($src))),
            'image' => static::image(),
        ];
    }
}
