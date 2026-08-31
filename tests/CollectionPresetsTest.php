<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\CollectionPresets;

class CollectionPresetsTest extends TestCase
{
    private string $dir;

    protected function setUp(): void
    {
        parent::setUp();

        $this->dir = sys_get_temp_dir().'/sve-presets-'.uniqid();
        mkdir($this->dir.'/cases', 0775, true);
        file_put_contents($this->dir.'/cases/preset.yaml', "title: Cases\ndescription: Project pages\n");
        file_put_contents(
            $this->dir.'/cases/index.antlers.html',
            "{{ collection:__COLLECTION__ }}\n"
        );
        config(['statamic-visual-editor.collection_templates.presets' => $this->dir]);
    }

    protected function tearDown(): void
    {
        @unlink($this->dir.'/cases/index.antlers.html');
        @unlink($this->dir.'/cases/preset.yaml');
        @rmdir($this->dir.'/cases');
        @rmdir($this->dir);

        parent::tearDown();
    }

    public function test_placeholder_becomes_the_collection_handle(): void
    {
        $this->assertSame(
            '{{ collection:work }}',
            CollectionPresets::substitute('{{ collection:__COLLECTION__ }}', 'work')
        );
    }

    public function test_unsafe_handles_are_refused(): void
    {
        $this->assertFalse(CollectionPresets::validHandle('../secret'));
        $this->assertFalse(CollectionPresets::validHandle('Cases'));
        $this->assertTrue(CollectionPresets::validHandle('cases'));
        $this->assertTrue(CollectionPresets::validHandle('case-studies'));
    }

    public function test_packs_are_listed_from_the_site_folder(): void
    {
        $all = CollectionPresets::all();

        $this->assertCount(1, $all);
        $this->assertSame('cases', $all[0]['handle']);
        $this->assertSame('Cases', $all[0]['title']);
        $this->assertSame('Project pages', $all[0]['description']);
    }

    public function test_a_folder_without_preset_yaml_is_ignored(): void
    {
        mkdir($this->dir.'/orphan', 0775, true);
        file_put_contents($this->dir.'/orphan/show.antlers.html', 'x');

        $this->assertCount(1, CollectionPresets::all());

        @unlink($this->dir.'/orphan/show.antlers.html');
        @rmdir($this->dir.'/orphan');
    }

    public function test_apply_route_is_registered(): void
    {
        $this->assertNotNull(
            app('router')->getRoutes()->getByName('sve.collection-presets.apply')
        );
    }
}
