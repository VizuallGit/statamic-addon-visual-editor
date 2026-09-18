<?php

namespace MarioHamann\StatamicVisualEditor\Boot;

use MarioHamann\StatamicVisualEditor\AiChat;
use MarioHamann\StatamicVisualEditor\AiCopy;
use MarioHamann\StatamicVisualEditor\CollectionPresets;
use MarioHamann\StatamicVisualEditor\RowLimits;
use MarioHamann\StatamicVisualEditor\SetMeta;
use MarioHamann\StatamicVisualEditor\SetPreviewImages;
use MarioHamann\StatamicVisualEditor\Stores;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Str;
use MarioHamann\StatamicVisualEditor\Breakpoints;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\SectionTypes;
use MarioHamann\StatamicVisualEditor\BuiltAssets;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\GlobalSet;
use Statamic\Facades\Site;
use Statamic\Facades\User;
use Statamic\Statamic;

/**
 * What the Control Panel's script gets told about this site and this user:
 * the `sve*` values `Statamic::provideToScript` hands to addon.js.
 *
 * Moved out of ServiceProvider::bootAddon() verbatim in WP7a. Bound to the CP
 * scripts partial so it only runs on Control Panel page renders, after routing.
 */
final class ControlPanelScript
{
    public static function register(): void
    {
        // Provide the set preview-image map to the CP script. Bound to the CP
        // scripts partial so it only runs on Control Panel page renders (not the
        // front-end), and after routing so the blueprints are resolvable.
        View::composer('statamic::partials.scripts', function () {
            $setMeta = SetMeta::all();

            Statamic::provideToScript([
                'svePreviewImages' => SetPreviewImages::map(),
                'sveGlobalSets' => static::globalSets(),
                'sveGlobalsPicker' => Features::setting('globals_picker'),
                'sveGlobalsPickerOff' => Features::globalsPickerOffByDefault(),
                'sveRowLimits' => RowLimits::map(),
                'sveSectionTypes' => SectionTypes::map(),
                // What each set calls itself — the name, icon and instructions the
                // focus panel puts at the top. Set config never reaches the
                // rendered form, so it travels with the rest of the settings.
                'sveSetMeta' => $setMeta['sets'],
                'sveGridMeta' => $setMeta['grids'],
                // Handles the client must not assume: everything it builds (field
                // paths, the global-section row, the CP link to a source entry)
                // comes from config, so the addon works on any site as installed.
                'sveSectionField' => config('statamic-visual-editor.previews.field', 'page_sections'),
                'sveSavedSectionsCollection' => config('statamic-visual-editor.saved_sections.collection', 'saved_sections'),
                'sveGlobalSectionSet' => config('statamic-visual-editor.saved_sections.set', 'global_section'),
                // Id → { title, section_type } for global rows in the block tree,
                // so a referenced section can name itself by what it actually is
                // rather than by the "Global section" set.
                'sveSavedSectionLabels' => static::savedSectionLabels(),
                'sveChrome' => config('statamic-visual-editor.chrome', []),
                'sveUserId' => User::current()?->id(),
                'sveChromePrefs' => is_array($chrome = User::current()?->getPreference('sve_chrome')) ? $chrome : [],
                'sveHiddenGlobalsTabs' => static::hiddenGlobalsTabs(),
                // Whether the editor runs here at all, and which of its tools this
                // site gets (Addons > Statamic Visual Editor).
                'sveEnabled' => Features::editorEnabled(),
                'sveFeatures' => Features::visible(),
                'sveAiReady' => AiChat::ready(),
                'sveAiTextReady' => AiCopy::ready(),
                'sveComments' => static::commentsPayload(),
                // Every on-screen string, in the CP user's own language.
                'sveStrings' => static::strings(),
                'sveCollections' => static::pickerCollections(),
                'sveSectionTag' => (string) config('statamic-visual-editor.templates.section_tag', ''),
                // The collections whose entries open in the preview rather than
                // the publish form (Addons > Statamic Visual Editor).
                'sveOpenInPreview' => static::openInPreviewCollections(),
                'sveCollectionTemplatesCollection' => Stores::collectionTemplates(),
                'sveCollectionPresets' => CollectionPresets::all(),
                // The one breakpoint list: Live Preview's device buttons, the
                // responsive field, the Tailwind row and the CSS panel all
                // read this and can never disagree about where a size ends.
                'sveBreakpoints' => Breakpoints::forScript(),
                // Hashed Tailwind compiler chunk — dock-instant-preview imports it
                // so a new class can paint before the section morph comes back.
                'sveTwCompile' => static::twCompileUrl(),
            ]);
        });
    }

    /**
     * The global sets this user may edit — the Live Preview picker lists these.
     *
     * The URL is the *variables* screen (globals.variables.edit), not the set's
     * own edit screen: the latter configures the blueprint and sites, while the
     * panel needs the form with the actual values in it.
     */
    /**
     * The editor's strings, in the language the Control Panel user picked.
     *
     * Deliberately the *user's* locale, not the app's: the preview renders as a
     * front-end request, where the locale is the site's — so a Danish-speaking
     * editor on an English site (or the other way round) would get the wrong half
     * of the interface. English is the base; a language only overrides what it
     * actually translates.
     */
    public static function strings(): array
    {
        $locale = User::current()?->preferredLocale() ?? config('app.locale');

        return array_merge(
            (array) trans('sve::messages', [], 'en'),
            (array) trans('sve::messages', [], $locale),
        );
    }

