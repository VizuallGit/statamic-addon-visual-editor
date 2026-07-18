<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\URL;
use Spatie\Browsershot\Browsershot;
use Statamic\Facades\AssetContainer;
use Statamic\Facades\Entry;
use Statamic\Facades\Fieldset;
use Statamic\Facades\Site;
use Statamic\Fieldtypes\Sets;

/**
 * Regenerates the "Preview Image" of a page-builder's section types by
 * screenshotting a REAL rendered instance of each type on the site (server-side,
 * via a headless browser). For each set type it finds an entry that uses it,
 * then captures that section's `#id-<uid>` element — so previews always use real
 * content and need no per-type selector guessing.
 *
 * The images live in the container/folder configured by
 * `statamic.assets.set_preview_images`, so Statamic's native Add Set picker shows
 * them. Filenames are content-addressed (`<base>-<hash>.png`): a design change
 * gives a new hash → new (otherwise path-only, year-cached) thumbnail URL, so
 * every browser picks up the new preview without a hard refresh; unchanged
 * designs keep a stable filename (no churn). The set's `image:` in the fieldset
 * YAML is updated to match and the old file removed.
 */
class SetPreviewGenerator
{
    /**
     * @param  string|null  $only  Regenerate a single set handle, or all when null.
     * @return array<string, string>  handle => "ok" | "unchanged" | "skipped: …" | "error: …"
     */
    public function generate(?string $only = null): array
    {
        $config = Sets::previewImageConfig();

        if (! $config) {
            return ['_' => 'error: statamic.assets.set_preview_images is not configured'];
        }

        $container = AssetContainer::find($config['container']);
        $filesystem = $container->disk()->filesystem();
        $folder = $config['folder'] ? rtrim($config['folder'], '/').'/' : '';

        $exclude = (array) config('statamic-visual-editor.previews.exclude', []);
        $overrides = (array) config('statamic-visual-editor.previews.overrides', []);
        $width = (int) config('statamic-visual-editor.previews.width', 1440);
        $delay = (int) config('statamic-visual-editor.previews.delay', 1500);

        $results = [];
        $changed = false;

        foreach ($this->targetSets() as $handle => $currentImage) {
            if ($only !== null && $handle !== $only) {
                continue;
            }

            if (in_array($handle, $exclude, true)) {
                $results[$handle] = 'excluded';

                continue;
            }

            [$url, $selector] = $this->resolve($handle, $overrides[$handle] ?? []);

            if (! $url || ! $selector) {
                $results[$handle] = 'skipped: not used on any page';

                continue;
            }

            $tmp = null;

            try {
                $tmp = tempnam(sys_get_temp_dir(), 'sve_').'.png';
                $this->screenshot($url, $selector, $width, $delay, $tmp);

                $hash = substr(md5_file($tmp), 0, 8);
                $base = $currentImage ? $this->baseName($currentImage) : $this->handleBase($handle);
                $newFilename = $base.'-'.$hash.'.png';

                if ($newFilename === $currentImage && $filesystem->exists($folder.$currentImage)) {
                    @unlink($tmp);
                    $results[$handle] = 'unchanged';

                    continue;
                }

                $filesystem->put($folder.$newFilename, file_get_contents($tmp));
                @unlink($tmp);

                $this->updateImage($handle, $newFilename);

                if ($currentImage && $currentImage !== $newFilename && $filesystem->exists($folder.$currentImage)) {
                    $filesystem->delete($folder.$currentImage);
                }

                $changed = true;
                $results[$handle] = 'ok';
            } catch (\Throwable $e) {
                if ($tmp) {
                    @unlink($tmp);
                }

                $results[$handle] = 'error: '.trim($e->getMessage());
            }
        }

        if ($changed) {
            SetPreviewImages::flush();
            Artisan::call('statamic:glide:clear');
        }

        return $results;
    }

    /**
     * The section types to generate previews for: the set handles of the
     * configured Replicator field, each with its current `image` filename (or
     * null when it has none yet).
     *
     * @return array<string, ?string>
     */
    protected function targetSets(): array
    {
        $field = config('statamic-visual-editor.previews.field', 'page_sections');
        $fieldset = Fieldset::find($field);

        if (! $fieldset) {
            return [];
        }

        $sets = [];
        $this->collectSets($fieldset->contents(), $sets);

        return $sets;
    }

