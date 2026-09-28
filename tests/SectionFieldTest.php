<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\SectionField;
use MarioHamann\StatamicVisualEditor\SectionList;
use MarioHamann\StatamicVisualEditor\SectionTypeMaker;
use MarioHamann\StatamicVisualEditor\SectionTypes;
use Statamic\Facades\Blueprint;
use Statamic\Facades\Fieldset;
use Statamic\Fields\Blueprint as BlueprintObject;

/**
 * Which field is a page's sections, and which file its list is written in.
 *
 * The site's pages import `page_sections` and mark nothing — they must answer
 * exactly what they always did. A blueprint that marks a Replicator of its own
 * (a lawyer's CV sections) gets that field and that list instead.
 */
class SectionFieldTest extends TestCase
{
    /** Files a test wrote outside the fixtures, removed afterwards. */
    private array $written = [];

    protected function setUp(): void
    {
        parent::setUp();

        Fieldset::make('page_sections')->setContents([
            'title' => 'Page sections',
            'fields' => [[
                'handle' => 'page_sections',
                'field' => ['type' => 'replicator', 'sets' => [
                    'hero' => ['display' => 'Hero', 'sets' => [
                        'hero/style_1' => ['display' => 'Hero 1', 'fields' => [['handle' => 'title', 'field' => ['type' => 'text']]]],
                    ]],
                ]],
            ]],
        ])->save();

        // A list of its own, kept in a fieldset, in the sectioned shape the
        // Fieldsets screen writes once a section is named.
        Fieldset::make('lawyer_sections')->setContents([
            'title' => 'Advokat-sektioner',
            'sections' => [[
                'display' => 'Main',
                'fields' => [[
                    'handle' => 'info',
                    'field' => ['type' => 'replicator', 'sve_sections' => true, 'sets' => [
                        'cv' => ['display' => 'CV', 'sets' => [
                            'cv/education' => ['display' => 'Uddannelse', 'fields' => [['handle' => 'school', 'field' => ['type' => 'text']]]],
                        ]],
                    ]],
                ]],
            ]],
        ])->save();
    }

    protected function tearDown(): void
    {
        Fieldset::find('page_sections')?->delete();
        Fieldset::find('lawyer_sections')?->delete();
        Blueprint::find('collections.lawyers.lawyer')?->delete();

        foreach ($this->written as $path) {
            @unlink($path);
        }

        parent::tearDown();
    }

    private function blueprint(array $fields, string $handle = 'lawyer', string $namespace = 'collections.lawyers'): BlueprintObject
    {
        return Blueprint::make($handle)->setNamespace($namespace)->setContents([
            'tabs' => ['main' => ['sections' => [['fields' => $fields]]]],
        ]);
    }

    private function inlineLawyerBlueprint(): BlueprintObject
    {
        return $this->blueprint([
            ['handle' => 'title', 'field' => ['type' => 'text']],
            ['handle' => 'lawyer_info', 'field' => ['type' => 'replicator', 'sve_sections' => true, 'sets' => [
                'cv' => ['display' => 'CV', 'sets' => [
                    'cv/history' => ['display' => 'Historik', 'fields' => [['handle' => 'year', 'field' => ['type' => 'text']]]],
                ]],
            ]]],
        ]);
    }

    public function test_a_page_that_marks_nothing_keeps_page_sections_and_its_fieldset(): void
    {
        $page = $this->blueprint([['import' => 'page_sections']], 'page', 'collections.pages');

        $this->assertTrue(SectionField::in($page));
        $this->assertSame('page_sections', SectionField::of($page));
        $this->assertSame('fieldset:page_sections', SectionField::listOf($page)->key());
    }

    public function test_a_marked_replicator_in_the_blueprint_is_the_sections_and_the_list(): void
    {
        $lawyer = $this->inlineLawyerBlueprint();

        $this->assertSame('lawyer_info', SectionField::of($lawyer));
        $this->assertSame('blueprint:collections.lawyers.lawyer', SectionField::listOf($lawyer)->key());
        $this->assertSame('lawyer_info', SectionField::listOf($lawyer)->field);
    }

    public function test_a_marked_replicator_in_an_imported_fieldset_carries_the_prefix(): void
    {
        $lawyer = $this->blueprint([['import' => 'lawyer_sections', 'prefix' => 'lawyer_']]);

        $this->assertSame('lawyer_info', SectionField::of($lawyer));
        $this->assertSame('fieldset:lawyer_sections', SectionField::listOf($lawyer)->key());
        // Inside the file the field has no prefix.
        $this->assertSame('info', SectionField::listOf($lawyer)->field);
    }

