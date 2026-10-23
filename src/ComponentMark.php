<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\View;
use Statamic\Facades\Parse;
use Statamic\View\Antlers\Language\Runtime\GlobalRuntimeState;

/**
 * Where a component renders, said by the server.
 *
 * A page section is found in Live Preview by the `data-sid` its
 * `{{ visual_edit }}` writes. A component had no such mark: the Control
 * Panel guessed a CSS selector from the static classes on the first tag of
 * the component's file (`component-signature.js`), and the preview marked
 * whatever matched. A root with no static class — `<section id="id-{{ id }}"
 * class="" {{ visual_edit }}>` — gave no selector at all, so the dock's
 * Instant paint never found the component and every keystroke waited for the
 * morph; and a class typed onto any component's root changed the guess
 * before the page had it, so the component was lost until the file was
 * opened again. Sections never had either problem, because the server says
 * where they are.
 *
 * Now the server says where a component is too. In Live Preview, the whole
 * text of a partial that is not a page section is wrapped in
 * `{{ sve_component src="…" }} … {{ /sve_component }}` by an Antlers
 * preparser (the official hook — not a wrap of Engine), and the pair stamps
 * `data-sve-component="components/intro_style"` on the first content element
 * of what it rendered. The mark is on the rendered page, whatever the root's
 * classes are, so the Control Panel asks the preview for
 * `[data-sve-component~="components/intro_style"]` and nothing is guessed.
 *
 * A component whose render starts with another component's — a card that
 * opens with `{{ partial:components/image }}` — puts both on one element: the
 * attribute holds every src as a token, innermost first.
 *
 * Only in Live Preview: the public page carries nothing of the editor.
 */
final class ComponentMark
{
    /** The attribute on the rendered page. `componentSelector` in component-signature.js spells the same. */
    public const ATTR = 'data-sve-component';

    /** Comment the pair puts first in its content, so the content is never the file's text again (see preparse). */
    private const INNER = '{{# sve-component #}}';

    /** Tags whose whole element is skipped before the first content element is looked for. */
    private const SKIPPED_PAIRS = ['style', 'script', 'template', 'noscript', 'title'];

    /** Void tags that are skipped — nothing to close. */
    private const SKIPPED_VOID = ['link', 'meta', 'base'];

    /** file path|mtime → the file's text with the front matter off, for this request. */
    private static array $bodies = [];

    /** view path → its src, or null — for this request. */
    private static array $srcs = [];

    /**
     * Antlers preparser: a partial's text, wrapped in the stamping pair.
     *
     * The preparser runs on every text the runtime parses — the view's own,
     * but also the content of every tag pair inside it (`{{ sve_defaults }}`,
     * a loop, the pair this very method adds). Only the view's own text is
     * wrapped: the one that IS the file. Anything else is left as it is, so a
     * loop's body never becomes "a component" and the pair never wraps its
     * own content again.
     *
     * Null is what Statamic passes for an empty field; it goes back as is.
     */
    public static function preparse(?string $text): ?string
    {
        if ($text === null || $text === '' || ! static::active()) {
            return $text;
        }

        $view = GlobalRuntimeState::$currentExecutionFile;

        if (! is_string($view) || $view === '') {
            return $text;
        }

        // The preparser runs for every text the runtime parses; the same few
        // files come round many times on one page.
        if (! array_key_exists($view, self::$srcs)) {
            self::$srcs[$view] = static::srcOfView($view);
        }

        $src = self::$srcs[$view];

        if ($src === null || ! static::isFileText($view, $text)) {
            return $text;
        }

        return static::wrap($text, $src);
    }

    /** The text as the preparser hands it on: in the pair, with the inner comment first. */
    public static function wrap(string $text, string $src): string
    {
        return '{{ sve_component src="'.$src.'" }}'.self::INNER.$text.'{{ /sve_component }}';
    }

    /**
     * `…/views/partials/components/intro_style.antlers.html` → `components/intro_style`.
     *
     * Read against the view finder's own locations, not a pattern on the whole
     * path (a site that lives under a folder called `partials` would match).
     * Null for a page section (found by `data-sid` already), for a file that
     * is not a partial (a layout, a collection view), or for a file that is not
     * under any view location.
     */
    public static function srcOfView(string $path): ?string
    {
        $path = static::normalizePath($path);

        foreach (View::getFinder()->getPaths() as $location) {
            $prefix = rtrim(static::normalizePath((string) $location), '/').'/partials/';

            if (! str_starts_with($path, $prefix)) {
                continue;
            }

            $src = preg_replace('/\.(antlers\.html|antlers\.php|blade\.php|html)$/', '', substr($path, strlen($prefix)));

            if ($src === null || $src === '' || str_starts_with($src, 'page_sections/')) {
                return null;
            }

            return $src;
        }

        return null;
    }

