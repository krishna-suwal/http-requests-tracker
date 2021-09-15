<?php
/**
 * Model class core methods interface.
 *
 * @since 0.1.0
 *
 * @package HRT\Contracts
 */

namespace HRT\Contracts;

defined( 'ABSPATH' ) || exit;

interface ModelCore {
	public function set( $prop, $value);
	public function set_props( $props, $context = 'view');
	public function get( $prop, $default_value = null, $context = 'view');
	public function get_data();
	public function reset();
	public function has_prop( $prop);
	public function set_object_read( $bool);
	public function get_object_read();
	public function get_changes();
	public function get_object_type();
}
