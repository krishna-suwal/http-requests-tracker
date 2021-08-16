<?php
/**
 * Core helper functions.
 *
 * @since 0.1.0
 */

function hrt_get_current_request_url() {
	$protocol = isset( $_SERVER['HTTPS'] ) && 'on' === $_SERVER['HTTPS'] ? 'https' : 'http';
	$url      = "$protocol://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

	return apply_filters( 'hrt_current_request_url', $url );
}

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
	return hrt_is_log_url( hrt_get_current_request_url(), $url_scheme_list );
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
