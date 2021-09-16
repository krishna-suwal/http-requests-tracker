<?php
/**
 * Deactivation class.
 *
 * @since 0.1.0
 */

namespace HRT;

class Deactivation {

	/**
	 * Initialization.
	 *
	 * @since 0.1.0
	 */
	public static function init() {
		register_deactivation_hook( Constants::get( 'HRT_PLUGIN_FILE' ), array( __CLASS__, 'on_deactivate' ) );
	}

	/**
	 * Callback for plugin deactivation hook.
	 *
	 * @since 0.1.0
	 */
	public static function on_deactivate() {
	}
}
