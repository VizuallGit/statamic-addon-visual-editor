<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\ComponentProps;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\PropFields;
use Statamic\Facades\User;

/**
 * A component's fields as a publish form, and the way back out.
 *
 * `show` hands the panel everything a Control Panel form needs — the fields,
 * their values, their meta — so rich text arrives as Bard, a picture as the
 * asset browser, a link as the page picker. `store` is the other direction:
 * what the form now holds, turned back into the strings the partial call
 * carries.
 *
 * Two calls rather than one because the conversions are Statamic's own and
 * belong on the server. Doing them in the browser would mean rebuilding
 * Bard's HTML writer and the asset lookup in JavaScript, and getting them
 * subtly wrong.
 */
class PropFieldsController
{
    public function show(Request $request)
    {
        $props = $this->props($request);
        $values = $this->values($request);

        if ($props === []) {
            return response()->json(['blueprint' => null, 'fields' => [], 'values' => [], 'meta' => []]);
        }

        $blueprint = PropFields::blueprint($props);
        $raw = [];

        foreach ($props as $prop) {
            $raw[$prop['handle']] = PropFields::toPublish($prop, (string) ($values[$prop['handle']] ?? ''));
        }

        $fields = $blueprint->fields()->addValues($raw)->preProcess();
        $publish = $blueprint->toPublishArray();

        return response()->json([
            'blueprint' => $publish,
            // The one section's fields, flat: the panel draws a list, not tabs.
            'fields' => $publish['tabs'][0]['sections'][0]['fields'] ?? [],
            'values' => $fields->values()->all(),
            'meta' => $fields->meta()->all(),
        ]);
    }

    public function store(Request $request)
    {
        $props = $this->props($request);
        $values = $request->input('values');
        $values = is_array($values) ? $values : [];

        $params = [];

        foreach ($props as $prop) {
            // Only what the form actually sent. A field the panel never drew
            // must not be emptied by a save that says nothing about it.
            if (! array_key_exists($prop['handle'], $values)) {
                continue;
            }

            $params[$prop['handle']] = PropFields::toParam($prop, $values[$prop['handle']]);
        }

        return response()->json(['params' => $params]);
    }

    /**
     * What the component declares. Read from its own file, never from the
     * request: the request says which component, not what it is allowed to be.
     *
     * `handle` narrows it to one field — the panel that edits a single
     * default asks for that one rather than the whole form. `display` renames
     * the label for the same reason: in that panel the field's own name is
     * already on the card above it, and what is being edited is the default.
     */
    protected function props(Request $request): array
    {
        abort_unless(User::current(), 403);
        abort_unless(Features::allows('template_dock'), 403);
        abort_unless(Features::enabled('component_props'), 403);

        $src = ltrim((string) ($request->input('src') ?? $request->query('src', '')), '/');
        $props = ComponentProps::forView('partials/'.$src);

        $handle = (string) ($request->input('handle') ?? $request->query('handle', ''));

        if ($handle !== '') {
            $props = array_values(array_filter($props, fn ($prop) => $prop['handle'] === $handle));
        }

        $display = trim((string) ($request->input('display') ?? $request->query('display', '')));

        if ($display !== '') {
            $props = array_map(fn ($prop) => ['label' => mb_substr($display, 0, 60)] + $prop, $props);
        }

        return $props;
    }

    protected function values(Request $request): array
    {
        $values = $request->query('values');

        return is_array($values) ? $values : [];
    }
}
