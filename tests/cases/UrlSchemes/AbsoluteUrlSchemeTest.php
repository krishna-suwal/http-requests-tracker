<?php

use HRT\URL;
use HRT\UrlSchemes\AbsoluteUrlScheme;

class AbsoluteUrlSchemeTest extends WP_UnitTestCase {
	public function setUp() {
		parent::setUp();

		$this->scheme = new AbsoluteUrlScheme(
			array(
				'url' => 'example.com/?test',
			)
		);
	}

	public function test_get_original_url() {
		$url = $this->scheme->get_url();

		$this->assertEquals( 'example.com/?test', $url->get_original_url() );
	}

	public function test_get_url() {
		$url = $this->scheme->get_url();

		$this->assertTrue( $url instanceof URL );
		$this->assertEquals( 'example.com/?test', $url->get_original_url() );
	}

	public function test_match_url() {
		$this->assertTrue( $this->scheme->match_url( 'example.com/?test' ) );
	}
}
