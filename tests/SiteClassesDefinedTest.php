<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\SiteClasses;
use MarioHamann\StatamicVisualEditor\SiteCss;

/**
 * Where a class name is already defined: the stylesheets' leaf rules, the
 * views' own style blocks and scopes, and the dock's `[ name ]` runs.
 */
class SiteClassesDefinedTest extends TestCase
{
    private string $css;

    private string $views;

    protected function setUp(): void
    {
        parent::setUp();

        $this->css = sys_get_temp_dir().'/sve-css-'.uniqid();
        $this->views = sys_get_temp_dir().'/sve-views-'.uniqid();
        mkdir($this->css, 0777, true);
        mkdir($this->views.'/partials/page_sections/hero', 0777, true);
        file_put_contents($this->css.'/site.css', "@import \"tailwindcss\";\n@import \"./tttt\" layer(base);\n@utility flow-y {\n  display: flex;\n}\n.card, .card--wide { padding: 1rem; }\n");
        file_put_contents($this->css.'/tttt.css', "/* tttt.css */\n@layer base {\n  .tttt {\n    background-color: rød;\n    padding: 20rem;\n  }\n}\n");
        file_put_contents(
            $this->views.'/partials/page_sections/hero/style_2.antlers.html',
            "<section id=\"id-{{ id }}\" class=\"[ tttt hero ] wrapper text-lg\" {{ visual_edit }}>\n"
            ."  <a href=\"page.html\" x-data=\"{ open: false }\">x</a>\n"
            ."{{ style_push }}\n#id-{{ id }} { --gap: {{ gap }}; }\n@scope(.hero) {\n  .inner { gap: var(--gap); }\n}\n{{ /style_push }}\n</section>\n"
        );
        file_put_contents($this->views.'/partials/site_head.antlers.html', "<header class=\"[ site-head ]\"><style>.site-head { color: red }</style></header>\n");
        config(['statamic-visual-editor.site_css.root' => $this->css]);
        SiteCss::use('css');
    }

    protected function tearDown(): void
    {
        foreach ([$this->css, $this->views] as $dir) {
            exec('rm -rf '.escapeshellarg($dir));
        }

        parent::tearDown();
    }

    private function where(array $defined, string $name): array
    {
        return array_values(array_map(
            fn ($d) => $d['kind'].' '.basename($d['file']),
            array_filter($defined, fn ($d) => $d['name'] === $name)
        ));
    }

    public function test_it_finds_rules_utilities_scopes_and_bracket_runs(): void
    {
        $defined = SiteClasses::defined($this->views);

        $this->assertSame(['rule tttt.css', 'bracket style_2.antlers.html'], $this->where($defined, 'tttt'));
        $this->assertSame(['utility site.css'], $this->where($defined, 'flow-y'));
        $this->assertSame(['rule site.css'], $this->where($defined, 'card--wide'));
        $this->assertSame(['bracket style_2.antlers.html', 'scope style_2.antlers.html'], $this->where($defined, 'hero'));
        $this->assertSame(['rule style_2.antlers.html'], $this->where($defined, 'inner'));
        $this->assertSame(['bracket site_head.antlers.html', 'rule site_head.antlers.html'], $this->where($defined, 'site-head'));
        // Markup is not CSS: nothing from href, Alpine braces or Tailwind classes.
        $this->assertSame([], $this->where($defined, 'html'));
        $this->assertSame([], $this->where($defined, 'wrapper'));
        $this->assertSame([], $this->where($defined, 'open'));
    }

    public function test_a_rule_carries_its_declarations_and_file(): void
    {
        $defined = SiteClasses::defined($this->views);
        $tttt = array_values(array_filter($defined, fn ($d) => $d['name'] === 'tttt' && $d['kind'] === 'rule'))[0];

        $this->assertSame(".tttt", $tttt['selector']);
        $this->assertSame("background-color: rød;\npadding: 20rem;", $tttt['css']);
        $this->assertStringEndsWith('/tttt.css', $tttt['file']);
    }

    public function test_the_endpoint_is_routed_and_guarded(): void
    {
        // No user, no feature: the route answers (not 404), and does not hand
        // the site's stylesheets to whoever asks.
        $status = $this->getJson('/!/sve/site-css/defined')->status();

        $this->assertNotSame(404, $status);
        $this->assertContains($status, [401, 403, 422, 302]);
    }
}
