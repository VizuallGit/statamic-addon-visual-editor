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
use MarioHamann\StatamicVisualEditor\Breakpoints;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\SectionTypes;
use MarioHamann\StatamicVisualEditor\BuiltAssets;
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
                'sveGlobalSets' => ScriptCollections::globalSets(),
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
                'sveSavedSectionLabels' => ScriptCollections::savedSectionLabels(),
                'sveChrome' => config('statamic-visual-editor.chrome', []),
                'sveUserId' => User::current()?->id(),
                'sveChromePrefs' => is_array($chrome = User::current()?->getPreference('sve_chrome')) ? $chrome : [],
                'sveHiddenGlobalsTabs' => ScriptChrome::hiddenGlobalsTabs(),
                // Whether the editor runs here at all, and which of its tools this
                // site gets (Addons > Statamic Visual Editor).
                'sveEnabled' => Features::editorEnabled(),
                'sveFeatures' => Features::visible(),
                'sveAiReady' => AiChat::ready(),
                'sveAiTextReady' => AiCopy::ready(),
                'sveComments' => static::commentsPayload(),
                // Every on-screen string, in the CP user's own language.
                'sveStrings' => static::strings(),
                'sveCollections' => ScriptCollections::pickerCollections(),
                'sveSectionTag' => (string) config('statamic-visual-editor.templates.section_tag', ''),
                // The collections whose entries open in the preview rather than
                // the publish form (Addons > Statamic Visual Editor).
                'sveOpenInPreview' => ScriptCollections::openInPreviewCollections(),
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
