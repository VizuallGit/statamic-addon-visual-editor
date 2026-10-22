<?php

/**
 * The site canvas's endpoint, answered by this checkout's controller against
 * a site whose installed addon predates it — every SVE_WORKTREE=1 run before
 * `composer update`. site-canvas.mjs runs this once and hands the browser the
 * JSON when the canvas asks /!/sve/site-canvas; the frames then load the real
 * Live Preview documents those URLs name, through the installed PHP.
 *
 * The site's own Laravel app is booted, the checkout's controller class is
 * loaded in place of the one the installed vendor does not have, and its
 * strings come from the checkout's lang files. Nothing is written but the
 * Live Preview tokens the controller mints — the same ones a Live Preview
 * open writes, gone after an hour.
 *
 * Run on the server over ssh for a remote site (site-canvas.mjs copies this
 * file, the controller and the lang files to a scratch directory there):
 * the third argument is the URL the browser reaches the site at, which a
 * command line has no request to know — the Control Panel URLs and a
 * template's preview route are rooted there, as they would be under that
 * request. A page's preview URL is its permalink, rooted at the site's own
 * configured URL (APP_URL), exactly as Statamic's Live Preview roots it.
 *
 *   php tests/browser/site-canvas-payload.php <site dir> <user email> [<site url>]
 */
[$script, $siteDir, $email, $siteUrl] = $argv + [null, null, null, null];

if (! is_dir((string) $siteDir) || ! is_string($email) || $email === '') {
    fwrite(STDERR, "usage: php {$script} <site dir> <user email> [<site url>]\n");
    exit(2);
}

require $siteDir.'/vendor/autoload.php';

$app = require $siteDir.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

if (is_string($siteUrl) && $siteUrl !== '') {
    Illuminate\Support\Facades\URL::forceRootUrl($siteUrl);
    Illuminate\Support\Facades\URL::forceScheme((string) parse_url($siteUrl, PHP_URL_SCHEME));
}

// This checkout's class and strings, where the installed addon has neither.
if (! class_exists(MarioHamann\StatamicVisualEditor\Http\Controllers\SiteCanvasController::class, false)) {
    require_once __DIR__.'/../../src/Http/Controllers/SiteCanvasController.php';
}

// The installed addon's `sve` namespace, and whatever of it boot already
// loaded, give way to this checkout's lang files.
app('translator')->addNamespace('sve', __DIR__.'/../../resources/lang');
app('translator')->setLoaded([]);

$user = Statamic\Facades\User::findByEmail($email);

if (! $user) {
    fwrite(STDERR, "no user {$email} on the site\n");
    exit(3);
}

auth()->login($user);

echo (new MarioHamann\StatamicVisualEditor\Http\Controllers\SiteCanvasController)()->getContent();
