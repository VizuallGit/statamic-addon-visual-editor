<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\SectionRootTags;

class SectionRootTagsTest extends TestCase
{
    protected string $dir;

    protected function setUp(): void
    {
        parent::setUp();

        $this->dir = sys_get_temp_dir().'/sve-root-tags-'.uniqid('', true);
        mkdir($this->dir.'/static_section', 0777, true);
        mkdir($this->dir.'/hero', 0777, true);
        file_put_contents(
            $this->dir.'/static_section/divider.antlers.html',
            "{{# sve-unlocked #}}\n<div class=\"w-(--container-width) h-px\"></div>\n\n{{ sve_tw }}\n"
        );
        file_put_contents($this->dir.'/hero/style_2.antlers.html', "<section id=\"id-{{ id }}\">\n  hi\n</section>\n");
        // A section that is one component call — Intro style 1's shape.
        file_put_contents($this->dir.'/hero/call.antlers.html', "{{ partial:components/thing }}\n");
        // No tag and no call: left out, the tree falls back to `section`.
        file_put_contents($this->dir.'/hero/empty.antlers.html', "{{ sve_tw }}\n");
        config(['statamic-visual-editor.templates.partials' => $this->dir]);
    }

    protected function tearDown(): void
    {
        foreach ([
            '/static_section/divider.antlers.html',
            '/hero/style_2.antlers.html',
            '/hero/call.antlers.html',
            '/hero/empty.antlers.html',
        ] as $file) {
            @unlink($this->dir.$file);
        }

        @rmdir($this->dir.'/static_section');
        @rmdir($this->dir.'/hero');
        @rmdir($this->dir);

        parent::tearDown();
    }

    public function test_every_section_file_by_handle(): void
    {
        $this->assertSame([
            'hero/call' => 'component',
            'hero/style_2' => 'section',
            'static_section/divider' => 'div',
        ], SectionRootTags::map());
    }

    public function test_a_changed_file_is_read_again(): void
    {
        $this->assertSame('div', SectionRootTags::map()['static_section/divider']);

        // A different size is a different stamp, whatever the clock says.
        file_put_contents($this->dir.'/static_section/divider.antlers.html', "<hr class=\"h-px\">\n");

        $this->assertSame('hr', SectionRootTags::map()['static_section/divider']);
    }

    public function test_the_first_opening_tag_with_antlers_blanked(): void
    {
        $this->assertSame('div', SectionRootTags::of('{{# note #}}<div></div>'));
        $this->assertSame('section', SectionRootTags::of('{{ if show }}<section class="{{ _class }}"></section>{{ /if }}'));
        $this->assertSame('nav', SectionRootTags::of('<!DOCTYPE html><?xml x="<b>" ?><nav></nav>'));
        $this->assertSame('aside', SectionRootTags::of('<!-- <aside></aside> --><div></div>'));
        $this->assertSame('my-el', SectionRootTags::of('<My-El></My-El>'));
        $this->assertSame('', SectionRootTags::of('<div'));
        $this->assertSame('', SectionRootTags::of('{{ sve_tw }} text only'));
    }

    /**
     * A section that is one component call unfolds into the component — so
     * the shut row says `component`, as the open tree's first row does. Intro
     * style 1 said `section` shut and `intro_style` open.
     */
    public function test_a_component_call_before_any_tag_is_the_root(): void
    {
        $this->assertSame('component', SectionRootTags::of("{{# sve-unlocked #}}\n{{ partial:components/intro_style props_headline=\"Hej\" }}\n\n{{ sve_tw }}\n"));
        $this->assertSame('component', SectionRootTags::of('{{ partial:components/x }}</p><article></article>'));
        $this->assertSame('component', SectionRootTags::of('{{ partial:components/x }} text only'));
        $this->assertSame('component', SectionRootTags::of('{{ partial src="components/section" }}<div></div>{{ /partial }}'));
        // A tag first, the call inside it or after it: the tag.
        $this->assertSame('section', SectionRootTags::of('<section style="{{ partial:cms_styles/color_scheme_style }}"><div>{{ partial:components/x }}</div></section>'));
        $this->assertSame('div', SectionRootTags::of('<div>{{ partial:components/x }}</div>'));
        // Not a call the tree lists: a closing tag, a commented one, no src, a src that climbs out.
        $this->assertSame('div', SectionRootTags::of('{{ /partial }}<div></div>'));
        $this->assertSame('div', SectionRootTags::of('{{# {{ partial:components/x }} #}}<div></div>'));
        $this->assertSame('div', SectionRootTags::of('{{ partial }}<div></div>'));
        $this->assertSame('div', SectionRootTags::of('{{ partial:../x }}<div></div>'));
    }

    public function test_antlers_is_blanked_whole_as_the_tree_blanks_it(): void
    {
        // A tag inside another's parameter is part of it: the `<b>` is text.
        $this->assertSame('div', SectionRootTags::of('{{ svg src="{{ logo }}" class="<b>" }}<div></div>'));
        // A comment ends at `#}}`, not at a `}}` inside it.
        $this->assertSame('div', SectionRootTags::of('{{# a }} <p> #}}<div></div>'));
        // A tag with no `}}` runs to the end — no root, as in the tree.
        $this->assertSame('', SectionRootTags::of('<section {{ visual_edit x="1">' . "\n<div></div></section>"));
    }
}
