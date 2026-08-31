<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Contracts\Auth\User;
use Statamic\Facades\User as Users;

/**
 * Who may see each Live Preview toolbar icon (except Page settings).
 *
 * The site-wide feature toggles still decide whether a tool exists at all.
 * This decides *who* sees it when it does: everyone with CP access, super
 * admins, or named users and groups. Custom HTML defaults to super admins
 * so a customer who is also super does not get the disk-writing dock unless
 * you name them.
 */
class ToolbarAccess
{
    /** Toolbar icons this governs — not `panel`, which is always shown. */
    public const KEYS = [
        'pages',
        'globals',
        'sections',
        'listview',
        'outline',
        'html_tree',
        'template_dock',
        'ai_panel',
        'comments',
    ];

    public const AUDIENCE_EVERYONE = 'everyone';

    public const AUDIENCE_SUPER = 'super';

    public const AUDIENCE_PEOPLE = 'people';

    /** @var array<string, string> */
    public const DEFAULT_AUDIENCE = [
        'pages' => self::AUDIENCE_EVERYONE,
        'globals' => self::AUDIENCE_EVERYONE,
        'sections' => self::AUDIENCE_EVERYONE,
        'listview' => self::AUDIENCE_EVERYONE,
        'outline' => self::AUDIENCE_EVERYONE,
        'html_tree' => self::AUDIENCE_EVERYONE,
        'template_dock' => self::AUDIENCE_SUPER,
        'ai_panel' => self::AUDIENCE_EVERYONE,
        'comments' => self::AUDIENCE_EVERYONE,
    ];

    /**
     * May this user use the tool?
     *
     * The feature toggle is a separate door: a tool that is switched off on
     * the settings screen is off for everyone, and this method is not asked.
     */
    public static function allows(string $key, ?User $user = null): bool
    {
        if (! in_array($key, static::KEYS, true)) {
            return true;
        }

        $user ??= Users::current();

        if (! $user) {
            return false;
        }

        $rule = static::rule($key);

        return match ($rule['audience']) {
            self::AUDIENCE_SUPER => $user->isSuper(),
            self::AUDIENCE_PEOPLE => static::named($user, $rule['users'], $rule['groups']),
            default => true,
        };
    }

    /**
     * The saved rule for one icon, with defaults filled in.
     *
     * @return array{audience: string, users: list<string>, groups: list<string>}
     */
    public static function rule(string $key): array
    {
        $row = Features::setting("{$key}_access");

        if (! is_array($row)) {
            $blob = Features::setting('toolbar_access');
            $row = is_array($blob) ? ($blob[$key] ?? null) : null;
        }

        return static::normalizeRow($key, $row);
    }

    /**
     * Every icon's rule, for the settings field and for tests.
     *
     * @return array<string, array{audience: string, users: list<string>, groups: list<string>}>
     */
    public static function rules(): array
    {
        $out = [];

        foreach (static::KEYS as $key) {
            $out[$key] = static::rule($key);
        }

        return $out;
    }

    /**
     * @param  mixed  $row
     * @return array{audience: string, users: list<string>, groups: list<string>}
     */
    public static function normalizeRow(string $key, mixed $row): array
    {
        $audience = is_array($row) ? (string) ($row['audience'] ?? '') : '';

        if (! in_array($audience, [self::AUDIENCE_EVERYONE, self::AUDIENCE_SUPER, self::AUDIENCE_PEOPLE], true)) {
            $audience = static::DEFAULT_AUDIENCE[$key] ?? self::AUDIENCE_EVERYONE;
        }

        return [
            'audience' => $audience,
            'users' => static::strings(is_array($row) ? ($row['users'] ?? []) : []),
            'groups' => static::strings(is_array($row) ? ($row['groups'] ?? []) : []),
        ];
    }

    /**
     * @param  array<string, mixed>|null  $data
     * @return array<string, array{audience: string, users: list<string>, groups: list<string>}>
     */
    public static function normalize(?array $data): array
    {
        $out = [];

        foreach (static::KEYS as $key) {
            $out[$key] = static::normalizeRow($key, is_array($data) ? ($data[$key] ?? null) : null);
        }

        return $out;
    }

    /** @param  list<string>  $userIds  @param  list<string>  $groupHandles */
    protected static function named(User $user, array $userIds, array $groupHandles): bool
    {
        if ($userIds !== [] && in_array((string) $user->getAuthIdentifier(), $userIds, true)) {
            return true;
        }

        foreach ($groupHandles as $handle) {
            if ($handle !== '' && $user->isInGroup($handle)) {
                return true;
            }
        }

        return false;
    }

    /** @return list<string> */
    protected static function strings(mixed $value): array
    {
        return array_values(array_unique(array_filter(
            array_map('strval', (array) $value),
            fn ($item) => $item !== ''
        )));
    }
}
