<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use InvalidArgumentException;
use MarioHamann\StatamicVisualEditor\AnimationPresets;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Tags\SveAnimation;
use Statamic\Facades\User;
use Symfony\Component\Yaml\Yaml;

class AnimationPresetsTest extends TestCase
{
    private string $dir;

    protected function setUp(): void
    {
        parent::setUp();

        $this->dir = sys_get_temp_dir().'/sve-anim-presets-'.uniqid();
        mkdir($this->dir.'/views/partials', 0775, true);
        config(['statamic-visual-editor.animations.file' => $this->dir.'/visual-editor/animations.yaml']);
    }

    protected function tearDown(): void
    {
        foreach (new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($this->dir, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST) as $file) {
            $file->isDir() ? rmdir($file->getPathname()) : unlink($file->getPathname());
        }

        rmdir($this->dir);

        parent::tearDown();
    }

    public function test_a_site_without_the_file_has_none(): void
    {
        $this->assertSame([], AnimationPresets::all());
    }

    public function test_a_saved_look_comes_back_in_the_shape_of_presets_json(): void
    {
        $saved = AnimationPresets::save('  Soft   rise ', ['--anim-opacity' => '0', '--anim-y' => '3rem', '--anim-ease' => 'cubic-bezier(.22, 1, .36, 1)']);

        $this->assertSame([
            'handle' => 'my-soft-rise',
            'kind' => 'self',
            'label_da' => 'Soft rise',
            'label_en' => 'Soft rise',
            'vars' => ['--anim-opacity' => '0', '--anim-y' => '3rem', '--anim-ease' => 'cubic-bezier(.22, 1, .36, 1)'],
        ], $saved);
        $this->assertSame([$saved], AnimationPresets::all());
        $this->assertSame('my-soft-rise', Yaml::parseFile(AnimationPresets::file())['presets'][0]['handle']);
    }

    public function test_a_second_preset_of_the_same_name_gets_a_handle_of_its_own(): void
    {
        AnimationPresets::save('Soft rise', ['--anim-y' => '3rem']);

        $this->assertSame('my-soft-rise-2', AnimationPresets::save('Soft rise', ['--anim-y' => '1rem'])['handle']);
        $this->assertSame('my-preset', AnimationPresets::save('!!!', ['--anim-y' => '1rem'])['handle']);
    }

    public function test_only_the_look_is_kept_and_nothing_that_could_leave_the_style(): void
    {
        $saved = AnimationPresets::save('Safe', [
            '--anim-y' => '2rem',
            '--anim-duration' => '2s',
            '--anim-x' => '1rem; } body { display: none',
            '--anim-blur' => '<script>',
            'color' => 'red',
            '--anim-scale' => 0.5,
        ]);

        $this->assertSame(['--anim-y' => '2rem', '--anim-scale' => '0.5'], $saved['vars']);
    }

    public function test_a_preset_needs_a_name_and_a_value(): void
    {
        $this->expectException(InvalidArgumentException::class);

        AnimationPresets::save('Nothing', ['--anim-duration' => '2s']);
    }

    public function test_a_hand_edited_file_with_a_bad_row_keeps_the_good_ones(): void
    {
        mkdir(dirname(AnimationPresets::file()), 0775, true);
        file_put_contents(AnimationPresets::file(), Yaml::dump(['presets' => [
            ['handle' => 'my-good', 'label' => 'Good', 'vars' => ['--anim-y' => '1rem']],
            ['handle' => 'fade-up', 'label' => 'Not ours', 'vars' => ['--anim-y' => '1rem']],
            ['handle' => 'my-empty', 'label' => 'Empty', 'vars' => ['--anim-y' => '1rem;}']],
            'nonsense',
        ]], 4, 2));

        $this->assertSame(['my-good'], array_column(AnimationPresets::all(), 'handle'));
    }

    public function test_delete_takes_it_out_of_the_file(): void
    {
        AnimationPresets::save('One', ['--anim-y' => '1rem']);
        AnimationPresets::save('Two', ['--anim-y' => '2rem']);

        $this->assertTrue(AnimationPresets::delete('my-one'));
        $this->assertFalse(AnimationPresets::delete('my-one'));
        $this->assertSame(['my-two'], array_column(AnimationPresets::all(), 'handle'));
    }