    /**
     * The collections offered in the preview's collection picker.
     *
     * All of them, not only the previewable ones: jumping straight to "new blog
     * post" is worth having even where there's no page to show. `previewable`
     * says which can actually open in Live Preview — that needs a route, and an
     * entry without one has no page to render. The flag is computed, not
     * configured, so a collection starts previewing itself the day it's given a
     * route. Permission-filtered: the picker offers what you may edit.
     */
    protected static function pickerCollections(): array
    {
        if (! $user = User::current()) {
            return [];
        }

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        return Collection::all()
            ->filter(fn ($collection) => $user->can('edit', $collection))
            // The editor's own stores are not somewhere you navigate to. They hold
            // fragments — a section, a stack of sections — and neither can ever be
            // previewed as a page, so they would only ever sit in this list greyed
            // out as "no preview". You reach them from the sections panel, which is
            // where they mean something.
            ->reject(fn ($collection) => in_array($collection->handle(), Stores::all(), true))
            ->map(fn ($collection) => [
                'handle' => $collection->handle(),
                'title' => $collection->title(),
                'previewable' => (bool) $collection->route($site),
                'createUrl' => $collection->createEntryUrl($site),
            ])
            ->sortBy('title', SORT_NATURAL | SORT_FLAG_CASE)
            ->values()
            ->all();
    }

    /**
     * The collections a click lands in the preview rather than the form.
     *
     * Filtered down to the ones that can actually be previewed. A collection
     * without a route has no page to render, so Statamic draws no Live Preview
     * button — an entry there would sit behind the cover waiting for something
     * that is never coming. Named or not, those open the ordinary editor.
     *
     * @return array<int, string>
     */
    protected static function openInPreviewCollections(): array
    {
        if (! Features::enabled('open_in_preview')) {
            return [];
        }

        $chosen = Features::setting('open_in_preview_collections', []);

        if (! is_array($chosen) || $chosen === []) {
            return [];
        }

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        return collect($chosen)
            ->filter(fn ($handle) => (bool) Collection::findByHandle($handle)?->route($site))
            ->values()
            ->all();
    }

    protected static function globalSets(): array
    {
        if (! $user = User::current()) {
            return [];
        }

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        return GlobalSet::all()
            ->filter(fn ($set) => $user->can('edit', $set))
            ->map(function ($set) use ($site) {
                $variables = $set->in($site) ?? $set->in(Site::default()->handle());

                return $variables ? [
                    'handle' => $set->handle(),
                    'title' => $set->title(),
                    'url' => $variables->editUrl(),
                ] : null;
            })
            ->filter()
            ->values()
            ->all();
    }

    /**
     * What each saved (global) section calls itself, keyed by entry id.
     *
     * A page holds only a reference. The block tree names the row by the source's
     * section type ("Hero style 5") rather than by the reference set ("Global
     * section"), and this map is how it looks that up without a round-trip.
     *
     * @return array<string, array{title: string, section_type: string}>
     */
    protected static function savedSectionLabels(): array
    {
        $handle = config('statamic-visual-editor.saved_sections.collection', 'saved_sections');

        if (! Collection::findByHandle($handle)) {
            return [];
        }

        $site = Site::selected()?->handle() ?? Site::default()->handle();

        try {
            return Entry::query()
                ->where('collection', $handle)
                ->where('site', $site)
                ->get()
                ->mapWithKeys(fn ($entry) => [
                    $entry->id() => [
                        'title' => (string) ($entry->value('title') ?? ''),
                        'section_type' => (string) ($entry->value('section_type') ?? ''),
                    ],
                ])
                ->all();
        } catch (\Throwable) {
            return [];
        }
    }

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
    protected static function hiddenGlobalsTabs(): array
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
     * Who is commenting from this Control Panel session.
     *
     * Gated by the comments toggle and toolbar access. Everyone else gets an
     * empty payload so the comments script never paints a mode it cannot save.
     */
    protected static function commentsPayload(): array
    {
        $user = User::current();

        if (! $user || ! Features::editorEnabled() || ! Features::allows('comments')) {
            return ['enabled' => false];
        }

        $name = trim((string) ($user->name() ?: $user->email() ?: 'User'));

        return [
            'enabled' => true,
            'user' => [
                'id' => $user->id(),
                'name' => $name,
                'initials' => $user->initials() ?: strtoupper(mb_substr($name, 0, 1)),
            ],
        ];
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
    protected static function chromeGlobalHandles(): array
    {
        $shared = config('statamic-visual-editor.chrome.global');

        $handles = collect(['header', 'footer'])
            ->map(fn ($half) => config("statamic-visual-editor.chrome.{$half}.global") ?: $shared)
            ->filter()
            ->all();

        return array_values(array_unique($handles ?: [$shared ?: 'theme_settings']));
    }

    /**
     * URL of the existing hashed Tailwind compiler. Empty when the dist has
     * no tw-compile chunk — the instant paint still swaps classes that are
     * already in the stylesheet.
     */
    protected static function twCompileUrl(): string
    {
        try {
            return BuiltAssets::url('resources/js/tw-compile.js');
        } catch (\Throwable $e) {
            return '';
        }
    }
}
