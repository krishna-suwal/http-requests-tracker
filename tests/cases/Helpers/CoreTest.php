<?php

class CoreTest extends WP_UnitTestCase {
	public function test_hrt_is_log_request() {
		$this->assertTrue( function_exists( 'hrt_is_log_request' ) );
		$this->assertTrue(
			hrt_is_log_request(
				'example.com/?test',
				array(
					array(
						'type' => 'absolute',
						'url'  => 'example.com/?test',
					),
				)
			)
		);
		$this->assertFalse(
			hrt_is_log_request(
				'example2.com/?test',
				array(
					array(
						'type' => 'absolute',
						'url'  => 'example.com/?test',
					),
				)
			)
		);
	}

	public function test_hrt_get_current_request_url() {
		$this->assertTrue( function_exists( 'hrt_get_current_request_url' ) );

		$protocol    = isset( $_SERVER['HTTPS'] ) && 'on' === $_SERVER['HTTPS'] ? 'https' : 'http';
		$current_url = "$protocol://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

		$this->assertEquals( $current_url, hrt_get_current_request_url() );
	}

	public function test_hrt_is_log_current_request() {
		$this->assertTrue( function_exists( 'hrt_is_log_current_request' ) );

		$protocol    = isset( $_SERVER['HTTPS'] ) && 'on' === $_SERVER['HTTPS'] ? 'https' : 'http';
		$current_url = "$protocol://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

		$this->assertTrue(
			hrt_is_log_current_request(
				array(
					array(
						'type' => 'absolute',
						'url'  => $current_url,
					),
				)
			)
		);
		$this->assertFalse(
			hrt_is_log_current_request(
				array(
					array(
						'type' => 'absolute',
						'url'  => 'random-name.com',
					),
				)
			)
		);
	}
}
