<?php
/**
 * Plugin Name:     HTTP Requests Tracker
 * Plugin URI:      https://krishna-suwal.github.io/http-requests-tracker
 * Description:     Track http requests.
 * Author:          Krishna Suwal
 * Author URI:      https://github.com/krishna-suwal
 * Version:         0.1.0
 * Text Domain:     hrt
 * Domain Path:     /i18n/languages
 * License: GNU General Public License v3.0
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
 */

defined( 'ABSPATH' ) || exit;

define( 'HRT_SLUG', 'hrt' );
define( 'HRT_VERSION', '0.1.0' );
define( 'HRT_PLUGIN_FILE', __FILE__ );
define( 'HRT_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
define( 'HRT_PLUGIN_DIR', dirname( __FILE__ ) );
define( 'HRT_ASSETS', dirname( __FILE__ ) . '/assets' );
define( 'HRT_TEMPLATES', dirname( __FILE__ ) . '/templates' );
define( 'HRT_LANGUAGES', dirname( __FILE__ ) . '/i18n/languages' );
define( 'HRT_PLUGIN_REL_LANGUAGES_PATH', 'i18n/languages' );

/**
 * Include the autoloader.
 *
 * @since 0.1.0
 */
require_once dirname( __FILE__ ) . '/vendor/autoload.php';

/**
 * Bootstrap the appplication.
 *
 * @since 0.1.0
 */
require_once dirname( __FILE__ ) . '/bootstrap/app.php';

/**
 * Return the service provider.
 *
 * @since 0.1.0
 *
 * @param string $class Class name or alias.
 *
 * @return HRT\HTTPRequestsTracker|mixed
 */
function hrt( $class = 'app' ) {
	return empty( $class ) ? $GLOBALS['hrt'] : $GLOBALS['hrt']->get( $class );
}

hrt();
