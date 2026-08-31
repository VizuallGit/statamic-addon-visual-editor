<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\CollectionViewTemplates;
use MarioHamann\StatamicVisualEditor\Listeners\ScopeTemplatePreviewAs;

class CollectionViewTemplatesTest extends TestCase
{
    public function test_view_paths_are_normalised_and_unsafe_ones_are_refused(): void
    {
        $this->assertSame('cases/show', CollectionViewTemplates::normalizeView('cases/show.antlers.html'));
        $this->assertSame('cases/index', CollectionViewTemplates::normalizeView('cases/index/'));
        $this->assertSame('partials/blocks/media-old', CollectionViewTemplates::normalizeView('partials/blocks/media-old.antlers.html'));
        $this->assertNull(CollectionViewTemplates::normalizeView('../secret'));
        $this->assertNull(CollectionViewTemplates::normalizeView('/etc/passwd'));
        $this->assertNull(CollectionViewTemplates::normalizeView(''));
        $this->assertNull(CollectionViewTemplates::normalizeView(null));
    }

    public function test_preview_as_is_scoped_to_the_source_collection(): void
    {
        $contents = [
            'tabs' => [
                'main' => [
                    'sections' => [
                        [
                            'fields' => [
                                [
                                    'handle' => 'preview_as',
                                    'field' => [
                                        'type' => 'entries',
                                        'collections' => [],
                                    ],
                                ],
                                [
                                    'handle' => 'title',
                                    'field' => [
                                        'type' => 'text',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $scoped = ScopeTemplatePreviewAs::scope($contents, 'cases');

        $this->assertSame(
            ['cases'],
            $scoped['tabs']['main']['sections'][0]['fields'][0]['field']['collections']
        );
        $this->assertSame('text', $scoped['tabs']['main']['sections'][0]['fields'][1]['field']['type']);
    }

    public function test_only_ordinary_collection_handles_are_purged(): void
    {
        $this->assertTrue(CollectionViewTemplates::purgeableHandle('test'));
        $this->assertTrue(CollectionViewTemplates::purgeableHandle('case-studies'));
        $this->assertFalse(CollectionViewTemplates::purgeableHandle('pages'));
        $this->assertFalse(CollectionViewTemplates::purgeableHandle('partials'));
        $this->assertFalse(CollectionViewTemplates::purgeableHandle('../secret'));
        $this->assertFalse(CollectionViewTemplates::purgeableHandle('templates'));
    }

    public function test_template_source_matches_string_or_collections_field_array(): void
    {
        $this->assertTrue(CollectionViewTemplates::sourceMatches('services', 'services'));
        $this->assertTrue(CollectionViewTemplates::sourceMatches(['services'], 'services'));
        $this->assertFalse(CollectionViewTemplates::sourceMatches('cases', 'services'));
        $this->assertFalse(CollectionViewTemplates::sourceMatches(['cases'], 'services'));
        $this->assertFalse(CollectionViewTemplates::sourceMatches(null, 'services'));
    }

    public function test_forgetting_a_collection_removes_its_view_and_blueprint_folders(): void
    {
        $views = resource_path('views/purge_me');
        $blueprints = resource_path('blueprints/collections/purge_me');
        if (! is_dir($views)) {
            mkdir($views, 0775, true);
        }
        if (! is_dir($blueprints)) {
            mkdir($blueprints, 0775, true);
        }
        file_put_contents($views.'/index.antlers.html', '<h1>Index</h1>');
        file_put_contents($views.'/show.antlers.html', '<h1>Show</h1>');
        file_put_contents($blueprints.'/purge_me.yaml', "title: Purge me\n");

        CollectionViewTemplates::forget('purge_me');

        $this->assertDirectoryDoesNotExist($views);
        $this->assertDirectoryDoesNotExist($blueprints);
    }

    public function test_forgetting_does_not_touch_protected_view_folders(): void
    {
        $dir = resource_path('views/partials');
        if (! is_dir($dir)) {
            mkdir($dir, 0775, true);
        }
        $probe = $dir.'/sve-purge-probe.txt';
        file_put_contents($probe, 'keep');

        CollectionViewTemplates::forget('partials');

        $this->assertFileExists($probe);
        @unlink($probe);
    }
}
