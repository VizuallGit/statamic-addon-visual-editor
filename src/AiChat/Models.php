<?php

namespace MarioHamann\StatamicVisualEditor\AiChat;

use Illuminate\Support\Facades\Cache;
use MarioHamann\StatamicVisualEditor\AiChat;
use MarioHamann\StatamicVisualEditor\CursorAgent;

/**
 * The models in the AI panel's picker: whatever the site's Cursor account can
 * use, as Cursor lists it — so a new model appears without an update here.
 * Asked once an hour per key; grouped by maker for the picker.
 */
final class Models
{
    public const CACHE_SECONDS = 3600;

    /** Picker groups, in this order; a model whose id fits none is "Other". */
    private const GROUPS = [
        'auto' => ['Auto', '/^default$/'],
        'cursor' => ['Cursor', '/^composer-/'],
        'claude' => ['Claude', '/^claude-/'],
        'gpt' => ['GPT', '/^(gpt-|o\d)/'],
        'grok' => ['Grok', '/^grok-/'],
        'gemini' => ['Gemini', '/^gemini-/'],
    ];

    /**
     * @return list<array{id: string, name: string, group: string}>
     */
    public static function all(): array
    {
        $key = 'sve-ai-models:'.sha1(AiChat::apiKey());

        return Cache::remember($key, static::CACHE_SECONDS, fn () => static::grouped(CursorAgent::models()));
    }

    /**
     * @param  list<array{id: string, name: string}>  $models
     * @return list<array{id: string, name: string, group: string}>
     */
    public static function grouped(array $models): array
    {
        $order = array_flip(array_merge(array_column(static::GROUPS, 0), ['Other']));
        $out = [];

        foreach ($models as $at => $model) {
            $group = 'Other';

            foreach (static::GROUPS as [$name, $pattern]) {
                if (preg_match($pattern, $model['id'])) {
                    $group = $name;

                    break;
                }
            }

            $out[] = ['id' => $model['id'], 'name' => $model['name'], 'group' => $group, 'at' => $at];
        }

        // By group, and within a group in Cursor's own order (newest first).
        usort($out, fn ($a, $b) => [$order[$a['group']], $a['at']] <=> [$order[$b['group']], $b['at']]);

        return array_map(fn ($row) => ['id' => $row['id'], 'name' => $row['name'], 'group' => $row['group']], $out);
    }
}
