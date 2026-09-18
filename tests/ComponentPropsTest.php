<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\ComponentProps;
use MarioHamann\StatamicVisualEditor\SectionTemplate;

class ComponentPropsTest extends TestCase
{
    public function test_a_declaration_survives_a_round_trip()
    {
        $props = [
            ['handle' => 'headline', 'type' => 'text', 'label' => 'Headline', 'default' => 'Overskrift'],
            ['handle' => 'image', 'type' => 'media', 'label' => 'Image', 'default' => ''],
        ];

        $file = SectionTemplate::join([
            'html' => '<h3>{{ headline }}</h3>',
            'css' => '',
            'js' => '',
            'props' => $props,
        ]);

        $parts = SectionTemplate::split($file);

        $this->assertSame($props, $parts['props']);
        $this->assertSame('<h3>{{ headline }}</h3>', $parts['html']);
    }

    public function test_the_declaration_never_reaches_the_html_pane()
    {
        $file = "{{#sve_props\n[{\"handle\":\"headline\",\"type\":\"text\"}]\n#}}\n\n<h3>{{ headline }}</h3>\n";

        $parts = SectionTemplate::split($file);

        $this->assertStringNotContainsString('sve_props', $parts['html']);
        $this->assertSame('headline', $parts['props'][0]['handle']);
    }

    public function test_other_comments_are_left_where_the_author_put_them()
    {
        $parts = SectionTemplate::split("{{# a note #}}\n<h3>hi</h3>\n");

        $this->assertStringContainsString('{{# a note #}}', $parts['html']);
        $this->assertSame([], $parts['props']);
    }

    public function test_a_file_with_no_declaration_is_written_back_unchanged()
    {
        $before = SectionTemplate::join(['html' => '<p>hi</p>', 'css' => '', 'js' => '']);
        $after = SectionTemplate::join(['html' => '<p>hi</p>', 'css' => '', 'js' => '', 'props' => []]);

        $this->assertSame($before, $after);
        $this->assertStringNotContainsString('sve_props', $after);
    }

    public function test_a_handle_that_antlers_could_not_read_is_dropped()
    {
        $clean = ComponentProps::normalize([
            ['handle' => 'Head Line', 'type' => 'text'],
            ['handle' => '9lives', 'type' => 'text'],
            ['handle' => '', 'type' => 'text'],
            ['handle' => 'ok'],
        ]);

        $this->assertSame(['head_line', 'ok'], array_column($clean, 'handle'));
    }

    public function test_a_repeated_handle_is_kept_once_and_an_unknown_kind_becomes_text()
    {
        $clean = ComponentProps::normalize([
            ['handle' => 'headline', 'type' => 'video'],
            ['handle' => 'headline', 'type' => 'media'],
        ]);

        $this->assertCount(1, $clean);
        $this->assertSame('text', $clean[0]['type']);
        $this->assertSame('Headline', $clean[0]['label']);
    }

    public function test_a_choice_keeps_its_options_however_the_panel_wrote_them()
    {
        $clean = ComponentProps::normalize([
            ['handle' => 'size', 'type' => 'select', 'options' => 'Small, Medium , Small,, Large'],
            ['handle' => 'align', 'type' => 'select', 'options' => ['Left', 'Right']],
        ]);

        $this->assertSame(['Small', 'Medium', 'Large'], $clean[0]['options']);
        $this->assertSame(['Left', 'Right'], $clean[1]['options']);
    }

    public function test_only_a_choice_carries_options()
    {
        $clean = ComponentProps::normalize([
            ['handle' => 'href', 'type' => 'link', 'options' => 'a, b'],
        ]);

        $this->assertSame('link', $clean[0]['type']);
        $this->assertArrayNotHasKey('options', $clean[0]);
    }

    public function test_a_quote_never_reaches_a_choice()
    {
        $clean = ComponentProps::normalize([
            ['handle' => 'size', 'type' => 'select', 'options' => 'Sm"all, Me\'dium'],
        ]);

        $this->assertSame(['Small', 'Medium'], $clean[0]['options']);
    }