    /** Forward slashes, symlinks resolved — the finder keeps a location as it was given, the runtime the file as it found it. */
    private static function normalizePath(string $path): string
    {
        $tail = '';
        $head = $path;

        // The nearest ancestor that exists is resolved; what hangs below it is kept as written.
        while (($real = realpath($head)) === false) {
            $parent = dirname($head);

            if ($parent === $head) {
                return str_replace('\\', '/', $path);
            }

            $tail = DIRECTORY_SEPARATOR.basename($head).$tail;
            $head = $parent;
        }

        return str_replace('\\', '/', $real.$tail);
    }

    /**
     * The mark on the first content element of a render.
     *
     * Not a comment, not a closing tag, not a `<style>` or `<script>` (the
     * whole element is skipped, text and all): the element the component IS
     * on the page. An element already marked by a component rendered inside
     * this one gets this src as a further token; a render with no element is
     * returned as it was.
     */
    public static function stamp(string $html, string $src): string
    {
        $from = 0;

        while (preg_match('/<(?:!--|(?!\/|!)([A-Za-z][\w:-]*))/', $html, $m, PREG_OFFSET_CAPTURE, $from)) {
            $at = $m[0][1];

            // A comment, text and all — `<!-- <div> -->` holds no element.
            if ($m[0][0] === '<!--') {
                $close = strpos($html, '-->', $at + 4);

                if ($close === false) {
                    return $html;
                }

                $from = $close + 3;

                continue;
            }

            $name = $m[1][0];
            $afterName = $at + 1 + strlen($name);
            $lower = strtolower($name);

            if (in_array($lower, self::SKIPPED_PAIRS, true)) {
                $close = stripos($html, '</'.$lower, $afterName);

                if ($close === false) {
                    return $html;
                }

                $from = $close + 2;

                continue;
            }

            if (in_array($lower, self::SKIPPED_VOID, true)) {
                $end = static::openTagEnd($html, $afterName);

                if ($end === null) {
                    return $html;
                }

                $from = $end;

                continue;
            }

            return static::stampOpenTag($html, $afterName, $src);
        }

        return $html;
    }

    /** The attribute written into the open tag whose name ends at `$afterName`. */
    private static function stampOpenTag(string $html, int $afterName, string $src): string
    {
        $end = static::openTagEnd($html, $afterName);
        $openTag = substr($html, $afterName, ($end ?? strlen($html)) - $afterName);
        $value = htmlspecialchars($src, ENT_QUOTES);

        if (preg_match('/\s'.preg_quote(self::ATTR, '/').'\s*=\s*"([^"]*)"/', $openTag, $has, PREG_OFFSET_CAPTURE)) {
            $tokens = preg_split('/\s+/', trim($has[1][0])) ?: [];

            if (in_array($value, $tokens, true)) {
                return $html;
            }

            $valueEnd = $afterName + $has[1][1] + strlen($has[1][0]);

            return substr($html, 0, $valueEnd).(trim($has[1][0]) === '' ? '' : ' ').$value.substr($html, $valueEnd);
        }

        return substr($html, 0, $afterName).' '.self::ATTR.'="'.$value.'"'.substr($html, $afterName);
    }

    /** Offset just past the `>` that closes the open tag whose name ends at `$from`, quotes respected; null when it never closes. */
    private static function openTagEnd(string $html, int $from): ?int
    {
        $quote = '';
        $length = strlen($html);

        for ($i = $from; $i < $length; $i++) {
            $char = $html[$i];

            if ($quote !== '') {
                if ($char === $quote) {
                    $quote = '';
                }

                continue;
            }

            if ($char === '"' || $char === "'") {
                $quote = $char;
            } elseif ($char === '>') {
                return $i + 1;
            }
        }

        return null;
    }

    /** Whether `$text` is the file's own text — what the Engine read, front matter off — and not a pair's content inside it. */
    private static function isFileText(string $view, string $text): bool
    {
        if (! is_file($view)) {
            return false;
        }

        $key = $view.'|'.filemtime($view);

        if (! array_key_exists($key, self::$bodies)) {
            if (count(self::$bodies) > 200) {
                self::$bodies = [];
            }

            self::$bodies[$key] = (string) (Parse::frontMatter((string) file_get_contents($view))['content'] ?? '');
        }

        return self::$bodies[$key] === $text;
    }

    /** Live Preview only — the same gate as `{{ visual_edit }}`. */
    private static function active(): bool
    {
        return (bool) request()->isLivePreview();
    }
}
