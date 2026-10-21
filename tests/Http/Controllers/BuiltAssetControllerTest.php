<?php

namespace MarioHamann\StatamicVisualEditor\Tests\Http\Controllers;

use MarioHamann\StatamicVisualEditor\BuiltAssets;
use MarioHamann\StatamicVisualEditor\Tests\TestCase;

/**
 * The preview scripts come from the addon's own build, through PHP. The
 * answer is cacheable for a year, and a browser that revalidates anyway gets
 * a 304 with no body instead of the chunk again.
 */
class BuiltAssetControllerTest extends TestCase
{
    public function test_a_built_chunk_is_served_with_an_etag_and_a_year_of_cache(): void
    {
        $response = $this->get(BuiltAssets::url('resources/js/bridge.js'));

        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/javascript; charset=utf-8');

        $cache = (string) $response->headers->get('Cache-Control');
        $this->assertStringContainsString('max-age=31536000', $cache);
        $this->assertStringContainsString('immutable', $cache);
        $this->assertStringContainsString('public', $cache);

        $this->assertNotEmpty($response->headers->get('ETag'));
        $this->assertNotEmpty($response->headers->get('Last-Modified'));
    }

    public function test_a_matching_etag_is_answered_with_304_and_no_body(): void
    {
        $url = BuiltAssets::url('resources/js/bridge.js');
        $etag = $this->get($url)->headers->get('ETag');

        $response = $this->get($url, ['If-None-Match' => $etag]);

        $response->assertStatus(304);
        // A 304 carries no representation: Symfony strips the body headers with it.
        $response->assertHeaderMissing('Content-Type');
        $response->assertHeaderMissing('Content-Length');
    }

    public function test_an_old_etag_gets_the_chunk_again(): void
    {
        $response = $this->get(BuiltAssets::url('resources/js/bridge.js'), ['If-None-Match' => '"stale"']);

        $response->assertOk();
    }

    public function test_a_file_the_manifest_does_not_name_is_not_served(): void
    {
        $this->get('/!/sve/build/../../composer.json')->assertNotFound();
        $this->get('/!/sve/build/assets/not-a-chunk.js')->assertNotFound();
    }
}
