<?php
/**
 * RouteCollection class. Stores list of routes.
 *
 * @package HRT\RestAPI\Routing
 *
 * @since 0.1.0
 */

namespace HRT\RestAPI\Routing;

defined( 'ABSPATH' ) || exit;

class RouteCollection {
	/**
	 * Route List.
	 *
	 * @since 0.1.0
	 *
	 * @var array[Route]
	 */
	protected $collection = array();

	/**
	 * Constructor.
	 *
	 * @since 0.1.0
	 *
	 * @param array[Route] $collection
	 */
	public function __construct( $collection = array() ) {
		$this->set_collection( $collection );
	}

	/**
	 * Add route.
	 *
	 * @since 0.1.0
	 *
	 * @param Route $route
	 */
	public function add( $route ) {
		if ( ! $route instanceof Route ) {
			throw 'Only instance of \HRT\RestAPI\Routing\Route can be added to \HRT\RestAPI\Routing\RouteCollection';
		}
		$this->collection[] = $route;
	}

	/**
	 * Set collection.
	 *
	 * @since 0.1.0
	 *
	 * @param array[Route] $collection
	 */
	public function set_collection( $collection ) {
		$this->collection = $collection;
	}

	/**
	 * Get the route collection.
	 *
	 * @since 0.1.0
	 *
	 * @return array[Route]
	 */
	public function get_collection() {
		return $this->collection;
	}

	/**
	 * Remove a route from the collection.
	 *
	 * @since 0.1.0
	 *
	 * @param integer|string $key
	 *
	 * @return boolean
	 */
	public function remove( $key ) {
		if ( ! isset( $this->collection[ $key ] ) ) {
			return false;
		}
		usset( $this->collection[ $key ] );
		return true;
	}

	/**
	 * Remove all the routes from the collection.
	 *
	 * @since 0.1.0
	 */
	public function clear() {
		$this->collection = array();
	}

	/**
	 * Register all the added routes.
	 *
	 * @since 0.1.0
	 */
	public function register_all_routes() {
		foreach ( $this->get_collection() as $route ) {
			$route->register();
		}
	}
}
