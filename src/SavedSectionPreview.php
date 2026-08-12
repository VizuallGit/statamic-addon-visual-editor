<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\URL;
use Statamic\Contracts\Entries\Entry;
use Statamic\Facades\AssetContainer;
use Statamic\Fieldtypes\Sets;

/**
 * Screenshots a saved section — or a whole page template — and stores it as that
 * entry's preview image, so the section library shows the thing itself rather
 * than a name in a list.
 *
 * Same approach as the section-type generator: render it on its own through a
 * signed route, photograph it, and name the file after a fingerprint of
 * everything the picture depends on (the section's own data, its partial, the
 * built CSS, the theme settings). The fingerprint is what lets this be called on
 * every save of every saved section: unchanged means the filename matches, and
 * the browser is never started.
 *
 * Which is the difference between a preview that is a picture of the section and
 * one that was a picture of it once, when somebody first created it.
 */
class SavedSectionPreview
{
    /**
     * @param  array  $spec  Where to put the image and what to shoot. Defaults are
     *                       the saved-section ones, so existing callers are
     *                       unaffected; a page template overrides all three to
     *                       capture its whole stack from its own render route.
     * @param  bool  $force  Re-shoot even when the fingerprint says it is current.
     * @return string  "ok" | "fresh" | "skipped: …" | "error: …"
     */
    public function generate(Entry $saved, array $spec = [], bool $force = false): string
    {
        $config = Sets::previewImageConfig();

        if (! $config) {
            return 'error: statamic.assets.set_preview_images is not configured';
        }

        if (! $container = AssetContainer::find($config['container'])) {
            return 'error: asset container "'.$config['container'].'" does not exist';
        }

        $folder = $spec['folder'] ?? 'saved-sections';
        $selector = $spec['selector'] ?? 'main > *';
        $route = $spec['route'] ?? 'sve.saved-section-preview';

        $field = config('statamic-visual-editor.previews.field', 'page_sections');
        $sections = $saved->value($field);

        if (! is_array($sections) || $sections === []) {
            return 'skipped: nothing stored on this entry';
        }

        $filesystem = $container->disk()->filesystem();

        $path = $folder.'/'.$saved->id().'-'.PreviewFingerprint::forSections($sections).'.png';
        $old = $saved->value('preview_image');

        if (! $force && $old === $path && $filesystem->exists($path)) {
            return 'fresh';
        }

        $url = URL::temporarySignedRoute($route, now()->addMinutes(30), ['id' => $saved->id()]);

        $tmp = tempnam(sys_get_temp_dir(), 'sve').'.png';

        try {
            PreviewBrowser::shoot($url, $selector, $tmp);

            $filesystem->put($path, file_get_contents($tmp));
        } catch (\Throwable $e) {
            @unlink($tmp);

            return 'error: '.trim($e->getMessage());
        }

        @unlink($tmp);

        // Point the entry at the new image, removing the previous one. Quietly:
        // this is a save of our own, and letting it fire EntrySaved would have the
        // listener ask for another screenshot of what we just photographed.
        $saved->set('preview_image', $path)->saveQuietly();

        if ($old && $old !== $path) {
            PreviewFile::forget($container, $old);
        }

        return 'ok';
    }

    /**
     * Drops the entry's screenshot. Called when the saved section or template
     * itself is deleted — nothing else points at the file, so leaving it behind
     * would just grow the asset container with images of things that no longer
     * exist.
     */
    public function forget(Entry $saved): void
    {
        $path = $saved->value('preview_image');

        if (! $path || ! $config = Sets::previewImageConfig()) {
            return;
        }

        if ($container = AssetContainer::find($config['container'])) {
            PreviewFile::forget($container, $path);
        }
    }

    /**
     * The render spec for an entry, from the collection it lives in.
     *
     * A saved section is one section, photographed on its own; a template is every
     * section in it, photographed as the page it describes. Keeping the mapping
     * here means a caller only ever needs the entry — which is what the save
     * listener has.
     */
    public static function specFor(Entry $entry): ?array
    {
        $collection = $entry->collectionHandle();

        if ($collection === config('statamic-visual-editor.saved_sections.collection', 'saved_sections')) {
            return []; // the defaults
        }

        if ($collection === config('statamic-visual-editor.templates.collection', 'saved_templates')) {
            return [
                'folder' => 'saved-templates',
                'route' => 'sve.saved-template-preview',
                // The whole stack, not one section: that's what a template is.
                'selector' => 'main',
            ];
        }

        return null;
    }
}
