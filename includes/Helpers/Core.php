<?php

use HRT\Constants;

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
	$scheme_list = hrt( 'setting' )->get( 'schemes.list' );

	foreach ( $scheme_list as $scheme ) {
		if ( isset( $scheme['enable'] ) && true !== $scheme['enable'] ) {
			continue;
		}
		if ( hrt_match_scheme( $url, $scheme ) ) {
			return array(
				'is_log' => true,
				'scheme' => $scheme,
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

/**
 * Get a svg file contents.
 *
 * @since 0.1.0
 *
 * @param string  $name SVG filename.
 * @param boolean $echo Whether to echo the contents or not.
 *
 * @return void|string
 */
function hrt_get_svg( $name, $echo = false ) {
	global $wp_filesystem;

	$credentials = request_filesystem_credentials( '', 'direct' );

	// Bail early if the credentials is wrong.
	if ( ! $credentials ) {
		return;
	}

	\WP_Filesystem( $credentials );

	$file_name     = Constants::get( 'HRT_ASSETS' ) . "/svg/{$name}.svg";
	$file_contents = '';

	if ( file_exists( $file_name ) && is_readable( $file_name ) ) {
		$file_contents = $wp_filesystem->get_contents( $file_name );
	}

	$file_contents = apply_filters( 'hrt_svg_file', $file_contents, $name );

	$svg_args = array(
		'svg'   => array(
			'class'           => true,
			'aria-hidden'     => true,
			'aria-labelledby' => true,
			'role'            => true,
			'xmlns'           => true,
			'width'           => true,
			'height'          => true,
			'viewbox'         => true, // <= Must be lower case!
		),
		'g'     => array( 'fill' => true ),
		'title' => array( 'title' => true ),
		'path'  => array(
			'd'    => true,
			'fill' => true,
		),
	);

	if ( $echo ) {
		echo wp_kses( $file_contents, $svg_args );
	} else {
		return $file_contents;
	}
}