    public function test_a_default_becomes_antlers_that_actually_runs()
    {
        $file = SectionTemplate::join([
            'html' => '<h3>{{ props.headline }}</h3>',
            'css' => '',
            'js' => '',
            'props' => [
                ['handle' => 'headline', 'type' => 'text', 'label' => '', 'default' => 'Overskrift'],
                ['handle' => 'image', 'type' => 'media', 'label' => '', 'default' => '/assets/x.jpg'],
                ['handle' => 'empty', 'type' => 'text', 'label' => '', 'default' => ''],
            ],
        ]);

        $this->assertStringContainsString('{{ sve_defaults props_headline="Overskrift" props_image="/assets/x.jpg" props_empty="" }}', $file);
        $this->assertStringContainsString('{{ /sve_defaults }}', $file);

        // The shape that used to leak into the page around the component.
        $this->assertStringNotContainsString('headline = headline', $file);
    }

    public function test_the_pair_goes_around_the_whole_file()
    {
        $file = SectionTemplate::join([
            'html' => '<h3>{{ props.headline }}</h3>',
            'css' => '.card{color:red}',
            'js' => '',
            'props' => [['handle' => 'headline', 'type' => 'text', 'label' => '', 'default' => 'Overskrift']],
        ]);

        $open = strpos($file, '{{ sve_defaults ');
        $css = strpos($file, '.card{color:red}');
        $close = strpos($file, '{{ /sve_defaults }}');

        $this->assertNotFalse($open);
        $this->assertNotFalse($css);
        $this->assertNotFalse($close);

        // CSS reads the same props as the markup, so it has to be inside too.
        $this->assertLessThan($css, $open);
        $this->assertLessThan($close, $css);
    }

    public function test_the_fallbacks_never_reach_the_html_pane()
    {
        $props = [['handle' => 'headline', 'type' => 'text', 'label' => 'Headline', 'default' => 'Hej']];
        $file = SectionTemplate::join(['html' => '<h3>{{ headline }}</h3>', 'css' => '', 'js' => '', 'props' => $props]);

        $parts = SectionTemplate::split($file);

        $this->assertSame('<h3>{{ headline }}</h3>', $parts['html']);
        $this->assertSame($props, $parts['props']);

        // And a second save does not stack a second set of them.
        $again = SectionTemplate::join([...$parts, 'props' => $parts['props']]);

        $this->assertSame(1, substr_count($again, '{{ sve_defaults '));
        $this->assertSame(1, substr_count($again, '{{ /sve_defaults }}'));
    }

    public function test_a_default_that_cannot_be_written_leaves_the_prop_empty_rather_than_broken()
    {
        $file = SectionTemplate::join([
            'html' => '<p>{{ props.text }}</p>',
            'css' => '',
            'js' => '',
            'props' => [['handle' => 'text', 'type' => 'text', 'label' => '', 'default' => 'Hans\' "hus"']],
        ]);

        // The prop still exists — `{{ props.text }}` is a name the template can
        // count on — it just starts empty.
        $this->assertStringContainsString('{{ sve_defaults props_text="" }}', $file);
    }

    public function test_a_file_written_before_the_pair_loses_its_assignments()
    {
        $legacy = <<<'ANTLERS'
{{#sve_props
[{"handle":"headline","type":"text","label":"Headline","default":"Overskrift"}]
#}}

{{# sve_defaults #}}
{{ headline = headline ?? "Overskrift" }}
{{# /sve_defaults #}}

<h3>{{ headline }}</h3>
ANTLERS;

        $parts = SectionTemplate::split($legacy);

        $this->assertSame('<h3>{{ headline }}</h3>', $parts['html']);
        $this->assertSame('headline', $parts['props'][0]['handle']);

        $again = SectionTemplate::join([...$parts, 'props' => $parts['props']]);

        $this->assertStringNotContainsString('headline = headline', $again);
        $this->assertStringContainsString('{{ sve_defaults props_headline="Overskrift" }}', $again);
    }

    public function test_a_prop_named_after_an_antlers_parameter_is_dropped()
    {
        $clean = ComponentProps::normalize([
            ['handle' => 'scope', 'type' => 'text'],
            ['handle' => 'as', 'type' => 'text'],
            ['handle' => 'headline', 'type' => 'text'],
        ]);

        $this->assertSame(['headline'], array_column($clean, 'handle'));
    }

    public function test_a_view_outside_the_views_folder_declares_nothing()
    {
        $this->assertSame([], ComponentProps::forView('../../.env'));
        $this->assertSame([], ComponentProps::forView('partials/components/nope'));
    }
}
