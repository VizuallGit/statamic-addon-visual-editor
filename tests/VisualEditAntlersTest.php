<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\VisualEditAntlers;

class VisualEditAntlersTest extends TestCase
{
    public function test_reads_list_count_and_row_inner_sets(): void
    {
        $source = <<<'ANTLERS'
<ul {{ visual_edit field="list" insertable="true" template="3:item" }}>
    {{ list }}
        <li {{ visual_edit orderable="true" template="icon|title" }}>
            <p {{ visual_edit field="title" inline_edit="true" placeholder="Indtast din title her..." }}>{{ title }}</p>
        </li>
    {{ /list }}
</ul>
ANTLERS;

        $this->assertSame(
            ['template' => '3:item', 'rowTemplate' => 'icon|title'],
            VisualEditAntlers::forField($source, 'list')
        );
    }

    public function test_section_template_and_nested_list_templates(): void
    {
        $source = <<<'ANTLERS'
<section {{ visual_edit outline_inside="true" section_orderable="true" template="content|list" }}>
    <div {{ visual_edit field="blocks" insertable="true" }}></div>
    <ul {{ visual_edit field="list" insertable="true" template="3:item" }}>
        <li {{ visual_edit orderable="true" template="icon|title" }}></li>
    </ul>
</section>
ANTLERS;

        $tags = VisualEditAntlers::tags($source);
        $this->assertSame('content|list', $tags[0]['template'] ?? '');
        $this->assertSame('true', $tags[0]['section_orderable'] ?? '');
        $this->assertSame(
            ['template' => '3:item', 'rowTemplate' => 'icon|title'],
            VisualEditAntlers::forField($source, 'list')
        );
    }

    public function test_unknown_field_is_empty(): void
    {
        $this->assertSame(
            ['template' => '', 'rowTemplate' => ''],
            VisualEditAntlers::forField('<div {{ visual_edit field="blocks" insertable="true" }}></div>', 'list')
        );
    }
}
