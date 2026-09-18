<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\ComponentProps\Declaration;
use MarioHamann\StatamicVisualEditor\ComponentProps\Schema;

/**
 * The inputs a component declares: `headline`, `image`, `text`.
 *
 * A component is a partial, and Antlers already hands a partial's parameters
 * to it as plain variables — `{{ partial:components/card headline="Hi" }}`
 * arrives inside as `{{ headline }}`. So the *values* need no store at all:
 * they are the call, and a card used in three places is three calls with three
 * sets of values. That is the whole point of the thing.
 *
 * What does need somewhere to live is the *declaration* — the name, the kind
 * of input, and what it falls back to. That rides in the component file, as an
 * Antlers comment at the top:
 *
 *     {{#sve_props
 *     [{"handle":"headline","type":"text","default":"Overskrift"}]
 *     #}}
 *
 * A comment, and deliberately not a tag. Antlers throws comments away while it
 * parses, and a parsed template is cached — so the declaration costs the
 * rendered page nothing at all, no class is loaded, and Live Preview never
 * touches it. A `{{ sve_props }}` tag would have been a node to visit on every
 * render of every card on the page, for a block whose only reader is the
 * Control Panel.
 *
 * It also means the feature can be switched off and the file still renders:
 * the declaration goes quiet, `{{ headline }}` keeps reading whatever the call
 * passes it, and nothing has to be undone.
 *
 * This class is the entry point other code calls; the file shape lives in
 * `ComponentProps\Declaration` and the rules for one prop in
 * `ComponentProps\Schema`. Split in WP7d, code moved verbatim.
 */
class ComponentProps
{
    public const TYPES = Schema::TYPES;
    public const PREFIX = Schema::PREFIX;

    /**
     * What a component declares, read from its view name.
     *
     * This is what the section side asks for: it holds the call, and needs to
     * know which fields to draw next to it.
     *
     * @return list<array<string, string>>
     */
    public static function forView(string $view): array
    {
        $path = static::viewPath($view);

        return $path === null ? [] : Declaration::peel((string) file_get_contents($path))['props'];
    }

    protected static function viewPath(string $view): ?string
    {
        $view = trim(str_replace('\\', '/', $view), '/');

        if ($view === '' || str_contains($view, '..') || ! preg_match('#^[A-Za-z0-9_][A-Za-z0-9_/-]*$#', $view)) {
            return null;
        }

        $base = realpath(resource_path('views'));
        $path = realpath(resource_path('views/'.$view.'.antlers.html'));

        if (! is_string($base) || ! is_string($path) || ! str_starts_with($path, $base.DIRECTORY_SEPARATOR)) {
            return null;
        }

        return is_file($path) ? $path : null;
    }

    /**
     * The parameter name a prop is written as, in the call and in the pair.
     *
     * @see Schema::param()
     */
    public static function param(string $handle): string
    {
        return Schema::param($handle);
    }

    /**
     * Pull the declaration out of a component file.
     *
     * @see Declaration::peel()
     */
    public static function peel(string $contents): array
    {
        return Declaration::peel($contents);
    }

    /**
     * The comment block for a declaration, or '' when there is nothing to say.
     *
     * @see Declaration::block()
     */
    public static function block(array $props): string
    {
        return Declaration::block($props);
    }

    /**
     * A finished component file: what it declares, around what it renders.
     *
     * @see Declaration::wrap()
     */
    public static function wrap(array $props, string $body): string
    {
        return Declaration::wrap($props, $body);
    }

    /**
     * The opening tag: one parameter per prop, the default as its value.
     *
     * @see Declaration::open()
     */
    public static function open(array $props): string
    {
        return Declaration::open($props);
    }

    /**
     * Every prop is a handle, a type and a default, and nothing else gets in.
     *
     * @see Schema::normalize()
     */
    public static function normalize(array $props): array
    {
        return Schema::normalize($props);
    }

    /**
     * @see Schema::handle()
     */
    public static function handle(string $raw): ?string
    {
        return Schema::handle($raw);
    }
}
