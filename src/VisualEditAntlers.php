<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * Reads `{{ visual_edit }}` tags out of a section partial so a new list can
 * be filled before its `<ul>` exists in the preview.
 *
 * `template="3:item"` lives on the insertable container; `template="icon|title"`
 * lives on the orderable row. The row tag is not rendered while the list is
 * empty, so the container also needs that inner template — copied here from
 * the Antlers file, which is the source of truth.
 */
class VisualEditAntlers
{
    /**
     * @return array{template: string, rowTemplate: string}
     */
    public static function forField(string $source, string $field): array
    {
        $empty = ['template' => '', 'rowTemplate' => ''];
        $tags = static::tags($source);
        $count = count($tags);

        for ($i = 0; $i < $count; $i++) {
            $tag = $tags[$i];

            if (($tag['field'] ?? '') !== $field || empty($tag['insertable'])) {
                continue;
            }

            $rowTemplate = '';

            for ($j = $i + 1; $j < $count; $j++) {
                if (! empty($tags[$j]['insertable'])) {
                    break;
                }

                if (! empty($tags[$j]['orderable']) && ($tags[$j]['template'] ?? '') !== '') {
                    $rowTemplate = $tags[$j]['template'];
                    break;
                }
            }

            return [
                'template' => $tag['template'] ?? '',
                'rowTemplate' => $rowTemplate,
            ];
        }

        return $empty;
    }

    /**
     * @return array{template: string, rowTemplate: string, fields: array<string, array{template: string, rowTemplate: string}>}
     */
    public static function section(string $handle): array
    {
        $empty = ['template' => '', 'rowTemplate' => '', 'fields' => []];
        $relative = str_replace('.', '/', $handle);
        $path = resource_path("views/partials/page_sections/{$relative}.antlers.html");

        if ($handle === '' || ! is_file($path)) {
            return $empty;
        }

        $source = (string) file_get_contents($path);
        $tags = static::tags($source);
        $template = '';
        $fields = [];

        foreach ($tags as $tag) {
            if ($template === '' && ! empty($tag['section_orderable']) && ($tag['template'] ?? '') !== '') {
                $template = $tag['template'];
            }

            $field = $tag['field'] ?? '';

            if ($field !== '' && ! empty($tag['insertable']) && ! isset($fields[$field])) {
                $fields[$field] = static::forField($source, $field);
            }
        }

        return [
            'template' => $template,
            'rowTemplate' => '',
            'fields' => $fields,
        ];
    }

    /**
     * @return array{template: string, rowTemplate: string}
     */
    public static function fromSection(string $handle, string $field): array
    {
        $relative = str_replace('.', '/', $handle);
        $path = resource_path("views/partials/page_sections/{$relative}.antlers.html");

        if ($handle === '' || $field === '' || ! is_file($path)) {
            return ['template' => '', 'rowTemplate' => ''];
        }

        return static::forField((string) file_get_contents($path), $field);
    }

    /**
     * @return list<array<string, string>>
     */
    public static function tags(string $source): array
    {
        preg_match_all('/\{\{\s*visual_edit\s+((?:(?!\}\}).)+)\}\}/s', $source, $matches);

        return array_map([static::class, 'params'], $matches[1] ?? []);
    }

    /**
     * @return array<string, string>
     */
    protected static function params(string $raw): array
    {
        $out = [];

        if (! preg_match_all('/(\w+)=(?:"([^"]*)"|\'([^\']*)\')/', $raw, $matches, PREG_SET_ORDER)) {
            return $out;
        }

        foreach ($matches as $match) {
            $out[$match[1]] = $match[2] !== '' ? $match[2] : $match[3];
        }

        return $out;
    }
}
