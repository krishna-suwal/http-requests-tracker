<?php
/**
 * Core helper functions.
 *
 * @since 0.1.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Check if the current request URL should be logged.
 *
 * @since 0.1.0
 *
 * @param array $url_scheme_list
 *
 * @return boolean
 */
function hrt_is_log_current_url( $url_scheme_list ) {
	$url = apply_filters( 'hrt_current_url', "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]" );

	return hrt_is_log_url( $url, $url_scheme_list );
}

/**
 * Check if the current request URL should be logged.
 *
 * @since 0.1.0
 *
 * @param string $url
 * @param array $url_scheme_list
 *
 * @return boolean
 */
function hrt_is_log_url( $url, $url_scheme_list ) {
	foreach ( $url_scheme_list as $url_scheme ) {
		if ( hrt_match_url_scheme( $url, $url_scheme ) ) {
			return true;
		}
	}
	return false;
}
