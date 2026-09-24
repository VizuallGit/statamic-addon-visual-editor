<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\SetPreview\Targets;
use Statamic\Facades\Collection;
use Statamic\Facades\Entry;

/**
 * What a section type's preview photographs: the section as it stands on a
 * page, the editor's working copy included, before the fieldset's defaults.
 */
class PreviewInstanceTest extends TestCase
{
    public function test_the_working_copy_of_a_page_is_the_instance(): void
    {
        // Working copies exist only with revisions on — a Pro feature — for the
        // app and the collection.
        config(['statamic.editions.pro' => true]);
        config(['statamic.revisions.enabled' => true, 'statamic.revisions.path' => sys_get_temp_dir().'/sve-rev-'.uniqid()]);
        Collection::make('pages')->revisionsEnabled(true)->save();

        $entry = Entry::make()->id('preview-instance-page')->collection('pages')->slug('preview-instance-page')->data([
            'title' => 'Page',
            'page_sections' => [
                ['id' => 'sec-published', 'type' => 'intro/instance_test', 'enabled' => true, 'text' => 'published text'],
            ],
        ]);
        $entry->published(false)->save();

        // The working copy the way the CP writes one: the entry's own revision
        // attributes, with the sections edited.
        $copy = $entry->makeWorkingCopy();
        $attributes = $copy->attributes();
        $attributes['data']['page_sections'] = [
            ['id' => 'sec-working', 'type' => 'intro/instance_test', 'enabled' => true, 'text' => 'working copy text'],
        ];
        $copy->attributes($attributes)->save();

        $found = (new \ReflectionMethod(Targets::class, 'findInstance'))->invoke(null, 'intro/instance_test');

        $this->assertNotNull($found, 'an unpublished page with the section is an instance');
        $this->assertSame('preview-instance-page', $found[0]);
        $this->assertSame('sec-working', $found[1], 'the working copy is what the editor sees');
        $this->assertSame('working copy text', $found[2]['text']);
    }
}
