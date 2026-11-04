<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use InvalidArgumentException;
use MarioHamann\StatamicVisualEditor\AnimationPresets;
use MarioHamann\StatamicVisualEditor\Tags\SveAnimation;
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
            'group' => 'own',
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
        $this->postJson('/!/sve/animation-presets/delete', ['handle' => 'my-soft'])->assertStatus(403);
        $this->assertFileDoesNotExist(AnimationPresets::file());
    }

    public function test_the_tag_writes_a_rule_for_an_own_preset_beside_the_addons(): void
    {
        AnimationPresets::save('Soft rise', ['--anim-opacity' => '0', '--anim-y' => '3rem']);

        $css = SveAnimation::css();

        $this->assertStringContainsString('[data-anim-preset="my-soft-rise"] { --anim-preset-opacity: 0; --anim-preset-y: 3rem; }', $css);
        $this->assertStringContainsString('[data-anim-preset="fade-up"]', $css);
        $this->assertCount(25, SveAnimation::presets());
    }
}
