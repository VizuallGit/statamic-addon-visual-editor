<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Support\Facades\File;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\SiteCss;
use MarioHamann\StatamicVisualEditor\SiteCss\Root;
use Statamic\Facades\Antlers;

/**
 * The SVG folder is a setting (`svg_folder`): Site CSS lists and uploads there,
 * and Visual Build offers its icons. A file's `src` is what Statamic's own
 * `{{ svg }}` tag resolves to that very file — rendered here, so a Statamic
 * that looks elsewhere fails this test.
 */
class SvgFolderTest extends TestCase
{
    private string $name;

    protected function setUp(): void
    {
        parent::setUp();

        $this->name = 'sve-svg-'.uniqid();
        File::ensureDirectoryExists(public_path("{$this->name}/icons"));
        File::ensureDirectoryExists(resource_path("svg/{$this->name}"));
        File::put(public_path("{$this->name}/icons/star.svg"), '<svg xmlns="http://www.w3.org/2000/svg"><path d="M7 7h1"/></svg>');
        File::put(resource_path("svg/{$this->name}/hero.svg"), '<svg xmlns="http://www.w3.org/2000/svg"><path d="M3 3h2"/></svg>');
        SiteCss::use('svg');
    }

    protected function tearDown(): void
    {
        File::deleteDirectory(public_path($this->name));
        File::deleteDirectory(resource_path("svg/{$this->name}"));
        SiteCss::use('css');
        Features::flush();

        parent::tearDown();
    }

    private function folder(string $folder): void
    {
        config(['statamic-visual-editor.features.svg_folder' => $folder]);
        Features::flush();
    }

    private function render(string $src): string
    {
        return (string) Antlers::parse('{{ svg src="'.$src.'" }}', [], trusted: true);
    }

    public function test_empty_is_resources_svg(): void
    {
        $this->folder('');

        $this->assertSame(resource_path('svg'), Root::root());
    }

    public function test_a_folder_under_public_is_listed_and_its_src_renders_that_file(): void
    {
        $this->folder("public/{$this->name}");

        $this->assertSame(base_path("public/{$this->name}"), Root::root());
        $this->assertSame("public/{$this->name}", SiteCss::listing()['root']);
        $this->assertSame('icons/star.svg', SiteCss::listing()['tree'][0]['children'][0]['path']);

        $src = Root::svgSrc('icons/star.svg');

        $this->assertSame("{$this->name}/icons/star", $src);
        $this->assertStringContainsString('M7 7h1', $this->render($src));
    }

    public function test_a_subfolder_of_resources_svg_gives_the_src_from_resources_svg(): void
    {
        $this->folder("resources/svg/{$this->name}");

        $src = Root::svgSrc('hero.svg');

        $this->assertSame("{$this->name}/hero", $src);
        $this->assertStringContainsString('M3 3h2', $this->render($src));
    }

    public function test_an_icon_of_the_same_name_earlier_in_the_tags_order_is_never_the_answer(): void
    {
        // `<name>/icons/star` finds resources/svg/<name>/icons/star.svg before public/<name>/icons/star.svg.
        File::ensureDirectoryExists(resource_path("svg/{$this->name}/icons"));
        File::put(resource_path("svg/{$this->name}/icons/star.svg"), '<svg xmlns="http://www.w3.org/2000/svg"><path d="M9 9h9"/></svg>');
        $this->folder("public/{$this->name}");

        $this->assertStringContainsString('M9 9h9', $this->render("{$this->name}/icons/star"));
        $this->assertNull(Root::svgSrc('icons/star.svg'));
    }

    public function test_only_resources_and_public_are_accepted(): void
    {
        foreach (['app', 'vendor/x', '../etc', 'resources/../app', 'public//x', 'config'] as $folder) {
            $this->folder($folder);

            $this->assertNull(Root::svgFolder(), $folder);
            $this->assertSame(resource_path('svg'), Root::root(), $folder);
        }
    }

    public function test_the_setting_is_the_svgs_alone(): void
    {
        $this->folder("public/{$this->name}");
        SiteCss::use('css');

        $this->assertSame(resource_path('css'), Root::root());
    }

    public function test_builds_picker_lists_the_folder_with_the_src_statamic_draws(): void
    {
        $user = \Statamic\Facades\User::make()->email('svg-picker@example.com')->makeSuper();
        $user->save();
        $this->actingAs($user);
        config(['statamic-visual-editor.features.template_dock' => true, 'statamic-visual-editor.features.build_mode' => true]);
        $this->folder("public/{$this->name}");

        $icons = $this->getJson('/!/sve/element-fields/svgs')->assertOk()->json('icons');
        $star = collect($icons)->firstWhere('name', 'star');

        $this->assertSame("{$this->name}/icons/star", $star['src'] ?? null);
        $this->assertSame('icons', $star['folder']);
        $this->assertStringContainsString('M7 7h1', $star['svg']);
        $this->assertStringContainsString('M7 7h1', $this->render($star['src']));

        $user->delete();
    }

    public function test_builds_picker_refuses_while_build_is_off(): void
    {
        $user = \Statamic\Facades\User::make()->email('svg-picker-off@example.com')->makeSuper();
        $user->save();
        $this->actingAs($user);
        config(['statamic-visual-editor.features.build_mode' => false]);
        Features::flush();

        $this->getJson('/!/sve/element-fields/svgs')->assertForbidden();

        $user->delete();
    }
}
