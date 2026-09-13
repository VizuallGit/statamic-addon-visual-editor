<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\AiCopy;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Keywords;

/**
 * Copy suggestions for one text field in Live Preview, written against the
 * page's keywords. Writes nothing — not the entry, not a file. The answer goes
 * back to the browser, and the user decides whether any of it lands in the form.
 *
 * The page's keywords come in on the request because they are the value in the
 * open publish form, which is not what is saved on disk yet. The site's own
 * keywords are read server-side.
 */
class AiCopyController
{
    public function store(Request $request)
    {
        abort_unless(Features::allows('ai_text'), 403);

        $keywords = $request->input('keywords', []);

        try {
            $suggestions = AiCopy::suggest([
                'kind' => (string) $request->input('kind', 'text'),
                'text' => (string) $request->input('text', ''),
                'instruction' => (string) $request->input('instruction', ''),
                'count' => (int) $request->input('count', 1),
                'words' => (int) $request->input('words', 0),
                'avoid' => is_array($request->input('avoid')) ? $request->input('avoid') : [],
                'keywords' => is_array($keywords) ? $keywords : Keywords::clean($keywords),
                'page' => (string) $request->input('page', ''),
                'section' => (string) $request->input('section', ''),
                'label' => (string) $request->input('label', ''),
            ]);
        } catch (\Symfony\Component\HttpKernel\Exception\HttpException $e) {
            return response()->json([
                'message' => $e->getMessage() ?: __('sve::messages.ai_text_error'),
            ], $e->getStatusCode());
        }

        return response()->json([
            'ok' => true,
            'suggestions' => $suggestions,
        ]);
    }

    /**
     * The keywords a request would be written against, for the panel's own
     * display. Asked once when the popover opens, so the user can see what the
     * suggestions are aimed at before spending a request finding out.
     */
    public function keywords()
    {
        abort_unless(Features::allows('ai_text'), 403);

        return response()->json([
            'ok' => true,
            'site' => Keywords::site(),
        ]);
    }
}
