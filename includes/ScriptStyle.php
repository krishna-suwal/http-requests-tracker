<?php
/**
 * ScriptStyle class.
 *
 * @package HRT
 *
 * @since 0.1.0
 */

namespace HRT;

defined( 'ABSPATH' ) || exit;

class ScriptStyle {

	/**
	 * Scripts.
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	public static $scripts = array();

	/**
	 * Styles.
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	public static $styles = array();

	/**
	 * Localized scripts.
	 *
	 * @since 0.1.0
	 *
	 * @var array
	 */
	public static $localized_scripts = array();

	/**
	 * Initialize the scripts.
	 *
	 * @since 0.1.0
	 *
	 * @return string
	 */
	private static function init_scripts() {
		$suffix = self::get_asset_suffix();

		self::$scripts = apply_filters(
			'hrt_enqueue_scripts',
			array(
				'dependencies'   => array(
					'src'      => self::get_asset_url( "/assets/js/build/hrt-dependencies{$suffix}.js" ),
					'context'  => array( 'admin', 'public' ),
					'callback' => 'hrt_is_backend',
				),
				'backend'        => array(
					'src'      => self::get_asset_url( "/assets/js/build/hrt-backend{$suffix}.js" ),
					'deps'     => array( 'react', 'wp-components', 'wp-element', 'wp-i18n', 'wp-polyfill' ),
					'context'  => 'admin',
					'callback' => 'hrt_is_backend',
				),
				'timeout-logger' => array(
					'src'     => self::get_asset_url( "/assets/js/timeout-logger{$suffix}.js" ),
					'deps'    => array( 'jquery' ),
					'version' => self::get_version(),
					'context' => 'public',
				),
			)
		);
	}

	/**
	 * Initialize the styles.
	 *
	 * @since 0.1.0
	 *
	 * @return array
	 */
	private static function init_styles() {
		self::$styles = apply_filters(
			'hrt_enqueue_styles',
			array()
		);
	}

	/**
	 * Localize admin scripts.
	 *
	 * @since 0.1.1
	 */
	public static function localize_admin_scripts() {
		$current_user = array(
			'id'           => 0,
			'display_name' => __( 'Guest User', 'hrt' ),
			'avatar_url'   => '',
		);

		if ( is_user_logged_in() ) {
			$user         = wp_get_current_user();
			$current_user = array(
				'id'           => $user->ID,
				'display_name' => $user->display_name,
				'avatar_url'   => get_avatar_url( $user->ID ),
			);
		}

		self::$localized_scripts = apply_filters(
			'hrt_localized_scripts',
			array(
				'backend' => array(
					'name' => '_HRT_',
					'data' => array(
						'rootApiUrl'   => esc_url_raw( untrailingslashit( rest_url() ) ),
						'nonce'        => wp_create_nonce( 'wp_rest' ),
						'home_url'     => home_url(),
						'current_user' => $current_user,
					),
				),
			)
		);

		foreach ( self::$localized_scripts as $handle => $script ) {
			\wp_localize_script( "hrt-{$handle}", $script['name'], $script['data'] );
		}
	}

	/**
	 * Localize public scripts.
	 *
	 * @since 0.1.1
	 */
	public static function localize_public_scripts() {
		self::$localized_scripts = apply_filters(
			'hrt_localized_scripts',
			array(
				'timeout-logger' => array(
					'name' => 'hrt_data',
					'data' => array(
						'rootApiUrl' => esc_url_raw( untrailingslashit( rest_url() ) ),
						'nonce'      => wp_create_nonce( 'hrt-timeout-logger' ),
					),
				),
			)
		);

		foreach ( self::$localized_scripts as $handle => $script ) {
			\wp_localize_script( "hrt-{$handle}", $script['name'], $script['data'] );
		}
	}

	/**
	 * Initialization.
	 *
	 * @since 0.1.0
	 */
	public static function init() {
		self::init_hooks();
		self::init_scripts();
		self::init_styles();
	}

