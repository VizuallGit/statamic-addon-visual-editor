<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

use MarioHamann\StatamicVisualEditor\ToolbarAccess;
use Statamic\Facades\User;
use Statamic\Facades\UserGroup;
use Statamic\Fields\Fieldtype;

/**
 * Who may see one Live Preview toolbar icon.
 *
 * Nested under that tool's toggle on the settings screen, in the toggle's
 * own row — not a second heading. Unsaved (null) follows the defaults:
 * Custom HTML is super admins, the rest are everyone.
 */
class ToolbarAccessFieldtype extends Fieldtype
{
    protected $selectable = false;

    protected static $handle = 'toolbar_access';

    public function component(): string
    {
        return 'toolbar-access';
    }

    protected function configFieldItems(): array
    {
        return [
            'tool' => [
                'display' => 'Tool',
                'type' => 'select',
                'options' => array_combine(ToolbarAccess::KEYS, ToolbarAccess::KEYS),
                'default' => 'pages',
            ],
        ];
    }

    public function preload(): array
    {
        $tool = $this->tool();

        return [
            'users' => User::all()
                ->map(fn ($user) => [
                    'id' => (string) $user->id(),
                    'name' => trim((string) ($user->name() ?: $user->email() ?: $user->id())),
                    'email' => (string) $user->email(),
                ])
                ->sortBy('name', SORT_NATURAL | SORT_FLAG_CASE)
                ->values()
                ->all(),
            'groups' => UserGroup::all()
                ->map(fn ($group) => [
                    'handle' => $group->handle(),
                    'title' => $group->title() ?: $group->handle(),
                ])
                ->sortBy('title', SORT_NATURAL | SORT_FLAG_CASE)
                ->values()
                ->all(),
            'tool' => $tool,
            'default_audience' => ToolbarAccess::DEFAULT_AUDIENCE[$tool] ?? ToolbarAccess::AUDIENCE_EVERYONE,
        ];
    }

    public function preProcess($data)
    {
        $tool = $this->tool();

        if (is_array($data) && ! array_key_exists('audience', $data) && isset($data[$tool]) && is_array($data[$tool])) {
            $data = $data[$tool];
        }

        return ToolbarAccess::normalizeRow($tool, is_array($data) ? $data : null);
    }

    public function process($data)
    {
        return ToolbarAccess::normalizeRow($this->tool(), is_array($data) ? $data : null);
    }

    protected function tool(): string
    {
        $tool = (string) $this->config('tool', 'pages');

        return in_array($tool, ToolbarAccess::KEYS, true) ? $tool : 'pages';
    }
}
