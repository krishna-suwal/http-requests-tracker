<?php
/**
 * RegexUrlScheme class.
 *
 * @package HRT\UrlSchemes
 *
 * @since 0.1.0
 */

namespace HRT\UrlSchemes;

defined( 'ABSPATH' ) || exit;

class RegexUrlScheme extends UrlScheme {
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
		$regex = $this->get( 'regex' );

		if ( empty( $regex ) ) {
			if ( empty( $url ) ) {
				return true;
			}
			return false;
		}
		$is_matched = ! ! preg_match( '/' . $regex . '/', $url );

		return apply_filters( 'hrt_match_regex', $is_matched, $this );
	}
}
