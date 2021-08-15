<?php
/**
 * UrlSchemes service provider.
 */

namespace HRT\Providers;

defined( 'ABSPATH' ) || exit;

use HRT\UrlSchemes\AbsoluteUrlScheme;
use HRT\UrlSchemes\OnlyUrlArgsUrlScheme;
use HRT\UrlSchemes\PredefinedUrlScheme;
use HRT\UrlSchemes\RegexUrlScheme;
use HRT\UrlSchemes\RelativeUrlScheme;
use League\Container\ServiceProvider\AbstractServiceProvider;

class UrlSchemesServiceProvider extends AbstractServiceProvider {

	/**
	 * The provided array is a way to let the container
	 * know that a service is provided by this service
	 * provider. Every service that is registered via
	 * this service provider must have an alias added
	 * to this array or it will be ignored
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	protected $provides = array(
		'url-scheme.absolute',
		'url-scheme.relative',
		'url-scheme.regex',
		'url-scheme.predefined',
		'url-scheme.only_url_args',
		'\HRT\UrlSchemes\AbsoluteUrlScheme',
		'\HRT\UrlSchemes\RelativeUrlScheme',
		'\HRT\UrlSchemes\RegexUrlScheme',
		'\HRT\UrlSchemes\PredefinedUrlScheme',
		'\HRT\UrlSchemes\OnlyUrlArgsUrlScheme',
	);

	/**
	 * This is where the magic happens, within the method you can
	 * access the container and register or retrieve anything
	 * that you need to, but remember, every alias registered
	 * within this method must be declared in the `$provides` array.
	 *
	 * @since 0.1.0
	 */
	public function register() {
		$this->getContainer()->add( 'url-scheme.absolute', AbsoluteUrlScheme::class );
		$this->getContainer()->add( 'url-scheme.relative', RelativeUrlScheme::class );
		$this->getContainer()->add( 'url-scheme.regex', RegexUrlScheme::class );
		$this->getContainer()->add( 'url-scheme.predefined', PredefinedUrlScheme::class );
		$this->getContainer()->add( 'url-scheme.only_url_args', OnlyUrlArgsUrlScheme::class );
	}
}
