<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\FileManager;

/**
 * The walls, not the window. Every test here is about a path that must not
 * resolve, or a file that must not be reachable — the browsing and editing on
 * top is only worth having if these hold.
 */
class FileManagerTest extends TestCase
{
    protected string $dir;

    protected function setUp(): void
    {
        parent::setUp();

        $this->dir = sys_get_temp_dir().'/sve-files-'.uniqid('', true);

        mkdir($this->dir.'/views/partials', 0777, true);
        mkdir($this->dir.'/dist/assets', 0777, true);
        mkdir($this->dir.'/empty', 0777, true);

        file_put_contents($this->dir.'/views/page.antlers.html', "<h1>Page</h1>\n");
        file_put_contents($this->dir.'/views/partials/hero.antlers.html', "<section>Hero</section>\n");
        file_put_contents($this->dir.'/site.css', "body { color: red; }\n");
        file_put_contents($this->dir.'/danger.php', "<?php echo 'no';\n");
        file_put_contents($this->dir.'/.env', "SECRET=1\n");
        file_put_contents($this->dir.'/dist/assets/built.js', "console.log(1);\n");

        config([
            'statamic-visual-editor.file_manager.root' => $this->dir,
            'statamic-visual-editor.file_manager.exclude' => FileManager::DEFAULT_EXCLUDE,
        ]);
    }

    protected function tearDown(): void
    {
        $this->rmrf($this->dir);

        parent::tearDown();
    }

    protected function rmrf(string $dir): void
    {
        if (! is_dir($dir)) {
            return;
        }

        foreach (array_diff(scandir($dir) ?: [], ['.', '..']) as $name) {
            $path = $dir.'/'.$name;
            is_dir($path) ? $this->rmrf($path) : @unlink($path);
        }

        @rmdir($dir);
    }

    /** @return list<string> */
    protected function paths(array $tree): array
    {
        $out = [];

        foreach ($tree as $node) {
            $out[] = $node['path'];

            if (($node['type'] ?? '') === 'dir') {
                $out = [...$out, ...$this->paths($node['children'] ?? [])];
            }
        }

        return $out;
    }

    public function test_the_tree_shows_editable_files_only()
    {
        $paths = $this->paths(FileManager::listing()['tree']);

        $this->assertContains('site.css', $paths);
        $this->assertContains('views/page.antlers.html', $paths);
        $this->assertContains('views/partials/hero.antlers.html', $paths);

        // PHP, dotfiles, built output and folders with nothing showable in them.
        $this->assertNotContains('danger.php', $paths);
        $this->assertNotContains('.env', $paths);
        $this->assertNotContains('dist', $paths);
        $this->assertNotContains('empty', $paths);
    }

    public function test_php_and_dotfiles_are_not_readable()
    {
        $this->assertNull(FileManager::read('danger.php'));
        $this->assertNull(FileManager::read('.env'));
        $this->assertNull(FileManager::existingPath('danger.php'));
    }

    public function test_traversal_is_refused()
    {
        foreach ([
            '../composer.json',
            '../../.env',
            'views/../../.env',
            '/etc/passwd',
            'views//page.antlers.html',
            './site.css',
        ] as $attempt) {
            $this->assertNull(FileManager::existingPath($attempt), $attempt);
            $this->assertNull(FileManager::normalize($attempt), $attempt);
        }
    }

    public function test_the_roles_file_is_not_reachable()
    {
        mkdir($this->dir.'/users', 0777, true);
        file_put_contents($this->dir.'/users/roles.yaml', "super:\n  super: true\n");

        $this->assertNull(FileManager::existingPath('users/roles.yaml'));
        $this->assertNull(FileManager::write('users/roles.yaml', 'anything'));
        $this->assertNotContains('users', $this->paths(FileManager::listing()['tree']));
    }

    public function test_excluded_folders_are_unreachable_even_by_name()
    {
        file_put_contents($this->dir.'/dist/assets/style.css', "a{}\n");

        $this->assertNull(FileManager::existingPath('dist/assets/style.css'));
        $this->assertNull(FileManager::normalize('dist/assets/style.css'));
    }

    public function test_reading_and_writing_a_file()
    {
        $file = FileManager::read('views/page.antlers.html');

        $this->assertSame("<h1>Page</h1>\n", $file['contents']);
        $this->assertSame('html', $file['language']);

        $this->assertNotNull(FileManager::write('views/page.antlers.html', '<h1>New</h1>'));
        $this->assertSame('<h1>New</h1>', file_get_contents($this->dir.'/views/page.antlers.html'));
    }

    public function test_writing_refuses_a_path_it_would_not_read()
    {
        $this->assertNull(FileManager::write('danger.php', '<?php exit;'));
        $this->assertNull(FileManager::write('../composer.json', '{}'));
        $this->assertSame("<?php echo 'no';\n", file_get_contents($this->dir.'/danger.php'));
    }

    public function test_creating_a_file_makes_missing_folders()
    {
        $file = FileManager::create('views/partials/new/thing.antlers.html');

        $this->assertSame('views/partials/new/thing.antlers.html', $file['path']);
        $this->assertFileExists($this->dir.'/views/partials/new/thing.antlers.html');
    }

