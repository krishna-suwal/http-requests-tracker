<?php
/**
 * Define stats api routes.
 *
 * @package HRT\RestAPI\Routes
 *
 * @since 0.1.0
 */

use HRT\Facades\Route;

/**
 * Get stats.
 *
 * @since 0.1.0
 */
Route::get(
	'stats',
	function() {
		return 'Stats not implemented yet!';
	}
)
->permission( 'api.stats.read', '<request>' );
