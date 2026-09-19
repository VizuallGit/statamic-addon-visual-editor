<?php

namespace MarioHamann\StatamicVisualEditor;

use MarioHamann\StatamicVisualEditor\SectionTypeMaker\Names;

/**
 * A static section: markup of its own, with nothing for an editor to fill in.
 *
 * Not a set. It has no fields, no card in the library and no row on the page
 * an editor could move or delete. It is a partial under `partials/static/`,
 * called from the page's template outside the loop that renders the page's
 * sections — so it is on every page that template renders, where the call
 * stands. The name is the file, and the file is what the dock opens: the tree
 * lists it as a section, and clicking it shows only its own markup.
 */
class StaticSection
{
    public const FOLDER = 'partials/static';

    /**
     * The markup a static section starts as: the same root every section has,
     * so the preview outlines it, scrolls to it and marks it like the others.
     * `id` is the call's parameter (`static-<name>`) — `visual_edit` writes it
     * as the section's identity, the one the tree lists it under.
     *
     * Unlocked from the start: a file made to be written in.
     */
    public static function scaffold(): string
    {
        return "{{# sve-unlocked #}}\n"
            ."<section id=\"id-{{ id }}\" class=\"\" data-auto-contrast {{ visual_edit outline_inside=\"true\" section_orderable=\"true\" }}>\n"
            ."    \n"
            ."</section>\n";
    }

    /** The identity a static section is called with, and listed under. */
    public static function uid(string $name): string
    {
        return 'static-'.$name;
    }

    /**
     * Writes the partial and the call to it. Returns what was made, or null
     * when either could not be written — the partial first, because a file
     * nobody calls harms nothing, and the call last, because it edits the
     * template every page renders through.
     *
     * @return array{src: string, type: string, display: string, template: string}|null
     */
    public static function create(string $display, string $template): ?array
    {
        $slug = Names::slug($display);
        $templatePath = CollectionViewFile::path($template);

        if ($slug === null || $templatePath === null) {
            return null;
        }

        $dir = resource_path('views/'.self::FOLDER);

        if (! is_dir($dir) && ! @mkdir($dir, 0755, true) && ! is_dir($dir)) {
            return null;
        }

        $name = $slug;

        for ($n = 2; is_file("$dir/$name.antlers.html"); $n++) {
            $name = "{$slug}_{$n}";
        }

        if (file_put_contents("$dir/$name.antlers.html", static::scaffold()) === false) {
            return null;
        }

        $src = self::FOLDER.'/'.$name;
        $contents = (string) file_get_contents($templatePath);
        $call = '{{ partial src="'.$src.'" id="'.static::uid($name).'" }}';
        $next = rtrim($contents, "\n")."\n\n".$call."\n";

        if (file_put_contents($templatePath, $next) === false) {
            return null;
        }

        GitSync::after('static section '.$name);

        return [
            'src' => $src,
            'type' => CollectionViewFile::PREFIX.$src,
            'display' => $display,
            'template' => $template,
        ];
    }
}
