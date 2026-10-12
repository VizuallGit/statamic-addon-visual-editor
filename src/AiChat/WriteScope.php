<?php

namespace MarioHamann\StatamicVisualEditor\AiChat;

use MarioHamann\StatamicVisualEditor\SectionTemplate;
use MarioHamann\StatamicVisualEditor\SectionTemplate\Paths;

/**
 * What one AI run may change on disk — worked out here, enforced by the gate
 * in scripts/ai-write-gate.mjs before anything is written.
 *
 * Open in Build mode:
 *   - the selected section: its partial, and the fieldset its set imports
 *     (read from page_sections.yaml, not guessed from the handle — the two
 *     are not the same word on every site);
 *   - a file the user names in the message, by its file name with extension
 *     ("site.css", "links.yaml", "site_head.antlers.html"), from the site's
 *     CSS, views, fieldsets and blueprints. Talking about "my links" opens
 *     nothing; "links.yaml" does. A CSS file changed this way is built into
 *     public/build after the run, as a save in the Stylesheets panel is;
 *   - new files in the section folders, never an existing one;
 *   - the rules file, append only.
 *
 * Everything else is closed: the site's global CSS and theme, header and
 * footer, other sections, shared fieldsets. A section template locked in the
 * dock (every type but custom sections starts locked) stays closed even when
 * selected or named — the dock's lock icon opens it, as it always has.
 *
 * Write mode opens nothing — null, and the agent gets no tools that write.
 */
final class WriteScope
{
    /** Where a new section's files are made. */
    public const CREATE = ['resources/fieldsets/', 'resources/views/partials/page_sections/'];

    /**
     * Where a file named in the message may be opened from. Not content: a
     * global's YAML written behind Statamic's back is not seen on a server
     * whose stache does not watch files — and the site's colours, spacing and
     * fonts are in resources/css anyway.
     */
    public const NAMEABLE = ['resources/css', 'resources/views', 'resources/fieldsets', 'resources/blueprints'];

    public const RULES = 'resources/visual-editor/ai-rules.md';

    private const EXTENSIONS = ['css', 'yaml', 'yml', 'html'];

    /**
     * @return array{files: list<string>, create: list<string>, rules: string}|null
     */
    public static function for(string $mode, string $handle, string $text): ?array
    {
        if (Prompt::modeOf($mode) !== 'build') {
            return null;
        }

        $files = array_merge(static::section($handle), static::named($text));
        $files = array_values(array_unique(array_filter($files, fn (string $rel) => ! static::dockLocked($rel))));

        return ['files' => $files, 'create' => static::CREATE, 'rules' => static::RULES];
    }

    /**
     * The selected section's partial and the fieldset its set imports.
     *
     * @return list<string>
     */
    public static function section(string $handle): array
    {
        $target = Prompt::targetFiles($handle);

        return array_values(array_filter([$target['antlers'], $target['fieldset']]));
    }

    /**
     * Site files the message names by file name, with the extension.
     *
     * @return list<string>
     */
    public static function named(string $text): array
    {
        $names = static::namesIn($text);

        if ($names === []) {
            return [];
        }

        $found = [];

        foreach (static::NAMEABLE as $folder) {
            $root = base_path($folder);

            if (! is_dir($root)) {
                continue;
            }

            $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($root, \FilesystemIterator::SKIP_DOTS));

            foreach ($files as $file) {
                if (! $file->isFile()) {
                    continue;
                }

                $rel = static::relative($file->getPathname());
                $lower = strtolower($rel);

                foreach (array_keys($names) as $name) {
                    if ($lower === $name || str_ends_with($lower, '/'.$name)) {
                        $found[$name][] = $rel;
                    }
                }
            }
        }

        // A bare file name that fits more than one file ("style_1.antlers.html"
        // is in every group) opens none of them — the agent asks, and the user
        // says which one with its folder ("hero/style_1.antlers.html").
        $out = [];

        foreach ($found as $name => $files) {
            if (count($files) === 1 || str_contains($name, '/')) {
                array_push($out, ...$files);
            }
        }

        $out = array_values(array_unique($out));
        sort($out);

        return $out;
    }

    /**
     * Every word in the message that looks like a file name or a path —
     * `site.css`, `links.yaml`, `resources/css/site.css` — lowercased.
     *
     * @return array<string, true>
     */
    public static function namesIn(string $text): array
    {
        $ext = implode('|', static::EXTENSIONS);

        // A full stop after the name ends the sentence, not the name.
        preg_match_all('~(?<![\w./-])([\w./-]+\.(?:'.$ext.'))(?![\w-]|\.\w)~i', $text, $matches);

        $names = [];

        foreach ($matches[1] as $match) {
            $names[strtolower(ltrim($match, './'))] = true;
        }

        return $names;
    }

    /**
     * A section template locked in the dock (the lock icon; every type but
     * custom sections starts locked). Only section templates have that lock —
     * a header or footer partial named in the message is not one of them.
     */
    protected static function dockLocked(string $rel): bool
    {
        $path = realpath(base_path($rel));
        $sections = realpath(Paths::directory());

        return $path !== false
            && $sections !== false
            && str_starts_with($path, $sections.DIRECTORY_SEPARATOR)
            && SectionTemplate::fileIsLocked($path);
    }

    protected static function relative(string $absolute): string
    {
        $root = rtrim(str_replace('\\', '/', realpath(base_path()) ?: base_path()), '/').'/';
        $path = str_replace('\\', '/', realpath($absolute) ?: $absolute);

        return str_starts_with($path, $root) ? substr($path, strlen($root)) : ltrim(str_replace('\\', '/', SectionTemplate::relative($absolute)), '/');
    }
}
