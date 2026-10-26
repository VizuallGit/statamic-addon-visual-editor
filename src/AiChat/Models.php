<?php

namespace MarioHamann\StatamicVisualEditor\AiChat;

use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\AiChat;
use MarioHamann\StatamicVisualEditor\AiProvider;
use MarioHamann\StatamicVisualEditor\CursorAgent;

/**
 * The models in the AI panel's picker: Auto, and the newest of each family
 * the site's Cursor account can use — not every model Cursor has ever had.
 *
 * Read from Cursor's own list, so a new version takes its family's place by
 * itself: when Grok 4.8 appears, Grok 4.7 leaves the picker. Older versions,
 * Mini/Nano and makers outside the families are left out. Cursor is asked
 * once an hour per key; the choosing happens after the cache, so a change
 * here shows at once.
 */
final class Models
{
    public const CACHE_SECONDS = 3600;

    /** Cursor's own router — it picks the model for each request. */
    public const AUTO = 'default';

    /**
     * [group, pattern] in picker order. `v` is the version; `line` splits a
     * family whose lines each keep their newest (Claude's Opus, Fable, Sonnet
     * and Haiku; Gemini's Pro and Flash). Every model of the newest version
     * stays, so GPT-5.6 Sol, Terra and Luna are all there.
     */
    private const FAMILIES = [
        ['Cursor', '/^composer-(?<v>\d+(?:\.\d+)*)$/'],
        ['Claude', '/^claude-(?<line>opus|fable|sonnet|haiku)-(?<v>\d+(?:-\d+)*)$/'],
        ['GPT', '/^gpt-(?<v>\d+(?:\.\d+)*)(?:-(?!mini$|nano$|codex$)[a-z]+)?$/'],
        ['GPT', '/^gpt-(?<v>\d+(?:\.\d+)*)-codex$/'],
        ['Grok', '/^grok-(?<v>\d+(?:\.\d+)*)$/'],
        ['Gemini', '/^gemini-(?<v>\d+(?:\.\d+)*)-(?<line>pro|flash)$/'],
    ];

    /**
     * @return list<array{id: string, name: string, group: string}>
     */
    public static function all(): array
    {
        // On Claude the picker is Claude's own models; Cursor's list is not asked for.
        if (AiProvider::claude()) {
            return AiProvider::claudeModels();
        }

        $key = 'sve-ai-models-listed:'.sha1(AiChat::apiKey());

        return static::modern(Cache::remember($key, static::CACHE_SECONDS, fn () => CursorAgent::models()));
    }

    /**
     * Auto first, then the newest of each family, in Cursor's own order
     * within a family.
     *
     * @param  list<array{id: string, name: string}>  $models
     * @return list<array{id: string, name: string, group: string}>
     */
    public static function modern(array $models): array
    {
        $rows = [];
        $newest = [];

        foreach ($models as $at => $model) {
            foreach (static::FAMILIES as $family => [$group, $pattern]) {
                if (! preg_match($pattern, $model['id'], $match)) {
                    continue;
                }

                $line = $family.':'.($match['line'] ?? '');
                $version = str_replace('-', '.', $match['v']);
                $rows[] = ['id' => $model['id'], 'name' => $model['name'], 'group' => $group, 'line' => $line, 'version' => $version, 'order' => [$family, $at]];

                if (! isset($newest[$line]) || version_compare($version, $newest[$line], '>')) {
                    $newest[$line] = $version;
                }

                break;
            }
        }

        $rows = array_filter($rows, fn ($row) => $row['version'] === $newest[$row['line']]);
        usort($rows, fn ($a, $b) => $a['order'] <=> $b['order']);

        $out = array_map(fn ($row) => ['id' => $row['id'], 'name' => $row['name'], 'group' => $row['group']], array_values($rows));

        foreach ($models as $model) {
            if ($model['id'] === static::AUTO) {
                array_unshift($out, ['id' => static::AUTO, 'name' => $model['name'] ?: 'Auto', 'group' => 'Auto']);

                break;
            }
        }

        return $out;
    }
}
