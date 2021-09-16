<?php
/**
 * Activation class.
 *
 * @since 0.1.0
 */

namespace HRT;

class Activation {

	/**
	 * Initialization.
	 *
	 * @since 0.1.0
	 *
	 * @return void
	 */
	public static function init() {
		register_activation_hook( Constants::get( 'HRT_PLUGIN_FILE' ), array( __CLASS__, 'on_activate' ) );
	}

	/**
	 * Callback for plugin activation hook.
	 *
	 * @since 0.1.0
	 */
	public static function on_activate() {
	}
}
