<?php
/**
 * AbsoluteUrlScheme class.
 *
 * @package HRT\UrlSchemes
 *
 * @since 0.1.0
 */

namespace HRT\UrlSchemes;

use HRT\URL;

defined( 'ABSPATH' ) || exit;

class AbsoluteUrlScheme extends UrlScheme {
	/**
	 * Get scheme URL.
	 *
	 * @since 0.1.0
	 *
	 * @return URL
	 */
	public function get_url() {
		return new URL( $this->get( 'url' ) );
	}

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
		$is_matched = $this->get_url()->equals( new URL( $url ) );

		return apply_filters( 'hrt_match_regex', $is_matched, $this );
	}
}
