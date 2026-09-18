<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\ComponentProps;
use MarioHamann\StatamicVisualEditor\DockPartial;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\GitSync;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionTemplateController\Persist;
use MarioHamann\StatamicVisualEditor\Http\Controllers\SectionTemplateController\Target;
use MarioHamann\StatamicVisualEditor\SectionTemplate;
use MarioHamann\StatamicVisualEditor\TailwindStore;
use MarioHamann\StatamicVisualEditor\TailwindTheme;
use MarioHamann\StatamicVisualEditor\TemplateHistory;

/**
 * Read and write an Antlers file from Live Preview: a section partial, or a
 * collection index/show view (`view:{path}`).
 *
 * The settings toggle and toolbar access both have to be on.
 *
 * The controller keeps the endpoints; locating the file lives in
 * `SectionTemplateController\Target` and the after-save work in
 * `SectionTemplateController\Persist`. Split in WP7d, code moved verbatim.
 */
class SectionTemplateController
{
    public function show(Request $request)
    {
        $this->authorize();

        $handle = (string) $request->query('type', '');
        [$path, $splitHandle] = Target::locate($handle);

        $parts = SectionTemplate::split((string) file_get_contents($path), $splitHandle);

        // The utilities already baked for this file travel with it. Without
        // them the dock compiled the classes on every open, took the result
        // for a change, saved, and reloaded the section in Live Preview — a
        // "Saving…" and a flicker for merely looking at a section.
        $twHandle = Target::twHandle($handle, $splitHandle);
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
            // Whether this server can take a save at all — most editing happens
            // on the server, and a dock that only fails on the first keystroke
            // is a dock that loses work.
            'writable' => [
                'template' => Target::fileWritable($path),
                'tw' => $twHandle === '' || ! Features::enabled('tailwind_dock') || TailwindStore::writable($twHandle),
            ],
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

        [$path] = Target::locate((string) $request->query('type', ''));

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
        [$path, $splitHandle] = Target::locate($handle);

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

        [$path, $splitHandle] = Target::locate($handle);

        $meta = SectionTemplate::split((string) file_get_contents($path), $splitHandle);

        abort_if(! empty($meta['locked']), 423);

        $twHandle = Target::twHandle($handle, $splitHandle);

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

        if (! Target::fileWritable($path)) {
            return response()->json([
                'ok' => false,
                'error' => 'not_writable',
                'path' => SectionTemplate::relative($path),
            ], 500);
        }

        // What the file says now, before this write replaces it.
        TemplateHistory::record($path);

        if (@file_put_contents($path, $contents) === false) {
            return response()->json([
                'ok' => false,
                'error' => 'not_writable',
                'path' => SectionTemplate::relative($path),
            ], 500);
        }

        $twWritten = Persist::persistTw($twHandle, $html, $request);

        // Do not kick PreviewRefresher here. The dock saves on every keystroke;
        // spawning a headless browser then loads extra site documents and has
        // thrown the editor back to the public front end. Picker screenshots
        // catch up when the library opens or `sve:previews` runs.

        // The public site must show this save too. Live Preview bypasses the
        // static cache, the visitors' pages do not — on a server that caches,
        // an edited section would otherwise stay old until someone cleared it.
        Persist::flushStaticCache();
        GitSync::after('section template '.$handle);

        return response()->json([
            'ok' => true,
            'path' => SectionTemplate::relative($path),
            'tw_written' => $twWritten,
        ]);
    }

    public function lock(Request $request)
    {
        $this->authorize();

        $handle = (string) $request->input('type', '');
        [$path] = Target::locate($handle);

        $locked = $request->boolean('locked');

        SectionTemplate::setLocked($path, $locked);
        GitSync::after(($locked ? 'locked ' : 'unlocked ').$handle);

        return response()->json([
            'ok' => true,
            'locked' => $locked,
            'path' => SectionTemplate::relative($path),
        ]);
    }

    protected function authorize(): void
    {
        abort_unless(Features::allows('template_dock'), 403);
    }
}
