<?php

namespace MarioHamann\StatamicVisualEditor\RenderProfile;

use Illuminate\Contracts\View\Engine;

/**
 * The Antlers view engine with a stopwatch around every template.
 *
 * Wraps the real engine rather than replacing it: Statamic's engine does the
 * rendering exactly as it always does, and this only notes when each template
 * started and stopped. Installed for one profiled render and taken out again.
 */
final class TimedEngine implements Engine
{
    public function __construct(protected Engine $inner, protected Ledger $ledger)
    {
    }

    public function get($path, array $data = [])
    {
        $started = hrtime(true);
        $this->ledger->open();

        try {
            return $this->inner->get($path, $data);
        } finally {
            $this->ledger->close($path, (hrtime(true) - $started) / 1e6);
        }
    }
}
