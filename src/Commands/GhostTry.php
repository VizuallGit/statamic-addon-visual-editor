<?php

namespace MarioHamann\StatamicVisualEditor\Commands;

use Illuminate\Console\Command;
use MarioHamann\StatamicVisualEditor\AiChat\HouseStyle;
use MarioHamann\StatamicVisualEditor\DockGhost;
use MarioHamann\StatamicVisualEditor\DockGhost\Cases;
use MarioHamann\StatamicVisualEditor\DockGhost\Usage;
use MarioHamann\StatamicVisualEditor\SectionTemplate\Paths;
use MarioHamann\StatamicVisualEditor\SectionTypes;
use Statamic\Facades\Fieldset;

/**
 * Tries the grey text on this site before anyone types: real moments from
 * the newest sections (DockGhost\Cases) through the same request the dock
 * sends, and for each what came back next to what was actually written there,
 * how long it took, and what it cost.
 *
 * Each case is one paid request on the site's Anthropic key — a fraction of a
 * cent. The fields sent are the fieldset's own top level, where the dock
 * sends the Data button's rows; close enough to judge the suggestions by.
 *
 * `--edit` tries ⌘K once instead: the first <h2> of a section, rewritten to
 * an <h3> in the site's secondary colour — the stronger model, a few cents.
 */
class GhostTry extends Command
{
    protected $signature = 'sve:ghost-try
        {--count=6 : How many cases to send}
        {--section= : One section handle (hero/style_2) instead of the newest ones}
        {--edit : Try ⌘K once instead of the grey text}';

    protected $description = 'Send real cases from this site\'s sections to the HTML dock\'s AI and print the suggestions, the time and the cost.';

    public function handle(): int
    {
        if (DockGhost::apiKey() === '') {
            $this->error(__('sve::messages.dock_ghost_need_key'));

            return self::FAILURE;
        }

        if ($this->option('edit')) {
            return $this->tryEdit();
        }

        $cases = $this->cases();

        if ($cases === []) {
            $this->error('No section with a visual_edit tag or an opening tag to try.');

            return self::FAILURE;
        }

        $this->line('Model: '.DockGhost::model());

        $times = [];
        $costs = [];
        $hits = 0;

        foreach ($cases as $i => $case) {
            $out = DockGhost::complete([
                'before' => $case['before'],
                'after' => $case['after'],
                'section' => $case['section'],
                'fields' => $case['fields'],
            ]);

            $this->newLine();
            $this->line(sprintf('<info>%d. %s</info> · %s', $i + 1, $case['section'], $case['kind']));
            $this->line('   written:   '.$this->oneLine($case['expected']));

            if (! $out['ok']) {
                $this->line('   <error>failed:</error>   '.($out['message'] ?? ''));

                continue;
            }

            $cost = (float) Usage::cost(DockGhost::model(), $out['usage']);
            $times[] = $out['ms'];
            $costs[] = $cost;
            $hits += $this->same($out['text'], $case['expected']) ? 1 : 0;

            $this->line('   suggested: '.($out['text'] === '' ? '<comment>(nothing)</comment>' : $this->oneLine($out['text'])));
            $this->line(sprintf(
                '   %d ms · in %d, cached %d, cache write %d, out %d · $%.5f',
                $out['ms'],
                $out['usage']['input'] ?? 0,
                $out['usage']['cache_read'] ?? 0,
                $out['usage']['cache_write'] ?? 0,
                $out['usage']['output'] ?? 0,
                $cost,
            ));
        }

        if ($times !== []) {
            sort($times);

            $this->newLine();
            $this->line(sprintf(
                '<info>%d answered</info> · same as written: %d · median %d ms, slowest %d ms · average $%.5f a suggestion, $%.4f in all',
                count($times),
                $hits,
                $times[intdiv(count($times), 2)],
                end($times),
                array_sum($costs) / count($costs),
                array_sum($costs),
            ));
        }

        return self::SUCCESS;
    }

    /** ⌘K once: a section's first <h2> made an <h3> in the site's secondary colour. */
    protected function tryEdit(): int
    {
        $handle = trim((string) $this->option('section')) ?: (HouseStyle::newest()[0]['handle'] ?? '');
        $path = $handle !== '' ? Paths::path($handle) : null;
        $source = $path && is_file($path) ? (string) file_get_contents($path) : '';

        if (! preg_match('/<h2\b.*?<\/h2>/s', $source, $match, PREG_OFFSET_CAPTURE)) {
            $this->error('No <h2> to try ⌘K on'.($handle !== '' ? " in {$handle}." : '.'));

            return self::FAILURE;
        }

        [$selection, $at] = $match[0];
        $instruction = 'Make this an h3 in the site\'s secondary colour.';

        $this->line('Model: '.DockGhost::model('edit'));
        $this->line("<info>{$handle}</info> · ⌘K «{$instruction}»");
        $this->line('   selected:  '.$this->oneLine($selection));

        $out = DockGhost::edit([
            'instruction' => $instruction,
            'before' => substr($source, 0, $at),
            'selection' => $selection,
            'after' => substr($source, $at + strlen($selection)),
            'section' => $handle,
            'fields' => $this->fields($handle),
        ]);

        if (! $out['ok']) {
            $this->line('   <error>failed:</error>   '.($out['message'] ?? ''));

            return self::FAILURE;
        }

        $this->line('   rewritten: '.$this->oneLine($out['text']));
        $this->line(sprintf('   %d ms · $%.4f', $out['ms'], (float) Usage::cost(DockGhost::model('edit'), $out['usage'])));

        return self::SUCCESS;
    }

    /** @return list<array{section: string, kind: string, before: string, after: string, expected: string, fields: list<array>}> */
    protected function cases(): array
    {
        $only = trim((string) $this->option('section'));
        $handles = $only !== '' ? [$only] : array_column(HouseStyle::newest(), 'handle');
        $all = [];

        foreach ($handles as $handle) {
            $path = Paths::path($handle);
            $source = $path && is_file($path) ? (string) file_get_contents($path) : '';

            if ($source === '') {
                $this->warn("No partial for {$handle}.");

                continue;
            }

            $fields = $this->fields($handle);

            foreach (Cases::fromFile($handle, $source) as $case) {
                $all[] = $case + ['fields' => $fields];
            }
        }

        return Cases::mixed($all, max(1, (int) $this->option('count')));
    }

    /** The section's fieldset, top level — handle, type and label, as the Data rows carry them. */
    protected function fields(string $handle): array
    {
        $import = SectionTypes::fieldsetOf($handle);
        $fieldset = $import !== null ? Fieldset::find($import) : null;

        if (! $fieldset) {
            return [];
        }

        return $fieldset->fields()->all()->map(fn ($field) => [
            'var' => $field->handle(),
            'type' => $field->type(),
            'label' => (string) $field->display(),
        ])->values()->all();
    }

    protected function same(string $got, string $expected): bool
    {
        $norm = fn (string $text) => trim((string) preg_replace('/\s+/', ' ', $text));

        return $norm($got) !== '' && $norm($got) === $norm($expected);
    }

    protected function oneLine(string $text): string
    {
        $line = str_replace(["\r", "\n"], ['', '⏎'], $text);

        return mb_strlen($line) > 110 ? mb_substr($line, 0, 110).'…' : $line;
    }
}
