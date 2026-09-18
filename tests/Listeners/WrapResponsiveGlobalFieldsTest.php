<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Listeners;

use MarioHamann\StatamicVisualEditor\Listeners\WrapResponsiveGlobalFields;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Events\GlobalVariablesBlueprintFound;
use Statamic\Facades\Blink;
use Statamic\Fields\Blueprint;

/**
 * The globals twin of WrapResponsiveFields, moved into the addon in WP8.
 */
class WrapResponsiveGlobalFieldsTest extends TestCase
{
    protected function blueprint(array $fields): Blueprint
    {
        return (new Blueprint)->setHandle('site_foot')->setContents([
            'tabs' => ['main' => ['sections' => [['fields' => $fields]]]],
        ]);
    }

    protected function fire(Blueprint $blueprint): Blueprint
    {
        (new WrapResponsiveGlobalFields)->handle(new GlobalVariablesBlueprintFound($blueprint, 'site_foot'));

        return $blueprint;
    }

    public function test_a_field_marked_responsive_is_wrapped_on_a_global_set(): void
    {
        $blueprint = $this->fire($this->blueprint([
            ['handle' => 'columns', 'field' => ['type' => 'integer', 'sve_responsive' => true]],
            ['handle' => 'title', 'field' => ['type' => 'text']],
        ]));

        $fields = $blueprint->contents()['tabs']['main']['sections'][0]['fields'];

        $this->assertSame('responsive', $fields[0]['field']['type']);
        $this->assertSame('integer', $fields[0]['field']['field']['type'] ?? $fields[0]['field']['fields'][0]['field']['type'] ?? null);
        $this->assertSame('text', $fields[1]['field']['type'], 'an unmarked field is left alone');
    }

    public function test_firing_twice_wraps_once(): void
    {
        $blueprint = $this->fire($this->fire($this->blueprint([
            ['handle' => 'columns', 'field' => ['type' => 'integer', 'sve_responsive' => true]],
        ])));

        $field = $blueprint->contents()['tabs']['main']['sections'][0]['fields'][0]['field'];

        $this->assertSame('responsive', $field['type']);
        $this->assertNotSame('responsive', $field['field']['type'] ?? $field['fields'][0]['field']['type'] ?? null, 'no responsive inside responsive');
    }

    public function test_it_forgets_imported_fieldset_fields_cached_before_the_wrap(): void
    {
        Blink::put('blueprint-imported-fields-stale', ['columns' => 'integer']);
        Blink::put('unrelated', true);

        $this->fire($this->blueprint([]));

        $this->assertFalse(Blink::has('blueprint-imported-fields-stale'));
        $this->assertTrue(Blink::has('unrelated'));
    }
}
