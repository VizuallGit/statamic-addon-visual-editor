<?php

namespace Vizuall\StylePush\Tags {
    if (! class_exists(StylePush::class, false)) {
        class StylePush
        {
            protected static array $stack = [];

            protected static array $seen = [];

            public static function getAll(): string
            {
                return implode('', static::$stack);
            }
        }
    }

    if (! class_exists(ScriptPush::class, false)) {
        class ScriptPush
        {
            protected static array $stack = [];

            protected static array $seen = [];

            public static function getAll(): string
            {
                return implode('', static::$stack);
            }
        }
    }
}

namespace MarioHamann\StatamicVisualEditor\Tests {
    use MarioHamann\StatamicVisualEditor\ScriptPushStack;
    use MarioHamann\StatamicVisualEditor\ScriptPushStackBridge;
    use MarioHamann\StatamicVisualEditor\StylePushStack;
    use MarioHamann\StatamicVisualEditor\StylePushStackBridge;
    use MarioHamann\StatamicVisualEditor\Tags\SveAnimation;

    class SveAnimationTest extends TestCase
    {
        protected function setUp(): void
        {
            parent::setUp();

            StylePushStackBridge::reset();
            ScriptPushStackBridge::reset();
        }

        protected function tag(array $context = []): SveAnimation
        {
            $tag = new SveAnimation;
            $tag->setProperties([
                'parser' => null,
                'content' => '',
                'context' => $context,
                'params' => [],
                'tag' => 'sve_animation',
                'tag_method' => 'index',
                'isPair' => false,
            ]);

            return $tag;
        }

        public function test_it_prints_nothing(): void
        {
            $this->assertSame('', $this->tag()->index());
        }

        public function test_it_pushes_once_on_a_page_with_two_animated_sections(): void
        {
            $styles = StylePushStack::mark();
            $scripts = ScriptPushStack::mark();

            $this->tag()->index();
            $this->tag()->index();

            $pushed = StylePushStack::since($styles);

            $this->assertCount(1, $pushed);
            $this->assertStringContainsString('@keyframes anim-in', $pushed[0]);
            $this->assertStringStartsWith('<style>', $pushed[0]);

            $js = ScriptPushStack::since($scripts);

            $this->assertCount(1, $js);
            $this->assertStringStartsWith('<script>', $js[0]);
            $this->assertStringContainsString('data-in-view', $js[0]);
        }

        public function test_every_preset_gets_one_rule_of_its_own_vars(): void
        {
            $css = SveAnimation::css();
            $presets = SveAnimation::presets();

            $this->assertCount(25, $presets);

            foreach ($presets as $preset) {
                $this->assertSame(1, substr_count($css, '[data-anim-preset="'.$preset['handle'].'"]'), $preset['handle']);

                foreach ($preset['vars'] as $name => $value) {
                    $this->assertStringStartsWith('--anim-', $name);
                    $this->assertStringContainsString(str_replace('--anim-', '--anim-preset-', $name).': '.$value.';', $css);
                }
            }

            $this->assertStringContainsString('[data-anim-preset="fade-up"] { --anim-preset-opacity: 0; --anim-preset-y: 2rem; }', $css);
        }

        public function test_a_visitor_who_asked_for_less_motion_gets_the_fade(): void
        {
            $this->assertStringContainsString('@media (prefers-reduced-motion: reduce)', SveAnimation::css());
            $this->assertStringContainsString('@keyframes anim-fade', SveAnimation::css());
        }

        public function test_a_build_path_becomes_a_selector_under_the_sections_id(): void
        {
            $css = SveAnimation::sectionCss('abc', ['elements' => [
                '0:section/0:div/1:h2' => ['vars' => ['--anim-y' => '3rem']],
                '0:section' => ['vars' => ['--anim-duration' => '1.2s']],
            ]]);

            $this->assertSame(
                "#id-abc > div:nth-child(1) > h2:nth-child(2) { --anim-y: 3rem; }\n#id-abc { --anim-duration: 1.2s; }",
                $css,
            );
        }

