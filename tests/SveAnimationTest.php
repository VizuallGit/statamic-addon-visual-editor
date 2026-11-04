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

        protected function tag(): SveAnimation
        {
            $tag = new SveAnimation;
            $tag->setProperties([
                'parser' => null,
                'content' => '',
                'context' => [],
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
    }
}
