<?php
/**
 * Register routes.
 *
 * @package HRT\RestAPI\Routes
 *
 * @since 0.1.0
 */

namespace HRT\RestAPI\Routes;

use HRT\RestAPI\Routing\RouteCollection;
use HRT\RestAPI\Routing\Router;

defined( 'ABSPATH' ) || exit;

class RoutesRegistrar {
	/**
	 * Init hooks.
	 *
	 * @since 0.1.0
	 */
	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'rest_api_init_handler' ) );
	}

	/**
	 * Hook handler.
	 *
	 * @since 0.1.0
	 */
	public static function rest_api_init_handler() {
		/**
		 * Routes list container.
		 *
		 * @var RouteCollection
		 */
		global $hrt_routes;

		Router::set_namespace( 'hrt/v1' );
		Router::set_routes_container( $hrt_routes );

		include_once __DIR__ . '/Routes.php';

		$hrt_routes->register_all_routes();
	}
}
