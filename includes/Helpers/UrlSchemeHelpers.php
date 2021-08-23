<?php
/**
 * Helper functions related to Url scheme.
 *
 * @since 0.1.0
 */

use HRT\UrlSchemes\UrlScheme;

/**
 * Get URL scheme type slugs.
 *
 * @since 0.1.0
 *
 * @return array
 */
function hrt_get_url_scheme_type_slugs() {
	return apply_filters(
		'hrt_url_scheme_type_slugs',
		array(
			'regex',
			'absolute',
			'relative',
			'only_url_args',
			'predefined',
		)
	);
}

/**
 * Get URL scheme types.
 *
 * @since 0.1.0
 *
 * @return array
 */
function hrt_get_url_scheme_types() {
	return apply_filters(
		'hrt_url_scheme_types',
		array(
			array(
				'type'  => 'regex',
				'label' => __( 'Regular Expression', 'hrt' ),
			),
			array(
				'type'  => 'absolute',
				'label' => __( 'Absolute URL', 'hrt' ),
			),
			array(
				'type'  => 'relative',
				'label' => __( 'Relative URL', 'hrt' ),
			),
			array(
				'type'  => 'only_url_args',
				'label' => __( 'Only Url Args', 'hrt' ),
			),
			array(
				'type'  => 'predefined',
				'label' => __( 'Predefined', 'hrt' ),
			),
		)
	);
}

/**
 * Get URL schemes.
 *
 * @since 0.1.0
 *
 * @return array
 */
function hrt_get_url_schemes() {
	return (array) apply_filters(
		'hrt_url_schemes',
		array_map( 'hrt_prepare_url_scheme', hrt_get_url_schemes_raw() )
	);
}

/**
 * Get raw(array) of url schemes.
 *
 * @since 0.1.0
 *
 * @return array
 */
function hrt_get_url_schemes_raw() {
	$setting_value = get_option( 'hrt.settings.url_schemes' );
	$schemes       = array();

	if ( is_string( $setting_value ) ) {
		try {
			$schemes = (array) json_decode( $setting_value, true );
		} catch ( \Throwable $e ) {
			// TODO log error.
			error_log( $e->getMessage() );
		}
	}
	$schemes = (array) apply_filters( 'hrt_url_schemes_raw', $schemes );

	return array_filter(
		$schemes,
		function( $scheme ) {
			return is_array( $scheme ) && ! empty( $scheme['type'] );
		}
	);
}

/**
 * Update URL schemes.
 *
 * @since 0.1.0
 *
 * @param array $schemes
 *
 * @return boolean
 */
function hrt_update_url_schemes( $schemes ) {
	$schemes = array_filter(
		(array) $schemes,
		function( $scheme ) {
			return is_array( $scheme ) && ! empty( $scheme['type'] );
		}
	);
	$schemes = apply_filters( 'hrt_before_save_url_schemes', $schemes );

	try {
		$schemes_string = wp_json_encode( $schemes );
	} catch ( \Throwable $e ) {
		// TODO log error.
		error_log( $e->getMessage() );
		return false;
	}

	return update_option( 'hrt.settings.url_schemes', $schemes_string );
}

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
