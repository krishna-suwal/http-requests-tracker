<?php
/**
 * Permissions list.
 *
 * @package HRT\Permissions
 *
 * @since 0.1.0
 */

namespace HRT\Permissions;

defined( 'ABSPATH' ) || exit;

class LogsApiPermissions {
	/**
	 * Register permission handlers.
	 *
	 * @since 0.1.0
	 */
	public static function register_all() {
		Permissions::register( 'api.logs.read', array( __CLASS__, 'api_logs_read' ) );
		Permissions::register( 'api.logs.delete', array( __CLASS__, 'api_logs_delete' ) );
	}

	/**
	 * Permission for read logs API.
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @since 0.1.0
	 */
	public static function api_logs_read( $request ) {
		Permissions::check( 'auth.is-logged-in' );

		if ( Permissions::check_silent( 'auth.current-user.has-role', 'administrator' ) ) {
			return true;
		}
		if ( Permissions::check_silent( 'auth.current-user.has-cap', 'hrt_read_logs' ) ) {
			return true;
		}
		throw new \Exception( 'User should either be admin or should have \'hrt_read_logs\' capability.' );
	}

	/**
	 * Permission for delete logs API.
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @since 0.1.0
	 */
	public static function api_logs_delete( $request ) {
		Permissions::check( 'auth.is-logged-in' );

		if ( Permissions::check_silent( 'auth.current-user.has-role', 'administrator' ) ) {
			return true;
		}
		if ( Permissions::check_silent( 'auth.current-user.has-cap', 'hrt_delete_logs' ) ) {
			return true;
		}
		throw new \Exception( 'User should either be admin or should have \'hrt_delete_logs\' capability.' );
	}
}
