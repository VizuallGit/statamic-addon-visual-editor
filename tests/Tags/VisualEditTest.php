<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Tags;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Tags\VisualEdit;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;
use Statamic\Facades\Blueprint;

class VisualEditTest extends TestCase
{
    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private function makeTag(
        array $context = [],
        array $params = [],
        bool $livePreview = false,
        string $content = '',
        bool $isPair = false
    ): VisualEdit {
        $tag = new class($livePreview) extends VisualEdit
        {
            public function __construct(private bool $livePreviewEnabled) {}

            protected function isLivePreview(): bool
            {
                return $this->livePreviewEnabled;
            }

            public function parse($data = []): mixed
            {
                return $this->content;
            }
        };

        // Pair behaviour is driven by content being non-empty (mirrors Statamic's setContent()).
        $tag->setProperties([
            'parser' => null,
            'content' => $isPair ? ($content ?: 'pair-content') : $content,
            'context' => $context,
            'params' => $params,
            'tag' => 'visual_edit',
            'tag_method' => 'index',
        ]);

        return $tag;
    }

    // -------------------------------------------------------------------------
    // {{ visual_edit }} self-closing — Live Preview active
    // -------------------------------------------------------------------------

    public function test_selfclosing_outputs_data_sid_during_live_preview(): void
    {
        $tag = $this->makeTag(
            context: ['_visual_id' => 'abc-123'],
            livePreview: true,
        );

        $this->assertSame('data-sid="abc-123"', $tag->index());
    }

    public function test_selfclosing_includes_label_from_type_in_context(): void
    {
        $tag = $this->makeTag(
            context: ['_visual_id' => 'abc-123', 'type' => 'text_block'],
            livePreview: true,
        );

        $this->assertSame('data-sid="abc-123" data-sid-label="Text Block" data-sid-type="text_block"', $tag->index());
    }

    public function test_selfclosing_includes_raw_type_as_data_sid_type(): void
    {
        $tag = $this->makeTag(
            context: ['_visual_id' => 'abc-123', 'type' => 'text'],
            livePreview: true,
        );

        $this->assertStringContainsString('data-sid-type="text"', $tag->index());
        $this->assertStringContainsString('data-sid-label="Text"', $tag->index());
    }

    public function test_selfclosing_explicit_id_param_overrides_context(): void
    {
        $tag = $this->makeTag(
            context: ['_visual_id' => 'from-context'],
            params: ['id' => 'from-param'],
            livePreview: true,
        );

        $this->assertStringContainsString('data-sid="from-param"', $tag->index());
    }

    public function test_selfclosing_omits_label_when_no_type_in_context(): void
    {
        $tag = $this->makeTag(
            context: ['_visual_id' => 'abc-123'],
            livePreview: true,
        );

        $this->assertStringNotContainsString('data-sid-label', $tag->index());
    }

    // -------------------------------------------------------------------------
    // {{ visual_edit }} self-closing — outside Live Preview / no UUID
    // -------------------------------------------------------------------------

    public function test_selfclosing_returns_empty_string_outside_live_preview(): void
    {
        $tag = $this->makeTag(
            context: ['_visual_id' => 'abc-123'],
            livePreview: false,
        );

        $this->assertSame('', $tag->index());
    }

    public function test_selfclosing_returns_empty_string_when_no_visual_id_in_context(): void
    {
        $tag = $this->makeTag(
            context: [],
            livePreview: true,
        );

        $this->assertSame('', $tag->index());
    }

    public function test_selfclosing_returns_empty_string_outside_live_preview_with_no_context(): void
    {
        $tag = $this->makeTag(livePreview: false);

        $this->assertSame('', $tag->index());
    }

    // -------------------------------------------------------------------------
    // {{ visual_edit }} self-closing — HTML escaping
    // -------------------------------------------------------------------------

