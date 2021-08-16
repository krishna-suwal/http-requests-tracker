<?php
/**
 * Class UrlSchemesTest
 *
 * @package Wp_Requests_Tracker
 */

use HRT\UrlSchemes\AbsoluteUrlScheme;

/**
 * Sample test case.
 */
class UrlSchemesTest extends WP_UnitTestCase {

	/**
	 * A single example test.
	 */
	public function test_absolute_url_scheme() {
		$scheme = new AbsoluteUrlScheme(
			array(
				'url' => '/?test',
			)
		);
		// Replace this with some actual testing code.
		$this->assertTrue( $scheme->match_url( '/?test' ) );
	}
}
