<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use MarioHamann\StatamicVisualEditor\PageSpeed;

/**
 * The checks made before Google is asked anything. Pinned before the WP7d
 * split; the request itself needs the network and is not tested here.
 */
class PageSpeedTest extends TestCase
{
    public function test_a_local_domain_is_not_something_google_can_reach(): void
    {
        foreach ([
            'http://vizuall-skabelon.test/',
            'http://site.local/page',
            'http://localhost/',
            'http://127.0.0.1:8000/',
            'http://192.168.1.20/',
            'http://10.0.0.5/',
            'http://nodots/',
        ] as $url) {
            $this->assertFalse(PageSpeed::isPublicHost($url), $url);
        }
    }

    public function test_a_public_domain_or_address_is(): void
    {
        $this->assertTrue(PageSpeed::isPublicHost('https://vizuall.dk/'));
        $this->assertTrue(PageSpeed::isPublicHost('https://www.example.com/page?x=1'));
        $this->assertTrue(PageSpeed::isPublicHost('http://8.8.8.8/'));
    }

    public function test_only_this_sites_own_pages_may_be_tested(): void
    {
        config(['app.url' => 'https://vizuall.dk']);

        $this->assertTrue(PageSpeed::isOwnUrl('https://vizuall.dk/om-os'));
        $this->assertTrue(PageSpeed::isOwnUrl('http://VIZUALL.DK/'));
        $this->assertFalse(PageSpeed::isOwnUrl('https://example.com/'));
        $this->assertFalse(PageSpeed::isOwnUrl('not a url'));
    }
}
