<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\AiChat;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Chat from Live Preview: rewrite the open Antlers file, create YAML fieldsets /
 * blueprints / new section partials, or (Write mode) return markup without writing
 * files. Gated by the AI toggle and toolbar access.
 *
 * Runs a local Cursor agent against the site. Same Cursor account — not Anthropic.
 *
 * The conversation lives in the user's tab on the server (AiChat\Tabs), not in
 * the browser: the question is written into the tab before the agent starts and
 * the answer when it ends — even when the page that asked was reloaded or
 * closed in between, which is why the run does not stop when the browser goes.
 */
class AiChatController
{
    public function store(Request $request)
    {
        $tabs = AiTabsController::tabs();
        $tab = (string) $request->input('tab', '');
        $handle = (string) $request->input('type', '');
        $mode = AiChat::modeOf($request->input('mode'));
        $text = trim((string) $request->input('text', ''));
        $images = $request->input('images', []);
        $images = is_array($images) ? array_values(array_filter($images, 'is_string')) : [];

        abort_if($tabs->get($tab) === null, 404);
        abort_if($text === '' && $images === [], 422, 'Write something, or add an image.');

        ['run' => $run, 'chat' => $chat] = $tabs->startRun($tab, $text, $images, $mode);

        ignore_user_abort(true);

        $agent = $tabs->forAgent($chat);
        $status = 200;
        $out = null;

        try {
            $out = AiChat::talk($handle, $agent['messages'], $mode, $agent['images']);
            $row = [
                'role' => 'assistant',
                'kind' => 'reply',
                'mode' => $out['mode'],
                'content' => $out['reply'],
                'applied' => $out['applied'],
            ];
        } catch (HttpException $e) {
            $status = $e->getStatusCode();
            $row = ['role' => 'assistant', 'kind' => 'error', 'content' => $e->getMessage() ?: 'The AI request failed.'];
        } catch (\Throwable $e) {
            report($e);
            $status = 500;
            $row = ['role' => 'assistant', 'kind' => 'error', 'content' => 'The AI request failed.'];
        }

        $chat = $tabs->finishRun($tab, $run, $row) ?? $tabs->get($tab);

        return response()->json([
            'ok' => $status === 200,
            'message' => $status === 200 ? null : $row['content'],
            'reply' => $out['reply'] ?? '',
            'applied' => $out['applied'] ?? false,
            'type' => $handle,
            'path' => $out['path'] ?? null,
            'mode' => $out['mode'] ?? $mode,
            'chat' => $chat,
        ], $status);
    }
}
