<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Support\Facades\Event;
use MarioHamann\StatamicVisualEditor\Fieldtypes\AutoUuidFieldtype;
use MarioHamann\StatamicVisualEditor\Fieldtypes\SveLiteSections;
use MarioHamann\StatamicVisualEditor\Http\Middleware\DisableViteHotReload;
use MarioHamann\StatamicVisualEditor\Http\Middleware\InjectBridgeScript;
use MarioHamann\StatamicVisualEditor\Listeners\InjectVisualIdIntoBlueprint;
use MarioHamann\StatamicVisualEditor\Listeners\StripVisualIds;
use MarioHamann\StatamicVisualEditor\Listeners\UseLiteSections;
use MarioHamann\StatamicVisualEditor\ServiceProvider;
use MarioHamann\StatamicVisualEditor\Tags\VisualEdit;
use Statamic\Events\EntryBlueprintFound;
use Statamic\Events\EntrySaving;
use Statamic\Events\GlobalVariablesBlueprintFound;
use Statamic\Events\GlobalVariablesSaving;
use Statamic\Fields\FieldtypeRepository;

class ServiceProviderTest extends TestCase
{
    public function test_addon_service_provider_is_registered(): void
    {
        $this->assertArrayHasKey(ServiceProvider::class, $this->app->getLoadedProviders());
    }

    public function test_config_file_is_accessible_with_expected_default(): void
    {
        $this->assertTrue(config('statamic-visual-editor.enabled', false));
    }

    public function test_fieldtype_registered(): void
    {
        $fieldtype = app(FieldtypeRepository::class)->find('auto_uuid');

        $this->assertInstanceOf(AutoUuidFieldtype::class, $fieldtype);
    }

    public function test_lite_sections_fieldtype_registered(): void
    {
        $fieldtype = app(FieldtypeRepository::class)->find('sve_lite_sections');

        $this->assertInstanceOf(SveLiteSections::class, $fieldtype);
    }

    public function test_use_lite_sections_listener_registered(): void
    {
        Event::fake();

        Event::assertListening(EntryBlueprintFound::class, UseLiteSections::class);
    }

    public function test_sve_tw_tag_registered(): void
    {
        $this->assertContains('sve_tw', collect(app('statamic.tags'))->keys()->all());
    }

    public function test_tag_registered(): void
    {
        $tag = app(VisualEdit::class);

        $this->assertInstanceOf(VisualEdit::class, $tag);
    }

    public function test_blade_helper_registered(): void
    {
        $this->assertTrue(function_exists('visual_edit'));
    }

    public function test_inject_visual_id_into_blueprint_listener_registered_for_entry_blueprint_found(): void
    {
        Event::fake();

        Event::assertListening(EntryBlueprintFound::class, InjectVisualIdIntoBlueprint::class);
    }

    public function test_inject_visual_id_into_blueprint_listener_registered_for_global_variables_blueprint_found(): void
    {
        Event::fake();

        Event::assertListening(GlobalVariablesBlueprintFound::class, InjectVisualIdIntoBlueprint::class);
    }

    public function test_strip_visual_ids_listener_registered_for_entry_saving(): void
    {
        Event::fake();

        Event::assertListening(EntrySaving::class, StripVisualIds::class);
    }

    public function test_strip_visual_ids_listener_registered_for_global_variables_saving(): void
    {
        Event::fake();

        Event::assertListening(GlobalVariablesSaving::class, StripVisualIds::class);
    }

    public function test_middleware_is_registered_in_web_group(): void
    {
        $middleware = $this->app['router']->getMiddlewareGroups()['web'] ?? [];

        $this->assertContains(InjectBridgeScript::class, $middleware);
        $this->assertContains(DisableViteHotReload::class, $middleware);
    }
}
