<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\PropFields;
use Statamic\Facades\User;

/**
 * An element's own address as the Control Panel's own field — Visual Build's
 * Content for an image, a video and a link.
 *
 * The same two halves as a component's fields (PropFieldsController), on the
 * same conversions (PropFields): `show` hands the panel the field with the
 * element's address in it — an image as the asset browser, a link as the page
 * picker — and `store` turns what the field now holds back into the string the
 * attribute carries: an asset's URL, a page's URL.
 *
 * Which field an element gets is decided here, from its tag, never from the
 * request: the request says which element, not what it may be.
 */
class ElementFieldsController
{
    /** The tags with an address of their own, and the field each is drawn as. */
    public const FIELDS = [
        'img' => ['handle' => 'src', 'type' => 'media'],
        'video' => ['handle' => 'src', 'type' => 'media'],
        'a' => ['handle' => 'href', 'type' => 'link'],
    ];

    public function show(Request $request)
    {
        $prop = $this->prop($request);

        if (! $prop) {
            return response()->json(['blueprint' => null, 'fields' => [], 'values' => [], 'meta' => []]);
        }

        $blueprint = PropFields::blueprint([$prop]);
        $fields = $blueprint->fields()
            ->addValues([$prop['handle'] => PropFields::toPublish($prop, $prop['default'])])
            ->preProcess();
        $publish = $blueprint->toPublishArray();

        return response()->json([
            'blueprint' => $publish,
            'fields' => $publish['tabs'][0]['sections'][0]['fields'] ?? [],
            'values' => $fields->values()->all(),
            'meta' => $fields->meta()->all(),
        ]);
    }

    public function store(Request $request)
    {
        $prop = $this->prop($request);

        abort_unless($prop !== null, 422);

        $values = $request->input('values');
        $values = is_array($values) ? $values : [];

        return response()->json(['value' => PropFields::toParam($prop, $values[$prop['handle']] ?? null)]);
    }

    /**
     * The field for the element's tag. `value` is the address the element had
     * when the field was opened: it is the field's start, and — as a
     * component's default does — it says which asset container an image is
     * browsed and looked up in, the same on the way in and on the way out.
     */
    protected function prop(Request $request): ?array
    {
        abort_unless(User::current(), 403);
        abort_unless(Features::allows('build_mode'), 403);

        $field = self::FIELDS[strtolower((string) $request->input('tag', ''))] ?? null;

        if (! $field) {
            return null;
        }

        return $field + [
            'label' => mb_substr(trim((string) $request->input('display', '')), 0, 60),
            'default' => trim((string) $request->input('value', '')),
        ];
    }
}
