<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers\LiveReloadController;

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Facade;
use MarioHamann\StatamicVisualEditor\ScriptPushStack;
use MarioHamann\StatamicVisualEditor\ScriptPushStackBridge;
use MarioHamann\StatamicVisualEditor\StylePushStack;
use MarioHamann\StatamicVisualEditor\StylePushStackBridge;
use Throwable;

/**
 * The public page, rendered inside the held live-reload poll.
 *
 * The public page's button names its page (`?page=/path?query`). A new
 * request for the page after a save costs a framework boot (300 ms on the
 * server) and, on a cold process, the Stache and the parsed templates again;
 * the held poll has all of that already. So the poll renders the page once
 * before the hold (warm) and again when the markup changed, and the answer
 * carries the HTML. Measured on Cuben: the new HTML ready 140–260 ms after a
 * save, against 1.4 s for the page's own fetch.
 *
 * The page goes through the HTTP kernel as a request of its own — the web
 * group, the site's middleware, the session — so the HTML is the HTML a
 * browser fetch gets, with the same session (the cookies the poll came with,
 * as sent, still encrypted) and therefore the same CSRF token. The poll's own
 * request and session id are put back afterwards; the controller reads the
 * session again after the hold in any case.
 *
 * Live Preview never names a page; its poll is not touched.
 */
final class PageRender
{
    private function __construct(
        private readonly Request $poll,
        private readonly string $path,
    ) {}

    /**
     * The page the poll names, or null: a path on this site, nothing else,
     * and only with the browser's own session cookie as it arrived. Without
     * it the page would render in a new session — another CSRF token in its
     * forms — so the button fetches the page itself instead.
     */
    public static function for(Request $poll): ?self
    {
        $page = $poll->query('page');

        if (! is_string($page) || $page === '' || strlen($page) > 2048) {
            return null;
        }

        if ($page[0] !== '/' || str_starts_with($page, '//') || str_contains($page, '\\')) {
            return null;
        }

        // Not a page: the action routes (this poll among them — a poll held
        // inside a poll) and the Control Panel.
        $first = strtok(ltrim((string) parse_url($page, PHP_URL_PATH), '/'), '/');

        foreach ([config('statamic.routes.action', '!'), config('statamic.cp.route', 'cp')] as $prefix) {
            if ($first !== false && $first === trim((string) $prefix, '/')) {
                return null;
            }
        }

        if (! $poll->hasSession() || ! is_string($_COOKIE[$poll->session()->getName()] ?? null)) {
            return null;
        }

        return new self($poll, $page);
    }

    /** Loads what a render needs into this process, so the render after a save is the quick one. */
    public function warm(): void
    {
        $this->html();
    }

    /** The page's HTML as a browser would get it, or null when it is not a page. */
    public function html(): ?string
    {
        static::flushPushStacks();

        $outer = app('request');
        $session = $this->poll->hasSession() ? $this->poll->session() : null;
        $id = $session?->getId();

        try {
            $response = app(Kernel::class)->handle($this->request());
        } catch (Throwable $e) {
            report($e);

            return null;
        } finally {
            app()->instance('request', $outer);
            Facade::clearResolvedInstance('request');

            if ($session !== null && $session->getId() !== $id) {
                $session->setId($id);
            }
        }

        if ($response->getStatusCode() !== 200 || ! str_contains((string) $response->headers->get('Content-Type'), 'text/html')) {
            return null;
        }

        $html = $response->getContent();

        // The answer is JSON: a page that is not valid UTF-8 would turn every
        // poll into a 500. The button fetches such a page itself.
        return is_string($html) && str_contains($html, '</body>') && mb_check_encoding($html, 'UTF-8') ? $html : null;
    }

    /**
     * style-push keeps what a render pushed in static stacks, emptied only by
     * a new process. This one renders the page twice (warm, then after the
     * save): without this a CSS rule taken out of a section would still be in
     * the page, beside the new block — what static-publish empties between
     * pages. The addon is optional; the bridges are only touched when it is
     * there.
     */
    private static function flushPushStacks(): void
    {
        if (StylePushStack::available()) {
            StylePushStackBridge::reset();
        }

        if (ScriptPushStack::available()) {
            ScriptPushStackBridge::reset();
        }
    }

    /**
     * A GET for the page from the poll's browser: its server variables (host,
     * scheme, address, agent) without the poll's own path and XHR header, and
     * its cookies as they arrived ($_COOKIE, still encrypted; the poll's own
     * cookie bag was decrypted in place) — EncryptCookies decrypts them again.
     *
     * Marked as a prefetch, which it is — rendered ahead for the button, not
     * a visit: Laravel then keeps it out of the session's previous URL, and
     * the site's page-view count skips it (RecordPageViews; the warm render
     * would otherwise count once per poll). `X-Sve-Live-Reload` names it for
     * anything else that needs to tell.
     */
    private function request(): Request
    {
        $server = $this->poll->server->all();

        unset($server['HTTP_X_REQUESTED_WITH'], $server['CONTENT_TYPE'], $server['CONTENT_LENGTH']);
        $server['HTTP_ACCEPT'] = 'text/html';
        $server['HTTP_SEC_PURPOSE'] = 'prefetch';
        $server['HTTP_X_SVE_LIVE_RELOAD'] = '1';

        return Request::create($this->poll->getSchemeAndHttpHost().$this->path, 'GET', [], $_COOKIE, [], $server);
    }
}
