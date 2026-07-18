<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\Http\Controllers\GlobalSectionStashController;
use Statamic\Facades\Entry;
use Symfony\Component\HttpFoundation\Response;

/**
 * Renders a page's Live Preview with the global section the user is *currently
 * typing* in the side panel, rather than the one saved on disk — so editing a
 * synced section shows up in the page around it immediately, in context, without
 * saving first.
 *
 * The page's own form knows nothing about a global section's content: the page
 * only stores a reference, and the template pulls the source entry in at render
 * time. So the swap has to happen on the entry itself — write the unsaved values
 * onto the source entry for the duration of this one render, and every reference
 * to it (this page's, any other's) resolves to them.
 *
 * Only applies when the preview asks for it (`sve_sections=1`, added by
 * preview.js while the panel is open), and the saved values go back once the
 * response is out, so an unsaved section can never be persisted or picked up by
 * anything that runs later.
 */
class OverrideGlobalSectionsInPreview
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($this->shouldOverride($request)) {
            $this->override($request);
        }

        return $next($request);
    }

    protected function shouldOverride(Request $request): bool
    {
        return config('statamic-visual-editor.enabled', true)
            && $request->isLivePreview()
            && $request->boolean('sve_sections')
            && $request->hasSession();
    }

    protected function override(Request $request): void
    {
        $stash = Cache::get(GlobalSectionStashController::cacheKey($request), []);

        if (empty($stash)) {
            return;
        }

        $field = config('statamic-visual-editor.previews.field', 'page_sections');

        foreach ($stash as $id => $raw) {
            if (! $entry = Entry::find($id)) {
                continue;
            }

            $sections = $this->process($entry, $field, $raw);

            if ($sections === null) {
                continue;
            }

            $entry->set($field, $sections);

            // Mutating the object isn't enough: the Stache unserializes a *fresh*
            // instance on every lookup, so the template's `Entry::find()` would
            // get the saved one straight back. `substitute()` is Statamic's own
            // hook for this — it's what Live Preview uses to stand an in-progress
            // entry in for the saved one — and it lasts for this request only.
            $entry->repository()->substitute($entry);
        }
    }

    /**
     * The raw publish-form value run through the blueprint the way Statamic's own
     * save does, so bard, assets and nested sets reach the template in the shape
     * it expects. Returns null when the field can't be processed at all, which
     * leaves the saved section rendering rather than an empty one.
     */
    protected function process($entry, string $field, $raw): ?array
    {
        if (! is_array($raw) || ! array_key_exists($field, $raw)) {
            return null;
        }

        try {
            $fields = $entry->blueprint()->fields()->addValues($raw);

            return $fields->all()->get($field)?->process()->value();
        } catch (\Throwable $e) {
            return null;
        }
    }
}
