<?php

namespace MarioHamann\StatamicVisualEditor\Boot;

use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\CollectionViewFile;
use MarioHamann\StatamicVisualEditor\SectionTemplate;
use MarioHamann\StatamicVisualEditor\SectionTemplate\Paths;
use Statamic\Facades\GlobalSet;
use Statamic\Facades\Site;
use Statamic\Statamic;

/**
 * The header/footer globals and the Theme Settings tabs the docked panel leaves
 * out, resolved for the Control Panel's script. Split out of
 * Boot\ControlPanelScript in WP7c, verbatim.
 */
final class ScriptChrome
{
    /**
     * Tabs the docked Theme Settings panel leaves out, as the labels they carry
     * on screen.
     *
     * Configured by handle, resolved here to labels: the panel has only the
     * rendered publish form to work with — the tab buttons in it carry their
     * display text and nothing that names the blueprint tab — so the matching
     * has to happen on the label. Doing the lookup server-side is what keeps the
     * config honest (a handle, stable) and the match right in every language (a
     * label, as the blueprint actually spells it).
     *
     * @return array<string, array<int, string>>  global set handle => lowercased labels
     */
    public static function hiddenGlobalsTabs(): array
    {
        $hidden = (array) config('statamic-visual-editor.chrome.hidden_tabs', []);

        if (! $hidden) {
            return [];
        }

        $map = [];

        // One set or one per half — the tabs to leave out are named the same way
        // either way, so every set that carries a half gets the same treatment.
        foreach (static::chromeGlobalHandles() as $handle) {
            if (! $set = GlobalSet::findByHandle($handle)) {
                continue;
            }

            $tabs = $set->blueprint()?->contents()['tabs'] ?? [];
            $labels = [];

            foreach ($hidden as $tab) {
                if (! isset($tabs[$tab])) {
                    continue; // renamed or removed since it was configured
                }

                // No `display` means Statamic titleises the handle for the tab button.
                $labels[] = Str::lower($tabs[$tab]['display'] ?? Str::title(str_replace('_', ' ', $tab)));
            }

            if ($labels) {
                $map[$handle] = $labels;
            }
        }

        return $map;
    }

    /**
     * The layout each half of the site frame uses right now — `header_style`
     * on the header's global, `footer_style` on the footer's — so the dock can
     * open the header's template on a page that has no sections and nothing
     * picked. Without a value the half is on its first style, as the chrome
     * editor also assumes.
     *
     * @return array{header: string, footer: string}
     */
    public static function styles(): array
    {
        $shared = config('statamic-visual-editor.chrome.global');
        $site = Site::current()->handle();
        $styles = [];

        foreach (['header', 'footer'] as $half) {
            $handle = config("statamic-visual-editor.chrome.{$half}.global") ?: $shared;
            $set = $handle ? GlobalSet::findByHandle($handle) : null;
            $variables = $set ? ($set->in($site) ?? $set->inDefaultSite()) : null;
            $style = $variables?->get("{$half}_style");

            $styles[$half] = is_string($style) && $style !== '' ? $style : 'style_1';
        }

        return $styles;
    }

