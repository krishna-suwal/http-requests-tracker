<?php
/**
 * Define logs api routes.
 *
 * @package HRT\RestAPI\Routes
 *
 * @since 0.1.0
 */

use HRT\Facades\Route;

/**
 * Get logs.
 *
 * @since 0.1.0
 */
Route::get(
	'logs',
	function( $request ) {
		$db = \WeDevs\ORM\Eloquent\Database::instance();

		/**
		 * Prepare users data.
		 */
		$user_ids   = $db->table( 'hrt_logs' )->select( 'user_id' )->distinct()->get()->toArray();
		$user_ids   = wp_list_pluck( $user_ids, 'user_id' );
		$users      = get_users(
			array(
				'include' => $user_ids,
			)
		);
		$users_data = array_map(
			function( $user ) {
				return array(
					'id'           => $user->ID,
					'display_name' => $user->display_name,
					'avatar_url'   => get_avatar_url( $user->ID ),
				);
			},
			$users
		);

		/**
		 * Prepare logs data.
		 */
		$per_page     = 10;
		$current_page = 1;
		$user_id      = 0;

		if ( ! empty( $request['per_page'] ) ) {
			$per_page = absint( $request['per_page'] );
		}
		if ( ! empty( $request['page'] ) ) {
			$current_page = absint( $request['page'] );
		}
		if ( ! empty( $request['user_id'] ) ) {
			$user_id = absint( $request['user_id'] );
		}

		$hrt_logs = $db->table( 'hrt_logs' )->orderBy( 'created_at', 'desc' );

		if ( $user_id > 0 ) {
			$hrt_logs->where( 'user_id', '=', $user_id );
		}
		if ( ! empty( $request['type'] ) ) {
			$hrt_logs->where( 'type', '=', esc_sql( sanitize_text_field( $request['type'] ) ) );
		}
		$pagination = $hrt_logs->paginate( $per_page, array( '*' ), 'page', $current_page );
		$logs       = array_map(
			function( $item ) {
				$user      = get_user_by( 'id', $item->user_id );
				$user_data = array(
					'id'           => 0,
					'display_name' => __( 'Guest User', 'hrt' ),
					'avatar_url'   => '',
				);

				if ( $user && ! is_wp_error( $user ) ) {
					$user_data = array(
						'id'           => $user->ID,
						'display_name' => $user->display_name,
						'avatar_url'   => get_avatar_url( $user->ID ),
					);
				}

				return array(
					'id'          => $item->id,
					'title'       => $item->title,
					'description' => $item->description,
					'type'        => $item->type,
					'created_at'  => $item->created_at,
					'data'        => $item->data,
					'user'        => $user_data,
				);
			},
			$pagination->items()
		);

		return apply_filters(
			'hrt_logs',
			array(
				'data'  => $logs,
				'meta'  => array(
					'total'        => $pagination->total(),
					'pages'        => ceil( $pagination->total() / $pagination->perPage() ),
					'current_page' => $pagination->currentPage(),
					'per_page'     => $pagination->perPage(),
				),
				'extra' => array(
					'users' => $users_data,
				),
			),
			$request
		);
	}
)
->permission( 'api.logs.read', '<request>' );

/**
 * Delete logs.
 *
 * @since 0.1.0
 */
Route::deletable(
	'logs/(?P<id>[\d]+)',
	function( $request ) {
		global $wpdb;
		$db = \WeDevs\ORM\Eloquent\Database::instance();
		$id = absint( $request['id'] );

		$object = $db->table( 'hrt_logs' )->where( 'id', '=', $id )->first( array( '*' ) );

		if ( is_null( $object ) ) {
			return new \WP_Error(
				'hrt_rest_not_found',
				__( 'Sorry, the spcefied log does not exist.', 'hrt' ),
				array(
					'status' => 404,
				)
			);
		}

		$result = $wpdb->delete(
			$wpdb->prefix . 'hrt_logs',
			array(
				'ID' => $id,
			),
			array(
				'%d',
			)
		);

		if ( ! $result ) {
			return new \WP_Error(
				'hrt_rest_cannot_delete',
				__( 'Sorry, the spcefied log could not be deleted.', 'hrt' )
			);
		}

		return $object;
	}
)
->permission( 'api.logs.delete', '<request>' )
->define_params(
	array(
		'id' => array(
			'type'     => array( 'integer', 'string' ),
			'required' => true,
		),
	)
);
