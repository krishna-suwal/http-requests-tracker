<?php
/**
 * Helper functions related to Url scheme.
 *
 * @since 0.1.0
 */

use HRT\UrlSchemes\UrlScheme;

/**
 * Match a url with a URL scheme.
 *
 * @since 0.1.0
 *
 * @param string $url
 * @param array|UrlScheme $url_scheme_args
 *
 * @return boolean
 */
function hrt_match_url_scheme( $url, $url_scheme_args ) {
	try {
		$url_scheme = hrt_prepare_url_scheme( $url_scheme_args );
	} catch ( \Throwable $th ) {
		return false;
	}
	return $url_scheme->match_url( $url );
}

/**
 * Prepare URL scheme object.
 *
 * @since 0.1.0
 *
 * @param array|UrlScheme $url_scheme_args
 *
 * @return UrlScheme
 */
function hrt_prepare_url_scheme( $url_scheme_args ) {
	if ( $url_scheme_args instanceof UrlScheme ) {
		/**
		 * Fires before returning the prepared URL scheme object.
		 *
		 * Hook: hrt_prepared_url_scheme
		 *
		 * @since 0.1.0
		 *
		 * @param UrlScheme $url_scheme The prepared URL scheme object.
		 */
		return apply_filters( 'hrt_prepared_url_scheme', $url_scheme_args );
	}

	$url_scheme = null;

	try {
		$url_scheme = hrt( "url-scheme.{$url_scheme_args['type']}" );
	} catch ( \Throwable $th ) {
		// TODO Put logger.
	}
	$url_scheme = apply_filters( 'hrt_prepare_url_scheme', $url_scheme, $url_scheme_args['type'], $url_scheme_args );

	if ( is_null( $url_scheme ) ) {
		// TODO Put logger.
		throw __( 'URL scheme type could not be found!', 'hrt' );
	}
	if ( ! $url_scheme instanceof UrlScheme ) {
		// TODO Put logger.
		throw __( 'Invalid URL scheme object! It must extend the abstract class HRT\UrlSchemes\UrlScheme', 'hrt' );
	}

	$url_scheme->set_data( $url_scheme_args );

	/**
	 * Fires before returning the prepared URL scheme object.
	 *
	 * Hook: hrt_prepared_url_scheme
	 *
	 * @since 0.1.0
	 *
	 * @param UrlScheme $url_scheme The prepared URL scheme object.
	 * @param array $url_scheme_args Given url scheme args.
	 */
	return apply_filters( 'hrt_prepared_url_scheme', $url_scheme, $url_scheme_args );
}
