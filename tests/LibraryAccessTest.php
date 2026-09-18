<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\LibraryAccess;

/**
 * The library limit's public answers, pinned before the WP7d split. The
 * scan itself sweeps real entries and is exercised through the settings
 * screen; the walk it uses is tested on its own class after the split.
 */
class LibraryAccessTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config(['statamic-visual-editor.library.snapshot' => sys_get_temp_dir().'/sve-test-'.uniqid().'/library-snapshot.yaml']);
        LibraryAccess::flush();
    }

    protected function tearDown(): void
    {
        LibraryAccess::flush();

        parent::tearDown();
    }

    public function test_an_unscanned_site_is_an_open_one(): void
    {
        $this->assertFalse(LibraryAccess::scanned());
        $this->assertFalse(LibraryAccess::locked());
        $this->assertTrue(LibraryAccess::allowsType('hero/style_1'));
        $this->assertTrue(LibraryAccess::allowsGlobal('some-id'));
        $this->assertTrue(LibraryAccess::allowsSections([]));
    }

    public function test_the_snapshot_has_a_fixed_shape_even_without_a_file(): void
    {
        $this->assertSame([
            'scanned_at' => null,
            'scanned_by' => null,
            'types' => [],
            'globals' => [],
        ], LibraryAccess::snapshot());
    }

    public function test_nobody_is_limited_when_there_is_no_user(): void
    {
        $this->assertFalse(LibraryAccess::appliesTo(null));
    }

    public function test_the_audience_defaults_to_everyone(): void
    {
        $this->assertSame('everyone', LibraryAccess::audience());
        $this->assertSame([], LibraryAccess::roles());
    }
}
