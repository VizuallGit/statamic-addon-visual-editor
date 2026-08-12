<?php

namespace MarioHamann\StatamicVisualEditor\Listeners;

use MarioHamann\StatamicVisualEditor\PreviewRefresher;
use MarioHamann\StatamicVisualEditor\SavedSectionPreview;
use Statamic\Events\BlueprintSaved;
use Statamic\Events\EntryDeleted;
use Statamic\Events\EntrySaved;
use Statamic\Events\FieldsetSaved;
use Statamic\Events\GlobalVariablesSaved;

/**
 * Keeps the preview images in step with the site, by noticing the saves that can
 * change what a section looks like.
 *
 * The point of hanging this on events rather than a button is that a preview
 * nobody remembered to regenerate is worse than no preview: the picker keeps
 * promising a design the site no longer has. Every path that can invalidate one
 * ends in a save, so every such save asks for a refresh, and the fingerprints
 * downstream make asking almost free.
 *
 * What is watched, and why:
 *
 * - a saved section or template saved — its own picture is now wrong
 * - a fieldset or blueprint saved — a section type's default values, which is
 *   what its preview is a picture of, may have changed
 * - the theme's global variables saved — colours and fonts, so every preview
 * - one of those entries deleted — its screenshot has nothing left to depict
 *
 * Not watched: ordinary page saves. A section type's preview comes from its
 * defaults, not from any page, so editing a page changes nothing about it. The
 * exception is the fallback for a type with no defaults at all, and the section
 * library asks for a refresh when it opens, which covers that without putting a
 * process behind every page save on the site.
 */
class RefreshPreviews
{
    public function handle($event): void
    {
        match (true) {
            $event instanceof EntrySaved => $this->entry($event),
            $event instanceof EntryDeleted => $this->deleted($event),
            $event instanceof FieldsetSaved,
            $event instanceof BlueprintSaved,
            $event instanceof GlobalVariablesSaved => PreviewRefresher::kick(),
            default => null,
        };
    }

    /** A saved section or template — refresh that one entry, not the site. */
    protected function entry(EntrySaved $event): void
    {
        if (SavedSectionPreview::specFor($event->entry) === null) {
            return;
        }

        PreviewRefresher::kick($event->entry->id());
    }

    /**
     * Deleting one of the store entries: drop its image here and now.
     *
     * Not through the refresher — there is nothing to render, and the entry is
     * already gone by the time a detached process would look for it.
     */
    protected function deleted(EntryDeleted $event): void
    {
        if (SavedSectionPreview::specFor($event->entry) === null) {
            return;
        }

        app(SavedSectionPreview::class)->forget($event->entry);
    }
}
