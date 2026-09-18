<?php

namespace MarioHamann\StatamicVisualEditor\RenderProfile;

/**
 * Where one render spent its time, template by template.
 *
 * Every Antlers template that renders reports its wall time here. Because a
 * partial renders inside the template that called it, the time is booked
 * twice: inclusive (the template and everything it pulled in) and exclusive
 * (only its own lines and the tags on them). The exclusive column is the one
 * that answers "where does the time go" — the inclusive one says who to blame.
 */
final class Ledger
{
    /** @var list<float> one open frame per template still rendering: the child time it has accrued */
    protected array $stack = [];

    /** @var array<string, array{n: int, incl: float, excl: float}> keyed by template path */
    protected array $rows = [];

    public function open(): void
    {
        $this->stack[] = 0.0;
    }

    /** @param  float  $ms  how long this template took, children included */
    public function close(string $path, float $ms): void
    {
        $child = array_pop($this->stack) ?? 0.0;

        $row = $this->rows[$path] ?? ['n' => 0, 'incl' => 0.0, 'excl' => 0.0];
        $row['n']++;
        $row['incl'] += $ms;
        $row['excl'] += $ms - $child;
        $this->rows[$path] = $row;

        // The caller, if any, is still open: what we cost is part of its children.
        if ($this->stack !== []) {
            $this->stack[count($this->stack) - 1] += $ms;
        }
    }

    public function reset(): void
    {
        $this->stack = [];
        $this->rows = [];
    }

    /** @return array<string, array{n: int, incl: float, excl: float}> */
    public function rows(): array
    {
        return $this->rows;
    }
}
