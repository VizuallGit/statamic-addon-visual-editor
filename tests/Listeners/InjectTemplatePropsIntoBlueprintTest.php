<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Listeners;

use MarioHamann\StatamicVisualEditor\Listeners\InjectTemplatePropsIntoBlueprint;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Events\EntryBlueprintFound;
use Statamic\Facades\Fieldset;
use Statamic\Fields\Blueprint;
use Statamic\Fields\Fieldset as FieldsetModel;

class InjectTemplatePropsIntoBlueprintTest extends TestCase
{
    private string $partials;

    protected function setUp(): void
    {
        parent::setUp();

        $this->partials = sys_get_temp_dir().'/sve-template-props-'.uniqid();
        mkdir($this->partials.'/dynamic', 0775, true);
        config(['statamic-visual-editor.templates.partials' => $this->partials]);

        file_put_contents($this->partials.'/dynamic/entries.antlers.html', <<<'ANTLERS'
{{ collection from=":collection_field ?? services" }}
  <li>{{ :text_field ?? title }}</li>
{{ /collection }}
ANTLERS);
    }

    protected function tearDown(): void
    {
        if (is_file($this->partials.'/dynamic/entries.antlers.html')) {
            unlink($this->partials.'/dynamic/entries.antlers.html');
        }

        if (is_dir($this->partials.'/dynamic')) {
            rmdir($this->partials.'/dynamic');
        }

        if (is_dir($this->partials)) {
            rmdir($this->partials);
        }

        parent::tearDown();
    }

    public function test_injects_selects_from_the_section_template(): void
    {
        $blueprint = $this->makeBlueprint([
            $this->replicatorWithGroupedSets([
                'dynamic/entries' => [
                    'display' => 'Dynamic entries',
                    'fields' => [
                        ['handle' => 'headline', 'field' => ['type' => 'text']],
                    ],
                ],
            ]),
        ]);

        (new InjectTemplatePropsIntoBlueprint)->handle(new EntryBlueprintFound($blueprint));

        $fields = $blueprint->contents()['tabs']['main']['sections'][0]['fields'][0]['field']['sets']['items']['sets']['dynamic/entries']['fields'];
        $byHandle = [];

        foreach ($fields as $field) {
            $byHandle[$field['handle']] = $field['field'];
        }

        $this->assertSame('text', $byHandle['headline']['type']);
        $this->assertSame('sve_template_props', $byHandle['sve_props']['type']);
        $this->assertSame('dynamic/entries', $byHandle['sve_props']['section_type']);
        $this->assertArrayNotHasKey('collection_field', $byHandle);
        $this->assertArrayNotHasKey('text_field', $byHandle);
    }

    public function test_leaves_a_handle_already_in_the_fieldset(): void
    {
        $blueprint = $this->makeBlueprint([
            $this->replicatorWithGroupedSets([
                'dynamic/entries' => [
                    'display' => 'Dynamic entries',
                    'fields' => [
                        ['handle' => 'sve_props', 'field' => ['type' => 'text', 'display' => 'Already here']],
                    ],
                ],
            ]),
        ]);

        (new InjectTemplatePropsIntoBlueprint)->handle(new EntryBlueprintFound($blueprint));

        $fields = $blueprint->contents()['tabs']['main']['sections'][0]['fields'][0]['field']['sets']['items']['sets']['dynamic/entries']['fields'];
        $bundle = collect($fields)->firstWhere('handle', 'sve_props');

        $this->assertSame('text', $bundle['field']['type']);
        $this->assertSame('Already here', $bundle['field']['display']);
        $this->assertCount(1, collect($fields)->where('handle', 'sve_props'));
    }

    public function test_follows_an_imported_page_sections_fieldset(): void
    {
        $pageSections = (new FieldsetModel)->setHandle('page_sections')->setContents([
            'fields' => [
                $this->replicatorWithGroupedSets([
                    'dynamic/entries' => [
                        'display' => 'Dynamic entries',
                        'fields' => [
                            ['handle' => 'headline', 'field' => ['type' => 'text']],
                        ],
                    ],
                ]),
            ],
        ]);

        Fieldset::shouldReceive('find')
            ->andReturnUsing(fn ($handle) => $handle === 'page_sections' ? $pageSections : null);

        $blueprint = $this->makeBlueprint([
            ['import' => 'page_sections'],
        ]);

        (new InjectTemplatePropsIntoBlueprint)->handle(new EntryBlueprintFound($blueprint));

        $fields = $pageSections->contents()['fields'][0]['field']['sets']['items']['sets']['dynamic/entries']['fields'];
        $handles = array_column($fields, 'handle');

        $this->assertContains('headline', $handles);
        $this->assertContains('sve_props', $handles);
        $this->assertNotContains('collection_field', $handles);
    }

    public function test_skips_sets_without_prop_bindings(): void
    {
        file_put_contents($this->partials.'/hero-plain.antlers.html', '<section>{{ headline }}</section>');

        $blueprint = $this->makeBlueprint([
            $this->replicatorWithGroupedSets([
                'hero-plain' => [
                    'display' => 'Hero',
                    'fields' => [
                        ['handle' => 'headline', 'field' => ['type' => 'text']],
                    ],
                ],
            ]),
        ]);

        (new InjectTemplatePropsIntoBlueprint)->handle(new EntryBlueprintFound($blueprint));

        $fields = $blueprint->contents()['tabs']['main']['sections'][0]['fields'][0]['field']['sets']['items']['sets']['hero-plain']['fields'];

        $this->assertCount(1, $fields);
        $this->assertSame('headline', $fields[0]['handle']);

        unlink($this->partials.'/hero-plain.antlers.html');
    }

    private function makeBlueprint(array $fields): Blueprint
    {
        $blueprint = new Blueprint;
        $blueprint->setContents([
            'tabs' => [
                'main' => [
                    'sections' => [
                        ['fields' => $fields],
                    ],
                ],
            ],
        ]);

        return $blueprint;
    }

    private function replicatorWithGroupedSets(array $sets): array
    {
        return [
            'handle' => 'page_sections',
            'field' => [
                'type' => 'replicator',
                'sets' => [
                    'items' => [
                        'display' => 'Items',
                        'sets' => $sets,
                    ],
                ],
            ],
        ];
    }
}
