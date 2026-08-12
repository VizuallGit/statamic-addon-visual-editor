<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Collection;
use Statamic\Facades\Entry;
use Statamic\Facades\User;
use Statamic\Facades\YAML;

/**
 * Limits the section library to what the site already uses.
 *
 * A site's design is the set of sections it actually has. Left open, the library
 * invites an editor to reach past that — a hero style nothing else on the site
 * uses, a template built for a page that was never made. This narrows the four
 * tabs to what a scan found in the pages, for everyone except a super admin.
 *
 * The scan is deliberately a *snapshot*, taken when somebody presses the button
 * on the settings screen, not a live query. Two reasons: sweeping every entry is
 * far too expensive to do while a panel is opening, and — more to the point — a
 * live answer would quietly widen as pages change. Whoever runs the site decides
 * when the list moves.
 *
 * Two of the four tabs cannot be scanned, and are answered by inference instead:
 *
 * - Section types and global sections leave a trace in the page. A type is a
 *   Replicator set handle, a global section an entry id in a `global_section`
 *   row, and both are found by walking the tree (see SectionUsage, which walks
 *   the same shape looking for one target rather than collecting all of them).
 * - Custom sections and templates are *copied* on insert. What lands in the page
 *   is an ordinary section row of the underlying type, with no mark saying where
 *   it came from — nothing to scan for. So they are judged by what they are made
 *   of: a custom section is offered when its own section type is in use, and a
 *   template when every section in it is. The intent survives — an editor still
 *   cannot introduce a design the site does not already have.
 */
class LibraryAccess
{
    /** The settings toggle this hangs on. */
    public const FEATURE = 'library_in_use_only';

    /** Which users it applies to: everyone, or only the roles named below. */
    public const SCOPE = 'library_in_use_only_scope';

    /** The roles it applies to, when the audience is not everyone. */
    public const ROLES = 'library_in_use_only_roles';

    /** Cached per request: the snapshot is read from disk. */
    protected static ?array $snapshot = null;

    /** Cached per request: asked once per section type, so worth settling. */
    protected static ?bool $locked = null;

