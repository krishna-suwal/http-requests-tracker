<?php
/**
 * Define settings api routes.
 *
 * @package HRT\RestAPI\Routes
 *
 * @since 0.1.0
 */

use HRT\Facades\Route;

/**
 * Get settings.
 *
 * @since 0.1.0
 */
Route::readable(
	'settings',
	function() {
		return hrt( 'setting' )->get_all();
	}
)
->permission( 'api.settings.read', '<request>' );

/**
 * Update settings.
 *
 * @since 0.1.0
 */
Route::editable(
	'settings',
	function( $request ) {
		$setting = hrt( 'setting' );

		$setting->set_props( (array) $request['data'] );
		$setting->save();
		$setting->read();

		return $setting->get_all();
	}
)
->permission( 'api.settings.update', '<request>' )
->define_params(
	array(
		'data' => array(
			'type'       => 'object',
			'context'    => array( 'view', 'edit' ),
			'required'   => true,
			'properties' => array(
				'stats.allow_stats_on_frontend' => array(
					'type'    => 'boolean',
					'context' => array( 'view', 'edit' ),
				),
				'schemes.list'                  => array(
					'type'    => 'array',
					'context' => array( 'view', 'edit' ),
				),
				'schemes.enable'                => array(
					'type'    => 'boolean',
					'context' => array( 'view', 'edit' ),
				),
				'developer.template_debug'      => array(
					'type'    => 'boolean',
					'context' => array( 'view', 'edit' ),
				),
				'developer.debug'               => array(
					'type'    => 'boolean',
					'context' => array( 'view', 'edit' ),
				),
			),
		),
	)
);
