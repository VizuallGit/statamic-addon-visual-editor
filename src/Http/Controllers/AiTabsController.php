<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\AiChat\Tabs;
use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Facades\User;

/**
 * The AI panel's tabs: list, open, close, the draft as it is typed, the images
 * pasted into it, and Stop. Asking the AI is AiChatController — it writes the
 * question and the answer into the same tab.
 *
 * Each user sees only their own tabs; there is no tab id that reaches another
 * user's folder.
 */
class AiTabsController
{
    public function index()
    {
        $tabs = static::tabs();
        $index = $tabs->index();

        return response()->json($index + ['chat' => $tabs->get($index['active'])]);
    }

    public function show(string $tab)
    {
        $chat = static::tabs()->get($tab);

        abort_if($chat === null, 404);

        return response()->json(['chat' => $chat]);
    }

    public function store()
    {
        $tabs = static::tabs();
        $index = $tabs->create();

        return response()->json($index + ['chat' => $tabs->get($index['active'])]);
    }

    /**
     * The draft (text and pasted images) and, with `activate`, which tab is
     * open. POST so the browser's last word before a reload — sendBeacon,
     * which can only POST — lands here too.
     */
    public function update(Request $request, string $tab)
    {
        $tabs = static::tabs();

        abort_if($tabs->get($tab) === null, 404);

        if ($request->has('draft')) {
            $images = $request->input('draft_images', []);

            $tabs->saveDraft($tab, (string) $request->input('draft', ''), is_array($images) ? $images : []);
        }

        if ($request->boolean('activate')) {
            $tabs->activate($tab);
        }

        return response()->json(['ok' => true]);
    }

    public function destroy(string $tab)
    {
        $tabs = static::tabs();
        $index = $tabs->close($tab);

        return response()->json($index + ['chat' => $tabs->get($index['active'])]);
    }

    public function upload(Request $request, string $tab)
    {
        $file = $request->file('image');

        abort_unless($file !== null, 422, 'No image was sent.');

        $image = static::tabs()->storeImage($tab, $file);

        return response()->json($image);
    }

    public function image(string $tab, string $image)
    {
        $path = static::tabs()->imagePath($tab, $image);

        abort_if($path === null, 404);

        return response()->file($path, ['Cache-Control' => 'private, max-age=31536000, immutable']);
    }

    public function stop(string $tab)
    {
        $tabs = static::tabs();

        $tabs->stop($tab);

        return response()->json(['chat' => $tabs->get($tab)]);
    }

    /** The current user's tabs; the AI panel has to be on for them. */
    public static function tabs(): Tabs
    {
        abort_unless(Features::allows('ai_panel'), 403);

        $user = User::current();

        abort_unless($user !== null, 403);

        return new Tabs((string) $user->id());
    }
}
