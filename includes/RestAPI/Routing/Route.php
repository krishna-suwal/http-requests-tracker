<?php
/**
 * Route class.
 *
 * @package HRT\RestAPI\Routing
 *
 * @since 0.1.0
 */

namespace HRT\RestAPI\Routing;

defined( 'ABSPATH' ) || exit;

use HRT\RestAPI\Request\Request;
use Illuminate\Routing\Matching\MethodValidator;

class Route {
	/**
	 * Route name.
	 *
	 * @var string
	 */
	protected $name;

	/**
	 * The URI pattern the route responds to.
	 *
	 * @var string
	 */
	protected $uri;

	/**
	 * The HTTP methods the route responds to.
	 *
	 * @var array
	 */
	protected $methods = array();

	/**
	 * The route action array.
	 *
	 * @var \Closure|array
	 */
	protected $action;

	/**
	 * The regular expression requirements.
	 *
	 * @var array
	 */
	protected $wheres = array();

	protected $middlewares = array();

	protected $params_definitions = array();

	/**
	 * The array of matched parameters on the given route.
	 *
	 * @var array
	 */
	protected $route_parameters = array();

	protected $get_parameters = array();

	protected $post_parameters = array();

	protected $http_only = false;

	protected $https_only = false;

	/**
	 * Create a new Route instance.
	 *
	 * @param  array|string  $methods
	 * @param  string  $uri
	 * @param  \Closure|array  $action
	 * @return void
	 */
	public function __construct( $methods, $uri, $action ) {
		$this->uri     = $uri;
		$this->methods = (array) $methods;
		$this->action  = $action;

		if ( in_array( 'GET', $this->methods ) && ! in_array( 'HEAD', $this->methods ) ) {
			$this->methods[] = 'HEAD';
		}
	}

	/**
	 * Run the route action and return the response.
	 *
	 * @return mixed
	 */
	public function run( ...$args ) {
		return call_user_func( $this->action, ...$args );
	}

