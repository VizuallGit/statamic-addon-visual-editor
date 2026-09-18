<?php

namespace MarioHamann\StatamicVisualEditor\Boot;

/**
 * Every `/!/sve/…` route, in three groups. Registered explicitly: Statamic only
 * auto-loads an addon's routes/ files for the root app.
 */
final class Routes
{
    public static function register(): void
    {
        PreviewRoutes::register();
        DockRoutes::register();
        EditorRoutes::register();
    }
}
