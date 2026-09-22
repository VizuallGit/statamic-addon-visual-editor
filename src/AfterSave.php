<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Facades\Collection;
use Statamic\Preferences\DefaultPreferences;

/**
 * Where the editor lands after a save or a publish: in the editor.
 *
 * Statamic reads the user's `after_save` preference and, with none set, goes to
 * the collection listing — in Live Preview that closes the page you were just
 * working on. A person who once chose "Continue Editing" never sees it; a new
 * user does on every site. So the addon supplies "continue editing" as the site
 * default for every collection. It sits below role and user preferences and
 * below the site's own `resources/preferences.yaml`, so a choice made anywhere
 * else still wins. `after_save` in the addon config turns it off (null) or
 * names another option.
 *
 * The site file stays the site's: saving default preferences from the Control
 * Panel writes only what the file holds, never what this class added.
 */
final class AfterSave extends DefaultPreferences
{
    /** @var list<string> the keys this class supplied, kept out of the file */
    private array $supplied = [];

    public static function register(): void
    {
        app()->singleton(DefaultPreferences::class, fn () => (new self)->supply());
    }

    /** The option to supply, or null when the site left it to Statamic. */
    public static function option(): ?string
    {
        $option = config('statamic-visual-editor.after_save', 'continue_editing');

        return in_array($option, ['continue_editing', 'listing', 'create_another'], true) ? $option : null;
    }

    public function supply(): self
    {
        $option = static::option();

        if ($option === null) {
            return $this;
        }

        try {
            $handles = Collection::all()->map->handle()->all();
        } catch (\Throwable) {
            return $this; // no stache yet (a console command); nothing to supply
        }

        foreach ($handles as $handle) {
            $key = 'collections.'.$handle.'.after_save';

            if ($this->get($key) === null) {
                $this->set($key, $option);
                $this->supplied[] = $key;
            }
        }

        return $this;
    }

    public function save()
    {
        foreach ($this->supplied as $key) {
            $this->remove($key);
        }

        $this->supplied = [];

        $saved = parent::save();

        $this->supply();

        return $saved;
    }
}