    public function test_selfclosing_html_escapes_uuid(): void
    {
        $tag = $this->makeTag(
            context: ['_visual_id' => '"><script>'],
            livePreview: true,
        );

        $this->assertStringNotContainsString('<script>', $tag->index());
        $this->assertStringContainsString('data-sid=', $tag->index());
    }

    public function test_selfclosing_html_escapes_label(): void
    {
        $tag = $this->makeTag(
            context: ['_visual_id' => 'abc-123', 'type' => '"><script>'],
            livePreview: true,
        );

        $this->assertStringNotContainsString('<script>', $tag->index());
        $this->assertStringContainsString('data-sid-label=', $tag->index());
    }

    // -------------------------------------------------------------------------
    // {{ visual_edit }}...{{ /visual_edit }} pair tag
    // -------------------------------------------------------------------------

    public function test_pair_wraps_content_in_div_during_live_preview(): void
    {
        $tag = $this->makeTag(
            context: ['_visual_id' => 'abc-123'],
            livePreview: true,
            content: 'hello world',
            isPair: true,
        );

        $result = $tag->index();

        $this->assertStringStartsWith('<div data-sid="abc-123">', $result);
        $this->assertStringEndsWith('</div>', $result);
        $this->assertStringContainsString('hello world', $result);
    }

    public function test_pair_passes_through_content_outside_live_preview(): void
    {
        $tag = $this->makeTag(
            context: ['_visual_id' => 'abc-123'],
            livePreview: false,
            content: 'hello world',
            isPair: true,
        );

        $this->assertSame('hello world', $tag->index());
    }

    public function test_pair_passes_through_content_when_no_visual_id(): void
    {
        $tag = $this->makeTag(
            context: [],
            livePreview: true,
            content: 'hello world',
            isPair: true,
        );

        $this->assertSame('hello world', $tag->index());
    }

    // -------------------------------------------------------------------------
    // visual_edit() Blade helper
    // -------------------------------------------------------------------------

    public function test_blade_helper_returns_attr_string_during_live_preview(): void
    {
        Request::macro('isLivePreview', fn () => true);

        $this->assertSame('data-sid="abc-123"', visual_edit('abc-123'));
    }

    public function test_blade_helper_returns_empty_string_outside_live_preview(): void
    {
        Request::macro('isLivePreview', fn () => false);

        $this->assertSame('', visual_edit('abc-123'));
    }

    public function test_blade_helper_returns_empty_string_when_uuid_is_null(): void
    {
        Request::macro('isLivePreview', fn () => true);

        $this->assertSame('', visual_edit(null));
    }

    public function test_blade_helper_includes_type_when_provided(): void
    {
        Request::macro('isLivePreview', fn () => true);

        $this->assertSame('data-sid="abc-123" data-sid-label="Text" data-sid-type="text"', visual_edit('abc-123', 'text'));
    }

    public function test_blade_helper_omits_label_when_not_provided(): void
    {
        Request::macro('isLivePreview', fn () => true);

        $this->assertStringNotContainsString('data-sid-label', visual_edit('abc-123'));
    }

    public function test_blade_helper_html_escapes_uuid(): void
    {
        Request::macro('isLivePreview', fn () => true);

        $result = visual_edit('"><script>');

        $this->assertStringNotContainsString('<script>', $result);
        $this->assertStringContainsString('data-sid=', $result);
    }

    // -------------------------------------------------------------------------
    // {{ visual_edit }} self-closing — field= parameter (manual field targeting)
    // -------------------------------------------------------------------------

    public function test_selfclosing_with_field_param_outputs_data_sid_field(): void
    {
        $tag = $this->makeTag(
            livePreview: true,
            params: ['field' => 'hero_title'],
        );

        $this->assertSame('data-sid-field="hero_title"', $tag->index());
    }

    public function test_selfclosing_with_field_and_inline_edit_param_outputs_marker(): void
    {
        $tag = $this->makeTag(
            livePreview: true,
            params: ['field' => 'hero_title', 'inline_edit' => 'true'],
        );

        $this->assertSame('data-sid-field="hero_title" data-sid-inline-edit', $tag->index());
    }

