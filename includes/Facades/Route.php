<?php
/**
 * Route facade class.
 *
 * @package HRT\Facades
 *
 * @since 0.1.0
 */

namespace HRT\Facades;

use HRT\RestAPI\Routing\Router;

class Route {
	/**
	 * Handle static method calls.
	 *
	 * @since 0.1.0
	 *
	 * @param string $name
	 * @param array $arguments
	 *
	 * @return mixed
	 */
	public static function __callStatic( $name, $arguments ) {
		return ( new Router() )->$name( ...$arguments );
	}
}
