<?php

namespace MarioHamann\StatamicVisualEditor\Commands;

use Illuminate\Console\Command;
use MarioHamann\StatamicVisualEditor\DockGhost;
use MarioHamann\StatamicVisualEditor\DockGhost\Job;

/**
 * Answers one dock AI job in the background (DockGhost\Job): the question
 * from its file, asked the way the controller asks it directly, the answer
 * written back. Started by the dock, not by hand — hidden from `artisan list`.
 */
class GhostJob extends Command
{
    protected $signature = 'sve:ghost-job {id}';

    protected $description = 'Answer one question to the HTML dock\'s AI in the background.';

    protected $hidden = true;

    public function handle(): int
    {
        $id = (string) $this->argument('id');
        $job = Job::read($id);

        if ($job === null) {
            $this->error("No dock AI job {$id}.");

            return self::FAILURE;
        }

        // The job runs as console: the author comes from the file, and the
        // job id is the one claimed when it was started.
        $request = ['user' => (string) ($job['user'] ?? ''), 'job' => $id] + (array) ($job['request'] ?? []);

        try {
            $out = ($job['kind'] ?? '') === 'edit' ? DockGhost::edit($request) : DockGhost::complete($request);
        } catch (\Throwable $e) {
            report($e);

            $out = ['ok' => false, 'text' => '', 'ms' => 0, 'usage' => [], 'status' => 502, 'message' => $e->getMessage()];
        }

        Job::finish($id, $out);

        return self::SUCCESS;
    }
}
