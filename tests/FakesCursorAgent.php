<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\CursorAgent;
use Symfony\Component\Process\Process;

/**
 * The Cursor agent without Node: its own run(), with a process that prints
 * the runner's JSON line. What it was sent is kept in `$payloads`.
 */
trait FakesCursorAgent
{
    protected function fakeCursorAgent(string|array $answer): CursorAgent
    {
        $agent = new class extends CursorAgent
        {
            public static array $payloads = [];

            public static array $answer = [];

            protected static function process(array $payload, int $timeout): Process
            {
                static::$payloads[] = $payload;

                return new Process([PHP_BINARY, '-r', 'echo '.var_export(json_encode(static::$answer), true).';']);
            }
        };

        $agent::$payloads = [];
        $agent::$answer = is_array($answer) ? $answer : ['status' => 'finished', 'reply' => $answer];
        $this->app->instance(CursorAgent::class, $agent);

        return $agent;
    }
}
