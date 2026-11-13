<?php

/*
 * The last step of `npm run cp:build`: write resources/dist/lock.json for the
 * build Vite just made.
 *
 * The lock is what lets a server skip the walk through the built files on
 * every request (BuiltAssets\Lock). It used to be written only by the first
 * request after a build, so the file in the package was whatever the last
 * local request or test run had left: often the lock of an older build. A
 * server then walked on every request, and one with a read-only vendor/ could
 * never write a better one.
 *
 * It is written here by the function the server itself uses
 * (Recovery::refreshLock), not by a copy of its rules in JavaScript: two
 * versions of one rule drift apart. scripts/assert-dist-integrity.mjs then
 * refuses a lock that is not for the build beside it.
 */

use MarioHamann\StatamicVisualEditor\BuiltAssets\Lock;
use MarioHamann\StatamicVisualEditor\BuiltAssets\Manifest;
use MarioHamann\StatamicVisualEditor\BuiltAssets\Recovery;

$autoload = dirname(__DIR__).'/vendor/autoload.php';

if (! is_file($autoload)) {
    fwrite(STDERR, "write-dist-lock: vendor/autoload.php is missing. Run `composer install` in the addon first.\n");
    exit(1);
}

require $autoload;

try {
    // A lock is a promise that the build is whole. Never written for one that is not.
    Recovery::assertIntegrity();
    Recovery::refreshLock();
} catch (RuntimeException $e) {
    fwrite(STDERR, 'write-dist-lock: '.$e->getMessage()."\n");
    exit(1);
}

Lock::forget();

if (! Lock::holds(Manifest::buildKey())) {
    fwrite(STDERR, 'write-dist-lock: '.Lock::path()." was not written for this build. Is resources/dist writable?\n");
    exit(1);
}

$lock = Lock::read();

echo 'lock.json: build '.$lock['build'].', '.$lock['addon'].' and '.count($lock['imports'])." chunks it imports\n";
