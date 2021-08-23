<?php
/**
 * Route class.
 *
 * @package HRT\RestAPI\Routing
 *
 * @since 0.1.0
 */

namespace HRT\RestAPI\Routing;

use HRT\Permissions\Permissions;

defined( 'ABSPATH' ) || exit;

class Route {
	/**
	 * The route namespace without any trailing or leading slash.
	 *
	 * @since 0.1.0
	 *
	 * @var string
	 */
	protected $namespace;

	/**
	 * The route without any trailing or leading slash.
	 *
	 * @since 0.1.0
	 *
	 * @var string
	 */
	protected $route;

	/**
	 * The HTTP methods the route responds to (separated by comman).
	 *
	 * @since 0.1.0
	 *
	 * @var string
	 */
	protected $methods;

	/**
	 * The route handler.
	 *
	 * @since 0.1.0
	 *
	 * @var callable
	 */
	protected $action;

	/**
	 * Permission handlers for the route.
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	protected $permissions = array();

	/**
	 * Middlewares for the route.
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	protected $middlewares = array();

	/**
	 * Param definitions for the route.
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	protected $param_definitions = array();

	/**
	 * Schema for response data of the route.
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	protected $response_schema = array();

	/**
	 * Whether to override the route or not, if already registered.
	 *
	 * @since 0.1.0
	 *
	 * @var boolean
	 */
	protected $override = false;

	/**
	 * Create a new Route instance.
	 *
	 * @param string $methods Verbs separated with comman.
	 * @param string $route
	 * @param \Closure|array $action
	 */
	public function __construct( $methods, $route, $action ) {
		$this->set_methods( $methods );
		$this->set_route( $route );
		$this->set_action( $action );
	}

	/**
	 * Register the route.
	 *
	 * @since 0.1.0
	 */
	public function register() {
		\register_rest_route(
			$this->get_namespace(),
			'/' . $this->get_route(),
			array(
				'methods'             => $this->get_methods(),
				'callback'            => array( $this, 'run' ),
				'permission_callback' => array( $this, 'permissions_check' ),
				'args'                => rest_get_endpoint_args_for_schema(
					array(
						'$schema'    => 'http://json-schema.org/draft-04/schema#',
						'type'       => 'object',
						'properties' => $this->get_param_definitions(),
					),
					\WP_REST_Server::CREATABLE
				),
				'schema'              => array( $this, 'get_response_schema' ),
			)
		);
	}

	/**
	 * Run the route action and return the response.
	 *
	 * @since 0.1.0
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return mixed
	 */
	public function run( $request ) {
		foreach ( $this->get_middlewares() as $callback ) {
			try {
				$result = $callback( $request, $this );

				if ( ! is_null( $result ) ) {
					return $result;
				}
			} catch ( \Throwable $error ) {
				return $error;
			}
		}
		$action = $this->get_action();

		if ( ! is_callable( $action ) ) {
			return null;
		}

		$response = rest_ensure_response( call_user_func( $action, $request, $this ) );

		return apply_filters( 'hrt_api_response', $response, $request, $this );
	}

	/**
	 * Check route permissions.
	 *
	 * @since 0.1.0
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return mixed
	 */
	public function permissions_check( $request ) {
		$prepare_args = function( $args ) use ( $request ) {
			return array_map(
				function( $arg ) use ( $request ) {
					if ( '<request>' === $arg ) {
						return $request;
					}
					return $arg;
				},
				$args
			);
		};
		$permissions  = $this->get_permissions();

		foreach ( $permissions as $permission ) {
			$is_authorized = true;

			try {
				$args = $prepare_args( $permission['args'] );

				if ( 'predefined' === $permission['type'] ) {
					Permissions::check( $permission['name'], ...$args );
				}
				if ( 'callback' === $permission['type'] ) {
					$is_authorized = $permission['callback']( ...$args );
				}
				if ( false === $is_authorized ) {
					return new \WP_Error(
						'hrt_rest_permission_denied',
						__( 'Permission denied!.', 'hrt' )
					);
				}
			} catch ( \Throwable $e ) {
				return new \WP_Error(
					'hrt_rest_permission_denied',
					$e->getMessage(),
					array(
						'status' => rest_authorization_required_code(),
					)
				);
			}
		}
		return true;
	}

	/**
	 * Define route parameters.
	 *
	 * @since 0.1.0
	 *
	 * @param array $definitions
	 *
	 * @return $this
	 */
	public function define_params( $definitions ) {
		$this->param_definitions = (array) $definitions;
		return $this;
	}

