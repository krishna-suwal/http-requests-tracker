<?php
/**
 * OnlyUrlArgsUrlScheme class.
 *
 * @package HRT\UrlSchemes
 *
 * @since 0.1.0
 */

namespace HRT\UrlSchemes;

defined( 'ABSPATH' ) || exit;

class OnlyUrlArgsUrlScheme extends UrlScheme {
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
		return false;
	}
}
