<?php

namespace MarioHamann\StatamicVisualEditor\Commands;

use Illuminate\Console\Command;
use MarioHamann\StatamicVisualEditor\SetPreviewGenerator;

class GenerateSetPreviews extends Command
{
    protected $signature = 'sve:generate-set-previews {--set= : Only regenerate this set handle}';

    protected $description = 'Regenerate the Add Set picker preview images by screenshotting the rendered sections.';

    public function handle(SetPreviewGenerator $generator): int
    {
        $this->info('Generating set preview images…');

        $results = $generator->generate($this->option('set'));

        foreach ($results as $handle => $status) {
            $ok = $status === 'ok';
            $this->line(sprintf(' %s %s — %s', $ok ? '<info>✓</info>' : '<comment>•</comment>', $handle, $status));
        }

        $failed = collect($results)->filter(fn ($s) => str_starts_with($s, 'error'))->isNotEmpty();

        return $failed ? self::FAILURE : self::SUCCESS;
    }
}
