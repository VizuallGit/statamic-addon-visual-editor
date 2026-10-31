<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\Component;
use MarioHamann\StatamicVisualEditor\ComponentMeta;

/**
 * A component's category and description live beside the component file and
 * reach the list that Add and the dock read. See ComponentMeta.
 */
class ComponentMetaTest extends TestCase
{
    private const FILES = ['sve_meta_a', 'sve_meta_b'];

    protected function setUp(): void
    {
        parent::setUp();

        @mkdir(resource_path('views/partials/components'), 0777, true);
        $this->clean();
    }

    protected function tearDown(): void
    {
        $this->clean();

        parent::tearDown();
    }

    private function clean(): void
    {
        @unlink(ComponentMeta::path());

        foreach (self::FILES as $name) {
            @unlink(resource_path("views/partials/components/{$name}.antlers.html"));
        }
    }

    public function test_a_saved_entry_reads_back_and_reaches_the_list(): void
    {
        file_put_contents(resource_path('views/partials/components/sve_meta_a.antlers.html'), '<img>');
        file_put_contents(resource_path('views/partials/components/sve_meta_b.antlers.html'), '<div></div>');

        ComponentMeta::save('sve_meta_a', '  Media   files ', " The picture, blurred until loaded.\nSecond line. ");

        $this->assertSame(
            ['sve_meta_a' => ['category' => 'Media files', 'description' => "The picture, blurred until loaded.\nSecond line."]],
            ComponentMeta::all()
        );

        $items = collect(Component::all())->keyBy('name');

        $this->assertSame('Media files', $items['sve_meta_a']['category']);
        $this->assertSame('', $items['sve_meta_b']['category']);
        $this->assertSame('', $items['sve_meta_b']['description']);
    }

    public function test_an_empty_entry_leaves_the_file(): void
    {
        ComponentMeta::save('image', 'Media', '');
        ComponentMeta::save('card', 'Cards', '');
        ComponentMeta::save('image', '', '  ');

        $this->assertSame(['card'], array_keys(ComponentMeta::all()));
    }

    public function test_a_file_that_does_not_parse_is_not_overwritten(): void
    {
        @mkdir(dirname(ComponentMeta::path()), 0777, true);
        file_put_contents(ComponentMeta::path(), "image: [broken\n");

        $this->assertSame([], ComponentMeta::all());

        try {
            ComponentMeta::save('card', 'Cards', '');
            $this->fail('save must refuse');
        } catch (\Symfony\Component\Yaml\Exception\ParseException) {
            $this->assertSame("image: [broken\n", file_get_contents(ComponentMeta::path()));
        }
    }
}
