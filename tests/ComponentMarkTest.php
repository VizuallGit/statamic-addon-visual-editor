<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use MarioHamann\StatamicVisualEditor\ComponentMark;
use Statamic\Facades\Antlers;
use Statamic\Facades\Token;
use Statamic\Tokens\Handlers\LivePreview;
use Statamic\View\Antlers\Language\Runtime\GlobalRuntimeState;

/**
 * The server says where a component renders: `data-sve-component="<src>"` on
 * the first content element of every partial that is not a page section, in
 * Live Preview only. See ComponentMark.
 */
class ComponentMarkTest extends TestCase
{
    private string $views = '';

    protected function setUp(): void
    {
        parent::setUp();

        $this->views = sys_get_temp_dir().'/sve-component-mark-'.uniqid();
        mkdir($this->views.'/partials/components', 0777, true);
        mkdir($this->views.'/partials/page_sections/intro', 0777, true);
        View::addLocation($this->views);
    }

    protected function tearDown(): void
    {
        foreach (glob($this->views.'/partials/*/*/*') ?: [] as $file) {
            @unlink($file);
        }
        foreach (glob($this->views.'/partials/*/*') ?: [] as $file) {
            is_dir($file) ? @rmdir($file) : @unlink($file);
        }
        foreach (glob($this->views.'/partials/*') ?: [] as $dir) {
            @rmdir($dir);
        }
        @rmdir($this->views.'/partials');
        @rmdir($this->views);

        parent::tearDown();
    }

    // -------------------------------------------------------------------------
    // stamp(): the first content element of a render
    // -------------------------------------------------------------------------

    public function test_stamp_marks_the_first_element_whatever_its_classes(): void
    {
        $this->assertSame(
            '<section data-sve-component="components/intro_style" id="id-abc" class="" data-sid="x-y"><h1>Hej</h1></section>',
            ComponentMark::stamp('<section id="id-abc" class="" data-sid="x-y"><h1>Hej</h1></section>', 'components/intro_style')
        );
    }

    public function test_stamp_skips_text_comments_style_script_and_void_head_tags(): void
    {
        $html = "\n  tekst <!-- <div>kommentar</div> --> <style>.a > b { color: red }</style>\n<script>var s = '<div>';</script><link rel=\"x\" href=\"y\"><p class=\"p\">Hej</p>";

        $this->assertSame(
            "\n  tekst <!-- <div>kommentar</div> --> <style>.a > b { color: red }</style>\n<script>var s = '<div>';</script><link rel=\"x\" href=\"y\"><p data-sve-component=\"components/btn\" class=\"p\">Hej</p>",
            ComponentMark::stamp($html, 'components/btn')
        );
    }

    public function test_stamp_adds_a_token_when_the_element_is_already_another_components(): void
    {
        $inner = ComponentMark::stamp('<img src="/a.jpg" alt="a > b">', 'components/image');

        $this->assertSame('<img data-sve-component="components/image" src="/a.jpg" alt="a > b">', $inner);
        $this->assertSame(
            '<img data-sve-component="components/image components/card" src="/a.jpg" alt="a > b">',
            ComponentMark::stamp($inner, 'components/card')
        );
    }

    public function test_stamp_is_idempotent_for_the_same_src(): void
    {
        $once = ComponentMark::stamp('<div class="card"></div>', 'components/card');

        $this->assertSame($once, ComponentMark::stamp($once, 'components/card'));
    }

    public function test_stamp_leaves_a_render_with_no_element_alone(): void
    {
        $this->assertSame('', ComponentMark::stamp('', 'components/pagination'));
        $this->assertSame("\n  ", ComponentMark::stamp("\n  ", 'components/pagination'));
        $this->assertSame('<style>.x{}</style>', ComponentMark::stamp('<style>.x{}</style>', 'components/x'));
    }

    // -------------------------------------------------------------------------
    // srcOfView(): which partial a view path is
    // -------------------------------------------------------------------------

    public function test_src_of_view_reads_the_partial_under_a_view_location(): void
    {
        $this->assertSame('components/intro_style', ComponentMark::srcOfView($this->views.'/partials/components/intro_style.antlers.html'));
        $this->assertSame('header/style_1', ComponentMark::srcOfView($this->views.'/partials/header/style_1.antlers.html'));
        $this->assertSame('blocks/headline', ComponentMark::srcOfView($this->views.'/partials/blocks/headline.antlers.html'));
    }

