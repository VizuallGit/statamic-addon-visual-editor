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
    | - page_activity:     an icon in the Live Preview top bar that opens this
    |                      page's revision list (Statamic revisions). On by default.
    | - pages:             the collection/entry picker, for moving between pages
    | - globals:           the globals picker (Theme Settings and friends)
    | - globals_picker:    which global sets that menu lists, by handle. Null
    |                      (the default) shows everything except header/footer —
    |                      those are opened by clicking them on the page. An
    |                      empty array shows none. Addons > Visual Editor is
    |                      the usual place to change this per site.
    | - sections:          the section library panel as a whole
    | - listview:          the block tree in the right dock. On by default.
    | - outline:           the heading outline in the right dock — the page's
    |                      headings as one list, each one a jump to it. Own
    |                      toolbar icon, independent of the block tree.
    | - html_tree:         the HTML tags in the template dock, as a tree in the
    |                      right sidebar. Own toolbar icon, independent of the
    |                      block tree. Click a tag to jump to it in the HTML pane.
    | - library_page:      its "Page" tab — the site's own section types
    | - library_custom:    its "Custom" tab — saved sections, inserted as copies
    | - library_global:    its "Global" tab — synced sections
    | - library_templates: its "Compositions" tab — whole pages saved to reuse
    | - library_in_use_only: narrows all four tabs to what the site already uses.
    |                      The list comes from a scan you run yourself (Addons >
    |                      Statamic Visual Editor), so it never widens on its own.
    |                      No scan yet means no limit, and who it covers is set
    |                      beside it — see LibraryAccess.
    | - chrome_header:     clicking the header steps into editing it
    | - chrome_footer:     the same for the footer
    | - inline_edit:       typing straight into the page. Off, the `inline_edit`
    |                      flag on the visual_edit tags stops taking effect and a
    |                      click focuses the field in the panel instead — so a
    |                      site can turn this off without touching its templates.
    | - focus_panel:       the simplified editor panel. On, clicking a section (or
    |                      a block inside one) shows that one thing, named at the
    |                      top with its icon and instructions, and nothing else.
    |                      Off, the panel stays the section list Statamic renders.
    | - open_first_section: parked — code remains, always off. Page Settings is
    |                      the empty-panel default; Focus panel already shows
    |                      one section at a time. Needs focus_panel if re-enabled.
    | - open_in_preview:    clicking an entry opens the preview instead of the
    |                      publish form. Which collections that covers is listed
    |                      beside it; a collection without a route is skipped,
    |                      since it has no page to render.
    | - template_dock:     clicking a section opens a bottom panel with that
    |                      section's Antlers file (HTML / CSS / JS). Saving
    |                      writes the file on this server. Off by default.
    |                      Who sees the icon sits under the toggle — super admins
    |                      unless you name specific people.
    | - site_css:          an icon that opens this site's stylesheets
    |                      (`resources/css`). Saving writes those files. Off by
    |                      default. Who sees the icon sits under the toggle —
    |                      super admins unless you name specific people.
    | - collection_templates: Scaffold Views (Index / Show) also creates CP
    |                      rows you open in Live Preview. Off by default — a
    |                      site that only needs the page builder can leave it
    |                      off, and the Templates nav item stays away.
    | - tailwind_dock:     HTML-pane Tailwind suggestions plus compile into
    |                      resources/visual-editor/tw when the dock saves. Needs
    |                      template_dock. Off by default — the dock then writes
    |                      the file as today. Does not change the site stylesheet.
    | - ai_panel:          a chat that runs a local Cursor agent — in Live
    |                      Preview, and on its own page under Utilities. Off by
    |                      default. Who gets it sits under the toggle.
    | - file_manager:      a Utilities page that browses and edits this site's
    |                      own code files under `resources` (views, css, js,
    |                      lang), with new file / new folder / delete. Saving
    |                      writes on this server. `app/`, `routes/`, `config/`,
    |                      `.env` and `vendor/` are never reachable. Off by
    |                      default, super admins unless you name people.
    | - comments:          Figma-style pins in Live Preview. Threads live in
    |                      storage/statamic-visual-editor/comments. On by default.
    |                      Who sees the icon sits under the toggle.
    | - *_access:          who sees that toolbar icon (except Page settings).
    |                      Nested under the matching toggle: everyone, super
    |                      admins, or named users/groups. template_dock_access
    |                      and site_css_access default to super; the rest to
    |                      everyone.
    |                      toolbar_access is the old all-in-one blob and is still
    |                      read if a per-tool key is missing.
    |
    */
    'features' => [
        'panel' => true,
        'page_activity' => true,
        'pages' => true,
        'globals' => true,
        // Not a toggle: handles shown in the globe menu. Null = all except
        // header/footer. [] = none.
        'globals_picker' => null,
        'sections' => true,
        'listview' => true,
        'outline' => true,
        'html_tree' => true,
        'inline_edit' => true,
        'focus_panel' => true,
        'open_first_section' => false,
        'open_in_preview' => false,
        'template_dock' => false,
        'site_css' => false,
        'file_manager' => false,
        'collection_templates' => false,
        'tailwind_dock' => false,
        'ai_panel' => false,
        'comments' => true,
        // Nested under each toolbar toggle. Null = defaults
        // (template_dock, site_css and file_manager = super, the rest everyone).
        'pages_access' => null,
        'globals_access' => null,
        'sections_access' => null,
        'listview_access' => null,
        'outline_access' => null,
        'html_tree_access' => null,
        'template_dock_access' => null,
        'site_css_access' => null,
        'file_manager_access' => null,
        'ai_panel_access' => null,
        'comments_access' => null,
        // Legacy all-in-one blob from the old settings screen. Still read
        // when a per-tool *_access key is missing.
        'toolbar_access' => null,
        // Not a toggle: the collections the line above covers, by handle. Empty
        // means the switch has nothing to act on, so nothing changes.
        'open_in_preview_collections' => [],
        'library_page' => true,
        'library_custom' => true,
        'library_global' => true,
        'library_templates' => true,
        'library_in_use_only' => false,
        // Not toggles: who the limit above covers. 'everyone' means everyone,
        // super admins included — which is how you check what an editor sees
        // without a second account. 'roles' narrows it to the handles listed.
        'library_in_use_only_scope' => 'everyone',
        'library_in_use_only_roles' => [],
        'chrome_header' => true,
        'chrome_footer' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Section library snapshot
    |--------------------------------------------------------------------------
    |
    | Where `library_in_use_only` writes what it found: the section types and
    | global sections the site was using when the scan was last run. Null puts it
    | in resources/visual-editor/library-snapshot.yaml, so it is committed and
    | travels with the site rather than being re-scanned per environment.
    |
    */
    'library' => [
        'snapshot' => null,
    ],

    /*
    |--------------------------------------------------------------------------
    | Tailwind in the template dock
    |--------------------------------------------------------------------------
    |
    | When `tailwind_dock` is on, the HTML pane is compiled with this file's
    | `@theme` / `@utility` so `bg-primary` matches the site. Missing file
    | falls back to Tailwind's defaults; arbitrary values still work.
    |
    */
    'tailwind' => [
        'css' => resource_path('css/site.css'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Site CSS (Live Preview style manager)
    |--------------------------------------------------------------------------
    |
    | The icon opens these files. `site.css` is the Vite entry; other sheets
    | only reach the page if that file imports them. `cp.css` is Control
    | Panel CSS and stays out of the tree.
    |
    */
    'site_css' => [
        'root' => resource_path('css'),
        'exclude' => ['cp.css'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Site files (Utilities > Site Files)
    |--------------------------------------------------------------------------
    |
    | Which folder the file browser opens, and which folders inside it never
    | appear. `resources` covers views, css, js and lang — the files a site is
    | actually built from.
    |
    | Widening `root` to base_path() would put `.env`, `routes/` and every PHP
    | file this server executes one click away from anyone who can reach the
    | page. The extension whitelist in FileManager still refuses `.php`, but it
    | is the second wall, not the first — leave the root where it is.
    |
    | `users` is excluded for a different reason: `resources/users/roles.yaml`
    | is where CP permissions are written, so a named non-super person with this
    | screen could grant themselves super. Statamic edits both files on its own
    | screen, behind its own permission.
    |
    */
    'file_manager' => [
        'root' => resource_path(),
        'exclude' => ['dist', 'boost', 'stubs', 'node_modules', 'vendor', 'users'],
    ],

    /*
    |--------------------------------------------------------------------------
    | AI panel
    |--------------------------------------------------------------------------
    |
    | Live Preview chat for super admins. Uses Cursor, not Anthropic. Paste
    | the key on the addon settings screen (`ai_api_key`). That is what the
    | editor uses. CURSOR_API_KEY in .env is only a fallback if the field
    | is left empty.
    |
    */
    'ai' => [
        'api_key' => env('CURSOR_API_KEY', env('STATAMIC_VISUAL_EDITOR_AI_KEY')),
        'model' => env('STATAMIC_VISUAL_EDITOR_AI_MODEL', 'composer-2.5'),
        'node' => env('STATAMIC_VISUAL_EDITOR_NODE'),
        'rules' => env('STATAMIC_VISUAL_EDITOR_AI_RULES'),

        /*
         * Hand the chat Statamic's own description of itself — the guidelines
         * file the installed statamic/cms ships for Laravel Boost. Folder
         * structure, collections vs. taxonomies, blueprints vs. fieldsets.
         *
         * Read straight from vendor, so it always matches the Statamic running
         * here and there is no copy to keep current. Laravel Boost is not
         * required; it reads the same file from the same place.
         *
         * Turn it off if you would rather keep the prompt short, or point
         * `statamic_guidelines_path` at a file of your own to say it differently.
         */
        'statamic_guidelines' => true,
        'statamic_guidelines_path' => null,

        /*
         * MCP servers to attach to each run, keyed by name. Config only, never
         * the settings screen: each entry is a command this server runs, or a
         * URL it hands credentials to.
         *
         * Empty means the option is not sent at all. Two shapes, as the Cursor
         * SDK defines them:
         *
         *   'statamic' => ['command' => 'php', 'args' => ['artisan', 'boost:mcp']],
         *   'docs'     => ['url' => 'https://example.test/mcp', 'headers' => [...]],
         *
         * Worth knowing before adding one: the agent may call these tools on
         * its own, so a server that can write is a second way into this site.
         */
        'mcp_servers' => [],
    ],

    /*
    |--------------------------------------------------------------------------
    | Section preview images
    |--------------------------------------------------------------------------
    |
    | Section previews are screenshots of the real thing, taken in a headless
    | browser and kept up to date by themselves. A section type is photographed
    | with its DEFAULT values — what the Add Set picker inserts — so the picture
    | in the picker is what you get when you drop it in.
    |
    | Nothing has to be run by hand. Saving a section, a fieldset or the theme
    | settings asks for a refresh, as does opening the section library, and each
    | preview's filename carries a fingerprint of everything the picture depends
    | on — so a refresh where nothing changed starts no browser at all.
    |
    | - field:      the Replicator field (fieldset handle) whose set types get
    |               previews (e.g. your page-builder field).
    | - collection: the collection a preview is rendered inside, and the first one
    |               searched for a real instance of a section type whose template
    |               draws nothing from its defaults alone.
    | - scan:       collection handles to search for those instances. Null searches
    |               them all (bar the editor's own stores), so examples kept
    |               outside the pages collection are found without configuring
    |               anything.
    | - template:   the template to render that shell with. Null means the
    |               collection's own — never the host entry's, which may override
    |               it with one that puts markup above the sections and would
    |               leave every screenshot showing that instead.
    | - auto:       whether saves refresh previews in the background. Each refresh
    |               that finds something to do starts a headless browser for a few
    |               seconds — nothing a visitor ever waits on, but real memory on
    |               the machine that runs it. Set SVE_PREVIEWS_AUTO=false on a
    |               server where that isn't welcome (or where Chrome isn't
    |               installed): previews are then generated where the design is
    |               built and deployed as the files they are. Nothing about the
    |               public site depends on this either way.
    | - exclude:    set handles to skip (e.g. a column builder or reusable
    |               sections that don't make sense as a single screenshot).
    | - overrides:  per-handle ['url' => …, 'selector' => …] to photograph
    |               something else entirely.
    | - width/delay: browser window width (px) and the ms to wait for entrance
    |               animations before capturing.
    |
    | - watch / watch_exclude: the files that decide whether EVERY preview is out
    |               of date — the built assets and the shared templates. The
    |               build manifest rather than the CSS sources on purpose: a
    |               screenshot shows what has been built, so an unbuilt edit must
    |               not count as a change. Section partials are excluded because
    |               each one is fingerprinted against its own section, which is
    |               what keeps a change to one section from re-shooting the site.
    | - section_partials: where a set handle's own template lives, so
    |               `hero/style_1` is looked for at
    |               `<section_partials>/hero/style_1.antlers.html`.
    | - theme_global: the global set whose values every preview depends on —
    |               colours, fonts, spacing. Saving it makes every preview stale.
    |               Deliberately not the chrome set: header and footer may live in
    |               a set of their own, and a header edit must not re-shoot the
    |               whole site (nor a colour change leave it untouched).
    |
    */
    'previews' => [
        'field' => 'page_sections',
        'theme_global' => 'theme_settings',
        'collection' => 'pages',
        'scan' => null,
        'template' => null,
        'auto' => env('SVE_PREVIEWS_AUTO', true),
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

        'watch' => [
            'public/build/manifest.json',
            'resources/css',
            'resources/views',
        ],
        'watch_exclude' => [
            'resources/views/partials/page_sections',
        ],
        'section_partials' => 'resources/views/partials/page_sections',
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
    | Page compositions
    |--------------------------------------------------------------------------
    |
    | Where whole-page section stacks live. Saving a page as a composition copies
    | every section on it into one entry here; dropping that composition onto
    | another page copies them back out.
    |
    | - collection: the collection holding compositions. It needs a blueprint
    |               with title, preview_image and an imported page-builder field,
    |               and NO route — a composition is a stack of sections, never a
    |               page, and a route would give it a public URL.
    |
    | Its own collection rather than a flag on the saved sections store: the two
    | are separate lists with their own place in the Control Panel nav, and they
    | behave differently — a saved section can be *synced*, which is what the
    | global-section feature hangs off, while a composition is always copied.
    |
    | Config key stays `templates` so existing published configs keep working.
    |
    */
    'templates' => [
        'collection' => 'saved_compositions',

        /*
        | Page-section Antlers partials. The template dock reads and writes
        | `{handle}.antlers.html` here (`hero/style_2` → `hero/style_2.antlers.html`).
        | The dock never creates a file that is not already on disk.
        */
        'partials' => resource_path('views/partials/page_sections'),

        /*
        | Handles that stay editable in the template dock until someone locks
        | them. Everything else is locked by default — a super admin can still
        | unlock it. A prefix matches the type and any nested style
        | (`custom_section` → `custom_section/style_1`).
        */
        'unlocked' => ['custom_section'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Tailwind bake (template dock)
    |--------------------------------------------------------------------------
    |
    | Compiled utilities for HTML-pane classes, one file per section type.
    | The Antlers partial has `{{ sve_tw }}` after the section; the tag
    | pushes onto style_push. The sheet is here, not in the markup.
    |
    */
    'tailwind' => [
        'store' => resource_path('visual-editor/tw'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Collection templates
    |--------------------------------------------------------------------------
    |
    | Index/show views for a collection, opened in Live Preview. Scaffold Views
    | writes the Antlers files; this store holds the CP rows (Cases index,
    | Cases show). No public route — CollectionTemplateEntry still unlocks
    | the Live Preview button, and the iframe is
    | /!/sve/collection-view-preview/{id}. Off until the collection_templates
    | toggle is on.
    |
    | presets: folders you write in VS Code. Each pack is a folder:
    |   {handle}/preset.yaml         title, optional description
    |   {handle}/blueprint.yaml      optional
    |   {handle}/index.antlers.html  optional
    |   {handle}/show.antlers.html   optional
    | Write __COLLECTION__ where the handle should go
    | (`{{ collection:__COLLECTION__ }}`). Applying "cases" to a collection
    | called work copies the files to work, not to cases.
    |
    */
    'collection_templates' => [
        'collection' => 'templates',
        'presets' => resource_path('visual-editor/collection-presets'),
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
    | - global: the global set both halves live in (default: theme_settings)
    | - *.global: a set for that half alone, when the two live apart. Given one,
    |   stepping across mounts the right form instead of isolating a tab the
    |   form on screen does not contain — which shows the half you just left.
    | - *.styles: selectable layouts (handle matches Antlers partial name)
    |
    */
    'chrome' => [
        'global' => 'theme_settings',

        /*
        | Tabs of that global set the Live Preview panel leaves out.
        |
        | Header and footer are edited by clicking them on the page — that is
        | what chrome focus mode is for, and it opens the very same fields. A
        | Header tab sitting in Theme Settings beside it is a second door to the
        | same room, and the one that doesn't show you what you're changing.
        |
        | Tab HANDLES, from the global set's blueprint — not the labels on
        | screen, which are renamed and translated. Only the docked panel in
        | Live Preview is affected: the ordinary Control Panel globals screen
        | still shows every tab, so nothing becomes unreachable.
        |
        | Empty the array to show them all.
        */
        'hidden_tabs' => ['header', 'footer'],
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
