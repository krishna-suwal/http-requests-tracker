<?php
/**
 * Permissions manager.
 *
 * @package HRT\Permissions
 *
 * @since 0.1.0
 */

namespace HRT\Permissions;

defined( 'ABSPATH' ) || exit;

class Permissions {
	/**
	 * List of permissions handlers.
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	protected static $handlers = array();

	/**
	 * Register a permission handler.
	 *
	 * @since 0.1.0
	 *
	 * @param string $name
	 * @param callable $handler
	 */
	public static function register( $name, $handler ) {
		if ( ! is_callable( $handler ) ) {
			return;
		}
		self::$handlers[ $name ] = $handler;
	}

	/**
	 * Check if a permission handler exist.
	 *
	 * @since 0.1.0
	 *
	 * @param string $name
	 *
	 * @return boolean
	 */
	public static function has( $name ) {
		return isset( self::$handlers[ $name ] );
	}

	/**
	 * Get a permission handler.
	 *
	 * @since 0.1.0
	 *
	 * @param string $name
	 *
	 * @return callable
	 */
	public static function get( $name ) {
		return ( self::$handlers[ $name ] );
	}

	/**
	 * Run a permission handler and check permissions.
	 *
	 * Returns false or throws an Exception with a message, if the permission is denied.
	 * If the permission check passes, it is not gauranteed to return value "true".
	 *
	 * @since 0.1.0
	 *
	 * @param string $name
	 * @param mixed ...$args
	 *
	 * @throws \Exception
	 *
	 * @return boolean
	 */
	public static function check( $name, ...$args ) {
		if ( ! self::has( $name ) ) {
			throw new \Exception( "No permission handler named {$name}" );
		}
		$result = ( self::get( $name ) )( ...$args );

		return apply_filters( 'hrt_permission_check', $result, $name, $args );
	}

	/**
	 * Check permission, but instead of throwing exception return false value on permission denial.
	 *
	 * @since 0.1.0
	 *
	 * @param string $name
	 * @param mixed ...$args
	 *
	 * @return boolean
	 */
	public static function check_silent( $name, ...$args ) {
		if ( ! self::has( $name ) ) {
			return apply_filters( 'hrt_permission_check', false, $name, $args );
		}
		$result = false;

		try {
			$result = ( self::get( $name ) )( ...$args );
		} catch ( \Throwable $e ) {
			return false;
		}

		// TODO Check what happens if the hook throws exception. Handle the exception.
		return apply_filters( 'hrt_permission_check', $result, $name, $args );
	}
}
