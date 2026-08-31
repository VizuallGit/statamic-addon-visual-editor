<?php

namespace MarioHamann\StatamicVisualEditor;

use Illuminate\Http\Request;
use Statamic\Contracts\Data\Augmentable;

/**
 * Live Preview: render only the page section that is being edited.
 *
 * The iframe already morphs that one `data-sid`. This trims `page_sections` so
 * the server does not render the neighbours (gallery, globals, …). Reorder,
 * theme and site settings send no `sve_sid` and still get the whole page.
 *
 * Public requests never match `isLivePreview()`, so half/full static cache is
 * untouched. Live Preview itself uses the null cacher.
 */
class LivePreviewSectionScope
{
    public const QUERY = 'sve_sid';

    /**
     * @return list<string>
     */
    public static function idsFromRequest(Request $request): array
    {
        $raw = (string) $request->query(self::QUERY, '');

        if ($raw === '') {
            return [];
        }

        return array_values(array_filter(
            array_map('trim', explode(',', $raw)),
            fn ($id) => $id !== ''
        ));
    }

    /**
     * @param  list<array<string, mixed>>  $rows
     * @param  list<string>  $ids
     * @return list<array<string, mixed>>
     */
    public static function matchingRows(array $rows, array $ids): array
    {
        $want = [];

        foreach ($ids as $id) {
            if (is_string($id) && $id !== '') {
                $want[$id] = true;
            }
        }

        if ($want === []) {
            return [];
        }

        $matched = [];

        foreach ($rows as $row) {
            if (! is_array($row)) {
                continue;
            }

            foreach (['id', '_id', '_visual_id'] as $key) {
                $value = $row[$key] ?? null;

                if (is_string($value) && isset($want[$value])) {
                    $matched[] = $row;

                    break;
                }
            }
        }

        return $matched;
    }

    /**
     * @param  list<string>  $ids
     */
    public static function limitCascade(object $cascade, array $ids): void
    {
        if ($ids === []) {
            return;
        }

        $field = (string) config('statamic-visual-editor.previews.field', 'page_sections');
        $content = $cascade->content();

        if (! is_object($content) || ! method_exists($content, 'get') || ! method_exists($content, 'set')) {
            return;
        }

        $rows = $content->get($field);

        if (! is_array($rows)) {
            return;
        }

        $filtered = self::matchingRows($rows, $ids);

        if (count($filtered) !== 1) {
            return;
        }

        $content->set($field, $filtered);

        if ($content instanceof Augmentable) {
            $cascade->set($field, $content->augmentedValue($field));

            return;
        }

        $cascade->set($field, $filtered);
    }
}