    public function test_creating_refuses_php_and_traversal()
    {
        $this->assertNull(FileManager::create('shell.php'));
        $this->assertNull(FileManager::create('../shell.css'));
        $this->assertNull(FileManager::create('site.css'));
        $this->assertFileDoesNotExist($this->dir.'/shell.php');
    }

    public function test_creating_a_folder()
    {
        $this->assertSame(['path' => 'views/blocks'], FileManager::createFolder('views/blocks'));
        $this->assertDirectoryExists($this->dir.'/views/blocks');
        $this->assertNull(FileManager::createFolder('views/blocks'));
        $this->assertNull(FileManager::createFolder('../outside'));
    }

    public function test_renaming_a_file()
    {
        $file = FileManager::rename('site.css', 'brand.css');

        $this->assertSame('brand.css', $file['path']);
        $this->assertFileExists($this->dir.'/brand.css');
        $this->assertFileDoesNotExist($this->dir.'/site.css');
    }

    public function test_renaming_can_move_into_a_folder_that_is_not_there_yet()
    {
        $file = FileManager::rename('site.css', 'css/brand/site.css');

        $this->assertSame('css/brand/site.css', $file['path']);
        $this->assertFileExists($this->dir.'/css/brand/site.css');
    }

    public function test_renaming_will_not_overwrite_or_escape()
    {
        // A name already taken.
        $this->assertNull(FileManager::rename('site.css', 'danger.php'));
        $this->assertNull(FileManager::rename('site.css', 'views/page.antlers.html'));
        // Out of the root, into an excluded folder, or into a refused extension.
        $this->assertNull(FileManager::rename('site.css', '../escaped.css'));
        $this->assertNull(FileManager::rename('site.css', 'dist/site.css'));
        $this->assertNull(FileManager::rename('site.css', 'shell.php'));
        // The source has to be something this tool can see in the first place.
        $this->assertNull(FileManager::rename('danger.php', 'safe.css'));

        $this->assertFileExists($this->dir.'/site.css');
        $this->assertSame("<h1>Page</h1>\n", file_get_contents($this->dir.'/views/page.antlers.html'));
    }

    public function test_renaming_a_folder()
    {
        $out = FileManager::renameFolder('views/partials', 'views/blocks');

        $this->assertSame(['path' => 'views/blocks'], $out);
        $this->assertFileExists($this->dir.'/views/blocks/hero.antlers.html');
        $this->assertDirectoryDoesNotExist($this->dir.'/views/partials');
    }

    public function test_a_folder_with_something_invisible_in_it_will_not_move()
    {
        mkdir($this->dir.'/views/mixed', 0777, true);
        file_put_contents($this->dir.'/views/mixed/ok.antlers.html', "ok\n");
        file_put_contents($this->dir.'/views/mixed/hidden.php', "<?php\n");

        $this->assertNull(FileManager::renameFolder('views/mixed', 'views/moved'));
        $this->assertDirectoryExists($this->dir.'/views/mixed');
    }

    public function test_a_folder_cannot_be_moved_inside_itself()
    {
        $this->assertNull(FileManager::renameFolder('views', 'views/inner'));
        $this->assertDirectoryExists($this->dir.'/views');
    }

    public function test_deleting_a_file()
    {
        $this->assertTrue(FileManager::delete('site.css'));
        $this->assertFileDoesNotExist($this->dir.'/site.css');

        $this->assertFalse(FileManager::delete('danger.php'));
        $this->assertFileExists($this->dir.'/danger.php');
    }

    public function test_deleting_a_folder_takes_only_what_the_screen_showed()
    {
        $stats = FileManager::folderStats('views/partials');

        $this->assertSame(1, $stats['files']);
        $this->assertSame(0, $stats['hidden']);
        $this->assertTrue(FileManager::deleteFolder('views/partials'));
        $this->assertDirectoryDoesNotExist($this->dir.'/views/partials');
    }

    public function test_a_folder_holding_something_invisible_is_left_alone()
    {
        mkdir($this->dir.'/views/mixed', 0777, true);
        file_put_contents($this->dir.'/views/mixed/ok.antlers.html', "ok\n");
        file_put_contents($this->dir.'/views/mixed/hidden.php', "<?php\n");

        $this->assertSame(1, FileManager::folderStats('views/mixed')['hidden']);
        $this->assertFalse(FileManager::deleteFolder('views/mixed'));
        $this->assertFileExists($this->dir.'/views/mixed/ok.antlers.html');
        $this->assertFileExists($this->dir.'/views/mixed/hidden.php');
    }

    public function test_a_symlink_out_of_the_root_is_not_followed()
    {
        $outside = sys_get_temp_dir().'/sve-files-outside-'.uniqid('', true).'.css';
        file_put_contents($outside, "body{}\n");
        symlink($outside, $this->dir.'/escape.css');

        $this->assertNull(FileManager::existingPath('escape.css'));
        $this->assertNotContains('escape.css', $this->paths(FileManager::listing()['tree']));

        @unlink($this->dir.'/escape.css');
        @unlink($outside);
    }

    public function test_language_per_extension()
    {
        $this->assertSame('html', FileManager::language('views/page.antlers.html'));
        $this->assertSame('css', FileManager::language('site.css'));
        $this->assertSame('javascript', FileManager::language('app.js'));
        $this->assertSame('yaml', FileManager::language('blueprints/page.yaml'));
        $this->assertSame('text', FileManager::language('notes.md'));
    }
}
