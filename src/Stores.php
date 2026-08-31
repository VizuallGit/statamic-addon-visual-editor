<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Collection;

/**
 * The editor's own collections — libraries, not pages.
 */
class Stores
{
    /**
     * Where page compositions (stacks of sections) live.
     *
     * Config wins when that collection exists. Otherwise the current handle,
     * then the old `saved_templates` name, so a site mid-rename still resolves.
     */
    public static function compositions(): string
    {
        $configured = config('statamic-visual-editor.templates.collection');
        $candidates = [];

        if (is_string($configured) && $configured !== '') {
            $candidates[] = $configured;
        }

        foreach (['saved_compositions', 'saved_templates'] as $handle) {
            if (! in_array($handle, $candidates, true)) {
                $candidates[] = $handle;
            }
        }

        foreach ($candidates as $handle) {
            if (Collection::findByHandle($handle)) {
                return $handle;
            }
        }

        return $candidates[0] ?? 'saved_compositions';
    }

    /** Asset folder for composition preview images (`saved_compositions` → `saved-compositions`). */
    public static function compositionsFolder(): string
    {
        return str_replace('_', '-', static::compositions());
    }

    /**
     * Collection-view templates (index/show for a blueprint), not page compositions.
     */
    public static function collectionTemplates(): string
    {
        $configured = config('statamic-visual-editor.collection_templates.collection');

        if (is_string($configured) && $configured !== '') {
            return $configured;
        }

        return 'templates';
    }

    /**
     * Every editor store — nav items, hidden from Collections, skipped as pages.
     *
     * @return list<string>
     */
    public static function all(): array
    {
        return array_values(array_unique(array_filter([
            config('statamic-visual-editor.saved_sections.collection', 'saved_sections'),
            static::compositions(),
            static::collectionTemplates(),
        ])));
    }

    /**
     * Stores that get their own Content nav item.
     *
     * Collection templates stay off this list until the settings toggle is on,
     * so a site that only needs the page builder does not grow a Templates item.
     *
     * @return list<string>
     */
    public static function nav(): array
    {
        $handles = [
            config('statamic-visual-editor.saved_sections.collection', 'saved_sections'),
            static::compositions(),
        ];

        if (Features::enabled('collection_templates')) {
            $handles[] = static::collectionTemplates();
        }

        return array_values(array_unique(array_filter($handles)));
    }
}