    public function test_usage_counts_the_templates_that_still_name_it(): void
    {
        file_put_contents($this->dir.'/views/partials/a.antlers.html', '<div data-anim="self" data-anim-preset="my-one"></div>');
        file_put_contents($this->dir.'/views/b.antlers.html', '<div data-anim-preset="my-one-2"></div>');

        $this->assertSame(1, AnimationPresets::usage('my-one', $this->dir.'/views'));
        $this->assertSame(0, AnimationPresets::usage('my-two', $this->dir.'/views'));
        $this->assertSame(0, AnimationPresets::usage('fade-up', $this->dir.'/views'));
    }

    public function test_a_guest_can_neither_save_nor_delete(): void
    {
        $this->postJson('/!/sve/animation-presets', ['label' => 'Soft', 'vars' => ['--anim-y' => '1rem']])->assertStatus(403);
        $this->getJson('/!/sve/animation-presets/usage?handle=my-soft')->assertStatus(403);
        $this->postJson('/!/sve/animation-presets/delete', ['handle' => 'my-soft'])->assertStatus(403);
        $this->assertFileDoesNotExist(AnimationPresets::file());
    }

    /* A POST that answers 4xx is a rejected save to the CP (save-errors.js), so
     * "still used" is asked as a GET and the delete always deletes. */
    public function test_usage_is_asked_before_a_delete_that_always_deletes(): void
    {
        $user = User::make()->email('anim-presets@example.com')->makeSuper();
        $user->save();
        $this->actingAs($user);
        config(['statamic-visual-editor.features.template_dock' => true, 'statamic-visual-editor.features.build_mode' => true]);
        Features::flush();

        $this->postJson('/!/sve/animation-presets', ['label' => 'Soft', 'kind' => 'children', 'vars' => ['--anim-y' => '1rem'], 'timing' => ['step' => 90]])
            ->assertOk()
            ->assertJsonPath('preset.handle', 'my-soft')
            ->assertJsonPath('preset.kind', 'children')
            ->assertJsonPath('preset.timing', ['step' => 90]);
        $this->postJson('/!/sve/animation-presets', ['handle' => 'my-soft', 'vars' => ['--anim-y' => '3rem'], 'timing' => ['step' => 70]])
            ->assertOk()
            ->assertJsonPath('preset.vars', ['--anim-y' => '3rem'])
            ->assertJsonPath('preset.timing', ['step' => 70])
            ->assertJsonPath('presets.0.kind', 'children');
        $this->postJson('/!/sve/animation-presets', ['handle' => 'fade-up', 'vars' => ['--anim-y' => '3rem']])->assertNotFound();
        $this->getJson('/!/sve/animation-presets/usage?handle=my-soft')->assertOk()->assertExactJson(['used' => 0]);
        $this->postJson('/!/sve/animation-presets/delete', ['handle' => 'my-soft'])->assertOk()->assertExactJson(['presets' => []]);
        $this->postJson('/!/sve/animation-presets/delete', ['handle' => 'my-soft'])->assertNotFound();

        $user->delete();
    }

    public function test_the_tag_writes_a_rule_for_an_own_preset_beside_the_addons(): void
    {
        AnimationPresets::save('Soft rise', ['--anim-opacity' => '0', '--anim-y' => '3rem']);

        $css = SveAnimation::css();

        $this->assertStringContainsString('[data-anim-preset="my-soft-rise"] { --anim-preset-opacity: 0; --anim-preset-y: 3rem; }', $css);
        $this->assertStringContainsString('[data-anim-preset="fade-up"]', $css);
        $this->assertCount(49, SveAnimation::presets());
    }

    public function test_a_preset_is_for_one_kind_and_one_from_before_kinds_is_an_elements(): void
    {
        $this->assertSame('children', AnimationPresets::save('Rise', ['--anim-y' => '1rem'], 'children')['kind']);
        $this->assertSame('self', AnimationPresets::save('Odd', ['--anim-y' => '1rem'], 'hover')['kind']);
        $this->assertSame('self', AnimationPresets::save('None', ['--anim-y' => '1rem'], null)['kind']);

        file_put_contents(AnimationPresets::file(), Yaml::dump(['presets' => [
            ['handle' => 'my-old', 'label' => 'Old', 'vars' => ['--anim-y' => '1rem']],
            ['handle' => 'my-words', 'label' => 'Words', 'kind' => 'words', 'vars' => ['--anim-y' => '1rem']],
        ]], 4, 2));

        $this->assertSame(['self', 'words'], array_column(AnimationPresets::all(), 'kind'));
    }

