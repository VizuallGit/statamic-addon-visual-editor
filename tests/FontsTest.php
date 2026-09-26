<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use MarioHamann\StatamicVisualEditor\Fonts\AdobeKits;
use MarioHamann\StatamicVisualEditor\Fonts\Folder;
use MarioHamann\StatamicVisualEditor\Fonts\GoogleFonts;
use MarioHamann\StatamicVisualEditor\Fonts\Listing;
use MarioHamann\StatamicVisualEditor\Fonts\Stylesheet;
use MarioHamann\StatamicVisualEditor\Fonts\Uploads;

/**
 * The fonts folder and its fonts.css: read back as the editor wrote it or as
 * someone edited it, and only ever added to — no face, comment or file that
 * was there before is changed or removed.
 */
class FontsTest extends TestCase
{
    private string $dir;

    private const SEEDED = <<<'CSS'
/* The site's fonts — hand-written note that must survive. */

/* Inter */
@font-face {
  font-family: "Inter";
  src: url("Inter.woff2") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

/* BarlowCondensed */
@font-face {
  font-family: 'BarlowCondensed';
  src: url('/fonts/BarlowCondensed-Bold.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
  size-adjust: 98%;
}
CSS;

    protected function setUp(): void
    {
        parent::setUp();

        $this->dir = sys_get_temp_dir().'/sve-fonts-'.uniqid('', true);
        mkdir($this->dir, 0777, true);
        config(['statamic-visual-editor.fonts.root' => $this->dir, 'statamic-visual-editor.fonts.url' => '/fonts']);
        Cache::flush();
    }

    protected function tearDown(): void
    {
        foreach (new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($this->dir, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST) as $f) {
            $f->isDir() ? rmdir($f->getPathname()) : unlink($f->getPathname());
        }

        rmdir($this->dir);

        parent::tearDown();
    }

    private function seedFonts(): void
    {
        file_put_contents($this->dir.'/fonts.css', self::SEEDED);
        file_put_contents($this->dir.'/Inter.woff2', 'wOF2'.str_repeat('x', 96));
        file_put_contents($this->dir.'/BarlowCondensed-Bold.woff2', 'wOF2'.str_repeat('y', 46));
    }

    private function css(): string
    {
        return (string) file_get_contents($this->dir.'/fonts.css');
    }

    /** Every line of the seed is still there, in the same order. */
    private function assertSeedKept(): void
    {
        $css = $this->css();
        $at = 0;

        foreach (explode("\n", self::SEEDED) as $line) {
            $found = strpos($css, $line, $at);
            $this->assertNotFalse($found, "line gone or moved: {$line}");
            $at = $found + strlen($line);
        }
    }

    public function test_faces_are_read_back_whichever_quotes_and_paths_were_written(): void
    {
        $this->seedFonts();
        $faces = Stylesheet::faces();

        $this->assertCount(2, $faces);
        $this->assertSame(['Inter', 'Inter.woff2', 'woff2', '100 900', 'normal'], [$faces[0]['family'], $faces[0]['file'], $faces[0]['format'], $faces[0]['weight'], $faces[0]['style']]);
        $this->assertSame(['BarlowCondensed', 'BarlowCondensed-Bold.woff2', '700', 'normal'], [$faces[1]['family'], $faces[1]['file'], $faces[1]['weight'], $faces[1]['style']]);
    }

    public function test_the_listing_groups_faces_by_family_with_sizes(): void
    {
        $this->seedFonts();
        $listing = Listing::get();

        $this->assertSame(['BarlowCondensed', 'Inter'], array_column($listing['families'], 'name'));
        $this->assertSame(100, $listing['families'][1]['bytes']);
        $this->assertSame('/fonts/Inter.woff2', $listing['families'][1]['faces'][0]['url']);
        $this->assertFalse($listing['families'][1]['faces'][0]['missing']);
        $this->assertTrue($listing['writable']);
        $this->assertSame('/fonts/fonts.css', $listing['stylesheet']);
    }

    public function test_a_new_family_is_added_at_the_end_under_its_name(): void
    {
        $this->seedFonts();

        $added = Stylesheet::addFaces('Rubik', [
            ['file' => 'rubik/rubik-300-900-latin.woff2', 'format' => 'woff2', 'weight' => '300 900', 'style' => 'normal', 'unicodeRange' => 'U+0000-00FF'],
        ]);

        $this->assertSame(1, $added);
        $this->assertSeedKept();
        $this->assertStringEndsWith("/* Rubik */\n@font-face {\n  font-family: \"Rubik\";\n  src: url(\"rubik/rubik-300-900-latin.woff2\") format(\"woff2\");\n  font-weight: 300 900;\n  font-style: normal;\n  font-display: swap;\n  unicode-range: U+0000-00FF;\n}\n", $this->css());
    }

    public function test_more_of_a_family_goes_after_its_last_face_and_a_known_file_is_not_added_twice(): void
    {
        $this->seedFonts();

        $added = Stylesheet::addFaces('Inter', [
            ['file' => 'Inter.woff2', 'format' => 'woff2', 'weight' => '100 900', 'style' => 'normal'],
            ['file' => 'inter/inter-italic.woff2', 'format' => 'woff2', 'weight' => '100 900', 'style' => 'italic'],
        ]);

        $css = $this->css();

        $this->assertSame(1, $added);
        $this->assertSeedKept();
        $this->assertSame(1, substr_count($css, 'url("Inter.woff2")'));
        $this->assertLessThan(strpos($css, '/* BarlowCondensed */'), strpos($css, 'inter/inter-italic.woff2'));
        $this->assertSame(0, Stylesheet::addFaces('Inter', [['file' => 'inter/inter-italic.woff2', 'format' => 'woff2', 'weight' => '100 900', 'style' => 'italic']]));
    }

    public function test_a_kit_is_imported_before_the_first_rule_and_after_the_last_import(): void
    {
        $this->seedFonts();

        $this->assertTrue(Stylesheet::addImport('https://use.typekit.net/abc1234.css'));
        $this->assertTrue(Stylesheet::addImport('https://use.typekit.net/def5678.css'));
        $this->assertFalse(Stylesheet::addImport('https://use.typekit.net/abc1234.css'));

        $css = $this->css();

        $this->assertSeedKept();
        $this->assertSame(['https://use.typekit.net/abc1234.css', 'https://use.typekit.net/def5678.css'], Stylesheet::imports());
        $this->assertLessThan(strpos($css, '/* Inter */'), strpos($css, 'def5678'));
        $this->assertLessThan(strpos($css, 'def5678'), strpos($css, 'abc1234'));
    }

    public function test_a_first_font_creates_the_file_with_its_header(): void
    {
        Stylesheet::addFaces('Lato', [['file' => 'lato/lato-400-latin.woff2', 'format' => 'woff2', 'weight' => '400', 'style' => 'normal']]);

        $this->assertStringStartsWith('/*', $this->css());
        $this->assertSame(['Lato'], array_column(Stylesheet::faces(), 'family'));
    }

    public function test_a_file_is_never_overwritten_by_other_bytes(): void
    {
        $this->assertSame('a/font.woff2', Folder::store('a/font.woff2', 'wOF2one'));
        $this->assertSame('a/font.woff2', Folder::store('a/font.woff2', 'wOF2one'));
        $this->assertSame('a/font-2.woff2', Folder::store('a/font.woff2', 'wOF2two'));
        $this->assertSame('wOF2one', file_get_contents($this->dir.'/a/font.woff2'));
        $this->assertSame('wOF2two', file_get_contents($this->dir.'/a/font-2.woff2'));
    }

    public function test_names_are_made_safe_for_css_and_paths(): void
    {
        $this->assertSame('Barlow Condensed', Folder::family('  Barlow   Condensed '));
        $this->assertSame('Evil body x y font', Folder::family('Evil"; } body { x: y font'));
        $this->assertNull(Folder::family('";{}'));
        $this->assertSame('barlow-condensed', Folder::slug('Barlow Condensed'));
        $this->assertSame('font', Folder::slug('../..'));
    }

    public function test_an_upload_is_known_by_its_bytes_and_its_weight_is_checked(): void
    {
        $this->assertSame('woff2', Uploads::extension('wOF2....'));
        $this->assertSame('ttf', Uploads::extension("\x00\x01\x00\x00...."));
        $this->assertSame('otf', Uploads::extension('OTTO....'));
        $this->assertNull(Uploads::extension('<?php echo 1;'));
        $this->assertSame('400', Uploads::weight('400'));
        $this->assertSame('100 900', Uploads::weight('900 100'));
        $this->assertSame('700', Uploads::weight('700 700'));
        $this->assertNull(Uploads::weight('bold'));
        $this->assertNull(Uploads::weight('0'));
        $this->assertNull(Uploads::weight('1200'));
    }

    public function test_an_adobe_kit_is_read_from_what_adobe_offers_to_copy(): void
    {
        $this->assertSame('https://use.typekit.net/abc1234.css', AdobeKits::url('https://use.typekit.net/abc1234.css'));
        $this->assertSame('https://use.typekit.net/abc1234.css', AdobeKits::url('<link rel="stylesheet" href="https://use.typekit.net/abc1234.css">'));
        $this->assertSame('https://use.typekit.net/abc1234.css', AdobeKits::url('abc1234'));
        $this->assertNull(AdobeKits::url('https://evil.example/abc.css'));

        Http::fake(['use.typekit.net/*' => Http::response('@font-face{font-family:"proxima-nova";src:url(x)} @font-face{font-family:"proxima-nova";} @font-face{font-family:"museo-sans";}')]);

        $this->assertSame(['museo-sans', 'proxima-nova'], AdobeKits::families('https://use.typekit.net/abc1234.css'));
    }

    public function test_the_css2_query_asks_a_variable_family_for_its_whole_range(): void
    {
        $rubik = ['family' => 'Rubik', 'variants' => ['300', '400', '700', '300i', '400i'], 'subsets' => ['latin'], 'axis' => [300, 900]];
        $lato = ['family' => 'Lato', 'variants' => ['400', '700', '400i'], 'subsets' => ['latin'], 'axis' => null];

        $this->assertSame('Rubik:wght@300..900', GoogleFonts::query($rubik, ['400', '700']));
        $this->assertSame('Rubik:ital,wght@0,300..900;1,300..900', GoogleFonts::query($rubik, ['700', '300i']));
        $this->assertSame('Lato:wght@400;700', GoogleFonts::query($lato, ['700', '400']));
        $this->assertSame('Lato:ital,wght@0,400;1,400', GoogleFonts::query($lato, ['400i', '400']));
        $this->assertSame('Open+Sans:wght@400', GoogleFonts::query(['family' => 'Open Sans', 'axis' => null], ['400']));
    }

    public function test_css2_faces_carry_the_script_google_labels_them_with(): void
    {
        $faces = GoogleFonts::parse($this->css2());

        $this->assertSame(['latin-ext', 'latin', '[3]'], array_column($faces, 'subset'));
        $this->assertSame('https://fonts.gstatic.com/s/lato/latin.woff2', $faces[1]['url']);
        $this->assertSame('U+0000-00FF', $faces[1]['unicodeRange']);
    }

    public function test_a_google_font_is_downloaded_into_its_folder_and_listed(): void
    {
        $this->seedFonts();
        Cache::put('sve-google-fonts-v1', [['family' => 'Lato', 'category' => 'Sans Serif', 'variants' => ['400', '700'], 'subsets' => ['latin', 'latin-ext'], 'axis' => null]], 60);
        Http::fake([
            'fonts.googleapis.com/*' => Http::response($this->css2()),
            'fonts.gstatic.com/*' => Http::response('wOF2'.str_repeat('z', 20)),
        ]);

        $font = GoogleFonts::find('Lato');
        $added = GoogleFonts::install($font, ['400'], ['latin']);

        $this->assertSame(1, $added);
        $this->assertFileExists($this->dir.'/lato/lato-400-latin.woff2');
        $this->assertSeedKept();
        $this->assertSame(['Lato', 'lato/lato-400-latin.woff2', 'U+0000-00FF'], (function () {
            $face = collect(Stylesheet::faces())->firstWhere('family', 'Lato');

            return [$face['family'], $face['file'], $face['unicodeRange']];
        })());
        Http::assertSent(fn ($request) => str_contains($request->url(), 'css2?family=Lato:wght@400&display=swap') && str_contains($request->header('User-Agent')[0] ?? '', 'Chrome'));
    }

    private function css2(): string
    {
        return <<<'CSS'
/* latin-ext */
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/lato/latin-ext.woff2) format('woff2');
  unicode-range: U+0100-02BA;
}
/* latin */
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/lato/latin.woff2) format('woff2');
  unicode-range: U+0000-00FF;
}
/* [3] */
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/lato/slice3.woff2) format('woff2');
  unicode-range: U+4E00-4E3F;
}
CSS;
    }
}
