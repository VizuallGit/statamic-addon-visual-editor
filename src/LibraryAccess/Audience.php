<?php

namespace MarioHamann\StatamicVisualEditor\LibraryAccess;

use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Facades\User;

/**
 * Who the limit covers: everyone, or only the roles named on the settings
 * screen.
 * Moved verbatim out of LibraryAccess in WP7d.
 */
final class Audience
{
    /** Which users it applies to: everyone, or only the roles named below. */
    public const SCOPE = 'library_in_use_only_scope';

    /** The roles it applies to, when the audience is not everyone. */
    public const ROLES = 'library_in_use_only_roles';

    /**
     * Does the limit cover this user?
     *
     * With no user there is nobody to limit — the library is a Control Panel
     * screen, and everything reaching this is behind its auth.
     */
    public static function appliesTo(?\Statamic\Contracts\Auth\User $user): bool
    {
        if (! $user) {
            return false;
        }

        if (static::audience() === 'everyone') {
            return true;
        }

        $roles = static::roles();

        if ($roles === []) {
            return false; // "certain roles", none named — nothing to apply to
        }

        /*
         * Roles rather than groups on purpose. Statamic's `roles()` merges the
         * ones a user was given directly with the ones their groups carry, so
         * naming a role catches a user however they came by it. Naming a group
         * would miss anyone holding the role without being in it.
         */
        return $user->roles()
            ->map(fn ($role) => $role->handle())
            ->intersect($roles)
            ->isNotEmpty();
    }

    /**
     * Who the limit covers: 'everyone', or 'roles' for only the ones named on
     * the settings screen. Not `scope()` — that name is taken, by the field
     * sections live in, and the two would be a confusing pair to keep apart.
     */
    public static function audience(): string
    {
        return Features::setting(static::SCOPE, 'everyone') === 'roles'
            ? 'roles'
            : 'everyone';
    }

    /** The role handles the limit applies to. */
    public static function roles(): array
    {
        return Scan::strings(Features::setting(static::ROLES, []));
    }
}
