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
    | - component_props:   inputs on a component — name, kind, default — edited
    |                      in the left panel while a component is open, and
    |                      filled in per place from the HTML tree. The
    |                      declaration is an Antlers comment in the component
    |                      file, so a rendered page never reads it and Live
    |                      Preview is untouched. Off by default; off again and
    |                      the file still renders exactly as it did.
    | - ai_panel:          a chat that runs a local Cursor agent — in Live
    |                      Preview, and on its own page under Utilities. Off by
    |                      default. Who gets it sits under the toggle.
    | - ai_text:           a switch in the Live Preview toolbar. On, every
    |                      editable text on the page wears a small mark; clicking
    |                      it suggests copy written against the page's keywords,
    |                      with the site's keywords as background. It suggests
    |                      only — nothing reaches the form until a suggestion is
    |                      clicked, and nothing is saved. Same Cursor key as
    |                      ai_panel. Off by default.
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
        'performance' => true,
        'psi' => false,
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
        'component_props' => false,
        'ai_panel' => false,
        'ai_text' => false,
        'schema' => false,
        'comments' => true,
        // Nested under each toolbar toggle. Null = defaults
        // (template_dock, site_css and file_manager = super, the rest everyone).
        'pages_access' => null,
        'globals_access' => null,
        'sections_access' => null,
        'listview_access' => null,
        'outline_access' => null,
        'performance_access' => null,
        'html_tree_access' => null,
        'template_dock_access' => null,
        'site_css_access' => null,
        'file_manager_access' => null,
        'ai_panel_access' => null,
        'ai_text_access' => null,
        'schema_access' => null,
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
        // Keeps the Patterns panel's thumbnails current while it is open: every
        // 5s it asks whether any preview has gone stale and, if so, starts the
        // same detached generator a CP save would. Off by default — with it off
        // the panel shows a button instead, so nothing runs unasked.
        'previews_autowatch' => false,
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
    /*
     * Google PageSpeed Insights, behind the `psi` toggle.
     *
     * A key is free but effectively required: keyless requests share one small
     * quota with everybody else calling the API anonymously, and it is usually
     * already spent. Get one from the Google Cloud console with the PageSpeed
     * Insights API enabled — or paste it on the addon's settings screen, which
     * wins over this.
     */
    'psi' => [
        'api_key' => env('PAGESPEED_API_KEY', env('STATAMIC_VISUAL_EDITOR_PSI_KEY')),
    ],

    'ai' => [
        'api_key' => env('CURSOR_API_KEY', env('STATAMIC_VISUAL_EDITOR_AI_KEY')),
        'model' => env('STATAMIC_VISUAL_EDITOR_AI_MODEL', 'composer-2.5'),
        'node' => env('STATAMIC_VISUAL_EDITOR_NODE'),
        'rules' => env('STATAMIC_VISUAL_EDITOR_AI_RULES'),

        /*
         * The handle of the site-wide keywords field, for AI text.
         *
         * Looked for across the global sets, first one with a value wins — so a
         * site that keeps its keywords in `site_settings` and one that keeps
         * them in `seo` both work without naming the set. Change this only if
         * the field is called something other than `keywords`.
         *
         * The *page's* keywords are not configured here: they are read from the
         * open publish form, where `meta_keywords`, `keywords` and `seo_keywords`
         * are all recognised.
         */
        'keywords_field' => 'keywords',

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

        /*
        | What the HTML toolbar's section button writes inside the opening tag.
        |
        | A page section is never just a `<section>`: it needs the id the page
        | addresses it by, the wrapper it lays out in, and the `visual_edit` tag
        | that makes it clickable in the preview. Typing those four things by
        | hand every time is how they end up missing.
        |
        | Attributes only — the tag itself is written around them. Empty writes
        | a bare `<section>`.
        */
        'section_tag' => 'id="id-{{ id }}" class="wrapper" {{ visual_edit outline_inside="true" section_orderable="true" }}',
    ],

    /*
    |--------------------------------------------------------------------------
    | Tailwind in the template dock
    |--------------------------------------------------------------------------
    |
    | When `tailwind_dock` is on, a save compiles the HTML pane with
    | Tailwind's own engine on the server (`compile` + Oxide scanner). Same
    | `@theme` / `@plugin` as `css`. Not Vite, not `npm run build`.
    |
    | store: the compiled utilities, one file per section type. The Antlers
    | partial has `{{ sve_tw }}` after the section; the tag pushes onto
    | style_push. The sheet is here, not in the markup.
    |
    */
    'tailwind' => [
        'css' => resource_path('css/site.css'),
        'store' => resource_path('visual-editor/tw'),
        'build' => public_path('build'),
        'node' => env('SVE_TAILWIND_NODE', 'node'),
        'cwd' => null,
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

    /*
    |--------------------------------------------------------------------------
    | Data picker
    |--------------------------------------------------------------------------
    |
    | The Data button in the template dock lists every variable a template can
    | print. Fieldtypes that only draw something in the Control Panel — a tab,
    | a divider, a preview of another field — store nothing, so there is no
    | variable to write for them.
    |
    | Statamic's own are recognised automatically. Addon fieldtypes usually set
    | no flags at all, so name those here.
    */
    /*
    |--------------------------------------------------------------------------
    | Screen sizes
    |--------------------------------------------------------------------------
    |
    | The breakpoints this site designs for — one list, read by Live Preview's
    | device buttons, the responsive fields, the Tailwind row and the CSS panel.
    |
    | Desktop-first: the list is sorted widest first, the widest is the base and
    | is written with no media query at all, and every narrower size is an
    | exception under a `max-width` worked out from the size above it.
    |
    | `handle` is the key content is stored under. Adding a size is safe — an
    | entry with nothing saved for it simply inherits from the size above.
    | Renaming or removing one leaves saved values with no owner, so don't,
    | unless you are prepared to migrate the content.
    |
    | Addons > Statamic Visual Editor wins over this; this wins over the three
    | the addon ships with. Leave it empty to use those.
    |
    | `min` is the narrowest screen that still counts as this size, in `unit`.
    | Use `em`: a boundary in `em` moves with the reader's own font-size setting
    | and one in `px` never does. In a media query `em` and `rem` are identical
    | — both measure against the browser's initial font size, never against
    | `html { font-size }` — so `rem` is a matter of taste, `px` is not.
    |
    |   'breakpoints' => [
    |       ['handle' => 'laptop', 'label' => 'desktop', 'device' => 'Desktop',
    |        'icon' => 'desktop', 'min' => 64, 'unit' => 'em', 'width' => 1440, 'height' => 900],
    |       ['handle' => 'wide', 'label' => 'Wide', 'device' => 'Wide',
    |        'icon' => 'laptop', 'min' => 56.25, 'unit' => 'em', 'width' => 1100, 'height' => 900],
    |       ['handle' => 'tablet', 'label' => 'tablet', 'device' => 'Tablet',
    |        'icon' => 'tablet', 'min' => 48, 'unit' => 'em', 'width' => 810, 'height' => 1080],
    |       ['handle' => 'mobile', 'label' => 'mobile', 'device' => 'Mobile',
    |        'icon' => 'mobile', 'min' => 0, 'unit' => 'em', 'width' => 375, 'height' => 812],
    |   ],
    |
    */
    /*
    |--------------------------------------------------------------------------
    | Cached partials
    |--------------------------------------------------------------------------
    |
    | `{{ sve_cache src="…" globals="theme_settings" }}` renders a partial once
    | and remembers it until one of the named globals is saved. Set `partials`
    | to false to render everything live (a measurement, or a partial that
    | turned out to read page data after all).
    |
    */

    'cache' => [
        'partials' => true,
    ],

    'breakpoints' => [],

    'data_vars' => [
        'skip' => [
            'theme_color_scale_preview',
            'fluid_font_preview',
        ],
    ],

];
