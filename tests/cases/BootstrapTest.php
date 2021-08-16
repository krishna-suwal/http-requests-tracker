<?php

use HRT\HTTPRequestsTracker;

class BootstrapTest extends WP_UnitTestCase {
	public function test_providers_variable() {
		$providers = include HRT_PLUGIN_DIR . '/bootstrap/providers.php';

		$this->assertEquals( 'array', gettype( $providers ) );
		$this->assertTrue( count( $providers ) > 0 );
	}
	public function test_service_providers_getter() {
		$this->assertTrue( function_exists( 'hrt' ) );

		$app = hrt( 'app' );

		$this->assertTrue( $app instanceof HTTPRequestsTracker );
	}
}
