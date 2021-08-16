<?php
/**
 * URL class.
 *
 * @package HRT
 *
 * @since 0.1.0
 */

namespace HRT;

use Wa72\Url\Url as UrlLib;

defined( 'ABSPATH' ) || exit;

class URL extends UrlLib {
	public function get_original_url() {
		return $this->original_url;
	}
}
