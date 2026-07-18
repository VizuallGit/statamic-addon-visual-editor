<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\URL;
use Spatie\Browsershot\Browsershot;
use Statamic\Contracts\Entries\Entry;
use Statamic\Facades\AssetContainer;
use Statamic\Fieldtypes\Sets;

/**
 * Screenshots a saved section and stores it as the entry's preview image, so the
 * section picker can show it visually.
 *
 * Reuses the same headless-browser approach as the Add Set preview generator:
 * render the section on its own (via the signed saved-section-preview route) and
 * capture the first child of <main>. The image lands in the same asset container
 * the previews already use, in a `saved-sections` folder.
 */
class SavedSectionPreview
{
    /**
     * @param  array  $spec  Where to put the image and what to shoot. Defaults are
     *                       the saved-section ones, so existing callers are
     *                       unaffected; a page template overrides all three to
     *                       capture its whole stack from its own render route.
     */
    public function generate(Entry $saved, array $spec = []): bool
    {
        $config = Sets::previewImageConfig();

        if (! $config) {
            return false;
        }

        $container = AssetContainer::find($config['container']);

        if (! $container) {
            return false;
        }

        $folder = $spec['folder'] ?? 'saved-sections';
        $selector = $spec['selector'] ?? 'main > *';
        $route = $spec['route'] ?? 'sve.saved-section-preview';

        $field = config('statamic-visual-editor.previews.field', 'page_sections');
        $filename = $saved->id().'-'.substr(md5(json_encode($saved->value($field)).microtime()), 0, 8).'.png';
        $path = $folder.'/'.$filename;

        $url = URL::temporarySignedRoute($route, now()->addMinutes(15), [
            'id' => $saved->id(),
        ]);

        $width = (int) config('statamic-visual-editor.previews.width', 1440);
        $delay = (int) config('statamic-visual-editor.previews.delay', 1500);
        $tmp = tempnam(sys_get_temp_dir(), 'sve').'.png';

        try {
            Browsershot::url($url)
                ->setNodeModulePath(base_path('node_modules/'))
                ->ignoreHttpsErrors()
                ->windowSize($width, (int) round($width * 0.7))
                ->deviceScaleFactor(2)
                ->waitUntilNetworkIdle()
                ->delay($delay)
                ->select($selector)
                ->save($tmp);

            $container->disk()->filesystem()->put($path, file_get_contents($tmp));
        } catch (\Throwable $e) {
            @unlink($tmp);

            return false;
        }

        @unlink($tmp);

        // Point the entry at the new image, removing the previous one.
        $old = $saved->value('preview_image');

        $saved->set('preview_image', $path)->saveQuietly();

        if ($old && $old !== $path) {
            $container->disk()->filesystem()->delete($old);
        }

        return true;
    }
}
