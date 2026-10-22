<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Support\Facades\File;
use Illuminate\Validation\ValidationException;
use MarioHamann\StatamicVisualEditor\Breakpoints;
use MarioHamann\StatamicVisualEditor\Breakpoints\Store;
use MarioHamann\StatamicVisualEditor\Features;
use Statamic\Facades\YAML;

/**
 * A size added from Live Preview's «+» lands in the same settings file the
 * settings screen writes, beside the rows that were there — and is refused
 * on the same terms the screen would refuse it.
 */
class BreakpointStoreTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config(['statamic-visual-editor.breakpoints' => null]);
        config(['statamic-visual-editor.breakpoint_direction' => null]);
        $this->forget();
    }

    protected function tearDown(): void
    {
        $path = Features::settingsPath();

        if ($path && File::exists($path)) {
            File::delete($path);
        }

        $this->forget();

        parent::tearDown();
    }

    protected function forget(): void
    {
        Features::flush();
        Breakpoints::forget();
    }

    public function test_a_guest_may_not_post_a_size(): void
    {
        $this->postJson('/!/sve/breakpoints', ['handle' => 'wide'])->assertStatus(403);
    }

    public function test_a_new_size_is_written_beside_the_defaults_and_read_back_derived(): void
    {
        $list = Store::add([
            'handle' => 'tablet_landscape',
            'label' => 'Tablet liggende',
            'icon' => 'tablet_landscape',
            'min' => 56.25,
            'unit' => 'em',
            'width' => 1024,
        ]);

        // The settings file now holds the three defaults and the new row, as the screen would have saved them.
        $saved = YAML::file(Features::settingsPath())->parse();
        $this->assertSame(['laptop', 'tablet', 'mobile', 'tablet_landscape'], array_column($saved['breakpoints'], 'handle'));
        $this->assertSame(1024, $saved['breakpoints'][3]['width']);
        $this->assertSame(900, $saved['breakpoints'][3]['height'], 'height falls back to the default frame height');
        $this->assertSame('Tablet_landscape', $saved['breakpoints'][3]['device']);

        // The answer is the list the browser reads, sorted and derived.
        $this->assertSame(['laptop', 'tablet_landscape', 'tablet', 'mobile'], array_column($list, 'handle'));
        $this->assertSame('Tablet liggende', $list[1]['label']);
        $this->assertSame('(width < 64em)', $list[1]['media'], 'below the size above it');
        $this->assertSame('(width < 56.25em)', $list[2]['media'], 'tablet now ends where the new size starts');
        $this->assertSame('max-[56.25em]', $list[2]['tw']);

        // And the cached list was forgotten by the save itself.
        $this->assertSame(['laptop', 'tablet_landscape', 'tablet', 'mobile'], Breakpoints::handles());
    }

    public function test_a_handle_already_in_the_list_is_refused(): void
    {
        $this->expectException(ValidationException::class);

        try {
            Store::add(['handle' => 'tablet', 'icon' => 'tablet', 'min' => 50, 'unit' => 'em', 'width' => 800]);
        } catch (ValidationException $e) {
            $this->assertArrayHasKey('handle', $e->errors());
            $this->assertFalse(File::exists(Features::settingsPath()), 'nothing was written');

            throw $e;
        }
    }

    public function test_a_width_another_size_already_starts_at_is_refused(): void
    {
        $this->expectException(ValidationException::class);

        try {
            Store::add(['handle' => 'twin', 'icon' => 'tablet', 'min' => 768, 'unit' => 'px', 'width' => 800]);
        } catch (ValidationException $e) {
            $this->assertArrayHasKey('min', $e->errors(), '768px is 48em, which tablet already starts at');

            throw $e;
        }
    }

    public function test_a_bad_handle_icon_or_unit_is_refused(): void
    {
        foreach ([
            ['handle' => 'Tablet Wide'],
            ['handle' => '9wide'],
            ['icon' => 'toaster'],
            ['unit' => 'vw'],
            ['width' => 10],
        ] as $bad) {
            try {
                Store::add(array_merge(
                    ['handle' => 'wide', 'icon' => 'desktop', 'min' => 90, 'unit' => 'em', 'width' => 1600],
                    $bad
                ));
                $this->fail('expected a refusal for '.json_encode($bad));
            } catch (ValidationException $e) {
                $this->assertArrayHasKey(array_key_first($bad), $e->errors());
            }
        }
    }

    public function test_the_sixth_size_is_refused(): void
    {
        config(['statamic-visual-editor.breakpoints' => [
            ['handle' => 'a', 'min' => 100, 'unit' => 'em'],
            ['handle' => 'b', 'min' => 90, 'unit' => 'em'],
            ['handle' => 'c', 'min' => 80, 'unit' => 'em'],
            ['handle' => 'd', 'min' => 70, 'unit' => 'em'],
            ['handle' => 'e', 'min' => 0, 'unit' => 'em'],
        ]]);
        $this->forget();

        $this->expectException(ValidationException::class);

        Store::add(['handle' => 'f', 'icon' => 'desktop', 'min' => 60, 'unit' => 'em', 'width' => 1000]);
    }
}
