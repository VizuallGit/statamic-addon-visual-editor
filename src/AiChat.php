<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Support\Facades\Artisan;
use MarioHamann\StatamicVisualEditor\AiChat\Conversation;
use MarioHamann\StatamicVisualEditor\AiChat\Prompt;
use MarioHamann\StatamicVisualEditor\AiChat\Registration;
use MarioHamann\StatamicVisualEditor\AiChat\WriteScope;

/**
 * Super-admin AI chat from Live Preview, on the AI the site picked
 * (AiProvider): Cursor's agent on the Cursor key, or the Claude runner on the
 * Claude key — the same prompt, write gate and stop either way.
 * Build mode may change the selected section's partial and fieldset, files the
 * user names in the message, and new section files; Write mode asks for markup
 * in the reply and can change nothing. That is enforced before a file is
 * written — the agent has no shell and writes only through the gate in
 * scripts/ai-write-gate.mjs, with the scope AiChat\WriteScope works out — so
 * nothing is rolled back afterwards and a file the editor saves meanwhile is
 * never touched.
 *
 * This class keeps the key, the mode and the run itself (`talk`); the prompt
 * is built by `AiChat\Prompt` and the messages cleaned by `AiChat\Conversation`.
 */
class AiChat
{
    public static function apiKey(): string
    {
        $saved = trim((string) Features::setting('ai_api_key', ''));

        if ($saved !== '') {
            return $saved;
        }

        return trim((string) config('statamic-visual-editor.ai.api_key', ''));
    }

    public static function ready(): bool
    {
        return Features::enabled('ai_panel') && AiProvider::key() !== '';
    }

    /**
     * @param  list<array{role: string, content: string}>  $messages
     * @param  list<array{data: string, mimeType: string}>  $images  shown to the agent with the question
     * @param  (callable(): bool)|null  $stopped  true once the user has stopped this run
     * @return array{reply: string, applied: bool, path: ?string, written: list<string>, registered: list<string>, mode: string, status: string}
     */
    public static function talk(string $handle, array $messages, string $mode = 'write', array $images = [], ?string $model = null, ?callable $stopped = null): array
    {
        abort_unless(AiProvider::key() !== '', 422, AiProvider::needKey());

        set_time_limit(180);

        $mode = Prompt::modeOf($mode);
        $messages = Conversation::sanitize($messages);
        $write = WriteScope::for($mode);

        $out = app(AiProvider::agent())::run(Prompt::prompt($handle, $messages, $mode, $write), $images, $write, $model, $stopped);

        $registered = $out['status'] === 'finished' ? Registration::apply($out['register']) : [];
        $reply = $out['reply'] !== '' ? $out['reply'] : 'Done.';
        $refused = array_diff(array_column($out['register'], 'handle'), $registered);

        if ($out['status'] === 'finished' && $refused !== []) {
            $reply .= "\n\n".__('sve::messages.ai_panel_not_registered', ['handles' => implode(', ', $refused)]);
        }

        // A changed stylesheet, and the Tailwind classes in a changed template
        // (site.css's @source scans the views), are only on the page once they
        // are built into public/build — the build a save in the Stylesheets
        // panel runs. Once per run, after the agent is done.
        if (array_filter($out['written'], fn (string $path) => str_starts_with($path, 'resources/css/') || str_starts_with($path, 'resources/views/') || str_starts_with($path, 'resources/js/')) !== []) {
            $build = SiteBuild::afterSave(['kind' => 'css', 'imported' => true])['build'];
            $reply .= "\n\n".($build['ok']
                ? __('sve::messages.ai_panel_css_built')
                : __('sve::messages.ai_panel_css_not_built', ['reason' => __('sve::messages.theme_utilities_reason_'.$build['reason'])]));
        }

        // New collections, blueprints, entries and saved sections: on a server
        // whose stache does not watch files, Statamic sees them only once it
        // reads its files again. Once per run, after the agent is done.
        if (array_filter($out['written'], fn (string $path) => str_starts_with($path, 'content/') || str_starts_with($path, 'resources/blueprints/') || str_starts_with($path, 'resources/fieldsets/')) !== []) {
            static::refreshStache();
        }

        if ($out['written'] !== [] || $registered !== []) {
            GitSync::after('AI build');
        }

        return [
            'reply' => $reply,
            'applied' => $out['written'] !== [] || $registered !== [],
            'path' => $out['written'][0] ?? null,
            'written' => $out['written'],
            'registered' => $registered,
            'mode' => $mode,
            'status' => $out['status'],
        ];
    }

    /** Statamic reads its content and blueprints again (`please stache:refresh`). */
    protected static function refreshStache(): void
    {
        try {
            Artisan::call('statamic:stache:refresh');
        } catch (\Throwable $e) {
            report($e);
        }
    }

    /**
     * @see Prompt::modeOf()
     */
    public static function modeOf(mixed $mode): string
    {
        return Prompt::modeOf($mode);
    }

    /**
     * @see Prompt::modeInstructions()
     */
    public static function modeInstructions(string $mode): string
    {
        return Prompt::modeInstructions($mode);
    }

    /**
     * @see Prompt::targetFiles()
     */
    public static function targetFiles(string $handle): array
    {
        return Prompt::targetFiles($handle);
    }
}