    public function test_selfclosing_with_field_without_inline_edit_param_has_no_marker(): void
    {
        $tag = $this->makeTag(
            livePreview: true,
            params: ['field' => 'hero_title'],
        );

        $this->assertStringNotContainsString('data-sid-inline-edit', $tag->index());
    }

    public function test_selfclosing_with_move_param_outputs_move_marker(): void
    {
        $set = $this->makeTag(
            context: ['_visual_id' => 'row-1'],
            livePreview: true,
            params: ['move' => 'true'],
        );

        $this->assertStringContainsString('data-sid-move', $set->index());

        $field = $this->makeTag(
            context: ['_visual_id' => 'row-1'],
            livePreview: true,
            params: ['field' => 'text', 'move' => 'true'],
        );

        $this->assertStringContainsString('data-sid-move', $field->index());
    }

    public function test_selfclosing_with_field_scope_param_overrides_cascaded_visual_id(): void
    {
        $tag = $this->makeTag(
            context: ['_visual_id' => 'section-uuid'],
            livePreview: true,
            params: ['field' => 'text', 'scope' => 'row-id-123'],
        );

        $result = $tag->index();

        $this->assertStringContainsString('data-sid-field-uid="row-id-123"', $result);
        $this->assertStringNotContainsString('section-uuid', $result);
    }

    public function test_selfclosing_with_popup_and_field_and_inline_edit_outputs_dual_attrs(): void
    {
        $tag = $this->makeTag(
            context: ['id' => 'row-abc', '_visual_id' => 'section-uuid'],
            livePreview: true,
            params: ['popup' => 'true', 'field' => 'text', 'inline_edit' => 'true'],
        );

        $result = $tag->index();

        // Popup attrs (row id, NOT the cascaded section _visual_id) …
        $this->assertStringContainsString('data-sid="row-abc"', $result);
        $this->assertStringContainsString('data-sid-action="popup"', $result);
        // … plus field attrs scoped to the same row id.
        $this->assertStringContainsString('data-sid-field="text"', $result);
        $this->assertStringContainsString('data-sid-field-uid="row-abc"', $result);
        $this->assertStringContainsString('data-sid-inline-edit', $result);
    }

    public function test_selfclosing_with_popup_and_field_without_inline_edit_has_no_field_attrs(): void
    {
        $tag = $this->makeTag(
            context: ['id' => 'row-abc'],
            livePreview: true,
            params: ['popup' => 'true', 'field' => 'text'],
        );

        $result = $tag->index();

        $this->assertStringContainsString('data-sid="row-abc"', $result);
        $this->assertStringNotContainsString('data-sid-field=', $result);
    }

    public function test_selfclosing_with_dot_notation_field_param_outputs_dot_notation(): void
    {
        $tag = $this->makeTag(
            livePreview: true,
            params: ['field' => 'page_info.author'],
        );

        $this->assertSame('data-sid-field="page_info.author"', $tag->index());
    }

    public function test_selfclosing_with_field_param_does_not_output_data_sid(): void
    {
        $tag = $this->makeTag(
            context: ['_visual_id' => 'some-uuid'],
            livePreview: true,
            params: ['field' => 'hero_title'],
        );

        $result = $tag->index();

        $this->assertStringContainsString('data-sid-field="hero_title"', $result);
        $this->assertStringNotContainsString('data-sid=', $result);
    }

    public function test_selfclosing_with_field_param_returns_empty_outside_live_preview(): void
    {
        $tag = $this->makeTag(
            livePreview: false,
            params: ['field' => 'hero_title'],
        );

        $this->assertSame('', $tag->index());
    }

    public function test_selfclosing_with_field_param_html_escapes_field_path(): void
    {
        $tag = $this->makeTag(
            livePreview: true,
            params: ['field' => '"><script>'],
        );

        $result = $tag->index();

        $this->assertStringNotContainsString('<script>', $result);
        $this->assertStringContainsString('data-sid-field=', $result);
    }

