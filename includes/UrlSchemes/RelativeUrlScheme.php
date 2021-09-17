<?php
/**
 * RelativeUrlScheme class.
 *
 * @package HRT\UrlSchemes
 *
 * @since 0.1.0
 */

namespace HRT\UrlSchemes;

use HRT\URL;

defined( 'ABSPATH' ) || exit;

class RelativeUrlScheme extends UrlScheme {
	/**
	 * Match URL with this scheme.
	 *
	 * @since 0.1.0
	 *
	 * @param string $url
	 *
	 * @return boolean
	 */
	public function match_url( $url ) {
		$given_url   = URL::parse( $this->get( 'url' ) );
		$request_url = URL::parse( $url );

		$given_url->makeAbsolute( $request_url );

		$is_matched = $request_url->equalsPath( '/' . trim( $given_url->getPath(), '/' ) . '/' );

		return apply_filters( 'hrt_match_relative', $is_matched, $this );
	}
}