    /**
     * The dock's file for each half of the site frame, and whether the form's
     * layout choice (`{half}_style`) decides it.
     *
     * The preview finds a half by `data-sve-chrome="header"` on its root, so
     * the partial that carries that attribute is the half's file: a header in
     * `partials/site_head.antlers.html` is `view:partials/site_head`, a footer
     * in `partials/footer/widgets.antlers.html` is `footer/widgets`. Used to be
     * `{half}/{style}` for every site — on one that does not include its
     * header through a style partial, the dock wrote to a file nothing
     * renders: every keystroke saved, and the preview never changed.
     *
     * The styled partial stays the file when it carries the marker itself or
     * a wrapper picks it through `{half}_style`; the dock then follows the
     * layout the form chooses (`styled`). No marker anywhere keeps that rule too.
     *
     * @return array<string, array{type: string, styled: bool}>
     */
    public static function templates(): array
    {
        $styles = static::styles();
        $out = [];

        foreach (['header', 'footer'] as $half) {
            $styled = $half.'/'.$styles[$half];
            $styledPath = SectionTemplate::path($styled);
            $markers = static::markerFiles($half);

            if ($markers === []) {
                $out[$half] = ['type' => $styled, 'styled' => true];

                continue;
            }

            if ($styledPath !== null && in_array($styledPath, $markers, true)) {
                $out[$half] = ['type' => $styled, 'styled' => true];

                continue;
            }

            foreach ($markers as $marker) {
                if ($styledPath !== null && str_contains((string) file_get_contents($marker), $half.'_style')) {
                    $out[$half] = ['type' => $styled, 'styled' => true];

                    continue 2;
                }
            }

            $out[$half] = ['type' => static::handleFor($markers[0]) ?? $styled, 'styled' => false];
        }

        return $out;
    }

    /** Forget the scanned views — a test writes its own between calls. */
    public static function flush(): void
    {
        static::$markers = [];
    }

    /** @var array<string, array<int, string>> */
    private static array $markers = [];

    /**
     * Every Antlers view carrying `data-sve-chrome="{half}"`, real paths,
     * shallowest first. Scanned once per request.
     *
     * @return array<int, string>
     */
    protected static function markerFiles(string $half): array
    {
        if (isset(static::$markers[$half])) {
            return static::$markers[$half];
        }

        $root = realpath(resource_path('views'));
        $found = [];

        if (is_string($root)) {
            $files = new \RecursiveIteratorIterator(
                new \RecursiveCallbackFilterIterator(
                    new \RecursiveDirectoryIterator($root, \FilesystemIterator::SKIP_DOTS),
                    // Published vendor views never carry the marker; skip the folder.
                    fn (\SplFileInfo $file) => ! ($file->isDir() && $file->getFilename() === 'vendor')
                )
            );

            foreach ($files as $file) {
                if (! $file->isFile() || ! str_ends_with($file->getFilename(), '.antlers.html')) {
                    continue;
                }

                $source = (string) file_get_contents($file->getPathname());

                if (preg_match('/data-sve-chrome\s*=\s*["\']'.$half.'["\']/', $source)) {
                    $found[] = $file->getPathname();
                }
            }
        }

        usort($found, fn ($a, $b) => [substr_count($a, DIRECTORY_SEPARATOR), $a] <=> [substr_count($b, DIRECTORY_SEPARATOR), $b]);

        return static::$markers[$half] = $found;
    }

    /**
     * The dock handle for a view: a section or chrome partial by its own
     * handle, any other view as `view:{path}`.
     */
    protected static function handleFor(string $absolute): ?string
    {
        if ($handle = Paths::handleFromAbsolute($absolute)) {
            return $handle;
        }

        $root = realpath(resource_path('views'));

        if (! is_string($root) || ! str_starts_with($absolute, $root.DIRECTORY_SEPARATOR)) {
            return null;
        }

        return CollectionViewFile::type(substr($absolute, strlen($root) + 1));
    }

    /**
     * Every global set holding a half of the site frame, deduplicated.
     *
     * `chrome.global` names one set for both; `chrome.header.global` and
     * `chrome.footer.global` name one each. Configuring both is allowed and
     * answers with the two specific ones — the shared key is then the fallback
     * for a half that names none.
     *
     * @return array<int, string>
     */
    public static function chromeGlobalHandles(): array
    {
        $shared = config('statamic-visual-editor.chrome.global');

        $handles = collect(['header', 'footer'])
            ->map(fn ($half) => config("statamic-visual-editor.chrome.{$half}.global") ?: $shared)
            ->filter()
            ->all();

        return array_values(array_unique($handles ?: [$shared ?: 'theme_settings']));
    }
}
