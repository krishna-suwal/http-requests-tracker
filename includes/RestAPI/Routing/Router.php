<?php

namespace HRT\RestAPI\Routing;

use ArrayObject;
use Closure;
use Illuminate\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Routing\BindingRegistrar;
use Illuminate\Contracts\Routing\Registrar as RegistrarContract;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Jsonable;
use Illuminate\Contracts\Support\Responsable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Events\RouteMatched;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;
use Illuminate\Support\Traits\Macroable;
use JsonSerializable;
use Psr\Http\Message\ResponseInterface as PsrResponseInterface;
use ReflectionClass;
use Symfony\Bridge\PsrHttpMessage\Factory\HttpFoundationFactory;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class Router {
	/**
	 * The route collection instance.
	 *
	 * @var RouteCollection
	 */
	protected static $routes;

	/**
	 * The currently dispatched route instance.
	 *
	 * @var \Illuminate\Routing\Route|null
	 */
	protected $current;

	/**
	 * The request currently being dispatched.
	 *
	 * @var \Illuminate\Http\Request
	 */
	protected $currentRequest;

	/**
	 * All of the short-hand keys for middlewares.
	 *
	 * @var array
	 */
	protected $middleware = array();

	/**
	 * All of the middleware groups.
	 *
	 * @var array
	 */
	protected $middlewareGroups = array();

	/**
	 * The priority-sorted list of middleware.
	 *
	 * Forces the listed middleware to always be in the given order.
	 *
	 * @var array
	 */
	public $middlewarePriority = array();

	/**
	 * The registered route value binders.
	 *
	 * @var array
	 */
	protected $binders = array();

	/**
	 * The globally available parameter patterns.
	 *
	 * @var array
	 */
	protected $patterns = array();

	/**
	 * The route group attribute stack.
	 *
	 * @var array
	 */
	protected $groupStack = array();

	/**
	 * All of the verbs supported by the router.
	 *
	 * @var string[]
	 */
	public static $verbs = array( 'GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS' );

	/**
	 * Create a new Router instance.
	 */
	public function __construct() {
		$this->routes = new RouteCollection();
	}

	/**
	 * Register a new GET route with the router.
	 *
	 * @param  string  $uri
	 * @param  array|string|callable|null  $action
	 * @return \Illuminate\Routing\Route
	 */
	public function get( $uri, $action = null ) {
		return $this->addRoute( array( 'GET', 'HEAD' ), $uri, $action );
	}

	/**
	 * Register a new POST route with the router.
	 *
	 * @param  string  $uri
	 * @param  array|string|callable|null  $action
	 * @return \Illuminate\Routing\Route
	 */
	public function post( $uri, $action = null ) {
		return $this->addRoute( 'POST', $uri, $action );
	}

	/**
	 * Register a new PUT route with the router.
	 *
	 * @param  string  $uri
	 * @param  array|string|callable|null  $action
	 * @return \Illuminate\Routing\Route
	 */
	public function put( $uri, $action = null ) {
		return $this->addRoute( 'PUT', $uri, $action );
	}

	/**
	 * Register a new PATCH route with the router.
	 *
	 * @param  string  $uri
	 * @param  array|string|callable|null  $action
	 * @return \Illuminate\Routing\Route
	 */
	public function patch( $uri, $action = null ) {
		return $this->addRoute( 'PATCH', $uri, $action );
	}

	/**
	 * Register a new DELETE route with the router.
	 *
	 * @param  string  $uri
	 * @param  array|string|callable|null  $action
	 * @return \Illuminate\Routing\Route
	 */
	public function delete( $uri, $action = null ) {
		return $this->addRoute( 'DELETE', $uri, $action );
	}

	/**
	 * Register a new OPTIONS route with the router.
	 *
	 * @param  string  $uri
	 * @param  array|string|callable|null  $action
	 * @return \Illuminate\Routing\Route
	 */
	public function options( $uri, $action = null ) {
		return $this->addRoute( 'OPTIONS', $uri, $action );
	}

	/**
	 * Register a new route responding to all verbs.
	 *
	 * @param  string  $uri
	 * @param  array|string|callable|null  $action
	 * @return \Illuminate\Routing\Route
	 */
	public function any( $uri, $action = null ) {
		return $this->addRoute( self::$verbs, $uri, $action );
	}

	/**
	 * Register a new route with the given verbs.
	 *
	 * @param  array|string  $methods
	 * @param  string  $uri
	 * @param  array|string|callable|null  $action
	 * @return \Illuminate\Routing\Route
	 */
	public function match( $methods, $uri, $action = null ) {
		return $this->addRoute( array_map( 'strtoupper', (array) $methods ), $uri, $action );
	}

	/**
	 * Add a route to the underlying route collection.
	 *
	 * @param  array|string  $methods
	 * @param  string  $uri
	 * @param  array|string|callable|null  $action
	 * @return \Illuminate\Routing\Route
	 */
	public function addRoute( $methods, $uri, $action ) {
		return $this->routes->add( $this->createRoute( $methods, $uri, $action ) );
	}

	/**
	 * Create a new route instance.
	 *
	 * @param  array|string  $methods
	 * @param  string  $uri
	 * @param  mixed  $action
	 * @return \Illuminate\Routing\Route
	 */
	protected function createRoute( $methods, $uri, $action ) {
		// If the route is routing to a controller we will parse the route action into
		// an acceptable array format before registering it and creating this route
		// instance itself. We need to build the Closure that will call this out.
		if ( $this->actionReferencesController( $action ) ) {
			$action = $this->convertToControllerAction( $action );
		}

		$route = $this->newRoute(
			$methods,
			$this->prefix( $uri ),
			$action
		);

		// If we have groups that need to be merged, we will merge them now after this
		// route has already been created and is ready to go. After we're done with
		// the merge we will be ready to return the route back out to the caller.
		if ( $this->hasGroupStack() ) {
			$this->mergeGroupAttributesIntoRoute( $route );
		}

		$this->addWhereClausesToRoute( $route );

		return $route;
	}

	/**
	 * Create a new Route object.
	 *
	 * @param  array|string  $methods
	 * @param  string  $uri
	 * @param  mixed  $action
	 * @return \Illuminate\Routing\Route
	 */
	public function newRoute( $methods, $uri, $action ) {
		return ( new Route( $methods, $uri, $action ) )
					->setRouter( $this )
					->setContainer( $this->container );
	}

	/**
	 * Dispatch the request to the application.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function dispatch( Request $request ) {
		$this->currentRequest = $request;

		return $this->dispatchToRoute( $request );
	}

	/**
	 * Dispatch the request to a route and return the response.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function dispatchToRoute( Request $request ) {
		return $this->runRoute( $request, $this->findRoute( $request ) );
	}

	/**
	 * Find the route matching a given request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Routing\Route
	 */
	protected function findRoute( $request ) {
		$this->current = $route = $this->routes->match( $request );

		$route->setContainer( $this->container );

		$this->container->instance( Route::class, $route );

		return $route;
	}

	/**
	 * Return the response for the given route.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Illuminate\Routing\Route  $route
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	protected function runRoute( Request $request, Route $route ) {
		$request->setRouteResolver(
			function () use ( $route ) {
				return $route;
			}
		);

		$this->events->dispatch( new RouteMatched( $route, $request ) );

		return $this->prepareResponse(
			$request,
			$this->runRouteWithinStack( $route, $request )
		);
	}

	/**
	 * Run the given route within a Stack "onion" instance.
	 *
	 * @param  \Illuminate\Routing\Route  $route
	 * @param  \Illuminate\Http\Request  $request
	 * @return mixed
	 */
	protected function runRouteWithinStack( Route $route, Request $request ) {
		$shouldSkipMiddleware = $this->container->bound( 'middleware.disable' ) &&
								$this->container->make( 'middleware.disable' ) === true;

		$middleware = $shouldSkipMiddleware ? array() : $this->gatherRouteMiddleware( $route );

		return ( new Pipeline( $this->container ) )
						->send( $request )
						->through( $middleware )
						->then(
							function ( $request ) use ( $route ) {
								return $this->prepareResponse(
									$request,
									$route->run()
								);
							}
						);
	}

	/**
	 * Create a response instance from the given value.
	 *
	 * @param  \Symfony\Component\HttpFoundation\Request  $request
	 * @param  mixed  $response
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function prepareResponse( $request, $response ) {
		return static::toResponse( $request, $response );
	}

	/**
	 * Static version of prepareResponse.
	 *
	 * @param  \Symfony\Component\HttpFoundation\Request  $request
	 * @param  mixed  $response
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public static function toResponse( $request, $response ) {
		if ( $response instanceof Responsable ) {
			$response = $response->toResponse( $request );
		}

		if ( $response instanceof PsrResponseInterface ) {
			$response = ( new HttpFoundationFactory() )->createResponse( $response );
		} elseif ( $response instanceof Model && $response->wasRecentlyCreated ) {
			$response = new JsonResponse( $response, 201 );
		} elseif ( $response instanceof Stringable ) {
			$response = new Response( $response->__toString(), 200, array( 'Content-Type' => 'text/html' ) );
		} elseif ( ! $response instanceof SymfonyResponse &&
				   ( $response instanceof Arrayable ||
					$response instanceof Jsonable ||
					$response instanceof ArrayObject ||
					$response instanceof JsonSerializable ||
					$response instanceof \stdClass ||
					is_array( $response ) ) ) {
			$response = new JsonResponse( $response );
		} elseif ( ! $response instanceof SymfonyResponse ) {
			$response = new Response( $response, 200, array( 'Content-Type' => 'text/html' ) );
		}

		if ( $response->getStatusCode() === Response::HTTP_NOT_MODIFIED ) {
			$response->setNotModified();
		}

		return $response->prepare( $request );
	}

	/**
	 * Get all of the defined middleware short-hand names.
	 *
	 * @return array
	 */
	public function getMiddleware() {
		return $this->middleware;
	}

	/**
	 * Get the request currently being dispatched.
	 *
	 * @return \Illuminate\Http\Request
	 */
	public function getCurrentRequest() {
		return $this->currentRequest;
	}

	/**
	 * Get the currently dispatched route instance.
	 *
	 * @return \Illuminate\Routing\Route|null
	 */
	public function getCurrentRoute() {
		return $this->current();
	}

	/**
	 * Get the currently dispatched route instance.
	 *
	 * @return \Illuminate\Routing\Route|null
	 */
	public function current() {
		return $this->current;
	}

	/**
	 * Check if a route with the given name exists.
	 *
	 * @param  string  $name
	 * @return bool
	 */
	public function has( $name ) {
		$names = is_array( $name ) ? $name : func_get_args();

		foreach ( $names as $value ) {
			if ( ! $this->routes->hasNamedRoute( $value ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Get the current route name.
	 *
	 * @return string|null
	 */
	public function currentRouteName() {
		return $this->current() ? $this->current()->getName() : null;
	}

	/**
	 * Alias for the "currentRouteNamed" method.
	 *
	 * @param  mixed  ...$patterns
	 * @return bool
	 */
	public function is( ...$patterns ) {
		return $this->currentRouteNamed( ...$patterns );
	}

	/**
	 * Determine if the current route matches a pattern.
	 *
	 * @param  mixed  ...$patterns
	 * @return bool
	 */
	public function currentRouteNamed( ...$patterns ) {
		return $this->current() && $this->current()->named( ...$patterns );
	}

	/**
	 * Get the current route action.
	 *
	 * @return string|null
	 */
	public function currentRouteAction() {
		if ( $this->current() ) {
			return $this->current()->getAction()['controller'] ?? null;
		}
	}

	/**
	 * Alias for the "currentRouteUses" method.
	 *
	 * @param  array  ...$patterns
	 * @return bool
	 */
	public function uses( ...$patterns ) {
		foreach ( $patterns as $pattern ) {
			if ( Str::is( $pattern, $this->currentRouteAction() ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Get the underlying route collection.
	 *
	 * @return \Illuminate\Routing\RouteCollectionInterface
	 */
	public function getRoutes() {
		return $this->routes;
	}

	/**
	 * Set the route collection instance.
	 *
	 * @param  \Illuminate\Routing\RouteCollection  $routes
	 * @return void
	 */
	public function setRoutes( RouteCollection $routes ) {
		foreach ( $routes as $route ) {
			$route->setRouter( $this )->setContainer( $this->container );
		}

		$this->routes = $routes;

		$this->container->instance( 'routes', $this->routes );
	}

	/**
	 * Dynamically handle static method calls into the router instance.
	 *
	 * @param  string  $method
	 * @param  array  $parameters
	 *
	 * @return Router
	 */
	public static function __callStatic( $method, $parameters ) {
		return ( new self() )->$method( ...$parameters );
	}
}