    public function test_timing_is_whole_ms_from_0_to_60000_and_only_duration_delay_and_step(): void
    {
        $saved = AnimationPresets::save('Cascade', ['--anim-y' => '1rem'], 'children', ['duration' => 600, 'delay' => '120', 'step' => 80.5, 'wait' => 10]);

        $this->assertSame(['duration' => 600, 'delay' => 120], $saved['timing']);

        $bad = AnimationPresets::save('Bad', ['--anim-y' => '1rem'], 'words', ['duration' => 60001, 'delay' => -1, 'step' => '8; }']);

        $this->assertArrayNotHasKey('timing', $bad, 'nothing left: no timing at all');

        $rows = Yaml::parseFile(AnimationPresets::file())['presets'];

        $this->assertSame(['handle', 'label', 'kind', 'vars', 'timing'], array_keys($rows[0]));
        $this->assertSame(['handle', 'label', 'kind', 'vars'], array_keys($rows[1]));
    }

    public function test_a_ticker_keeps_only_its_round_and_a_stack_its_top_and_offset(): void
    {
        $ticker = AnimationPresets::save('Slow', [], 'ticker', ['duration' => 40000]);
        $stack = AnimationPresets::save('Airy', ['--anim-stack-top' => '6rem', '--anim-stack-gap' => '2rem', '--anim-gap' => '3rem'], 'stack');

        $this->assertSame(['handle' => 'my-slow', 'kind' => 'ticker', 'label_da' => 'Slow', 'label_en' => 'Slow', 'vars' => [], 'timing' => ['duration' => 40000]], $ticker);
        $this->assertSame(['--anim-stack-top' => '6rem', '--anim-stack-gap' => '2rem'], $stack['vars']);
        $this->assertSame(['my-slow', 'my-airy'], array_column(AnimationPresets::all(), 'handle'), 'a timing alone is a preset, read back too');
    }

    public function test_update_gives_an_own_preset_a_new_look_and_timing_and_keeps_its_name_and_kind(): void
    {
        AnimationPresets::save('Cascade', ['--anim-y' => '1rem'], 'children', ['duration' => 600, 'step' => 80]);

        $updated = AnimationPresets::update('my-cascade', ['--anim-y' => '2rem', '--anim-x' => '1rem; }'], ['step' => 90]);

        $this->assertSame(['handle' => 'my-cascade', 'kind' => 'children', 'label_da' => 'Cascade', 'label_en' => 'Cascade', 'vars' => ['--anim-y' => '2rem'], 'timing' => ['step' => 90]], $updated);
        $this->assertSame([$updated], AnimationPresets::all());
        $this->assertStringContainsString('[data-anim-preset="my-cascade"] { --anim-preset-y: 2rem; }', SveAnimation::css());
    }

    public function test_the_addons_presets_are_not_the_sites_to_update(): void
    {
        AnimationPresets::save('Cascade', ['--anim-y' => '1rem'], 'children');

        $this->assertNull(AnimationPresets::update('fade-up', ['--anim-y' => '9rem']));
        $this->assertNull(AnimationPresets::update('my-nothing', ['--anim-y' => '9rem']));
        $this->assertStringContainsString('[data-anim-preset="fade-up"] { --anim-preset-opacity: 0; --anim-preset-y: 2rem; }', SveAnimation::css());

        $this->expectException(InvalidArgumentException::class);

        AnimationPresets::update('my-cascade', ['--anim-duration' => '2s']);
    }

    public function test_a_recipes_own_preset_is_written_onto_the_element_and_has_no_rule(): void
    {
        AnimationPresets::save('Far', ['--anim-y' => '6rem'], 'parallax');
        AnimationPresets::save('Words up', ['--anim-y' => '6rem'], 'words', ['step' => 40]);

        $css = SveAnimation::css();

        $this->assertStringNotContainsString('my-far', $css);
        $this->assertStringContainsString('[data-anim-preset="my-words-up"] { --anim-preset-y: 6rem; }', $css);
    }
}
