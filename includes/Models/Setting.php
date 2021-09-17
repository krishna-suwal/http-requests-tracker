<?php
/**
 * Setting API Class
 *
 * Admin Settings API used by Integrations, Shipping Methods, and Payment Gateways.
 *
 * @since 0.1.0
 *
 * @package  HRT\Models
 */

namespace HRT\Models;

defined( 'ABSPATH' ) || exit;

use HRT\ModelCore;

/**
 * Setting class.r
 */
class Setting extends ModelCore {

	/**
	 * This is the name of this object type.
	 *
	 * @since 0.1.0
	 * @var string
	 */
	protected $object_type = 'setting';

	/**
	 * Callbacks for sanitize.
	 *
	 * @since 0.1.0
	 * @var string
	 */
	protected $sanitize_callbacks = array(
		'stats.allow_stats_on_frontend' => 'hrt_string_to_bool',
		'developer.template_debug'      => 'hrt_string_to_bool',
		'developer.debug'               => 'hrt_string_to_bool',
	);

	/**
	 * The posted settings data. When empty, $_POST data will be used.
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	protected $default_data = array(
		'stats.allow_stats_on_frontend' => false,

		'schemes.enable'                => true,
		'schemes.list'                  => array(),

		'developer.template_debug'      => false,
		'developer.debug'               => false,
	);

	/**
	 * Constructor.
	 *
	 * @since  0.1.0
	 *
	 * @param boolean $read
	 */
	public function __construct( $read = true ) {
		parent::__construct();

		if ( $read ) {
			$this->read();
		}
	}

	/**
	 * Read settings.
	 *
	 * @since  0.1.0
	 */
	public function read() {
		$option_value  = get_option( 'hrt.settings' );
		$setting_value = array();

		if ( is_string( $option_value ) ) {
			try {
				$parsed = json_decode( $option_value, true );

				if ( is_array( $parsed ) ) {
					$setting_value = $parsed;
				}
			} catch ( \Throwable $e ) {
				// TODO Log error.
				$e->getMessage();
			}
		}

		foreach ( $setting_value as $key => $value ) {
			if ( ! $this->has_prop( $key ) ) {
				continue;
			}
			$this->set( $key, $value );
		}
		$this->set_object_read( true );
	}

	/**
	 * Get all settings in array format.
	 *
	 * @since  0.1.0
	 *
	 * @return array
	 */
	public function get_all() {
		$data = $this->get_data();

		if ( ! isset( $data['schemes.list'] ) || ! is_array( $data['schemes.list'] ) ) {
			$data['schemes.list'] = array();
			return $data;
		}
		foreach ( $data['schemes.list'] as &$item ) {
			if ( ! isset( $item['author'] ) || ! is_array( $item['author'] ) || ! isset( $item['author']['id'] ) ) {
				continue;
			}
			$author      = get_user_by( 'id', $item['author']['id'] );
			$author_data = array(
				'id'           => 0,
				'display_name' => __( 'Guest User', 'hrt' ),
				'avatar_url'   => '',
			);

			if ( $author && ! is_wp_error( $author ) ) {
				$author_data = array(
					'id'           => $author->ID,
					'display_name' => $author->data->display_name,
					'avatar_url'   => get_avatar_url( $author->ID ),
				);
			}
			$item['author'] = $author_data;
		}
		return $data;
	}

	/**
	 * Save the settings.
	 *
	 * @since  0.1.0
	 *
	 * @return mixed
	 */
	public function save() {
		$this->apply_changes();

		$settings     = $this->get_data();
		$settings     = (array) apply_filters( 'hrt_before_save_settings', $settings, $this );
		$settings_str = wp_json_encode( $settings );

		return update_option( 'hrt.settings', $settings_str, true );
	}
}
