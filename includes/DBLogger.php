<?php
/**
 * DBLogger class.
 *
 * @since 0.1.0
 */

namespace HRT;

class DBLogger {

	/**
	 * Initialization.
	 *
	 * @since 0.1.0
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'run' ) );
	}

	/**
	 * Run logger.
	 *
	 * @since 0.1.0
	 */
	public static function run() {
		$result = (array) apply_filters( 'hrt_is_log_current_request', hrt_is_log_current_request() );

		if ( isset( $result['is_log'] ) && true !== $result['is_log'] ) {
			return;
		}

		global $wpdb;

		$table_name = $wpdb->prefix . 'hrt_logs';
		$log_data   = self::prepare_log_data( (array) $result['scheme'], (string) $result['url'] );

		$wpdb->insert( $table_name, apply_filters( 'hrt_new_request_log_data', $log_data, $result ) );
	}

	/**
	 * Prepare log data.
	 *
	 * @since 0.1.0
	 *
	 * @param array $scheme
	 * @param string $url
	 *
	 * @return array
	 */
	protected static function prepare_log_data( $scheme, $url = '' ) {
		$title      = sprintf( 'Matched for %s', $scheme['title'] );
		$user_id    = get_current_user_id();
		$created_at = current_time( 'mysql', true );
		$type       = $scheme['type'];
		$data       = json_encode(
			array(
				'scheme' => $scheme,
				'url'    => $url,
			)
		);

		if ( 'regex' === $scheme['type'] ) {
			$description = sprintf( __( 'Matched with regex "%1$s" > %2$s', 'hrt' ), $scheme['regex'], $url );
		}
		if ( 'absolute' === $scheme['type'] ) {
			$description = sprintf( __( 'Matched with absolute URL "%s"', 'hrt' ), $scheme['url'] );
		}
		if ( 'relative' === $scheme['type'] ) {
			$description = sprintf( __( 'Matched with relative URL "%1$s" > %2$s', 'hrt' ), $scheme['url'], $url );
		}

		if ( 'predefined' === $scheme['type'] ) {
			$type = $scheme['type'] . '.' . $scheme['predefined_type'];

			if ( 'ajax' === $scheme['predefined_type'] ) {
				$description = sprintf( __( 'Ajax request log', 'hrt' ), $url );
			}
			if ( 'search_query' === $scheme['predefined_type'] ) {
				$description = sprintf( __( 'Search query request log > %s', 'hrt' ), $url );
			}
			if ( 'front_page_query' === $scheme['predefined_type'] ) {
				$description = sprintf( __( 'Front page request log > %s', 'hrt' ), $url );
			}
			if ( 'blog_homepage_query' === $scheme['predefined_type'] ) {
				$description = sprintf( __( 'Blog homepage request log > %s', 'hrt' ), $url );
			}
			if ( 'feed_query' === $scheme['predefined_type'] ) {
				$description = sprintf( __( 'Feed query request log > %s', 'hrt' ), $url );
			}
			if ( 'heartbeat' === $scheme['predefined_type'] ) {
				$description = sprintf( __( 'Heartbeat request log > %s', 'hrt' ), $url );
			}
		}

		return compact( 'title', 'description', 'type', 'user_id', 'created_at', 'data' );
	}
}
