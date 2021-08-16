<?php

use HRT\UrlSchemes\UrlScheme;

class UrlSchemeTest extends WP_UnitTestCase {
	public function setUp() {
		parent::setUp();

		$this->scheme = $this->getMockForAbstractClass( UrlScheme::class );
		$this->scheme->expects( $this->any() )
			->method( 'match_url' )
			->will( $this->returnValue( true ) );
	}

	public function test_set_and_get() {
		$this->scheme->set( 'config1', 'value1' );

		$this->assertEquals( 'value1', $this->scheme->get( 'config1' ) );
	}

	public function test_has() {
		$this->assertFalse( $this->scheme->has( 'random-config-name' ) );
	}

	public function test_set_data() {
		$this->scheme->set( 'config-that-will-be-removed', 'some-value' );
		$this->scheme->set_data(
			array(
				'config1' => 'value1',
				'config2' => 'value2',
			)
		);

		$this->assertEquals( 'value1', $this->scheme->get( 'config1' ) );
		$this->assertEquals( 'value2', $this->scheme->get( 'config2' ) );
		$this->assertFalse( $this->scheme->has( 'config-that-will-be-removed' ) );
	}

	public function test_get_data() {
		$this->scheme->set( 'config-that-will-be-removed', 'some-value' );
		$this->scheme->set_data(
			array(
				'config1' => 'value1',
				'config2' => 'value2',
			)
		);
		$data = $this->scheme->get_data();

		$this->assertTrue( isset( $data['config1'] ) );
		$this->assertTrue( isset( $data['config2'] ) );
		$this->assertEquals( 'value1', $data['config1'] );
		$this->assertEquals( 'value2', $data['config2'] );
		$this->assertFalse( isset( $data['config-that-will-be-removed'] ) );
	}
}
