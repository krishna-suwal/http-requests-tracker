<?php
/**
 * Core permission handlers.
 *
 * @package HRT\Permissions
 *
 * @since 0.1.0
 */

namespace HRT\Permissions;

defined( 'ABSPATH' ) || exit;

class CorePermissions {
	/**
	 * Register all permissions.
	 *
	 * @since 0.1.0
	 */
	public static function register_all() {
		Permissions::register( 'auth.is-logged-in', array( __CLASS__, 'is_user_logged_in' ) );
		Permissions::register( 'auth.current-user.has-cap', array( __CLASS__, 'current_user_has_cap' ) );
		Permissions::register( 'auth.current-user.has-caps', array( __CLASS__, 'current_user_has_caps' ) );
		Permissions::register( 'auth.current-user.has-role', array( __CLASS__, 'current_user_has_role' ) );
	}

	/**
	 * Check if the current user is logged in.
	 *
	 * @since 0.1.0
	 *
	 * @throws \Exception
	 *
	 * @return boolean
	 */
	public static function is_user_logged_in() {
		if ( ! is_user_logged_in() ) {
			throw new \Exception( __( 'User not logged in', 'hrt' ) );
		}
		return true;
	}

	/**
	 * Check if the current user has a capability.
	 *
	 * @since 0.1.0
	 *
	 * @param string $cap
	 *
	 * @throws \Exception
	 *
	 * @return boolean
	 */
	public static function current_user_has_cap( $cap ) {
		if ( ! current_user_can( $cap ) ) {
			/* translators: %s: Capability slug */
			throw new \Exception( sprintf( __( "User does not have capability '%s'", 'hrt' ), $cap ) );
		}
		return true;
	}

	/**
	 * Check if the current user has the given capabilites.
	 *
	 * @since 0.1.0
	 *
	 * @param string ...$caps
	 *
	 * @throws \Exception
	 *
	 * @return boolean
	 */
	public static function current_user_has_caps( ...$caps ) {
		$caps         = (array) $caps;
		$missing_caps = array();

		foreach ( $caps as $cap ) {
			if ( current_user_can( $cap ) ) {
				continue;
			}
			$missing_caps[] = $cap;
		}

		if ( count( $missing_caps ) > 0 ) {
			/* translators: %s: Capability slug */
			throw new \Exception( sprintf( __( 'User does not have capabilities: %s', 'hrt' ), implode( ', ', $missing_caps ) ) );
		}

		return true;
	}

	/**
	 * Check if the current user has a role.
	 *
	 * @since 0.1.0
	 *
	 * @param string $role
	 *
	 * @throws \Exception
	 *
	 * @return boolean
	 */
	public static function current_user_has_role( $role ) {
		if ( ! is_user_logged_in() ) {
			throw new \Exception( __( 'User not logged in', 'hrt' ) );
		}
		$user = wp_get_current_user();

		if ( ! in_array( $role, (array) $user->roles, true ) ) {
			/* translators: %s: Role slug */
			throw new \Exception( sprintf( __( "User does not have role '%s'", 'hrt' ), $role ) );
		}

		return true;
	}
}
