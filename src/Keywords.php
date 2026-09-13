<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\GlobalSet;
use Statamic\Facades\Site;

/**
 * The keywords the text writer aims at.
 *
 * Two lists, and the difference between them is what makes the writing useful:
 * the page's own keywords are what *this* page is about, and the site's are the
 * standing ones every page shares. A heading written for the page keywords with
 * the site list as background reads like it belongs here; one written for the
 * merged pile reads like a keyword dump.
 *
 * The page list arrives from the browser, because it is the value in the open
 * publish form — which is not what is on disk while the editor is being used.
 * The site list is read here: it is a global, and a global is the same whether
 * or not there is a form open.
 */
class Keywords
{
    /** How many are worth sending. A longer list stops being a focus. */
    public const MAX = 12;

    /**
     * The site-wide keywords, from whichever global carries a `keywords` field.
     *
     * Configurable, and the default is a search rather than a fixed handle: a
     * site that calls its global `site_settings` and one that calls it `seo`
     * both work without editing PHP. First match wins, in the order the sets
     * come back.
     *
     * @return list<string>
     */
    public static function site(): array
    {
        $configured = config('statamic-visual-editor.ai.keywords_field', 'keywords');
        $field = is_string($configured) && trim($configured) !== '' ? trim($configured) : 'keywords';
        $siteHandle = Site::current()->handle();

        foreach (GlobalSet::all() as $set) {
            $localized = $set->in($siteHandle) ?? $set->inDefaultSite();

            if (! $localized) {
                continue;
            }

            $found = static::clean($localized->get($field));

            if ($found !== []) {
                return $found;
            }
        }

        return [];
    }

    /**
     * A keyword list from whatever the field actually holds.
     *
     * `taggable` stores a list of strings, but the same field may have been a
     * text input once, and a site may have typed its keywords comma-separated
     * into one. All three end up as the same list rather than as a silent empty
     * one.
     *
     * @return list<string>
     */
    public static function clean(mixed $value): array
    {
        if (is_string($value)) {
            $value = preg_split('/\s*[,;\n]\s*/', $value) ?: [];
        }

        if ($value instanceof \Traversable) {
            $value = iterator_to_array($value);
        }

        if (! is_array($value)) {
            return [];
        }

        $out = [];

        foreach ($value as $row) {
            // A LabeledValue (select) answers to __toString; a plain string is
            // already one. Anything else is not a keyword.
            $word = is_string($row) || (is_object($row) && method_exists($row, '__toString'))
                ? trim((string) $row)
                : '';

            if ($word === '' || in_array($word, $out, true)) {
                continue;
            }

            $out[] = $word;

            if (count($out) >= static::MAX) {
                break;
            }
        }

        return $out;
    }
}