    /** Collects a Replicator's grouped set handles => image filename. */
    protected function collectSets($node, array &$sets): void
    {
        if (! is_array($node)) {
            return;
        }

        if (isset($node['sets']) && is_array($node['sets'])) {
            foreach ($node['sets'] as $group) {
                foreach (($group['sets'] ?? []) as $handle => $set) {
                    if (is_array($set) && (isset($set['display']) || isset($set['fields']))) {
                        $sets[$handle] = $set['image'] ?? null;
                    }
                }
            }
        }

        foreach ($node as $value) {
            $this->collectSets($value, $sets);
        }
    }

    /**
     * Resolves a handle to [url, selector].
     *
     * We deliberately do NOT key off any markup in the section templates (no
     * `id="id-…"`, no data-attribute): the site's own HTML must stay untouched.
     * Instead we point the browser at a signed, short-lived route that re-renders
     * the real page with ONLY this section in it, and capture the first child of
     * <main>. An explicit config override still wins.
     */
    protected function resolve(string $handle, array $override): array
    {
        $selector = config('statamic-visual-editor.previews.selector', 'main > *');

        if (! empty($override['url'])) {
            $url = $override['url'];

            if (! preg_match('#^https?://#', $url)) {
                $url = url($url);
            }

            return [$url, $override['selector'] ?? $selector];
        }

        $instance = $this->findInstance($handle);

        if (! $instance) {
            return [null, null];
        }

        [$entryId, $sectionId] = $instance;

        $url = URL::temporarySignedRoute('sve.section-preview', now()->addMinutes(15), [
            'entry' => $entryId,
            'section' => $sectionId,
        ]);

        return [$url, $selector];
    }

    /**
     * Finds a real, enabled instance of the given section type on a published
     * entry of the configured collection (default site).
     *
     * @return array{0: string, 1: string}|null  [entry id, section id]
     */
    protected function findInstance(string $handle): ?array
    {
        $field = config('statamic-visual-editor.previews.field', 'page_sections');
        $collection = config('statamic-visual-editor.previews.collection', 'pages');
        $site = Site::default()->handle();

        $entries = Entry::query()
            ->where('collection', $collection)
            ->where('site', $site)
            ->where('published', true)
            ->get();

        foreach ($entries as $entry) {
            $sections = $entry->value($field);

            if (! is_array($sections)) {
                continue;
            }

            foreach ($sections as $section) {
                // Disabled sections don't render at all — keep looking.
                if (($section['enabled'] ?? true) === false) {
                    continue;
                }

                if (($section['type'] ?? null) === $handle) {
                    $id = $section['id'] ?? ($section['_id'] ?? null);

                    if ($id) {
                        return [$entry->id(), $id];
                    }
                }
            }
        }

        return null;
    }

    protected function screenshot(string $url, string $selector, int $width, int $delay, string $path): void
    {
        Browsershot::url($url)
            ->setNodeModulePath(base_path('node_modules/'))
            ->ignoreHttpsErrors()
            ->windowSize($width, (int) round($width * 0.7))
            ->deviceScaleFactor(2)
            ->waitUntilNetworkIdle()
            ->delay($delay) // let entrance animations finish before capturing
            ->select($selector)
            ->save($path);
    }

    /** Strips our `-<8hex>` cache-bust suffix (if any) and the extension. */
    protected function baseName(string $filename): string
    {
        $name = preg_replace('/-[0-9a-f]{8}(\.[a-z0-9]+)$/i', '$1', $filename);

        return pathinfo($name, PATHINFO_FILENAME);
    }

    /** A clean file base derived from a set handle, e.g. "hero/custom" → "hero-custom". */
    protected function handleBase(string $handle): string
    {
        return str_replace(['/', '_'], '-', $handle);
    }

    /** Updates the set's `image:` value in whichever fieldset defines it (preferring the previews field). */
    protected function updateImage(string $handle, string $newFilename): void
    {
        $field = config('statamic-visual-editor.previews.field', 'page_sections');
        $preferred = Fieldset::find($field);

        $fieldsets = Fieldset::all()->all();

        if ($preferred) {
            array_unshift($fieldsets, $preferred);
        }

        foreach ($fieldsets as $fieldset) {
            $contents = $fieldset->contents();

            if ($this->replaceImage($contents, $handle, $newFilename)) {
                $fieldset->setContents($contents)->saveQuietly();

                return;
            }
        }
    }

    /** Recursively finds the set (keyed by $handle) and sets its image. */
    protected function replaceImage(array &$node, string $handle, string $newFilename): bool
    {
        foreach ($node as $key => &$value) {
            if (! is_array($value)) {
                continue;
            }

            if ($key === $handle && (isset($value['fields']) || isset($value['display']))) {
                $value['image'] = $newFilename;

                return true;
            }

            if ($this->replaceImage($value, $handle, $newFilename)) {
                return true;
            }
        }

        return false;
    }
}
