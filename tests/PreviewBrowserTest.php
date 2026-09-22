<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\PreviewBrowser;

/**
 * The browser the previews need: where the site keeps it, whether it is there,
 * which failures a fetch fixes, and how the libraries it lacks are worked out
 * from `ldd` and apt — the parts that decide things, without a machine to run
 * apt on.
 */
class PreviewBrowserTest extends TestCase
{
    private string $cache;

    protected function setUp(): void
    {
        parent::setUp();

        $this->cache = sys_get_temp_dir().'/sve-pptr-'.uniqid();
        mkdir($this->cache, 0777, true);
        putenv('PUPPETEER_CACHE_DIR='.$this->cache);
    }

    protected function tearDown(): void
    {
        putenv('PUPPETEER_CACHE_DIR');
        exec('rm -rf '.escapeshellarg($this->cache));
        exec('rm -rf '.escapeshellarg(storage_path(PreviewBrowser::DIR)));

        parent::tearDown();
    }

    public function test_the_browser_lives_in_the_site_unless_puppeteer_is_pointed_elsewhere(): void
    {
        $this->assertSame($this->cache, PreviewBrowser::cacheDir());

        putenv('PUPPETEER_CACHE_DIR');

        $this->assertSame(storage_path('app/sve-browser/puppeteer'), PreviewBrowser::cacheDir());
        $this->assertSame(storage_path('app/sve-browser/libs'), PreviewBrowser::libsDir());
    }

    public function test_the_newest_build_in_the_cache_is_the_executable(): void
    {
        $this->assertNull(PreviewBrowser::executable());
        $this->assertFalse(PreviewBrowser::browserInstalled());

        $old = $this->fakeBuild('linux-140.0.7339.82', 'linux64');
        $new = $this->fakeBuild('linux-153.0.8010.36', 'linux64');
        $this->fakeBuild('linux-99.0.0.1', 'linux64');

        $this->assertSame($new, PreviewBrowser::executable());
        $this->assertTrue(PreviewBrowser::browserInstalled());
        $this->assertNotSame($old, PreviewBrowser::executable());

        // A version directory without a binary in it (a download that died) is not a browser.
        mkdir($this->cache.'/'.PreviewBrowser::BROWSER.'/linux-160.0.0.0/chrome-headless-shell-linux64', 0777, true);
        $this->assertSame($new, PreviewBrowser::executable());
    }

    public function test_ldd_names_what_is_not_found(): void
    {
        $ldd = <<<'TXT'
            linux-vdso.so.1 (0x00007ffd)
            libdl.so.2 => /lib/x86_64-linux-gnu/libdl.so.2 (0x00007f)
            libatk-1.0.so.0 => not found
            libXcomposite.so.1 => not found
            libatk-1.0.so.0 => not found
            libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f)
        TXT;

