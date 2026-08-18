<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Listeners;

use MarioHamann\StatamicVisualEditor\Listeners\WrapResponsiveFields;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Events\EntryBlueprintFound;
use Statamic\Facades\Blink;
use Statamic\Fields\Blueprint;

class WrapResponsiveFieldsTest extends TestCase
{
    public function test_it_forgets_imported_fieldset_fields_cached_before_the_wrap()
    {
        // SectionDefaults expands imports before the blueprint is read. Statamic
        // caches that expansion by import name, so without this forget the
        // screenshot would keep the unwrapped field (spacing) instead of the
        // wrapped one (responsive) and draw the section with no padding.
        Blink::put('blueprint-imported-fields-stale', ['padding' => 'spacing']);
        Blink::put('unrelated', true);

        $blueprint = (new Blueprint)->setHandle('page')->setContents([
            'tabs' => [
                'main' => [
                    'sections' => [
                        ['fields' => []],
                    ],
                ],
            ],
        ]);

        (new WrapResponsiveFields)->handle(new EntryBlueprintFound($blueprint));

        $this->assertFalse(Blink::has('blueprint-imported-fields-stale'));
        $this->assertTrue(Blink::has('unrelated'));
    }
}
