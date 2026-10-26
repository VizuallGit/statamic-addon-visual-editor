<?php

namespace MarioHamann\StatamicVisualEditor\Commands;

use Illuminate\Console\Command;
use MarioHamann\StatamicVisualEditor\AiChat\Run;
use MarioHamann\StatamicVisualEditor\AiChat\Tabs;
use MarioHamann\StatamicVisualEditor\Http\Controllers\AiChatController;

/**
 * Answers one AI chat question in the background (AiChat\Run), and what was
 * queued behind it, the way the chat endpoint answered them in the request
 * before. Started by the chat, not by hand — hidden from `artisan list`.
 */
class AiChatRun extends Command
{
    protected $signature = 'sve:ai-chat-run {id}';

    protected $description = 'Answer one AI chat question in the background.';

    protected $hidden = true;

    public function handle(): int
    {
        $run = Run::take((string) $this->argument('id'));

        if ($run === null) {
            $this->error('No such AI chat run.');

            return self::FAILURE;
        }

        AiChatController::drain(new Tabs($run['user']), $run['tab'], $run['started']);

        return self::SUCCESS;
    }
}
