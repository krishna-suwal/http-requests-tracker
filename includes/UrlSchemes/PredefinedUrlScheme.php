<?php
/**
 * PredefinedUrlScheme class.
 *
 * @package HRT\UrlSchemes
 *
 * @since 0.1.0
 */

namespace HRT\UrlSchemes;

defined( 'ABSPATH' ) || exit;

class PredefinedUrlScheme extends UrlScheme {
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
		$type       = $this->get( 'predefined_type' );
		$callbacks  = array(
			'ajax' => array( $this, 'is_ajax_request' ),
		);
		$is_matched = false;

		if ( isset( $callbacks[ $type ] ) ) {
			$is_matched = $callbacks[ $type ]();
		}
		return apply_filters( 'hrt_match_predefined', $is_matched, $this );
	}

	/**
	 * Check if the current request is ajax request.
	 *
	 * @since 0.1.0
	 *
	 * @return boolean
	 */
	protected function is_ajax_request() {
		if ( function_exists( 'wp_doing_ajax' ) ) {
			return wp_doing_ajax() || ( defined( 'DOING_AJAX' ) && DOING_AJAX );
		}
		return defined( 'DOING_AJAX' ) && DOING_AJAX;
	}
}