    // -------------------------------------------------------------------------
    // {{ visual_edit }}...{{ /visual_edit }} pair — field= parameter
    // -------------------------------------------------------------------------

    public function test_pair_with_field_param_wraps_content_with_data_sid_field(): void
    {
        $tag = $this->makeTag(
            livePreview: true,
            params: ['field' => 'hero_title'],
            content: 'My Hero Title',
            isPair: true,
        );

        $result = $tag->index();

        $this->assertStringContainsString('data-sid-field="hero_title"', $result);
        $this->assertStringContainsString('My Hero Title', $result);
        $this->assertStringStartsWith('<div ', $result);
        $this->assertStringEndsWith('</div>', $result);
    }

    public function test_pair_with_field_param_does_not_output_data_sid(): void
    {
        $tag = $this->makeTag(
            livePreview: true,
            params: ['field' => 'hero_title'],
            content: 'content',
            isPair: true,
        );

        $result = $tag->index();

        $this->assertStringNotContainsString('data-sid="', $result);
    }

    // -------------------------------------------------------------------------
    // Edge cases: empty field path, 3+ dot segments, malformed UUID
    // -------------------------------------------------------------------------

    public function test_selfclosing_with_empty_field_param_returns_empty_string(): void
    {
        // An empty field path has no meaningful target; should be treated like
        // no field param being set at all.
        $tag = $this->makeTag(
            livePreview: true,
            params: ['field' => ''],
        );

        $this->assertSame('', $tag->index());
    }

    public function test_pair_with_empty_field_param_returns_content_only(): void
    {
        $tag = $this->makeTag(
            livePreview: true,
            params: ['field' => ''],
            content: 'hello',
            isPair: true,
        );

        // No _visual_id in context either, so falls through to returning content.
        $this->assertSame('hello', $tag->index());
    }

    public function test_selfclosing_with_three_segment_dot_notation_field_param(): void
    {
        // 3+ segment paths (e.g. section.group.field) are passed through to the
        // data-sid-field attribute verbatim; label resolution only descends two levels.
        $tag = $this->makeTag(
            livePreview: true,
            params: ['field' => 'section.group.sub_field'],
        );

        $this->assertStringContainsString('data-sid-field="section.group.sub_field"', $tag->index());
    }

    public function test_selfclosing_with_malformed_uuid_is_html_escaped(): void
    {
        // A _visual_id containing HTML-unsafe characters must not produce raw HTML.
        $tag = $this->makeTag(
            context: ['_visual_id' => '"><img src=x onerror=alert(1)>'],
            livePreview: true,
        );

        $result = $tag->index();

        $this->assertStringNotContainsString('<img', $result);
        $this->assertStringContainsString('data-sid=', $result);
        $this->assertStringContainsString('&quot;', $result);
    }
    // -------------------------------------------------------------------------
    // blueprint= param — label resolution without an entry object
    // -------------------------------------------------------------------------

    public function test_selfclosing_with_blueprint_param_resolves_label_from_blueprint(): void
    {
        $blueprint = Blueprint::make()->setContents([
            'tabs' => [
                'main' => [
                    'sections' => [
                        [
                            'fields' => [
                                ['handle' => 'heading', 'field' => ['type' => 'text', 'display' => 'Page Heading']],
                            ],
                        ],
                    ],
                ],
            ],
        ]);

        Blueprint::shouldReceive('find')
            ->with('collections.articles')
            ->andReturn($blueprint);

        $tag = $this->makeTag(
            livePreview: true,
            params: ['field' => 'heading', 'blueprint' => 'collections.articles'],
        );

        $result = $tag->index();

        $this->assertStringContainsString('data-sid-field="heading"', $result);
        $this->assertStringContainsString('data-sid-label="Page Heading"', $result);
        $this->assertStringContainsString('data-sid-fieldtype="text"', $result);
    }

