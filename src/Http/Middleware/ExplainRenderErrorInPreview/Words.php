<?php

namespace MarioHamann\StatamicVisualEditor\Http\Middleware\ExplainRenderErrorInPreview;

use Spatie\ErrorSolutions\Contracts\ProvidesSolution;
use Statamic\Facades\User;
use Statamic\Modifiers\ModifierNotFoundException;
use Statamic\View\Antlers\Language\Exceptions\AntlersException;
use Throwable;

/**
 * A render error in words a designer can act on.
 *
 * The exception page says "Modifier [in] not found" and "Unclosed "if"
 * control structure." — true, and no help to whoever typed the template.
 * This reads the few exceptions Antlers raises for a broken template
 * (measured: an unclosed `{{ if }}`, an unpaired `{{ /if }}`, a `{{` that
 * never ends, a word Antlers takes for a modifier) and says the same thing
 * the dock's strip would: what is missing, and in which tag, on which line
 * when the exception carries its node. Anything else keeps Statamic's own
 * message, under a title that says the template could not be shown.
 *
 * Strings come from resources/lang in the Control Panel user's language, the
 * same way the editor's do.
 */
final class Words
{
    /**
     * @return array{title: string, reason: string, where: string, solution: string, hint: string, class: string, message: string}
     */
    public static function explain(Throwable $e): array
    {
        $message = trim((string) $e->getMessage());

        return [
            'title' => static::t('lp_error_title'),
            'reason' => static::reason($e, $message),
            'where' => static::where($e),
            'solution' => static::solution($e),
            'hint' => static::t('lp_error_hint'),
            'class' => get_class($e),
            'message' => $message,
        ];
    }

    /** The whole page: what to say, then the technical details folded away. */
    public static function html(Throwable $e): string
    {
        $words = static::explain($e);
        $esc = fn ($value) => e((string) $value);

        $out = '<!doctype html><html lang="'.$esc(static::locale()).'"><head><meta charset="utf-8">'
            .'<meta name="viewport" content="width=device-width, initial-scale=1">'
            .'<title>'.$esc($words['title']).'</title>'
            .'<style>'.static::css().'</style></head><body>'
            .'<main data-sve-render-error>'
            .'<h1>'.$esc($words['title']).'</h1>'
            .'<p data-sve-reason>'.$esc($words['reason']).'</p>';

        if ($words['where'] !== '') {
            $out .= '<p data-sve-where><code>'.$esc($words['where']).'</code></p>';
        }

        if ($words['solution'] !== '') {
            $out .= '<p data-sve-solution>'.$esc($words['solution']).'</p>';
        }

        $out .= '<p data-sve-hint>'.$esc($words['hint']).'</p>'
            .'<details><summary>'.$esc(static::t('lp_error_details')).'</summary>'
            .'<pre>'.$esc($words['class']."\n".$words['message']).'</pre></details>'
            .'</main></body></html>';

        return $out;
    }

    protected static function reason(Throwable $e, string $message): string
    {
        if ($e instanceof ModifierNotFoundException && preg_match('/\[(.+?)\]/', $message, $m)) {
            return static::t('lp_error_modifier', ['name' => $m[1]]);
        }

        if ($e instanceof AntlersException) {
            if (preg_match('/^Unclosed "([^"]+)" control structure/', $message, $m)) {
                return static::t('lp_error_unclosed', ['name' => $m[1]]);
            }

            if (str_starts_with($message, 'Unpaired closing tag')) {
                $name = trim(static::tag($e), " /\t\n");

                return static::t('lp_error_unpaired', ['name' => $name !== '' ? $name : '…']);
            }

            if (str_starts_with($message, 'Unexpected end of input')) {
                return static::t('lp_error_unexpected_end');
            }
        }

        return static::t('lp_error_generic', ['message' => $message !== '' ? $message : get_class($e)]);
    }

    /** The tag and line the exception points at, when it carries its node. */
    protected static function where(Throwable $e): string
    {
        $tag = static::tag($e);

        if ($tag === '') {
            return '';
        }

        $line = $e->node->startPosition->line ?? null;

        return static::t('lp_error_where', ['tag' => $tag, 'line' => $line === null ? '?' : (string) $line]);
    }

    protected static function tag(Throwable $e): string
    {
        if (! $e instanceof AntlersException || ! is_object($e->node ?? null)) {
            return '';
        }

        return trim((string) ($e->node->content ?? ''));
    }

    /** Statamic's own suggestion, when the exception offers one: "Did you mean `as`?". */
    protected static function solution(Throwable $e): string
    {
        if (! $e instanceof ProvidesSolution) {
            return '';
        }

        try {
            $description = trim((string) $e->getSolution()->getSolutionDescription());
        } catch (Throwable) {
            return '';
        }

        if (preg_match('/^Did you mean `([^`]+)`\?$/', $description, $m)) {
            return static::t('lp_error_suggest', ['name' => $m[1]]);
        }

        return $description;
    }

    protected static function t(string $key, array $replace = []): string
    {
        return (string) trans('sve::messages.'.$key, $replace, static::locale());
    }

    protected static function locale(): string
    {
        try {
            return (string) (User::current()?->preferredLocale() ?? config('app.locale', 'en'));
        } catch (Throwable) {
            return (string) config('app.locale', 'en');
        }
    }

    protected static function css(): string
    {
        return 'body{margin:0;background:#fff;color:#1f2933;font:1rem/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}'
            .'main{max-width:42em;margin:3em auto;padding:0 1.25em 0 1.5em;border-left:4px solid #f0716b}'
            .'h1{font-size:1.5em;margin:0 0 .5em}'
            .'p{margin:0 0 .75em}'
            .'[data-sve-reason]{font-size:1.125em;font-weight:600}'
            .'code,pre{font:.9em/1.5 ui-monospace,SFMono-Regular,Menlo,monospace}'
            .'[data-sve-where] code{background:#fdecea;padding:.15em .4em;border-radius:.25em}'
            .'[data-sve-hint]{color:#52606d}'
            .'details{margin-top:1.5em;color:#52606d}'
            .'summary{cursor:pointer}'
            .'pre{white-space:pre-wrap;background:#f5f7fa;padding:.75em 1em;border-radius:.375em}';
    }
}
