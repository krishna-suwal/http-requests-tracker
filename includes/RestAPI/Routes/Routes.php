<?php
/**
 * Define routes.
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
		return hrt_get_url_schemes_raw();
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
		hrt_update_url_schemes( $request['schemes'] );

		return array(
			'schemes' => hrt_get_url_schemes_raw(),
		);
	}
)
->permission( 'api.settings.update', '<request>' )
->define_params(
	array(
		'schemes' => array(
			'description' => __( 'Test.', 'hrt' ),
			'type'        => 'array',
			'context'     => array( 'view', 'edit' ),
			'items'       => array(
				'type'       => 'object',
				'properties' => array(
					'type' => array(
						'description' => __( 'Tag ID.', 'hrt' ),
						'type'        => 'enum',
						'context'     => array( 'view', 'edit' ),
						'enum'        => hrt_get_url_scheme_type_slugs(),
						'required'    => true,
					),
				),
			),
		),
	)
);

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