    /**
     * Is the library limited for whoever is asking?
     *
     * Three things decide it, and the second is the safety catch: with the
     * toggle on but no scan ever taken, there is no list to limit *to*, and
     * enforcing an empty one would leave an editor staring at four empty tabs.
     * An un-scanned site is therefore an open one, and the settings screen says
     * so rather than letting it pass unnoticed.
     *
     * The third is who it applies to. Being a super admin is deliberately no
     * exemption on its own: applying the limit to everyone is how the person who
     * configured it can see what an editor sees, without making a second account
     * to check with. Nobody can be locked out by it either way — the setting
     * lives on a screen it does not govern.
     */
    public static function locked(): bool
    {
        if (static::$locked !== null) {
            return static::$locked;
        }

        if (! Features::enabled(static::FEATURE) || ! static::scanned()) {
            return static::$locked = false;
        }

        return static::$locked = static::appliesTo(User::current());
    }

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
        return static::strings(Features::setting(static::ROLES, []));
    }

    /** Has a scan ever been taken? */
    public static function scanned(): bool
    {
        return static::snapshot()['scanned_at'] !== null;
    }

    /** May this section type be offered? */
    public static function allowsType(string $handle): bool
    {
        if (! static::locked()) {
            return true;
        }

        return in_array($handle, static::snapshot()['types'], true);
    }

    /** May this global (synced) section be offered? */
    public static function allowsGlobal(string $id): bool
    {
        if (! static::locked()) {
            return true;
        }

        return in_array($id, static::snapshot()['globals'], true);
    }

    /**
     * May a copy-on-insert item — a custom section or a template — be offered?
     *
     * Every row in it has to be something the site already uses. An empty one is
     * refused: it would insert nothing, and there is no design in it to approve.
     */
    public static function allowsSections(array $sections): bool
    {
        if (! static::locked()) {
            return true;
        }

        if ($sections === []) {
            return false;
        }

        $set = static::globalSet();

        foreach ($sections as $section) {
            $type = (string) ($section['type'] ?? '');

            if ($type === '') {
                return false;
            }

            // A template is allowed to hold a global section — then it is that
            // section's own availability that decides, not a set handle which is
            // never recorded as a type.
            if ($type === $set) {
                foreach (array_map('strval', (array) ($section[$set] ?? [])) as $id) {
                    if (! static::allowsGlobal($id)) {
                        return false;
                    }
                }

                continue;
            }

            if (! static::allowsType($type)) {
                return false;
            }
        }

        return true;
    }

    /**
     * The snapshot as it sits on disk.
     *
     * @return array{scanned_at: ?string, scanned_by: ?string, types: array<int, string>, globals: array<int, string>}
     */
    public static function snapshot(): array
    {
        if (static::$snapshot !== null) {
            return static::$snapshot;
        }

        $path = static::path();

        $data = is_file($path)
            ? (YAML::parse(file_get_contents($path)) ?: [])
            : [];

        return static::$snapshot = [
            'scanned_at' => $data['scanned_at'] ?? null,
            'scanned_by' => $data['scanned_by'] ?? null,
            'types' => static::strings($data['types'] ?? []),
            'globals' => static::strings($data['globals'] ?? []),
        ];
    }

    /**
     * Sweeps every page and writes down what it found.
     *
     * The editor's own stores are skipped. A saved section is a library item, not
     * a page — count it and every custom section would vouch for itself, which
     * would make the whole list say yes to everything.
     *
     * @return array{scanned_at: string, scanned_by: ?string, types: array<int, string>, globals: array<int, string>}
     */
    public static function scan(): array
    {
        $scope = static::scope();
        $set = static::globalSet();
        $skip = static::stores();

        $types = [];
        $globals = [];

        foreach (Collection::handles() as $handle) {
            if (in_array($handle, $skip, true)) {
                continue;
            }

            foreach (Entry::query()->where('collection', $handle)->get() as $entry) {
                static::walk($entry->data()->all(), $scope, $set, $types, $globals);
            }
        }

        $snapshot = [
            'scanned_at' => now()->toIso8601String(),
            'scanned_by' => User::current()?->email(),
            'types' => static::sorted($types),
            'globals' => static::sorted($globals),
        ];

        static::write($snapshot);

        // A first scan turns the limit on for real — the "not scanned yet"
        // catch above no longer holds, and anything asked afterwards in this
        // request has to be answered on the new footing.
        static::$locked = null;

        return static::$snapshot = $snapshot;
    }

    /** Forget what was cached — for tests, and right after a scan. */
    public static function flush(): void
    {
        static::$snapshot = null;
        static::$locked = null;
    }

    /**
     * Collects section types and global-section ids out of an entry's data tree.
     *
     * `$eligible` says whether the list being walked is one sections live in, set
     * from the key holding it — so a `blocks` list inside a section contributes
     * nothing, however much its rows look like sections. A matched row is still
     * descended into: a section can hold a nested page-builder field of its own.
     *
     * @param  array<string, true>  $types
     * @param  array<string, true>  $globals
     */
    protected static function walk(mixed $node, string $scope, string $set, array &$types, array &$globals, bool $eligible = false): void
    {
        if (! is_array($node)) {
            return;
        }

        if (array_is_list($node)) {
            foreach ($node as $item) {
                if ($eligible && is_array($item) && isset($item['type'])) {
                    $type = (string) $item['type'];

                    if ($type === $set) {
                        foreach (array_map('strval', (array) ($item[$set] ?? [])) as $id) {
                            $globals[$id] = true;
                        }
                    } else {
                        $types[$type] = true;
                    }
                }

                static::walk($item, $scope, $set, $types, $globals, $eligible);
            }

            return;
        }

        foreach ($node as $key => $value) {
            static::walk($value, $scope, $set, $types, $globals, $key === $scope);
        }
    }

    /** Writes the snapshot, making its folder if this is the first scan. */
    protected static function write(array $snapshot): void
    {
        $path = static::path();
        $dir = dirname($path);

        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        file_put_contents($path, static::header().YAML::dump($snapshot));
    }

    /** A note at the top of the file, for whoever finds it in a diff. */
    protected static function header(): string
    {
        return <<<'YAML'
        # Written by the Visual Editor's "Scan the site" button.
        #
        # The section types and global sections this site was using when the scan
        # was taken. While the matching setting is on, everyone but a super admin
        # sees only these in the section library. Editing it by hand works, but
        # the next scan overwrites it.

        YAML;
    }

    /** The field sections live in — the only list a section can be found in. */
    protected static function scope(): string
    {
        return config('statamic-visual-editor.previews.field', 'page_sections');
    }

    /** The Replicator set a page uses to reference a synced section. */
    protected static function globalSet(): string
    {
        return config('statamic-visual-editor.saved_sections.set', 'global_section');
    }

    /** The editor's own collections — libraries, not pages. */
    protected static function stores(): array
    {
        return [
            config('statamic-visual-editor.saved_sections.collection', 'saved_sections'),
            config('statamic-visual-editor.templates.collection', 'saved_templates'),
        ];
    }

    /** Where the snapshot lives. Under resources/, so it deploys with the site. */
    public static function path(): string
    {
        return config('statamic-visual-editor.library.snapshot')
            ?: base_path('resources/visual-editor/library-snapshot.yaml');
    }

    /** @param  array<string, true>  $found */
    protected static function sorted(array $found): array
    {
        $keys = array_keys($found);

        sort($keys, SORT_NATURAL | SORT_FLAG_CASE);

        return $keys;
    }

    protected static function strings(mixed $value): array
    {
        return array_values(array_unique(array_map('strval', (array) $value)));
    }
}
