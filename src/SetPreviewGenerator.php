<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\SetPreview\FieldsetImage;
use MarioHamann\StatamicVisualEditor\SetPreview\Targets;
use Statamic\Facades\AssetContainer;
use Statamic\Fieldtypes\Sets;

/**
 * Keeps the "Preview Image" of every page-builder section type a true picture of
 * that section, by screenshotting it in a real headless browser on the real site.
 *
 * Each type is drawn with its DEFAULT values — the section the Add Set picker
 * inserts when you click it — so the picker never promises something other than
 * what you get. A type whose defaults are all empty would photograph as a blank
 * strip; for those, and only those, a real instance on the site is borrowed
 * instead, so nothing ends up with no preview at all.
 *
 * The images live in the container/folder configured by
 * `statamic.assets.set_preview_images`, so Statamic's native picker shows them,
 * and the set's `image:` in the fieldset YAML is updated to match.
 *
 * Filenames carry a fingerprint (`hero-style-1-<hash>.png`) of everything the
 * picture depends on: the section's own partial and defaults, the CSS/JS,
 * the layout, the theme settings. That is what makes this cheap enough to run on
 * every save — a run where nothing changed compares strings and starts no browser
 * — and it doubles as cache busting, since a new hash is a new URL that no
 * browser has cached.
 *
 * This class runs the browser and writes the files; what to shoot comes
 * from `SetPreview\Targets`, and the fieldset's `image:` is updated by
 * `SetPreview\FieldsetImage`. Split in WP7d, code moved verbatim.
 */
class SetPreviewGenerator
{
    /** A generated filename, as opposed to one somebody uploaded by hand. */
    protected const GENERATED = '/-[0-9a-f]{8}\.[a-z0-9]+$/i';

    /**
     * Brings every section type's preview up to date.
     *
     * @param  string|null  $only  A single set handle, or all of them when null.
     * @param  bool  $force  Re-shoot even the ones whose fingerprint still matches.
     * @return array<string, string>  handle => "ok" | "fresh" | "excluded" | "skipped: …" | "error: …"
     */
    public function generate(?string $only = null, bool $force = false): array
    {
        $config = Sets::previewImageConfig();

        if (! $config) {
            return ['_' => 'error: statamic.assets.set_preview_images is not configured'];
        }

        if (! $container = AssetContainer::find($config['container'])) {
            return ['_' => 'error: asset container "'.$config['container'].'" does not exist'];
        }

        $filesystem = $container->disk()->filesystem();
        $folder = $config['folder'] ? rtrim($config['folder'], '/').'/' : '';

        $results = [];
        $changed = false;

        foreach (Targets::targets($only) as $handle => $target) {
            if ($target['status'] === 'excluded') {
                $results[$handle] = 'excluded';

                continue;
            }

            if ($target['status'] === 'no_source') {
                $results[$handle] = 'skipped: no default values and not used anywhere';

                continue;
            }

            if ($target['status'] === 'fresh' && ! $force) {
                $results[$handle] = 'fresh';

                continue;
            }

            // Already tried, at this exact fingerprint, and it drew nothing. Only
            // an explicit --force spends a browser asking again.
            if ($target['status'] === 'renders_nothing' && ! $force) {
                $results[$handle] = 'skipped: renders nothing to photograph';

                continue;
            }

            // Same idea for a browser that errored at this fingerprint. --force
            // is how you retry once the machine is fixed.
            if ($target['status'] === 'failed' && ! $force) {
                $results[$handle] = 'skipped: last attempt failed (--force to retry)';

                continue;
            }

            $results[$handle] = $this->shoot($handle, $target, $filesystem, $folder, $changed);
        }

        if ($changed) {
            SetPreviewImages::flush();
            Artisan::call('statamic:glide:clear');
            GitSync::after('set previews');
        }

        return $results;
    }

    /**
     * Photographs the first of a target's subjects that actually draws something.
     *
     * A section type is drawn from its defaults where it can be, and that is the
     * subject tried first. But a template guarded on content it has no default for
     * ({{ if columns }}) renders nothing at all, and a picture of nothing is worse
     * than a picture of somebody's real column section — so a real instance on the
     * site is the next subject, and only when neither draws anything does the type
     * go without.
     */
    protected function shoot(string $handle, array $target, $filesystem, string $folder, bool &$changed): string
    {
        $empty = 0;

        foreach ($target['candidates'] as $candidate) {
            $tmp = tempnam(sys_get_temp_dir(), 'sve_').'.png';

            try {
                PreviewBrowser::shoot($candidate['url'], $candidate['selector'], $tmp);

                $filesystem->put($folder.$target['filename'], file_get_contents($tmp));
                @unlink($tmp);

                FieldsetImage::updateImage($handle, $target['filename']);
                $this->deleteSuperseded($folder, $target);

                $changed = true;

                return 'ok';
            } catch (EmptyRenderException $e) {
                @unlink($tmp);
                $empty++;

                continue;
            } catch (\Throwable $e) {
                @unlink($tmp);

                // Remembered like the empty-render memo, but briefly: a browser
                // that failed is usually a browser that will fail again at this
                // fingerprint, and without this every refresh spends one finding
                // out. An hour, not thirty days, because the cause is as likely
                // to be the machine as the section.
                Cache::put(Targets::failedKey($handle), $target['filename'], now()->addHour());

                return 'error: '.trim($e->getMessage());
            }
        }

        if ($empty) {
            // Remembered against the fingerprint, so the next run doesn't start a
            // browser to be told the same thing. A refresh happens after every
            // save; four sections that draw nothing would otherwise cost a browser
            // each, every time, forever. The memo dies the moment anything the
            // fingerprint covers changes — which is exactly when it might draw
            // something after all.
            Cache::put(Targets::emptyKey($handle), $target['filename'], now()->addDays(30));

            return 'skipped: renders nothing to photograph (its template draws nothing without content)';
        }

        return 'skipped: nothing to photograph';
    }

    /**
     * Removes the image this one replaces — but only when we made it.
     *
     * A hand-uploaded preview is left on disk: somebody chose that file, and the
     * generator taking over the set's `image:` is no reason to delete it from the
     * asset container, where it may well be in use somewhere else.
     */
    protected function deleteSuperseded(string $folder, array $target): void
    {
        $current = $target['current'];

        if (! $current || $current === $target['filename']) {
            return;
        }

        if (! preg_match(static::GENERATED, $current)) {
            return;
        }

        $config = Sets::previewImageConfig();

        if ($container = AssetContainer::find($config['container'])) {
            PreviewFile::forget($container, $folder.$current);
        }
    }

    /**
     * What each section type needs, without touching a browser.
     *
     * @see Targets::targets()
     */
    public function targets(?string $only = null): array
    {
        return Targets::targets($only);
    }
}
