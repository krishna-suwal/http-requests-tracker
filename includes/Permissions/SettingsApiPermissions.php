<?php
/**
 * Settings API permissions handler.
 *
 * @package HRT\Permissions
 *
 * @since 0.1.0
 */

namespace HRT\Permissions;

defined( 'ABSPATH' ) || exit;

class SettingsApiPermissions {
	/**
	 * Register permission handlers.
	 *
	 * @since 0.1.0
	 */
	public static function register_all() {
		Permissions::register( 'api.settings.read', array( __CLASS__, 'api_settings_read' ) );
		Permissions::register( 'api.settings.update', array( __CLASS__, 'api_settings_update' ) );
	}

	/**
	 * Permission for read settings API.
	 *
	 * @since 0.1.0
	 *
	 * @param \WP_REST_Request $request
	 */
	public static function api_settings_read( $request ) {
		Permissions::check( 'auth.is-logged-in' );

		if ( Permissions::check_silent( 'auth.current-user.has-role', 'administrator' ) ) {
			return true;
		}
		if ( Permissions::check_silent( 'auth.current-user.has-cap', 'hrt_read_settings' ) ) {
			return true;
		}
		throw new \Exception( 'User should either be admin or should have \'hrt_read_settings\' capability.' );
	}

	/**
	 * Permission for update settings API.
	 *
	 * @param \WP_REST_Request $request
	 */
	public static function api_settings_update( $request ) {
		Permissions::check( 'auth.is-logged-in' );

		if ( Permissions::check_silent( 'auth.current-user.has-role', 'administrator' ) ) {
			return true;
		}
		if ( Permissions::check_silent( 'auth.current-user.has-cap', 'hrt_update_settings' ) ) {
			return true;
		}
		throw new \Exception( 'User should either be admin or should have \'hrt_update_settings\' capability.' );
	}
}
