<?php

namespace MarioHamann\StatamicVisualEditor\AiChat;

/**
 * What one AI run may change on disk — worked out here, enforced by the gate
 * in scripts/ai-write-gate.mjs before anything is written.
 *
 * Build mode opens the site's content and theme, as an editor working in the
 * repository has it: collections, entries, taxonomies, navigation, globals and
 * saved sections (content/), blueprints, fieldsets, templates, CSS and JS
 * (resources/), images (public/). Asking for a taxonomy is enough — no file to
 * name, no rule to know.
 *
 * Closed: what would leak a secret or take the site down where the chat could
 * not put it right again — the addon settings (they hold the API keys),
 * built and installed files, and the site's PHP (app/, config/, routes/ are
 * not opened at all; .env and .php files are refused anywhere). The page
 * builder's list of sections is written by PHP after the run
 * (register_section), never by the model.
 *
 * Write mode opens nothing — null, and the agent gets no tools that write.
 */
final class WriteScope
{
    /** The site's content and theme. */
    public const OPEN = ['content/', 'resources/', 'public/'];

    /** Inside those, what stays closed. */
    public const CLOSED = [
        'resources/addons/',
        'resources/fieldsets/page_sections.yaml',
        'public/build/',
        'public/vendor/',
        'public/index.php',
        'public/.htaccess',
    ];

    /** The assets container's folder: images saved from a web page go here. */
    public const ASSETS = 'public/assets/';

    public const RULES = 'resources/visual-editor/ai-rules.md';

    /**
     * @return array{open: list<string>, closed: list<string>, files: list<string>, create: list<string>, assets: string, rules: string}|null
     */
    public static function for(string $mode): ?array
    {
        if (Prompt::modeOf($mode) !== 'build') {
            return null;
        }

        return [
            'open' => static::OPEN,
            'closed' => static::CLOSED,
            'files' => [],
            'create' => [],
            'assets' => static::ASSETS,
            'rules' => static::RULES,
        ];
    }
}
