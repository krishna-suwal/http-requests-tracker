<?php

use HRT\UrlSchemes\AbsoluteUrlScheme;
use HRT\UrlSchemes\UrlScheme;

class UrlSchemeHelpersTest extends WP_UnitTestCase {
	public function test_hrt_prepare_url_scheme() {
		$this->assertTrue( function_exists( 'hrt_prepare_url_scheme' ) );

		$scheme = hrt_prepare_url_scheme(
			array(
				'type' => 'absolute',
				'url'  => 'example.com/?test',
			)
		);

		$this->assertTrue( $scheme instanceof UrlScheme );
		$this->assertEquals( AbsoluteUrlScheme::class, get_class( $scheme ) );
		$this->assertEquals( 'example.com/?test', $scheme->get( 'url' ) );
	}

	public function test_hrt_match_url_scheme() {
		$this->assertTrue( function_exists( 'hrt_match_url_scheme' ) );
		$this->assertTrue(
			hrt_match_url_scheme(
				'example.com/?test',
				array(
					'type' => 'absolute',
					'url'  => 'example.com/?test',
				)
			)
		);
		$this->assertFalse(
			hrt_match_url_scheme(
				'example.com/?test',
				array(
					'type' => 'absolute',
					'url'  => 'example2.com/?test',
				)
			)
		);
	}
}
