<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\DataVars;
use Statamic\Facades\User;

/**
 * The variable picker's catalogue: this section, this page, this site.
 *
 * Read-only. Global values come back as they are stored — the editor is
 * standing in the Control Panel looking at them anyway.
 */
class DataVarsController
{
    public function __invoke(Request $request)
    {
        abort_unless(User::current(), 403);

        $request->validate([
            'collection' => ['nullable', 'string'],
            'set' => ['nullable', 'string'],
            'view' => ['nullable', 'string'],
            'kind' => ['nullable', 'string'],
            'scope' => ['nullable', 'string', 'max:400'],
        ]);

        $collection = (string) $request->query('collection', '');
        $set = (string) $request->query('set', '');
        $view = (string) $request->query('view', '');
        $kind = (string) $request->query('kind', '');

        $page = [];

        if ($collection !== '') {
            $fields = DataVars::collectionFields($collection);

            if ($fields) {
                $page[] = ['handle' => $collection, 'label' => __('sve::messages.data_vars_this_page'), 'items' => $fields];
            }
        }

        $page[] = [
            'handle' => 'core',
            'label' => __('sve::messages.data_vars_core'),
            'items' => DataVars::pageCore(),
        ];

        // A collection view loops over entries that are not this page's own, so
        // its fields belong here too — that is the whole reason to open one.
        if ($view !== '' && $view !== $collection) {
            $fields = DataVars::collectionFields($view);

            if ($fields) {
                $page[] = array_filter([
                    'handle' => $view,
                    'label' => __('sve::messages.data_vars_collection', ['handle' => $view]),
                    'items' => $fields,
                    // A `show` view already *is* one entry — its fields print
                    // straight out. An index view has to loop to reach them.
                    'loop' => $kind === 'show' ? null : 'collection:'.$view,
                ]);
            }
        }

        return response()->json([
            'scope' => $this->scope($collection, $set, (string) $request->query('scope', '')),
            'section' => $collection !== '' && $set !== ''
                ? DataVars::sectionFields($collection, $set)
                : [],
            'page' => $page,
            'site' => array_merge(DataVars::globals(), [[
                'handle' => 'system',
                'label' => __('sve::messages.data_vars_system'),
                'items' => DataVars::systemVars(),
            ]]),
        ]);
    }

    /**
     * The loops the cursor stands inside, and what they put in reach.
     *
     * Sent as one value — `collection:services|field:gallery`, outermost first —
     * because it is one thing: where in the template you are. An unreadable step
     * is dropped rather than guessed at, and a chain that leads nowhere with
     * fields comes back null, so the menu keeps the tabs it always had.
     *
     * @return array{label: string, groups: list<array<string, mixed>>}|null
     */
    protected function scope(string $collection, string $set, string $raw): ?array
    {
        $chain = $this->chain($raw);

        if (! $chain) {
            return null;
        }

        $found = DataVars::scopeFields($collection, $set, $chain);

        if (! $found) {
            return null;
        }

        $groups = [];

        if ($found['items']) {
            $groups[] = ['handle' => 'scope', 'label' => $found['label'], 'items' => $found['items']];
        }

        if ($found['core']) {
            $groups[] = [
                'handle' => 'core',
                'label' => __('sve::messages.data_vars_core'),
                'items' => $found['core'],
            ];
        }

        if (! $groups) {
            return null;
        }

        // One group needs no heading over it — the tab already carries the name.
        if (count($groups) === 1) {
            $groups[0]['bare'] = true;
        }

        return ['label' => $found['label'], 'groups' => $groups];
    }

    /**
     * `collection:services|field:gallery` read back into steps.
     *
     * @return list<array{kind: string, handle: string}>
     */
    protected function chain(string $raw): array
    {
        $out = [];

        foreach (explode('|', $raw) as $step) {
            [$kind, $handle] = array_pad(explode(':', $step, 2), 2, '');
            $handle = trim($handle);

            if ($handle !== '' && in_array($kind, ['collection', 'field'], true)) {
                $out[] = ['kind' => $kind, 'handle' => $handle];
            }
        }

        return $out;
    }
}