	/**
	 * Get the route param definitions.
	 *
	 * @since 0.1.0
	 *
	 * @return array
	 */
	public function get_param_definitions() {
		return $this->param_definitions;
	}

	/**
	 * Get the route response data schema.
	 *
	 * @since 0.1.0
	 *
	 * @return array
	 */
	public function get_response_schema() {
		return $this->response_schema;
	}

	/**
	 * Set the route repsonse data schema.
	 *
	 * @since 0.1.0
	 *
	 * @param array $response_schema
	 *
	 * @return $this
	 */
	public function set_response_schema( $response_schema ) {
		$this->response_schema = $response_schema;
		return $this;
	}

	/**
	 * Get the HTTP verbs the route responds to.
	 *
	 * @since 0.1.0
	 *
	 * @return string
	 */
	public function get_methods() {
		return $this->methods;
	}

	/**
	 * Set the HTTP verbs the route responds to.
	 *
	 * @since 0.1.0
	 *
	 * @return string
	 */
	public function set_methods( $methods ) {
		$this->methods = $methods;
		return $this;
	}

	/**
	 * Whether the route should be overridden or not if already registered.
	 *
	 * @since 0.1.0
	 *
	 * @return boolean
	 */
	public function get_override() {
		return $this->override;
	}

	/**
	 * Set whether the route should be overridden or not if already registered.
	 *
	 * @since 0.1.0
	 *
	 * @return boolean
	 */
	public function set_override( $override ) {
		$this->override = $override;
		return $this;
	}

	/**
	 * Get permission handlers for the route.
	 *
	 * @since 0.1.0
	 *
	 * @return array
	 */
	public function get_permissions() {
		return $this->permissions;
	}

	/**
	 * Set permission handlers for the route.
	 *
	 * @since 0.1.0
	 *
	 * @param array $permissions
	 *
	 * @return $this
	 */
	public function set_permissions( $permissions ) {
		$this->permissions = $permissions;
		return $this;
	}

	/**
	 * Add a permission handler for the route.
	 *
	 * @since 0.1.0
	 *
	 * @param string|array|callable $name
	 *
	 * @return $this
	 */
	public function permission( $name, ...$args ) {
		if ( is_string( $name ) ) {
			$this->permissions[] = array(
				'type' => 'predefined',
				'name' => $name,
				'args' => $args,
			);
		} elseif ( is_callable( $name ) ) {
			$this->permissions[] = array(
				'type'     => 'callback',
				'callback' => $name,
				'args'     => $args,
			);
		}
		return $this;
	}

	/**
	 * Get namespace for the route.
	 *
	 * @since 0.1.0
	 *
	 * @return string
	 */
	public function get_namespace() {
		return $this->namespace;
	}

	/**
	 * Set namespace for the route.
	 *
	 * @since 0.1.0
	 *
	 * @param strign $namespace
	 *
	 * @return $this
	 */
	public function set_namespace( $namespace ) {
		$this->namespace = $namespace;
		return $this;
	}

	/**
	 * Get the route uri associated with the route.
	 *
	 * @since 0.1.0
	 *
	 * @return string
	 */
	public function get_route() {
		return $this->route;
	}

	/**
	 * Set the route uri that the route responds to.
	 *
	 * @since 0.1.0
	 *
	 * @param string $uri
	 *
	 * @return $this
	 */
	public function set_route( $uri ) {
		$this->route = $uri;
		return $this;
	}

	/**
	 * Get the route handler.
	 *
	 * @since 0.1.0
	 *
	 * @return callable
	 */
	public function get_action() {
		return $this->action;
	}

	/**
	 * Set the route handler.
	 *
	 * @since 0.1.0
	 *
	 * @param callable $action
	 *
	 * @return $this
	 */
	public function set_action( $action ) {
		$this->action = $action;
		return $this;
	}

	/**
	 * Add middleware to the route.
	 *
	 * @since 0.1.0
	 *
	 * @param string $name
	 * @param callable $callback
	 *
	 * @return $this
	 */
	public function middleware( $name, $callback ) {
		if ( empty( $name ) ) {
			// TODO Log error.
			return $this;
		}
		if ( ! is_callable( $callback ) ) {
			// TODO Log error.
			return $this;
		}
		$this->middlewares[ $name ] = $callback;

		return $this;
	}

	/**
	 * Get middlewares for the route.
	 *
	 * @since 0.1.0
	 *
	 * @return array
	 */
	public function get_middlewares() {
		return $this->middlewares;
	}
}
