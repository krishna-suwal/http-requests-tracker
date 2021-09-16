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

class PermissionsList {
	/**
	 * Register all the permissions handlers.
	 *
	 * @since 0.1.0
	 */
	public static function register_all() {
		CorePermissions::register_all();
		StatsApiPermissions::register_all();
		LogsApiPermissions::register_all();
		SettingsApiPermissions::register_all();
	}
}
