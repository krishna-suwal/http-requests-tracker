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

class StatsApiPermissions {
	/**
	 * Register permission handlers.
	 *
	 * @since 0.1.0
	 */
	public static function register_all() {
		Permissions::register( 'api.stats.read', array( __CLASS__, 'api_stats_read' ) );
	}

	/**
	 * Permission for read stats API.
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @since 0.1.0
	 */
	public static function api_stats_read( $request ) {
		Permissions::check( 'auth.is-logged-in' );

		if ( Permissions::check_silent( 'auth.current-user.has-role', 'administrator' ) ) {
			return true;
		}
		if ( Permissions::check_silent( 'auth.current-user.has-cap', 'hrt_read_stats' ) ) {
			return true;
		}
		throw new \Exception( 'User should either be admin or should have \'hrt_read_stats\' capability.' );
	}
}
