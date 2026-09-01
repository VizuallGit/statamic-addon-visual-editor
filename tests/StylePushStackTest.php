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

            public static function reset(): void
            {
                static::$stack = [];
                static::$seen = [];
            }
        }
    }
}

namespace MarioHamann\StatamicVisualEditor\Tests {
    use MarioHamann\StatamicVisualEditor\StylePushStack;
    use MarioHamann\StatamicVisualEditor\StylePushStackBridge;
    use MarioHamann\StatamicVisualEditor\Tags\SveTw;
    use MarioHamann\StatamicVisualEditor\TailwindStore;
    use Vizuall\StylePush\Tags\StylePush;

    class StylePushStackTest extends TestCase
    {
        protected function setUp(): void
        {
            parent::setUp();

            StylePushStackBridge::reset();
        }

        public function test_it_pushes_onto_the_style_push_stack(): void
        {
            StylePushStack::push('<style>.relative{position:relative}</style>');

            $this->assertStringContainsString('.relative{position:relative}', StylePush::getAll());
        }

        public function test_it_dedupes_the_same_block(): void
        {
            StylePushStack::push('<style>.a{}</style>');
            StylePushStack::push('<style>.a{}</style>');

            $this->assertSame(1, substr_count(StylePush::getAll(), '.a{}'));
        }

        public function test_sve_tw_pushes_store_css_and_prints_nothing(): void
        {
            $dir = sys_get_temp_dir().'/sve-tw-stack-'.uniqid('', true);
            config(['statamic-visual-editor.tailwind.store' => $dir]);
            TailwindStore::write('custom_section/style_1', '.relative{position:relative}');

            $tag = new SveTw;
            $tag->setProperties([
                'parser' => null,
                'content' => '',
                'context' => [],
                'params' => ['handle' => 'custom_section/style_1'],
                'tag' => 'sve_tw',
                'tag_method' => 'index',
                'isPair' => false,
            ]);

            $this->assertSame('', $tag->index());
            $this->assertStringContainsString('.relative{position:relative}', StylePush::getAll());

            $path = TailwindStore::path('custom_section/style_1');

            if (is_file($path)) {
                unlink($path);
            }

            @rmdir($dir.'/custom_section');
            @rmdir($dir);
        }
    }
}
