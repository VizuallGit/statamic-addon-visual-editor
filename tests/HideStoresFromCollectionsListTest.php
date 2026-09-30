<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use MarioHamann\StatamicVisualEditor\Http\Middleware\HideStoresFromCollectionsList;

class HideStoresFromCollectionsListTest extends TestCase
{
    public function test_the_editors_stores_are_not_offered_in_a_collections_field(): void
    {
        $response = $this->pick($this->relationshipRequest('collections'));

        $this->assertSame(['pages', 'cases'], $this->handles($response));
    }

    public function test_the_columns_survive_the_filtering(): void
    {
        $response = $this->pick($this->relationshipRequest('collections'));

        $this->assertSame([['field' => 'title']], $response->getData(true)['meta']['columns']);
    }

    public function test_another_relationship_fieldtype_is_left_alone(): void
    {
        $response = $this->pick($this->relationshipRequest('entries'));

        $this->assertSame(['pages', 'saved_sections', 'saved_compositions', 'templates', 'cases'], $this->handles($response));
    }

    public function test_an_unreadable_config_is_left_alone(): void
    {
        $response = $this->pick($this->relationshipRequest(null, 'not base64 at all'));

        $this->assertSame(['pages', 'saved_sections', 'saved_compositions', 'templates', 'cases'], $this->handles($response));
    }

    /** The rows Statamic would hand back, before we touch them. */
    protected function pick(Request $request): JsonResponse
    {
        return (new HideStoresFromCollectionsList)->handle($request, fn () => new JsonResponse([
            'data' => [
                ['id' => 'pages', 'title' => 'Pages'],
                ['id' => 'saved_sections', 'title' => 'Sections'],
                ['id' => 'saved_compositions', 'title' => 'Compositions'],
                ['id' => 'templates', 'title' => 'Templates'],
                ['id' => 'cases', 'title' => 'Cases'],
            ],
            'meta' => ['columns' => [['field' => 'title']]],
        ]));
    }

    protected function relationshipRequest(?string $type, ?string $rawConfig = null): Request
    {
        $config = $rawConfig ?? base64_encode(json_encode(['type' => $type]));

        $request = Request::create('/cp/fieldtypes/relationship', 'GET', ['config' => $config]);

        $route = (new Route(['GET'], 'cp/fieldtypes/relationship', []))
            ->name('statamic.cp.fieldtypes.relationship.index');

        $request->setRouteResolver(fn () => $route);

        return $request;
    }

    /** @return list<string> */
    protected function handles(JsonResponse $response): array
    {
        return array_column($response->getData(true)['data'], 'id');
    }
}