    public function test_src_of_view_is_null_for_page_sections_views_and_strangers(): void
    {
        $this->assertNull(ComponentMark::srcOfView($this->views.'/partials/page_sections/intro/intro_style_1.antlers.html'));
        $this->assertNull(ComponentMark::srcOfView($this->views.'/layout.antlers.html'));
        $this->assertNull(ComponentMark::srcOfView($this->views.'/pages/show.antlers.html'));
        $this->assertNull(ComponentMark::srcOfView('/somewhere/else/partials/components/x.antlers.html'));
    }

    // -------------------------------------------------------------------------
    // The whole way: preparser + {{ sve_component }} on a rendered partial
    // -------------------------------------------------------------------------

    public function test_a_component_with_no_static_class_is_marked_in_live_preview(): void
    {
        $this->livePreview();
        $this->partial('probe', '<section id="id-{{ id }}" class="" data-sid="{{ _visual_id }}"><h1>{{ headline }}</h1></section>');

        // `_visual_id` is the row's own field, in the scope the call is made from — never a parameter.
        $html = $this->render('{{ partial:components/probe id="abc" headline="Hej" }}', ['_visual_id' => 'v-1']);

        $this->assertSame('<section data-sve-component="components/probe" id="id-abc" class="" data-sid="v-1"><h1>Hej</h1></section>', $html);
    }

    public function test_nothing_is_marked_outside_live_preview(): void
    {
        $this->partial('probe', '<section id="id-{{ id }}" class=""><h1>{{ headline }}</h1></section>');

        $html = $this->render('{{ partial:components/probe id="abc" headline="Hej" }}');

        $this->assertSame('<section id="id-abc" class=""><h1>Hej</h1></section>', $html);
    }

    public function test_a_page_section_partial_is_not_marked_but_the_component_it_calls_is(): void
    {
        $this->livePreview();
        $this->partial('probe', '<section id="id-{{ id }}" class=""><h1>{{ headline }}</h1></section>');
        file_put_contents(
            $this->views.'/partials/page_sections/intro/intro_style_1.antlers.html',
            '{{ partial:components/probe headline="Fra sektionen" }}'
        );

        $html = $this->render('{{ partial:page_sections/intro/intro_style_1 id="abc" }}');

        $this->assertSame('<section data-sve-component="components/probe" id="id-abc" class=""><h1>Fra sektionen</h1></section>', $html);
    }

    public function test_pairs_inside_the_component_are_not_components_and_every_instance_is_marked_once(): void
    {
        $this->livePreview();
        $this->partial('list', <<<'ANTLERS'
{{# sve_props [] #}}
{{ sve_defaults props_title="Titel" }}<ul class="list">{{ items }}<li>{{ name }}</li>{{ /items }}</ul>{{ /sve_defaults }}
ANTLERS);

        $html = $this->render('{{ partial:components/list :items="rows" }}{{ partial:components/list :items="rows" }}', [
            'rows' => [['name' => 'A'], ['name' => 'B']],
        ]);

        $this->assertSame(2, substr_count($html, 'data-sve-component="components/list"'), $html);
        $this->assertSame(0, substr_count($html, '<li data-sve-component'), 'a loop body is not a component');
        $this->assertStringContainsString('<ul data-sve-component="components/list" class="list"><li>A</li><li>B</li></ul>', $html);
    }

    public function test_a_component_that_opens_with_another_component_holds_both_on_one_element(): void
    {
        $this->livePreview();
        $this->partial('image', '<img src="{{ path }}">');
        $this->partial('card', '{{ partial:components/image path="/a.jpg" }}<p>{{ text }}</p>');

        $html = $this->render('{{ partial:components/card text="Hej" }}');

        $this->assertSame('<img data-sve-component="components/image components/card" src="/a.jpg"><p>Hej</p>', $html);
    }

    public function test_the_runtime_still_tells_the_preparser_which_file_it_parses(): void
    {
        // The preparser reads this to know the file. A Statamic release that
        // drops it must fail here, not silently stop marking components.
        $this->assertTrue(property_exists(GlobalRuntimeState::class, 'currentExecutionFile'));
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private function partial(string $name, string $antlers): void
    {
        file_put_contents($this->views.'/partials/components/'.$name.'.antlers.html', $antlers);
    }

    private function render(string $antlers, array $data = []): string
    {
        return trim((string) Antlers::parse($antlers, $data, trusted: true));
    }

    /** A real Live Preview token on the current request — the gate `{{ visual_edit }}` uses too. */
    private function livePreview(): void
    {
        $token = Token::make(null, LivePreview::class, []);
        $token->save();

        $request = Request::create('/preview', 'GET', ['token' => $token->token()]);
        $this->app->instance('request', $request);

        $this->assertTrue(request()->isLivePreview(), 'the test request is a Live Preview request');
    }
}