    public function test_selfclosing_with_blueprint_param_emits_iconify_fieldtype(): void
    {
        $blueprint = Blueprint::make()->setContents([
            'tabs' => [
                'main' => [
                    'sections' => [
                        [
                            'fields' => [
                                ['handle' => 'icon', 'field' => ['type' => 'iconify', 'display' => 'Icon']],
                            ],
                        ],
                    ],
                ],
            ],
        ]);

        Blueprint::shouldReceive('find')
            ->with('collections.pages')
            ->andReturn($blueprint);

        $tag = $this->makeTag(
            livePreview: true,
            params: ['field' => 'icon', 'inline_edit' => 'true', 'blueprint' => 'collections.pages'],
        );

        $result = $tag->index();

        $this->assertStringContainsString('data-sid-field="icon"', $result);
        $this->assertStringContainsString('data-sid-fieldtype="iconify"', $result);
        $this->assertStringContainsString('data-sid-inline-edit', $result);
    }

    public function test_selfclosing_with_blueprint_param_falls_back_gracefully_when_blueprint_not_found(): void
    {
        Blueprint::shouldReceive('find')
            ->with('collections.nonexistent')
            ->andReturn(null);

        $tag = $this->makeTag(
            livePreview: true,
            params: ['field' => 'heading', 'blueprint' => 'collections.nonexistent'],
        );

        $result = $tag->index();

        $this->assertStringContainsString('data-sid-field="heading"', $result);
        $this->assertStringNotContainsString('data-sid-label', $result);
    }

    // -------------------------------------------------------------------------
    // controls= param — sibling fields offered in the inline toolbar
    // -------------------------------------------------------------------------

