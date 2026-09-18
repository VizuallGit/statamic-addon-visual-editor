<?php

namespace MarioHamann\StatamicVisualEditor\Tags;

use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\ScriptPushStack;
use MarioHamann\StatamicVisualEditor\StylePushStack;
use Statamic\Facades\GlobalSet;
use Statamic\Facades\Site;
use Statamic\Tags\Tags;

/**
 * `{{ sve_cache src="cms_styles/layout_style_push" globals="theme_settings" }}`
 *
 * Renders a partial once and remembers the result until one of the named
 * global sets is saved — including whatever the partial pushed into the
 * `style_push` / `script_push` stacks, which is replayed on a hit.
 *
 * Why: the theme's token partial builds `:root` from theme settings on every
 * page view (72 ms on this site, ~13 % of the page and of every Live Preview
 * morph), for a result that only changes when somebody saves the theme. Same
 * story for a header or footer that reads only its own global.
 *
 * The contract: the partial may depend on the named globals and on nothing
 * else. Page data is not in the key — wrap something that reads the entry and
 * every page gets the first page's answer. That is the one thing to know.
 *
 * What invalidates it, all in the key: the addon's own version of this tag,
 * the site, the partial file's modification time, and a hash of each named
 * global's saved data for the current site. Statamic's `{{ cache }}` tag is
 * not used because it switches itself off in Live Preview, which is exactly
 * where the saving matters.
 *
 * Off in two cases: `statamic-visual-editor.cache.partials` is false, or the
 * request is a Live Preview carrying unsaved globals (`sve_globals=1`, which
 * OverrideGlobalsInPreview sets while the globals panel is open) — then the
 * partial renders live so the editor sees what they are typing.
 */
class SveCache extends Tags
{
    protected static $handle = 'sve_cache';

    /** Bump when what gets cached, or how, changes — old entries then miss. */
    public const VERSION = 1;

    public const TTL_DAYS = 30;

    public function index(): string
    {
        $src = trim((string) $this->params->get('src', ''), '/');

        if ($src === '') {
            return '';
        }

        $view = 'partials.'.str_replace('/', '.', $src);

        if (! static::enabled() || static::bypass()) {
            return $this->renderLive($view);
        }

        $key = $this->key($view);

        if ($key === null) {
            return $this->renderLive($view);
        }

        $hit = Cache::get($key);

        if (is_array($hit) && isset($hit['out'])) {
            StylePushStack::pushAll($hit['styles'] ?? []);
            ScriptPushStack::pushAll($hit['scripts'] ?? []);

            return (string) $hit['out'];
        }

        $styles = StylePushStack::mark();
        $scripts = ScriptPushStack::mark();
        $out = $this->renderLive($view);

        // Strings only: the stacks hold AntlersString objects, which carry
        // closures and cannot be serialized (the first release of this tag
        // took every page down with exactly that exception).
        Cache::put($key, [
            'out' => (string) $out,
            'styles' => array_map('strval', StylePushStack::since($styles)),
            'scripts' => array_map('strval', ScriptPushStack::since($scripts)),
        ], now()->addDays(static::TTL_DAYS));

        return $out;
    }

    public static function enabled(): bool
    {
        return (bool) config('statamic-visual-editor.cache.partials', true);
    }

    /** A Live Preview rendering with the globals the editor is typing right now. */
    public static function bypass(): bool
    {
        $request = request();

        return $request->isLivePreview() && $request->boolean('sve_globals');
    }

    /** The named globals' saved data, as it is on disk for this site. */
    public static function globalsHash(array $handles, string $site): string
    {
        $parts = [];

        foreach ($handles as $handle) {
            $set = GlobalSet::findByHandle($handle);
            $vars = $set ? ($set->in($site) ?? $set->inDefaultSite()) : null;
            $parts[$handle] = $vars ? $vars->data()->all() : null;
        }

        return md5(json_encode($parts) ?: '');
    }

    protected function key(string $view): ?string
    {
        try {
            $path = view()->getFinder()->find($view);
        } catch (\Throwable) {
            return null;
        }

        $handles = array_values(array_filter(array_map('trim', explode('|', (string) $this->params->get('globals', '')))));
        $site = Site::current()->handle();

        return 'sve-cache:'.md5(implode('|', [
            static::VERSION,
            $site,
            $view,
            (string) @filemtime($path),
            static::globalsHash($handles, $site),
            (string) $this->params->get('key', ''),
        ]));
    }

    /** The same render `{{ partial }}` would do: the partial sees the whole scope. */
    protected function renderLive(string $view): string
    {
        return (string) view($view, $this->context->all())->render();
    }
}
