<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\ClaudeAgent;
use MarioHamann\StatamicVisualEditor\CursorAgent;
use Symfony\Component\Process\Process;

/**
 * The Cursor agent — or the Claude runner — without Node: its own run(), with
 * a process that prints the runner's JSON line. What it was sent is kept in
 * `$payloads`.
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

    /** The same for the Claude runner (ClaudeAgent): its run(), without Node or the network. */
    protected function fakeClaudeAgent(string|array $answer): ClaudeAgent
    {
        $agent = new class extends ClaudeAgent
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
        $this->app->instance(ClaudeAgent::class, $agent);

        return $agent;
    }
}
