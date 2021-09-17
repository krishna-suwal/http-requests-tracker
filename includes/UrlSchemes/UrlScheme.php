<?php
/**
 * UrlScheme class.
 *
 * @package HRT\UrlSchemes
 *
 * @since 0.1.0
 */

namespace HRT\UrlSchemes;

defined( 'ABSPATH' ) || exit;

abstract class UrlScheme {
	/**
	 * Scheme Data.
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	protected $data = array();

	/**
	 * Constructor.
	 *
	 * @since 0.1.0
	 *
	 * @param array $data
	 */
	public function __construct( $data = array() ) {
		$this->set_data( $data );
	}

	/**
	 * Set attribute.
	 *
	 * @since 0.1.0
	 *
	 * @param string $name
	 * @param mixed $value
	 */
	public function set( $name, $value ) {
		$this->data[ $name ] = $value;
	}

	/**
	 * Check if an attribute is set.
	 *
	 * @since 0.1.0
	 *
	 * @param string $name
	 *
	 * @return mixed
	 */
	public function has( $name ) {
		return isset( $this->data[ $name ] );
	}

	/**
	 * Get attribute.
	 *
	 * @since 0.1.0
	 *
	 * @param string $name
	 *
	 * @return mixed
	 */
	public function get( $name ) {
		if ( ! isset( $this->data[ $name ] ) ) {
			return null;
		}
		return $this->data[ $name ];
	}

	/**
	 * Set all attributes/data. Note that it will remove everything and set the given data.
	 *
	 * @since 0.1.0
	 *
	 * @param array $data
	 */
	public function set_data( $data ) {
		$this->data = (array) $data;
	}

	/**
	 * Get all attributes/data.
	 *
	 * @since 0.1.0
	 *
	 * @return array
	 */
	public function get_data() {
		return $this->data;
	}

	/**
	 * Match URL with this scheme.
	 *
	 * @since 0.1.0
	 *
	 * @param string $url
	 *
	 * @return boolean
	 */
	abstract public function match_url( $url);
}
