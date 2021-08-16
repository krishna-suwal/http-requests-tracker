<?php

use HRT\Constants;

class ConstantsTest extends WP_UnitTestCase {
	public function test_set_and_get() {
		Constants::set( 'TEST_CONST', true );

		$this->assertTrue( Constants::get( 'TEST_CONST' ) );
		$this->assertEquals( ABSPATH, Constants::get( 'ABSPATH' ) );
	}

	public function test_is_defined() {
		$this->assertFalse( Constants::is_defined( 'RANDOM_CONST_NAME' ) );
		$this->assertTrue( Constants::is_defined( 'ABSPATH' ) );

		Constants::set( 'TEST_CONST', true );
		$this->assertTrue( Constants::is_defined( 'TEST_CONST' ) );
	}

	public function test_is_true() {
		Constants::set( 'TEST_CONST', true );
		$this->assertTrue( Constants::is_true( 'TEST_CONST' ) );

		Constants::set( 'TEST_CONST', 'some stuff' );
		$this->assertFalse( Constants::is_true( 'TEST_CONST' ) );
	}

	public function test_clear() {
		Constants::set( 'TEST_CONST', true );
		Constants::clear( 'TEST_CONST' );

		$this->assertFalse( Constants::is_defined( 'TEST_CONST' ) );
	}

	public function test_clear_all() {
		Constants::set( 'TEST_CONST_1', true );
		Constants::set( 'TEST_CONST_2', true );
		Constants::clear_all();

		$this->assertFalse( Constants::is_defined( 'TEST_CONST_1' ) );
		$this->assertFalse( Constants::is_defined( 'TEST_CONST_2' ) );
	}
}