        $this->assertSame(['libatk-1.0.so.0', 'libXcomposite.so.1'], PreviewBrowser::parseLdd($ldd));
        $this->assertSame([], PreviewBrowser::parseLdd(''));
    }

    public function test_a_soname_maps_to_the_first_package_apt_knows(): void
    {
        // Ubuntu 24.04 knows the t64 name, 22.04 the old one; a library the
        // table never heard of is guessed by Debian's convention.
        $ubuntu24 = fn (string $p) => in_array($p, ['libatk1.0-0t64', 'libxrandr2', 'libfoo3'], true);
        $ubuntu22 = fn (string $p) => in_array($p, ['libatk1.0-0', 'libxrandr2', 'libfoo-3'], true);

        [$packages, $unknown] = PreviewBrowser::packagesFor(['libatk-1.0.so.0', 'libXrandr.so.2', 'libfoo.so.3', 'libnowhere.so.9'], $ubuntu24);
        $this->assertSame(['libatk1.0-0t64', 'libxrandr2', 'libfoo3'], $packages);
        $this->assertSame(['libnowhere.so.9'], $unknown);

        [$packages] = PreviewBrowser::packagesFor(['libatk-1.0.so.0', 'libXrandr.so.2', 'libfoo.so.3'], $ubuntu22);
        $this->assertSame(['libatk1.0-0', 'libxrandr2', 'libfoo-3'], $packages);

        // Two sonames from one package ask for it once.
        [$packages] = PreviewBrowser::packagesFor(['libnss3.so', 'libnssutil3.so'], fn () => true);
        $this->assertSame(['libnss3'], $packages);

        $this->assertSame(['libgbm1', 'libgbm-1', 'libgbm1t64', 'libgbm-1t64'], PreviewBrowser::candidates('libgbm.so.1'));
        $this->assertSame(['libnss3', 'libnss3t64'], PreviewBrowser::candidates('libnss3.so'));
    }

    public function test_dependencies_skip_what_is_met_and_take_the_first_open_alternative(): void
    {
        $depends = <<<'TXT'
            libatk-bridge2.0-0t64
              Depends: libatk1.0-0t64
              Depends: libatspi2.0-0t64
              Depends: libc6
              Depends: libdbus-1-3
              Depends: libglib2.0-0t64
            fontconfig-config
             |Depends: fonts-dejavu-core
             |Depends: fonts-liberation
              Depends: fonts-noto-core
              Depends: ucf
              PreDepends: debconf
              Depends: <perlapi-5.38>
                perl-base
            libgbm1
              Depends: libdrm2:amd64
             |Depends: libwayland-server0
              Depends: libwayland-server1
            TXT;

        $installed = array_fill_keys(['libc6', 'libdbus-1-3', 'libglib2.0-0t64', 'fonts-liberation', 'debconf', 'libatk1.0-0t64'], true);

        $this->assertSame(
            ['libatspi2.0-0t64', 'ucf', 'libdrm2', 'libwayland-server0'],
            PreviewBrowser::parseDepends($depends, $installed)
        );

        // fonts-liberation gone: the first font in the group is fetched, not all six.
        unset($installed['fonts-liberation']);
        $this->assertContains('fonts-dejavu-core', PreviewBrowser::parseDepends($depends, $installed));
        $this->assertNotContains('fonts-noto-core', PreviewBrowser::parseDepends($depends, $installed));
    }

    public function test_the_library_path_lists_the_fetched_directories_or_nothing(): void
    {
        putenv('PUPPETEER_CACHE_DIR');

        $this->assertNull(PreviewBrowser::libraryPath());

        $libs = PreviewBrowser::libsDir();
        mkdir($libs.'/usr/lib/x86_64-linux-gnu', 0777, true);
        mkdir($libs.'/lib/x86_64-linux-gnu', 0777, true);

        $this->assertSame(
            $libs.'/usr/lib/x86_64-linux-gnu:'.$libs.'/lib/x86_64-linux-gnu:'.$libs.'/usr/lib:'.$libs.'/lib',
            PreviewBrowser::libraryPath()
        );
    }

    public function test_a_missing_browser_or_library_earns_a_second_try(): void
    {
        $noBrowser = new \RuntimeException('explained', 0, new \RuntimeException('Error: Could not find chrome-headless-shell (ver. 140.0.7339.82). This can occur if…'));
        $noLibrary = new \RuntimeException('explained', 0, new \RuntimeException('Failed to launch the browser process! chrome-headless-shell: error while loading shared libraries: libatk-1.0.so.0: cannot open shared object file: No such file or directory'));
        $other = new \RuntimeException('The selector did not match any elements');

        $this->assertTrue(PreviewBrowser::isMissingBrowser($noBrowser));
        $this->assertFalse(PreviewBrowser::isMissingBrowser($noLibrary));
        $this->assertTrue(PreviewBrowser::isMissingLibrary($noLibrary));
        $this->assertFalse(PreviewBrowser::isMissingLibrary($other));
        $this->assertFalse(PreviewBrowser::repair($other));
    }

    private function fakeBuild(string $version, string $platform): string
    {
        $dir = $this->cache.'/'.PreviewBrowser::BROWSER.'/'.$version.'/'.PreviewBrowser::BROWSER.'-'.$platform;
        mkdir($dir, 0777, true);
        touch($dir.'/'.PreviewBrowser::BROWSER);

        return $dir.'/'.PreviewBrowser::BROWSER;
    }
}
