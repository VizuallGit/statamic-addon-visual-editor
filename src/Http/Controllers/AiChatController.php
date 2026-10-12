<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\AiChat;
use MarioHamann\StatamicVisualEditor\AiChat\Tabs;
use MarioHamann\StatamicVisualEditor\CursorAgent;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Chat from Live Preview: rewrite the open Antlers file, create a new section
 * type, or (Write mode) return markup without writing files. Gated by the AI
 * toggle and toolbar access.
 *
 * Runs a local Cursor agent against the site. Same Cursor account — not Anthropic.
 *
 * The conversation lives in the user's tab on the server (AiChat\Tabs), not in
 * the browser: the question is written into the tab before the agent starts and
 * the answer when it ends — even when the page that asked was reloaded or
 * closed in between, which is why the run does not stop when the browser goes.
 *
 * Asked while the AI is still answering, a question is queued; the request
 * running the answer asks the next queued question when it is done, and so on
 * until the queue is empty — the panel only polls. Stop ends the agent of the
 * run it stops, and the queue waits. "Send now" (`queued`) stops what is
 * running and asks that queued question in its place.
 */
class AiChatController
{
    public function store(Request $request)
    {
        $tabs = AiTabsController::tabs();
        $tab = (string) $request->input('tab', '');

        abort_if($tabs->get($tab) === null, 404);

        $queued = (string) $request->input('queued', '');

        if ($queued !== '') {
            $started = $tabs->sendNow($tab, $queued);

            abort_if($started === null, 404, 'That question is no longer in the queue.');
        } else {
            $text = trim((string) $request->input('text', ''));
            $images = $request->input('images', []);
            $images = is_array($images) ? array_values(array_filter($images, 'is_string')) : [];
            $model = trim((string) $request->input('model', ''));

            abort_if($text === '' && $images === [], 422, 'Write something, or add an image.');

            $started = $tabs->ask($tab, $text, $images, [
                'mode' => AiChat::modeOf($request->input('mode')),
                'model' => CursorAgent::validModel($model) ? $model : null,
                'type' => (string) $request->input('type', ''),
            ]);

            if (isset($started['queued'])) {
                return response()->json(['ok' => true, 'queued' => true, 'chat' => $started['chat']]);
            }
        }

        ignore_user_abort(true);

        [$status, $out, $chat, $message] = static::drain($tabs, $tab, $started);

        return response()->json([
            'ok' => $status === 200,
            'message' => $message,
            'reply' => $out['reply'] ?? '',
            'applied' => $out['applied'] ?? false,
            'path' => $out['path'] ?? null,
            'mode' => $out['mode'] ?? null,
            'chat' => $chat,
        ], $status);
    }

    /**
     * Answer this question, then each queued one after it, until the queue is
     * empty — or a run is stopped, fails or its tab is closed. A failure keeps
     * what is still queued for the user to send or remove.
     *
     * @param  array{run: string, chat: array, item: array}  $started
     * @return array{0: int, 1: ?array, 2: ?array, 3: ?string}
     */
    protected static function drain(Tabs $tabs, string $tab, array $started): array
    {
        while (true) {
            [$status, $out, $row] = static::answer($tabs, $tab, $started);
            $chat = $tabs->finishRun($tab, $started['run'], $row);

            if ($chat === null || $status !== 200) {
                return [$status, $out, $chat ?? $tabs->get($tab), $status === 200 ? null : $row['content']];
            }

            $next = $tabs->startNext($tab);

            if ($next === null) {
                return [$status, $out, $chat, null];
            }

            $started = $next;
        }
    }

    /**
     * @param  array{run: string, chat: array, item: array}  $started
     * @return array{0: int, 1: ?array, 2: array}
     */
    protected static function answer(Tabs $tabs, string $tab, array $started): array
    {
        $item = $started['item'];
        $agent = $tabs->forAgent($started['chat']);
        $run = $started['run'];

        try {
            $out = AiChat::talk(
                (string) ($item['type'] ?? ''),
                $agent['messages'],
                (string) $item['mode'],
                $agent['images'],
                $item['model'] ?? $started['chat']['model'] ?? null,
                fn () => ! $tabs->waitingFor($tab, $run),
            );

            return [200, $out, [
                'role' => 'assistant',
                'kind' => 'reply',
                'mode' => $out['mode'],
                'content' => $out['reply'],
                'applied' => $out['applied'],
            ]];
        } catch (HttpException $e) {
            return [$e->getStatusCode(), null, ['role' => 'assistant', 'kind' => 'error', 'content' => $e->getMessage() ?: 'The AI request failed.']];
        } catch (\Throwable $e) {
            report($e);

            return [500, null, ['role' => 'assistant', 'kind' => 'error', 'content' => 'The AI request failed.']];
        }
    }
}
