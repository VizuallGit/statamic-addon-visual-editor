<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Fieldtypes;

use MarioHamann\StatamicVisualEditor\Fieldtypes\Replicator;
use MarioHamann\StatamicVisualEditor\Fieldtypes\ResponsiveFieldtype;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Facades\Blink;
use Statamic\Fields\Field;

/**
 * A field read twelve times in one render is augmented once. Same inputs give
 * the same object back; anything that could change the answer gives a new one.
 */
class MemoizedAugmentationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Blink::store('sve-augment')->flush();
    }

    protected function responsive(string $handle = 'columns'): ResponsiveFieldtype
    {
        $field = new Field($handle, [
            'type' => 'responsive',
            'fields' => [
                ['handle' => 'columns', 'field' => ['type' => 'integer']],
            ],
        ]);

        $fieldtype = $field->fieldtype();

        $this->assertInstanceOf(ResponsiveFieldtype::class, $fieldtype);

        return $fieldtype;
    }

    public function test_the_same_value_is_augmented_once_per_request(): void
    {
        $fieldtype = $this->responsive();
        $raw = ['laptop' => ['columns' => 3], 'tablet' => ['columns' => 2]];

        $first = $fieldtype->augment($raw);
        $second = $fieldtype->augment($raw);

        $this->assertSame($first, $second, 'the second read is the remembered answer');
        $this->assertSame(3, $first['laptop']['columns'], 'Values hands the augmented value back');
        $this->assertSame(2, $first['tablet']['columns']);
    }

    public function test_a_different_value_or_depth_is_a_different_answer(): void
    {
        $fieldtype = $this->responsive();

        $a = $fieldtype->augment(['laptop' => ['columns' => 3]]);
        $b = $fieldtype->augment(['laptop' => ['columns' => 4]]);
        $shallow = $fieldtype->shallowAugment(['laptop' => ['columns' => 3]]);

        $this->assertNotSame($a, $b);
        $this->assertNotSame($a, $shallow);
        $this->assertSame(4, $b['laptop']['columns']);
    }

    public function test_two_fields_with_the_same_value_do_not_share_when_their_config_differs(): void
    {
        $columns = $this->responsive('columns');
        $gap = (new Field('gap', [
            'type' => 'responsive',
            'fields' => [['handle' => 'columns', 'field' => ['type' => 'text']]],
        ]))->fieldtype();

        $a = $columns->augment(['laptop' => ['columns' => 3]]);
        $b = $gap->augment(['laptop' => ['columns' => 3]]);

        $this->assertNotSame($a, $b, 'a different handle and inner type is a different field');
    }

    public function test_the_memory_is_the_request_and_nothing_longer(): void
    {
        $fieldtype = $this->responsive();
        $raw = ['laptop' => ['columns' => 1]];

        $first = $fieldtype->augment($raw);
        Blink::store('sve-augment')->flush();

        $this->assertNotSame($first, $fieldtype->augment($raw));
    }

    public function test_the_replicator_remembers_its_rows_too(): void
    {
        $field = new Field('blocks', [
            'type' => 'replicator',
            'sets' => [
                'headline' => ['fields' => [['handle' => 'text', 'field' => ['type' => 'text']]]],
            ],
        ]);
        $fieldtype = $field->fieldtype();

        $this->assertInstanceOf(Replicator::class, $fieldtype);

        $rows = [['type' => 'headline', 'text' => 'Hej', 'enabled' => true]];

        $first = $fieldtype->augment($rows);
        $second = $fieldtype->augment($rows);
        $other = $fieldtype->augment([['type' => 'headline', 'text' => 'Farvel', 'enabled' => true]]);

        $this->assertSame($first, $second);
        $this->assertNotSame($first, $other);
        $this->assertSame('Hej', $first[0]['text']);
    }
}