    /**
     * Two sets that both define `font_tag`, so set-preference can be asserted, all
     * of it behind a fieldset reference whose `config` carries the sets — which is
     * how a shared block field is actually wired up.
     */
    private function registerControlsBlueprint(): void
    {
        $blueprint = Blueprint::make()->setContents([
            'tabs' => [
                'main' => [
                    'sections' => [
                        [
                            'fields' => [
                                [
                                    'handle' => 'blocks',
                                    'field' => 'shared.blocks',
                                    'config' => [
                                        'sets' => [
                                            'group' => [
                                                'sets' => [
                                                    'headline' => [
                                                        'fields' => [
                                                            ['handle' => 'headline', 'field' => ['type' => 'text']],
                                                            ['handle' => 'note', 'field' => ['type' => 'text', 'display' => 'Note']],
                                                            ['handle' => 'font_tag', 'field' => [
                                                                'type' => 'button_group',
                                                                'display' => 'Font tag',
                                                                'default' => 'h1',
                                                                'options' => [
                                                                    ['key' => 'h1', 'value' => 'H1'],
                                                                    ['key' => 'h2', 'value' => 'H2'],
                                                                ],
                                                            ]],
                                                            ['handle' => 'size', 'field' => [
                                                                'type' => 'select',
                                                                'display' => 'Size',
                                                                'options' => ['small' => 'Small', 'large' => 'Large'],
                                                            ]],
                                                        ],
                                                    ],
                                                    'quote' => [
                                                        'fields' => [
                                                            ['handle' => 'font_tag', 'field' => [
                                                                'type' => 'button_group',
                                                                'display' => 'Quote tag',
                                                                'options' => [['key' => 'blockquote', 'value' => 'Quote']],
                                                            ]],
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ]);

        Blueprint::shouldReceive('find')->with('collections.pages')->andReturn($blueprint);

        // The referenced field carries nothing the lookup needs — the sets live
        // entirely in the override above.
        $fieldset = (new \Statamic\Fields\Fieldset)->setHandle('shared')->setContents([
            'fields' => [
                ['handle' => 'blocks', 'field' => ['type' => 'replicator', 'sets' => []]],
            ],
        ]);

        \Statamic\Facades\Fieldset::shouldReceive('find')->with('shared')->andReturn($fieldset);
    }

    /** The decoded data-sid-controls JSON from a rendered attribute string. */
    private function controlsFrom(string $attr): array
    {
        $this->assertMatchesRegularExpression('/data-sid-controls="[^"]+"/', $attr);
        preg_match('/data-sid-controls="([^"]+)"/', $attr, $matches);

        return json_decode(html_entity_decode($matches[1], ENT_QUOTES), true);
    }

    public function test_controls_param_emits_sibling_fields_of_the_edited_one(): void
    {
        $this->registerControlsBlueprint();

        $tag = $this->makeTag(
            context: ['type' => 'headline'],
            params: [
                'field' => 'headline',
                'inline_edit' => 'true',
                'toolbar' => 'true',
                'controls' => 'font_tag|size',
                'blueprint' => 'collections.pages',
            ],
            livePreview: true,
        );

        $controls = $this->controlsFrom($tag->index());

        $this->assertCount(2, $controls);

        // Named order is kept.
        $this->assertSame('font_tag', $controls[0]['handle']);
        $this->assertSame('Font tag', $controls[0]['display']);
        $this->assertSame('button_group', $controls[0]['type']);
        $this->assertSame('h1', $controls[0]['default']);
        $this->assertSame([['key' => 'h1', 'label' => 'H1'], ['key' => 'h2', 'label' => 'H2']], $controls[0]['options']);

        // Keyed option maps normalize to the same {key,label} shape.
        $this->assertSame('size', $controls[1]['handle']);
        $this->assertSame('select', $controls[1]['type']);
        $this->assertSame([['key' => 'small', 'label' => 'Small'], ['key' => 'large', 'label' => 'Large']], $controls[1]['options']);
    }

    public function test_controls_param_prefers_the_set_named_in_context(): void
    {
        $this->registerControlsBlueprint();

        $tag = $this->makeTag(
            context: ['type' => 'quote'],
            params: [
                'field' => 'headline',
                'inline_edit' => 'true',
                'toolbar' => 'true',
                'controls' => 'font_tag',
                'blueprint' => 'collections.pages',
            ],
            livePreview: true,
        );

        $controls = $this->controlsFrom($tag->index());

        $this->assertSame('Quote tag', $controls[0]['display']);
        $this->assertSame([['key' => 'blockquote', 'label' => 'Quote']], $controls[0]['options']);
    }

    public function test_controls_param_drops_handles_the_toolbar_cannot_render(): void
    {
        $this->registerControlsBlueprint();

        $tag = $this->makeTag(
            context: ['type' => 'headline'],
            params: [
                'field' => 'headline',
                'inline_edit' => 'true',
                // `note` is a text field; `nope` doesn't exist at all.
                'controls' => 'note|nope',
                'blueprint' => 'collections.pages',
            ],
            livePreview: true,
        );

        $this->assertStringNotContainsString('data-sid-controls', $tag->index());
    }

    public function test_controls_param_is_ignored_without_inline_edit(): void
    {
        $this->registerControlsBlueprint();

        $tag = $this->makeTag(
            context: ['type' => 'headline'],
            params: [
                'field' => 'headline',
                'controls' => 'font_tag',
                'blueprint' => 'collections.pages',
            ],
            livePreview: true,
        );

        $result = $tag->index();

        $this->assertStringContainsString('data-sid-field="headline"', $result);
        $this->assertStringNotContainsString('data-sid-controls', $result);
    }

    // -------------------------------------------------------------------------
    // grid_view — widths that can be dragged in the preview
    // -------------------------------------------------------------------------

    /**
     * Params are snake_case, like every other Antlers tag. The dashed spellings
     * predate that and still have to work: templates on other sites use them.
     */
    public function test_snake_case_and_dashed_param_spellings_agree(): void
    {
        foreach ([
            ['outline_inside' => 'true', 'section_orderable' => 'true'],
            ['outline-inside' => 'true', 'section-orderable' => 'true'],
        ] as $params) {
            $tag = $this->makeTag(
                context: ['_visual_id' => 'abc-123'],
                params: $params,
                livePreview: true,
            );

            $result = $tag->index();

            $this->assertStringContainsString('data-sid-inside', $result);
            $this->assertStringContainsString('data-sid-section-orderable', $result);
        }
    }

    public function test_grid_params_accept_both_spellings(): void
    {
        foreach ([
            ['grid_view' => 'true', 'grid_min' => '2', 'grid_resize' => 'split'],
            ['grid-view' => 'true', 'grid-min' => '2', 'grid-resize' => 'split'],
        ] as $params) {
            $result = $this->makeTag(
                context: ['_visual_id' => 'abc-123'],
                params: $params,
                livePreview: true,
            )->index();

            $this->assertStringContainsString('data-sid-grid-min="2"', $result);
            $this->assertStringContainsString('data-sid-grid-resize="split"', $result);
        }
    }

    /** No count in the tag: the preview reads the container's own tracks. */
    public function test_grid_view_states_no_column_count_of_its_own(): void
    {
        $tag = $this->makeTag(
            context: ['_visual_id' => 'abc-123'],
            params: ['grid_view' => 'true'],
            livePreview: true,
        );

        $result = $tag->index();

        $this->assertStringContainsString('data-sid-grid', $result);
        $this->assertStringNotContainsString('data-sid-grid="', $result);
    }

    public function test_grid_params_name_the_columns_field_and_minimum(): void
    {
        $tag = $this->makeTag(
            context: ['_visual_id' => 'abc-123'],
            params: ['grid_view' => 'true', 'grid' => '6', 'grid-field' => 'width', 'grid-min' => '2'],
            livePreview: true,
        );

        $result = $tag->index();

        $this->assertStringContainsString('data-sid-grid="6"', $result);
        $this->assertStringContainsString('data-sid-grid-field="width"', $result);
        $this->assertStringContainsString('data-sid-grid-min="2"', $result);
    }

    public function test_grid_resize_split_is_announced_and_free_is_the_default(): void
    {
        $split = $this->makeTag(
            context: ['_visual_id' => 'abc-123'],
            params: ['grid_view' => 'true', 'grid-resize' => 'split'],
            livePreview: true,
        );

        $free = $this->makeTag(
            context: ['_visual_id' => 'abc-123'],
            params: ['grid_view' => 'true', 'grid-resize' => 'free'],
            livePreview: true,
        );

        $this->assertStringContainsString('data-sid-grid-resize="split"', $split->index());
        $this->assertStringNotContainsString('data-sid-grid-resize', $free->index());
    }

    /** The container holding the blocks is the insertable one — and it returns early. */
    public function test_grid_view_survives_the_insertable_branch(): void
    {
        $tag = $this->makeTag(
            context: ['id' => 'section-1'],
            params: ['field' => 'blocks', 'insertable' => 'true', 'grid_view' => 'true'],
            livePreview: true,
        );

        $result = $tag->index();

        $this->assertStringContainsString('data-sid-insert="blocks"', $result);
        $this->assertStringContainsString('data-sid-grid', $result);
    }

    public function test_template_param_emits_on_an_insertable_container(): void
    {
        $tag = $this->makeTag(
            context: ['id' => 'section-1'],
            params: ['field' => 'list', 'insertable' => 'true', 'template' => 'icon|title:Enter a title'],
            livePreview: true,
        );

        $result = $tag->index();

        $this->assertStringContainsString('data-sid-insert="list"', $result);
        $this->assertStringContainsString('data-sid-template="icon|title:Enter a title"', $result);
    }

    public function test_count_template_emits_on_an_insertable_container(): void
    {
        $tag = $this->makeTag(
            context: ['id' => 'section-1'],
            params: ['field' => 'list', 'insertable' => 'true', 'template' => '3:item'],
            livePreview: true,
        );

        $result = $tag->index();

        $this->assertStringContainsString('data-sid-insert="list"', $result);
        $this->assertStringContainsString('data-sid-template="3:item"', $result);
    }

    public function test_orderable_row_emits_its_own_template(): void
    {
        $tag = $this->makeTag(
            context: ['_visual_id' => 'row-1', 'type' => 'item'],
            params: ['orderable' => 'true', 'template' => 'icon|title'],
            livePreview: true,
        );

        $result = $tag->index();

        $this->assertStringContainsString('data-sid-orderable', $result);
        $this->assertStringContainsString('data-sid-template="icon|title"', $result);
    }

    public function test_empty_template_param_is_omitted(): void
    {
        $tag = $this->makeTag(
            context: ['id' => 'section-1'],
            params: ['field' => 'list', 'insertable' => 'true', 'template' => ''],
            livePreview: true,
        );

        $this->assertStringNotContainsString('data-sid-template', $tag->index());
    }

    public function test_default_param_emits_on_a_field(): void
    {
        $tag = $this->makeTag(
            context: ['id' => 'row-1'],
            params: ['field' => 'title', 'inline_edit' => 'true', 'default' => 'Enter a title'],
            livePreview: true,
        );

        $this->assertStringContainsString('data-sid-default="Enter a title"', $tag->index());
    }

    public function test_placeholder_param_emits_on_a_field(): void
    {
        $tag = $this->makeTag(
            context: ['id' => 'row-1'],
            params: ['field' => 'title', 'inline_edit' => 'true', 'placeholder' => 'Enter a title'],
            livePreview: true,
        );

        $this->assertStringContainsString('data-sid-placeholder="Enter a title"', $tag->index());
        $this->assertStringNotContainsString('data-sid-default', $tag->index());
    }

    public function test_placeholder_prefix_sets_bard_as_and_strips_it_from_the_hint(): void
    {
        $tag = $this->makeTag(
            context: ['id' => 'row-1'],
            params: ['field' => 'title', 'inline_edit' => 'true', 'placeholder' => 'h3:Enter a title'],
            livePreview: true,
        );

        $result = $tag->index();

        $this->assertStringContainsString('data-sid-placeholder="Enter a title"', $result);
        $this->assertStringContainsString('data-sid-as="h3"', $result);
        $this->assertStringNotContainsString('h3:Enter', $result);
    }

    public function test_as_param_declares_the_bard_node_on_its_own(): void
    {
        $tag = $this->makeTag(
            context: ['id' => 'row-1'],
            params: ['field' => 'title', 'inline_edit' => 'true', 'as' => 'h2', 'placeholder' => 'Enter a title'],
            livePreview: true,
        );

        $result = $tag->index();

        $this->assertStringContainsString('data-sid-as="h2"', $result);
        $this->assertStringContainsString('data-sid-placeholder="Enter a title"', $result);
    }

    public function test_placeholder_param_is_omitted_outside_live_preview(): void
    {
        $tag = $this->makeTag(
            context: ['id' => 'row-1'],
            params: ['field' => 'title', 'inline_edit' => 'true', 'placeholder' => 'Enter a title'],
            livePreview: false,
        );

        $this->assertSame('', $tag->index());
    }

    public function test_default_param_is_omitted_outside_live_preview(): void
    {
        $tag = $this->makeTag(
            context: ['id' => 'row-1'],
            params: ['field' => 'title', 'inline_edit' => 'true', 'default' => 'Enter a title'],
            livePreview: false,
        );

        $this->assertSame('', $tag->index());
    }

    public function test_no_grid_attributes_without_the_param(): void
    {
        $tag = $this->makeTag(
            context: ['_visual_id' => 'abc-123'],
            livePreview: true,
        );

        $this->assertStringNotContainsString('data-sid-grid', $tag->index());
    }
}