	/**
	 * Determine if the route matches a given request.
	 *
	 * @param Request $request
	 *
	 * @return bool
	 */
	public function is_matches( $request ) {
		$pattern = $this->get_uri();
		// List of regex special characters: https://www.regular-expressions.info/characters.html
		$pattern = preg_replace( '/([\/\^\$\.\|\?\*\+\(\)\[\]])/', '\\\\$1', $pattern );
		$pattern = preg_replace( '/\{[\w]+\}/', '[\w]+', $pattern );
		$matched = preg_match( '/^' . $pattern . '$/', $request->get_uri(), $matches );

		if ( false === $matched ) {
			return false;
		}

		foreach ( $this->get_wheres() as $where ) {
			if (
				'callback' === $where['type'] &&
				is_callable( $where['function'] ) &&
				false === $where['function']( $request )
			) {
				return false;
			}
			if (
				'match-param' === $where['type'] &&
				$request->has_param( $where['name'] ) &&
				false === preg_match( $where['pattern'], $request->get_param( $where['name'] ), $matches )
			) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Validate the request. Should be run after the route is matched.
	 *
	 * @param Request $request
	 *
	 * @return boolean
	 */
	public function validate_request( $request ) {
		$param_defs = $this->get_param_definitions();

		foreach ( $param_defs as $name => $param_def ) {
			if ( isset( $param_def['required'] ) && true === $param_def['required'] ) {
				if ( in_array( $param_def['method'], array( 'get', 'GET' ), true ) && ! $request->has_get_param( $name ) ) {
					return false;
				}
				if ( in_array( $param_def['method'], array( 'post', 'POST' ), true ) && ! $request->has_post_param( $name ) ) {
					return false;
				}
				if ( ! $request->has_param( $name ) ) {
					return false;
				}
			}
			if ( ! $request->has_param( $name ) ) {
				continue;
			}
			if ( isset( $param_def['type'] ) && 'string' === $param_def['type'] ) {
			}
			if ( isset( $param_def['type'] ) && 'object' === $param_def['type'] ) {
			}
			if ( isset( $param_def['type'] ) && 'array' === $param_def['type'] ) {
			}
		}

		return true;
	}

	public function consume_request( $request ) {
	}

	public function define_params( $definitions ) {
		$this->params_definitions = (array) $definitions;
	}

	public function get_param_definitions() {
		return $this->params_definitions;
	}

	/**
	 * Set a regular expression requirement on the route.
	 *
	 * @param  array|string  $name
	 * @param  callable  $expression
	 *
	 * @return $this
	 */
	public function where( $name, $pattern ) {
		if ( is_string( $name ) ) {
			if ( is_string( $pattern ) ) {
				$this->wheres[] = array(
					'type'    => 'match-param',
					'name'    => $name,
					'pattern' => $pattern,
				);
			}
		} elseif ( is_callable( $name ) ) {
			$this->wheres[] = array(
				'type'     => 'callback',
				'function' => $name,
			);
		}

		return $this;
	}

	public function get_wheres() {
		return $this->wheres;
	}

	/**
	 * Set a list of regular expression requirements on the route.
	 *
	 * @param  array  $wheres
	 * @return $this
	 */
	public function set_wheres( $wheres ) {
		foreach ( $wheres as $key => $value ) {
			$this->where( $key, $value );
		}

		return $this;
	}

	/**
	 * Get the HTTP verbs the route responds to.
	 *
	 * @return array
	 */
	public function get_methods() {
		return $this->methods;
	}

	/**
	 * Determine if the route only responds to HTTP requests.
	 *
	 * @return bool
	 */
	public function is_http_only() {
		return $this->http_only;
	}

	/**
	 * Determine if the route only responds to HTTPS requests.
	 *
	 * @return bool
	 */
	public function is_https_only() {
		return $this->https_only;
	}

	/**
	 * Determine if the route only responds to HTTPS requests.
	 *
	 * @return bool
	 */
	public function is_secure() {
		return $this->is_https_only();
	}

	/**
	 * Get the URI associated with the route.
	 *
	 * @return string
	 */
	public function get_uri() {
		return $this->uri;
	}

	/**
	 * Set the URI that the route responds to.
	 *
	 * @param  string  $uri
	 * @return $this
	 */
	public function set_uri( $uri ) {
		$this->uri = $this->parse_uri( $uri );
	}

	/**
	 * Parse the route URI and normalize / store any implicit binding fields.
	 *
	 * @param  string  $uri
	 * @return string
	 */
	protected function parse_uri( $uri ) {
		$this->bindingFields = array();

		return tap(
			RouteUri::parse( $uri ),
			function ( $uri ) {
				$this->bindingFields = $uri->bindingFields;
			}
		)->uri;
	}

	/**
	 * Add or change the route name.
	 *
	 * @param  string  $name
	 * @return $this
	 */
	public function set_name( $name ) {
		$this->name = $name;
	}

	public function get_name() {
		return $this->name;
	}

	/**
	 * Get the action array or one of its properties for the route.
	 *
	 * @return callable
	 */
	public function get_action() {
		return $this->action;
	}

	/**
	 * Set the action array for the route.
	 *
	 * @param  callable  $action
	 * @return $this
	 */
	public function set_action( array $action ) {
		$this->action = $action;
	}

	public function set_route_params( $params = array() ) {
		$this->url_parameters = $params;
	}

	public function set_get_params( $params = array() ) {
		$this->get_parameters = $params;
	}

	public function set_post_params( $params = array() ) {
		$this->post_parameters = $params;
	}

	public function get_route_params( $params = array() ) {
		return $this->url_parameters;
	}

	public function get_get_params( $params = array() ) {
		return $this->get_parameters;
	}

	public function get_post_params( $params = array() ) {
		return $this->post_parameters;
	}

	/**
	 * Get or set the middlewares attached to the route.
	 *
	 * @param  callable  $callback
	 *
	 * @return $this
	 */
	public function middleware( $name, $callback ) {
		if ( empty( $name ) ) {
			return $this;
		}
		$this->middlewares[ $name ] = $callback;

		return $this;
	}

	/**
	 * Dynamically access route parameters.
	 *
	 * @param  string  $key
	 * @return mixed
	 */
	public function __get( $key ) {
		return $this->parameter( $key );
	}
}