    public function test_a_field_reference_is_marked_by_its_own_config_or_the_override(): void
    {
        // Two handles: Statamic caches a blueprint's contents by its handle.
        $viaFieldset = $this->blueprint([['handle' => 'cv', 'field' => 'lawyer_sections.info']], 'via_fieldset');
        $viaOverride = $this->blueprint([['handle' => 'cv', 'field' => 'page_sections.page_sections', 'config' => ['sve_sections' => true]]], 'via_override');

        $this->assertSame('cv', SectionField::of($viaFieldset));
        $this->assertSame('fieldset:lawyer_sections', SectionField::listOf($viaFieldset)->key());
        $this->assertSame('cv', SectionField::of($viaOverride));
        $this->assertSame('fieldset:page_sections', SectionField::listOf($viaOverride)->key());
    }

    public function test_the_marked_field_wins_over_one_with_the_default_name(): void
    {
        $both = $this->blueprint([
            ['import' => 'page_sections'],
            ['handle' => 'lawyer_info', 'field' => ['type' => 'replicator', 'sve_sections' => true, 'sets' => []]],
        ]);

        $this->assertSame('lawyer_info', SectionField::of($both));
    }

    public function test_a_blueprint_without_sections_answers_the_default(): void
    {
        $plain = $this->blueprint([['handle' => 'title', 'field' => ['type' => 'text']]]);

        $this->assertFalse(SectionField::in($plain));
        $this->assertSame('page_sections', SectionField::of($plain));
        $this->assertSame('fieldset:page_sections', SectionField::listOf($plain)->key());
        $this->assertFalse(SectionField::in(null));
    }

    public function test_every_sections_field_on_the_site_is_listed_default_first(): void
    {
        $this->inlineLawyerBlueprint()->save();
        \Statamic\Facades\Collection::make('lawyers')->save();

        try {
            $all = SectionField::all();

            $this->assertSame('page_sections', $all[0]);
            $this->assertContains('lawyer_info', $all);
            $this->assertSame(count($all), count(array_unique($all)));
        } finally {
            \Statamic\Facades\Collection::findByHandle('lawyers')?->delete();
        }
    }

    public function test_the_list_reads_both_fieldset_shapes(): void
    {
        $flat = SectionList::fieldset('page_sections');
        $sectioned = SectionList::fieldset('lawyer_sections', 'info');

        $this->assertSame(['hero'], array_keys($flat->sets($flat->read())));
        $this->assertSame(['cv'], array_keys($sectioned->sets($sectioned->read())));
    }

    public function test_a_section_type_made_on_a_lawyer_page_lands_in_the_lawyers_list_only(): void
    {
        $lawyer = $this->inlineLawyerBlueprint();
        $lawyer->save();
        $lawyer = Blueprint::find('collections.lawyers.lawyer');

        $made = SectionTypeMaker::create(SectionField::listOf($lawyer), 'cv', 'Priser', null, true);

        $this->assertNotNull($made);
        $this->written[] = resource_path('views/'.$made['view'].'.antlers.html');

        // Written into the blueprint's own field…
        $onDisk = SectionList::blueprint('collections.lawyers.lawyer', 'lawyer_info');
        $this->assertArrayHasKey($made['handle'], $onDisk->sets($onDisk->read())['cv']['sets']);

        // …listed for that page, and nowhere near the pages' list.
        $this->assertContains($made['handle'], array_column(SectionTypes::map(Blueprint::find('collections.lawyers.lawyer')), 'handle'));
        $this->assertNotContains($made['handle'], array_column(SectionTypes::map(), 'handle'));
        $pages = SectionList::fieldset('page_sections');
        $this->assertSame(['hero'], array_keys($pages->sets($pages->read())));
    }

    public function test_the_groups_and_a_new_group_follow_the_page(): void
    {
        $lawyer = $this->blueprint([['import' => 'lawyer_sections']]);

        $this->assertSame([['handle' => 'cv', 'display' => 'CV', 'static' => false]], SectionTypes::groups($lawyer));

        $this->assertSame(['handle' => 'kontakt', 'display' => 'Kontakt'], SectionTypeMaker::createGroup(SectionField::listOf($lawyer), 'Kontakt'));
        $this->assertSame(['cv', 'kontakt'], array_column(SectionTypes::groups($lawyer), 'handle'));
        $this->assertSame(['hero'], array_column(SectionTypes::groups(), 'handle'));
    }
}
