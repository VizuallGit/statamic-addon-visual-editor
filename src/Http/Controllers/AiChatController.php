<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\AiChat;
use MarioHamann\StatamicVisualEditor\Features;

/**
 * Chat from Live Preview: rewrite the open Antlers file, create YAML fieldsets /
 * blueprints / new section partials, or (Write mode) return markup without writing
 * files. Gated by the AI toggle and toolbar access.
 *
 * Runs a local Cursor agent against the site. Same Cursor account — not Anthropic.
 */
class AiChatController
{
    public function store(Request $request)
    {
        $this->authorize();

        $handle = (string) $request->input('type', '');
        $messages = $request->input('messages', []);
        $mode = AiChat::modeOf($request->input('mode'));

        abort_unless(is_array($messages), 422);

        try {
            $out = AiChat::talk($handle, $messages, $mode);
        } catch (\Symfony\Component\HttpKernel\Exception\HttpException $e) {
            return response()->json([
                'message' => $e->getMessage() ?: 'The AI request failed.',
            ], $e->getStatusCode());
        }

        return response()->json([
            'ok' => true,
            'reply' => $out['reply'],
            'applied' => $out['applied'],
            'type' => $handle,
            'path' => $out['path'],
            'mode' => $out['mode'],
        ]);
    }

    protected function authorize(): void
    {
        abort_unless(Features::allows('ai_panel'), 403);
    }
}
