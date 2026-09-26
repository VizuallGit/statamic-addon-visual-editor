<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Http\Controllers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Facades\User;

/**
 * The Fonts tab's endpoints: gated like the Theme panel, only fonts in, and
 * the answer is always the new listing so the dropdowns update at once.
 */
class FontsControllerTest extends TestCase
{
    private string $dir;

    protected function setUp(): void
    {
        parent::setUp();

        $this->dir = sys_get_temp_dir().'/sve-fonts-http-'.uniqid('', true);
        mkdir($this->dir, 0777, true);
        config([
            'statamic-visual-editor.fonts.root' => $this->dir,
            'statamic-visual-editor.features.site_css' => true,
        ]);
        Features::flush();
        Cache::flush();

        $user = User::make()->email('designer@example.com')->makeSuper();
        $user->save();
        $this->actingAs($user);
    }

    protected function tearDown(): void
    {
        foreach (new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($this->dir, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST) as $f) {
            $f->isDir() ? rmdir($f->getPathname()) : unlink($f->getPathname());
        }

        rmdir($this->dir);
        User::findByEmail('designer@example.com')?->delete();
        Features::flush();

        parent::tearDown();
    }

    public function test_the_tab_is_closed_when_the_theme_panel_is(): void
    {
        config(['statamic-visual-editor.features.site_css' => false]);
        Features::flush();

        $this->getJson('/!/sve/fonts')->assertForbidden();
        $this->postJson('/!/sve/fonts/adobe', ['kit' => 'abc1234'])->assertForbidden();
    }

    public function test_an_uploaded_font_is_stored_under_its_family_and_listed(): void
    {
        $file = UploadedFile::fake()->createWithContent('My-Font-Bold.ttf', "\x00\x01\x00\x00".str_repeat("\0", 60));

        $response = $this->post('/!/sve/fonts/upload', ['file' => $file, 'family' => 'My Font', 'weight' => '700', 'style' => 'normal'])
            ->assertOk();

        $this->assertSame(1, $response->json('added'));
        $this->assertSame('My Font', $response->json('families.0.name'));
        $this->assertSame('700', $response->json('families.0.faces.0.weight'));
        $this->assertFileExists($this->dir.'/my-font/my-font-bold.ttf');
        $this->assertStringContainsString('src: url("my-font/my-font-bold.ttf") format("truetype");', file_get_contents($this->dir.'/fonts.css'));
    }

    public function test_a_file_that_is_not_a_font_is_refused(): void
    {
        $file = UploadedFile::fake()->createWithContent('evil.woff2', '<?php echo "hi";');

        $this->post('/!/sve/fonts/upload', ['file' => $file, 'family' => 'Evil', 'weight' => '400'], ['Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJson(['error' => 'not_a_font']);

        $this->assertFileDoesNotExist($this->dir.'/fonts.css');
    }

    public function test_an_adobe_kit_is_added_once_with_its_families(): void
    {
        Http::fake(['use.typekit.net/*' => Http::response('@font-face{font-family:"proxima-nova";}')]);

        $this->postJson('/!/sve/fonts/adobe', ['kit' => 'https://use.typekit.net/abc1234.css'])
            ->assertOk()
            ->assertJson(['added' => 1, 'kits' => [['url' => 'https://use.typekit.net/abc1234.css', 'families' => ['proxima-nova']]]]);
        $this->postJson('/!/sve/fonts/adobe', ['kit' => 'abc1234'])->assertOk()->assertJson(['added' => 0]);
        $this->postJson('/!/sve/fonts/adobe', ['kit' => 'https://example.com/x.css'])->assertStatus(422);
    }

    public function test_only_styles_and_scripts_the_catalog_lists_are_fetched(): void
    {
        Cache::put('sve-google-fonts-v1', [['family' => 'Lato', 'category' => 'Sans Serif', 'variants' => ['400'], 'subsets' => ['latin'], 'axis' => null]], 60);
        Http::fake();

        $this->getJson('/!/sve/fonts/google/plan?family=Nope&variants[]=400&subsets[]=latin')->assertNotFound();
        $this->getJson('/!/sve/fonts/google/plan?family=Lato&variants[]=900&subsets[]=latin')->assertStatus(422);
        $this->postJson('/!/sve/fonts/google', ['family' => 'Lato', 'variants' => ['400'], 'subsets' => ['klingon']])->assertStatus(422);

        Http::assertNothingSent();
    }
}
