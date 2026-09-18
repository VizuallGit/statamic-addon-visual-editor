<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\CollectionViewFile;
use MarioHamann\StatamicVisualEditor\DockPartial;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\SectionTemplate;
use MarioHamann\StatamicVisualEditor\TemplateHistory;
use MarioHamann\StatamicVisualEditor\TailwindCompile;
use MarioHamann\StatamicVisualEditor\TailwindStore;
use MarioHamann\StatamicVisualEditor\ComponentProps;
use MarioHamann\StatamicVisualEditor\TailwindTheme;

/**
 * Read and write an Antlers file from Live Preview: a section partial, or a
 * collection index/show view (`view:{path}`).
 *
 * The settings toggle and toolbar access both have to be on.
 */
class SectionTemplateController
{
    public function show(Request $request)
    {
        $this->authorize();

        $handle = (string) $request->query('type', '');
        [$path, $splitHandle] = $this->locate($handle);

        $parts = SectionTemplate::split((string) file_get_contents($path), $splitHandle);

        // The utilities already baked for this file travel with it. Without
        // them the dock compiled the classes on every open, took the result
        // for a change, saved, and reloaded the section in Live Preview — a
        // "Saving…" and a flicker for merely looking at a section.
        $twHandle = $this->twHandle($handle, $splitHandle);
        $tw = Features::enabled('tailwind_dock') && $twHandle !== '' ? TailwindStore::read($twHandle) : '';

        return response()->json([
            'type' => $handle,
            'path' => SectionTemplate::relative($path),
            'html' => $parts['html'],
            'css' => $parts['css'],
            'js' => $parts['js'],
            'tw' => $tw,
            'props' => $parts['props'] ?? [],
            'locked' => ! empty($parts['locked']),
        ]);
    }

    /**
     * What another component declares.
     *
     * The section holds the call; this is how it learns which fields to draw
     * beside it without opening the file in the dock.
     */
    public function componentProps(Request $request)
    {
        $this->authorize();

        return response()->json([
            'props' => Features::enabled('component_props')
                ? ComponentProps::forView('partials/'.ltrim((string) $request->query('src', ''), '/'))
                : [],
        ]);
    }

    public function theme()
    {
        $this->authorize();

        return response()->json([
            'css' => TailwindTheme::css(),
            'plugins' => TailwindTheme::plugins(),
        ]);
    }

    /**
     * The versions this file has been through, newest first.
     */
    public function history(Request $request)
    {
        $this->authorize();

        [$path] = $this->locate((string) $request->query('type', ''));

        return response()->json([
            'entries' => TemplateHistory::entries($path),
        ]);
    }

    /**
     * One earlier version, split the same way the panes are.
     */
    public function historyEntry(Request $request)
    {
        $this->authorize();

        $handle = (string) $request->query('type', '');
        [$path, $splitHandle] = $this->locate($handle);

        $contents = TemplateHistory::read($path, (string) $request->query('id', ''));

        abort_if($contents === null, 404);

        $parts = SectionTemplate::split($contents, $splitHandle);

        return response()->json([
            'html' => $parts['html'],
            'css' => $parts['css'],
            'js' => $parts['js'],
        ]);
    }

    public function partials(Request $request)
    {
        $this->authorize();

        return response()->json([
            'items' => DockPartial::resolve((string) $request->query('src', '')),
        ]);
    }

    public function update(Request $request)
    {
        $this->authorize();

        $handle = (string) $request->input('type', '');
        $html = $request->input('html');
        $css = $request->input('css');
        $js = $request->input('js');

        abort_unless(is_string($html) && is_string($css) && is_string($js), 422);

        [$path, $splitHandle] = $this->locate($handle);

        $meta = SectionTemplate::split((string) file_get_contents($path), $splitHandle);

        abort_if(! empty($meta['locked']), 423);

        $twHandle = $this->twHandle($handle, $splitHandle);

        // Props only move when the panel sends them. A save from a dock that
        // has never heard of them — an older tab, or the feature switched off
        // — leaves the declaration exactly as the file has it.
        $props = $request->input('props');
        $keepProps = Features::enabled('component_props') && is_array($props)
            ? $props
            : ($meta['props'] ?? []);

        $contents = SectionTemplate::join([
            'html' => $html,
            'css' => $css,
            'js' => $js,
            'html_tag' => $meta['html_tag'],
            'css_tag' => $meta['css_tag'],
            'js_tag' => $meta['js_tag'],
            'props' => $keepProps,
            'locked' => false,
        ], $splitHandle, $twHandle);

        // What the file says now, before this write replaces it.
        TemplateHistory::record($path);

        file_put_contents($path, $contents);

        $this->persistTw($twHandle, $html, $request);

        // Do not kick PreviewRefresher here. The dock saves on every keystroke;
        // spawning a headless browser then loads extra site documents and has
        // thrown the editor back to the public front end. Picker screenshots
        // catch up when the library opens or `sve:previews` runs.

        return response()->json([
            'ok' => true,
            'path' => SectionTemplate::relative($path),
        ]);
    }

    public function lock(Request $request)
    {
        $this->authorize();

        $handle = (string) $request->input('type', '');
        [$path] = $this->locate($handle);

        $locked = $request->boolean('locked');

        SectionTemplate::setLocked($path, $locked);

        return response()->json([
            'ok' => true,
            'locked' => $locked,
            'path' => SectionTemplate::relative($path),
        ]);
    }

    /**
     * CSS for `{{ sve_tw }}` on the public site — no Vite, no `npm run dev`.
     *
     * The dock already ran Tailwind's own engine in the Control Panel. That
     * sheet is written here on every environment, including production, so a
     * site developed on the server gets the same utilities as Live Preview.
     * Node on the server is only the fallback when the dock did not send CSS
     * (an older tab). Spawning Node on every keystroke is not the paint path.
     */
    protected function persistTw(string $twHandle, string $html, Request $request): void
    {
        if (! Features::enabled('tailwind_dock') || $twHandle === '') {
            return;
        }

        $tw = $request->input('tw');

        if ($request->exists('tw') && is_string($tw)) {
            TailwindStore::write($twHandle, $tw);

            return;
        }

        if (app()->environment('local')) {
            return;
        }

        try {
            TailwindStore::write($twHandle, TailwindCompile::fromHtml($html));
        } catch (\Throwable $e) {
            report($e);
        }
    }

    /**
     * @return array{0: string, 1: string}
     */
    protected function locate(string $handle): array
    {
        if ($view = CollectionViewFile::viewFromType($handle)) {
            $path = CollectionViewFile::path($view);
            abort_unless($path, 404);

            // Empty split-handle: a view file is not a designed section type,
            // so it must not start locked.
            return [$path, ''];
        }

        $path = SectionTemplate::path($handle);
        abort_unless($path, 404);

        return [$path, $handle];
    }

    /**
     * Key into the Tailwind store.
     *
     * A section reuses its own handle. A collection view file has an empty
     * split-handle — that is what keeps it unlocked — so it would otherwise
     * write to `TailwindStore::path('')`, which is null, and the compiled
     * utilities would be dropped on every save. It gets a `view/` key instead.
     */
    protected function twHandle(string $type, string $splitHandle): string
    {
        if ($splitHandle !== '') {
            return $splitHandle;
        }

        $view = CollectionViewFile::viewFromType($type);

        return $view ? 'view/'.$view : '';
    }

    protected function authorize(): void
    {
        abort_unless(Features::allows('template_dock'), 403);
    }
}