	/**
	 * Initialize hooks.
	 *
	 * @since 0.1.0
	 *
	 * @return void
	 */
	private static function init_hooks() {
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'load_public_scripts_styles' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'load_admin_scripts_styles' ) );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'localize_public_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'localize_admin_scripts' ) );
	}

	/**
	 * Get application version.
	 *
	 * @since 0.1.0
	 *
	 * @return string
	 */
	private static function get_version() {
		return Constants::get( 'HRT_VERSION' );
	}

	/**
	 * Get asset name suffix.
	 *
	 * @since 0.1.0
	 *
	 * @return array
	 */
	public static function get_asset_suffix() {
		if ( Constants::is_true( 'SCRIPT_DEBUG' ) ) {
			return '';
		}
		$version = Constants::get( 'HRT_VERSION' );

		return ".{$version}.min";
	}

	/**
	 * Get styles according to context.
	 *
	 * @since 0.1.0
	 *
	 * @param string $context Style/Script context (admin, public  none, etc.)
	 *
	 * @return array
	 */
	public static function get_styles( $context ) {
		// Set default values.
		$styles = array_map(
			function( $style ) {
				return array_replace_recursive( self::get_default_style_options(), $style );
			},
			self::$styles
		);

		// Filter according to admin or public static context.
		$styles = array_filter(
			$styles,
			function( $style ) use ( $context ) {
				return $style['context'] === $context;
			}
		);

		return $styles;
	}

	/**
	 * Get scripts.
	 *
	 * @since 0.1.0
	 *
	 * @param string $context Script context. (admin, public,static  none).
	 *
	 * @return array
	 */
	public static function get_scripts( $context ) {
		// Set default values.
		$scripts = array_map(
			function( $script ) {
				return array_replace_recursive( self::get_default_script_options(), $script );
			},
			self::$scripts
		);

		// Filter according to admin or public static context.
		$scripts = array_filter(
			$scripts,
			function( $script ) use ( $context ) {
				return in_array( $context, (array) $script['context'], true );
			}
		);

		return $scripts;
	}

	/**
	 * Default script options.
	 *
	 * @since 0.1.0
	 *
	 * @return array
	 */
	public static function get_default_script_options() {
		return apply_filters(
			'hrt_get_default_script_options',
			array(
				'src'           => '',
				'deps'          => array( 'jquery' ),
				'version'       => self::get_version(),
				'context'       => 'none',
				'in_footer'     => true,
				'register_only' => false,
				'callback'      => '',
			)
		);
	}

	/**
	 * Default style options.
	 *
	 * @since 0.1.0
	 *
	 * @return array
	 */
	public static function get_default_style_options() {
		return apply_filters(
			'hrt_get_default_style_options',
			array(
				'src'           => '',
				'deps'          => array(),
				'version'       => self::get_version(),
				'media'         => 'all',
				'has_rtl'       => false,
				'context'       => 'none',
				'in_footer'     => true,
				'register_only' => false,
				'callback'      => '',
			)
		);
	}

	/**
	 * Return asset URL.
	 *
	 * @since 0.1.0
	 *
	 * @param string $path Assets path.
	 *
	 * @return string
	 */
	private static function get_asset_url( $path ) {
		return apply_filters( 'hrt_get_asset_url', plugins_url( $path, Constants::get( 'HRT_PLUGIN_FILE' ) ), $path );
	}

	/**
	 * Register a script for use.
	 *
	 * @since 0.1.0
	 *
	 * @uses   wp_register_script()
	 * @param  string   $handle    Name of the script. Should be unique.
	 * @param  string   $path      Full URL of the script, or path of the script relative to the WordPress root directory.
	 * @param  string[] $deps      An array of registered script handles this script depends on.
	 * @param  string   $version   String specifying script version number, if it has one, which is added to the URL as a query string for cache busting purposes. If version is set to false, a version number is automatically added equal to current installed WordPress version. If set to null, no version is added.
	 * @param  boolean  $in_footer Whether to enqueue the script before </body> instead of in the <head>. Default 'false'.
	 */
	private static function register_script( $handle, $path, $deps = array( 'jquery' ), $version = '', $in_footer = true ) {
		wp_register_script( "hrt-{$handle}", $path, $deps, $version, $in_footer );
	}

	/**
	 * Register and enqueue a script for use.
	 *
	 * @since 0.1.0
	 *
	 * @uses   wp_enqueue_script()
	 * @param  string   $handle    Name of the script. Should be unique.
	 * @param  string   $path      Full URL of the script, or path of the script relative to the WordPress root directory.
	 * @param  string[] $deps      An array of registered script handles this script depends on.
	 * @param  string   $version   String specifying script version number, if it has one, which is added to the URL as a query string for cache busting purposes. If version is set to false, a version number is automatically added equal to current installed WordPress version. If set to null, no version is added.
	 * @param  boolean  $in_footer Whether to enqueue the script before </body> instead of in the <head>. Default 'false'.
	 */
	private static function enqueue_script( $handle, $path = '', $deps = array( 'jquery' ), $version = '', $in_footer = true ) {
		if ( ! in_array( $handle, self::$scripts, true ) && $path ) {
			wp_register_script( "hrt-{$handle}", $path, $deps, $version, $in_footer );
		}
		wp_enqueue_script( "hrt-{$handle}" );
	}

	/**
	 * Register a style for use.
	 *
	 *
	 * @since 0.1.0
	 *
	 * @uses   wp_register_style()
	 * @param  string   $handle  Name of the stylesheet. Should be unique.
	 * @param  string   $path    Full URL of the stylesheet, or path of the stylesheet relative to the WordPress root directory.
	 * @param  string[] $deps    An array of registered stylesheet handles this stylesheet depends on.
	 * @param  string   $version String specifying stylesheet version number, if it has one, which is added to the URL as a query string for cache busting purposes. If version is set to false, a version number is automatically added equal to current installed WordPress version. If set to null, no version is added.
	 * @param  string   $media   The media for which this stylesheet has been defined. Accepts media types like 'all', 'print' and 'screen', or media queries like '( orientation: portrait )' and '( max-width: 640px )'.
	 * @param  boolean  $has_rtl If has RTL version to load too.
	 */
	private static function register_style( $handle, $path, $deps = array(), $version = '', $media = 'all', $has_rtl = false ) {
		self::$styles[] = $handle;
		wp_register_style( "hrt-{$handle}", $path, $deps, $version, $media );

		if ( $has_rtl ) {
			wp_style_add_data( "hrt-{$handle}", 'rtl', 'replace' );
		}
	}

	/**
	 * Register and enqueue a styles for use.
	 *
	 * @since 0.1.0
	 *
	 * @uses   wp_enqueue_style()
	 * @param  string   $handle  Name of the stylesheet. Should be unique.
	 * @param  string   $path    Full URL of the stylesheet, or path of the stylesheet relative to the WordPress root directory.
	 * @param  string[] $deps    An array of registered stylesheet handles this stylesheet depends on.
	 * @param  string   $version String specifying stylesheet version number, if it has one, which is added to the URL as a query string for cache busting purposes. If version is set to false, a version number is automatically added equal to current installed WordPress version. If set to null, no version is added.
	 * @param  string   $media   The media for which this stylesheet has been defined. Accepts media types like 'all', 'print' and 'screen', or media queries like '( orientation: portrait )' and '( max-width: 640px )'.
	 * @param  boolean  $has_rtl If has RTL version to load too.
	 */
	private static function enqueue_style( $handle, $path = '', $deps = array(), $version = '', $media = 'all', $has_rtl = false ) {
		if ( ! in_array( $handle, self::$styles, true ) && $path ) {
			self::register_style( $handle, $path, $deps, $version, $media, $has_rtl );
		}
		wp_enqueue_style( "hrt-{$handle}" );
	}

	/**
	 * Load public static scripts and styles.
	 *
	 * @since 0.1.0
	 */
	public static function load_public_scripts_styles() {
		$scripts = self::get_scripts( 'public' );
		$styles  = self::get_styles( 'public' );

		foreach ( $scripts as $handle => $script ) {
			if ( true === (bool) $script['register_only'] ) {
				self::register_script( $handle, $script['src'], $script['deps'], $script['version'] );
				continue;
			}

			if ( empty( $script['callback'] ) ) {
				self::enqueue_script( $handle, $script['src'], $script['deps'], $script['version'] );
			} elseif ( is_callable( $script['callback'] ) && call_user_func_array( $script['callback'], array() ) ) {
				self::enqueue_script( $handle, $script['src'], $script['deps'], $script['version'] );
			}
		}

		foreach ( $styles as $handle => $style ) {
			if ( true === (bool) $style['register_only'] ) {
				self::register_style( $handle, $style['src'], $style['deps'], $style['version'], $style['media'], $style['has_rtl'] );
				continue;
			}

			if ( empty( $style['callback'] ) ) {
				self::enqueue_style( $handle, $style['src'], $style['deps'], $style['version'], $style['media'], $style['has_rtl'] );
			} elseif ( is_callable( $style['callback'] ) && call_user_func_array( $style['callback'], array() ) ) {
				self::enqueue_style( $handle, $style['src'], $style['deps'], $style['version'], $style['media'], $style['has_rtl'] );
			}
		}
	}

	/**
	 * Load public static scripts and styles.
	 *
	 * @since 0.1.1
	 */
	public static function load_admin_scripts_styles() {
		$scripts = self::get_scripts( 'admin' );
		$styles  = self::get_styles( 'admin' );

		foreach ( $scripts as $handle => $script ) {
			if ( true === (bool) $script['register_only'] ) {
				self::register_script( $handle, $script['src'], $script['deps'], $script['version'] );
				continue;
			}

			if ( empty( $script['callback'] ) ) {
				self::enqueue_script( $handle, $script['src'], $script['deps'], $script['version'] );
			} elseif ( is_callable( $script['callback'] ) && call_user_func_array( $script['callback'], array() ) ) {
				self::enqueue_script( $handle, $script['src'], $script['deps'], $script['version'] );
			}
		}

		foreach ( $styles as $handle => $style ) {
			if ( true === (bool) $style['register_only'] ) {
				self::register_style( $handle, $style['src'], $style['deps'], $style['version'], $style['media'], $style['has_rtl'] );
				continue;
			}

			if ( empty( $style['callback'] ) ) {
				self::enqueue_style( $handle, $style['src'], $style['deps'], $style['version'], $style['media'], $style['has_rtl'] );
			} elseif ( is_callable( $style['callback'] ) && call_user_func_array( $style['callback'], array() ) ) {
				self::enqueue_style( $handle, $style['src'], $style['deps'], $style['version'], $style['media'], $style['has_rtl'] );
			}
		}

		if ( function_exists( 'wp_set_script_translations' ) ) {
			wp_set_script_translations( 'hrt-backend', 'hrt', Constants::get( 'HRT_LANGUAGES' ) );
		}
	}
}
