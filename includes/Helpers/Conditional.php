<?php
/**
 * Conditional functions.
 *
 * @since 0.1.0
 */

/**
 * Is backend page.
 *
 * @since 0.1.0
 *
 * @return bool
 */
function hrt_is_backend() {
	if ( ! is_admin() ) {
		return false;
	}

	$screen = get_current_screen();
	return 'toplevel_page_hrt' === $screen->id ? true : false;
}
