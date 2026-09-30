<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\SectionTemplate\Panes;
use MarioHamann\StatamicVisualEditor\SectionTypeMaker;

/**
 * What the import dialog writes has to be a file the dock can open again.
 *
 * The import builds the three panes in the browser and posts them to the same
 * endpoint the dock saves with. If the join and the split do not agree on what
 * it produced, the section is on disk and the dock shows it wrong — so the
 * round trip is asserted here, on the shapes the import actually makes.
 */
class SectionImportTest extends TestCase
{
    private function roundTrip(string $html, string $css, string $js): array
    {
        $handle = 'static_section/import_probe';

        $file = Panes::join([
            'html' => $html,
            'css' => $css,
            'js' => $js,
            'html_tag' => null,
            'css_tag' => 'style_push',
            'js_tag' => 'script_push',
            'props' => [],
            'locked' => false,
        ], $handle, $handle);

        return [$file, Panes::split($file, $handle)];
    }

    public function test_an_imported_tailwind_section_survives_the_round_trip()
    {
        $html = '<div id="id-{{ id }}" class="[ {{ _class }} ] bg-white py-24" '
            .'{{ visual_edit outline_inside="true" section_orderable="true" }}>'."\n"
            .'  <h2 class="text-4xl">Deploy faster</h2>'."\n"
            .'</div>';

        [, $back] = $this->roundTrip($html, '', '');

        $this->assertSame($html, trim($back['html']));
        $this->assertSame('', trim($back['css']));
    }

    public function test_an_imported_plain_css_section_keeps_its_scoped_stylesheet_and_script()
    {
        $html = '<section id="id-{{ id }}" class="[ {{ _class }} hero ]" '
            .'{{ visual_edit outline_inside="true" section_orderable="true" }}>'."\n"
            .'  <h1 class="[ hero__title ]">Velkommen</h1>'."\n"
            .'</section>';
        $css = "@scope(.{{ _class }}) {\n  .hero { padding: 6rem 0; }\n}";
        $js = 'console.log("hi")';

        [$file, $back] = $this->roundTrip($html, $css, $js);

        $this->assertSame($html, trim($back['html']));
        $this->assertSame($css, trim($back['css']));
        $this->assertSame($js, trim($back['js']));

        // The panes land in the wrappers the site's own sections use, so the
        // CSS reaches the layout's stack and the JS the end of the body.
        $this->assertStringContainsString('{{ style_push }}', $file);
        $this->assertStringContainsString('{{ script_push }}', $file);
    }

    public function test_the_root_the_import_writes_is_the_root_the_scaffold_declares()
    {
        // The import promotes a pasted element to the section root by giving it
        // these three. If the scaffold ever changes what a root wears, this is
        // what says so before a section is imported without it.
        $scaffold = SectionTypeMaker::staticScaffold();

        $this->assertStringContainsString('id="id-{{ id }}"', $scaffold);
        $this->assertStringContainsString('{{ _class }}', $scaffold);
        $this->assertStringContainsString(
            '{{ visual_edit outline_inside="true" section_orderable="true" }}',
            $scaffold
        );
    }
}
