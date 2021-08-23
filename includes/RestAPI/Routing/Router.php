<?php
/**
 * Router class.
 *
 * @package HRT\RestAPI\Routing
 *
 * @since 0.1.0
 */

namespace HRT\RestAPI\Routing;

class Router {
	/**
	 * The route collection instance.
	 *
	 * @since 0.1.0
	 *
	 * @var RouteCollection
	 */
	protected static $routes_container;

	/**
	 * Namespace for the routes that will be added.
	 *
	 * @since 0.1.0
	 *
	 * @var string
	 */
	protected static $namespace = '';

	/**
	 * Add route with READABLE http verbs.
	 *
	 * @since 0.1.0
	 *
	 * @param string $uri
	 * @param callbale $action
	 *
	 * @return Route
	 */
	public function readable( $uri, $action ) {
		return $this->add_route( \WP_REST_Server::READABLE, $uri, $action );
	}

	/**
	 * Add route with CREATABLE http verbs.
	 *
	 * @since 0.1.0
	 *
	 * @param string $uri
	 * @param callbale $action
	 *
	 * @return Route
	 */
	public function creatable( $uri, $action ) {
		return $this->add_route( \WP_REST_Server::CREATABLE, $uri, $action );
	}

	/**
	 * Add route with EDITABLE http verbs.
	 *
	 * @since 0.1.0
	 *
	 * @param string $uri
	 * @param callbale $action
	 *
	 * @return Route
	 */
	public function editable( $uri, $action ) {
		return $this->add_route( \WP_REST_Server::EDITABLE, $uri, $action );
	}

	/**
	 * Add route with DELETABLE http verbs.
	 *
	 * @since 0.1.0
	 *
	 * @param string $uri
	 * @param callbale $action
	 *
	 * @return Route
	 */
	public function deletable( $uri, $action ) {
		return $this->add_route( \WP_REST_Server::DELETABLE, $uri, $action );
	}

	/**
	 * Add route with GET http verb.
	 *
	 * @since 0.1.0
	 *
	 * @param string $uri
	 * @param callbale $action
	 *
	 * @return Route
	 */
	public function get( $uri, $action ) {
		return $this->add_route( 'GET', $uri, $action );
	}

	/**
	 * Add route with POST http verb.
	 *
	 * @since 0.1.0
	 *
	 * @param string $uri
	 * @param callbale $action
	 *
	 * @return Route
	 */
	public function post( $uri, $action ) {
		return $this->add_route( 'POST', $uri, $action );
	}

	/**
	 * Add route with PUT http verb.
	 *
	 * @since 0.1.0
	 *
	 * @param string $uri
	 * @param callbale $action
	 *
	 * @return Route
	 */
	public function put( $uri, $action ) {
		return $this->add_route( 'PUT', $uri, $action );
	}

	/**
	 * Add route with PATCH http verb.
	 *
	 * @since 0.1.0
	 *
	 * @param string $uri
	 * @param callbale $action
	 *
	 * @return Route
	 */
	public function patch( $uri, $action ) {
		return $this->add_route( 'PATCH', $uri, $action );
	}

	/**
	 * Add route with DELETE http verb.
	 *
	 * @since 0.1.0
	 *
	 * @param string $uri
	 * @param callbale $action
	 *
	 * @return Route
	 */
	public function delete( $uri, $action ) {
		return $this->add_route( 'DELETE', $uri, $action );
	}

	/**
	 * Add route with all http verbs.
	 *
	 * @since 0.1.0
	 *
	 * @param string $uri
	 * @param callbale $action
	 *
	 * @return Route
	 */
	public function any( $uri, $action ) {
		return $this->add_route( \WP_REST_Server::ALLMETHODS, $uri, $action );
	}

	/**
	 * Add a route to the underlying route collection.
	 *
	 * @since 0.1.0
	 *
	 * @param string $methods
	 * @param string $uri
	 * @param callable $action
	 *
	 * @return Route
	 */
	public function add_route( $methods, $uri, $action ) {
		$route = $this->create_route( $methods, $uri, $action );

		self::$routes_container->add( $route );

		return $route;
	}

	/**
	 * Create a route instance.
	 *
	 * @since 0.1.0
	 *
	 * @param string $methods
	 * @param string $uri
	 * @param callable $action
	 *
	 * @return Route
	 */
	protected function create_route( $methods, $uri, $action ) {
		$route = new Route( $methods, $uri, $action );

		$route->set_namespace( self::get_namespace() );

		return $route;
	}

	/**
	 * Set routes container. The new routes will be added to the container.
	 *
	 * @since 0.1.0
	 *
	 * @param RouteCollection|null $container If null, a new instance of \HRT\RestAPI\Routing\RouteCollection will be created.
	 *
	 * @throws \Exception
	 */
	public static function set_routes_container( &$container = null ) {
		if ( is_null( $container ) ) {
			$container = new RouteCollection();
		}
		if ( ! $container instanceof RouteCollection ) {
			throw 'Given routes container instance is not of type ' . RouteCollection::class;
		}
		self::$routes_container = $container;
	}

	/**
	 * Get the routes container.
	 *
	 * @since 0.1.0
	 *
	 * @return RouteCollection|null
	 */
	public static function get_routes_container() {
		return self::$routes_container;
	}

	/**
	 * Set namespace for the new routes that will be added.
	 *
	 * @since 0.1.0
	 *
	 * @param string $namespace
	 */
	public static function set_namespace( $namespace ) {
		self::$namespace = $namespace;
	}

	/**
	 * Get the namespace for the new routes that will be added.
	 *
	 * @since 0.1.0
	 *
	 * @return string
	 */
	public static function get_namespace() {
		return self::$namespace;
	}

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
		return ( new self() )->$name( ...$arguments );
	}
}
