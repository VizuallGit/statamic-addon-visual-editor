<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Support\Facades\File;
use MarioHamann\StatamicVisualEditor\PreviewFingerprint;
use Statamic\Facades\Fieldset;
use Statamic\Fields\Fieldset as FieldsetModel;

class PreviewFingerprintTest extends TestCase
{
    protected string $partials = 'resources/test-sections';

    protected string $watched = 'resources/test-build.json';

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'statamic-visual-editor.previews.section_partials' => $this->partials,
            'statamic-visual-editor.previews.watch' => [$this->watched],
            'statamic-visual-editor.previews.watch_exclude' => [],
        ]);

        File::ensureDirectoryExists(base_path($this->partials.'/hero'));
        File::put(base_path($this->watched), '{"site.css":"a"}');
        File::put(base_path($this->partials.'/hero/style_1.antlers.html'), '<section>one</section>');
        File::put(base_path($this->partials.'/hero/style_2.antlers.html'), '<section>two</section>');

        PreviewFingerprint::flush();
    }

    protected function tearDown(): void
    {
        File::deleteDirectory(base_path($this->partials));
        File::deleteDirectory(resource_path('views/partials'));
        File::delete(resource_path('views/unreached.antlers.html'));
        File::delete(base_path($this->watched));

        parent::tearDown();
    }

    /**
     * Writes partials and puts `resources/views` under watch, so the design hash
     * covers them and the reachability split has something to divide.
     *
     * @param  array<string, string>  $views  view name => contents
     */
    protected function withViews(array $views): void
    {
        config(['statamic-visual-editor.previews.watch' => [$this->watched, 'resources/views']]);

        foreach ($views as $name => $contents) {
            $path = resource_path('views/'.(str_contains($name, '/') ? 'partials/' : '').$name.'.antlers.html');

            File::ensureDirectoryExists(dirname($path));
            File::put($path, $contents);
        }
    }

    /** The section types reachability is computed over. */
    protected function withSets(array $handles): void
    {
        Fieldset::shouldReceive('find')->with('page_sections')->andReturn(
            (new FieldsetModel)->setHandle('page_sections')->setContents([
                'fields' => [[
                    'handle' => 'page_sections',
                    'field' => [
                        'type' => 'replicator',
                        'sets' => ['main' => ['sets' => array_fill_keys($handles, ['fields' => []])]],
                    ],
                ]],
            ])
        );
    }

    public function test_the_same_inputs_give_the_same_fingerprint()
    {
        // What makes a refresh after every save affordable: unchanged means the
        // filename matches and no browser is started.
        $this->assertSame(
            PreviewFingerprint::forSectionType('hero/style_1', ['title' => 'a']),
            PreviewFingerprint::forSectionType('hero/style_1', ['title' => 'a']),
        );
    }

    public function test_changing_the_sections_data_changes_its_fingerprint()
    {
        $before = PreviewFingerprint::forSectionType('hero/style_1', ['title' => 'a']);

        $this->assertNotSame($before, PreviewFingerprint::forSectionType('hero/style_1', ['title' => 'b']));
    }

    public function test_editing_a_sections_own_partial_changes_only_its_fingerprint()
    {
        // The reason partials are fingerprinted per section instead of in one
        // bundle: editing one section must not re-photograph the whole site.
        $one = PreviewFingerprint::forSectionType('hero/style_1', []);
        $two = PreviewFingerprint::forSectionType('hero/style_2', []);

        File::put(base_path($this->partials.'/hero/style_1.antlers.html'), '<section>one, edited</section>');
        PreviewFingerprint::flush();

        $this->assertNotSame($one, PreviewFingerprint::forSectionType('hero/style_1', []));
        $this->assertSame($two, PreviewFingerprint::forSectionType('hero/style_2', []));
    }

    public function test_a_watched_design_file_changes_every_fingerprint()
    {
        // A rebuilt stylesheet or a new theme colour: every preview is now a
        // picture of a design the site no longer has.
        $one = PreviewFingerprint::forSectionType('hero/style_1', []);
        $two = PreviewFingerprint::forSectionType('hero/style_2', []);
        $sections = PreviewFingerprint::forSections([['type' => 'hero/style_1']]);

        File::put(base_path($this->watched), '{"site.css":"b"}');
        PreviewFingerprint::flush();

        $this->assertNotSame($one, PreviewFingerprint::forSectionType('hero/style_1', []));
        $this->assertNotSame($two, PreviewFingerprint::forSectionType('hero/style_2', []));
        $this->assertNotSame($sections, PreviewFingerprint::forSections([['type' => 'hero/style_1']]));
    }

    public function test_identical_content_in_a_rewritten_file_leaves_fingerprints_alone()
    {
        // Hashed by content, not modification time — a rebuild that produces the
        // same bytes must not invalidate a single preview.
        $before = PreviewFingerprint::forSectionType('hero/style_1', []);

        File::put(base_path($this->watched), '{"site.css":"a"}');
        touch(base_path($this->partials.'/hero/style_1.antlers.html'), time() + 60);
        PreviewFingerprint::flush();

        $this->assertSame($before, PreviewFingerprint::forSectionType('hero/style_1', []));
    }

    public function test_editing_a_shared_partial_changes_only_the_sections_that_include_it()
    {
        // The whole point of walking `{{ partial }}`: a component two sections
        // out of thirty use must cost two screenshots, not thirty. Before this,
        // every file under `resources/views` sat in one shared design hash.
        $this->withViews(['components/thing' => 'first']);
        $this->withSets(['hero/style_1', 'hero/style_2']);

        File::put(base_path($this->partials.'/hero/style_1.antlers.html'), '{{ partial:components/thing }}');
        PreviewFingerprint::flush();

        $one = PreviewFingerprint::forSectionType('hero/style_1', []);
        $two = PreviewFingerprint::forSectionType('hero/style_2', []);

        $this->withViews(['components/thing' => 'second']);
        PreviewFingerprint::flush();

        $this->assertNotSame($one, PreviewFingerprint::forSectionType('hero/style_1', []));
        $this->assertSame($two, PreviewFingerprint::forSectionType('hero/style_2', []));
    }

    public function test_a_watched_view_no_section_reaches_still_changes_every_fingerprint()
    {
        // The safety property that makes the split above safe to draw: a file no
        // section walks to — the layout, the page template, a header partial —
        // stays in the design hash rather than falling between the two and
        // quietly ceasing to invalidate anything at all.
        $this->withViews(['unreached' => 'first']);
        $this->withSets(['hero/style_1', 'hero/style_2']);

        PreviewFingerprint::flush();

        $one = PreviewFingerprint::forSectionType('hero/style_1', []);
        $two = PreviewFingerprint::forSectionType('hero/style_2', []);

        $this->withViews(['unreached' => 'second']);
        PreviewFingerprint::flush();

        $this->assertNotSame($one, PreviewFingerprint::forSectionType('hero/style_1', []));
        $this->assertNotSame($two, PreviewFingerprint::forSectionType('hero/style_2', []));
    }

    public function test_a_dynamic_partial_src_depends_on_the_whole_folder_it_names()
    {
        // `blocks/{type}` is resolved at render time, so the folder is as precise
        // as this can be. Erring wide costs a screenshot; erring narrow leaves a
        // thumbnail promising a design the site no longer has.
        $this->withViews(['blocks/one' => 'first', 'blocks/two' => 'first']);
        $this->withSets(['hero/style_1', 'hero/style_2']);

        File::put(base_path($this->partials.'/hero/style_1.antlers.html'), '{{ partial src="blocks/{type}" }}');
        PreviewFingerprint::flush();

        $one = PreviewFingerprint::forSectionType('hero/style_1', []);
        $two = PreviewFingerprint::forSectionType('hero/style_2', []);

        $this->withViews(['blocks/two' => 'second']);
        PreviewFingerprint::flush();

        $this->assertNotSame($one, PreviewFingerprint::forSectionType('hero/style_1', []));
        $this->assertSame($two, PreviewFingerprint::forSectionType('hero/style_2', []));
    }

    public function test_a_saved_sections_fingerprint_follows_the_partials_of_the_types_in_it()
    {
        $before = PreviewFingerprint::forSections([['type' => 'hero/style_2']]);

        File::put(base_path($this->partials.'/hero/style_2.antlers.html'), '<section>two, edited</section>');
        PreviewFingerprint::flush();

        $this->assertNotSame($before, PreviewFingerprint::forSections([['type' => 'hero/style_2']]));
    }
}
