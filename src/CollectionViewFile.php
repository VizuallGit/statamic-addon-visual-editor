<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * A collection index/show Antlers file, opened in the template dock.
 *
 * Same HTML / CSS / JS split as a section partial. The type is `view:{path}`
 * so it cannot collide with a section handle.
 */
class CollectionViewFile
{
    public const PREFIX = 'view:';

    public static function viewFromType(string $type): ?string
    {
        if (! str_starts_with($type, self::PREFIX)) {
            return null;
        }

        return CollectionViewTemplates::normalizeView(substr($type, strlen(self::PREFIX)));
    }

    public static function type(?string $view): ?string
    {
        $view = CollectionViewTemplates::normalizeView($view);

        return $view ? self::PREFIX.$view : null;
    }

    public static function path(?string $view): ?string
    {
        $view = CollectionViewTemplates::normalizeView($view);

        if ($view === null) {
            return null;
        }

        $full = resource_path('views/'.$view.'.antlers.html');
        $base = realpath(resource_path('views'));

        if (! is_file($full) || ! is_string($base)) {
            return null;
        }

        $real = realpath($full);

        if (! is_string($real) || ! str_starts_with($real, $base.DIRECTORY_SEPARATOR)) {
            return null;
        }

        return $real;
    }
}
