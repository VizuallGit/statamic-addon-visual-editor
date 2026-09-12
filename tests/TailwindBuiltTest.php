<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\TailwindBuilt;

class TailwindBuiltTest extends TestCase
{
    public function test_it_reads_class_names_from_selectors_only()
    {
        $names = TailwindBuilt::classesIn('.grid{display:grid}.py-1200{padding-block:var(--spacing-1200)}');

        $this->assertSame(['grid', 'py-1200'], $names);
    }

    public function test_a_declaration_is_never_mistaken_for_a_class()
    {
        // `#0a0` and `.5rem` both look like selectors if you only grep for a dot.
        $names = TailwindBuilt::classesIn('.a{background:#0a0;margin:.5rem;transition:all .25s}');

        $this->assertSame(['a'], $names);
    }

    public function test_it_skips_at_rule_preludes()
    {
        $css = '@layer utilities{@media (hover: hover){.hover\:underline:hover{text-decoration:underline}}}';

        $this->assertSame(['hover:underline'], TailwindBuilt::classesIn($css));
    }

    public function test_names_come_back_unescaped_the_way_the_markup_wrote_them()
    {
        $css = '.w-\[37px\]{width:37px}'
            .'.bg-primary-500\/50{background:red}'
            .'.\!text-inherit{color:inherit}'
            .'.\[\&_div\]\:grid-cols-2 div{x:y}'
            .'.-mt-400{margin-top:-1rem}';

        $this->assertSame(
            ['w-[37px]', 'bg-primary-500/50', '!text-inherit', '[&_div]:grid-cols-2', '-mt-400'],
            TailwindBuilt::classesIn($css)
        );
    }

    public function test_a_leading_digit_is_written_as_a_hex_escape()
    {
        // Tailwind writes `2xl:flex` as `\32 xl\:flex` — the space ends the hex
        // code and is not part of the name.
        $this->assertSame(['2xl:flex'], TailwindBuilt::classesIn('.\32 xl\:flex{display:flex}'));
    }

    public function test_comments_and_strings_are_not_read()
    {
        $css = '/* .commented-out{a:b} */.real{content:".fake"}';

        $this->assertSame(['real'], TailwindBuilt::classesIn($css));
    }

    public function test_no_build_means_nothing_is_skipped()
    {
        config()->set('statamic-visual-editor.tailwind.build', __DIR__.'/does-not-exist');

        $this->assertSame([], TailwindBuilt::classes());
    }
}