        public function test_a_key_that_is_no_build_path_is_left_out(): void
        {
            $vars = ['vars' => ['--anim-y' => '3rem']];

            $this->assertSame('', SveAnimation::sectionCss('abc', ['elements' => [
                'section/div' => $vars,
                '0:section/1:H2' => $vars,
                '0:section/x:h2' => $vars,
                '0:section/1:h2 > *' => $vars,
            ]]));
            $this->assertSame('', SveAnimation::sectionCss('a b', ['flip' => true]));
        }

        public function test_only_anim_names_with_safe_values_are_written(): void
        {
            $css = SveAnimation::sectionCss('abc', ['elements' => ['0:section/0:h2' => ['vars' => [
                '--anim-y' => '1rem; color: red',
                '--anim-x' => '1rem}body{display:none',
                '--color' => 'red',
                '--anim-ease' => 'cubic-bezier(.22, 1, .36, 1)',
                '--anim-clip' => 'inset(100% 0 0 0)',
            ]]]]);

            $this->assertSame('#id-abc > h2:nth-child(1) { --anim-ease: cubic-bezier(.22, 1, .36, 1); --anim-clip: inset(100% 0 0 0); }', $css);
        }

        public function test_a_preset_writes_its_values_under_anim_preset_and_empties_the_others(): void
        {
            $css = SveAnimation::sectionCss('abc', ['elements' => ['0:section/0:h2' => ['preset' => 'fade-up']]]);

            $this->assertStringStartsWith('#id-abc > h2:nth-child(1) { --anim-preset-opacity: 0; --anim-preset-y: 2rem; ', $css);
            $this->assertStringContainsString('--anim-preset-x: initial;', $css);
            $this->assertStringContainsString('--anim-preset-scale: initial;', $css);
            $this->assertStringNotContainsString('--anim-preset-y: initial;', $css);
            $this->assertSame('', SveAnimation::sectionCss('abc', ['elements' => ['0:section/0:h2' => ['preset' => 'no-such']]]));
            $this->assertSame('', SveAnimation::sectionCss('abc', ['elements' => ['0:section/0:h2' => ['preset' => 'Fade;']]]));
        }

        public function test_off_holds_the_element_its_children_and_its_words_still(): void
        {
            $css = SveAnimation::sectionCss('abc', ['elements' => ['0:section/1:ul' => ['off' => true]]]);

            $this->assertSame(
                '#id-abc > ul:nth-child(2), #id-abc > ul:nth-child(2) > *, #id-abc > ul:nth-child(2) [data-anim-word] { animation: none; transition: none; translate: none; }',
                $css,
            );
            $this->assertStringNotContainsString('!important', $css);
        }

        public function test_flip_mirrors_the_section(): void
        {
            $this->assertSame('#id-abc { --anim-flip: -1; }', SveAnimation::sectionCss('abc', ['flip' => true]));
        }

        public function test_nothing_to_write_is_empty(): void
        {
            $this->assertSame('', SveAnimation::sectionCss('abc', []));
            $this->assertSame('', SveAnimation::sectionCss('abc', ['flip' => false, 'elements' => ['0:section' => []]]));
        }

        public function test_the_override_reads_an_array_json_or_nothing(): void
        {
            $this->assertSame(['flip' => true], SveAnimation::override(['flip' => true]));
            $this->assertSame(['flip' => true], SveAnimation::override('{"flip":true}'));
            $this->assertSame([], SveAnimation::override(null));
            $this->assertSame([], SveAnimation::override(''));
            $this->assertSame([], SveAnimation::override('not json'));
        }

        public function test_a_section_with_an_override_pushes_a_second_block(): void
        {
            $styles = StylePushStack::mark();

            $this->tag(['id' => 'abc', '_anim' => ['elements' => ['0:section/0:h2' => ['vars' => ['--anim-y' => '3rem']]]]])->index();
            $this->tag(['id' => 'def', '_anim' => '{"flip":true}'])->index();
            $this->tag(['id' => 'ghi', '_anim' => null])->index();

            $pushed = StylePushStack::since($styles);

            $this->assertCount(3, $pushed);
            $this->assertSame('<style>#id-abc > h2:nth-child(1) { --anim-y: 3rem; }</style>', $pushed[1]);
            $this->assertSame('<style>#id-def { --anim-flip: -1; }</style>', $pushed[2]);
        }
    }
}
