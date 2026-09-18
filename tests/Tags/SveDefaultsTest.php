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

        $this->assertSame('Fallback', $scope['props_headline']);
    }

    public function test_the_call_beats_the_fallback(): void
    {
        $scope = $this->scope(['props_headline' => 'Fra kaldet'], ['headline' => 'Fallback']);

        $this->assertSame('Fra kaldet', $scope['props_headline']);
    }

    public function test_the_bare_name_is_not_added(): void
    {
        // `{{ headline }}` in a component would read the section's own headline
        // — the whole reason every prop wears the `props_` prefix. The pair adds
        // the prefixed name and nothing under the bare one.
        $scope = $this->scope([], ['headline' => 'Fallback']);

        $this->assertSame('Fallback', $scope['props_headline']);
        $this->assertArrayNotHasKey('headline', $scope);
        $this->assertArrayNotHasKey('props', $scope);
    }

    public function test_a_prop_with_no_default_is_still_a_name_the_template_can_use(): void
    {
        $scope = $this->scope([], ['link' => '']);

        $this->assertArrayHasKey('props_link', $scope);
        $this->assertSame('', $scope['props_link']);
    }

    public function test_an_empty_call_value_falls_back(): void
    {
        // `{{ partial:components/card headline="" }}` means "nothing here",
        // not "print nothing" — same as the call leaving it out.
        $scope = $this->scope(['props_headline' => ''], ['headline' => 'Fallback']);

        $this->assertSame('Fallback', $scope['props_headline']);
    }

    public function test_an_augmented_value_is_passed_through_untouched(): void
    {
        // `:headline="title"` arrives as a Value, and unwrapping it here would
        // strip whatever augmentation it carries before the template sees it.
        $value = new Value('Fra entry', 'title', new Text);
        $scope = $this->scope(['props_headline' => $value], ['headline' => 'Fallback']);

        $this->assertSame($value, $scope['props_headline']);
    }

    public function test_nothing_the_pair_does_not_declare_gets_added(): void
    {
        $scope = $this->scope(['andet' => 'x'], ['headline' => 'Fallback']);

        $this->assertSame(['props_headline'], array_keys($scope));
    }
}
