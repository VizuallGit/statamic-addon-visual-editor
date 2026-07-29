<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Enable Visual Editor
    |--------------------------------------------------------------------------
    |
    | When set to false, the bridge script will never be injected into Live
    | Preview responses and all `visual_edit` tags/helpers become no-ops.
    |
    */
    'enabled' => true,

    /*
    |--------------------------------------------------------------------------
    | Front-end edit button
    |--------------------------------------------------------------------------
    |
    | Shows a small "Rediger" button on the front end for signed-in users who
    | may edit the page they're looking at. Clicking it opens that entry in Live
    | Preview. Injected per-request outside Statamic's static cache, so it never
    | ends up in the cache and anonymous visitors never see it.
    |
    */
    'edit_button' => true,

    /*
    |--------------------------------------------------------------------------
    | Features
    |--------------------------------------------------------------------------
    |
    | Which parts of the editor a site gets. Not every site needs every tool —
    | one without reusable sections has no use for the Global tab, and a site
    | whose header is fixed shouldn't invite anyone to click into it.
    |
    | These are the defaults. Addons > Statamic Visual Editor overrides them per
    | site, and only the toggles actually saved there override — so a value set
    | here still applies to everything left untouched, which is what makes this
    | file worth deploying with.
    |
    | - panel:             the page-settings panel (Hide/Auto/Show + its tabs)
    | - pages:             the collection/entry picker, for moving between pages
    | - globals:           the globals picker (Theme Settings and friends)
    | - sections:          the section library panel as a whole
    | - library_page:      its "Page" tab — the site's own section types
    | - library_custom:    its "Custom" tab — saved sections, inserted as copies
    | - library_global:    its "Global" tab — synced sections
    | - library_templates: its "Templates" tab — whole pages saved to reuse
    | - chrome_header:     clicking the header steps into editing it
    | - chrome_footer:     the same for the footer
    | - inline_edit:       typing straight into the page. Off, the `inline_edit`
    |                      flag on the visual_edit tags stops taking effect and a
    |                      click focuses the field in the panel instead — so a
    |                      site can turn this off without touching its templates.
    |
    */
    'features' => [
        'panel' => true,
        'pages' => true,
        'globals' => true,
        'sections' => true,
        'inline_edit' => true,
        'library_page' => true,
        'library_custom' => true,
        'library_global' => true,
        'library_templates' => true,
        'chrome_header' => true,
        'chrome_footer' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Section preview images
    |--------------------------------------------------------------------------
    |
    | Configures the "Section Previews" utility, which regenerates the Add Set
    | picker preview images by screenshotting a real rendered instance of each
    | section type on the site.
    |
    | - field:      the Replicator field (fieldset handle) whose set types get
    |               previews (e.g. your page-builder field).
    | - collection: the collection whose entries are scanned for a real instance
    |               of each section type.
    | - exclude:    set handles to skip (e.g. a column builder or reusable
    |               sections that don't make sense as a single screenshot).
    | - overrides:  per-handle ['url' => …, 'selector' => …] to override the
    |               auto-discovered instance (url + '#id-<uid>').
    | - width/delay: browser window width (px) and the ms to wait for entrance
    |               animations before capturing.
    |
    */
    'previews' => [
        'field' => 'page_sections',
        'collection' => 'pages',
        'exclude' => ['columns', 'reusable_sections'],
        // What to capture on the isolated section-preview page. The signed
        // preview route renders the real page with only one section inside
        // <main>, so its first child IS the section — no id or data-attribute
        // has to be added to your templates, and nothing leaks into the public
        // frontend.
        'selector' => 'main > *',

        'overrides' => [
            // 'menukort' => ['url' => '/menu', 'selector' => '.something'],
        ],
        'width' => 1440,
        'delay' => 1500,
    ],

    /*
    |--------------------------------------------------------------------------
    | Saved sections ("Global sections")
    |--------------------------------------------------------------------------
    |
    | Where reusable sections live, and how a page points at a synced one.
    |
    | - collection: the collection holding saved sections. It needs a blueprint
    |               with title, synced, section_type, preview_image and an
    |               imported page-builder field. Give it NO route (that would
    |               make each section a public, crawlable URL) — set
    |               `entry_class: …\SavedSectionEntry` and a `preview_targets`
    |               entry pointing at /!/sve/global-section-preview/{id} instead.
    | - set:        the Replicator set a page uses to reference a synced ("global")
    |               saved section. The set's entries field must use the same
    |               handle, and its partial renders the source's sections.
    |
    */
    'saved_sections' => [
        'collection' => 'saved_sections',
        'set' => 'global_section',
    ],

    /*
    |--------------------------------------------------------------------------
    | Page templates
    |--------------------------------------------------------------------------
    |
    | Where whole-page section stacks live. Saving a page as a template copies
    | every section on it into one entry here; dropping that template onto
    | another page copies them back out.
    |
    | - collection: the collection holding templates. It needs a blueprint with
    |               title, preview_image and an imported page-builder field, and
    |               NO route — a template is a stack of sections, never a page,
    |               and a route would give it a public URL.
    |
    | Its own collection rather than a flag on the saved sections store: the two
    | are separate lists with their own place in the Control Panel nav, and they
    | behave differently — a saved section can be *synced*, which is what the
    | global-section feature hangs off, while a template is always copied.
    |
    */
    'templates' => [
        'collection' => 'saved_templates',
    ],

    /*
    |--------------------------------------------------------------------------
    | Site chrome (header / footer)
    |--------------------------------------------------------------------------
    |
    | Live Preview treats header & footer like "step into" components (same feel
    | as global sections). Designs open in a left-docked panel (same side as
    | Theme Settings); content still lives in a global set so it can also be
    | edited from Theme Settings without Live Preview.
    |
    | - global: the global set handle (default: theme_settings)
    | - *.styles: selectable layouts (handle matches Antlers partial name)
    |
    */
    'chrome' => [
        'global' => 'theme_settings',
        'header' => [
            'styles' => [
                ['handle' => 'style_1', 'label' => 'Classic — logo · nav · CTA'],
                ['handle' => 'style_2', 'label' => 'Centered — logo over nav'],
            ],
        ],
        'footer' => [
            'styles' => [
                ['handle' => 'style_1', 'label' => 'Row — widgets in one band'],
                ['handle' => 'style_2', 'label' => 'Centered — stacked'],
                ['handle' => 'style_3', 'label' => 'Columns — brand · nav · form'],
            ],
        ],
    ],

];
