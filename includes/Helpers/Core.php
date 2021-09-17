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
 * @return boolean
 */
function hrt_is_log_current_request() {
	return hrt_is_log_request( hrt_get_current_request_url() );
}

/**
 * Check if the current request URL should be logged.
 *
 * @since 0.1.0
 *
 * @param string $url
 *
 * @return boolean
 */
function hrt_is_log_request( $url ) {
	$url_scheme_list = hrt( 'setting' )->get( 'url_schemes.list' );

	foreach ( $url_scheme_list as $url_scheme ) {
		if ( isset( $url_scheme['enable'] ) && true !== $url_scheme['enable'] ) {
			continue;
		}
		if ( hrt_match_url_scheme( $url, $url_scheme ) ) {
			return array(
				'is_log' => true,
				'scheme' => $url_scheme,
				'url'    => $url,
			);
		}
	}

	return array(
		'is_log' => false,
		'scheme' => null,
		'url'    => null,
	);
}
