<?php

namespace MarioHamann\StatamicVisualEditor;

use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Yaml\Yaml;

/**
 * What a component says about itself: its category and its description.
 *
 * One file for the site, by component name, beside the editor's other site
 * files. Nothing here renders: the component file stays what it was, so the
 * dock's reading and writing of it is untouched. A component with neither has
 * no entry.
 */
final class ComponentMeta
{
    private const CATEGORY_MAX = 60;

    private const DESCRIPTION_MAX = 1000;

    public static function path(): string
    {
        return resource_path('visual-editor/components.yaml');
    }

    /**
     * @return array<string, array{category: string, description: string}>
     */
    public static function all(): array
    {
        try {
            return self::read();
        } catch (ParseException $e) {
            report($e);

            return [];
        }
    }

    /**
     * @return array{category: string, description: string}
     */
    public static function save(string $name, string $category, string $description): array
    {
        // A file that does not parse throws here: writing would lose every entry in it.
        $all = self::read();
        $entry = [
            'category' => self::clean($category, self::CATEGORY_MAX),
            'description' => mb_substr(trim($description), 0, self::DESCRIPTION_MAX),
        ];

        if ($entry['category'] === '' && $entry['description'] === '') {
            unset($all[$name]);
        } else {
            $all[$name] = $entry;
        }

        ksort($all, SORT_NATURAL);

        $dir = dirname(self::path());

        if (! is_dir($dir)) {
            mkdir($dir, 0775, true);
        }

        file_put_contents(self::path(), Yaml::dump($all, 3, 2, Yaml::DUMP_MULTI_LINE_LITERAL_BLOCK), LOCK_EX);

        return $entry;
    }

    /**
     * @return array<string, array{category: string, description: string}>
     */
    private static function read(): array
    {
        if (! is_file(self::path())) {
            return [];
        }

        $parsed = Yaml::parse((string) file_get_contents(self::path()));
        $out = [];

        foreach (is_array($parsed) ? $parsed : [] as $name => $entry) {
            $out[(string) $name] = [
                'category' => (string) ($entry['category'] ?? ''),
                'description' => (string) ($entry['description'] ?? ''),
            ];
        }

        return $out;
    }

    /** One line: a category is a word to choose and search by. */
    private static function clean(string $text, int $max): string
    {
        return mb_substr(trim((string) preg_replace('/\s+/', ' ', $text)), 0, $max);
    }
}
