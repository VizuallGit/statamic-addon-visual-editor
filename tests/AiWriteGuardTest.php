<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\AiWriteGuard;

class AiWriteGuardTest extends TestCase
{
    public function test_it_reads_a_renamed_path_from_git_status(): void
    {
        $this->assertSame(
            'resources/addons/visual-editor.yaml',
            AiWriteGuard::gitPath(' M resources/addons/visual-editor.yaml'),
        );
        $this->assertSame(
            'resources/addons/visual-editor.yaml',
            AiWriteGuard::gitPath('R  old.yaml -> resources/addons/visual-editor.yaml'),
        );
        $this->assertNull(AiWriteGuard::gitPath('?? ../secret'));
    }

    public function test_write_mode_deletes_files_the_agent_created(): void
    {
        @mkdir(resource_path('fieldsets'), 0775, true);

        $rel = 'resources/fieldsets/sve_build_guard.yaml';
        $full = resource_path('fieldsets/sve_build_guard.yaml');
        $before = AiWriteGuard::snapshotAllowed();

        file_put_contents($full, "title: Agent\nfields: []\n");

        AiWriteGuard::restoreAllowed($before, []);

        $this->assertFileDoesNotExist($full);
        $this->assertArrayNotHasKey($rel, AiWriteGuard::snapshotAllowed());
    }

    public function test_write_mode_reverts_clean_files_the_agent_edited(): void
    {
        @mkdir(resource_path('fieldsets'), 0775, true);

        $full = resource_path('fieldsets/sve_build_edit.yaml');
        file_put_contents($full, "title: Original\nfields: []\n");

        $before = AiWriteGuard::snapshotAllowed();
        file_put_contents($full, "title: Agent\nfields: []\n");

        AiWriteGuard::restoreAllowed($before, []);

        $this->assertSame("title: Original\nfields: []\n", file_get_contents($full));
        @unlink($full);
    }

    public function test_write_mode_leaves_already_dirty_files_alone(): void
    {
        @mkdir(resource_path('fieldsets'), 0775, true);

        $rel = 'resources/fieldsets/sve_build_dirty.yaml';
        $full = resource_path('fieldsets/sve_build_dirty.yaml');
        file_put_contents($full, "title: Original\nfields: []\n");

        $before = AiWriteGuard::snapshotAllowed();
        file_put_contents($full, "title: User\nfields: []\n");

        AiWriteGuard::restoreAllowed($before, [$rel]);

        $this->assertSame("title: User\nfields: []\n", file_get_contents($full));
        @unlink($full);
    }
}
