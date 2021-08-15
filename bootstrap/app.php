<?php
/**
 * Bootstrap the application.
 *
 * @since 0.1.0
 */

function hrt_boot_app() {
	global $hrt;

	if ( $hrt ) {
		return $hrt;
	}
	$hrt = new League\Container\Container();

	/**
	 * Enable the auto wiring.
	 */
	$hrt->delegate(
		new League\Container\ReflectionContainer()
	);

	$hrt_service_providers = include_once __DIR__ . '/providers.php';

	foreach ( $hrt_service_providers as $p ) {
		$hrt->addServiceProvider( $p );
	}

	return $hrt;
}

return hrt_boot_app();
