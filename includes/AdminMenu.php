<?php
/**
 * Admin menus.
 *
 * @package HRT
 *
 * @since 0.1.0
 */

namespace HRT;

defined( 'ABSPATH' ) || exit;

class AdminMenu {

	/**
	 * Initialize.
	 *
	 * @since 0.1.0
	 *
	 * @return void
	 */
	public static function init() {
		self::init_hooks();
	}

	/**
	 * Initialize admin menus.
	 *
	 * @since 0.1.0
	 *
	 * @return void
	 */
	public static function init_menus() {
		$dashicon = 'dashicons-admin-links';

		// phpcs:disable
		if ( isset( $_GET['page'] ) && 'hrt' === $_GET['page'] ) {
			$dashicon = 'data:image/svg+xml;base64,' . base64_encode( hrt_get_svg( 'dashicon-white' ) );
		} else {
			$dashicon = 'data:image/svg+xml;base64,' . base64_encode( hrt_get_svg( 'dashicon-grey' ) );
		}
		// phpcs:enable

		add_menu_page(
			esc_html__( 'HTTP Requests Tracker', 'hrt' ),
			esc_html__( 'HTTP Requests Tracker', 'hrt' ),
			'manage_options',
			'hrt',
			array( __CLASS__, 'display_main_page' ),
			$dashicon,
			3
		);

		add_submenu_page(
			'hrt',
			esc_html__( 'Stats', 'hrt' ),
			esc_html__( 'Stats', 'hrt' ),
			'manage_options',
			'hrt#/stats',
			array( __CLASS__, 'display_main_page' )
		);

		add_submenu_page(
			'hrt',
			esc_html__( 'Schemes', 'hrt' ),
			esc_html__( 'Schemes', 'hrt' ),
			'manage_options',
			'hrt#/schemes',
			array( __CLASS__, 'display_main_page' )
		);

		add_submenu_page(
			'hrt',
			esc_html__( 'Settings', 'hrt' ),
			esc_html__( 'Settings', 'hrt' ),
			'manage_options',
			'hrt#/settings',
			array( __CLASS__, 'display_main_page' )
		);

		remove_submenu_page( 'hrt', 'hrt' );
	}

	/**
	 * Initialize hooks.
	 *
	 * @since 0.1.0
	 *
	 * @return void
	 */
	private static function init_hooks() {
		add_action( 'admin_menu', array( __CLASS__, 'init_menus' ) );
	}

	/**
	 * Display main page.
	 *
	 * @since 0.1.0
	 *
	 * @return void
	 */
	public static function display_main_page() {
		require_once Constants::get( 'HRT_PLUGIN_DIR' ) . '/templates/backend.php';
	}
}
