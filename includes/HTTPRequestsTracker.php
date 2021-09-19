<?php
/**
 * Main class.
 *
 * @package HRT
 *
 * @since 0.1.0
 */

namespace HRT;

use HRT\Permissions\PermissionsList;
use HRT\RestAPI\Routes\RoutesRegistrar;

defined( 'ABSPATH' ) || exit;

/**
 * Main class.
 *
 * @since 0.1.0
 */
class HTTPRequestsTracker {

	/**
	 * Constructor.
	 *
	 * @since 0.1.0
	 */
	public function __construct() {
		$this->init();
	}

	/**
	 * Get applicaiton version.
	 *
	 * @since 0.1.0
	 *
	 * @return string
	 */
	public function version() {
		return HRT_VERSION;
	}

	/**
	 * Initialize the applicaiton.
	 *
	 * @since 0.1.0
	 */
	protected function init() {
		// Initilize the hooks.
		$this->init_hooks();

		DBLogger::init();
		Activation::init();
		Deactivation::init();
		PermissionsList::register_all();
		RoutesRegistrar::init();
		ScriptStyle::init();
		AdminMenu::init();
	}

	/**
	 * Initialize hooks.
	 *
	 * @since 0.1.0
	 */
	protected function init_hooks() {
		add_action( 'init', array( $this, 'init_hook_handler' ), 0 );

		add_filter( 'plugin_row_meta', array( $this, 'add_plugin_links' ), 10, 2 );
		add_filter( 'plugin_action_links_' . Constants::get( 'HRT_PLUGIN_BASENAME' ), array( $this, 'add_plugin_action_links' ) );
		add_action( 'in_admin_header', array( $this, 'hide_admin_notices' ) );
	}

	/**
	 * Initialization after WordPress is initialized.
	 *
	 * @since 0.1.0
	 */
	public function init_hook_handler() {
		Install::init();

		$this->load_text_domain();
	}

	/**
	 * Load plugin textdomain.
	 *
	 * @since 0.1.0
	 */
	public function load_text_domain() {
		load_plugin_textdomain(
			'hrt',
			false,
			dirname( plugin_basename( Constants::get( 'HRT_PLUGIN_FILE' ) ) ) . '/' . Constants::get( 'HRT_PLUGIN_REL_LANGUAGES_PATH' )
		);
	}

	/**
	 * Add plugin links on the plugins screen.
	 *
	 * @since 0.1.0
	 *
	 * @param mixed $links Plugin Row Meta.
	 * @param mixed $file  Plugin Base file.
	 *
	 * @return array
	 */
	public static function add_plugin_links( $links, $file ) {
		if ( Constants::get( 'HRT_PLUGIN_BASENAME' ) !== $file ) {
			return $links;
		}

		$hrt_links = array(
			'docs'    => array(
				'url'        => apply_filters( 'hrt_docs_url', 'https://krishna-suwal.github.io/http-requests-tracker/getting-started/' ),
				'label'      => __( 'Docs', 'hrt' ),
				'aria-label' => __( 'View hrt documentation', 'hrt' ),
			),
			'support' => array(
				'url'        => apply_filters( 'hrt_community_support_url', 'https://wordpress.org/support/plugin/http-requests-tracker/' ),
				'label'      => __( 'Community Support', 'hrt' ),
				'aria-label' => __( 'Visit community forums', 'hrt' ),
			),
		);

		foreach ( $hrt_links as $key => $link ) {
			$links[ $key ] = sprintf(
				'<a href="%s" aria-label="%s">%s</a>',
				esc_url( $link['url'] ),
				esc_attr( $link['aria-label'] ),
				esc_html( $link['label'] )
			);
		}

		return $links;
	}

	/**
	 * Add action links on the plugins screen.
	 *
	 * @since 0.1.0
	 *
	 * @param mixed $links Plugin Action links.
	 *
	 * @return array
	 */
	public static function add_plugin_action_links( $links ) {
		$action_links      = array(
			'settings' => array(
				'url'        => admin_url( 'admin.php?page=hrt#/settings' ),
				'label'      => __( 'Settings', 'hrt' ),
				'aria-label' => __( 'View hrt settings', 'hrt' ),
			),
		);
		$action_link_htmls = array();

		foreach ( $action_links as $key => $link ) {
			$action_link_htmls[ $key ] = sprintf(
				'<a href="%s" aria-label="%s">%s</a>',
				esc_url( $link['url'] ),
				esc_attr( $link['aria-label'] ),
				esc_html( $link['label'] )
			);
		}

		return array_merge( $action_link_htmls, $links );
	}

	/**
	 * Hide admin notices from the plugin's admin screens.
	 *
	 * @since 0.1.0
	 */
	public function hide_admin_notices() {
		// Bail if we're not on the plugin's screen or page.
		if ( empty( $_REQUEST['page'] ) || false === strpos( sanitize_text_field( wp_unslash( $_REQUEST['page'] ) ), 'hrt' ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return;
		}

		global $wp_filter;
		$ignore_notices = array();

		foreach ( array( 'user_admin_notices', 'admin_notices', 'all_admin_notices' ) as $wp_notice ) {
			if ( empty( $wp_filter[ $wp_notice ] ) ) {
				continue;
			}

			$hook_callbacks = $wp_filter[ $wp_notice ]->callbacks;

			if ( empty( $hook_callbacks ) || ! is_array( $hook_callbacks ) ) {
				continue;
			}

			foreach ( $hook_callbacks as $priority => $hooks ) {
				foreach ( $hooks as $name => $callback ) {
					if ( ! empty( $name ) && in_array( $name, $ignore_notices, true ) ) {
						continue;
					}
					if (
						! empty( $callback['function'] ) &&
						! is_a( $callback['function'], '\Closure' ) &&
						isset( $callback['function'][0], $callback['function'][1] ) &&
						is_object( $callback['function'][0] ) &&
						in_array( $callback['function'][1], $ignore_notices, true )
					) {
						continue;
					}
					unset( $wp_filter[ $wp_notice ]->callbacks[ $priority ][ $name ] );
				}
			}
		}
	}
}
