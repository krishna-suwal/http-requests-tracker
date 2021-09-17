<?php
/**
 * Helper functions related to scheme.
 *
 * @since 0.1.0
 */

use HRT\UrlSchemes\UrlScheme;

/**
 * Match a url with a scheme.
 *
 * @since 0.1.0
 *
 * @param string $url
 * @param array|UrlScheme $scheme_args
 *
 * @return boolean
 */
function hrt_match_scheme( $url, $scheme_args ) {
	try {
		$scheme = hrt_prepare_scheme( $scheme_args );
	} catch ( \Throwable $th ) {
		return false;
	}
	return $scheme->match_url( $url );
}

/**
 * Prepare scheme object.
 *
 * @since 0.1.0
 *
 * @param array|UrlScheme $scheme_args
 *
 * @return UrlScheme
 */
function hrt_prepare_scheme( $scheme_args ) {
	if ( $scheme_args instanceof UrlScheme ) {
		/**
		 * Fires before returning the prepared scheme object.
		 *
		 * Hook: hrt_prepared_scheme
		 *
		 * @since 0.1.0
		 *
		 * @param UrlScheme $scheme The prepared scheme object.
		 */
		return apply_filters( 'hrt_prepared_scheme', $scheme_args );
	}

	$scheme = null;

	try {
		$scheme = hrt( "url-scheme.{$scheme_args['type']}" );
	} catch ( \Throwable $e ) {
		// TODO Put logger.
		$e->getMessage();
	}
	$scheme = apply_filters( 'hrt_prepare_scheme', $scheme, $scheme_args['type'], $scheme_args );

	if ( is_null( $scheme ) ) {
		// TODO Put logger.
		throw __( 'Scheme type could not be found!', 'hrt' );
	}
	if ( ! $scheme instanceof UrlScheme ) {
		// TODO Put logger.
		throw __( 'Invalid scheme object! It must extend the abstract class HRT\UrlSchemes\UrlScheme', 'hrt' );
	}

	$scheme->set_data( $scheme_args );

	/**
	 * Fires before returning the prepared scheme object.
	 *
	 * Hook: hrt_prepared_scheme
	 *
	 * @since 0.1.0
	 *
	 * @param UrlScheme $scheme The prepared scheme object.
	 * @param array $scheme_args Given scheme args.
	 */
	return apply_filters( 'hrt_prepared_scheme', $scheme, $scheme_args );
}
