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
		$db = \WeDevs\ORM\Eloquent\Database::instance();

		$logs             = $db->table( 'hrt_logs' )->select( array( 'user_id', 'type' ) )->get()->toArray();
		$users_dictionary = array();
		$types_dictionary = array();

		foreach ( $logs as $log ) {
			if ( ! isset( $users_dictionary[ $log->user_id ] ) ) {
				$user         = get_user_by( 'id', $log->user_id );
				$display_name = __( 'Guest User', 'hrt' );
				$avatar_url   = '';

				if ( $user && ! is_wp_error( $user ) ) {
					$display_name = $user->display_name;
					$avatar_url   = get_avatar_url( $user->ID );
				}

				$users_dictionary[ $log->user_id ] = array(
					'id'           => $log->user_id,
					'display_name' => $display_name,
					'avatar_url'   => $avatar_url,
					'count'        => 0,
				);
			}
			if ( ! isset( $types_dictionary[ $log->type ] ) ) {
				$types_dictionary[ $log->type ] = 0;
			}
			$users_dictionary[ $log->user_id ]['count'] += 1;
			$types_dictionary[ $log->type ]             += 1;
		}

		$types_dictionary = wp_parse_args(
			$types_dictionary,
			array(
				'regex'           => 0,
				'absolute'        => 0,
				'relative'        => 0,
				'predefined.ajax' => 0,
			)
		);

		return array(
			'basic' => array(
				'types' => $types_dictionary,
				'users' => array_values( $users_dictionary ),
			),
		);
	}
)
->permission( 'api.stats.read', '<request>' );
