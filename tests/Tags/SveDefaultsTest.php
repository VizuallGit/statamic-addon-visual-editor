<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Tags;

use MarioHamann\StatamicVisualEditor\Tags\SveDefaults;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Fields\Value;
use Statamic\Fieldtypes\Text;

class SveDefaultsTest extends TestCase
{
    /** @return array<string, mixed> the data the pair's contents are rendered with */
    private function scope(array $context, array $params): array
    {
        $tag = new class extends SveDefaults
        {
            public array $scope = [];

            public function parse($data = []): mixed
            {
                $this->scope = $data;

                return '';
            }
        };

        $tag->setProperties([
            'parser' => null,
            'content' => 'INDE',
            'context' => $context,
            'params' => $params,
            'tag' => 'sve_defaults',
            'tag_method' => 'index',
            'isPair' => true,
        ]);

        $tag->index();

        return $tag->scope;
    }

    public function test_a_declared_fallback_applies_when_the_call_passed_nothing(): void
    {
        $scope = $this->scope([], ['headline' => 'Fallback']);

        $this->assertSame('Fallback', $scope['props']['headline']);
    }

    public function test_the_call_beats_the_fallback(): void
    {
        $scope = $this->scope(['headline' => 'Fra kaldet'], ['headline' => 'Fallback']);

        $this->assertSame('Fra kaldet', $scope['props']['headline']);
    }

    public function test_the_bare_name_carries_the_same_value(): void
    {
        // Components written before the `props` namespace still say `{{ headline }}`,
        // and they keep their defaults instead of quietly losing them.
        $scope = $this->scope([], ['headline' => 'Fallback']);

        $this->assertSame('Fallback', $scope['headline']);
        $this->assertSame($scope['props']['headline'], $scope['headline']);
    }

    public function test_a_prop_with_no_default_is_still_a_name_the_template_can_use(): void
    {
        $scope = $this->scope([], ['link' => '']);

        $this->assertArrayHasKey('link', $scope['props']);
        $this->assertSame('', $scope['props']['link']);
    }

    public function test_an_empty_call_value_falls_back(): void
    {
        // `{{ partial:components/card headline="" }}` means "nothing here",
        // not "print nothing" — same as the call leaving it out.
        $scope = $this->scope(['headline' => ''], ['headline' => 'Fallback']);

        $this->assertSame('Fallback', $scope['props']['headline']);
    }

    public function test_an_augmented_value_is_passed_through_untouched(): void
    {
        // `:headline="title"` arrives as a Value, and unwrapping it here would
        // strip whatever augmentation it carries before the template sees it.
        $value = new Value('Fra entry', 'title', new Text);
        $scope = $this->scope(['headline' => $value], ['headline' => 'Fallback']);

        $this->assertSame($value, $scope['props']['headline']);
    }

    public function test_nothing_the_pair_does_not_declare_gets_added(): void
    {
        $scope = $this->scope(['andet' => 'x'], ['headline' => 'Fallback']);

        $this->assertSame(['props', 'headline'], array_keys($scope));
    }
}
