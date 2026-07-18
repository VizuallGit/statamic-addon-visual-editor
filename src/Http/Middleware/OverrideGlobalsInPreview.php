<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\Http\Controllers\GlobalsPreviewController;
use Statamic\Facades\GlobalSet;
use Statamic\Facades\Site;
use Symfony\Component\HttpFoundation\Response;

/**
 * Renders Live Preview with the globals the user is *currently typing*, rather
 * than the ones saved on disk — so changing a phone number in the globals panel
 * shows up in the preview immediately, without saving first.
 *
 * Only applies when the preview explicitly asks for it (`sve_globals=1`, added
 * by preview.js while the globals panel is open). Without that, a stale override
 * could silently change the preview long after the panel was closed.
 *
 * `Cascade::hydrated()` is Statamic's own hook for this — it runs after the
 * cascade has pulled the globals in, which is exactly where they can be swapped.
 */
class OverrideGlobalsInPreview
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
            && $request->boolean('sve_globals')
            && $request->hasSession();
    }

    /**
     * Applies the unsaved values to the global sets themselves, for the duration
     * of this one render.
     *
     * Overriding the cascade alone isn't enough: plenty of code reads a global
     * straight from the repository — the colour-scheme addon resolves a section's
     * palette with `GlobalSet::findByHandle('theme_settings')`, so a colour
     * changed in the panel would render with the *saved* value while the phone
     * number beside it updated. Writing to the repository's own objects covers
     * both routes at once, since the cascade hydrates from the same instances.
     *
     * The saved values are put back once the response is out, so an unsaved value
     * can never be persisted or cached by anything that runs later.
     */
    protected function override(Request $request): void
    {
        $overrides = Cache::get(GlobalsPreviewController::cacheKey($request), []);

        if (empty($overrides)) {
            return;
        }

        $site = Site::current()->handle();

        foreach ($overrides as $handle => $raw) {
            if (! $set = GlobalSet::findByHandle($handle)) {
                continue;
            }

            if (! $variables = $set->in($site)) {
                continue;
            }

            $saved = $variables->data();

            $variables->data($this->process($variables, $raw, $saved->all()));

            app()->terminating(fn () => $variables->data($saved));
        }
    }

    /**
     * The raw publish-form values run through the blueprint the way Statamic's own
     * save does, so anything that isn't a plain string (assets, replicators, Bard)
     * ends up in the shape the templates expect.
     *
     * Processed field by field, deliberately: a single field that can't be
     * processed — a set pointing at an asset that no longer exists throws
     * AssetNotFoundException — would otherwise take the whole global set down with
     * it, and every change in it would silently stop reaching the preview. A field
     * that fails simply keeps its saved value.
     */
    protected function process($variables, array $raw, array $saved): array
    {
        $fields = $variables->blueprint()->fields()->addValues($raw);
        $values = $saved;

        foreach ($fields->all() as $handle => $field) {
            try {
                $values[$handle] = $field->process()->value();
            } catch (\Throwable $e) {
                // Keep the saved value for this one field.
            }
        }

        return $values;
    }
}
